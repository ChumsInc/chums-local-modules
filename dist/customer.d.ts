export interface CustomerSlugResponse {
    arDivisionNo: string;
    customerNo: string;
    shipToCode?: string;
}
/**
 * Parses a customer slug into its constituent parts.
 * @param customerSlug
 */
export declare function parseCustomerSlug(customerSlug: string | null): CustomerSlugResponse | null;
