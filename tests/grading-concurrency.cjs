// Run only against the disposable database initialized by grading-db-fixture.sql.
const {execFileSync,execFile}=require('node:child_process');
const {promisify}=require('node:util');const assert=require('node:assert/strict');
const id=require('node:crypto').randomUUID();
const service='concurrency-'+id.slice(0,8);
const args=['-h','/private/tmp','-p','55439','-d','postgres','-v','ON_ERROR_STOP=1','-tA'];
const run=sql=>execFileSync('psql',[...args,'-c',sql],{encoding:'utf8'}).trim();
(async()=>{
run(`INSERT INTO public.issued_questions(id,user_id,service,certification,question_id,question_hash,question_text,correct_answer,explanation) VALUES('${id}','11111111-1111-4111-8111-111111111111','${service}','DVA-C02','${service}',md5('${service}'),'Concurrent fixture','B','{\"correct\":\"B\"}') ON CONFLICT DO NOTHING;`);
const results=await Promise.all(['A','B'].map(answer=>promisify(execFile)('psql',[...args,'-c','BEGIN','-c',"SELECT set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true)",'-c','SET LOCAL ROLE authenticated','-c',`SELECT public.submit_issued_answer('${id}','${answer}',1)`,'-c','COMMIT'])));
const saved=results.map(result=>JSON.parse(result.stdout.split('\n').find(line=>line.startsWith('{'))));
assert.equal(saved.filter(result=>result.alreadyAnswered===false).length,1);
assert.equal(saved[0].userAnswer,saved[1].userAnswer);assert.equal(saved[0].answeredCorrectly,saved[1].answeredCorrectly);
assert.equal(run(`SELECT count(*) FROM public.user_question_history WHERE service='${service}'`),'1');
assert.equal(run(`SELECT questions_attempted FROM public.user_progress WHERE service='${service}'`),'1');
console.log('PASS: simultaneous submissions return the same stored answer and increment once.');
})().catch(error=>{console.error(error);process.exitCode=1});
