const activation=globalThis.PGVXActivation;
const els={
  origin:document.getElementById('origin'),
  mode:document.getElementById('mode'),
  runOnce:document.getElementById('run-once'),
  always:document.getElementById('always'),
  disable:document.getElementById('disable'),
  message:document.getElementById('message')
};
let current={tab:null,url:null,origin:null,pattern:null,listed:false,granted:false};

async function activeTab(){
  const [tab]=await browser.tabs.query({active:true,currentWindow:true});
  return tab||null;
}
async function readOrigins(){
  const stored=await browser.storage.local.get(activation.STORAGE_KEY);
  return activation.normalizeOrigins(stored[activation.STORAGE_KEY]);
}
async function writeOrigins(origins){
  await browser.storage.local.set({[activation.STORAGE_KEY]:activation.normalizeOrigins(origins)});
}
function setMessage(text,error=false){
  els.message.textContent=text||'';
  els.message.classList.toggle('error',!!error);
}
async function loadState(){
  const tab=await activeTab();
  const url=tab?.url||'';
  if(!tab?.id||!activation.isJobUrl(url)){
    current={tab,url:null,origin:null,pattern:null,listed:false,granted:false};
    els.origin.textContent='Open a Jenkins job or build page';
    els.mode.textContent='Unavailable';
    els.runOnce.disabled=true;els.always.disabled=true;els.disable.disabled=true;
    setMessage('This popup only activates on http(s) Jenkins /job/ pages.');
    return;
  }
  const origin=activation.originFromUrl(url);
  const pattern=activation.patternFromOrigin(origin);
  const origins=await readOrigins();
  const listed=origins.includes(origin);
  const granted=!!pattern&&await browser.permissions.contains({origins:[pattern]});
  if(listed&&!granted)await writeOrigins(origins.filter(item=>item!==origin));
  current={tab,url,origin,pattern,listed:listed&&granted,granted};
  els.origin.textContent=origin;
  els.mode.textContent=current.listed?'Always on':'Run once';
  els.runOnce.disabled=false;
  els.always.disabled=current.listed;
  els.disable.disabled=!(current.listed||current.granted);
  setMessage(current.listed?'This Jenkins will activate automatically on /job/ pages.':'No persistent access is enabled for this Jenkins.');
}

els.runOnce.addEventListener('click',async()=>{
  setMessage('Activating…');
  try{
    await browser.runtime.sendMessage({type:'pgvx-inject',tabId:current.tab.id,url:current.url});
    window.close();
  }catch(error){setMessage(String(error?.message||error),true);}
});

els.always.addEventListener('click',async()=>{
  if(!current.pattern)return;
  setMessage('Waiting for Firefox permission…');
  try{
    // Must stay directly inside the user click handler so Firefox treats it as a permission gesture.
    const granted=await browser.permissions.request({origins:[current.pattern]});
    if(!granted){setMessage('Permission was not granted. Run once is still available.');return;}
    const origins=await readOrigins();
    if(!origins.includes(current.origin))origins.push(current.origin);
    await writeOrigins(origins);
    try{await browser.runtime.sendMessage({type:'pgvx-inject',tabId:current.tab.id,url:current.url});}catch{}
    await loadState();
  }catch(error){setMessage(String(error?.message||error),true);}
});

els.disable.addEventListener('click',async()=>{
  if(!current.origin||!current.pattern)return;
  setMessage('Disabling automatic activation…');
  try{
    // Deactivate the current page while the origin permission is still available.
    try{await browser.runtime.sendMessage({type:'pgvx-disable-page',tabId:current.tab.id});}catch{}
    const origins=await readOrigins();
    await writeOrigins(origins.filter(item=>item!==current.origin));
    await browser.permissions.remove({origins:[current.pattern]});
    await loadState();
    setMessage('Automatic activation disabled for this Jenkins.');
  }catch(error){setMessage(String(error?.message||error),true);}
});

loadState().catch(error=>{
  els.runOnce.disabled=true;els.always.disabled=true;els.disable.disabled=true;
  setMessage(String(error?.message||error),true);
});
