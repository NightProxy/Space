(() => { // webpackBootstrap
"use strict";
var __webpack_modules__ = ({
"./src/controller/frame.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ScramjetFrame: function() { return ScramjetFrame; }
});
/* harmony import */var _symbols__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../symbols */ "./src/symbols.ts");
/* provided dependency */ var dbg = __webpack_require__(/*! ./src/log.ts */ "./src/log.ts")["default"];

class ScramjetFrame extends EventTarget {
    controller;
    frame;
    constructor(controller, frame){
        super(), this.controller = controller, this.frame = frame;
        frame[_symbols__WEBPACK_IMPORTED_MODULE_0__.SCRAMJETFRAME] = this;
    }
    get client() {
        return this.frame.contentWindow.window[_symbols__WEBPACK_IMPORTED_MODULE_0__.SCRAMJETCLIENT];
    }
    go(url) {
        if (url instanceof URL) url = url.toString();
        dbg.log("navigated to", url);
        this.frame.src = this.controller.encodeUrl(url);
    }
    back() {
        this.frame.contentWindow?.history.back();
    }
    forward() {
        this.frame.contentWindow?.history.forward();
    }
}


}),
"./src/log.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
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
"./src/symbols.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  SCRAMJETCLIENT: function() { return SCRAMJETCLIENT; },
  SCRAMJETFRAME: function() { return SCRAMJETFRAME; }
});
// see types.d.ts for what these mean
const SCRAMJETCLIENT = Symbol.for("scramjet client global");
const SCRAMJETFRAME = Symbol.for("scramjet frame handle");


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
  ScramjetController: function() { return ScramjetController; }
});
/* harmony import */var _webreflection_idb_map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @webreflection/idb-map */ "./node_modules/@webreflection/idb-map/index.js");
/* harmony import */var _frame__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./frame */ "./src/controller/frame.ts");
/* provided dependency */ var dbg = __webpack_require__(/*! ./src/log.ts */ "./src/log.ts")["default"];


class ScramjetController {
    config;
    store;
    codec;
    constructor(config){
        const defaultConfig = {
            prefix: "/scramjet/",
            codec: "plain",
            wrapfn: "$scramjet$wrap",
            trysetfn: "$scramjet$tryset",
            importfn: "$scramjet$import",
            rewritefn: "$scramjet$rewrite",
            metafn: "$scramjet$meta",
            setrealmfn: "$scramjet$setrealm",
            pushsourcemapfn: "$scramjet$pushsourcemap",
            wasm: "/scramjet.wasm.js",
            shared: "/scramjet.shared.js",
            worker: "/scramjet.worker.js",
            thread: "/scramjet.thread.js",
            client: "/scramjet.client.js",
            codecs: "/scramjet.codecs.js",
            sync: "/scramjet.sync.js",
            flags: {
                serviceworkers: false,
                naiiveRewriter: false,
                captureErrors: true,
                syncxhr: false,
                cleanerrors: false,
                sourcemaps: true
            }
        };
        const deepMerge = (target, source)=>{
            for(const key in source){
                if (source[key] instanceof Object && key in target) {
                    Object.assign(source[key], deepMerge(target[key], source[key]));
                }
            }
            return Object.assign(target || {}, source);
        };
        this.config = deepMerge(defaultConfig, config);
    }
    async init(serviceWorkerPath) {
        await import(/* webpackIgnore: true */ this.config.codecs);
        this.codec = self.$scramjet.codecs[this.config.codec];
        this.store = new _webreflection_idb_map__WEBPACK_IMPORTED_MODULE_0__["default"]("config", {
            prefix: "scramjet"
        });
        await this.#saveConfig();
        const reg = await navigator.serviceWorker.register(serviceWorkerPath);
        dbg.log("service worker registered");
        return reg;
    }
    createFrame(frame) {
        if (!frame) {
            frame = document.createElement("iframe");
        }
        return new _frame__WEBPACK_IMPORTED_MODULE_1__.ScramjetFrame(this, frame);
    }
    encodeUrl(url) {
        if (url instanceof URL) url = url.toString();
        return this.config.prefix + this.codec.encode(url);
    }
    async #saveConfig() {
        this.store.set("config", this.config);
    }
    async modifyConfig(config) {
        this.config = Object.assign({}, this.config, config);
        this.codec = self.$scramjet.codecs[this.config.codec];
        await this.#saveConfig();
    }
}
window.ScramjetController = ScramjetController;

})()
;
//# sourceMappingURL=scramjet.controller.js.map