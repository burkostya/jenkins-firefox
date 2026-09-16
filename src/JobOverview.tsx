import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import type {JobOverview as Job,BuildOverview} from './overview.ts';
import {loadBuildMenu,type BuildMenuEntry} from './build-menu.ts';
import {formatMs,status} from './model.ts';
import StatusIcon from '../upstream/common/components/status-icon.tsx';
interface Props {job:Job;build:BuildOverview|null;selected:string;onSelect:(choice:string)=>void;error:string;loading:boolean;}
const count=(n:number)=>n.toLocaleString();

function BuildActions({build}:{build:BuildOverview}){
  const button=useRef<HTMLButtonElement>(null),menu=useRef<HTMLDivElement>(null);
  const [open,setOpen]=useState(false),[items,setItems]=useState<BuildMenuEntry[]|null>(null),[error,setError]=useState('');
  const [position,setPosition]=useState({left:0,top:0,up:false});
  function place(){
    const rect=button.current?.getBoundingClientRect();if(!rect)return;
    const width=Math.min(280,Math.max(220,window.innerWidth-16));
    setPosition({left:Math.max(8,Math.min(rect.right-width,window.innerWidth-width-8)),top:rect.top>window.innerHeight/2?rect.top-4:rect.bottom+4,up:rect.top>window.innerHeight/2});
  }
  useEffect(()=>{
    if(!open||items!==null)return;
    const ctrl=new AbortController();setError('');
    loadBuildMenu(build.url,ctrl.signal).then(setItems).catch(e=>{if(!ctrl.signal.aborted)setError(e instanceof Error?e.message:String(e));});
    return()=>ctrl.abort();
  },[open,items,build.url]);
  useEffect(()=>{
    if(!open)return;
    const root=button.current?.getRootNode();
    const outside=(e:Event)=>{const target=e.target as Node;if(button.current?.contains(target)||menu.current?.contains(target))return;setOpen(false);};
    const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);button.current?.focus();}};
    const close=()=>setOpen(false);
    root?.addEventListener('pointerdown',outside);window.addEventListener('keydown',key);window.addEventListener('resize',close);window.addEventListener('scroll',close,true);
    return()=>{root?.removeEventListener('pointerdown',outside);window.removeEventListener('keydown',key);window.removeEventListener('resize',close);window.removeEventListener('scroll',close,true);};
  },[open]);
  const root=button.current?.getRootNode();
  const popup=open&&root instanceof ShadowRoot?createPortal(<div ref={menu} className="pgvx-build-menu" role="menu" aria-label={'Actions for build #'+build.number}
    style={{left:position.left,top:position.top,transform:position.up?'translateY(-100%)':undefined}}>
      <strong className="pgvx-build-menu-title">Build #{build.number}</strong>
      {items===null&&!error&&<span className="pgvx-build-menu-note">Loading actions...</span>}
      {error&&<><span className="pgvx-build-menu-note">{error}</span><a role="menuitem" href={build.url} onClick={()=>setOpen(false)}>Open build</a></>}
      {items?.map((item,i)=>item.kind==='separator'?<hr key={'s'+i}/>:item.kind==='header'?<span className="pgvx-build-menu-heading" key={'h'+i}>{item.label}</span>:
        item.kind==='disabled'?<span className="pgvx-build-menu-disabled" aria-disabled="true" title={item.reason} key={'d'+i}>{item.label}<small>Original Jenkins page</small></span>:
        <a role="menuitem" href={item.href} key={'a'+i} onClick={()=>setOpen(false)}>{item.label}</a>)}
      {items!==null&&!error&&!items.some(i=>i.kind==='link')&&<><span className="pgvx-build-menu-note">No navigational actions reported.</span><a role="menuitem" href={build.url} onClick={()=>setOpen(false)}>Open build</a></>}
    </div>,root):null;
  return <div className="pgvx-build-actions">
    <button ref={button} className="pgvx-build-menu-toggle" aria-label={'Actions for build #'+build.number} aria-haspopup="menu" aria-expanded={open}
      title={'Build #'+build.number+' actions'} onClick={()=>{if(open)setOpen(false);else{place();setOpen(true);}}}>&#x2304;</button>
    {popup}
  </div>;
}

export function JobOverview({job,build,selected,onSelect,error,loading}:Props){
  const [filter,setFilter]=useState('');
  const latest=job.lastSuccessfulBuild;
  const maxTests=Math.max(1,...job.builds.map(b=>b.tests.state==='reported'?b.tests.total:0));
  return <section className="pgvx-overview" aria-label="Job overview">
    <section className="pgvx-card pgvx-builds" aria-label="Recent builds">
      <header><h3>Recent builds</h3><span>{job.builds.length} / latest 20</span></header>
      <input type="search" aria-label="Filter builds" placeholder="Filter number or result" value={filter} onChange={e=>setFilter(e.target.value)}/>
      <div className="pgvx-build-list">{job.builds.filter(b=>('#'+b.number+' '+b.result).toLowerCase().includes(filter.toLowerCase())).map(b=>
        <div key={b.number} className={'pgvx-build-row'+(String(b.number)===selected?' is-selected':'')}>
          <button className="pgvx-build-select" aria-label={'Select build #'+b.number} aria-pressed={String(b.number)===selected} onClick={()=>onSelect(String(b.number))}>
            <StatusIcon status={status(b.result)}/><span><b>#{b.number}</b><small>{b.result}</small></span>
            <span className="pgvx-build-time">{formatMs(b.duration)}<small>{b.timestamp?new Date(b.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}):''}</small></span>
          </button><BuildActions build={b}/>
        </div>)}</div>
      {!job.builds.length&&<p className="pgvx-muted">No builds yet</p>}
      {latest&&<button className="pgvx-last-success" onClick={()=>onSelect(String(latest))}>Select last successful #{latest}</button>}
    </section>
    <section className="pgvx-card pgvx-artifacts" aria-label="Selected build artifacts">
      <header><h3>Artifacts {build&&<small>#{build.number}</small>}</h3>{build&&<a href={build.url+'artifact/'} target="_blank" rel="noopener noreferrer">Browse &#x2197;</a>}</header>
      {!build?<p className="pgvx-muted">{loading?'Loading selected build...':job.builds.length?'Build metadata unavailable':'No builds yet'}</p>:<>
        {build.artifacts===null?<p className="pgvx-muted">Artifact metadata unavailable</p>:!build.artifacts.length?<p className="pgvx-muted">No archived artifacts for #{build.number}</p>:
          <ul className="pgvx-artifact-list">{build.artifacts.map(a=><li key={a.path}><a href={a.href} target="_blank" rel="noopener noreferrer" title={a.path}>{a.name}</a><small>{a.path}</small></li>)}</ul>}
        {build.warnings.map(w=><p className="pgvx-warning" key={w}>{w}</p>)}
      </>}
    </section>
    <section className="pgvx-card pgvx-tests" aria-label="Selected build tests">
      <header><h3>Tests {build&&<small>#{build.number}</small>}</h3>{build?.tests.state==='reported'&&<a href={build.url+'testReport/'} target="_blank" rel="noopener noreferrer">Report &#x2197;</a>}</header>
      {!build?<p className="pgvx-muted">{loading?'Loading selected build...':job.builds.length?'Build metadata unavailable':'No builds yet'}</p>:build.tests.state!=='reported'?<p className="pgvx-muted">{build.tests.reason}</p>:<>
        <div className="pgvx-test-total"><strong>{count(build.tests.total)}</strong><span>total tests</span></div>
        <div className="pgvx-test-counts"><span className="pgvx-passed"><b>{count(build.tests.passed)}</b>Passed</span><span className="pgvx-failed"><b>{count(build.tests.failed)}</b>Failed</span><span className="pgvx-skipped"><b>{count(build.tests.skipped)}</b>Skipped</span></div>
      </>}
      <div className="pgvx-test-history"><h4>Recent test results <small>whole job</small></h4>
        <div className="pgvx-trend" aria-label="Test results across recent builds">{[...job.builds].reverse().map(b=>{
          const t=b.tests,reported=t.state==='reported';
          const label=reported?`${t.passed} passed, ${t.failed} failed, ${t.skipped} skipped`:t.reason;
          return <button key={b.number} className={'pgvx-trend-build'+(String(b.number)===selected?' is-selected':'')} title={'#'+b.number+': '+label}
            aria-label={'Select tests for build #'+b.number+': '+label} onClick={()=>onSelect(String(b.number))}>
            <span className="pgvx-trend-column" aria-hidden="true">{reported&&t.total>0?<span className="pgvx-trend-stack" style={{height:Math.max(2,t.total/maxTests*48)}}>
              <i className="pgvx-trend-fail" style={{flex:t.failed}}/><i className="pgvx-trend-skip" style={{flex:t.skipped}}/><i className="pgvx-trend-pass" style={{flex:t.passed}}/>
            </span>:<span className="pgvx-no-report">{reported?'0':'--'}</span>}</span><small>#{b.number}</small>
          </button>;
        })}</div><p className="pgvx-muted pgvx-trend-key">Passed / failed / skipped. -- means no usable report, not zero tests.</p>
      </div>
    </section>
    {error&&<p className="pgvx-warning pgvx-overview-error" role="status">{error}</p>}
  </section>;
}
