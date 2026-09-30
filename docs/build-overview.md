# Numeric build-page overview

Enhances only a numeric WorkflowRun root URL (for example `/job/example/job/main/11/`).
Job roots, Pipeline Steps, console, parameters and other subpages keep their current UI.
Permalink aliases are deliberately excluded from this first implementation.

## Presentation and identity

One compact header owns the build number, status, elapsed/duration display, start time
with timezone, console, refresh and auto-refresh controls. A build root never requests
the job history or switches the graph to another build in-place. Previous/next links
use native navigation and change the URL. The existing graph renderer is unchanged.

Artifacts and validated JUnit counters use the existing fixed numeric-build Remote API
projection and model validation. No new API endpoints, arbitrary actions, credentials,
parameters, artifact downloads or write requests are introduced. Missing reports are
not zero-test reports. Published results do not make a running build successful.

Completed-build artifact sizes and optional view/fingerprint links come only from the
current page's fileList rows and are joined by exact validated artifact URL. Sizes are
not shown while the build is running. Large lists initially show four files.

## Reversible native content

Known metadata rows are placed in Build details. Description markup and native controls
are retained as the very same DOM nodes in light-DOM slots, not cloned into React or
re-created with innerHTML. The original Stop element, confirmation attributes and
Jenkins event handlers remain responsible for stop requests. Jenkins 2.516.3's native
build-caption poller continues to find its selectors in the document. On completion,
the enhanced view also hides the progress controls without overwriting native styles.

Native warning rows remain visible above the graph, including late-added warnings.
Unknown plugin widgets, including coverage, stay visible below the enhanced section.
There is no custom coverage parser in this change: the supplied build HTML examples
contained running/failed builds and a successful build with artifacts and a test-report
link, but did not contain the coverage summary seen in the earlier screenshot.

Replacement is enabled only after valid metadata for the exact URL build is available.
HTTP/API failure leaves native information available. Original Jenkins page, close,
pagehide and React unmount restore the native layout. Removed native nodes are not
resurrected. Original styles and node identity are retained; independent style changes
made by Jenkins are not overwritten wholesale.

Recognition is conservative and based on the supplied Jenkins 2.516.3 shapes. Some
low-priority timing/changes labels currently recognize the supplied English text;
unrecognized/localized variants remain visible rather than being discarded.

## Tests and privacy

`tests/fixtures/build-page.html` is a reduced, synthetic structural fixture with fictional
job, revision, host and artifact identifiers. It is not a raw HTML capture. No crumbs,
account information, webhook origins, credentials or internal repository URLs are
committed. Tests augment it with warnings and an unsupported coverage placeholder.

Run `npm run build`, `npm test`, then `python tests/build_page_browser_test.py`.
The latter includes isolated adapter tests and integration with the built extension,
mocked HTTP, missing metadata/report cases, native action identity, late warnings,
restoration, running-to-completed transition, light/dark themes and responsive widths.
`--adapter-only` runs the isolated DOM tests; `TYPESCRIPT_PATH` may select a local
compiler for that mode. CI keeps its existing pinned browser runner and read-only
permissions. Browser tests simulate native listeners, not a live Jenkins stop request;
Firefox extension/SSO and live plugin behavior still need a user smoke test.
