const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict'), ts = require('typescript');
function load(path, mocks = {}, globals = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021, jsx: ts.JsxEmit.ReactJSX}}).outputText,
    {exports, require: name => name in mocks ? mocks[name] : require(name), console, URLSearchParams, ...globals});
  return exports;
}
const parser = load('lib/generated-question.ts');
const fixture = {question:'Which service?', options:{A:'One',B:'Two',C:'Three',D:'Four'}, correct:'b', explanation:{correct:'Two fits.',A:'One does not.',C:'Three does not.',D:'Four does not.'}, examTip:'Compare the requirements.'};
const json = JSON.stringify(fixture);
const plain = 'QUESTION: Which service?\nOPTION_A: One\nOPTION_B: Two\nOPTION_C: Three\nOPTION_D: Four\nCORRECT: b\nEXPLANATION_CORRECT: Two fits.\nEXPLANATION_A: One does not.\nEXPLANATION_C: Three does not.\nEXPLANATION_D: Four does not.\nEXAM_TIP: Compare the requirements.';
for (const text of [json, plain, '```json\n'+json+'\n```', plain.replaceAll('\n','\r\n')]) {
  const question = parser.parseGeneratedQuestion(text);
  assert.equal(question.correct, 'B');
  assert.equal(question.explanation.correct, 'Two fits.');
  assert.equal(question.explanation.D, 'Four does not.');
  assert.equal(question.examTip, fixture.examTip);
}
for (const bad of ['{}', json.slice(0,-1), JSON.stringify({...fixture,correct:'B or C'}), JSON.stringify({...fixture,options:{A:'One'}}), JSON.stringify({...fixture,explanation:{}}), JSON.stringify({...fixture,correct:2})]) assert.equal(parser.parseGeneratedQuestion(bad),null);
assert.equal(parser.parsePartialGeneratedQuestion('```json\n'+json).question,fixture.question);

(async () => {
for (const [path, exported] of [['app/practice/[service]/practice-client.tsx','PracticeClient'],['app/practice/random/[category]/random-practice-client.tsx','RandomPracticeClient']]) {
  const state=[], callbacks=[], cleanups=[], streams=[];
  const streamQuestionGeneration=async (params,callback,signal)=>new Promise((resolve,reject)=>{
    streams.push({signal,send(data){try{callback(data);if(data.type==='complete')resolve()}catch(error){reject(error)}}});
    signal.addEventListener('abort',()=>reject(new Error('Aborted')));
  });
  const react={useState:initial=>{const index=state.length;state.push(initial);return [initial,value=>{state[index]=value}]},useRef:current=>({current}),useCallback:fn=>{callbacks.push(fn);return fn},useEffect:fn=>cleanups.push(fn())};
  const mocks=new Proxy({'react':react,'@/lib/question-generation-client':{streamQuestionGeneration},'@/lib/generated-question':parser,'next/navigation':{useRouter:()=>({})}}, {has:()=>true,get:(obj,key)=>key in obj?obj[key]:key==='react/jsx-runtime'?require(key):new Proxy({}, {get:()=>()=>null})});
  const client=load(path,mocks,{AbortController,setTimeout:()=>0,clearTimeout:()=>{}});
  const service={id:'lambda',name:'Lambda',icon:'L'};
  client[exported]({user:{id:'user'},service,category:{id:'compute',name:'Compute'},servicesInCategory:[service],serviceProgress:{questionsAnswered:0,correctRate:0},categoryProgress:{questionsAnswered:0,correctRate:0},certification:'DVA-C02'});
  const generate=callbacks[1];
  const issued={issuanceId:'11111111-1111-4111-8111-111111111111',question:fixture.question,options:fixture.options};
  const pending=generate(); const stream=streams.at(-1);
  stream.send({type:'partial',question:{question:fixture.question,options:fixture.options}});
  assert.equal(state[0],null,'No submission before issuance');
  stream.send({type:'complete',question:issued});
  await pending;
  assert.equal(state[0].issuanceId,issued.issuanceId);assert.equal(state[0].correct,'');
  assert.equal(state[0].explanation.correct,'');
  if (exported==='RandomPracticeClient') assert.equal(state[0].service,'lambda');
  assert.equal(state[5],false);assert.equal(state[6],false);
  const invalid=generate(); streams.at(-1).send({type:'complete',question:fixture});await invalid;
  assert.equal(state[0],null);assert.ok(state[7]);
  const first=generate(); const old=streams.at(-1); const second=generate(); assert.equal(old.signal.aborted,true);
  const last=streams.at(-1); cleanups.forEach(fn=>fn?.());assert.equal(last.signal.aborted,true);await Promise.all([first,second]);
}
console.log('PASS: both practice clients require issued completion, withhold feedback before submission, preserve service metadata, and close replaced/unmounted streams.');
})().catch(error=>{console.error(error);process.exitCode=1});
