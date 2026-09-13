const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
let authCalls=0,authenticated=false,refresh=false;
const exportsObject={};
const next=()=>({cookies:{values:{},set(name,value){this.values[name]=value}}});
const mocks = {
  '@supabase/ssr': {
    createServerClient: (url, key, options) => ({
      auth: {
        getUser: async () => {
          authCalls++;
          if (refresh) options.cookies.setAll([{name:'test-cookie', value:'refreshed', options:{httpOnly:true}}]);
          return {data: {user: authenticated ? {id:'synthetic'} : null}};
        },
      },
    }),
  },
  'next/server': {NextResponse: {next, redirect: url => ({redirect:url})}},
};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('middleware.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2021}}).outputText,{exports:exportsObject,require:name=>mocks[name],process:{env:{}}});
const request=path=>{const url=new URL('https://synthetic.invalid'+path);url.clone=()=>new URL(url);return {nextUrl:url,cookies:{getAll:()=>[],set(){}}}};
(async()=>{
 for(const path of ['/api/question/next','/api/question/submit','/api/question/generate','/api/progress'])await exportsObject.middleware(request(path));
 assert.equal(authCalls,0,'audited API handlers own authentication without a duplicate middleware call');
 await exportsObject.middleware(request('/api/future'));assert.equal(authCalls,1,'new API paths are not silently excluded');
 const denied=await exportsObject.middleware(request('/dashboard'));assert.equal(denied.redirect.pathname,'/auth/login');
 const practice=await exportsObject.middleware(request('/practice/lambda'));assert.equal(practice.redirect.searchParams.get('redirect'),'/practice/lambda');
 authenticated=true;refresh=true;
 const page=await exportsObject.middleware(request('/dashboard'));assert.equal(page.cookies.values['test-cookie'],'refreshed');
 const auth=await exportsObject.middleware(request('/auth/login'));assert.equal(auth.redirect.pathname,'/dashboard');
 console.log('PASS: only audited API routes skip duplicate auth; protected-page redirects and page refresh cookies remain.');
})().catch(error=>{console.error(error);process.exitCode=1});
