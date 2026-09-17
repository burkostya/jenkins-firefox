/* Auto-enable is opt-in per Jenkins origin. No host access is granted at install time. */
const activation=globalThis.PGVXActivation;

async function getAutoOrigins(){
  const stored=await browser.storage.local.get(activation.STORAGE_KEY);
  return activation.normalizeOrigins(stored[activation.STORAGE_KEY]);
}
async function setAutoOrigins(origins){
  await browser.storage.local.set({[activation.STORAGE_KEY]:activation.normalizeOrigins(origins)});
}
async function hasOriginPermission(origin){
  const pattern=activation.patternFromOrigin(origin);
  return !!pattern&&browser.permissions.contains({origins:[pattern]});
}
async function setActionError(tabId,error){
  if(!tabId)return;
  await browser.action.setBadgeText({tabId,text:'!'});
  await browser.action.setBadgeBackgroundColor({tabId,color:'#b42318'});
  await browser.action.setTitle({tabId,title:'Pipeline Graph: '+String(error?.message||error)});
}
async function inject(tabId,url,{quiet=false}={}){
  if(!Number.isInteger(tabId)||!activation.isJobUrl(url))throw new Error('Open a Jenkins job or build page first.');
  try{
    const results=await browser.scripting.executeScript({target:{tabId},files:['content.js']});
    const failed=results.find(result=>result.error);
    if(failed)throw new Error(failed.error.message||String(failed.error));
    await browser.action.setBadgeText({tabId,text:''});
    await browser.action.setTitle({tabId,title:'Pipeline Graph Local for Jenkins'});
    return true;
  }catch(error){
    if(!quiet)await setActionError(tabId,error);
    console.warn('Pipeline Graph Local: '+String(error?.message||error));
    throw error;
  }
}
async function disablePage(tabId){
  if(!Number.isInteger(tabId))return false;
  try{
    await browser.scripting.executeScript({
      target:{tabId},
      func:()=>document.getElementById('pipeline-graph-local-extension')?.dispatchEvent(new Event('pgvx-deactivate'))
    });
    return true;
  }catch{return false;}
}
async function maybeAutoInject(tabId,url){
  if(!activation.isJobUrl(url))return false;
  const origin=activation.originFromUrl(url);
  if(!origin)return false;
  const origins=await getAutoOrigins();
  if(!origins.includes(origin))return false;
  if(!await hasOriginPermission(origin)){
    await setAutoOrigins(origins.filter(item=>item!==origin));
    return false;
  }
  try{return await inject(tabId,url,{quiet:true});}catch{return false;}
}
async function cleanStaleOrigins(){
  const origins=await getAutoOrigins();
  const kept=[];
  for(const origin of origins)if(await hasOriginPermission(origin))kept.push(origin);
  if(kept.length!==origins.length)await setAutoOrigins(kept);
}
async function syncOpenTabs(){
  let tabs=[];
  try{tabs=await browser.tabs.query({});}catch{return;}
  await Promise.allSettled(tabs.map(tab=>tab.id&&tab.url?maybeAutoInject(tab.id,tab.url):Promise.resolve(false)));
}

browser.tabs.onUpdated.addListener((tabId,changeInfo,tab)=>{
  if(changeInfo.status==='complete'&&tab.url)void maybeAutoInject(tabId,tab.url);
});
browser.runtime.onMessage.addListener(message=>{
  if(!message||typeof message!=='object')return undefined;
  if(message.type==='pgvx-inject')return inject(message.tabId,message.url);
  if(message.type==='pgvx-disable-page')return disablePage(message.tabId);
  if(message.type==='pgvx-sync-auto')return maybeAutoInject(message.tabId,message.url);
  return undefined;
});
browser.runtime.onStartup?.addListener(()=>void syncOpenTabs());
browser.runtime.onInstalled?.addListener(()=>void syncOpenTabs());
browser.permissions.onRemoved?.addListener(()=>void cleanStaleOrigins());
void syncOpenTabs();
