#!/usr/bin/env python3
"""Offline Chromium DOM regression. Not a live Jenkins or Firefox WebExtension test."""
import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('TEST_OUTPUT_DIR',ROOT/'test-results'));OUT.mkdir(parents=True,exist_ok=True)
JOB=json.loads((ROOT/'tests/fixtures/job-overview.json').read_text())
HTML=(ROOT/'tests/fixtures/job-page.html').read_text()
BUNDLE=(ROOT/'tests/browser-bundle.js').read_text()
BOOT=r'''job=>{
 window.__testLocation='https://jenkins.test/job/example-service/job/feature-release/';
 window.__job=job;window.__requests=[];window.__graphMissing=false;window.__overviewDenied=false;window.__deferred=[];window.__defer=false;
 window.browser={storage:{local:{async get(){return {};},async set(){}}}};
 const json=data=>new Response(JSON.stringify(data),{headers:{'Content-Type':'application/json'}});
 window.__run=n=>({id:String(n),name:'#'+n,status:job.builds.find(b=>b.number===n)?.result==='FAILURE'?'FAILED':'SUCCESS',startTimeMillis:1,durationMillis:1000,stages:[{id:'10',name:'Build '+n,status:'SUCCESS',startTimeMillis:1,durationMillis:1000}]});
 window.fetch=async(url,opts={})=>{
  const u=new URL(url),p=u.pathname;window.__requests.push({url,method:opts.method});
  if(p.endsWith('/api/json')){
    const selected=p.match(/\/(\d+)\/api\/json$/);
    if(window.__overviewDenied)return new Response('',{status:403});
    const data=selected?window.__job.builds.find(b=>b.number===Number(selected[1])):structuredClone(window.__job);
    if(window.__defer&&!selected){window.__defer=false;return new Promise(resolve=>window.__deferred.push(()=>resolve(json(data))));}
    return json(data);
  }
  if(p.endsWith('/contextMenu')){
    const n=Number(p.match(/\/(\d+)\/contextMenu$/)[1]),base='https://jenkins.test/job/example-service/job/feature-release/'+n+'/';
    return json({items:[
      {type:'ITEM',displayName:'Changes',url:base+'changes',post:false,requiresConfirmation:false},
      {type:'ITEM',displayName:'Console Output',url:base+'console',post:false,requiresConfirmation:false},
      {type:'SEPARATOR'},
      {type:'ITEM',displayName:'Test Result',url:base+'testReport/',post:false,requiresConfirmation:false},
      {type:'ITEM',displayName:'Delete build',url:base+'doDelete',post:true,requiresConfirmation:true}
    ]});
  }
  if(p.endsWith('/wfapi/runs'))return json(window.__job.builds.filter(b=>b.number>=3).map(b=>window.__run(b.number)));
  if(p.endsWith('/wfapi/describe')){const n=Number(p.match(/\/(\d+)\/wfapi/)[1]);return n<3||window.__graphMissing?new Response('',{status:404}):json(window.__run(n));}
  if(p.endsWith('/stages/tree')){const n=Number(p.match(/\/(\d+)\/stages/)[1]);return json({status:'ok',data:{complete:true,stages:[{id:10,name:'Build '+n,state:'SUCCESS',type:'STAGE',children:[],totalDurationMillis:1000,startTimeMillis:1}]}});}
  if(p.endsWith('/flowGraphTable/'))return new Response('',{status:404});
  throw new Error('Unexpected request '+url);
 };
}'''
checks=[]
def ok(name): checks.append(name);print('PASS',name,flush=True)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1600,'height':1100});page.set_default_timeout(6000)
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.set_content(HTML);page.evaluate(BOOT,JOB);page.add_script_tag(content=BUNDLE)
    tests=page.get_by_role('region',name='Selected build tests')
    artifacts=page.get_by_role('region',name='Selected build artifacts')
    expect(tests).to_contain_text('4,118');expect(tests).to_contain_text('4,105')
    expect(artifacts.locator('li')).to_have_count(2)
    expect(page.locator('.PWGx-PipelineGraph')).to_have_count(1)
    expect(page.locator('.pgvx-run-summary')).to_contain_text('#4')
    ok('latest metadata and graph select build #4 with 4105 passed / 13 skipped')
    for selector in ['#trend-widget','#native-artifacts','#native-tests','#buildHistoryPage','.jenkins-app-bar','.cbwf-stage-view','.permalinks-header','.permalinks-list']:
        expect(page.locator(selector)).to_be_hidden()
    assert 'Full project name: example-service/feature-release' not in page.locator('#main-panel').inner_text()
    expect(page.locator('#tasks')).to_be_visible();expect(page.locator('#other-plugin')).to_be_visible()
    assert page.locator('#pipeline-graph-local-extension').bounding_box()['y']<100
    ok('known widgets and native permalink footer replaced compactly; navigation and unknown plugin preserved')
    page.evaluate("""{
      const root=document.createElement('div');root.id='breadcrumb-popover';
      root.innerHTML='<div class="jenkins-dropdown__split-container"><div id="duplicate-actions"><div class="jenkins-dropdown"><a class="jenkins-dropdown__item" href="/job/example-service/job/feature-release/changes">Changes</a><a class="jenkins-dropdown__item" href="/job/example-service/job/feature-release/build">Build Now</a></div></div><div id="permalink-column"><div class="jenkins-dropdown"><a class="jenkins-dropdown__item" href="/job/example-service/job/feature-release/lastBuild/">Last build</a><a class="jenkins-dropdown__item" href="/job/example-service/job/feature-release/lastSuccessfulBuild/">Last successful build</a></div></div></div>';
      document.body.append(root);
    }""")
    expect(page.locator('#duplicate-actions')).to_be_hidden();expect(page.locator('#permalink-column')).to_be_visible()
    ok('job breadcrumb dropdown hides duplicated actions but keeps permalink navigation')
    page.get_by_role('button',name='Actions for build #3').click()
    menu=page.get_by_role('menu',name='Actions for build #3')
    expect(menu).to_be_visible();expect(page.locator('.pgvx-run-summary')).to_contain_text('#4')
    expect(menu.get_by_role('menuitem',name='Changes')).to_have_attribute('href','https://jenkins.test/job/example-service/job/feature-release/3/changes')
    expect(menu.get_by_role('menuitem',name='Console Output')).to_have_attribute('href','https://jenkins.test/job/example-service/job/feature-release/3/console')
    expect(menu.get_by_text('Delete build')).to_contain_text('Original Jenkins page')
    page.keyboard.press('Escape');expect(menu).to_be_hidden()
    ok('recent build action menu mirrors Jenkins GET actions without selecting the build or executing POST actions')
    page.get_by_role('button',name='Select build #3',exact=True).click()
    expect(tests).to_contain_text('No JUnit report published');expect(artifacts).to_contain_text('No archived artifacts for #3')
    expect(page.locator('.pgvx-run-summary')).to_contain_text('FAILURE')
    assert '4,118' not in tests.inner_text()
    ok('failed #3 never shows successful #4 artifacts or zero-failure report')
    page.get_by_role('button',name='Select build #2',exact=True).click()
    expect(page.locator('.pgvx-run-summary')).to_contain_text('NOT_BUILT')
    expect(artifacts.locator('li')).to_have_count(1)
    expect(artifacts.locator('li a')).to_have_attribute('href','https://jenkins.test/job/example-service/job/feature-release/2/artifact/tmp/govulncheck-output.json')
    expect(page.get_by_role('alert')).to_contain_text('Graph unavailable')
    ok('NOT_BUILT #2 keeps its artifact even without a wfapi graph')
    page.get_by_role('button',name='Select build #1',exact=True).click()
    expect(artifacts).to_contain_text('No archived artifacts for #1')
    expect(tests).to_contain_text('No JUnit report published')
    ok('NOT_BUILT #1 remains a distinct empty build')
    page.get_by_role('button',name='Select last successful #4').click()
    expect(tests).to_contain_text('4,118')
    # Delayed obsolete request deliberately ignores AbortSignal.
    page.evaluate('window.__defer=true');page.get_by_role('button',name='Select build #3',exact=True).click()
    expect(tests).not_to_contain_text('4,118')
    page.wait_for_function('window.__deferred.length===1')
    page.get_by_role('button',name='Select build #4',exact=True).click();expect(tests).to_contain_text('4,118')
    page.evaluate('window.__deferred[0]()');page.wait_for_timeout(150)
    expect(page.locator('.pgvx-run-summary')).to_contain_text('#4');expect(artifacts.locator('li')).to_have_count(2)
    ok('late cancelled response cannot replace newly selected build snapshot')
    page.get_by_role('button',name='Select tests for build #3:',exact=False).click()
    expect(page.locator('.pgvx-run-summary')).to_contain_text('#3')
    expect(artifacts).to_contain_text('No archived artifacts for #3')
    ok('test history selection controls the same graph and artifact choice')
    page.get_by_role('button',name='Select last successful #4').click();expect(tests).to_contain_text('4,118')
    for width in [1600,1100,800,600]:
        page.set_viewport_size({'width':width,'height':1100});page.wait_for_timeout(70)
        host=page.locator('#pipeline-graph-local-extension').bounding_box()
        for el in [tests,artifacts,page.locator('.pgvx-builds')]:
            box=el.bounding_box();assert box['x']>=host['x']-1 and box['x']+box['width']<=host['x']+host['width']+1,(width,box,host)
    ok('cards stay within host at 1600, 1100, 800 and 600px')
    page.set_viewport_size({'width':1600,'height':1100})
    page.get_by_role('button',name='Dark',exact=True).click()
    expect(page.locator('#page-body')).to_have_attribute('data-pgvx-theme','dark')
    assert tests.evaluate("e=>getComputedStyle(e).backgroundColor")=='rgb(25, 33, 45)'
    ok('dark theme applies to cards and scoped native navigation')
    page.wait_for_timeout(200)
    page.screenshot(path=str(OUT/'job-overview-dark.png'),full_page=True)
    page.get_by_role('button',name='Light',exact=True).click()
    page.wait_for_timeout(200)
    page.screenshot(path=str(OUT/'job-overview-light.png'),full_page=True)
    # Jenkins inserts/replaces a trend after our first render.
    page.evaluate("{const d=document.createElement('div');d.id='late-trend';d.innerHTML='<div class=\"test-trend-caption\">Late chart</div>';document.querySelector('#main-panel').append(d);}")
    expect(page.locator('#late-trend')).to_be_hidden()
    page.get_by_role('button',name='Original Jenkins page',exact=True).click()
    for selector in ['#trend-widget','#native-artifacts','#native-tests','#buildHistoryPage','.jenkins-app-bar','.cbwf-stage-view','#late-trend','.permalinks-header','.permalinks-list']:
        expect(page.locator(selector)).to_be_visible()
    assert 'Full project name: example-service/feature-release' in page.locator('#main-panel').inner_text()
    expect(page.locator('#duplicate-actions')).to_be_visible();expect(page.locator('#permalink-column')).to_be_visible()
    expect(page.locator('#page-body')).not_to_have_attribute('data-pgvx-compact','true')
    ok('Original Jenkins page restores native widgets, project identity, permalinks and breadcrumb actions')
    page.get_by_role('button',name='Graph view',exact=True).click();expect(tests).to_contain_text('4,118')
    expect(page.locator('#duplicate-actions')).to_be_hidden();expect(page.locator('.permalinks-header')).to_be_hidden();expect(page.locator('.permalinks-list')).to_be_hidden()
    assert 'Full project name: example-service/feature-release' not in page.locator('#main-panel').inner_text()
    page.get_by_role('button',name='Close local graph',exact=True).click()
    expect(page.locator('#pipeline-graph-local-extension')).to_have_count(0)
    expect(page.locator('#native-artifacts')).to_be_visible();expect(page.locator('#buildHistoryPage')).to_be_visible();expect(page.locator('#duplicate-actions')).to_be_visible()
    expect(page.locator('.permalinks-header')).to_be_visible();expect(page.locator('.permalinks-list')).to_be_visible()
    assert 'Full project name: example-service/feature-release' in page.locator('#main-panel').inner_text()
    ok('close restores native DOM including project identity and permalinks without deleting handlers or elements')
    page.evaluate('window.__overviewDenied=true');page.add_script_tag(content=BUNDLE)
    expect(page.locator('.pgvx-warning')).to_contain_text('Job overview unavailable')
    expect(page.locator('#native-artifacts')).to_be_visible();expect(page.locator('#trend-widget')).to_be_visible()
    ok('overview HTTP 403 keeps native overview instead of false empty cards')
    assert all(r['method']=='GET' for r in page.evaluate('window.__requests'))
    assert not errors,errors
    ok('all requests GET-only; no page JavaScript errors')
    (OUT/'job-overview-browser-report.json').write_text(json.dumps({'browser':browser.version,'checks':checks},indent=2))
    browser.close()
