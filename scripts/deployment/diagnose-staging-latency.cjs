// Read-only learner history: issues synthetic questions but does not submit answers.
const fs = require('node:fs');
const {performance} = require('node:perf_hooks');
const {createServerClient} = require('@supabase/ssr');
const env = require('dotenv').parse(fs.readFileSync('.env.staging.local'));
const file = '.staging-test-users.json', credentials = JSON.parse(fs.readFileSync(file));
const project = 'zfxhgywkgtgsbrcimhur';
const origin = 'https://codex-staging.d33uz7aibh12e5.amplifyapp.com';
if (credentials.project !== project || env.NEXT_PUBLIC_SUPABASE_URL !== `https://${project}.supabase.co` || env.APP_ENVIRONMENT !== 'staging') throw Error('Staging isolation required');
const count = Number(process.argv[2] || 10);
if (![1,10,50].includes(count) || credentials.users.length < count) throw Error('Use existing 1/10/50 synthetic learners');
const save = () => {fs.writeFileSync(file, JSON.stringify(credentials), {mode:0o600}); fs.chmodSync(file,0o600)};
(async () => {
  const users = credentials.users.slice(0,count);
  for (const user of users) {
    if (user.cookies && user.sessionExpiresAt > Date.now()/1000+120) continue;
    await new Promise(resolve => setTimeout(resolve,2500));
    const jar = {};
    const client = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL,env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{cookies:{getAll:()=>Object.entries(jar).map(([name,value])=>({name,value})),setAll:values=>values.forEach(({name,value})=>{jar[name]=value})}});
    const {data,error} = await client.auth.signInWithPassword({email:user.email,password:user.password});
    if (error || !data.session) throw Error('Synthetic login failed');
    user.cookies=jar; user.sessionExpiresAt=data.session.expires_at; save();
  }
  console.log(`Prepared ${count} synthetic sessions.`);
  const rounds = [];
  for(let round=1;round<=3;round++) {
    const results = await Promise.allSettled(users.map(async (user,index) => {
      const start=performance.now();
      const response=await fetch(origin+`/api/question/next?service=s3&certification=${index%2?'DVA-C02':'SAA-C03'}`,{headers:{Cookie:Object.entries(user.cookies).map(([k,v])=>`${k}=${v}`).join('; ')},redirect:'error',signal:AbortSignal.timeout(15000)});
      const body=await response.json();
      if(response.status!==200 || !body.issuanceId || !body.question?.startsWith('[STAGING TEST ONLY]')) throw Error('Unexpected staging response');
      const spans={};
      for(const entry of (response.headers.get('server-timing')||'').split(',')) {
        const match=entry.trim().match(/^(auth|history|catalog|item|issuance|total);dur=(\d+)$/);
        if(match) spans[match[1]]=Number(match[2]);
      }
      if(Object.keys(spans).length!==6) throw Error('Missing numeric timing spans');
      return {elapsedMs:Math.round(performance.now()-start),...spans};
    }));
    if(results.some(r=>r.status!=='fulfilled')) throw Error('Diagnostic stopped after failed round');
    const rows=results.map(r=>r.value),p95=key=>rows.map(r=>r[key]).sort((a,b)=>a-b)[Math.ceil(rows.length*.95)-1];
    rounds.push({round,rows,p95:Object.fromEntries(Object.keys(rows[0]).map(key=>[key,p95(key)]))});
    console.log(JSON.stringify({round,p95:rounds.at(-1).p95}));
  }
  fs.mkdirSync('outputs/staging',{recursive:true});
  fs.writeFileSync(`outputs/staging/latency-spans-${Date.now()}.json`,JSON.stringify({time:new Date().toISOString(),count,origin,scope:'Synthetic question issuance only; no answers submitted. Server-Timing excludes platform startup before route entry and network delivery. Span percentiles are not additive.',rounds},null,2));
})().catch(()=>{console.error('Staging diagnostic failed; credentials and response bodies suppressed.');process.exitCode=1});
