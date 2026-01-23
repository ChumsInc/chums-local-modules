import Debug from 'debug';
import fetch, {} from 'node-fetch';
import { URL } from 'node:url';
export { Response } from 'node-fetch';
const debug = Debug('chums:local-modules:api-fetch');
const { CHUMS_API_USER = '', CHUMS_API_PASSWORD = '' } = process.env;
const LOCAL_HOSTNAMES = ['localhost', 'intranet.chums.com'];
const API_HOST = process.env.CHUMS_API_HOST || 'http://localhost';
/**
 * Makes a request to an API, defaults to chums intranet API if not including options.headers.Authorization
 *
 */
export async function apiFetch(url = '', options = {}) {
    try {
        if (typeof url === 'string') {
            url = new URL(url, API_HOST);
        }
        if (!options.headers) {
            options.headers = {};
        }
        if (!options.headers['Content-Type']) {
            options.headers['Content-Type'] = 'application/json';
        }
        options.headers.referrer = `${process.env.COMPUTERNAME || 'chums-local-modules'}/`;
        if (options.referrer) {
            options.headers.referrer += options.referrer;
            delete options.referrer;
        }
        if (!options.headers.Authorization && LOCAL_HOSTNAMES.includes(url.hostname)) {
            if (!CHUMS_API_USER || !CHUMS_API_PASSWORD) {
                debug('apiFetch() WARNING: session variables CHUMS_API_USER, CHUMS_API_PASSWORD not set.');
            }
            const auth = Buffer.from(`${CHUMS_API_USER}:${CHUMS_API_PASSWORD}`).toString('base64');
            options.headers.Authorization = `Basic ${auth}`;
        }
        return await fetch(url, options);
    }
    catch (err) {
        if (err instanceof Error) {
            debug('apiFetch()', err.message);
            return Promise.reject(err);
        }
        debug("apiFetch()", err);
        return Promise.reject(err);
    }
}
export const isJSONContentType = (contentType) => {
    if (!contentType) {
        return false;
    }
    return contentType.toLowerCase() === 'application/json' || contentType.toLowerCase().startsWith('application/json');
};
export async function apiFetchJSON(url, options = {}) {
    try {
        const res = await apiFetch(url, options);
        if (!isJSONContentType(res.headers.get('content-type'))) {
            const content = await res.text();
            debug('apiFetchJSON()', content);
            return Promise.reject(new Error(`Invalid content returned: ${res.headers.get('content-type')}`));
        }
        return await res.json();
    }
    catch (err) {
        if (err instanceof Error) {
            debug("apiFetchJSON()", err.message);
            return Promise.reject(err);
        }
        debug("apiFetchJSON()", err);
        return Promise.reject(new Error('Error in apiFetchJSON()'));
    }
}
