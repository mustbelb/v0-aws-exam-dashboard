const fs=require('fs'),vm=require('vm'),ts=require('typescript');
let active;
const icons=new Proxy({}, {get:(_,n)=>String(n)});
const react={useState:initial=>active.state(initial),useEffect:(fn,deps)=>active.effect(fn,deps)};
const hookExports={};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('hooks/use-explainer-playback.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{exports:hookExports,require:()=>react,setTimeout:(fn,ms)=>active.timeout(fn,ms),clearTimeout:id=>active.timers.delete(id)});
const hook={useExplainerPlayback:(...args)=>(active.playback=hookExports.useExplainerPlayback(...args))};
const jsx=(type,props)=>({type,props:props||{}});
function walk(n,fn){if(!n)return; if(Array.isArray(n)){n.forEach(x=>walk(x,fn));return;} if(typeof n==='object'){fn(n);walk(n.props?.children,fn);}}
function button(tree,icon){let found;walk(tree,n=>{if(n.type==='button')walk(n.props.children,c=>{if(c.type===icon)found=n;});});return found;}
function normalized(tree){return JSON.stringify(tree,(k,v)=>typeof v==='function'?undefined:v);}
function visual(tree){let result;walk(tree,n=>{if(!result && n.type==='div' && /bg-(?:slate|gray)-900\/50/.test(n.props?.className||''))result=n;});return result;}
class Harness {
 constructor(component){this.component=component;this.hooks=[];this.timers=new Map();this.clock=0;this.id=0;this.dirty=true;}
 state(initial){const i=this.cursor++;if(!(i in this.hooks))this.hooks[i]=typeof initial==='function'?initial():initial;return [this.hooks[i],v=>{const next=typeof v==='function'?v(this.hooks[i]):v;if(!Object.is(next,this.hooks[i])){this.hooks[i]=next;this.dirty=true;}}];}
 effect(fn,deps){const i=this.cursor++,old=this.hooks[i];if(!old||deps.some((d,j)=>!Object.is(d,old.deps[j])))this.pending.push(()=>{old?.cleanup?.();this.hooks[i]={deps,cleanup:fn()};});}
 render(){let count=0;do{if(count++>20)throw Error('render loop');active=this;this.cursor=0;this.pending=[];this.dirty=false;this.tree=this.component();this.pending.forEach(f=>f());}while(this.dirty);return this.tree;}
 click(icon){const b=button(this.tree,icon);if(!b||b.props.disabled)return false;b.props.onClick();this.render();return true;}
 advance(ms){const end=this.clock+ms;let count=0;while(count++<200){const pair=[...this.timers.entries()].filter(([,t])=>t.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!pair)break;const [id,t]=pair;this.clock=t.at;this.timers.delete(id);if(t.interval)this.timers.set(id,{...t,at:this.clock+t.interval});t.fn();this.render();}this.clock=end;}
 timeout(fn,ms){const id=++this.id;this.timers.set(id,{fn,at:this.clock+ms});return id;}
}
const results=[];
for(const file of fs.readdirSync('components/explainers').filter(f=>f.endsWith('.tsx'))){
 const source=fs.readFileSync('components/explainers/'+file,'utf8');const exports={};
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020}}).outputText;
 vm.runInNewContext(js,{exports,require:n=>n==='react'?react:n==='@/hooks/use-explainer-playback'?hook:n==='lucide-react'?icons:{jsx,jsxs:jsx,Fragment:'fragment'},setTimeout:(fn,ms)=>active.timeout(fn,ms),clearTimeout:id=>active.timers.delete(id),setInterval:(fn,ms)=>{const id=active.timeout(fn,ms);active.timers.get(id).interval=ms;return id;},clearInterval:id=>active.timers.delete(id),console,Math});
 const registry=Object.entries(exports).find(([key,val])=>key.endsWith('Explainers')&&typeof val==='object')[1];
 for(const [id,component]of Object.entries(registry)){
  const r={id,file,component:component.name};results.push(r);
  try{const h=new Harness(component);h.render();const first=normalized(visual(h.tree));r.visualLocated=!!visual(h.tree);h.click('Play');h.advance(3100);r.advances=h.playback.step===1;r.firstVisualChanges=normalized(visual(h.tree))!==first;
  h.click('Pause');const paused=h.playback.step;h.advance(6000);r.pauses=h.playback.step===paused && h.timers.size===0;
  h.click('Play');h.advance(60000);r.lastStep=h.playback.step;r.stopsAtEnd=!!button(h.tree,'Play')&&!button(h.tree,'Pause');h.click('Play');h.advance(3100);r.replays=h.playback.step!==r.lastStep;
  h.click('RotateCcw');r.resets=h.playback.step===0&&!!button(h.tree,'Play')&&h.timers.size===0;
  const visuals=new Set([normalized(visual(h.tree))]);let guard=0;while(guard++<20 && button(h.tree,'ChevronRight')&&!button(h.tree,'ChevronRight').props.disabled){h.click('ChevronRight');visuals.add(normalized(visual(h.tree)));}r.visualStates=visuals.size;
  }catch(e){r.error=e.message;}
 }
}

console.log(JSON.stringify({total:results.length,errors:results.filter(r=>r.error),advanceFailures:results.filter(r=>!r.advances).map(r=>r.id),pauseFailures:results.filter(r=>!r.pauses).map(r=>r.id),resetFailures:results.filter(r=>!r.resets).map(r=>r.id),noReplay:results.filter(r=>!r.replays).length,visualLocated:results.filter(r=>r.visualLocated).length,staticVisuals:results.filter(r=>r.visualLocated&&r.visualStates===1).map(r=>r.id)},null,2));

const failures=results.filter(r=>r.error||!r.advances||!r.pauses||!r.resets||!r.replays||!r.stopsAtEnd);if(failures.length){console.error(failures);process.exitCode=1;}
