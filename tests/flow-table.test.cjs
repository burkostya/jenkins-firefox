const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const m=require('./lib.cjs');
const rows=JSON.parse(fs.readFileSync(__dirname+'/flow-rows.json'));
const run=JSON.parse(fs.readFileSync(__dirname+'/../preview/runs.json'))[0];
const runPath='/job/bus_backend/job/BUS-4497-agent-flow-improvements/2/';
const copy=v=>JSON.parse(JSON.stringify(v));
const adapt=(rs=rows,r=run)=>m.adaptFlowRows(rs,r,runPath);
const find=(a,name)=>m.walkStages(a.stages).find(s=>s.name===name);
test('supplied HTML has 137 rows; projection preserves 16 actual stages in 11 roots',()=>{
 assert.equal(rows.length,137);const a=adapt();assert.equal(a.source,'flow-graph-table');assert.equal(a.stages.length,11);assert.equal(a.meta.size,16);
 assert.deepEqual(new Set(m.walkStages(a.stages).map(s=>String(s.id))),new Set(run.stages.map(s=>s.id)));assert.deepEqual(a.warnings,[]);
});
test('Test is an actual enclosing stage with five verified parallel branches',()=>{
 const a=adapt(),t=find(a,'Test');assert.equal(t.id,81);assert.deepEqual(t.children.map(n=>n.name),['Tests','Lint','Vulnerability','Validate Migration Inventory','Lint Migrations']);
 assert.ok(t.children.every(n=>n.type==='PARALLEL'));assert.deepEqual(a.meta.get(81).flow.stepId,80);assert.equal(a.meta.get(81).flow.bodyId,81);assert.equal(a.meta.get(81).flow.parallelId,82);
 assert.equal(a.meta.get(93).flow.branchId,87);
});
test('duration precision is honest: parent uses rounded HTML, leaves exact wfapi values',()=>{
 const a=adapt(),t=find(a,'Test');assert.equal(t.pgvxDurationLabel,'~ 11 min');assert.equal(t.totalDurationMillis,660000);
 assert.equal(a.meta.get(81).flow.durationSource,'html-rounded');assert.equal(a.meta.get(81).raw.durationMillis,139);
 assert.equal(find(a,'Tests').totalDurationMillis,662685);assert.equal(a.meta.get(93).flow.durationSource,'wfapi');
});
test('no Prepare, API, Checks, Migrations or Publish grouping is invented',()=>{
 assert.deepEqual(m.walkStages(adapt().stages).filter(s=>s.children.length).map(s=>s.name),['Test']);
});
test('technical wrappers and stage call/body duplicate rows are not graph groups',()=>{
 const a=adapt();assert.equal(a.meta.has(80),false);assert.equal(a.meta.has(81),true);assert.equal(a.meta.has(82),false);
 assert.ok(!m.walkStages(a.stages).some(s=>['sshagent','node','withEnv','podTemplate'].includes(s.name)));
});
test('call/body mapping does not assume adjacent numeric IDs',()=>{
 const rs=copy(rows),r=copy(run);rs.find(s=>s.id===81).id=8181;r.stages.find(s=>s.id==='81').id='8181';
 const a=adapt(rs,r);assert.equal(find(a,'Test').id,8181);assert.equal(a.meta.get(8181).flow.stepId,80);
});
test('row order and indentation, not increasing numeric IDs, determine topology',()=>{
 assert.ok(rows.findIndex(r=>r.id===109)<rows.findIndex(r=>r.id===88));
 assert.equal(find(adapt(),'Lint').type,'PARALLEL');
});
test('derived failed container does not retain a misleading green wfapi prefix',()=>{
 const r=copy(run);r.stages.find(s=>s.name==='Tests').status='FAILED';
 const a=adapt(rows,r);assert.equal(find(a,'Test').state,'failure');assert.equal(a.meta.get(81).raw.status,'SUCCESS');
 assert.equal(a.meta.get(81).flow.stateSource,'derived-children');assert.equal(m.collapseSelectiveStages(a.stages,new Set([81])).find(s=>s.id===81).state,'failure');
});
test('HTML step failure inside a caught error does not override a successful wfapi stage',()=>{
 const rs=copy(rows);rs.find(s=>s.id===109).state='failure';assert.equal(find(adapt(rs),'Tests').state,'success');
});
test('not-executed branches are not converted to failures',()=>{
 const r=copy(run);r.stages.find(s=>s.name==='Tests').status='NOT_EXECUTED';const a=adapt(rows,r);
 assert.equal(find(a,'Tests').state,'not_built');assert.equal(find(a,'Test').state,'success');
});
test('wfapi stages absent from HTML reject inconsistent snapshots rather than guessing',()=>{
 const r=copy(run);r.stages.push({...r.stages[0],id:'9999'});assert.throws(()=>adapt(rows,r),/missing from this HTML snapshot/);
});
test('duplicate row IDs, missing depths and non-block parents fail closed',()=>{
 let rs=copy(rows);rs[1].id=rs[0].id;assert.throws(()=>adapt(rs),/duplicate/);
 rs=copy(rows);rs[2].depth+=5;assert.throws(()=>adapt(rs),/indentation/);
 rs=copy(rows);rs[1].scope='self';assert.throws(()=>adapt(rs),/non-block/);
});
test('mismatched stage body labels and orphan bodies fail closed',()=>{
 const rs=copy(rows);rs.find(s=>s.id===81).label='stage block (Other)';assert.throws(()=>adapt(rs),/labels disagree/);
 const body=[{id:1,depth:2,label:'stage block (Test)',scope:'block',args:'',state:'success'}];
 assert.throws(()=>adapt(body,{...run,stages:[]}),/orphan/);
});
test('unsupported indentation is not inferred from pixel width or CSS',()=>{
 for(const s of ['padding-left:20px','margin-left:20px','padding-left:calc(var(--evil)*2)',''])assert.throws(()=>m.parseFlowDepth(s));
 assert.equal(m.parseFlowDepth('padding-left: calc(var(--table-padding) * 14)'),14);
});
test('human timing parser preserves no-timing, unknown locale and fractional units',()=>{
 assert.equal(m.parseFlowDuration('1 min 4 sec'),64000);assert.equal(m.parseFlowDuration('2.3 sec'),2300);
 assert.equal(m.parseFlowDuration('<1 ms'),0);assert.equal(m.parseFlowDuration('no timing'),undefined);
 assert.equal(m.parseFlowDuration('1 min junk'),undefined);assert.equal(m.parseFlowDuration('12 unknown'),undefined);
});
test('unavailable container time is never substituted with 139ms',()=>{
 const rs=copy(rows);Object.assign(rs.find(s=>s.id===80),{durationMillis:undefined,durationText:'no timing'});
 const t=find(adapt(rs),'Test');assert.equal(t.totalDurationMillis,undefined);assert.equal(t.pgvxDurationLabel,'Duration unavailable');
});
test('build identity mismatch is rejected',()=>assert.throws(()=>m.adaptFlowRows(rows,run,runPath.replace('/2/','/1/')),/identity/));
test('live runs use snapshot-labelled HTML timing and request further updates',()=>{
 const r=copy(run);r.status='IN_PROGRESS';r.stages.find(s=>s.name==='Tests').status='IN_PROGRESS';
 const a=adapt(rows,r);assert.equal(a.complete,false);assert.equal(find(a,'Test').state,'running');assert.match(find(a,'Test').pgvxDurationLabel,/snapshot/);
});
test('live stage body overrides a stale successful wfapi chunk until the body closes',()=>{
 const rs=copy(rows),r=copy(run);r.status='IN_PROGRESS';
 const call=rs.find(s=>s.id===92),body=rs.find(s=>s.id===93),rawStage=r.stages.find(s=>s.name==='Tests');
 assert.equal(call.state,'success');body.state='running';rawStage.status='SUCCESS';rawStage.durationMillis=50;
 const a=adapt(rs,r),tests=find(a,'Tests'),parent=find(a,'Test');
 assert.equal(tests.state,'running');assert.equal(tests.totalDurationMillis,undefined);
 assert.equal(a.meta.get(tests.id).flow.stateSource,'html-node');
 assert.equal(a.meta.get(tests.id).flow.tableState,'running');
 assert.equal(a.meta.get(tests.id).raw.status,'SUCCESS');
 assert.equal(parent.state,'running');
});
function row(id,depth,label,args='',scope='block'){return {id,depth,label,args,scope,state:'success',durationText:'1 sec',durationMillis:1000};}
function raw(id,name){return {id:String(id),name,status:'SUCCESS',durationMillis:1000,startTimeMillis:1};}
function minimal(rs,ss){return adapt(rs,{...run,stages:ss});}
test('explicit nested sequential stages are retained as declared execution containers',()=>{
 const rs=[row(1,2,'stage','Outer'),row(2,3,'stage block (Outer)'),row(10,4,'stage','A'),row(11,5,'stage block (A)'),row(20,4,'stage','B'),row(21,5,'stage block (B)')];
 const a=minimal(rs,[raw(2,'Outer'),raw(11,'A'),raw(21,'B')]);assert.deepEqual(a.stages[0].children.map(n=>n.name),['A','B']);assert.equal(a.stages[0].isSequential,true);
});
test('parallel branches with multiple sequential stages keep their explicit branch wrapper',()=>{
 const rs=[row(1,2,'stage','Outer'),row(2,3,'stage block (Outer)'),row(3,4,'parallel'),row(4,5,'parallel block (Branch: Linux)'),row(10,6,'stage','A'),row(11,7,'stage block (A)'),row(20,6,'stage','B'),row(21,7,'stage block (B)')];
 const a=minimal(rs,[raw(2,'Outer'),raw(11,'A'),raw(21,'B')]);const b=a.stages[0].children[0];assert.equal(b.name,'Linux');assert.equal(b.type,'PARALLEL');assert.deepEqual(b.children.map(n=>n.name),['A','B']);assert.equal(b.pgvxDurationLabel,'Duration unavailable');
});
test('two parallel blocks in sequence are not merged into a single invented fork',()=>{
 const rs=[row(1,2,'stage','Outer'),row(2,3,'stage block (Outer)'),row(3,4,'parallel'),row(4,5,'parallel block (Branch: A)'),row(10,6,'stage','A'),row(11,7,'stage block (A)'),row(30,4,'parallel'),row(40,5,'parallel block (Branch: B)'),row(20,6,'stage','B'),row(21,7,'stage block (B)')];
 const a=minimal(rs,[raw(2,'Outer'),raw(11,'A'),raw(21,'B')]);assert.deepEqual(a.stages[0].children.map(n=>n.type),['PARALLEL_BLOCK','PARALLEL_BLOCK']);
});
test('same stage names in different branches keep separate exact node IDs',()=>{
 const rs=[row(1,2,'parallel'),row(2,3,'parallel block (Branch: One)'),row(10,4,'stage','Same'),row(11,5,'stage block (Same)'),row(3,3,'parallel block (Branch: Two)'),row(20,4,'stage','Same'),row(21,5,'stage block (Same)')];
 const a=minimal(rs,[raw(11,'Same'),raw(21,'Same')]);assert.deepEqual(m.walkStages(a.stages).filter(s=>s.name==='Same').map(s=>s.id),[11,21]);
});
test('upstream layout on recovered HTML has finite geometry and real branch separation',()=>{
 const a=adapt(),g=m.nestedGraphLayout(runPath,a.stages,m.defaultLayout,false,new m.Messages(),true,true);
 assert.ok(g.nodes.every(n=>Number.isFinite(n.x)&&Number.isFinite(n.y)));assert.notEqual(g.nodes.find(n=>n.name==='Tests').y,g.nodes.find(n=>n.name==='Lint').y);
});
