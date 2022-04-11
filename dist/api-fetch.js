"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiFetch = void 0;
const debug_1 = require("debug");
const node_fetch_1 = require("node-fetch");
const url_1 = require("url");
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
