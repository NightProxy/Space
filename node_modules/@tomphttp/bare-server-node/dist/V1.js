"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_stream_1 = require("node:stream");
const BareServer_js_1 = require("./BareServer.js");
const encodeProtocol_js_1 = require("./encodeProtocol.js");
const headerUtil_js_1 = require("./headerUtil.js");
const remoteUtil_js_1 = require("./remoteUtil.js");
const requestUtil_js_1 = require("./requestUtil.js");
const forbiddenSendHeaders = [
    'connection',
    'content-length',
    'transfer-encoding',
];
const forbiddenForwardHeaders = [
    'connection',
    'transfer-encoding',
    'origin',
    'referer',
];
const validProtocols = ['http:', 'https:', 'ws:', 'wss:'];
function loadForwardedHeaders(forward, target, request) {
    for (const header of forward) {
        const value = request.headers.get(header);
        if (value !== null)
            target[header] = value;
    }
}
function readHeaders(request) {
    const remote = Object.create(null);
    const headers = Object.create(null);
    for (const remoteProp of ['host', 'port', 'protocol', 'path']) {
        const header = `x-bare-${remoteProp}`;
        const value = request.headers.get(header);
        if (value === null)
            throw new BareServer_js_1.BareError(400, {
                code: 'MISSING_BARE_HEADER',
                id: `request.headers.${header}`,
                message: `Header was not specified.`,
            });
        switch (remoteProp) {
            case 'port':
                if (isNaN(parseInt(value))) {
                    throw new BareServer_js_1.BareError(400, {
                        code: 'INVALID_BARE_HEADER',
                        id: `request.headers.${header}`,
                        message: `Header was not a valid integer.`,
                    });
                }
                break;
            case 'protocol':
                if (!validProtocols.includes(value)) {
                    throw new BareServer_js_1.BareError(400, {
                        code: 'INVALID_BARE_HEADER',
                        id: `request.headers.${header}`,
                        message: `Header was invalid`,
                    });
                }
                break;
        }
        remote[remoteProp] = value;
    }
    const xBareHeaders = request.headers.get('x-bare-headers');
    if (xBareHeaders === null)
        throw new BareServer_js_1.BareError(400, {
            code: 'MISSING_BARE_HEADER',
            id: `request.headers.x-bare-headers`,
            message: `Header was not specified.`,
        });
    try {
        const json = JSON.parse(xBareHeaders);
        for (const header in json) {
            if (forbiddenSendHeaders.includes(header.toLowerCase()))
                continue;
            const value = json[header];
            if (typeof value === 'string') {
                headers[header] = value;
            }
            else if (Array.isArray(value)) {
                const array = [];
                for (const val of value) {
                    if (typeof val !== 'string') {
                        throw new BareServer_js_1.BareError(400, {
                            code: 'INVALID_BARE_HEADER',
                            id: `bare.headers.${header}`,
                            message: `Header was not a String.`,
                        });
                    }
                    array.push(val);
                }
                headers[header] = array;
            }
            else {
                throw new BareServer_js_1.BareError(400, {
                    code: 'INVALID_BARE_HEADER',
                    id: `bare.headers.${header}`,
                    message: `Header was not a String.`,
                });
            }
        }
    }
    catch (error) {
        if (error instanceof SyntaxError) {
            throw new BareServer_js_1.BareError(400, {
                code: 'INVALID_BARE_HEADER',
                id: `request.headers.x-bare-headers`,
                message: `Header contained invalid JSON. (${error.message})`,
            });
        }
        else {
            throw error;
        }
    }
    const xBareForwardHeaders = request.headers.get('x-bare-forward-headers');
    if (xBareForwardHeaders === null)
        throw new BareServer_js_1.BareError(400, {
            code: 'MISSING_BARE_HEADER',
            id: `request.headers.x-bare-forward-headers`,
            message: `Header was not specified.`,
        });
    try {
        const parsed = JSON.parse(xBareForwardHeaders);
        const forwardHeaders = [];
        for (let header of parsed) {
            header = header.toLowerCase();
            // just ignore
            if (forbiddenForwardHeaders.includes(header))
                continue;
            forwardHeaders.push(header);
        }
        loadForwardedHeaders(forwardHeaders, headers, request);
    }
    catch (error) {
        throw new BareServer_js_1.BareError(400, {
            code: 'INVALID_BARE_HEADER',
            id: `request.headers.x-bare-forward-headers`,
            message: `Header contained invalid JSON. (${error instanceof Error ? error.message : error})`,
        });
    }
    return { remote: (0, remoteUtil_js_1.remoteToURL)(remote), headers };
}
const tunnelRequest = async (request, res, options) => {
    const abort = new AbortController();
    request.native.on('close', () => {
        if (!request.native.complete)
            abort.abort();
    });
    res.on('close', () => {
        abort.abort();
    });
    const { remote, headers } = readHeaders(request);
    const response = await (0, requestUtil_js_1.bareFetch)(request, abort.signal, headers, remote, options);
    const responseHeaders = new Headers();
    for (const header in response.headers) {
        if (header === 'content-encoding' || header === 'x-content-encoding')
            responseHeaders.set('content-encoding', (0, headerUtil_js_1.flattenHeader)(response.headers[header]));
        else if (header === 'content-length')
            responseHeaders.set('content-length', (0, headerUtil_js_1.flattenHeader)(response.headers[header]));
    }
    responseHeaders.set('x-bare-headers', JSON.stringify((0, headerUtil_js_1.mapHeadersFromArray)((0, headerUtil_js_1.rawHeaderNames)(response.rawHeaders), {
        ...response.headers,
    })));
    responseHeaders.set('x-bare-status', response.statusCode.toString());
    responseHeaders.set('x-bare-status-text', response.statusMessage);
    return new Response(node_stream_1.Readable.toWeb(response), {
        status: 200,
        headers: responseHeaders,
    });
};
const metaExpiration = 30e3;
const wsMeta = async (request, res, options) => {
    if (request.method === 'OPTIONS') {
        return new Response(undefined, { status: 200 });
    }
    const id = request.headers.get('x-bare-id');
    if (id === null)
        throw new BareServer_js_1.BareError(400, {
            code: 'MISSING_BARE_HEADER',
            id: 'request.headers.x-bare-id',
            message: 'Header was not specified',
        });
    const meta = await options.database.get(id);
    // check if meta isn't undefined and if the version equals 1
    if (meta?.value.v !== 1)
        throw new BareServer_js_1.BareError(400, {
            code: 'INVALID_BARE_HEADER',
            id: 'request.headers.x-bare-id',
            message: 'Unregistered ID',
        });
    await options.database.delete(id);
    return (0, BareServer_js_1.json)(200, {
        headers: meta.value.response?.headers,
    });
};
const wsNewMeta = async (request, res, options) => {
    const id = (0, requestUtil_js_1.randomHex)(16);
    await options.database.set(id, {
        value: { v: 1 },
        expires: Date.now() + metaExpiration,
    });
    return new Response(Buffer.from(id));
};
const tunnelSocket = async (request, socket, head, options) => {
    const abort = new AbortController();
    request.native.on('close', () => {
        if (!request.native.complete)
            abort.abort();
    });
    socket.on('close', () => {
        abort.abort();
    });
    if (!request.headers.has('sec-websocket-protocol')) {
        socket.end();
        return;
    }
    const [firstProtocol, data] = request.headers
        .get('sec-websocket-protocol')
        .split(/,\s*/g);
    if (firstProtocol !== 'bare') {
        socket.end();
        return;
    }
    const { remote, headers, forward_headers: forwardHeaders, id, } = JSON.parse((0, encodeProtocol_js_1.decodeProtocol)(data));
    loadForwardedHeaders(forwardHeaders, headers, request);
    const [remoteResponse, remoteSocket] = await (0, requestUtil_js_1.bareUpgradeFetch)(request, abort.signal, headers, (0, remoteUtil_js_1.remoteToURL)(remote), options);
    remoteSocket.on('close', () => {
        // console.log('Remote closed');
        socket.end();
    });
    socket.on('close', () => {
        // console.log('Serving closed');
        remoteSocket.end();
    });
    remoteSocket.on('error', (error) => {
        if (options.logErrors) {
            console.error('Remote socket error:', error);
        }
        socket.end();
    });
    socket.on('error', (error) => {
        if (options.logErrors) {
            console.error('Serving socket error:', error);
        }
        remoteSocket.end();
    });
    if (typeof id === 'string') {
        const meta = await options.database.get(id);
        if (meta?.value.v === 1) {
            meta.value.response = {
                headers: (0, headerUtil_js_1.mapHeadersFromArray)((0, headerUtil_js_1.rawHeaderNames)(remoteResponse.rawHeaders), {
                    ...remoteResponse.headers,
                }),
            };
            await options.database.set(id, meta);
        }
    }
    const responseHeaders = [
        `HTTP/1.1 101 Switching Protocols`,
        `Upgrade: websocket`,
        `Connection: Upgrade`,
        `Sec-WebSocket-Protocol: bare`,
        `Sec-WebSocket-Accept: ${remoteResponse.headers['sec-websocket-accept']}`,
    ];
    if ('sec-websocket-extensions' in remoteResponse.headers) {
        responseHeaders.push(`Sec-WebSocket-Extensions: ${remoteResponse.headers['sec-websocket-extensions']}`);
    }
    socket.write(responseHeaders.concat('', '').join('\r\n'));
    remoteSocket.pipe(socket);
    socket.pipe(remoteSocket);
};
function registerV1(server) {
    server.routes.set('/v1/', tunnelRequest);
    server.routes.set('/v1/ws-new-meta', wsNewMeta);
    server.routes.set('/v1/ws-meta', wsMeta);
    server.socketRoutes.set('/v1/', tunnelSocket);
    server.versions.push('v1');
}
exports.default = registerV1;
//# sourceMappingURL=V1.js.map