const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process');
const script=path.resolve('scripts/hosting/write-env.cjs');
const base={APP_ENVIRONMENT:'staging',NEXT_PUBLIC_SUPABASE_URL:'https://abcdefghijklmnopqrst.supabase.co',NEXT_PUBLIC_SUPABASE_ANON_KEY:'synthetic-public-key',SUPABASE_SECRET_KEY:'synthetic-private-key',DYNAMODB_TABLE_NAME:'cert-galaxy-staging-questions',DYNAMODB_REGION:'us-east-2'};
function run(overrides={}){const cwd=fs.mkdtempSync(path.join(os.tmpdir(),'staging-config-'));try{const result=spawnSync(process.execPath,[script],{cwd,env:{...base,...overrides},encoding:'utf8'});return {status:result.status,output:fs.existsSync(path.join(cwd,'.env.production'))?fs.readFileSync(path.join(cwd,'.env.production'),'utf8'):null}}finally{fs.rmSync(cwd,{recursive:true,force:true})}}
assert.equal(run().status,0);
for(const overrides of [
 {NEXT_PUBLIC_SUPABASE_URL:'https://rbquwmbthcuvxmowtwej.supabase.co'},
 {NEXT_PUBLIC_SUPABASE_URL:'https://rerlbckqpphqhukasotw.supabase.co'},
 {DYNAMODB_TABLE_NAME:'exam-questions'},
 {AUTHENTICATED_GENERATOR_URL:'https://synthetic.lambda-url.us-east-2.on.aws/'},
 {SUPABASE_SECRET_KEY:''},
]){const result=run(overrides);assert.notEqual(result.status,0);assert.equal(result.output,null)}
assert.ok(run().output.includes('APP_ENVIRONMENT="staging"'));
console.log('PASS: staging configuration rejects production/legacy databases, production question table, generation endpoint, and missing issuance key.');
