import { once } from 'node:events'
import { createGenerator, HttpError } from './runtime.mjs'
const generator=createGenerator()
export const handler=awslambda.streamifyResponse(async (event, rawStream) => {
  const cancellation=new AbortController()
  const timeout=setTimeout(()=>cancellation.abort(),110000)
  const signal=cancellation.signal
  let stream, ended=false
  rawStream.on('close',()=>{if(!ended)cancellation.abort()})
  const open=(status,contentType)=>awslambda.HttpResponseStream.from(rawStream,{statusCode:status,headers:{'Content-Type':contentType,'Cache-Control':'no-store'}})
  try {
    if (event.requestContext?.http?.method!=='POST') throw new HttpError(405,'Use POST')
    const context=await generator.authorize(event,signal)
    stream=open(200,'text/event-stream')
    const emit=async data=>{if(!stream.write(`data: ${JSON.stringify(data)}\n\n`))await once(stream,'drain',{signal})}
    await emit({type:'status',message:'Generating question...'})
    try { await generator.generate(context,emit,signal) }
    catch(error) { console.error(JSON.stringify({stage:'generation',code:error instanceof HttpError ? error.code : signal.aborted ? 'cancelled' : 'invalid_stream_or_transport'})); if(!signal.aborted)await emit({type:'error',error:'The question could not be generated. Please try again.'}) }
  } catch(error) {
    if(!stream){stream=open(error instanceof HttpError?error.status:503,'application/json');stream.write(JSON.stringify({error:error instanceof HttpError?error.message:'Generation is temporarily unavailable'}))}
  } finally {
    clearTimeout(timeout);ended=true
    if(stream)stream.end();else rawStream.end()
  }
})
