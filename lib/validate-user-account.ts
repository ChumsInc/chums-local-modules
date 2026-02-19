import Debug from 'debug';
import {apiFetch} from './api-fetch.js';

export type {CustomerValidationResponse} from 'chums-types'

const debug = Debug('chums:local-modules:validate-user-account');

export interface SuccessResponse {
    success?: boolean;
}

export interface ValidateCustomerAccessResponse {
    billTo: boolean;
    shipTo: string[];
    canSetDefaultShipTo: boolean;
}


export interface ValidateUserAccountProps {
    id: string | number;
    ARDivisionNo: string;
    CustomerNo: string;
    ShipToCode?: string | null;
}

/**
 * @oaram {ValidateUserAccountProps}
 * @param {string|number} id - User ID
 * @param {string} ARDivisionNo Customer AR Division Number
 * @param {string} CustomerNo Customer Account Number
 * @param {string} [ShipToCode] Customer Ship To Code
 * @returns {Promise<boolean>}
 */
export async function validateUserAccount({
                                              id,
                                              ARDivisionNo,
                                              CustomerNo,
                                              ShipToCode
                                          }: ValidateUserAccountProps): Promise<boolean> {
    try {
        const response = await fetchCustomerValidation({id, ARDivisionNo, CustomerNo, ShipToCode});
        return response.billTo || response.shipTo.includes(ShipToCode ?? '');
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("validateAccount()", err.message);
            return Promise.reject(err);
        }
        debug("validateAccount()", err);
        return Promise.reject(err);
    }
}

export async function fetchCustomerValidation({
                                                  id,
                                                  ARDivisionNo,
                                                  CustomerNo,
                                                  ShipToCode,
                                              }: ValidateUserAccountProps): Promise<ValidateCustomerAccessResponse> {
    try {
        const customerSlugParts = [ARDivisionNo, CustomerNo];
        if (ShipToCode) {
            customerSlugParts.push(ShipToCode);
        }
        const customerSlug = customerSlugParts.join('-');
        const url = '/api/user/v2/validate/user/:id/:customerKey.json'
            .replace(':id', encodeURIComponent(id)).replace(':customerKey', encodeURIComponent(customerSlug));
        const res = await apiFetch(url, {referrer: 'chums:chums-base:validate-user:validateUserCustomerAccess'});
        if (!res.ok) {
            debug('validateAccount()', res.status, res.statusText);
            return Promise.reject(new Error(`Error ${res.status}: ${res.statusText}`));
        }
        return await res.json() as ValidateCustomerAccessResponse;
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("validateUserCustomerAccess()", err.message);
            return Promise.reject(err);
        }
        debug("validateUserCustomerAccess()", err);
        return Promise.reject(new Error('Error in validateUserCustomerAccess()'));
    }
}
