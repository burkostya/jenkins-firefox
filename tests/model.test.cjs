const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const m=require('./lib.cjs');
const run=JSON.parse(fs.readFileSync(path.join(__dirname,'../preview/runs.json')))[0];
const tree=JSON.parse(fs.readFileSync(path.join(__dirname,'tree-fixture.json')));
const runPath='/job/bus_backend/job/BUS-4497-agent-flow-improvements/2/';
const copy=v=>JSON.parse(JSON.stringify(v));
const adapt=(v=tree,r=run)=>m.adaptTree(v,r,runPath);
test('flat adapter preserves all 16 supplied stages without creating parents',()=>{
 const a=m.adaptFlatRun(run,runPath);assert.equal(a.source,'wfapi');assert.equal(a.stages.length,16);
 assert.ok(a.stages.every(n=>n.children.length===0));assert.deepEqual(a.stages.map(n=>n.id),run.stages.map(n=>+n.id));
});
test('raw Test status and 139ms are preserved but not treated as an enclosing stage',()=>{
 const a=m.adaptFlatRun(run,runPath),t=a.stages.find(n=>n.name==='Test');
 assert.equal(t.state,'success');assert.equal(t.totalDurationMillis,139);assert.deepEqual(t.children,[]);
});
test('server tree provides Test containment; wfapi SUCCESS does not overwrite server FAILURE',()=>{
 const a=adapt(),t=a.stages.find(n=>n.name==='Test');assert.equal(a.source,'pipeline-graph-view');
 assert.equal(t.state,'failure');assert.equal(t.children.length,5);assert.equal(t.totalDurationMillis,662685);
 assert.ok(t.children.every(n=>n.type==='PARALLEL'));assert.equal(a.meta.get(t.id).raw.status,'SUCCESS');
});
test('server timings are preserved, not summed and not recomputed from wfapi',()=>{
 const fixture=copy(tree);fixture.data.stages[3].totalDurationMillis=12345;
 assert.equal(adapt(fixture).stages[3].totalDurationMillis,12345);
});
test('no synthetic Checks or Migrations are inserted',()=>{
 assert.ok(!m.walkStages(adapt().stages).some(n=>['Checks','Migrations','Build & Quality'].includes(n.name)));
});
test('exact IDs, not stage names, determine optional wfapi details matching',()=>{
 const fixture=copy(tree);fixture.data.stages[3].children[0].id='9093';
 const a=adapt(fixture);assert.equal(a.meta.get(9093).raw,undefined);
});
test('string IDs are normalized consistently for selection and collapse',()=>{
 const a=adapt();assert.ok(m.walkStages(a.stages).every(n=>typeof n.id==='number'));
 const c=m.collapseSelectiveStages(a.stages,new Set([81]));assert.equal(c[3].children.length,0);assert.equal(c[3].state,'failure');
});
test('upstream collapsed badge aggregates descendant failure even when parent state is success',()=>{
 const fixture=copy(tree);fixture.data.stages[3].state='success';const a=adapt(fixture);
 assert.equal(a.stages[3].state,'success');assert.equal(m.collapseSelectiveStages(a.stages,new Set([81]))[3].state,'failure');
});
test('duplicate IDs, unknown node types and legacy nextSibling are rejected',()=>{
 for(const mutate of [v=>v.data.stages[3].children[0].id='81',v=>v.data.stages[0].type='EVIL',v=>v.data.stages[0].nextSibling={id:999}]){
  const fixture=copy(tree);mutate(fixture);assert.throws(()=>adapt(fixture));
 }
});
test('malformed tree envelope cannot silently become a flat successful graph',()=>{
 for(const bad of [{stages:[]},{status:'ok',data:{stages:[]}},{status:'error',data:{stages:[],complete:true}}])assert.throws(()=>adapt(bad));
});
test('tree structure budget is enforced',()=>{
 const fixture=copy(tree);let n=fixture.data.stages[0];for(let i=0;i<42;i++){n.children=[{...copy(fixture.data.stages[2]),id:String(2000+i)}];n=n.children[0];}
 assert.throws(()=>adapt(fixture),/safety limit/);
});
test('raw wfapi duplicate IDs are rejected',()=>{const r=copy(run);r.stages[1].id=r.stages[0].id;assert.throws(()=>m.adaptFlatRun(r,runPath),/Duplicate/);});
test('unknown statuses remain unknown, skips are not failures',()=>{
 assert.equal(m.status('NEW_STATUS'),m.Result.unknown);assert.equal(m.status('NOT_EXECUTED'),m.Result.not_built);assert.equal(m.status('SKIPPED'),m.Result.skipped);
});
test('server URL is ignored, native node link remains job-local',()=>{
 const f=copy(tree);f.data.stages[0].url='https://evil.test/';assert.equal(adapt(f).stages[0].url,runPath+'execution/node/1000/log/');
});
test('null duration and complete=false are preserved for live server trees',()=>{
 const f=copy(tree);f.data.complete=false;f.data.stages[3].totalDurationMillis=null;f.data.stages[3].state='running';
 const a=adapt(f);assert.equal(a.complete,false);assert.equal(a.stages[3].totalDurationMillis,undefined);assert.equal(a.stages[3].state,'running');
});
test('empty graphs and empty wfapi runs do not invent future nodes',()=>{
 const f=copy(tree);f.data.stages=[];assert.deepEqual(adapt(f).stages,[]);
 const r=copy(run);r.stages=[];assert.deepEqual(m.adaptFlatRun(r,runPath).stages,[]);
});
test('nested renderer displays verified parallel branches with finite coordinates',()=>{
 const g=m.nestedGraphLayout(runPath,adapt().stages,m.defaultLayout,false,new m.Messages(),true,true);
 assert.ok(g.measuredWidth>0&&Number.isFinite(g.measuredWidth));assert.ok(g.nodes.every(n=>Number.isFinite(n.x)&&Number.isFinite(n.y)));
 assert.notEqual(g.nodes.find(n=>n.name==='Tests').y,g.nodes.find(n=>n.name==='Lint').y);
});
test('Jenkins context prefix and encoded branch slash are preserved',()=>{
 const l=m.parseLocation('https://jenkins.test/jenkins/job/team/job/feature%2FBUS-44/12/console');
 assert.equal(l.jobPath,'/jenkins/job/team/job/feature%2FBUS-44/');assert.equal(l.runPath,l.jobPath+'12/');
});
test('numeric-looking branch is not mistaken for build number',()=>{assert.equal(m.parseLocation('https://jenkins.test/job/team/job/123/').build,undefined);});
test('non-job, non-http and external/sibling links are rejected',()=>{
 assert.throws(()=>m.parseLocation('file:///job/x'));assert.throws(()=>m.parseLocation('https://example.test/manage'));
 const l=m.parseLocation('https://jenkins.test/job/x/');
 for(const bad of ['https://other.test/job/x/','https://user@jenkins.test/job/x/','/job/xy/','/job/x/../../manage','javascript:alert(1)'])assert.throws(()=>m.safeJobUrl(bad,l));
});
test('milliseconds are not rounded into seconds',()=>{assert.equal(m.formatMs(139),'139 ms');assert.equal(m.formatMs(662685),'11m 02s');});
