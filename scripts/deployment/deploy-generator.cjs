// Creates an isolated test Lambda. Secrets use temporary mode-0600 configuration files, removed after each call.
const {execFileSync}=require('node:child_process');const fs=require('node:fs');const dotenv=require('dotenv');
const profile='aws-exam-local',region='us-east-2',name='aws-exam-generator-test',roleName=name+'-runtime';
function aws(args,input){
 const directory=input?fs.mkdtempSync('/private/tmp/aws-exam-deploy-'):null;
 const inputPath=directory?directory+'/input.json':null;
 try {
  if(input)fs.writeFileSync(inputPath,JSON.stringify(input),{mode:0o600});
  return JSON.parse(execFileSync('aws',[...args,'--profile',profile,'--region',region,'--output','json',...(input?['--cli-input-json','file://'+inputPath]:[])],{encoding:'utf8',stdio:['ignore','pipe','pipe']})||'{}')
 }catch(e){const message=String(e.stderr||'AWS command failed');throw Error(message.replace(/(sk-ant-)[^\s"']+/g,'[redacted]'))}
 finally{if(directory)fs.rmSync(directory,{recursive:true,force:true})}
}
const identity=aws(['sts','get-caller-identity']);if(identity.Account!=='996068820512')throw Error('Unexpected AWS account');
const local=dotenv.parse(fs.readFileSync('.env.local'));
let current;try{current=aws(['lambda','get-function-configuration','--function-name',name])}catch(e){if(!e.message.includes('ResourceNotFoundException'))throw e}
const legacy=current?null:aws(['lambda','get-function-configuration','--function-name','AWS-exam']);
const provider=local.ANTHROPIC_API_KEY || current?.Environment?.Variables?.ANTHROPIC_API_KEY || legacy?.Environment?.Variables?.ANTHROPIC_API_KEY;
if(!provider)throw Error('Provider key unavailable');
const variables={SUPABASE_URL:local.NEXT_PUBLIC_SUPABASE_URL,SUPABASE_ANON_KEY:local.NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SECRET_KEY:local.SUPABASE_SECRET_KEY,ANTHROPIC_API_KEY:provider,ANTHROPIC_MODEL:'claude-haiku-4-5-20251001',ALLOWED_ORIGINS:current?.Environment?.Variables?.ALLOWED_ORIGINS || 'http://127.0.0.1:3004'};
if(Object.values(variables).some(v=>!v))throw Error('Missing configuration');
let role;
try{role=aws(['iam','get-role','--role-name',roleName]).Role}catch(e){if(!e.message.includes('NoSuchEntity'))throw e;role=aws(['iam','create-role'],{RoleName:roleName,AssumeRolePolicyDocument:JSON.stringify({Version:'2012-10-17',Statement:[{Effect:'Allow',Principal:{Service:'lambda.amazonaws.com'},Action:'sts:AssumeRole'}]}),Description:'Logs-only execution role for isolated AWS exam generator test'}).Role}
try{aws(['logs','create-log-group','--log-group-name','/aws/lambda/'+name])}catch(e){if(!e.message.includes('ResourceAlreadyExistsException'))throw e}
aws(['logs','put-retention-policy','--log-group-name','/aws/lambda/'+name,'--retention-in-days','14']);
aws(['iam','put-role-policy'],{RoleName:roleName,PolicyName:'WriteOwnLogs',PolicyDocument:JSON.stringify({Version:'2012-10-17',Statement:[{Effect:'Allow',Action:['logs:CreateLogStream','logs:PutLogEvents'],Resource:`arn:aws:logs:${region}:${identity.Account}:log-group:/aws/lambda/${name}:*`}]})});
execFileSync('zip',['-q','-j','/private/tmp/aws-exam-generator-test.zip',...['index','runtime','generated-question','services'].map(n=>'lambda/question-generator/dist/'+n+'.mjs')]);
const common={FunctionName:name,Runtime:'nodejs24.x',Role:role.Arn,Handler:'index.handler',Timeout:120,MemorySize:256,Environment:{Variables:variables}};
let exists=true;try{aws(['lambda','get-function-configuration','--function-name',name])}catch(e){if(!e.message.includes('ResourceNotFoundException'))throw e;exists=false}
if(exists){aws(['lambda','update-function-code','--function-name',name,'--zip-file','fileb:///private/tmp/aws-exam-generator-test.zip']);aws(['lambda','wait','function-updated','--function-name',name]);aws(['lambda','update-function-configuration'],common)}
else{for(let i=0;;i++){try{aws(['lambda','create-function','--zip-file','fileb:///private/tmp/aws-exam-generator-test.zip'],{...common,Description:'Supabase-authenticated question streaming test; legacy generator unchanged'});break}catch(e){if(i>=4||!e.message.includes('cannot be assumed'))throw e;execFileSync('sleep',['3'])}}}
aws(['lambda','wait','function-active-v2','--function-name',name]);
try{aws(['lambda','put-function-concurrency','--function-name',name,'--reserved-concurrent-executions','2'])}catch(e){throw Error('Could not set bounded test concurrency: '+e.message)}
const cors={AllowOrigins:variables.ALLOWED_ORIGINS.split(','),AllowMethods:['POST'],AllowHeaders:['authorization','content-type'],MaxAge:300};
let endpoint;try{endpoint=aws(['lambda','create-function-url-config'],{FunctionName:name,AuthType:'NONE',InvokeMode:'RESPONSE_STREAM',Cors:cors}).FunctionUrl}catch(e){if(!e.message.includes('ResourceConflictException'))throw e;endpoint=aws(['lambda','update-function-url-config'],{FunctionName:name,AuthType:'NONE',InvokeMode:'RESPONSE_STREAM',Cors:cors}).FunctionUrl}
for(const permission of [{StatementId:'FunctionUrlEntry',Action:'lambda:InvokeFunctionUrl',FunctionUrlAuthType:'NONE'},{StatementId:'FunctionUrlOnly',Action:'lambda:InvokeFunction',InvokedViaFunctionUrl:true}])try{aws(['lambda','add-permission'],{FunctionName:name,Principal:'*',...permission})}catch(e){if(!e.message.includes('ResourceConflictException'))throw e}
let text=fs.readFileSync('.env.local','utf8').replace(/^AUTHENTICATED_GENERATOR_URL=.*\n?/m,'').replace(/^QUESTION_GENERATOR_LAMBDA_URL=.*\n?/m,'');fs.writeFileSync('.env.local',text.trimEnd()+'\nAUTHENTICATED_GENERATOR_URL='+endpoint+'\n',{mode:0o600});fs.chmodSync('.env.local',0o600);
console.log(JSON.stringify({functionName:name,region,endpoint,reservedConcurrency:2,model:variables.ANTHROPIC_MODEL}));
