# Job overview (0.4.0)

## Scope

Enhance only the WorkflowJob root page. Existing build and Pipeline Steps pages
keep the graph UI. The upstream renderer and hierarchy adapters are unchanged.
Known native title, JUnit trend, latest-success artifacts, latest test summary and
build-history widgets are hidden only after valid overview metadata is available.
Navigation, descriptions with content, permalinks and unknown plugin widgets remain.
Original Jenkins page, Close and pagehide restore the original elements and styles.
Late-added trend/history widgets are tracked and restored too. No innerHTML rewrite
of the user's page is used; listeners and Jenkins behavior remain on native elements.

## Data contract

Two new allowlisted, GET-only Remote API requests:

- Job `api/json?tree=<fixed OVERVIEW_TREE>`: at most the latest 20 builds,
  lastBuild, lastSuccessfulBuild, names, result, activity, time, artifact paths and
  JUnit counts. No parameters, environment, credentials or arbitrary action fields.
- Numeric `<build>/api/json?tree=<fixed BUILD_FIELDS>` when a selected build falls
  outside that window (for example last successful) or metadata needs a direct read.

Same origin, same job, no redirects, no token or additional permissions. User-supplied
API URLs are not followed. Artifact links are constructed from the validated job,
number and encoded relative path; traversal and Jenkins special path segments are
rejected. Artifact content is never fetched by the extension. File sizes are not
available in this API projection and are not invented or taken from another build.

One selected build drives graph, tests, artifacts and status. Pending selection
clears the old build's rendered snapshot; abort plus a disposed guard prevents
late responses from publishing stale data. Metadata remains useful when an early
build has no wfapi graph. NOT_BUILT is displayed verbatim, not reclassified ABORTED.
A build pointer outside the returned window is fetched explicitly, never substituted.

A single `hudson.tasks.junit.TestResultAction` with valid integer counters is used.
Passed = total - failed - skipped. Missing report, unavailable/invalid counters and
an explicit zero-test report are distinct. Multiple JUnit summaries are not summed.
History bars are job-wide and keep missing-report gaps; selecting a bar selects the
same build as the graph. Other test-report plugins are not treated as JUnit.

## Fixtures and privacy

`tests/fixtures/job-overview.json` retains the four supplied build cases and counts
with fictional job/host identifiers. `job-page.html` is a reduced structural fixture
based on the supplied Jenkins 2.516.3 HTML, not a full copy or a complete Jenkins skin.
No new raw captured HTML, account fields, crumbs, headers, logs or secrets are added.
Old graph fixtures stay separate from this job; the overview graph fixture is synthetic.

## Build and review

Node >=22. No npm install is required for the vendored offline source build:

```sh
npm run build
npm test
# Optional browser tests require Python Playwright and Chromium:
npm run test:browser
npm run test:flow-browser
npm run test:overview-browser
```

`CHROMIUM_EXECUTABLE` selects the browser. `TEST_OUTPUT_DIR` overrides the new
overview test's default `test-results/` directory. CI installs its pinned Playwright
version and matching Chromium. Actions are pinned to commit SHAs, contents permission
is read-only, checkout credentials are not retained and no secrets are requested.
Successful CI publishes an unsigned installable directory as a downloadable artifact.
Generated extension and test bundles were removed from source control to avoid
shipping the previous 0.3.0 bundle alongside 0.4.0 source. They are recreated by build.
The build no longer depends on the untracked historical TEST-REPORT.md file.

## Local checks performed

- 75 Node tests (63 existing plus 12 new model/API/security tests).
- 23 existing graph-browser and 21 existing HTML-adapter browser checks.
- 13 new overview browser checks, including four build cases, missing graph,
  stale responses, shared selection, 1600/1100/800/600px layout, dark/light theme,
  original/close restoration, late widget insertion and overview HTTP 403.

These were executed with mocked HTTP/storage in Chromium, not against the live
Jenkins server, SSO or Firefox's native extension sandbox. There is no claim of
semantic TypeScript type checking, Mozilla signing, or production certification.
