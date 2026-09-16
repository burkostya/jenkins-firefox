/* Pipeline Graph Local 0.3.0. Upstream tag 1013.v9f83fd83c063, MIT. React MIT. See LICENSES. */
(()=>{
"use strict";
const modules={
"src/content.tsx":function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mount_tsx_1 = require("src/mount.tsx");
try {
    (0, mount_tsx_1.mount)();
}
catch (e) {
    console.warn('Pipeline Graph Local:', e);
    throw e;
}

},
"src/mount.tsx":function(module,exports,require){
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mount = mount;
const jsx_runtime_1 = require("runtime/jsx-runtime.cjs");
const react_dom_1 = require("runtime/react-dom.cjs");
const App_tsx_1 = __importStar(require("src/App.tsx"));
const api_ts_1 = require("src/api.ts");
const shell_css_1 = __importDefault(require("src/shell.css"));
const upstream_css_1 = __importDefault(require("src/upstream.css"));
const ID = 'pipeline-graph-local-extension';
function mount(location = (0, api_ts_1.parseLocation)(window.location.href)) {
    const old = document.getElementById(ID);
    if (old) {
        old.dispatchEvent(new Event('pgvx-activate'));
        return;
    }
    const original = document.querySelector('.cbwf-stage-view') || document.querySelector('#main-panel #nodeGraph');
    const panel = document.querySelector('#main-panel') || document.querySelector('main') || document.body;
    const host = document.createElement('section');
    host.id = ID;
    host.setAttribute('aria-label', 'Pipeline Graph Local');
    // Jenkins job actions (JUnit trend, coverage, etc.) may float above Stage View.
    // Insert at the main-panel level and explicitly clear those floats. Inline
    // important rules keep page CSS and :host { all: initial } from undoing this.
    for (const [property, value] of Object.entries({ display: 'flow-root', clear: 'both', width: '100%',
        'min-width': '0', 'max-width': '100%', 'box-sizing': 'border-box', float: 'none' }))
        host.style.setProperty(property, value, 'important');
    let anchor = original;
    while (anchor && anchor.parentElement !== panel)
        anchor = anchor.parentElement;
    if (anchor && anchor !== panel)
        anchor.before(host);
    else
        panel.append(host);
    const shadow = host.attachShadow({ mode: 'open' });
    const css = shell_css_1.default + '\n' + upstream_css_1.default;
    try {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(css);
        shadow.adoptedStyleSheets = [sheet];
    }
    catch {
        const style = document.createElement('style');
        style.textContent = css;
        shadow.append(style);
    }
    const target = document.createElement('div'), portal = document.createElement('div');
    shadow.append(target, portal);
    const oldDisplay = original?.style.getPropertyValue('display') || '', oldPriority = original?.style.getPropertyPriority('display') || '';
    function showClassic(show) { if (!original)
        return; if (show) {
        if (oldDisplay)
            original.style.setProperty('display', oldDisplay, oldPriority);
        else
            original.style.removeProperty('display');
    }
    else
        original.style.setProperty('display', 'none', 'important'); }
    let closed = false;
    const root = (0, react_dom_1.createRoot)(target);
    function close() { if (closed)
        return; closed = true; showClassic(true); root.unmount(); host.remove(); window.removeEventListener('pagehide', close); }
    window.addEventListener('pagehide', close, { once: true });
    root.render((0, jsx_runtime_1.jsx)(App_tsx_1.ErrorBoundary, { onClose: close, children: (0, jsx_runtime_1.jsx)(App_tsx_1.default, { classicLabel: original?.id === 'nodeGraph' ? 'Original Pipeline Steps' : 'Original Stage View', location, portal, host, onClassic: showClassic, onClose: close }) }));
}

},
"runtime/jsx-runtime.cjs":function(module,exports,require){
const React = require("runtime/react.cjs");
exports.Fragment = React.Fragment;
exports.jsx = exports.jsxs = function(type, props, key) {
  return React.createElement(type, key === undefined ? props : {...props, key});
};

},
"runtime/react.cjs":function(module,exports,require){
/* React 18.2.0 / React DOM 18.2.0 / Scheduler 0.23.0. MIT. Copyright (c) Facebook, Inc. and its affiliates. See licenses/react-MIT.txt. */
((e,t)=>{var r=Symbol.for("react.element"),n=Symbol.for("react.portal"),o=Symbol.for("react.fragment"),u=Symbol.for("react.strict_mode"),a=Symbol.for("react.profiler"),c=Symbol.for("react.provider"),i=Symbol.for("react.context"),f=Symbol.for("react.forward_ref"),l=Symbol.for("react.suspense"),s=Symbol.for("react.memo"),p=Symbol.for("react.lazy"),y=Symbol.iterator;function d(e){if(null===e||"object"!==typeof e)return null;e=y&&e[y]||e["@@iterator"];return"function"===typeof e?e:null}var _={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},h=Object.assign,b={};function m(e,t,r){this.props=e;this.context=t;this.refs=b;this.updater=r||_}m.prototype.isReactComponent={};m.prototype.setState=function(e,t){if("object"!==typeof e&&"function"!==typeof e&&null!=e)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};m.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function v(){}v.prototype=m.prototype;function S(e,t,r){this.props=e;this.context=t;this.refs=b;this.updater=r||_}var k=S.prototype=new v;k.constructor=S;h(k,m.prototype);k.isPureReactComponent=!0;var w=Array.isArray,E=Object.prototype.hasOwnProperty,$={current:null},R={key:!0,ref:!0,__self:!0,__source:!0};function C(e,t,n){var o,u={},a=null,c=null;if(null!=t)for(o in void 0!==t.ref&&(c=t.ref),void 0!==t.key&&(a=""+t.key),t)E.call(t,o)&&!R.hasOwnProperty(o)&&(u[o]=t[o]);var i=arguments.length-2;if(1===i)u.children=n;else if(1<i){for(var f=Array(i),l=0;l<i;l++)f[l]=arguments[l+2];u.children=f}if(e&&e.defaultProps)for(o in i=e.defaultProps,i)void 0===u[o]&&(u[o]=i[o]);return{$$typeof:r,type:e,key:a,ref:c,props:u,_owner:$.current}}function j(e,t){return{$$typeof:r,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function g(e){return"object"===typeof e&&null!==e&&e.$$typeof===r}function O(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,(function(e){return t[e]}))}var x=/\/+/g;function P(e,t){return"object"===typeof e&&null!==e&&null!=e.key?O(""+e.key):t.toString(36)}function I(e,t,o,u,a){var c=typeof e;if("undefined"===c||"boolean"===c)e=null;var i=!1;if(null===e)i=!0;else switch(c){case"string":case"number":i=!0;break;case"object":switch(e.$$typeof){case r:case n:i=!0}}if(i)return i=e,a=a(i),e=""===u?"."+P(i,0):u,w(a)?(o="",null!=e&&(o=e.replace(x,"$&/")+"/"),I(a,t,o,"",(function(e){return e}))):null!=a&&(g(a)&&(a=j(a,o+(!a.key||i&&i.key===a.key?"":(""+a.key).replace(x,"$&/")+"/")+e)),t.push(a)),1;i=0;u=""===u?".":u+":";if(w(e))for(var f=0;f<e.length;f++){c=e[f];var l=u+P(c,f);i+=I(c,t,o,l,a)}else if(l=d(e),"function"===typeof l)for(e=l.call(e),f=0;!(c=e.next()).done;)c=c.value,l=u+P(c,f++),i+=I(c,t,o,l,a);else if("object"===c)throw t=String(e),Error("Objects are not valid as a React child (found: "+("[object Object]"===t?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return i}function T(e,t,r){if(null==e)return e;var n=[],o=0;I(e,n,"","",(function(e){return t.call(r,e,o++)}));return n}function V(e){if(-1===e._status){var t=e._result;t=t();t.then((function(t){if(0===e._status||-1===e._status)e._status=1,e._result=t}),(function(t){if(0===e._status||-1===e._status)e._status=2,e._result=t}));-1===e._status&&(e._status=0,e._result=t)}if(1===e._status)return e._result.default;throw e._result}var A={current:null},D={transition:null},U={ReactCurrentDispatcher:A,ReactCurrentBatchConfig:D,ReactCurrentOwner:$};t.Children={map:T,forEach:function(e,t,r){T(e,(function(){t.apply(this,arguments)}),r)},count:function(e){var t=0;T(e,(function(){t++}));return t},toArray:function(e){return T(e,(function(e){return e}))||[]},only:function(e){if(!g(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};t.Component=m;t.Fragment=o;t.Profiler=a;t.PureComponent=S;t.StrictMode=u;t.Suspense=l;t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=U;t.cloneElement=function(e,t,n){if(null===e||void 0===e)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var o=h({},e.props),u=e.key,a=e.ref,c=e._owner;if(null!=t){void 0!==t.ref&&(a=t.ref,c=$.current);void 0!==t.key&&(u=""+t.key);if(e.type&&e.type.defaultProps)var i=e.type.defaultProps;for(f in t)E.call(t,f)&&!R.hasOwnProperty(f)&&(o[f]=void 0===t[f]&&void 0!==i?i[f]:t[f])}var f=arguments.length-2;if(1===f)o.children=n;else if(1<f){i=Array(f);for(var l=0;l<f;l++)i[l]=arguments[l+2];o.children=i}return{$$typeof:r,type:e.type,key:u,ref:a,props:o,_owner:c}};t.createContext=function(e){e={$$typeof:i,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null};e.Provider={$$typeof:c,_context:e};return e.Consumer=e};t.createElement=C;t.createFactory=function(e){var t=C.bind(null,e);t.type=e;return t};t.createRef=function(){return{current:null}};t.forwardRef=function(e){return{$$typeof:f,render:e}};t.isValidElement=g;t.lazy=function(e){return{$$typeof:p,_payload:{_status:-1,_result:e},_init:V}};t.memo=function(e,t){return{$$typeof:s,type:e,compare:void 0===t?null:t}};t.startTransition=function(e){var t=D.transition;D.transition={};try{e()}finally{D.transition=t}};t.unstable_act=function(){throw Error("act(...) is not supported in production builds of React.")};t.useCallback=function(e,t){return A.current.useCallback(e,t)};t.useContext=function(e){return A.current.useContext(e)};t.useDebugValue=function(){};t.useDeferredValue=function(e){return A.current.useDeferredValue(e)};t.useEffect=function(e,t){return A.current.useEffect(e,t)};t.useId=function(){return A.current.useId()};t.useImperativeHandle=function(e,t,r){return A.current.useImperativeHandle(e,t,r)};t.useInsertionEffect=function(e,t){return A.current.useInsertionEffect(e,t)};t.useLayoutEffect=function(e,t){return A.current.useLayoutEffect(e,t)};t.useMemo=function(e,t){return A.current.useMemo(e,t)};t.useReducer=function(e,t,r){return A.current.useReducer(e,t,r)};t.useRef=function(e){return A.current.useRef(e)};t.useState=function(e){return A.current.useState(e)};t.useSyncExternalStore=function(e,t,r){return A.current.useSyncExternalStore(e,t,r)};t.useTransition=function(){return A.current.useTransition()};t.version="18.2.0"})(module, exports);

},
"runtime/react-dom.cjs":function(module,exports,require){
/* React 18.2.0 / React DOM 18.2.0 / Scheduler 0.23.0. MIT. Copyright (c) Facebook, Inc. and its affiliates. See licenses/react-MIT.txt. */
((e,n,t)=>{var r=t(44914),l=t(69982);function a(e){for(var n="https://reactjs.org/docs/error-decoder.html?invariant="+e,t=1;t<arguments.length;t++)n+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+e+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var u=new Set,i={};function o(e,n){s(e,n);s(e+"Capture",n)}function s(e,n){i[e]=n;for(e=0;e<n.length;e++)u.add(n[e])}var c=!("undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement),f=Object.prototype.hasOwnProperty,d=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,p={},m={};function h(e){if(f.call(m,e))return!0;if(f.call(p,e))return!1;if(d.test(e))return m[e]=!0;p[e]=!0;return!1}function g(e,n,t,r){if(null!==t&&0===t.type)return!1;switch(typeof n){case"function":case"symbol":return!0;case"boolean":if(r)return!1;if(null!==t)return!t.acceptsBooleans;e=e.toLowerCase().slice(0,5);return"data-"!==e&&"aria-"!==e;default:return!1}}function v(e,n,t,r){if(null===n||"undefined"===typeof n||g(e,n,t,r))return!0;if(r)return!1;if(null!==t)switch(t.type){case 3:return!n;case 4:return!1===n;case 5:return isNaN(n);case 6:return isNaN(n)||1>n}return!1}function y(e,n,t,r,l,a,u){this.acceptsBooleans=2===n||3===n||4===n;this.attributeName=r;this.attributeNamespace=l;this.mustUseProperty=t;this.propertyName=e;this.type=n;this.sanitizeURL=a;this.removeEmptyString=u}var b={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach((function(e){b[e]=new y(e,0,!1,e,null,!1,!1)}));[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach((function(e){var n=e[0];b[n]=new y(n,1,!1,e[1],null,!1,!1)}));["contentEditable","draggable","spellCheck","value"].forEach((function(e){b[e]=new y(e,2,!1,e.toLowerCase(),null,!1,!1)}));["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach((function(e){b[e]=new y(e,2,!1,e,null,!1,!1)}));"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach((function(e){b[e]=new y(e,3,!1,e.toLowerCase(),null,!1,!1)}));["checked","multiple","muted","selected"].forEach((function(e){b[e]=new y(e,3,!0,e,null,!1,!1)}));["capture","download"].forEach((function(e){b[e]=new y(e,4,!1,e,null,!1,!1)}));["cols","rows","size","span"].forEach((function(e){b[e]=new y(e,6,!1,e,null,!1,!1)}));["rowSpan","start"].forEach((function(e){b[e]=new y(e,5,!1,e.toLowerCase(),null,!1,!1)}));var k=/[\-:]([a-z])/g;function w(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach((function(e){var n=e.replace(k,w);b[n]=new y(n,1,!1,e,null,!1,!1)}));"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach((function(e){var n=e.replace(k,w);b[n]=new y(n,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}));["xml:base","xml:lang","xml:space"].forEach((function(e){var n=e.replace(k,w);b[n]=new y(n,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}));["tabIndex","crossOrigin"].forEach((function(e){b[e]=new y(e,1,!1,e.toLowerCase(),null,!1,!1)}));b.xlinkHref=new y("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach((function(e){b[e]=new y(e,1,!1,e.toLowerCase(),null,!0,!0)}));function S(e,n,t,r){var l=b.hasOwnProperty(n)?b[n]:null;if(null!==l?0!==l.type:r||!(2<n.length)||"o"!==n[0]&&"O"!==n[0]||"n"!==n[1]&&"N"!==n[1])v(n,t,l,r)&&(t=null),r||null===l?h(n)&&(null===t?e.removeAttribute(n):e.setAttribute(n,""+t)):l.mustUseProperty?e[l.propertyName]=null===t?3===l.type?!1:"":t:(n=l.attributeName,r=l.attributeNamespace,null===t?e.removeAttribute(n):(l=l.type,t=3===l||4===l&&!0===t?"":""+t,r?e.setAttributeNS(r,n,t):e.setAttribute(n,t)))}var x=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,E=Symbol.for("react.element"),C=Symbol.for("react.portal"),_=Symbol.for("react.fragment"),N=Symbol.for("react.strict_mode"),z=Symbol.for("react.profiler"),P=Symbol.for("react.provider"),T=Symbol.for("react.context"),L=Symbol.for("react.forward_ref"),M=Symbol.for("react.suspense"),F=Symbol.for("react.suspense_list"),D=Symbol.for("react.memo"),R=Symbol.for("react.lazy");Symbol.for("react.scope");Symbol.for("react.debug_trace_mode");var O=Symbol.for("react.offscreen");Symbol.for("react.legacy_hidden");Symbol.for("react.cache");Symbol.for("react.tracing_marker");var I=Symbol.iterator;function U(e){if(null===e||"object"!==typeof e)return null;e=I&&e[I]||e["@@iterator"];return"function"===typeof e?e:null}var V=Object.assign,A;function B(e){if(void 0===A)try{throw Error()}catch(t){var n=t.stack.trim().match(/\n( *(at )?)/);A=n&&n[1]||""}return"\n"+A+e}var H=!1;function W(e,n){if(!e||H)return"";H=!0;var t=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(n)if(n=function(){throw Error()},Object.defineProperty(n.prototype,"props",{set:function(){throw Error()}}),"object"===typeof Reflect&&Reflect.construct){try{Reflect.construct(n,[])}catch(s){var r=s}Reflect.construct(e,[],n)}else{try{n.call()}catch(s){r=s}e.call(n.prototype)}else{try{throw Error()}catch(s){r=s}e()}}catch(s){if(s&&r&&"string"===typeof s.stack){for(var l=s.stack.split("\n"),a=r.stack.split("\n"),u=l.length-1,i=a.length-1;1<=u&&0<=i&&l[u]!==a[i];)i--;for(;1<=u&&0<=i;u--,i--)if(l[u]!==a[i]){if(1!==u||1!==i){do{if(u--,i--,0>i||l[u]!==a[i]){var o="\n"+l[u].replace(" at new "," at ");e.displayName&&o.includes("<anonymous>")&&(o=o.replace("<anonymous>",e.displayName));return o}}while(1<=u&&0<=i)}break}}}finally{H=!1,Error.prepareStackTrace=t}return(e=e?e.displayName||e.name:"")?B(e):""}function Q(e){switch(e.tag){case 5:return B(e.type);case 16:return B("Lazy");case 13:return B("Suspense");case 19:return B("SuspenseList");case 0:case 2:case 15:return e=W(e.type,!1),e;case 11:return e=W(e.type.render,!1),e;case 1:return e=W(e.type,!0),e;default:return""}}function j(e){if(null==e)return null;if("function"===typeof e)return e.displayName||e.name||null;if("string"===typeof e)return e;switch(e){case _:return"Fragment";case C:return"Portal";case z:return"Profiler";case N:return"StrictMode";case M:return"Suspense";case F:return"SuspenseList"}if("object"===typeof e)switch(e.$$typeof){case T:return(e.displayName||"Context")+".Consumer";case P:return(e._context.displayName||"Context")+".Provider";case L:var n=e.render;e=e.displayName;e||(e=n.displayName||n.name||"",e=""!==e?"ForwardRef("+e+")":"ForwardRef");return e;case D:return n=e.displayName||null,null!==n?n:j(e.type)||"Memo";case R:n=e._payload;e=e._init;try{return j(e(n))}catch(t){}}return null}function $(e){var n=e.type;switch(e.tag){case 24:return"Cache";case 9:return(n.displayName||"Context")+".Consumer";case 10:return(n._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=n.render,e=e.displayName||e.name||"",n.displayName||(""!==e?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return n;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return j(n);case 8:return n===N?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if("function"===typeof n)return n.displayName||n.name||null;if("string"===typeof n)return n}return null}function K(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function q(e){var n=e.type;return(e=e.nodeName)&&"input"===e.toLowerCase()&&("checkbox"===n||"radio"===n)}function Y(e){var n=q(e)?"checked":"value",t=Object.getOwnPropertyDescriptor(e.constructor.prototype,n),r=""+e[n];if(!e.hasOwnProperty(n)&&"undefined"!==typeof t&&"function"===typeof t.get&&"function"===typeof t.set){var l=t.get,a=t.set;Object.defineProperty(e,n,{configurable:!0,get:function(){return l.call(this)},set:function(e){r=""+e;a.call(this,e)}});Object.defineProperty(e,n,{enumerable:t.enumerable});return{getValue:function(){return r},setValue:function(e){r=""+e},stopTracking:function(){e._valueTracker=null;delete e[n]}}}}function X(e){e._valueTracker||(e._valueTracker=Y(e))}function G(e){if(!e)return!1;var n=e._valueTracker;if(!n)return!0;var t=n.getValue();var r="";e&&(r=q(e)?e.checked?"true":"false":e.value);e=r;return e!==t?(n.setValue(e),!0):!1}function Z(e){e=e||("undefined"!==typeof document?document:void 0);if("undefined"===typeof e)return null;try{return e.activeElement||e.body}catch(n){return e.body}}function J(e,n){var t=n.checked;return V({},n,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=t?t:e._wrapperState.initialChecked})}function ee(e,n){var t=null==n.defaultValue?"":n.defaultValue,r=null!=n.checked?n.checked:n.defaultChecked;t=K(null!=n.value?n.value:t);e._wrapperState={initialChecked:r,initialValue:t,controlled:"checkbox"===n.type||"radio"===n.type?null!=n.checked:null!=n.value}}function ne(e,n){n=n.checked;null!=n&&S(e,"checked",n,!1)}function te(e,n){ne(e,n);var t=K(n.value),r=n.type;if(null!=t)if("number"===r){if(0===t&&""===e.value||e.value!=t)e.value=""+t}else e.value!==""+t&&(e.value=""+t);else if("submit"===r||"reset"===r){e.removeAttribute("value");return}n.hasOwnProperty("value")?le(e,n.type,t):n.hasOwnProperty("defaultValue")&&le(e,n.type,K(n.defaultValue));null==n.checked&&null!=n.defaultChecked&&(e.defaultChecked=!!n.defaultChecked)}function re(e,n,t){if(n.hasOwnProperty("value")||n.hasOwnProperty("defaultValue")){var r=n.type;if(!("submit"!==r&&"reset"!==r||void 0!==n.value&&null!==n.value))return;n=""+e._wrapperState.initialValue;t||n===e.value||(e.value=n);e.defaultValue=n}t=e.name;""!==t&&(e.name="");e.defaultChecked=!!e._wrapperState.initialChecked;""!==t&&(e.name=t)}function le(e,n,t){if("number"!==n||Z(e.ownerDocument)!==e)null==t?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+t&&(e.defaultValue=""+t)}var ae=Array.isArray;function ue(e,n,t,r){e=e.options;if(n){n={};for(var l=0;l<t.length;l++)n["$"+t[l]]=!0;for(t=0;t<e.length;t++)l=n.hasOwnProperty("$"+e[t].value),e[t].selected!==l&&(e[t].selected=l),l&&r&&(e[t].defaultSelected=!0)}else{t=""+K(t);n=null;for(l=0;l<e.length;l++){if(e[l].value===t){e[l].selected=!0;r&&(e[l].defaultSelected=!0);return}null!==n||e[l].disabled||(n=e[l])}null!==n&&(n.selected=!0)}}function ie(e,n){if(null!=n.dangerouslySetInnerHTML)throw Error(a(91));return V({},n,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function oe(e,n){var t=n.value;if(null==t){t=n.children;n=n.defaultValue;if(null!=t){if(null!=n)throw Error(a(92));if(ae(t)){if(1<t.length)throw Error(a(93));t=t[0]}n=t}null==n&&(n="");t=n}e._wrapperState={initialValue:K(t)}}function se(e,n){var t=K(n.value),r=K(n.defaultValue);null!=t&&(t=""+t,t!==e.value&&(e.value=t),null==n.defaultValue&&e.defaultValue!==t&&(e.defaultValue=t));null!=r&&(e.defaultValue=""+r)}function ce(e){var n=e.textContent;n===e._wrapperState.initialValue&&""!==n&&null!==n&&(e.value=n)}function fe(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function de(e,n){return null==e||"http://www.w3.org/1999/xhtml"===e?fe(n):"http://www.w3.org/2000/svg"===e&&"foreignObject"===n?"http://www.w3.org/1999/xhtml":e}var pe,me=function(e){return"undefined"!==typeof MSApp&&MSApp.execUnsafeLocalFunction?function(n,t,r,l){MSApp.execUnsafeLocalFunction((function(){return e(n,t,r,l)}))}:e}((function(e,n){if("http://www.w3.org/2000/svg"!==e.namespaceURI||"innerHTML"in e)e.innerHTML=n;else{pe=pe||document.createElement("div");pe.innerHTML="<svg>"+n.valueOf().toString()+"</svg>";for(n=pe.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;n.firstChild;)e.appendChild(n.firstChild)}}));function he(e,n){if(n){var t=e.firstChild;if(t&&t===e.lastChild&&3===t.nodeType){t.nodeValue=n;return}}e.textContent=n}var ge={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},ve=["Webkit","ms","Moz","O"];Object.keys(ge).forEach((function(e){ve.forEach((function(n){n=n+e.charAt(0).toUpperCase()+e.substring(1);ge[n]=ge[e]}))}));function ye(e,n,t){return null==n||"boolean"===typeof n||""===n?"":t||"number"!==typeof n||0===n||ge.hasOwnProperty(e)&&ge[e]?(""+n).trim():n+"px"}function be(e,n){e=e.style;for(var t in n)if(n.hasOwnProperty(t)){var r=0===t.indexOf("--"),l=ye(t,n[t],r);"float"===t&&(t="cssFloat");r?e.setProperty(t,l):e[t]=l}}var ke=V({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function we(e,n){if(n){if(ke[e]&&(null!=n.children||null!=n.dangerouslySetInnerHTML))throw Error(a(137,e));if(null!=n.dangerouslySetInnerHTML){if(null!=n.children)throw Error(a(60));if("object"!==typeof n.dangerouslySetInnerHTML||!("__html"in n.dangerouslySetInnerHTML))throw Error(a(61))}if(null!=n.style&&"object"!==typeof n.style)throw Error(a(62))}}function Se(e,n){if(-1===e.indexOf("-"))return"string"===typeof n.is;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var xe=null;function Ee(e){e=e.target||e.srcElement||window;e.correspondingUseElement&&(e=e.correspondingUseElement);return 3===e.nodeType?e.parentNode:e}var Ce=null,_e=null,Ne=null;function ze(e){if(e=Bl(e)){if("function"!==typeof Ce)throw Error(a(280));var n=e.stateNode;n&&(n=Wl(n),Ce(e.stateNode,e.type,n))}}function Pe(e){_e?Ne?Ne.push(e):Ne=[e]:_e=e}function Te(){if(_e){var e=_e,n=Ne;Ne=_e=null;ze(e);if(n)for(e=0;e<n.length;e++)ze(n[e])}}function Le(e,n){return e(n)}function Me(){}var Fe=!1;function De(e,n,t){if(Fe)return e(n,t);Fe=!0;try{return Le(e,n,t)}finally{if(Fe=!1,null!==_e||null!==Ne)Me(),Te()}}function Re(e,n){var t=e.stateNode;if(null===t)return null;var r=Wl(t);if(null===r)return null;t=r[n];e:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!("button"===e||"input"===e||"select"===e||"textarea"===e));e=!r;break e;default:e=!1}if(e)return null;if(t&&"function"!==typeof t)throw Error(a(231,n,typeof t));return t}var Oe=!1;if(c)try{var Ie={};Object.defineProperty(Ie,"passive",{get:function(){Oe=!0}});window.addEventListener("test",Ie,Ie);window.removeEventListener("test",Ie,Ie)}catch(Ic){Oe=!1}function Ue(e,n,t,r,l,a,u,i,o){var s=Array.prototype.slice.call(arguments,3);try{n.apply(t,s)}catch(c){this.onError(c)}}var Ve=!1,Ae=null,Be=!1,He=null,We={onError:function(e){Ve=!0;Ae=e}};function Qe(e,n,t,r,l,a,u,i,o){Ve=!1;Ae=null;Ue.apply(We,arguments)}function je(e,n,t,r,l,u,i,o,s){Qe.apply(this,arguments);if(Ve){if(Ve){var c=Ae;Ve=!1;Ae=null}else throw Error(a(198));Be||(Be=!0,He=c)}}function $e(e){var n=e,t=e;if(e.alternate)for(;n.return;)n=n.return;else{e=n;do{n=e,0!==(n.flags&4098)&&(t=n.return),e=n.return}while(e)}return 3===n.tag?t:null}function Ke(e){if(13===e.tag){var n=e.memoizedState;null===n&&(e=e.alternate,null!==e&&(n=e.memoizedState));if(null!==n)return n.dehydrated}return null}function qe(e){if($e(e)!==e)throw Error(a(188))}function Ye(e){var n=e.alternate;if(!n){n=$e(e);if(null===n)throw Error(a(188));return n!==e?null:e}for(var t=e,r=n;;){var l=t.return;if(null===l)break;var u=l.alternate;if(null===u){r=l.return;if(null!==r){t=r;continue}break}if(l.child===u.child){for(u=l.child;u;){if(u===t)return qe(l),e;if(u===r)return qe(l),n;u=u.sibling}throw Error(a(188))}if(t.return!==r.return)t=l,r=u;else{for(var i=!1,o=l.child;o;){if(o===t){i=!0;t=l;r=u;break}if(o===r){i=!0;r=l;t=u;break}o=o.sibling}if(!i){for(o=u.child;o;){if(o===t){i=!0;t=u;r=l;break}if(o===r){i=!0;r=u;t=l;break}o=o.sibling}if(!i)throw Error(a(189))}}if(t.alternate!==r)throw Error(a(190))}if(3!==t.tag)throw Error(a(188));return t.stateNode.current===t?e:n}function Xe(e){e=Ye(e);return null!==e?Ge(e):null}function Ge(e){if(5===e.tag||6===e.tag)return e;for(e=e.child;null!==e;){var n=Ge(e);if(null!==n)return n;e=e.sibling}return null}var Ze=l.unstable_scheduleCallback,Je=l.unstable_cancelCallback,en=l.unstable_shouldYield,nn=l.unstable_requestPaint,tn=l.unstable_now,rn=l.unstable_getCurrentPriorityLevel,ln=l.unstable_ImmediatePriority,an=l.unstable_UserBlockingPriority,un=l.unstable_NormalPriority,on=l.unstable_LowPriority,sn=l.unstable_IdlePriority,cn=null,fn=null;function dn(e){if(fn&&"function"===typeof fn.onCommitFiberRoot)try{fn.onCommitFiberRoot(cn,e,void 0,128===(e.current.flags&128))}catch(n){}}var pn=Math.clz32?Math.clz32:gn,mn=Math.log,hn=Math.LN2;function gn(e){e>>>=0;return 0===e?32:31-(mn(e)/hn|0)|0}var vn=64,yn=4194304;function bn(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function kn(e,n){var t=e.pendingLanes;if(0===t)return 0;var r=0,l=e.suspendedLanes,a=e.pingedLanes,u=t&268435455;if(0!==u){var i=u&~l;0!==i?r=bn(i):(a&=u,0!==a&&(r=bn(a)))}else u=t&~l,0!==u?r=bn(u):0!==a&&(r=bn(a));if(0===r)return 0;if(0!==n&&n!==r&&0===(n&l)&&(l=r&-r,a=n&-n,l>=a||16===l&&0!==(a&4194240)))return n;0!==(r&4)&&(r|=t&16);n=e.entangledLanes;if(0!==n)for(e=e.entanglements,n&=r;0<n;)t=31-pn(n),l=1<<t,r|=e[t],n&=~l;return r}function wn(e,n){switch(e){case 1:case 2:case 4:return n+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Sn(e,n){for(var t=e.suspendedLanes,r=e.pingedLanes,l=e.expirationTimes,a=e.pendingLanes;0<a;){var u=31-pn(a),i=1<<u,o=l[u];if(-1===o){if(0===(i&t)||0!==(i&r))l[u]=wn(i,n)}else o<=n&&(e.expiredLanes|=i);a&=~i}}function xn(e){e=e.pendingLanes&-1073741825;return 0!==e?e:e&1073741824?1073741824:0}function En(){var e=vn;vn<<=1;0===(vn&4194240)&&(vn=64);return e}function Cn(e){for(var n=[],t=0;31>t;t++)n.push(e);return n}function _n(e,n,t){e.pendingLanes|=n;536870912!==n&&(e.suspendedLanes=0,e.pingedLanes=0);e=e.eventTimes;n=31-pn(n);e[n]=t}function Nn(e,n){var t=e.pendingLanes&~n;e.pendingLanes=n;e.suspendedLanes=0;e.pingedLanes=0;e.expiredLanes&=n;e.mutableReadLanes&=n;e.entangledLanes&=n;n=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<t;){var l=31-pn(t),a=1<<l;n[l]=0;r[l]=-1;e[l]=-1;t&=~a}}function zn(e,n){var t=e.entangledLanes|=n;for(e=e.entanglements;t;){var r=31-pn(t),l=1<<r;l&n|e[r]&n&&(e[r]|=n);t&=~l}}var Pn=0;function Tn(e){e&=-e;return 1<e?4<e?0!==(e&268435455)?16:536870912:4:1}var Ln,Mn,Fn,Dn,Rn,On=!1,In=[],Un=null,Vn=null,An=null,Bn=new Map,Hn=new Map,Wn=[],Qn="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function jn(e,n){switch(e){case"focusin":case"focusout":Un=null;break;case"dragenter":case"dragleave":Vn=null;break;case"mouseover":case"mouseout":An=null;break;case"pointerover":case"pointerout":Bn.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":Hn.delete(n.pointerId)}}function $n(e,n,t,r,l,a){if(null===e||e.nativeEvent!==a)return e={blockedOn:n,domEventName:t,eventSystemFlags:r,nativeEvent:a,targetContainers:[l]},null!==n&&(n=Bl(n),null!==n&&Mn(n)),e;e.eventSystemFlags|=r;n=e.targetContainers;null!==l&&-1===n.indexOf(l)&&n.push(l);return e}function Kn(e,n,t,r,l){switch(n){case"focusin":return Un=$n(Un,e,n,t,r,l),!0;case"dragenter":return Vn=$n(Vn,e,n,t,r,l),!0;case"mouseover":return An=$n(An,e,n,t,r,l),!0;case"pointerover":var a=l.pointerId;Bn.set(a,$n(Bn.get(a)||null,e,n,t,r,l));return!0;case"gotpointercapture":return a=l.pointerId,Hn.set(a,$n(Hn.get(a)||null,e,n,t,r,l)),!0}return!1}function qn(e){var n=Al(e.target);if(null!==n){var t=$e(n);if(null!==t)if(n=t.tag,13===n){if(n=Ke(t),null!==n){e.blockedOn=n;Rn(e.priority,(function(){Fn(t)}));return}}else if(3===n&&t.stateNode.current.memoizedState.isDehydrated){e.blockedOn=3===t.tag?t.stateNode.containerInfo:null;return}}e.blockedOn=null}function Yn(e){if(null!==e.blockedOn)return!1;for(var n=e.targetContainers;0<n.length;){var t=ut(e.domEventName,e.eventSystemFlags,n[0],e.nativeEvent);if(null===t){t=e.nativeEvent;var r=new t.constructor(t.type,t);xe=r;t.target.dispatchEvent(r);xe=null}else return n=Bl(t),null!==n&&Mn(n),e.blockedOn=t,!1;n.shift()}return!0}function Xn(e,n,t){Yn(e)&&t.delete(n)}function Gn(){On=!1;null!==Un&&Yn(Un)&&(Un=null);null!==Vn&&Yn(Vn)&&(Vn=null);null!==An&&Yn(An)&&(An=null);Bn.forEach(Xn);Hn.forEach(Xn)}function Zn(e,n){e.blockedOn===n&&(e.blockedOn=null,On||(On=!0,l.unstable_scheduleCallback(l.unstable_NormalPriority,Gn)))}function Jn(e){function n(n){return Zn(n,e)}if(0<In.length){Zn(In[0],e);for(var t=1;t<In.length;t++){var r=In[t];r.blockedOn===e&&(r.blockedOn=null)}}null!==Un&&Zn(Un,e);null!==Vn&&Zn(Vn,e);null!==An&&Zn(An,e);Bn.forEach(n);Hn.forEach(n);for(t=0;t<Wn.length;t++)r=Wn[t],r.blockedOn===e&&(r.blockedOn=null);for(;0<Wn.length&&(t=Wn[0],null===t.blockedOn);)qn(t),null===t.blockedOn&&Wn.shift()}var et=x.ReactCurrentBatchConfig,nt=!0;function tt(e,n,t,r){var l=Pn,a=et.transition;et.transition=null;try{Pn=1,lt(e,n,t,r)}finally{Pn=l,et.transition=a}}function rt(e,n,t,r){var l=Pn,a=et.transition;et.transition=null;try{Pn=4,lt(e,n,t,r)}finally{Pn=l,et.transition=a}}function lt(e,n,t,r){if(nt){var l=ut(e,n,t,r);if(null===l)dl(e,n,r,at,t),jn(e,r);else if(Kn(l,e,n,t,r))r.stopPropagation();else if(jn(e,r),n&4&&-1<Qn.indexOf(e)){for(;null!==l;){var a=Bl(l);null!==a&&Ln(a);a=ut(e,n,t,r);null===a&&dl(e,n,r,at,t);if(a===l)break;l=a}null!==l&&r.stopPropagation()}else dl(e,n,r,null,t)}}var at=null;function ut(e,n,t,r){at=null;e=Ee(r);e=Al(e);if(null!==e)if(n=$e(e),null===n)e=null;else if(t=n.tag,13===t){e=Ke(n);if(null!==e)return e;e=null}else if(3===t){if(n.stateNode.current.memoizedState.isDehydrated)return 3===n.tag?n.stateNode.containerInfo:null;e=null}else n!==e&&(e=null);at=e;return null}function it(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(rn()){case ln:return 1;case an:return 4;case un:case on:return 16;case sn:return 536870912;default:return 16}default:return 16}}var ot=null,st=null,ct=null;function ft(){if(ct)return ct;var e,n=st,t=n.length,r,l="value"in ot?ot.value:ot.textContent,a=l.length;for(e=0;e<t&&n[e]===l[e];e++);var u=t-e;for(r=1;r<=u&&n[t-r]===l[a-r];r++);return ct=l.slice(e,1<r?1-r:void 0)}function dt(e){var n=e.keyCode;"charCode"in e?(e=e.charCode,0===e&&13===n&&(e=13)):e=n;10===e&&(e=13);return 32<=e||13===e?e:0}function pt(){return!0}function mt(){return!1}function ht(e){function n(n,t,r,l,a){this._reactName=n;this._targetInst=r;this.type=t;this.nativeEvent=l;this.target=a;this.currentTarget=null;for(var u in e)e.hasOwnProperty(u)&&(n=e[u],this[u]=n?n(l):l[u]);this.isDefaultPrevented=(null!=l.defaultPrevented?l.defaultPrevented:!1===l.returnValue)?pt:mt;this.isPropagationStopped=mt;return this}V(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():"unknown"!==typeof e.returnValue&&(e.returnValue=!1),this.isDefaultPrevented=pt)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():"unknown"!==typeof e.cancelBubble&&(e.cancelBubble=!0),this.isPropagationStopped=pt)},persist:function(){},isPersistent:pt});return n}var gt={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},vt=ht(gt),yt=V({},gt,{view:0,detail:0}),bt=ht(yt),kt,wt,St,xt=V({},yt,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Vt,button:0,buttons:0,relatedTarget:function(e){return void 0===e.relatedTarget?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){if("movementX"in e)return e.movementX;e!==St&&(St&&"mousemove"===e.type?(kt=e.screenX-St.screenX,wt=e.screenY-St.screenY):wt=kt=0,St=e);return kt},movementY:function(e){return"movementY"in e?e.movementY:wt}}),Et=ht(xt),Ct=V({},xt,{dataTransfer:0}),_t=ht(Ct),Nt=V({},yt,{relatedTarget:0}),zt=ht(Nt),Pt=V({},gt,{animationName:0,elapsedTime:0,pseudoElement:0}),Tt=ht(Pt),Lt=V({},gt,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Mt=ht(Lt),Ft=V({},gt,{data:0}),Dt=ht(Ft),Rt={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Ot={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},It={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Ut(e){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(e):(e=It[e])?!!n[e]:!1}function Vt(){return Ut}var At=V({},yt,{key:function(e){if(e.key){var n=Rt[e.key]||e.key;if("Unidentified"!==n)return n}return"keypress"===e.type?(e=dt(e),13===e?"Enter":String.fromCharCode(e)):"keydown"===e.type||"keyup"===e.type?Ot[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Vt,charCode:function(e){return"keypress"===e.type?dt(e):0},keyCode:function(e){return"keydown"===e.type||"keyup"===e.type?e.keyCode:0},which:function(e){return"keypress"===e.type?dt(e):"keydown"===e.type||"keyup"===e.type?e.keyCode:0}}),Bt=ht(At),Ht=V({},xt,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Wt=ht(Ht),Qt=V({},yt,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Vt}),jt=ht(Qt),$t=V({},gt,{propertyName:0,elapsedTime:0,pseudoElement:0}),Kt=ht($t),qt=V({},xt,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Yt=ht(qt),Xt=[9,13,27,32],Gt=c&&"CompositionEvent"in window,Zt=null;c&&"documentMode"in document&&(Zt=document.documentMode);var Jt=c&&"TextEvent"in window&&!Zt,er=c&&(!Gt||Zt&&8<Zt&&11>=Zt),nr=String.fromCharCode(32),tr=!1;function rr(e,n){switch(e){case"keyup":return-1!==Xt.indexOf(n.keyCode);case"keydown":return 229!==n.keyCode;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function lr(e){e=e.detail;return"object"===typeof e&&"data"in e?e.data:null}var ar=!1;function ur(e,n){switch(e){case"compositionend":return lr(n);case"keypress":if(32!==n.which)return null;tr=!0;return nr;case"textInput":return e=n.data,e===nr&&tr?null:e;default:return null}}function ir(e,n){if(ar)return"compositionend"===e||!Gt&&rr(e,n)?(e=ft(),ct=st=ot=null,ar=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return er&&"ko"!==n.locale?null:n.data;default:return null}}var or={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function sr(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return"input"===n?!!or[e.type]:"textarea"===n?!0:!1}function cr(e,n,t,r){Pe(r);n=ml(n,"onChange");0<n.length&&(t=new vt("onChange","change",null,t,r),e.push({event:t,listeners:n}))}var fr=null,dr=null;function pr(e){ul(e,0)}function mr(e){var n=Hl(e);if(G(n))return e}function hr(e,n){if("change"===e)return n}var gr=!1;if(c){var vr;if(c){var yr="oninput"in document;if(!yr){var br=document.createElement("div");br.setAttribute("oninput","return;");yr="function"===typeof br.oninput}vr=yr}else vr=!1;gr=vr&&(!document.documentMode||9<document.documentMode)}function kr(){fr&&(fr.detachEvent("onpropertychange",wr),dr=fr=null)}function wr(e){if("value"===e.propertyName&&mr(dr)){var n=[];cr(n,dr,e,Ee(e));De(pr,n)}}function Sr(e,n,t){"focusin"===e?(kr(),fr=n,dr=t,fr.attachEvent("onpropertychange",wr)):"focusout"===e&&kr()}function xr(e){if("selectionchange"===e||"keyup"===e||"keydown"===e)return mr(dr)}function Er(e,n){if("click"===e)return mr(n)}function Cr(e,n){if("input"===e||"change"===e)return mr(n)}function _r(e,n){return e===n&&(0!==e||1/e===1/n)||e!==e&&n!==n}var Nr="function"===typeof Object.is?Object.is:_r;function zr(e,n){if(Nr(e,n))return!0;if("object"!==typeof e||null===e||"object"!==typeof n||null===n)return!1;var t=Object.keys(e),r=Object.keys(n);if(t.length!==r.length)return!1;for(r=0;r<t.length;r++){var l=t[r];if(!f.call(n,l)||!Nr(e[l],n[l]))return!1}return!0}function Pr(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Tr(e,n){var t=Pr(e);e=0;for(var r;t;){if(3===t.nodeType){r=e+t.textContent.length;if(e<=n&&r>=n)return{node:t,offset:n-e};e=r}e:{for(;t;){if(t.nextSibling){t=t.nextSibling;break e}t=t.parentNode}t=void 0}t=Pr(t)}}function Lr(e,n){return e&&n?e===n?!0:e&&3===e.nodeType?!1:n&&3===n.nodeType?Lr(e,n.parentNode):"contains"in e?e.contains(n):e.compareDocumentPosition?!!(e.compareDocumentPosition(n)&16):!1:!1}function Mr(){for(var e=window,n=Z();n instanceof e.HTMLIFrameElement;){try{var t="string"===typeof n.contentWindow.location.href}catch(r){t=!1}if(t)e=n.contentWindow;else break;n=Z(e.document)}return n}function Fr(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n&&("input"===n&&("text"===e.type||"search"===e.type||"tel"===e.type||"url"===e.type||"password"===e.type)||"textarea"===n||"true"===e.contentEditable)}function Dr(e){var n=Mr(),t=e.focusedElem,r=e.selectionRange;if(n!==t&&t&&t.ownerDocument&&Lr(t.ownerDocument.documentElement,t)){if(null!==r&&Fr(t))if(n=r.start,e=r.end,void 0===e&&(e=n),"selectionStart"in t)t.selectionStart=n,t.selectionEnd=Math.min(e,t.value.length);else if(e=(n=t.ownerDocument||document)&&n.defaultView||window,e.getSelection){e=e.getSelection();var l=t.textContent.length,a=Math.min(r.start,l);r=void 0===r.end?a:Math.min(r.end,l);!e.extend&&a>r&&(l=r,r=a,a=l);l=Tr(t,a);var u=Tr(t,r);l&&u&&(1!==e.rangeCount||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==u.node||e.focusOffset!==u.offset)&&(n=n.createRange(),n.setStart(l.node,l.offset),e.removeAllRanges(),a>r?(e.addRange(n),e.extend(u.node,u.offset)):(n.setEnd(u.node,u.offset),e.addRange(n)))}n=[];for(e=t;e=e.parentNode;)1===e.nodeType&&n.push({element:e,left:e.scrollLeft,top:e.scrollTop});"function"===typeof t.focus&&t.focus();for(t=0;t<n.length;t++)e=n[t],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Rr=c&&"documentMode"in document&&11>=document.documentMode,Or=null,Ir=null,Ur=null,Vr=!1;function Ar(e,n,t){var r=t.window===t?t.document:9===t.nodeType?t:t.ownerDocument;Vr||null==Or||Or!==Z(r)||(r=Or,"selectionStart"in r&&Fr(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Ur&&zr(Ur,r)||(Ur=r,r=ml(Ir,"onSelect"),0<r.length&&(n=new vt("onSelect","select",null,n,t),e.push({event:n,listeners:r}),n.target=Or)))}function Br(e,n){var t={};t[e.toLowerCase()]=n.toLowerCase();t["Webkit"+e]="webkit"+n;t["Moz"+e]="moz"+n;return t}var Hr={animationend:Br("Animation","AnimationEnd"),animationiteration:Br("Animation","AnimationIteration"),animationstart:Br("Animation","AnimationStart"),transitionend:Br("Transition","TransitionEnd")},Wr={},Qr={};c&&(Qr=document.createElement("div").style,"AnimationEvent"in window||(delete Hr.animationend.animation,delete Hr.animationiteration.animation,delete Hr.animationstart.animation),"TransitionEvent"in window||delete Hr.transitionend.transition);function jr(e){if(Wr[e])return Wr[e];if(!Hr[e])return e;var n=Hr[e],t;for(t in n)if(n.hasOwnProperty(t)&&t in Qr)return Wr[e]=n[t];return e}var $r=jr("animationend"),Kr=jr("animationiteration"),qr=jr("animationstart"),Yr=jr("transitionend"),Xr=new Map,Gr="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Zr(e,n){Xr.set(e,n);o(n,[e])}for(var Jr=0;Jr<Gr.length;Jr++){var el=Gr[Jr],nl=el.toLowerCase(),tl=el[0].toUpperCase()+el.slice(1);Zr(nl,"on"+tl)}Zr($r,"onAnimationEnd");Zr(Kr,"onAnimationIteration");Zr(qr,"onAnimationStart");Zr("dblclick","onDoubleClick");Zr("focusin","onFocus");Zr("focusout","onBlur");Zr(Yr,"onTransitionEnd");s("onMouseEnter",["mouseout","mouseover"]);s("onMouseLeave",["mouseout","mouseover"]);s("onPointerEnter",["pointerout","pointerover"]);s("onPointerLeave",["pointerout","pointerover"]);o("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));o("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));o("onBeforeInput",["compositionend","keypress","textInput","paste"]);o("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));o("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));o("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var rl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),ll=new Set("cancel close invalid load scroll toggle".split(" ").concat(rl));function al(e,n,t){var r=e.type||"unknown-event";e.currentTarget=t;je(r,n,void 0,e);e.currentTarget=null}function ul(e,n){n=0!==(n&4);for(var t=0;t<e.length;t++){var r=e[t],l=r.event;r=r.listeners;e:{var a=void 0;if(n)for(var u=r.length-1;0<=u;u--){var i=r[u],o=i.instance,s=i.currentTarget;i=i.listener;if(o!==a&&l.isPropagationStopped())break e;al(l,i,s);a=o}else for(u=0;u<r.length;u++){i=r[u];o=i.instance;s=i.currentTarget;i=i.listener;if(o!==a&&l.isPropagationStopped())break e;al(l,i,s);a=o}}}if(Be)throw e=He,Be=!1,He=null,e}function il(e,n){var t=n[Il];void 0===t&&(t=n[Il]=new Set);var r=e+"__bubble";t.has(r)||(fl(n,e,2,!1),t.add(r))}function ol(e,n,t){var r=0;n&&(r|=4);fl(t,e,r,n)}var sl="_reactListening"+Math.random().toString(36).slice(2);function cl(e){if(!e[sl]){e[sl]=!0;u.forEach((function(n){"selectionchange"!==n&&(ll.has(n)||ol(n,!1,e),ol(n,!0,e))}));var n=9===e.nodeType?e:e.ownerDocument;null===n||n[sl]||(n[sl]=!0,ol("selectionchange",!1,n))}}function fl(e,n,t,r){switch(it(n)){case 1:var l=tt;break;case 4:l=rt;break;default:l=lt}t=l.bind(null,n,t,e);l=void 0;!Oe||"touchstart"!==n&&"touchmove"!==n&&"wheel"!==n||(l=!0);r?void 0!==l?e.addEventListener(n,t,{capture:!0,passive:l}):e.addEventListener(n,t,!0):void 0!==l?e.addEventListener(n,t,{passive:l}):e.addEventListener(n,t,!1)}function dl(e,n,t,r,l){var a=r;if(0===(n&1)&&0===(n&2)&&null!==r)e:for(;;){if(null===r)return;var u=r.tag;if(3===u||4===u){var i=r.stateNode.containerInfo;if(i===l||8===i.nodeType&&i.parentNode===l)break;if(4===u)for(u=r.return;null!==u;){var o=u.tag;if(3===o||4===o)if(o=u.stateNode.containerInfo,o===l||8===o.nodeType&&o.parentNode===l)return;u=u.return}for(;null!==i;){u=Al(i);if(null===u)return;o=u.tag;if(5===o||6===o){r=a=u;continue e}i=i.parentNode}}r=r.return}De((function(){var r=a,l=Ee(t),u=[];e:{var i=Xr.get(e);if(void 0!==i){var o=vt,s=e;switch(e){case"keypress":if(0===dt(t))break e;case"keydown":case"keyup":o=Bt;break;case"focusin":s="focus";o=zt;break;case"focusout":s="blur";o=zt;break;case"beforeblur":case"afterblur":o=zt;break;case"click":if(2===t.button)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":o=Et;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":o=_t;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":o=jt;break;case $r:case Kr:case qr:o=Tt;break;case Yr:o=Kt;break;case"scroll":o=bt;break;case"wheel":o=Yt;break;case"copy":case"cut":case"paste":o=Mt;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":o=Wt}var c=0!==(n&4),f=!c&&"scroll"===e,d=c?null!==i?i+"Capture":null:i;c=[];for(var p=r,m;null!==p;){m=p;var h=m.stateNode;5===m.tag&&null!==h&&(m=h,null!==d&&(h=Re(p,d),null!=h&&c.push(pl(p,h,m))));if(f)break;p=p.return}0<c.length&&(i=new o(i,s,null,t,l),u.push({event:i,listeners:c}))}}if(0===(n&7)){e:{i="mouseover"===e||"pointerover"===e;o="mouseout"===e||"pointerout"===e;if(i&&t!==xe&&(s=t.relatedTarget||t.fromElement)&&(Al(s)||s[Ol]))break e;if(o||i){i=l.window===l?l:(i=l.ownerDocument)?i.defaultView||i.parentWindow:window;if(o){if(s=t.relatedTarget||t.toElement,o=r,s=s?Al(s):null,null!==s&&(f=$e(s),s!==f||5!==s.tag&&6!==s.tag))s=null}else o=null,s=r;if(o!==s){c=Et;h="onMouseLeave";d="onMouseEnter";p="mouse";if("pointerout"===e||"pointerover"===e)c=Wt,h="onPointerLeave",d="onPointerEnter",p="pointer";f=null==o?i:Hl(o);m=null==s?i:Hl(s);i=new c(h,p+"leave",o,t,l);i.target=f;i.relatedTarget=m;h=null;Al(l)===r&&(c=new c(d,p+"enter",s,t,l),c.target=m,c.relatedTarget=f,h=c);f=h;if(o&&s)n:{c=o;d=s;p=0;for(m=c;m;m=hl(m))p++;m=0;for(h=d;h;h=hl(h))m++;for(;0<p-m;)c=hl(c),p--;for(;0<m-p;)d=hl(d),m--;for(;p--;){if(c===d||null!==d&&c===d.alternate)break n;c=hl(c);d=hl(d)}c=null}else c=null;null!==o&&gl(u,i,o,c,!1);null!==s&&null!==f&&gl(u,f,s,c,!0)}}}e:{i=r?Hl(r):window;o=i.nodeName&&i.nodeName.toLowerCase();if("select"===o||"input"===o&&"file"===i.type)var g=hr;else if(sr(i))if(gr)g=Cr;else{g=xr;var v=Sr}else(o=i.nodeName)&&"input"===o.toLowerCase()&&("checkbox"===i.type||"radio"===i.type)&&(g=Er);if(g&&(g=g(e,r))){cr(u,g,t,l);break e}v&&v(e,i,r);"focusout"===e&&(v=i._wrapperState)&&v.controlled&&"number"===i.type&&le(i,"number",i.value)}v=r?Hl(r):window;switch(e){case"focusin":if(sr(v)||"true"===v.contentEditable)Or=v,Ir=r,Ur=null;break;case"focusout":Ur=Ir=Or=null;break;case"mousedown":Vr=!0;break;case"contextmenu":case"mouseup":case"dragend":Vr=!1;Ar(u,t,l);break;case"selectionchange":if(Rr)break;case"keydown":case"keyup":Ar(u,t,l)}var y;if(Gt)e:{switch(e){case"compositionstart":var b="onCompositionStart";break e;case"compositionend":b="onCompositionEnd";break e;case"compositionupdate":b="onCompositionUpdate";break e}b=void 0}else ar?rr(e,t)&&(b="onCompositionEnd"):"keydown"===e&&229===t.keyCode&&(b="onCompositionStart");b&&(er&&"ko"!==t.locale&&(ar||"onCompositionStart"!==b?"onCompositionEnd"===b&&ar&&(y=ft()):(ot=l,st="value"in ot?ot.value:ot.textContent,ar=!0)),v=ml(r,b),0<v.length&&(b=new Dt(b,e,null,t,l),u.push({event:b,listeners:v}),y?b.data=y:(y=lr(t),null!==y&&(b.data=y))));if(y=Jt?ur(e,t):ir(e,t))r=ml(r,"onBeforeInput"),0<r.length&&(l=new Dt("onBeforeInput","beforeinput",null,t,l),u.push({event:l,listeners:r}),l.data=y)}ul(u,n)}))}function pl(e,n,t){return{instance:e,listener:n,currentTarget:t}}function ml(e,n){for(var t=n+"Capture",r=[];null!==e;){var l=e,a=l.stateNode;5===l.tag&&null!==a&&(l=a,a=Re(e,t),null!=a&&r.unshift(pl(e,a,l)),a=Re(e,n),null!=a&&r.push(pl(e,a,l)));e=e.return}return r}function hl(e){if(null===e)return null;do{e=e.return}while(e&&5!==e.tag);return e?e:null}function gl(e,n,t,r,l){for(var a=n._reactName,u=[];null!==t&&t!==r;){var i=t,o=i.alternate,s=i.stateNode;if(null!==o&&o===r)break;5===i.tag&&null!==s&&(i=s,l?(o=Re(t,a),null!=o&&u.unshift(pl(t,o,i))):l||(o=Re(t,a),null!=o&&u.push(pl(t,o,i))));t=t.return}0!==u.length&&e.push({event:n,listeners:u})}var vl=/\r\n?/g,yl=/\u0000|\uFFFD/g;function bl(e){return("string"===typeof e?e:""+e).replace(vl,"\n").replace(yl,"")}function kl(e,n,t){n=bl(n);if(bl(e)!==n&&t)throw Error(a(425))}function wl(){}var Sl=null,xl=null;function El(e,n){return"textarea"===e||"noscript"===e||"string"===typeof n.children||"number"===typeof n.children||"object"===typeof n.dangerouslySetInnerHTML&&null!==n.dangerouslySetInnerHTML&&null!=n.dangerouslySetInnerHTML.__html}var Cl="function"===typeof setTimeout?setTimeout:void 0,_l="function"===typeof clearTimeout?clearTimeout:void 0,Nl="function"===typeof Promise?Promise:void 0,zl="function"===typeof queueMicrotask?queueMicrotask:"undefined"!==typeof Nl?function(e){return Nl.resolve(null).then(e).catch(Pl)}:Cl;function Pl(e){setTimeout((function(){throw e}))}function Tl(e,n){var t=n,r=0;do{var l=t.nextSibling;e.removeChild(t);if(l&&8===l.nodeType)if(t=l.data,"/$"===t){if(0===r){e.removeChild(l);Jn(n);return}r--}else"$"!==t&&"$?"!==t&&"$!"!==t||r++;t=l}while(t);Jn(n)}function Ll(e){for(;null!=e;e=e.nextSibling){var n=e.nodeType;if(1===n||3===n)break;if(8===n){n=e.data;if("$"===n||"$!"===n||"$?"===n)break;if("/$"===n)return null}}return e}function Ml(e){e=e.previousSibling;for(var n=0;e;){if(8===e.nodeType){var t=e.data;if("$"===t||"$!"===t||"$?"===t){if(0===n)return e;n--}else"/$"===t&&n++}e=e.previousSibling}return null}var Fl=Math.random().toString(36).slice(2),Dl="__reactFiber$"+Fl,Rl="__reactProps$"+Fl,Ol="__reactContainer$"+Fl,Il="__reactEvents$"+Fl,Ul="__reactListeners$"+Fl,Vl="__reactHandles$"+Fl;function Al(e){var n=e[Dl];if(n)return n;for(var t=e.parentNode;t;){if(n=t[Ol]||t[Dl]){t=n.alternate;if(null!==n.child||null!==t&&null!==t.child)for(e=Ml(e);null!==e;){if(t=e[Dl])return t;e=Ml(e)}return n}e=t;t=e.parentNode}return null}function Bl(e){e=e[Dl]||e[Ol];return!e||5!==e.tag&&6!==e.tag&&13!==e.tag&&3!==e.tag?null:e}function Hl(e){if(5===e.tag||6===e.tag)return e.stateNode;throw Error(a(33))}function Wl(e){return e[Rl]||null}var Ql=[],jl=-1;function $l(e){return{current:e}}function Kl(e){0>jl||(e.current=Ql[jl],Ql[jl]=null,jl--)}function ql(e,n){jl++;Ql[jl]=e.current;e.current=n}var Yl={},Xl=$l(Yl),Gl=$l(!1),Zl=Yl;function Jl(e,n){var t=e.type.contextTypes;if(!t)return Yl;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===n)return r.__reactInternalMemoizedMaskedChildContext;var l={},a;for(a in t)l[a]=n[a];r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=n,e.__reactInternalMemoizedMaskedChildContext=l);return l}function ea(e){e=e.childContextTypes;return null!==e&&void 0!==e}function na(){Kl(Gl);Kl(Xl)}function ta(e,n,t){if(Xl.current!==Yl)throw Error(a(168));ql(Xl,n);ql(Gl,t)}function ra(e,n,t){var r=e.stateNode;n=n.childContextTypes;if("function"!==typeof r.getChildContext)return t;r=r.getChildContext();for(var l in r)if(!(l in n))throw Error(a(108,$(e)||"Unknown",l));return V({},t,r)}function la(e){e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Yl;Zl=Xl.current;ql(Xl,e);ql(Gl,Gl.current);return!0}function aa(e,n,t){var r=e.stateNode;if(!r)throw Error(a(169));t?(e=ra(e,n,Zl),r.__reactInternalMemoizedMergedChildContext=e,Kl(Gl),Kl(Xl),ql(Xl,e)):Kl(Gl);ql(Gl,t)}var ua=null,ia=!1,oa=!1;function sa(e){null===ua?ua=[e]:ua.push(e)}function ca(e){ia=!0;sa(e)}function fa(){if(!oa&&null!==ua){oa=!0;var e=0,n=Pn;try{var t=ua;for(Pn=1;e<t.length;e++){var r=t[e];do{r=r(!0)}while(null!==r)}ua=null;ia=!1}catch(l){throw null!==ua&&(ua=ua.slice(e+1)),Ze(ln,fa),l}finally{Pn=n,oa=!1}}return null}var da=[],pa=0,ma=null,ha=0,ga=[],va=0,ya=null,ba=1,ka="";function wa(e,n){da[pa++]=ha;da[pa++]=ma;ma=e;ha=n}function Sa(e,n,t){ga[va++]=ba;ga[va++]=ka;ga[va++]=ya;ya=e;var r=ba;e=ka;var l=32-pn(r)-1;r&=~(1<<l);t+=1;var a=32-pn(n)+l;if(30<a){var u=l-l%5;a=(r&(1<<u)-1).toString(32);r>>=u;l-=u;ba=1<<32-pn(n)+l|t<<l|r;ka=a+e}else ba=1<<a|t<<l|r,ka=e}function xa(e){null!==e.return&&(wa(e,1),Sa(e,1,0))}function Ea(e){for(;e===ma;)ma=da[--pa],da[pa]=null,ha=da[--pa],da[pa]=null;for(;e===ya;)ya=ga[--va],ga[va]=null,ka=ga[--va],ga[va]=null,ba=ga[--va],ga[va]=null}var Ca=null,_a=null,Na=!1,za=null;function Pa(e,n){var t=uc(5,null,null,0);t.elementType="DELETED";t.stateNode=n;t.return=e;n=e.deletions;null===n?(e.deletions=[t],e.flags|=16):n.push(t)}function Ta(e,n){switch(e.tag){case 5:var t=e.type;n=1!==n.nodeType||t.toLowerCase()!==n.nodeName.toLowerCase()?null:n;return null!==n?(e.stateNode=n,Ca=e,_a=Ll(n.firstChild),!0):!1;case 6:return n=""===e.pendingProps||3!==n.nodeType?null:n,null!==n?(e.stateNode=n,Ca=e,_a=null,!0):!1;case 13:return n=8!==n.nodeType?null:n,null!==n?(t=null!==ya?{id:ba,overflow:ka}:null,e.memoizedState={dehydrated:n,treeContext:t,retryLane:1073741824},t=uc(18,null,null,0),t.stateNode=n,t.return=e,e.child=t,Ca=e,_a=null,!0):!1;default:return!1}}function La(e){return 0!==(e.mode&1)&&0===(e.flags&128)}function Ma(e){if(Na){var n=_a;if(n){var t=n;if(!Ta(e,n)){if(La(e))throw Error(a(418));n=Ll(t.nextSibling);var r=Ca;n&&Ta(e,n)?Pa(r,t):(e.flags=e.flags&-4097|2,Na=!1,Ca=e)}}else{if(La(e))throw Error(a(418));e.flags=e.flags&-4097|2;Na=!1;Ca=e}}}function Fa(e){for(e=e.return;null!==e&&5!==e.tag&&3!==e.tag&&13!==e.tag;)e=e.return;Ca=e}function Da(e){if(e!==Ca)return!1;if(!Na)return Fa(e),Na=!0,!1;var n;(n=3!==e.tag)&&!(n=5!==e.tag)&&(n=e.type,n="head"!==n&&"body"!==n&&!El(e.type,e.memoizedProps));if(n&&(n=_a)){if(La(e))throw Ra(),Error(a(418));for(;n;)Pa(e,n),n=Ll(n.nextSibling)}Fa(e);if(13===e.tag){e=e.memoizedState;e=null!==e?e.dehydrated:null;if(!e)throw Error(a(317));e:{e=e.nextSibling;for(n=0;e;){if(8===e.nodeType){var t=e.data;if("/$"===t){if(0===n){_a=Ll(e.nextSibling);break e}n--}else"$"!==t&&"$!"!==t&&"$?"!==t||n++}e=e.nextSibling}_a=null}}else _a=Ca?Ll(e.stateNode.nextSibling):null;return!0}function Ra(){for(var e=_a;e;)e=Ll(e.nextSibling)}function Oa(){_a=Ca=null;Na=!1}function Ia(e){null===za?za=[e]:za.push(e)}var Ua=x.ReactCurrentBatchConfig;function Va(e,n){if(e&&e.defaultProps){n=V({},n);e=e.defaultProps;for(var t in e)void 0===n[t]&&(n[t]=e[t]);return n}return n}var Aa=$l(null),Ba=null,Ha=null,Wa=null;function Qa(){Wa=Ha=Ba=null}function ja(e){var n=Aa.current;Kl(Aa);e._currentValue=n}function $a(e,n,t){for(;null!==e;){var r=e.alternate;(e.childLanes&n)!==n?(e.childLanes|=n,null!==r&&(r.childLanes|=n)):null!==r&&(r.childLanes&n)!==n&&(r.childLanes|=n);if(e===t)break;e=e.return}}function Ka(e,n){Ba=e;Wa=Ha=null;e=e.dependencies;null!==e&&null!==e.firstContext&&(0!==(e.lanes&n)&&(Hi=!0),e.firstContext=null)}function qa(e){var n=e._currentValue;if(Wa!==e)if(e={context:e,memoizedValue:n,next:null},null===Ha){if(null===Ba)throw Error(a(308));Ha=e;Ba.dependencies={lanes:0,firstContext:e}}else Ha=Ha.next=e;return n}var Ya=null;function Xa(e){null===Ya?Ya=[e]:Ya.push(e)}function Ga(e,n,t,r){var l=n.interleaved;null===l?(t.next=t,Xa(n)):(t.next=l.next,l.next=t);n.interleaved=t;return Za(e,r)}function Za(e,n){e.lanes|=n;var t=e.alternate;null!==t&&(t.lanes|=n);t=e;for(e=e.return;null!==e;)e.childLanes|=n,t=e.alternate,null!==t&&(t.childLanes|=n),t=e,e=e.return;return 3===t.tag?t.stateNode:null}var Ja=!1;function eu(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function nu(e,n){e=e.updateQueue;n.updateQueue===e&&(n.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function tu(e,n){return{eventTime:e,lane:n,tag:0,payload:null,callback:null,next:null}}function ru(e,n,t){var r=e.updateQueue;if(null===r)return null;r=r.shared;if(0!==(es&2)){var l=r.pending;null===l?n.next=n:(n.next=l.next,l.next=n);r.pending=n;return Za(e,t)}l=r.interleaved;null===l?(n.next=n,Xa(r)):(n.next=l.next,l.next=n);r.interleaved=n;return Za(e,t)}function lu(e,n,t){n=n.updateQueue;if(null!==n&&(n=n.shared,0!==(t&4194240))){var r=n.lanes;r&=e.pendingLanes;t|=r;n.lanes=t;zn(e,t)}}function au(e,n){var t=e.updateQueue,r=e.alternate;if(null!==r&&(r=r.updateQueue,t===r)){var l=null,a=null;t=t.firstBaseUpdate;if(null!==t){do{var u={eventTime:t.eventTime,lane:t.lane,tag:t.tag,payload:t.payload,callback:t.callback,next:null};null===a?l=a=u:a=a.next=u;t=t.next}while(null!==t);null===a?l=a=n:a=a.next=n}else l=a=n;t={baseState:r.baseState,firstBaseUpdate:l,lastBaseUpdate:a,shared:r.shared,effects:r.effects};e.updateQueue=t;return}e=t.lastBaseUpdate;null===e?t.firstBaseUpdate=n:e.next=n;t.lastBaseUpdate=n}function uu(e,n,t,r){var l=e.updateQueue;Ja=!1;var a=l.firstBaseUpdate,u=l.lastBaseUpdate,i=l.shared.pending;if(null!==i){l.shared.pending=null;var o=i,s=o.next;o.next=null;null===u?a=s:u.next=s;u=o;var c=e.alternate;null!==c&&(c=c.updateQueue,i=c.lastBaseUpdate,i!==u&&(null===i?c.firstBaseUpdate=s:i.next=s,c.lastBaseUpdate=o))}if(null!==a){var f=l.baseState;u=0;c=s=o=null;i=a;do{var d=i.lane,p=i.eventTime;if((r&d)===d){null!==c&&(c=c.next={eventTime:p,lane:0,tag:i.tag,payload:i.payload,callback:i.callback,next:null});e:{var m=e,h=i;d=n;p=t;switch(h.tag){case 1:m=h.payload;if("function"===typeof m){f=m.call(p,f,d);break e}f=m;break e;case 3:m.flags=m.flags&-65537|128;case 0:m=h.payload;d="function"===typeof m?m.call(p,f,d):m;if(null===d||void 0===d)break e;f=V({},f,d);break e;case 2:Ja=!0}}null!==i.callback&&0!==i.lane&&(e.flags|=64,d=l.effects,null===d?l.effects=[i]:d.push(i))}else p={eventTime:p,lane:d,tag:i.tag,payload:i.payload,callback:i.callback,next:null},null===c?(s=c=p,o=f):c=c.next=p,u|=d;i=i.next;if(null===i)if(i=l.shared.pending,null===i)break;else d=i,i=d.next,d.next=null,l.lastBaseUpdate=d,l.shared.pending=null}while(1);null===c&&(o=f);l.baseState=o;l.firstBaseUpdate=s;l.lastBaseUpdate=c;n=l.shared.interleaved;if(null!==n){l=n;do{u|=l.lane,l=l.next}while(l!==n)}else null===a&&(l.shared.lanes=0);os|=u;e.lanes=u;e.memoizedState=f}}function iu(e,n,t){e=n.effects;n.effects=null;if(null!==e)for(n=0;n<e.length;n++){var r=e[n],l=r.callback;if(null!==l){r.callback=null;r=t;if("function"!==typeof l)throw Error(a(191,l));l.call(r)}}}var ou=(new r.Component).refs;function su(e,n,t,r){n=e.memoizedState;t=t(r,n);t=null===t||void 0===t?n:V({},n,t);e.memoizedState=t;0===e.lanes&&(e.updateQueue.baseState=t)}var cu={isMounted:function(e){return(e=e._reactInternals)?$e(e)===e:!1},enqueueSetState:function(e,n,t){e=e._reactInternals;var r=_s(),l=Ns(e),a=tu(r,l);a.payload=n;void 0!==t&&null!==t&&(a.callback=t);n=ru(e,a,l);null!==n&&(zs(n,e,l,r),lu(n,e,l))},enqueueReplaceState:function(e,n,t){e=e._reactInternals;var r=_s(),l=Ns(e),a=tu(r,l);a.tag=1;a.payload=n;void 0!==t&&null!==t&&(a.callback=t);n=ru(e,a,l);null!==n&&(zs(n,e,l,r),lu(n,e,l))},enqueueForceUpdate:function(e,n){e=e._reactInternals;var t=_s(),r=Ns(e),l=tu(t,r);l.tag=2;void 0!==n&&null!==n&&(l.callback=n);n=ru(e,l,r);null!==n&&(zs(n,e,r,t),lu(n,e,r))}};function fu(e,n,t,r,l,a,u){e=e.stateNode;return"function"===typeof e.shouldComponentUpdate?e.shouldComponentUpdate(r,a,u):n.prototype&&n.prototype.isPureReactComponent?!zr(t,r)||!zr(l,a):!0}function du(e,n,t){var r=!1,l=Yl;var a=n.contextType;"object"===typeof a&&null!==a?a=qa(a):(l=ea(n)?Zl:Xl.current,r=n.contextTypes,a=(r=null!==r&&void 0!==r)?Jl(e,l):Yl);n=new n(t,a);e.memoizedState=null!==n.state&&void 0!==n.state?n.state:null;n.updater=cu;e.stateNode=n;n._reactInternals=e;r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=a);return n}function pu(e,n,t,r){e=n.state;"function"===typeof n.componentWillReceiveProps&&n.componentWillReceiveProps(t,r);"function"===typeof n.UNSAFE_componentWillReceiveProps&&n.UNSAFE_componentWillReceiveProps(t,r);n.state!==e&&cu.enqueueReplaceState(n,n.state,null)}function mu(e,n,t,r){var l=e.stateNode;l.props=t;l.state=e.memoizedState;l.refs=ou;eu(e);var a=n.contextType;"object"===typeof a&&null!==a?l.context=qa(a):(a=ea(n)?Zl:Xl.current,l.context=Jl(e,a));l.state=e.memoizedState;a=n.getDerivedStateFromProps;"function"===typeof a&&(su(e,n,a,t),l.state=e.memoizedState);"function"===typeof n.getDerivedStateFromProps||"function"===typeof l.getSnapshotBeforeUpdate||"function"!==typeof l.UNSAFE_componentWillMount&&"function"!==typeof l.componentWillMount||(n=l.state,"function"===typeof l.componentWillMount&&l.componentWillMount(),"function"===typeof l.UNSAFE_componentWillMount&&l.UNSAFE_componentWillMount(),n!==l.state&&cu.enqueueReplaceState(l,l.state,null),uu(e,t,l,r),l.state=e.memoizedState);"function"===typeof l.componentDidMount&&(e.flags|=4194308)}function hu(e,n,t){e=t.ref;if(null!==e&&"function"!==typeof e&&"object"!==typeof e){if(t._owner){t=t._owner;if(t){if(1!==t.tag)throw Error(a(309));var r=t.stateNode}if(!r)throw Error(a(147,e));var l=r,u=""+e;if(null!==n&&null!==n.ref&&"function"===typeof n.ref&&n.ref._stringRef===u)return n.ref;n=function(e){var n=l.refs;n===ou&&(n=l.refs={});null===e?delete n[u]:n[u]=e};n._stringRef=u;return n}if("string"!==typeof e)throw Error(a(284));if(!t._owner)throw Error(a(290,e))}return e}function gu(e,n){e=Object.prototype.toString.call(n);throw Error(a(31,"[object Object]"===e?"object with keys {"+Object.keys(n).join(", ")+"}":e))}function vu(e){var n=e._init;return n(e._payload)}function yu(e){function n(n,t){if(e){var r=n.deletions;null===r?(n.deletions=[t],n.flags|=16):r.push(t)}}function t(t,r){if(!e)return null;for(;null!==r;)n(t,r),r=r.sibling;return null}function r(e,n){for(e=new Map;null!==n;)null!==n.key?e.set(n.key,n):e.set(n.index,n),n=n.sibling;return e}function l(e,n){e=sc(e,n);e.index=0;e.sibling=null;return e}function u(n,t,r){n.index=r;if(!e)return n.flags|=1048576,t;r=n.alternate;if(null!==r)return r=r.index,r<t?(n.flags|=2,t):r;n.flags|=2;return t}function i(n){e&&null===n.alternate&&(n.flags|=2);return n}function o(e,n,t,r){if(null===n||6!==n.tag)return n=pc(t,e.mode,r),n.return=e,n;n=l(n,t);n.return=e;return n}function s(e,n,t,r){var a=t.type;if(a===_)return f(e,n,t.props.children,r,t.key);if(null!==n&&(n.elementType===a||"object"===typeof a&&null!==a&&a.$$typeof===R&&vu(a)===n.type))return r=l(n,t.props),r.ref=hu(e,n,t),r.return=e,r;r=cc(t.type,t.key,t.props,null,e.mode,r);r.ref=hu(e,n,t);r.return=e;return r}function c(e,n,t,r){if(null===n||4!==n.tag||n.stateNode.containerInfo!==t.containerInfo||n.stateNode.implementation!==t.implementation)return n=mc(t,e.mode,r),n.return=e,n;n=l(n,t.children||[]);n.return=e;return n}function f(e,n,t,r,a){if(null===n||7!==n.tag)return n=fc(t,e.mode,r,a),n.return=e,n;n=l(n,t);n.return=e;return n}function d(e,n,t){if("string"===typeof n&&""!==n||"number"===typeof n)return n=pc(""+n,e.mode,t),n.return=e,n;if("object"===typeof n&&null!==n){switch(n.$$typeof){case E:return t=cc(n.type,n.key,n.props,null,e.mode,t),t.ref=hu(e,null,n),t.return=e,t;case C:return n=mc(n,e.mode,t),n.return=e,n;case R:var r=n._init;return d(e,r(n._payload),t)}if(ae(n)||U(n))return n=fc(n,e.mode,t,null),n.return=e,n;gu(e,n)}return null}function p(e,n,t,r){var l=null!==n?n.key:null;if("string"===typeof t&&""!==t||"number"===typeof t)return null!==l?null:o(e,n,""+t,r);if("object"===typeof t&&null!==t){switch(t.$$typeof){case E:return t.key===l?s(e,n,t,r):null;case C:return t.key===l?c(e,n,t,r):null;case R:return l=t._init,p(e,n,l(t._payload),r)}if(ae(t)||U(t))return null!==l?null:f(e,n,t,r,null);gu(e,t)}return null}function m(e,n,t,r,l){if("string"===typeof r&&""!==r||"number"===typeof r)return e=e.get(t)||null,o(n,e,""+r,l);if("object"===typeof r&&null!==r){switch(r.$$typeof){case E:return e=e.get(null===r.key?t:r.key)||null,s(n,e,r,l);case C:return e=e.get(null===r.key?t:r.key)||null,c(n,e,r,l);case R:var a=r._init;return m(e,n,t,a(r._payload),l)}if(ae(r)||U(r))return e=e.get(t)||null,f(n,e,r,l,null);gu(n,r)}return null}function h(l,a,i,o){for(var s=null,c=null,f=a,h=a=0,g=null;null!==f&&h<i.length;h++){f.index>h?(g=f,f=null):g=f.sibling;var v=p(l,f,i[h],o);if(null===v){null===f&&(f=g);break}e&&f&&null===v.alternate&&n(l,f);a=u(v,a,h);null===c?s=v:c.sibling=v;c=v;f=g}if(h===i.length)return t(l,f),Na&&wa(l,h),s;if(null===f){for(;h<i.length;h++)f=d(l,i[h],o),null!==f&&(a=u(f,a,h),null===c?s=f:c.sibling=f,c=f);Na&&wa(l,h);return s}for(f=r(l,f);h<i.length;h++)g=m(f,l,h,i[h],o),null!==g&&(e&&null!==g.alternate&&f.delete(null===g.key?h:g.key),a=u(g,a,h),null===c?s=g:c.sibling=g,c=g);e&&f.forEach((function(e){return n(l,e)}));Na&&wa(l,h);return s}function g(l,i,o,s){var c=U(o);if("function"!==typeof c)throw Error(a(150));o=c.call(o);if(null==o)throw Error(a(151));for(var f=c=null,h=i,g=i=0,v=null,y=o.next();null!==h&&!y.done;g++,y=o.next()){h.index>g?(v=h,h=null):v=h.sibling;var b=p(l,h,y.value,s);if(null===b){null===h&&(h=v);break}e&&h&&null===b.alternate&&n(l,h);i=u(b,i,g);null===f?c=b:f.sibling=b;f=b;h=v}if(y.done)return t(l,h),Na&&wa(l,g),c;if(null===h){for(;!y.done;g++,y=o.next())y=d(l,y.value,s),null!==y&&(i=u(y,i,g),null===f?c=y:f.sibling=y,f=y);Na&&wa(l,g);return c}for(h=r(l,h);!y.done;g++,y=o.next())y=m(h,l,g,y.value,s),null!==y&&(e&&null!==y.alternate&&h.delete(null===y.key?g:y.key),i=u(y,i,g),null===f?c=y:f.sibling=y,f=y);e&&h.forEach((function(e){return n(l,e)}));Na&&wa(l,g);return c}function v(e,r,a,u){"object"===typeof a&&null!==a&&a.type===_&&null===a.key&&(a=a.props.children);if("object"===typeof a&&null!==a){switch(a.$$typeof){case E:e:{for(var o=a.key,s=r;null!==s;){if(s.key===o){o=a.type;if(o===_){if(7===s.tag){t(e,s.sibling);r=l(s,a.props.children);r.return=e;e=r;break e}}else if(s.elementType===o||"object"===typeof o&&null!==o&&o.$$typeof===R&&vu(o)===s.type){t(e,s.sibling);r=l(s,a.props);r.ref=hu(e,s,a);r.return=e;e=r;break e}t(e,s);break}else n(e,s);s=s.sibling}a.type===_?(r=fc(a.props.children,e.mode,u,a.key),r.return=e,e=r):(u=cc(a.type,a.key,a.props,null,e.mode,u),u.ref=hu(e,r,a),u.return=e,e=u)}return i(e);case C:e:{for(s=a.key;null!==r;){if(r.key===s)if(4===r.tag&&r.stateNode.containerInfo===a.containerInfo&&r.stateNode.implementation===a.implementation){t(e,r.sibling);r=l(r,a.children||[]);r.return=e;e=r;break e}else{t(e,r);break}else n(e,r);r=r.sibling}r=mc(a,e.mode,u);r.return=e;e=r}return i(e);case R:return s=a._init,v(e,r,s(a._payload),u)}if(ae(a))return h(e,r,a,u);if(U(a))return g(e,r,a,u);gu(e,a)}return"string"===typeof a&&""!==a||"number"===typeof a?(a=""+a,null!==r&&6===r.tag?(t(e,r.sibling),r=l(r,a),r.return=e,e=r):(t(e,r),r=pc(a,e.mode,u),r.return=e,e=r),i(e)):t(e,r)}return v}var bu=yu(!0),ku=yu(!1),wu={},Su=$l(wu),xu=$l(wu),Eu=$l(wu);function Cu(e){if(e===wu)throw Error(a(174));return e}function _u(e,n){ql(Eu,n);ql(xu,e);ql(Su,wu);e=n.nodeType;switch(e){case 9:case 11:n=(n=n.documentElement)?n.namespaceURI:de(null,"");break;default:e=8===e?n.parentNode:n,n=e.namespaceURI||null,e=e.tagName,n=de(n,e)}Kl(Su);ql(Su,n)}function Nu(){Kl(Su);Kl(xu);Kl(Eu)}function zu(e){Cu(Eu.current);var n=Cu(Su.current);var t=de(n,e.type);n!==t&&(ql(xu,e),ql(Su,t))}function Pu(e){xu.current===e&&(Kl(Su),Kl(xu))}var Tu=$l(0);function Lu(e){for(var n=e;null!==n;){if(13===n.tag){var t=n.memoizedState;if(null!==t&&(t=t.dehydrated,null===t||"$?"===t.data||"$!"===t.data))return n}else if(19===n.tag&&void 0!==n.memoizedProps.revealOrder){if(0!==(n.flags&128))return n}else if(null!==n.child){n.child.return=n;n=n.child;continue}if(n===e)break;for(;null===n.sibling;){if(null===n.return||n.return===e)return null;n=n.return}n.sibling.return=n.return;n=n.sibling}return null}var Mu=[];function Fu(){for(var e=0;e<Mu.length;e++)Mu[e]._workInProgressVersionPrimary=null;Mu.length=0}var Du=x.ReactCurrentDispatcher,Ru=x.ReactCurrentBatchConfig,Ou=0,Iu=null,Uu=null,Vu=null,Au=!1,Bu=!1,Hu=0,Wu=0;function Qu(){throw Error(a(321))}function ju(e,n){if(null===n)return!1;for(var t=0;t<n.length&&t<e.length;t++)if(!Nr(e[t],n[t]))return!1;return!0}function $u(e,n,t,r,l,u){Ou=u;Iu=n;n.memoizedState=null;n.updateQueue=null;n.lanes=0;Du.current=null===e||null===e.memoizedState?Pi:Ti;e=t(r,l);if(Bu){u=0;do{Bu=!1;Hu=0;if(25<=u)throw Error(a(301));u+=1;Vu=Uu=null;n.updateQueue=null;Du.current=Li;e=t(r,l)}while(Bu)}Du.current=zi;n=null!==Uu&&null!==Uu.next;Ou=0;Vu=Uu=Iu=null;Au=!1;if(n)throw Error(a(300));return e}function Ku(){var e=0!==Hu;Hu=0;return e}function qu(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};null===Vu?Iu.memoizedState=Vu=e:Vu=Vu.next=e;return Vu}function Yu(){if(null===Uu){var e=Iu.alternate;e=null!==e?e.memoizedState:null}else e=Uu.next;var n=null===Vu?Iu.memoizedState:Vu.next;if(null!==n)Vu=n,Uu=e;else{if(null===e)throw Error(a(310));Uu=e;e={memoizedState:Uu.memoizedState,baseState:Uu.baseState,baseQueue:Uu.baseQueue,queue:Uu.queue,next:null};null===Vu?Iu.memoizedState=Vu=e:Vu=Vu.next=e}return Vu}function Xu(e,n){return"function"===typeof n?n(e):n}function Gu(e){var n=Yu(),t=n.queue;if(null===t)throw Error(a(311));t.lastRenderedReducer=e;var r=Uu,l=r.baseQueue,u=t.pending;if(null!==u){if(null!==l){var i=l.next;l.next=u.next;u.next=i}r.baseQueue=l=u;t.pending=null}if(null!==l){u=l.next;r=r.baseState;var o=i=null,s=null,c=u;do{var f=c.lane;if((Ou&f)===f)null!==s&&(s=s.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),r=c.hasEagerState?c.eagerState:e(r,c.action);else{var d={lane:f,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};null===s?(o=s=d,i=r):s=s.next=d;Iu.lanes|=f;os|=f}c=c.next}while(null!==c&&c!==u);null===s?i=r:s.next=o;Nr(r,n.memoizedState)||(Hi=!0);n.memoizedState=r;n.baseState=i;n.baseQueue=s;t.lastRenderedState=r}e=t.interleaved;if(null!==e){l=e;do{u=l.lane,Iu.lanes|=u,os|=u,l=l.next}while(l!==e)}else null===l&&(t.lanes=0);return[n.memoizedState,t.dispatch]}function Zu(e){var n=Yu(),t=n.queue;if(null===t)throw Error(a(311));t.lastRenderedReducer=e;var r=t.dispatch,l=t.pending,u=n.memoizedState;if(null!==l){t.pending=null;var i=l=l.next;do{u=e(u,i.action),i=i.next}while(i!==l);Nr(u,n.memoizedState)||(Hi=!0);n.memoizedState=u;null===n.baseQueue&&(n.baseState=u);t.lastRenderedState=u}return[u,r]}function Ju(){}function ei(e,n){var t=Iu,r=Yu(),l=n(),u=!Nr(r.memoizedState,l);u&&(r.memoizedState=l,Hi=!0);r=r.queue;di(ri.bind(null,t,r,e),[e]);if(r.getSnapshot!==n||u||null!==Vu&&Vu.memoizedState.tag&1){t.flags|=2048;ii(9,ti.bind(null,t,r,l,n),void 0,null);if(null===ns)throw Error(a(349));0!==(Ou&30)||ni(t,n,l)}return l}function ni(e,n,t){e.flags|=16384;e={getSnapshot:n,value:t};n=Iu.updateQueue;null===n?(n={lastEffect:null,stores:null},Iu.updateQueue=n,n.stores=[e]):(t=n.stores,null===t?n.stores=[e]:t.push(e))}function ti(e,n,t,r){n.value=t;n.getSnapshot=r;li(n)&&ai(e)}function ri(e,n,t){return t((function(){li(n)&&ai(e)}))}function li(e){var n=e.getSnapshot;e=e.value;try{var t=n();return!Nr(e,t)}catch(r){return!0}}function ai(e){var n=Za(e,1);null!==n&&zs(n,e,1,-1)}function ui(e){var n=qu();"function"===typeof e&&(e=e());n.memoizedState=n.baseState=e;e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Xu,lastRenderedState:e};n.queue=e;e=e.dispatch=Ei.bind(null,Iu,e);return[n.memoizedState,e]}function ii(e,n,t,r){e={tag:e,create:n,destroy:t,deps:r,next:null};n=Iu.updateQueue;null===n?(n={lastEffect:null,stores:null},Iu.updateQueue=n,n.lastEffect=e.next=e):(t=n.lastEffect,null===t?n.lastEffect=e.next=e:(r=t.next,t.next=e,e.next=r,n.lastEffect=e));return e}function oi(){return Yu().memoizedState}function si(e,n,t,r){var l=qu();Iu.flags|=e;l.memoizedState=ii(1|n,t,void 0,void 0===r?null:r)}function ci(e,n,t,r){var l=Yu();r=void 0===r?null:r;var a=void 0;if(null!==Uu){var u=Uu.memoizedState;a=u.destroy;if(null!==r&&ju(r,u.deps)){l.memoizedState=ii(n,t,a,r);return}}Iu.flags|=e;l.memoizedState=ii(1|n,t,a,r)}function fi(e,n){return si(8390656,8,e,n)}function di(e,n){return ci(2048,8,e,n)}function pi(e,n){return ci(4,2,e,n)}function mi(e,n){return ci(4,4,e,n)}function hi(e,n){if("function"===typeof n)return e=e(),n(e),function(){n(null)};if(null!==n&&void 0!==n)return e=e(),n.current=e,function(){n.current=null}}function gi(e,n,t){t=null!==t&&void 0!==t?t.concat([e]):null;return ci(4,4,hi.bind(null,n,e),t)}function vi(){}function yi(e,n){var t=Yu();n=void 0===n?null:n;var r=t.memoizedState;if(null!==r&&null!==n&&ju(n,r[1]))return r[0];t.memoizedState=[e,n];return e}function bi(e,n){var t=Yu();n=void 0===n?null:n;var r=t.memoizedState;if(null!==r&&null!==n&&ju(n,r[1]))return r[0];e=e();t.memoizedState=[e,n];return e}function ki(e,n,t){if(0===(Ou&21))return e.baseState&&(e.baseState=!1,Hi=!0),e.memoizedState=t;Nr(t,n)||(t=En(),Iu.lanes|=t,os|=t,e.baseState=!0);return n}function wi(e,n){var t=Pn;Pn=0!==t&&4>t?t:4;e(!0);var r=Ru.transition;Ru.transition={};try{e(!1),n()}finally{Pn=t,Ru.transition=r}}function Si(){return Yu().memoizedState}function xi(e,n,t){var r=Ns(e);t={lane:r,action:t,hasEagerState:!1,eagerState:null,next:null};if(Ci(e))_i(n,t);else if(t=Ga(e,n,t,r),null!==t){var l=_s();zs(t,e,r,l);Ni(t,n,r)}}function Ei(e,n,t){var r=Ns(e),l={lane:r,action:t,hasEagerState:!1,eagerState:null,next:null};if(Ci(e))_i(n,l);else{var a=e.alternate;if(0===e.lanes&&(null===a||0===a.lanes)&&(a=n.lastRenderedReducer,null!==a))try{var u=n.lastRenderedState,i=a(u,t);l.hasEagerState=!0;l.eagerState=i;if(Nr(i,u)){var o=n.interleaved;null===o?(l.next=l,Xa(n)):(l.next=o.next,o.next=l);n.interleaved=l;return}}catch(s){}finally{}t=Ga(e,n,l,r);null!==t&&(l=_s(),zs(t,e,r,l),Ni(t,n,r))}}function Ci(e){var n=e.alternate;return e===Iu||null!==n&&n===Iu}function _i(e,n){Bu=Au=!0;var t=e.pending;null===t?n.next=n:(n.next=t.next,t.next=n);e.pending=n}function Ni(e,n,t){if(0!==(t&4194240)){var r=n.lanes;r&=e.pendingLanes;t|=r;n.lanes=t;zn(e,t)}}var zi={readContext:qa,useCallback:Qu,useContext:Qu,useEffect:Qu,useImperativeHandle:Qu,useInsertionEffect:Qu,useLayoutEffect:Qu,useMemo:Qu,useReducer:Qu,useRef:Qu,useState:Qu,useDebugValue:Qu,useDeferredValue:Qu,useTransition:Qu,useMutableSource:Qu,useSyncExternalStore:Qu,useId:Qu,unstable_isNewReconciler:!1},Pi={readContext:qa,useCallback:function(e,n){qu().memoizedState=[e,void 0===n?null:n];return e},useContext:qa,useEffect:fi,useImperativeHandle:function(e,n,t){t=null!==t&&void 0!==t?t.concat([e]):null;return si(4194308,4,hi.bind(null,n,e),t)},useLayoutEffect:function(e,n){return si(4194308,4,e,n)},useInsertionEffect:function(e,n){return si(4,2,e,n)},useMemo:function(e,n){var t=qu();n=void 0===n?null:n;e=e();t.memoizedState=[e,n];return e},useReducer:function(e,n,t){var r=qu();n=void 0!==t?t(n):n;r.memoizedState=r.baseState=n;e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:n};r.queue=e;e=e.dispatch=xi.bind(null,Iu,e);return[r.memoizedState,e]},useRef:function(e){var n=qu();e={current:e};return n.memoizedState=e},useState:ui,useDebugValue:vi,useDeferredValue:function(e){return qu().memoizedState=e},useTransition:function(){var e=ui(!1),n=e[0];e=wi.bind(null,e[1]);qu().memoizedState=e;return[n,e]},useMutableSource:function(){},useSyncExternalStore:function(e,n,t){var r=Iu,l=qu();if(Na){if(void 0===t)throw Error(a(407));t=t()}else{t=n();if(null===ns)throw Error(a(349));0!==(Ou&30)||ni(r,n,t)}l.memoizedState=t;var u={value:t,getSnapshot:n};l.queue=u;fi(ri.bind(null,r,u,e),[e]);r.flags|=2048;ii(9,ti.bind(null,r,u,t,n),void 0,null);return t},useId:function(){var e=qu(),n=ns.identifierPrefix;if(Na){var t=ka;var r=ba;t=(r&~(1<<32-pn(r)-1)).toString(32)+t;n=":"+n+"R"+t;t=Hu++;0<t&&(n+="H"+t.toString(32));n+=":"}else t=Wu++,n=":"+n+"r"+t.toString(32)+":";return e.memoizedState=n},unstable_isNewReconciler:!1},Ti={readContext:qa,useCallback:yi,useContext:qa,useEffect:di,useImperativeHandle:gi,useInsertionEffect:pi,useLayoutEffect:mi,useMemo:bi,useReducer:Gu,useRef:oi,useState:function(){return Gu(Xu)},useDebugValue:vi,useDeferredValue:function(e){var n=Yu();return ki(n,Uu.memoizedState,e)},useTransition:function(){var e=Gu(Xu)[0],n=Yu().memoizedState;return[e,n]},useMutableSource:Ju,useSyncExternalStore:ei,useId:Si,unstable_isNewReconciler:!1},Li={readContext:qa,useCallback:yi,useContext:qa,useEffect:di,useImperativeHandle:gi,useInsertionEffect:pi,useLayoutEffect:mi,useMemo:bi,useReducer:Zu,useRef:oi,useState:function(){return Zu(Xu)},useDebugValue:vi,useDeferredValue:function(e){var n=Yu();return null===Uu?n.memoizedState=e:ki(n,Uu.memoizedState,e)},useTransition:function(){var e=Zu(Xu)[0],n=Yu().memoizedState;return[e,n]},useMutableSource:Ju,useSyncExternalStore:ei,useId:Si,unstable_isNewReconciler:!1};function Mi(e,n){try{var t="",r=n;do{t+=Q(r),r=r.return}while(r);var l=t}catch(a){l="\nError generating stack: "+a.message+"\n"+a.stack}return{value:e,source:n,stack:l,digest:null}}function Fi(e,n,t){return{value:e,source:null,stack:null!=t?t:null,digest:null!=n?n:null}}function Di(e,n){try{console.error(n.value)}catch(t){setTimeout((function(){throw t}))}}var Ri="function"===typeof WeakMap?WeakMap:Map;function Oi(e,n,t){t=tu(-1,t);t.tag=3;t.payload={element:null};var r=n.value;t.callback=function(){gs||(gs=!0,vs=r);Di(e,n)};return t}function Ii(e,n,t){t=tu(-1,t);t.tag=3;var r=e.type.getDerivedStateFromError;if("function"===typeof r){var l=n.value;t.payload=function(){return r(l)};t.callback=function(){Di(e,n)}}var a=e.stateNode;null!==a&&"function"===typeof a.componentDidCatch&&(t.callback=function(){Di(e,n);"function"!==typeof r&&(null===ys?ys=new Set([this]):ys.add(this));var t=n.stack;this.componentDidCatch(n.value,{componentStack:null!==t?t:""})});return t}function Ui(e,n,t){var r=e.pingCache;if(null===r){r=e.pingCache=new Ri;var l=new Set;r.set(n,l)}else l=r.get(n),void 0===l&&(l=new Set,r.set(n,l));l.has(t)||(l.add(t),e=Js.bind(null,e,n,t),n.then(e,e))}function Vi(e){do{var n;if(n=13===e.tag)n=e.memoizedState,n=null!==n?null!==n.dehydrated?!0:!1:!0;if(n)return e;e=e.return}while(null!==e);return null}function Ai(e,n,t,r,l){if(0===(e.mode&1))return e===n?e.flags|=65536:(e.flags|=128,t.flags|=131072,t.flags&=-52805,1===t.tag&&(null===t.alternate?t.tag=17:(n=tu(-1,1),n.tag=2,ru(t,n,1))),t.lanes|=1),e;e.flags|=65536;e.lanes=l;return e}var Bi=x.ReactCurrentOwner,Hi=!1;function Wi(e,n,t,r){n.child=null===e?ku(n,null,t,r):bu(n,e.child,t,r)}function Qi(e,n,t,r,l){t=t.render;var a=n.ref;Ka(n,l);r=$u(e,n,t,r,a,l);t=Ku();if(null!==e&&!Hi)return n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~l,co(e,n,l);Na&&t&&xa(n);n.flags|=1;Wi(e,n,r,l);return n.child}function ji(e,n,t,r,l){if(null===e){var a=t.type;if("function"===typeof a&&!ic(a)&&void 0===a.defaultProps&&null===t.compare&&void 0===t.defaultProps)return n.tag=15,n.type=a,$i(e,n,a,r,l);e=cc(t.type,null,r,n,n.mode,l);e.ref=n.ref;e.return=n;return n.child=e}a=e.child;if(0===(e.lanes&l)){var u=a.memoizedProps;t=t.compare;t=null!==t?t:zr;if(t(u,r)&&e.ref===n.ref)return co(e,n,l)}n.flags|=1;e=sc(a,r);e.ref=n.ref;e.return=n;return n.child=e}function $i(e,n,t,r,l){if(null!==e){var a=e.memoizedProps;if(zr(a,r)&&e.ref===n.ref)if(Hi=!1,n.pendingProps=r=a,0!==(e.lanes&l))0!==(e.flags&131072)&&(Hi=!0);else return n.lanes=e.lanes,co(e,n,l)}return Yi(e,n,t,r,l)}function Ki(e,n,t){var r=n.pendingProps,l=r.children,a=null!==e?e.memoizedState:null;if("hidden"===r.mode)if(0===(n.mode&1))n.memoizedState={baseLanes:0,cachePool:null,transitions:null},ql(as,ls),ls|=t;else{if(0===(t&1073741824))return e=null!==a?a.baseLanes|t:t,n.lanes=n.childLanes=1073741824,n.memoizedState={baseLanes:e,cachePool:null,transitions:null},n.updateQueue=null,ql(as,ls),ls|=e,null;n.memoizedState={baseLanes:0,cachePool:null,transitions:null};r=null!==a?a.baseLanes:t;ql(as,ls);ls|=r}else null!==a?(r=a.baseLanes|t,n.memoizedState=null):r=t,ql(as,ls),ls|=r;Wi(e,n,l,t);return n.child}function qi(e,n){var t=n.ref;if(null===e&&null!==t||null!==e&&e.ref!==t)n.flags|=512,n.flags|=2097152}function Yi(e,n,t,r,l){var a=ea(t)?Zl:Xl.current;a=Jl(n,a);Ka(n,l);t=$u(e,n,t,r,a,l);r=Ku();if(null!==e&&!Hi)return n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~l,co(e,n,l);Na&&r&&xa(n);n.flags|=1;Wi(e,n,t,l);return n.child}function Xi(e,n,t,r,l){if(ea(t)){var a=!0;la(n)}else a=!1;Ka(n,l);if(null===n.stateNode)so(e,n),du(n,t,r),mu(n,t,r,l),r=!0;else if(null===e){var u=n.stateNode,i=n.memoizedProps;u.props=i;var o=u.context,s=t.contextType;"object"===typeof s&&null!==s?s=qa(s):(s=ea(t)?Zl:Xl.current,s=Jl(n,s));var c=t.getDerivedStateFromProps,f="function"===typeof c||"function"===typeof u.getSnapshotBeforeUpdate;f||"function"!==typeof u.UNSAFE_componentWillReceiveProps&&"function"!==typeof u.componentWillReceiveProps||(i!==r||o!==s)&&pu(n,u,r,s);Ja=!1;var d=n.memoizedState;u.state=d;uu(n,r,u,l);o=n.memoizedState;i!==r||d!==o||Gl.current||Ja?("function"===typeof c&&(su(n,t,c,r),o=n.memoizedState),(i=Ja||fu(n,t,i,r,d,o,s))?(f||"function"!==typeof u.UNSAFE_componentWillMount&&"function"!==typeof u.componentWillMount||("function"===typeof u.componentWillMount&&u.componentWillMount(),"function"===typeof u.UNSAFE_componentWillMount&&u.UNSAFE_componentWillMount()),"function"===typeof u.componentDidMount&&(n.flags|=4194308)):("function"===typeof u.componentDidMount&&(n.flags|=4194308),n.memoizedProps=r,n.memoizedState=o),u.props=r,u.state=o,u.context=s,r=i):("function"===typeof u.componentDidMount&&(n.flags|=4194308),r=!1)}else{u=n.stateNode;nu(e,n);i=n.memoizedProps;s=n.type===n.elementType?i:Va(n.type,i);u.props=s;f=n.pendingProps;d=u.context;o=t.contextType;"object"===typeof o&&null!==o?o=qa(o):(o=ea(t)?Zl:Xl.current,o=Jl(n,o));var p=t.getDerivedStateFromProps;(c="function"===typeof p||"function"===typeof u.getSnapshotBeforeUpdate)||"function"!==typeof u.UNSAFE_componentWillReceiveProps&&"function"!==typeof u.componentWillReceiveProps||(i!==f||d!==o)&&pu(n,u,r,o);Ja=!1;d=n.memoizedState;u.state=d;uu(n,r,u,l);var m=n.memoizedState;i!==f||d!==m||Gl.current||Ja?("function"===typeof p&&(su(n,t,p,r),m=n.memoizedState),(s=Ja||fu(n,t,s,r,d,m,o)||!1)?(c||"function"!==typeof u.UNSAFE_componentWillUpdate&&"function"!==typeof u.componentWillUpdate||("function"===typeof u.componentWillUpdate&&u.componentWillUpdate(r,m,o),"function"===typeof u.UNSAFE_componentWillUpdate&&u.UNSAFE_componentWillUpdate(r,m,o)),"function"===typeof u.componentDidUpdate&&(n.flags|=4),"function"===typeof u.getSnapshotBeforeUpdate&&(n.flags|=1024)):("function"!==typeof u.componentDidUpdate||i===e.memoizedProps&&d===e.memoizedState||(n.flags|=4),"function"!==typeof u.getSnapshotBeforeUpdate||i===e.memoizedProps&&d===e.memoizedState||(n.flags|=1024),n.memoizedProps=r,n.memoizedState=m),u.props=r,u.state=m,u.context=o,r=s):("function"!==typeof u.componentDidUpdate||i===e.memoizedProps&&d===e.memoizedState||(n.flags|=4),"function"!==typeof u.getSnapshotBeforeUpdate||i===e.memoizedProps&&d===e.memoizedState||(n.flags|=1024),r=!1)}return Gi(e,n,t,r,a,l)}function Gi(e,n,t,r,l,a){qi(e,n);var u=0!==(n.flags&128);if(!r&&!u)return l&&aa(n,t,!1),co(e,n,a);r=n.stateNode;Bi.current=n;var i=u&&"function"!==typeof t.getDerivedStateFromError?null:r.render();n.flags|=1;null!==e&&u?(n.child=bu(n,e.child,null,a),n.child=bu(n,null,i,a)):Wi(e,n,i,a);n.memoizedState=r.state;l&&aa(n,t,!0);return n.child}function Zi(e){var n=e.stateNode;n.pendingContext?ta(e,n.pendingContext,n.pendingContext!==n.context):n.context&&ta(e,n.context,!1);_u(e,n.containerInfo)}function Ji(e,n,t,r,l){Oa();Ia(l);n.flags|=256;Wi(e,n,t,r);return n.child}var eo={dehydrated:null,treeContext:null,retryLane:0};function no(e){return{baseLanes:e,cachePool:null,transitions:null}}function to(e,n,t){var r=n.pendingProps,l=Tu.current,a=!1,u=0!==(n.flags&128),i;(i=u)||(i=null!==e&&null===e.memoizedState?!1:0!==(l&2));if(i)a=!0,n.flags&=-129;else if(null===e||null!==e.memoizedState)l|=1;ql(Tu,l&1);if(null===e){Ma(n);e=n.memoizedState;if(null!==e&&(e=e.dehydrated,null!==e))return 0===(n.mode&1)?n.lanes=1:"$!"===e.data?n.lanes=8:n.lanes=1073741824,null;u=r.children;e=r.fallback;return a?(r=n.mode,a=n.child,u={mode:"hidden",children:u},0===(r&1)&&null!==a?(a.childLanes=0,a.pendingProps=u):a=dc(u,r,0,null),e=fc(e,r,t,null),a.return=n,e.return=n,a.sibling=e,n.child=a,n.child.memoizedState=no(t),n.memoizedState=eo,e):ro(n,u)}l=e.memoizedState;if(null!==l&&(i=l.dehydrated,null!==i))return ao(e,n,u,r,i,l,t);if(a){a=r.fallback;u=n.mode;l=e.child;i=l.sibling;var o={mode:"hidden",children:r.children};0===(u&1)&&n.child!==l?(r=n.child,r.childLanes=0,r.pendingProps=o,n.deletions=null):(r=sc(l,o),r.subtreeFlags=l.subtreeFlags&14680064);null!==i?a=sc(i,a):(a=fc(a,u,t,null),a.flags|=2);a.return=n;r.return=n;r.sibling=a;n.child=r;r=a;a=n.child;u=e.child.memoizedState;u=null===u?no(t):{baseLanes:u.baseLanes|t,cachePool:null,transitions:u.transitions};a.memoizedState=u;a.childLanes=e.childLanes&~t;n.memoizedState=eo;return r}a=e.child;e=a.sibling;r=sc(a,{mode:"visible",children:r.children});0===(n.mode&1)&&(r.lanes=t);r.return=n;r.sibling=null;null!==e&&(t=n.deletions,null===t?(n.deletions=[e],n.flags|=16):t.push(e));n.child=r;n.memoizedState=null;return r}function ro(e,n){n=dc({mode:"visible",children:n},e.mode,0,null);n.return=e;return e.child=n}function lo(e,n,t,r){null!==r&&Ia(r);bu(n,e.child,null,t);e=ro(n,n.pendingProps.children);e.flags|=2;n.memoizedState=null;return e}function ao(e,n,t,r,l,u,i){if(t){if(n.flags&256)return n.flags&=-257,r=Fi(Error(a(422))),lo(e,n,i,r);if(null!==n.memoizedState)return n.child=e.child,n.flags|=128,null;u=r.fallback;l=n.mode;r=dc({mode:"visible",children:r.children},l,0,null);u=fc(u,l,i,null);u.flags|=2;r.return=n;u.return=n;r.sibling=u;n.child=r;0!==(n.mode&1)&&bu(n,e.child,null,i);n.child.memoizedState=no(i);n.memoizedState=eo;return u}if(0===(n.mode&1))return lo(e,n,i,null);if("$!"===l.data){r=l.nextSibling&&l.nextSibling.dataset;if(r)var o=r.dgst;r=o;u=Error(a(419));r=Fi(u,r,void 0);return lo(e,n,i,r)}o=0!==(i&e.childLanes);if(Hi||o){r=ns;if(null!==r){switch(i&-i){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=0!==(l&(r.suspendedLanes|i))?0:l;0!==l&&l!==u.retryLane&&(u.retryLane=l,Za(e,l),zs(r,e,l,-1))}Hs();r=Fi(Error(a(421)));return lo(e,n,i,r)}if("$?"===l.data)return n.flags|=128,n.child=e.child,n=nc.bind(null,e),l._reactRetry=n,null;e=u.treeContext;_a=Ll(l.nextSibling);Ca=n;Na=!0;za=null;null!==e&&(ga[va++]=ba,ga[va++]=ka,ga[va++]=ya,ba=e.id,ka=e.overflow,ya=n);n=ro(n,r.children);n.flags|=4096;return n}function uo(e,n,t){e.lanes|=n;var r=e.alternate;null!==r&&(r.lanes|=n);$a(e.return,n,t)}function io(e,n,t,r,l){var a=e.memoizedState;null===a?e.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:r,tail:t,tailMode:l}:(a.isBackwards=n,a.rendering=null,a.renderingStartTime=0,a.last=r,a.tail=t,a.tailMode=l)}function oo(e,n,t){var r=n.pendingProps,l=r.revealOrder,a=r.tail;Wi(e,n,r.children,t);r=Tu.current;if(0!==(r&2))r=r&1|2,n.flags|=128;else{if(null!==e&&0!==(e.flags&128))e:for(e=n.child;null!==e;){if(13===e.tag)null!==e.memoizedState&&uo(e,t,n);else if(19===e.tag)uo(e,t,n);else if(null!==e.child){e.child.return=e;e=e.child;continue}if(e===n)break e;for(;null===e.sibling;){if(null===e.return||e.return===n)break e;e=e.return}e.sibling.return=e.return;e=e.sibling}r&=1}ql(Tu,r);if(0===(n.mode&1))n.memoizedState=null;else switch(l){case"forwards":t=n.child;for(l=null;null!==t;)e=t.alternate,null!==e&&null===Lu(e)&&(l=t),t=t.sibling;t=l;null===t?(l=n.child,n.child=null):(l=t.sibling,t.sibling=null);io(n,!1,l,t,a);break;case"backwards":t=null;l=n.child;for(n.child=null;null!==l;){e=l.alternate;if(null!==e&&null===Lu(e)){n.child=l;break}e=l.sibling;l.sibling=t;t=l;l=e}io(n,!0,t,null,a);break;case"together":io(n,!1,null,null,void 0);break;default:n.memoizedState=null}return n.child}function so(e,n){0===(n.mode&1)&&null!==e&&(e.alternate=null,n.alternate=null,n.flags|=2)}function co(e,n,t){null!==e&&(n.dependencies=e.dependencies);os|=n.lanes;if(0===(t&n.childLanes))return null;if(null!==e&&n.child!==e.child)throw Error(a(153));if(null!==n.child){e=n.child;t=sc(e,e.pendingProps);n.child=t;for(t.return=n;null!==e.sibling;)e=e.sibling,t=t.sibling=sc(e,e.pendingProps),t.return=n;t.sibling=null}return n.child}function fo(e,n,t){switch(n.tag){case 3:Zi(n);Oa();break;case 5:zu(n);break;case 1:ea(n.type)&&la(n);break;case 4:_u(n,n.stateNode.containerInfo);break;case 10:var r=n.type._context,l=n.memoizedProps.value;ql(Aa,r._currentValue);r._currentValue=l;break;case 13:r=n.memoizedState;if(null!==r){if(null!==r.dehydrated)return ql(Tu,Tu.current&1),n.flags|=128,null;if(0!==(t&n.child.childLanes))return to(e,n,t);ql(Tu,Tu.current&1);e=co(e,n,t);return null!==e?e.sibling:null}ql(Tu,Tu.current&1);break;case 19:r=0!==(t&n.childLanes);if(0!==(e.flags&128)){if(r)return oo(e,n,t);n.flags|=128}l=n.memoizedState;null!==l&&(l.rendering=null,l.tail=null,l.lastEffect=null);ql(Tu,Tu.current);if(r)break;else return null;case 22:case 23:return n.lanes=0,Ki(e,n,t)}return co(e,n,t)}var po,mo,ho,go;po=function(e,n){for(var t=n.child;null!==t;){if(5===t.tag||6===t.tag)e.appendChild(t.stateNode);else if(4!==t.tag&&null!==t.child){t.child.return=t;t=t.child;continue}if(t===n)break;for(;null===t.sibling;){if(null===t.return||t.return===n)return;t=t.return}t.sibling.return=t.return;t=t.sibling}};mo=function(){};ho=function(e,n,t,r){var l=e.memoizedProps;if(l!==r){e=n.stateNode;Cu(Su.current);var a=null;switch(t){case"input":l=J(e,l);r=J(e,r);a=[];break;case"select":l=V({},l,{value:void 0});r=V({},r,{value:void 0});a=[];break;case"textarea":l=ie(e,l);r=ie(e,r);a=[];break;default:"function"!==typeof l.onClick&&"function"===typeof r.onClick&&(e.onclick=wl)}we(t,r);var u;t=null;for(c in l)if(!r.hasOwnProperty(c)&&l.hasOwnProperty(c)&&null!=l[c])if("style"===c){var o=l[c];for(u in o)o.hasOwnProperty(u)&&(t||(t={}),t[u]="")}else"dangerouslySetInnerHTML"!==c&&"children"!==c&&"suppressContentEditableWarning"!==c&&"suppressHydrationWarning"!==c&&"autoFocus"!==c&&(i.hasOwnProperty(c)?a||(a=[]):(a=a||[]).push(c,null));for(c in r){var s=r[c];o=null!=l?l[c]:void 0;if(r.hasOwnProperty(c)&&s!==o&&(null!=s||null!=o))if("style"===c)if(o){for(u in o)!o.hasOwnProperty(u)||s&&s.hasOwnProperty(u)||(t||(t={}),t[u]="");for(u in s)s.hasOwnProperty(u)&&o[u]!==s[u]&&(t||(t={}),t[u]=s[u])}else t||(a||(a=[]),a.push(c,t)),t=s;else"dangerouslySetInnerHTML"===c?(s=s?s.__html:void 0,o=o?o.__html:void 0,null!=s&&o!==s&&(a=a||[]).push(c,s)):"children"===c?"string"!==typeof s&&"number"!==typeof s||(a=a||[]).push(c,""+s):"suppressContentEditableWarning"!==c&&"suppressHydrationWarning"!==c&&(i.hasOwnProperty(c)?(null!=s&&"onScroll"===c&&il("scroll",e),a||o===s||(a=[])):(a=a||[]).push(c,s))}t&&(a=a||[]).push("style",t);var c=a;if(n.updateQueue=c)n.flags|=4}};go=function(e,n,t,r){t!==r&&(n.flags|=4)};function vo(e,n){if(!Na)switch(e.tailMode){case"hidden":n=e.tail;for(var t=null;null!==n;)null!==n.alternate&&(t=n),n=n.sibling;null===t?e.tail=null:t.sibling=null;break;case"collapsed":t=e.tail;for(var r=null;null!==t;)null!==t.alternate&&(r=t),t=t.sibling;null===r?n||null===e.tail?e.tail=null:e.tail.sibling=null:r.sibling=null}}function yo(e){var n=null!==e.alternate&&e.alternate.child===e.child,t=0,r=0;if(n)for(var l=e.child;null!==l;)t|=l.lanes|l.childLanes,r|=l.subtreeFlags&14680064,r|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;null!==l;)t|=l.lanes|l.childLanes,r|=l.subtreeFlags,r|=l.flags,l.return=e,l=l.sibling;e.subtreeFlags|=r;e.childLanes=t;return n}function bo(e,n,t){var r=n.pendingProps;Ea(n);switch(n.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return yo(n),null;case 1:return ea(n.type)&&na(),yo(n),null;case 3:r=n.stateNode;Nu();Kl(Gl);Kl(Xl);Fu();r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null);if(null===e||null===e.child)Da(n)?n.flags|=4:null===e||e.memoizedState.isDehydrated&&0===(n.flags&256)||(n.flags|=1024,null!==za&&(Ms(za),za=null));mo(e,n);yo(n);return null;case 5:Pu(n);var l=Cu(Eu.current);t=n.type;if(null!==e&&null!=n.stateNode)ho(e,n,t,r,l),e.ref!==n.ref&&(n.flags|=512,n.flags|=2097152);else{if(!r){if(null===n.stateNode)throw Error(a(166));yo(n);return null}e=Cu(Su.current);if(Da(n)){r=n.stateNode;t=n.type;var u=n.memoizedProps;r[Dl]=n;r[Rl]=u;e=0!==(n.mode&1);switch(t){case"dialog":il("cancel",r);il("close",r);break;case"iframe":case"object":case"embed":il("load",r);break;case"video":case"audio":for(l=0;l<rl.length;l++)il(rl[l],r);break;case"source":il("error",r);break;case"img":case"image":case"link":il("error",r);il("load",r);break;case"details":il("toggle",r);break;case"input":ee(r,u);il("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!u.multiple};il("invalid",r);break;case"textarea":oe(r,u),il("invalid",r)}we(t,u);l=null;for(var o in u)if(u.hasOwnProperty(o)){var s=u[o];"children"===o?"string"===typeof s?r.textContent!==s&&(!0!==u.suppressHydrationWarning&&kl(r.textContent,s,e),l=["children",s]):"number"===typeof s&&r.textContent!==""+s&&(!0!==u.suppressHydrationWarning&&kl(r.textContent,s,e),l=["children",""+s]):i.hasOwnProperty(o)&&null!=s&&"onScroll"===o&&il("scroll",r)}switch(t){case"input":X(r);re(r,u,!0);break;case"textarea":X(r);ce(r);break;case"select":case"option":break;default:"function"===typeof u.onClick&&(r.onclick=wl)}r=l;n.updateQueue=r;null!==r&&(n.flags|=4)}else{o=9===l.nodeType?l:l.ownerDocument;"http://www.w3.org/1999/xhtml"===e&&(e=fe(t));"http://www.w3.org/1999/xhtml"===e?"script"===t?(e=o.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):"string"===typeof r.is?e=o.createElement(t,{is:r.is}):(e=o.createElement(t),"select"===t&&(o=e,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):e=o.createElementNS(e,t);e[Dl]=n;e[Rl]=r;po(e,n,!1,!1);n.stateNode=e;e:{o=Se(t,r);switch(t){case"dialog":il("cancel",e);il("close",e);l=r;break;case"iframe":case"object":case"embed":il("load",e);l=r;break;case"video":case"audio":for(l=0;l<rl.length;l++)il(rl[l],e);l=r;break;case"source":il("error",e);l=r;break;case"img":case"image":case"link":il("error",e);il("load",e);l=r;break;case"details":il("toggle",e);l=r;break;case"input":ee(e,r);l=J(e,r);il("invalid",e);break;case"option":l=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple};l=V({},r,{value:void 0});il("invalid",e);break;case"textarea":oe(e,r);l=ie(e,r);il("invalid",e);break;default:l=r}we(t,l);s=l;for(u in s)if(s.hasOwnProperty(u)){var c=s[u];"style"===u?be(e,c):"dangerouslySetInnerHTML"===u?(c=c?c.__html:void 0,null!=c&&me(e,c)):"children"===u?"string"===typeof c?("textarea"!==t||""!==c)&&he(e,c):"number"===typeof c&&he(e,""+c):"suppressContentEditableWarning"!==u&&"suppressHydrationWarning"!==u&&"autoFocus"!==u&&(i.hasOwnProperty(u)?null!=c&&"onScroll"===u&&il("scroll",e):null!=c&&S(e,u,c,o))}switch(t){case"input":X(e);re(e,r,!1);break;case"textarea":X(e);ce(e);break;case"option":null!=r.value&&e.setAttribute("value",""+K(r.value));break;case"select":e.multiple=!!r.multiple;u=r.value;null!=u?ue(e,!!r.multiple,u,!1):null!=r.defaultValue&&ue(e,!!r.multiple,r.defaultValue,!0);break;default:"function"===typeof l.onClick&&(e.onclick=wl)}switch(t){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(n.flags|=4)}null!==n.ref&&(n.flags|=512,n.flags|=2097152)}yo(n);return null;case 6:if(e&&null!=n.stateNode)go(e,n,e.memoizedProps,r);else{if("string"!==typeof r&&null===n.stateNode)throw Error(a(166));t=Cu(Eu.current);Cu(Su.current);if(Da(n)){r=n.stateNode;t=n.memoizedProps;r[Dl]=n;if(u=r.nodeValue!==t)if(e=Ca,null!==e)switch(e.tag){case 3:kl(r.nodeValue,t,0!==(e.mode&1));break;case 5:!0!==e.memoizedProps.suppressHydrationWarning&&kl(r.nodeValue,t,0!==(e.mode&1))}u&&(n.flags|=4)}else r=(9===t.nodeType?t:t.ownerDocument).createTextNode(r),r[Dl]=n,n.stateNode=r}yo(n);return null;case 13:Kl(Tu);r=n.memoizedState;if(null===e||null!==e.memoizedState&&null!==e.memoizedState.dehydrated){if(Na&&null!==_a&&0!==(n.mode&1)&&0===(n.flags&128))Ra(),Oa(),n.flags|=98560,u=!1;else if(u=Da(n),null!==r&&null!==r.dehydrated){if(null===e){if(!u)throw Error(a(318));u=n.memoizedState;u=null!==u?u.dehydrated:null;if(!u)throw Error(a(317));u[Dl]=n}else Oa(),0===(n.flags&128)&&(n.memoizedState=null),n.flags|=4;yo(n);u=!1}else null!==za&&(Ms(za),za=null),u=!0;if(!u)return n.flags&65536?n:null}if(0!==(n.flags&128))return n.lanes=t,n;r=null!==r;r!==(null!==e&&null!==e.memoizedState)&&r&&(n.child.flags|=8192,0!==(n.mode&1)&&(null===e||0!==(Tu.current&1)?0===us&&(us=3):Hs()));null!==n.updateQueue&&(n.flags|=4);yo(n);return null;case 4:return Nu(),mo(e,n),null===e&&cl(n.stateNode.containerInfo),yo(n),null;case 10:return ja(n.type._context),yo(n),null;case 17:return ea(n.type)&&na(),yo(n),null;case 19:Kl(Tu);u=n.memoizedState;if(null===u)return yo(n),null;r=0!==(n.flags&128);o=u.rendering;if(null===o)if(r)vo(u,!1);else{if(0!==us||null!==e&&0!==(e.flags&128))for(e=n.child;null!==e;){o=Lu(e);if(null!==o){n.flags|=128;vo(u,!1);r=o.updateQueue;null!==r&&(n.updateQueue=r,n.flags|=4);n.subtreeFlags=0;r=t;for(t=n.child;null!==t;)u=t,e=r,u.flags&=14680066,o=u.alternate,null===o?(u.childLanes=0,u.lanes=e,u.child=null,u.subtreeFlags=0,u.memoizedProps=null,u.memoizedState=null,u.updateQueue=null,u.dependencies=null,u.stateNode=null):(u.childLanes=o.childLanes,u.lanes=o.lanes,u.child=o.child,u.subtreeFlags=0,u.deletions=null,u.memoizedProps=o.memoizedProps,u.memoizedState=o.memoizedState,u.updateQueue=o.updateQueue,u.type=o.type,e=o.dependencies,u.dependencies=null===e?null:{lanes:e.lanes,firstContext:e.firstContext}),t=t.sibling;ql(Tu,Tu.current&1|2);return n.child}e=e.sibling}null!==u.tail&&tn()>ms&&(n.flags|=128,r=!0,vo(u,!1),n.lanes=4194304)}else{if(!r)if(e=Lu(o),null!==e){if(n.flags|=128,r=!0,t=e.updateQueue,null!==t&&(n.updateQueue=t,n.flags|=4),vo(u,!0),null===u.tail&&"hidden"===u.tailMode&&!o.alternate&&!Na)return yo(n),null}else 2*tn()-u.renderingStartTime>ms&&1073741824!==t&&(n.flags|=128,r=!0,vo(u,!1),n.lanes=4194304);u.isBackwards?(o.sibling=n.child,n.child=o):(t=u.last,null!==t?t.sibling=o:n.child=o,u.last=o)}if(null!==u.tail)return n=u.tail,u.rendering=n,u.tail=n.sibling,u.renderingStartTime=tn(),n.sibling=null,t=Tu.current,ql(Tu,r?t&1|2:t&1),n;yo(n);return null;case 22:case 23:return Us(),r=null!==n.memoizedState,null!==e&&null!==e.memoizedState!==r&&(n.flags|=8192),r&&0!==(n.mode&1)?0!==(ls&1073741824)&&(yo(n),n.subtreeFlags&6&&(n.flags|=8192)):yo(n),null;case 24:return null;case 25:return null}throw Error(a(156,n.tag))}function ko(e,n){Ea(n);switch(n.tag){case 1:return ea(n.type)&&na(),e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 3:return Nu(),Kl(Gl),Kl(Xl),Fu(),e=n.flags,0!==(e&65536)&&0===(e&128)?(n.flags=e&-65537|128,n):null;case 5:return Pu(n),null;case 13:Kl(Tu);e=n.memoizedState;if(null!==e&&null!==e.dehydrated){if(null===n.alternate)throw Error(a(340));Oa()}e=n.flags;return e&65536?(n.flags=e&-65537|128,n):null;case 19:return Kl(Tu),null;case 4:return Nu(),null;case 10:return ja(n.type._context),null;case 22:case 23:return Us(),null;case 24:return null;default:return null}}var wo=!1,So=!1,xo="function"===typeof WeakSet?WeakSet:Set,Eo=null;function Co(e,n){var t=e.ref;if(null!==t)if("function"===typeof t)try{t(null)}catch(r){Zs(e,n,r)}else t.current=null}function _o(e,n,t){try{t()}catch(r){Zs(e,n,r)}}var No=!1;function zo(e,n){Sl=nt;e=Mr();if(Fr(e)){if("selectionStart"in e)var t={start:e.selectionStart,end:e.selectionEnd};else e:{t=(t=e.ownerDocument)&&t.defaultView||window;var r=t.getSelection&&t.getSelection();if(r&&0!==r.rangeCount){t=r.anchorNode;var l=r.anchorOffset,u=r.focusNode;r=r.focusOffset;try{t.nodeType,u.nodeType}catch(w){t=null;break e}var i=0,o=-1,s=-1,c=0,f=0,d=e,p=null;n:for(;;){for(var m;;){d!==t||0!==l&&3!==d.nodeType||(o=i+l);d!==u||0!==r&&3!==d.nodeType||(s=i+r);3===d.nodeType&&(i+=d.nodeValue.length);if(null===(m=d.firstChild))break;p=d;d=m}for(;;){if(d===e)break n;p===t&&++c===l&&(o=i);p===u&&++f===r&&(s=i);if(null!==(m=d.nextSibling))break;d=p;p=d.parentNode}d=m}t=-1===o||-1===s?null:{start:o,end:s}}else t=null}t=t||{start:0,end:0}}else t=null;xl={focusedElem:e,selectionRange:t};nt=!1;for(Eo=n;null!==Eo;)if(n=Eo,e=n.child,0!==(n.subtreeFlags&1028)&&null!==e)e.return=n,Eo=e;else for(;null!==Eo;){n=Eo;try{var h=n.alternate;if(0!==(n.flags&1024))switch(n.tag){case 0:case 11:case 15:break;case 1:if(null!==h){var g=h.memoizedProps,v=h.memoizedState,y=n.stateNode,b=y.getSnapshotBeforeUpdate(n.elementType===n.type?g:Va(n.type,g),v);y.__reactInternalSnapshotBeforeUpdate=b}break;case 3:var k=n.stateNode.containerInfo;1===k.nodeType?k.textContent="":9===k.nodeType&&k.documentElement&&k.removeChild(k.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(a(163))}}catch(w){Zs(n,n.return,w)}e=n.sibling;if(null!==e){e.return=n.return;Eo=e;break}Eo=n.return}h=No;No=!1;return h}function Po(e,n,t){var r=n.updateQueue;r=null!==r?r.lastEffect:null;if(null!==r){var l=r=r.next;do{if((l.tag&e)===e){var a=l.destroy;l.destroy=void 0;void 0!==a&&_o(n,t,a)}l=l.next}while(l!==r)}}function To(e,n){n=n.updateQueue;n=null!==n?n.lastEffect:null;if(null!==n){var t=n=n.next;do{if((t.tag&e)===e){var r=t.create;t.destroy=r()}t=t.next}while(t!==n)}}function Lo(e){var n=e.ref;if(null!==n){var t=e.stateNode;switch(e.tag){case 5:e=t;break;default:e=t}"function"===typeof n?n(e):n.current=e}}function Mo(e){var n=e.alternate;null!==n&&(e.alternate=null,Mo(n));e.child=null;e.deletions=null;e.sibling=null;5===e.tag&&(n=e.stateNode,null!==n&&(delete n[Dl],delete n[Rl],delete n[Il],delete n[Ul],delete n[Vl]));e.stateNode=null;e.return=null;e.dependencies=null;e.memoizedProps=null;e.memoizedState=null;e.pendingProps=null;e.stateNode=null;e.updateQueue=null}function Fo(e){return 5===e.tag||3===e.tag||4===e.tag}function Do(e){e:for(;;){for(;null===e.sibling;){if(null===e.return||Fo(e.return))return null;e=e.return}e.sibling.return=e.return;for(e=e.sibling;5!==e.tag&&6!==e.tag&&18!==e.tag;){if(e.flags&2)continue e;if(null===e.child||4===e.tag)continue e;else e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Ro(e,n,t){var r=e.tag;if(5===r||6===r)e=e.stateNode,n?8===t.nodeType?t.parentNode.insertBefore(e,n):t.insertBefore(e,n):(8===t.nodeType?(n=t.parentNode,n.insertBefore(e,t)):(n=t,n.appendChild(e)),t=t._reactRootContainer,null!==t&&void 0!==t||null!==n.onclick||(n.onclick=wl));else if(4!==r&&(e=e.child,null!==e))for(Ro(e,n,t),e=e.sibling;null!==e;)Ro(e,n,t),e=e.sibling}function Oo(e,n,t){var r=e.tag;if(5===r||6===r)e=e.stateNode,n?t.insertBefore(e,n):t.appendChild(e);else if(4!==r&&(e=e.child,null!==e))for(Oo(e,n,t),e=e.sibling;null!==e;)Oo(e,n,t),e=e.sibling}var Io=null,Uo=!1;function Vo(e,n,t){for(t=t.child;null!==t;)Ao(e,n,t),t=t.sibling}function Ao(e,n,t){if(fn&&"function"===typeof fn.onCommitFiberUnmount)try{fn.onCommitFiberUnmount(cn,t)}catch(i){}switch(t.tag){case 5:So||Co(t,n);case 6:var r=Io,l=Uo;Io=null;Vo(e,n,t);Io=r;Uo=l;null!==Io&&(Uo?(e=Io,t=t.stateNode,8===e.nodeType?e.parentNode.removeChild(t):e.removeChild(t)):Io.removeChild(t.stateNode));break;case 18:null!==Io&&(Uo?(e=Io,t=t.stateNode,8===e.nodeType?Tl(e.parentNode,t):1===e.nodeType&&Tl(e,t),Jn(e)):Tl(Io,t.stateNode));break;case 4:r=Io;l=Uo;Io=t.stateNode.containerInfo;Uo=!0;Vo(e,n,t);Io=r;Uo=l;break;case 0:case 11:case 14:case 15:if(!So&&(r=t.updateQueue,null!==r&&(r=r.lastEffect,null!==r))){l=r=r.next;do{var a=l,u=a.destroy;a=a.tag;void 0!==u&&(0!==(a&2)?_o(t,n,u):0!==(a&4)&&_o(t,n,u));l=l.next}while(l!==r)}Vo(e,n,t);break;case 1:if(!So&&(Co(t,n),r=t.stateNode,"function"===typeof r.componentWillUnmount))try{r.props=t.memoizedProps,r.state=t.memoizedState,r.componentWillUnmount()}catch(i){Zs(t,n,i)}Vo(e,n,t);break;case 21:Vo(e,n,t);break;case 22:t.mode&1?(So=(r=So)||null!==t.memoizedState,Vo(e,n,t),So=r):Vo(e,n,t);break;default:Vo(e,n,t)}}function Bo(e){var n=e.updateQueue;if(null!==n){e.updateQueue=null;var t=e.stateNode;null===t&&(t=e.stateNode=new xo);n.forEach((function(n){var r=tc.bind(null,e,n);t.has(n)||(t.add(n),n.then(r,r))}))}}function Ho(e,n){var t=n.deletions;if(null!==t)for(var r=0;r<t.length;r++){var l=t[r];try{var u=e,i=n,o=i;e:for(;null!==o;){switch(o.tag){case 5:Io=o.stateNode;Uo=!1;break e;case 3:Io=o.stateNode.containerInfo;Uo=!0;break e;case 4:Io=o.stateNode.containerInfo;Uo=!0;break e}o=o.return}if(null===Io)throw Error(a(160));Ao(u,i,l);Io=null;Uo=!1;var s=l.alternate;null!==s&&(s.return=null);l.return=null}catch(c){Zs(l,n,c)}}if(n.subtreeFlags&12854)for(n=n.child;null!==n;)Wo(n,e),n=n.sibling}function Wo(e,n){var t=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:Ho(n,e);Qo(e);if(r&4){try{Po(3,e,e.return),To(3,e)}catch(g){Zs(e,e.return,g)}try{Po(5,e,e.return)}catch(g){Zs(e,e.return,g)}}break;case 1:Ho(n,e);Qo(e);r&512&&null!==t&&Co(t,t.return);break;case 5:Ho(n,e);Qo(e);r&512&&null!==t&&Co(t,t.return);if(e.flags&32){var l=e.stateNode;try{he(l,"")}catch(g){Zs(e,e.return,g)}}if(r&4&&(l=e.stateNode,null!=l)){var u=e.memoizedProps,i=null!==t?t.memoizedProps:u,o=e.type,s=e.updateQueue;e.updateQueue=null;if(null!==s)try{"input"===o&&"radio"===u.type&&null!=u.name&&ne(l,u);Se(o,i);var c=Se(o,u);for(i=0;i<s.length;i+=2){var f=s[i],d=s[i+1];"style"===f?be(l,d):"dangerouslySetInnerHTML"===f?me(l,d):"children"===f?he(l,d):S(l,f,d,c)}switch(o){case"input":te(l,u);break;case"textarea":se(l,u);break;case"select":var p=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!u.multiple;var m=u.value;null!=m?ue(l,!!u.multiple,m,!1):p!==!!u.multiple&&(null!=u.defaultValue?ue(l,!!u.multiple,u.defaultValue,!0):ue(l,!!u.multiple,u.multiple?[]:"",!1))}l[Rl]=u}catch(g){Zs(e,e.return,g)}}break;case 6:Ho(n,e);Qo(e);if(r&4){if(null===e.stateNode)throw Error(a(162));l=e.stateNode;u=e.memoizedProps;try{l.nodeValue=u}catch(g){Zs(e,e.return,g)}}break;case 3:Ho(n,e);Qo(e);if(r&4&&null!==t&&t.memoizedState.isDehydrated)try{Jn(n.containerInfo)}catch(g){Zs(e,e.return,g)}break;case 4:Ho(n,e);Qo(e);break;case 13:Ho(n,e);Qo(e);l=e.child;l.flags&8192&&(u=null!==l.memoizedState,l.stateNode.isHidden=u,!u||null!==l.alternate&&null!==l.alternate.memoizedState||(ps=tn()));r&4&&Bo(e);break;case 22:f=null!==t&&null!==t.memoizedState;e.mode&1?(So=(c=So)||f,Ho(n,e),So=c):Ho(n,e);Qo(e);if(r&8192){c=null!==e.memoizedState;if((e.stateNode.isHidden=c)&&!f&&0!==(e.mode&1))for(Eo=e,f=e.child;null!==f;){for(d=Eo=f;null!==Eo;){p=Eo;m=p.child;switch(p.tag){case 0:case 11:case 14:case 15:Po(4,p,p.return);break;case 1:Co(p,p.return);var h=p.stateNode;if("function"===typeof h.componentWillUnmount){r=p;t=p.return;try{n=r,h.props=n.memoizedProps,h.state=n.memoizedState,h.componentWillUnmount()}catch(g){Zs(r,t,g)}}break;case 5:Co(p,p.return);break;case 22:if(null!==p.memoizedState){qo(d);continue}}null!==m?(m.return=p,Eo=m):qo(d)}f=f.sibling}e:for(f=null,d=e;;){if(5===d.tag){if(null===f){f=d;try{l=d.stateNode,c?(u=l.style,"function"===typeof u.setProperty?u.setProperty("display","none","important"):u.display="none"):(o=d.stateNode,s=d.memoizedProps.style,i=void 0!==s&&null!==s&&s.hasOwnProperty("display")?s.display:null,o.style.display=ye("display",i))}catch(g){Zs(e,e.return,g)}}}else if(6===d.tag){if(null===f)try{d.stateNode.nodeValue=c?"":d.memoizedProps}catch(g){Zs(e,e.return,g)}}else if((22!==d.tag&&23!==d.tag||null===d.memoizedState||d===e)&&null!==d.child){d.child.return=d;d=d.child;continue}if(d===e)break e;for(;null===d.sibling;){if(null===d.return||d.return===e)break e;f===d&&(f=null);d=d.return}f===d&&(f=null);d.sibling.return=d.return;d=d.sibling}}break;case 19:Ho(n,e);Qo(e);r&4&&Bo(e);break;case 21:break;default:Ho(n,e),Qo(e)}}function Qo(e){var n=e.flags;if(n&2){try{e:{for(var t=e.return;null!==t;){if(Fo(t)){var r=t;break e}t=t.return}throw Error(a(160))}switch(r.tag){case 5:var l=r.stateNode;r.flags&32&&(he(l,""),r.flags&=-33);var u=Do(e);Oo(e,u,l);break;case 3:case 4:var i=r.stateNode.containerInfo,o=Do(e);Ro(e,o,i);break;default:throw Error(a(161))}}catch(s){Zs(e,e.return,s)}e.flags&=-3}n&4096&&(e.flags&=-4097)}function jo(e,n,t){Eo=e;$o(e,n,t)}function $o(e,n,t){for(var r=0!==(e.mode&1);null!==Eo;){var l=Eo,a=l.child;if(22===l.tag&&r){var u=null!==l.memoizedState||wo;if(!u){var i=l.alternate,o=null!==i&&null!==i.memoizedState||So;i=wo;var s=So;wo=u;if((So=o)&&!s)for(Eo=l;null!==Eo;)u=Eo,o=u.child,22===u.tag&&null!==u.memoizedState?Yo(l):null!==o?(o.return=u,Eo=o):Yo(l);for(;null!==a;)Eo=a,$o(a,n,t),a=a.sibling;Eo=l;wo=i;So=s}Ko(e,n,t)}else 0!==(l.subtreeFlags&8772)&&null!==a?(a.return=l,Eo=a):Ko(e,n,t)}}function Ko(e){for(;null!==Eo;){var n=Eo;if(0!==(n.flags&8772)){var t=n.alternate;try{if(0!==(n.flags&8772))switch(n.tag){case 0:case 11:case 15:So||To(5,n);break;case 1:var r=n.stateNode;if(n.flags&4&&!So)if(null===t)r.componentDidMount();else{var l=n.elementType===n.type?t.memoizedProps:Va(n.type,t.memoizedProps);r.componentDidUpdate(l,t.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var u=n.updateQueue;null!==u&&iu(n,u,r);break;case 3:var i=n.updateQueue;if(null!==i){t=null;if(null!==n.child)switch(n.child.tag){case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}iu(n,i,t)}break;case 5:var o=n.stateNode;if(null===t&&n.flags&4){t=o;var s=n.memoizedProps;switch(n.type){case"button":case"input":case"select":case"textarea":s.autoFocus&&t.focus();break;case"img":s.src&&(t.src=s.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(null===n.memoizedState){var c=n.alternate;if(null!==c){var f=c.memoizedState;if(null!==f){var d=f.dehydrated;null!==d&&Jn(d)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(a(163))}So||n.flags&512&&Lo(n)}catch(p){Zs(n,n.return,p)}}if(n===e){Eo=null;break}t=n.sibling;if(null!==t){t.return=n.return;Eo=t;break}Eo=n.return}}function qo(e){for(;null!==Eo;){var n=Eo;if(n===e){Eo=null;break}var t=n.sibling;if(null!==t){t.return=n.return;Eo=t;break}Eo=n.return}}function Yo(e){for(;null!==Eo;){var n=Eo;try{switch(n.tag){case 0:case 11:case 15:var t=n.return;try{To(4,n)}catch(o){Zs(n,t,o)}break;case 1:var r=n.stateNode;if("function"===typeof r.componentDidMount){var l=n.return;try{r.componentDidMount()}catch(o){Zs(n,l,o)}}var a=n.return;try{Lo(n)}catch(o){Zs(n,a,o)}break;case 5:var u=n.return;try{Lo(n)}catch(o){Zs(n,u,o)}}}catch(o){Zs(n,n.return,o)}if(n===e){Eo=null;break}var i=n.sibling;if(null!==i){i.return=n.return;Eo=i;break}Eo=n.return}}var Xo=Math.ceil,Go=x.ReactCurrentDispatcher,Zo=x.ReactCurrentOwner,Jo=x.ReactCurrentBatchConfig,es=0,ns=null,ts=null,rs=0,ls=0,as=$l(0),us=0,is=null,os=0,ss=0,cs=0,fs=null,ds=null,ps=0,ms=Infinity,hs=null,gs=!1,vs=null,ys=null,bs=!1,ks=null,ws=0,Ss=0,xs=null,Es=-1,Cs=0;function _s(){return 0!==(es&6)?tn():-1!==Es?Es:Es=tn()}function Ns(e){if(0===(e.mode&1))return 1;if(0!==(es&2)&&0!==rs)return rs&-rs;if(null!==Ua.transition)return 0===Cs&&(Cs=En()),Cs;e=Pn;if(0!==e)return e;e=window.event;e=void 0===e?16:it(e.type);return e}function zs(e,n,t,r){if(50<Ss)throw Ss=0,xs=null,Error(a(185));_n(e,t,r);if(0===(es&2)||e!==ns)e===ns&&(0===(es&2)&&(ss|=t),4===us&&Ds(e,rs)),Ps(e,r),1===t&&0===es&&0===(n.mode&1)&&(ms=tn()+500,ia&&fa())}function Ps(e,n){var t=e.callbackNode;Sn(e,n);var r=kn(e,e===ns?rs:0);if(0===r)null!==t&&Je(t),e.callbackNode=null,e.callbackPriority=0;else if(n=r&-r,e.callbackPriority!==n){null!=t&&Je(t);if(1===n)0===e.tag?ca(Rs.bind(null,e)):sa(Rs.bind(null,e)),zl((function(){0===(es&6)&&fa()})),t=null;else{switch(Tn(r)){case 1:t=ln;break;case 4:t=an;break;case 16:t=un;break;case 536870912:t=sn;break;default:t=un}t=lc(t,Ts.bind(null,e))}e.callbackPriority=n;e.callbackNode=t}}function Ts(e,n){Es=-1;Cs=0;if(0!==(es&6))throw Error(a(327));var t=e.callbackNode;if(Xs()&&e.callbackNode!==t)return null;var r=kn(e,e===ns?rs:0);if(0===r)return null;if(0!==(r&30)||0!==(r&e.expiredLanes)||n)n=Ws(e,r);else{n=r;var l=es;es|=2;var u=Bs();if(ns!==e||rs!==n)hs=null,ms=tn()+500,Vs(e,n);do{try{js();break}catch(o){As(e,o)}}while(1);Qa();Go.current=u;es=l;null!==ts?n=0:(ns=null,rs=0,n=us)}if(0!==n){2===n&&(l=xn(e),0!==l&&(r=l,n=Ls(e,l)));if(1===n)throw t=is,Vs(e,0),Ds(e,r),Ps(e,tn()),t;if(6===n)Ds(e,r);else{l=e.current.alternate;if(0===(r&30)&&!Fs(l)&&(n=Ws(e,r),2===n&&(u=xn(e),0!==u&&(r=u,n=Ls(e,u))),1===n))throw t=is,Vs(e,0),Ds(e,r),Ps(e,tn()),t;e.finishedWork=l;e.finishedLanes=r;switch(n){case 0:case 1:throw Error(a(345));case 2:qs(e,ds,hs);break;case 3:Ds(e,r);if((r&130023424)===r&&(n=ps+500-tn(),10<n)){if(0!==kn(e,0))break;l=e.suspendedLanes;if((l&r)!==r){_s();e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=Cl(qs.bind(null,e,ds,hs),n);break}qs(e,ds,hs);break;case 4:Ds(e,r);if((r&4194240)===r)break;n=e.eventTimes;for(l=-1;0<r;){var i=31-pn(r);u=1<<i;i=n[i];i>l&&(l=i);r&=~u}r=l;r=tn()-r;r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*Xo(r/1960))-r;if(10<r){e.timeoutHandle=Cl(qs.bind(null,e,ds,hs),r);break}qs(e,ds,hs);break;case 5:qs(e,ds,hs);break;default:throw Error(a(329))}}}Ps(e,tn());return e.callbackNode===t?Ts.bind(null,e):null}function Ls(e,n){var t=fs;e.current.memoizedState.isDehydrated&&(Vs(e,n).flags|=256);e=Ws(e,n);2!==e&&(n=ds,ds=t,null!==n&&Ms(n));return e}function Ms(e){null===ds?ds=e:ds.push.apply(ds,e)}function Fs(e){for(var n=e;;){if(n.flags&16384){var t=n.updateQueue;if(null!==t&&(t=t.stores,null!==t))for(var r=0;r<t.length;r++){var l=t[r],a=l.getSnapshot;l=l.value;try{if(!Nr(a(),l))return!1}catch(u){return!1}}}t=n.child;if(n.subtreeFlags&16384&&null!==t)t.return=n,n=t;else{if(n===e)break;for(;null===n.sibling;){if(null===n.return||n.return===e)return!0;n=n.return}n.sibling.return=n.return;n=n.sibling}}return!0}function Ds(e,n){n&=~cs;n&=~ss;e.suspendedLanes|=n;e.pingedLanes&=~n;for(e=e.expirationTimes;0<n;){var t=31-pn(n),r=1<<t;e[t]=-1;n&=~r}}function Rs(e){if(0!==(es&6))throw Error(a(327));Xs();var n=kn(e,0);if(0===(n&1))return Ps(e,tn()),null;var t=Ws(e,n);if(0!==e.tag&&2===t){var r=xn(e);0!==r&&(n=r,t=Ls(e,r))}if(1===t)throw t=is,Vs(e,0),Ds(e,n),Ps(e,tn()),t;if(6===t)throw Error(a(345));e.finishedWork=e.current.alternate;e.finishedLanes=n;qs(e,ds,hs);Ps(e,tn());return null}function Os(e,n){var t=es;es|=1;try{return e(n)}finally{es=t,0===es&&(ms=tn()+500,ia&&fa())}}function Is(e){null!==ks&&0===ks.tag&&0===(es&6)&&Xs();var n=es;es|=1;var t=Jo.transition,r=Pn;try{if(Jo.transition=null,Pn=1,e)return e()}finally{Pn=r,Jo.transition=t,es=n,0===(es&6)&&fa()}}function Us(){ls=as.current;Kl(as)}function Vs(e,n){e.finishedWork=null;e.finishedLanes=0;var t=e.timeoutHandle;-1!==t&&(e.timeoutHandle=-1,_l(t));if(null!==ts)for(t=ts.return;null!==t;){var r=t;Ea(r);switch(r.tag){case 1:r=r.type.childContextTypes;null!==r&&void 0!==r&&na();break;case 3:Nu();Kl(Gl);Kl(Xl);Fu();break;case 5:Pu(r);break;case 4:Nu();break;case 13:Kl(Tu);break;case 19:Kl(Tu);break;case 10:ja(r.type._context);break;case 22:case 23:Us()}t=t.return}ns=e;ts=e=sc(e.current,null);rs=ls=n;us=0;is=null;cs=ss=os=0;ds=fs=null;if(null!==Ya){for(n=0;n<Ya.length;n++)if(t=Ya[n],r=t.interleaved,null!==r){t.interleaved=null;var l=r.next,a=t.pending;if(null!==a){var u=a.next;a.next=l;r.next=u}t.pending=r}Ya=null}return e}function As(e,n){do{var t=ts;try{Qa();Du.current=zi;if(Au){for(var r=Iu.memoizedState;null!==r;){var l=r.queue;null!==l&&(l.pending=null);r=r.next}Au=!1}Ou=0;Vu=Uu=Iu=null;Bu=!1;Hu=0;Zo.current=null;if(null===t||null===t.return){us=1;is=n;ts=null;break}e:{var u=e,i=t.return,o=t,s=n;n=rs;o.flags|=32768;if(null!==s&&"object"===typeof s&&"function"===typeof s.then){var c=s,f=o,d=f.tag;if(0===(f.mode&1)&&(0===d||11===d||15===d)){var p=f.alternate;p?(f.updateQueue=p.updateQueue,f.memoizedState=p.memoizedState,f.lanes=p.lanes):(f.updateQueue=null,f.memoizedState=null)}var m=Vi(i);if(null!==m){m.flags&=-257;Ai(m,i,o,u,n);m.mode&1&&Ui(u,c,n);n=m;s=c;var h=n.updateQueue;if(null===h){var g=new Set;g.add(s);n.updateQueue=g}else h.add(s);break e}else{if(0===(n&1)){Ui(u,c,n);Hs();break e}s=Error(a(426))}}else if(Na&&o.mode&1){var v=Vi(i);if(null!==v){0===(v.flags&65536)&&(v.flags|=256);Ai(v,i,o,u,n);Ia(Mi(s,o));break e}}u=s=Mi(s,o);4!==us&&(us=2);null===fs?fs=[u]:fs.push(u);u=i;do{switch(u.tag){case 3:u.flags|=65536;n&=-n;u.lanes|=n;var y=Oi(u,s,n);au(u,y);break e;case 1:o=s;var b=u.type,k=u.stateNode;if(0===(u.flags&128)&&("function"===typeof b.getDerivedStateFromError||null!==k&&"function"===typeof k.componentDidCatch&&(null===ys||!ys.has(k)))){u.flags|=65536;n&=-n;u.lanes|=n;var w=Ii(u,o,n);au(u,w);break e}}u=u.return}while(null!==u)}Ks(t)}catch(S){n=S;ts===t&&null!==t&&(ts=t=t.return);continue}break}while(1)}function Bs(){var e=Go.current;Go.current=zi;return null===e?zi:e}function Hs(){if(0===us||3===us||2===us)us=4;null===ns||0===(os&268435455)&&0===(ss&268435455)||Ds(ns,rs)}function Ws(e,n){var t=es;es|=2;var r=Bs();if(ns!==e||rs!==n)hs=null,Vs(e,n);do{try{Qs();break}catch(l){As(e,l)}}while(1);Qa();es=t;Go.current=r;if(null!==ts)throw Error(a(261));ns=null;rs=0;return us}function Qs(){for(;null!==ts;)$s(ts)}function js(){for(;null!==ts&&!en();)$s(ts)}function $s(e){var n=rc(e.alternate,e,ls);e.memoizedProps=e.pendingProps;null===n?Ks(e):ts=n;Zo.current=null}function Ks(e){var n=e;do{var t=n.alternate;e=n.return;if(0===(n.flags&32768)){if(t=bo(t,n,ls),null!==t){ts=t;return}}else{t=ko(t,n);if(null!==t){t.flags&=32767;ts=t;return}if(null!==e)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{us=6;ts=null;return}}n=n.sibling;if(null!==n){ts=n;return}ts=n=e}while(null!==n);0===us&&(us=5)}function qs(e,n,t){var r=Pn,l=Jo.transition;try{Jo.transition=null,Pn=1,Ys(e,n,t,r)}finally{Jo.transition=l,Pn=r}return null}function Ys(e,n,t,r){do{Xs()}while(null!==ks);if(0!==(es&6))throw Error(a(327));t=e.finishedWork;var l=e.finishedLanes;if(null===t)return null;e.finishedWork=null;e.finishedLanes=0;if(t===e.current)throw Error(a(177));e.callbackNode=null;e.callbackPriority=0;var u=t.lanes|t.childLanes;Nn(e,u);e===ns&&(ts=ns=null,rs=0);0===(t.subtreeFlags&2064)&&0===(t.flags&2064)||bs||(bs=!0,lc(un,(function(){Xs();return null})));u=0!==(t.flags&15990);if(0!==(t.subtreeFlags&15990)||u){u=Jo.transition;Jo.transition=null;var i=Pn;Pn=1;var o=es;es|=4;Zo.current=null;zo(e,t);Wo(t,e);Dr(xl);nt=!!Sl;xl=Sl=null;e.current=t;jo(t,e,l);nn();es=o;Pn=i;Jo.transition=u}else e.current=t;bs&&(bs=!1,ks=e,ws=l);u=e.pendingLanes;0===u&&(ys=null);dn(t.stateNode,r);Ps(e,tn());if(null!==n)for(r=e.onRecoverableError,t=0;t<n.length;t++)l=n[t],r(l.value,{componentStack:l.stack,digest:l.digest});if(gs)throw gs=!1,e=vs,vs=null,e;0!==(ws&1)&&0!==e.tag&&Xs();u=e.pendingLanes;0!==(u&1)?e===xs?Ss++:(Ss=0,xs=e):Ss=0;fa();return null}function Xs(){if(null!==ks){var e=Tn(ws),n=Jo.transition,t=Pn;try{Jo.transition=null;Pn=16>e?16:e;if(null===ks)var r=!1;else{e=ks;ks=null;ws=0;if(0!==(es&6))throw Error(a(331));var l=es;es|=4;for(Eo=e.current;null!==Eo;){var u=Eo,i=u.child;if(0!==(Eo.flags&16)){var o=u.deletions;if(null!==o){for(var s=0;s<o.length;s++){var c=o[s];for(Eo=c;null!==Eo;){var f=Eo;switch(f.tag){case 0:case 11:case 15:Po(8,f,u)}var d=f.child;if(null!==d)d.return=f,Eo=d;else for(;null!==Eo;){f=Eo;var p=f.sibling,m=f.return;Mo(f);if(f===c){Eo=null;break}if(null!==p){p.return=m;Eo=p;break}Eo=m}}}var h=u.alternate;if(null!==h){var g=h.child;if(null!==g){h.child=null;do{var v=g.sibling;g.sibling=null;g=v}while(null!==g)}}Eo=u}}if(0!==(u.subtreeFlags&2064)&&null!==i)i.return=u,Eo=i;else e:for(;null!==Eo;){u=Eo;if(0!==(u.flags&2048))switch(u.tag){case 0:case 11:case 15:Po(9,u,u.return)}var y=u.sibling;if(null!==y){y.return=u.return;Eo=y;break e}Eo=u.return}}var b=e.current;for(Eo=b;null!==Eo;){i=Eo;var k=i.child;if(0!==(i.subtreeFlags&2064)&&null!==k)k.return=i,Eo=k;else e:for(i=b;null!==Eo;){o=Eo;if(0!==(o.flags&2048))try{switch(o.tag){case 0:case 11:case 15:To(9,o)}}catch(S){Zs(o,o.return,S)}if(o===i){Eo=null;break e}var w=o.sibling;if(null!==w){w.return=o.return;Eo=w;break e}Eo=o.return}}es=l;fa();if(fn&&"function"===typeof fn.onPostCommitFiberRoot)try{fn.onPostCommitFiberRoot(cn,e)}catch(S){}r=!0}return r}finally{Pn=t,Jo.transition=n}}return!1}function Gs(e,n,t){n=Mi(t,n);n=Oi(e,n,1);e=ru(e,n,1);n=_s();null!==e&&(_n(e,1,n),Ps(e,n))}function Zs(e,n,t){if(3===e.tag)Gs(e,e,t);else for(;null!==n;){if(3===n.tag){Gs(n,e,t);break}else if(1===n.tag){var r=n.stateNode;if("function"===typeof n.type.getDerivedStateFromError||"function"===typeof r.componentDidCatch&&(null===ys||!ys.has(r))){e=Mi(t,e);e=Ii(n,e,1);n=ru(n,e,1);e=_s();null!==n&&(_n(n,1,e),Ps(n,e));break}}n=n.return}}function Js(e,n,t){var r=e.pingCache;null!==r&&r.delete(n);n=_s();e.pingedLanes|=e.suspendedLanes&t;ns===e&&(rs&t)===t&&(4===us||3===us&&(rs&130023424)===rs&&500>tn()-ps?Vs(e,0):cs|=t);Ps(e,n)}function ec(e,n){0===n&&(0===(e.mode&1)?n=1:(n=yn,yn<<=1,0===(yn&130023424)&&(yn=4194304)));var t=_s();e=Za(e,n);null!==e&&(_n(e,n,t),Ps(e,t))}function nc(e){var n=e.memoizedState,t=0;null!==n&&(t=n.retryLane);ec(e,t)}function tc(e,n){var t=0;switch(e.tag){case 13:var r=e.stateNode;var l=e.memoizedState;null!==l&&(t=l.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(a(314))}null!==r&&r.delete(n);ec(e,t)}var rc;rc=function(e,n,t){if(null!==e)if(e.memoizedProps!==n.pendingProps||Gl.current)Hi=!0;else{if(0===(e.lanes&t)&&0===(n.flags&128))return Hi=!1,fo(e,n,t);Hi=0!==(e.flags&131072)?!0:!1}else Hi=!1,Na&&0!==(n.flags&1048576)&&Sa(n,ha,n.index);n.lanes=0;switch(n.tag){case 2:var r=n.type;so(e,n);e=n.pendingProps;var l=Jl(n,Xl.current);Ka(n,t);l=$u(null,n,r,e,l,t);var u=Ku();n.flags|=1;"object"===typeof l&&null!==l&&"function"===typeof l.render&&void 0===l.$$typeof?(n.tag=1,n.memoizedState=null,n.updateQueue=null,ea(r)?(u=!0,la(n)):u=!1,n.memoizedState=null!==l.state&&void 0!==l.state?l.state:null,eu(n),l.updater=cu,n.stateNode=l,l._reactInternals=n,mu(n,r,e,t),n=Gi(null,n,r,!0,u,t)):(n.tag=0,Na&&u&&xa(n),Wi(null,n,l,t),n=n.child);return n;case 16:r=n.elementType;e:{so(e,n);e=n.pendingProps;l=r._init;r=l(r._payload);n.type=r;l=n.tag=oc(r);e=Va(r,e);switch(l){case 0:n=Yi(null,n,r,e,t);break e;case 1:n=Xi(null,n,r,e,t);break e;case 11:n=Qi(null,n,r,e,t);break e;case 14:n=ji(null,n,r,Va(r.type,e),t);break e}throw Error(a(306,r,""))}return n;case 0:return r=n.type,l=n.pendingProps,l=n.elementType===r?l:Va(r,l),Yi(e,n,r,l,t);case 1:return r=n.type,l=n.pendingProps,l=n.elementType===r?l:Va(r,l),Xi(e,n,r,l,t);case 3:e:{Zi(n);if(null===e)throw Error(a(387));r=n.pendingProps;u=n.memoizedState;l=u.element;nu(e,n);uu(n,r,null,t);var i=n.memoizedState;r=i.element;if(u.isDehydrated)if(u={element:r,isDehydrated:!1,cache:i.cache,pendingSuspenseBoundaries:i.pendingSuspenseBoundaries,transitions:i.transitions},n.updateQueue.baseState=u,n.memoizedState=u,n.flags&256){l=Mi(Error(a(423)),n);n=Ji(e,n,r,t,l);break e}else if(r!==l){l=Mi(Error(a(424)),n);n=Ji(e,n,r,t,l);break e}else for(_a=Ll(n.stateNode.containerInfo.firstChild),Ca=n,Na=!0,za=null,t=ku(n,null,r,t),n.child=t;t;)t.flags=t.flags&-3|4096,t=t.sibling;else{Oa();if(r===l){n=co(e,n,t);break e}Wi(e,n,r,t)}n=n.child}return n;case 5:return zu(n),null===e&&Ma(n),r=n.type,l=n.pendingProps,u=null!==e?e.memoizedProps:null,i=l.children,El(r,l)?i=null:null!==u&&El(r,u)&&(n.flags|=32),qi(e,n),Wi(e,n,i,t),n.child;case 6:return null===e&&Ma(n),null;case 13:return to(e,n,t);case 4:return _u(n,n.stateNode.containerInfo),r=n.pendingProps,null===e?n.child=bu(n,null,r,t):Wi(e,n,r,t),n.child;case 11:return r=n.type,l=n.pendingProps,l=n.elementType===r?l:Va(r,l),Qi(e,n,r,l,t);case 7:return Wi(e,n,n.pendingProps,t),n.child;case 8:return Wi(e,n,n.pendingProps.children,t),n.child;case 12:return Wi(e,n,n.pendingProps.children,t),n.child;case 10:e:{r=n.type._context;l=n.pendingProps;u=n.memoizedProps;i=l.value;ql(Aa,r._currentValue);r._currentValue=i;if(null!==u)if(Nr(u.value,i)){if(u.children===l.children&&!Gl.current){n=co(e,n,t);break e}}else for(u=n.child,null!==u&&(u.return=n);null!==u;){var o=u.dependencies;if(null!==o){i=u.child;for(var s=o.firstContext;null!==s;){if(s.context===r){if(1===u.tag){s=tu(-1,t&-t);s.tag=2;var c=u.updateQueue;if(null!==c){c=c.shared;var f=c.pending;null===f?s.next=s:(s.next=f.next,f.next=s);c.pending=s}}u.lanes|=t;s=u.alternate;null!==s&&(s.lanes|=t);$a(u.return,t,n);o.lanes|=t;break}s=s.next}}else if(10===u.tag)i=u.type===n.type?null:u.child;else if(18===u.tag){i=u.return;if(null===i)throw Error(a(341));i.lanes|=t;o=i.alternate;null!==o&&(o.lanes|=t);$a(i,t,n);i=u.sibling}else i=u.child;if(null!==i)i.return=u;else for(i=u;null!==i;){if(i===n){i=null;break}u=i.sibling;if(null!==u){u.return=i.return;i=u;break}i=i.return}u=i}Wi(e,n,l.children,t);n=n.child}return n;case 9:return l=n.type,r=n.pendingProps.children,Ka(n,t),l=qa(l),r=r(l),n.flags|=1,Wi(e,n,r,t),n.child;case 14:return r=n.type,l=Va(r,n.pendingProps),l=Va(r.type,l),ji(e,n,r,l,t);case 15:return $i(e,n,n.type,n.pendingProps,t);case 17:return r=n.type,l=n.pendingProps,l=n.elementType===r?l:Va(r,l),so(e,n),n.tag=1,ea(r)?(e=!0,la(n)):e=!1,Ka(n,t),du(n,r,l),mu(n,r,l,t),Gi(null,n,r,!0,e,t);case 19:return oo(e,n,t);case 22:return Ki(e,n,t)}throw Error(a(156,n.tag))};function lc(e,n){return Ze(e,n)}function ac(e,n,t,r){this.tag=e;this.key=t;this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null;this.index=0;this.ref=null;this.pendingProps=n;this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null;this.mode=r;this.subtreeFlags=this.flags=0;this.deletions=null;this.childLanes=this.lanes=0;this.alternate=null}function uc(e,n,t,r){return new ac(e,n,t,r)}function ic(e){e=e.prototype;return!(!e||!e.isReactComponent)}function oc(e){if("function"===typeof e)return ic(e)?1:0;if(void 0!==e&&null!==e){e=e.$$typeof;if(e===L)return 11;if(e===D)return 14}return 2}function sc(e,n){var t=e.alternate;null===t?(t=uc(e.tag,n,e.key,e.mode),t.elementType=e.elementType,t.type=e.type,t.stateNode=e.stateNode,t.alternate=e,e.alternate=t):(t.pendingProps=n,t.type=e.type,t.flags=0,t.subtreeFlags=0,t.deletions=null);t.flags=e.flags&14680064;t.childLanes=e.childLanes;t.lanes=e.lanes;t.child=e.child;t.memoizedProps=e.memoizedProps;t.memoizedState=e.memoizedState;t.updateQueue=e.updateQueue;n=e.dependencies;t.dependencies=null===n?null:{lanes:n.lanes,firstContext:n.firstContext};t.sibling=e.sibling;t.index=e.index;t.ref=e.ref;return t}function cc(e,n,t,r,l,u){var i=2;r=e;if("function"===typeof e)ic(e)&&(i=1);else if("string"===typeof e)i=5;else e:switch(e){case _:return fc(t.children,l,u,n);case N:i=8;l|=8;break;case z:return e=uc(12,t,n,l|2),e.elementType=z,e.lanes=u,e;case M:return e=uc(13,t,n,l),e.elementType=M,e.lanes=u,e;case F:return e=uc(19,t,n,l),e.elementType=F,e.lanes=u,e;case O:return dc(t,l,u,n);default:if("object"===typeof e&&null!==e)switch(e.$$typeof){case P:i=10;break e;case T:i=9;break e;case L:i=11;break e;case D:i=14;break e;case R:i=16;r=null;break e}throw Error(a(130,null==e?e:typeof e,""))}n=uc(i,t,n,l);n.elementType=e;n.type=r;n.lanes=u;return n}function fc(e,n,t,r){e=uc(7,e,r,n);e.lanes=t;return e}function dc(e,n,t,r){e=uc(22,e,r,n);e.elementType=O;e.lanes=t;e.stateNode={isHidden:!1};return e}function pc(e,n,t){e=uc(6,e,null,n);e.lanes=t;return e}function mc(e,n,t){n=uc(4,null!==e.children?e.children:[],e.key,n);n.lanes=t;n.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation};return n}function hc(e,n,t,r,l){this.tag=n;this.containerInfo=e;this.finishedWork=this.pingCache=this.current=this.pendingChildren=null;this.timeoutHandle=-1;this.callbackNode=this.pendingContext=this.context=null;this.callbackPriority=0;this.eventTimes=Cn(0);this.expirationTimes=Cn(-1);this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0;this.entanglements=Cn(0);this.identifierPrefix=r;this.onRecoverableError=l;this.mutableSourceEagerHydrationData=null}function gc(e,n,t,r,l,a,u,i,o){e=new hc(e,n,t,i,o);1===n?(n=1,!0===a&&(n|=8)):n=0;a=uc(3,null,null,n);e.current=a;a.stateNode=e;a.memoizedState={element:r,isDehydrated:t,cache:null,transitions:null,pendingSuspenseBoundaries:null};eu(a);return e}function vc(e,n,t){var r=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:C,key:null==r?null:""+r,children:e,containerInfo:n,implementation:t}}function yc(e){if(!e)return Yl;e=e._reactInternals;e:{if($e(e)!==e||1!==e.tag)throw Error(a(170));var n=e;do{switch(n.tag){case 3:n=n.stateNode.context;break e;case 1:if(ea(n.type)){n=n.stateNode.__reactInternalMemoizedMergedChildContext;break e}}n=n.return}while(null!==n);throw Error(a(171))}if(1===e.tag){var t=e.type;if(ea(t))return ra(e,t,n)}return n}function bc(e,n,t,r,l,a,u,i,o){e=gc(t,r,!0,e,l,a,u,i,o);e.context=yc(null);t=e.current;r=_s();l=Ns(t);a=tu(r,l);a.callback=void 0!==n&&null!==n?n:null;ru(t,a,l);e.current.lanes=l;_n(e,l,r);Ps(e,r);return e}function kc(e,n,t,r){var l=n.current,a=_s(),u=Ns(l);t=yc(t);null===n.context?n.context=t:n.pendingContext=t;n=tu(a,u);n.payload={element:e};r=void 0===r?null:r;null!==r&&(n.callback=r);e=ru(l,n,u);null!==e&&(zs(e,l,u,a),lu(e,l,u));return u}function wc(e){e=e.current;if(!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Sc(e,n){e=e.memoizedState;if(null!==e&&null!==e.dehydrated){var t=e.retryLane;e.retryLane=0!==t&&t<n?t:n}}function xc(e,n){Sc(e,n);(e=e.alternate)&&Sc(e,n)}function Ec(){return null}var Cc="function"===typeof reportError?reportError:function(e){console.error(e)};function _c(e){this._internalRoot=e}Nc.prototype.render=_c.prototype.render=function(e){var n=this._internalRoot;if(null===n)throw Error(a(409));kc(e,n,null,null)};Nc.prototype.unmount=_c.prototype.unmount=function(){var e=this._internalRoot;if(null!==e){this._internalRoot=null;var n=e.containerInfo;Is((function(){kc(null,e,null,null)}));n[Ol]=null}};function Nc(e){this._internalRoot=e}Nc.prototype.unstable_scheduleHydration=function(e){if(e){var n=Dn();e={blockedOn:null,target:e,priority:n};for(var t=0;t<Wn.length&&0!==n&&n<Wn[t].priority;t++);Wn.splice(t,0,e);0===t&&qn(e)}};function zc(e){return!(!e||1!==e.nodeType&&9!==e.nodeType&&11!==e.nodeType)}function Pc(e){return!(!e||1!==e.nodeType&&9!==e.nodeType&&11!==e.nodeType&&(8!==e.nodeType||" react-mount-point-unstable "!==e.nodeValue))}function Tc(){}function Lc(e,n,t,r,l){if(l){if("function"===typeof r){var a=r;r=function(){var e=wc(u);a.call(e)}}var u=bc(n,r,e,0,null,!1,!1,"",Tc);e._reactRootContainer=u;e[Ol]=u.current;cl(8===e.nodeType?e.parentNode:e);Is();return u}for(;l=e.lastChild;)e.removeChild(l);if("function"===typeof r){var i=r;r=function(){var e=wc(o);i.call(e)}}var o=gc(e,0,!1,null,null,!1,!1,"",Tc);e._reactRootContainer=o;e[Ol]=o.current;cl(8===e.nodeType?e.parentNode:e);Is((function(){kc(n,o,t,r)}));return o}function Mc(e,n,t,r,l){var a=t._reactRootContainer;if(a){var u=a;if("function"===typeof l){var i=l;l=function(){var e=wc(u);i.call(e)}}kc(n,u,e,l)}else u=Lc(t,n,e,l,r);return wc(u)}Ln=function(e){switch(e.tag){case 3:var n=e.stateNode;if(n.current.memoizedState.isDehydrated){var t=bn(n.pendingLanes);0!==t&&(zn(n,t|1),Ps(n,tn()),0===(es&6)&&(ms=tn()+500,fa()))}break;case 13:Is((function(){var n=Za(e,1);if(null!==n){var t=_s();zs(n,e,1,t)}})),xc(e,1)}};Mn=function(e){if(13===e.tag){var n=Za(e,134217728);if(null!==n){var t=_s();zs(n,e,134217728,t)}xc(e,134217728)}};Fn=function(e){if(13===e.tag){var n=Ns(e),t=Za(e,n);if(null!==t){var r=_s();zs(t,e,n,r)}xc(e,n)}};Dn=function(){return Pn};Rn=function(e,n){var t=Pn;try{return Pn=e,n()}finally{Pn=t}};Ce=function(e,n,t){switch(n){case"input":te(e,t);n=t.name;if("radio"===t.type&&null!=n){for(t=e;t.parentNode;)t=t.parentNode;t=t.querySelectorAll("input[name="+JSON.stringify(""+n)+'][type="radio"]');for(n=0;n<t.length;n++){var r=t[n];if(r!==e&&r.form===e.form){var l=Wl(r);if(!l)throw Error(a(90));G(r);te(r,l)}}}break;case"textarea":se(e,t);break;case"select":n=t.value,null!=n&&ue(e,!!t.multiple,n,!1)}};Le=Os;Me=Is;var Fc={usingClientEntryPoint:!1,Events:[Bl,Hl,Wl,Pe,Te,Os]},Dc={findFiberByHostInstance:Al,bundleType:0,version:"18.2.0",rendererPackageName:"react-dom"};var Rc={bundleType:Dc.bundleType,version:Dc.version,rendererPackageName:Dc.rendererPackageName,rendererConfig:Dc.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:x.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){e=Xe(e);return null===e?null:e.stateNode},findFiberByHostInstance:Dc.findFiberByHostInstance||Ec,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.2.0-next-9e3b772b8-20220608"};if("undefined"!==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__){var Oc=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Oc.isDisabled&&Oc.supportsFiber)try{cn=Oc.inject(Rc),fn=Oc}catch(Ic){}}n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Fc;n.createPortal=function(e,n){var t=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if(!zc(n))throw Error(a(200));return vc(e,n,null,t)};n.createRoot=function(e,n){if(!zc(e))throw Error(a(299));var t=!1,r="",l=Cc;null!==n&&void 0!==n&&(!0===n.unstable_strictMode&&(t=!0),void 0!==n.identifierPrefix&&(r=n.identifierPrefix),void 0!==n.onRecoverableError&&(l=n.onRecoverableError));n=gc(e,1,!1,null,null,t,!1,r,l);e[Ol]=n.current;cl(8===e.nodeType?e.parentNode:e);return new _c(n)};n.findDOMNode=function(e){if(null==e)return null;if(1===e.nodeType)return e;var n=e._reactInternals;if(void 0===n){if("function"===typeof e.render)throw Error(a(188));e=Object.keys(e).join(",");throw Error(a(268,e))}e=Xe(n);e=null===e?null:e.stateNode;return e};n.flushSync=function(e){return Is(e)};n.hydrate=function(e,n,t){if(!Pc(n))throw Error(a(200));return Mc(null,e,n,!0,t)};n.hydrateRoot=function(e,n,t){if(!zc(e))throw Error(a(405));var r=null!=t&&t.hydratedSources||null,l=!1,u="",i=Cc;null!==t&&void 0!==t&&(!0===t.unstable_strictMode&&(l=!0),void 0!==t.identifierPrefix&&(u=t.identifierPrefix),void 0!==t.onRecoverableError&&(i=t.onRecoverableError));n=bc(n,null,e,1,null!=t?t:null,l,!1,u,i);e[Ol]=n.current;cl(e);if(r)for(e=0;e<r.length;e++)t=r[e],l=t._getVersion,l=l(t._source),null==n.mutableSourceEagerHydrationData?n.mutableSourceEagerHydrationData=[t,l]:n.mutableSourceEagerHydrationData.push(t,l);return new Nc(n)};n.render=function(e,n,t){if(!Pc(n))throw Error(a(200));return Mc(null,e,n,!1,t)};n.unmountComponentAtNode=function(e){if(!Pc(e))throw Error(a(40));return e._reactRootContainer?(Is((function(){Mc(null,null,e,!1,(function(){e._reactRootContainer=null;e[Ol]=null}))})),!0):!1};n.unstable_batchedUpdates=Os;n.unstable_renderSubtreeIntoContainer=function(e,n,t,r){if(!Pc(t))throw Error(a(200));if(null==e||void 0===e._reactInternals)throw Error(a(38));return Mc(e,n,t,!1,r)};n.version="18.2.0-next-9e3b772b8-20220608"})(module, exports, id => { if(id===44914) return require("runtime/react.cjs"); if(id===69982) return require("runtime/scheduler.cjs"); throw new Error('Unexpected runtime dependency: '+id); });

},
"runtime/scheduler.cjs":function(module,exports,require){
/* React 18.2.0 / React DOM 18.2.0 / Scheduler 0.23.0. MIT. Copyright (c) Facebook, Inc. and its affiliates. See licenses/react-MIT.txt. */
((e,n)=>{function t(e,n){var t=e.length;e.push(n);e:for(;0<t;){var r=t-1>>>1,l=e[r];if(0<a(l,n))e[r]=n,e[t]=l,t=r;else break e}}function r(e){return 0===e.length?null:e[0]}function l(e){if(0===e.length)return null;var n=e[0],t=e.pop();if(t!==n){e[0]=t;e:for(var r=0,l=e.length,u=l>>>1;r<u;){var i=2*(r+1)-1,o=e[i],s=i+1,c=e[s];if(0>a(o,t))s<l&&0>a(c,o)?(e[r]=c,e[s]=t,r=s):(e[r]=o,e[i]=t,r=i);else if(s<l&&0>a(c,t))e[r]=c,e[s]=t,r=s;else break e}}return n}function a(e,n){var t=e.sortIndex-n.sortIndex;return 0!==t?t:e.id-n.id}if("object"===typeof performance&&"function"===typeof performance.now){var u=performance;n.unstable_now=function(){return u.now()}}else{var i=Date,o=i.now();n.unstable_now=function(){return i.now()-o}}var s=[],c=[],f=1,d=null,p=3,m=!1,h=!1,g=!1,v="function"===typeof setTimeout?setTimeout:null,y="function"===typeof clearTimeout?clearTimeout:null,b="undefined"!==typeof setImmediate?setImmediate:null;"undefined"!==typeof navigator&&void 0!==navigator.scheduling&&void 0!==navigator.scheduling.isInputPending&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function k(e){for(var n=r(c);null!==n;){if(null===n.callback)l(c);else if(n.startTime<=e)l(c),n.sortIndex=n.expirationTime,t(s,n);else break;n=r(c)}}function w(e){g=!1;k(e);if(!h)if(null!==r(s))h=!0,F(S);else{var n=r(c);null!==n&&D(w,n.startTime-e)}}function S(e,t){h=!1;g&&(g=!1,y(C),C=-1);m=!0;var a=p;try{k(t);for(d=r(s);null!==d&&(!(d.expirationTime>t)||e&&!z());){var u=d.callback;if("function"===typeof u){d.callback=null;p=d.priorityLevel;var i=u(d.expirationTime<=t);t=n.unstable_now();"function"===typeof i?d.callback=i:d===r(s)&&l(s);k(t)}else l(s);d=r(s)}if(null!==d)var o=!0;else{var f=r(c);null!==f&&D(w,f.startTime-t);o=!1}return o}finally{d=null,p=a,m=!1}}var x=!1,E=null,C=-1,_=5,N=-1;function z(){return n.unstable_now()-N<_?!1:!0}function P(){if(null!==E){var e=n.unstable_now();N=e;var t=!0;try{t=E(!0,e)}finally{t?T():(x=!1,E=null)}}else x=!1}var T;if("function"===typeof b)T=function(){b(P)};else if("undefined"!==typeof MessageChannel){var L=new MessageChannel,M=L.port2;L.port1.onmessage=P;T=function(){M.postMessage(null)}}else T=function(){v(P,0)};function F(e){E=e;x||(x=!0,T())}function D(e,t){C=v((function(){e(n.unstable_now())}),t)}n.unstable_IdlePriority=5;n.unstable_ImmediatePriority=1;n.unstable_LowPriority=4;n.unstable_NormalPriority=3;n.unstable_Profiling=null;n.unstable_UserBlockingPriority=2;n.unstable_cancelCallback=function(e){e.callback=null};n.unstable_continueExecution=function(){h||m||(h=!0,F(S))};n.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):_=0<e?Math.floor(1e3/e):5};n.unstable_getCurrentPriorityLevel=function(){return p};n.unstable_getFirstCallbackNode=function(){return r(s)};n.unstable_next=function(e){switch(p){case 1:case 2:case 3:var n=3;break;default:n=p}var t=p;p=n;try{return e()}finally{p=t}};n.unstable_pauseExecution=function(){};n.unstable_requestPaint=function(){};n.unstable_runWithPriority=function(e,n){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var t=p;p=e;try{return n()}finally{p=t}};n.unstable_scheduleCallback=function(e,l,a){var u=n.unstable_now();"object"===typeof a&&null!==a?(a=a.delay,a="number"===typeof a&&0<a?u+a:u):a=u;switch(e){case 1:var i=-1;break;case 2:i=250;break;case 5:i=1073741823;break;case 4:i=1e4;break;default:i=5e3}i=a+i;e={id:f++,callback:l,priorityLevel:e,startTime:a,expirationTime:i,sortIndex:-1};a>u?(e.sortIndex=a,t(c,e),null===r(s)&&e===r(c)&&(g?(y(C),C=-1):g=!0,D(w,a-u))):(e.sortIndex=i,t(s,e),h||m||(h=!0,F(S)));return e};n.unstable_shouldYield=z;n.unstable_wrapCallback=function(e){var n=p;return function(){var t=p;p=n;try{return e.apply(this,arguments)}finally{p=t}}}})(module, exports);

},
"src/App.tsx":function(module,exports,require){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBoundary = void 0;
exports.default = App;
const jsx_runtime_1 = require("runtime/jsx-runtime.cjs");
const react_1 = require("runtime/react.cjs");
const PipelineGraph_tsx_1 = require("upstream/pipeline-graph-view/pipeline-graph/main/PipelineGraph.tsx");
const useCollapsedStages_ts_1 = require("upstream/pipeline-graph-view/pipeline-graph/main/support/useCollapsedStages.ts");
const status_icon_tsx_1 = __importDefault(require("upstream/common/components/status-icon.tsx"));
const symbols_tsx_1 = require("upstream/common/components/symbols.tsx");
const preferences_tsx_1 = require("src/compat/preferences.tsx");
const tooltip_tsx_1 = require("src/compat/tooltip.tsx");
const model_ts_1 = require("src/model.ts");
const api_ts_1 = require("src/api.ts");
const flow_table_ts_1 = require("src/flow-table.ts");
const storage_ts_1 = require("src/storage.ts");
function errorText(e) { return e instanceof Error ? e.message : String(e); }
function stageTime(s) { return s.pgvxDurationLabel ?? (0, model_ts_1.formatMs)(s.totalDurationMillis); }
function safeDate(n) { return n > 0 ? new Date(n).toLocaleString() : ''; }
const GRAPH_LAYOUT = { graphSpacingTop: 22, graphSpacingBottom: 28, graphSpacingLeft: 18, graphSpacingRight: 18 };
class ErrorBoundary extends react_1.Component {
    state = { error: '' };
    static getDerivedStateFromError(e) { return { error: errorText(e) }; }
    render() { return this.state.error ? (0, jsx_runtime_1.jsxs)("section", { className: "pgvx-error", role: "alert", children: [(0, jsx_runtime_1.jsx)("b", { children: "Unable to render the local graph." }), (0, jsx_runtime_1.jsx)("p", { children: this.state.error }), (0, jsx_runtime_1.jsx)("button", { onClick: this.props.onClose, children: "Restore Jenkins view" })] }) : this.props.children; }
}
exports.ErrorBoundary = ErrorBoundary;
function App(props) {
    const key = 'pgvx/v2/' + props.location.origin + props.location.jobPath;
    return (0, jsx_runtime_1.jsx)(tooltip_tsx_1.TooltipRoot.Provider, { value: props.portal, children: (0, jsx_runtime_1.jsx)(preferences_tsx_1.UserPreferencesProvider, { storageKey: key + '/preferences', children: (0, jsx_runtime_1.jsx)(Main, { ...props, settingsKey: key }) }) });
}
function Main({ location, portal, onClassic, onClose, host, settingsKey, classicLabel = 'Original Stage View' }) {
    const api = (0, react_1.useMemo)(() => new api_ts_1.JenkinsApi(location), [location]);
    const [runs, setRuns] = (0, react_1.useState)([]), [run, setRun] = (0, react_1.useState)(null);
    const [choice, setChoice] = (0, react_1.useState)(location.build || 'latest'), [refresh, setRefresh] = (0, react_1.useState)(0), [auto, setAuto] = (0, react_1.useState)(true);
    const [loading, setLoading] = (0, react_1.useState)(true), [error, setError] = (0, react_1.useState)(''), [updated, setUpdated] = (0, react_1.useState)('');
    const [tree, setTree] = (0, react_1.useState)(null), [treeNote, setTreeNote] = (0, react_1.useState)('');
    const [classic, setClassic] = (0, react_1.useState)(false);
    const [theme, setTheme] = (0, react_1.useState)(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const [selectedId, setSelectedId] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => { let dead = false; (0, storage_ts_1.readSetting)(settingsKey + '/theme', '').then(v => { if (!dead && (v === 'dark' || v === 'light'))
        setTheme(v); }); return () => { dead = true; }; }, [settingsKey]);
    (0, react_1.useEffect)(() => { host.dataset.theme = theme; }, [theme]);
    (0, react_1.useEffect)(() => { onClassic(classic); }, [classic, onClassic]);
    (0, react_1.useEffect)(() => { const fn = () => { setClassic(false); host.scrollIntoView({ behavior: 'smooth', block: 'start' }); }; host.addEventListener('pgvx-activate', fn); return () => host.removeEventListener('pgvx-activate', fn); }, [host]);
    (0, react_1.useEffect)(() => {
        if (classic)
            return;
        let stopped = false, timer;
        const ctrl = new AbortController();
        setLoading(true);
        setError('');
        async function tick() {
            if (document.hidden) {
                timer = setTimeout(tick, 5000);
                return;
            }
            try {
                let list = [];
                try {
                    list = await api.runs(ctrl.signal);
                }
                catch (e) {
                    if (choice === 'latest')
                        throw e;
                }
                const wanted = choice === 'latest' ? list[0]?.id : choice;
                const current = wanted ? (list.find(r => r.id === wanted) ?? await api.describe(wanted, ctrl.signal)) : null;
                if (stopped)
                    return;
                setRuns(list);
                setRun(current);
                setError('');
                setUpdated(new Date().toLocaleTimeString());
                let result = null, note = '';
                if (current) {
                    try {
                        const payload = await api.tree(current, ctrl.signal);
                        if (payload !== null)
                            result = (0, model_ts_1.adaptTree)(payload, current, api.runPath(current));
                        else
                            note = 'Server tree endpoint returned 404.';
                    }
                    catch (e) {
                        if (ctrl.signal.aborted)
                            throw e;
                        note = 'Server tree unavailable: ' + errorText(e);
                    }
                    if (!result) {
                        const nativeNote = note;
                        try {
                            const html = await api.flowGraphTable(current, ctrl.signal);
                            result = (0, flow_table_ts_1.adaptFlowGraphHtml)(html, current, location.origin + api.runPath(current));
                            note = nativeNote.includes('404') ? '' : nativeNote + ' Using the readable Pipeline Steps page instead.';
                        }
                        catch (e) {
                            if (ctrl.signal.aborted)
                                throw e;
                            note = nativeNote + ' ' + errorText(e);
                        }
                    }
                }
                if (stopped)
                    return;
                setTree(result && current ? { runId: current.id, data: result } : null);
                setTreeNote(note);
                if (auto && (choice === 'latest' || current && ((0, model_ts_1.isActive)(current.status) || result?.complete === false)))
                    timer = setTimeout(tick, current && ((0, model_ts_1.isActive)(current.status) || result?.complete === false) ? (result?.source === 'flow-graph-table' ? 15000 : 5000) : 15000);
            }
            catch (e) {
                if (!stopped && !ctrl.signal.aborted)
                    setError(errorText(e));
            }
            finally {
                if (!stopped)
                    setLoading(false);
            }
        }
        void tick();
        return () => { stopped = true; ctrl.abort(); if (timer)
            clearTimeout(timer); };
    }, [api, choice, refresh, auto, classic, settingsKey]);
    (0, react_1.useEffect)(() => { setSelectedId(undefined); }, [run?.id]);
    const adapted = (0, react_1.useMemo)(() => run ? (tree?.runId === run.id ? tree.data : (0, model_ts_1.adaptFlatRun)(run, api.runPath(run))) : { stages: [], meta: new Map(), warnings: [], source: 'wfapi' }, [run, tree, api]);
    const hasTopology = adapted.source !== 'wfapi';
    const fromHtml = adapted.source === 'flow-graph-table';
    const collapseKey = settingsKey + '/collapsed/' + (run?.id || 'none') + '/' + adapted.source;
    const [collapsed, setCollapsed] = (0, react_1.useState)(new Set()), [collapseReady, setCollapseReady] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        let dead = false;
        setCollapseReady(false);
        const defaults = adapted.stages.filter(s => s.children.length).map(s => s.id);
        (0, storage_ts_1.readSetting)(collapseKey, null).then(ids => { if (!dead) {
            setCollapsed(new Set(Array.isArray(ids) ? ids.filter(id => Number.isFinite(id)) : defaults));
            setCollapseReady(true);
        } });
        return () => { dead = true; };
    }, [collapseKey]);
    function changeCollapsed(next) { next = new Set(next); setCollapsed(next); void (0, storage_ts_1.writeSetting)(collapseKey, [...next]); }
    function toggle(id) { const next = new Set(collapsed); next.has(id) ? next.delete(id) : next.add(id); changeCollapsed(next); }
    function select(id) {
        if (id === -1) {
            setSelectedId(undefined);
            return;
        }
        const next = new Set(collapsed);
        function expandPath(stages) { for (const s of stages) {
            if (s.id === id)
                return true;
            if (expandPath(s.children)) {
                next.delete(s.id);
                return true;
            }
        } return false; }
        expandPath(adapted.stages);
        changeCollapsed(next);
        setSelectedId(id);
    }
    const nodes = (0, react_1.useMemo)(() => (0, model_ts_1.walkStages)(adapted.stages), [adapted]);
    const selected = nodes.find(s => s.id === selectedId);
    const effective = (0, react_1.useMemo)(() => (0, useCollapsedStages_ts_1.collapseSelectiveStages)(adapted.stages, collapsed), [adapted.stages, collapsed]);
    const parents = (0, react_1.useMemo)(() => (0, useCollapsedStages_ts_1.collectParentStageIds)(adapted.stages), [adapted]);
    const mergedRuns = run && !runs.some(r => r.id === run.id) ? [run, ...runs] : runs;
    return (0, jsx_runtime_1.jsxs)("div", { className: "pgvx-app", "data-theme": theme, children: [(0, jsx_runtime_1.jsxs)("header", { className: "pgvx-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "pgvx-heading", children: [(0, jsx_runtime_1.jsxs)("h2", { children: ["Pipeline Graph ", (0, jsx_runtime_1.jsx)("span", { className: "pgvx-local", children: "LOCAL" })] }), (0, jsx_runtime_1.jsx)("div", { className: "pgvx-subtitle", children: location.label })] }), (0, jsx_runtime_1.jsxs)("div", { className: "pgvx-actions", children: [(0, jsx_runtime_1.jsx)("button", { title: "Toggle light / dark theme", onClick: () => { const next = theme === 'light' ? 'dark' : 'light'; setTheme(next); void (0, storage_ts_1.writeSetting)(settingsKey + '/theme', next); }, children: theme === 'light' ? 'Dark' : 'Light' }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setClassic(!classic), children: classic ? 'Graph view' : classicLabel }), (0, jsx_runtime_1.jsx)("button", { className: "pgvx-icon-button", "aria-label": "Close local graph", title: "Close local graph", onClick: onClose, children: "\u2715" })] })] }), !classic && (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "pgvx-runbar", children: [(0, jsx_runtime_1.jsxs)("label", { className: "pgvx-run-select", children: ["Build ", (0, jsx_runtime_1.jsxs)("select", { value: choice, onChange: e => { setChoice(e.target.value); setSelectedId(undefined); }, children: [(0, jsx_runtime_1.jsx)("option", { value: "latest", children: "Latest build" }), mergedRuns.map(r => (0, jsx_runtime_1.jsxs)("option", { value: r.id, children: [r.name || '#' + r.id, " - ", r.status] }, r.id)), location.build && !mergedRuns.some(r => r.id === location.build) && (0, jsx_runtime_1.jsx)("option", { value: location.build, children: location.build })] })] }), run && (0, jsx_runtime_1.jsxs)("div", { className: "pgvx-run-summary", children: [(0, jsx_runtime_1.jsx)(status_icon_tsx_1.default, { status: (0, model_ts_1.status)(run.status) }), (0, jsx_runtime_1.jsx)("b", { children: run.name || '#' + run.id }), (0, jsx_runtime_1.jsx)("span", { children: run.status }), (0, jsx_runtime_1.jsx)("span", { className: "pgvx-divider" }), (0, jsx_runtime_1.jsx)("span", { children: (0, model_ts_1.formatMs)(run.durationMillis) }), (0, jsx_runtime_1.jsx)("span", { className: "pgvx-muted", children: safeDate(run.startTimeMillis) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "pgvx-run-actions", children: [(0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: auto, onChange: e => setAuto(e.target.checked) }), " Auto-refresh"] }), (0, jsx_runtime_1.jsx)("button", { disabled: loading, onClick: () => setRefresh(x => x + 1), children: loading ? 'Loading...' : 'Refresh' }), run && (0, jsx_runtime_1.jsx)("a", { href: location.origin + api.runPath(run) + 'console', target: "_blank", rel: "noopener noreferrer", children: "Console \u2197" })] })] }), error && (0, jsx_runtime_1.jsx)("div", { role: "alert", className: "pgvx-error", children: error }), !run && !loading && !error && (0, jsx_runtime_1.jsx)("div", { className: "pgvx-empty", children: "No runs were returned by wfapi/runs." }), run && (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "pgvx-notice", children: [(0, jsx_runtime_1.jsx)("b", { children: fromHtml ? 'Source: Pipeline Steps HTML' : hasTopology ? 'Source: Jenkins execution tree' : 'Source: wfapi / flat status list' }), (0, jsx_runtime_1.jsx)("br", {}), fromHtml ? 'Hierarchy comes from this build\'s flowGraphTable, matched to wfapi by node ID. Container states are display aggregates; ~ marks HTML-rounded block durations. No local grouping rules.' : hasTopology ? 'Grouping, branches, durations and node states come from this build\'s /stages/tree response. No local grouping rules are used.' : 'Hierarchy is unavailable: no parent-child relationship or execution dependency is inferred from names, timestamps or API order.'] }), treeNote && (0, jsx_runtime_1.jsx)("div", { className: "pgvx-warning", role: "status", children: treeNote }), adapted.warnings.map(w => (0, jsx_runtime_1.jsx)("div", { className: "pgvx-warning", children: w }, w)), adapted.stages.length === 0 && (0, jsx_runtime_1.jsx)("div", { className: "pgvx-empty", children: "No stages reported yet. The build may be queued or still starting." }), hasTopology && collapseReady && adapted.stages.length > 0 && (0, jsx_runtime_1.jsx)(GraphViewport, { stages: effective, original: adapted.stages, selected: selected, collapsed: collapsed, onToggle: toggle, onSelect: select, runPath: api.runPath(run), onToggleAll: () => changeCollapsed(collapsed.size ? new Set() : parents), hasParents: parents.size > 0 }), !hasTopology && adapted.stages.length > 0 && (0, jsx_runtime_1.jsx)("div", { className: "pgvx-flat", "aria-label": "Flat wfapi status list", children: adapted.stages.map(n => (0, jsx_runtime_1.jsxs)("button", { className: "pgvx-flat-item", onClick: () => select(n.id), title: 'wfapi status only / Node ' + n.id, children: [(0, jsx_runtime_1.jsx)(status_icon_tsx_1.default, { status: n.state }), (0, jsx_runtime_1.jsxs)("span", { children: [n.name, (0, jsx_runtime_1.jsxs)("small", { children: [n.state, " / ", (0, model_ts_1.formatMs)(n.totalDurationMillis)] })] })] }, n.id)) }), (0, jsx_runtime_1.jsxs)("div", { className: "pgvx-graph-footer", children: [(0, jsx_runtime_1.jsxs)("span", { children: [nodes.length, " nodes ", (0, jsx_runtime_1.jsxs)("span", { className: "pgvx-muted", children: [" / ", fromHtml ? 'HTML hierarchy / wfapi details' : hasTopology ? 'server topology and timing' : 'raw wfapi status and timing'] })] }), (0, jsx_runtime_1.jsx)("span", { children: hasTopology ? 'Hover a node for duration / Ctrl + wheel to zoom' : 'Flat list: connections are intentionally not drawn' }), (0, jsx_runtime_1.jsx)("span", { className: "pgvx-muted", children: updated ? 'Updated ' + updated : '' })] }), adapted.stages.length > 0 && (0, jsx_runtime_1.jsxs)("div", { className: "pgvx-inspector", children: [(0, jsx_runtime_1.jsxs)("aside", { className: "pgvx-tree", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Stages" }), (0, jsx_runtime_1.jsx)(StageTree, { stages: adapted.stages, adapted: adapted, collapsed: collapsed, selected: selectedId, onToggle: toggle, onSelect: select })] }), (0, jsx_runtime_1.jsxs)("section", { className: "pgvx-details", children: [!selected && (0, jsx_runtime_1.jsxs)("div", { className: "pgvx-empty", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Select a stage" }), (0, jsx_runtime_1.jsx)("p", { children: "Click a graph node or a stage in the list to inspect steps and read its log." }), (0, jsx_runtime_1.jsx)("p", { children: "Use the count and chevron beside a group name to expand it." })] }), selected && adapted.meta.get(selected.id)?.kind === 'stage' && adapted.meta.get(selected.id)?.raw && (0, jsx_runtime_1.jsx)(StageDetails, { api: api, run: run, raw: adapted.meta.get(selected.id).raw, serverStage: hasTopology ? selected : undefined, flowMeta: adapted.meta.get(selected.id)?.flow }, run.id + '/' + selected.id), selected && adapted.meta.get(selected.id)?.kind === 'stage' && !adapted.meta.get(selected.id)?.raw && (0, jsx_runtime_1.jsxs)("div", { className: "pgvx-group-details", children: [(0, jsx_runtime_1.jsx)("h3", { children: selected.name }), (0, jsx_runtime_1.jsxs)("p", { children: [selected.state, " / ", stageTime(selected), " / Execution node ", selected.id] }), (0, jsx_runtime_1.jsx)("p", { children: "This execution node has no matching ID in the wfapi stage list. It is not matched by name." }), (0, jsx_runtime_1.jsx)(FlowProvenance, { meta: adapted.meta.get(selected.id)?.flow }), (0, jsx_runtime_1.jsx)("a", { href: location.origin + api.runPath(run) + 'console', target: "_blank", rel: "noopener noreferrer", children: "Open build console \u2197" })] }), selected && adapted.meta.get(selected.id)?.kind === 'group' && (0, jsx_runtime_1.jsxs)("div", { className: "pgvx-group-details", children: [(0, jsx_runtime_1.jsx)("h3", { children: selected.name }), (0, jsx_runtime_1.jsxs)("p", { children: [fromHtml ? 'Pipeline Steps' : 'Server execution', " ", adapted.meta.get(selected.id)?.mode, " container / Node ", selected.id, "."] }), (0, jsx_runtime_1.jsxs)("p", { children: [fromHtml ? 'Display state' : 'Server state', ": ", (0, jsx_runtime_1.jsx)("b", { children: selected.state }), ". ", fromHtml ? 'Block duration' : 'Server duration', ": ", (0, jsx_runtime_1.jsx)("b", { children: stageTime(selected) }), "."] }), fromHtml ? (0, jsx_runtime_1.jsx)(FlowProvenance, { meta: adapted.meta.get(selected.id)?.flow }) : (0, jsx_runtime_1.jsx)("p", { children: "Collapsed graph badges use the upstream aggregation of this node and its children; this inspector preserves the original server state." }), (0, jsx_runtime_1.jsx)("div", { className: "pgvx-group-list", children: (0, model_ts_1.leafStages)([selected]).map(s => (0, jsx_runtime_1.jsxs)("button", { onClick: () => select(s.id), children: [(0, jsx_runtime_1.jsx)(status_icon_tsx_1.default, { status: s.state }), (0, jsx_runtime_1.jsx)("span", { children: s.name }), (0, jsx_runtime_1.jsx)("small", { children: stageTime(s) })] }, s.id)) })] })] })] })] }), (0, jsx_runtime_1.jsxs)("footer", { className: "pgvx-footer", children: [(0, jsx_runtime_1.jsx)("span", { children: "Renderer: Pipeline Graph View 1013.v9f83fd83c063" }), (0, jsx_runtime_1.jsx)("span", { children: "Read-only / local settings / no external services" })] })] })] });
}
function StageTree({ stages, adapted, collapsed, selected, onToggle, onSelect, depth = 0 }) {
    return (0, jsx_runtime_1.jsx)("div", { children: stages.map((s) => {
            return (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: 'pgvx-tree-row' + (selected === s.id ? ' is-selected' : ''), style: { paddingLeft: 8 + depth * 12 }, children: [s.children.length > 0 ? (0, jsx_runtime_1.jsx)("button", { className: "pgvx-tree-chevron", "aria-label": (collapsed.has(s.id) ? 'Expand ' : 'Collapse ') + s.name, "aria-expanded": !collapsed.has(s.id), onClick: () => onToggle(s.id), children: collapsed.has(s.id) ? '\u203a' : '\u2304' }) : (0, jsx_runtime_1.jsx)("span", { className: "pgvx-tree-spacer" }), (0, jsx_runtime_1.jsxs)("button", { className: "pgvx-tree-item", onClick: () => onSelect(s.id), title: s.name, children: [(0, jsx_runtime_1.jsx)(status_icon_tsx_1.default, { status: s.state }), (0, jsx_runtime_1.jsx)("span", { children: s.name })] })] }), s.children.length > 0 && !collapsed.has(s.id) && (0, jsx_runtime_1.jsx)(StageTree, { stages: s.children, adapted, collapsed, selected, onToggle, onSelect, depth: depth + 1 })] }, s.id);
        }) });
}
function GraphViewport({ stages, original, selected, collapsed, onToggle, onSelect, runPath, onToggleAll, hasParents }) {
    const view = (0, react_1.useRef)(null), content = (0, react_1.useRef)(null), drag = (0, react_1.useRef)(null);
    const [size, setSize] = (0, react_1.useState)({ w: 900, h: 230 }), [scale, setScale] = (0, react_1.useState)(1), [fit, setFit] = (0, react_1.useState)(true), [full, setFull] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const vp = view.current, el = content.current;
        if (!vp || !el)
            return;
        const measure = () => {
            const svg = el.querySelector('.PWGx-PipelineGraph > svg');
            if (!svg)
                return;
            const w = Number(svg.getAttribute('width')), h = Number(svg.getAttribute('height'));
            if (!w || !h)
                return;
            setSize(old => old.w === w && old.h === h ? old : { w, h });
            if (fit)
                setScale(Math.max(.35, Math.min(1, (vp.clientWidth - 24) / w)));
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(vp);
        ro.observe(el);
        return () => ro.disconnect();
    }, [stages, fit, full]);
    (0, react_1.useEffect)(() => { const vp = view.current; if (!vp)
        return; const wheel = (e) => { if (!e.ctrlKey && !e.metaKey)
        return; e.preventDefault(); setFit(false); setScale(s => Math.max(.25, Math.min(2.5, s * (e.deltaY > 0 ? .9 : 1.1)))); }; vp.addEventListener('wheel', wheel, { passive: false }); return () => vp.removeEventListener('wheel', wheel); }, []);
    (0, react_1.useEffect)(() => { if (!full)
        return; const fn = (e) => { if (e.key === 'Escape')
        setFull(false); }; document.addEventListener('keydown', fn); return () => document.removeEventListener('keydown', fn); }, [full]);
    const changeScale = (factor) => { setFit(false); setScale(s => Math.max(.25, Math.min(2.5, s * factor))); };
    return (0, jsx_runtime_1.jsxs)("div", { className: 'pgvx-graph-card' + (full ? ' is-fullscreen' : ''), children: [(0, jsx_runtime_1.jsx)("div", { className: "pgvx-graph-title", children: "Stages" }), (0, jsx_runtime_1.jsx)("button", { className: "pgvx-fullscreen pgvx-icon-button", title: full ? 'Close expanded view' : 'Expand view', "aria-label": full ? 'Close expanded view' : 'Expand view', onClick: () => { setFull(!full); setFit(true); }, children: full ? '\u2715' : '\u26f6' }), (0, jsx_runtime_1.jsx)("div", { className: "pgvx-viewport", ref: view, style: full ? {} : { height: Math.max(220, Math.min(550, size.h * scale + 64)) }, onPointerDown: e => { if (e.button !== 0 || e.target.closest('a,button,[role="button"]'))
                    return; const el = view.current; drag.current = { x: e.clientX, y: e.clientY, l: el.scrollLeft, t: el.scrollTop }; el.setPointerCapture(e.pointerId); }, onPointerMove: e => { if (drag.current && view.current) {
                    view.current.scrollLeft = drag.current.l - (e.clientX - drag.current.x);
                    view.current.scrollTop = drag.current.t - (e.clientY - drag.current.y);
                } }, onPointerUp: () => drag.current = null, onPointerCancel: () => drag.current = null, children: (0, jsx_runtime_1.jsx)("div", { className: "pgvx-scaled-space", style: { width: size.w * scale, height: size.h * scale }, children: (0, jsx_runtime_1.jsx)("div", { ref: content, className: "pgvx-scaled-content", style: { transform: 'scale(' + scale + ')' }, children: (0, jsx_runtime_1.jsx)(PipelineGraph_tsx_1.PipelineGraph, { stages: stages, layout: GRAPH_LAYOUT, selectedStage: selected, collapsedStageIds: collapsed, onToggleCollapse: onToggle, onStageSelect: (id) => onSelect(Number(id)), currentRunPath: runPath }) }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "pgvx-zoom-controls", children: [(0, jsx_runtime_1.jsxs)("span", { className: "pgvx-zoom-value", children: [Math.round(scale * 100), "%"] }), (0, jsx_runtime_1.jsx)("button", { "aria-label": "Zoom in", title: "Zoom in", onClick: () => changeScale(1.2), disabled: scale >= 2.5, children: "+" }), (0, jsx_runtime_1.jsx)("button", { "aria-label": "Zoom out", title: "Zoom out", onClick: () => changeScale(1 / 1.2), disabled: scale <= .25, children: "\u2212" }), (0, jsx_runtime_1.jsx)("button", { "aria-label": "Fit graph", title: "Fit graph", onClick: () => { setFit(true); if (view.current) {
                            setScale(Math.max(.35, Math.min(1, (view.current.clientWidth - 24) / size.w)));
                            view.current.scrollTo(0, 0);
                        } }, children: "\u21BA" }), hasParents && (0, jsx_runtime_1.jsx)("button", { "aria-label": collapsed.size ? 'Expand all stages' : 'Collapse all stages', title: collapsed.size ? 'Expand all stages' : 'Collapse all stages', onClick: onToggleAll, children: collapsed.size ? symbols_tsx_1.EXPAND : symbols_tsx_1.COLLAPSE })] })] });
}
function StageDetails({ api, run, raw, serverStage, flowMeta }) {
    const [node, setNode] = (0, react_1.useState)(raw), [loading, setLoading] = (0, react_1.useState)(false), [error, setError] = (0, react_1.useState)('');
    const [logStep, setLogStep] = (0, react_1.useState)(null), [log, setLog] = (0, react_1.useState)(''), [logLoading, setLogLoading] = (0, react_1.useState)(false), [logError, setLogError] = (0, react_1.useState)(''), [hasMore, setHasMore] = (0, react_1.useState)(false), [logRefresh, setLogRefresh] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        const c = new AbortController();
        setError('');
        setNode(raw);
        if (raw.stageFlowNodes === undefined) {
            setLoading(true);
            api.stage(run, raw, c.signal).then(setNode).catch(e => { if (!c.signal.aborted)
                setError(errorText(e)); }).finally(() => { if (!c.signal.aborted)
                setLoading(false); });
        }
        return () => c.abort();
    }, [api, run.id, raw]);
    (0, react_1.useEffect)(() => {
        if (!logStep)
            return;
        const c = new AbortController();
        setLogLoading(true);
        setLog('');
        setLogError('');
        setHasMore(false);
        api.log(run, logStep, c.signal).then(v => { setLog(v.text); setHasMore(v.hasMore); }).catch(e => { if (!c.signal.aborted)
            setLogError(errorText(e)); }).finally(() => { if (!c.signal.aborted)
            setLogLoading(false); });
        return () => c.abort();
    }, [api, run.id, logStep, logRefresh]);
    const steps = Array.isArray(node.stageFlowNodes) ? node.stageFlowNodes.filter(s => s && typeof s.name === 'string' && /^\d+$/.test(s.id)).slice(0, 1000) : [];
    function consoleLink(n) { return (0, api_ts_1.safeJobUrl)(api.runPath(run) + 'execution/node/' + encodeURIComponent(n.id) + '/log', api.location); }
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("header", { className: "pgvx-detail-heading", children: [(0, jsx_runtime_1.jsx)(status_icon_tsx_1.default, { status: serverStage?.state ?? (0, model_ts_1.status)(node.status) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { children: serverStage?.name ?? node.name }), (0, jsx_runtime_1.jsxs)("small", { children: [serverStage?.state ?? node.status, " / ", serverStage ? stageTime(serverStage) : (0, model_ts_1.formatMs)(node.durationMillis), " / Node ", node.id, flowMeta ? ' / Pipeline Steps + wfapi' : serverStage ? ' / execution tree' : ' / raw wfapi'] })] }), (0, jsx_runtime_1.jsx)("a", { href: consoleLink(node), target: "_blank", rel: "noopener noreferrer", children: "Console \u2197" })] }), (0, jsx_runtime_1.jsx)(FlowProvenance, { meta: flowMeta }), !serverStage && (0, jsx_runtime_1.jsx)("p", { className: "pgvx-detail-warning", children: "This is a raw wfapi entry, not a verified leaf stage or parent summary. An empty step list does not prove that no nested stages exist." }), serverStage && serverStage.state !== (0, model_ts_1.status)(raw.status) && (0, jsx_runtime_1.jsxs)("p", { className: "pgvx-detail-warning", children: ["wfapi reports ", raw.status, " for this ID. The heading uses the execution-tree status; it is not overwritten with the wfapi chunk status."] }), error && (0, jsx_runtime_1.jsx)("div", { className: "pgvx-error", role: "alert", children: error }), loading && (0, jsx_runtime_1.jsx)("p", { children: "Loading steps..." }), !loading && steps.length === 0 && (0, jsx_runtime_1.jsx)("p", { className: "pgvx-muted", children: "The API returned no steps for this stage." }), steps.length > 0 && (0, jsx_runtime_1.jsx)("div", { className: "pgvx-step-list", children: steps.map(s => (0, jsx_runtime_1.jsxs)("div", { className: 'pgvx-step' + (logStep?.id === s.id ? ' is-selected' : ''), children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => setLogStep(s), children: [(0, jsx_runtime_1.jsx)(status_icon_tsx_1.default, { status: (0, model_ts_1.status)(s.status) }), (0, jsx_runtime_1.jsxs)("span", { children: [s.name, (0, jsx_runtime_1.jsx)("small", { children: typeof s.parameterDescription === 'string' ? s.parameterDescription.trim().slice(0, 240) : 'Node ' + s.id })] }), (0, jsx_runtime_1.jsx)("time", { children: (0, model_ts_1.formatMs)(s.durationMillis) })] }), (0, jsx_runtime_1.jsx)("a", { title: "Open step console in Jenkins", href: consoleLink(s), target: "_blank", rel: "noopener noreferrer", children: "\u2197" })] }, s.id)) }), Array.isArray(node.stageFlowNodes) && node.stageFlowNodes.length > 1000 && (0, jsx_runtime_1.jsx)("p", { className: "pgvx-warning", children: "Showing the first 1,000 returned steps. Open the native console for more." }), logStep && (0, jsx_runtime_1.jsxs)("section", { className: "pgvx-log", children: [(0, jsx_runtime_1.jsxs)("div", { className: "pgvx-log-title", children: [(0, jsx_runtime_1.jsx)("b", { children: logStep.name }), (0, jsx_runtime_1.jsxs)("span", { children: ["Node ", logStep.id] }), (0, jsx_runtime_1.jsx)("button", { disabled: logLoading, onClick: () => setLogRefresh(v => v + 1), children: "Reload log" }), (0, jsx_runtime_1.jsx)("a", { href: consoleLink(logStep), target: "_blank", rel: "noopener noreferrer", children: "Full console \u2197" })] }), logLoading && (0, jsx_runtime_1.jsx)("p", { children: "Loading log..." }), logError && (0, jsx_runtime_1.jsx)("p", { className: "pgvx-error", role: "alert", children: logError }), hasMore && (0, jsx_runtime_1.jsx)("p", { className: "pgvx-warning", children: "This log is truncated by the API or the 200,000-character display limit. Use Full console." }), !logLoading && !logError && (0, jsx_runtime_1.jsx)("pre", { tabIndex: 0, children: log || '(Empty log)' })] })] });
}
function FlowProvenance({ meta }) {
    if (!meta)
        return null;
    return (0, jsx_runtime_1.jsxs)("div", { className: "pgvx-flow-provenance", children: [(0, jsx_runtime_1.jsxs)("p", { children: ["HTML call node ", meta.stepId, meta.bodyId !== undefined ? ' / body node ' + meta.bodyId : '', meta.branchId !== undefined ? ' / branch node ' + meta.branchId : '', meta.parallelId !== undefined ? ' / parallel node ' + meta.parallelId : '', "."] }), meta.stateSource === 'derived-children' && (0, jsx_runtime_1.jsx)("p", { children: "State is derived from the verified child stages and the available container state. It is not Jenkins Pipeline Graph View's server-side chunk status." }), meta.durationSource === 'html-rounded' && (0, jsx_runtime_1.jsxs)("p", { children: ["Time is the rounded block duration printed by Jenkins: ", (0, jsx_runtime_1.jsx)("b", { children: meta.tableDuration }), ". It is not millisecond-precise and is not the sum of parallel branches."] }), meta.durationSource === 'unavailable' && (0, jsx_runtime_1.jsx)("p", { children: "The block duration is unavailable; branch-wrapper timings are not used as a substitute." }), meta.rawState !== undefined && meta.stateSource === 'derived-children' && (0, jsx_runtime_1.jsxs)("p", { children: ["Raw wfapi chunk (not a container summary): ", meta.rawState, " / ", (0, model_ts_1.formatMs)(meta.rawDurationMillis), "."] })] });
}

},
"upstream/pipeline-graph-view/pipeline-graph/main/PipelineGraph.tsx":function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineGraph = PipelineGraph;
const jsx_runtime_1 = require("runtime/jsx-runtime.cjs");
const react_1 = require("runtime/react.cjs");
const react_zoom_pan_pinch_1 = require("src/compat/zoom-context.ts");
const index_ts_1 = require("src/compat/i18n.tsx");
const user_preferences_provider_tsx_1 = require("src/compat/preferences.tsx");
const NestedPipelineGraphLayout_ts_1 = require("upstream/pipeline-graph-view/pipeline-graph/main/NestedPipelineGraphLayout.ts");
const PipelineGraphLayout_1 = require("upstream/pipeline-graph-view/pipeline-graph/main/PipelineGraphLayout.ts");
const PipelineGraphModel_tsx_1 = require("upstream/pipeline-graph-view/pipeline-graph/main/PipelineGraphModel.tsx");
const connections_tsx_1 = require("upstream/pipeline-graph-view/pipeline-graph/main/support/connections.tsx");
const DebugOutline_tsx_1 = require("upstream/pipeline-graph-view/pipeline-graph/main/support/DebugOutline.tsx");
const labels_tsx_1 = require("upstream/pipeline-graph-view/pipeline-graph/main/support/labels.tsx");
const nodes_tsx_1 = require("upstream/pipeline-graph-view/pipeline-graph/main/support/nodes.tsx");
const VIEWPORT_MARGIN = 300;
const MIN_COLUMNS_WHEN_COLLAPSED = 5;
function PipelineGraph({ stages = [], layout, selectedStage, collapsed, onStageSelect, collapsedStageIds, onToggleCollapse, setMinScale, setInitialScale, setDefaultTransform, setAutoStageViewHeight, setDefaultStageViewHeight, centerGraph, setCenterGraph, currentRunPath, }) {
    const fullLayout = (0, react_1.useMemo)(() => {
        return {
            ...PipelineGraphModel_tsx_1.defaultLayout,
            ...layout,
        };
    }, [layout]);
    const { showNames, showDurations } = (0, user_preferences_provider_tsx_1.useUserPreferences)();
    const messages = (0, react_1.useContext)(index_ts_1.I18NContext);
    const containerRef = (0, react_1.useRef)(null);
    const [maxColumnsWhenCollapsed, setMaxColumnsWhenCollapsed] = (0, react_1.useState)(PipelineGraphLayout_1.DEFAULT_MAX_COLUMNS_WHEN_COLLAPSED);
    (0, react_1.useLayoutEffect)(() => {
        if (!collapsed)
            return;
        const node = containerRef.current;
        if (!node)
            return;
        const apply = (width) => {
            if (width <= 0)
                return;
            const reservedSpace = 
            // before start
            fullLayout.graphSpacingLeft +
                fullLayout.nodeSpacingH / 2 +
                fullLayout.nodeSpacingH * 0.7 + // start node with reduced spacing
                -fullLayout.nodeSpacingH * 0.3 + // reduced spacing to end node
                // after end
                fullLayout.nodeSpacingH / 2 +
                fullLayout.graphSpacingRight;
            const next = Math.max(MIN_COLUMNS_WHEN_COLLAPSED, Math.floor((width - reservedSpace) / fullLayout.nodeSpacingH));
            setMaxColumnsWhenCollapsed((prev) => (prev === next ? prev : next));
        };
        apply(node.getBoundingClientRect().width);
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                apply(entry.contentRect.width);
            }
        });
        observer.observe(node);
        return () => observer.disconnect();
    }, [
        collapsed,
        fullLayout.graphSpacingLeft,
        fullLayout.graphSpacingRight,
        fullLayout.nodeSpacingH,
    ]);
    const { nodes, allNodes, connections, bigLabels, timings, smallLabels, branchLabels, measuredWidth, measuredHeight, } = (0, react_1.useMemo)(() => {
        if ((0, PipelineGraphModel_tsx_1.nestedLayout)()) {
            return (0, NestedPipelineGraphLayout_ts_1.nestedGraphLayout)(currentRunPath, stages, fullLayout, collapsed ?? false, messages, showNames || !collapsed, showDurations, maxColumnsWhenCollapsed);
        }
        return (0, PipelineGraphLayout_1.layoutGraph)(currentRunPath, stages, fullLayout, collapsed ?? false, messages, showNames, showDurations, maxColumnsWhenCollapsed);
    }, [
        currentRunPath,
        stages,
        fullLayout,
        collapsed,
        messages,
        showNames,
        showDurations,
        maxColumnsWhenCollapsed,
    ]);
    const stageIsSelected = (0, react_1.useCallback)((stage) => {
        return (selectedStage && stage && selectedStage.id === stage.id) || false;
    }, [selectedStage]);
    const transform = (0, react_1.useContext)(react_zoom_pan_pinch_1.Context);
    const [transformViewport, setTransformViewport] = (0, react_1.useState)({
        width: 0,
        height: 0,
    });
    (0, react_1.useEffect)(() => {
        if (!transform?.wrapperComponent)
            return;
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                setTransformViewport((prev) => prev.width === width && prev.height === height
                    ? prev
                    : { width, height });
            }
        });
        observer.observe(transform.wrapperComponent);
        return () => observer.disconnect();
    }, [transform?.wrapperComponent]);
    (0, react_1.useEffect)(() => {
        if (!setMinScale || !setInitialScale || !transform)
            return;
        const { width: transformWidth, height: transformHeight } = transformViewport;
        if (transformWidth <= 0 ||
            transformHeight <= 0 ||
            measuredWidth <= 0 ||
            measuredHeight <= 0) {
            return;
        }
        const initialScale = Math.min(1, transformWidth / measuredWidth);
        const minScale = initialScale * 0.75;
        const autoScale = Math.max(initialScale, 0.5);
        const centerOffsetX = Math.max(0, (transformWidth - measuredWidth * autoScale) / 2);
        const centerOffsetY = Math.max(0, (transformHeight - measuredHeight * autoScale) / 2);
        setMinScale(minScale);
        setInitialScale(initialScale);
        setDefaultTransform?.({
            scale: autoScale,
            positionX: centerOffsetX,
            positionY: centerOffsetY,
        });
        setDefaultStageViewHeight?.(measuredHeight);
        if (centerGraph) {
            // Don't scale too small by default.
            const autoHeight = Math.max(Math.min(measuredHeight, fullLayout.nodeSpacingH), measuredHeight * autoScale);
            setAutoStageViewHeight?.(autoHeight);
            if (transform.state.scale !== autoScale ||
                transform.state.positionX !== centerOffsetX ||
                transform.state.positionY !== centerOffsetY) {
                transform.setState(autoScale, centerOffsetX, centerOffsetY);
            }
            return transform.onChange(() => {
                setCenterGraph?.(false);
                setAutoStageViewHeight?.(0);
            });
        }
    }, [
        transform,
        transformViewport,
        centerGraph,
        setCenterGraph,
        fullLayout.nodeSpacingH,
        measuredWidth,
        measuredHeight,
        setMinScale,
        setInitialScale,
        setDefaultTransform,
        setAutoStageViewHeight,
        setDefaultStageViewHeight,
    ]);
    // When inside a TransformWrapper, only mount the nodes/labels intersecting
    // the visible region. Mounting thousands of absolute-positioned divs forces
    // a synchronous layout flush that blocks the main thread for seconds.
    const virtualize = transform != null;
    const [viewport, setViewport] = (0, react_1.useState)(null);
    const cachedViewport = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!transform)
            return;
        let raf = 0;
        const compute = () => {
            raf = 0;
            const wrapper = transform.wrapperComponent;
            if (!wrapper)
                return;
            const { positionX, positionY, scale } = transform.state;
            const next = {
                x: -positionX / scale,
                y: -positionY / scale,
                w: wrapper.offsetWidth / scale,
                h: wrapper.offsetHeight / scale,
            };
            const prev = cachedViewport.current;
            if (prev &&
                Math.abs(prev.x - next.x) < 50 &&
                Math.abs(prev.y - next.y) < 50 &&
                Math.abs(prev.w - next.w) < 50 &&
                Math.abs(prev.h - next.h) < 50) {
                return;
            }
            cachedViewport.current = next;
            setViewport(next);
        };
        const schedule = () => {
            if (raf)
                return;
            raf = requestAnimationFrame(compute);
        };
        schedule();
        const unsubChange = transform.onChange(schedule);
        const unsubInit = transform.wrapperComponent
            ? undefined
            : transform.onInit(() => schedule());
        const observer = new ResizeObserver(schedule);
        const observed = transform.wrapperComponent;
        if (observed)
            observer.observe(observed);
        const unsubInitObserve = transform.wrapperComponent
            ? undefined
            : transform.onInit((ctx) => {
                if (ctx.instance.wrapperComponent) {
                    observer.observe(ctx.instance.wrapperComponent);
                }
            });
        return () => {
            if (raf)
                cancelAnimationFrame(raf);
            unsubChange();
            unsubInit?.();
            unsubInitObserve?.();
            observer.disconnect();
        };
    }, [transform]);
    const isInViewport = (0, react_1.useCallback)((x, y) => {
        if (!virtualize)
            return true;
        if (!viewport)
            return false;
        return (x >= viewport.x - VIEWPORT_MARGIN &&
            x <= viewport.x + viewport.w + VIEWPORT_MARGIN &&
            y >= viewport.y - VIEWPORT_MARGIN &&
            y <= viewport.y + viewport.h + VIEWPORT_MARGIN);
    }, [viewport, virtualize]);
    const selectedStageId = selectedStage?.id;
    const visibleNodes = (0, react_1.useMemo)(() => {
        const filtered = nodes.filter((n) => isInViewport(n.x, n.y));
        if (!virtualize || selectedStageId == null)
            return filtered;
        if (filtered.some((n) => !n.isPlaceholder && n.stage?.id === selectedStageId)) {
            return filtered;
        }
        const sel = nodes.find((n) => !n.isPlaceholder && n.stage?.id === selectedStageId);
        return sel ? [...filtered, sel] : filtered;
    }, [nodes, isInViewport, virtualize, selectedStageId]);
    const visibleSmallLabels = (0, react_1.useMemo)(() => smallLabels.filter((l) => isInViewport(l.x, l.y)), [smallLabels, isInViewport]);
    const visibleBranchLabels = (0, react_1.useMemo)(() => branchLabels.filter((l) => isInViewport(l.x, l.y)), [branchLabels, isInViewport]);
    const outerDivStyle = {
        position: "relative",
        overflow: "visible",
        boxSizing: "unset",
    };
    if ((0, PipelineGraphModel_tsx_1.debugPipelineGraph)()) {
        outerDivStyle.border = "1px dashed red";
    }
    return ((0, jsx_runtime_1.jsx)("div", { ref: containerRef, className: "PWGx-PipelineGraph-container", children: (0, jsx_runtime_1.jsxs)("div", { style: outerDivStyle, className: "PWGx-PipelineGraph", children: [(0, jsx_runtime_1.jsxs)("svg", { width: measuredWidth, height: measuredHeight, children: [(0, jsx_runtime_1.jsx)(connections_tsx_1.GraphConnections, { connections: connections, layout: fullLayout }), (0, jsx_runtime_1.jsx)(nodes_tsx_1.SelectionHighlight, { layout: fullLayout, nodes: nodes, isStageSelected: stageIsSelected }), (0, PipelineGraphModel_tsx_1.debugPipelineGraph)() &&
                            allNodes.map((node) => ((0, jsx_runtime_1.jsx)(DebugOutline_tsx_1.DebugOutline, { node: node, layout: fullLayout }, node.id)))] }), visibleNodes.map((node) => ((0, jsx_runtime_1.jsx)(nodes_tsx_1.Node, { node: node, collapsed: collapsed, isSelected: node.isPlaceholder ? false : selectedStage?.id === node.stage.id, onStageSelect: onStageSelect }, node.id))), bigLabels.map((label) => ((0, jsx_runtime_1.jsx)(labels_tsx_1.BigLabel, { details: label, layout: fullLayout, measuredHeight: measuredHeight, isSelected: selectedStage?.id === label.stage?.id, isCollapsed: label.stage ? collapsedStageIds.has(label.stage.id) : false, onToggleCollapse: onToggleCollapse }, label.key))), timings.map((label) => ((0, jsx_runtime_1.jsx)(labels_tsx_1.TimingsLabel, { details: label, layout: fullLayout, measuredHeight: measuredHeight, isSelected: selectedStage?.id === label.stage?.id }, label.key))), visibleSmallLabels.map((label) => ((0, jsx_runtime_1.jsx)(labels_tsx_1.SmallLabel, { details: label, layout: fullLayout, isSelected: selectedStage?.id === label.stage?.id, isCollapsed: label.stage ? collapsedStageIds.has(label.stage.id) : false, onToggleCollapse: onToggleCollapse }, label.key))), visibleBranchLabels.map((label) => ((0, jsx_runtime_1.jsx)(labels_tsx_1.SequentialContainerLabel, { details: label, layout: fullLayout, isCollapsed: label.stage ? collapsedStageIds.has(label.stage.id) : false, onToggleCollapse: onToggleCollapse }, label.key)))] }) }));
}

},
"src/compat/zoom-context.ts":function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
// PipelineGraph can run without react-zoom-pan-pinch. The extension supplies its
// own scrollable, scaled viewport; null context disables upstream virtualization.
const react_1 = require("runtime/react.cjs");
exports.Context = (0, react_1.createContext)(null);

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
"src/compat/preferences.tsx":function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPreferencesProvider = UserPreferencesProvider;
exports.useUserPreferences = useUserPreferences;
const jsx_runtime_1 = require("runtime/jsx-runtime.cjs");
const react_1 = require("runtime/react.cjs");
const storage_ts_1 = require("src/storage.ts");
const Context = (0, react_1.createContext)(null);
function UserPreferencesProvider({ children, storageKey }) {
    const [showNames, setNames] = (0, react_1.useState)(true), [showDurations, setTimes] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => { let disposed = false; (0, storage_ts_1.readSetting)(storageKey, {}).then(v => { if (!disposed) {
        setNames(v.names !== false);
        setTimes(v.durations !== false);
    } }); return () => { disposed = true; }; }, [storageKey]);
    function setShowNames(v) { setNames(v); void (0, storage_ts_1.writeSetting)(storageKey, { names: v, durations: showDurations }); }
    function setShowDurations(v) { setTimes(v); void (0, storage_ts_1.writeSetting)(storageKey, { names: showNames, durations: v }); }
    return (0, jsx_runtime_1.jsx)(Context.Provider, { value: { showNames, showDurations, setShowNames, setShowDurations }, children: children });
}
function useUserPreferences() { const c = (0, react_1.useContext)(Context); if (!c)
    throw new Error('Missing graph preferences'); return c; }

},
"src/storage.ts":function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readSetting = readSetting;
exports.writeSetting = writeSetting;
async function readSetting(key, fallback) {
    try {
        const data = await browser.storage.local.get(key);
        return data[key] ?? fallback;
    }
    catch {
        return fallback;
    }
}
async function writeSetting(key, value) {
    try {
        await browser.storage.local.set({ [key]: value });
    }
    catch {
        console.warn('Pipeline Graph Local: preferences could not be saved.');
    }
}

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
"upstream/pipeline-graph-view/pipeline-graph/main/PipelineGraphLayout.ts":function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_MAX_COLUMNS_WHEN_COLLAPSED = void 0;
exports.layoutGraph = layoutGraph;
exports.createNodeColumns = createNodeColumns;
const index_ts_1 = require("src/compat/i18n.tsx");
const PipelineGraphModel_tsx_1 = require("upstream/pipeline-graph-view/pipeline-graph/main/PipelineGraphModel.tsx");
exports.DEFAULT_MAX_COLUMNS_WHEN_COLLAPSED = 13;
/**
 * Main process for laying out the graph. Creates and positions markers for each component, but creates no components.
 *
 *  1. Creates nodes for each stage in the pipeline
 *  2. Position the nodes in columns for each top stage, and in rows within each column based on execution order
 *  3. Create all the connections between nodes that need to be rendered
 *  4. Create a bigLabel per column, and a smallLabel for any child nodes
 *  5. Measure the extent of the graph
 */
function layoutGraph(currentRunPath, newStages, layout, collapsed, messages, showNames, showDurations, maxColumnsWhenCollapsed = exports.DEFAULT_MAX_COLUMNS_WHEN_COLLAPSED) {
    const stageNodeColumns = createNodeColumns(newStages);
    const startNode = {
        x: 0,
        y: 0,
        name: messages.format(index_ts_1.LocalizedMessageKey.start),
        id: -1,
        isPlaceholder: true,
        key: "start-node",
        type: "start",
        url: `${currentRunPath}stages/?selected-node=-1`,
    };
    const endNode = {
        x: 0,
        y: 0,
        name: messages.format(index_ts_1.LocalizedMessageKey.end),
        id: -3,
        isPlaceholder: true,
        key: "end-node",
        type: "end",
    };
    const counterNode = {
        x: 0,
        y: 0,
        name: "Counter",
        id: -2,
        isPlaceholder: true,
        key: "counter-node",
        type: "counter",
        stages: [],
    };
    function flattenStageInfo(e) {
        if (e.children.length) {
            const flattened = e.type !== "PARALLEL_BLOCK" ? [{ ...e, children: [] }] : [];
            return flattened.concat(e.children.flatMap((child) => flattenStageInfo(child)));
        }
        return [e];
    }
    function flattenColumns(middleNodes) {
        return middleNodes.flatMap((node) => node.rows.flatMap((row) => row.flatMap((e) => {
            const value = e;
            return flattenStageInfo(value.stage);
        })));
    }
    function filterWhenCollapsed(nodes) {
        if (!collapsed) {
            return nodes;
        }
        const start = nodes[0];
        const end = nodes[nodes.length - 1];
        const counter = {
            rows: [[counterNode]],
            centerX: 0,
            hasBranchLabels: false,
            startX: 0,
        };
        const middleNodes = nodes.filter((node) => node !== start && node !== end);
        const middleStages = flattenColumns(middleNodes);
        const newMiddleNodes = createNodeColumns(middleStages);
        if (newMiddleNodes.length <= maxColumnsWhenCollapsed) {
            return [start, ...newMiddleNodes, end];
        }
        // Make space for the counter node.
        const breakPoint = maxColumnsWhenCollapsed - 1;
        counterNode.stages = newMiddleNodes
            .slice(breakPoint)
            .flatMap((node) => node.rows.flatMap((row) => row.flatMap((e) => e.stage)));
        return [start, ...newMiddleNodes.slice(0, breakPoint), counter, end];
    }
    const allNodeColumns = filterWhenCollapsed([
        { rows: [[startNode]], centerX: 0, hasBranchLabels: false, startX: 0 }, // Column X positions calculated later
        ...stageNodeColumns,
        { rows: [[endNode]], centerX: 0, hasBranchLabels: false, startX: 0 },
    ]);
    positionNodes(allNodeColumns, layout);
    const bigLabels = createBigLabels(allNodeColumns, collapsed, showNames, layout);
    const timings = createTimings(allNodeColumns, collapsed, showDurations);
    const smallLabels = createSmallLabels(allNodeColumns, collapsed);
    const branchLabels = createBranchLabels(allNodeColumns, collapsed);
    const connections = createConnections(allNodeColumns, collapsed);
    const nodes = allNodeColumns.flatMap((column) => column.rows.flatMap((row) => row));
    // Calculate the size of the graph
    let measuredWidth = 0;
    let measuredHeight = 0;
    for (const node of nodes) {
        measuredWidth = Math.max(measuredWidth, node.x + layout.nodeSpacingH / 2);
        measuredHeight = Math.max(measuredHeight, node.y + layout.nodeSpacingV);
    }
    return {
        nodes,
        allNodes: [],
        connections,
        bigLabels,
        timings,
        smallLabels,
        branchLabels,
        measuredWidth,
        measuredHeight,
    };
}
/**
 * Generate an array of columns, based on the top-level stages
 */
function createNodeColumns(topLevelStages = []) {
    const nodeColumns = [];
    const makeNodeForStage = (stage, seqContainerName = undefined) => {
        return {
            x: 0, // Layout is done later
            y: 0,
            name: stage.name,
            id: stage.id,
            stage,
            seqContainerName,
            isPlaceholder: false,
            key: "n_" + stage.id,
            type: "stage",
        };
    };
    const processTopStage = (topStage, willRecurse) => {
        // If stage has children, we don't draw a node for it, just its children
        const stagesForColumn = !willRecurse && stageHasChildren(topStage)
            ? topStage.children
            : [{ ...topStage, children: [] }];
        const column = {
            topStage,
            rows: [],
            centerX: 0, // Layout is done later
            startX: 0,
            hasBranchLabels: false, // set below
        };
        for (const nodeStage of stagesForColumn) {
            const rowNodes = [];
            if (!willRecurse && stageHasChildren(nodeStage)) {
                column.hasBranchLabels = true;
                forEachChildStage(nodeStage, (parentStage, childStage, _) => rowNodes.push(makeNodeForStage(childStage, parentStage.name)));
            }
            else {
                rowNodes.push(makeNodeForStage(nodeStage));
            }
            column.rows.push(rowNodes);
        }
        nodeColumns.push(column);
    };
    for (const protoTopStage of topLevelStages) {
        const selfParentTopStage = { ...protoTopStage, children: [protoTopStage] };
        forEachChildStage(selfParentTopStage, (_, topStage, willRecurse) => processTopStage(topStage, willRecurse));
    }
    return nodeColumns;
}
/**
 * Check if stage has children.
 */
function stageHasChildren(stage) {
    return !!(stage.children && stage.children.length);
}
/**
 * Walk the children of the stage recursively (depth first), invoking callback for each child.
 *
 * Don't recurse into parallel children as those are processed separately.
 * If one child of the stage is parallel, we assume all of its children are.
 */
function forEachChildStage(topStage, callback) {
    if (!stageHasChildren(topStage)) {
        return;
    }
    for (const stage of topStage.children) {
        const needToRecurse = stageHasChildren(stage) && stage.children[0].type !== "PARALLEL";
        callback(topStage, stage, needToRecurse);
        if (needToRecurse) {
            forEachChildStage(stage, callback);
        }
    }
}
/**
 * Walks the columns of nodes giving them x and y positions. Mutates the node objects in place for now.
 */
function positionNodes(nodeColumns, { nodeSpacingH, parallelSpacingH, nodeSpacingV, ypStart }) {
    let xp = nodeSpacingH / 2;
    let previousTopNode;
    for (const column of nodeColumns) {
        const topNode = column.rows[0][0];
        let yp = ypStart; // Reset Y to top for each column
        if (previousTopNode) {
            // Advance X position
            if (previousTopNode.isPlaceholder || topNode.isPlaceholder) {
                // Don't space placeholder nodes (start/end) as wide as normal.
                if (topNode.type === "counter") {
                    xp += nodeSpacingH;
                }
                else {
                    xp += Math.floor(nodeSpacingH * 0.7);
                }
            }
            else {
                xp += nodeSpacingH;
            }
        }
        let widestRow = 0;
        for (const row of column.rows) {
            widestRow = Math.max(widestRow, row.length);
        }
        const xpStart = xp; // Remember the left-most position in this column
        // Make room for row labels
        if (column.hasBranchLabels) {
            xp += nodeSpacingH;
        }
        let maxX = xp;
        for (const row of column.rows) {
            let nodeX = xp; // Start nodes at current column xp (not xpstart as that includes branch label)
            // Offset the beginning of narrower rows towards column center
            nodeX += Math.round((widestRow - row.length) * parallelSpacingH * 0.5);
            for (const node of row) {
                maxX = Math.max(maxX, nodeX);
                node.x = nodeX;
                node.y = yp;
                nodeX += parallelSpacingH; // Space out nodes in each row
            }
            yp += nodeSpacingV; // LF
        }
        column.centerX = Math.round((xpStart + maxX) / 2);
        column.startX = xpStart; // Record on column for use later to position branch labels
        xp = maxX; // Make sure we're at the end of the widest row for this column before next loop
        previousTopNode = topNode;
    }
}
/**
 * Generate label descriptions for big labels at the top of each column
 */
function createBigLabels(columns, collapsed, showNames, layout) {
    const labels = [];
    if (collapsed && !showNames) {
        return [];
    }
    for (const column of columns) {
        const node = column.rows[0][0];
        if (node.type === "counter") {
            continue;
        }
        const stage = column.topStage;
        const text = stage ? stage.name : node.name;
        const key = "l_b_" + node.key;
        // bigLabel is located above center of column, but offset if there's branch labels
        let x = column.centerX;
        if (column.hasBranchLabels) {
            x += Math.floor(layout.nodeSpacingH / 2);
        }
        labels.push({
            x,
            y: node.y,
            node,
            stage,
            text,
            key,
        });
    }
    return labels;
}
/**
 * Generate label descriptions for big labels at the top of each column
 */
function createTimings(columns, collapsed, showDurations) {
    const labels = [];
    if (!collapsed || !showDurations) {
        return [];
    }
    for (const column of columns) {
        const node = column.rows[0][0];
        if (node.isPlaceholder) {
            continue;
        }
        const stage = column.topStage;
        labels.push({
            x: column.centerX,
            y: node.y + 55,
            node,
            stage,
            text: "", // we take the duration from the stage itself at render time
            key: `l_t_${node.key}`,
        });
    }
    return labels;
}
/**
 * Generate label descriptions for small labels under the nodes
 */
function createSmallLabels(columns, collapsed) {
    const labels = [];
    if (collapsed) {
        return labels;
    }
    for (const column of columns) {
        for (const row of column.rows) {
            for (const node of row) {
                // We add small labels to parallel nodes only so skip others
                if (node.isPlaceholder || node.stage.id === column.topStage?.id) {
                    continue;
                }
                const label = {
                    x: node.x,
                    y: node.y,
                    text: node.name,
                    key: "l_s_" + node.key,
                    node,
                };
                if (!node.isPlaceholder) {
                    label.stage = node.stage;
                }
                labels.push(label);
            }
        }
    }
    return labels;
}
/**
 * Generate label descriptions for named sequential parallels
 */
function createBranchLabels(columns, collapsed) {
    const labels = [];
    if (collapsed) {
        return labels;
    }
    let count = 0;
    for (const column of columns) {
        if (column.hasBranchLabels) {
            for (const row of column.rows) {
                const firstNode = row[0];
                if (!firstNode.isPlaceholder && firstNode.seqContainerName) {
                    labels.push({
                        x: column.startX,
                        y: firstNode.y,
                        key: `branchLabel-${++count}`,
                        node: firstNode,
                        text: firstNode.seqContainerName,
                    });
                }
            }
        }
    }
    return labels;
}
/**
 * Generate connection information from column to column
 */
function createConnections(columns, collapsed) {
    const connections = [];
    let sourceNodes = [];
    let skippedNodes = [];
    for (const column of columns) {
        if (!collapsed && column.topStage?.state === PipelineGraphModel_tsx_1.Result.skipped) {
            skippedNodes.push({
                ...column.rows[0][0],
                isSkipped: true,
            });
            continue;
        }
        // Connections to each row in this column
        if (sourceNodes.length) {
            connections.push({
                sourceNodes,
                destinationNodes: column.rows.map((row) => row[0]), // First node of each row
                skippedNodes,
                hasBranchLabels: column.hasBranchLabels,
            });
        }
        // Simple horizontal connections between nodes within each row
        for (const row of column.rows) {
            for (let i = 0; i < row.length - 1; i++) {
                connections.push({
                    sourceNodes: [row[i]],
                    destinationNodes: [row[i + 1]],
                    skippedNodes: [],
                    hasBranchLabels: false,
                });
            }
        }
        sourceNodes = column.rows.map((row) => row[row.length - 1]); // Last node of each row
        skippedNodes = [];
    }
    return connections;
}

},
"upstream/pipeline-graph-view/pipeline-graph/main/support/connections.tsx":function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphConnections = void 0;
const jsx_runtime_1 = require("runtime/jsx-runtime.cjs");
const react_1 = require("runtime/react.cjs");
const react_2 = require("runtime/react.cjs");
const StatusIcons_tsx_1 = require("upstream/pipeline-graph-view/pipeline-graph/main/support/StatusIcons.tsx");
// Generate a react key for a connection
function connectorKey(leftNode, rightNode) {
    return `c_${leftNode.key}_${leftNode.x}_${leftNode.y}_to_${rightNode.key}_${rightNode.x}_${rightNode.y}`;
}
class GraphConnections extends react_2.Component {
    getConnectorStroke(isSkipped) {
        return {
            className: isSkipped
                ? "PWGx-pipeline-connector-skipped"
                : "PWGx-pipeline-connector",
            strokeWidth: this.props.layout.connectorStrokeWidth,
        };
    }
    /**
     * Generate SVG for a composite connection, which may be to/from many nodes.
     *
     * Farms work out to other methods on self depending on the complexity of the line required. Adds all the SVG
     * components to the elements list.
     */
    renderCompositeConnection(connection, svgElements) {
        const { sourceNodes, destinationNodes, skippedNodes, hasBranchLabels } = connection;
        if (sourceNodes.length === 1 && sourceNodes[0].allChildrenSkipped) {
            this.renderAllChildrenSkippedConnection(sourceNodes[0], svgElements);
        }
        else if (skippedNodes.length === 0) {
            // Nothing too complicated, use the original connection drawing code
            this.renderBasicConnections(sourceNodes, destinationNodes, svgElements, hasBranchLabels);
        }
        else {
            this.renderSkippingConnections(sourceNodes, destinationNodes, skippedNodes, svgElements, hasBranchLabels);
        }
    }
    /**
     * Connections between adjacent columns without any skipping.
     *
     * Adds all the SVG components to the elements list.
     */
    renderBasicConnections(sourceNodes, destinationNodes, svgElements, hasBranchLabels) {
        const { curveRadius, nodeSpacingH } = this.props.layout;
        const halfSpacingH = nodeSpacingH / 2;
        if (sourceNodes.length === 1 && destinationNodes.length === 1) {
            this.renderHorizontalConnection(sourceNodes[0], destinationNodes[0], svgElements, sourceNodes[0].isSkipped || destinationNodes[0].isSkipped);
            return; // No curves needed.
        }
        // Work out the extents of source and dest space
        let rightmostSource = sourceNodes[0].x;
        let leftmostDestination = destinationNodes[0].x;
        for (let i = 1; i < sourceNodes.length; i++) {
            rightmostSource = Math.max(rightmostSource, sourceNodes[i].x);
        }
        for (let i = 1; i < destinationNodes.length; i++) {
            leftmostDestination = Math.min(leftmostDestination, destinationNodes[i].x);
        }
        // Collapse from previous node(s) to top column node
        const collapseMidPointX = Math.round(rightmostSource + halfSpacingH);
        if (sourceNodes[0].isSkipped === destinationNodes[0].isSkipped) {
            this.renderHorizontalConnection(sourceNodes[0], destinationNodes[0], svgElements);
        }
        else {
            // Connect up to the point where the curved connection touches the base.
            this.renderHorizontalConnection(sourceNodes[0], { ...destinationNodes[0], x: collapseMidPointX + curveRadius }, svgElements, sourceNodes[0].isSkipped);
            this.renderHorizontalConnection({ ...sourceNodes[0], x: collapseMidPointX - curveRadius }, destinationNodes[0], svgElements, destinationNodes[0].isSkipped);
        }
        for (const previousNode of sourceNodes.slice(1)) {
            this.renderBasicCurvedConnection(previousNode, destinationNodes[0], collapseMidPointX, svgElements, sourceNodes.length > 1
                ? previousNode.isSkipped
                : destinationNodes[0].isSkipped);
        }
        // Expand from top previous node to column node(s)
        let expandMidPointX = Math.round(leftmostDestination - halfSpacingH);
        if (hasBranchLabels) {
            // Shift curve midpoint so that there's room for the labels
            expandMidPointX -= nodeSpacingH;
        }
        for (const destNode of destinationNodes.slice(1)) {
            this.renderBasicCurvedConnection(sourceNodes[0], destNode, expandMidPointX, svgElements, destinationNodes.length > 1
                ? destNode.isSkipped
                : sourceNodes[0].isSkipped);
        }
    }
    getNodeRadius(node, edge) {
        const { nodeRadius, terminalRadius, nodeSpacingH } = this.props.layout;
        if (node.isPlaceholder) {
            if (node.isHidden)
                return 0;
            return terminalRadius;
        }
        if (node.firstChildIsSkipped) {
            // Turn half of the regular connecting line into a skipped line.
            if (edge === "right")
                return nodeSpacingH / 2;
            if (edge === "left")
                return -nodeSpacingH / 2;
        }
        if (node.isHidden)
            return 0;
        return nodeRadius;
    }
    /**
     * Renders a more complex connection, that "skips" one or more nodes
     *
     * Adds all the SVG components to the elements list.
     */
    renderSkippingConnections(sourceNodes, destinationNodes, skippedNodes, svgElements, hasBranchLabels) {
        const { curveRadius, nodeSpacingV, nodeSpacingH } = this.props.layout;
        const halfSpacingH = nodeSpacingH / 2;
        const lastSkippedNode = skippedNodes[skippedNodes.length - 1];
        let leftNode, rightNode;
        //--------------------------------------------------------------------------
        //  Draw the "ghost" connections between skipped nodes
        leftNode = skippedNodes[0];
        for (rightNode of skippedNodes.slice(1)) {
            this.renderHorizontalConnection(leftNode, rightNode, svgElements, true);
            leftNode = rightNode;
        }
        //--------------------------------------------------------------------------
        //  Work out the extents of source and dest space
        let rightmostSource = sourceNodes[0].x;
        let leftmostDestination = destinationNodes[0].x;
        for (let i = 1; i < sourceNodes.length; i++) {
            rightmostSource = Math.max(rightmostSource, sourceNodes[i].x);
        }
        for (let i = 1; i < destinationNodes.length; i++) {
            leftmostDestination = Math.min(leftmostDestination, destinationNodes[i].x);
        }
        //--------------------------------------------------------------------------
        //  "Collapse" from the source node(s) down toward the first skipped
        leftNode = sourceNodes[0];
        rightNode = skippedNodes[0];
        for (leftNode of sourceNodes.slice(1)) {
            const midPointX = Math.round(rightmostSource + halfSpacingH);
            const leftNodeRadius = this.getNodeRadius(leftNode, "left");
            const key = connectorKey(leftNode, rightNode);
            const x1 = leftNode.x + leftNodeRadius - StatusIcons_tsx_1.nodeStrokeWidth / 2;
            const y1 = leftNode.y;
            const x2 = midPointX;
            const y2 = rightNode.y;
            const pathData = `M ${x1} ${y1}` +
                this.svgBranchCurve(x1, y1, x2, y2, midPointX, curveRadius);
            svgElements.push((0, react_1.createElement)("path", { ...this.getConnectorStroke(leftNode.isSkipped), key: key, d: pathData, fill: "none" }));
        }
        //--------------------------------------------------------------------------
        //  "Expand" from the last skipped node toward the destination nodes
        leftNode = lastSkippedNode;
        let expandMidPointX = Math.round(leftmostDestination - halfSpacingH);
        if (hasBranchLabels) {
            // Shift curve midpoint so that there's room for the labels
            expandMidPointX -= nodeSpacingH;
        }
        for (rightNode of destinationNodes.slice(1)) {
            const rightNodeRadius = this.getNodeRadius(rightNode, "right");
            const key = connectorKey(leftNode, rightNode);
            const x1 = expandMidPointX;
            const y1 = leftNode.y;
            const x2 = rightNode.x - rightNodeRadius + StatusIcons_tsx_1.nodeStrokeWidth / 2;
            const y2 = rightNode.y;
            const pathData = `M ${x1} ${y1}` +
                this.svgBranchCurve(x1, y1, x2, y2, expandMidPointX, curveRadius);
            svgElements.push((0, react_1.createElement)("path", { ...this.getConnectorStroke(rightNode.isSkipped), key: key, d: pathData, fill: "none" }));
        }
        //--------------------------------------------------------------------------
        //  "Main" curve from top of source nodes, around skipped nodes, to top of dest nodes
        leftNode = sourceNodes[0];
        rightNode = destinationNodes[0];
        const leftNodeRadius = this.getNodeRadius(leftNode, "left");
        const rightNodeRadius = this.getNodeRadius(rightNode, "right");
        const key = connectorKey(leftNode, rightNode);
        const skipHeight = nodeSpacingV * 0.5;
        const controlOffsetUpper = curveRadius * 1.54;
        const controlOffsetLower = skipHeight * 0.257;
        const controlOffsetMid = skipHeight * 0.2;
        const inflectiontOffset = Math.round(skipHeight * 0.7071); // cos(45º)-ish
        // Start point
        const p1x = leftNode.x + leftNodeRadius - StatusIcons_tsx_1.nodeStrokeWidth / 2;
        const p1y = leftNode.y;
        // Begin curve down point
        const p2x = Math.round(skippedNodes[0].x - halfSpacingH);
        const p2y = p1y;
        const c1x = p2x + controlOffsetUpper;
        const c1y = p2y;
        // End curve down point
        const p4x = skippedNodes[0].x;
        const p4y = p1y + skipHeight;
        const c4x = p4x - controlOffsetLower;
        const c4y = p4y;
        // Curve down midpoint / inflection
        const p3x = skippedNodes[0].x - inflectiontOffset;
        const p3y = skippedNodes[0].y + inflectiontOffset;
        const c2x = p3x - controlOffsetMid;
        const c2y = p3y - controlOffsetMid;
        const c3x = p3x + controlOffsetMid;
        const c3y = p3y + controlOffsetMid;
        // Begin curve up point
        const p5x = lastSkippedNode.x;
        const p5y = p4y;
        const c5x = p5x + controlOffsetLower;
        const c5y = p5y;
        // End curve up point
        const p7x = Math.round(lastSkippedNode.x + halfSpacingH);
        const p7y = rightNode.y;
        const c8x = p7x - controlOffsetUpper;
        const c8y = p7y;
        // Curve up midpoint / inflection
        const p6x = lastSkippedNode.x + inflectiontOffset;
        const p6y = lastSkippedNode.y + inflectiontOffset;
        const c6x = p6x - controlOffsetMid;
        const c6y = p6y + controlOffsetMid;
        const c7x = p6x + controlOffsetMid;
        const c7y = p6y - controlOffsetMid;
        // End point
        const p8x = rightNode.x - rightNodeRadius + StatusIcons_tsx_1.nodeStrokeWidth / 2;
        const p8y = rightNode.y;
        // Source side half of the 1st horizontal
        svgElements.push((0, react_1.createElement)("line", { ...this.getConnectorStroke(leftNode.isSkipped), key: key + "_source", x1: p1x, y1: p1y, x2: p2x, y2: p2y, fill: "none" }));
        // Skipped side half of the 1st horizontal
        svgElements.push((0, react_1.createElement)("line", { ...this.getConnectorStroke(skippedNodes[0].isSkipped), key: key + "_skipped_left", x1: p2x, y1: p2y, x2: skippedNodes[0].x, y2: skippedNodes[0].y, fill: "none" }));
        const pathData = `M ${p2x} ${p2y}` +
            `C ${c1x} ${c1y} ${c2x} ${c2y} ${p3x} ${p3y}` + // Curve down (upper)
            `C ${c3x} ${c3y} ${c4x} ${c4y} ${p4x} ${p4y}` + // Curve down (lower)
            `L ${p5x} ${p5y}` + // 2nd horizontal
            `C ${c5x} ${c5y} ${c6x} ${c6y} ${p6x} ${p6y}` + // Curve up (lower)
            `C ${c7x} ${c7y} ${c8x} ${c8y} ${p7x} ${p7y}` + // Curve up (upper)
            "";
        // Skipped curve
        svgElements.push((0, react_1.createElement)("path", { ...this.getConnectorStroke(false), key: key + "_skipped_curve", d: pathData, fill: "none" }));
        // Skipped side of the last horizontal
        svgElements.push((0, react_1.createElement)("line", { ...this.getConnectorStroke(lastSkippedNode.isSkipped), key: key + "_skipped_right", x1: lastSkippedNode.x, y1: lastSkippedNode.y, x2: p7x, y2: p7y, fill: "none" }));
        // Destination side of the last horizontal
        svgElements.push((0, react_1.createElement)("line", { ...this.getConnectorStroke(rightNode.isSkipped), key: key + "_destination", x1: p7x, y1: p7y, x2: p8x, y2: p8y, fill: "none" }));
    }
    /**
     * Simple straight connection.
     *
     * Adds all the SVG components to the elements list.
     */
    renderHorizontalConnection(leftNode, rightNode, svgElements, skipped = false) {
        const leftNodeRadius = this.getNodeRadius(leftNode, "left");
        const rightNodeRadius = this.getNodeRadius(rightNode, "right");
        const key = connectorKey(leftNode, rightNode);
        const x1 = leftNode.x + leftNodeRadius - StatusIcons_tsx_1.nodeStrokeWidth / 2;
        const x2 = rightNode.x - rightNodeRadius + StatusIcons_tsx_1.nodeStrokeWidth / 2;
        const y = leftNode.y;
        svgElements.push((0, react_1.createElement)("line", { ...this.getConnectorStroke(skipped), key: key, x1: x1, y1: y, x2: x2, y2: y }));
    }
    /**
     * A direct curve between two nodes in adjacent columns.
     *
     * Adds all the SVG components to the elements list.
     */
    renderBasicCurvedConnection(leftNode, rightNode, midPointX, svgElements, skipped = false, curveRadius) {
        curveRadius = curveRadius ?? this.props.layout.curveRadius;
        const leftNodeRadius = this.getNodeRadius(leftNode, "left");
        const rightNodeRadius = this.getNodeRadius(rightNode, "right");
        const key = connectorKey(leftNode, rightNode);
        const leftPos = {
            x: leftNode.x + leftNodeRadius - StatusIcons_tsx_1.nodeStrokeWidth / 2,
            y: leftNode.y,
        };
        const rightPos = {
            x: rightNode.x - rightNodeRadius + StatusIcons_tsx_1.nodeStrokeWidth / 2,
            y: rightNode.y,
        };
        const pathData = `M ${leftPos.x} ${leftPos.y}` +
            this.svgBranchCurve(leftPos.x, leftPos.y, rightPos.x, rightPos.y, midPointX, curveRadius);
        svgElements.push((0, react_1.createElement)("path", { ...this.getConnectorStroke(skipped), key: key, d: pathData, fill: "none" }));
    }
    /**
     * Enclose all the parallel skipped connections, using the same horizontal start/end points and a smaller curve radius.
     */
    renderAllChildrenSkippedConnection(node, svgElements) {
        const { nodeSpacingH, nodeSpacingV, curveRadius } = this.props.layout;
        const smallerCurveRadius = curveRadius - StatusIcons_tsx_1.nodeStrokeWidth;
        const leftTop = {
            x: node.x - nodeSpacingH,
            y: node.y,
            key: `skipped_left_top_${node.key}`,
            isPlaceholder: true,
            isHidden: true,
        };
        const leftBottom = {
            x: node.x,
            y: node.y + node.height - nodeSpacingV / 2,
            key: `skipped_left_bottom_${node.key}`,
            isPlaceholder: true,
            isHidden: true,
        };
        const rightBottom = {
            x: node.x,
            y: node.y + node.height - nodeSpacingV / 2,
            key: `skipped_right_bottom_${node.key}`,
            isPlaceholder: true,
            isHidden: true,
        };
        const rightTop = {
            x: node.x + node.width,
            y: node.y,
            key: `skipped_right_top_${node.key}`,
            isPlaceholder: true,
            isHidden: true,
        };
        const leftMidX = leftTop.x + nodeSpacingH / 2;
        const rightMidX = rightTop.x - nodeSpacingH / 2;
        this.renderBasicCurvedConnection(leftTop, leftBottom, leftMidX, svgElements, false, smallerCurveRadius);
        this.renderBasicCurvedConnection(rightBottom, rightTop, rightMidX, svgElements, false, smallerCurveRadius);
    }
    /**
     * Generates an SVG path string for the "vertical" S curve used to connect nodes in adjacent columns.
     */
    svgBranchCurve(x1, y1, x2, y2, midPointX, curveRadius) {
        const verticalDirection = Math.sign(y2 - y1); // 1 == curve down, -1 == curve up
        const w1 = midPointX - curveRadius - x1 + curveRadius * verticalDirection;
        const w2 = x2 - curveRadius - midPointX - curveRadius * verticalDirection;
        const v = y2 - y1 - 2 * curveRadius * verticalDirection; // Will be -ive if curve up
        const cv = verticalDirection * curveRadius;
        return ((y1 > y2 ? ` l ${w1} 0` : ` m ${w1} 0`) + // first horizontal line
            ` c ${curveRadius} 0 ${curveRadius} ${cv} ${curveRadius} ${cv}` + // turn
            ` l 0 ${v}` + // vertical line
            ` c 0 ${cv} ${curveRadius} ${cv} ${curveRadius} ${cv}` + // turn again
            (y1 < y2 ? ` l ${w2} 0` : "") // second horizontal line
        );
    }
    render() {
        const { connections } = this.props;
        const svgElements = []; // Buffer for children of the SVG
        connections.forEach((connection) => {
            this.renderCompositeConnection(connection, svgElements);
        });
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: svgElements });
    }
}
exports.GraphConnections = GraphConnections;

},
"upstream/pipeline-graph-view/pipeline-graph/main/support/StatusIcons.tsx":function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeStrokeWidth = void 0;
exports.nodeStrokeWidth = 3.5; // px.

},
"upstream/pipeline-graph-view/pipeline-graph/main/support/DebugOutline.tsx":function(module,exports,require){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugOutline = DebugOutline;
const jsx_runtime_1 = require("runtime/jsx-runtime.cjs");
const react_1 = require("runtime/react.cjs");
const tooltip_tsx_1 = __importDefault(require("src/compat/tooltip.tsx"));
function DebugOutline({ node, layout }) {
    const [visible, setVisible] = (0, react_1.useState)(true);
    const timeoutRef = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(() => {
        return () => {
            if (timeoutRef.current)
                clearTimeout(timeoutRef.current);
        };
    }, []);
    const hide = (0, react_1.useCallback)(() => {
        setVisible(false);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
            setVisible(true);
        }, 10_000);
    }, []);
    if (!visible)
        return null;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(tooltip_tsx_1.default, { content: `${node.id} (${node.name})`, children: (0, jsx_runtime_1.jsx)("rect", { x: node.x, y: node.y, width: node.width || 1, height: node.height, strokeWidth: 2, stroke: "red", fill: "red", fillOpacity: 0.1, onClick: hide }) }), node.shiftX > 0 && ((0, jsx_runtime_1.jsx)(tooltip_tsx_1.default, { content: `${node.id} (${node.name}) shiftX`, children: (0, jsx_runtime_1.jsx)("rect", { x: node.x + 2, y: node.y + 2, width: node.shiftX - 4, height: node.height - 4, strokeWidth: 2, strokeDasharray: "5,5", stroke: "blue", fill: "blue", fillOpacity: 0.075, onClick: hide }) })), node.shiftY > 0 && ((0, jsx_runtime_1.jsx)(tooltip_tsx_1.default, { content: `${node.id} (${node.name}) shiftY`, children: (0, jsx_runtime_1.jsx)("rect", { x: node.x + 2, y: node.y - node.shiftY + 2, width: node.width - 4, height: node.shiftY - 4, strokeWidth: 2, strokeDasharray: "3,3", stroke: "green", fill: "green", fillOpacity: 0.075, onClick: hide }) })), (0, jsx_runtime_1.jsx)(tooltip_tsx_1.default, { content: `${node.id} (${node.name}) center`, children: (0, jsx_runtime_1.jsx)("rect", { x: node.x + node.width / 2 - layout.nodeSpacingH / 2, y: node.y - layout.nodeRadius - 8, width: 1, height: layout.nodeRadius + 8, strokeWidth: 2, strokeDasharray: "2,2", stroke: "black", fill: "black", fillOpacity: 0.075, onClick: hide }) })] }));
}

},
"src/compat/tooltip.tsx":function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooltipRoot = void 0;
exports.default = Tooltip;
const jsx_runtime_1 = require("runtime/jsx-runtime.cjs");
const react_1 = require("runtime/react.cjs");
const react_dom_1 = require("runtime/react-dom.cjs");
exports.TooltipRoot = (0, react_1.createContext)(null);
function Tooltip({ children, content }) {
    const root = (0, react_1.useContext)(exports.TooltipRoot), [position, setPosition] = (0, react_1.useState)(null);
    if (content === undefined)
        return children;
    function show(e) { const r = e.currentTarget.getBoundingClientRect(); setPosition({ x: Math.min(window.innerWidth - 180, Math.max(180, r.x + r.width / 2)), y: r.bottom + 8 }); }
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, react_1.cloneElement)(children, {
                onMouseEnter: (e) => { children.props.onMouseEnter?.(e); show(e); },
                onMouseLeave: (e) => { children.props.onMouseLeave?.(e); setPosition(null); },
                onFocus: (e) => { children.props.onFocus?.(e); show(e); },
                onBlur: (e) => { children.props.onBlur?.(e); setPosition(null); }
            }), position && root && (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsx)("div", { role: "tooltip", className: "pgvx-tooltip", style: { left: position.x, top: position.y }, children: content }), root)] });
}

},
"upstream/pipeline-graph-view/pipeline-graph/main/support/labels.tsx":function(module,exports,require){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequentialContainerLabel = exports.SmallLabel = exports.TimingsLabel = exports.BigLabel = void 0;
const jsx_runtime_1 = require("runtime/jsx-runtime.cjs");
const react_1 = require("runtime/react.cjs");
const index_ts_1 = require("src/compat/i18n.tsx");
const classnames_ts_1 = require("upstream/common/utils/classnames.ts");
const live_total_tsx_1 = __importDefault(require("src/compat/live-total.tsx"));
const convertLabelToTooltip_tsx_1 = require("upstream/pipeline-graph-view/pipeline-graph/main/support/convertLabelToTooltip.tsx");
const StatusIcons_tsx_1 = require("upstream/pipeline-graph-view/pipeline-graph/main/support/StatusIcons.tsx");
const TruncatingLabel_tsx_1 = require("upstream/pipeline-graph-view/pipeline-graph/main/support/TruncatingLabel.tsx");
function countLeafStages(stage) {
    if (stage.children.length === 0) {
        return stage.collapsedChildCount ?? 1;
    }
    return stage.children.reduce((sum, child) => sum + countLeafStages(child), 0);
}
function getChildCount(stage) {
    if (!stage)
        return 0;
    return stage.children.length > 0
        ? countLeafStages(stage)
        : (stage.collapsedChildCount ?? 0);
}
function CollapseBadge({ stage, isCollapsed, onToggleCollapse, }) {
    const messages = (0, react_1.useContext)(index_ts_1.I18NContext);
    const childCount = getChildCount(stage);
    if (childCount <= 0)
        return null;
    const handleClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (onToggleCollapse && stage) {
            onToggleCollapse(stage.id);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("span", { className: "PWGx-pipeline-collapse-badge", onClick: handleClick, onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            if (onToggleCollapse && stage)
                onToggleCollapse(stage.id);
        } }, role: "button", tabIndex: 0, title: isCollapsed
            ? messages.format(index_ts_1.LocalizedMessageKey.expandNestedStages)
            : messages.format(index_ts_1.LocalizedMessageKey.collapseNestedStages), children: ["(", childCount, ")", (0, jsx_runtime_1.jsx)("svg", { className: (0, classnames_ts_1.classNames)("PWGx-pipeline-collapse-chevron", {
                    "PWGx-pipeline-collapse-chevron--expanded": !isCollapsed,
                }), xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512", children: (0, jsx_runtime_1.jsx)("path", { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "48", d: "M184 112l144 144-144 144" }) })] }));
}
exports.BigLabel = (0, react_1.memo)(BigLabelImpl);
function BigLabelImpl({ details, layout, measuredHeight, isSelected, isCollapsed, onToggleCollapse, }) {
    const { nodeSpacingH, labelOffsetV, connectorStrokeWidth, ypStart } = layout;
    const labelWidth = nodeSpacingH - connectorStrokeWidth * 2;
    const labelHeight = ypStart - labelOffsetV;
    const labelOffsetH = Math.floor(labelWidth / -2);
    // These are about layout more than appearance, so they should probably remain inline
    const bigLabelStyle = {
        position: "absolute",
        width: labelWidth,
        maxHeight: labelHeight + "px",
        textAlign: "center",
        marginLeft: labelOffsetH,
    };
    const x = details.x;
    const bottom = measuredHeight - details.y + labelOffsetV;
    // These are about layout more than appearance, so they're inline
    const style = {
        ...bigLabelStyle,
        bottom: bottom + "px",
        left: x + "px",
    };
    const classNames = ["PWGx-pipeline-big-label"];
    if (isSelected) {
        classNames.push("PWGx-pipeline-big-label--selected");
    }
    if (details.stage && details.stage.synthetic) {
        classNames.push("pgv-graph-node--synthetic");
    }
    if (details.stage?.skeleton) {
        classNames.push("pgv-graph-node--skeleton");
    }
    if (details.node.isPlaceholder) {
        classNames.push("pgv-graph-node--skeleton");
    }
    const childCount = getChildCount(details.stage);
    return ((0, jsx_runtime_1.jsx)("div", { className: classNames.join(" "), style: style, children: childCount > 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "PWGx-pipeline-big-label-content", children: [(0, jsx_runtime_1.jsx)(TruncatingLabel_tsx_1.TruncatingLabel, { children: details.text }), (0, jsx_runtime_1.jsx)(CollapseBadge, { stage: details.stage, isCollapsed: isCollapsed, onToggleCollapse: onToggleCollapse })] })) : ((0, jsx_runtime_1.jsx)(TruncatingLabel_tsx_1.TruncatingLabel, { children: details.text })) }, details.key));
}
exports.TimingsLabel = (0, react_1.memo)(TimingsLabelImpl);
function TimingsLabelImpl({ details, layout, measuredHeight, isSelected, }) {
    const { nodeSpacingH, labelOffsetV, connectorStrokeWidth, ypStart } = layout;
    const labelWidth = nodeSpacingH - connectorStrokeWidth * 2;
    const labelHeight = ypStart - labelOffsetV;
    const labelOffsetH = Math.floor(labelWidth / -2);
    // These are about layout more than appearance, so they should probably remain inline
    const timingsLabelStyle = {
        position: "absolute",
        width: labelWidth,
        maxHeight: labelHeight + "px",
        textAlign: "center",
        marginLeft: labelOffsetH,
        color: "var(--text-color-secondary)",
    };
    const x = details.x;
    const bottom = measuredHeight - details.y + labelOffsetV;
    // These are about layout more than appearance, so they're inline
    const style = {
        ...timingsLabelStyle,
        bottom: bottom + "px",
        left: x + "px",
    };
    const classNames = ["PWGx-pipeline-big-label"];
    if (isSelected) {
        classNames.push("PWGx-pipeline-big-label--selected");
    }
    if (details.stage?.synthetic) {
        classNames.push("pgv-graph-node--synthetic");
    }
    if (details.stage?.skeleton) {
        classNames.push("pgv-graph-node--skeleton");
    }
    if (details.node.isPlaceholder) {
        classNames.push("pgv-graph-node--skeleton");
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: classNames.join(" "), style: style, children: (0, jsx_runtime_1.jsx)(live_total_tsx_1.default, { label: details.stage?.pgvxDurationLabel, total: details.stage?.totalDurationMillis, start: details.stage?.startTimeMillis ?? Date.now(), paused: details.stage?.pauseLiveTotal }) }, details.key));
}
exports.SmallLabel = (0, react_1.memo)(SmallLabelImpl);
function SmallLabelImpl({ details, layout, isSelected, isCollapsed, onToggleCollapse, }) {
    const { nodeSpacingH, nodeSpacingV, curveRadius, connectorStrokeWidth, nodeRadius, smallLabelOffsetV, } = layout;
    const smallLabelWidth = Math.floor(nodeSpacingH - 2 * curveRadius - 2 * connectorStrokeWidth); // Fit between lines
    const smallLabelHeight = Math.floor(nodeSpacingV - smallLabelOffsetV - nodeRadius - StatusIcons_tsx_1.nodeStrokeWidth);
    const smallLabelOffsetH = Math.floor(smallLabelWidth * -0.5);
    const x = details.x + smallLabelOffsetH;
    const top = details.y + smallLabelOffsetV;
    // These are about layout more than appearance, so they're inline
    const style = {
        top,
        left: x,
        position: "absolute",
        width: smallLabelWidth,
        maxHeight: smallLabelHeight,
        textAlign: "center",
    };
    const classNames = ["PWGx-pipeline-small-label"];
    if (details.stage && isSelected) {
        classNames.push("PWGx-pipeline-small-label--selected");
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: classNames.join(" "), style: style, children: [(0, jsx_runtime_1.jsx)(TruncatingLabel_tsx_1.TruncatingLabel, { children: details.text }), (0, jsx_runtime_1.jsx)(CollapseBadge, { stage: details.stage, isCollapsed: isCollapsed, onToggleCollapse: onToggleCollapse })] }, details.key));
}
exports.SequentialContainerLabel = (0, react_1.memo)(SequentialContainerLabelImpl);
function SequentialContainerLabelImpl({ details, layout, isCollapsed, onToggleCollapse, }) {
    const { nodeRadius } = layout;
    const seqContainerName = details.text;
    const y = details.y;
    const x = details.x - Math.floor(nodeRadius * 2); // Because label X is a "node center"-relative position
    const lineHeight = 1.35;
    const childCount = getChildCount(details.stage);
    const containerStyle = {
        top: y,
        left: x,
        lineHeight,
        marginTop: `-${lineHeight / 2}em`,
        position: "absolute",
        maxWidth: layout.nodeSpacingH,
        background: "var(--card-background)",
        fontSize: "0.875rem",
        fontWeight: "var(--font-bold-weight)",
        padding: "0 5px",
        whiteSpace: "nowrap",
        display: childCount > 0 ? "flex" : undefined,
        alignItems: childCount > 0 ? "baseline" : undefined,
        gap: childCount > 0 ? "2px" : undefined,
    };
    return ((0, jsx_runtime_1.jsx)(convertLabelToTooltip_tsx_1.TooltipLabel, { content: seqContainerName, children: (0, jsx_runtime_1.jsxs)("div", { style: containerStyle, children: [(0, jsx_runtime_1.jsx)("span", { style: {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: 0,
                        flex: childCount > 0 ? "0 1 auto" : undefined,
                    }, children: seqContainerName }), (0, jsx_runtime_1.jsx)(CollapseBadge, { stage: details.stage, isCollapsed: isCollapsed, onToggleCollapse: onToggleCollapse })] }, details.key) }));
}

},
"upstream/common/utils/classnames.ts":function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classNames = classNames;
function classNames(...inputs) {
    return inputs
        .flatMap((item) => {
        if (typeof item === "string")
            return item;
        return Object.entries(item)
            .filter(([_, value]) => value)
            .map(([className]) => className);
    })
        .join(" ");
}

},
"src/compat/live-total.tsx":function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LiveTotal;
const jsx_runtime_1 = require("runtime/jsx-runtime.cjs");
const react_1 = require("runtime/react.cjs");
const model_ts_1 = require("src/model.ts");
function LiveTotal({ total, start, paused, label }) {
    const [now, setNow] = (0, react_1.useState)(Date.now());
    (0, react_1.useEffect)(() => { if (total !== undefined || paused)
        return; const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, [total, paused]);
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: label ?? (paused && total === undefined ? 'Unknown' : (0, model_ts_1.formatMs)(total ?? Math.max(0, now - start))) });
}

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
"upstream/pipeline-graph-view/pipeline-graph/main/support/convertLabelToTooltip.tsx":function(module,exports,require){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertLabelToTooltip = convertLabelToTooltip;
exports.TooltipLabel = TooltipLabel;
const jsx_runtime_1 = require("runtime/jsx-runtime.cjs");
const tooltip_tsx_1 = __importDefault(require("src/compat/tooltip.tsx"));
function convertLabelToTooltip(content) {
    if (content.startsWith("Matrix -")) {
        return content
            .replace("Matrix - ", "")
            .split("',")
            .map((element) => {
            const result = element.split("=");
            return {
                key: result[0].trim(),
                value: result[1].trim().replace(/'/g, ""),
            };
        });
    }
    return content;
}
function TooltipLabel(props) {
    const result = convertLabelToTooltip(props.content);
    if (typeof result === "string") {
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(tooltip_tsx_1.default, { content: result, interactive: true, followCursor: true, children: props.children }) }));
    }
    const table = ((0, jsx_runtime_1.jsx)("table", { children: result.map((val, key) => {
            return ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { children: val.key }), (0, jsx_runtime_1.jsx)("td", { children: val.value })] }, key));
        }) }));
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(tooltip_tsx_1.default, { content: table, interactive: true, appendTo: document.body, children: props.children }) }));
}

},
"upstream/pipeline-graph-view/pipeline-graph/main/support/TruncatingLabel.tsx":function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TruncatingLabel = TruncatingLabel;
const jsx_runtime_1 = require("runtime/jsx-runtime.cjs");
function TruncatingLabel({ children, style = {}, className = "", }) {
    const mergedStyle = {
        display: "-webkit-box",
        overflow: "hidden",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        ...style,
    };
    return ((0, jsx_runtime_1.jsx)("div", { style: mergedStyle, className: `TruncatingLabel ${className}`.trim(), title: children, children: children }));
}

},
"upstream/pipeline-graph-view/pipeline-graph/main/support/nodes.tsx":function(module,exports,require){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
exports.SelectionHighlight = SelectionHighlight;
const jsx_runtime_1 = require("runtime/jsx-runtime.cjs");
require("@empty");
const react_1 = require("runtime/react.cjs");
const status_icon_tsx_1 = require("upstream/common/components/status-icon.tsx");
const tooltip_tsx_1 = __importDefault(require("src/compat/tooltip.tsx"));
const classnames_ts_1 = require("upstream/common/utils/classnames.ts");
const live_total_tsx_1 = __importDefault(require("src/compat/live-total.tsx"));
exports.Node = (0, react_1.memo)(NodeImpl);
function NodeImpl({ node, collapsed, onStageSelect, isSelected }) {
    const key = node.key;
    if (node.isPlaceholder) {
        if (node.type === "counter") {
            const tooltip = ((0, jsx_runtime_1.jsx)("ol", { className: "pgv-node__counter-tooltip", children: node.stages.map((stage) => ((0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)("a", { className: "jenkins-button jenkins-button--tertiary", href: stage.url, children: [(0, jsx_runtime_1.jsx)(status_icon_tsx_1.StageStatusIcon, { stage: stage }), stage.name, (0, jsx_runtime_1.jsx)("span", { style: { color: "var(--text-color-secondary)" }, children: (0, jsx_runtime_1.jsx)(live_total_tsx_1.default, { label: stage.pgvxDurationLabel, total: stage.totalDurationMillis, start: stage.startTimeMillis, paused: stage.pauseLiveTotal }) })] }) }, stage.id))) }));
            return ((0, jsx_runtime_1.jsx)(tooltip_tsx_1.default, { content: tooltip, interactive: true, appendTo: document.body, children: (0, jsx_runtime_1.jsx)("div", { style: {
                        position: "absolute",
                        top: node.y,
                        left: node.x,
                        translate: "-50% -50%",
                    }, className: "PWGx-pipeline-node", children: (0, jsx_runtime_1.jsx)("span", { className: "PWGx-pipeline-node-counter", children: node.stages.length }) }, key) }));
        }
        return ((0, jsx_runtime_1.jsxs)("div", { style: {
                position: "absolute",
                top: node.y,
                left: node.x,
                translate: "-50% -50%",
            }, className: "PWGx-pipeline-node", children: [node.type === "start" && node.url && ((0, jsx_runtime_1.jsx)("a", { href: node.url?.replace("stages/?selected-node=-1", "console"), onClick: (e) => {
                        if (onStageSelect) {
                            e.preventDefault();
                            onStageSelect(String(node.id));
                        }
                    }, children: (0, jsx_runtime_1.jsx)("span", { className: "jenkins-visually-hidden", children: node.name }) })), (0, jsx_runtime_1.jsx)("span", { className: "PWGx-pipeline-node-terminal" })] }, key));
    }
    const groupChildren = [];
    const { title, state, url } = node.stage ?? {};
    groupChildren.push((0, jsx_runtime_1.jsx)(status_icon_tsx_1.StageStatusIcon, { stage: node.stage }, `icon-${node.id}`));
    const clickable = !node.isPlaceholder &&
        node.stage?.state !== "skipped" &&
        !node.stage.skeleton;
    // Most of the nodes are in shared code, so they're rendered at 0,0. We transform with a <g> to position them
    const groupProps = {
        key,
        style: {
            position: "absolute",
            top: node.y,
            left: node.x,
            translate: "-50% -50%",
        },
        className: (0, classnames_ts_1.classNames)("PWGx-pipeline-node", "PWGx-pipeline-node--" + state, (0, status_icon_tsx_1.resultToColor)(node.stage.state, node.stage.skeleton), {
            "PWGx-pipeline-node--selected": isSelected,
        }),
    };
    const causeOfBlockage = node.stage.state === "queued" ? node.stage.causeOfBlockage : undefined;
    let tooltip;
    if (collapsed) {
        tooltip = ((0, jsx_runtime_1.jsxs)("div", { className: "pgv-node-tooltip", children: [(0, jsx_runtime_1.jsx)("div", { children: title }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(live_total_tsx_1.default, { label: node.stage.pgvxDurationLabel, total: node.stage.totalDurationMillis, start: node.stage.startTimeMillis, paused: node.stage.pauseLiveTotal }) }), causeOfBlockage && (0, jsx_runtime_1.jsx)("div", { children: causeOfBlockage })] }));
    }
    else {
        tooltip = ((0, jsx_runtime_1.jsxs)("div", { className: "pgv-node-tooltip", children: [(0, jsx_runtime_1.jsx)(live_total_tsx_1.default, { label: node.stage.pgvxDurationLabel, total: node.stage.totalDurationMillis, start: node.stage.startTimeMillis, paused: node.stage.pauseLiveTotal }), causeOfBlockage && (0, jsx_runtime_1.jsx)("div", { children: causeOfBlockage })] }));
    }
    return ((0, jsx_runtime_1.jsx)(tooltip_tsx_1.default, { content: tooltip, children: (0, jsx_runtime_1.jsxs)("div", { ...groupProps, children: [groupChildren, clickable && ((0, jsx_runtime_1.jsx)("a", { href: url, onClick: (e) => {
                        if (onStageSelect) {
                            e.preventDefault();
                            onStageSelect(String(node.stage.id));
                        }
                    }, children: (0, jsx_runtime_1.jsx)("span", { className: "jenkins-visually-hidden", children: title }) }))] }) }));
}
/**
 * Generates SVG for visual highlight to show which node is selected.
 */
function SelectionHighlight({ layout, nodes, isStageSelected, }) {
    const { nodeRadius, connectorStrokeWidth } = layout;
    const highlightRadius = Math.ceil(nodeRadius + 0.5 * connectorStrokeWidth + 1);
    const selectedNode = (() => {
        for (const node of nodes) {
            if (!node.isPlaceholder && isStageSelected(node.stage)) {
                return node;
            }
        }
        return undefined;
    })();
    if (!selectedNode)
        return null;
    const transform = `translate(${selectedNode.x} ${selectedNode.y})`;
    return ((0, jsx_runtime_1.jsx)("g", { className: "PWGx-pipeline-selection-highlight", transform: transform, children: (0, jsx_runtime_1.jsx)("circle", { r: highlightRadius, strokeWidth: connectorStrokeWidth }) }, "selection-highlight"));
}

},
"@empty":function(module,exports,require){
module.exports={};
},
"upstream/common/components/status-icon.tsx":function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStageProgress = useStageProgress;
exports.StageStatusIcon = StageStatusIcon;
exports.default = StatusIcon;
exports.resultToColor = resultToColor;
const jsx_runtime_1 = require("runtime/jsx-runtime.cjs");
require("@empty");
const react_1 = require("runtime/react.cjs");
const PipelineGraphModel_tsx_1 = require("upstream/pipeline-graph-view/pipeline-graph/main/PipelineGraphModel.tsx");
function useStageProgress(stage) {
    const [percentage, setPercentage] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        if (stage.state !== PipelineGraphModel_tsx_1.Result.running) {
            // percentage is only needed for the running icon.
            setPercentage(0);
            return;
        }
        const update = () => {
            const currentTiming = stage.totalDurationMillis ?? Date.now() - stage.startTimeMillis;
            const previousTiming = stage.previousTotalDurationMillis ?? 10_000;
            setPercentage(Math.min(99, (currentTiming / previousTiming) * 100));
        };
        update();
        const inter = setInterval(update, 1_000);
        return () => clearInterval(inter);
    }, [
        stage.state,
        stage.startTimeMillis,
        stage.totalDurationMillis,
        stage.previousTotalDurationMillis,
    ]);
    return percentage;
}
function StageStatusIcon({ stage }) {
    return ((0, jsx_runtime_1.jsx)(StatusIcon, { status: stage.state, percentage: useStageProgress(stage), skeleton: stage.skeleton }));
}
/**
 * Visual representation of a job or build status
 */
function StatusIcon({ status, percentage, skeleton, }) {
    const viewBoxSize = 512;
    const strokeWidth = status === "running" ? 50 : 0;
    const radius = (viewBoxSize - strokeWidth) / 2.2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - ((percentage ?? 100) / 100) * circumference;
    return ((0, jsx_runtime_1.jsxs)("svg", { viewBox: `0 0 ${viewBoxSize} ${viewBoxSize}`, className: "pgv-status-icon " + resultToColor(status, skeleton), opacity: skeleton ? 0.5 : 1, role: "img", "aria-label": status, children: [(0, jsx_runtime_1.jsx)("circle", { cx: viewBoxSize / 2, cy: viewBoxSize / 2, r: radius - 20, fill: "var(--card-background)" }), (0, jsx_runtime_1.jsx)("circle", { cx: viewBoxSize / 2, cy: viewBoxSize / 2, r: radius, fill: "var(--color)", opacity: "var(--status-background-opacity)", style: {
                    transition: "var(--standard-transition)",
                } }), (0, jsx_runtime_1.jsx)("circle", { cx: viewBoxSize / 2, cy: viewBoxSize / 2, r: radius - 10, fill: "none", stroke: "var(--color)", strokeWidth: 20, strokeOpacity: "var(--status-border-opacity)" }), (0, jsx_runtime_1.jsx)("circle", { cx: viewBoxSize / 2, cy: viewBoxSize / 2, r: radius, fill: "none", stroke: "var(--color)", strokeWidth: strokeWidth, strokeLinecap: "round", strokeDasharray: circumference, strokeDashoffset: offset, style: {
                    transform: "rotate(-90deg)",
                    transformOrigin: "50% 50%",
                    transition: "var(--standard-transition)",
                } }), (0, jsx_runtime_1.jsx)(Group, { currentStatus: status, status: PipelineGraphModel_tsx_1.Result.running, children: (0, jsx_runtime_1.jsx)("circle", { cx: "256", cy: "256", r: "40", fill: "var(--color)", className: status === "running" ? "pgv-scale" : "" }) }), (0, jsx_runtime_1.jsx)(Group, { currentStatus: status, status: PipelineGraphModel_tsx_1.Result.success, children: (0, jsx_runtime_1.jsx)("path", { d: "M336 189L224 323L176 269.4", fill: "transparent", stroke: "var(--color)", strokeWidth: 32, strokeLinecap: "round", strokeLinejoin: "round" }) }), (0, jsx_runtime_1.jsx)(Group, { currentStatus: status, status: PipelineGraphModel_tsx_1.Result.failure, children: (0, jsx_runtime_1.jsx)("path", { fill: "none", stroke: "var(--color)", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 32, d: "M320 320L192 192M192 320l128-128" }) }), (0, jsx_runtime_1.jsx)(Group, { currentStatus: status, status: PipelineGraphModel_tsx_1.Result.aborted, children: (0, jsx_runtime_1.jsx)("path", { fill: "none", stroke: "var(--color)", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 32, d: "M192 320l128-128" }) }), (0, jsx_runtime_1.jsxs)(Group, { currentStatus: status, status: PipelineGraphModel_tsx_1.Result.unstable, children: [(0, jsx_runtime_1.jsx)("path", { d: "M250.26 166.05L256 288l5.73-121.95a5.74 5.74 0 00-5.79-6h0a5.74 5.74 0 00-5.68 6z", fill: "none", stroke: "var(--color)", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 32 }), (0, jsx_runtime_1.jsx)("ellipse", { cx: "256", cy: "350", rx: "26", ry: "26", fill: "var(--color)" })] }), (0, jsx_runtime_1.jsx)(Group, { currentStatus: status, status: PipelineGraphModel_tsx_1.Result.skipped, children: (0, jsx_runtime_1.jsxs)("g", { transform: "scale(0.8)", children: [(0, jsx_runtime_1.jsx)("path", { fill: "none", stroke: "var(--color)", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "36", d: "M216 352l96-96-96-96", transform: "translate(-55, 0)" }), (0, jsx_runtime_1.jsx)("path", { fill: "none", stroke: "var(--color)", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "36", d: "M216 352l96-96-96-96", transform: "translate(75, 0)" })] }) }), (0, jsx_runtime_1.jsx)(Group, { currentStatus: status, status: PipelineGraphModel_tsx_1.Result.paused, children: (0, jsx_runtime_1.jsx)("path", { fill: "none", stroke: "var(--color)", strokeLinecap: "round", strokeMiterlimit: "10", strokeWidth: 32, d: "M208 192v128M304 192v128" }) }), (0, jsx_runtime_1.jsx)(Group, { currentStatus: status, status: PipelineGraphModel_tsx_1.Result.queued, children: (0, jsx_runtime_1.jsxs)("g", { transform: "scale(0.6)", children: [(0, jsx_runtime_1.jsx)("path", { d: "M145.61 464h220.78c19.8 0 35.55-16.29 33.42-35.06C386.06 308 304 310 304 256s83.11-51 95.8-172.94c2-18.78-13.61-35.06-33.41-35.06H145.61c-19.8 0-35.37 16.28-33.41 35.06C124.89 205 208 201 208 256s-82.06 52-95.8 172.94c-2.14 18.77 13.61 35.06 33.41 35.06z", fill: "none", stroke: "var(--color)", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 32 }), (0, jsx_runtime_1.jsx)("path", { d: "M343.3 432H169.13c-15.6 0-20-18-9.06-29.16C186.55 376 240 356.78 240 326V224c0-19.85-38-35-61.51-67.2-3.88-5.31-3.49-12.8 6.37-12.8h142.73c8.41 0 10.23 7.43 6.4 12.75C310.82 189 272 204.05 272 224v102c0 30.53 55.71 47 80.4 76.87 9.95 12.04 6.47 29.13-9.1 29.13z", fill: "var(--color)" })] }) }), (0, jsx_runtime_1.jsxs)(Group, { currentStatus: status, status: PipelineGraphModel_tsx_1.Result.not_built, children: [(0, jsx_runtime_1.jsx)("circle", { cx: "256", cy: "256", r: "30", fill: "var(--color)" }), (0, jsx_runtime_1.jsx)("circle", { cx: "352", cy: "256", r: "30", fill: "var(--color)" }), (0, jsx_runtime_1.jsx)("circle", { cx: "160", cy: "256", r: "30", fill: "var(--color)" })] }), (0, jsx_runtime_1.jsxs)(Group, { currentStatus: status, status: PipelineGraphModel_tsx_1.Result.unknown, children: [(0, jsx_runtime_1.jsx)("path", { d: "M200 202.29s.84-17.5 19.57-32.57C230.68 160.77 244 158.18 256 158c10.93-.14 20.69 1.67 26.53 4.45 10 4.76 29.47 16.38 29.47 41.09 0 26-17 37.81-36.37 50.8S251 281.43 251 296", fill: "none", stroke: "var(--color)", strokeLinecap: "round", strokeMiterlimit: "10", strokeWidth: "28" }), (0, jsx_runtime_1.jsx)("circle", { cx: "250", cy: "348", r: "20", fill: "var(--color)" })] })] }));
}
function Group({ currentStatus, status, children, }) {
    if (currentStatus !== status)
        return null;
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
}
function resultToColor(result, skeleton) {
    if (skeleton) {
        return "jenkins-!-skipped-color";
    }
    switch (result) {
        case "success":
            return "jenkins-!-success-color";
        case "failure":
            return "jenkins-!-error-color";
        case "running":
            return "jenkins-!-accent-color";
        case "unstable":
            return "jenkins-!-warning-color";
        case "paused":
        case "queued":
            return "jenkins-!-accent-color";
        default:
            return "jenkins-!-skipped-color";
    }
}

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
"upstream/common/components/symbols.tsx":function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLLAPSE = exports.EXPAND = exports.SETTINGS = exports.CONSOLE = exports.DOCUMENT = void 0;
const jsx_runtime_1 = require("runtime/jsx-runtime.cjs");
exports.DOCUMENT = ((0, jsx_runtime_1.jsxs)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512", children: [(0, jsx_runtime_1.jsx)("path", { d: "M416 221.25V416a48 48 0 01-48 48H144a48 48 0 01-48-48V96a48 48 0 0148-48h98.75a32 32 0 0122.62 9.37l141.26 141.26a32 32 0 019.37 22.62z", fill: "none", stroke: "currentColor", strokeLinejoin: "round", strokeWidth: "32" }), (0, jsx_runtime_1.jsx)("path", { d: "M256 56v120a32 32 0 0032 32h120M176 288h160M176 368h160", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "32" })] }));
exports.CONSOLE = ((0, jsx_runtime_1.jsxs)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512", children: [(0, jsx_runtime_1.jsx)("rect", { x: "32", y: "48", width: "448", height: "416", rx: "48", ry: "48", fill: "none", stroke: "currentColor", strokeLinejoin: "round", strokeWidth: "32" }), (0, jsx_runtime_1.jsx)("path", { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "32", d: "M96 112l80 64-80 64M192 240h64" })] }));
exports.SETTINGS = ((0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512", "aria-hidden": true, children: (0, jsx_runtime_1.jsx)("path", { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "32", d: "M262.29 192.31a64 64 0 1057.4 57.4 64.13 64.13 0 00-57.4-57.4zM416.39 256a154.34 154.34 0 01-1.53 20.79l45.21 35.46a10.81 10.81 0 012.45 13.75l-42.77 74a10.81 10.81 0 01-13.14 4.59l-44.9-18.08a16.11 16.11 0 00-15.17 1.75A164.48 164.48 0 01325 400.8a15.94 15.94 0 00-8.82 12.14l-6.73 47.89a11.08 11.08 0 01-10.68 9.17h-85.54a11.11 11.11 0 01-10.69-8.87l-6.72-47.82a16.07 16.07 0 00-9-12.22 155.3 155.3 0 01-21.46-12.57 16 16 0 00-15.11-1.71l-44.89 18.07a10.81 10.81 0 01-13.14-4.58l-42.77-74a10.8 10.8 0 012.45-13.75l38.21-30a16.05 16.05 0 006-14.08c-.36-4.17-.58-8.33-.58-12.5s.21-8.27.58-12.35a16 16 0 00-6.07-13.94l-38.19-30A10.81 10.81 0 0149.48 186l42.77-74a10.81 10.81 0 0113.14-4.59l44.9 18.08a16.11 16.11 0 0015.17-1.75A164.48 164.48 0 01187 111.2a15.94 15.94 0 008.82-12.14l6.73-47.89A11.08 11.08 0 01213.23 42h85.54a11.11 11.11 0 0110.69 8.87l6.72 47.82a16.07 16.07 0 009 12.22 155.3 155.3 0 0121.46 12.57 16 16 0 0015.11 1.71l44.89-18.07a10.81 10.81 0 0113.14 4.58l42.77 74a10.8 10.8 0 01-2.45 13.75l-38.21 30a16.05 16.05 0 00-6.05 14.08c.33 4.14.55 8.3.55 12.47z" }) }));
exports.EXPAND = ((0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512", children: (0, jsx_runtime_1.jsx)("path", { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "32", d: "M136 208l120-104 120 104M136 304l120 104 120-104" }) }));
exports.COLLAPSE = ((0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512", children: (0, jsx_runtime_1.jsx)("path", { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "32", d: "M136 104l120 104 120-104M136 408l120-104 120 104" }) }));

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

},
"src/shell.css":function(module,exports,require){
module.exports=":host {\n  all: initial;\n  display: block;\n  width: auto;\n  margin: 18px 0 24px;\n  font: 14px/1.5 system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif;\n  color: #172b4d;\n  --text-color: #172b4d;\n  --text-color-secondary: #66758c;\n  --background: #ffffff;\n  --card-background: #ffffff;\n  --line: #e0e5eb;\n  --surface: #f7f9fb;\n  --accent: #066caa;\n  --success: #218739;\n  --error: #cc2537;\n  --warning: #b77908;\n  --font-size-xs: 12px;\n  --font-size-sm: 14px;\n  --font-bold-weight: 600;\n  --jenkins-border-width: 1px;\n  --standard-transition: .16s ease;\n  --elastic-transition: .3s ease;\n  --status-background-opacity: .125;\n  --status-border-opacity: .25;\n}\n:host([data-theme=\"dark\"]) {\n  color:#dce4ef;--text-color:#dce4ef;--text-color-secondary:#99aac1;--background:#19212d;\n  --card-background:#19212d;--line:#354053;--surface:#212b3a;--accent:#79bdff;\n  --success:#6ccc82;--error:#ff7b8b;--warning:#f1c166;\n}\n*,*::before,*::after {box-sizing:border-box;}\nbutton,input,select,textarea {font:inherit;}\nbutton,select {color:var(--text-color);background:var(--card-background);border:1px solid var(--line);border-radius:6px;min-height:32px;padding:5px 10px;}\nbutton {cursor:pointer;transition:background .12s;}\nbutton:hover {background:var(--surface);}\nbutton:disabled {opacity:.45;cursor:default;}\nbutton:focus-visible,a:focus-visible,select:focus-visible,textarea:focus-visible,[role=\"button\"]:focus-visible {outline:2px solid var(--accent);outline-offset:2px;}\na {color:var(--accent);text-decoration:none;}\na:hover {text-decoration:underline;}\ninput[type=\"checkbox\"] {accent-color:var(--accent);margin:0 5px 0 0;vertical-align:middle;}\nselect {max-width:280px;}\nh2,h3,p {margin:0;}\nh2 {font-size:20px;line-height:1.3;font-weight:650;letter-spacing:-.3px;}\nh3 {font-size:14px;font-weight:650;}\np+p {margin-top:10px;}\ncode {font:12px ui-monospace,SFMono-Regular,Consolas,monospace;background:var(--surface);padding:1px 4px;border-radius:3px;}\nsvg {vertical-align:middle;}\n.pgvx-app {color:var(--text-color);background:var(--card-background);border:1px solid var(--line);border-radius:10px;min-width:0;overflow:visible;box-shadow:0 2px 8px #00000006;}\n.pgvx-header {display:flex;gap:16px;align-items:center;justify-content:space-between;padding:20px 22px 18px;flex-wrap:wrap;}\n.pgvx-heading h2 {display:flex;align-items:center;gap:10px;}\n.pgvx-local {font-size:9px;letter-spacing:.8px;background:var(--surface);border:1px solid var(--line);border-radius:4px;padding:2px 5px;color:var(--text-color-secondary);font-weight:650;}\n.pgvx-subtitle {font-size:12px;color:var(--text-color-secondary);margin-top:5px;word-break:break-word;}\n.pgvx-actions {display:flex;gap:7px;align-items:center;flex-wrap:wrap;}\n.pgvx-actions button {font-size:12px;white-space:nowrap;}\n.pgvx-icon-button {border:none;width:32px;height:32px;padding:5px;color:var(--text-color-secondary);background:transparent;}\n.pgvx-runbar {display:flex;align-items:center;gap:20px;flex-wrap:wrap;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:12px 22px;}\n.pgvx-run-select {display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text-color-secondary);}\n.pgvx-run-select select {font-size:12px;}\n.pgvx-run-summary {display:flex;align-items:center;gap:9px;flex-wrap:wrap;font-size:12px;}\n.pgvx-run-summary>.pgv-status-icon {width:26px;height:26px;}\n.pgvx-divider {width:1px;height:14px;background:var(--line);margin:0 4px;}\n.pgvx-run-actions {margin-left:auto;display:flex;gap:12px;align-items:center;font-size:11px;white-space:nowrap;}\n.pgvx-run-actions button {font-size:11px;}\n.pgvx-muted {color:var(--text-color-secondary);}\n.pgvx-notice {font-size:11px;color:var(--text-color-secondary);padding:10px 22px 4px;}\n.pgvx-text-button {font-size:11px;color:var(--accent);border:0;padding:1px 3px;min-height:0;background:transparent;}\n.pgvx-warning {color:var(--warning);font-size:12px;padding:7px 22px;}\n.pgvx-error {padding:12px 18px;margin:12px;border:1px solid color-mix(in srgb,var(--error),transparent 60%);background:color-mix(in srgb,var(--error),transparent 94%);color:var(--error);border-radius:6px;font-size:13px;}\n.pgvx-error p {margin:8px 0;}\n.pgvx-graph-card {position:relative;margin:12px 14px 0;border:1px solid var(--line);border-radius:8px;background:var(--card-background);overflow:hidden;}\n.pgvx-graph-title {position:absolute;top:12px;left:14px;z-index:2;font-size:12px;color:var(--text-color-secondary);font-weight:600;pointer-events:none;}\n.pgvx-fullscreen {position:absolute;right:7px;top:5px;z-index:2;}\n.pgvx-viewport {overflow:auto;position:relative;padding:38px 12px 26px;scrollbar-width:thin;scrollbar-color:var(--line) transparent;}\n.pgvx-scaled-space {position:relative;margin:0 auto;}\n.pgvx-scaled-content {position:absolute;left:0;top:0;transform-origin:0 0;width:max-content;}\n.pgvx-zoom-controls {position:absolute;right:8px;bottom:7px;display:flex;align-items:center;gap:2px;padding:3px;border-radius:7px;background:color-mix(in srgb,var(--card-background) 93%,transparent);backdrop-filter:blur(10px);}\n.pgvx-zoom-controls button {border:0;border-radius:5px;background:transparent;width:30px;height:30px;min-height:30px;padding:5px;font-size:19px;color:var(--text-color-secondary);display:flex;align-items:center;justify-content:center;}\n.pgvx-zoom-controls button:hover {background:var(--surface);color:var(--text-color);}\n.pgvx-zoom-controls svg {width:16px;height:16px;}\n.pgvx-zoom-value {font-size:10px;color:var(--text-color-secondary);margin-right:5px;min-width:30px;text-align:right;}\n.pgvx-graph-card.is-fullscreen {position:fixed;inset:14px;margin:0;z-index:2147483600;box-shadow:0 0 0 40px #0008;}\n.is-fullscreen .pgvx-viewport {height:100%;}\n.pgvx-graph-footer {display:flex;gap:20px;align-items:center;justify-content:space-between;font-size:11px;padding:9px 22px 14px;color:var(--text-color-secondary);flex-wrap:wrap;}\n.pgvx-inspector {display:grid;grid-template-columns:265px minmax(0,1fr);border-top:1px solid var(--line);min-height:210px;}\n.pgvx-tree {border-right:1px solid var(--line);padding:12px 4px 18px;max-height:500px;overflow:auto;}\n.pgvx-tree h3 {padding:0 14px 10px;color:var(--text-color-secondary);font-size:12px;}\n.pgvx-tree-row {display:flex;align-items:center;padding-right:4px;min-height:32px;border-radius:5px;}\n.pgvx-tree-row.is-selected {background:color-mix(in srgb,var(--accent),transparent 92%);}\n.pgvx-tree-chevron,.pgvx-tree-spacer {display:block;width:18px;flex-shrink:0;}\n.pgvx-tree-chevron {min-height:26px;height:26px;font-size:18px;border:none;background:transparent;padding:0;color:var(--text-color-secondary);}\n.pgvx-tree-item {flex:1;min-width:0;text-align:left;display:flex;align-items:center;gap:7px;min-height:28px;border:none;background:transparent;padding:4px 2px;font-size:11px;}\n.pgvx-tree-item>svg {width:20px;height:20px;flex-shrink:0;}\n.pgvx-tree-item>span {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n.pgvx-details {padding:16px 22px;min-width:0;max-height:650px;overflow:auto;}\n.pgvx-empty {color:var(--text-color-secondary);padding:22px;line-height:1.6;font-size:13px;}\n.pgvx-empty h3 {font-size:15px;color:var(--text-color);margin-bottom:9px;}\n.pgvx-details>.pgvx-empty {padding:24px 0;}\n.pgvx-detail-heading {display:flex;align-items:center;gap:10px;margin-bottom:16px;}\n.pgvx-detail-heading>svg {width:32px;height:32px;}\n.pgvx-detail-heading small {font-size:11px;color:var(--text-color-secondary);}\n.pgvx-detail-heading>a {margin-left:auto;font-size:12px;}\n.pgvx-group-details p {margin:9px 0;font-size:12px;color:var(--text-color-secondary);}\n.pgvx-group-list {display:flex;flex-direction:column;margin-top:14px;}\n.pgvx-group-list button {display:flex;align-items:center;gap:10px;text-align:left;border:0;border-bottom:1px solid var(--line);border-radius:0;font-size:12px;}\n.pgvx-group-list svg {width:22px;height:22px;}\n.pgvx-group-list small {margin-left:auto;color:var(--text-color-secondary);}\n.pgvx-step-list {display:flex;flex-direction:column;gap:5px;}\n.pgvx-step {display:flex;gap:8px;border:1px solid var(--line);border-radius:6px;align-items:center;}\n.pgvx-step.is-selected {border-color:var(--accent);}\n.pgvx-step>button {display:flex;align-items:center;gap:8px;flex:1;min-width:0;border:0;padding:8px 10px;text-align:left;font-size:12px;}\n.pgvx-step svg {width:22px;height:22px;flex-shrink:0;}\n.pgvx-step button>span {min-width:0;}\n.pgvx-step small {display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:560px;font:10px/1.7 ui-monospace,SFMono-Regular,Consolas,monospace;color:var(--text-color-secondary);}\n.pgvx-step time {margin-left:auto;white-space:nowrap;color:var(--text-color-secondary);font-size:11px;}\n.pgvx-step>a {padding:10px;}\n.pgvx-log {margin-top:16px;border:1px solid var(--line);border-radius:6px;overflow:hidden;}\n.pgvx-log-title {display:flex;align-items:center;gap:10px;padding:8px 10px;background:var(--surface);font-size:11px;flex-wrap:wrap;}\n.pgvx-log-title>span {color:var(--text-color-secondary);}\n.pgvx-log-title>button {margin-left:auto;font-size:10px;min-height:25px;}\n.pgvx-log pre {margin:0;padding:14px;max-height:360px;overflow:auto;font:11px/1.6 ui-monospace,SFMono-Regular,Consolas,monospace;white-space:pre;tab-size:4;color:var(--text-color);}\n.pgvx-footer {display:flex;justify-content:space-between;gap:15px;flex-wrap:wrap;border-top:1px solid var(--line);padding:9px 20px;font-size:10px;color:var(--text-color-secondary);}\n.pgvx-editor {padding:16px 22px;background:var(--surface);border-top:1px solid var(--line);border-bottom:1px solid var(--line);}\n.pgvx-editor p {font-size:12px;margin:8px 0;color:var(--text-color-secondary);max-width:1050px;}\n.pgvx-editor textarea {display:block;width:100%;height:330px;resize:vertical;color:var(--text-color);background:var(--card-background);border:1px solid var(--line);border-radius:6px;padding:12px;margin:12px 0;font:12px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;tab-size:2;}\n.pgvx-flex {flex:1;}\nbutton.pgvx-primary {background:var(--accent);color:var(--card-background);border-color:var(--accent);}\n.pgvx-tooltip {position:fixed;transform:translateX(-50%);z-index:2147483646;pointer-events:none;max-width:330px;padding:8px 12px;border:1px solid var(--line);border-radius:6px;background:var(--card-background);color:var(--text-color);box-shadow:0 4px 18px #0002;font-size:12px;}\n.jenkins-visually-hidden {position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important;}\n[class~=\"jenkins-!-success-color\"] {--color:var(--success);color:var(--success);}\n[class~=\"jenkins-!-error-color\"] {--color:var(--error);color:var(--error);}\n[class~=\"jenkins-!-warning-color\"] {--color:var(--warning);color:var(--warning);}\n[class~=\"jenkins-!-accent-color\"] {--color:var(--accent);color:var(--accent);}\n[class~=\"jenkins-!-skipped-color\"] {--color:var(--text-color-secondary);color:var(--text-color-secondary);}\n.PWGx-pipeline-selection-highlight {fill:none;stroke:transparent;}\n@media(max-width:800px) {\n  .pgvx-inspector {grid-template-columns:200px minmax(0,1fr);}\n  .pgvx-header,.pgvx-runbar {padding:12px;gap:12px;}\n  .pgvx-run-actions {margin-left:0;}\n  .pgvx-step small {max-width:200px;}\n}\n@media(prefers-reduced-motion:reduce) {*,*::before,*::after {animation:none!important;transition:none!important;}}\n\n/* wfapi-only fallback deliberately has no graph edges or synthetic group labels. */\n.pgvx-flat {display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px;padding:16px 22px;}\n.pgvx-flat-item {display:flex;gap:10px;align-items:center;text-align:left;min-width:0;padding:10px;}\n.pgvx-flat-item svg {width:26px;height:26px;flex-shrink:0;}\n.pgvx-flat-item span {overflow-wrap:anywhere;min-width:0;}\n.pgvx-flat-item small {display:block;font-size:11px;color:var(--text-color-secondary);}\n.pgvx-detail-warning {font-size:12px;color:var(--warning);margin-bottom:12px;line-height:1.6;}\n\n.pgvx-flow-provenance {font-size:12px;line-height:1.5;color:var(--text-color-secondary);padding:8px 12px;background:var(--background-color-secondary);border-radius:6px;margin:10px 0;}\n.pgvx-flow-provenance p {margin:4px 0;}\n";
},
"src/upstream.css":function(module,exports,require){
module.exports="/* Derived from upstream SCSS, tag 1013.v9f83fd83c063. MIT. */\n\n/* upstream/pipeline-graph-view/pipeline-graph/styles/PipelineGraphWidget.scss */\n.PWGx-pipeline-connector {\nstroke: color-mix(in srgb, var(--text-color-secondary), var(--background));\n}\n.PWGx-pipeline-node {\nposition: relative;\ndisplay: flex;\nalign-items: center;\njustify-content: center;\nwidth: 1.75rem;\nheight: 1.75rem;\nz-index: 0;\n}\n.PWGx-pipeline-node::before {\ncontent: \"\";\nposition: absolute;\ninset: -3px;\nbackground: var(--card-background);\nborder-radius: 50%;\nz-index: -1;\n}\n.PWGx-pipeline-node--selected::after {\nbox-shadow:\n        0 0 0 0.125rem currentColor,\n        0 0 0 0.5rem var(--card-background) !important;\n}\n.PWGx-pipeline-node--running.PWGx-pipeline-node--selected::after {\ninset: 0;\nbox-shadow:\n        0 0 0 0.125rem color-mix(in srgb, currentColor, transparent),\n        0 0 0 0.5rem var(--card-background) !important;\n}\n.PWGx-pipeline-node:has(a)::after {\ncontent: \"\";\nposition: absolute;\ninset: 1px;\nborder-radius: 50%;\nz-index: -1;\ntransition: var(--standard-transition);\nbox-shadow: 0 0 0 0.5rem transparent;\n}\n.PWGx-pipeline-node:has(a):focus-visible {\noutline: none;\n}\n.PWGx-pipeline-node:has(a):hover::after {\nbackground: oklch(from var(--color) l c h / 0.1);\n}\n.PWGx-pipeline-node:has(a):active::after,\n.PWGx-pipeline-node:has(a):focus::after {\nbackground: oklch(from var(--color) l c h / 0.15);\nbox-shadow: 0 0 0 0.25rem oklch(from var(--color) l c h / 0.15);\n}\n.PWGx-pipeline-node:has(a):focus-visible::after {\nbox-shadow: 0 0 0 0.25rem var(--text-color) !important;\n}\n.PWGx-pipeline-node a {\nposition: absolute;\ninset: 0;\nbackground: transparent;\n}\n.PWGx-pipeline-node svg {\nwidth: 1.75rem;\nheight: 1.75rem;\n}\n.PWGx-pipeline-node:has(.PWGx-pipeline-node-terminal)::before {\ninset: 4px;\n}\n.PWGx-pipeline-node-counter {\nwidth: 1.25rem;\nborder-radius: 1rem;\nline-height: 1rem;\ntext-align: center;\nfont-size: var(--font-size-xs);\nfont-weight: var(--font-bold-weight);\ncursor: default;\nborder: 2px solid color-mix(in srgb, var(--text-color-secondary), var(--background));\ncolor: var(--text-color-secondary);\n}\n.PWGx-pipeline-node-counter::before {\ndisplay: none !important;\n}\n.PWGx-pipeline-node-terminal {\nwidth: 10px;\nheight: 10px;\nborder: 2px solid color-mix(in srgb, var(--text-color-secondary), var(--background));\nborder-radius: 10px;\n}\n.PWGx-pipeline-node-terminal::before {\ndisplay: none !important;\n}\n.PWGx-pipeline-connector-skipped {\nstroke: color-mix(in srgb, var(--text-color-secondary), var(--background));\nstroke-opacity: 0.75;\nstroke-dasharray: 4 4;\n}\n.PWGx-pipeline-small-label {\nfont-size: 0.75rem;\ntransition: translate var(--standard-transition);\ndisplay: flex;\nalign-items: baseline;\njustify-content: center;\ngap: 2px;\n}\n.PWGx-pipeline-small-label .TruncatingLabel {\nflex: 0 1 auto;\nmin-width: 0;\n}\n.PWGx-pipeline-small-label--selected {\ntranslate: 0 2px;\n}\n.PWGx-pipeline-big-label {\nfont-weight: var(--font-bold-weight);\nfont-size: 0.875rem;\ntransition: translate var(--standard-transition);\ntext-align: center;\n}\n.PWGx-pipeline-big-label .TruncatingLabel {\n-webkit-line-clamp: 1 !important;\ndisplay: -webkit-box;\noverflow: hidden;\n-webkit-box-orient: vertical;\n}\n.PWGx-pipeline-big-label--selected {\ntranslate: 0 -2px;\n}\n.PWGx-pipeline-big-label-content {\ndisplay: flex;\nalign-items: baseline;\njustify-content: center;\ngap: 2px;\nmin-width: 0;\n}\n.PWGx-pipeline-big-label-content .TruncatingLabel {\nflex: 0 1 auto;\nmin-width: 0;\n}\n.PWGx-pipeline-collapse-badge {\nflex: 0 0 auto;\nfont-size: var(--font-size-xs);\nfont-weight: normal;\ncolor: var(--text-color-secondary);\ncursor: pointer;\nwhite-space: nowrap;\ntransition: color var(--standard-transition);\n}\n.PWGx-pipeline-collapse-badge:hover {\ncolor: var(--text-color);\n}\n.PWGx-pipeline-collapse-chevron {\ndisplay: inline-block;\nwidth: 0.5rem;\nheight: 0.5rem;\nmargin-left: 0.25rem;\nvertical-align: baseline;\ntransform: rotate(0deg);\ntransition: transform var(--standard-transition);\n}\n.PWGx-pipeline-collapse-chevron--expanded {\ntransform: rotate(90deg);\n}\n.PWGx-pipeline-collapse-chevron * {\nstroke-width: 64px;\n}\n.PWGx-pipeline-big-label.pgv-graph-node--synthetic {\nfont-style: italic;\n}\n.PWGx-pipeline-big-label.pgv-graph-node--skeleton {\ncolor: var(--text-color-secondary);\nfont-weight: normal;\npointer-events: none;\n}\n\n/* upstream/pipeline-graph-view/pipeline-graph/main/support/nodes.scss */\n.pgv-node__counter-tooltip {\ndisplay: flex;\nflex-direction: column;\nlist-style-type: none;\npadding: 0;\nmargin: -0.125rem -0.5rem;\nmax-height: min(28rem, calc(50vh - 2rem));\noverflow-y: auto;\nflex-shrink: 0;\n}\n.pgv-node__counter-tooltip li {\ndisplay: flex;\nflex-shrink: 0;\n}\n.pgv-node__counter-tooltip a {\nflex: 1;\ndisplay: flex;\nalign-items: center;\njustify-content: start;\ngap: 0.5rem;\ncolor: var(--text-color);\ntext-decoration: none;\nmin-height: 0;\npadding: 0.25rem 1rem 0.25rem 0.375rem;\nborder-radius: 0.5rem;\nfont-size: var(--font-size-xs);\n}\n.pgv-node__counter-tooltip a svg {\nwidth: 1.375rem;\nheight: 1.375rem;\nflex-shrink: 0;\n}\n.pgv-node-tooltip {\ndisplay: flex;\nflex-direction: column;\ntext-align: center;\ngap: 1px;\n}\n.pgv-node-tooltip div:last-of-type {\ncolor: var(--text-color-secondary);\ntext-wrap: nowrap;\n}\n\n/* upstream/common/components/status-icon.scss */\n:root {\n--status-background-opacity: 0.125;\n--status-border-opacity: 0.25;\n}\n@media (prefers-contrast: more) {\n:root {\n--status-background-opacity: 0;\n--status-border-opacity: 1;\n}\n}\n.pgv-status-icon {\nflex-shrink: 0;\n}\n.pgv-status-icon * {\ntransition: var(--elastic-transition);\ntransform-origin: center;\n}\n.pgv-status-icon .pgv-scale {\nanimation: pulseScale 2s both ease-in-out infinite;\nopacity: 0.25;\n}\n@keyframes pulseScale {\n      50% {\n        scale: 2.25;\n        opacity: 1;\n      }\n    }\n\n.PWGx-PipelineGraph-container {display:flex;align-items:center;}\n";
}
};
const cache=Object.create(null);
function require(id){if(cache[id])return cache[id].exports;const module=cache[id]={exports:{}};if(!modules[id])throw new Error("Missing module: "+id);modules[id](module,module.exports,require);return module.exports;}
require("src/content.tsx");
})();
