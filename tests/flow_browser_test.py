#!/usr/bin/env python3
"""Chromium DOM/integration tests of supplied Pipeline Steps HTML. No live Jenkins or native Firefox."""
import json, os, re
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
ROOT=Path(__file__).resolve().parents[1]
FLOW=Path(os.environ.get('FLOW_HTML',ROOT/'tests/flow-table.html')).read_text()
RUNS=json.loads((ROOT/'preview/runs.json').read_text())
TREE=json.loads((ROOT/'tests/tree-fixture.json').read_text())
BUNDLE=(ROOT/'tests/browser-bundle.js').read_text()
JOB='/job/bus_backend/job/BUS-4497-agent-flow-improvements/'
BUILD='https://jenkins.test'+JOB+'2/'
HTML='''<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;font:14px system-ui;color:#172b4d}main{padding:24px}h1{font-size:22px}
#test-result-trend{float:right;width:410px;height:165px;border:1px solid #b6c7d6;border-radius:8px;text-align:center;background:repeating-linear-gradient(to bottom,white 0,white 32px,#e7edf4 33px);margin:0 0 16px 24px}
#test-result-trend h3{background:white;padding:10px;margin:0}#test-result-trend small{background:white}
.artifacts{padding:18px 0}.test-notice{padding:10px;background:#edf5fb;font-size:12px;margin-bottom:12px}
</style></head><body><main id="main-panel"><div class="test-notice">Local browser test: hierarchy recovered from supplied Pipeline Steps HTML for build #2; wfapi fixture. Not a live Jenkins session.</div>
<h1>BUS-4497-agent-flow-improvements / #2</h1><div id="test-result-trend"><h3>Test Result Trend</h3><small>Floated widget / layout regression fixture</small></div>
<div class="artifacts">Last Successful Artifacts<br>openapi.tar.gz</div><div class="cbwf-stage-view">Original Stage View</div></main></body></html>'''
BOOT=r'''({runs,flow,tree,mode,location})=>{
 window.__testLocation=location;window.__runs=runs;window.__html=flow;window.__mode=mode;window.__requests=[];window.__tree=tree;
 window.__store={};window.browser={storage:{local:{async get(k){return {[k]:window.__store[k]};},async set(v){Object.assign(window.__store,v);}}}};
 window.fetch=async(url,opts={})=>{
  window.__requests.push({url,method:opts.method,credentials:opts.credentials,redirect:opts.redirect});
  const path=new URL(url).pathname;
  if(path.endsWith('/stages/tree')){
   if(window.__mode==='native')return new Response(JSON.stringify(window.__tree),{headers:{'Content-Type':'application/json'}});
   return new Response('',{status:window.__mode==='tree403'?403:404});
  }
  if(path.endsWith('/flowGraphTable/')){
   if(window.__mode==='denied')return new Response('',{status:403});
   if(window.__mode==='missing')return new Response('',{status:404});
   return new Response(window.__html,{headers:{'Content-Type':'text/html; charset=utf-8'}});
  }
  let data;
  if(path.endsWith('/wfapi/runs'))data=window.__runs;
  else if(path.endsWith('/wfapi/log'))data={text:'LOCAL MOCK LOG\n<script>window.__pwned=true</script>\n',hasMore:false};
  else if(path.includes('/execution/node/')){const id=path.match(/node\/(\d+)/)[1];data=window.__runs[0].stages.find(s=>s.id===id);}
  else if(path.endsWith('/wfapi/describe'))data=window.__runs[0];
  else throw new Error('Unexpected request '+url);
  return new Response(JSON.stringify(data),{headers:{'Content-Type':'application/json'}});
 };
}'''
checks=[]
def ok(name):
 checks.append(name);print('PASS',name,flush=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':1445,'height':1080},device_scale_factor=1)
 version=browser.version
 all_errors=[]
 def page_for(mode='html',flow=FLOW,runs=RUNS,steps_page=False):
  page=context.new_page();page.set_default_timeout(6000)
  page.on('pageerror',lambda e:all_errors.append(str(e)))
  markup=HTML.replace('<div class="cbwf-stage-view">Original Stage View</div>','<div id="nodeGraph">Original Pipeline Steps</div>') if steps_page else HTML
  page.set_content(markup)
  page.evaluate(BOOT,{'runs':runs,'flow':flow,'tree':TREE,'mode':mode,'location':BUILD+('flowGraphTable/' if steps_page else '')})
  page.add_script_tag(content=BUNDLE)
  expect(page.get_by_role('button',name='Refresh',exact=True)).to_be_enabled()
  page.get_by_label('Auto-refresh',exact=True).uncheck()
  return page
 page=page_for()
 expect(page.locator('.pgvx-notice')).to_have_count(0)
 expect(page.locator('#pipeline-graph-local-extension')).to_have_attribute('data-pgvx-source','Pipeline Steps HTML')
 expect(page.locator('.PWGx-PipelineGraph')).to_have_count(1)
 expect(page.locator('.pgvx-flat')).to_have_count(0)
 expect(page.locator('.pgvx-tree-row')).to_have_count(11)
 ok('HTML fallback creates a graph with 11 top-level entries, not a flat list or invented groups')
 data=page.evaluate('(build)=>{const rs=window.__flowTest.parseFlowGraphHtml(window.__html,build);const a=window.__flowTest.adaptFlowRows(rs,window.__runs[0],new URL(build).pathname);return {rows:rs.length,nodes:a.meta.size,stages:a.stages};}',BUILD)
 assert data['rows']==137 and data['nodes']==16
 test=next(n for n in data['stages'] if n['id']==81)
 assert [n['id'] for n in test['children']]==[93,95,97,99,101]
 assert test['pgvxDurationLabel']=='~ 11 min'
 ok('browser parses all 137 supplied rows and matches 16 stage IDs, with five Test children')
 page.locator('.pgvx-tree-item').filter(has_text=re.compile('^Test$')).click()
 expect(page.locator('.pgvx-group-details')).to_contain_text('Block duration: ~ 11 min')
 expect(page.locator('.pgvx-group-details')).to_contain_text('HTML call node 80 / body node 81 / parallel node 82')
 expect(page.locator('.pgvx-group-details')).to_contain_text('SUCCESS / 139 ms')
 ok('inspector exposes verified call/body mapping, rounded block time and raw chunk separately')
 node=page.get_by_role('link',name='Test',exact=True)
 node.hover();expect(page.locator('[role="tooltip"]')).to_contain_text('~ 11 min')
 ok('collapsed-node tooltip labels HTML time as approximate, not 139ms or exact 660000ms')
 page.mouse.move(0,0)
 page.screenshot(path=str(ROOT/'preview/flow-collapsed.png'),full_page=True)
 page.get_by_role('button',name='Expand Test',exact=True).click()
 for name in ['Tests','Lint','Vulnerability','Validate Migration Inventory','Lint Migrations']:
  expect(page.get_by_role('link',name=name,exact=True)).to_be_visible()
 ys=[page.get_by_role('link',name=name,exact=True).bounding_box()['y'] for name in ['Tests','Lint','Vulnerability','Validate Migration Inventory','Lint Migrations']]
 assert len(set(round(y,1) for y in ys))==5
 assert page.locator('.pgvx-tree-item').filter(has_text=re.compile('^(Prepare|API|Checks|Migrations|Publish)$')).count()==0
 ok('expanded graph has five separate parallel lanes and no invented API/Checks/Migrations groups')
 page.screenshot(path=str(ROOT/'preview/flow-expanded.png'),full_page=True)
 page.locator('.pgvx-graph-card').screenshot(path=str(ROOT/'preview/flow-graph.png'))
 page.get_by_role('link',name='Tests',exact=True).click()
 expect(page.locator('.pgvx-detail-heading')).to_contain_text('11m 02s / Node 93')
 expect(page.locator('.pgvx-step')).to_have_count(2)
 assert not any('/wfapi/log' in r['url'] for r in page.evaluate('window.__requests'))
 ok('leaf stage details keep precise wfapi timing and logs are not fetched speculatively')
 page.locator('.pgvx-step button').first.click()
 expect(page.locator('.pgvx-log pre')).to_contain_text('<script>window.__pwned=true</script>')
 assert page.evaluate('window.__pwned') is None
 ok('step logs remain text and cannot execute HTML')
 for width in [1445,1100,800]:
  page.set_viewport_size({'width':width,'height':1080});page.wait_for_timeout(60)
  chart=page.locator('#test-result-trend').bounding_box();host=page.locator('#pipeline-graph-local-extension').bounding_box()
  assert host['y']>=chart['y']+chart['height'] and host['width']<=width-48+1
 page.evaluate("document.querySelector('#test-result-trend').style.height='320px'");page.wait_for_timeout(50)
 assert page.locator('#pipeline-graph-local-extension').bounding_box()['y']>=page.locator('#test-result-trend').bounding_box()['y']+320
 ok('HTML-derived graph still clears Test Result Trend at three widths and after widget resize')
 failed=json.loads(json.dumps(RUNS));failed[0]['stages'][9]['status']='FAILED'
 failpage=page_for(runs=failed)
 expect(failpage.locator('.PWGx-pipeline-node').filter(has=failpage.get_by_role('link',name='Test',exact=True)).locator('svg')).to_have_attribute('aria-label','failure')
 failpage.locator('.pgvx-tree-item').filter(has_text=re.compile('^Test$')).click()
 expect(failpage.locator('.pgvx-group-details')).to_contain_text('Display state: failure')
 expect(failpage.locator('.pgvx-group-details')).to_contain_text('State is derived')
 ok('synthetic failed-child conflict makes Test red and labels the parent status as derived')
 steps=page_for(steps_page=True)
 expect(steps.locator('#main-panel > #nodeGraph')).to_be_hidden()
 steps.get_by_role('button',name='Original Pipeline Steps',exact=True).click()
 expect(steps.locator('#main-panel > #nodeGraph')).to_be_visible()
 steps.get_by_role('button',name='Graph view',exact=True).click()
 steps.get_by_role('button',name='Close local graph',exact=True).click()
 expect(steps.locator('#main-panel > #nodeGraph')).to_be_visible()
 ok('injection works on Pipeline Steps pages and restores the original table on toggle/close')
 native=page_for('native')
 expect(native.locator('.pgvx-notice')).to_have_count(0)
 expect(native.locator('#pipeline-graph-local-extension')).to_have_attribute('data-pgvx-source','Jenkins execution tree')
 assert not any('/flowGraphTable/' in r['url'] for r in native.evaluate('window.__requests'))
 ok('native stages/tree remains preferred and prevents redundant HTML fetches')
 denied=page_for('denied')
 expect(denied.locator('.pgvx-flat-item')).to_have_count(16)
 expect(denied.locator('#pipeline-graph-local-extension')).to_have_attribute('data-pgvx-source','wfapi / flat status list')
 expect(denied.locator('#pipeline-graph-local-extension')).to_have_attribute('data-pgvx-source-note',re.compile('HTTP 403'))
 expect(denied.locator('.PWGx-PipelineGraph')).to_have_count(0)
 ok('denied HTML returns labelled flat mode rather than bypassing access controls')
 fallback=page_for('tree403')
 expect(fallback.locator('.pgvx-notice')).to_have_count(0)
 expect(fallback.locator('#pipeline-graph-local-extension')).to_have_attribute('data-pgvx-source','Pipeline Steps HTML')
 expect(fallback.locator('#pipeline-graph-local-extension')).to_have_attribute('data-pgvx-source-note',re.compile('HTTP 403'))
 ok('native-tree permission error is preserved when the independently readable HTML is used')
 wrong=page_for(flow=FLOW.replace('/2/execution/node/','/1/execution/node/'))
 expect(wrong.locator('.pgvx-flat-item')).to_have_count(16)
 expect(wrong.locator('#pipeline-graph-local-extension')).to_have_attribute('data-pgvx-source-note',re.compile('selected build'))
 ok('HTML for another build is rejected even when stage names and IDs match')
 broken=page_for(flow=FLOW.replace('var(--table-padding)','var(--different-padding)'))
 expect(broken.locator('.pgvx-flat-item')).to_have_count(16)
 expect(broken.locator('#pipeline-graph-local-extension')).to_have_attribute('data-pgvx-source-note',re.compile('unsupported indentation'))
 ok('unknown depth markup fails closed without guessing from names or geometry')
 login=page_for(flow='<html><form>Sign in</form></html>')
 expect(login.locator('.pgvx-flat-item')).to_have_count(16)
 expect(login.locator('#pipeline-graph-local-extension')).to_have_attribute('data-pgvx-source-note',re.compile('expected one #nodeGraph table'))
 ok('login HTML is not mistaken for a pipeline graph')
 hostile='''<script>window.__htmlExecuted=true</script><img src="https://evil.invalid/leak"><iframe src="https://evil.invalid/frame"></iframe><base href="https://evil.invalid/">'''
 loads=[]
 page.on('request',lambda req:loads.append(req.url))
 page.route('https://evil.invalid/**',lambda route:route.abort())
 result=page.evaluate('({html,build})=>window.__flowTest.parseFlowGraphHtml(html,build).length',{'html':hostile+FLOW,'build':BUILD})
 page.wait_for_timeout(250)
 assert result==137 and page.evaluate('window.__htmlExecuted') is None and loads==[],loads
 assert page.locator('iframe').count()==0
 ok('inert HTML parsing does not run scripts, load images/frames, attach elements or honor an injected base URL')
 rejects=page.evaluate(r'''({html,build})=>{const local='href="'+new URL(build).pathname+'execution/node/2/"';const cases=[html.replace(local,'href="https://evil.invalid/node/2/"'),html.replace('tooltip="ID: 2"','tooltip="ID: 999"')];return cases.map(s=>{try{window.__flowTest.parseFlowGraphHtml(s,build);return false;}catch{return true;}});}''',{'html':FLOW,'build':BUILD})
 assert all(rejects),rejects
 ok('cross-origin node links and inconsistent tooltip IDs are rejected')
 page.get_by_role('button',name='Close local graph',exact=True).click();page.add_script_tag(content=BUNDLE)
 expect(page.get_by_role('link',name='Tests',exact=True)).to_be_visible()
 ok('verified hierarchy collapse preferences survive remounting')
 requests=page.evaluate('window.__requests')
 assert all(r['method']=='GET' and r['credentials']=='same-origin' and r['redirect']=='error' and r['url'].startswith('https://jenkins.test'+JOB) for r in requests)
 assert not any('/replay' in r['url'] or 'config.xml' in r['url'] or 'converter' in r['url'] for r in requests)
 ok('all network reads are job-scoped GETs; no Replay, converter, crumb, config or mutation calls')
 assert not all_errors,all_errors
 ok('no uncaught JavaScript errors across all HTML and native-tree scenarios')
 context.close();browser.close()
report={'browser':'Chromium '+version,'passed':len(checks),'checks':checks,'fixture':'Supplied build #2 Pipeline Steps HTML and wfapi; failed-child scenario is synthetic.','limitations':'Mock fetch/storage; not live Jenkins/SSO or native Firefox extension installation.'}
(ROOT/'tests/FLOW-BROWSER-TEST-REPORT.json').write_text(json.dumps(report,indent=2)+'\n')
print('PASSED',len(checks),'HTML browser checks')
