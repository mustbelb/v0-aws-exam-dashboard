import { createClient } from '@/lib/supabase/client'

export async function streamQuestionGeneration(
  parameters: {service:string;certification:string;topic?:string},
  onEvent: (event: {type:string;question?:unknown;error?:string}) => void,
  signal: AbortSignal,
) {
  const configResponse=await fetch('/api/question/generate?'+new URLSearchParams(parameters),{signal,cache:'no-store'})
  const config=await configResponse.json()
  if(!configResponse.ok)throw new Error(config.error || 'Generation is unavailable')
  const {data:{session},error}=await createClient().auth.getSession()
  if(error || !session?.access_token)throw new Error('Please sign in again to generate questions.')
  const response=await fetch(config.endpoint,{
    method:'POST',signal,headers:{Authorization:'Bearer '+session.access_token,'Content-Type':'application/json'},
    body:JSON.stringify(parameters),credentials:'omit'
  })
  if(!response.ok){const error=await response.json().catch(()=>({}));throw new Error(error.error || 'Generation is unavailable. Please try again.')}
  if(!response.body)throw new Error('Missing generation response')
  const reader=response.body.getReader(),decoder=new TextDecoder()
  let buffer='',completed=false,bytes=0
  try {
    while(!completed){
      const {done,value}=await reader.read()
      if(done)break
      bytes+=value.byteLength
      if(bytes>2_000_000)throw new Error('Generation response is too large')
      buffer=(buffer+decoder.decode(value,{stream:true})).replace(/\r\n/g,'\n')
      let boundary
      while((boundary=buffer.indexOf('\n\n'))>=0 && !completed){
        const frame=buffer.slice(0,boundary);buffer=buffer.slice(boundary+2)
        const raw=frame.split('\n').filter(line=>line.startsWith('data:')).map(line=>line.slice(5).trimStart()).join('\n')
        if(!raw)continue
        const data=JSON.parse(raw)
        if(data.type==='error')throw new Error(data.error || 'Generation failed. Please try again.')
        if(data.type==='complete')completed=true
        onEvent(data)
      }
    }
    if(!completed)throw new Error('Generation was interrupted. Please try again.')
  } finally {await reader.cancel().catch(()=>{});reader.releaseLock()}
}
