/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import type { LookupOneOptions } from 'node:dns';
import EventEmitter from 'node:events';
import type { Agent as HttpAgent, IncomingMessage, ServerResponse } from 'node:http';
import type { Agent as HttpsAgent } from 'node:https';
import { type Duplex } from 'node:stream';
import type WebSocket from 'ws';
export interface BareRequest extends Request {
    native: IncomingMessage;
}
export interface BareErrorBody {
    code: string;
    id: string;
    message?: string;
    stack?: string;
}
export declare class BareError extends Error {
    status: number;
    body: BareErrorBody;
    constructor(status: number, body: BareErrorBody);
}
export declare const pkg: {
    version: string;
};
export declare function json<T>(status: number, json: T): import("undici").Response;
export type BareMaintainer = {
    email?: string;
    website?: string;
};
export type BareProject = {
    name?: string;
    description?: string;
    email?: string;
    website?: string;
    repository?: string;
    version?: string;
};
export type BareLanguage = 'NodeJS' | 'ServiceWorker' | 'Deno' | 'Java' | 'PHP' | 'Rust' | 'C' | 'C++' | 'C#' | 'Ruby' | 'Go' | 'Crystal' | 'Shell' | string;
export type BareManifest = {
    maintainer?: BareMaintainer;
    project?: BareProject;
    versions: string[];
    language: BareLanguage;
    memoryUsage?: number;
};
export interface Options {
    logErrors: boolean;
    /**
     * Callback for filtering the remote URL.
     * @returns Nothing
     * @throws An error if the remote is bad.
     */
    filterRemote?: (remote: Readonly<URL>) => Promise<void> | void;
    /**
     * DNS lookup
     * May not get called when remote.host is an IP
     * Use in combination with filterRemote to block IPs
     */
    lookup: (hostname: string, options: LookupOneOptions, callback: (err: NodeJS.ErrnoException | null, address: string, family: number) => void) => void;
    localAddress?: string;
    family?: number;
    maintainer?: BareMaintainer;
    httpAgent: HttpAgent;
    httpsAgent: HttpsAgent;
    database: JSONDatabaseAdapter;
    wss: WebSocket.Server;
}
export type RouteCallback = (request: BareRequest, response: ServerResponse<IncomingMessage>, options: Options) => Promise<Response> | Response;
export type SocketRouteCallback = (request: BareRequest, socket: Duplex, head: Buffer, options: Options) => Promise<void> | void;
export default class Server extends EventEmitter {
    directory: string;
    routes: Map<string, RouteCallback>;
    socketRoutes: Map<string, SocketRouteCallback>;
    versions: string[];
    private closed;
    private options;
    /**
     * Remove all timers and listeners
     */
    close(): void;
    shouldRoute(request: IncomingMessage): boolean;
    get instanceInfo(): BareManifest;
    routeUpgrade(req: IncomingMessage, socket: Duplex, head: Buffer): Promise<void>;
    routeRequest(req: IncomingMessage, res: ServerResponse): Promise<void>;
}
