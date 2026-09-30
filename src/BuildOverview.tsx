import {useEffect,useState} from 'react';
import StatusIcon from '../upstream/common/components/status-icon.tsx';
import {formatMs,status} from './model.ts';
import type {BuildOverview} from './overview.ts';
import type {NativeBuildInfo} from './build-page.ts';

interface HeaderProps {
  number:string; build:BuildOverview|null; native:NativeBuildInfo; startedAt:number;
  auto:boolean; loading:boolean; onAuto:(value:boolean)=>void; onRefresh:()=>void;
  onClassic:()=>void; onClose:()=>void;
}
const labels:Record<string,string>={IN_PROGRESS:'Running',SUCCESS:'Success',FAILURE:'Failed',UNSTABLE:'Unstable',ABORTED:'Aborted',NOT_BUILT:'Not built',UNKNOWN:'Unknown'};
function Revision({sha}:{sha:string}){
  const [copied,setCopied]=useState(false),[failed,setFailed]=useState(false);
  return <button className="pgvx-revision" title={failed?'Copy unavailable. Revision: '+sha:sha} onClick={async()=>{
    try{await navigator.clipboard.writeText(sha);setCopied(true);setFailed(false);}catch{setFailed(true);}
  }}>{copied?'Copied':sha.slice(0,9)}<span className="pgvx-muted">{failed?' (select in details)':''}</span></button>;
}
export function BuildHeader({number,build,native,startedAt,auto,loading,onAuto,onRefresh,onClassic,onClose}:HeaderProps){
  const [now,setNow]=useState(Date.now());
  useEffect(()=>{if(!build?.building)return;setNow(Date.now());const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer);},[build?.building]);
  const duration=build?.building&&startedAt>0?Math.max(0,now-startedAt):build?.duration;
  const precise=startedAt>0?new Date(startedAt).toLocaleString(undefined,{timeZoneName:'short'}):'';
  return <header className="pgvx-build-header">
    <div className="pgvx-build-topline">
      <div className="pgvx-build-identity">
        {build&&<StatusIcon status={status(build.result)}/>}<h2>#{number}</h2>
        <span role="status">{build?(labels[build.result]||build.result):loading?'Loading build...':'Build metadata unavailable'}</span>
        {duration!==undefined&&<span className="pgvx-muted">{formatMs(duration)}</span>}
      </div>
      <div className="pgvx-build-toolbar">
        {native.previous&&<a href={native.previous} aria-label="Previous build" title="Previous build">&#x2190;</a>}
        {native.next&&<a href={native.next} aria-label="Next build" title="Next build">&#x2192;</a>}
        {build&&<a href={build.url+'console'} target="_blank" rel="noopener noreferrer">Console &#x2197;</a>}
        <label><input type="checkbox" checked={auto} onChange={e=>onAuto(e.target.checked)}/> Auto-refresh</label>
        <button disabled={loading} onClick={onRefresh} aria-label="Refresh build">{loading?'Loading...':'Refresh'}</button>
        <slot name="build-controls"/>
        <details className="pgvx-build-options"><summary aria-label="Build view options" title="Build view options">&#x22ef;</summary>
          <div><button onClick={onClassic}>Original Jenkins page</button><button onClick={onClose}>Close local graph</button></div>
        </details>
      </div>
    </div>
    {build&&<div className="pgvx-build-meta">
      {precise&&<time tabIndex={0} title={precise} dateTime={new Date(startedAt).toISOString()}>Started {precise}</time>}
      {native.causes.length>0&&<span title={native.causes.join('\n')}>{native.causes.length===1?native.causes[0]:native.causes.length+' branch events'}</span>}
      {native.branch&&<span>{native.branch}</span>}{native.revision&&<Revision key={native.revision} sha={native.revision}/>}
    </div>}
    <slot name="build-description"/>
  </header>;
}
export function BuildFacts({build,native}:{build:BuildOverview;native:NativeBuildInfo}){
  const [all,setAll]=useState(false),tests=build.tests,artifacts=build.artifacts;
  return <section className="pgvx-build-facts" aria-label="Build summary">
    <section aria-label="Build artifacts"><header><h3>Artifacts{artifacts!==null?' '+artifacts.length:''}</h3><a href={build.url+'artifact/'} target="_blank" rel="noopener noreferrer">Browse &#x2197;</a></header>
      {artifacts===null?<p className="pgvx-muted">Artifact metadata unavailable</p>:artifacts.length===0?<p className="pgvx-muted">{build.building?'No artifacts published yet':'No archived artifacts'}</p>:<>
        <ul>{(all?artifacts:artifacts.slice(0,4)).map(a=><li key={a.href}>
          <a href={a.href} target="_blank" rel="noopener noreferrer" title={a.path}>{a.name}</a>
          <span className="pgvx-muted">{!build.building?native.sizes[a.href]:''}</span>
          <span className="pgvx-artifact-extras">{native.artifactLinks[a.href]?.view&&<a href={native.artifactLinks[a.href].view} target="_blank" rel="noopener noreferrer">view</a>}{native.artifactLinks[a.href]?.fingerprint&&<a href={native.artifactLinks[a.href].fingerprint} target="_blank" rel="noopener noreferrer" aria-label={'Fingerprint of '+a.name}>fingerprint</a>}</span>
        </li>)}</ul>
        {artifacts.length>4&&<button onClick={()=>setAll(!all)}>{all?'Show less':'Show all '+artifacts.length}</button>}
      </>}
      {build.warnings.map(w=><p className="pgvx-warning" key={w}>{w}</p>)}
    </section>
    <section aria-label="Build tests"><header><h3>Tests</h3>{tests.state==='reported'&&<a href={build.url+'testReport/'} target="_blank" rel="noopener noreferrer">Report &#x2197;</a>}</header>
      {tests.state!=='reported'?<p className="pgvx-muted">{tests.reason}</p>:<>
        <div className="pgvx-build-test-counts"><span><b>{tests.total.toLocaleString()}</b>Total</span><span className="pgvx-passed"><b>{tests.passed.toLocaleString()}</b>Passed</span><span className="pgvx-failed"><b>{tests.failed.toLocaleString()}</b>Failed</span><span><b>{tests.skipped.toLocaleString()}</b>Skipped</span></div>
        {build.building&&<p className="pgvx-muted">Published so far; build is still running</p>}
      </>}
    </section>
  </section>;
}
