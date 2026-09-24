import type {JenkinsLocation} from './api.ts';
import type {BuildOverview} from './overview.ts';

export interface NativeBuildInfo {
  revision:string;
  branch:string;
  causes:string[];
  sizes:Record<string,string>;
  artifactLinks:Record<string,{view?:string;fingerprint?:string}>;
  previous?:string;
  next?:string;
}
export interface BuildPageLayout {
  read:()=>NativeBuildInfo;
  subscribe:(listener:()=>void)=>()=>void;
  update:(enabled:boolean,build:BuildOverview|null)=>void;
  dispose:()=>void;
}
const text=(el:Node|null|undefined)=>(el?.textContent||'').replace(/\s+/g,' ').trim();

/** Only numeric WorkflowRun root pages; never console, steps, parameters or aliases. */
export function isBuildRoot(location:JenkinsLocation,href:string,modelType:string|undefined):boolean {
  if(modelType!=='org.jenkinsci.plugins.workflow.job.WorkflowRun'||!location.build||!(/^[1-9]\d*$/.test(location.build)))return false;
  const url=new URL(href),path=location.jobPath+location.build;
  return url.origin===location.origin&&(url.pathname===path||url.pathname===path+'/');
}

/** Native nodes stay in the light DOM: Jenkins owns their listeners and actions. */
export function createBuildPageLayout(panel:HTMLElement,host:HTMLElement,location:JenkinsLocation):BuildPageLayout {
  const buildUrl=location.origin+location.jobPath+location.build+'/';
  const home=document.createComment('Pipeline Graph Local build home');host.before(home);
  const moved=new Map<HTMLElement,Comment>();
  const hidden=new Map<HTMLElement,{value:string;priority:string;originalStyle:string|null;applied:string|null}>();
  const listeners=new Set<()=>void>(),slots=new Map<string,HTMLDivElement>();
  const page=document.getElementById('page-body'),previous=page?.getAttribute('data-pgvx-build');
  let enabled=false,disposed=false,build:BuildOverview|null=null,last='';
  const style=document.createElement('style');
  style.textContent=`
    #page-body[data-pgvx-build] #side-panel {border-right:1px solid #e0e5eb;padding-right:12px}
    #page-body[data-pgvx-build="dark"] #side-panel {border-color:#354053}
    #page-body[data-pgvx-build] #main-panel {min-width:0;padding-left:0}
    #page-body[data-pgvx-build] .pgvx-native-build {font:13px/1.5 system-ui,sans-serif;color:inherit;overflow-wrap:anywhere}
    #page-body[data-pgvx-build="dark"] .pgvx-native-build {color:#dce4ef}
    #page-body[data-pgvx-build] .pgvx-native-build a {color:var(--accent,#066caa)}
    #page-body[data-pgvx-build] .pgvx-native-build a:focus-visible {outline:2px solid var(--accent,#066caa);outline-offset:2px}
    #page-body[data-pgvx-build] .pgvx-native-build table {border-collapse:collapse;width:auto;margin:0}
    #page-body[data-pgvx-build] .pgvx-native-build .app-summary>td {padding:4px 8px 4px 0;vertical-align:top}
    #page-body[data-pgvx-build] .pgvx-native-build .app-summary>td:first-child {width:24px}
    #page-body[data-pgvx-build] .pgvx-native-build .app-summary>td:first-child :is(svg,img) {width:20px;height:20px}
    #page-body[data-pgvx-build] .pgvx-native-build :is(p,ul) {margin:4px 0}
    #page-body[data-pgvx-build] [slot="build-description"] #description {margin:0!important}
    #page-body[data-pgvx-build] [slot="build-controls"] {display:flex;align-items:center}
    #page-body[data-pgvx-build] [slot="build-controls"] .build-caption-progress-container {font-size:0;display:flex;align-items:center;gap:6px}
    #page-body[data-pgvx-build] [slot="build-controls"] .app-progress-bar {display:none}
    #page-body[data-pgvx-build] [slot="build-controls"][data-building="false"] .build-caption-progress-container {display:none!important}
    #page-body[data-pgvx-build] [slot="build-controls"] .stop-button-link {font-size:13px;display:inline-flex;align-items:center;gap:4px}
    #page-body[data-pgvx-build] [slot="build-controls"] .stop-button-link:after {content:"Stop"}
    #page-body[data-pgvx-build] [slot="build-controls"] .stop-button-link svg {width:16px;height:16px}
    @media(max-width:800px){#page-body[data-pgvx-build] #main-panel {padding-left:var(--section-padding,16px)}#page-body[data-pgvx-build] #side-panel {border-right:0;padding-right:0}}
  `;
  function url(href:string|null):URL|null {
    try{if(!href)return null;const u=new URL(href,buildUrl);return u.origin===location.origin&&!u.username&&!u.password&&!u.search&&!u.hash?u:null;}catch{return null;}
  }
  function rows():HTMLTableRowElement[]{
    return Array.from(panel.querySelectorAll<HTMLTableRowElement>('tr.app-summary')).filter(r=>r.cells.length===2&&!r.parentElement?.closest('tr.app-summary'));
  }
  function linkTo(row:Element,suffix:string){return Array.from(row.querySelectorAll<HTMLAnchorElement>('a[href]')).find(a=>url(a.getAttribute('href'))?.href.replace(/\/$/,'')===(buildUrl+suffix).replace(/\/$/,''));}
  function isGit(row:HTMLTableRowElement){return !!row.cells[0].querySelector('svg[viewBox="0 0 219 92"]')&&row.cells[1].querySelectorAll('strong').length===2;}
  function field(strong:Element|undefined){let s='',n=strong?.nextSibling;while(n&&!(n instanceof Element&&n.matches('br,ul,strong'))){s+=n.textContent||'';n=n.nextSibling;}return s.replace(/^\s*:\s*/,'').trim();}
  const jobParts=location.jobPath.split('/job/');
  const causePaths=new Set(jobParts.slice(1).map((_,i)=>jobParts[0]+'/job/'+jobParts.slice(1,i+2).join('/job/').replace(/\/$/,'')+'/indexing/events'));
  function isCause(row:HTMLTableRowElement){
    const links=Array.from(row.cells[1].querySelectorAll<HTMLAnchorElement>('a[href]'));
    return links.length>0&&links.every(a=>{const u=url(a.getAttribute('href'));return !!u&&causePaths.has(u.pathname);});
  }
  function read():NativeBuildInfo {
    const info:NativeBuildInfo={revision:'',branch:'',causes:[],sizes:{},artifactLinks:{}};
    for(const row of rows()){
      if(isGit(row)&&!info.revision){
        const rev=field(row.cells[1].querySelectorAll('strong')[0]);
        if(/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/i.test(rev)){info.revision=rev;info.branch=text(row.cells[1].querySelector('ul'));}
      }
      if(isCause(row))info.causes.push(...Array.from(row.cells[1].querySelectorAll('a')).map(text));
      if(!linkTo(row,'artifact/'))continue;
      for(const file of Array.from(row.querySelectorAll<HTMLTableRowElement>('.fileList tr'))){
        const anchors=Array.from(file.querySelectorAll<HTMLAnchorElement>('a[href]'));
        const main=anchors.map(a=>url(a.getAttribute('href'))).find(u=>u?.href.startsWith(buildUrl+'artifact/')&&!u.href.includes('/*')&&!u.href.endsWith('/'));
        if(!main)continue;
        const size=text(file.querySelector('.fileSize'));
        if(/^\d+(?:[.,]\d+)?\s*(?:[KMGTPE]?i?B|bytes?)$/i.test(size))info.sizes[main.href]=size;
        const extras:{view?:string;fingerprint?:string}={};
        for(const a of anchors){const u=url(a.getAttribute('href'));if(u?.href===main.href+'/*view*/')extras.view=u.href;if(u?.href===main.href+'/*fingerprint*/')extras.fingerprint=u.href;}
        info.artifactLinks[main.href]=extras;
      }
    }
    for(const a of Array.from(document.querySelectorAll<HTMLAnchorElement>('#side-panel .task-link[href]'))){
      const u=url(a.getAttribute('href'));if(!u)continue;
      const suffix=u.pathname.slice(location.jobPath.length);
      if(!u.pathname.startsWith(location.jobPath)||!(/^[1-9]\d*\/$/.test(suffix)))continue;
      const n=Number(suffix.slice(0,-1));
      if(n===Number(location.build)-1)info.previous=u.href;
      if(n===Number(location.build)+1)info.next=u.href;
    }
    return info;
  }
  function slot(name:string){
    let el=slots.get(name);if(el)return el;
    el=document.createElement('div');el.slot=name;el.className='pgvx-native-build';host.append(el);slots.set(name,el);return el;
  }
  function move(el:HTMLElement,parent:HTMLElement){
    if(el.parentElement===parent)return;
    if(!moved.has(el)){const mark=document.createComment('Pipeline Graph Local native home');el.before(mark);moved.set(el,mark);}
    parent.append(el);
  }
  function table(name:string){const el=slot(name);let t=el.querySelector('table');if(!t){t=document.createElement('table');el.append(t);}return t;}
  function hide(el:HTMLElement){
    if(!hidden.has(el))hidden.set(el,{value:el.style.getPropertyValue('display'),priority:el.style.getPropertyPriority('display'),originalStyle:el.getAttribute('style'),applied:null});
    el.style.setProperty('display','none','important');hidden.get(el)!.applied=el.getAttribute('style');
  }
  function unhide(){
    for(const [el,s]of hidden){
      if(el.getAttribute('style')===s.applied){if(s.originalStyle===null)el.removeAttribute('style');else el.setAttribute('style',s.originalStyle);}
      else if(s.value)el.style.setProperty('display',s.value,s.priority);
      else el.style.removeProperty('display');
    }
    hidden.clear();
  }
  function refresh(){
    if(disposed)return;
    observer.disconnect();
    if(enabled&&build){
      unhide();
      const caption=panel.querySelector<HTMLElement>('.jenkins-build-caption'),bar=caption?.closest<HTMLElement>('.jenkins-app-bar');
      if(bar){
        const controls=bar.querySelector<HTMLElement>('.jenkins-app-bar__controls');
        if(controls)move(controls,slot('build-controls'));
        hide(bar);
      }
      const description=panel.querySelector<HTMLElement>('#description');
      if(description&&!slots.get('build-description')?.contains(description)){
        const wrapper=description.parentElement;
        const source=wrapper?.parentElement===panel&&wrapper.children.length===1?wrapper:description;
        move(source,slot('build-description'));
      }
      for(const child of Array.from(panel.children) as HTMLElement[]){
        if(child===host||child.style.float!=='right')continue;
        if(child.querySelector('a[href$="/buildTimeTrend"]')||/^Started .+Build has been executing for /.test(text(child)))hide(child);
      }
      for(const row of rows()){
        if(row.cells[0].querySelector('img[src$="/warning.svg"],.icon-warning')){move(row,table('build-warnings'));continue;}
        if(isGit(row)||isCause(row)||/^This run spent\b/.test(text(row.cells[1]))||/^No changes\.$/.test(text(row.cells[1]))){move(row,table('build-details'));continue;}
        if(linkTo(row,'testReport/')&&build.tests.state==='reported')hide(row);
        if(linkTo(row,'artifact/')&&build.artifacts!==null){
          const published=new Set(build.artifacts.map(a=>a.href));
          const native=Array.from(row.querySelectorAll<HTMLAnchorElement>('.fileList a[href]')).map(a=>url(a.getAttribute('href'))?.href).filter((s):s is string=>!!s&&!s.includes('/*'));
          // Unknown/custom artifact widgets remain until their listing is represented.
          if(native.length&&native.every(h=>published.has(h)))hide(row);
        }
      }
      const controls=slots.get('build-controls');if(controls)controls.dataset.building=String(build.building);
      page?.setAttribute('data-pgvx-build',host.dataset.theme||'light');
    }
    const snapshot=JSON.stringify(read());if(snapshot!==last){last=snapshot;for(const listener of listeners)listener();}
    if(!disposed)observer.observe(panel,{childList:true,subtree:true,characterData:true});
  }
  const observer=new MutationObserver(refresh);
  const themeObserver=new MutationObserver(()=>{if(enabled)page?.setAttribute('data-pgvx-build',host.dataset.theme||'light');});
  function restore(){
    observer.disconnect();unhide();
    for(const [el,mark]of [...moved].reverse()){if(mark.isConnected&&el.isConnected)mark.replaceWith(el);else mark.remove();}moved.clear();
    for(const el of slots.values())el.remove();slots.clear();
    style.remove();themeObserver.disconnect();
    if(previous==null)page?.removeAttribute('data-pgvx-build');else page?.setAttribute('data-pgvx-build',previous);
    if(home.isConnected)home.after(host);
  }
  refresh();
  return {read,subscribe(listener){listeners.add(listener);return()=>{listeners.delete(listener);};},
    update(value,metadata){
      if(disposed)return;
      build=metadata;const next=value&&!!build&&build.number===Number(location.build);
      if(!next){if(enabled)restore();enabled=false;refresh();return;}
      if(!enabled){enabled=true;document.head.append(style);const first=Array.from(panel.children).find(c=>c!==host&&c.id!=='skip2content');if(first)first.before(host);themeObserver.observe(host,{attributes:true,attributeFilter:['data-theme']});}
      refresh();
    },
    dispose(){if(disposed)return;disposed=true;enabled=false;restore();observer.disconnect();listeners.clear();home.remove();}
  };
}
