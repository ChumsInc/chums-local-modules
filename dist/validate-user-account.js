import Debug from 'debug';
import { apiFetch } from './api-fetch.js';
const debug = Debug('chums:local-modules:validate-user-account');
// const VALIDATE_URL = '/api/user/:id/validate/account/:Company/:ARDivisionNo-:CustomerNo';
const VALIDATE_URL = '/api/user/v2/validate/user/:id/:customerKey.json';
const VALIDATE_SHIP_TO_URL = '/api/user/:id/validate/account/:Company/:ARDivisionNo-:CustomerNo-:ShipToCode';
/**
 * @oaram {ValidateUserAccountProps} customer
 * @param {string|number} customer.id - User ID
 * @param {string} customer.ARDivisionNo Customer AR Division Number
 * @param {string} customer.CustomerNo Customer Account Number
 * @param {string} [customer.ShipToCode] Customer Ship To Code
 * @returns {Promise<boolean>}
 */
export async function validateUserAccount({ id, ARDivisionNo, CustomerNo, ShipToCode }) {
    try {
        const response = await fetchCustomerValidation({ id, ARDivisionNo, CustomerNo, ShipToCode });
        return response.billTo || response.shipTo.includes(ShipToCode ?? '');
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
export async function fetchCustomerValidation({ id, ARDivisionNo, CustomerNo, ShipToCode, }) {
    try {
        const customerSlugParts = [ARDivisionNo, CustomerNo];
        if (ShipToCode) {
            customerSlugParts.push(ShipToCode);
        }
        const customerSlug = customerSlugParts.join('-');
        const url = '/api/user/v2/validate/user/:id/:customerKey.json'
            .replace(':id', encodeURIComponent(id)).replace(':customerKey', encodeURIComponent(customerSlug));
        const res = await apiFetch(url, { referrer: 'chums:chums-base:validate-user:validateUserCustomerAccess' });
        if (!res.ok) {
            debug('validateAccount()', res.status, res.statusText);
            return Promise.reject(new Error(`Error ${res.status}: ${res.statusText}`));
        }
        return await res.json();
    }
    catch (err) {
        if (err instanceof Error) {
            debug("validateUserCustomerAccess()", err.message);
            return Promise.reject(err);
        }
        debug("validateUserCustomerAccess()", err);
        return Promise.reject(new Error('Error in validateUserCustomerAccess()'));
    }
}
