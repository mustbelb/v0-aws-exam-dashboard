import { parseGeneratedQuestion, parsePartialGeneratedQuestion } from '@/lib/generated-question'
import type { GeneratedQuestion } from '@/lib/generated-question'

// Decode SSE across arbitrary UTF-8/network boundaries. Do not forward raw model output.
export async function readGeneratedQuestion(body: ReadableStream<Uint8Array>,
  onPartial: (question: ReturnType<typeof parsePartialGeneratedQuestion>) => void,
): Promise<GeneratedQuestion> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = '', content = '', bytes = 0, completed = false
  let lastPartial = ''
  const consume = (frame: string) => {
    const payload = frame.split('\n').filter(line => line.startsWith('data:'))
      .map(line => line.slice(5).trimStart()).join('\n')
    if (!payload) return
    const event = JSON.parse(payload)
    if (event.type === 'error') throw new Error('Generator failed')
    if (event.type === 'character' || event.type === 'chunk') {
      const chunk = event.character ?? event.content
      if (typeof chunk !== 'string') throw new Error('Invalid generator chunk')
      content += chunk
      if (content.length > 64000) throw new Error('Generated question exceeds size limit')
      const partial = parsePartialGeneratedQuestion(content)
      const serialized = JSON.stringify(partial)
      if (serialized !== lastPartial) { onPartial(partial); lastPartial = serialized }
    } else if (event.type === 'complete') {
      completed = true
    }
  }
  try {
    while (!completed) {
      const {value, done} = await reader.read()
      if (done) { buffer += decoder.decode(); break }
      bytes += value.byteLength
      if (bytes > 4_000_000) throw new Error('Generator stream exceeds size limit')
      buffer += decoder.decode(value, {stream: true})
      // Normalization happens after appending to preserve split CRLF pairs.
      buffer = buffer.replace(/\r\n/g, '\n')
      let boundary
      while ((boundary = buffer.indexOf('\n\n')) !== -1 && !completed) {
        const frame = buffer.slice(0,boundary)
        buffer = buffer.slice(boundary+2)
        consume(frame)
      }
    }
    if (!completed && buffer.trim()) consume(buffer)
    if (!completed) throw new Error('Generator disconnected before completion')
    const question = parseGeneratedQuestion(content)
    if (!question) throw new Error('Incomplete generated question')
    return question
  } finally {
    await reader.cancel().catch(() => {})
    reader.releaseLock()
  }
}
