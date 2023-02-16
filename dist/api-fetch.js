"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiFetchJSON = exports.apiFetch = exports.Response = void 0;
const debug_1 = require("debug");
const node_fetch_1 = require("node-fetch");
const url_1 = require("url");
var node_fetch_2 = require("node-fetch");
Object.defineProperty(exports, "Response", { enumerable: true, get: function () { return node_fetch_2.Response; } });
const debug = (0, debug_1.default)('chums:local-modules:api-fetch');
const { CHUMS_API_USER = '', CHUMS_API_PASSWORD = '' } = process.env;
const LOCAL_HOSTNAMES = ['localhost', 'intranet.chums.com'];
const API_HOST = process.env.CHUMS_API_HOST || 'http://localhost';
async function apiFetch(url = '', options = {}) {
    try {
        if (typeof url === 'string') {
            url = new url_1.URL(url, API_HOST);
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
        return await (0, node_fetch_1.default)(url, options);
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
exports.apiFetch = apiFetch;
async function apiFetchJSON(url, options = {}) {
    try {
        const res = await apiFetch(url, options);
        return await res.json();
    }
    catch (err) {
        if (err instanceof Error) {
            console.debug("apiFetchJSON()", err.message);
            return Promise.reject(err);
        }
        console.debug("apiFetchJSON()", err);
        return Promise.reject(new Error('Error in apiFetchJSON()'));
    }
}
exports.apiFetchJSON = apiFetchJSON;
