import { createHash } from 'node:crypto'
import { parseGeneratedQuestion, parsePartialGeneratedQuestion } from './generated-question.mjs'
import { getServiceById } from './services.mjs'

export class HttpError extends Error {
  constructor(status, message, code = 'http_error') { super(message); this.status = status; this.code = code }
}
export function buildPrompt(service, certification, topic) {
  return `Write one realistic AWS ${certification === 'SAA-C03' ? 'Solutions Architect Associate' : 'Developer Associate'} (${certification}) practice question about ${service.name}.
${topic ? 'Topic focus: ' + topic : 'Relevant topics: ' + service.topics.join(', ')}
Use one clear best answer, technically accurate current AWS behavior, and plausible distractors. Avoid ambiguous premises and unsupported service limits.
The question field must contain only the scenario and the question being asked. Put each answer choice only in options, never repeat choices or their labels in the question field.
Before returning the JSON, check that every requirement and observation in the scenario is consistent with the correct answer and its explanation. Revise any inconsistent scenario rather than inventing missing evidence in the explanation. In particular:
- A successful invocation below a configured timeout is not evidence that this timeout is too low. Identify the actual failing operation, its duration, and the relevant timeout when diagnosing timeouts.
- Do not call a workload stateless or safe to interrupt while relying on irreplaceable instance-local session state. Explicitly describe shared session storage or acceptable session loss if the answer relies on instance replacement.
- Verify any numeric comparison against the scenario. Do not assert precise AWS limits or defaults unless confident; avoid a question that depends on an uncertain value.
- Ensure only one option satisfies all stated requirements, and explain each distractor using those requirements.
Return ONLY JSON with this structure:
{"question":"Scenario and question", "options":{"A":"Option A","B":"Option B","C":"Option C","D":"Option D"},"correct":"A","explanation":{"correct":"Why A is correct","B":"Why B is wrong","C":"Why C is wrong","D":"Why D is wrong"},"examTip":"A useful study tip"}`
}

export function createGenerator({env = process.env, fetchImpl = fetch} = {}) {
  const config = () => {
    const {SUPABASE_URL:url, SUPABASE_ANON_KEY:anon, SUPABASE_SECRET_KEY:secret, ANTHROPIC_API_KEY:provider} = env
    if (!url || !anon || !secret || !provider) throw new HttpError(503,'Generation is not configured')
    return {url,anon,secret,provider}
  }
  const request = async (url, options, signal) => fetchImpl(url,{...options,signal:AbortSignal.any([signal,AbortSignal.timeout(15000)])})
  return {
    async authorize(event, signal) {
      const c = config()
      const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([k,v])=>[k.toLowerCase(),v]))
      const origin = headers.origin
      const allowed = (env.ALLOWED_ORIGINS || '').split(',').filter(Boolean)
      if (origin && !allowed.includes(origin)) throw new HttpError(403,'Origin is not allowed')
      if (!/^Bearer [^\s]+$/.test(headers.authorization || '')) throw new HttpError(401,'Sign in to generate questions')
      const auth = await request(c.url+'/auth/v1/user',{headers:{apikey:c.anon,Authorization:headers.authorization}},signal)
      if (!auth.ok) throw new HttpError(auth.status>=500 ? 503 : 401,'Sign in to generate questions')
      const user = await auth.json()
      if (!user?.id) throw new HttpError(401,'Invalid session')
      if (event.isBase64Encoded || typeof event.body !== 'string' || event.body.length>2000) throw new HttpError(400,'Invalid request')
      let body
      try { body=JSON.parse(event.body) } catch { throw new HttpError(400,'Invalid JSON') }
      if (!body || typeof body!=='object' || Array.isArray(body) || Object.keys(body).some(k=>!['service','certification','topic'].includes(k))) throw new HttpError(400,'Invalid request')
      const service = getServiceById(body.service)
      if (!service || !service.certifications.includes(body.certification)) throw new HttpError(400,'Invalid service or certification')
      if (body.topic != null && (typeof body.topic!=='string' || !/^[a-z0-9-]{1,200}$/.test(body.topic))) throw new HttpError(400,'Invalid topic')
      const quota = await request(c.url+'/rest/v1/rpc/reserve_question_generation',{method:'POST',headers:{apikey:c.secret,Authorization:'Bearer '+c.secret,'Content-Type':'application/json'},body:JSON.stringify({p_user_id:user.id})},signal)
      if (!quota.ok) throw new HttpError(503,'Generation is temporarily unavailable')
      if (await quota.json() !== true) throw new HttpError(429,'Generation limit reached. Please try again later.')
      return {userId:user.id,service,certification:body.certification,topic:body.topic}
    },
    async generate(context, emit, signal) {
      const c = config()
      const response = await fetchImpl('https://api.anthropic.com/v1/messages',{
        method:'POST',signal,headers:{'Content-Type':'application/json','x-api-key':c.provider,'anthropic-version':'2023-06-01'},
        body:JSON.stringify({model:env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',max_tokens:2500,stream:true,messages:[{role:'user',content:buildPrompt(context.service,context.certification,context.topic)}]})
      })
      if (!response.ok || !response.body) throw new HttpError(502,'The question provider is unavailable. Please try again.','provider_http_'+response.status)
      const reader=response.body.getReader(), decoder=new TextDecoder()
      let buffer='', content='', complete=false, bytes=0, previous=''
      try {
        while (!complete) {
          const {done,value}=await reader.read()
          if (done) break
          bytes+=value.byteLength
          if (bytes>500000) throw new Error('Provider output too large')
          buffer=(buffer+decoder.decode(value,{stream:true})).replace(/\r\n/g,'\n')
          let boundary
          while ((boundary=buffer.indexOf('\n\n'))>=0 && !complete) {
            const frame=buffer.slice(0,boundary);buffer=buffer.slice(boundary+2)
            const raw=frame.split('\n').filter(line=>line.startsWith('data:')).map(line=>line.slice(5).trimStart()).join('\n')
            if (!raw) continue
            const data=JSON.parse(raw)
            if (data.type==='error') throw new Error('Provider stream failed')
            if (data.type==='message_delta' && data.delta?.stop_reason && data.delta.stop_reason!=='end_turn') throw new Error('Provider output incomplete')
            if (data.type==='content_block_delta' && data.delta?.type==='text_delta') {
              if (typeof data.delta.text!=='string') throw new Error('Invalid provider content')
              content+=data.delta.text
              if (content.length>64000) throw new Error('Question too large')
              const partial=parsePartialGeneratedQuestion(content), serialized=JSON.stringify(partial)
              if (serialized!==previous) { await emit({type:'partial',question:partial});previous=serialized }
            }
            if (data.type==='message_stop') complete=true
          }
        }
      } finally { await reader.cancel().catch(()=>{}); reader.releaseLock() }
      const question=complete ? parseGeneratedQuestion(content) : null
      if (!question) throw new Error('Provider returned an incomplete question')
      const hash=createHash('sha256').update(question.question).digest('hex').slice(0,32)
      const issue=await request(c.url+'/rest/v1/issued_questions?select=id',{
        method:'POST',headers:{apikey:c.secret,Authorization:'Bearer '+c.secret,'Content-Type':'application/json',Prefer:'return=representation'},
        body:JSON.stringify({user_id:context.userId,service:context.service.id,certification:context.certification,question_id:hash,question_hash:hash,question_text:question.question,correct_answer:question.correct,explanation:question.explanation,exam_tip:question.examTip,topic:context.topic || null})
      },signal)
      if (!issue.ok) throw new HttpError(503,'The question could not be saved. Please try again.','issuance_http_'+issue.status)
      const [issued]=await issue.json()
      if (!issued?.id) throw new Error('Missing issuance ID')
      await emit({type:'complete',question:{issuanceId:issued.id,questionId:hash,question:question.question,options:question.options,topic:context.topic}})
    }
  }
}
