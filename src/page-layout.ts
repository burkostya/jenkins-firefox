/** Reversible enhancement of known Jenkins job widgets. Never replace innerHTML. */
export function createJobPageLayout(panel:HTMLElement,host:HTMLElement,original:HTMLElement|null){
  const home=document.createComment('Pipeline Graph Local home');host.before(home);
  const page=document.getElementById('page-body');
  const saved=new Map<HTMLElement,{value:string;priority:string}>();
  const previous=page?.getAttribute('data-pgvx-compact');
  const previousTheme=page?.getAttribute('data-pgvx-theme');
  let enabled=false;
  const style=document.createElement('style');
  style.textContent=`
    #page-body[data-pgvx-compact="true"] #main-panel { min-width:0; }
    #page-body[data-pgvx-compact="true"] #tasks .task-link { min-height:30px; padding-top:5px; padding-bottom:5px; }
    #page-body[data-pgvx-compact="true"] #tasks .task { margin-bottom:2px; }
    #page-body[data-pgvx-compact="true"][data-pgvx-theme="dark"] #tasks { background:#19212d;color:#dce4ef;border-radius:8px;padding:6px; }
    #page-body[data-pgvx-compact="true"][data-pgvx-theme="dark"] #tasks .task-link { color:#dce4ef; }
    #page-body[data-pgvx-compact="true"][data-pgvx-theme="dark"] #tasks .task-link--active { background:#354053; }
  `;
  function hide(el:HTMLElement){
    if(el===host||el===original||el.contains(host))return;
    if(!saved.has(el))saved.set(el,{value:el.style.getPropertyValue('display'),priority:el.style.getPropertyPriority('display')});
    el.style.setProperty('display','none','important');
  }
  function refresh(){
    if(!enabled)return;
    for(const child of Array.from(panel.children) as HTMLElement[]){
      if(child.matches('.jenkins-app-bar')&&child.querySelector('h1'))hide(child);
      else if(child.id==='description'&&!child.textContent?.trim()&&!child.querySelector('img,input,button'))hide(child);
      else if(child.matches('div')&&child.querySelector('.test-trend-caption, .echarts-trend[tool="test"]'))hide(child);
      else if(child.matches('table')&&child.querySelector('.app-summary a[href*="/artifact/"], .app-summary a[href*="testReport"]'))hide(child);
    }
    const history=page?.querySelector<HTMLElement>('#side-panel #buildHistoryPage');if(history)hide(history);
  }
  const observer=new MutationObserver(refresh);
  const themes=new MutationObserver(()=>{if(enabled)page?.setAttribute('data-pgvx-theme',host.dataset.theme||'light');});
  function restoreAttribute(name:string,value:string|null|undefined){if(value==null)page?.removeAttribute(name);else page?.setAttribute(name,value);}
  function setEnabled(value:boolean){
    if(value===enabled)return;enabled=value;
    if(value){
      page?.setAttribute('data-pgvx-compact','true');page?.setAttribute('data-pgvx-theme',host.dataset.theme||'light');
      document.head.append(style);refresh();
      const first=Array.from(panel.children).find(c=>c!==host&&c.id!=='skip2content');if(first)first.before(host);
      observer.observe(page||panel,{childList:true,subtree:true});themes.observe(host,{attributes:true,attributeFilter:['data-theme']});
    }else{
      observer.disconnect();themes.disconnect();
      for(const [el,state]of saved){if(state.value)el.style.setProperty('display',state.value,state.priority);else el.style.removeProperty('display');}saved.clear();
      restoreAttribute('data-pgvx-compact',previous);restoreAttribute('data-pgvx-theme',previousTheme);style.remove();
      if(home.isConnected)home.after(host);
      window.dispatchEvent(new Event('resize'));
    }
  }
  return {setEnabled,dispose(){setEnabled(false);observer.disconnect();themes.disconnect();home.remove();style.remove();}};
}
