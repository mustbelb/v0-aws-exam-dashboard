const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
function load(path,mocks={}) {const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2021}}).outputText,{exports,require:name=>name in mocks?mocks[name]:require(name),Response,console:{error(){}},process:{env:{}}});return exports;}
const parser=load('lib/generated-question.ts');
const fixture={questionId:'bank-id',question:'A trusted question',options:{A:'a',B:'b',C:'c',D:'d'},correct:'B',explanation:{correct:'Private feedback'},examTip:'Private tip',topic:'lambda-topic'};
(async()=>{
 let inserted;
 const issuer=load('lib/issued-question.ts',{'server-only':{},'@/lib/generated-question':parser,'@/lib/supabase/issuer':{createIssuerClient:()=>({from:()=>({insert:row=>{inserted=row;return {select:()=>({single:async()=>({data:{id:'11111111-1111-4111-8111-111111111111'}})})}}})})}});
 const publicQuestion=await issuer.issueQuestion('user','lambda','DVA-C02',fixture);
 assert.equal(inserted.user_id,'user');assert.equal(inserted.correct_answer,'B');assert.equal(publicQuestion.questionId,'bank-id');assert.ok(!('correct' in publicQuestion));assert.ok(!('explanation' in publicQuestion));assert.ok(!('examTip' in publicQuestion));
 let authenticated=true, questions={},seen={},issueCalls=[],questionPages=null;
 const services=[{id:'lambda',name:'Lambda',icon:'L',certifications:['DVA-C02','SAA-C03']},{id:'s3',name:'S3',icon:'S',certifications:['DVA-C02','SAA-C03']}];
 const supabase={auth:{getUser:async()=>({data:{user:authenticated?{id:'real-user'}:null}})},from:()=>{const filters={};const chain={select:()=>chain,eq:(key,value)=>{filters[key]=value;return chain},then:resolve=>resolve({data:(seen[filters.service]||[]).map(question_id=>({question_id}))})};return chain}};
 const route=load('app/api/question/next/route.ts',{'@/lib/supabase/server':{createClient:async()=>supabase},'@/lib/issued-question':{issueQuestion:async(...args)=>{issueCalls.push(args);return publicQuestion}},'@/lib/services':{getServiceById:id=>services.find(s=>s.id===id),getServicesInCategory:()=>services,getRandomServiceFromCategory:()=>services[0]},'@aws-sdk/client-dynamodb':{DynamoDBClient:class{}},'@aws-sdk/lib-dynamodb':{QueryCommand:class {constructor(input){this.input=input}},DynamoDBDocumentClient:{from:()=>({send:async command=>{
  if(questionPages){const page=command.input.ExclusiveStartKey?.page||0;return {Items:questionPages[page],LastEvaluatedKey:page+1<questionPages.length?{page:page+1}:undefined};}
  return {Items:questions[command.input.ExpressionAttributeValues[':pk'].split('#').at(-1)]||[]};
 }})}},'next/server':{NextResponse:{json:Response.json}}});
 const request=params=>({nextUrl:new URL('https://local/api/question/next?certification=DVA-C02&'+params)});
 questions={lambda:[fixture]};let result=await route.GET(request('service=lambda'));assert.equal(result.status,200);assert.equal((await result.json()).issuanceId,publicQuestion.issuanceId);assert.equal(issueCalls.at(-1)[0],'real-user');
 // Empty selected service falls back to another service with its own history.
 questions={s3:[fixture]};seen={lambda:['bank-id']};await route.GET(request('category=compute'));assert.equal(issueCalls.at(-1)[1],'s3');
 // Exhausted selected service follows the same trusted issuance path.
 questions={lambda:[fixture],s3:[fixture]};await route.GET(request('category=compute'));assert.equal(issueCalls.at(-1)[1],'s3');
 const retired={...fixture,questionId:'retired',publicationStatus:'retired'};
 const published={...fixture,questionId:'revision',publicationStatus:'published'};
 seen={};questions={lambda:[retired,{...retired,publicationStatus:'draft'},{...retired,publicationStatus:'unknown'},published]};
 await route.GET(request('service=lambda'));assert.equal(issueCalls.at(-1)[3].questionId,'revision');
 questions={lambda:[retired],s3:[retired,published]};
 await route.GET(request('category=compute'));assert.equal(issueCalls.at(-1)[1],'s3');assert.equal(issueCalls.at(-1)[3].questionId,'revision');
 questions={lambda:[fixture],s3:[retired,published]};seen={lambda:['bank-id']};
 await route.GET(request('category=compute'));assert.equal(issueCalls.at(-1)[3].questionId,'revision');
 seen={};questionPages=[[retired],[published]];
 await route.GET(request('service=lambda'));assert.equal(issueCalls.at(-1)[3].questionId,'revision','Continue pagination after an entirely retired page');
 questionPages=null;questions={lambda:[retired]};const beforeRetiredOnly=issueCalls.length;
 await route.GET(request('service=lambda'));assert.equal(issueCalls.length,beforeRetiredOnly,'Never issue a retired-only bank');
 const count=issueCalls.length;assert.equal((await route.GET(request('service=invalid'))).status,400);
 authenticated=false;assert.equal((await route.GET(request('service=lambda'))).status,401);assert.equal(issueCalls.length,count);
 console.log('PASS: private issuer records, public field allowlist, all three bank selection paths, authenticated identity and invalid-service rejection.');
})().catch(error=>{console.error(error);process.exitCode=1});
