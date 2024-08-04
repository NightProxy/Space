// See documentation for more information

self.__dynamic$config = {
	prefix: '/,/space/',
	encoding: 'xor',
	mode: 'production',
	logLevel: 3,
	tab: {
		title: 'Service',
		icon: null,
		ua: null
	},
	assets: {
		prefix: '/,/',
		files: {
			handler: 'dynamic.handler.js',
			client: 'dynamic.client.js',
			worker: 'dynamic.worker.js',
			config: 'dynamic.config.js',
			inject: null
		}
	},
	block: []
};
