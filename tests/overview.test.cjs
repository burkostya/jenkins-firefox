const test=require('node:test'),assert=require('node:assert/strict');
const {parseLocation,JenkinsApi,OVERVIEW_TREE,BUILD_FIELDS,normalizeOverview,normalizeBuild,testsFromActions,artifactUrl,normalizeBuildMenu,loadBuildMenu}=require('./lib.cjs');
const raw=require('./fixtures/job-overview.json');
const location=parseLocation('https://jenkins.test/job/example-service/job/feature-release/');
const api=new JenkinsApi(location);
const copy=()=>JSON.parse(JSON.stringify(raw));
async function mock(fn,task){const old=global.fetch;global.fetch=fn;try{return await task();}finally{global.fetch=old;}}
test('four supplied build cases preserve result, absence and archived artifacts',()=>{
 const job=normalizeOverview(raw,location);assert.equal(job.builds.length,4);
 assert.deepEqual(job.builds[0].tests,{state:'reported',total:4118,passed:4105,failed:0,skipped:13});
 assert.equal(job.builds[1].tests.state,'absent');assert.deepEqual(job.builds[1].artifacts,[]);
 assert.equal(job.builds[2].result,'NOT_BUILT');assert.equal(job.builds[2].artifacts[0].path,'tmp/govulncheck-output.json');
 assert.equal(job.builds[3].result,'NOT_BUILT');assert.deepEqual(job.builds[3].artifacts,[]);
});
test('missing report, missing metadata, zero tests and invalid counters differ',()=>{
 assert.equal(testsFromActions([]).state,'absent');assert.equal(testsFromActions(undefined).state,'unavailable');
 const action={_class:'hudson.tasks.junit.TestResultAction',totalCount:0,failCount:0,skipCount:0};
 assert.equal(testsFromActions([action]).state,'reported');
 for(const v of [{totalCount:2,failCount:3},{skipCount:-1},{failCount:'0'},{totalCount:NaN},{skipCount:Infinity}])assert.equal(testsFromActions([{...action,...v}]).state,'unavailable');
 assert.equal(testsFromActions([action,action]).state,'unavailable');
 assert.equal(testsFromActions([{totalCount:100,failCount:0,skipCount:0}]).state,'absent');
});
test('job identity, duplicates and out-of-range data fail closed',()=>{
 for(const edit of [x=>x.fullName='other/job',x=>x.builds.push(x.builds[0]),x=>x.builds[0].number=0,x=>x.builds[0].building='false',x=>x._class='hudson.model.FreeStyleProject']){
 const v=copy();edit(v);assert.throws(()=>normalizeOverview(v,location));
 }
 assert.throws(()=>normalizeBuild(raw.builds[0],location,3),/identity/);
});
test('encoded branch names and Jenkins context prefixes work',()=>{
 const loc=parseLocation('https://jenkins.test/jenkins/job/team/job/feature%2Fone/');
 const v=copy();v.fullName='team/feature/one';assert.equal(normalizeOverview(v,loc).builds[0].url,'https://jenkins.test/jenkins/job/team/job/feature%2Fone/4/');
 assert.equal(parseLocation('https://jenkins.test/job/x/changes/').isJobPage,false);
 assert.equal(parseLocation('https://jenkins.test/job/x/').isJobPage,true);
});
test('untrusted response URLs are not used for artifacts or report links',()=>{
 const v=copy();v.builds[0].url='https://attacker.test/';const b=normalizeOverview(v,location).builds[0];
 assert.equal(b.url,'https://jenkins.test/job/example-service/job/feature-release/4/');
 assert.ok(b.artifacts.every(a=>a.href.startsWith(b.url+'artifact/')));
});
test('artifact URL encoding preserves names while rejecting special/traversal paths',()=>{
 const base='https://jenkins.test/job/example-service/job/feature-release/4/artifact/';
 assert.equal(artifactUrl(location,4,'tmp/a b#?.json'),base+'tmp/a%20b%23%3F.json');
 for(const p of ['../config.xml','a/../../build','/absolute','a//b','a/./b','a\\b','a\0b','%2e%2e/x','%252e%252e/x','x/%2fsecret','x/*view*','x/%2aview%2a','x/%255csecret'])assert.throws(()=>artifactUrl(location,4,p),p);
 const b=normalizeBuild({...raw.builds[0],artifacts:[{relativePath:'../bad'},{relativePath:'ok.txt'}]},location);assert.equal(b.artifacts.length,1);assert.equal(b.warnings.length,1);
});
test('missing artifact array is unavailable, not silently empty',()=>{
 const b={...raw.builds[0]};delete b.artifacts;assert.equal(normalizeBuild(b,location).artifacts,null);
});
test('active build with null result remains IN_PROGRESS',()=>{
 assert.equal(normalizeBuild({...raw.builds[0],building:true,result:null},location).result,'IN_PROGRESS');
});
test('overview uses one fixed, read-only same-job JSON query',async()=>{
 await mock(async(url,opts)=>{const u=new URL(url);assert.equal(u.pathname,location.jobPath+'api/json');assert.equal(u.searchParams.get('tree'),OVERVIEW_TREE);assert.equal(opts.method,'GET');assert.equal(opts.credentials,'same-origin');assert.equal(opts.redirect,'error');return Response.json(raw);},async()=>assert.equal((await api.overview()).builds[0].number,4));
});
test('specific build metadata must match the requested build',async()=>{
 await mock(async(url)=>{const u=new URL(url);assert.equal(u.pathname,location.jobPath+'3/api/json');assert.equal(u.searchParams.get('tree'),BUILD_FIELDS);return Response.json(raw.builds[0]);},()=>assert.rejects(api.buildOverview(3),/identity/));
});
test('build context menu keeps same-job GET navigation and refuses mutations',async()=>{
 const build='https://jenkins.test/job/example-service/job/feature-release/4/';
 const payload={items:[
  {type:'ITEM',displayName:'Changes',url:build+'changes',post:false,requiresConfirmation:false},
  {type:'SEPARATOR'},
  {type:'HEADER',displayName:'More'},
  {type:'ITEM',displayName:'Delete build',url:build+'doDelete',post:true,requiresConfirmation:true},
  {type:'ITEM',displayName:'External',url:'https://attacker.test/'},
  {type:'ITEM',displayName:'Job page',url:'https://jenkins.test/job/example-service/job/feature-release/',post:false,requiresConfirmation:false}
 ]};
 const menu=normalizeBuildMenu(payload,build);
 assert.deepEqual(menu,[
  {kind:'link',label:'Changes',href:build+'changes'},
  {kind:'separator'},
  {kind:'header',label:'More'},
  {kind:'disabled',label:'Delete build',reason:'Use the original Jenkins page for this action.'},
  {kind:'link',label:'Job page',href:'https://jenkins.test/job/example-service/job/feature-release/'}
 ]);
 await mock(async(url,opts)=>{const u=new URL(url);assert.equal(u.href,build+'contextMenu');assert.equal(opts.method,'GET');assert.equal(opts.credentials,'same-origin');assert.equal(opts.redirect,'error');return Response.json(payload);},async()=>assert.deepEqual(await loadBuildMenu(build),menu));
});
test('build context menu rejects foreign bases, non-JSON and oversized schemas',async()=>{
 assert.throws(()=>normalizeBuildMenu({items:[]},'https://jenkins.test/job/example-service/job/feature-release/not-a-build/'));
 assert.throws(()=>normalizeBuildMenu({items:new Array(101).fill({})},'https://jenkins.test/job/example-service/job/feature-release/4/'));
 await mock(async()=>new Response('<html>Login</html>',{headers:{'Content-Type':'text/html'}}),()=>assert.rejects(loadBuildMenu('https://jenkins.test/job/example-service/job/feature-release/4/'),/non-JSON/));
});
test('new Remote API capability does not expose arbitrary tree, depth or mutations',async()=>{
 for(const path of ['api/json','api/json?depth=2','api/json?tree=actions[parameters[*]]','api/json?tree='+encodeURIComponent(OVERVIEW_TREE)+'&depth=1','4/api/json?tree='+encodeURIComponent(OVERVIEW_TREE),'4/build','config.xml','4/api/json?tree='+encodeURIComponent(BUILD_FIELDS)+'#x'])await assert.rejects(api.json(location.jobPath+path),/Blocked/);
});
test('overview errors do not masquerade as empty metadata',async()=>{
 await mock(async()=>new Response('',{status:403}),()=>assert.rejects(api.overview(),/403/));
 await mock(async()=>new Response('<html>Login</html>',{headers:{'Content-Type':'text/html'}}),()=>assert.rejects(api.overview(),/non-JSON/));
});
