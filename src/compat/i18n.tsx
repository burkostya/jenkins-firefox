import { createContext, useContext } from 'react';
export enum LocalizedMessageKey {
  startedAgo='startedAgo',queued='queued',noBuilds='noBuilds',start='node.start',end='node.end',
  changesSummary='changes.summary',settings='settings',showNames='settings.showStageName',
  showDuration='settings.showStageDuration',consoleNewTab='console.newTab',tailLogsResume='tailLogs.resume',
  tailLogsPause='tailLogs.pause',expandNestedStages='collapse.expandNested',collapseNestedStages='collapse.collapseNested',
  expandAllStages='collapse.expandAll',collapseAllStages='collapse.collapseAll'
}
const values:Record<string,string>={
  'node.start':'Start','node.end':'End','collapse.expandNested':'Expand nested stages',
  'collapse.collapseNested':'Collapse nested stages','collapse.expandAll':'Expand all stages',
  'collapse.collapseAll':'Collapse all stages','noBuilds':'No builds',queued:'Queued',startedAgo:'Started'
};
export class Messages {format(key:string,args?:Record<string,unknown>){return values[key]??(args?Object.values(args).join(' '):key);}}
export const I18NContext=createContext(new Messages());
export const useMessages=()=>useContext(I18NContext);
export const useLocale=()=> 'en';
