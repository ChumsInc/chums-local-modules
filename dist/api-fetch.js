"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiFetch = void 0;
const debug_1 = require("debug");
const node_fetch_1 = require("node-fetch");
const url_1 = require("url");
const debug = debug_1.default('chums:local-modules:api-fetch');
const { CHUMS_API_USER = '', CHUMS_API_PASSWORD = '' } = process.env;
const LOCAL_HOSTNAMES = ['localhost', 'intranet.chums.com'];
const API_HOST = process.env.CHUMS_API_HOST || 'http://localhost';
function apiFetch(url = '', options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
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
            return yield node_fetch_1.default(url, options);
        }
        catch (err) {
            debug("get()", err.message);
            return Promise.reject(err);
        }
    });
}
exports.apiFetch = apiFetch;
