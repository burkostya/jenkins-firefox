import {useState,useEffect,useMemo,useRef,useCallback,Component} from 'react';
import {PipelineGraph} from '../upstream/pipeline-graph-view/pipeline-graph/main/PipelineGraph.tsx';
import {StageInfo,Result} from '../upstream/pipeline-graph-view/pipeline-graph/main/PipelineGraphModel.tsx';
import {collapseSelectiveStages,collectParentStageIds} from '../upstream/pipeline-graph-view/pipeline-graph/main/support/useCollapsedStages.ts';
import StatusIcon from '../upstream/common/components/status-icon.tsx';
import {COLLAPSE,EXPAND} from '../upstream/common/components/symbols.tsx';
import {UserPreferencesProvider,useUserPreferences} from './compat/preferences.tsx';
import {TooltipRoot} from './compat/tooltip.tsx';
import {WfRun,WfNode,NodeMeta,Adapted,adaptFlatRun,adaptTree,isActive,status,formatMs,leafStages,walkStages} from './model.ts';
import {JenkinsApi,JenkinsLocation,safeJobUrl} from './api.ts';
import {adaptFlowGraphHtml} from './flow-table.ts';
import {readSetting,writeSetting} from './storage.ts';
import {JobOverview} from './JobOverview.tsx';
import type {JobOverview as Job,BuildOverview} from './overview.ts';
import {BuildHeader,BuildFacts} from './BuildOverview.tsx';
import type {BuildPageLayout,NativeBuildInfo} from './build-page.ts';

function errorText(e:unknown){return e instanceof Error?e.message:String(e);}
function stageTime(s:StageInfo){return (s as any).pgvxDurationLabel??formatMs(s.totalDurationMillis);}
function safeDate(n:number){return n>0?new Date(n).toLocaleString():'';}
const GRAPH_LAYOUT={graphSpacingTop:22,graphSpacingBottom:28,graphSpacingLeft:18,graphSpacingRight:18};
export class ErrorBoundary extends Component<any,{error:string}> {
  state={error:''};static getDerivedStateFromError(e:unknown){return {error:errorText(e)};}
  render(){return this.state.error?<section className="pgvx-error" role="alert"><b>Unable to render the local graph.</b><p>{this.state.error}</p><button onClick={this.props.onClose}>Restore Jenkins view</button></section>:this.props.children;}
}
interface Props {buildLayout?:BuildPageLayout|null;overviewEnabled?:boolean;onOverview?:(show:boolean)=>void;classicLabel?:string;location:JenkinsLocation;portal:HTMLElement;onClassic:(show:boolean)=>void;onClose:()=>void;host:HTMLElement;}
export default function App(props:Props){
  const key='pgvx/v2/'+props.location.origin+props.location.jobPath;
  return <TooltipRoot.Provider value={props.portal}><UserPreferencesProvider storageKey={key+'/preferences'}><Main {...props} settingsKey={key}/></UserPreferencesProvider></TooltipRoot.Provider>;
}
function Main({location,portal,onClassic,onClose,host,settingsKey,overviewEnabled=false,onOverview,buildLayout,classicLabel='Original Stage View'}:Props&{settingsKey:string}){
  const api=useMemo(()=>new JenkinsApi(location),[location]);
  const [runs,setRuns]=useState<WfRun[]>([]),[runData,setRun]=useState<WfRun|null>(null);
  const [overview,setOverview]=useState<Job|null>(null),[metadata,setMetadata]=useState<BuildOverview|null>(null),[overviewError,setOverviewError]=useState('');
  const [loadedChoice,setLoadedChoice]=useState<string|null>(null);
  const [choice,setChoice]=useState(location.build||'latest'),[refresh,setRefresh]=useState(0),[auto,setAuto]=useState(true);
  const run=loadedChoice===choice?runData:null;
  const buildMeta=loadedChoice===choice?metadata:null;
  const choose=(value:string)=>{if(buildLayout)return;setChoice(value);setSelectedId(undefined);};
  const [nativeBuild,setNativeBuild]=useState<NativeBuildInfo>(()=>buildLayout?.read()||{revision:'',branch:'',causes:[],sizes:{},artifactLinks:{}});
  useEffect(()=>buildLayout?.subscribe(()=>setNativeBuild(buildLayout.read())),[buildLayout]);
  const [loading,setLoading]=useState(true),[error,setError]=useState(''),[updated,setUpdated]=useState('');
  const [tree,setTree]=useState<{runId:string;data:Adapted}|null>(null),[treeNote,setTreeNote]=useState('');
  const [classic,setClassic]=useState(false);
  const [theme,setTheme]=useState<'dark'|'light'>(()=>window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  const [selectedId,setSelectedId]=useState<number|undefined>();
  useEffect(()=>{
    const media=window.matchMedia('(prefers-color-scheme: dark)');
    const sync=()=>setTheme(media.matches?'dark':'light');
    sync();
    media.addEventListener('change',sync);
    return()=>media.removeEventListener('change',sync);
  },[]);
  useEffect(()=>{host.dataset.theme=theme;},[host,theme]);
  useEffect(()=>{onClassic(classic);},[classic,onClassic]);
  useEffect(()=>{onOverview?.(!!overview&&!classic);},[overview,classic,onOverview]);
  useEffect(()=>{buildLayout?.update(!classic&&!!buildMeta,buildMeta);},[buildLayout,classic,buildMeta]);
  useEffect(()=>()=>buildLayout?.update(false,null),[buildLayout]);
  useEffect(()=>{const fn=()=>{setClassic(false);host.scrollIntoView({behavior:'smooth',block:'start'});};host.addEventListener('pgvx-activate',fn);return()=>host.removeEventListener('pgvx-activate',fn);},[host]);
  useEffect(()=>{
    if(classic)return;
    let stopped=false,timer:ReturnType<typeof setTimeout>|undefined;
    const ctrl=new AbortController();
    setLoading(true);setError('');
    async function tick(){
      if(document.hidden){timer=setTimeout(tick,5000);return;}
      try{
        const [runResult,overviewResult]=await Promise.allSettled([
          buildLayout?Promise.resolve([] as WfRun[]):api.runs(ctrl.signal),overviewEnabled?api.overview(ctrl.signal):Promise.resolve(null)
        ]);
        if(stopped)return;
        const job=overviewResult.status==='fulfilled'?overviewResult.value:null;
        let metaError=overviewResult.status==='rejected'?'Job overview unavailable: '+errorText(overviewResult.reason):'';
        const list=runResult.status==='fulfilled'?[...runResult.value].sort((a,b)=>Number(b.id)-Number(a.id)):[];
        const wanted=choice==='latest'?(job?.lastBuild?.toString()||job?.builds[0]?.number.toString()||list[0]?.id):choice;
        let current:WfRun|null=null,selectedMeta:BuildOverview|null=null,graphError='';
        if(wanted){
          try{current=list.find(r=>r.id===wanted)??await api.describe(wanted,ctrl.signal);}
          catch(e){if(ctrl.signal.aborted)throw e;graphError='Graph unavailable for this build: '+errorText(e);}
          const number=Number(current?.id||wanted);
          if((overviewEnabled||buildLayout)&&Number.isSafeInteger(number)&&number>0){
            try{selectedMeta=job?.builds.find(b=>b.number===number)??await api.buildOverview(number,ctrl.signal);}
            catch(e){if(ctrl.signal.aborted)throw e;metaError=metaError||'Selected build metadata unavailable: '+errorText(e);}
          }
        }else if(runResult.status==='rejected'&&!job)graphError=errorText(runResult.reason);
        let result:Adapted|null=null, note='';
        if(current){
          try {
            const payload=await api.tree(current,ctrl.signal);
            if(payload!==null)result=adaptTree(payload,current,api.runPath(current));
            else note='Server tree endpoint returned 404.';
          }catch(e){if(ctrl.signal.aborted)throw e;note='Server tree unavailable: '+errorText(e);}
          if(!result){
            const nativeNote=note;
            try{
              const html=await api.flowGraphTable(current,ctrl.signal);
              result=adaptFlowGraphHtml(html,current,location.origin+api.runPath(current));
              note=nativeNote.includes('404')?'':nativeNote+' Using the readable Pipeline Steps page instead.';
            }catch(e){if(ctrl.signal.aborted)throw e;note=nativeNote+' '+errorText(e);}
          }
        }
        if(stopped)return;
        // Publish one snapshot after all reads. No previous build's cards/graph can
        // appear under the new choice, even when a cancelled fetch resolves late.
        setRuns(list);setRun(current);setOverview(job);setMetadata(selectedMeta);
        setOverviewError(metaError);setLoadedChoice(choice);setError(graphError);
        setTree(result&&current?{runId:current.id,data:result}:null);setTreeNote(note);
        setUpdated(new Date().toLocaleTimeString());
        if(auto&&(choice==='latest'||(buildLayout&&!selectedMeta)||selectedMeta?.building||current&&(isActive(current.status)||result?.complete===false)))
          timer=setTimeout(tick,current&&(isActive(current.status)||result?.complete===false)?(result?.source==='flow-graph-table'?15000:5000):15000);
      }catch(e){if(!stopped&&!ctrl.signal.aborted)setError(errorText(e));}
      finally{if(!stopped)setLoading(false);}
    }
    void tick();
    return()=>{stopped=true;ctrl.abort();if(timer)clearTimeout(timer);};
  },[api,choice,refresh,auto,classic,settingsKey,overviewEnabled,buildLayout]);
  useEffect(()=>{setSelectedId(undefined);},[run?.id]);
  const adapted=useMemo<Adapted>(()=>run?(tree?.runId===run.id?tree.data:adaptFlatRun(run,api.runPath(run))):{stages:[],meta:new Map(),warnings:[],source:'wfapi'},[run,tree,api]);
  const hasTopology=adapted.source!=='wfapi';
  const fromHtml=adapted.source==='flow-graph-table';
  const sourceLabel=run?(fromHtml?'Pipeline Steps HTML':hasTopology?'Jenkins execution tree':'wfapi / flat status list'):'';
  const sourceDetail=!run?'':fromHtml
    ?'Hierarchy comes from this build\'s flowGraphTable, matched to wfapi by node ID. Container states are display aggregates; ~ marks HTML-rounded block durations. No local grouping rules.'
    :hasTopology
      ?'Grouping, branches, durations and node states come from this build\'s /stages/tree response. No local grouping rules are used.'
      :'Hierarchy is unavailable: no parent-child relationship or execution dependency is inferred from names, timestamps or API order.';
  useEffect(()=>{
    host.dataset.pgvxSource=sourceLabel;
    host.dataset.pgvxSourceDetail=sourceDetail;
    host.dataset.pgvxSourceNote=treeNote;
    return()=>{delete host.dataset.pgvxSource;delete host.dataset.pgvxSourceDetail;delete host.dataset.pgvxSourceNote;};
  },[host,sourceLabel,sourceDetail,treeNote]);
  const collapseKey=settingsKey+'/collapsed/'+(run?.id||'none')+'/'+adapted.source;
  const [collapsed,setCollapsed]=useState<Set<number>>(new Set()),[collapseReady,setCollapseReady]=useState(false);
  useEffect(()=>{
    let dead=false;setCollapseReady(false);
    const defaults=adapted.stages.filter(s=>s.children.length).map(s=>s.id);
    readSetting<number[]|null>(collapseKey,null).then(ids=>{if(!dead){setCollapsed(new Set(Array.isArray(ids)?ids.filter(id=>Number.isFinite(id)):defaults));setCollapseReady(true);}});
    return()=>{dead=true;};
  },[collapseKey]);
  function changeCollapsed(next:Set<number>){next=new Set(next);setCollapsed(next);void writeSetting(collapseKey,[...next]);}
  function toggle(id:number){const next=new Set(collapsed);next.has(id)?next.delete(id):next.add(id);changeCollapsed(next);}
  function select(id:number){
    if(id===-1){setSelectedId(undefined);return;}
    const next=new Set(collapsed);
    function expandPath(stages:StageInfo[]):boolean{for(const s of stages){if(s.id===id)return true;if(expandPath(s.children)){next.delete(s.id);return true;}}return false;}
    expandPath(adapted.stages);changeCollapsed(next);setSelectedId(id);
  }
  const nodes=useMemo(()=>walkStages(adapted.stages),[adapted]);
  const selected=nodes.find(s=>s.id===selectedId);
  const effective=useMemo(()=>collapseSelectiveStages(adapted.stages,collapsed),[adapted.stages,collapsed]);
  const parents=useMemo(()=>collectParentStageIds(adapted.stages),[adapted]);
  const mergedRuns=run&&!runs.some(r=>r.id===run.id)?[run,...runs]:runs;
  const options=new Map(mergedRuns.map(r=>[r.id,{id:r.id,name:r.name||'#'+r.id,status:r.status}]));
  for(const b of overview?.builds||[])options.set(String(b.number),{id:String(b.number),name:'#'+b.number,status:b.result});
  if(buildMeta)options.set(String(buildMeta.number),{id:String(buildMeta.number),name:'#'+buildMeta.number,status:buildMeta.result});
  const buildOptions=[...options.values()].sort((a,b)=>Number(b.id)-Number(a.id));
  return <div className={"pgvx-app"+(buildLayout?" pgvx-build-page":"")} data-theme={theme}>
    {buildLayout&&!classic?<BuildHeader number={location.build!} build={buildMeta} native={nativeBuild} startedAt={run?.startTimeMillis||buildMeta?.timestamp||0}
      auto={auto} loading={loading} onAuto={setAuto} onRefresh={()=>setRefresh(x=>x+1)} onClassic={()=>setClassic(true)} onClose={onClose}/>:<header className="pgvx-header">
      <div className="pgvx-heading"><h2>{overview?overview.name:'Pipeline Graph'} <span className="pgvx-local">LOCAL</span></h2><div className="pgvx-subtitle">{location.label}</div></div>
      <div className="pgvx-actions">
        <button onClick={()=>setClassic(!classic)}>{classic?'Graph view':overview||buildLayout?'Original Jenkins page':classicLabel}</button>
        <button className="pgvx-icon-button" aria-label="Close local graph" title="Close local graph" onClick={onClose}>&#x2715;</button>
      </div>
    </header>}
    {!classic&&<>
      {!buildLayout&&<div className="pgvx-runbar">
        <label className="pgvx-run-select">Build <select value={choice} onChange={e=>choose(e.target.value)}>
          <option value="latest">Latest build</option>
          {buildOptions.map(r=><option key={r.id} value={r.id}>{r.name||'#'+r.id} - {r.status}</option>)}
          {choice!=='latest'&&choice!==location.build&&!buildOptions.some(r=>r.id===choice)&&<option value={choice}>#{choice}</option>}
          {location.build&&!buildOptions.some(r=>r.id===location.build)&&<option value={location.build}>{location.build}</option>}
        </select></label>
        {buildMeta?<div className="pgvx-run-summary"><StatusIcon status={status(buildMeta.result)}/><b>#{buildMeta.number}</b><span>{buildMeta.result}</span><span className="pgvx-divider"/><span>{formatMs(buildMeta.duration)}</span><span className="pgvx-muted">{safeDate(buildMeta.timestamp)}</span></div>:run&&<div className="pgvx-run-summary"><StatusIcon status={status(run.status)}/><b>{run.name||'#'+run.id}</b><span>{run.status}</span><span className="pgvx-divider"/><span>{formatMs(run.durationMillis)}</span><span className="pgvx-muted">{safeDate(run.startTimeMillis)}</span></div>}
        <div className="pgvx-run-actions"><label><input type="checkbox" checked={auto} onChange={e=>setAuto(e.target.checked)}/> Auto-refresh</label><button disabled={loading} onClick={()=>setRefresh(x=>x+1)}>{loading?'Loading...':'Refresh'}</button>{(buildMeta||run)&&<a href={(buildMeta?.url||location.origin+api.runPath(run!))+'console'} target="_blank" rel="noopener noreferrer">Console &#x2197;</a>}</div>
      </div>}
      {buildLayout&&buildMeta&&<><BuildFacts build={buildMeta} native={nativeBuild}/><div className="pgvx-build-warnings"><slot name="build-warnings"/></div></>}
      {buildLayout&&overviewError&&<div className="pgvx-warning" role="status">{overviewError}. Original build information remains available.</div>}
      {overviewEnabled&&overview&&<JobOverview job={overview} build={buildMeta} selected={String(buildMeta?.number||run?.id||(choice==='latest'?overview.lastBuild:choice)||'')} onSelect={choose} error={overviewError} loading={loading||loadedChoice!==choice}/>}
      {overviewEnabled&&!overview&&overviewError&&<div className="pgvx-warning" role="status">{overviewError}. Native overview widgets remain available.</div>}
      {loading&&!run&&<div className="pgvx-empty" role="status">Loading selected build...</div>}
      {error&&<div role="alert" className="pgvx-error">{error}</div>}
      {!run&&!loading&&!error&&<div className="pgvx-empty">No pipeline stages available for this selection.</div>}
      {run&&<>
        {adapted.warnings.map(w=><div className="pgvx-warning" key={w}>{w}</div>)}
        {adapted.stages.length===0&&<div className="pgvx-empty">No stages reported yet. The build may be queued or still starting.</div>}
        {hasTopology&&collapseReady&&adapted.stages.length>0&&<GraphViewport
          title={buildLayout?'Pipeline':'Stages'} stages={effective} original={adapted.stages} selected={selected} collapsed={collapsed}
          onToggle={toggle} onSelect={select} runPath={api.runPath(run)}
          onToggleAll={()=>changeCollapsed(collapsed.size?new Set():parents)} hasParents={parents.size>0}
        />}
        {!hasTopology&&adapted.stages.length>0&&<div className="pgvx-flat" aria-label="Flat wfapi status list">
          {adapted.stages.map(n=><button className="pgvx-flat-item" key={n.id} onClick={()=>select(n.id)} title={'wfapi status only / Node '+n.id}>
            <StatusIcon status={n.state}/><span>{n.name}<small>{n.state} / {formatMs(n.totalDurationMillis)}</small></span>
          </button>)}
        </div>}
        <div className="pgvx-graph-footer"><span>{nodes.length} nodes <span className="pgvx-muted"> / {fromHtml?'HTML hierarchy / wfapi details':hasTopology?'server topology and timing':'raw wfapi status and timing'}</span></span><span>{hasTopology?'Hover a node for duration / Ctrl + wheel to zoom':'Flat list: connections are intentionally not drawn'}</span><span className="pgvx-muted">{updated?'Updated '+updated:''}</span></div>
        {adapted.stages.length>0&&<div className="pgvx-inspector">
          <aside className="pgvx-tree"><h3>Stages</h3><StageTree stages={adapted.stages} adapted={adapted} collapsed={collapsed} selected={selectedId} onToggle={toggle} onSelect={select}/></aside>
          <section className="pgvx-details">
            {!selected&&<div className="pgvx-empty"><h3>Select a stage</h3><p>Click a graph node or a stage in the list to inspect steps and read its log.</p><p>Use the count and chevron beside a group name to expand it.</p></div>}
            {selected&&adapted.meta.get(selected.id)?.kind==='stage'&&adapted.meta.get(selected.id)?.raw&&<StageDetails key={run.id+'/'+selected.id} api={api} run={run} raw={adapted.meta.get(selected.id)!.raw!} serverStage={hasTopology?selected:undefined} flowMeta={adapted.meta.get(selected.id)?.flow}/>}
            {selected&&adapted.meta.get(selected.id)?.kind==='stage'&&!adapted.meta.get(selected.id)?.raw&&<div className="pgvx-group-details">
              <h3>{selected.name}</h3><p>{selected.state} / {stageTime(selected)} / Execution node {selected.id}</p>
              <p>This execution node has no matching ID in the wfapi stage list. It is not matched by name.</p><FlowProvenance meta={adapted.meta.get(selected.id)?.flow}/>
              <a href={location.origin+api.runPath(run)+'console'} target="_blank" rel="noopener noreferrer">Open build console &#x2197;</a>
            </div>}
            {selected&&adapted.meta.get(selected.id)?.kind==='group'&&<div className="pgvx-group-details"><h3>{selected.name}</h3>
              <p>{fromHtml?'Pipeline Steps':'Server execution'} {adapted.meta.get(selected.id)?.mode} container / Node {selected.id}.</p>
              <p>{fromHtml?'Display state':'Server state'}: <b>{selected.state}</b>. {fromHtml?'Block duration':'Server duration'}: <b>{stageTime(selected)}</b>.</p>
              {fromHtml?<FlowProvenance meta={adapted.meta.get(selected.id)?.flow}/>:<p>Collapsed graph badges use the upstream aggregation of this node and its children; this inspector preserves the original server state.</p>}
              <div className="pgvx-group-list">{leafStages([selected]).map(s=><button key={s.id} onClick={()=>select(s.id)}><StatusIcon status={s.state}/><span>{s.name}</span><small>{stageTime(s)}</small></button>)}</div>
            </div>}
          </section>
        </div>}
      </>}
      {buildLayout&&buildMeta&&<details className="pgvx-build-native-details"><summary>Build details</summary><slot name="build-details"/></details>}
      <footer className="pgvx-footer"><span>Renderer: Pipeline Graph View 1013.v9f83fd83c063</span><span>Read-only / local settings / no external services</span></footer>
    </>}
  </div>;
}
function StageTree({stages,adapted,collapsed,selected,onToggle,onSelect,depth=0}:any){
  return <div>{stages.map((s:StageInfo)=>{
    return <div key={s.id}><div className={'pgvx-tree-row'+(selected===s.id?' is-selected':'')} style={{paddingLeft:8+depth*12}}>
      {s.children.length>0?<button className="pgvx-tree-chevron" aria-label={(collapsed.has(s.id)?'Expand ':'Collapse ')+s.name} aria-expanded={!collapsed.has(s.id)} onClick={()=>onToggle(s.id)}>{collapsed.has(s.id)?'\u203a':'\u2304'}</button>:<span className="pgvx-tree-spacer"/>}
      <button className="pgvx-tree-item" onClick={()=>onSelect(s.id)} title={s.name}><StatusIcon status={s.state}/><span>{s.name}</span></button>
    </div>{s.children.length>0&&!collapsed.has(s.id)&&<StageTree {...{stages:s.children,adapted,collapsed,selected,onToggle,onSelect,depth:depth+1}}/>}</div>;
  })}</div>;
}
function GraphViewport({stages,original,selected,collapsed,onToggle,onSelect,runPath,onToggleAll,hasParents,title='Stages'}:any){
  const view=useRef<HTMLDivElement>(null),content=useRef<HTMLDivElement>(null),drag=useRef<any>(null);
  const [size,setSize]=useState({w:900,h:230}),[scale,setScale]=useState(1),[fit,setFit]=useState(true),[full,setFull]=useState(false);
  useEffect(()=>{
    const vp=view.current,el=content.current;if(!vp||!el)return;
    const measure=()=>{const svg=el.querySelector('.PWGx-PipelineGraph > svg');if(!svg)return;
      const w=Number(svg.getAttribute('width')),h=Number(svg.getAttribute('height'));if(!w||!h)return;
      setSize(old=>old.w===w&&old.h===h?old:{w,h});if(fit)setScale(Math.max(.35,Math.min(1,(vp.clientWidth-24)/w)));};
    measure();const ro=new ResizeObserver(measure);ro.observe(vp);ro.observe(el);return()=>ro.disconnect();
  },[stages,fit,full]);
  useEffect(()=>{const vp=view.current;if(!vp)return;const wheel=(e:WheelEvent)=>{if(!e.ctrlKey&&!e.metaKey)return;e.preventDefault();setFit(false);setScale(s=>Math.max(.25,Math.min(2.5,s*(e.deltaY>0?.9:1.1))));};vp.addEventListener('wheel',wheel,{passive:false});return()=>vp.removeEventListener('wheel',wheel);},[]);
  useEffect(()=>{if(!full)return;const fn=(e:KeyboardEvent)=>{if(e.key==='Escape')setFull(false);};document.addEventListener('keydown',fn);return()=>document.removeEventListener('keydown',fn);},[full]);
  const changeScale=(factor:number)=>{setFit(false);setScale(s=>Math.max(.25,Math.min(2.5,s*factor)));};
  return <div className={'pgvx-graph-card'+(full?' is-fullscreen':'')}>
    <div className="pgvx-graph-title">{title}</div>
    <button className="pgvx-fullscreen pgvx-icon-button" title={full?'Close expanded view':'Expand view'} aria-label={full?'Close expanded view':'Expand view'} onClick={()=>{setFull(!full);setFit(true);}}>{full?'\u2715':'\u26f6'}</button>
    <div className="pgvx-viewport" ref={view} style={full?{}:{height:Math.max(220,Math.min(550,size.h*scale+64))}}
      onPointerDown={e=>{if(e.button!==0||(e.target as Element).closest('a,button,[role="button"]'))return;const el=view.current!;drag.current={x:e.clientX,y:e.clientY,l:el.scrollLeft,t:el.scrollTop};el.setPointerCapture(e.pointerId);}}
      onPointerMove={e=>{if(drag.current&&view.current){view.current.scrollLeft=drag.current.l-(e.clientX-drag.current.x);view.current.scrollTop=drag.current.t-(e.clientY-drag.current.y);}}}
      onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}>
      <div className="pgvx-scaled-space" style={{width:size.w*scale,height:size.h*scale}}>
        <div ref={content} className="pgvx-scaled-content" style={{transform:'scale('+scale+')'}}>
          <PipelineGraph stages={stages} layout={GRAPH_LAYOUT} selectedStage={selected} collapsedStageIds={collapsed} onToggleCollapse={onToggle} onStageSelect={(id:string)=>onSelect(Number(id))} currentRunPath={runPath}/>
        </div>
      </div>
    </div>
    <div className="pgvx-zoom-controls">
      <span className="pgvx-zoom-value">{Math.round(scale*100)}%</span>
      <button aria-label="Zoom in" title="Zoom in" onClick={()=>changeScale(1.2)} disabled={scale>=2.5}>+</button>
      <button aria-label="Zoom out" title="Zoom out" onClick={()=>changeScale(1/1.2)} disabled={scale<=.25}>&#x2212;</button>
      <button aria-label="Fit graph" title="Fit graph" onClick={()=>{setFit(true);if(view.current){setScale(Math.max(.35,Math.min(1,(view.current.clientWidth-24)/size.w)));view.current.scrollTo(0,0);}}}>&#x21ba;</button>
      {hasParents&&<button aria-label={collapsed.size?'Expand all stages':'Collapse all stages'} title={collapsed.size?'Expand all stages':'Collapse all stages'} onClick={onToggleAll}>{collapsed.size?EXPAND:COLLAPSE}</button>}
    </div>
  </div>;
}
function StageDetails({api,run,raw,serverStage,flowMeta}:{api:JenkinsApi;run:WfRun;raw:WfNode;serverStage?:StageInfo;flowMeta?:NodeMeta['flow']}){
  const [node,setNode]=useState(raw),[loading,setLoading]=useState(false),[error,setError]=useState('');
  const [logStep,setLogStep]=useState<WfNode|null>(null),[log,setLog]=useState(''),[logLoading,setLogLoading]=useState(false),[logError,setLogError]=useState(''),[hasMore,setHasMore]=useState(false),[logRefresh,setLogRefresh]=useState(0);
  useEffect(()=>{const c=new AbortController();setError('');setNode(raw);
    if(raw.stageFlowNodes===undefined){setLoading(true);api.stage(run,raw,c.signal).then(setNode).catch(e=>{if(!c.signal.aborted)setError(errorText(e));}).finally(()=>{if(!c.signal.aborted)setLoading(false);});}return()=>c.abort();
  },[api,run.id,raw]);
  useEffect(()=>{if(!logStep)return;const c=new AbortController();setLogLoading(true);setLog('');setLogError('');setHasMore(false);
    api.log(run,logStep,c.signal).then(v=>{setLog(v.text);setHasMore(v.hasMore);}).catch(e=>{if(!c.signal.aborted)setLogError(errorText(e));}).finally(()=>{if(!c.signal.aborted)setLogLoading(false);});return()=>c.abort();
  },[api,run.id,logStep,logRefresh]);
  const steps=Array.isArray(node.stageFlowNodes)?node.stageFlowNodes.filter(s=>s&&typeof s.name==='string'&&/^\d+$/.test(s.id)).slice(0,1000):[];
  function consoleLink(n:WfNode){return safeJobUrl(api.runPath(run)+'execution/node/'+encodeURIComponent(n.id)+'/log',api.location);}
  return <>
    <header className="pgvx-detail-heading"><StatusIcon status={serverStage?.state??status(node.status)}/><div><h3>{serverStage?.name??node.name}</h3><small>{serverStage?.state??node.status} / {serverStage?stageTime(serverStage):formatMs(node.durationMillis)} / Node {node.id}{flowMeta?' / Pipeline Steps + wfapi':serverStage?' / execution tree':' / raw wfapi'}</small></div><a href={consoleLink(node)} target="_blank" rel="noopener noreferrer">Console &#x2197;</a></header>
    <FlowProvenance meta={flowMeta}/>
    {!serverStage&&<p className="pgvx-detail-warning">This is a raw wfapi entry, not a verified leaf stage or parent summary. An empty step list does not prove that no nested stages exist.</p>}
    {serverStage&&serverStage.state!==status(raw.status)&&<p className="pgvx-detail-warning">wfapi reports {raw.status} for this ID. The heading uses the execution-tree status; it is not overwritten with the wfapi chunk status.</p>}
    {error&&<div className="pgvx-error" role="alert">{error}</div>}{loading&&<p>Loading steps...</p>}
    {!loading&&steps.length===0&&<p className="pgvx-muted">The API returned no steps for this stage.</p>}
    {steps.length>0&&<div className="pgvx-step-list">{steps.map(s=><div key={s.id} className={'pgvx-step'+(logStep?.id===s.id?' is-selected':'')}>
      <button onClick={()=>setLogStep(s)}><StatusIcon status={status(s.status)}/><span>{s.name}<small>{typeof s.parameterDescription==='string'?s.parameterDescription.trim().slice(0,240):'Node '+s.id}</small></span><time>{formatMs(s.durationMillis)}</time></button>
      <a title="Open step console in Jenkins" href={consoleLink(s)} target="_blank" rel="noopener noreferrer">&#x2197;</a>
    </div>)}</div>}
    {Array.isArray(node.stageFlowNodes)&&node.stageFlowNodes.length>1000&&<p className="pgvx-warning">Showing the first 1,000 returned steps. Open the native console for more.</p>}
    {logStep&&<section className="pgvx-log"><div className="pgvx-log-title"><b>{logStep.name}</b><span>Node {logStep.id}</span><button disabled={logLoading} onClick={()=>setLogRefresh(v=>v+1)}>Reload log</button><a href={consoleLink(logStep)} target="_blank" rel="noopener noreferrer">Full console &#x2197;</a></div>
      {logLoading&&<p>Loading log...</p>}{logError&&<p className="pgvx-error" role="alert">{logError}</p>}
      {hasMore&&<p className="pgvx-warning">This log is truncated by the API or the 200,000-character display limit. Use Full console.</p>}
      {!logLoading&&!logError&&<pre tabIndex={0}>{log||'(Empty log)'}</pre>}
    </section>}
  </>;
}

function FlowProvenance({meta}:{meta?:NodeMeta['flow']}){
  if(!meta)return null;
  return <div className="pgvx-flow-provenance">
    <p>HTML call node {meta.stepId}{meta.bodyId!==undefined?' / body node '+meta.bodyId:''}{meta.branchId!==undefined?' / branch node '+meta.branchId:''}{meta.parallelId!==undefined?' / parallel node '+meta.parallelId:''}.</p>
    {meta.stateSource==='derived-children'&&<p>State is derived from the verified child stages and the available container state. It is not Jenkins Pipeline Graph View's server-side chunk status.</p>}
    {meta.durationSource==='html-rounded'&&<p>Time is the rounded block duration printed by Jenkins: <b>{meta.tableDuration}</b>. It is not millisecond-precise and is not the sum of parallel branches.</p>}
    {meta.durationSource==='unavailable'&&<p>The block duration is unavailable; branch-wrapper timings are not used as a substitute.</p>}
    {meta.rawState!==undefined&&meta.stateSource==='derived-children'&&<p>Raw wfapi chunk (not a container summary): {meta.rawState} / {formatMs(meta.rawDurationMillis)}.</p>}
  </div>;
}
