import Debug from 'debug';
import {apiFetch} from './api-fetch.js';
import {getDBCompany} from './utils.js';
import {CustomerValidationResponse} from 'chums-types'
export {CustomerValidationResponse} from 'chums-types'

const debug = Debug('chums:local-modules:validate-user-account');
const VALIDATE_URL = '/api/user/:id/validate/account/:Company/:ARDivisionNo-:CustomerNo';
const VALIDATE_SHIP_TO_URL = '/api/user/:id/validate/account/:Company/:ARDivisionNo-:CustomerNo-:ShipToCode';

export interface SuccessResponse {
    success?: boolean;
}
/**
 *
 * @param {string|number} id - User ID
 * @param {string} Company
 * @param {string} ARDivisionNo
 * @param {string} CustomerNo
 * @returns {Promise<boolean>}
 */

export interface ValidateUserAccountProps {
    id: string | number,
    Company: string,
    ARDivisionNo: string,
    CustomerNo: string,
    ShipToCode?: string;
}

export async function validateUserAccount({id, Company, ARDivisionNo, CustomerNo, ShipToCode}: ValidateUserAccountProps) {
    try {
        const url = (!!ShipToCode ? VALIDATE_SHIP_TO_URL : VALIDATE_URL)
            .replace(':id', encodeURIComponent(id))
            .replace(':Company', encodeURIComponent(getDBCompany(Company)))
            .replace(':ARDivisionNo', encodeURIComponent(ARDivisionNo))
            .replace(':CustomerNo', encodeURIComponent(CustomerNo))
            .replace(':ShipToCode', encodeURIComponent(ShipToCode ?? ''));
        const res = await apiFetch(url, {referrer: 'chums:local-modules:validate-user-account'});
        if (!res.ok) {
            debug('validateAccount()', res.status, res.statusText);
            return Promise.reject(new Error(`Error ${res.status}: ${res.statusText}`));
        }
        const response = await res.json() as SuccessResponse;
        return response.success === true;
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("validateAccount()", err.message);
            return Promise.reject(err);
        }
        debug("validateAccount()", err);
        return Promise.reject(err);
    }
}

export async function fetchCustomerValidation({id, Company, ARDivisionNo, CustomerNo}:ValidateUserAccountProps):Promise<CustomerValidationResponse> {
    try {
        const url = '/api/user/:id/validate/customer/:Company/:ARDivisionNo-:CustomerNo'
            .replace(':id', encodeURIComponent(id))
            .replace(':Company', encodeURIComponent(getDBCompany(Company)))
            .replace(':ARDivisionNo', encodeURIComponent(ARDivisionNo))
            .replace(':CustomerNo', encodeURIComponent(CustomerNo));
        const res = await apiFetch(url, {referrer: 'chums:chums-base:validate-user:validateUserCustomerAccess'});
        if (!res.ok) {
            debug('validateAccount()', res.status, res.statusText);
            return Promise.reject(new Error(`Error ${res.status}: ${res.statusText}`));
        }
        return await res.json() as CustomerValidationResponse;
    } catch(err:unknown) {
        if (err instanceof Error) {
            debug("validateUserCustomerAccess()", err.message);
            return Promise.reject(err);
        }
        debug("validateUserCustomerAccess()", err);
        return Promise.reject(new Error('Error in validateUserCustomerAccess()'));
    }
}
