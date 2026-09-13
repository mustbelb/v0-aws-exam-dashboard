// Configure only codex/staging using its own gitignored key file. Never prints key values.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{execFileSync}=require('node:child_process'),dotenv=require('dotenv');
const project='zfxhgywkgtgsbrcimhur',appId='d33uz7aibh12e5',branchName='codex/staging';
const env=dotenv.parse(fs.readFileSync('.env.staging.local'));
if(env.NEXT_PUBLIC_SUPABASE_URL!==`https://${project}.supabase.co` || env.DYNAMODB_TABLE_NAME!=='cert-galaxy-staging-questions' || env.APP_ENVIRONMENT!=='staging' || env.AUTHENTICATED_GENERATOR_URL!=='disabled')throw Error('Unexpected staging configuration');
for(const key of ['NEXT_PUBLIC_SUPABASE_ANON_KEY','SUPABASE_SECRET_KEY']){
 if(!env[key]||env[key].startsWith('REPLACE_')||env[key]==='staging-not-configured')throw Error('Staging API keys are not configured');
}
const keys=['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY','SUPABASE_SECRET_KEY','DYNAMODB_REGION','DYNAMODB_TABLE_NAME','APP_ENVIRONMENT','AUTHENTICATED_GENERATOR_URL'];
const environmentVariables=Object.fromEntries(keys.map(key=>[key,env[key]]));environmentVariables.DESIGN_PREVIEW='false';
function aws(args,input){let dir;try{
 const extra=[];if(input){dir=fs.mkdtempSync(path.join(os.tmpdir(),'cg-stage-config-'));const file=path.join(dir,'request.json');fs.writeFileSync(file,JSON.stringify(input),{mode:0o600});extra.push('--cli-input-json','file://'+file)}
 return JSON.parse(execFileSync('aws',[...args,...extra,'--profile','aws-exam-local','--region','us-east-2','--output','json'],{encoding:'utf8',stdio:['ignore','pipe','pipe']})||'{}');
}catch{throw Error('AWS staging configuration request failed; credential-bearing output suppressed')}finally{if(dir)fs.rmSync(dir,{recursive:true,force:true})}}
(async()=>{
 if(aws(['sts','get-caller-identity']).Account!=='996068820512')throw Error('Unexpected AWS account');
 const branch=aws(['amplify','get-branch','--app-id',appId,'--branch-name',branchName]).branch;
 if(branch.stage!=='BETA'||branch.computeRoleArn!=='arn:aws:iam::996068820512:role/cert-galaxy-staging-compute')throw Error('Unexpected staging branch');
 const {createClient}=require('@supabase/supabase-js');
 const client=createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.SUPABASE_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
 const {error}=await client.from('issued_questions').select('id',{count:'exact',head:true});
 if(error)throw Error('Staging server key/schema verification failed');
 aws(['amplify','update-branch'],{appId,branchName,environmentVariables,enableAutoBuild:false});
 const saved=aws(['amplify','get-branch','--app-id',appId,'--branch-name',branchName]).branch;
 if(!Object.entries(environmentVariables).every(([key,value])=>saved.environmentVariables[key]===value))throw Error('Staging environment verification mismatch');
 console.log(JSON.stringify({configured:true,branchName,project,url:'https://codex-staging.d33uz7aibh12e5.amplifyapp.com',automaticBuilds:false}));
})().catch(()=>{console.error('Staging configuration could not complete; verify private keys and scoped AWS access. No secret values logged.');process.exitCode=1});
