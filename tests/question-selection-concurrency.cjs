// Local synthetic adapters only: no credentials, network, real learners, or paid generation.
// Exercises the actual next-question route and bank helper; does not measure hosted latency.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const { AsyncLocalStorage } = require('node:async_hooks');
const scope = new AsyncLocalStorage();
const pause = () => new Promise(resolve => setImmediate(resolve));
function load(path, mocks) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 },
  }).outputText, { exports, require: name => name in mocks ? mocks[name] : require(name),
    process: { env: {} }, Response, console: { error() {} } });
  return exports;
}
async function cohort(concurrency) {
  const stats = { catalogQueries: 0, exactQueries: 0, historyQueries: 0, issuances: 0 };
  const pk = 'CERT#SAA-C03#SERVICE#config';
  // Same record-count distribution as the saved Config partition; content is synthetic.
  const rows = Array.from({ length: 56 }, (_, i) => ({ PK: pk, SK: `key-${i}`,
    questionId: `z-question-${i}`, publicationStatus: i < 50 ? 'retired' : 'published',
    question: `Synthetic scenario ${i}`, options: { A: 'a', B: 'b', C: 'c', D: 'd' },
    correct: 'B', explanation: { correct: 'Private synthetic feedback' }, examTip: 'Private tip',
  }));
  const clients = new Map();
  for (let i = 0; i < concurrency; i++) {
    const userId = `synthetic-${i}`;
    const answered = `z-question-${50 + i % 6}`;
    const history = [...Array.from({ length: 1204 }, (_, j) => `history-${String(j).padStart(5, '0')}`), answered];
    clients.set(userId, { answered, auth: { getUser: async () => ({ data: { user: { id: userId } } }) },
      from: table => {
        assert.equal(table, 'user_question_history');
        const filters = {}; let after = '';
        const query = {
          select: () => query, not: () => query, order: () => query, limit: () => query,
          eq: (key, value) => { filters[key] = value; return query; },
          gt: (key, value) => { after = value; return query; },
          then: async resolve => {
            await pause(); stats.historyQueries++;
            assert.equal(filters.user_id, userId);
            assert.equal(filters.certification, 'SAA-C03'); assert.equal(filters.service, 'config');
            resolve({ data: history.filter(id => id > after).slice(0, 73).map(question_id => ({ question_id })) });
          },
        };
        return query;
      },
    });
  }
  const bank = load('lib/question-bank.ts', {
    'server-only': {}, '@aws-sdk/client-dynamodb': { DynamoDBClient: class {} },
    '@aws-sdk/lib-dynamodb': {
      QueryCommand: class { constructor(input) { this.input = input; } },
      DynamoDBDocumentClient: { from: () => ({ send: async ({ input }) => {
        await pause(); assert.equal(input.ConsistentRead, true);
        assert.equal(input.ExpressionAttributeValues[':pk'], pk);
        if (input.ExpressionAttributeValues[':sk']) {
          stats.exactQueries++;
          return { Items: rows.filter(row => row.SK === input.ExpressionAttributeValues[':sk']) };
        }
        stats.catalogQueries++;
        const offset = input.ExclusiveStartKey?.offset || 0;
        return { Items: rows.slice(offset, offset + 28).map(({ PK, SK, questionId, publicationStatus }) =>
          ({ PK, SK, questionId, publicationStatus })),
          LastEvaluatedKey: offset === 0 ? { offset: 28 } : undefined };
      } }) },
    },
  });
  const route = load('app/api/question/next/route.ts', {
    '@/lib/question-bank': bank,
    '@/lib/supabase/server': { createClient: async () => clients.get(scope.getStore()) },
    '@/lib/services': { getServiceById: () => ({ id: 'config', certifications: ['SAA-C03'] }) },
    '@/lib/issued-question': { issueQuestion: async (userId, service, cert, question) => {
      await pause(); stats.issuances++;
      assert.equal(userId, scope.getStore(), 'issuance belongs to the authenticated caller');
      assert.equal(service, 'config'); assert.equal(cert, 'SAA-C03');
      assert.equal(question.publicationStatus, 'published');
      assert.notEqual(question.questionId, clients.get(userId).answered, 'history beyond the first page excludes the answered question');
      return { issuanceId: `synthetic-issuance-${stats.issuances}`, questionId: question.questionId,
        question: question.question, options: question.options };
    } },
    'next/server': { NextResponse: { json: Response.json } },
  });
  const waves = [];
  for (let wave = 0; wave < 3; wave++) {
    const before = { ...stats };
    await Promise.all([...clients.keys()].map(userId => scope.run(userId, async () => {
      const response = await route.GET({ nextUrl: new URL('https://synthetic.invalid/api/question/next?service=config&certification=SAA-C03') });
      assert.equal(response.status, 200); assert.equal(response.headers.get('cache-control'), 'private, no-store');
      const body = await response.json(); assert.equal(body.totalQuestions, 6); assert.equal(body.remainingQuestions, 5);
      for (const key of ['correct', 'explanation', 'examTip', 'PK', 'SK', 'publicationStatus']) assert.ok(!(key in body));
    })));
    const delta = Object.fromEntries(Object.keys(stats).map(key => [key, stats[key] - before[key]]));
    assert.equal(delta.catalogQueries, wave === 0 ? 2 : 0);
    assert.equal(delta.exactQueries, concurrency); assert.equal(delta.issuances, concurrency);
    waves.push({ cache: wave === 0 ? 'cold-shared-process' : 'warm-shared-process', ...delta });
  }
  return { concurrentRequests: concurrency, waves };
}
(async () => {
  const cohorts = [];
  for (const size of [10, 50, 100]) cohorts.push(await cohort(size));
  console.log(JSON.stringify({ kind: 'local-synthetic-concurrency', hostedCapacityMeasured: false,
    networkCalls: 0, requests: 480, fixture: { partitionRecords: 56, eligible: 6, historyRowsPerUser: 1205, historyPageCap: 73 },
    cohorts, limits: ['One application process per cohort; real hosting instances do not share this cache.',
      'Adapters simulate DynamoDB and Supabase; no real network latency, database isolation, RLS, billing, or authentication tested.',
      'Issuance is checked through a synthetic adapter; real transactional submission is outside this test.',
      'Call counts are not DynamoDB consumed-capacity or supported-user estimates.'] }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
