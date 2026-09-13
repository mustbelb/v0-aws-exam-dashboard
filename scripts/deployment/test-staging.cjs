// Bounded tests against the pinned staging app/project only. No provider generation calls.
const fs=require('node:fs'),crypto=require('node:crypto'),{performance}=require('node:perf_hooks');
const dotenv=require('dotenv'),{createClient}=require('@supabase/supabase-js'),{createServerClient}=require('@supabase/ssr');
const project='zfxhgywkgtgsbrcimhur',origin='https://codex-staging.d33uz7aibh12e5.amplifyapp.com';
const env=dotenv.parse(fs.readFileSync('.env.staging.local'));
if(env.NEXT_PUBLIC_SUPABASE_URL!==`https://${project}.supabase.co`||env.APP_ENVIRONMENT!=='staging'||!env.SUPABASE_SECRET_KEY||env.SUPABASE_SECRET_KEY.startsWith('REPLACE_'))throw Error('Staging credentials required');
const count=Number(process.argv[2]||1),rounds=Number(process.argv[3]||1);
if(![1,10,50,100].includes(count)||!Number.isInteger(rounds)||rounds<1||rounds>3)throw Error('Allowed cohorts: 1/10/50/100; rounds: 1–3');
const credentialFile='.staging-test-users.json';
const credentials=fs.existsSync(credentialFile)?JSON.parse(fs.readFileSync(credentialFile)): {project,users:[]};
if(credentials.project!==project)throw Error('Wrong synthetic credential project');
const admin=createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.SUPABASE_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const samples={next:[],submit:[]};let duplicateChecked=false;
function saveUsers(){fs.writeFileSync(credentialFile,JSON.stringify(credentials),{mode:0o600});fs.chmodSync(credentialFile,0o600)}
async function request(route,jar,body){
 const start=performance.now();const response=await fetch(origin+route,{method:body?'POST':'GET',headers:{Cookie:Object.entries(jar).map(([k,v])=>`${k}=${v}`).join('; '),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,redirect:'error',signal:AbortSignal.timeout(15000)});
 const elapsed=performance.now()-start;let data;try{data=await response.json()}catch{throw Error('Non-JSON staging response')}
 return {status:response.status,data,elapsed};
}
(async()=>{
 const sessions=[];
 for(let i=0;i<count;i++){
  let user=credentials.users[i];
  if(!user){
   user={email:`staging-${crypto.randomUUID()}@example.invalid`,password:crypto.randomBytes(32).toString('base64url')};
   const {data,error}=await admin.auth.admin.createUser({...user,email_confirm:true,user_metadata:{environment:'staging',purpose:'synthetic-load-test'}});
   if(error||!data.user)throw Error('Synthetic staging account creation failed');user.id=data.user.id;credentials.users.push(user);saveUsers();
  }
  const jar={};const client=createServerClient(env.NEXT_PUBLIC_SUPABASE_URL,env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{cookies:{getAll:()=>Object.entries(jar).map(([name,value])=>({name,value})),setAll:cookies=>cookies.forEach(({name,value})=>{jar[name]=value})}});
  const {error}=await client.auth.signInWithPassword({email:user.email,password:user.password});
  if(error)throw Error('Synthetic staging sign-in failed');sessions.push(jar);
 }
 console.log(`Authenticated ${count} synthetic staging learners.`);
 for(let round=0;round<rounds;round++){
  const results=await Promise.allSettled(sessions.map(async(jar,index)=>{
   const cert=index%2?'DVA-C02':'SAA-C03',service=round%2?'s3':'lambda';
   const next=await request(`/api/question/next?service=${service}&certification=${cert}`,jar);
   if(next.status!==200||!next.data.issuanceId||!next.data.question?.startsWith('[STAGING TEST ONLY]'))throw Error('Staging question/identity check failed');
   if(['correct','explanation','examTip'].some(key=>key in next.data))throw Error('Private answer fields leaked');samples.next.push(next.elapsed);
   const submitted=await request('/api/question/submit',jar,{issuanceId:next.data.issuanceId,userAnswer:'B',timeTakenSeconds:1});
   if(submitted.status!==200||submitted.data.answeredCorrectly!==true||submitted.data.alreadyAnswered!==false)throw Error('Staging answer persistence failed');samples.submit.push(submitted.elapsed);
   if(index===0&&!duplicateChecked){
    const retry=await request('/api/question/submit',jar,{issuanceId:next.data.issuanceId,userAnswer:'A',timeTakenSeconds:1});
    if(retry.status!==200||retry.data.alreadyAnswered!==true||retry.data.userAnswer!=='B')throw Error('Staging retry changed the saved answer');duplicateChecked=true;
   }
  }));
  if(results.some(result=>result.status==='rejected'))throw Error('A staging round failed; stopped before increasing traffic');
  console.log(`Completed staging round ${round+1}/${rounds}.`);
 }
 const summarize=values=>{const sorted=[...values].sort((a,b)=>a-b);return {requests:values.length,p50Ms:Math.round(sorted[Math.ceil(sorted.length*.5)-1]),p95Ms:Math.round(sorted[Math.ceil(sorted.length*.95)-1]),maxMs:Math.round(sorted.at(-1))}};
 const report={time:new Date().toISOString(),origin,project,concurrentLearners:count,rounds,question:summarize(samples.next),submit:summarize(samples.submit),duplicateRetryPassed:duplicateChecked,unexpectedErrors:0,scope:'Authenticated bank retrieval and submission only; excludes login timing, browser rendering, generation, and sustained capacity.'};
 fs.mkdirSync('outputs/staging',{recursive:true});fs.writeFileSync(`outputs/staging/test-${count}-${Date.now()}.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report));
})().catch(()=>{console.error('Staging test stopped on a failed check. Credentials and response bodies are suppressed.');process.exitCode=1});
