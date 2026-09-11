import 'server-only'
import { createHash } from 'node:crypto'
import { createIssuerClient } from '@/lib/supabase/issuer'
import { parseGeneratedQuestion, type GeneratedQuestion } from '@/lib/generated-question'

export async function issueQuestion(userId: string, service: string, certification: string,
  input: GeneratedQuestion & {questionId?: string; topic?: string}) {
  const question = parseGeneratedQuestion(JSON.stringify(input))
  if (!question) throw new Error('Invalid trusted question')
  const hash = createHash('sha256').update(question.question).digest('hex').substring(0,32)
  const questionId = input.questionId || hash
  const {data, error} = await createIssuerClient().from('issued_questions').insert({
    user_id: userId, service, certification, question_id: questionId, question_hash: hash,
    question_text: question.question, correct_answer: question.correct,
    explanation: question.explanation, exam_tip: question.examTip, topic: input.topic ?? null
  }).select('id').single()
  if (error || !data?.id) throw new Error('Question could not be issued')
  // Explicit public allowlist: never spread trusted input into a browser response.
  return {issuanceId: data.id as string, questionId, question: question.question,
    options: question.options, topic: input.topic}
}
