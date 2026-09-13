const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
let now=0,queries=[],rows=[],fail=false;
const pk='CERT#SAA-C03#SERVICE#config';
const row=(id,status='published')=>({PK:pk,SK:id,questionId:id,publicationStatus:status,correct:'A',question:'Private question'});
const mocks={'server-only':{},'@aws-sdk/client-dynamodb':{DynamoDBClient:class{}},'@aws-sdk/lib-dynamodb':{
 QueryCommand:class{constructor(input){this.input=input}},
 DynamoDBDocumentClient:{from:()=>({send:async({input})=>{
  queries.push(input);if(fail)throw Error('DynamoDB unavailable');
  assert.equal(input.ConsistentRead,true);
  if(input.ExpressionAttributeValues[':sk'])return {Items:rows.filter(r=>r.SK===input.ExpressionAttributeValues[':sk'])};
  // Simulate two DynamoDB pages, including a wholly retired first page.
  const offset=input.ExclusiveStartKey?.offset||0;
  const page=rows.slice(offset,offset+2).map(({PK,SK,questionId,publicationStatus})=>({PK,SK,questionId,publicationStatus}));
  return {Items:page,LastEvaluatedKey:offset+2<rows.length?{offset:offset+2}:undefined};
 }})}}};
function load(){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/question-bank.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2021}}).outputText,{exports,require:n=>mocks[n]||require(n),process:{env:{}},Date:class extends Date{static now(){return now}},Math:Object.assign(Object.create(Math),{random:()=>0})});return exports;}
(async()=>{
 const bank=load();rows=[row('r1','retired'),row('r2','draft'),row('a'),row('b')];
 // Concurrent callers share one metadata refresh but separately recheck their selected body.
 const first=await Promise.all([bank.selectBankQuestion('SAA-C03','config',new Set()),bank.selectBankQuestion('SAA-C03','config',new Set(['a']))]);
 assert.equal(first[0].question.questionId,'a');assert.equal(first[1].question.questionId,'b');
 assert.equal(queries.filter(q=>q.ProjectionExpression).length,2,'one two-page catalog refresh');
 // Shared metadata never includes the learner exclusion state or trusted answer content.
 assert.ok(queries.filter(q=>q.ProjectionExpression).every(q=>!q.ProjectionExpression.includes('correct')));
 queries=[];await bank.selectBankQuestion('SAA-C03','config',new Set());
 assert.equal(queries.length,1,'warm request only reads selected question');
 // Retirement after caching is rejected, with fallback to another eligible question.
 rows.find(r=>r.SK==='a').publicationStatus='retired';
 const retired=await bank.selectBankQuestion('SAA-C03','config',new Set());assert.equal(retired.question.questionId,'b');
 rows=rows.filter(r=>r.SK!=='b');
 assert.equal((await bank.selectBankQuestion('SAA-C03','config',new Set())).question,null,'deleted cached question is rejected');
 rows.push(row('new'));
 assert.equal((await bank.selectBankQuestion('SAA-C03','config',new Set())).question,null,'new publication waits for metadata expiry');
 now=30_001;assert.equal((await bank.selectBankQuestion('SAA-C03','config',new Set())).question.questionId,'new');
 // Errors fail closed, and a failed refresh is retried rather than cached.
 now+=30_001;fail=true;await assert.rejects(()=>bank.selectBankQuestion('SAA-C03','config',new Set()));
 fail=false;assert.equal((await bank.selectBankQuestion('SAA-C03','config',new Set())).question.questionId,'new');
 fail=true;await assert.rejects(()=>bank.selectBankQuestion('SAA-C03','config',new Set()));fail=false;
 // Keyset history pagination works beyond 1,000 entries even with a smaller server cap.
 const ids=Array.from({length:1205},(_,i)=>String(i).padStart(5,'0'));let calls=0;
 const supabase={from:table=>{assert.equal(table,'user_question_history');let after='';const filters={};const chain={select:()=>chain,eq:(k,v)=>{filters[k]=v;return chain},not:()=>chain,order:()=>chain,limit:()=>chain,gt:(k,v)=>{after=v;return chain},then:resolve=>{calls++;assert.equal(filters.user_id,'user-1');assert.equal(filters.certification,'SAA-C03');assert.equal(filters.service,'config');resolve({data:ids.filter(id=>id>after).slice(0,73).map(question_id=>({question_id}))})}};return chain}};
 const seen=await bank.getSeenQuestionIds(supabase,'user-1','SAA-C03','config');assert.equal(seen.size,1205);assert.ok(seen.has('01204'));assert.ok(calls>16);
 console.log('PASS: shared metadata refresh, warm single-item reads, retirement/deletion checks, TTL publication visibility, failure recovery, and 1,205-row scoped history pagination.');
})().catch(e=>{console.error(e);process.exitCode=1});
