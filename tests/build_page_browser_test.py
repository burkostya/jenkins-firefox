"""Numeric build overview: synthetic DOM fixture and mocked extension integration.
Run after npm run build. --adapter-only needs TypeScript and Chromium only.
"""
import argparse
import json
import os
from pathlib import Path
import subprocess
import time
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('TEST_OUTPUT_DIR', ROOT / 'test-results'))
OUT.mkdir(parents=True, exist_ok=True)
BASE = 'http://127.0.0.1:18746/job/example/job/main/11/'
PROGRESS = '<div class="build-caption-progress-container">Progress: <a class="app-progress-bar" href="console"><span></span></a><a class="stop-button-link" data-confirm="Stop example build?" href="stop"><span class="jenkins-visually-hidden">Cancel</span><svg></svg></a></div>'
WARNING = '<tr class="app-summary" id="native-warning"><td><img src="/static/example/images/svgs/warning.svg"></td><td>A native Jenkins security warning <a href="/help/">explanation</a></td></tr>'
checks = []
def check(name, condition):
    if not condition:
        raise AssertionError(name)
    checks.append(name)

def fixture(running=False):
    return (ROOT / 'tests/fixtures/build-page.html').read_text().replace('{{PROGRESS}}', PROGRESS if running else '').replace('{{WARNING}}', WARNING)

def metadata(running=False, report=True):
    return {'number': 11, 'result': None if running else 'SUCCESS', 'building': running,
            'timestamp': int(time.time()*1000)-1560000, 'duration': 0 if running else 1560000,
            'artifacts': [{'fileName': 'example.tar.gz', 'relativePath': 'example.tar.gz'}],
            'actions': [{'_class': 'hudson.tasks.junit.TestResultAction', 'totalCount': 120, 'failCount': 0, 'skipCount': 2}] if report else []}

def compile_adapter():
    compiler = os.environ.get('TYPESCRIPT_PATH', str(ROOT / 'tools/typescript.cjs'))
    script = """const fs=require('fs'),ts=require(process.argv[1]);
const r=ts.transpileModule(fs.readFileSync(process.argv[2],'utf8'),{fileName:'build-page.ts',reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}});
if(r.diagnostics.some(d=>d.category===ts.DiagnosticCategory.Error))throw Error('Adapter syntax errors');
process.stdout.write('window.exports={};\\n'+r.outputText);"""
    return subprocess.check_output(['node', '-e', script, compiler, str(ROOT / 'src/build-page.ts')], text=True)

def adapter_tests(browser):
    source = compile_adapter()
    for state in ['IN_PROGRESS', 'SUCCESS', 'FAILURE']:
        page = browser.new_page()
        page.route('**/*', lambda route: route.abort())
        page.set_content(fixture(state == 'IN_PROGRESS'))
        page.add_script_tag(content=source)
        snapshot = page.evaluate("""({base,state})=>{
          const panel=document.getElementById('main-panel'),host=document.createElement('section');panel.append(host);
          host.attachShadow({mode:'open'}).innerHTML='<slot name="build-controls"></slot><slot name="build-description"></slot><slot name="build-warnings"></slot><details><summary>Build details</summary><slot name="build-details"></slot></details>';
          window.baseline=panel.innerHTML;window.savedWarning=document.getElementById('native-warning');window.savedStop=document.querySelector('.stop-button-link');window.clicks=0;
          savedStop?.addEventListener('click',e=>{e.preventDefault();window.clicks++});
          const location={origin:new URL(base).origin,jobPath:'/job/example/job/main/',build:'11'};
          window.layout=exports.createBuildPageLayout(panel,host,location);
          window.meta={number:11,result:state,building:state==='IN_PROGRESS',artifacts:[{href:base+'artifact/example.tar.gz',name:'example.tar.gz',path:'example.tar.gz'}],tests:{state:'reported',total:120,passed:118,failed:0,skipped:2}};
          const info=layout.read();layout.update(true,meta);
          return {info,root:exports.isBuildRoot(location,base,'org.jenkinsci.plugins.workflow.job.WorkflowRun'),subpage:exports.isBuildRoot(location,base+'console','org.jenkinsci.plugins.workflow.job.WorkflowRun')};
        }""", {'base': BASE, 'state': state})
        check(state+' native size', list(snapshot['info']['sizes'].values()) == ['38.73 KiB'])
        check(state+' revision', snapshot['info']['revision'] == '0123456789abcdef0123456789abcdef01234567')
        check(state+' root-only', snapshot['root'] and not snapshot['subpage'])
        check(state+' replaces header', not page.locator('.jenkins-app-bar').is_visible())
        check(state+' warning is visible', page.locator('#native-warning').is_visible())
        check(state+' unknown plugin remains', page.locator('#example-coverage').is_visible())
        if state == 'IN_PROGRESS':
            page.locator('.stop-button-link').click()
            check('original stop listener preserved', page.evaluate('clicks===1&&savedStop===document.querySelector(".stop-button-link")'))
            page.evaluate('layout.update(true,{...meta,building:false,result:"SUCCESS"})')
            check('completed stop hidden',not page.locator('.stop-button-link').is_visible())
        page.evaluate('layout.update(false,null);layout.update(true,meta);layout.update(false,null)')
        check(state+' exact restoration', page.evaluate('document.querySelector("#main-panel").innerHTML.replace("<!--Pipeline Graph Local build home-->","")===baseline'))
        page.evaluate('layout.update(true,meta)')
        page.evaluate("""()=>{const table=document.createElement('table');table.innerHTML='<tr class="app-summary" id="late-warning"><td><img src="/warning.svg"></td><td>Late warning</td></tr>';document.getElementById('main-panel').append(table)}""")
        page.wait_for_function('document.getElementById("late-warning").closest("[slot=build-warnings]")!==null')
        check(state+' late warning', page.locator('#late-warning').is_visible())
        page.evaluate('document.getElementById("late-warning").remove()')
        page.evaluate('layout.update(false,null);layout.dispose()')
        check(state+' warning identity restored', page.evaluate('savedWarning===document.getElementById("native-warning")'))
        check(state+' header restored', page.locator('.jenkins-app-bar').is_visible())
        check(state+' no extension slots', page.locator('[slot^="build-"]').count() == 0)
        check(state+' removed late node stays removed', page.locator('#late-warning').count() == 0)
        page.close()

def integration_tests(browser):
    bundle = ROOT / 'extension/content.js'
    if not bundle.exists():
        raise RuntimeError('Run npm run build before integration tests')
    state = {'running': False, 'report': True, 'forbidden': False}
    requests = []
    def route_handler(route):
        request = route.request
        requests.append((request.method, request.url))
        path = request.url.split('?', 1)[0]
        if path.endswith('/api/json'):
            route.fulfill(status=403 if state['forbidden'] else 200, content_type='application/json', body=json.dumps(metadata(state['running'], state['report'])))
        elif path.endswith('/wfapi/describe') or path.endswith('/wfapi/runs'):
            run = {'id': '11', 'name': '#11', 'status': 'IN_PROGRESS' if state['running'] else 'SUCCESS', 'startTimeMillis': metadata()['timestamp'], 'durationMillis': 1560000,
                   'stages': [{'id': '2', 'name': 'Build', 'status': 'IN_PROGRESS' if state['running'] else 'SUCCESS', 'startTimeMillis': metadata()['timestamp'], 'durationMillis': 1560000}]}
            route.fulfill(content_type='application/json', body=json.dumps([run] if path.endswith('/runs') else run))
        elif path.endswith('/11/') or path.endswith('/11/flowGraphTable/'):
            route.fulfill(content_type='text/html', body=fixture(state['running']))
        else:
            route.fulfill(status=404, content_type='text/plain', body='Not found')
    context = browser.new_context(viewport={'width':1600,'height':1000})
    context.route('**/*', route_handler)
    page = context.new_page()
    errors=[]
    page.on('pageerror', lambda error: errors.append(str(error)))
    def load(path=BASE):
        page.goto(path)
        page.evaluate("""()=>{window.savedStop=document.querySelector('.stop-button-link');window.clicks=0;savedStop?.addEventListener('click',e=>{e.preventDefault();clicks++});window.originalWarning=document.getElementById('native-warning')}""")
        page.add_script_tag(path=str(bundle))
    load()
    page.wait_for_selector('.pgvx-build-facts')
    check('single build header', page.locator('.pgvx-build-identity h2').inner_text() == '#11')
    check('no build selector or duplicate runbar', page.locator('.pgvx-runbar,.pgvx-run-select').count() == 0)
    check('artifact size from this DOM', '38.73 KiB' in page.locator('.pgvx-build-facts').inner_text())
    check('validated JUnit counters', page.locator('.pgvx-build-test-counts').inner_text().split() == ['120','Total','118','Passed','0','Failed','2','Skipped'])
    check('no job-wide reads', not any('/wfapi/runs' in u or '/main/api/json' in u for _,u in requests))
    check('unknown coverage retained', page.locator('#example-coverage').is_visible())
    check('native warning prominent', page.locator('#native-warning').is_visible())
    for width in [1600,1100,800,600]:
        page.set_viewport_size({'width':width,'height':1000})
        page.wait_for_timeout(50)
        check('no overflow '+str(width),page.evaluate('document.documentElement.scrollWidth<=window.innerWidth+1'))
    page.set_viewport_size({'width':1600,'height':1000})
    page.screenshot(path=str(OUT/'build-page-light.png'),full_page=True)
    page.emulate_media(color_scheme='dark')
    page.wait_for_function('document.getElementById("page-body").dataset.pgvxBuild==="dark"')
    check('native links follow dark theme',page.evaluate('getComputedStyle(document.querySelector("[slot=build-description] a")).color===getComputedStyle(document.getElementById("pipeline-graph-local-extension").shadowRoot.querySelector(".pgvx-build-toolbar a")).color'))
    page.wait_for_timeout(200)  # Let the existing 120 ms button transition settle.
    page.screenshot(path=str(OUT/'build-page-dark.png'),full_page=True)
    page.locator('.pgvx-build-options summary').click()
    page.get_by_role('button',name='Original Jenkins page',exact=True).click()
    page.wait_for_function('!document.getElementById("page-body").hasAttribute("data-pgvx-build")')
    check('classic restores native header',page.locator('.jenkins-app-bar').is_visible())
    check('classic restores warning identity',page.evaluate('originalWarning===document.getElementById("native-warning")'))
    page.get_by_role('button',name='Graph view',exact=True).click()
    page.wait_for_selector('.pgvx-build-facts')
    page.evaluate('document.getElementById("pipeline-graph-local-extension").dispatchEvent(new Event("pgvx-deactivate"))')
    check('close removes host and restores native',page.locator('#pipeline-graph-local-extension').count()==0 and page.locator('.jenkins-app-bar').is_visible())
    state.update(running=True,report=False)
    load();page.wait_for_selector('.pgvx-build-facts')
    check('running not success',page.locator('.pgvx-build-identity [role=status]').inner_text()=='Running')
    check('absent tests are not zeros',page.locator('.pgvx-build-test-counts').count()==0)
    check('running size not guessed', '38.73 KiB' not in page.locator('.pgvx-build-facts').inner_text())
    page.locator('.stop-button-link').click()
    check('integrated native stop handler',page.evaluate('clicks===1&&savedStop===document.querySelector(".stop-button-link")'))
    state.update(running=False,report=True)
    page.get_by_role('button',name='Refresh build',exact=True).click()
    page.wait_for_function('document.querySelector("#pipeline-graph-local-extension").shadowRoot.querySelector(".pgvx-build-identity [role=status]").textContent==="Success"')
    check('running to completed metadata',page.locator('.pgvx-build-test-counts').count()==1)
    check('stop hidden after completion',not page.locator('.stop-button-link').is_visible())
    page.evaluate('window.dispatchEvent(new Event("pagehide"))')
    check('pagehide restores native',page.locator('#pipeline-graph-local-extension').count()==0 and page.locator('.jenkins-app-bar').is_visible())
    state.update(forbidden=True)
    load();page.wait_for_selector('.pgvx-build-header')
    page.wait_for_function('document.querySelector("#pipeline-graph-local-extension").shadowRoot.textContent.includes("Original build information remains available")')
    check('403 keeps native header',page.locator('.jenkins-app-bar').is_visible())
    check('403 keeps native artifacts',page.locator('#native-artifacts').is_visible())
    state.update(forbidden=False)
    load(BASE+'flowGraphTable/')
    page.wait_for_selector('.pgvx-runbar')
    check('steps page not replaced',page.locator('.pgvx-build-header').count()==0 and page.locator('.jenkins-app-bar').is_visible())
    check('read-only requests',all(method=='GET' for method,_ in requests))
    check('no JavaScript exceptions',not errors)
    context.close()

if __name__ == '__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--adapter-only',action='store_true');args=parser.parse_args()
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE', '/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
        adapter_tests(browser)
        if not args.adapter_only: integration_tests(browser)
        browser.close()
    (OUT/'build-page-report.json').write_text(json.dumps({'checks':checks,'count':len(checks),'adapterOnly':args.adapter_only},indent=2)+'\n')
    print(f'{len(checks)} build-page checks passed')
