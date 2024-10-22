export interface ParseSQLParams {
    [key: string]: unknown;
}
export declare function parseSQL(query: string, params?: ParseSQLParams): string;
/**
 * Returns a valid database company for use in database company fields
 * @param {String} company - Sage Company Code
 * @returns {String} chums|bc
 */
export declare function getDBCompany(company?: string): string;
/**
 * Returns a valid Sage Company code
 * @param {string} company
 * @returns {string} CHI|BCS|TST|BCT|SUH
 */
export declare function getSageCompany(company?: string): string;
