declare const browser:any;
export async function readSetting<T>(key:string,fallback:T):Promise<T>{
  try{const data=await browser.storage.local.get(key);return data[key]??fallback;}
  catch{return fallback;}
}
export async function writeSetting(key:string,value:unknown):Promise<void>{
  try{await browser.storage.local.set({[key]:value});}
  catch{console.warn('Pipeline Graph Local: preferences could not be saved.');}
}
