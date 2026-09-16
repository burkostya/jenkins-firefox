(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.PGVXActivation=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const STORAGE_KEY='autoOrigins';
  function parseHttpUrl(value){
    try{
      const url=new URL(String(value||''));
      return (url.protocol==='http:'||url.protocol==='https:')?url:null;
    }catch{return null;}
  }
  function isJobUrl(value){
    const url=parseHttpUrl(value);
    return !!url&&url.pathname.includes('/job/');
  }
  function originFromUrl(value){
    const url=parseHttpUrl(value);
    return url?url.origin:null;
  }
  function patternFromOrigin(origin){
    const url=parseHttpUrl(origin);
    if(!url||url.origin!==origin)return null;
    return url.origin+'/*';
  }
  function normalizeOrigins(value){
    if(!Array.isArray(value))return [];
    const result=[];
    for(const item of value){
      const origin=originFromUrl(item);
      if(origin===item&&!result.includes(origin))result.push(origin);
    }
    return result;
  }
  return {STORAGE_KEY,isJobUrl,originFromUrl,patternFromOrigin,normalizeOrigins};
});
