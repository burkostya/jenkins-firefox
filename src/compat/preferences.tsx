import {createContext,useContext,useState,useEffect} from 'react';
import {readSetting,writeSetting} from '../storage.ts';
const Context=createContext<any>(null);
export function UserPreferencesProvider({children,storageKey}:{children:any;storageKey:string}){
  const [showNames,setNames]=useState(true),[showDurations,setTimes]=useState(true);
  useEffect(()=>{let disposed=false;readSetting<any>(storageKey,{}).then(v=>{if(!disposed){setNames(v.names!==false);setTimes(v.durations!==false);}});return()=>{disposed=true;};},[storageKey]);
  function setShowNames(v:boolean){setNames(v);void writeSetting(storageKey,{names:v,durations:showDurations});}
  function setShowDurations(v:boolean){setTimes(v);void writeSetting(storageKey,{names:showNames,durations:v});}
  return <Context.Provider value={{showNames,showDurations,setShowNames,setShowDurations}}>{children}</Context.Provider>;
}
export function useUserPreferences(){const c=useContext(Context);if(!c)throw new Error('Missing graph preferences');return c;}
