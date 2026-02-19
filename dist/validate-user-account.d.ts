export type { CustomerValidationResponse } from 'chums-types';
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
 * @oaram {ValidateUserAccountProps} customer
 * @param {string|number} customer.id - User ID
 * @param {string} customer.ARDivisionNo Customer AR Division Number
 * @param {string} customer.CustomerNo Customer Account Number
 * @param {string} [customer.ShipToCode] Customer Ship To Code
 * @returns {Promise<boolean>}
 */
export declare function validateUserAccount({ id, ARDivisionNo, CustomerNo, ShipToCode }: ValidateUserAccountProps): Promise<boolean>;
export declare function fetchCustomerValidation({ id, ARDivisionNo, CustomerNo, ShipToCode, }: ValidateUserAccountProps): Promise<ValidateCustomerAccessResponse>;
