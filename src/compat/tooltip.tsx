import {createContext,useContext,useState,cloneElement} from 'react';
import {createPortal} from 'react-dom';
export const TooltipRoot=createContext<HTMLElement|null>(null);
export default function Tooltip({children,content}:any){
  const root=useContext(TooltipRoot),[position,setPosition]=useState<{x:number;y:number}|null>(null);
  if(content===undefined)return children;
  function show(e:any){const r=e.currentTarget.getBoundingClientRect();setPosition({x:Math.min(window.innerWidth-180,Math.max(180,r.x+r.width/2)),y:r.bottom+8});}
  return <>{cloneElement(children,{
    onMouseEnter:(e:any)=>{children.props.onMouseEnter?.(e);show(e);},
    onMouseLeave:(e:any)=>{children.props.onMouseLeave?.(e);setPosition(null);},
    onFocus:(e:any)=>{children.props.onFocus?.(e);show(e);},
    onBlur:(e:any)=>{children.props.onBlur?.(e);setPosition(null);}
  })}{position&&root&&createPortal(<div role="tooltip" className="pgvx-tooltip" style={{left:position.x,top:position.y}}>{content}</div>,root)}</>;
}
