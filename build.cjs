#!/usr/bin/env node
/* Offline reproducible build. No downloaded code, eval, CDN or package manager required. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ts=require('./tools/typescript.cjs');
const ROOT=__dirname;
const aliases={
  react:'runtime/react.cjs','react-dom':'runtime/react-dom.cjs','react-dom/client':'runtime/react-dom.cjs',
  'react/jsx-runtime':'runtime/jsx-runtime.cjs','react-zoom-pan-pinch':'src/compat/zoom-context.ts'
};
const boundaries={
  'upstream/common/i18n/index.ts':'src/compat/i18n.tsx',
  'upstream/common/components/tooltip.tsx':'src/compat/tooltip.tsx',
  'upstream/common/user/user-preferences-provider.tsx':'src/compat/preferences.tsx',
  'upstream/common/utils/live-total.tsx':'src/compat/live-total.tsx'
};
function resolve(spec,from=''){
  if(aliases[spec])return aliases[spec];
  if(!spec.startsWith('.'))throw new Error('Unresolved package: '+spec+' from '+from);
  let id=path.posix.normalize(path.posix.join(path.posix.dirname(from),spec));
  if(id.endsWith('.scss'))return '@empty';
  if(boundaries[id])return boundaries[id];
  for(const f of [id,id+'.ts',id+'.tsx',id+'.js',id+'/index.ts'])if(fs.existsSync(path.join(ROOT,f))&&fs.statSync(path.join(ROOT,f)).isFile())return boundaries[f]||f;
  throw new Error('Cannot resolve '+spec+' from '+from);
}
const applied=[];
function patch(id,text){
  function replace(before,after,reason){if(!text.includes(before))throw new Error('Patch does not apply: '+reason);text=text.replaceAll(before,after);applied.push({file:id,reason});}
  if(id.endsWith('/support/nodes.tsx')){
    replace('total={stage.totalDurationMillis}', 'label={(stage as any).pgvxDurationLabel} total={stage.totalDurationMillis}', 'Surface HTML-rounded timing in counter tooltips.');
    replace('total={node.stage.totalDurationMillis}', 'label={(node.stage as any).pgvxDurationLabel} total={node.stage.totalDurationMillis}', 'Surface approximate or unavailable HTML timing in node tooltips.');
    replace('document.head.dataset.rooturl + stage.url','stage.url','Use job-local native links without Jenkins JavaScript globals.');
    replace('document.head.dataset.rooturl + url','url','Use job-local stage links.');
    replace('history.replaceState({}, "", e.currentTarget.href);','','Do not navigate to plugin-only URLs when selecting a node.');
    replace('href={node.url}','href={node.url?.replace("stages/?selected-node=-1", "console")}','Start-node fallback opens the native console.');
  }
  if(id.endsWith('/PipelineGraphModel.tsx')){
    replace('export const nestedLayout = () => isFlagEnabled("nestedLayout", true);','export const nestedLayout = () => true;','Always use the supplied nested renderer; isolate page flags.');
    replace('export const debugPipelineGraph = () => isFlagEnabled("debugPipelineGraph");','export const debugPipelineGraph = () => false;','Disable page-controlled layout debug mode.');
  }
  if(id.endsWith('/support/labels.tsx')){
    replace('total={details.stage?.totalDurationMillis}', 'label={(details.stage as any)?.pgvxDurationLabel} total={details.stage?.totalDurationMillis}', 'Preserve timing precision labels in graph timing labels.');
    replace('onClick={handleClick}\n      role="button"','onClick={handleClick}\n      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); if (onToggleCollapse && stage) onToggleCollapse(stage.id); } }}\n      role="button"','Add keyboard activation to the upstream collapse badge.');
  }
  return text;
}
function bundle(entry,output,asModule=false){
  const modules=new Map();
  function add(id){
    if(modules.has(id))return;
    modules.set(id,'');
    let code;
    if(id==='@empty')code='module.exports={};';
    else if(id.endsWith('.css'))code='module.exports='+JSON.stringify(fs.readFileSync(path.join(ROOT,id),'utf8'))+';';
    else {
      let text=patch(id,fs.readFileSync(path.join(ROOT,id),'utf8'));
      if(/\.tsx?$/.test(id)){
        const result=ts.transpileModule(text,{fileName:id,reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,isolatedModules:true}});
        const errors=(result.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error);
        if(errors.length)throw new Error(id+': '+errors.map(d=>ts.flattenDiagnosticMessageText(d.messageText,' ')).join('\n'));
        code=result.outputText;
      }else code=text;
      code=code.replace(/process\.env\.NODE_ENV/g,'"production"');
      code=code.replace(/\brequire\((['"])([^'"]+)\1\)/g,(_,q,spec)=>{const dep=resolve(spec,id);add(dep);return 'require('+JSON.stringify(dep)+')';});
    }
    modules.set(id,code);
  }
  add(entry);
  const header='/* Pipeline Graph Local 0.3.0. Upstream tag 1013.v9f83fd83c063, MIT. React MIT. See LICENSES. */\n';
  let code=header+'(()=>{\n"use strict";\nconst modules={\n'+[...modules].map(([id,body])=>JSON.stringify(id)+':function(module,exports,require){\n'+body+'\n}').join(',\n')+'\n};\nconst cache=Object.create(null);\nfunction require(id){if(cache[id])return cache[id].exports;const module=cache[id]={exports:{}};if(!modules[id])throw new Error("Missing module: "+id);modules[id](module,module.exports,require);return module.exports;}\n';
  code+=(asModule?'module.exports = ':'')+'require('+JSON.stringify(entry)+');\n})();\n';
  fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,code);
  return {modules:modules.size,bytes:Buffer.byteLength(code)};
}
// Verify the copied upstream sources before building; never silently replace them.
const manifest=JSON.parse(fs.readFileSync(path.join(ROOT,'UPSTREAM-HASHES.json')));
for(const [file,want]of Object.entries(manifest.files)){
  const got=crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,file))).digest('hex');
  if(got!==want)throw new Error('Vendored source differs from recorded hash: '+file);
}
fs.mkdirSync(path.join(ROOT,'extension'),{recursive:true});
const result=bundle('src/content.tsx',path.join(ROOT,'extension/content.js'));
for(const file of ['manifest.json','icon.svg','README.md','NOTICE.md','LICENSE','TEST-REPORT.md'])fs.copyFileSync(path.join(ROOT,file),path.join(ROOT,'extension',file));
fs.copyFileSync(path.join(ROOT,'src/background.js'),path.join(ROOT,'extension/background.js'));
fs.cpSync(path.join(ROOT,'licenses'),path.join(ROOT,'extension/LICENSES'),{recursive:true});
// Build pure adapter / layout modules for Node tests, with the same compiler and patches.
bundle('tests/entry.ts',path.join(ROOT,'tests/lib.cjs'),true);
bundle('tests/browser-entry.tsx',path.join(ROOT,'tests/browser-bundle.js')); 
fs.writeFileSync(path.join(ROOT,'BUILD-REPORT.json'),JSON.stringify({upstreamTag:manifest.tag,typescript:ts.version,react:'18.2.0',bundle:result,patches:applied.filter((p,i,arr)=>arr.findIndex(q=>q.file===p.file&&q.reason===p.reason)===i),note:'TypeScript syntax transpilation, not full semantic type checking.'},null,2)+'\n');
console.log('Built extension/content.js: '+result.bytes+' bytes, '+result.modules+' modules.');
