/// <reference types="node" />
/// <reference types="node" />
import { Agent as HttpAgent } from 'node:http';
import { Agent as HttpsAgent } from 'node:https';
import BareServer from './BareServer.js';
import type { BareMaintainer, Options } from './BareServer.js';
import type { Database } from './Meta.js';
export declare const validIPFamily: number[];
export type IPFamily = 0 | 4 | 6;
export interface BareServerInit {
    logErrors?: boolean;
    localAddress?: string;
    /**
     * When set, the default logic for blocking local IP addresses is disabled.
     */
    filterRemote?: Options['filterRemote'];
    /**
     * When set, the default logic for blocking local IP addresses is disabled.
     */
    lookup?: Options['lookup'];
    /**
     * If local IP addresses/DNS records should be blocked.
     * @default true
     */
    blockLocal?: boolean;
    /**
     * IP address family to use when resolving `host` or `hostname`. Valid values are `0`, `4`, and `6`. When unspecified/0, both IP v4 and v6 will be used.
     */
    family?: IPFamily | number;
    maintainer?: BareMaintainer;
    httpAgent?: HttpAgent;
    httpsAgent?: HttpsAgent;
    /**
     * If legacy clients should be supported (v1 & v2). If this is set to false, the database can be safely ignored.
     * @default true
     */
    legacySupport?: boolean;
    database?: Database;
}
export interface Address {
    address: string;
    family: number;
}
/**
 * Converts the address and family of a DNS lookup callback into an array if it wasn't already
 */
export declare function toAddressArray(address: string | Address[], family?: number): Address[];
/**
 * Create a Bare server.
 * This will handle all lifecycles for unspecified options (httpAgent, httpsAgent, metaMap).
 */
export declare function createBareServer(directory: string, init?: BareServerInit): BareServer;
