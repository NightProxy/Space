(() => { // webpackBootstrap
"use strict";
// The require scope
var __webpack_require__ = {};

/************************************************************************/
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
// for some reason eslint was parsing the type inside of the function params as a variable
const none = {
    encode: (str)=>str,
    decode: (str)=>str
};
const plain = {
    encode: (str)=>{
        if (!str) return str;
        return encodeURIComponent(str);
    },
    decode: (str)=>{
        if (!str) return str;
        return decodeURIComponent(str);
    }
};
const xor = {
    encode: (str, key = 2)=>{
        if (!str) return str;
        let result = "";
        for(let i = 0; i < str.length; i++){
            result += i % key ? String.fromCharCode(str.charCodeAt(i) ^ key) : str[i];
        }
        return encodeURIComponent(result);
    },
    decode: (str, key = 2)=>{
        if (!str) return str;
        const [input, ...search] = str.split("?");
        let result = "";
        const decoded = decodeURIComponent(input);
        for(let i = 0; i < decoded.length; i++){
            result += i % key ? String.fromCharCode(decoded.charCodeAt(i) ^ key) : decoded[i];
        }
        return result + (search.length ? "?" + search.join("?") : "");
    }
};
const base64 = {
    encode: (str)=>{
        if (!str) return str;
        return decodeURIComponent(btoa(str));
    },
    decode: (str)=>{
        if (!str) return str;
        return atob(str);
    }
};
if (typeof self.$scramjet === "undefined") {
    //@ts-expect-error really dumb workaround
    self.$scramjet = {};
}
self.$scramjet.codecs = {
    none,
    plain,
    xor,
    base64
};
if ("document" in self && document.currentScript) {
    document.currentScript.remove();
}


})()
;
//# sourceMappingURL=scramjet.codecs.js.map