import type { BareHeaders, BareManifest, BareResponseFetch, urlLike } from './BareTypes';
import type { WebSocketImpl } from './Client';
export declare function fetchManifest(server: string | URL, signal?: AbortSignal): Promise<BareManifest>;
export declare namespace BareWebSocket {
    type GetReadyStateCallback = () => number;
    type GetSendErrorCallback = () => Error | undefined;
    type GetProtocolCallback = () => string;
    type HeadersType = BareHeaders | Headers | undefined;
    type HeadersProvider = BareHeaders | (() => BareHeaders | Promise<BareHeaders>);
    interface Options {
        /**
         * A provider of request headers to pass to the remote.
         * Usually one of `User-Agent`, `Origin`, and `Cookie`
         * Can be just the headers object or an synchronous/asynchronous function that returns the headers object
         */
        headers?: BareWebSocket.HeadersProvider;
        /**
         * A hook executed by this function with helper arguments for hooking the readyState property. If a hook isn't provided, bare-client will hook the property on the instance. Hooking it on an instance basis is good for small projects, but ideally the class should be hooked by the user of bare-client.
         */
        readyStateHook?: ((socket: WebSocket, getReadyState: BareWebSocket.GetReadyStateCallback) => void) | undefined;
        /**
         * A hook executed by this function with helper arguments for determining if the send function should throw an error. If a hook isn't provided, bare-client will hook the function on the instance.
         */
        sendErrorHook?: ((socket: WebSocket, getSendError: BareWebSocket.GetSendErrorCallback) => void) | undefined;
        /**
         * A hook executed by this function with the URL. If a hook isn't provided, bare-client will hook the URL.
         */
        urlHook?: ((socket: WebSocket, url: URL) => void) | undefined;
        /**
         * A hook executed by this function with a helper for getting the current fake protocol. If a hook isn't provided, bare-client will hook the protocol.
         */
        protocolHook?: ((socket: WebSocket, getProtocol: BareWebSocket.GetProtocolCallback) => void) | undefined;
        /**
         * A callback executed by this function with an array of cookies. This is called once the metadata from the server is received.
         */
        setCookiesCallback?: ((setCookies: string[]) => void) | undefined;
        webSocketImpl?: WebSocketImpl;
    }
}
export declare class BareClient {
    manifest?: BareManifest;
    private client?;
    private server;
    private working?;
    private onDemand;
    private onDemandSignal?;
    /**
     * Lazily create a BareClient. Calls to fetch and connect will request the manifest once on-demand.
     * @param server A full URL to the bare server.
     * @param signal An abort signal for fetching the manifest on demand.
     */
    constructor(server: string | URL, signal?: AbortSignal);
    /**
     * Immediately create a BareClient.
     * @param server A full URL to the bare server.
     * @param manifest A Bare server manifest.
     */
    constructor(server: string | URL, manifest?: BareManifest);
    private loadManifest;
    private demand;
    private getClient;
    createWebSocket(remote: urlLike, protocols: string | string[] | undefined, options: BareWebSocket.Options): WebSocket;
    fetch(url: urlLike | Request, init?: RequestInit): Promise<BareResponseFetch>;
}
