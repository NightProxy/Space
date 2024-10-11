(() => { // webpackBootstrap
var __webpack_modules__ = ({
"./src/client sync recursive ^\\.\\/.*$": (function (module, __unused_webpack_exports, __webpack_require__) {
var map = {
  "./": "./src/client/index.ts",
  "./client": "./src/client/client.ts",
  "./client.ts": "./src/client/client.ts",
  "./document": "./src/client/document.ts",
  "./document.ts": "./src/client/document.ts",
  "./dom/cookie": "./src/client/dom/cookie.ts",
  "./dom/cookie.ts": "./src/client/dom/cookie.ts",
  "./dom/css": "./src/client/dom/css.ts",
  "./dom/css.ts": "./src/client/dom/css.ts",
  "./dom/element": "./src/client/dom/element.ts",
  "./dom/element.ts": "./src/client/dom/element.ts",
  "./dom/fontface": "./src/client/dom/fontface.ts",
  "./dom/fontface.ts": "./src/client/dom/fontface.ts",
  "./dom/history": "./src/client/dom/history.ts",
  "./dom/history.ts": "./src/client/dom/history.ts",
  "./dom/navigation": "./src/client/dom/navigation.ts",
  "./dom/navigation.ts": "./src/client/dom/navigation.ts",
  "./dom/open": "./src/client/dom/open.ts",
  "./dom/open.ts": "./src/client/dom/open.ts",
  "./dom/origin": "./src/client/dom/origin.ts",
  "./dom/origin.ts": "./src/client/dom/origin.ts",
  "./dom/performance": "./src/client/dom/performance.ts",
  "./dom/performance.ts": "./src/client/dom/performance.ts",
  "./dom/serviceworker": "./src/client/dom/serviceworker.ts",
  "./dom/serviceworker.ts": "./src/client/dom/serviceworker.ts",
  "./dom/storage": "./src/client/dom/storage.ts",
  "./dom/storage.ts": "./src/client/dom/storage.ts",
  "./dom/trustedTypes": "./src/client/dom/trustedTypes.ts",
  "./dom/trustedTypes.ts": "./src/client/dom/trustedTypes.ts",
  "./events": "./src/client/events.ts",
  "./events.ts": "./src/client/events.ts",
  "./global": "./src/client/global.ts",
  "./global.ts": "./src/client/global.ts",
  "./helpers": "./src/client/helpers.ts",
  "./helpers.ts": "./src/client/helpers.ts",
  "./index": "./src/client/index.ts",
  "./index.ts": "./src/client/index.ts",
  "./location": "./src/client/location.ts",
  "./location.ts": "./src/client/location.ts",
  "./natives": "./src/client/natives.ts",
  "./natives.ts": "./src/client/natives.ts",
  "./shared/console": "./src/client/shared/console.ts",
  "./shared/console.ts": "./src/client/shared/console.ts",
  "./shared/err": "./src/client/shared/err.ts",
  "./shared/err.ts": "./src/client/shared/err.ts",
  "./shared/error": "./src/client/shared/error.ts",
  "./shared/error.ts": "./src/client/shared/error.ts",
  "./shared/eval": "./src/client/shared/eval.ts",
  "./shared/eval.ts": "./src/client/shared/eval.ts",
  "./shared/event": "./src/client/shared/event.ts",
  "./shared/event.ts": "./src/client/shared/event.ts",
  "./shared/function": "./src/client/shared/function.ts",
  "./shared/function.ts": "./src/client/shared/function.ts",
  "./shared/import": "./src/client/shared/import.ts",
  "./shared/import.ts": "./src/client/shared/import.ts",
  "./shared/indexeddb": "./src/client/shared/indexeddb.ts",
  "./shared/indexeddb.ts": "./src/client/shared/indexeddb.ts",
  "./shared/postmessage": "./src/client/shared/postmessage.ts",
  "./shared/postmessage.ts": "./src/client/shared/postmessage.ts",
  "./shared/realm": "./src/client/shared/realm.ts",
  "./shared/realm.ts": "./src/client/shared/realm.ts",
  "./shared/requests/beacon": "./src/client/shared/requests/beacon.ts",
  "./shared/requests/beacon.ts": "./src/client/shared/requests/beacon.ts",
  "./shared/requests/fetch": "./src/client/shared/requests/fetch.ts",
  "./shared/requests/fetch.ts": "./src/client/shared/requests/fetch.ts",
  "./shared/requests/websocket": "./src/client/shared/requests/websocket.ts",
  "./shared/requests/websocket.ts": "./src/client/shared/requests/websocket.ts",
  "./shared/requests/xmlhttprequest": "./src/client/shared/requests/xmlhttprequest.ts",
  "./shared/requests/xmlhttprequest.ts": "./src/client/shared/requests/xmlhttprequest.ts",
  "./shared/sourcemaps": "./src/client/shared/sourcemaps.ts",
  "./shared/sourcemaps.ts": "./src/client/shared/sourcemaps.ts",
  "./shared/unproxy": "./src/client/shared/unproxy.ts",
  "./shared/unproxy.ts": "./src/client/shared/unproxy.ts",
  "./shared/worker": "./src/client/shared/worker.ts",
  "./shared/worker.ts": "./src/client/shared/worker.ts",
  "./shared/wrap": "./src/client/shared/wrap.ts",
  "./shared/wrap.ts": "./src/client/shared/wrap.ts",
  "./swruntime": "./src/client/swruntime.ts",
  "./swruntime.ts": "./src/client/swruntime.ts",
  "./worker/importScripts": "./src/client/worker/importScripts.ts",
  "./worker/importScripts.ts": "./src/client/worker/importScripts.ts"
};


function webpackContext(req) {
  var id = webpackContextResolve(req);
  return __webpack_require__(id);
}
function webpackContextResolve(req) {
  if(!__webpack_require__.o(map, req)) {
    var e = new Error("Cannot find module '" + req + "'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
  }
  return map[req];
}
webpackContext.keys = function webpackContextKeys() {
  return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/client sync recursive ^\\.\\/.*$";


}),
"./src/client/client.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ScramjetClient: function() { return ScramjetClient; }
});
/* harmony import */var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./src/client/index.ts");
/* harmony import */var _symbols__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../symbols */ "./src/symbols.ts");
/* harmony import */var _document__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./document */ "./src/client/document.ts");
/* harmony import */var _global__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./global */ "./src/client/global.ts");
/* harmony import */var _helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./helpers */ "./src/client/helpers.ts");
/* harmony import */var _location__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./location */ "./src/client/location.ts");
/* harmony import */var _natives__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./natives */ "./src/client/natives.ts");
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../shared */ "./src/shared.ts");
/* harmony import */var _shared_wrap__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./shared/wrap */ "./src/client/shared/wrap.ts");
/* harmony import */var _events__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./events */ "./src/client/events.ts");










class ScramjetClient {
    global;
    documentProxy;
    globalProxy;
    locationProxy;
    serviceWorker;
    bare;
    descriptors;
    natives;
    wrapfn;
    cookieStore;
    eventcallbacks;
    meta;
    constructor(global){
        this.global = global;
        this.descriptors = {};
        this.natives = {};
        this.cookieStore = new _shared__WEBPACK_IMPORTED_MODULE_7__.CookieStore();
        this.eventcallbacks = new Map();
        this.serviceWorker = this.global.navigator.serviceWorker;
        if (___WEBPACK_IMPORTED_MODULE_0__.iswindow) {
            this.documentProxy = (0,_document__WEBPACK_IMPORTED_MODULE_2__.createDocumentProxy)(this, global);
            global.document[_symbols__WEBPACK_IMPORTED_MODULE_1__.SCRAMJETCLIENT] = this;
        }
        this.locationProxy = (0,_location__WEBPACK_IMPORTED_MODULE_5__.createLocationProxy)(this, global);
        this.globalProxy = (0,_global__WEBPACK_IMPORTED_MODULE_3__.createGlobalProxy)(this, global);
        this.wrapfn = (0,_shared_wrap__WEBPACK_IMPORTED_MODULE_8__.createWrapFn)(this, global);
        if (___WEBPACK_IMPORTED_MODULE_0__.iswindow) {
            this.bare = new _shared__WEBPACK_IMPORTED_MODULE_7__.BareClient();
        } else {
            this.bare = new _shared__WEBPACK_IMPORTED_MODULE_7__.BareClient(new Promise((resolve)=>{
                addEventListener("message", ({ data })=>{
                    if (typeof data !== "object") return;
                    if ("$scramjet$type" in data && data.$scramjet$type === "baremuxinit") {
                        resolve(data.port);
                    }
                });
            }));
        }
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const client = this;
        this.meta = {
            get origin () {
                return client.url;
            },
            get base () {
                if (___WEBPACK_IMPORTED_MODULE_0__.iswindow) {
                    const base = client.global.document.querySelector("base");
                    if (base) {
                        let url = base.getAttribute("href");
                        const frag = url.indexOf("#");
                        url = url.substring(0, frag === -1 ? undefined : frag);
                        if (!url) return client.url;
                        return new URL(url, client.url.origin);
                    }
                }
                return client.url;
            }
        };
        global[_symbols__WEBPACK_IMPORTED_MODULE_1__.SCRAMJETCLIENT] = this;
    }
    get frame() {
        if (!___WEBPACK_IMPORTED_MODULE_0__.iswindow) return null;
        const frame = this.global.window.frameElement;
        if (!frame) return null; // we're top level
        const sframe = frame[_symbols__WEBPACK_IMPORTED_MODULE_1__.SCRAMJETFRAME];
        if (!sframe) return null; // we're a subframe. TODO handle propagation but not now
        return sframe;
    }
    loadcookies(cookiestr) {
        this.cookieStore.load(cookiestr);
    }
    hook() {
        // @ts-ignore
        const context = __webpack_require__(/*! . */ "./src/client sync recursive ^\\.\\/.*$");
        const modules = [];
        for (const key of context.keys()){
            const module = context(key);
            if (!key.endsWith(".ts")) continue;
            if (key.startsWith("./dom/") && "window" in self || key.startsWith("./worker/") && "WorkerGlobalScope" in self || key.startsWith("./shared/")) {
                modules.push(module);
            }
        }
        modules.sort((a, b)=>{
            const aorder = a.order || 0;
            const border = b.order || 0;
            return aorder - border;
        });
        for (const module of modules){
            if (!module.enabled || module.enabled()) module.default(this, this.global);
            else if (module.disabled) module.disabled(this, this.global);
        }
    }
    get url() {
        return new URL((0,_shared__WEBPACK_IMPORTED_MODULE_7__.decodeUrl)(self.location.href));
    }
    set url(url) {
        if (url instanceof URL) url = url.toString();
        const ev = new _events__WEBPACK_IMPORTED_MODULE_9__.NavigateEvent(url);
        if (this.frame) {
            this.frame.dispatchEvent(ev);
        }
        if (ev.defaultPrevented) return;
        self.location.href = (0,_shared__WEBPACK_IMPORTED_MODULE_7__.encodeUrl)(ev.url, this.meta);
    }
    // below are the utilities for proxying and trapping dom APIs
    // you don't have to understand this it just makes the rest easier
    // i'll document it eventually
    Proxy(name, handler) {
        if (Array.isArray(name)) {
            for (const n of name){
                this.Proxy(n, handler);
            }
            return;
        }
        const split = name.split(".");
        const prop = split.pop();
        const target = split.reduce((a, b)=>a?.[b], this.global);
        const original = Reflect.get(target, prop);
        this.natives[name] = original;
        this.RawProxy(target, prop, handler);
    }
    RawProxy(target, prop, handler) {
        if (!target) return;
        if (!prop) return;
        if (!Reflect.has(target, prop)) return;
        const value = Reflect.get(target, prop);
        delete target[prop];
        const h = {};
        if (handler.construct) {
            h.construct = function(constructor, argArray, newTarget) {
                let returnValue = undefined;
                let earlyreturn = false;
                const ctx = {
                    fn: constructor,
                    this: null,
                    args: argArray,
                    newTarget: newTarget,
                    return: (r)=>{
                        earlyreturn = true;
                        returnValue = r;
                    },
                    call: ()=>{
                        earlyreturn = true;
                        returnValue = Reflect.construct(ctx.fn, ctx.args, ctx.newTarget);
                        return returnValue;
                    }
                };
                handler.construct(ctx);
                if (earlyreturn) {
                    return returnValue;
                }
                return Reflect.construct(ctx.fn, ctx.args, ctx.newTarget);
            };
        }
        if (handler.apply) {
            h.apply = function(fn, thisArg, argArray) {
                let returnValue = undefined;
                let earlyreturn = false;
                const ctx = {
                    fn,
                    this: thisArg,
                    args: argArray,
                    newTarget: null,
                    return: (r)=>{
                        earlyreturn = true;
                        returnValue = r;
                    },
                    call: ()=>{
                        earlyreturn = true;
                        returnValue = Reflect.apply(ctx.fn, ctx.this, ctx.args);
                        return returnValue;
                    }
                };
                const pst = Error.prepareStackTrace;
                Error.prepareStackTrace = function(err, s) {
                    if (s[0].getFileName() && !s[0].getFileName().startsWith(location.origin + _shared__WEBPACK_IMPORTED_MODULE_7__.config.prefix)) {
                        return {
                            stack: err.stack
                        };
                    }
                };
                try {
                    handler.apply(ctx);
                } catch (err) {
                    if (err instanceof Error) {
                        if (err.stack instanceof Object) {
                            //@ts-expect-error i'm not going to explain this
                            err.stack = err.stack.stack;
                            console.error("ERROR FROM SCRMAJET INTERNALS", err);
                        } else {
                            throw err;
                        }
                    } else {
                        throw err;
                    }
                }
                Error.prepareStackTrace = pst;
                if (earlyreturn) {
                    return returnValue;
                }
                return Reflect.apply(ctx.fn, ctx.this, ctx.args);
            };
        }
        h.getOwnPropertyDescriptor = _helpers__WEBPACK_IMPORTED_MODULE_4__.getOwnPropertyDescriptorHandler;
        target[prop] = new Proxy(value, h);
    }
    Trap(name, descriptor) {
        if (Array.isArray(name)) {
            for (const n of name){
                this.Trap(n, descriptor);
            }
            return;
        }
        const split = name.split(".");
        const prop = split.pop();
        const target = split.reduce((a, b)=>a?.[b], this.global);
        const original = (0,_natives__WEBPACK_IMPORTED_MODULE_6__.nativeGetOwnPropertyDescriptor)(target, prop);
        this.descriptors[name] = original;
        return this.RawTrap(target, prop, descriptor);
    }
    RawTrap(target, prop, descriptor) {
        if (!target) return;
        if (!prop) return;
        if (!Reflect.has(target, prop)) return;
        const oldDescriptor = (0,_natives__WEBPACK_IMPORTED_MODULE_6__.nativeGetOwnPropertyDescriptor)(target, prop);
        const ctx = {
            this: null,
            get: function() {
                return oldDescriptor && oldDescriptor.get.call(this.this);
            },
            set: function(v) {
                oldDescriptor && oldDescriptor.set.call(this.this, v);
            }
        };
        delete target[prop];
        const desc = {};
        if (descriptor.get) {
            desc.get = function() {
                ctx.this = this;
                return descriptor.get(ctx);
            };
        } else if (oldDescriptor?.get) {
            desc.get = oldDescriptor.get;
        }
        if (descriptor.set) {
            desc.set = function(v) {
                ctx.this = this;
                descriptor.set(ctx, v);
            };
        } else if (oldDescriptor?.set) {
            desc.set = oldDescriptor.set;
        }
        if (descriptor.enumerable) desc.enumerable = descriptor.enumerable;
        else if (oldDescriptor?.enumerable) desc.enumerable = oldDescriptor.enumerable;
        if (descriptor.configurable) desc.configurable = descriptor.configurable;
        else if (oldDescriptor?.configurable) desc.configurable = oldDescriptor.configurable;
        Object.defineProperty(target, prop, desc);
        return oldDescriptor;
    }
}


}),
"./src/client/document.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  createDocumentProxy: function() { return createDocumentProxy; }
});
/* harmony import */var _shared_rewriters_url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/rewriters/url */ "./src/shared/rewriters/url.ts");
/* harmony import */var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ "./src/client/helpers.ts");


function createDocumentProxy(client, self) {
    return new Proxy(self.document, {
        get (target, prop) {
            if (prop === "location") {
                return client.locationProxy;
            }
            if (prop === "defaultView") {
                return client.globalProxy;
            }
            const value = Reflect.get(target, prop);
            return value;
        },
        set (target, prop, newValue) {
            if (prop === "location") {
                location.href = (0,_shared_rewriters_url__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(newValue, client.meta);
                return;
            }
            return Reflect.set(target, prop, newValue);
        },
        getOwnPropertyDescriptor: _helpers__WEBPACK_IMPORTED_MODULE_1__.getOwnPropertyDescriptorHandler
    });
}


}),
"./src/client/dom/cookie.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    client.serviceWorker.addEventListener("message", ({ data })=>{
        if (!("scramjet$type" in data)) return;
        if (data.scramjet$type === "cookie") {
            client.cookieStore.setCookies([
                data.cookie
            ], new URL(data.url));
        }
    });
    client.Trap("Document.prototype.cookie", {
        get () {
            return client.cookieStore.getCookies(client.url, true);
        },
        set (ctx, value) {
            client.cookieStore.setCookies([
                value
            ], client.url);
            if (client.serviceWorker.controller) {
                client.serviceWorker.controller.postMessage({
                    scramjet$type: "cookie",
                    cookie: value,
                    url: client.url.href
                });
            }
        }
    });
    // @ts-ignore
    delete self.cookieStore;
}


}),
"./src/client/dom/css.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared */ "./src/shared.ts");

const cssProperties = [
    "background",
    "background-image",
    "mask",
    "mask-image",
    "list-style",
    "list-style-image",
    "border-image",
    "border-image-source",
    "cursor"
];
// const jsProperties = ["background", "backgroundImage", "mask", "maskImage", "listStyle", "listStyleImage", "borderImage", "borderImageSource", "cursor"];
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client) {
    client.Proxy("CSSStyleDeclaration.prototype.setProperty", {
        apply (ctx) {
            if (cssProperties.includes(ctx.args[0])) ctx.args[1] = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.rewriteCss)(ctx.args[1], client.meta);
        }
    });
    client.Proxy("CSSStyleDeclaration.prototype.getPropertyValue", {
        apply (ctx) {
            if (cssProperties.includes(ctx.args[0])) {
                const realProperty = ctx.call();
                return ctx.return((0,_shared__WEBPACK_IMPORTED_MODULE_0__.unrewriteCss)(realProperty));
            }
        }
    });
    client.Trap("CSSStyleDeclaration.prototype.cssText", {
        set (ctx, value) {
            ctx.set((0,_shared__WEBPACK_IMPORTED_MODULE_0__.rewriteCss)(value, client.meta));
        },
        get (ctx) {
            return (0,_shared__WEBPACK_IMPORTED_MODULE_0__.unrewriteCss)(ctx.get());
        }
    });
}


}),
"./src/client/dom/element.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony import */var _symbols__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../symbols */ "./src/symbols.ts");
/* harmony import */var _client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../client */ "./src/client/client.ts");
/* harmony import */var _natives__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../natives */ "./src/client/natives.ts");
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared */ "./src/shared.ts");





/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    const attrObject = {
        nonce: [
            self.HTMLElement
        ],
        integrity: [
            self.HTMLScriptElement,
            self.HTMLLinkElement
        ],
        csp: [
            self.HTMLIFrameElement
        ],
        src: [
            self.HTMLImageElement,
            self.HTMLMediaElement,
            self.HTMLIFrameElement,
            self.HTMLEmbedElement,
            self.HTMLScriptElement,
            self.HTMLSourceElement
        ],
        href: [
            self.HTMLAnchorElement,
            self.HTMLLinkElement
        ],
        data: [
            self.HTMLObjectElement
        ],
        action: [
            self.HTMLFormElement
        ],
        formaction: [
            self.HTMLButtonElement,
            self.HTMLInputElement
        ],
        srcdoc: [
            self.HTMLIFrameElement
        ],
        srcset: [
            self.HTMLImageElement,
            self.HTMLSourceElement
        ],
        imagesrcset: [
            self.HTMLLinkElement
        ]
    };
    const urlinterfaces = [
        self.HTMLAnchorElement.prototype,
        self.HTMLAreaElement.prototype
    ];
    const originalhrefs = [
        (0,_natives__WEBPACK_IMPORTED_MODULE_2__.nativeGetOwnPropertyDescriptor)(self.HTMLAnchorElement.prototype, "href"),
        (0,_natives__WEBPACK_IMPORTED_MODULE_2__.nativeGetOwnPropertyDescriptor)(self.HTMLAreaElement.prototype, "href")
    ];
    const attrs = Object.keys(attrObject);
    for (const attr of attrs){
        for (const element of attrObject[attr]){
            const descriptor = (0,_natives__WEBPACK_IMPORTED_MODULE_2__.nativeGetOwnPropertyDescriptor)(element.prototype, attr);
            Object.defineProperty(element.prototype, attr, {
                get () {
                    if ([
                        "src",
                        "data",
                        "href",
                        "action",
                        "formaction"
                    ].includes(attr)) {
                        return (0,_shared__WEBPACK_IMPORTED_MODULE_3__.decodeUrl)(descriptor.get.call(this));
                    }
                    return descriptor.get.call(this);
                },
                set (value) {
                    if ([
                        "nonce",
                        "integrity",
                        "csp"
                    ].includes(attr)) {
                        return;
                    } else if ([
                        "src",
                        "data",
                        "href",
                        "action",
                        "formaction"
                    ].includes(attr)) {
                        value = (0,_shared__WEBPACK_IMPORTED_MODULE_3__.encodeUrl)(value, client.meta);
                    } else if (attr === "srcdoc") {
                        value = (0,_shared__WEBPACK_IMPORTED_MODULE_3__.rewriteHtml)(value, client.cookieStore, {
                            // srcdoc preserves parent origin i think
                            base: new URL(client.url.origin),
                            origin: new URL(client.url.origin)
                        }, true);
                    } else if ([
                        "srcset",
                        "imagesrcset"
                    ].includes(attr)) {
                        value = (0,_shared__WEBPACK_IMPORTED_MODULE_3__.rewriteSrcset)(value, client.meta);
                    }
                    descriptor.set.call(this, value);
                }
            });
        }
    }
    // note that href is not here
    const urlprops = [
        "protocol",
        "hash",
        "host",
        "hostname",
        "origin",
        "pathname",
        "port",
        "search"
    ];
    for (const prop of urlprops){
        for(const i in urlinterfaces){
            const target = urlinterfaces[i];
            const desc = originalhrefs[i];
            client.RawTrap(target, prop, {
                get (ctx) {
                    const href = desc.get.call(ctx.this);
                    if (!href) return href;
                    const url = new URL((0,_shared__WEBPACK_IMPORTED_MODULE_3__.decodeUrl)(href));
                    return url[prop];
                }
            });
        }
    }
    client.Trap("Node.prototype.baseURI", {
        get () {
            // TODO this should be using ownerdocument but who gaf
            const base = self.document.querySelector("base");
            if (base) {
                return new URL(base.href, client.url.origin).href;
            }
            return client.url.origin;
        },
        set () {
            return false;
        }
    });
    client.Proxy("Element.prototype.setAttribute", {
        apply (ctx) {
            const [name, value] = ctx.args;
            const ruleList = _shared__WEBPACK_IMPORTED_MODULE_3__.htmlRules.find((rule)=>{
                const r = rule[name];
                if (!r) return false;
                if (r === "*") return true;
                if (typeof r === "function") return false; // this can't happen but ts
                return r.includes(ctx.this.tagName.toLowerCase());
            });
            if (ruleList) {
                ctx.args[1] = ruleList.fn(value, client.meta, client.cookieStore);
                ctx.fn.call(ctx.this, `data-scramjet-${ctx.args[0]}`, value);
            }
        }
    });
    client.Proxy("Element.prototype.getAttribute", {
        apply (ctx) {
            const [name] = ctx.args;
            if (ctx.fn.call(ctx.this, `data-scramjet-${name}`)) {
                ctx.return(ctx.fn.call(ctx.this, `data-scramjet-${name}`));
            }
        }
    });
    client.Trap("Element.prototype.innerHTML", {
        set (ctx, value) {
            let newval;
            if (ctx.this instanceof self.HTMLScriptElement) {
                newval = (0,_shared__WEBPACK_IMPORTED_MODULE_3__.rewriteJs)(value, client.meta);
            } else if (ctx.this instanceof self.HTMLStyleElement) {
                newval = (0,_shared__WEBPACK_IMPORTED_MODULE_3__.rewriteCss)(value, client.meta);
            } else {
                newval = (0,_shared__WEBPACK_IMPORTED_MODULE_3__.rewriteHtml)(value, client.cookieStore, client.meta);
            }
            ctx.set(newval);
        },
        get (ctx) {
            if (ctx.this instanceof self.HTMLScriptElement) {
                return atob(client.natives["Element.prototype.getAttribute"].call(ctx.this, "data-scramjet-script-source-src"));
            }
            if (ctx.this instanceof self.HTMLStyleElement) {
                return ctx.get();
            }
            return (0,_shared__WEBPACK_IMPORTED_MODULE_3__.unrewriteHtml)(ctx.get());
        }
    });
    client.Trap("Element.prototype.outerHTML", {
        set (ctx, value) {
            ctx.set((0,_shared__WEBPACK_IMPORTED_MODULE_3__.rewriteHtml)(value, client.cookieStore, client.meta));
        },
        get (ctx) {
            return (0,_shared__WEBPACK_IMPORTED_MODULE_3__.unrewriteHtml)(ctx.get());
        }
    });
    client.Trap("HTMLIFrameElement.prototype.contentWindow", {
        get (ctx) {
            const realwin = ctx.get();
            if (!realwin) return realwin;
            if (_symbols__WEBPACK_IMPORTED_MODULE_0__.SCRAMJETCLIENT in realwin.self) {
                if (realwin.location.href.includes("accounts.google.com")) return null; // don't question it
                return realwin.self[_symbols__WEBPACK_IMPORTED_MODULE_0__.SCRAMJETCLIENT].globalProxy;
            } else {
                // hook the iframe
                const newclient = new _client__WEBPACK_IMPORTED_MODULE_1__.ScramjetClient(realwin.self);
                newclient.hook();
                return newclient.globalProxy;
            }
        }
    });
    client.Trap("HTMLIFrameElement.prototype.contentDocument", {
        get (ctx) {
            const contentwindow = client.descriptors["HTMLIFrameElement.prototype.contentWindow"].get;
            const realwin = contentwindow.apply(ctx.this);
            if (!realwin) return realwin;
            if (_symbols__WEBPACK_IMPORTED_MODULE_0__.SCRAMJETCLIENT in realwin.self) {
                return realwin.self[_symbols__WEBPACK_IMPORTED_MODULE_0__.SCRAMJETCLIENT].documentProxy;
            } else {
                const newclient = new _client__WEBPACK_IMPORTED_MODULE_1__.ScramjetClient(realwin.self);
                newclient.hook();
                return newclient.documentProxy;
            }
        }
    });
    client.Trap("TreeWalker.prototype.currentNode", {
        get (ctx) {
            return ctx.get();
        },
        set (ctx, value) {
            if (value == client.documentProxy) {
                return ctx.set(self.document);
            }
            return ctx.set(value);
        }
    });
    client.Trap("Node.prototype.ownerDocument", {
        get (ctx) {
            // return client.documentProxy;
            const doc = ctx.get();
            if (!doc) return null;
            const scram = doc[_symbols__WEBPACK_IMPORTED_MODULE_0__.SCRAMJETCLIENT];
            if (!scram) return doc; // ??
            return scram.documentProxy;
        }
    });
    client.Proxy("DOMParser.prototype.parseFromString", {
        apply (ctx) {
            if (ctx.args[1] === "text/html") {
                ctx.args[0] = (0,_shared__WEBPACK_IMPORTED_MODULE_3__.rewriteHtml)(ctx.args[0], client.cookieStore, client.meta, false);
            }
        }
    });
    client.Proxy("document.write", {
        apply (ctx) {
            ctx.args[0] = (0,_shared__WEBPACK_IMPORTED_MODULE_3__.rewriteHtml)(ctx.args[0], client.cookieStore, client.meta, true);
        }
    });
    client.Proxy("document.writeln", {
        apply (ctx) {
            ctx.args[0] = (0,_shared__WEBPACK_IMPORTED_MODULE_3__.rewriteHtml)(ctx.args[0], client.cookieStore, client.meta, false);
        }
    });
}


}),
"./src/client/dom/fontface.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared */ "./src/shared.ts");

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    client.Proxy("FontFace", {
        construct (ctx) {
            ctx.args[1] = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.rewriteCss)(ctx.args[1], client.meta);
        }
    });
}


}),
"./src/client/dom/history.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared */ "./src/shared.ts");
/* harmony import */var _events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../events */ "./src/client/events.ts");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    client.Proxy("history.pushState", {
        apply (ctx) {
            if (ctx.args[2]) ctx.args[2] = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(ctx.args[2], client.meta);
            ctx.call();
            const ev = new _events__WEBPACK_IMPORTED_MODULE_1__.UrlChangeEvent(client.url.href);
            if (client.frame) client.frame.dispatchEvent(ev);
        }
    });
    client.Proxy("history.replaceState", {
        apply (ctx) {
            if (ctx.args[2]) ctx.args[2] = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(ctx.args[2], client.meta);
            ctx.call();
            const ev = new _events__WEBPACK_IMPORTED_MODULE_1__.UrlChangeEvent(client.url.href);
            if (client.frame) client.frame.dispatchEvent(ev);
        }
    });
}


}),
"./src/client/dom/navigation.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    delete self.navigation;
}


}),
"./src/client/dom/open.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared */ "./src/shared.ts");
/* harmony import */var _client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../client */ "./src/client/client.ts");
/* harmony import */var _symbols__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../symbols */ "./src/symbols.ts");



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client) {
    client.Proxy("window.open", {
        apply (ctx) {
            if (ctx.args[0]) ctx.args[0] = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(ctx.args[0], client.meta);
            if ([
                "_parent",
                "_top",
                "_unfencedTop"
            ].includes(ctx.args[1])) ctx.args[1] = "_self";
            const realwin = ctx.call();
            if (!realwin) return ctx.return(realwin);
            if (_symbols__WEBPACK_IMPORTED_MODULE_2__.SCRAMJETCLIENT in realwin.self) {
                return ctx.return(realwin.self[_symbols__WEBPACK_IMPORTED_MODULE_2__.SCRAMJETCLIENT].globalProxy.window);
            } else {
                const newclient = new _client__WEBPACK_IMPORTED_MODULE_1__.ScramjetClient(realwin.self);
                // hook the opened window
                newclient.hook();
                return ctx.return(newclient.globalProxy);
            }
        }
    });
    // opener will refer to the real window if it was opened by window.open
    client.Trap("opener", {
        get (ctx) {
            const realwin = ctx.get();
            if (realwin && _symbols__WEBPACK_IMPORTED_MODULE_2__.SCRAMJETCLIENT in realwin.self) {
                return realwin.self[_symbols__WEBPACK_IMPORTED_MODULE_2__.SCRAMJETCLIENT].globalProxy;
            } else {
                // the opener has to have been already hooked, so if we reach here then it's a real window
                return undefined;
            }
        }
    });
}


}),
"./src/client/dom/origin.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    client.Trap("origin", {
        get () {
            // this isn't right!!
            return client.url.origin;
        },
        set () {
            return false;
        }
    });
    client.Trap("document.URL", {
        get () {
            return client.url.href;
        },
        set () {
            return false;
        }
    });
    client.Trap("document.documentURI", {
        get () {
            return client.url.href;
        },
        set () {
            return false;
        }
    });
    client.Trap("document.domain", {
        get () {
            return client.url.hostname;
        },
        set () {
            return false;
        }
    });
}


}),
"./src/client/dom/performance.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared */ "./src/shared.ts");

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    client.Trap("PerformanceEntry.prototype.name", {
        get (ctx) {
            return (0,_shared__WEBPACK_IMPORTED_MODULE_0__.decodeUrl)(ctx.get());
        }
    });
}


}),
"./src/client/dom/serviceworker.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; },
  disabled: function() { return disabled; },
  enabled: function() { return enabled; },
  order: function() { return order; }
});
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared */ "./src/shared.ts");
/* harmony import */var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers */ "./src/client/helpers.ts");


// we need a late order because we're mangling with addEventListener at a higher level
const order = 2;
const enabled = ()=>_shared__WEBPACK_IMPORTED_MODULE_0__.config.flags.serviceworkers;
function disabled(client, self) {
    Reflect.deleteProperty(Navigator.prototype, "serviceWorker");
}
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    let registration;
    client.Proxy("Worklet.prototype.addModule", {
        apply (ctx) {
            ctx.args[0] = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(ctx.args[0], client.meta);
        }
    });
    client.Proxy("EventTarget.prototype.addEventListener", {
        apply (ctx) {
            if (registration === ctx.this) {
                // do nothing
                ctx.return(undefined);
            }
        }
    });
    client.Proxy("EventTarget.prototype.removeEventListener", {
        apply (ctx) {
            if (registration === ctx.this) {
                // do nothing
                ctx.return(undefined);
            }
        }
    });
    client.Proxy("navigator.serviceWorker.getRegistration", {
        apply (ctx) {
            ctx.return(new Promise((resolve)=>resolve(registration)));
        }
    });
    client.Proxy("navigator.serviceWorker.getRegistrations", {
        apply (ctx) {
            ctx.return(new Promise((resolve)=>resolve([
                    registration
                ])));
        }
    });
    client.Trap("navigator.serviceWorker.ready", {
        get (ctx) {
            console.log(registration);
            return new Promise((resolve)=>resolve(registration));
        }
    });
    client.Trap("navigator.serviceWorker.controller", {
        get (ctx) {
            return registration?.active;
        }
    });
    client.Proxy("navigator.serviceWorker.register", {
        apply (ctx) {
            if (ctx.args[0] instanceof URL) ctx.args[0] = ctx.args[0].href;
            let url = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(ctx.args[0], client.meta) + "?dest=serviceworker";
            if (ctx.args[1] && ctx.args[1].type === "module") {
                url += "&type=module";
            }
            const worker = new SharedWorker(url);
            const handle = worker.port;
            client.serviceWorker.controller.postMessage({
                scramjet$type: "registerServiceWorker",
                port: handle,
                origin: client.url.origin
            }, [
                handle
            ]);
            const fakeRegistration = new Proxy({
                __proto__: ServiceWorkerRegistration.prototype
            }, {
                get (target, prop) {
                    if (prop === "installing") {
                        return null;
                    }
                    if (prop === "waiting") {
                        return null;
                    }
                    if (prop === "active") {
                        return handle;
                    }
                    if (prop === "scope") {
                        return ctx.args[0];
                    }
                    if (prop === "unregister") {
                        return ()=>{};
                    }
                    if (prop === "addEventListener") {
                        return ()=>{};
                    }
                    return Reflect.get(target, prop);
                },
                getOwnPropertyDescriptor: _helpers__WEBPACK_IMPORTED_MODULE_1__.getOwnPropertyDescriptorHandler
            });
            registration = fakeRegistration;
            ctx.return(new Promise((resolve)=>resolve(fakeRegistration)));
        }
    });
}


}),
"./src/client/dom/storage.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    const handler = {
        get (target, prop) {
            switch(prop){
                case "getItem":
                    return (key)=>{
                        return target.getItem(client.url.host + "@" + key);
                    };
                case "setItem":
                    return (key, value)=>{
                        return target.setItem(client.url.host + "@" + key, value);
                    };
                case "removeItem":
                    return (key)=>{
                        return target.removeItem(client.url.host + "@" + key);
                    };
                case "clear":
                    return ()=>{
                        for(const key in Object.keys(target)){
                            if (key.startsWith(client.url.host)) {
                                target.removeItem(key);
                            }
                        }
                    };
                case "key":
                    return (index)=>{
                        const keys = Object.keys(target).filter((key)=>key.startsWith(client.url.host));
                        return target.getItem(keys[index]);
                    };
                case "length":
                    return Object.keys(target).filter((key)=>key.startsWith(client.url.host)).length;
                default:
                    if (prop in Object.prototype || typeof prop === "symbol") {
                        return Reflect.get(target, prop);
                    }
                    console.log("GET", prop, target == realLocalStorage);
                    return target.getItem(client.url.host + "@" + prop);
            }
        },
        set (target, prop, value) {
            if (target == realLocalStorage) console.log("SET", prop, value, target === realLocalStorage);
            target.setItem(client.url.host + "@" + prop, value);
            return true;
        },
        ownKeys (target) {
            return Reflect.ownKeys(target).filter((f)=>typeof f === "string" && f.startsWith(client.url.host)).map((f)=>f.substring(client.url.host.length + 1));
        },
        getOwnPropertyDescriptor (target, property) {
            return {
                value: target.getItem(client.url.host + "@" + property),
                enumerable: true,
                configurable: true,
                writable: true
            };
        },
        defineProperty (target, property, attributes) {
            target.setItem(client.url.host + "@" + property, attributes.value);
            return true;
        }
    };
    const realLocalStorage = self.localStorage;
    const realSessionStorage = self.sessionStorage;
    const localStorageProxy = new Proxy(self.localStorage, handler);
    const sessionStorageProxy = new Proxy(self.sessionStorage, handler);
    delete self.localStorage;
    delete self.sessionStorage;
    self.localStorage = localStorageProxy;
    self.sessionStorage = sessionStorageProxy;
}


}),
"./src/client/dom/trustedTypes.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    delete self.TrustedHTML;
    delete self.TrustedScript;
    delete self.TrustedScriptURL;
    delete self.TrustedTypePolicy;
    delete self.TrustedTypePolicyFactory;
    delete self.trustedTypes;
}


}),
"./src/client/events.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  NavigateEvent: function() { return NavigateEvent; },
  UrlChangeEvent: function() { return UrlChangeEvent; }
});
class NavigateEvent extends Event {
    url;
    constructor(url){
        super("navigate"), this.url = url;
    }
}
class UrlChangeEvent extends Event {
    url;
    constructor(url){
        super("urlchange"), this.url = url;
    }
}


}),
"./src/client/global.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  createGlobalProxy: function() { return createGlobalProxy; }
});
/* harmony import */var _shared_eval__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared/eval */ "./src/client/shared/eval.ts");
/* harmony import */var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ "./src/client/helpers.ts");
// import { encodeUrl } from "../shared";

// import { config } from "../shared";

function createGlobalProxy(client, self) {
    return new Proxy(self, {
        get (target, prop) {
            if (prop === "location") return client.locationProxy;
            if (typeof prop === "string" && [
                "window",
                "top",
                "self",
                "globalThis",
                "parent",
                "document"
            ].includes(prop)) return client.wrapfn(self[prop]);
            if (prop === "$scramjet") return;
            if (prop === "eval") return _shared_eval__WEBPACK_IMPORTED_MODULE_0__.indirectEval.bind(client);
            const value = Reflect.get(target, prop);
            return value;
        },
        set (target, prop, value) {
            if (prop === "location") {
                client.url = value;
                return;
            }
            return Reflect.set(target, prop, value);
        },
        has (target, prop) {
            if (prop === "$scramjet") return false;
            return Reflect.has(target, prop);
        },
        ownKeys (target) {
            return Reflect.ownKeys(target).filter((key)=>key !== "$scramjet");
        },
        defineProperty (target, property, attributes) {
            if (!attributes.get && !attributes.set) {
                attributes.writable = true;
            }
            attributes.configurable = true;
            return Reflect.defineProperty(target, property, attributes);
        },
        getOwnPropertyDescriptor: _helpers__WEBPACK_IMPORTED_MODULE_1__.getOwnPropertyDescriptorHandler
    });
}


}),
"./src/client/helpers.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getOwnPropertyDescriptorHandler: function() { return getOwnPropertyDescriptorHandler; }
});
function getOwnPropertyDescriptorHandler(target, prop) {
    const realDescriptor = Reflect.getOwnPropertyDescriptor(target, prop);
    return realDescriptor;
    const d = {};
    if (realDescriptor.enumerable !== undefined) d.enumerable = realDescriptor.enumerable;
    if (realDescriptor.configurable !== undefined) d.configurable = realDescriptor.configurable;
    if (realDescriptor.writable !== undefined) d.writable = realDescriptor.writable;
    if (realDescriptor.get) {
        d.get = ()=>this.get(target, prop);
    }
    if (realDescriptor.set) {
        d.set = (value)=>this.set(target, prop, value);
    }
    if (realDescriptor.value) {
        d.value = this.get(target, prop);
    }
    return d;
}


}),
"./src/client/index.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isdedicated: function() { return isdedicated; },
  isemulatedsw: function() { return isemulatedsw; },
  isshared: function() { return isshared; },
  issw: function() { return issw; },
  iswindow: function() { return iswindow; },
  isworker: function() { return isworker; }
});
/* harmony import */var _symbols__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../symbols */ "./src/symbols.ts");
/* harmony import */var _client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./client */ "./src/client/client.ts");
/* harmony import */var _swruntime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./swruntime */ "./src/client/swruntime.ts");
/* provided dependency */ var dbg = __webpack_require__(/*! ./src/log.ts */ "./src/log.ts")["default"];
// entrypoint for scramjet.client.js



const iswindow = "window" in self;
const isworker = "WorkerGlobalScope" in self;
const issw = "ServiceWorkerGlobalScope" in self;
const isdedicated = "DedicatedWorkerGlobalScope" in self;
const isshared = "SharedWorkerGlobalScope" in self;
const isemulatedsw = new URL(self.location.href).searchParams.get("dest") === "serviceworker";
dbg.log("scrammin");
// if it already exists, that means the handlers have probably already been setup by the parent document
if (!(_symbols__WEBPACK_IMPORTED_MODULE_0__.SCRAMJETCLIENT in self)) {
    const client = new _client__WEBPACK_IMPORTED_MODULE_1__.ScramjetClient(self);
    if (self.COOKIE) client.loadcookies(self.COOKIE);
    client.hook();
    if (isemulatedsw) {
        const runtime = new _swruntime__WEBPACK_IMPORTED_MODULE_2__.ScramjetServiceWorkerRuntime(client);
        runtime.hook();
    }
}
if ("document" in self && document.currentScript) {
    document.currentScript.remove();
}


}),
"./src/client/location.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  createLocationProxy: function() { return createLocationProxy; }
});
/* harmony import */var _natives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./natives */ "./src/client/natives.ts");
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared */ "./src/shared.ts");
/* harmony import */var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! . */ "./src/client/index.ts");
// @ts-nocheck



function createLocationProxy(client, self) {
    const Location = ___WEBPACK_IMPORTED_MODULE_2__.iswindow ? self.Location : self.WorkerLocation;
    // location cannot be Proxy()d
    const fakeLocation = {};
    Object.setPrototypeOf(fakeLocation, Location.prototype);
    fakeLocation.constructor = Location;
    // for some reason it's on the object for Location and on the prototype for WorkerLocation??
    const descriptorSource = ___WEBPACK_IMPORTED_MODULE_2__.iswindow ? self.location : Location.prototype;
    const urlprops = [
        "protocol",
        "hash",
        "host",
        "hostname",
        "href",
        "origin",
        "pathname",
        "port",
        "search"
    ];
    for (const prop of urlprops){
        const native = (0,_natives__WEBPACK_IMPORTED_MODULE_0__.nativeGetOwnPropertyDescriptor)(descriptorSource, prop);
        if (!native) continue;
        const desc = {
            configurable: true,
            enumerable: true
        };
        if (native.get) {
            desc.get = new Proxy(native.get, {
                apply () {
                    return client.url[prop];
                }
            });
        }
        if (native.set) {
            desc.set = new Proxy(native.set, {
                apply (target, thisArg, args) {
                    if (prop === "href") {
                        // special case
                        client.url = args[0];
                        return;
                    }
                    const url = new URL(client.url.href);
                    url[prop] = args[0];
                    client.url = url;
                }
            });
        }
        Object.defineProperty(fakeLocation, prop, desc);
    }
    // functions
    fakeLocation.toString = new Proxy(self.location.toString, {
        apply () {
            return client.url.href;
        }
    });
    if (self.location.valueOf) fakeLocation.valueOf = new Proxy(self.location.valueOf, {
        apply () {
            return client.url.href;
        }
    });
    if (self.location.assign) fakeLocation.assign = new Proxy(self.location.assign, {
        apply (target, thisArg, args) {
            args[0] = (0,_shared__WEBPACK_IMPORTED_MODULE_1__.encodeUrl)(args[0], client.meta);
            Reflect.apply(target, self.location, args);
        }
    });
    if (self.location.reload) fakeLocation.reload = new Proxy(self.location.reload, {
        apply (target, thisArg, args) {
            Reflect.apply(target, self.location, args);
        }
    });
    if (self.location.replace) fakeLocation.replace = new Proxy(self.location.replace, {
        apply (target, thisArg, args) {
            args[0] = (0,_shared__WEBPACK_IMPORTED_MODULE_1__.encodeUrl)(args[0], client.meta);
            Reflect.apply(target, self.location, args);
        }
    });
    return fakeLocation;
}


}),
"./src/client/natives.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  nativeFunction: function() { return nativeFunction; },
  nativeGetOwnPropertyDescriptor: function() { return nativeGetOwnPropertyDescriptor; }
});
const nativeFunction = self.Function;
const nativeGetOwnPropertyDescriptor = self.Object.getOwnPropertyDescriptor;


}),
"./src/client/shared/console.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client) {
    client.Proxy("console.clear", {
        apply (ctx) {
            // fuck you
            ctx.return(undefined);
        }
    });
}


}),
"./src/client/shared/err.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  argdbg: function() { return argdbg; },
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; },
  enabled: function() { return enabled; }
});
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared */ "./src/shared.ts");

const enabled = ()=>_shared__WEBPACK_IMPORTED_MODULE_0__.config.flags.captureErrors;
function argdbg(arg, recurse = []) {
    switch(typeof arg){
        case "string":
            if (arg.includes("localhost:1337/scramjet/") && arg.includes("m3u8")) // eslint-disable-next-line no-debugger
            debugger;
            break;
        case "object":
            // if (arg instanceof Location) debugger;
            if (arg && arg[Symbol.iterator] && typeof arg[Symbol.iterator] === "function") for(const prop in arg){
                // make sure it's not a getter
                const desc = Object.getOwnPropertyDescriptor(arg, prop);
                if (desc && desc.get) continue;
                const ar = arg[prop];
                if (recurse.includes(ar)) continue;
                recurse.push(ar);
                argdbg(ar, recurse);
            }
            break;
    }
}
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    self.$scramerr = function scramerr(e) {
        console.warn("CAUGHT ERROR", e);
    };
    self.$scramdbg = function scramdbg(args, t) {
        if (args && typeof args === "object" && args.length > 0) argdbg(args);
        argdbg(t);
        return t;
    };
    client.Proxy("Promise.prototype.catch", {
        apply (ctx) {
            ctx.args[0] = new Proxy(ctx.args[0], {
                apply (target, thisArg, argArray) {
                    // console.warn("CAUGHT PROMISE REJECTION", argArray);
                    Reflect.apply(target, thisArg, argArray);
                }
            });
        }
    });
}


}),
"./src/client/shared/error.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; },
  enabled: function() { return enabled; }
});
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared */ "./src/shared.ts");

const enabled = ()=>self.$scramjet.config.flags.cleanerrors;
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self1) {
    // v8 only. all we need to do is clean the scramjet urls from stack traces
    Error.prepareStackTrace = (error, stack)=>{
        let newstack = error.stack;
        for(let i = 0; i < stack.length; i++){
            const url = stack[i].getFileName();
            try {
                newstack = newstack.replaceAll(url, (0,_shared__WEBPACK_IMPORTED_MODULE_0__.decodeUrl)(url));
            } catch  {}
        }
        return newstack;
    };
}


}),
"./src/client/shared/eval.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; },
  indirectEval: function() { return indirectEval; }
});
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared */ "./src/shared.ts");

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    // used for proxying *direct eval*
    // eval("...") -> eval($scramjet$rewrite("..."))
    Object.defineProperty(self, _shared__WEBPACK_IMPORTED_MODULE_0__.config.rewritefn, {
        value: function(js) {
            if (typeof js !== "string") return js;
            const rewritten = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.rewriteJs)(js, client.meta);
            return rewritten;
        },
        writable: false,
        configurable: false
    });
}
function indirectEval(js) {
    // > If the argument of eval() is not a string, eval() returns the argument unchanged
    if (typeof js !== "string") return js;
    const indirection = this.global.eval;
    return indirection((0,_shared__WEBPACK_IMPORTED_MODULE_0__.rewriteJs)(js, this.meta));
}


}),
"./src/client/shared/event.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony import */var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! .. */ "./src/client/index.ts");
/* harmony import */var _symbols__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../symbols */ "./src/symbols.ts");
/* harmony import */var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers */ "./src/client/helpers.ts");
/* harmony import */var _natives__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../natives */ "./src/client/natives.ts");
/* harmony import */var _unproxy__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./unproxy */ "./src/client/shared/unproxy.ts");





const realOnEvent = Symbol.for("scramjet original onevent function");
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    const handlers = {
        message: {
            _init () {
                if (typeof this.data === "object" && "$scramjet$type" in this.data) {
                    // this is a ctl message
                    return false;
                }
                return true;
            },
            ports () {
                // don't know why i have to do this?
                return this.ports;
            },
            source () {
                if (this.source === null) return null;
                const scram = this.source[_symbols__WEBPACK_IMPORTED_MODULE_1__.SCRAMJETCLIENT];
                if (scram) return scram.globalProxy;
                return this.source;
            },
            origin () {
                if (typeof this.data === "object" && "$scramjet$origin" in this.data) return this.data.$scramjet$origin;
                return client.url.origin;
            },
            data () {
                if (typeof this.data === "object" && "$scramjet$data" in this.data) return this.data.$scramjet$data;
                return this.data;
            }
        }
    };
    // TODO! window.event not proxied
    function wraplistener(listener) {
        return new Proxy(listener, {
            apply (target, thisArg, argArray) {
                const realEvent = argArray[0];
                // we only need to handle events dispatched from the browser
                if (realEvent.isTrusted) {
                    const type = realEvent.type;
                    if (type in handlers) {
                        const handler = handlers[type];
                        if (handler._init) {
                            if (handler._init.call(realEvent) === false) return;
                        }
                        argArray[0] = new Proxy(realEvent, {
                            get (_target, prop, reciever) {
                                if (prop in handler) {
                                    return handler[prop].call(_target);
                                }
                                return Reflect.get(target, prop, reciever);
                            },
                            getOwnPropertyDescriptor: _helpers__WEBPACK_IMPORTED_MODULE_2__.getOwnPropertyDescriptorHandler
                        });
                    }
                }
                if (!self.event) {
                    Object.defineProperty(self, "event", {
                        get () {
                            return argArray[0];
                        },
                        configurable: true
                    });
                }
                const rv = Reflect.apply(target, thisArg, argArray);
                return rv;
            },
            getOwnPropertyDescriptor: _helpers__WEBPACK_IMPORTED_MODULE_2__.getOwnPropertyDescriptorHandler
        });
    }
    client.Proxy("EventTarget.prototype.addEventListener", {
        apply (ctx) {
            (0,_unproxy__WEBPACK_IMPORTED_MODULE_4__.unproxy)(ctx, client);
            if (typeof ctx.args[1] !== "function") return;
            const origlistener = ctx.args[1];
            const proxylistener = wraplistener(origlistener);
            ctx.args[1] = proxylistener;
            let arr = client.eventcallbacks.get(ctx.this);
            arr ||= [];
            arr.push({
                event: ctx.args[0],
                originalCallback: origlistener,
                proxiedCallback: proxylistener
            });
            client.eventcallbacks.set(ctx.this, arr);
        }
    });
    client.Proxy("EventTarget.prototype.removeEventListener", {
        apply (ctx) {
            (0,_unproxy__WEBPACK_IMPORTED_MODULE_4__.unproxy)(ctx, client);
            if (typeof ctx.args[1] !== "function") return;
            const arr = client.eventcallbacks.get(ctx.this);
            if (!arr) return;
            const i = arr.findIndex((e)=>e.event === ctx.args[0] && e.originalCallback === ctx.args[1]);
            if (i === -1) return;
            const r = arr.splice(i, 1);
            client.eventcallbacks.set(ctx.this, arr);
            ctx.args[1] = r[0].proxiedCallback;
        }
    });
    client.Proxy("EventTarget.prototype.dispatchEvent", {
        apply (ctx) {
            (0,_unproxy__WEBPACK_IMPORTED_MODULE_4__.unproxy)(ctx, client);
        }
    });
    if (!___WEBPACK_IMPORTED_MODULE_0__.iswindow) return;
    const targets = [
        self.window,
        self.HTMLElement.prototype
    ];
    for (const target of targets){
        const keys = Reflect.ownKeys(target);
        for (const key of keys){
            if (typeof key === "string" && key.startsWith("on") && handlers[key.slice(2)]) {
                const descriptor = (0,_natives__WEBPACK_IMPORTED_MODULE_3__.nativeGetOwnPropertyDescriptor)(target, key);
                if (!descriptor.get || !descriptor.set || !descriptor.configurable) continue;
                // these are the `onmessage`, `onclick`, etc. properties
                client.RawTrap(target, key, {
                    get (ctx) {
                        if (this[realOnEvent]) return this[realOnEvent];
                        return ctx.get();
                    },
                    set (ctx, value) {
                        this[realOnEvent] = value;
                        if (typeof value !== "function") return ctx.set(value);
                        ctx.set(wraplistener(value));
                    }
                });
            }
        }
    }
}


}),
"./src/client/shared/function.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared */ "./src/shared.ts");

function rewriteFunction(ctx, client) {
    const stringifiedFunction = ctx.call().toString();
    const content = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.rewriteJs)(`return ${stringifiedFunction}`, client.meta);
    ctx.return(ctx.fn(content)());
}
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    const handler = {
        apply (ctx) {
            rewriteFunction(ctx, client);
        },
        construct (ctx) {
            rewriteFunction(ctx, client);
        }
    };
    client.Proxy("Function", handler);
    // god i love javascript
    client.RawProxy((function() {}).constructor.prototype, "constructor", handler);
    client.RawProxy((async function() {}).constructor.prototype, "constructor", handler);
    client.RawProxy((function*() {}).constructor.prototype, "constructor", handler);
    client.RawProxy((async function*() {}).constructor.prototype, "constructor", handler);
}


}),
"./src/client/shared/import.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared */ "./src/shared.ts");
/* harmony import */var _shared_rewriters_url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/rewriters/url */ "./src/shared/rewriters/url.ts");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    const Function = client.natives.Function;
    self[_shared__WEBPACK_IMPORTED_MODULE_0__.config.importfn] = function(base) {
        return function(url) {
            const resolved = new URL(url, base).href;
            return Function(`return import("${(0,_shared_rewriters_url__WEBPACK_IMPORTED_MODULE_1__.encodeUrl)(resolved, client.meta)}")`)();
        };
    };
    self[_shared__WEBPACK_IMPORTED_MODULE_0__.config.metafn] = function(base) {
        return {
            url: base,
            resolve: function(url) {
                return new URL(url, base).href;
            }
        };
    };
}


}),
"./src/client/shared/indexeddb.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    client.Proxy("IDBFactory.prototype.open", {
        apply (ctx) {
            ctx.args[0] = `${client.url.origin}@${ctx.args[0]}`;
        }
    });
    client.Trap("IDBDatabase.prototype.name", {
        get (ctx) {
            let name = ctx.get();
            return name.substring(name.indexOf("@") + 1);
        }
    });
}


}),
"./src/client/shared/postmessage.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony import */var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! .. */ "./src/client/index.ts");
/* harmony import */var _symbols__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../symbols */ "./src/symbols.ts");
/* harmony import */var _shared_realm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/realm */ "./src/client/shared/realm.ts");



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client) {
    if (___WEBPACK_IMPORTED_MODULE_0__.iswindow) client.Proxy("window.postMessage", {
        apply (ctx) {
            // so we need to send the real origin here, since the recieving window can't possibly know.
            // except, remember that this code is being ran in a different realm than the invoker, so if we ask our `client` it may give us the wrong origin
            // if we were given any object that came from the real realm we can use that to get the real origin
            // and this works in every case EXCEPT for the fact that all three arguments can be strings which are copied instead of cloned
            // so we have to use `$setrealm` which will pollute this with an object from the real realm
            let pollutant;
            if (typeof ctx.args[0] === "object" && ctx.args[0] !== null) {
                pollutant = ctx.args[0]; // try to use the first object we can find because it's more reliable
            } else if (typeof ctx.args[2] === "object" && ctx.args[2] !== null) {
                pollutant = ctx.args[2]; // next try to use transfer
            } else if (_shared_realm__WEBPACK_IMPORTED_MODULE_2__.POLLUTANT in ctx.this && typeof ctx.this[_shared_realm__WEBPACK_IMPORTED_MODULE_2__.POLLUTANT] === "object" && ctx.this[_shared_realm__WEBPACK_IMPORTED_MODULE_2__.POLLUTANT] !== null) {
                pollutant = ctx.this[_shared_realm__WEBPACK_IMPORTED_MODULE_2__.POLLUTANT]; // lastly try to use the object from $setrealm
            } else {
                pollutant = {}; // give up
            }
            // and now we can steal Function from the caller's realm
            const { constructor: { constructor: Function } } = pollutant;
            // invoking stolen function will give us the caller's globalThis, remember scramjet has already proxied it!!!
            const callerGlobalThisProxied = Function("return globalThis")();
            const callerClient = callerGlobalThisProxied[_symbols__WEBPACK_IMPORTED_MODULE_1__.SCRAMJETCLIENT];
            // this WOULD be enough but the source argument of MessageEvent has to return the caller's window
            // and if we just call it normally it would be coming from here, which WILL NOT BE THE CALLER'S because the accessor is from the parent
            // so with the stolen function we wrap postmessage so the source will truly be the caller's window (remember that function is scramjet's!!!)
            const wrappedPostMessage = Function("data", "origin", "transfer", "this(data, origin, transfer)");
            ctx.args[0] = {
                $scramjet$messagetype: "window",
                $scramjet$origin: callerClient.url.origin,
                $scramjet$data: ctx.args[0]
            };
            // * origin because obviously
            ctx.args[1] = "*";
            ctx.return(wrappedPostMessage.call(ctx.fn, ctx.args[0], ctx.args[1], ctx.args[2]));
        }
    });
    const toproxy = [
        "Worker.prototype.postMessage",
        "MessagePort.prototype.postMessage"
    ];
    if (!___WEBPACK_IMPORTED_MODULE_0__.iswindow) toproxy.push("self.postMessage"); // only do the generic version if we're in a worker
    client.Proxy(toproxy, {
        apply (ctx) {
            // origin/source doesn't need to be preserved - it's null in the message event
            ctx.args[0] = {
                $scramjet$messagetype: "worker",
                $scramjet$data: ctx.args[0]
            };
        }
    });
}


}),
"./src/client/shared/realm.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  POLLUTANT: function() { return POLLUTANT; },
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared */ "./src/shared.ts");

const POLLUTANT = Symbol.for("scramjet realm pollutant");
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    // object.$setrealm({}).postMessage(...)
    // the empty object is the "pollutant" which can reconstruct the real realm
    // i explain more in postmessage.ts
    Object.defineProperty(self.Object.prototype, _shared__WEBPACK_IMPORTED_MODULE_0__.config.setrealmfn, {
        value (pollution) {
            // this is bad!! sites could detect this
            Object.defineProperty(this, POLLUTANT, {
                value: pollution,
                writable: false,
                configurable: true,
                enumerable: false
            });
            return this;
        },
        writable: true,
        configurable: true,
        enumerable: false
    });
}


}),
"./src/client/shared/requests/beacon.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony import */var _shared_rewriters_url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../shared/rewriters/url */ "./src/shared/rewriters/url.ts");

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    client.Proxy("navigator.sendBeacon", {
        apply (ctx) {
            ctx.args[0] = (0,_shared_rewriters_url__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(ctx.args[0], client.meta);
        }
    });
}


}),
"./src/client/shared/requests/fetch.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony import */var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./src/client/index.ts");
/* harmony import */var _shared_rewriters_url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../shared/rewriters/url */ "./src/shared/rewriters/url.ts");
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../shared */ "./src/shared.ts");
// ts throws an error if you dont do window.fetch



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    client.Proxy("fetch", {
        apply (ctx) {
            if (typeof ctx.args[0] === "string" || ctx.args[0] instanceof URL) {
                ctx.args[0] = (0,_shared__WEBPACK_IMPORTED_MODULE_2__.encodeUrl)(ctx.args[0].toString(), client.meta);
                if (___WEBPACK_IMPORTED_MODULE_0__.isemulatedsw) ctx.args[0] += "?from=swruntime";
            }
        }
    });
    // client.Proxy("Headers", {
    // 	construct(ctx) {
    // 		ctx.args[0] = rewriteHeaders(ctx.args[0]);
    // 	},
    // });
    client.Proxy("Request", {
        construct (ctx) {
            if (typeof ctx.args[0] === "string" || ctx.args[0] instanceof URL) {
                ctx.args[0] = (0,_shared__WEBPACK_IMPORTED_MODULE_2__.encodeUrl)(ctx.args[0].toString(), client.meta);
                if (___WEBPACK_IMPORTED_MODULE_0__.isemulatedsw) ctx.args[0] += "?from=swruntime";
            }
        }
    });
    client.Trap("Response.prototype.url", {
        get (ctx) {
            return (0,_shared_rewriters_url__WEBPACK_IMPORTED_MODULE_1__.decodeUrl)(ctx.get());
        }
    });
    client.Trap("Request.prototype.url", {
        get (ctx) {
            return (0,_shared_rewriters_url__WEBPACK_IMPORTED_MODULE_1__.decodeUrl)(ctx.get());
        }
    });
// client.Proxy("Response.redirect", {
// 	apply(ctx) {
// 		ctx.args[0] = encodeUrl(ctx.args[0]);
// 	},
// });
}


}),
"./src/client/shared/requests/websocket.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    const socketmap = new WeakMap();
    client.Proxy("WebSocket", {
        construct (ctx) {
            const fakeWebSocket = new EventTarget();
            Object.setPrototypeOf(fakeWebSocket, self.WebSocket.prototype);
            fakeWebSocket.constructor = ctx.fn;
            const trustEvent = (ev)=>new Proxy(ev, {
                    get (target, prop) {
                        if (prop === "isTrusted") return true;
                        return Reflect.get(target, prop);
                    }
                });
            const barews = client.bare.createWebSocket(ctx.args[0], ctx.args[1], null, {
                "User-Agent": self.navigator.userAgent,
                Origin: client.url.origin
            });
            const state = {
                extensions: "",
                protocol: "",
                url: ctx.args[0],
                binaryType: "blob",
                barews,
                captureListeners: {},
                listeners: {}
            };
            function fakeEventSend(fakeev) {
                state["on" + fakeev.type]?.(trustEvent(fakeev));
                fakeWebSocket.dispatchEvent(fakeev);
            }
            barews.addEventListener("open", (ev)=>{
                fakeEventSend(new Event("open"));
            });
            barews.addEventListener("close", (ev)=>{
                fakeEventSend(new CloseEvent("close", ev));
            });
            barews.addEventListener("message", (ev)=>{
                const fakeev = new MessageEvent("message", {
                    data: ev.data,
                    origin: ev.origin,
                    lastEventId: ev.lastEventId,
                    source: ev.source,
                    ports: ev.ports
                });
                fakeEventSend(fakeev);
            });
            barews.addEventListener("error", (ev)=>{
                fakeEventSend(new Event("error"));
            });
            socketmap.set(fakeWebSocket, state);
            ctx.return(fakeWebSocket);
        }
    });
    client.Proxy("EventTarget.prototype.addEventListener", {
        apply (ctx) {
            const ws = socketmap.get(ctx.this);
            if (!ws) return; // it's not a websocket ignore it
            const [type, listener, opts] = ctx.args;
            if (typeof opts === "object" && opts.capture || typeof opts === "boolean" && opts) {
                const listeners = ws.captureListeners[type] ??= [];
                listeners.push(listener);
                ws.captureListeners[type] = listeners;
            } else {
                const listeners = ws.listeners[type] ??= [];
                listeners.push(listener);
                ws.listeners[type] = listeners;
            }
            ctx.return(undefined);
        }
    });
    client.Proxy("EventTarget.prototype.removeEventListener", {
        apply (ctx) {
            const ws = socketmap.get(ctx.this);
            if (!ws) return;
            const [type, listener, opts] = ctx.args;
            if (typeof opts === "object" && opts.capture || typeof opts === "boolean" && opts) {
                const listeners = ws.captureListeners[type] ??= [];
                const idx = listeners.indexOf(listener);
                if (idx !== -1) listeners.splice(idx, 1);
                ws.captureListeners[type] = listeners;
            } else {
                const listeners = ws.listeners[type] ??= [];
                const idx = listeners.indexOf(listener);
                if (idx !== -1) listeners.splice(idx, 1);
                ws.listeners[type] = listeners;
            }
            ctx.return(undefined);
        }
    });
    client.Trap("WebSocket.prototype.binaryType", {
        get (ctx) {
            const ws = socketmap.get(ctx.this);
            return ws.binaryType;
        },
        set (ctx, v) {
            const ws = socketmap.get(ctx.this);
            if (v === "blob" || v === "arraybuffer") ws.binaryType = v;
        }
    });
    client.Trap("WebSocket.prototype.bufferedAmount", {
        get () {
            return 0;
        }
    });
    client.Trap("WebSocket.prototype.extensions", {
        get (ctx) {
            const ws = socketmap.get(ctx.this);
            return ws.extensions;
        }
    });
    client.Trap("WebSocket.prototype.onclose", {
        get (ctx) {
            const ws = socketmap.get(ctx.this);
            return ws.onclose;
        },
        set (ctx, v) {
            const ws = socketmap.get(ctx.this);
            ws.onclose = v;
        }
    });
    client.Trap("WebSocket.prototype.onerror", {
        get (ctx) {
            const ws = socketmap.get(ctx.this);
            return ws.onerror;
        },
        set (ctx, v) {
            const ws = socketmap.get(ctx.this);
            ws.onerror = v;
        }
    });
    client.Trap("WebSocket.prototype.onmessage", {
        get (ctx) {
            const ws = socketmap.get(ctx.this);
            return ws.onmessage;
        },
        set (ctx, v) {
            const ws = socketmap.get(ctx.this);
            ws.onmessage = v;
        }
    });
    client.Trap("WebSocket.prototype.onopen", {
        get (ctx) {
            const ws = socketmap.get(ctx.this);
            return ws.onopen;
        },
        set (ctx, v) {
            const ws = socketmap.get(ctx.this);
            ws.onopen = v;
        }
    });
    client.Trap("WebSocket.prototype.url", {
        get (ctx) {
            const ws = socketmap.get(ctx.this);
            return ws.url;
        }
    });
    client.Trap("WebSocket.prototype.protocol", {
        get (ctx) {
            const ws = socketmap.get(ctx.this);
            return ws.protocol;
        }
    });
    client.Trap("WebSocket.prototype.readyState", {
        get (ctx) {
            const ws = socketmap.get(ctx.this);
            return ws.barews.readyState;
        }
    });
    client.Proxy("WebSocket.prototype.send", {
        apply (ctx) {
            const ws = socketmap.get(ctx.this);
            ctx.return(ws.barews.send(ctx.args[0]));
        }
    });
    client.Proxy("WebSocket.prototype.close", {
        apply (ctx) {
            const ws = socketmap.get(ctx.this);
            if (ctx.args[0] === undefined) ctx.args[0] = 1000;
            if (ctx.args[1] === undefined) ctx.args[1] = "";
            ctx.return(ws.barews.close(ctx.args[0], ctx.args[1]));
        }
    });
}


}),
"./src/client/shared/requests/xmlhttprequest.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../shared */ "./src/shared.ts");

const nativeworker = Worker;
const postmessage = Worker.prototype.postMessage;
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    const worker = new nativeworker(_shared__WEBPACK_IMPORTED_MODULE_0__.config.sync);
    const ARGS = Symbol("xhr original args");
    const HEADERS = Symbol("xhr headers");
    client.Proxy("XMLHttpRequest.prototype.open", {
        apply (ctx) {
            if (ctx.args[1]) ctx.args[1] = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(ctx.args[1], client.meta);
            ctx.this[ARGS] = ctx.args;
        }
    });
    client.Proxy("XMLHttpRequest.prototype.setRequestHeader", {
        apply (ctx) {
            const headers = ctx.this[HEADERS] || (ctx.this[HEADERS] = {});
            headers[ctx.args[0]] = ctx.args[1];
        }
    });
    client.Proxy("XMLHttpRequest.prototype.send", {
        apply (ctx) {
            const args = ctx.this[ARGS];
            if (!args || args[2]) return;
            if (!self.$scramjet.config.flags.syncxhr) {
                console.warn("sync xhr disabled in flags");
                return;
            }
            // it's a sync request
            // sync xhr to service worker is not supported
            // there's a nice way of polyfilling this though, we can spin on an atomic using sharedarraybuffer. this will maintain the sync behavior
            // @ts-expect-error maxbytelength not in types yet i guess
            const sab = new SharedArrayBuffer(1024, {
                maxByteLength: 2147483647
            });
            const view = new DataView(sab);
            postmessage.call(worker, {
                sab,
                args,
                headers: ctx.this[HEADERS],
                body: ctx.args[0]
            });
            let now = performance.now();
            while(view.getUint8(0) === 0){
                if (performance.now() - now > 1000) {
                    throw new Error("xhr timeout");
                }
            /* spin */ }
            const status = view.getUint16(1);
            const headersLength = view.getUint32(3);
            const headersab = new Uint8Array(headersLength);
            headersab.set(new Uint8Array(sab.slice(7, 7 + headersLength)));
            const headers = new TextDecoder().decode(headersab);
            const bodyLength = view.getUint32(7 + headersLength);
            const bodyab = new Uint8Array(bodyLength);
            bodyab.set(new Uint8Array(sab.slice(11 + headersLength, 11 + headersLength + bodyLength)));
            const body = new TextDecoder().decode(bodyab);
            // these should be using proxies to not leak scram strings but who cares
            client.RawTrap(ctx.this, "status", {
                get () {
                    return status;
                }
            });
            client.RawTrap(ctx.this, "responseText", {
                get () {
                    return body;
                }
            });
            client.RawTrap(ctx.this, "response", {
                get () {
                    if (ctx.this.responseType === "arraybuffer") return bodyab.buffer;
                    return body;
                }
            });
            client.RawTrap(ctx.this, "responseXML", {
                get () {
                    const parser = new DOMParser();
                    return parser.parseFromString(body, "text/xml");
                }
            });
            client.RawTrap(ctx.this, "getAllResponseHeaders", {
                get () {
                    return ()=>headers;
                }
            });
            client.RawTrap(ctx.this, "getResponseHeader", {
                get () {
                    return (header)=>{
                        const re = new RegExp(`^${header}: (.*)$`, "m");
                        const match = re.exec(headers);
                        return match ? match[1] : null;
                    };
                }
            });
            // send has no return value right
            ctx.return(undefined);
        }
    });
    client.Trap("XMLHttpRequest.prototype.responseURL", {
        get (ctx) {
            return (0,_shared__WEBPACK_IMPORTED_MODULE_0__.decodeUrl)(ctx.get());
        }
    });
}


}),
"./src/client/shared/sourcemaps.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; },
  enabled: function() { return enabled; }
});
const sourcemaps = {};
const enabled = ()=>self.$scramjet.config.flags.sourcemaps;
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self1) {
    // every script will push a sourcemap
    Object.defineProperty(self1, "$scramjet$pushsourcemap", {
        value: (maps, tag)=>{
            sourcemaps[tag] = maps;
        },
        enumerable: false,
        writable: false,
        configurable: false
    });
    const scramtag_ident = "/*scramtag ";
    // when we rewrite javascript it will make function.toString leak internals
    // this can lead to double rewrites which is bad
    client.Proxy("Function.prototype.toString", {
        apply (ctx) {
            let stringified = ctx.fn.call(ctx.this);
            let newString = "";
            // every function rewritten will have a scramtag comment
            // it will look like this:
            // function name() /*scramtag [index] [tag] */ { ... }
            const scramtagstart = stringified.indexOf("/*s");
            if (scramtagstart === -1) return ctx.return(stringified); // it's either a native function or something stolen from scramjet itself
            const firstspace = stringified.indexOf(" ", scramtagstart + scramtag_ident.length);
            // [index] holds the index of the first character in the scramtag (/)
            const abstagindex = parseInt(stringified.substring(scramtagstart + scramtag_ident.length, firstspace));
            // subtracting that from the index of the scramtag gives us the starting index of the function relative to the entire file
            const absindex = abstagindex - scramtagstart;
            const scramtagend = stringified.indexOf("*/", scramtagstart);
            const tag = stringified.substring(firstspace + 1, scramtagend);
            // delete all scramtags inside the function (and nested ones!!)
            stringified = stringified.replace(/\/\*scramtag.*?\*\//g, "");
            const maps = sourcemaps[tag];
            let i = 0;
            let offset = 0;
            let j = 0;
            while(j < maps.length){
                const [str, start, end] = maps[j];
                if (start < absindex) {
                    j++;
                    continue;
                }
                if (start - absindex + offset > stringified.length) break;
                // ooh i should really document this before i forget how it works
                newString += stringified.slice(i, start - absindex + offset);
                newString += str;
                offset += end - start - str.length;
                i = start - absindex + offset + str.length;
                j++;
            }
            newString += stringified.slice(i);
            return ctx.return(newString);
        }
    });
}


}),
"./src/client/shared/unproxy.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; },
  order: function() { return order; },
  unproxy: function() { return unproxy; }
});
/* harmony import */var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! .. */ "./src/client/index.ts");

// we don't want to end up overriding a property on window that's derived from a prototype until we've proxied the prototype
const order = 3;
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    // an automated approach to cleaning the documentProxy from dom functions
    // it will trigger an illegal invocation if you pass the proxy to c++ code, we gotta hotswap it out with the real one
    // admittedly this is pretty slow. worth investigating if there's ways to get back some of the lost performance
    for (const target of [
        self
    ]){
        for(const prop in target){
            try {
                if (typeof target[prop] === "function") {
                    client.RawProxy(target, prop, {
                        apply (ctx) {
                            unproxy(ctx, client);
                        }
                    });
                }
            } catch (e) {}
        }
    }
    if (!___WEBPACK_IMPORTED_MODULE_0__.iswindow) return;
    for (const target of [
        self.Node.prototype,
        self.MutationObserver.prototype,
        self.document
    ]){
        for(const prop in target){
            try {
                if (typeof target[prop] === "function") {
                    client.RawProxy(target, prop, {
                        apply (ctx) {
                            unproxy(ctx, client);
                        }
                    });
                }
            } catch (e) {}
        }
    }
    client.Proxy("Object.getOwnPropertyDescriptor", {
        apply (ctx) {
            const desc = ctx.call();
            if (!desc) return;
            if (desc.get) {
                client.RawProxy(desc, "get", {
                    apply (ctx) {
                        // value of this in the getter needs to be corrected
                        unproxy(ctx, client);
                    }
                });
            }
            if (desc.set) {
                client.RawProxy(desc, "set", {
                    apply (ctx) {
                        unproxy(ctx, client);
                    }
                });
            }
            // i don't think we have to care about value but it's worth looking into
            ctx.return(desc);
        }
    });
}
function unproxy(ctx, client) {
    const self = client.global;
    if (ctx.this === client.globalProxy) ctx.this = self;
    if (ctx.this === client.documentProxy) ctx.this = self.document;
    for(const i in ctx.args){
        if (ctx.args[i] === client.documentProxy) ctx.args[i] = self.document;
        if (ctx.args[i] === client.globalProxy) ctx.args[i] = self;
    }
}


}),
"./src/client/shared/worker.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared */ "./src/shared.ts");
/* harmony import */var _shared_rewriters_url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/rewriters/url */ "./src/shared/rewriters/url.ts");


const workerpostmessage = Worker.prototype.postMessage;
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    client.Proxy("Worker", {
        construct ({ args, call }) {
            if (args[0] instanceof URL) args[0] = args[0].href;
            if (args[0].startsWith("blob:") || args[0].startsWith("data:")) {
                const data = syncfetch(client, args[0]);
                const id = Math.random().toString(8).slice(5);
                args[0] = "/scramjet/worker?id=" + id;
                if (args[1] && args[1].type === "module") {
                    args[0] += "&type=module";
                }
                args[0] += "&origin=" + encodeURIComponent(client.url.origin);
                client.serviceWorker.controller?.postMessage({
                    scramjet$type: "dataworker",
                    data,
                    id
                });
            } else {
                args[0] = (0,_shared_rewriters_url__WEBPACK_IMPORTED_MODULE_1__.encodeUrl)(args[0], client.meta) + "?dest=worker";
                if (args[1] && args[1].type === "module") {
                    args[0] += "&type=module";
                }
            }
            const worker = call();
            const conn = new _shared__WEBPACK_IMPORTED_MODULE_0__.BareMuxConnection();
            (async ()=>{
                const port = await conn.getInnerPort();
                workerpostmessage.call(worker, {
                    $scramjet$type: "baremuxinit",
                    port
                }, [
                    port
                ]);
            })();
        }
    });
    client.Proxy("Worklet.prototype.addModule", {
        apply (ctx) {
            if (ctx.args[0]) ctx.args[0] = (0,_shared_rewriters_url__WEBPACK_IMPORTED_MODULE_1__.encodeUrl)(ctx.args[0], client.meta);
        }
    });
    client.Proxy("SharedWorker", {
        construct ({ args, call }) {
            if (args[0] instanceof URL) args[0] = args[0].href;
            if (args[0].startsWith("blob:") || args[0].startsWith("data:")) {
                const data = syncfetch(client, args[0]);
                const id = Math.random().toString(8).slice(5);
                args[0] = "/scramjet/worker?id=" + id;
                if (args[1] && args[1].type === "module") {
                    args[0] += "&type=module";
                }
                args[0] += "&origin=" + encodeURIComponent(client.url.origin);
                client.serviceWorker.controller?.postMessage({
                    scramjet$type: "dataworker",
                    data,
                    id
                });
            } else {
                args[0] = (0,_shared_rewriters_url__WEBPACK_IMPORTED_MODULE_1__.encodeUrl)(args[0], client.meta) + "?dest=worker";
                if (args[1] && args[1].type === "module") {
                    args[0] += "&type=module";
                }
            }
            const worker = call();
            const conn = new _shared__WEBPACK_IMPORTED_MODULE_0__.BareMuxConnection();
            (async ()=>{
                const port = await conn.getInnerPort();
                workerpostmessage.call(worker, {
                    $scramjet$type: "baremuxinit",
                    port
                }, [
                    port
                ]);
            })();
        }
    });
}
function syncfetch(client, url) {
    const xhr = new XMLHttpRequest();
    const realOpen = client.natives["XMLHttpRequest.prototype.open"].bind(xhr);
    realOpen("GET", url, false);
    xhr.send();
    return xhr.responseText;
}


}),
"./src/client/shared/wrap.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  createWrapFn: function() { return createWrapFn; },
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony import */var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! .. */ "./src/client/index.ts");
/* harmony import */var _symbols__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../symbols */ "./src/symbols.ts");
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared */ "./src/shared.ts");



function createWrapFn(client, self) {
    return function(identifier, args) {
        if (args && typeof args === "object" && args.length === 0) for (const arg of args){
        // argdbg(arg);
        }
        if (___WEBPACK_IMPORTED_MODULE_0__.iswindow && identifier instanceof self.Window) {
            return client.globalProxy;
        } else if (___WEBPACK_IMPORTED_MODULE_0__.iswindow && identifier instanceof self.parent.self.Window) {
            if (_symbols__WEBPACK_IMPORTED_MODULE_1__.SCRAMJETCLIENT in self.parent.self) {
                // ... then we're in a subframe, and the parent frame is also in a proxy context, so we should return its proxy
                return self.parent.self[_symbols__WEBPACK_IMPORTED_MODULE_1__.SCRAMJETCLIENT].globalProxy;
            } else {
                // ... then we should pretend we aren't nested and return the current window
                return client.globalProxy;
            }
        } else if (___WEBPACK_IMPORTED_MODULE_0__.iswindow && identifier instanceof self.top.self.Window) {
            // instead of returning top, we need to return the uppermost parent that's inside a scramjet context
            let current = self.self;
            for(;;){
                const test = current.parent.self;
                if (test === current) break; // there is no parent, actual or emulated.
                // ... then `test` represents a window outside of the proxy context, and therefore `current` is the topmost window in the proxy context
                if (!(_symbols__WEBPACK_IMPORTED_MODULE_1__.SCRAMJETCLIENT in test)) break;
                // test is also insde a proxy, so we should continue up the chain
                current = test;
            }
            return current[_symbols__WEBPACK_IMPORTED_MODULE_1__.SCRAMJETCLIENT].globalProxy.window;
        } else if (___WEBPACK_IMPORTED_MODULE_0__.iswindow && identifier instanceof self.Location || ___WEBPACK_IMPORTED_MODULE_0__.isworker && identifier instanceof self.WorkerLocation) {
            return client.locationProxy;
        } else if (___WEBPACK_IMPORTED_MODULE_0__.iswindow && identifier instanceof self.Document) {
            return client.documentProxy;
        } else if (___WEBPACK_IMPORTED_MODULE_0__.isworker && identifier instanceof self.WorkerGlobalScope) {
            return client.globalProxy;
        }
        return identifier;
    };
}
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, self) {
    // the main magic of the proxy. all attempts to access any "banned objects" will be redirected here, and instead served a proxy object
    // this contrasts from how other proxies will leave the root object alone and instead attempt to catch every member access
    // this presents some issues (see element.ts), but makes us a good bit faster at runtime!
    Object.defineProperty(self, _shared__WEBPACK_IMPORTED_MODULE_2__.config.wrapfn, {
        value: client.wrapfn,
        writable: false,
        configurable: false
    });
    // location = "..." can't be rewritten as wrapfn(location) = ..., so instead it will actually be rewritten as
    // ((t)=>$scramjet$tryset(location,"+=",t)||location+=t)(...);
    // it has to be a discrete function because there's always the possibility that "location" is a local variable
    // we have to use an IIFE to avoid duplicating side-effects in the getter
    Object.defineProperty(self, _shared__WEBPACK_IMPORTED_MODULE_2__.config.trysetfn, {
        value: function(lhs, op, rhs) {
            if (lhs instanceof Location) {
                // @ts-ignore
                locationProxy.href = rhs;
                return true;
            }
        },
        writable: false,
        configurable: false
    });
}


}),
"./src/client/swruntime.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ScramjetServiceWorkerRuntime: function() { return ScramjetServiceWorkerRuntime; }
});
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared */ "./src/shared.ts");
/* provided dependency */ var dbg = __webpack_require__(/*! ./src/log.ts */ "./src/log.ts")["default"];

class ScramjetServiceWorkerRuntime {
    client;
    recvport;
    constructor(client){
        this.client = client;
        // @ts-ignore
        self.onconnect = (cevent)=>{
            const port = cevent.ports[0];
            dbg.log("sw", "connected");
            port.addEventListener("message", (event)=>{
                console.log("sw", event.data);
                if ("scramjet$type" in event.data) {
                    if (event.data.scramjet$type === "init") {
                        this.recvport = event.data.scramjet$port;
                        this.recvport.postMessage({
                            scramjet$type: "init"
                        });
                    } else {
                        handleMessage.call(this, client, event.data);
                    }
                }
            });
            port.start();
        };
    }
    hook() {
        this.client.global.registration = {
            // TODO IMPLEMENT SCOPES
            scope: this.client.url.href,
            active: {
                scriptURL: this.client.url.href,
                state: "activated",
                onstatechange: null,
                onerror: null,
                postMessage: ()=>{},
                addEventListener: ()=>{},
                removeEventListener: ()=>{},
                dispatchEvent: (_e)=>{}
            },
            showNotification: async ()=>{},
            unregister: async ()=>true,
            update: async ()=>{},
            installing: null,
            waiting: null
        };
        // @ts-ignore
        this.client.global.ServiceWorkerGlobalScope = this.client.global;
    }
}
function handleMessage(client, data) {
    const port = this.recvport;
    const type = data.scramjet$type;
    const token = data.scramjet$token;
    if (type === "fetch") {
        dbg.log("ee", data);
        const fetchhandlers = client.eventcallbacks.get(self);
        if (!fetchhandlers) return;
        for (const handler of fetchhandlers){
            if (handler.event !== "fetch") continue;
            const request = data.scramjet$request;
            const Request = client.natives["Request"];
            const fakeRequest = new Request((0,_shared__WEBPACK_IMPORTED_MODULE_0__.decodeUrl)(request.url), {
                body: request.body,
                headers: new Headers(request.headers),
                method: request.method,
                mode: "same-origin"
            });
            Object.defineProperty(fakeRequest, "destination", {
                value: request.destinitation
            });
            // TODO: clean up, maybe put into a class
            const fakeFetchEvent = new Event("fetch");
            fakeFetchEvent.request = fakeRequest;
            let responded = false;
            fakeFetchEvent.respondWith = (response)=>{
                responded = true;
                (async ()=>{
                    response = await response;
                    const message = {
                        scramjet$type: "fetch",
                        scramjet$token: token,
                        scramjet$response: {
                            body: response.body,
                            headers: Array.from(response.headers.entries()),
                            status: response.status,
                            statusText: response.statusText
                        }
                    };
                    dbg.log("sw", "responding", message);
                    port.postMessage(message, [
                        response.body
                    ]);
                })();
            };
            dbg.log("to fn", fakeFetchEvent);
            handler.proxiedCallback(trustEvent(fakeFetchEvent));
            if (!responded) {
                console.log("sw", "no response");
                port.postMessage({
                    scramjet$type: "fetch",
                    scramjet$token: token,
                    scramjet$response: false
                });
            }
        }
    }
}
function trustEvent(event) {
    return new Proxy(event, {
        get (target, prop, reciever) {
            if (prop === "isTrusted") return true;
            return Reflect.get(target, prop);
        }
    });
}


}),
"./src/client/worker/importScripts.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared */ "./src/shared.ts");

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(client, _self) {
    client.Proxy("importScripts", {
        apply (ctx) {
            for(const i in ctx.args){
                ctx.args[i] = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(ctx.args[i], client.meta);
            }
        }
    });
}


}),
"./src/log.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    fmt: function(severity, message, ...args) {
        const old = Error.prepareStackTrace;
        Error.prepareStackTrace = (_, stack)=>{
            stack.shift(); // stack();
            stack.shift(); // fmt();
            stack.shift();
            let fmt = "";
            for(let i = 1; i < Math.min(2, stack.length); i++){
                if (stack[i].getFunctionName()) {
                    // const f = stack[i].getThis()?.constructor?.name;
                    // if (f) fmt += `${f}.`
                    fmt += `${stack[i].getFunctionName()} -> ` + fmt;
                }
            }
            fmt += stack[0].getFunctionName();
            return fmt;
        };
        const fmt = function stack() {
            try {
                throw new Error();
            } catch (e) {
                return e.stack;
            }
        }();
        Error.prepareStackTrace = old;
        const fn = console[severity] || console.log;
        const bg = {
            log: "#000",
            warn: "#f80",
            error: "#f00",
            debug: "transparent"
        }[severity];
        const fg = {
            log: "#fff",
            warn: "#fff",
            error: "#fff",
            debug: "gray"
        }[severity];
        const padding = {
            log: 2,
            warn: 4,
            error: 4,
            debug: 0
        }[severity];
        fn(`%c${fmt}%c ${message}`, `
background-color: ${bg};
color: ${fg};
padding: ${padding}px;
font-weight: bold;
font-family: monospace;
font-size: 0.9em;
`, `
${severity === "debug" ? "color: gray" : ""}
`, ...args);
    },
    log: function(message, ...args) {
        this.fmt("log", message, ...args);
    },
    warn: function(message, ...args) {
        this.fmt("warn", message, ...args);
    },
    error: function(message, ...args) {
        this.fmt("error", message, ...args);
    },
    debug: function(message, ...args) {
        this.fmt("debug", message, ...args);
    }
});


}),
"./src/shared.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  BareClient: function() { return BareClient; },
  BareMuxConnection: function() { return BareMuxConnection; },
  CookieStore: function() { return CookieStore; },
  ScramjetHeaders: function() { return ScramjetHeaders; },
  config: function() { return config; },
  decodeUrl: function() { return decodeUrl; },
  encodeUrl: function() { return encodeUrl; },
  htmlRules: function() { return htmlRules; },
  rewriteCss: function() { return rewriteCss; },
  rewriteHeaders: function() { return rewriteHeaders; },
  rewriteHtml: function() { return rewriteHtml; },
  rewriteJs: function() { return rewriteJs; },
  rewriteSrcset: function() { return rewriteSrcset; },
  rewriteWorkers: function() { return rewriteWorkers; },
  unrewriteCss: function() { return unrewriteCss; },
  unrewriteHtml: function() { return unrewriteHtml; }
});
const { util: { BareClient, ScramjetHeaders, BareMuxConnection }, url: { encodeUrl, decodeUrl }, rewrite: { rewriteCss, unrewriteCss, rewriteHtml, unrewriteHtml, rewriteSrcset, rewriteJs, rewriteHeaders, rewriteWorkers, htmlRules }, CookieStore } = self.$scramjet.shared;
const config = self.$scramjet.config;


}),
"./src/shared/rewriters/js.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  rewriteJs: function() { return rewriteJs; },
  rewriteJsNaiive: function() { return rewriteJsNaiive; }
});
/* harmony import */var _rewriter_out_rewriter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../rewriter/out/rewriter.js */ "./rewriter/out/rewriter.js");
// i am a cat. i like to be petted. i like to be fed. i like to be

(0,_rewriter_out_rewriter_js__WEBPACK_IMPORTED_MODULE_0__.initSync)({
    module: new WebAssembly.Module(Uint8Array.from(atob(self.WASM), (c)=>c.charCodeAt(0)))
});
(0,_rewriter_out_rewriter_js__WEBPACK_IMPORTED_MODULE_0__.init)();
Error.stackTraceLimit = 50;
function rewriteJs(js, meta) {
    if (self.$scramjet.config.flags.naiiveRewriter) {
        const text = typeof js === "string" ? js : new TextDecoder().decode(js);
        return rewriteJsNaiive(text);
    }
    const before = performance.now();
    if (typeof js === "string") {
        js = new TextDecoder().decode((0,_rewriter_out_rewriter_js__WEBPACK_IMPORTED_MODULE_0__.rewrite_js)(js, meta.base.href, self.$scramjet));
    } else {
        js = (0,_rewriter_out_rewriter_js__WEBPACK_IMPORTED_MODULE_0__.rewrite_js_from_arraybuffer)(new Uint8Array(js), meta.base.href, self.$scramjet);
    }
    const after = performance.now();
    // dbg.debug("Rewrite took", Math.floor((after - before) * 10) / 10, "ms");
    return js;
}
// 1. does not work with modules
// 2. cannot proxy import()
// 3. disables "use strict" optimizations
// 4. i think the global state can get clobbered somehow
//
// if you can ensure all the preconditions are met this is faster than full rewrites
function rewriteJsNaiive(js) {
    if (typeof js !== "string") {
        js = new TextDecoder().decode(js);
    }
    return `
		with (${self.$scramjet.config.wrapfn}(globalThis)) {

			${js}

		}
	`;
}


}),
"./src/shared/rewriters/url.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  decodeUrl: function() { return decodeUrl; },
  encodeUrl: function() { return encodeUrl; }
});
/* harmony import */var _js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js */ "./src/shared/rewriters/js.ts");

function tryCanParseURL(url, origin) {
    try {
        return new URL(url, origin);
    } catch  {
        return null;
    }
}
// something is broken with this but i didn't debug it
function encodeUrl(url, meta) {
    if (url instanceof URL) {
        url = url.href;
    }
    // if (!origin) {
    // 	if (location.pathname.startsWith(self.$scramjet.config.prefix + "worker")) {
    // 		origin = new URL(new URL(location.href).searchParams.get("origin"));
    // 	} else
    // 		origin = new URL(
    // 			self.$scramjet.codec.decode(
    // 				location.href.slice(
    // 					(location.origin + self.$scramjet.config.prefix).length
    // 				)
    // 			)
    // 		);
    // }
    if (url.startsWith("javascript:")) {
        return "javascript:" + (0,_js__WEBPACK_IMPORTED_MODULE_0__.rewriteJs)(url.slice("javascript:".length), meta);
    } else if (/^(#|mailto|about|data|blob)/.test(url)) {
        // TODO this regex is jank but i'm not fixing it
        return url;
    } else {
        return location.origin + self.$scramjet.config.prefix + self.$scramjet.codec.encode(new URL(url, meta.base).href);
    }
}
// something is also broken with this but i didn't debug it
function decodeUrl(url) {
    if (url instanceof URL) {
        url = url.href;
    }
    if (tryCanParseURL(url)?.pathname.startsWith(self.$scramjet.config.prefix + "worker")) {
        return new URL(new URL(url).searchParams.get("origin")).href;
    }
    if (/^(#|about|data|mailto|javascript)/.test(url)) {
        return url;
    } else if (tryCanParseURL(url)) {
        return self.$scramjet.codec.decode(url.slice((location.origin + self.$scramjet.config.prefix).length));
    } else {
        return url;
    }
}


}),
"./src/symbols.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  SCRAMJETCLIENT: function() { return SCRAMJETCLIENT; },
  SCRAMJETFRAME: function() { return SCRAMJETFRAME; }
});
// see types.d.ts for what these mean
const SCRAMJETCLIENT = Symbol.for("scramjet client global");
const SCRAMJETFRAME = Symbol.for("scramjet frame handle");


}),
"./rewriter/out/rewriter.js": (function (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return __WEBPACK_DEFAULT_EXPORT__; },
  init: function() { return init; },
  initSync: function() { return initSync; },
  rewrite_js: function() { return rewrite_js; },
  rewrite_js_from_arraybuffer: function() { return rewrite_js_from_arraybuffer; }
});
let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let WASM_VECTOR_LEN = 0;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.buffer !== wasm.memory.buffer) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
};

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer !== wasm.memory.buffer) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().slice(ptr, ptr + len));
}

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}
/**
*/
function init() {
    wasm.init();
}

let stack_pointer = 128;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
* @param {string} js
* @param {string} url
* @param {object} scramjet
* @returns {Uint8Array}
*/
function rewrite_js(js, url, scramjet) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(js, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        wasm.rewrite_js(retptr, ptr0, len0, ptr1, len1, addBorrowedObject(scramjet));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var v3 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1, 1);
        return v3;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
* @param {Uint8Array} js
* @param {string} url
* @param {object} scramjet
* @returns {Uint8Array}
*/
function rewrite_js_from_arraybuffer(js, url, scramjet) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(js, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        wasm.rewrite_js_from_arraybuffer(retptr, ptr0, len0, ptr1, len1, addBorrowedObject(scramjet));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var v3 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1, 1);
        return v3;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = getObject(arg0);
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
        const ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_crypto_1d1f22824a6a080c = function(arg0) {
        const ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_process_4a72847cc503995b = function(arg0) {
        const ret = getObject(arg0).process;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_versions_f686565e586dd935 = function(arg0) {
        const ret = getObject(arg0).versions;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_node_104a2ff8d6ea03a2 = function(arg0) {
        const ret = getObject(arg0).node;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'string';
        return ret;
    };
    imports.wbg.__wbg_require_cca90b1a94a0255b = function() { return handleError(function () {
        const ret = module.require;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_msCrypto_eb05e62b530a1508 = function(arg0) {
        const ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithlength_e9b4878cebadb3d3 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'function';
        return ret;
    };
    imports.wbg.__wbg_get_e3c254076557e348 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_self_ce0dbfc45cf2f5be = function() { return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_window_c6fb939a7f436783 = function() { return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_globalThis_d1e6af4856ba331b = function() { return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_207b558942527489 = function() { return handleError(function () {
        const ret = global.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_newnoargs_e258087cd0daa0ea = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_27c0f87801dedf93 = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_call_b3ca7c6051f9bec1 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_buffer_12d079cc21e14bdb = function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_aa4a17c33a06e5cb = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_randomFillSync_5c9c955aa56b6049 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).randomFillSync(takeObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_subarray_a1f73cd4b5b42fe1 = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getRandomValues_3aa56aa6edec874c = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_new_63b92bc8671ed464 = function(arg0) {
        const ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_a47bac70306a19a7 = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {
    imports.wbg.memory = memory || new WebAssembly.Memory({initial:22,maximum:16384,shared:true});
}

function __wbg_finalize_init(instance, module, thread_stack_size) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;

if (typeof thread_stack_size !== 'undefined' && (typeof thread_stack_size !== 'number' || thread_stack_size === 0 || thread_stack_size % 65536 !== 0)) { throw 'invalid stack size' }
wasm.__wbindgen_start(thread_stack_size);
return wasm;
}

function initSync(module, memory) {
    if (wasm !== undefined) return wasm;

    let thread_stack_size
    if (typeof module !== 'undefined' && Object.getPrototypeOf(module) === Object.prototype)
    ({module, memory, thread_stack_size} = module)
    else
    console.warn('using deprecated parameters for `initSync()`; pass a single object instead')

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports, memory);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module, thread_stack_size);
}

async function __wbg_init(module_or_path, memory) {
    if (wasm !== undefined) return wasm;

    let thread_stack_size
    if (typeof module_or_path !== 'undefined' && Object.getPrototypeOf(module_or_path) === Object.prototype)
    ({module_or_path, memory, thread_stack_size} = module_or_path)
    else
    console.warn('using deprecated parameters for the initialization function; pass a single object instead')

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('rewriter_bg.wasm', "");
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports, memory);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module, thread_stack_size);
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__wbg_init);


}),

});
/************************************************************************/
// The module cache
var __webpack_module_cache__ = {};

// The require function
function __webpack_require__(moduleId) {

// Check if module is in cache
var cachedModule = __webpack_module_cache__[moduleId];
if (cachedModule !== undefined) {
return cachedModule.exports;
}
// Create a new module (and put it into the cache)
var module = (__webpack_module_cache__[moduleId] = {
exports: {}
});
// Execute the module function
__webpack_modules__[moduleId](module, module.exports, __webpack_require__);

// Return the exports of the module
return module.exports;

}

/************************************************************************/
// webpack/runtime/define_property_getters
(() => {
__webpack_require__.d = function(exports, definition) {
	for(var key in definition) {
        if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
            Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
        }
    }
};
})();
// webpack/runtime/has_own_property
(() => {
__webpack_require__.o = function (obj, prop) {
	return Object.prototype.hasOwnProperty.call(obj, prop);
};

})();
// webpack/runtime/make_namespace_object
(() => {
// define __esModule on exports
__webpack_require__.r = function(exports) {
	if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
	}
	Object.defineProperty(exports, '__esModule', { value: true });
};

})();
/************************************************************************/
// startup
// Load entry module and return exports
// This entry module is referenced by other modules so it can't be inlined
var __webpack_exports__ = __webpack_require__("./src/client/index.ts");
})()
;
//# sourceMappingURL=scramjet.client.js.map