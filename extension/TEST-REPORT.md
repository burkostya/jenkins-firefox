# Pipeline Graph Local 0.3.0 / test report

## Executed

- **63 Node tests**: prior flat/native-tree adapter and API/security checks, plus
  HTML row-depth parsing, call/body pairing, actual recovered topology, approximate
  vs exact durations, derived parent state, multiple sequential parallel blocks,
  nested sequential stages, duplicate display names, snapshot mismatch rejection,
  failed and skipped branches, no guessed IDs or name/time-based grouping.
- **23 existing Chromium browser checks**: float clearance, native tree, flat
  fallback, selection, step/log inspection, source precedence, keyboard collapse,
  reload, permissions, malformed data, local preferences and active-tree polling.
- **21 HTML-specific Chromium browser checks**: real supplied 137-row HTML parsing,
  16 matched stage IDs in 11 roots, Test's five real parallel lanes, call/body IDs,
  ~11min vs raw 139ms, timing tooltip, derived failed-child display, native API
  preference, Pipeline Steps mount/restore, 403/login/foreign-build/markup errors,
  non-executing inert parsing (scripts/images/frames/base URL), link validation,
  source persistence, and read-only requests. Run once against the ORIGINAL
  supplied full saved HTML and again against the trimmed fixture in the archive.

That is **63 unit tests and 44 distinct browser checks**. The second HTML run
validates the packaged fixture; it is not counted as 21 additional distinct checks.
Raw logs and machine-readable browser reports are under tests/.

The original HTML parsed as 137 rows, 16 stage nodes, 11 top-level entries; Test
(ID 81) is the only enclosing stage, with Tests (93), Lint (95), Vulnerability (97),
Validate Migration Inventory (99), and Lint Migrations (101) as parallel branches.
Container duration is displayed as '~ 11 min', not 139ms. All supplied HTML rows
are Success. The failed-child case is synthetic and is not evidence about build #1.

## Browser/environment scope

Browser: Chromium, launched headlessly using Playwright with the installed system
binary. Exact version is in tests/FLOW-BROWSER-TEST-REPORT.json.
UI checks use mocked fetch and extension storage. An additional loopback HTTP
smoke test was attempted, but the managed browser blocked navigation with
ERR_BLOCKED_BY_ADMINISTRATOR before the application loaded. It is recorded as
blocked, NOT passed, in tests/LOCAL-SMOKE-REPORT.json. No workaround was attempted.

**Not tested:** native Firefox add-on installation, Firefox's actual activeTab
permissions and content-script sandbox, the user's Jenkins/SSO/TLS/network,
Mozilla signing, failed build #1, every localization/plugin/theme, every matrix,
retry/restart/skipping/catchError combination, or live controller snapshot races.
The manifest declares Firefox 140+; this is a development target, not a certified
compatibility result. There are no claims of full semantic TypeScript checking.

## Safety checks

Allowlisted same-origin/current-job GET requests; response size caps; redirects
rejected; node links restricted to the exact selected build. No requests to Replay,
Run, config.xml, script console, converter or mutation endpoints. HTML script,
image, frame and injected base elements were tested and did not execute, initiate
requests, or enter the page DOM. Node labels and log text are never interpreted
as executable markup. No raw page header/account/crumb is in the test fixture.

## Limitations that tests do not remove

Pipeline Steps is an HTML interface, not a promised REST contract. This adapter
supports the supplied English labels and inline-depth encoding. Unsupported or
inconsistent structure is reported and falls back to a flat wfapi list.
HTML-derived container state is an explicitly labelled display aggregate, not
Jenkins StatusAndTiming's complete chunk semantics. HTML block duration is rounded
and is labelled accordingly, including in tooltips. Unknown branch-wrapper duration
is left unavailable rather than fabricated. Native stages/tree remains preferred.
