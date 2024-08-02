importScripts('/!/meteor.codecs.js');
importScripts('/!/meteor.config.js');
importScripts('/!/meteor.bundle.js');
importScripts('/!/meteor.worker.js');

const meteor = new MeteorServiceWorker();
function handleRequest(event) {
	if (meteor.shouldRoute(event)) {
		return meteor.handleFetch(event);
	}

	return fetch(event.request);
}
self.addEventListener('fetch', event => {
	event.respondWith(handleRequest(event));
});
