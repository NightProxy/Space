import { BareClient } from './BareClient';
export * from './Client';
export * from './BareTypes';
export * from './BareClient';
/**
 *
 * Facilitates fetching the Bare server and constructing a BareClient.
 * @param server Bare server
 * @param signal Abort signal when fetching the manifest
 */
export declare function createBareClient(server: string | URL, signal?: AbortSignal): Promise<BareClient>;
