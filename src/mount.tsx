import {createRoot} from 'react-dom';
import App,{ErrorBoundary} from './App.tsx';
import {parseLocation,JenkinsLocation} from './api.ts';
import shell from './shell.css';
import upstream from './upstream.css';
import overviewStyles from './overview.css';
import spacingStyles from './spacing.css';
import {createJobPageLayout} from './page-layout.ts';
const ID='pipeline-graph-local-extension';
export function mount(location:JenkinsLocation = parseLocation(window.location.href)){
  const old=document.getElementById(ID);
  if(old){old.dispatchEvent(new Event('pgvx-activate'));return;}
  const original=document.querySelector<HTMLElement>('.cbwf-stage-view')||document.querySelector<HTMLElement>('#main-panel #nodeGraph');
  const panel=document.querySelector<HTMLElement>('#main-panel')||document.querySelector('main')||document.body;
  const host=document.createElement('section');host.id=ID;
  host.setAttribute('aria-label','Pipeline Graph Local');
  // Jenkins job actions (JUnit trend, coverage, etc.) may float above Stage View.
  // Insert at the main-panel level and explicitly clear those floats. Inline
  // important rules keep page CSS and :host { all: initial } from undoing this.
  for(const [property,value] of Object.entries({display:'flow-root',clear:'both',width:'100%',
      'min-width':'0','max-width':'100%','box-sizing':'border-box',float:'none'}))
    host.style.setProperty(property,value,'important');
  let anchor:HTMLElement|null=original;
  while(anchor && anchor.parentElement!==panel)anchor=anchor.parentElement;
  if(anchor && anchor!==panel)anchor.before(host);else panel.append(host);
  const shadow=host.attachShadow({mode:'open'});
  const css=shell+'\n'+upstream+'\n'+overviewStyles+'\n'+spacingStyles;
  try { const sheet=new CSSStyleSheet();sheet.replaceSync(css);shadow.adoptedStyleSheets=[sheet]; }
  catch { const style=document.createElement('style');style.textContent=css;shadow.append(style); }
  const target=document.createElement('div'),portal=document.createElement('div');shadow.append(target,portal);
  const oldDisplay=original?.style.getPropertyValue('display')||'',oldPriority=original?.style.getPropertyPriority('display')||'';
  function showClassic(show:boolean){if(!original)return;if(show){if(oldDisplay)original.style.setProperty('display',oldDisplay,oldPriority);else original.style.removeProperty('display');}else original.style.setProperty('display','none','important');}
  const overviewEnabled=!!location.isJobPage && document.body.dataset.modelType==='org.jenkinsci.plugins.workflow.job.WorkflowJob';
  const layout=overviewEnabled?createJobPageLayout(panel as HTMLElement,host,original):null;
  const onOverview=(enabled:boolean)=>layout?.setEnabled(enabled);
  let closed=false;const root=createRoot(target);
  function close(){if(closed)return;closed=true;host.removeEventListener('pgvx-deactivate',close);layout?.dispose();showClassic(true);root.unmount();host.remove();window.removeEventListener('pagehide',close);}
  host.addEventListener('pgvx-deactivate',close);
  window.addEventListener('pagehide',close,{once:true});
  root.render(<ErrorBoundary onClose={close}><App overviewEnabled={overviewEnabled} onOverview={onOverview} classicLabel={original?.id==='nodeGraph'?'Original Pipeline Steps':'Original Stage View'} {...{location,portal,host}} onClassic={showClassic} onClose={close}/></ErrorBoundary>);
}
