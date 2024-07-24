"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webSocketFetch = exports.bareUpgradeFetch = exports.bareFetch = exports.randomHex = exports.nullBodyStatus = exports.nullMethod = void 0;
const node_crypto_1 = require("node:crypto");
const node_http_1 = require("node:http");
const node_https_1 = require("node:https");
const node_stream_1 = require("node:stream");
const ws_1 = __importDefault(require("ws"));
const BareServer_js_1 = require("./BareServer.js");
exports.nullMethod = ['GET', 'HEAD'];
exports.nullBodyStatus = [101, 204, 205, 304];
function randomHex(byteLength) {
    const bytes = new Uint8Array(byteLength);
    (0, node_crypto_1.getRandomValues)(bytes);
    let hex = '';
    for (const byte of bytes)
        hex += byte.toString(16).padStart(2, '0');
    return hex;
}
exports.randomHex = randomHex;
function outgoingError(error) {
    if (error instanceof Error) {
        switch (error.code) {
            case 'ENOTFOUND':
                return new BareServer_js_1.BareError(500, {
                    code: 'HOST_NOT_FOUND',
                    id: 'request',
                    message: 'The specified host could not be resolved.',
                });
            case 'ECONNREFUSED':
                return new BareServer_js_1.BareError(500, {
                    code: 'CONNECTION_REFUSED',
                    id: 'response',
                    message: 'The remote rejected the request.',
                });
            case 'ECONNRESET':
                return new BareServer_js_1.BareError(500, {
                    code: 'CONNECTION_RESET',
                    id: 'response',
                    message: 'The request was forcibly closed.',
                });
            case 'ETIMEOUT':
                return new BareServer_js_1.BareError(500, {
                    code: 'CONNECTION_TIMEOUT',
                    id: 'response',
                    message: 'The response timed out.',
                });
        }
    }
    return error;
}
async function bareFetch(request, signal, requestHeaders, remote, options) {
    if (options.filterRemote)
        await options.filterRemote(remote);
    const req = {
        method: request.method,
        headers: requestHeaders,
        setHost: false,
        signal,
        localAddress: options.localAddress,
        family: options.family,
        lookup: options.lookup,
    };
    let outgoing;
    // NodeJS will convert the URL into HTTP options automatically
    // see https://github.com/nodejs/node/blob/e30e71665cab94118833cc536a43750703b19633/lib/internal/url.js#L1277
    if (remote.protocol === 'https:')
        outgoing = (0, node_https_1.request)(remote, {
            ...req,
            agent: options.httpsAgent,
        });
    else if (remote.protocol === 'http:')
        outgoing = (0, node_http_1.request)(remote, {
            ...req,
            agent: options.httpAgent,
        });
    else
        throw new RangeError(`Unsupported protocol: '${remote.protocol}'`);
    if (request.body)
        node_stream_1.Readable.fromWeb(request.body).pipe(outgoing);
    else
        outgoing.end();
    return await new Promise((resolve, reject) => {
        outgoing.on('response', (response) => {
            resolve(response);
        });
        outgoing.on('upgrade', (req, socket) => {
            reject('Remote did not send a response');
            socket.destroy();
        });
        outgoing.on('error', (error) => {
            reject(outgoingError(error));
        });
    });
}
exports.bareFetch = bareFetch;
async function bareUpgradeFetch(request, signal, requestHeaders, remote, options) {
    if (options.filterRemote)
        await options.filterRemote(remote);
    const req = {
        headers: requestHeaders,
        method: request.method,
        timeout: 12e3,
        setHost: false,
        signal,
        localAddress: options.localAddress,
        family: options.family,
        lookup: options.lookup,
    };
    let outgoing;
    // NodeJS will convert the URL into HTTP options automatically
    // see https://github.com/nodejs/node/blob/e30e71665cab94118833cc536a43750703b19633/lib/internal/url.js#L1277
    // calling .replace on remote may look like it replaces other occurrences of wss:, but it only replaces the first which is remote.protocol
    if (remote.protocol === 'wss:')
        outgoing = (0, node_https_1.request)(remote.toString().replace('wss:', 'https:'), {
            ...req,
            agent: options.httpsAgent,
        });
    else if (remote.protocol === 'ws:')
        outgoing = (0, node_http_1.request)(remote.toString().replace('ws:', 'http:'), {
            ...req,
            agent: options.httpAgent,
        });
    else
        throw new RangeError(`Unsupported protocol: '${remote.protocol}'`);
    outgoing.end();
    return await new Promise((resolve, reject) => {
        outgoing.on('response', (res) => {
            reject(new Error('Remote did not upgrade the WebSocket'));
            res.destroy();
        });
        outgoing.on('upgrade', (res, socket, head) => {
            resolve([res, socket, head]);
        });
        outgoing.on('error', (error) => {
            reject(outgoingError(error));
        });
    });
}
exports.bareUpgradeFetch = bareUpgradeFetch;
async function webSocketFetch(request, requestHeaders, remote, protocols, options) {
    if (options.filterRemote)
        await options.filterRemote(remote);
    const req = {
        headers: requestHeaders,
        method: request.method,
        timeout: 12e3,
        setHost: false,
        localAddress: options.localAddress,
        family: options.family,
        lookup: options.lookup,
    };
    let outgoing;
    if (remote.protocol === 'wss:')
        outgoing = new ws_1.default(remote, protocols, {
            ...req,
            agent: options.httpsAgent,
        });
    else if (remote.protocol === 'ws:')
        outgoing = new ws_1.default(remote, protocols, {
            ...req,
            agent: options.httpAgent,
        });
    else
        throw new RangeError(`Unsupported protocol: '${remote.protocol}'`);
    return await new Promise((resolve, reject) => {
        let request;
        const cleanup = () => {
            outgoing.removeEventListener('open', openListener);
            outgoing.removeEventListener('open', openListener);
        };
        outgoing.on('upgrade', (req) => {
            request = req;
        });
        const openListener = () => {
            cleanup();
            resolve([request, outgoing]);
        };
        const errorListener = (event) => {
            cleanup();
            reject(outgoingError(event.error));
        };
        outgoing.addEventListener('open', openListener);
        outgoing.addEventListener('error', errorListener);
    });
}
exports.webSocketFetch = webSocketFetch;
//# sourceMappingURL=requestUtil.js.map