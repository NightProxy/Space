(() => {
	// webpackBootstrap
	'use strict';
	var __webpack_modules__ = {
		'./node_modules/astravel/dist/module/astravel.js': function (
			__unused_webpack_module,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				attachComments: function () {
					return /* reexport safe */ _attachComments_js__WEBPACK_IMPORTED_MODULE_1__.attachComments;
				},
				defaultTraveler: function () {
					return /* reexport safe */ _defaultTraveler_js__WEBPACK_IMPORTED_MODULE_0__.defaultTraveler;
				},
				makeTraveler: function () {
					return makeTraveler;
				}
			});
			/* harmony import */ var _defaultTraveler_js__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! ./defaultTraveler.js */ './node_modules/astravel/dist/module/defaultTraveler.js'
				);
			/* harmony import */ var _attachComments_js__WEBPACK_IMPORTED_MODULE_1__ =
				__webpack_require__(
					/*! ./attachComments.js */ './node_modules/astravel/dist/module/attachComments.js'
				);

			function makeTraveler(properties) {
				return _defaultTraveler_js__WEBPACK_IMPORTED_MODULE_0__.defaultTraveler.makeChild(
					properties
				);
			}

			//# sourceMappingURL=astravel.js.map
		},
		'./node_modules/astravel/dist/module/attachComments.js': function (
			__unused_webpack_module,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				attachComments: function () {
					return attachComments;
				}
			});
			/* harmony import */ var _defaultTraveler_js__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! ./defaultTraveler.js */ './node_modules/astravel/dist/module/defaultTraveler.js'
				);

			function attachCommentsToNode(
				traveler,
				state,
				parent,
				children,
				findHeadingComments
			) {
				let { index } = state;
				const { comments } = state;
				let comment = comments[index];
				let boundComments, trailingComments;

				if (comment == null) {
					return;
				}

				if (children == null || children.length === 0) {
					boundComments =
						parent.comments != null ? parent.comments : [];

					while (comment != null && comment.end <= parent.end) {
						boundComments.push(comment);
						comment = comments[++index];
					}

					state.index = index;

					if (boundComments.length !== 0 && parent.comments == null) {
						parent.comments = boundComments;
					}

					return;
				}

				if (findHeadingComments) {
					boundComments =
						parent.comments != null ? parent.comments : [];
					const { start } = children[0];

					while (
						comment != null &&
						(comment.type[0] === 'B' || comment.type[0] === 'M') &&
						comment.end <= start
					) {
						boundComments.push(comment);
						comment = comments[++index];
					}

					if (boundComments.length !== 0 && parent.comments == null)
						parent.comments = boundComments;
				}

				for (
					let i = 0, { length } = children;
					comment != null && i < length;
					i++
				) {
					const child = children[i];
					boundComments = [];

					while (comment != null && comment.end <= child.start) {
						boundComments.push(comment);
						comment = comments[++index];
					}

					if (
						comment != null &&
						comment.loc != null &&
						(comment.type[0] === 'L' || comment.type[0] === 'S')
					) {
						if (comment.loc.start.line === child.loc.end.line) {
							boundComments.push(comment);
							comment = comments[++index];
						}
					}

					if (boundComments.length !== 0) {
						child.comments = boundComments;
					}

					state.index = index;
					traveler[child.type](child, state);
					index = state.index;
					comment = comments[index];
				}

				trailingComments = [];

				while (comment != null && comment.end <= parent.end) {
					trailingComments.push(comment);
					comment = comments[++index];
				}

				if (trailingComments.length !== 0) {
					parent.trailingComments = trailingComments;
				}

				state.index = index;
			}

			function Block(node, state) {
				attachCommentsToNode(this, state, node, node.body, true);
			}

			let traveler =
				_defaultTraveler_js__WEBPACK_IMPORTED_MODULE_0__.defaultTraveler.makeChild(
					{
						Program: Block,
						BlockStatement: Block,
						ClassBody: Block,

						ObjectExpression(node, state) {
							attachCommentsToNode(
								this,
								state,
								node,
								node.properties,
								true
							);
						},

						ArrayExpression(node, state) {
							attachCommentsToNode(
								this,
								state,
								node,
								node.elements,
								true
							);
						},

						SwitchStatement(node, state) {
							attachCommentsToNode(
								this,
								state,
								node,
								node.cases,
								false
							);
						},

						SwitchCase(node, state) {
							attachCommentsToNode(
								this,
								state,
								node,
								node.consequent,
								false
							);
						}
					}
				);
			function attachComments(node, comments) {
				traveler[node.type](node, {
					comments,
					index: 0
				});
				return node;
			}
			//# sourceMappingURL=attachComments.js.map
		},
		'./node_modules/astravel/dist/module/defaultTraveler.js': function (
			__unused_webpack_module,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				defaultTraveler: function () {
					return defaultTraveler;
				}
			});
			let ForInStatement,
				FunctionDeclaration,
				RestElement,
				BinaryExpression,
				ArrayExpression,
				Block,
				MethodDefinition;
			const ignore = Function.prototype;

			class Found {
				constructor(node, state) {
					this.node = node;
					this.state = state;
				}
			}

			const defaultTraveler = {
				go(node, state) {
					if (this[node.type]) {
						this[node.type](node, state);
					}
				},

				find(predicate, node, state) {
					const finder = Object.create(this);

					finder.go = function (node, state) {
						if (predicate(node, state)) {
							throw new Found(node, state);
						}

						this[node.type](node, state);
					};

					try {
						finder.go(node, state);
					} catch (error) {
						if (error instanceof Found) {
							return error;
						} else {
							throw error;
						}
					}
				},

				makeChild(properties = {}) {
					const traveler = Object.create(this);
					traveler.super = this;

					for (let key in properties) {
						traveler[key] = properties[key];
					}

					return traveler;
				},

				Program: (Block = function (node, state) {
					const { body } = node;

					if (body != null) {
						const { length } = body;

						for (let i = 0; i < length; i++) {
							this.go(body[i], state);
						}
					}
				}),
				BlockStatement: Block,
				StaticBlock: Block,
				EmptyStatement: ignore,

				ExpressionStatement(node, state) {
					this.go(node.expression, state);
				},

				IfStatement(node, state) {
					this.go(node.test, state);
					this.go(node.consequent, state);

					if (node.alternate != null) {
						this.go(node.alternate, state);
					}
				},

				LabeledStatement(node, state) {
					this.go(node.label, state);
					this.go(node.body, state);
				},

				BreakStatement(node, state) {
					if (node.label) {
						this.go(node.label, state);
					}
				},

				ContinueStatement(node, state) {
					if (node.label) {
						this.go(node.label, state);
					}
				},

				WithStatement(node, state) {
					this.go(node.object, state);
					this.go(node.body, state);
				},

				SwitchStatement(node, state) {
					this.go(node.discriminant, state);
					const { cases } = node,
						{ length } = cases;

					for (let i = 0; i < length; i++) {
						this.go(cases[i], state);
					}
				},

				SwitchCase(node, state) {
					if (node.test != null) {
						this.go(node.test, state);
					}

					const statements = node.consequent,
						{ length } = statements;

					for (let i = 0; i < length; i++) {
						this.go(statements[i], state);
					}
				},

				ReturnStatement(node, state) {
					if (node.argument) {
						this.go(node.argument, state);
					}
				},

				ThrowStatement(node, state) {
					this.go(node.argument, state);
				},

				TryStatement(node, state) {
					this.go(node.block, state);

					if (node.handler != null) {
						this.go(node.handler, state);
					}

					if (node.finalizer != null) {
						this.go(node.finalizer, state);
					}
				},

				CatchClause(node, state) {
					if (node.param != null) {
						this.go(node.param, state);
					}

					this.go(node.body, state);
				},

				WhileStatement(node, state) {
					this.go(node.test, state);
					this.go(node.body, state);
				},

				DoWhileStatement(node, state) {
					this.go(node.body, state);
					this.go(node.test, state);
				},

				ForStatement(node, state) {
					if (node.init != null) {
						this.go(node.init, state);
					}

					if (node.test != null) {
						this.go(node.test, state);
					}

					if (node.update != null) {
						this.go(node.update, state);
					}

					this.go(node.body, state);
				},

				ForInStatement: (ForInStatement = function (node, state) {
					this.go(node.left, state);
					this.go(node.right, state);
					this.go(node.body, state);
				}),
				DebuggerStatement: ignore,
				FunctionDeclaration: (FunctionDeclaration = function (
					node,
					state
				) {
					if (node.id != null) {
						this.go(node.id, state);
					}

					const { params } = node;

					if (params != null) {
						for (let i = 0, { length } = params; i < length; i++) {
							this.go(params[i], state);
						}
					}

					this.go(node.body, state);
				}),

				VariableDeclaration(node, state) {
					const { declarations } = node,
						{ length } = declarations;

					for (let i = 0; i < length; i++) {
						this.go(declarations[i], state);
					}
				},

				VariableDeclarator(node, state) {
					this.go(node.id, state);

					if (node.init != null) {
						this.go(node.init, state);
					}
				},

				ArrowFunctionExpression(node, state) {
					const { params } = node;

					if (params != null) {
						for (let i = 0, { length } = params; i < length; i++) {
							this.go(params[i], state);
						}
					}

					this.go(node.body, state);
				},

				ThisExpression: ignore,
				ArrayExpression: (ArrayExpression = function (node, state) {
					const { elements } = node,
						{ length } = elements;

					for (let i = 0; i < length; i++) {
						let element = elements[i];

						if (element != null) {
							this.go(elements[i], state);
						}
					}
				}),

				ObjectExpression(node, state) {
					const { properties } = node,
						{ length } = properties;

					for (let i = 0; i < length; i++) {
						this.go(properties[i], state);
					}
				},

				Property(node, state) {
					this.go(node.key, state);

					if (node.value != null) {
						this.go(node.value, state);
					}
				},

				FunctionExpression: FunctionDeclaration,

				SequenceExpression(node, state) {
					const { expressions } = node,
						{ length } = expressions;

					for (let i = 0; i < length; i++) {
						this.go(expressions[i], state);
					}
				},

				UnaryExpression(node, state) {
					this.go(node.argument, state);
				},

				UpdateExpression(node, state) {
					this.go(node.argument, state);
				},

				AssignmentExpression(node, state) {
					this.go(node.left, state);
					this.go(node.right, state);
				},

				BinaryExpression: (BinaryExpression = function (node, state) {
					this.go(node.left, state);
					this.go(node.right, state);
				}),
				LogicalExpression: BinaryExpression,

				ConditionalExpression(node, state) {
					this.go(node.test, state);
					this.go(node.consequent, state);
					this.go(node.alternate, state);
				},

				NewExpression(node, state) {
					this.CallExpression(node, state);
				},

				CallExpression(node, state) {
					this.go(node.callee, state);
					const args = node['arguments'],
						{ length } = args;

					for (let i = 0; i < length; i++) {
						this.go(args[i], state);
					}
				},

				MemberExpression(node, state) {
					this.go(node.object, state);
					this.go(node.property, state);
				},

				Identifier: ignore,
				PrivateIdentifier: ignore,
				Literal: ignore,
				ForOfStatement: ForInStatement,

				ClassDeclaration(node, state) {
					if (node.id) {
						this.go(node.id, state);
					}

					if (node.superClass) {
						this.go(node.superClass, state);
					}

					this.go(node.body, state);
				},

				ClassBody: Block,

				ImportDeclaration(node, state) {
					const { specifiers } = node,
						{ length } = specifiers;

					for (let i = 0; i < length; i++) {
						this.go(specifiers[i], state);
					}

					this.go(node.source, state);
				},

				ImportNamespaceSpecifier(node, state) {
					this.go(node.local, state);
				},

				ImportDefaultSpecifier(node, state) {
					this.go(node.local, state);
				},

				ImportSpecifier(node, state) {
					this.go(node.imported, state);
					this.go(node.local, state);
				},

				ExportDefaultDeclaration(node, state) {
					this.go(node.declaration, state);
				},

				ExportNamedDeclaration(node, state) {
					if (node.declaration) {
						this.go(node.declaration, state);
					}

					const { specifiers } = node,
						{ length } = specifiers;

					for (let i = 0; i < length; i++) {
						this.go(specifiers[i], state);
					}

					if (node.source) {
						this.go(node.source, state);
					}
				},

				ExportSpecifier(node, state) {
					this.go(node.local, state);
					this.go(node.exported, state);
				},

				ExportAllDeclaration(node, state) {
					this.go(node.source, state);
				},

				MethodDefinition: (MethodDefinition = function (node, state) {
					this.go(node.key, state);
					this.go(node.value, state);
				}),
				PropertyDefinition: MethodDefinition,

				ClassExpression(node, state) {
					this.ClassDeclaration(node, state);
				},

				Super: ignore,
				RestElement: (RestElement = function (node, state) {
					this.go(node.argument, state);
				}),
				SpreadElement: RestElement,

				YieldExpression(node, state) {
					if (node.argument) {
						this.go(node.argument, state);
					}
				},

				TaggedTemplateExpression(node, state) {
					this.go(node.tag, state);
					this.go(node.quasi, state);
				},

				TemplateLiteral(node, state) {
					const { quasis, expressions } = node;

					for (let i = 0, { length } = expressions; i < length; i++) {
						this.go(expressions[i], state);
					}

					for (let i = 0, { length } = quasis; i < length; i++) {
						this.go(quasis[i], state);
					}
				},

				TemplateElement: ignore,

				ObjectPattern(node, state) {
					const { properties } = node,
						{ length } = properties;

					for (let i = 0; i < length; i++) {
						this.go(properties[i], state);
					}
				},

				ArrayPattern: ArrayExpression,

				AssignmentPattern(node, state) {
					this.go(node.left, state);
					this.go(node.right, state);
				},

				MetaProperty(node, state) {
					this.go(node.meta, state);
					this.go(node.property, state);
				},

				AwaitExpression(node, state) {
					this.go(node.argument, state);
				}
			};
			//# sourceMappingURL=defaultTraveler.js.map
		},
		'./src/client/url.ts': function (
			__unused_webpack_module,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				URL: function () {
					return URL;
				}
			});
			/* harmony import */ var _shared_rewriters_url__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! ../shared/rewriters/url */ './src/shared/rewriters/url.ts'
				);

			var URL = globalThis.URL;
			if (globalThis.window) {
				window.URL = new Proxy(URL, {
					construct: function construct(target, argArray, newTarget) {
						if (typeof argArray[0] === 'string')
							argArray[0] = (0,
							_shared_rewriters_url__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(
								argArray[0]
							);
						if (typeof argArray[1] === 'string')
							argArray[1] = (0,
							_shared_rewriters_url__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(
								argArray[1]
							);
						return Reflect.construct(target, argArray, newTarget);
					}
				});
			}
		},
		'./src/shared/rewriters/css.ts': function (
			__unused_webpack_module,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				rewriteCss: function () {
					return rewriteCss;
				}
			});
			/* harmony import */ var _url__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! ./url */ './src/shared/rewriters/url.ts'
				);
			// This CSS rewriter uses code from Meteor
			// You can find the original source code at https://github.com/MeteorProxy/Meteor

			function rewriteCss(css, origin) {
				var regex =
					/(@import\s+(?!url\())?\s*url\(\s*(['"]?)([^'")]+)\2\s*\)|@import\s+(['"])([^'"]+)\4/g;
				return css.replace(
					regex,
					function (
						match,
						importStatement,
						urlQuote,
						urlContent,
						importQuote,
						importContent
					) {
						var url = urlContent || importContent;
						var encodedUrl = (0,
						_url__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(
							url.trim(),
							origin
						);
						if (importStatement) {
							return '@import url('
								.concat(urlQuote)
								.concat(encodedUrl)
								.concat(urlQuote, ')');
						}
						if (importQuote) {
							return '@import '
								.concat(importQuote)
								.concat(encodedUrl)
								.concat(importQuote);
						}
						return 'url('
							.concat(urlQuote)
							.concat(encodedUrl)
							.concat(urlQuote, ')');
					}
				);
			}
		},
		'./src/shared/rewriters/headers.ts': function (
			__unused_webpack_module,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				rewriteHeaders: function () {
					return rewriteHeaders;
				}
			});
			/* harmony import */ var _url__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! ./url */ './src/shared/rewriters/url.ts'
				);

			var cspHeaders = [
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
				'x-download-options',
				'x-frame-options',
				'x-permitted-cross-domain-policies',
				'x-powered-by',
				'x-xss-protection',
				// This needs to be emulated, but for right now it isn't that important of a feature to be worried about
				// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Clear-Site-Data
				'clear-site-data'
			];
			var urlHeaders = ['location', 'content-location', 'referer'];
			function rewriteHeaders(rawHeaders, origin) {
				var headers = {};
				for (var key in rawHeaders) {
					headers[key.toLowerCase()] = rawHeaders[key];
				}
				cspHeaders.forEach(function (header) {
					delete headers[header];
				});
				urlHeaders.forEach(function (header) {
					if (headers[header])
						headers[header] = (0,
						_url__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(
							headers[header],
							origin
						);
				});
				if (headers['link']) {
					headers['link'] = headers['link'].replace(
						/<(.*?)>/gi,
						function (match) {
							return (0,
							_url__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(
								match,
								origin
							);
						}
					);
				}
				return headers;
			}
		},
		'./src/shared/rewriters/html.ts': function (
			__unused_webpack_module,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				isScramjetFile: function () {
					return isScramjetFile;
				},
				rewriteHtml: function () {
					return rewriteHtml;
				},
				rewriteSrcset: function () {
					return rewriteSrcset;
				}
			});
			/* harmony import */ var htmlparser2__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! htmlparser2 */ './node_modules/htmlparser2/lib/esm/index.js'
				);
			/* harmony import */ var domhandler__WEBPACK_IMPORTED_MODULE_1__ =
				__webpack_require__(
					/*! domhandler */ './node_modules/domhandler/lib/esm/index.js'
				);
			/* harmony import */ var domutils__WEBPACK_IMPORTED_MODULE_2__ =
				__webpack_require__(
					/*! domutils */ './node_modules/domutils/lib/esm/index.js'
				);
			/* harmony import */ var dom_serializer__WEBPACK_IMPORTED_MODULE_3__ =
				__webpack_require__(
					/*! dom-serializer */ './node_modules/dom-serializer/lib/esm/index.js'
				);
			/* harmony import */ var _url__WEBPACK_IMPORTED_MODULE_4__ =
				__webpack_require__(
					/*! ./url */ './src/shared/rewriters/url.ts'
				);
			/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_5__ =
				__webpack_require__(
					/*! ./css */ './src/shared/rewriters/css.ts'
				);
			/* harmony import */ var _js__WEBPACK_IMPORTED_MODULE_6__ =
				__webpack_require__(/*! ./js */ './src/shared/rewriters/js.ts');
			function _array_like_to_array(arr, len) {
				if (len == null || len > arr.length) len = arr.length;
				for (var i = 0, arr2 = new Array(len); i < len; i++)
					arr2[i] = arr[i];
				return arr2;
			}
			function _array_without_holes(arr) {
				if (Array.isArray(arr)) return _array_like_to_array(arr);
			}
			function _iterable_to_array(iter) {
				if (
					(typeof Symbol !== 'undefined' &&
						iter[Symbol.iterator] != null) ||
					iter['@@iterator'] != null
				)
					return Array.from(iter);
			}
			function _non_iterable_spread() {
				throw new TypeError(
					'Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
				);
			}
			function _to_consumable_array(arr) {
				return (
					_array_without_holes(arr) ||
					_iterable_to_array(arr) ||
					_unsupported_iterable_to_array(arr) ||
					_non_iterable_spread()
				);
			}
			function _unsupported_iterable_to_array(o, minLen) {
				if (!o) return;
				if (typeof o === 'string')
					return _array_like_to_array(o, minLen);
				var n = Object.prototype.toString.call(o).slice(8, -1);
				if (n === 'Object' && o.constructor) n = o.constructor.name;
				if (n === 'Map' || n === 'Set') return Array.from(n);
				if (
					n === 'Arguments' ||
					/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
				)
					return _array_like_to_array(o, minLen);
			}

			function isScramjetFile(src) {
				var bool = false;
				['codecs', 'client', 'shared', 'worker', 'config'].forEach(
					function (file) {
						if (src === self.$scramjet.config[file]) bool = true;
					}
				);
				return bool;
			}
			function rewriteHtml(html, origin) {
				var handler =
					new domhandler__WEBPACK_IMPORTED_MODULE_1__.DomHandler(
						function (err, dom) {
							return dom;
						}
					);
				var parser =
					new htmlparser2__WEBPACK_IMPORTED_MODULE_0__.Parser(
						handler
					);
				parser.write(html);
				parser.end();
				return (0,
				dom_serializer__WEBPACK_IMPORTED_MODULE_3__['default'])(
					traverseParsedHtml(handler.root, origin)
				);
			}
			// i need to add the attributes in during rewriting
			function traverseParsedHtml(node, origin) {
				/* csp attributes */ for (
					var _i = 0, _iter = ['nonce', 'integrity', 'csp'];
					_i < _iter.length;
					_i++
				) {
					var cspAttr = _iter[_i];
					if (
						(0, domutils__WEBPACK_IMPORTED_MODULE_2__.hasAttrib)(
							node,
							cspAttr
						)
					) {
						node.attribs['data-'.concat(cspAttr)] =
							node.attribs[cspAttr];
						delete node.attribs[cspAttr];
					}
				}
				/* url attributes */ for (
					var _i1 = 0,
						_iter1 = ['src', 'href', 'action', 'formaction'];
					_i1 < _iter1.length;
					_i1++
				) {
					var urlAttr = _iter1[_i1];
					if (
						(0, domutils__WEBPACK_IMPORTED_MODULE_2__.hasAttrib)(
							node,
							urlAttr
						) &&
						!isScramjetFile(node.attribs[urlAttr])
					) {
						var value = node.attribs[urlAttr];
						node.attribs['data-'.concat(urlAttr)] = value;
						node.attribs[urlAttr] = (0,
						_url__WEBPACK_IMPORTED_MODULE_4__.encodeUrl)(
							value,
							origin
						);
					}
				}
				/* other */ for (
					var _i2 = 0, _iter2 = ['srcset', 'imagesrcset'];
					_i2 < _iter2.length;
					_i2++
				) {
					var srcsetAttr = _iter2[_i2];
					if (
						(0, domutils__WEBPACK_IMPORTED_MODULE_2__.hasAttrib)(
							node,
							srcsetAttr
						)
					) {
						var value1 = node.attribs[srcsetAttr];
						node.attribs['data-'.concat(srcsetAttr)] = value1;
						node.attribs[srcsetAttr] = rewriteSrcset(
							value1,
							origin
						);
					}
				}
				if (
					(0, domutils__WEBPACK_IMPORTED_MODULE_2__.hasAttrib)(
						node,
						'srcdoc'
					)
				)
					node.attribs.srcdoc = rewriteHtml(
						node.attribs.srcdoc,
						origin
					);
				if (
					(0, domutils__WEBPACK_IMPORTED_MODULE_2__.hasAttrib)(
						node,
						'style'
					)
				)
					node.attribs.style = (0,
					_css__WEBPACK_IMPORTED_MODULE_5__.rewriteCss)(
						node.attribs.style,
						origin
					);
				if (node.name === 'style' && node.children[0] !== undefined)
					node.children[0].data = (0,
					_css__WEBPACK_IMPORTED_MODULE_5__.rewriteCss)(
						node.children[0].data,
						origin
					);
				if (
					node.name === 'script' &&
					/(application|text)\/javascript|importmap|undefined/.test(
						node.attribs.type
					) &&
					node.children[0] !== undefined
				) {
					var js = node.children[0].data;
					var htmlcomment = /<!--[\s\S]*?-->/g;
					js = js.replace(htmlcomment, '');
					node.children[0].data = (0,
					_js__WEBPACK_IMPORTED_MODULE_6__.rewriteJs)(js, origin);
				}
				if (
					node.name === 'meta' &&
					(0, domutils__WEBPACK_IMPORTED_MODULE_2__.hasAttrib)(
						node,
						'http-equiv'
					)
				) {
					if (
						node.attribs['http-equiv'] === 'content-security-policy'
					) {
						node = {};
					} else if (
						node.attribs['http-equiv'] === 'refresh' &&
						node.attribs.content.includes('url')
					) {
						var contentArray = node.attribs.content.split('url=');
						contentArray[1] = (0,
						_url__WEBPACK_IMPORTED_MODULE_4__.encodeUrl)(
							contentArray[1].trim(),
							origin
						);
						node.attribs.content = contentArray.join('url=');
					}
				}
				if (node.name === 'head') {
					var _node_children;
					var scramjetScripts = [];
					['codecs', 'config', 'shared', 'client'].forEach(
						function (script) {
							scramjetScripts.push(
								new domhandler__WEBPACK_IMPORTED_MODULE_1__.Element(
									'script',
									{
										src: self.$scramjet.config[script],
										'data-scramjet': ''
									}
								)
							);
						}
					);
					(_node_children = node.children).unshift.apply(
						_node_children,
						_to_consumable_array(scramjetScripts)
					);
				}
				if (node.childNodes) {
					for (var childNode in node.childNodes) {
						node.childNodes[childNode] = traverseParsedHtml(
							node.childNodes[childNode],
							origin
						);
					}
				}
				return node;
			}
			function rewriteSrcset(srcset, origin) {
				var urls = srcset.split(/ [0-9]+x,? ?/g);
				if (!urls) return '';
				var sufixes = srcset.match(/ [0-9]+x,? ?/g);
				if (!sufixes) return '';
				var rewrittenUrls = urls.map(function (url, i) {
					if (url && sufixes[i]) {
						return (
							(0, _url__WEBPACK_IMPORTED_MODULE_4__.encodeUrl)(
								url,
								origin
							) + sufixes[i]
						);
					}
				});
				return rewrittenUrls.join('');
			}
		},
		'./src/shared/rewriters/js.ts': function (
			__unused_webpack_module,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				rewriteJs: function () {
					return rewriteJs;
				}
			});
			/* harmony import */ var meriyah__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! meriyah */ './node_modules/meriyah/dist/meriyah.esm.mjs'
				);
			/* harmony import */ var astring__WEBPACK_IMPORTED_MODULE_1__ =
				__webpack_require__(
					/*! astring */ './node_modules/astring/dist/astring.mjs'
				);
			/* harmony import */ var astravel__WEBPACK_IMPORTED_MODULE_2__ =
				__webpack_require__(
					/*! astravel */ './node_modules/astravel/dist/module/astravel.js'
				);
			/* harmony import */ var _url__WEBPACK_IMPORTED_MODULE_3__ =
				__webpack_require__(
					/*! ./url */ './src/shared/rewriters/url.ts'
				);

			// i am a cat. i like to be petted. i like to be fed. i like to be
			// js rewiter is NOT finished
			// location
			// window
			// self
			// globalThis
			// this
			// top
			// parent
			function rewriteJs(js, origin) {
				try {
					var ast = (0,
					meriyah__WEBPACK_IMPORTED_MODULE_0__.parseModule)(js, {
						module: true,
						webcompat: true
					});
					var identifierList = [
						'window',
						'self',
						'globalThis',
						'this',
						'parent',
						'top',
						'location'
					];
					var customTraveler = (0,
					astravel__WEBPACK_IMPORTED_MODULE_2__.makeTraveler)({
						ImportDeclaration: function (node) {
							node.source.value = (0,
							_url__WEBPACK_IMPORTED_MODULE_3__.encodeUrl)(
								node.source.value,
								origin
							);
						},
						ImportExpression: function (node) {
							if (node.source.type === 'Literal') {
								node.source.value = (0,
								_url__WEBPACK_IMPORTED_MODULE_3__.encodeUrl)(
									node.source.value,
									origin
								);
							} else if (node.source.type === 'Identifier') {
								// this is for things that import something like
								// const moduleName = "name";
								// await import(moduleName);
								node.source.name = '__wrapImport('.concat(
									node.source.name,
									')'
								);
							}
						},
						ExportAllDeclaration: function (node) {
							node.source.value = (0,
							_url__WEBPACK_IMPORTED_MODULE_3__.encodeUrl)(
								node.source.value,
								origin
							);
						},
						ExportNamedDeclaration: function (node) {
							// strings are Literals in ESTree syntax but these will always be strings
							if (node.source)
								node.source.value = (0,
								_url__WEBPACK_IMPORTED_MODULE_3__.encodeUrl)(
									node.source.value,
									origin
								);
						},
						MemberExpression: function (node) {
							if (
								node.object.type === 'Identifier' &&
								identifierList.includes(node.object.name)
							) {
								node.object.name = 'globalThis.$s('.concat(
									node.object.name,
									')'
								);
							}
						},
						AssignmentExpression: function (node) {
							if (
								node.left.type === 'Identifier' &&
								identifierList.includes(node.left.name)
							) {
								node.left.name = 'globalThis.$s('.concat(
									node.left.name,
									')'
								);
							}
							if (
								node.right.type === 'Identifier' &&
								identifierList.includes(node.right.name)
							) {
								node.right.name = 'globalThis.$s('.concat(
									node.right.name,
									')'
								);
							}
						},
						VariableDeclarator: function (node) {
							if (
								node.init &&
								node.init.type === 'Identifier' &&
								identifierList.includes(node.init.name)
							) {
								node.init.name = 'globalThis.$s('.concat(
									node.init.name,
									')'
								);
							}
						}
					});
					customTraveler.go(ast);
					return (0, astring__WEBPACK_IMPORTED_MODULE_1__.generate)(
						ast
					);
				} catch (e) {
					console.error(e);
					console.log(js);
					return js;
				}
			}
		},
		'./src/shared/rewriters/url.ts': function (
			__unused_webpack_module,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				decodeUrl: function () {
					return decodeUrl;
				},
				encodeUrl: function () {
					return encodeUrl;
				}
			});
			/* harmony import */ var _client_url__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! ../../client/url */ './src/client/url.ts'
				);
			/* harmony import */ var _js__WEBPACK_IMPORTED_MODULE_1__ =
				__webpack_require__(/*! ./js */ './src/shared/rewriters/js.ts');
			function _instanceof(left, right) {
				if (
					right != null &&
					typeof Symbol !== 'undefined' &&
					right[Symbol.hasInstance]
				) {
					return !!right[Symbol.hasInstance](left);
				} else {
					return left instanceof right;
				}
			}

			function canParseUrl(url, origin) {
				try {
					new _client_url__WEBPACK_IMPORTED_MODULE_0__.URL(
						url,
						origin
					);
					return true;
				} catch (e) {
					return false;
				}
			}
			// something is broken with this but i didn't debug it
			function encodeUrl(url, origin) {
				if (
					_instanceof(
						url,
						_client_url__WEBPACK_IMPORTED_MODULE_0__.URL
					)
				) {
					return url.toString();
				}
				if (!origin) {
					origin = new _client_url__WEBPACK_IMPORTED_MODULE_0__.URL(
						self.$scramjet.config.codec.decode(
							location.href.slice(
								(location.origin + self.$scramjet.config.prefix)
									.length
							)
						)
					);
				}
				// is this the correct behavior?
				if (!url) url = origin.href;
				if (url.startsWith('javascript:')) {
					return (
						'javascript:' +
						(0, _js__WEBPACK_IMPORTED_MODULE_1__.rewriteJs)(
							url.slice('javascript:'.length)
						)
					);
				} else if (/^(#|mailto|about|data)/.test(url)) {
					return url;
				} else if (canParseUrl(url, origin)) {
					return (
						location.origin +
						self.$scramjet.config.prefix +
						self.$scramjet.config.codec.encode(
							new _client_url__WEBPACK_IMPORTED_MODULE_0__.URL(
								url,
								origin
							).href
						)
					);
				}
			}
			// something is also broken with this but i didn't debug it
			function decodeUrl(url) {
				if (
					_instanceof(
						url,
						_client_url__WEBPACK_IMPORTED_MODULE_0__.URL
					)
				) {
					return url.toString();
				}
				if (/^(#|about|data|mailto|javascript)/.test(url)) {
					return url;
				} else if (canParseUrl(url)) {
					return self.$scramjet.config.codec.decode(
						url.slice(
							(location.origin + self.$scramjet.config.prefix)
								.length
						)
					);
				} else {
					return url;
				}
			}
		},
		'./src/shared/rewriters/worker.ts': function (
			__unused_webpack_module,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				rewriteWorkers: function () {
					return rewriteWorkers;
				}
			});
			/* harmony import */ var _js__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(/*! ./js */ './src/shared/rewriters/js.ts');

			function rewriteWorkers(js, origin) {
				var str = new String()
					.toString() //@ts-expect-error
					[('codecs', 'client')].forEach(function (script) {
						str += 'import "'.concat(
							self.$scramjet.config[script],
							'"\n'
						);
					});
				str += (0, _js__WEBPACK_IMPORTED_MODULE_0__.rewriteJs)(
					js,
					origin
				);
				return str;
			}
		},
		'./node_modules/@mercuryworkshop/bare-mux/dist/index.mjs': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				BareClient: function () {
					return BareClient;
				},
				BareMuxConnection: function () {
					return BareMuxConnection;
				},
				WebSocketFields: function () {
					return WebSocketFields;
				},
				WorkerConnection: function () {
					return WorkerConnection;
				},
				browserSupportsTransferringStreams: function () {
					return browserSupportsTransferringStreams;
				},
				default: function () {
					return BareClient;
				},
				maxRedirects: function () {
					return maxRedirects;
				},
				validProtocol: function () {
					return validProtocol;
				}
			});
			const maxRedirects = 20;

			// The user likely has overwritten all networking functions after importing bare-client
			// It is our responsibility to make sure components of Bare-Client are using native networking functions
			const fetch = globalThis.fetch;
			const WebSocket = globalThis.WebSocket;
			const Request = globalThis.Request;
			const Response = globalThis.Response;
			const SharedWorker = globalThis.SharedWorker;
			const localStorage = globalThis.localStorage;
			const serviceWorker = globalThis.navigator.serviceWorker;
			const WebSocketFields = {
				prototype: {
					send: WebSocket.prototype.send
				},
				CLOSED: WebSocket.CLOSED,
				CLOSING: WebSocket.CLOSING,
				CONNECTING: WebSocket.CONNECTING,
				OPEN: WebSocket.OPEN
			};

			async function searchForPort() {
				// @ts-expect-error
				const clients = await self.clients.matchAll({
					type: 'window',
					includeUncontrolled: true
				});
				const promises = clients.map(async x => {
					const port = await tryGetPort(x);
					await testPort(port);
					return port;
				});
				const promise = Promise.race([
					Promise.any(promises),
					new Promise((_, reject) =>
						setTimeout(reject, 1000, new TypeError('timeout'))
					)
				]);
				try {
					return await promise;
				} catch (err) {
					if (err instanceof AggregateError) {
						console.error(
							'bare-mux: failed to get a bare-mux SharedWorker MessagePort as all clients returned an invalid MessagePort.'
						);
						throw new Error(
							'All clients returned an invalid MessagePort.'
						);
					}
					console.warn(
						'bare-mux: failed to get a bare-mux SharedWorker MessagePort within 1s, retrying'
					);
					return await searchForPort();
				}
			}
			function tryGetPort(client) {
				let channel = new MessageChannel();
				return new Promise(resolve => {
					client.postMessage(
						{ type: 'getPort', port: channel.port2 },
						[channel.port2]
					);
					channel.port1.onmessage = event => {
						resolve(event.data);
					};
				});
			}
			function testPort(port) {
				const pingChannel = new MessageChannel();
				const pingPromise = new Promise((resolve, reject) => {
					pingChannel.port1.onmessage = event => {
						if (event.data.type === 'pong') {
							resolve();
						}
					};
					setTimeout(reject, 1500);
				});
				port.postMessage(
					{ message: { type: 'ping' }, port: pingChannel.port2 },
					[pingChannel.port2]
				);
				return pingPromise;
			}
			function createPort(path, registerHandlers) {
				const worker = new SharedWorker(path, 'bare-mux-worker');
				if (registerHandlers) {
					// @ts-expect-error we are using snapshot.ts
					serviceWorker.addEventListener('message', event => {
						if (event.data.type === 'getPort' && event.data.port) {
							console.debug(
								'bare-mux: recieved request for port from sw'
							);
							const newWorker = new SharedWorker(
								path,
								'bare-mux-worker'
							);
							event.data.port.postMessage(newWorker.port, [
								newWorker.port
							]);
						}
					});
				}
				return worker.port;
			}
			let browserSupportsTransferringStreamsCache = null;
			function browserSupportsTransferringStreams() {
				if (browserSupportsTransferringStreamsCache === null) {
					const chan = new MessageChannel();
					const stream = new ReadableStream();
					let res;
					try {
						chan.port1.postMessage(stream, [stream]);
						res = true;
					} catch (err) {
						res = false;
					}
					browserSupportsTransferringStreamsCache = res;
					return res;
				} else {
					return browserSupportsTransferringStreamsCache;
				}
			}
			class WorkerConnection {
				constructor(worker) {
					this.channel = new BroadcastChannel('bare-mux');
					if (worker instanceof MessagePort) {
						this.port = worker;
					} else {
						this.createChannel(worker, true);
					}
				}
				createChannel(workerPath, inInit) {
					// @ts-expect-error
					if (self.clients) {
						// running in a ServiceWorker
						// ask a window for the worker port, register for refreshPort
						this.port = searchForPort();
						this.channel.onmessage = event => {
							if (event.data.type === 'refreshPort') {
								this.port = searchForPort();
							}
						};
					} else if (workerPath && SharedWorker) {
						// running in a window, was passed a workerPath
						// create the SharedWorker and help other bare-mux clients get the workerPath
						if (
							!workerPath.startsWith('/') &&
							!workerPath.includes('://')
						)
							throw new Error(
								'Invalid URL. Must be absolute or start at the root.'
							);
						this.port = createPort(workerPath, inInit);
						console.debug(
							'bare-mux: setting localStorage bare-mux-path to',
							workerPath
						);
						localStorage['bare-mux-path'] = workerPath;
					} else if (SharedWorker) {
						// running in a window, was not passed a workerPath
						// use sessionStorage for the workerPath
						const path = localStorage['bare-mux-path'];
						console.debug(
							'bare-mux: got localStorage bare-mux-path:',
							path
						);
						if (!path)
							throw new Error(
								'Unable to get bare-mux workerPath from localStorage.'
							);
						this.port = createPort(path, inInit);
					} else {
						// SharedWorker does not exist
						throw new Error(
							'Unable to get a channel to the SharedWorker.'
						);
					}
				}
				async sendMessage(message, transferable) {
					if (this.port instanceof Promise)
						this.port = await this.port;
					try {
						await testPort(this.port);
					} catch {
						console.warn(
							'bare-mux: Failed to get a ping response from the worker within 1.5s. Assuming port is dead.'
						);
						this.createChannel();
						return await this.sendMessage(message, transferable);
					}
					const channel = new MessageChannel();
					const toTransfer = [channel.port2, ...(transferable || [])];
					const promise = new Promise((resolve, reject) => {
						channel.port1.onmessage = event => {
							const message = event.data;
							if (message.type === 'error') {
								reject(message.error);
							} else {
								resolve(message);
							}
						};
					});
					this.port.postMessage(
						{ message: message, port: channel.port2 },
						toTransfer
					);
					return await promise;
				}
			}

			const validChars =
				"!#$%&'*+-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ^_`abcdefghijklmnopqrstuvwxyz|~";
			function validProtocol(protocol) {
				for (let i = 0; i < protocol.length; i++) {
					const char = protocol[i];
					if (!validChars.includes(char)) {
						return false;
					}
				}
				return true;
			}
			const wsProtocols = ['ws:', 'wss:'];
			const statusEmpty = [101, 204, 205, 304];
			const statusRedirect = [301, 302, 303, 307, 308];
			class BareMuxConnection {
				constructor(workerPath) {
					this.worker = new WorkerConnection(workerPath);
				}
				async getTransport() {
					return (await this.worker.sendMessage({ type: 'get' }))
						.name;
				}
				async setTransport(path, options) {
					await this.setManualTransport(`
			const { default: BareTransport } = await import("${path}");
			return [new BareTransport(${options.map(x => JSON.stringify(x)).join(', ')}), "${path}"];
		`);
				}
				async setManualTransport(functionBody) {
					await this.worker.sendMessage({
						type: 'set',
						client: functionBody
					});
				}
				getInnerPort() {
					return this.worker.port;
				}
			}
			class BareClient {
				/**
				 * Create a BareClient. Calls to fetch and connect will wait for an implementation to be ready.
				 */
				constructor(worker) {
					this.worker = new WorkerConnection(worker);
				}
				createWebSocket(
					remote,
					protocols = [],
					webSocketImpl,
					requestHeaders,
					arrayBufferImpl
				) {
					try {
						remote = new URL(remote);
					} catch (err) {
						throw new DOMException(
							`Faiiled to construct 'WebSocket': The URL '${remote}' is invalid.`
						);
					}
					if (!wsProtocols.includes(remote.protocol))
						throw new DOMException(
							`Failed to construct 'WebSocket': The URL's scheme must be either 'ws' or 'wss'. '${remote.protocol}' is not allowed.`
						);
					if (!Array.isArray(protocols)) protocols = [protocols];
					protocols = protocols.map(String);
					for (const proto of protocols)
						if (!validProtocol(proto))
							throw new DOMException(
								`Failed to construct 'WebSocket': The subprotocol '${proto}' is invalid.`
							);
					let wsImpl = webSocketImpl || WebSocket;
					const socket = new wsImpl('ws://127.0.0.1:1', protocols);
					let fakeProtocol = '';
					let fakeReadyState = WebSocketFields.CONNECTING;
					let initialErrorHappened = false;
					socket.addEventListener('error', e => {
						if (!initialErrorHappened) {
							fakeReadyState = WebSocket.CONNECTING;
							e.stopImmediatePropagation();
							initialErrorHappened = true;
						}
					});
					let initialCloseHappened = false;
					socket.addEventListener('close', e => {
						if (!initialCloseHappened) {
							e.stopImmediatePropagation();
							initialCloseHappened = true;
						}
					});
					// TODO socket onerror will be broken
					arrayBufferImpl =
						arrayBufferImpl ||
						wsImpl.constructor.constructor('return ArrayBuffer')()
							.prototype;
					requestHeaders = requestHeaders || {};
					requestHeaders['Host'] = new URL(remote).host;
					// requestHeaders['Origin'] = origin;
					requestHeaders['Pragma'] = 'no-cache';
					requestHeaders['Cache-Control'] = 'no-cache';
					requestHeaders['Upgrade'] = 'websocket';
					// requestHeaders['User-Agent'] = navigator.userAgent;
					requestHeaders['Connection'] = 'Upgrade';
					const onopen = protocol => {
						fakeReadyState = WebSocketFields.OPEN;
						fakeProtocol = protocol;
						socket.meta = {
							headers: {
								'sec-websocket-protocol': protocol
							}
						}; // what the fuck is a meta
						socket.dispatchEvent(new Event('open'));
					};
					const onmessage = async payload => {
						if (typeof payload === 'string') {
							socket.dispatchEvent(
								new MessageEvent('message', { data: payload })
							);
						} else if ('byteLength' in payload) {
							if (socket.binaryType === 'blob') {
								payload = new Blob([payload]);
							} else {
								Object.setPrototypeOf(payload, arrayBufferImpl);
							}
							socket.dispatchEvent(
								new MessageEvent('message', { data: payload })
							);
						} else if ('arrayBuffer' in payload) {
							if (socket.binaryType === 'arraybuffer') {
								payload = await payload.arrayBuffer();
								Object.setPrototypeOf(payload, arrayBufferImpl);
							}
							socket.dispatchEvent(
								new MessageEvent('message', { data: payload })
							);
						}
					};
					const onclose = (code, reason) => {
						fakeReadyState = WebSocketFields.CLOSED;
						socket.dispatchEvent(
							new CloseEvent('close', { code, reason })
						);
					};
					const onerror = () => {
						fakeReadyState = WebSocketFields.CLOSED;
						socket.dispatchEvent(new Event('error'));
					};
					const channel = new MessageChannel();
					channel.port1.onmessage = event => {
						if (event.data.type === 'open') {
							onopen(event.data.args[0]);
						} else if (event.data.type === 'message') {
							onmessage(event.data.args[0]);
						} else if (event.data.type === 'close') {
							onclose(event.data.args[0], event.data.args[1]);
						} else if (event.data.type === 'error') {
							onerror(/* event.data.args[0] */);
						}
					};
					this.worker.sendMessage(
						{
							type: 'websocket',
							websocket: {
								url: remote.toString(),
								origin: origin,
								protocols: protocols,
								requestHeaders: requestHeaders,
								channel: channel.port2
							}
						},
						[channel.port2]
					);
					// protocol is always an empty before connecting
					// updated when we receive the metadata
					// this value doesn't change when it's CLOSING or CLOSED etc
					const getReadyState = () => fakeReadyState;
					// we have to hook .readyState ourselves
					Object.defineProperty(socket, 'readyState', {
						get: getReadyState,
						configurable: true,
						enumerable: true
					});
					/**
					 * @returns The error that should be thrown if send() were to be called on this socket according to the fake readyState value
					 */
					const getSendError = () => {
						const readyState = getReadyState();
						if (readyState === WebSocketFields.CONNECTING)
							return new DOMException(
								"Failed to execute 'send' on 'WebSocket': Still in CONNECTING state."
							);
					};
					// we have to hook .send ourselves
					// use ...args to avoid giving the number of args a quantity
					// no arguments will trip the following error: TypeError: Failed to execute 'send' on 'WebSocket': 1 argument required, but only 0 present.
					socket.send = function (...args) {
						const error = getSendError();
						if (error) throw error;
						let data = args[0];
						// @ts-expect-error idk why it errors?
						if (data.buffer) data = data.buffer;
						channel.port1.postMessage(
							{ type: 'data', data: data },
							data instanceof ArrayBuffer ? [data] : []
						);
					};
					socket.close = function (code, reason) {
						channel.port1.postMessage({
							type: 'close',
							closeCode: code,
							closeReason: reason
						});
					};
					Object.defineProperty(socket, 'url', {
						get: () => remote.toString(),
						configurable: true,
						enumerable: true
					});
					const getProtocol = () => fakeProtocol;
					Object.defineProperty(socket, 'protocol', {
						get: getProtocol,
						configurable: true,
						enumerable: true
					});
					return socket;
				}
				async fetch(url, init) {
					// Only create an instance of Request to parse certain parameters of init such as method, headers, redirect
					// But use init values whenever possible
					const req = new Request(url, init);
					// try to use init.headers because it may contain capitalized headers
					// furthermore, important headers on the Request class are blocked...
					// we should try to preserve the capitalization due to quirks with earlier servers
					const inputHeaders = init?.headers || req.headers;
					const headers =
						inputHeaders instanceof Headers
							? Object.fromEntries(inputHeaders)
							: inputHeaders;
					const body = req.body;
					let urlO = new URL(req.url);
					if (urlO.protocol.startsWith('blob:')) {
						const response = await fetch(urlO);
						const result = new Response(response.body, response);
						result.rawHeaders = Object.fromEntries(
							response.headers
						);
						result.rawResponse = response;
						return result;
					}
					for (let i = 0; ; i++) {
						if ('host' in headers) headers.host = urlO.host;
						else headers.Host = urlO.host;
						let resp = (
							await this.worker.sendMessage(
								{
									type: 'fetch',
									fetch: {
										remote: urlO.toString(),
										method: req.method,
										headers: headers,
										body: body || undefined
									}
								},
								body ? [body] : []
							)
						).fetch;
						let responseobj = new Response(
							statusEmpty.includes(resp.status)
								? undefined
								: resp.body,
							{
								headers: new Headers(resp.headers),
								status: resp.status,
								statusText: resp.statusText
							}
						);
						responseobj.rawHeaders = resp.headers;
						responseobj.rawResponse = new Response(resp.body);
						responseobj.finalURL = urlO.toString();
						const redirect = init?.redirect || req.redirect;
						if (statusRedirect.includes(responseobj.status)) {
							switch (redirect) {
								case 'follow': {
									const location =
										responseobj.headers.get('location');
									if (maxRedirects > i && location !== null) {
										urlO = new URL(location, urlO);
										continue;
									} else
										throw new TypeError('Failed to fetch');
								}
								case 'error':
									throw new TypeError('Failed to fetch');
								case 'manual':
									return responseobj;
							}
						} else {
							return responseobj;
						}
					}
				}
			}

			//# sourceMappingURL=index.mjs.map
		},
		'./node_modules/astring/dist/astring.mjs': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				EXPRESSIONS_PRECEDENCE: function () {
					return EXPRESSIONS_PRECEDENCE;
				},
				GENERATOR: function () {
					return GENERATOR;
				},
				NEEDS_PARENTHESES: function () {
					return NEEDS_PARENTHESES;
				},
				baseGenerator: function () {
					return baseGenerator;
				},
				generate: function () {
					return generate;
				}
			});
			// Astring is a tiny and fast JavaScript code generator from an ESTree-compliant AST.
			//
			// Astring was written by David Bonnet and released under an MIT license.
			//
			// The Git repository for Astring is available at:
			// https://github.com/davidbonnet/astring.git
			//
			// Please use the GitHub bug tracker to report issues:
			// https://github.com/davidbonnet/astring/issues

			const { stringify } = JSON;

			/* c8 ignore if */
			if (!String.prototype.repeat) {
				/* c8 ignore next */
				throw new Error(
					'String.prototype.repeat is undefined, see https://github.com/davidbonnet/astring#installation'
				);
			}

			/* c8 ignore if */
			if (!String.prototype.endsWith) {
				/* c8 ignore next */
				throw new Error(
					'String.prototype.endsWith is undefined, see https://github.com/davidbonnet/astring#installation'
				);
			}

			const OPERATOR_PRECEDENCE = {
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
			};

			// Enables parenthesis regardless of precedence
			const NEEDS_PARENTHESES = 17;

			const EXPRESSIONS_PRECEDENCE = {
				// Definitions
				ArrayExpression: 20,
				TaggedTemplateExpression: 20,
				ThisExpression: 20,
				Identifier: 20,
				PrivateIdentifier: 20,
				Literal: 18,
				TemplateLiteral: 20,
				Super: 20,
				SequenceExpression: 20,
				// Operations
				MemberExpression: 19,
				ChainExpression: 19,
				CallExpression: 19,
				NewExpression: 19,
				// Other definitions
				ArrowFunctionExpression: NEEDS_PARENTHESES,
				ClassExpression: NEEDS_PARENTHESES,
				FunctionExpression: NEEDS_PARENTHESES,
				ObjectExpression: NEEDS_PARENTHESES,
				// Other operations
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

			function formatSequence(state, nodes) {
				/*
  Writes into `state` a sequence of `nodes`.
  */
				const { generator } = state;
				state.write('(');
				if (nodes != null && nodes.length > 0) {
					generator[nodes[0].type](nodes[0], state);
					const { length } = nodes;
					for (let i = 1; i < length; i++) {
						const param = nodes[i];
						state.write(', ');
						generator[param.type](param, state);
					}
				}
				state.write(')');
			}

			function expressionNeedsParenthesis(
				state,
				node,
				parentNode,
				isRightHand
			) {
				const nodePrecedence = state.expressionsPrecedence[node.type];
				if (nodePrecedence === NEEDS_PARENTHESES) {
					return true;
				}
				const parentNodePrecedence =
					state.expressionsPrecedence[parentNode.type];
				if (nodePrecedence !== parentNodePrecedence) {
					// Different node types
					return (
						(!isRightHand &&
							nodePrecedence === 15 &&
							parentNodePrecedence === 14 &&
							parentNode.operator === '**') ||
						nodePrecedence < parentNodePrecedence
					);
				}
				if (nodePrecedence !== 13 && nodePrecedence !== 14) {
					// Not a `LogicalExpression` or `BinaryExpression`
					return false;
				}
				if (node.operator === '**' && parentNode.operator === '**') {
					// Exponentiation operator has right-to-left associativity
					return !isRightHand;
				}
				if (
					nodePrecedence === 13 &&
					parentNodePrecedence === 13 &&
					(node.operator === '??' || parentNode.operator === '??')
				) {
					// Nullish coalescing and boolean operators cannot be combined
					return true;
				}
				if (isRightHand) {
					// Parenthesis are used if both operators have the same precedence
					return (
						OPERATOR_PRECEDENCE[node.operator] <=
						OPERATOR_PRECEDENCE[parentNode.operator]
					);
				}
				return (
					OPERATOR_PRECEDENCE[node.operator] <
					OPERATOR_PRECEDENCE[parentNode.operator]
				);
			}

			function formatExpression(state, node, parentNode, isRightHand) {
				/*
  Writes into `state` the provided `node`, adding parenthesis around if the provided `parentNode` needs it. If `node` is a right-hand argument, the provided `isRightHand` parameter should be `true`.
  */
				const { generator } = state;
				if (
					expressionNeedsParenthesis(
						state,
						node,
						parentNode,
						isRightHand
					)
				) {
					state.write('(');
					generator[node.type](node, state);
					state.write(')');
				} else {
					generator[node.type](node, state);
				}
			}

			function reindent(state, text, indent, lineEnd) {
				/*
  Writes into `state` the `text` string reindented with the provided `indent`.
  */
				const lines = text.split('\n');
				const end = lines.length - 1;
				state.write(lines[0].trim());
				if (end > 0) {
					state.write(lineEnd);
					for (let i = 1; i < end; i++) {
						state.write(indent + lines[i].trim() + lineEnd);
					}
					state.write(indent + lines[end].trim());
				}
			}

			function formatComments(state, comments, indent, lineEnd) {
				/*
  Writes into `state` the provided list of `comments`, with the given `indent` and `lineEnd` strings.
  Line comments will end with `"\n"` regardless of the value of `lineEnd`.
  Expects to start on a new unindented line.
  */
				const { length } = comments;
				for (let i = 0; i < length; i++) {
					const comment = comments[i];
					state.write(indent);
					if (comment.type[0] === 'L') {
						// Line comment
						state.write(
							'// ' + comment.value.trim() + '\n',
							comment
						);
					} else {
						// Block comment
						state.write('/*');
						reindent(state, comment.value, indent, lineEnd);
						state.write('*/' + lineEnd);
					}
				}
			}

			function hasCallExpression(node) {
				/*
  Returns `true` if the provided `node` contains a call expression and `false` otherwise.
  */
				let currentNode = node;
				while (currentNode != null) {
					const { type } = currentNode;
					if (type[0] === 'C' && type[1] === 'a') {
						// Is CallExpression
						return true;
					} else if (
						type[0] === 'M' &&
						type[1] === 'e' &&
						type[2] === 'm'
					) {
						// Is MemberExpression
						currentNode = currentNode.object;
					} else {
						return false;
					}
				}
			}

			function formatVariableDeclaration(state, node) {
				/*
  Writes into `state` a variable declaration.
  */
				const { generator } = state;
				const { declarations } = node;
				state.write(node.kind + ' ');
				const { length } = declarations;
				if (length > 0) {
					generator.VariableDeclarator(declarations[0], state);
					for (let i = 1; i < length; i++) {
						state.write(', ');
						generator.VariableDeclarator(declarations[i], state);
					}
				}
			}

			let ForInStatement,
				FunctionDeclaration,
				RestElement,
				BinaryExpression,
				ArrayExpression,
				BlockStatement;

			const GENERATOR = {
				/*
  Default generator.
  */
				Program(node, state) {
					const indent = state.indent.repeat(state.indentLevel);
					const { lineEnd, writeComments } = state;
					if (writeComments && node.comments != null) {
						formatComments(state, node.comments, indent, lineEnd);
					}
					const statements = node.body;
					const { length } = statements;
					for (let i = 0; i < length; i++) {
						const statement = statements[i];
						if (writeComments && statement.comments != null) {
							formatComments(
								state,
								statement.comments,
								indent,
								lineEnd
							);
						}
						state.write(indent);
						this[statement.type](statement, state);
						state.write(lineEnd);
					}
					if (writeComments && node.trailingComments != null) {
						formatComments(
							state,
							node.trailingComments,
							indent,
							lineEnd
						);
					}
				},
				BlockStatement: (BlockStatement = function (node, state) {
					const indent = state.indent.repeat(state.indentLevel++);
					const { lineEnd, writeComments } = state;
					const statementIndent = indent + state.indent;
					state.write('{');
					const statements = node.body;
					if (statements != null && statements.length > 0) {
						state.write(lineEnd);
						if (writeComments && node.comments != null) {
							formatComments(
								state,
								node.comments,
								statementIndent,
								lineEnd
							);
						}
						const { length } = statements;
						for (let i = 0; i < length; i++) {
							const statement = statements[i];
							if (writeComments && statement.comments != null) {
								formatComments(
									state,
									statement.comments,
									statementIndent,
									lineEnd
								);
							}
							state.write(statementIndent);
							this[statement.type](statement, state);
							state.write(lineEnd);
						}
						state.write(indent);
					} else {
						if (writeComments && node.comments != null) {
							state.write(lineEnd);
							formatComments(
								state,
								node.comments,
								statementIndent,
								lineEnd
							);
							state.write(indent);
						}
					}
					if (writeComments && node.trailingComments != null) {
						formatComments(
							state,
							node.trailingComments,
							statementIndent,
							lineEnd
						);
					}
					state.write('}');
					state.indentLevel--;
				}),
				ClassBody: BlockStatement,
				StaticBlock(node, state) {
					state.write('static ');
					this.BlockStatement(node, state);
				},
				EmptyStatement(node, state) {
					state.write(';');
				},
				ExpressionStatement(node, state) {
					const precedence =
						state.expressionsPrecedence[node.expression.type];
					if (
						precedence === NEEDS_PARENTHESES ||
						(precedence === 3 &&
							node.expression.left.type[0] === 'O')
					) {
						// Should always have parentheses or is an AssignmentExpression to an ObjectPattern
						state.write('(');
						this[node.expression.type](node.expression, state);
						state.write(')');
					} else {
						this[node.expression.type](node.expression, state);
					}
					state.write(';');
				},
				IfStatement(node, state) {
					state.write('if (');
					this[node.test.type](node.test, state);
					state.write(') ');
					this[node.consequent.type](node.consequent, state);
					if (node.alternate != null) {
						state.write(' else ');
						this[node.alternate.type](node.alternate, state);
					}
				},
				LabeledStatement(node, state) {
					this[node.label.type](node.label, state);
					state.write(': ');
					this[node.body.type](node.body, state);
				},
				BreakStatement(node, state) {
					state.write('break');
					if (node.label != null) {
						state.write(' ');
						this[node.label.type](node.label, state);
					}
					state.write(';');
				},
				ContinueStatement(node, state) {
					state.write('continue');
					if (node.label != null) {
						state.write(' ');
						this[node.label.type](node.label, state);
					}
					state.write(';');
				},
				WithStatement(node, state) {
					state.write('with (');
					this[node.object.type](node.object, state);
					state.write(') ');
					this[node.body.type](node.body, state);
				},
				SwitchStatement(node, state) {
					const indent = state.indent.repeat(state.indentLevel++);
					const { lineEnd, writeComments } = state;
					state.indentLevel++;
					const caseIndent = indent + state.indent;
					const statementIndent = caseIndent + state.indent;
					state.write('switch (');
					this[node.discriminant.type](node.discriminant, state);
					state.write(') {' + lineEnd);
					const { cases: occurences } = node;
					const { length: occurencesCount } = occurences;
					for (let i = 0; i < occurencesCount; i++) {
						const occurence = occurences[i];
						if (writeComments && occurence.comments != null) {
							formatComments(
								state,
								occurence.comments,
								caseIndent,
								lineEnd
							);
						}
						if (occurence.test) {
							state.write(caseIndent + 'case ');
							this[occurence.test.type](occurence.test, state);
							state.write(':' + lineEnd);
						} else {
							state.write(caseIndent + 'default:' + lineEnd);
						}
						const { consequent } = occurence;
						const { length: consequentCount } = consequent;
						for (let i = 0; i < consequentCount; i++) {
							const statement = consequent[i];
							if (writeComments && statement.comments != null) {
								formatComments(
									state,
									statement.comments,
									statementIndent,
									lineEnd
								);
							}
							state.write(statementIndent);
							this[statement.type](statement, state);
							state.write(lineEnd);
						}
					}
					state.indentLevel -= 2;
					state.write(indent + '}');
				},
				ReturnStatement(node, state) {
					state.write('return');
					if (node.argument) {
						state.write(' ');
						this[node.argument.type](node.argument, state);
					}
					state.write(';');
				},
				ThrowStatement(node, state) {
					state.write('throw ');
					this[node.argument.type](node.argument, state);
					state.write(';');
				},
				TryStatement(node, state) {
					state.write('try ');
					this[node.block.type](node.block, state);
					if (node.handler) {
						const { handler } = node;
						if (handler.param == null) {
							state.write(' catch ');
						} else {
							state.write(' catch (');
							this[handler.param.type](handler.param, state);
							state.write(') ');
						}
						this[handler.body.type](handler.body, state);
					}
					if (node.finalizer) {
						state.write(' finally ');
						this[node.finalizer.type](node.finalizer, state);
					}
				},
				WhileStatement(node, state) {
					state.write('while (');
					this[node.test.type](node.test, state);
					state.write(') ');
					this[node.body.type](node.body, state);
				},
				DoWhileStatement(node, state) {
					state.write('do ');
					this[node.body.type](node.body, state);
					state.write(' while (');
					this[node.test.type](node.test, state);
					state.write(');');
				},
				ForStatement(node, state) {
					state.write('for (');
					if (node.init != null) {
						const { init } = node;
						if (init.type[0] === 'V') {
							formatVariableDeclaration(state, init);
						} else {
							this[init.type](init, state);
						}
					}
					state.write('; ');
					if (node.test) {
						this[node.test.type](node.test, state);
					}
					state.write('; ');
					if (node.update) {
						this[node.update.type](node.update, state);
					}
					state.write(') ');
					this[node.body.type](node.body, state);
				},
				ForInStatement: (ForInStatement = function (node, state) {
					state.write(`for ${node.await ? 'await ' : ''}(`);
					const { left } = node;
					if (left.type[0] === 'V') {
						formatVariableDeclaration(state, left);
					} else {
						this[left.type](left, state);
					}
					// Identifying whether node.type is `ForInStatement` or `ForOfStatement`
					state.write(node.type[3] === 'I' ? ' in ' : ' of ');
					this[node.right.type](node.right, state);
					state.write(') ');
					this[node.body.type](node.body, state);
				}),
				ForOfStatement: ForInStatement,
				DebuggerStatement(node, state) {
					state.write('debugger;', node);
				},
				FunctionDeclaration: (FunctionDeclaration = function (
					node,
					state
				) {
					state.write(
						(node.async ? 'async ' : '') +
							(node.generator ? 'function* ' : 'function ') +
							(node.id ? node.id.name : ''),
						node
					);
					formatSequence(state, node.params);
					state.write(' ');
					this[node.body.type](node.body, state);
				}),
				FunctionExpression: FunctionDeclaration,
				VariableDeclaration(node, state) {
					formatVariableDeclaration(state, node);
					state.write(';');
				},
				VariableDeclarator(node, state) {
					this[node.id.type](node.id, state);
					if (node.init != null) {
						state.write(' = ');
						this[node.init.type](node.init, state);
					}
				},
				ClassDeclaration(node, state) {
					state.write(
						'class ' + (node.id ? `${node.id.name} ` : ''),
						node
					);
					if (node.superClass) {
						state.write('extends ');
						const { superClass } = node;
						const { type } = superClass;
						const precedence = state.expressionsPrecedence[type];
						if (
							(type[0] !== 'C' ||
								type[1] !== 'l' ||
								type[5] !== 'E') &&
							(precedence === NEEDS_PARENTHESES ||
								precedence <
									state.expressionsPrecedence.ClassExpression)
						) {
							// Not a ClassExpression that needs parentheses
							state.write('(');
							this[node.superClass.type](superClass, state);
							state.write(')');
						} else {
							this[superClass.type](superClass, state);
						}
						state.write(' ');
					}
					this.ClassBody(node.body, state);
				},
				ImportDeclaration(node, state) {
					state.write('import ');
					const { specifiers } = node;
					const { length } = specifiers;
					// TODO: Once babili is fixed, put this after condition
					// https://github.com/babel/babili/issues/430
					let i = 0;
					if (length > 0) {
						for (; i < length; ) {
							if (i > 0) {
								state.write(', ');
							}
							const specifier = specifiers[i];
							const type = specifier.type[6];
							if (type === 'D') {
								// ImportDefaultSpecifier
								state.write(specifier.local.name, specifier);
								i++;
							} else if (type === 'N') {
								// ImportNamespaceSpecifier
								state.write(
									'* as ' + specifier.local.name,
									specifier
								);
								i++;
							} else {
								// ImportSpecifier
								break;
							}
						}
						if (i < length) {
							state.write('{');
							for (;;) {
								const specifier = specifiers[i];
								const { name } = specifier.imported;
								state.write(name, specifier);
								if (name !== specifier.local.name) {
									state.write(' as ' + specifier.local.name);
								}
								if (++i < length) {
									state.write(', ');
								} else {
									break;
								}
							}
							state.write('}');
						}
						state.write(' from ');
					}
					this.Literal(node.source, state);
					state.write(';');
				},
				ImportExpression(node, state) {
					state.write('import(');
					this[node.source.type](node.source, state);
					state.write(')');
				},
				ExportDefaultDeclaration(node, state) {
					state.write('export default ');
					this[node.declaration.type](node.declaration, state);
					if (
						state.expressionsPrecedence[node.declaration.type] !=
							null &&
						node.declaration.type[0] !== 'F'
					) {
						// All expression nodes except `FunctionExpression`
						state.write(';');
					}
				},
				ExportNamedDeclaration(node, state) {
					state.write('export ');
					if (node.declaration) {
						this[node.declaration.type](node.declaration, state);
					} else {
						state.write('{');
						const { specifiers } = node,
							{ length } = specifiers;
						if (length > 0) {
							for (let i = 0; ; ) {
								const specifier = specifiers[i];
								const { name } = specifier.local;
								state.write(name, specifier);
								if (name !== specifier.exported.name) {
									state.write(
										' as ' + specifier.exported.name
									);
								}
								if (++i < length) {
									state.write(', ');
								} else {
									break;
								}
							}
						}
						state.write('}');
						if (node.source) {
							state.write(' from ');
							this.Literal(node.source, state);
						}
						state.write(';');
					}
				},
				ExportAllDeclaration(node, state) {
					if (node.exported != null) {
						state.write(
							'export * as ' + node.exported.name + ' from '
						);
					} else {
						state.write('export * from ');
					}
					this.Literal(node.source, state);
					state.write(';');
				},
				MethodDefinition(node, state) {
					if (node.static) {
						state.write('static ');
					}
					const kind = node.kind[0];
					if (kind === 'g' || kind === 's') {
						// Getter or setter
						state.write(node.kind + ' ');
					}
					if (node.value.async) {
						state.write('async ');
					}
					if (node.value.generator) {
						state.write('*');
					}
					if (node.computed) {
						state.write('[');
						this[node.key.type](node.key, state);
						state.write(']');
					} else {
						this[node.key.type](node.key, state);
					}
					formatSequence(state, node.value.params);
					state.write(' ');
					this[node.value.body.type](node.value.body, state);
				},
				ClassExpression(node, state) {
					this.ClassDeclaration(node, state);
				},
				ArrowFunctionExpression(node, state) {
					state.write(node.async ? 'async ' : '', node);
					const { params } = node;
					if (params != null) {
						// Omit parenthesis if only one named parameter
						if (params.length === 1 && params[0].type[0] === 'I') {
							// If params[0].type[0] starts with 'I', it can't be `ImportDeclaration` nor `IfStatement` and thus is `Identifier`
							state.write(params[0].name, params[0]);
						} else {
							formatSequence(state, node.params);
						}
					}
					state.write(' => ');
					if (node.body.type[0] === 'O') {
						// Body is an object expression
						state.write('(');
						this.ObjectExpression(node.body, state);
						state.write(')');
					} else {
						this[node.body.type](node.body, state);
					}
				},
				ThisExpression(node, state) {
					state.write('this', node);
				},
				Super(node, state) {
					state.write('super', node);
				},
				RestElement: (RestElement = function (node, state) {
					state.write('...');
					this[node.argument.type](node.argument, state);
				}),
				SpreadElement: RestElement,
				YieldExpression(node, state) {
					state.write(node.delegate ? 'yield*' : 'yield');
					if (node.argument) {
						state.write(' ');
						this[node.argument.type](node.argument, state);
					}
				},
				AwaitExpression(node, state) {
					state.write('await ', node);
					formatExpression(state, node.argument, node);
				},
				TemplateLiteral(node, state) {
					const { quasis, expressions } = node;
					state.write('`');
					const { length } = expressions;
					for (let i = 0; i < length; i++) {
						const expression = expressions[i];
						const quasi = quasis[i];
						state.write(quasi.value.raw, quasi);
						state.write('${');
						this[expression.type](expression, state);
						state.write('}');
					}
					const quasi = quasis[quasis.length - 1];
					state.write(quasi.value.raw, quasi);
					state.write('`');
				},
				TemplateElement(node, state) {
					state.write(node.value.raw, node);
				},
				TaggedTemplateExpression(node, state) {
					formatExpression(state, node.tag, node);
					this[node.quasi.type](node.quasi, state);
				},
				ArrayExpression: (ArrayExpression = function (node, state) {
					state.write('[');
					if (node.elements.length > 0) {
						const { elements } = node,
							{ length } = elements;
						for (let i = 0; ; ) {
							const element = elements[i];
							if (element != null) {
								this[element.type](element, state);
							}
							if (++i < length) {
								state.write(', ');
							} else {
								if (element == null) {
									state.write(', ');
								}
								break;
							}
						}
					}
					state.write(']');
				}),
				ArrayPattern: ArrayExpression,
				ObjectExpression(node, state) {
					const indent = state.indent.repeat(state.indentLevel++);
					const { lineEnd, writeComments } = state;
					const propertyIndent = indent + state.indent;
					state.write('{');
					if (node.properties.length > 0) {
						state.write(lineEnd);
						if (writeComments && node.comments != null) {
							formatComments(
								state,
								node.comments,
								propertyIndent,
								lineEnd
							);
						}
						const comma = ',' + lineEnd;
						const { properties } = node,
							{ length } = properties;
						for (let i = 0; ; ) {
							const property = properties[i];
							if (writeComments && property.comments != null) {
								formatComments(
									state,
									property.comments,
									propertyIndent,
									lineEnd
								);
							}
							state.write(propertyIndent);
							this[property.type](property, state);
							if (++i < length) {
								state.write(comma);
							} else {
								break;
							}
						}
						state.write(lineEnd);
						if (writeComments && node.trailingComments != null) {
							formatComments(
								state,
								node.trailingComments,
								propertyIndent,
								lineEnd
							);
						}
						state.write(indent + '}');
					} else if (writeComments) {
						if (node.comments != null) {
							state.write(lineEnd);
							formatComments(
								state,
								node.comments,
								propertyIndent,
								lineEnd
							);
							if (node.trailingComments != null) {
								formatComments(
									state,
									node.trailingComments,
									propertyIndent,
									lineEnd
								);
							}
							state.write(indent + '}');
						} else if (node.trailingComments != null) {
							state.write(lineEnd);
							formatComments(
								state,
								node.trailingComments,
								propertyIndent,
								lineEnd
							);
							state.write(indent + '}');
						} else {
							state.write('}');
						}
					} else {
						state.write('}');
					}
					state.indentLevel--;
				},
				Property(node, state) {
					if (node.method || node.kind[0] !== 'i') {
						// Either a method or of kind `set` or `get` (not `init`)
						this.MethodDefinition(node, state);
					} else {
						if (!node.shorthand) {
							if (node.computed) {
								state.write('[');
								this[node.key.type](node.key, state);
								state.write(']');
							} else {
								this[node.key.type](node.key, state);
							}
							state.write(': ');
						}
						this[node.value.type](node.value, state);
					}
				},
				PropertyDefinition(node, state) {
					if (node.static) {
						state.write('static ');
					}
					if (node.computed) {
						state.write('[');
					}
					this[node.key.type](node.key, state);
					if (node.computed) {
						state.write(']');
					}
					if (node.value == null) {
						if (node.key.type[0] !== 'F') {
							state.write(';');
						}
						return;
					}
					state.write(' = ');
					this[node.value.type](node.value, state);
					state.write(';');
				},
				ObjectPattern(node, state) {
					state.write('{');
					if (node.properties.length > 0) {
						const { properties } = node,
							{ length } = properties;
						for (let i = 0; ; ) {
							this[properties[i].type](properties[i], state);
							if (++i < length) {
								state.write(', ');
							} else {
								break;
							}
						}
					}
					state.write('}');
				},
				SequenceExpression(node, state) {
					formatSequence(state, node.expressions);
				},
				UnaryExpression(node, state) {
					if (node.prefix) {
						const {
							operator,
							argument,
							argument: { type }
						} = node;
						state.write(operator);
						const needsParentheses = expressionNeedsParenthesis(
							state,
							argument,
							node
						);
						if (
							!needsParentheses &&
							(operator.length > 1 ||
								(type[0] === 'U' &&
									(type[1] === 'n' || type[1] === 'p') &&
									argument.prefix &&
									argument.operator[0] === operator &&
									(operator === '+' || operator === '-')))
						) {
							// Large operator or argument is UnaryExpression or UpdateExpression node
							state.write(' ');
						}
						if (needsParentheses) {
							state.write(operator.length > 1 ? ' (' : '(');
							this[type](argument, state);
							state.write(')');
						} else {
							this[type](argument, state);
						}
					} else {
						// FIXME: This case never occurs
						this[node.argument.type](node.argument, state);
						state.write(node.operator);
					}
				},
				UpdateExpression(node, state) {
					// Always applied to identifiers or members, no parenthesis check needed
					if (node.prefix) {
						state.write(node.operator);
						this[node.argument.type](node.argument, state);
					} else {
						this[node.argument.type](node.argument, state);
						state.write(node.operator);
					}
				},
				AssignmentExpression(node, state) {
					this[node.left.type](node.left, state);
					state.write(' ' + node.operator + ' ');
					this[node.right.type](node.right, state);
				},
				AssignmentPattern(node, state) {
					this[node.left.type](node.left, state);
					state.write(' = ');
					this[node.right.type](node.right, state);
				},
				BinaryExpression: (BinaryExpression = function (node, state) {
					const isIn = node.operator === 'in';
					if (isIn) {
						// Avoids confusion in `for` loops initializers
						state.write('(');
					}
					formatExpression(state, node.left, node, false);
					state.write(' ' + node.operator + ' ');
					formatExpression(state, node.right, node, true);
					if (isIn) {
						state.write(')');
					}
				}),
				LogicalExpression: BinaryExpression,
				ConditionalExpression(node, state) {
					const { test } = node;
					const precedence = state.expressionsPrecedence[test.type];
					if (
						precedence === NEEDS_PARENTHESES ||
						precedence <=
							state.expressionsPrecedence.ConditionalExpression
					) {
						state.write('(');
						this[test.type](test, state);
						state.write(')');
					} else {
						this[test.type](test, state);
					}
					state.write(' ? ');
					this[node.consequent.type](node.consequent, state);
					state.write(' : ');
					this[node.alternate.type](node.alternate, state);
				},
				NewExpression(node, state) {
					state.write('new ');
					const precedence =
						state.expressionsPrecedence[node.callee.type];
					if (
						precedence === NEEDS_PARENTHESES ||
						precedence <
							state.expressionsPrecedence.CallExpression ||
						hasCallExpression(node.callee)
					) {
						state.write('(');
						this[node.callee.type](node.callee, state);
						state.write(')');
					} else {
						this[node.callee.type](node.callee, state);
					}
					formatSequence(state, node['arguments']);
				},
				CallExpression(node, state) {
					const precedence =
						state.expressionsPrecedence[node.callee.type];
					if (
						precedence === NEEDS_PARENTHESES ||
						precedence < state.expressionsPrecedence.CallExpression
					) {
						state.write('(');
						this[node.callee.type](node.callee, state);
						state.write(')');
					} else {
						this[node.callee.type](node.callee, state);
					}
					if (node.optional) {
						state.write('?.');
					}
					formatSequence(state, node['arguments']);
				},
				ChainExpression(node, state) {
					this[node.expression.type](node.expression, state);
				},
				MemberExpression(node, state) {
					const precedence =
						state.expressionsPrecedence[node.object.type];
					if (
						precedence === NEEDS_PARENTHESES ||
						precedence <
							state.expressionsPrecedence.MemberExpression
					) {
						state.write('(');
						this[node.object.type](node.object, state);
						state.write(')');
					} else {
						this[node.object.type](node.object, state);
					}
					if (node.computed) {
						if (node.optional) {
							state.write('?.');
						}
						state.write('[');
						this[node.property.type](node.property, state);
						state.write(']');
					} else {
						if (node.optional) {
							state.write('?.');
						} else {
							state.write('.');
						}
						this[node.property.type](node.property, state);
					}
				},
				MetaProperty(node, state) {
					state.write(
						node.meta.name + '.' + node.property.name,
						node
					);
				},
				Identifier(node, state) {
					state.write(node.name, node);
				},
				PrivateIdentifier(node, state) {
					state.write(`#${node.name}`, node);
				},
				Literal(node, state) {
					if (node.raw != null) {
						// Non-standard property
						state.write(node.raw, node);
					} else if (node.regex != null) {
						this.RegExpLiteral(node, state);
					} else if (node.bigint != null) {
						state.write(node.bigint + 'n', node);
					} else {
						state.write(stringify(node.value), node);
					}
				},
				RegExpLiteral(node, state) {
					const { regex } = node;
					state.write(`/${regex.pattern}/${regex.flags}`, node);
				}
			};

			const EMPTY_OBJECT = {};

			/*
DEPRECATED: Alternate export of `GENERATOR`.
*/
			const baseGenerator = GENERATOR;

			class State {
				constructor(options) {
					const setup = options == null ? EMPTY_OBJECT : options;
					this.output = '';
					// Functional options
					if (setup.output != null) {
						this.output = setup.output;
						this.write = this.writeToStream;
					} else {
						this.output = '';
					}
					this.generator =
						setup.generator != null ? setup.generator : GENERATOR;
					this.expressionsPrecedence =
						setup.expressionsPrecedence != null
							? setup.expressionsPrecedence
							: EXPRESSIONS_PRECEDENCE;
					// Formating setup
					this.indent = setup.indent != null ? setup.indent : '  ';
					this.lineEnd = setup.lineEnd != null ? setup.lineEnd : '\n';
					this.indentLevel =
						setup.startingIndentLevel != null
							? setup.startingIndentLevel
							: 0;
					this.writeComments = setup.comments
						? setup.comments
						: false;
					// Source map
					if (setup.sourceMap != null) {
						this.write =
							setup.output == null
								? this.writeAndMap
								: this.writeToStreamAndMap;
						this.sourceMap = setup.sourceMap;
						this.line = 1;
						this.column = 0;
						this.lineEndSize = this.lineEnd.split('\n').length - 1;
						this.mapping = {
							original: null,
							// Uses the entire state to avoid generating ephemeral objects
							generated: this,
							name: undefined,
							source:
								setup.sourceMap.file || setup.sourceMap._file
						};
					}
				}

				write(code) {
					this.output += code;
				}

				writeToStream(code) {
					this.output.write(code);
				}

				writeAndMap(code, node) {
					this.output += code;
					this.map(code, node);
				}

				writeToStreamAndMap(code, node) {
					this.output.write(code);
					this.map(code, node);
				}

				map(code, node) {
					if (node != null) {
						const { type } = node;
						if (type[0] === 'L' && type[2] === 'n') {
							// LineComment
							this.column = 0;
							this.line++;
							return;
						}
						if (node.loc != null) {
							const { mapping } = this;
							mapping.original = node.loc.start;
							mapping.name = node.name;
							this.sourceMap.addMapping(mapping);
						}
						if (
							(type[0] === 'T' && type[8] === 'E') ||
							(type[0] === 'L' &&
								type[1] === 'i' &&
								typeof node.value === 'string')
						) {
							// TemplateElement or Literal string node
							const { length } = code;
							let { column, line } = this;
							for (let i = 0; i < length; i++) {
								if (code[i] === '\n') {
									column = 0;
									line++;
								} else {
									column++;
								}
							}
							this.column = column;
							this.line = line;
							return;
						}
					}
					const { length } = code;
					const { lineEnd } = this;
					if (length > 0) {
						if (
							this.lineEndSize > 0 &&
							(lineEnd.length === 1
								? code[length - 1] === lineEnd
								: code.endsWith(lineEnd))
						) {
							this.line += this.lineEndSize;
							this.column = 0;
						} else {
							this.column += length;
						}
					}
				}

				toString() {
					return this.output;
				}
			}

			function generate(node, options) {
				/*
  Returns a string representing the rendered code of the provided AST `node`.
  The `options` are:

  - `indent`: string to use for indentation (defaults to `␣␣`)
  - `lineEnd`: string to use for line endings (defaults to `\n`)
  - `startingIndentLevel`: indent level to start from (defaults to `0`)
  - `comments`: generate comments if `true` (defaults to `false`)
  - `output`: output stream to write the rendered code to (defaults to `null`)
  - `generator`: custom code generator (defaults to `GENERATOR`)
  - `expressionsPrecedence`: custom map of node types and their precedence level (defaults to `EXPRESSIONS_PRECEDENCE`)
  */
				const state = new State(options);
				// Travel through the AST node and generate the code
				state.generator[node.type](node, state);
				return state.output;
			}
		},
		'./node_modules/clone-regexp/index.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				default: function () {
					return clonedRegexp;
				}
			});
			/* harmony import */ var is_regexp__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! is-regexp */ './node_modules/is-regexp/index.js'
				);

			const flagMap = {
				global: 'g',
				ignoreCase: 'i',
				multiline: 'm',
				dotAll: 's',
				sticky: 'y',
				unicode: 'u'
			};

			function clonedRegexp(regexp, options = {}) {
				if (
					!(0, is_regexp__WEBPACK_IMPORTED_MODULE_0__['default'])(
						regexp
					)
				) {
					throw new TypeError('Expected a RegExp instance');
				}

				const flags = Object.keys(flagMap)
					.map(flag =>
						(
							typeof options[flag] === 'boolean'
								? options[flag]
								: regexp[flag]
						)
							? flagMap[flag]
							: ''
					)
					.join('');

				const clonedRegexp = new RegExp(
					options.source || regexp.source,
					flags
				);

				clonedRegexp.lastIndex =
					typeof options.lastIndex === 'number'
						? options.lastIndex
						: regexp.lastIndex;

				return clonedRegexp;
			}
		},
		'./node_modules/dom-serializer/lib/esm/foreignNames.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				attributeNames: function () {
					return attributeNames;
				},
				elementNames: function () {
					return elementNames;
				}
			});
			const elementNames = new Map(
				[
					'altGlyph',
					'altGlyphDef',
					'altGlyphItem',
					'animateColor',
					'animateMotion',
					'animateTransform',
					'clipPath',
					'feBlend',
					'feColorMatrix',
					'feComponentTransfer',
					'feComposite',
					'feConvolveMatrix',
					'feDiffuseLighting',
					'feDisplacementMap',
					'feDistantLight',
					'feDropShadow',
					'feFlood',
					'feFuncA',
					'feFuncB',
					'feFuncG',
					'feFuncR',
					'feGaussianBlur',
					'feImage',
					'feMerge',
					'feMergeNode',
					'feMorphology',
					'feOffset',
					'fePointLight',
					'feSpecularLighting',
					'feSpotLight',
					'feTile',
					'feTurbulence',
					'foreignObject',
					'glyphRef',
					'linearGradient',
					'radialGradient',
					'textPath'
				].map(val => [val.toLowerCase(), val])
			);
			const attributeNames = new Map(
				[
					'definitionURL',
					'attributeName',
					'attributeType',
					'baseFrequency',
					'baseProfile',
					'calcMode',
					'clipPathUnits',
					'diffuseConstant',
					'edgeMode',
					'filterUnits',
					'glyphRef',
					'gradientTransform',
					'gradientUnits',
					'kernelMatrix',
					'kernelUnitLength',
					'keyPoints',
					'keySplines',
					'keyTimes',
					'lengthAdjust',
					'limitingConeAngle',
					'markerHeight',
					'markerUnits',
					'markerWidth',
					'maskContentUnits',
					'maskUnits',
					'numOctaves',
					'pathLength',
					'patternContentUnits',
					'patternTransform',
					'patternUnits',
					'pointsAtX',
					'pointsAtY',
					'pointsAtZ',
					'preserveAlpha',
					'preserveAspectRatio',
					'primitiveUnits',
					'refX',
					'refY',
					'repeatCount',
					'repeatDur',
					'requiredExtensions',
					'requiredFeatures',
					'specularConstant',
					'specularExponent',
					'spreadMethod',
					'startOffset',
					'stdDeviation',
					'stitchTiles',
					'surfaceScale',
					'systemLanguage',
					'tableValues',
					'targetX',
					'targetY',
					'textLength',
					'viewBox',
					'viewTarget',
					'xChannelSelector',
					'yChannelSelector',
					'zoomAndPan'
				].map(val => [val.toLowerCase(), val])
			);
		},
		'./node_modules/dom-serializer/lib/esm/index.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				render: function () {
					return render;
				}
			});
			/* harmony import */ var domelementtype__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! domelementtype */ './node_modules/domelementtype/lib/esm/index.js'
				);
			/* harmony import */ var entities__WEBPACK_IMPORTED_MODULE_1__ =
				__webpack_require__(
					/*! entities */ './node_modules/entities/lib/esm/index.js'
				);
			/* harmony import */ var _foreignNames_js__WEBPACK_IMPORTED_MODULE_2__ =
				__webpack_require__(
					/*! ./foreignNames.js */ './node_modules/dom-serializer/lib/esm/foreignNames.js'
				);
			/*
			 * Module dependencies
			 */

			/**
			 * Mixed-case SVG and MathML tags & attributes
			 * recognized by the HTML parser.
			 *
			 * @see https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inforeign
			 */

			const unencodedElements = new Set([
				'style',
				'script',
				'xmp',
				'iframe',
				'noembed',
				'noframes',
				'plaintext',
				'noscript'
			]);
			function replaceQuotes(value) {
				return value.replace(/"/g, '&quot;');
			}
			/**
			 * Format attributes
			 */
			function formatAttributes(attributes, opts) {
				var _a;
				if (!attributes) return;
				const encode =
					((_a = opts.encodeEntities) !== null && _a !== void 0
						? _a
						: opts.decodeEntities) === false
						? replaceQuotes
						: opts.xmlMode || opts.encodeEntities !== 'utf8'
							? entities__WEBPACK_IMPORTED_MODULE_1__.encodeXML
							: entities__WEBPACK_IMPORTED_MODULE_1__.escapeAttribute;
				return Object.keys(attributes)
					.map(key => {
						var _a, _b;
						const value =
							(_a = attributes[key]) !== null && _a !== void 0
								? _a
								: '';
						if (opts.xmlMode === 'foreign') {
							/* Fix up mixed-case attribute names */
							key =
								(_b =
									_foreignNames_js__WEBPACK_IMPORTED_MODULE_2__.attributeNames.get(
										key
									)) !== null && _b !== void 0
									? _b
									: key;
						}
						if (!opts.emptyAttrs && !opts.xmlMode && value === '') {
							return key;
						}
						return `${key}="${encode(value)}"`;
					})
					.join(' ');
			}
			/**
			 * Self-enclosing tags
			 */
			const singleTag = new Set([
				'area',
				'base',
				'basefont',
				'br',
				'col',
				'command',
				'embed',
				'frame',
				'hr',
				'img',
				'input',
				'isindex',
				'keygen',
				'link',
				'meta',
				'param',
				'source',
				'track',
				'wbr'
			]);
			/**
			 * Renders a DOM node or an array of DOM nodes to a string.
			 *
			 * Can be thought of as the equivalent of the `outerHTML` of the passed node(s).
			 *
			 * @param node Node to be rendered.
			 * @param options Changes serialization behavior
			 */
			function render(node, options = {}) {
				const nodes = 'length' in node ? node : [node];
				let output = '';
				for (let i = 0; i < nodes.length; i++) {
					output += renderNode(nodes[i], options);
				}
				return output;
			}
			/* harmony default export */ __webpack_exports__['default'] =
				render;
			function renderNode(node, options) {
				switch (node.type) {
					case domelementtype__WEBPACK_IMPORTED_MODULE_0__.Root:
						return render(node.children, options);
					// @ts-expect-error We don't use `Doctype` yet
					case domelementtype__WEBPACK_IMPORTED_MODULE_0__.Doctype:
					case domelementtype__WEBPACK_IMPORTED_MODULE_0__.Directive:
						return renderDirective(node);
					case domelementtype__WEBPACK_IMPORTED_MODULE_0__.Comment:
						return renderComment(node);
					case domelementtype__WEBPACK_IMPORTED_MODULE_0__.CDATA:
						return renderCdata(node);
					case domelementtype__WEBPACK_IMPORTED_MODULE_0__.Script:
					case domelementtype__WEBPACK_IMPORTED_MODULE_0__.Style:
					case domelementtype__WEBPACK_IMPORTED_MODULE_0__.Tag:
						return renderTag(node, options);
					case domelementtype__WEBPACK_IMPORTED_MODULE_0__.Text:
						return renderText(node, options);
				}
			}
			const foreignModeIntegrationPoints = new Set([
				'mi',
				'mo',
				'mn',
				'ms',
				'mtext',
				'annotation-xml',
				'foreignObject',
				'desc',
				'title'
			]);
			const foreignElements = new Set(['svg', 'math']);
			function renderTag(elem, opts) {
				var _a;
				// Handle SVG / MathML in HTML
				if (opts.xmlMode === 'foreign') {
					/* Fix up mixed-case element names */
					elem.name =
						(_a =
							_foreignNames_js__WEBPACK_IMPORTED_MODULE_2__.elementNames.get(
								elem.name
							)) !== null && _a !== void 0
							? _a
							: elem.name;
					/* Exit foreign mode at integration points */
					if (
						elem.parent &&
						foreignModeIntegrationPoints.has(elem.parent.name)
					) {
						opts = { ...opts, xmlMode: false };
					}
				}
				if (!opts.xmlMode && foreignElements.has(elem.name)) {
					opts = { ...opts, xmlMode: 'foreign' };
				}
				let tag = `<${elem.name}`;
				const attribs = formatAttributes(elem.attribs, opts);
				if (attribs) {
					tag += ` ${attribs}`;
				}
				if (
					elem.children.length === 0 &&
					(opts.xmlMode
						? // In XML mode or foreign mode, and user hasn't explicitly turned off self-closing tags
							opts.selfClosingTags !== false
						: // User explicitly asked for self-closing tags, even in HTML mode
							opts.selfClosingTags && singleTag.has(elem.name))
				) {
					if (!opts.xmlMode) tag += ' ';
					tag += '/>';
				} else {
					tag += '>';
					if (elem.children.length > 0) {
						tag += render(elem.children, opts);
					}
					if (opts.xmlMode || !singleTag.has(elem.name)) {
						tag += `</${elem.name}>`;
					}
				}
				return tag;
			}
			function renderDirective(elem) {
				return `<${elem.data}>`;
			}
			function renderText(elem, opts) {
				var _a;
				let data = elem.data || '';
				// If entities weren't decoded, no need to encode them back
				if (
					((_a = opts.encodeEntities) !== null && _a !== void 0
						? _a
						: opts.decodeEntities) !== false &&
					!(
						!opts.xmlMode &&
						elem.parent &&
						unencodedElements.has(elem.parent.name)
					)
				) {
					data =
						opts.xmlMode || opts.encodeEntities !== 'utf8'
							? (0,
								entities__WEBPACK_IMPORTED_MODULE_1__.encodeXML)(
									data
								)
							: (0,
								entities__WEBPACK_IMPORTED_MODULE_1__.escapeText)(
									data
								);
				}
				return data;
			}
			function renderCdata(elem) {
				return `<![CDATA[${elem.children[0].data}]]>`;
			}
			function renderComment(elem) {
				return `<!--${elem.data}-->`;
			}
		},
		'./node_modules/domelementtype/lib/esm/index.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				CDATA: function () {
					return CDATA;
				},
				Comment: function () {
					return Comment;
				},
				Directive: function () {
					return Directive;
				},
				Doctype: function () {
					return Doctype;
				},
				ElementType: function () {
					return ElementType;
				},
				Root: function () {
					return Root;
				},
				Script: function () {
					return Script;
				},
				Style: function () {
					return Style;
				},
				Tag: function () {
					return Tag;
				},
				Text: function () {
					return Text;
				},
				isTag: function () {
					return isTag;
				}
			});
			/** Types of elements found in htmlparser2's DOM */
			var ElementType;
			(function (ElementType) {
				/** Type for the root element of a document */
				ElementType['Root'] = 'root';
				/** Type for Text */
				ElementType['Text'] = 'text';
				/** Type for <? ... ?> */
				ElementType['Directive'] = 'directive';
				/** Type for <!-- ... --> */
				ElementType['Comment'] = 'comment';
				/** Type for <script> tags */
				ElementType['Script'] = 'script';
				/** Type for <style> tags */
				ElementType['Style'] = 'style';
				/** Type for Any tag */
				ElementType['Tag'] = 'tag';
				/** Type for <![CDATA[ ... ]]> */
				ElementType['CDATA'] = 'cdata';
				/** Type for <!doctype ...> */
				ElementType['Doctype'] = 'doctype';
			})(ElementType || (ElementType = {}));
			/**
			 * Tests whether an element is a tag or not.
			 *
			 * @param elem Element to test
			 */
			function isTag(elem) {
				return (
					elem.type === ElementType.Tag ||
					elem.type === ElementType.Script ||
					elem.type === ElementType.Style
				);
			}
			// Exports for backwards compatibility
			/** Type for the root element of a document */
			const Root = ElementType.Root;
			/** Type for Text */
			const Text = ElementType.Text;
			/** Type for <? ... ?> */
			const Directive = ElementType.Directive;
			/** Type for <!-- ... --> */
			const Comment = ElementType.Comment;
			/** Type for <script> tags */
			const Script = ElementType.Script;
			/** Type for <style> tags */
			const Style = ElementType.Style;
			/** Type for Any tag */
			const Tag = ElementType.Tag;
			/** Type for <![CDATA[ ... ]]> */
			const CDATA = ElementType.CDATA;
			/** Type for <!doctype ...> */
			const Doctype = ElementType.Doctype;
		},
		'./node_modules/domhandler/lib/esm/index.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				CDATA: function () {
					return /* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.CDATA;
				},
				Comment: function () {
					return /* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.Comment;
				},
				DataNode: function () {
					return /* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.DataNode;
				},
				Document: function () {
					return /* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.Document;
				},
				DomHandler: function () {
					return DomHandler;
				},
				Element: function () {
					return /* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.Element;
				},
				Node: function () {
					return /* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.Node;
				},
				NodeWithChildren: function () {
					return /* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.NodeWithChildren;
				},
				ProcessingInstruction: function () {
					return /* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.ProcessingInstruction;
				},
				Text: function () {
					return /* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.Text;
				},
				cloneNode: function () {
					return /* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.cloneNode;
				},
				hasChildren: function () {
					return /* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.hasChildren;
				},
				isCDATA: function () {
					return /* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.isCDATA;
				},
				isComment: function () {
					return /* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.isComment;
				},
				isDirective: function () {
					return /* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.isDirective;
				},
				isDocument: function () {
					return /* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.isDocument;
				},
				isTag: function () {
					return /* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.isTag;
				},
				isText: function () {
					return /* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.isText;
				}
			});
			/* harmony import */ var domelementtype__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! domelementtype */ './node_modules/domelementtype/lib/esm/index.js'
				);
			/* harmony import */ var _node_js__WEBPACK_IMPORTED_MODULE_1__ =
				__webpack_require__(
					/*! ./node.js */ './node_modules/domhandler/lib/esm/node.js'
				);

			// Default options
			const defaultOpts = {
				withStartIndices: false,
				withEndIndices: false,
				xmlMode: false
			};
			class DomHandler {
				/**
				 * @param callback Called once parsing has completed.
				 * @param options Settings for the handler.
				 * @param elementCB Callback whenever a tag is closed.
				 */
				constructor(callback, options, elementCB) {
					/** The elements of the DOM */
					this.dom = [];
					/** The root element for the DOM */
					this.root =
						new _node_js__WEBPACK_IMPORTED_MODULE_1__.Document(
							this.dom
						);
					/** Indicated whether parsing has been completed. */
					this.done = false;
					/** Stack of open tags. */
					this.tagStack = [this.root];
					/** A data node that is still being written to. */
					this.lastNode = null;
					/** Reference to the parser instance. Used for location information. */
					this.parser = null;
					// Make it possible to skip arguments, for backwards-compatibility
					if (typeof options === 'function') {
						elementCB = options;
						options = defaultOpts;
					}
					if (typeof callback === 'object') {
						options = callback;
						callback = undefined;
					}
					this.callback =
						callback !== null && callback !== void 0
							? callback
							: null;
					this.options =
						options !== null && options !== void 0
							? options
							: defaultOpts;
					this.elementCB =
						elementCB !== null && elementCB !== void 0
							? elementCB
							: null;
				}
				onparserinit(parser) {
					this.parser = parser;
				}
				// Resets the handler back to starting state
				onreset() {
					this.dom = [];
					this.root =
						new _node_js__WEBPACK_IMPORTED_MODULE_1__.Document(
							this.dom
						);
					this.done = false;
					this.tagStack = [this.root];
					this.lastNode = null;
					this.parser = null;
				}
				// Signals the handler that parsing is done
				onend() {
					if (this.done) return;
					this.done = true;
					this.parser = null;
					this.handleCallback(null);
				}
				onerror(error) {
					this.handleCallback(error);
				}
				onclosetag() {
					this.lastNode = null;
					const elem = this.tagStack.pop();
					if (this.options.withEndIndices) {
						elem.endIndex = this.parser.endIndex;
					}
					if (this.elementCB) this.elementCB(elem);
				}
				onopentag(name, attribs) {
					const type = this.options.xmlMode
						? domelementtype__WEBPACK_IMPORTED_MODULE_0__
								.ElementType.Tag
						: undefined;
					const element =
						new _node_js__WEBPACK_IMPORTED_MODULE_1__.Element(
							name,
							attribs,
							undefined,
							type
						);
					this.addNode(element);
					this.tagStack.push(element);
				}
				ontext(data) {
					const { lastNode } = this;
					if (
						lastNode &&
						lastNode.type ===
							domelementtype__WEBPACK_IMPORTED_MODULE_0__
								.ElementType.Text
					) {
						lastNode.data += data;
						if (this.options.withEndIndices) {
							lastNode.endIndex = this.parser.endIndex;
						}
					} else {
						const node =
							new _node_js__WEBPACK_IMPORTED_MODULE_1__.Text(
								data
							);
						this.addNode(node);
						this.lastNode = node;
					}
				}
				oncomment(data) {
					if (
						this.lastNode &&
						this.lastNode.type ===
							domelementtype__WEBPACK_IMPORTED_MODULE_0__
								.ElementType.Comment
					) {
						this.lastNode.data += data;
						return;
					}
					const node =
						new _node_js__WEBPACK_IMPORTED_MODULE_1__.Comment(data);
					this.addNode(node);
					this.lastNode = node;
				}
				oncommentend() {
					this.lastNode = null;
				}
				oncdatastart() {
					const text = new _node_js__WEBPACK_IMPORTED_MODULE_1__.Text(
						''
					);
					const node =
						new _node_js__WEBPACK_IMPORTED_MODULE_1__.CDATA([text]);
					this.addNode(node);
					text.parent = node;
					this.lastNode = text;
				}
				oncdataend() {
					this.lastNode = null;
				}
				onprocessinginstruction(name, data) {
					const node =
						new _node_js__WEBPACK_IMPORTED_MODULE_1__.ProcessingInstruction(
							name,
							data
						);
					this.addNode(node);
				}
				handleCallback(error) {
					if (typeof this.callback === 'function') {
						this.callback(error, this.dom);
					} else if (error) {
						throw error;
					}
				}
				addNode(node) {
					const parent = this.tagStack[this.tagStack.length - 1];
					const previousSibling =
						parent.children[parent.children.length - 1];
					if (this.options.withStartIndices) {
						node.startIndex = this.parser.startIndex;
					}
					if (this.options.withEndIndices) {
						node.endIndex = this.parser.endIndex;
					}
					parent.children.push(node);
					if (previousSibling) {
						node.prev = previousSibling;
						previousSibling.next = node;
					}
					node.parent = parent;
					this.lastNode = null;
				}
			}
			/* harmony default export */ __webpack_exports__['default'] =
				DomHandler;
		},
		'./node_modules/domhandler/lib/esm/node.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				CDATA: function () {
					return CDATA;
				},
				Comment: function () {
					return Comment;
				},
				DataNode: function () {
					return DataNode;
				},
				Document: function () {
					return Document;
				},
				Element: function () {
					return Element;
				},
				Node: function () {
					return Node;
				},
				NodeWithChildren: function () {
					return NodeWithChildren;
				},
				ProcessingInstruction: function () {
					return ProcessingInstruction;
				},
				Text: function () {
					return Text;
				},
				cloneNode: function () {
					return cloneNode;
				},
				hasChildren: function () {
					return hasChildren;
				},
				isCDATA: function () {
					return isCDATA;
				},
				isComment: function () {
					return isComment;
				},
				isDirective: function () {
					return isDirective;
				},
				isDocument: function () {
					return isDocument;
				},
				isTag: function () {
					return isTag;
				},
				isText: function () {
					return isText;
				}
			});
			/* harmony import */ var domelementtype__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! domelementtype */ './node_modules/domelementtype/lib/esm/index.js'
				);

			/**
			 * This object will be used as the prototype for Nodes when creating a
			 * DOM-Level-1-compliant structure.
			 */
			class Node {
				constructor() {
					/** Parent of the node */
					this.parent = null;
					/** Previous sibling */
					this.prev = null;
					/** Next sibling */
					this.next = null;
					/** The start index of the node. Requires `withStartIndices` on the handler to be `true. */
					this.startIndex = null;
					/** The end index of the node. Requires `withEndIndices` on the handler to be `true. */
					this.endIndex = null;
				}
				// Read-write aliases for properties
				/**
				 * Same as {@link parent}.
				 * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
				 */
				get parentNode() {
					return this.parent;
				}
				set parentNode(parent) {
					this.parent = parent;
				}
				/**
				 * Same as {@link prev}.
				 * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
				 */
				get previousSibling() {
					return this.prev;
				}
				set previousSibling(prev) {
					this.prev = prev;
				}
				/**
				 * Same as {@link next}.
				 * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
				 */
				get nextSibling() {
					return this.next;
				}
				set nextSibling(next) {
					this.next = next;
				}
				/**
				 * Clone this node, and optionally its children.
				 *
				 * @param recursive Clone child nodes as well.
				 * @returns A clone of the node.
				 */
				cloneNode(recursive = false) {
					return cloneNode(this, recursive);
				}
			}
			/**
			 * A node that contains some data.
			 */
			class DataNode extends Node {
				/**
				 * @param data The content of the data node
				 */
				constructor(data) {
					super();
					this.data = data;
				}
				/**
				 * Same as {@link data}.
				 * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
				 */
				get nodeValue() {
					return this.data;
				}
				set nodeValue(data) {
					this.data = data;
				}
			}
			/**
			 * Text within the document.
			 */
			class Text extends DataNode {
				constructor() {
					super(...arguments);
					this.type =
						domelementtype__WEBPACK_IMPORTED_MODULE_0__.ElementType.Text;
				}
				get nodeType() {
					return 3;
				}
			}
			/**
			 * Comments within the document.
			 */
			class Comment extends DataNode {
				constructor() {
					super(...arguments);
					this.type =
						domelementtype__WEBPACK_IMPORTED_MODULE_0__.ElementType.Comment;
				}
				get nodeType() {
					return 8;
				}
			}
			/**
			 * Processing instructions, including doc types.
			 */
			class ProcessingInstruction extends DataNode {
				constructor(name, data) {
					super(data);
					this.name = name;
					this.type =
						domelementtype__WEBPACK_IMPORTED_MODULE_0__.ElementType.Directive;
				}
				get nodeType() {
					return 1;
				}
			}
			/**
			 * A `Node` that can have children.
			 */
			class NodeWithChildren extends Node {
				/**
				 * @param children Children of the node. Only certain node types can have children.
				 */
				constructor(children) {
					super();
					this.children = children;
				}
				// Aliases
				/** First child of the node. */
				get firstChild() {
					var _a;
					return (_a = this.children[0]) !== null && _a !== void 0
						? _a
						: null;
				}
				/** Last child of the node. */
				get lastChild() {
					return this.children.length > 0
						? this.children[this.children.length - 1]
						: null;
				}
				/**
				 * Same as {@link children}.
				 * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
				 */
				get childNodes() {
					return this.children;
				}
				set childNodes(children) {
					this.children = children;
				}
			}
			class CDATA extends NodeWithChildren {
				constructor() {
					super(...arguments);
					this.type =
						domelementtype__WEBPACK_IMPORTED_MODULE_0__.ElementType.CDATA;
				}
				get nodeType() {
					return 4;
				}
			}
			/**
			 * The root node of the document.
			 */
			class Document extends NodeWithChildren {
				constructor() {
					super(...arguments);
					this.type =
						domelementtype__WEBPACK_IMPORTED_MODULE_0__.ElementType.Root;
				}
				get nodeType() {
					return 9;
				}
			}
			/**
			 * An element within the DOM.
			 */
			class Element extends NodeWithChildren {
				/**
				 * @param name Name of the tag, eg. `div`, `span`.
				 * @param attribs Object mapping attribute names to attribute values.
				 * @param children Children of the node.
				 */
				constructor(
					name,
					attribs,
					children = [],
					type = name === 'script'
						? domelementtype__WEBPACK_IMPORTED_MODULE_0__
								.ElementType.Script
						: name === 'style'
							? domelementtype__WEBPACK_IMPORTED_MODULE_0__
									.ElementType.Style
							: domelementtype__WEBPACK_IMPORTED_MODULE_0__
									.ElementType.Tag
				) {
					super(children);
					this.name = name;
					this.attribs = attribs;
					this.type = type;
				}
				get nodeType() {
					return 1;
				}
				// DOM Level 1 aliases
				/**
				 * Same as {@link name}.
				 * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
				 */
				get tagName() {
					return this.name;
				}
				set tagName(name) {
					this.name = name;
				}
				get attributes() {
					return Object.keys(this.attribs).map(name => {
						var _a, _b;
						return {
							name,
							value: this.attribs[name],
							namespace:
								(_a = this['x-attribsNamespace']) === null ||
								_a === void 0
									? void 0
									: _a[name],
							prefix:
								(_b = this['x-attribsPrefix']) === null ||
								_b === void 0
									? void 0
									: _b[name]
						};
					});
				}
			}
			/**
			 * @param node Node to check.
			 * @returns `true` if the node is a `Element`, `false` otherwise.
			 */
			function isTag(node) {
				return (0, domelementtype__WEBPACK_IMPORTED_MODULE_0__.isTag)(
					node
				);
			}
			/**
			 * @param node Node to check.
			 * @returns `true` if the node has the type `CDATA`, `false` otherwise.
			 */
			function isCDATA(node) {
				return (
					node.type ===
					domelementtype__WEBPACK_IMPORTED_MODULE_0__.ElementType
						.CDATA
				);
			}
			/**
			 * @param node Node to check.
			 * @returns `true` if the node has the type `Text`, `false` otherwise.
			 */
			function isText(node) {
				return (
					node.type ===
					domelementtype__WEBPACK_IMPORTED_MODULE_0__.ElementType.Text
				);
			}
			/**
			 * @param node Node to check.
			 * @returns `true` if the node has the type `Comment`, `false` otherwise.
			 */
			function isComment(node) {
				return (
					node.type ===
					domelementtype__WEBPACK_IMPORTED_MODULE_0__.ElementType
						.Comment
				);
			}
			/**
			 * @param node Node to check.
			 * @returns `true` if the node has the type `ProcessingInstruction`, `false` otherwise.
			 */
			function isDirective(node) {
				return (
					node.type ===
					domelementtype__WEBPACK_IMPORTED_MODULE_0__.ElementType
						.Directive
				);
			}
			/**
			 * @param node Node to check.
			 * @returns `true` if the node has the type `ProcessingInstruction`, `false` otherwise.
			 */
			function isDocument(node) {
				return (
					node.type ===
					domelementtype__WEBPACK_IMPORTED_MODULE_0__.ElementType.Root
				);
			}
			/**
			 * @param node Node to check.
			 * @returns `true` if the node has children, `false` otherwise.
			 */
			function hasChildren(node) {
				return Object.prototype.hasOwnProperty.call(node, 'children');
			}
			/**
			 * Clone a node, and optionally its children.
			 *
			 * @param recursive Clone child nodes as well.
			 * @returns A clone of the node.
			 */
			function cloneNode(node, recursive = false) {
				let result;
				if (isText(node)) {
					result = new Text(node.data);
				} else if (isComment(node)) {
					result = new Comment(node.data);
				} else if (isTag(node)) {
					const children = recursive
						? cloneChildren(node.children)
						: [];
					const clone = new Element(
						node.name,
						{ ...node.attribs },
						children
					);
					children.forEach(child => (child.parent = clone));
					if (node.namespace != null) {
						clone.namespace = node.namespace;
					}
					if (node['x-attribsNamespace']) {
						clone['x-attribsNamespace'] = {
							...node['x-attribsNamespace']
						};
					}
					if (node['x-attribsPrefix']) {
						clone['x-attribsPrefix'] = {
							...node['x-attribsPrefix']
						};
					}
					result = clone;
				} else if (isCDATA(node)) {
					const children = recursive
						? cloneChildren(node.children)
						: [];
					const clone = new CDATA(children);
					children.forEach(child => (child.parent = clone));
					result = clone;
				} else if (isDocument(node)) {
					const children = recursive
						? cloneChildren(node.children)
						: [];
					const clone = new Document(children);
					children.forEach(child => (child.parent = clone));
					if (node['x-mode']) {
						clone['x-mode'] = node['x-mode'];
					}
					result = clone;
				} else if (isDirective(node)) {
					const instruction = new ProcessingInstruction(
						node.name,
						node.data
					);
					if (node['x-name'] != null) {
						instruction['x-name'] = node['x-name'];
						instruction['x-publicId'] = node['x-publicId'];
						instruction['x-systemId'] = node['x-systemId'];
					}
					result = instruction;
				} else {
					throw new Error(`Not implemented yet: ${node.type}`);
				}
				result.startIndex = node.startIndex;
				result.endIndex = node.endIndex;
				if (node.sourceCodeLocation != null) {
					result.sourceCodeLocation = node.sourceCodeLocation;
				}
				return result;
			}
			function cloneChildren(childs) {
				const children = childs.map(child => cloneNode(child, true));
				for (let i = 1; i < children.length; i++) {
					children[i].prev = children[i - 1];
					children[i - 1].next = children[i];
				}
				return children;
			}
		},
		'./node_modules/domutils/lib/esm/feeds.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				getFeed: function () {
					return getFeed;
				}
			});
			/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! ./stringify.js */ './node_modules/domutils/lib/esm/stringify.js'
				);
			/* harmony import */ var _legacy_js__WEBPACK_IMPORTED_MODULE_1__ =
				__webpack_require__(
					/*! ./legacy.js */ './node_modules/domutils/lib/esm/legacy.js'
				);

			/**
			 * Get the feed object from the root of a DOM tree.
			 *
			 * @category Feeds
			 * @param doc - The DOM to to extract the feed from.
			 * @returns The feed.
			 */
			function getFeed(doc) {
				const feedRoot = getOneElement(isValidFeed, doc);
				return !feedRoot
					? null
					: feedRoot.name === 'feed'
						? getAtomFeed(feedRoot)
						: getRssFeed(feedRoot);
			}
			/**
			 * Parse an Atom feed.
			 *
			 * @param feedRoot The root of the feed.
			 * @returns The parsed feed.
			 */
			function getAtomFeed(feedRoot) {
				var _a;
				const childs = feedRoot.children;
				const feed = {
					type: 'atom',
					items: (0,
					_legacy_js__WEBPACK_IMPORTED_MODULE_1__.getElementsByTagName)(
						'entry',
						childs
					).map(item => {
						var _a;
						const { children } = item;
						const entry = { media: getMediaElements(children) };
						addConditionally(entry, 'id', 'id', children);
						addConditionally(entry, 'title', 'title', children);
						const href =
							(_a = getOneElement('link', children)) === null ||
							_a === void 0
								? void 0
								: _a.attribs['href'];
						if (href) {
							entry.link = href;
						}
						const description =
							fetch('summary', children) ||
							fetch('content', children);
						if (description) {
							entry.description = description;
						}
						const pubDate = fetch('updated', children);
						if (pubDate) {
							entry.pubDate = new Date(pubDate);
						}
						return entry;
					})
				};
				addConditionally(feed, 'id', 'id', childs);
				addConditionally(feed, 'title', 'title', childs);
				const href =
					(_a = getOneElement('link', childs)) === null ||
					_a === void 0
						? void 0
						: _a.attribs['href'];
				if (href) {
					feed.link = href;
				}
				addConditionally(feed, 'description', 'subtitle', childs);
				const updated = fetch('updated', childs);
				if (updated) {
					feed.updated = new Date(updated);
				}
				addConditionally(feed, 'author', 'email', childs, true);
				return feed;
			}
			/**
			 * Parse a RSS feed.
			 *
			 * @param feedRoot The root of the feed.
			 * @returns The parsed feed.
			 */
			function getRssFeed(feedRoot) {
				var _a, _b;
				const childs =
					(_b =
						(_a = getOneElement('channel', feedRoot.children)) ===
							null || _a === void 0
							? void 0
							: _a.children) !== null && _b !== void 0
						? _b
						: [];
				const feed = {
					type: feedRoot.name.substr(0, 3),
					id: '',
					items: (0,
					_legacy_js__WEBPACK_IMPORTED_MODULE_1__.getElementsByTagName)(
						'item',
						feedRoot.children
					).map(item => {
						const { children } = item;
						const entry = { media: getMediaElements(children) };
						addConditionally(entry, 'id', 'guid', children);
						addConditionally(entry, 'title', 'title', children);
						addConditionally(entry, 'link', 'link', children);
						addConditionally(
							entry,
							'description',
							'description',
							children
						);
						const pubDate =
							fetch('pubDate', children) ||
							fetch('dc:date', children);
						if (pubDate) entry.pubDate = new Date(pubDate);
						return entry;
					})
				};
				addConditionally(feed, 'title', 'title', childs);
				addConditionally(feed, 'link', 'link', childs);
				addConditionally(feed, 'description', 'description', childs);
				const updated = fetch('lastBuildDate', childs);
				if (updated) {
					feed.updated = new Date(updated);
				}
				addConditionally(
					feed,
					'author',
					'managingEditor',
					childs,
					true
				);
				return feed;
			}
			const MEDIA_KEYS_STRING = ['url', 'type', 'lang'];
			const MEDIA_KEYS_INT = [
				'fileSize',
				'bitrate',
				'framerate',
				'samplingrate',
				'channels',
				'duration',
				'height',
				'width'
			];
			/**
			 * Get all media elements of a feed item.
			 *
			 * @param where Nodes to search in.
			 * @returns Media elements.
			 */
			function getMediaElements(where) {
				return (0,
				_legacy_js__WEBPACK_IMPORTED_MODULE_1__.getElementsByTagName)(
					'media:content',
					where
				).map(elem => {
					const { attribs } = elem;
					const media = {
						medium: attribs['medium'],
						isDefault: !!attribs['isDefault']
					};
					for (const attrib of MEDIA_KEYS_STRING) {
						if (attribs[attrib]) {
							media[attrib] = attribs[attrib];
						}
					}
					for (const attrib of MEDIA_KEYS_INT) {
						if (attribs[attrib]) {
							media[attrib] = parseInt(attribs[attrib], 10);
						}
					}
					if (attribs['expression']) {
						media.expression = attribs['expression'];
					}
					return media;
				});
			}
			/**
			 * Get one element by tag name.
			 *
			 * @param tagName Tag name to look for
			 * @param node Node to search in
			 * @returns The element or null
			 */
			function getOneElement(tagName, node) {
				return (0,
				_legacy_js__WEBPACK_IMPORTED_MODULE_1__.getElementsByTagName)(
					tagName,
					node,
					true,
					1
				)[0];
			}
			/**
			 * Get the text content of an element with a certain tag name.
			 *
			 * @param tagName Tag name to look for.
			 * @param where Node to search in.
			 * @param recurse Whether to recurse into child nodes.
			 * @returns The text content of the element.
			 */
			function fetch(tagName, where, recurse = false) {
				return (0,
				_stringify_js__WEBPACK_IMPORTED_MODULE_0__.textContent)(
					(0,
					_legacy_js__WEBPACK_IMPORTED_MODULE_1__.getElementsByTagName)(
						tagName,
						where,
						recurse,
						1
					)
				).trim();
			}
			/**
			 * Adds a property to an object if it has a value.
			 *
			 * @param obj Object to be extended
			 * @param prop Property name
			 * @param tagName Tag name that contains the conditionally added property
			 * @param where Element to search for the property
			 * @param recurse Whether to recurse into child nodes.
			 */
			function addConditionally(
				obj,
				prop,
				tagName,
				where,
				recurse = false
			) {
				const val = fetch(tagName, where, recurse);
				if (val) obj[prop] = val;
			}
			/**
			 * Checks if an element is a feed root node.
			 *
			 * @param value The name of the element to check.
			 * @returns Whether an element is a feed root node.
			 */
			function isValidFeed(value) {
				return (
					value === 'rss' || value === 'feed' || value === 'rdf:RDF'
				);
			}
			//# sourceMappingURL=feeds.js.map
		},
		'./node_modules/domutils/lib/esm/helpers.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				DocumentPosition: function () {
					return DocumentPosition;
				},
				compareDocumentPosition: function () {
					return compareDocumentPosition;
				},
				removeSubsets: function () {
					return removeSubsets;
				},
				uniqueSort: function () {
					return uniqueSort;
				}
			});
			/* harmony import */ var domhandler__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! domhandler */ './node_modules/domhandler/lib/esm/index.js'
				);

			/**
			 * Given an array of nodes, remove any member that is contained by another
			 * member.
			 *
			 * @category Helpers
			 * @param nodes Nodes to filter.
			 * @returns Remaining nodes that aren't contained by other nodes.
			 */
			function removeSubsets(nodes) {
				let idx = nodes.length;
				/*
				 * Check if each node (or one of its ancestors) is already contained in the
				 * array.
				 */
				while (--idx >= 0) {
					const node = nodes[idx];
					/*
					 * Remove the node if it is not unique.
					 * We are going through the array from the end, so we only
					 * have to check nodes that preceed the node under consideration in the array.
					 */
					if (idx > 0 && nodes.lastIndexOf(node, idx - 1) >= 0) {
						nodes.splice(idx, 1);
						continue;
					}
					for (
						let ancestor = node.parent;
						ancestor;
						ancestor = ancestor.parent
					) {
						if (nodes.includes(ancestor)) {
							nodes.splice(idx, 1);
							break;
						}
					}
				}
				return nodes;
			}
			/**
			 * @category Helpers
			 * @see {@link http://dom.spec.whatwg.org/#dom-node-comparedocumentposition}
			 */
			var DocumentPosition;
			(function (DocumentPosition) {
				DocumentPosition[(DocumentPosition['DISCONNECTED'] = 1)] =
					'DISCONNECTED';
				DocumentPosition[(DocumentPosition['PRECEDING'] = 2)] =
					'PRECEDING';
				DocumentPosition[(DocumentPosition['FOLLOWING'] = 4)] =
					'FOLLOWING';
				DocumentPosition[(DocumentPosition['CONTAINS'] = 8)] =
					'CONTAINS';
				DocumentPosition[(DocumentPosition['CONTAINED_BY'] = 16)] =
					'CONTAINED_BY';
			})(DocumentPosition || (DocumentPosition = {}));
			/**
			 * Compare the position of one node against another node in any other document,
			 * returning a bitmask with the values from {@link DocumentPosition}.
			 *
			 * Document order:
			 * > There is an ordering, document order, defined on all the nodes in the
			 * > document corresponding to the order in which the first character of the
			 * > XML representation of each node occurs in the XML representation of the
			 * > document after expansion of general entities. Thus, the document element
			 * > node will be the first node. Element nodes occur before their children.
			 * > Thus, document order orders element nodes in order of the occurrence of
			 * > their start-tag in the XML (after expansion of entities). The attribute
			 * > nodes of an element occur after the element and before its children. The
			 * > relative order of attribute nodes is implementation-dependent.
			 *
			 * Source:
			 * http://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-document-order
			 *
			 * @category Helpers
			 * @param nodeA The first node to use in the comparison
			 * @param nodeB The second node to use in the comparison
			 * @returns A bitmask describing the input nodes' relative position.
			 *
			 * See http://dom.spec.whatwg.org/#dom-node-comparedocumentposition for
			 * a description of these values.
			 */
			function compareDocumentPosition(nodeA, nodeB) {
				const aParents = [];
				const bParents = [];
				if (nodeA === nodeB) {
					return 0;
				}
				let current = (0,
				domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(nodeA)
					? nodeA
					: nodeA.parent;
				while (current) {
					aParents.unshift(current);
					current = current.parent;
				}
				current = (0,
				domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(nodeB)
					? nodeB
					: nodeB.parent;
				while (current) {
					bParents.unshift(current);
					current = current.parent;
				}
				const maxIdx = Math.min(aParents.length, bParents.length);
				let idx = 0;
				while (idx < maxIdx && aParents[idx] === bParents[idx]) {
					idx++;
				}
				if (idx === 0) {
					return DocumentPosition.DISCONNECTED;
				}
				const sharedParent = aParents[idx - 1];
				const siblings = sharedParent.children;
				const aSibling = aParents[idx];
				const bSibling = bParents[idx];
				if (siblings.indexOf(aSibling) > siblings.indexOf(bSibling)) {
					if (sharedParent === nodeB) {
						return (
							DocumentPosition.FOLLOWING |
							DocumentPosition.CONTAINED_BY
						);
					}
					return DocumentPosition.FOLLOWING;
				}
				if (sharedParent === nodeA) {
					return (
						DocumentPosition.PRECEDING | DocumentPosition.CONTAINS
					);
				}
				return DocumentPosition.PRECEDING;
			}
			/**
			 * Sort an array of nodes based on their relative position in the document,
			 * removing any duplicate nodes. If the array contains nodes that do not belong
			 * to the same document, sort order is unspecified.
			 *
			 * @category Helpers
			 * @param nodes Array of DOM nodes.
			 * @returns Collection of unique nodes, sorted in document order.
			 */
			function uniqueSort(nodes) {
				nodes = nodes.filter(
					(node, i, arr) => !arr.includes(node, i + 1)
				);
				nodes.sort((a, b) => {
					const relative = compareDocumentPosition(a, b);
					if (relative & DocumentPosition.PRECEDING) {
						return -1;
					} else if (relative & DocumentPosition.FOLLOWING) {
						return 1;
					}
					return 0;
				});
				return nodes;
			}
			//# sourceMappingURL=helpers.js.map
		},
		'./node_modules/domutils/lib/esm/index.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				DocumentPosition: function () {
					return /* reexport safe */ _helpers_js__WEBPACK_IMPORTED_MODULE_5__.DocumentPosition;
				},
				append: function () {
					return /* reexport safe */ _manipulation_js__WEBPACK_IMPORTED_MODULE_2__.append;
				},
				appendChild: function () {
					return /* reexport safe */ _manipulation_js__WEBPACK_IMPORTED_MODULE_2__.appendChild;
				},
				compareDocumentPosition: function () {
					return /* reexport safe */ _helpers_js__WEBPACK_IMPORTED_MODULE_5__.compareDocumentPosition;
				},
				existsOne: function () {
					return /* reexport safe */ _querying_js__WEBPACK_IMPORTED_MODULE_3__.existsOne;
				},
				filter: function () {
					return /* reexport safe */ _querying_js__WEBPACK_IMPORTED_MODULE_3__.filter;
				},
				find: function () {
					return /* reexport safe */ _querying_js__WEBPACK_IMPORTED_MODULE_3__.find;
				},
				findAll: function () {
					return /* reexport safe */ _querying_js__WEBPACK_IMPORTED_MODULE_3__.findAll;
				},
				findOne: function () {
					return /* reexport safe */ _querying_js__WEBPACK_IMPORTED_MODULE_3__.findOne;
				},
				findOneChild: function () {
					return /* reexport safe */ _querying_js__WEBPACK_IMPORTED_MODULE_3__.findOneChild;
				},
				getAttributeValue: function () {
					return /* reexport safe */ _traversal_js__WEBPACK_IMPORTED_MODULE_1__.getAttributeValue;
				},
				getChildren: function () {
					return /* reexport safe */ _traversal_js__WEBPACK_IMPORTED_MODULE_1__.getChildren;
				},
				getElementById: function () {
					return /* reexport safe */ _legacy_js__WEBPACK_IMPORTED_MODULE_4__.getElementById;
				},
				getElements: function () {
					return /* reexport safe */ _legacy_js__WEBPACK_IMPORTED_MODULE_4__.getElements;
				},
				getElementsByTagName: function () {
					return /* reexport safe */ _legacy_js__WEBPACK_IMPORTED_MODULE_4__.getElementsByTagName;
				},
				getElementsByTagType: function () {
					return /* reexport safe */ _legacy_js__WEBPACK_IMPORTED_MODULE_4__.getElementsByTagType;
				},
				getFeed: function () {
					return /* reexport safe */ _feeds_js__WEBPACK_IMPORTED_MODULE_6__.getFeed;
				},
				getInnerHTML: function () {
					return /* reexport safe */ _stringify_js__WEBPACK_IMPORTED_MODULE_0__.getInnerHTML;
				},
				getName: function () {
					return /* reexport safe */ _traversal_js__WEBPACK_IMPORTED_MODULE_1__.getName;
				},
				getOuterHTML: function () {
					return /* reexport safe */ _stringify_js__WEBPACK_IMPORTED_MODULE_0__.getOuterHTML;
				},
				getParent: function () {
					return /* reexport safe */ _traversal_js__WEBPACK_IMPORTED_MODULE_1__.getParent;
				},
				getSiblings: function () {
					return /* reexport safe */ _traversal_js__WEBPACK_IMPORTED_MODULE_1__.getSiblings;
				},
				getText: function () {
					return /* reexport safe */ _stringify_js__WEBPACK_IMPORTED_MODULE_0__.getText;
				},
				hasAttrib: function () {
					return /* reexport safe */ _traversal_js__WEBPACK_IMPORTED_MODULE_1__.hasAttrib;
				},
				hasChildren: function () {
					return /* reexport safe */ domhandler__WEBPACK_IMPORTED_MODULE_7__.hasChildren;
				},
				innerText: function () {
					return /* reexport safe */ _stringify_js__WEBPACK_IMPORTED_MODULE_0__.innerText;
				},
				isCDATA: function () {
					return /* reexport safe */ domhandler__WEBPACK_IMPORTED_MODULE_7__.isCDATA;
				},
				isComment: function () {
					return /* reexport safe */ domhandler__WEBPACK_IMPORTED_MODULE_7__.isComment;
				},
				isDocument: function () {
					return /* reexport safe */ domhandler__WEBPACK_IMPORTED_MODULE_7__.isDocument;
				},
				isTag: function () {
					return /* reexport safe */ domhandler__WEBPACK_IMPORTED_MODULE_7__.isTag;
				},
				isText: function () {
					return /* reexport safe */ domhandler__WEBPACK_IMPORTED_MODULE_7__.isText;
				},
				nextElementSibling: function () {
					return /* reexport safe */ _traversal_js__WEBPACK_IMPORTED_MODULE_1__.nextElementSibling;
				},
				prepend: function () {
					return /* reexport safe */ _manipulation_js__WEBPACK_IMPORTED_MODULE_2__.prepend;
				},
				prependChild: function () {
					return /* reexport safe */ _manipulation_js__WEBPACK_IMPORTED_MODULE_2__.prependChild;
				},
				prevElementSibling: function () {
					return /* reexport safe */ _traversal_js__WEBPACK_IMPORTED_MODULE_1__.prevElementSibling;
				},
				removeElement: function () {
					return /* reexport safe */ _manipulation_js__WEBPACK_IMPORTED_MODULE_2__.removeElement;
				},
				removeSubsets: function () {
					return /* reexport safe */ _helpers_js__WEBPACK_IMPORTED_MODULE_5__.removeSubsets;
				},
				replaceElement: function () {
					return /* reexport safe */ _manipulation_js__WEBPACK_IMPORTED_MODULE_2__.replaceElement;
				},
				testElement: function () {
					return /* reexport safe */ _legacy_js__WEBPACK_IMPORTED_MODULE_4__.testElement;
				},
				textContent: function () {
					return /* reexport safe */ _stringify_js__WEBPACK_IMPORTED_MODULE_0__.textContent;
				},
				uniqueSort: function () {
					return /* reexport safe */ _helpers_js__WEBPACK_IMPORTED_MODULE_5__.uniqueSort;
				}
			});
			/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! ./stringify.js */ './node_modules/domutils/lib/esm/stringify.js'
				);
			/* harmony import */ var _traversal_js__WEBPACK_IMPORTED_MODULE_1__ =
				__webpack_require__(
					/*! ./traversal.js */ './node_modules/domutils/lib/esm/traversal.js'
				);
			/* harmony import */ var _manipulation_js__WEBPACK_IMPORTED_MODULE_2__ =
				__webpack_require__(
					/*! ./manipulation.js */ './node_modules/domutils/lib/esm/manipulation.js'
				);
			/* harmony import */ var _querying_js__WEBPACK_IMPORTED_MODULE_3__ =
				__webpack_require__(
					/*! ./querying.js */ './node_modules/domutils/lib/esm/querying.js'
				);
			/* harmony import */ var _legacy_js__WEBPACK_IMPORTED_MODULE_4__ =
				__webpack_require__(
					/*! ./legacy.js */ './node_modules/domutils/lib/esm/legacy.js'
				);
			/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_5__ =
				__webpack_require__(
					/*! ./helpers.js */ './node_modules/domutils/lib/esm/helpers.js'
				);
			/* harmony import */ var _feeds_js__WEBPACK_IMPORTED_MODULE_6__ =
				__webpack_require__(
					/*! ./feeds.js */ './node_modules/domutils/lib/esm/feeds.js'
				);
			/* harmony import */ var domhandler__WEBPACK_IMPORTED_MODULE_7__ =
				__webpack_require__(
					/*! domhandler */ './node_modules/domhandler/lib/esm/index.js'
				);

			/** @deprecated Use these methods from `domhandler` directly. */

			//# sourceMappingURL=index.js.map
		},
		'./node_modules/domutils/lib/esm/legacy.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				getElementById: function () {
					return getElementById;
				},
				getElements: function () {
					return getElements;
				},
				getElementsByTagName: function () {
					return getElementsByTagName;
				},
				getElementsByTagType: function () {
					return getElementsByTagType;
				},
				testElement: function () {
					return testElement;
				}
			});
			/* harmony import */ var domhandler__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! domhandler */ './node_modules/domhandler/lib/esm/index.js'
				);
			/* harmony import */ var _querying_js__WEBPACK_IMPORTED_MODULE_1__ =
				__webpack_require__(
					/*! ./querying.js */ './node_modules/domutils/lib/esm/querying.js'
				);

			/**
			 * A map of functions to check nodes against.
			 */
			const Checks = {
				tag_name(name) {
					if (typeof name === 'function') {
						return elem =>
							(0, domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag)(
								elem
							) && name(elem.name);
					} else if (name === '*') {
						return domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag;
					}
					return elem =>
						(0, domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag)(
							elem
						) && elem.name === name;
				},
				tag_type(type) {
					if (typeof type === 'function') {
						return elem => type(elem.type);
					}
					return elem => elem.type === type;
				},
				tag_contains(data) {
					if (typeof data === 'function') {
						return elem =>
							(0, domhandler__WEBPACK_IMPORTED_MODULE_0__.isText)(
								elem
							) && data(elem.data);
					}
					return elem =>
						(0, domhandler__WEBPACK_IMPORTED_MODULE_0__.isText)(
							elem
						) && elem.data === data;
				}
			};
			/**
			 * Returns a function to check whether a node has an attribute with a particular
			 * value.
			 *
			 * @param attrib Attribute to check.
			 * @param value Attribute value to look for.
			 * @returns A function to check whether the a node has an attribute with a
			 *   particular value.
			 */
			function getAttribCheck(attrib, value) {
				if (typeof value === 'function') {
					return elem =>
						(0, domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag)(
							elem
						) && value(elem.attribs[attrib]);
				}
				return elem =>
					(0, domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag)(elem) &&
					elem.attribs[attrib] === value;
			}
			/**
			 * Returns a function that returns `true` if either of the input functions
			 * returns `true` for a node.
			 *
			 * @param a First function to combine.
			 * @param b Second function to combine.
			 * @returns A function taking a node and returning `true` if either of the input
			 *   functions returns `true` for the node.
			 */
			function combineFuncs(a, b) {
				return elem => a(elem) || b(elem);
			}
			/**
			 * Returns a function that executes all checks in `options` and returns `true`
			 * if any of them match a node.
			 *
			 * @param options An object describing nodes to look for.
			 * @returns A function that executes all checks in `options` and returns `true`
			 *   if any of them match a node.
			 */
			function compileTest(options) {
				const funcs = Object.keys(options).map(key => {
					const value = options[key];
					return Object.prototype.hasOwnProperty.call(Checks, key)
						? Checks[key](value)
						: getAttribCheck(key, value);
				});
				return funcs.length === 0 ? null : funcs.reduce(combineFuncs);
			}
			/**
			 * Checks whether a node matches the description in `options`.
			 *
			 * @category Legacy Query Functions
			 * @param options An object describing nodes to look for.
			 * @param node The element to test.
			 * @returns Whether the element matches the description in `options`.
			 */
			function testElement(options, node) {
				const test = compileTest(options);
				return test ? test(node) : true;
			}
			/**
			 * Returns all nodes that match `options`.
			 *
			 * @category Legacy Query Functions
			 * @param options An object describing nodes to look for.
			 * @param nodes Nodes to search through.
			 * @param recurse Also consider child nodes.
			 * @param limit Maximum number of nodes to return.
			 * @returns All nodes that match `options`.
			 */
			function getElements(options, nodes, recurse, limit = Infinity) {
				const test = compileTest(options);
				return test
					? (0, _querying_js__WEBPACK_IMPORTED_MODULE_1__.filter)(
							test,
							nodes,
							recurse,
							limit
						)
					: [];
			}
			/**
			 * Returns the node with the supplied ID.
			 *
			 * @category Legacy Query Functions
			 * @param id The unique ID attribute value to look for.
			 * @param nodes Nodes to search through.
			 * @param recurse Also consider child nodes.
			 * @returns The node with the supplied ID.
			 */
			function getElementById(id, nodes, recurse = true) {
				if (!Array.isArray(nodes)) nodes = [nodes];
				return (0, _querying_js__WEBPACK_IMPORTED_MODULE_1__.findOne)(
					getAttribCheck('id', id),
					nodes,
					recurse
				);
			}
			/**
			 * Returns all nodes with the supplied `tagName`.
			 *
			 * @category Legacy Query Functions
			 * @param tagName Tag name to search for.
			 * @param nodes Nodes to search through.
			 * @param recurse Also consider child nodes.
			 * @param limit Maximum number of nodes to return.
			 * @returns All nodes with the supplied `tagName`.
			 */
			function getElementsByTagName(
				tagName,
				nodes,
				recurse = true,
				limit = Infinity
			) {
				return (0, _querying_js__WEBPACK_IMPORTED_MODULE_1__.filter)(
					Checks['tag_name'](tagName),
					nodes,
					recurse,
					limit
				);
			}
			/**
			 * Returns all nodes with the supplied `type`.
			 *
			 * @category Legacy Query Functions
			 * @param type Element type to look for.
			 * @param nodes Nodes to search through.
			 * @param recurse Also consider child nodes.
			 * @param limit Maximum number of nodes to return.
			 * @returns All nodes with the supplied `type`.
			 */
			function getElementsByTagType(
				type,
				nodes,
				recurse = true,
				limit = Infinity
			) {
				return (0, _querying_js__WEBPACK_IMPORTED_MODULE_1__.filter)(
					Checks['tag_type'](type),
					nodes,
					recurse,
					limit
				);
			}
			//# sourceMappingURL=legacy.js.map
		},
		'./node_modules/domutils/lib/esm/manipulation.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				append: function () {
					return append;
				},
				appendChild: function () {
					return appendChild;
				},
				prepend: function () {
					return prepend;
				},
				prependChild: function () {
					return prependChild;
				},
				removeElement: function () {
					return removeElement;
				},
				replaceElement: function () {
					return replaceElement;
				}
			});
			/**
			 * Remove an element from the dom
			 *
			 * @category Manipulation
			 * @param elem The element to be removed
			 */
			function removeElement(elem) {
				if (elem.prev) elem.prev.next = elem.next;
				if (elem.next) elem.next.prev = elem.prev;
				if (elem.parent) {
					const childs = elem.parent.children;
					const childsIndex = childs.lastIndexOf(elem);
					if (childsIndex >= 0) {
						childs.splice(childsIndex, 1);
					}
				}
				elem.next = null;
				elem.prev = null;
				elem.parent = null;
			}
			/**
			 * Replace an element in the dom
			 *
			 * @category Manipulation
			 * @param elem The element to be replaced
			 * @param replacement The element to be added
			 */
			function replaceElement(elem, replacement) {
				const prev = (replacement.prev = elem.prev);
				if (prev) {
					prev.next = replacement;
				}
				const next = (replacement.next = elem.next);
				if (next) {
					next.prev = replacement;
				}
				const parent = (replacement.parent = elem.parent);
				if (parent) {
					const childs = parent.children;
					childs[childs.lastIndexOf(elem)] = replacement;
					elem.parent = null;
				}
			}
			/**
			 * Append a child to an element.
			 *
			 * @category Manipulation
			 * @param parent The element to append to.
			 * @param child The element to be added as a child.
			 */
			function appendChild(parent, child) {
				removeElement(child);
				child.next = null;
				child.parent = parent;
				if (parent.children.push(child) > 1) {
					const sibling = parent.children[parent.children.length - 2];
					sibling.next = child;
					child.prev = sibling;
				} else {
					child.prev = null;
				}
			}
			/**
			 * Append an element after another.
			 *
			 * @category Manipulation
			 * @param elem The element to append after.
			 * @param next The element be added.
			 */
			function append(elem, next) {
				removeElement(next);
				const { parent } = elem;
				const currNext = elem.next;
				next.next = currNext;
				next.prev = elem;
				elem.next = next;
				next.parent = parent;
				if (currNext) {
					currNext.prev = next;
					if (parent) {
						const childs = parent.children;
						childs.splice(childs.lastIndexOf(currNext), 0, next);
					}
				} else if (parent) {
					parent.children.push(next);
				}
			}
			/**
			 * Prepend a child to an element.
			 *
			 * @category Manipulation
			 * @param parent The element to prepend before.
			 * @param child The element to be added as a child.
			 */
			function prependChild(parent, child) {
				removeElement(child);
				child.parent = parent;
				child.prev = null;
				if (parent.children.unshift(child) !== 1) {
					const sibling = parent.children[1];
					sibling.prev = child;
					child.next = sibling;
				} else {
					child.next = null;
				}
			}
			/**
			 * Prepend an element before another.
			 *
			 * @category Manipulation
			 * @param elem The element to prepend before.
			 * @param prev The element be added.
			 */
			function prepend(elem, prev) {
				removeElement(prev);
				const { parent } = elem;
				if (parent) {
					const childs = parent.children;
					childs.splice(childs.indexOf(elem), 0, prev);
				}
				if (elem.prev) {
					elem.prev.next = prev;
				}
				prev.parent = parent;
				prev.prev = elem.prev;
				prev.next = elem;
				elem.prev = prev;
			}
			//# sourceMappingURL=manipulation.js.map
		},
		'./node_modules/domutils/lib/esm/querying.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				existsOne: function () {
					return existsOne;
				},
				filter: function () {
					return filter;
				},
				find: function () {
					return find;
				},
				findAll: function () {
					return findAll;
				},
				findOne: function () {
					return findOne;
				},
				findOneChild: function () {
					return findOneChild;
				}
			});
			/* harmony import */ var domhandler__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! domhandler */ './node_modules/domhandler/lib/esm/index.js'
				);

			/**
			 * Search a node and its children for nodes passing a test function. If `node` is not an array, it will be wrapped in one.
			 *
			 * @category Querying
			 * @param test Function to test nodes on.
			 * @param node Node to search. Will be included in the result set if it matches.
			 * @param recurse Also consider child nodes.
			 * @param limit Maximum number of nodes to return.
			 * @returns All nodes passing `test`.
			 */
			function filter(test, node, recurse = true, limit = Infinity) {
				return find(
					test,
					Array.isArray(node) ? node : [node],
					recurse,
					limit
				);
			}
			/**
			 * Search an array of nodes and their children for nodes passing a test function.
			 *
			 * @category Querying
			 * @param test Function to test nodes on.
			 * @param nodes Array of nodes to search.
			 * @param recurse Also consider child nodes.
			 * @param limit Maximum number of nodes to return.
			 * @returns All nodes passing `test`.
			 */
			function find(test, nodes, recurse, limit) {
				const result = [];
				/** Stack of the arrays we are looking at. */
				const nodeStack = [nodes];
				/** Stack of the indices within the arrays. */
				const indexStack = [0];
				for (;;) {
					// First, check if the current array has any more elements to look at.
					if (indexStack[0] >= nodeStack[0].length) {
						// If we have no more arrays to look at, we are done.
						if (indexStack.length === 1) {
							return result;
						}
						// Otherwise, remove the current array from the stack.
						nodeStack.shift();
						indexStack.shift();
						// Loop back to the start to continue with the next array.
						continue;
					}
					const elem = nodeStack[0][indexStack[0]++];
					if (test(elem)) {
						result.push(elem);
						if (--limit <= 0) return result;
					}
					if (
						recurse &&
						(0,
						domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(
							elem
						) &&
						elem.children.length > 0
					) {
						/*
						 * Add the children to the stack. We are depth-first, so this is
						 * the next array we look at.
						 */
						indexStack.unshift(0);
						nodeStack.unshift(elem.children);
					}
				}
			}
			/**
			 * Finds the first element inside of an array that matches a test function. This is an alias for `Array.prototype.find`.
			 *
			 * @category Querying
			 * @param test Function to test nodes on.
			 * @param nodes Array of nodes to search.
			 * @returns The first node in the array that passes `test`.
			 * @deprecated Use `Array.prototype.find` directly.
			 */
			function findOneChild(test, nodes) {
				return nodes.find(test);
			}
			/**
			 * Finds one element in a tree that passes a test.
			 *
			 * @category Querying
			 * @param test Function to test nodes on.
			 * @param nodes Node or array of nodes to search.
			 * @param recurse Also consider child nodes.
			 * @returns The first node that passes `test`.
			 */
			function findOne(test, nodes, recurse = true) {
				let elem = null;
				for (let i = 0; i < nodes.length && !elem; i++) {
					const node = nodes[i];
					if (
						!(0, domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag)(
							node
						)
					) {
						continue;
					} else if (test(node)) {
						elem = node;
					} else if (recurse && node.children.length > 0) {
						elem = findOne(test, node.children, true);
					}
				}
				return elem;
			}
			/**
			 * Checks if a tree of nodes contains at least one node passing a test.
			 *
			 * @category Querying
			 * @param test Function to test nodes on.
			 * @param nodes Array of nodes to search.
			 * @returns Whether a tree of nodes contains at least one node passing the test.
			 */
			function existsOne(test, nodes) {
				return nodes.some(
					checked =>
						(0, domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag)(
							checked
						) &&
						(test(checked) || existsOne(test, checked.children))
				);
			}
			/**
			 * Search an array of nodes and their children for elements passing a test function.
			 *
			 * Same as `find`, but limited to elements and with less options, leading to reduced complexity.
			 *
			 * @category Querying
			 * @param test Function to test nodes on.
			 * @param nodes Array of nodes to search.
			 * @returns All nodes passing `test`.
			 */
			function findAll(test, nodes) {
				const result = [];
				const nodeStack = [nodes];
				const indexStack = [0];
				for (;;) {
					if (indexStack[0] >= nodeStack[0].length) {
						if (nodeStack.length === 1) {
							return result;
						}
						// Otherwise, remove the current array from the stack.
						nodeStack.shift();
						indexStack.shift();
						// Loop back to the start to continue with the next array.
						continue;
					}
					const elem = nodeStack[0][indexStack[0]++];
					if (
						!(0, domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag)(
							elem
						)
					)
						continue;
					if (test(elem)) result.push(elem);
					if (elem.children.length > 0) {
						indexStack.unshift(0);
						nodeStack.unshift(elem.children);
					}
				}
			}
			//# sourceMappingURL=querying.js.map
		},
		'./node_modules/domutils/lib/esm/stringify.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				getInnerHTML: function () {
					return getInnerHTML;
				},
				getOuterHTML: function () {
					return getOuterHTML;
				},
				getText: function () {
					return getText;
				},
				innerText: function () {
					return innerText;
				},
				textContent: function () {
					return textContent;
				}
			});
			/* harmony import */ var domhandler__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! domhandler */ './node_modules/domhandler/lib/esm/index.js'
				);
			/* harmony import */ var dom_serializer__WEBPACK_IMPORTED_MODULE_1__ =
				__webpack_require__(
					/*! dom-serializer */ './node_modules/dom-serializer/lib/esm/index.js'
				);
			/* harmony import */ var domelementtype__WEBPACK_IMPORTED_MODULE_2__ =
				__webpack_require__(
					/*! domelementtype */ './node_modules/domelementtype/lib/esm/index.js'
				);

			/**
			 * @category Stringify
			 * @deprecated Use the `dom-serializer` module directly.
			 * @param node Node to get the outer HTML of.
			 * @param options Options for serialization.
			 * @returns `node`'s outer HTML.
			 */
			function getOuterHTML(node, options) {
				return (0,
				dom_serializer__WEBPACK_IMPORTED_MODULE_1__['default'])(
					node,
					options
				);
			}
			/**
			 * @category Stringify
			 * @deprecated Use the `dom-serializer` module directly.
			 * @param node Node to get the inner HTML of.
			 * @param options Options for serialization.
			 * @returns `node`'s inner HTML.
			 */
			function getInnerHTML(node, options) {
				return (0, domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(
					node
				)
					? node.children
							.map(node => getOuterHTML(node, options))
							.join('')
					: '';
			}
			/**
			 * Get a node's inner text. Same as `textContent`, but inserts newlines for `<br>` tags. Ignores comments.
			 *
			 * @category Stringify
			 * @deprecated Use `textContent` instead.
			 * @param node Node to get the inner text of.
			 * @returns `node`'s inner text.
			 */
			function getText(node) {
				if (Array.isArray(node)) return node.map(getText).join('');
				if ((0, domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag)(node))
					return node.name === 'br' ? '\n' : getText(node.children);
				if ((0, domhandler__WEBPACK_IMPORTED_MODULE_0__.isCDATA)(node))
					return getText(node.children);
				if ((0, domhandler__WEBPACK_IMPORTED_MODULE_0__.isText)(node))
					return node.data;
				return '';
			}
			/**
			 * Get a node's text content. Ignores comments.
			 *
			 * @category Stringify
			 * @param node Node to get the text content of.
			 * @returns `node`'s text content.
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent}
			 */
			function textContent(node) {
				if (Array.isArray(node)) return node.map(textContent).join('');
				if (
					(0, domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(
						node
					) &&
					!(0, domhandler__WEBPACK_IMPORTED_MODULE_0__.isComment)(
						node
					)
				) {
					return textContent(node.children);
				}
				if ((0, domhandler__WEBPACK_IMPORTED_MODULE_0__.isText)(node))
					return node.data;
				return '';
			}
			/**
			 * Get a node's inner text, ignoring `<script>` and `<style>` tags. Ignores comments.
			 *
			 * @category Stringify
			 * @param node Node to get the inner text of.
			 * @returns `node`'s inner text.
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/innerText}
			 */
			function innerText(node) {
				if (Array.isArray(node)) return node.map(innerText).join('');
				if (
					(0, domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(
						node
					) &&
					(node.type ===
						domelementtype__WEBPACK_IMPORTED_MODULE_2__.ElementType
							.Tag ||
						(0, domhandler__WEBPACK_IMPORTED_MODULE_0__.isCDATA)(
							node
						))
				) {
					return innerText(node.children);
				}
				if ((0, domhandler__WEBPACK_IMPORTED_MODULE_0__.isText)(node))
					return node.data;
				return '';
			}
			//# sourceMappingURL=stringify.js.map
		},
		'./node_modules/domutils/lib/esm/traversal.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				getAttributeValue: function () {
					return getAttributeValue;
				},
				getChildren: function () {
					return getChildren;
				},
				getName: function () {
					return getName;
				},
				getParent: function () {
					return getParent;
				},
				getSiblings: function () {
					return getSiblings;
				},
				hasAttrib: function () {
					return hasAttrib;
				},
				nextElementSibling: function () {
					return nextElementSibling;
				},
				prevElementSibling: function () {
					return prevElementSibling;
				}
			});
			/* harmony import */ var domhandler__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! domhandler */ './node_modules/domhandler/lib/esm/index.js'
				);

			/**
			 * Get a node's children.
			 *
			 * @category Traversal
			 * @param elem Node to get the children of.
			 * @returns `elem`'s children, or an empty array.
			 */
			function getChildren(elem) {
				return (0, domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(
					elem
				)
					? elem.children
					: [];
			}
			/**
			 * Get a node's parent.
			 *
			 * @category Traversal
			 * @param elem Node to get the parent of.
			 * @returns `elem`'s parent node, or `null` if `elem` is a root node.
			 */
			function getParent(elem) {
				return elem.parent || null;
			}
			/**
			 * Gets an elements siblings, including the element itself.
			 *
			 * Attempts to get the children through the element's parent first. If we don't
			 * have a parent (the element is a root node), we walk the element's `prev` &
			 * `next` to get all remaining nodes.
			 *
			 * @category Traversal
			 * @param elem Element to get the siblings of.
			 * @returns `elem`'s siblings, including `elem`.
			 */
			function getSiblings(elem) {
				const parent = getParent(elem);
				if (parent != null) return getChildren(parent);
				const siblings = [elem];
				let { prev, next } = elem;
				while (prev != null) {
					siblings.unshift(prev);
					({ prev } = prev);
				}
				while (next != null) {
					siblings.push(next);
					({ next } = next);
				}
				return siblings;
			}
			/**
			 * Gets an attribute from an element.
			 *
			 * @category Traversal
			 * @param elem Element to check.
			 * @param name Attribute name to retrieve.
			 * @returns The element's attribute value, or `undefined`.
			 */
			function getAttributeValue(elem, name) {
				var _a;
				return (_a = elem.attribs) === null || _a === void 0
					? void 0
					: _a[name];
			}
			/**
			 * Checks whether an element has an attribute.
			 *
			 * @category Traversal
			 * @param elem Element to check.
			 * @param name Attribute name to look for.
			 * @returns Returns whether `elem` has the attribute `name`.
			 */
			function hasAttrib(elem, name) {
				return (
					elem.attribs != null &&
					Object.prototype.hasOwnProperty.call(elem.attribs, name) &&
					elem.attribs[name] != null
				);
			}
			/**
			 * Get the tag name of an element.
			 *
			 * @category Traversal
			 * @param elem The element to get the name for.
			 * @returns The tag name of `elem`.
			 */
			function getName(elem) {
				return elem.name;
			}
			/**
			 * Returns the next element sibling of a node.
			 *
			 * @category Traversal
			 * @param elem The element to get the next sibling of.
			 * @returns `elem`'s next sibling that is a tag, or `null` if there is no next
			 * sibling.
			 */
			function nextElementSibling(elem) {
				let { next } = elem;
				while (
					next !== null &&
					!(0, domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag)(next)
				)
					({ next } = next);
				return next;
			}
			/**
			 * Returns the previous element sibling of a node.
			 *
			 * @category Traversal
			 * @param elem The element to get the previous sibling of.
			 * @returns `elem`'s previous sibling that is a tag, or `null` if there is no
			 * previous sibling.
			 */
			function prevElementSibling(elem) {
				let { prev } = elem;
				while (
					prev !== null &&
					!(0, domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag)(prev)
				)
					({ prev } = prev);
				return prev;
			}
			//# sourceMappingURL=traversal.js.map
		},
		'./node_modules/entities/lib/esm/decode.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				BinTrieFlags: function () {
					return BinTrieFlags;
				},
				DecodingMode: function () {
					return DecodingMode;
				},
				EntityDecoder: function () {
					return EntityDecoder;
				},
				decodeCodePoint: function () {
					return /* reexport safe */ _decode_codepoint_js__WEBPACK_IMPORTED_MODULE_2__[
						'default'
					];
				},
				decodeHTML: function () {
					return decodeHTML;
				},
				decodeHTMLAttribute: function () {
					return decodeHTMLAttribute;
				},
				decodeHTMLStrict: function () {
					return decodeHTMLStrict;
				},
				decodeXML: function () {
					return decodeXML;
				},
				determineBranch: function () {
					return determineBranch;
				},
				fromCodePoint: function () {
					return /* reexport safe */ _decode_codepoint_js__WEBPACK_IMPORTED_MODULE_2__.fromCodePoint;
				},
				htmlDecodeTree: function () {
					return /* reexport safe */ _generated_decode_data_html_js__WEBPACK_IMPORTED_MODULE_0__[
						'default'
					];
				},
				replaceCodePoint: function () {
					return /* reexport safe */ _decode_codepoint_js__WEBPACK_IMPORTED_MODULE_2__.replaceCodePoint;
				},
				xmlDecodeTree: function () {
					return /* reexport safe */ _generated_decode_data_xml_js__WEBPACK_IMPORTED_MODULE_1__[
						'default'
					];
				}
			});
			/* harmony import */ var _generated_decode_data_html_js__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! ./generated/decode-data-html.js */ './node_modules/entities/lib/esm/generated/decode-data-html.js'
				);
			/* harmony import */ var _generated_decode_data_xml_js__WEBPACK_IMPORTED_MODULE_1__ =
				__webpack_require__(
					/*! ./generated/decode-data-xml.js */ './node_modules/entities/lib/esm/generated/decode-data-xml.js'
				);
			/* harmony import */ var _decode_codepoint_js__WEBPACK_IMPORTED_MODULE_2__ =
				__webpack_require__(
					/*! ./decode_codepoint.js */ './node_modules/entities/lib/esm/decode_codepoint.js'
				);

			// Re-export for use by eg. htmlparser2

			var CharCodes;
			(function (CharCodes) {
				CharCodes[(CharCodes['NUM'] = 35)] = 'NUM';
				CharCodes[(CharCodes['SEMI'] = 59)] = 'SEMI';
				CharCodes[(CharCodes['EQUALS'] = 61)] = 'EQUALS';
				CharCodes[(CharCodes['ZERO'] = 48)] = 'ZERO';
				CharCodes[(CharCodes['NINE'] = 57)] = 'NINE';
				CharCodes[(CharCodes['LOWER_A'] = 97)] = 'LOWER_A';
				CharCodes[(CharCodes['LOWER_F'] = 102)] = 'LOWER_F';
				CharCodes[(CharCodes['LOWER_X'] = 120)] = 'LOWER_X';
				CharCodes[(CharCodes['LOWER_Z'] = 122)] = 'LOWER_Z';
				CharCodes[(CharCodes['UPPER_A'] = 65)] = 'UPPER_A';
				CharCodes[(CharCodes['UPPER_F'] = 70)] = 'UPPER_F';
				CharCodes[(CharCodes['UPPER_Z'] = 90)] = 'UPPER_Z';
			})(CharCodes || (CharCodes = {}));
			/** Bit that needs to be set to convert an upper case ASCII character to lower case */
			const TO_LOWER_BIT = 0b100000;
			var BinTrieFlags;
			(function (BinTrieFlags) {
				BinTrieFlags[(BinTrieFlags['VALUE_LENGTH'] = 49152)] =
					'VALUE_LENGTH';
				BinTrieFlags[(BinTrieFlags['BRANCH_LENGTH'] = 16256)] =
					'BRANCH_LENGTH';
				BinTrieFlags[(BinTrieFlags['JUMP_TABLE'] = 127)] = 'JUMP_TABLE';
			})(BinTrieFlags || (BinTrieFlags = {}));
			function isNumber(code) {
				return code >= CharCodes.ZERO && code <= CharCodes.NINE;
			}
			function isHexadecimalCharacter(code) {
				return (
					(code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_F) ||
					(code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_F)
				);
			}
			function isAsciiAlphaNumeric(code) {
				return (
					(code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_Z) ||
					(code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_Z) ||
					isNumber(code)
				);
			}
			/**
			 * Checks if the given character is a valid end character for an entity in an attribute.
			 *
			 * Attribute values that aren't terminated properly aren't parsed, and shouldn't lead to a parser error.
			 * See the example in https://html.spec.whatwg.org/multipage/parsing.html#named-character-reference-state
			 */
			function isEntityInAttributeInvalidEnd(code) {
				return code === CharCodes.EQUALS || isAsciiAlphaNumeric(code);
			}
			var EntityDecoderState;
			(function (EntityDecoderState) {
				EntityDecoderState[(EntityDecoderState['EntityStart'] = 0)] =
					'EntityStart';
				EntityDecoderState[(EntityDecoderState['NumericStart'] = 1)] =
					'NumericStart';
				EntityDecoderState[(EntityDecoderState['NumericDecimal'] = 2)] =
					'NumericDecimal';
				EntityDecoderState[(EntityDecoderState['NumericHex'] = 3)] =
					'NumericHex';
				EntityDecoderState[(EntityDecoderState['NamedEntity'] = 4)] =
					'NamedEntity';
			})(EntityDecoderState || (EntityDecoderState = {}));
			var DecodingMode;
			(function (DecodingMode) {
				/** Entities in text nodes that can end with any character. */
				DecodingMode[(DecodingMode['Legacy'] = 0)] = 'Legacy';
				/** Only allow entities terminated with a semicolon. */
				DecodingMode[(DecodingMode['Strict'] = 1)] = 'Strict';
				/** Entities in attributes have limitations on ending characters. */
				DecodingMode[(DecodingMode['Attribute'] = 2)] = 'Attribute';
			})(DecodingMode || (DecodingMode = {}));
			/**
			 * Token decoder with support of writing partial entities.
			 */
			class EntityDecoder {
				constructor(
					/** The tree used to decode entities. */
					decodeTree,
					/**
					 * The function that is called when a codepoint is decoded.
					 *
					 * For multi-byte named entities, this will be called multiple times,
					 * with the second codepoint, and the same `consumed` value.
					 *
					 * @param codepoint The decoded codepoint.
					 * @param consumed The number of bytes consumed by the decoder.
					 */
					emitCodePoint,
					/** An object that is used to produce errors. */
					errors
				) {
					this.decodeTree = decodeTree;
					this.emitCodePoint = emitCodePoint;
					this.errors = errors;
					/** The current state of the decoder. */
					this.state = EntityDecoderState.EntityStart;
					/** Characters that were consumed while parsing an entity. */
					this.consumed = 1;
					/**
					 * The result of the entity.
					 *
					 * Either the result index of a numeric entity, or the codepoint of a
					 * numeric entity.
					 */
					this.result = 0;
					/** The current index in the decode tree. */
					this.treeIndex = 0;
					/** The number of characters that were consumed in excess. */
					this.excess = 1;
					/** The mode in which the decoder is operating. */
					this.decodeMode = DecodingMode.Strict;
				}
				/** Resets the instance to make it reusable. */
				startEntity(decodeMode) {
					this.decodeMode = decodeMode;
					this.state = EntityDecoderState.EntityStart;
					this.result = 0;
					this.treeIndex = 0;
					this.excess = 1;
					this.consumed = 1;
				}
				/**
				 * Write an entity to the decoder. This can be called multiple times with partial entities.
				 * If the entity is incomplete, the decoder will return -1.
				 *
				 * Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
				 * entity is incomplete, and resume when the next string is written.
				 *
				 * @param string The string containing the entity (or a continuation of the entity).
				 * @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
				 * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
				 */
				write(str, offset) {
					switch (this.state) {
						case EntityDecoderState.EntityStart: {
							if (str.charCodeAt(offset) === CharCodes.NUM) {
								this.state = EntityDecoderState.NumericStart;
								this.consumed += 1;
								return this.stateNumericStart(str, offset + 1);
							}
							this.state = EntityDecoderState.NamedEntity;
							return this.stateNamedEntity(str, offset);
						}
						case EntityDecoderState.NumericStart: {
							return this.stateNumericStart(str, offset);
						}
						case EntityDecoderState.NumericDecimal: {
							return this.stateNumericDecimal(str, offset);
						}
						case EntityDecoderState.NumericHex: {
							return this.stateNumericHex(str, offset);
						}
						case EntityDecoderState.NamedEntity: {
							return this.stateNamedEntity(str, offset);
						}
					}
				}
				/**
				 * Switches between the numeric decimal and hexadecimal states.
				 *
				 * Equivalent to the `Numeric character reference state` in the HTML spec.
				 *
				 * @param str The string containing the entity (or a continuation of the entity).
				 * @param offset The current offset.
				 * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
				 */
				stateNumericStart(str, offset) {
					if (offset >= str.length) {
						return -1;
					}
					if (
						(str.charCodeAt(offset) | TO_LOWER_BIT) ===
						CharCodes.LOWER_X
					) {
						this.state = EntityDecoderState.NumericHex;
						this.consumed += 1;
						return this.stateNumericHex(str, offset + 1);
					}
					this.state = EntityDecoderState.NumericDecimal;
					return this.stateNumericDecimal(str, offset);
				}
				addToNumericResult(str, start, end, base) {
					if (start !== end) {
						const digitCount = end - start;
						this.result =
							this.result * Math.pow(base, digitCount) +
							parseInt(str.substr(start, digitCount), base);
						this.consumed += digitCount;
					}
				}
				/**
				 * Parses a hexadecimal numeric entity.
				 *
				 * Equivalent to the `Hexademical character reference state` in the HTML spec.
				 *
				 * @param str The string containing the entity (or a continuation of the entity).
				 * @param offset The current offset.
				 * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
				 */
				stateNumericHex(str, offset) {
					const startIdx = offset;
					while (offset < str.length) {
						const char = str.charCodeAt(offset);
						if (isNumber(char) || isHexadecimalCharacter(char)) {
							offset += 1;
						} else {
							this.addToNumericResult(str, startIdx, offset, 16);
							return this.emitNumericEntity(char, 3);
						}
					}
					this.addToNumericResult(str, startIdx, offset, 16);
					return -1;
				}
				/**
				 * Parses a decimal numeric entity.
				 *
				 * Equivalent to the `Decimal character reference state` in the HTML spec.
				 *
				 * @param str The string containing the entity (or a continuation of the entity).
				 * @param offset The current offset.
				 * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
				 */
				stateNumericDecimal(str, offset) {
					const startIdx = offset;
					while (offset < str.length) {
						const char = str.charCodeAt(offset);
						if (isNumber(char)) {
							offset += 1;
						} else {
							this.addToNumericResult(str, startIdx, offset, 10);
							return this.emitNumericEntity(char, 2);
						}
					}
					this.addToNumericResult(str, startIdx, offset, 10);
					return -1;
				}
				/**
				 * Validate and emit a numeric entity.
				 *
				 * Implements the logic from the `Hexademical character reference start
				 * state` and `Numeric character reference end state` in the HTML spec.
				 *
				 * @param lastCp The last code point of the entity. Used to see if the
				 *               entity was terminated with a semicolon.
				 * @param expectedLength The minimum number of characters that should be
				 *                       consumed. Used to validate that at least one digit
				 *                       was consumed.
				 * @returns The number of characters that were consumed.
				 */
				emitNumericEntity(lastCp, expectedLength) {
					var _a;
					// Ensure we consumed at least one digit.
					if (this.consumed <= expectedLength) {
						(_a = this.errors) === null || _a === void 0
							? void 0
							: _a.absenceOfDigitsInNumericCharacterReference(
									this.consumed
								);
						return 0;
					}
					// Figure out if this is a legit end of the entity
					if (lastCp === CharCodes.SEMI) {
						this.consumed += 1;
					} else if (this.decodeMode === DecodingMode.Strict) {
						return 0;
					}
					this.emitCodePoint(
						(0,
						_decode_codepoint_js__WEBPACK_IMPORTED_MODULE_2__.replaceCodePoint)(
							this.result
						),
						this.consumed
					);
					if (this.errors) {
						if (lastCp !== CharCodes.SEMI) {
							this.errors.missingSemicolonAfterCharacterReference();
						}
						this.errors.validateNumericCharacterReference(
							this.result
						);
					}
					return this.consumed;
				}
				/**
				 * Parses a named entity.
				 *
				 * Equivalent to the `Named character reference state` in the HTML spec.
				 *
				 * @param str The string containing the entity (or a continuation of the entity).
				 * @param offset The current offset.
				 * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
				 */
				stateNamedEntity(str, offset) {
					const { decodeTree } = this;
					let current = decodeTree[this.treeIndex];
					// The mask is the number of bytes of the value, including the current byte.
					let valueLength =
						(current & BinTrieFlags.VALUE_LENGTH) >> 14;
					for (; offset < str.length; offset++, this.excess++) {
						const char = str.charCodeAt(offset);
						this.treeIndex = determineBranch(
							decodeTree,
							current,
							this.treeIndex + Math.max(1, valueLength),
							char
						);
						if (this.treeIndex < 0) {
							return this.result === 0 ||
								// If we are parsing an attribute
								(this.decodeMode === DecodingMode.Attribute &&
									// We shouldn't have consumed any characters after the entity,
									(valueLength === 0 ||
										// And there should be no invalid characters.
										isEntityInAttributeInvalidEnd(char)))
								? 0
								: this.emitNotTerminatedNamedEntity();
						}
						current = decodeTree[this.treeIndex];
						valueLength =
							(current & BinTrieFlags.VALUE_LENGTH) >> 14;
						// If the branch is a value, store it and continue
						if (valueLength !== 0) {
							// If the entity is terminated by a semicolon, we are done.
							if (char === CharCodes.SEMI) {
								return this.emitNamedEntityData(
									this.treeIndex,
									valueLength,
									this.consumed + this.excess
								);
							}
							// If we encounter a non-terminated (legacy) entity while parsing strictly, then ignore it.
							if (this.decodeMode !== DecodingMode.Strict) {
								this.result = this.treeIndex;
								this.consumed += this.excess;
								this.excess = 0;
							}
						}
					}
					return -1;
				}
				/**
				 * Emit a named entity that was not terminated with a semicolon.
				 *
				 * @returns The number of characters consumed.
				 */
				emitNotTerminatedNamedEntity() {
					var _a;
					const { result, decodeTree } = this;
					const valueLength =
						(decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
					this.emitNamedEntityData(
						result,
						valueLength,
						this.consumed
					);
					(_a = this.errors) === null || _a === void 0
						? void 0
						: _a.missingSemicolonAfterCharacterReference();
					return this.consumed;
				}
				/**
				 * Emit a named entity.
				 *
				 * @param result The index of the entity in the decode tree.
				 * @param valueLength The number of bytes in the entity.
				 * @param consumed The number of characters consumed.
				 *
				 * @returns The number of characters consumed.
				 */
				emitNamedEntityData(result, valueLength, consumed) {
					const { decodeTree } = this;
					this.emitCodePoint(
						valueLength === 1
							? decodeTree[result] & ~BinTrieFlags.VALUE_LENGTH
							: decodeTree[result + 1],
						consumed
					);
					if (valueLength === 3) {
						// For multi-byte values, we need to emit the second byte.
						this.emitCodePoint(decodeTree[result + 2], consumed);
					}
					return consumed;
				}
				/**
				 * Signal to the parser that the end of the input was reached.
				 *
				 * Remaining data will be emitted and relevant errors will be produced.
				 *
				 * @returns The number of characters consumed.
				 */
				end() {
					var _a;
					switch (this.state) {
						case EntityDecoderState.NamedEntity: {
							// Emit a named entity if we have one.
							return this.result !== 0 &&
								(this.decodeMode !== DecodingMode.Attribute ||
									this.result === this.treeIndex)
								? this.emitNotTerminatedNamedEntity()
								: 0;
						}
						// Otherwise, emit a numeric entity if we have one.
						case EntityDecoderState.NumericDecimal: {
							return this.emitNumericEntity(0, 2);
						}
						case EntityDecoderState.NumericHex: {
							return this.emitNumericEntity(0, 3);
						}
						case EntityDecoderState.NumericStart: {
							(_a = this.errors) === null || _a === void 0
								? void 0
								: _a.absenceOfDigitsInNumericCharacterReference(
										this.consumed
									);
							return 0;
						}
						case EntityDecoderState.EntityStart: {
							// Return 0 if we have no entity.
							return 0;
						}
					}
				}
			}
			/**
			 * Creates a function that decodes entities in a string.
			 *
			 * @param decodeTree The decode tree.
			 * @returns A function that decodes entities in a string.
			 */
			function getDecoder(decodeTree) {
				let ret = '';
				const decoder = new EntityDecoder(
					decodeTree,
					str =>
						(ret += (0,
						_decode_codepoint_js__WEBPACK_IMPORTED_MODULE_2__.fromCodePoint)(
							str
						))
				);
				return function decodeWithTrie(str, decodeMode) {
					let lastIndex = 0;
					let offset = 0;
					while ((offset = str.indexOf('&', offset)) >= 0) {
						ret += str.slice(lastIndex, offset);
						decoder.startEntity(decodeMode);
						const len = decoder.write(
							str,
							// Skip the "&"
							offset + 1
						);
						if (len < 0) {
							lastIndex = offset + decoder.end();
							break;
						}
						lastIndex = offset + len;
						// If `len` is 0, skip the current `&` and continue.
						offset = len === 0 ? lastIndex + 1 : lastIndex;
					}
					const result = ret + str.slice(lastIndex);
					// Make sure we don't keep a reference to the final string.
					ret = '';
					return result;
				};
			}
			/**
			 * Determines the branch of the current node that is taken given the current
			 * character. This function is used to traverse the trie.
			 *
			 * @param decodeTree The trie.
			 * @param current The current node.
			 * @param nodeIdx The index right after the current node and its value.
			 * @param char The current character.
			 * @returns The index of the next node, or -1 if no branch is taken.
			 */
			function determineBranch(decodeTree, current, nodeIdx, char) {
				const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
				const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
				// Case 1: Single branch encoded in jump offset
				if (branchCount === 0) {
					return jumpOffset !== 0 && char === jumpOffset
						? nodeIdx
						: -1;
				}
				// Case 2: Multiple branches encoded in jump table
				if (jumpOffset) {
					const value = char - jumpOffset;
					return value < 0 || value >= branchCount
						? -1
						: decodeTree[nodeIdx + value] - 1;
				}
				// Case 3: Multiple branches encoded in dictionary
				// Binary search for the character.
				let lo = nodeIdx;
				let hi = lo + branchCount - 1;
				while (lo <= hi) {
					const mid = (lo + hi) >>> 1;
					const midVal = decodeTree[mid];
					if (midVal < char) {
						lo = mid + 1;
					} else if (midVal > char) {
						hi = mid - 1;
					} else {
						return decodeTree[mid + branchCount];
					}
				}
				return -1;
			}
			const htmlDecoder = getDecoder(
				_generated_decode_data_html_js__WEBPACK_IMPORTED_MODULE_0__[
					'default'
				]
			);
			const xmlDecoder = getDecoder(
				_generated_decode_data_xml_js__WEBPACK_IMPORTED_MODULE_1__[
					'default'
				]
			);
			/**
			 * Decodes an HTML string.
			 *
			 * @param str The string to decode.
			 * @param mode The decoding mode.
			 * @returns The decoded string.
			 */
			function decodeHTML(str, mode = DecodingMode.Legacy) {
				return htmlDecoder(str, mode);
			}
			/**
			 * Decodes an HTML string in an attribute.
			 *
			 * @param str The string to decode.
			 * @returns The decoded string.
			 */
			function decodeHTMLAttribute(str) {
				return htmlDecoder(str, DecodingMode.Attribute);
			}
			/**
			 * Decodes an HTML string, requiring all entities to be terminated by a semicolon.
			 *
			 * @param str The string to decode.
			 * @returns The decoded string.
			 */
			function decodeHTMLStrict(str) {
				return htmlDecoder(str, DecodingMode.Strict);
			}
			/**
			 * Decodes an XML string, requiring all entities to be terminated by a semicolon.
			 *
			 * @param str The string to decode.
			 * @returns The decoded string.
			 */
			function decodeXML(str) {
				return xmlDecoder(str, DecodingMode.Strict);
			}
			//# sourceMappingURL=decode.js.map
		},
		'./node_modules/entities/lib/esm/decode_codepoint.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				default: function () {
					return decodeCodePoint;
				},
				fromCodePoint: function () {
					return fromCodePoint;
				},
				replaceCodePoint: function () {
					return replaceCodePoint;
				}
			});
			// Adapted from https://github.com/mathiasbynens/he/blob/36afe179392226cf1b6ccdb16ebbb7a5a844d93a/src/he.js#L106-L134
			var _a;
			const decodeMap = new Map([
				[0, 65533],
				// C1 Unicode control character reference replacements
				[128, 8364],
				[130, 8218],
				[131, 402],
				[132, 8222],
				[133, 8230],
				[134, 8224],
				[135, 8225],
				[136, 710],
				[137, 8240],
				[138, 352],
				[139, 8249],
				[140, 338],
				[142, 381],
				[145, 8216],
				[146, 8217],
				[147, 8220],
				[148, 8221],
				[149, 8226],
				[150, 8211],
				[151, 8212],
				[152, 732],
				[153, 8482],
				[154, 353],
				[155, 8250],
				[156, 339],
				[158, 382],
				[159, 376]
			]);
			/**
			 * Polyfill for `String.fromCodePoint`. It is used to create a string from a Unicode code point.
			 */
			const fromCodePoint =
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
				(_a = String.fromCodePoint) !== null && _a !== void 0
					? _a
					: function (codePoint) {
							let output = '';
							if (codePoint > 0xffff) {
								codePoint -= 0x10000;
								output += String.fromCharCode(
									((codePoint >>> 10) & 0x3ff) | 0xd800
								);
								codePoint = 0xdc00 | (codePoint & 0x3ff);
							}
							output += String.fromCharCode(codePoint);
							return output;
						};
			/**
			 * Replace the given code point with a replacement character if it is a
			 * surrogate or is outside the valid range. Otherwise return the code
			 * point unchanged.
			 */
			function replaceCodePoint(codePoint) {
				var _a;
				if (
					(codePoint >= 0xd800 && codePoint <= 0xdfff) ||
					codePoint > 0x10ffff
				) {
					return 0xfffd;
				}
				return (_a = decodeMap.get(codePoint)) !== null && _a !== void 0
					? _a
					: codePoint;
			}
			/**
			 * Replace the code point if relevant, then convert it to a string.
			 *
			 * @deprecated Use `fromCodePoint(replaceCodePoint(codePoint))` instead.
			 * @param codePoint The code point to decode.
			 * @returns The decoded code point.
			 */
			function decodeCodePoint(codePoint) {
				return fromCodePoint(replaceCodePoint(codePoint));
			}
			//# sourceMappingURL=decode_codepoint.js.map
		},
		'./node_modules/entities/lib/esm/encode.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				encodeHTML: function () {
					return encodeHTML;
				},
				encodeNonAsciiHTML: function () {
					return encodeNonAsciiHTML;
				}
			});
			/* harmony import */ var _generated_encode_html_js__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! ./generated/encode-html.js */ './node_modules/entities/lib/esm/generated/encode-html.js'
				);
			/* harmony import */ var _escape_js__WEBPACK_IMPORTED_MODULE_1__ =
				__webpack_require__(
					/*! ./escape.js */ './node_modules/entities/lib/esm/escape.js'
				);

			const htmlReplacer = /[\t\n!-,./:-@[-`\f{-}$\x80-\uFFFF]/g;
			/**
			 * Encodes all characters in the input using HTML entities. This includes
			 * characters that are valid ASCII characters in HTML documents, such as `#`.
			 *
			 * To get a more compact output, consider using the `encodeNonAsciiHTML`
			 * function, which will only encode characters that are not valid in HTML
			 * documents, as well as non-ASCII characters.
			 *
			 * If a character has no equivalent entity, a numeric hexadecimal reference
			 * (eg. `&#xfc;`) will be used.
			 */
			function encodeHTML(data) {
				return encodeHTMLTrieRe(htmlReplacer, data);
			}
			/**
			 * Encodes all non-ASCII characters, as well as characters not valid in HTML
			 * documents using HTML entities. This function will not encode characters that
			 * are valid in HTML documents, such as `#`.
			 *
			 * If a character has no equivalent entity, a numeric hexadecimal reference
			 * (eg. `&#xfc;`) will be used.
			 */
			function encodeNonAsciiHTML(data) {
				return encodeHTMLTrieRe(
					_escape_js__WEBPACK_IMPORTED_MODULE_1__.xmlReplacer,
					data
				);
			}
			function encodeHTMLTrieRe(regExp, str) {
				let ret = '';
				let lastIdx = 0;
				let match;
				while ((match = regExp.exec(str)) !== null) {
					const i = match.index;
					ret += str.substring(lastIdx, i);
					const char = str.charCodeAt(i);
					let next =
						_generated_encode_html_js__WEBPACK_IMPORTED_MODULE_0__[
							'default'
						].get(char);
					if (typeof next === 'object') {
						// We are in a branch. Try to match the next char.
						if (i + 1 < str.length) {
							const nextChar = str.charCodeAt(i + 1);
							const value =
								typeof next.n === 'number'
									? next.n === nextChar
										? next.o
										: undefined
									: next.n.get(nextChar);
							if (value !== undefined) {
								ret += value;
								lastIdx = regExp.lastIndex += 1;
								continue;
							}
						}
						next = next.v;
					}
					// We might have a tree node without a value; skip and use a numeric entity.
					if (next !== undefined) {
						ret += next;
						lastIdx = i + 1;
					} else {
						const cp = (0,
						_escape_js__WEBPACK_IMPORTED_MODULE_1__.getCodePoint)(
							str,
							i
						);
						ret += `&#x${cp.toString(16)};`;
						// Increase by 1 if we have a surrogate pair
						lastIdx = regExp.lastIndex += Number(cp !== char);
					}
				}
				return ret + str.substr(lastIdx);
			}
			//# sourceMappingURL=encode.js.map
		},
		'./node_modules/entities/lib/esm/escape.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				encodeXML: function () {
					return encodeXML;
				},
				escape: function () {
					return escape;
				},
				escapeAttribute: function () {
					return escapeAttribute;
				},
				escapeText: function () {
					return escapeText;
				},
				escapeUTF8: function () {
					return escapeUTF8;
				},
				getCodePoint: function () {
					return getCodePoint;
				},
				xmlReplacer: function () {
					return xmlReplacer;
				}
			});
			const xmlReplacer = /["&'<>$\x80-\uFFFF]/g;
			const xmlCodeMap = new Map([
				[34, '&quot;'],
				[38, '&amp;'],
				[39, '&apos;'],
				[60, '&lt;'],
				[62, '&gt;']
			]);
			// For compatibility with node < 4, we wrap `codePointAt`
			const getCodePoint =
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				String.prototype.codePointAt != null
					? (str, index) => str.codePointAt(index)
					: // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
						(c, index) =>
							(c.charCodeAt(index) & 0xfc00) === 0xd800
								? (c.charCodeAt(index) - 0xd800) * 0x400 +
									c.charCodeAt(index + 1) -
									0xdc00 +
									0x10000
								: c.charCodeAt(index);
			/**
			 * Encodes all non-ASCII characters, as well as characters not valid in XML
			 * documents using XML entities.
			 *
			 * If a character has no equivalent entity, a
			 * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
			 */
			function encodeXML(str) {
				let ret = '';
				let lastIdx = 0;
				let match;
				while ((match = xmlReplacer.exec(str)) !== null) {
					const i = match.index;
					const char = str.charCodeAt(i);
					const next = xmlCodeMap.get(char);
					if (next !== undefined) {
						ret += str.substring(lastIdx, i) + next;
						lastIdx = i + 1;
					} else {
						ret += `${str.substring(lastIdx, i)}&#x${getCodePoint(str, i).toString(16)};`;
						// Increase by 1 if we have a surrogate pair
						lastIdx = xmlReplacer.lastIndex += Number(
							(char & 0xfc00) === 0xd800
						);
					}
				}
				return ret + str.substr(lastIdx);
			}
			/**
			 * Encodes all non-ASCII characters, as well as characters not valid in XML
			 * documents using numeric hexadecimal reference (eg. `&#xfc;`).
			 *
			 * Have a look at `escapeUTF8` if you want a more concise output at the expense
			 * of reduced transportability.
			 *
			 * @param data String to escape.
			 */
			const escape = encodeXML;
			/**
			 * Creates a function that escapes all characters matched by the given regular
			 * expression using the given map of characters to escape to their entities.
			 *
			 * @param regex Regular expression to match characters to escape.
			 * @param map Map of characters to escape to their entities.
			 *
			 * @returns Function that escapes all characters matched by the given regular
			 * expression using the given map of characters to escape to their entities.
			 */
			function getEscaper(regex, map) {
				return function escape(data) {
					let match;
					let lastIdx = 0;
					let result = '';
					while ((match = regex.exec(data))) {
						if (lastIdx !== match.index) {
							result += data.substring(lastIdx, match.index);
						}
						// We know that this character will be in the map.
						result += map.get(match[0].charCodeAt(0));
						// Every match will be of length 1
						lastIdx = match.index + 1;
					}
					return result + data.substring(lastIdx);
				};
			}
			/**
			 * Encodes all characters not valid in XML documents using XML entities.
			 *
			 * Note that the output will be character-set dependent.
			 *
			 * @param data String to escape.
			 */
			const escapeUTF8 = getEscaper(/[&<>'"]/g, xmlCodeMap);
			/**
			 * Encodes all characters that have to be escaped in HTML attributes,
			 * following {@link https://html.spec.whatwg.org/multipage/parsing.html#escapingString}.
			 *
			 * @param data String to escape.
			 */
			const escapeAttribute = getEscaper(
				/["&\u00A0]/g,
				new Map([
					[34, '&quot;'],
					[38, '&amp;'],
					[160, '&nbsp;']
				])
			);
			/**
			 * Encodes all characters that have to be escaped in HTML text,
			 * following {@link https://html.spec.whatwg.org/multipage/parsing.html#escapingString}.
			 *
			 * @param data String to escape.
			 */
			const escapeText = getEscaper(
				/[&<>\u00A0]/g,
				new Map([
					[38, '&amp;'],
					[60, '&lt;'],
					[62, '&gt;'],
					[160, '&nbsp;']
				])
			);
			//# sourceMappingURL=escape.js.map
		},
		'./node_modules/entities/lib/esm/generated/decode-data-html.js':
			function (
				__unused_webpack___webpack_module__,
				__webpack_exports__,
				__webpack_require__
			) {
				__webpack_require__.r(__webpack_exports__);
				// Generated using scripts/write-decode-map.ts
				/* harmony default export */ __webpack_exports__['default'] =
					new Uint16Array(
						// prettier-ignore
						"\u1d41<\xd5\u0131\u028a\u049d\u057b\u05d0\u0675\u06de\u07a2\u07d6\u080f\u0a4a\u0a91\u0da1\u0e6d\u0f09\u0f26\u10ca\u1228\u12e1\u1415\u149d\u14c3\u14df\u1525\0\0\0\0\0\0\u156b\u16cd\u198d\u1c12\u1ddd\u1f7e\u2060\u21b0\u228d\u23c0\u23fb\u2442\u2824\u2912\u2d08\u2e48\u2fce\u3016\u32ba\u3639\u37ac\u38fe\u3a28\u3a71\u3ae0\u3b2e\u0800EMabcfglmnoprstu\\bfms\x7f\x84\x8b\x90\x95\x98\xa6\xb3\xb9\xc8\xcflig\u803b\xc6\u40c6P\u803b&\u4026cute\u803b\xc1\u40c1reve;\u4102\u0100iyx}rc\u803b\xc2\u40c2;\u4410r;\uc000\ud835\udd04rave\u803b\xc0\u40c0pha;\u4391acr;\u4100d;\u6a53\u0100gp\x9d\xa1on;\u4104f;\uc000\ud835\udd38plyFunction;\u6061ing\u803b\xc5\u40c5\u0100cs\xbe\xc3r;\uc000\ud835\udc9cign;\u6254ilde\u803b\xc3\u40c3ml\u803b\xc4\u40c4\u0400aceforsu\xe5\xfb\xfe\u0117\u011c\u0122\u0127\u012a\u0100cr\xea\xf2kslash;\u6216\u0176\xf6\xf8;\u6ae7ed;\u6306y;\u4411\u0180crt\u0105\u010b\u0114ause;\u6235noullis;\u612ca;\u4392r;\uc000\ud835\udd05pf;\uc000\ud835\udd39eve;\u42d8c\xf2\u0113mpeq;\u624e\u0700HOacdefhilorsu\u014d\u0151\u0156\u0180\u019e\u01a2\u01b5\u01b7\u01ba\u01dc\u0215\u0273\u0278\u027ecy;\u4427PY\u803b\xa9\u40a9\u0180cpy\u015d\u0162\u017aute;\u4106\u0100;i\u0167\u0168\u62d2talDifferentialD;\u6145leys;\u612d\u0200aeio\u0189\u018e\u0194\u0198ron;\u410cdil\u803b\xc7\u40c7rc;\u4108nint;\u6230ot;\u410a\u0100dn\u01a7\u01adilla;\u40b8terDot;\u40b7\xf2\u017fi;\u43a7rcle\u0200DMPT\u01c7\u01cb\u01d1\u01d6ot;\u6299inus;\u6296lus;\u6295imes;\u6297o\u0100cs\u01e2\u01f8kwiseContourIntegral;\u6232eCurly\u0100DQ\u0203\u020foubleQuote;\u601duote;\u6019\u0200lnpu\u021e\u0228\u0247\u0255on\u0100;e\u0225\u0226\u6237;\u6a74\u0180git\u022f\u0236\u023aruent;\u6261nt;\u622fourIntegral;\u622e\u0100fr\u024c\u024e;\u6102oduct;\u6210nterClockwiseContourIntegral;\u6233oss;\u6a2fcr;\uc000\ud835\udc9ep\u0100;C\u0284\u0285\u62d3ap;\u624d\u0580DJSZacefios\u02a0\u02ac\u02b0\u02b4\u02b8\u02cb\u02d7\u02e1\u02e6\u0333\u048d\u0100;o\u0179\u02a5trahd;\u6911cy;\u4402cy;\u4405cy;\u440f\u0180grs\u02bf\u02c4\u02c7ger;\u6021r;\u61a1hv;\u6ae4\u0100ay\u02d0\u02d5ron;\u410e;\u4414l\u0100;t\u02dd\u02de\u6207a;\u4394r;\uc000\ud835\udd07\u0100af\u02eb\u0327\u0100cm\u02f0\u0322ritical\u0200ADGT\u0300\u0306\u0316\u031ccute;\u40b4o\u0174\u030b\u030d;\u42d9bleAcute;\u42ddrave;\u4060ilde;\u42dcond;\u62c4ferentialD;\u6146\u0470\u033d\0\0\0\u0342\u0354\0\u0405f;\uc000\ud835\udd3b\u0180;DE\u0348\u0349\u034d\u40a8ot;\u60dcqual;\u6250ble\u0300CDLRUV\u0363\u0372\u0382\u03cf\u03e2\u03f8ontourIntegra\xec\u0239o\u0274\u0379\0\0\u037b\xbb\u0349nArrow;\u61d3\u0100eo\u0387\u03a4ft\u0180ART\u0390\u0396\u03a1rrow;\u61d0ightArrow;\u61d4e\xe5\u02cang\u0100LR\u03ab\u03c4eft\u0100AR\u03b3\u03b9rrow;\u67f8ightArrow;\u67faightArrow;\u67f9ight\u0100AT\u03d8\u03derrow;\u61d2ee;\u62a8p\u0241\u03e9\0\0\u03efrrow;\u61d1ownArrow;\u61d5erticalBar;\u6225n\u0300ABLRTa\u0412\u042a\u0430\u045e\u047f\u037crrow\u0180;BU\u041d\u041e\u0422\u6193ar;\u6913pArrow;\u61f5reve;\u4311eft\u02d2\u043a\0\u0446\0\u0450ightVector;\u6950eeVector;\u695eector\u0100;B\u0459\u045a\u61bdar;\u6956ight\u01d4\u0467\0\u0471eeVector;\u695fector\u0100;B\u047a\u047b\u61c1ar;\u6957ee\u0100;A\u0486\u0487\u62a4rrow;\u61a7\u0100ct\u0492\u0497r;\uc000\ud835\udc9frok;\u4110\u0800NTacdfglmopqstux\u04bd\u04c0\u04c4\u04cb\u04de\u04e2\u04e7\u04ee\u04f5\u0521\u052f\u0536\u0552\u055d\u0560\u0565G;\u414aH\u803b\xd0\u40d0cute\u803b\xc9\u40c9\u0180aiy\u04d2\u04d7\u04dcron;\u411arc\u803b\xca\u40ca;\u442dot;\u4116r;\uc000\ud835\udd08rave\u803b\xc8\u40c8ement;\u6208\u0100ap\u04fa\u04fecr;\u4112ty\u0253\u0506\0\0\u0512mallSquare;\u65fberySmallSquare;\u65ab\u0100gp\u0526\u052aon;\u4118f;\uc000\ud835\udd3csilon;\u4395u\u0100ai\u053c\u0549l\u0100;T\u0542\u0543\u6a75ilde;\u6242librium;\u61cc\u0100ci\u0557\u055ar;\u6130m;\u6a73a;\u4397ml\u803b\xcb\u40cb\u0100ip\u056a\u056fsts;\u6203onentialE;\u6147\u0280cfios\u0585\u0588\u058d\u05b2\u05ccy;\u4424r;\uc000\ud835\udd09lled\u0253\u0597\0\0\u05a3mallSquare;\u65fcerySmallSquare;\u65aa\u0370\u05ba\0\u05bf\0\0\u05c4f;\uc000\ud835\udd3dAll;\u6200riertrf;\u6131c\xf2\u05cb\u0600JTabcdfgorst\u05e8\u05ec\u05ef\u05fa\u0600\u0612\u0616\u061b\u061d\u0623\u066c\u0672cy;\u4403\u803b>\u403emma\u0100;d\u05f7\u05f8\u4393;\u43dcreve;\u411e\u0180eiy\u0607\u060c\u0610dil;\u4122rc;\u411c;\u4413ot;\u4120r;\uc000\ud835\udd0a;\u62d9pf;\uc000\ud835\udd3eeater\u0300EFGLST\u0635\u0644\u064e\u0656\u065b\u0666qual\u0100;L\u063e\u063f\u6265ess;\u62dbullEqual;\u6267reater;\u6aa2ess;\u6277lantEqual;\u6a7eilde;\u6273cr;\uc000\ud835\udca2;\u626b\u0400Aacfiosu\u0685\u068b\u0696\u069b\u069e\u06aa\u06be\u06caRDcy;\u442a\u0100ct\u0690\u0694ek;\u42c7;\u405eirc;\u4124r;\u610clbertSpace;\u610b\u01f0\u06af\0\u06b2f;\u610dizontalLine;\u6500\u0100ct\u06c3\u06c5\xf2\u06a9rok;\u4126mp\u0144\u06d0\u06d8ownHum\xf0\u012fqual;\u624f\u0700EJOacdfgmnostu\u06fa\u06fe\u0703\u0707\u070e\u071a\u071e\u0721\u0728\u0744\u0778\u078b\u078f\u0795cy;\u4415lig;\u4132cy;\u4401cute\u803b\xcd\u40cd\u0100iy\u0713\u0718rc\u803b\xce\u40ce;\u4418ot;\u4130r;\u6111rave\u803b\xcc\u40cc\u0180;ap\u0720\u072f\u073f\u0100cg\u0734\u0737r;\u412ainaryI;\u6148lie\xf3\u03dd\u01f4\u0749\0\u0762\u0100;e\u074d\u074e\u622c\u0100gr\u0753\u0758ral;\u622bsection;\u62c2isible\u0100CT\u076c\u0772omma;\u6063imes;\u6062\u0180gpt\u077f\u0783\u0788on;\u412ef;\uc000\ud835\udd40a;\u4399cr;\u6110ilde;\u4128\u01eb\u079a\0\u079ecy;\u4406l\u803b\xcf\u40cf\u0280cfosu\u07ac\u07b7\u07bc\u07c2\u07d0\u0100iy\u07b1\u07b5rc;\u4134;\u4419r;\uc000\ud835\udd0dpf;\uc000\ud835\udd41\u01e3\u07c7\0\u07ccr;\uc000\ud835\udca5rcy;\u4408kcy;\u4404\u0380HJacfos\u07e4\u07e8\u07ec\u07f1\u07fd\u0802\u0808cy;\u4425cy;\u440cppa;\u439a\u0100ey\u07f6\u07fbdil;\u4136;\u441ar;\uc000\ud835\udd0epf;\uc000\ud835\udd42cr;\uc000\ud835\udca6\u0580JTaceflmost\u0825\u0829\u082c\u0850\u0863\u09b3\u09b8\u09c7\u09cd\u0a37\u0a47cy;\u4409\u803b<\u403c\u0280cmnpr\u0837\u083c\u0841\u0844\u084dute;\u4139bda;\u439bg;\u67ealacetrf;\u6112r;\u619e\u0180aey\u0857\u085c\u0861ron;\u413ddil;\u413b;\u441b\u0100fs\u0868\u0970t\u0500ACDFRTUVar\u087e\u08a9\u08b1\u08e0\u08e6\u08fc\u092f\u095b\u0390\u096a\u0100nr\u0883\u088fgleBracket;\u67e8row\u0180;BR\u0899\u089a\u089e\u6190ar;\u61e4ightArrow;\u61c6eiling;\u6308o\u01f5\u08b7\0\u08c3bleBracket;\u67e6n\u01d4\u08c8\0\u08d2eeVector;\u6961ector\u0100;B\u08db\u08dc\u61c3ar;\u6959loor;\u630aight\u0100AV\u08ef\u08f5rrow;\u6194ector;\u694e\u0100er\u0901\u0917e\u0180;AV\u0909\u090a\u0910\u62a3rrow;\u61a4ector;\u695aiangle\u0180;BE\u0924\u0925\u0929\u62b2ar;\u69cfqual;\u62b4p\u0180DTV\u0937\u0942\u094cownVector;\u6951eeVector;\u6960ector\u0100;B\u0956\u0957\u61bfar;\u6958ector\u0100;B\u0965\u0966\u61bcar;\u6952ight\xe1\u039cs\u0300EFGLST\u097e\u098b\u0995\u099d\u09a2\u09adqualGreater;\u62daullEqual;\u6266reater;\u6276ess;\u6aa1lantEqual;\u6a7dilde;\u6272r;\uc000\ud835\udd0f\u0100;e\u09bd\u09be\u62d8ftarrow;\u61daidot;\u413f\u0180npw\u09d4\u0a16\u0a1bg\u0200LRlr\u09de\u09f7\u0a02\u0a10eft\u0100AR\u09e6\u09ecrrow;\u67f5ightArrow;\u67f7ightArrow;\u67f6eft\u0100ar\u03b3\u0a0aight\xe1\u03bfight\xe1\u03caf;\uc000\ud835\udd43er\u0100LR\u0a22\u0a2ceftArrow;\u6199ightArrow;\u6198\u0180cht\u0a3e\u0a40\u0a42\xf2\u084c;\u61b0rok;\u4141;\u626a\u0400acefiosu\u0a5a\u0a5d\u0a60\u0a77\u0a7c\u0a85\u0a8b\u0a8ep;\u6905y;\u441c\u0100dl\u0a65\u0a6fiumSpace;\u605flintrf;\u6133r;\uc000\ud835\udd10nusPlus;\u6213pf;\uc000\ud835\udd44c\xf2\u0a76;\u439c\u0480Jacefostu\u0aa3\u0aa7\u0aad\u0ac0\u0b14\u0b19\u0d91\u0d97\u0d9ecy;\u440acute;\u4143\u0180aey\u0ab4\u0ab9\u0aberon;\u4147dil;\u4145;\u441d\u0180gsw\u0ac7\u0af0\u0b0eative\u0180MTV\u0ad3\u0adf\u0ae8ediumSpace;\u600bhi\u0100cn\u0ae6\u0ad8\xeb\u0ad9eryThi\xee\u0ad9ted\u0100GL\u0af8\u0b06reaterGreate\xf2\u0673essLes\xf3\u0a48Line;\u400ar;\uc000\ud835\udd11\u0200Bnpt\u0b22\u0b28\u0b37\u0b3areak;\u6060BreakingSpace;\u40a0f;\u6115\u0680;CDEGHLNPRSTV\u0b55\u0b56\u0b6a\u0b7c\u0ba1\u0beb\u0c04\u0c5e\u0c84\u0ca6\u0cd8\u0d61\u0d85\u6aec\u0100ou\u0b5b\u0b64ngruent;\u6262pCap;\u626doubleVerticalBar;\u6226\u0180lqx\u0b83\u0b8a\u0b9bement;\u6209ual\u0100;T\u0b92\u0b93\u6260ilde;\uc000\u2242\u0338ists;\u6204reater\u0380;EFGLST\u0bb6\u0bb7\u0bbd\u0bc9\u0bd3\u0bd8\u0be5\u626fqual;\u6271ullEqual;\uc000\u2267\u0338reater;\uc000\u226b\u0338ess;\u6279lantEqual;\uc000\u2a7e\u0338ilde;\u6275ump\u0144\u0bf2\u0bfdownHump;\uc000\u224e\u0338qual;\uc000\u224f\u0338e\u0100fs\u0c0a\u0c27tTriangle\u0180;BE\u0c1a\u0c1b\u0c21\u62eaar;\uc000\u29cf\u0338qual;\u62ecs\u0300;EGLST\u0c35\u0c36\u0c3c\u0c44\u0c4b\u0c58\u626equal;\u6270reater;\u6278ess;\uc000\u226a\u0338lantEqual;\uc000\u2a7d\u0338ilde;\u6274ested\u0100GL\u0c68\u0c79reaterGreater;\uc000\u2aa2\u0338essLess;\uc000\u2aa1\u0338recedes\u0180;ES\u0c92\u0c93\u0c9b\u6280qual;\uc000\u2aaf\u0338lantEqual;\u62e0\u0100ei\u0cab\u0cb9verseElement;\u620cghtTriangle\u0180;BE\u0ccb\u0ccc\u0cd2\u62ebar;\uc000\u29d0\u0338qual;\u62ed\u0100qu\u0cdd\u0d0cuareSu\u0100bp\u0ce8\u0cf9set\u0100;E\u0cf0\u0cf3\uc000\u228f\u0338qual;\u62e2erset\u0100;E\u0d03\u0d06\uc000\u2290\u0338qual;\u62e3\u0180bcp\u0d13\u0d24\u0d4eset\u0100;E\u0d1b\u0d1e\uc000\u2282\u20d2qual;\u6288ceeds\u0200;EST\u0d32\u0d33\u0d3b\u0d46\u6281qual;\uc000\u2ab0\u0338lantEqual;\u62e1ilde;\uc000\u227f\u0338erset\u0100;E\u0d58\u0d5b\uc000\u2283\u20d2qual;\u6289ilde\u0200;EFT\u0d6e\u0d6f\u0d75\u0d7f\u6241qual;\u6244ullEqual;\u6247ilde;\u6249erticalBar;\u6224cr;\uc000\ud835\udca9ilde\u803b\xd1\u40d1;\u439d\u0700Eacdfgmoprstuv\u0dbd\u0dc2\u0dc9\u0dd5\u0ddb\u0de0\u0de7\u0dfc\u0e02\u0e20\u0e22\u0e32\u0e3f\u0e44lig;\u4152cute\u803b\xd3\u40d3\u0100iy\u0dce\u0dd3rc\u803b\xd4\u40d4;\u441eblac;\u4150r;\uc000\ud835\udd12rave\u803b\xd2\u40d2\u0180aei\u0dee\u0df2\u0df6cr;\u414cga;\u43a9cron;\u439fpf;\uc000\ud835\udd46enCurly\u0100DQ\u0e0e\u0e1aoubleQuote;\u601cuote;\u6018;\u6a54\u0100cl\u0e27\u0e2cr;\uc000\ud835\udcaaash\u803b\xd8\u40d8i\u016c\u0e37\u0e3cde\u803b\xd5\u40d5es;\u6a37ml\u803b\xd6\u40d6er\u0100BP\u0e4b\u0e60\u0100ar\u0e50\u0e53r;\u603eac\u0100ek\u0e5a\u0e5c;\u63deet;\u63b4arenthesis;\u63dc\u0480acfhilors\u0e7f\u0e87\u0e8a\u0e8f\u0e92\u0e94\u0e9d\u0eb0\u0efcrtialD;\u6202y;\u441fr;\uc000\ud835\udd13i;\u43a6;\u43a0usMinus;\u40b1\u0100ip\u0ea2\u0eadncareplan\xe5\u069df;\u6119\u0200;eio\u0eb9\u0eba\u0ee0\u0ee4\u6abbcedes\u0200;EST\u0ec8\u0ec9\u0ecf\u0eda\u627aqual;\u6aaflantEqual;\u627cilde;\u627eme;\u6033\u0100dp\u0ee9\u0eeeuct;\u620fortion\u0100;a\u0225\u0ef9l;\u621d\u0100ci\u0f01\u0f06r;\uc000\ud835\udcab;\u43a8\u0200Ufos\u0f11\u0f16\u0f1b\u0f1fOT\u803b\"\u4022r;\uc000\ud835\udd14pf;\u611acr;\uc000\ud835\udcac\u0600BEacefhiorsu\u0f3e\u0f43\u0f47\u0f60\u0f73\u0fa7\u0faa\u0fad\u1096\u10a9\u10b4\u10bearr;\u6910G\u803b\xae\u40ae\u0180cnr\u0f4e\u0f53\u0f56ute;\u4154g;\u67ebr\u0100;t\u0f5c\u0f5d\u61a0l;\u6916\u0180aey\u0f67\u0f6c\u0f71ron;\u4158dil;\u4156;\u4420\u0100;v\u0f78\u0f79\u611cerse\u0100EU\u0f82\u0f99\u0100lq\u0f87\u0f8eement;\u620builibrium;\u61cbpEquilibrium;\u696fr\xbb\u0f79o;\u43a1ght\u0400ACDFTUVa\u0fc1\u0feb\u0ff3\u1022\u1028\u105b\u1087\u03d8\u0100nr\u0fc6\u0fd2gleBracket;\u67e9row\u0180;BL\u0fdc\u0fdd\u0fe1\u6192ar;\u61e5eftArrow;\u61c4eiling;\u6309o\u01f5\u0ff9\0\u1005bleBracket;\u67e7n\u01d4\u100a\0\u1014eeVector;\u695dector\u0100;B\u101d\u101e\u61c2ar;\u6955loor;\u630b\u0100er\u102d\u1043e\u0180;AV\u1035\u1036\u103c\u62a2rrow;\u61a6ector;\u695biangle\u0180;BE\u1050\u1051\u1055\u62b3ar;\u69d0qual;\u62b5p\u0180DTV\u1063\u106e\u1078ownVector;\u694feeVector;\u695cector\u0100;B\u1082\u1083\u61bear;\u6954ector\u0100;B\u1091\u1092\u61c0ar;\u6953\u0100pu\u109b\u109ef;\u611dndImplies;\u6970ightarrow;\u61db\u0100ch\u10b9\u10bcr;\u611b;\u61b1leDelayed;\u69f4\u0680HOacfhimoqstu\u10e4\u10f1\u10f7\u10fd\u1119\u111e\u1151\u1156\u1161\u1167\u11b5\u11bb\u11bf\u0100Cc\u10e9\u10eeHcy;\u4429y;\u4428FTcy;\u442ccute;\u415a\u0280;aeiy\u1108\u1109\u110e\u1113\u1117\u6abcron;\u4160dil;\u415erc;\u415c;\u4421r;\uc000\ud835\udd16ort\u0200DLRU\u112a\u1134\u113e\u1149ownArrow\xbb\u041eeftArrow\xbb\u089aightArrow\xbb\u0fddpArrow;\u6191gma;\u43a3allCircle;\u6218pf;\uc000\ud835\udd4a\u0272\u116d\0\0\u1170t;\u621aare\u0200;ISU\u117b\u117c\u1189\u11af\u65a1ntersection;\u6293u\u0100bp\u118f\u119eset\u0100;E\u1197\u1198\u628fqual;\u6291erset\u0100;E\u11a8\u11a9\u6290qual;\u6292nion;\u6294cr;\uc000\ud835\udcaear;\u62c6\u0200bcmp\u11c8\u11db\u1209\u120b\u0100;s\u11cd\u11ce\u62d0et\u0100;E\u11cd\u11d5qual;\u6286\u0100ch\u11e0\u1205eeds\u0200;EST\u11ed\u11ee\u11f4\u11ff\u627bqual;\u6ab0lantEqual;\u627dilde;\u627fTh\xe1\u0f8c;\u6211\u0180;es\u1212\u1213\u1223\u62d1rset\u0100;E\u121c\u121d\u6283qual;\u6287et\xbb\u1213\u0580HRSacfhiors\u123e\u1244\u1249\u1255\u125e\u1271\u1276\u129f\u12c2\u12c8\u12d1ORN\u803b\xde\u40deADE;\u6122\u0100Hc\u124e\u1252cy;\u440by;\u4426\u0100bu\u125a\u125c;\u4009;\u43a4\u0180aey\u1265\u126a\u126fron;\u4164dil;\u4162;\u4422r;\uc000\ud835\udd17\u0100ei\u127b\u1289\u01f2\u1280\0\u1287efore;\u6234a;\u4398\u0100cn\u128e\u1298kSpace;\uc000\u205f\u200aSpace;\u6009lde\u0200;EFT\u12ab\u12ac\u12b2\u12bc\u623cqual;\u6243ullEqual;\u6245ilde;\u6248pf;\uc000\ud835\udd4bipleDot;\u60db\u0100ct\u12d6\u12dbr;\uc000\ud835\udcafrok;\u4166\u0ae1\u12f7\u130e\u131a\u1326\0\u132c\u1331\0\0\0\0\0\u1338\u133d\u1377\u1385\0\u13ff\u1404\u140a\u1410\u0100cr\u12fb\u1301ute\u803b\xda\u40dar\u0100;o\u1307\u1308\u619fcir;\u6949r\u01e3\u1313\0\u1316y;\u440eve;\u416c\u0100iy\u131e\u1323rc\u803b\xdb\u40db;\u4423blac;\u4170r;\uc000\ud835\udd18rave\u803b\xd9\u40d9acr;\u416a\u0100di\u1341\u1369er\u0100BP\u1348\u135d\u0100ar\u134d\u1350r;\u405fac\u0100ek\u1357\u1359;\u63dfet;\u63b5arenthesis;\u63ddon\u0100;P\u1370\u1371\u62c3lus;\u628e\u0100gp\u137b\u137fon;\u4172f;\uc000\ud835\udd4c\u0400ADETadps\u1395\u13ae\u13b8\u13c4\u03e8\u13d2\u13d7\u13f3rrow\u0180;BD\u1150\u13a0\u13a4ar;\u6912ownArrow;\u61c5ownArrow;\u6195quilibrium;\u696eee\u0100;A\u13cb\u13cc\u62a5rrow;\u61a5own\xe1\u03f3er\u0100LR\u13de\u13e8eftArrow;\u6196ightArrow;\u6197i\u0100;l\u13f9\u13fa\u43d2on;\u43a5ing;\u416ecr;\uc000\ud835\udcb0ilde;\u4168ml\u803b\xdc\u40dc\u0480Dbcdefosv\u1427\u142c\u1430\u1433\u143e\u1485\u148a\u1490\u1496ash;\u62abar;\u6aeby;\u4412ash\u0100;l\u143b\u143c\u62a9;\u6ae6\u0100er\u1443\u1445;\u62c1\u0180bty\u144c\u1450\u147aar;\u6016\u0100;i\u144f\u1455cal\u0200BLST\u1461\u1465\u146a\u1474ar;\u6223ine;\u407ceparator;\u6758ilde;\u6240ThinSpace;\u600ar;\uc000\ud835\udd19pf;\uc000\ud835\udd4dcr;\uc000\ud835\udcb1dash;\u62aa\u0280cefos\u14a7\u14ac\u14b1\u14b6\u14bcirc;\u4174dge;\u62c0r;\uc000\ud835\udd1apf;\uc000\ud835\udd4ecr;\uc000\ud835\udcb2\u0200fios\u14cb\u14d0\u14d2\u14d8r;\uc000\ud835\udd1b;\u439epf;\uc000\ud835\udd4fcr;\uc000\ud835\udcb3\u0480AIUacfosu\u14f1\u14f5\u14f9\u14fd\u1504\u150f\u1514\u151a\u1520cy;\u442fcy;\u4407cy;\u442ecute\u803b\xdd\u40dd\u0100iy\u1509\u150drc;\u4176;\u442br;\uc000\ud835\udd1cpf;\uc000\ud835\udd50cr;\uc000\ud835\udcb4ml;\u4178\u0400Hacdefos\u1535\u1539\u153f\u154b\u154f\u155d\u1560\u1564cy;\u4416cute;\u4179\u0100ay\u1544\u1549ron;\u417d;\u4417ot;\u417b\u01f2\u1554\0\u155boWidt\xe8\u0ad9a;\u4396r;\u6128pf;\u6124cr;\uc000\ud835\udcb5\u0be1\u1583\u158a\u1590\0\u15b0\u15b6\u15bf\0\0\0\0\u15c6\u15db\u15eb\u165f\u166d\0\u1695\u169b\u16b2\u16b9\0\u16becute\u803b\xe1\u40e1reve;\u4103\u0300;Ediuy\u159c\u159d\u15a1\u15a3\u15a8\u15ad\u623e;\uc000\u223e\u0333;\u623frc\u803b\xe2\u40e2te\u80bb\xb4\u0306;\u4430lig\u803b\xe6\u40e6\u0100;r\xb2\u15ba;\uc000\ud835\udd1erave\u803b\xe0\u40e0\u0100ep\u15ca\u15d6\u0100fp\u15cf\u15d4sym;\u6135\xe8\u15d3ha;\u43b1\u0100ap\u15dfc\u0100cl\u15e4\u15e7r;\u4101g;\u6a3f\u0264\u15f0\0\0\u160a\u0280;adsv\u15fa\u15fb\u15ff\u1601\u1607\u6227nd;\u6a55;\u6a5clope;\u6a58;\u6a5a\u0380;elmrsz\u1618\u1619\u161b\u161e\u163f\u164f\u1659\u6220;\u69a4e\xbb\u1619sd\u0100;a\u1625\u1626\u6221\u0461\u1630\u1632\u1634\u1636\u1638\u163a\u163c\u163e;\u69a8;\u69a9;\u69aa;\u69ab;\u69ac;\u69ad;\u69ae;\u69aft\u0100;v\u1645\u1646\u621fb\u0100;d\u164c\u164d\u62be;\u699d\u0100pt\u1654\u1657h;\u6222\xbb\xb9arr;\u637c\u0100gp\u1663\u1667on;\u4105f;\uc000\ud835\udd52\u0380;Eaeiop\u12c1\u167b\u167d\u1682\u1684\u1687\u168a;\u6a70cir;\u6a6f;\u624ad;\u624bs;\u4027rox\u0100;e\u12c1\u1692\xf1\u1683ing\u803b\xe5\u40e5\u0180cty\u16a1\u16a6\u16a8r;\uc000\ud835\udcb6;\u402amp\u0100;e\u12c1\u16af\xf1\u0288ilde\u803b\xe3\u40e3ml\u803b\xe4\u40e4\u0100ci\u16c2\u16c8onin\xf4\u0272nt;\u6a11\u0800Nabcdefiklnoprsu\u16ed\u16f1\u1730\u173c\u1743\u1748\u1778\u177d\u17e0\u17e6\u1839\u1850\u170d\u193d\u1948\u1970ot;\u6aed\u0100cr\u16f6\u171ek\u0200ceps\u1700\u1705\u170d\u1713ong;\u624cpsilon;\u43f6rime;\u6035im\u0100;e\u171a\u171b\u623dq;\u62cd\u0176\u1722\u1726ee;\u62bded\u0100;g\u172c\u172d\u6305e\xbb\u172drk\u0100;t\u135c\u1737brk;\u63b6\u0100oy\u1701\u1741;\u4431quo;\u601e\u0280cmprt\u1753\u175b\u1761\u1764\u1768aus\u0100;e\u010a\u0109ptyv;\u69b0s\xe9\u170cno\xf5\u0113\u0180ahw\u176f\u1771\u1773;\u43b2;\u6136een;\u626cr;\uc000\ud835\udd1fg\u0380costuvw\u178d\u179d\u17b3\u17c1\u17d5\u17db\u17de\u0180aiu\u1794\u1796\u179a\xf0\u0760rc;\u65efp\xbb\u1371\u0180dpt\u17a4\u17a8\u17adot;\u6a00lus;\u6a01imes;\u6a02\u0271\u17b9\0\0\u17becup;\u6a06ar;\u6605riangle\u0100du\u17cd\u17d2own;\u65bdp;\u65b3plus;\u6a04e\xe5\u1444\xe5\u14adarow;\u690d\u0180ako\u17ed\u1826\u1835\u0100cn\u17f2\u1823k\u0180lst\u17fa\u05ab\u1802ozenge;\u69ebriangle\u0200;dlr\u1812\u1813\u1818\u181d\u65b4own;\u65beeft;\u65c2ight;\u65b8k;\u6423\u01b1\u182b\0\u1833\u01b2\u182f\0\u1831;\u6592;\u65914;\u6593ck;\u6588\u0100eo\u183e\u184d\u0100;q\u1843\u1846\uc000=\u20e5uiv;\uc000\u2261\u20e5t;\u6310\u0200ptwx\u1859\u185e\u1867\u186cf;\uc000\ud835\udd53\u0100;t\u13cb\u1863om\xbb\u13cctie;\u62c8\u0600DHUVbdhmptuv\u1885\u1896\u18aa\u18bb\u18d7\u18db\u18ec\u18ff\u1905\u190a\u1910\u1921\u0200LRlr\u188e\u1890\u1892\u1894;\u6557;\u6554;\u6556;\u6553\u0280;DUdu\u18a1\u18a2\u18a4\u18a6\u18a8\u6550;\u6566;\u6569;\u6564;\u6567\u0200LRlr\u18b3\u18b5\u18b7\u18b9;\u655d;\u655a;\u655c;\u6559\u0380;HLRhlr\u18ca\u18cb\u18cd\u18cf\u18d1\u18d3\u18d5\u6551;\u656c;\u6563;\u6560;\u656b;\u6562;\u655fox;\u69c9\u0200LRlr\u18e4\u18e6\u18e8\u18ea;\u6555;\u6552;\u6510;\u650c\u0280;DUdu\u06bd\u18f7\u18f9\u18fb\u18fd;\u6565;\u6568;\u652c;\u6534inus;\u629flus;\u629eimes;\u62a0\u0200LRlr\u1919\u191b\u191d\u191f;\u655b;\u6558;\u6518;\u6514\u0380;HLRhlr\u1930\u1931\u1933\u1935\u1937\u1939\u193b\u6502;\u656a;\u6561;\u655e;\u653c;\u6524;\u651c\u0100ev\u0123\u1942bar\u803b\xa6\u40a6\u0200ceio\u1951\u1956\u195a\u1960r;\uc000\ud835\udcb7mi;\u604fm\u0100;e\u171a\u171cl\u0180;bh\u1968\u1969\u196b\u405c;\u69c5sub;\u67c8\u016c\u1974\u197el\u0100;e\u1979\u197a\u6022t\xbb\u197ap\u0180;Ee\u012f\u1985\u1987;\u6aae\u0100;q\u06dc\u06db\u0ce1\u19a7\0\u19e8\u1a11\u1a15\u1a32\0\u1a37\u1a50\0\0\u1ab4\0\0\u1ac1\0\0\u1b21\u1b2e\u1b4d\u1b52\0\u1bfd\0\u1c0c\u0180cpr\u19ad\u19b2\u19ddute;\u4107\u0300;abcds\u19bf\u19c0\u19c4\u19ca\u19d5\u19d9\u6229nd;\u6a44rcup;\u6a49\u0100au\u19cf\u19d2p;\u6a4bp;\u6a47ot;\u6a40;\uc000\u2229\ufe00\u0100eo\u19e2\u19e5t;\u6041\xee\u0693\u0200aeiu\u19f0\u19fb\u1a01\u1a05\u01f0\u19f5\0\u19f8s;\u6a4don;\u410ddil\u803b\xe7\u40e7rc;\u4109ps\u0100;s\u1a0c\u1a0d\u6a4cm;\u6a50ot;\u410b\u0180dmn\u1a1b\u1a20\u1a26il\u80bb\xb8\u01adptyv;\u69b2t\u8100\xa2;e\u1a2d\u1a2e\u40a2r\xe4\u01b2r;\uc000\ud835\udd20\u0180cei\u1a3d\u1a40\u1a4dy;\u4447ck\u0100;m\u1a47\u1a48\u6713ark\xbb\u1a48;\u43c7r\u0380;Ecefms\u1a5f\u1a60\u1a62\u1a6b\u1aa4\u1aaa\u1aae\u65cb;\u69c3\u0180;el\u1a69\u1a6a\u1a6d\u42c6q;\u6257e\u0261\u1a74\0\0\u1a88rrow\u0100lr\u1a7c\u1a81eft;\u61baight;\u61bb\u0280RSacd\u1a92\u1a94\u1a96\u1a9a\u1a9f\xbb\u0f47;\u64c8st;\u629birc;\u629aash;\u629dnint;\u6a10id;\u6aefcir;\u69c2ubs\u0100;u\u1abb\u1abc\u6663it\xbb\u1abc\u02ec\u1ac7\u1ad4\u1afa\0\u1b0aon\u0100;e\u1acd\u1ace\u403a\u0100;q\xc7\xc6\u026d\u1ad9\0\0\u1ae2a\u0100;t\u1ade\u1adf\u402c;\u4040\u0180;fl\u1ae8\u1ae9\u1aeb\u6201\xee\u1160e\u0100mx\u1af1\u1af6ent\xbb\u1ae9e\xf3\u024d\u01e7\u1afe\0\u1b07\u0100;d\u12bb\u1b02ot;\u6a6dn\xf4\u0246\u0180fry\u1b10\u1b14\u1b17;\uc000\ud835\udd54o\xe4\u0254\u8100\xa9;s\u0155\u1b1dr;\u6117\u0100ao\u1b25\u1b29rr;\u61b5ss;\u6717\u0100cu\u1b32\u1b37r;\uc000\ud835\udcb8\u0100bp\u1b3c\u1b44\u0100;e\u1b41\u1b42\u6acf;\u6ad1\u0100;e\u1b49\u1b4a\u6ad0;\u6ad2dot;\u62ef\u0380delprvw\u1b60\u1b6c\u1b77\u1b82\u1bac\u1bd4\u1bf9arr\u0100lr\u1b68\u1b6a;\u6938;\u6935\u0270\u1b72\0\0\u1b75r;\u62dec;\u62dfarr\u0100;p\u1b7f\u1b80\u61b6;\u693d\u0300;bcdos\u1b8f\u1b90\u1b96\u1ba1\u1ba5\u1ba8\u622arcap;\u6a48\u0100au\u1b9b\u1b9ep;\u6a46p;\u6a4aot;\u628dr;\u6a45;\uc000\u222a\ufe00\u0200alrv\u1bb5\u1bbf\u1bde\u1be3rr\u0100;m\u1bbc\u1bbd\u61b7;\u693cy\u0180evw\u1bc7\u1bd4\u1bd8q\u0270\u1bce\0\0\u1bd2re\xe3\u1b73u\xe3\u1b75ee;\u62ceedge;\u62cfen\u803b\xa4\u40a4earrow\u0100lr\u1bee\u1bf3eft\xbb\u1b80ight\xbb\u1bbde\xe4\u1bdd\u0100ci\u1c01\u1c07onin\xf4\u01f7nt;\u6231lcty;\u632d\u0980AHabcdefhijlorstuwz\u1c38\u1c3b\u1c3f\u1c5d\u1c69\u1c75\u1c8a\u1c9e\u1cac\u1cb7\u1cfb\u1cff\u1d0d\u1d7b\u1d91\u1dab\u1dbb\u1dc6\u1dcdr\xf2\u0381ar;\u6965\u0200glrs\u1c48\u1c4d\u1c52\u1c54ger;\u6020eth;\u6138\xf2\u1133h\u0100;v\u1c5a\u1c5b\u6010\xbb\u090a\u016b\u1c61\u1c67arow;\u690fa\xe3\u0315\u0100ay\u1c6e\u1c73ron;\u410f;\u4434\u0180;ao\u0332\u1c7c\u1c84\u0100gr\u02bf\u1c81r;\u61catseq;\u6a77\u0180glm\u1c91\u1c94\u1c98\u803b\xb0\u40b0ta;\u43b4ptyv;\u69b1\u0100ir\u1ca3\u1ca8sht;\u697f;\uc000\ud835\udd21ar\u0100lr\u1cb3\u1cb5\xbb\u08dc\xbb\u101e\u0280aegsv\u1cc2\u0378\u1cd6\u1cdc\u1ce0m\u0180;os\u0326\u1cca\u1cd4nd\u0100;s\u0326\u1cd1uit;\u6666amma;\u43ddin;\u62f2\u0180;io\u1ce7\u1ce8\u1cf8\u40f7de\u8100\xf7;o\u1ce7\u1cf0ntimes;\u62c7n\xf8\u1cf7cy;\u4452c\u026f\u1d06\0\0\u1d0arn;\u631eop;\u630d\u0280lptuw\u1d18\u1d1d\u1d22\u1d49\u1d55lar;\u4024f;\uc000\ud835\udd55\u0280;emps\u030b\u1d2d\u1d37\u1d3d\u1d42q\u0100;d\u0352\u1d33ot;\u6251inus;\u6238lus;\u6214quare;\u62a1blebarwedg\xe5\xfan\u0180adh\u112e\u1d5d\u1d67ownarrow\xf3\u1c83arpoon\u0100lr\u1d72\u1d76ef\xf4\u1cb4igh\xf4\u1cb6\u0162\u1d7f\u1d85karo\xf7\u0f42\u026f\u1d8a\0\0\u1d8ern;\u631fop;\u630c\u0180cot\u1d98\u1da3\u1da6\u0100ry\u1d9d\u1da1;\uc000\ud835\udcb9;\u4455l;\u69f6rok;\u4111\u0100dr\u1db0\u1db4ot;\u62f1i\u0100;f\u1dba\u1816\u65bf\u0100ah\u1dc0\u1dc3r\xf2\u0429a\xf2\u0fa6angle;\u69a6\u0100ci\u1dd2\u1dd5y;\u445fgrarr;\u67ff\u0900Dacdefglmnopqrstux\u1e01\u1e09\u1e19\u1e38\u0578\u1e3c\u1e49\u1e61\u1e7e\u1ea5\u1eaf\u1ebd\u1ee1\u1f2a\u1f37\u1f44\u1f4e\u1f5a\u0100Do\u1e06\u1d34o\xf4\u1c89\u0100cs\u1e0e\u1e14ute\u803b\xe9\u40e9ter;\u6a6e\u0200aioy\u1e22\u1e27\u1e31\u1e36ron;\u411br\u0100;c\u1e2d\u1e2e\u6256\u803b\xea\u40ealon;\u6255;\u444dot;\u4117\u0100Dr\u1e41\u1e45ot;\u6252;\uc000\ud835\udd22\u0180;rs\u1e50\u1e51\u1e57\u6a9aave\u803b\xe8\u40e8\u0100;d\u1e5c\u1e5d\u6a96ot;\u6a98\u0200;ils\u1e6a\u1e6b\u1e72\u1e74\u6a99nters;\u63e7;\u6113\u0100;d\u1e79\u1e7a\u6a95ot;\u6a97\u0180aps\u1e85\u1e89\u1e97cr;\u4113ty\u0180;sv\u1e92\u1e93\u1e95\u6205et\xbb\u1e93p\u01001;\u1e9d\u1ea4\u0133\u1ea1\u1ea3;\u6004;\u6005\u6003\u0100gs\u1eaa\u1eac;\u414bp;\u6002\u0100gp\u1eb4\u1eb8on;\u4119f;\uc000\ud835\udd56\u0180als\u1ec4\u1ece\u1ed2r\u0100;s\u1eca\u1ecb\u62d5l;\u69e3us;\u6a71i\u0180;lv\u1eda\u1edb\u1edf\u43b5on\xbb\u1edb;\u43f5\u0200csuv\u1eea\u1ef3\u1f0b\u1f23\u0100io\u1eef\u1e31rc\xbb\u1e2e\u0269\u1ef9\0\0\u1efb\xed\u0548ant\u0100gl\u1f02\u1f06tr\xbb\u1e5dess\xbb\u1e7a\u0180aei\u1f12\u1f16\u1f1als;\u403dst;\u625fv\u0100;D\u0235\u1f20D;\u6a78parsl;\u69e5\u0100Da\u1f2f\u1f33ot;\u6253rr;\u6971\u0180cdi\u1f3e\u1f41\u1ef8r;\u612fo\xf4\u0352\u0100ah\u1f49\u1f4b;\u43b7\u803b\xf0\u40f0\u0100mr\u1f53\u1f57l\u803b\xeb\u40ebo;\u60ac\u0180cip\u1f61\u1f64\u1f67l;\u4021s\xf4\u056e\u0100eo\u1f6c\u1f74ctatio\xee\u0559nential\xe5\u0579\u09e1\u1f92\0\u1f9e\0\u1fa1\u1fa7\0\0\u1fc6\u1fcc\0\u1fd3\0\u1fe6\u1fea\u2000\0\u2008\u205allingdotse\xf1\u1e44y;\u4444male;\u6640\u0180ilr\u1fad\u1fb3\u1fc1lig;\u8000\ufb03\u0269\u1fb9\0\0\u1fbdg;\u8000\ufb00ig;\u8000\ufb04;\uc000\ud835\udd23lig;\u8000\ufb01lig;\uc000fj\u0180alt\u1fd9\u1fdc\u1fe1t;\u666dig;\u8000\ufb02ns;\u65b1of;\u4192\u01f0\u1fee\0\u1ff3f;\uc000\ud835\udd57\u0100ak\u05bf\u1ff7\u0100;v\u1ffc\u1ffd\u62d4;\u6ad9artint;\u6a0d\u0100ao\u200c\u2055\u0100cs\u2011\u2052\u03b1\u201a\u2030\u2038\u2045\u2048\0\u2050\u03b2\u2022\u2025\u2027\u202a\u202c\0\u202e\u803b\xbd\u40bd;\u6153\u803b\xbc\u40bc;\u6155;\u6159;\u615b\u01b3\u2034\0\u2036;\u6154;\u6156\u02b4\u203e\u2041\0\0\u2043\u803b\xbe\u40be;\u6157;\u615c5;\u6158\u01b6\u204c\0\u204e;\u615a;\u615d8;\u615el;\u6044wn;\u6322cr;\uc000\ud835\udcbb\u0880Eabcdefgijlnorstv\u2082\u2089\u209f\u20a5\u20b0\u20b4\u20f0\u20f5\u20fa\u20ff\u2103\u2112\u2138\u0317\u213e\u2152\u219e\u0100;l\u064d\u2087;\u6a8c\u0180cmp\u2090\u2095\u209dute;\u41f5ma\u0100;d\u209c\u1cda\u43b3;\u6a86reve;\u411f\u0100iy\u20aa\u20aerc;\u411d;\u4433ot;\u4121\u0200;lqs\u063e\u0642\u20bd\u20c9\u0180;qs\u063e\u064c\u20c4lan\xf4\u0665\u0200;cdl\u0665\u20d2\u20d5\u20e5c;\u6aa9ot\u0100;o\u20dc\u20dd\u6a80\u0100;l\u20e2\u20e3\u6a82;\u6a84\u0100;e\u20ea\u20ed\uc000\u22db\ufe00s;\u6a94r;\uc000\ud835\udd24\u0100;g\u0673\u061bmel;\u6137cy;\u4453\u0200;Eaj\u065a\u210c\u210e\u2110;\u6a92;\u6aa5;\u6aa4\u0200Eaes\u211b\u211d\u2129\u2134;\u6269p\u0100;p\u2123\u2124\u6a8arox\xbb\u2124\u0100;q\u212e\u212f\u6a88\u0100;q\u212e\u211bim;\u62e7pf;\uc000\ud835\udd58\u0100ci\u2143\u2146r;\u610am\u0180;el\u066b\u214e\u2150;\u6a8e;\u6a90\u8300>;cdlqr\u05ee\u2160\u216a\u216e\u2173\u2179\u0100ci\u2165\u2167;\u6aa7r;\u6a7aot;\u62d7Par;\u6995uest;\u6a7c\u0280adels\u2184\u216a\u2190\u0656\u219b\u01f0\u2189\0\u218epro\xf8\u209er;\u6978q\u0100lq\u063f\u2196les\xf3\u2088i\xed\u066b\u0100en\u21a3\u21adrtneqq;\uc000\u2269\ufe00\xc5\u21aa\u0500Aabcefkosy\u21c4\u21c7\u21f1\u21f5\u21fa\u2218\u221d\u222f\u2268\u227dr\xf2\u03a0\u0200ilmr\u21d0\u21d4\u21d7\u21dbrs\xf0\u1484f\xbb\u2024il\xf4\u06a9\u0100dr\u21e0\u21e4cy;\u444a\u0180;cw\u08f4\u21eb\u21efir;\u6948;\u61adar;\u610firc;\u4125\u0180alr\u2201\u220e\u2213rts\u0100;u\u2209\u220a\u6665it\xbb\u220alip;\u6026con;\u62b9r;\uc000\ud835\udd25s\u0100ew\u2223\u2229arow;\u6925arow;\u6926\u0280amopr\u223a\u223e\u2243\u225e\u2263rr;\u61fftht;\u623bk\u0100lr\u2249\u2253eftarrow;\u61a9ightarrow;\u61aaf;\uc000\ud835\udd59bar;\u6015\u0180clt\u226f\u2274\u2278r;\uc000\ud835\udcbdas\xe8\u21f4rok;\u4127\u0100bp\u2282\u2287ull;\u6043hen\xbb\u1c5b\u0ae1\u22a3\0\u22aa\0\u22b8\u22c5\u22ce\0\u22d5\u22f3\0\0\u22f8\u2322\u2367\u2362\u237f\0\u2386\u23aa\u23b4cute\u803b\xed\u40ed\u0180;iy\u0771\u22b0\u22b5rc\u803b\xee\u40ee;\u4438\u0100cx\u22bc\u22bfy;\u4435cl\u803b\xa1\u40a1\u0100fr\u039f\u22c9;\uc000\ud835\udd26rave\u803b\xec\u40ec\u0200;ino\u073e\u22dd\u22e9\u22ee\u0100in\u22e2\u22e6nt;\u6a0ct;\u622dfin;\u69dcta;\u6129lig;\u4133\u0180aop\u22fe\u231a\u231d\u0180cgt\u2305\u2308\u2317r;\u412b\u0180elp\u071f\u230f\u2313in\xe5\u078ear\xf4\u0720h;\u4131f;\u62b7ed;\u41b5\u0280;cfot\u04f4\u232c\u2331\u233d\u2341are;\u6105in\u0100;t\u2338\u2339\u621eie;\u69dddo\xf4\u2319\u0280;celp\u0757\u234c\u2350\u235b\u2361al;\u62ba\u0100gr\u2355\u2359er\xf3\u1563\xe3\u234darhk;\u6a17rod;\u6a3c\u0200cgpt\u236f\u2372\u2376\u237by;\u4451on;\u412ff;\uc000\ud835\udd5aa;\u43b9uest\u803b\xbf\u40bf\u0100ci\u238a\u238fr;\uc000\ud835\udcben\u0280;Edsv\u04f4\u239b\u239d\u23a1\u04f3;\u62f9ot;\u62f5\u0100;v\u23a6\u23a7\u62f4;\u62f3\u0100;i\u0777\u23aelde;\u4129\u01eb\u23b8\0\u23bccy;\u4456l\u803b\xef\u40ef\u0300cfmosu\u23cc\u23d7\u23dc\u23e1\u23e7\u23f5\u0100iy\u23d1\u23d5rc;\u4135;\u4439r;\uc000\ud835\udd27ath;\u4237pf;\uc000\ud835\udd5b\u01e3\u23ec\0\u23f1r;\uc000\ud835\udcbfrcy;\u4458kcy;\u4454\u0400acfghjos\u240b\u2416\u2422\u2427\u242d\u2431\u2435\u243bppa\u0100;v\u2413\u2414\u43ba;\u43f0\u0100ey\u241b\u2420dil;\u4137;\u443ar;\uc000\ud835\udd28reen;\u4138cy;\u4445cy;\u445cpf;\uc000\ud835\udd5ccr;\uc000\ud835\udcc0\u0b80ABEHabcdefghjlmnoprstuv\u2470\u2481\u2486\u248d\u2491\u250e\u253d\u255a\u2580\u264e\u265e\u2665\u2679\u267d\u269a\u26b2\u26d8\u275d\u2768\u278b\u27c0\u2801\u2812\u0180art\u2477\u247a\u247cr\xf2\u09c6\xf2\u0395ail;\u691barr;\u690e\u0100;g\u0994\u248b;\u6a8bar;\u6962\u0963\u24a5\0\u24aa\0\u24b1\0\0\0\0\0\u24b5\u24ba\0\u24c6\u24c8\u24cd\0\u24f9ute;\u413amptyv;\u69b4ra\xee\u084cbda;\u43bbg\u0180;dl\u088e\u24c1\u24c3;\u6991\xe5\u088e;\u6a85uo\u803b\xab\u40abr\u0400;bfhlpst\u0899\u24de\u24e6\u24e9\u24eb\u24ee\u24f1\u24f5\u0100;f\u089d\u24e3s;\u691fs;\u691d\xeb\u2252p;\u61abl;\u6939im;\u6973l;\u61a2\u0180;ae\u24ff\u2500\u2504\u6aabil;\u6919\u0100;s\u2509\u250a\u6aad;\uc000\u2aad\ufe00\u0180abr\u2515\u2519\u251drr;\u690crk;\u6772\u0100ak\u2522\u252cc\u0100ek\u2528\u252a;\u407b;\u405b\u0100es\u2531\u2533;\u698bl\u0100du\u2539\u253b;\u698f;\u698d\u0200aeuy\u2546\u254b\u2556\u2558ron;\u413e\u0100di\u2550\u2554il;\u413c\xec\u08b0\xe2\u2529;\u443b\u0200cqrs\u2563\u2566\u256d\u257da;\u6936uo\u0100;r\u0e19\u1746\u0100du\u2572\u2577har;\u6967shar;\u694bh;\u61b2\u0280;fgqs\u258b\u258c\u0989\u25f3\u25ff\u6264t\u0280ahlrt\u2598\u25a4\u25b7\u25c2\u25e8rrow\u0100;t\u0899\u25a1a\xe9\u24f6arpoon\u0100du\u25af\u25b4own\xbb\u045ap\xbb\u0966eftarrows;\u61c7ight\u0180ahs\u25cd\u25d6\u25derrow\u0100;s\u08f4\u08a7arpoon\xf3\u0f98quigarro\xf7\u21f0hreetimes;\u62cb\u0180;qs\u258b\u0993\u25falan\xf4\u09ac\u0280;cdgs\u09ac\u260a\u260d\u261d\u2628c;\u6aa8ot\u0100;o\u2614\u2615\u6a7f\u0100;r\u261a\u261b\u6a81;\u6a83\u0100;e\u2622\u2625\uc000\u22da\ufe00s;\u6a93\u0280adegs\u2633\u2639\u263d\u2649\u264bppro\xf8\u24c6ot;\u62d6q\u0100gq\u2643\u2645\xf4\u0989gt\xf2\u248c\xf4\u099bi\xed\u09b2\u0180ilr\u2655\u08e1\u265asht;\u697c;\uc000\ud835\udd29\u0100;E\u099c\u2663;\u6a91\u0161\u2669\u2676r\u0100du\u25b2\u266e\u0100;l\u0965\u2673;\u696alk;\u6584cy;\u4459\u0280;acht\u0a48\u2688\u268b\u2691\u2696r\xf2\u25c1orne\xf2\u1d08ard;\u696bri;\u65fa\u0100io\u269f\u26a4dot;\u4140ust\u0100;a\u26ac\u26ad\u63b0che\xbb\u26ad\u0200Eaes\u26bb\u26bd\u26c9\u26d4;\u6268p\u0100;p\u26c3\u26c4\u6a89rox\xbb\u26c4\u0100;q\u26ce\u26cf\u6a87\u0100;q\u26ce\u26bbim;\u62e6\u0400abnoptwz\u26e9\u26f4\u26f7\u271a\u272f\u2741\u2747\u2750\u0100nr\u26ee\u26f1g;\u67ecr;\u61fdr\xeb\u08c1g\u0180lmr\u26ff\u270d\u2714eft\u0100ar\u09e6\u2707ight\xe1\u09f2apsto;\u67fcight\xe1\u09fdparrow\u0100lr\u2725\u2729ef\xf4\u24edight;\u61ac\u0180afl\u2736\u2739\u273dr;\u6985;\uc000\ud835\udd5dus;\u6a2dimes;\u6a34\u0161\u274b\u274fst;\u6217\xe1\u134e\u0180;ef\u2757\u2758\u1800\u65cange\xbb\u2758ar\u0100;l\u2764\u2765\u4028t;\u6993\u0280achmt\u2773\u2776\u277c\u2785\u2787r\xf2\u08a8orne\xf2\u1d8car\u0100;d\u0f98\u2783;\u696d;\u600eri;\u62bf\u0300achiqt\u2798\u279d\u0a40\u27a2\u27ae\u27bbquo;\u6039r;\uc000\ud835\udcc1m\u0180;eg\u09b2\u27aa\u27ac;\u6a8d;\u6a8f\u0100bu\u252a\u27b3o\u0100;r\u0e1f\u27b9;\u601arok;\u4142\u8400<;cdhilqr\u082b\u27d2\u2639\u27dc\u27e0\u27e5\u27ea\u27f0\u0100ci\u27d7\u27d9;\u6aa6r;\u6a79re\xe5\u25f2mes;\u62c9arr;\u6976uest;\u6a7b\u0100Pi\u27f5\u27f9ar;\u6996\u0180;ef\u2800\u092d\u181b\u65c3r\u0100du\u2807\u280dshar;\u694ahar;\u6966\u0100en\u2817\u2821rtneqq;\uc000\u2268\ufe00\xc5\u281e\u0700Dacdefhilnopsu\u2840\u2845\u2882\u288e\u2893\u28a0\u28a5\u28a8\u28da\u28e2\u28e4\u0a83\u28f3\u2902Dot;\u623a\u0200clpr\u284e\u2852\u2863\u287dr\u803b\xaf\u40af\u0100et\u2857\u2859;\u6642\u0100;e\u285e\u285f\u6720se\xbb\u285f\u0100;s\u103b\u2868to\u0200;dlu\u103b\u2873\u2877\u287bow\xee\u048cef\xf4\u090f\xf0\u13d1ker;\u65ae\u0100oy\u2887\u288cmma;\u6a29;\u443cash;\u6014asuredangle\xbb\u1626r;\uc000\ud835\udd2ao;\u6127\u0180cdn\u28af\u28b4\u28c9ro\u803b\xb5\u40b5\u0200;acd\u1464\u28bd\u28c0\u28c4s\xf4\u16a7ir;\u6af0ot\u80bb\xb7\u01b5us\u0180;bd\u28d2\u1903\u28d3\u6212\u0100;u\u1d3c\u28d8;\u6a2a\u0163\u28de\u28e1p;\u6adb\xf2\u2212\xf0\u0a81\u0100dp\u28e9\u28eeels;\u62a7f;\uc000\ud835\udd5e\u0100ct\u28f8\u28fdr;\uc000\ud835\udcc2pos\xbb\u159d\u0180;lm\u2909\u290a\u290d\u43bctimap;\u62b8\u0c00GLRVabcdefghijlmoprstuvw\u2942\u2953\u297e\u2989\u2998\u29da\u29e9\u2a15\u2a1a\u2a58\u2a5d\u2a83\u2a95\u2aa4\u2aa8\u2b04\u2b07\u2b44\u2b7f\u2bae\u2c34\u2c67\u2c7c\u2ce9\u0100gt\u2947\u294b;\uc000\u22d9\u0338\u0100;v\u2950\u0bcf\uc000\u226b\u20d2\u0180elt\u295a\u2972\u2976ft\u0100ar\u2961\u2967rrow;\u61cdightarrow;\u61ce;\uc000\u22d8\u0338\u0100;v\u297b\u0c47\uc000\u226a\u20d2ightarrow;\u61cf\u0100Dd\u298e\u2993ash;\u62afash;\u62ae\u0280bcnpt\u29a3\u29a7\u29ac\u29b1\u29ccla\xbb\u02deute;\u4144g;\uc000\u2220\u20d2\u0280;Eiop\u0d84\u29bc\u29c0\u29c5\u29c8;\uc000\u2a70\u0338d;\uc000\u224b\u0338s;\u4149ro\xf8\u0d84ur\u0100;a\u29d3\u29d4\u666el\u0100;s\u29d3\u0b38\u01f3\u29df\0\u29e3p\u80bb\xa0\u0b37mp\u0100;e\u0bf9\u0c00\u0280aeouy\u29f4\u29fe\u2a03\u2a10\u2a13\u01f0\u29f9\0\u29fb;\u6a43on;\u4148dil;\u4146ng\u0100;d\u0d7e\u2a0aot;\uc000\u2a6d\u0338p;\u6a42;\u443dash;\u6013\u0380;Aadqsx\u0b92\u2a29\u2a2d\u2a3b\u2a41\u2a45\u2a50rr;\u61d7r\u0100hr\u2a33\u2a36k;\u6924\u0100;o\u13f2\u13f0ot;\uc000\u2250\u0338ui\xf6\u0b63\u0100ei\u2a4a\u2a4ear;\u6928\xed\u0b98ist\u0100;s\u0ba0\u0b9fr;\uc000\ud835\udd2b\u0200Eest\u0bc5\u2a66\u2a79\u2a7c\u0180;qs\u0bbc\u2a6d\u0be1\u0180;qs\u0bbc\u0bc5\u2a74lan\xf4\u0be2i\xed\u0bea\u0100;r\u0bb6\u2a81\xbb\u0bb7\u0180Aap\u2a8a\u2a8d\u2a91r\xf2\u2971rr;\u61aear;\u6af2\u0180;sv\u0f8d\u2a9c\u0f8c\u0100;d\u2aa1\u2aa2\u62fc;\u62facy;\u445a\u0380AEadest\u2ab7\u2aba\u2abe\u2ac2\u2ac5\u2af6\u2af9r\xf2\u2966;\uc000\u2266\u0338rr;\u619ar;\u6025\u0200;fqs\u0c3b\u2ace\u2ae3\u2aeft\u0100ar\u2ad4\u2ad9rro\xf7\u2ac1ightarro\xf7\u2a90\u0180;qs\u0c3b\u2aba\u2aealan\xf4\u0c55\u0100;s\u0c55\u2af4\xbb\u0c36i\xed\u0c5d\u0100;r\u0c35\u2afei\u0100;e\u0c1a\u0c25i\xe4\u0d90\u0100pt\u2b0c\u2b11f;\uc000\ud835\udd5f\u8180\xac;in\u2b19\u2b1a\u2b36\u40acn\u0200;Edv\u0b89\u2b24\u2b28\u2b2e;\uc000\u22f9\u0338ot;\uc000\u22f5\u0338\u01e1\u0b89\u2b33\u2b35;\u62f7;\u62f6i\u0100;v\u0cb8\u2b3c\u01e1\u0cb8\u2b41\u2b43;\u62fe;\u62fd\u0180aor\u2b4b\u2b63\u2b69r\u0200;ast\u0b7b\u2b55\u2b5a\u2b5flle\xec\u0b7bl;\uc000\u2afd\u20e5;\uc000\u2202\u0338lint;\u6a14\u0180;ce\u0c92\u2b70\u2b73u\xe5\u0ca5\u0100;c\u0c98\u2b78\u0100;e\u0c92\u2b7d\xf1\u0c98\u0200Aait\u2b88\u2b8b\u2b9d\u2ba7r\xf2\u2988rr\u0180;cw\u2b94\u2b95\u2b99\u619b;\uc000\u2933\u0338;\uc000\u219d\u0338ghtarrow\xbb\u2b95ri\u0100;e\u0ccb\u0cd6\u0380chimpqu\u2bbd\u2bcd\u2bd9\u2b04\u0b78\u2be4\u2bef\u0200;cer\u0d32\u2bc6\u0d37\u2bc9u\xe5\u0d45;\uc000\ud835\udcc3ort\u026d\u2b05\0\0\u2bd6ar\xe1\u2b56m\u0100;e\u0d6e\u2bdf\u0100;q\u0d74\u0d73su\u0100bp\u2beb\u2bed\xe5\u0cf8\xe5\u0d0b\u0180bcp\u2bf6\u2c11\u2c19\u0200;Ees\u2bff\u2c00\u0d22\u2c04\u6284;\uc000\u2ac5\u0338et\u0100;e\u0d1b\u2c0bq\u0100;q\u0d23\u2c00c\u0100;e\u0d32\u2c17\xf1\u0d38\u0200;Ees\u2c22\u2c23\u0d5f\u2c27\u6285;\uc000\u2ac6\u0338et\u0100;e\u0d58\u2c2eq\u0100;q\u0d60\u2c23\u0200gilr\u2c3d\u2c3f\u2c45\u2c47\xec\u0bd7lde\u803b\xf1\u40f1\xe7\u0c43iangle\u0100lr\u2c52\u2c5ceft\u0100;e\u0c1a\u2c5a\xf1\u0c26ight\u0100;e\u0ccb\u2c65\xf1\u0cd7\u0100;m\u2c6c\u2c6d\u43bd\u0180;es\u2c74\u2c75\u2c79\u4023ro;\u6116p;\u6007\u0480DHadgilrs\u2c8f\u2c94\u2c99\u2c9e\u2ca3\u2cb0\u2cb6\u2cd3\u2ce3ash;\u62adarr;\u6904p;\uc000\u224d\u20d2ash;\u62ac\u0100et\u2ca8\u2cac;\uc000\u2265\u20d2;\uc000>\u20d2nfin;\u69de\u0180Aet\u2cbd\u2cc1\u2cc5rr;\u6902;\uc000\u2264\u20d2\u0100;r\u2cca\u2ccd\uc000<\u20d2ie;\uc000\u22b4\u20d2\u0100At\u2cd8\u2cdcrr;\u6903rie;\uc000\u22b5\u20d2im;\uc000\u223c\u20d2\u0180Aan\u2cf0\u2cf4\u2d02rr;\u61d6r\u0100hr\u2cfa\u2cfdk;\u6923\u0100;o\u13e7\u13e5ear;\u6927\u1253\u1a95\0\0\0\0\0\0\0\0\0\0\0\0\0\u2d2d\0\u2d38\u2d48\u2d60\u2d65\u2d72\u2d84\u1b07\0\0\u2d8d\u2dab\0\u2dc8\u2dce\0\u2ddc\u2e19\u2e2b\u2e3e\u2e43\u0100cs\u2d31\u1a97ute\u803b\xf3\u40f3\u0100iy\u2d3c\u2d45r\u0100;c\u1a9e\u2d42\u803b\xf4\u40f4;\u443e\u0280abios\u1aa0\u2d52\u2d57\u01c8\u2d5alac;\u4151v;\u6a38old;\u69bclig;\u4153\u0100cr\u2d69\u2d6dir;\u69bf;\uc000\ud835\udd2c\u036f\u2d79\0\0\u2d7c\0\u2d82n;\u42dbave\u803b\xf2\u40f2;\u69c1\u0100bm\u2d88\u0df4ar;\u69b5\u0200acit\u2d95\u2d98\u2da5\u2da8r\xf2\u1a80\u0100ir\u2d9d\u2da0r;\u69beoss;\u69bbn\xe5\u0e52;\u69c0\u0180aei\u2db1\u2db5\u2db9cr;\u414dga;\u43c9\u0180cdn\u2dc0\u2dc5\u01cdron;\u43bf;\u69b6pf;\uc000\ud835\udd60\u0180ael\u2dd4\u2dd7\u01d2r;\u69b7rp;\u69b9\u0380;adiosv\u2dea\u2deb\u2dee\u2e08\u2e0d\u2e10\u2e16\u6228r\xf2\u1a86\u0200;efm\u2df7\u2df8\u2e02\u2e05\u6a5dr\u0100;o\u2dfe\u2dff\u6134f\xbb\u2dff\u803b\xaa\u40aa\u803b\xba\u40bagof;\u62b6r;\u6a56lope;\u6a57;\u6a5b\u0180clo\u2e1f\u2e21\u2e27\xf2\u2e01ash\u803b\xf8\u40f8l;\u6298i\u016c\u2e2f\u2e34de\u803b\xf5\u40f5es\u0100;a\u01db\u2e3as;\u6a36ml\u803b\xf6\u40f6bar;\u633d\u0ae1\u2e5e\0\u2e7d\0\u2e80\u2e9d\0\u2ea2\u2eb9\0\0\u2ecb\u0e9c\0\u2f13\0\0\u2f2b\u2fbc\0\u2fc8r\u0200;ast\u0403\u2e67\u2e72\u0e85\u8100\xb6;l\u2e6d\u2e6e\u40b6le\xec\u0403\u0269\u2e78\0\0\u2e7bm;\u6af3;\u6afdy;\u443fr\u0280cimpt\u2e8b\u2e8f\u2e93\u1865\u2e97nt;\u4025od;\u402eil;\u6030enk;\u6031r;\uc000\ud835\udd2d\u0180imo\u2ea8\u2eb0\u2eb4\u0100;v\u2ead\u2eae\u43c6;\u43d5ma\xf4\u0a76ne;\u660e\u0180;tv\u2ebf\u2ec0\u2ec8\u43c0chfork\xbb\u1ffd;\u43d6\u0100au\u2ecf\u2edfn\u0100ck\u2ed5\u2eddk\u0100;h\u21f4\u2edb;\u610e\xf6\u21f4s\u0480;abcdemst\u2ef3\u2ef4\u1908\u2ef9\u2efd\u2f04\u2f06\u2f0a\u2f0e\u402bcir;\u6a23ir;\u6a22\u0100ou\u1d40\u2f02;\u6a25;\u6a72n\u80bb\xb1\u0e9dim;\u6a26wo;\u6a27\u0180ipu\u2f19\u2f20\u2f25ntint;\u6a15f;\uc000\ud835\udd61nd\u803b\xa3\u40a3\u0500;Eaceinosu\u0ec8\u2f3f\u2f41\u2f44\u2f47\u2f81\u2f89\u2f92\u2f7e\u2fb6;\u6ab3p;\u6ab7u\xe5\u0ed9\u0100;c\u0ece\u2f4c\u0300;acens\u0ec8\u2f59\u2f5f\u2f66\u2f68\u2f7eppro\xf8\u2f43urlye\xf1\u0ed9\xf1\u0ece\u0180aes\u2f6f\u2f76\u2f7approx;\u6ab9qq;\u6ab5im;\u62e8i\xed\u0edfme\u0100;s\u2f88\u0eae\u6032\u0180Eas\u2f78\u2f90\u2f7a\xf0\u2f75\u0180dfp\u0eec\u2f99\u2faf\u0180als\u2fa0\u2fa5\u2faalar;\u632eine;\u6312urf;\u6313\u0100;t\u0efb\u2fb4\xef\u0efbrel;\u62b0\u0100ci\u2fc0\u2fc5r;\uc000\ud835\udcc5;\u43c8ncsp;\u6008\u0300fiopsu\u2fda\u22e2\u2fdf\u2fe5\u2feb\u2ff1r;\uc000\ud835\udd2epf;\uc000\ud835\udd62rime;\u6057cr;\uc000\ud835\udcc6\u0180aeo\u2ff8\u3009\u3013t\u0100ei\u2ffe\u3005rnion\xf3\u06b0nt;\u6a16st\u0100;e\u3010\u3011\u403f\xf1\u1f19\xf4\u0f14\u0a80ABHabcdefhilmnoprstux\u3040\u3051\u3055\u3059\u30e0\u310e\u312b\u3147\u3162\u3172\u318e\u3206\u3215\u3224\u3229\u3258\u326e\u3272\u3290\u32b0\u32b7\u0180art\u3047\u304a\u304cr\xf2\u10b3\xf2\u03ddail;\u691car\xf2\u1c65ar;\u6964\u0380cdenqrt\u3068\u3075\u3078\u307f\u308f\u3094\u30cc\u0100eu\u306d\u3071;\uc000\u223d\u0331te;\u4155i\xe3\u116emptyv;\u69b3g\u0200;del\u0fd1\u3089\u308b\u308d;\u6992;\u69a5\xe5\u0fd1uo\u803b\xbb\u40bbr\u0580;abcfhlpstw\u0fdc\u30ac\u30af\u30b7\u30b9\u30bc\u30be\u30c0\u30c3\u30c7\u30cap;\u6975\u0100;f\u0fe0\u30b4s;\u6920;\u6933s;\u691e\xeb\u225d\xf0\u272el;\u6945im;\u6974l;\u61a3;\u619d\u0100ai\u30d1\u30d5il;\u691ao\u0100;n\u30db\u30dc\u6236al\xf3\u0f1e\u0180abr\u30e7\u30ea\u30eer\xf2\u17e5rk;\u6773\u0100ak\u30f3\u30fdc\u0100ek\u30f9\u30fb;\u407d;\u405d\u0100es\u3102\u3104;\u698cl\u0100du\u310a\u310c;\u698e;\u6990\u0200aeuy\u3117\u311c\u3127\u3129ron;\u4159\u0100di\u3121\u3125il;\u4157\xec\u0ff2\xe2\u30fa;\u4440\u0200clqs\u3134\u3137\u313d\u3144a;\u6937dhar;\u6969uo\u0100;r\u020e\u020dh;\u61b3\u0180acg\u314e\u315f\u0f44l\u0200;ips\u0f78\u3158\u315b\u109cn\xe5\u10bbar\xf4\u0fa9t;\u65ad\u0180ilr\u3169\u1023\u316esht;\u697d;\uc000\ud835\udd2f\u0100ao\u3177\u3186r\u0100du\u317d\u317f\xbb\u047b\u0100;l\u1091\u3184;\u696c\u0100;v\u318b\u318c\u43c1;\u43f1\u0180gns\u3195\u31f9\u31fcht\u0300ahlrst\u31a4\u31b0\u31c2\u31d8\u31e4\u31eerrow\u0100;t\u0fdc\u31ada\xe9\u30c8arpoon\u0100du\u31bb\u31bfow\xee\u317ep\xbb\u1092eft\u0100ah\u31ca\u31d0rrow\xf3\u0feaarpoon\xf3\u0551ightarrows;\u61c9quigarro\xf7\u30cbhreetimes;\u62ccg;\u42daingdotse\xf1\u1f32\u0180ahm\u320d\u3210\u3213r\xf2\u0feaa\xf2\u0551;\u600foust\u0100;a\u321e\u321f\u63b1che\xbb\u321fmid;\u6aee\u0200abpt\u3232\u323d\u3240\u3252\u0100nr\u3237\u323ag;\u67edr;\u61fer\xeb\u1003\u0180afl\u3247\u324a\u324er;\u6986;\uc000\ud835\udd63us;\u6a2eimes;\u6a35\u0100ap\u325d\u3267r\u0100;g\u3263\u3264\u4029t;\u6994olint;\u6a12ar\xf2\u31e3\u0200achq\u327b\u3280\u10bc\u3285quo;\u603ar;\uc000\ud835\udcc7\u0100bu\u30fb\u328ao\u0100;r\u0214\u0213\u0180hir\u3297\u329b\u32a0re\xe5\u31f8mes;\u62cai\u0200;efl\u32aa\u1059\u1821\u32ab\u65b9tri;\u69celuhar;\u6968;\u611e\u0d61\u32d5\u32db\u32df\u332c\u3338\u3371\0\u337a\u33a4\0\0\u33ec\u33f0\0\u3428\u3448\u345a\u34ad\u34b1\u34ca\u34f1\0\u3616\0\0\u3633cute;\u415bqu\xef\u27ba\u0500;Eaceinpsy\u11ed\u32f3\u32f5\u32ff\u3302\u330b\u330f\u331f\u3326\u3329;\u6ab4\u01f0\u32fa\0\u32fc;\u6ab8on;\u4161u\xe5\u11fe\u0100;d\u11f3\u3307il;\u415frc;\u415d\u0180Eas\u3316\u3318\u331b;\u6ab6p;\u6abaim;\u62e9olint;\u6a13i\xed\u1204;\u4441ot\u0180;be\u3334\u1d47\u3335\u62c5;\u6a66\u0380Aacmstx\u3346\u334a\u3357\u335b\u335e\u3363\u336drr;\u61d8r\u0100hr\u3350\u3352\xeb\u2228\u0100;o\u0a36\u0a34t\u803b\xa7\u40a7i;\u403bwar;\u6929m\u0100in\u3369\xf0nu\xf3\xf1t;\u6736r\u0100;o\u3376\u2055\uc000\ud835\udd30\u0200acoy\u3382\u3386\u3391\u33a0rp;\u666f\u0100hy\u338b\u338fcy;\u4449;\u4448rt\u026d\u3399\0\0\u339ci\xe4\u1464ara\xec\u2e6f\u803b\xad\u40ad\u0100gm\u33a8\u33b4ma\u0180;fv\u33b1\u33b2\u33b2\u43c3;\u43c2\u0400;deglnpr\u12ab\u33c5\u33c9\u33ce\u33d6\u33de\u33e1\u33e6ot;\u6a6a\u0100;q\u12b1\u12b0\u0100;E\u33d3\u33d4\u6a9e;\u6aa0\u0100;E\u33db\u33dc\u6a9d;\u6a9fe;\u6246lus;\u6a24arr;\u6972ar\xf2\u113d\u0200aeit\u33f8\u3408\u340f\u3417\u0100ls\u33fd\u3404lsetm\xe9\u336ahp;\u6a33parsl;\u69e4\u0100dl\u1463\u3414e;\u6323\u0100;e\u341c\u341d\u6aaa\u0100;s\u3422\u3423\u6aac;\uc000\u2aac\ufe00\u0180flp\u342e\u3433\u3442tcy;\u444c\u0100;b\u3438\u3439\u402f\u0100;a\u343e\u343f\u69c4r;\u633ff;\uc000\ud835\udd64a\u0100dr\u344d\u0402es\u0100;u\u3454\u3455\u6660it\xbb\u3455\u0180csu\u3460\u3479\u349f\u0100au\u3465\u346fp\u0100;s\u1188\u346b;\uc000\u2293\ufe00p\u0100;s\u11b4\u3475;\uc000\u2294\ufe00u\u0100bp\u347f\u348f\u0180;es\u1197\u119c\u3486et\u0100;e\u1197\u348d\xf1\u119d\u0180;es\u11a8\u11ad\u3496et\u0100;e\u11a8\u349d\xf1\u11ae\u0180;af\u117b\u34a6\u05b0r\u0165\u34ab\u05b1\xbb\u117car\xf2\u1148\u0200cemt\u34b9\u34be\u34c2\u34c5r;\uc000\ud835\udcc8tm\xee\xf1i\xec\u3415ar\xe6\u11be\u0100ar\u34ce\u34d5r\u0100;f\u34d4\u17bf\u6606\u0100an\u34da\u34edight\u0100ep\u34e3\u34eapsilo\xee\u1ee0h\xe9\u2eafs\xbb\u2852\u0280bcmnp\u34fb\u355e\u1209\u358b\u358e\u0480;Edemnprs\u350e\u350f\u3511\u3515\u351e\u3523\u352c\u3531\u3536\u6282;\u6ac5ot;\u6abd\u0100;d\u11da\u351aot;\u6ac3ult;\u6ac1\u0100Ee\u3528\u352a;\u6acb;\u628alus;\u6abfarr;\u6979\u0180eiu\u353d\u3552\u3555t\u0180;en\u350e\u3545\u354bq\u0100;q\u11da\u350feq\u0100;q\u352b\u3528m;\u6ac7\u0100bp\u355a\u355c;\u6ad5;\u6ad3c\u0300;acens\u11ed\u356c\u3572\u3579\u357b\u3326ppro\xf8\u32faurlye\xf1\u11fe\xf1\u11f3\u0180aes\u3582\u3588\u331bppro\xf8\u331aq\xf1\u3317g;\u666a\u0680123;Edehlmnps\u35a9\u35ac\u35af\u121c\u35b2\u35b4\u35c0\u35c9\u35d5\u35da\u35df\u35e8\u35ed\u803b\xb9\u40b9\u803b\xb2\u40b2\u803b\xb3\u40b3;\u6ac6\u0100os\u35b9\u35bct;\u6abeub;\u6ad8\u0100;d\u1222\u35c5ot;\u6ac4s\u0100ou\u35cf\u35d2l;\u67c9b;\u6ad7arr;\u697bult;\u6ac2\u0100Ee\u35e4\u35e6;\u6acc;\u628blus;\u6ac0\u0180eiu\u35f4\u3609\u360ct\u0180;en\u121c\u35fc\u3602q\u0100;q\u1222\u35b2eq\u0100;q\u35e7\u35e4m;\u6ac8\u0100bp\u3611\u3613;\u6ad4;\u6ad6\u0180Aan\u361c\u3620\u362drr;\u61d9r\u0100hr\u3626\u3628\xeb\u222e\u0100;o\u0a2b\u0a29war;\u692alig\u803b\xdf\u40df\u0be1\u3651\u365d\u3660\u12ce\u3673\u3679\0\u367e\u36c2\0\0\0\0\0\u36db\u3703\0\u3709\u376c\0\0\0\u3787\u0272\u3656\0\0\u365bget;\u6316;\u43c4r\xeb\u0e5f\u0180aey\u3666\u366b\u3670ron;\u4165dil;\u4163;\u4442lrec;\u6315r;\uc000\ud835\udd31\u0200eiko\u3686\u369d\u36b5\u36bc\u01f2\u368b\0\u3691e\u01004f\u1284\u1281a\u0180;sv\u3698\u3699\u369b\u43b8ym;\u43d1\u0100cn\u36a2\u36b2k\u0100as\u36a8\u36aeppro\xf8\u12c1im\xbb\u12acs\xf0\u129e\u0100as\u36ba\u36ae\xf0\u12c1rn\u803b\xfe\u40fe\u01ec\u031f\u36c6\u22e7es\u8180\xd7;bd\u36cf\u36d0\u36d8\u40d7\u0100;a\u190f\u36d5r;\u6a31;\u6a30\u0180eps\u36e1\u36e3\u3700\xe1\u2a4d\u0200;bcf\u0486\u36ec\u36f0\u36f4ot;\u6336ir;\u6af1\u0100;o\u36f9\u36fc\uc000\ud835\udd65rk;\u6ada\xe1\u3362rime;\u6034\u0180aip\u370f\u3712\u3764d\xe5\u1248\u0380adempst\u3721\u374d\u3740\u3751\u3757\u375c\u375fngle\u0280;dlqr\u3730\u3731\u3736\u3740\u3742\u65b5own\xbb\u1dbbeft\u0100;e\u2800\u373e\xf1\u092e;\u625cight\u0100;e\u32aa\u374b\xf1\u105aot;\u65ecinus;\u6a3alus;\u6a39b;\u69cdime;\u6a3bezium;\u63e2\u0180cht\u3772\u377d\u3781\u0100ry\u3777\u377b;\uc000\ud835\udcc9;\u4446cy;\u445brok;\u4167\u0100io\u378b\u378ex\xf4\u1777head\u0100lr\u3797\u37a0eftarro\xf7\u084fightarrow\xbb\u0f5d\u0900AHabcdfghlmoprstuw\u37d0\u37d3\u37d7\u37e4\u37f0\u37fc\u380e\u381c\u3823\u3834\u3851\u385d\u386b\u38a9\u38cc\u38d2\u38ea\u38f6r\xf2\u03edar;\u6963\u0100cr\u37dc\u37e2ute\u803b\xfa\u40fa\xf2\u1150r\u01e3\u37ea\0\u37edy;\u445eve;\u416d\u0100iy\u37f5\u37farc\u803b\xfb\u40fb;\u4443\u0180abh\u3803\u3806\u380br\xf2\u13adlac;\u4171a\xf2\u13c3\u0100ir\u3813\u3818sht;\u697e;\uc000\ud835\udd32rave\u803b\xf9\u40f9\u0161\u3827\u3831r\u0100lr\u382c\u382e\xbb\u0957\xbb\u1083lk;\u6580\u0100ct\u3839\u384d\u026f\u383f\0\0\u384arn\u0100;e\u3845\u3846\u631cr\xbb\u3846op;\u630fri;\u65f8\u0100al\u3856\u385acr;\u416b\u80bb\xa8\u0349\u0100gp\u3862\u3866on;\u4173f;\uc000\ud835\udd66\u0300adhlsu\u114b\u3878\u387d\u1372\u3891\u38a0own\xe1\u13b3arpoon\u0100lr\u3888\u388cef\xf4\u382digh\xf4\u382fi\u0180;hl\u3899\u389a\u389c\u43c5\xbb\u13faon\xbb\u389aparrows;\u61c8\u0180cit\u38b0\u38c4\u38c8\u026f\u38b6\0\0\u38c1rn\u0100;e\u38bc\u38bd\u631dr\xbb\u38bdop;\u630eng;\u416fri;\u65f9cr;\uc000\ud835\udcca\u0180dir\u38d9\u38dd\u38e2ot;\u62f0lde;\u4169i\u0100;f\u3730\u38e8\xbb\u1813\u0100am\u38ef\u38f2r\xf2\u38a8l\u803b\xfc\u40fcangle;\u69a7\u0780ABDacdeflnoprsz\u391c\u391f\u3929\u392d\u39b5\u39b8\u39bd\u39df\u39e4\u39e8\u39f3\u39f9\u39fd\u3a01\u3a20r\xf2\u03f7ar\u0100;v\u3926\u3927\u6ae8;\u6ae9as\xe8\u03e1\u0100nr\u3932\u3937grt;\u699c\u0380eknprst\u34e3\u3946\u394b\u3952\u395d\u3964\u3996app\xe1\u2415othin\xe7\u1e96\u0180hir\u34eb\u2ec8\u3959op\xf4\u2fb5\u0100;h\u13b7\u3962\xef\u318d\u0100iu\u3969\u396dgm\xe1\u33b3\u0100bp\u3972\u3984setneq\u0100;q\u397d\u3980\uc000\u228a\ufe00;\uc000\u2acb\ufe00setneq\u0100;q\u398f\u3992\uc000\u228b\ufe00;\uc000\u2acc\ufe00\u0100hr\u399b\u399fet\xe1\u369ciangle\u0100lr\u39aa\u39afeft\xbb\u0925ight\xbb\u1051y;\u4432ash\xbb\u1036\u0180elr\u39c4\u39d2\u39d7\u0180;be\u2dea\u39cb\u39cfar;\u62bbq;\u625alip;\u62ee\u0100bt\u39dc\u1468a\xf2\u1469r;\uc000\ud835\udd33tr\xe9\u39aesu\u0100bp\u39ef\u39f1\xbb\u0d1c\xbb\u0d59pf;\uc000\ud835\udd67ro\xf0\u0efbtr\xe9\u39b4\u0100cu\u3a06\u3a0br;\uc000\ud835\udccb\u0100bp\u3a10\u3a18n\u0100Ee\u3980\u3a16\xbb\u397en\u0100Ee\u3992\u3a1e\xbb\u3990igzag;\u699a\u0380cefoprs\u3a36\u3a3b\u3a56\u3a5b\u3a54\u3a61\u3a6airc;\u4175\u0100di\u3a40\u3a51\u0100bg\u3a45\u3a49ar;\u6a5fe\u0100;q\u15fa\u3a4f;\u6259erp;\u6118r;\uc000\ud835\udd34pf;\uc000\ud835\udd68\u0100;e\u1479\u3a66at\xe8\u1479cr;\uc000\ud835\udccc\u0ae3\u178e\u3a87\0\u3a8b\0\u3a90\u3a9b\0\0\u3a9d\u3aa8\u3aab\u3aaf\0\0\u3ac3\u3ace\0\u3ad8\u17dc\u17dftr\xe9\u17d1r;\uc000\ud835\udd35\u0100Aa\u3a94\u3a97r\xf2\u03c3r\xf2\u09f6;\u43be\u0100Aa\u3aa1\u3aa4r\xf2\u03b8r\xf2\u09eba\xf0\u2713is;\u62fb\u0180dpt\u17a4\u3ab5\u3abe\u0100fl\u3aba\u17a9;\uc000\ud835\udd69im\xe5\u17b2\u0100Aa\u3ac7\u3acar\xf2\u03cer\xf2\u0a01\u0100cq\u3ad2\u17b8r;\uc000\ud835\udccd\u0100pt\u17d6\u3adcr\xe9\u17d4\u0400acefiosu\u3af0\u3afd\u3b08\u3b0c\u3b11\u3b15\u3b1b\u3b21c\u0100uy\u3af6\u3afbte\u803b\xfd\u40fd;\u444f\u0100iy\u3b02\u3b06rc;\u4177;\u444bn\u803b\xa5\u40a5r;\uc000\ud835\udd36cy;\u4457pf;\uc000\ud835\udd6acr;\uc000\ud835\udcce\u0100cm\u3b26\u3b29y;\u444el\u803b\xff\u40ff\u0500acdefhiosw\u3b42\u3b48\u3b54\u3b58\u3b64\u3b69\u3b6d\u3b74\u3b7a\u3b80cute;\u417a\u0100ay\u3b4d\u3b52ron;\u417e;\u4437ot;\u417c\u0100et\u3b5d\u3b61tr\xe6\u155fa;\u43b6r;\uc000\ud835\udd37cy;\u4436grarr;\u61ddpf;\uc000\ud835\udd6bcr;\uc000\ud835\udccf\u0100jn\u3b85\u3b87;\u600dj;\u600c"
    .split("")
    .map((c) => c.charCodeAt(0))
					);
				//# sourceMappingURL=decode-data-html.js.map
			},
		'./node_modules/entities/lib/esm/generated/decode-data-xml.js':
			function (
				__unused_webpack___webpack_module__,
				__webpack_exports__,
				__webpack_require__
			) {
				__webpack_require__.r(__webpack_exports__);
				// Generated using scripts/write-decode-map.ts
				/* harmony default export */ __webpack_exports__['default'] =
					new Uint16Array(
						// prettier-ignore
						"\u0200aglq\t\x15\x18\x1b\u026d\x0f\0\0\x12p;\u4026os;\u4027t;\u403et;\u403cuot;\u4022"
    .split("")
    .map((c) => c.charCodeAt(0))
					);
				//# sourceMappingURL=decode-data-xml.js.map
			},
		'./node_modules/entities/lib/esm/generated/encode-html.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			// Generated using scripts/write-encode-map.ts
			function restoreDiff(arr) {
				for (let i = 1; i < arr.length; i++) {
					arr[i][0] += arr[i - 1][0] + 1;
				}
				return arr;
			}
			// prettier-ignore
			/* harmony default export */ __webpack_exports__["default"] = (new Map(/* #__PURE__ */ restoreDiff([[9, "&Tab;"], [0, "&NewLine;"], [22, "&excl;"], [0, "&quot;"], [0, "&num;"], [0, "&dollar;"], [0, "&percnt;"], [0, "&amp;"], [0, "&apos;"], [0, "&lpar;"], [0, "&rpar;"], [0, "&ast;"], [0, "&plus;"], [0, "&comma;"], [1, "&period;"], [0, "&sol;"], [10, "&colon;"], [0, "&semi;"], [0, { v: "&lt;", n: 8402, o: "&nvlt;" }], [0, { v: "&equals;", n: 8421, o: "&bne;" }], [0, { v: "&gt;", n: 8402, o: "&nvgt;" }], [0, "&quest;"], [0, "&commat;"], [26, "&lbrack;"], [0, "&bsol;"], [0, "&rbrack;"], [0, "&Hat;"], [0, "&lowbar;"], [0, "&DiacriticalGrave;"], [5, { n: 106, o: "&fjlig;" }], [20, "&lbrace;"], [0, "&verbar;"], [0, "&rbrace;"], [34, "&nbsp;"], [0, "&iexcl;"], [0, "&cent;"], [0, "&pound;"], [0, "&curren;"], [0, "&yen;"], [0, "&brvbar;"], [0, "&sect;"], [0, "&die;"], [0, "&copy;"], [0, "&ordf;"], [0, "&laquo;"], [0, "&not;"], [0, "&shy;"], [0, "&circledR;"], [0, "&macr;"], [0, "&deg;"], [0, "&PlusMinus;"], [0, "&sup2;"], [0, "&sup3;"], [0, "&acute;"], [0, "&micro;"], [0, "&para;"], [0, "&centerdot;"], [0, "&cedil;"], [0, "&sup1;"], [0, "&ordm;"], [0, "&raquo;"], [0, "&frac14;"], [0, "&frac12;"], [0, "&frac34;"], [0, "&iquest;"], [0, "&Agrave;"], [0, "&Aacute;"], [0, "&Acirc;"], [0, "&Atilde;"], [0, "&Auml;"], [0, "&angst;"], [0, "&AElig;"], [0, "&Ccedil;"], [0, "&Egrave;"], [0, "&Eacute;"], [0, "&Ecirc;"], [0, "&Euml;"], [0, "&Igrave;"], [0, "&Iacute;"], [0, "&Icirc;"], [0, "&Iuml;"], [0, "&ETH;"], [0, "&Ntilde;"], [0, "&Ograve;"], [0, "&Oacute;"], [0, "&Ocirc;"], [0, "&Otilde;"], [0, "&Ouml;"], [0, "&times;"], [0, "&Oslash;"], [0, "&Ugrave;"], [0, "&Uacute;"], [0, "&Ucirc;"], [0, "&Uuml;"], [0, "&Yacute;"], [0, "&THORN;"], [0, "&szlig;"], [0, "&agrave;"], [0, "&aacute;"], [0, "&acirc;"], [0, "&atilde;"], [0, "&auml;"], [0, "&aring;"], [0, "&aelig;"], [0, "&ccedil;"], [0, "&egrave;"], [0, "&eacute;"], [0, "&ecirc;"], [0, "&euml;"], [0, "&igrave;"], [0, "&iacute;"], [0, "&icirc;"], [0, "&iuml;"], [0, "&eth;"], [0, "&ntilde;"], [0, "&ograve;"], [0, "&oacute;"], [0, "&ocirc;"], [0, "&otilde;"], [0, "&ouml;"], [0, "&div;"], [0, "&oslash;"], [0, "&ugrave;"], [0, "&uacute;"], [0, "&ucirc;"], [0, "&uuml;"], [0, "&yacute;"], [0, "&thorn;"], [0, "&yuml;"], [0, "&Amacr;"], [0, "&amacr;"], [0, "&Abreve;"], [0, "&abreve;"], [0, "&Aogon;"], [0, "&aogon;"], [0, "&Cacute;"], [0, "&cacute;"], [0, "&Ccirc;"], [0, "&ccirc;"], [0, "&Cdot;"], [0, "&cdot;"], [0, "&Ccaron;"], [0, "&ccaron;"], [0, "&Dcaron;"], [0, "&dcaron;"], [0, "&Dstrok;"], [0, "&dstrok;"], [0, "&Emacr;"], [0, "&emacr;"], [2, "&Edot;"], [0, "&edot;"], [0, "&Eogon;"], [0, "&eogon;"], [0, "&Ecaron;"], [0, "&ecaron;"], [0, "&Gcirc;"], [0, "&gcirc;"], [0, "&Gbreve;"], [0, "&gbreve;"], [0, "&Gdot;"], [0, "&gdot;"], [0, "&Gcedil;"], [1, "&Hcirc;"], [0, "&hcirc;"], [0, "&Hstrok;"], [0, "&hstrok;"], [0, "&Itilde;"], [0, "&itilde;"], [0, "&Imacr;"], [0, "&imacr;"], [2, "&Iogon;"], [0, "&iogon;"], [0, "&Idot;"], [0, "&imath;"], [0, "&IJlig;"], [0, "&ijlig;"], [0, "&Jcirc;"], [0, "&jcirc;"], [0, "&Kcedil;"], [0, "&kcedil;"], [0, "&kgreen;"], [0, "&Lacute;"], [0, "&lacute;"], [0, "&Lcedil;"], [0, "&lcedil;"], [0, "&Lcaron;"], [0, "&lcaron;"], [0, "&Lmidot;"], [0, "&lmidot;"], [0, "&Lstrok;"], [0, "&lstrok;"], [0, "&Nacute;"], [0, "&nacute;"], [0, "&Ncedil;"], [0, "&ncedil;"], [0, "&Ncaron;"], [0, "&ncaron;"], [0, "&napos;"], [0, "&ENG;"], [0, "&eng;"], [0, "&Omacr;"], [0, "&omacr;"], [2, "&Odblac;"], [0, "&odblac;"], [0, "&OElig;"], [0, "&oelig;"], [0, "&Racute;"], [0, "&racute;"], [0, "&Rcedil;"], [0, "&rcedil;"], [0, "&Rcaron;"], [0, "&rcaron;"], [0, "&Sacute;"], [0, "&sacute;"], [0, "&Scirc;"], [0, "&scirc;"], [0, "&Scedil;"], [0, "&scedil;"], [0, "&Scaron;"], [0, "&scaron;"], [0, "&Tcedil;"], [0, "&tcedil;"], [0, "&Tcaron;"], [0, "&tcaron;"], [0, "&Tstrok;"], [0, "&tstrok;"], [0, "&Utilde;"], [0, "&utilde;"], [0, "&Umacr;"], [0, "&umacr;"], [0, "&Ubreve;"], [0, "&ubreve;"], [0, "&Uring;"], [0, "&uring;"], [0, "&Udblac;"], [0, "&udblac;"], [0, "&Uogon;"], [0, "&uogon;"], [0, "&Wcirc;"], [0, "&wcirc;"], [0, "&Ycirc;"], [0, "&ycirc;"], [0, "&Yuml;"], [0, "&Zacute;"], [0, "&zacute;"], [0, "&Zdot;"], [0, "&zdot;"], [0, "&Zcaron;"], [0, "&zcaron;"], [19, "&fnof;"], [34, "&imped;"], [63, "&gacute;"], [65, "&jmath;"], [142, "&circ;"], [0, "&caron;"], [16, "&breve;"], [0, "&DiacriticalDot;"], [0, "&ring;"], [0, "&ogon;"], [0, "&DiacriticalTilde;"], [0, "&dblac;"], [51, "&DownBreve;"], [127, "&Alpha;"], [0, "&Beta;"], [0, "&Gamma;"], [0, "&Delta;"], [0, "&Epsilon;"], [0, "&Zeta;"], [0, "&Eta;"], [0, "&Theta;"], [0, "&Iota;"], [0, "&Kappa;"], [0, "&Lambda;"], [0, "&Mu;"], [0, "&Nu;"], [0, "&Xi;"], [0, "&Omicron;"], [0, "&Pi;"], [0, "&Rho;"], [1, "&Sigma;"], [0, "&Tau;"], [0, "&Upsilon;"], [0, "&Phi;"], [0, "&Chi;"], [0, "&Psi;"], [0, "&ohm;"], [7, "&alpha;"], [0, "&beta;"], [0, "&gamma;"], [0, "&delta;"], [0, "&epsi;"], [0, "&zeta;"], [0, "&eta;"], [0, "&theta;"], [0, "&iota;"], [0, "&kappa;"], [0, "&lambda;"], [0, "&mu;"], [0, "&nu;"], [0, "&xi;"], [0, "&omicron;"], [0, "&pi;"], [0, "&rho;"], [0, "&sigmaf;"], [0, "&sigma;"], [0, "&tau;"], [0, "&upsi;"], [0, "&phi;"], [0, "&chi;"], [0, "&psi;"], [0, "&omega;"], [7, "&thetasym;"], [0, "&Upsi;"], [2, "&phiv;"], [0, "&piv;"], [5, "&Gammad;"], [0, "&digamma;"], [18, "&kappav;"], [0, "&rhov;"], [3, "&epsiv;"], [0, "&backepsilon;"], [10, "&IOcy;"], [0, "&DJcy;"], [0, "&GJcy;"], [0, "&Jukcy;"], [0, "&DScy;"], [0, "&Iukcy;"], [0, "&YIcy;"], [0, "&Jsercy;"], [0, "&LJcy;"], [0, "&NJcy;"], [0, "&TSHcy;"], [0, "&KJcy;"], [1, "&Ubrcy;"], [0, "&DZcy;"], [0, "&Acy;"], [0, "&Bcy;"], [0, "&Vcy;"], [0, "&Gcy;"], [0, "&Dcy;"], [0, "&IEcy;"], [0, "&ZHcy;"], [0, "&Zcy;"], [0, "&Icy;"], [0, "&Jcy;"], [0, "&Kcy;"], [0, "&Lcy;"], [0, "&Mcy;"], [0, "&Ncy;"], [0, "&Ocy;"], [0, "&Pcy;"], [0, "&Rcy;"], [0, "&Scy;"], [0, "&Tcy;"], [0, "&Ucy;"], [0, "&Fcy;"], [0, "&KHcy;"], [0, "&TScy;"], [0, "&CHcy;"], [0, "&SHcy;"], [0, "&SHCHcy;"], [0, "&HARDcy;"], [0, "&Ycy;"], [0, "&SOFTcy;"], [0, "&Ecy;"], [0, "&YUcy;"], [0, "&YAcy;"], [0, "&acy;"], [0, "&bcy;"], [0, "&vcy;"], [0, "&gcy;"], [0, "&dcy;"], [0, "&iecy;"], [0, "&zhcy;"], [0, "&zcy;"], [0, "&icy;"], [0, "&jcy;"], [0, "&kcy;"], [0, "&lcy;"], [0, "&mcy;"], [0, "&ncy;"], [0, "&ocy;"], [0, "&pcy;"], [0, "&rcy;"], [0, "&scy;"], [0, "&tcy;"], [0, "&ucy;"], [0, "&fcy;"], [0, "&khcy;"], [0, "&tscy;"], [0, "&chcy;"], [0, "&shcy;"], [0, "&shchcy;"], [0, "&hardcy;"], [0, "&ycy;"], [0, "&softcy;"], [0, "&ecy;"], [0, "&yucy;"], [0, "&yacy;"], [1, "&iocy;"], [0, "&djcy;"], [0, "&gjcy;"], [0, "&jukcy;"], [0, "&dscy;"], [0, "&iukcy;"], [0, "&yicy;"], [0, "&jsercy;"], [0, "&ljcy;"], [0, "&njcy;"], [0, "&tshcy;"], [0, "&kjcy;"], [1, "&ubrcy;"], [0, "&dzcy;"], [7074, "&ensp;"], [0, "&emsp;"], [0, "&emsp13;"], [0, "&emsp14;"], [1, "&numsp;"], [0, "&puncsp;"], [0, "&ThinSpace;"], [0, "&hairsp;"], [0, "&NegativeMediumSpace;"], [0, "&zwnj;"], [0, "&zwj;"], [0, "&lrm;"], [0, "&rlm;"], [0, "&dash;"], [2, "&ndash;"], [0, "&mdash;"], [0, "&horbar;"], [0, "&Verbar;"], [1, "&lsquo;"], [0, "&CloseCurlyQuote;"], [0, "&lsquor;"], [1, "&ldquo;"], [0, "&CloseCurlyDoubleQuote;"], [0, "&bdquo;"], [1, "&dagger;"], [0, "&Dagger;"], [0, "&bull;"], [2, "&nldr;"], [0, "&hellip;"], [9, "&permil;"], [0, "&pertenk;"], [0, "&prime;"], [0, "&Prime;"], [0, "&tprime;"], [0, "&backprime;"], [3, "&lsaquo;"], [0, "&rsaquo;"], [3, "&oline;"], [2, "&caret;"], [1, "&hybull;"], [0, "&frasl;"], [10, "&bsemi;"], [7, "&qprime;"], [7, { v: "&MediumSpace;", n: 8202, o: "&ThickSpace;" }], [0, "&NoBreak;"], [0, "&af;"], [0, "&InvisibleTimes;"], [0, "&ic;"], [72, "&euro;"], [46, "&tdot;"], [0, "&DotDot;"], [37, "&complexes;"], [2, "&incare;"], [4, "&gscr;"], [0, "&hamilt;"], [0, "&Hfr;"], [0, "&Hopf;"], [0, "&planckh;"], [0, "&hbar;"], [0, "&imagline;"], [0, "&Ifr;"], [0, "&lagran;"], [0, "&ell;"], [1, "&naturals;"], [0, "&numero;"], [0, "&copysr;"], [0, "&weierp;"], [0, "&Popf;"], [0, "&Qopf;"], [0, "&realine;"], [0, "&real;"], [0, "&reals;"], [0, "&rx;"], [3, "&trade;"], [1, "&integers;"], [2, "&mho;"], [0, "&zeetrf;"], [0, "&iiota;"], [2, "&bernou;"], [0, "&Cayleys;"], [1, "&escr;"], [0, "&Escr;"], [0, "&Fouriertrf;"], [1, "&Mellintrf;"], [0, "&order;"], [0, "&alefsym;"], [0, "&beth;"], [0, "&gimel;"], [0, "&daleth;"], [12, "&CapitalDifferentialD;"], [0, "&dd;"], [0, "&ee;"], [0, "&ii;"], [10, "&frac13;"], [0, "&frac23;"], [0, "&frac15;"], [0, "&frac25;"], [0, "&frac35;"], [0, "&frac45;"], [0, "&frac16;"], [0, "&frac56;"], [0, "&frac18;"], [0, "&frac38;"], [0, "&frac58;"], [0, "&frac78;"], [49, "&larr;"], [0, "&ShortUpArrow;"], [0, "&rarr;"], [0, "&darr;"], [0, "&harr;"], [0, "&updownarrow;"], [0, "&nwarr;"], [0, "&nearr;"], [0, "&LowerRightArrow;"], [0, "&LowerLeftArrow;"], [0, "&nlarr;"], [0, "&nrarr;"], [1, { v: "&rarrw;", n: 824, o: "&nrarrw;" }], [0, "&Larr;"], [0, "&Uarr;"], [0, "&Rarr;"], [0, "&Darr;"], [0, "&larrtl;"], [0, "&rarrtl;"], [0, "&LeftTeeArrow;"], [0, "&mapstoup;"], [0, "&map;"], [0, "&DownTeeArrow;"], [1, "&hookleftarrow;"], [0, "&hookrightarrow;"], [0, "&larrlp;"], [0, "&looparrowright;"], [0, "&harrw;"], [0, "&nharr;"], [1, "&lsh;"], [0, "&rsh;"], [0, "&ldsh;"], [0, "&rdsh;"], [1, "&crarr;"], [0, "&cularr;"], [0, "&curarr;"], [2, "&circlearrowleft;"], [0, "&circlearrowright;"], [0, "&leftharpoonup;"], [0, "&DownLeftVector;"], [0, "&RightUpVector;"], [0, "&LeftUpVector;"], [0, "&rharu;"], [0, "&DownRightVector;"], [0, "&dharr;"], [0, "&dharl;"], [0, "&RightArrowLeftArrow;"], [0, "&udarr;"], [0, "&LeftArrowRightArrow;"], [0, "&leftleftarrows;"], [0, "&upuparrows;"], [0, "&rightrightarrows;"], [0, "&ddarr;"], [0, "&leftrightharpoons;"], [0, "&Equilibrium;"], [0, "&nlArr;"], [0, "&nhArr;"], [0, "&nrArr;"], [0, "&DoubleLeftArrow;"], [0, "&DoubleUpArrow;"], [0, "&DoubleRightArrow;"], [0, "&dArr;"], [0, "&DoubleLeftRightArrow;"], [0, "&DoubleUpDownArrow;"], [0, "&nwArr;"], [0, "&neArr;"], [0, "&seArr;"], [0, "&swArr;"], [0, "&lAarr;"], [0, "&rAarr;"], [1, "&zigrarr;"], [6, "&larrb;"], [0, "&rarrb;"], [15, "&DownArrowUpArrow;"], [7, "&loarr;"], [0, "&roarr;"], [0, "&hoarr;"], [0, "&forall;"], [0, "&comp;"], [0, { v: "&part;", n: 824, o: "&npart;" }], [0, "&exist;"], [0, "&nexist;"], [0, "&empty;"], [1, "&Del;"], [0, "&Element;"], [0, "&NotElement;"], [1, "&ni;"], [0, "&notni;"], [2, "&prod;"], [0, "&coprod;"], [0, "&sum;"], [0, "&minus;"], [0, "&MinusPlus;"], [0, "&dotplus;"], [1, "&Backslash;"], [0, "&lowast;"], [0, "&compfn;"], [1, "&radic;"], [2, "&prop;"], [0, "&infin;"], [0, "&angrt;"], [0, { v: "&ang;", n: 8402, o: "&nang;" }], [0, "&angmsd;"], [0, "&angsph;"], [0, "&mid;"], [0, "&nmid;"], [0, "&DoubleVerticalBar;"], [0, "&NotDoubleVerticalBar;"], [0, "&and;"], [0, "&or;"], [0, { v: "&cap;", n: 65024, o: "&caps;" }], [0, { v: "&cup;", n: 65024, o: "&cups;" }], [0, "&int;"], [0, "&Int;"], [0, "&iiint;"], [0, "&conint;"], [0, "&Conint;"], [0, "&Cconint;"], [0, "&cwint;"], [0, "&ClockwiseContourIntegral;"], [0, "&awconint;"], [0, "&there4;"], [0, "&becaus;"], [0, "&ratio;"], [0, "&Colon;"], [0, "&dotminus;"], [1, "&mDDot;"], [0, "&homtht;"], [0, { v: "&sim;", n: 8402, o: "&nvsim;" }], [0, { v: "&backsim;", n: 817, o: "&race;" }], [0, { v: "&ac;", n: 819, o: "&acE;" }], [0, "&acd;"], [0, "&VerticalTilde;"], [0, "&NotTilde;"], [0, { v: "&eqsim;", n: 824, o: "&nesim;" }], [0, "&sime;"], [0, "&NotTildeEqual;"], [0, "&cong;"], [0, "&simne;"], [0, "&ncong;"], [0, "&ap;"], [0, "&nap;"], [0, "&ape;"], [0, { v: "&apid;", n: 824, o: "&napid;" }], [0, "&backcong;"], [0, { v: "&asympeq;", n: 8402, o: "&nvap;" }], [0, { v: "&bump;", n: 824, o: "&nbump;" }], [0, { v: "&bumpe;", n: 824, o: "&nbumpe;" }], [0, { v: "&doteq;", n: 824, o: "&nedot;" }], [0, "&doteqdot;"], [0, "&efDot;"], [0, "&erDot;"], [0, "&Assign;"], [0, "&ecolon;"], [0, "&ecir;"], [0, "&circeq;"], [1, "&wedgeq;"], [0, "&veeeq;"], [1, "&triangleq;"], [2, "&equest;"], [0, "&ne;"], [0, { v: "&Congruent;", n: 8421, o: "&bnequiv;" }], [0, "&nequiv;"], [1, { v: "&le;", n: 8402, o: "&nvle;" }], [0, { v: "&ge;", n: 8402, o: "&nvge;" }], [0, { v: "&lE;", n: 824, o: "&nlE;" }], [0, { v: "&gE;", n: 824, o: "&ngE;" }], [0, { v: "&lnE;", n: 65024, o: "&lvertneqq;" }], [0, { v: "&gnE;", n: 65024, o: "&gvertneqq;" }], [0, { v: "&ll;", n: new Map(/* #__PURE__ */ restoreDiff([[824, "&nLtv;"], [7577, "&nLt;"]])) }], [0, { v: "&gg;", n: new Map(/* #__PURE__ */ restoreDiff([[824, "&nGtv;"], [7577, "&nGt;"]])) }], [0, "&between;"], [0, "&NotCupCap;"], [0, "&nless;"], [0, "&ngt;"], [0, "&nle;"], [0, "&nge;"], [0, "&lesssim;"], [0, "&GreaterTilde;"], [0, "&nlsim;"], [0, "&ngsim;"], [0, "&LessGreater;"], [0, "&gl;"], [0, "&NotLessGreater;"], [0, "&NotGreaterLess;"], [0, "&pr;"], [0, "&sc;"], [0, "&prcue;"], [0, "&sccue;"], [0, "&PrecedesTilde;"], [0, { v: "&scsim;", n: 824, o: "&NotSucceedsTilde;" }], [0, "&NotPrecedes;"], [0, "&NotSucceeds;"], [0, { v: "&sub;", n: 8402, o: "&NotSubset;" }], [0, { v: "&sup;", n: 8402, o: "&NotSuperset;" }], [0, "&nsub;"], [0, "&nsup;"], [0, "&sube;"], [0, "&supe;"], [0, "&NotSubsetEqual;"], [0, "&NotSupersetEqual;"], [0, { v: "&subne;", n: 65024, o: "&varsubsetneq;" }], [0, { v: "&supne;", n: 65024, o: "&varsupsetneq;" }], [1, "&cupdot;"], [0, "&UnionPlus;"], [0, { v: "&sqsub;", n: 824, o: "&NotSquareSubset;" }], [0, { v: "&sqsup;", n: 824, o: "&NotSquareSuperset;" }], [0, "&sqsube;"], [0, "&sqsupe;"], [0, { v: "&sqcap;", n: 65024, o: "&sqcaps;" }], [0, { v: "&sqcup;", n: 65024, o: "&sqcups;" }], [0, "&CirclePlus;"], [0, "&CircleMinus;"], [0, "&CircleTimes;"], [0, "&osol;"], [0, "&CircleDot;"], [0, "&circledcirc;"], [0, "&circledast;"], [1, "&circleddash;"], [0, "&boxplus;"], [0, "&boxminus;"], [0, "&boxtimes;"], [0, "&dotsquare;"], [0, "&RightTee;"], [0, "&dashv;"], [0, "&DownTee;"], [0, "&bot;"], [1, "&models;"], [0, "&DoubleRightTee;"], [0, "&Vdash;"], [0, "&Vvdash;"], [0, "&VDash;"], [0, "&nvdash;"], [0, "&nvDash;"], [0, "&nVdash;"], [0, "&nVDash;"], [0, "&prurel;"], [1, "&LeftTriangle;"], [0, "&RightTriangle;"], [0, { v: "&LeftTriangleEqual;", n: 8402, o: "&nvltrie;" }], [0, { v: "&RightTriangleEqual;", n: 8402, o: "&nvrtrie;" }], [0, "&origof;"], [0, "&imof;"], [0, "&multimap;"], [0, "&hercon;"], [0, "&intcal;"], [0, "&veebar;"], [1, "&barvee;"], [0, "&angrtvb;"], [0, "&lrtri;"], [0, "&bigwedge;"], [0, "&bigvee;"], [0, "&bigcap;"], [0, "&bigcup;"], [0, "&diam;"], [0, "&sdot;"], [0, "&sstarf;"], [0, "&divideontimes;"], [0, "&bowtie;"], [0, "&ltimes;"], [0, "&rtimes;"], [0, "&leftthreetimes;"], [0, "&rightthreetimes;"], [0, "&backsimeq;"], [0, "&curlyvee;"], [0, "&curlywedge;"], [0, "&Sub;"], [0, "&Sup;"], [0, "&Cap;"], [0, "&Cup;"], [0, "&fork;"], [0, "&epar;"], [0, "&lessdot;"], [0, "&gtdot;"], [0, { v: "&Ll;", n: 824, o: "&nLl;" }], [0, { v: "&Gg;", n: 824, o: "&nGg;" }], [0, { v: "&leg;", n: 65024, o: "&lesg;" }], [0, { v: "&gel;", n: 65024, o: "&gesl;" }], [2, "&cuepr;"], [0, "&cuesc;"], [0, "&NotPrecedesSlantEqual;"], [0, "&NotSucceedsSlantEqual;"], [0, "&NotSquareSubsetEqual;"], [0, "&NotSquareSupersetEqual;"], [2, "&lnsim;"], [0, "&gnsim;"], [0, "&precnsim;"], [0, "&scnsim;"], [0, "&nltri;"], [0, "&NotRightTriangle;"], [0, "&nltrie;"], [0, "&NotRightTriangleEqual;"], [0, "&vellip;"], [0, "&ctdot;"], [0, "&utdot;"], [0, "&dtdot;"], [0, "&disin;"], [0, "&isinsv;"], [0, "&isins;"], [0, { v: "&isindot;", n: 824, o: "&notindot;" }], [0, "&notinvc;"], [0, "&notinvb;"], [1, { v: "&isinE;", n: 824, o: "&notinE;" }], [0, "&nisd;"], [0, "&xnis;"], [0, "&nis;"], [0, "&notnivc;"], [0, "&notnivb;"], [6, "&barwed;"], [0, "&Barwed;"], [1, "&lceil;"], [0, "&rceil;"], [0, "&LeftFloor;"], [0, "&rfloor;"], [0, "&drcrop;"], [0, "&dlcrop;"], [0, "&urcrop;"], [0, "&ulcrop;"], [0, "&bnot;"], [1, "&profline;"], [0, "&profsurf;"], [1, "&telrec;"], [0, "&target;"], [5, "&ulcorn;"], [0, "&urcorn;"], [0, "&dlcorn;"], [0, "&drcorn;"], [2, "&frown;"], [0, "&smile;"], [9, "&cylcty;"], [0, "&profalar;"], [7, "&topbot;"], [6, "&ovbar;"], [1, "&solbar;"], [60, "&angzarr;"], [51, "&lmoustache;"], [0, "&rmoustache;"], [2, "&OverBracket;"], [0, "&bbrk;"], [0, "&bbrktbrk;"], [37, "&OverParenthesis;"], [0, "&UnderParenthesis;"], [0, "&OverBrace;"], [0, "&UnderBrace;"], [2, "&trpezium;"], [4, "&elinters;"], [59, "&blank;"], [164, "&circledS;"], [55, "&boxh;"], [1, "&boxv;"], [9, "&boxdr;"], [3, "&boxdl;"], [3, "&boxur;"], [3, "&boxul;"], [3, "&boxvr;"], [7, "&boxvl;"], [7, "&boxhd;"], [7, "&boxhu;"], [7, "&boxvh;"], [19, "&boxH;"], [0, "&boxV;"], [0, "&boxdR;"], [0, "&boxDr;"], [0, "&boxDR;"], [0, "&boxdL;"], [0, "&boxDl;"], [0, "&boxDL;"], [0, "&boxuR;"], [0, "&boxUr;"], [0, "&boxUR;"], [0, "&boxuL;"], [0, "&boxUl;"], [0, "&boxUL;"], [0, "&boxvR;"], [0, "&boxVr;"], [0, "&boxVR;"], [0, "&boxvL;"], [0, "&boxVl;"], [0, "&boxVL;"], [0, "&boxHd;"], [0, "&boxhD;"], [0, "&boxHD;"], [0, "&boxHu;"], [0, "&boxhU;"], [0, "&boxHU;"], [0, "&boxvH;"], [0, "&boxVh;"], [0, "&boxVH;"], [19, "&uhblk;"], [3, "&lhblk;"], [3, "&block;"], [8, "&blk14;"], [0, "&blk12;"], [0, "&blk34;"], [13, "&square;"], [8, "&blacksquare;"], [0, "&EmptyVerySmallSquare;"], [1, "&rect;"], [0, "&marker;"], [2, "&fltns;"], [1, "&bigtriangleup;"], [0, "&blacktriangle;"], [0, "&triangle;"], [2, "&blacktriangleright;"], [0, "&rtri;"], [3, "&bigtriangledown;"], [0, "&blacktriangledown;"], [0, "&dtri;"], [2, "&blacktriangleleft;"], [0, "&ltri;"], [6, "&loz;"], [0, "&cir;"], [32, "&tridot;"], [2, "&bigcirc;"], [8, "&ultri;"], [0, "&urtri;"], [0, "&lltri;"], [0, "&EmptySmallSquare;"], [0, "&FilledSmallSquare;"], [8, "&bigstar;"], [0, "&star;"], [7, "&phone;"], [49, "&female;"], [1, "&male;"], [29, "&spades;"], [2, "&clubs;"], [1, "&hearts;"], [0, "&diamondsuit;"], [3, "&sung;"], [2, "&flat;"], [0, "&natural;"], [0, "&sharp;"], [163, "&check;"], [3, "&cross;"], [8, "&malt;"], [21, "&sext;"], [33, "&VerticalSeparator;"], [25, "&lbbrk;"], [0, "&rbbrk;"], [84, "&bsolhsub;"], [0, "&suphsol;"], [28, "&LeftDoubleBracket;"], [0, "&RightDoubleBracket;"], [0, "&lang;"], [0, "&rang;"], [0, "&Lang;"], [0, "&Rang;"], [0, "&loang;"], [0, "&roang;"], [7, "&longleftarrow;"], [0, "&longrightarrow;"], [0, "&longleftrightarrow;"], [0, "&DoubleLongLeftArrow;"], [0, "&DoubleLongRightArrow;"], [0, "&DoubleLongLeftRightArrow;"], [1, "&longmapsto;"], [2, "&dzigrarr;"], [258, "&nvlArr;"], [0, "&nvrArr;"], [0, "&nvHarr;"], [0, "&Map;"], [6, "&lbarr;"], [0, "&bkarow;"], [0, "&lBarr;"], [0, "&dbkarow;"], [0, "&drbkarow;"], [0, "&DDotrahd;"], [0, "&UpArrowBar;"], [0, "&DownArrowBar;"], [2, "&Rarrtl;"], [2, "&latail;"], [0, "&ratail;"], [0, "&lAtail;"], [0, "&rAtail;"], [0, "&larrfs;"], [0, "&rarrfs;"], [0, "&larrbfs;"], [0, "&rarrbfs;"], [2, "&nwarhk;"], [0, "&nearhk;"], [0, "&hksearow;"], [0, "&hkswarow;"], [0, "&nwnear;"], [0, "&nesear;"], [0, "&seswar;"], [0, "&swnwar;"], [8, { v: "&rarrc;", n: 824, o: "&nrarrc;" }], [1, "&cudarrr;"], [0, "&ldca;"], [0, "&rdca;"], [0, "&cudarrl;"], [0, "&larrpl;"], [2, "&curarrm;"], [0, "&cularrp;"], [7, "&rarrpl;"], [2, "&harrcir;"], [0, "&Uarrocir;"], [0, "&lurdshar;"], [0, "&ldrushar;"], [2, "&LeftRightVector;"], [0, "&RightUpDownVector;"], [0, "&DownLeftRightVector;"], [0, "&LeftUpDownVector;"], [0, "&LeftVectorBar;"], [0, "&RightVectorBar;"], [0, "&RightUpVectorBar;"], [0, "&RightDownVectorBar;"], [0, "&DownLeftVectorBar;"], [0, "&DownRightVectorBar;"], [0, "&LeftUpVectorBar;"], [0, "&LeftDownVectorBar;"], [0, "&LeftTeeVector;"], [0, "&RightTeeVector;"], [0, "&RightUpTeeVector;"], [0, "&RightDownTeeVector;"], [0, "&DownLeftTeeVector;"], [0, "&DownRightTeeVector;"], [0, "&LeftUpTeeVector;"], [0, "&LeftDownTeeVector;"], [0, "&lHar;"], [0, "&uHar;"], [0, "&rHar;"], [0, "&dHar;"], [0, "&luruhar;"], [0, "&ldrdhar;"], [0, "&ruluhar;"], [0, "&rdldhar;"], [0, "&lharul;"], [0, "&llhard;"], [0, "&rharul;"], [0, "&lrhard;"], [0, "&udhar;"], [0, "&duhar;"], [0, "&RoundImplies;"], [0, "&erarr;"], [0, "&simrarr;"], [0, "&larrsim;"], [0, "&rarrsim;"], [0, "&rarrap;"], [0, "&ltlarr;"], [1, "&gtrarr;"], [0, "&subrarr;"], [1, "&suplarr;"], [0, "&lfisht;"], [0, "&rfisht;"], [0, "&ufisht;"], [0, "&dfisht;"], [5, "&lopar;"], [0, "&ropar;"], [4, "&lbrke;"], [0, "&rbrke;"], [0, "&lbrkslu;"], [0, "&rbrksld;"], [0, "&lbrksld;"], [0, "&rbrkslu;"], [0, "&langd;"], [0, "&rangd;"], [0, "&lparlt;"], [0, "&rpargt;"], [0, "&gtlPar;"], [0, "&ltrPar;"], [3, "&vzigzag;"], [1, "&vangrt;"], [0, "&angrtvbd;"], [6, "&ange;"], [0, "&range;"], [0, "&dwangle;"], [0, "&uwangle;"], [0, "&angmsdaa;"], [0, "&angmsdab;"], [0, "&angmsdac;"], [0, "&angmsdad;"], [0, "&angmsdae;"], [0, "&angmsdaf;"], [0, "&angmsdag;"], [0, "&angmsdah;"], [0, "&bemptyv;"], [0, "&demptyv;"], [0, "&cemptyv;"], [0, "&raemptyv;"], [0, "&laemptyv;"], [0, "&ohbar;"], [0, "&omid;"], [0, "&opar;"], [1, "&operp;"], [1, "&olcross;"], [0, "&odsold;"], [1, "&olcir;"], [0, "&ofcir;"], [0, "&olt;"], [0, "&ogt;"], [0, "&cirscir;"], [0, "&cirE;"], [0, "&solb;"], [0, "&bsolb;"], [3, "&boxbox;"], [3, "&trisb;"], [0, "&rtriltri;"], [0, { v: "&LeftTriangleBar;", n: 824, o: "&NotLeftTriangleBar;" }], [0, { v: "&RightTriangleBar;", n: 824, o: "&NotRightTriangleBar;" }], [11, "&iinfin;"], [0, "&infintie;"], [0, "&nvinfin;"], [4, "&eparsl;"], [0, "&smeparsl;"], [0, "&eqvparsl;"], [5, "&blacklozenge;"], [8, "&RuleDelayed;"], [1, "&dsol;"], [9, "&bigodot;"], [0, "&bigoplus;"], [0, "&bigotimes;"], [1, "&biguplus;"], [1, "&bigsqcup;"], [5, "&iiiint;"], [0, "&fpartint;"], [2, "&cirfnint;"], [0, "&awint;"], [0, "&rppolint;"], [0, "&scpolint;"], [0, "&npolint;"], [0, "&pointint;"], [0, "&quatint;"], [0, "&intlarhk;"], [10, "&pluscir;"], [0, "&plusacir;"], [0, "&simplus;"], [0, "&plusdu;"], [0, "&plussim;"], [0, "&plustwo;"], [1, "&mcomma;"], [0, "&minusdu;"], [2, "&loplus;"], [0, "&roplus;"], [0, "&Cross;"], [0, "&timesd;"], [0, "&timesbar;"], [1, "&smashp;"], [0, "&lotimes;"], [0, "&rotimes;"], [0, "&otimesas;"], [0, "&Otimes;"], [0, "&odiv;"], [0, "&triplus;"], [0, "&triminus;"], [0, "&tritime;"], [0, "&intprod;"], [2, "&amalg;"], [0, "&capdot;"], [1, "&ncup;"], [0, "&ncap;"], [0, "&capand;"], [0, "&cupor;"], [0, "&cupcap;"], [0, "&capcup;"], [0, "&cupbrcap;"], [0, "&capbrcup;"], [0, "&cupcup;"], [0, "&capcap;"], [0, "&ccups;"], [0, "&ccaps;"], [2, "&ccupssm;"], [2, "&And;"], [0, "&Or;"], [0, "&andand;"], [0, "&oror;"], [0, "&orslope;"], [0, "&andslope;"], [1, "&andv;"], [0, "&orv;"], [0, "&andd;"], [0, "&ord;"], [1, "&wedbar;"], [6, "&sdote;"], [3, "&simdot;"], [2, { v: "&congdot;", n: 824, o: "&ncongdot;" }], [0, "&easter;"], [0, "&apacir;"], [0, { v: "&apE;", n: 824, o: "&napE;" }], [0, "&eplus;"], [0, "&pluse;"], [0, "&Esim;"], [0, "&Colone;"], [0, "&Equal;"], [1, "&ddotseq;"], [0, "&equivDD;"], [0, "&ltcir;"], [0, "&gtcir;"], [0, "&ltquest;"], [0, "&gtquest;"], [0, { v: "&leqslant;", n: 824, o: "&nleqslant;" }], [0, { v: "&geqslant;", n: 824, o: "&ngeqslant;" }], [0, "&lesdot;"], [0, "&gesdot;"], [0, "&lesdoto;"], [0, "&gesdoto;"], [0, "&lesdotor;"], [0, "&gesdotol;"], [0, "&lap;"], [0, "&gap;"], [0, "&lne;"], [0, "&gne;"], [0, "&lnap;"], [0, "&gnap;"], [0, "&lEg;"], [0, "&gEl;"], [0, "&lsime;"], [0, "&gsime;"], [0, "&lsimg;"], [0, "&gsiml;"], [0, "&lgE;"], [0, "&glE;"], [0, "&lesges;"], [0, "&gesles;"], [0, "&els;"], [0, "&egs;"], [0, "&elsdot;"], [0, "&egsdot;"], [0, "&el;"], [0, "&eg;"], [2, "&siml;"], [0, "&simg;"], [0, "&simlE;"], [0, "&simgE;"], [0, { v: "&LessLess;", n: 824, o: "&NotNestedLessLess;" }], [0, { v: "&GreaterGreater;", n: 824, o: "&NotNestedGreaterGreater;" }], [1, "&glj;"], [0, "&gla;"], [0, "&ltcc;"], [0, "&gtcc;"], [0, "&lescc;"], [0, "&gescc;"], [0, "&smt;"], [0, "&lat;"], [0, { v: "&smte;", n: 65024, o: "&smtes;" }], [0, { v: "&late;", n: 65024, o: "&lates;" }], [0, "&bumpE;"], [0, { v: "&PrecedesEqual;", n: 824, o: "&NotPrecedesEqual;" }], [0, { v: "&sce;", n: 824, o: "&NotSucceedsEqual;" }], [2, "&prE;"], [0, "&scE;"], [0, "&precneqq;"], [0, "&scnE;"], [0, "&prap;"], [0, "&scap;"], [0, "&precnapprox;"], [0, "&scnap;"], [0, "&Pr;"], [0, "&Sc;"], [0, "&subdot;"], [0, "&supdot;"], [0, "&subplus;"], [0, "&supplus;"], [0, "&submult;"], [0, "&supmult;"], [0, "&subedot;"], [0, "&supedot;"], [0, { v: "&subE;", n: 824, o: "&nsubE;" }], [0, { v: "&supE;", n: 824, o: "&nsupE;" }], [0, "&subsim;"], [0, "&supsim;"], [2, { v: "&subnE;", n: 65024, o: "&varsubsetneqq;" }], [0, { v: "&supnE;", n: 65024, o: "&varsupsetneqq;" }], [2, "&csub;"], [0, "&csup;"], [0, "&csube;"], [0, "&csupe;"], [0, "&subsup;"], [0, "&supsub;"], [0, "&subsub;"], [0, "&supsup;"], [0, "&suphsub;"], [0, "&supdsub;"], [0, "&forkv;"], [0, "&topfork;"], [0, "&mlcp;"], [8, "&Dashv;"], [1, "&Vdashl;"], [0, "&Barv;"], [0, "&vBar;"], [0, "&vBarv;"], [1, "&Vbar;"], [0, "&Not;"], [0, "&bNot;"], [0, "&rnmid;"], [0, "&cirmid;"], [0, "&midcir;"], [0, "&topcir;"], [0, "&nhpar;"], [0, "&parsim;"], [9, { v: "&parsl;", n: 8421, o: "&nparsl;" }], [44343, { n: new Map(/* #__PURE__ */ restoreDiff([[56476, "&Ascr;"], [1, "&Cscr;"], [0, "&Dscr;"], [2, "&Gscr;"], [2, "&Jscr;"], [0, "&Kscr;"], [2, "&Nscr;"], [0, "&Oscr;"], [0, "&Pscr;"], [0, "&Qscr;"], [1, "&Sscr;"], [0, "&Tscr;"], [0, "&Uscr;"], [0, "&Vscr;"], [0, "&Wscr;"], [0, "&Xscr;"], [0, "&Yscr;"], [0, "&Zscr;"], [0, "&ascr;"], [0, "&bscr;"], [0, "&cscr;"], [0, "&dscr;"], [1, "&fscr;"], [1, "&hscr;"], [0, "&iscr;"], [0, "&jscr;"], [0, "&kscr;"], [0, "&lscr;"], [0, "&mscr;"], [0, "&nscr;"], [1, "&pscr;"], [0, "&qscr;"], [0, "&rscr;"], [0, "&sscr;"], [0, "&tscr;"], [0, "&uscr;"], [0, "&vscr;"], [0, "&wscr;"], [0, "&xscr;"], [0, "&yscr;"], [0, "&zscr;"], [52, "&Afr;"], [0, "&Bfr;"], [1, "&Dfr;"], [0, "&Efr;"], [0, "&Ffr;"], [0, "&Gfr;"], [2, "&Jfr;"], [0, "&Kfr;"], [0, "&Lfr;"], [0, "&Mfr;"], [0, "&Nfr;"], [0, "&Ofr;"], [0, "&Pfr;"], [0, "&Qfr;"], [1, "&Sfr;"], [0, "&Tfr;"], [0, "&Ufr;"], [0, "&Vfr;"], [0, "&Wfr;"], [0, "&Xfr;"], [0, "&Yfr;"], [1, "&afr;"], [0, "&bfr;"], [0, "&cfr;"], [0, "&dfr;"], [0, "&efr;"], [0, "&ffr;"], [0, "&gfr;"], [0, "&hfr;"], [0, "&ifr;"], [0, "&jfr;"], [0, "&kfr;"], [0, "&lfr;"], [0, "&mfr;"], [0, "&nfr;"], [0, "&ofr;"], [0, "&pfr;"], [0, "&qfr;"], [0, "&rfr;"], [0, "&sfr;"], [0, "&tfr;"], [0, "&ufr;"], [0, "&vfr;"], [0, "&wfr;"], [0, "&xfr;"], [0, "&yfr;"], [0, "&zfr;"], [0, "&Aopf;"], [0, "&Bopf;"], [1, "&Dopf;"], [0, "&Eopf;"], [0, "&Fopf;"], [0, "&Gopf;"], [1, "&Iopf;"], [0, "&Jopf;"], [0, "&Kopf;"], [0, "&Lopf;"], [0, "&Mopf;"], [1, "&Oopf;"], [3, "&Sopf;"], [0, "&Topf;"], [0, "&Uopf;"], [0, "&Vopf;"], [0, "&Wopf;"], [0, "&Xopf;"], [0, "&Yopf;"], [1, "&aopf;"], [0, "&bopf;"], [0, "&copf;"], [0, "&dopf;"], [0, "&eopf;"], [0, "&fopf;"], [0, "&gopf;"], [0, "&hopf;"], [0, "&iopf;"], [0, "&jopf;"], [0, "&kopf;"], [0, "&lopf;"], [0, "&mopf;"], [0, "&nopf;"], [0, "&oopf;"], [0, "&popf;"], [0, "&qopf;"], [0, "&ropf;"], [0, "&sopf;"], [0, "&topf;"], [0, "&uopf;"], [0, "&vopf;"], [0, "&wopf;"], [0, "&xopf;"], [0, "&yopf;"], [0, "&zopf;"]])) }], [8906, "&fflig;"], [0, "&filig;"], [0, "&fllig;"], [0, "&ffilig;"], [0, "&ffllig;"]])));
			//# sourceMappingURL=encode-html.js.map
		},
		'./node_modules/entities/lib/esm/index.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				DecodingMode: function () {
					return /* reexport safe */ _decode_js__WEBPACK_IMPORTED_MODULE_0__.DecodingMode;
				},
				EncodingMode: function () {
					return EncodingMode;
				},
				EntityDecoder: function () {
					return /* reexport safe */ _decode_js__WEBPACK_IMPORTED_MODULE_0__.EntityDecoder;
				},
				EntityLevel: function () {
					return EntityLevel;
				},
				decode: function () {
					return decode;
				},
				decodeHTML: function () {
					return /* reexport safe */ _decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeHTML;
				},
				decodeHTML4: function () {
					return /* reexport safe */ _decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeHTML;
				},
				decodeHTML4Strict: function () {
					return /* reexport safe */ _decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeHTMLStrict;
				},
				decodeHTML5: function () {
					return /* reexport safe */ _decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeHTML;
				},
				decodeHTML5Strict: function () {
					return /* reexport safe */ _decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeHTMLStrict;
				},
				decodeHTMLAttribute: function () {
					return /* reexport safe */ _decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeHTMLAttribute;
				},
				decodeHTMLStrict: function () {
					return /* reexport safe */ _decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeHTMLStrict;
				},
				decodeStrict: function () {
					return decodeStrict;
				},
				decodeXML: function () {
					return /* reexport safe */ _decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeXML;
				},
				decodeXMLStrict: function () {
					return /* reexport safe */ _decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeXML;
				},
				encode: function () {
					return encode;
				},
				encodeHTML: function () {
					return /* reexport safe */ _encode_js__WEBPACK_IMPORTED_MODULE_1__.encodeHTML;
				},
				encodeHTML4: function () {
					return /* reexport safe */ _encode_js__WEBPACK_IMPORTED_MODULE_1__.encodeHTML;
				},
				encodeHTML5: function () {
					return /* reexport safe */ _encode_js__WEBPACK_IMPORTED_MODULE_1__.encodeHTML;
				},
				encodeNonAsciiHTML: function () {
					return /* reexport safe */ _encode_js__WEBPACK_IMPORTED_MODULE_1__.encodeNonAsciiHTML;
				},
				encodeXML: function () {
					return /* reexport safe */ _escape_js__WEBPACK_IMPORTED_MODULE_2__.encodeXML;
				},
				escape: function () {
					return /* reexport safe */ _escape_js__WEBPACK_IMPORTED_MODULE_2__.escape;
				},
				escapeAttribute: function () {
					return /* reexport safe */ _escape_js__WEBPACK_IMPORTED_MODULE_2__.escapeAttribute;
				},
				escapeText: function () {
					return /* reexport safe */ _escape_js__WEBPACK_IMPORTED_MODULE_2__.escapeText;
				},
				escapeUTF8: function () {
					return /* reexport safe */ _escape_js__WEBPACK_IMPORTED_MODULE_2__.escapeUTF8;
				}
			});
			/* harmony import */ var _decode_js__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! ./decode.js */ './node_modules/entities/lib/esm/decode.js'
				);
			/* harmony import */ var _encode_js__WEBPACK_IMPORTED_MODULE_1__ =
				__webpack_require__(
					/*! ./encode.js */ './node_modules/entities/lib/esm/encode.js'
				);
			/* harmony import */ var _escape_js__WEBPACK_IMPORTED_MODULE_2__ =
				__webpack_require__(
					/*! ./escape.js */ './node_modules/entities/lib/esm/escape.js'
				);

			/** The level of entities to support. */
			var EntityLevel;
			(function (EntityLevel) {
				/** Support only XML entities. */
				EntityLevel[(EntityLevel['XML'] = 0)] = 'XML';
				/** Support HTML entities, which are a superset of XML entities. */
				EntityLevel[(EntityLevel['HTML'] = 1)] = 'HTML';
			})(EntityLevel || (EntityLevel = {}));
			var EncodingMode;
			(function (EncodingMode) {
				/**
				 * The output is UTF-8 encoded. Only characters that need escaping within
				 * XML will be escaped.
				 */
				EncodingMode[(EncodingMode['UTF8'] = 0)] = 'UTF8';
				/**
				 * The output consists only of ASCII characters. Characters that need
				 * escaping within HTML, and characters that aren't ASCII characters will
				 * be escaped.
				 */
				EncodingMode[(EncodingMode['ASCII'] = 1)] = 'ASCII';
				/**
				 * Encode all characters that have an equivalent entity, as well as all
				 * characters that are not ASCII characters.
				 */
				EncodingMode[(EncodingMode['Extensive'] = 2)] = 'Extensive';
				/**
				 * Encode all characters that have to be escaped in HTML attributes,
				 * following {@link https://html.spec.whatwg.org/multipage/parsing.html#escapingString}.
				 */
				EncodingMode[(EncodingMode['Attribute'] = 3)] = 'Attribute';
				/**
				 * Encode all characters that have to be escaped in HTML text,
				 * following {@link https://html.spec.whatwg.org/multipage/parsing.html#escapingString}.
				 */
				EncodingMode[(EncodingMode['Text'] = 4)] = 'Text';
			})(EncodingMode || (EncodingMode = {}));
			/**
			 * Decodes a string with entities.
			 *
			 * @param data String to decode.
			 * @param options Decoding options.
			 */
			function decode(data, options = EntityLevel.XML) {
				const level =
					typeof options === 'number' ? options : options.level;
				if (level === EntityLevel.HTML) {
					const mode =
						typeof options === 'object' ? options.mode : undefined;
					return (0,
					_decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeHTML)(
						data,
						mode
					);
				}
				return (0, _decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeXML)(
					data
				);
			}
			/**
			 * Decodes a string with entities. Does not allow missing trailing semicolons for entities.
			 *
			 * @param data String to decode.
			 * @param options Decoding options.
			 * @deprecated Use `decode` with the `mode` set to `Strict`.
			 */
			function decodeStrict(data, options = EntityLevel.XML) {
				var _a;
				const opts =
					typeof options === 'number' ? { level: options } : options;
				(_a = opts.mode) !== null && _a !== void 0
					? _a
					: (opts.mode =
							_decode_js__WEBPACK_IMPORTED_MODULE_0__.DecodingMode.Strict);
				return decode(data, opts);
			}
			/**
			 * Encodes a string with entities.
			 *
			 * @param data String to encode.
			 * @param options Encoding options.
			 */
			function encode(data, options = EntityLevel.XML) {
				const opts =
					typeof options === 'number' ? { level: options } : options;
				// Mode `UTF8` just escapes XML entities
				if (opts.mode === EncodingMode.UTF8)
					return (0,
					_escape_js__WEBPACK_IMPORTED_MODULE_2__.escapeUTF8)(data);
				if (opts.mode === EncodingMode.Attribute)
					return (0,
					_escape_js__WEBPACK_IMPORTED_MODULE_2__.escapeAttribute)(
						data
					);
				if (opts.mode === EncodingMode.Text)
					return (0,
					_escape_js__WEBPACK_IMPORTED_MODULE_2__.escapeText)(data);
				if (opts.level === EntityLevel.HTML) {
					if (opts.mode === EncodingMode.ASCII) {
						return (0,
						_encode_js__WEBPACK_IMPORTED_MODULE_1__.encodeNonAsciiHTML)(
							data
						);
					}
					return (0,
					_encode_js__WEBPACK_IMPORTED_MODULE_1__.encodeHTML)(data);
				}
				// ASCII and Extensive are equivalent
				return (0, _escape_js__WEBPACK_IMPORTED_MODULE_2__.encodeXML)(
					data
				);
			}

			//# sourceMappingURL=index.js.map
		},
		'./node_modules/function-timeout/browser.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				default: function () {
					return functionTimeout;
				},
				isTimeoutError: function () {
					return isTimeoutError;
				}
			});
			// Even though the browser version is a no-op, we wrap it to ensure consistent behavior.
			function functionTimeout(function_) {
				const wrappedFunction = (...arguments_) =>
					function_(...arguments_);

				Object.defineProperty(wrappedFunction, 'name', {
					value: `functionTimeout(${function_.name || '<anonymous>'})`,
					configurable: true
				});

				return wrappedFunction;
			}

			function isTimeoutError() {
				return false;
			}
		},
		'./node_modules/htmlparser2/lib/esm/Parser.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				Parser: function () {
					return Parser;
				}
			});
			/* harmony import */ var _Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! ./Tokenizer.js */ './node_modules/htmlparser2/lib/esm/Tokenizer.js'
				);
			/* harmony import */ var entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_1__ =
				__webpack_require__(
					/*! entities/lib/decode.js */ './node_modules/entities/lib/esm/decode.js'
				);

			const formTags = new Set([
				'input',
				'option',
				'optgroup',
				'select',
				'button',
				'datalist',
				'textarea'
			]);
			const pTag = new Set(['p']);
			const tableSectionTags = new Set(['thead', 'tbody']);
			const ddtTags = new Set(['dd', 'dt']);
			const rtpTags = new Set(['rt', 'rp']);
			const openImpliesClose = new Map([
				['tr', new Set(['tr', 'th', 'td'])],
				['th', new Set(['th'])],
				['td', new Set(['thead', 'th', 'td'])],
				['body', new Set(['head', 'link', 'script'])],
				['li', new Set(['li'])],
				['p', pTag],
				['h1', pTag],
				['h2', pTag],
				['h3', pTag],
				['h4', pTag],
				['h5', pTag],
				['h6', pTag],
				['select', formTags],
				['input', formTags],
				['output', formTags],
				['button', formTags],
				['datalist', formTags],
				['textarea', formTags],
				['option', new Set(['option'])],
				['optgroup', new Set(['optgroup', 'option'])],
				['dd', ddtTags],
				['dt', ddtTags],
				['address', pTag],
				['article', pTag],
				['aside', pTag],
				['blockquote', pTag],
				['details', pTag],
				['div', pTag],
				['dl', pTag],
				['fieldset', pTag],
				['figcaption', pTag],
				['figure', pTag],
				['footer', pTag],
				['form', pTag],
				['header', pTag],
				['hr', pTag],
				['main', pTag],
				['nav', pTag],
				['ol', pTag],
				['pre', pTag],
				['section', pTag],
				['table', pTag],
				['ul', pTag],
				['rt', rtpTags],
				['rp', rtpTags],
				['tbody', tableSectionTags],
				['tfoot', tableSectionTags]
			]);
			const voidElements = new Set([
				'area',
				'base',
				'basefont',
				'br',
				'col',
				'command',
				'embed',
				'frame',
				'hr',
				'img',
				'input',
				'isindex',
				'keygen',
				'link',
				'meta',
				'param',
				'source',
				'track',
				'wbr'
			]);
			const foreignContextElements = new Set(['math', 'svg']);
			const htmlIntegrationElements = new Set([
				'mi',
				'mo',
				'mn',
				'ms',
				'mtext',
				'annotation-xml',
				'foreignobject',
				'desc',
				'title'
			]);
			const reNameEnd = /\s|\//;
			class Parser {
				constructor(cbs, options = {}) {
					var _a, _b, _c, _d, _e, _f;
					this.options = options;
					/** The start index of the last event. */
					this.startIndex = 0;
					/** The end index of the last event. */
					this.endIndex = 0;
					/**
					 * Store the start index of the current open tag,
					 * so we can update the start index for attributes.
					 */
					this.openTagStart = 0;
					this.tagname = '';
					this.attribname = '';
					this.attribvalue = '';
					this.attribs = null;
					this.stack = [];
					this.buffers = [];
					this.bufferOffset = 0;
					/** The index of the last written buffer. Used when resuming after a `pause()`. */
					this.writeIndex = 0;
					/** Indicates whether the parser has finished running / `.end` has been called. */
					this.ended = false;
					this.cbs = cbs !== null && cbs !== void 0 ? cbs : {};
					this.htmlMode = !this.options.xmlMode;
					this.lowerCaseTagNames =
						(_a = options.lowerCaseTags) !== null && _a !== void 0
							? _a
							: this.htmlMode;
					this.lowerCaseAttributeNames =
						(_b = options.lowerCaseAttributeNames) !== null &&
						_b !== void 0
							? _b
							: this.htmlMode;
					this.recognizeSelfClosing =
						(_c = options.recognizeSelfClosing) !== null &&
						_c !== void 0
							? _c
							: !this.htmlMode;
					this.tokenizer = new (
						(_d = options.Tokenizer) !== null && _d !== void 0
							? _d
							: _Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__[
									'default'
								]
					)(this.options, this);
					this.foreignContext = [!this.htmlMode];
					(_f = (_e = this.cbs).onparserinit) === null ||
					_f === void 0
						? void 0
						: _f.call(_e, this);
				}
				// Tokenizer event handlers
				/** @internal */
				ontext(start, endIndex) {
					var _a, _b;
					const data = this.getSlice(start, endIndex);
					this.endIndex = endIndex - 1;
					(_b = (_a = this.cbs).ontext) === null || _b === void 0
						? void 0
						: _b.call(_a, data);
					this.startIndex = endIndex;
				}
				/** @internal */
				ontextentity(cp, endIndex) {
					var _a, _b;
					this.endIndex = endIndex - 1;
					(_b = (_a = this.cbs).ontext) === null || _b === void 0
						? void 0
						: _b.call(
								_a,
								(0,
								entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_1__.fromCodePoint)(
									cp
								)
							);
					this.startIndex = endIndex;
				}
				/**
				 * Checks if the current tag is a void element. Override this if you want
				 * to specify your own additional void elements.
				 */
				isVoidElement(name) {
					return this.htmlMode && voidElements.has(name);
				}
				/** @internal */
				onopentagname(start, endIndex) {
					this.endIndex = endIndex;
					let name = this.getSlice(start, endIndex);
					if (this.lowerCaseTagNames) {
						name = name.toLowerCase();
					}
					this.emitOpenTag(name);
				}
				emitOpenTag(name) {
					var _a, _b, _c, _d;
					this.openTagStart = this.startIndex;
					this.tagname = name;
					const impliesClose =
						this.htmlMode && openImpliesClose.get(name);
					if (impliesClose) {
						while (
							this.stack.length > 0 &&
							impliesClose.has(this.stack[0])
						) {
							const element = this.stack.shift();
							(_b = (_a = this.cbs).onclosetag) === null ||
							_b === void 0
								? void 0
								: _b.call(_a, element, true);
						}
					}
					if (!this.isVoidElement(name)) {
						this.stack.unshift(name);
						if (this.htmlMode) {
							if (foreignContextElements.has(name)) {
								this.foreignContext.unshift(true);
							} else if (htmlIntegrationElements.has(name)) {
								this.foreignContext.unshift(false);
							}
						}
					}
					(_d = (_c = this.cbs).onopentagname) === null ||
					_d === void 0
						? void 0
						: _d.call(_c, name);
					if (this.cbs.onopentag) this.attribs = {};
				}
				endOpenTag(isImplied) {
					var _a, _b;
					this.startIndex = this.openTagStart;
					if (this.attribs) {
						(_b = (_a = this.cbs).onopentag) === null ||
						_b === void 0
							? void 0
							: _b.call(
									_a,
									this.tagname,
									this.attribs,
									isImplied
								);
						this.attribs = null;
					}
					if (
						this.cbs.onclosetag &&
						this.isVoidElement(this.tagname)
					) {
						this.cbs.onclosetag(this.tagname, true);
					}
					this.tagname = '';
				}
				/** @internal */
				onopentagend(endIndex) {
					this.endIndex = endIndex;
					this.endOpenTag(false);
					// Set `startIndex` for next node
					this.startIndex = endIndex + 1;
				}
				/** @internal */
				onclosetag(start, endIndex) {
					var _a, _b, _c, _d, _e, _f, _g, _h;
					this.endIndex = endIndex;
					let name = this.getSlice(start, endIndex);
					if (this.lowerCaseTagNames) {
						name = name.toLowerCase();
					}
					if (
						this.htmlMode &&
						(foreignContextElements.has(name) ||
							htmlIntegrationElements.has(name))
					) {
						this.foreignContext.shift();
					}
					if (!this.isVoidElement(name)) {
						const pos = this.stack.indexOf(name);
						if (pos !== -1) {
							for (let index = 0; index <= pos; index++) {
								const element = this.stack.shift();
								// We know the stack has sufficient elements.
								(_b = (_a = this.cbs).onclosetag) === null ||
								_b === void 0
									? void 0
									: _b.call(_a, element, index !== pos);
							}
						} else if (this.htmlMode && name === 'p') {
							// Implicit open before close
							this.emitOpenTag('p');
							this.closeCurrentTag(true);
						}
					} else if (this.htmlMode && name === 'br') {
						// We can't use `emitOpenTag` for implicit open, as `br` would be implicitly closed.
						(_d = (_c = this.cbs).onopentagname) === null ||
						_d === void 0
							? void 0
							: _d.call(_c, 'br');
						(_f = (_e = this.cbs).onopentag) === null ||
						_f === void 0
							? void 0
							: _f.call(_e, 'br', {}, true);
						(_h = (_g = this.cbs).onclosetag) === null ||
						_h === void 0
							? void 0
							: _h.call(_g, 'br', false);
					}
					// Set `startIndex` for next node
					this.startIndex = endIndex + 1;
				}
				/** @internal */
				onselfclosingtag(endIndex) {
					this.endIndex = endIndex;
					if (this.recognizeSelfClosing || this.foreignContext[0]) {
						this.closeCurrentTag(false);
						// Set `startIndex` for next node
						this.startIndex = endIndex + 1;
					} else {
						// Ignore the fact that the tag is self-closing.
						this.onopentagend(endIndex);
					}
				}
				closeCurrentTag(isOpenImplied) {
					var _a, _b;
					const name = this.tagname;
					this.endOpenTag(isOpenImplied);
					// Self-closing tags will be on the top of the stack
					if (this.stack[0] === name) {
						// If the opening tag isn't implied, the closing tag has to be implied.
						(_b = (_a = this.cbs).onclosetag) === null ||
						_b === void 0
							? void 0
							: _b.call(_a, name, !isOpenImplied);
						this.stack.shift();
					}
				}
				/** @internal */
				onattribname(start, endIndex) {
					this.startIndex = start;
					const name = this.getSlice(start, endIndex);
					this.attribname = this.lowerCaseAttributeNames
						? name.toLowerCase()
						: name;
				}
				/** @internal */
				onattribdata(start, endIndex) {
					this.attribvalue += this.getSlice(start, endIndex);
				}
				/** @internal */
				onattribentity(cp) {
					this.attribvalue += (0,
					entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_1__.fromCodePoint)(
						cp
					);
				}
				/** @internal */
				onattribend(quote, endIndex) {
					var _a, _b;
					this.endIndex = endIndex;
					(_b = (_a = this.cbs).onattribute) === null || _b === void 0
						? void 0
						: _b.call(
								_a,
								this.attribname,
								this.attribvalue,
								quote ===
									_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__
										.QuoteType.Double
									? '"'
									: quote ===
										  _Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__
												.QuoteType.Single
										? "'"
										: quote ===
											  _Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__
													.QuoteType.NoValue
											? undefined
											: null
							);
					if (
						this.attribs &&
						!Object.prototype.hasOwnProperty.call(
							this.attribs,
							this.attribname
						)
					) {
						this.attribs[this.attribname] = this.attribvalue;
					}
					this.attribvalue = '';
				}
				getInstructionName(value) {
					const index = value.search(reNameEnd);
					let name = index < 0 ? value : value.substr(0, index);
					if (this.lowerCaseTagNames) {
						name = name.toLowerCase();
					}
					return name;
				}
				/** @internal */
				ondeclaration(start, endIndex) {
					this.endIndex = endIndex;
					const value = this.getSlice(start, endIndex);
					if (this.cbs.onprocessinginstruction) {
						const name = this.getInstructionName(value);
						this.cbs.onprocessinginstruction(
							`!${name}`,
							`!${value}`
						);
					}
					// Set `startIndex` for next node
					this.startIndex = endIndex + 1;
				}
				/** @internal */
				onprocessinginstruction(start, endIndex) {
					this.endIndex = endIndex;
					const value = this.getSlice(start, endIndex);
					if (this.cbs.onprocessinginstruction) {
						const name = this.getInstructionName(value);
						this.cbs.onprocessinginstruction(
							`?${name}`,
							`?${value}`
						);
					}
					// Set `startIndex` for next node
					this.startIndex = endIndex + 1;
				}
				/** @internal */
				oncomment(start, endIndex, offset) {
					var _a, _b, _c, _d;
					this.endIndex = endIndex;
					(_b = (_a = this.cbs).oncomment) === null || _b === void 0
						? void 0
						: _b.call(_a, this.getSlice(start, endIndex - offset));
					(_d = (_c = this.cbs).oncommentend) === null ||
					_d === void 0
						? void 0
						: _d.call(_c);
					// Set `startIndex` for next node
					this.startIndex = endIndex + 1;
				}
				/** @internal */
				oncdata(start, endIndex, offset) {
					var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
					this.endIndex = endIndex;
					const value = this.getSlice(start, endIndex - offset);
					if (!this.htmlMode || this.options.recognizeCDATA) {
						(_b = (_a = this.cbs).oncdatastart) === null ||
						_b === void 0
							? void 0
							: _b.call(_a);
						(_d = (_c = this.cbs).ontext) === null || _d === void 0
							? void 0
							: _d.call(_c, value);
						(_f = (_e = this.cbs).oncdataend) === null ||
						_f === void 0
							? void 0
							: _f.call(_e);
					} else {
						(_h = (_g = this.cbs).oncomment) === null ||
						_h === void 0
							? void 0
							: _h.call(_g, `[CDATA[${value}]]`);
						(_k = (_j = this.cbs).oncommentend) === null ||
						_k === void 0
							? void 0
							: _k.call(_j);
					}
					// Set `startIndex` for next node
					this.startIndex = endIndex + 1;
				}
				/** @internal */
				onend() {
					var _a, _b;
					if (this.cbs.onclosetag) {
						// Set the end index for all remaining tags
						this.endIndex = this.startIndex;
						for (
							let index = 0;
							index < this.stack.length;
							index++
						) {
							this.cbs.onclosetag(this.stack[index], true);
						}
					}
					(_b = (_a = this.cbs).onend) === null || _b === void 0
						? void 0
						: _b.call(_a);
				}
				/**
				 * Resets the parser to a blank state, ready to parse a new HTML document
				 */
				reset() {
					var _a, _b, _c, _d;
					(_b = (_a = this.cbs).onreset) === null || _b === void 0
						? void 0
						: _b.call(_a);
					this.tokenizer.reset();
					this.tagname = '';
					this.attribname = '';
					this.attribs = null;
					this.stack.length = 0;
					this.startIndex = 0;
					this.endIndex = 0;
					(_d = (_c = this.cbs).onparserinit) === null ||
					_d === void 0
						? void 0
						: _d.call(_c, this);
					this.buffers.length = 0;
					this.foreignContext.length = 0;
					this.foreignContext.unshift(!this.htmlMode);
					this.bufferOffset = 0;
					this.writeIndex = 0;
					this.ended = false;
				}
				/**
				 * Resets the parser, then parses a complete document and
				 * pushes it to the handler.
				 *
				 * @param data Document to parse.
				 */
				parseComplete(data) {
					this.reset();
					this.end(data);
				}
				getSlice(start, end) {
					while (
						start - this.bufferOffset >=
						this.buffers[0].length
					) {
						this.shiftBuffer();
					}
					let slice = this.buffers[0].slice(
						start - this.bufferOffset,
						end - this.bufferOffset
					);
					while (end - this.bufferOffset > this.buffers[0].length) {
						this.shiftBuffer();
						slice += this.buffers[0].slice(
							0,
							end - this.bufferOffset
						);
					}
					return slice;
				}
				shiftBuffer() {
					this.bufferOffset += this.buffers[0].length;
					this.writeIndex--;
					this.buffers.shift();
				}
				/**
				 * Parses a chunk of data and calls the corresponding callbacks.
				 *
				 * @param chunk Chunk to parse.
				 */
				write(chunk) {
					var _a, _b;
					if (this.ended) {
						(_b = (_a = this.cbs).onerror) === null || _b === void 0
							? void 0
							: _b.call(_a, new Error('.write() after done!'));
						return;
					}
					this.buffers.push(chunk);
					if (this.tokenizer.running) {
						this.tokenizer.write(chunk);
						this.writeIndex++;
					}
				}
				/**
				 * Parses the end of the buffer and clears the stack, calls onend.
				 *
				 * @param chunk Optional final chunk to parse.
				 */
				end(chunk) {
					var _a, _b;
					if (this.ended) {
						(_b = (_a = this.cbs).onerror) === null || _b === void 0
							? void 0
							: _b.call(_a, new Error('.end() after done!'));
						return;
					}
					if (chunk) this.write(chunk);
					this.ended = true;
					this.tokenizer.end();
				}
				/**
				 * Pauses parsing. The parser won't emit events until `resume` is called.
				 */
				pause() {
					this.tokenizer.pause();
				}
				/**
				 * Resumes parsing after `pause` was called.
				 */
				resume() {
					this.tokenizer.resume();
					while (
						this.tokenizer.running &&
						this.writeIndex < this.buffers.length
					) {
						this.tokenizer.write(this.buffers[this.writeIndex++]);
					}
					if (this.ended) this.tokenizer.end();
				}
				/**
				 * Alias of `write`, for backwards compatibility.
				 *
				 * @param chunk Chunk to parse.
				 * @deprecated
				 */
				parseChunk(chunk) {
					this.write(chunk);
				}
				/**
				 * Alias of `end`, for backwards compatibility.
				 *
				 * @param chunk Optional final chunk to parse.
				 * @deprecated
				 */
				done(chunk) {
					this.end(chunk);
				}
			}
			//# sourceMappingURL=Parser.js.map
		},
		'./node_modules/htmlparser2/lib/esm/Tokenizer.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				QuoteType: function () {
					return QuoteType;
				},
				default: function () {
					return Tokenizer;
				}
			});
			/* harmony import */ var entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! entities/lib/decode.js */ './node_modules/entities/lib/esm/decode.js'
				);

			var CharCodes;
			(function (CharCodes) {
				CharCodes[(CharCodes['Tab'] = 9)] = 'Tab';
				CharCodes[(CharCodes['NewLine'] = 10)] = 'NewLine';
				CharCodes[(CharCodes['FormFeed'] = 12)] = 'FormFeed';
				CharCodes[(CharCodes['CarriageReturn'] = 13)] =
					'CarriageReturn';
				CharCodes[(CharCodes['Space'] = 32)] = 'Space';
				CharCodes[(CharCodes['ExclamationMark'] = 33)] =
					'ExclamationMark';
				CharCodes[(CharCodes['Number'] = 35)] = 'Number';
				CharCodes[(CharCodes['Amp'] = 38)] = 'Amp';
				CharCodes[(CharCodes['SingleQuote'] = 39)] = 'SingleQuote';
				CharCodes[(CharCodes['DoubleQuote'] = 34)] = 'DoubleQuote';
				CharCodes[(CharCodes['Dash'] = 45)] = 'Dash';
				CharCodes[(CharCodes['Slash'] = 47)] = 'Slash';
				CharCodes[(CharCodes['Zero'] = 48)] = 'Zero';
				CharCodes[(CharCodes['Nine'] = 57)] = 'Nine';
				CharCodes[(CharCodes['Semi'] = 59)] = 'Semi';
				CharCodes[(CharCodes['Lt'] = 60)] = 'Lt';
				CharCodes[(CharCodes['Eq'] = 61)] = 'Eq';
				CharCodes[(CharCodes['Gt'] = 62)] = 'Gt';
				CharCodes[(CharCodes['Questionmark'] = 63)] = 'Questionmark';
				CharCodes[(CharCodes['UpperA'] = 65)] = 'UpperA';
				CharCodes[(CharCodes['LowerA'] = 97)] = 'LowerA';
				CharCodes[(CharCodes['UpperF'] = 70)] = 'UpperF';
				CharCodes[(CharCodes['LowerF'] = 102)] = 'LowerF';
				CharCodes[(CharCodes['UpperZ'] = 90)] = 'UpperZ';
				CharCodes[(CharCodes['LowerZ'] = 122)] = 'LowerZ';
				CharCodes[(CharCodes['LowerX'] = 120)] = 'LowerX';
				CharCodes[(CharCodes['OpeningSquareBracket'] = 91)] =
					'OpeningSquareBracket';
			})(CharCodes || (CharCodes = {}));
			/** All the states the tokenizer can be in. */
			var State;
			(function (State) {
				State[(State['Text'] = 1)] = 'Text';
				State[(State['BeforeTagName'] = 2)] = 'BeforeTagName';
				State[(State['InTagName'] = 3)] = 'InTagName';
				State[(State['InSelfClosingTag'] = 4)] = 'InSelfClosingTag';
				State[(State['BeforeClosingTagName'] = 5)] =
					'BeforeClosingTagName';
				State[(State['InClosingTagName'] = 6)] = 'InClosingTagName';
				State[(State['AfterClosingTagName'] = 7)] =
					'AfterClosingTagName';
				// Attributes
				State[(State['BeforeAttributeName'] = 8)] =
					'BeforeAttributeName';
				State[(State['InAttributeName'] = 9)] = 'InAttributeName';
				State[(State['AfterAttributeName'] = 10)] =
					'AfterAttributeName';
				State[(State['BeforeAttributeValue'] = 11)] =
					'BeforeAttributeValue';
				State[(State['InAttributeValueDq'] = 12)] =
					'InAttributeValueDq';
				State[(State['InAttributeValueSq'] = 13)] =
					'InAttributeValueSq';
				State[(State['InAttributeValueNq'] = 14)] =
					'InAttributeValueNq';
				// Declarations
				State[(State['BeforeDeclaration'] = 15)] = 'BeforeDeclaration';
				State[(State['InDeclaration'] = 16)] = 'InDeclaration';
				// Processing instructions
				State[(State['InProcessingInstruction'] = 17)] =
					'InProcessingInstruction';
				// Comments & CDATA
				State[(State['BeforeComment'] = 18)] = 'BeforeComment';
				State[(State['CDATASequence'] = 19)] = 'CDATASequence';
				State[(State['InSpecialComment'] = 20)] = 'InSpecialComment';
				State[(State['InCommentLike'] = 21)] = 'InCommentLike';
				// Special tags
				State[(State['BeforeSpecialS'] = 22)] = 'BeforeSpecialS';
				State[(State['BeforeSpecialT'] = 23)] = 'BeforeSpecialT';
				State[(State['SpecialStartSequence'] = 24)] =
					'SpecialStartSequence';
				State[(State['InSpecialTag'] = 25)] = 'InSpecialTag';
				State[(State['InEntity'] = 26)] = 'InEntity';
			})(State || (State = {}));
			function isWhitespace(c) {
				return (
					c === CharCodes.Space ||
					c === CharCodes.NewLine ||
					c === CharCodes.Tab ||
					c === CharCodes.FormFeed ||
					c === CharCodes.CarriageReturn
				);
			}
			function isEndOfTagSection(c) {
				return (
					c === CharCodes.Slash ||
					c === CharCodes.Gt ||
					isWhitespace(c)
				);
			}
			function isASCIIAlpha(c) {
				return (
					(c >= CharCodes.LowerA && c <= CharCodes.LowerZ) ||
					(c >= CharCodes.UpperA && c <= CharCodes.UpperZ)
				);
			}
			var QuoteType;
			(function (QuoteType) {
				QuoteType[(QuoteType['NoValue'] = 0)] = 'NoValue';
				QuoteType[(QuoteType['Unquoted'] = 1)] = 'Unquoted';
				QuoteType[(QuoteType['Single'] = 2)] = 'Single';
				QuoteType[(QuoteType['Double'] = 3)] = 'Double';
			})(QuoteType || (QuoteType = {}));
			/**
			 * Sequences used to match longer strings.
			 *
			 * We don't have `Script`, `Style`, or `Title` here. Instead, we re-use the *End
			 * sequences with an increased offset.
			 */
			const Sequences = {
				Cdata: new Uint8Array([0x43, 0x44, 0x41, 0x54, 0x41, 0x5b]), // CDATA[
				CdataEnd: new Uint8Array([0x5d, 0x5d, 0x3e]), // ]]>
				CommentEnd: new Uint8Array([0x2d, 0x2d, 0x3e]), // `-->`
				ScriptEnd: new Uint8Array([
					0x3c, 0x2f, 0x73, 0x63, 0x72, 0x69, 0x70, 0x74
				]), // `</script`
				StyleEnd: new Uint8Array([
					0x3c, 0x2f, 0x73, 0x74, 0x79, 0x6c, 0x65
				]), // `</style`
				TitleEnd: new Uint8Array([
					0x3c, 0x2f, 0x74, 0x69, 0x74, 0x6c, 0x65
				]), // `</title`
				TextareaEnd: new Uint8Array([
					0x3c, 0x2f, 0x74, 0x65, 0x78, 0x74, 0x61, 0x72, 0x65, 0x61
				]) // `</textarea`
			};
			class Tokenizer {
				constructor({ xmlMode = false, decodeEntities = true }, cbs) {
					this.cbs = cbs;
					/** The current state the tokenizer is in. */
					this.state = State.Text;
					/** The read buffer. */
					this.buffer = '';
					/** The beginning of the section that is currently being read. */
					this.sectionStart = 0;
					/** The index within the buffer that we are currently looking at. */
					this.index = 0;
					/** The start of the last entity. */
					this.entityStart = 0;
					/** Some behavior, eg. when decoding entities, is done while we are in another state. This keeps track of the other state type. */
					this.baseState = State.Text;
					/** For special parsing behavior inside of script and style tags. */
					this.isSpecial = false;
					/** Indicates whether the tokenizer has been paused. */
					this.running = true;
					/** The offset of the current buffer. */
					this.offset = 0;
					this.currentSequence = undefined;
					this.sequenceIndex = 0;
					this.xmlMode = xmlMode;
					this.decodeEntities = decodeEntities;
					this.entityDecoder =
						new entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_0__.EntityDecoder(
							xmlMode
								? entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_0__.xmlDecodeTree
								: entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_0__.htmlDecodeTree,
							(cp, consumed) => this.emitCodePoint(cp, consumed)
						);
				}
				reset() {
					this.state = State.Text;
					this.buffer = '';
					this.sectionStart = 0;
					this.index = 0;
					this.baseState = State.Text;
					this.currentSequence = undefined;
					this.running = true;
					this.offset = 0;
				}
				write(chunk) {
					this.offset += this.buffer.length;
					this.buffer = chunk;
					this.parse();
				}
				end() {
					if (this.running) this.finish();
				}
				pause() {
					this.running = false;
				}
				resume() {
					this.running = true;
					if (this.index < this.buffer.length + this.offset) {
						this.parse();
					}
				}
				stateText(c) {
					if (
						c === CharCodes.Lt ||
						(!this.decodeEntities &&
							this.fastForwardTo(CharCodes.Lt))
					) {
						if (this.index > this.sectionStart) {
							this.cbs.ontext(this.sectionStart, this.index);
						}
						this.state = State.BeforeTagName;
						this.sectionStart = this.index;
					} else if (this.decodeEntities && c === CharCodes.Amp) {
						this.startEntity();
					}
				}
				stateSpecialStartSequence(c) {
					const isEnd =
						this.sequenceIndex === this.currentSequence.length;
					const isMatch = isEnd
						? // If we are at the end of the sequence, make sure the tag name has ended
							isEndOfTagSection(c)
						: // Otherwise, do a case-insensitive comparison
							(c | 0x20) ===
							this.currentSequence[this.sequenceIndex];
					if (!isMatch) {
						this.isSpecial = false;
					} else if (!isEnd) {
						this.sequenceIndex++;
						return;
					}
					this.sequenceIndex = 0;
					this.state = State.InTagName;
					this.stateInTagName(c);
				}
				/** Look for an end tag. For <title> tags, also decode entities. */
				stateInSpecialTag(c) {
					if (this.sequenceIndex === this.currentSequence.length) {
						if (c === CharCodes.Gt || isWhitespace(c)) {
							const endOfText =
								this.index - this.currentSequence.length;
							if (this.sectionStart < endOfText) {
								// Spoof the index so that reported locations match up.
								const actualIndex = this.index;
								this.index = endOfText;
								this.cbs.ontext(this.sectionStart, endOfText);
								this.index = actualIndex;
							}
							this.isSpecial = false;
							this.sectionStart = endOfText + 2; // Skip over the `</`
							this.stateInClosingTagName(c);
							return; // We are done; skip the rest of the function.
						}
						this.sequenceIndex = 0;
					}
					if (
						(c | 0x20) ===
						this.currentSequence[this.sequenceIndex]
					) {
						this.sequenceIndex += 1;
					} else if (this.sequenceIndex === 0) {
						if (this.currentSequence === Sequences.TitleEnd) {
							// We have to parse entities in <title> tags.
							if (this.decodeEntities && c === CharCodes.Amp) {
								this.startEntity();
							}
						} else if (this.fastForwardTo(CharCodes.Lt)) {
							// Outside of <title> tags, we can fast-forward.
							this.sequenceIndex = 1;
						}
					} else {
						// If we see a `<`, set the sequence index to 1; useful for eg. `<</script>`.
						this.sequenceIndex = Number(c === CharCodes.Lt);
					}
				}
				stateCDATASequence(c) {
					if (c === Sequences.Cdata[this.sequenceIndex]) {
						if (++this.sequenceIndex === Sequences.Cdata.length) {
							this.state = State.InCommentLike;
							this.currentSequence = Sequences.CdataEnd;
							this.sequenceIndex = 0;
							this.sectionStart = this.index + 1;
						}
					} else {
						this.sequenceIndex = 0;
						this.state = State.InDeclaration;
						this.stateInDeclaration(c); // Reconsume the character
					}
				}
				/**
				 * When we wait for one specific character, we can speed things up
				 * by skipping through the buffer until we find it.
				 *
				 * @returns Whether the character was found.
				 */
				fastForwardTo(c) {
					while (++this.index < this.buffer.length + this.offset) {
						if (
							this.buffer.charCodeAt(this.index - this.offset) ===
							c
						) {
							return true;
						}
					}
					/*
					 * We increment the index at the end of the `parse` loop,
					 * so set it to `buffer.length - 1` here.
					 *
					 * TODO: Refactor `parse` to increment index before calling states.
					 */
					this.index = this.buffer.length + this.offset - 1;
					return false;
				}
				/**
				 * Comments and CDATA end with `-->` and `]]>`.
				 *
				 * Their common qualities are:
				 * - Their end sequences have a distinct character they start with.
				 * - That character is then repeated, so we have to check multiple repeats.
				 * - All characters but the start character of the sequence can be skipped.
				 */
				stateInCommentLike(c) {
					if (c === this.currentSequence[this.sequenceIndex]) {
						if (
							++this.sequenceIndex === this.currentSequence.length
						) {
							if (this.currentSequence === Sequences.CdataEnd) {
								this.cbs.oncdata(
									this.sectionStart,
									this.index,
									2
								);
							} else {
								this.cbs.oncomment(
									this.sectionStart,
									this.index,
									2
								);
							}
							this.sequenceIndex = 0;
							this.sectionStart = this.index + 1;
							this.state = State.Text;
						}
					} else if (this.sequenceIndex === 0) {
						// Fast-forward to the first character of the sequence
						if (this.fastForwardTo(this.currentSequence[0])) {
							this.sequenceIndex = 1;
						}
					} else if (
						c !== this.currentSequence[this.sequenceIndex - 1]
					) {
						// Allow long sequences, eg. --->, ]]]>
						this.sequenceIndex = 0;
					}
				}
				/**
				 * HTML only allows ASCII alpha characters (a-z and A-Z) at the beginning of a tag name.
				 *
				 * XML allows a lot more characters here (@see https://www.w3.org/TR/REC-xml/#NT-NameStartChar).
				 * We allow anything that wouldn't end the tag.
				 */
				isTagStartChar(c) {
					return this.xmlMode
						? !isEndOfTagSection(c)
						: isASCIIAlpha(c);
				}
				startSpecial(sequence, offset) {
					this.isSpecial = true;
					this.currentSequence = sequence;
					this.sequenceIndex = offset;
					this.state = State.SpecialStartSequence;
				}
				stateBeforeTagName(c) {
					if (c === CharCodes.ExclamationMark) {
						this.state = State.BeforeDeclaration;
						this.sectionStart = this.index + 1;
					} else if (c === CharCodes.Questionmark) {
						this.state = State.InProcessingInstruction;
						this.sectionStart = this.index + 1;
					} else if (this.isTagStartChar(c)) {
						const lower = c | 0x20;
						this.sectionStart = this.index;
						if (this.xmlMode) {
							this.state = State.InTagName;
						} else if (lower === Sequences.ScriptEnd[2]) {
							this.state = State.BeforeSpecialS;
						} else if (lower === Sequences.TitleEnd[2]) {
							this.state = State.BeforeSpecialT;
						} else {
							this.state = State.InTagName;
						}
					} else if (c === CharCodes.Slash) {
						this.state = State.BeforeClosingTagName;
					} else {
						this.state = State.Text;
						this.stateText(c);
					}
				}
				stateInTagName(c) {
					if (isEndOfTagSection(c)) {
						this.cbs.onopentagname(this.sectionStart, this.index);
						this.sectionStart = -1;
						this.state = State.BeforeAttributeName;
						this.stateBeforeAttributeName(c);
					}
				}
				stateBeforeClosingTagName(c) {
					if (isWhitespace(c)) {
						// Ignore
					} else if (c === CharCodes.Gt) {
						this.state = State.Text;
					} else {
						this.state = this.isTagStartChar(c)
							? State.InClosingTagName
							: State.InSpecialComment;
						this.sectionStart = this.index;
					}
				}
				stateInClosingTagName(c) {
					if (c === CharCodes.Gt || isWhitespace(c)) {
						this.cbs.onclosetag(this.sectionStart, this.index);
						this.sectionStart = -1;
						this.state = State.AfterClosingTagName;
						this.stateAfterClosingTagName(c);
					}
				}
				stateAfterClosingTagName(c) {
					// Skip everything until ">"
					if (
						c === CharCodes.Gt ||
						this.fastForwardTo(CharCodes.Gt)
					) {
						this.state = State.Text;
						this.sectionStart = this.index + 1;
					}
				}
				stateBeforeAttributeName(c) {
					if (c === CharCodes.Gt) {
						this.cbs.onopentagend(this.index);
						if (this.isSpecial) {
							this.state = State.InSpecialTag;
							this.sequenceIndex = 0;
						} else {
							this.state = State.Text;
						}
						this.sectionStart = this.index + 1;
					} else if (c === CharCodes.Slash) {
						this.state = State.InSelfClosingTag;
					} else if (!isWhitespace(c)) {
						this.state = State.InAttributeName;
						this.sectionStart = this.index;
					}
				}
				stateInSelfClosingTag(c) {
					if (c === CharCodes.Gt) {
						this.cbs.onselfclosingtag(this.index);
						this.state = State.Text;
						this.sectionStart = this.index + 1;
						this.isSpecial = false; // Reset special state, in case of self-closing special tags
					} else if (!isWhitespace(c)) {
						this.state = State.BeforeAttributeName;
						this.stateBeforeAttributeName(c);
					}
				}
				stateInAttributeName(c) {
					if (c === CharCodes.Eq || isEndOfTagSection(c)) {
						this.cbs.onattribname(this.sectionStart, this.index);
						this.sectionStart = this.index;
						this.state = State.AfterAttributeName;
						this.stateAfterAttributeName(c);
					}
				}
				stateAfterAttributeName(c) {
					if (c === CharCodes.Eq) {
						this.state = State.BeforeAttributeValue;
					} else if (c === CharCodes.Slash || c === CharCodes.Gt) {
						this.cbs.onattribend(
							QuoteType.NoValue,
							this.sectionStart
						);
						this.sectionStart = -1;
						this.state = State.BeforeAttributeName;
						this.stateBeforeAttributeName(c);
					} else if (!isWhitespace(c)) {
						this.cbs.onattribend(
							QuoteType.NoValue,
							this.sectionStart
						);
						this.state = State.InAttributeName;
						this.sectionStart = this.index;
					}
				}
				stateBeforeAttributeValue(c) {
					if (c === CharCodes.DoubleQuote) {
						this.state = State.InAttributeValueDq;
						this.sectionStart = this.index + 1;
					} else if (c === CharCodes.SingleQuote) {
						this.state = State.InAttributeValueSq;
						this.sectionStart = this.index + 1;
					} else if (!isWhitespace(c)) {
						this.sectionStart = this.index;
						this.state = State.InAttributeValueNq;
						this.stateInAttributeValueNoQuotes(c); // Reconsume token
					}
				}
				handleInAttributeValue(c, quote) {
					if (
						c === quote ||
						(!this.decodeEntities && this.fastForwardTo(quote))
					) {
						this.cbs.onattribdata(this.sectionStart, this.index);
						this.sectionStart = -1;
						this.cbs.onattribend(
							quote === CharCodes.DoubleQuote
								? QuoteType.Double
								: QuoteType.Single,
							this.index + 1
						);
						this.state = State.BeforeAttributeName;
					} else if (this.decodeEntities && c === CharCodes.Amp) {
						this.startEntity();
					}
				}
				stateInAttributeValueDoubleQuotes(c) {
					this.handleInAttributeValue(c, CharCodes.DoubleQuote);
				}
				stateInAttributeValueSingleQuotes(c) {
					this.handleInAttributeValue(c, CharCodes.SingleQuote);
				}
				stateInAttributeValueNoQuotes(c) {
					if (isWhitespace(c) || c === CharCodes.Gt) {
						this.cbs.onattribdata(this.sectionStart, this.index);
						this.sectionStart = -1;
						this.cbs.onattribend(QuoteType.Unquoted, this.index);
						this.state = State.BeforeAttributeName;
						this.stateBeforeAttributeName(c);
					} else if (this.decodeEntities && c === CharCodes.Amp) {
						this.startEntity();
					}
				}
				stateBeforeDeclaration(c) {
					if (c === CharCodes.OpeningSquareBracket) {
						this.state = State.CDATASequence;
						this.sequenceIndex = 0;
					} else {
						this.state =
							c === CharCodes.Dash
								? State.BeforeComment
								: State.InDeclaration;
					}
				}
				stateInDeclaration(c) {
					if (
						c === CharCodes.Gt ||
						this.fastForwardTo(CharCodes.Gt)
					) {
						this.cbs.ondeclaration(this.sectionStart, this.index);
						this.state = State.Text;
						this.sectionStart = this.index + 1;
					}
				}
				stateInProcessingInstruction(c) {
					if (
						c === CharCodes.Gt ||
						this.fastForwardTo(CharCodes.Gt)
					) {
						this.cbs.onprocessinginstruction(
							this.sectionStart,
							this.index
						);
						this.state = State.Text;
						this.sectionStart = this.index + 1;
					}
				}
				stateBeforeComment(c) {
					if (c === CharCodes.Dash) {
						this.state = State.InCommentLike;
						this.currentSequence = Sequences.CommentEnd;
						// Allow short comments (eg. <!-->)
						this.sequenceIndex = 2;
						this.sectionStart = this.index + 1;
					} else {
						this.state = State.InDeclaration;
					}
				}
				stateInSpecialComment(c) {
					if (
						c === CharCodes.Gt ||
						this.fastForwardTo(CharCodes.Gt)
					) {
						this.cbs.oncomment(this.sectionStart, this.index, 0);
						this.state = State.Text;
						this.sectionStart = this.index + 1;
					}
				}
				stateBeforeSpecialS(c) {
					const lower = c | 0x20;
					if (lower === Sequences.ScriptEnd[3]) {
						this.startSpecial(Sequences.ScriptEnd, 4);
					} else if (lower === Sequences.StyleEnd[3]) {
						this.startSpecial(Sequences.StyleEnd, 4);
					} else {
						this.state = State.InTagName;
						this.stateInTagName(c); // Consume the token again
					}
				}
				stateBeforeSpecialT(c) {
					const lower = c | 0x20;
					if (lower === Sequences.TitleEnd[3]) {
						this.startSpecial(Sequences.TitleEnd, 4);
					} else if (lower === Sequences.TextareaEnd[3]) {
						this.startSpecial(Sequences.TextareaEnd, 4);
					} else {
						this.state = State.InTagName;
						this.stateInTagName(c); // Consume the token again
					}
				}
				startEntity() {
					this.baseState = this.state;
					this.state = State.InEntity;
					this.entityStart = this.index;
					this.entityDecoder.startEntity(
						this.xmlMode
							? entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_0__
									.DecodingMode.Strict
							: this.baseState === State.Text ||
								  this.baseState === State.InSpecialTag
								? entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_0__
										.DecodingMode.Legacy
								: entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_0__
										.DecodingMode.Attribute
					);
				}
				stateInEntity() {
					const length = this.entityDecoder.write(
						this.buffer,
						this.index - this.offset
					);
					// If `length` is positive, we are done with the entity.
					if (length >= 0) {
						this.state = this.baseState;
						if (length === 0) {
							this.index = this.entityStart;
						}
					} else {
						// Mark buffer as consumed.
						this.index = this.offset + this.buffer.length - 1;
					}
				}
				/**
				 * Remove data that has already been consumed from the buffer.
				 */
				cleanup() {
					// If we are inside of text or attributes, emit what we already have.
					if (this.running && this.sectionStart !== this.index) {
						if (
							this.state === State.Text ||
							(this.state === State.InSpecialTag &&
								this.sequenceIndex === 0)
						) {
							this.cbs.ontext(this.sectionStart, this.index);
							this.sectionStart = this.index;
						} else if (
							this.state === State.InAttributeValueDq ||
							this.state === State.InAttributeValueSq ||
							this.state === State.InAttributeValueNq
						) {
							this.cbs.onattribdata(
								this.sectionStart,
								this.index
							);
							this.sectionStart = this.index;
						}
					}
				}
				shouldContinue() {
					return (
						this.index < this.buffer.length + this.offset &&
						this.running
					);
				}
				/**
				 * Iterates through the buffer, calling the function corresponding to the current state.
				 *
				 * States that are more likely to be hit are higher up, as a performance improvement.
				 */
				parse() {
					while (this.shouldContinue()) {
						const c = this.buffer.charCodeAt(
							this.index - this.offset
						);
						switch (this.state) {
							case State.Text: {
								this.stateText(c);
								break;
							}
							case State.SpecialStartSequence: {
								this.stateSpecialStartSequence(c);
								break;
							}
							case State.InSpecialTag: {
								this.stateInSpecialTag(c);
								break;
							}
							case State.CDATASequence: {
								this.stateCDATASequence(c);
								break;
							}
							case State.InAttributeValueDq: {
								this.stateInAttributeValueDoubleQuotes(c);
								break;
							}
							case State.InAttributeName: {
								this.stateInAttributeName(c);
								break;
							}
							case State.InCommentLike: {
								this.stateInCommentLike(c);
								break;
							}
							case State.InSpecialComment: {
								this.stateInSpecialComment(c);
								break;
							}
							case State.BeforeAttributeName: {
								this.stateBeforeAttributeName(c);
								break;
							}
							case State.InTagName: {
								this.stateInTagName(c);
								break;
							}
							case State.InClosingTagName: {
								this.stateInClosingTagName(c);
								break;
							}
							case State.BeforeTagName: {
								this.stateBeforeTagName(c);
								break;
							}
							case State.AfterAttributeName: {
								this.stateAfterAttributeName(c);
								break;
							}
							case State.InAttributeValueSq: {
								this.stateInAttributeValueSingleQuotes(c);
								break;
							}
							case State.BeforeAttributeValue: {
								this.stateBeforeAttributeValue(c);
								break;
							}
							case State.BeforeClosingTagName: {
								this.stateBeforeClosingTagName(c);
								break;
							}
							case State.AfterClosingTagName: {
								this.stateAfterClosingTagName(c);
								break;
							}
							case State.BeforeSpecialS: {
								this.stateBeforeSpecialS(c);
								break;
							}
							case State.BeforeSpecialT: {
								this.stateBeforeSpecialT(c);
								break;
							}
							case State.InAttributeValueNq: {
								this.stateInAttributeValueNoQuotes(c);
								break;
							}
							case State.InSelfClosingTag: {
								this.stateInSelfClosingTag(c);
								break;
							}
							case State.InDeclaration: {
								this.stateInDeclaration(c);
								break;
							}
							case State.BeforeDeclaration: {
								this.stateBeforeDeclaration(c);
								break;
							}
							case State.BeforeComment: {
								this.stateBeforeComment(c);
								break;
							}
							case State.InProcessingInstruction: {
								this.stateInProcessingInstruction(c);
								break;
							}
							case State.InEntity: {
								this.stateInEntity();
								break;
							}
						}
						this.index++;
					}
					this.cleanup();
				}
				finish() {
					if (this.state === State.InEntity) {
						this.entityDecoder.end();
						this.state = this.baseState;
					}
					this.handleTrailingData();
					this.cbs.onend();
				}
				/** Handle any trailing data. */
				handleTrailingData() {
					const endIndex = this.buffer.length + this.offset;
					// If there is no remaining data, we are done.
					if (this.sectionStart >= endIndex) {
						return;
					}
					if (this.state === State.InCommentLike) {
						if (this.currentSequence === Sequences.CdataEnd) {
							this.cbs.oncdata(this.sectionStart, endIndex, 0);
						} else {
							this.cbs.oncomment(this.sectionStart, endIndex, 0);
						}
					} else if (
						this.state === State.InTagName ||
						this.state === State.BeforeAttributeName ||
						this.state === State.BeforeAttributeValue ||
						this.state === State.AfterAttributeName ||
						this.state === State.InAttributeName ||
						this.state === State.InAttributeValueSq ||
						this.state === State.InAttributeValueDq ||
						this.state === State.InAttributeValueNq ||
						this.state === State.InClosingTagName
					) {
						/*
						 * If we are currently in an opening or closing tag, us not calling the
						 * respective callback signals that the tag should be ignored.
						 */
					} else {
						this.cbs.ontext(this.sectionStart, endIndex);
					}
				}
				emitCodePoint(cp, consumed) {
					if (
						this.baseState !== State.Text &&
						this.baseState !== State.InSpecialTag
					) {
						if (this.sectionStart < this.entityStart) {
							this.cbs.onattribdata(
								this.sectionStart,
								this.entityStart
							);
						}
						this.sectionStart = this.entityStart + consumed;
						this.index = this.sectionStart - 1;
						this.cbs.onattribentity(cp);
					} else {
						if (this.sectionStart < this.entityStart) {
							this.cbs.ontext(
								this.sectionStart,
								this.entityStart
							);
						}
						this.sectionStart = this.entityStart + consumed;
						this.index = this.sectionStart - 1;
						this.cbs.ontextentity(cp, this.sectionStart);
					}
				}
			}
			//# sourceMappingURL=Tokenizer.js.map
		},
		'./node_modules/htmlparser2/lib/esm/index.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				DefaultHandler: function () {
					return /* reexport safe */ domhandler__WEBPACK_IMPORTED_MODULE_1__.DomHandler;
				},
				DomHandler: function () {
					return /* reexport safe */ domhandler__WEBPACK_IMPORTED_MODULE_1__.DomHandler;
				},
				DomUtils: function () {
					return /* reexport module object */ domutils__WEBPACK_IMPORTED_MODULE_4__;
				},
				ElementType: function () {
					return /* reexport module object */ domelementtype__WEBPACK_IMPORTED_MODULE_3__;
				},
				Parser: function () {
					return /* reexport safe */ _Parser_js__WEBPACK_IMPORTED_MODULE_0__.Parser;
				},
				QuoteType: function () {
					return /* reexport safe */ _Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.QuoteType;
				},
				Tokenizer: function () {
					return /* reexport safe */ _Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__[
						'default'
					];
				},
				createDocumentStream: function () {
					return createDocumentStream;
				},
				createDomStream: function () {
					return createDomStream;
				},
				getFeed: function () {
					return /* reexport safe */ domutils__WEBPACK_IMPORTED_MODULE_4__.getFeed;
				},
				parseDOM: function () {
					return parseDOM;
				},
				parseDocument: function () {
					return parseDocument;
				},
				parseFeed: function () {
					return parseFeed;
				}
			});
			/* harmony import */ var _Parser_js__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! ./Parser.js */ './node_modules/htmlparser2/lib/esm/Parser.js'
				);
			/* harmony import */ var domhandler__WEBPACK_IMPORTED_MODULE_1__ =
				__webpack_require__(
					/*! domhandler */ './node_modules/domhandler/lib/esm/index.js'
				);
			/* harmony import */ var _Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__ =
				__webpack_require__(
					/*! ./Tokenizer.js */ './node_modules/htmlparser2/lib/esm/Tokenizer.js'
				);
			/* harmony import */ var domelementtype__WEBPACK_IMPORTED_MODULE_3__ =
				__webpack_require__(
					/*! domelementtype */ './node_modules/domelementtype/lib/esm/index.js'
				);
			/* harmony import */ var domutils__WEBPACK_IMPORTED_MODULE_4__ =
				__webpack_require__(
					/*! domutils */ './node_modules/domutils/lib/esm/index.js'
				);

			// Helper methods
			/**
			 * Parses the data, returns the resulting document.
			 *
			 * @param data The data that should be parsed.
			 * @param options Optional options for the parser and DOM handler.
			 */
			function parseDocument(data, options) {
				const handler =
					new domhandler__WEBPACK_IMPORTED_MODULE_1__.DomHandler(
						undefined,
						options
					);
				new _Parser_js__WEBPACK_IMPORTED_MODULE_0__.Parser(
					handler,
					options
				).end(data);
				return handler.root;
			}
			/**
			 * Parses data, returns an array of the root nodes.
			 *
			 * Note that the root nodes still have a `Document` node as their parent.
			 * Use `parseDocument` to get the `Document` node instead.
			 *
			 * @param data The data that should be parsed.
			 * @param options Optional options for the parser and DOM handler.
			 * @deprecated Use `parseDocument` instead.
			 */
			function parseDOM(data, options) {
				return parseDocument(data, options).children;
			}
			/**
			 * Creates a parser instance, with an attached DOM handler.
			 *
			 * @param callback A callback that will be called once parsing has been completed, with the resulting document.
			 * @param options Optional options for the parser and DOM handler.
			 * @param elementCallback An optional callback that will be called every time a tag has been completed inside of the DOM.
			 */
			function createDocumentStream(callback, options, elementCallback) {
				const handler =
					new domhandler__WEBPACK_IMPORTED_MODULE_1__.DomHandler(
						error => callback(error, handler.root),
						options,
						elementCallback
					);
				return new _Parser_js__WEBPACK_IMPORTED_MODULE_0__.Parser(
					handler,
					options
				);
			}
			/**
			 * Creates a parser instance, with an attached DOM handler.
			 *
			 * @param callback A callback that will be called once parsing has been completed, with an array of root nodes.
			 * @param options Optional options for the parser and DOM handler.
			 * @param elementCallback An optional callback that will be called every time a tag has been completed inside of the DOM.
			 * @deprecated Use `createDocumentStream` instead.
			 */
			function createDomStream(callback, options, elementCallback) {
				const handler =
					new domhandler__WEBPACK_IMPORTED_MODULE_1__.DomHandler(
						callback,
						options,
						elementCallback
					);
				return new _Parser_js__WEBPACK_IMPORTED_MODULE_0__.Parser(
					handler,
					options
				);
			}

			/*
			 * All of the following exports exist for backwards-compatibility.
			 * They should probably be removed eventually.
			 */

			const parseFeedDefaultOptions = { xmlMode: true };
			/**
			 * Parse a feed.
			 *
			 * @param feed The feed that should be parsed, as a string.
			 * @param options Optionally, options for parsing. When using this, you should set `xmlMode` to `true`.
			 */
			function parseFeed(feed, options = parseFeedDefaultOptions) {
				return (0, domutils__WEBPACK_IMPORTED_MODULE_4__.getFeed)(
					parseDOM(feed, options)
				);
			}

			//# sourceMappingURL=index.js.map
		},
		'./node_modules/ip-regex/index.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			const word = '[a-fA-F\\d:]';

			const boundry = options =>
				options && options.includeBoundaries
					? `(?:(?<=\\s|^)(?=${word})|(?<=${word})(?=\\s|$))`
					: '';

			const v4 =
				'(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}';

			const v6segment = '[a-fA-F\\d]{1,4}';

			const v6 = `
(?:
(?:${v6segment}:){7}(?:${v6segment}|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6segment}:){6}(?:${v4}|:${v6segment}|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6segment}:){5}(?::${v4}|(?::${v6segment}){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6segment}:){4}(?:(?::${v6segment}){0,1}:${v4}|(?::${v6segment}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6segment}:){3}(?:(?::${v6segment}){0,2}:${v4}|(?::${v6segment}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6segment}:){2}(?:(?::${v6segment}){0,3}:${v4}|(?::${v6segment}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6segment}:){1}(?:(?::${v6segment}){0,4}:${v4}|(?::${v6segment}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::(?:(?::${v6segment}){0,5}:${v4}|(?::${v6segment}){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1
`
				.replace(/\s*\/\/.*$/gm, '')
				.replace(/\n/g, '')
				.trim();

			// Pre-compile only the exact regexes because adding a global flag make regexes stateful
			const v46Exact = new RegExp(`(?:^${v4}$)|(?:^${v6}$)`);
			const v4exact = new RegExp(`^${v4}$`);
			const v6exact = new RegExp(`^${v6}$`);

			const ipRegex = options =>
				options && options.exact
					? v46Exact
					: new RegExp(
							`(?:${boundry(options)}${v4}${boundry(options)})|(?:${boundry(options)}${v6}${boundry(options)})`,
							'g'
						);

			ipRegex.v4 = options =>
				options && options.exact
					? v4exact
					: new RegExp(
							`${boundry(options)}${v4}${boundry(options)}`,
							'g'
						);
			ipRegex.v6 = options =>
				options && options.exact
					? v6exact
					: new RegExp(
							`${boundry(options)}${v6}${boundry(options)}`,
							'g'
						);

			/* harmony default export */ __webpack_exports__['default'] =
				ipRegex;
		},
		'./node_modules/is-ip/index.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				ipVersion: function () {
					return ipVersion;
				},
				isIP: function () {
					return isIP;
				},
				isIPv4: function () {
					return isIPv4;
				},
				isIPv6: function () {
					return isIPv6;
				}
			});
			/* harmony import */ var ip_regex__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! ip-regex */ './node_modules/ip-regex/index.js'
				);
			/* harmony import */ var super_regex__WEBPACK_IMPORTED_MODULE_1__ =
				__webpack_require__(
					/*! super-regex */ './node_modules/super-regex/index.js'
				);

			const maxIPv4Length = 15;
			const maxIPv6Length = 45;

			const options = {
				timeout: 400
			};

			function isIP(string) {
				if (string.length > maxIPv6Length) {
					return false;
				}

				return (0, super_regex__WEBPACK_IMPORTED_MODULE_1__.isMatch)(
					(0, ip_regex__WEBPACK_IMPORTED_MODULE_0__['default'])({
						exact: true
					}),
					string,
					options
				);
			}

			function isIPv6(string) {
				if (string.length > maxIPv6Length) {
					return false;
				}

				return (0, super_regex__WEBPACK_IMPORTED_MODULE_1__.isMatch)(
					ip_regex__WEBPACK_IMPORTED_MODULE_0__['default'].v6({
						exact: true
					}),
					string,
					options
				);
			}

			function isIPv4(string) {
				if (string.length > maxIPv4Length) {
					return false;
				}

				return (0, super_regex__WEBPACK_IMPORTED_MODULE_1__.isMatch)(
					ip_regex__WEBPACK_IMPORTED_MODULE_0__['default'].v4({
						exact: true
					}),
					string,
					options
				);
			}

			function ipVersion(string) {
				if (isIPv6(string)) {
					return 6;
				}

				if (isIPv4(string)) {
					return 4;
				}
			}
		},
		'./node_modules/is-regexp/index.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				default: function () {
					return isRegexp;
				}
			});
			const { toString } = Object.prototype;

			function isRegexp(value) {
				return toString.call(value) === '[object RegExp]';
			}
		},
		'./node_modules/meriyah/dist/meriyah.esm.mjs': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				ESTree: function () {
					return estree;
				},
				parse: function () {
					return parse;
				},
				parseModule: function () {
					return parseModule;
				},
				parseScript: function () {
					return parseScript;
				},
				version: function () {
					return version;
				}
			});
			const errorMessages = {
				[0]: 'Unexpected token',
				[28]: "Unexpected token: '%0'",
				[1]: 'Octal escape sequences are not allowed in strict mode',
				[2]: 'Octal escape sequences are not allowed in template strings',
				[3]: 'Unexpected token `#`',
				[4]: 'Illegal Unicode escape sequence',
				[5]: 'Invalid code point %0',
				[6]: 'Invalid hexadecimal escape sequence',
				[8]: 'Octal literals are not allowed in strict mode',
				[7]: 'Decimal integer literals with a leading zero are forbidden in strict mode',
				[9]: 'Expected number in radix %0',
				[146]: 'Invalid left-hand side assignment to a destructible right-hand side',
				[10]: 'Non-number found after exponent indicator',
				[11]: 'Invalid BigIntLiteral',
				[12]: 'No identifiers allowed directly after numeric literal',
				[13]: 'Escapes \\8 or \\9 are not syntactically valid escapes',
				[14]: 'Unterminated string literal',
				[15]: 'Unterminated template literal',
				[16]: 'Multiline comment was not closed properly',
				[17]: 'The identifier contained dynamic unicode escape that was not closed',
				[18]: "Illegal character '%0'",
				[19]: 'Missing hexadecimal digits',
				[20]: 'Invalid implicit octal',
				[21]: 'Invalid line break in string literal',
				[22]: 'Only unicode escapes are legal in identifier names',
				[23]: "Expected '%0'",
				[24]: 'Invalid left-hand side in assignment',
				[25]: 'Invalid left-hand side in async arrow',
				[26]: 'Calls to super must be in the "constructor" method of a class expression or class declaration that has a superclass',
				[27]: 'Member access on super must be in a method',
				[29]: 'Await expression not allowed in formal parameter',
				[30]: 'Yield expression not allowed in formal parameter',
				[93]: "Unexpected token: 'escaped keyword'",
				[31]: 'Unary expressions as the left operand of an exponentiation expression must be disambiguated with parentheses',
				[120]: 'Async functions can only be declared at the top level or inside a block',
				[32]: 'Unterminated regular expression',
				[33]: 'Unexpected regular expression flag',
				[34]: "Duplicate regular expression flag '%0'",
				[35]: '%0 functions must have exactly %1 argument%2',
				[36]: 'Setter function argument must not be a rest parameter',
				[37]: '%0 declaration must have a name in this context',
				[38]: 'Function name may not contain any reserved words or be eval or arguments in strict mode',
				[39]: 'The rest operator is missing an argument',
				[40]: 'A getter cannot be a generator',
				[41]: 'A setter cannot be a generator',
				[42]: 'A computed property name must be followed by a colon or paren',
				[131]: 'Object literal keys that are strings or numbers must be a method or have a colon',
				[44]: 'Found `* async x(){}` but this should be `async * x(){}`',
				[43]: 'Getters and setters can not be generators',
				[45]: "'%0' can not be generator method",
				[46]: "No line break is allowed after '=>'",
				[47]: 'The left-hand side of the arrow can only be destructed through assignment',
				[48]: 'The binding declaration is not destructible',
				[49]: 'Async arrow can not be followed by new expression',
				[50]: "Classes may not have a static property named 'prototype'",
				[51]: 'Class constructor may not be a %0',
				[52]: 'Duplicate constructor method in class',
				[53]: 'Invalid increment/decrement operand',
				[54]: 'Invalid use of `new` keyword on an increment/decrement expression',
				[55]: '`=>` is an invalid assignment target',
				[56]: 'Rest element may not have a trailing comma',
				[57]: 'Missing initializer in %0 declaration',
				[58]: "'for-%0' loop head declarations can not have an initializer",
				[59]: 'Invalid left-hand side in for-%0 loop: Must have a single binding',
				[60]: 'Invalid shorthand property initializer',
				[61]: 'Property name __proto__ appears more than once in object literal',
				[62]: 'Let is disallowed as a lexically bound name',
				[63]: "Invalid use of '%0' inside new expression",
				[64]: "Illegal 'use strict' directive in function with non-simple parameter list",
				[65]: 'Identifier "let" disallowed as left-hand side expression in strict mode',
				[66]: 'Illegal continue statement',
				[67]: 'Illegal break statement',
				[68]: 'Cannot have `let[...]` as a var name in strict mode',
				[69]: 'Invalid destructuring assignment target',
				[70]: 'Rest parameter may not have a default initializer',
				[71]: 'The rest argument must the be last parameter',
				[72]: 'Invalid rest argument',
				[74]: 'In strict mode code, functions can only be declared at top level or inside a block',
				[75]: 'In non-strict mode code, functions can only be declared at top level, inside a block, or as the body of an if statement',
				[76]: 'Without web compatibility enabled functions can not be declared at top level, inside a block, or as the body of an if statement',
				[77]: "Class declaration can't appear in single-statement context",
				[78]: 'Invalid left-hand side in for-%0',
				[79]: 'Invalid assignment in for-%0',
				[80]: 'for await (... of ...) is only valid in async functions and async generators',
				[81]: 'The first token after the template expression should be a continuation of the template',
				[83]: '`let` declaration not allowed here and `let` cannot be a regular var name in strict mode',
				[82]: '`let \n [` is a restricted production at the start of a statement',
				[84]: 'Catch clause requires exactly one parameter, not more (and no trailing comma)',
				[85]: 'Catch clause parameter does not support default values',
				[86]: 'Missing catch or finally after try',
				[87]: 'More than one default clause in switch statement',
				[88]: 'Illegal newline after throw',
				[89]: 'Strict mode code may not include a with statement',
				[90]: 'Illegal return statement',
				[91]: 'The left hand side of the for-header binding declaration is not destructible',
				[92]: 'new.target only allowed within functions',
				[94]: "'#' not followed by identifier",
				[100]: 'Invalid keyword',
				[99]: "Can not use 'let' as a class name",
				[98]: "'A lexical declaration can't define a 'let' binding",
				[97]: 'Can not use `let` as variable name in strict mode',
				[95]: "'%0' may not be used as an identifier in this context",
				[96]: 'Await is only valid in async functions',
				[101]: 'The %0 keyword can only be used with the module goal',
				[102]: 'Unicode codepoint must not be greater than 0x10FFFF',
				[103]: '%0 source must be string',
				[104]: 'Only a identifier can be used to indicate alias',
				[105]: "Only '*' or '{...}' can be imported after default",
				[106]: 'Trailing decorator may be followed by method',
				[107]: "Decorators can't be used with a constructor",
				[109]: 'HTML comments are only allowed with web compatibility (Annex B)',
				[110]: "The identifier 'let' must not be in expression position in strict mode",
				[111]: 'Cannot assign to `eval` and `arguments` in strict mode',
				[112]: "The left-hand side of a for-of loop may not start with 'let'",
				[113]: 'Block body arrows can not be immediately invoked without a group',
				[114]: 'Block body arrows can not be immediately accessed without a group',
				[115]: 'Unexpected strict mode reserved word',
				[116]: 'Unexpected eval or arguments in strict mode',
				[117]: 'Decorators must not be followed by a semicolon',
				[118]: 'Calling delete on expression not allowed in strict mode',
				[119]: 'Pattern can not have a tail',
				[121]: 'Can not have a `yield` expression on the left side of a ternary',
				[122]: 'An arrow function can not have a postfix update operator',
				[123]: 'Invalid object literal key character after generator star',
				[124]: 'Private fields can not be deleted',
				[126]: 'Classes may not have a field called constructor',
				[125]: 'Classes may not have a private element named constructor',
				[127]: 'A class field initializer may not contain arguments',
				[128]: 'Generators can only be declared at the top level or inside a block',
				[129]: 'Async methods are a restricted production and cannot have a newline following it',
				[130]: 'Unexpected character after object literal property name',
				[132]: 'Invalid key token',
				[133]: "Label '%0' has already been declared",
				[134]: 'continue statement must be nested within an iteration statement',
				[135]: "Undefined label '%0'",
				[136]: 'Trailing comma is disallowed inside import(...) arguments',
				[137]: 'import() requires exactly one argument',
				[138]: 'Cannot use new with import(...)',
				[139]: '... is not allowed in import()',
				[140]: "Expected '=>'",
				[141]: "Duplicate binding '%0'",
				[142]: "Cannot export a duplicate name '%0'",
				[145]: 'Duplicate %0 for-binding',
				[143]: "Exported binding '%0' needs to refer to a top-level declared variable",
				[144]: 'Unexpected private field',
				[148]: 'Numeric separators are not allowed at the end of numeric literals',
				[147]: 'Only one underscore is allowed as numeric separator',
				[149]: 'JSX value should be either an expression or a quoted JSX text',
				[150]: 'Expected corresponding JSX closing tag for %0',
				[151]: 'Adjacent JSX elements must be wrapped in an enclosing tag',
				[152]: "JSX attributes must only be assigned a non-empty 'expression'",
				[153]: "'%0' has already been declared",
				[154]: "'%0' shadowed a catch clause binding",
				[155]: 'Dot property must be an identifier',
				[156]: 'Encountered invalid input after spread/rest argument',
				[157]: 'Catch without try',
				[158]: 'Finally without try',
				[159]: 'Expected corresponding closing tag for JSX fragment',
				[160]: 'Coalescing and logical operators used together in the same expression must be disambiguated with parentheses',
				[161]: 'Invalid tagged template on optional chain',
				[162]: 'Invalid optional chain from super property',
				[163]: 'Invalid optional chain from new expression',
				[164]: 'Cannot use "import.meta" outside a module',
				[165]: 'Leading decorators must be attached to a class declaration'
			};
			class ParseError extends SyntaxError {
				constructor(startindex, line, column, type, ...params) {
					const message =
						'[' +
						line +
						':' +
						column +
						']: ' +
						errorMessages[type].replace(
							/%(\d+)/g,
							(_, i) => params[i]
						);
					super(`${message}`);
					this.index = startindex;
					this.line = line;
					this.column = column;
					this.description = message;
					this.loc = {
						line,
						column
					};
				}
			}
			function report(parser, type, ...params) {
				throw new ParseError(
					parser.index,
					parser.line,
					parser.column,
					type,
					...params
				);
			}
			function reportScopeError(scope) {
				throw new ParseError(
					scope.index,
					scope.line,
					scope.column,
					scope.type,
					scope.params
				);
			}
			function reportMessageAt(index, line, column, type, ...params) {
				throw new ParseError(index, line, column, type, ...params);
			}
			function reportScannerError(index, line, column, type) {
				throw new ParseError(index, line, column, type);
			}

			const unicodeLookup = ((compressed, lookup) => {
				const result = new Uint32Array(104448);
				let index = 0;
				let subIndex = 0;
				while (index < 3701) {
					const inst = compressed[index++];
					if (inst < 0) {
						subIndex -= inst;
					} else {
						let code = compressed[index++];
						if (inst & 2) code = lookup[code];
						if (inst & 1) {
							result.fill(
								code,
								subIndex,
								(subIndex += compressed[index++])
							);
						} else {
							result[subIndex++] = code;
						}
					}
				}
				return result;
			})(
				[
					-1, 2, 26, 2, 27, 2, 5, -1, 0, 77595648, 3, 44, 2, 3, 0, 14,
					2, 57, 2, 58, 3, 0, 3, 0, 3168796671, 0, 4294956992, 2, 1,
					2, 0, 2, 59, 3, 0, 4, 0, 4294966523, 3, 0, 4, 2, 16, 2, 60,
					2, 0, 0, 4294836735, 0, 3221225471, 0, 4294901942, 2, 61, 0,
					134152192, 3, 0, 2, 0, 4294951935, 3, 0, 2, 0, 2683305983,
					0, 2684354047, 2, 18, 2, 0, 0, 4294961151, 3, 0, 2, 2, 19,
					2, 0, 0, 608174079, 2, 0, 2, 54, 2, 7, 2, 6, 0, 4278222591,
					3, 0, 2, 2, 1, 3, 0, 3, 0, 4294901711, 2, 40, 0, 4089839103,
					0, 2961209759, 0, 1342439375, 0, 4294543342, 0, 3547201023,
					0, 1577204103, 0, 4194240, 0, 4294688750, 2, 2, 0, 80831, 0,
					4261478351, 0, 4294549486, 2, 2, 0, 2967484831, 0, 196559,
					0, 3594373100, 0, 3288319768, 0, 8469959, 2, 200, 2, 3, 0,
					4093640191, 0, 660618719, 0, 65487, 0, 4294828015, 0,
					4092591615, 0, 1616920031, 0, 982991, 2, 3, 2, 0, 0,
					2163244511, 0, 4227923919, 0, 4236247022, 2, 66, 0,
					4284449919, 0, 851904, 2, 4, 2, 12, 0, 67076095, -1, 2, 67,
					0, 1073741743, 0, 4093607775, -1, 0, 50331649, 0,
					3265266687, 2, 33, 0, 4294844415, 0, 4278190047, 2, 20, 2,
					133, -1, 3, 0, 2, 2, 23, 2, 0, 2, 10, 2, 0, 2, 15, 2, 22, 3,
					0, 10, 2, 69, 2, 0, 2, 70, 2, 71, 2, 72, 2, 0, 2, 73, 2, 0,
					2, 11, 0, 261632, 2, 25, 3, 0, 2, 2, 13, 2, 4, 3, 0, 18, 2,
					74, 2, 5, 3, 0, 2, 2, 75, 0, 2151677951, 2, 29, 2, 9, 0,
					909311, 3, 0, 2, 0, 814743551, 2, 42, 0, 67090432, 3, 0, 2,
					2, 41, 2, 0, 2, 6, 2, 0, 2, 30, 2, 8, 0, 268374015, 2, 107,
					2, 48, 2, 0, 2, 76, 0, 134153215, -1, 2, 7, 2, 0, 2, 8, 0,
					2684354559, 0, 67044351, 0, 3221160064, 2, 17, -1, 3, 0, 2,
					0, 67051519, 0, 1046528, 3, 0, 3, 2, 9, 2, 0, 2, 50, 0,
					4294960127, 2, 10, 2, 39, 2, 11, 0, 4294377472, 2, 12, 3, 0,
					16, 2, 13, 2, 0, 2, 79, 2, 10, 2, 0, 2, 80, 2, 81, 2, 82, 2,
					206, 2, 129, 0, 1048577, 2, 83, 2, 14, -1, 2, 14, 0, 131042,
					2, 84, 2, 85, 2, 86, 2, 0, 2, 34, -83, 3, 0, 7, 0, 1046559,
					2, 0, 2, 15, 2, 0, 0, 2147516671, 2, 21, 3, 87, 2, 2, 0,
					-16, 2, 88, 0, 524222462, 2, 4, 2, 0, 0, 4269801471, 2, 4,
					3, 0, 2, 2, 28, 2, 16, 3, 0, 2, 2, 17, 2, 0, -1, 2, 18, -16,
					3, 0, 206, -2, 3, 0, 692, 2, 68, -1, 2, 18, 2, 10, 3, 0, 8,
					2, 90, 2, 128, 2, 0, 0, 3220242431, 3, 0, 3, 2, 19, 2, 91,
					2, 92, 3, 0, 2, 2, 93, 2, 0, 2, 94, 2, 45, 2, 0, 0, 4351, 2,
					0, 2, 9, 3, 0, 2, 0, 67043391, 0, 3909091327, 2, 0, 2, 24,
					2, 9, 2, 20, 3, 0, 2, 0, 67076097, 2, 8, 2, 0, 2, 21, 0,
					67059711, 0, 4236247039, 3, 0, 2, 0, 939524103, 0, 8191999,
					2, 98, 2, 99, 2, 22, 2, 23, 3, 0, 3, 0, 67057663, 3, 0, 349,
					2, 100, 2, 101, 2, 7, -264, 3, 0, 11, 2, 24, 3, 0, 2, 2, 32,
					-1, 0, 3774349439, 2, 102, 2, 103, 3, 0, 2, 2, 19, 2, 104,
					3, 0, 10, 2, 10, 2, 18, 2, 0, 2, 46, 2, 0, 2, 31, 2, 105, 2,
					25, 0, 1638399, 2, 170, 2, 106, 3, 0, 3, 2, 20, 2, 26, 2,
					27, 2, 5, 2, 28, 2, 0, 2, 8, 2, 108, -1, 2, 109, 2, 110, 2,
					111, -1, 3, 0, 3, 2, 12, -2, 2, 0, 2, 29, -3, 2, 159, -4, 2,
					20, 2, 0, 2, 36, 0, 1, 2, 0, 2, 62, 2, 6, 2, 12, 2, 10, 2,
					0, 2, 112, -1, 3, 0, 4, 2, 10, 2, 23, 2, 113, 2, 7, 2, 0, 2,
					114, 2, 0, 2, 115, 2, 116, 2, 117, -2, 3, 0, 9, 2, 21, 2,
					30, 2, 31, 2, 118, 2, 119, -2, 2, 120, 2, 121, 2, 30, 2, 21,
					2, 8, -2, 2, 122, 2, 30, 2, 32, -2, 2, 0, 2, 38, -2, 0,
					4277137519, 0, 2269118463, -1, 3, 20, 2, -1, 2, 33, 2, 37,
					2, 0, 3, 30, 2, 2, 35, 2, 19, -3, 3, 0, 2, 2, 34, -1, 2, 0,
					2, 35, 2, 0, 2, 35, 2, 0, 2, 47, -10, 2, 0, 0, 203775, -1,
					2, 164, 2, 20, 2, 43, 2, 36, 2, 18, 2, 77, 2, 18, 2, 123, 2,
					21, 3, 0, 2, 2, 37, 0, 2151677888, 2, 0, 2, 12, 0,
					4294901764, 2, 140, 2, 0, 2, 52, 2, 51, 0, 5242879, 3, 0, 2,
					0, 402644511, -1, 2, 125, 2, 38, 0, 3, -1, 2, 126, 2, 39, 2,
					0, 0, 67045375, 2, 40, 0, 4226678271, 0, 3766565279, 0,
					2039759, -4, 3, 0, 2, 0, 3288270847, 0, 3, 3, 0, 2, 0,
					67043519, -5, 2, 0, 0, 4282384383, 0, 1056964609, -1, 3, 0,
					2, 0, 67043345, -1, 2, 0, 2, 41, 2, 42, -1, 2, 11, 2, 55, 2,
					37, -5, 2, 0, 2, 12, -3, 3, 0, 2, 0, 2147484671, 2, 130, 0,
					4190109695, 2, 49, -2, 2, 131, 0, 4244635647, 0, 27, 2, 0,
					2, 8, 2, 43, 2, 0, 2, 63, 2, 18, 2, 0, 2, 41, -8, 2, 53, 2,
					44, 0, 67043329, 2, 45, 2, 46, 0, 8388351, -2, 2, 132, 0,
					3028287487, 2, 47, 2, 134, 0, 33259519, 2, 42, -9, 2, 21, 0,
					4294836223, 0, 3355443199, 0, 67043335, -2, 2, 64, -2, 3, 0,
					28, 2, 32, -3, 3, 0, 3, 2, 17, 3, 0, 6, 2, 78, -81, 2, 18,
					3, 0, 2, 2, 36, 3, 0, 33, 2, 25, 2, 30, -125, 3, 0, 18, 2,
					37, -269, 3, 0, 17, 2, 41, 2, 8, 2, 23, 2, 0, 2, 8, 2, 23,
					2, 48, 2, 0, 2, 21, 2, 49, 2, 135, 2, 25, -21, 3, 0, 2, -4,
					3, 0, 2, 0, 4294936575, 2, 0, 0, 4294934783, -2, 0, 196635,
					3, 0, 191, 2, 50, 3, 0, 38, 2, 30, -1, 2, 34, -278, 2, 136,
					3, 0, 9, 2, 137, 2, 138, 2, 51, 3, 0, 11, 2, 7, -72, 3, 0,
					3, 2, 139, 0, 1677656575, -147, 2, 0, 2, 24, 2, 37, -16, 0,
					4161266656, 0, 4071, 2, 201, -4, 0, 28, -13, 3, 0, 2, 2, 52,
					2, 0, 2, 141, 2, 142, 2, 56, 2, 0, 2, 143, 2, 144, 2, 145,
					3, 0, 10, 2, 146, 2, 147, 2, 22, 3, 52, 2, 3, 148, 2, 3, 53,
					2, 0, 4294954999, 2, 0, -16, 2, 0, 2, 89, 2, 0, 0, 2105343,
					0, 4160749584, 2, 174, -34, 2, 8, 2, 150, -6, 0, 4194303871,
					0, 4294903771, 2, 0, 2, 54, 2, 97, -3, 2, 0, 0, 1073684479,
					0, 17407, -9, 2, 18, 2, 17, 2, 0, 2, 32, -14, 2, 18, 2, 32,
					-23, 2, 151, 3, 0, 6, 0, 8323103, -1, 3, 0, 2, 2, 55, -37,
					2, 56, 2, 152, 2, 153, 2, 154, 2, 155, 2, 156, -105, 2, 26,
					-32, 3, 0, 1335, -1, 3, 0, 129, 2, 32, 3, 0, 6, 2, 10, 3, 0,
					180, 2, 157, 3, 0, 233, 2, 158, 3, 0, 18, 2, 10, -77, 3, 0,
					16, 2, 10, -47, 3, 0, 154, 2, 6, 3, 0, 130, 2, 25, -22250,
					3, 0, 7, 2, 25, -6130, 3, 5, 2, -1, 0, 69207040, 3, 44, 2,
					3, 0, 14, 2, 57, 2, 58, -3, 0, 3168731136, 0, 4294956864, 2,
					1, 2, 0, 2, 59, 3, 0, 4, 0, 4294966275, 3, 0, 4, 2, 16, 2,
					60, 2, 0, 2, 34, -1, 2, 18, 2, 61, -1, 2, 0, 0, 2047, 0,
					4294885376, 3, 0, 2, 0, 3145727, 0, 2617294944, 0,
					4294770688, 2, 25, 2, 62, 3, 0, 2, 0, 131135, 2, 95, 0,
					70256639, 0, 71303167, 0, 272, 2, 41, 2, 6, 0, 32511, 2, 0,
					2, 42, -1, 2, 96, 2, 63, 0, 4278255616, 0, 4294836227, 0,
					4294549473, 0, 600178175, 0, 2952806400, 0, 268632067, 0,
					4294543328, 0, 57540095, 0, 1577058304, 0, 1835008, 0,
					4294688736, 2, 65, 2, 64, 0, 33554435, 2, 127, 2, 65, 2,
					160, 0, 131075, 0, 3594373096, 0, 67094296, 2, 64, -1, 0,
					4294828000, 0, 603979263, 0, 654311424, 0, 3, 0, 4294828001,
					0, 602930687, 2, 167, 0, 393219, 0, 4294828016, 0,
					671088639, 0, 2154840064, 0, 4227858435, 0, 4236247008, 2,
					66, 2, 37, -1, 2, 4, 0, 917503, 2, 37, -1, 2, 67, 0,
					537788335, 0, 4026531935, -1, 0, 1, -1, 2, 33, 2, 68, 0,
					7936, -3, 2, 0, 0, 2147485695, 0, 1010761728, 0, 4292984930,
					0, 16387, 2, 0, 2, 15, 2, 22, 3, 0, 10, 2, 69, 2, 0, 2, 70,
					2, 71, 2, 72, 2, 0, 2, 73, 2, 0, 2, 12, -1, 2, 25, 3, 0, 2,
					2, 13, 2, 4, 3, 0, 18, 2, 74, 2, 5, 3, 0, 2, 2, 75, 0,
					2147745791, 3, 19, 2, 0, 122879, 2, 0, 2, 9, 0, 276824064,
					-2, 3, 0, 2, 2, 41, 2, 0, 0, 4294903295, 2, 0, 2, 30, 2, 8,
					-1, 2, 18, 2, 48, 2, 0, 2, 76, 2, 42, -1, 2, 21, 2, 0, 2,
					29, -2, 0, 128, -2, 2, 28, 2, 9, 0, 8160, -1, 2, 124, 0,
					4227907585, 2, 0, 2, 77, 2, 0, 2, 78, 2, 180, 2, 10, 2, 39,
					2, 11, -1, 0, 74440192, 3, 0, 6, -2, 3, 0, 8, 2, 13, 2, 0,
					2, 79, 2, 10, 2, 0, 2, 80, 2, 81, 2, 82, -3, 2, 83, 2, 14,
					-3, 2, 84, 2, 85, 2, 86, 2, 0, 2, 34, -83, 3, 0, 7, 0,
					817183, 2, 0, 2, 15, 2, 0, 0, 33023, 2, 21, 3, 87, 2, -17,
					2, 88, 0, 524157950, 2, 4, 2, 0, 2, 89, 2, 4, 2, 0, 2, 22,
					2, 28, 2, 16, 3, 0, 2, 2, 17, 2, 0, -1, 2, 18, -16, 3, 0,
					206, -2, 3, 0, 692, 2, 68, -1, 2, 18, 2, 10, 3, 0, 8, 2, 90,
					0, 3072, 2, 0, 0, 2147516415, 2, 10, 3, 0, 2, 2, 25, 2, 91,
					2, 92, 3, 0, 2, 2, 93, 2, 0, 2, 94, 2, 45, 0, 4294965179, 0,
					7, 2, 0, 2, 9, 2, 92, 2, 9, -1, 0, 1761345536, 2, 95, 0,
					4294901823, 2, 37, 2, 20, 2, 96, 2, 35, 2, 97, 0,
					2080440287, 2, 0, 2, 34, 2, 149, 0, 3296722943, 2, 0, 0,
					1046675455, 0, 939524101, 0, 1837055, 2, 98, 2, 99, 2, 22,
					2, 23, 3, 0, 3, 0, 7, 3, 0, 349, 2, 100, 2, 101, 2, 7, -264,
					3, 0, 11, 2, 24, 3, 0, 2, 2, 32, -1, 0, 2700607615, 2, 102,
					2, 103, 3, 0, 2, 2, 19, 2, 104, 3, 0, 10, 2, 10, 2, 18, 2,
					0, 2, 46, 2, 0, 2, 31, 2, 105, -3, 2, 106, 3, 0, 3, 2, 20,
					-1, 3, 5, 2, 2, 107, 2, 0, 2, 8, 2, 108, -1, 2, 109, 2, 110,
					2, 111, -1, 3, 0, 3, 2, 12, -2, 2, 0, 2, 29, -8, 2, 20, 2,
					0, 2, 36, -1, 2, 0, 2, 62, 2, 6, 2, 30, 2, 10, 2, 0, 2, 112,
					-1, 3, 0, 4, 2, 10, 2, 18, 2, 113, 2, 7, 2, 0, 2, 114, 2, 0,
					2, 115, 2, 116, 2, 117, -2, 3, 0, 9, 2, 21, 2, 30, 2, 31, 2,
					118, 2, 119, -2, 2, 120, 2, 121, 2, 30, 2, 21, 2, 8, -2, 2,
					122, 2, 30, 2, 32, -2, 2, 0, 2, 38, -2, 0, 4277075969, 2,
					30, -1, 3, 20, 2, -1, 2, 33, 2, 123, 2, 0, 3, 30, 2, 2, 35,
					2, 19, -3, 3, 0, 2, 2, 34, -1, 2, 0, 2, 35, 2, 0, 2, 35, 2,
					0, 2, 78, -10, 2, 0, 0, 197631, -2, 2, 20, 2, 43, 2, 77, 2,
					18, 0, 3, 2, 18, 2, 123, 2, 21, 2, 124, 2, 50, -1, 0,
					2490368, 2, 124, 2, 25, 2, 18, 2, 34, 2, 124, 2, 37, 0,
					4294901904, 0, 4718591, 2, 124, 2, 35, 0, 335544350, -1, 2,
					125, 0, 2147487743, 0, 1, -1, 2, 126, 2, 39, 2, 8, -1, 2,
					127, 2, 65, 0, 3758161920, 0, 3, -4, 2, 0, 2, 29, 0,
					2147485568, 0, 3, 2, 0, 2, 25, 0, 176, -5, 2, 0, 2, 17, 2,
					188, -1, 2, 0, 2, 25, 2, 205, -1, 2, 0, 0, 16779263, -2, 2,
					12, -1, 2, 37, -5, 2, 0, 2, 128, -3, 3, 0, 2, 2, 129, 2,
					130, 0, 2147549183, 0, 2, -2, 2, 131, 2, 36, 0, 10, 0,
					4294965249, 0, 67633151, 0, 4026597376, 2, 0, 0, 536871935,
					2, 18, 2, 0, 2, 41, -8, 2, 53, 2, 17, 0, 1, 2, 45, 2, 25,
					-3, 2, 132, 2, 36, 2, 133, 2, 134, 0, 16778239, -10, 2, 35,
					0, 4294836212, 2, 9, -3, 2, 64, -2, 3, 0, 28, 2, 32, -3, 3,
					0, 3, 2, 17, 3, 0, 6, 2, 78, -81, 2, 18, 3, 0, 2, 2, 36, 3,
					0, 33, 2, 25, 0, 126, -125, 3, 0, 18, 2, 37, -269, 3, 0, 17,
					2, 41, 2, 8, 2, 18, 2, 0, 2, 8, 2, 18, 2, 54, 2, 0, 2, 25,
					2, 78, 2, 135, 2, 25, -21, 3, 0, 2, -4, 3, 0, 2, 0, 67583,
					-1, 2, 104, -2, 0, 11, 3, 0, 191, 2, 50, 3, 0, 38, 2, 30,
					-1, 2, 34, -278, 2, 136, 3, 0, 9, 2, 137, 2, 138, 2, 51, 3,
					0, 11, 2, 7, -72, 3, 0, 3, 2, 139, 2, 140, -187, 3, 0, 2, 2,
					52, 2, 0, 2, 141, 2, 142, 2, 56, 2, 0, 2, 143, 2, 144, 2,
					145, 3, 0, 10, 2, 146, 2, 147, 2, 22, 3, 52, 2, 3, 148, 2,
					3, 53, 2, 2, 149, -57, 2, 8, 2, 150, -7, 2, 18, 2, 0, 2, 54,
					-4, 2, 0, 0, 1065361407, 0, 16384, -9, 2, 18, 2, 54, 2, 0,
					2, 128, -14, 2, 18, 2, 128, -23, 2, 151, 3, 0, 6, 2, 123,
					-1, 3, 0, 2, 0, 2063, -37, 2, 56, 2, 152, 2, 153, 2, 154, 2,
					155, 2, 156, -138, 3, 0, 1335, -1, 3, 0, 129, 2, 32, 3, 0,
					6, 2, 10, 3, 0, 180, 2, 157, 3, 0, 233, 2, 158, 3, 0, 18, 2,
					10, -77, 3, 0, 16, 2, 10, -47, 3, 0, 154, 2, 6, 3, 0, 130,
					2, 25, -28386, 2, 0, 0, 1, -1, 2, 129, 2, 0, 0, 8193, -21,
					2, 198, 0, 10255, 0, 4, -11, 2, 64, 2, 179, -1, 0, 71680,
					-1, 2, 171, 0, 4292900864, 0, 268435519, -5, 2, 159, -1, 2,
					169, -1, 0, 6144, -2, 2, 45, -1, 2, 163, -1, 0, 2147532800,
					2, 160, 2, 166, 0, 16744448, -2, 0, 4, -4, 2, 194, 0,
					205128192, 0, 1333757536, 0, 2147483696, 0, 423953, 0,
					747766272, 0, 2717763192, 0, 4286578751, 0, 278545, 2, 161,
					0, 4294886464, 0, 33292336, 0, 417809, 2, 161, 0,
					1327482464, 0, 4278190128, 0, 700594195, 0, 1006647527, 0,
					4286497336, 0, 4160749631, 2, 162, 0, 201327104, 0,
					3634348576, 0, 8323120, 2, 162, 0, 202375680, 0, 2678047264,
					0, 4293984304, 2, 162, -1, 0, 983584, 0, 48, 0, 58720273, 0,
					3489923072, 0, 10517376, 0, 4293066815, 0, 1, 0, 2013265920,
					2, 182, 2, 0, 0, 2089, 0, 3221225552, 0, 201359520, 2, 0,
					-2, 0, 256, 0, 122880, 0, 16777216, 2, 159, 0, 4160757760,
					2, 0, -6, 2, 176, -11, 0, 3263218176, -1, 0, 49664, 0,
					2160197632, 0, 8388802, -1, 0, 12713984, -1, 2, 163, 2, 164,
					2, 183, -2, 2, 172, -20, 0, 3758096385, -2, 2, 165, 2, 191,
					2, 91, 2, 177, 0, 4294057984, -2, 2, 173, 2, 168, 0,
					4227874816, -2, 2, 165, -1, 2, 166, -1, 2, 178, 2, 129, 0,
					4026593280, 0, 14, 0, 4292919296, -1, 2, 175, 0, 939588608,
					-1, 0, 805306368, -1, 2, 129, 2, 167, 2, 168, 2, 169, 2,
					207, 2, 0, -2, 2, 170, 2, 129, -3, 0, 267386880, -1, 0,
					117440512, 0, 7168, -1, 2, 210, 2, 163, 2, 171, 2, 184, -16,
					2, 172, -1, 0, 1426112704, 2, 173, -1, 2, 192, 0, 271581216,
					0, 2149777408, 2, 25, 2, 171, 2, 129, 0, 851967, 2, 185, -1,
					2, 174, 2, 186, -4, 2, 175, -20, 2, 197, 2, 204, -56, 0,
					3145728, 2, 187, -10, 0, 32505856, -1, 2, 176, -1, 0,
					2147385088, 2, 91, 1, 2155905152, 2, -3, 2, 173, 2, 0, 0,
					67108864, -2, 2, 177, -6, 2, 178, 2, 25, 0, 1, -1, 0, 1, -1,
					2, 179, -3, 2, 123, 2, 64, -2, 2, 97, -2, 0, 32752, 2, 129,
					-915, 2, 170, -1, 2, 203, -10, 2, 190, -5, 2, 181, -6, 0,
					4229232640, 2, 19, -1, 2, 180, -1, 2, 181, -2, 0,
					4227874752, -3, 0, 2146435072, 2, 164, -2, 0, 1006649344, 2,
					129, -1, 2, 91, 0, 201375744, -3, 0, 134217720, 2, 91, 0,
					4286677377, 0, 32896, -1, 2, 175, -3, 0, 4227907584, -349,
					0, 65520, 0, 1920, 2, 182, 3, 0, 264, -11, 2, 169, -2, 2,
					183, 2, 0, 0, 520617856, 0, 2692743168, 0, 36, -3, 0,
					524280, -13, 2, 189, -1, 0, 4294934272, 2, 25, 2, 183, -1,
					2, 213, 0, 2158720, -3, 2, 164, 0, 1, -4, 2, 129, 0,
					3808625411, 0, 3489628288, 0, 4096, 0, 1207959680, 0,
					3221274624, 2, 0, -3, 2, 184, 0, 120, 0, 7340032, -2, 2,
					185, 2, 4, 2, 25, 2, 173, 3, 0, 4, 2, 164, -1, 2, 186, 2,
					182, -1, 0, 8176, 2, 166, 2, 184, 2, 211, -1, 0, 4290773232,
					2, 0, -4, 2, 173, 2, 193, 0, 15728640, 2, 182, -1, 2, 171,
					-1, 0, 134250480, 0, 4720640, 0, 3825467396, 3, 0, 2, -9, 2,
					91, 2, 178, 0, 4294967040, 2, 133, 0, 4160880640, 3, 0, 2,
					0, 704, 0, 1849688064, 2, 187, -1, 2, 129, 0, 4294901887, 2,
					0, 0, 130547712, 0, 1879048192, 2, 208, 3, 0, 2, -1, 2, 188,
					2, 189, -1, 0, 17829776, 0, 2025848832, 2, 212, -2, 2, 0,
					-1, 0, 4286580608, -1, 0, 29360128, 2, 196, 0, 16252928, 0,
					3791388672, 2, 39, 3, 0, 2, -2, 2, 202, 2, 0, -1, 2, 104,
					-1, 0, 66584576, -1, 2, 195, 3, 0, 9, 2, 129, -1, 0,
					4294755328, 2, 0, 2, 20, -1, 2, 171, 2, 183, 2, 25, 2, 95,
					2, 25, 2, 190, 2, 91, -2, 0, 245760, 2, 191, -1, 2, 159, 2,
					199, 0, 4227923456, -1, 2, 192, 2, 171, 2, 91, -3, 0,
					4292870145, 0, 262144, -1, 2, 92, 2, 0, 0, 1073758848, 2,
					193, -1, 0, 4227921920, 2, 194, 0, 68289024, 0, 528402016,
					0, 4292927536, 3, 0, 4, -2, 0, 268435456, 2, 92, -2, 2, 195,
					3, 0, 5, -1, 2, 196, 2, 173, 2, 0, -2, 0, 4227923936, 2, 62,
					-1, 2, 183, 2, 95, 2, 0, 2, 163, 2, 175, 2, 197, 3, 0, 5,
					-1, 2, 182, 3, 0, 3, -2, 0, 2146959360, 0, 9440640, 0,
					104857600, 0, 4227923840, 3, 0, 2, 0, 768, 2, 198, 2, 28,
					-2, 2, 171, -2, 2, 199, -1, 2, 165, 2, 95, 3, 0, 7, 0, 512,
					0, 8388608, 2, 200, 2, 170, 2, 189, 0, 4286578944, 3, 0, 2,
					0, 1152, 0, 1266679808, 2, 195, 0, 576, 0, 4261707776, 2,
					95, 3, 0, 9, 2, 165, 0, 131072, 0, 939524096, 2, 183, 3, 0,
					2, 2, 16, -1, 0, 2147221504, -28, 2, 183, 3, 0, 3, -3, 0,
					4292902912, -6, 2, 96, 3, 0, 81, 2, 25, -2, 2, 104, -33, 2,
					18, 2, 178, 3, 0, 125, -18, 2, 197, 3, 0, 269, -17, 2, 165,
					2, 129, 2, 201, -1, 2, 129, 2, 193, 0, 4290822144, -2, 0,
					67174336, 0, 520093700, 2, 18, 3, 0, 21, -2, 2, 184, 3, 0,
					3, -2, 0, 30720, -1, 0, 32512, 3, 0, 2, 0, 4294770656, -191,
					2, 181, -38, 2, 178, 2, 0, 2, 202, 3, 0, 278, 0, 2417033215,
					-9, 0, 4294705144, 0, 4292411391, 0, 65295, -11, 2, 182, 3,
					0, 72, -3, 0, 3758159872, 0, 201391616, 3, 0, 147, -1, 2,
					169, 2, 203, -3, 2, 96, 2, 0, -7, 2, 178, -1, 0, 384, -1, 0,
					133693440, -3, 2, 204, -2, 2, 107, 3, 0, 3, 3, 177, 2, -2,
					2, 91, 2, 165, 3, 0, 4, -2, 2, 192, -1, 2, 159, 0,
					335552923, 2, 205, -1, 0, 538974272, 0, 2214592512, 0,
					132000, -10, 0, 192, -8, 2, 206, -21, 0, 134213632, 2, 158,
					3, 0, 34, 2, 129, 0, 4294965279, 3, 0, 6, 0, 100663424, 0,
					63524, -1, 2, 209, 2, 148, 3, 0, 3, -1, 0, 3221282816, 0,
					4294917120, 3, 0, 9, 2, 25, 2, 207, -1, 2, 208, 3, 0, 14, 2,
					25, 2, 183, 3, 0, 23, 0, 2147520640, -6, 0, 4286578784, 2,
					0, -2, 0, 1006694400, 3, 0, 24, 2, 36, -1, 0, 4292870144, 3,
					0, 2, 0, 1, 2, 173, 3, 0, 6, 2, 205, 0, 4110942569, 0,
					1432950139, 0, 2701658217, 0, 4026532864, 0, 4026532881, 2,
					0, 2, 46, 3, 0, 8, -1, 2, 175, -2, 2, 177, 0, 98304, 0,
					65537, 2, 178, -5, 2, 209, 2, 0, 2, 77, 2, 199, 2, 182, 0,
					4294770176, 2, 107, 3, 0, 4, -30, 2, 188, 0, 3758153728, -3,
					0, 125829120, -2, 2, 183, 0, 4294897664, 2, 175, -1, 2, 195,
					-1, 2, 171, 0, 4294754304, 3, 0, 2, -10, 2, 177, 0,
					3758145536, 2, 210, 2, 211, 0, 4026548160, 2, 212, -4, 2,
					213, -1, 2, 204, 0, 4227923967, 3, 0, 32, -1335, 2, 0, -129,
					2, 183, -6, 2, 173, -180, 0, 65532, -233, 2, 174, -18, 2,
					173, 3, 0, 77, -16, 2, 173, 3, 0, 47, -154, 2, 166, -130, 2,
					18, 3, 0, 22250, -7, 2, 18, 3, 0, 6128
				],
				[
					4294967295, 4294967291, 4092460543, 4294828031, 4294967294,
					134217726, 4294903807, 268435455, 2147483647, 1048575,
					1073741823, 3892314111, 134217727, 1061158911, 536805376,
					4294910143, 4294901759, 32767, 4294901760, 262143,
					536870911, 8388607, 4160749567, 4294902783, 4294918143,
					65535, 67043328, 2281701374, 4294967264, 2097151, 4194303,
					255, 67108863, 4294967039, 511, 524287, 131071, 127,
					3238002687, 4294902271, 4294549487, 33554431, 1023,
					4294901888, 4286578687, 4294705152, 4294770687, 67043583,
					2047999, 67043343, 16777215, 4294902000, 4292870143,
					4294966783, 16383, 67047423, 4294967279, 262083, 20511,
					4290772991, 41943039, 493567, 4294959104, 603979775, 65536,
					602799615, 805044223, 4294965206, 8191, 1031749119,
					4294917631, 2134769663, 4286578493, 4282253311, 4294942719,
					33540095, 4294905855, 63, 15, 2868854591, 1608515583,
					265232348, 534519807, 2147614720, 1060109444, 4093640016,
					17376, 2139062143, 224, 4169138175, 4294909951, 4286578688,
					4294967292, 4294965759, 65734655, 4294966272, 4294967280,
					32768, 8289918, 4294934399, 4294901775, 4294965375,
					1602223615, 4294967259, 4294443008, 268369920, 4292804608,
					4294967232, 486341884, 4294963199, 3087007615, 1073692671,
					4128527, 4279238655, 4294902015, 4160684047, 4290246655,
					469499899, 4294967231, 134086655, 4294966591, 2445279231,
					3670015, 31, 4294967288, 4294705151, 3221208447, 4294549472,
					4095, 2147483648, 4285526655, 4294966527, 4294966143, 64,
					4294966719, 3774873592, 1877934080, 262151, 2555904,
					536807423, 67043839, 3758096383, 3959414372, 3755993023,
					2080374783, 4294835295, 4294967103, 4160749565, 4294934527,
					4087, 2016, 2147446655, 184024726, 2862017156, 1593309078,
					268434431, 268434414, 4294901763, 4294901761, 536870912,
					2952790016, 202506752, 139264, 402653184, 3758096384,
					4261412864, 63488, 1610612736, 4227922944, 49152, 57344,
					65280, 3233808384, 3221225472, 65534, 61440, 57152,
					4293918720, 4290772992, 25165824, 4227915776, 4278190080,
					4026531840, 4227858432, 4160749568, 3758129152, 4294836224,
					4194304, 251658240, 196608, 4294963200, 2143289344, 2097152,
					64512, 417808, 4227923712, 12582912, 4294967168, 50331648,
					65528, 65472, 15360, 4294966784, 65408, 4294965248, 16,
					12288, 4294934528, 2080374784, 4294950912, 65024,
					1073741824, 4261477888, 524288
				]
			);

			function advanceChar(parser) {
				parser.column++;
				return (parser.currentChar = parser.source.charCodeAt(
					++parser.index
				));
			}
			function consumeMultiUnitCodePoint(parser, hi) {
				if ((hi & 0xfc00) !== 55296) return 0;
				const lo = parser.source.charCodeAt(parser.index + 1);
				if ((lo & 0xfc00) !== 0xdc00) return 0;
				hi = parser.currentChar =
					65536 + ((hi & 0x3ff) << 10) + (lo & 0x3ff);
				if (((unicodeLookup[(hi >>> 5) + 0] >>> hi) & 31 & 1) === 0) {
					report(parser, 18, fromCodePoint(hi));
				}
				parser.index++;
				parser.column++;
				return 1;
			}
			function consumeLineFeed(parser, state) {
				parser.currentChar = parser.source.charCodeAt(++parser.index);
				parser.flags |= 1;
				if ((state & 4) === 0) {
					parser.column = 0;
					parser.line++;
				}
			}
			function scanNewLine(parser) {
				parser.flags |= 1;
				parser.currentChar = parser.source.charCodeAt(++parser.index);
				parser.column = 0;
				parser.line++;
			}
			function isExoticECMAScriptWhitespace(ch) {
				return (
					ch === 160 ||
					ch === 65279 ||
					ch === 133 ||
					ch === 5760 ||
					(ch >= 8192 && ch <= 8203) ||
					ch === 8239 ||
					ch === 8287 ||
					ch === 12288 ||
					ch === 8201 ||
					ch === 65519
				);
			}
			function fromCodePoint(codePoint) {
				return codePoint <= 65535
					? String.fromCharCode(codePoint)
					: String.fromCharCode(codePoint >>> 10) +
							String.fromCharCode(codePoint & 0x3ff);
			}
			function toHex(code) {
				return code < 65 ? code - 48 : (code - 65 + 10) & 0xf;
			}
			function convertTokenType(t) {
				switch (t) {
					case 134283266:
						return 'NumericLiteral';
					case 134283267:
						return 'StringLiteral';
					case 86021:
					case 86022:
						return 'BooleanLiteral';
					case 86023:
						return 'NullLiteral';
					case 65540:
						return 'RegularExpression';
					case 67174408:
					case 67174409:
					case 132:
						return 'TemplateLiteral';
					default:
						if ((t & 143360) === 143360) return 'Identifier';
						if ((t & 4096) === 4096) return 'Keyword';
						return 'Punctuator';
				}
			}

			const CharTypes = [
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				8 | 1024,
				0,
				0,
				8 | 2048,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				8192,
				0,
				1 | 2,
				0,
				0,
				8192,
				0,
				0,
				0,
				256,
				0,
				256 | 32768,
				0,
				0,
				2 | 16 | 128 | 32 | 64,
				2 | 16 | 128 | 32 | 64,
				2 | 16 | 32 | 64,
				2 | 16 | 32 | 64,
				2 | 16 | 32 | 64,
				2 | 16 | 32 | 64,
				2 | 16 | 32 | 64,
				2 | 16 | 32 | 64,
				2 | 16 | 512 | 64,
				2 | 16 | 512 | 64,
				0,
				0,
				16384,
				0,
				0,
				0,
				0,
				1 | 2 | 64,
				1 | 2 | 64,
				1 | 2 | 64,
				1 | 2 | 64,
				1 | 2 | 64,
				1 | 2 | 64,
				1 | 2,
				1 | 2,
				1 | 2,
				1 | 2,
				1 | 2,
				1 | 2,
				1 | 2,
				1 | 2,
				1 | 2,
				1 | 2,
				1 | 2,
				1 | 2,
				1 | 2,
				1 | 2,
				1 | 2,
				1 | 2,
				1 | 2,
				1 | 2,
				1 | 2,
				1 | 2,
				0,
				1,
				0,
				0,
				1 | 2 | 4096,
				0,
				1 | 2 | 4 | 64,
				1 | 2 | 4 | 64,
				1 | 2 | 4 | 64,
				1 | 2 | 4 | 64,
				1 | 2 | 4 | 64,
				1 | 2 | 4 | 64,
				1 | 2 | 4,
				1 | 2 | 4,
				1 | 2 | 4,
				1 | 2 | 4,
				1 | 2 | 4,
				1 | 2 | 4,
				1 | 2 | 4,
				1 | 2 | 4,
				1 | 2 | 4,
				1 | 2 | 4,
				1 | 2 | 4,
				1 | 2 | 4,
				1 | 2 | 4,
				1 | 2 | 4,
				1 | 2 | 4,
				1 | 2 | 4,
				1 | 2 | 4,
				1 | 2 | 4,
				1 | 2 | 4,
				1 | 2 | 4,
				16384,
				0,
				0,
				0,
				0
			];
			const isIdStart = [
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
				1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
				0, 0
			];
			const isIdPart = [
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
				0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
				1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
				0, 0
			];
			function isIdentifierStart(code) {
				return code <= 0x7f
					? isIdStart[code]
					: (unicodeLookup[(code >>> 5) + 34816] >>> code) & 31 & 1;
			}
			function isIdentifierPart(code) {
				return code <= 0x7f
					? isIdPart[code]
					: (unicodeLookup[(code >>> 5) + 0] >>> code) & 31 & 1 ||
							code === 8204 ||
							code === 8205;
			}

			const CommentTypes = [
				'SingleLine',
				'MultiLine',
				'HTMLOpen',
				'HTMLClose',
				'HashbangComment'
			];
			function skipHashBang(parser) {
				const source = parser.source;
				if (
					parser.currentChar === 35 &&
					source.charCodeAt(parser.index + 1) === 33
				) {
					advanceChar(parser);
					advanceChar(parser);
					skipSingleLineComment(
						parser,
						source,
						0,
						4,
						parser.tokenPos,
						parser.linePos,
						parser.colPos
					);
				}
			}
			function skipSingleHTMLComment(
				parser,
				source,
				state,
				context,
				type,
				start,
				line,
				column
			) {
				if (context & 2048) report(parser, 0);
				return skipSingleLineComment(
					parser,
					source,
					state,
					type,
					start,
					line,
					column
				);
			}
			function skipSingleLineComment(
				parser,
				source,
				state,
				type,
				start,
				line,
				column
			) {
				const { index } = parser;
				parser.tokenPos = parser.index;
				parser.linePos = parser.line;
				parser.colPos = parser.column;
				while (parser.index < parser.end) {
					if (CharTypes[parser.currentChar] & 8) {
						const isCR = parser.currentChar === 13;
						scanNewLine(parser);
						if (
							isCR &&
							parser.index < parser.end &&
							parser.currentChar === 10
						)
							parser.currentChar = source.charCodeAt(
								++parser.index
							);
						break;
					} else if ((parser.currentChar ^ 8232) <= 1) {
						scanNewLine(parser);
						break;
					}
					advanceChar(parser);
					parser.tokenPos = parser.index;
					parser.linePos = parser.line;
					parser.colPos = parser.column;
				}
				if (parser.onComment) {
					const loc = {
						start: {
							line,
							column
						},
						end: {
							line: parser.linePos,
							column: parser.colPos
						}
					};
					parser.onComment(
						CommentTypes[type & 0xff],
						source.slice(index, parser.tokenPos),
						start,
						parser.tokenPos,
						loc
					);
				}
				return state | 1;
			}
			function skipMultiLineComment(parser, source, state) {
				const { index } = parser;
				while (parser.index < parser.end) {
					if (parser.currentChar < 0x2b) {
						let skippedOneAsterisk = false;
						while (parser.currentChar === 42) {
							if (!skippedOneAsterisk) {
								state &= ~4;
								skippedOneAsterisk = true;
							}
							if (advanceChar(parser) === 47) {
								advanceChar(parser);
								if (parser.onComment) {
									const loc = {
										start: {
											line: parser.linePos,
											column: parser.colPos
										},
										end: {
											line: parser.line,
											column: parser.column
										}
									};
									parser.onComment(
										CommentTypes[1 & 0xff],
										source.slice(index, parser.index - 2),
										index - 2,
										parser.index,
										loc
									);
								}
								parser.tokenPos = parser.index;
								parser.linePos = parser.line;
								parser.colPos = parser.column;
								return state;
							}
						}
						if (skippedOneAsterisk) {
							continue;
						}
						if (CharTypes[parser.currentChar] & 8) {
							if (parser.currentChar === 13) {
								state |= 1 | 4;
								scanNewLine(parser);
							} else {
								consumeLineFeed(parser, state);
								state = (state & ~4) | 1;
							}
						} else {
							advanceChar(parser);
						}
					} else if ((parser.currentChar ^ 8232) <= 1) {
						state = (state & ~4) | 1;
						scanNewLine(parser);
					} else {
						state &= ~4;
						advanceChar(parser);
					}
				}
				report(parser, 16);
			}

			function scanRegularExpression(parser, context) {
				const bodyStart = parser.index;
				let preparseState = 0;
				loop: while (true) {
					const ch = parser.currentChar;
					advanceChar(parser);
					if (preparseState & 1) {
						preparseState &= ~1;
					} else {
						switch (ch) {
							case 47:
								if (!preparseState) break loop;
								else break;
							case 92:
								preparseState |= 1;
								break;
							case 91:
								preparseState |= 2;
								break;
							case 93:
								preparseState &= 1;
								break;
							case 13:
							case 10:
							case 8232:
							case 8233:
								report(parser, 32);
						}
					}
					if (parser.index >= parser.source.length) {
						return report(parser, 32);
					}
				}
				const bodyEnd = parser.index - 1;
				let mask = 0;
				let char = parser.currentChar;
				const { index: flagStart } = parser;
				while (isIdentifierPart(char)) {
					switch (char) {
						case 103:
							if (mask & 2) report(parser, 34, 'g');
							mask |= 2;
							break;
						case 105:
							if (mask & 1) report(parser, 34, 'i');
							mask |= 1;
							break;
						case 109:
							if (mask & 4) report(parser, 34, 'm');
							mask |= 4;
							break;
						case 117:
							if (mask & 16) report(parser, 34, 'u');
							mask |= 16;
							break;
						case 121:
							if (mask & 8) report(parser, 34, 'y');
							mask |= 8;
							break;
						case 115:
							if (mask & 32) report(parser, 34, 's');
							mask |= 32;
							break;
						case 100:
							if (mask & 64) report(parser, 34, 'd');
							mask |= 64;
							break;
						default:
							report(parser, 33);
					}
					char = advanceChar(parser);
				}
				const flags = parser.source.slice(flagStart, parser.index);
				const pattern = parser.source.slice(bodyStart, bodyEnd);
				parser.tokenRegExp = { pattern, flags };
				if (context & 512)
					parser.tokenRaw = parser.source.slice(
						parser.tokenPos,
						parser.index
					);
				parser.tokenValue = validate(parser, pattern, flags);
				return 65540;
			}
			function validate(parser, pattern, flags) {
				try {
					return new RegExp(pattern, flags);
				} catch (e) {
					try {
						new RegExp(pattern, flags.replace('d', ''));
						return null;
					} catch (e) {
						report(parser, 32);
					}
				}
			}

			function scanString(parser, context, quote) {
				const { index: start } = parser;
				let ret = '';
				let char = advanceChar(parser);
				let marker = parser.index;
				while ((CharTypes[char] & 8) === 0) {
					if (char === quote) {
						ret += parser.source.slice(marker, parser.index);
						advanceChar(parser);
						if (context & 512)
							parser.tokenRaw = parser.source.slice(
								start,
								parser.index
							);
						parser.tokenValue = ret;
						return 134283267;
					}
					if ((char & 8) === 8 && char === 92) {
						ret += parser.source.slice(marker, parser.index);
						char = advanceChar(parser);
						if (char < 0x7f || char === 8232 || char === 8233) {
							const code = parseEscape(parser, context, char);
							if (code >= 0) ret += fromCodePoint(code);
							else handleStringError(parser, code, 0);
						} else {
							ret += fromCodePoint(char);
						}
						marker = parser.index + 1;
					}
					if (parser.index >= parser.end) report(parser, 14);
					char = advanceChar(parser);
				}
				report(parser, 14);
			}
			function parseEscape(parser, context, first) {
				switch (first) {
					case 98:
						return 8;
					case 102:
						return 12;
					case 114:
						return 13;
					case 110:
						return 10;
					case 116:
						return 9;
					case 118:
						return 11;
					case 13: {
						if (parser.index < parser.end) {
							const nextChar = parser.source.charCodeAt(
								parser.index + 1
							);
							if (nextChar === 10) {
								parser.index = parser.index + 1;
								parser.currentChar = nextChar;
							}
						}
					}
					case 10:
					case 8232:
					case 8233:
						parser.column = -1;
						parser.line++;
						return -1;
					case 48:
					case 49:
					case 50:
					case 51: {
						let code = first - 48;
						let index = parser.index + 1;
						let column = parser.column + 1;
						if (index < parser.end) {
							const next = parser.source.charCodeAt(index);
							if ((CharTypes[next] & 32) === 0) {
								if (
									(code !== 0 || CharTypes[next] & 512) &&
									context & 1024
								)
									return -2;
							} else if (context & 1024) {
								return -2;
							} else {
								parser.currentChar = next;
								code = (code << 3) | (next - 48);
								index++;
								column++;
								if (index < parser.end) {
									const next =
										parser.source.charCodeAt(index);
									if (CharTypes[next] & 32) {
										parser.currentChar = next;
										code = (code << 3) | (next - 48);
										index++;
										column++;
									}
								}
								parser.flags |= 64;
								parser.index = index - 1;
								parser.column = column - 1;
							}
						}
						return code;
					}
					case 52:
					case 53:
					case 54:
					case 55: {
						if (context & 1024) return -2;
						let code = first - 48;
						const index = parser.index + 1;
						const column = parser.column + 1;
						if (index < parser.end) {
							const next = parser.source.charCodeAt(index);
							if (CharTypes[next] & 32) {
								code = (code << 3) | (next - 48);
								parser.currentChar = next;
								parser.index = index;
								parser.column = column;
							}
						}
						parser.flags |= 64;
						return code;
					}
					case 120: {
						const ch1 = advanceChar(parser);
						if ((CharTypes[ch1] & 64) === 0) return -4;
						const hi = toHex(ch1);
						const ch2 = advanceChar(parser);
						if ((CharTypes[ch2] & 64) === 0) return -4;
						const lo = toHex(ch2);
						return (hi << 4) | lo;
					}
					case 117: {
						const ch = advanceChar(parser);
						if (parser.currentChar === 123) {
							let code = 0;
							while (
								(CharTypes[advanceChar(parser)] & 64) !==
								0
							) {
								code = (code << 4) | toHex(parser.currentChar);
								if (code > 1114111) return -5;
							}
							if (
								parser.currentChar < 1 ||
								parser.currentChar !== 125
							) {
								return -4;
							}
							return code;
						} else {
							if ((CharTypes[ch] & 64) === 0) return -4;
							const ch2 = parser.source.charCodeAt(
								parser.index + 1
							);
							if ((CharTypes[ch2] & 64) === 0) return -4;
							const ch3 = parser.source.charCodeAt(
								parser.index + 2
							);
							if ((CharTypes[ch3] & 64) === 0) return -4;
							const ch4 = parser.source.charCodeAt(
								parser.index + 3
							);
							if ((CharTypes[ch4] & 64) === 0) return -4;
							parser.index += 3;
							parser.column += 3;
							parser.currentChar = parser.source.charCodeAt(
								parser.index
							);
							return (
								(toHex(ch) << 12) |
								(toHex(ch2) << 8) |
								(toHex(ch3) << 4) |
								toHex(ch4)
							);
						}
					}
					case 56:
					case 57:
						if ((context & 256) === 0) return -3;
					default:
						return first;
				}
			}
			function handleStringError(state, code, isTemplate) {
				switch (code) {
					case -1:
						return;
					case -2:
						report(state, isTemplate ? 2 : 1);
					case -3:
						report(state, 13);
					case -4:
						report(state, 6);
					case -5:
						report(state, 102);
				}
			}

			function scanTemplate(parser, context) {
				const { index: start } = parser;
				let token = 67174409;
				let ret = '';
				let char = advanceChar(parser);
				while (char !== 96) {
					if (
						char === 36 &&
						parser.source.charCodeAt(parser.index + 1) === 123
					) {
						advanceChar(parser);
						token = 67174408;
						break;
					} else if ((char & 8) === 8 && char === 92) {
						char = advanceChar(parser);
						if (char > 0x7e) {
							ret += fromCodePoint(char);
						} else {
							const code = parseEscape(
								parser,
								context | 1024,
								char
							);
							if (code >= 0) {
								ret += fromCodePoint(code);
							} else if (code !== -1 && context & 65536) {
								ret = undefined;
								char = scanBadTemplate(parser, char);
								if (char < 0) token = 67174408;
								break;
							} else {
								handleStringError(parser, code, 1);
							}
						}
					} else {
						if (
							parser.index < parser.end &&
							char === 13 &&
							parser.source.charCodeAt(parser.index) === 10
						) {
							ret += fromCodePoint(char);
							parser.currentChar = parser.source.charCodeAt(
								++parser.index
							);
						}
						if (
							((char & 83) < 3 && char === 10) ||
							(char ^ 8232) <= 1
						) {
							parser.column = -1;
							parser.line++;
						}
						ret += fromCodePoint(char);
					}
					if (parser.index >= parser.end) report(parser, 15);
					char = advanceChar(parser);
				}
				advanceChar(parser);
				parser.tokenValue = ret;
				parser.tokenRaw = parser.source.slice(
					start + 1,
					parser.index - (token === 67174409 ? 1 : 2)
				);
				return token;
			}
			function scanBadTemplate(parser, ch) {
				while (ch !== 96) {
					switch (ch) {
						case 36: {
							const index = parser.index + 1;
							if (
								index < parser.end &&
								parser.source.charCodeAt(index) === 123
							) {
								parser.index = index;
								parser.column++;
								return -ch;
							}
							break;
						}
						case 10:
						case 8232:
						case 8233:
							parser.column = -1;
							parser.line++;
					}
					if (parser.index >= parser.end) report(parser, 15);
					ch = advanceChar(parser);
				}
				return ch;
			}
			function scanTemplateTail(parser, context) {
				if (parser.index >= parser.end) report(parser, 0);
				parser.index--;
				parser.column--;
				return scanTemplate(parser, context);
			}

			function scanNumber(parser, context, kind) {
				let char = parser.currentChar;
				let value = 0;
				let digit = 9;
				let atStart = kind & 64 ? 0 : 1;
				let digits = 0;
				let allowSeparator = 0;
				if (kind & 64) {
					value = '.' + scanDecimalDigitsOrSeparator(parser, char);
					char = parser.currentChar;
					if (char === 110) report(parser, 11);
				} else {
					if (char === 48) {
						char = advanceChar(parser);
						if ((char | 32) === 120) {
							kind = 8 | 128;
							char = advanceChar(parser);
							while (CharTypes[char] & (64 | 4096)) {
								if (char === 95) {
									if (!allowSeparator) report(parser, 147);
									allowSeparator = 0;
									char = advanceChar(parser);
									continue;
								}
								allowSeparator = 1;
								value = value * 0x10 + toHex(char);
								digits++;
								char = advanceChar(parser);
							}
							if (digits === 0 || !allowSeparator) {
								report(parser, digits === 0 ? 19 : 148);
							}
						} else if ((char | 32) === 111) {
							kind = 4 | 128;
							char = advanceChar(parser);
							while (CharTypes[char] & (32 | 4096)) {
								if (char === 95) {
									if (!allowSeparator) {
										report(parser, 147);
									}
									allowSeparator = 0;
									char = advanceChar(parser);
									continue;
								}
								allowSeparator = 1;
								value = value * 8 + (char - 48);
								digits++;
								char = advanceChar(parser);
							}
							if (digits === 0 || !allowSeparator) {
								report(parser, digits === 0 ? 0 : 148);
							}
						} else if ((char | 32) === 98) {
							kind = 2 | 128;
							char = advanceChar(parser);
							while (CharTypes[char] & (128 | 4096)) {
								if (char === 95) {
									if (!allowSeparator) {
										report(parser, 147);
									}
									allowSeparator = 0;
									char = advanceChar(parser);
									continue;
								}
								allowSeparator = 1;
								value = value * 2 + (char - 48);
								digits++;
								char = advanceChar(parser);
							}
							if (digits === 0 || !allowSeparator) {
								report(parser, digits === 0 ? 0 : 148);
							}
						} else if (CharTypes[char] & 32) {
							if (context & 1024) report(parser, 1);
							kind = 1;
							while (CharTypes[char] & 16) {
								if (CharTypes[char] & 512) {
									kind = 32;
									atStart = 0;
									break;
								}
								value = value * 8 + (char - 48);
								char = advanceChar(parser);
							}
						} else if (CharTypes[char] & 512) {
							if (context & 1024) report(parser, 1);
							parser.flags |= 64;
							kind = 32;
						} else if (char === 95) {
							report(parser, 0);
						}
					}
					if (kind & 48) {
						if (atStart) {
							while (
								digit >= 0 &&
								CharTypes[char] & (16 | 4096)
							) {
								if (char === 95) {
									char = advanceChar(parser);
									if (char === 95 || kind & 32) {
										reportScannerError(
											parser.index,
											parser.line,
											parser.index + 1,
											147
										);
									}
									allowSeparator = 1;
									continue;
								}
								allowSeparator = 0;
								value = 10 * value + (char - 48);
								char = advanceChar(parser);
								--digit;
							}
							if (allowSeparator) {
								reportScannerError(
									parser.index,
									parser.line,
									parser.index + 1,
									148
								);
							}
							if (
								digit >= 0 &&
								!isIdentifierStart(char) &&
								char !== 46
							) {
								parser.tokenValue = value;
								if (context & 512)
									parser.tokenRaw = parser.source.slice(
										parser.tokenPos,
										parser.index
									);
								return 134283266;
							}
						}
						value += scanDecimalDigitsOrSeparator(parser, char);
						char = parser.currentChar;
						if (char === 46) {
							if (advanceChar(parser) === 95) report(parser, 0);
							kind = 64;
							value +=
								'.' +
								scanDecimalDigitsOrSeparator(
									parser,
									parser.currentChar
								);
							char = parser.currentChar;
						}
					}
				}
				const end = parser.index;
				let isBigInt = 0;
				if (char === 110 && kind & 128) {
					isBigInt = 1;
					char = advanceChar(parser);
				} else {
					if ((char | 32) === 101) {
						char = advanceChar(parser);
						if (CharTypes[char] & 256) char = advanceChar(parser);
						const { index } = parser;
						if ((CharTypes[char] & 16) === 0) report(parser, 10);
						value +=
							parser.source.substring(end, index) +
							scanDecimalDigitsOrSeparator(parser, char);
						char = parser.currentChar;
					}
				}
				if (
					(parser.index < parser.end && CharTypes[char] & 16) ||
					isIdentifierStart(char)
				) {
					report(parser, 12);
				}
				if (isBigInt) {
					parser.tokenRaw = parser.source.slice(
						parser.tokenPos,
						parser.index
					);
					parser.tokenValue = BigInt(value);
					return 134283389;
				}
				parser.tokenValue =
					kind & (1 | 2 | 8 | 4)
						? value
						: kind & 32
							? parseFloat(
									parser.source.substring(
										parser.tokenPos,
										parser.index
									)
								)
							: +value;
				if (context & 512)
					parser.tokenRaw = parser.source.slice(
						parser.tokenPos,
						parser.index
					);
				return 134283266;
			}
			function scanDecimalDigitsOrSeparator(parser, char) {
				let allowSeparator = 0;
				let start = parser.index;
				let ret = '';
				while (CharTypes[char] & (16 | 4096)) {
					if (char === 95) {
						const { index } = parser;
						char = advanceChar(parser);
						if (char === 95) {
							reportScannerError(
								parser.index,
								parser.line,
								parser.index + 1,
								147
							);
						}
						allowSeparator = 1;
						ret += parser.source.substring(start, index);
						start = parser.index;
						continue;
					}
					allowSeparator = 0;
					char = advanceChar(parser);
				}
				if (allowSeparator) {
					reportScannerError(
						parser.index,
						parser.line,
						parser.index + 1,
						148
					);
				}
				return ret + parser.source.substring(start, parser.index);
			}

			const KeywordDescTable = [
				'end of source',
				'identifier',
				'number',
				'string',
				'regular expression',
				'false',
				'true',
				'null',
				'template continuation',
				'template tail',
				'=>',
				'(',
				'{',
				'.',
				'...',
				'}',
				')',
				';',
				',',
				'[',
				']',
				':',
				'?',
				"'",
				'"',
				'</',
				'/>',
				'++',
				'--',
				'=',
				'<<=',
				'>>=',
				'>>>=',
				'**=',
				'+=',
				'-=',
				'*=',
				'/=',
				'%=',
				'^=',
				'|=',
				'&=',
				'||=',
				'&&=',
				'??=',
				'typeof',
				'delete',
				'void',
				'!',
				'~',
				'+',
				'-',
				'in',
				'instanceof',
				'*',
				'%',
				'/',
				'**',
				'&&',
				'||',
				'===',
				'!==',
				'==',
				'!=',
				'<=',
				'>=',
				'<',
				'>',
				'<<',
				'>>',
				'>>>',
				'&',
				'|',
				'^',
				'var',
				'let',
				'const',
				'break',
				'case',
				'catch',
				'class',
				'continue',
				'debugger',
				'default',
				'do',
				'else',
				'export',
				'extends',
				'finally',
				'for',
				'function',
				'if',
				'import',
				'new',
				'return',
				'super',
				'switch',
				'this',
				'throw',
				'try',
				'while',
				'with',
				'implements',
				'interface',
				'package',
				'private',
				'protected',
				'public',
				'static',
				'yield',
				'as',
				'async',
				'await',
				'constructor',
				'get',
				'set',
				'from',
				'of',
				'enum',
				'eval',
				'arguments',
				'escaped keyword',
				'escaped future reserved keyword',
				'reserved if strict',
				'#',
				'BigIntLiteral',
				'??',
				'?.',
				'WhiteSpace',
				'Illegal',
				'LineTerminator',
				'PrivateField',
				'Template',
				'@',
				'target',
				'meta',
				'LineFeed',
				'Escaped',
				'JSXText'
			];
			const descKeywordTable = Object.create(null, {
				this: { value: 86113 },
				function: { value: 86106 },
				if: { value: 20571 },
				return: { value: 20574 },
				var: { value: 86090 },
				else: { value: 20565 },
				for: { value: 20569 },
				new: { value: 86109 },
				in: { value: 8738868 },
				typeof: { value: 16863277 },
				while: { value: 20580 },
				case: { value: 20558 },
				break: { value: 20557 },
				try: { value: 20579 },
				catch: { value: 20559 },
				delete: { value: 16863278 },
				throw: { value: 86114 },
				switch: { value: 86112 },
				continue: { value: 20561 },
				default: { value: 20563 },
				instanceof: { value: 8476725 },
				do: { value: 20564 },
				void: { value: 16863279 },
				finally: { value: 20568 },
				async: { value: 209007 },
				await: { value: 209008 },
				class: { value: 86096 },
				const: { value: 86092 },
				constructor: { value: 12401 },
				debugger: { value: 20562 },
				export: { value: 20566 },
				extends: { value: 20567 },
				false: { value: 86021 },
				from: { value: 12404 },
				get: { value: 12402 },
				implements: { value: 36966 },
				import: { value: 86108 },
				interface: { value: 36967 },
				let: { value: 241739 },
				null: { value: 86023 },
				of: { value: 274549 },
				package: { value: 36968 },
				private: { value: 36969 },
				protected: { value: 36970 },
				public: { value: 36971 },
				set: { value: 12403 },
				static: { value: 36972 },
				super: { value: 86111 },
				true: { value: 86022 },
				with: { value: 20581 },
				yield: { value: 241773 },
				enum: { value: 86134 },
				eval: { value: 537079927 },
				as: { value: 77934 },
				arguments: { value: 537079928 },
				target: { value: 143494 },
				meta: { value: 143495 }
			});

			function scanIdentifier(parser, context, isValidAsKeyword) {
				while (isIdPart[advanceChar(parser)]) {}
				parser.tokenValue = parser.source.slice(
					parser.tokenPos,
					parser.index
				);
				return parser.currentChar !== 92 && parser.currentChar <= 0x7e
					? descKeywordTable[parser.tokenValue] || 208897
					: scanIdentifierSlowCase(
							parser,
							context,
							0,
							isValidAsKeyword
						);
			}
			function scanUnicodeIdentifier(parser, context) {
				const cookedChar = scanIdentifierUnicodeEscape(parser);
				if (!isIdentifierPart(cookedChar)) report(parser, 4);
				parser.tokenValue = fromCodePoint(cookedChar);
				return scanIdentifierSlowCase(
					parser,
					context,
					1,
					CharTypes[cookedChar] & 4
				);
			}
			function scanIdentifierSlowCase(
				parser,
				context,
				hasEscape,
				isValidAsKeyword
			) {
				let start = parser.index;
				while (parser.index < parser.end) {
					if (parser.currentChar === 92) {
						parser.tokenValue += parser.source.slice(
							start,
							parser.index
						);
						hasEscape = 1;
						const code = scanIdentifierUnicodeEscape(parser);
						if (!isIdentifierPart(code)) report(parser, 4);
						isValidAsKeyword =
							isValidAsKeyword && CharTypes[code] & 4;
						parser.tokenValue += fromCodePoint(code);
						start = parser.index;
					} else if (
						isIdentifierPart(parser.currentChar) ||
						consumeMultiUnitCodePoint(parser, parser.currentChar)
					) {
						advanceChar(parser);
					} else {
						break;
					}
				}
				if (parser.index <= parser.end) {
					parser.tokenValue += parser.source.slice(
						start,
						parser.index
					);
				}
				const length = parser.tokenValue.length;
				if (isValidAsKeyword && length >= 2 && length <= 11) {
					const token = descKeywordTable[parser.tokenValue];
					if (token === void 0) return 208897;
					if (!hasEscape) return token;
					if (token === 209008) {
						if ((context & (2048 | 4194304)) === 0) {
							return token;
						}
						return 121;
					}
					if (context & 1024) {
						if (token === 36972) {
							return 122;
						}
						if ((token & 36864) === 36864) {
							return 122;
						}
						if ((token & 20480) === 20480) {
							if (context & 268435456 && (context & 8192) === 0) {
								return token;
							} else {
								return 121;
							}
						}
						return 143483;
					}
					if (
						context & 268435456 &&
						(context & 8192) === 0 &&
						(token & 20480) === 20480
					)
						return token;
					if (token === 241773) {
						return context & 268435456
							? 143483
							: context & 2097152
								? 121
								: token;
					}
					if (token === 209007) {
						return 143483;
					}
					if ((token & 36864) === 36864) {
						return token;
					}
					return 121;
				}
				return 208897;
			}
			function scanPrivateIdentifier(parser) {
				if (!isIdentifierStart(advanceChar(parser))) report(parser, 94);
				return 131;
			}
			function scanIdentifierUnicodeEscape(parser) {
				if (parser.source.charCodeAt(parser.index + 1) !== 117) {
					report(parser, 4);
				}
				parser.currentChar = parser.source.charCodeAt(
					(parser.index += 2)
				);
				return scanUnicodeEscape(parser);
			}
			function scanUnicodeEscape(parser) {
				let codePoint = 0;
				const char = parser.currentChar;
				if (char === 123) {
					const begin = parser.index - 2;
					while (CharTypes[advanceChar(parser)] & 64) {
						codePoint =
							(codePoint << 4) | toHex(parser.currentChar);
						if (codePoint > 1114111)
							reportScannerError(
								begin,
								parser.line,
								parser.index + 1,
								102
							);
					}
					if (parser.currentChar !== 125) {
						reportScannerError(
							begin,
							parser.line,
							parser.index - 1,
							6
						);
					}
					advanceChar(parser);
					return codePoint;
				}
				if ((CharTypes[char] & 64) === 0) report(parser, 6);
				const char2 = parser.source.charCodeAt(parser.index + 1);
				if ((CharTypes[char2] & 64) === 0) report(parser, 6);
				const char3 = parser.source.charCodeAt(parser.index + 2);
				if ((CharTypes[char3] & 64) === 0) report(parser, 6);
				const char4 = parser.source.charCodeAt(parser.index + 3);
				if ((CharTypes[char4] & 64) === 0) report(parser, 6);
				codePoint =
					(toHex(char) << 12) |
					(toHex(char2) << 8) |
					(toHex(char3) << 4) |
					toHex(char4);
				parser.currentChar = parser.source.charCodeAt(
					(parser.index += 4)
				);
				return codePoint;
			}

			const TokenLookup = [
				129, 129, 129, 129, 129, 129, 129, 129, 129, 128, 136, 128, 128,
				130, 129, 129, 129, 129, 129, 129, 129, 129, 129, 129, 129, 129,
				129, 129, 129, 129, 129, 129, 128, 16842800, 134283267, 131,
				208897, 8457015, 8455751, 134283267, 67174411, 16, 8457014,
				25233970, 18, 25233971, 67108877, 8457016, 134283266, 134283266,
				134283266, 134283266, 134283266, 134283266, 134283266,
				134283266, 134283266, 134283266, 21, 1074790417, 8456258,
				1077936157, 8456259, 22, 133, 208897, 208897, 208897, 208897,
				208897, 208897, 208897, 208897, 208897, 208897, 208897, 208897,
				208897, 208897, 208897, 208897, 208897, 208897, 208897, 208897,
				208897, 208897, 208897, 208897, 208897, 208897, 69271571, 137,
				20, 8455497, 208897, 132, 4096, 4096, 4096, 4096, 4096, 4096,
				4096, 208897, 4096, 208897, 208897, 4096, 208897, 4096, 208897,
				4096, 208897, 4096, 4096, 4096, 208897, 4096, 4096, 208897,
				4096, 4096, 2162700, 8455240, 1074790415, 16842801, 129
			];
			function nextToken(parser, context) {
				parser.flags = (parser.flags | 1) ^ 1;
				parser.startPos = parser.index;
				parser.startColumn = parser.column;
				parser.startLine = parser.line;
				parser.token = scanSingleToken(parser, context, 0);
				if (parser.onToken && parser.token !== 1048576) {
					const loc = {
						start: {
							line: parser.linePos,
							column: parser.colPos
						},
						end: {
							line: parser.line,
							column: parser.column
						}
					};
					parser.onToken(
						convertTokenType(parser.token),
						parser.tokenPos,
						parser.index,
						loc
					);
				}
			}
			function scanSingleToken(parser, context, state) {
				const isStartOfLine = parser.index === 0;
				const source = parser.source;
				let startPos = parser.index;
				let startLine = parser.line;
				let startColumn = parser.column;
				while (parser.index < parser.end) {
					parser.tokenPos = parser.index;
					parser.colPos = parser.column;
					parser.linePos = parser.line;
					let char = parser.currentChar;
					if (char <= 0x7e) {
						const token = TokenLookup[char];
						switch (token) {
							case 67174411:
							case 16:
							case 2162700:
							case 1074790415:
							case 69271571:
							case 20:
							case 21:
							case 1074790417:
							case 18:
							case 16842801:
							case 133:
							case 129:
								advanceChar(parser);
								return token;
							case 208897:
								return scanIdentifier(parser, context, 0);
							case 4096:
								return scanIdentifier(parser, context, 1);
							case 134283266:
								return scanNumber(parser, context, 16 | 128);
							case 134283267:
								return scanString(parser, context, char);
							case 132:
								return scanTemplate(parser, context);
							case 137:
								return scanUnicodeIdentifier(parser, context);
							case 131:
								return scanPrivateIdentifier(parser);
							case 128:
								advanceChar(parser);
								break;
							case 130:
								state |= 1 | 4;
								scanNewLine(parser);
								break;
							case 136:
								consumeLineFeed(parser, state);
								state = (state & ~4) | 1;
								break;
							case 8456258:
								let ch = advanceChar(parser);
								if (parser.index < parser.end) {
									if (ch === 60) {
										if (
											parser.index < parser.end &&
											advanceChar(parser) === 61
										) {
											advanceChar(parser);
											return 4194334;
										}
										return 8456516;
									} else if (ch === 61) {
										advanceChar(parser);
										return 8456256;
									}
									if (ch === 33) {
										const index = parser.index + 1;
										if (
											index + 1 < parser.end &&
											source.charCodeAt(index) === 45 &&
											source.charCodeAt(index + 1) == 45
										) {
											parser.column += 3;
											parser.currentChar =
												source.charCodeAt(
													(parser.index += 3)
												);
											state = skipSingleHTMLComment(
												parser,
												source,
												state,
												context,
												2,
												parser.tokenPos,
												parser.linePos,
												parser.colPos
											);
											startPos = parser.tokenPos;
											startLine = parser.linePos;
											startColumn = parser.colPos;
											continue;
										}
										return 8456258;
									}
									if (ch === 47) {
										if ((context & 16) === 0)
											return 8456258;
										const index = parser.index + 1;
										if (index < parser.end) {
											ch = source.charCodeAt(index);
											if (ch === 42 || ch === 47) break;
										}
										advanceChar(parser);
										return 25;
									}
								}
								return 8456258;
							case 1077936157: {
								advanceChar(parser);
								const ch = parser.currentChar;
								if (ch === 61) {
									if (advanceChar(parser) === 61) {
										advanceChar(parser);
										return 8455996;
									}
									return 8455998;
								}
								if (ch === 62) {
									advanceChar(parser);
									return 10;
								}
								return 1077936157;
							}
							case 16842800:
								if (advanceChar(parser) !== 61) {
									return 16842800;
								}
								if (advanceChar(parser) !== 61) {
									return 8455999;
								}
								advanceChar(parser);
								return 8455997;
							case 8457015:
								if (advanceChar(parser) !== 61) return 8457015;
								advanceChar(parser);
								return 4194342;
							case 8457014: {
								advanceChar(parser);
								if (parser.index >= parser.end) return 8457014;
								const ch = parser.currentChar;
								if (ch === 61) {
									advanceChar(parser);
									return 4194340;
								}
								if (ch !== 42) return 8457014;
								if (advanceChar(parser) !== 61) return 8457273;
								advanceChar(parser);
								return 4194337;
							}
							case 8455497:
								if (advanceChar(parser) !== 61) return 8455497;
								advanceChar(parser);
								return 4194343;
							case 25233970: {
								advanceChar(parser);
								const ch = parser.currentChar;
								if (ch === 43) {
									advanceChar(parser);
									return 33619995;
								}
								if (ch === 61) {
									advanceChar(parser);
									return 4194338;
								}
								return 25233970;
							}
							case 25233971: {
								advanceChar(parser);
								const ch = parser.currentChar;
								if (ch === 45) {
									advanceChar(parser);
									if (
										(state & 1 || isStartOfLine) &&
										parser.currentChar === 62
									) {
										if ((context & 256) === 0)
											report(parser, 109);
										advanceChar(parser);
										state = skipSingleHTMLComment(
											parser,
											source,
											state,
											context,
											3,
											startPos,
											startLine,
											startColumn
										);
										startPos = parser.tokenPos;
										startLine = parser.linePos;
										startColumn = parser.colPos;
										continue;
									}
									return 33619996;
								}
								if (ch === 61) {
									advanceChar(parser);
									return 4194339;
								}
								return 25233971;
							}
							case 8457016: {
								advanceChar(parser);
								if (parser.index < parser.end) {
									const ch = parser.currentChar;
									if (ch === 47) {
										advanceChar(parser);
										state = skipSingleLineComment(
											parser,
											source,
											state,
											0,
											parser.tokenPos,
											parser.linePos,
											parser.colPos
										);
										startPos = parser.tokenPos;
										startLine = parser.linePos;
										startColumn = parser.colPos;
										continue;
									}
									if (ch === 42) {
										advanceChar(parser);
										state = skipMultiLineComment(
											parser,
											source,
											state
										);
										startPos = parser.tokenPos;
										startLine = parser.linePos;
										startColumn = parser.colPos;
										continue;
									}
									if (context & 32768) {
										return scanRegularExpression(
											parser,
											context
										);
									}
									if (ch === 61) {
										advanceChar(parser);
										return 4259877;
									}
								}
								return 8457016;
							}
							case 67108877:
								const next = advanceChar(parser);
								if (next >= 48 && next <= 57)
									return scanNumber(parser, context, 64 | 16);
								if (next === 46) {
									const index = parser.index + 1;
									if (
										index < parser.end &&
										source.charCodeAt(index) === 46
									) {
										parser.column += 2;
										parser.currentChar = source.charCodeAt(
											(parser.index += 2)
										);
										return 14;
									}
								}
								return 67108877;
							case 8455240: {
								advanceChar(parser);
								const ch = parser.currentChar;
								if (ch === 124) {
									advanceChar(parser);
									if (parser.currentChar === 61) {
										advanceChar(parser);
										return 4194346;
									}
									return 8979003;
								}
								if (ch === 61) {
									advanceChar(parser);
									return 4194344;
								}
								return 8455240;
							}
							case 8456259: {
								advanceChar(parser);
								const ch = parser.currentChar;
								if (ch === 61) {
									advanceChar(parser);
									return 8456257;
								}
								if (ch !== 62) return 8456259;
								advanceChar(parser);
								if (parser.index < parser.end) {
									const ch = parser.currentChar;
									if (ch === 62) {
										if (advanceChar(parser) === 61) {
											advanceChar(parser);
											return 4194336;
										}
										return 8456518;
									}
									if (ch === 61) {
										advanceChar(parser);
										return 4194335;
									}
								}
								return 8456517;
							}
							case 8455751: {
								advanceChar(parser);
								const ch = parser.currentChar;
								if (ch === 38) {
									advanceChar(parser);
									if (parser.currentChar === 61) {
										advanceChar(parser);
										return 4194347;
									}
									return 8979258;
								}
								if (ch === 61) {
									advanceChar(parser);
									return 4194345;
								}
								return 8455751;
							}
							case 22: {
								let ch = advanceChar(parser);
								if (ch === 63) {
									advanceChar(parser);
									if (parser.currentChar === 61) {
										advanceChar(parser);
										return 4194348;
									}
									return 276889982;
								}
								if (ch === 46) {
									const index = parser.index + 1;
									if (index < parser.end) {
										ch = source.charCodeAt(index);
										if (!(ch >= 48 && ch <= 57)) {
											advanceChar(parser);
											return 67108991;
										}
									}
								}
								return 22;
							}
						}
					} else {
						if ((char ^ 8232) <= 1) {
							state = (state & ~4) | 1;
							scanNewLine(parser);
							continue;
						}
						if (
							(char & 0xfc00) === 0xd800 ||
							((unicodeLookup[(char >>> 5) + 34816] >>> char) &
								31 &
								1) !==
								0
						) {
							if ((char & 0xfc00) === 0xdc00) {
								char =
									((char & 0x3ff) << 10) |
									(char & 0x3ff) |
									0x10000;
								if (
									((unicodeLookup[(char >>> 5) + 0] >>>
										char) &
										31 &
										1) ===
									0
								) {
									report(parser, 18, fromCodePoint(char));
								}
								parser.index++;
								parser.currentChar = char;
							}
							parser.column++;
							parser.tokenValue = '';
							return scanIdentifierSlowCase(
								parser,
								context,
								0,
								0
							);
						}
						if (isExoticECMAScriptWhitespace(char)) {
							advanceChar(parser);
							continue;
						}
						report(parser, 18, fromCodePoint(char));
					}
				}
				return 1048576;
			}

			const entities = {
				AElig: '\u00C6',
				AMP: '\u0026',
				Aacute: '\u00C1',
				Abreve: '\u0102',
				Acirc: '\u00C2',
				Acy: '\u0410',
				Afr: '\uD835\uDD04',
				Agrave: '\u00C0',
				Alpha: '\u0391',
				Amacr: '\u0100',
				And: '\u2A53',
				Aogon: '\u0104',
				Aopf: '\uD835\uDD38',
				ApplyFunction: '\u2061',
				Aring: '\u00C5',
				Ascr: '\uD835\uDC9C',
				Assign: '\u2254',
				Atilde: '\u00C3',
				Auml: '\u00C4',
				Backslash: '\u2216',
				Barv: '\u2AE7',
				Barwed: '\u2306',
				Bcy: '\u0411',
				Because: '\u2235',
				Bernoullis: '\u212C',
				Beta: '\u0392',
				Bfr: '\uD835\uDD05',
				Bopf: '\uD835\uDD39',
				Breve: '\u02D8',
				Bscr: '\u212C',
				Bumpeq: '\u224E',
				CHcy: '\u0427',
				COPY: '\u00A9',
				Cacute: '\u0106',
				Cap: '\u22D2',
				CapitalDifferentialD: '\u2145',
				Cayleys: '\u212D',
				Ccaron: '\u010C',
				Ccedil: '\u00C7',
				Ccirc: '\u0108',
				Cconint: '\u2230',
				Cdot: '\u010A',
				Cedilla: '\u00B8',
				CenterDot: '\u00B7',
				Cfr: '\u212D',
				Chi: '\u03A7',
				CircleDot: '\u2299',
				CircleMinus: '\u2296',
				CirclePlus: '\u2295',
				CircleTimes: '\u2297',
				ClockwiseContourIntegral: '\u2232',
				CloseCurlyDoubleQuote: '\u201D',
				CloseCurlyQuote: '\u2019',
				Colon: '\u2237',
				Colone: '\u2A74',
				Congruent: '\u2261',
				Conint: '\u222F',
				ContourIntegral: '\u222E',
				Copf: '\u2102',
				Coproduct: '\u2210',
				CounterClockwiseContourIntegral: '\u2233',
				Cross: '\u2A2F',
				Cscr: '\uD835\uDC9E',
				Cup: '\u22D3',
				CupCap: '\u224D',
				DD: '\u2145',
				DDotrahd: '\u2911',
				DJcy: '\u0402',
				DScy: '\u0405',
				DZcy: '\u040F',
				Dagger: '\u2021',
				Darr: '\u21A1',
				Dashv: '\u2AE4',
				Dcaron: '\u010E',
				Dcy: '\u0414',
				Del: '\u2207',
				Delta: '\u0394',
				Dfr: '\uD835\uDD07',
				DiacriticalAcute: '\u00B4',
				DiacriticalDot: '\u02D9',
				DiacriticalDoubleAcute: '\u02DD',
				DiacriticalGrave: '\u0060',
				DiacriticalTilde: '\u02DC',
				Diamond: '\u22C4',
				DifferentialD: '\u2146',
				Dopf: '\uD835\uDD3B',
				Dot: '\u00A8',
				DotDot: '\u20DC',
				DotEqual: '\u2250',
				DoubleContourIntegral: '\u222F',
				DoubleDot: '\u00A8',
				DoubleDownArrow: '\u21D3',
				DoubleLeftArrow: '\u21D0',
				DoubleLeftRightArrow: '\u21D4',
				DoubleLeftTee: '\u2AE4',
				DoubleLongLeftArrow: '\u27F8',
				DoubleLongLeftRightArrow: '\u27FA',
				DoubleLongRightArrow: '\u27F9',
				DoubleRightArrow: '\u21D2',
				DoubleRightTee: '\u22A8',
				DoubleUpArrow: '\u21D1',
				DoubleUpDownArrow: '\u21D5',
				DoubleVerticalBar: '\u2225',
				DownArrow: '\u2193',
				DownArrowBar: '\u2913',
				DownArrowUpArrow: '\u21F5',
				DownBreve: '\u0311',
				DownLeftRightVector: '\u2950',
				DownLeftTeeVector: '\u295E',
				DownLeftVector: '\u21BD',
				DownLeftVectorBar: '\u2956',
				DownRightTeeVector: '\u295F',
				DownRightVector: '\u21C1',
				DownRightVectorBar: '\u2957',
				DownTee: '\u22A4',
				DownTeeArrow: '\u21A7',
				Downarrow: '\u21D3',
				Dscr: '\uD835\uDC9F',
				Dstrok: '\u0110',
				ENG: '\u014A',
				ETH: '\u00D0',
				Eacute: '\u00C9',
				Ecaron: '\u011A',
				Ecirc: '\u00CA',
				Ecy: '\u042D',
				Edot: '\u0116',
				Efr: '\uD835\uDD08',
				Egrave: '\u00C8',
				Element: '\u2208',
				Emacr: '\u0112',
				EmptySmallSquare: '\u25FB',
				EmptyVerySmallSquare: '\u25AB',
				Eogon: '\u0118',
				Eopf: '\uD835\uDD3C',
				Epsilon: '\u0395',
				Equal: '\u2A75',
				EqualTilde: '\u2242',
				Equilibrium: '\u21CC',
				Escr: '\u2130',
				Esim: '\u2A73',
				Eta: '\u0397',
				Euml: '\u00CB',
				Exists: '\u2203',
				ExponentialE: '\u2147',
				Fcy: '\u0424',
				Ffr: '\uD835\uDD09',
				FilledSmallSquare: '\u25FC',
				FilledVerySmallSquare: '\u25AA',
				Fopf: '\uD835\uDD3D',
				ForAll: '\u2200',
				Fouriertrf: '\u2131',
				Fscr: '\u2131',
				GJcy: '\u0403',
				GT: '\u003E',
				Gamma: '\u0393',
				Gammad: '\u03DC',
				Gbreve: '\u011E',
				Gcedil: '\u0122',
				Gcirc: '\u011C',
				Gcy: '\u0413',
				Gdot: '\u0120',
				Gfr: '\uD835\uDD0A',
				Gg: '\u22D9',
				Gopf: '\uD835\uDD3E',
				GreaterEqual: '\u2265',
				GreaterEqualLess: '\u22DB',
				GreaterFullEqual: '\u2267',
				GreaterGreater: '\u2AA2',
				GreaterLess: '\u2277',
				GreaterSlantEqual: '\u2A7E',
				GreaterTilde: '\u2273',
				Gscr: '\uD835\uDCA2',
				Gt: '\u226B',
				HARDcy: '\u042A',
				Hacek: '\u02C7',
				Hat: '\u005E',
				Hcirc: '\u0124',
				Hfr: '\u210C',
				HilbertSpace: '\u210B',
				Hopf: '\u210D',
				HorizontalLine: '\u2500',
				Hscr: '\u210B',
				Hstrok: '\u0126',
				HumpDownHump: '\u224E',
				HumpEqual: '\u224F',
				IEcy: '\u0415',
				IJlig: '\u0132',
				IOcy: '\u0401',
				Iacute: '\u00CD',
				Icirc: '\u00CE',
				Icy: '\u0418',
				Idot: '\u0130',
				Ifr: '\u2111',
				Igrave: '\u00CC',
				Im: '\u2111',
				Imacr: '\u012A',
				ImaginaryI: '\u2148',
				Implies: '\u21D2',
				Int: '\u222C',
				Integral: '\u222B',
				Intersection: '\u22C2',
				InvisibleComma: '\u2063',
				InvisibleTimes: '\u2062',
				Iogon: '\u012E',
				Iopf: '\uD835\uDD40',
				Iota: '\u0399',
				Iscr: '\u2110',
				Itilde: '\u0128',
				Iukcy: '\u0406',
				Iuml: '\u00CF',
				Jcirc: '\u0134',
				Jcy: '\u0419',
				Jfr: '\uD835\uDD0D',
				Jopf: '\uD835\uDD41',
				Jscr: '\uD835\uDCA5',
				Jsercy: '\u0408',
				Jukcy: '\u0404',
				KHcy: '\u0425',
				KJcy: '\u040C',
				Kappa: '\u039A',
				Kcedil: '\u0136',
				Kcy: '\u041A',
				Kfr: '\uD835\uDD0E',
				Kopf: '\uD835\uDD42',
				Kscr: '\uD835\uDCA6',
				LJcy: '\u0409',
				LT: '\u003C',
				Lacute: '\u0139',
				Lambda: '\u039B',
				Lang: '\u27EA',
				Laplacetrf: '\u2112',
				Larr: '\u219E',
				Lcaron: '\u013D',
				Lcedil: '\u013B',
				Lcy: '\u041B',
				LeftAngleBracket: '\u27E8',
				LeftArrow: '\u2190',
				LeftArrowBar: '\u21E4',
				LeftArrowRightArrow: '\u21C6',
				LeftCeiling: '\u2308',
				LeftDoubleBracket: '\u27E6',
				LeftDownTeeVector: '\u2961',
				LeftDownVector: '\u21C3',
				LeftDownVectorBar: '\u2959',
				LeftFloor: '\u230A',
				LeftRightArrow: '\u2194',
				LeftRightVector: '\u294E',
				LeftTee: '\u22A3',
				LeftTeeArrow: '\u21A4',
				LeftTeeVector: '\u295A',
				LeftTriangle: '\u22B2',
				LeftTriangleBar: '\u29CF',
				LeftTriangleEqual: '\u22B4',
				LeftUpDownVector: '\u2951',
				LeftUpTeeVector: '\u2960',
				LeftUpVector: '\u21BF',
				LeftUpVectorBar: '\u2958',
				LeftVector: '\u21BC',
				LeftVectorBar: '\u2952',
				Leftarrow: '\u21D0',
				Leftrightarrow: '\u21D4',
				LessEqualGreater: '\u22DA',
				LessFullEqual: '\u2266',
				LessGreater: '\u2276',
				LessLess: '\u2AA1',
				LessSlantEqual: '\u2A7D',
				LessTilde: '\u2272',
				Lfr: '\uD835\uDD0F',
				Ll: '\u22D8',
				Lleftarrow: '\u21DA',
				Lmidot: '\u013F',
				LongLeftArrow: '\u27F5',
				LongLeftRightArrow: '\u27F7',
				LongRightArrow: '\u27F6',
				Longleftarrow: '\u27F8',
				Longleftrightarrow: '\u27FA',
				Longrightarrow: '\u27F9',
				Lopf: '\uD835\uDD43',
				LowerLeftArrow: '\u2199',
				LowerRightArrow: '\u2198',
				Lscr: '\u2112',
				Lsh: '\u21B0',
				Lstrok: '\u0141',
				Lt: '\u226A',
				Map: '\u2905',
				Mcy: '\u041C',
				MediumSpace: '\u205F',
				Mellintrf: '\u2133',
				Mfr: '\uD835\uDD10',
				MinusPlus: '\u2213',
				Mopf: '\uD835\uDD44',
				Mscr: '\u2133',
				Mu: '\u039C',
				NJcy: '\u040A',
				Nacute: '\u0143',
				Ncaron: '\u0147',
				Ncedil: '\u0145',
				Ncy: '\u041D',
				NegativeMediumSpace: '\u200B',
				NegativeThickSpace: '\u200B',
				NegativeThinSpace: '\u200B',
				NegativeVeryThinSpace: '\u200B',
				NestedGreaterGreater: '\u226B',
				NestedLessLess: '\u226A',
				NewLine: '\u000A',
				Nfr: '\uD835\uDD11',
				NoBreak: '\u2060',
				NonBreakingSpace: '\u00A0',
				Nopf: '\u2115',
				Not: '\u2AEC',
				NotCongruent: '\u2262',
				NotCupCap: '\u226D',
				NotDoubleVerticalBar: '\u2226',
				NotElement: '\u2209',
				NotEqual: '\u2260',
				NotEqualTilde: '\u2242\u0338',
				NotExists: '\u2204',
				NotGreater: '\u226F',
				NotGreaterEqual: '\u2271',
				NotGreaterFullEqual: '\u2267\u0338',
				NotGreaterGreater: '\u226B\u0338',
				NotGreaterLess: '\u2279',
				NotGreaterSlantEqual: '\u2A7E\u0338',
				NotGreaterTilde: '\u2275',
				NotHumpDownHump: '\u224E\u0338',
				NotHumpEqual: '\u224F\u0338',
				NotLeftTriangle: '\u22EA',
				NotLeftTriangleBar: '\u29CF\u0338',
				NotLeftTriangleEqual: '\u22EC',
				NotLess: '\u226E',
				NotLessEqual: '\u2270',
				NotLessGreater: '\u2278',
				NotLessLess: '\u226A\u0338',
				NotLessSlantEqual: '\u2A7D\u0338',
				NotLessTilde: '\u2274',
				NotNestedGreaterGreater: '\u2AA2\u0338',
				NotNestedLessLess: '\u2AA1\u0338',
				NotPrecedes: '\u2280',
				NotPrecedesEqual: '\u2AAF\u0338',
				NotPrecedesSlantEqual: '\u22E0',
				NotReverseElement: '\u220C',
				NotRightTriangle: '\u22EB',
				NotRightTriangleBar: '\u29D0\u0338',
				NotRightTriangleEqual: '\u22ED',
				NotSquareSubset: '\u228F\u0338',
				NotSquareSubsetEqual: '\u22E2',
				NotSquareSuperset: '\u2290\u0338',
				NotSquareSupersetEqual: '\u22E3',
				NotSubset: '\u2282\u20D2',
				NotSubsetEqual: '\u2288',
				NotSucceeds: '\u2281',
				NotSucceedsEqual: '\u2AB0\u0338',
				NotSucceedsSlantEqual: '\u22E1',
				NotSucceedsTilde: '\u227F\u0338',
				NotSuperset: '\u2283\u20D2',
				NotSupersetEqual: '\u2289',
				NotTilde: '\u2241',
				NotTildeEqual: '\u2244',
				NotTildeFullEqual: '\u2247',
				NotTildeTilde: '\u2249',
				NotVerticalBar: '\u2224',
				Nscr: '\uD835\uDCA9',
				Ntilde: '\u00D1',
				Nu: '\u039D',
				OElig: '\u0152',
				Oacute: '\u00D3',
				Ocirc: '\u00D4',
				Ocy: '\u041E',
				Odblac: '\u0150',
				Ofr: '\uD835\uDD12',
				Ograve: '\u00D2',
				Omacr: '\u014C',
				Omega: '\u03A9',
				Omicron: '\u039F',
				Oopf: '\uD835\uDD46',
				OpenCurlyDoubleQuote: '\u201C',
				OpenCurlyQuote: '\u2018',
				Or: '\u2A54',
				Oscr: '\uD835\uDCAA',
				Oslash: '\u00D8',
				Otilde: '\u00D5',
				Otimes: '\u2A37',
				Ouml: '\u00D6',
				OverBar: '\u203E',
				OverBrace: '\u23DE',
				OverBracket: '\u23B4',
				OverParenthesis: '\u23DC',
				PartialD: '\u2202',
				Pcy: '\u041F',
				Pfr: '\uD835\uDD13',
				Phi: '\u03A6',
				Pi: '\u03A0',
				PlusMinus: '\u00B1',
				Poincareplane: '\u210C',
				Popf: '\u2119',
				Pr: '\u2ABB',
				Precedes: '\u227A',
				PrecedesEqual: '\u2AAF',
				PrecedesSlantEqual: '\u227C',
				PrecedesTilde: '\u227E',
				Prime: '\u2033',
				Product: '\u220F',
				Proportion: '\u2237',
				Proportional: '\u221D',
				Pscr: '\uD835\uDCAB',
				Psi: '\u03A8',
				QUOT: '\u0022',
				Qfr: '\uD835\uDD14',
				Qopf: '\u211A',
				Qscr: '\uD835\uDCAC',
				RBarr: '\u2910',
				REG: '\u00AE',
				Racute: '\u0154',
				Rang: '\u27EB',
				Rarr: '\u21A0',
				Rarrtl: '\u2916',
				Rcaron: '\u0158',
				Rcedil: '\u0156',
				Rcy: '\u0420',
				Re: '\u211C',
				ReverseElement: '\u220B',
				ReverseEquilibrium: '\u21CB',
				ReverseUpEquilibrium: '\u296F',
				Rfr: '\u211C',
				Rho: '\u03A1',
				RightAngleBracket: '\u27E9',
				RightArrow: '\u2192',
				RightArrowBar: '\u21E5',
				RightArrowLeftArrow: '\u21C4',
				RightCeiling: '\u2309',
				RightDoubleBracket: '\u27E7',
				RightDownTeeVector: '\u295D',
				RightDownVector: '\u21C2',
				RightDownVectorBar: '\u2955',
				RightFloor: '\u230B',
				RightTee: '\u22A2',
				RightTeeArrow: '\u21A6',
				RightTeeVector: '\u295B',
				RightTriangle: '\u22B3',
				RightTriangleBar: '\u29D0',
				RightTriangleEqual: '\u22B5',
				RightUpDownVector: '\u294F',
				RightUpTeeVector: '\u295C',
				RightUpVector: '\u21BE',
				RightUpVectorBar: '\u2954',
				RightVector: '\u21C0',
				RightVectorBar: '\u2953',
				Rightarrow: '\u21D2',
				Ropf: '\u211D',
				RoundImplies: '\u2970',
				Rrightarrow: '\u21DB',
				Rscr: '\u211B',
				Rsh: '\u21B1',
				RuleDelayed: '\u29F4',
				SHCHcy: '\u0429',
				SHcy: '\u0428',
				SOFTcy: '\u042C',
				Sacute: '\u015A',
				Sc: '\u2ABC',
				Scaron: '\u0160',
				Scedil: '\u015E',
				Scirc: '\u015C',
				Scy: '\u0421',
				Sfr: '\uD835\uDD16',
				ShortDownArrow: '\u2193',
				ShortLeftArrow: '\u2190',
				ShortRightArrow: '\u2192',
				ShortUpArrow: '\u2191',
				Sigma: '\u03A3',
				SmallCircle: '\u2218',
				Sopf: '\uD835\uDD4A',
				Sqrt: '\u221A',
				Square: '\u25A1',
				SquareIntersection: '\u2293',
				SquareSubset: '\u228F',
				SquareSubsetEqual: '\u2291',
				SquareSuperset: '\u2290',
				SquareSupersetEqual: '\u2292',
				SquareUnion: '\u2294',
				Sscr: '\uD835\uDCAE',
				Star: '\u22C6',
				Sub: '\u22D0',
				Subset: '\u22D0',
				SubsetEqual: '\u2286',
				Succeeds: '\u227B',
				SucceedsEqual: '\u2AB0',
				SucceedsSlantEqual: '\u227D',
				SucceedsTilde: '\u227F',
				SuchThat: '\u220B',
				Sum: '\u2211',
				Sup: '\u22D1',
				Superset: '\u2283',
				SupersetEqual: '\u2287',
				Supset: '\u22D1',
				THORN: '\u00DE',
				TRADE: '\u2122',
				TSHcy: '\u040B',
				TScy: '\u0426',
				Tab: '\u0009',
				Tau: '\u03A4',
				Tcaron: '\u0164',
				Tcedil: '\u0162',
				Tcy: '\u0422',
				Tfr: '\uD835\uDD17',
				Therefore: '\u2234',
				Theta: '\u0398',
				ThickSpace: '\u205F\u200A',
				ThinSpace: '\u2009',
				Tilde: '\u223C',
				TildeEqual: '\u2243',
				TildeFullEqual: '\u2245',
				TildeTilde: '\u2248',
				Topf: '\uD835\uDD4B',
				TripleDot: '\u20DB',
				Tscr: '\uD835\uDCAF',
				Tstrok: '\u0166',
				Uacute: '\u00DA',
				Uarr: '\u219F',
				Uarrocir: '\u2949',
				Ubrcy: '\u040E',
				Ubreve: '\u016C',
				Ucirc: '\u00DB',
				Ucy: '\u0423',
				Udblac: '\u0170',
				Ufr: '\uD835\uDD18',
				Ugrave: '\u00D9',
				Umacr: '\u016A',
				UnderBar: '\u005F',
				UnderBrace: '\u23DF',
				UnderBracket: '\u23B5',
				UnderParenthesis: '\u23DD',
				Union: '\u22C3',
				UnionPlus: '\u228E',
				Uogon: '\u0172',
				Uopf: '\uD835\uDD4C',
				UpArrow: '\u2191',
				UpArrowBar: '\u2912',
				UpArrowDownArrow: '\u21C5',
				UpDownArrow: '\u2195',
				UpEquilibrium: '\u296E',
				UpTee: '\u22A5',
				UpTeeArrow: '\u21A5',
				Uparrow: '\u21D1',
				Updownarrow: '\u21D5',
				UpperLeftArrow: '\u2196',
				UpperRightArrow: '\u2197',
				Upsi: '\u03D2',
				Upsilon: '\u03A5',
				Uring: '\u016E',
				Uscr: '\uD835\uDCB0',
				Utilde: '\u0168',
				Uuml: '\u00DC',
				VDash: '\u22AB',
				Vbar: '\u2AEB',
				Vcy: '\u0412',
				Vdash: '\u22A9',
				Vdashl: '\u2AE6',
				Vee: '\u22C1',
				Verbar: '\u2016',
				Vert: '\u2016',
				VerticalBar: '\u2223',
				VerticalLine: '\u007C',
				VerticalSeparator: '\u2758',
				VerticalTilde: '\u2240',
				VeryThinSpace: '\u200A',
				Vfr: '\uD835\uDD19',
				Vopf: '\uD835\uDD4D',
				Vscr: '\uD835\uDCB1',
				Vvdash: '\u22AA',
				Wcirc: '\u0174',
				Wedge: '\u22C0',
				Wfr: '\uD835\uDD1A',
				Wopf: '\uD835\uDD4E',
				Wscr: '\uD835\uDCB2',
				Xfr: '\uD835\uDD1B',
				Xi: '\u039E',
				Xopf: '\uD835\uDD4F',
				Xscr: '\uD835\uDCB3',
				YAcy: '\u042F',
				YIcy: '\u0407',
				YUcy: '\u042E',
				Yacute: '\u00DD',
				Ycirc: '\u0176',
				Ycy: '\u042B',
				Yfr: '\uD835\uDD1C',
				Yopf: '\uD835\uDD50',
				Yscr: '\uD835\uDCB4',
				Yuml: '\u0178',
				ZHcy: '\u0416',
				Zacute: '\u0179',
				Zcaron: '\u017D',
				Zcy: '\u0417',
				Zdot: '\u017B',
				ZeroWidthSpace: '\u200B',
				Zeta: '\u0396',
				Zfr: '\u2128',
				Zopf: '\u2124',
				Zscr: '\uD835\uDCB5',
				aacute: '\u00E1',
				abreve: '\u0103',
				ac: '\u223E',
				acE: '\u223E\u0333',
				acd: '\u223F',
				acirc: '\u00E2',
				acute: '\u00B4',
				acy: '\u0430',
				aelig: '\u00E6',
				af: '\u2061',
				afr: '\uD835\uDD1E',
				agrave: '\u00E0',
				alefsym: '\u2135',
				aleph: '\u2135',
				alpha: '\u03B1',
				amacr: '\u0101',
				amalg: '\u2A3F',
				amp: '\u0026',
				and: '\u2227',
				andand: '\u2A55',
				andd: '\u2A5C',
				andslope: '\u2A58',
				andv: '\u2A5A',
				ang: '\u2220',
				ange: '\u29A4',
				angle: '\u2220',
				angmsd: '\u2221',
				angmsdaa: '\u29A8',
				angmsdab: '\u29A9',
				angmsdac: '\u29AA',
				angmsdad: '\u29AB',
				angmsdae: '\u29AC',
				angmsdaf: '\u29AD',
				angmsdag: '\u29AE',
				angmsdah: '\u29AF',
				angrt: '\u221F',
				angrtvb: '\u22BE',
				angrtvbd: '\u299D',
				angsph: '\u2222',
				angst: '\u00C5',
				angzarr: '\u237C',
				aogon: '\u0105',
				aopf: '\uD835\uDD52',
				ap: '\u2248',
				apE: '\u2A70',
				apacir: '\u2A6F',
				ape: '\u224A',
				apid: '\u224B',
				apos: '\u0027',
				approx: '\u2248',
				approxeq: '\u224A',
				aring: '\u00E5',
				ascr: '\uD835\uDCB6',
				ast: '\u002A',
				asymp: '\u2248',
				asympeq: '\u224D',
				atilde: '\u00E3',
				auml: '\u00E4',
				awconint: '\u2233',
				awint: '\u2A11',
				bNot: '\u2AED',
				backcong: '\u224C',
				backepsilon: '\u03F6',
				backprime: '\u2035',
				backsim: '\u223D',
				backsimeq: '\u22CD',
				barvee: '\u22BD',
				barwed: '\u2305',
				barwedge: '\u2305',
				bbrk: '\u23B5',
				bbrktbrk: '\u23B6',
				bcong: '\u224C',
				bcy: '\u0431',
				bdquo: '\u201E',
				becaus: '\u2235',
				because: '\u2235',
				bemptyv: '\u29B0',
				bepsi: '\u03F6',
				bernou: '\u212C',
				beta: '\u03B2',
				beth: '\u2136',
				between: '\u226C',
				bfr: '\uD835\uDD1F',
				bigcap: '\u22C2',
				bigcirc: '\u25EF',
				bigcup: '\u22C3',
				bigodot: '\u2A00',
				bigoplus: '\u2A01',
				bigotimes: '\u2A02',
				bigsqcup: '\u2A06',
				bigstar: '\u2605',
				bigtriangledown: '\u25BD',
				bigtriangleup: '\u25B3',
				biguplus: '\u2A04',
				bigvee: '\u22C1',
				bigwedge: '\u22C0',
				bkarow: '\u290D',
				blacklozenge: '\u29EB',
				blacksquare: '\u25AA',
				blacktriangle: '\u25B4',
				blacktriangledown: '\u25BE',
				blacktriangleleft: '\u25C2',
				blacktriangleright: '\u25B8',
				blank: '\u2423',
				blk12: '\u2592',
				blk14: '\u2591',
				blk34: '\u2593',
				block: '\u2588',
				bne: '\u003D\u20E5',
				bnequiv: '\u2261\u20E5',
				bnot: '\u2310',
				bopf: '\uD835\uDD53',
				bot: '\u22A5',
				bottom: '\u22A5',
				bowtie: '\u22C8',
				boxDL: '\u2557',
				boxDR: '\u2554',
				boxDl: '\u2556',
				boxDr: '\u2553',
				boxH: '\u2550',
				boxHD: '\u2566',
				boxHU: '\u2569',
				boxHd: '\u2564',
				boxHu: '\u2567',
				boxUL: '\u255D',
				boxUR: '\u255A',
				boxUl: '\u255C',
				boxUr: '\u2559',
				boxV: '\u2551',
				boxVH: '\u256C',
				boxVL: '\u2563',
				boxVR: '\u2560',
				boxVh: '\u256B',
				boxVl: '\u2562',
				boxVr: '\u255F',
				boxbox: '\u29C9',
				boxdL: '\u2555',
				boxdR: '\u2552',
				boxdl: '\u2510',
				boxdr: '\u250C',
				boxh: '\u2500',
				boxhD: '\u2565',
				boxhU: '\u2568',
				boxhd: '\u252C',
				boxhu: '\u2534',
				boxminus: '\u229F',
				boxplus: '\u229E',
				boxtimes: '\u22A0',
				boxuL: '\u255B',
				boxuR: '\u2558',
				boxul: '\u2518',
				boxur: '\u2514',
				boxv: '\u2502',
				boxvH: '\u256A',
				boxvL: '\u2561',
				boxvR: '\u255E',
				boxvh: '\u253C',
				boxvl: '\u2524',
				boxvr: '\u251C',
				bprime: '\u2035',
				breve: '\u02D8',
				brvbar: '\u00A6',
				bscr: '\uD835\uDCB7',
				bsemi: '\u204F',
				bsim: '\u223D',
				bsime: '\u22CD',
				bsol: '\u005C',
				bsolb: '\u29C5',
				bsolhsub: '\u27C8',
				bull: '\u2022',
				bullet: '\u2022',
				bump: '\u224E',
				bumpE: '\u2AAE',
				bumpe: '\u224F',
				bumpeq: '\u224F',
				cacute: '\u0107',
				cap: '\u2229',
				capand: '\u2A44',
				capbrcup: '\u2A49',
				capcap: '\u2A4B',
				capcup: '\u2A47',
				capdot: '\u2A40',
				caps: '\u2229\uFE00',
				caret: '\u2041',
				caron: '\u02C7',
				ccaps: '\u2A4D',
				ccaron: '\u010D',
				ccedil: '\u00E7',
				ccirc: '\u0109',
				ccups: '\u2A4C',
				ccupssm: '\u2A50',
				cdot: '\u010B',
				cedil: '\u00B8',
				cemptyv: '\u29B2',
				cent: '\u00A2',
				centerdot: '\u00B7',
				cfr: '\uD835\uDD20',
				chcy: '\u0447',
				check: '\u2713',
				checkmark: '\u2713',
				chi: '\u03C7',
				cir: '\u25CB',
				cirE: '\u29C3',
				circ: '\u02C6',
				circeq: '\u2257',
				circlearrowleft: '\u21BA',
				circlearrowright: '\u21BB',
				circledR: '\u00AE',
				circledS: '\u24C8',
				circledast: '\u229B',
				circledcirc: '\u229A',
				circleddash: '\u229D',
				cire: '\u2257',
				cirfnint: '\u2A10',
				cirmid: '\u2AEF',
				cirscir: '\u29C2',
				clubs: '\u2663',
				clubsuit: '\u2663',
				colon: '\u003A',
				colone: '\u2254',
				coloneq: '\u2254',
				comma: '\u002C',
				commat: '\u0040',
				comp: '\u2201',
				compfn: '\u2218',
				complement: '\u2201',
				complexes: '\u2102',
				cong: '\u2245',
				congdot: '\u2A6D',
				conint: '\u222E',
				copf: '\uD835\uDD54',
				coprod: '\u2210',
				copy: '\u00A9',
				copysr: '\u2117',
				crarr: '\u21B5',
				cross: '\u2717',
				cscr: '\uD835\uDCB8',
				csub: '\u2ACF',
				csube: '\u2AD1',
				csup: '\u2AD0',
				csupe: '\u2AD2',
				ctdot: '\u22EF',
				cudarrl: '\u2938',
				cudarrr: '\u2935',
				cuepr: '\u22DE',
				cuesc: '\u22DF',
				cularr: '\u21B6',
				cularrp: '\u293D',
				cup: '\u222A',
				cupbrcap: '\u2A48',
				cupcap: '\u2A46',
				cupcup: '\u2A4A',
				cupdot: '\u228D',
				cupor: '\u2A45',
				cups: '\u222A\uFE00',
				curarr: '\u21B7',
				curarrm: '\u293C',
				curlyeqprec: '\u22DE',
				curlyeqsucc: '\u22DF',
				curlyvee: '\u22CE',
				curlywedge: '\u22CF',
				curren: '\u00A4',
				curvearrowleft: '\u21B6',
				curvearrowright: '\u21B7',
				cuvee: '\u22CE',
				cuwed: '\u22CF',
				cwconint: '\u2232',
				cwint: '\u2231',
				cylcty: '\u232D',
				dArr: '\u21D3',
				dHar: '\u2965',
				dagger: '\u2020',
				daleth: '\u2138',
				darr: '\u2193',
				dash: '\u2010',
				dashv: '\u22A3',
				dbkarow: '\u290F',
				dblac: '\u02DD',
				dcaron: '\u010F',
				dcy: '\u0434',
				dd: '\u2146',
				ddagger: '\u2021',
				ddarr: '\u21CA',
				ddotseq: '\u2A77',
				deg: '\u00B0',
				delta: '\u03B4',
				demptyv: '\u29B1',
				dfisht: '\u297F',
				dfr: '\uD835\uDD21',
				dharl: '\u21C3',
				dharr: '\u21C2',
				diam: '\u22C4',
				diamond: '\u22C4',
				diamondsuit: '\u2666',
				diams: '\u2666',
				die: '\u00A8',
				digamma: '\u03DD',
				disin: '\u22F2',
				div: '\u00F7',
				divide: '\u00F7',
				divideontimes: '\u22C7',
				divonx: '\u22C7',
				djcy: '\u0452',
				dlcorn: '\u231E',
				dlcrop: '\u230D',
				dollar: '\u0024',
				dopf: '\uD835\uDD55',
				dot: '\u02D9',
				doteq: '\u2250',
				doteqdot: '\u2251',
				dotminus: '\u2238',
				dotplus: '\u2214',
				dotsquare: '\u22A1',
				doublebarwedge: '\u2306',
				downarrow: '\u2193',
				downdownarrows: '\u21CA',
				downharpoonleft: '\u21C3',
				downharpoonright: '\u21C2',
				drbkarow: '\u2910',
				drcorn: '\u231F',
				drcrop: '\u230C',
				dscr: '\uD835\uDCB9',
				dscy: '\u0455',
				dsol: '\u29F6',
				dstrok: '\u0111',
				dtdot: '\u22F1',
				dtri: '\u25BF',
				dtrif: '\u25BE',
				duarr: '\u21F5',
				duhar: '\u296F',
				dwangle: '\u29A6',
				dzcy: '\u045F',
				dzigrarr: '\u27FF',
				eDDot: '\u2A77',
				eDot: '\u2251',
				eacute: '\u00E9',
				easter: '\u2A6E',
				ecaron: '\u011B',
				ecir: '\u2256',
				ecirc: '\u00EA',
				ecolon: '\u2255',
				ecy: '\u044D',
				edot: '\u0117',
				ee: '\u2147',
				efDot: '\u2252',
				efr: '\uD835\uDD22',
				eg: '\u2A9A',
				egrave: '\u00E8',
				egs: '\u2A96',
				egsdot: '\u2A98',
				el: '\u2A99',
				elinters: '\u23E7',
				ell: '\u2113',
				els: '\u2A95',
				elsdot: '\u2A97',
				emacr: '\u0113',
				empty: '\u2205',
				emptyset: '\u2205',
				emptyv: '\u2205',
				emsp13: '\u2004',
				emsp14: '\u2005',
				emsp: '\u2003',
				eng: '\u014B',
				ensp: '\u2002',
				eogon: '\u0119',
				eopf: '\uD835\uDD56',
				epar: '\u22D5',
				eparsl: '\u29E3',
				eplus: '\u2A71',
				epsi: '\u03B5',
				epsilon: '\u03B5',
				epsiv: '\u03F5',
				eqcirc: '\u2256',
				eqcolon: '\u2255',
				eqsim: '\u2242',
				eqslantgtr: '\u2A96',
				eqslantless: '\u2A95',
				equals: '\u003D',
				equest: '\u225F',
				equiv: '\u2261',
				equivDD: '\u2A78',
				eqvparsl: '\u29E5',
				erDot: '\u2253',
				erarr: '\u2971',
				escr: '\u212F',
				esdot: '\u2250',
				esim: '\u2242',
				eta: '\u03B7',
				eth: '\u00F0',
				euml: '\u00EB',
				euro: '\u20AC',
				excl: '\u0021',
				exist: '\u2203',
				expectation: '\u2130',
				exponentiale: '\u2147',
				fallingdotseq: '\u2252',
				fcy: '\u0444',
				female: '\u2640',
				ffilig: '\uFB03',
				fflig: '\uFB00',
				ffllig: '\uFB04',
				ffr: '\uD835\uDD23',
				filig: '\uFB01',
				fjlig: '\u0066\u006A',
				flat: '\u266D',
				fllig: '\uFB02',
				fltns: '\u25B1',
				fnof: '\u0192',
				fopf: '\uD835\uDD57',
				forall: '\u2200',
				fork: '\u22D4',
				forkv: '\u2AD9',
				fpartint: '\u2A0D',
				frac12: '\u00BD',
				frac13: '\u2153',
				frac14: '\u00BC',
				frac15: '\u2155',
				frac16: '\u2159',
				frac18: '\u215B',
				frac23: '\u2154',
				frac25: '\u2156',
				frac34: '\u00BE',
				frac35: '\u2157',
				frac38: '\u215C',
				frac45: '\u2158',
				frac56: '\u215A',
				frac58: '\u215D',
				frac78: '\u215E',
				frasl: '\u2044',
				frown: '\u2322',
				fscr: '\uD835\uDCBB',
				gE: '\u2267',
				gEl: '\u2A8C',
				gacute: '\u01F5',
				gamma: '\u03B3',
				gammad: '\u03DD',
				gap: '\u2A86',
				gbreve: '\u011F',
				gcirc: '\u011D',
				gcy: '\u0433',
				gdot: '\u0121',
				ge: '\u2265',
				gel: '\u22DB',
				geq: '\u2265',
				geqq: '\u2267',
				geqslant: '\u2A7E',
				ges: '\u2A7E',
				gescc: '\u2AA9',
				gesdot: '\u2A80',
				gesdoto: '\u2A82',
				gesdotol: '\u2A84',
				gesl: '\u22DB\uFE00',
				gesles: '\u2A94',
				gfr: '\uD835\uDD24',
				gg: '\u226B',
				ggg: '\u22D9',
				gimel: '\u2137',
				gjcy: '\u0453',
				gl: '\u2277',
				glE: '\u2A92',
				gla: '\u2AA5',
				glj: '\u2AA4',
				gnE: '\u2269',
				gnap: '\u2A8A',
				gnapprox: '\u2A8A',
				gne: '\u2A88',
				gneq: '\u2A88',
				gneqq: '\u2269',
				gnsim: '\u22E7',
				gopf: '\uD835\uDD58',
				grave: '\u0060',
				gscr: '\u210A',
				gsim: '\u2273',
				gsime: '\u2A8E',
				gsiml: '\u2A90',
				gt: '\u003E',
				gtcc: '\u2AA7',
				gtcir: '\u2A7A',
				gtdot: '\u22D7',
				gtlPar: '\u2995',
				gtquest: '\u2A7C',
				gtrapprox: '\u2A86',
				gtrarr: '\u2978',
				gtrdot: '\u22D7',
				gtreqless: '\u22DB',
				gtreqqless: '\u2A8C',
				gtrless: '\u2277',
				gtrsim: '\u2273',
				gvertneqq: '\u2269\uFE00',
				gvnE: '\u2269\uFE00',
				hArr: '\u21D4',
				hairsp: '\u200A',
				half: '\u00BD',
				hamilt: '\u210B',
				hardcy: '\u044A',
				harr: '\u2194',
				harrcir: '\u2948',
				harrw: '\u21AD',
				hbar: '\u210F',
				hcirc: '\u0125',
				hearts: '\u2665',
				heartsuit: '\u2665',
				hellip: '\u2026',
				hercon: '\u22B9',
				hfr: '\uD835\uDD25',
				hksearow: '\u2925',
				hkswarow: '\u2926',
				hoarr: '\u21FF',
				homtht: '\u223B',
				hookleftarrow: '\u21A9',
				hookrightarrow: '\u21AA',
				hopf: '\uD835\uDD59',
				horbar: '\u2015',
				hscr: '\uD835\uDCBD',
				hslash: '\u210F',
				hstrok: '\u0127',
				hybull: '\u2043',
				hyphen: '\u2010',
				iacute: '\u00ED',
				ic: '\u2063',
				icirc: '\u00EE',
				icy: '\u0438',
				iecy: '\u0435',
				iexcl: '\u00A1',
				iff: '\u21D4',
				ifr: '\uD835\uDD26',
				igrave: '\u00EC',
				ii: '\u2148',
				iiiint: '\u2A0C',
				iiint: '\u222D',
				iinfin: '\u29DC',
				iiota: '\u2129',
				ijlig: '\u0133',
				imacr: '\u012B',
				image: '\u2111',
				imagline: '\u2110',
				imagpart: '\u2111',
				imath: '\u0131',
				imof: '\u22B7',
				imped: '\u01B5',
				in: '\u2208',
				incare: '\u2105',
				infin: '\u221E',
				infintie: '\u29DD',
				inodot: '\u0131',
				int: '\u222B',
				intcal: '\u22BA',
				integers: '\u2124',
				intercal: '\u22BA',
				intlarhk: '\u2A17',
				intprod: '\u2A3C',
				iocy: '\u0451',
				iogon: '\u012F',
				iopf: '\uD835\uDD5A',
				iota: '\u03B9',
				iprod: '\u2A3C',
				iquest: '\u00BF',
				iscr: '\uD835\uDCBE',
				isin: '\u2208',
				isinE: '\u22F9',
				isindot: '\u22F5',
				isins: '\u22F4',
				isinsv: '\u22F3',
				isinv: '\u2208',
				it: '\u2062',
				itilde: '\u0129',
				iukcy: '\u0456',
				iuml: '\u00EF',
				jcirc: '\u0135',
				jcy: '\u0439',
				jfr: '\uD835\uDD27',
				jmath: '\u0237',
				jopf: '\uD835\uDD5B',
				jscr: '\uD835\uDCBF',
				jsercy: '\u0458',
				jukcy: '\u0454',
				kappa: '\u03BA',
				kappav: '\u03F0',
				kcedil: '\u0137',
				kcy: '\u043A',
				kfr: '\uD835\uDD28',
				kgreen: '\u0138',
				khcy: '\u0445',
				kjcy: '\u045C',
				kopf: '\uD835\uDD5C',
				kscr: '\uD835\uDCC0',
				lAarr: '\u21DA',
				lArr: '\u21D0',
				lAtail: '\u291B',
				lBarr: '\u290E',
				lE: '\u2266',
				lEg: '\u2A8B',
				lHar: '\u2962',
				lacute: '\u013A',
				laemptyv: '\u29B4',
				lagran: '\u2112',
				lambda: '\u03BB',
				lang: '\u27E8',
				langd: '\u2991',
				langle: '\u27E8',
				lap: '\u2A85',
				laquo: '\u00AB',
				larr: '\u2190',
				larrb: '\u21E4',
				larrbfs: '\u291F',
				larrfs: '\u291D',
				larrhk: '\u21A9',
				larrlp: '\u21AB',
				larrpl: '\u2939',
				larrsim: '\u2973',
				larrtl: '\u21A2',
				lat: '\u2AAB',
				latail: '\u2919',
				late: '\u2AAD',
				lates: '\u2AAD\uFE00',
				lbarr: '\u290C',
				lbbrk: '\u2772',
				lbrace: '\u007B',
				lbrack: '\u005B',
				lbrke: '\u298B',
				lbrksld: '\u298F',
				lbrkslu: '\u298D',
				lcaron: '\u013E',
				lcedil: '\u013C',
				lceil: '\u2308',
				lcub: '\u007B',
				lcy: '\u043B',
				ldca: '\u2936',
				ldquo: '\u201C',
				ldquor: '\u201E',
				ldrdhar: '\u2967',
				ldrushar: '\u294B',
				ldsh: '\u21B2',
				le: '\u2264',
				leftarrow: '\u2190',
				leftarrowtail: '\u21A2',
				leftharpoondown: '\u21BD',
				leftharpoonup: '\u21BC',
				leftleftarrows: '\u21C7',
				leftrightarrow: '\u2194',
				leftrightarrows: '\u21C6',
				leftrightharpoons: '\u21CB',
				leftrightsquigarrow: '\u21AD',
				leftthreetimes: '\u22CB',
				leg: '\u22DA',
				leq: '\u2264',
				leqq: '\u2266',
				leqslant: '\u2A7D',
				les: '\u2A7D',
				lescc: '\u2AA8',
				lesdot: '\u2A7F',
				lesdoto: '\u2A81',
				lesdotor: '\u2A83',
				lesg: '\u22DA\uFE00',
				lesges: '\u2A93',
				lessapprox: '\u2A85',
				lessdot: '\u22D6',
				lesseqgtr: '\u22DA',
				lesseqqgtr: '\u2A8B',
				lessgtr: '\u2276',
				lesssim: '\u2272',
				lfisht: '\u297C',
				lfloor: '\u230A',
				lfr: '\uD835\uDD29',
				lg: '\u2276',
				lgE: '\u2A91',
				lhard: '\u21BD',
				lharu: '\u21BC',
				lharul: '\u296A',
				lhblk: '\u2584',
				ljcy: '\u0459',
				ll: '\u226A',
				llarr: '\u21C7',
				llcorner: '\u231E',
				llhard: '\u296B',
				lltri: '\u25FA',
				lmidot: '\u0140',
				lmoust: '\u23B0',
				lmoustache: '\u23B0',
				lnE: '\u2268',
				lnap: '\u2A89',
				lnapprox: '\u2A89',
				lne: '\u2A87',
				lneq: '\u2A87',
				lneqq: '\u2268',
				lnsim: '\u22E6',
				loang: '\u27EC',
				loarr: '\u21FD',
				lobrk: '\u27E6',
				longleftarrow: '\u27F5',
				longleftrightarrow: '\u27F7',
				longmapsto: '\u27FC',
				longrightarrow: '\u27F6',
				looparrowleft: '\u21AB',
				looparrowright: '\u21AC',
				lopar: '\u2985',
				lopf: '\uD835\uDD5D',
				loplus: '\u2A2D',
				lotimes: '\u2A34',
				lowast: '\u2217',
				lowbar: '\u005F',
				loz: '\u25CA',
				lozenge: '\u25CA',
				lozf: '\u29EB',
				lpar: '\u0028',
				lparlt: '\u2993',
				lrarr: '\u21C6',
				lrcorner: '\u231F',
				lrhar: '\u21CB',
				lrhard: '\u296D',
				lrm: '\u200E',
				lrtri: '\u22BF',
				lsaquo: '\u2039',
				lscr: '\uD835\uDCC1',
				lsh: '\u21B0',
				lsim: '\u2272',
				lsime: '\u2A8D',
				lsimg: '\u2A8F',
				lsqb: '\u005B',
				lsquo: '\u2018',
				lsquor: '\u201A',
				lstrok: '\u0142',
				lt: '\u003C',
				ltcc: '\u2AA6',
				ltcir: '\u2A79',
				ltdot: '\u22D6',
				lthree: '\u22CB',
				ltimes: '\u22C9',
				ltlarr: '\u2976',
				ltquest: '\u2A7B',
				ltrPar: '\u2996',
				ltri: '\u25C3',
				ltrie: '\u22B4',
				ltrif: '\u25C2',
				lurdshar: '\u294A',
				luruhar: '\u2966',
				lvertneqq: '\u2268\uFE00',
				lvnE: '\u2268\uFE00',
				mDDot: '\u223A',
				macr: '\u00AF',
				male: '\u2642',
				malt: '\u2720',
				maltese: '\u2720',
				map: '\u21A6',
				mapsto: '\u21A6',
				mapstodown: '\u21A7',
				mapstoleft: '\u21A4',
				mapstoup: '\u21A5',
				marker: '\u25AE',
				mcomma: '\u2A29',
				mcy: '\u043C',
				mdash: '\u2014',
				measuredangle: '\u2221',
				mfr: '\uD835\uDD2A',
				mho: '\u2127',
				micro: '\u00B5',
				mid: '\u2223',
				midast: '\u002A',
				midcir: '\u2AF0',
				middot: '\u00B7',
				minus: '\u2212',
				minusb: '\u229F',
				minusd: '\u2238',
				minusdu: '\u2A2A',
				mlcp: '\u2ADB',
				mldr: '\u2026',
				mnplus: '\u2213',
				models: '\u22A7',
				mopf: '\uD835\uDD5E',
				mp: '\u2213',
				mscr: '\uD835\uDCC2',
				mstpos: '\u223E',
				mu: '\u03BC',
				multimap: '\u22B8',
				mumap: '\u22B8',
				nGg: '\u22D9\u0338',
				nGt: '\u226B\u20D2',
				nGtv: '\u226B\u0338',
				nLeftarrow: '\u21CD',
				nLeftrightarrow: '\u21CE',
				nLl: '\u22D8\u0338',
				nLt: '\u226A\u20D2',
				nLtv: '\u226A\u0338',
				nRightarrow: '\u21CF',
				nVDash: '\u22AF',
				nVdash: '\u22AE',
				nabla: '\u2207',
				nacute: '\u0144',
				nang: '\u2220\u20D2',
				nap: '\u2249',
				napE: '\u2A70\u0338',
				napid: '\u224B\u0338',
				napos: '\u0149',
				napprox: '\u2249',
				natur: '\u266E',
				natural: '\u266E',
				naturals: '\u2115',
				nbsp: '\u00A0',
				nbump: '\u224E\u0338',
				nbumpe: '\u224F\u0338',
				ncap: '\u2A43',
				ncaron: '\u0148',
				ncedil: '\u0146',
				ncong: '\u2247',
				ncongdot: '\u2A6D\u0338',
				ncup: '\u2A42',
				ncy: '\u043D',
				ndash: '\u2013',
				ne: '\u2260',
				neArr: '\u21D7',
				nearhk: '\u2924',
				nearr: '\u2197',
				nearrow: '\u2197',
				nedot: '\u2250\u0338',
				nequiv: '\u2262',
				nesear: '\u2928',
				nesim: '\u2242\u0338',
				nexist: '\u2204',
				nexists: '\u2204',
				nfr: '\uD835\uDD2B',
				ngE: '\u2267\u0338',
				nge: '\u2271',
				ngeq: '\u2271',
				ngeqq: '\u2267\u0338',
				ngeqslant: '\u2A7E\u0338',
				nges: '\u2A7E\u0338',
				ngsim: '\u2275',
				ngt: '\u226F',
				ngtr: '\u226F',
				nhArr: '\u21CE',
				nharr: '\u21AE',
				nhpar: '\u2AF2',
				ni: '\u220B',
				nis: '\u22FC',
				nisd: '\u22FA',
				niv: '\u220B',
				njcy: '\u045A',
				nlArr: '\u21CD',
				nlE: '\u2266\u0338',
				nlarr: '\u219A',
				nldr: '\u2025',
				nle: '\u2270',
				nleftarrow: '\u219A',
				nleftrightarrow: '\u21AE',
				nleq: '\u2270',
				nleqq: '\u2266\u0338',
				nleqslant: '\u2A7D\u0338',
				nles: '\u2A7D\u0338',
				nless: '\u226E',
				nlsim: '\u2274',
				nlt: '\u226E',
				nltri: '\u22EA',
				nltrie: '\u22EC',
				nmid: '\u2224',
				nopf: '\uD835\uDD5F',
				not: '\u00AC',
				notin: '\u2209',
				notinE: '\u22F9\u0338',
				notindot: '\u22F5\u0338',
				notinva: '\u2209',
				notinvb: '\u22F7',
				notinvc: '\u22F6',
				notni: '\u220C',
				notniva: '\u220C',
				notnivb: '\u22FE',
				notnivc: '\u22FD',
				npar: '\u2226',
				nparallel: '\u2226',
				nparsl: '\u2AFD\u20E5',
				npart: '\u2202\u0338',
				npolint: '\u2A14',
				npr: '\u2280',
				nprcue: '\u22E0',
				npre: '\u2AAF\u0338',
				nprec: '\u2280',
				npreceq: '\u2AAF\u0338',
				nrArr: '\u21CF',
				nrarr: '\u219B',
				nrarrc: '\u2933\u0338',
				nrarrw: '\u219D\u0338',
				nrightarrow: '\u219B',
				nrtri: '\u22EB',
				nrtrie: '\u22ED',
				nsc: '\u2281',
				nsccue: '\u22E1',
				nsce: '\u2AB0\u0338',
				nscr: '\uD835\uDCC3',
				nshortmid: '\u2224',
				nshortparallel: '\u2226',
				nsim: '\u2241',
				nsime: '\u2244',
				nsimeq: '\u2244',
				nsmid: '\u2224',
				nspar: '\u2226',
				nsqsube: '\u22E2',
				nsqsupe: '\u22E3',
				nsub: '\u2284',
				nsubE: '\u2AC5\u0338',
				nsube: '\u2288',
				nsubset: '\u2282\u20D2',
				nsubseteq: '\u2288',
				nsubseteqq: '\u2AC5\u0338',
				nsucc: '\u2281',
				nsucceq: '\u2AB0\u0338',
				nsup: '\u2285',
				nsupE: '\u2AC6\u0338',
				nsupe: '\u2289',
				nsupset: '\u2283\u20D2',
				nsupseteq: '\u2289',
				nsupseteqq: '\u2AC6\u0338',
				ntgl: '\u2279',
				ntilde: '\u00F1',
				ntlg: '\u2278',
				ntriangleleft: '\u22EA',
				ntrianglelefteq: '\u22EC',
				ntriangleright: '\u22EB',
				ntrianglerighteq: '\u22ED',
				nu: '\u03BD',
				num: '\u0023',
				numero: '\u2116',
				numsp: '\u2007',
				nvDash: '\u22AD',
				nvHarr: '\u2904',
				nvap: '\u224D\u20D2',
				nvdash: '\u22AC',
				nvge: '\u2265\u20D2',
				nvgt: '\u003E\u20D2',
				nvinfin: '\u29DE',
				nvlArr: '\u2902',
				nvle: '\u2264\u20D2',
				nvlt: '\u003C\u20D2',
				nvltrie: '\u22B4\u20D2',
				nvrArr: '\u2903',
				nvrtrie: '\u22B5\u20D2',
				nvsim: '\u223C\u20D2',
				nwArr: '\u21D6',
				nwarhk: '\u2923',
				nwarr: '\u2196',
				nwarrow: '\u2196',
				nwnear: '\u2927',
				oS: '\u24C8',
				oacute: '\u00F3',
				oast: '\u229B',
				ocir: '\u229A',
				ocirc: '\u00F4',
				ocy: '\u043E',
				odash: '\u229D',
				odblac: '\u0151',
				odiv: '\u2A38',
				odot: '\u2299',
				odsold: '\u29BC',
				oelig: '\u0153',
				ofcir: '\u29BF',
				ofr: '\uD835\uDD2C',
				ogon: '\u02DB',
				ograve: '\u00F2',
				ogt: '\u29C1',
				ohbar: '\u29B5',
				ohm: '\u03A9',
				oint: '\u222E',
				olarr: '\u21BA',
				olcir: '\u29BE',
				olcross: '\u29BB',
				oline: '\u203E',
				olt: '\u29C0',
				omacr: '\u014D',
				omega: '\u03C9',
				omicron: '\u03BF',
				omid: '\u29B6',
				ominus: '\u2296',
				oopf: '\uD835\uDD60',
				opar: '\u29B7',
				operp: '\u29B9',
				oplus: '\u2295',
				or: '\u2228',
				orarr: '\u21BB',
				ord: '\u2A5D',
				order: '\u2134',
				orderof: '\u2134',
				ordf: '\u00AA',
				ordm: '\u00BA',
				origof: '\u22B6',
				oror: '\u2A56',
				orslope: '\u2A57',
				orv: '\u2A5B',
				oscr: '\u2134',
				oslash: '\u00F8',
				osol: '\u2298',
				otilde: '\u00F5',
				otimes: '\u2297',
				otimesas: '\u2A36',
				ouml: '\u00F6',
				ovbar: '\u233D',
				par: '\u2225',
				para: '\u00B6',
				parallel: '\u2225',
				parsim: '\u2AF3',
				parsl: '\u2AFD',
				part: '\u2202',
				pcy: '\u043F',
				percnt: '\u0025',
				period: '\u002E',
				permil: '\u2030',
				perp: '\u22A5',
				pertenk: '\u2031',
				pfr: '\uD835\uDD2D',
				phi: '\u03C6',
				phiv: '\u03D5',
				phmmat: '\u2133',
				phone: '\u260E',
				pi: '\u03C0',
				pitchfork: '\u22D4',
				piv: '\u03D6',
				planck: '\u210F',
				planckh: '\u210E',
				plankv: '\u210F',
				plus: '\u002B',
				plusacir: '\u2A23',
				plusb: '\u229E',
				pluscir: '\u2A22',
				plusdo: '\u2214',
				plusdu: '\u2A25',
				pluse: '\u2A72',
				plusmn: '\u00B1',
				plussim: '\u2A26',
				plustwo: '\u2A27',
				pm: '\u00B1',
				pointint: '\u2A15',
				popf: '\uD835\uDD61',
				pound: '\u00A3',
				pr: '\u227A',
				prE: '\u2AB3',
				prap: '\u2AB7',
				prcue: '\u227C',
				pre: '\u2AAF',
				prec: '\u227A',
				precapprox: '\u2AB7',
				preccurlyeq: '\u227C',
				preceq: '\u2AAF',
				precnapprox: '\u2AB9',
				precneqq: '\u2AB5',
				precnsim: '\u22E8',
				precsim: '\u227E',
				prime: '\u2032',
				primes: '\u2119',
				prnE: '\u2AB5',
				prnap: '\u2AB9',
				prnsim: '\u22E8',
				prod: '\u220F',
				profalar: '\u232E',
				profline: '\u2312',
				profsurf: '\u2313',
				prop: '\u221D',
				propto: '\u221D',
				prsim: '\u227E',
				prurel: '\u22B0',
				pscr: '\uD835\uDCC5',
				psi: '\u03C8',
				puncsp: '\u2008',
				qfr: '\uD835\uDD2E',
				qint: '\u2A0C',
				qopf: '\uD835\uDD62',
				qprime: '\u2057',
				qscr: '\uD835\uDCC6',
				quaternions: '\u210D',
				quatint: '\u2A16',
				quest: '\u003F',
				questeq: '\u225F',
				quot: '\u0022',
				rAarr: '\u21DB',
				rArr: '\u21D2',
				rAtail: '\u291C',
				rBarr: '\u290F',
				rHar: '\u2964',
				race: '\u223D\u0331',
				racute: '\u0155',
				radic: '\u221A',
				raemptyv: '\u29B3',
				rang: '\u27E9',
				rangd: '\u2992',
				range: '\u29A5',
				rangle: '\u27E9',
				raquo: '\u00BB',
				rarr: '\u2192',
				rarrap: '\u2975',
				rarrb: '\u21E5',
				rarrbfs: '\u2920',
				rarrc: '\u2933',
				rarrfs: '\u291E',
				rarrhk: '\u21AA',
				rarrlp: '\u21AC',
				rarrpl: '\u2945',
				rarrsim: '\u2974',
				rarrtl: '\u21A3',
				rarrw: '\u219D',
				ratail: '\u291A',
				ratio: '\u2236',
				rationals: '\u211A',
				rbarr: '\u290D',
				rbbrk: '\u2773',
				rbrace: '\u007D',
				rbrack: '\u005D',
				rbrke: '\u298C',
				rbrksld: '\u298E',
				rbrkslu: '\u2990',
				rcaron: '\u0159',
				rcedil: '\u0157',
				rceil: '\u2309',
				rcub: '\u007D',
				rcy: '\u0440',
				rdca: '\u2937',
				rdldhar: '\u2969',
				rdquo: '\u201D',
				rdquor: '\u201D',
				rdsh: '\u21B3',
				real: '\u211C',
				realine: '\u211B',
				realpart: '\u211C',
				reals: '\u211D',
				rect: '\u25AD',
				reg: '\u00AE',
				rfisht: '\u297D',
				rfloor: '\u230B',
				rfr: '\uD835\uDD2F',
				rhard: '\u21C1',
				rharu: '\u21C0',
				rharul: '\u296C',
				rho: '\u03C1',
				rhov: '\u03F1',
				rightarrow: '\u2192',
				rightarrowtail: '\u21A3',
				rightharpoondown: '\u21C1',
				rightharpoonup: '\u21C0',
				rightleftarrows: '\u21C4',
				rightleftharpoons: '\u21CC',
				rightrightarrows: '\u21C9',
				rightsquigarrow: '\u219D',
				rightthreetimes: '\u22CC',
				ring: '\u02DA',
				risingdotseq: '\u2253',
				rlarr: '\u21C4',
				rlhar: '\u21CC',
				rlm: '\u200F',
				rmoust: '\u23B1',
				rmoustache: '\u23B1',
				rnmid: '\u2AEE',
				roang: '\u27ED',
				roarr: '\u21FE',
				robrk: '\u27E7',
				ropar: '\u2986',
				ropf: '\uD835\uDD63',
				roplus: '\u2A2E',
				rotimes: '\u2A35',
				rpar: '\u0029',
				rpargt: '\u2994',
				rppolint: '\u2A12',
				rrarr: '\u21C9',
				rsaquo: '\u203A',
				rscr: '\uD835\uDCC7',
				rsh: '\u21B1',
				rsqb: '\u005D',
				rsquo: '\u2019',
				rsquor: '\u2019',
				rthree: '\u22CC',
				rtimes: '\u22CA',
				rtri: '\u25B9',
				rtrie: '\u22B5',
				rtrif: '\u25B8',
				rtriltri: '\u29CE',
				ruluhar: '\u2968',
				rx: '\u211E',
				sacute: '\u015B',
				sbquo: '\u201A',
				sc: '\u227B',
				scE: '\u2AB4',
				scap: '\u2AB8',
				scaron: '\u0161',
				sccue: '\u227D',
				sce: '\u2AB0',
				scedil: '\u015F',
				scirc: '\u015D',
				scnE: '\u2AB6',
				scnap: '\u2ABA',
				scnsim: '\u22E9',
				scpolint: '\u2A13',
				scsim: '\u227F',
				scy: '\u0441',
				sdot: '\u22C5',
				sdotb: '\u22A1',
				sdote: '\u2A66',
				seArr: '\u21D8',
				searhk: '\u2925',
				searr: '\u2198',
				searrow: '\u2198',
				sect: '\u00A7',
				semi: '\u003B',
				seswar: '\u2929',
				setminus: '\u2216',
				setmn: '\u2216',
				sext: '\u2736',
				sfr: '\uD835\uDD30',
				sfrown: '\u2322',
				sharp: '\u266F',
				shchcy: '\u0449',
				shcy: '\u0448',
				shortmid: '\u2223',
				shortparallel: '\u2225',
				shy: '\u00AD',
				sigma: '\u03C3',
				sigmaf: '\u03C2',
				sigmav: '\u03C2',
				sim: '\u223C',
				simdot: '\u2A6A',
				sime: '\u2243',
				simeq: '\u2243',
				simg: '\u2A9E',
				simgE: '\u2AA0',
				siml: '\u2A9D',
				simlE: '\u2A9F',
				simne: '\u2246',
				simplus: '\u2A24',
				simrarr: '\u2972',
				slarr: '\u2190',
				smallsetminus: '\u2216',
				smashp: '\u2A33',
				smeparsl: '\u29E4',
				smid: '\u2223',
				smile: '\u2323',
				smt: '\u2AAA',
				smte: '\u2AAC',
				smtes: '\u2AAC\uFE00',
				softcy: '\u044C',
				sol: '\u002F',
				solb: '\u29C4',
				solbar: '\u233F',
				sopf: '\uD835\uDD64',
				spades: '\u2660',
				spadesuit: '\u2660',
				spar: '\u2225',
				sqcap: '\u2293',
				sqcaps: '\u2293\uFE00',
				sqcup: '\u2294',
				sqcups: '\u2294\uFE00',
				sqsub: '\u228F',
				sqsube: '\u2291',
				sqsubset: '\u228F',
				sqsubseteq: '\u2291',
				sqsup: '\u2290',
				sqsupe: '\u2292',
				sqsupset: '\u2290',
				sqsupseteq: '\u2292',
				squ: '\u25A1',
				square: '\u25A1',
				squarf: '\u25AA',
				squf: '\u25AA',
				srarr: '\u2192',
				sscr: '\uD835\uDCC8',
				ssetmn: '\u2216',
				ssmile: '\u2323',
				sstarf: '\u22C6',
				star: '\u2606',
				starf: '\u2605',
				straightepsilon: '\u03F5',
				straightphi: '\u03D5',
				strns: '\u00AF',
				sub: '\u2282',
				subE: '\u2AC5',
				subdot: '\u2ABD',
				sube: '\u2286',
				subedot: '\u2AC3',
				submult: '\u2AC1',
				subnE: '\u2ACB',
				subne: '\u228A',
				subplus: '\u2ABF',
				subrarr: '\u2979',
				subset: '\u2282',
				subseteq: '\u2286',
				subseteqq: '\u2AC5',
				subsetneq: '\u228A',
				subsetneqq: '\u2ACB',
				subsim: '\u2AC7',
				subsub: '\u2AD5',
				subsup: '\u2AD3',
				succ: '\u227B',
				succapprox: '\u2AB8',
				succcurlyeq: '\u227D',
				succeq: '\u2AB0',
				succnapprox: '\u2ABA',
				succneqq: '\u2AB6',
				succnsim: '\u22E9',
				succsim: '\u227F',
				sum: '\u2211',
				sung: '\u266A',
				sup1: '\u00B9',
				sup2: '\u00B2',
				sup3: '\u00B3',
				sup: '\u2283',
				supE: '\u2AC6',
				supdot: '\u2ABE',
				supdsub: '\u2AD8',
				supe: '\u2287',
				supedot: '\u2AC4',
				suphsol: '\u27C9',
				suphsub: '\u2AD7',
				suplarr: '\u297B',
				supmult: '\u2AC2',
				supnE: '\u2ACC',
				supne: '\u228B',
				supplus: '\u2AC0',
				supset: '\u2283',
				supseteq: '\u2287',
				supseteqq: '\u2AC6',
				supsetneq: '\u228B',
				supsetneqq: '\u2ACC',
				supsim: '\u2AC8',
				supsub: '\u2AD4',
				supsup: '\u2AD6',
				swArr: '\u21D9',
				swarhk: '\u2926',
				swarr: '\u2199',
				swarrow: '\u2199',
				swnwar: '\u292A',
				szlig: '\u00DF',
				target: '\u2316',
				tau: '\u03C4',
				tbrk: '\u23B4',
				tcaron: '\u0165',
				tcedil: '\u0163',
				tcy: '\u0442',
				tdot: '\u20DB',
				telrec: '\u2315',
				tfr: '\uD835\uDD31',
				there4: '\u2234',
				therefore: '\u2234',
				theta: '\u03B8',
				thetasym: '\u03D1',
				thetav: '\u03D1',
				thickapprox: '\u2248',
				thicksim: '\u223C',
				thinsp: '\u2009',
				thkap: '\u2248',
				thksim: '\u223C',
				thorn: '\u00FE',
				tilde: '\u02DC',
				times: '\u00D7',
				timesb: '\u22A0',
				timesbar: '\u2A31',
				timesd: '\u2A30',
				tint: '\u222D',
				toea: '\u2928',
				top: '\u22A4',
				topbot: '\u2336',
				topcir: '\u2AF1',
				topf: '\uD835\uDD65',
				topfork: '\u2ADA',
				tosa: '\u2929',
				tprime: '\u2034',
				trade: '\u2122',
				triangle: '\u25B5',
				triangledown: '\u25BF',
				triangleleft: '\u25C3',
				trianglelefteq: '\u22B4',
				triangleq: '\u225C',
				triangleright: '\u25B9',
				trianglerighteq: '\u22B5',
				tridot: '\u25EC',
				trie: '\u225C',
				triminus: '\u2A3A',
				triplus: '\u2A39',
				trisb: '\u29CD',
				tritime: '\u2A3B',
				trpezium: '\u23E2',
				tscr: '\uD835\uDCC9',
				tscy: '\u0446',
				tshcy: '\u045B',
				tstrok: '\u0167',
				twixt: '\u226C',
				twoheadleftarrow: '\u219E',
				twoheadrightarrow: '\u21A0',
				uArr: '\u21D1',
				uHar: '\u2963',
				uacute: '\u00FA',
				uarr: '\u2191',
				ubrcy: '\u045E',
				ubreve: '\u016D',
				ucirc: '\u00FB',
				ucy: '\u0443',
				udarr: '\u21C5',
				udblac: '\u0171',
				udhar: '\u296E',
				ufisht: '\u297E',
				ufr: '\uD835\uDD32',
				ugrave: '\u00F9',
				uharl: '\u21BF',
				uharr: '\u21BE',
				uhblk: '\u2580',
				ulcorn: '\u231C',
				ulcorner: '\u231C',
				ulcrop: '\u230F',
				ultri: '\u25F8',
				umacr: '\u016B',
				uml: '\u00A8',
				uogon: '\u0173',
				uopf: '\uD835\uDD66',
				uparrow: '\u2191',
				updownarrow: '\u2195',
				upharpoonleft: '\u21BF',
				upharpoonright: '\u21BE',
				uplus: '\u228E',
				upsi: '\u03C5',
				upsih: '\u03D2',
				upsilon: '\u03C5',
				upuparrows: '\u21C8',
				urcorn: '\u231D',
				urcorner: '\u231D',
				urcrop: '\u230E',
				uring: '\u016F',
				urtri: '\u25F9',
				uscr: '\uD835\uDCCA',
				utdot: '\u22F0',
				utilde: '\u0169',
				utri: '\u25B5',
				utrif: '\u25B4',
				uuarr: '\u21C8',
				uuml: '\u00FC',
				uwangle: '\u29A7',
				vArr: '\u21D5',
				vBar: '\u2AE8',
				vBarv: '\u2AE9',
				vDash: '\u22A8',
				vangrt: '\u299C',
				varepsilon: '\u03F5',
				varkappa: '\u03F0',
				varnothing: '\u2205',
				varphi: '\u03D5',
				varpi: '\u03D6',
				varpropto: '\u221D',
				varr: '\u2195',
				varrho: '\u03F1',
				varsigma: '\u03C2',
				varsubsetneq: '\u228A\uFE00',
				varsubsetneqq: '\u2ACB\uFE00',
				varsupsetneq: '\u228B\uFE00',
				varsupsetneqq: '\u2ACC\uFE00',
				vartheta: '\u03D1',
				vartriangleleft: '\u22B2',
				vartriangleright: '\u22B3',
				vcy: '\u0432',
				vdash: '\u22A2',
				vee: '\u2228',
				veebar: '\u22BB',
				veeeq: '\u225A',
				vellip: '\u22EE',
				verbar: '\u007C',
				vert: '\u007C',
				vfr: '\uD835\uDD33',
				vltri: '\u22B2',
				vnsub: '\u2282\u20D2',
				vnsup: '\u2283\u20D2',
				vopf: '\uD835\uDD67',
				vprop: '\u221D',
				vrtri: '\u22B3',
				vscr: '\uD835\uDCCB',
				vsubnE: '\u2ACB\uFE00',
				vsubne: '\u228A\uFE00',
				vsupnE: '\u2ACC\uFE00',
				vsupne: '\u228B\uFE00',
				vzigzag: '\u299A',
				wcirc: '\u0175',
				wedbar: '\u2A5F',
				wedge: '\u2227',
				wedgeq: '\u2259',
				weierp: '\u2118',
				wfr: '\uD835\uDD34',
				wopf: '\uD835\uDD68',
				wp: '\u2118',
				wr: '\u2240',
				wreath: '\u2240',
				wscr: '\uD835\uDCCC',
				xcap: '\u22C2',
				xcirc: '\u25EF',
				xcup: '\u22C3',
				xdtri: '\u25BD',
				xfr: '\uD835\uDD35',
				xhArr: '\u27FA',
				xharr: '\u27F7',
				xi: '\u03BE',
				xlArr: '\u27F8',
				xlarr: '\u27F5',
				xmap: '\u27FC',
				xnis: '\u22FB',
				xodot: '\u2A00',
				xopf: '\uD835\uDD69',
				xoplus: '\u2A01',
				xotime: '\u2A02',
				xrArr: '\u27F9',
				xrarr: '\u27F6',
				xscr: '\uD835\uDCCD',
				xsqcup: '\u2A06',
				xuplus: '\u2A04',
				xutri: '\u25B3',
				xvee: '\u22C1',
				xwedge: '\u22C0',
				yacute: '\u00FD',
				yacy: '\u044F',
				ycirc: '\u0177',
				ycy: '\u044B',
				yen: '\u00A5',
				yfr: '\uD835\uDD36',
				yicy: '\u0457',
				yopf: '\uD835\uDD6A',
				yscr: '\uD835\uDCCE',
				yucy: '\u044E',
				yuml: '\u00FF',
				zacute: '\u017A',
				zcaron: '\u017E',
				zcy: '\u0437',
				zdot: '\u017C',
				zeetrf: '\u2128',
				zeta: '\u03B6',
				zfr: '\uD835\uDD37',
				zhcy: '\u0436',
				zigrarr: '\u21DD',
				zopf: '\uD835\uDD6B',
				zscr: '\uD835\uDCCF',
				zwj: '\u200D',
				zwnj: '\u200C'
			};
			const decodeMap = {
				0: 65533,
				128: 8364,
				130: 8218,
				131: 402,
				132: 8222,
				133: 8230,
				134: 8224,
				135: 8225,
				136: 710,
				137: 8240,
				138: 352,
				139: 8249,
				140: 338,
				142: 381,
				145: 8216,
				146: 8217,
				147: 8220,
				148: 8221,
				149: 8226,
				150: 8211,
				151: 8212,
				152: 732,
				153: 8482,
				154: 353,
				155: 8250,
				156: 339,
				158: 382,
				159: 376
			};
			function decodeHTMLStrict(text) {
				return text.replace(
					/&(?:[a-zA-Z]+|#[xX][\da-fA-F]+|#\d+);/g,
					key => {
						if (key.charAt(1) === '#') {
							const secondChar = key.charAt(2);
							const codePoint =
								secondChar === 'X' || secondChar === 'x'
									? parseInt(key.slice(3), 16)
									: parseInt(key.slice(2), 10);
							return decodeCodePoint(codePoint);
						}
						return entities[key.slice(1, -1)] || key;
					}
				);
			}
			function decodeCodePoint(codePoint) {
				if (
					(codePoint >= 0xd800 && codePoint <= 0xdfff) ||
					codePoint > 0x10ffff
				) {
					return '\uFFFD';
				}
				if (codePoint in decodeMap) {
					codePoint = decodeMap[codePoint];
				}
				return String.fromCodePoint(codePoint);
			}

			function scanJSXAttributeValue(parser, context) {
				parser.startPos = parser.tokenPos = parser.index;
				parser.startColumn = parser.colPos = parser.column;
				parser.startLine = parser.linePos = parser.line;
				parser.token =
					CharTypes[parser.currentChar] & 8192
						? scanJSXString(parser, context)
						: scanSingleToken(parser, context, 0);
				return parser.token;
			}
			function scanJSXString(parser, context) {
				const quote = parser.currentChar;
				let char = advanceChar(parser);
				const start = parser.index;
				while (char !== quote) {
					if (parser.index >= parser.end) report(parser, 14);
					char = advanceChar(parser);
				}
				if (char !== quote) report(parser, 14);
				parser.tokenValue = parser.source.slice(start, parser.index);
				advanceChar(parser);
				if (context & 512)
					parser.tokenRaw = parser.source.slice(
						parser.tokenPos,
						parser.index
					);
				return 134283267;
			}
			function scanJSXToken(parser, context) {
				parser.startPos = parser.tokenPos = parser.index;
				parser.startColumn = parser.colPos = parser.column;
				parser.startLine = parser.linePos = parser.line;
				if (parser.index >= parser.end) return (parser.token = 1048576);
				const token =
					TokenLookup[parser.source.charCodeAt(parser.index)];
				switch (token) {
					case 8456258: {
						advanceChar(parser);
						if (parser.currentChar === 47) {
							advanceChar(parser);
							parser.token = 25;
						} else {
							parser.token = 8456258;
						}
						break;
					}
					case 2162700: {
						advanceChar(parser);
						parser.token = 2162700;
						break;
					}
					default: {
						let state = 0;
						while (parser.index < parser.end) {
							const type =
								CharTypes[
									parser.source.charCodeAt(parser.index)
								];
							if (type & 1024) {
								state |= 1 | 4;
								scanNewLine(parser);
							} else if (type & 2048) {
								consumeLineFeed(parser, state);
								state = (state & ~4) | 1;
							} else {
								advanceChar(parser);
							}
							if (CharTypes[parser.currentChar] & 16384) break;
						}
						const raw = parser.source.slice(
							parser.tokenPos,
							parser.index
						);
						if (context & 512) parser.tokenRaw = raw;
						parser.tokenValue = decodeHTMLStrict(raw);
						parser.token = 138;
					}
				}
				return parser.token;
			}
			function scanJSXIdentifier(parser) {
				if ((parser.token & 143360) === 143360) {
					const { index } = parser;
					let char = parser.currentChar;
					while (CharTypes[char] & (32768 | 2)) {
						char = advanceChar(parser);
					}
					parser.tokenValue += parser.source.slice(
						index,
						parser.index
					);
				}
				parser.token = 208897;
				return parser.token;
			}

			function matchOrInsertSemicolon(parser, context) {
				if (
					(parser.flags & 1) === 0 &&
					(parser.token & 1048576) !== 1048576
				) {
					report(parser, 28, KeywordDescTable[parser.token & 255]);
				}
				if (!consumeOpt(parser, context, 1074790417)) {
					parser.onInsertedSemicolon?.(parser.startPos);
				}
			}
			function isValidStrictMode(parser, index, tokenPos, tokenValue) {
				if (index - tokenPos < 13 && tokenValue === 'use strict') {
					if (
						(parser.token & 1048576) === 1048576 ||
						parser.flags & 1
					) {
						return 1;
					}
				}
				return 0;
			}
			function optionalBit(parser, context, t) {
				if (parser.token !== t) return 0;
				nextToken(parser, context);
				return 1;
			}
			function consumeOpt(parser, context, t) {
				if (parser.token !== t) return false;
				nextToken(parser, context);
				return true;
			}
			function consume(parser, context, t) {
				if (parser.token !== t)
					report(parser, 23, KeywordDescTable[t & 255]);
				nextToken(parser, context);
			}
			function reinterpretToPattern(state, node) {
				switch (node.type) {
					case 'ArrayExpression':
						node.type = 'ArrayPattern';
						const elements = node.elements;
						for (let i = 0, n = elements.length; i < n; ++i) {
							const element = elements[i];
							if (element) reinterpretToPattern(state, element);
						}
						return;
					case 'ObjectExpression':
						node.type = 'ObjectPattern';
						const properties = node.properties;
						for (let i = 0, n = properties.length; i < n; ++i) {
							reinterpretToPattern(state, properties[i]);
						}
						return;
					case 'AssignmentExpression':
						node.type = 'AssignmentPattern';
						if (node.operator !== '=') report(state, 69);
						delete node.operator;
						reinterpretToPattern(state, node.left);
						return;
					case 'Property':
						reinterpretToPattern(state, node.value);
						return;
					case 'SpreadElement':
						node.type = 'RestElement';
						reinterpretToPattern(state, node.argument);
				}
			}
			function validateBindingIdentifier(
				parser,
				context,
				kind,
				t,
				skipEvalArgCheck
			) {
				if (context & 1024) {
					if ((t & 36864) === 36864) {
						report(parser, 115);
					}
					if (!skipEvalArgCheck && (t & 537079808) === 537079808) {
						report(parser, 116);
					}
				}
				if ((t & 20480) === 20480) {
					report(parser, 100);
				}
				if (kind & (8 | 16) && t === 241739) {
					report(parser, 98);
				}
				if (context & (4194304 | 2048) && t === 209008) {
					report(parser, 96);
				}
				if (context & (2097152 | 1024) && t === 241773) {
					report(parser, 95, 'yield');
				}
			}
			function validateFunctionName(parser, context, t) {
				if (context & 1024) {
					if ((t & 36864) === 36864) {
						report(parser, 115);
					}
					if ((t & 537079808) === 537079808) {
						report(parser, 116);
					}
					if (t === 122) {
						report(parser, 93);
					}
					if (t === 121) {
						report(parser, 93);
					}
				}
				if ((t & 20480) === 20480) {
					report(parser, 100);
				}
				if (context & (4194304 | 2048) && t === 209008) {
					report(parser, 96);
				}
				if (context & (2097152 | 1024) && t === 241773) {
					report(parser, 95, 'yield');
				}
			}
			function isStrictReservedWord(parser, context, t) {
				if (t === 209008) {
					if (context & (4194304 | 2048)) report(parser, 96);
					parser.destructible |= 128;
				}
				if (t === 241773 && context & 2097152)
					report(parser, 95, 'yield');
				return (
					(t & 20480) === 20480 || (t & 36864) === 36864 || t == 122
				);
			}
			function isPropertyWithPrivateFieldKey(expr) {
				return !expr.property
					? false
					: expr.property.type === 'PrivateIdentifier';
			}
			function isValidLabel(parser, labels, name, isIterationStatement) {
				while (labels) {
					if (labels['$' + name]) {
						if (isIterationStatement) report(parser, 134);
						return 1;
					}
					if (isIterationStatement && labels.loop)
						isIterationStatement = 0;
					labels = labels['$'];
				}
				return 0;
			}
			function validateAndDeclareLabel(parser, labels, name) {
				let set = labels;
				while (set) {
					if (set['$' + name]) report(parser, 133, name);
					set = set['$'];
				}
				labels['$' + name] = 1;
			}
			function finishNode(parser, context, start, line, column, node) {
				if (context & 2) {
					node.start = start;
					node.end = parser.startPos;
					node.range = [start, parser.startPos];
				}
				if (context & 4) {
					node.loc = {
						start: {
							line,
							column
						},
						end: {
							line: parser.startLine,
							column: parser.startColumn
						}
					};
					if (parser.sourceFile) {
						node.loc.source = parser.sourceFile;
					}
				}
				return node;
			}
			function isEqualTagName(elementName) {
				switch (elementName.type) {
					case 'JSXIdentifier':
						return elementName.name;
					case 'JSXNamespacedName':
						return elementName.namespace + ':' + elementName.name;
					case 'JSXMemberExpression':
						return (
							isEqualTagName(elementName.object) +
							'.' +
							isEqualTagName(elementName.property)
						);
				}
			}
			function createArrowHeadParsingScope(parser, context, value) {
				const scope = addChildScope(createScope(), 1024);
				addBlockName(parser, context, scope, value, 1, 0);
				return scope;
			}
			function recordScopeError(parser, type, ...params) {
				const { index, line, column } = parser;
				return {
					type,
					params,
					index,
					line,
					column
				};
			}
			function createScope() {
				return {
					parent: void 0,
					type: 2
				};
			}
			function addChildScope(parent, type) {
				return {
					parent,
					type,
					scopeError: void 0
				};
			}
			function addVarOrBlock(parser, context, scope, name, kind, origin) {
				if (kind & 4) {
					addVarName(parser, context, scope, name, kind);
				} else {
					addBlockName(parser, context, scope, name, kind, origin);
				}
				if (origin & 64) {
					declareUnboundVariable(parser, name);
				}
			}
			function addBlockName(parser, context, scope, name, kind, origin) {
				const value = scope['#' + name];
				if (value && (value & 2) === 0) {
					if (kind & 1) {
						scope.scopeError = recordScopeError(parser, 141, name);
					} else if (context & 256 && value & 64 && origin & 2);
					else {
						report(parser, 141, name);
					}
				}
				if (
					scope.type & 128 &&
					scope.parent['#' + name] &&
					(scope.parent['#' + name] & 2) === 0
				) {
					report(parser, 141, name);
				}
				if (scope.type & 1024 && value && (value & 2) === 0) {
					if (kind & 1) {
						scope.scopeError = recordScopeError(parser, 141, name);
					}
				}
				if (scope.type & 64) {
					if (scope.parent['#' + name] & 768)
						report(parser, 154, name);
				}
				scope['#' + name] = kind;
			}
			function addVarName(parser, context, scope, name, kind) {
				let currentScope = scope;
				while (currentScope && (currentScope.type & 256) === 0) {
					const value = currentScope['#' + name];
					if (value & 248) {
						if (
							context & 256 &&
							(context & 1024) === 0 &&
							((kind & 128 && value & 68) ||
								(value & 128 && kind & 68))
						);
						else {
							report(parser, 141, name);
						}
					}
					if (currentScope === scope) {
						if (value & 1 && kind & 1) {
							currentScope.scopeError = recordScopeError(
								parser,
								141,
								name
							);
						}
					}
					if (value & (512 | 256)) {
						if (
							(value & 512) === 0 ||
							(context & 256) === 0 ||
							context & 1024
						) {
							report(parser, 141, name);
						}
					}
					currentScope['#' + name] = kind;
					currentScope = currentScope.parent;
				}
			}
			function declareUnboundVariable(parser, name) {
				if (parser.exportedNames !== void 0 && name !== '') {
					if (parser.exportedNames['#' + name]) {
						report(parser, 142, name);
					}
					parser.exportedNames['#' + name] = 1;
				}
			}
			function addBindingToExports(parser, name) {
				if (parser.exportedBindings !== void 0 && name !== '') {
					parser.exportedBindings['#' + name] = 1;
				}
			}
			function pushComment(context, array) {
				return function (type, value, start, end, loc) {
					const comment = {
						type,
						value
					};
					if (context & 2) {
						comment.start = start;
						comment.end = end;
						comment.range = [start, end];
					}
					if (context & 4) {
						comment.loc = loc;
					}
					array.push(comment);
				};
			}
			function pushToken(context, array) {
				return function (token, start, end, loc) {
					const tokens = {
						token
					};
					if (context & 2) {
						tokens.start = start;
						tokens.end = end;
						tokens.range = [start, end];
					}
					if (context & 4) {
						tokens.loc = loc;
					}
					array.push(tokens);
				};
			}
			function isValidIdentifier(context, t) {
				if (context & (1024 | 2097152)) {
					if (context & 2048 && t === 209008) return false;
					if (context & 2097152 && t === 241773) return false;
					return (t & 143360) === 143360 || (t & 12288) === 12288;
				}
				return (
					(t & 143360) === 143360 ||
					(t & 12288) === 12288 ||
					(t & 36864) === 36864
				);
			}
			function classifyIdentifier(parser, context, t) {
				if ((t & 537079808) === 537079808) {
					if (context & 1024) report(parser, 116);
					parser.flags |= 512;
				}
				if (!isValidIdentifier(context, t)) report(parser, 0);
			}

			function create(
				source,
				sourceFile,
				onComment,
				onToken,
				onInsertedSemicolon
			) {
				return {
					source,
					flags: 0,
					index: 0,
					line: 1,
					column: 0,
					startPos: 0,
					end: source.length,
					tokenPos: 0,
					startColumn: 0,
					colPos: 0,
					linePos: 1,
					startLine: 1,
					sourceFile,
					tokenValue: '',
					token: 1048576,
					tokenRaw: '',
					tokenRegExp: void 0,
					currentChar: source.charCodeAt(0),
					exportedNames: [],
					exportedBindings: [],
					assignable: 1,
					destructible: 0,
					onComment,
					onToken,
					onInsertedSemicolon,
					leadingDecorators: []
				};
			}
			function parseSource(source, options, context) {
				let sourceFile = '';
				let onComment;
				let onInsertedSemicolon;
				let onToken;
				if (options != null) {
					if (options.module) context |= 2048 | 1024;
					if (options.next) context |= 1;
					if (options.loc) context |= 4;
					if (options.ranges) context |= 2;
					if (options.uniqueKeyInPattern) context |= 536870912;
					if (options.lexical) context |= 64;
					if (options.webcompat) context |= 256;
					if (options.directives) context |= 8 | 512;
					if (options.globalReturn) context |= 32;
					if (options.raw) context |= 512;
					if (options.preserveParens) context |= 128;
					if (options.impliedStrict) context |= 1024;
					if (options.jsx) context |= 16;
					if (options.source) sourceFile = options.source;
					if (options.onComment != null) {
						onComment = Array.isArray(options.onComment)
							? pushComment(context, options.onComment)
							: options.onComment;
					}
					if (options.onInsertedSemicolon != null)
						onInsertedSemicolon = options.onInsertedSemicolon;
					if (options.onToken != null) {
						onToken = Array.isArray(options.onToken)
							? pushToken(context, options.onToken)
							: options.onToken;
					}
				}
				const parser = create(
					source,
					sourceFile,
					onComment,
					onToken,
					onInsertedSemicolon
				);
				if (context & 1) skipHashBang(parser);
				const scope = context & 64 ? createScope() : void 0;
				let body = [];
				let sourceType = 'script';
				if (context & 2048) {
					sourceType = 'module';
					body = parseModuleItemList(parser, context | 8192, scope);
					if (scope) {
						for (const key in parser.exportedBindings) {
							if (key[0] === '#' && !scope[key])
								report(parser, 143, key.slice(1));
						}
					}
				} else {
					body = parseStatementList(parser, context | 8192, scope);
				}
				const node = {
					type: 'Program',
					sourceType,
					body
				};
				if (context & 2) {
					node.start = 0;
					node.end = source.length;
					node.range = [0, source.length];
				}
				if (context & 4) {
					node.loc = {
						start: { line: 1, column: 0 },
						end: { line: parser.line, column: parser.column }
					};
					if (parser.sourceFile) node.loc.source = sourceFile;
				}
				return node;
			}
			function parseStatementList(parser, context, scope) {
				nextToken(parser, context | 32768 | 268435456);
				const statements = [];
				while (parser.token === 134283267) {
					const {
						index,
						tokenPos,
						tokenValue,
						linePos,
						colPos,
						token
					} = parser;
					const expr = parseLiteral(parser, context);
					if (isValidStrictMode(parser, index, tokenPos, tokenValue))
						context |= 1024;
					statements.push(
						parseDirective(
							parser,
							context,
							expr,
							token,
							tokenPos,
							linePos,
							colPos
						)
					);
				}
				while (parser.token !== 1048576) {
					statements.push(
						parseStatementListItem(parser, context, scope, 4, {})
					);
				}
				return statements;
			}
			function parseModuleItemList(parser, context, scope) {
				nextToken(parser, context | 32768);
				const statements = [];
				if (context & 8) {
					while (parser.token === 134283267) {
						const { tokenPos, linePos, colPos, token } = parser;
						statements.push(
							parseDirective(
								parser,
								context,
								parseLiteral(parser, context),
								token,
								tokenPos,
								linePos,
								colPos
							)
						);
					}
				}
				while (parser.token !== 1048576) {
					statements.push(parseModuleItem(parser, context, scope));
				}
				return statements;
			}
			function parseModuleItem(parser, context, scope) {
				parser.leadingDecorators = parseDecorators(parser, context);
				let moduleItem;
				switch (parser.token) {
					case 20566:
						moduleItem = parseExportDeclaration(
							parser,
							context,
							scope
						);
						break;
					case 86108:
						moduleItem = parseImportDeclaration(
							parser,
							context,
							scope
						);
						break;
					default:
						moduleItem = parseStatementListItem(
							parser,
							context,
							scope,
							4,
							{}
						);
				}
				if (parser.leadingDecorators.length) {
					report(parser, 165);
				}
				return moduleItem;
			}
			function parseStatementListItem(
				parser,
				context,
				scope,
				origin,
				labels
			) {
				const start = parser.tokenPos;
				const line = parser.linePos;
				const column = parser.colPos;
				switch (parser.token) {
					case 86106:
						return parseFunctionDeclaration(
							parser,
							context,
							scope,
							origin,
							1,
							0,
							0,
							start,
							line,
							column
						);
					case 133:
					case 86096:
						return parseClassDeclaration(
							parser,
							context,
							scope,
							0,
							start,
							line,
							column
						);
					case 86092:
						return parseLexicalDeclaration(
							parser,
							context,
							scope,
							16,
							0,
							start,
							line,
							column
						);
					case 241739:
						return parseLetIdentOrVarDeclarationStatement(
							parser,
							context,
							scope,
							origin,
							start,
							line,
							column
						);
					case 20566:
						report(parser, 101, 'export');
					case 86108:
						nextToken(parser, context);
						switch (parser.token) {
							case 67174411:
								return parseImportCallDeclaration(
									parser,
									context,
									start,
									line,
									column
								);
							case 67108877:
								return parseImportMetaDeclaration(
									parser,
									context,
									start,
									line,
									column
								);
							default:
								report(parser, 101, 'import');
						}
					case 209007:
						return parseAsyncArrowOrAsyncFunctionDeclaration(
							parser,
							context,
							scope,
							origin,
							labels,
							1,
							start,
							line,
							column
						);
					default:
						return parseStatement(
							parser,
							context,
							scope,
							origin,
							labels,
							1,
							start,
							line,
							column
						);
				}
			}
			function parseStatement(
				parser,
				context,
				scope,
				origin,
				labels,
				allowFuncDecl,
				start,
				line,
				column
			) {
				switch (parser.token) {
					case 86090:
						return parseVariableStatement(
							parser,
							context,
							scope,
							0,
							start,
							line,
							column
						);
					case 20574:
						return parseReturnStatement(
							parser,
							context,
							start,
							line,
							column
						);
					case 20571:
						return parseIfStatement(
							parser,
							context,
							scope,
							labels,
							start,
							line,
							column
						);
					case 20569:
						return parseForStatement(
							parser,
							context,
							scope,
							labels,
							start,
							line,
							column
						);
					case 20564:
						return parseDoWhileStatement(
							parser,
							context,
							scope,
							labels,
							start,
							line,
							column
						);
					case 20580:
						return parseWhileStatement(
							parser,
							context,
							scope,
							labels,
							start,
							line,
							column
						);
					case 86112:
						return parseSwitchStatement(
							parser,
							context,
							scope,
							labels,
							start,
							line,
							column
						);
					case 1074790417:
						return parseEmptyStatement(
							parser,
							context,
							start,
							line,
							column
						);
					case 2162700:
						return parseBlock(
							parser,
							context,
							scope ? addChildScope(scope, 2) : scope,
							labels,
							start,
							line,
							column
						);
					case 86114:
						return parseThrowStatement(
							parser,
							context,
							start,
							line,
							column
						);
					case 20557:
						return parseBreakStatement(
							parser,
							context,
							labels,
							start,
							line,
							column
						);
					case 20561:
						return parseContinueStatement(
							parser,
							context,
							labels,
							start,
							line,
							column
						);
					case 20579:
						return parseTryStatement(
							parser,
							context,
							scope,
							labels,
							start,
							line,
							column
						);
					case 20581:
						return parseWithStatement(
							parser,
							context,
							scope,
							labels,
							start,
							line,
							column
						);
					case 20562:
						return parseDebuggerStatement(
							parser,
							context,
							start,
							line,
							column
						);
					case 209007:
						return parseAsyncArrowOrAsyncFunctionDeclaration(
							parser,
							context,
							scope,
							origin,
							labels,
							0,
							start,
							line,
							column
						);
					case 20559:
						report(parser, 157);
					case 20568:
						report(parser, 158);
					case 86106:
						report(
							parser,
							context & 1024
								? 74
								: (context & 256) === 0
									? 76
									: 75
						);
					case 86096:
						report(parser, 77);
					default:
						return parseExpressionOrLabelledStatement(
							parser,
							context,
							scope,
							origin,
							labels,
							allowFuncDecl,
							start,
							line,
							column
						);
				}
			}
			function parseExpressionOrLabelledStatement(
				parser,
				context,
				scope,
				origin,
				labels,
				allowFuncDecl,
				start,
				line,
				column
			) {
				const { tokenValue, token } = parser;
				let expr;
				switch (token) {
					case 241739:
						expr = parseIdentifier(parser, context);
						if (context & 1024) report(parser, 83);
						if (parser.token === 69271571) report(parser, 82);
						break;
					default:
						expr = parsePrimaryExpression(
							parser,
							context,
							2,
							0,
							1,
							0,
							1,
							parser.tokenPos,
							parser.linePos,
							parser.colPos
						);
				}
				if (token & 143360 && parser.token === 21) {
					return parseLabelledStatement(
						parser,
						context,
						scope,
						origin,
						labels,
						tokenValue,
						expr,
						token,
						allowFuncDecl,
						start,
						line,
						column
					);
				}
				expr = parseMemberOrUpdateExpression(
					parser,
					context,
					expr,
					0,
					0,
					start,
					line,
					column
				);
				expr = parseAssignmentExpression(
					parser,
					context,
					0,
					0,
					start,
					line,
					column,
					expr
				);
				if (parser.token === 18) {
					expr = parseSequenceExpression(
						parser,
						context,
						0,
						start,
						line,
						column,
						expr
					);
				}
				return parseExpressionStatement(
					parser,
					context,
					expr,
					start,
					line,
					column
				);
			}
			function parseBlock(
				parser,
				context,
				scope,
				labels,
				start,
				line,
				column
			) {
				const body = [];
				consume(parser, context | 32768, 2162700);
				while (parser.token !== 1074790415) {
					body.push(
						parseStatementListItem(parser, context, scope, 2, {
							$: labels
						})
					);
				}
				consume(parser, context | 32768, 1074790415);
				return finishNode(parser, context, start, line, column, {
					type: 'BlockStatement',
					body
				});
			}
			function parseReturnStatement(
				parser,
				context,
				start,
				line,
				column
			) {
				if ((context & 32) === 0 && context & 8192) report(parser, 90);
				nextToken(parser, context | 32768);
				const argument =
					parser.flags & 1 || parser.token & 1048576
						? null
						: parseExpressions(
								parser,
								context,
								0,
								1,
								parser.tokenPos,
								parser.linePos,
								parser.colPos
							);
				matchOrInsertSemicolon(parser, context | 32768);
				return finishNode(parser, context, start, line, column, {
					type: 'ReturnStatement',
					argument
				});
			}
			function parseExpressionStatement(
				parser,
				context,
				expression,
				start,
				line,
				column
			) {
				matchOrInsertSemicolon(parser, context | 32768);
				return finishNode(parser, context, start, line, column, {
					type: 'ExpressionStatement',
					expression
				});
			}
			function parseLabelledStatement(
				parser,
				context,
				scope,
				origin,
				labels,
				value,
				expr,
				token,
				allowFuncDecl,
				start,
				line,
				column
			) {
				validateBindingIdentifier(parser, context, 0, token, 1);
				validateAndDeclareLabel(parser, labels, value);
				nextToken(parser, context | 32768);
				const body =
					allowFuncDecl &&
					(context & 1024) === 0 &&
					context & 256 &&
					parser.token === 86106
						? parseFunctionDeclaration(
								parser,
								context,
								addChildScope(scope, 2),
								origin,
								0,
								0,
								0,
								parser.tokenPos,
								parser.linePos,
								parser.colPos
							)
						: parseStatement(
								parser,
								context,
								scope,
								origin,
								labels,
								allowFuncDecl,
								parser.tokenPos,
								parser.linePos,
								parser.colPos
							);
				return finishNode(parser, context, start, line, column, {
					type: 'LabeledStatement',
					label: expr,
					body
				});
			}
			function parseAsyncArrowOrAsyncFunctionDeclaration(
				parser,
				context,
				scope,
				origin,
				labels,
				allowFuncDecl,
				start,
				line,
				column
			) {
				const { token, tokenValue } = parser;
				let expr = parseIdentifier(parser, context);
				if (parser.token === 21) {
					return parseLabelledStatement(
						parser,
						context,
						scope,
						origin,
						labels,
						tokenValue,
						expr,
						token,
						1,
						start,
						line,
						column
					);
				}
				const asyncNewLine = parser.flags & 1;
				if (!asyncNewLine) {
					if (parser.token === 86106) {
						if (!allowFuncDecl) report(parser, 120);
						return parseFunctionDeclaration(
							parser,
							context,
							scope,
							origin,
							1,
							0,
							1,
							start,
							line,
							column
						);
					}
					if ((parser.token & 143360) === 143360) {
						expr = parseAsyncArrowAfterIdent(
							parser,
							context,
							1,
							start,
							line,
							column
						);
						if (parser.token === 18)
							expr = parseSequenceExpression(
								parser,
								context,
								0,
								start,
								line,
								column,
								expr
							);
						return parseExpressionStatement(
							parser,
							context,
							expr,
							start,
							line,
							column
						);
					}
				}
				if (parser.token === 67174411) {
					expr = parseAsyncArrowOrCallExpression(
						parser,
						context,
						expr,
						1,
						1,
						0,
						asyncNewLine,
						start,
						line,
						column
					);
				} else {
					if (parser.token === 10) {
						classifyIdentifier(parser, context, token);
						expr = parseArrowFromIdentifier(
							parser,
							context,
							parser.tokenValue,
							expr,
							0,
							1,
							0,
							start,
							line,
							column
						);
					}
					parser.assignable = 1;
				}
				expr = parseMemberOrUpdateExpression(
					parser,
					context,
					expr,
					0,
					0,
					start,
					line,
					column
				);
				expr = parseAssignmentExpression(
					parser,
					context,
					0,
					0,
					start,
					line,
					column,
					expr
				);
				parser.assignable = 1;
				if (parser.token === 18) {
					expr = parseSequenceExpression(
						parser,
						context,
						0,
						start,
						line,
						column,
						expr
					);
				}
				return parseExpressionStatement(
					parser,
					context,
					expr,
					start,
					line,
					column
				);
			}
			function parseDirective(
				parser,
				context,
				expression,
				token,
				start,
				line,
				column
			) {
				if (token !== 1074790417) {
					parser.assignable = 2;
					expression = parseMemberOrUpdateExpression(
						parser,
						context,
						expression,
						0,
						0,
						start,
						line,
						column
					);
					if (parser.token !== 1074790417) {
						expression = parseAssignmentExpression(
							parser,
							context,
							0,
							0,
							start,
							line,
							column,
							expression
						);
						if (parser.token === 18) {
							expression = parseSequenceExpression(
								parser,
								context,
								0,
								start,
								line,
								column,
								expression
							);
						}
					}
					matchOrInsertSemicolon(parser, context | 32768);
				}
				return context & 8 &&
					expression.type === 'Literal' &&
					typeof expression.value === 'string'
					? finishNode(parser, context, start, line, column, {
							type: 'ExpressionStatement',
							expression,
							directive: expression.raw.slice(1, -1)
						})
					: finishNode(parser, context, start, line, column, {
							type: 'ExpressionStatement',
							expression
						});
			}
			function parseEmptyStatement(parser, context, start, line, column) {
				nextToken(parser, context | 32768);
				return finishNode(parser, context, start, line, column, {
					type: 'EmptyStatement'
				});
			}
			function parseThrowStatement(parser, context, start, line, column) {
				nextToken(parser, context | 32768);
				if (parser.flags & 1) report(parser, 88);
				const argument = parseExpressions(
					parser,
					context,
					0,
					1,
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				matchOrInsertSemicolon(parser, context | 32768);
				return finishNode(parser, context, start, line, column, {
					type: 'ThrowStatement',
					argument
				});
			}
			function parseIfStatement(
				parser,
				context,
				scope,
				labels,
				start,
				line,
				column
			) {
				nextToken(parser, context);
				consume(parser, context | 32768, 67174411);
				parser.assignable = 1;
				const test = parseExpressions(
					parser,
					context,
					0,
					1,
					parser.tokenPos,
					parser.line,
					parser.colPos
				);
				consume(parser, context | 32768, 16);
				const consequent = parseConsequentOrAlternative(
					parser,
					context,
					scope,
					labels,
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				let alternate = null;
				if (parser.token === 20565) {
					nextToken(parser, context | 32768);
					alternate = parseConsequentOrAlternative(
						parser,
						context,
						scope,
						labels,
						parser.tokenPos,
						parser.linePos,
						parser.colPos
					);
				}
				return finishNode(parser, context, start, line, column, {
					type: 'IfStatement',
					test,
					consequent,
					alternate
				});
			}
			function parseConsequentOrAlternative(
				parser,
				context,
				scope,
				labels,
				start,
				line,
				column
			) {
				return context & 1024 ||
					(context & 256) === 0 ||
					parser.token !== 86106
					? parseStatement(
							parser,
							context,
							scope,
							0,
							{ $: labels },
							0,
							parser.tokenPos,
							parser.linePos,
							parser.colPos
						)
					: parseFunctionDeclaration(
							parser,
							context,
							addChildScope(scope, 2),
							0,
							0,
							0,
							0,
							start,
							line,
							column
						);
			}
			function parseSwitchStatement(
				parser,
				context,
				scope,
				labels,
				start,
				line,
				column
			) {
				nextToken(parser, context);
				consume(parser, context | 32768, 67174411);
				const discriminant = parseExpressions(
					parser,
					context,
					0,
					1,
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				consume(parser, context, 16);
				consume(parser, context, 2162700);
				const cases = [];
				let seenDefault = 0;
				if (scope) scope = addChildScope(scope, 8);
				while (parser.token !== 1074790415) {
					const { tokenPos, linePos, colPos } = parser;
					let test = null;
					const consequent = [];
					if (consumeOpt(parser, context | 32768, 20558)) {
						test = parseExpressions(
							parser,
							context,
							0,
							1,
							parser.tokenPos,
							parser.linePos,
							parser.colPos
						);
					} else {
						consume(parser, context | 32768, 20563);
						if (seenDefault) report(parser, 87);
						seenDefault = 1;
					}
					consume(parser, context | 32768, 21);
					while (
						parser.token !== 20558 &&
						parser.token !== 1074790415 &&
						parser.token !== 20563
					) {
						consequent.push(
							parseStatementListItem(
								parser,
								context | 4096,
								scope,
								2,
								{
									$: labels
								}
							)
						);
					}
					cases.push(
						finishNode(parser, context, tokenPos, linePos, colPos, {
							type: 'SwitchCase',
							test,
							consequent
						})
					);
				}
				consume(parser, context | 32768, 1074790415);
				return finishNode(parser, context, start, line, column, {
					type: 'SwitchStatement',
					discriminant,
					cases
				});
			}
			function parseWhileStatement(
				parser,
				context,
				scope,
				labels,
				start,
				line,
				column
			) {
				nextToken(parser, context);
				consume(parser, context | 32768, 67174411);
				const test = parseExpressions(
					parser,
					context,
					0,
					1,
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				consume(parser, context | 32768, 16);
				const body = parseIterationStatementBody(
					parser,
					context,
					scope,
					labels
				);
				return finishNode(parser, context, start, line, column, {
					type: 'WhileStatement',
					test,
					body
				});
			}
			function parseIterationStatementBody(
				parser,
				context,
				scope,
				labels
			) {
				return parseStatement(
					parser,
					((context | 134217728) ^ 134217728) | 131072,
					scope,
					0,
					{ loop: 1, $: labels },
					0,
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
			}
			function parseContinueStatement(
				parser,
				context,
				labels,
				start,
				line,
				column
			) {
				if ((context & 131072) === 0) report(parser, 66);
				nextToken(parser, context);
				let label = null;
				if ((parser.flags & 1) === 0 && parser.token & 143360) {
					const { tokenValue } = parser;
					label = parseIdentifier(parser, context | 32768);
					if (!isValidLabel(parser, labels, tokenValue, 1))
						report(parser, 135, tokenValue);
				}
				matchOrInsertSemicolon(parser, context | 32768);
				return finishNode(parser, context, start, line, column, {
					type: 'ContinueStatement',
					label
				});
			}
			function parseBreakStatement(
				parser,
				context,
				labels,
				start,
				line,
				column
			) {
				nextToken(parser, context | 32768);
				let label = null;
				if ((parser.flags & 1) === 0 && parser.token & 143360) {
					const { tokenValue } = parser;
					label = parseIdentifier(parser, context | 32768);
					if (!isValidLabel(parser, labels, tokenValue, 0))
						report(parser, 135, tokenValue);
				} else if ((context & (4096 | 131072)) === 0) {
					report(parser, 67);
				}
				matchOrInsertSemicolon(parser, context | 32768);
				return finishNode(parser, context, start, line, column, {
					type: 'BreakStatement',
					label
				});
			}
			function parseWithStatement(
				parser,
				context,
				scope,
				labels,
				start,
				line,
				column
			) {
				nextToken(parser, context);
				if (context & 1024) report(parser, 89);
				consume(parser, context | 32768, 67174411);
				const object = parseExpressions(
					parser,
					context,
					0,
					1,
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				consume(parser, context | 32768, 16);
				const body = parseStatement(
					parser,
					context,
					scope,
					2,
					labels,
					0,
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				return finishNode(parser, context, start, line, column, {
					type: 'WithStatement',
					object,
					body
				});
			}
			function parseDebuggerStatement(
				parser,
				context,
				start,
				line,
				column
			) {
				nextToken(parser, context | 32768);
				matchOrInsertSemicolon(parser, context | 32768);
				return finishNode(parser, context, start, line, column, {
					type: 'DebuggerStatement'
				});
			}
			function parseTryStatement(
				parser,
				context,
				scope,
				labels,
				start,
				line,
				column
			) {
				nextToken(parser, context | 32768);
				const firstScope = scope ? addChildScope(scope, 32) : void 0;
				const block = parseBlock(
					parser,
					context,
					firstScope,
					{ $: labels },
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				const { tokenPos, linePos, colPos } = parser;
				const handler = consumeOpt(parser, context | 32768, 20559)
					? parseCatchBlock(
							parser,
							context,
							scope,
							labels,
							tokenPos,
							linePos,
							colPos
						)
					: null;
				let finalizer = null;
				if (parser.token === 20568) {
					nextToken(parser, context | 32768);
					const finalizerScope = firstScope
						? addChildScope(scope, 4)
						: void 0;
					finalizer = parseBlock(
						parser,
						context,
						finalizerScope,
						{ $: labels },
						parser.tokenPos,
						parser.linePos,
						parser.colPos
					);
				}
				if (!handler && !finalizer) {
					report(parser, 86);
				}
				return finishNode(parser, context, start, line, column, {
					type: 'TryStatement',
					block,
					handler,
					finalizer
				});
			}
			function parseCatchBlock(
				parser,
				context,
				scope,
				labels,
				start,
				line,
				column
			) {
				let param = null;
				let additionalScope = scope;
				if (consumeOpt(parser, context, 67174411)) {
					if (scope) scope = addChildScope(scope, 4);
					param = parseBindingPattern(
						parser,
						context,
						scope,
						(parser.token & 2097152) === 2097152 ? 256 : 512,
						0,
						parser.tokenPos,
						parser.linePos,
						parser.colPos
					);
					if (parser.token === 18) {
						report(parser, 84);
					} else if (parser.token === 1077936157) {
						report(parser, 85);
					}
					consume(parser, context | 32768, 16);
					if (scope) additionalScope = addChildScope(scope, 64);
				}
				const body = parseBlock(
					parser,
					context,
					additionalScope,
					{ $: labels },
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				return finishNode(parser, context, start, line, column, {
					type: 'CatchClause',
					param,
					body
				});
			}
			function parseStaticBlock(
				parser,
				context,
				scope,
				start,
				line,
				column
			) {
				if (scope) scope = addChildScope(scope, 2);
				const ctorContext = 16384 | 524288;
				context = ((context | ctorContext) ^ ctorContext) | 262144;
				const { body } = parseBlock(
					parser,
					context,
					scope,
					{},
					start,
					line,
					column
				);
				return finishNode(parser, context, start, line, column, {
					type: 'StaticBlock',
					body
				});
			}
			function parseDoWhileStatement(
				parser,
				context,
				scope,
				labels,
				start,
				line,
				column
			) {
				nextToken(parser, context | 32768);
				const body = parseIterationStatementBody(
					parser,
					context,
					scope,
					labels
				);
				consume(parser, context, 20580);
				consume(parser, context | 32768, 67174411);
				const test = parseExpressions(
					parser,
					context,
					0,
					1,
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				consume(parser, context | 32768, 16);
				consumeOpt(parser, context | 32768, 1074790417);
				return finishNode(parser, context, start, line, column, {
					type: 'DoWhileStatement',
					body,
					test
				});
			}
			function parseLetIdentOrVarDeclarationStatement(
				parser,
				context,
				scope,
				origin,
				start,
				line,
				column
			) {
				const { token, tokenValue } = parser;
				let expr = parseIdentifier(parser, context);
				if (parser.token & (143360 | 2097152)) {
					const declarations = parseVariableDeclarationList(
						parser,
						context,
						scope,
						8,
						0
					);
					matchOrInsertSemicolon(parser, context | 32768);
					return finishNode(parser, context, start, line, column, {
						type: 'VariableDeclaration',
						kind: 'let',
						declarations
					});
				}
				parser.assignable = 1;
				if (context & 1024) report(parser, 83);
				if (parser.token === 21) {
					return parseLabelledStatement(
						parser,
						context,
						scope,
						origin,
						{},
						tokenValue,
						expr,
						token,
						0,
						start,
						line,
						column
					);
				}
				if (parser.token === 10) {
					let scope = void 0;
					if (context & 64)
						scope = createArrowHeadParsingScope(
							parser,
							context,
							tokenValue
						);
					parser.flags = (parser.flags | 128) ^ 128;
					expr = parseArrowFunctionExpression(
						parser,
						context,
						scope,
						[expr],
						0,
						start,
						line,
						column
					);
				} else {
					expr = parseMemberOrUpdateExpression(
						parser,
						context,
						expr,
						0,
						0,
						start,
						line,
						column
					);
					expr = parseAssignmentExpression(
						parser,
						context,
						0,
						0,
						start,
						line,
						column,
						expr
					);
				}
				if (parser.token === 18) {
					expr = parseSequenceExpression(
						parser,
						context,
						0,
						start,
						line,
						column,
						expr
					);
				}
				return parseExpressionStatement(
					parser,
					context,
					expr,
					start,
					line,
					column
				);
			}
			function parseLexicalDeclaration(
				parser,
				context,
				scope,
				kind,
				origin,
				start,
				line,
				column
			) {
				nextToken(parser, context);
				const declarations = parseVariableDeclarationList(
					parser,
					context,
					scope,
					kind,
					origin
				);
				matchOrInsertSemicolon(parser, context | 32768);
				return finishNode(parser, context, start, line, column, {
					type: 'VariableDeclaration',
					kind: kind & 8 ? 'let' : 'const',
					declarations
				});
			}
			function parseVariableStatement(
				parser,
				context,
				scope,
				origin,
				start,
				line,
				column
			) {
				nextToken(parser, context);
				const declarations = parseVariableDeclarationList(
					parser,
					context,
					scope,
					4,
					origin
				);
				matchOrInsertSemicolon(parser, context | 32768);
				return finishNode(parser, context, start, line, column, {
					type: 'VariableDeclaration',
					kind: 'var',
					declarations
				});
			}
			function parseVariableDeclarationList(
				parser,
				context,
				scope,
				kind,
				origin
			) {
				let bindingCount = 1;
				const list = [
					parseVariableDeclaration(
						parser,
						context,
						scope,
						kind,
						origin
					)
				];
				while (consumeOpt(parser, context, 18)) {
					bindingCount++;
					list.push(
						parseVariableDeclaration(
							parser,
							context,
							scope,
							kind,
							origin
						)
					);
				}
				if (bindingCount > 1 && origin & 32 && parser.token & 262144) {
					report(parser, 59, KeywordDescTable[parser.token & 255]);
				}
				return list;
			}
			function parseVariableDeclaration(
				parser,
				context,
				scope,
				kind,
				origin
			) {
				const { token, tokenPos, linePos, colPos } = parser;
				let init = null;
				const id = parseBindingPattern(
					parser,
					context,
					scope,
					kind,
					origin,
					tokenPos,
					linePos,
					colPos
				);
				if (parser.token === 1077936157) {
					nextToken(parser, context | 32768);
					init = parseExpression(
						parser,
						context,
						1,
						0,
						parser.tokenPos,
						parser.linePos,
						parser.colPos
					);
					if (origin & 32 || (token & 2097152) === 0) {
						if (
							parser.token === 274549 ||
							(parser.token === 8738868 &&
								(token & 2097152 ||
									(kind & 4) === 0 ||
									context & 1024))
						) {
							reportMessageAt(
								tokenPos,
								parser.line,
								parser.index - 3,
								58,
								parser.token === 274549 ? 'of' : 'in'
							);
						}
					}
				} else if (
					(kind & 16 || (token & 2097152) > 0) &&
					(parser.token & 262144) !== 262144
				) {
					report(parser, 57, kind & 16 ? 'const' : 'destructuring');
				}
				return finishNode(parser, context, tokenPos, linePos, colPos, {
					type: 'VariableDeclarator',
					id,
					init
				});
			}
			function parseForStatement(
				parser,
				context,
				scope,
				labels,
				start,
				line,
				column
			) {
				nextToken(parser, context);
				const forAwait =
					((context & 4194304) > 0 ||
						((context & 2048) > 0 && (context & 8192) > 0)) &&
					consumeOpt(parser, context, 209008);
				consume(parser, context | 32768, 67174411);
				if (scope) scope = addChildScope(scope, 1);
				let test = null;
				let update = null;
				let destructible = 0;
				let init = null;
				let isVarDecl =
					parser.token === 86090 ||
					parser.token === 241739 ||
					parser.token === 86092;
				let right;
				const { token, tokenPos, linePos, colPos } = parser;
				if (isVarDecl) {
					if (token === 241739) {
						init = parseIdentifier(parser, context);
						if (parser.token & (143360 | 2097152)) {
							if (parser.token === 8738868) {
								if (context & 1024) report(parser, 65);
							} else {
								init = finishNode(
									parser,
									context,
									tokenPos,
									linePos,
									colPos,
									{
										type: 'VariableDeclaration',
										kind: 'let',
										declarations:
											parseVariableDeclarationList(
												parser,
												context | 134217728,
												scope,
												8,
												32
											)
									}
								);
							}
							parser.assignable = 1;
						} else if (context & 1024) {
							report(parser, 65);
						} else {
							isVarDecl = false;
							parser.assignable = 1;
							init = parseMemberOrUpdateExpression(
								parser,
								context,
								init,
								0,
								0,
								tokenPos,
								linePos,
								colPos
							);
							if (parser.token === 274549) report(parser, 112);
						}
					} else {
						nextToken(parser, context);
						init = finishNode(
							parser,
							context,
							tokenPos,
							linePos,
							colPos,
							token === 86090
								? {
										type: 'VariableDeclaration',
										kind: 'var',
										declarations:
											parseVariableDeclarationList(
												parser,
												context | 134217728,
												scope,
												4,
												32
											)
									}
								: {
										type: 'VariableDeclaration',
										kind: 'const',
										declarations:
											parseVariableDeclarationList(
												parser,
												context | 134217728,
												scope,
												16,
												32
											)
									}
						);
						parser.assignable = 1;
					}
				} else if (token === 1074790417) {
					if (forAwait) report(parser, 80);
				} else if ((token & 2097152) === 2097152) {
					init =
						token === 2162700
							? parseObjectLiteralOrPattern(
									parser,
									context,
									void 0,
									1,
									0,
									0,
									2,
									32,
									tokenPos,
									linePos,
									colPos
								)
							: parseArrayExpressionOrPattern(
									parser,
									context,
									void 0,
									1,
									0,
									0,
									2,
									32,
									tokenPos,
									linePos,
									colPos
								);
					destructible = parser.destructible;
					if (context & 256 && destructible & 64) {
						report(parser, 61);
					}
					parser.assignable = destructible & 16 ? 2 : 1;
					init = parseMemberOrUpdateExpression(
						parser,
						context | 134217728,
						init,
						0,
						0,
						parser.tokenPos,
						parser.linePos,
						parser.colPos
					);
				} else {
					init = parseLeftHandSideExpression(
						parser,
						context | 134217728,
						1,
						0,
						1,
						tokenPos,
						linePos,
						colPos
					);
				}
				if ((parser.token & 262144) === 262144) {
					if (parser.token === 274549) {
						if (parser.assignable & 2)
							report(parser, 78, forAwait ? 'await' : 'of');
						reinterpretToPattern(parser, init);
						nextToken(parser, context | 32768);
						right = parseExpression(
							parser,
							context,
							1,
							0,
							parser.tokenPos,
							parser.linePos,
							parser.colPos
						);
						consume(parser, context | 32768, 16);
						const body = parseIterationStatementBody(
							parser,
							context,
							scope,
							labels
						);
						return finishNode(
							parser,
							context,
							start,
							line,
							column,
							{
								type: 'ForOfStatement',
								left: init,
								right,
								body,
								await: forAwait
							}
						);
					}
					if (parser.assignable & 2) report(parser, 78, 'in');
					reinterpretToPattern(parser, init);
					nextToken(parser, context | 32768);
					if (forAwait) report(parser, 80);
					right = parseExpressions(
						parser,
						context,
						0,
						1,
						parser.tokenPos,
						parser.linePos,
						parser.colPos
					);
					consume(parser, context | 32768, 16);
					const body = parseIterationStatementBody(
						parser,
						context,
						scope,
						labels
					);
					return finishNode(parser, context, start, line, column, {
						type: 'ForInStatement',
						body,
						left: init,
						right
					});
				}
				if (forAwait) report(parser, 80);
				if (!isVarDecl) {
					if (destructible & 8 && parser.token !== 1077936157) {
						report(parser, 78, 'loop');
					}
					init = parseAssignmentExpression(
						parser,
						context | 134217728,
						0,
						0,
						tokenPos,
						linePos,
						colPos,
						init
					);
				}
				if (parser.token === 18)
					init = parseSequenceExpression(
						parser,
						context,
						0,
						parser.tokenPos,
						parser.linePos,
						parser.colPos,
						init
					);
				consume(parser, context | 32768, 1074790417);
				if (parser.token !== 1074790417)
					test = parseExpressions(
						parser,
						context,
						0,
						1,
						parser.tokenPos,
						parser.linePos,
						parser.colPos
					);
				consume(parser, context | 32768, 1074790417);
				if (parser.token !== 16)
					update = parseExpressions(
						parser,
						context,
						0,
						1,
						parser.tokenPos,
						parser.linePos,
						parser.colPos
					);
				consume(parser, context | 32768, 16);
				const body = parseIterationStatementBody(
					parser,
					context,
					scope,
					labels
				);
				return finishNode(parser, context, start, line, column, {
					type: 'ForStatement',
					init,
					test,
					update,
					body
				});
			}
			function parseRestrictedIdentifier(parser, context, scope) {
				if (!isValidIdentifier(context, parser.token))
					report(parser, 115);
				if ((parser.token & 537079808) === 537079808)
					report(parser, 116);
				if (scope)
					addBlockName(
						parser,
						context,
						scope,
						parser.tokenValue,
						8,
						0
					);
				return parseIdentifier(parser, context);
			}
			function parseImportDeclaration(parser, context, scope) {
				const start = parser.tokenPos;
				const line = parser.linePos;
				const column = parser.colPos;
				nextToken(parser, context);
				let source = null;
				const { tokenPos, linePos, colPos } = parser;
				let specifiers = [];
				if (parser.token === 134283267) {
					source = parseLiteral(parser, context);
				} else {
					if (parser.token & 143360) {
						const local = parseRestrictedIdentifier(
							parser,
							context,
							scope
						);
						specifiers = [
							finishNode(
								parser,
								context,
								tokenPos,
								linePos,
								colPos,
								{
									type: 'ImportDefaultSpecifier',
									local
								}
							)
						];
						if (consumeOpt(parser, context, 18)) {
							switch (parser.token) {
								case 8457014:
									specifiers.push(
										parseImportNamespaceSpecifier(
											parser,
											context,
											scope
										)
									);
									break;
								case 2162700:
									parseImportSpecifierOrNamedImports(
										parser,
										context,
										scope,
										specifiers
									);
									break;
								default:
									report(parser, 105);
							}
						}
					} else {
						switch (parser.token) {
							case 8457014:
								specifiers = [
									parseImportNamespaceSpecifier(
										parser,
										context,
										scope
									)
								];
								break;
							case 2162700:
								parseImportSpecifierOrNamedImports(
									parser,
									context,
									scope,
									specifiers
								);
								break;
							case 67174411:
								return parseImportCallDeclaration(
									parser,
									context,
									start,
									line,
									column
								);
							case 67108877:
								return parseImportMetaDeclaration(
									parser,
									context,
									start,
									line,
									column
								);
							default:
								report(
									parser,
									28,
									KeywordDescTable[parser.token & 255]
								);
						}
					}
					source = parseModuleSpecifier(parser, context);
				}
				matchOrInsertSemicolon(parser, context | 32768);
				return finishNode(parser, context, start, line, column, {
					type: 'ImportDeclaration',
					specifiers,
					source
				});
			}
			function parseImportNamespaceSpecifier(parser, context, scope) {
				const { tokenPos, linePos, colPos } = parser;
				nextToken(parser, context);
				consume(parser, context, 77934);
				if ((parser.token & 134217728) === 134217728) {
					reportMessageAt(
						tokenPos,
						parser.line,
						parser.index,
						28,
						KeywordDescTable[parser.token & 255]
					);
				}
				return finishNode(parser, context, tokenPos, linePos, colPos, {
					type: 'ImportNamespaceSpecifier',
					local: parseRestrictedIdentifier(parser, context, scope)
				});
			}
			function parseModuleSpecifier(parser, context) {
				if (!consumeOpt(parser, context, 12404)) {
					report(parser, 28, KeywordDescTable[parser.token & 255]);
				}
				if (parser.token !== 134283267) report(parser, 103, 'Import');
				return parseLiteral(parser, context);
			}
			function parseImportSpecifierOrNamedImports(
				parser,
				context,
				scope,
				specifiers
			) {
				nextToken(parser, context);
				while (parser.token & 143360) {
					let { token, tokenValue, tokenPos, linePos, colPos } =
						parser;
					const imported = parseIdentifier(parser, context);
					let local;
					if (consumeOpt(parser, context, 77934)) {
						if (
							(parser.token & 134217728) === 134217728 ||
							parser.token === 18
						) {
							report(parser, 104);
						} else {
							validateBindingIdentifier(
								parser,
								context,
								16,
								parser.token,
								0
							);
						}
						tokenValue = parser.tokenValue;
						local = parseIdentifier(parser, context);
					} else {
						validateBindingIdentifier(
							parser,
							context,
							16,
							token,
							0
						);
						local = imported;
					}
					if (scope)
						addBlockName(parser, context, scope, tokenValue, 8, 0);
					specifiers.push(
						finishNode(parser, context, tokenPos, linePos, colPos, {
							type: 'ImportSpecifier',
							local,
							imported
						})
					);
					if (parser.token !== 1074790415)
						consume(parser, context, 18);
				}
				consume(parser, context, 1074790415);
				return specifiers;
			}
			function parseImportMetaDeclaration(
				parser,
				context,
				start,
				line,
				column
			) {
				let expr = parseImportMetaExpression(
					parser,
					context,
					finishNode(parser, context, start, line, column, {
						type: 'Identifier',
						name: 'import'
					}),
					start,
					line,
					column
				);
				expr = parseMemberOrUpdateExpression(
					parser,
					context,
					expr,
					0,
					0,
					start,
					line,
					column
				);
				expr = parseAssignmentExpression(
					parser,
					context,
					0,
					0,
					start,
					line,
					column,
					expr
				);
				if (parser.token === 18) {
					expr = parseSequenceExpression(
						parser,
						context,
						0,
						start,
						line,
						column,
						expr
					);
				}
				return parseExpressionStatement(
					parser,
					context,
					expr,
					start,
					line,
					column
				);
			}
			function parseImportCallDeclaration(
				parser,
				context,
				start,
				line,
				column
			) {
				let expr = parseImportExpression(
					parser,
					context,
					0,
					start,
					line,
					column
				);
				expr = parseMemberOrUpdateExpression(
					parser,
					context,
					expr,
					0,
					0,
					start,
					line,
					column
				);
				if (parser.token === 18) {
					expr = parseSequenceExpression(
						parser,
						context,
						0,
						start,
						line,
						column,
						expr
					);
				}
				return parseExpressionStatement(
					parser,
					context,
					expr,
					start,
					line,
					column
				);
			}
			function parseExportDeclaration(parser, context, scope) {
				const start = parser.tokenPos;
				const line = parser.linePos;
				const column = parser.colPos;
				nextToken(parser, context | 32768);
				const specifiers = [];
				let declaration = null;
				let source = null;
				let key;
				if (consumeOpt(parser, context | 32768, 20563)) {
					switch (parser.token) {
						case 86106: {
							declaration = parseFunctionDeclaration(
								parser,
								context,
								scope,
								4,
								1,
								1,
								0,
								parser.tokenPos,
								parser.linePos,
								parser.colPos
							);
							break;
						}
						case 133:
						case 86096:
							declaration = parseClassDeclaration(
								parser,
								context,
								scope,
								1,
								parser.tokenPos,
								parser.linePos,
								parser.colPos
							);
							break;
						case 209007:
							const { tokenPos, linePos, colPos } = parser;
							declaration = parseIdentifier(parser, context);
							const { flags } = parser;
							if ((flags & 1) === 0) {
								if (parser.token === 86106) {
									declaration = parseFunctionDeclaration(
										parser,
										context,
										scope,
										4,
										1,
										1,
										1,
										tokenPos,
										linePos,
										colPos
									);
								} else {
									if (parser.token === 67174411) {
										declaration =
											parseAsyncArrowOrCallExpression(
												parser,
												context,
												declaration,
												1,
												1,
												0,
												flags,
												tokenPos,
												linePos,
												colPos
											);
										declaration =
											parseMemberOrUpdateExpression(
												parser,
												context,
												declaration,
												0,
												0,
												tokenPos,
												linePos,
												colPos
											);
										declaration = parseAssignmentExpression(
											parser,
											context,
											0,
											0,
											tokenPos,
											linePos,
											colPos,
											declaration
										);
									} else if (parser.token & 143360) {
										if (scope)
											scope = createArrowHeadParsingScope(
												parser,
												context,
												parser.tokenValue
											);
										declaration = parseIdentifier(
											parser,
											context
										);
										declaration =
											parseArrowFunctionExpression(
												parser,
												context,
												scope,
												[declaration],
												1,
												tokenPos,
												linePos,
												colPos
											);
									}
								}
							}
							break;
						default:
							declaration = parseExpression(
								parser,
								context,
								1,
								0,
								parser.tokenPos,
								parser.linePos,
								parser.colPos
							);
							matchOrInsertSemicolon(parser, context | 32768);
					}
					if (scope) declareUnboundVariable(parser, 'default');
					return finishNode(parser, context, start, line, column, {
						type: 'ExportDefaultDeclaration',
						declaration
					});
				}
				switch (parser.token) {
					case 8457014: {
						nextToken(parser, context);
						let exported = null;
						const isNamedDeclaration = consumeOpt(
							parser,
							context,
							77934
						);
						if (isNamedDeclaration) {
							if (scope)
								declareUnboundVariable(
									parser,
									parser.tokenValue
								);
							exported = parseIdentifier(parser, context);
						}
						consume(parser, context, 12404);
						if (parser.token !== 134283267)
							report(parser, 103, 'Export');
						source = parseLiteral(parser, context);
						matchOrInsertSemicolon(parser, context | 32768);
						return finishNode(
							parser,
							context,
							start,
							line,
							column,
							{
								type: 'ExportAllDeclaration',
								source,
								exported
							}
						);
					}
					case 2162700: {
						nextToken(parser, context);
						const tmpExportedNames = [];
						const tmpExportedBindings = [];
						while (parser.token & 143360) {
							const { tokenPos, tokenValue, linePos, colPos } =
								parser;
							const local = parseIdentifier(parser, context);
							let exported;
							if (parser.token === 77934) {
								nextToken(parser, context);
								if ((parser.token & 134217728) === 134217728) {
									report(parser, 104);
								}
								if (scope) {
									tmpExportedNames.push(parser.tokenValue);
									tmpExportedBindings.push(tokenValue);
								}
								exported = parseIdentifier(parser, context);
							} else {
								if (scope) {
									tmpExportedNames.push(parser.tokenValue);
									tmpExportedBindings.push(parser.tokenValue);
								}
								exported = local;
							}
							specifiers.push(
								finishNode(
									parser,
									context,
									tokenPos,
									linePos,
									colPos,
									{
										type: 'ExportSpecifier',
										local,
										exported
									}
								)
							);
							if (parser.token !== 1074790415)
								consume(parser, context, 18);
						}
						consume(parser, context, 1074790415);
						if (consumeOpt(parser, context, 12404)) {
							if (parser.token !== 134283267)
								report(parser, 103, 'Export');
							source = parseLiteral(parser, context);
						} else if (scope) {
							let i = 0;
							let iMax = tmpExportedNames.length;
							for (; i < iMax; i++) {
								declareUnboundVariable(
									parser,
									tmpExportedNames[i]
								);
							}
							i = 0;
							iMax = tmpExportedBindings.length;
							for (; i < iMax; i++) {
								addBindingToExports(
									parser,
									tmpExportedBindings[i]
								);
							}
						}
						matchOrInsertSemicolon(parser, context | 32768);
						break;
					}
					case 86096:
						declaration = parseClassDeclaration(
							parser,
							context,
							scope,
							2,
							parser.tokenPos,
							parser.linePos,
							parser.colPos
						);
						break;
					case 86106:
						declaration = parseFunctionDeclaration(
							parser,
							context,
							scope,
							4,
							1,
							2,
							0,
							parser.tokenPos,
							parser.linePos,
							parser.colPos
						);
						break;
					case 241739:
						declaration = parseLexicalDeclaration(
							parser,
							context,
							scope,
							8,
							64,
							parser.tokenPos,
							parser.linePos,
							parser.colPos
						);
						break;
					case 86092:
						declaration = parseLexicalDeclaration(
							parser,
							context,
							scope,
							16,
							64,
							parser.tokenPos,
							parser.linePos,
							parser.colPos
						);
						break;
					case 86090:
						declaration = parseVariableStatement(
							parser,
							context,
							scope,
							64,
							parser.tokenPos,
							parser.linePos,
							parser.colPos
						);
						break;
					case 209007:
						const { tokenPos, linePos, colPos } = parser;
						nextToken(parser, context);
						if (
							(parser.flags & 1) === 0 &&
							parser.token === 86106
						) {
							declaration = parseFunctionDeclaration(
								parser,
								context,
								scope,
								4,
								1,
								2,
								1,
								tokenPos,
								linePos,
								colPos
							);
							if (scope) {
								key = declaration.id ? declaration.id.name : '';
								declareUnboundVariable(parser, key);
							}
							break;
						}
					default:
						report(
							parser,
							28,
							KeywordDescTable[parser.token & 255]
						);
				}
				return finishNode(parser, context, start, line, column, {
					type: 'ExportNamedDeclaration',
					declaration,
					specifiers,
					source
				});
			}
			function parseExpression(
				parser,
				context,
				canAssign,
				inGroup,
				start,
				line,
				column
			) {
				let expr = parsePrimaryExpression(
					parser,
					context,
					2,
					0,
					canAssign,
					inGroup,
					1,
					start,
					line,
					column
				);
				expr = parseMemberOrUpdateExpression(
					parser,
					context,
					expr,
					inGroup,
					0,
					start,
					line,
					column
				);
				return parseAssignmentExpression(
					parser,
					context,
					inGroup,
					0,
					start,
					line,
					column,
					expr
				);
			}
			function parseSequenceExpression(
				parser,
				context,
				inGroup,
				start,
				line,
				column,
				expr
			) {
				const expressions = [expr];
				while (consumeOpt(parser, context | 32768, 18)) {
					expressions.push(
						parseExpression(
							parser,
							context,
							1,
							inGroup,
							parser.tokenPos,
							parser.linePos,
							parser.colPos
						)
					);
				}
				return finishNode(parser, context, start, line, column, {
					type: 'SequenceExpression',
					expressions
				});
			}
			function parseExpressions(
				parser,
				context,
				inGroup,
				canAssign,
				start,
				line,
				column
			) {
				const expr = parseExpression(
					parser,
					context,
					canAssign,
					inGroup,
					start,
					line,
					column
				);
				return parser.token === 18
					? parseSequenceExpression(
							parser,
							context,
							inGroup,
							start,
							line,
							column,
							expr
						)
					: expr;
			}
			function parseAssignmentExpression(
				parser,
				context,
				inGroup,
				isPattern,
				start,
				line,
				column,
				left
			) {
				const { token } = parser;
				if ((token & 4194304) === 4194304) {
					if (parser.assignable & 2) report(parser, 24);
					if (
						(!isPattern &&
							token === 1077936157 &&
							left.type === 'ArrayExpression') ||
						left.type === 'ObjectExpression'
					) {
						reinterpretToPattern(parser, left);
					}
					nextToken(parser, context | 32768);
					const right = parseExpression(
						parser,
						context,
						1,
						inGroup,
						parser.tokenPos,
						parser.linePos,
						parser.colPos
					);
					parser.assignable = 2;
					return finishNode(
						parser,
						context,
						start,
						line,
						column,
						isPattern
							? {
									type: 'AssignmentPattern',
									left,
									right
								}
							: {
									type: 'AssignmentExpression',
									left,
									operator: KeywordDescTable[token & 255],
									right
								}
					);
				}
				if ((token & 8454144) === 8454144) {
					left = parseBinaryExpression(
						parser,
						context,
						inGroup,
						start,
						line,
						column,
						4,
						token,
						left
					);
				}
				if (consumeOpt(parser, context | 32768, 22)) {
					left = parseConditionalExpression(
						parser,
						context,
						left,
						start,
						line,
						column
					);
				}
				return left;
			}
			function parseAssignmentExpressionOrPattern(
				parser,
				context,
				inGroup,
				isPattern,
				start,
				line,
				column,
				left
			) {
				const { token } = parser;
				nextToken(parser, context | 32768);
				const right = parseExpression(
					parser,
					context,
					1,
					inGroup,
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				left = finishNode(
					parser,
					context,
					start,
					line,
					column,
					isPattern
						? {
								type: 'AssignmentPattern',
								left,
								right
							}
						: {
								type: 'AssignmentExpression',
								left,
								operator: KeywordDescTable[token & 255],
								right
							}
				);
				parser.assignable = 2;
				return left;
			}
			function parseConditionalExpression(
				parser,
				context,
				test,
				start,
				line,
				column
			) {
				const consequent = parseExpression(
					parser,
					(context | 134217728) ^ 134217728,
					1,
					0,
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				consume(parser, context | 32768, 21);
				parser.assignable = 1;
				const alternate = parseExpression(
					parser,
					context,
					1,
					0,
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				parser.assignable = 2;
				return finishNode(parser, context, start, line, column, {
					type: 'ConditionalExpression',
					test,
					consequent,
					alternate
				});
			}
			function parseBinaryExpression(
				parser,
				context,
				inGroup,
				start,
				line,
				column,
				minPrec,
				operator,
				left
			) {
				const bit = -((context & 134217728) > 0) & 8738868;
				let t;
				let prec;
				parser.assignable = 2;
				while (parser.token & 8454144) {
					t = parser.token;
					prec = t & 3840;
					if (
						(t & 524288 && operator & 268435456) ||
						(operator & 524288 && t & 268435456)
					) {
						report(parser, 160);
					}
					if (
						prec + ((t === 8457273) << 8) - ((bit === t) << 12) <=
						minPrec
					)
						break;
					nextToken(parser, context | 32768);
					left = finishNode(parser, context, start, line, column, {
						type:
							t & 524288 || t & 268435456
								? 'LogicalExpression'
								: 'BinaryExpression',
						left,
						right: parseBinaryExpression(
							parser,
							context,
							inGroup,
							parser.tokenPos,
							parser.linePos,
							parser.colPos,
							prec,
							t,
							parseLeftHandSideExpression(
								parser,
								context,
								0,
								inGroup,
								1,
								parser.tokenPos,
								parser.linePos,
								parser.colPos
							)
						),
						operator: KeywordDescTable[t & 255]
					});
				}
				if (parser.token === 1077936157) report(parser, 24);
				return left;
			}
			function parseUnaryExpression(
				parser,
				context,
				isLHS,
				start,
				line,
				column,
				inGroup
			) {
				if (!isLHS) report(parser, 0);
				const unaryOperator = parser.token;
				nextToken(parser, context | 32768);
				const arg = parseLeftHandSideExpression(
					parser,
					context,
					0,
					inGroup,
					1,
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				if (parser.token === 8457273) report(parser, 31);
				if (context & 1024 && unaryOperator === 16863278) {
					if (arg.type === 'Identifier') {
						report(parser, 118);
					} else if (isPropertyWithPrivateFieldKey(arg)) {
						report(parser, 124);
					}
				}
				parser.assignable = 2;
				return finishNode(parser, context, start, line, column, {
					type: 'UnaryExpression',
					operator: KeywordDescTable[unaryOperator & 255],
					argument: arg,
					prefix: true
				});
			}
			function parseAsyncExpression(
				parser,
				context,
				inGroup,
				isLHS,
				canAssign,
				inNew,
				start,
				line,
				column
			) {
				const { token } = parser;
				const expr = parseIdentifier(parser, context);
				const { flags } = parser;
				if ((flags & 1) === 0) {
					if (parser.token === 86106) {
						return parseFunctionExpression(
							parser,
							context,
							1,
							inGroup,
							start,
							line,
							column
						);
					}
					if ((parser.token & 143360) === 143360) {
						if (!isLHS) report(parser, 0);
						return parseAsyncArrowAfterIdent(
							parser,
							context,
							canAssign,
							start,
							line,
							column
						);
					}
				}
				if (!inNew && parser.token === 67174411) {
					return parseAsyncArrowOrCallExpression(
						parser,
						context,
						expr,
						canAssign,
						1,
						0,
						flags,
						start,
						line,
						column
					);
				}
				if (parser.token === 10) {
					classifyIdentifier(parser, context, token);
					if (inNew) report(parser, 49);
					return parseArrowFromIdentifier(
						parser,
						context,
						parser.tokenValue,
						expr,
						inNew,
						canAssign,
						0,
						start,
						line,
						column
					);
				}
				parser.assignable = 1;
				return expr;
			}
			function parseYieldExpression(
				parser,
				context,
				inGroup,
				canAssign,
				start,
				line,
				column
			) {
				if (inGroup) parser.destructible |= 256;
				if (context & 2097152) {
					nextToken(parser, context | 32768);
					if (context & 8388608) report(parser, 30);
					if (!canAssign) report(parser, 24);
					if (parser.token === 22) report(parser, 121);
					let argument = null;
					let delegate = false;
					if ((parser.flags & 1) === 0) {
						delegate = consumeOpt(parser, context | 32768, 8457014);
						if (parser.token & (12288 | 65536) || delegate) {
							argument = parseExpression(
								parser,
								context,
								1,
								0,
								parser.tokenPos,
								parser.linePos,
								parser.colPos
							);
						}
					}
					parser.assignable = 2;
					return finishNode(parser, context, start, line, column, {
						type: 'YieldExpression',
						argument,
						delegate
					});
				}
				if (context & 1024) report(parser, 95, 'yield');
				return parseIdentifierOrArrow(
					parser,
					context,
					start,
					line,
					column
				);
			}
			function parseAwaitExpression(
				parser,
				context,
				inNew,
				inGroup,
				start,
				line,
				column
			) {
				if (inGroup) parser.destructible |= 128;
				if (context & 4194304 || (context & 2048 && context & 8192)) {
					if (inNew) report(parser, 0);
					if (context & 8388608) {
						reportMessageAt(
							parser.index,
							parser.line,
							parser.index,
							29
						);
					}
					nextToken(parser, context | 32768);
					const argument = parseLeftHandSideExpression(
						parser,
						context,
						0,
						0,
						1,
						parser.tokenPos,
						parser.linePos,
						parser.colPos
					);
					if (parser.token === 8457273) report(parser, 31);
					parser.assignable = 2;
					return finishNode(parser, context, start, line, column, {
						type: 'AwaitExpression',
						argument
					});
				}
				if (context & 2048) report(parser, 96);
				return parseIdentifierOrArrow(
					parser,
					context,
					start,
					line,
					column
				);
			}
			function parseFunctionBody(
				parser,
				context,
				scope,
				origin,
				firstRestricted,
				scopeError
			) {
				const { tokenPos, linePos, colPos } = parser;
				consume(parser, context | 32768, 2162700);
				const body = [];
				const prevContext = context;
				if (parser.token !== 1074790415) {
					while (parser.token === 134283267) {
						const { index, tokenPos, tokenValue, token } = parser;
						const expr = parseLiteral(parser, context);
						if (
							isValidStrictMode(
								parser,
								index,
								tokenPos,
								tokenValue
							)
						) {
							context |= 1024;
							if (parser.flags & 128) {
								reportMessageAt(
									parser.index,
									parser.line,
									parser.tokenPos,
									64
								);
							}
							if (parser.flags & 64) {
								reportMessageAt(
									parser.index,
									parser.line,
									parser.tokenPos,
									8
								);
							}
						}
						body.push(
							parseDirective(
								parser,
								context,
								expr,
								token,
								tokenPos,
								parser.linePos,
								parser.colPos
							)
						);
					}
					if (context & 1024) {
						if (firstRestricted) {
							if ((firstRestricted & 537079808) === 537079808) {
								report(parser, 116);
							}
							if ((firstRestricted & 36864) === 36864) {
								report(parser, 38);
							}
						}
						if (parser.flags & 512) report(parser, 116);
						if (parser.flags & 256) report(parser, 115);
					}
					if (
						context & 64 &&
						scope &&
						scopeError !== void 0 &&
						(prevContext & 1024) === 0 &&
						(context & 8192) === 0
					) {
						reportScopeError(scopeError);
					}
				}
				parser.flags =
					(parser.flags | 512 | 256 | 64) ^ (512 | 256 | 64);
				parser.destructible = (parser.destructible | 256) ^ 256;
				while (parser.token !== 1074790415) {
					body.push(
						parseStatementListItem(parser, context, scope, 4, {})
					);
				}
				consume(
					parser,
					origin & (16 | 8) ? context | 32768 : context,
					1074790415
				);
				parser.flags &= ~(128 | 64);
				if (parser.token === 1077936157) report(parser, 24);
				return finishNode(parser, context, tokenPos, linePos, colPos, {
					type: 'BlockStatement',
					body
				});
			}
			function parseSuperExpression(
				parser,
				context,
				start,
				line,
				column
			) {
				nextToken(parser, context);
				switch (parser.token) {
					case 67108991:
						report(parser, 162);
					case 67174411: {
						if ((context & 524288) === 0) report(parser, 26);
						if (context & 16384 && !(context & 33554432)) {
							report(parser, 27);
						}
						parser.assignable = 2;
						break;
					}
					case 69271571:
					case 67108877: {
						if ((context & 262144) === 0) report(parser, 27);
						if (context & 16384 && !(context & 33554432)) {
							report(parser, 27);
						}
						parser.assignable = 1;
						break;
					}
					default:
						report(parser, 28, 'super');
				}
				return finishNode(parser, context, start, line, column, {
					type: 'Super'
				});
			}
			function parseLeftHandSideExpression(
				parser,
				context,
				canAssign,
				inGroup,
				isLHS,
				start,
				line,
				column
			) {
				const expression = parsePrimaryExpression(
					parser,
					context,
					2,
					0,
					canAssign,
					inGroup,
					isLHS,
					start,
					line,
					column
				);
				return parseMemberOrUpdateExpression(
					parser,
					context,
					expression,
					inGroup,
					0,
					start,
					line,
					column
				);
			}
			function parseUpdateExpression(
				parser,
				context,
				expr,
				start,
				line,
				column
			) {
				if (parser.assignable & 2) report(parser, 53);
				const { token } = parser;
				nextToken(parser, context);
				parser.assignable = 2;
				return finishNode(parser, context, start, line, column, {
					type: 'UpdateExpression',
					argument: expr,
					operator: KeywordDescTable[token & 255],
					prefix: false
				});
			}
			function parseMemberOrUpdateExpression(
				parser,
				context,
				expr,
				inGroup,
				inChain,
				start,
				line,
				column
			) {
				if (
					(parser.token & 33619968) === 33619968 &&
					(parser.flags & 1) === 0
				) {
					expr = parseUpdateExpression(
						parser,
						context,
						expr,
						start,
						line,
						column
					);
				} else if ((parser.token & 67108864) === 67108864) {
					context = (context | 134217728) ^ 134217728;
					switch (parser.token) {
						case 67108877: {
							nextToken(
								parser,
								(context | 268435456 | 8192) ^ 8192
							);
							if (
								context & 16384 &&
								parser.token === 131 &&
								parser.tokenValue === 'super'
							) {
								report(parser, 27);
							}
							parser.assignable = 1;
							const property = parsePropertyOrPrivatePropertyName(
								parser,
								context | 65536
							);
							expr = finishNode(
								parser,
								context,
								start,
								line,
								column,
								{
									type: 'MemberExpression',
									object: expr,
									computed: false,
									property
								}
							);
							break;
						}
						case 69271571: {
							let restoreHasOptionalChaining = false;
							if ((parser.flags & 2048) === 2048) {
								restoreHasOptionalChaining = true;
								parser.flags = (parser.flags | 2048) ^ 2048;
							}
							nextToken(parser, context | 32768);
							const { tokenPos, linePos, colPos } = parser;
							const property = parseExpressions(
								parser,
								context,
								inGroup,
								1,
								tokenPos,
								linePos,
								colPos
							);
							consume(parser, context, 20);
							parser.assignable = 1;
							expr = finishNode(
								parser,
								context,
								start,
								line,
								column,
								{
									type: 'MemberExpression',
									object: expr,
									computed: true,
									property
								}
							);
							if (restoreHasOptionalChaining) {
								parser.flags |= 2048;
							}
							break;
						}
						case 67174411: {
							if ((parser.flags & 1024) === 1024) {
								parser.flags = (parser.flags | 1024) ^ 1024;
								return expr;
							}
							let restoreHasOptionalChaining = false;
							if ((parser.flags & 2048) === 2048) {
								restoreHasOptionalChaining = true;
								parser.flags = (parser.flags | 2048) ^ 2048;
							}
							const args = parseArguments(
								parser,
								context,
								inGroup
							);
							parser.assignable = 2;
							expr = finishNode(
								parser,
								context,
								start,
								line,
								column,
								{
									type: 'CallExpression',
									callee: expr,
									arguments: args
								}
							);
							if (restoreHasOptionalChaining) {
								parser.flags |= 2048;
							}
							break;
						}
						case 67108991: {
							nextToken(
								parser,
								(context | 268435456 | 8192) ^ 8192
							);
							parser.flags |= 2048;
							parser.assignable = 2;
							expr = parseOptionalChain(
								parser,
								context,
								expr,
								start,
								line,
								column
							);
							break;
						}
						default:
							if ((parser.flags & 2048) === 2048) {
								report(parser, 161);
							}
							parser.assignable = 2;
							expr = finishNode(
								parser,
								context,
								start,
								line,
								column,
								{
									type: 'TaggedTemplateExpression',
									tag: expr,
									quasi:
										parser.token === 67174408
											? parseTemplate(
													parser,
													context | 65536
												)
											: parseTemplateLiteral(
													parser,
													context,
													parser.tokenPos,
													parser.linePos,
													parser.colPos
												)
								}
							);
					}
					expr = parseMemberOrUpdateExpression(
						parser,
						context,
						expr,
						0,
						1,
						start,
						line,
						column
					);
				}
				if (inChain === 0 && (parser.flags & 2048) === 2048) {
					parser.flags = (parser.flags | 2048) ^ 2048;
					expr = finishNode(parser, context, start, line, column, {
						type: 'ChainExpression',
						expression: expr
					});
				}
				return expr;
			}
			function parseOptionalChain(
				parser,
				context,
				expr,
				start,
				line,
				column
			) {
				let restoreHasOptionalChaining = false;
				let node;
				if (parser.token === 69271571 || parser.token === 67174411) {
					if ((parser.flags & 2048) === 2048) {
						restoreHasOptionalChaining = true;
						parser.flags = (parser.flags | 2048) ^ 2048;
					}
				}
				if (parser.token === 69271571) {
					nextToken(parser, context | 32768);
					const { tokenPos, linePos, colPos } = parser;
					const property = parseExpressions(
						parser,
						context,
						0,
						1,
						tokenPos,
						linePos,
						colPos
					);
					consume(parser, context, 20);
					parser.assignable = 2;
					node = finishNode(parser, context, start, line, column, {
						type: 'MemberExpression',
						object: expr,
						computed: true,
						optional: true,
						property
					});
				} else if (parser.token === 67174411) {
					const args = parseArguments(parser, context, 0);
					parser.assignable = 2;
					node = finishNode(parser, context, start, line, column, {
						type: 'CallExpression',
						callee: expr,
						arguments: args,
						optional: true
					});
				} else {
					if ((parser.token & (143360 | 4096)) === 0)
						report(parser, 155);
					const property = parseIdentifier(parser, context);
					parser.assignable = 2;
					node = finishNode(parser, context, start, line, column, {
						type: 'MemberExpression',
						object: expr,
						computed: false,
						optional: true,
						property
					});
				}
				if (restoreHasOptionalChaining) {
					parser.flags |= 2048;
				}
				return node;
			}
			function parsePropertyOrPrivatePropertyName(parser, context) {
				if (
					(parser.token & (143360 | 4096)) === 0 &&
					parser.token !== 131
				) {
					report(parser, 155);
				}
				return context & 1 && parser.token === 131
					? parsePrivateIdentifier(
							parser,
							context,
							parser.tokenPos,
							parser.linePos,
							parser.colPos
						)
					: parseIdentifier(parser, context);
			}
			function parseUpdateExpressionPrefixed(
				parser,
				context,
				inNew,
				isLHS,
				start,
				line,
				column
			) {
				if (inNew) report(parser, 54);
				if (!isLHS) report(parser, 0);
				const { token } = parser;
				nextToken(parser, context | 32768);
				const arg = parseLeftHandSideExpression(
					parser,
					context,
					0,
					0,
					1,
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				if (parser.assignable & 2) {
					report(parser, 53);
				}
				parser.assignable = 2;
				return finishNode(parser, context, start, line, column, {
					type: 'UpdateExpression',
					argument: arg,
					operator: KeywordDescTable[token & 255],
					prefix: true
				});
			}
			function parsePrimaryExpression(
				parser,
				context,
				kind,
				inNew,
				canAssign,
				inGroup,
				isLHS,
				start,
				line,
				column
			) {
				if ((parser.token & 143360) === 143360) {
					switch (parser.token) {
						case 209008:
							return parseAwaitExpression(
								parser,
								context,
								inNew,
								inGroup,
								start,
								line,
								column
							);
						case 241773:
							return parseYieldExpression(
								parser,
								context,
								inGroup,
								canAssign,
								start,
								line,
								column
							);
						case 209007:
							return parseAsyncExpression(
								parser,
								context,
								inGroup,
								isLHS,
								canAssign,
								inNew,
								start,
								line,
								column
							);
					}
					const { token, tokenValue } = parser;
					const expr = parseIdentifier(parser, context | 65536);
					if (parser.token === 10) {
						if (!isLHS) report(parser, 0);
						classifyIdentifier(parser, context, token);
						return parseArrowFromIdentifier(
							parser,
							context,
							tokenValue,
							expr,
							inNew,
							canAssign,
							0,
							start,
							line,
							column
						);
					}
					if (context & 16384 && token === 537079928)
						report(parser, 127);
					if (token === 241739) {
						if (context & 1024) report(parser, 110);
						if (kind & (8 | 16)) report(parser, 98);
					}
					parser.assignable =
						context & 1024 && (token & 537079808) === 537079808
							? 2
							: 1;
					return expr;
				}
				if ((parser.token & 134217728) === 134217728) {
					return parseLiteral(parser, context);
				}
				switch (parser.token) {
					case 33619995:
					case 33619996:
						return parseUpdateExpressionPrefixed(
							parser,
							context,
							inNew,
							isLHS,
							start,
							line,
							column
						);
					case 16863278:
					case 16842800:
					case 16842801:
					case 25233970:
					case 25233971:
					case 16863277:
					case 16863279:
						return parseUnaryExpression(
							parser,
							context,
							isLHS,
							start,
							line,
							column,
							inGroup
						);
					case 86106:
						return parseFunctionExpression(
							parser,
							context,
							0,
							inGroup,
							start,
							line,
							column
						);
					case 2162700:
						return parseObjectLiteral(
							parser,
							context,
							canAssign ? 0 : 1,
							inGroup,
							start,
							line,
							column
						);
					case 69271571:
						return parseArrayLiteral(
							parser,
							context,
							canAssign ? 0 : 1,
							inGroup,
							start,
							line,
							column
						);
					case 67174411:
						return parseParenthesizedExpression(
							parser,
							context | 65536,
							canAssign,
							1,
							0,
							start,
							line,
							column
						);
					case 86021:
					case 86022:
					case 86023:
						return parseNullOrTrueOrFalseLiteral(
							parser,
							context,
							start,
							line,
							column
						);
					case 86113:
						return parseThisExpression(parser, context);
					case 65540:
						return parseRegExpLiteral(
							parser,
							context,
							start,
							line,
							column
						);
					case 133:
					case 86096:
						return parseClassExpression(
							parser,
							context,
							inGroup,
							start,
							line,
							column
						);
					case 86111:
						return parseSuperExpression(
							parser,
							context,
							start,
							line,
							column
						);
					case 67174409:
						return parseTemplateLiteral(
							parser,
							context,
							start,
							line,
							column
						);
					case 67174408:
						return parseTemplate(parser, context);
					case 86109:
						return parseNewExpression(
							parser,
							context,
							inGroup,
							start,
							line,
							column
						);
					case 134283389:
						return parseBigIntLiteral(
							parser,
							context,
							start,
							line,
							column
						);
					case 131:
						return parsePrivateIdentifier(
							parser,
							context,
							start,
							line,
							column
						);
					case 86108:
						return parseImportCallOrMetaExpression(
							parser,
							context,
							inNew,
							inGroup,
							start,
							line,
							column
						);
					case 8456258:
						if (context & 16)
							return parseJSXRootElementOrFragment(
								parser,
								context,
								1,
								start,
								line,
								column
							);
					default:
						if (isValidIdentifier(context, parser.token))
							return parseIdentifierOrArrow(
								parser,
								context,
								start,
								line,
								column
							);
						report(
							parser,
							28,
							KeywordDescTable[parser.token & 255]
						);
				}
			}
			function parseImportCallOrMetaExpression(
				parser,
				context,
				inNew,
				inGroup,
				start,
				line,
				column
			) {
				let expr = parseIdentifier(parser, context);
				if (parser.token === 67108877) {
					return parseImportMetaExpression(
						parser,
						context,
						expr,
						start,
						line,
						column
					);
				}
				if (inNew) report(parser, 138);
				expr = parseImportExpression(
					parser,
					context,
					inGroup,
					start,
					line,
					column
				);
				parser.assignable = 2;
				return parseMemberOrUpdateExpression(
					parser,
					context,
					expr,
					inGroup,
					0,
					start,
					line,
					column
				);
			}
			function parseImportMetaExpression(
				parser,
				context,
				meta,
				start,
				line,
				column
			) {
				if ((context & 2048) === 0) report(parser, 164);
				nextToken(parser, context);
				if (parser.token !== 143495 && parser.tokenValue !== 'meta')
					report(parser, 28, KeywordDescTable[parser.token & 255]);
				parser.assignable = 2;
				return finishNode(parser, context, start, line, column, {
					type: 'MetaProperty',
					meta,
					property: parseIdentifier(parser, context)
				});
			}
			function parseImportExpression(
				parser,
				context,
				inGroup,
				start,
				line,
				column
			) {
				consume(parser, context | 32768, 67174411);
				if (parser.token === 14) report(parser, 139);
				const source = parseExpression(
					parser,
					context,
					1,
					inGroup,
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				consume(parser, context, 16);
				return finishNode(parser, context, start, line, column, {
					type: 'ImportExpression',
					source
				});
			}
			function parseBigIntLiteral(parser, context, start, line, column) {
				const { tokenRaw, tokenValue } = parser;
				nextToken(parser, context);
				parser.assignable = 2;
				return finishNode(
					parser,
					context,
					start,
					line,
					column,
					context & 512
						? {
								type: 'Literal',
								value: tokenValue,
								bigint: tokenRaw.slice(0, -1),
								raw: tokenRaw
							}
						: {
								type: 'Literal',
								value: tokenValue,
								bigint: tokenRaw.slice(0, -1)
							}
				);
			}
			function parseTemplateLiteral(
				parser,
				context,
				start,
				line,
				column
			) {
				parser.assignable = 2;
				const { tokenValue, tokenRaw, tokenPos, linePos, colPos } =
					parser;
				consume(parser, context, 67174409);
				const quasis = [
					parseTemplateElement(
						parser,
						context,
						tokenValue,
						tokenRaw,
						tokenPos,
						linePos,
						colPos,
						true
					)
				];
				return finishNode(parser, context, start, line, column, {
					type: 'TemplateLiteral',
					expressions: [],
					quasis
				});
			}
			function parseTemplate(parser, context) {
				context = (context | 134217728) ^ 134217728;
				const { tokenValue, tokenRaw, tokenPos, linePos, colPos } =
					parser;
				consume(parser, context | 32768, 67174408);
				const quasis = [
					parseTemplateElement(
						parser,
						context,
						tokenValue,
						tokenRaw,
						tokenPos,
						linePos,
						colPos,
						false
					)
				];
				const expressions = [
					parseExpressions(
						parser,
						context,
						0,
						1,
						parser.tokenPos,
						parser.linePos,
						parser.colPos
					)
				];
				if (parser.token !== 1074790415) report(parser, 81);
				while (
					(parser.token = scanTemplateTail(parser, context)) !==
					67174409
				) {
					const { tokenValue, tokenRaw, tokenPos, linePos, colPos } =
						parser;
					consume(parser, context | 32768, 67174408);
					quasis.push(
						parseTemplateElement(
							parser,
							context,
							tokenValue,
							tokenRaw,
							tokenPos,
							linePos,
							colPos,
							false
						)
					);
					expressions.push(
						parseExpressions(
							parser,
							context,
							0,
							1,
							parser.tokenPos,
							parser.linePos,
							parser.colPos
						)
					);
					if (parser.token !== 1074790415) report(parser, 81);
				}
				{
					const { tokenValue, tokenRaw, tokenPos, linePos, colPos } =
						parser;
					consume(parser, context, 67174409);
					quasis.push(
						parseTemplateElement(
							parser,
							context,
							tokenValue,
							tokenRaw,
							tokenPos,
							linePos,
							colPos,
							true
						)
					);
				}
				return finishNode(parser, context, tokenPos, linePos, colPos, {
					type: 'TemplateLiteral',
					expressions,
					quasis
				});
			}
			function parseTemplateElement(
				parser,
				context,
				cooked,
				raw,
				start,
				line,
				col,
				tail
			) {
				const node = finishNode(parser, context, start, line, col, {
					type: 'TemplateElement',
					value: {
						cooked,
						raw
					},
					tail
				});
				const tailSize = tail ? 1 : 2;
				if (context & 2) {
					node.start += 1;
					node.range[0] += 1;
					node.end -= tailSize;
					node.range[1] -= tailSize;
				}
				if (context & 4) {
					node.loc.start.column += 1;
					node.loc.end.column -= tailSize;
				}
				return node;
			}
			function parseSpreadElement(parser, context, start, line, column) {
				context = (context | 134217728) ^ 134217728;
				consume(parser, context | 32768, 14);
				const argument = parseExpression(
					parser,
					context,
					1,
					0,
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				parser.assignable = 1;
				return finishNode(parser, context, start, line, column, {
					type: 'SpreadElement',
					argument
				});
			}
			function parseArguments(parser, context, inGroup) {
				nextToken(parser, context | 32768);
				const args = [];
				if (parser.token === 16) {
					nextToken(parser, context | 65536);
					return args;
				}
				while (parser.token !== 16) {
					if (parser.token === 14) {
						args.push(
							parseSpreadElement(
								parser,
								context,
								parser.tokenPos,
								parser.linePos,
								parser.colPos
							)
						);
					} else {
						args.push(
							parseExpression(
								parser,
								context,
								1,
								inGroup,
								parser.tokenPos,
								parser.linePos,
								parser.colPos
							)
						);
					}
					if (parser.token !== 18) break;
					nextToken(parser, context | 32768);
					if (parser.token === 16) break;
				}
				consume(parser, context, 16);
				return args;
			}
			function parseIdentifier(parser, context) {
				const { tokenValue, tokenPos, linePos, colPos } = parser;
				nextToken(parser, context);
				return finishNode(parser, context, tokenPos, linePos, colPos, {
					type: 'Identifier',
					name: tokenValue
				});
			}
			function parseLiteral(parser, context) {
				const { tokenValue, tokenRaw, tokenPos, linePos, colPos } =
					parser;
				if (parser.token === 134283389) {
					return parseBigIntLiteral(
						parser,
						context,
						tokenPos,
						linePos,
						colPos
					);
				}
				nextToken(parser, context);
				parser.assignable = 2;
				return finishNode(
					parser,
					context,
					tokenPos,
					linePos,
					colPos,
					context & 512
						? {
								type: 'Literal',
								value: tokenValue,
								raw: tokenRaw
							}
						: {
								type: 'Literal',
								value: tokenValue
							}
				);
			}
			function parseNullOrTrueOrFalseLiteral(
				parser,
				context,
				start,
				line,
				column
			) {
				const raw = KeywordDescTable[parser.token & 255];
				const value = parser.token === 86023 ? null : raw === 'true';
				nextToken(parser, context);
				parser.assignable = 2;
				return finishNode(
					parser,
					context,
					start,
					line,
					column,
					context & 512
						? {
								type: 'Literal',
								value,
								raw
							}
						: {
								type: 'Literal',
								value
							}
				);
			}
			function parseThisExpression(parser, context) {
				const { tokenPos, linePos, colPos } = parser;
				nextToken(parser, context);
				parser.assignable = 2;
				return finishNode(parser, context, tokenPos, linePos, colPos, {
					type: 'ThisExpression'
				});
			}
			function parseFunctionDeclaration(
				parser,
				context,
				scope,
				origin,
				allowGen,
				flags,
				isAsync,
				start,
				line,
				column
			) {
				nextToken(parser, context | 32768);
				const isGenerator = allowGen
					? optionalBit(parser, context, 8457014)
					: 0;
				let id = null;
				let firstRestricted;
				let functionScope = scope ? createScope() : void 0;
				if (parser.token === 67174411) {
					if ((flags & 1) === 0) report(parser, 37, 'Function');
				} else {
					const kind =
						origin & 4 &&
						((context & 8192) === 0 || (context & 2048) === 0)
							? 4
							: 64;
					validateFunctionName(
						parser,
						context | ((context & 3072) << 11),
						parser.token
					);
					if (scope) {
						if (kind & 4) {
							addVarName(
								parser,
								context,
								scope,
								parser.tokenValue,
								kind
							);
						} else {
							addBlockName(
								parser,
								context,
								scope,
								parser.tokenValue,
								kind,
								origin
							);
						}
						functionScope = addChildScope(functionScope, 256);
						if (flags) {
							if (flags & 2) {
								declareUnboundVariable(
									parser,
									parser.tokenValue
								);
							}
						}
					}
					firstRestricted = parser.token;
					if (parser.token & 143360) {
						id = parseIdentifier(parser, context);
					} else {
						report(
							parser,
							28,
							KeywordDescTable[parser.token & 255]
						);
					}
				}
				context =
					((context | 32243712) ^ 32243712) |
					67108864 |
					((isAsync * 2 + isGenerator) << 21) |
					(isGenerator ? 0 : 268435456);
				if (scope) functionScope = addChildScope(functionScope, 512);
				const params = parseFormalParametersOrFormalList(
					parser,
					context | 8388608,
					functionScope,
					0,
					1
				);
				const body = parseFunctionBody(
					parser,
					(context | 8192 | 4096 | 131072) ^ (8192 | 4096 | 131072),
					scope ? addChildScope(functionScope, 128) : functionScope,
					8,
					firstRestricted,
					scope ? functionScope.scopeError : void 0
				);
				return finishNode(parser, context, start, line, column, {
					type: 'FunctionDeclaration',
					id,
					params,
					body,
					async: isAsync === 1,
					generator: isGenerator === 1
				});
			}
			function parseFunctionExpression(
				parser,
				context,
				isAsync,
				inGroup,
				start,
				line,
				column
			) {
				nextToken(parser, context | 32768);
				const isGenerator = optionalBit(parser, context, 8457014);
				const generatorAndAsyncFlags =
					(isAsync * 2 + isGenerator) << 21;
				let id = null;
				let firstRestricted;
				let scope = context & 64 ? createScope() : void 0;
				if ((parser.token & (143360 | 4096 | 36864)) > 0) {
					validateFunctionName(
						parser,
						((context | 0x1ec0000) ^ 0x1ec0000) |
							generatorAndAsyncFlags,
						parser.token
					);
					if (scope) scope = addChildScope(scope, 256);
					firstRestricted = parser.token;
					id = parseIdentifier(parser, context);
				}
				context =
					((context | 32243712) ^ 32243712) |
					67108864 |
					generatorAndAsyncFlags |
					(isGenerator ? 0 : 268435456);
				if (scope) scope = addChildScope(scope, 512);
				const params = parseFormalParametersOrFormalList(
					parser,
					context | 8388608,
					scope,
					inGroup,
					1
				);
				const body = parseFunctionBody(
					parser,
					context & ~(0x8001000 | 8192 | 4096 | 131072 | 16384),
					scope ? addChildScope(scope, 128) : scope,
					0,
					firstRestricted,
					void 0
				);
				parser.assignable = 2;
				return finishNode(parser, context, start, line, column, {
					type: 'FunctionExpression',
					id,
					params,
					body,
					async: isAsync === 1,
					generator: isGenerator === 1
				});
			}
			function parseArrayLiteral(
				parser,
				context,
				skipInitializer,
				inGroup,
				start,
				line,
				column
			) {
				const expr = parseArrayExpressionOrPattern(
					parser,
					context,
					void 0,
					skipInitializer,
					inGroup,
					0,
					2,
					0,
					start,
					line,
					column
				);
				if (context & 256 && parser.destructible & 64) {
					report(parser, 61);
				}
				if (parser.destructible & 8) {
					report(parser, 60);
				}
				return expr;
			}
			function parseArrayExpressionOrPattern(
				parser,
				context,
				scope,
				skipInitializer,
				inGroup,
				isPattern,
				kind,
				origin,
				start,
				line,
				column
			) {
				nextToken(parser, context | 32768);
				const elements = [];
				let destructible = 0;
				context = (context | 134217728) ^ 134217728;
				while (parser.token !== 20) {
					if (consumeOpt(parser, context | 32768, 18)) {
						elements.push(null);
					} else {
						let left;
						const { token, tokenPos, linePos, colPos, tokenValue } =
							parser;
						if (token & 143360) {
							left = parsePrimaryExpression(
								parser,
								context,
								kind,
								0,
								1,
								inGroup,
								1,
								tokenPos,
								linePos,
								colPos
							);
							if (parser.token === 1077936157) {
								if (parser.assignable & 2) report(parser, 24);
								nextToken(parser, context | 32768);
								if (scope)
									addVarOrBlock(
										parser,
										context,
										scope,
										tokenValue,
										kind,
										origin
									);
								const right = parseExpression(
									parser,
									context,
									1,
									inGroup,
									parser.tokenPos,
									parser.linePos,
									parser.colPos
								);
								left = finishNode(
									parser,
									context,
									tokenPos,
									linePos,
									colPos,
									isPattern
										? {
												type: 'AssignmentPattern',
												left,
												right
											}
										: {
												type: 'AssignmentExpression',
												operator: '=',
												left,
												right
											}
								);
								destructible |=
									parser.destructible & 256
										? 256
										: 0 | (parser.destructible & 128)
											? 128
											: 0;
							} else if (
								parser.token === 18 ||
								parser.token === 20
							) {
								if (parser.assignable & 2) {
									destructible |= 16;
								} else if (scope) {
									addVarOrBlock(
										parser,
										context,
										scope,
										tokenValue,
										kind,
										origin
									);
								}
								destructible |=
									parser.destructible & 256
										? 256
										: 0 | (parser.destructible & 128)
											? 128
											: 0;
							} else {
								destructible |=
									kind & 1 ? 32 : (kind & 2) === 0 ? 16 : 0;
								left = parseMemberOrUpdateExpression(
									parser,
									context,
									left,
									inGroup,
									0,
									tokenPos,
									linePos,
									colPos
								);
								if (
									parser.token !== 18 &&
									parser.token !== 20
								) {
									if (parser.token !== 1077936157)
										destructible |= 16;
									left = parseAssignmentExpression(
										parser,
										context,
										inGroup,
										isPattern,
										tokenPos,
										linePos,
										colPos,
										left
									);
								} else if (parser.token !== 1077936157) {
									destructible |=
										parser.assignable & 2 ? 16 : 32;
								}
							}
						} else if (token & 2097152) {
							left =
								parser.token === 2162700
									? parseObjectLiteralOrPattern(
											parser,
											context,
											scope,
											0,
											inGroup,
											isPattern,
											kind,
											origin,
											tokenPos,
											linePos,
											colPos
										)
									: parseArrayExpressionOrPattern(
											parser,
											context,
											scope,
											0,
											inGroup,
											isPattern,
											kind,
											origin,
											tokenPos,
											linePos,
											colPos
										);
							destructible |= parser.destructible;
							parser.assignable =
								parser.destructible & 16 ? 2 : 1;
							if (parser.token === 18 || parser.token === 20) {
								if (parser.assignable & 2) {
									destructible |= 16;
								}
							} else if (parser.destructible & 8) {
								report(parser, 69);
							} else {
								left = parseMemberOrUpdateExpression(
									parser,
									context,
									left,
									inGroup,
									0,
									tokenPos,
									linePos,
									colPos
								);
								destructible = parser.assignable & 2 ? 16 : 0;
								if (
									parser.token !== 18 &&
									parser.token !== 20
								) {
									left = parseAssignmentExpression(
										parser,
										context,
										inGroup,
										isPattern,
										tokenPos,
										linePos,
										colPos,
										left
									);
								} else if (parser.token !== 1077936157) {
									destructible |=
										parser.assignable & 2 ? 16 : 32;
								}
							}
						} else if (token === 14) {
							left = parseSpreadOrRestElement(
								parser,
								context,
								scope,
								20,
								kind,
								origin,
								0,
								inGroup,
								isPattern,
								tokenPos,
								linePos,
								colPos
							);
							destructible |= parser.destructible;
							if (parser.token !== 18 && parser.token !== 20)
								report(
									parser,
									28,
									KeywordDescTable[parser.token & 255]
								);
						} else {
							left = parseLeftHandSideExpression(
								parser,
								context,
								1,
								0,
								1,
								tokenPos,
								linePos,
								colPos
							);
							if (parser.token !== 18 && parser.token !== 20) {
								left = parseAssignmentExpression(
									parser,
									context,
									inGroup,
									isPattern,
									tokenPos,
									linePos,
									colPos,
									left
								);
								if (
									(kind & (2 | 1)) === 0 &&
									token === 67174411
								)
									destructible |= 16;
							} else if (parser.assignable & 2) {
								destructible |= 16;
							} else if (token === 67174411) {
								destructible |=
									parser.assignable & 1 && kind & (2 | 1)
										? 32
										: 16;
							}
						}
						elements.push(left);
						if (consumeOpt(parser, context | 32768, 18)) {
							if (parser.token === 20) break;
						} else break;
					}
				}
				consume(parser, context, 20);
				const node = finishNode(parser, context, start, line, column, {
					type: isPattern ? 'ArrayPattern' : 'ArrayExpression',
					elements
				});
				if (!skipInitializer && parser.token & 4194304) {
					return parseArrayOrObjectAssignmentPattern(
						parser,
						context,
						destructible,
						inGroup,
						isPattern,
						start,
						line,
						column,
						node
					);
				}
				parser.destructible = destructible;
				return node;
			}
			function parseArrayOrObjectAssignmentPattern(
				parser,
				context,
				destructible,
				inGroup,
				isPattern,
				start,
				line,
				column,
				node
			) {
				if (parser.token !== 1077936157) report(parser, 24);
				nextToken(parser, context | 32768);
				if (destructible & 16) report(parser, 24);
				if (!isPattern) reinterpretToPattern(parser, node);
				const { tokenPos, linePos, colPos } = parser;
				const right = parseExpression(
					parser,
					context,
					1,
					inGroup,
					tokenPos,
					linePos,
					colPos
				);
				parser.destructible =
					((destructible | 64 | 8) ^ (8 | 64)) |
					(parser.destructible & 128 ? 128 : 0) |
					(parser.destructible & 256 ? 256 : 0);
				return finishNode(
					parser,
					context,
					start,
					line,
					column,
					isPattern
						? {
								type: 'AssignmentPattern',
								left: node,
								right
							}
						: {
								type: 'AssignmentExpression',
								left: node,
								operator: '=',
								right
							}
				);
			}
			function parseSpreadOrRestElement(
				parser,
				context,
				scope,
				closingToken,
				kind,
				origin,
				isAsync,
				inGroup,
				isPattern,
				start,
				line,
				column
			) {
				nextToken(parser, context | 32768);
				let argument = null;
				let destructible = 0;
				let { token, tokenValue, tokenPos, linePos, colPos } = parser;
				if (token & (4096 | 143360)) {
					parser.assignable = 1;
					argument = parsePrimaryExpression(
						parser,
						context,
						kind,
						0,
						1,
						inGroup,
						1,
						tokenPos,
						linePos,
						colPos
					);
					token = parser.token;
					argument = parseMemberOrUpdateExpression(
						parser,
						context,
						argument,
						inGroup,
						0,
						tokenPos,
						linePos,
						colPos
					);
					if (parser.token !== 18 && parser.token !== closingToken) {
						if (
							parser.assignable & 2 &&
							parser.token === 1077936157
						)
							report(parser, 69);
						destructible |= 16;
						argument = parseAssignmentExpression(
							parser,
							context,
							inGroup,
							isPattern,
							tokenPos,
							linePos,
							colPos,
							argument
						);
					}
					if (parser.assignable & 2) {
						destructible |= 16;
					} else if (token === closingToken || token === 18) {
						if (scope)
							addVarOrBlock(
								parser,
								context,
								scope,
								tokenValue,
								kind,
								origin
							);
					} else {
						destructible |= 32;
					}
					destructible |= parser.destructible & 128 ? 128 : 0;
				} else if (token === closingToken) {
					report(parser, 39);
				} else if (token & 2097152) {
					argument =
						parser.token === 2162700
							? parseObjectLiteralOrPattern(
									parser,
									context,
									scope,
									1,
									inGroup,
									isPattern,
									kind,
									origin,
									tokenPos,
									linePos,
									colPos
								)
							: parseArrayExpressionOrPattern(
									parser,
									context,
									scope,
									1,
									inGroup,
									isPattern,
									kind,
									origin,
									tokenPos,
									linePos,
									colPos
								);
					token = parser.token;
					if (
						token !== 1077936157 &&
						token !== closingToken &&
						token !== 18
					) {
						if (parser.destructible & 8) report(parser, 69);
						argument = parseMemberOrUpdateExpression(
							parser,
							context,
							argument,
							inGroup,
							0,
							tokenPos,
							linePos,
							colPos
						);
						destructible |= parser.assignable & 2 ? 16 : 0;
						if ((parser.token & 4194304) === 4194304) {
							if (parser.token !== 1077936157) destructible |= 16;
							argument = parseAssignmentExpression(
								parser,
								context,
								inGroup,
								isPattern,
								tokenPos,
								linePos,
								colPos,
								argument
							);
						} else {
							if ((parser.token & 8454144) === 8454144) {
								argument = parseBinaryExpression(
									parser,
									context,
									1,
									tokenPos,
									linePos,
									colPos,
									4,
									token,
									argument
								);
							}
							if (consumeOpt(parser, context | 32768, 22)) {
								argument = parseConditionalExpression(
									parser,
									context,
									argument,
									tokenPos,
									linePos,
									colPos
								);
							}
							destructible |= parser.assignable & 2 ? 16 : 32;
						}
					} else {
						destructible |=
							closingToken === 1074790415 && token !== 1077936157
								? 16
								: parser.destructible;
					}
				} else {
					destructible |= 32;
					argument = parseLeftHandSideExpression(
						parser,
						context,
						1,
						inGroup,
						1,
						parser.tokenPos,
						parser.linePos,
						parser.colPos
					);
					const { token, tokenPos, linePos, colPos } = parser;
					if (
						token === 1077936157 &&
						token !== closingToken &&
						token !== 18
					) {
						if (parser.assignable & 2) report(parser, 24);
						argument = parseAssignmentExpression(
							parser,
							context,
							inGroup,
							isPattern,
							tokenPos,
							linePos,
							colPos,
							argument
						);
						destructible |= 16;
					} else {
						if (token === 18) {
							destructible |= 16;
						} else if (token !== closingToken) {
							argument = parseAssignmentExpression(
								parser,
								context,
								inGroup,
								isPattern,
								tokenPos,
								linePos,
								colPos,
								argument
							);
						}
						destructible |= parser.assignable & 1 ? 32 : 16;
					}
					parser.destructible = destructible;
					if (parser.token !== closingToken && parser.token !== 18)
						report(parser, 156);
					return finishNode(parser, context, start, line, column, {
						type: isPattern ? 'RestElement' : 'SpreadElement',
						argument: argument
					});
				}
				if (parser.token !== closingToken) {
					if (kind & 1) destructible |= isAsync ? 16 : 32;
					if (consumeOpt(parser, context | 32768, 1077936157)) {
						if (destructible & 16) report(parser, 24);
						reinterpretToPattern(parser, argument);
						const right = parseExpression(
							parser,
							context,
							1,
							inGroup,
							parser.tokenPos,
							parser.linePos,
							parser.colPos
						);
						argument = finishNode(
							parser,
							context,
							tokenPos,
							linePos,
							colPos,
							isPattern
								? {
										type: 'AssignmentPattern',
										left: argument,
										right
									}
								: {
										type: 'AssignmentExpression',
										left: argument,
										operator: '=',
										right
									}
						);
						destructible = 16;
					} else {
						destructible |= 16;
					}
				}
				parser.destructible = destructible;
				return finishNode(parser, context, start, line, column, {
					type: isPattern ? 'RestElement' : 'SpreadElement',
					argument: argument
				});
			}
			function parseMethodDefinition(
				parser,
				context,
				kind,
				inGroup,
				start,
				line,
				column
			) {
				const modifierFlags = (kind & 64) === 0 ? 31981568 : 14680064;
				context =
					((context | modifierFlags) ^ modifierFlags) |
					((kind & 88) << 18) |
					100925440;
				let scope =
					context & 64 ? addChildScope(createScope(), 512) : void 0;
				const params = parseMethodFormals(
					parser,
					context | 8388608,
					scope,
					kind,
					1,
					inGroup
				);
				if (scope) scope = addChildScope(scope, 128);
				const body = parseFunctionBody(
					parser,
					context & ~(0x8001000 | 8192),
					scope,
					0,
					void 0,
					void 0
				);
				return finishNode(parser, context, start, line, column, {
					type: 'FunctionExpression',
					params,
					body,
					async: (kind & 16) > 0,
					generator: (kind & 8) > 0,
					id: null
				});
			}
			function parseObjectLiteral(
				parser,
				context,
				skipInitializer,
				inGroup,
				start,
				line,
				column
			) {
				const expr = parseObjectLiteralOrPattern(
					parser,
					context,
					void 0,
					skipInitializer,
					inGroup,
					0,
					2,
					0,
					start,
					line,
					column
				);
				if (context & 256 && parser.destructible & 64) {
					report(parser, 61);
				}
				if (parser.destructible & 8) {
					report(parser, 60);
				}
				return expr;
			}
			function parseObjectLiteralOrPattern(
				parser,
				context,
				scope,
				skipInitializer,
				inGroup,
				isPattern,
				kind,
				origin,
				start,
				line,
				column
			) {
				nextToken(parser, context);
				const properties = [];
				let destructible = 0;
				let prototypeCount = 0;
				context = (context | 134217728) ^ 134217728;
				while (parser.token !== 1074790415) {
					const { token, tokenValue, linePos, colPos, tokenPos } =
						parser;
					if (token === 14) {
						properties.push(
							parseSpreadOrRestElement(
								parser,
								context,
								scope,
								1074790415,
								kind,
								origin,
								0,
								inGroup,
								isPattern,
								tokenPos,
								linePos,
								colPos
							)
						);
					} else {
						let state = 0;
						let key = null;
						let value;
						const t = parser.token;
						if (
							parser.token & (143360 | 4096) ||
							parser.token === 121
						) {
							key = parseIdentifier(parser, context);
							if (
								parser.token === 18 ||
								parser.token === 1074790415 ||
								parser.token === 1077936157
							) {
								state |= 4;
								if (
									context & 1024 &&
									(token & 537079808) === 537079808
								) {
									destructible |= 16;
								} else {
									validateBindingIdentifier(
										parser,
										context,
										kind,
										token,
										0
									);
								}
								if (scope)
									addVarOrBlock(
										parser,
										context,
										scope,
										tokenValue,
										kind,
										origin
									);
								if (
									consumeOpt(
										parser,
										context | 32768,
										1077936157
									)
								) {
									destructible |= 8;
									const right = parseExpression(
										parser,
										context,
										1,
										inGroup,
										parser.tokenPos,
										parser.linePos,
										parser.colPos
									);
									destructible |=
										parser.destructible & 256
											? 256
											: 0 | (parser.destructible & 128)
												? 128
												: 0;
									value = finishNode(
										parser,
										context,
										tokenPos,
										linePos,
										colPos,
										{
											type: 'AssignmentPattern',
											left:
												context & 536870912
													? Object.assign({}, key)
													: key,
											right
										}
									);
								} else {
									destructible |=
										(token === 209008 ? 128 : 0) |
										(token === 121 ? 16 : 0);
									value =
										context & 536870912
											? Object.assign({}, key)
											: key;
								}
							} else if (
								consumeOpt(parser, context | 32768, 21)
							) {
								const { tokenPos, linePos, colPos } = parser;
								if (tokenValue === '__proto__')
									prototypeCount++;
								if (parser.token & 143360) {
									const tokenAfterColon = parser.token;
									const valueAfterColon = parser.tokenValue;
									destructible |= t === 121 ? 16 : 0;
									value = parsePrimaryExpression(
										parser,
										context,
										kind,
										0,
										1,
										inGroup,
										1,
										tokenPos,
										linePos,
										colPos
									);
									const { token } = parser;
									value = parseMemberOrUpdateExpression(
										parser,
										context,
										value,
										inGroup,
										0,
										tokenPos,
										linePos,
										colPos
									);
									if (
										parser.token === 18 ||
										parser.token === 1074790415
									) {
										if (
											token === 1077936157 ||
											token === 1074790415 ||
											token === 18
										) {
											destructible |=
												parser.destructible & 128
													? 128
													: 0;
											if (parser.assignable & 2) {
												destructible |= 16;
											} else if (
												scope &&
												(tokenAfterColon & 143360) ===
													143360
											) {
												addVarOrBlock(
													parser,
													context,
													scope,
													valueAfterColon,
													kind,
													origin
												);
											}
										} else {
											destructible |=
												parser.assignable & 1 ? 32 : 16;
										}
									} else if (
										(parser.token & 4194304) ===
										4194304
									) {
										if (parser.assignable & 2) {
											destructible |= 16;
										} else if (token !== 1077936157) {
											destructible |= 32;
										} else if (scope) {
											addVarOrBlock(
												parser,
												context,
												scope,
												valueAfterColon,
												kind,
												origin
											);
										}
										value = parseAssignmentExpression(
											parser,
											context,
											inGroup,
											isPattern,
											tokenPos,
											linePos,
											colPos,
											value
										);
									} else {
										destructible |= 16;
										if (
											(parser.token & 8454144) ===
											8454144
										) {
											value = parseBinaryExpression(
												parser,
												context,
												1,
												tokenPos,
												linePos,
												colPos,
												4,
												token,
												value
											);
										}
										if (
											consumeOpt(
												parser,
												context | 32768,
												22
											)
										) {
											value = parseConditionalExpression(
												parser,
												context,
												value,
												tokenPos,
												linePos,
												colPos
											);
										}
									}
								} else if (
									(parser.token & 2097152) ===
									2097152
								) {
									value =
										parser.token === 69271571
											? parseArrayExpressionOrPattern(
													parser,
													context,
													scope,
													0,
													inGroup,
													isPattern,
													kind,
													origin,
													tokenPos,
													linePos,
													colPos
												)
											: parseObjectLiteralOrPattern(
													parser,
													context,
													scope,
													0,
													inGroup,
													isPattern,
													kind,
													origin,
													tokenPos,
													linePos,
													colPos
												);
									destructible = parser.destructible;
									parser.assignable =
										destructible & 16 ? 2 : 1;
									if (
										parser.token === 18 ||
										parser.token === 1074790415
									) {
										if (parser.assignable & 2)
											destructible |= 16;
									} else if (parser.destructible & 8) {
										report(parser, 69);
									} else {
										value = parseMemberOrUpdateExpression(
											parser,
											context,
											value,
											inGroup,
											0,
											tokenPos,
											linePos,
											colPos
										);
										destructible =
											parser.assignable & 2 ? 16 : 0;
										if (
											(parser.token & 4194304) ===
											4194304
										) {
											value =
												parseAssignmentExpressionOrPattern(
													parser,
													context,
													inGroup,
													isPattern,
													tokenPos,
													linePos,
													colPos,
													value
												);
										} else {
											if (
												(parser.token & 8454144) ===
												8454144
											) {
												value = parseBinaryExpression(
													parser,
													context,
													1,
													tokenPos,
													linePos,
													colPos,
													4,
													token,
													value
												);
											}
											if (
												consumeOpt(
													parser,
													context | 32768,
													22
												)
											) {
												value =
													parseConditionalExpression(
														parser,
														context,
														value,
														tokenPos,
														linePos,
														colPos
													);
											}
											destructible |=
												parser.assignable & 2 ? 16 : 32;
										}
									}
								} else {
									value = parseLeftHandSideExpression(
										parser,
										context,
										1,
										inGroup,
										1,
										tokenPos,
										linePos,
										colPos
									);
									destructible |=
										parser.assignable & 1 ? 32 : 16;
									if (
										parser.token === 18 ||
										parser.token === 1074790415
									) {
										if (parser.assignable & 2)
											destructible |= 16;
									} else {
										value = parseMemberOrUpdateExpression(
											parser,
											context,
											value,
											inGroup,
											0,
											tokenPos,
											linePos,
											colPos
										);
										destructible =
											parser.assignable & 2 ? 16 : 0;
										if (
											parser.token !== 18 &&
											token !== 1074790415
										) {
											if (parser.token !== 1077936157)
												destructible |= 16;
											value = parseAssignmentExpression(
												parser,
												context,
												inGroup,
												isPattern,
												tokenPos,
												linePos,
												colPos,
												value
											);
										}
									}
								}
							} else if (parser.token === 69271571) {
								destructible |= 16;
								if (token === 209007) state |= 16;
								state |=
									(token === 12402
										? 256
										: token === 12403
											? 512
											: 1) | 2;
								key = parseComputedPropertyName(
									parser,
									context,
									inGroup
								);
								destructible |= parser.assignable;
								value = parseMethodDefinition(
									parser,
									context,
									state,
									inGroup,
									parser.tokenPos,
									parser.linePos,
									parser.colPos
								);
							} else if (parser.token & (143360 | 4096)) {
								destructible |= 16;
								if (token === 121) report(parser, 93);
								if (token === 209007) {
									if (parser.flags & 1) report(parser, 129);
									state |= 16;
								}
								key = parseIdentifier(parser, context);
								state |=
									token === 12402
										? 256
										: token === 12403
											? 512
											: 1;
								value = parseMethodDefinition(
									parser,
									context,
									state,
									inGroup,
									parser.tokenPos,
									parser.linePos,
									parser.colPos
								);
							} else if (parser.token === 67174411) {
								destructible |= 16;
								state |= 1;
								value = parseMethodDefinition(
									parser,
									context,
									state,
									inGroup,
									parser.tokenPos,
									parser.linePos,
									parser.colPos
								);
							} else if (parser.token === 8457014) {
								destructible |= 16;
								if (token === 12402) {
									report(parser, 40);
								} else if (token === 12403) {
									report(parser, 41);
								} else if (token === 143483) {
									report(parser, 93);
								}
								nextToken(parser, context);
								state |= 8 | 1 | (token === 209007 ? 16 : 0);
								if (parser.token & 143360) {
									key = parseIdentifier(parser, context);
								} else if (
									(parser.token & 134217728) ===
									134217728
								) {
									key = parseLiteral(parser, context);
								} else if (parser.token === 69271571) {
									state |= 2;
									key = parseComputedPropertyName(
										parser,
										context,
										inGroup
									);
									destructible |= parser.assignable;
								} else {
									report(
										parser,
										28,
										KeywordDescTable[parser.token & 255]
									);
								}
								value = parseMethodDefinition(
									parser,
									context,
									state,
									inGroup,
									parser.tokenPos,
									parser.linePos,
									parser.colPos
								);
							} else if (
								(parser.token & 134217728) ===
								134217728
							) {
								if (token === 209007) state |= 16;
								state |=
									token === 12402
										? 256
										: token === 12403
											? 512
											: 1;
								destructible |= 16;
								key = parseLiteral(parser, context);
								value = parseMethodDefinition(
									parser,
									context,
									state,
									inGroup,
									parser.tokenPos,
									parser.linePos,
									parser.colPos
								);
							} else {
								report(parser, 130);
							}
						} else if ((parser.token & 134217728) === 134217728) {
							key = parseLiteral(parser, context);
							if (parser.token === 21) {
								consume(parser, context | 32768, 21);
								const { tokenPos, linePos, colPos } = parser;
								if (tokenValue === '__proto__')
									prototypeCount++;
								if (parser.token & 143360) {
									value = parsePrimaryExpression(
										parser,
										context,
										kind,
										0,
										1,
										inGroup,
										1,
										tokenPos,
										linePos,
										colPos
									);
									const {
										token,
										tokenValue: valueAfterColon
									} = parser;
									value = parseMemberOrUpdateExpression(
										parser,
										context,
										value,
										inGroup,
										0,
										tokenPos,
										linePos,
										colPos
									);
									if (
										parser.token === 18 ||
										parser.token === 1074790415
									) {
										if (
											token === 1077936157 ||
											token === 1074790415 ||
											token === 18
										) {
											if (parser.assignable & 2) {
												destructible |= 16;
											} else if (scope) {
												addVarOrBlock(
													parser,
													context,
													scope,
													valueAfterColon,
													kind,
													origin
												);
											}
										} else {
											destructible |=
												parser.assignable & 1 ? 32 : 16;
										}
									} else if (parser.token === 1077936157) {
										if (parser.assignable & 2)
											destructible |= 16;
										value = parseAssignmentExpression(
											parser,
											context,
											inGroup,
											isPattern,
											tokenPos,
											linePos,
											colPos,
											value
										);
									} else {
										destructible |= 16;
										value = parseAssignmentExpression(
											parser,
											context,
											inGroup,
											isPattern,
											tokenPos,
											linePos,
											colPos,
											value
										);
									}
								} else if (
									(parser.token & 2097152) ===
									2097152
								) {
									value =
										parser.token === 69271571
											? parseArrayExpressionOrPattern(
													parser,
													context,
													scope,
													0,
													inGroup,
													isPattern,
													kind,
													origin,
													tokenPos,
													linePos,
													colPos
												)
											: parseObjectLiteralOrPattern(
													parser,
													context,
													scope,
													0,
													inGroup,
													isPattern,
													kind,
													origin,
													tokenPos,
													linePos,
													colPos
												);
									destructible = parser.destructible;
									parser.assignable =
										destructible & 16 ? 2 : 1;
									if (
										parser.token === 18 ||
										parser.token === 1074790415
									) {
										if (parser.assignable & 2) {
											destructible |= 16;
										}
									} else if (
										(parser.destructible & 8) !==
										8
									) {
										value = parseMemberOrUpdateExpression(
											parser,
											context,
											value,
											inGroup,
											0,
											tokenPos,
											linePos,
											colPos
										);
										destructible =
											parser.assignable & 2 ? 16 : 0;
										if (
											(parser.token & 4194304) ===
											4194304
										) {
											value =
												parseAssignmentExpressionOrPattern(
													parser,
													context,
													inGroup,
													isPattern,
													tokenPos,
													linePos,
													colPos,
													value
												);
										} else {
											if (
												(parser.token & 8454144) ===
												8454144
											) {
												value = parseBinaryExpression(
													parser,
													context,
													1,
													tokenPos,
													linePos,
													colPos,
													4,
													token,
													value
												);
											}
											if (
												consumeOpt(
													parser,
													context | 32768,
													22
												)
											) {
												value =
													parseConditionalExpression(
														parser,
														context,
														value,
														tokenPos,
														linePos,
														colPos
													);
											}
											destructible |=
												parser.assignable & 2 ? 16 : 32;
										}
									}
								} else {
									value = parseLeftHandSideExpression(
										parser,
										context,
										1,
										0,
										1,
										tokenPos,
										linePos,
										colPos
									);
									destructible |=
										parser.assignable & 1 ? 32 : 16;
									if (
										parser.token === 18 ||
										parser.token === 1074790415
									) {
										if (parser.assignable & 2) {
											destructible |= 16;
										}
									} else {
										value = parseMemberOrUpdateExpression(
											parser,
											context,
											value,
											inGroup,
											0,
											tokenPos,
											linePos,
											colPos
										);
										destructible =
											parser.assignable & 1 ? 0 : 16;
										if (
											parser.token !== 18 &&
											parser.token !== 1074790415
										) {
											if (parser.token !== 1077936157)
												destructible |= 16;
											value = parseAssignmentExpression(
												parser,
												context,
												inGroup,
												isPattern,
												tokenPos,
												linePos,
												colPos,
												value
											);
										}
									}
								}
							} else if (parser.token === 67174411) {
								state |= 1;
								value = parseMethodDefinition(
									parser,
									context,
									state,
									inGroup,
									parser.tokenPos,
									parser.linePos,
									parser.colPos
								);
								destructible = parser.assignable | 16;
							} else {
								report(parser, 131);
							}
						} else if (parser.token === 69271571) {
							key = parseComputedPropertyName(
								parser,
								context,
								inGroup
							);
							destructible |= parser.destructible & 256 ? 256 : 0;
							state |= 2;
							if (parser.token === 21) {
								nextToken(parser, context | 32768);
								const {
									tokenPos,
									linePos,
									colPos,
									tokenValue,
									token: tokenAfterColon
								} = parser;
								if (parser.token & 143360) {
									value = parsePrimaryExpression(
										parser,
										context,
										kind,
										0,
										1,
										inGroup,
										1,
										tokenPos,
										linePos,
										colPos
									);
									const { token } = parser;
									value = parseMemberOrUpdateExpression(
										parser,
										context,
										value,
										inGroup,
										0,
										tokenPos,
										linePos,
										colPos
									);
									if ((parser.token & 4194304) === 4194304) {
										destructible |=
											parser.assignable & 2
												? 16
												: token === 1077936157
													? 0
													: 32;
										value =
											parseAssignmentExpressionOrPattern(
												parser,
												context,
												inGroup,
												isPattern,
												tokenPos,
												linePos,
												colPos,
												value
											);
									} else if (
										parser.token === 18 ||
										parser.token === 1074790415
									) {
										if (
											token === 1077936157 ||
											token === 1074790415 ||
											token === 18
										) {
											if (parser.assignable & 2) {
												destructible |= 16;
											} else if (
												scope &&
												(tokenAfterColon & 143360) ===
													143360
											) {
												addVarOrBlock(
													parser,
													context,
													scope,
													tokenValue,
													kind,
													origin
												);
											}
										} else {
											destructible |=
												parser.assignable & 1 ? 32 : 16;
										}
									} else {
										destructible |= 16;
										value = parseAssignmentExpression(
											parser,
											context,
											inGroup,
											isPattern,
											tokenPos,
											linePos,
											colPos,
											value
										);
									}
								} else if (
									(parser.token & 2097152) ===
									2097152
								) {
									value =
										parser.token === 69271571
											? parseArrayExpressionOrPattern(
													parser,
													context,
													scope,
													0,
													inGroup,
													isPattern,
													kind,
													origin,
													tokenPos,
													linePos,
													colPos
												)
											: parseObjectLiteralOrPattern(
													parser,
													context,
													scope,
													0,
													inGroup,
													isPattern,
													kind,
													origin,
													tokenPos,
													linePos,
													colPos
												);
									destructible = parser.destructible;
									parser.assignable =
										destructible & 16 ? 2 : 1;
									if (
										parser.token === 18 ||
										parser.token === 1074790415
									) {
										if (parser.assignable & 2)
											destructible |= 16;
									} else if (destructible & 8) {
										report(parser, 60);
									} else {
										value = parseMemberOrUpdateExpression(
											parser,
											context,
											value,
											inGroup,
											0,
											tokenPos,
											linePos,
											colPos
										);
										destructible =
											parser.assignable & 2
												? destructible | 16
												: 0;
										if (
											(parser.token & 4194304) ===
											4194304
										) {
											if (parser.token !== 1077936157)
												destructible |= 16;
											value =
												parseAssignmentExpressionOrPattern(
													parser,
													context,
													inGroup,
													isPattern,
													tokenPos,
													linePos,
													colPos,
													value
												);
										} else {
											if (
												(parser.token & 8454144) ===
												8454144
											) {
												value = parseBinaryExpression(
													parser,
													context,
													1,
													tokenPos,
													linePos,
													colPos,
													4,
													token,
													value
												);
											}
											if (
												consumeOpt(
													parser,
													context | 32768,
													22
												)
											) {
												value =
													parseConditionalExpression(
														parser,
														context,
														value,
														tokenPos,
														linePos,
														colPos
													);
											}
											destructible |=
												parser.assignable & 2 ? 16 : 32;
										}
									}
								} else {
									value = parseLeftHandSideExpression(
										parser,
										context,
										1,
										0,
										1,
										tokenPos,
										linePos,
										colPos
									);
									destructible |=
										parser.assignable & 1 ? 32 : 16;
									if (
										parser.token === 18 ||
										parser.token === 1074790415
									) {
										if (parser.assignable & 2)
											destructible |= 16;
									} else {
										value = parseMemberOrUpdateExpression(
											parser,
											context,
											value,
											inGroup,
											0,
											tokenPos,
											linePos,
											colPos
										);
										destructible =
											parser.assignable & 1 ? 0 : 16;
										if (
											parser.token !== 18 &&
											parser.token !== 1074790415
										) {
											if (parser.token !== 1077936157)
												destructible |= 16;
											value = parseAssignmentExpression(
												parser,
												context,
												inGroup,
												isPattern,
												tokenPos,
												linePos,
												colPos,
												value
											);
										}
									}
								}
							} else if (parser.token === 67174411) {
								state |= 1;
								value = parseMethodDefinition(
									parser,
									context,
									state,
									inGroup,
									parser.tokenPos,
									linePos,
									colPos
								);
								destructible = 16;
							} else {
								report(parser, 42);
							}
						} else if (token === 8457014) {
							consume(parser, context | 32768, 8457014);
							state |= 8;
							if (parser.token & 143360) {
								const { token, line, index } = parser;
								key = parseIdentifier(parser, context);
								state |= 1;
								if (parser.token === 67174411) {
									destructible |= 16;
									value = parseMethodDefinition(
										parser,
										context,
										state,
										inGroup,
										parser.tokenPos,
										parser.linePos,
										parser.colPos
									);
								} else {
									reportMessageAt(
										index,
										line,
										index,
										token === 209007
											? 44
											: token === 12402 ||
												  parser.token === 12403
												? 43
												: 45,
										KeywordDescTable[token & 255]
									);
								}
							} else if (
								(parser.token & 134217728) ===
								134217728
							) {
								destructible |= 16;
								key = parseLiteral(parser, context);
								state |= 1;
								value = parseMethodDefinition(
									parser,
									context,
									state,
									inGroup,
									tokenPos,
									linePos,
									colPos
								);
							} else if (parser.token === 69271571) {
								destructible |= 16;
								state |= 2 | 1;
								key = parseComputedPropertyName(
									parser,
									context,
									inGroup
								);
								value = parseMethodDefinition(
									parser,
									context,
									state,
									inGroup,
									parser.tokenPos,
									parser.linePos,
									parser.colPos
								);
							} else {
								report(parser, 123);
							}
						} else {
							report(parser, 28, KeywordDescTable[token & 255]);
						}
						destructible |= parser.destructible & 128 ? 128 : 0;
						parser.destructible = destructible;
						properties.push(
							finishNode(
								parser,
								context,
								tokenPos,
								linePos,
								colPos,
								{
									type: 'Property',
									key: key,
									value,
									kind: !(state & 768)
										? 'init'
										: state & 512
											? 'set'
											: 'get',
									computed: (state & 2) > 0,
									method: (state & 1) > 0,
									shorthand: (state & 4) > 0
								}
							)
						);
					}
					destructible |= parser.destructible;
					if (parser.token !== 18) break;
					nextToken(parser, context);
				}
				consume(parser, context, 1074790415);
				if (prototypeCount > 1) destructible |= 64;
				const node = finishNode(parser, context, start, line, column, {
					type: isPattern ? 'ObjectPattern' : 'ObjectExpression',
					properties
				});
				if (!skipInitializer && parser.token & 4194304) {
					return parseArrayOrObjectAssignmentPattern(
						parser,
						context,
						destructible,
						inGroup,
						isPattern,
						start,
						line,
						column,
						node
					);
				}
				parser.destructible = destructible;
				return node;
			}
			function parseMethodFormals(
				parser,
				context,
				scope,
				kind,
				type,
				inGroup
			) {
				consume(parser, context, 67174411);
				const params = [];
				parser.flags = (parser.flags | 128) ^ 128;
				if (parser.token === 16) {
					if (kind & 512) {
						report(parser, 35, 'Setter', 'one', '');
					}
					nextToken(parser, context);
					return params;
				}
				if (kind & 256) {
					report(parser, 35, 'Getter', 'no', 's');
				}
				if (kind & 512 && parser.token === 14) {
					report(parser, 36);
				}
				context = (context | 134217728) ^ 134217728;
				let setterArgs = 0;
				let isSimpleParameterList = 0;
				while (parser.token !== 18) {
					let left = null;
					const { tokenPos, linePos, colPos } = parser;
					if (parser.token & 143360) {
						if ((context & 1024) === 0) {
							if ((parser.token & 36864) === 36864) {
								parser.flags |= 256;
							}
							if ((parser.token & 537079808) === 537079808) {
								parser.flags |= 512;
							}
						}
						left = parseAndClassifyIdentifier(
							parser,
							context,
							scope,
							kind | 1,
							0,
							tokenPos,
							linePos,
							colPos
						);
					} else {
						if (parser.token === 2162700) {
							left = parseObjectLiteralOrPattern(
								parser,
								context,
								scope,
								1,
								inGroup,
								1,
								type,
								0,
								tokenPos,
								linePos,
								colPos
							);
						} else if (parser.token === 69271571) {
							left = parseArrayExpressionOrPattern(
								parser,
								context,
								scope,
								1,
								inGroup,
								1,
								type,
								0,
								tokenPos,
								linePos,
								colPos
							);
						} else if (parser.token === 14) {
							left = parseSpreadOrRestElement(
								parser,
								context,
								scope,
								16,
								type,
								0,
								0,
								inGroup,
								1,
								tokenPos,
								linePos,
								colPos
							);
						}
						isSimpleParameterList = 1;
						if (parser.destructible & (32 | 16)) report(parser, 48);
					}
					if (parser.token === 1077936157) {
						nextToken(parser, context | 32768);
						isSimpleParameterList = 1;
						const right = parseExpression(
							parser,
							context,
							1,
							0,
							parser.tokenPos,
							parser.linePos,
							parser.colPos
						);
						left = finishNode(
							parser,
							context,
							tokenPos,
							linePos,
							colPos,
							{
								type: 'AssignmentPattern',
								left: left,
								right
							}
						);
					}
					setterArgs++;
					params.push(left);
					if (!consumeOpt(parser, context, 18)) break;
					if (parser.token === 16) {
						break;
					}
				}
				if (kind & 512 && setterArgs !== 1) {
					report(parser, 35, 'Setter', 'one', '');
				}
				if (scope && scope.scopeError !== void 0)
					reportScopeError(scope.scopeError);
				if (isSimpleParameterList) parser.flags |= 128;
				consume(parser, context, 16);
				return params;
			}
			function parseComputedPropertyName(parser, context, inGroup) {
				nextToken(parser, context | 32768);
				const key = parseExpression(
					parser,
					(context | 134217728) ^ 134217728,
					1,
					inGroup,
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				consume(parser, context, 20);
				return key;
			}
			function parseParenthesizedExpression(
				parser,
				context,
				canAssign,
				kind,
				origin,
				start,
				line,
				column
			) {
				parser.flags = (parser.flags | 128) ^ 128;
				const {
					tokenPos: piStart,
					linePos: plStart,
					colPos: pcStart
				} = parser;
				nextToken(parser, context | 32768 | 268435456);
				const scope =
					context & 64 ? addChildScope(createScope(), 1024) : void 0;
				context = (context | 134217728) ^ 134217728;
				if (consumeOpt(parser, context, 16)) {
					return parseParenthesizedArrow(
						parser,
						context,
						scope,
						[],
						canAssign,
						0,
						start,
						line,
						column
					);
				}
				let destructible = 0;
				parser.destructible &= ~(256 | 128);
				let expr;
				let expressions = [];
				let isSequence = 0;
				let isSimpleParameterList = 0;
				const {
					tokenPos: iStart,
					linePos: lStart,
					colPos: cStart
				} = parser;
				parser.assignable = 1;
				while (parser.token !== 16) {
					const { token, tokenPos, linePos, colPos } = parser;
					if (token & (143360 | 4096)) {
						if (scope)
							addBlockName(
								parser,
								context,
								scope,
								parser.tokenValue,
								1,
								0
							);
						expr = parsePrimaryExpression(
							parser,
							context,
							kind,
							0,
							1,
							1,
							1,
							tokenPos,
							linePos,
							colPos
						);
						if (parser.token === 16 || parser.token === 18) {
							if (parser.assignable & 2) {
								destructible |= 16;
								isSimpleParameterList = 1;
							} else if (
								(token & 537079808) === 537079808 ||
								(token & 36864) === 36864
							) {
								isSimpleParameterList = 1;
							}
						} else {
							if (parser.token === 1077936157) {
								isSimpleParameterList = 1;
							} else {
								destructible |= 16;
							}
							expr = parseMemberOrUpdateExpression(
								parser,
								context,
								expr,
								1,
								0,
								tokenPos,
								linePos,
								colPos
							);
							if (parser.token !== 16 && parser.token !== 18) {
								expr = parseAssignmentExpression(
									parser,
									context,
									1,
									0,
									tokenPos,
									linePos,
									colPos,
									expr
								);
							}
						}
					} else if ((token & 2097152) === 2097152) {
						expr =
							token === 2162700
								? parseObjectLiteralOrPattern(
										parser,
										context | 268435456,
										scope,
										0,
										1,
										0,
										kind,
										origin,
										tokenPos,
										linePos,
										colPos
									)
								: parseArrayExpressionOrPattern(
										parser,
										context | 268435456,
										scope,
										0,
										1,
										0,
										kind,
										origin,
										tokenPos,
										linePos,
										colPos
									);
						destructible |= parser.destructible;
						isSimpleParameterList = 1;
						parser.assignable = 2;
						if (parser.token !== 16 && parser.token !== 18) {
							if (destructible & 8) report(parser, 119);
							expr = parseMemberOrUpdateExpression(
								parser,
								context,
								expr,
								0,
								0,
								tokenPos,
								linePos,
								colPos
							);
							destructible |= 16;
							if (parser.token !== 16 && parser.token !== 18) {
								expr = parseAssignmentExpression(
									parser,
									context,
									0,
									0,
									tokenPos,
									linePos,
									colPos,
									expr
								);
							}
						}
					} else if (token === 14) {
						expr = parseSpreadOrRestElement(
							parser,
							context,
							scope,
							16,
							kind,
							origin,
							0,
							1,
							0,
							tokenPos,
							linePos,
							colPos
						);
						if (parser.destructible & 16) report(parser, 72);
						isSimpleParameterList = 1;
						if (
							isSequence &&
							(parser.token === 16 || parser.token === 18)
						) {
							expressions.push(expr);
						}
						destructible |= 8;
						break;
					} else {
						destructible |= 16;
						expr = parseExpression(
							parser,
							context,
							1,
							1,
							tokenPos,
							linePos,
							colPos
						);
						if (
							isSequence &&
							(parser.token === 16 || parser.token === 18)
						) {
							expressions.push(expr);
						}
						if (parser.token === 18) {
							if (!isSequence) {
								isSequence = 1;
								expressions = [expr];
							}
						}
						if (isSequence) {
							while (consumeOpt(parser, context | 32768, 18)) {
								expressions.push(
									parseExpression(
										parser,
										context,
										1,
										1,
										parser.tokenPos,
										parser.linePos,
										parser.colPos
									)
								);
							}
							parser.assignable = 2;
							expr = finishNode(
								parser,
								context,
								iStart,
								lStart,
								cStart,
								{
									type: 'SequenceExpression',
									expressions
								}
							);
						}
						consume(parser, context, 16);
						parser.destructible = destructible;
						return expr;
					}
					if (
						isSequence &&
						(parser.token === 16 || parser.token === 18)
					) {
						expressions.push(expr);
					}
					if (!consumeOpt(parser, context | 32768, 18)) break;
					if (!isSequence) {
						isSequence = 1;
						expressions = [expr];
					}
					if (parser.token === 16) {
						destructible |= 8;
						break;
					}
				}
				if (isSequence) {
					parser.assignable = 2;
					expr = finishNode(parser, context, iStart, lStart, cStart, {
						type: 'SequenceExpression',
						expressions
					});
				}
				consume(parser, context, 16);
				if (destructible & 16 && destructible & 8) report(parser, 146);
				destructible |=
					parser.destructible & 256
						? 256
						: 0 | (parser.destructible & 128)
							? 128
							: 0;
				if (parser.token === 10) {
					if (destructible & (32 | 16)) report(parser, 47);
					if (context & (4194304 | 2048) && destructible & 128)
						report(parser, 29);
					if (context & (1024 | 2097152) && destructible & 256) {
						report(parser, 30);
					}
					if (isSimpleParameterList) parser.flags |= 128;
					return parseParenthesizedArrow(
						parser,
						context,
						scope,
						isSequence ? expressions : [expr],
						canAssign,
						0,
						start,
						line,
						column
					);
				} else if (destructible & 8) {
					report(parser, 140);
				}
				parser.destructible =
					((parser.destructible | 256) ^ 256) | destructible;
				return context & 128
					? finishNode(parser, context, piStart, plStart, pcStart, {
							type: 'ParenthesizedExpression',
							expression: expr
						})
					: expr;
			}
			function parseIdentifierOrArrow(
				parser,
				context,
				start,
				line,
				column
			) {
				const { tokenValue } = parser;
				const expr = parseIdentifier(parser, context);
				parser.assignable = 1;
				if (parser.token === 10) {
					let scope = void 0;
					if (context & 64)
						scope = createArrowHeadParsingScope(
							parser,
							context,
							tokenValue
						);
					parser.flags = (parser.flags | 128) ^ 128;
					return parseArrowFunctionExpression(
						parser,
						context,
						scope,
						[expr],
						0,
						start,
						line,
						column
					);
				}
				return expr;
			}
			function parseArrowFromIdentifier(
				parser,
				context,
				value,
				expr,
				inNew,
				canAssign,
				isAsync,
				start,
				line,
				column
			) {
				if (!canAssign) report(parser, 55);
				if (inNew) report(parser, 49);
				parser.flags &= ~128;
				const scope =
					context & 64
						? createArrowHeadParsingScope(parser, context, value)
						: void 0;
				return parseArrowFunctionExpression(
					parser,
					context,
					scope,
					[expr],
					isAsync,
					start,
					line,
					column
				);
			}
			function parseParenthesizedArrow(
				parser,
				context,
				scope,
				params,
				canAssign,
				isAsync,
				start,
				line,
				column
			) {
				if (!canAssign) report(parser, 55);
				for (let i = 0; i < params.length; ++i)
					reinterpretToPattern(parser, params[i]);
				return parseArrowFunctionExpression(
					parser,
					context,
					scope,
					params,
					isAsync,
					start,
					line,
					column
				);
			}
			function parseArrowFunctionExpression(
				parser,
				context,
				scope,
				params,
				isAsync,
				start,
				line,
				column
			) {
				if (parser.flags & 1) report(parser, 46);
				consume(parser, context | 32768, 10);
				context = ((context | 15728640) ^ 15728640) | (isAsync << 22);
				const expression = parser.token !== 2162700;
				let body;
				if (scope && scope.scopeError !== void 0) {
					reportScopeError(scope.scopeError);
				}
				if (expression) {
					body = parseExpression(
						parser,
						context & 16384 ? context | 33554432 : context,
						1,
						0,
						parser.tokenPos,
						parser.linePos,
						parser.colPos
					);
				} else {
					if (scope) scope = addChildScope(scope, 128);
					body = parseFunctionBody(
						parser,
						(context | 134221824 | 8192 | 16384) ^
							(134221824 | 8192 | 16384),
						scope,
						16,
						void 0,
						void 0
					);
					switch (parser.token) {
						case 69271571:
							if ((parser.flags & 1) === 0) {
								report(parser, 113);
							}
							break;
						case 67108877:
						case 67174409:
						case 22:
							report(parser, 114);
						case 67174411:
							if ((parser.flags & 1) === 0) {
								report(parser, 113);
							}
							parser.flags |= 1024;
							break;
					}
					if (
						(parser.token & 8454144) === 8454144 &&
						(parser.flags & 1) === 0
					)
						report(
							parser,
							28,
							KeywordDescTable[parser.token & 255]
						);
					if ((parser.token & 33619968) === 33619968)
						report(parser, 122);
				}
				parser.assignable = 2;
				return finishNode(parser, context, start, line, column, {
					type: 'ArrowFunctionExpression',
					params,
					body,
					async: isAsync === 1,
					expression
				});
			}
			function parseFormalParametersOrFormalList(
				parser,
				context,
				scope,
				inGroup,
				kind
			) {
				consume(parser, context, 67174411);
				parser.flags = (parser.flags | 128) ^ 128;
				const params = [];
				if (consumeOpt(parser, context, 16)) return params;
				context = (context | 134217728) ^ 134217728;
				let isSimpleParameterList = 0;
				while (parser.token !== 18) {
					let left;
					const { tokenPos, linePos, colPos } = parser;
					if (parser.token & 143360) {
						if ((context & 1024) === 0) {
							if ((parser.token & 36864) === 36864) {
								parser.flags |= 256;
							}
							if ((parser.token & 537079808) === 537079808) {
								parser.flags |= 512;
							}
						}
						left = parseAndClassifyIdentifier(
							parser,
							context,
							scope,
							kind | 1,
							0,
							tokenPos,
							linePos,
							colPos
						);
					} else {
						if (parser.token === 2162700) {
							left = parseObjectLiteralOrPattern(
								parser,
								context,
								scope,
								1,
								inGroup,
								1,
								kind,
								0,
								tokenPos,
								linePos,
								colPos
							);
						} else if (parser.token === 69271571) {
							left = parseArrayExpressionOrPattern(
								parser,
								context,
								scope,
								1,
								inGroup,
								1,
								kind,
								0,
								tokenPos,
								linePos,
								colPos
							);
						} else if (parser.token === 14) {
							left = parseSpreadOrRestElement(
								parser,
								context,
								scope,
								16,
								kind,
								0,
								0,
								inGroup,
								1,
								tokenPos,
								linePos,
								colPos
							);
						} else {
							report(
								parser,
								28,
								KeywordDescTable[parser.token & 255]
							);
						}
						isSimpleParameterList = 1;
						if (parser.destructible & (32 | 16)) {
							report(parser, 48);
						}
					}
					if (parser.token === 1077936157) {
						nextToken(parser, context | 32768);
						isSimpleParameterList = 1;
						const right = parseExpression(
							parser,
							context,
							1,
							inGroup,
							parser.tokenPos,
							parser.linePos,
							parser.colPos
						);
						left = finishNode(
							parser,
							context,
							tokenPos,
							linePos,
							colPos,
							{
								type: 'AssignmentPattern',
								left,
								right
							}
						);
					}
					params.push(left);
					if (!consumeOpt(parser, context, 18)) break;
					if (parser.token === 16) {
						break;
					}
				}
				if (isSimpleParameterList) parser.flags |= 128;
				if (
					scope &&
					(isSimpleParameterList || context & 1024) &&
					scope.scopeError !== void 0
				) {
					reportScopeError(scope.scopeError);
				}
				consume(parser, context, 16);
				return params;
			}
			function parseMembeExpressionNoCall(
				parser,
				context,
				expr,
				inGroup,
				start,
				line,
				column
			) {
				const { token } = parser;
				if (token & 67108864) {
					if (token === 67108877) {
						nextToken(parser, context | 268435456);
						parser.assignable = 1;
						const property = parsePropertyOrPrivatePropertyName(
							parser,
							context
						);
						return parseMembeExpressionNoCall(
							parser,
							context,
							finishNode(parser, context, start, line, column, {
								type: 'MemberExpression',
								object: expr,
								computed: false,
								property
							}),
							0,
							start,
							line,
							column
						);
					} else if (token === 69271571) {
						nextToken(parser, context | 32768);
						const { tokenPos, linePos, colPos } = parser;
						const property = parseExpressions(
							parser,
							context,
							inGroup,
							1,
							tokenPos,
							linePos,
							colPos
						);
						consume(parser, context, 20);
						parser.assignable = 1;
						return parseMembeExpressionNoCall(
							parser,
							context,
							finishNode(parser, context, start, line, column, {
								type: 'MemberExpression',
								object: expr,
								computed: true,
								property
							}),
							0,
							start,
							line,
							column
						);
					} else if (token === 67174408 || token === 67174409) {
						parser.assignable = 2;
						return parseMembeExpressionNoCall(
							parser,
							context,
							finishNode(parser, context, start, line, column, {
								type: 'TaggedTemplateExpression',
								tag: expr,
								quasi:
									parser.token === 67174408
										? parseTemplate(parser, context | 65536)
										: parseTemplateLiteral(
												parser,
												context,
												parser.tokenPos,
												parser.linePos,
												parser.colPos
											)
							}),
							0,
							start,
							line,
							column
						);
					}
				}
				return expr;
			}
			function parseNewExpression(
				parser,
				context,
				inGroup,
				start,
				line,
				column
			) {
				const id = parseIdentifier(parser, context | 32768);
				const { tokenPos, linePos, colPos } = parser;
				if (consumeOpt(parser, context, 67108877)) {
					if (context & 67108864 && parser.token === 143494) {
						parser.assignable = 2;
						return parseMetaProperty(
							parser,
							context,
							id,
							start,
							line,
							column
						);
					}
					report(parser, 92);
				}
				parser.assignable = 2;
				if ((parser.token & 16842752) === 16842752) {
					report(parser, 63, KeywordDescTable[parser.token & 255]);
				}
				const expr = parsePrimaryExpression(
					parser,
					context,
					2,
					1,
					0,
					inGroup,
					1,
					tokenPos,
					linePos,
					colPos
				);
				context = (context | 134217728) ^ 134217728;
				if (parser.token === 67108991) report(parser, 163);
				const callee = parseMembeExpressionNoCall(
					parser,
					context,
					expr,
					inGroup,
					tokenPos,
					linePos,
					colPos
				);
				parser.assignable = 2;
				return finishNode(parser, context, start, line, column, {
					type: 'NewExpression',
					callee,
					arguments:
						parser.token === 67174411
							? parseArguments(parser, context, inGroup)
							: []
				});
			}
			function parseMetaProperty(
				parser,
				context,
				meta,
				start,
				line,
				column
			) {
				const property = parseIdentifier(parser, context);
				return finishNode(parser, context, start, line, column, {
					type: 'MetaProperty',
					meta,
					property
				});
			}
			function parseAsyncArrowAfterIdent(
				parser,
				context,
				canAssign,
				start,
				line,
				column
			) {
				if (parser.token === 209008) report(parser, 29);
				if (context & (1024 | 2097152) && parser.token === 241773) {
					report(parser, 30);
				}
				if ((parser.token & 537079808) === 537079808) {
					parser.flags |= 512;
				}
				return parseArrowFromIdentifier(
					parser,
					context,
					parser.tokenValue,
					parseIdentifier(parser, context),
					0,
					canAssign,
					1,
					start,
					line,
					column
				);
			}
			function parseAsyncArrowOrCallExpression(
				parser,
				context,
				callee,
				canAssign,
				kind,
				origin,
				flags,
				start,
				line,
				column
			) {
				nextToken(parser, context | 32768);
				const scope =
					context & 64 ? addChildScope(createScope(), 1024) : void 0;
				context = (context | 134217728) ^ 134217728;
				if (consumeOpt(parser, context, 16)) {
					if (parser.token === 10) {
						if (flags & 1) report(parser, 46);
						return parseParenthesizedArrow(
							parser,
							context,
							scope,
							[],
							canAssign,
							1,
							start,
							line,
							column
						);
					}
					return finishNode(parser, context, start, line, column, {
						type: 'CallExpression',
						callee,
						arguments: []
					});
				}
				let destructible = 0;
				let expr = null;
				let isSimpleParameterList = 0;
				parser.destructible =
					(parser.destructible | 256 | 128) ^ (256 | 128);
				const params = [];
				while (parser.token !== 16) {
					const { token, tokenPos, linePos, colPos } = parser;
					if (token & (143360 | 4096)) {
						if (scope)
							addBlockName(
								parser,
								context,
								scope,
								parser.tokenValue,
								kind,
								0
							);
						expr = parsePrimaryExpression(
							parser,
							context,
							kind,
							0,
							1,
							1,
							1,
							tokenPos,
							linePos,
							colPos
						);
						if (parser.token === 16 || parser.token === 18) {
							if (parser.assignable & 2) {
								destructible |= 16;
								isSimpleParameterList = 1;
							} else if ((token & 537079808) === 537079808) {
								parser.flags |= 512;
							} else if ((token & 36864) === 36864) {
								parser.flags |= 256;
							}
						} else {
							if (parser.token === 1077936157) {
								isSimpleParameterList = 1;
							} else {
								destructible |= 16;
							}
							expr = parseMemberOrUpdateExpression(
								parser,
								context,
								expr,
								1,
								0,
								tokenPos,
								linePos,
								colPos
							);
							if (parser.token !== 16 && parser.token !== 18) {
								expr = parseAssignmentExpression(
									parser,
									context,
									1,
									0,
									tokenPos,
									linePos,
									colPos,
									expr
								);
							}
						}
					} else if (token & 2097152) {
						expr =
							token === 2162700
								? parseObjectLiteralOrPattern(
										parser,
										context,
										scope,
										0,
										1,
										0,
										kind,
										origin,
										tokenPos,
										linePos,
										colPos
									)
								: parseArrayExpressionOrPattern(
										parser,
										context,
										scope,
										0,
										1,
										0,
										kind,
										origin,
										tokenPos,
										linePos,
										colPos
									);
						destructible |= parser.destructible;
						isSimpleParameterList = 1;
						if (parser.token !== 16 && parser.token !== 18) {
							if (destructible & 8) report(parser, 119);
							expr = parseMemberOrUpdateExpression(
								parser,
								context,
								expr,
								0,
								0,
								tokenPos,
								linePos,
								colPos
							);
							destructible |= 16;
							if ((parser.token & 8454144) === 8454144) {
								expr = parseBinaryExpression(
									parser,
									context,
									1,
									start,
									line,
									column,
									4,
									token,
									expr
								);
							}
							if (consumeOpt(parser, context | 32768, 22)) {
								expr = parseConditionalExpression(
									parser,
									context,
									expr,
									start,
									line,
									column
								);
							}
						}
					} else if (token === 14) {
						expr = parseSpreadOrRestElement(
							parser,
							context,
							scope,
							16,
							kind,
							origin,
							1,
							1,
							0,
							tokenPos,
							linePos,
							colPos
						);
						destructible |=
							(parser.token === 16 ? 0 : 16) |
							parser.destructible;
						isSimpleParameterList = 1;
					} else {
						expr = parseExpression(
							parser,
							context,
							1,
							0,
							tokenPos,
							linePos,
							colPos
						);
						destructible = parser.assignable;
						params.push(expr);
						while (consumeOpt(parser, context | 32768, 18)) {
							params.push(
								parseExpression(
									parser,
									context,
									1,
									0,
									tokenPos,
									linePos,
									colPos
								)
							);
						}
						destructible |= parser.assignable;
						consume(parser, context, 16);
						parser.destructible = destructible | 16;
						parser.assignable = 2;
						return finishNode(
							parser,
							context,
							start,
							line,
							column,
							{
								type: 'CallExpression',
								callee,
								arguments: params
							}
						);
					}
					params.push(expr);
					if (!consumeOpt(parser, context | 32768, 18)) break;
				}
				consume(parser, context, 16);
				destructible |=
					parser.destructible & 256
						? 256
						: 0 | (parser.destructible & 128)
							? 128
							: 0;
				if (parser.token === 10) {
					if (destructible & (32 | 16)) report(parser, 25);
					if (parser.flags & 1 || flags & 1) report(parser, 46);
					if (destructible & 128) report(parser, 29);
					if (context & (1024 | 2097152) && destructible & 256)
						report(parser, 30);
					if (isSimpleParameterList) parser.flags |= 128;
					return parseParenthesizedArrow(
						parser,
						context,
						scope,
						params,
						canAssign,
						1,
						start,
						line,
						column
					);
				} else if (destructible & 8) {
					report(parser, 60);
				}
				parser.assignable = 2;
				return finishNode(parser, context, start, line, column, {
					type: 'CallExpression',
					callee,
					arguments: params
				});
			}
			function parseRegExpLiteral(parser, context, start, line, column) {
				const { tokenRaw, tokenRegExp, tokenValue } = parser;
				nextToken(parser, context);
				parser.assignable = 2;
				return context & 512
					? finishNode(parser, context, start, line, column, {
							type: 'Literal',
							value: tokenValue,
							regex: tokenRegExp,
							raw: tokenRaw
						})
					: finishNode(parser, context, start, line, column, {
							type: 'Literal',
							value: tokenValue,
							regex: tokenRegExp
						});
			}
			function parseClassDeclaration(
				parser,
				context,
				scope,
				flags,
				start,
				line,
				column
			) {
				context = (context | 16777216 | 1024) ^ 16777216;
				let decorators = parseDecorators(parser, context);
				if (decorators.length) {
					start = parser.tokenPos;
					line = parser.linePos;
					column = parser.colPos;
				}
				if (parser.leadingDecorators.length) {
					parser.leadingDecorators.push(...decorators);
					decorators = parser.leadingDecorators;
					parser.leadingDecorators = [];
				}
				nextToken(parser, context);
				let id = null;
				let superClass = null;
				const { tokenValue } = parser;
				if (parser.token & 4096 && parser.token !== 20567) {
					if (isStrictReservedWord(parser, context, parser.token)) {
						report(parser, 115);
					}
					if ((parser.token & 537079808) === 537079808) {
						report(parser, 116);
					}
					if (scope) {
						addBlockName(parser, context, scope, tokenValue, 32, 0);
						if (flags) {
							if (flags & 2) {
								declareUnboundVariable(parser, tokenValue);
							}
						}
					}
					id = parseIdentifier(parser, context);
				} else {
					if ((flags & 1) === 0) report(parser, 37, 'Class');
				}
				let inheritedContext = context;
				if (consumeOpt(parser, context | 32768, 20567)) {
					superClass = parseLeftHandSideExpression(
						parser,
						context,
						0,
						0,
						0,
						parser.tokenPos,
						parser.linePos,
						parser.colPos
					);
					inheritedContext |= 524288;
				} else {
					inheritedContext = (inheritedContext | 524288) ^ 524288;
				}
				const body = parseClassBody(
					parser,
					inheritedContext,
					context,
					scope,
					2,
					8,
					0
				);
				return finishNode(
					parser,
					context,
					start,
					line,
					column,
					context & 1
						? {
								type: 'ClassDeclaration',
								id,
								superClass,
								decorators,
								body
							}
						: {
								type: 'ClassDeclaration',
								id,
								superClass,
								body
							}
				);
			}
			function parseClassExpression(
				parser,
				context,
				inGroup,
				start,
				line,
				column
			) {
				let id = null;
				let superClass = null;
				context = (context | 1024 | 16777216) ^ 16777216;
				const decorators = parseDecorators(parser, context);
				if (decorators.length) {
					start = parser.tokenPos;
					line = parser.linePos;
					column = parser.colPos;
				}
				nextToken(parser, context);
				if (parser.token & 4096 && parser.token !== 20567) {
					if (isStrictReservedWord(parser, context, parser.token))
						report(parser, 115);
					if ((parser.token & 537079808) === 537079808) {
						report(parser, 116);
					}
					id = parseIdentifier(parser, context);
				}
				let inheritedContext = context;
				if (consumeOpt(parser, context | 32768, 20567)) {
					superClass = parseLeftHandSideExpression(
						parser,
						context,
						0,
						inGroup,
						0,
						parser.tokenPos,
						parser.linePos,
						parser.colPos
					);
					inheritedContext |= 524288;
				} else {
					inheritedContext = (inheritedContext | 524288) ^ 524288;
				}
				const body = parseClassBody(
					parser,
					inheritedContext,
					context,
					void 0,
					2,
					0,
					inGroup
				);
				parser.assignable = 2;
				return finishNode(
					parser,
					context,
					start,
					line,
					column,
					context & 1
						? {
								type: 'ClassExpression',
								id,
								superClass,
								decorators,
								body
							}
						: {
								type: 'ClassExpression',
								id,
								superClass,
								body
							}
				);
			}
			function parseDecorators(parser, context) {
				const list = [];
				if (context & 1) {
					while (parser.token === 133) {
						list.push(
							parseDecoratorList(
								parser,
								context,
								parser.tokenPos,
								parser.linePos,
								parser.colPos
							)
						);
					}
				}
				return list;
			}
			function parseDecoratorList(parser, context, start, line, column) {
				nextToken(parser, context | 32768);
				let expression = parsePrimaryExpression(
					parser,
					context,
					2,
					0,
					1,
					0,
					1,
					start,
					line,
					column
				);
				expression = parseMemberOrUpdateExpression(
					parser,
					context,
					expression,
					0,
					0,
					start,
					line,
					column
				);
				return finishNode(parser, context, start, line, column, {
					type: 'Decorator',
					expression
				});
			}
			function parseClassBody(
				parser,
				context,
				inheritedContext,
				scope,
				kind,
				origin,
				inGroup
			) {
				const { tokenPos, linePos, colPos } = parser;
				consume(parser, context | 32768, 2162700);
				context = (context | 134217728) ^ 134217728;
				let hasConstr = parser.flags & 32;
				parser.flags = (parser.flags | 32) ^ 32;
				const body = [];
				let decorators;
				while (parser.token !== 1074790415) {
					let length = 0;
					decorators = parseDecorators(parser, context);
					length = decorators.length;
					if (length > 0 && parser.tokenValue === 'constructor') {
						report(parser, 107);
					}
					if (parser.token === 1074790415) report(parser, 106);
					if (consumeOpt(parser, context, 1074790417)) {
						if (length > 0) report(parser, 117);
						continue;
					}
					body.push(
						parseClassElementList(
							parser,
							context,
							scope,
							inheritedContext,
							kind,
							decorators,
							0,
							inGroup,
							parser.tokenPos,
							parser.linePos,
							parser.colPos
						)
					);
				}
				consume(
					parser,
					origin & 8 ? context | 32768 : context,
					1074790415
				);
				parser.flags = (parser.flags & ~32) | hasConstr;
				return finishNode(parser, context, tokenPos, linePos, colPos, {
					type: 'ClassBody',
					body
				});
			}
			function parseClassElementList(
				parser,
				context,
				scope,
				inheritedContext,
				type,
				decorators,
				isStatic,
				inGroup,
				start,
				line,
				column
			) {
				let kind = isStatic ? 32 : 0;
				let key = null;
				const { token, tokenPos, linePos, colPos } = parser;
				if (token & (143360 | 36864)) {
					key = parseIdentifier(parser, context);
					switch (token) {
						case 36972:
							if (
								!isStatic &&
								parser.token !== 67174411 &&
								(parser.token & 1048576) !== 1048576 &&
								parser.token !== 1077936157
							) {
								return parseClassElementList(
									parser,
									context,
									scope,
									inheritedContext,
									type,
									decorators,
									1,
									inGroup,
									start,
									line,
									column
								);
							}
							break;
						case 209007:
							if (
								parser.token !== 67174411 &&
								(parser.flags & 1) === 0
							) {
								if (
									context & 1 &&
									(parser.token & 1073741824) === 1073741824
								) {
									return parsePropertyDefinition(
										parser,
										context,
										key,
										kind,
										decorators,
										tokenPos,
										linePos,
										colPos
									);
								}
								kind |=
									16 |
									(optionalBit(parser, context, 8457014)
										? 8
										: 0);
							}
							break;
						case 12402:
							if (parser.token !== 67174411) {
								if (
									context & 1 &&
									(parser.token & 1073741824) === 1073741824
								) {
									return parsePropertyDefinition(
										parser,
										context,
										key,
										kind,
										decorators,
										tokenPos,
										linePos,
										colPos
									);
								}
								kind |= 256;
							}
							break;
						case 12403:
							if (parser.token !== 67174411) {
								if (
									context & 1 &&
									(parser.token & 1073741824) === 1073741824
								) {
									return parsePropertyDefinition(
										parser,
										context,
										key,
										kind,
										decorators,
										tokenPos,
										linePos,
										colPos
									);
								}
								kind |= 512;
							}
							break;
					}
				} else if (token === 69271571) {
					kind |= 2;
					key = parseComputedPropertyName(
						parser,
						inheritedContext,
						inGroup
					);
				} else if ((token & 134217728) === 134217728) {
					key = parseLiteral(parser, context);
				} else if (token === 8457014) {
					kind |= 8;
					nextToken(parser, context);
				} else if (context & 1 && parser.token === 131) {
					kind |= 4096;
					key = parsePrivateIdentifier(
						parser,
						context | 16384,
						tokenPos,
						linePos,
						colPos
					);
				} else if (
					context & 1 &&
					(parser.token & 1073741824) === 1073741824
				) {
					kind |= 128;
				} else if (isStatic && token === 2162700) {
					return parseStaticBlock(
						parser,
						context,
						scope,
						tokenPos,
						linePos,
						colPos
					);
				} else if (token === 122) {
					key = parseIdentifier(parser, context);
					if (parser.token !== 67174411)
						report(
							parser,
							28,
							KeywordDescTable[parser.token & 255]
						);
				} else {
					report(parser, 28, KeywordDescTable[parser.token & 255]);
				}
				if (kind & (8 | 16 | 768)) {
					if (parser.token & 143360) {
						key = parseIdentifier(parser, context);
					} else if ((parser.token & 134217728) === 134217728) {
						key = parseLiteral(parser, context);
					} else if (parser.token === 69271571) {
						kind |= 2;
						key = parseComputedPropertyName(parser, context, 0);
					} else if (parser.token === 122) {
						key = parseIdentifier(parser, context);
					} else if (context & 1 && parser.token === 131) {
						kind |= 4096;
						key = parsePrivateIdentifier(
							parser,
							context,
							tokenPos,
							linePos,
							colPos
						);
					} else report(parser, 132);
				}
				if ((kind & 2) === 0) {
					if (parser.tokenValue === 'constructor') {
						if ((parser.token & 1073741824) === 1073741824) {
							report(parser, 126);
						} else if (
							(kind & 32) === 0 &&
							parser.token === 67174411
						) {
							if (kind & (768 | 16 | 128 | 8)) {
								report(parser, 51, 'accessor');
							} else if ((context & 524288) === 0) {
								if (parser.flags & 32) report(parser, 52);
								else parser.flags |= 32;
							}
						}
						kind |= 64;
					} else if (
						(kind & 4096) === 0 &&
						kind & (32 | 768 | 8 | 16) &&
						parser.tokenValue === 'prototype'
					) {
						report(parser, 50);
					}
				}
				if (context & 1 && parser.token !== 67174411) {
					return parsePropertyDefinition(
						parser,
						context,
						key,
						kind,
						decorators,
						tokenPos,
						linePos,
						colPos
					);
				}
				const value = parseMethodDefinition(
					parser,
					context,
					kind,
					inGroup,
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				return finishNode(
					parser,
					context,
					start,
					line,
					column,
					context & 1
						? {
								type: 'MethodDefinition',
								kind:
									(kind & 32) === 0 && kind & 64
										? 'constructor'
										: kind & 256
											? 'get'
											: kind & 512
												? 'set'
												: 'method',
								static: (kind & 32) > 0,
								computed: (kind & 2) > 0,
								key,
								decorators,
								value
							}
						: {
								type: 'MethodDefinition',
								kind:
									(kind & 32) === 0 && kind & 64
										? 'constructor'
										: kind & 256
											? 'get'
											: kind & 512
												? 'set'
												: 'method',
								static: (kind & 32) > 0,
								computed: (kind & 2) > 0,
								key,
								value
							}
				);
			}
			function parsePrivateIdentifier(
				parser,
				context,
				start,
				line,
				column
			) {
				nextToken(parser, context);
				const { tokenValue } = parser;
				if (tokenValue === 'constructor') report(parser, 125);
				nextToken(parser, context);
				return finishNode(parser, context, start, line, column, {
					type: 'PrivateIdentifier',
					name: tokenValue
				});
			}
			function parsePropertyDefinition(
				parser,
				context,
				key,
				state,
				decorators,
				start,
				line,
				column
			) {
				let value = null;
				if (state & 8) report(parser, 0);
				if (parser.token === 1077936157) {
					nextToken(parser, context | 32768);
					const { tokenPos, linePos, colPos } = parser;
					if (parser.token === 537079928) report(parser, 116);
					const modifierFlags =
						(state & 64) === 0 ? 31981568 : 14680064;
					context =
						((context | modifierFlags) ^ modifierFlags) |
						((state & 88) << 18) |
						100925440;
					value = parsePrimaryExpression(
						parser,
						context | 16384,
						2,
						0,
						1,
						0,
						1,
						tokenPos,
						linePos,
						colPos
					);
					if (
						(parser.token & 1073741824) !== 1073741824 ||
						(parser.token & 4194304) === 4194304
					) {
						value = parseMemberOrUpdateExpression(
							parser,
							context | 16384,
							value,
							0,
							0,
							tokenPos,
							linePos,
							colPos
						);
						value = parseAssignmentExpression(
							parser,
							context | 16384,
							0,
							0,
							tokenPos,
							linePos,
							colPos,
							value
						);
						if (parser.token === 18) {
							value = parseSequenceExpression(
								parser,
								context,
								0,
								start,
								line,
								column,
								value
							);
						}
					}
				}
				return finishNode(parser, context, start, line, column, {
					type: 'PropertyDefinition',
					key,
					value,
					static: (state & 32) > 0,
					computed: (state & 2) > 0,
					decorators
				});
			}
			function parseBindingPattern(
				parser,
				context,
				scope,
				type,
				origin,
				start,
				line,
				column
			) {
				if (parser.token & 143360)
					return parseAndClassifyIdentifier(
						parser,
						context,
						scope,
						type,
						origin,
						start,
						line,
						column
					);
				if ((parser.token & 2097152) !== 2097152)
					report(parser, 28, KeywordDescTable[parser.token & 255]);
				const left =
					parser.token === 69271571
						? parseArrayExpressionOrPattern(
								parser,
								context,
								scope,
								1,
								0,
								1,
								type,
								origin,
								start,
								line,
								column
							)
						: parseObjectLiteralOrPattern(
								parser,
								context,
								scope,
								1,
								0,
								1,
								type,
								origin,
								start,
								line,
								column
							);
				if (parser.destructible & 16) report(parser, 48);
				if (parser.destructible & 32) report(parser, 48);
				return left;
			}
			function parseAndClassifyIdentifier(
				parser,
				context,
				scope,
				kind,
				origin,
				start,
				line,
				column
			) {
				const { tokenValue, token } = parser;
				if (context & 1024) {
					if ((token & 537079808) === 537079808) {
						report(parser, 116);
					} else if ((token & 36864) === 36864) {
						report(parser, 115);
					}
				}
				if ((token & 20480) === 20480) {
					report(parser, 100);
				}
				if (context & (2048 | 2097152) && token === 241773) {
					report(parser, 30);
				}
				if (token === 241739) {
					if (kind & (8 | 16)) report(parser, 98);
				}
				if (context & (4194304 | 2048) && token === 209008) {
					report(parser, 96);
				}
				nextToken(parser, context);
				if (scope)
					addVarOrBlock(
						parser,
						context,
						scope,
						tokenValue,
						kind,
						origin
					);
				return finishNode(parser, context, start, line, column, {
					type: 'Identifier',
					name: tokenValue
				});
			}
			function parseJSXRootElementOrFragment(
				parser,
				context,
				inJSXChild,
				start,
				line,
				column
			) {
				nextToken(parser, context);
				if (parser.token === 8456259) {
					return finishNode(parser, context, start, line, column, {
						type: 'JSXFragment',
						openingFragment: parseOpeningFragment(
							parser,
							context,
							start,
							line,
							column
						),
						children: parseJSXChildren(parser, context),
						closingFragment: parseJSXClosingFragment(
							parser,
							context,
							inJSXChild,
							parser.tokenPos,
							parser.linePos,
							parser.colPos
						)
					});
				}
				let closingElement = null;
				let children = [];
				const openingElement =
					parseJSXOpeningFragmentOrSelfCloseElement(
						parser,
						context,
						inJSXChild,
						start,
						line,
						column
					);
				if (!openingElement.selfClosing) {
					children = parseJSXChildren(parser, context);
					closingElement = parseJSXClosingElement(
						parser,
						context,
						inJSXChild,
						parser.tokenPos,
						parser.linePos,
						parser.colPos
					);
					const close = isEqualTagName(closingElement.name);
					if (isEqualTagName(openingElement.name) !== close)
						report(parser, 150, close);
				}
				return finishNode(parser, context, start, line, column, {
					type: 'JSXElement',
					children,
					openingElement,
					closingElement
				});
			}
			function parseOpeningFragment(
				parser,
				context,
				start,
				line,
				column
			) {
				scanJSXToken(parser, context);
				return finishNode(parser, context, start, line, column, {
					type: 'JSXOpeningFragment'
				});
			}
			function parseJSXClosingElement(
				parser,
				context,
				inJSXChild,
				start,
				line,
				column
			) {
				consume(parser, context, 25);
				const name = parseJSXElementName(
					parser,
					context,
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				if (inJSXChild) {
					consume(parser, context, 8456259);
				} else {
					parser.token = scanJSXToken(parser, context);
				}
				return finishNode(parser, context, start, line, column, {
					type: 'JSXClosingElement',
					name
				});
			}
			function parseJSXClosingFragment(
				parser,
				context,
				inJSXChild,
				start,
				line,
				column
			) {
				consume(parser, context, 25);
				if (inJSXChild) {
					consume(parser, context, 8456259);
				} else {
					consume(parser, context, 8456259);
				}
				return finishNode(parser, context, start, line, column, {
					type: 'JSXClosingFragment'
				});
			}
			function parseJSXChildren(parser, context) {
				const children = [];
				while (parser.token !== 25) {
					parser.index = parser.tokenPos = parser.startPos;
					parser.column = parser.colPos = parser.startColumn;
					parser.line = parser.linePos = parser.startLine;
					scanJSXToken(parser, context);
					children.push(
						parseJSXChild(
							parser,
							context,
							parser.tokenPos,
							parser.linePos,
							parser.colPos
						)
					);
				}
				return children;
			}
			function parseJSXChild(parser, context, start, line, column) {
				if (parser.token === 138)
					return parseJSXText(parser, context, start, line, column);
				if (parser.token === 2162700)
					return parseJSXExpressionContainer(
						parser,
						context,
						0,
						0,
						start,
						line,
						column
					);
				if (parser.token === 8456258)
					return parseJSXRootElementOrFragment(
						parser,
						context,
						0,
						start,
						line,
						column
					);
				report(parser, 0);
			}
			function parseJSXText(parser, context, start, line, column) {
				scanJSXToken(parser, context);
				const node = {
					type: 'JSXText',
					value: parser.tokenValue
				};
				if (context & 512) {
					node.raw = parser.tokenRaw;
				}
				return finishNode(parser, context, start, line, column, node);
			}
			function parseJSXOpeningFragmentOrSelfCloseElement(
				parser,
				context,
				inJSXChild,
				start,
				line,
				column
			) {
				if (
					(parser.token & 143360) !== 143360 &&
					(parser.token & 4096) !== 4096
				)
					report(parser, 0);
				const tagName = parseJSXElementName(
					parser,
					context,
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				const attributes = parseJSXAttributes(parser, context);
				const selfClosing = parser.token === 8457016;
				if (parser.token === 8456259) {
					scanJSXToken(parser, context);
				} else {
					consume(parser, context, 8457016);
					if (inJSXChild) {
						consume(parser, context, 8456259);
					} else {
						scanJSXToken(parser, context);
					}
				}
				return finishNode(parser, context, start, line, column, {
					type: 'JSXOpeningElement',
					name: tagName,
					attributes,
					selfClosing
				});
			}
			function parseJSXElementName(parser, context, start, line, column) {
				scanJSXIdentifier(parser);
				let key = parseJSXIdentifier(
					parser,
					context,
					start,
					line,
					column
				);
				if (parser.token === 21)
					return parseJSXNamespacedName(
						parser,
						context,
						key,
						start,
						line,
						column
					);
				while (consumeOpt(parser, context, 67108877)) {
					scanJSXIdentifier(parser);
					key = parseJSXMemberExpression(
						parser,
						context,
						key,
						start,
						line,
						column
					);
				}
				return key;
			}
			function parseJSXMemberExpression(
				parser,
				context,
				object,
				start,
				line,
				column
			) {
				const property = parseJSXIdentifier(
					parser,
					context,
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				return finishNode(parser, context, start, line, column, {
					type: 'JSXMemberExpression',
					object,
					property
				});
			}
			function parseJSXAttributes(parser, context) {
				const attributes = [];
				while (
					parser.token !== 8457016 &&
					parser.token !== 8456259 &&
					parser.token !== 1048576
				) {
					attributes.push(
						parseJsxAttribute(
							parser,
							context,
							parser.tokenPos,
							parser.linePos,
							parser.colPos
						)
					);
				}
				return attributes;
			}
			function parseJSXSpreadAttribute(
				parser,
				context,
				start,
				line,
				column
			) {
				nextToken(parser, context);
				consume(parser, context, 14);
				const expression = parseExpression(
					parser,
					context,
					1,
					0,
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				consume(parser, context, 1074790415);
				return finishNode(parser, context, start, line, column, {
					type: 'JSXSpreadAttribute',
					argument: expression
				});
			}
			function parseJsxAttribute(parser, context, start, line, column) {
				if (parser.token === 2162700)
					return parseJSXSpreadAttribute(
						parser,
						context,
						start,
						line,
						column
					);
				scanJSXIdentifier(parser);
				let value = null;
				let name = parseJSXIdentifier(
					parser,
					context,
					start,
					line,
					column
				);
				if (parser.token === 21) {
					name = parseJSXNamespacedName(
						parser,
						context,
						name,
						start,
						line,
						column
					);
				}
				if (parser.token === 1077936157) {
					const token = scanJSXAttributeValue(parser, context);
					const { tokenPos, linePos, colPos } = parser;
					switch (token) {
						case 134283267:
							value = parseLiteral(parser, context);
							break;
						case 8456258:
							value = parseJSXRootElementOrFragment(
								parser,
								context,
								1,
								tokenPos,
								linePos,
								colPos
							);
							break;
						case 2162700:
							value = parseJSXExpressionContainer(
								parser,
								context,
								1,
								1,
								tokenPos,
								linePos,
								colPos
							);
							break;
						default:
							report(parser, 149);
					}
				}
				return finishNode(parser, context, start, line, column, {
					type: 'JSXAttribute',
					value,
					name
				});
			}
			function parseJSXNamespacedName(
				parser,
				context,
				namespace,
				start,
				line,
				column
			) {
				consume(parser, context, 21);
				const name = parseJSXIdentifier(
					parser,
					context,
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				return finishNode(parser, context, start, line, column, {
					type: 'JSXNamespacedName',
					namespace,
					name
				});
			}
			function parseJSXExpressionContainer(
				parser,
				context,
				inJSXChild,
				isAttr,
				start,
				line,
				column
			) {
				nextToken(parser, context | 32768);
				const { tokenPos, linePos, colPos } = parser;
				if (parser.token === 14)
					return parseJSXSpreadChild(
						parser,
						context,
						start,
						line,
						column
					);
				let expression = null;
				if (parser.token === 1074790415) {
					if (isAttr) report(parser, 152);
					expression = parseJSXEmptyExpression(
						parser,
						context,
						parser.startPos,
						parser.startLine,
						parser.startColumn
					);
				} else {
					expression = parseExpression(
						parser,
						context,
						1,
						0,
						tokenPos,
						linePos,
						colPos
					);
				}
				if (inJSXChild) {
					consume(parser, context, 1074790415);
				} else {
					scanJSXToken(parser, context);
				}
				return finishNode(parser, context, start, line, column, {
					type: 'JSXExpressionContainer',
					expression
				});
			}
			function parseJSXSpreadChild(parser, context, start, line, column) {
				consume(parser, context, 14);
				const expression = parseExpression(
					parser,
					context,
					1,
					0,
					parser.tokenPos,
					parser.linePos,
					parser.colPos
				);
				consume(parser, context, 1074790415);
				return finishNode(parser, context, start, line, column, {
					type: 'JSXSpreadChild',
					expression
				});
			}
			function parseJSXEmptyExpression(
				parser,
				context,
				start,
				line,
				column
			) {
				parser.startPos = parser.tokenPos;
				parser.startLine = parser.linePos;
				parser.startColumn = parser.colPos;
				return finishNode(parser, context, start, line, column, {
					type: 'JSXEmptyExpression'
				});
			}
			function parseJSXIdentifier(parser, context, start, line, column) {
				const { tokenValue } = parser;
				nextToken(parser, context);
				return finishNode(parser, context, start, line, column, {
					type: 'JSXIdentifier',
					name: tokenValue
				});
			}

			var estree = /*#__PURE__*/ Object.freeze({
				__proto__: null
			});

			var version$1 = '4.5.0';

			const version = version$1;
			function parseScript(source, options) {
				return parseSource(source, options, 0);
			}
			function parseModule(source, options) {
				return parseSource(source, options, 1024 | 2048);
			}
			function parse(source, options) {
				return parseSource(source, options, 0);
			}
		},
		'./node_modules/parse-domain/build/parse-domain.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				ParseResultType: function () {
					return ParseResultType;
				},
				RESERVED_TOP_LEVEL_DOMAINS: function () {
					return RESERVED_TOP_LEVEL_DOMAINS;
				},
				parseDomain: function () {
					return parseDomain;
				}
			});
			/* harmony import */ var _serialized_tries_js__WEBPACK_IMPORTED_MODULE_2__ =
				__webpack_require__(
					/*! ./serialized-tries.js */ './node_modules/parse-domain/serialized-tries/icann.js'
				);
			/* harmony import */ var _serialized_tries_js__WEBPACK_IMPORTED_MODULE_3__ =
				__webpack_require__(
					/*! ./serialized-tries.js */ './node_modules/parse-domain/serialized-tries/private.js'
				);
			/* harmony import */ var _trie_look_up_js__WEBPACK_IMPORTED_MODULE_4__ =
				__webpack_require__(
					/*! ./trie/look-up.js */ './node_modules/parse-domain/build/trie/look-up.js'
				);
			/* harmony import */ var _sanitize_js__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! ./sanitize.js */ './node_modules/parse-domain/build/sanitize.js'
				);
			/* harmony import */ var _trie_parse_trie_js__WEBPACK_IMPORTED_MODULE_1__ =
				__webpack_require__(
					/*! ./trie/parse-trie.js */ './node_modules/parse-domain/build/trie/parse-trie.js'
				);

			const RESERVED_TOP_LEVEL_DOMAINS = [
				'localhost',
				'local',
				'example',
				'invalid',
				'test'
			];
			var ParseResultType;
			(function (ParseResultType) {
				/**
				 * This parse result is returned in case the given hostname does not adhere to [RFC 1034](https://tools.ietf.org/html/rfc1034).
				 */
				ParseResultType['Invalid'] = 'INVALID';
				/**
				 * This parse result is returned if the given hostname was an IPv4 or IPv6.
				 */
				ParseResultType['Ip'] = 'IP';
				/**
				 * This parse result is returned when the given hostname
				 * - is the root domain (the empty string `""`)
				 * - belongs to the top-level domain `localhost`, `local`, `example`, `invalid` or `test`
				 */
				ParseResultType['Reserved'] = 'RESERVED';
				/**
				 * This parse result is returned when the given hostname is valid and does not belong to a reserved top-level domain, but is not listed in the public suffix list.
				 */
				ParseResultType['NotListed'] = 'NOT_LISTED';
				/**
				 * This parse result is returned when the given hostname belongs to a top-level domain that is listed in the public suffix list.
				 */
				ParseResultType['Listed'] = 'LISTED';
			})(ParseResultType || (ParseResultType = {}));
			const getAtIndex = (array, index) => {
				return index >= 0 && index < array.length
					? array[index]
					: undefined;
			};
			const splitLabelsIntoDomains = (labels, index) => {
				return {
					subDomains: labels.slice(0, Math.max(0, index)),
					domain: getAtIndex(labels, index),
					topLevelDomains: labels.slice(index + 1)
				};
			};
			let parsedIcannTrie;
			let parsedPrivateTrie;
			/**
			 * Splits the given hostname in topLevelDomains, a domain and subDomains.
			 */
			const parseDomain = (hostname, options) => {
				const sanitizationResult = (0,
				_sanitize_js__WEBPACK_IMPORTED_MODULE_0__.sanitize)(
					hostname,
					options
				);
				if (
					sanitizationResult.type ===
					_sanitize_js__WEBPACK_IMPORTED_MODULE_0__
						.SanitizationResultType.Error
				) {
					return {
						type: ParseResultType.Invalid,
						hostname,
						errors: sanitizationResult.errors
					};
				}
				if (
					sanitizationResult.type ===
					_sanitize_js__WEBPACK_IMPORTED_MODULE_0__
						.SanitizationResultType.ValidIp
				) {
					return {
						type: ParseResultType.Ip,
						hostname: sanitizationResult.ip,
						ipVersion: sanitizationResult.ipVersion
					};
				}
				const { labels, domain } = sanitizationResult;
				if (
					hostname === '' ||
					RESERVED_TOP_LEVEL_DOMAINS.includes(
						labels[labels.length - 1]
					)
				) {
					return {
						type: ParseResultType.Reserved,
						hostname: domain,
						labels
					};
				}
				// Parse the serialized trie lazily
				parsedIcannTrie =
					parsedIcannTrie !== null && parsedIcannTrie !== void 0
						? parsedIcannTrie
						: (0,
							_trie_parse_trie_js__WEBPACK_IMPORTED_MODULE_1__.parseTrie)(
								_serialized_tries_js__WEBPACK_IMPORTED_MODULE_2__[
									'default'
								]
							);
				parsedPrivateTrie =
					parsedPrivateTrie !== null && parsedPrivateTrie !== void 0
						? parsedPrivateTrie
						: (0,
							_trie_parse_trie_js__WEBPACK_IMPORTED_MODULE_1__.parseTrie)(
								_serialized_tries_js__WEBPACK_IMPORTED_MODULE_3__[
									'default'
								]
							);
				const icannTlds = (0,
				_trie_look_up_js__WEBPACK_IMPORTED_MODULE_4__.lookUpTldsInTrie)(
					labels,
					parsedIcannTrie
				);
				const privateTlds = (0,
				_trie_look_up_js__WEBPACK_IMPORTED_MODULE_4__.lookUpTldsInTrie)(
					labels,
					parsedPrivateTrie
				);
				if (icannTlds.length === 0 && privateTlds.length === 0) {
					return {
						type: ParseResultType.NotListed,
						hostname: domain,
						labels
					};
				}
				const indexOfPublicSuffixDomain =
					labels.length -
					Math.max(privateTlds.length, icannTlds.length) -
					1;
				const indexOfIcannDomain = labels.length - icannTlds.length - 1;
				return Object.assign(
					{
						type: ParseResultType.Listed,
						hostname: domain,
						labels,
						icann: splitLabelsIntoDomains(
							labels,
							indexOfIcannDomain
						)
					},
					splitLabelsIntoDomains(labels, indexOfPublicSuffixDomain)
				);
			};
			//# sourceMappingURL=parse-domain.js.map
		},
		'./node_modules/parse-domain/build/sanitize.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				SanitizationResultType: function () {
					return SanitizationResultType;
				},
				Validation: function () {
					return Validation;
				},
				ValidationErrorType: function () {
					return ValidationErrorType;
				},
				sanitize: function () {
					return sanitize;
				}
			});
			/* harmony import */ var is_ip__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! is-ip */ './node_modules/is-ip/index.js'
				);

			// See https://en.wikipedia.org/wiki/Domain_name
			// See https://tools.ietf.org/html/rfc1034
			const LABEL_SEPARATOR = '.';
			const LABEL_LENGTH_MIN = 1;
			const LABEL_LENGTH_MAX = 63;
			/**
			 * 255 octets - 2 octets if you remove the last dot
			 * @see https://devblogs.microsoft.com/oldnewthing/20120412-00/?p=7873
			 */
			const DOMAIN_LENGTH_MAX = 253;
			const textEncoder = new TextEncoder();
			var Validation;
			(function (Validation) {
				/**
				 * Allows any octets as labels
				 * but still restricts the length of labels and the overall domain.
				 *
				 * @see https://www.rfc-editor.org/rfc/rfc2181#section-11
				 **/
				Validation['Lax'] = 'LAX';
				/**
				 * Only allows ASCII letters, digits and hyphens (aka LDH),
				 * forbids hyphens at the beginning or end of a label
				 * and requires top-level domain names not to be all-numeric.
				 *
				 * This is the default if no validation is configured.
				 *
				 * @see https://datatracker.ietf.org/doc/html/rfc3696#section-2
				 */
				Validation['Strict'] = 'STRICT';
			})(Validation || (Validation = {}));
			var ValidationErrorType;
			(function (ValidationErrorType) {
				ValidationErrorType['NoHostname'] = 'NO_HOSTNAME';
				ValidationErrorType['DomainMaxLength'] = 'DOMAIN_MAX_LENGTH';
				ValidationErrorType['LabelMinLength'] = 'LABEL_MIN_LENGTH';
				ValidationErrorType['LabelMaxLength'] = 'LABEL_MAX_LENGTH';
				ValidationErrorType['LabelInvalidCharacter'] =
					'LABEL_INVALID_CHARACTER';
				ValidationErrorType['LastLabelInvalid'] = 'LAST_LABEL_INVALID';
			})(ValidationErrorType || (ValidationErrorType = {}));
			var SanitizationResultType;
			(function (SanitizationResultType) {
				SanitizationResultType['ValidIp'] = 'VALID_IP';
				SanitizationResultType['ValidDomain'] = 'VALID_DOMAIN';
				SanitizationResultType['Error'] = 'ERROR';
			})(SanitizationResultType || (SanitizationResultType = {}));
			const createNoHostnameError = input => {
				return {
					type: ValidationErrorType.NoHostname,
					message: `The given input ${String(input)} does not look like a hostname.`,
					column: 1
				};
			};
			const createDomainMaxLengthError = (domain, length) => {
				return {
					type: ValidationErrorType.DomainMaxLength,
					message: `Domain "${domain}" is too long. Domain is ${length} octets long but should not be longer than ${DOMAIN_LENGTH_MAX}.`,
					column: length
				};
			};
			const createLabelMinLengthError = (label, column) => {
				const length = label.length;
				return {
					type: ValidationErrorType.LabelMinLength,
					message: `Label "${label}" is too short. Label is ${length} octets long but should be at least ${LABEL_LENGTH_MIN}.`,
					column
				};
			};
			const createLabelMaxLengthError = (label, column) => {
				const length = label.length;
				return {
					type: ValidationErrorType.LabelMaxLength,
					message: `Label "${label}" is too long. Label is ${length} octets long but should not be longer than ${LABEL_LENGTH_MAX}.`,
					column
				};
			};
			const createLabelInvalidCharacterError = (
				label,
				invalidCharacter,
				column
			) => {
				return {
					type: ValidationErrorType.LabelInvalidCharacter,
					message: `Label "${label}" contains invalid character "${invalidCharacter}" at column ${column}.`,
					column
				};
			};
			const createLastLabelInvalidError = (label, column) => {
				return {
					type: ValidationErrorType.LabelInvalidCharacter,
					message: `Last label "${label}" must not be all-numeric.`,
					column
				};
			};
			const sanitize = (input, options = {}) => {
				// Extra check for non-TypeScript users
				if (typeof input !== 'string') {
					return {
						type: SanitizationResultType.Error,
						errors: [createNoHostnameError(input)]
					};
				}
				if (input === '') {
					return {
						type: SanitizationResultType.ValidDomain,
						domain: input,
						labels: []
					};
				}
				// IPv6 addresses are surrounded by square brackets in URLs
				// See https://tools.ietf.org/html/rfc3986#section-3.2.2
				const inputTrimmedAsIp = input.replace(/^\[|]$/g, '');
				const ipVersionOfInput = (0,
				is_ip__WEBPACK_IMPORTED_MODULE_0__.ipVersion)(inputTrimmedAsIp);
				if (ipVersionOfInput !== undefined) {
					return {
						type: SanitizationResultType.ValidIp,
						ip: inputTrimmedAsIp,
						ipVersion: ipVersionOfInput
					};
				}
				const lastChar = input.charAt(input.length - 1);
				const canonicalInput =
					lastChar === LABEL_SEPARATOR ? input.slice(0, -1) : input;
				const octets = new TextEncoder().encode(canonicalInput);
				if (octets.length > DOMAIN_LENGTH_MAX) {
					return {
						type: SanitizationResultType.Error,
						errors: [
							createDomainMaxLengthError(input, octets.length)
						]
					};
				}
				const labels = canonicalInput.split(LABEL_SEPARATOR);
				const { validation = Validation.Strict } = options;
				const labelValidationErrors =
					validateLabels[validation](labels);
				if (labelValidationErrors.length > 0) {
					return {
						type: SanitizationResultType.Error,
						errors: labelValidationErrors
					};
				}
				return {
					type: SanitizationResultType.ValidDomain,
					domain: input,
					labels
				};
			};
			const validateLabels = {
				[Validation.Lax]: labels => {
					const labelValidationErrors = [];
					let column = 1;
					for (const label of labels) {
						const octets = textEncoder.encode(label);
						if (octets.length < LABEL_LENGTH_MIN) {
							labelValidationErrors.push(
								createLabelMinLengthError(label, column)
							);
						} else if (octets.length > LABEL_LENGTH_MAX) {
							labelValidationErrors.push(
								createLabelMaxLengthError(label, column)
							);
						}
						column += label.length + LABEL_SEPARATOR.length;
					}
					return labelValidationErrors;
				},
				[Validation.Strict]: labels => {
					const labelValidationErrors = [];
					let column = 1;
					let lastLabel;
					for (const label of labels) {
						// According to https://tools.ietf.org/html/rfc6761 labels should
						// only contain ASCII letters, digits and hyphens (LDH).
						const invalidCharacter = /[^\da-z-]/i.exec(label);
						if (invalidCharacter) {
							labelValidationErrors.push(
								createLabelInvalidCharacterError(
									label,
									invalidCharacter[0],
									invalidCharacter.index + 1
								)
							);
						}
						if (label.startsWith('-')) {
							labelValidationErrors.push(
								createLabelInvalidCharacterError(
									label,
									'-',
									column
								)
							);
						} else if (label.endsWith('-')) {
							labelValidationErrors.push(
								createLabelInvalidCharacterError(
									label,
									'-',
									column + label.length - 1
								)
							);
						}
						if (
							// We can use .length here to check for the octet size because
							// label can only contain ASCII LDH characters at this point.
							label.length < LABEL_LENGTH_MIN
						) {
							labelValidationErrors.push(
								createLabelMinLengthError(label, column)
							);
						} else if (label.length > LABEL_LENGTH_MAX) {
							labelValidationErrors.push(
								createLabelMaxLengthError(label, column)
							);
						}
						column += label.length + LABEL_SEPARATOR.length;
						lastLabel = label;
					}
					if (
						lastLabel !== undefined &&
						/[a-z-]/iu.test(lastLabel) === false
					) {
						labelValidationErrors.push(
							createLastLabelInvalidError(
								lastLabel,
								column -
									lastLabel.length -
									LABEL_SEPARATOR.length
							)
						);
					}
					return labelValidationErrors;
				}
			};
			//# sourceMappingURL=sanitize.js.map
		},
		'./node_modules/parse-domain/build/trie/characters.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				DOWN: function () {
					return DOWN;
				},
				EXCEPTION: function () {
					return EXCEPTION;
				},
				RESET: function () {
					return RESET;
				},
				SAME: function () {
					return SAME;
				},
				UP: function () {
					return UP;
				},
				WILDCARD: function () {
					return WILDCARD;
				}
			});
			// UP, SAME, DOWN, RESET should not be special regex characters in a character class.
			const UP = '<'; // one level up
			const SAME = ','; // same level
			const DOWN = '>'; // one level down
			const RESET = '|'; // reset level index and start new
			const WILDCARD = '*'; // as defined by publicsuffix.org
			const EXCEPTION = '!'; // as defined by publicsuffix.org
			//# sourceMappingURL=characters.js.map
		},
		'./node_modules/parse-domain/build/trie/look-up.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				lookUpTldsInTrie: function () {
					return lookUpTldsInTrie;
				}
			});
			/* harmony import */ var _characters_js__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! ./characters.js */ './node_modules/parse-domain/build/trie/characters.js'
				);

			const lookUpTldsInTrie = (labels, trie) => {
				const labelsToCheck = labels.slice();
				const tlds = [];
				let node = trie;
				while (labelsToCheck.length !== 0) {
					const label = labelsToCheck.pop();
					const labelLowerCase = label.toLowerCase();
					if (
						node.children.has(
							_characters_js__WEBPACK_IMPORTED_MODULE_0__.WILDCARD
						)
					) {
						if (
							node.children.has(
								_characters_js__WEBPACK_IMPORTED_MODULE_0__.EXCEPTION +
									labelLowerCase
							)
						) {
							break;
						}
						node = node.children.get(
							_characters_js__WEBPACK_IMPORTED_MODULE_0__.WILDCARD
						);
					} else {
						if (node.children.has(labelLowerCase) === false) {
							break;
						}
						node = node.children.get(labelLowerCase);
					}
					tlds.unshift(label);
				}
				return tlds;
			};
			//# sourceMappingURL=look-up.js.map
		},
		'./node_modules/parse-domain/build/trie/nodes.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				NODE_TYPE_CHILD: function () {
					return NODE_TYPE_CHILD;
				},
				NODE_TYPE_ROOT: function () {
					return NODE_TYPE_ROOT;
				},
				createOrGetChild: function () {
					return createOrGetChild;
				},
				createRootNode: function () {
					return createRootNode;
				}
			});
			const NODE_TYPE_ROOT = Symbol('ROOT');
			const NODE_TYPE_CHILD = Symbol('CHILD');
			const createRootNode = () => {
				return {
					type: NODE_TYPE_ROOT,
					children: new Map()
				};
			};
			const createOrGetChild = (parent, label) => {
				let child = parent.children.get(label);
				if (child === undefined) {
					child = {
						type: NODE_TYPE_CHILD,
						label,
						children: new Map(),
						parent
					};
					parent.children.set(label, child);
				}
				return child;
			};
			//# sourceMappingURL=nodes.js.map
		},
		'./node_modules/parse-domain/build/trie/parse-trie.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				parseTrie: function () {
					return parseTrie;
				}
			});
			/* harmony import */ var _characters_js__WEBPACK_IMPORTED_MODULE_1__ =
				__webpack_require__(
					/*! ./characters.js */ './node_modules/parse-domain/build/trie/characters.js'
				);
			/* harmony import */ var _nodes_js__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! ./nodes.js */ './node_modules/parse-domain/build/trie/nodes.js'
				);

			const parseTrie = serializedTrie => {
				const rootNode = (0,
				_nodes_js__WEBPACK_IMPORTED_MODULE_0__.createRootNode)();
				let domain = '';
				let parentNode = rootNode;
				// Type assertion necessary here due to a TypeScript unsoundness
				// https://github.com/microsoft/TypeScript/issues/9998#issuecomment-235963457
				let node = rootNode;
				const addDomain = () => {
					node = (0,
					_nodes_js__WEBPACK_IMPORTED_MODULE_0__.createOrGetChild)(
						parentNode,
						domain
					);
					domain = '';
				};
				for (let i = 0; i < serializedTrie.length; i++) {
					const char = serializedTrie.charAt(i);
					switch (char) {
						case _characters_js__WEBPACK_IMPORTED_MODULE_1__.SAME: {
							addDomain();
							continue;
						}
						case _characters_js__WEBPACK_IMPORTED_MODULE_1__.DOWN: {
							addDomain();
							parentNode = node;
							continue;
						}
						case _characters_js__WEBPACK_IMPORTED_MODULE_1__.RESET: {
							addDomain();
							parentNode = rootNode;
							continue;
						}
						case _characters_js__WEBPACK_IMPORTED_MODULE_1__.UP: {
							if (
								parentNode.type ===
								_nodes_js__WEBPACK_IMPORTED_MODULE_0__.NODE_TYPE_ROOT
							) {
								throw new Error(
									`Error in serialized trie at position ${i}: Cannot go up, current parent node is already root`
								);
							}
							addDomain();
							parentNode = parentNode.parent;
							continue;
						}
					}
					domain += char;
				}
				if (domain !== '') {
					addDomain();
				}
				return rootNode;
			};
			//# sourceMappingURL=parse-trie.js.map
		},
		'./node_modules/parse-domain/serialized-tries/icann.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			/* harmony default export */ __webpack_exports__['default'] =
				'ac>com,edu,gov,net,mil,org<ad>nom<ae>co,net,org,sch,ac,gov,mil<aero>accident-investigation,accident-prevention,aerobatic,aeroclub,aerodrome,agents,aircraft,airline,airport,air-surveillance,airtraffic,air-traffic-control,ambulance,amusement,association,author,ballooning,broker,caa,cargo,catering,certification,championship,charter,civilaviation,club,conference,consultant,consulting,control,council,crew,design,dgca,educator,emergency,engine,engineer,entertainment,equipment,exchange,express,federation,flight,fuel,gliding,government,groundhandling,group,hanggliding,homebuilt,insurance,journal,journalist,leasing,logistics,magazine,maintenance,media,microlight,modelling,navigation,parachuting,paragliding,passenger-association,pilot,press,production,recreation,repbody,res,research,rotorcraft,safety,scientist,services,show,skydiving,software,student,trader,trading,trainer,union,workinggroup,works<af>gov,com,org,net,edu<ag>com,org,net,co,nom<ai>off,com,net,org<al>com,edu,gov,mil,net,org<am>co,com,commune,net,org<ao>ed,gv,og,co,pb,it<aq,ar>bet,com,coop,edu,gob,gov,int,mil,musica,mutual,net,org,senasa,tur<arpa>e164,in-addr,ip6,iris,uri,urn<as>gov<asia,at>ac>sth<co,gv,or<au>com,net,org,edu>act,catholic,nsw>schools<nt,qld,sa,tas,vic,wa<gov>qld,sa,tas,vic,wa<asn,id,info,conf,oz,act,nsw,nt,qld,sa,tas,vic,wa<aw>com<ax,az>com,net,int,gov,org,edu,info,pp,mil,name,pro,biz<ba>com,edu,gov,mil,net,org<bb>biz,co,com,edu,gov,info,net,org,store,tv<bd>*<be>ac<bf>gov<bg>a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,0,1,2,3,4,5,6,7,8,9<bh>com,edu,net,org,gov<bi>co,com,edu,or,org<biz,bj>africa,agro,architectes,assur,avocats,co,com,eco,econo,edu,info,loisirs,money,net,org,ote,resto,restaurant,tourism,univ<bm>com,edu,gov,net,org<bn>com,edu,gov,net,org<bo>com,edu,gob,int,org,net,mil,tv,web,academia,agro,arte,blog,bolivia,ciencia,cooperativa,democracia,deporte,ecologia,economia,empresa,indigena,industria,info,medicina,movimiento,musica,natural,nombre,noticias,patria,politica,profesional,plurinacional,pueblo,revista,salud,tecnologia,tksat,transporte,wiki<br>9guacu,abc,adm,adv,agr,aju,am,anani,aparecida,app,arq,art,ato,b,barueri,belem,bhz,bib,bio,blog,bmd,boavista,bsb,campinagrande,campinas,caxias,cim,cng,cnt,com,contagem,coop,coz,cri,cuiaba,curitiba,def,des,det,dev,ecn,eco,edu,emp,enf,eng,esp,etc,eti,far,feira,flog,floripa,fm,fnd,fortal,fot,foz,fst,g12,geo,ggf,goiania,gov>ac,al,am,ap,ba,ce,df,es,go,ma,mg,ms,mt,pa,pb,pe,pi,pr,rj,rn,ro,rr,rs,sc,se,sp,to<gru,imb,ind,inf,jab,jampa,jdf,joinville,jor,jus,leg,lel,log,londrina,macapa,maceio,manaus,maringa,mat,med,mil,morena,mp,mus,natal,net,niteroi,nom>*<not,ntr,odo,ong,org,osasco,palmas,poa,ppg,pro,psc,psi,pvh,qsl,radio,rec,recife,rep,ribeirao,rio,riobranco,riopreto,salvador,sampa,santamaria,santoandre,saobernardo,saogonca,seg,sjc,slg,slz,sorocaba,srv,taxi,tc,tec,teo,the,tmp,trd,tur,tv,udi,vet,vix,vlog,wiki,zlg<bs>com,net,org,edu,gov<bt>com,edu,gov,net,org<bv,bw>co,org<by>gov,mil,com,of<bz>com,net,org,edu,gov<ca>ab,bc,mb,nb,nf,nl,ns,nt,nu,on,pe,qc,sk,yk,gc<cat,cc,cd>gov<cf,cg,ch,ci>org,or,com,co,edu,ed,ac,net,go,asso,xn--aroport-bya,int,presse,md,gouv<ck>*,!www<cl>co,gob,gov,mil<cm>co,com,gov,net<cn>ac,com,edu,gov,net,org,mil,xn--55qx5d,xn--io0a7i,xn--od0alg,ah,bj,cq,fj,gd,gs,gz,gx,ha,hb,he,hi,hl,hn,jl,js,jx,ln,nm,nx,qh,sc,sd,sh,sn,sx,tj,xj,xz,yn,zj,hk,mo,tw<co>arts,com,edu,firm,gov,info,int,mil,net,nom,org,rec,web<com,coop,cr>ac,co,ed,fi,go,or,sa<cu>com,edu,org,net,gov,inf<cv>com,edu,int,nome,org<cw>com,edu,net,org<cx>gov<cy>ac,biz,com,ekloges,gov,ltd,mil,net,org,press,pro,tm<cz,de,dj,dk,dm>com,net,org,edu,gov<do>art,com,edu,gob,gov,mil,net,org,sld,web<dz>art,asso,com,edu,gov,org,net,pol,soc,tm<ec>com,info,net,fin,k12,med,pro,org,edu,gov,gob,mil<edu,ee>edu,gov,riik,lib,med,com,pri,aip,org,fie<eg>com,edu,eun,gov,mil,name,net,org,sci<er>*<es>com,nom,org,gob,edu<et>com,gov,org,edu,biz,name,info,net<eu,fi>aland<fj>ac,biz,com,gov,info,mil,name,net,org,pro<fk>*<fm>com,edu,net,org<fo,fr>asso,com,gouv,nom,prd,tm,avoues,cci,greta,huissier-justice<ga,gb,gd>edu,gov<ge>com,edu,gov,org,mil,net,pvt<gf,gg>co,net,org<gh>com,edu,gov,org,mil<gi>com,ltd,gov,mod,edu,org<gl>co,com,edu,net,org<gm,gn>ac,com,edu,gov,org,net<gov,gp>com,net,mobi,edu,org,asso<gq,gr>com,edu,net,org,gov<gs,gt>com,edu,gob,ind,mil,net,org<gu>com,edu,gov,guam,info,net,org,web<gw,gy>co,com,edu,gov,net,org<hk>com,edu,gov,idv,net,org,xn--55qx5d,xn--wcvs22d,xn--lcvr32d,xn--mxtq1m,xn--gmqw5a,xn--ciqpn,xn--gmq050i,xn--zf0avx,xn--io0a7i,xn--mk0axi,xn--od0alg,xn--od0aq3b,xn--tn0ag,xn--uc0atv,xn--uc0ay4a<hm,hn>com,edu,org,net,mil,gob<hr>iz,from,name,com<ht>com,shop,firm,info,adult,net,pro,org,med,art,coop,pol,asso,edu,rel,gouv,perso<hu>co,info,org,priv,sport,tm,2000,agrar,bolt,casino,city,erotica,erotika,film,forum,games,hotel,ingatlan,jogasz,konyvelo,lakas,media,news,reklam,sex,shop,suli,szex,tozsde,utazas,video<id>ac,biz,co,desa,go,mil,my,net,or,ponpes,sch,web<ie>gov<il>ac,co,gov,idf,k12,muni,net,org<xn--4dbrk0ce>xn--4dbgdty6c,xn--5dbhl8d,xn--8dbq2a,xn--hebda8b<im>ac,co>ltd,plc<com,net,org,tt,tv<in>5g,6g,ac,ai,am,bihar,biz,business,ca,cn,co,com,coop,cs,delhi,dr,edu,er,firm,gen,gov,gujarat,ind,info,int,internet,io,me,mil,net,nic,org,pg,post,pro,res,travel,tv,uk,up,us<info,int>eu<io>com<iq>gov,edu,mil,com,org,net<ir>ac,co,gov,id,net,org,sch,xn--mgba3a4f16a,xn--mgba3a4fra<is>net,com,edu,gov,org,int<it>gov,edu,abr,abruzzo,aosta-valley,aostavalley,bas,basilicata,cal,calabria,cam,campania,emilia-romagna,emiliaromagna,emr,friuli-v-giulia,friuli-ve-giulia,friuli-vegiulia,friuli-venezia-giulia,friuli-veneziagiulia,friuli-vgiulia,friuliv-giulia,friulive-giulia,friulivegiulia,friulivenezia-giulia,friuliveneziagiulia,friulivgiulia,fvg,laz,lazio,lig,liguria,lom,lombardia,lombardy,lucania,mar,marche,mol,molise,piedmont,piemonte,pmn,pug,puglia,sar,sardegna,sardinia,sic,sicilia,sicily,taa,tos,toscana,trentin-sud-tirol,xn--trentin-sd-tirol-rzb,trentin-sudtirol,xn--trentin-sdtirol-7vb,trentin-sued-tirol,trentin-suedtirol,trentino-a-adige,trentino-aadige,trentino-alto-adige,trentino-altoadige,trentino-s-tirol,trentino-stirol,trentino-sud-tirol,xn--trentino-sd-tirol-c3b,trentino-sudtirol,xn--trentino-sdtirol-szb,trentino-sued-tirol,trentino-suedtirol,trentino,trentinoa-adige,trentinoaadige,trentinoalto-adige,trentinoaltoadige,trentinos-tirol,trentinostirol,trentinosud-tirol,xn--trentinosd-tirol-rzb,trentinosudtirol,xn--trentinosdtirol-7vb,trentinosued-tirol,trentinosuedtirol,trentinsud-tirol,xn--trentinsd-tirol-6vb,trentinsudtirol,xn--trentinsdtirol-nsb,trentinsued-tirol,trentinsuedtirol,tuscany,umb,umbria,val-d-aosta,val-daosta,vald-aosta,valdaosta,valle-aosta,valle-d-aosta,valle-daosta,valleaosta,valled-aosta,valledaosta,vallee-aoste,xn--valle-aoste-ebb,vallee-d-aoste,xn--valle-d-aoste-ehb,valleeaoste,xn--valleaoste-e7a,valleedaoste,xn--valledaoste-ebb,vao,vda,ven,veneto,ag,agrigento,al,alessandria,alto-adige,altoadige,an,ancona,andria-barletta-trani,andria-trani-barletta,andriabarlettatrani,andriatranibarletta,ao,aosta,aoste,ap,aq,aquila,ar,arezzo,ascoli-piceno,ascolipiceno,asti,at,av,avellino,ba,balsan-sudtirol,xn--balsan-sdtirol-nsb,balsan-suedtirol,balsan,bari,barletta-trani-andria,barlettatraniandria,belluno,benevento,bergamo,bg,bi,biella,bl,bn,bo,bologna,bolzano-altoadige,bolzano,bozen-sudtirol,xn--bozen-sdtirol-2ob,bozen-suedtirol,bozen,br,brescia,brindisi,bs,bt,bulsan-sudtirol,xn--bulsan-sdtirol-nsb,bulsan-suedtirol,bulsan,bz,ca,cagliari,caltanissetta,campidano-medio,campidanomedio,campobasso,carbonia-iglesias,carboniaiglesias,carrara-massa,carraramassa,caserta,catania,catanzaro,cb,ce,cesena-forli,xn--cesena-forl-mcb,cesenaforli,xn--cesenaforl-i8a,ch,chieti,ci,cl,cn,co,como,cosenza,cr,cremona,crotone,cs,ct,cuneo,cz,dell-ogliastra,dellogliastra,en,enna,fc,fe,fermo,ferrara,fg,fi,firenze,florence,fm,foggia,forli-cesena,xn--forl-cesena-fcb,forlicesena,xn--forlcesena-c8a,fr,frosinone,ge,genoa,genova,go,gorizia,gr,grosseto,iglesias-carbonia,iglesiascarbonia,im,imperia,is,isernia,kr,la-spezia,laquila,laspezia,latina,lc,le,lecce,lecco,li,livorno,lo,lodi,lt,lu,lucca,macerata,mantova,massa-carrara,massacarrara,matera,mb,mc,me,medio-campidano,mediocampidano,messina,mi,milan,milano,mn,mo,modena,monza-brianza,monza-e-della-brianza,monza,monzabrianza,monzaebrianza,monzaedellabrianza,ms,mt,na,naples,napoli,no,novara,nu,nuoro,og,ogliastra,olbia-tempio,olbiatempio,or,oristano,ot,pa,padova,padua,palermo,parma,pavia,pc,pd,pe,perugia,pesaro-urbino,pesarourbino,pescara,pg,pi,piacenza,pisa,pistoia,pn,po,pordenone,potenza,pr,prato,pt,pu,pv,pz,ra,ragusa,ravenna,rc,re,reggio-calabria,reggio-emilia,reggiocalabria,reggioemilia,rg,ri,rieti,rimini,rm,rn,ro,roma,rome,rovigo,sa,salerno,sassari,savona,si,siena,siracusa,so,sondrio,sp,sr,ss,suedtirol,xn--sdtirol-n2a,sv,ta,taranto,te,tempio-olbia,tempioolbia,teramo,terni,tn,to,torino,tp,tr,trani-andria-barletta,trani-barletta-andria,traniandriabarletta,tranibarlettaandria,trapani,trento,treviso,trieste,ts,turin,tv,ud,udine,urbino-pesaro,urbinopesaro,va,varese,vb,vc,ve,venezia,venice,verbania,vercelli,verona,vi,vibo-valentia,vibovalentia,vicenza,viterbo,vr,vs,vt,vv<je>co,net,org<jm>*<jo>com,org,net,edu,sch,gov,mil,name<jobs,jp>ac,ad,co,ed,go,gr,lg,ne,or,aichi>aisai,ama,anjo,asuke,chiryu,chita,fuso,gamagori,handa,hazu,hekinan,higashiura,ichinomiya,inazawa,inuyama,isshiki,iwakura,kanie,kariya,kasugai,kira,kiyosu,komaki,konan,kota,mihama,miyoshi,nishio,nisshin,obu,oguchi,oharu,okazaki,owariasahi,seto,shikatsu,shinshiro,shitara,tahara,takahama,tobishima,toei,togo,tokai,tokoname,toyoake,toyohashi,toyokawa,toyone,toyota,tsushima,yatomi<akita>akita,daisen,fujisato,gojome,hachirogata,happou,higashinaruse,honjo,honjyo,ikawa,kamikoani,kamioka,katagami,kazuno,kitaakita,kosaka,kyowa,misato,mitane,moriyoshi,nikaho,noshiro,odate,oga,ogata,semboku,yokote,yurihonjo<aomori>aomori,gonohe,hachinohe,hashikami,hiranai,hirosaki,itayanagi,kuroishi,misawa,mutsu,nakadomari,noheji,oirase,owani,rokunohe,sannohe,shichinohe,shingo,takko,towada,tsugaru,tsuruta<chiba>abiko,asahi,chonan,chosei,choshi,chuo,funabashi,futtsu,hanamigawa,ichihara,ichikawa,ichinomiya,inzai,isumi,kamagaya,kamogawa,kashiwa,katori,katsuura,kimitsu,kisarazu,kozaki,kujukuri,kyonan,matsudo,midori,mihama,minamiboso,mobara,mutsuzawa,nagara,nagareyama,narashino,narita,noda,oamishirasato,omigawa,onjuku,otaki,sakae,sakura,shimofusa,shirako,shiroi,shisui,sodegaura,sosa,tako,tateyama,togane,tohnosho,tomisato,urayasu,yachimata,yachiyo,yokaichiba,yokoshibahikari,yotsukaido<ehime>ainan,honai,ikata,imabari,iyo,kamijima,kihoku,kumakogen,masaki,matsuno,matsuyama,namikata,niihama,ozu,saijo,seiyo,shikokuchuo,tobe,toon,uchiko,uwajima,yawatahama<fukui>echizen,eiheiji,fukui,ikeda,katsuyama,mihama,minamiechizen,obama,ohi,ono,sabae,sakai,takahama,tsuruga,wakasa<fukuoka>ashiya,buzen,chikugo,chikuho,chikujo,chikushino,chikuzen,chuo,dazaifu,fukuchi,hakata,higashi,hirokawa,hisayama,iizuka,inatsuki,kaho,kasuga,kasuya,kawara,keisen,koga,kurate,kurogi,kurume,minami,miyako,miyama,miyawaka,mizumaki,munakata,nakagawa,nakama,nishi,nogata,ogori,okagaki,okawa,oki,omuta,onga,onojo,oto,saigawa,sasaguri,shingu,shinyoshitomi,shonai,soeda,sue,tachiarai,tagawa,takata,toho,toyotsu,tsuiki,ukiha,umi,usui,yamada,yame,yanagawa,yukuhashi<fukushima>aizubange,aizumisato,aizuwakamatsu,asakawa,bandai,date,fukushima,furudono,futaba,hanawa,higashi,hirata,hirono,iitate,inawashiro,ishikawa,iwaki,izumizaki,kagamiishi,kaneyama,kawamata,kitakata,kitashiobara,koori,koriyama,kunimi,miharu,mishima,namie,nango,nishiaizu,nishigo,okuma,omotego,ono,otama,samegawa,shimogo,shirakawa,showa,soma,sukagawa,taishin,tamakawa,tanagura,tenei,yabuki,yamato,yamatsuri,yanaizu,yugawa<gifu>anpachi,ena,gifu,ginan,godo,gujo,hashima,hichiso,hida,higashishirakawa,ibigawa,ikeda,kakamigahara,kani,kasahara,kasamatsu,kawaue,kitagata,mino,minokamo,mitake,mizunami,motosu,nakatsugawa,ogaki,sakahogi,seki,sekigahara,shirakawa,tajimi,takayama,tarui,toki,tomika,wanouchi,yamagata,yaotsu,yoro<gunma>annaka,chiyoda,fujioka,higashiagatsuma,isesaki,itakura,kanna,kanra,katashina,kawaba,kiryu,kusatsu,maebashi,meiwa,midori,minakami,naganohara,nakanojo,nanmoku,numata,oizumi,ora,ota,shibukawa,shimonita,shinto,showa,takasaki,takayama,tamamura,tatebayashi,tomioka,tsukiyono,tsumagoi,ueno,yoshioka<hiroshima>asaminami,daiwa,etajima,fuchu,fukuyama,hatsukaichi,higashihiroshima,hongo,jinsekikogen,kaita,kui,kumano,kure,mihara,miyoshi,naka,onomichi,osakikamijima,otake,saka,sera,seranishi,shinichi,shobara,takehara<hokkaido>abashiri,abira,aibetsu,akabira,akkeshi,asahikawa,ashibetsu,ashoro,assabu,atsuma,bibai,biei,bifuka,bihoro,biratori,chippubetsu,chitose,date,ebetsu,embetsu,eniwa,erimo,esan,esashi,fukagawa,fukushima,furano,furubira,haboro,hakodate,hamatonbetsu,hidaka,higashikagura,higashikawa,hiroo,hokuryu,hokuto,honbetsu,horokanai,horonobe,ikeda,imakane,ishikari,iwamizawa,iwanai,kamifurano,kamikawa,kamishihoro,kamisunagawa,kamoenai,kayabe,kembuchi,kikonai,kimobetsu,kitahiroshima,kitami,kiyosato,koshimizu,kunneppu,kuriyama,kuromatsunai,kushiro,kutchan,kyowa,mashike,matsumae,mikasa,minamifurano,mombetsu,moseushi,mukawa,muroran,naie,nakagawa,nakasatsunai,nakatombetsu,nanae,nanporo,nayoro,nemuro,niikappu,niki,nishiokoppe,noboribetsu,numata,obihiro,obira,oketo,okoppe,otaru,otobe,otofuke,otoineppu,oumu,ozora,pippu,rankoshi,rebun,rikubetsu,rishiri,rishirifuji,saroma,sarufutsu,shakotan,shari,shibecha,shibetsu,shikabe,shikaoi,shimamaki,shimizu,shimokawa,shinshinotsu,shintoku,shiranuka,shiraoi,shiriuchi,sobetsu,sunagawa,taiki,takasu,takikawa,takinoue,teshikaga,tobetsu,tohma,tomakomai,tomari,toya,toyako,toyotomi,toyoura,tsubetsu,tsukigata,urakawa,urausu,uryu,utashinai,wakkanai,wassamu,yakumo,yoichi<hyogo>aioi,akashi,ako,amagasaki,aogaki,asago,ashiya,awaji,fukusaki,goshiki,harima,himeji,ichikawa,inagawa,itami,kakogawa,kamigori,kamikawa,kasai,kasuga,kawanishi,miki,minamiawaji,nishinomiya,nishiwaki,ono,sanda,sannan,sasayama,sayo,shingu,shinonsen,shiso,sumoto,taishi,taka,takarazuka,takasago,takino,tamba,tatsuno,toyooka,yabu,yashiro,yoka,yokawa<ibaraki>ami,asahi,bando,chikusei,daigo,fujishiro,hitachi,hitachinaka,hitachiomiya,hitachiota,ibaraki,ina,inashiki,itako,iwama,joso,kamisu,kasama,kashima,kasumigaura,koga,miho,mito,moriya,naka,namegata,oarai,ogawa,omitama,ryugasaki,sakai,sakuragawa,shimodate,shimotsuma,shirosato,sowa,suifu,takahagi,tamatsukuri,tokai,tomobe,tone,toride,tsuchiura,tsukuba,uchihara,ushiku,yachiyo,yamagata,yawara,yuki<ishikawa>anamizu,hakui,hakusan,kaga,kahoku,kanazawa,kawakita,komatsu,nakanoto,nanao,nomi,nonoichi,noto,shika,suzu,tsubata,tsurugi,uchinada,wajima<iwate>fudai,fujisawa,hanamaki,hiraizumi,hirono,ichinohe,ichinoseki,iwaizumi,iwate,joboji,kamaishi,kanegasaki,karumai,kawai,kitakami,kuji,kunohe,kuzumaki,miyako,mizusawa,morioka,ninohe,noda,ofunato,oshu,otsuchi,rikuzentakata,shiwa,shizukuishi,sumita,tanohata,tono,yahaba,yamada<kagawa>ayagawa,higashikagawa,kanonji,kotohira,manno,marugame,mitoyo,naoshima,sanuki,tadotsu,takamatsu,tonosho,uchinomi,utazu,zentsuji<kagoshima>akune,amami,hioki,isa,isen,izumi,kagoshima,kanoya,kawanabe,kinko,kouyama,makurazaki,matsumoto,minamitane,nakatane,nishinoomote,satsumasendai,soo,tarumizu,yusui<kanagawa>aikawa,atsugi,ayase,chigasaki,ebina,fujisawa,hadano,hakone,hiratsuka,isehara,kaisei,kamakura,kiyokawa,matsuda,minamiashigara,miura,nakai,ninomiya,odawara,oi,oiso,sagamihara,samukawa,tsukui,yamakita,yamato,yokosuka,yugawara,zama,zushi<kochi>aki,geisei,hidaka,higashitsuno,ino,kagami,kami,kitagawa,kochi,mihara,motoyama,muroto,nahari,nakamura,nankoku,nishitosa,niyodogawa,ochi,okawa,otoyo,otsuki,sakawa,sukumo,susaki,tosa,tosashimizu,toyo,tsuno,umaji,yasuda,yusuhara<kumamoto>amakusa,arao,aso,choyo,gyokuto,kamiamakusa,kikuchi,kumamoto,mashiki,mifune,minamata,minamioguni,nagasu,nishihara,oguni,ozu,sumoto,takamori,uki,uto,yamaga,yamato,yatsushiro<kyoto>ayabe,fukuchiyama,higashiyama,ide,ine,joyo,kameoka,kamo,kita,kizu,kumiyama,kyotamba,kyotanabe,kyotango,maizuru,minami,minamiyamashiro,miyazu,muko,nagaokakyo,nakagyo,nantan,oyamazaki,sakyo,seika,tanabe,uji,ujitawara,wazuka,yamashina,yawata<mie>asahi,inabe,ise,kameyama,kawagoe,kiho,kisosaki,kiwa,komono,kumano,kuwana,matsusaka,meiwa,mihama,minamiise,misugi,miyama,nabari,shima,suzuka,tado,taiki,taki,tamaki,toba,tsu,udono,ureshino,watarai,yokkaichi<miyagi>furukawa,higashimatsushima,ishinomaki,iwanuma,kakuda,kami,kawasaki,marumori,matsushima,minamisanriku,misato,murata,natori,ogawara,ohira,onagawa,osaki,rifu,semine,shibata,shichikashuku,shikama,shiogama,shiroishi,tagajo,taiwa,tome,tomiya,wakuya,watari,yamamoto,zao<miyazaki>aya,ebino,gokase,hyuga,kadogawa,kawaminami,kijo,kitagawa,kitakata,kitaura,kobayashi,kunitomi,kushima,mimata,miyakonojo,miyazaki,morotsuka,nichinan,nishimera,nobeoka,saito,shiiba,shintomi,takaharu,takanabe,takazaki,tsuno<nagano>achi,agematsu,anan,aoki,asahi,azumino,chikuhoku,chikuma,chino,fujimi,hakuba,hara,hiraya,iida,iijima,iiyama,iizuna,ikeda,ikusaka,ina,karuizawa,kawakami,kiso,kisofukushima,kitaaiki,komagane,komoro,matsukawa,matsumoto,miasa,minamiaiki,minamimaki,minamiminowa,minowa,miyada,miyota,mochizuki,nagano,nagawa,nagiso,nakagawa,nakano,nozawaonsen,obuse,ogawa,okaya,omachi,omi,ookuwa,ooshika,otaki,otari,sakae,sakaki,saku,sakuho,shimosuwa,shinanomachi,shiojiri,suwa,suzaka,takagi,takamori,takayama,tateshina,tatsuno,togakushi,togura,tomi,ueda,wada,yamagata,yamanouchi,yasaka,yasuoka<nagasaki>chijiwa,futsu,goto,hasami,hirado,iki,isahaya,kawatana,kuchinotsu,matsuura,nagasaki,obama,omura,oseto,saikai,sasebo,seihi,shimabara,shinkamigoto,togitsu,tsushima,unzen<nara>ando,gose,heguri,higashiyoshino,ikaruga,ikoma,kamikitayama,kanmaki,kashiba,kashihara,katsuragi,kawai,kawakami,kawanishi,koryo,kurotaki,mitsue,miyake,nara,nosegawa,oji,ouda,oyodo,sakurai,sango,shimoichi,shimokitayama,shinjo,soni,takatori,tawaramoto,tenkawa,tenri,uda,yamatokoriyama,yamatotakada,yamazoe,yoshino<niigata>aga,agano,gosen,itoigawa,izumozaki,joetsu,kamo,kariwa,kashiwazaki,minamiuonuma,mitsuke,muika,murakami,myoko,nagaoka,niigata,ojiya,omi,sado,sanjo,seiro,seirou,sekikawa,shibata,tagami,tainai,tochio,tokamachi,tsubame,tsunan,uonuma,yahiko,yoita,yuzawa<oita>beppu,bungoono,bungotakada,hasama,hiji,himeshima,hita,kamitsue,kokonoe,kuju,kunisaki,kusu,oita,saiki,taketa,tsukumi,usa,usuki,yufu<okayama>akaiwa,asakuchi,bizen,hayashima,ibara,kagamino,kasaoka,kibichuo,kumenan,kurashiki,maniwa,misaki,nagi,niimi,nishiawakura,okayama,satosho,setouchi,shinjo,shoo,soja,takahashi,tamano,tsuyama,wake,yakage<okinawa>aguni,ginowan,ginoza,gushikami,haebaru,higashi,hirara,iheya,ishigaki,ishikawa,itoman,izena,kadena,kin,kitadaito,kitanakagusuku,kumejima,kunigami,minamidaito,motobu,nago,naha,nakagusuku,nakijin,nanjo,nishihara,ogimi,okinawa,onna,shimoji,taketomi,tarama,tokashiki,tomigusuku,tonaki,urasoe,uruma,yaese,yomitan,yonabaru,yonaguni,zamami<osaka>abeno,chihayaakasaka,chuo,daito,fujiidera,habikino,hannan,higashiosaka,higashisumiyoshi,higashiyodogawa,hirakata,ibaraki,ikeda,izumi,izumiotsu,izumisano,kadoma,kaizuka,kanan,kashiwara,katano,kawachinagano,kishiwada,kita,kumatori,matsubara,minato,minoh,misaki,moriguchi,neyagawa,nishi,nose,osakasayama,sakai,sayama,sennan,settsu,shijonawate,shimamoto,suita,tadaoka,taishi,tajiri,takaishi,takatsuki,tondabayashi,toyonaka,toyono,yao<saga>ariake,arita,fukudomi,genkai,hamatama,hizen,imari,kamimine,kanzaki,karatsu,kashima,kitagata,kitahata,kiyama,kouhoku,kyuragi,nishiarita,ogi,omachi,ouchi,saga,shiroishi,taku,tara,tosu,yoshinogari<saitama>arakawa,asaka,chichibu,fujimi,fujimino,fukaya,hanno,hanyu,hasuda,hatogaya,hatoyama,hidaka,higashichichibu,higashimatsuyama,honjo,ina,iruma,iwatsuki,kamiizumi,kamikawa,kamisato,kasukabe,kawagoe,kawaguchi,kawajima,kazo,kitamoto,koshigaya,kounosu,kuki,kumagaya,matsubushi,minano,misato,miyashiro,miyoshi,moroyama,nagatoro,namegawa,niiza,ogano,ogawa,ogose,okegawa,omiya,otaki,ranzan,ryokami,saitama,sakado,satte,sayama,shiki,shiraoka,soka,sugito,toda,tokigawa,tokorozawa,tsurugashima,urawa,warabi,yashio,yokoze,yono,yorii,yoshida,yoshikawa,yoshimi<shiga>aisho,gamo,higashiomi,hikone,koka,konan,kosei,koto,kusatsu,maibara,moriyama,nagahama,nishiazai,notogawa,omihachiman,otsu,ritto,ryuoh,takashima,takatsuki,torahime,toyosato,yasu<shimane>akagi,ama,gotsu,hamada,higashiizumo,hikawa,hikimi,izumo,kakinoki,masuda,matsue,misato,nishinoshima,ohda,okinoshima,okuizumo,shimane,tamayu,tsuwano,unnan,yakumo,yasugi,yatsuka<shizuoka>arai,atami,fuji,fujieda,fujikawa,fujinomiya,fukuroi,gotemba,haibara,hamamatsu,higashiizu,ito,iwata,izu,izunokuni,kakegawa,kannami,kawanehon,kawazu,kikugawa,kosai,makinohara,matsuzaki,minamiizu,mishima,morimachi,nishiizu,numazu,omaezaki,shimada,shimizu,shimoda,shizuoka,susono,yaizu,yoshida<tochigi>ashikaga,bato,haga,ichikai,iwafune,kaminokawa,kanuma,karasuyama,kuroiso,mashiko,mibu,moka,motegi,nasu,nasushiobara,nikko,nishikata,nogi,ohira,ohtawara,oyama,sakura,sano,shimotsuke,shioya,takanezawa,tochigi,tsuga,ujiie,utsunomiya,yaita<tokushima>aizumi,anan,ichiba,itano,kainan,komatsushima,matsushige,mima,minami,miyoshi,mugi,nakagawa,naruto,sanagochi,shishikui,tokushima,wajiki<tokyo>adachi,akiruno,akishima,aogashima,arakawa,bunkyo,chiyoda,chofu,chuo,edogawa,fuchu,fussa,hachijo,hachioji,hamura,higashikurume,higashimurayama,higashiyamato,hino,hinode,hinohara,inagi,itabashi,katsushika,kita,kiyose,kodaira,koganei,kokubunji,komae,koto,kouzushima,kunitachi,machida,meguro,minato,mitaka,mizuho,musashimurayama,musashino,nakano,nerima,ogasawara,okutama,ome,oshima,ota,setagaya,shibuya,shinagawa,shinjuku,suginami,sumida,tachikawa,taito,tama,toshima<tottori>chizu,hino,kawahara,koge,kotoura,misasa,nanbu,nichinan,sakaiminato,tottori,wakasa,yazu,yonago<toyama>asahi,fuchu,fukumitsu,funahashi,himi,imizu,inami,johana,kamiichi,kurobe,nakaniikawa,namerikawa,nanto,nyuzen,oyabe,taira,takaoka,tateyama,toga,tonami,toyama,unazuki,uozu,yamada<wakayama>arida,aridagawa,gobo,hashimoto,hidaka,hirogawa,inami,iwade,kainan,kamitonda,katsuragi,kimino,kinokawa,kitayama,koya,koza,kozagawa,kudoyama,kushimoto,mihama,misato,nachikatsuura,shingu,shirahama,taiji,tanabe,wakayama,yuasa,yura<yamagata>asahi,funagata,higashine,iide,kahoku,kaminoyama,kaneyama,kawanishi,mamurogawa,mikawa,murayama,nagai,nakayama,nanyo,nishikawa,obanazawa,oe,oguni,ohkura,oishida,sagae,sakata,sakegawa,shinjo,shirataka,shonai,takahata,tendo,tozawa,tsuruoka,yamagata,yamanobe,yonezawa,yuza<yamaguchi>abu,hagi,hikari,hofu,iwakuni,kudamatsu,mitou,nagato,oshima,shimonoseki,shunan,tabuse,tokuyama,toyota,ube,yuu<yamanashi>chuo,doshi,fuefuki,fujikawa,fujikawaguchiko,fujiyoshida,hayakawa,hokuto,ichikawamisato,kai,kofu,koshu,kosuge,minami-alps,minobu,nakamichi,nanbu,narusawa,nirasaki,nishikatsura,oshino,otsuki,showa,tabayama,tsuru,uenohara,yamanakako,yamanashi<xn--4pvxs,xn--vgu402c,xn--c3s14m,xn--f6qx53a,xn--8pvr4u,xn--uist22h,xn--djrs72d6uy,xn--mkru45i,xn--0trq7p7nn,xn--8ltr62k,xn--2m4a15e,xn--efvn9s,xn--32vp30h,xn--4it797k,xn--1lqs71d,xn--5rtp49c,xn--5js045d,xn--ehqz56n,xn--1lqs03n,xn--qqqt11m,xn--kbrq7o,xn--pssu33l,xn--ntsq17g,xn--uisz3g,xn--6btw5a,xn--1ctwo,xn--6orx2r,xn--rht61e,xn--rht27z,xn--djty4k,xn--nit225k,xn--rht3d,xn--klty5x,xn--kltx9a,xn--kltp7d,xn--uuwu58a,xn--zbx025d,xn--ntso0iqx3a,xn--elqq16h,xn--4it168d,xn--klt787d,xn--rny31h,xn--7t0a264c,xn--5rtq34k,xn--k7yn95e,xn--tor131o,xn--d5qv7z876c,kawasaki>*,!city<kitakyushu>*,!city<kobe>*,!city<nagoya>*,!city<sapporo>*,!city<sendai>*,!city<yokohama>*,!city<<ke>ac,co,go,info,me,mobi,ne,or,sc<kg>org,net,com,edu,gov,mil<kh>*<ki>edu,biz,net,org,gov,info,com<km>org,nom,gov,prd,tm,edu,mil,ass,com,coop,asso,presse,medecin,notaires,pharmaciens,veterinaire,gouv<kn>net,org,edu,gov<kp>com,edu,gov,org,rep,tra<kr>ac,co,es,go,hs,kg,mil,ms,ne,or,pe,re,sc,busan,chungbuk,chungnam,daegu,daejeon,gangwon,gwangju,gyeongbuk,gyeonggi,gyeongnam,incheon,jeju,jeonbuk,jeonnam,seoul,ulsan<kw>com,edu,emb,gov,ind,net,org<ky>com,edu,net,org<kz>org,edu,net,gov,mil,com<la>int,net,info,edu,gov,per,com,org<lb>com,edu,gov,net,org<lc>com,net,co,org,edu,gov<li,lk>gov,sch,net,int,com,org,edu,ngo,soc,web,ltd,assn,grp,hotel,ac<lr>com,edu,gov,org,net<ls>ac,biz,co,edu,gov,info,net,org,sc<lt>gov<lu,lv>com,edu,gov,org,mil,id,net,asn,conf<ly>com,net,gov,plc,edu,sch,med,org,id<ma>co,net,gov,org,ac,press<mc>tm,asso<md,me>co,net,org,edu,ac,gov,its,priv<mg>org,nom,gov,prd,tm,edu,mil,com,co<mh,mil,mk>com,org,net,edu,gov,inf,name<ml>com,edu,gouv,gov,net,org,presse<mm>*<mn>gov,edu,org<mo>com,net,org,edu,gov<mobi,mp,mq,mr>gov<ms>com,edu,gov,net,org<mt>com,edu,net,org<mu>com,net,org,gov,ac,co,or<museum,mv>aero,biz,com,coop,edu,gov,info,int,mil,museum,name,net,org,pro<mw>ac,biz,co,com,coop,edu,gov,int,museum,net,org<mx>com,org,gob,edu,net<my>biz,com,edu,gov,mil,name,net,org<mz>ac,adv,co,edu,gov,mil,net,org<na>info,pro,name,school,or,dr,us,mx,ca,in,cc,tv,ws,mobi,co,com,org<name,nc>asso,nom<ne,net,nf>com,net,per,rec,web,arts,firm,info,other,store<ng>com,edu,gov,i,mil,mobi,name,net,org,sch<ni>ac,biz,co,com,edu,gob,in,info,int,mil,net,nom,org,web<nl,no>fhs,vgs,fylkesbibl,folkebibl,museum,idrett,priv,mil,stat,dep,kommune,herad,aa>gs<ah>gs<bu>gs<fm>gs<hl>gs<hm>gs<jan-mayen>gs<mr>gs<nl>gs<nt>gs<of>gs<ol>gs<oslo>gs<rl>gs<sf>gs<st>gs<svalbard>gs<tm>gs<tr>gs<va>gs<vf>gs<akrehamn,xn--krehamn-dxa,algard,xn--lgrd-poac,arna,brumunddal,bryne,bronnoysund,xn--brnnysund-m8ac,drobak,xn--drbak-wua,egersund,fetsund,floro,xn--flor-jra,fredrikstad,hokksund,honefoss,xn--hnefoss-q1a,jessheim,jorpeland,xn--jrpeland-54a,kirkenes,kopervik,krokstadelva,langevag,xn--langevg-jxa,leirvik,mjondalen,xn--mjndalen-64a,mo-i-rana,mosjoen,xn--mosjen-eya,nesoddtangen,orkanger,osoyro,xn--osyro-wua,raholt,xn--rholt-mra,sandnessjoen,xn--sandnessjen-ogb,skedsmokorset,slattum,spjelkavik,stathelle,stavern,stjordalshalsen,xn--stjrdalshalsen-sqb,tananger,tranby,vossevangen,afjord,xn--fjord-lra,agdenes,al,xn--l-1fa,alesund,xn--lesund-hua,alstahaug,alta,xn--lt-liac,alaheadju,xn--laheadju-7ya,alvdal,amli,xn--mli-tla,amot,xn--mot-tla,andebu,andoy,xn--andy-ira,andasuolo,ardal,xn--rdal-poa,aremark,arendal,xn--s-1fa,aseral,xn--seral-lra,asker,askim,askvoll,askoy,xn--asky-ira,asnes,xn--snes-poa,audnedaln,aukra,aure,aurland,aurskog-holand,xn--aurskog-hland-jnb,austevoll,austrheim,averoy,xn--avery-yua,balestrand,ballangen,balat,xn--blt-elab,balsfjord,bahccavuotna,xn--bhccavuotna-k7a,bamble,bardu,beardu,beiarn,bajddar,xn--bjddar-pta,baidar,xn--bidr-5nac,berg,bergen,berlevag,xn--berlevg-jxa,bearalvahki,xn--bearalvhki-y4a,bindal,birkenes,bjarkoy,xn--bjarky-fya,bjerkreim,bjugn,bodo,xn--bod-2na,badaddja,xn--bdddj-mrabd,budejju,bokn,bremanger,bronnoy,xn--brnny-wuac,bygland,bykle,barum,xn--brum-voa,telemark>bo,xn--b-5ga<nordland>bo,xn--b-5ga,heroy,xn--hery-ira<bievat,xn--bievt-0qa,bomlo,xn--bmlo-gra,batsfjord,xn--btsfjord-9za,bahcavuotna,xn--bhcavuotna-s4a,dovre,drammen,drangedal,dyroy,xn--dyry-ira,donna,xn--dnna-gra,eid,eidfjord,eidsberg,eidskog,eidsvoll,eigersund,elverum,enebakk,engerdal,etne,etnedal,evenes,evenassi,xn--eveni-0qa01ga,evje-og-hornnes,farsund,fauske,fuossko,fuoisku,fedje,fet,finnoy,xn--finny-yua,fitjar,fjaler,fjell,flakstad,flatanger,flekkefjord,flesberg,flora,fla,xn--fl-zia,folldal,forsand,fosnes,frei,frogn,froland,frosta,frana,xn--frna-woa,froya,xn--frya-hra,fusa,fyresdal,forde,xn--frde-gra,gamvik,gangaviika,xn--ggaviika-8ya47h,gaular,gausdal,gildeskal,xn--gildeskl-g0a,giske,gjemnes,gjerdrum,gjerstad,gjesdal,gjovik,xn--gjvik-wua,gloppen,gol,gran,grane,granvin,gratangen,grimstad,grong,kraanghke,xn--kranghke-b0a,grue,gulen,hadsel,halden,halsa,hamar,hamaroy,habmer,xn--hbmer-xqa,hapmir,xn--hpmir-xqa,hammerfest,hammarfeasta,xn--hmmrfeasta-s4ac,haram,hareid,harstad,hasvik,aknoluokta,xn--koluokta-7ya57h,hattfjelldal,aarborte,haugesund,hemne,hemnes,hemsedal,more-og-romsdal>heroy,sande<xn--mre-og-romsdal-qqb>xn--hery-ira,sande<hitra,hjartdal,hjelmeland,hobol,xn--hobl-ira,hof,hol,hole,holmestrand,holtalen,xn--holtlen-hxa,hornindal,horten,hurdal,hurum,hvaler,hyllestad,hagebostad,xn--hgebostad-g3a,hoyanger,xn--hyanger-q1a,hoylandet,xn--hylandet-54a,ha,xn--h-2fa,ibestad,inderoy,xn--indery-fya,iveland,jevnaker,jondal,jolster,xn--jlster-bya,karasjok,karasjohka,xn--krjohka-hwab49j,karlsoy,galsa,xn--gls-elac,karmoy,xn--karmy-yua,kautokeino,guovdageaidnu,klepp,klabu,xn--klbu-woa,kongsberg,kongsvinger,kragero,xn--krager-gya,kristiansand,kristiansund,krodsherad,xn--krdsherad-m8a,kvalsund,rahkkeravju,xn--rhkkervju-01af,kvam,kvinesdal,kvinnherad,kviteseid,kvitsoy,xn--kvitsy-fya,kvafjord,xn--kvfjord-nxa,giehtavuoatna,kvanangen,xn--kvnangen-k0a,navuotna,xn--nvuotna-hwa,kafjord,xn--kfjord-iua,gaivuotna,xn--givuotna-8ya,larvik,lavangen,lavagis,loabat,xn--loabt-0qa,lebesby,davvesiida,leikanger,leirfjord,leka,leksvik,lenvik,leangaviika,xn--leagaviika-52b,lesja,levanger,lier,lierne,lillehammer,lillesand,lindesnes,lindas,xn--linds-pra,lom,loppa,lahppi,xn--lhppi-xqa,lund,lunner,luroy,xn--lury-ira,luster,lyngdal,lyngen,ivgu,lardal,lerdal,xn--lrdal-sra,lodingen,xn--ldingen-q1a,lorenskog,xn--lrenskog-54a,loten,xn--lten-gra,malvik,masoy,xn--msy-ula0h,muosat,xn--muost-0qa,mandal,marker,marnardal,masfjorden,meland,meldal,melhus,meloy,xn--mely-ira,meraker,xn--merker-kua,moareke,xn--moreke-jua,midsund,midtre-gauldal,modalen,modum,molde,moskenes,moss,mosvik,malselv,xn--mlselv-iua,malatvuopmi,xn--mlatvuopmi-s4a,namdalseid,aejrie,namsos,namsskogan,naamesjevuemie,xn--nmesjevuemie-tcba,laakesvuemie,nannestad,narvik,narviika,naustdal,nedre-eiker,akershus>nes<buskerud>nes<nesna,nesodden,nesseby,unjarga,xn--unjrga-rta,nesset,nissedal,nittedal,nord-aurdal,nord-fron,nord-odal,norddal,nordkapp,davvenjarga,xn--davvenjrga-y4a,nordre-land,nordreisa,raisa,xn--risa-5na,nore-og-uvdal,notodden,naroy,xn--nry-yla5g,notteroy,xn--nttery-byae,odda,oksnes,xn--ksnes-uua,oppdal,oppegard,xn--oppegrd-ixa,orkdal,orland,xn--rland-uua,orskog,xn--rskog-uua,orsta,xn--rsta-fra,hedmark>os,valer,xn--vler-qoa<hordaland>os<osen,osteroy,xn--ostery-fya,ostre-toten,xn--stre-toten-zcb,overhalla,ovre-eiker,xn--vre-eiker-k8a,oyer,xn--yer-zna,oygarden,xn--ygarden-p1a,oystre-slidre,xn--ystre-slidre-ujb,porsanger,porsangu,xn--porsgu-sta26f,porsgrunn,radoy,xn--rady-ira,rakkestad,rana,ruovat,randaberg,rauma,rendalen,rennebu,rennesoy,xn--rennesy-v1a,rindal,ringebu,ringerike,ringsaker,rissa,risor,xn--risr-ira,roan,rollag,rygge,ralingen,xn--rlingen-mxa,rodoy,xn--rdy-0nab,romskog,xn--rmskog-bya,roros,xn--rros-gra,rost,xn--rst-0na,royken,xn--ryken-vua,royrvik,xn--ryrvik-bya,rade,xn--rde-ula,salangen,siellak,saltdal,salat,xn--slt-elab,xn--slat-5na,samnanger,vestfold>sande<sandefjord,sandnes,sandoy,xn--sandy-yua,sarpsborg,sauda,sauherad,sel,selbu,selje,seljord,sigdal,siljan,sirdal,skaun,skedsmo,ski,skien,skiptvet,skjervoy,xn--skjervy-v1a,skierva,xn--skierv-uta,skjak,xn--skjk-soa,skodje,skanland,xn--sknland-fxa,skanit,xn--sknit-yqa,smola,xn--smla-hra,snillfjord,snasa,xn--snsa-roa,snoasa,snaase,xn--snase-nra,sogndal,sokndal,sola,solund,songdalen,sortland,spydeberg,stange,stavanger,steigen,steinkjer,stjordal,xn--stjrdal-s1a,stokke,stor-elvdal,stord,stordal,storfjord,omasvuotna,strand,stranda,stryn,sula,suldal,sund,sunndal,surnadal,sveio,svelvik,sykkylven,sogne,xn--sgne-gra,somna,xn--smna-gra,sondre-land,xn--sndre-land-0cb,sor-aurdal,xn--sr-aurdal-l8a,sor-fron,xn--sr-fron-q1a,sor-odal,xn--sr-odal-q1a,sor-varanger,xn--sr-varanger-ggb,matta-varjjat,xn--mtta-vrjjat-k7af,sorfold,xn--srfold-bya,sorreisa,xn--srreisa-q1a,sorum,xn--srum-gra,tana,deatnu,time,tingvoll,tinn,tjeldsund,dielddanuorri,tjome,xn--tjme-hra,tokke,tolga,torsken,tranoy,xn--trany-yua,tromso,xn--troms-zua,tromsa,romsa,trondheim,troandin,trysil,trana,xn--trna-woa,trogstad,xn--trgstad-r1a,tvedestrand,tydal,tynset,tysfjord,divtasvuodna,divttasvuotna,tysnes,tysvar,xn--tysvr-vra,tonsberg,xn--tnsberg-q1a,ullensaker,ullensvang,ulvik,utsira,vadso,xn--vads-jra,cahcesuolo,xn--hcesuolo-7ya35b,vaksdal,valle,vang,vanylven,vardo,xn--vard-jra,varggat,xn--vrggt-xqad,vefsn,vaapste,vega,vegarshei,xn--vegrshei-c0a,vennesla,verdal,verran,vestby,vestnes,vestre-slidre,vestre-toten,vestvagoy,xn--vestvgy-ixa6o,vevelstad,vik,vikna,vindafjord,volda,voss,varoy,xn--vry-yla5g,vagan,xn--vgan-qoa,voagat,vagsoy,xn--vgsy-qoa0j,vaga,xn--vg-yiab,ostfold>valer<xn--stfold-9xa>xn--vler-qoa<<np>*<nr>biz,info,gov,edu,org,net,com<nu,nz>ac,co,cri,geek,gen,govt,health,iwi,kiwi,maori,mil,xn--mori-qsa,net,org,parliament,school<om>co,com,edu,gov,med,museum,net,org,pro<onion,org,pa>ac,gob,com,org,sld,edu,net,ing,abo,med,nom<pe>edu,gob,nom,mil,org,com,net<pf>com,org,edu<pg>*<ph>com,net,org,gov,edu,ngo,mil,i<pk>com,net,edu,org,fam,biz,web,gov,gob,gok,gon,gop,gos,info<pl>com,net,org,aid,agro,atm,auto,biz,edu,gmina,gsm,info,mail,miasta,media,mil,nieruchomosci,nom,pc,powiat,priv,realestate,rel,sex,shop,sklep,sos,szkola,targi,tm,tourism,travel,turystyka,gov>ap,griw,ic,is,kmpsp,konsulat,kppsp,kwp,kwpsp,mup,mw,oia,oirm,oke,oow,oschr,oum,pa,pinb,piw,po,pr,psp,psse,pup,rzgw,sa,sdn,sko,so,sr,starostwo,ug,ugim,um,umig,upow,uppo,us,uw,uzs,wif,wiih,winb,wios,witd,wiw,wkz,wsa,wskr,wsse,wuoz,wzmiuw,zp,zpisdn<augustow,babia-gora,bedzin,beskidy,bialowieza,bialystok,bielawa,bieszczady,boleslawiec,bydgoszcz,bytom,cieszyn,czeladz,czest,dlugoleka,elblag,elk,glogow,gniezno,gorlice,grajewo,ilawa,jaworzno,jelenia-gora,jgora,kalisz,kazimierz-dolny,karpacz,kartuzy,kaszuby,katowice,kepno,ketrzyn,klodzko,kobierzyce,kolobrzeg,konin,konskowola,kutno,lapy,lebork,legnica,lezajsk,limanowa,lomza,lowicz,lubin,lukow,malbork,malopolska,mazowsze,mazury,mielec,mielno,mragowo,naklo,nowaruda,nysa,olawa,olecko,olkusz,olsztyn,opoczno,opole,ostroda,ostroleka,ostrowiec,ostrowwlkp,pila,pisz,podhale,podlasie,polkowice,pomorze,pomorskie,prochowice,pruszkow,przeworsk,pulawy,radom,rawa-maz,rybnik,rzeszow,sanok,sejny,slask,slupsk,sosnowiec,stalowa-wola,skoczow,starachowice,stargard,suwalki,swidnica,swiebodzin,swinoujscie,szczecin,szczytno,tarnobrzeg,tgory,turek,tychy,ustka,walbrzych,warmia,warszawa,waw,wegrow,wielun,wlocl,wloclawek,wodzislaw,wolomin,wroclaw,zachpomor,zagan,zarow,zgora,zgorzelec<pm,pn>gov,co,org,edu,net<post,pr>com,net,org,gov,edu,isla,pro,biz,info,name,est,prof,ac<pro>aaa,aca,acct,avocat,bar,cpa,eng,jur,law,med,recht<ps>edu,gov,sec,plo,com,org,net<pt>net,gov,org,edu,int,publ,com,nome<pw>co,ne,or,ed,go,belau<py>com,coop,edu,gov,mil,net,org<qa>com,edu,gov,mil,name,net,org,sch<re>asso,com,nom<ro>arts,com,firm,info,nom,nt,org,rec,store,tm,www<rs>ac,co,edu,gov,in,org<ru,rw>ac,co,coop,gov,mil,net,org<sa>com,net,org,gov,med,pub,edu,sch<sb>com,edu,gov,net,org<sc>com,gov,net,org,edu<sd>com,net,org,edu,med,tv,gov,info<se>a,ac,b,bd,brand,c,d,e,f,fh,fhsk,fhv,g,h,i,k,komforb,kommunalforbund,komvux,l,lanbib,m,n,naturbruksgymn,o,org,p,parti,pp,press,r,s,t,tm,u,w,x,y,z<sg>com,net,org,gov,edu,per<sh>com,net,gov,org,mil<si,sj,sk,sl>com,net,edu,gov,org<sm,sn>art,com,edu,gouv,org,perso,univ<so>com,edu,gov,me,net,org<sr,ss>biz,com,edu,gov,me,net,org,sch<st>co,com,consulado,edu,embaixada,mil,net,org,principe,saotome,store<su,sv>com,edu,gob,org,red<sx>gov<sy>edu,gov,net,mil,com,org<sz>co,ac,org<tc,td,tel,tf,tg,th>ac,co,go,in,mi,net,or<tj>ac,biz,co,com,edu,go,gov,int,mil,name,net,nic,org,test,web<tk,tl>gov<tm>com,co,org,net,nom,gov,mil,edu<tn>com,ens,fin,gov,ind,info,intl,mincom,nat,net,org,perso,tourism<to>com,gov,net,org,edu,mil<tr>av,bbs,bel,biz,com,dr,edu,gen,gov,info,mil,k12,kep,name,net,org,pol,tel,tsk,tv,web,nc>gov<<tt>co,com,org,net,biz,info,pro,int,coop,jobs,mobi,travel,museum,aero,name,gov,edu<tv,tw>edu,gov,mil,com,net,org,idv,game,ebiz,club,xn--zf0ao64a,xn--uc0atv,xn--czrw28b<tz>ac,co,go,hotel,info,me,mil,mobi,ne,or,sc,tv<ua>com,edu,gov,in,net,org,cherkassy,cherkasy,chernigov,chernihiv,chernivtsi,chernovtsy,ck,cn,cr,crimea,cv,dn,dnepropetrovsk,dnipropetrovsk,donetsk,dp,if,ivano-frankivsk,kh,kharkiv,kharkov,kherson,khmelnitskiy,khmelnytskyi,kiev,kirovograd,km,kr,kropyvnytskyi,krym,ks,kv,kyiv,lg,lt,lugansk,luhansk,lutsk,lv,lviv,mk,mykolaiv,nikolaev,od,odesa,odessa,pl,poltava,rivne,rovno,rv,sb,sebastopol,sevastopol,sm,sumy,te,ternopil,uz,uzhgorod,uzhhorod,vinnica,vinnytsia,vn,volyn,yalta,zakarpattia,zaporizhzhe,zaporizhzhia,zhitomir,zhytomyr,zp,zt<ug>co,or,ac,sc,go,ne,com,org<uk>ac,co,gov,ltd,me,net,nhs,org,plc,police,sch>*<<us>dni,fed,isa,kids,nsn,ak>k12,cc,lib<al>k12,cc,lib<ar>k12,cc,lib<as>k12,cc,lib<az>k12,cc,lib<ca>k12,cc,lib<co>k12,cc,lib<ct>k12,cc,lib<dc>k12,cc,lib<de>cc<fl>k12,cc,lib<ga>k12,cc,lib<gu>k12,cc,lib<hi>cc,lib<ia>k12,cc,lib<id>k12,cc,lib<il>k12,cc,lib<in>k12,cc,lib<ks>k12,cc,lib<ky>k12,cc,lib<la>k12,cc,lib<ma>k12>pvt,chtr,paroch<cc,lib<md>k12,cc,lib<me>k12,cc,lib<mi>k12,cc,lib,ann-arbor,cog,dst,eaton,gen,mus,tec,washtenaw<mn>k12,cc,lib<mo>k12,cc,lib<ms>k12,cc,lib<mt>k12,cc,lib<nc>k12,cc,lib<nd>cc,lib<ne>k12,cc,lib<nh>k12,cc,lib<nj>k12,cc,lib<nm>k12,cc,lib<nv>k12,cc,lib<ny>k12,cc,lib<oh>k12,cc,lib<ok>k12,cc,lib<or>k12,cc,lib<pa>k12,cc,lib<pr>k12,cc,lib<ri>cc,lib<sc>k12,cc,lib<sd>cc,lib<tn>k12,cc,lib<tx>k12,cc,lib<ut>k12,cc,lib<vi>k12,cc,lib<vt>k12,cc,lib<va>k12,cc,lib<wa>k12,cc,lib<wi>k12,cc,lib<wv>cc<wy>k12,cc,lib<<uy>com,edu,gub,mil,net,org<uz>co,com,net,org<va,vc>com,net,org,gov,mil,edu<ve>arts,bib,co,com,e12,edu,firm,gob,gov,info,int,mil,net,nom,org,rar,rec,store,tec,web<vg,vi>co,com,k12,net,org<vn>ac,ai,biz,com,edu,gov,health,id,info,int,io,name,net,org,pro,angiang,bacgiang,backan,baclieu,bacninh,baria-vungtau,bentre,binhdinh,binhduong,binhphuoc,binhthuan,camau,cantho,caobang,daklak,daknong,danang,dienbien,dongnai,dongthap,gialai,hagiang,haiduong,haiphong,hanam,hanoi,hatinh,haugiang,hoabinh,hungyen,khanhhoa,kiengiang,kontum,laichau,lamdong,langson,laocai,longan,namdinh,nghean,ninhbinh,ninhthuan,phutho,phuyen,quangbinh,quangnam,quangngai,quangninh,quangtri,soctrang,sonla,tayninh,thaibinh,thainguyen,thanhhoa,thanhphohochiminh,thuathienhue,tiengiang,travinh,tuyenquang,vinhlong,vinhphuc,yenbai<vu>com,edu,net,org<wf,ws>com,net,org,gov,edu<yt,xn--mgbaam7a8h,xn--y9a3aq,xn--54b7fta0cc,xn--90ae,xn--mgbcpq6gpa1a,xn--90ais,xn--fiqs8s,xn--fiqz9s,xn--lgbbat1ad8j,xn--wgbh1c,xn--e1a4c,xn--qxa6a,xn--mgbah1a3hjkrd,xn--node,xn--qxam,xn--j6w193g>xn--55qx5d,xn--wcvs22d,xn--mxtq1m,xn--gmqw5a,xn--od0alg,xn--uc0atv<xn--2scrj9c,xn--3hcrj9c,xn--45br5cyl,xn--h2breg3eve,xn--h2brj9c8c,xn--mgbgu82a,xn--rvc1e0am3e,xn--h2brj9c,xn--mgbbh1a,xn--mgbbh1a71e,xn--fpcrj9c3d,xn--gecrj9c,xn--s9brj9c,xn--45brj9c,xn--xkc2dl3a5ee0h,xn--mgba3a4f16a,xn--mgba3a4fra,xn--mgbtx2b,xn--mgbayh7gpa,xn--3e0b707e,xn--80ao21a,xn--q7ce6a,xn--fzc2c9e2c,xn--xkc2al3hye2a,xn--mgbc0a9azcg,xn--d1alf,xn--l1acc,xn--mix891f,xn--mix082f,xn--mgbx4cd0ab,xn--mgb9awbf,xn--mgbai9azgqp6j,xn--mgbai9a5eva00b,xn--ygbi2ammx,xn--90a3ac>xn--o1ac,xn--c1avg,xn--90azh,xn--d1at,xn--o1ach,xn--80au<xn--p1ai,xn--wgbl6a,xn--mgberp4a5d4ar,xn--mgberp4a5d4a87g,xn--mgbqly7c0a67fbc,xn--mgbqly7cvafr,xn--mgbpl2fh,xn--yfro4i67o,xn--clchc0ea0b2g2a9gcd,xn--ogbpf8fl,xn--mgbtf8fl,xn--o3cw4h>xn--12c1fe0br,xn--12co0c3b4eva,xn--h3cuzk1di,xn--o3cyx2a,xn--m3ch0j3a,xn--12cfi8ixb8l<xn--pgbs0dh,xn--kpry57d,xn--kprw13d,xn--nnx388a,xn--j1amh,xn--mgb2ddes,xxx,ye>com,edu,gov,net,mil,org<za>ac,agric,alt,co,edu,gov,grondar,law,mil,net,ngo,nic,nis,nom,org,school,tm,web<zm>ac,biz,co,com,edu,gov,info,mil,net,org,sch<zw>ac,co,gov,mil,org<aaa,aarp,abb,abbott,abbvie,abc,able,abogado,abudhabi,academy,accenture,accountant,accountants,aco,actor,ads,adult,aeg,aetna,afl,africa,agakhan,agency,aig,airbus,airforce,airtel,akdn,alibaba,alipay,allfinanz,allstate,ally,alsace,alstom,amazon,americanexpress,americanfamily,amex,amfam,amica,amsterdam,analytics,android,anquan,anz,aol,apartments,app,apple,aquarelle,arab,aramco,archi,army,art,arte,asda,associates,athleta,attorney,auction,audi,audible,audio,auspost,author,auto,autos,avianca,aws,axa,azure,baby,baidu,banamex,band,bank,bar,barcelona,barclaycard,barclays,barefoot,bargains,baseball,basketball,bauhaus,bayern,bbc,bbt,bbva,bcg,bcn,beats,beauty,beer,bentley,berlin,best,bestbuy,bet,bharti,bible,bid,bike,bing,bingo,bio,black,blackfriday,blockbuster,blog,bloomberg,blue,bms,bmw,bnpparibas,boats,boehringer,bofa,bom,bond,boo,book,booking,bosch,bostik,boston,bot,boutique,box,bradesco,bridgestone,broadway,broker,brother,brussels,build,builders,business,buy,buzz,bzh,cab,cafe,cal,call,calvinklein,cam,camera,camp,canon,capetown,capital,capitalone,car,caravan,cards,care,career,careers,cars,casa,case,cash,casino,catering,catholic,cba,cbn,cbre,center,ceo,cern,cfa,cfd,chanel,channel,charity,chase,chat,cheap,chintai,christmas,chrome,church,cipriani,circle,cisco,citadel,citi,citic,city,claims,cleaning,click,clinic,clinique,clothing,cloud,club,clubmed,coach,codes,coffee,college,cologne,commbank,community,company,compare,computer,comsec,condos,construction,consulting,contact,contractors,cooking,cool,corsica,country,coupon,coupons,courses,cpa,credit,creditcard,creditunion,cricket,crown,crs,cruise,cruises,cuisinella,cymru,cyou,dabur,dad,dance,data,date,dating,datsun,day,dclk,dds,deal,dealer,deals,degree,delivery,dell,deloitte,delta,democrat,dental,dentist,desi,design,dev,dhl,diamonds,diet,digital,direct,directory,discount,discover,dish,diy,dnp,docs,doctor,dog,domains,dot,download,drive,dtv,dubai,dunlop,dupont,durban,dvag,dvr,earth,eat,eco,edeka,education,email,emerck,energy,engineer,engineering,enterprises,epson,equipment,ericsson,erni,esq,estate,eurovision,eus,events,exchange,expert,exposed,express,extraspace,fage,fail,fairwinds,faith,family,fan,fans,farm,farmers,fashion,fast,fedex,feedback,ferrari,ferrero,fidelity,fido,film,final,finance,financial,fire,firestone,firmdale,fish,fishing,fit,fitness,flickr,flights,flir,florist,flowers,fly,foo,food,football,ford,forex,forsale,forum,foundation,fox,free,fresenius,frl,frogans,frontier,ftr,fujitsu,fun,fund,furniture,futbol,fyi,gal,gallery,gallo,gallup,game,games,gap,garden,gay,gbiz,gdn,gea,gent,genting,george,ggee,gift,gifts,gives,giving,glass,gle,global,globo,gmail,gmbh,gmo,gmx,godaddy,gold,goldpoint,golf,goo,goodyear,goog,google,gop,got,grainger,graphics,gratis,green,gripe,grocery,group,guardian,gucci,guge,guide,guitars,guru,hair,hamburg,hangout,haus,hbo,hdfc,hdfcbank,health,healthcare,help,helsinki,here,hermes,hiphop,hisamitsu,hitachi,hiv,hkt,hockey,holdings,holiday,homedepot,homegoods,homes,homesense,honda,horse,hospital,host,hosting,hot,hotels,hotmail,house,how,hsbc,hughes,hyatt,hyundai,ibm,icbc,ice,icu,ieee,ifm,ikano,imamat,imdb,immo,immobilien,inc,industries,infiniti,ing,ink,institute,insurance,insure,international,intuit,investments,ipiranga,irish,ismaili,ist,istanbul,itau,itv,jaguar,java,jcb,jeep,jetzt,jewelry,jio,jll,jmp,jnj,joburg,jot,joy,jpmorgan,jprs,juegos,juniper,kaufen,kddi,kerryhotels,kerrylogistics,kerryproperties,kfh,kia,kids,kim,kindle,kitchen,kiwi,koeln,komatsu,kosher,kpmg,kpn,krd,kred,kuokgroup,kyoto,lacaixa,lamborghini,lamer,lancaster,land,landrover,lanxess,lasalle,lat,latino,latrobe,law,lawyer,lds,lease,leclerc,lefrak,legal,lego,lexus,lgbt,lidl,life,lifeinsurance,lifestyle,lighting,like,lilly,limited,limo,lincoln,link,lipsy,live,living,llc,llp,loan,loans,locker,locus,lol,london,lotte,lotto,love,lpl,lplfinancial,ltd,ltda,lundbeck,luxe,luxury,madrid,maif,maison,makeup,man,management,mango,map,market,marketing,markets,marriott,marshalls,mattel,mba,mckinsey,med,media,meet,melbourne,meme,memorial,men,menu,merckmsd,miami,microsoft,mini,mint,mit,mitsubishi,mlb,mls,mma,mobile,moda,moe,moi,mom,monash,money,monster,mormon,mortgage,moscow,moto,motorcycles,mov,movie,msd,mtn,mtr,music,nab,nagoya,natura,navy,nba,nec,netbank,netflix,network,neustar,new,news,next,nextdirect,nexus,nfl,ngo,nhk,nico,nike,nikon,ninja,nissan,nissay,nokia,norton,now,nowruz,nowtv,nra,nrw,ntt,nyc,obi,observer,office,okinawa,olayan,olayangroup,ollo,omega,one,ong,onl,online,ooo,open,oracle,orange,organic,origins,osaka,otsuka,ott,ovh,page,panasonic,paris,pars,partners,parts,party,pay,pccw,pet,pfizer,pharmacy,phd,philips,phone,photo,photography,photos,physio,pics,pictet,pictures,pid,pin,ping,pink,pioneer,pizza,place,play,playstation,plumbing,plus,pnc,pohl,poker,politie,porn,pramerica,praxi,press,prime,prod,productions,prof,progressive,promo,properties,property,protection,pru,prudential,pub,pwc,qpon,quebec,quest,racing,radio,read,realestate,realtor,realty,recipes,red,redstone,redumbrella,rehab,reise,reisen,reit,reliance,ren,rent,rentals,repair,report,republican,rest,restaurant,review,reviews,rexroth,rich,richardli,ricoh,ril,rio,rip,rocks,rodeo,rogers,room,rsvp,rugby,ruhr,run,rwe,ryukyu,saarland,safe,safety,sakura,sale,salon,samsclub,samsung,sandvik,sandvikcoromant,sanofi,sap,sarl,sas,save,saxo,sbi,sbs,scb,schaeffler,schmidt,scholarships,school,schule,schwarz,science,scot,search,seat,secure,security,seek,select,sener,services,seven,sew,sex,sexy,sfr,shangrila,sharp,shaw,shell,shia,shiksha,shoes,shop,shopping,shouji,show,silk,sina,singles,site,ski,skin,sky,skype,sling,smart,smile,sncf,soccer,social,softbank,software,sohu,solar,solutions,song,sony,soy,spa,space,sport,spot,srl,stada,staples,star,statebank,statefarm,stc,stcgroup,stockholm,storage,store,stream,studio,study,style,sucks,supplies,supply,support,surf,surgery,suzuki,swatch,swiss,sydney,systems,tab,taipei,talk,taobao,target,tatamotors,tatar,tattoo,tax,taxi,tci,tdk,team,tech,technology,temasek,tennis,teva,thd,theater,theatre,tiaa,tickets,tienda,tips,tires,tirol,tjmaxx,tjx,tkmaxx,tmall,today,tokyo,tools,top,toray,toshiba,total,tours,town,toyota,toys,trade,trading,training,travel,travelers,travelersinsurance,trust,trv,tube,tui,tunes,tushu,tvs,ubank,ubs,unicom,university,uno,uol,ups,vacations,vana,vanguard,vegas,ventures,verisign,versicherung,vet,viajes,video,vig,viking,villas,vin,vip,virgin,visa,vision,viva,vivo,vlaanderen,vodka,volvo,vote,voting,voto,voyage,wales,walmart,walter,wang,wanggou,watch,watches,weather,weatherchannel,webcam,weber,website,wed,wedding,weibo,weir,whoswho,wien,wiki,williamhill,win,windows,wine,winners,wme,wolterskluwer,woodside,work,works,world,wow,wtc,wtf,xbox,xerox,xihuan,xin,xn--11b4c3d,xn--1ck2e1b,xn--1qqw23a,xn--30rr7y,xn--3bst00m,xn--3ds443g,xn--3pxu8k,xn--42c2d9a,xn--45q11c,xn--4gbrim,xn--55qw42g,xn--55qx5d,xn--5su34j936bgsg,xn--5tzm5g,xn--6frz82g,xn--6qq986b3xl,xn--80adxhks,xn--80aqecdr1a,xn--80asehdb,xn--80aswg,xn--8y0a063a,xn--9dbq2a,xn--9et52u,xn--9krt00a,xn--b4w605ferd,xn--bck1b9a5dre4c,xn--c1avg,xn--c2br7g,xn--cck2b3b,xn--cckwcxetd,xn--cg4bki,xn--czr694b,xn--czrs0t,xn--czru2d,xn--d1acj3b,xn--eckvdtc9d,xn--efvy88h,xn--fct429k,xn--fhbei,xn--fiq228c5hs,xn--fiq64b,xn--fjq720a,xn--flw351e,xn--fzys8d69uvgm,xn--g2xx48c,xn--gckr3f0f,xn--gk3at1e,xn--hxt814e,xn--i1b6b1a6a2e,xn--imr513n,xn--io0a7i,xn--j1aef,xn--jlq480n2rg,xn--jvr189m,xn--kcrx77d1x4a,xn--kput3i,xn--mgba3a3ejt,xn--mgba7c0bbn0a,xn--mgbab2bd,xn--mgbca7dzdo,xn--mgbi4ecexp,xn--mgbt3dhd,xn--mk1bu44c,xn--mxtq1m,xn--ngbc5azd,xn--ngbe9e0a,xn--ngbrx,xn--nqv7f,xn--nqv7fs00ema,xn--nyqy26a,xn--otu796d,xn--p1acf,xn--pssy2u,xn--q9jyb4c,xn--qcka1pmc,xn--rhqv96g,xn--rovu88b,xn--ses554g,xn--t60b56a,xn--tckwe,xn--tiq49xqyj,xn--unup4y,xn--vermgensberater-ctb,xn--vermgensberatung-pwb,xn--vhquv,xn--vuq861b,xn--w4r85el8fhu5dnra,xn--w4rs40l,xn--xhq521b,xn--zfr164b,xyz,yachts,yahoo,yamaxun,yandex,yodobashi,yoga,yokohama,you,youtube,yun,zappos,zara,zero,zip,zone,zuerich';
		},
		'./node_modules/parse-domain/serialized-tries/private.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			/* harmony default export */ __webpack_exports__['default'] =
				'dev>12chars,panel,autocode,lcl>*<lclstage>*<stg>*<stgstage>*<pages,r2,workers,curv,deno,deno-staging,deta,fly,githubpreview,gateway>*<iserv,localcert>user>*<<loginline,mediatech,modx,ngrok,ngrok-free,platter-app,replit>archer,bones,canary,global,hacker,id,janeway,kim,kira,kirk,odo,paris,picard,pike,prerelease,reed,riker,sisko,spock,staging,sulu,tarpit,teams,tucker,wesley,worf<shiftcrypto,vercel,webhare>*<<it>12chars,blogspot,ibxos,iliadboxos,neen>jc<tim>open>jelastic>cloud<<<16-b,32-b,64-b,123homepage,myspreadshop,syncloud<pro>12chars,cloudns,dnstrace>bci<barsy,ngrok<ua>cc,inf,ltd,cx,ie,biz,co,pp,v<to>611,oya,rdv,x0,vpnplus,quickconnect>direct<nyan<com>a2hosted,cpserver,devcdnaccesso>*<adobeaemcloud>dev>*<<airkitapps,airkitapps-au,aivencloud,kasserver,amazonaws>af-south-1>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint,s3-website<s3,s3-accesspoint,s3-object-lambda,s3-website,aws-cloud9>webview-assets<cloud9>vfs,webview-assets<<ap-east-1>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint<s3,s3-accesspoint,s3-object-lambda,s3-website,aws-cloud9>webview-assets<cloud9>vfs,webview-assets<<ap-northeast-1>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint,s3-website<s3,s3-accesspoint,s3-object-lambda,s3-website,analytics-gateway,aws-cloud9>webview-assets<cloud9>vfs,webview-assets<<ap-northeast-2>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint,s3-website<s3,s3-accesspoint,s3-object-lambda,s3-website,analytics-gateway,aws-cloud9>webview-assets<cloud9>vfs,webview-assets<<ap-northeast-3>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint,s3-website<s3,s3-accesspoint,s3-object-lambda,s3-website,aws-cloud9>webview-assets<cloud9>vfs,webview-assets<<ap-south-1>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint,s3-website<s3,s3-accesspoint,s3-object-lambda,s3-website,analytics-gateway,aws-cloud9>webview-assets<cloud9>vfs,webview-assets<<ap-south-2>execute-api,dualstack>s3,s3-accesspoint<s3,s3-accesspoint,s3-object-lambda,s3-website<ap-southeast-1>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint,s3-website<s3,s3-accesspoint,s3-object-lambda,s3-website,analytics-gateway,aws-cloud9>webview-assets<cloud9>vfs,webview-assets<<ap-southeast-2>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint,s3-website<s3,s3-accesspoint,s3-object-lambda,s3-website,analytics-gateway,aws-cloud9>webview-assets<cloud9>vfs,webview-assets<<ap-southeast-3>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint<s3,s3-accesspoint,s3-object-lambda,s3-website<ap-southeast-4>execute-api,dualstack>s3,s3-accesspoint<s3,s3-accesspoint,s3-object-lambda,s3-website<ca-central-1>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint,s3-accesspoint-fips,s3-fips,s3-website<s3,s3-accesspoint,s3-accesspoint-fips,s3-fips,s3-object-lambda,s3-website,aws-cloud9>webview-assets<cloud9>vfs,webview-assets<<ca-west-1>execute-api,dualstack>s3,s3-accesspoint,s3-accesspoint-fips,s3-fips,s3-website<s3,s3-accesspoint,s3-accesspoint-fips,s3-fips,s3-website<eu-central-1>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint,s3-website<s3,s3-accesspoint,s3-object-lambda,s3-website,analytics-gateway,aws-cloud9>webview-assets<cloud9>vfs,webview-assets<<eu-central-2>execute-api,dualstack>s3,s3-accesspoint<s3,s3-accesspoint,s3-object-lambda,s3-website<eu-north-1>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint<s3,s3-accesspoint,s3-object-lambda,s3-website,aws-cloud9>webview-assets<cloud9>vfs,webview-assets<<eu-south-1>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint,s3-website<s3,s3-accesspoint,s3-object-lambda,s3-website,aws-cloud9>webview-assets<cloud9>vfs,webview-assets<<eu-south-2>execute-api,dualstack>s3,s3-accesspoint<s3,s3-accesspoint,s3-object-lambda,s3-website<eu-west-1>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint,s3-website<s3,s3-accesspoint,s3-deprecated,s3-object-lambda,s3-website,analytics-gateway,aws-cloud9>webview-assets<cloud9>vfs,webview-assets<<eu-west-2>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint<s3,s3-accesspoint,s3-object-lambda,s3-website,aws-cloud9>webview-assets<cloud9>vfs,webview-assets<<eu-west-3>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint,s3-website<s3,s3-accesspoint,s3-object-lambda,s3-website,aws-cloud9>webview-assets<cloud9>vfs,webview-assets<<il-central-1>execute-api,dualstack>s3,s3-accesspoint<s3,s3-accesspoint,s3-object-lambda,s3-website,aws-cloud9>webview-assets<cloud9>vfs<<me-central-1>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint<s3,s3-accesspoint,s3-object-lambda,s3-website<me-south-1>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint<s3,s3-accesspoint,s3-object-lambda,s3-website,aws-cloud9>webview-assets<cloud9>vfs,webview-assets<<sa-east-1>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint,s3-website<s3,s3-accesspoint,s3-object-lambda,s3-website,aws-cloud9>webview-assets<cloud9>vfs,webview-assets<<us-east-1>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint,s3-accesspoint-fips,s3-fips,s3-website<s3,s3-accesspoint,s3-accesspoint-fips,s3-deprecated,s3-fips,s3-object-lambda,s3-website,analytics-gateway,aws-cloud9>webview-assets<cloud9>vfs,webview-assets<<us-east-2>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint,s3-accesspoint-fips,s3-fips<s3,s3-accesspoint,s3-accesspoint-fips,s3-deprecated,s3-fips,s3-object-lambda,s3-website,analytics-gateway,aws-cloud9>webview-assets<cloud9>vfs,webview-assets<<us-gov-east-1>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint,s3-accesspoint-fips,s3-fips<s3,s3-accesspoint,s3-accesspoint-fips,s3-fips,s3-object-lambda,s3-website<us-gov-west-1>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint,s3-accesspoint-fips,s3-fips<s3,s3-accesspoint,s3-accesspoint-fips,s3-fips,s3-object-lambda,s3-website<us-west-1>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint,s3-accesspoint-fips,s3-fips,s3-website<s3,s3-accesspoint,s3-accesspoint-fips,s3-fips,s3-object-lambda,s3-website,aws-cloud9>webview-assets<cloud9>vfs,webview-assets<<us-west-2>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint,s3-accesspoint-fips,s3-fips,s3-website<s3,s3-accesspoint,s3-accesspoint-fips,s3-deprecated,s3-fips,s3-object-lambda,s3-website,analytics-gateway,aws-cloud9>webview-assets<cloud9>vfs,webview-assets<<compute>*<compute-1>*<airflow>ap-northeast-1>*<ap-northeast-2>*<ap-south-1>*<ap-southeast-1>*<ap-southeast-2>*<ca-central-1>*<eu-central-1>*<eu-north-1>*<eu-west-1>*<eu-west-2>*<eu-west-3>*<sa-east-1>*<us-east-1>*<us-east-2>*<us-west-2>*<<s3,s3-1,s3-ap-east-1,s3-ap-northeast-1,s3-ap-northeast-2,s3-ap-northeast-3,s3-ap-south-1,s3-ap-southeast-1,s3-ap-southeast-2,s3-ca-central-1,s3-eu-central-1,s3-eu-north-1,s3-eu-west-1,s3-eu-west-2,s3-eu-west-3,s3-external-1,s3-fips-us-gov-east-1,s3-fips-us-gov-west-1,s3-global>accesspoint>mrap<<s3-me-south-1,s3-sa-east-1,s3-us-east-2,s3-us-gov-east-1,s3-us-gov-west-1,s3-us-west-1,s3-us-west-2,s3-website-ap-northeast-1,s3-website-ap-southeast-1,s3-website-ap-southeast-2,s3-website-eu-west-1,s3-website-sa-east-1,s3-website-us-east-1,s3-website-us-gov-west-1,s3-website-us-west-1,s3-website-us-west-2,elb>*<<amazoncognito>af-south-1>auth<ap-northeast-1>auth<ap-northeast-2>auth<ap-northeast-3>auth<ap-south-1>auth<ap-southeast-1>auth<ap-southeast-2>auth<ap-southeast-3>auth<ca-central-1>auth<eu-central-1>auth<eu-north-1>auth<eu-south-1>auth<eu-west-1>auth<eu-west-2>auth<eu-west-3>auth<il-central-1>auth<me-south-1>auth<sa-east-1>auth<us-east-1>auth,auth-fips<us-east-2>auth,auth-fips<us-gov-west-1>auth-fips<us-west-1>auth,auth-fips<us-west-2>auth,auth-fips<<amplifyapp>*<awsapprunner>*<elasticbeanstalk>af-south-1,ap-east-1,ap-northeast-1,ap-northeast-2,ap-northeast-3,ap-south-1,ap-southeast-1,ap-southeast-2,ap-southeast-3,ca-central-1,eu-central-1,eu-north-1,eu-south-1,eu-west-1,eu-west-2,eu-west-3,il-central-1,me-south-1,sa-east-1,us-east-1,us-east-2,us-gov-east-1,us-gov-west-1,us-west-1,us-west-2<awsglobalaccelerator,siiites,appspacehosted,appspaceusercontent,on-aptible,myasustor,balena-devices,betainabox,boutir,bplaced,cafjs,canva-apps,br,cn,de,eu,jpn,mex,ru,sa,uk,us,za,ar,hu,kr,no,qc,uy,africa,gr,co,jdevcloud,wpdevcloud,cloudcontrolled,cloudcontrolapp,cf-ipfs,cloudflare-ipfs,trycloudflare,cprapid>*<customer-oci>*,oci>*<ocp>*<ocs>*<<cyclic-app,dattolocal,dattorelay,dattoweb,mydatto,builtwithdark,datadetect>demo,instance<ddns5,discordsays,discordsez,drayddns,dreamhosters,mydrobo,dyndns-at-home,dyndns-at-work,dyndns-blog,dyndns-free,dyndns-home,dyndns-ip,dyndns-mail,dyndns-office,dyndns-pics,dyndns-remote,dyndns-server,dyndns-web,dyndns-wiki,dyndns-work,blogdns,cechire,dnsalias,dnsdojo,doesntexist,dontexist,doomdns,dyn-o-saur,dynalias,est-a-la-maison,est-a-la-masion,est-le-patron,est-mon-blogueur,from-ak,from-al,from-ar,from-ca,from-ct,from-dc,from-de,from-fl,from-ga,from-hi,from-ia,from-id,from-il,from-in,from-ks,from-ky,from-ma,from-md,from-mi,from-mn,from-mo,from-ms,from-mt,from-nc,from-nd,from-ne,from-nh,from-nj,from-nm,from-nv,from-oh,from-ok,from-or,from-pa,from-pr,from-ri,from-sc,from-sd,from-tn,from-tx,from-ut,from-va,from-vt,from-wa,from-wi,from-wv,from-wy,getmyip,gotdns,hobby-site,homelinux,homeunix,iamallama,is-a-anarchist,is-a-blogger,is-a-bookkeeper,is-a-bulls-fan,is-a-caterer,is-a-chef,is-a-conservative,is-a-cpa,is-a-cubicle-slave,is-a-democrat,is-a-designer,is-a-doctor,is-a-financialadvisor,is-a-geek,is-a-green,is-a-guru,is-a-hard-worker,is-a-hunter,is-a-landscaper,is-a-lawyer,is-a-liberal,is-a-libertarian,is-a-llama,is-a-musician,is-a-nascarfan,is-a-nurse,is-a-painter,is-a-personaltrainer,is-a-photographer,is-a-player,is-a-republican,is-a-rockstar,is-a-socialist,is-a-student,is-a-teacher,is-a-techie,is-a-therapist,is-an-accountant,is-an-actor,is-an-actress,is-an-anarchist,is-an-artist,is-an-engineer,is-an-entertainer,is-certified,is-gone,is-into-anime,is-into-cars,is-into-cartoons,is-into-games,is-leet,is-not-certified,is-slick,is-uberleet,is-with-theband,isa-geek,isa-hockeynut,issmarterthanyou,likes-pie,likescandy,neat-url,saves-the-whales,selfip,sells-for-less,sells-for-u,servebbs,simple-url,space-to-rent,teaches-yoga,writesthisblog,digitaloceanspaces>*<ddnsfree,ddnsgeek,giize,gleeze,kozow,loseyourip,ooguy,theworkpc,mytuleap,tuleap-partners,encoreapi,evennode>eu-1,eu-2,eu-3,eu-4,us-1,us-2,us-3,us-4<onfabrica,fastly-edge,fastly-terrarium,fastvps-server,mydobiss,firebaseapp,fldrv,forgeblocks,framercanvas,freebox-os,freeboxos,freemyip,aliases121,gentapps,gentlentapis,githubusercontent,0emm>*<appspot>r>*<<codespot,googleapis,googlecode,pagespeedmobilizer,publishproxy,withgoogle,withyoutube,blogspot,awsmppl,herokuapp,herokussl,impertrixcdn,impertrix,smushcdn,wphostedmail,wpmucdn,pixolino,amscompute,dopaas,hosted-by-previder>paas<hosteur>rag-cloud,rag-cloud-ch<ik-server>jcloud,jcloud-ver-jpc<jelastic>demo<kilatiron,massivegrid>paas<wafaicloud>jed,lon,ryd<joyent>cns>*<<ktistory,lpusercontent,lmpm>app<linode>members,nodebalancer>*<<linodeobjects>*<linodeusercontent>ip<barsycenter,barsyonline,mazeplay,miniserver,atmeta,fbsbx>apps<meteorapp>eu<azure>cloudapp>*<<hostedpi,mythic-beasts>customer,caracal,fentiger,lynx,ocelot,oncilla,onza,sphinx,vs,x,yali<nospamproxy>cloud<4u,nfshost,001www,ddnslive,myiphost,blogsyte,ciscofreak,damnserver,ditchyourip,dnsiskinky,dynns,geekgalaxy,health-carereform,homesecuritymac,homesecuritypc,myactivedirectory,mysecuritycamera,net-freaks,onthewifi,point2this,quicksytes,securitytactics,serveexchange,servehumour,servep2p,servesarcasm,stufftoread,unusualperson,workisboring,3utilities,ddnsking,myvnc,servebeer,servecounterstrike,serveftp,servegame,servehalflife,servehttp,serveirc,servemp3,servepics,servequake,observableusercontent>static<simplesite,orsites,operaunite,authgear-staging,authgearapps,skygearapp,outsystemscloud,ownprovider,pgfog,pagefrontapp,pagexl,paywhirl>*<gotpantheon,upsunapp,platter-app,pleskns,postman-echo,prgmr>xen<pythonanywhere>eu<qualifioapp,ladesk,qbuser,qa2,dev-myqnapcloud,alpha-myqnapcloud,myqnapcloud,quipelements>*<rackmaze,rhcloud,render>app<onrender,180r,dojin,sakuratan,sakuraweb,x0,code>builder>*<dev-builder>*<stg-builder>*<<salesforce>platform>code-builder-stg>test>001>*<<<<<logoip,scrysec,firewall-gateway,myshopblocks,myshopify,shopitsite,1kapp,appchizi,applinzi,sinaapp,vipsinaapp,bounty-full>alpha,beta<streamlitapp,try-snowplow,stackhero-network,playstation-cloud,myspreadshop,stdlib>api<streak-link,streaklinks,streakusercontent,temp-dns,dsmynas,familyds,mytabit,tb-hosting>site<reservd,thingdustdata,bloxcms,townnews-staging,typeform>pro<hk,it,vultrobjects>*<wafflecell,reserve-online,hotelwithflight,remotewd,wiardweb>pages<messwithdns,woltlab-demo,wpenginepowered>js<wixsite,xnbay>u2,u2-local<yolasite<us>graphox,cloudns,drud,is-by,land-4-sale,stuff-4-sale,enscaled>phx<mircloud,freeddns,golffan,noip,pointto,platterp,servername,de>lib<<io>on-acorn>*<apigee,b-data,backplaneapp,banzaicloud>app,backyards>*<<beagleboard,bitbucket,bluebite,boxfuse,brave>s>*<<browsersafetymark,bigv>uk0<cleverapps,dappnode>dyndns<dedyn,drud,definima,fh-muenster,shw,forgerock>id<ghost,github,gitlab,lolipop,hasura-app,hostyhosting,moonscale>*<beebyte>paas<beebyteapp>sekd1<jele,unispace>cloud-fr1<webthings,loginline,barsy,azurecontainer>*<ngrok>ap,au,eu,in,jp,sa,us<nodeart>stage<nid,pantheonsite,dyn53,pstmn>mock<protonet,qoto,qcx>sys>*<<vaporcloud,vbrplsbx>g<on-k3s>*<on-rio>*<readthedocs,resindevice,resinstaging>devices<hzc,sandcats,shiftcrypto,shiftedit,mo-siemens,musician,lair>apps<stolos>*<spacekit,utwente,s5y>*<edugit,telebit,thingdust>dev>cust,reservd<disrec>cust,reservd<prod>cust<testing>cust,reservd<<tickets,upli,2038,webflow,webflowtest,wedeploy,editorx,wixstudio,basicserver,virtualserver<biz>activetrail,cloudns,jozi,dyndns,for-better,for-more,for-some,for-the,selfip,webhop,orx,mmafan,myftp,no-ip,dscloud<app>adaptable,beget>*<clerk,clerkstage,wnext,cyclic,platform0,deta,ondigitalocean,easypanel,encr,edgecompute,fireweb,onflashdrive,flutterflow,framer,run>*<web,hasura,loginline,messerli,netlify,ngrok,ngrok-free,developer>*<noop,northflank>*<upsun>*<replit>id<snowflake>privatelink<streamlit,storipress,telebit,typedream,vercel,bookonline<live>aem,hlx,ewp>*<<net>adobeaemcloud,adobeio-static,adobeioruntime,akadns,akamai,akamai-staging,akamaiedge,akamaiedge-staging,akamaihd,akamaihd-staging,akamaiorigin,akamaiorigin-staging,akamaized,akamaized-staging,edgekey,edgekey-staging,edgesuite,edgesuite-staging,alwaysdata,myamaze,cloudfront,t3l3p0rt,appudo,atlassian-dev>prod>cdn<<myfritz,onavstack,shopselect,blackbaudcdn,boomla,bplaced,square7,gb,hu,jp,se,uk,in,clickrising,cloudaccess,cdn77-ssl,cdn77>r<feste-ip,knx-server,static-access,cryptonomic>*<dattolocal,mydatto,debian,bitbridge,at-band-camp,blogdns,broke-it,buyshouses,dnsalias,dnsdojo,does-it,dontexist,dynalias,dynathome,endofinternet,from-az,from-co,from-la,from-ny,gets-it,ham-radio-op,homeftp,homeip,homelinux,homeunix,in-the-band,is-a-chef,is-a-geek,isa-geek,kicks-ass,office-on-the,podzone,scrapper-site,selfip,sells-it,servebbs,serveftp,thruhere,webhop,definima,casacam,dynu,dynv6,twmail,ru,channelsdvr>u<fastlylb>map<fastly>freetls,map,prod>a,global<ssl>a,b,global<<edgeapp,flynnhosting,cdn-edges,heteml,cloudfunctions,moonscale,in-dsl,in-vpn,ipifony,iobb,cloudjiffy>fra1-de,west1-us<elastx>jls-sto1,jls-sto2,jls-sto3<faststacks,massivegrid>paas>fr-1,lon-1,lon-2,ny-1,ny-2,sg-1<<saveincloud>jelastic,nordeste-idc<scaleforce>j<tsukaeru>jelastic<kinghost,uni5,krellian,barsy,memset,azure-api,azureedge,azurefd,azurewebsites,azure-mobile,azurestaticapps>1,2,3,4,5,6,7,centralus,eastasia,eastus2,westeurope,westus2<cloudapp,trafficmanager,windows>core>blob<servicebus<dnsup,hicam,now-dns,ownip,vpndns,eating-organic,mydissent,myeffect,mymediapc,mypsx,mysecuritycamera,nhlfan,no-ip,pgafan,privatizehealthinsurance,bounceme,ddns,redirectme,serveblog,serveminecraft,sytes,cloudycluster,ovh>webpaas>*<hosting>*<<bar0,bar1,bar2,myradweb,rackmaze,squares,schokokeks,firewall-gateway,seidat,senseering,siteleaf,vps-host>jelastic>atl,njs,ric<<myspreadshop,srcf>soc,user<supabase,dsmynas,familyds,tailscale>beta<ts>c>*<<torproject>pages<reserve-online,community-pro,meinforum,yandexcloud>storage,website<za<page>aem,hlx,hlx3,translated,codeberg,pdns,plesk,prvcy,rocky,magnet<pl>beep,ecommerce-shop,shoparena,homesklep,sdscloud,unicloud,krasnik,leczna,lubartow,lublin,poniatowa,swidnik,co,torun,simplesite,art,gliwice,krakow,poznan,wroc,zakopane,myspreadshop,gda,gdansk,gdynia,med,sopot<eu>airkitapps,mycd,cloudns,dogado>jelastic<barsy,wellbeingzone,spdns,transurl>*<diskstation<ca>barsy,awdev>*<co,blogspot,no-ip,myspreadshop<estate>compute>*<<network>alces>*<co,arvo,azimuth,tlon<org>altervista,amune>tele<pimienta,poivron,potager,sweetpepper,ae,us,certmgr,cdn77>c,rsc<cdn77-secure>origin>ssl<<cloudns,duckdns,tunk,dyndns>go,home<blogdns,blogsite,boldlygoingnowhere,dnsalias,dnsdojo,doesntexist,dontexist,doomdns,dvrdns,dynalias,endofinternet,endoftheinternet,from-me,game-host,gotdns,hobby-site,homedns,homeftp,homelinux,homeunix,is-a-bruinsfan,is-a-candidate,is-a-celticsfan,is-a-chef,is-a-geek,is-a-knight,is-a-linux-user,is-a-patsfan,is-a-soxfan,is-found,is-lost,is-saved,is-very-bad,is-very-evil,is-very-good,is-very-nice,is-very-sweet,isa-geek,kicks-ass,misconfused,podzone,readmyblog,selfip,sellsyourhome,servebbs,serveftp,servegame,stuff-4-sale,webhop,ddnss,accesscam,camdvr,freeddns,mywire,webredirect,eu>al,asso,at,au,be,bg,ca,cd,ch,cn,cy,cz,de,dk,edu,ee,es,fi,fr,gr,hr,hu,ie,il,in,int,is,it,jp,kr,lt,lu,lv,mc,me,mk,mt,my,net,ng,nl,no,nz,paris,pl,pt,q-a,ro,ru,se,si,sk,tr,uk,us<twmail,fedorainfracloud,fedorapeople,fedoraproject>cloud,os>app<stg>os>app<<<freedesktop,hepforge,in-dsl,in-vpn,js,barsy,mayfirst,mozilla-iot,bmoattachments,dynserv,now-dns,cable-modem,collegefan,couchpotatofries,mlbfan,mysecuritycamera,nflfan,read-books,ufcfan,hopto,myftp,no-ip,zapto,httpbin,pubtls,jpn,my-firewall,myfirewall,spdns,small-web,dsmynas,familyds,teckids>s3<tuxfamily,diskstation,hk,wmflabs,toolforge,wmcloud,za<cn>com>amazonaws>cn-north-1>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint,s3-website<s3,s3-accesspoint,s3-deprecated,s3-object-lambda,s3-website<cn-northwest-1>execute-api,emrappui-prod,emrnotebooks-prod,emrstudio-prod,dualstack>s3,s3-accesspoint<s3,s3-accesspoint,s3-object-lambda,s3-website<compute>*<airflow>cn-north-1>*<cn-northwest-1>*<<eb>cn-north-1,cn-northwest-1<elb>*<<sagemaker>cn-north-1>notebook,studio<cn-northwest-1>notebook,studio<<<canva-apps,canvasite>my>*<<instantcloud,quickconnect>direct<<aws>sagemaker>af-south-1>notebook,studio<ap-east-1>notebook,studio<ap-northeast-1>notebook,studio<ap-northeast-2>notebook,studio<ap-northeast-3>notebook,studio<ap-south-1>notebook,studio<ap-south-2>notebook<ap-southeast-1>notebook,studio<ap-southeast-2>notebook,studio<ap-southeast-3>notebook,studio<ap-southeast-4>notebook<ca-central-1>notebook,notebook-fips,studio<ca-west-1>notebook,notebook-fips<eu-central-1>notebook,studio<eu-central-2>notebook<eu-north-1>notebook,studio<eu-south-1>notebook,studio<eu-south-2>notebook<eu-west-1>notebook,studio<eu-west-2>notebook,studio<eu-west-3>notebook,studio<il-central-1>notebook,studio<me-central-1>notebook,studio<me-south-1>notebook,studio<sa-east-1>notebook,studio<us-east-1>notebook,notebook-fips,studio<us-east-2>notebook,notebook-fips,studio<us-gov-east-1>notebook,notebook-fips,studio,studio-fips<us-gov-west-1>notebook,notebook-fips,studio,studio-fips<us-west-1>notebook,studio<us-west-2>notebook,notebook-fips,studio<<repost>private>*<<<online>eero,eero-stage,barsy<si>f5,gitapp,gitpage,blogspot<jp>ne>aseinet>user<gehirn,ivory,mail-box,mints,mokuren,opal,sakura,sumomo,topaz<buyshop,fashionstore,handcrafted,kawaiishop,supersale,theshop,usercontent,angry,babyblue,babymilk,backdrop,bambina,bitter,blush,boo,boy,boyfriend,but,candypop,capoo,catfood,cheap,chicappa,chillout,chips,chowder,chu,ciao,cocotte,coolblog,cranky,cutegirl,daa,deca,deci,digick,egoism,fakefur,fem,flier,floppy,fool,frenchkiss,girlfriend,girly,gloomy,gonna,greater,hacca,heavy,her,hiho,hippy,holy,hungry,icurus,itigo,jellybean,kikirara,kill,kilo,kuron,littlestar,lolipopmc,lolitapunk,lomo,lovepop,lovesick,main,mods,mond,mongolian,moo,namaste,nikita,nobushi,noor,oops,parallel,parasite,pecori,peewee,penne,pepper,perma,pigboat,pinoko,punyu,pupu,pussycat,pya,raindrop,readymade,sadist,schoolbus,secret,staba,stripper,sub,sunnyday,thick,tonkotsu,under,upper,velvet,verse,versus,vivian,watson,weblike,whitesnow,zombie,blogspot,2-d,bona,crap,daynight,eek,flop,halfmoon,jeez,matrix,mimoza,netgamers,nyanta,o0o0,rdy,rgr,rulez,sakurastorage>isk01>s3<isk02>s3<<saloon,sblo,skr,tank,uh-oh,undo,webaccel>rs,user<websozai,xii<vc>gv>d<0e<eus>party>user<<ws>advisor>*<cloud66,dyndns,mypets<ba>rs,blogspot<cloud>banzai>*<cyclic,elementor,encoway>eu<statics>*<ravendb,axarnet>es-1<diadem,jelastic>vip<jele,jenv-aruba>aruba>eur>it1<<it1<keliweb>cs<oxa>tn,uk<primetel>uk<reclaim>ca,uk,us<trendhosting>ch,de<jotelulu,kuleuven,linkyard,magentosite>*<perspecta,vapor,on-rancher>*<scw>baremetal>fr-par-1,fr-par-2,nl-ams-1<fr-par>cockpit,fnc>functions<k8s>nodes<s3,s3-website,whm<instances>priv,pub<k8s,nl-ams>cockpit,k8s>nodes<s3,s3-website,whm<pl-waw>cockpit,k8s>nodes<s3,s3-website<scalebook,smartlabeling<onstackit>runs<sensiosite>*<trafficplex,urown,voorloper,zap<ec>base,official<shop>base,hoplix,barsy<gay>pages<la>bnr,c<je>of<ch>square7,blogspot,flow>ae>alp1<appengine<linkyard-cloud,dnsking,gotdns,123website,myspreadshop,firenet>*,svc>*<<12hp,2ix,4lima,lima-city<de>bplaced,square7,com,cosidns>dyn<dynamisches-dns,dnsupdater,internet-dns,l-o-g-i-n,dnshome,fuettertdasnetz,isteingeek,istmein,lebtimnetz,leitungsen,traeumtgerade,ddnss>dyn,dyndns<dyndns1,dyn-ip24,home-webserver>dyn<myhome-server,frusky>*<goip,blogspot,xn--gnstigbestellen-zvb,xn--gnstigliefern-wob,hs-heilbronn>it>pages<<dyn-berlin,in-berlin,in-brb,in-butter,in-dsl,in-vpn,iservschule,mein-iserv,schulplattform,schulserver,test-iserv,keymachine,git-repos,lcube-server,svn-repos,barsy,123webseite,logoip,firewall-gateway,my-gateway,my-router,spdns,speedpartner>customer<myspreadshop,taifun-dns,12hp,2ix,4lima,lima-city,dd-dns,dray-dns,draydns,dyn-vpn,dynvpn,mein-vigor,my-vigor,my-wan,syno-ds,synology-diskstation,synology-ds,uberspace>*<virtualuser,virtual-user,community-pro,diskussionsbereich<rs>brendly>shop<blogspot,ua,ox<uk>co>bytemark>dh,vm<blogspot,layershift>j<barsy,barsyonline,retrosnub>cust<nh-serv,no-ip,wellbeingzone,adimo,myspreadshop<conn,copro,hosp,independent-commission,independent-inquest,independent-inquiry,independent-panel,independent-review,public-inquiry,royal-commission,gov>campaign,service,api<pymnt,org>glug,lug,lugs,affinitylottery,raffleentry,weeklylottery<barsy<site>canva>my>*<<cloudera>*<convex,cyon,fnwk,folionetwork,fastvps,jele,lelux,loginline,barsy,mintere,omniwe,opensocial,platformsh>*<tst>*<byen,srht,novecore<ac>drr,feedback,forms<ai>uwu<co>carrd,crd,otap>*<com>blogspot<leadpages,lpages,mypi,n4t,firewalledreplit>id<repl>id<supabase<mp>ju<se>com,blogspot,conf,iopsys,123minsida,itcouldbewor,myspreadshop,paba>su<<bz>za,gsj<in>web,cloudns,co>cyclic<blogspot,barsy,supabase<basketball>aus,nz<am>radio,blogspot,neko,nyaa<fm>radio,user>*<<group>discourse<team>discourse,jelastic<me>c66,daplie>localhost<edgestack,filegear,filegear-au,filegear-de,filegear-gb,filegear-ie,filegear-jp,filegear-sg,glitch,ravendb,lohmus,barsy,mcpe,mcdir,soundcast,tcp4,brasilia,ddns,dnsfor,hopto,loginto,noip,webhop,vp4,diskstation,dscloud,i234,myds,synology,transip>site<wedeploy,yombo,nohost<zone>cloud66,hs,triton>*<stackit,lima<host>cloudaccess,freesite,easypanel,fastvps,myfast,tempurl,wpmudev,jele,mircloud,pcloud,half<cz>co,realm,e4,blogspot,metacentrum>cloud>*<custom<muni>cloud>flt,usr<<<asia>cloudns<club>cloudns,jele,barsy<cc>cloudns,ftpaccess,game-server,myphotos,scrapping,twmail,csx,fantasyleague,spawn>instances<<info>cloudns,dynamic-dns,dyndns,barrel-of-knowledge,barrell-of-knowledge,for-our,groks-the,groks-this,here-for-more,knowsitall,selfip,webhop,barsy,mayfirst,forumz,nsupdate,dvrcam,ilovecollege,no-ip,dnsupdate,v-info<pw>cloudns,x443<gdn>cnpy<nl>co,hosting-cluster,blogspot,gov,khplay,123website,myspreadshop,transurl>*<cistron,demon<no>co,blogspot,123hjemmeside,myspreadshop<be>webhosting,blogspot,interhostsolutions>cloud<kuleuven>ezproxy<123website,myspreadshop,transurl>*<<ru>ac,edu,gov,int,mil,test,eurodir,adygeya,bashkiria,bir,cbg,com,dagestan,grozny,kalmykia,kustanai,marine,mordovia,msk,mytis,nalchik,nov,pyatigorsk,spb,vladikavkaz,vladimir,blogspot,na4u,mircloud,regruhosting>jelastic<myjino>hosting>*<landing>*<spectrum>*<vps>*<<cldmail>hb<mcdir>vps<mcpre,net,org,pp,123sait,lk3,ras<email>crisp>on<<is>cupcake,blogspot<link>cyon,mypep,dweb>*<<dk>biz,co,firm,reg,store,blogspot,123hjemmeside,myspreadshop<earth>dapps>*,bzz>*<<<id>my>rss>*<<flap,co>blogspot<forte<solutions>diher>*<<th>online,shop<sh>bip,hashbang,platform>ent,eu,us<now,vxl,wedeploy<fi>dy,blogspot,xn--hkkinen-5wa,iki,cloudplatform>fi<datacenter>demo,paas<kapsi,123kotisivu,myspreadshop<tv>dyndns,better-than,on-the-web,worse-than,from,sakura<cx>ath,info,assessments,calculators,funnels,paynow,quizzes,researched,tests<name>her>forgot<his>forgot<<nu>merseine,mine,shacknet,enterprisecloud<rocks>myddns,stackit,lima-city,webspace<xyz>blogsite,localzone,crafting,zapto,telebit>*<<cool>elementor,de<fr>en-root,fbx-os,fbxos,freebox-os,freeboxos,blogspot,goupile,123siteweb,on-web,chirurgiens-dentistes-en-france,dedibox,aeroport,avocat,chambagri,chirurgiens-dentistes,experts-comptables,medecin,notaires,pharmacien,port,veterinaire,myspreadshop,ynh<one>onred>staging<kin>*<service,homelink<tw>com>mymailer<url,blogspot<su>abkhazia,adygeya,aktyubinsk,arkhangelsk,armenia,ashgabad,azerbaijan,balashov,bashkiria,bryansk,bukhara,chimkent,dagestan,east-kazakhstan,exnet,georgia,grozny,ivanovo,jambyl,kalmykia,kaluga,karacol,karaganda,karelia,khakassia,krasnodar,kurgan,kustanai,lenug,mangyshlak,mordovia,msk,murmansk,nalchik,navoi,north-kazakhstan,nov,obninsk,penza,pokrovsk,sochi,spb,tashkent,termez,togliatti,troitsk,tselinograd,tula,tuva,vladikavkaz,vladimir,vologda<space>myfast,uber,xs4all<media>framer<photos>framer<website>framer<wiki>framer<il>co>ravpage,blogspot,tabitorder,mytabit<<at>funkfeuer>wien<futurecms>*,ex>*<in>*<<futurehosting,futuremailing,ortsinfo>ex>*<kunden>*<<co>blogspot<biz,info,123webseite,priv,myspreadshop,12hp,2ix,4lima,lima-city<ms>lab,minisite<community>nog,ravendb,myforum<ro>co,shop,blogspot,barsy<digital>cloudapps>london<<im>ro<goog>cloud,translate,usercontent>*<<ae>blogspot<al>blogspot<bg>blogspot,barsy<bj>blogspot<cf>blogspot<cl>blogspot<ke>co>blogspot<<nz>co>blogspot<<za>co>blogspot<<ar>com>blogspot<<au>com>blogspot,cloudlets>mel<myspreadshop<<br>com>blogspot,simplesite<leg>ac,al,am,ap,ba,ce,df,es,go,ma,mg,ms,mt,pa,pb,pe,pi,pr,rj,rn,ro,rr,rs,sc,se,sp,to<<by>com>blogspot<mycloud,mediatech<cy>com>blogspot,scaleforce>j<<<ee>com>blogspot<<eg>com>blogspot<<es>com>blogspot<123miweb,myspreadshop<mt>com>blogspot<<ng>com>blogspot<col,firm,gen,ltd,ngo<tr>com>blogspot<<uy>com>blogspot<<cv>blogspot<gr>blogspot,simplesite<hk>blogspot,secaas,ltd,inc<hr>blogspot,free<hu>blogspot<ie>blogspot,myspreadshop<kr>blogspot<li>blogspot,caa<lt>blogspot<lu>blogspot,123website<md>blogspot,at,de,jp,to<mk>blogspot<mr>blogspot<mx>blogspot<my>blogspot<pe>blogspot<pt>blogspot,123paginaweb<qa>blogspot<re>blogspot<sg>blogspot,enscaled<sk>blogspot<sn>blogspot<td>blogspot<ug>blogspot<vn>blogspot<ci>fin,nl<run>hs,development,ravendb,servers,build>*<code>*<database>*<migration>*<onporter,repl,stackit,wix<pub>id>*<kin>*<barsy<gl>biz,xx<scot>edu,gov>service<<so>sch,surveys<kz>jcloud,kazteleport>upaas<<tn>orangecloud<gg>kaas,cya,stackit,panel>daemon<<systems>knightpoint<events>koobin,co<krd>co,edu<business>co<education>co<financial>co<place>co<technology>co<bs>we<services>loginline<menu>barsy<mobi>barsy,dscloud<support>barsy<vu>cn,blog,dev,me<health>hra<casa>nabu>ui<<pizza>ngrok<news>noticeable<top>now-dns,ntdll<ovh>nerdpol<mn>nyc<lol>omg<hosting>opencraft<orange>tech<pm>own,name<codes>owo>*<<lc>oy<games>pley<bn>co<today>prequalifyme<builders>cloudsite<edu>rit>git-pages<<xn--p1acf>xn--90amc,xn--j1aef,xn--j1ael8b,xn--h1ahn,xn--j1adp,xn--c1avg,xn--80aaa0cvac,xn--h1aliz,xn--90a1af,xn--41a<st>kirara,noho<store>sellfy,shopware,storebase<land>static>dev,sites<<farm>storj<pictures>1337<rip>clan<tf>sch<wf>biz,sch<yt>org<management>router<ax>be,cat,es,eu,gg,mc,us,xy<gp>app<gt>blog,de,to<gy>be<hn>cc<kg>io,jp,tv,uk,us<ls>de<porn>indie<tc>ch,me,we<vg>at<academy>official<faith>ybo<party>ybo<review>ybo<science>ybo<trade>ybo<design>bss';
		},
		'./node_modules/super-regex/index.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				firstMatch: function () {
					return firstMatch;
				},
				isMatch: function () {
					return isMatch;
				},
				matches: function () {
					return matches;
				}
			});
			/* harmony import */ var function_timeout__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(
					/*! function-timeout */ './node_modules/function-timeout/browser.js'
				);
			/* harmony import */ var time_span__WEBPACK_IMPORTED_MODULE_1__ =
				__webpack_require__(
					/*! time-span */ './node_modules/time-span/browser.js'
				);
			/* harmony import */ var clone_regexp__WEBPACK_IMPORTED_MODULE_2__ =
				__webpack_require__(
					/*! clone-regexp */ './node_modules/clone-regexp/index.js'
				);

			// TODO: Use `structuredClone` instead when targeting Node.js 18.

			const resultToMatch = result => ({
				match: result[0],
				index: result.index,
				groups: result.slice(1),
				namedGroups: result.groups ?? {},
				input: result.input
			});

			function isMatch(regex, string, { timeout } = {}) {
				try {
					return (0,
					function_timeout__WEBPACK_IMPORTED_MODULE_0__['default'])(
						() =>
							(0,
							clone_regexp__WEBPACK_IMPORTED_MODULE_2__[
								'default'
							])(regex).test(string),
						{ timeout }
					)();
				} catch (error) {
					if (
						(0,
						function_timeout__WEBPACK_IMPORTED_MODULE_0__.isTimeoutError)(
							error
						)
					) {
						return false;
					}

					throw error;
				}
			}

			function firstMatch(regex, string, { timeout } = {}) {
				try {
					const result = (0,
					function_timeout__WEBPACK_IMPORTED_MODULE_0__['default'])(
						() =>
							(0,
							clone_regexp__WEBPACK_IMPORTED_MODULE_2__[
								'default'
							])(regex).exec(string),
						{ timeout }
					)();

					if (result === null) {
						return;
					}

					return resultToMatch(result);
				} catch (error) {
					if (
						(0,
						function_timeout__WEBPACK_IMPORTED_MODULE_0__.isTimeoutError)(
							error
						)
					) {
						return;
					}

					throw error;
				}
			}

			function matches(
				regex,
				string,
				{
					timeout = Number.POSITIVE_INFINITY,
					matchTimeout = Number.POSITIVE_INFINITY
				} = {}
			) {
				if (!regex.global) {
					throw new Error(
						'The regex must have the global flag, otherwise, use `firstMatch()` instead'
					);
				}

				return {
					*[Symbol.iterator]() {
						try {
							const matches = string.matchAll(regex); // The regex is only executed when iterated over.

							while (true) {
								const nextMatch = (0,
								function_timeout__WEBPACK_IMPORTED_MODULE_0__[
									'default'
								])(() => matches.next(), {
									timeout:
										timeout !== Number.POSITIVE_INFINITY ||
										matchTimeout !==
											Number.POSITIVE_INFINITY
											? Math.min(timeout, matchTimeout)
											: undefined
								}); // `matches.next` must be called within an arrow function so that it doesn't loose its context.

								const end = (0,
								time_span__WEBPACK_IMPORTED_MODULE_1__[
									'default'
								])();
								const { value, done } = nextMatch();
								timeout -= Math.ceil(end());

								if (done) {
									break;
								}

								yield resultToMatch(value);
							}
						} catch (error) {
							if (
								!(0,
								function_timeout__WEBPACK_IMPORTED_MODULE_0__.isTimeoutError)(
									error
								)
							) {
								throw error;
							}
						}
					}
				};
			}
		},
		'./node_modules/time-span/browser.js': function (
			__unused_webpack___webpack_module__,
			__webpack_exports__,
			__webpack_require__
		) {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				default: function () {
					return timeSpan;
				}
			});
			function timeSpan() {
				const start = performance.now();

				const end = () => performance.now() - start;
				end.rounded = () => Math.round(end());
				end.seconds = () => end() / 1000;
				end.nanoseconds = () => end() * 1000000;

				return end;
			}
		}
	};
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
		__webpack_modules__[moduleId](
			module,
			module.exports,
			__webpack_require__
		);

		// Return the exports of the module
		return module.exports;
	}

	/************************************************************************/
	// webpack/runtime/define_property_getters
	(() => {
		__webpack_require__.d = function (exports, definition) {
			for (var key in definition) {
				if (
					__webpack_require__.o(definition, key) &&
					!__webpack_require__.o(exports, key)
				) {
					Object.defineProperty(exports, key, {
						enumerable: true,
						get: definition[key]
					});
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
	// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
	(() => {
		__webpack_require__.r(__webpack_exports__);
		/* harmony import */ var _rewriters_url__WEBPACK_IMPORTED_MODULE_0__ =
			__webpack_require__(
				/*! ./rewriters/url */ './src/shared/rewriters/url.ts'
			);
		/* harmony import */ var _rewriters_css__WEBPACK_IMPORTED_MODULE_1__ =
			__webpack_require__(
				/*! ./rewriters/css */ './src/shared/rewriters/css.ts'
			);
		/* harmony import */ var _rewriters_html__WEBPACK_IMPORTED_MODULE_2__ =
			__webpack_require__(
				/*! ./rewriters/html */ './src/shared/rewriters/html.ts'
			);
		/* harmony import */ var _rewriters_js__WEBPACK_IMPORTED_MODULE_3__ =
			__webpack_require__(
				/*! ./rewriters/js */ './src/shared/rewriters/js.ts'
			);
		/* harmony import */ var _rewriters_headers__WEBPACK_IMPORTED_MODULE_4__ =
			__webpack_require__(
				/*! ./rewriters/headers */ './src/shared/rewriters/headers.ts'
			);
		/* harmony import */ var _rewriters_worker__WEBPACK_IMPORTED_MODULE_5__ =
			__webpack_require__(
				/*! ./rewriters/worker */ './src/shared/rewriters/worker.ts'
			);
		/* harmony import */ var _mercuryworkshop_bare_mux__WEBPACK_IMPORTED_MODULE_6__ =
			__webpack_require__(
				/*! @mercuryworkshop/bare-mux */ './node_modules/@mercuryworkshop/bare-mux/dist/index.mjs'
			);
		/* harmony import */ var parse_domain__WEBPACK_IMPORTED_MODULE_7__ =
			__webpack_require__(
				/*! parse-domain */ './node_modules/parse-domain/build/parse-domain.js'
			);

		if (!self.$scramjet) {
			//@ts-expect-error really dumb workaround
			self.$scramjet = {};
		}
		self.$scramjet.shared = {
			util: {
				isScramjetFile:
					_rewriters_html__WEBPACK_IMPORTED_MODULE_2__.isScramjetFile,
				parseDomain:
					parse_domain__WEBPACK_IMPORTED_MODULE_7__.parseDomain,
				BareClient:
					_mercuryworkshop_bare_mux__WEBPACK_IMPORTED_MODULE_6__.BareClient
			},
			url: {
				encodeUrl:
					_rewriters_url__WEBPACK_IMPORTED_MODULE_0__.encodeUrl,
				decodeUrl: _rewriters_url__WEBPACK_IMPORTED_MODULE_0__.decodeUrl
			},
			rewrite: {
				rewriteCss:
					_rewriters_css__WEBPACK_IMPORTED_MODULE_1__.rewriteCss,
				rewriteHtml:
					_rewriters_html__WEBPACK_IMPORTED_MODULE_2__.rewriteHtml,
				rewriteSrcset:
					_rewriters_html__WEBPACK_IMPORTED_MODULE_2__.rewriteSrcset,
				rewriteJs: _rewriters_js__WEBPACK_IMPORTED_MODULE_3__.rewriteJs,
				rewriteHeaders:
					_rewriters_headers__WEBPACK_IMPORTED_MODULE_4__.rewriteHeaders,
				rewriteWorkers:
					_rewriters_worker__WEBPACK_IMPORTED_MODULE_5__.rewriteWorkers
			}
		};
	})();
})();
//# sourceMappingURL=scramjet.shared.js.map
