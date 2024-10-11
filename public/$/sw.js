importScripts(
	"/$/scramjet.wasm.js",
	"/$/scramjet.codecs.js",
	"/$/scramjet.shared.js",
	"/$/scramjet.worker.js"
);

const scramjet = new ScramjetServiceWorker();

async function handleRequest(event) {
	await scramjet.loadConfig();
	if (scramjet.route(event)) {
		return scramjet.fetch(event);
	}

	return fetch(event.request);
}

self.addEventListener("fetch", (event) => {
	event.respondWith(handleRequest(event));
});
