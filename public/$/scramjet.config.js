(() => {
	// webpackBootstrap
	var __webpack_exports__ = {};
	if (!self.$scramjet) {
		//@ts-expect-error really dumb workaround
		self.$scramjet = {};
	}
	self.$scramjet.config = {
		prefix: '/$/space/',
		codec: self.$scramjet.codecs.xor,
		config: '/$/scramjet.config.js',
		shared: '/$/scramjet.shared.js',
		worker: '/$/scramjet.worker.js',
		client: '/$/scramjet.client.js',
		codecs: '/$/scramjet.codecs.js'
	};
})();
//# sourceMappingURL=scramjet.config.js.map
