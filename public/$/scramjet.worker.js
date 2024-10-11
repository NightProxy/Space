(() => { // webpackBootstrap
"use strict";
var __webpack_modules__ = ({
"./src/shared.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
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
"./src/worker/error.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  errorTemplate: function() { return errorTemplate; },
  renderError: function() { return renderError; }
});
function errorTemplate(trace, fetchedURL) {
    // turn script into a data URI so we don"t have to escape any HTML values
    const script = `
        errorTrace.value = ${JSON.stringify(trace)};
        fetchedURL.textContent = ${JSON.stringify(fetchedURL)};
        for (const node of document.querySelectorAll("#hostname")) node.textContent = ${JSON.stringify(location.hostname)};
        reload.addEventListener("click", () => location.reload());
        version.textContent = "0.0.1";
    `;
    return `<!DOCTYPE html>
        <html>
        <head>
        <meta charset="utf-8" />
        <title>Error</title>
        <style>
        * { background-color: white }
        </style>
        </head>
        <body>
        <h1 id="errorTitle">Error processing your request</h1>
        <hr />
        <p>Failed to load <b id="fetchedURL"></b></p>
        <p id="errorMessage">Internal Server Error</p>
        <textarea id="errorTrace" cols="40" rows="10" readonly></textarea>
        <p>Try:</p>
        <ul>
        <li>Checking your internet connection</li>
        <li>Verifying you entered the correct address</li>
        <li>Clearing the site data</li>
        <li>Contacting <b id="hostname"></b>"s administrator</li>
        <li>Verify the server isn"t censored</li>
        </ul>
        <p>If you"re the administrator of <b id="hostname"></b>, try:</p>
        <ul>
        <li>Restarting your server</li>
        <li>Updating Scramjet</li>
        <li>Troubleshooting the error on the <a href="https://github.com/MercuryWorkshop/scramjet" target="_blank">GitHub repository</a></li>
        </ul>
        <button id="reload">Reload</button>
        <hr />
        <p><i>Scramjet v<span id="version"></span></i></p>
        <script src="${"data:application/javascript," + encodeURIComponent(script)}"></script>
        </body>
        </html>
        `;
}
function renderError(err, fetchedURL) {
    const headers = {
        "content-type": "text/html"
    };
    if (crossOriginIsolated) {
        headers["Cross-Origin-Embedder-Policy"] = "require-corp";
    }
    return new Response(errorTemplate(String(err), fetchedURL), {
        status: 500,
        headers: headers
    });
}


}),
"./src/worker/fakesw.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  FakeServiceWorker: function() { return FakeServiceWorker; }
});
class FakeServiceWorker {
    handle;
    origin;
    syncToken;
    promises;
    messageChannel;
    connected;
    constructor(handle, origin){
        this.handle = handle;
        this.origin = origin;
        this.syncToken = 0;
        this.promises = {};
        this.messageChannel = new MessageChannel();
        this.connected = false;
        this.messageChannel.port1.addEventListener("message", (event)=>{
            if ("scramjet$type" in event.data) {
                if (event.data.scramjet$type === "init") {
                    this.connected = true;
                } else {
                    this.handleMessage(event.data);
                }
            }
        });
        this.messageChannel.port1.start();
        this.handle.postMessage({
            scramjet$type: "init",
            scramjet$port: this.messageChannel.port2
        }, [
            this.messageChannel.port2
        ]);
    }
    handleMessage(data) {
        const cb = this.promises[data.scramjet$token];
        if (cb) {
            cb(data);
            delete this.promises[data.scramjet$token];
        }
    }
    async fetch(request) {
        const token = this.syncToken++;
        const message = {
            scramjet$type: "fetch",
            scramjet$token: token,
            scramjet$request: {
                url: request.url,
                body: request.body,
                headers: Array.from(request.headers.entries()),
                method: request.method,
                mode: request.mode,
                destinitation: request.destination
            }
        };
        const transfer = request.body ? [
            request.body
        ] : [];
        this.handle.postMessage(message, transfer);
        const { scramjet$response: r } = await new Promise((resolve)=>{
            this.promises[token] = resolve;
        });
        if (!r) return false;
        return new Response(r.body, {
            headers: r.headers,
            status: r.status,
            statusText: r.statusText
        });
    }
}


}),
"./src/worker/fetch.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  swfetch: function() { return swfetch; }
});
/* harmony import */var _error__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./error */ "./src/worker/error.ts");
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared */ "./src/shared.ts");


function newmeta(url) {
    return {
        origin: url,
        base: url
    };
}
async function swfetch(request, client) {
    const urlParam = new URLSearchParams(new URL(request.url).search);
    if (urlParam.has("url")) {
        return Response.redirect((0,_shared__WEBPACK_IMPORTED_MODULE_1__.encodeUrl)(urlParam.get("url"), newmeta(new URL(urlParam.get("url")))));
    }
    try {
        const requesturl = new URL(request.url);
        let workertype = "";
        if (requesturl.searchParams.has("type")) {
            workertype = requesturl.searchParams.get("type");
            requesturl.searchParams.delete("type");
        }
        if (requesturl.searchParams.has("dest")) {
            requesturl.searchParams.delete("dest");
        }
        const url = new URL((0,_shared__WEBPACK_IMPORTED_MODULE_1__.decodeUrl)(requesturl));
        const activeWorker = this.serviceWorkers.find((w)=>w.origin === url.origin);
        if (activeWorker && activeWorker.connected && urlParam.get("from") !== "swruntime") {
            // TODO: check scope
            const r = await activeWorker.fetch(request);
            if (r) return r;
        }
        if (url.origin == new URL(request.url).origin) {
            throw new Error("attempted to fetch from same origin - this means the site has obtained a reference to the real origin, aborting");
        }
        const headers = new _shared__WEBPACK_IMPORTED_MODULE_1__.ScramjetHeaders();
        for (const [key, value] of request.headers.entries()){
            headers.set(key, value);
        }
        if (client && new URL(client.url).pathname.startsWith(self.$scramjet.config.prefix)) {
            // TODO: i was against cors emulation but we might actually break stuff if we send full origin/referrer always
            const url = new URL((0,_shared__WEBPACK_IMPORTED_MODULE_1__.decodeUrl)(client.url));
            if (url.toString().includes("youtube.com")) {
                console.log(headers);
            } else {
                headers.set("Referer", url.toString());
                headers.set("Origin", url.origin);
            }
        }
        const cookies = this.cookieStore.getCookies(url, false);
        if (cookies.length) {
            headers.set("Cookie", cookies);
        }
        // TODO this is wrong somehow
        headers.set("Sec-Fetch-Mode", "cors");
        headers.set("Sec-Fetch-Site", "same-origin");
        headers.set("Sec-Fetch-Dest", "empty");
        const response = await this.client.fetch(url, {
            method: request.method,
            body: request.body,
            headers: headers.headers,
            credentials: "omit",
            mode: request.mode === "cors" ? request.mode : "same-origin",
            cache: request.cache,
            redirect: "manual",
            //@ts-ignore why the fuck is this not typed mircosoft
            duplex: "half"
        });
        return await handleResponse(url, workertype, request.destination, response, this.cookieStore, client);
    } catch (err) {
        console.error("ERROR FROM SERVICE WORKER FETCH", err);
        if (![
            "document",
            "iframe"
        ].includes(request.destination)) return new Response(undefined, {
            status: 500
        });
        return (0,_error__WEBPACK_IMPORTED_MODULE_0__.renderError)(err, (0,_shared__WEBPACK_IMPORTED_MODULE_1__.decodeUrl)(request.url));
    }
}
async function handleResponse(url, workertype, destination, response, cookieStore, client) {
    let responseBody;
    const responseHeaders = (0,_shared__WEBPACK_IMPORTED_MODULE_1__.rewriteHeaders)(response.rawHeaders, newmeta(url));
    const maybeHeaders = responseHeaders["set-cookie"] || [];
    for(const cookie in maybeHeaders){
        if (client) client.postMessage({
            scramjet$type: "cookie",
            cookie,
            url: url.href
        });
    }
    await cookieStore.setCookies(maybeHeaders instanceof Array ? maybeHeaders : [
        maybeHeaders
    ], url);
    for(const header in responseHeaders){
        // flatten everything past here
        if (Array.isArray(responseHeaders[header])) responseHeaders[header] = responseHeaders[header][0];
    }
    if (response.body) {
        switch(destination){
            case "iframe":
            case "document":
                if (responseHeaders["content-type"]?.startsWith("text/html")) {
                    responseBody = (0,_shared__WEBPACK_IMPORTED_MODULE_1__.rewriteHtml)(await response.text(), cookieStore, newmeta(url), true);
                } else {
                    responseBody = response.body;
                }
                break;
            case "script":
                responseBody = (0,_shared__WEBPACK_IMPORTED_MODULE_1__.rewriteJs)(await response.arrayBuffer(), newmeta(url));
                break;
            case "style":
                responseBody = (0,_shared__WEBPACK_IMPORTED_MODULE_1__.rewriteCss)(await response.text(), newmeta(url));
                break;
            case "sharedworker":
            case "worker":
                responseBody = (0,_shared__WEBPACK_IMPORTED_MODULE_1__.rewriteWorkers)(await response.arrayBuffer(), workertype, newmeta(url));
                break;
            default:
                responseBody = response.body;
                break;
        }
    }
    // downloads
    if ([
        "document",
        "iframe"
    ].includes(destination)) {
        const header = responseHeaders["content-disposition"];
        // validate header and test for filename
        if (!/\s*?((inline|attachment);\s*?)filename=/i.test(header)) {
            // if filename= wasn"t specified then maybe the remote specified to download this as an attachment?
            // if it"s invalid then we can still possibly test for the attachment/inline type
            const type = /^\s*?attachment/i.test(header) ? "attachment" : "inline";
            // set the filename
            const [filename] = new URL(response.finalURL).pathname.split("/").slice(-1);
            responseHeaders["content-disposition"] = `${type}; filename=${JSON.stringify(filename)}`;
        }
    }
    if (responseHeaders["accept"] === "text/event-stream") {
        responseHeaders["content-type"] = "text/event-stream";
    }
    // scramjet runtime can use features that permissions-policy blocks
    delete responseHeaders["permissions-policy"];
    if (crossOriginIsolated && [
        "document",
        "iframe",
        "worker",
        "sharedworker",
        "style",
        "script"
    ].includes(destination)) {
        responseHeaders["Cross-Origin-Embedder-Policy"] = "require-corp";
        responseHeaders["Cross-Origin-Opener-Policy"] = "same-origin";
    }
    return new Response(responseBody, {
        headers: responseHeaders,
        status: response.status,
        statusText: response.statusText
    });
}


}),
"./src/worker/threadpool.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ScramjetThreadpool: function() { return ScramjetThreadpool; }
});
class ScramjetThreadpool {
    threads = [];
    constructor(){
        self.addEventListener("message", ({ data })=>{
            if (data.scramjet$type == "add") {
                this.spawn(data.handle);
            }
        });
    }
    spawn(handle) {
        const thread = {
            handle,
            ready: false,
            busy: false,
            syncToken: 0,
            promises: new Map()
        };
        this.threads.push(thread);
        thread.handle.onmessage = (e)=>{
            if (e.data === "ready") {
                thread.ready = true;
                return;
            }
            if (e.data === "idle") {
                thread.busy = false;
                return;
            }
            const { token, result, error } = e.data;
            const { resolve, reject } = thread.promises.get(token);
            thread.promises.delete(token);
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        };
        thread.handle.start();
    }
    pick() {
        const alive = this.threads.filter((t)=>t.ready);
        const idle = alive.filter((t)=>!t.busy);
        // no threads
        if (!alive.length) return;
        // there is a thread, but it's busy
        if (!idle.length) return alive[Math.floor(Math.random() * alive.length)];
        // there's an open thread
        return idle[Math.floor(Math.random() * idle.length)];
    }
    run(task, args, transferrable) {
        const thread = this.pick();
        if (!thread) throw new Error("No threads available");
        thread.busy = true;
        const token = thread.syncToken++;
        // console.log("runthread: dispatching task", task, "to thread", thread, "of token", token)
        return new Promise((resolve, reject)=>{
            thread.promises.set(token, {
                resolve,
                reject
            });
            thread.handle.postMessage([
                task,
                ...args
            ], transferrable);
        });
    }
    async rewriteJs(js, origin) {
        return await this.run("rewriteJs", [
            js,
            origin
        ], [
            js
        ]);
    }
}


}),
"./node_modules/@webreflection/idb-map/index.js": (function (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return IDBMap; }
});
const { assign } = Object;

const STORAGE = 'entries';
const READONLY = 'readonly';
const READWRITE = 'readwrite';

/**
 * @typedef {Object} IDBMapOptions
 * @prop {'strict' | 'relaxed' | 'default'} [durability]
 * @prop {string} [prefix]
 */

/** @typedef {[IDBValidKey, unknown]} IDBMapEntry */

/** @type {IDBMapOptions} */
const defaultOptions = { durability: 'default', prefix: 'IDBMap' };

/**
 * @template T
 * @param {{ target: IDBRequest<T> }} event
 * @returns {T}
 */
const result = ({ target: { result } }) => result;

class IDBMap extends EventTarget {
  // Privates
  /** @type {Promise<IDBDatabase>} */ #db;
  /** @type {IDBMapOptions} */ #options;
  /** @type {string} */ #prefix;

  /**
   * @template T
   * @param {(store: IDBObjectStore) => IDBRequest<T>} what
   * @param {'readonly' | 'readwrite'} how
   * @returns {Promise<T>}
   */
  async #transaction(what, how) {
    const db = await this.#db;
    const t = db.transaction(STORAGE, how, this.#options);
    return new Promise((onsuccess, onerror) => assign(
      what(t.objectStore(STORAGE)),
      {
        onsuccess,
        onerror,
      }
    ));
  }

  /**
   * @param {string} name
   * @param {IDBMapOptions} options
   */
  constructor(
    name,
    {
      durability = defaultOptions.durability,
      prefix = defaultOptions.prefix,
    } = defaultOptions
  ) {
    super();
    this.#prefix = prefix;
    this.#options = { durability };
    this.#db = new Promise((resolve, reject) => {
      assign(
        indexedDB.open(`${this.#prefix}/${name}`),
        {
          onupgradeneeded({ target: { result, transaction } }) {
            if (!result.objectStoreNames.length)
              result.createObjectStore(STORAGE);
            transaction.oncomplete = () => resolve(result);
          },
          onsuccess(event) {
            resolve(result(event));
          },
          onerror(event) {
            reject(event);
            this.dispatchEvent(event);
          },
        },
      );
    }).then(result => {
      const boundDispatch = this.dispatchEvent.bind(this);
      for (const key in result) {
        if (key.startsWith('on'))
          result[key] = boundDispatch;
      }
      return result;
    });
  }

  // EventTarget Forwards
  /**
   * @param {Event} event
   * @returns 
   */
  dispatchEvent(event) {
    const { type, message, isTrusted } = event;
    return super.dispatchEvent(
      // avoid re-dispatching of the same event
      isTrusted ?
        assign(new Event(type), { message }) :
        event
    );
  }

  // IDBDatabase Forwards
  async close() {
    (await this.#db).close();
  }

  // Map async API
  get size() {
    return this.#transaction(
      store => store.count(),
      READONLY,
    ).then(result);
  }

  async clear() {
    await this.#transaction(
      store => store.clear(),
      READWRITE,
    );
  }

  /**
   * @param {IDBValidKey} key
   */
  async delete(key) {
    await this.#transaction(
      store => store.delete(key),
      READWRITE,
    );
  }

  /**
   * @returns {Promise<IDBMapEntry[]>}
   */
  async entries() {
    const keys = await this.keys();
    return Promise.all(keys.map(key => this.get(key).then(value => [key, value])));
  }

  /**
   * @param {(unknown, IDBValidKey, IDBMap) => void} callback
   * @param {unknown} [context]
   */
  async forEach(callback, context = this) {
    for (const [key, value] of await this.entries())
      await callback.call(context, value, key, this);
  }

  /**
   * @param {IDBValidKey} key
   * @returns {Promise<unknown | undefined>}
   */
  async get(key) {
    const value = await this.#transaction(
      store => store.get(key),
      READONLY,
    ).then(result);
    return value;
  }

  /**
   * @param {IDBValidKey} key
   */
  async has(key) {
    const k = await this.#transaction(
      store => store.getKey(key),
      READONLY,
    ).then(result);
    return k !== void 0;
  }

  async keys() {
    const keys = await this.#transaction(
      store => store.getAllKeys(),
      READONLY,
    ).then(result);
    return keys;
  }

  /**
   * @param {IDBValidKey} key
   * @param {unknown} value
   */
  async set(key, value) {
    await this.#transaction(
      store => store.put(value, key),
      READWRITE,
    );
    return this;
  }

  async values() {
    const keys = await this.keys();
    return Promise.all(keys.map(key => this.get(key)));
  }

  get [Symbol.toStringTag]() {
    return this.#prefix;
  }
}


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
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ScramjetServiceWorker: function() { return ScramjetServiceWorker; }
});
/* harmony import */var _webreflection_idb_map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @webreflection/idb-map */ "./node_modules/@webreflection/idb-map/index.js");
/* harmony import */var _fakesw__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fakesw */ "./src/worker/fakesw.ts");
/* harmony import */var _fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fetch */ "./src/worker/fetch.ts");
/* harmony import */var _threadpool__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./threadpool */ "./src/worker/threadpool.ts");
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shared */ "./src/shared.ts");





class ScramjetServiceWorker {
    client;
    config;
    threadpool;
    syncPool = {};
    synctoken = 0;
    cookieStore = new self.$scramjet.shared.CookieStore();
    serviceWorkers = [];
    dataworkerpromises = {};
    constructor(){
        this.client = new self.$scramjet.shared.util.BareClient();
        this.threadpool = new _threadpool__WEBPACK_IMPORTED_MODULE_3__.ScramjetThreadpool();
        addEventListener("message", ({ data })=>{
            if (!("scramjet$type" in data)) return;
            if (data.scramjet$type === "registerServiceWorker") {
                this.serviceWorkers.push(new _fakesw__WEBPACK_IMPORTED_MODULE_1__.FakeServiceWorker(data.port, data.origin));
                return;
            }
            if (data.scramjet$type === "cookie") {
                this.cookieStore.setCookies([
                    data.cookie
                ], new URL(data.url));
                return;
            }
            if (data.scramjet$type === "dataworker") {
                if (this.dataworkerpromises[data.id]) {
                    this.dataworkerpromises[data.id].resolve(data.data);
                } else {
                    let resolve;
                    const promise = new Promise((res)=>resolve = res);
                    this.dataworkerpromises[data.id] = {
                        promise,
                        resolve
                    };
                    resolve(data.data);
                }
            }
        });
    }
    async loadConfig() {
        if (this.config) return;
        const store = new _webreflection_idb_map__WEBPACK_IMPORTED_MODULE_0__["default"]("config", {
            prefix: "scramjet"
        });
        if (store.has("config")) {
            const config = await store.get("config");
            this.config = config;
            self.$scramjet.config = config;
            self.$scramjet.codec = self.$scramjet.codecs[config.codec];
        }
    }
    async getLocalStorage() {
        let clients = await self.clients.matchAll();
        clients = clients.filter((client)=>client.type === "window" && !new URL(client.url).pathname.startsWith(this.config.prefix));
        if (clients.length === 0) throw new Error("No clients found");
        const token = this.synctoken++;
        for (const client of clients){
            client.postMessage({
                scramjet$type: "getLocalStorage",
                scramjet$token: token
            });
        }
        return new Promise((resolve)=>{
            this.syncPool[token] = resolve;
        });
    }
    async setLocalStorage(data) {
        let clients = await self.clients.matchAll();
        clients = clients.filter((client)=>client.type === "window" && !new URL(client.url).pathname.startsWith(this.config.prefix));
        if (clients.length === 0) throw new Error("No clients found");
        const token = this.synctoken++;
        for (const client of clients){
            client.postMessage({
                scramjet$type: "setLocalStorage",
                scramjet$token: token,
                data
            });
        }
        return new Promise((resolve)=>{
            this.syncPool[token] = resolve;
        });
    }
    route({ request }) {
        if (request.url.startsWith(location.origin + this.config.prefix)) return true;
        else return false;
    }
    async fetch({ request, clientId }) {
        if (new URL(request.url).pathname.startsWith("/scramjet/worker")) {
            const id = new URL(request.url).searchParams.get("id");
            const type = new URL(request.url).searchParams.get("type");
            const origin = new URL(decodeURIComponent(new URL(request.url).searchParams.get("origin")));
            let promise = this.dataworkerpromises[id];
            if (!promise) {
                let resolve;
                promise = {
                    promise: new Promise((res)=>resolve = res),
                    resolve
                };
                promise.resolve = resolve;
                this.dataworkerpromises[id] = promise;
            }
            const data = await promise.promise;
            delete this.dataworkerpromises[id];
            const rewritten = (0,_shared__WEBPACK_IMPORTED_MODULE_4__.rewriteWorkers)(data, type, {
                origin: new URL(origin),
                base: new URL(origin)
            });
            const headers = {
                "Content-Type": "application/javascript"
            };
            if (crossOriginIsolated) {
                headers["Cross-Origin-Opener-Policy"] = "same-origin";
                headers["Cross-Origin-Embedder-Policy"] = "require-corp";
            }
            return new Response(rewritten, {
                headers
            });
        }
        const client = await self.clients.get(clientId);
        return _fetch__WEBPACK_IMPORTED_MODULE_2__.swfetch.call(this, request, client);
    }
}
self.ScramjetServiceWorker = ScramjetServiceWorker;

})()
;
//# sourceMappingURL=scramjet.worker.js.map