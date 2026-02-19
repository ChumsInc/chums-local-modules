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
 * @oaram {ValidateUserAccountProps}
 * @param {string|number} id - User ID
 * @param {string} ARDivisionNo Customer AR Division Number
 * @param {string} CustomerNo Customer Account Number
 * @param {string} [ShipToCode] Customer Ship To Code
 * @returns {Promise<boolean>}
 */
export declare function validateUserAccount({ id, ARDivisionNo, CustomerNo, ShipToCode }: ValidateUserAccountProps): Promise<boolean>;
export declare function fetchCustomerValidation({ id, ARDivisionNo, CustomerNo, ShipToCode, }: ValidateUserAccountProps): Promise<ValidateCustomerAccessResponse>;
