'use strict';
(() => {
	var ia = Object.create;
	var Rt = Object.defineProperty;
	var ra = Object.getOwnPropertyDescriptor;
	var na = Object.getOwnPropertyNames;
	var aa = Object.getPrototypeOf,
		sa = Object.prototype.hasOwnProperty;
	var ar = (e =>
		typeof require < 'u'
			? require
			: typeof Proxy < 'u'
				? new Proxy(e, {
						get: (t, i) => (typeof require < 'u' ? require : t)[i]
					})
				: e)(function (e) {
		if (typeof require < 'u') return require.apply(this, arguments);
		throw Error('Dynamic require of "' + e + '" is not supported');
	});
	var J = (e, t) => () => (
			t || e((t = { exports: {} }).exports, t), t.exports
		),
		sr = (e, t) => {
			for (var i in t) Rt(e, i, { get: t[i], enumerable: !0 });
		},
		oa = (e, t, i, r) => {
			if ((t && typeof t == 'object') || typeof t == 'function')
				for (let n of na(t))
					!sa.call(e, n) &&
						n !== i &&
						Rt(e, n, {
							get: () => t[n],
							enumerable: !(r = ra(t, n)) || r.enumerable
						});
			return e;
		};
	var ve = (e, t, i) => (
		(i = e != null ? ia(aa(e)) : {}),
		oa(
			t || !e || !e.__esModule
				? Rt(i, 'default', { value: e, enumerable: !0 })
				: i,
			e
		)
	);
	var It = J((Us, cr) => {
		'use strict';
		function ce(e) {
			if (typeof e != 'string')
				throw new TypeError(
					'Path must be a string. Received ' + JSON.stringify(e)
				);
		}
		function or(e, t) {
			for (
				var i = '', r = 0, n = -1, a = 0, s, o = 0;
				o <= e.length;
				++o
			) {
				if (o < e.length) s = e.charCodeAt(o);
				else {
					if (s === 47) break;
					s = 47;
				}
				if (s === 47) {
					if (!(n === o - 1 || a === 1))
						if (n !== o - 1 && a === 2) {
							if (
								i.length < 2 ||
								r !== 2 ||
								i.charCodeAt(i.length - 1) !== 46 ||
								i.charCodeAt(i.length - 2) !== 46
							) {
								if (i.length > 2) {
									var c = i.lastIndexOf('/');
									if (c !== i.length - 1) {
										c === -1
											? ((i = ''), (r = 0))
											: ((i = i.slice(0, c)),
												(r =
													i.length -
													1 -
													i.lastIndexOf('/'))),
											(n = o),
											(a = 0);
										continue;
									}
								} else if (i.length === 2 || i.length === 1) {
									(i = ''), (r = 0), (n = o), (a = 0);
									continue;
								}
							}
							t &&
								(i.length > 0 ? (i += '/..') : (i = '..'),
								(r = 2));
						} else
							i.length > 0
								? (i += '/' + e.slice(n + 1, o))
								: (i = e.slice(n + 1, o)),
								(r = o - n - 1);
					(n = o), (a = 0);
				} else s === 46 && a !== -1 ? ++a : (a = -1);
			}
			return i;
		}
		function ca(e, t) {
			var i = t.dir || t.root,
				r = t.base || (t.name || '') + (t.ext || '');
			return i ? (i === t.root ? i + r : i + e + r) : r;
		}
		var be = {
			resolve: function () {
				for (
					var t = '', i = !1, r, n = arguments.length - 1;
					n >= -1 && !i;
					n--
				) {
					var a;
					n >= 0
						? (a = arguments[n])
						: (r === void 0 && (r = process.cwd()), (a = r)),
						ce(a),
						a.length !== 0 &&
							((t = a + '/' + t), (i = a.charCodeAt(0) === 47));
				}
				return (
					(t = or(t, !i)),
					i ? (t.length > 0 ? '/' + t : '/') : t.length > 0 ? t : '.'
				);
			},
			normalize: function (t) {
				if ((ce(t), t.length === 0)) return '.';
				var i = t.charCodeAt(0) === 47,
					r = t.charCodeAt(t.length - 1) === 47;
				return (
					(t = or(t, !i)),
					t.length === 0 && !i && (t = '.'),
					t.length > 0 && r && (t += '/'),
					i ? '/' + t : t
				);
			},
			isAbsolute: function (t) {
				return ce(t), t.length > 0 && t.charCodeAt(0) === 47;
			},
			join: function () {
				if (arguments.length === 0) return '.';
				for (var t, i = 0; i < arguments.length; ++i) {
					var r = arguments[i];
					ce(r),
						r.length > 0 &&
							(t === void 0 ? (t = r) : (t += '/' + r));
				}
				return t === void 0 ? '.' : be.normalize(t);
			},
			relative: function (t, i) {
				if (
					(ce(t),
					ce(i),
					t === i ||
						((t = be.resolve(t)), (i = be.resolve(i)), t === i))
				)
					return '';
				for (var r = 1; r < t.length && t.charCodeAt(r) === 47; ++r);
				for (
					var n = t.length, a = n - r, s = 1;
					s < i.length && i.charCodeAt(s) === 47;
					++s
				);
				for (
					var o = i.length,
						c = o - s,
						l = a < c ? a : c,
						p = -1,
						f = 0;
					f <= l;
					++f
				) {
					if (f === l) {
						if (c > l) {
							if (i.charCodeAt(s + f) === 47)
								return i.slice(s + f + 1);
							if (f === 0) return i.slice(s + f);
						} else
							a > l &&
								(t.charCodeAt(r + f) === 47
									? (p = f)
									: f === 0 && (p = 0));
						break;
					}
					var g = t.charCodeAt(r + f),
						x = i.charCodeAt(s + f);
					if (g !== x) break;
					g === 47 && (p = f);
				}
				var b = '';
				for (f = r + p + 1; f <= n; ++f)
					(f === n || t.charCodeAt(f) === 47) &&
						(b.length === 0 ? (b += '..') : (b += '/..'));
				return b.length > 0
					? b + i.slice(s + p)
					: ((s += p), i.charCodeAt(s) === 47 && ++s, i.slice(s));
			},
			_makeLong: function (t) {
				return t;
			},
			dirname: function (t) {
				if ((ce(t), t.length === 0)) return '.';
				for (
					var i = t.charCodeAt(0),
						r = i === 47,
						n = -1,
						a = !0,
						s = t.length - 1;
					s >= 1;
					--s
				)
					if (((i = t.charCodeAt(s)), i === 47)) {
						if (!a) {
							n = s;
							break;
						}
					} else a = !1;
				return n === -1
					? r
						? '/'
						: '.'
					: r && n === 1
						? '//'
						: t.slice(0, n);
			},
			basename: function (t, i) {
				if (i !== void 0 && typeof i != 'string')
					throw new TypeError('"ext" argument must be a string');
				ce(t);
				var r = 0,
					n = -1,
					a = !0,
					s;
				if (i !== void 0 && i.length > 0 && i.length <= t.length) {
					if (i.length === t.length && i === t) return '';
					var o = i.length - 1,
						c = -1;
					for (s = t.length - 1; s >= 0; --s) {
						var l = t.charCodeAt(s);
						if (l === 47) {
							if (!a) {
								r = s + 1;
								break;
							}
						} else
							c === -1 && ((a = !1), (c = s + 1)),
								o >= 0 &&
									(l === i.charCodeAt(o)
										? --o === -1 && (n = s)
										: ((o = -1), (n = c)));
					}
					return (
						r === n ? (n = c) : n === -1 && (n = t.length),
						t.slice(r, n)
					);
				} else {
					for (s = t.length - 1; s >= 0; --s)
						if (t.charCodeAt(s) === 47) {
							if (!a) {
								r = s + 1;
								break;
							}
						} else n === -1 && ((a = !1), (n = s + 1));
					return n === -1 ? '' : t.slice(r, n);
				}
			},
			extname: function (t) {
				ce(t);
				for (
					var i = -1, r = 0, n = -1, a = !0, s = 0, o = t.length - 1;
					o >= 0;
					--o
				) {
					var c = t.charCodeAt(o);
					if (c === 47) {
						if (!a) {
							r = o + 1;
							break;
						}
						continue;
					}
					n === -1 && ((a = !1), (n = o + 1)),
						c === 46
							? i === -1
								? (i = o)
								: s !== 1 && (s = 1)
							: i !== -1 && (s = -1);
				}
				return i === -1 ||
					n === -1 ||
					s === 0 ||
					(s === 1 && i === n - 1 && i === r + 1)
					? ''
					: t.slice(i, n);
			},
			format: function (t) {
				if (t === null || typeof t != 'object')
					throw new TypeError(
						'The "pathObject" argument must be of type Object. Received type ' +
							typeof t
					);
				return ca('/', t);
			},
			parse: function (t) {
				ce(t);
				var i = { root: '', dir: '', base: '', ext: '', name: '' };
				if (t.length === 0) return i;
				var r = t.charCodeAt(0),
					n = r === 47,
					a;
				n ? ((i.root = '/'), (a = 1)) : (a = 0);
				for (
					var s = -1, o = 0, c = -1, l = !0, p = t.length - 1, f = 0;
					p >= a;
					--p
				) {
					if (((r = t.charCodeAt(p)), r === 47)) {
						if (!l) {
							o = p + 1;
							break;
						}
						continue;
					}
					c === -1 && ((l = !1), (c = p + 1)),
						r === 46
							? s === -1
								? (s = p)
								: f !== 1 && (f = 1)
							: s !== -1 && (f = -1);
				}
				return (
					s === -1 ||
					c === -1 ||
					f === 0 ||
					(f === 1 && s === c - 1 && s === o + 1)
						? c !== -1 &&
							(o === 0 && n
								? (i.base = i.name = t.slice(1, c))
								: (i.base = i.name = t.slice(o, c)))
						: (o === 0 && n
								? ((i.name = t.slice(1, s)),
									(i.base = t.slice(1, c)))
								: ((i.name = t.slice(o, s)),
									(i.base = t.slice(o, c))),
							(i.ext = t.slice(s, c))),
					o > 0 ? (i.dir = t.slice(0, o - 1)) : n && (i.dir = '/'),
					i
				);
			},
			sep: '/',
			delimiter: ':',
			win32: null,
			posix: null
		};
		be.posix = be;
		cr.exports = be;
	});
	var hn = J(ti => {
		'use strict';
		ti.parse = ms;
		ti.serialize = ys;
		var ds = Object.prototype.toString,
			ut = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
		function ms(e, t) {
			if (typeof e != 'string')
				throw new TypeError('argument str must be a string');
			for (
				var i = {}, r = t || {}, n = r.decode || gs, a = 0;
				a < e.length;

			) {
				var s = e.indexOf('=', a);
				if (s === -1) break;
				var o = e.indexOf(';', a);
				if (o === -1) o = e.length;
				else if (o < s) {
					a = e.lastIndexOf(';', s - 1) + 1;
					continue;
				}
				var c = e.slice(a, s).trim();
				if (i[c] === void 0) {
					var l = e.slice(s + 1, o).trim();
					l.charCodeAt(0) === 34 && (l = l.slice(1, -1)),
						(i[c] = vs(l, n));
				}
				a = o + 1;
			}
			return i;
		}
		function ys(e, t, i) {
			var r = i || {},
				n = r.encode || xs;
			if (typeof n != 'function')
				throw new TypeError('option encode is invalid');
			if (!ut.test(e)) throw new TypeError('argument name is invalid');
			var a = n(t);
			if (a && !ut.test(a))
				throw new TypeError('argument val is invalid');
			var s = e + '=' + a;
			if (r.maxAge != null) {
				var o = r.maxAge - 0;
				if (isNaN(o) || !isFinite(o))
					throw new TypeError('option maxAge is invalid');
				s += '; Max-Age=' + Math.floor(o);
			}
			if (r.domain) {
				if (!ut.test(r.domain))
					throw new TypeError('option domain is invalid');
				s += '; Domain=' + r.domain;
			}
			if (r.path) {
				if (!ut.test(r.path))
					throw new TypeError('option path is invalid');
				s += '; Path=' + r.path;
			}
			if (r.expires) {
				var c = r.expires;
				if (!_s(c) || isNaN(c.valueOf()))
					throw new TypeError('option expires is invalid');
				s += '; Expires=' + c.toUTCString();
			}
			if (
				(r.httpOnly && (s += '; HttpOnly'),
				r.secure && (s += '; Secure'),
				r.priority)
			) {
				var l =
					typeof r.priority == 'string'
						? r.priority.toLowerCase()
						: r.priority;
				switch (l) {
					case 'low':
						s += '; Priority=Low';
						break;
					case 'medium':
						s += '; Priority=Medium';
						break;
					case 'high':
						s += '; Priority=High';
						break;
					default:
						throw new TypeError('option priority is invalid');
				}
			}
			if (r.sameSite) {
				var p =
					typeof r.sameSite == 'string'
						? r.sameSite.toLowerCase()
						: r.sameSite;
				switch (p) {
					case !0:
						s += '; SameSite=Strict';
						break;
					case 'lax':
						s += '; SameSite=Lax';
						break;
					case 'strict':
						s += '; SameSite=Strict';
						break;
					case 'none':
						s += '; SameSite=None';
						break;
					default:
						throw new TypeError('option sameSite is invalid');
				}
			}
			return s;
		}
		function gs(e) {
			return e.indexOf('%') !== -1 ? decodeURIComponent(e) : e;
		}
		function xs(e) {
			return encodeURIComponent(e);
		}
		function _s(e) {
			return ds.call(e) === '[object Date]' || e instanceof Date;
		}
		function vs(e, t) {
			try {
				return t(e);
			} catch {
				return e;
			}
		}
	});
	var fn = J((Ys, Fe) => {
		'use strict';
		var ke = { decodeValues: !0, map: !1, silent: !1 };
		function ii(e) {
			return typeof e == 'string' && !!e.trim();
		}
		function ri(e, t) {
			var i = e.split(';').filter(ii),
				r = i.shift(),
				n = bs(r),
				a = n.name,
				s = n.value;
			t = t ? Object.assign({}, ke, t) : ke;
			try {
				s = t.decodeValues ? decodeURIComponent(s) : s;
			} catch (c) {
				console.error(
					"set-cookie-parser encountered an error while decoding a cookie with value '" +
						s +
						"'. Set options.decodeValues to false to disable this feature.",
					c
				);
			}
			var o = { name: a, value: s };
			return (
				i.forEach(function (c) {
					var l = c.split('='),
						p = l.shift().trimLeft().toLowerCase(),
						f = l.join('=');
					p === 'expires'
						? (o.expires = new Date(f))
						: p === 'max-age'
							? (o.maxAge = parseInt(f, 10))
							: p === 'secure'
								? (o.secure = !0)
								: p === 'httponly'
									? (o.httpOnly = !0)
									: p === 'samesite'
										? (o.sameSite = f)
										: (o[p] = f);
				}),
				o
			);
		}
		function bs(e) {
			var t = '',
				i = '',
				r = e.split('=');
			return (
				r.length > 1 ? ((t = r.shift()), (i = r.join('='))) : (i = e),
				{ name: t, value: i }
			);
		}
		function pn(e, t) {
			if (((t = t ? Object.assign({}, ke, t) : ke), !e))
				return t.map ? {} : [];
			if (e.headers)
				if (typeof e.headers.getSetCookie == 'function')
					e = e.headers.getSetCookie();
				else if (e.headers['set-cookie']) e = e.headers['set-cookie'];
				else {
					var i =
						e.headers[
							Object.keys(e.headers).find(function (n) {
								return n.toLowerCase() === 'set-cookie';
							})
						];
					!i &&
						e.headers.cookie &&
						!t.silent &&
						console.warn(
							'Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning.'
						),
						(e = i);
				}
			if (
				(Array.isArray(e) || (e = [e]),
				(t = t ? Object.assign({}, ke, t) : ke),
				t.map)
			) {
				var r = {};
				return e.filter(ii).reduce(function (n, a) {
					var s = ri(a, t);
					return (n[s.name] = s), n;
				}, r);
			} else
				return e.filter(ii).map(function (n) {
					return ri(n, t);
				});
		}
		function ws(e) {
			if (Array.isArray(e)) return e;
			if (typeof e != 'string') return [];
			var t = [],
				i = 0,
				r,
				n,
				a,
				s,
				o;
			function c() {
				for (; i < e.length && /\s/.test(e.charAt(i)); ) i += 1;
				return i < e.length;
			}
			function l() {
				return (n = e.charAt(i)), n !== '=' && n !== ';' && n !== ',';
			}
			for (; i < e.length; ) {
				for (r = i, o = !1; c(); )
					if (((n = e.charAt(i)), n === ',')) {
						for (a = i, i += 1, c(), s = i; i < e.length && l(); )
							i += 1;
						i < e.length && e.charAt(i) === '='
							? ((o = !0),
								(i = s),
								t.push(e.substring(r, a)),
								(r = i))
							: (i = a + 1);
					} else i += 1;
				(!o || i >= e.length) && t.push(e.substring(r, e.length));
			}
			return t;
		}
		Fe.exports = pn;
		Fe.exports.parse = pn;
		Fe.exports.parseString = ri;
		Fe.exports.splitCookiesString = ws;
	});
	var On = J(() => {});
	var me = J((bt, Bn) => {
		(function (e, t) {
			typeof bt == 'object'
				? (Bn.exports = bt = t())
				: typeof define == 'function' && define.amd
					? define([], t)
					: (e.CryptoJS = t());
		})(bt, function () {
			var e =
				e ||
				(function (t, i) {
					var r;
					if (
						(typeof window < 'u' &&
							window.crypto &&
							(r = window.crypto),
						typeof self < 'u' && self.crypto && (r = self.crypto),
						typeof globalThis < 'u' &&
							globalThis.crypto &&
							(r = globalThis.crypto),
						!r &&
							typeof window < 'u' &&
							window.msCrypto &&
							(r = window.msCrypto),
						!r &&
							typeof global < 'u' &&
							global.crypto &&
							(r = global.crypto),
						!r && typeof ar == 'function')
					)
						try {
							r = On();
						} catch {}
					var n = function () {
							if (r) {
								if (typeof r.getRandomValues == 'function')
									try {
										return r.getRandomValues(
											new Uint32Array(1)
										)[0];
									} catch {}
								if (typeof r.randomBytes == 'function')
									try {
										return r.randomBytes(4).readInt32LE();
									} catch {}
							}
							throw new Error(
								'Native crypto module could not be used to get secure random number.'
							);
						},
						a =
							Object.create ||
							(function () {
								function h() {}
								return function (d) {
									var E;
									return (
										(h.prototype = d),
										(E = new h()),
										(h.prototype = null),
										E
									);
								};
							})(),
						s = {},
						o = (s.lib = {}),
						c = (o.Base = (function () {
							return {
								extend: function (h) {
									var d = a(this);
									return (
										h && d.mixIn(h),
										(!d.hasOwnProperty('init') ||
											this.init === d.init) &&
											(d.init = function () {
												d.$super.init.apply(
													this,
													arguments
												);
											}),
										(d.init.prototype = d),
										(d.$super = this),
										d
									);
								},
								create: function () {
									var h = this.extend();
									return h.init.apply(h, arguments), h;
								},
								init: function () {},
								mixIn: function (h) {
									for (var d in h)
										h.hasOwnProperty(d) && (this[d] = h[d]);
									h.hasOwnProperty('toString') &&
										(this.toString = h.toString);
								},
								clone: function () {
									return this.init.prototype.extend(this);
								}
							};
						})()),
						l = (o.WordArray = c.extend({
							init: function (h, d) {
								(h = this.words = h || []),
									d != i
										? (this.sigBytes = d)
										: (this.sigBytes = h.length * 4);
							},
							toString: function (h) {
								return (h || f).stringify(this);
							},
							concat: function (h) {
								var d = this.words,
									E = h.words,
									m = this.sigBytes,
									I = h.sigBytes;
								if ((this.clamp(), m % 4))
									for (var N = 0; N < I; N++) {
										var U =
											(E[N >>> 2] >>>
												(24 - (N % 4) * 8)) &
											255;
										d[(m + N) >>> 2] |=
											U << (24 - ((m + N) % 4) * 8);
									}
								else
									for (var T = 0; T < I; T += 4)
										d[(m + T) >>> 2] = E[T >>> 2];
								return (this.sigBytes += I), this;
							},
							clamp: function () {
								var h = this.words,
									d = this.sigBytes;
								(h[d >>> 2] &=
									4294967295 << (32 - (d % 4) * 8)),
									(h.length = t.ceil(d / 4));
							},
							clone: function () {
								var h = c.clone.call(this);
								return (h.words = this.words.slice(0)), h;
							},
							random: function (h) {
								for (var d = [], E = 0; E < h; E += 4)
									d.push(n());
								return new l.init(d, h);
							}
						})),
						p = (s.enc = {}),
						f = (p.Hex = {
							stringify: function (h) {
								for (
									var d = h.words,
										E = h.sigBytes,
										m = [],
										I = 0;
									I < E;
									I++
								) {
									var N =
										(d[I >>> 2] >>> (24 - (I % 4) * 8)) &
										255;
									m.push((N >>> 4).toString(16)),
										m.push((N & 15).toString(16));
								}
								return m.join('');
							},
							parse: function (h) {
								for (
									var d = h.length, E = [], m = 0;
									m < d;
									m += 2
								)
									E[m >>> 3] |=
										parseInt(h.substr(m, 2), 16) <<
										(24 - (m % 8) * 4);
								return new l.init(E, d / 2);
							}
						}),
						g = (p.Latin1 = {
							stringify: function (h) {
								for (
									var d = h.words,
										E = h.sigBytes,
										m = [],
										I = 0;
									I < E;
									I++
								) {
									var N =
										(d[I >>> 2] >>> (24 - (I % 4) * 8)) &
										255;
									m.push(String.fromCharCode(N));
								}
								return m.join('');
							},
							parse: function (h) {
								for (
									var d = h.length, E = [], m = 0;
									m < d;
									m++
								)
									E[m >>> 2] |=
										(h.charCodeAt(m) & 255) <<
										(24 - (m % 4) * 8);
								return new l.init(E, d);
							}
						}),
						x = (p.Utf8 = {
							stringify: function (h) {
								try {
									return decodeURIComponent(
										escape(g.stringify(h))
									);
								} catch {
									throw new Error('Malformed UTF-8 data');
								}
							},
							parse: function (h) {
								return g.parse(unescape(encodeURIComponent(h)));
							}
						}),
						b = (o.BufferedBlockAlgorithm = c.extend({
							reset: function () {
								(this._data = new l.init()),
									(this._nDataBytes = 0);
							},
							_append: function (h) {
								typeof h == 'string' && (h = x.parse(h)),
									this._data.concat(h),
									(this._nDataBytes += h.sigBytes);
							},
							_process: function (h) {
								var d,
									E = this._data,
									m = E.words,
									I = E.sigBytes,
									N = this.blockSize,
									U = N * 4,
									T = I / U;
								h
									? (T = t.ceil(T))
									: (T = t.max(
											(T | 0) - this._minBufferSize,
											0
										));
								var j = T * N,
									H = t.min(j * 4, I);
								if (j) {
									for (var y = 0; y < j; y += N)
										this._doProcessBlock(m, y);
									(d = m.splice(0, j)), (E.sigBytes -= H);
								}
								return new l.init(d, H);
							},
							clone: function () {
								var h = c.clone.call(this);
								return (h._data = this._data.clone()), h;
							},
							_minBufferSize: 0
						})),
						D = (o.Hasher = b.extend({
							cfg: c.extend(),
							init: function (h) {
								(this.cfg = this.cfg.extend(h)), this.reset();
							},
							reset: function () {
								b.reset.call(this), this._doReset();
							},
							update: function (h) {
								return this._append(h), this._process(), this;
							},
							finalize: function (h) {
								h && this._append(h);
								var d = this._doFinalize();
								return d;
							},
							blockSize: 512 / 32,
							_createHelper: function (h) {
								return function (d, E) {
									return new h.init(E).finalize(d);
								};
							},
							_createHmacHelper: function (h) {
								return function (d, E) {
									return new P.HMAC.init(h, E).finalize(d);
								};
							}
						})),
						P = (s.algo = {});
					return s;
				})(Math);
			return e;
		});
	});
	var Vn = J((wt, Fn) => {
		(function (e, t) {
			typeof wt == 'object'
				? (Fn.exports = wt = t(me()))
				: typeof define == 'function' && define.amd
					? define(['./core'], t)
					: t(e.CryptoJS);
		})(wt, function (e) {
			return (
				(function () {
					var t = e,
						i = t.lib,
						r = i.WordArray,
						n = t.enc,
						a = (n.Base64 = {
							stringify: function (o) {
								var c = o.words,
									l = o.sigBytes,
									p = this._map;
								o.clamp();
								for (var f = [], g = 0; g < l; g += 3)
									for (
										var x =
												(c[g >>> 2] >>>
													(24 - (g % 4) * 8)) &
												255,
											b =
												(c[(g + 1) >>> 2] >>>
													(24 - ((g + 1) % 4) * 8)) &
												255,
											D =
												(c[(g + 2) >>> 2] >>>
													(24 - ((g + 2) % 4) * 8)) &
												255,
											P = (x << 16) | (b << 8) | D,
											h = 0;
										h < 4 && g + h * 0.75 < l;
										h++
									)
										f.push(
											p.charAt((P >>> (6 * (3 - h))) & 63)
										);
								var d = p.charAt(64);
								if (d) for (; f.length % 4; ) f.push(d);
								return f.join('');
							},
							parse: function (o) {
								var c = o.length,
									l = this._map,
									p = this._reverseMap;
								if (!p) {
									p = this._reverseMap = [];
									for (var f = 0; f < l.length; f++)
										p[l.charCodeAt(f)] = f;
								}
								var g = l.charAt(64);
								if (g) {
									var x = o.indexOf(g);
									x !== -1 && (c = x);
								}
								return s(o, c, p);
							},
							_map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
						});
					function s(o, c, l) {
						for (var p = [], f = 0, g = 0; g < c; g++)
							if (g % 4) {
								var x = l[o.charCodeAt(g - 1)] << ((g % 4) * 2),
									b =
										l[o.charCodeAt(g)] >>>
										(6 - (g % 4) * 2),
									D = x | b;
								(p[f >>> 2] |= D << (24 - (f % 4) * 8)), f++;
							}
						return r.create(p, f);
					}
				})(),
				e.enc.Base64
			);
		});
	});
	var jn = J((St, $n) => {
		(function (e, t) {
			typeof St == 'object'
				? ($n.exports = St = t(me()))
				: typeof define == 'function' && define.amd
					? define(['./core'], t)
					: t(e.CryptoJS);
		})(St, function (e) {
			return (
				(function (t) {
					var i = e,
						r = i.lib,
						n = r.WordArray,
						a = r.Hasher,
						s = i.algo,
						o = [];
					(function () {
						for (var x = 0; x < 64; x++)
							o[x] = (t.abs(t.sin(x + 1)) * 4294967296) | 0;
					})();
					var c = (s.MD5 = a.extend({
						_doReset: function () {
							this._hash = new n.init([
								1732584193, 4023233417, 2562383102, 271733878
							]);
						},
						_doProcessBlock: function (x, b) {
							for (var D = 0; D < 16; D++) {
								var P = b + D,
									h = x[P];
								x[P] =
									(((h << 8) | (h >>> 24)) & 16711935) |
									(((h << 24) | (h >>> 8)) & 4278255360);
							}
							var d = this._hash.words,
								E = x[b + 0],
								m = x[b + 1],
								I = x[b + 2],
								N = x[b + 3],
								U = x[b + 4],
								T = x[b + 5],
								j = x[b + 6],
								H = x[b + 7],
								y = x[b + 8],
								k = x[b + 9],
								L = x[b + 10],
								v = x[b + 11],
								O = x[b + 12],
								V = x[b + 13],
								z = x[b + 14],
								G = x[b + 15],
								_ = d[0],
								w = d[1],
								S = d[2],
								C = d[3];
							(_ = l(_, w, S, C, E, 7, o[0])),
								(C = l(C, _, w, S, m, 12, o[1])),
								(S = l(S, C, _, w, I, 17, o[2])),
								(w = l(w, S, C, _, N, 22, o[3])),
								(_ = l(_, w, S, C, U, 7, o[4])),
								(C = l(C, _, w, S, T, 12, o[5])),
								(S = l(S, C, _, w, j, 17, o[6])),
								(w = l(w, S, C, _, H, 22, o[7])),
								(_ = l(_, w, S, C, y, 7, o[8])),
								(C = l(C, _, w, S, k, 12, o[9])),
								(S = l(S, C, _, w, L, 17, o[10])),
								(w = l(w, S, C, _, v, 22, o[11])),
								(_ = l(_, w, S, C, O, 7, o[12])),
								(C = l(C, _, w, S, V, 12, o[13])),
								(S = l(S, C, _, w, z, 17, o[14])),
								(w = l(w, S, C, _, G, 22, o[15])),
								(_ = p(_, w, S, C, m, 5, o[16])),
								(C = p(C, _, w, S, j, 9, o[17])),
								(S = p(S, C, _, w, v, 14, o[18])),
								(w = p(w, S, C, _, E, 20, o[19])),
								(_ = p(_, w, S, C, T, 5, o[20])),
								(C = p(C, _, w, S, L, 9, o[21])),
								(S = p(S, C, _, w, G, 14, o[22])),
								(w = p(w, S, C, _, U, 20, o[23])),
								(_ = p(_, w, S, C, k, 5, o[24])),
								(C = p(C, _, w, S, z, 9, o[25])),
								(S = p(S, C, _, w, N, 14, o[26])),
								(w = p(w, S, C, _, y, 20, o[27])),
								(_ = p(_, w, S, C, V, 5, o[28])),
								(C = p(C, _, w, S, I, 9, o[29])),
								(S = p(S, C, _, w, H, 14, o[30])),
								(w = p(w, S, C, _, O, 20, o[31])),
								(_ = f(_, w, S, C, T, 4, o[32])),
								(C = f(C, _, w, S, y, 11, o[33])),
								(S = f(S, C, _, w, v, 16, o[34])),
								(w = f(w, S, C, _, z, 23, o[35])),
								(_ = f(_, w, S, C, m, 4, o[36])),
								(C = f(C, _, w, S, U, 11, o[37])),
								(S = f(S, C, _, w, H, 16, o[38])),
								(w = f(w, S, C, _, L, 23, o[39])),
								(_ = f(_, w, S, C, V, 4, o[40])),
								(C = f(C, _, w, S, E, 11, o[41])),
								(S = f(S, C, _, w, N, 16, o[42])),
								(w = f(w, S, C, _, j, 23, o[43])),
								(_ = f(_, w, S, C, k, 4, o[44])),
								(C = f(C, _, w, S, O, 11, o[45])),
								(S = f(S, C, _, w, G, 16, o[46])),
								(w = f(w, S, C, _, I, 23, o[47])),
								(_ = g(_, w, S, C, E, 6, o[48])),
								(C = g(C, _, w, S, H, 10, o[49])),
								(S = g(S, C, _, w, z, 15, o[50])),
								(w = g(w, S, C, _, T, 21, o[51])),
								(_ = g(_, w, S, C, O, 6, o[52])),
								(C = g(C, _, w, S, N, 10, o[53])),
								(S = g(S, C, _, w, L, 15, o[54])),
								(w = g(w, S, C, _, m, 21, o[55])),
								(_ = g(_, w, S, C, y, 6, o[56])),
								(C = g(C, _, w, S, G, 10, o[57])),
								(S = g(S, C, _, w, j, 15, o[58])),
								(w = g(w, S, C, _, V, 21, o[59])),
								(_ = g(_, w, S, C, U, 6, o[60])),
								(C = g(C, _, w, S, v, 10, o[61])),
								(S = g(S, C, _, w, I, 15, o[62])),
								(w = g(w, S, C, _, k, 21, o[63])),
								(d[0] = (d[0] + _) | 0),
								(d[1] = (d[1] + w) | 0),
								(d[2] = (d[2] + S) | 0),
								(d[3] = (d[3] + C) | 0);
						},
						_doFinalize: function () {
							var x = this._data,
								b = x.words,
								D = this._nDataBytes * 8,
								P = x.sigBytes * 8;
							b[P >>> 5] |= 128 << (24 - (P % 32));
							var h = t.floor(D / 4294967296),
								d = D;
							(b[(((P + 64) >>> 9) << 4) + 15] =
								(((h << 8) | (h >>> 24)) & 16711935) |
								(((h << 24) | (h >>> 8)) & 4278255360)),
								(b[(((P + 64) >>> 9) << 4) + 14] =
									(((d << 8) | (d >>> 24)) & 16711935) |
									(((d << 24) | (d >>> 8)) & 4278255360)),
								(x.sigBytes = (b.length + 1) * 4),
								this._process();
							for (
								var E = this._hash, m = E.words, I = 0;
								I < 4;
								I++
							) {
								var N = m[I];
								m[I] =
									(((N << 8) | (N >>> 24)) & 16711935) |
									(((N << 24) | (N >>> 8)) & 4278255360);
							}
							return E;
						},
						clone: function () {
							var x = a.clone.call(this);
							return (x._hash = this._hash.clone()), x;
						}
					}));
					function l(x, b, D, P, h, d, E) {
						var m = x + ((b & D) | (~b & P)) + h + E;
						return ((m << d) | (m >>> (32 - d))) + b;
					}
					function p(x, b, D, P, h, d, E) {
						var m = x + ((b & P) | (D & ~P)) + h + E;
						return ((m << d) | (m >>> (32 - d))) + b;
					}
					function f(x, b, D, P, h, d, E) {
						var m = x + (b ^ D ^ P) + h + E;
						return ((m << d) | (m >>> (32 - d))) + b;
					}
					function g(x, b, D, P, h, d, E) {
						var m = x + (D ^ (b | ~P)) + h + E;
						return ((m << d) | (m >>> (32 - d))) + b;
					}
					(i.MD5 = a._createHelper(c)),
						(i.HmacMD5 = a._createHmacHelper(c));
				})(Math),
				e.MD5
			);
		});
	});
	var Hn = J((Ct, Un) => {
		(function (e, t) {
			typeof Ct == 'object'
				? (Un.exports = Ct = t(me()))
				: typeof define == 'function' && define.amd
					? define(['./core'], t)
					: t(e.CryptoJS);
		})(Ct, function (e) {
			return (
				(function () {
					var t = e,
						i = t.lib,
						r = i.WordArray,
						n = i.Hasher,
						a = t.algo,
						s = [],
						o = (a.SHA1 = n.extend({
							_doReset: function () {
								this._hash = new r.init([
									1732584193, 4023233417, 2562383102,
									271733878, 3285377520
								]);
							},
							_doProcessBlock: function (c, l) {
								for (
									var p = this._hash.words,
										f = p[0],
										g = p[1],
										x = p[2],
										b = p[3],
										D = p[4],
										P = 0;
									P < 80;
									P++
								) {
									if (P < 16) s[P] = c[l + P] | 0;
									else {
										var h =
											s[P - 3] ^
											s[P - 8] ^
											s[P - 14] ^
											s[P - 16];
										s[P] = (h << 1) | (h >>> 31);
									}
									var d = ((f << 5) | (f >>> 27)) + D + s[P];
									P < 20
										? (d +=
												((g & x) | (~g & b)) +
												1518500249)
										: P < 40
											? (d += (g ^ x ^ b) + 1859775393)
											: P < 60
												? (d +=
														((g & x) |
															(g & b) |
															(x & b)) -
														1894007588)
												: (d +=
														(g ^ x ^ b) -
														899497514),
										(D = b),
										(b = x),
										(x = (g << 30) | (g >>> 2)),
										(g = f),
										(f = d);
								}
								(p[0] = (p[0] + f) | 0),
									(p[1] = (p[1] + g) | 0),
									(p[2] = (p[2] + x) | 0),
									(p[3] = (p[3] + b) | 0),
									(p[4] = (p[4] + D) | 0);
							},
							_doFinalize: function () {
								var c = this._data,
									l = c.words,
									p = this._nDataBytes * 8,
									f = c.sigBytes * 8;
								return (
									(l[f >>> 5] |= 128 << (24 - (f % 32))),
									(l[(((f + 64) >>> 9) << 4) + 14] =
										Math.floor(p / 4294967296)),
									(l[(((f + 64) >>> 9) << 4) + 15] = p),
									(c.sigBytes = l.length * 4),
									this._process(),
									this._hash
								);
							},
							clone: function () {
								var c = n.clone.call(this);
								return (c._hash = this._hash.clone()), c;
							}
						}));
					(t.SHA1 = n._createHelper(o)),
						(t.HmacSHA1 = n._createHmacHelper(o));
				})(),
				e.SHA1
			);
		});
	});
	var zn = J((Et, Wn) => {
		(function (e, t) {
			typeof Et == 'object'
				? (Wn.exports = Et = t(me()))
				: typeof define == 'function' && define.amd
					? define(['./core'], t)
					: t(e.CryptoJS);
		})(Et, function (e) {
			(function () {
				var t = e,
					i = t.lib,
					r = i.Base,
					n = t.enc,
					a = n.Utf8,
					s = t.algo,
					o = (s.HMAC = r.extend({
						init: function (c, l) {
							(c = this._hasher = new c.init()),
								typeof l == 'string' && (l = a.parse(l));
							var p = c.blockSize,
								f = p * 4;
							l.sigBytes > f && (l = c.finalize(l)), l.clamp();
							for (
								var g = (this._oKey = l.clone()),
									x = (this._iKey = l.clone()),
									b = g.words,
									D = x.words,
									P = 0;
								P < p;
								P++
							)
								(b[P] ^= 1549556828), (D[P] ^= 909522486);
							(g.sigBytes = x.sigBytes = f), this.reset();
						},
						reset: function () {
							var c = this._hasher;
							c.reset(), c.update(this._iKey);
						},
						update: function (c) {
							return this._hasher.update(c), this;
						},
						finalize: function (c) {
							var l = this._hasher,
								p = l.finalize(c);
							l.reset();
							var f = l.finalize(this._oKey.clone().concat(p));
							return f;
						}
					}));
			})();
		});
	});
	var ir = J((kt, qn) => {
		(function (e, t, i) {
			typeof kt == 'object'
				? (qn.exports = kt = t(me(), Hn(), zn()))
				: typeof define == 'function' && define.amd
					? define(['./core', './sha1', './hmac'], t)
					: t(e.CryptoJS);
		})(kt, function (e) {
			return (
				(function () {
					var t = e,
						i = t.lib,
						r = i.Base,
						n = i.WordArray,
						a = t.algo,
						s = a.MD5,
						o = (a.EvpKDF = r.extend({
							cfg: r.extend({
								keySize: 128 / 32,
								hasher: s,
								iterations: 1
							}),
							init: function (c) {
								this.cfg = this.cfg.extend(c);
							},
							compute: function (c, l) {
								for (
									var p,
										f = this.cfg,
										g = f.hasher.create(),
										x = n.create(),
										b = x.words,
										D = f.keySize,
										P = f.iterations;
									b.length < D;

								) {
									p && g.update(p),
										(p = g.update(c).finalize(l)),
										g.reset();
									for (var h = 1; h < P; h++)
										(p = g.finalize(p)), g.reset();
									x.concat(p);
								}
								return (x.sigBytes = D * 4), x;
							}
						}));
					t.EvpKDF = function (c, l, p) {
						return o.create(p).compute(c, l);
					};
				})(),
				e.EvpKDF
			);
		});
	});
	var Kn = J((At, Gn) => {
		(function (e, t, i) {
			typeof At == 'object'
				? (Gn.exports = At = t(me(), ir()))
				: typeof define == 'function' && define.amd
					? define(['./core', './evpkdf'], t)
					: t(e.CryptoJS);
		})(At, function (e) {
			e.lib.Cipher ||
				(function (t) {
					var i = e,
						r = i.lib,
						n = r.Base,
						a = r.WordArray,
						s = r.BufferedBlockAlgorithm,
						o = i.enc,
						c = o.Utf8,
						l = o.Base64,
						p = i.algo,
						f = p.EvpKDF,
						g = (r.Cipher = s.extend({
							cfg: n.extend(),
							createEncryptor: function (y, k) {
								return this.create(this._ENC_XFORM_MODE, y, k);
							},
							createDecryptor: function (y, k) {
								return this.create(this._DEC_XFORM_MODE, y, k);
							},
							init: function (y, k, L) {
								(this.cfg = this.cfg.extend(L)),
									(this._xformMode = y),
									(this._key = k),
									this.reset();
							},
							reset: function () {
								s.reset.call(this), this._doReset();
							},
							process: function (y) {
								return this._append(y), this._process();
							},
							finalize: function (y) {
								y && this._append(y);
								var k = this._doFinalize();
								return k;
							},
							keySize: 128 / 32,
							ivSize: 128 / 32,
							_ENC_XFORM_MODE: 1,
							_DEC_XFORM_MODE: 2,
							_createHelper: (function () {
								function y(k) {
									return typeof k == 'string' ? H : U;
								}
								return function (k) {
									return {
										encrypt: function (L, v, O) {
											return y(v).encrypt(k, L, v, O);
										},
										decrypt: function (L, v, O) {
											return y(v).decrypt(k, L, v, O);
										}
									};
								};
							})()
						})),
						x = (r.StreamCipher = g.extend({
							_doFinalize: function () {
								var y = this._process(!0);
								return y;
							},
							blockSize: 1
						})),
						b = (i.mode = {}),
						D = (r.BlockCipherMode = n.extend({
							createEncryptor: function (y, k) {
								return this.Encryptor.create(y, k);
							},
							createDecryptor: function (y, k) {
								return this.Decryptor.create(y, k);
							},
							init: function (y, k) {
								(this._cipher = y), (this._iv = k);
							}
						})),
						P = (b.CBC = (function () {
							var y = D.extend();
							(y.Encryptor = y.extend({
								processBlock: function (L, v) {
									var O = this._cipher,
										V = O.blockSize;
									k.call(this, L, v, V),
										O.encryptBlock(L, v),
										(this._prevBlock = L.slice(v, v + V));
								}
							})),
								(y.Decryptor = y.extend({
									processBlock: function (L, v) {
										var O = this._cipher,
											V = O.blockSize,
											z = L.slice(v, v + V);
										O.decryptBlock(L, v),
											k.call(this, L, v, V),
											(this._prevBlock = z);
									}
								}));
							function k(L, v, O) {
								var V,
									z = this._iv;
								z
									? ((V = z), (this._iv = t))
									: (V = this._prevBlock);
								for (var G = 0; G < O; G++) L[v + G] ^= V[G];
							}
							return y;
						})()),
						h = (i.pad = {}),
						d = (h.Pkcs7 = {
							pad: function (y, k) {
								for (
									var L = k * 4,
										v = L - (y.sigBytes % L),
										O =
											(v << 24) |
											(v << 16) |
											(v << 8) |
											v,
										V = [],
										z = 0;
									z < v;
									z += 4
								)
									V.push(O);
								var G = a.create(V, v);
								y.concat(G);
							},
							unpad: function (y) {
								var k = y.words[(y.sigBytes - 1) >>> 2] & 255;
								y.sigBytes -= k;
							}
						}),
						E = (r.BlockCipher = g.extend({
							cfg: g.cfg.extend({ mode: P, padding: d }),
							reset: function () {
								var y;
								g.reset.call(this);
								var k = this.cfg,
									L = k.iv,
									v = k.mode;
								this._xformMode == this._ENC_XFORM_MODE
									? (y = v.createEncryptor)
									: ((y = v.createDecryptor),
										(this._minBufferSize = 1)),
									this._mode && this._mode.__creator == y
										? this._mode.init(this, L && L.words)
										: ((this._mode = y.call(
												v,
												this,
												L && L.words
											)),
											(this._mode.__creator = y));
							},
							_doProcessBlock: function (y, k) {
								this._mode.processBlock(y, k);
							},
							_doFinalize: function () {
								var y,
									k = this.cfg.padding;
								return (
									this._xformMode == this._ENC_XFORM_MODE
										? (k.pad(this._data, this.blockSize),
											(y = this._process(!0)))
										: ((y = this._process(!0)), k.unpad(y)),
									y
								);
							},
							blockSize: 128 / 32
						})),
						m = (r.CipherParams = n.extend({
							init: function (y) {
								this.mixIn(y);
							},
							toString: function (y) {
								return (y || this.formatter).stringify(this);
							}
						})),
						I = (i.format = {}),
						N = (I.OpenSSL = {
							stringify: function (y) {
								var k,
									L = y.ciphertext,
									v = y.salt;
								return (
									v
										? (k = a
												.create([
													1398893684, 1701076831
												])
												.concat(v)
												.concat(L))
										: (k = L),
									k.toString(l)
								);
							},
							parse: function (y) {
								var k,
									L = l.parse(y),
									v = L.words;
								return (
									v[0] == 1398893684 &&
										v[1] == 1701076831 &&
										((k = a.create(v.slice(2, 4))),
										v.splice(0, 4),
										(L.sigBytes -= 16)),
									m.create({ ciphertext: L, salt: k })
								);
							}
						}),
						U = (r.SerializableCipher = n.extend({
							cfg: n.extend({ format: N }),
							encrypt: function (y, k, L, v) {
								v = this.cfg.extend(v);
								var O = y.createEncryptor(L, v),
									V = O.finalize(k),
									z = O.cfg;
								return m.create({
									ciphertext: V,
									key: L,
									iv: z.iv,
									algorithm: y,
									mode: z.mode,
									padding: z.padding,
									blockSize: y.blockSize,
									formatter: v.format
								});
							},
							decrypt: function (y, k, L, v) {
								(v = this.cfg.extend(v)),
									(k = this._parse(k, v.format));
								var O = y
									.createDecryptor(L, v)
									.finalize(k.ciphertext);
								return O;
							},
							_parse: function (y, k) {
								return typeof y == 'string'
									? k.parse(y, this)
									: y;
							}
						})),
						T = (i.kdf = {}),
						j = (T.OpenSSL = {
							execute: function (y, k, L, v, O) {
								if ((v || (v = a.random(64 / 8)), O))
									var V = f
										.create({ keySize: k + L, hasher: O })
										.compute(y, v);
								else
									var V = f
										.create({ keySize: k + L })
										.compute(y, v);
								var z = a.create(V.words.slice(k), L * 4);
								return (
									(V.sigBytes = k * 4),
									m.create({ key: V, iv: z, salt: v })
								);
							}
						}),
						H = (r.PasswordBasedCipher = U.extend({
							cfg: U.cfg.extend({ kdf: j }),
							encrypt: function (y, k, L, v) {
								v = this.cfg.extend(v);
								var O = v.kdf.execute(
									L,
									y.keySize,
									y.ivSize,
									v.salt,
									v.hasher
								);
								v.iv = O.iv;
								var V = U.encrypt.call(this, y, k, O.key, v);
								return V.mixIn(O), V;
							},
							decrypt: function (y, k, L, v) {
								(v = this.cfg.extend(v)),
									(k = this._parse(k, v.format));
								var O = v.kdf.execute(
									L,
									y.keySize,
									y.ivSize,
									k.salt,
									v.hasher
								);
								v.iv = O.iv;
								var V = U.decrypt.call(this, y, k, O.key, v);
								return V;
							}
						}));
				})();
		});
	});
	var Yn = J((Pt, Qn) => {
		(function (e, t, i) {
			typeof Pt == 'object'
				? (Qn.exports = Pt = t(me(), Vn(), jn(), ir(), Kn()))
				: typeof define == 'function' && define.amd
					? define(
							[
								'./core',
								'./enc-base64',
								'./md5',
								'./evpkdf',
								'./cipher-core'
							],
							t
						)
					: t(e.CryptoJS);
		})(Pt, function (e) {
			return (
				(function () {
					var t = e,
						i = t.lib,
						r = i.BlockCipher,
						n = t.algo,
						a = [],
						s = [],
						o = [],
						c = [],
						l = [],
						p = [],
						f = [],
						g = [],
						x = [],
						b = [];
					(function () {
						for (var h = [], d = 0; d < 256; d++)
							d < 128 ? (h[d] = d << 1) : (h[d] = (d << 1) ^ 283);
						for (var E = 0, m = 0, d = 0; d < 256; d++) {
							var I =
								m ^ (m << 1) ^ (m << 2) ^ (m << 3) ^ (m << 4);
							(I = (I >>> 8) ^ (I & 255) ^ 99),
								(a[E] = I),
								(s[I] = E);
							var N = h[E],
								U = h[N],
								T = h[U],
								j = (h[I] * 257) ^ (I * 16843008);
							(o[E] = (j << 24) | (j >>> 8)),
								(c[E] = (j << 16) | (j >>> 16)),
								(l[E] = (j << 8) | (j >>> 24)),
								(p[E] = j);
							var j =
								(T * 16843009) ^
								(U * 65537) ^
								(N * 257) ^
								(E * 16843008);
							(f[I] = (j << 24) | (j >>> 8)),
								(g[I] = (j << 16) | (j >>> 16)),
								(x[I] = (j << 8) | (j >>> 24)),
								(b[I] = j),
								E
									? ((E = N ^ h[h[h[T ^ N]]]), (m ^= h[h[m]]))
									: (E = m = 1);
						}
					})();
					var D = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],
						P = (n.AES = r.extend({
							_doReset: function () {
								var h;
								if (
									!(
										this._nRounds &&
										this._keyPriorReset === this._key
									)
								) {
									for (
										var d = (this._keyPriorReset =
												this._key),
											E = d.words,
											m = d.sigBytes / 4,
											I = (this._nRounds = m + 6),
											N = (I + 1) * 4,
											U = (this._keySchedule = []),
											T = 0;
										T < N;
										T++
									)
										T < m
											? (U[T] = E[T])
											: ((h = U[T - 1]),
												T % m
													? m > 6 &&
														T % m == 4 &&
														(h =
															(a[h >>> 24] <<
																24) |
															(a[
																(h >>> 16) & 255
															] <<
																16) |
															(a[
																(h >>> 8) & 255
															] <<
																8) |
															a[h & 255])
													: ((h =
															(h << 8) |
															(h >>> 24)),
														(h =
															(a[h >>> 24] <<
																24) |
															(a[
																(h >>> 16) & 255
															] <<
																16) |
															(a[
																(h >>> 8) & 255
															] <<
																8) |
															a[h & 255]),
														(h ^=
															D[(T / m) | 0] <<
															24)),
												(U[T] = U[T - m] ^ h));
									for (
										var j = (this._invKeySchedule = []),
											H = 0;
										H < N;
										H++
									) {
										var T = N - H;
										if (H % 4) var h = U[T];
										else var h = U[T - 4];
										H < 4 || T <= 4
											? (j[H] = h)
											: (j[H] =
													f[a[h >>> 24]] ^
													g[a[(h >>> 16) & 255]] ^
													x[a[(h >>> 8) & 255]] ^
													b[a[h & 255]]);
									}
								}
							},
							encryptBlock: function (h, d) {
								this._doCryptBlock(
									h,
									d,
									this._keySchedule,
									o,
									c,
									l,
									p,
									a
								);
							},
							decryptBlock: function (h, d) {
								var E = h[d + 1];
								(h[d + 1] = h[d + 3]),
									(h[d + 3] = E),
									this._doCryptBlock(
										h,
										d,
										this._invKeySchedule,
										f,
										g,
										x,
										b,
										s
									);
								var E = h[d + 1];
								(h[d + 1] = h[d + 3]), (h[d + 3] = E);
							},
							_doCryptBlock: function (h, d, E, m, I, N, U, T) {
								for (
									var j = this._nRounds,
										H = h[d] ^ E[0],
										y = h[d + 1] ^ E[1],
										k = h[d + 2] ^ E[2],
										L = h[d + 3] ^ E[3],
										v = 4,
										O = 1;
									O < j;
									O++
								) {
									var V =
											m[H >>> 24] ^
											I[(y >>> 16) & 255] ^
											N[(k >>> 8) & 255] ^
											U[L & 255] ^
											E[v++],
										z =
											m[y >>> 24] ^
											I[(k >>> 16) & 255] ^
											N[(L >>> 8) & 255] ^
											U[H & 255] ^
											E[v++],
										G =
											m[k >>> 24] ^
											I[(L >>> 16) & 255] ^
											N[(H >>> 8) & 255] ^
											U[y & 255] ^
											E[v++],
										_ =
											m[L >>> 24] ^
											I[(H >>> 16) & 255] ^
											N[(y >>> 8) & 255] ^
											U[k & 255] ^
											E[v++];
									(H = V), (y = z), (k = G), (L = _);
								}
								var V =
										((T[H >>> 24] << 24) |
											(T[(y >>> 16) & 255] << 16) |
											(T[(k >>> 8) & 255] << 8) |
											T[L & 255]) ^
										E[v++],
									z =
										((T[y >>> 24] << 24) |
											(T[(k >>> 16) & 255] << 16) |
											(T[(L >>> 8) & 255] << 8) |
											T[H & 255]) ^
										E[v++],
									G =
										((T[k >>> 24] << 24) |
											(T[(L >>> 16) & 255] << 16) |
											(T[(H >>> 8) & 255] << 8) |
											T[y & 255]) ^
										E[v++],
									_ =
										((T[L >>> 24] << 24) |
											(T[(H >>> 16) & 255] << 16) |
											(T[(y >>> 8) & 255] << 8) |
											T[k & 255]) ^
										E[v++];
								(h[d] = V),
									(h[d + 1] = z),
									(h[d + 2] = G),
									(h[d + 3] = _);
							},
							keySize: 256 / 32
						}));
					t.AES = r._createHelper(P);
				})(),
				e.AES
			);
		});
	});
	var Jn = J((Lt, Xn) => {
		(function (e, t) {
			typeof Lt == 'object'
				? (Xn.exports = Lt = t(me()))
				: typeof define == 'function' && define.amd
					? define(['./core'], t)
					: t(e.CryptoJS);
		})(Lt, function (e) {
			return e.enc.Utf8;
		});
	});
	var lr = ve(It()),
		Xe = {
			'application/ecmascript': {
				source: 'apache',
				compressible: !0,
				extensions: ['ecma']
			},
			'application/gzip': {
				source: 'iana',
				compressible: !1,
				extensions: ['gz']
			},
			'application/http': { source: 'iana' },
			'application/javascript': {
				source: 'apache',
				charset: 'UTF-8',
				compressible: !0,
				extensions: ['js']
			},
			'application/json': {
				source: 'iana',
				charset: 'UTF-8',
				compressible: !0,
				extensions: ['json', 'map']
			},
			'application/manifest+json': {
				source: 'iana',
				charset: 'UTF-8',
				compressible: !0,
				extensions: ['webmanifest']
			},
			'application/marc': { source: 'iana', extensions: ['mrc'] },
			'application/mp4': {
				source: 'iana',
				extensions: ['mp4', 'mpg4', 'mp4s', 'm4p']
			},
			'application/ogg': {
				source: 'iana',
				compressible: !1,
				extensions: ['ogx']
			},
			'application/sql': { source: 'iana', extensions: ['sql'] },
			'application/wasm': {
				source: 'iana',
				compressible: !0,
				extensions: ['wasm']
			},
			'application/x-bittorrent': {
				source: 'apache',
				extensions: ['torrent']
			},
			'application/x-gzip': { source: 'apache' },
			'application/x-javascript': { compressible: !0 },
			'application/x-web-app-manifest+json': {
				compressible: !0,
				extensions: ['webapp']
			},
			'application/x-www-form-urlencoded': {
				source: 'iana',
				compressible: !0
			},
			'application/xhtml+xml': {
				source: 'iana',
				compressible: !0,
				extensions: ['xhtml', 'xht']
			},
			'application/xhtml-voice+xml': {
				source: 'apache',
				compressible: !0
			},
			'application/xml': {
				source: 'iana',
				compressible: !0,
				extensions: ['xml', 'xsl', 'xsd', 'rng']
			},
			'application/zip': {
				source: 'iana',
				compressible: !1,
				extensions: ['zip']
			},
			'application/zlib': { source: 'iana' },
			'audio/midi': {
				source: 'apache',
				extensions: ['mid', 'midi', 'kar', 'rmi']
			},
			'audio/mp3': { compressible: !1, extensions: ['mp3'] },
			'audio/mp4': {
				source: 'iana',
				compressible: !1,
				extensions: ['m4a', 'mp4a']
			},
			'audio/mp4a-latm': { source: 'iana' },
			'audio/mpa': { source: 'iana' },
			'audio/mpa-robust': { source: 'iana' },
			'audio/mpeg': {
				source: 'iana',
				compressible: !1,
				extensions: ['mpga', 'mp2', 'mp2a', 'mp3', 'm2a', 'm3a']
			},
			'audio/ogg': {
				source: 'iana',
				compressible: !1,
				extensions: ['oga', 'ogg', 'spx', 'opus']
			},
			'audio/red': { source: 'iana' },
			'audio/rtx': { source: 'iana' },
			'audio/scip': { source: 'iana' },
			'audio/silk': { source: 'apache', extensions: ['sil'] },
			'audio/smv': { source: 'iana' },
			'audio/wav': { compressible: !1, extensions: ['wav'] },
			'audio/wave': { compressible: !1, extensions: ['wav'] },
			'audio/webm': {
				source: 'apache',
				compressible: !1,
				extensions: ['weba']
			},
			'audio/x-aac': {
				source: 'apache',
				compressible: !1,
				extensions: ['aac']
			},
			'audio/x-aiff': {
				source: 'apache',
				extensions: ['aif', 'aiff', 'aifc']
			},
			'audio/x-caf': {
				source: 'apache',
				compressible: !1,
				extensions: ['caf']
			},
			'audio/x-flac': { source: 'apache', extensions: ['flac'] },
			'audio/x-m4a': { source: 'nginx', extensions: ['m4a'] },
			'audio/x-matroska': { source: 'apache', extensions: ['mka'] },
			'audio/x-mpegurl': { source: 'apache', extensions: ['m3u'] },
			'audio/x-ms-wax': { source: 'apache', extensions: ['wax'] },
			'audio/x-ms-wma': { source: 'apache', extensions: ['wma'] },
			'audio/x-pn-realaudio': {
				source: 'apache',
				extensions: ['ram', 'ra']
			},
			'audio/x-pn-realaudio-plugin': {
				source: 'apache',
				extensions: ['rmp']
			},
			'audio/x-realaudio': { source: 'nginx', extensions: ['ra'] },
			'audio/x-tta': { source: 'apache' },
			'audio/x-wav': { source: 'apache', extensions: ['wav'] },
			'audio/xm': { source: 'apache', extensions: ['xm'] },
			'font/collection': { source: 'iana', extensions: ['ttc'] },
			'font/otf': {
				source: 'iana',
				compressible: !0,
				extensions: ['otf']
			},
			'font/sfnt': { source: 'iana' },
			'font/ttf': {
				source: 'iana',
				compressible: !0,
				extensions: ['ttf']
			},
			'font/woff': { source: 'iana', extensions: ['woff'] },
			'font/woff2': { source: 'iana', extensions: ['woff2'] },
			'image/gif': {
				source: 'iana',
				compressible: !1,
				extensions: ['gif']
			},
			'image/heic': { source: 'iana', extensions: ['heic'] },
			'image/heic-sequence': { source: 'iana', extensions: ['heics'] },
			'image/heif': { source: 'iana', extensions: ['heif'] },
			'image/jpeg': {
				source: 'iana',
				compressible: !1,
				extensions: ['jpeg', 'jpg', 'jpe']
			},
			'image/png': {
				source: 'iana',
				compressible: !1,
				extensions: ['png']
			},
			'image/svg+xml': {
				source: 'iana',
				compressible: !0,
				extensions: ['svg', 'svgz']
			},
			'image/webp': { source: 'iana', extensions: ['webp'] },
			'text/coffeescript': { extensions: ['coffee', 'litcoffee'] },
			'text/css': {
				source: 'iana',
				charset: 'UTF-8',
				compressible: !0,
				extensions: ['css']
			},
			'text/ecmascript': { source: 'apache' },
			'text/html': {
				source: 'iana',
				compressible: !0,
				extensions: ['html', 'htm', 'shtml']
			},
			'text/jade': { extensions: ['jade'] },
			'text/javascript': {
				source: 'iana',
				charset: 'UTF-8',
				compressible: !0,
				extensions: ['js', 'mjs']
			},
			'text/markdown': {
				source: 'iana',
				compressible: !0,
				extensions: ['md', 'markdown']
			}
		},
		hr = /^\s*([^;\s]*)(?:;|\s|$)/,
		ua = /^text\//i,
		Y = {};
	function ur(e) {
		if (!e || typeof e != 'string') return !1;
		var t = hr.exec(e),
			i = t && Xe[t[1].toLowerCase()];
		return i && i.charset ? i.charset : !(!t || !ua.test(t[1])) && 'UTF-8';
	}
	function la(e) {
		if (!e || typeof e != 'string') return !1;
		var t = e.indexOf('/') === -1 ? Y.lookup(e) : e;
		if (!t) return !1;
		if (t.indexOf('charset') === -1) {
			var i = Y.charset(t);
			i && (t += '; charset=' + i.toLowerCase());
		}
		return t;
	}
	function ha(e) {
		if (!e || typeof e != 'string') return !1;
		var t = hr.exec(e),
			i = t && Y.extensions[t[1].toLowerCase()];
		return !(!i || !i.length) && i[0];
	}
	function pa(e) {
		if (!e || typeof e != 'string') return !1;
		var t = (0, lr.extname)('x.' + e)
			.toLowerCase()
			.substr(1);
		return (t && Y.types[t]) || !1;
	}
	function fa(e, t) {
		var i = ['nginx', 'apache', void 0, 'iana'];
		Object.keys(Xe).forEach(function (r) {
			var n = Xe[r],
				a = n.extensions;
			if (a && a.length) {
				e[r] = a;
				for (var s = 0; s < a.length; s++) {
					var o = a[s];
					if (t[o]) {
						var c = i.indexOf(Xe[t[o]].source),
							l = i.indexOf(n.source);
						if (
							t[o] !== 'application/octet-stream' &&
							(c > l ||
								(c === l &&
									t[o].substr(0, 12) === 'application/'))
						)
							continue;
					}
					t[o] = r;
				}
			}
		});
	}
	(Y.charset = ur),
		(Y.charsets = { lookup: ur }),
		(Y.contentType = la),
		(Y.extension = ha),
		(Y.extensions = Object.create(null)),
		(Y.lookup = pa),
		(Y.types = Object.create(null)),
		fa(Y.extensions, Y.types);
	var pr = Y;
	var Ls = ve(It(), 1);
	var Je = {};
	sr(Je, {
		deleteDB: () => ba,
		openDB: () => Bt,
		unwrap: () => Re,
		wrap: () => Z
	});
	var da = (e, t) => t.some(i => e instanceof i),
		fr,
		dr;
	function ma() {
		return (
			fr ||
			(fr = [
				IDBDatabase,
				IDBObjectStore,
				IDBIndex,
				IDBCursor,
				IDBTransaction
			])
		);
	}
	function ya() {
		return (
			dr ||
			(dr = [
				IDBCursor.prototype.advance,
				IDBCursor.prototype.continue,
				IDBCursor.prototype.continuePrimaryKey
			])
		);
	}
	var mr = new WeakMap(),
		Nt = new WeakMap(),
		yr = new WeakMap(),
		Tt = new WeakMap(),
		Dt = new WeakMap();
	function ga(e) {
		let t = new Promise((i, r) => {
			let n = () => {
					e.removeEventListener('success', a),
						e.removeEventListener('error', s);
				},
				a = () => {
					i(Z(e.result)), n();
				},
				s = () => {
					r(e.error), n();
				};
			e.addEventListener('success', a), e.addEventListener('error', s);
		});
		return (
			t
				.then(i => {
					i instanceof IDBCursor && mr.set(i, e);
				})
				.catch(() => {}),
			Dt.set(t, e),
			t
		);
	}
	function xa(e) {
		if (Nt.has(e)) return;
		let t = new Promise((i, r) => {
			let n = () => {
					e.removeEventListener('complete', a),
						e.removeEventListener('error', s),
						e.removeEventListener('abort', s);
				},
				a = () => {
					i(), n();
				},
				s = () => {
					r(e.error || new DOMException('AbortError', 'AbortError')),
						n();
				};
			e.addEventListener('complete', a),
				e.addEventListener('error', s),
				e.addEventListener('abort', s);
		});
		Nt.set(e, t);
	}
	var Mt = {
		get(e, t, i) {
			if (e instanceof IDBTransaction) {
				if (t === 'done') return Nt.get(e);
				if (t === 'objectStoreNames')
					return e.objectStoreNames || yr.get(e);
				if (t === 'store')
					return i.objectStoreNames[1]
						? void 0
						: i.objectStore(i.objectStoreNames[0]);
			}
			return Z(e[t]);
		},
		set(e, t, i) {
			return (e[t] = i), !0;
		},
		has(e, t) {
			return e instanceof IDBTransaction &&
				(t === 'done' || t === 'store')
				? !0
				: t in e;
		}
	};
	function gr(e) {
		Mt = e(Mt);
	}
	function _a(e) {
		return e === IDBDatabase.prototype.transaction &&
			!('objectStoreNames' in IDBTransaction.prototype)
			? function (t, ...i) {
					let r = e.call(Re(this), t, ...i);
					return yr.set(r, t.sort ? t.sort() : [t]), Z(r);
				}
			: ya().includes(e)
				? function (...t) {
						return e.apply(Re(this), t), Z(mr.get(this));
					}
				: function (...t) {
						return Z(e.apply(Re(this), t));
					};
	}
	function va(e) {
		return typeof e == 'function'
			? _a(e)
			: (e instanceof IDBTransaction && xa(e),
				da(e, ma()) ? new Proxy(e, Mt) : e);
	}
	function Z(e) {
		if (e instanceof IDBRequest) return ga(e);
		if (Tt.has(e)) return Tt.get(e);
		let t = va(e);
		return t !== e && (Tt.set(e, t), Dt.set(t, e)), t;
	}
	var Re = e => Dt.get(e);
	function Bt(
		e,
		t,
		{ blocked: i, upgrade: r, blocking: n, terminated: a } = {}
	) {
		let s = indexedDB.open(e, t),
			o = Z(s);
		return (
			r &&
				s.addEventListener('upgradeneeded', c => {
					r(
						Z(s.result),
						c.oldVersion,
						c.newVersion,
						Z(s.transaction),
						c
					);
				}),
			i &&
				s.addEventListener('blocked', c =>
					i(c.oldVersion, c.newVersion, c)
				),
			o
				.then(c => {
					a && c.addEventListener('close', () => a()),
						n &&
							c.addEventListener('versionchange', l =>
								n(l.oldVersion, l.newVersion, l)
							);
				})
				.catch(() => {}),
			o
		);
	}
	function ba(e, { blocked: t } = {}) {
		let i = indexedDB.deleteDatabase(e);
		return (
			t && i.addEventListener('blocked', r => t(r.oldVersion, r)),
			Z(i).then(() => {})
		);
	}
	var wa = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'],
		Sa = ['put', 'add', 'delete', 'clear'],
		Ot = new Map();
	function xr(e, t) {
		if (!(e instanceof IDBDatabase && !(t in e) && typeof t == 'string'))
			return;
		if (Ot.get(t)) return Ot.get(t);
		let i = t.replace(/FromIndex$/, ''),
			r = t !== i,
			n = Sa.includes(i);
		if (
			!(i in (r ? IDBIndex : IDBObjectStore).prototype) ||
			!(n || wa.includes(i))
		)
			return;
		let a = async function (s, ...o) {
			let c = this.transaction(s, n ? 'readwrite' : 'readonly'),
				l = c.store;
			return (
				r && (l = l.index(o.shift())),
				(await Promise.all([l[i](...o), n && c.done]))[0]
			);
		};
		return Ot.set(t, a), a;
	}
	gr(e => ({
		...e,
		get: (t, i, r) => xr(t, i) || e.get(t, i, r),
		has: (t, i) => !!xr(t, i) || e.has(t, i)
	}));
	var Ca = [
			509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0,
			166, 1, 574, 3, 9, 9, 370, 1, 81, 2, 71, 10, 50, 3, 123, 2, 54, 14,
			32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1,
			45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 3, 0, 158, 11, 6,
			9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 193, 17,
			10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82,
			12, 9, 9, 84, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2,
			1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47,
			15, 406, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2,
			0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 10, 1, 2, 0, 49, 6, 4, 4,
			14, 9, 5351, 0, 7, 14, 13835, 9, 87, 9, 39, 4, 60, 6, 26, 9, 1014,
			0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4706, 45, 3, 22, 543, 4, 4,
			5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0,
			23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 101, 0, 161, 6, 10,
			9, 357, 0, 62, 13, 499, 13, 983, 6, 110, 6, 6, 9, 4759, 9, 787719,
			239
		],
		Cr = [
			0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28,
			4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157,
			19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2,
			14, 2, 6, 2, 1, 68, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5,
			3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11,
			21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28,
			36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14,
			50, 14, 35, 349, 41, 7, 1, 79, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28,
			22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34,
			4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 20, 1, 64, 6, 2, 0,
			2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4,
			0, 19, 0, 13, 4, 159, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185,
			46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43,
			117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38,
			17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 264,
			8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2,
			31, 15, 0, 328, 18, 16, 0, 2, 12, 2, 33, 125, 0, 80, 921, 103, 110,
			18, 195, 2637, 96, 16, 1071, 18, 5, 4026, 582, 8634, 568, 8, 30, 18,
			78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 689, 63, 129, 74, 6, 0,
			67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 43, 8, 8936, 3, 2, 6, 2, 1,
			2, 290, 16, 0, 30, 2, 3, 0, 15, 3, 9, 395, 2309, 106, 6, 12, 4, 8,
			8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2,
			64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24,
			2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7,
			1845, 30, 7, 5, 262, 61, 147, 44, 11, 6, 17, 0, 322, 29, 19, 43,
			485, 27, 757, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3,
			2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0,
			2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3,
			3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421,
			42719, 33, 4153, 7, 221, 3, 5761, 15, 7472, 16, 621, 2467, 541,
			1507, 4938, 6, 4191
		],
		Ea =
			'\u200C\u200D\xB7\u0300-\u036F\u0387\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u0669\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07C0-\u07C9\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09E6-\u09EF\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AE6-\u0AEF\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C00-\u0C04\u0C3C\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0CE6-\u0CEF\u0CF3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D66-\u0D6F\u0D81-\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0E50-\u0E59\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1040-\u1049\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u17E0-\u17E9\u180B-\u180D\u180F-\u1819\u18A9\u1920-\u192B\u1930-\u193B\u1946-\u194F\u19D0-\u19DA\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AB0-\u1ABD\u1ABF-\u1ACE\u1B00-\u1B04\u1B34-\u1B44\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C24-\u1C37\u1C40-\u1C49\u1C50-\u1C59\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DFF\u200C\u200D\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\u30FB\uA620-\uA629\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA82C\uA880\uA881\uA8B4-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F1\uA8FF-\uA909\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9D0-\uA9D9\uA9E5\uA9F0-\uA9F9\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA50-\uAA59\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uABF0-\uABF9\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F\uFF65',
		Er =
			'\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC',
		Ft = {
			3: 'abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile',
			5: 'class enum extends super const export import',
			6: 'enum',
			strict: 'implements interface let package private protected public static yield',
			strictBind: 'eval arguments'
		},
		Vt =
			'break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this',
		ka = {
			5: Vt,
			'5module': Vt + ' export import',
			6: Vt + ' const class extends export import super'
		},
		Aa = /^in(stanceof)?$/,
		Pa = new RegExp('[' + Er + ']'),
		La = new RegExp('[' + Er + Ea + ']');
	function jt(e, t) {
		for (var i = 65536, r = 0; r < t.length; r += 2) {
			if (((i += t[r]), i > e)) return !1;
			if (((i += t[r + 1]), i >= e)) return !0;
		}
		return !1;
	}
	function he(e, t) {
		return e < 65
			? e === 36
			: e < 91
				? !0
				: e < 97
					? e === 95
					: e < 123
						? !0
						: e <= 65535
							? e >= 170 && Pa.test(String.fromCharCode(e))
							: t === !1
								? !1
								: jt(e, Cr);
	}
	function we(e, t) {
		return e < 48
			? e === 36
			: e < 58
				? !0
				: e < 65
					? !1
					: e < 91
						? !0
						: e < 97
							? e === 95
							: e < 123
								? !0
								: e <= 65535
									? e >= 170 &&
										La.test(String.fromCharCode(e))
									: t === !1
										? !1
										: jt(e, Cr) || jt(e, Ca);
	}
	var $ = function (t, i) {
		i === void 0 && (i = {}),
			(this.label = t),
			(this.keyword = i.keyword),
			(this.beforeExpr = !!i.beforeExpr),
			(this.startsExpr = !!i.startsExpr),
			(this.isLoop = !!i.isLoop),
			(this.isAssign = !!i.isAssign),
			(this.prefix = !!i.prefix),
			(this.postfix = !!i.postfix),
			(this.binop = i.binop || null),
			(this.updateContext = null);
	};
	function ee(e, t) {
		return new $(e, { beforeExpr: !0, binop: t });
	}
	var te = { beforeExpr: !0 },
		X = { startsExpr: !0 },
		Wt = {};
	function F(e, t) {
		return t === void 0 && (t = {}), (t.keyword = e), (Wt[e] = new $(e, t));
	}
	var u = {
			num: new $('num', X),
			regexp: new $('regexp', X),
			string: new $('string', X),
			name: new $('name', X),
			privateId: new $('privateId', X),
			eof: new $('eof'),
			bracketL: new $('[', { beforeExpr: !0, startsExpr: !0 }),
			bracketR: new $(']'),
			braceL: new $('{', { beforeExpr: !0, startsExpr: !0 }),
			braceR: new $('}'),
			parenL: new $('(', { beforeExpr: !0, startsExpr: !0 }),
			parenR: new $(')'),
			comma: new $(',', te),
			semi: new $(';', te),
			colon: new $(':', te),
			dot: new $('.'),
			question: new $('?', te),
			questionDot: new $('?.'),
			arrow: new $('=>', te),
			template: new $('template'),
			invalidTemplate: new $('invalidTemplate'),
			ellipsis: new $('...', te),
			backQuote: new $('`', X),
			dollarBraceL: new $('${', { beforeExpr: !0, startsExpr: !0 }),
			eq: new $('=', { beforeExpr: !0, isAssign: !0 }),
			assign: new $('_=', { beforeExpr: !0, isAssign: !0 }),
			incDec: new $('++/--', { prefix: !0, postfix: !0, startsExpr: !0 }),
			prefix: new $('!/~', {
				beforeExpr: !0,
				prefix: !0,
				startsExpr: !0
			}),
			logicalOR: ee('||', 1),
			logicalAND: ee('&&', 2),
			bitwiseOR: ee('|', 3),
			bitwiseXOR: ee('^', 4),
			bitwiseAND: ee('&', 5),
			equality: ee('==/!=/===/!==', 6),
			relational: ee('</>/<=/>=', 7),
			bitShift: ee('<</>>/>>>', 8),
			plusMin: new $('+/-', {
				beforeExpr: !0,
				binop: 9,
				prefix: !0,
				startsExpr: !0
			}),
			modulo: ee('%', 10),
			star: ee('*', 10),
			slash: ee('/', 10),
			starstar: new $('**', { beforeExpr: !0 }),
			coalesce: ee('??', 1),
			_break: F('break'),
			_case: F('case', te),
			_catch: F('catch'),
			_continue: F('continue'),
			_debugger: F('debugger'),
			_default: F('default', te),
			_do: F('do', { isLoop: !0, beforeExpr: !0 }),
			_else: F('else', te),
			_finally: F('finally'),
			_for: F('for', { isLoop: !0 }),
			_function: F('function', X),
			_if: F('if'),
			_return: F('return', te),
			_switch: F('switch'),
			_throw: F('throw', te),
			_try: F('try'),
			_var: F('var'),
			_const: F('const'),
			_while: F('while', { isLoop: !0 }),
			_with: F('with'),
			_new: F('new', { beforeExpr: !0, startsExpr: !0 }),
			_this: F('this', X),
			_super: F('super', X),
			_class: F('class', X),
			_extends: F('extends', te),
			_export: F('export'),
			_import: F('import', X),
			_null: F('null', X),
			_true: F('true', X),
			_false: F('false', X),
			_in: F('in', { beforeExpr: !0, binop: 7 }),
			_instanceof: F('instanceof', { beforeExpr: !0, binop: 7 }),
			_typeof: F('typeof', {
				beforeExpr: !0,
				prefix: !0,
				startsExpr: !0
			}),
			_void: F('void', { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
			_delete: F('delete', { beforeExpr: !0, prefix: !0, startsExpr: !0 })
		},
		ne = /\r\n?|\n|\u2028|\u2029/,
		Ra = new RegExp(ne.source, 'g');
	function Se(e) {
		return e === 10 || e === 13 || e === 8232 || e === 8233;
	}
	function kr(e, t, i) {
		i === void 0 && (i = e.length);
		for (var r = t; r < i; r++) {
			var n = e.charCodeAt(r);
			if (Se(n))
				return r < i - 1 && n === 13 && e.charCodeAt(r + 1) === 10
					? r + 2
					: r + 1;
		}
		return -1;
	}
	var Ar = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/,
		ie = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g,
		Pr = Object.prototype,
		Ia = Pr.hasOwnProperty,
		Ta = Pr.toString,
		Me =
			Object.hasOwn ||
			function (e, t) {
				return Ia.call(e, t);
			},
		_r =
			Array.isArray ||
			function (e) {
				return Ta.call(e) === '[object Array]';
			},
		vr = Object.create(null);
	function ye(e) {
		return (
			vr[e] || (vr[e] = new RegExp('^(?:' + e.replace(/ /g, '|') + ')$'))
		);
	}
	function ge(e) {
		return e <= 65535
			? String.fromCharCode(e)
			: ((e -= 65536),
				String.fromCharCode((e >> 10) + 55296, (e & 1023) + 56320));
	}
	var Na =
			/(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/,
		Te = function (t, i) {
			(this.line = t), (this.column = i);
		};
	Te.prototype.offset = function (t) {
		return new Te(this.line, this.column + t);
	};
	var rt = function (t, i, r) {
		(this.start = i),
			(this.end = r),
			t.sourceFile !== null && (this.source = t.sourceFile);
	};
	function Lr(e, t) {
		for (var i = 1, r = 0; ; ) {
			var n = kr(e, r, t);
			if (n < 0) return new Te(i, t - r);
			++i, (r = n);
		}
	}
	var Ut = {
			ecmaVersion: null,
			sourceType: 'script',
			onInsertedSemicolon: null,
			onTrailingComma: null,
			allowReserved: null,
			allowReturnOutsideFunction: !1,
			allowImportExportEverywhere: !1,
			allowAwaitOutsideFunction: null,
			allowSuperOutsideMethod: null,
			allowHashBang: !1,
			checkPrivateFields: !0,
			locations: !1,
			onToken: null,
			onComment: null,
			ranges: !1,
			program: null,
			sourceFile: null,
			directSourceFile: null,
			preserveParens: !1
		},
		br = !1;
	function Ma(e) {
		var t = {};
		for (var i in Ut) t[i] = e && Me(e, i) ? e[i] : Ut[i];
		if (
			(t.ecmaVersion === 'latest'
				? (t.ecmaVersion = 1e8)
				: t.ecmaVersion == null
					? (!br &&
							typeof console == 'object' &&
							console.warn &&
							((br = !0),
							console.warn(`Since Acorn 8.0.0, options.ecmaVersion is required.
Defaulting to 2020, but this will stop working in the future.`)),
						(t.ecmaVersion = 11))
					: t.ecmaVersion >= 2015 && (t.ecmaVersion -= 2009),
			t.allowReserved == null && (t.allowReserved = t.ecmaVersion < 5),
			(!e || e.allowHashBang == null) &&
				(t.allowHashBang = t.ecmaVersion >= 14),
			_r(t.onToken))
		) {
			var r = t.onToken;
			t.onToken = function (n) {
				return r.push(n);
			};
		}
		return _r(t.onComment) && (t.onComment = Da(t, t.onComment)), t;
	}
	function Da(e, t) {
		return function (i, r, n, a, s, o) {
			var c = { type: i ? 'Block' : 'Line', value: r, start: n, end: a };
			e.locations && (c.loc = new rt(this, s, o)),
				e.ranges && (c.range = [n, a]),
				t.push(c);
		};
	}
	var Ne = 1,
		Ce = 2,
		zt = 4,
		Rr = 8,
		Ir = 16,
		Tr = 32,
		qt = 64,
		Nr = 128,
		De = 256,
		Gt = Ne | Ce | De;
	function Kt(e, t) {
		return Ce | (e ? zt : 0) | (t ? Rr : 0);
	}
	var et = 0,
		Qt = 1,
		fe = 2,
		Mr = 3,
		Dr = 4,
		Or = 5,
		q = function (t, i, r) {
			(this.options = t = Ma(t)),
				(this.sourceFile = t.sourceFile),
				(this.keywords = ye(
					ka[
						t.ecmaVersion >= 6
							? 6
							: t.sourceType === 'module'
								? '5module'
								: 5
					]
				));
			var n = '';
			t.allowReserved !== !0 &&
				((n = Ft[t.ecmaVersion >= 6 ? 6 : t.ecmaVersion === 5 ? 5 : 3]),
				t.sourceType === 'module' && (n += ' await')),
				(this.reservedWords = ye(n));
			var a = (n ? n + ' ' : '') + Ft.strict;
			(this.reservedWordsStrict = ye(a)),
				(this.reservedWordsStrictBind = ye(a + ' ' + Ft.strictBind)),
				(this.input = String(i)),
				(this.containsEsc = !1),
				r
					? ((this.pos = r),
						(this.lineStart =
							this.input.lastIndexOf(
								`
`,
								r - 1
							) + 1),
						(this.curLine = this.input
							.slice(0, this.lineStart)
							.split(ne).length))
					: ((this.pos = this.lineStart = 0), (this.curLine = 1)),
				(this.type = u.eof),
				(this.value = null),
				(this.start = this.end = this.pos),
				(this.startLoc = this.endLoc = this.curPosition()),
				(this.lastTokEndLoc = this.lastTokStartLoc = null),
				(this.lastTokStart = this.lastTokEnd = this.pos),
				(this.context = this.initialContext()),
				(this.exprAllowed = !0),
				(this.inModule = t.sourceType === 'module'),
				(this.strict = this.inModule || this.strictDirective(this.pos)),
				(this.potentialArrowAt = -1),
				(this.potentialArrowInForAwait = !1),
				(this.yieldPos = this.awaitPos = this.awaitIdentPos = 0),
				(this.labels = []),
				(this.undefinedExports = Object.create(null)),
				this.pos === 0 &&
					t.allowHashBang &&
					this.input.slice(0, 2) === '#!' &&
					this.skipLineComment(2),
				(this.scopeStack = []),
				this.enterScope(Ne),
				(this.regexpState = null),
				(this.privateNameStack = []);
		},
		ue = {
			inFunction: { configurable: !0 },
			inGenerator: { configurable: !0 },
			inAsync: { configurable: !0 },
			canAwait: { configurable: !0 },
			allowSuper: { configurable: !0 },
			allowDirectSuper: { configurable: !0 },
			treatFunctionsAsVar: { configurable: !0 },
			allowNewDotTarget: { configurable: !0 },
			inClassStaticBlock: { configurable: !0 }
		};
	q.prototype.parse = function () {
		var t = this.options.program || this.startNode();
		return this.nextToken(), this.parseTopLevel(t);
	};
	ue.inFunction.get = function () {
		return (this.currentVarScope().flags & Ce) > 0;
	};
	ue.inGenerator.get = function () {
		return (
			(this.currentVarScope().flags & Rr) > 0 &&
			!this.currentVarScope().inClassFieldInit
		);
	};
	ue.inAsync.get = function () {
		return (
			(this.currentVarScope().flags & zt) > 0 &&
			!this.currentVarScope().inClassFieldInit
		);
	};
	ue.canAwait.get = function () {
		for (var e = this.scopeStack.length - 1; e >= 0; e--) {
			var t = this.scopeStack[e];
			if (t.inClassFieldInit || t.flags & De) return !1;
			if (t.flags & Ce) return (t.flags & zt) > 0;
		}
		return (
			(this.inModule && this.options.ecmaVersion >= 13) ||
			this.options.allowAwaitOutsideFunction
		);
	};
	ue.allowSuper.get = function () {
		var e = this.currentThisScope(),
			t = e.flags,
			i = e.inClassFieldInit;
		return (t & qt) > 0 || i || this.options.allowSuperOutsideMethod;
	};
	ue.allowDirectSuper.get = function () {
		return (this.currentThisScope().flags & Nr) > 0;
	};
	ue.treatFunctionsAsVar.get = function () {
		return this.treatFunctionsAsVarInScope(this.currentScope());
	};
	ue.allowNewDotTarget.get = function () {
		var e = this.currentThisScope(),
			t = e.flags,
			i = e.inClassFieldInit;
		return (t & (Ce | De)) > 0 || i;
	};
	ue.inClassStaticBlock.get = function () {
		return (this.currentVarScope().flags & De) > 0;
	};
	q.extend = function () {
		for (var t = [], i = arguments.length; i--; ) t[i] = arguments[i];
		for (var r = this, n = 0; n < t.length; n++) r = t[n](r);
		return r;
	};
	q.parse = function (t, i) {
		return new this(i, t).parse();
	};
	q.parseExpressionAt = function (t, i, r) {
		var n = new this(r, t, i);
		return n.nextToken(), n.parseExpression();
	};
	q.tokenizer = function (t, i) {
		return new this(i, t);
	};
	Object.defineProperties(q.prototype, ue);
	var K = q.prototype,
		Oa = /^(?:'((?:\\.|[^'\\])*?)'|"((?:\\.|[^"\\])*?)")/;
	K.strictDirective = function (e) {
		if (this.options.ecmaVersion < 5) return !1;
		for (;;) {
			(ie.lastIndex = e), (e += ie.exec(this.input)[0].length);
			var t = Oa.exec(this.input.slice(e));
			if (!t) return !1;
			if ((t[1] || t[2]) === 'use strict') {
				ie.lastIndex = e + t[0].length;
				var i = ie.exec(this.input),
					r = i.index + i[0].length,
					n = this.input.charAt(r);
				return (
					n === ';' ||
					n === '}' ||
					(ne.test(i[0]) &&
						!(
							/[(`.[+\-/*%<>=,?^&]/.test(n) ||
							(n === '!' && this.input.charAt(r + 1) === '=')
						))
				);
			}
			(e += t[0].length),
				(ie.lastIndex = e),
				(e += ie.exec(this.input)[0].length),
				this.input[e] === ';' && e++;
		}
	};
	K.eat = function (e) {
		return this.type === e ? (this.next(), !0) : !1;
	};
	K.isContextual = function (e) {
		return this.type === u.name && this.value === e && !this.containsEsc;
	};
	K.eatContextual = function (e) {
		return this.isContextual(e) ? (this.next(), !0) : !1;
	};
	K.expectContextual = function (e) {
		this.eatContextual(e) || this.unexpected();
	};
	K.canInsertSemicolon = function () {
		return (
			this.type === u.eof ||
			this.type === u.braceR ||
			ne.test(this.input.slice(this.lastTokEnd, this.start))
		);
	};
	K.insertSemicolon = function () {
		if (this.canInsertSemicolon())
			return (
				this.options.onInsertedSemicolon &&
					this.options.onInsertedSemicolon(
						this.lastTokEnd,
						this.lastTokEndLoc
					),
				!0
			);
	};
	K.semicolon = function () {
		!this.eat(u.semi) && !this.insertSemicolon() && this.unexpected();
	};
	K.afterTrailingComma = function (e, t) {
		if (this.type === e)
			return (
				this.options.onTrailingComma &&
					this.options.onTrailingComma(
						this.lastTokStart,
						this.lastTokStartLoc
					),
				t || this.next(),
				!0
			);
	};
	K.expect = function (e) {
		this.eat(e) || this.unexpected();
	};
	K.unexpected = function (e) {
		this.raise(e ?? this.start, 'Unexpected token');
	};
	var nt = function () {
		this.shorthandAssign =
			this.trailingComma =
			this.parenthesizedAssign =
			this.parenthesizedBind =
			this.doubleProto =
				-1;
	};
	K.checkPatternErrors = function (e, t) {
		if (e) {
			e.trailingComma > -1 &&
				this.raiseRecoverable(
					e.trailingComma,
					'Comma is not permitted after the rest element'
				);
			var i = t ? e.parenthesizedAssign : e.parenthesizedBind;
			i > -1 &&
				this.raiseRecoverable(
					i,
					t ? 'Assigning to rvalue' : 'Parenthesized pattern'
				);
		}
	};
	K.checkExpressionErrors = function (e, t) {
		if (!e) return !1;
		var i = e.shorthandAssign,
			r = e.doubleProto;
		if (!t) return i >= 0 || r >= 0;
		i >= 0 &&
			this.raise(
				i,
				'Shorthand property assignments are valid only in destructuring patterns'
			),
			r >= 0 &&
				this.raiseRecoverable(r, 'Redefinition of __proto__ property');
	};
	K.checkYieldAwaitInDefaultParams = function () {
		this.yieldPos &&
			(!this.awaitPos || this.yieldPos < this.awaitPos) &&
			this.raise(
				this.yieldPos,
				'Yield expression cannot be a default value'
			),
			this.awaitPos &&
				this.raise(
					this.awaitPos,
					'Await expression cannot be a default value'
				);
	};
	K.isSimpleAssignTarget = function (e) {
		return e.type === 'ParenthesizedExpression'
			? this.isSimpleAssignTarget(e.expression)
			: e.type === 'Identifier' || e.type === 'MemberExpression';
	};
	var R = q.prototype;
	R.parseTopLevel = function (e) {
		var t = Object.create(null);
		for (e.body || (e.body = []); this.type !== u.eof; ) {
			var i = this.parseStatement(null, !0, t);
			e.body.push(i);
		}
		if (this.inModule)
			for (
				var r = 0, n = Object.keys(this.undefinedExports);
				r < n.length;
				r += 1
			) {
				var a = n[r];
				this.raiseRecoverable(
					this.undefinedExports[a].start,
					"Export '" + a + "' is not defined"
				);
			}
		return (
			this.adaptDirectivePrologue(e.body),
			this.next(),
			(e.sourceType = this.options.sourceType),
			this.finishNode(e, 'Program')
		);
	};
	var Yt = { kind: 'loop' },
		Ba = { kind: 'switch' };
	R.isLet = function (e) {
		if (this.options.ecmaVersion < 6 || !this.isContextual('let'))
			return !1;
		ie.lastIndex = this.pos;
		var t = ie.exec(this.input),
			i = this.pos + t[0].length,
			r = this.input.charCodeAt(i);
		if (r === 91 || r === 92) return !0;
		if (e) return !1;
		if (r === 123 || (r > 55295 && r < 56320)) return !0;
		if (he(r, !0)) {
			for (var n = i + 1; we((r = this.input.charCodeAt(n)), !0); ) ++n;
			if (r === 92 || (r > 55295 && r < 56320)) return !0;
			var a = this.input.slice(i, n);
			if (!Aa.test(a)) return !0;
		}
		return !1;
	};
	R.isAsyncFunction = function () {
		if (this.options.ecmaVersion < 8 || !this.isContextual('async'))
			return !1;
		ie.lastIndex = this.pos;
		var e = ie.exec(this.input),
			t = this.pos + e[0].length,
			i;
		return (
			!ne.test(this.input.slice(this.pos, t)) &&
			this.input.slice(t, t + 8) === 'function' &&
			(t + 8 === this.input.length ||
				!(
					we((i = this.input.charCodeAt(t + 8))) ||
					(i > 55295 && i < 56320)
				))
		);
	};
	R.parseStatement = function (e, t, i) {
		var r = this.type,
			n = this.startNode(),
			a;
		switch ((this.isLet(e) && ((r = u._var), (a = 'let')), r)) {
			case u._break:
			case u._continue:
				return this.parseBreakContinueStatement(n, r.keyword);
			case u._debugger:
				return this.parseDebuggerStatement(n);
			case u._do:
				return this.parseDoStatement(n);
			case u._for:
				return this.parseForStatement(n);
			case u._function:
				return (
					e &&
						(this.strict || (e !== 'if' && e !== 'label')) &&
						this.options.ecmaVersion >= 6 &&
						this.unexpected(),
					this.parseFunctionStatement(n, !1, !e)
				);
			case u._class:
				return e && this.unexpected(), this.parseClass(n, !0);
			case u._if:
				return this.parseIfStatement(n);
			case u._return:
				return this.parseReturnStatement(n);
			case u._switch:
				return this.parseSwitchStatement(n);
			case u._throw:
				return this.parseThrowStatement(n);
			case u._try:
				return this.parseTryStatement(n);
			case u._const:
			case u._var:
				return (
					(a = a || this.value),
					e && a !== 'var' && this.unexpected(),
					this.parseVarStatement(n, a)
				);
			case u._while:
				return this.parseWhileStatement(n);
			case u._with:
				return this.parseWithStatement(n);
			case u.braceL:
				return this.parseBlock(!0, n);
			case u.semi:
				return this.parseEmptyStatement(n);
			case u._export:
			case u._import:
				if (this.options.ecmaVersion > 10 && r === u._import) {
					ie.lastIndex = this.pos;
					var s = ie.exec(this.input),
						o = this.pos + s[0].length,
						c = this.input.charCodeAt(o);
					if (c === 40 || c === 46)
						return this.parseExpressionStatement(
							n,
							this.parseExpression()
						);
				}
				return (
					this.options.allowImportExportEverywhere ||
						(t ||
							this.raise(
								this.start,
								"'import' and 'export' may only appear at the top level"
							),
						this.inModule ||
							this.raise(
								this.start,
								"'import' and 'export' may appear only with 'sourceType: module'"
							)),
					r === u._import
						? this.parseImport(n)
						: this.parseExport(n, i)
				);
			default:
				if (this.isAsyncFunction())
					return (
						e && this.unexpected(),
						this.next(),
						this.parseFunctionStatement(n, !0, !e)
					);
				var l = this.value,
					p = this.parseExpression();
				return r === u.name &&
					p.type === 'Identifier' &&
					this.eat(u.colon)
					? this.parseLabeledStatement(n, l, p, e)
					: this.parseExpressionStatement(n, p);
		}
	};
	R.parseBreakContinueStatement = function (e, t) {
		var i = t === 'break';
		this.next(),
			this.eat(u.semi) || this.insertSemicolon()
				? (e.label = null)
				: this.type !== u.name
					? this.unexpected()
					: ((e.label = this.parseIdent()), this.semicolon());
		for (var r = 0; r < this.labels.length; ++r) {
			var n = this.labels[r];
			if (
				(e.label == null || n.name === e.label.name) &&
				((n.kind != null && (i || n.kind === 'loop')) || (e.label && i))
			)
				break;
		}
		return (
			r === this.labels.length && this.raise(e.start, 'Unsyntactic ' + t),
			this.finishNode(e, i ? 'BreakStatement' : 'ContinueStatement')
		);
	};
	R.parseDebuggerStatement = function (e) {
		return (
			this.next(),
			this.semicolon(),
			this.finishNode(e, 'DebuggerStatement')
		);
	};
	R.parseDoStatement = function (e) {
		return (
			this.next(),
			this.labels.push(Yt),
			(e.body = this.parseStatement('do')),
			this.labels.pop(),
			this.expect(u._while),
			(e.test = this.parseParenExpression()),
			this.options.ecmaVersion >= 6 ? this.eat(u.semi) : this.semicolon(),
			this.finishNode(e, 'DoWhileStatement')
		);
	};
	R.parseForStatement = function (e) {
		this.next();
		var t =
			this.options.ecmaVersion >= 9 &&
			this.canAwait &&
			this.eatContextual('await')
				? this.lastTokStart
				: -1;
		if (
			(this.labels.push(Yt),
			this.enterScope(0),
			this.expect(u.parenL),
			this.type === u.semi)
		)
			return t > -1 && this.unexpected(t), this.parseFor(e, null);
		var i = this.isLet();
		if (this.type === u._var || this.type === u._const || i) {
			var r = this.startNode(),
				n = i ? 'let' : this.value;
			return (
				this.next(),
				this.parseVar(r, !0, n),
				this.finishNode(r, 'VariableDeclaration'),
				(this.type === u._in ||
					(this.options.ecmaVersion >= 6 &&
						this.isContextual('of'))) &&
				r.declarations.length === 1
					? (this.options.ecmaVersion >= 9 &&
							(this.type === u._in
								? t > -1 && this.unexpected(t)
								: (e.await = t > -1)),
						this.parseForIn(e, r))
					: (t > -1 && this.unexpected(t), this.parseFor(e, r))
			);
		}
		var a = this.isContextual('let'),
			s = !1,
			o = new nt(),
			c = this.parseExpression(t > -1 ? 'await' : !0, o);
		return this.type === u._in ||
			(s = this.options.ecmaVersion >= 6 && this.isContextual('of'))
			? (this.options.ecmaVersion >= 9 &&
					(this.type === u._in
						? t > -1 && this.unexpected(t)
						: (e.await = t > -1)),
				a &&
					s &&
					this.raise(
						c.start,
						"The left-hand side of a for-of loop may not start with 'let'."
					),
				this.toAssignable(c, !1, o),
				this.checkLValPattern(c),
				this.parseForIn(e, c))
			: (this.checkExpressionErrors(o, !0),
				t > -1 && this.unexpected(t),
				this.parseFor(e, c));
	};
	R.parseFunctionStatement = function (e, t, i) {
		return this.next(), this.parseFunction(e, Ie | (i ? 0 : Ht), !1, t);
	};
	R.parseIfStatement = function (e) {
		return (
			this.next(),
			(e.test = this.parseParenExpression()),
			(e.consequent = this.parseStatement('if')),
			(e.alternate = this.eat(u._else)
				? this.parseStatement('if')
				: null),
			this.finishNode(e, 'IfStatement')
		);
	};
	R.parseReturnStatement = function (e) {
		return (
			!this.inFunction &&
				!this.options.allowReturnOutsideFunction &&
				this.raise(this.start, "'return' outside of function"),
			this.next(),
			this.eat(u.semi) || this.insertSemicolon()
				? (e.argument = null)
				: ((e.argument = this.parseExpression()), this.semicolon()),
			this.finishNode(e, 'ReturnStatement')
		);
	};
	R.parseSwitchStatement = function (e) {
		this.next(),
			(e.discriminant = this.parseParenExpression()),
			(e.cases = []),
			this.expect(u.braceL),
			this.labels.push(Ba),
			this.enterScope(0);
		for (var t, i = !1; this.type !== u.braceR; )
			if (this.type === u._case || this.type === u._default) {
				var r = this.type === u._case;
				t && this.finishNode(t, 'SwitchCase'),
					e.cases.push((t = this.startNode())),
					(t.consequent = []),
					this.next(),
					r
						? (t.test = this.parseExpression())
						: (i &&
								this.raiseRecoverable(
									this.lastTokStart,
									'Multiple default clauses'
								),
							(i = !0),
							(t.test = null)),
					this.expect(u.colon);
			} else
				t || this.unexpected(),
					t.consequent.push(this.parseStatement(null));
		return (
			this.exitScope(),
			t && this.finishNode(t, 'SwitchCase'),
			this.next(),
			this.labels.pop(),
			this.finishNode(e, 'SwitchStatement')
		);
	};
	R.parseThrowStatement = function (e) {
		return (
			this.next(),
			ne.test(this.input.slice(this.lastTokEnd, this.start)) &&
				this.raise(this.lastTokEnd, 'Illegal newline after throw'),
			(e.argument = this.parseExpression()),
			this.semicolon(),
			this.finishNode(e, 'ThrowStatement')
		);
	};
	var Fa = [];
	R.parseCatchClauseParam = function () {
		var e = this.parseBindingAtom(),
			t = e.type === 'Identifier';
		return (
			this.enterScope(t ? Tr : 0),
			this.checkLValPattern(e, t ? Dr : fe),
			this.expect(u.parenR),
			e
		);
	};
	R.parseTryStatement = function (e) {
		if (
			(this.next(),
			(e.block = this.parseBlock()),
			(e.handler = null),
			this.type === u._catch)
		) {
			var t = this.startNode();
			this.next(),
				this.eat(u.parenL)
					? (t.param = this.parseCatchClauseParam())
					: (this.options.ecmaVersion < 10 && this.unexpected(),
						(t.param = null),
						this.enterScope(0)),
				(t.body = this.parseBlock(!1)),
				this.exitScope(),
				(e.handler = this.finishNode(t, 'CatchClause'));
		}
		return (
			(e.finalizer = this.eat(u._finally) ? this.parseBlock() : null),
			!e.handler &&
				!e.finalizer &&
				this.raise(e.start, 'Missing catch or finally clause'),
			this.finishNode(e, 'TryStatement')
		);
	};
	R.parseVarStatement = function (e, t, i) {
		return (
			this.next(),
			this.parseVar(e, !1, t, i),
			this.semicolon(),
			this.finishNode(e, 'VariableDeclaration')
		);
	};
	R.parseWhileStatement = function (e) {
		return (
			this.next(),
			(e.test = this.parseParenExpression()),
			this.labels.push(Yt),
			(e.body = this.parseStatement('while')),
			this.labels.pop(),
			this.finishNode(e, 'WhileStatement')
		);
	};
	R.parseWithStatement = function (e) {
		return (
			this.strict && this.raise(this.start, "'with' in strict mode"),
			this.next(),
			(e.object = this.parseParenExpression()),
			(e.body = this.parseStatement('with')),
			this.finishNode(e, 'WithStatement')
		);
	};
	R.parseEmptyStatement = function (e) {
		return this.next(), this.finishNode(e, 'EmptyStatement');
	};
	R.parseLabeledStatement = function (e, t, i, r) {
		for (var n = 0, a = this.labels; n < a.length; n += 1) {
			var s = a[n];
			s.name === t &&
				this.raise(i.start, "Label '" + t + "' is already declared");
		}
		for (
			var o = this.type.isLoop
					? 'loop'
					: this.type === u._switch
						? 'switch'
						: null,
				c = this.labels.length - 1;
			c >= 0;
			c--
		) {
			var l = this.labels[c];
			if (l.statementStart === e.start)
				(l.statementStart = this.start), (l.kind = o);
			else break;
		}
		return (
			this.labels.push({ name: t, kind: o, statementStart: this.start }),
			(e.body = this.parseStatement(
				r ? (r.indexOf('label') === -1 ? r + 'label' : r) : 'label'
			)),
			this.labels.pop(),
			(e.label = i),
			this.finishNode(e, 'LabeledStatement')
		);
	};
	R.parseExpressionStatement = function (e, t) {
		return (
			(e.expression = t),
			this.semicolon(),
			this.finishNode(e, 'ExpressionStatement')
		);
	};
	R.parseBlock = function (e, t, i) {
		for (
			e === void 0 && (e = !0),
				t === void 0 && (t = this.startNode()),
				t.body = [],
				this.expect(u.braceL),
				e && this.enterScope(0);
			this.type !== u.braceR;

		) {
			var r = this.parseStatement(null);
			t.body.push(r);
		}
		return (
			i && (this.strict = !1),
			this.next(),
			e && this.exitScope(),
			this.finishNode(t, 'BlockStatement')
		);
	};
	R.parseFor = function (e, t) {
		return (
			(e.init = t),
			this.expect(u.semi),
			(e.test = this.type === u.semi ? null : this.parseExpression()),
			this.expect(u.semi),
			(e.update = this.type === u.parenR ? null : this.parseExpression()),
			this.expect(u.parenR),
			(e.body = this.parseStatement('for')),
			this.exitScope(),
			this.labels.pop(),
			this.finishNode(e, 'ForStatement')
		);
	};
	R.parseForIn = function (e, t) {
		var i = this.type === u._in;
		return (
			this.next(),
			t.type === 'VariableDeclaration' &&
				t.declarations[0].init != null &&
				(!i ||
					this.options.ecmaVersion < 8 ||
					this.strict ||
					t.kind !== 'var' ||
					t.declarations[0].id.type !== 'Identifier') &&
				this.raise(
					t.start,
					(i ? 'for-in' : 'for-of') +
						' loop variable declaration may not have an initializer'
				),
			(e.left = t),
			(e.right = i ? this.parseExpression() : this.parseMaybeAssign()),
			this.expect(u.parenR),
			(e.body = this.parseStatement('for')),
			this.exitScope(),
			this.labels.pop(),
			this.finishNode(e, i ? 'ForInStatement' : 'ForOfStatement')
		);
	};
	R.parseVar = function (e, t, i, r) {
		for (e.declarations = [], e.kind = i; ; ) {
			var n = this.startNode();
			if (
				(this.parseVarId(n, i),
				this.eat(u.eq)
					? (n.init = this.parseMaybeAssign(t))
					: !r &&
						  i === 'const' &&
						  !(
								this.type === u._in ||
								(this.options.ecmaVersion >= 6 &&
									this.isContextual('of'))
						  )
						? this.unexpected()
						: !r &&
							  n.id.type !== 'Identifier' &&
							  !(
									t &&
									(this.type === u._in ||
										this.isContextual('of'))
							  )
							? this.raise(
									this.lastTokEnd,
									'Complex binding patterns require an initialization value'
								)
							: (n.init = null),
				e.declarations.push(this.finishNode(n, 'VariableDeclarator')),
				!this.eat(u.comma))
			)
				break;
		}
		return e;
	};
	R.parseVarId = function (e, t) {
		(e.id = this.parseBindingAtom()),
			this.checkLValPattern(e.id, t === 'var' ? Qt : fe, !1);
	};
	var Ie = 1,
		Ht = 2,
		Br = 4;
	R.parseFunction = function (e, t, i, r, n) {
		this.initFunction(e),
			(this.options.ecmaVersion >= 9 ||
				(this.options.ecmaVersion >= 6 && !r)) &&
				(this.type === u.star && t & Ht && this.unexpected(),
				(e.generator = this.eat(u.star))),
			this.options.ecmaVersion >= 8 && (e.async = !!r),
			t & Ie &&
				((e.id =
					t & Br && this.type !== u.name ? null : this.parseIdent()),
				e.id &&
					!(t & Ht) &&
					this.checkLValSimple(
						e.id,
						this.strict || e.generator || e.async
							? this.treatFunctionsAsVar
								? Qt
								: fe
							: Mr
					));
		var a = this.yieldPos,
			s = this.awaitPos,
			o = this.awaitIdentPos;
		return (
			(this.yieldPos = 0),
			(this.awaitPos = 0),
			(this.awaitIdentPos = 0),
			this.enterScope(Kt(e.async, e.generator)),
			t & Ie || (e.id = this.type === u.name ? this.parseIdent() : null),
			this.parseFunctionParams(e),
			this.parseFunctionBody(e, i, !1, n),
			(this.yieldPos = a),
			(this.awaitPos = s),
			(this.awaitIdentPos = o),
			this.finishNode(
				e,
				t & Ie ? 'FunctionDeclaration' : 'FunctionExpression'
			)
		);
	};
	R.parseFunctionParams = function (e) {
		this.expect(u.parenL),
			(e.params = this.parseBindingList(
				u.parenR,
				!1,
				this.options.ecmaVersion >= 8
			)),
			this.checkYieldAwaitInDefaultParams();
	};
	R.parseClass = function (e, t) {
		this.next();
		var i = this.strict;
		(this.strict = !0), this.parseClassId(e, t), this.parseClassSuper(e);
		var r = this.enterClassBody(),
			n = this.startNode(),
			a = !1;
		for (n.body = [], this.expect(u.braceL); this.type !== u.braceR; ) {
			var s = this.parseClassElement(e.superClass !== null);
			s &&
				(n.body.push(s),
				s.type === 'MethodDefinition' && s.kind === 'constructor'
					? (a &&
							this.raiseRecoverable(
								s.start,
								'Duplicate constructor in the same class'
							),
						(a = !0))
					: s.key &&
						s.key.type === 'PrivateIdentifier' &&
						Va(r, s) &&
						this.raiseRecoverable(
							s.key.start,
							"Identifier '#" +
								s.key.name +
								"' has already been declared"
						));
		}
		return (
			(this.strict = i),
			this.next(),
			(e.body = this.finishNode(n, 'ClassBody')),
			this.exitClassBody(),
			this.finishNode(e, t ? 'ClassDeclaration' : 'ClassExpression')
		);
	};
	R.parseClassElement = function (e) {
		if (this.eat(u.semi)) return null;
		var t = this.options.ecmaVersion,
			i = this.startNode(),
			r = '',
			n = !1,
			a = !1,
			s = 'method',
			o = !1;
		if (this.eatContextual('static')) {
			if (t >= 13 && this.eat(u.braceL))
				return this.parseClassStaticBlock(i), i;
			this.isClassElementNameStart() || this.type === u.star
				? (o = !0)
				: (r = 'static');
		}
		if (
			((i.static = o),
			!r &&
				t >= 8 &&
				this.eatContextual('async') &&
				((this.isClassElementNameStart() || this.type === u.star) &&
				!this.canInsertSemicolon()
					? (a = !0)
					: (r = 'async')),
			!r && (t >= 9 || !a) && this.eat(u.star) && (n = !0),
			!r && !a && !n)
		) {
			var c = this.value;
			(this.eatContextual('get') || this.eatContextual('set')) &&
				(this.isClassElementNameStart() ? (s = c) : (r = c));
		}
		if (
			(r
				? ((i.computed = !1),
					(i.key = this.startNodeAt(
						this.lastTokStart,
						this.lastTokStartLoc
					)),
					(i.key.name = r),
					this.finishNode(i.key, 'Identifier'))
				: this.parseClassElementName(i),
			t < 13 || this.type === u.parenL || s !== 'method' || n || a)
		) {
			var l = !i.static && tt(i, 'constructor'),
				p = l && e;
			l &&
				s !== 'method' &&
				this.raise(
					i.key.start,
					"Constructor can't have get/set modifier"
				),
				(i.kind = l ? 'constructor' : s),
				this.parseClassMethod(i, n, a, p);
		} else this.parseClassField(i);
		return i;
	};
	R.isClassElementNameStart = function () {
		return (
			this.type === u.name ||
			this.type === u.privateId ||
			this.type === u.num ||
			this.type === u.string ||
			this.type === u.bracketL ||
			this.type.keyword
		);
	};
	R.parseClassElementName = function (e) {
		this.type === u.privateId
			? (this.value === 'constructor' &&
					this.raise(
						this.start,
						"Classes can't have an element named '#constructor'"
					),
				(e.computed = !1),
				(e.key = this.parsePrivateIdent()))
			: this.parsePropertyName(e);
	};
	R.parseClassMethod = function (e, t, i, r) {
		var n = e.key;
		e.kind === 'constructor'
			? (t && this.raise(n.start, "Constructor can't be a generator"),
				i &&
					this.raise(n.start, "Constructor can't be an async method"))
			: e.static &&
				tt(e, 'prototype') &&
				this.raise(
					n.start,
					'Classes may not have a static property named prototype'
				);
		var a = (e.value = this.parseMethod(t, i, r));
		return (
			e.kind === 'get' &&
				a.params.length !== 0 &&
				this.raiseRecoverable(a.start, 'getter should have no params'),
			e.kind === 'set' &&
				a.params.length !== 1 &&
				this.raiseRecoverable(
					a.start,
					'setter should have exactly one param'
				),
			e.kind === 'set' &&
				a.params[0].type === 'RestElement' &&
				this.raiseRecoverable(
					a.params[0].start,
					'Setter cannot use rest params'
				),
			this.finishNode(e, 'MethodDefinition')
		);
	};
	R.parseClassField = function (e) {
		if (
			(tt(e, 'constructor')
				? this.raise(
						e.key.start,
						"Classes can't have a field named 'constructor'"
					)
				: e.static &&
					tt(e, 'prototype') &&
					this.raise(
						e.key.start,
						"Classes can't have a static field named 'prototype'"
					),
			this.eat(u.eq))
		) {
			var t = this.currentThisScope(),
				i = t.inClassFieldInit;
			(t.inClassFieldInit = !0),
				(e.value = this.parseMaybeAssign()),
				(t.inClassFieldInit = i);
		} else e.value = null;
		return this.semicolon(), this.finishNode(e, 'PropertyDefinition');
	};
	R.parseClassStaticBlock = function (e) {
		e.body = [];
		var t = this.labels;
		for (
			this.labels = [], this.enterScope(De | qt);
			this.type !== u.braceR;

		) {
			var i = this.parseStatement(null);
			e.body.push(i);
		}
		return (
			this.next(),
			this.exitScope(),
			(this.labels = t),
			this.finishNode(e, 'StaticBlock')
		);
	};
	R.parseClassId = function (e, t) {
		this.type === u.name
			? ((e.id = this.parseIdent()),
				t && this.checkLValSimple(e.id, fe, !1))
			: (t === !0 && this.unexpected(), (e.id = null));
	};
	R.parseClassSuper = function (e) {
		e.superClass = this.eat(u._extends)
			? this.parseExprSubscripts(null, !1)
			: null;
	};
	R.enterClassBody = function () {
		var e = { declared: Object.create(null), used: [] };
		return this.privateNameStack.push(e), e.declared;
	};
	R.exitClassBody = function () {
		var e = this.privateNameStack.pop(),
			t = e.declared,
			i = e.used;
		if (this.options.checkPrivateFields)
			for (
				var r = this.privateNameStack.length,
					n = r === 0 ? null : this.privateNameStack[r - 1],
					a = 0;
				a < i.length;
				++a
			) {
				var s = i[a];
				Me(t, s.name) ||
					(n
						? n.used.push(s)
						: this.raiseRecoverable(
								s.start,
								"Private field '#" +
									s.name +
									"' must be declared in an enclosing class"
							));
			}
	};
	function Va(e, t) {
		var i = t.key.name,
			r = e[i],
			n = 'true';
		return (
			t.type === 'MethodDefinition' &&
				(t.kind === 'get' || t.kind === 'set') &&
				(n = (t.static ? 's' : 'i') + t.kind),
			(r === 'iget' && n === 'iset') ||
			(r === 'iset' && n === 'iget') ||
			(r === 'sget' && n === 'sset') ||
			(r === 'sset' && n === 'sget')
				? ((e[i] = 'true'), !1)
				: r
					? !0
					: ((e[i] = n), !1)
		);
	}
	function tt(e, t) {
		var i = e.computed,
			r = e.key;
		return (
			!i &&
			((r.type === 'Identifier' && r.name === t) ||
				(r.type === 'Literal' && r.value === t))
		);
	}
	R.parseExportAllDeclaration = function (e, t) {
		return (
			this.options.ecmaVersion >= 11 &&
				(this.eatContextual('as')
					? ((e.exported = this.parseModuleExportName()),
						this.checkExport(t, e.exported, this.lastTokStart))
					: (e.exported = null)),
			this.expectContextual('from'),
			this.type !== u.string && this.unexpected(),
			(e.source = this.parseExprAtom()),
			this.semicolon(),
			this.finishNode(e, 'ExportAllDeclaration')
		);
	};
	R.parseExport = function (e, t) {
		if ((this.next(), this.eat(u.star)))
			return this.parseExportAllDeclaration(e, t);
		if (this.eat(u._default))
			return (
				this.checkExport(t, 'default', this.lastTokStart),
				(e.declaration = this.parseExportDefaultDeclaration()),
				this.finishNode(e, 'ExportDefaultDeclaration')
			);
		if (this.shouldParseExportStatement())
			(e.declaration = this.parseExportDeclaration(e)),
				e.declaration.type === 'VariableDeclaration'
					? this.checkVariableExport(t, e.declaration.declarations)
					: this.checkExport(
							t,
							e.declaration.id,
							e.declaration.id.start
						),
				(e.specifiers = []),
				(e.source = null);
		else {
			if (
				((e.declaration = null),
				(e.specifiers = this.parseExportSpecifiers(t)),
				this.eatContextual('from'))
			)
				this.type !== u.string && this.unexpected(),
					(e.source = this.parseExprAtom());
			else {
				for (var i = 0, r = e.specifiers; i < r.length; i += 1) {
					var n = r[i];
					this.checkUnreserved(n.local),
						this.checkLocalExport(n.local),
						n.local.type === 'Literal' &&
							this.raise(
								n.local.start,
								'A string literal cannot be used as an exported binding without `from`.'
							);
				}
				e.source = null;
			}
			this.semicolon();
		}
		return this.finishNode(e, 'ExportNamedDeclaration');
	};
	R.parseExportDeclaration = function (e) {
		return this.parseStatement(null);
	};
	R.parseExportDefaultDeclaration = function () {
		var e;
		if (this.type === u._function || (e = this.isAsyncFunction())) {
			var t = this.startNode();
			return (
				this.next(),
				e && this.next(),
				this.parseFunction(t, Ie | Br, !1, e)
			);
		} else if (this.type === u._class) {
			var i = this.startNode();
			return this.parseClass(i, 'nullableID');
		} else {
			var r = this.parseMaybeAssign();
			return this.semicolon(), r;
		}
	};
	R.checkExport = function (e, t, i) {
		e &&
			(typeof t != 'string' &&
				(t = t.type === 'Identifier' ? t.name : t.value),
			Me(e, t) &&
				this.raiseRecoverable(i, "Duplicate export '" + t + "'"),
			(e[t] = !0));
	};
	R.checkPatternExport = function (e, t) {
		var i = t.type;
		if (i === 'Identifier') this.checkExport(e, t, t.start);
		else if (i === 'ObjectPattern')
			for (var r = 0, n = t.properties; r < n.length; r += 1) {
				var a = n[r];
				this.checkPatternExport(e, a);
			}
		else if (i === 'ArrayPattern')
			for (var s = 0, o = t.elements; s < o.length; s += 1) {
				var c = o[s];
				c && this.checkPatternExport(e, c);
			}
		else
			i === 'Property'
				? this.checkPatternExport(e, t.value)
				: i === 'AssignmentPattern'
					? this.checkPatternExport(e, t.left)
					: i === 'RestElement' &&
						this.checkPatternExport(e, t.argument);
	};
	R.checkVariableExport = function (e, t) {
		if (e)
			for (var i = 0, r = t; i < r.length; i += 1) {
				var n = r[i];
				this.checkPatternExport(e, n.id);
			}
	};
	R.shouldParseExportStatement = function () {
		return (
			this.type.keyword === 'var' ||
			this.type.keyword === 'const' ||
			this.type.keyword === 'class' ||
			this.type.keyword === 'function' ||
			this.isLet() ||
			this.isAsyncFunction()
		);
	};
	R.parseExportSpecifier = function (e) {
		var t = this.startNode();
		return (
			(t.local = this.parseModuleExportName()),
			(t.exported = this.eatContextual('as')
				? this.parseModuleExportName()
				: t.local),
			this.checkExport(e, t.exported, t.exported.start),
			this.finishNode(t, 'ExportSpecifier')
		);
	};
	R.parseExportSpecifiers = function (e) {
		var t = [],
			i = !0;
		for (this.expect(u.braceL); !this.eat(u.braceR); ) {
			if (i) i = !1;
			else if ((this.expect(u.comma), this.afterTrailingComma(u.braceR)))
				break;
			t.push(this.parseExportSpecifier(e));
		}
		return t;
	};
	R.parseImport = function (e) {
		return (
			this.next(),
			this.type === u.string
				? ((e.specifiers = Fa), (e.source = this.parseExprAtom()))
				: ((e.specifiers = this.parseImportSpecifiers()),
					this.expectContextual('from'),
					(e.source =
						this.type === u.string
							? this.parseExprAtom()
							: this.unexpected())),
			this.semicolon(),
			this.finishNode(e, 'ImportDeclaration')
		);
	};
	R.parseImportSpecifier = function () {
		var e = this.startNode();
		return (
			(e.imported = this.parseModuleExportName()),
			this.eatContextual('as')
				? (e.local = this.parseIdent())
				: (this.checkUnreserved(e.imported), (e.local = e.imported)),
			this.checkLValSimple(e.local, fe),
			this.finishNode(e, 'ImportSpecifier')
		);
	};
	R.parseImportDefaultSpecifier = function () {
		var e = this.startNode();
		return (
			(e.local = this.parseIdent()),
			this.checkLValSimple(e.local, fe),
			this.finishNode(e, 'ImportDefaultSpecifier')
		);
	};
	R.parseImportNamespaceSpecifier = function () {
		var e = this.startNode();
		return (
			this.next(),
			this.expectContextual('as'),
			(e.local = this.parseIdent()),
			this.checkLValSimple(e.local, fe),
			this.finishNode(e, 'ImportNamespaceSpecifier')
		);
	};
	R.parseImportSpecifiers = function () {
		var e = [],
			t = !0;
		if (
			this.type === u.name &&
			(e.push(this.parseImportDefaultSpecifier()), !this.eat(u.comma))
		)
			return e;
		if (this.type === u.star)
			return e.push(this.parseImportNamespaceSpecifier()), e;
		for (this.expect(u.braceL); !this.eat(u.braceR); ) {
			if (t) t = !1;
			else if ((this.expect(u.comma), this.afterTrailingComma(u.braceR)))
				break;
			e.push(this.parseImportSpecifier());
		}
		return e;
	};
	R.parseModuleExportName = function () {
		if (this.options.ecmaVersion >= 13 && this.type === u.string) {
			var e = this.parseLiteral(this.value);
			return (
				Na.test(e.value) &&
					this.raise(
						e.start,
						'An export name cannot include a lone surrogate.'
					),
				e
			);
		}
		return this.parseIdent(!0);
	};
	R.adaptDirectivePrologue = function (e) {
		for (var t = 0; t < e.length && this.isDirectiveCandidate(e[t]); ++t)
			e[t].directive = e[t].expression.raw.slice(1, -1);
	};
	R.isDirectiveCandidate = function (e) {
		return (
			this.options.ecmaVersion >= 5 &&
			e.type === 'ExpressionStatement' &&
			e.expression.type === 'Literal' &&
			typeof e.expression.value == 'string' &&
			(this.input[e.start] === '"' || this.input[e.start] === "'")
		);
	};
	var ae = q.prototype;
	ae.toAssignable = function (e, t, i) {
		if (this.options.ecmaVersion >= 6 && e)
			switch (e.type) {
				case 'Identifier':
					this.inAsync &&
						e.name === 'await' &&
						this.raise(
							e.start,
							"Cannot use 'await' as identifier inside an async function"
						);
					break;
				case 'ObjectPattern':
				case 'ArrayPattern':
				case 'AssignmentPattern':
				case 'RestElement':
					break;
				case 'ObjectExpression':
					(e.type = 'ObjectPattern'),
						i && this.checkPatternErrors(i, !0);
					for (var r = 0, n = e.properties; r < n.length; r += 1) {
						var a = n[r];
						this.toAssignable(a, t),
							a.type === 'RestElement' &&
								(a.argument.type === 'ArrayPattern' ||
									a.argument.type === 'ObjectPattern') &&
								this.raise(
									a.argument.start,
									'Unexpected token'
								);
					}
					break;
				case 'Property':
					e.kind !== 'init' &&
						this.raise(
							e.key.start,
							"Object pattern can't contain getter or setter"
						),
						this.toAssignable(e.value, t);
					break;
				case 'ArrayExpression':
					(e.type = 'ArrayPattern'),
						i && this.checkPatternErrors(i, !0),
						this.toAssignableList(e.elements, t);
					break;
				case 'SpreadElement':
					(e.type = 'RestElement'),
						this.toAssignable(e.argument, t),
						e.argument.type === 'AssignmentPattern' &&
							this.raise(
								e.argument.start,
								'Rest elements cannot have a default value'
							);
					break;
				case 'AssignmentExpression':
					e.operator !== '=' &&
						this.raise(
							e.left.end,
							"Only '=' operator can be used for specifying default value."
						),
						(e.type = 'AssignmentPattern'),
						delete e.operator,
						this.toAssignable(e.left, t);
					break;
				case 'ParenthesizedExpression':
					this.toAssignable(e.expression, t, i);
					break;
				case 'ChainExpression':
					this.raiseRecoverable(
						e.start,
						'Optional chaining cannot appear in left-hand side'
					);
					break;
				case 'MemberExpression':
					if (!t) break;
				default:
					this.raise(e.start, 'Assigning to rvalue');
			}
		else i && this.checkPatternErrors(i, !0);
		return e;
	};
	ae.toAssignableList = function (e, t) {
		for (var i = e.length, r = 0; r < i; r++) {
			var n = e[r];
			n && this.toAssignable(n, t);
		}
		if (i) {
			var a = e[i - 1];
			this.options.ecmaVersion === 6 &&
				t &&
				a &&
				a.type === 'RestElement' &&
				a.argument.type !== 'Identifier' &&
				this.unexpected(a.argument.start);
		}
		return e;
	};
	ae.parseSpread = function (e) {
		var t = this.startNode();
		return (
			this.next(),
			(t.argument = this.parseMaybeAssign(!1, e)),
			this.finishNode(t, 'SpreadElement')
		);
	};
	ae.parseRestBinding = function () {
		var e = this.startNode();
		return (
			this.next(),
			this.options.ecmaVersion === 6 &&
				this.type !== u.name &&
				this.unexpected(),
			(e.argument = this.parseBindingAtom()),
			this.finishNode(e, 'RestElement')
		);
	};
	ae.parseBindingAtom = function () {
		if (this.options.ecmaVersion >= 6)
			switch (this.type) {
				case u.bracketL:
					var e = this.startNode();
					return (
						this.next(),
						(e.elements = this.parseBindingList(
							u.bracketR,
							!0,
							!0
						)),
						this.finishNode(e, 'ArrayPattern')
					);
				case u.braceL:
					return this.parseObj(!0);
			}
		return this.parseIdent();
	};
	ae.parseBindingList = function (e, t, i, r) {
		for (var n = [], a = !0; !this.eat(e); )
			if (
				(a ? (a = !1) : this.expect(u.comma),
				t && this.type === u.comma)
			)
				n.push(null);
			else {
				if (i && this.afterTrailingComma(e)) break;
				if (this.type === u.ellipsis) {
					var s = this.parseRestBinding();
					this.parseBindingListItem(s),
						n.push(s),
						this.type === u.comma &&
							this.raiseRecoverable(
								this.start,
								'Comma is not permitted after the rest element'
							),
						this.expect(e);
					break;
				} else n.push(this.parseAssignableListItem(r));
			}
		return n;
	};
	ae.parseAssignableListItem = function (e) {
		var t = this.parseMaybeDefault(this.start, this.startLoc);
		return this.parseBindingListItem(t), t;
	};
	ae.parseBindingListItem = function (e) {
		return e;
	};
	ae.parseMaybeDefault = function (e, t, i) {
		if (
			((i = i || this.parseBindingAtom()),
			this.options.ecmaVersion < 6 || !this.eat(u.eq))
		)
			return i;
		var r = this.startNodeAt(e, t);
		return (
			(r.left = i),
			(r.right = this.parseMaybeAssign()),
			this.finishNode(r, 'AssignmentPattern')
		);
	};
	ae.checkLValSimple = function (e, t, i) {
		t === void 0 && (t = et);
		var r = t !== et;
		switch (e.type) {
			case 'Identifier':
				this.strict &&
					this.reservedWordsStrictBind.test(e.name) &&
					this.raiseRecoverable(
						e.start,
						(r ? 'Binding ' : 'Assigning to ') +
							e.name +
							' in strict mode'
					),
					r &&
						(t === fe &&
							e.name === 'let' &&
							this.raiseRecoverable(
								e.start,
								'let is disallowed as a lexically bound name'
							),
						i &&
							(Me(i, e.name) &&
								this.raiseRecoverable(
									e.start,
									'Argument name clash'
								),
							(i[e.name] = !0)),
						t !== Or && this.declareName(e.name, t, e.start));
				break;
			case 'ChainExpression':
				this.raiseRecoverable(
					e.start,
					'Optional chaining cannot appear in left-hand side'
				);
				break;
			case 'MemberExpression':
				r &&
					this.raiseRecoverable(e.start, 'Binding member expression');
				break;
			case 'ParenthesizedExpression':
				return (
					r &&
						this.raiseRecoverable(
							e.start,
							'Binding parenthesized expression'
						),
					this.checkLValSimple(e.expression, t, i)
				);
			default:
				this.raise(
					e.start,
					(r ? 'Binding' : 'Assigning to') + ' rvalue'
				);
		}
	};
	ae.checkLValPattern = function (e, t, i) {
		switch ((t === void 0 && (t = et), e.type)) {
			case 'ObjectPattern':
				for (var r = 0, n = e.properties; r < n.length; r += 1) {
					var a = n[r];
					this.checkLValInnerPattern(a, t, i);
				}
				break;
			case 'ArrayPattern':
				for (var s = 0, o = e.elements; s < o.length; s += 1) {
					var c = o[s];
					c && this.checkLValInnerPattern(c, t, i);
				}
				break;
			default:
				this.checkLValSimple(e, t, i);
		}
	};
	ae.checkLValInnerPattern = function (e, t, i) {
		switch ((t === void 0 && (t = et), e.type)) {
			case 'Property':
				this.checkLValInnerPattern(e.value, t, i);
				break;
			case 'AssignmentPattern':
				this.checkLValPattern(e.left, t, i);
				break;
			case 'RestElement':
				this.checkLValPattern(e.argument, t, i);
				break;
			default:
				this.checkLValPattern(e, t, i);
		}
	};
	var se = function (t, i, r, n, a) {
			(this.token = t),
				(this.isExpr = !!i),
				(this.preserveSpace = !!r),
				(this.override = n),
				(this.generator = !!a);
		},
		W = {
			b_stat: new se('{', !1),
			b_expr: new se('{', !0),
			b_tmpl: new se('${', !1),
			p_stat: new se('(', !1),
			p_expr: new se('(', !0),
			q_tmpl: new se('`', !0, !0, function (e) {
				return e.tryReadTemplateToken();
			}),
			f_stat: new se('function', !1),
			f_expr: new se('function', !0),
			f_expr_gen: new se('function', !0, !1, null, !0),
			f_gen: new se('function', !1, !1, null, !0)
		},
		Ee = q.prototype;
	Ee.initialContext = function () {
		return [W.b_stat];
	};
	Ee.curContext = function () {
		return this.context[this.context.length - 1];
	};
	Ee.braceIsBlock = function (e) {
		var t = this.curContext();
		return t === W.f_expr || t === W.f_stat
			? !0
			: e === u.colon && (t === W.b_stat || t === W.b_expr)
				? !t.isExpr
				: e === u._return || (e === u.name && this.exprAllowed)
					? ne.test(this.input.slice(this.lastTokEnd, this.start))
					: e === u._else ||
						  e === u.semi ||
						  e === u.eof ||
						  e === u.parenR ||
						  e === u.arrow
						? !0
						: e === u.braceL
							? t === W.b_stat
							: e === u._var || e === u._const || e === u.name
								? !1
								: !this.exprAllowed;
	};
	Ee.inGeneratorContext = function () {
		for (var e = this.context.length - 1; e >= 1; e--) {
			var t = this.context[e];
			if (t.token === 'function') return t.generator;
		}
		return !1;
	};
	Ee.updateContext = function (e) {
		var t,
			i = this.type;
		i.keyword && e === u.dot
			? (this.exprAllowed = !1)
			: (t = i.updateContext)
				? t.call(this, e)
				: (this.exprAllowed = i.beforeExpr);
	};
	Ee.overrideContext = function (e) {
		this.curContext() !== e && (this.context[this.context.length - 1] = e);
	};
	u.parenR.updateContext = u.braceR.updateContext = function () {
		if (this.context.length === 1) {
			this.exprAllowed = !0;
			return;
		}
		var e = this.context.pop();
		e === W.b_stat &&
			this.curContext().token === 'function' &&
			(e = this.context.pop()),
			(this.exprAllowed = !e.isExpr);
	};
	u.braceL.updateContext = function (e) {
		this.context.push(this.braceIsBlock(e) ? W.b_stat : W.b_expr),
			(this.exprAllowed = !0);
	};
	u.dollarBraceL.updateContext = function () {
		this.context.push(W.b_tmpl), (this.exprAllowed = !0);
	};
	u.parenL.updateContext = function (e) {
		var t = e === u._if || e === u._for || e === u._with || e === u._while;
		this.context.push(t ? W.p_stat : W.p_expr), (this.exprAllowed = !0);
	};
	u.incDec.updateContext = function () {};
	u._function.updateContext = u._class.updateContext = function (e) {
		e.beforeExpr &&
		e !== u._else &&
		!(e === u.semi && this.curContext() !== W.p_stat) &&
		!(
			e === u._return &&
			ne.test(this.input.slice(this.lastTokEnd, this.start))
		) &&
		!((e === u.colon || e === u.braceL) && this.curContext() === W.b_stat)
			? this.context.push(W.f_expr)
			: this.context.push(W.f_stat),
			(this.exprAllowed = !1);
	};
	u.colon.updateContext = function () {
		this.curContext().token === 'function' && this.context.pop(),
			(this.exprAllowed = !0);
	};
	u.backQuote.updateContext = function () {
		this.curContext() === W.q_tmpl
			? this.context.pop()
			: this.context.push(W.q_tmpl),
			(this.exprAllowed = !1);
	};
	u.star.updateContext = function (e) {
		if (e === u._function) {
			var t = this.context.length - 1;
			this.context[t] === W.f_expr
				? (this.context[t] = W.f_expr_gen)
				: (this.context[t] = W.f_gen);
		}
		this.exprAllowed = !0;
	};
	u.name.updateContext = function (e) {
		var t = !1;
		this.options.ecmaVersion >= 6 &&
			e !== u.dot &&
			((this.value === 'of' && !this.exprAllowed) ||
				(this.value === 'yield' && this.inGeneratorContext())) &&
			(t = !0),
			(this.exprAllowed = t);
	};
	var M = q.prototype;
	M.checkPropClash = function (e, t, i) {
		if (
			!(this.options.ecmaVersion >= 9 && e.type === 'SpreadElement') &&
			!(
				this.options.ecmaVersion >= 6 &&
				(e.computed || e.method || e.shorthand)
			)
		) {
			var r = e.key,
				n;
			switch (r.type) {
				case 'Identifier':
					n = r.name;
					break;
				case 'Literal':
					n = String(r.value);
					break;
				default:
					return;
			}
			var a = e.kind;
			if (this.options.ecmaVersion >= 6) {
				n === '__proto__' &&
					a === 'init' &&
					(t.proto &&
						(i
							? i.doubleProto < 0 && (i.doubleProto = r.start)
							: this.raiseRecoverable(
									r.start,
									'Redefinition of __proto__ property'
								)),
					(t.proto = !0));
				return;
			}
			n = '$' + n;
			var s = t[n];
			if (s) {
				var o;
				a === 'init'
					? (o = (this.strict && s.init) || s.get || s.set)
					: (o = s.init || s[a]),
					o &&
						this.raiseRecoverable(
							r.start,
							'Redefinition of property'
						);
			} else s = t[n] = { init: !1, get: !1, set: !1 };
			s[a] = !0;
		}
	};
	M.parseExpression = function (e, t) {
		var i = this.start,
			r = this.startLoc,
			n = this.parseMaybeAssign(e, t);
		if (this.type === u.comma) {
			var a = this.startNodeAt(i, r);
			for (a.expressions = [n]; this.eat(u.comma); )
				a.expressions.push(this.parseMaybeAssign(e, t));
			return this.finishNode(a, 'SequenceExpression');
		}
		return n;
	};
	M.parseMaybeAssign = function (e, t, i) {
		if (this.isContextual('yield')) {
			if (this.inGenerator) return this.parseYield(e);
			this.exprAllowed = !1;
		}
		var r = !1,
			n = -1,
			a = -1,
			s = -1;
		t
			? ((n = t.parenthesizedAssign),
				(a = t.trailingComma),
				(s = t.doubleProto),
				(t.parenthesizedAssign = t.trailingComma = -1))
			: ((t = new nt()), (r = !0));
		var o = this.start,
			c = this.startLoc;
		(this.type === u.parenL || this.type === u.name) &&
			((this.potentialArrowAt = this.start),
			(this.potentialArrowInForAwait = e === 'await'));
		var l = this.parseMaybeConditional(e, t);
		if ((i && (l = i.call(this, l, o, c)), this.type.isAssign)) {
			var p = this.startNodeAt(o, c);
			return (
				(p.operator = this.value),
				this.type === u.eq && (l = this.toAssignable(l, !1, t)),
				r ||
					(t.parenthesizedAssign =
						t.trailingComma =
						t.doubleProto =
							-1),
				t.shorthandAssign >= l.start && (t.shorthandAssign = -1),
				this.type === u.eq
					? this.checkLValPattern(l)
					: this.checkLValSimple(l),
				(p.left = l),
				this.next(),
				(p.right = this.parseMaybeAssign(e)),
				s > -1 && (t.doubleProto = s),
				this.finishNode(p, 'AssignmentExpression')
			);
		} else r && this.checkExpressionErrors(t, !0);
		return (
			n > -1 && (t.parenthesizedAssign = n),
			a > -1 && (t.trailingComma = a),
			l
		);
	};
	M.parseMaybeConditional = function (e, t) {
		var i = this.start,
			r = this.startLoc,
			n = this.parseExprOps(e, t);
		if (this.checkExpressionErrors(t)) return n;
		if (this.eat(u.question)) {
			var a = this.startNodeAt(i, r);
			return (
				(a.test = n),
				(a.consequent = this.parseMaybeAssign()),
				this.expect(u.colon),
				(a.alternate = this.parseMaybeAssign(e)),
				this.finishNode(a, 'ConditionalExpression')
			);
		}
		return n;
	};
	M.parseExprOps = function (e, t) {
		var i = this.start,
			r = this.startLoc,
			n = this.parseMaybeUnary(t, !1, !1, e);
		return this.checkExpressionErrors(t) ||
			(n.start === i && n.type === 'ArrowFunctionExpression')
			? n
			: this.parseExprOp(n, i, r, -1, e);
	};
	M.parseExprOp = function (e, t, i, r, n) {
		var a = this.type.binop;
		if (a != null && (!n || this.type !== u._in) && a > r) {
			var s = this.type === u.logicalOR || this.type === u.logicalAND,
				o = this.type === u.coalesce;
			o && (a = u.logicalAND.binop);
			var c = this.value;
			this.next();
			var l = this.start,
				p = this.startLoc,
				f = this.parseExprOp(
					this.parseMaybeUnary(null, !1, !1, n),
					l,
					p,
					a,
					n
				),
				g = this.buildBinary(t, i, e, f, c, s || o);
			return (
				((s && this.type === u.coalesce) ||
					(o &&
						(this.type === u.logicalOR ||
							this.type === u.logicalAND))) &&
					this.raiseRecoverable(
						this.start,
						'Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses'
					),
				this.parseExprOp(g, t, i, r, n)
			);
		}
		return e;
	};
	M.buildBinary = function (e, t, i, r, n, a) {
		r.type === 'PrivateIdentifier' &&
			this.raise(
				r.start,
				'Private identifier can only be left side of binary expression'
			);
		var s = this.startNodeAt(e, t);
		return (
			(s.left = i),
			(s.operator = n),
			(s.right = r),
			this.finishNode(s, a ? 'LogicalExpression' : 'BinaryExpression')
		);
	};
	M.parseMaybeUnary = function (e, t, i, r) {
		var n = this.start,
			a = this.startLoc,
			s;
		if (this.isContextual('await') && this.canAwait)
			(s = this.parseAwait(r)), (t = !0);
		else if (this.type.prefix) {
			var o = this.startNode(),
				c = this.type === u.incDec;
			(o.operator = this.value),
				(o.prefix = !0),
				this.next(),
				(o.argument = this.parseMaybeUnary(null, !0, c, r)),
				this.checkExpressionErrors(e, !0),
				c
					? this.checkLValSimple(o.argument)
					: this.strict &&
						  o.operator === 'delete' &&
						  o.argument.type === 'Identifier'
						? this.raiseRecoverable(
								o.start,
								'Deleting local variable in strict mode'
							)
						: o.operator === 'delete' && Fr(o.argument)
							? this.raiseRecoverable(
									o.start,
									'Private fields can not be deleted'
								)
							: (t = !0),
				(s = this.finishNode(
					o,
					c ? 'UpdateExpression' : 'UnaryExpression'
				));
		} else if (!t && this.type === u.privateId)
			(r || this.privateNameStack.length === 0) &&
				this.options.checkPrivateFields &&
				this.unexpected(),
				(s = this.parsePrivateIdent()),
				this.type !== u._in && this.unexpected();
		else {
			if (
				((s = this.parseExprSubscripts(e, r)),
				this.checkExpressionErrors(e))
			)
				return s;
			for (; this.type.postfix && !this.canInsertSemicolon(); ) {
				var l = this.startNodeAt(n, a);
				(l.operator = this.value),
					(l.prefix = !1),
					(l.argument = s),
					this.checkLValSimple(s),
					this.next(),
					(s = this.finishNode(l, 'UpdateExpression'));
			}
		}
		if (!i && this.eat(u.starstar))
			if (t) this.unexpected(this.lastTokStart);
			else
				return this.buildBinary(
					n,
					a,
					s,
					this.parseMaybeUnary(null, !1, !1, r),
					'**',
					!1
				);
		else return s;
	};
	function Fr(e) {
		return (
			(e.type === 'MemberExpression' &&
				e.property.type === 'PrivateIdentifier') ||
			(e.type === 'ChainExpression' && Fr(e.expression))
		);
	}
	M.parseExprSubscripts = function (e, t) {
		var i = this.start,
			r = this.startLoc,
			n = this.parseExprAtom(e, t);
		if (
			n.type === 'ArrowFunctionExpression' &&
			this.input.slice(this.lastTokStart, this.lastTokEnd) !== ')'
		)
			return n;
		var a = this.parseSubscripts(n, i, r, !1, t);
		return (
			e &&
				a.type === 'MemberExpression' &&
				(e.parenthesizedAssign >= a.start &&
					(e.parenthesizedAssign = -1),
				e.parenthesizedBind >= a.start && (e.parenthesizedBind = -1),
				e.trailingComma >= a.start && (e.trailingComma = -1)),
			a
		);
	};
	M.parseSubscripts = function (e, t, i, r, n) {
		for (
			var a =
					this.options.ecmaVersion >= 8 &&
					e.type === 'Identifier' &&
					e.name === 'async' &&
					this.lastTokEnd === e.end &&
					!this.canInsertSemicolon() &&
					e.end - e.start === 5 &&
					this.potentialArrowAt === e.start,
				s = !1;
			;

		) {
			var o = this.parseSubscript(e, t, i, r, a, s, n);
			if (
				(o.optional && (s = !0),
				o === e || o.type === 'ArrowFunctionExpression')
			) {
				if (s) {
					var c = this.startNodeAt(t, i);
					(c.expression = o),
						(o = this.finishNode(c, 'ChainExpression'));
				}
				return o;
			}
			e = o;
		}
	};
	M.shouldParseAsyncArrow = function () {
		return !this.canInsertSemicolon() && this.eat(u.arrow);
	};
	M.parseSubscriptAsyncArrow = function (e, t, i, r) {
		return this.parseArrowExpression(this.startNodeAt(e, t), i, !0, r);
	};
	M.parseSubscript = function (e, t, i, r, n, a, s) {
		var o = this.options.ecmaVersion >= 11,
			c = o && this.eat(u.questionDot);
		r &&
			c &&
			this.raise(
				this.lastTokStart,
				'Optional chaining cannot appear in the callee of new expressions'
			);
		var l = this.eat(u.bracketL);
		if (
			l ||
			(c && this.type !== u.parenL && this.type !== u.backQuote) ||
			this.eat(u.dot)
		) {
			var p = this.startNodeAt(t, i);
			(p.object = e),
				l
					? ((p.property = this.parseExpression()),
						this.expect(u.bracketR))
					: this.type === u.privateId && e.type !== 'Super'
						? (p.property = this.parsePrivateIdent())
						: (p.property = this.parseIdent(
								this.options.allowReserved !== 'never'
							)),
				(p.computed = !!l),
				o && (p.optional = c),
				(e = this.finishNode(p, 'MemberExpression'));
		} else if (!r && this.eat(u.parenL)) {
			var f = new nt(),
				g = this.yieldPos,
				x = this.awaitPos,
				b = this.awaitIdentPos;
			(this.yieldPos = 0), (this.awaitPos = 0), (this.awaitIdentPos = 0);
			var D = this.parseExprList(
				u.parenR,
				this.options.ecmaVersion >= 8,
				!1,
				f
			);
			if (n && !c && this.shouldParseAsyncArrow())
				return (
					this.checkPatternErrors(f, !1),
					this.checkYieldAwaitInDefaultParams(),
					this.awaitIdentPos > 0 &&
						this.raise(
							this.awaitIdentPos,
							"Cannot use 'await' as identifier inside an async function"
						),
					(this.yieldPos = g),
					(this.awaitPos = x),
					(this.awaitIdentPos = b),
					this.parseSubscriptAsyncArrow(t, i, D, s)
				);
			this.checkExpressionErrors(f, !0),
				(this.yieldPos = g || this.yieldPos),
				(this.awaitPos = x || this.awaitPos),
				(this.awaitIdentPos = b || this.awaitIdentPos);
			var P = this.startNodeAt(t, i);
			(P.callee = e),
				(P.arguments = D),
				o && (P.optional = c),
				(e = this.finishNode(P, 'CallExpression'));
		} else if (this.type === u.backQuote) {
			(c || a) &&
				this.raise(
					this.start,
					'Optional chaining cannot appear in the tag of tagged template expressions'
				);
			var h = this.startNodeAt(t, i);
			(h.tag = e),
				(h.quasi = this.parseTemplate({ isTagged: !0 })),
				(e = this.finishNode(h, 'TaggedTemplateExpression'));
		}
		return e;
	};
	M.parseExprAtom = function (e, t, i) {
		this.type === u.slash && this.readRegexp();
		var r,
			n = this.potentialArrowAt === this.start;
		switch (this.type) {
			case u._super:
				return (
					this.allowSuper ||
						this.raise(
							this.start,
							"'super' keyword outside a method"
						),
					(r = this.startNode()),
					this.next(),
					this.type === u.parenL &&
						!this.allowDirectSuper &&
						this.raise(
							r.start,
							'super() call outside constructor of a subclass'
						),
					this.type !== u.dot &&
						this.type !== u.bracketL &&
						this.type !== u.parenL &&
						this.unexpected(),
					this.finishNode(r, 'Super')
				);
			case u._this:
				return (
					(r = this.startNode()),
					this.next(),
					this.finishNode(r, 'ThisExpression')
				);
			case u.name:
				var a = this.start,
					s = this.startLoc,
					o = this.containsEsc,
					c = this.parseIdent(!1);
				if (
					this.options.ecmaVersion >= 8 &&
					!o &&
					c.name === 'async' &&
					!this.canInsertSemicolon() &&
					this.eat(u._function)
				)
					return (
						this.overrideContext(W.f_expr),
						this.parseFunction(this.startNodeAt(a, s), 0, !1, !0, t)
					);
				if (n && !this.canInsertSemicolon()) {
					if (this.eat(u.arrow))
						return this.parseArrowExpression(
							this.startNodeAt(a, s),
							[c],
							!1,
							t
						);
					if (
						this.options.ecmaVersion >= 8 &&
						c.name === 'async' &&
						this.type === u.name &&
						!o &&
						(!this.potentialArrowInForAwait ||
							this.value !== 'of' ||
							this.containsEsc)
					)
						return (
							(c = this.parseIdent(!1)),
							(this.canInsertSemicolon() || !this.eat(u.arrow)) &&
								this.unexpected(),
							this.parseArrowExpression(
								this.startNodeAt(a, s),
								[c],
								!0,
								t
							)
						);
				}
				return c;
			case u.regexp:
				var l = this.value;
				return (
					(r = this.parseLiteral(l.value)),
					(r.regex = { pattern: l.pattern, flags: l.flags }),
					r
				);
			case u.num:
			case u.string:
				return this.parseLiteral(this.value);
			case u._null:
			case u._true:
			case u._false:
				return (
					(r = this.startNode()),
					(r.value =
						this.type === u._null ? null : this.type === u._true),
					(r.raw = this.type.keyword),
					this.next(),
					this.finishNode(r, 'Literal')
				);
			case u.parenL:
				var p = this.start,
					f = this.parseParenAndDistinguishExpression(n, t);
				return (
					e &&
						(e.parenthesizedAssign < 0 &&
							!this.isSimpleAssignTarget(f) &&
							(e.parenthesizedAssign = p),
						e.parenthesizedBind < 0 && (e.parenthesizedBind = p)),
					f
				);
			case u.bracketL:
				return (
					(r = this.startNode()),
					this.next(),
					(r.elements = this.parseExprList(u.bracketR, !0, !0, e)),
					this.finishNode(r, 'ArrayExpression')
				);
			case u.braceL:
				return this.overrideContext(W.b_expr), this.parseObj(!1, e);
			case u._function:
				return (
					(r = this.startNode()),
					this.next(),
					this.parseFunction(r, 0)
				);
			case u._class:
				return this.parseClass(this.startNode(), !1);
			case u._new:
				return this.parseNew();
			case u.backQuote:
				return this.parseTemplate();
			case u._import:
				return this.options.ecmaVersion >= 11
					? this.parseExprImport(i)
					: this.unexpected();
			default:
				return this.parseExprAtomDefault();
		}
	};
	M.parseExprAtomDefault = function () {
		this.unexpected();
	};
	M.parseExprImport = function (e) {
		var t = this.startNode();
		if (
			(this.containsEsc &&
				this.raiseRecoverable(
					this.start,
					'Escape sequence in keyword import'
				),
			this.next(),
			this.type === u.parenL && !e)
		)
			return this.parseDynamicImport(t);
		if (this.type === u.dot) {
			var i = this.startNodeAt(t.start, t.loc && t.loc.start);
			return (
				(i.name = 'import'),
				(t.meta = this.finishNode(i, 'Identifier')),
				this.parseImportMeta(t)
			);
		} else this.unexpected();
	};
	M.parseDynamicImport = function (e) {
		if (
			(this.next(),
			(e.source = this.parseMaybeAssign()),
			!this.eat(u.parenR))
		) {
			var t = this.start;
			this.eat(u.comma) && this.eat(u.parenR)
				? this.raiseRecoverable(
						t,
						'Trailing comma is not allowed in import()'
					)
				: this.unexpected(t);
		}
		return this.finishNode(e, 'ImportExpression');
	};
	M.parseImportMeta = function (e) {
		this.next();
		var t = this.containsEsc;
		return (
			(e.property = this.parseIdent(!0)),
			e.property.name !== 'meta' &&
				this.raiseRecoverable(
					e.property.start,
					"The only valid meta property for import is 'import.meta'"
				),
			t &&
				this.raiseRecoverable(
					e.start,
					"'import.meta' must not contain escaped characters"
				),
			this.options.sourceType !== 'module' &&
				!this.options.allowImportExportEverywhere &&
				this.raiseRecoverable(
					e.start,
					"Cannot use 'import.meta' outside a module"
				),
			this.finishNode(e, 'MetaProperty')
		);
	};
	M.parseLiteral = function (e) {
		var t = this.startNode();
		return (
			(t.value = e),
			(t.raw = this.input.slice(this.start, this.end)),
			t.raw.charCodeAt(t.raw.length - 1) === 110 &&
				(t.bigint = t.raw.slice(0, -1).replace(/_/g, '')),
			this.next(),
			this.finishNode(t, 'Literal')
		);
	};
	M.parseParenExpression = function () {
		this.expect(u.parenL);
		var e = this.parseExpression();
		return this.expect(u.parenR), e;
	};
	M.shouldParseArrow = function (e) {
		return !this.canInsertSemicolon();
	};
	M.parseParenAndDistinguishExpression = function (e, t) {
		var i = this.start,
			r = this.startLoc,
			n,
			a = this.options.ecmaVersion >= 8;
		if (this.options.ecmaVersion >= 6) {
			this.next();
			var s = this.start,
				o = this.startLoc,
				c = [],
				l = !0,
				p = !1,
				f = new nt(),
				g = this.yieldPos,
				x = this.awaitPos,
				b;
			for (this.yieldPos = 0, this.awaitPos = 0; this.type !== u.parenR; )
				if (
					(l ? (l = !1) : this.expect(u.comma),
					a && this.afterTrailingComma(u.parenR, !0))
				) {
					p = !0;
					break;
				} else if (this.type === u.ellipsis) {
					(b = this.start),
						c.push(this.parseParenItem(this.parseRestBinding())),
						this.type === u.comma &&
							this.raiseRecoverable(
								this.start,
								'Comma is not permitted after the rest element'
							);
					break;
				} else
					c.push(this.parseMaybeAssign(!1, f, this.parseParenItem));
			var D = this.lastTokEnd,
				P = this.lastTokEndLoc;
			if (
				(this.expect(u.parenR),
				e && this.shouldParseArrow(c) && this.eat(u.arrow))
			)
				return (
					this.checkPatternErrors(f, !1),
					this.checkYieldAwaitInDefaultParams(),
					(this.yieldPos = g),
					(this.awaitPos = x),
					this.parseParenArrowList(i, r, c, t)
				);
			(!c.length || p) && this.unexpected(this.lastTokStart),
				b && this.unexpected(b),
				this.checkExpressionErrors(f, !0),
				(this.yieldPos = g || this.yieldPos),
				(this.awaitPos = x || this.awaitPos),
				c.length > 1
					? ((n = this.startNodeAt(s, o)),
						(n.expressions = c),
						this.finishNodeAt(n, 'SequenceExpression', D, P))
					: (n = c[0]);
		} else n = this.parseParenExpression();
		if (this.options.preserveParens) {
			var h = this.startNodeAt(i, r);
			return (
				(h.expression = n),
				this.finishNode(h, 'ParenthesizedExpression')
			);
		} else return n;
	};
	M.parseParenItem = function (e) {
		return e;
	};
	M.parseParenArrowList = function (e, t, i, r) {
		return this.parseArrowExpression(this.startNodeAt(e, t), i, !1, r);
	};
	var $a = [];
	M.parseNew = function () {
		this.containsEsc &&
			this.raiseRecoverable(this.start, 'Escape sequence in keyword new');
		var e = this.startNode();
		if (
			(this.next(), this.options.ecmaVersion >= 6 && this.type === u.dot)
		) {
			var t = this.startNodeAt(e.start, e.loc && e.loc.start);
			(t.name = 'new'),
				(e.meta = this.finishNode(t, 'Identifier')),
				this.next();
			var i = this.containsEsc;
			return (
				(e.property = this.parseIdent(!0)),
				e.property.name !== 'target' &&
					this.raiseRecoverable(
						e.property.start,
						"The only valid meta property for new is 'new.target'"
					),
				i &&
					this.raiseRecoverable(
						e.start,
						"'new.target' must not contain escaped characters"
					),
				this.allowNewDotTarget ||
					this.raiseRecoverable(
						e.start,
						"'new.target' can only be used in functions and class static block"
					),
				this.finishNode(e, 'MetaProperty')
			);
		}
		var r = this.start,
			n = this.startLoc;
		return (
			(e.callee = this.parseSubscripts(
				this.parseExprAtom(null, !1, !0),
				r,
				n,
				!0,
				!1
			)),
			this.eat(u.parenL)
				? (e.arguments = this.parseExprList(
						u.parenR,
						this.options.ecmaVersion >= 8,
						!1
					))
				: (e.arguments = $a),
			this.finishNode(e, 'NewExpression')
		);
	};
	M.parseTemplateElement = function (e) {
		var t = e.isTagged,
			i = this.startNode();
		return (
			this.type === u.invalidTemplate
				? (t ||
						this.raiseRecoverable(
							this.start,
							'Bad escape sequence in untagged template literal'
						),
					(i.value = { raw: this.value, cooked: null }))
				: (i.value = {
						raw: this.input.slice(this.start, this.end).replace(
							/\r\n?/g,
							`
`
						),
						cooked: this.value
					}),
			this.next(),
			(i.tail = this.type === u.backQuote),
			this.finishNode(i, 'TemplateElement')
		);
	};
	M.parseTemplate = function (e) {
		e === void 0 && (e = {});
		var t = e.isTagged;
		t === void 0 && (t = !1);
		var i = this.startNode();
		this.next(), (i.expressions = []);
		var r = this.parseTemplateElement({ isTagged: t });
		for (i.quasis = [r]; !r.tail; )
			this.type === u.eof &&
				this.raise(this.pos, 'Unterminated template literal'),
				this.expect(u.dollarBraceL),
				i.expressions.push(this.parseExpression()),
				this.expect(u.braceR),
				i.quasis.push((r = this.parseTemplateElement({ isTagged: t })));
		return this.next(), this.finishNode(i, 'TemplateLiteral');
	};
	M.isAsyncProp = function (e) {
		return (
			!e.computed &&
			e.key.type === 'Identifier' &&
			e.key.name === 'async' &&
			(this.type === u.name ||
				this.type === u.num ||
				this.type === u.string ||
				this.type === u.bracketL ||
				this.type.keyword ||
				(this.options.ecmaVersion >= 9 && this.type === u.star)) &&
			!ne.test(this.input.slice(this.lastTokEnd, this.start))
		);
	};
	M.parseObj = function (e, t) {
		var i = this.startNode(),
			r = !0,
			n = {};
		for (i.properties = [], this.next(); !this.eat(u.braceR); ) {
			if (r) r = !1;
			else if (
				(this.expect(u.comma),
				this.options.ecmaVersion >= 5 &&
					this.afterTrailingComma(u.braceR))
			)
				break;
			var a = this.parseProperty(e, t);
			e || this.checkPropClash(a, n, t), i.properties.push(a);
		}
		return this.finishNode(i, e ? 'ObjectPattern' : 'ObjectExpression');
	};
	M.parseProperty = function (e, t) {
		var i = this.startNode(),
			r,
			n,
			a,
			s;
		if (this.options.ecmaVersion >= 9 && this.eat(u.ellipsis))
			return e
				? ((i.argument = this.parseIdent(!1)),
					this.type === u.comma &&
						this.raiseRecoverable(
							this.start,
							'Comma is not permitted after the rest element'
						),
					this.finishNode(i, 'RestElement'))
				: ((i.argument = this.parseMaybeAssign(!1, t)),
					this.type === u.comma &&
						t &&
						t.trailingComma < 0 &&
						(t.trailingComma = this.start),
					this.finishNode(i, 'SpreadElement'));
		this.options.ecmaVersion >= 6 &&
			((i.method = !1),
			(i.shorthand = !1),
			(e || t) && ((a = this.start), (s = this.startLoc)),
			e || (r = this.eat(u.star)));
		var o = this.containsEsc;
		return (
			this.parsePropertyName(i),
			!e &&
			!o &&
			this.options.ecmaVersion >= 8 &&
			!r &&
			this.isAsyncProp(i)
				? ((n = !0),
					(r = this.options.ecmaVersion >= 9 && this.eat(u.star)),
					this.parsePropertyName(i))
				: (n = !1),
			this.parsePropertyValue(i, e, r, n, a, s, t, o),
			this.finishNode(i, 'Property')
		);
	};
	M.parseGetterSetter = function (e) {
		(e.kind = e.key.name),
			this.parsePropertyName(e),
			(e.value = this.parseMethod(!1));
		var t = e.kind === 'get' ? 0 : 1;
		if (e.value.params.length !== t) {
			var i = e.value.start;
			e.kind === 'get'
				? this.raiseRecoverable(i, 'getter should have no params')
				: this.raiseRecoverable(
						i,
						'setter should have exactly one param'
					);
		} else
			e.kind === 'set' &&
				e.value.params[0].type === 'RestElement' &&
				this.raiseRecoverable(
					e.value.params[0].start,
					'Setter cannot use rest params'
				);
	};
	M.parsePropertyValue = function (e, t, i, r, n, a, s, o) {
		(i || r) && this.type === u.colon && this.unexpected(),
			this.eat(u.colon)
				? ((e.value = t
						? this.parseMaybeDefault(this.start, this.startLoc)
						: this.parseMaybeAssign(!1, s)),
					(e.kind = 'init'))
				: this.options.ecmaVersion >= 6 && this.type === u.parenL
					? (t && this.unexpected(),
						(e.kind = 'init'),
						(e.method = !0),
						(e.value = this.parseMethod(i, r)))
					: !t &&
						  !o &&
						  this.options.ecmaVersion >= 5 &&
						  !e.computed &&
						  e.key.type === 'Identifier' &&
						  (e.key.name === 'get' || e.key.name === 'set') &&
						  this.type !== u.comma &&
						  this.type !== u.braceR &&
						  this.type !== u.eq
						? ((i || r) && this.unexpected(),
							this.parseGetterSetter(e))
						: this.options.ecmaVersion >= 6 &&
							  !e.computed &&
							  e.key.type === 'Identifier'
							? ((i || r) && this.unexpected(),
								this.checkUnreserved(e.key),
								e.key.name === 'await' &&
									!this.awaitIdentPos &&
									(this.awaitIdentPos = n),
								(e.kind = 'init'),
								t
									? (e.value = this.parseMaybeDefault(
											n,
											a,
											this.copyNode(e.key)
										))
									: this.type === u.eq && s
										? (s.shorthandAssign < 0 &&
												(s.shorthandAssign =
													this.start),
											(e.value = this.parseMaybeDefault(
												n,
												a,
												this.copyNode(e.key)
											)))
										: (e.value = this.copyNode(e.key)),
								(e.shorthand = !0))
							: this.unexpected();
	};
	M.parsePropertyName = function (e) {
		if (this.options.ecmaVersion >= 6) {
			if (this.eat(u.bracketL))
				return (
					(e.computed = !0),
					(e.key = this.parseMaybeAssign()),
					this.expect(u.bracketR),
					e.key
				);
			e.computed = !1;
		}
		return (e.key =
			this.type === u.num || this.type === u.string
				? this.parseExprAtom()
				: this.parseIdent(this.options.allowReserved !== 'never'));
	};
	M.initFunction = function (e) {
		(e.id = null),
			this.options.ecmaVersion >= 6 && (e.generator = e.expression = !1),
			this.options.ecmaVersion >= 8 && (e.async = !1);
	};
	M.parseMethod = function (e, t, i) {
		var r = this.startNode(),
			n = this.yieldPos,
			a = this.awaitPos,
			s = this.awaitIdentPos;
		return (
			this.initFunction(r),
			this.options.ecmaVersion >= 6 && (r.generator = e),
			this.options.ecmaVersion >= 8 && (r.async = !!t),
			(this.yieldPos = 0),
			(this.awaitPos = 0),
			(this.awaitIdentPos = 0),
			this.enterScope(Kt(t, r.generator) | qt | (i ? Nr : 0)),
			this.expect(u.parenL),
			(r.params = this.parseBindingList(
				u.parenR,
				!1,
				this.options.ecmaVersion >= 8
			)),
			this.checkYieldAwaitInDefaultParams(),
			this.parseFunctionBody(r, !1, !0, !1),
			(this.yieldPos = n),
			(this.awaitPos = a),
			(this.awaitIdentPos = s),
			this.finishNode(r, 'FunctionExpression')
		);
	};
	M.parseArrowExpression = function (e, t, i, r) {
		var n = this.yieldPos,
			a = this.awaitPos,
			s = this.awaitIdentPos;
		return (
			this.enterScope(Kt(i, !1) | Ir),
			this.initFunction(e),
			this.options.ecmaVersion >= 8 && (e.async = !!i),
			(this.yieldPos = 0),
			(this.awaitPos = 0),
			(this.awaitIdentPos = 0),
			(e.params = this.toAssignableList(t, !0)),
			this.parseFunctionBody(e, !0, !1, r),
			(this.yieldPos = n),
			(this.awaitPos = a),
			(this.awaitIdentPos = s),
			this.finishNode(e, 'ArrowFunctionExpression')
		);
	};
	M.parseFunctionBody = function (e, t, i, r) {
		var n = t && this.type !== u.braceL,
			a = this.strict,
			s = !1;
		if (n)
			(e.body = this.parseMaybeAssign(r)),
				(e.expression = !0),
				this.checkParams(e, !1);
		else {
			var o =
				this.options.ecmaVersion >= 7 &&
				!this.isSimpleParamList(e.params);
			(!a || o) &&
				((s = this.strictDirective(this.end)),
				s &&
					o &&
					this.raiseRecoverable(
						e.start,
						"Illegal 'use strict' directive in function with non-simple parameter list"
					));
			var c = this.labels;
			(this.labels = []),
				s && (this.strict = !0),
				this.checkParams(
					e,
					!a && !s && !t && !i && this.isSimpleParamList(e.params)
				),
				this.strict && e.id && this.checkLValSimple(e.id, Or),
				(e.body = this.parseBlock(!1, void 0, s && !a)),
				(e.expression = !1),
				this.adaptDirectivePrologue(e.body.body),
				(this.labels = c);
		}
		this.exitScope();
	};
	M.isSimpleParamList = function (e) {
		for (var t = 0, i = e; t < i.length; t += 1) {
			var r = i[t];
			if (r.type !== 'Identifier') return !1;
		}
		return !0;
	};
	M.checkParams = function (e, t) {
		for (
			var i = Object.create(null), r = 0, n = e.params;
			r < n.length;
			r += 1
		) {
			var a = n[r];
			this.checkLValInnerPattern(a, Qt, t ? null : i);
		}
	};
	M.parseExprList = function (e, t, i, r) {
		for (var n = [], a = !0; !this.eat(e); ) {
			if (a) a = !1;
			else if ((this.expect(u.comma), t && this.afterTrailingComma(e)))
				break;
			var s = void 0;
			i && this.type === u.comma
				? (s = null)
				: this.type === u.ellipsis
					? ((s = this.parseSpread(r)),
						r &&
							this.type === u.comma &&
							r.trailingComma < 0 &&
							(r.trailingComma = this.start))
					: (s = this.parseMaybeAssign(!1, r)),
				n.push(s);
		}
		return n;
	};
	M.checkUnreserved = function (e) {
		var t = e.start,
			i = e.end,
			r = e.name;
		if (
			(this.inGenerator &&
				r === 'yield' &&
				this.raiseRecoverable(
					t,
					"Cannot use 'yield' as identifier inside a generator"
				),
			this.inAsync &&
				r === 'await' &&
				this.raiseRecoverable(
					t,
					"Cannot use 'await' as identifier inside an async function"
				),
			this.currentThisScope().inClassFieldInit &&
				r === 'arguments' &&
				this.raiseRecoverable(
					t,
					"Cannot use 'arguments' in class field initializer"
				),
			this.inClassStaticBlock &&
				(r === 'arguments' || r === 'await') &&
				this.raise(
					t,
					'Cannot use ' + r + ' in class static initialization block'
				),
			this.keywords.test(r) &&
				this.raise(t, "Unexpected keyword '" + r + "'"),
			!(
				this.options.ecmaVersion < 6 &&
				this.input.slice(t, i).indexOf('\\') !== -1
			))
		) {
			var n = this.strict ? this.reservedWordsStrict : this.reservedWords;
			n.test(r) &&
				(!this.inAsync &&
					r === 'await' &&
					this.raiseRecoverable(
						t,
						"Cannot use keyword 'await' outside an async function"
					),
				this.raiseRecoverable(
					t,
					"The keyword '" + r + "' is reserved"
				));
		}
	};
	M.parseIdent = function (e) {
		var t = this.parseIdentNode();
		return (
			this.next(!!e),
			this.finishNode(t, 'Identifier'),
			e ||
				(this.checkUnreserved(t),
				t.name === 'await' &&
					!this.awaitIdentPos &&
					(this.awaitIdentPos = t.start)),
			t
		);
	};
	M.parseIdentNode = function () {
		var e = this.startNode();
		return (
			this.type === u.name
				? (e.name = this.value)
				: this.type.keyword
					? ((e.name = this.type.keyword),
						(e.name === 'class' || e.name === 'function') &&
							(this.lastTokEnd !== this.lastTokStart + 1 ||
								this.input.charCodeAt(this.lastTokStart) !==
									46) &&
							this.context.pop(),
						(this.type = u.name))
					: this.unexpected(),
			e
		);
	};
	M.parsePrivateIdent = function () {
		var e = this.startNode();
		return (
			this.type === u.privateId
				? (e.name = this.value)
				: this.unexpected(),
			this.next(),
			this.finishNode(e, 'PrivateIdentifier'),
			this.options.checkPrivateFields &&
				(this.privateNameStack.length === 0
					? this.raise(
							e.start,
							"Private field '#" +
								e.name +
								"' must be declared in an enclosing class"
						)
					: this.privateNameStack[
							this.privateNameStack.length - 1
						].used.push(e)),
			e
		);
	};
	M.parseYield = function (e) {
		this.yieldPos || (this.yieldPos = this.start);
		var t = this.startNode();
		return (
			this.next(),
			this.type === u.semi ||
			this.canInsertSemicolon() ||
			(this.type !== u.star && !this.type.startsExpr)
				? ((t.delegate = !1), (t.argument = null))
				: ((t.delegate = this.eat(u.star)),
					(t.argument = this.parseMaybeAssign(e))),
			this.finishNode(t, 'YieldExpression')
		);
	};
	M.parseAwait = function (e) {
		this.awaitPos || (this.awaitPos = this.start);
		var t = this.startNode();
		return (
			this.next(),
			(t.argument = this.parseMaybeUnary(null, !0, !1, e)),
			this.finishNode(t, 'AwaitExpression')
		);
	};
	var it = q.prototype;
	it.raise = function (e, t) {
		var i = Lr(this.input, e);
		t += ' (' + i.line + ':' + i.column + ')';
		var r = new SyntaxError(t);
		throw ((r.pos = e), (r.loc = i), (r.raisedAt = this.pos), r);
	};
	it.raiseRecoverable = it.raise;
	it.curPosition = function () {
		if (this.options.locations)
			return new Te(this.curLine, this.pos - this.lineStart);
	};
	var xe = q.prototype,
		ja = function (t) {
			(this.flags = t),
				(this.var = []),
				(this.lexical = []),
				(this.functions = []),
				(this.inClassFieldInit = !1);
		};
	xe.enterScope = function (e) {
		this.scopeStack.push(new ja(e));
	};
	xe.exitScope = function () {
		this.scopeStack.pop();
	};
	xe.treatFunctionsAsVarInScope = function (e) {
		return e.flags & Ce || (!this.inModule && e.flags & Ne);
	};
	xe.declareName = function (e, t, i) {
		var r = !1;
		if (t === fe) {
			var n = this.currentScope();
			(r =
				n.lexical.indexOf(e) > -1 ||
				n.functions.indexOf(e) > -1 ||
				n.var.indexOf(e) > -1),
				n.lexical.push(e),
				this.inModule &&
					n.flags & Ne &&
					delete this.undefinedExports[e];
		} else if (t === Dr) {
			var a = this.currentScope();
			a.lexical.push(e);
		} else if (t === Mr) {
			var s = this.currentScope();
			this.treatFunctionsAsVar
				? (r = s.lexical.indexOf(e) > -1)
				: (r = s.lexical.indexOf(e) > -1 || s.var.indexOf(e) > -1),
				s.functions.push(e);
		} else
			for (var o = this.scopeStack.length - 1; o >= 0; --o) {
				var c = this.scopeStack[o];
				if (
					(c.lexical.indexOf(e) > -1 &&
						!(c.flags & Tr && c.lexical[0] === e)) ||
					(!this.treatFunctionsAsVarInScope(c) &&
						c.functions.indexOf(e) > -1)
				) {
					r = !0;
					break;
				}
				if (
					(c.var.push(e),
					this.inModule &&
						c.flags & Ne &&
						delete this.undefinedExports[e],
					c.flags & Gt)
				)
					break;
			}
		r &&
			this.raiseRecoverable(
				i,
				"Identifier '" + e + "' has already been declared"
			);
	};
	xe.checkLocalExport = function (e) {
		this.scopeStack[0].lexical.indexOf(e.name) === -1 &&
			this.scopeStack[0].var.indexOf(e.name) === -1 &&
			(this.undefinedExports[e.name] = e);
	};
	xe.currentScope = function () {
		return this.scopeStack[this.scopeStack.length - 1];
	};
	xe.currentVarScope = function () {
		for (var e = this.scopeStack.length - 1; ; e--) {
			var t = this.scopeStack[e];
			if (t.flags & Gt) return t;
		}
	};
	xe.currentThisScope = function () {
		for (var e = this.scopeStack.length - 1; ; e--) {
			var t = this.scopeStack[e];
			if (t.flags & Gt && !(t.flags & Ir)) return t;
		}
	};
	var at = function (t, i, r) {
			(this.type = ''),
				(this.start = i),
				(this.end = 0),
				t.options.locations && (this.loc = new rt(t, r)),
				t.options.directSourceFile &&
					(this.sourceFile = t.options.directSourceFile),
				t.options.ranges && (this.range = [i, 0]);
		},
		Oe = q.prototype;
	Oe.startNode = function () {
		return new at(this, this.start, this.startLoc);
	};
	Oe.startNodeAt = function (e, t) {
		return new at(this, e, t);
	};
	function Vr(e, t, i, r) {
		return (
			(e.type = t),
			(e.end = i),
			this.options.locations && (e.loc.end = r),
			this.options.ranges && (e.range[1] = i),
			e
		);
	}
	Oe.finishNode = function (e, t) {
		return Vr.call(this, e, t, this.lastTokEnd, this.lastTokEndLoc);
	};
	Oe.finishNodeAt = function (e, t, i, r) {
		return Vr.call(this, e, t, i, r);
	};
	Oe.copyNode = function (e) {
		var t = new at(this, e.start, this.startLoc);
		for (var i in e) t[i] = e[i];
		return t;
	};
	var $r =
			'ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS',
		jr = $r + ' Extended_Pictographic',
		Ur = jr,
		Hr = Ur + ' EBase EComp EMod EPres ExtPict',
		Wr = Hr,
		Ua = Wr,
		Ha = { 9: $r, 10: jr, 11: Ur, 12: Hr, 13: Wr, 14: Ua },
		Wa =
			'Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji',
		za = { 9: '', 10: '', 11: '', 12: '', 13: '', 14: Wa },
		wr =
			'Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu',
		zr =
			'Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb',
		qr =
			zr +
			' Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd',
		Gr =
			qr +
			' Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho',
		Kr =
			Gr +
			' Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi',
		Qr =
			Kr +
			' Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith',
		qa =
			Qr +
			' Hrkt Katakana_Or_Hiragana Kawi Nag_Mundari Nagm Unknown Zzzz',
		Ga = { 9: zr, 10: qr, 11: Gr, 12: Kr, 13: Qr, 14: qa },
		Yr = {};
	function Ka(e) {
		var t = (Yr[e] = {
			binary: ye(Ha[e] + ' ' + wr),
			binaryOfStrings: ye(za[e]),
			nonBinary: { General_Category: ye(wr), Script: ye(Ga[e]) }
		});
		(t.nonBinary.Script_Extensions = t.nonBinary.Script),
			(t.nonBinary.gc = t.nonBinary.General_Category),
			(t.nonBinary.sc = t.nonBinary.Script),
			(t.nonBinary.scx = t.nonBinary.Script_Extensions);
	}
	for (Ze = 0, $t = [9, 10, 11, 12, 13, 14]; Ze < $t.length; Ze += 1)
		(Sr = $t[Ze]), Ka(Sr);
	var Sr,
		Ze,
		$t,
		A = q.prototype,
		le = function (t) {
			(this.parser = t),
				(this.validFlags =
					'gim' +
					(t.options.ecmaVersion >= 6 ? 'uy' : '') +
					(t.options.ecmaVersion >= 9 ? 's' : '') +
					(t.options.ecmaVersion >= 13 ? 'd' : '') +
					(t.options.ecmaVersion >= 15 ? 'v' : '')),
				(this.unicodeProperties =
					Yr[
						t.options.ecmaVersion >= 14 ? 14 : t.options.ecmaVersion
					]),
				(this.source = ''),
				(this.flags = ''),
				(this.start = 0),
				(this.switchU = !1),
				(this.switchV = !1),
				(this.switchN = !1),
				(this.pos = 0),
				(this.lastIntValue = 0),
				(this.lastStringValue = ''),
				(this.lastAssertionIsQuantifiable = !1),
				(this.numCapturingParens = 0),
				(this.maxBackReference = 0),
				(this.groupNames = []),
				(this.backReferenceNames = []);
		};
	le.prototype.reset = function (t, i, r) {
		var n = r.indexOf('v') !== -1,
			a = r.indexOf('u') !== -1;
		(this.start = t | 0),
			(this.source = i + ''),
			(this.flags = r),
			n && this.parser.options.ecmaVersion >= 15
				? ((this.switchU = !0),
					(this.switchV = !0),
					(this.switchN = !0))
				: ((this.switchU = a && this.parser.options.ecmaVersion >= 6),
					(this.switchV = !1),
					(this.switchN = a && this.parser.options.ecmaVersion >= 9));
	};
	le.prototype.raise = function (t) {
		this.parser.raiseRecoverable(
			this.start,
			'Invalid regular expression: /' + this.source + '/: ' + t
		);
	};
	le.prototype.at = function (t, i) {
		i === void 0 && (i = !1);
		var r = this.source,
			n = r.length;
		if (t >= n) return -1;
		var a = r.charCodeAt(t);
		if (!(i || this.switchU) || a <= 55295 || a >= 57344 || t + 1 >= n)
			return a;
		var s = r.charCodeAt(t + 1);
		return s >= 56320 && s <= 57343 ? (a << 10) + s - 56613888 : a;
	};
	le.prototype.nextIndex = function (t, i) {
		i === void 0 && (i = !1);
		var r = this.source,
			n = r.length;
		if (t >= n) return n;
		var a = r.charCodeAt(t),
			s;
		return !(i || this.switchU) ||
			a <= 55295 ||
			a >= 57344 ||
			t + 1 >= n ||
			(s = r.charCodeAt(t + 1)) < 56320 ||
			s > 57343
			? t + 1
			: t + 2;
	};
	le.prototype.current = function (t) {
		return t === void 0 && (t = !1), this.at(this.pos, t);
	};
	le.prototype.lookahead = function (t) {
		return (
			t === void 0 && (t = !1), this.at(this.nextIndex(this.pos, t), t)
		);
	};
	le.prototype.advance = function (t) {
		t === void 0 && (t = !1), (this.pos = this.nextIndex(this.pos, t));
	};
	le.prototype.eat = function (t, i) {
		return (
			i === void 0 && (i = !1),
			this.current(i) === t ? (this.advance(i), !0) : !1
		);
	};
	le.prototype.eatChars = function (t, i) {
		i === void 0 && (i = !1);
		for (var r = this.pos, n = 0, a = t; n < a.length; n += 1) {
			var s = a[n],
				o = this.at(r, i);
			if (o === -1 || o !== s) return !1;
			r = this.nextIndex(r, i);
		}
		return (this.pos = r), !0;
	};
	A.validateRegExpFlags = function (e) {
		for (
			var t = e.validFlags, i = e.flags, r = !1, n = !1, a = 0;
			a < i.length;
			a++
		) {
			var s = i.charAt(a);
			t.indexOf(s) === -1 &&
				this.raise(e.start, 'Invalid regular expression flag'),
				i.indexOf(s, a + 1) > -1 &&
					this.raise(e.start, 'Duplicate regular expression flag'),
				s === 'u' && (r = !0),
				s === 'v' && (n = !0);
		}
		this.options.ecmaVersion >= 15 &&
			r &&
			n &&
			this.raise(e.start, 'Invalid regular expression flag');
	};
	A.validateRegExpPattern = function (e) {
		this.regexp_pattern(e),
			!e.switchN &&
				this.options.ecmaVersion >= 9 &&
				e.groupNames.length > 0 &&
				((e.switchN = !0), this.regexp_pattern(e));
	};
	A.regexp_pattern = function (e) {
		(e.pos = 0),
			(e.lastIntValue = 0),
			(e.lastStringValue = ''),
			(e.lastAssertionIsQuantifiable = !1),
			(e.numCapturingParens = 0),
			(e.maxBackReference = 0),
			(e.groupNames.length = 0),
			(e.backReferenceNames.length = 0),
			this.regexp_disjunction(e),
			e.pos !== e.source.length &&
				(e.eat(41) && e.raise("Unmatched ')'"),
				(e.eat(93) || e.eat(125)) &&
					e.raise('Lone quantifier brackets')),
			e.maxBackReference > e.numCapturingParens &&
				e.raise('Invalid escape');
		for (var t = 0, i = e.backReferenceNames; t < i.length; t += 1) {
			var r = i[t];
			e.groupNames.indexOf(r) === -1 &&
				e.raise('Invalid named capture referenced');
		}
	};
	A.regexp_disjunction = function (e) {
		for (this.regexp_alternative(e); e.eat(124); )
			this.regexp_alternative(e);
		this.regexp_eatQuantifier(e, !0) && e.raise('Nothing to repeat'),
			e.eat(123) && e.raise('Lone quantifier brackets');
	};
	A.regexp_alternative = function (e) {
		for (; e.pos < e.source.length && this.regexp_eatTerm(e); );
	};
	A.regexp_eatTerm = function (e) {
		return this.regexp_eatAssertion(e)
			? (e.lastAssertionIsQuantifiable &&
					this.regexp_eatQuantifier(e) &&
					e.switchU &&
					e.raise('Invalid quantifier'),
				!0)
			: (
						e.switchU
							? this.regexp_eatAtom(e)
							: this.regexp_eatExtendedAtom(e)
				  )
				? (this.regexp_eatQuantifier(e), !0)
				: !1;
	};
	A.regexp_eatAssertion = function (e) {
		var t = e.pos;
		if (((e.lastAssertionIsQuantifiable = !1), e.eat(94) || e.eat(36)))
			return !0;
		if (e.eat(92)) {
			if (e.eat(66) || e.eat(98)) return !0;
			e.pos = t;
		}
		if (e.eat(40) && e.eat(63)) {
			var i = !1;
			if (
				(this.options.ecmaVersion >= 9 && (i = e.eat(60)),
				e.eat(61) || e.eat(33))
			)
				return (
					this.regexp_disjunction(e),
					e.eat(41) || e.raise('Unterminated group'),
					(e.lastAssertionIsQuantifiable = !i),
					!0
				);
		}
		return (e.pos = t), !1;
	};
	A.regexp_eatQuantifier = function (e, t) {
		return (
			t === void 0 && (t = !1),
			this.regexp_eatQuantifierPrefix(e, t) ? (e.eat(63), !0) : !1
		);
	};
	A.regexp_eatQuantifierPrefix = function (e, t) {
		return (
			e.eat(42) ||
			e.eat(43) ||
			e.eat(63) ||
			this.regexp_eatBracedQuantifier(e, t)
		);
	};
	A.regexp_eatBracedQuantifier = function (e, t) {
		var i = e.pos;
		if (e.eat(123)) {
			var r = 0,
				n = -1;
			if (
				this.regexp_eatDecimalDigits(e) &&
				((r = e.lastIntValue),
				e.eat(44) &&
					this.regexp_eatDecimalDigits(e) &&
					(n = e.lastIntValue),
				e.eat(125))
			)
				return (
					n !== -1 &&
						n < r &&
						!t &&
						e.raise('numbers out of order in {} quantifier'),
					!0
				);
			e.switchU && !t && e.raise('Incomplete quantifier'), (e.pos = i);
		}
		return !1;
	};
	A.regexp_eatAtom = function (e) {
		return (
			this.regexp_eatPatternCharacters(e) ||
			e.eat(46) ||
			this.regexp_eatReverseSolidusAtomEscape(e) ||
			this.regexp_eatCharacterClass(e) ||
			this.regexp_eatUncapturingGroup(e) ||
			this.regexp_eatCapturingGroup(e)
		);
	};
	A.regexp_eatReverseSolidusAtomEscape = function (e) {
		var t = e.pos;
		if (e.eat(92)) {
			if (this.regexp_eatAtomEscape(e)) return !0;
			e.pos = t;
		}
		return !1;
	};
	A.regexp_eatUncapturingGroup = function (e) {
		var t = e.pos;
		if (e.eat(40)) {
			if (e.eat(63) && e.eat(58)) {
				if ((this.regexp_disjunction(e), e.eat(41))) return !0;
				e.raise('Unterminated group');
			}
			e.pos = t;
		}
		return !1;
	};
	A.regexp_eatCapturingGroup = function (e) {
		if (e.eat(40)) {
			if (
				(this.options.ecmaVersion >= 9
					? this.regexp_groupSpecifier(e)
					: e.current() === 63 && e.raise('Invalid group'),
				this.regexp_disjunction(e),
				e.eat(41))
			)
				return (e.numCapturingParens += 1), !0;
			e.raise('Unterminated group');
		}
		return !1;
	};
	A.regexp_eatExtendedAtom = function (e) {
		return (
			e.eat(46) ||
			this.regexp_eatReverseSolidusAtomEscape(e) ||
			this.regexp_eatCharacterClass(e) ||
			this.regexp_eatUncapturingGroup(e) ||
			this.regexp_eatCapturingGroup(e) ||
			this.regexp_eatInvalidBracedQuantifier(e) ||
			this.regexp_eatExtendedPatternCharacter(e)
		);
	};
	A.regexp_eatInvalidBracedQuantifier = function (e) {
		return (
			this.regexp_eatBracedQuantifier(e, !0) &&
				e.raise('Nothing to repeat'),
			!1
		);
	};
	A.regexp_eatSyntaxCharacter = function (e) {
		var t = e.current();
		return Xr(t) ? ((e.lastIntValue = t), e.advance(), !0) : !1;
	};
	function Xr(e) {
		return (
			e === 36 ||
			(e >= 40 && e <= 43) ||
			e === 46 ||
			e === 63 ||
			(e >= 91 && e <= 94) ||
			(e >= 123 && e <= 125)
		);
	}
	A.regexp_eatPatternCharacters = function (e) {
		for (var t = e.pos, i = 0; (i = e.current()) !== -1 && !Xr(i); )
			e.advance();
		return e.pos !== t;
	};
	A.regexp_eatExtendedPatternCharacter = function (e) {
		var t = e.current();
		return t !== -1 &&
			t !== 36 &&
			!(t >= 40 && t <= 43) &&
			t !== 46 &&
			t !== 63 &&
			t !== 91 &&
			t !== 94 &&
			t !== 124
			? (e.advance(), !0)
			: !1;
	};
	A.regexp_groupSpecifier = function (e) {
		if (e.eat(63)) {
			if (this.regexp_eatGroupName(e)) {
				e.groupNames.indexOf(e.lastStringValue) !== -1 &&
					e.raise('Duplicate capture group name'),
					e.groupNames.push(e.lastStringValue);
				return;
			}
			e.raise('Invalid group');
		}
	};
	A.regexp_eatGroupName = function (e) {
		if (((e.lastStringValue = ''), e.eat(60))) {
			if (this.regexp_eatRegExpIdentifierName(e) && e.eat(62)) return !0;
			e.raise('Invalid capture group name');
		}
		return !1;
	};
	A.regexp_eatRegExpIdentifierName = function (e) {
		if (
			((e.lastStringValue = ''), this.regexp_eatRegExpIdentifierStart(e))
		) {
			for (
				e.lastStringValue += ge(e.lastIntValue);
				this.regexp_eatRegExpIdentifierPart(e);

			)
				e.lastStringValue += ge(e.lastIntValue);
			return !0;
		}
		return !1;
	};
	A.regexp_eatRegExpIdentifierStart = function (e) {
		var t = e.pos,
			i = this.options.ecmaVersion >= 11,
			r = e.current(i);
		return (
			e.advance(i),
			r === 92 &&
				this.regexp_eatRegExpUnicodeEscapeSequence(e, i) &&
				(r = e.lastIntValue),
			Qa(r) ? ((e.lastIntValue = r), !0) : ((e.pos = t), !1)
		);
	};
	function Qa(e) {
		return he(e, !0) || e === 36 || e === 95;
	}
	A.regexp_eatRegExpIdentifierPart = function (e) {
		var t = e.pos,
			i = this.options.ecmaVersion >= 11,
			r = e.current(i);
		return (
			e.advance(i),
			r === 92 &&
				this.regexp_eatRegExpUnicodeEscapeSequence(e, i) &&
				(r = e.lastIntValue),
			Ya(r) ? ((e.lastIntValue = r), !0) : ((e.pos = t), !1)
		);
	};
	function Ya(e) {
		return we(e, !0) || e === 36 || e === 95 || e === 8204 || e === 8205;
	}
	A.regexp_eatAtomEscape = function (e) {
		return this.regexp_eatBackReference(e) ||
			this.regexp_eatCharacterClassEscape(e) ||
			this.regexp_eatCharacterEscape(e) ||
			(e.switchN && this.regexp_eatKGroupName(e))
			? !0
			: (e.switchU &&
					(e.current() === 99 && e.raise('Invalid unicode escape'),
					e.raise('Invalid escape')),
				!1);
	};
	A.regexp_eatBackReference = function (e) {
		var t = e.pos;
		if (this.regexp_eatDecimalEscape(e)) {
			var i = e.lastIntValue;
			if (e.switchU)
				return i > e.maxBackReference && (e.maxBackReference = i), !0;
			if (i <= e.numCapturingParens) return !0;
			e.pos = t;
		}
		return !1;
	};
	A.regexp_eatKGroupName = function (e) {
		if (e.eat(107)) {
			if (this.regexp_eatGroupName(e))
				return e.backReferenceNames.push(e.lastStringValue), !0;
			e.raise('Invalid named reference');
		}
		return !1;
	};
	A.regexp_eatCharacterEscape = function (e) {
		return (
			this.regexp_eatControlEscape(e) ||
			this.regexp_eatCControlLetter(e) ||
			this.regexp_eatZero(e) ||
			this.regexp_eatHexEscapeSequence(e) ||
			this.regexp_eatRegExpUnicodeEscapeSequence(e, !1) ||
			(!e.switchU && this.regexp_eatLegacyOctalEscapeSequence(e)) ||
			this.regexp_eatIdentityEscape(e)
		);
	};
	A.regexp_eatCControlLetter = function (e) {
		var t = e.pos;
		if (e.eat(99)) {
			if (this.regexp_eatControlLetter(e)) return !0;
			e.pos = t;
		}
		return !1;
	};
	A.regexp_eatZero = function (e) {
		return e.current() === 48 && !st(e.lookahead())
			? ((e.lastIntValue = 0), e.advance(), !0)
			: !1;
	};
	A.regexp_eatControlEscape = function (e) {
		var t = e.current();
		return t === 116
			? ((e.lastIntValue = 9), e.advance(), !0)
			: t === 110
				? ((e.lastIntValue = 10), e.advance(), !0)
				: t === 118
					? ((e.lastIntValue = 11), e.advance(), !0)
					: t === 102
						? ((e.lastIntValue = 12), e.advance(), !0)
						: t === 114
							? ((e.lastIntValue = 13), e.advance(), !0)
							: !1;
	};
	A.regexp_eatControlLetter = function (e) {
		var t = e.current();
		return Jr(t) ? ((e.lastIntValue = t % 32), e.advance(), !0) : !1;
	};
	function Jr(e) {
		return (e >= 65 && e <= 90) || (e >= 97 && e <= 122);
	}
	A.regexp_eatRegExpUnicodeEscapeSequence = function (e, t) {
		t === void 0 && (t = !1);
		var i = e.pos,
			r = t || e.switchU;
		if (e.eat(117)) {
			if (this.regexp_eatFixedHexDigits(e, 4)) {
				var n = e.lastIntValue;
				if (r && n >= 55296 && n <= 56319) {
					var a = e.pos;
					if (
						e.eat(92) &&
						e.eat(117) &&
						this.regexp_eatFixedHexDigits(e, 4)
					) {
						var s = e.lastIntValue;
						if (s >= 56320 && s <= 57343)
							return (
								(e.lastIntValue =
									(n - 55296) * 1024 + (s - 56320) + 65536),
								!0
							);
					}
					(e.pos = a), (e.lastIntValue = n);
				}
				return !0;
			}
			if (
				r &&
				e.eat(123) &&
				this.regexp_eatHexDigits(e) &&
				e.eat(125) &&
				Xa(e.lastIntValue)
			)
				return !0;
			r && e.raise('Invalid unicode escape'), (e.pos = i);
		}
		return !1;
	};
	function Xa(e) {
		return e >= 0 && e <= 1114111;
	}
	A.regexp_eatIdentityEscape = function (e) {
		if (e.switchU)
			return this.regexp_eatSyntaxCharacter(e)
				? !0
				: e.eat(47)
					? ((e.lastIntValue = 47), !0)
					: !1;
		var t = e.current();
		return t !== 99 && (!e.switchN || t !== 107)
			? ((e.lastIntValue = t), e.advance(), !0)
			: !1;
	};
	A.regexp_eatDecimalEscape = function (e) {
		e.lastIntValue = 0;
		var t = e.current();
		if (t >= 49 && t <= 57) {
			do (e.lastIntValue = 10 * e.lastIntValue + (t - 48)), e.advance();
			while ((t = e.current()) >= 48 && t <= 57);
			return !0;
		}
		return !1;
	};
	var Zr = 0,
		pe = 1,
		re = 2;
	A.regexp_eatCharacterClassEscape = function (e) {
		var t = e.current();
		if (Ja(t)) return (e.lastIntValue = -1), e.advance(), pe;
		var i = !1;
		if (
			e.switchU &&
			this.options.ecmaVersion >= 9 &&
			((i = t === 80) || t === 112)
		) {
			(e.lastIntValue = -1), e.advance();
			var r;
			if (
				e.eat(123) &&
				(r = this.regexp_eatUnicodePropertyValueExpression(e)) &&
				e.eat(125)
			)
				return i && r === re && e.raise('Invalid property name'), r;
			e.raise('Invalid property name');
		}
		return Zr;
	};
	function Ja(e) {
		return (
			e === 100 ||
			e === 68 ||
			e === 115 ||
			e === 83 ||
			e === 119 ||
			e === 87
		);
	}
	A.regexp_eatUnicodePropertyValueExpression = function (e) {
		var t = e.pos;
		if (this.regexp_eatUnicodePropertyName(e) && e.eat(61)) {
			var i = e.lastStringValue;
			if (this.regexp_eatUnicodePropertyValue(e)) {
				var r = e.lastStringValue;
				return (
					this.regexp_validateUnicodePropertyNameAndValue(e, i, r), pe
				);
			}
		}
		if (((e.pos = t), this.regexp_eatLoneUnicodePropertyNameOrValue(e))) {
			var n = e.lastStringValue;
			return this.regexp_validateUnicodePropertyNameOrValue(e, n);
		}
		return Zr;
	};
	A.regexp_validateUnicodePropertyNameAndValue = function (e, t, i) {
		Me(e.unicodeProperties.nonBinary, t) ||
			e.raise('Invalid property name'),
			e.unicodeProperties.nonBinary[t].test(i) ||
				e.raise('Invalid property value');
	};
	A.regexp_validateUnicodePropertyNameOrValue = function (e, t) {
		if (e.unicodeProperties.binary.test(t)) return pe;
		if (e.switchV && e.unicodeProperties.binaryOfStrings.test(t)) return re;
		e.raise('Invalid property name');
	};
	A.regexp_eatUnicodePropertyName = function (e) {
		var t = 0;
		for (e.lastStringValue = ''; en((t = e.current())); )
			(e.lastStringValue += ge(t)), e.advance();
		return e.lastStringValue !== '';
	};
	function en(e) {
		return Jr(e) || e === 95;
	}
	A.regexp_eatUnicodePropertyValue = function (e) {
		var t = 0;
		for (e.lastStringValue = ''; Za((t = e.current())); )
			(e.lastStringValue += ge(t)), e.advance();
		return e.lastStringValue !== '';
	};
	function Za(e) {
		return en(e) || st(e);
	}
	A.regexp_eatLoneUnicodePropertyNameOrValue = function (e) {
		return this.regexp_eatUnicodePropertyValue(e);
	};
	A.regexp_eatCharacterClass = function (e) {
		if (e.eat(91)) {
			var t = e.eat(94),
				i = this.regexp_classContents(e);
			return (
				e.eat(93) || e.raise('Unterminated character class'),
				t &&
					i === re &&
					e.raise('Negated character class may contain strings'),
				!0
			);
		}
		return !1;
	};
	A.regexp_classContents = function (e) {
		return e.current() === 93
			? pe
			: e.switchV
				? this.regexp_classSetExpression(e)
				: (this.regexp_nonEmptyClassRanges(e), pe);
	};
	A.regexp_nonEmptyClassRanges = function (e) {
		for (; this.regexp_eatClassAtom(e); ) {
			var t = e.lastIntValue;
			if (e.eat(45) && this.regexp_eatClassAtom(e)) {
				var i = e.lastIntValue;
				e.switchU &&
					(t === -1 || i === -1) &&
					e.raise('Invalid character class'),
					t !== -1 &&
						i !== -1 &&
						t > i &&
						e.raise('Range out of order in character class');
			}
		}
	};
	A.regexp_eatClassAtom = function (e) {
		var t = e.pos;
		if (e.eat(92)) {
			if (this.regexp_eatClassEscape(e)) return !0;
			if (e.switchU) {
				var i = e.current();
				(i === 99 || nn(i)) && e.raise('Invalid class escape'),
					e.raise('Invalid escape');
			}
			e.pos = t;
		}
		var r = e.current();
		return r !== 93 ? ((e.lastIntValue = r), e.advance(), !0) : !1;
	};
	A.regexp_eatClassEscape = function (e) {
		var t = e.pos;
		if (e.eat(98)) return (e.lastIntValue = 8), !0;
		if (e.switchU && e.eat(45)) return (e.lastIntValue = 45), !0;
		if (!e.switchU && e.eat(99)) {
			if (this.regexp_eatClassControlLetter(e)) return !0;
			e.pos = t;
		}
		return (
			this.regexp_eatCharacterClassEscape(e) ||
			this.regexp_eatCharacterEscape(e)
		);
	};
	A.regexp_classSetExpression = function (e) {
		var t = pe,
			i;
		if (!this.regexp_eatClassSetRange(e))
			if ((i = this.regexp_eatClassSetOperand(e))) {
				i === re && (t = re);
				for (var r = e.pos; e.eatChars([38, 38]); ) {
					if (
						e.current() !== 38 &&
						(i = this.regexp_eatClassSetOperand(e))
					) {
						i !== re && (t = pe);
						continue;
					}
					e.raise('Invalid character in character class');
				}
				if (r !== e.pos) return t;
				for (; e.eatChars([45, 45]); )
					this.regexp_eatClassSetOperand(e) ||
						e.raise('Invalid character in character class');
				if (r !== e.pos) return t;
			} else e.raise('Invalid character in character class');
		for (;;)
			if (!this.regexp_eatClassSetRange(e)) {
				if (((i = this.regexp_eatClassSetOperand(e)), !i)) return t;
				i === re && (t = re);
			}
	};
	A.regexp_eatClassSetRange = function (e) {
		var t = e.pos;
		if (this.regexp_eatClassSetCharacter(e)) {
			var i = e.lastIntValue;
			if (e.eat(45) && this.regexp_eatClassSetCharacter(e)) {
				var r = e.lastIntValue;
				return (
					i !== -1 &&
						r !== -1 &&
						i > r &&
						e.raise('Range out of order in character class'),
					!0
				);
			}
			e.pos = t;
		}
		return !1;
	};
	A.regexp_eatClassSetOperand = function (e) {
		return this.regexp_eatClassSetCharacter(e)
			? pe
			: this.regexp_eatClassStringDisjunction(e) ||
					this.regexp_eatNestedClass(e);
	};
	A.regexp_eatNestedClass = function (e) {
		var t = e.pos;
		if (e.eat(91)) {
			var i = e.eat(94),
				r = this.regexp_classContents(e);
			if (e.eat(93))
				return (
					i &&
						r === re &&
						e.raise('Negated character class may contain strings'),
					r
				);
			e.pos = t;
		}
		if (e.eat(92)) {
			var n = this.regexp_eatCharacterClassEscape(e);
			if (n) return n;
			e.pos = t;
		}
		return null;
	};
	A.regexp_eatClassStringDisjunction = function (e) {
		var t = e.pos;
		if (e.eatChars([92, 113])) {
			if (e.eat(123)) {
				var i = this.regexp_classStringDisjunctionContents(e);
				if (e.eat(125)) return i;
			} else e.raise('Invalid escape');
			e.pos = t;
		}
		return null;
	};
	A.regexp_classStringDisjunctionContents = function (e) {
		for (var t = this.regexp_classString(e); e.eat(124); )
			this.regexp_classString(e) === re && (t = re);
		return t;
	};
	A.regexp_classString = function (e) {
		for (var t = 0; this.regexp_eatClassSetCharacter(e); ) t++;
		return t === 1 ? pe : re;
	};
	A.regexp_eatClassSetCharacter = function (e) {
		var t = e.pos;
		if (e.eat(92))
			return this.regexp_eatCharacterEscape(e) ||
				this.regexp_eatClassSetReservedPunctuator(e)
				? !0
				: e.eat(98)
					? ((e.lastIntValue = 8), !0)
					: ((e.pos = t), !1);
		var i = e.current();
		return i < 0 || (i === e.lookahead() && es(i)) || ts(i)
			? !1
			: (e.advance(), (e.lastIntValue = i), !0);
	};
	function es(e) {
		return (
			e === 33 ||
			(e >= 35 && e <= 38) ||
			(e >= 42 && e <= 44) ||
			e === 46 ||
			(e >= 58 && e <= 64) ||
			e === 94 ||
			e === 96 ||
			e === 126
		);
	}
	function ts(e) {
		return (
			e === 40 ||
			e === 41 ||
			e === 45 ||
			e === 47 ||
			(e >= 91 && e <= 93) ||
			(e >= 123 && e <= 125)
		);
	}
	A.regexp_eatClassSetReservedPunctuator = function (e) {
		var t = e.current();
		return is(t) ? ((e.lastIntValue = t), e.advance(), !0) : !1;
	};
	function is(e) {
		return (
			e === 33 ||
			e === 35 ||
			e === 37 ||
			e === 38 ||
			e === 44 ||
			e === 45 ||
			(e >= 58 && e <= 62) ||
			e === 64 ||
			e === 96 ||
			e === 126
		);
	}
	A.regexp_eatClassControlLetter = function (e) {
		var t = e.current();
		return st(t) || t === 95
			? ((e.lastIntValue = t % 32), e.advance(), !0)
			: !1;
	};
	A.regexp_eatHexEscapeSequence = function (e) {
		var t = e.pos;
		if (e.eat(120)) {
			if (this.regexp_eatFixedHexDigits(e, 2)) return !0;
			e.switchU && e.raise('Invalid escape'), (e.pos = t);
		}
		return !1;
	};
	A.regexp_eatDecimalDigits = function (e) {
		var t = e.pos,
			i = 0;
		for (e.lastIntValue = 0; st((i = e.current())); )
			(e.lastIntValue = 10 * e.lastIntValue + (i - 48)), e.advance();
		return e.pos !== t;
	};
	function st(e) {
		return e >= 48 && e <= 57;
	}
	A.regexp_eatHexDigits = function (e) {
		var t = e.pos,
			i = 0;
		for (e.lastIntValue = 0; tn((i = e.current())); )
			(e.lastIntValue = 16 * e.lastIntValue + rn(i)), e.advance();
		return e.pos !== t;
	};
	function tn(e) {
		return (
			(e >= 48 && e <= 57) ||
			(e >= 65 && e <= 70) ||
			(e >= 97 && e <= 102)
		);
	}
	function rn(e) {
		return e >= 65 && e <= 70
			? 10 + (e - 65)
			: e >= 97 && e <= 102
				? 10 + (e - 97)
				: e - 48;
	}
	A.regexp_eatLegacyOctalEscapeSequence = function (e) {
		if (this.regexp_eatOctalDigit(e)) {
			var t = e.lastIntValue;
			if (this.regexp_eatOctalDigit(e)) {
				var i = e.lastIntValue;
				t <= 3 && this.regexp_eatOctalDigit(e)
					? (e.lastIntValue = t * 64 + i * 8 + e.lastIntValue)
					: (e.lastIntValue = t * 8 + i);
			} else e.lastIntValue = t;
			return !0;
		}
		return !1;
	};
	A.regexp_eatOctalDigit = function (e) {
		var t = e.current();
		return nn(t)
			? ((e.lastIntValue = t - 48), e.advance(), !0)
			: ((e.lastIntValue = 0), !1);
	};
	function nn(e) {
		return e >= 48 && e <= 55;
	}
	A.regexp_eatFixedHexDigits = function (e, t) {
		var i = e.pos;
		e.lastIntValue = 0;
		for (var r = 0; r < t; ++r) {
			var n = e.current();
			if (!tn(n)) return (e.pos = i), !1;
			(e.lastIntValue = 16 * e.lastIntValue + rn(n)), e.advance();
		}
		return !0;
	};
	var Xt = function (t) {
			(this.type = t.type),
				(this.value = t.value),
				(this.start = t.start),
				(this.end = t.end),
				t.options.locations &&
					(this.loc = new rt(t, t.startLoc, t.endLoc)),
				t.options.ranges && (this.range = [t.start, t.end]);
		},
		B = q.prototype;
	B.next = function (e) {
		!e &&
			this.type.keyword &&
			this.containsEsc &&
			this.raiseRecoverable(
				this.start,
				'Escape sequence in keyword ' + this.type.keyword
			),
			this.options.onToken && this.options.onToken(new Xt(this)),
			(this.lastTokEnd = this.end),
			(this.lastTokStart = this.start),
			(this.lastTokEndLoc = this.endLoc),
			(this.lastTokStartLoc = this.startLoc),
			this.nextToken();
	};
	B.getToken = function () {
		return this.next(), new Xt(this);
	};
	typeof Symbol < 'u' &&
		(B[Symbol.iterator] = function () {
			var e = this;
			return {
				next: function () {
					var t = e.getToken();
					return { done: t.type === u.eof, value: t };
				}
			};
		});
	B.nextToken = function () {
		var e = this.curContext();
		if (
			((!e || !e.preserveSpace) && this.skipSpace(),
			(this.start = this.pos),
			this.options.locations && (this.startLoc = this.curPosition()),
			this.pos >= this.input.length)
		)
			return this.finishToken(u.eof);
		if (e.override) return e.override(this);
		this.readToken(this.fullCharCodeAtPos());
	};
	B.readToken = function (e) {
		return he(e, this.options.ecmaVersion >= 6) || e === 92
			? this.readWord()
			: this.getTokenFromCode(e);
	};
	B.fullCharCodeAtPos = function () {
		var e = this.input.charCodeAt(this.pos);
		if (e <= 55295 || e >= 56320) return e;
		var t = this.input.charCodeAt(this.pos + 1);
		return t <= 56319 || t >= 57344 ? e : (e << 10) + t - 56613888;
	};
	B.skipBlockComment = function () {
		var e = this.options.onComment && this.curPosition(),
			t = this.pos,
			i = this.input.indexOf('*/', (this.pos += 2));
		if (
			(i === -1 && this.raise(this.pos - 2, 'Unterminated comment'),
			(this.pos = i + 2),
			this.options.locations)
		)
			for (
				var r = void 0, n = t;
				(r = kr(this.input, n, this.pos)) > -1;

			)
				++this.curLine, (n = this.lineStart = r);
		this.options.onComment &&
			this.options.onComment(
				!0,
				this.input.slice(t + 2, i),
				t,
				this.pos,
				e,
				this.curPosition()
			);
	};
	B.skipLineComment = function (e) {
		for (
			var t = this.pos,
				i = this.options.onComment && this.curPosition(),
				r = this.input.charCodeAt((this.pos += e));
			this.pos < this.input.length && !Se(r);

		)
			r = this.input.charCodeAt(++this.pos);
		this.options.onComment &&
			this.options.onComment(
				!1,
				this.input.slice(t + e, this.pos),
				t,
				this.pos,
				i,
				this.curPosition()
			);
	};
	B.skipSpace = function () {
		e: for (; this.pos < this.input.length; ) {
			var e = this.input.charCodeAt(this.pos);
			switch (e) {
				case 32:
				case 160:
					++this.pos;
					break;
				case 13:
					this.input.charCodeAt(this.pos + 1) === 10 && ++this.pos;
				case 10:
				case 8232:
				case 8233:
					++this.pos,
						this.options.locations &&
							(++this.curLine, (this.lineStart = this.pos));
					break;
				case 47:
					switch (this.input.charCodeAt(this.pos + 1)) {
						case 42:
							this.skipBlockComment();
							break;
						case 47:
							this.skipLineComment(2);
							break;
						default:
							break e;
					}
					break;
				default:
					if (
						(e > 8 && e < 14) ||
						(e >= 5760 && Ar.test(String.fromCharCode(e)))
					)
						++this.pos;
					else break e;
			}
		}
	};
	B.finishToken = function (e, t) {
		(this.end = this.pos),
			this.options.locations && (this.endLoc = this.curPosition());
		var i = this.type;
		(this.type = e), (this.value = t), this.updateContext(i);
	};
	B.readToken_dot = function () {
		var e = this.input.charCodeAt(this.pos + 1);
		if (e >= 48 && e <= 57) return this.readNumber(!0);
		var t = this.input.charCodeAt(this.pos + 2);
		return this.options.ecmaVersion >= 6 && e === 46 && t === 46
			? ((this.pos += 3), this.finishToken(u.ellipsis))
			: (++this.pos, this.finishToken(u.dot));
	};
	B.readToken_slash = function () {
		var e = this.input.charCodeAt(this.pos + 1);
		return this.exprAllowed
			? (++this.pos, this.readRegexp())
			: e === 61
				? this.finishOp(u.assign, 2)
				: this.finishOp(u.slash, 1);
	};
	B.readToken_mult_modulo_exp = function (e) {
		var t = this.input.charCodeAt(this.pos + 1),
			i = 1,
			r = e === 42 ? u.star : u.modulo;
		return (
			this.options.ecmaVersion >= 7 &&
				e === 42 &&
				t === 42 &&
				(++i,
				(r = u.starstar),
				(t = this.input.charCodeAt(this.pos + 2))),
			t === 61 ? this.finishOp(u.assign, i + 1) : this.finishOp(r, i)
		);
	};
	B.readToken_pipe_amp = function (e) {
		var t = this.input.charCodeAt(this.pos + 1);
		if (t === e) {
			if (this.options.ecmaVersion >= 12) {
				var i = this.input.charCodeAt(this.pos + 2);
				if (i === 61) return this.finishOp(u.assign, 3);
			}
			return this.finishOp(e === 124 ? u.logicalOR : u.logicalAND, 2);
		}
		return t === 61
			? this.finishOp(u.assign, 2)
			: this.finishOp(e === 124 ? u.bitwiseOR : u.bitwiseAND, 1);
	};
	B.readToken_caret = function () {
		var e = this.input.charCodeAt(this.pos + 1);
		return e === 61
			? this.finishOp(u.assign, 2)
			: this.finishOp(u.bitwiseXOR, 1);
	};
	B.readToken_plus_min = function (e) {
		var t = this.input.charCodeAt(this.pos + 1);
		return t === e
			? t === 45 &&
				!this.inModule &&
				this.input.charCodeAt(this.pos + 2) === 62 &&
				(this.lastTokEnd === 0 ||
					ne.test(this.input.slice(this.lastTokEnd, this.pos)))
				? (this.skipLineComment(3), this.skipSpace(), this.nextToken())
				: this.finishOp(u.incDec, 2)
			: t === 61
				? this.finishOp(u.assign, 2)
				: this.finishOp(u.plusMin, 1);
	};
	B.readToken_lt_gt = function (e) {
		var t = this.input.charCodeAt(this.pos + 1),
			i = 1;
		return t === e
			? ((i =
					e === 62 && this.input.charCodeAt(this.pos + 2) === 62
						? 3
						: 2),
				this.input.charCodeAt(this.pos + i) === 61
					? this.finishOp(u.assign, i + 1)
					: this.finishOp(u.bitShift, i))
			: t === 33 &&
				  e === 60 &&
				  !this.inModule &&
				  this.input.charCodeAt(this.pos + 2) === 45 &&
				  this.input.charCodeAt(this.pos + 3) === 45
				? (this.skipLineComment(4), this.skipSpace(), this.nextToken())
				: (t === 61 && (i = 2), this.finishOp(u.relational, i));
	};
	B.readToken_eq_excl = function (e) {
		var t = this.input.charCodeAt(this.pos + 1);
		return t === 61
			? this.finishOp(
					u.equality,
					this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2
				)
			: e === 61 && t === 62 && this.options.ecmaVersion >= 6
				? ((this.pos += 2), this.finishToken(u.arrow))
				: this.finishOp(e === 61 ? u.eq : u.prefix, 1);
	};
	B.readToken_question = function () {
		var e = this.options.ecmaVersion;
		if (e >= 11) {
			var t = this.input.charCodeAt(this.pos + 1);
			if (t === 46) {
				var i = this.input.charCodeAt(this.pos + 2);
				if (i < 48 || i > 57) return this.finishOp(u.questionDot, 2);
			}
			if (t === 63) {
				if (e >= 12) {
					var r = this.input.charCodeAt(this.pos + 2);
					if (r === 61) return this.finishOp(u.assign, 3);
				}
				return this.finishOp(u.coalesce, 2);
			}
		}
		return this.finishOp(u.question, 1);
	};
	B.readToken_numberSign = function () {
		var e = this.options.ecmaVersion,
			t = 35;
		if (
			e >= 13 &&
			(++this.pos, (t = this.fullCharCodeAtPos()), he(t, !0) || t === 92)
		)
			return this.finishToken(u.privateId, this.readWord1());
		this.raise(this.pos, "Unexpected character '" + ge(t) + "'");
	};
	B.getTokenFromCode = function (e) {
		switch (e) {
			case 46:
				return this.readToken_dot();
			case 40:
				return ++this.pos, this.finishToken(u.parenL);
			case 41:
				return ++this.pos, this.finishToken(u.parenR);
			case 59:
				return ++this.pos, this.finishToken(u.semi);
			case 44:
				return ++this.pos, this.finishToken(u.comma);
			case 91:
				return ++this.pos, this.finishToken(u.bracketL);
			case 93:
				return ++this.pos, this.finishToken(u.bracketR);
			case 123:
				return ++this.pos, this.finishToken(u.braceL);
			case 125:
				return ++this.pos, this.finishToken(u.braceR);
			case 58:
				return ++this.pos, this.finishToken(u.colon);
			case 96:
				if (this.options.ecmaVersion < 6) break;
				return ++this.pos, this.finishToken(u.backQuote);
			case 48:
				var t = this.input.charCodeAt(this.pos + 1);
				if (t === 120 || t === 88) return this.readRadixNumber(16);
				if (this.options.ecmaVersion >= 6) {
					if (t === 111 || t === 79) return this.readRadixNumber(8);
					if (t === 98 || t === 66) return this.readRadixNumber(2);
				}
			case 49:
			case 50:
			case 51:
			case 52:
			case 53:
			case 54:
			case 55:
			case 56:
			case 57:
				return this.readNumber(!1);
			case 34:
			case 39:
				return this.readString(e);
			case 47:
				return this.readToken_slash();
			case 37:
			case 42:
				return this.readToken_mult_modulo_exp(e);
			case 124:
			case 38:
				return this.readToken_pipe_amp(e);
			case 94:
				return this.readToken_caret();
			case 43:
			case 45:
				return this.readToken_plus_min(e);
			case 60:
			case 62:
				return this.readToken_lt_gt(e);
			case 61:
			case 33:
				return this.readToken_eq_excl(e);
			case 63:
				return this.readToken_question();
			case 126:
				return this.finishOp(u.prefix, 1);
			case 35:
				return this.readToken_numberSign();
		}
		this.raise(this.pos, "Unexpected character '" + ge(e) + "'");
	};
	B.finishOp = function (e, t) {
		var i = this.input.slice(this.pos, this.pos + t);
		return (this.pos += t), this.finishToken(e, i);
	};
	B.readRegexp = function () {
		for (var e, t, i = this.pos; ; ) {
			this.pos >= this.input.length &&
				this.raise(i, 'Unterminated regular expression');
			var r = this.input.charAt(this.pos);
			if (
				(ne.test(r) && this.raise(i, 'Unterminated regular expression'),
				e)
			)
				e = !1;
			else {
				if (r === '[') t = !0;
				else if (r === ']' && t) t = !1;
				else if (r === '/' && !t) break;
				e = r === '\\';
			}
			++this.pos;
		}
		var n = this.input.slice(i, this.pos);
		++this.pos;
		var a = this.pos,
			s = this.readWord1();
		this.containsEsc && this.unexpected(a);
		var o = this.regexpState || (this.regexpState = new le(this));
		o.reset(i, n, s),
			this.validateRegExpFlags(o),
			this.validateRegExpPattern(o);
		var c = null;
		try {
			c = new RegExp(n, s);
		} catch {}
		return this.finishToken(u.regexp, { pattern: n, flags: s, value: c });
	};
	B.readInt = function (e, t, i) {
		for (
			var r = this.options.ecmaVersion >= 12 && t === void 0,
				n = i && this.input.charCodeAt(this.pos) === 48,
				a = this.pos,
				s = 0,
				o = 0,
				c = 0,
				l = t ?? 1 / 0;
			c < l;
			++c, ++this.pos
		) {
			var p = this.input.charCodeAt(this.pos),
				f = void 0;
			if (r && p === 95) {
				n &&
					this.raiseRecoverable(
						this.pos,
						'Numeric separator is not allowed in legacy octal numeric literals'
					),
					o === 95 &&
						this.raiseRecoverable(
							this.pos,
							'Numeric separator must be exactly one underscore'
						),
					c === 0 &&
						this.raiseRecoverable(
							this.pos,
							'Numeric separator is not allowed at the first of digits'
						),
					(o = p);
				continue;
			}
			if (
				(p >= 97
					? (f = p - 97 + 10)
					: p >= 65
						? (f = p - 65 + 10)
						: p >= 48 && p <= 57
							? (f = p - 48)
							: (f = 1 / 0),
				f >= e)
			)
				break;
			(o = p), (s = s * e + f);
		}
		return (
			r &&
				o === 95 &&
				this.raiseRecoverable(
					this.pos - 1,
					'Numeric separator is not allowed at the last of digits'
				),
			this.pos === a || (t != null && this.pos - a !== t) ? null : s
		);
	};
	function rs(e, t) {
		return t ? parseInt(e, 8) : parseFloat(e.replace(/_/g, ''));
	}
	function an(e) {
		return typeof BigInt != 'function' ? null : BigInt(e.replace(/_/g, ''));
	}
	B.readRadixNumber = function (e) {
		var t = this.pos;
		this.pos += 2;
		var i = this.readInt(e);
		return (
			i == null &&
				this.raise(this.start + 2, 'Expected number in radix ' + e),
			this.options.ecmaVersion >= 11 &&
			this.input.charCodeAt(this.pos) === 110
				? ((i = an(this.input.slice(t, this.pos))), ++this.pos)
				: he(this.fullCharCodeAtPos()) &&
					this.raise(this.pos, 'Identifier directly after number'),
			this.finishToken(u.num, i)
		);
	};
	B.readNumber = function (e) {
		var t = this.pos;
		!e &&
			this.readInt(10, void 0, !0) === null &&
			this.raise(t, 'Invalid number');
		var i = this.pos - t >= 2 && this.input.charCodeAt(t) === 48;
		i && this.strict && this.raise(t, 'Invalid number');
		var r = this.input.charCodeAt(this.pos);
		if (!i && !e && this.options.ecmaVersion >= 11 && r === 110) {
			var n = an(this.input.slice(t, this.pos));
			return (
				++this.pos,
				he(this.fullCharCodeAtPos()) &&
					this.raise(this.pos, 'Identifier directly after number'),
				this.finishToken(u.num, n)
			);
		}
		i && /[89]/.test(this.input.slice(t, this.pos)) && (i = !1),
			r === 46 &&
				!i &&
				(++this.pos,
				this.readInt(10),
				(r = this.input.charCodeAt(this.pos))),
			(r === 69 || r === 101) &&
				!i &&
				((r = this.input.charCodeAt(++this.pos)),
				(r === 43 || r === 45) && ++this.pos,
				this.readInt(10) === null && this.raise(t, 'Invalid number')),
			he(this.fullCharCodeAtPos()) &&
				this.raise(this.pos, 'Identifier directly after number');
		var a = rs(this.input.slice(t, this.pos), i);
		return this.finishToken(u.num, a);
	};
	B.readCodePoint = function () {
		var e = this.input.charCodeAt(this.pos),
			t;
		if (e === 123) {
			this.options.ecmaVersion < 6 && this.unexpected();
			var i = ++this.pos;
			(t = this.readHexChar(
				this.input.indexOf('}', this.pos) - this.pos
			)),
				++this.pos,
				t > 1114111 &&
					this.invalidStringToken(i, 'Code point out of bounds');
		} else t = this.readHexChar(4);
		return t;
	};
	B.readString = function (e) {
		for (var t = '', i = ++this.pos; ; ) {
			this.pos >= this.input.length &&
				this.raise(this.start, 'Unterminated string constant');
			var r = this.input.charCodeAt(this.pos);
			if (r === e) break;
			r === 92
				? ((t += this.input.slice(i, this.pos)),
					(t += this.readEscapedChar(!1)),
					(i = this.pos))
				: r === 8232 || r === 8233
					? (this.options.ecmaVersion < 10 &&
							this.raise(
								this.start,
								'Unterminated string constant'
							),
						++this.pos,
						this.options.locations &&
							(this.curLine++, (this.lineStart = this.pos)))
					: (Se(r) &&
							this.raise(
								this.start,
								'Unterminated string constant'
							),
						++this.pos);
		}
		return (
			(t += this.input.slice(i, this.pos++)),
			this.finishToken(u.string, t)
		);
	};
	var sn = {};
	B.tryReadTemplateToken = function () {
		this.inTemplateElement = !0;
		try {
			this.readTmplToken();
		} catch (e) {
			if (e === sn) this.readInvalidTemplateToken();
			else throw e;
		}
		this.inTemplateElement = !1;
	};
	B.invalidStringToken = function (e, t) {
		if (this.inTemplateElement && this.options.ecmaVersion >= 9) throw sn;
		this.raise(e, t);
	};
	B.readTmplToken = function () {
		for (var e = '', t = this.pos; ; ) {
			this.pos >= this.input.length &&
				this.raise(this.start, 'Unterminated template');
			var i = this.input.charCodeAt(this.pos);
			if (
				i === 96 ||
				(i === 36 && this.input.charCodeAt(this.pos + 1) === 123)
			)
				return this.pos === this.start &&
					(this.type === u.template ||
						this.type === u.invalidTemplate)
					? i === 36
						? ((this.pos += 2), this.finishToken(u.dollarBraceL))
						: (++this.pos, this.finishToken(u.backQuote))
					: ((e += this.input.slice(t, this.pos)),
						this.finishToken(u.template, e));
			if (i === 92)
				(e += this.input.slice(t, this.pos)),
					(e += this.readEscapedChar(!0)),
					(t = this.pos);
			else if (Se(i)) {
				switch (((e += this.input.slice(t, this.pos)), ++this.pos, i)) {
					case 13:
						this.input.charCodeAt(this.pos) === 10 && ++this.pos;
					case 10:
						e += `
`;
						break;
					default:
						e += String.fromCharCode(i);
						break;
				}
				this.options.locations &&
					(++this.curLine, (this.lineStart = this.pos)),
					(t = this.pos);
			} else ++this.pos;
		}
	};
	B.readInvalidTemplateToken = function () {
		for (; this.pos < this.input.length; this.pos++)
			switch (this.input[this.pos]) {
				case '\\':
					++this.pos;
					break;
				case '$':
					if (this.input[this.pos + 1] !== '{') break;
				case '`':
					return this.finishToken(
						u.invalidTemplate,
						this.input.slice(this.start, this.pos)
					);
			}
		this.raise(this.start, 'Unterminated template');
	};
	B.readEscapedChar = function (e) {
		var t = this.input.charCodeAt(++this.pos);
		switch ((++this.pos, t)) {
			case 110:
				return `
`;
			case 114:
				return '\r';
			case 120:
				return String.fromCharCode(this.readHexChar(2));
			case 117:
				return ge(this.readCodePoint());
			case 116:
				return '	';
			case 98:
				return '\b';
			case 118:
				return '\v';
			case 102:
				return '\f';
			case 13:
				this.input.charCodeAt(this.pos) === 10 && ++this.pos;
			case 10:
				return (
					this.options.locations &&
						((this.lineStart = this.pos), ++this.curLine),
					''
				);
			case 56:
			case 57:
				if (
					(this.strict &&
						this.invalidStringToken(
							this.pos - 1,
							'Invalid escape sequence'
						),
					e)
				) {
					var i = this.pos - 1;
					this.invalidStringToken(
						i,
						'Invalid escape sequence in template string'
					);
				}
			default:
				if (t >= 48 && t <= 55) {
					var r = this.input
							.substr(this.pos - 1, 3)
							.match(/^[0-7]+/)[0],
						n = parseInt(r, 8);
					return (
						n > 255 && ((r = r.slice(0, -1)), (n = parseInt(r, 8))),
						(this.pos += r.length - 1),
						(t = this.input.charCodeAt(this.pos)),
						(r !== '0' || t === 56 || t === 57) &&
							(this.strict || e) &&
							this.invalidStringToken(
								this.pos - 1 - r.length,
								e
									? 'Octal literal in template string'
									: 'Octal literal in strict mode'
							),
						String.fromCharCode(n)
					);
				}
				return Se(t) ? '' : String.fromCharCode(t);
		}
	};
	B.readHexChar = function (e) {
		var t = this.pos,
			i = this.readInt(16, e);
		return (
			i === null &&
				this.invalidStringToken(t, 'Bad character escape sequence'),
			i
		);
	};
	B.readWord1 = function () {
		this.containsEsc = !1;
		for (
			var e = '', t = !0, i = this.pos, r = this.options.ecmaVersion >= 6;
			this.pos < this.input.length;

		) {
			var n = this.fullCharCodeAtPos();
			if (we(n, r)) this.pos += n <= 65535 ? 1 : 2;
			else if (n === 92) {
				(this.containsEsc = !0), (e += this.input.slice(i, this.pos));
				var a = this.pos;
				this.input.charCodeAt(++this.pos) !== 117 &&
					this.invalidStringToken(
						this.pos,
						'Expecting Unicode escape sequence \\uXXXX'
					),
					++this.pos;
				var s = this.readCodePoint();
				(t ? he : we)(s, r) ||
					this.invalidStringToken(a, 'Invalid Unicode escape'),
					(e += ge(s)),
					(i = this.pos);
			} else break;
			t = !1;
		}
		return e + this.input.slice(i, this.pos);
	};
	B.readWord = function () {
		var e = this.readWord1(),
			t = u.name;
		return this.keywords.test(e) && (t = Wt[e]), this.finishToken(t, e);
	};
	var ns = '8.11.3';
	q.acorn = {
		Parser: q,
		version: ns,
		defaultOptions: Ut,
		Position: Te,
		SourceLocation: rt,
		getLineInfo: Lr,
		Node: at,
		TokenType: $,
		tokTypes: u,
		keywordTypes: Wt,
		TokContext: se,
		tokContexts: W,
		isIdentifierChar: we,
		isIdentifierStart: he,
		Token: Xt,
		isNewLine: Se,
		lineBreak: ne,
		lineBreakG: Ra,
		nonASCIIwhitespace: Ar
	};
	function on(e, t) {
		return q.parse(e, t);
	}
	var as = globalThis.fetch,
		_e = globalThis.WebSocket,
		ss = globalThis.Request,
		Jt = globalThis.Response,
		ot = globalThis.SharedWorker,
		cn = globalThis.localStorage,
		os = globalThis.navigator.serviceWorker,
		Be = {
			prototype: { send: _e.prototype.send },
			CLOSED: _e.CLOSED,
			CLOSING: _e.CLOSING,
			CONNECTING: _e.CONNECTING,
			OPEN: _e.OPEN
		};
	async function Zt() {
		let t = (
				await self.clients.matchAll({
					type: 'window',
					includeUncontrolled: !0
				})
			).map(async r => {
				let n = await cs(r);
				return await ln(n), n;
			}),
			i = Promise.race([
				Promise.any(t),
				new Promise((r, n) =>
					setTimeout(n, 1e3, new TypeError('timeout'))
				)
			]);
		try {
			return await i;
		} catch (r) {
			if (r instanceof AggregateError)
				throw (
					(console.error(
						'bare-mux: failed to get a bare-mux SharedWorker MessagePort as all clients returned an invalid MessagePort.'
					),
					new Error('All clients returned an invalid MessagePort.'))
				);
			return (
				console.warn(
					'bare-mux: failed to get a bare-mux SharedWorker MessagePort within 1s, retrying'
				),
				await Zt()
			);
		}
	}
	function cs(e) {
		let t = new MessageChannel();
		return new Promise(i => {
			e.postMessage({ type: 'getPort', port: t.port2 }, [t.port2]),
				(t.port1.onmessage = r => {
					i(r.data);
				});
		});
	}
	function ln(e) {
		let t = new MessageChannel(),
			i = new Promise((r, n) => {
				(t.port1.onmessage = a => {
					a.data.type === 'pong' && r();
				}),
					setTimeout(n, 1500);
			});
		return (
			e.postMessage({ message: { type: 'ping' }, port: t.port2 }, [
				t.port2
			]),
			i
		);
	}
	function un(e, t) {
		let i = new ot(e, 'bare-mux-worker');
		return (
			t &&
				os.addEventListener('message', r => {
					if (r.data.type === 'getPort' && r.data.port) {
						console.debug(
							'bare-mux: recieved request for port from sw'
						);
						let n = new ot(e, 'bare-mux-worker');
						r.data.port.postMessage(n.port, [n.port]);
					}
				}),
			i.port
		);
	}
	var ei = class {
		constructor(t) {
			(this.channel = new BroadcastChannel('bare-mux')),
				t instanceof MessagePort
					? (this.port = t)
					: this.createChannel(t, !0);
		}
		createChannel(t, i) {
			if (self.clients)
				(this.port = Zt()),
					(this.channel.onmessage = r => {
						r.data.type === 'refreshPort' && (this.port = Zt());
					});
			else if (t && ot) {
				if (!t.startsWith('/') && !t.includes('://'))
					throw new Error(
						'Invalid URL. Must be absolute or start at the root.'
					);
				(this.port = un(t, i)),
					console.debug(
						'bare-mux: setting localStorage bare-mux-path to',
						t
					),
					(cn['bare-mux-path'] = t);
			} else if (ot) {
				let r = cn['bare-mux-path'];
				if (
					(console.debug(
						'bare-mux: got localStorage bare-mux-path:',
						r
					),
					!r)
				)
					throw new Error(
						'Unable to get bare-mux workerPath from localStorage.'
					);
				this.port = un(r, i);
			} else
				throw new Error('Unable to get a channel to the SharedWorker.');
		}
		async sendMessage(t, i) {
			this.port instanceof Promise && (this.port = await this.port);
			try {
				await ln(this.port);
			} catch {
				return (
					console.warn(
						'bare-mux: Failed to get a ping response from the worker within 1.5s. Assuming port is dead.'
					),
					this.createChannel(),
					await this.sendMessage(t, i)
				);
			}
			let r = new MessageChannel(),
				n = [r.port2, ...(i || [])],
				a = new Promise((s, o) => {
					r.port1.onmessage = c => {
						let l = c.data;
						l.type === 'error' ? o(l.error) : s(l);
					};
				});
			return (
				this.port.postMessage({ message: t, port: r.port2 }, n), await a
			);
		}
	};
	var us =
		"!#$%&'*+-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ^_`abcdefghijklmnopqrstuvwxyz|~";
	function ls(e) {
		for (let t = 0; t < e.length; t++) {
			let i = e[t];
			if (!us.includes(i)) return !1;
		}
		return !0;
	}
	var hs = ['ws:', 'wss:'],
		ps = [101, 204, 205, 304],
		fs = [301, 302, 303, 307, 308];
	var ct = class {
		constructor(t) {
			this.worker = new ei(t);
		}
		createWebSocket(t, i = [], r, n, a) {
			try {
				t = new URL(t);
			} catch {
				throw new DOMException(
					`Faiiled to construct 'WebSocket': The URL '${t}' is invalid.`
				);
			}
			if (!hs.includes(t.protocol))
				throw new DOMException(
					`Failed to construct 'WebSocket': The URL's scheme must be either 'ws' or 'wss'. '${t.protocol}' is not allowed.`
				);
			Array.isArray(i) || (i = [i]), (i = i.map(String));
			for (let m of i)
				if (!ls(m))
					throw new DOMException(
						`Failed to construct 'WebSocket': The subprotocol '${m}' is invalid.`
					);
			let s = r || _e,
				o = new s('ws://127.0.0.1:1', i),
				c = '',
				l = Be.CONNECTING,
				p = !1;
			o.addEventListener('error', m => {
				p ||
					((l = _e.CONNECTING),
					m.stopImmediatePropagation(),
					(p = !0));
			});
			let f = !1;
			o.addEventListener('close', m => {
				f || (m.stopImmediatePropagation(), (f = !0));
			}),
				(a =
					a ||
					s.constructor.constructor('return ArrayBuffer')()
						.prototype),
				(n = n || {}),
				(n.Host = new URL(t).host),
				(n.Pragma = 'no-cache'),
				(n['Cache-Control'] = 'no-cache'),
				(n.Upgrade = 'websocket'),
				(n.Connection = 'Upgrade');
			let g = m => {
					(l = Be.OPEN),
						(c = m),
						(o.meta = { headers: { 'sec-websocket-protocol': m } }),
						o.dispatchEvent(new Event('open'));
				},
				x = async m => {
					typeof m == 'string'
						? o.dispatchEvent(
								new MessageEvent('message', { data: m })
							)
						: 'byteLength' in m
							? (o.binaryType === 'blob'
									? (m = new Blob([m]))
									: Object.setPrototypeOf(m, a),
								o.dispatchEvent(
									new MessageEvent('message', { data: m })
								))
							: 'arrayBuffer' in m &&
								(o.binaryType === 'arraybuffer' &&
									((m = await m.arrayBuffer()),
									Object.setPrototypeOf(m, a)),
								o.dispatchEvent(
									new MessageEvent('message', { data: m })
								));
				},
				b = (m, I) => {
					(l = Be.CLOSED),
						o.dispatchEvent(
							new CloseEvent('close', { code: m, reason: I })
						);
				},
				D = () => {
					(l = Be.CLOSED), o.dispatchEvent(new Event('error'));
				},
				P = new MessageChannel();
			(P.port1.onmessage = m => {
				m.data.type === 'open'
					? g(m.data.args[0])
					: m.data.type === 'message'
						? x(m.data.args[0])
						: m.data.type === 'close'
							? b(m.data.args[0], m.data.args[1])
							: m.data.type === 'error' && D();
			}),
				this.worker.sendMessage(
					{
						type: 'websocket',
						websocket: {
							url: t.toString(),
							origin,
							protocols: i,
							requestHeaders: n,
							channel: P.port2
						}
					},
					[P.port2]
				);
			let h = () => l;
			Object.defineProperty(o, 'readyState', {
				get: h,
				configurable: !0,
				enumerable: !0
			});
			let d = () => {
				if (h() === Be.CONNECTING)
					return new DOMException(
						"Failed to execute 'send' on 'WebSocket': Still in CONNECTING state."
					);
			};
			return (
				(o.send = function (...m) {
					let I = d();
					if (I) throw I;
					let N = m[0];
					N.buffer && (N = N.buffer),
						P.port1.postMessage(
							{ type: 'data', data: N },
							N instanceof ArrayBuffer ? [N] : []
						);
				}),
				(o.close = function (m, I) {
					P.port1.postMessage({
						type: 'close',
						closeCode: m,
						closeReason: I
					});
				}),
				Object.defineProperty(o, 'url', {
					get: () => t.toString(),
					configurable: !0,
					enumerable: !0
				}),
				Object.defineProperty(o, 'protocol', {
					get: () => c,
					configurable: !0,
					enumerable: !0
				}),
				o
			);
		}
		async fetch(t, i) {
			let r = new ss(t, i),
				n = i?.headers || r.headers,
				a = n instanceof Headers ? Object.fromEntries(n) : n,
				s = r.body,
				o = new URL(r.url);
			if (o.protocol.startsWith('blob:')) {
				let c = await as(o),
					l = new Jt(c.body, c);
				return (
					(l.rawHeaders = Object.fromEntries(c.headers)),
					(l.rawResponse = c),
					l
				);
			}
			for (let c = 0; ; c++) {
				'host' in a ? (a.host = o.host) : (a.Host = o.host);
				let l = (
						await this.worker.sendMessage(
							{
								type: 'fetch',
								fetch: {
									remote: o.toString(),
									method: r.method,
									headers: a,
									body: s || void 0
								}
							},
							s ? [s] : []
						)
					).fetch,
					p = new Jt(ps.includes(l.status) ? void 0 : l.body, {
						headers: new Headers(l.headers),
						status: l.status,
						statusText: l.statusText
					});
				(p.rawHeaders = l.headers),
					(p.rawResponse = new Jt(l.body)),
					(p.finalURL = o.toString());
				let f = i?.redirect || r.redirect;
				if (fs.includes(p.status))
					switch (f) {
						case 'follow': {
							let g = p.headers.get('location');
							if (20 > c && g !== null) {
								o = new URL(g, o);
								continue;
							} else throw new TypeError('Failed to fetch');
						}
						case 'error':
							throw new TypeError('Failed to fetch');
						case 'manual':
							return p;
					}
				else return p;
			}
		}
	};
	var Rs = ve(hn(), 1),
		wn = ve(fn(), 1);
	var { stringify: Ss } = JSON;
	if (!String.prototype.repeat)
		throw new Error(
			'String.prototype.repeat is undefined, see https://github.com/davidbonnet/astring#installation'
		);
	if (!String.prototype.endsWith)
		throw new Error(
			'String.prototype.endsWith is undefined, see https://github.com/davidbonnet/astring#installation'
		);
	var lt = {
			'||': 2,
			'??': 3,
			'&&': 4,
			'|': 5,
			'^': 6,
			'&': 7,
			'==': 8,
			'!=': 8,
			'===': 8,
			'!==': 8,
			'<': 9,
			'>': 9,
			'<=': 9,
			'>=': 9,
			in: 9,
			instanceof: 9,
			'<<': 10,
			'>>': 10,
			'>>>': 10,
			'+': 11,
			'-': 11,
			'*': 12,
			'%': 12,
			'/': 12,
			'**': 13
		},
		oe = 17,
		Cs = {
			ArrayExpression: 20,
			TaggedTemplateExpression: 20,
			ThisExpression: 20,
			Identifier: 20,
			PrivateIdentifier: 20,
			Literal: 18,
			TemplateLiteral: 20,
			Super: 20,
			SequenceExpression: 20,
			MemberExpression: 19,
			ChainExpression: 19,
			CallExpression: 19,
			NewExpression: 19,
			ArrowFunctionExpression: oe,
			ClassExpression: oe,
			FunctionExpression: oe,
			ObjectExpression: oe,
			UpdateExpression: 16,
			UnaryExpression: 15,
			AwaitExpression: 15,
			BinaryExpression: 14,
			LogicalExpression: 13,
			ConditionalExpression: 4,
			AssignmentExpression: 3,
			YieldExpression: 2,
			RestElement: 1
		};
	function Ae(e, t) {
		let { generator: i } = e;
		if ((e.write('('), t != null && t.length > 0)) {
			i[t[0].type](t[0], e);
			let { length: r } = t;
			for (let n = 1; n < r; n++) {
				let a = t[n];
				e.write(', '), i[a.type](a, e);
			}
		}
		e.write(')');
	}
	function vn(e, t, i, r) {
		let n = e.expressionsPrecedence[t.type];
		if (n === oe) return !0;
		let a = e.expressionsPrecedence[i.type];
		return n !== a
			? (!r && n === 15 && a === 14 && i.operator === '**') || n < a
			: n !== 13 && n !== 14
				? !1
				: t.operator === '**' && i.operator === '**'
					? !r
					: n === 13 &&
						  a === 13 &&
						  (t.operator === '??' || i.operator === '??')
						? !0
						: r
							? lt[t.operator] <= lt[i.operator]
							: lt[t.operator] < lt[i.operator];
	}
	function ht(e, t, i, r) {
		let { generator: n } = e;
		vn(e, t, i, r)
			? (e.write('('), n[t.type](t, e), e.write(')'))
			: n[t.type](t, e);
	}
	function Es(e, t, i, r) {
		let n = t.split(`
`),
			a = n.length - 1;
		if ((e.write(n[0].trim()), a > 0)) {
			e.write(r);
			for (let s = 1; s < a; s++) e.write(i + n[s].trim() + r);
			e.write(i + n[a].trim());
		}
	}
	function Q(e, t, i, r) {
		let { length: n } = t;
		for (let a = 0; a < n; a++) {
			let s = t[a];
			e.write(i),
				s.type[0] === 'L'
					? e.write(
							'// ' +
								s.value.trim() +
								`
`,
							s
						)
					: (e.write('/*'), Es(e, s.value, i, r), e.write('*/' + r));
		}
	}
	function ks(e) {
		let t = e;
		for (; t != null; ) {
			let { type: i } = t;
			if (i[0] === 'C' && i[1] === 'a') return !0;
			if (i[0] === 'M' && i[1] === 'e' && i[2] === 'm') t = t.object;
			else return !1;
		}
	}
	function ni(e, t) {
		let { generator: i } = e,
			{ declarations: r } = t;
		e.write(t.kind + ' ');
		let { length: n } = r;
		if (n > 0) {
			i.VariableDeclarator(r[0], e);
			for (let a = 1; a < n; a++)
				e.write(', '), i.VariableDeclarator(r[a], e);
		}
	}
	var dn,
		mn,
		yn,
		gn,
		xn,
		_n,
		As = {
			Program(e, t) {
				let i = t.indent.repeat(t.indentLevel),
					{ lineEnd: r, writeComments: n } = t;
				n && e.comments != null && Q(t, e.comments, i, r);
				let a = e.body,
					{ length: s } = a;
				for (let o = 0; o < s; o++) {
					let c = a[o];
					n && c.comments != null && Q(t, c.comments, i, r),
						t.write(i),
						this[c.type](c, t),
						t.write(r);
				}
				n &&
					e.trailingComments != null &&
					Q(t, e.trailingComments, i, r);
			},
			BlockStatement: (_n = function (e, t) {
				let i = t.indent.repeat(t.indentLevel++),
					{ lineEnd: r, writeComments: n } = t,
					a = i + t.indent;
				t.write('{');
				let s = e.body;
				if (s != null && s.length > 0) {
					t.write(r),
						n && e.comments != null && Q(t, e.comments, a, r);
					let { length: o } = s;
					for (let c = 0; c < o; c++) {
						let l = s[c];
						n && l.comments != null && Q(t, l.comments, a, r),
							t.write(a),
							this[l.type](l, t),
							t.write(r);
					}
					t.write(i);
				} else
					n &&
						e.comments != null &&
						(t.write(r), Q(t, e.comments, a, r), t.write(i));
				n &&
					e.trailingComments != null &&
					Q(t, e.trailingComments, a, r),
					t.write('}'),
					t.indentLevel--;
			}),
			ClassBody: _n,
			StaticBlock(e, t) {
				t.write('static '), this.BlockStatement(e, t);
			},
			EmptyStatement(e, t) {
				t.write(';');
			},
			ExpressionStatement(e, t) {
				let i = t.expressionsPrecedence[e.expression.type];
				i === oe || (i === 3 && e.expression.left.type[0] === 'O')
					? (t.write('('),
						this[e.expression.type](e.expression, t),
						t.write(')'))
					: this[e.expression.type](e.expression, t),
					t.write(';');
			},
			IfStatement(e, t) {
				t.write('if ('),
					this[e.test.type](e.test, t),
					t.write(') '),
					this[e.consequent.type](e.consequent, t),
					e.alternate != null &&
						(t.write(' else '),
						this[e.alternate.type](e.alternate, t));
			},
			LabeledStatement(e, t) {
				this[e.label.type](e.label, t),
					t.write(': '),
					this[e.body.type](e.body, t);
			},
			BreakStatement(e, t) {
				t.write('break'),
					e.label != null &&
						(t.write(' '), this[e.label.type](e.label, t)),
					t.write(';');
			},
			ContinueStatement(e, t) {
				t.write('continue'),
					e.label != null &&
						(t.write(' '), this[e.label.type](e.label, t)),
					t.write(';');
			},
			WithStatement(e, t) {
				t.write('with ('),
					this[e.object.type](e.object, t),
					t.write(') '),
					this[e.body.type](e.body, t);
			},
			SwitchStatement(e, t) {
				let i = t.indent.repeat(t.indentLevel++),
					{ lineEnd: r, writeComments: n } = t;
				t.indentLevel++;
				let a = i + t.indent,
					s = a + t.indent;
				t.write('switch ('),
					this[e.discriminant.type](e.discriminant, t),
					t.write(') {' + r);
				let { cases: o } = e,
					{ length: c } = o;
				for (let l = 0; l < c; l++) {
					let p = o[l];
					n && p.comments != null && Q(t, p.comments, a, r),
						p.test
							? (t.write(a + 'case '),
								this[p.test.type](p.test, t),
								t.write(':' + r))
							: t.write(a + 'default:' + r);
					let { consequent: f } = p,
						{ length: g } = f;
					for (let x = 0; x < g; x++) {
						let b = f[x];
						n && b.comments != null && Q(t, b.comments, s, r),
							t.write(s),
							this[b.type](b, t),
							t.write(r);
					}
				}
				(t.indentLevel -= 2), t.write(i + '}');
			},
			ReturnStatement(e, t) {
				t.write('return'),
					e.argument &&
						(t.write(' '), this[e.argument.type](e.argument, t)),
					t.write(';');
			},
			ThrowStatement(e, t) {
				t.write('throw '),
					this[e.argument.type](e.argument, t),
					t.write(';');
			},
			TryStatement(e, t) {
				if (
					(t.write('try '), this[e.block.type](e.block, t), e.handler)
				) {
					let { handler: i } = e;
					i.param == null
						? t.write(' catch ')
						: (t.write(' catch ('),
							this[i.param.type](i.param, t),
							t.write(') ')),
						this[i.body.type](i.body, t);
				}
				e.finalizer &&
					(t.write(' finally '),
					this[e.finalizer.type](e.finalizer, t));
			},
			WhileStatement(e, t) {
				t.write('while ('),
					this[e.test.type](e.test, t),
					t.write(') '),
					this[e.body.type](e.body, t);
			},
			DoWhileStatement(e, t) {
				t.write('do '),
					this[e.body.type](e.body, t),
					t.write(' while ('),
					this[e.test.type](e.test, t),
					t.write(');');
			},
			ForStatement(e, t) {
				if ((t.write('for ('), e.init != null)) {
					let { init: i } = e;
					i.type[0] === 'V' ? ni(t, i) : this[i.type](i, t);
				}
				t.write('; '),
					e.test && this[e.test.type](e.test, t),
					t.write('; '),
					e.update && this[e.update.type](e.update, t),
					t.write(') '),
					this[e.body.type](e.body, t);
			},
			ForInStatement: (dn = function (e, t) {
				t.write(`for ${e.await ? 'await ' : ''}(`);
				let { left: i } = e;
				i.type[0] === 'V' ? ni(t, i) : this[i.type](i, t),
					t.write(e.type[3] === 'I' ? ' in ' : ' of '),
					this[e.right.type](e.right, t),
					t.write(') '),
					this[e.body.type](e.body, t);
			}),
			ForOfStatement: dn,
			DebuggerStatement(e, t) {
				t.write('debugger;', e);
			},
			FunctionDeclaration: (mn = function (e, t) {
				t.write(
					(e.async ? 'async ' : '') +
						(e.generator ? 'function* ' : 'function ') +
						(e.id ? e.id.name : ''),
					e
				),
					Ae(t, e.params),
					t.write(' '),
					this[e.body.type](e.body, t);
			}),
			FunctionExpression: mn,
			VariableDeclaration(e, t) {
				ni(t, e), t.write(';');
			},
			VariableDeclarator(e, t) {
				this[e.id.type](e.id, t),
					e.init != null &&
						(t.write(' = '), this[e.init.type](e.init, t));
			},
			ClassDeclaration(e, t) {
				if (
					(t.write('class ' + (e.id ? `${e.id.name} ` : ''), e),
					e.superClass)
				) {
					t.write('extends ');
					let { superClass: i } = e,
						{ type: r } = i,
						n = t.expressionsPrecedence[r];
					(r[0] !== 'C' || r[1] !== 'l' || r[5] !== 'E') &&
					(n === oe || n < t.expressionsPrecedence.ClassExpression)
						? (t.write('('),
							this[e.superClass.type](i, t),
							t.write(')'))
						: this[i.type](i, t),
						t.write(' ');
				}
				this.ClassBody(e.body, t);
			},
			ImportDeclaration(e, t) {
				t.write('import ');
				let { specifiers: i } = e,
					{ length: r } = i,
					n = 0;
				if (r > 0) {
					for (; n < r; ) {
						n > 0 && t.write(', ');
						let a = i[n],
							s = a.type[6];
						if (s === 'D') t.write(a.local.name, a), n++;
						else if (s === 'N')
							t.write('* as ' + a.local.name, a), n++;
						else break;
					}
					if (n < r) {
						for (t.write('{'); ; ) {
							let a = i[n],
								{ name: s } = a.imported;
							if (
								(t.write(s, a),
								s !== a.local.name &&
									t.write(' as ' + a.local.name),
								++n < r)
							)
								t.write(', ');
							else break;
						}
						t.write('}');
					}
					t.write(' from ');
				}
				this.Literal(e.source, t), t.write(';');
			},
			ImportExpression(e, t) {
				t.write('import('),
					this[e.source.type](e.source, t),
					t.write(')');
			},
			ExportDefaultDeclaration(e, t) {
				t.write('export default '),
					this[e.declaration.type](e.declaration, t),
					t.expressionsPrecedence[e.declaration.type] != null &&
						e.declaration.type[0] !== 'F' &&
						t.write(';');
			},
			ExportNamedDeclaration(e, t) {
				if ((t.write('export '), e.declaration))
					this[e.declaration.type](e.declaration, t);
				else {
					t.write('{');
					let { specifiers: i } = e,
						{ length: r } = i;
					if (r > 0)
						for (let n = 0; ; ) {
							let a = i[n],
								{ name: s } = a.local;
							if (
								(t.write(s, a),
								s !== a.exported.name &&
									t.write(' as ' + a.exported.name),
								++n < r)
							)
								t.write(', ');
							else break;
						}
					t.write('}'),
						e.source &&
							(t.write(' from '), this.Literal(e.source, t)),
						t.write(';');
				}
			},
			ExportAllDeclaration(e, t) {
				e.exported != null
					? t.write('export * as ' + e.exported.name + ' from ')
					: t.write('export * from '),
					this.Literal(e.source, t),
					t.write(';');
			},
			MethodDefinition(e, t) {
				e.static && t.write('static ');
				let i = e.kind[0];
				(i === 'g' || i === 's') && t.write(e.kind + ' '),
					e.value.async && t.write('async '),
					e.value.generator && t.write('*'),
					e.computed
						? (t.write('['),
							this[e.key.type](e.key, t),
							t.write(']'))
						: this[e.key.type](e.key, t),
					Ae(t, e.value.params),
					t.write(' '),
					this[e.value.body.type](e.value.body, t);
			},
			ClassExpression(e, t) {
				this.ClassDeclaration(e, t);
			},
			ArrowFunctionExpression(e, t) {
				t.write(e.async ? 'async ' : '', e);
				let { params: i } = e;
				i != null &&
					(i.length === 1 && i[0].type[0] === 'I'
						? t.write(i[0].name, i[0])
						: Ae(t, e.params)),
					t.write(' => '),
					e.body.type[0] === 'O'
						? (t.write('('),
							this.ObjectExpression(e.body, t),
							t.write(')'))
						: this[e.body.type](e.body, t);
			},
			ThisExpression(e, t) {
				t.write('this', e);
			},
			Super(e, t) {
				t.write('super', e);
			},
			RestElement: (yn = function (e, t) {
				t.write('...'), this[e.argument.type](e.argument, t);
			}),
			SpreadElement: yn,
			YieldExpression(e, t) {
				t.write(e.delegate ? 'yield*' : 'yield'),
					e.argument &&
						(t.write(' '), this[e.argument.type](e.argument, t));
			},
			AwaitExpression(e, t) {
				t.write('await ', e), ht(t, e.argument, e);
			},
			TemplateLiteral(e, t) {
				let { quasis: i, expressions: r } = e;
				t.write('`');
				let { length: n } = r;
				for (let s = 0; s < n; s++) {
					let o = r[s],
						c = i[s];
					t.write(c.value.raw, c),
						t.write('${'),
						this[o.type](o, t),
						t.write('}');
				}
				let a = i[i.length - 1];
				t.write(a.value.raw, a), t.write('`');
			},
			TemplateElement(e, t) {
				t.write(e.value.raw, e);
			},
			TaggedTemplateExpression(e, t) {
				ht(t, e.tag, e), this[e.quasi.type](e.quasi, t);
			},
			ArrayExpression: (xn = function (e, t) {
				if ((t.write('['), e.elements.length > 0)) {
					let { elements: i } = e,
						{ length: r } = i;
					for (let n = 0; ; ) {
						let a = i[n];
						if ((a != null && this[a.type](a, t), ++n < r))
							t.write(', ');
						else {
							a == null && t.write(', ');
							break;
						}
					}
				}
				t.write(']');
			}),
			ArrayPattern: xn,
			ObjectExpression(e, t) {
				let i = t.indent.repeat(t.indentLevel++),
					{ lineEnd: r, writeComments: n } = t,
					a = i + t.indent;
				if ((t.write('{'), e.properties.length > 0)) {
					t.write(r),
						n && e.comments != null && Q(t, e.comments, a, r);
					let s = ',' + r,
						{ properties: o } = e,
						{ length: c } = o;
					for (let l = 0; ; ) {
						let p = o[l];
						if (
							(n && p.comments != null && Q(t, p.comments, a, r),
							t.write(a),
							this[p.type](p, t),
							++l < c)
						)
							t.write(s);
						else break;
					}
					t.write(r),
						n &&
							e.trailingComments != null &&
							Q(t, e.trailingComments, a, r),
						t.write(i + '}');
				} else
					n
						? e.comments != null
							? (t.write(r),
								Q(t, e.comments, a, r),
								e.trailingComments != null &&
									Q(t, e.trailingComments, a, r),
								t.write(i + '}'))
							: e.trailingComments != null
								? (t.write(r),
									Q(t, e.trailingComments, a, r),
									t.write(i + '}'))
								: t.write('}')
						: t.write('}');
				t.indentLevel--;
			},
			Property(e, t) {
				e.method || e.kind[0] !== 'i'
					? this.MethodDefinition(e, t)
					: (e.shorthand ||
							(e.computed
								? (t.write('['),
									this[e.key.type](e.key, t),
									t.write(']'))
								: this[e.key.type](e.key, t),
							t.write(': ')),
						this[e.value.type](e.value, t));
			},
			PropertyDefinition(e, t) {
				if (
					(e.static && t.write('static '),
					e.computed && t.write('['),
					this[e.key.type](e.key, t),
					e.computed && t.write(']'),
					e.value == null)
				) {
					e.key.type[0] !== 'F' && t.write(';');
					return;
				}
				t.write(' = '), this[e.value.type](e.value, t), t.write(';');
			},
			ObjectPattern(e, t) {
				if ((t.write('{'), e.properties.length > 0)) {
					let { properties: i } = e,
						{ length: r } = i;
					for (let n = 0; this[i[n].type](i[n], t), ++n < r; )
						t.write(', ');
				}
				t.write('}');
			},
			SequenceExpression(e, t) {
				Ae(t, e.expressions);
			},
			UnaryExpression(e, t) {
				if (e.prefix) {
					let {
						operator: i,
						argument: r,
						argument: { type: n }
					} = e;
					t.write(i);
					let a = vn(t, r, e);
					!a &&
						(i.length > 1 ||
							(n[0] === 'U' &&
								(n[1] === 'n' || n[1] === 'p') &&
								r.prefix &&
								r.operator[0] === i &&
								(i === '+' || i === '-'))) &&
						t.write(' '),
						a
							? (t.write(i.length > 1 ? ' (' : '('),
								this[n](r, t),
								t.write(')'))
							: this[n](r, t);
				} else
					this[e.argument.type](e.argument, t), t.write(e.operator);
			},
			UpdateExpression(e, t) {
				e.prefix
					? (t.write(e.operator),
						this[e.argument.type](e.argument, t))
					: (this[e.argument.type](e.argument, t),
						t.write(e.operator));
			},
			AssignmentExpression(e, t) {
				this[e.left.type](e.left, t),
					t.write(' ' + e.operator + ' '),
					this[e.right.type](e.right, t);
			},
			AssignmentPattern(e, t) {
				this[e.left.type](e.left, t),
					t.write(' = '),
					this[e.right.type](e.right, t);
			},
			BinaryExpression: (gn = function (e, t) {
				let i = e.operator === 'in';
				i && t.write('('),
					ht(t, e.left, e, !1),
					t.write(' ' + e.operator + ' '),
					ht(t, e.right, e, !0),
					i && t.write(')');
			}),
			LogicalExpression: gn,
			ConditionalExpression(e, t) {
				let { test: i } = e,
					r = t.expressionsPrecedence[i.type];
				r === oe || r <= t.expressionsPrecedence.ConditionalExpression
					? (t.write('('), this[i.type](i, t), t.write(')'))
					: this[i.type](i, t),
					t.write(' ? '),
					this[e.consequent.type](e.consequent, t),
					t.write(' : '),
					this[e.alternate.type](e.alternate, t);
			},
			NewExpression(e, t) {
				t.write('new ');
				let i = t.expressionsPrecedence[e.callee.type];
				i === oe ||
				i < t.expressionsPrecedence.CallExpression ||
				ks(e.callee)
					? (t.write('('),
						this[e.callee.type](e.callee, t),
						t.write(')'))
					: this[e.callee.type](e.callee, t),
					Ae(t, e.arguments);
			},
			CallExpression(e, t) {
				let i = t.expressionsPrecedence[e.callee.type];
				i === oe || i < t.expressionsPrecedence.CallExpression
					? (t.write('('),
						this[e.callee.type](e.callee, t),
						t.write(')'))
					: this[e.callee.type](e.callee, t),
					e.optional && t.write('?.'),
					Ae(t, e.arguments);
			},
			ChainExpression(e, t) {
				this[e.expression.type](e.expression, t);
			},
			MemberExpression(e, t) {
				let i = t.expressionsPrecedence[e.object.type];
				i === oe || i < t.expressionsPrecedence.MemberExpression
					? (t.write('('),
						this[e.object.type](e.object, t),
						t.write(')'))
					: this[e.object.type](e.object, t),
					e.computed
						? (e.optional && t.write('?.'),
							t.write('['),
							this[e.property.type](e.property, t),
							t.write(']'))
						: (e.optional ? t.write('?.') : t.write('.'),
							this[e.property.type](e.property, t));
			},
			MetaProperty(e, t) {
				t.write(e.meta.name + '.' + e.property.name, e);
			},
			Identifier(e, t) {
				t.write(e.name, e);
			},
			PrivateIdentifier(e, t) {
				t.write(`#${e.name}`, e);
			},
			Literal(e, t) {
				e.raw != null
					? t.write(e.raw, e)
					: e.regex != null
						? this.RegExpLiteral(e, t)
						: e.bigint != null
							? t.write(e.bigint + 'n', e)
							: t.write(Ss(e.value), e);
			},
			RegExpLiteral(e, t) {
				let { regex: i } = e;
				t.write(`/${i.pattern}/${i.flags}`, e);
			}
		},
		Ps = {};
	var ai = class {
		constructor(t) {
			let i = t ?? Ps;
			(this.output = ''),
				i.output != null
					? ((this.output = i.output),
						(this.write = this.writeToStream))
					: (this.output = ''),
				(this.generator = i.generator != null ? i.generator : As),
				(this.expressionsPrecedence =
					i.expressionsPrecedence != null
						? i.expressionsPrecedence
						: Cs),
				(this.indent = i.indent != null ? i.indent : '  '),
				(this.lineEnd =
					i.lineEnd != null
						? i.lineEnd
						: `
`),
				(this.indentLevel =
					i.startingIndentLevel != null ? i.startingIndentLevel : 0),
				(this.writeComments = i.comments ? i.comments : !1),
				i.sourceMap != null &&
					((this.write =
						i.output == null
							? this.writeAndMap
							: this.writeToStreamAndMap),
					(this.sourceMap = i.sourceMap),
					(this.line = 1),
					(this.column = 0),
					(this.lineEndSize =
						this.lineEnd.split(`
`).length - 1),
					(this.mapping = {
						original: null,
						generated: this,
						name: void 0,
						source: i.sourceMap.file || i.sourceMap._file
					}));
		}
		write(t) {
			this.output += t;
		}
		writeToStream(t) {
			this.output.write(t);
		}
		writeAndMap(t, i) {
			(this.output += t), this.map(t, i);
		}
		writeToStreamAndMap(t, i) {
			this.output.write(t), this.map(t, i);
		}
		map(t, i) {
			if (i != null) {
				let { type: a } = i;
				if (a[0] === 'L' && a[2] === 'n') {
					(this.column = 0), this.line++;
					return;
				}
				if (i.loc != null) {
					let { mapping: s } = this;
					(s.original = i.loc.start),
						(s.name = i.name),
						this.sourceMap.addMapping(s);
				}
				if (
					(a[0] === 'T' && a[8] === 'E') ||
					(a[0] === 'L' && a[1] === 'i' && typeof i.value == 'string')
				) {
					let { length: s } = t,
						{ column: o, line: c } = this;
					for (let l = 0; l < s; l++)
						t[l] ===
						`
`
							? ((o = 0), c++)
							: o++;
					(this.column = o), (this.line = c);
					return;
				}
			}
			let { length: r } = t,
				{ lineEnd: n } = this;
			r > 0 &&
				(this.lineEndSize > 0 &&
				(n.length === 1 ? t[r - 1] === n : t.endsWith(n))
					? ((this.line += this.lineEndSize), (this.column = 0))
					: (this.column += r));
		}
		toString() {
			return this.output;
		}
	};
	function bn(e, t) {
		let i = new ai(t);
		return i.generator[e.type](e, i), i.output;
	}
	var si = class {
			constructor(t) {
				this.mime = pr;
				this.idb = Je;
				this.path = Ls;
				this.acorn = { parse: on };
				this.bare = { BareClient: ct };
				this.base64 = { encode: btoa, decode: atob };
				this.estree = { generate: bn };
				this.cookie = Rs;
				this.setCookieParser = wn.parse;
				this.ctx = t;
			}
		},
		Sn = si;
	function oi(e, t, i, r, n = '', a = !1, s = '') {
		if (self.__dynamic$config)
			var o = self.__dynamic$config.mode == 'development';
		else var o = !1;
		if (a) {
			var c = [
				{
					nodeName: 'script',
					tagName: 'script',
					namespaceURI: 'http://www.w3.org/1999/xhtml',
					childNodes: [],
					attrs: [
						{
							name: 'src',
							value:
								e +
								(o
									? '?' +
										Math.floor(Math.random() * 89999 + 1e4)
									: '')
						}
					]
				},
				{
					nodeName: 'script',
					tagName: 'script',
					namespaceURI: 'http://www.w3.org/1999/xhtml',
					childNodes: [],
					attrs: [
						{
							name: 'src',
							value:
								t +
								(o
									? '?' +
										Math.floor(Math.random() * 89999 + 1e4)
									: '')
						}
					]
				}
			];
			return (
				this.ctx.config.assets.files.inject &&
					c.unshift({
						nodeName: 'script',
						tagName: 'script',
						namespaceURI: 'http://www.w3.org/1999/xhtml',
						childNodes: [],
						attrs: [
							{
								name: 'src',
								value:
									this.ctx.config.assets.files.inject +
									(o
										? '?' +
											Math.floor(
												Math.random() * 89999 + 1e4
											)
										: '')
							}
						]
					}),
				r &&
					c.unshift({
						nodeName: 'script',
						tagName: 'script',
						namespaceURI: 'http://www.w3.org/1999/xhtml',
						childNodes: [],
						attrs: [
							{
								name: 'src',
								value:
									'data:application/javascript;base64,' +
									btoa(
										`self.__dynamic$cookies = atob("${btoa(r)}");document.currentScript?.remove();`
									)
							}
						]
					}),
				n &&
					c.unshift({
						nodeName: 'script',
						tagName: 'script',
						namespaceURI: 'http://www.w3.org/1999/xhtml',
						childNodes: [],
						attrs: [
							{
								name: 'src',
								value:
									'data:application/javascript;base64,' +
									btoa(
										n + ';document.currentScript?.remove();'
									)
							}
						]
					}),
				s &&
					c.unshift({
						nodeName: 'script',
						tagName: 'script',
						namespaceURI: 'http://www.w3.org/1999/xhtml',
						childNodes: [],
						attrs: [
							{
								name: 'src',
								value:
									'data:application/javascript;base64,' +
									btoa(
										s + ';document.currentScript?.remove();'
									)
							}
						]
					}),
				c
			);
		} else {
			var l = [
				`<script src="${t + (o ? '?' + Math.floor(Math.random() * 89999 + 1e4) : '')}"><\/script>`,
				`<script src="${e + (o ? '?' + Math.floor(Math.random() * 89999 + 1e4) : '')}"><\/script>`
			];
			return (
				this.ctx.config.assets.files.inject &&
					l.unshift(
						`<script src="${this.ctx.config.assets.files.inject + (o ? '?' + Math.floor(Math.random() * 89999 + 1e4) : '')}"><\/script>`
					),
				r &&
					l.unshift(
						`<script src="${'data:application/javascript;base64,' + btoa(`self.__dynamic$cookies = atob("${btoa(r)}");document.currentScript?.remove();`)}"><\/script>`
					),
				n &&
					l.unshift(
						`<script src="${'data:application/javascript;base64,' + btoa(n + ';document.currentScript?.remove();')}"><\/script>`
					),
				s &&
					l.unshift(
						`<script src="${'data:application/javascript;base64,' + btoa(s + ';document.currentScript?.remove();')}"><\/script>`
					),
				l
			);
		}
	}
	var Ve = class {
		constructor(t) {
			this.generateHead = oi;
			this.config = [
				{ elements: 'all', tags: ['style'], action: 'css' },
				{
					elements: [
						'script',
						'iframe',
						'embed',
						'input',
						'track',
						'media',
						'source',
						'img',
						'a',
						'link',
						'area',
						'form',
						'object'
					],
					tags: ['src', 'href', 'action', 'data'],
					action: 'url'
				},
				{
					elements: ['source', 'img'],
					tags: ['srcset'],
					action: 'srcset'
				},
				{
					elements: ['script', 'link'],
					tags: ['integrity'],
					action: 'rewrite',
					new: 'nointegrity'
				},
				{
					elements: ['script', 'link'],
					tags: ['nonce'],
					action: 'rewrite',
					new: 'nononce'
				},
				{
					elements: ['meta'],
					tags: ['http-equiv'],
					action: 'http-equiv'
				},
				{ elements: ['iframe'], tags: ['srcdoc'], action: 'html' },
				{ elements: ['link'], tags: ['imagesrcset'], action: 'srcset' },
				{ elements: 'all', tags: ['onclick'], action: 'js' }
			];
			this.ctx = t.ctx;
		}
		generateRedirect(t) {
			return `
<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>301 Moved</TITLE></HEAD><BODY>
<H1>301 Moved</H1>
The document has moved
<A HREF="${t}">here</A>.
</BODY></HTML>
    `;
		}
		iterate(t, i) {
			function r(n = t) {
				for (var a = 0; a < n.childNodes.length; a++)
					i(n.childNodes[a]),
						n.childNodes[a].childNodes &&
							n.childNodes[a].childNodes.length &&
							r(n.childNodes[a]);
			}
			r(t);
		}
		rewrite(t, i, r = []) {
			return (
				Array.isArray(t) && (t = t[0]),
				t &&
					((t = t.toString()),
					t.match(/<\!DOCTYPE[^>]*>/gi) ||
						(t = '<!DOCTYPE html>' + t),
					t
						.replace(
							/(<!DOCTYPE html>|<html(.*?)>)/im,
							`$1${r.join('')}
`
						)
						.replace(/<(script|link)\b[^>]*>/g, (n, a) =>
							n
								.replace(/\snonce\s*=\s*"[^"]*"/, s =>
									s.replace('nonce', 'nononce')
								)
								.replace(/\sintegrity\s*=\s*"[^"]*"/, s =>
									s.replace('integrity', 'nointegrity')
								)
						))
			);
		}
	};
	var $e = class {
		constructor(t) {
			this.ctx = t.ctx;
		}
		rewrite(t, i, r = {}) {
			return (
				t &&
				t
					.toString()
					.replace(
						/(?:@import\s?|url\(?)['"]?(.*?)['")]/gim,
						(...n) => {
							try {
								return n[0].replace(
									n[3],
									this.ctx.url.encode(n[3], i)
								);
							} catch {
								return n[0];
							}
						}
					)
			);
		}
	};
	function ci(e, t) {
		if (typeof e != 'object' || !t) return;
		i(e, null, t);
		function i(r, n, a) {
			if (!(typeof r != 'object' || !a)) {
				(r.parent = n), a(r, n, a);
				for (let s in r)
					s !== 'parent' &&
						(Array.isArray(r[s])
							? r[s].forEach(o => {
									o && i(o, r, a);
								})
							: r[s] && i(r[s], r, a));
				typeof r.iterateEnd == 'function' && r.iterateEnd();
			}
		}
	}
	function ui(e, t = {}, i, r) {
		var n = this.ctx.modules.acorn.parse(e.toString(), {
			sourceType: t.module ? 'module' : 'script',
			allowImportExportEverywhere: !0,
			allowAwaitOutsideFunction: !0,
			allowReturnOutsideFunction: !0,
			ecmaVersion: 'latest',
			preserveParens: !1,
			loose: !0,
			allowReserved: !0
		});
		return (
			this.iterate(n, (a, s = null) => {
				this.emit(a, a.type, s, i, r, t);
			}),
			(e = this.ctx.modules.estree.generate(n)),
			e
		);
	}
	function li(e, t = {}) {
		if (typeof e.name != 'string') return !1;
		if (e.__dynamic !== !0) {
			if (
				![
					'parent',
					'top',
					'postMessage',
					'opener',
					'window',
					'self',
					'globalThis',
					'parent',
					'location'
				].includes(e.name)
			)
				return !1;
			if (
				!(t.type == 'CallExpression' && t.callee == e) &&
				!(
					t.type == 'MemberExpression' &&
					t.object !== e &&
					!['document', 'window', 'self', 'globalThis'].includes(
						t.object.name
					)
				) &&
				t.type != 'FunctionDeclaration' &&
				t.type != 'VariableDeclaration' &&
				!(t.type == 'VariableDeclarator' && t.id == e) &&
				t.type != 'LabeledStatement' &&
				!(t.type == 'Property' && t.key == e) &&
				!(
					t.type == 'ArrowFunctionExpression' && t.params.includes(e)
				) &&
				!(t.type == 'FunctionExpression' && t.params.includes(e)) &&
				!(t.type == 'FunctionExpression' && t.id == e) &&
				!(t.type == 'CatchClause' && t.param == e) &&
				t.type != 'ContinueStatement' &&
				t.type != 'BreakStatement' &&
				!(t.type == 'AssignmentExpression' && t.left == e) &&
				t.type != 'UpdateExpression' &&
				t.type != 'UpdateExpression' &&
				!(t.type == 'ForInStatement' && t.left == e) &&
				!(t.type == 'MethodDefinition' && t.key == e) &&
				!(t.type == 'AssignmentPattern' && t.left == e) &&
				t.type != 'NewExpression' &&
				t?.parent?.type != 'NewExpression' &&
				!(t.type == 'UnaryExpression' && t.argument == e) &&
				!(t.type == 'Property' && t.shorthand == !0 && t.value == e)
			) {
				if (e.name == '__dynamic') return (e.name = 'undefined');
				if (e.name == 'eval' && t.right !== e)
					return (e.name = '__dynamic$eval');
				e.name = `dg$(${e.name})`;
			}
		}
	}
	function Pe(e, t = {}) {
		Object.entries({
			type: 'CallExpression',
			callee: {
				type: 'MemberExpression',
				object: { type: 'Identifier', name: 'self' },
				property: { type: 'Identifier', name: '__dynamic$message' }
			},
			arguments: [
				e.object || e,
				{ type: 'Identifier', name: 'self', __dynamic: !0 }
			]
		}).forEach(([i, r]) => (e[i] = r));
	}
	function hi(e, t = {}, i = {}) {
		if (
			((e.object.name += ''),
			t.type !== 'AssignmentExpression' && t.left !== e)
		) {
			if (
				e.property.value == 'postMessage' &&
				t.type == 'CallExpression' &&
				t.callee == e
			)
				return Pe(e, t);
			if (
				e.object.value == 'postMessage' &&
				t.type == 'CallExpression' &&
				t.callee == e
			)
				return Pe(e, t);
			if (
				(e.property.name == 'postMessage' ||
					e.object.name == 'postMessage') &&
				e.object.type !== 'Super'
			) {
				var r = e.object?.name;
				(e.type = 'CallExpression'),
					(e.callee = {
						type: 'Identifier',
						name: '__dynamic$message'
					}),
					(e.arguments = [
						{ type: 'Identifier', name: r },
						{ type: 'Identifier', name: 'self', __dynamic: !0 }
					]),
					t.type == 'CallExpression' && (t.arguments = t.arguments);
				return;
			}
		}
		if (
			(e.property.name == 'eval' && (e.property.name = '__dynamic$eval'),
			e.object.name == 'eval' && (e.object.name = '__dynamic$eval'),
			i.destination !== 'worker' &&
				(e.property.name == 'window' &&
					e.object.name != 'top' &&
					(e.object.name == 'self' ||
						e.object.name == 'globalThis') &&
					t.type !== 'NewExpression' &&
					(t.type !== 'CallExpression' ||
						(t.type == 'CallExpression' && e !== t.callee)) &&
					(e.property.name = '__dynamic$window'),
				e.object.name == 'top' &&
					t.type !== 'NewExpression' &&
					(t.type !== 'CallExpression' ||
						(t.type == 'CallExpression' && e !== t.callee)) &&
					(e.object.name = 'top.__dynamic$window'),
				e.property.name == 'top' &&
					(e.object.name == 'self' ||
						e.object.name == 'globalThis') &&
					t.type !== 'NewExpression' &&
					(t.type !== 'CallExpression' ||
						(t.type == 'CallExpression' && e !== t.callee)) &&
					(e.property.name = 'top.__dynamic$window'),
				t.type !== 'NewExpression' &&
					(t.type !== 'CallExpression' ||
						(t.type == 'CallExpression' && e !== t.callee)) &&
					(e.object.name == 'window' &&
						(e.object = {
							type: 'CallExpression',
							callee: { type: 'Identifier', name: 'dg$' },
							arguments: [e.object],
							__dynamic: !0
						}),
					e.object.name == 'parent' &&
						(e.object = {
							type: 'CallExpression',
							callee: { type: 'Identifier', name: 'dg$' },
							arguments: [e.object],
							__dynamic: !0
						}),
					e.property.name == '__dynamic' &&
						(e.property.name = 'undefined'),
					e.object.name == 'self' &&
						(e.object = {
							type: 'CallExpression',
							callee: { type: 'Identifier', name: 'dg$' },
							arguments: [e.object],
							__dynamic: !0
						}),
					e.object.name == 'document' &&
						(e.object = {
							type: 'CallExpression',
							callee: { type: 'Identifier', name: 'dg$' },
							arguments: [e.object],
							__dynamic: !0
						}),
					e.object.name == 'globalThis' &&
						(e.object = {
							type: 'CallExpression',
							callee: { type: 'Identifier', name: 'dg$' },
							arguments: [e.object],
							__dynamic: !0
						})),
				e.object.name == 'location' &&
					(e.object = {
						type: 'CallExpression',
						callee: { type: 'Identifier', name: 'dg$' },
						arguments: [e.object],
						__dynamic: !0
					}),
				e.property.name == 'location' &&
					t.type !== 'BinaryExpression' &&
					t.type !== 'AssignmentExpression'))
		) {
			(e.property.__dynamic = !0), (e.__dynamic = !0);
			let n = Object.assign({}, e);
			(e.type = 'CallExpression'),
				(e.callee = { type: 'Identifier', name: 'dg$', __dynamic: !0 }),
				(e.arguments = [n]),
				(e.__dynamic = !0);
		}
		e.computed &&
			i.destination !== 'worker' &&
			(e.property = {
				type: 'CallExpression',
				callee: { type: 'Identifier', name: 'dp$' },
				arguments: [e.property],
				__dynamic: !0
			});
	}
	function pi(e, t = {}) {
		if (
			!(e.value instanceof String) ||
			(e.value == '__dynamic' && (e.value = 'undefined'),
			!['location', 'parent', 'top', 'postMessage'].includes(e.value))
		)
			return !1;
		e.value == 'postMessage' &&
			t.type != 'AssignmentExpression' &&
			t.left != e &&
			Pe(e, t),
			e.value == 'location' && (e.value = '__dynamic$location'),
			e.value == '__dynamic' && (e.value = 'undefined'),
			e.value == 'eval' && (e.value = '__dynamic$eval');
	}
	function pt(e, t = {}) {
		e.__dynamic ||
			(e.arguments.length &&
				((e.arguments = [
					{
						type: 'CallExpression',
						callee: {
							type: 'Identifier',
							name: '__dynamic$wrapEval',
							__dynamic: !0
						},
						arguments: e.arguments,
						__dynamic: !0
					}
				]),
				(e.__dynamic = !0)));
	}
	function fi(e, t = {}) {
		if (!(t.type == 'AssignmentExpression' && t.left == e)) {
			if (e.callee.type == 'Identifier') {
				if (e.callee.name == 'postMessage') {
					let i = 'undefined';
					(e.callee.type = 'CallExpression'),
						(e.callee.callee = {
							type: 'Identifier',
							name: '__dynamic$message'
						}),
						(e.callee.arguments = [
							{ type: 'Identifier', name: i },
							{ type: 'Identifier', name: 'self', __dynamic: !0 }
						]);
					return;
				}
				e.callee.name == 'eval' && pt(e);
			}
			if (e.callee.type == 'MemberExpression') {
				if (
					e.callee.property.name == 'postMessage' &&
					e.callee.object.type !== 'Super'
				) {
					let i = e.callee.object;
					(e.callee.type = 'CallExpression'),
						(e.callee.callee = {
							type: 'Identifier',
							name: '__dynamic$message'
						}),
						(e.callee.arguments = [
							i,
							{ type: 'Identifier', name: 'self', __dynamic: !0 }
						]);
					return;
				}
				e.callee.object.name == 'eval' && pt(e);
			}
			e.arguments.length > 0 && e.arguments.length < 4;
			try {
			} catch {}
		}
	}
	function di(e, t = {}) {
		if (e.left.type == 'Identifier') {
			if (e.left.__dynamic === !0) return;
			if (e.left.name == 'location') {
				var i = structuredClone(e.left),
					r = structuredClone(e.right);
				(e.right.type = 'CallExpression'),
					(e.right.callee = { type: 'Identifier', name: 'ds$' }),
					(e.right.arguments = [i, r]);
			}
		}
	}
	function mi(e, t = {}) {
		e.parent.type != 'ObjectPattern' &&
			e.parent?.parent?.type != 'AssignmentExpression' &&
			(e.shorthand = !1);
	}
	function yi(e, t = {}, i = {}, r = {}) {
		if (
			e.type == 'Literal' &&
			(t.type == 'ImportDeclaration' ||
				t.type == 'ExportNamedDeclaration' ||
				t.type == 'ExportAllDeclaration')
		) {
			var n = e.value + '';
			(e.value = i.url.encode(e.value, r.meta)),
				(e.raw = e.raw.replace(n, e.value)),
				(e.__dynamic = !0);
		}
		e.type == 'ImportExpression' &&
			((e.source = {
				type: 'CallExpression',
				callee: { type: 'Identifier', name: '__dynamic$import' },
				arguments: [
					e.source,
					{ type: 'Literal', __dynamic: !0, value: i.meta.href }
				]
			}),
			(e.__dynamic = !0));
	}
	function gi(e, t = {}) {
		if (e.id.type !== 'Identifier') return !1;
		e.id.__dynamic !== !0 && e.id.name != 'location';
	}
	function Is(e, t, i = {}, r = {}, n = {}, a = {}) {
		if (!e.__dynamic) {
			switch (t) {
				case 'Identifier':
					li(e, i);
					break;
				case 'MemberExpression':
					hi(e, i, a);
					break;
				case 'Literal':
					pi(e, i);
					break;
				case 'CallExpression':
					fi(e, i);
					break;
				case 'AssignmentExpression':
					di(e, i);
					break;
				case 'ThisExpression':
					break;
				case 'Property':
					mi(e, i);
					break;
				case 'VariableDeclarator':
					gi(e, i);
					break;
				case 'CatchClause':
					break;
				default:
					break;
			}
			yi(e, i, r, n);
		}
	}
	var Cn = Is;
	var je = class {
		constructor(t) {
			this.iterate = ci;
			this.process = ui;
			this.emit = Cn;
			this.ctx = t.ctx;
		}
		rewrite(t, i = {}, r = !0, n = {}) {
			if (
				!t ||
				t instanceof Object ||
				((t = t.toString()), t.includes('/* dynamic.js */'))
			)
				return t;
			t = `/* dynamic.js */ 

${t}`;
			try {
				try {
					t = this.process(t, i, { module: !0, ...this.ctx }, n);
				} catch {
					t = this.process(t, i, { module: !1, ...this.ctx }, n);
				}
			} catch {}
			return (
				r &&
					(t = `
      if (typeof self !== undefined && typeof self.importScripts == 'function' && typeof self.__dynamic == 'undefined') importScripts('/dynamic/dynamic.config.js', '/dynamic/dynamic.handler.js?'+Math.floor(Math.random()*(99999-10000)+10000));

      ${t}`),
				t
			);
		}
	};
	var Ue = class {
		constructor(t) {
			this.config = {
				rewrite: [
					['icons', 'urlit'],
					['name', ' - Dynamic'],
					['start_url', 'url'],
					['scope', 'url'],
					['short_name', ' - Dynamic'],
					['shortcuts', 'urlev']
				],
				delete: ['serviceworker']
			};
			this.ctx = t.ctx;
		}
		rewrite(t, i) {
			let r = JSON.parse(t);
			for (let o in this.config)
				if (o == 'rewrite')
					for (var [n, a] of this.config[o]) {
						if (a == 'urlit' && r[n]) {
							for (var s = 0; s < r[n].length; s++)
								r[n][s].src = this.ctx.url.encode(
									r[n][s].src,
									i
								);
							continue;
						}
						if (a == 'urlev' && r[n]) {
							for (var s = 0; s < r[n].length; s++)
								r[n][s].url = this.ctx.url.encode(
									r[n][s].url,
									i
								);
							continue;
						}
						if (a == 'url' && r[n]) {
							r[n] = this.ctx.url.encode(r[n], i);
							continue;
						}
						a == 'url' ||
							a == 'urlit' ||
							a == 'urlev' ||
							(r[n] = r[n] + a);
					}
				else if (o == 'delete')
					for (var n of this.config[o]) r[n] && delete r[n];
			return JSON.stringify(r);
		}
	};
	var En = {
		encode(e, t) {
			return !e || !e.toString()
				? e
				: e
						.split(', ')
						.map(i =>
							i
								.split(' ')
								.map((r, n) =>
									n == 0
										? t.url.encode(r, t.baseURL || t.meta)
										: r
								)
								.join(' ')
						)
						.join(', ');
		},
		decode(e) {
			return e;
		}
	};
	var xi = class {
			constructor(t) {
				(this.ctx = t),
					(this.html = new Ve(this)),
					(this.srcset = En),
					(this.js = new je(this)),
					(this.css = new $e(this)),
					(this.man = new Ue(this));
			}
		},
		kn = xi;
	async function An(e) {
		var t;
		if (e.method === 'GET') {
			var i = new URL(e.url);
			t = i.searchParams.get('url');
		} else if (e.method === 'POST') {
			if (((t = (await e.formData()).get('url')), t === null)) {
				var i = new URL(e.url);
				t = i.searchParams.get('url');
			}
			if (!t)
				return new Response('Error: Invalid or Unfound url', {
					status: 400
				});
		} else return new Response('Error: Invalid method', { status: 405 });
		return new Response('', {
			status: 301,
			headers: {
				location:
					location.origin +
					this.ctx.config.prefix +
					this.ctx.encoding.encode(t)
			}
		});
	}
	function Pn({ url: e }) {
		return !e
			.toString()
			.substr(
				location.origin.length,
				(this.ctx.config.prefix + 'route').length
			)
			.startsWith(this.ctx.config.prefix + 'route');
	}
	function _i({ url: e }) {
		return !e
			.toString()
			.substr(location.origin.length, this.ctx.config.prefix.length)
			.startsWith(this.ctx.config.prefix);
	}
	async function vi(e, t, i) {
		for (let n in e) {
			if (
				(this.ctx.headers.csp.indexOf(n.toLowerCase()) !== -1 &&
					delete e[n],
				n.toLowerCase() == 'location')
			) {
				e[n] = this.ctx.url.encode(e[n], t);
				continue;
			}
			if (n.toLowerCase() === 'set-cookie') {
				Array.isArray(e[n])
					? (e[n] = e[n].map(
							a =>
								this.ctx.modules.setCookieParser(a, {
									decodeValues: !1
								})[0]
						))
					: (e[n] = this.ctx.modules.setCookieParser(e[n], {
							decodeValues: !1
						}));
				for await (var r of e[n])
					await i.set(
						t.host,
						this.ctx.modules.cookie.serialize(r.name, r.value, {
							...r,
							encode: a => a
						})
					);
				delete e[n];
				continue;
			}
		}
		return new Headers(e);
	}
	function bi(e, t, i, r) {
		let { referrer: n } = i;
		if (
			(['origin', 'Origin', 'host', 'Host', 'referer', 'Referer'].forEach(
				a => {
					e[a] && delete e[a];
				}
			),
			(e.Origin = `${t.protocol}//${t.host}${t.port ? ':' + t.port : ''}`),
			(e.Host = t.host + (t.port ? ':' + t.port : '')),
			(e.Referer = t.href),
			i.referrerPolicy == 'strict-origin-when-cross-origin' &&
				(e.Referer = `${t.protocol}//${t.host}/`),
			i.referrerPolicy == 'origin' && t.origin && (n = t.origin + '/'),
			r)
		) {
			switch (i.credentials) {
				case 'omit':
					break;
				case 'same-origin':
					i.client &&
						t.origin == i.client.__dynamic$location.origin &&
						(e.Cookie = r),
						i.client || (e.Cookie = r);
					break;
				case 'include':
					e.Cookie = r;
					break;
				default:
					break;
			}
			e.Cookie = r;
		}
		if (n && n != location.origin + '/')
			try {
				(e.Referer = this.ctx.url.decode(n)),
					i.referrerPolicy == 'strict-origin-when-cross-origin' &&
						(e.Referer = new URL(this.ctx.url.decode(n)).origin),
					(e.Origin = new URL(this.ctx.url.decode(n)).origin);
			} catch {}
		return (
			i.client &&
				((e.Origin = i.client.__dynamic$location.origin),
				(e.Referer = i.client.__dynamic$location.href),
				i.referrerPolicy == 'strict-origin-when-cross-origin' &&
					(e.Referer = i.client.__dynamic$location.origin)),
			this.ctx.config.tab &&
				this.ctx.config.tab.ua &&
				(delete e['user-agent'],
				delete e['User-Agent'],
				(e['user-agent'] = this.ctx.config.tab.ua)),
			(e['sec-fetch-dest'] = i.destination || 'empty'),
			(e['sec-fetch-mode'] = i.mode || 'cors'),
			(e['sec-fetch-site'] = i.client
				? i.client.__dynamic$location.origin == t.origin
					? i.client.__dynamic$location.port == t.port
						? 'same-origin'
						: 'same-site'
					: 'cross-origin'
				: 'none'),
			i.mode == 'navigate' && (e['sec-fetch-site'] = 'same-origin'),
			(e['sec-fetch-user'] = '?1'),
			new Headers(e)
		);
	}
	function wi(e) {
		var t = Object.assign(Object.create(Object.getPrototypeOf(e)), e);
		return t;
	}
	function Si(e) {
		try {
			if (
				(new new Proxy(e, { construct: () => ({}) })(),
				!Object.getOwnPropertyNames(e).includes('arguments'))
			)
				throw new Error('');
			return !0;
		} catch {
			return !1;
		}
	}
	function Ci(e) {
		return e.url
			.toString()
			.substr(location.origin.length, e.url.toString().length)
			.startsWith(self.__dynamic$config.assets.prefix);
	}
	async function Ei(e) {
		let t;
		if (self.__dynamic$config.mode !== 'development') {
			var i = await caches.open('__dynamic$files');
			i
				? (t = (await i.match(e.url)) || (await fetch(e)))
				: (t = await fetch(e));
		} else t = await fetch(e);
		let r = await t.blob();
		return (
			(e.url.startsWith(location.origin + '/dynamic/dynamic.config.js') ||
				e.url.startsWith(
					location.origin + '/dynamic/dynamic.client.js'
				)) &&
				(r = new Blob(
					[
						`${await r.text()}
self.document?.currentScript?.remove();`
					],
					{ type: 'application/javascript' }
				)),
			new Response(r, {
				headers: t.headers,
				status: t.status,
				statusText: t.statusText
			})
		);
	}
	async function ki(e, t) {}
	var He = class {
		constructor(t) {
			this.rawHeaders = {};
			this.headers = new Headers({});
			this.status = 200;
			this.statusText = 'OK';
			this.body = t;
		}
		async blob() {
			return this.body;
		}
		async text() {
			return await this.body.text();
		}
	};
	function Ai(e) {
		var t = this.ctx.encoding;
		return (
			typeof this.ctx.config.encoding == 'object'
				? (t = { ...t, ...this.ctx.encoding })
				: (t = { ...this.ctx.encoding[this.ctx.config.encoding] }),
			(this.ctx.encoding = { ...this.ctx.encoding, ...t }),
			this.ctx.encoding
		);
	}
	function Pi(e, t, i) {
		if (!e.url.startsWith('http')) return e.url;
		let r = e.url.toString();
		return (
			e.url.startsWith(location.origin) &&
				(r = r.substr(self.location.origin.length)),
			(r = new URL(r, new URL(t.__dynamic$location.href)).href),
			this.ctx.url.encode(r, i)
		);
	}
	var Li = class {
			constructor(t) {
				this.route = An;
				this.routePath = Pn;
				this.path = _i;
				this.resHeader = vi;
				this.reqHeader = bi;
				this.clone = wi;
				this.class = Si;
				this.file = Ci;
				this.edit = Ei;
				this.error = ki;
				this.encode = Ai;
				this.rewritePath = Pi;
				this.about = He;
				this.ctx = t;
			}
		},
		Ln = Li;
	function Ri(e, t) {
		if (!e) return e;
		if (((e = new String(e).toString()), e.startsWith('about:blank')))
			return location.origin + this.ctx.config.prefix + e;
		if (
			(!e.match(this.ctx.regex.ProtocolRegex) &&
				e.match(/^([a-zA-Z0-9\-]+)\:\/\//g)) ||
			e.startsWith('chrome-extension://')
		)
			return e;
		if (
			e.startsWith('javascript:') &&
			!e.startsWith('javascript:__dynamic$eval')
		) {
			let c = new URL(e);
			return `javascript:__dynamic$eval(${JSON.stringify(c.pathname)})`;
		}
		if (e.match(this.ctx.regex.WeirdRegex)) {
			var i = this.ctx.regex.WeirdRegex.exec(e);
			i && (e = i[2]);
		}
		if (
			e.startsWith(location.origin + this.ctx.config.prefix) ||
			e.startsWith(this.ctx.config.prefix) ||
			e.startsWith(
				location.origin + this.ctx.config.assets.prefix + 'dynamic.'
			) ||
			e.match(this.ctx.regex.BypassRegex)
		)
			return e;
		if (e.match(this.ctx.regex.DataRegex)) {
			try {
				var i = this.ctx.regex.DataRegex.exec(e);
				if (i) {
					var [r, n, a, s, o] = i;
					s == 'base64'
						? (o = this.ctx.modules.base64.atob(
								decodeURIComponent(o)
							))
						: (o = decodeURIComponent(o)),
						n &&
							(n == 'text/html'
								? (o = this.ctx.rewrite.html.rewrite(
										o,
										t,
										this.ctx.rewrite.html.generateHead(
											location.origin +
												'/dynamic/dynamic.client.js',
											location.origin +
												'/dynamic/dynamic.config.js',
											'',
											`window.__dynamic$url = "${t.href}"; window.__dynamic$parentURL = "${location.href}";`
										)
									))
								: n == 'text/css'
									? (o = this.ctx.rewrite.css.rewrite(o, t))
									: (n == 'text/javascript' ||
											n == 'application/javascript') &&
										(o = this.ctx.rewrite.js.rewrite(
											o,
											t
										))),
						s == 'base64'
							? (o = this.ctx.modules.base64.btoa(o))
							: (o = encodeURIComponent(o)),
						a
							? s
								? (e = `data:${n};${a};${s},${o}`)
								: (e = `data:${n};${a},${o}`)
							: s
								? (e = `data:${n};${s},${o}`)
								: (e = `data:${n},${o}`);
				}
			} catch {}
			return e;
		}
		return (
			(e = new String(e).toString()),
			t.href.match(this.ctx.regex.BypassRegex) &&
				(e = new URL(
					e,
					new URL((this.ctx.parent.__dynamic || this.ctx).meta.href)
				).href),
			(e = new URL(e, t.href)),
			(this.ctx._location?.origin ||
				(location.origin == 'null'
					? location.ancestorOrigins[0]
					: location.origin)) +
				this.ctx.config.prefix +
				(this.ctx.encoding.encode(e.origin + e.pathname) +
					e.search +
					e.hash)
		);
	}
	function Ii(e) {
		if (
			!e ||
			((e = new String(e).toString()),
			e.match(this.ctx.regex.BypassRegex))
		)
			return e;
		var t = e.indexOf(this.ctx.config.prefix);
		if (t == -1) return e;
		try {
			if (
				((e = new URL(e, new URL(self.location.origin)).href),
				(t = e.indexOf(this.ctx.config.prefix)),
				e.slice(t + this.ctx.config.prefix.length).trim() ==
					'about:blank')
			)
				return 'about:blank';
			var i = new URL(e).search + new URL(e).hash || '',
				r = new URL(
					this.ctx.encoding.decode(
						e
							.slice(t + this.ctx.config.prefix.length)
							.replace('https://', 'https:/')
							.replace('https:/', 'https://')
							.split('?')[0]
					)
				);
		} catch {
			return e;
		}
		return (
			(e =
				r.origin +
				r.pathname +
				i +
				(new URL(e).search ? r.search.replace('?', '&') : r.search)),
			e
		);
	}
	var Ti = class {
			constructor(t) {
				this.encode = Ri;
				this.decode = Ii;
				this.ctx = t;
			}
		},
		Rn = Ti;
	var Ts = /^(#|about:|mailto:|blob:|javascript:)/g,
		Ns =
			/^data:([a-z\/A-Z0-9\-\+]+);?(charset\=[\-A-Za-z0-9]+)?;?(base64)?[;,]*(.*)/g,
		Ms = /^([\/A-Za-z0-9\-%]+)(http[s]?:\/\/.*)/g,
		We = class {
			constructor(t) {
				this.BypassRegex = Ts;
				this.DataRegex = Ns;
				this.WeirdRegex = Ms;
				this.ctx = t;
			}
		};
	function Ni(e) {
		e = new URL(e.href);
		for (var t in e) this.ctx.meta[t] = e[t];
		return !0;
	}
	var ze = class {
		constructor() {}
	};
	var Mi = class extends ze {
			constructor(i) {
				super();
				this.load = Ni;
				this.ctx = i;
			}
		},
		In = Mi;
	var Tn = {
		csp: [
			'cross-origin-embedder-policy',
			'cross-origin-opener-policy',
			'cross-origin-resource-policy',
			'content-security-policy',
			'content-security-policy-report-only',
			'expect-ct',
			'feature-policy',
			'origin-isolation',
			'strict-transport-security',
			'upgrade-insecure-requests',
			'x-content-type-options',
			'x-frame-options',
			'x-permitted-cross-domain-policies',
			'x-xss-protection'
		],
		status: { empty: [204, 101, 205, 304] },
		method: { body: ['GET', 'HEAD'] }
	};
	function Di(e, t = '') {
		return (
			(
				this.ctx.modules.mime.contentType(t || e.pathname) || 'text/css'
			).split(';')[0] === 'text/css'
		);
	}
	function Oi(e, t = '', i = '') {
		let r;
		return !t && this.ctx.modules.mime.contentType(e.pathname) == e.pathname
			? i.trim().match(/<(html|script|body)[^>]*>/g) &&
					((r = i
						.trim()
						.indexOf(
							(i.trim().match(/<(html|script|body)[^>]*>/g) ||
								[])[0]
						)),
					r > -1 && r < 100)
			: (
					this.ctx.modules.mime.contentType(t || e.pathname) ||
					'text/html'
				).split(';')[0] === 'text/html' ||
					i.trim().match(/\<\!(doctype|DOCTYPE) html\>/g);
	}
	function Bi(e, t = '') {
		if (e.pathname.endsWith('.js') && t == 'text/plain') return !0;
		var i = (
			this.ctx.modules.mime.contentType(t || e.pathname) ||
			'application/javascript'
		).split(';')[0];
		return (
			i == 'text/javascript' ||
			i == 'application/javascript' ||
			i == 'application/x-javascript'
		);
	}
	var Fi = class {
			constructor(t) {
				this.html = Oi;
				this.js = Bi;
				this.css = Di;
				this.ctx = t;
			}
		},
		Nn = Fi;
	function ft(e, t = !0) {
		let i = l => {
				let p = e.__dynamic.util.clone(l);
				for (var f = 0; f < l.length; f++)
					e.__dynamic.define(p, f, {
						value: (
							e.top.__dynamic$location || e.__dynamic$location
						).origin,
						configurable: !0,
						enumerable: !0,
						writable: !1
					});
				return (
					e.__dynamic.define(p, 'length', {
						value: l.length,
						configurable: !0,
						enumerable: !0,
						writable: !1
					}),
					p
				);
			},
			r = e.location.ancestorOrigins || [],
			n = [e.Window, e.Location, e.WorkerLocation, e.Document].filter(
				l => l
			);
		[...n, e.Object].forEach(l => {
			delete l.prototype.__dynamic$location;
		});
		let a = {
				get() {
					return e.__dynamic.location;
				},
				set(l) {
					if (l instanceof e.Location)
						return (e.__dynamic.location = l);
					e.__dynamic.location.href = l;
				},
				configurable: !0
			},
			s = [
				'href',
				'host',
				'hash',
				'origin',
				'hostname',
				'port',
				'pathname',
				'protocol',
				'search'
			],
			o = ['assign', 'replace', 'toString', 'reload'];
		try {
			var c = new URL(
				e.__dynamic$url ||
					e.__dynamic.url.decode(
						e.location.pathname +
							e.location.search +
							e.location.hash
					)
			);
		} catch {
			e.__dynamic$url = 'about:blank';
			var c = new URL('about:blank');
		}
		return (
			(e.__dynamic.property = c),
			e.__dynamic.meta.load(c),
			(e.__dynamic.location = e.__dynamic.util.clone(e.location)),
			s.forEach(l => {
				e.__dynamic.define(e.__dynamic.location, l, {
					get: () =>
						(l == 'search' &&
							e.location[l] +
								(e.location.search
									? c.search.replace('?', '&')
									: c.search)) ||
						(l == 'hash' ? location[l] : c[l]),
					set: p => {
						l === 'href'
							? (e.location[l] = e.__dynamic.url.encode(
									e.__dynamic.meta.href.replace(c[l], p),
									c
								))
							: (e.location[l] = p.toString());
					}
				});
			}),
			e.__dynamic.define(e.Object.prototype, '__dynamic$location', {
				get() {
					return this === e ||
						this === e.__dynamic$window ||
						this === e.document ||
						this === e.__dynamic$document
						? this.__dynamic?.location
						: this.location;
				},
				set(l) {
					return this === e ||
						this === e.__dynamic$window ||
						this === e.document ||
						this === e.__dynamic$document
						? (this.__dynamic.location.href = l)
						: (this.location = l);
				},
				configurable: !0
			}),
			o.forEach(l => {
				e.__dynamic.define(e.__dynamic.location, l, {
					get: () =>
						l == 'toString'
							? () => c.href
							: new e.__dynamic.Function(
									'arg',
									`return window.location.${l}(arg?${l !== 'reload' && l !== 'toString' ? "(self.__dynamic).url.encode(arg, new URL('" + c.href + "'))" : 'arg'}:null)`
								),
					set: () => null
				});
			}),
			r.length &&
				e.__dynamic.define(e.__dynamic.location, 'ancestorOrigins', {
					get: () => i(r),
					set: () => null
				}),
			n.forEach(l => {
				e.__dynamic.define(l.prototype, '__dynamic$location', a);
			}),
			e.__dynamic.hashchange ||
				(e.__dynamic.hashchange =
					(e.addEventListener('hashchange', l => {}), !0)),
			e.__dynamic.location
		);
	}
	function dt(e) {
		(e.__dynamic$get = function (t) {
			var i = e.__dynamic.fire('get', [t]);
			if (i) return i;
			try {
				return t == e.parent
					? e.parent.__dynamic$window
					: t == e.top
						? e.top.__dynamic$window
						: t == e.location ||
							  ((e.Location || e.WorkerLocation) &&
									t instanceof
										(e.Location || e.WorkerLocation))
							? e.__dynamic$location
							: e.Document && t instanceof e.Document
								? e.__dynamic$document
								: t == e
									? e.__dynamic$window
									: typeof t == 'function' &&
										  t.name == '__d$Send'
										? e.__dynamic$message(t.target, e)
										: t;
			} catch {
				return t;
			}
		}),
			(e.__dynamic$property = function (t) {
				return typeof t != 'string'
					? t
					: t == 'location'
						? '__dynamic$location'
						: t == 'eval'
							? '__dynamic$eval'
							: t;
			}),
			(e.__dynamic$set = function (t, i) {
				return t
					? e.__dynamic.url.encode(
							e.__dynamic.meta.href.replace(
								e.__dynamic.property.href,
								i
							),
							e.__dynamic.property
						)
					: i;
			}),
			(e.__dynamic$var = function (t, i) {
				return (window[i] = t);
			}),
			(e.dg$ = e.__dynamic$get),
			(e.ds$ = e.__dynamic$set),
			(e.dp$ = e.__dynamic$property),
			(e.dv$ = e.__dynamic$var),
			(e.d$g_ = e.__dynamic$get),
			(e.d$s_ = e.__dynamic$set),
			(e.d$p_ = e.__dynamic$property),
			(e.d$v_ = e.__dynamic$var);
	}
	function mt(e) {
		(e.__dynamic.util.CreateDocumentProxy = function (i) {
			return new Proxy(i, {
				get(r, n) {
					let a = r[n];
					return n == 'location'
						? i.defaultView
							? i.defaultView.__dynamic$location
							: e.__dynamic$location
						: (n == 'documentURI' && i.defaultView) ||
							  (n == 'baseURI' && i.defaultView)
							? i.defaultView.__dynamic.location.toString()
							: a &&
								(typeof a == 'function' &&
								a.toString == e.Object.toString
									? new Proxy(a, {
											apply(s, o, c) {
												return (
													((i.defaultView &&
														c[0] ==
															i.defaultView
																.__dynamic$document) ||
														c[0] ==
															e.__dynamic$document) &&
														(c[0] = i),
													a.apply(i, c)
												);
											}
										})
									: a);
				},
				set(r, n, a) {
					try {
						try {
							i.defaultView.__dynamic
								? i.defaultView.__dynamic.Reflect.set(r, n, a)
								: (r[n] = a);
						} catch {
							return a || r[n] || !0;
						}
						return a || r[n] || !0;
					} catch {
						return a || r[n] || !0;
					}
				}
			});
		}),
			(e.__dynamic.util.CreateWindowProxy = function (i) {
				return new Proxy(i, {
					get(r, n) {
						let a = e.__dynamic.Reflect.get(r, n);
						if (Object.getOwnPropertyDescriptor(r, n)) {
							var s = Object.getOwnPropertyDescriptor(r, n);
							if (
								s?.configurable === !1 &&
								s?.writable === !1 &&
								s?.hasOwnProperty('enumerable')
							)
								return s?.value || s?.get?.call(r);
						}
						return n == '__dynamic$self'
							? i.window
							: n == 'location'
								? i.__dynamic$location
								: n == 'parent'
									? i.parent.__dynamic$window || i.parent
									: n == 'top'
										? i.top.__dynamic
											? i.top.__dynamic$window
											: i.parent.__dynamic$window
										: n == 'self' || n == 'globalThis'
											? i.__dynamic$window
											: a &&
												(typeof a == 'function' &&
												a.toString == e.Object.toString
													? new Proxy(a, {
															apply(o, c, l) {
																return Reflect.apply(
																	o,
																	i,
																	l
																);
															}
														})
													: a);
					},
					set(r, n, a) {
						try {
							var s = Object.getOwnPropertyDescriptor(r, n);
							if (s?.writable === !1 && s?.enumerable === !1)
								return !1;
							if (n.constructor == e.Symbol)
								return Reflect.set(r, n, a), r[n];
							if (r.hasOwnProperty('undefined') && r[n] + '' == n)
								return r[n] || a || !0;
							if (n == 'location')
								return (i.__dynamic$location = a);
							if (
								r.hasOwnProperty(n) &&
								!r.propertyIsEnumerable(n) &&
								!s?.writable
							)
								return r[n];
							try {
								i.__dynamic
									? i.__dynamic.Reflect.set(r, n, a)
									: (r[n] = a);
							} catch {
								return r[n] || !0;
							}
							return r[n] || !0;
						} catch {
							return r[n] || !0;
						}
					}
				});
			}),
			e.__dynamic.define(e, '__dynamic$window', {
				value: e.__dynamic.util.CreateWindowProxy(e),
				configurable: !1,
				enumerable: !1,
				writable: !1
			}),
			e.document &&
				e.__dynamic.define(e, '__dynamic$document', {
					value: e.__dynamic.util.CreateDocumentProxy(e.document),
					configurable: !1,
					enumerable: !1,
					writable: !1
				}),
			(e.__dynamic$globalThis = e.__dynamic$window),
			(e.__dynamic$self = e.__dynamic$window);
	}
	function Vi(e) {
		e.__dynamic.rewrite.dom = function (t, i) {
			if (typeof e.DOMParser > 'u' || !t) return t;
			var r = new e.DOMParser(),
				n = r.parseFromString(t.toString(), 'text/html'),
				a = n.documentElement;
			return (
				a.querySelectorAll('script').forEach(function (s) {
					!s.type ||
					(s.type &&
						s.type !== 'text/javascript' &&
						s.type !== 'application/javascript' &&
						s.type !== 'application/x-javascript')
						? s.src &&
							(s.src = e.__dynamic.url.encode(
								s.getAttribute('src'),
								i
							))
						: s.innerHTML &&
							(s.innerHTML = e.__dynamic.js.encode(
								s.innerHTML,
								{ type: 'script' },
								i,
								{}
							));
				}),
				a.querySelectorAll('link').forEach(function (s) {
					s.href &&
						s.getAttribute('rel') !== 'stylesheet' &&
						(s.href = e.__dynamic.url.encode(
							s.getAttribute('href'),
							i
						));
				}),
				a.querySelectorAll('img').forEach(function (s) {
					s.src &&
						(s.src = e.__dynamic.url.encode(
							s.getAttribute('src'),
							i
						)),
						s.srcset &&
							(s.srcset = e.__dynamic.rewrite.srcset.encode(
								s.getAttribute('srcset'),
								e.__dynamic
							));
				}),
				a.querySelectorAll('a').forEach(function (s) {
					s.href &&
						(s.href = e.__dynamic.url.encode(
							s.getAttribute('href'),
							i
						));
				}),
				a.querySelectorAll('style').forEach(function (s) {
					s.innerHTML &&
						(s.innerHTML = e.__dynamic.rewrite.css.rewrite(
							s.innerHTML,
							i
						));
				}),
				a.outerHTML
			);
		};
	}
	function $i(e) {
		let t = r =>
			new DOMParser().parseFromString(r, 'text/html').body.innerHTML;
		if (
			(e.__dynamic.elements.config.forEach(r => {
				r.elements.forEach(n => {
					r.tags.forEach(a => {
						var s = Object.getOwnPropertyDescriptor(n.prototype, a);
						s ||
							(s = Object.getOwnPropertyDescriptor(
								HTMLElement.prototype,
								a
							)),
							typeof n.prototype.setAttribute.__dynamic$target >
								'u' &&
								((n.prototype.setAttribute = e.__dynamic.wrap(
									n.prototype.setAttribute,
									function (o, ...c) {
										return this instanceof
											HTMLLinkElement &&
											e.__dynamic$icon &&
											c[0].toLowerCase() == 'href' &&
											(this.rel == 'icon' ||
												this.rel == 'shortcut icon')
											? ((c[1] = e.__dynamic$icon),
												Reflect.apply(o, this, c))
											: e.__dynamic.elements.attributes.indexOf(
														c[0].toLowerCase()
												  ) == -1
												? Reflect.apply(o, this, c)
												: c[0].toLowerCase() ==
															'srcset' ||
													  c[0].toLowerCase() ==
															'imagesrcset'
													? ((this.dataset[
															`dynamic_${c[0]}`
														] = c[1]),
														(c[1] =
															e.__dynamic.rewrite.srcset.encode(
																c[1],
																e.__dynamic
															)),
														Reflect.apply(
															o,
															this,
															c
														))
													: c[0].toLowerCase() ==
																'integrity' ||
														  c[0].toLowerCase() ==
																'nonce'
														? ((this.dataset[
																`dynamic_${c[0]}`
															] = c[1]),
															this.removeAttribute(
																c[0]
															),
															Reflect.apply(
																o,
																this,
																[
																	'nointegrity',
																	c[1]
																]
															))
														: ((this.dataset[
																`dynamic_${c[0]}`
															] = c[1]),
															(c[1] =
																e.__dynamic.url.encode(
																	c[1],
																	e.__dynamic
																		.baseURL ||
																		e
																			.__dynamic
																			.meta
																)),
															Reflect.apply(
																o,
																this,
																c
															));
									},
									'setAttribute'
								)),
								(n.prototype.setAttributeNS = e.__dynamic.wrap(
									n.prototype.setAttributeNS,
									function (o, ...c) {
										return this instanceof
											HTMLLinkElement &&
											e.__dynamic$icon &&
											c[1].toLowerCase() == 'href' &&
											(this.rel == 'icon' ||
												this.rel == 'shortcut icon')
											? ((c[2] = e.__dynamic$icon),
												Reflect.apply(o, this, c))
											: e.__dynamic.elements.attributes.indexOf(
														c[1].toLowerCase()
												  ) == -1
												? Reflect.apply(o, this, c)
												: c[1].toLowerCase() ==
															'srcset' ||
													  c[1].toLowerCase() ==
															'imagesrcset'
													? ((this.dataset[
															`dynamic_${c[1]}`
														] = c[2]),
														(c[2] =
															e.__dynamic.rewrite.srcset.encode(
																c[2],
																e.__dynamic
															)),
														Reflect.apply(
															o,
															this,
															c
														))
													: c[1].toLowerCase() ==
																'integrity' ||
														  c[1].toLowerCase() ==
																'nonce'
														? ((this.dataset[
																`dynamic_${c[1]}`
															] = c[2]),
															this.removeAttribute(
																c[1]
															),
															Reflect.apply(
																o,
																this,
																[
																	'nointegrity',
																	c[2]
																]
															))
														: ((this.dataset[
																`dynamic_${c[1]}`
															] = c[2]),
															(c[2] =
																e.__dynamic.url.encode(
																	c[2],
																	e.__dynamic
																		.baseURL ||
																		e
																			.__dynamic
																			.meta
																)),
															Reflect.apply(
																o,
																this,
																c
															));
									},
									'setAttributeNS'
								)),
								(n.prototype.getAttribute = e.__dynamic.wrap(
									n.prototype.getAttribute,
									function (o, ...c) {
										return this.dataset[`dynamic_${c[0]}`]
											? this.dataset[`dynamic_${c[0]}`]
											: Reflect.apply(o, this, c);
									},
									'getAttribute'
								)),
								(n.prototype.getAttributeNS = e.__dynamic.wrap(
									n.prototype.getAttributeNS,
									function (o, ...c) {
										return this.dataset[`dynamic_${c[1]}`]
											? this.dataset[`dynamic_${c[1]}`]
											: Reflect.apply(o, this, c);
									},
									'getAttributeNS'
								))),
							e.__dynamic.define(n.prototype, a, {
								get() {
									if (r.action == 'window') {
										let o =
												e.__dynamic.elements.contentWindow.get.call(
													this
												),
											c = !0;
										try {
											o.location.href;
										} catch {
											c = !1;
										}
										if (
											(c &&
												(o.__dynamic ||
													e.__dynamic.elements.client(
														o,
														e.__dynamic$config,
														decodeURIComponent(
															this.src
														)
													)),
											a == 'contentDocument')
										)
											return o.document;
										if (a == 'contentWindow')
											return (
												(c && o.__dynamic$window) || o
											);
									}
									if (r.action == 'css')
										return s.get.call(this);
									try {
										return e.__dynamic.url.decode(
											s.get.call(this)
										);
									} catch {}
									return s.get.call(this);
								},
								set(o) {
									return (
										o &&
											typeof o == 'string' &&
											(o = o.toString()),
										a == 'href' &&
											this instanceof HTMLLinkElement &&
											e.__dynamic$icon &&
											(this.rel == 'icon' ||
												this.rel == 'shortcut icon') &&
											((this.dataset[`dynamic_${a}`] = o),
											(o = e.__dynamic$icon)),
										r.action == 'html'
											? (Promise.resolve(
													e.__dynamic.createBlobHandler(
														new Blob([o], {
															type: 'text/html'
														}),
														this,
														o
													)
												).then(c => {
													this.setAttribute(a, c);
												}),
												o)
											: (r.action == 'srcset' &&
													(o =
														e.__dynamic.rewrite.srcset.encode(
															o,
															e.__dynamic
														)),
												r.action == 'rewrite'
													? ((this.dataset[
															`dynamic_${a}`
														] = o),
														this.removeAttribute(a),
														this.setAttribute(
															r.new,
															o
														))
													: (r.action == 'css' &&
															(o =
																e.__dynamic.rewrite.css.rewrite(
																	o,
																	e.__dynamic
																		.meta
																)),
														r.action == 'url' &&
															(o =
																e.__dynamic.url.encode(
																	o,
																	e.__dynamic
																		.baseURL ||
																		e
																			.__dynamic
																			.meta
																)),
														(this.dataset[
															`dynamic_${a}`
														] = o),
														s.set.call(this, o)))
									);
								}
							});
					});
				});
			}),
			['innerHTML', 'outerHTML'].forEach(r => {
				e.__dynamic.define(e.HTMLElement.prototype, r, {
					get() {
						return (
							this['__' + r] ||
							e.__dynamic.elements[r].get.call(this)
						).toString();
					},
					set(n) {
						return (
							(this['__' + r] = t(n)),
							this instanceof e.HTMLTextAreaElement
								? e.__dynamic.elements[r].set.call(this, n)
								: this instanceof e.HTMLScriptElement
									? e.__dynamic.elements[r].set.call(
											this,
											e.__dynamic.rewrite.js.rewrite(n, {
												type: 'script'
											})
										)
									: this instanceof e.HTMLStyleElement
										? e.__dynamic.elements[r].set.call(
												this,
												e.__dynamic.rewrite.css.rewrite(
													n,
													e.__dynamic.meta
												)
											)
										: e.__dynamic.elements[r].set.call(
												this,
												e.__dynamic.rewrite.dom(
													n,
													e.__dynamic.meta
												)
											)
						);
					}
				});
			}),
			[
				'MutationObserver',
				'ResizeObserver',
				'IntersectionObserver'
			].forEach(r => {
				e[r].prototype.observe = e.__dynamic.wrap(
					e[r].prototype.observe,
					function (n, ...a) {
						return (
							a[0] == e.__dynamic$document && (a[0] = e.document),
							Reflect.apply(n, this, a)
						);
					},
					r + '.prototype.observe'
				);
			}),
			e.__dynamic.defines(e.HTMLAnchorElement.prototype, {
				pathname: e.__dynamic.elements.createGetter('pathname'),
				origin: e.__dynamic.elements.createGetter('origin'),
				host: e.__dynamic.elements.createGetter('host'),
				hostname: e.__dynamic.elements.createGetter('hostname'),
				port: e.__dynamic.elements.createGetter('port'),
				protocol: e.__dynamic.elements.createGetter('protocol'),
				search: e.__dynamic.elements.createGetter('search'),
				hash: e.__dynamic.elements.createGetter('hash'),
				toString: {
					get: function () {
						return (
							this.__toString ||
							(() =>
								this.href ? new URL(this.href).toString() : '')
						);
					},
					set: function (r) {
						this.__toString = r;
					}
				}
			}),
			(e.HTMLElement.prototype.insertAdjacentHTML = e.__dynamic.wrap(
				e.HTMLElement.prototype.insertAdjacentHTML,
				function (r, ...n) {
					return this instanceof e.HTMLStyleElement
						? Reflect.apply(r, this, [
								n[0],
								e.__dynamic.rewrite.css.rewrite(
									n[1],
									e.__dynamic.meta
								)
							])
						: this instanceof e.HTMLScriptElement
							? Reflect.apply(r, this, [
									n[0],
									e.__dynamic.rewrite.js.rewrite(
										n[1],
										{ type: 'script' },
										!1,
										e.__dynamic
									)
								])
							: this instanceof e.HTMLTextAreaElement
								? Reflect.apply(r, this, n)
								: Reflect.apply(r, this, [
										n[0],
										e.__dynamic.rewrite.html.rewrite(
											n[1],
											e.__dynamic.meta
										)
									]);
				},
				'insertAdjacentHTML'
			)),
			[
				[e.Node, 'textContent'],
				[e.HTMLElement, 'innerText']
			].forEach(([r, n]) => {
				var a = Object.getOwnPropertyDescriptor(r.prototype, n);
				function s() {
					return this['__' + n] || (a?.get && a.get.call(this));
				}
				e.__dynamic.define(e.HTMLStyleElement.prototype, n, {
					get: s,
					set(o) {
						return (
							(this['__' + n] = o),
							a?.set &&
								a.set.call(
									this,
									e.__dynamic.rewrite.css.rewrite(
										o,
										e.__dynamic.meta
									)
								)
						);
					}
				}),
					e.__dynamic.define(e.HTMLScriptElement.prototype, n, {
						get: s,
						set(o) {
							return (
								(this['__' + n] = o),
								this.type !== null ||
								this.type !== 'application/javascript' ||
								this.type !== 'text/javascript' ||
								this.type !== 'application/x-javascript'
									? a?.set && a.set.call(this, o)
									: a?.set &&
										a.set.call(
											this,
											e.__dynamic.rewrite.js.rewrite(
												o,
												{ type: 'script' },
												!1,
												e.__dynamic
											)
										)
							);
						}
					});
			}),
			(e.Text.prototype.toString = function () {
				return this.textContent;
			}),
			(e.document.createElement = e.__dynamic.wrap(
				e.document.createElement,
				function (r, ...n) {
					var a = Reflect.apply(r, this, n);
					return (
						(a.rewritten = !0),
						n[0].toLowerCase() == 'iframe' &&
							(a.src = 'about:blank'),
						a
					);
				},
				'createElement'
			)),
			!document.querySelector(
				'link[rel="icon"], link[rel="shortcut icon"]'
			))
		) {
			var i = document.createElement('link');
			(i.rel = 'icon'),
				(i.href = (e.__dynamic$icon || '/favicon.ico') + '?dynamic'),
				(i.dataset.dynamic_hidden = 'true'),
				document.head.appendChild(i);
		}
		e.__dynamic.define(e.Attr.prototype, 'value', {
			get() {
				return (
					this.__value ||
					e.__dynamic.elements.attrValue.get.call(this)
				);
			},
			set(r) {
				return (
					(this.__value = r),
					this.name == 'href' || this.name == 'src'
						? e.__dynamic.elements.attrValue.set.call(
								this,
								e.__dynamic.url.encode(r, e.__dynamic.meta)
							)
						: this.name == 'style'
							? e.__dynamic.elements.attrValue.set.call(
									this,
									e.__dynamic.rewrite.css.rewrite(
										r,
										e.__dynamic.meta
									)
								)
							: this.name == 'onclick'
								? e.__dynamic.elements.attrValue.set.call(
										this,
										e.__dynamic.rewrite.js.rewrite(
											r,
											{ type: 'script' },
											!1,
											e.__dynamic
										)
									)
								: e.__dynamic.elements.attrValue.set.call(
										this,
										r
									)
				);
			}
		});
	}
	function ji(e) {
		let t = e.XMLHttpRequest;
		e.Worker = new Proxy(e.Worker, {
			construct(i, r) {
				if (r[0])
					if (
						((r[0] = r[0].toString()),
						r[0].trim().startsWith(`blob:${e.location.origin}`))
					) {
						let n = new t();
						n.open('GET', r[0], !1), n.send();
						let a = e.__dynamic.rewrite.js.rewrite(
								n.responseText,
								{ type: 'worker' },
								!0
							),
							s = new Blob([a], {
								type: 'application/javascript'
							});
						r[0] = URL.createObjectURL(s);
					} else
						r[0] = e.__dynamic.url.encode(r[0], e.__dynamic.meta);
				return Reflect.construct(i, r);
			}
		});
	}
	function Ui(e) {
		(e.__dynamic$history = function (t, ...i) {
			i[2] && (i[2] = e.__dynamic.url.encode(i[2], e.__dynamic.meta)),
				e.__dynamic.Reflect.apply(t, this, i),
				e.__dynamic.client.location(e, !0, !1);
		}),
			(e.History.prototype.pushState = e.__dynamic.wrap(
				e.History.prototype.pushState,
				e.__dynamic$history
			)),
			(e.History.prototype.replaceState = e.__dynamic.wrap(
				e.History.prototype.replaceState,
				e.__dynamic$history
			));
	}
	function Hi(e) {
		e.WebSocket = new Proxy(e.WebSocket, {
			construct(t, i) {
				return e.__dynamic.bare.createWebSocket(
					i[0],
					i[1],
					t,
					{
						'User-Agent': navigator.userAgent,
						Origin: e.__dynamic$location.origin
					},
					ArrayBuffer.prototype
				);
			}
		});
	}
	function Wi(e) {
		(e.Request = e.__dynamic.wrap(e.Request, function (t, ...i) {
			if (i[0] instanceof t) {
				let r = Reflect.construct(t, i);
				return i[0].mode === 'navigate' && (r.mode = 'same-origin'), r;
			}
			return (
				i[0] && (i[0] = e.__dynamic.url.encode(i[0], e.__dynamic.meta)),
				i
			);
		})),
			e.__dynamic.define(e.Request.prototype, 'url', {
				get() {
					return e.__dynamic.url.decode(
						e.__dynamic.http.RequestURL.get.call(this)
					);
				},
				set(t) {
					return t;
				}
			}),
			(e.fetch = e.__dynamic.wrap(
				e.fetch,
				function (t, ...i) {
					return e.Request &&
						(i[0].constructor.name === 'Request' ||
							i[0] instanceof e.Request)
						? (console.log(i[0]), Reflect.apply(t, e, i))
						: (i[0] &&
								e.__dynamic &&
								(i[0] = e.__dynamic.url.encode(
									i[0],
									e.__dynamic.meta
								)),
							Reflect.apply(t, e, i));
				},
				'fetch'
			)),
			(e.XMLHttpRequest.prototype.open = e.__dynamic.wrap(
				e.XMLHttpRequest.prototype.open,
				function (t, ...i) {
					return (
						i[1] &&
							(i[1] = e.__dynamic.url.encode(
								i[1],
								e.__dynamic.meta
							)),
						i[2] === !1 && (i[2] = !0),
						Reflect.apply(t, this, i)
					);
				},
				'XMLHttpRequest.prototype.open'
			)),
			Object.defineProperty(e.XMLHttpRequest.prototype, 'responseURL', {
				get() {
					return e.__dynamic.url.decode(
						e.__dynamic.http.XMLResponseURL.get.call(this)
					);
				},
				set(t) {
					return t;
				}
			}),
			Object.defineProperty(e.Response.prototype, 'url', {
				get() {
					return e.__dynamic.url.decode(
						e.__dynamic.http.ResponseURL.get.call(this)
					);
				},
				set(t) {
					return t;
				}
			}),
			(e.open = e.__dynamic.wrap(
				e.open,
				function (t, ...i) {
					i[0] != '' &&
						i[0] &&
						(i[0] = e.__dynamic.url.encode(i[0], e.__dynamic.meta)),
						i[0] == '' && (i[0] = 'about:blank');
					let r = Reflect.apply(t, this, i);
					r.opener = e.__dynamic$window;
					try {
						new URL(i[0]).protocol === 'about:'
							? (r.__dynamic$url = 'about:srcdoc')
							: (r.__dynamic$url = e.__dynamic.url.decode(i[0]));
					} catch {
						r.__dynamic$url = 'about:srcdoc';
					}
					return (
						e.__dynamic.elements.client(
							r,
							e.__dynamic$config,
							r.__dynamic$url
						),
						r.__dynamic$window
					);
				},
				'window.open'
			)),
			e.__dynamic.define(e, '__dynamic$import', {
				get() {
					return function (t, i) {
						try {
							return e.__dynamic.url.encode(t, new URL(i));
						} catch {
							return e.__dynamic.url.encode(t, e.__dynamic.meta);
						}
					};
				},
				set: () => {}
			});
	}
	function yt(e) {
		let t = a =>
				a.constructor.name == 'Worker' ||
				a.constructor.name == 'MessagePort' ||
				e.constructor.name == 'DedicatedWorkerGlobalScope',
			i = a =>
				a.constructor.name == 'Window' ||
				a.constructor.name == 'global',
			r = (a, s) =>
				Object.keys(window || {})
					.map(o => parseInt(o))
					.filter(o => isFinite(o))
					.map(o => window[o])
					.filter(o => o || !1)
					.find(o => {
						try {
							return o.name == a && o.location.href == s;
						} catch {
							return !1;
						}
					});
		(e.__dynamic$message = function (a, s = top) {
			a || (a = e);
			function o() {
				var c = arguments;
				return t(a) || !i(a)
					? a.postMessage.call(a, ...c)
					: (a.__dynamic$self && (a = a.__dynamic$self),
						(a._postMessage || a.postMessage).call(
							a,
							[
								c[0],
								s.__dynamic$location.origin,
								s.location.href,
								s.name,
								s !== e
							],
							'*',
							c[2] || []
						));
			}
			return o;
		}),
			e.constructor.name == 'Window' &&
				(e.addEventListener &&
					(e.addEventListener = new Proxy(e.addEventListener, {
						apply(a, s, o) {
							if (
								(s == e.__dynamic$window && (s = e),
								!o[1] || !o[0] || typeof o[1] != 'function')
							)
								return Reflect.apply(a, s, o);
							if (o[0] == 'message') {
								var c = o[1].bind({});
								o[1] = function (l) {
									return c(n(l));
								};
							}
							return Reflect.apply(a, s, o);
						}
					})),
				e.constructor.name == 'Window' &&
					e.__dynamic.define(e, 'onmessage', {
						get() {
							return e._onmessage || null;
						},
						set(a) {
							return (
								e._onmessage &&
									e.removeEventListener(
										'message',
										e._onmessage
									),
								e.addEventListener('message', a),
								(e._onmessage = a)
							);
						}
					}));
		function n(a) {
			let s = e.__dynamic.util.clone(a),
				o;
			a.source && (o = r(a.data[3], a.data[2]) || a.currentTarget),
				e.__dynamic.define(s, 'isTrusted', { value: !0, writable: !1 }),
				a.origin &&
					(Array.isArray(a.data) && a.data.length == 5
						? e.__dynamic.define(s, 'origin', {
								value: a.data[1],
								writable: !1
							})
						: e.__dynamic.define(s, 'origin', {
								value: a.origin,
								writable: !1
							})),
				a.data &&
					(Array.isArray(a.data) && a.data.length == 5
						? e.__dynamic.define(s, 'data', {
								value: a.data[0],
								writable: !1
							})
						: e.__dynamic.define(s, 'data', {
								value: a.data,
								writable: !1
							})),
				a.source &&
					(o
						? e.__dynamic.define(s, 'source', {
								value: o?.__dynamic$window || o,
								writable: !0
							})
						: e.__dynamic.define(s, 'source', {
								value:
									o ||
									(Array.isArray(a.data) &&
										a.data.length == 3 &&
										a.data[2] === !0)
										? a.source
										: a.currentTarget,
								writable: !0
							}));
			for (var c in a)
				switch (c) {
					default:
						c !== 'isTrusted' &&
							c !== 'origin' &&
							c !== 'data' &&
							c !== 'source' &&
							e.__dynamic.define(s, c, {
								value: a[c],
								writable: !1
							});
						break;
				}
			return s;
		}
	}
	function zi(e) {
		function t(i, ...r) {
			for (var n in r)
				r[n] = e.__dynamic.rewrite.dom(r[n], e.__dynamic.meta);
			return i.apply(this, r);
		}
		['write', 'writeln'].forEach(i => {
			e.document[i] = e.__dynamic.wrap(e.document[i], t, `document.${i}`);
		});
	}
	function gt(e) {
		(e.importScripts = new Proxy(e.importScripts, {
			apply(t, i, r) {
				return (
					[...r].forEach((n, a) => {
						r[a] = e.__dynamic.url.encode(n, e.__dynamic.meta);
					}),
					Reflect.apply(t, i, r)
				);
			}
		})),
			e.__dynamic.define(e.__dynamic, '_location', {
				value: e.location,
				writable: !0
			}),
			e.__dynamic.define(e.WorkerGlobalScope.prototype, 'location', {
				get() {
					return e.__dynamic.location;
				},
				set(t) {
					return t;
				}
			}),
			(e.location = e.__dynamic.location);
	}
	function xt(e) {
		var t = e.Reflect.get.bind({}),
			i = e.Reflect.set.bind({});
		(e.Reflect.set = e.__dynamic.wrap(
			e.Reflect.set,
			function (r, ...n) {
				return n[0].constructor.name == 'Window' && n[1] == 'location'
					? ((n[0].__dynamic$location = n[2]), !0)
					: n[0].constructor.name == 'Location'
						? ((e.__dynamic$location[n[1]] = n[2]), !0)
						: Reflect.apply(i, this, n);
			},
			'Reflect.set'
		)),
			(e.Reflect.get = e.__dynamic.wrap(
				e.Reflect.get,
				function (r, ...n) {
					if (typeof n[0] == 'object') {
						if (n[0].constructor.name == 'Window') {
							if (n[1] == 'location')
								return n[0].__dynamic
									? n[0].__dynamic$location
									: Reflect.apply(t, this, n);
							if (
								n[0][n[1]] &&
								n[0][n[1]].constructor.name == 'Window'
							)
								return n[0][n[1]].__dynamic$window;
						}
						if (n[0].constructor.name == 'Location')
							return e.__dynamic$location[n[1]];
					}
					return Reflect.apply(t, this, n);
				},
				'Reflect.get'
			)),
			(e.__dynamic.Reflect = {
				get: t,
				set: i,
				apply: e.Reflect.apply.bind({}),
				construct: e.Reflect.construct.bind({}),
				defineProperty: e.Reflect.defineProperty.bind({}),
				deleteProperty: e.Reflect.deleteProperty.bind({}),
				getOwnPropertyDescriptor:
					e.Reflect.getOwnPropertyDescriptor.bind({}),
				getPrototypeOf: e.Reflect.getPrototypeOf.bind({}),
				has: e.Reflect.has.bind({}),
				isExtensible: e.Reflect.isExtensible.bind({}),
				ownKeys: e.Reflect.ownKeys.bind({}),
				preventExtensions: e.Reflect.preventExtensions.bind({}),
				setPrototypeOf: e.Reflect.setPrototypeOf.bind({})
			});
	}
	function qi(e) {
		e.__dynamic.define(e.document, 'origin', {
			value: e.__dynamic$location.origin,
			configurable: !1,
			enumerable: !1
		}),
			e.__dynamic.define(e.document, 'domain', {
				value: e.__dynamic$location.hostname,
				configurable: !1,
				enumerable: !1
			}),
			['referrer', 'URL', 'documentURI'].forEach(t => {
				e.__dynamic.define(e.document, t, {
					value: e.__dynamic$location.toString(),
					configurable: !1,
					enumerable: !1
				});
			}),
			[e.document, e.HTMLElement.prototype].forEach(t => {
				e.__dynamic.define(t, 'baseURI', {
					get() {
						return (e.__dynamic.baseURL || e.__dynamic$location)
							.href;
					}
				});
			}),
			['getEntries', 'getEntriesByName', 'getEntriesByType'].forEach(
				t => {
					e.performance[t] = new Proxy(e.performance[t], {
						apply(i, r, n) {
							return Reflect.apply(i, r, n)
								.filter(
									a =>
										!a.name?.includes(
											e.location.origin +
												'/dynamic/dynamic.'
										)
								)
								.filter(
									a =>
										!a.name.includes(
											e.location.origin +
												e.__dynamic.config.prefix +
												'caches/'
										)
								)
								.map(a => {
									if (a.name) {
										var s = e.__dynamic.util.clone(a);
										s.__defineGetter__('name', function () {
											return this._name;
										}),
											s.__defineSetter__(
												'name',
												function (l) {
													this._name = l;
												}
											),
											(s.name = e.__dynamic.url.decode(
												a.name
											)),
											e.__dynamic.define(s, 'name', {
												get: void 0,
												set: void 0
											}),
											e.__dynamic.define(s, 'name', {
												value: s._name,
												writable: !1
											}),
											delete s._name;
										for (var o in a)
											if (o != 'name') {
												if (typeof a[o] == 'function')
													var c = new Proxy(a[o], {
														apply(l, p, f) {
															if (
																l.name ==
																'toJSON'
															) {
																var g = {};
																for (var x in s)
																	g[x] = s[x];
																return g;
															}
															return Reflect.apply(
																l,
																a,
																f
															);
														}
													});
												else var c = a[o];
												Object.defineProperty(s, o, {
													value: c,
													writable: !0
												});
											}
										a = s;
									}
									return a;
								});
						}
					});
				}
			),
			e.MouseEvent &&
				(e.MouseEvent.prototype.initMouseEvent = e.__dynamic.wrap(
					e.MouseEvent.prototype.initMouseEvent,
					function (t, ...i) {
						return (
							i.length &&
								(i = i.map(r =>
									r == e.__dynamic$window ? e : r
								)),
							Reflect.apply(t, this, i)
						);
					}
				)),
			e.KeyboardEvent &&
				(e.KeyboardEvent.prototype.initKeyboardEvent = e.__dynamic.wrap(
					e.KeyboardEvent.prototype.initKeyboardEvent,
					function (t, ...i) {
						return (
							i.length &&
								(i = i.map(r =>
									r == e.__dynamic$window ? e : r
								)),
							Reflect.apply(t, this, i)
						);
					}
				)),
			e.StorageEvent &&
				(e.StorageEvent.prototype.initStorageEvent = e.__dynamic.wrap(
					e.StorageEvent.prototype.initStorageEvent,
					function (t, ...i) {
						return (
							i.length &&
								(i = i.map(r =>
									r == e.localStorage
										? e.__dynamic.storage.localStorage
										: r == e.sessionStorage
											? e.__dynamic.storage.sessionStorage
											: r
								)),
							Reflect.apply(t, this, i)
						);
					}
				)),
			(e.Object.defineProperty = e.__dynamic.wrap(
				e.Object.defineProperty,
				function (t, ...i) {
					try {
						return Reflect.apply(t, this, i);
					} catch (r) {
						r.toString().includes('Cannot redefine property:') &&
							(i[0].__defined || (i[0].__defined = {}),
							(i[0].__defined[i[1]] = i[2]));
					}
				}
			)),
			e.__dynamic.meta.origin == 'https://www.google.com' &&
				(e.setInterval = new Proxy(e.setInterval, {
					apply(t, i, r) {
						return r[1] == 500 ? null : Reflect.apply(t, i, r);
					}
				}));
	}
	function Gi(e) {
		(e.Storage.prototype.setItem = e.__dynamic.wrap(
			e.Storage.prototype.setItem,
			function (t, ...i) {
				return (
					i[0] &&
						(i[0] =
							'__dynamic$' +
							e.__dynamic$location.host +
							'$' +
							i[0].toString()),
					Reflect.apply(t, this, i)
				);
			},
			'Storage.prototype.setItem'
		)),
			(e.Storage.prototype.getItem = e.__dynamic.wrap(
				e.Storage.prototype.getItem,
				function (t, ...i) {
					return (
						i[0] &&
							(i[0] =
								'__dynamic$' +
								e.__dynamic$location.host +
								'$' +
								i[0].toString()),
						Reflect.apply(t, this, i) || null
					);
				},
				'Storage.prototype.getItem'
			)),
			(e.Storage.prototype.removeItem = e.__dynamic.wrap(
				e.Storage.prototype.removeItem,
				function (t, ...i) {
					return (
						i[0] &&
							(i[0] =
								'__dynamic$' +
								e.__dynamic$location.host +
								'$' +
								i[0].toString()),
						Reflect.apply(t, this, i)
					);
				},
				'Storage.prototype.removeItem'
			)),
			(e.Storage.prototype.clear = e.__dynamic.wrap(
				e.Storage.prototype.clear,
				function (t, ...i) {
					for (var r = [], n = 0; n < this.length; n++)
						t
							.call(this, n)
							?.startsWith(
								'__dynamic$' + e.__dynamic$location.host + '$'
							) &&
							r.push(
								t
									.call(this, n)
									?.replace(
										'__dynamic$' +
											e.__dynamic$location.host +
											'$',
										''
									)
							);
					for (var a in r) t.call(this, r[a]);
				},
				'Storage.prototype.clear'
			)),
			(e.Storage.prototype.key = e.__dynamic.wrap(
				e.Storage.prototype.key,
				function (t, ...i) {
					for (var r = [], n = 0; n < this.length; n++)
						t
							.call(this, n)
							?.startsWith(
								'__dynamic$' + e.__dynamic$location.host + '$'
							) &&
							r.push(
								t
									.call(this, n)
									?.replace(
										'__dynamic$' +
											e.__dynamic$location.host +
											'$',
										''
									)
							);
					return r[i[0]] ? r[i[0]] : null;
				},
				'Storage.prototype.key'
			)),
			['localStorage', 'sessionStorage'].forEach(t => {
				(e['__dynamic$' + t] = new Proxy(e[t], {
					get(i, r) {
						if (r == 'length') {
							for (
								var n = [], a = 0;
								a < Object.keys(e.__dynamic.storage[t]).length;
								a++
							)
								Object.keys(e.__dynamic.storage[t])[
									a
								].startsWith(
									'__dynamic$' +
										e.__dynamic$location.host +
										'$'
								) &&
									n.push(
										Object.keys(e.__dynamic.storage[t])[
											a
										].replace(
											'__dynamic$' +
												e.__dynamic$location.host +
												'$',
											''
										)
									);
							return n.length;
						}
						return e.__dynamic.storage.methods.includes(r)
							? e.__dynamic.storage.cloned[t][r].bind(
									e.__dynamic.storage[t]
								)
							: e.__dynamic.storage[t].getItem(
									'__dynamic$' +
										e.__dynamic$location.host +
										'$' +
										r.toString()
								);
					},
					set(i, r, n) {
						return (
							e.__dynamic.storage[t].setItem(
								'__dynamic$' +
									e.__dynamic$location.host +
									'$' +
									r.toString(),
								n
							),
							n || !0
						);
					},
					deleteProperty(i, r) {
						return e.__dynamic.storage[t].removeItem(
							'__dynamic$' +
								e.__dynamic$location.host +
								'$' +
								r.toString()
						);
					}
				})),
					delete e[t],
					(e[t] = e['__dynamic$' + t]);
			});
	}
	function Ki(e) {
		'serviceWorker' in e.navigator &&
			((e.__dynamic.sw = e.navigator.serviceWorker),
			delete e.navigator.serviceWorker,
			delete e.Navigator.prototype.serviceWorker),
			(e.navigator.sendBeacon = e.__dynamic.wrap(
				e.navigator.sendBeacon,
				function (t, ...i) {
					return (
						i[0] &&
							(i[0] = e.__dynamic.url.encode(
								i[0],
								e.__dynamic.meta
							)),
						Reflect.apply(t, this, i)
					);
				},
				'navigator.sendBeacon'
			));
	}
	var Qi = e =>
			e
				? e
						.split(';')
						.map(t => t.split('='))
						.reduce(
							(t, i) => ((t[i[0].trim()] = i[1].trim()), t),
							{}
						)
				: {},
		qe = (e = []) => e.map(t => `${t.name}=${t.value}`).join('; ');
	function Yi(e) {
		if (
			(delete e.Document.prototype.cookie,
			e.__dynamic.define(e.document, 'cookie', {
				get() {
					var t = e.__dynamic.fire('getCookies', [
						e.__dynamic.location.host,
						e.__dynamic.cookie.str || ''
					]);
					return (
						t ||
						(e.__dynamic.cookies.update(e.__dynamic.location.host),
						e.__dynamic.cookie.str ||
							e.__dynamic.cookie.desc.get.call(this) ||
							'')
					);
				},
				set(t) {
					var i = e.__dynamic.modules.setCookieParser.parse(t, {
							decodeValues: !1
						})[0],
						r = e.__dynamic.fire('setCookie', [
							e.__dynamic.location.host,
							t,
							i
						]);
					if (r) return r;
					(i.name = i.name.replace(/^\./g, '')),
						Promise.resolve(
							e.__dynamic.cookies.set(
								e.__dynamic.location.host,
								e.__dynamic.modules.cookie.serialize(
									i.name,
									i.value,
									{ ...i, encode: a => a }
								)
							)
						).then(async a => {
							await e.__dynamic.cookies.update(
								e.__dynamic.location.host
							),
								(e.__dynamic.cookie.str =
									await e.__dynamic.cookies.get(
										e.__dynamic.location.host
									));
						});
					var n = Qi(e.__dynamic.cookie.str || '');
					(n[i.name] = i.value),
						(e.__dynamic.cookie.str = qe(
							Object.entries(n).map(a => ({
								name: a[0],
								value: a[1]
							}))
						));
				}
			}),
			e.navigator.serviceWorker)
		)
			try {
				e.navigator.serviceWorker.onmessage = ({ data: t }) => {
					if (
						t.host == e.__dynamic.location.host &&
						t.type == 'set-cookie'
					) {
						var i = e.__dynamic.modules.cookie.parse(t.val),
							r = Qi(e.__dynamic.cookie.str || '');
						(r[Object.entries(i)[0][0]] = Object.entries(i)[0][1]),
							(e.__dynamic.cookie.str = qe(
								Object.entries(r).map(n => ({
									name: n[0],
									value: n[1]
								}))
							));
					}
					t.host == e.__dynamic.location.host &&
						t.type == 'cookies' &&
						(e.__dynamic.cookie.str = t.cookies);
				};
			} catch {}
	}
	function Xi(e) {
		(e.CSSStyleDeclaration.prototype._setProperty =
			e.CSSStyleDeclaration.prototype.setProperty),
			(e.CSSStyleDeclaration.prototype.setProperty = e.__dynamic.wrap(
				e.CSSStyleDeclaration.prototype.setProperty,
				function (t, ...i) {
					return (
						(i[0] == 'background-image' ||
							i[0] == 'background' ||
							i[0] == 'backgroundImage') &&
							(i[1] = e.__dynamic.rewrite.css.rewrite(
								i[1],
								e.__dynamic.meta
							)),
						t.apply(this, i)
					);
				},
				'CSSStyleDeclaration.prototype.setProperty'
			)),
			e.__dynamic.define(e.CSSStyleDeclaration.prototype, 'background', {
				get() {
					return this._background
						? this._background
						: this.getPropertyValue('background');
				},
				set(t) {
					return (
						(this._background = t),
						this._setProperty(
							'background',
							e.__dynamic.rewrite.css.rewrite(t, e.__dynamic.meta)
						)
					);
				}
			}),
			e.__dynamic.define(
				e.CSSStyleDeclaration.prototype,
				'backgroundImage',
				{
					get() {
						return this._backgroundImage
							? this._backgroundImage
							: this.getPropertyValue('background-image');
					},
					set(t) {
						return (
							(this._backgroundImage = t),
							this._setProperty(
								'background-image',
								e.__dynamic.rewrite.css.rewrite(
									t,
									e.__dynamic.meta
								)
							)
						);
					}
				}
			),
			e.__dynamic.define(
				e.CSSStyleDeclaration.prototype,
				'background-image',
				{
					get() {
						return this._backgroundImage
							? this._backgroundImage
							: this.getPropertyValue('background-image');
					},
					set(t) {
						return (
							(this._backgroundImage = t),
							this._setProperty(
								'background-image',
								e.__dynamic.rewrite.css.rewrite(
									t,
									e.__dynamic.meta
								)
							)
						);
					}
				}
			);
	}
	function _t(e) {
		e.__dynamic.createBlobHandler = async function (t, i, r) {
			let n = (await e.__dynamic.sw.ready).active;
			e.__dynamic.sw.addEventListener(
				'message',
				({ data: { url: a } }) => {
					a && e.__dynamic.elements.iframeSrc.set.call(i, a);
				},
				{ once: !0 }
			),
				n.postMessage({
					type: 'createBlobHandler',
					blob: t,
					url: e.__dynamic.modules.base64.encode(
						r.toString().split('').slice(0, 10)
					),
					location: e.__dynamic.location.href
				});
		};
	}
	var Mn = (e, t, i) => (
		(i = new MutationObserver(function (n) {
			for (var a of n)
				e[a.type](a),
					document.dispatchEvent(
						new CustomEvent(
							{
								attributes: 'attrChanged',
								characterData: 'characterData',
								childList: 'nodeChanged'
							}[a.type],
							{ detail: a }
						)
					);
		})).observe(t, { subtree: !0, attributes: !0, childList: !0 }),
		i
	);
	function vt(e, t) {
		t || (t = e.__dynamic);
		function i(n) {
			if (!n.rewritten && !(n.nodeType !== 1 && n.nodeType !== 3)) {
				if (
					((n = new Proxy(n, {
						get(o, c) {
							return c == 'src' ||
								c == 'href' ||
								c == 'srcset' ||
								c == 'imageSrcset' ||
								c == 'data' ||
								c == 'action'
								? t.elements.getAttribute.call(
										o,
										c.toLowerCase()
									)
								: c == 'setAttribute' ||
									  c == 'getAttribute' ||
									  c == 'removeAttribute' ||
									  c == 'hasAttribute' ||
									  c == 'cloneNode' ||
									  c == 'addEventListener'
									? (...l) => t.elements[c].call(o, ...l)
									: c == 'node'
										? o
										: o[c];
						},
						set(o, c, l) {
							return (
								c == 'src' ||
								c == 'href' ||
								c == 'srcset' ||
								c == 'imageSrcset' ||
								c == 'data' ||
								c == 'action'
									? t.elements.setAttribute.call(
											o,
											c.toLowerCase(),
											l
										)
									: (o[c] = l),
								!0
							);
						}
					})),
					n instanceof HTMLScriptElement &&
						(n.src &&
							((n.dataset.dynamic_src = n.src),
							(n.src = t.url.encode(n.src, t.meta))),
						n.type && n.textContent?.length
							? (n.type == 'application/javascript' ||
									n.type == 'text/javascript' ||
									(n.type == 'application/x-javascript' &&
										n.textContent?.length)) &&
								(n.textContent = t.rewrite.js.rewrite(
									n.textContent,
									{ type: 'script' },
									!1,
									t
								))
							: !n.type &&
								n.textContent?.length &&
								(n.textContent = t.rewrite.js.rewrite(
									n.textContent,
									{ type: 'script' },
									!1,
									t
								))),
					n instanceof HTMLStyleElement &&
						n.textContent?.length &&
						(n.textContent = t.rewrite.css.rewrite(
							n.textContent,
							t.meta
						)),
					n instanceof HTMLIFrameElement &&
						(n.src &&
							((n.dataset.dynamic_src = n.src),
							(n.src = t.url.encode(n.src, t.meta))),
						n.srcdoc))
				) {
					n.dataset.dynamic_srcdoc = n.srcdoc;
					let o = new Blob(
						[t.rewrite.html.rewrite(n.srcdoc, t.meta)],
						{ type: 'text/html' }
					);
					n.src = URL.createObjectURL(o);
				}
				if (
					(n instanceof HTMLLinkElement &&
						(n.getAttribute('rel') !== 'stylesheet' &&
						n.getAttribute('rel') !== 'prefetch' &&
						n.getAttribute('rel') !== 'dns-prefetch'
							? (n.href &&
									((n.dataset.dynamic_href = n.href),
									(n.href = t.url.encode(n.href, t.meta))),
								n.imageSrcset &&
									((n.dataset.dynamic_imagesrcset =
										n.imageSrcset),
									(n.imageSrcset = t.rewrite.srcset.encode(
										n.imageSrcset,
										t
									))))
							: n.addEventListener(
									'error',
									o => {
										if (n instanceof HTMLLinkElement)
											return (
												n.href &&
													((n.dataset.dynamic_href =
														n.href),
													(n.href = t.url.encode(
														n.href,
														t.meta
													))),
												n.imageSrcset &&
													((n.dataset.dynamic_imagesrcset =
														n.imageSrcset),
													(n.imageSrcset =
														t.rewrite.srcset.encode(
															n.imageSrcset,
															t
														))),
												o.preventDefault(),
												!1
											);
									},
									{ once: !0 }
								)),
					n instanceof HTMLAnchorElement &&
						n.href &&
						((n.dataset.dynamic_href = n.href),
						(n.href = t.url.encode(n.href, t.meta))),
					n instanceof HTMLFormElement &&
						n.action &&
						((n.dataset.dynamic_action = n.action),
						(n.action = t.url.encode(n.action, t.meta))),
					n instanceof HTMLObjectElement &&
						n.data &&
						((n.dataset.dynamic_data = n.data),
						(n.data = t.url.encode(n.data, t.meta))),
					n instanceof HTMLSourceElement &&
						(n.src &&
							((n.dataset.dynamic_src = n.src),
							(n.src = t.url.encode(n.src, t.meta))),
						n.srcset &&
							((n.dataset.dynamic_srcset = n.srcset),
							(n.srcset = t.rewrite.srcset.encode(n.srcset, t)))),
					n instanceof HTMLImageElement &&
						(n.src &&
							((n.dataset.dynamic_src = n.src),
							(n.src = t.url.encode(n.src, t.meta))),
						n.srcset &&
							((n.dataset.dynamic_srcset = n.srcset),
							(n.srcset = t.rewrite.srcset.encode(n.srcset, t)))),
					n instanceof HTMLAreaElement &&
						n.href &&
						((n.dataset.dynamic_href = n.href),
						(n.href = t.url.encode(n.href, t.meta))),
					n instanceof HTMLBaseElement &&
						n.href &&
						((n.dataset.dynamic_href = n.href),
						(n.href = t.url.encode(n.href, t.meta))),
					n instanceof HTMLInputElement &&
						n.src &&
						((n.dataset.dynamic_src = n.src),
						(n.src = t.url.encode(n.src, t.meta))),
					n instanceof HTMLAudioElement &&
						n.src &&
						((n.dataset.dynamic_src = n.src),
						(n.src = t.url.encode(n.src, t.meta))),
					n instanceof HTMLVideoElement &&
						n.src &&
						((n.dataset.dynamic_src = n.src),
						(n.src = t.url.encode(n.src, t.meta))),
					n instanceof HTMLTrackElement &&
						n.src &&
						((n.dataset.dynamic_src = n.src),
						(n.src = t.url.encode(n.src, t.meta))),
					n instanceof HTMLMediaElement &&
						n.src &&
						((n.dataset.dynamic_src = n.src),
						(n.src = t.url.encode(n.src, t.meta))),
					n instanceof HTMLMetaElement && n.httpEquiv)
				) {
					if (n.httpEquiv.toLowerCase() == 'refresh') {
						var a = n.content.split(';url=')[0],
							s = n.content.split(';url=')[1];
						n.content = `${a};url=${t.url.encode(s, t.meta)}`;
					}
					n.httpEquiv.toLowerCase() == 'content-security-policy' &&
						n.remove();
				}
				return (
					n instanceof HTMLElement &&
						(n.getAttribute('style') &&
							n.setAttribute(
								'style',
								t.rewrite.css.rewrite(
									n.getAttribute('style'),
									t.meta
								)
							),
						n.integrity &&
							(n.setAttribute('nointegrity', n.integrity),
							n.removeAttribute('integrity')),
						n.nonce &&
							(n.setAttribute('nononce', n.nonce),
							n.removeAttribute('nonce'))),
					(n.rewritten = !0)
				);
			}
		}
		let r = Mn(
			{
				childList(n) {
					i(n.target);
					for (let s of n.addedNodes)
						if (s.childNodes) for (let o of s.childNodes) i(o);
					if (n.target.childNodes)
						for (var a of n.target.childNodes) i(a);
				},
				attributes(n) {},
				characterData(n) {}
			},
			e.document
		);
		e.document.addEventListener(
			'DOMContentLoaded',
			function () {
				r.disconnect();
			},
			{ once: !0 }
		);
	}
	function Ji(e) {
		(e.__dynamic.eval = e.__dynamic.wrap(
			eval,
			function (t, ...i) {
				if (i.length) {
					var r = i[0].toString();
					return (
						(r = e.__dynamic.rewrite.js.rewrite(
							r,
							{ type: 'script' },
							!1,
							e.__dynamic
						)),
						t.apply(this, [r])
					);
				}
			},
			'eval'
		)),
			e.__dynamic.define(e.Object.prototype, '__dynamic$eval', {
				get() {
					return this === window ? e.__dynamic.eval : this.eval;
				},
				set(t) {
					return t;
				}
			}),
			(e.__dynamic$wrapEval = function (t) {
				if (!arguments.length) return arguments[0];
				var i = e.__dynamic.fire('eval', [e, t]);
				return (
					i ||
					((t = e.__dynamic.rewrite.js.rewrite(
						t,
						{ type: 'script' },
						!1,
						e.__dynamic
					)),
					t)
				);
			});
	}
	function Zi(e) {
		var t = e.Function.prototype.toString;
		(e.__dynamic.Function = e.Function.bind({})),
			e.__dynamic.define(e.Function.prototype, '_toString', {
				get() {
					return t;
				},
				set: () => {}
			});
		var i = function () {
			try {
				var r = Reflect.apply(t, this, []);
			} catch {
				return `function ${this.name}() { [native code] }`;
			}
			return r.includes('[native code]')
				? `function ${this.name}() { [native code] }`
				: r;
		};
		e.__dynamic.define(e.Function.prototype, 'toString', {
			get() {
				return this.__toString || i;
			},
			set(r) {
				this.__toString = r;
			}
		}),
			(e.Function = new Proxy(e.Function, {
				apply(r, n, a) {
					var s = [...a],
						o = s.pop();
					return (
						(o = `(function anonymous(${s.toString()}) {${o}})`),
						(o = e.__dynamic.rewrite.js.rewrite(
							o,
							{ type: 'script' },
							!1,
							e.__dynamic
						)),
						e.eval(o)
					);
				},
				construct(r, n) {
					var a = [...n],
						s = a.pop();
					return (
						(s = `(function anonymous(${a.toString()}) {${s}})`),
						(s = e.__dynamic.rewrite.js.rewrite(
							s,
							{ type: 'script' },
							!1,
							e.__dynamic
						)),
						e.eval(s)
					);
				}
			})),
			(e.Function.prototype.apply = e.__dynamic.wrap(
				e.Function.prototype.apply,
				function (r, ...n) {
					return (
						n[0] == e.__dynamic$window &&
							(n[0] = n[0].__dynamic$self),
						n[0] == e.__dynamic$document && (n[0] = e.document),
						Reflect.apply(r, this, n)
					);
				},
				'Function.prototype.apply'
			)),
			(e.Function.prototype.call = new Proxy(e.Function.prototype.call, {
				apply(r, n, a) {
					return (
						a[0] == e.__dynamic$window &&
							(a[0] = a[0].__dynamic$self),
						a[0] == e.__dynamic$document && (a[0] = e.document),
						Reflect.apply(r, n, a)
					);
				}
			})),
			(e.Function.prototype.bind = e.__dynamic.wrap(
				e.Function.prototype.bind,
				function (r, ...n) {
					return (
						n[0] == e.__dynamic$window &&
							(n[0] = n[0].__dynamic$self),
						n[0] == e.__dynamic$document && (n[0] = e.document),
						r.apply(this, n)
					);
				},
				'Function.prototype.bind'
			));
	}
	function er(e) {}
	function tr(e) {}
	var Dn = [
		{ name: 'get', function: 'self' },
		{ name: 'func', function: 'self' },
		{ name: 'location', function: 'self' },
		{ name: 'mutation', function: 'self' },
		{ name: 'dom', function: 'self' },
		{ name: 'write', function: 'self' },
		{ name: 'message', function: 'self' },
		{ name: 'reflect', function: 'self' },
		{ name: 'window', function: 'self' },
		{ name: 'eval', function: 'self' },
		{ name: 'attr', function: 'self' },
		{ name: 'policy', function: 'self' },
		{ name: 'worker', function: 'self' },
		{ name: 'history', function: 'self' },
		{ name: 'ws', function: 'self' },
		{ name: 'cookie', function: 'self' },
		{ name: 'fetch', function: 'self' },
		{ name: 'niche', function: 'self' },
		{ name: 'storage', function: 'self' },
		{ name: 'style', function: 'self' },
		{ name: 'rtc', function: 'self' },
		{ name: 'blob', function: 'self' },
		{ name: 'navigator', function: 'self' }
	];
	var Ge = class {
		constructor(t) {
			this.methods = Dn;
			self.constructor.name == 'DedicatedWorkerGlobalScope' ||
			self.constructor.name == 'SharedWorkerGlobalScope'
				? ((this.message = yt),
					(this.location = ft),
					(this.window = mt),
					(this.get = dt),
					(this.reflect = xt),
					(this.imports = gt),
					(this.blob = _t),
					(this.mutation = vt))
				: ((this.location = ft),
					(this.get = dt),
					(this.window = mt),
					(this.attr = $i),
					(this.worker = ji),
					(this.history = Ui),
					(this.ws = Hi),
					(this.fetch = Wi),
					(this.message = yt),
					(this.policy = er),
					(this.write = zi),
					(this.imports = gt),
					(this.reflect = xt),
					(this.niche = qi),
					(this.storage = Gi),
					(this.navigator = Ki),
					(this.cookie = Yi),
					(this.style = Xi),
					(this.blob = _t),
					(this.mutation = vt),
					(this.eval = Ji),
					(this.func = Zi),
					(this.rtc = tr),
					(this.dom = Vi)),
				(this.ctx = t);
		}
	};
	function Ds(e, t) {
		return (
			e || (e = []),
			e.find(i => i.name == t.name)
				? (e[e.findIndex(i => i.name == t.name)] = {
						name: t.name,
						value: t.value,
						expires: t.expires
					})
				: e.push({ name: t.name, value: t.value, expires: t.expires }),
			e
		);
	}
	var de = {
		open: async () =>
			Bt('__dynamic$cookies', 1, {
				async upgrade(e) {
					await e.createObjectStore('__dynamic$cookies');
				}
			}),
		set: async (e, t, i) => {
			if (
				(t.domain && (e = t.domain),
				e.startsWith('.') && (e = e.slice(1)),
				t.expires)
			) {
				var r = new Date(t.expires);
				if (r < new Date()) return de.remove(e, t, i);
			}
			return (
				await (
					await i
				).put(
					'__dynamic$cookies',
					Ds(await (await i).get('__dynamic$cookies', e), t),
					e
				),
				!0
			);
		},
		get: async (e, t) => {
			var i = e.replace(/^(.*\.)?([^.]*\..*)$/g, '$2'),
				r = (await (await t).get('__dynamic$cookies', e)) || [];
			if (e !== i && e !== '.' + i) {
				var n = await (await t).get('__dynamic$cookies', i);
				if (n)
					for (var { name: a, value: s, expires: o } of n) {
						if (o) {
							var c = new Date(o);
							if (c <= new Date()) {
								de.remove(
									e,
									n.find(
										l =>
											l.name == a &&
											l.value == s &&
											l.expires == o
									),
									t
								);
								continue;
							}
						}
						r.find(l => l.name == a && l.value == s) ||
							r.push({
								name: a,
								value: s,
								expires: o || new Date(1e13)
							});
					}
			}
			return r;
		},
		remove: async (e, t, i) => {
			t.domain && (e = t.domain), e.startsWith('.') && (e = e.slice(1));
			var r = await (await i).get('__dynamic$cookies', e);
			return r
				? ((r = r.filter(n => n.name !== t.name)),
					await (await i).put('__dynamic$cookies', r, e),
					!0)
				: !1;
		},
		update: async (e, t) => {
			var i = e.replace(/^(.*\.)?([^.]*\..*)$/g, '$2'),
				r = await (await t).get('__dynamic$cookies', i);
			if (r) {
				for (var { name: n, value: a, expires: s } of r)
					if (s) {
						var o = new Date(s);
						if (o <= new Date()) {
							de.remove(e, { name: n, value: a, expires: s }, t);
							continue;
						}
					}
			}
			return r;
		}
	};
	var Ke = class {
		constructor(t) {
			this.db = de;
			this.ctx = t;
		}
		async get(t) {
			this._db || (this._db = this.db.open());
			let i = await de.get(t, this._db);
			return qe(i);
		}
		async set(t, i = '') {
			return (
				(i = this.ctx.modules.setCookieParser.parse(i, {
					decodeValues: !1
				})[0]),
				this._db || (this._db = this.db.open()),
				await de.set(t, i, this._db)
			);
		}
		async open() {
			await de.open();
		}
		async update(t) {
			return (
				this._db || (this._db = this.db.open()),
				await de.update(t, this._db)
			);
		}
	};
	var nr = {};
	sr(nr, {
		aes: () => Fs,
		base64: () => $s,
		none: () => Vs,
		plain: () => Bs,
		xor: () => Os
	});
	var rr = ve(Yn(), 1),
		ea = ve(Jn(), 1),
		Zn = location.origin + navigator.userAgent,
		Os = {
			encode: (e, t = 2) =>
				e &&
				encodeURIComponent(
					e
						.split('')
						.map((i, r) =>
							r % t ? String.fromCharCode(i.charCodeAt(0) ^ t) : i
						)
						.join('')
				),
			decode: (e, t = 2) =>
				e &&
				decodeURIComponent(e)
					.split('')
					.map((i, r) =>
						r % t ? String.fromCharCode(i.charCodeAt(0) ^ t) : i
					)
					.join('')
		},
		Bs = {
			encode: e => e && encodeURIComponent(e),
			decode: e => e && decodeURIComponent(e)
		},
		Fs = {
			encode: e =>
				e && rr.default.encrypt(e, Zn).toString().substring(10),
			decode: e =>
				e &&
				rr.default.decrypt('U2FsdGVkX1' + e, Zn).toString(ea.default)
		},
		Vs = { encode: e => e, decode: e => e },
		$s = {
			encode: e => e && decodeURIComponent(btoa(e)),
			decode: e => e && atob(e)
		};
	var Le = class {
		constructor(t) {
			this.modules = new Sn(this);
			this.util = new Ln(this);
			this.meta = new In(this);
			this.regex = new We(this);
			this.rewrite = new kn(this);
			this.url = new Rn(this);
			this.is = new Nn(this);
			this.cookies = new Ke(this);
			this.client = new Ge(this);
			this.encoding = nr;
			this.headers = Tn;
			this.listeners = [];
			t && !this.config && (this.config = t), t && this.util.encode(self);
		}
		on(t, i) {
			this.listeners.push({ event: t, cb: i });
		}
		fire(t, i) {
			let r = !1;
			for (let n of this.listeners)
				n.event === t && (i = ((r = !0), n.cb(...i)));
			return r && i ? i : null;
		}
	};
	function Qe(e) {
		e.__dynamic.wrap = function (t, i, r) {
			if (t.__dynamic$target) return t;
			if (t.toString().includes('{ [native code] }') && !t.prototype) {
				var n = i,
					a = t,
					s = function (...c) {
						if (typeof r == 'string') {
							var l = e.__dynamic.fire(
								r,
								this ? [this, ...c] : c
							);
							if (l) return l;
						}
						var p = n.call(this, a, ...c);
						return p;
					},
					o = function (...c) {
						return s.call(this, ...c);
					};
				return (
					e.__dynamic.define(o, 'name', {
						value: t.name,
						writable: !1
					}),
					(o.__dynamic$target = t),
					(o.toString = () =>
						`function ${t.name}() { [native code] }`),
					o
				);
			} else
				try {
					let c = class extends t {
						constructor(...l) {
							var p = [...l],
								f = i.call(t, t, ...l);
							f && (l = f), super(...l), r && r(this, p);
						}
					};
					return (
						Object.defineProperty(c, 'name', {
							value: t.name,
							writable: !1
						}),
						c
					);
				} catch {
					return t;
				}
		};
	}
	function ta(e, t = {}, i = '') {
		if (e.hasOwnProperty('__dynamic')) return !1;
		e.hasOwnProperty('__dynamic$config') || (e.__dynamic$config = t),
			e.parent?.__dynamic && (e.__dynamic$bare = e.parent.__dynamic$bare);
		let r = new Le(e.__dynamic$config);
		(e.__dynamic$baseURL =
			i ||
			e.__dynamic$url ||
			r.url.decode(location.pathname + location.search + location.hash) ||
			''),
			(e.__dynamic = r),
			(e.__dynamic.bare = new e.__dynamic.modules.bare.BareClient()),
			e.__dynamic.meta.load(new URL(e.__dynamic$baseURL)),
			Ye(e, null),
			Qe(e);
		for (var n of e.__dynamic.client.methods) {
			let a = n.name,
				s = Object.entries(e.__dynamic.client).find(o => o[0] == a);
			(a == 'mutation' && e.frameElement) ||
				(n.function == 'self' && s[1](e));
		}
		return e;
	}
	function Ye(e, t) {
		t || (t = e.__dynamic),
			(t.define = new e.Proxy(e.Object.defineProperty, {
				apply(i, r, n) {
					try {
						return Reflect.apply(i, r, n);
					} catch {
						return n[2];
					}
				}
			})),
			(t.defines = new e.Proxy(e.Object.defineProperties, {
				apply(i, r, n) {
					try {
						return Reflect.apply(i, r, n);
					} catch {
						return n[1];
					}
				}
			})),
			e.parent && (t.parent = e.parent),
			e.top && (t.top = e.top),
			e.document &&
				((t.elements = {
					attributes: [
						'src',
						'href',
						'srcset',
						'action',
						'data',
						'integrity',
						'nonce',
						'imagesrcset'
					],
					iframeSrc: Object.getOwnPropertyDescriptor(
						e.HTMLIFrameElement.prototype,
						'src'
					),
					contentWindow: Object.getOwnPropertyDescriptor(
						e.HTMLIFrameElement.prototype,
						'contentWindow'
					),
					innerHTML: Object.getOwnPropertyDescriptor(
						e.Element.prototype,
						'innerHTML'
					),
					outerHTML: Object.getOwnPropertyDescriptor(
						e.Element.prototype,
						'outerHTML'
					),
					attrValue: Object.getOwnPropertyDescriptor(
						e.Attr.prototype,
						'value'
					),
					setAttribute: e.Element.prototype.setAttribute,
					getAttribute: e.Element.prototype.getAttribute,
					removeAttribute: e.Element.prototype.removeAttribute,
					hasAttribute: e.Element.prototype.hasAttribute,
					cloneNode: e.Node.prototype.cloneNode,
					addEventListener: e.Node.prototype.addEventListener,
					config: [
						{
							elements: [
								e.HTMLScriptElement,
								e.HTMLIFrameElement,
								e.HTMLEmbedElement,
								e.HTMLInputElement,
								e.HTMLTrackElement,
								e.HTMLMediaElement,
								e.HTMLSourceElement,
								e.Image,
								e.HTMLImageElement
							],
							tags: ['src'],
							action: 'url'
						},
						{
							elements: [e.HTMLSourceElement, e.HTMLImageElement],
							tags: ['srcset'],
							action: 'srcset'
						},
						{
							elements: [
								e.HTMLAnchorElement,
								e.HTMLLinkElement,
								e.HTMLAreaElement,
								e.SVGImageElement,
								e.HTMLBaseElement
							],
							tags: ['href'],
							action: 'url'
						},
						{
							elements: [e.HTMLIFrameElement],
							tags: ['contentWindow', 'contentDocument'],
							action: 'window'
						},
						{
							elements: [e.HTMLFormElement],
							tags: ['action'],
							action: 'url'
						},
						{
							elements: [e.HTMLObjectElement],
							tags: ['data'],
							action: 'url'
						},
						{
							elements: [e.HTMLScriptElement, e.HTMLLinkElement],
							tags: ['integrity'],
							action: 'rewrite',
							new: 'nointegrity'
						},
						{
							elements: [e.HTMLScriptElement, e.HTMLLinkElement],
							tags: ['nonce'],
							action: 'rewrite',
							new: 'nononce'
						},
						{
							elements: [e.HTMLIFrameElement],
							tags: ['srcdoc'],
							action: 'html'
						},
						{
							elements: [e.HTMLElement],
							tags: ['style'],
							action: 'css'
						},
						{
							elements: [e.HTMLLinkElement],
							tags: ['imageSrcset'],
							action: 'srcset'
						}
					],
					createGetter: i => ({
						get() {
							return new URL(
								this.href || e.__dynamic$location.href
							)[i];
						},
						set(r) {}
					}),
					client: ta
				}),
				(e.__dynamic.baseURL = e.document
					? new URL(e.__dynamic.url.decode(e.document.baseURI))
					: null)),
			e.document &&
				(t.cookie = {
					str: e.__dynamic$cookie || '',
					desc: Object.getOwnPropertyDescriptor(
						e.Document.prototype,
						'cookie'
					)
				}),
			e.XMLHttpRequest &&
				(t.http = {
					XMLResponseURL: Object.getOwnPropertyDescriptor(
						e.XMLHttpRequest.prototype,
						'responseURL'
					),
					ResponseURL: Object.getOwnPropertyDescriptor(
						e.Response.prototype,
						'url'
					),
					RequestURL: Object.getOwnPropertyDescriptor(
						e.Request.prototype,
						'url'
					),
					XMLHttpRequest: e.XMLHttpRequest
				}),
			e.Storage &&
				((t.storage = {
					localStorage: e.localStorage,
					sessionStorage: e.sessionStorage,
					keys: {
						localStorage: Object.keys(e.localStorage),
						sessionStorage: Object.keys(e.sessionStorage)
					},
					methods: [
						'getItem',
						'setItem',
						'removeItem',
						'clear',
						'length',
						'keys',
						'values',
						'entries',
						'forEach',
						'hasOwnProperty',
						'toString',
						'toLocaleString',
						'valueOf',
						'isPrototypeOf',
						'propertyIsEnumerable',
						'constructor',
						'key'
					]
				}),
				(t.storage.cloned = {
					localStorage: t.util.clone(t.storage.localStorage),
					sessionStorage: t.util.clone(t.storage.sessionStorage)
				})),
			e.RTCPeerConnection &&
				(t.webrtc = { endpoints: ['stun:stun.webice.org'] }),
			e.trustedTypes &&
				(t.trustedTypes = {
					policy: e.trustedTypes.createPolicy('dynamic', {
						createHTML: i => i,
						createScript: i => i,
						createScriptURL: i => i,
						createURL: i => i
					}),
					createScript: e.TrustedTypePolicy.prototype.createScript
				}),
			e.__dynamic$config.tab &&
				(e.document &&
					e.__dynamic$config.tab.title &&
					((document.title = e.__dynamic$config.tab.title),
					t.define(e.document, 'title', {
						get() {
							return e.__dynamic$config.tab.title;
						},
						set(i) {
							return i;
						}
					})),
				e.__dynamic$config.tab.icon &&
					(e.__dynamic$icon = e.__dynamic$config.tab.icon),
				e.Navigator &&
					e.__dynamic$config.tab.ua &&
					t.define(e.navigator, 'userAgent', {
						get() {
							return e.__dynamic$config.tab.ua;
						},
						set() {}
					}));
	}
	importScripts('/dynamic/dynamic.config.js');
	(function (e) {
		let t = new Le(e.__dynamic$config);
		e.__dynamic = t;
		let i = t.url.decode(location.pathname);
		t.meta.load(new URL(i)),
			Ye(e, null),
			Qe(e),
			t.client.message(e),
			t.client.location(e, !1),
			t.client.window(e),
			t.client.get(e),
			t.client.reflect(e),
			t.client.imports(e),
			t.client.blob(e);
	})(self);
})();
/*! Bundled license information:

cookie/index.js:
  (*!
   * cookie
   * Copyright(c) 2012-2014 Roman Shtylman
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
//# sourceMappingURL=dynamic.handler.js.map
