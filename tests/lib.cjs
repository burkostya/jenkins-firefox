/* Pipeline Graph Local 0.3.0. Upstream tag 1013.v9f83fd83c063, MIT. React MIT. See LICENSES. */
(()=>{
"use strict";
const modules={
"tests/entry.ts":function(module,exports,require){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = exports.Result = exports.defaultLayout = void 0;
__exportStar(require("src/model.ts"), exports);
__exportStar(require("src/api.ts"), exports);
__exportStar(require("upstream/pipeline-graph-view/pipeline-graph/main/support/useCollapsedStages.ts"), exports);
__exportStar(require("upstream/pipeline-graph-view/pipeline-graph/main/NestedPipelineGraphLayout.ts"), exports);
var PipelineGraphModel_tsx_1 = require("upstream/pipeline-graph-view/pipeline-graph/main/PipelineGraphModel.tsx");
Object.defineProperty(exports, "defaultLayout", { enumerable: true, get: function () { return PipelineGraphModel_tsx_1.defaultLayout; } });
Object.defineProperty(exports, "Result", { enumerable: true, get: function () { return PipelineGraphModel_tsx_1.Result; } });
var i18n_tsx_1 = require("src/compat/i18n.tsx");
Object.defineProperty(exports, "Messages", { enumerable: true, get: function () { return i18n_tsx_1.Messages; } });
__exportStar(require("src/flow-table.ts"), exports);

},
"src/model.ts":function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isActive = void 0;
exports.status = status;
exports.validateRun = validateRun;
exports.leafStages = leafStages;
exports.walkStages = walkStages;
exports.adaptFlatRun = adaptFlatRun;
exports.adaptTree = adaptTree;
exports.formatMs = formatMs;
const PipelineGraphModel_tsx_1 = require("upstream/pipeline-graph-view/pipeline-graph/main/PipelineGraphModel.tsx");
const isActive = (s) => ['IN_PROGRESS', 'PAUSED_PENDING_INPUT', 'QUEUED', 'RUNNING', 'PAUSED'].includes(s);
exports.isActive = isActive;
function status(s) {
    return { SUCCESS: PipelineGraphModel_tsx_1.Result.success, FAILED: PipelineGraphModel_tsx_1.Result.failure, FAILURE: PipelineGraphModel_tsx_1.Result.failure,
        IN_PROGRESS: PipelineGraphModel_tsx_1.Result.running, RUNNING: PipelineGraphModel_tsx_1.Result.running, PAUSED_PENDING_INPUT: PipelineGraphModel_tsx_1.Result.paused,
        PAUSED: PipelineGraphModel_tsx_1.Result.paused, QUEUED: PipelineGraphModel_tsx_1.Result.queued, UNSTABLE: PipelineGraphModel_tsx_1.Result.unstable, ABORTED: PipelineGraphModel_tsx_1.Result.aborted,
        NOT_EXECUTED: PipelineGraphModel_tsx_1.Result.not_built, NOT_BUILT: PipelineGraphModel_tsx_1.Result.not_built, SKIPPED: PipelineGraphModel_tsx_1.Result.skipped,
        SKIPPED_FOR_CONDITIONAL: PipelineGraphModel_tsx_1.Result.skipped }[s] ?? PipelineGraphModel_tsx_1.Result.unknown;
}
function finite(n, fallback = 0) { return typeof n === 'number' && Number.isFinite(n) && n >= 0 ? n : fallback; }
function validId(id) { return typeof id === 'string' && /^\d+$/.test(id) && Number.isSafeInteger(Number(id)); }
function validateRun(value) {
    const r = value;
    if (!r || typeof r !== 'object' || !validId(r.id) || !Array.isArray(r.stages) || typeof r.status !== 'string')
        throw new Error('The endpoint did not return a Pipeline REST API run. Check the Jenkins login and wfapi endpoint.');
    if (r.stages.length > 3000)
        throw new Error('More than 3,000 stages returned. This local view intentionally limits graph size.');
    const ids = new Set();
    for (const s of r.stages) {
        if (!s || !validId(s.id) || typeof s.name !== 'string' || s.name.length > 4000 || typeof s.status !== 'string')
            throw new Error('Invalid stage data in wfapi response.');
        if (ids.has(s.id))
            throw new Error('Duplicate stage ID in wfapi response: ' + s.id);
        ids.add(s.id);
    }
    return r;
}
function leafStages(stages) {
    return stages.flatMap(s => s.children.length ? leafStages(s.children) : [s]);
}
function walkStages(stages) {
    return stages.flatMap(s => [s, ...walkStages(s.children)]);
}
/** Preserve the response as a flat list. No edges, parents or group status are inferred. */
function adaptFlatRun(run, runUrl) {
    validateRun(run);
    const meta = new Map();
    const stages = run.stages.map(raw => {
        const id = Number(raw.id);
        meta.set(id, { kind: 'stage', raw, source: 'wfapi' });
        return { id, name: raw.name, title: raw.name, state: status(raw.status), type: 'STAGE', children: [],
            startTimeMillis: finite(raw.startTimeMillis), totalDurationMillis: (0, exports.isActive)(raw.status) ? undefined : finite(raw.durationMillis),
            pauseDurationMillis: finite(raw.pauseDurationMillis), agent: raw.execNode || '',
            url: runUrl + 'execution/node/' + raw.id + '/log/' };
    });
    return { stages, meta, warnings: [], source: 'wfapi' };
}
/**
 * Decode the upstream /<build>/stages/tree envelope. Preserve containment, branch
 * types, status and timings supplied by the server; NEVER merge wfapi status
 * into this tree. In particular, a 139ms green wfapi chunk is not its parent stage.
 * String FlowNode IDs are converted to the numeric IDs expected by the renderer.
 */
function adaptTree(value, run, runUrl) {
    const envelope = value;
    if (!envelope || envelope.status !== 'ok' || !envelope.data || !Array.isArray(envelope.data.stages)
        || typeof envelope.data.complete !== 'boolean')
        throw new Error('Invalid Pipeline Graph View tree envelope. Expected status=ok and data.stages/data.complete.');
    const meta = new Map(), seen = new Set(), warnings = [];
    const byId = new Map(run.stages.map(s => [s.id, s]));
    let count = 0;
    function decode(n, depth) {
        if (++count > 3000 || depth > 40)
            throw new Error('Server tree exceeds the 3,000-node / 40-level safety limit.');
        if (!n || typeof n !== 'object' || !/^[0-9]+$/.test(String(n.id)) || !Number.isSafeInteger(Number(n.id)))
            throw new Error('Invalid execution-node ID in server tree.');
        const id = Number(n.id);
        if (seen.has(id))
            throw new Error('Duplicate execution-node ID in server tree: ' + id);
        seen.add(id);
        if (typeof n.name !== 'string' || n.name.length > 4000 || typeof n.state !== 'string' || !Array.isArray(n.children))
            throw new Error('Invalid stage fields in server tree.');
        if (!['STAGE', 'PARALLEL', 'PARALLEL_BLOCK', 'STEP', 'PIPELINE_START'].includes(n.type))
            throw new Error('Unsupported server tree node type: ' + String(n.type));
        // The supplied nested renderer consumes children, not old nextSibling chains.
        // Fail closed rather than silently dropping those nodes on older servers.
        if (n.nextSibling != null)
            throw new Error('Legacy nextSibling tree format is not supported by this adapter.');
        const children = n.children.map((c) => decode(c, depth + 1));
        const raw = byId.get(String(id));
        meta.set(id, { kind: children.length ? 'group' : 'stage', raw, source: 'pipeline-graph-view',
            mode: children[0]?.type === 'PARALLEL' ? 'parallel' : 'sequence' });
        const state = status(n.state.toUpperCase());
        if (state === PipelineGraphModel_tsx_1.Result.unknown && n.state.toLowerCase() !== 'unknown')
            warnings.push('Unknown server state ' + n.state + ' for node ' + id + '.');
        // Native same-job links are built locally; server-provided URLs are never followed.
        return { id, name: n.name, title: typeof n.title === 'string' ? n.title : n.name, state, type: n.type, children,
            isSequential: n.isSequential === true, placeholder: n.placeholder === true, synthetic: n.synthetic === true,
            startTimeMillis: finite(n.startTimeMillis), pauseDurationMillis: finite(n.pauseDurationMillis),
            totalDurationMillis: n.totalDurationMillis == null ? undefined : finite(n.totalDurationMillis),
            agent: typeof n.agent === 'string' ? n.agent : '',
            causeOfBlockage: typeof n.causeOfBlockage === 'string' ? n.causeOfBlockage : undefined,
            url: runUrl + 'execution/node/' + id + '/log/' };
    }
    const stages = envelope.data.stages.map((n) => decode(n, 0));
    return { stages, meta, warnings, source: 'pipeline-graph-view', complete: envelope.data.complete };
}
function formatMs(ms) {
    if (ms === undefined)
        return 'Running';
    if (ms < 1000)
        return Math.round(ms) + ' ms';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60)
        return seconds + ' s';
    if (seconds < 3600)
        return Math.floor(seconds / 60) + 'm ' + String(seconds % 60).padStart(2, '0') + 's';
    return Math.floor(seconds / 3600) + 'h ' + Math.floor(seconds % 3600 / 60) + 'm';
}

},
"upstream/pipeline-graph-view/pipeline-graph/main/PipelineGraphModel.tsx":function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugPipelineGraph = exports.nestedLayout = exports.defaultLayout = exports.Result = void 0;
exports.isFlagEnabled = isFlagEnabled;
var Result;
(function (Result) {
    Result["success"] = "success";
    Result["failure"] = "failure";
    Result["running"] = "running";
    Result["queued"] = "queued";
    Result["paused"] = "paused";
    Result["unstable"] = "unstable";
    Result["aborted"] = "aborted";
    Result["not_built"] = "not_built";
    Result["skipped"] = "skipped";
    Result["unknown"] = "unknown";
})(Result || (exports.Result = Result = {}));
// Dimensions used for layout, px
exports.defaultLayout = {
    nodeSpacingH: 140,
    parallelSpacingH: 140,
    nodeSpacingV: 70,
    nodeRadius: 14,
    terminalRadius: 10,
    curveRadius: 15,
    connectorStrokeWidth: 2,
    labelOffsetV: 22,
    smallLabelOffsetV: 15,
    ypStart: 55,
    graphSpacingTop: 0,
    graphSpacingRight: 0,
    graphSpacingBottom: 0,
    graphSpacingLeft: 0,
};
function isFlagEnabled(flag, defaultValue = false) {
    const isEnabled = (v) => ["yes", "1", "true", "enabled"].includes(v?.toLowerCase() ?? "");
    try {
        const search = new URLSearchParams(window.location.search);
        if (search.has(flag))
            return isEnabled(search.get(flag));
    }
    catch { }
    try {
        // LocalStorage access can throw, gracefully access the key.
        const v = window.localStorage.getItem(flag);
        if (v !== null)
            return isEnabled(v);
    }
    catch { }
    return defaultValue;
}
const nestedLayout = () => true;
exports.nestedLayout = nestedLayout;
// Optionally turn on debugging for the graph. Once the nested layout is stable, we could use a constant to let tree-shaking remove debug code in production bundles.
const debugPipelineGraph = () => false;
exports.debugPipelineGraph = debugPipelineGraph;

},
"src/api.ts":function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JenkinsApi = exports.JenkinsHttpError = void 0;
exports.parseLocation = parseLocation;
exports.safeJobUrl = safeJobUrl;
const model_ts_1 = require("src/model.ts");
function parseLocation(href) {
    const u = new URL(href);
    if (!['http:', 'https:'].includes(u.protocol))
        throw new Error('Open a Jenkins job or build page over HTTP(S), then click the extension.');
    // Preserve encoded branch slashes and any /jenkins context prefix.
    const m = u.pathname.match(/^(.*?)(\/job\/[^/]+(?:\/job\/[^/]+)*)(?:\/(.*))?$/);
    if (!m)
        throw new Error('Open a Jenkins job or build page with /job/... in its URL, then click the extension.');
    const jobPath = m[1] + m[2] + '/';
    const tail = (m[3] || '').split('/')[0];
    const build = /^(\d+|last(?:Build|SuccessfulBuild|CompletedBuild|FailedBuild|StableBuild|UnstableBuild|UnsuccessfulBuild))$/.test(tail) ? tail : undefined;
    let label = m[2].split('/job/').filter(Boolean).map(x => { try {
        return decodeURIComponent(x);
    }
    catch {
        return x;
    } }).join(' / ');
    return { origin: u.origin, jobPath, build, runPath: build ? jobPath + build + '/' : undefined, label };
}
function safeJobUrl(href, location) {
    if (typeof href !== 'string' || !href)
        throw new Error('Missing Jenkins link.');
    const u = new URL(href, location.origin + location.jobPath);
    if (u.origin !== location.origin || u.username || u.password || !u.pathname.startsWith(location.jobPath))
        throw new Error('Blocked a link outside the current Jenkins job.');
    return u.href;
}
class JenkinsHttpError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'JenkinsHttpError';
    }
}
exports.JenkinsHttpError = JenkinsHttpError;
class JenkinsApi {
    location;
    constructor(location) {
        this.location = location;
    }
    runPath(run) { return this.location.jobPath + encodeURIComponent(run.id) + '/'; }
    endpoint(path) {
        const href = safeJobUrl(path, this.location), u = new URL(href);
        const suffix = u.pathname.slice(this.location.jobPath.length);
        // No Jenkins mutation endpoints, arbitrary same-origin fetches, queries or fragments.
        if (u.search || u.hash || !/^(?:wfapi\/runs|(?:\d+|last(?:Build|SuccessfulBuild|CompletedBuild|FailedBuild|StableBuild|UnstableBuild|UnsuccessfulBuild))\/wfapi\/describe|\d+\/execution\/node\/\d+\/wfapi\/(?:describe|log)|\d+\/stages\/tree|\d+\/flowGraphTable)\/?$/.test(suffix))
            throw new Error('Blocked an unexpected API endpoint.');
        return href;
    }
    async read(path, kind, signal, maxBytes = 8 * 1024 * 1024) {
        const target = this.endpoint(path);
        const timeout = AbortSignal.timeout(20000);
        const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
        let response;
        try {
            response = await fetch(target, { method: 'GET', credentials: 'same-origin', cache: 'no-store', redirect: 'error', headers: { Accept: kind === 'json' ? 'application/json' : 'text/html' }, signal: combined });
        }
        catch (e) {
            if (signal?.aborted)
                throw e;
            throw new Error('Could not read Jenkins API. Check your Jenkins login, network, TLS certificate and same-origin access.');
        }
        if (!response.ok) {
            const hint = response.status === 404 ? ' Pipeline REST API must be available for this job.' :
                [401, 403].includes(response.status) ? ' Log in to Jenkins and check job/read permissions.' : '';
            throw new JenkinsHttpError(response.status, 'Jenkins returned HTTP ' + response.status + '.' + hint);
        }
        const type = response.headers.get('content-type')?.toLowerCase() || '';
        if (kind === 'json' ? !type.includes('json') : !type.includes('text/html'))
            throw new Error(kind === 'json' ? 'Jenkins returned non-JSON data (possibly a login page). Log in normally and retry.' : 'Pipeline Steps returned non-HTML data.');
        const reader = response.body?.getReader();
        let text = '';
        if (reader) {
            const decoder = new TextDecoder();
            let size = 0;
            try {
                for (;;) {
                    const { value, done } = await reader.read();
                    if (done)
                        break;
                    size += value.byteLength;
                    if (size > maxBytes) {
                        await reader.cancel();
                        throw new Error('API response exceeds the local ' + Math.round(maxBytes / 1024 / 1024) + ' MiB safety limit. Open the Jenkins console instead.');
                    }
                    text += decoder.decode(value, { stream: true });
                }
                text += decoder.decode();
            }
            finally {
                reader.releaseLock();
            }
        }
        else {
            text = await response.text();
            if (text.length > maxBytes)
                throw new Error('API response too large.');
        }
        return text;
    }
    async json(path, signal, maxBytes = 8 * 1024 * 1024) {
        const text = await this.read(path, 'json', signal, maxBytes);
        try {
            return JSON.parse(text);
        }
        catch {
            throw new Error('Jenkins returned invalid JSON.');
        }
    }
    async flowGraphTable(run, signal) {
        return this.read(this.runPath(run) + 'flowGraphTable/', 'html', signal);
    }
    async runs(signal) {
        const data = await this.json(this.location.jobPath + 'wfapi/runs', signal);
        if (!Array.isArray(data) || data.length > 500)
            throw new Error('Unexpected wfapi/runs response. Expected an array with at most 500 runs.');
        return data.map(model_ts_1.validateRun);
    }
    async tree(run, signal) {
        try {
            return await this.json(this.runPath(run) + 'stages/tree', signal);
        }
        catch (e) {
            if (e instanceof JenkinsHttpError && e.statusCode === 404)
                return null;
            throw e;
        }
    }
    async describe(build, signal) {
        if (!/^(\d+|last(?:Build|SuccessfulBuild|CompletedBuild|FailedBuild|StableBuild|UnstableBuild|UnsuccessfulBuild))$/.test(build))
            throw new Error('Invalid build identifier.');
        return (0, model_ts_1.validateRun)(await this.json(this.location.jobPath + build + '/wfapi/describe', signal));
    }
    async stage(run, node, signal) {
        const data = await this.json(this.runPath(run) + 'execution/node/' + encodeURIComponent(node.id) + '/wfapi/describe', signal);
        if (!data || String(data.id) !== node.id || (data.stageFlowNodes !== undefined && !Array.isArray(data.stageFlowNodes)))
            throw new Error('Unexpected node detail response.');
        return data;
    }
    async log(run, node, signal) {
        if (!/^\d+$/.test(node.id))
            throw new Error('Invalid step identifier.');
        const data = await this.json(this.runPath(run) + 'execution/node/' + node.id + '/wfapi/log', signal, 2 * 1024 * 1024);
        if (!data || typeof data.text !== 'string')
            throw new Error('Unexpected wfapi/log response: no text field. Use the native console link.');
        const limit = 200000;
        return { text: data.text.slice(0, limit), hasMore: !!data.hasMore || data.text.length > limit };
    }
}
exports.JenkinsApi = JenkinsApi;

},
"upstream/pipeline-graph-view/pipeline-graph/main/support/useCollapsedStages.ts":function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collapseSelectiveStages = collapseSelectiveStages;
exports.collectParentStageIds = collectParentStageIds;
exports.useCollapsedStages = useCollapsedStages;
const react_1 = require("runtime/react.cjs");
const PipelineGraphModel_tsx_1 = require("upstream/pipeline-graph-view/pipeline-graph/main/PipelineGraphModel.tsx");
function loadFromStorage(key) {
    try {
        const stored = window.localStorage.getItem(key);
        if (stored) {
            return new Set(JSON.parse(stored));
        }
    }
    catch (err) {
        try {
            // Bad record. Perform best-effort cleanup.
            window.localStorage.removeItem(key);
        }
        catch { }
    }
    return new Set();
}
function saveToStorage(key, ids) {
    try {
        if (ids.size === 0) {
            window.localStorage.removeItem(key);
            return;
        }
        window.localStorage.setItem(key, JSON.stringify([...ids]));
    }
    catch {
        // ignore
    }
}
function garbageCollectLocalStorage() {
    try {
        window.localStorage.key(0);
    }
    catch {
        // Local storage access failed, likely due to browser restrictions (expected).
        // Perform this check here so that we can log unexpected errors below.
        return;
    }
    try {
        for (const key of Object.keys(window.localStorage)) {
            // The old key prefix uses a dot as separator.
            if (!key.startsWith("pgv.collapsedStages."))
                continue;
            window.localStorage.removeItem(key);
        }
    }
    catch (err) {
        console.warn("Error during garbage collection for collapsed stages in localStorage:", err);
    }
}
const STATE_PRIORITY = {
    [PipelineGraphModel_tsx_1.Result.failure]: 0,
    [PipelineGraphModel_tsx_1.Result.unstable]: 1,
    [PipelineGraphModel_tsx_1.Result.aborted]: 2,
    [PipelineGraphModel_tsx_1.Result.paused]: 3,
    [PipelineGraphModel_tsx_1.Result.running]: 4,
    [PipelineGraphModel_tsx_1.Result.queued]: 5,
    [PipelineGraphModel_tsx_1.Result.not_built]: 6,
    [PipelineGraphModel_tsx_1.Result.skipped]: 7,
    [PipelineGraphModel_tsx_1.Result.success]: 8,
    [PipelineGraphModel_tsx_1.Result.unknown]: 9,
};
function worstState(a, b) {
    return (STATE_PRIORITY[a] ?? 9) <= (STATE_PRIORITY[b] ?? 9) ? a : b;
}
function isTransparentState(state) {
    return state === PipelineGraphModel_tsx_1.Result.skipped || state === PipelineGraphModel_tsx_1.Result.not_built;
}
function aggregateChildState(stage) {
    let all = stage.state;
    let nonTransparent = isTransparentState(stage.state)
        ? null
        : stage.state;
    for (const child of stage.children) {
        const childState = aggregateChildState(child);
        all = worstState(all, childState);
        if (!isTransparentState(childState)) {
            nonTransparent =
                nonTransparent == null
                    ? childState
                    : worstState(nonTransparent, childState);
        }
    }
    return nonTransparent ?? all;
}
function collapseSelectiveStages(stages, collapsedIds) {
    return stages.map((stage) => {
        if (stage.children.length === 0) {
            return stage;
        }
        if (collapsedIds.has(stage.id)) {
            return {
                ...stage,
                children: [],
                collapsedChildCount: countLeafStages(stage),
                state: aggregateChildState(stage),
            };
        }
        return {
            ...stage,
            children: collapseSelectiveStages(stage.children, collapsedIds),
        };
    });
}
function countLeafStages(stage) {
    if (stage.children.length === 0) {
        return 1;
    }
    return stage.children.reduce((sum, child) => sum + countLeafStages(child), 0);
}
function collectParentStageIds(stages) {
    const ids = new Set();
    function walk(list) {
        for (const stage of list) {
            if (stage.children.length > 0) {
                ids.add(stage.id);
                walk(stage.children);
            }
        }
    }
    walk(stages);
    return ids;
}
/**
 * Walk the original (uncollapsed) stage tree and return the IDs of any
 * collapsed ancestors of the stage with the given id (plus the target
 * itself if it is collapsed).
 */
function findCollapsedAncestors(stages, targetId, collapsedIds) {
    function walk(nodes) {
        for (const stage of nodes) {
            if (stage.id === targetId) {
                return [];
            }
            if (stage.children.length > 0) {
                const path = walk(stage.children);
                if (path !== null) {
                    if (collapsedIds.has(stage.id)) {
                        path.push(stage.id);
                    }
                    return path;
                }
            }
        }
        return null;
    }
    const path = walk(stages);
    if (path === null)
        return [];
    if (collapsedIds.has(targetId)) {
        path.push(targetId);
    }
    return path;
}
function useCollapsedStages(normalizedParentJobPath, stages, selectedStageId) {
    const storageKey = `pgv.collapsedStages/${normalizedParentJobPath}`;
    const [collapsedStageIds, setCollapsedStageIds] = (0, react_1.useState)(() => loadFromStorage(storageKey));
    (0, react_1.useEffect)(() => {
        garbageCollectLocalStorage();
    }, []);
    const toggleCollapseStage = (0, react_1.useCallback)((stageId) => {
        setCollapsedStageIds((prev) => {
            const next = new Set(prev);
            if (next.has(stageId)) {
                next.delete(stageId);
            }
            else {
                next.add(stageId);
            }
            saveToStorage(storageKey, next);
            return next;
        });
    }, [storageKey]);
    const setCollapsedIds = (0, react_1.useCallback)((ids) => {
        setCollapsedStageIds(ids);
        saveToStorage(storageKey, ids);
    }, [storageKey]);
    const collapseAll = (0, react_1.useCallback)(() => {
        setCollapsedIds(collectParentStageIds(stages));
    }, [stages, setCollapsedIds]);
    const expandAll = (0, react_1.useCallback)(() => {
        setCollapsedIds(new Set());
    }, [setCollapsedIds]);
    const hasCollapsibleStages = (0, react_1.useMemo)(() => collectParentStageIds(stages).size > 0, [stages]);
    const effectiveStages = (0, react_1.useMemo)(() => collapsedStageIds.size > 0
        ? collapseSelectiveStages(stages, collapsedStageIds)
        : stages, [stages, collapsedStageIds]);
    // Auto-expand collapsed ancestors when a stage is selected (e.g. via
    // the tree sidebar or ?selected-node= URL param).
    (0, react_1.useEffect)(() => {
        if (selectedStageId == null || collapsedStageIds.size === 0)
            return;
        const ancestors = findCollapsedAncestors(stages, selectedStageId, collapsedStageIds);
        if (ancestors.length === 0)
            return;
        setCollapsedStageIds((prev) => {
            const next = new Set(prev);
            for (const id of ancestors) {
                next.delete(id);
            }
            saveToStorage(storageKey, next);
            return next;
        });
    }, [selectedStageId]); // eslint-disable-line react-hooks/exhaustive-deps -- only react to selection changes
    return {
        collapsedStageIds,
        toggleCollapseStage,
        collapseAll,
        expandAll,
        hasCollapsibleStages,
        effectiveStages,
    };
}

},
"runtime/react.cjs":function(module,exports,require){
/* React 18.2.0 / React DOM 18.2.0 / Scheduler 0.23.0. MIT. Copyright (c) Facebook, Inc. and its affiliates. See licenses/react-MIT.txt. */
((e,t)=>{var r=Symbol.for("react.element"),n=Symbol.for("react.portal"),o=Symbol.for("react.fragment"),u=Symbol.for("react.strict_mode"),a=Symbol.for("react.profiler"),c=Symbol.for("react.provider"),i=Symbol.for("react.context"),f=Symbol.for("react.forward_ref"),l=Symbol.for("react.suspense"),s=Symbol.for("react.memo"),p=Symbol.for("react.lazy"),y=Symbol.iterator;function d(e){if(null===e||"object"!==typeof e)return null;e=y&&e[y]||e["@@iterator"];return"function"===typeof e?e:null}var _={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},h=Object.assign,b={};function m(e,t,r){this.props=e;this.context=t;this.refs=b;this.updater=r||_}m.prototype.isReactComponent={};m.prototype.setState=function(e,t){if("object"!==typeof e&&"function"!==typeof e&&null!=e)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};m.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function v(){}v.prototype=m.prototype;function S(e,t,r){this.props=e;this.context=t;this.refs=b;this.updater=r||_}var k=S.prototype=new v;k.constructor=S;h(k,m.prototype);k.isPureReactComponent=!0;var w=Array.isArray,E=Object.prototype.hasOwnProperty,$={current:null},R={key:!0,ref:!0,__self:!0,__source:!0};function C(e,t,n){var o,u={},a=null,c=null;if(null!=t)for(o in void 0!==t.ref&&(c=t.ref),void 0!==t.key&&(a=""+t.key),t)E.call(t,o)&&!R.hasOwnProperty(o)&&(u[o]=t[o]);var i=arguments.length-2;if(1===i)u.children=n;else if(1<i){for(var f=Array(i),l=0;l<i;l++)f[l]=arguments[l+2];u.children=f}if(e&&e.defaultProps)for(o in i=e.defaultProps,i)void 0===u[o]&&(u[o]=i[o]);return{$$typeof:r,type:e,key:a,ref:c,props:u,_owner:$.current}}function j(e,t){return{$$typeof:r,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function g(e){return"object"===typeof e&&null!==e&&e.$$typeof===r}function O(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,(function(e){return t[e]}))}var x=/\/+/g;function P(e,t){return"object"===typeof e&&null!==e&&null!=e.key?O(""+e.key):t.toString(36)}function I(e,t,o,u,a){var c=typeof e;if("undefined"===c||"boolean"===c)e=null;var i=!1;if(null===e)i=!0;else switch(c){case"string":case"number":i=!0;break;case"object":switch(e.$$typeof){case r:case n:i=!0}}if(i)return i=e,a=a(i),e=""===u?"."+P(i,0):u,w(a)?(o="",null!=e&&(o=e.replace(x,"$&/")+"/"),I(a,t,o,"",(function(e){return e}))):null!=a&&(g(a)&&(a=j(a,o+(!a.key||i&&i.key===a.key?"":(""+a.key).replace(x,"$&/")+"/")+e)),t.push(a)),1;i=0;u=""===u?".":u+":";if(w(e))for(var f=0;f<e.length;f++){c=e[f];var l=u+P(c,f);i+=I(c,t,o,l,a)}else if(l=d(e),"function"===typeof l)for(e=l.call(e),f=0;!(c=e.next()).done;)c=c.value,l=u+P(c,f++),i+=I(c,t,o,l,a);else if("object"===c)throw t=String(e),Error("Objects are not valid as a React child (found: "+("[object Object]"===t?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return i}function T(e,t,r){if(null==e)return e;var n=[],o=0;I(e,n,"","",(function(e){return t.call(r,e,o++)}));return n}function V(e){if(-1===e._status){var t=e._result;t=t();t.then((function(t){if(0===e._status||-1===e._status)e._status=1,e._result=t}),(function(t){if(0===e._status||-1===e._status)e._status=2,e._result=t}));-1===e._status&&(e._status=0,e._result=t)}if(1===e._status)return e._result.default;throw e._result}var A={current:null},D={transition:null},U={ReactCurrentDispatcher:A,ReactCurrentBatchConfig:D,ReactCurrentOwner:$};t.Children={map:T,forEach:function(e,t,r){T(e,(function(){t.apply(this,arguments)}),r)},count:function(e){var t=0;T(e,(function(){t++}));return t},toArray:function(e){return T(e,(function(e){return e}))||[]},only:function(e){if(!g(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};t.Component=m;t.Fragment=o;t.Profiler=a;t.PureComponent=S;t.StrictMode=u;t.Suspense=l;t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=U;t.cloneElement=function(e,t,n){if(null===e||void 0===e)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var o=h({},e.props),u=e.key,a=e.ref,c=e._owner;if(null!=t){void 0!==t.ref&&(a=t.ref,c=$.current);void 0!==t.key&&(u=""+t.key);if(e.type&&e.type.defaultProps)var i=e.type.defaultProps;for(f in t)E.call(t,f)&&!R.hasOwnProperty(f)&&(o[f]=void 0===t[f]&&void 0!==i?i[f]:t[f])}var f=arguments.length-2;if(1===f)o.children=n;else if(1<f){i=Array(f);for(var l=0;l<f;l++)i[l]=arguments[l+2];o.children=i}return{$$typeof:r,type:e.type,key:u,ref:a,props:o,_owner:c}};t.createContext=function(e){e={$$typeof:i,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null};e.Provider={$$typeof:c,_context:e};return e.Consumer=e};t.createElement=C;t.createFactory=function(e){var t=C.bind(null,e);t.type=e;return t};t.createRef=function(){return{current:null}};t.forwardRef=function(e){return{$$typeof:f,render:e}};t.isValidElement=g;t.lazy=function(e){return{$$typeof:p,_payload:{_status:-1,_result:e},_init:V}};t.memo=function(e,t){return{$$typeof:s,type:e,compare:void 0===t?null:t}};t.startTransition=function(e){var t=D.transition;D.transition={};try{e()}finally{D.transition=t}};t.unstable_act=function(){throw Error("act(...) is not supported in production builds of React.")};t.useCallback=function(e,t){return A.current.useCallback(e,t)};t.useContext=function(e){return A.current.useContext(e)};t.useDebugValue=function(){};t.useDeferredValue=function(e){return A.current.useDeferredValue(e)};t.useEffect=function(e,t){return A.current.useEffect(e,t)};t.useId=function(){return A.current.useId()};t.useImperativeHandle=function(e,t,r){return A.current.useImperativeHandle(e,t,r)};t.useInsertionEffect=function(e,t){return A.current.useInsertionEffect(e,t)};t.useLayoutEffect=function(e,t){return A.current.useLayoutEffect(e,t)};t.useMemo=function(e,t){return A.current.useMemo(e,t)};t.useReducer=function(e,t,r){return A.current.useReducer(e,t,r)};t.useRef=function(e){return A.current.useRef(e)};t.useState=function(e){return A.current.useState(e)};t.useSyncExternalStore=function(e,t,r){return A.current.useSyncExternalStore(e,t,r)};t.useTransition=function(){return A.current.useTransition()};t.version="18.2.0"})(module, exports);

},
"upstream/pipeline-graph-view/pipeline-graph/main/NestedPipelineGraphLayout.ts":function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_MAX_COLUMNS_WHEN_COLLAPSED = void 0;
exports.nestedGraphLayout = nestedGraphLayout;
exports.removeFalseOptionalGraphNodeFlags = removeFalseOptionalGraphNodeFlags;
const index_ts_1 = require("src/compat/i18n.tsx");
const PipelineGraphModel_tsx_1 = require("upstream/pipeline-graph-view/pipeline-graph/main/PipelineGraphModel.tsx");
exports.DEFAULT_MAX_COLUMNS_WHEN_COLLAPSED = 13;
function nestedGraphLayout(currentRunPath, stages, layout, collapsed, messages, showNames, showDurations, maxColumnsWhenCollapsed = exports.DEFAULT_MAX_COLUMNS_WHEN_COLLAPSED) {
    const graphSpacingX = layout.nodeSpacingH / 4;
    const startEndReducedSpacing = Math.floor(layout.nodeSpacingH * 0.3);
    const root = {
        ...baseGraphNode(layout),
        shiftX: graphSpacingX,
        isPlaceholder: true,
        isHidden: true,
        type: "root",
        name: "Root",
        key: "root",
        id: -42,
        children: [
            {
                ...baseGraphNode(layout, showNames),
                width: layout.nodeSpacingH - startEndReducedSpacing,
                isPlaceholder: true,
                type: "start",
                name: messages.format(index_ts_1.LocalizedMessageKey.start),
                key: "start-node",
                id: -1,
                url: `${currentRunPath}stages/?selected-node=-1`,
            },
        ],
    };
    if (collapsed) {
        buildGraphCollapsed(stages, root, layout, showNames, showDurations, maxColumnsWhenCollapsed);
    }
    else {
        buildGraphNested(root, stages, layout, false);
    }
    root.children.push({
        ...baseGraphNode(layout, showNames),
        width: graphSpacingX,
        shiftX: -startEndReducedSpacing,
        isPlaceholder: true,
        type: "end",
        name: messages.format(index_ts_1.LocalizedMessageKey.end),
        key: "end-node",
        id: -3,
    });
    root.y = root.shiftY + layout.nodeRadius;
    root.width =
        root.shiftX + sumGraphNodeProp(root, "width") - startEndReducedSpacing;
    root.x += layout.graphSpacingLeft;
    root.y += layout.graphSpacingTop;
    const measuredWidth = root.x + root.width + layout.graphSpacingRight;
    const measuredHeight = root.y + root.height + layout.graphSpacingBottom;
    computePositions(root, 0, layout);
    const connections = computeConnections(root);
    const nodes = flattenGraph(root);
    const visibleNodes = nodes.filter((node) => !node.isHidden);
    const smallLabels = computeSmallLabels(nodes);
    const branchLabels = computeBranchLabels(nodes, layout);
    const bigLabels = computeBigLabels(nodes, layout);
    const timings = computeTimingsLabels(nodes, layout);
    const debug = (0, PipelineGraphModel_tsx_1.debugPipelineGraph)();
    if (debug)
        printDebugInfo(stages, root, nodes, connections);
    return {
        nodes: debug ? nodes : visibleNodes,
        allNodes: nodes,
        connections,
        smallLabels,
        bigLabels,
        branchLabels,
        timings,
        measuredWidth,
        measuredHeight,
    };
}
function flattenGraph(node) {
    return [node, ...node.children.flatMap(flattenGraph)];
}
function floorToMultipleOf(n, multiple) {
    return Math.floor(n / multiple) * multiple;
}
function roundToMultipleOf(n, multiple) {
    return Math.round(n / multiple) * multiple;
}
function centerOfNode(node, layout) {
    if (node.isPlaceholder)
        return node.x;
    return (node.x +
        roundToMultipleOf((node.width - (node.hasStageEnd ? layout.nodeSpacingH / 2 : 0)) / 2, layout.nodeSpacingH / 2) -
        layout.nodeSpacingH / 2);
}
function sumGraphNodeProp(node, prop) {
    return node.children.reduce((sum, c) => sum + c[prop], 0);
}
function maxGraphNodeProp(node, prop) {
    return Math.max(node[prop], ...node.children.map((c) => c[prop]));
}
function collectCollapsedStages(collapsedStages, stages, level) {
    for (const stage of stages) {
        if ((!(stage.children.length > 0 && stage.children[0].type === "PARALLEL") &&
            !(stage.type === "PARALLEL" && stage.children.length > 0)) ||
            (level > 1 && stage.type !== "PARALLEL_BLOCK")) {
            // Mirror filtering of old layout:
            // - Top level: Hide stages that wrap "PARALLEL" stages.
            // - Top level: Hide "PARALLEL" stages with children.
            // - Rest: Hide generic "PARALLEL_BLOCK" wrapper.
            collapsedStages.push(stage);
        }
        collectCollapsedStages(collapsedStages, stage.children, level + 1);
    }
}
function buildGraphCollapsed(stages, root, layout, showNames, showDurations, maxColumnsWhenCollapsed) {
    const collapsedStages = [];
    collectCollapsedStages(collapsedStages, stages, 0);
    const breakPoint = collapsedStages.length > maxColumnsWhenCollapsed
        ? maxColumnsWhenCollapsed - 1 // Make space for counter node.
        : collapsedStages.length;
    root.children.push(...collapsedStages.slice(0, breakPoint).map((stage) => ({
        ...makeNodeForStage(stage, layout, showNames),
        hasTiming: showDurations,
    })));
    if (collapsedStages.length > breakPoint) {
        root.children.push({
            ...baseGraphNode(layout),
            isPlaceholder: true,
            type: "counter",
            name: "Counter",
            key: "counter-node",
            id: -2,
            stages: collapsedStages.slice(breakPoint),
        });
    }
    root.shiftY = maxGraphNodeProp(root, "shiftY");
}
function buildGraphNested(node, stages, layout, isLast) {
    if (node.isSkipped || stages.length === 0)
        return;
    for (let [idx, stage] of stages.entries()) {
        const isLast = idx === stages.length - 1;
        const isParallel = stage.type === "PARALLEL";
        const hasChildren = stage.children.length > 0;
        let hasParallel = hasChildren && stage.children[0].type === "PARALLEL";
        if (isParallel && hasParallel) {
            // Turn PARALLEL -> PARALLEL into PARALLEL -> PARALLEL_BLOCK -> PARALLEL.
            // This allows for a stage-end node to be inserted after the parallel children.
            // PARALLEL[PARALLEL, ...] -> PARALLEL[PARALLEL_BLOCK[PARALLEL, ...],stage-end]
            // Which in turn lets us connect the nested parallel children together before connecting the stage-end to the parents next node.
            stage = {
                ...stage,
                id: -stage.id,
                children: [{ ...stage, type: "PARALLEL_BLOCK" }],
            };
            hasParallel = false;
        }
        const isNestedParallel = isParallel &&
            stage.children.length > 0 &&
            stage.children[0].children.length > 0 &&
            stage.children[0].children[0].type === "PARALLEL" &&
            stage.name === stage.children[0].name;
        const isSkipped = stage.state === PipelineGraphModel_tsx_1.Result.skipped;
        const firstChildIsSkipped = effectiveFirstChildStage(stage.children)?.state === PipelineGraphModel_tsx_1.Result.skipped;
        const hasBranchLabel = isParallel &&
            hasChildren &&
            // Do not add a branch label on the parent of a nested parallel. Instead, show a big label on the nested parallel block.
            !isNestedParallel;
        const isHidden = hasBranchLabel || hasChildren || isNestedParallel;
        const hasBigLabel = hasParallel ||
            (stage.type === "STAGE" && hasChildren && !hasBranchLabel) ||
            // Do not add a big label to parallel skipped stages. Only use one when we show a "skipped", curved connection.
            (isSkipped && !isParallel);
        const hasSmallLabel = !isHidden && !hasBigLabel;
        const childNode = {
            ...makeNodeForStage(stage, layout),
            isNestedParallel,
            isParallel,
            isSkipped,
            isHidden,
            hasParallel,
            hasBranchLabel,
            hasBigLabel,
            hasSmallLabel,
            firstChildIsSkipped,
        };
        buildGraphNested(childNode, stage.children, layout, isLast);
        if (isParallel && idx > 0)
            childNode.shiftY += layout.labelOffsetV;
        if (hasBigLabel)
            childNode.shiftY += layout.labelOffsetV;
        childNode.allChildrenSkipped =
            childNode.hasParallel && !childNode.children.some((c) => !c.isSkipped);
        node.children.push(childNode);
    }
    // Two phased approach as we need to detect if any sibling has a branch label -> node will need to make space.
    const anyChildHasBranchLabel = node.hasParallel && node.children.some((c) => c.hasBranchLabel);
    for (const childNode of node.children) {
        if ((childNode.isNestedParallel && !anyChildHasBranchLabel) ||
            (childNode.hasParallel &&
                childNode.children.some((c) => c.hasBranchLabel))) {
            // - Nested parallel children (unless a sibling already added spacing on the parent), avoid collapsing curves.
            // - Any of its children has branch label, make space for branch labels.
            childNode.shiftX += layout.nodeSpacingH;
            childNode.width += layout.nodeSpacingH;
        }
    }
    if (node.hasParallel) {
        // Move shiftY from first parallel child up one level.
        const inheritedShift = node.children[0].shiftY;
        node.shiftY = inheritedShift;
        node.width = maxGraphNodeProp(node, "width");
        node.height =
            sumGraphNodeProp(node, "height") +
                sumGraphNodeProp(node, "shiftY") -
                inheritedShift;
    }
    else {
        node.width = sumGraphNodeProp(node, "width");
        node.height = maxGraphNodeProp(node, "height");
        node.shiftY = maxGraphNodeProp(node, "shiftY");
    }
    const last = node.children[node.children.length - 1];
    node.hasStageEnd =
        !node.hasParallel &&
            (isLast || node.isParallel) &&
            (last.isSkipped || last.hasParallel);
    if (node.hasStageEnd) {
        // - Add a dummy node to "close" the skipped curve before closing the stage.
        // - Add a dummy node to "close" the parallel curve of the child.
        // In both cases, the dummy node will be the new stage end that is connected to the next node.
        node.width += layout.nodeSpacingH / 2;
        node.children.push({
            ...baseGraphNode(layout),
            shiftX: -layout.nodeSpacingH / 2,
            width: layout.nodeSpacingH,
            isPlaceholder: true,
            type: "stage-end",
            key: `stage_end_${node.key}`,
            name: `Stage end (${node.name})`,
            id: 1_000_000 + node.id,
            isHidden: true,
        });
    }
}
function effectiveFirstChildStage(children) {
    if (children.length === 0)
        return null;
    if (children[0].type === "PARALLEL")
        return children[0];
    if (children[0].children.length === 0)
        return children[0];
    return effectiveFirstChildStage(children[0].children);
}
function computePositions(node, extraXp, layout) {
    if (node.children.length === 0)
        return;
    extraXp += node.shiftX;
    let xP = node.x + extraXp;
    let yP = node.y;
    for (const [i, child] of node.children.entries()) {
        child.x = xP;
        child.y = yP;
        let childExtraXp = 0;
        if (node.hasParallel) {
            if (i > 0) {
                // Skip first child: The entire node has been moved already by children[0].shiftY.
                child.y += child.shiftY;
                yP += child.shiftY;
            }
            yP += child.height;
            // Shift small children close to center, prefer closer to start than end.
            childExtraXp = floorToMultipleOf((node.width - extraXp - child.width) / 2, layout.nodeSpacingH);
            if (child.children.length === 0) {
                child.x += childExtraXp;
                childExtraXp = 0;
            }
        }
        else {
            xP += child.width;
            if (child.shiftX < 0) {
                xP += child.shiftX;
                child.x += child.shiftX;
            }
        }
        computePositions(child, childExtraXp, layout);
    }
}
function computeConnections(node) {
    const connections = [];
    computeTailNodes(connections, node);
    return connections;
}
function resolveNestedSequentialGraphNode(node) {
    // This node is a leaf.
    if (node.children.length === 0)
        return node;
    // Parallel nesting: Connect directly to parallel children.
    if (node.hasParallel)
        return node;
    // Sequential nesting with first child skipped: Connect to parent (non-skipped) before starting the skipped curve.
    if (node.firstChildIsSkipped)
        return node;
    // Sequential nesting: Connect directly to 1st child, recursively resolve it.
    return resolveNestedSequentialGraphNode(node.children[0]);
}
function computeTailNodes(connections, node) {
    if (node.children.length === 0) {
        return [node];
    }
    if (node.hasParallel) {
        if (node.allChildrenSkipped) {
            // Special case: a regular connection will be added around all the children.
            connections.push({
                sourceNodes: [node],
                destinationNodes: [],
                skippedNodes: [],
                hasBranchLabels: false,
            });
        }
        return node.children.flatMap((child) => computeTailNodes(connections, child));
    }
    // Collect nodes in a Set. With two skipped nodes next to each other, we need to deduplicate them.
    const sourceNodes = new Set();
    const skippedNodes = new Set();
    const connect = (tailNodes, destination, ignoreSkipped) => {
        for (const node of tailNodes) {
            if (ignoreSkipped || !node.isSkipped || node.isParallel) {
                sourceNodes.add(node);
            }
            else {
                skippedNodes.add(node);
            }
        }
        destination = resolveNestedSequentialGraphNode(destination);
        const destinationNodes = destination.hasParallel
            ? destination.children
            : [destination];
        if (!destinationNodes.some((n) => !n.isSkipped || n.isParallel)) {
            for (const node of destinationNodes)
                skippedNodes.add(node);
            return;
        }
        if (!sourceNodes.size)
            throw new Error("bug: empty sourceNodes");
        connections.push({
            sourceNodes: Array.from(sourceNodes),
            destinationNodes,
            skippedNodes: Array.from(skippedNodes),
            hasBranchLabels: destination.shiftX > 0, // shift curved connections
        });
        sourceNodes.clear();
        skippedNodes.clear();
    };
    if (node.isParallel || node.firstChildIsSkipped) {
        // See comments in resolveNestedSequentialGraphNode.
        connect([node], node.children[0], true);
    }
    for (let i = 0; i < node.children.length - 1; i++) {
        const childA = node.children[i];
        const childB = node.children[i + 1];
        connect(computeTailNodes(connections, childA), childB, 
        // Honor skipped state per layer, but not across layers.
        childA.hasParallel);
    }
    const last = node.children[node.children.length - 1];
    if (last.isSkipped) {
        return [...sourceNodes, ...skippedNodes, last];
    }
    if (skippedNodes.size > 0 || sourceNodes.size > 0) {
        throw new Error("bug: buildGraphNested did not add trailing dummy node");
    }
    return computeTailNodes(connections, last);
}
function computeSmallLabels(visibleNodes) {
    return visibleNodes
        .filter((node) => node.hasSmallLabel)
        .map((node) => {
        return {
            x: node.x,
            y: node.y,
            text: node.name,
            key: "l_small_" + node.key,
            node,
            stage: "stage" in node ? node.stage : undefined,
        };
    });
}
function computeBranchLabels(nodes, layout) {
    return nodes
        .filter((node) => node.hasBranchLabel)
        .map((node) => {
        return {
            x: node.x - layout.nodeSpacingH,
            y: node.y,
            key: "l_branch_" + node.key,
            node,
            stage: "stage" in node ? node.stage : undefined,
            text: node.name,
        };
    });
}
function computeBigLabels(nodes, layout) {
    return nodes
        .filter((node) => node.hasBigLabel)
        .map((node) => {
        return {
            x: centerOfNode(node, layout),
            y: node.y - (node.shiftY - layout.labelOffsetV),
            key: "l_big_" + node.key,
            node,
            stage: "stage" in node ? node.stage : undefined,
            text: node.name,
        };
    });
}
function computeTimingsLabels(nodes, layout) {
    return nodes
        .filter((node) => node.hasTiming)
        .map((node) => {
        return {
            x: centerOfNode(node, layout),
            y: node.y + 55,
            node,
            stage: "stage" in node ? node.stage : undefined,
            text: "", // we take the duration from the stage itself at render time
            key: `l_t_${node.key}`,
        };
    });
}
function baseGraphNode(layout, hasBigLabel) {
    return {
        children: [],
        x: 0,
        y: 0,
        shiftX: 0,
        shiftY: 0,
        width: layout.nodeSpacingH,
        height: layout.nodeSpacingV - layout.labelOffsetV,
        ...(hasBigLabel ? { shiftY: layout.labelOffsetV, hasBigLabel: true } : {}),
    };
}
function makeNodeForStage(stage, layout, hasBigLabel) {
    return {
        ...baseGraphNode(layout, hasBigLabel),
        name: stage.name,
        id: stage.id,
        type: "stage",
        stage,
        isPlaceholder: false,
        key: "n_" + stage.id,
    };
}
function printDebugInfo(newStages, root, nodes, connections) {
    console.log("JSON.stringify(newStages)", JSON.stringify(newStages));
    console.log("For test snapshot", JSON.stringify(newStages.map(function forTestSnapshot(stage) {
        return {
            name: stage.name,
            state: stage.state,
            id: stage.id,
            type: stage.type,
            children: stage.children.map(forTestSnapshot),
        };
    })));
    console.log("newStages", newStages);
    for (const node of nodes) {
        removeFalseOptionalGraphNodeFlags(node);
    }
    console.log("graph root", root);
    console.table(nodes.map((n) => ({ ...n, stage: "stage" in n && n.stage.type })), [
        "width",
        "height",
        "shiftY",
        "shiftX",
        "x",
        "y",
        "key",
        "type",
        "hasParallel",
        "hasBranchLabel",
        "stage",
        "name",
    ]);
    const byKey = new Map(nodes.map((n) => [n.key, n]));
    const joinEdges = (ee) => ee.map((e) => `${e.key} (${byKey.get(e.key)?.name})`).join(",");
    console.table(connections.map((c) => ({
        sourceNodes: joinEdges(c.sourceNodes),
        destinationNodes: joinEdges(c.destinationNodes),
        skippedNodes: joinEdges(c.skippedNodes),
        hasBranchLabels: c.hasBranchLabels,
    })));
}
function removeFalseOptionalGraphNodeFlags(node) {
    if (!node.allChildrenSkipped)
        delete node.allChildrenSkipped;
    if (!node.firstChildIsSkipped)
        delete node.firstChildIsSkipped;
    if (!node.hasBigLabel)
        delete node.hasBigLabel;
    if (!node.hasBranchLabel)
        delete node.hasBranchLabel;
    if (!node.hasParallel)
        delete node.hasParallel;
    if (!node.hasSmallLabel)
        delete node.hasSmallLabel;
    if (!node.hasStageEnd)
        delete node.hasStageEnd;
    if (!node.hasTiming)
        delete node.hasTiming;
    if (!node.isHidden)
        delete node.isHidden;
    if (!node.isNestedParallel)
        delete node.isNestedParallel;
    if (!node.isParallel)
        delete node.isParallel;
    if (!node.isSkipped)
        delete node.isSkipped;
    for (const [key, value] of Object.entries(node)) {
        if (key === "isPlaceholder")
            continue; // isPlaceholder is required.
        if (value === false) {
            throw new Error(`Bug: Missed false flag: ${key} on node`);
        }
    }
}

},
"src/compat/i18n.tsx":function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocale = exports.useMessages = exports.I18NContext = exports.Messages = exports.LocalizedMessageKey = void 0;
const react_1 = require("runtime/react.cjs");
var LocalizedMessageKey;
(function (LocalizedMessageKey) {
    LocalizedMessageKey["startedAgo"] = "startedAgo";
    LocalizedMessageKey["queued"] = "queued";
    LocalizedMessageKey["noBuilds"] = "noBuilds";
    LocalizedMessageKey["start"] = "node.start";
    LocalizedMessageKey["end"] = "node.end";
    LocalizedMessageKey["changesSummary"] = "changes.summary";
    LocalizedMessageKey["settings"] = "settings";
    LocalizedMessageKey["showNames"] = "settings.showStageName";
    LocalizedMessageKey["showDuration"] = "settings.showStageDuration";
    LocalizedMessageKey["consoleNewTab"] = "console.newTab";
    LocalizedMessageKey["tailLogsResume"] = "tailLogs.resume";
    LocalizedMessageKey["tailLogsPause"] = "tailLogs.pause";
    LocalizedMessageKey["expandNestedStages"] = "collapse.expandNested";
    LocalizedMessageKey["collapseNestedStages"] = "collapse.collapseNested";
    LocalizedMessageKey["expandAllStages"] = "collapse.expandAll";
    LocalizedMessageKey["collapseAllStages"] = "collapse.collapseAll";
})(LocalizedMessageKey || (exports.LocalizedMessageKey = LocalizedMessageKey = {}));
const values = {
    'node.start': 'Start', 'node.end': 'End', 'collapse.expandNested': 'Expand nested stages',
    'collapse.collapseNested': 'Collapse nested stages', 'collapse.expandAll': 'Expand all stages',
    'collapse.collapseAll': 'Collapse all stages', 'noBuilds': 'No builds', queued: 'Queued', startedAgo: 'Started'
};
class Messages {
    format(key, args) { return values[key] ?? (args ? Object.values(args).join(' ') : key); }
}
exports.Messages = Messages;
exports.I18NContext = (0, react_1.createContext)(new Messages());
const useMessages = () => (0, react_1.useContext)(exports.I18NContext);
exports.useMessages = useMessages;
const useLocale = () => 'en';
exports.useLocale = useLocale;

},
"src/flow-table.ts":function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFlowDepth = parseFlowDepth;
exports.parseFlowDuration = parseFlowDuration;
exports.parseFlowLabel = parseFlowLabel;
exports.parseFlowGraphHtml = parseFlowGraphHtml;
exports.adaptFlowRows = adaptFlowRows;
exports.adaptFlowGraphHtml = adaptFlowGraphHtml;
const PipelineGraphModel_tsx_1 = require("upstream/pipeline-graph-view/pipeline-graph/main/PipelineGraphModel.tsx");
const useCollapsedStages_ts_1 = require("upstream/pipeline-graph-view/pipeline-graph/main/support/useCollapsedStages.ts");
const model_ts_1 = require("src/model.ts");
const MAX_ROWS = 30000, MAX_DEPTH = 160;
const fail = (reason) => { throw new Error('Pipeline Steps HTML: ' + reason); };
function parseFlowDepth(style) {
    // This is the actual inline depth encoding supplied by Jenkins 2.516.3.
    // Do not measure pixels: a detached document has no Jenkins stylesheets.
    const match = style.match(/(?:^|;)\s*padding-left\s*:\s*calc\(\s*var\(--table-padding\)\s*\*\s*(\d+)\s*\)\s*(?:;|$)/i);
    if (!match)
        fail('unsupported indentation markup; cannot recover hierarchy safely.');
    const n = Number(match[1]);
    if (n > MAX_DEPTH)
        fail('depth safety limit exceeded.');
    return n;
}
function parseFlowDuration(text) {
    if (!text || text === 'no timing')
        return undefined;
    if (text === '<1 ms')
        return 0;
    const units = { ms: 1, millisecond: 1, milliseconds: 1, sec: 1000, second: 1000, seconds: 1000,
        min: 60000, minute: 60000, minutes: 60000, hr: 3600000, hour: 3600000, hours: 3600000, day: 86400000, days: 86400000 };
    const re = /(\d+(?:\.\d+)?)\s*(milliseconds?|ms|seconds?|sec|minutes?|min|hours?|hr|days?)\b/g;
    let last = 0, total = 0, count = 0;
    for (const m of text.matchAll(re)) {
        if (text.slice(last, m.index).trim())
            return undefined;
        total += Number(m[1]) * units[m[2]];
        last = m.index + m[0].length;
        count++;
    }
    return count && !text.slice(last).trim() && Number.isSafeInteger(Math.round(total)) ? Math.round(total) : undefined;
}
function parseFlowLabel(text) {
    const m = text.trim().match(/^(.*) - \((.*) in (block|self)\)$/s);
    if (!m)
        return { label: text.trim() };
    return { label: m[1], scope: m[3], durationText: m[2], durationMillis: parseFlowDuration(m[2]) };
}
function tableState(cell) {
    const label = cell.querySelector('.jenkins-visually-hidden')?.textContent?.trim()
        || cell.querySelector('[tooltip]')?.getAttribute('tooltip') || '';
    const known = { Success: PipelineGraphModel_tsx_1.Result.success, Failed: PipelineGraphModel_tsx_1.Result.failure, Failure: PipelineGraphModel_tsx_1.Result.failure,
        Unstable: PipelineGraphModel_tsx_1.Result.unstable, Aborted: PipelineGraphModel_tsx_1.Result.aborted, 'Not built': PipelineGraphModel_tsx_1.Result.not_built, 'Not Built': PipelineGraphModel_tsx_1.Result.not_built,
        Disabled: PipelineGraphModel_tsx_1.Result.not_built, Skipped: PipelineGraphModel_tsx_1.Result.skipped, 'In progress': PipelineGraphModel_tsx_1.Result.running, 'In Progress': PipelineGraphModel_tsx_1.Result.running,
        Running: PipelineGraphModel_tsx_1.Result.running, Paused: PipelineGraphModel_tsx_1.Result.paused, Queued: PipelineGraphModel_tsx_1.Result.queued };
    return known[label] ?? PipelineGraphModel_tsx_1.Result.unknown;
}
/** Parse the known UI format, rejecting links to any other origin, job or build. */
function parseFlowGraphHtml(html, buildUrl) {
    if (typeof html !== 'string' || html.length > 8 * 1024 * 1024)
        fail('response exceeds the 8 MiB safety limit.');
    const expected = new URL(buildUrl);
    if (!/^https?:$/.test(expected.protocol) || expected.search || expected.hash || expected.username || expected.password
        || !/^.*\/job\/.+\/\d+\/$/.test(expected.pathname))
        fail('invalid expected build URL.');
    // <template> is inert (including images, frames and scripts). Never attach it.
    const template = document.createElement('template');
    template.innerHTML = html;
    const tables = template.content.querySelectorAll('#nodeGraph > table');
    if (tables.length !== 1)
        fail('expected one #nodeGraph table (login page or unsupported markup).');
    const table = tables[0], rows = [];
    const ids = new Set();
    for (const tr of Array.from(table.querySelectorAll('tr'))) {
        if (tr.closest('table') !== table)
            fail('nested tables are not supported.');
        const cells = Array.from(tr.children).filter(e => e.tagName === 'TD');
        if (!cells.length)
            continue;
        if (cells.length !== 5)
            fail('unexpected table columns.');
        const links = cells[0].querySelectorAll('a[href]');
        if (links.length !== 1)
            fail('ambiguous row link.');
        const link = links[0], u = new URL(link.getAttribute('href'), expected);
        const suffix = u.pathname.slice(expected.pathname.length);
        if (u.origin !== expected.origin || u.username || u.password || u.search || u.hash
            || !u.pathname.startsWith(expected.pathname) || !/^execution\/node\/\d+\/$/.test(suffix))
            fail('node URL does not belong to the selected build.');
        const id = Number(suffix.split('/')[2]);
        if (!Number.isSafeInteger(id) || ids.has(id))
            fail('duplicate or unsafe node ID.');
        ids.add(id);
        const hint = link.getAttribute('tooltip') || link.getAttribute('title');
        if (hint && /^ID:/.test(hint) && hint !== `ID: ${id}`)
            fail('node ID and tooltip disagree.');
        const fields = parseFlowLabel(link.textContent || '');
        const args = fields.label === 'stage' ? (cells[1].textContent || '').trim() : '';
        if (!fields.label || fields.label.length > 4500 || args.length > 4000)
            fail('invalid row name.');
        rows.push({ id, depth: parseFlowDepth(cells[0].getAttribute('style') || ''), ...fields, args, state: tableState(cells[4]) });
        if (rows.length > MAX_ROWS)
            fail('more than 30,000 rows.');
    }
    if (!rows.length)
        fail('empty table; no execution topology available.');
    return rows;
}
function hierarchy(rows) {
    if (!rows.length || rows.length > MAX_ROWS)
        fail('invalid row count.');
    const root = { id: -1, depth: -1, label: 'root', args: '', state: PipelineGraphModel_tsx_1.Result.unknown, children: [] };
    const stack = [root], seen = new Set();
    const base = rows[0].depth;
    for (const row of rows) {
        if (!Number.isSafeInteger(row.id) || row.id < 0 || seen.has(row.id))
            fail('invalid or duplicate ID.');
        seen.add(row.id);
        if (!Number.isInteger(row.depth) || row.depth < base || row.depth > MAX_DEPTH)
            fail('invalid depth.');
        while (stack.length > 1 && stack[stack.length - 1].depth >= row.depth)
            stack.pop();
        const parent = stack[stack.length - 1];
        if (parent !== root && (row.depth !== parent.depth + 1 || parent.scope !== 'block'))
            fail('inconsistent indentation or a non-block parent.');
        if (parent === root && row.depth !== base)
            fail('missing ancestor rows.');
        const node = { ...row, children: [] };
        parent.children.push(node);
        stack.push(node);
    }
    return root.children;
}
/**
 * Reconstruct containment from HTML rows, not names, elapsed overlaps or node ID arithmetic.
 * Stage/call and stage/body are a verified pair; use the body ID returned by wfapi.
 * Transparent wrappers are projected out. Explicit parallel blocks retain branch structure.
 */
function adaptFlowRows(rows, run, runPath) {
    (0, model_ts_1.validateRun)(run);
    if (!runPath.endsWith('/' + run.id + '/'))
        fail('run identity does not match the requested build.');
    const root = hierarchy(rows), byId = new Map(run.stages.map(s => [Number(s.id), s]));
    const meta = new Map(), consumed = new Set(), warnings = [];
    const live = (0, model_ts_1.isActive)(run.status);
    let displayed = 0;
    function make(row, name, type, children, stepId = row.id, bodyId) {
        if (++displayed > 3000)
            fail('more than 3,000 displayed nodes.');
        const candidates = [...new Set([row.id, stepId, bodyId].filter((n) => n !== undefined))];
        const matches = candidates.map(id => byId.get(id)).filter(Boolean);
        if (matches.length > 1)
            fail('wfapi exposes multiple chunks for one stage; cannot merge safely.');
        const raw = matches[0];
        if (raw)
            consumed.add(Number(raw.id));
        const id = raw ? Number(raw.id) : row.id;
        if (meta.has(id))
            fail('duplicate projected node.');
        const baseState = raw ? (0, model_ts_1.status)(raw.status) : row.state;
        const base = { id, name, title: name, state: baseState, type, children,
            startTimeMillis: raw?.startTimeMillis ?? 0, pauseDurationMillis: raw?.pauseDurationMillis ?? 0,
            agent: raw?.execNode || '', url: runPath + 'execution/node/' + (bodyId ?? stepId) + '/log/',
            isSequential: children.length > 0 && children[0].type !== 'PARALLEL' };
        const flow = { stepId, bodyId, depth: row.depth, tableState: row.state,
            tableDuration: row.durationText, rawState: raw?.status, rawDurationMillis: raw?.durationMillis,
            stateSource: children.length ? 'derived-children' : raw ? 'wfapi' : 'html-node', durationSource: 'unavailable' };
        if (children.length) {
            // This is a display aggregate, not StatusAndTiming.computeChunkStatus.
            base.state = (0, useCollapsedStages_ts_1.collapseSelectiveStages)([base], new Set([id]))[0].state;
        }
        const ownLive = baseState === PipelineGraphModel_tsx_1.Result.running || baseState === PipelineGraphModel_tsx_1.Result.paused || baseState === PipelineGraphModel_tsx_1.Result.queued;
        if (!children.length && raw) {
            base.totalDurationMillis = ownLive ? undefined : raw.durationMillis;
            flow.durationSource = 'wfapi';
        }
        else if (type === 'PARALLEL' && !raw) {
            // Some branch wrapper rows in the supplied page say 5ms for 11min of work.
            // Never present that wrapper timing as the duration of its descendants.
            base.pauseLiveTotal = true;
            base.pgvxDurationLabel = 'Duration unavailable';
        }
        else if (row.durationText && row.durationMillis !== undefined) {
            base.totalDurationMillis = row.durationMillis;
            base.pauseLiveTotal = true;
            flow.durationSource = 'html-rounded';
            base.pgvxDurationLabel = (row.durationText.startsWith('<') ? '' : '~ ') + row.durationText + (live ? ' (snapshot)' : '');
        }
        else {
            base.pauseLiveTotal = true;
            base.pgvxDurationLabel = 'Duration unavailable';
        }
        meta.set(id, { kind: children.length ? 'group' : 'stage', raw, mode: children[0]?.type === 'PARALLEL' ? 'parallel' : 'sequence', source: 'flow-graph-table', flow });
        return base;
    }
    function sequence(nodes, level = 0) {
        if (level > 50)
            fail('logical hierarchy exceeds 50 levels.');
        const out = [];
        for (const row of nodes) {
            if (row.label === 'stage') {
                const body = row.children.filter(r => r.label.startsWith('stage block'));
                if (body.length > 1 || (row.children.length > 0 && body.length !== 1))
                    fail('unrecognised stage/body pairing.');
                if (!row.args)
                    fail('stage name missing from Arguments column.');
                const inner = body[0];
                if (inner && inner.label !== `stage block (${row.args})`)
                    fail('stage/body labels disagree.');
                let children = sequence(inner ? inner.children : [], level + 1);
                // A stage containing one parallel block is its natural named container.
                let parallelId;
                if (children.length === 1 && children[0].type === 'PARALLEL_BLOCK') {
                    parallelId = children[0].id;
                    meta.delete(parallelId);
                    children = children[0].children;
                }
                const node = make(row, row.args, 'STAGE', children, row.id, inner?.id);
                if (parallelId)
                    meta.get(node.id).flow.parallelId = parallelId;
                out.push(node);
            }
            else if (row.label === 'parallel') {
                if (!row.children.length) {
                    if (!live)
                        fail('completed parallel block has no branches.');
                    out.push(make(row, 'parallel', 'PARALLEL_BLOCK', []));
                    continue;
                }
                const branches = [];
                for (const b of row.children) {
                    const match = b.label.match(/^parallel block \(Branch: (.+)\)$/s);
                    if (!match)
                        fail('unsupported parallel branch markup.');
                    const children = sequence(b.children, level + 1), name = match[1];
                    if (children.length === 1 && children[0].type === 'STAGE' && children[0].name === name) {
                        const node = { ...children[0], type: 'PARALLEL' };
                        meta.get(node.id).flow.branchId = b.id;
                        branches.push(node);
                    }
                    else {
                        branches.push(make(b, name, 'PARALLEL', children));
                    }
                }
                out.push(make(row, 'parallel', 'PARALLEL_BLOCK', branches));
            }
            else if (row.label.startsWith('stage block') || row.label.startsWith('parallel block')) {
                fail('orphan stage or parallel body.');
            }
            else {
                out.push(...sequence(row.children, level + 1));
            }
        }
        return out;
    }
    const stages = sequence(root);
    const unmatched = run.stages.filter(s => !consumed.has(Number(s.id)));
    if (unmatched.length)
        fail('wfapi stages are missing from this HTML snapshot: ' + unmatched.map(s => s.id).join(', ') + '. Refresh to read a consistent build snapshot.');
    const unsupported = (0, model_ts_1.walkStages)(stages).filter(s => s.state === PipelineGraphModel_tsx_1.Result.unknown);
    if (unsupported.length)
        warnings.push('Some HTML node states are unrecognised. Display aggregates may be incomplete; inspect the native Pipeline Steps page.');
    return { stages, meta, warnings, source: 'flow-graph-table', complete: !live };
}
function adaptFlowGraphHtml(html, run, buildUrl) {
    const url = new URL(buildUrl);
    return adaptFlowRows(parseFlowGraphHtml(html, url.href), run, url.pathname);
}

}
};
const cache=Object.create(null);
function require(id){if(cache[id])return cache[id].exports;const module=cache[id]={exports:{}};if(!modules[id])throw new Error("Missing module: "+id);modules[id](module,module.exports,require);return module.exports;}
module.exports = require("tests/entry.ts");
})();
