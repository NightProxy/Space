importScripts('/,/dynamic.config.js');
importScripts('/,/dynamic.worker.js');

const dynamic = new Dynamic();

self.dynamic = dynamic;

async function handleRequest(event) {
    if (await dynamic.route(event)) {
        return await dynamic.fetch(event);
    }

    return await fetch(event.request)
}

self.addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event));
});