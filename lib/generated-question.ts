export interface GeneratedQuestion {
  question: string
  options: Record<'A' | 'B' | 'C' | 'D', string>
  correct: string
  explanation: { correct: string; A?: string; B?: string; C?: string; D?: string }
  examTip: string
}
interface PartialQuestion { question?: string; options?: Partial<GeneratedQuestion['options']> }
const clean = (text: string) => text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
const string = (value: unknown): string => typeof value === 'string' ? value.trim() : ''

export function parseGeneratedQuestion(text: string): GeneratedQuestion | null {
  try {
    const content = clean(text)
    const section = (label: string) => content.match(new RegExp(
      `(?:^|\\n)${label}:[ \t]*([\\s\\S]*?)(?=\\n(?:QUESTION|OPTION_[A-D]|CORRECT|EXPLANATION_(?:CORRECT|[A-D])|EXAM_TIP):|$)`, 'i'
    ))?.[1]?.trim() || ''
    const data = content.startsWith('{') ? JSON.parse(content) : {
      question: section('QUESTION'),
      options: Object.fromEntries(['A','B','C','D'].map(key => [key, section('OPTION_' + key)])),
      correct: section('CORRECT'),
      explanation: Object.fromEntries(['correct','A','B','C','D'].map(key => [key, section('EXPLANATION_' + key.toUpperCase())])),
      examTip: section('EXAM_TIP')
    }
    const options = {} as GeneratedQuestion['options']
    const explanation: GeneratedQuestion['explanation'] = {correct: string(data.explanation?.correct)}
    for (const key of ['A','B','C','D'] as const) {
      options[key] = string(data.options?.[key] ?? data.options?.[key.toLowerCase()])
      explanation[key] = string(data.explanation?.[key] ?? data.explanation?.[key.toLowerCase()])
    }
    const question = string(data.question)
    const correct = string(data.correct).toUpperCase()
    if (!question || !/^[A-D]$/.test(correct) || Object.values(options).some(value => !value) || !explanation.correct) return null
    return {question, options, correct, explanation, examTip: string(data.examTip ?? data.exam_tip)}
  } catch { return null }
}

export function parsePartialGeneratedQuestion(text: string): PartialQuestion {
  const content = clean(text)
  return content.startsWith('{') ? parsePartialJSON(content) : parsePartialPlainText(content)
}

const parsePartialJSON = (text: string): PartialQuestion => {
    const partial: PartialQuestion = {}

    const questionMatch = text.match(/"question"\s*:\s*"((?:[^"\\]|\\.)*)"/s)
    if (questionMatch) {
      partial.question = questionMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
    }

    partial.options = {}

    const optionAMatch = text.match(/"A"\s*:\s*"((?:[^"\\]|\\.)*)"/s)
    if (optionAMatch) {
      partial.options.A = optionAMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
    }

    const optionBMatch = text.match(/"B"\s*:\s*"((?:[^"\\]|\\.)*)"/s)
    if (optionBMatch) {
      partial.options.B = optionBMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
    }

    const optionCMatch = text.match(/"C"\s*:\s*"((?:[^"\\]|\\.)*)"/s)
    if (optionCMatch) {
      partial.options.C = optionCMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
    }

    const optionDMatch = text.match(/"D"\s*:\s*"((?:[^"\\]|\\.)*)"/s)
    if (optionDMatch) {
      partial.options.D = optionDMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
    }

    return partial
  }

const parsePartialPlainText = (text: string): PartialQuestion => {
    const partial: PartialQuestion = {}

    const questionMatch = text.match(/QUESTION[:\s]*\n?([\s\S]*?)(?=\nOPTION_A[:\s]|$)/i)
    if (questionMatch) {
      partial.question = questionMatch[1].trim()
    }

    partial.options = {}

    const optionAMatch = text.match(/OPTION_A[:\s]*\n?([\s\S]*?)(?=\nOPTION_B[:\s]|$)/i)
    if (optionAMatch) {
      partial.options.A = optionAMatch[1].trim()
    }

    const optionBMatch = text.match(/OPTION_B[:\s]*\n?([\s\S]*?)(?=\nOPTION_C[:\s]|$)/i)
    if (optionBMatch) {
      partial.options.B = optionBMatch[1].trim()
    }

    const optionCMatch = text.match(/OPTION_C[:\s]*\n?([\s\S]*?)(?=\nOPTION_D[:\s]|$)/i)
    if (optionCMatch) {
      partial.options.C = optionCMatch[1].trim()
    }

    const optionDMatch = text.match(/OPTION_D[:\s]*\n?([\s\S]*?)(?=\nCORRECT[:\s]|$)/i)
    if (optionDMatch) {
      partial.options.D = optionDMatch[1].trim()
    }

    return partial
  }


// Validate the public completion contract; answer keys never arrive in this object.
export function parseIssuedQuestion(value: unknown): {issuanceId: string; question: string; options: GeneratedQuestion['options']; questionId?: string; topic?: string} | null {
  if (!value || typeof value !== 'object') return null
  const data = value as Record<string, unknown>
  if (typeof data.issuanceId !== 'string' || !/^[0-9a-f-]{36}$/i.test(data.issuanceId) || !string(data.question)) return null
  const options = data.options as Record<string, unknown> | undefined
  if (!options || ['A','B','C','D'].some(key => !string(options[key]))) return null
  return {issuanceId:data.issuanceId, question:string(data.question),
    options:{A:string(options.A),B:string(options.B),C:string(options.C),D:string(options.D)},
    questionId: typeof data.questionId === 'string' ? data.questionId : undefined,
    topic: typeof data.topic === 'string' ? data.topic : undefined}
}
