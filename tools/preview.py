#!/usr/bin/env python3
"""Local-only mock Jenkins for UI verification. No packages or external network required."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit
import argparse
import json
import re
ROOT = Path(__file__).resolve().parents[1]
JOB = '/job/bus_backend/job/BUS-4497-agent-flow-improvements/'
RUNS = json.loads((ROOT / 'preview/runs.json').read_text())
TREE = None
FLOW_TABLE = (ROOT / 'tests/flow-table.html').read_bytes()
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def do_GET(self):
        path = urlsplit(self.path).path
        if path.endswith('/flowGraphTable/'):
            if FLOW_TABLE is None:
                self.send_error(404, 'Mock: HTML source disabled')
                return
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(FLOW_TABLE)))
            self.end_headers()
            self.wfile.write(FLOW_TABLE)
            return
        if path.endswith('/stages/tree'):
            if TREE is None:
                self.send_error(404, 'Mock: no server tree provider')
                return
            return self.json(TREE)
        if path.endswith('/wfapi/runs'):
            return self.json(RUNS)
        if re.search(r'/(?:\d+|last\w+)/wfapi/describe/?$', path):
            return self.json(RUNS[0])
        match = re.search(r'/execution/node/(\d+)/wfapi/(describe|log)/?$', path)
        if match:
            node_id, kind = match.groups()
            if kind == 'log':
                return self.json({'nodeId': node_id, 'nodeStatus': 'SUCCESS', 'length': 118, 'hasMore': False,
                    'text': 'LOCAL PREVIEW LOG (synthetic; not from the supplied run)\nThe real extension reads this step using wfapi/log.\n<script>alert("log is text, not HTML")</script>\n'})
            for stage in RUNS[0]['stages']:
                if stage['id'] == node_id:
                    return self.json(stage)
            self.send_error(404)
            return
        if path.startswith('/job/') and '/execution/' not in path:
            self.path = '/preview/index.html'
        return super().do_GET()
    def json(self, value):
        data = json.dumps(value).encode()
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)
    def log_message(self, fmt, *args):
        pass
if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--port', type=int, default=8765)
    p.add_argument('--server-tree-fixture', action='store_true', help='Use synthetic test topology, not recovered Jenkinsfile data')
    p.add_argument('--flat', action='store_true', help='Disable HTML topology for fallback testing')
    args = p.parse_args()
    if args.flat:
        FLOW_TABLE = None
    if args.server_tree_fixture:
        TREE = json.loads((ROOT / 'tests/tree-fixture.json').read_text())
    print('Mode: synthetic server tree' if TREE is not None else ('Mode: supplied Pipeline Steps HTML' if FLOW_TABLE is not None else 'Mode: wfapi flat list'), flush=True)
    print(f'Preview: http://127.0.0.1:{args.port}{JOB}', flush=True)
    ThreadingHTTPServer(('127.0.0.1', args.port), Handler).serve_forever()
