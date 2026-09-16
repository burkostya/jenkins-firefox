/** Build metadata is independent of wfapi: an early NOT_BUILT run may have no graph. */
import type {JenkinsLocation} from './api.ts';
export const BUILD_FIELDS='number,result,building,timestamp,duration,artifacts[fileName,relativePath],actions[_class,failCount,skipCount,totalCount]';
export const OVERVIEW_TREE='name,fullName,lastBuild[number],lastSuccessfulBuild[number],builds['+BUILD_FIELDS+']{0,20}';
export type TestSummary = {state:'reported';total:number;passed:number;failed:number;skipped:number} | {state:'absent'|'unavailable';reason:string};
export interface BuildOverview {number:number;result:string;building:boolean;timestamp:number;duration:number;artifacts:null|{name:string;path:string;href:string}[];tests:TestSummary;warnings:string[];url:string;}
export interface JobOverview {name:string;fullName:string;builds:BuildOverview[];lastBuild:number|null;lastSuccessfulBuild:number|null;}
const integer=(v:unknown):v is number=>typeof v==='number'&&Number.isSafeInteger(v)&&v>=0;
export function buildNumber(v:unknown):number|null{return integer(v)&&v>0?v:null;}
export function testsFromActions(actions:unknown):TestSummary {
  if(!Array.isArray(actions))return {state:'unavailable',reason:'Test metadata unavailable'};
  const junit=actions.filter(a=>a?._class==='hudson.tasks.junit.TestResultAction');
  if(!junit.length)return {state:'absent',reason:'No JUnit report published'};
  if(junit.length!==1)return {state:'unavailable',reason:'Multiple JUnit summaries; open Jenkins to inspect'};
  const {totalCount:total,failCount:failed,skipCount:skipped}=junit[0];
  if(![total,failed,skipped].every(integer)||failed+skipped>total)return {state:'unavailable',reason:'Incomplete or invalid JUnit counters'};
  return {state:'reported',total,failed,skipped,passed:total-failed-skipped};
}
export function buildUrl(location:JenkinsLocation,number:number):string {
  if(!buildNumber(number))throw new Error('Invalid build number.');
  return location.origin+location.jobPath+number+'/';
}
export function artifactUrl(location:JenkinsLocation,number:number,path:unknown):string {
  if(typeof path!=='string'||!path||path.length>4096||/[\\\x00-\x1f\x7f]/.test(path))throw new Error('Invalid artifact path.');
  const parts=path.split('/');
  for(const part of parts){
    // Block path traversal and Jenkins special path directives, also percent-encoded ones.
    let value=part;
    for(let i=0;i<5;i++){
      if(!value||value==='.'||value==='..'||/[\\/*\x00-\x1f\x7f]/.test(value))throw new Error('Unsafe artifact path.');
      if(!/%[0-9a-f]{2}/i.test(value))break;
      try{const next=decodeURIComponent(value);if(next===value)break;value=next;}catch{throw new Error('Invalid artifact encoding.');}
      if(i===4)throw new Error('Excessively encoded artifact path.');
    }
  }
  const base=buildUrl(location,number)+'artifact/';
  const href=base+parts.map(encodeURIComponent).join('/');
  if(!new URL(href).pathname.startsWith(new URL(base).pathname))throw new Error('Artifact escaped its build.');
  return href;
}
export function normalizeBuild(raw:any,location:JenkinsLocation,expected?:number):BuildOverview {
  const number=buildNumber(raw?.number);
  if(!number||(expected!==undefined&&number!==expected))throw new Error('Unexpected build metadata identity.');
  if(typeof raw.building!=='boolean')throw new Error('Missing build activity state.');
  const result=raw.building?'IN_PROGRESS':typeof raw.result==='string'&&/^[A-Z_]+$/.test(raw.result)?raw.result:'UNKNOWN';
  const warnings:string[]=[];
  let artifacts:BuildOverview['artifacts']=null;
  if(Array.isArray(raw.artifacts)){
    if(raw.artifacts.length>5000)throw new Error('Too many artifacts in overview.');
    const seen=new Set<string>();artifacts=[];
    for(const a of raw.artifacts){
      try{const href=artifactUrl(location,number,a?.relativePath);if(seen.has(href))continue;seen.add(href);
        artifacts.push({href,path:a.relativePath,name:typeof a.fileName==='string'&&a.fileName?a.fileName:a.relativePath.split('/').pop()});}
      catch{warnings.push('An unsafe or malformed artifact entry was omitted.');}
    }
  }
  return {number,result,building:raw.building,timestamp:integer(raw.timestamp)?raw.timestamp:0,duration:integer(raw.duration)?raw.duration:0,
    artifacts,tests:testsFromActions(raw.actions),warnings:[...new Set(warnings)],url:buildUrl(location,number)};
}
export function normalizeOverview(raw:any,location:JenkinsLocation):JobOverview {
  if(!raw||!Array.isArray(raw.builds)||raw.builds.length>20||typeof raw.name!=='string'||typeof raw.fullName!=='string')throw new Error('Unexpected job overview schema.');
  if(raw._class&&raw._class!=='org.jenkinsci.plugins.workflow.job.WorkflowJob')throw new Error('Overview is not a Pipeline job.');
  const expected=location.jobPath.split('/job/').slice(1).map(s=>decodeURIComponent(s.replace(/\/$/,''))).join('/');
  if(raw.fullName!==expected)throw new Error('Job overview belongs to another job.');
  const builds=raw.builds.map((b:any)=>normalizeBuild(b,location)).sort((a:BuildOverview,b:BuildOverview)=>b.number-a.number);
  if(new Set(builds.map((b:BuildOverview)=>b.number)).size!==builds.length)throw new Error('Duplicate build numbers in overview.');
  return {name:raw.name,fullName:raw.fullName,builds,lastBuild:buildNumber(raw.lastBuild?.number),lastSuccessfulBuild:buildNumber(raw.lastSuccessfulBuild?.number)};
}
