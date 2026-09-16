import { Result, StageInfo } from '../upstream/pipeline-graph-view/pipeline-graph/main/PipelineGraphModel.tsx';

export type Links = Record<string, { href: string }>;
export interface WfNode {
  id: string; name: string; status: string; startTimeMillis: number;
  durationMillis: number; pauseDurationMillis?: number; execNode?: string;
  parameterDescription?: string; _links?: Links; stageFlowNodes?: WfNode[];
}
export interface WfRun extends WfNode {
  stages: WfNode[]; endTimeMillis?: number; queueDurationMillis?: number;
}
export interface NodeMeta {
  kind: 'stage' | 'group'; raw?: WfNode; mode?: string;
  flow?: {stepId:number; bodyId?:number; parallelId?:number; branchId?:number; depth:number;
    tableState:Result; tableDuration?:string; rawState?:string; rawDurationMillis?:number;
    stateSource:'wfapi'|'html-node'|'derived-children';
    durationSource:'wfapi'|'html-rounded'|'unavailable'};
  // Match exact IDs, or the explicit call/body pair observed in Pipeline Steps HTML.
  source: 'wfapi' | 'pipeline-graph-view' | 'flow-graph-table';
}
export interface Adapted {
  stages: StageInfo[]; meta: Map<number, NodeMeta>; warnings: string[];
  source: 'wfapi' | 'pipeline-graph-view' | 'flow-graph-table'; complete?: boolean;
}
export const isActive = (s:string) => ['IN_PROGRESS','PAUSED_PENDING_INPUT','QUEUED','RUNNING','PAUSED'].includes(s);
export function status(s: string): Result {
  return ({SUCCESS:Result.success,FAILED:Result.failure,FAILURE:Result.failure,
    IN_PROGRESS:Result.running,RUNNING:Result.running,PAUSED_PENDING_INPUT:Result.paused,
    PAUSED:Result.paused,QUEUED:Result.queued,UNSTABLE:Result.unstable,ABORTED:Result.aborted,
    NOT_EXECUTED:Result.not_built,NOT_BUILT:Result.not_built,SKIPPED:Result.skipped,
    SKIPPED_FOR_CONDITIONAL:Result.skipped} as Record<string, Result>)[s] ?? Result.unknown;
}
function finite(n:unknown, fallback=0):number {return typeof n==='number' && Number.isFinite(n) && n>=0?n:fallback;}
function validId(id:unknown):boolean {return typeof id==='string' && /^\d+$/.test(id) && Number.isSafeInteger(Number(id));}
export function validateRun(value: unknown): WfRun {
  const r=value as WfRun;
  if(!r || typeof r!=='object' || !validId(r.id) || !Array.isArray(r.stages) || typeof r.status!=='string')
    throw new Error('The endpoint did not return a Pipeline REST API run. Check the Jenkins login and wfapi endpoint.');
  if(r.stages.length>3000) throw new Error('More than 3,000 stages returned. This local view intentionally limits graph size.');
  const ids=new Set();
  for(const s of r.stages){
    if(!s || !validId(s.id) || typeof s.name!=='string' || s.name.length>4000 || typeof s.status!=='string')
      throw new Error('Invalid stage data in wfapi response.');
    if(ids.has(s.id))throw new Error('Duplicate stage ID in wfapi response: '+s.id);
    ids.add(s.id);
  }
  return r;
}
export function leafStages(stages:StageInfo[]):StageInfo[] {
  return stages.flatMap(s=>s.children.length?leafStages(s.children):[s]);
}
export function walkStages(stages:StageInfo[]):StageInfo[] {
  return stages.flatMap(s=>[s,...walkStages(s.children)]);
}

/** Preserve the response as a flat list. No edges, parents or group status are inferred. */
export function adaptFlatRun(run:WfRun, runUrl:string):Adapted {
  validateRun(run);
  const meta=new Map<number,NodeMeta>();
  const stages=run.stages.map(raw=>{
    const id=Number(raw.id);meta.set(id,{kind:'stage',raw,source:'wfapi'});
    return {id,name:raw.name,title:raw.name,state:status(raw.status),type:'STAGE' as const,children:[],
      startTimeMillis:finite(raw.startTimeMillis),totalDurationMillis:isActive(raw.status)?undefined:finite(raw.durationMillis),
      pauseDurationMillis:finite(raw.pauseDurationMillis),agent:raw.execNode||'',
      url:runUrl+'execution/node/'+raw.id+'/log/'};
  });
  return {stages,meta,warnings:[],source:'wfapi'};
}

/**
 * Decode the upstream /<build>/stages/tree envelope. Preserve containment, branch
 * types, status and timings supplied by the server; NEVER merge wfapi status
 * into this tree. In particular, a 139ms green wfapi chunk is not its parent stage.
 * String FlowNode IDs are converted to the numeric IDs expected by the renderer.
 */
export function adaptTree(value:unknown, run:WfRun, runUrl:string):Adapted {
  const envelope=value as any;
  if(!envelope || envelope.status!=='ok' || !envelope.data || !Array.isArray(envelope.data.stages)
      || typeof envelope.data.complete!=='boolean')
    throw new Error('Invalid Pipeline Graph View tree envelope. Expected status=ok and data.stages/data.complete.');
  const meta=new Map<number,NodeMeta>(), seen=new Set<number>(), warnings:string[]=[];
  const byId=new Map(run.stages.map(s=>[s.id,s]));let count=0;
  function decode(n:any,depth:number):StageInfo {
    if(++count>3000 || depth>40)throw new Error('Server tree exceeds the 3,000-node / 40-level safety limit.');
    if(!n || typeof n!=='object' || !/^[0-9]+$/.test(String(n.id)) || !Number.isSafeInteger(Number(n.id)))
      throw new Error('Invalid execution-node ID in server tree.');
    const id=Number(n.id);
    if(seen.has(id))throw new Error('Duplicate execution-node ID in server tree: '+id);
    seen.add(id);
    if(typeof n.name!=='string' || n.name.length>4000 || typeof n.state!=='string' || !Array.isArray(n.children))
      throw new Error('Invalid stage fields in server tree.');
    if(!['STAGE','PARALLEL','PARALLEL_BLOCK','STEP','PIPELINE_START'].includes(n.type))
      throw new Error('Unsupported server tree node type: '+String(n.type));
    // The supplied nested renderer consumes children, not old nextSibling chains.
    // Fail closed rather than silently dropping those nodes on older servers.
    if(n.nextSibling!=null)throw new Error('Legacy nextSibling tree format is not supported by this adapter.');
    const children=n.children.map((c:any)=>decode(c,depth+1));
    const raw=byId.get(String(id));
    meta.set(id,{kind:children.length?'group':'stage',raw,source:'pipeline-graph-view',
      mode:children[0]?.type==='PARALLEL'?'parallel':'sequence'});
    const state=status(n.state.toUpperCase());
    if(state===Result.unknown && n.state.toLowerCase()!=='unknown')warnings.push('Unknown server state '+n.state+' for node '+id+'.');
    // Native same-job links are built locally; server-provided URLs are never followed.
    return {id,name:n.name,title:typeof n.title==='string'?n.title:n.name,state,type:n.type,children,
      isSequential:n.isSequential===true,placeholder:n.placeholder===true,synthetic:n.synthetic===true,
      startTimeMillis:finite(n.startTimeMillis),pauseDurationMillis:finite(n.pauseDurationMillis),
      totalDurationMillis:n.totalDurationMillis==null?undefined:finite(n.totalDurationMillis),
      agent:typeof n.agent==='string'?n.agent:'',
      causeOfBlockage:typeof n.causeOfBlockage==='string'?n.causeOfBlockage:undefined,
      url:runUrl+'execution/node/'+id+'/log/'};
  }
  const stages=envelope.data.stages.map((n:any)=>decode(n,0));
  return {stages,meta,warnings,source:'pipeline-graph-view',complete:envelope.data.complete};
}
export function formatMs(ms:number|undefined):string {
  if(ms===undefined)return 'Running';
  if(ms<1000)return Math.round(ms)+' ms';
  const seconds=Math.floor(ms/1000);
  if(seconds<60)return seconds+' s';
  if(seconds<3600)return Math.floor(seconds/60)+'m '+String(seconds%60).padStart(2,'0')+'s';
  return Math.floor(seconds/3600)+'h '+Math.floor(seconds%3600/60)+'m';
}
