export type BuildMenuEntry=
  | {kind:'link';label:string;href:string}
  | {kind:'disabled';label:string;reason:string}
  | {kind:'separator'}
  | {kind:'header';label:string};

function label(value:unknown):string|null {
  return typeof value==='string'&&value.length>0&&value.length<=200&&!/[\x00-\x1f\x7f]/.test(value)?value:null;
}
function trustedBuildBase(buildUrl:string):{origin:string;jobPath:string;href:string} {
  const base=new URL(buildUrl);
  if(!['http:','https:'].includes(base.protocol)||base.username||base.password||base.search||base.hash||!/^\d+\/$/.test(base.pathname.split('/').slice(-2).join('/')))
    throw new Error('Invalid Jenkins build URL.');
  const jobPath=base.pathname.replace(/\d+\/$/,'');
  return {origin:base.origin,jobPath,href:base.href};
}
function safeActionUrl(value:unknown,buildUrl:string):string|null {
  if(typeof value!=='string'||!value)return null;
  const base=trustedBuildBase(buildUrl);
  let url:URL;
  try{url=new URL(value,base.href);}catch{return null;}
  if(url.origin!==base.origin||url.username||url.password||!url.pathname.startsWith(base.jobPath)||!['http:','https:'].includes(url.protocol))return null;
  return url.href;
}
export function normalizeBuildMenu(raw:any,buildUrl:string):BuildMenuEntry[] {
  trustedBuildBase(buildUrl);
  if(!raw||!Array.isArray(raw.items)||raw.items.length>100)throw new Error('Unexpected Jenkins build context menu schema.');
  const out:BuildMenuEntry[]=[];
  for(const item of raw.items){
    const type=typeof item?.type==='string'?item.type:'ITEM';
    if(type==='SEPARATOR'){out.push({kind:'separator'});continue;}
    if(type==='HEADER'){const text=label(item?.displayName);if(text)out.push({kind:'header',label:text});continue;}
    if(type!=='ITEM')continue;
    const text=label(item?.displayName);if(!text)continue;
    if(item?.post===true||item?.requiresConfirmation===true){out.push({kind:'disabled',label:text,reason:'Use the original Jenkins page for this action.'});continue;}
    const href=safeActionUrl(item?.url,buildUrl);if(href)out.push({kind:'link',label:text,href});
  }
  return out;
}
export async function loadBuildMenu(buildUrl:string,signal?:AbortSignal):Promise<BuildMenuEntry[]> {
  const base=trustedBuildBase(buildUrl);
  const target=new URL('contextMenu',base.href);
  const timeout=AbortSignal.timeout(20000);
  const combined=signal?AbortSignal.any([signal,timeout]):timeout;
  let response:Response;
  try{response=await fetch(target.href,{method:'GET',credentials:'same-origin',cache:'no-store',redirect:'error',headers:{Accept:'application/json'},signal:combined});}
  catch(e){if(signal?.aborted)throw e;throw new Error('Could not read Jenkins build actions.');}
  if(!response.ok)throw new Error('Jenkins returned HTTP '+response.status+' for build actions.');
  const type=response.headers.get('content-type')?.toLowerCase()||'';
  if(!type.includes('json'))throw new Error('Jenkins returned non-JSON build actions.');
  const text=await response.text();
  if(text.length>256*1024)throw new Error('Jenkins build actions response is too large.');
  let raw:any;try{raw=JSON.parse(text);}catch{throw new Error('Jenkins returned invalid build actions JSON.');}
  return normalizeBuildMenu(raw,base.href);
}
