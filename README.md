# Pipeline Graph Local for Jenkins / Firefox

Version **0.7.0**. A read-only Firefox extension using the graph renderer and
nested layout from **Pipeline Graph View 1013.v9f83fd83c063**. No controller
upgrade, additional Jenkins plugin, Replay permission or API token is required
for the supported Pipeline Steps HTML format.

## Job overview

On a WorkflowJob root page, a compact overview replaces the native title,
build history, latest-success artifact list and JUnit trend/summary widgets.
Navigation, nonempty job descriptions, permalinks and unrelated plugin widgets
remain. **Original Jenkins page** and **Close** restore the native elements.

One selected build drives the graph, artifacts, test summary and status.
The overview includes recent builds with a filter, a last-successful selector,
artifact links and a small job-wide test history. Missing JUnit reports are not
shown as zero failures. NOT_BUILT remains distinct and may still have artifacts.
Light/dark styles and narrow layouts are supported.

The fixed Remote API projection reads the latest 20 builds. Older selections
are read explicitly. File sizes are not in that projection and are not invented.
Only validated JUnit TestResultAction counters are used. See
[overview design, privacy and test notes](docs/job-overview.md).

## Install or update

Download the **pipeline-graph-local-firefox** artifact from a successful PR
workflow run and unpack it. Or build locally with Node >=22:

```sh
npm run build
npm test
```

No npm install or network is needed for the vendored source build. `extension/`
is generated, not checked into Git. Load **extension/manifest.json**, not the
root manifest template, in Firefox at `about:debugging#/runtime/this-firefox`
using **Load Temporary Add-on**. The declared minimum Firefox version is 140.

Remove/reload the old temporary add-on and reload the Jenkins tab. Clicking the
extension button now opens an activation popup with three modes:

- **Run once** — inject into the current Jenkins job/build tab using `activeTab`.
  Nothing is saved and no persistent host access is granted.
- **Always on this Jenkins** — Firefox asks once for the exact current Jenkins
  origin (for example `https://jenkins.example/*`). After approval that origin is
  saved locally and `/job/` pages activate automatically on load/reload.
- **Disable auto on this Jenkins** — removes the saved origin, revokes that
  optional host permission and deactivates the extension on the current page.

Automatic mode is never enabled at install time and no Jenkins hostname is
hardcoded. Temporary installation still does not survive a Firefox restart; a
signed/persistent installation is intentionally left for later. This development
package is unsigned; no signing or native Firefox/SSO certification is implied.
Do not disable browser security to install it.

## Graph data sources

1. Native `<build>/stages/tree`, when installed and compatible.
2. Existing `<build>/flowGraphTable/` HTML: observed stage/call/body/parallel
   relationships, matched to wfapi by execution-node ID.
3. A flat wfapi status list if neither structure source can be used. The reason
   is displayed; names, timestamps and API order are not used to invent groups.

There are no local grouping presets. Containers must actually exist in the
execution (for example nested Declarative stages). Technical wrappers are
traversed but not displayed as invented stages. The HTML adapter is our browser
adapter, not a port of the plugin's Java scanner. Its container statuses are
labelled derived, and rounded HTML block durations are labelled approximate.
Native server-tree data has priority. Details and textual step logs still use
wfapi. Build and Pipeline Steps pages retain the existing graph-only UI.

## Access and safety

Required permissions remain `activeTab`, `scripting` and `storage`. The manifest
also declares **optional** HTTP/HTTPS host access so Firefox can grant only the
specific Jenkins origin chosen with **Always on this Jenkins**. There are no
required `host_permissions` and no static `content_scripts`.

Requests are allowlisted, same-origin, job-scoped GETs using the current Jenkins
session, with redirects blocked. No credentials, parameters, environment
variables, build/replay/configuration actions or external services are requested.
Artifact content is never automatically downloaded. Names/logs are rendered as
text; links are validated. Preferences and enabled Jenkins origins are stored
locally in the browser.

## Tests

After `npm run build`, run `npm test`. Optional Python Playwright/Chromium checks:

```sh
npm run test:browser
npm run test:flow-browser
npm run test:overview-browser
```

Set `CHROMIUM_EXECUTABLE` when Chromium is not at `/usr/bin/chromium`.
`TEST_OUTPUT_DIR` selects the overview screenshot/report directory (default:
`test-results/`). CI runs tests and publishes the unsigned extension and browser
reports. It has read-only repository permissions and does not commit or merge.

The activation test suite covers exact-origin permission patterns, invalid URL
rejection, manual injection, automatic injection only for saved+granted origins,
stale-permission cleanup and page deactivation. Browser graph tests continue to
use mocked HTTP/storage. The real Jenkins server, SSO and Firefox extension
sandbox are not tested. Compilation is TypeScript syntax transpilation, not
semantic type checking. Raw captured job HTML is not committed.

## Source and licensing

`src/` contains the browser adapters, UI and reversible mounting logic.
`upstream/` contains original frontend files from the specified tag; build verifies
`UPSTREAM-HASHES.json` and applies documented integration patches in memory.
`BUILD-REPORT.json` records the compiler, runtime and patches. The runtime remains
the documented React 18.2.0 adaptation, not the upstream React 19 dependency.
See [NOTICE.md](NOTICE.md), [LICENSE](LICENSE) and `licenses/` for provenance and
licenses. No font files are distributed. Not affiliated with Jenkins or Mozilla.
