#!/usr/bin/env python3
"""DOM regressions. Mock server data; Chromium, NOT a native Firefox sandbox test."""
import json, os, re
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
ROOT=Path(__file__).resolve().parents[1]
RUNS=json.loads((ROOT/'preview/runs.json').read_text())
TREE=json.loads((ROOT/'tests/tree-fixture.json').read_text())
BUNDLE=(ROOT/'tests/browser-bundle.js').read_text()
HTML='''<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;font:14px system-ui;color:#172b4d}main{padding:24px}h1{font-size:22px}
#test-result-trend{float:right;width:440px;height:210px;border:1px solid #b6c7d6;border-radius:8px;text-align:center;background:repeating-linear-gradient(to bottom,white 0,white 40px,#e7edf4 41px);margin:0 0 12px 24px}
#test-result-trend h3{background:white;margin:0;padding:12px}#test-result-trend small{background:white}
.artifacts{padding:20px 0}.cbwf-stage-view{padding:20px;border:1px dashed #bbb}
.test-notice{background:#edf5fb;padding:10px;margin-bottom:12px;font-size:12px}
</style></head><body><main id="main-panel"><div class="test-notice">Regression harness: mocked Jenkins API. Server tree is a synthetic contract fixture, NOT the user's recovered Jenkinsfile.</div>
<h1>BUS-4497-agent-flow-improvements</h1><div id="test-result-trend"><h3>Test Result Trend</h3><small>Layout fixture / floated Jenkins action</small></div>
<div class="artifacts">Last Successful Artifacts<br>openapi.tar.gz</div>
<div class="stage-wrapper"><div class="cbwf-stage-view">Original Stage View</div></div></main></body></html>'''
BOOTSTRAP=r'''({runs,tree,mode})=>{
 window.__runs=runs;window.__tree=tree;window.__mode=mode;window.__requests=[];
 window.__store={'pgvx/v1/https://jenkins.test/job/bus_backend/job/BUS-4497-agent-flow-improvements//profile':{version:1,items:[{name:'FAKE OLD GROUP',kind:'sequence',children:['Test']}]}};
 window.browser={storage:{local:{async get(k){return {[k]:window.__store[k]};},async set(v){Object.assign(window.__store,v);}}}};
 window.fetch=async(url,opts={})=>{
  const path=new URL(url).pathname;window.__requests.push({url,method:opts.method,credentials:opts.credentials});
  if(window.__mode==='403')return new Response('',{status:403});
  if(window.__mode==='html')return new Response('<html>Login</html>',{headers:{'Content-Type':'text/html'}});
  let data;
  if(path.endsWith('/wfapi/runs'))data=window.__runs;
  else if(path.endsWith('/stages/tree')){
   if(window.__mode==='flat')return new Response('',{status:404});
   if(window.__mode==='tree403')return new Response('',{status:403});
   if(window.__mode==='malformedTree')data={status:'ok',data:{stages:[]}};
   else data=window.__tree;
  }
  else if(path.endsWith('/wfapi/log'))data={text:'MOCK LOG\n<script>alert("text only")</script>\n',hasMore:window.__mode==='truncated'};
  else if(path.includes('/execution/node/')){const id=path.match(/node\/(\d+)/)[1];data=window.__runs[0].stages.find(s=>s.id===id);}
  else if(path.endsWith('/wfapi/describe'))data={...window.__runs[0],id:'99',name:'#99'};
  else throw new Error('Unexpected mock request '+url);
  return new Response(JSON.stringify(data),{headers:{'Content-Type':'application/json'}});
 };
}'''
checks=[]
def ok(name):
 checks.append(name);print('PASS',name,flush=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
 version=browser.version
 context=browser.new_context(viewport={'width':1445,'height':1100},device_scale_factor=1)
 def page_for(mode='flat',tree=TREE,runs=RUNS,location=None):
  page=context.new_page();page.set_default_timeout(6000)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(HTML);page.evaluate(BOOTSTRAP,{'runs':runs,'tree':tree,'mode':mode})
  if location:page.evaluate('v=>window.__testLocation=v',location)
  page.add_script_tag(content=BUNDLE)
  return page,errors
 flat,errors=page_for()
 expect(flat.locator('.pgvx-flat-item')).to_have_count(16)
 expect(flat.locator('.PWGx-PipelineGraph')).to_have_count(0)
 expect(flat.locator('.cbwf-stage-view')).to_be_hidden()
 expect(flat.locator('.pgvx-notice')).to_contain_text('Hierarchy is unavailable')
 expect(flat.locator('.pgvx-warning')).to_contain_text('404')
 ok('missing server tree gives 16 raw statuses, no graph edges, groups or fake parent status')
 assert flat.get_by_role('button',name='Grouping',exact=True).count()==0
 assert 'FAKE OLD GROUP' not in flat.locator('#pipeline-graph-local-extension').inner_text()
 ok('0.1.0 local grouping is not read or reused')
 for width in [1445,1100,800]:
  flat.set_viewport_size({'width':width,'height':1100});flat.wait_for_timeout(60)
  chart=flat.locator('#test-result-trend').bounding_box();host=flat.locator('#pipeline-graph-local-extension').bounding_box()
  assert host['y']>=chart['y']+chart['height'],(width,host,chart)
  assert host['width']<=width-48+1,(width,host)
 ok('extension host clears right-floated Test Result Trend at 1445, 1100 and 800px')
 flat.evaluate("document.querySelector('#test-result-trend').style.height='320px'")
 flat.wait_for_timeout(50)
 chart=flat.locator('#test-result-trend').bounding_box();host=flat.locator('#pipeline-graph-local-extension').bounding_box()
 assert host['y']>=chart['y']+chart['height']
 ok('asynchronous trend resize does not overlap the extension')
 flat.set_viewport_size({'width':1445,'height':1100})
 flat.locator('.pgvx-tree-item').filter(has_text=re.compile('^Test$')).click()
 expect(flat.locator('.pgvx-detail-heading')).to_contain_text('SUCCESS / 139 ms')
 expect(flat.locator('.pgvx-detail-warning')).to_contain_text('not a verified leaf stage or parent summary')
 ok('raw green Test is explicitly distinguished from an enclosing-stage summary')
 flat.get_by_role('button',name='Original Stage View',exact=True).click()
 expect(flat.locator('.cbwf-stage-view')).to_be_visible()
 flat.get_by_role('button',name='Graph view',exact=True).click()
 expect(flat.locator('.cbwf-stage-view')).to_be_hidden()
 ok('native Stage View is restored on toggle and hidden again on return')
 flat.get_by_role('button',name='Close local graph',exact=True).click()
 expect(flat.locator('.cbwf-stage-view')).to_be_visible()
 expect(flat.locator('#test-result-trend')).to_be_visible()
 flat.add_script_tag(content=BUNDLE);flat.add_script_tag(content=BUNDLE)
 expect(flat.locator('#pipeline-graph-local-extension')).to_have_count(1)
 ok('closing restores Stage View and repeated toolbar activation is idempotent')
 assert not errors,errors
 server,errors=page_for('tree')
 expect(server.locator('.pgvx-notice')).to_contain_text('Jenkins execution tree')
 expect(server.locator('.PWGx-pipeline-node')).to_have_count(7)
 expect(server.locator('.pgvx-flat')).to_have_count(0)
 test_link=server.get_by_role('link',name='Test',exact=True)
 expect(server.locator('.PWGx-pipeline-node').filter(has=test_link).locator('svg')).to_have_attribute('aria-label','failure')
 ok('collapsed real Test parent is red from the server tree, not green from wfapi')
 server.get_by_role('button',name='Expand Test',exact=True).click()
 expect(server.get_by_role('link',name='Tests',exact=True)).to_be_visible()
 expect(server.get_by_role('link',name='Lint',exact=True)).to_be_visible()
 server.locator('.pgvx-tree-item').filter(has_text=re.compile('^Test$')).click()
 expect(server.locator('.pgvx-group-details')).to_contain_text('Server state: failure')
 expect(server.locator('.pgvx-group-details')).to_contain_text('11m 02s')
 ok('expanded Test contains actual supplied children and preserves server block duration')
 server.get_by_role('link',name='Tests',exact=True).click()
 expect(server.locator('.pgvx-detail-heading')).to_contain_text('failure')
 expect(server.locator('.pgvx-detail-warning')).to_contain_text('wfapi reports SUCCESS')
 expect(server.locator('.pgvx-step')).to_have_count(2)
 ok('details do not overwrite server status with conflicting wfapi chunk status')
 server.locator('.pgvx-step button').first.click()
 expect(server.locator('.pgvx-log pre')).to_contain_text('<script>alert("text only")</script>')
 assert server.locator('.pgvx-log script').count()==0
 ok('logs remain text-only and are fetched only on click')
 server.evaluate("window.__mode='truncated'")
 server.get_by_role('button',name='Reload log',exact=True).click()
 expect(server.locator('.pgvx-log .pgvx-warning')).to_contain_text('truncated')
 server.evaluate("window.__mode='tree'")
 ok('truncated log response remains clearly indicated')
 server.get_by_role('button',name='Dark',exact=True).click()
 assert server.locator('#pipeline-graph-local-extension').get_attribute('data-theme')=='dark'
 server.get_by_role('button',name='Light',exact=True).click()
 ok('theme changes remain isolated to the extension')
 server.get_by_role('button',name='Zoom in',exact=True).click()
 server.get_by_role('button',name='Fit graph',exact=True).click()
 server.get_by_role('button',name='Expand view',exact=True).click()
 expect(server.locator('.is-fullscreen')).to_have_count(1)
 server.keyboard.press('Escape');expect(server.locator('.is-fullscreen')).to_have_count(0)
 ok('graph zoom, fit and expanded viewport remain functional')
 server.get_by_role('button',name='Expand all stages',exact=True).click()
 expect(server.get_by_role('link',name='AI assistance',exact=True)).to_be_visible()
 server.get_by_role('button',name='Collapse all stages',exact=True).click()
 expect(server.locator('.PWGx-pipeline-node')).to_have_count(7)
 ok('collapse all and expand all use only server-defined containers')
 badge=server.locator('.PWGx-pipeline-small-label').filter(has_text='Test').locator('[role="button"]')
 badge.focus();badge.press('Enter')
 expect(server.get_by_role('link',name='Tests',exact=True)).to_be_visible()
 ok('upstream collapse badge is keyboard-operable')
 for r in server.evaluate('window.__requests'):
  assert r['method']=='GET' and r['credentials']=='same-origin' and r['url'].startswith('https://jenkins.test/job/')
 assert not errors,errors
 ok('all requests stay read-only, same-origin and job-scoped; no uncaught JS errors')
 server.get_by_role('button',name='Close local graph',exact=True).click();server.add_script_tag(content=BUNDLE)
 expect(server.get_by_role('link',name='Tests',exact=True)).to_be_visible()
 ok('server-tree collapse preferences survive remounting')
 # Screenshot is explicitly labeled as a synthetic tree contract test.
 server.locator('.pgvx-tree-item').filter(has_text=re.compile('^Test$')).click()
 server.screenshot(path=str(ROOT/'preview/regression-server-tree.png'),full_page=True)
 flat.screenshot(path=str(ROOT/'preview/regression-wfapi-flat.png'),full_page=True)
 denied,_=page_for('tree403');expect(denied.locator('.pgvx-flat-item')).to_have_count(16)
 expect(denied.locator('.pgvx-warning')).to_contain_text('HTTP 403')
 ok('tree authorization failure is not mistaken for missing plugin or successful hierarchy')
 malformed,_=page_for('malformedTree');expect(malformed.locator('.pgvx-warning')).to_contain_text('Invalid Pipeline Graph View tree envelope')
 expect(malformed.locator('.pgvx-flat-item')).to_have_count(16)
 ok('invalid tree data fails to explicitly labelled flat mode without invented groups')
 html,_=page_for('html');expect(html.get_by_role('alert')).to_contain_text('non-JSON')
 ok('login HTML is rejected rather than rendered as a build')
 mismatch=json.loads(json.dumps(TREE));mismatch['data']['stages'][3]['children'][0]['id']='9093'
 unmatched,_=page_for('tree',tree=mismatch)
 unmatched.get_by_role('button',name='Expand Test',exact=True).click();unmatched.get_by_role('link',name='Tests',exact=True).click()
 expect(unmatched.locator('.pgvx-group-details')).to_contain_text('not matched by name')
 assert not any('/node/9093/' in r['url'] for r in unmatched.evaluate('window.__requests'))
 ok('unmatched server node IDs are not remapped to unrelated wfapi nodes by name')
 live_tree=json.loads(json.dumps(TREE));live_tree['data']['complete']=False
 live,_=page_for('tree',tree=live_tree,location='https://jenkins.test/job/bus_backend/job/BUS-4497-agent-flow-improvements/2/')
 expect(live.locator('.pgvx-notice')).to_contain_text('Jenkins execution tree')
 before=len(live.evaluate('window.__requests'));live.wait_for_timeout(5300)
 assert len(live.evaluate('window.__requests'))>before
 live.get_by_label('Auto-refresh',exact=True).uncheck()
 ok('tree complete=false keeps explicit builds polling even when wfapi reports SUCCESS')
 context.close();browser.close()
report={'browser':'Chromium '+version,'mode':'DOM harness with mocked fetch/storage; no native Firefox test','passed':len(checks),'checks':checks,'fixture_note':'tree-fixture.json is synthetic contract test data, not reconstructed from the user wfapi response.'}
(ROOT/'tests/BROWSER-TEST-REPORT.json').write_text(json.dumps(report,indent=2)+'\n')
print('PASSED',len(checks),'browser checks')
