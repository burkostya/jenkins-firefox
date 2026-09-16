# Pipeline Graph Local for Jenkins / Firefox

Version **0.3.0**, based on the graph renderer and nested layout from
**Pipeline Graph View 1013.v9f83fd83c063**. Unsigned development build.
The native Firefox add-on environment and the real Jenkins/SSO installation
have NOT been tested here. See TEST-REPORT.md for the actual executed checks.

## What changed in 0.3.0

The extension can now reconstruct execution-stage hierarchy from the existing
**Pipeline Steps** HTML page (`<build>/flowGraphTable/`). It no longer needs the
Pipeline Graph View backend for the HTML format supplied from Jenkins 2.516.3.
It does not need Jenkinsfile source, Replay permission, config.xml, Groovy
execution, a model converter, an API token, or a new controller plugin.

Data source priority is explicit:

1. **Native server tree:** GET `<build>/stages/tree`. Keep its hierarchy, status
   and timing. This remains the preferred source when available and supported.
2. **Pipeline Steps HTML:** GET `<build>/flowGraphTable/`. Decode row indentation,
   stage/call and stage/body pairs, and explicit parallel branch blocks. Match
   wfapi details by execution-node ID or the explicitly observed call/body pair.
3. **Flat wfapi list:** when neither structural source can be used. No graph
   edges, parents or groups are invented. The reason is displayed.

There are no name-based grouping presets. Existing 0.1.0 grouping settings are
ignored. Updating does not introduce Prepare/API/Checks/Migrations/Publish unless
those containers really appear in the execution tree.

## Install / update

Unpack the prebuilt extension ZIP. Open `about:debugging#/runtime/this-firefox`,
remove the older temporary add-on, choose **Load Temporary Add-on**, and select
its `manifest.json`. The manifest declares Firefox 140 as its minimum version.
In the SOURCE archive, use `extension/manifest.json`, not the root build template.

**Reload the Jenkins page after updating**, then click the extension toolbar/menu
button on a job, build or Pipeline Steps page. Previously injected JavaScript is
not automatically replaced on already-open tabs. The source notice should say
**Source: Pipeline Steps HTML** when this adapter is being used.

On job pages, Original Stage View restores the native view. On Pipeline Steps
pages the equivalent button is Original Pipeline Steps. Closing the extension
also restores the original. The panel clears floated actions such as Test Result
Trend instead of overlapping them.

Temporary add-ons do not survive a Firefox restart. A normal persistent install
requires signing; this package is not signed. Do not disable browser security.
Official temporary-install instructions:
https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/

## Meaning of the HTML-derived graph

The supplied build #2 page has 137 execution rows. The projection has 16 stage
nodes, in 11 top-level entries. The one stage container is **Test**, with five
parallel branches: Tests, Lint, Vulnerability, Validate Migration Inventory,
and Lint Migrations. Both the stage call (80) and body (81), the parallel call
(82) and branch bodies are present. The wfapi Test entry refers to body 81.

Technical wrappers such as node, podTemplate, withEnv, sshagent, container and
script are traversed but not displayed as named stage groups. A stage call/body
pair is represented once. A parallel branch containing one stage with the same
label is represented by that stage. Branches with several sequential stages
retain their explicit branch wrapper. Consecutive parallel blocks remain separate.

### Status is not the full Java backend's chunk calculation

For leaf stages the exact matched wfapi entry supplies status. For an enclosing
HTML-derived stage, the displayed state is aggregated from that entry and the
verified child stages, using the original renderer's aggregation. The inspector
labels this as **derived**, not as a server-computed Pipeline Graph View status.
A green 139ms prefix will therefore not hide a known red child stage.

This does not reproduce every rule of Jenkins StatusAndTiming, skipped-stage
metadata, WarningAction, catchError, post blocks, or plugin-specific behavior.
A failed shell step inside a caught error is not blindly used to override a
successful matched wfapi leaf stage. The original wfapi and HTML observations
remain separately identified. The supplied HTML is a SUCCESS run, not failed
build #1; the failed-child regression scenario is explicitly synthetic.

### Timing precision is displayed, not invented

Leaf stage timings remain the exact milliseconds returned by wfapi. Container
block duration is the HUMAN-READABLE time printed by Jenkins, marked with `~`:
for example **~ 11 min** for Test, not the 139ms in its raw wfapi chunk. Tooltips
and the inspector both preserve this distinction. This is not a sum of branch
work or a millisecond-precise recomputation. Live HTML times are labelled snapshots.

Some raw parallel branch wrapper rows in the supplied page say 5ms despite
containing minutes of work. Where a separate branch wrapper must be displayed,
its duration is marked unavailable instead of treating that value as its total.
Unsupported/unavailable timing is not silently replaced with zero or the prefix.

## Supported format and limits

This is an adapter to the supplied HTML format, not a stable Jenkins JSON API.
Supported depth markup is `padding-left: calc(var(--table-padding) * N)`;
labels use stage / stage block (...) / parallel / parallel block (Branch: ...).
It supports nested sequential stages and explicit parallel branches, including
branches with multiple sequential stages, in that row format. It is not limited
to the supplied job names. It uses the server's traversal order, not sorted IDs
or time-overlap guesses. Dynamic execution can be shown if expressed in these rows.

Other versions, translated labels, custom UI plugins, replayed/matrix structures,
missing ancestry, truncation, and novel row layouts are not universally certified.
Missing wfapi stages or foreign-build links reject the snapshot and return to
labelled flat mode; refresh may resolve races on active builds. HTML is polled
at 15-second intervals for active builds, only while the panel/tab is visible.

Safety caps: 8 MiB per graph response, 30,000 HTML rows, 160 raw depth levels,
50 projection recursion levels, 3,000 displayed graph nodes. Node details and logs
keep the prior limits. Unsupported native `nextSibling` tree envelopes fail
closed; the HTML adapter is then attempted.

## Access / privacy

Only `activeTab`, `scripting`, and `storage` are requested. Activation is manual.
Reads use the existing browser session, GET only, same origin and current job.
API paths are allowlisted. Redirects, cross-origin/cross-build node links,
queries, Replay/Run/config endpoints and arbitrary fetch paths are not allowed.
No cookie-reading API, token collection, external service or telemetry is used.

Fetched HTML is parsed in a detached inert template. Scripts, frames and images
are never attached to the page; no incoming page styles or event handlers are
reused. Only validated text, IDs and depth values are consumed. Logs render as
text. Local storage contains preferences, not the fetched HTML or Jenkinsfile.
No Jenkins writes, controller changes or job executions occur.

The production archive contains no raw API/HTML fixtures, shell commands, or server/account identifiers. The source test HTML keeps
only the nodeGraph table, with non-stage argument cells removed; it excludes the
original page header, account UI and CSRF crumb. Other fixtures are clearly named.
Do not publish private build data or raw saved Jenkins pages as public test fixtures.

## Offline build and tests

The source archive includes the build-only TypeScript compiler and React runtime.
No npm download is required to build. Node 22+:

```sh
node build.cjs
npm test
```

Browser tests require Python, Playwright and Chromium. They do not install or
impersonate a native Firefox add-on:

```sh
python tests/browser_test.py
python tests/flow_browser_test.py
```

`FLOW_HTML=/path/to/saved-page.html python tests/flow_browser_test.py` tests a full
saved page against the supplied build #2 fixture. The default uses the trimmed,
non-stage-arguments-removed version included in the source archive.

The build verifies original vendored source hashes and applies documented
integration patches in memory. It performs TypeScript syntax transpilation,
NOT full semantic type checking. The renderer runtime remains the recorded
React 18.2.0 adaptation, not upstream's React 19 dependency. See NOTICE.md and
BUILD-REPORT.json. There are no font files in the package.

## Local demo

```sh
python tools/preview.py --port 8765
```

Open the localhost job URL printed by the server. Default mode serves the supplied
HTML structure plus the wfapi fixture. `--flat` disables structural data;
`--server-tree-fixture` uses the explicitly synthetic native-tree contract fixture.
Demo logs are synthetic. The preview is bound to loopback only. The managed
browser in this environment blocked the additional localhost navigation smoke
test before page load; this demo was not certified end-to-end here.

## Source map

- `src/flow-table.ts`: inert HTML parser, row validation, structural projection.
- `src/api.ts`: allowlisted read-only JSON/HTML requests.
- `src/model.ts`: wfapi/native-tree types and decoding.
- `src/App.tsx`: source selection, UI, provenance labels, refresh and details.
- `src/mount.tsx`: main-panel placement and restore-on-close behavior.
- `upstream/`: unmodified frontend source files from the supplied plugin tag.
- `build.cjs`: offline compilation and declared upstream integration patches.
- `tests/`: executable regression tests, fixtures and generated reports.
- `ADAPTER-NOTES.md`: recovered tree, source observations and limitations.
