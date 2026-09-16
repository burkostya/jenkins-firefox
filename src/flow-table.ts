import {Result, StageInfo} from '../upstream/pipeline-graph-view/pipeline-graph/main/PipelineGraphModel.tsx';
import {collapseSelectiveStages} from '../upstream/pipeline-graph-view/pipeline-graph/main/support/useCollapsedStages.ts';
import {Adapted,NodeMeta,WfRun,status,isActive,validateRun,walkStages} from './model.ts';

/** Text/data only. No element from the fetched page is inserted into the live DOM. */
export interface FlowRow {
  id:number; depth:number; label:string; args:string; state:Result;
  durationText?:string; durationMillis?:number; scope?:'block'|'self';
}
interface RowNode extends FlowRow {children:RowNode[];}
const MAX_ROWS=30000, MAX_DEPTH=160;
const fail=(reason:string):never=>{throw new Error('Pipeline Steps HTML: '+reason);};
export function parseFlowDepth(style:string):number {
  // This is the actual inline depth encoding supplied by Jenkins 2.516.3.
  // Do not measure pixels: a detached document has no Jenkins stylesheets.
  const match=style.match(/(?:^|;)\s*padding-left\s*:\s*calc\(\s*var\(--table-padding\)\s*\*\s*(\d+)\s*\)\s*(?:;|$)/i);
  if(!match)fail('unsupported indentation markup; cannot recover hierarchy safely.');
  const n=Number(match![1]);if(n>MAX_DEPTH)fail('depth safety limit exceeded.');return n;
}
export function parseFlowDuration(text:string):number|undefined {
  if(!text||text==='no timing')return undefined;
  if(text==='<1 ms')return 0;
  const units:Record<string,number>={ms:1,millisecond:1,milliseconds:1,sec:1000,second:1000,seconds:1000,
    min:60000,minute:60000,minutes:60000,hr:3600000,hour:3600000,hours:3600000,day:86400000,days:86400000};
  const re=/(\d+(?:\.\d+)?)\s*(milliseconds?|ms|seconds?|sec|minutes?|min|hours?|hr|days?)\b/g;
  let last=0,total=0,count=0;
  for(const m of text.matchAll(re)){
    if(text.slice(last,m.index).trim())return undefined;
    total+=Number(m[1])*units[m[2]];last=m.index!+m[0].length;count++;
  }
  return count&&!text.slice(last).trim()&&Number.isSafeInteger(Math.round(total))?Math.round(total):undefined;
}
export function parseFlowLabel(text:string):Pick<FlowRow,'label'|'scope'|'durationText'|'durationMillis'> {
  const m=text.trim().match(/^(.*) - \((.*) in (block|self)\)$/s);
  if(!m)return {label:text.trim()};
  return {label:m[1],scope:m[3] as 'block'|'self',durationText:m[2],durationMillis:parseFlowDuration(m[2])};
}
function tableState(cell:Element):Result {
  const label=cell.querySelector('.jenkins-visually-hidden')?.textContent?.trim()
    ||cell.querySelector('[tooltip]')?.getAttribute('tooltip')||'';
  const known:Record<string,Result>={Success:Result.success,Failed:Result.failure,Failure:Result.failure,
    Unstable:Result.unstable,Aborted:Result.aborted,'Not built':Result.not_built,'Not Built':Result.not_built,
    Disabled:Result.not_built,Skipped:Result.skipped,'In progress':Result.running,'In Progress':Result.running,
    Running:Result.running,Paused:Result.paused,Queued:Result.queued};
  return known[label]??Result.unknown;
}
/** Parse the known UI format, rejecting links to any other origin, job or build. */
export function parseFlowGraphHtml(html:string,buildUrl:string):FlowRow[] {
  if(typeof html!=='string'||html.length>8*1024*1024)fail('response exceeds the 8 MiB safety limit.');
  const expected=new URL(buildUrl);
  if(!/^https?:$/.test(expected.protocol)||expected.search||expected.hash||expected.username||expected.password
    ||!/^.*\/job\/.+\/\d+\/$/.test(expected.pathname))fail('invalid expected build URL.');
  // <template> is inert (including images, frames and scripts). Never attach it.
  const template=document.createElement('template');template.innerHTML=html;
  const tables=template.content.querySelectorAll('#nodeGraph > table');
  if(tables.length!==1)fail('expected one #nodeGraph table (login page or unsupported markup).');
  const table=tables[0], rows:FlowRow[]=[];const ids=new Set<number>();
  for(const tr of Array.from(table.querySelectorAll('tr'))){
    if(tr.closest('table')!==table)fail('nested tables are not supported.');
    const cells=Array.from(tr.children).filter(e=>e.tagName==='TD');if(!cells.length)continue;
    if(cells.length!==5)fail('unexpected table columns.');
    const links=cells[0].querySelectorAll('a[href]');if(links.length!==1)fail('ambiguous row link.');
    const link=links[0],u=new URL(link.getAttribute('href')!,expected);
    const suffix=u.pathname.slice(expected.pathname.length);
    if(u.origin!==expected.origin||u.username||u.password||u.search||u.hash
      ||!u.pathname.startsWith(expected.pathname)||!/^execution\/node\/\d+\/$/.test(suffix))
      fail('node URL does not belong to the selected build.');
    const id=Number(suffix.split('/')[2]);
    if(!Number.isSafeInteger(id)||ids.has(id))fail('duplicate or unsafe node ID.');ids.add(id);
    const hint=link.getAttribute('tooltip')||link.getAttribute('title');
    if(hint&&/^ID:/.test(hint)&&hint!==`ID: ${id}`)fail('node ID and tooltip disagree.');
    const fields=parseFlowLabel(link.textContent||'');
    const args=fields.label==='stage'?(cells[1].textContent||'').trim():'';
    if(!fields.label||fields.label.length>4500||args.length>4000)fail('invalid row name.');
    rows.push({id,depth:parseFlowDepth(cells[0].getAttribute('style')||''),...fields,args,state:tableState(cells[4])});
    if(rows.length>MAX_ROWS)fail('more than 30,000 rows.');
  }
  if(!rows.length)fail('empty table; no execution topology available.');
  return rows;
}
function hierarchy(rows:FlowRow[]):RowNode[] {
  if(!rows.length||rows.length>MAX_ROWS)fail('invalid row count.');
  const root:RowNode={id:-1,depth:-1,label:'root',args:'',state:Result.unknown,children:[]};
  const stack:RowNode[]=[root],seen=new Set<number>();const base=rows[0].depth;
  for(const row of rows){
    if(!Number.isSafeInteger(row.id)||row.id<0||seen.has(row.id))fail('invalid or duplicate ID.');seen.add(row.id);
    if(!Number.isInteger(row.depth)||row.depth<base||row.depth>MAX_DEPTH)fail('invalid depth.');
    while(stack.length>1&&stack[stack.length-1].depth>=row.depth)stack.pop();
    const parent=stack[stack.length-1];
    if(parent!==root && (row.depth!==parent.depth+1||parent.scope!=='block'))
      fail('inconsistent indentation or a non-block parent.');
    if(parent===root&&row.depth!==base)fail('missing ancestor rows.');
    const node:RowNode={...row,children:[]};parent.children.push(node);stack.push(node);
  }
  return root.children;
}
/**
 * Reconstruct containment from HTML rows, not names, elapsed overlaps or node ID arithmetic.
 * Stage/call and stage/body are a verified pair; use the body ID returned by wfapi.
 * Transparent wrappers are projected out. Explicit parallel blocks retain branch structure.
 */
export function adaptFlowRows(rows:FlowRow[],run:WfRun,runPath:string):Adapted {
  validateRun(run);
  if(!runPath.endsWith('/'+run.id+'/'))fail('run identity does not match the requested build.');
  const root=hierarchy(rows),byId=new Map(run.stages.map(s=>[Number(s.id),s]));
  const meta=new Map<number,NodeMeta>(),consumed=new Set<number>(),warnings:string[]=[];
  const live=isActive(run.status);
  let displayed=0;
  function make(row:RowNode,name:string,type:StageInfo['type'],children:StageInfo[],stepId=row.id,bodyId?:number):StageInfo {
    if(++displayed>3000)fail('more than 3,000 displayed nodes.');
    const candidates=[...new Set([row.id,stepId,bodyId].filter((n):n is number=>n!==undefined))];
    const matches=candidates.map(id=>byId.get(id)).filter(Boolean);
    if(matches.length>1)fail('wfapi exposes multiple chunks for one stage; cannot merge safely.');
    const raw=matches[0];if(raw)consumed.add(Number(raw.id));
    const id=raw?Number(raw.id):row.id;
    if(meta.has(id))fail('duplicate projected node.');
    const baseState=raw?status(raw.status):row.state;
    const base:StageInfo={id,name,title:name,state:baseState,type,children,
      startTimeMillis:raw?.startTimeMillis??0,pauseDurationMillis:raw?.pauseDurationMillis??0,
      agent:raw?.execNode||'',url:runPath+'execution/node/'+(bodyId??stepId)+'/log/',
      isSequential:children.length>0&&children[0].type!=='PARALLEL'};
    const flow:NonNullable<NodeMeta['flow']>={stepId,bodyId,depth:row.depth,tableState:row.state,
      tableDuration:row.durationText,rawState:raw?.status,rawDurationMillis:raw?.durationMillis,
      stateSource:children.length?'derived-children':raw?'wfapi':'html-node',durationSource:'unavailable'};
    if(children.length){
      // This is a display aggregate, not StatusAndTiming.computeChunkStatus.
      base.state=collapseSelectiveStages([base],new Set([id]))[0].state;
    }
    const ownLive=baseState===Result.running||baseState===Result.paused||baseState===Result.queued;
    if(!children.length&&raw){
      base.totalDurationMillis=ownLive?undefined:raw.durationMillis;
      flow.durationSource='wfapi';
    }else if(type==='PARALLEL'&&!raw){
      // Some branch wrapper rows in the supplied page say 5ms for 11min of work.
      // Never present that wrapper timing as the duration of its descendants.
      base.pauseLiveTotal=true;
      (base as any).pgvxDurationLabel='Duration unavailable';
    }else if(row.durationText&&row.durationMillis!==undefined){
      base.totalDurationMillis=row.durationMillis;base.pauseLiveTotal=true;
      flow.durationSource='html-rounded';
      (base as any).pgvxDurationLabel=(row.durationText.startsWith('<')?'':'~ ')+row.durationText+(live?' (snapshot)':'');
    }else{
      base.pauseLiveTotal=true;(base as any).pgvxDurationLabel='Duration unavailable';
    }
    meta.set(id,{kind:children.length?'group':'stage',raw,mode:children[0]?.type==='PARALLEL'?'parallel':'sequence',source:'flow-graph-table',flow});
    return base;
  }
  function sequence(nodes:RowNode[],level=0):StageInfo[] {
    if(level>50)fail('logical hierarchy exceeds 50 levels.');
    const out:StageInfo[]=[];
    for(const row of nodes){
      if(row.label==='stage'){
        const body=row.children.filter(r=>r.label.startsWith('stage block'));
        if(body.length>1||(row.children.length>0&&body.length!==1))fail('unrecognised stage/body pairing.');
        if(!row.args)fail('stage name missing from Arguments column.');
        const inner=body[0];
        if(inner&&inner.label!==`stage block (${row.args})`)fail('stage/body labels disagree.');
        let children=sequence(inner?inner.children:[],level+1);
        // A stage containing one parallel block is its natural named container.
        let parallelId:number|undefined;
        if(children.length===1&&children[0].type==='PARALLEL_BLOCK'){
          parallelId=children[0].id;meta.delete(parallelId);children=children[0].children;
        }
        const node=make(row,row.args,'STAGE',children,row.id,inner?.id);
        if(parallelId)meta.get(node.id)!.flow!.parallelId=parallelId;
        out.push(node);
      }else if(row.label==='parallel'){
        if(!row.children.length){if(!live)fail('completed parallel block has no branches.');out.push(make(row,'parallel','PARALLEL_BLOCK',[]));continue;}
        const branches:StageInfo[]=[];
        for(const b of row.children){
          const match=b.label.match(/^parallel block \(Branch: (.+)\)$/s);
          if(!match)fail('unsupported parallel branch markup.');
          const children=sequence(b.children,level+1),name=match[1];
          if(children.length===1&&children[0].type==='STAGE'&&children[0].name===name){
            const node={...children[0],type:'PARALLEL' as const};
            meta.get(node.id)!.flow!.branchId=b.id;branches.push(node);
          }else{
            branches.push(make(b,name,'PARALLEL',children));
          }
        }
        out.push(make(row,'parallel','PARALLEL_BLOCK',branches));
      }else if(row.label.startsWith('stage block')||row.label.startsWith('parallel block')){
        fail('orphan stage or parallel body.');
      }else{
        out.push(...sequence(row.children,level+1));
      }
    }
    return out;
  }
  const stages=sequence(root);
  const unmatched=run.stages.filter(s=>!consumed.has(Number(s.id)));
  if(unmatched.length)fail('wfapi stages are missing from this HTML snapshot: '+unmatched.map(s=>s.id).join(', ')+'. Refresh to read a consistent build snapshot.');
  const unsupported=walkStages(stages).filter(s=>s.state===Result.unknown);
  if(unsupported.length)warnings.push('Some HTML node states are unrecognised. Display aggregates may be incomplete; inspect the native Pipeline Steps page.');
  return {stages,meta,warnings,source:'flow-graph-table',complete:!live};
}
export function adaptFlowGraphHtml(html:string,run:WfRun,buildUrl:string):Adapted {
  const url=new URL(buildUrl);
  return adaptFlowRows(parseFlowGraphHtml(html,url.href),run,url.pathname);
}
