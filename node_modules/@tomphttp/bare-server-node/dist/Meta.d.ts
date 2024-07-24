import type { BareHeaders } from './requestUtil';
export interface MetaV1 {
    v: 1;
    response?: {
        headers: BareHeaders;
    };
}
export interface MetaV2 {
    v: 2;
    response?: {
        status: number;
        statusText: string;
        headers: BareHeaders;
    };
    sendHeaders: BareHeaders;
    remote: string;
    forwardHeaders: string[];
}
export default interface CommonMeta {
    value: MetaV1 | MetaV2;
    expires: number;
}
export interface Database {
    get(key: string): string | undefined | PromiseLike<string | undefined>;
    set(key: string, value: string): unknown;
    has(key: string): boolean | PromiseLike<boolean>;
    delete(key: string): boolean | PromiseLike<boolean>;
    entries(): IterableIterator<[string, string]> | PromiseLike<IterableIterator<[string, string]>>;
}
/**
 * Routine
 */
export declare function cleanupDatabase(database: Database): Promise<void>;
