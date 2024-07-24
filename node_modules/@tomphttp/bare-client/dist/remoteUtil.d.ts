export interface BareRemote {
    host: string;
    port: number | string;
    path: string;
    protocol: string;
}
export declare function remoteToURL(remote: BareRemote): URL;
export declare function resolvePort(url: URL): number;
export declare function urlToRemote(url: URL): BareRemote;
