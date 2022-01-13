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
exports.validateUserAccount = void 0;
const debug_1 = require("debug");
const debug = (0, debug_1.default)('chums:local-modules:validate-user-account');
const api_fetch_1 = require("./api-fetch");
const utils_1 = require("./utils");
const VALIDATE_URL = '/api/user/:id/validate/account/:Company/:ARDivisionNo-:CustomerNo';
function validateUserAccount({ id, Company, ARDivisionNo, CustomerNo }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = VALIDATE_URL
                .replace(':id', encodeURIComponent(id))
                .replace(':Company', encodeURIComponent((0, utils_1.getDBCompany)(Company)))
                .replace(':ARDivisionNo', encodeURIComponent(ARDivisionNo))
                .replace(':CustomerNo', encodeURIComponent(CustomerNo));
            const res = yield (0, api_fetch_1.apiFetch)(url, { referrer: 'chums:local-modules:validate-user' });
            if (!res.ok) {
                debug('validateAccount()', res.status, res.statusText);
                return Promise.reject(new Error(`Error ${res.status}: ${res.statusText}`));
            }
            const { success } = yield res.json();
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
    });
}
exports.validateUserAccount = validateUserAccount;
