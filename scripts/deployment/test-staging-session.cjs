// Verify route-owned session refresh against synthetic staging accounts only.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { createServerClient } = require('@supabase/ssr');
const dotenv = require('dotenv');
const project = 'zfxhgywkgtgsbrcimhur';
const origin = 'https://codex-staging.d33uz7aibh12e5.amplifyapp.com';
const file = '.staging-test-users.json';
const env = dotenv.parse(fs.readFileSync('.env.staging.local'));
const credentials = JSON.parse(fs.readFileSync(file));
assert.equal(credentials.project, project);
assert.equal(env.NEXT_PUBLIC_SUPABASE_URL, `https://${project}.supabase.co`);
assert.equal(env.APP_ENVIRONMENT, 'staging');
const user = credentials.users[0];
const base = `sb-${project}-auth-token`;
let jar = {};
function persist() {
  user.cookies = jar;
  const encoded = Object.keys(jar).filter(k => k === base || k.startsWith(base+'.')).sort((a,b) => Number(a.split('.').at(-1))-Number(b.split('.').at(-1))).map(k => jar[k]).join('');
  user.sessionExpiresAt = JSON.parse(Buffer.from(encoded.slice(7), 'base64url').toString()).expires_at;
  fs.writeFileSync(file, JSON.stringify(credentials), {mode:0o600});
  fs.chmodSync(file, 0o600);
}
async function get(cookies) {
  const response = await fetch(origin+'/api/progress?certification=SAA-C03', {
    headers: {Cookie:Object.entries(cookies).map(([k,v]) => `${k}=${v}`).join('; ')},
    redirect:'error', signal:AbortSignal.timeout(15000),
  });
  await response.arrayBuffer();
  return response;
}
(async () => {
  assert.equal((await get({})).status, 401);
  assert.equal((await get({[base]:'invalid-session'})).status, 401);
  const client = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies:{getAll:() => Object.entries(jar).map(([name,value]) => ({name,value})), setAll: cookies => cookies.forEach(({name,value}) => {jar[name]=value})},
  });
  const {data,error} = await client.auth.signInWithPassword({email:user.email,password:user.password});
  if(error || !data.session) throw Error('Synthetic sign-in failed');
  persist();
  assert.equal((await get(jar)).status, 200);
  // Expire the cookie session metadata; the genuine refresh token remains unchanged.
  const expired = {...data.session, expires_at:1};
  jar = {[base]:'base64-'+Buffer.from(JSON.stringify(expired)).toString('base64url')};
  const refreshed = await get(jar);
  assert.equal(refreshed.status, 200);
  const headers = refreshed.headers.getSetCookie();
  assert(headers.some(value => value.startsWith(base)), 'Route must return refreshed auth cookies');
  jar = {};
  for(const header of headers) {
    const pair = header.split(';')[0], split = pair.indexOf('=');
    const name = pair.slice(0,split), value = pair.slice(split+1);
    if(name.startsWith(base) && value) jar[name] = value;
  }
  persist();
  assert(user.sessionExpiresAt > Date.now()/1000);
  assert.equal((await get(jar)).status, 200);
  console.log('PASS: staging rejects missing/invalid sessions, accepts valid sessions, refreshes expired session metadata, and accepts returned cookies.');
})().catch(() => {console.error('Staging session check failed; credentials and response bodies suppressed.'); process.exitCode=1;});
