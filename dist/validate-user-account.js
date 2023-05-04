"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserAccount = void 0;
const debug_1 = __importDefault(require("debug"));
const api_fetch_1 = require("./api-fetch");
const utils_1 = require("./utils");
const debug = (0, debug_1.default)('chums:local-modules:validate-user-account');
const VALIDATE_URL = '/api/user/:id/validate/account/:Company/:ARDivisionNo-:CustomerNo';
async function validateUserAccount({ id, Company, ARDivisionNo, CustomerNo }) {
    try {
        const url = VALIDATE_URL
            .replace(':id', encodeURIComponent(id))
            .replace(':Company', encodeURIComponent((0, utils_1.getDBCompany)(Company)))
            .replace(':ARDivisionNo', encodeURIComponent(ARDivisionNo))
            .replace(':CustomerNo', encodeURIComponent(CustomerNo));
        const res = await (0, api_fetch_1.apiFetch)(url, { referrer: 'chums:local-modules:validate-user' });
        if (!res.ok) {
            debug('validateAccount()', res.status, res.statusText);
            return Promise.reject(new Error(`Error ${res.status}: ${res.statusText}`));
        }
        const { success } = await res.json();
        return success === true;
    }
    catch (err) {
        if (err instanceof Error) {
            debug("validateAccount()", err.message);
            return Promise.reject(err);
        }
        debug("validateAccount()", err);
        return Promise.reject(err);
    }
}
exports.validateUserAccount = validateUserAccount;
