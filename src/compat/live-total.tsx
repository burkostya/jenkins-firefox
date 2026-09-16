import {useState,useEffect} from 'react';
import {formatMs} from '../model.ts';
export default function LiveTotal({total,start,paused,label}:{total?:number;start:number;paused?:boolean;label?:string}){
  const [now,setNow]=useState(Date.now());
  useEffect(()=>{if(total!==undefined || paused)return;const id=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(id);},[total,paused]);
  return <>{label??(paused&&total===undefined?'Unknown':formatMs(total??Math.max(0,now-start)))}</>;
}
