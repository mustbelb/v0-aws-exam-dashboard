const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict'), ts = require('typescript');
function load(path, mocks, extra = {}) {
 const exports = {};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2021,esModuleInterop:true}}).outputText,{exports,require:name=>name in mocks?mocks[name]:require(name),Response,URLSearchParams,ReadableStream,TextEncoder,AbortController,AbortSignal,console:{error(){},log(){}},process:{env:{AUTHENTICATED_GENERATOR_URL:'https://test.lambda-url.us-east-2.on.aws/',SUPABASE_SECRET_KEY:'test-only'}},...extra});
 return exports;
}
(async()=>{
 let authenticated=false, progressError=null, rpcCalls=0, calls=0, upstream, rpcArgs, rpcData={success:true,alreadyAnswered:true,answeredCorrectly:false,userAnswer:'B',correctAnswer:'A',explanation:{correct:'Trusted explanation'},examTip:'Tip',serviceProgress:[]};
 const supabase={auth:{getUser:async()=>({data:{user:authenticated?{id:'real-user'}:null},error:null})},from:()=>{throw new Error('Submit must not write history separately')},rpc:async(name,args)=>{rpcCalls++;rpcArgs={name,args};return {data:rpcData,error:progressError}}};
 const mocks={'@/lib/supabase/server':{createClient:async()=>supabase},'@/lib/services':{getServiceById:id=>id==='lambda'?{certifications:['SAA-C03','DVA-C02']}:null},'next/server':{NextResponse:{json:Response.json}},'@/lib/issued-question':{issueQuestion:async()=>({issuanceId:'issued-id',question:'Public question',options:{A:'a',B:'b',C:'c',D:'d'}})},'@/lib/generation-events':{readGeneratedQuestion:async()=>({question:'trusted',correct:'A'})}};
 const generate=load('app/api/question/generate/route.ts',mocks,{fetch:async url=>{calls++;upstream=url;return new Response('data: test\n\n')}});
 const request={nextUrl:new URL('https://local/api/question/generate?service=lambda&userId=forged&certification=DVA-C02'),signal:new AbortController().signal};
 assert.equal((await generate.GET(request)).status,401);assert.equal(calls,0);
 authenticated=true;
 const generation=await generate.GET(request);assert.equal(generation.status,200);
 assert.equal((await generation.json()).endpoint,'https://test.lambda-url.us-east-2.on.aws/');assert.equal(calls,0);
 assert.equal((await generate.GET({...request,nextUrl:new URL('https://local/?service=invalid')})).status,400);
 assert.equal((await generate.GET({...request,nextUrl:new URL('https://local/?service=lambda&certification=SAA-C03')})).status,200);
 const unavailable=load('app/api/question/generate/route.ts',mocks,{process:{env:{}}});
 assert.equal((await unavailable.GET(request)).status,503);
 const submit=load('app/api/question/submit/route.ts',mocks);
 const input={issuanceId:'11111111-1111-4111-8111-111111111111',userAnswer:'a'};
 const duplicate=await submit.POST({json:async()=>input});assert.equal(duplicate.status,200);
 const saved=await duplicate.json();assert.equal(saved.alreadyAnswered,true);assert.equal(saved.answeredCorrectly,false);assert.equal(saved.userAnswer,'B');assert.equal(rpcCalls,1);
 assert.equal(rpcArgs.name,'submit_issued_answer');assert.equal(rpcArgs.args.p_user_answer,'A');assert.deepEqual(Object.keys(rpcArgs.args).sort(),['p_issuance_id','p_time_taken_seconds','p_user_answer']);
 const before=rpcCalls;
 for (const invalid of [null,{}, {...input,correctAnswer:'A'}, {...input,service:'s3'}, {...input,userAnswer:'E'}, {...input,issuanceId:'forged'}, {...input,timeTakenSeconds:-1}]) assert.equal((await submit.POST({json:async()=>invalid})).status,400);
 assert.equal(rpcCalls,before);
 progressError={code:'P0002'};assert.equal((await submit.POST({json:async()=>input})).status,404);
 progressError={code:'unavailable'};assert.equal((await submit.POST({json:async()=>input})).status,500);
 authenticated=false;assert.equal((await submit.POST({json:async()=>input})).status,401);
 console.log('PASS: session identity, exam validation, private completion, strict issued-answer input, stored retry results, and save errors.');
})().catch(error=>{console.error(error);process.exitCode=1});
