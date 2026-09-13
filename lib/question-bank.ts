import 'server-only'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { GeneratedQuestion } from '@/lib/generated-question'

const client = DynamoDBDocumentClient.from(new DynamoDBClient({
  region: process.env.DYNAMODB_REGION || process.env.AWS_REGION || 'us-east-2',
}))
const table = process.env.DYNAMODB_TABLE_NAME || 'exam-questions'
const TTL_MS = 30_000
const MAX_CATALOGS = 128

type Candidate = { PK: string; SK: string; questionId: string }
type BankQuestion = GeneratedQuestion & { questionId: string; topic?: string }
type Catalog = { expiresAt: number; pending: Promise<Candidate[]> }
// Process-local, metadata only. Never cache learner history or private question bodies.
const catalogs = new Map<string, Catalog>()
const isPublished = (item: Record<string, unknown>) =>
  item.publicationStatus === undefined || item.publicationStatus === 'published'

async function readCatalog(pk: string): Promise<Candidate[]> {
  const candidates: Candidate[] = []
  let cursor: Record<string, any> | undefined
  do {
    const response = await client.send(new QueryCommand({
      TableName: table,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: { ':pk': pk },
      ProjectionExpression: 'PK, SK, questionId, publicationStatus',
      ConsistentRead: true,
      ExclusiveStartKey: cursor,
    }))
    for (const item of response.Items || []) {
      if (isPublished(item) && typeof item.SK === 'string' && typeof item.questionId === 'string') {
        candidates.push({ PK: pk, SK: item.SK, questionId: item.questionId })
      }
    }
    cursor = response.LastEvaluatedKey
  } while (cursor)
  return candidates
}

function getCatalog(pk: string): Promise<Candidate[]> {
  const cached = catalogs.get(pk)
  if (cached && cached.expiresAt > Date.now()) return cached.pending
  catalogs.delete(pk)
  while (catalogs.size >= MAX_CATALOGS) catalogs.delete(catalogs.keys().next().value!)
  // TTL starts before the read, so a slow refresh cannot extend stale metadata's life.
  const entry: Catalog = { expiresAt: Date.now() + TTL_MS, pending: readCatalog(pk) }
  catalogs.set(pk, entry)
  void entry.pending.catch(() => {
    if (catalogs.get(pk) === entry) catalogs.delete(pk)
  })
  return entry.pending
}

export async function getSeenQuestionIds(
  supabase: SupabaseClient, userId: string, certification: string, service: string,
): Promise<Set<string>> {
  const seen = new Set<string>()
  let after: string | undefined
  for (;;) {
    let query = supabase.from('user_question_history').select('question_id')
      .eq('user_id', userId).eq('certification', certification).eq('service', service)
      .not('question_id', 'is', null).order('question_id', { ascending: true }).limit(100)
    if (after !== undefined) query = query.gt('question_id', after)
    const { data, error } = await query
    if (error) throw error
    if (!data?.length) return seen
    for (const row of data) seen.add(row.question_id as string)
    const next = data[data.length - 1].question_id as string
    if (next === after) throw new Error('Question history pagination did not advance')
    after = next
    // Continue until empty, including when the server caps results below our limit.
  }
}

export async function selectBankQuestion(certification: string, service: string, seen: Set<string>) {
  const pk = `CERT#${certification}#SERVICE#${service}`
  const candidates = await getCatalog(pk)
  const unseen = candidates.filter(candidate => !seen.has(candidate.questionId))
  let totalQuestions = candidates.length
  while (unseen.length) {
    const index = Math.floor(Math.random() * unseen.length)
    const candidate = unseen[index]
    // Exact-key Query preserves the existing Query-only IAM permission. Recheck
    // the latest body/status even on a cache hit; never trust cached eligibility.
    const response = await client.send(new QueryCommand({
      TableName: table,
      KeyConditionExpression: 'PK = :pk AND SK = :sk',
      ExpressionAttributeValues: { ':pk': pk, ':sk': candidate.SK },
      ConsistentRead: true,
    }))
    const item = response.Items?.[0]
    if (item && isPublished(item) && item.questionId === candidate.questionId) {
      return { question: item as BankQuestion, remainingQuestions: unseen.length, totalQuestions }
    }
    unseen.splice(index, 1)
    totalQuestions--
  }
  return { question: null, remainingQuestions: 0, totalQuestions }
}
