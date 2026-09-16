import {useState} from 'react';
import type {JobOverview as Job,BuildOverview} from './overview.ts';
import {formatMs,status} from './model.ts';
import StatusIcon from '../upstream/common/components/status-icon.tsx';
interface Props {job:Job;build:BuildOverview|null;selected:string;onSelect:(choice:string)=>void;error:string;loading:boolean;}
const count=(n:number)=>n.toLocaleString();
export function JobOverview({job,build,selected,onSelect,error,loading}:Props){
  const [filter,setFilter]=useState('');
  const latest=job.lastSuccessfulBuild;
  const maxTests=Math.max(1,...job.builds.map(b=>b.tests.state==='reported'?b.tests.total:0));
  return <section className="pgvx-overview" aria-label="Job overview">
    <section className="pgvx-card pgvx-builds" aria-label="Recent builds">
      <header><h3>Recent builds</h3><span>{job.builds.length} / latest 20</span></header>
      <input type="search" aria-label="Filter builds" placeholder="Filter number or result" value={filter} onChange={e=>setFilter(e.target.value)}/>
      <div className="pgvx-build-list">{job.builds.filter(b=>('#'+b.number+' '+b.result).toLowerCase().includes(filter.toLowerCase())).map(b=>
        <button key={b.number} className={'pgvx-build-row'+(String(b.number)===selected?' is-selected':'')}
          aria-label={'Select build #'+b.number} aria-pressed={String(b.number)===selected} onClick={()=>onSelect(String(b.number))}>
          <StatusIcon status={status(b.result)}/><span><b>#{b.number}</b><small>{b.result}</small></span>
          <span className="pgvx-build-time">{formatMs(b.duration)}<small>{b.timestamp?new Date(b.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}):''}</small></span>
        </button>)}</div>
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
