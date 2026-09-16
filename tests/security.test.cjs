const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JenkinsApi,parseLocation}=require('./lib.cjs');
const root=path.join(__dirname,'..');
const api=new JenkinsApi(parseLocation('https://jenkins.test/jenkins/job/x/'));
async function withFetch(implementation,fn){const old=global.fetch;global.fetch=implementation;try{return await fn();}finally{global.fetch=old;}}
test('release manifest requests only activeTab, scripting and local storage',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'extension/manifest.json')));
 assert.deepEqual(manifest.permissions,['activeTab','scripting','storage']);assert.equal(manifest.host_permissions,undefined);assert.equal(manifest.content_scripts,undefined);assert.equal(manifest.web_accessible_resources,undefined);
});
test('API reads use GET, current session, no cache and no redirects',async()=>{
 await withFetch(async(url,opts)=>{assert.equal(url,'https://jenkins.test/jenkins/job/x/wfapi/runs');assert.equal(opts.method,'GET');assert.equal(opts.credentials,'same-origin');assert.equal(opts.redirect,'error');assert.equal(opts.cache,'no-store');return new Response('[]',{headers:{'Content-Type':'application/json'}});},async()=>assert.deepEqual(await api.runs(),[]));
});
test('403 is reported clearly',async()=>{await withFetch(async()=>new Response('Forbidden',{status:403}),()=>assert.rejects(api.runs(),/HTTP 403/));});
test('login HTML is rejected',async()=>{await withFetch(async()=>new Response('<html>Login</html>',{headers:{'Content-Type':'text/html'}}),()=>assert.rejects(api.runs(),/non-JSON/));});
test('malformed JSON is rejected',async()=>{await withFetch(async()=>new Response('{oops',{headers:{'Content-Type':'application/json'}}),()=>assert.rejects(api.runs(),/invalid JSON/));});
test('response size limit stops oversized reads',async()=>{await withFetch(async()=>new Response(JSON.stringify({x:'x'.repeat(400)}),{headers:{'Content-Type':'application/json'}}),()=>assert.rejects(api.json('/jenkins/job/x/wfapi/runs',undefined,100),/safety limit/));});
test('log display limit is surfaced, not silently discarded',async()=>{await withFetch(async()=>new Response(JSON.stringify({text:'x'.repeat(200005),hasMore:false}),{headers:{'Content-Type':'application/json'}}),async()=>{const log=await api.log({id:'2'},{id:'9'});assert.equal(log.text.length,200000);assert.equal(log.hasMore,true);});});
test('step details reject a mismatched node ID',async()=>{await withFetch(async()=>new Response(JSON.stringify({id:'10',stageFlowNodes:[]}),{headers:{'Content-Type':'application/json'}}),()=>assert.rejects(api.stage({id:'2'},{id:'9'}),/Unexpected node detail/));});
async function background(url,result=[]){
 let callback;const calls=[];
 const browser={action:{onClicked:{addListener:fn=>callback=fn},setBadgeText:async v=>calls.push(['badge',v]),setBadgeBackgroundColor:async v=>calls.push(['color',v]),setTitle:async v=>calls.push(['title',v])},scripting:{executeScript:async v=>{calls.push(['inject',v]);return result;}}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'extension/background.js'),'utf8'),{browser,console:{warn(){}}});
 await callback({id:42,url});return calls;
}
test('toolbar injects only into the explicitly clicked Jenkins tab',async()=>{const c=await background('https://jenkins.test/job/x/');const v=c.find(c=>c[0]==='inject')[1];assert.equal(v.target.tabId,42);assert.equal(v.files[0],'content.js');});
test('toolbar does not inject on non-job pages',async()=>{const c=await background('https://example.test/');assert.equal(c.some(c=>c[0]==='inject'),false);assert.equal(c.find(c=>c[0]==='badge')[1].text,'!');});
test('Firefox executeScript error results are not mistaken for success',async()=>{const c=await background('https://jenkins.test/job/x/',[{error:{message:'test failure'}}]);assert.equal(c.find(c=>c[0]==='badge')[1].text,'!');});
test('installed payload does not contain the supplied shell commands or preview fixture',()=>{const code=fs.readFileSync(path.join(root,'extension/content.js'),'utf8');assert.ok(!code.includes('bitbucket.twiket.com'));assert.ok(!code.includes('BUS-4497-agent-flow-improvements'));assert.ok(!code.includes('task ci:'));assert.ok(!fs.existsSync(path.join(root,'extension/preview')));});

test('tree endpoint is GET-only, same-origin and build-scoped',async()=>{
 await withFetch(async(url,opts)=>{assert.equal(url,'https://jenkins.test/jenkins/job/x/2/stages/tree');assert.equal(opts.method,'GET');return new Response('{"status":"ok","data":{"stages":[],"complete":true}}',{headers:{'Content-Type':'application/json'}});},async()=>assert.equal((await api.tree({id:'2'})).status,'ok'));
});
test('only a tree HTTP 404 becomes capability-unavailable; 403 remains an error',async()=>{
 await withFetch(async()=>new Response('',{status:404}),async()=>assert.equal(await api.tree({id:'2'}),null));
 await withFetch(async()=>new Response('',{status:403}),()=>assert.rejects(api.tree({id:'2'}),/HTTP 403/));
});
test('mutation endpoints and arbitrary URLs remain blocked after adding tree support',async()=>{
 for(const bad of ['/jenkins/job/x/2/stages/rerun','/jenkins/job/x/2/stages/tree?x=1','/jenkins/job/x/2/doDelete','/jenkins/job/x/config.xml','https://evil.test/jenkins/job/x/2/stages/tree'])await assert.rejects(api.json(bad),/Blocked/);
});
test('installed bundle contains no BUS_PROFILE or local grouping editor',()=>{
 const code=fs.readFileSync(path.join(root,'extension/content.js'),'utf8');assert.ok(!code.includes('BUS_PROFILE'));assert.ok(!code.includes('Load BUS preset'));
});
test('HTML fetch is GET-only, build-scoped and uses the same authenticated session',async()=>{
 await withFetch(async(url,opts)=>{assert.equal(url,'https://jenkins.test/jenkins/job/x/2/flowGraphTable/');assert.equal(opts.method,'GET');assert.equal(opts.credentials,'same-origin');assert.equal(opts.redirect,'error');assert.equal(opts.headers.Accept,'text/html');return new Response('<html></html>',{headers:{'Content-Type':'text/html'}});},async()=>assert.equal(await api.flowGraphTable({id:'2'}),'<html></html>'));
});
test('HTML API keeps permission failures distinct and rejects non-HTML',async()=>{
 await withFetch(async()=>new Response('',{status:403}),()=>assert.rejects(api.flowGraphTable({id:'2'}),/HTTP 403/));
 await withFetch(async()=>new Response('{}',{headers:{'Content-Type':'application/json'}}),()=>assert.rejects(api.flowGraphTable({id:'2'}),/non-HTML/));
});
test('adding HTML support does not permit Replay, Run, config, cross-job or query endpoints',async()=>{
 for(const bad of ['/jenkins/job/x/2/replay/','/jenkins/job/x/2/replay/run','/jenkins/job/x/2/flowGraphTable/?x=1','/jenkins/job/y/2/flowGraphTable/','/jenkins/job/x/2/flowGraphTable/../../configure'])await assert.rejects(api.json(bad),/Blocked/);
});
