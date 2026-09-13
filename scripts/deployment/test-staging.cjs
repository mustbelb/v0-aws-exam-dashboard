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
const samples={next:[],submit:[]};const roundMetrics=[];let phase='initialization', diagnostic={};let duplicateChecked=false;
function saveUsers(){fs.writeFileSync(credentialFile,JSON.stringify(credentials),{mode:0o600});fs.chmodSync(credentialFile,0o600)}
async function request(route,jar,body){
 const start=performance.now();const response=await fetch(origin+route,{method:body?'POST':'GET',headers:{Cookie:Object.entries(jar).map(([k,v])=>`${k}=${v}`).join('; '),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,redirect:'error',signal:AbortSignal.timeout(15000)});
 let data;try{data=await response.json()}catch{throw Error('Non-JSON staging response')}
 return {status:response.status,data,elapsed:performance.now()-start};
}
(async()=>{
 const sessions=[], baselineAttempts=[];
 for(let i=0;i<count;i++){
  let user=credentials.users[i];
  if(!user){
   user={email:`staging-${crypto.randomUUID()}@example.invalid`,password:crypto.randomBytes(32).toString('base64url')};
   phase='create-synthetic-user';
   const {data,error}=await admin.auth.admin.createUser({...user,email_confirm:true,user_metadata:{environment:'staging',purpose:'synthetic-load-test'}});
   if(error||!data.user){diagnostic={status:error?.status,code:error?.code};throw Error('Synthetic staging account creation failed');}user.id=data.user.id;credentials.users.push(user);saveUsers();
  }
  if(user.cookies&&user.sessionExpiresAt>Date.now()/1000+120){sessions.push({...user.cookies});continue;}
  await new Promise(resolve=>setTimeout(resolve,2500));
  const jar={};const client=createServerClient(env.NEXT_PUBLIC_SUPABASE_URL,env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{cookies:{getAll:()=>Object.entries(jar).map(([name,value])=>({name,value})),setAll:cookies=>cookies.forEach(({name,value})=>{jar[name]=value})}});
  phase='synthetic-sign-in';
  const {data:login,error}=await client.auth.signInWithPassword({email:user.email,password:user.password});
  if(error){diagnostic={status:error.status,code:error.code};throw Error('Synthetic staging sign-in failed');}sessions.push(jar);user.cookies=jar;user.sessionExpiresAt=login.session?.expires_at||0;saveUsers();
  if((i+1)%10===0)console.log(`Prepared ${i+1}/${count} synthetic sessions at a paced sign-in rate.`);
 }
 phase='progress-read';
 for(let i=0;i<sessions.length;i++){
  const before=await request(`/api/progress?certification=${i%2?'DVA-C02':'SAA-C03'}`,sessions[i]);
  if(before.status!==200||typeof before.data.totalQuestions!=='number')throw Error('Staging progress read failed');
  baselineAttempts.push(before.data.totalQuestions);
 }
 console.log(`Authenticated ${count} synthetic staging learners.`);
 phase='question-and-answer-round';
 for(let round=0;round<rounds;round++){
  const nextStart=samples.next.length, submitStart=samples.submit.length;
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
  const percentile=values=>{const sorted=[...values].sort((a,b)=>a-b);return Math.round(sorted[Math.ceil(sorted.length*.95)-1])};
  roundMetrics.push({round:round+1,questionP95Ms:percentile(samples.next.slice(nextStart)),submitP95Ms:percentile(samples.submit.slice(submitStart))});
  console.log(`Completed staging round ${round+1}/${rounds}.`);
 }
 phase='progress-read';
 for(let i=0;i<sessions.length;i++){
  const after=await request(`/api/progress?certification=${i%2?'DVA-C02':'SAA-C03'}`,sessions[i]);
  if(after.status!==200||after.data.totalQuestions!==baselineAttempts[i]+rounds)throw Error('Staging progress reload count failed');
 }
 const summarize=values=>{const sorted=[...values].sort((a,b)=>a-b);return {requests:values.length,p50Ms:Math.round(sorted[Math.ceil(sorted.length*.5)-1]),p95Ms:Math.round(sorted[Math.ceil(sorted.length*.95)-1]),maxMs:Math.round(sorted.at(-1))}};
 const report={time:new Date().toISOString(),origin,project,timingMethod:'Full JSON response received and parsed',concurrentLearners:count,rounds,roundMetrics,question:summarize(samples.next),submit:summarize(samples.submit),duplicateRetryPassed:duplicateChecked,progressReloadPassed:true,unexpectedErrors:0,scope:'Authenticated bank retrieval and submission only; excludes login timing, browser rendering, generation, and sustained capacity.'};
 fs.mkdirSync('outputs/staging',{recursive:true});fs.writeFileSync(`outputs/staging/test-${count}-${Date.now()}.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report));
})().catch(()=>{const safe={phase,status:Number.isInteger(diagnostic.status)?diagnostic.status:undefined,code:typeof diagnostic.code==='string'&&/^[a-z_]{1,80}$/.test(diagnostic.code)?diagnostic.code:undefined};console.error('Staging test stopped: '+JSON.stringify(safe)+'. Credentials and response bodies are suppressed.');process.exitCode=1});
