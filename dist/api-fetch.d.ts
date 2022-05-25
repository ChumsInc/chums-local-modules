/// <reference types="node" />
import { Response } from 'node-fetch';
export { Response } from 'node-fetch';
import { URL } from 'url';
/**
 * Makes a request to an API, defaults to chums intranet API if not including options.headers.Authorization
 *
 * @param {String|URL} url
 * @param {Object} options
 * @param {Object} [options.headers]
 * @param {String} [options.headers.Authorization]
 * @param {String} [options.method]
 * @param {String} [options.referrer]
 * @returns {Promise<Error|*>}
 */
export interface APIFetchOptions {
    headers?: {
        Authorization?: string;
        'Content-Type'?: string;
        referrer?: string;
    };
    method?: string;
    referrer?: string;
}
export declare function apiFetch(url?: string | URL, options?: APIFetchOptions): Promise<Response>;
