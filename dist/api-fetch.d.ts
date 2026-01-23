import { type RequestInit, type Response } from 'node-fetch';
import { URL } from 'node:url';
export { Response } from 'node-fetch';
export interface APIFetchOptions extends RequestInit {
    headers?: {
        Authorization?: string;
        'Content-Type'?: string;
        referrer?: string;
    };
    method?: string;
    referrer?: string;
}
/**
 * Makes a request to an API, defaults to chums intranet API if not including options.headers.Authorization
 *
 */
export declare function apiFetch(url?: string | URL, options?: APIFetchOptions): Promise<Response>;
export declare const isJSONContentType: (contentType: string | null | undefined) => boolean;
export declare function apiFetchJSON<T = unknown>(url: string | URL, options?: APIFetchOptions): Promise<T>;
