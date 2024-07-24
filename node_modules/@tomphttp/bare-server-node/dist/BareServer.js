"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.json = exports.pkg = exports.BareError = void 0;
const node_events_1 = __importDefault(require("node:events"));
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_stream_1 = require("node:stream");
const http_errors_1 = __importDefault(require("http-errors"));
const requestUtil_js_1 = require("./requestUtil.js");
class BareError extends Error {
    status;
    body;
    constructor(status, body) {
        super(body.message || body.code);
        this.status = status;
        this.body = body;
    }
}
exports.BareError = BareError;
exports.pkg = JSON.parse((0, node_fs_1.readFileSync)((0, node_path_1.join)(__dirname, '..', 'package.json'), 'utf-8'));
const project = {
    name: 'bare-server-node',
    description: 'TOMPHTTP NodeJS Bare Server',
    repository: 'https://github.com/tomphttp/bare-server-node',
    version: exports.pkg.version,
};
function json(status, json) {
    const send = Buffer.from(JSON.stringify(json, null, '\t'));
    return new Response(send, {
        status,
        headers: {
            'content-type': 'application/json',
            'content-length': send.byteLength.toString(),
        },
    });
}
exports.json = json;
class Server extends node_events_1.default {
    directory;
    routes = new Map();
    socketRoutes = new Map();
    versions = [];
    closed = false;
    options;
    /**
     * @internal
     */
    constructor(directory, options) {
        super();
        this.directory = directory;
        this.options = options;
    }
    /**
     * Remove all timers and listeners
     */
    close() {
        this.closed = true;
        this.emit('close');
    }
    shouldRoute(request) {
        return (!this.closed &&
            request.url !== undefined &&
            request.url.startsWith(this.directory));
    }
    get instanceInfo() {
        return {
            versions: this.versions,
            language: 'NodeJS',
            memoryUsage: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
            maintainer: this.options.maintainer,
            project,
        };
    }
    async routeUpgrade(req, socket, head) {
        const request = new Request(new URL(req.url, 'http://bare-server-node'), {
            method: req.method,
            body: requestUtil_js_1.nullMethod.includes(req.method || '') ? undefined : req,
            headers: req.headers,
        });
        request.native = req;
        const service = new URL(request.url).pathname.slice(this.directory.length - 1);
        if (this.socketRoutes.has(service)) {
            const call = this.socketRoutes.get(service);
            try {
                await call(request, socket, head, this.options);
            }
            catch (error) {
                if (this.options.logErrors) {
                    console.error(error);
                }
                socket.end();
            }
        }
        else {
            socket.end();
        }
    }
    async routeRequest(req, res) {
        const request = new Request(new URL(req.url, 'http://bare-server-node'), {
            method: req.method,
            body: requestUtil_js_1.nullMethod.includes(req.method || '') ? undefined : req,
            headers: req.headers,
            duplex: 'half',
        });
        request.native = req;
        const service = new URL(request.url).pathname.slice(this.directory.length - 1);
        let response;
        try {
            if (request.method === 'OPTIONS') {
                response = new Response(undefined, { status: 200 });
            }
            else if (service === '/') {
                response = json(200, this.instanceInfo);
            }
            else if (this.routes.has(service)) {
                const call = this.routes.get(service);
                response = await call(request, res, this.options);
            }
            else {
                throw new http_errors_1.default.NotFound();
            }
        }
        catch (error) {
            if (this.options.logErrors)
                console.error(error);
            if (http_errors_1.default.isHttpError(error)) {
                response = json(error.statusCode, {
                    code: 'UNKNOWN',
                    id: `error.${error.name}`,
                    message: error.message,
                    stack: error.stack,
                });
            }
            else if (error instanceof Error) {
                response = json(500, {
                    code: 'UNKNOWN',
                    id: `error.${error.name}`,
                    message: error.message,
                    stack: error.stack,
                });
            }
            else {
                response = json(500, {
                    code: 'UNKNOWN',
                    id: 'error.Exception',
                    message: error,
                    stack: new Error(error).stack,
                });
            }
            if (!(response instanceof Response)) {
                if (this.options.logErrors) {
                    console.error('Cannot', request.method, new URL(request.url).pathname, ': Route did not return a response.');
                }
                throw new http_errors_1.default.InternalServerError();
            }
        }
        response.headers.set('x-robots-tag', 'noindex');
        response.headers.set('access-control-allow-headers', '*');
        response.headers.set('access-control-allow-origin', '*');
        response.headers.set('access-control-allow-methods', '*');
        response.headers.set('access-control-expose-headers', '*');
        // don't fetch preflight on every request...
        // instead, fetch preflight every 10 minutes
        response.headers.set('access-control-max-age', '7200');
        res.writeHead(response.status, response.statusText, Object.fromEntries(response.headers));
        if (response.body) {
            const body = node_stream_1.Readable.fromWeb(response.body);
            body.pipe(res);
            res.on('close', () => body.destroy());
        }
        else
            res.end();
    }
}
exports.default = Server;
//# sourceMappingURL=BareServer.js.map