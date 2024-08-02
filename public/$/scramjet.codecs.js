(() => {
	// webpackBootstrap
	'use strict';
	// The require scope
	var __webpack_require__ = {};

	/************************************************************************/
	// webpack/runtime/make_namespace_object
	(() => {
		// define __esModule on exports
		__webpack_require__.r = function (exports) {
			if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
				Object.defineProperty(exports, Symbol.toStringTag, {
					value: 'Module'
				});
			}
			Object.defineProperty(exports, '__esModule', { value: true });
		};
	})();
	/************************************************************************/
	var __webpack_exports__ = {};
	__webpack_require__.r(__webpack_exports__);
	var xor = {
		encode: function (str) {
			var key =
				arguments.length > 1 && arguments[1] !== void 0
					? arguments[1]
					: 2;
			if (!str) return str;
			return encodeURIComponent(
				str
					.split('')
					.map(function (e, i) {
						return i % key
							? String.fromCharCode(e.charCodeAt(0) ^ key)
							: e;
					})
					.join('')
			);
		},
		decode: function (str) {
			var key =
				arguments.length > 1 && arguments[1] !== void 0
					? arguments[1]
					: 2;
			if (!str) return str;
			return decodeURIComponent(str)
				.split('')
				.map(function (e, i) {
					return i % key
						? String.fromCharCode(e.charCodeAt(0) ^ key)
						: e;
				})
				.join('');
		}
	};
	var plain = {
		encode: function (str) {
			if (!str) return str;
			return encodeURIComponent(str);
		},
		decode: function (str) {
			if (!str) return str;
			return decodeURIComponent(str);
		}
	};
	/*
const aes = {
    encode: (str: string | undefined) => {
        if (!str) return str;

        return encodeURIComponent(enc(str, "dynamic").substring(10));
    },
    decode: (str: string | undefined) => {
        if (!str) return str;

        return dec("U2FsdGVkX1" + decodeURIComponent(str), "dynamic");
    }
}
*/ var none = {
		encode: function (str) {
			return str;
		},
		decode: function (str) {
			return str;
		}
	};
	var base64 = {
		encode: function (str) {
			if (!str) return str;
			return decodeURIComponent(btoa(str));
		},
		decode: function (str) {
			if (!str) return str;
			return atob(str);
		}
	};
	if (!self.$scramjet) {
		//@ts-expect-error really dumb workaround
		self.$scramjet = {};
	}
	self.$scramjet.codecs = {
		none: none,
		plain: plain,
		base64: base64,
		xor: xor
	};
	// for some reason eslint was parsing the type inside of the function params as a variable
})();
//# sourceMappingURL=scramjet.codecs.js.map
