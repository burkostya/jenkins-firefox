const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');

async function harness({stored=[],permission=true,result=[]}={}){
  const listeners={},calls=[];
  let origins=[...stored];
  const event=name=>({addListener:fn=>{listeners[name]=fn;}});
  const browser={
    storage:{local:{
      get:async()=>({autoOrigins:[...origins]}),
      set:async value=>{origins=[...(value.autoOrigins||[])];calls.push(['storage',origins]);}
    }},
    permissions:{contains:async()=>permission,onRemoved:event('permissionRemoved')},
    tabs:{query:async()=>[],onUpdated:event('updated')},
    runtime:{onMessage:event('message'),onStartup:event('startup'),onInstalled:event('installed')},
    scripting:{executeScript:async value=>{calls.push(['inject',value]);return result;}},
    action:{
      setBadgeText:async value=>calls.push(['badge',value]),
      setBadgeBackgroundColor:async value=>calls.push(['badgeColor',value]),
      setTitle:async value=>calls.push(['title',value])
    }
  };
  const context=vm.createContext({browser,URL,console:{warn(){}}});
  vm.runInContext(fs.readFileSync(path.join(root,'extension/activation.js'),'utf8'),context);
  vm.runInContext(fs.readFileSync(path.join(root,'extension/background.js'),'utf8'),context);
  await new Promise(resolve=>setImmediate(resolve));
  return {listeners,calls,getOrigins:()=>origins};
}

test('Run once injects only into an explicitly supplied Jenkins job tab',async()=>{
  const env=await harness({stored:[],permission:false});
  await env.listeners.message({type:'pgvx-inject',tabId:42,url:'https://jenkins.test/job/x/'});
  const call=env.calls.find(item=>item[0]==='inject')[1];
  assert.equal(call.target.tabId,42);
  assert.deepEqual(call.files,['content.js']);
});

test('Run once rejects non-job URLs',async()=>{
  const env=await harness();
  await assert.rejects(Promise.resolve(env.listeners.message({type:'pgvx-inject',tabId:42,url:'https://jenkins.test/'})),/Jenkins job/);
  assert.equal(env.calls.some(item=>item[0]==='inject'),false);
});

test('approved origin auto-injects after a Jenkins job page completes',async()=>{
  const env=await harness({stored:['https://jenkins.test'],permission:true});
  env.listeners.updated(7,{status:'complete'},{id:7,url:'https://jenkins.test/job/x/5/'});
  await new Promise(resolve=>setImmediate(resolve));
  const calls=env.calls.filter(item=>item[0]==='inject');
  assert.equal(calls.length,1);
  assert.equal(calls[0][1].target.tabId,7);
});

test('unlisted origin never auto-injects even if a permission exists',async()=>{
  const env=await harness({stored:[],permission:true});
  env.listeners.updated(7,{status:'complete'},{id:7,url:'https://jenkins.test/job/x/'});
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(env.calls.some(item=>item[0]==='inject'),false);
});

test('stale saved auto origin is removed when its host permission is gone',async()=>{
  const env=await harness({stored:['https://jenkins.test'],permission:false});
  env.listeners.updated(7,{status:'complete'},{id:7,url:'https://jenkins.test/job/x/'});
  await new Promise(resolve=>setImmediate(resolve));
  assert.deepEqual(env.getOrigins(),[]);
  assert.equal(env.calls.some(item=>item[0]==='inject'),false);
});

test('Disable auto can deactivate an already mounted page',async()=>{
  const env=await harness();
  await env.listeners.message({type:'pgvx-disable-page',tabId:9});
  const call=env.calls.find(item=>item[0]==='inject')[1];
  assert.equal(call.target.tabId,9);
  assert.equal(typeof call.func,'function');
});
