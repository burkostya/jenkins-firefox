import { WfRun, WfNode, validateRun } from './model.ts';
import {BUILD_FIELDS,OVERVIEW_TREE,normalizeOverview,normalizeBuild} from './overview.ts';
export interface JenkinsLocation {origin:string; jobPath:string; build?:string; runPath?:string; label:string;isJobPage?:boolean;}
export function parseLocation(href:string):JenkinsLocation {
  const u=new URL(href);
  if(!['http:','https:'].includes(u.protocol))throw new Error('Open a Jenkins job or build page over HTTP(S), then click the extension.');
  // Preserve encoded branch slashes and any /jenkins context prefix.
  const m=u.pathname.match(/^(.*?)(\/job\/[^/]+(?:\/job\/[^/]+)*)(?:\/(.*))?$/);
  if(!m)throw new Error('Open a Jenkins job or build page with /job/... in its URL, then click the extension.');
  const jobPath=m[1]+m[2]+'/';
  const tail=(m[3]||'').split('/')[0];
  const build=/^(\d+|last(?:Build|SuccessfulBuild|CompletedBuild|FailedBuild|StableBuild|UnstableBuild|UnsuccessfulBuild))$/.test(tail)?tail:undefined;
  let label=m[2].split('/job/').filter(Boolean).map(x=>{try{return decodeURIComponent(x);}catch{return x;}}).join(' / ');
  return {origin:u.origin,jobPath,build,runPath:build?jobPath+build+'/':undefined,label,isJobPage:u.pathname===jobPath||u.pathname===jobPath.slice(0,-1)};
}
export function safeJobUrl(href:string, location:JenkinsLocation):string {
  if(typeof href!=='string' || !href)throw new Error('Missing Jenkins link.');
  const u=new URL(href,location.origin+location.jobPath);
  if(u.origin!==location.origin || u.username || u.password || !u.pathname.startsWith(location.jobPath))
    throw new Error('Blocked a link outside the current Jenkins job.');
  return u.href;
}
export class JenkinsHttpError extends Error {
  constructor(public statusCode:number,message:string){super(message);this.name='JenkinsHttpError';}
}
export class JenkinsApi {
  constructor(public location:JenkinsLocation){}
  runPath(run:WfRun){return this.location.jobPath+encodeURIComponent(run.id)+'/';}
  private endpoint(path:string):string {
    const href=safeJobUrl(path,this.location),u=new URL(href);
    const suffix=u.pathname.slice(this.location.jobPath.length);
    // Only these two fixed Remote API queries are allowed; callers cannot request
    // parameters, environment variables, credentials, arbitrary depth or script actions.
    if(!u.hash && /^(?:api\/json|[1-9]\d*\/api\/json)$/.test(suffix)){
      const fields=suffix==='api/json'?OVERVIEW_TREE:BUILD_FIELDS;
      if([...u.searchParams].length===1 && u.searchParams.get('tree')===fields)return href;
    }
    // No Jenkins mutation endpoints, arbitrary same-origin fetches or other queries.
    if(u.search || u.hash || !/^(?:wfapi\/runs|(?:\d+|last(?:Build|SuccessfulBuild|CompletedBuild|FailedBuild|StableBuild|UnstableBuild|UnsuccessfulBuild))\/wfapi\/describe|\d+\/execution\/node\/\d+\/wfapi\/(?:describe|log)|\d+\/stages\/tree|\d+\/flowGraphTable)\/?$/.test(suffix))
      throw new Error('Blocked an unexpected API endpoint.');
    return href;
  }
  private async read(path:string,kind:'json'|'html',signal?:AbortSignal,maxBytes=8*1024*1024):Promise<string> {
    const target=this.endpoint(path);
    const timeout=AbortSignal.timeout(20000);
    const combined=signal?AbortSignal.any([signal,timeout]):timeout;
    let response:Response;
    try{response=await fetch(target,{method:'GET',credentials:'same-origin',cache:'no-store',redirect:'error',headers:{Accept:kind==='json'?'application/json':'text/html'},signal:combined});}
    catch(e){if(signal?.aborted)throw e;throw new Error('Could not read Jenkins API. Check your Jenkins login, network, TLS certificate and same-origin access.');}
    if(!response.ok){
      const hint=response.status===404?' Pipeline REST API must be available for this job.':
        [401,403].includes(response.status)?' Log in to Jenkins and check job/read permissions.':'';
      throw new JenkinsHttpError(response.status,'Jenkins returned HTTP '+response.status+'.'+hint);
    }
    const type=response.headers.get('content-type')?.toLowerCase()||'';
    if(kind==='json'?!type.includes('json'):!type.includes('text/html'))throw new Error(kind==='json'?'Jenkins returned non-JSON data (possibly a login page). Log in normally and retry.':'Pipeline Steps returned non-HTML data.');
    const reader=response.body?.getReader();
    let text='';
    if(reader){
      const decoder=new TextDecoder();let size=0;
      try{for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;
        if(size>maxBytes){await reader.cancel();throw new Error('API response exceeds the local '+Math.round(maxBytes/1024/1024)+' MiB safety limit. Open the Jenkins console instead.');}
        text+=decoder.decode(value,{stream:true});}text+=decoder.decode();}
      finally{reader.releaseLock();}
    }else{text=await response.text();if(text.length>maxBytes)throw new Error('API response too large.');}
    return text;
  }
  async json(path:string,signal?:AbortSignal,maxBytes=8*1024*1024):Promise<any> {
    const text=await this.read(path,'json',signal,maxBytes);
    try{return JSON.parse(text);}catch{throw new Error('Jenkins returned invalid JSON.');}
  }
  async overview(signal?:AbortSignal){
    return normalizeOverview(await this.json(this.location.jobPath+'api/json?tree='+encodeURIComponent(OVERVIEW_TREE),signal),this.location);
  }
  async buildOverview(number:number,signal?:AbortSignal){
    if(!Number.isSafeInteger(number)||number<1)throw new Error('Invalid build number.');
    return normalizeBuild(await this.json(this.location.jobPath+number+'/api/json?tree='+encodeURIComponent(BUILD_FIELDS),signal),this.location,number);
  }
  async flowGraphTable(run:WfRun,signal?:AbortSignal):Promise<string> {
    return this.read(this.runPath(run)+'flowGraphTable/','html',signal);
  }
  async runs(signal?:AbortSignal):Promise<WfRun[]> {
    const data=await this.json(this.location.jobPath+'wfapi/runs',signal);
    if(!Array.isArray(data) || data.length>500)throw new Error('Unexpected wfapi/runs response. Expected an array with at most 500 runs.');
    return data.map(validateRun);
  }
  async tree(run:WfRun,signal?:AbortSignal):Promise<unknown|null> {
    try { return await this.json(this.runPath(run)+'stages/tree',signal); }
    catch(e) { if(e instanceof JenkinsHttpError && e.statusCode===404)return null; throw e; }
  }
  async describe(build:string,signal?:AbortSignal):Promise<WfRun> {
    if(!/^(\d+|last(?:Build|SuccessfulBuild|CompletedBuild|FailedBuild|StableBuild|UnstableBuild|UnsuccessfulBuild))$/.test(build))throw new Error('Invalid build identifier.');
    const run=validateRun(await this.json(this.location.jobPath+build+'/wfapi/describe',signal));
    if(/^\d+$/.test(build)&&run.id!==build)throw new Error('Unexpected wfapi build identity.');
    return run;
  }
  async stage(run:WfRun,node:WfNode,signal?:AbortSignal):Promise<WfNode> {
    const data=await this.json(this.runPath(run)+'execution/node/'+encodeURIComponent(node.id)+'/wfapi/describe',signal);
    if(!data || String(data.id)!==node.id || (data.stageFlowNodes!==undefined && !Array.isArray(data.stageFlowNodes)))throw new Error('Unexpected node detail response.');
    return data;
  }
  async log(run:WfRun,node:WfNode,signal?:AbortSignal):Promise<{text:string;hasMore:boolean}> {
    if(!/^\d+$/.test(node.id))throw new Error('Invalid step identifier.');
    const data=await this.json(this.runPath(run)+'execution/node/'+node.id+'/wfapi/log',signal,2*1024*1024);
    if(!data || typeof data.text!=='string')throw new Error('Unexpected wfapi/log response: no text field. Use the native console link.');
    const limit=200000;
    return {text:data.text.slice(0,limit),hasMore:!!data.hasMore || data.text.length>limit};
  }
}
