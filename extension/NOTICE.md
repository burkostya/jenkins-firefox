# Source provenance and licensing

## Jenkins Pipeline Graph View

Source supplied by the user:
`pipeline-graph-view-plugin-1013.v9f83fd83c063.tar.gz`

Release: https://github.com/jenkinsci/pipeline-graph-view-plugin/releases/tag/1013.v9f83fd83c063
License: MIT, preserved verbatim in `licenses/pipeline-graph-view-MIT.txt`.
The upstream copyright template is retained exactly as supplied, not filled in.
The original frontend sources are under `upstream/`. See `UPSTREAM-HASHES.json`
for the archive digest and individual original-file digests. `build.cjs` verifies
those files before compiling and applies the explicitly listed integration patches
only to its in-memory compilation inputs. See `BUILD-REPORT.json`.

## React, React DOM and Scheduler

Production runtimes: React 18.2.0, React DOM 18.2.0, Scheduler 0.23.0.
License: MIT; Copyright (c) Facebook, Inc. and its affiliates.
Full license: `licenses/react-MIT.txt`.

These runtime bodies were extracted from installed JupyterLab static webpack chunks:
`6540.51c00e890179a4832552.js` (React modules 15287/96540) and
`961.29c067b15a524e556eed.js` (React DOM 22551 and Scheduler 7463).
Only the relevant library functions are included, wrapped as standalone CommonJS
modules with the React DOM dependency identifiers resolved to local React/Scheduler.
No JupyterLab application code or fonts are shipped. React DOM's internal version
string contains `18.2.0-next-9e3b772b8-20220608`; it is the string in the installed
18.2.0 production library. The library bodies remain minified production vendor
code; the extension-specific sources are under `src/`.

The plugin's package.json specified React ^19.1.0. This adaptation intentionally
records that its packaging runtime is different. The graph components used here do
not require React-19-only APIs; actual compatibility was exercised by the included
Chromium DOM tests. No native Firefox test is implied.

`runtime/jsx-runtime.cjs` is a small JSX-to-createElement bridge written for this
package. Tippy, FormatJS duration polyfills and react-zoom-pan-pinch are replaced by
small local integration components, not copied into the distribution.

## TypeScript compiler

The vendored build-only compiler is copied from the installed TypeScript package;
its exact version is in `tools/version.txt` and `BUILD-REPORT.json`.
License: Apache-2.0 with third-party notices, retained in `licenses/`.
It is not included in `extension/` (only license notices are copied there).

## Extension-specific code

MIT, see `LICENSE`. Not affiliated with or endorsed by Jenkins or Mozilla.
No font files are included.

## Revision 0.2.0

Local BUS/profile grouping has been removed. The extension now reads the upstream
build-level stages/tree contract when available and otherwise shows a flat list
without implied topology. A main-panel float-clearance fix is included. No Java
backend or server exporter is bundled. Source fixtures use a sanitized user wfapi
response and a separately labelled synthetic tree for contract tests.

## Revision 0.3.0

Added a read-only Pipeline Steps HTML adapter. The parser and projection are new
extension-specific code, not the original plugin's Java scanner. They preserve
observed stage/call/body/parallel relationships. Container statuses are explicitly
labelled display aggregates, and HTML block timing is explicitly approximate.
Native stages/tree still has priority. Flat mode remains the final fallback.
The renderer and nested layout remain the supplied original frontend; new build
patches pass approximate/unavailable timing labels through the local LiveTotal
compatibility component. No server component or Jenkinsfile parser is bundled.
The trimmed HTML test fixture excludes the original head/account/crumb fields.
