import type { CustomerValidationResponse } from 'chums-types';
export type { CustomerValidationResponse } from 'chums-types';
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
    id: string | number;
    Company: string;
    ARDivisionNo: string;
    CustomerNo: string;
    ShipToCode?: string;
}
export declare function validateUserAccount({ id, Company, ARDivisionNo, CustomerNo, ShipToCode }: ValidateUserAccountProps): Promise<boolean>;
export declare function fetchCustomerValidation({ id, Company, ARDivisionNo, CustomerNo }: ValidateUserAccountProps): Promise<CustomerValidationResponse>;
