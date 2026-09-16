# Source review - exact uploaded Pipeline Graph View tag

Tag: `1013.v9f83fd83c063`.
Uploaded archive SHA-256: `f3e0e8dbb5fd77150f5bfc62f43a15ea3caa7e2adba652970e1fea5a37f9ce1f`.

This document records code inspected in the uploaded archive, not the current
main branch. Extract line numbers refer to each original file. No server plugin
was built or run. The original user Jenkinsfile and build #1 JSON were not supplied.

## Diagnosis of the 0.1.0 adapter

The old adapter made every wfapi stage a leaf (`children: []`) and mapped raw
`status` directly. It placed Test before a new local Checks group. This is why
its green Test was not a summary of those branches. `stageFlowNodes` are exposed
step/chunk details; an empty array cannot establish stage containment. The supplied
JSON is successful build #2, where Test is SUCCESS/139 ms; the screenshot shows
build #1, whose exact API payload is unavailable here.

The old panel was inserted next to Stage View without clearing floated Jenkins
job actions. The new main-panel placement/clearance was regression-tested with a
floated chart, not the real page DOM.

The 0.2.0 adapter does not infer topology from names, timestamps, stage order or
wfapi step-parent IDs. It reads the tree contract below, or displays a flat list.

## Controller baseline

This exact tag declares Jenkins 2.541.3. The frontend copy does not make that Java plugin compatible with 2.516.3.

File: `pom.xml`
SHA-256: `b4c514fea1102f4671f2b5edd2c885d0b0bc933c284ee2d32979d3a6e0f3ae1a`

```text
32:   <properties>
33:     <changelist>999999-SNAPSHOT</changelist>
34:     <gitHubRepo>jenkinsci/pipeline-graph-view-plugin</gitHubRepo>
35:     <!-- Baseline Jenkins version you use to build the plugin. Users must have this version or newer to run. -->
36:     <jenkins.baseline>2.541</jenkins.baseline>
37:     <jenkins.version>${jenkins.baseline}.3</jenkins.version>
38:     <node.version>24.20.0</node.version>
39:     <npm.version>12.0.2</npm.version>
```

## Traverse execution nodes

The tree is built from FlowExecution / FlowNodes and enclosing relationships, not a browser parser of Jenkinsfile text.

File: `src/main/java/io/jenkins/plugins/pipelinegraphview/treescanner/PipelineNodeTreeScanner.java`
SHA-256: `868500d082b0c4384a6515a9354c92a03668516418aa44036352a64639dd147a`

```text
128:      * Gets all the nodes that are reachable in the graph.
129:      */
130:     private List<FlowNode> getAllNodes() {
131:         List<FlowNode> heads = execution.getCurrentHeads();
132:         final DepthFirstScanner scanner = new DepthFirstScanner();
133:         scanner.setup(heads);
134: 
135:         // nodes that we've visited
136:         final List<FlowNode> nodes = new ArrayList<>();
137:         for (FlowNode n : scanner) {
138:             nodes.add(n);
139:         }
140:         return nodes;
141:     }
```

```text
416:                 } else if (node instanceof BlockEndNode) {
417:                     // Drop End nodes from Pipeline - unless they are responsible for the unhandled
418:                     // exception.
419:                     if (isDebugEnabled) {
420:                         logger.debug("Skipping end node {}, {}", node.getId(), node.getClass());
421:                     }
422:                     continue;
423:                 }
424:                 if (isDebugEnabled) {
425:                     logger.debug("Wrapping {} [{}]", node.getId(), node.getClass());
426:                 }
427:                 FlowNodeWrapper wrappedNode = wrapNode(node, relationships.get(node.getId()));
428:                 // Assign parent.
429:                 FlowNodeWrapper parent = findParentNode(wrappedNode, wrappedNodeMap);
430:                 assignParent(wrappedNode, parent);
431:                 wrappedNodeMap.put(node.getId(), wrappedNode);
432:             }
433:         }
434: 
435:         /*
436:          * Returns the origin of any unhandled exception for this node, or null if none
437:          * found.
438:          */
439:         private @CheckForNull BlockEndNode<?> getUnhandledException(@NonNull FlowNode node) {
440:             // Check for an unhandled exception.
441:             ErrorAction errorAction = node.getAction(ErrorAction.class);
442:             // If this is a Jenkins failure exception, then we don't need to add a new node
443:             // - it will come from an existing step.
444:             if (errorAction != null && !PipelineNodeUtil.isJenkinsFailureException(errorAction.getError())) {
445:                 if (isDebugEnabled) {
```

## Status and timing for actual blocks

Timing/status computation uses the actual before/start/end/after chunk boundaries.

File: `src/main/java/io/jenkins/plugins/pipelinegraphview/treescanner/NodeRelationship.java`
SHA-256: `a8582f384213dc172c24710fcafc1ce5d8048d937c8510af63232a87b0c0cf72`

```text
89:     public @NonNull TimingInfo getTimingInfo(@NonNull WorkflowRun run) {
90:         long pause = PauseAction.getPauseDuration(this.start);
91:         if (isDebugEnabled) {
92:             logger.debug(
93:                     "Calculating Chunk Timing info start: {}, end: {} after: {}",
94:                     this.start.getId(),
95:                     this.end.getId(),
96:                     (this.after != null) ? this.after.getId() : "null");
97:         }
98:         TimingInfo timing = StatusAndTiming.computeChunkTiming(run, pause, this.start, this.end, this.after);
99:         if (timing != null) {
100:             return timing;
```

```text
108:     public @NonNull NodeRunStatus getStatus(WorkflowRun run) {
109:         boolean skippedStage = PipelineNodeUtil.isSkippedStage(start);
110:         if (skippedStage) {
111:             return new NodeRunStatus(BlueRun.BlueRunResult.NOT_BUILT, BlueRun.BlueRunState.SKIPPED);
112:         } else if (PipelineNodeUtil.isPaused(this.end)) {
113:             return new NodeRunStatus(BlueRun.BlueRunResult.UNKNOWN, BlueRun.BlueRunState.PAUSED);
114:         } else if (!PipelineNodeUtil.isActive(start) && PipelineNodeUtil.isStage(start)) {
115:             WarningAction warningAction = start.getPersistentAction(WarningAction.class);
116:             if (warningAction != null) {
117:                 return new NodeRunStatus(GenericStatus.fromResult(warningAction.getResult()));
118:             }
119:         }
120:         if (isDebugEnabled) {
121:             logger.debug(
122:                     "Calculating Chunk Status start: {}, end: {} after: {}",
123:                     this.start.getId(),
124:                     this.end.getId(),
125:                     (this.after != null) ? this.after.getId() : "null");
126:         }
127: 
128:         // If start and end are equal this is a StepNode
129:         if (this.start.getId().equals(this.end.getId())) {
130:             return new NodeRunStatus(this.start);
131:         }
132: 
133:         // Catch-all if none of the above are applicable.
134:         return new NodeRunStatus(
135:                 StatusAndTiming.computeChunkStatus2(run, this.before, this.start, this.end, this.after));
```

## Map server hierarchy

The server creates child lists from its mapped execution relationships.

File: `src/main/java/io/jenkins/plugins/pipelinegraphview/utils/PipelineGraphApi.java`
SHA-256: `d0c018f1a3af42b46a6b09a79efc1eaaeb1bca00dd485c59bbf8b41244a4d2c6`

```text
54:     private Function<String, PipelineStage> mapper(
55:             Map<String, PipelineStageInternal> stageMap, Map<String, List<String>> stageToChildrenMap) {
56:         String runUrl = run.getUrl();
57:         return id -> {
58:             List<String> orDefault = stageToChildrenMap.getOrDefault(id, emptyList());
59:             List<PipelineStage> children =
60:                     orDefault.stream().map(mapper(stageMap, stageToChildrenMap)).collect(Collectors.toList());
61:             return stageMap.get(id).toPipelineStage(children, runUrl);
62:         };
```

```text
102: 
103:         Map<String, List<String>> stageToChildrenMap = new HashMap<>();
104:         List<String> childNodes = new ArrayList<>();
105: 
106:         stages.forEach(stage -> {
107:             if (stage.getParents().isEmpty()) {
108:                 stageToChildrenMap.put(stage.getId(), new ArrayList<>());
109:             } else {
110:                 List<String> parentChildren =
111:                         stageToChildrenMap.getOrDefault(stage.getParents().get(0), new ArrayList<String>());
112:                 parentChildren.add(stage.getId());
113:                 childNodes.add(stage.getId());
114:                 stageToChildrenMap.put(stage.getParents().get(0), parentChildren);
115:             }
116:         });
117:         String runUrl = run.getUrl();
118:         List<PipelineStage> stageResults = stageMap.values().stream()
119:                 .map(pipelineStageInternal -> {
120:                     List<PipelineStage> children =
121:                             stageToChildrenMap.getOrDefault(pipelineStageInternal.getId(), emptyList()).stream()
122:                                     .map(mapper(stageMap, stageToChildrenMap))
123:                                     .collect(Collectors.toList());
124: 
125:                     return pipelineStageInternal.toPipelineStage(children, runUrl);
```

## Serve a permission-checked tree

The build action URL is stages; GET tree checks Item.READ and writes the graph.

File: `src/main/java/io/jenkins/plugins/pipelinegraphview/consoleview/PipelineConsoleViewAction.java`
SHA-256: `1c5ec8e52d7e3dacf0abc511d64445f8c56e113f0b4a50e12f702dccc983f957`

```text
51: import org.slf4j.Logger;
52: import org.slf4j.LoggerFactory;
53: 
54: public class PipelineConsoleViewAction extends Tab {
55:     public static final String URL_NAME = "stages";
56:     public static final int CACHE_AGE = (int) TimeUnit.DAYS.toSeconds(1);
```

```text
522:     @GET
523:     @WebMethod(name = "tree")
524:     public void getTree(StaplerRequest2 req, StaplerResponse2 rsp) throws IOException, ServletException {
525:         run.checkPermission(Item.READ);
526:         rsp.setStatus(200);
527:         rsp.setContentType("application/json;charset=UTF-8");
528:         setCache(rsp, true);
529:         if (PipelineGraphViewCache.get().tryServeTree(run, rsp.getOutputStream())) {
530:             return;
531:         }
532:         PipelineGraph tree = graphApi.createTree();
533:         setCache(rsp, tree.complete);
534:         PipelineJsonWriter.write(tree, rsp.getOutputStream());
535:     }
536: 
537:     // Icon related methods these may appear as unused but are used by /lib/hudson/buildCaption.jelly
538:     @SuppressWarnings("unused")
539:     public String getUrl() {
```

## JSON envelope

The browser consumes status=ok with data, not wfapi/runs as a tree.

File: `src/main/java/io/jenkins/plugins/pipelinegraphview/utils/PipelineJsonWriter.java`
SHA-256: `ff85d6cabc5c5d9deaa70c6a07fb04c56a2bd938a6611ba8943e26110f71349e`

```text
1: package io.jenkins.plugins.pipelinegraphview.utils;
2: 
3: import com.fasterxml.jackson.annotation.JsonAutoDetect;
4: import com.fasterxml.jackson.annotation.JsonInclude;
5: import java.io.OutputStream;
6: import java.util.Map;
7: import tools.jackson.databind.ObjectMapper;
8: import tools.jackson.databind.json.JsonMapper;
9: 
10: /**
11:  * Writes plugin DTOs to JSON via Jackson, wrapped in the Stapler {@code okJSON} envelope
12:  * ({@code {"status":"ok","data":...}}) that the frontend expects.
13:  *
14:  * <p>DTOs carry Jackson annotations to control the wire format — null values are omitted
15:  * (matching the historical bean-processor output) and fields are read regardless of visibility
16:  * so DTOs can keep package-private fields.
17:  */
18: public final class PipelineJsonWriter {
19: 
20:     private static final ObjectMapper MAPPER = JsonMapper.builder()
21:             .changeDefaultPropertyInclusion(inc -> inc.withValueInclusion(JsonInclude.Include.NON_NULL))
22:             .changeDefaultVisibility(v -> v.withFieldVisibility(JsonAutoDetect.Visibility.ANY))
23:             .build();
24: 
25:     private PipelineJsonWriter() {}
26: 
27:     public static void write(Object data, OutputStream out) {
28:         MAPPER.writeValue(out, Map.of("status", "ok", "data", data));
29:     }
30: }
```

## Collapsed badge state

The renderer aggregates a collapsed node and its real descendants. It must not be given guessed children.

File: `src/main/frontend/pipeline-graph-view/pipeline-graph/main/support/useCollapsedStages.ts`
SHA-256: `42084ed20dbb069b8f27e51805875aeeaec3d011e5130243a323cdbacf7d3a63`

```text
56:   [Result.unstable]: 1,
57:   [Result.aborted]: 2,
58:   [Result.paused]: 3,
59:   [Result.running]: 4,
60:   [Result.queued]: 5,
61:   [Result.not_built]: 6,
62:   [Result.skipped]: 7,
63:   [Result.success]: 8,
64:   [Result.unknown]: 9,
65: };
66: 
67: function worstState(a: Result, b: Result): Result {
68:   return (STATE_PRIORITY[a] ?? 9) <= (STATE_PRIORITY[b] ?? 9) ? a : b;
69: }
70: 
71: function isTransparentState(state: Result): boolean {
72:   return state === Result.skipped || state === Result.not_built;
73: }
74: 
75: function aggregateChildState(stage: StageInfo): Result {
76:   let all = stage.state;
77:   let nonTransparent: Result | null = isTransparentState(stage.state)
78:     ? null
79:     : stage.state;
80:   for (const child of stage.children) {
81:     const childState = aggregateChildState(child);
82:     all = worstState(all, childState);
83:     if (!isTransparentState(childState)) {
84:       nonTransparent =
85:         nonTransparent == null
86:           ? childState
87:           : worstState(nonTransparent, childState);
88:     }
89:   }
90:   return nonTransparent ?? all;
91: }
92: 
93: export function collapseSelectiveStages(
94:   stages: StageInfo[],
95:   collapsedIds: Set<number>,
96: ): StageInfo[] {
97:   return stages.map((stage) => {
98:     if (stage.children.length === 0) {
99:       return stage;
100:     }
101:     if (collapsedIds.has(stage.id)) {
102:       return {
103:         ...stage,
104:         children: [],
105:         collapsedChildCount: countLeafStages(stage),
106:         state: aggregateChildState(stage),
107:       };
108:     }
109:     return {
110:       ...stage,
111:       children: collapseSelectiveStages(stage.children, collapsedIds),
112:     };
113:   });
114: }
115: 
116: function countLeafStages(stage: StageInfo): number {
117:   if (stage.children.length === 0) {
118:     return 1;
119:   }
120:   return stage.children.reduce((sum, child) => sum + countLeafStages(child), 0);
121: }
122: 
123: export function collectParentStageIds(stages: StageInfo[]): Set<number> {
124:   const ids = new Set<number>();
125:   function walk(list: StageInfo[]) {
126:     for (const stage of list) {
127:       if (stage.children.length > 0) {
128:         ids.add(stage.id);
129:         walk(stage.children);
130:       }
131:     }
132:   }
133:   walk(stages);
134:   return ids;
135: }
136: 
137: /**
```

## Upstream Jenkinsfile nesting fixture

This is the upstream test fixture demonstrating real nested sequential stages, not the user's Jenkinsfile.

File: `src/test/resources/io/jenkins/plugins/pipelinegraphview/utils/nestedStages.jenkinsfile`
SHA-256: `3fa019e17d5ec6f0a1440db16e8e20f2b30ab4c85ddbb2737cb0b4653027dbf1`

```text
1: pipeline {
2:     agent any
3:     stages {
4:         stage("Parent") {
5:             stages {
6:                 stage ("Child A") {
7:                     steps {
8:                         echo "In child A"
9:                     }
10:                 }
11:                 stage ("Child B") {
12:                     stages {
13:                         stage("Grandchild B") {
14:                             steps {
15:                                 echo "In grandchild B"
16:                             }
17:                         }
18:                     }
19:                 }
20:                 stage ("Child C") {
21:                     stages {
22:                         stage("Grandchild C") {
23:                             stages {
24:                                 stage("Great-grandchild C") {
25:                                     steps {
26:                                         echo "In great-grandchild C"
27:                                     }
28:                                 }
29:                             }
30:                         }
31:                     }
32:                 }
33:             }
34:         }
35:     }
36: }
```

## Required architecture on an older controller

Jenkinsfile stage/stages/parallel -> executed FlowNodes and block boundaries ->
permission-checked server tree -> browser renderer. A frontend-only extension
cannot run the plugin's Java scanner in the browser. For exact semantics it needs
an existing compatible endpoint or an adapted server exporter. A hand-maintained
JSON group map or a regex parser of arbitrary Jenkinsfile/shared-library code is
not equivalent. No such exporter/backport is shipped in this revision.
