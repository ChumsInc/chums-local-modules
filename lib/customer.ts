export interface CustomerSlugResponse {
    arDivisionNo: string;
    customerNo: string;
    shipToCode?: string;
}

/**
 * Parses a customer slug into its constituent parts.
 * @param customerSlug
 */
export function parseCustomerSlug(customerSlug: string|null): CustomerSlugResponse | null {
    if (!customerSlug) {
        return null;
    }
    if (/^\d{2}-[A-Z0-9.]+$/.test(customerSlug)) {
        const [arDivisionNo, customerNo] = customerSlug.split('-');
        return {arDivisionNo, customerNo};
    }
    if (/^\d{2}-[A-Z0-9.]+-[0-9A-Z#]+$/.test(customerSlug)) {
        const [arDivisionNo, customerNo, shipToCode] = customerSlug.split('-');
        return {arDivisionNo, customerNo, shipToCode};
    }
    if (/^\d{2}[A-Z0-9.]+$/.test(customerSlug)) {
        return {
            arDivisionNo: customerSlug.slice(0, 2),
            customerNo: customerSlug.slice(2)
        }
    }
    return null;
}
