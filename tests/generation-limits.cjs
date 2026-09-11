const {execFile}=require('node:child_process');const {promisify}=require('node:util');const assert=require('node:assert/strict');const exec=promisify(execFile);
const sql=async(text)=>(await exec('psql',['-h','/private/tmp','-p','55439','-d','postgres','-v','ON_ERROR_STOP=1','-Atc',text])).stdout.trim();
(async()=>{
const user='33333333-3333-4333-8333-333333333333';
await sql(`INSERT INTO auth.users(id) VALUES('${user}') ON CONFLICT DO NOTHING; DELETE FROM public.question_generation_requests WHERE user_id='${user}'`);
for(const role of ['anon','authenticated'])await assert.rejects(()=>sql(`SET ROLE ${role};SELECT public.reserve_question_generation('${user}')`));
const results=await Promise.all(Array.from({length:12},()=>sql(`SET ROLE service_role;SELECT public.reserve_question_generation('${user}')`)));
assert.equal(results.filter(s=>s.endsWith('t')).length,3);assert.equal(await sql(`SELECT count(*) FROM public.question_generation_requests WHERE user_id='${user}'`),'3');
await sql(`UPDATE public.question_generation_requests SET created_at=now()-interval '5 minutes' WHERE user_id='${user}';INSERT INTO public.question_generation_requests(user_id,created_at) SELECT '${user}',now()-interval '10 minutes' FROM generate_series(1,17)`);
assert.ok((await sql(`SET ROLE service_role;SELECT public.reserve_question_generation('${user}')`)).endsWith('f'));
await sql(`UPDATE public.question_generation_requests SET created_at=now()-interval '2 hours' WHERE user_id='${user}'`);
assert.ok((await sql(`SET ROLE service_role;SELECT public.reserve_question_generation('${user}')`)).endsWith('t'));
console.log('PASS: server-only quota reservation, 12 simultaneous calls capped at 3, hourly ceiling and window expiry.');
})().catch(e=>{console.error(e.message);process.exitCode=1});
