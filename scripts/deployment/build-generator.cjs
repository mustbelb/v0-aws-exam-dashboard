const fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
const destination=path.resolve('lambda/question-generator/dist');fs.mkdirSync(destination,{recursive:true});
for(const file of ['index.mjs','runtime.mjs'])fs.copyFileSync('lambda/question-generator/'+file,path.join(destination,file));
for(const file of ['generated-question','services'])fs.writeFileSync(path.join(destination,file+'.mjs'),ts.transpileModule(fs.readFileSync('lib/'+file+'.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText);
console.log('Built generator using shared question validation and service definitions.');
