const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
function load(path,mocks={}) {const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2021}}).outputText,{exports,require:name=>mocks[name]||require(name),TextDecoder});return exports;}
const parser=load('lib/generated-question.ts');
const {readGeneratedQuestion}=load('lib/generation-events.ts',{'@/lib/generated-question':parser});
const fixture={question:'Café ☕ question?',options:{A:'a',B:'b',C:'c',D:'d'},correct:'B',explanation:{correct:'Private feedback'},examTip:'Private tip'};
const event=data=>'data: '+JSON.stringify(data)+'\r\n\r\n';
const encoded=text=>new TextEncoder().encode(text);
function body(text,step=1) {const bytes=encoded(text);let index=0;return new ReadableStream({pull(controller){if(index>=bytes.length)return controller.close();controller.enqueue(bytes.slice(index,index+step));index+=step;}});}
(async()=>{
 const content=JSON.stringify(fixture);
 const wire=[...content].map(character=>event({type:'character',character})).join('')+event({type:'complete'});
 const partials=[];const question=await readGeneratedQuestion(body(wire),partial=>partials.push(partial));
 assert.equal(question.question,fixture.question);assert.equal(question.correct,'B');
 assert.ok(partials.length>0);const publicData=JSON.stringify(partials);assert.ok(!publicData.includes('Private feedback'));assert.ok(!publicData.includes('Private tip'));assert.ok(!publicData.includes('"correct"'));
 const chunked=await readGeneratedQuestion(body(event({type:'chunk',content})+event({type:'complete'}),13),()=>{});assert.equal(chunked.correct,'B');
 for (const bad of [event({type:'chunk',content}),event({type:'chunk',content:'{}'})+event({type:'complete'}),event({type:'error',error:'Provider failure'}),event({type:'chunk',content:5}),event({type:'chunk',content:'x'.repeat(64001)})]) await assert.rejects(()=>readGeneratedQuestion(body(bad,100000),()=>{}));
 console.log('PASS: fragmented UTF-8/SSE, sanitized progressive display, complete-only issuance, provider errors, invalid and oversized output.');
})().catch(error=>{console.error(error);process.exitCode=1});
