/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import type { IncomingMessage } from 'node:http';
import { type Duplex } from 'node:stream';
import WebSocket from 'ws';
import type { BareRequest, Options } from './BareServer.js';
export type BareHeaders = Record<string, string | string[]>;
export declare const nullMethod: string[];
export declare const nullBodyStatus: number[];
export declare function randomHex(byteLength: number): string;
export declare function bareFetch(request: BareRequest, signal: AbortSignal, requestHeaders: BareHeaders, remote: URL, options: Options): Promise<IncomingMessage>;
export declare function bareUpgradeFetch(request: BareRequest, signal: AbortSignal, requestHeaders: BareHeaders, remote: URL, options: Options): Promise<[res: IncomingMessage, socket: Duplex, head: Buffer]>;
export declare function webSocketFetch(request: BareRequest, requestHeaders: BareHeaders, remote: URL, protocols: string[], options: Options): Promise<[req: IncomingMessage, socket: WebSocket]>;
