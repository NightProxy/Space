/** @type {import('meteorproxy').Config} */
const config = {
	prefix: '/!/space/',
	codec: $meteor_codecs.xor,
	debug: true,
	files: {
		client: '/!/meteor.client.js',
		worker: '/!/meteor.worker.js',
		bundle: '/!/meteor.bundle.js',
		codecs: '/!/meteor.codecs.js',
		config: '/!/meteor.config.js'
	}
};

self.__meteor$config = config;
