importScripts(
	'/$/scramjet.codecs.js',
	'/$/scramjet.config.js',
	'/$/scramjet.shared.js',
	'/$/scramjet.worker.js'
);

const scramjet = new ScramjetServiceWorker();

async function handleRequest(event) {
	if (scramjet.route(event)) {
		return scramjet.fetch(event);
	}

	return fetch(event.request);
}

self.addEventListener('fetch', event => {
	event.respondWith(handleRequest(event));
});
