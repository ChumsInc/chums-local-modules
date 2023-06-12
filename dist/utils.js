const namedPlaceholders = require('named-placeholders')();
const SqlString = require('sqlstring');
export function parseSQL(query, params = {}) {
    const prepared = namedPlaceholders(query, params || {});
    return SqlString.format(prepared[0], prepared[1]);
}
/**
 * Returns a valid database company for use in database company fields
 * @param {String} company - Sage Company Code
 * @returns {String} chums|bc
 */
export function getDBCompany(company = '') {
    switch (String(company).toUpperCase()) {
        case 'CHI':
        case 'CHUMS':
            return 'chums';
        case 'BCS':
        case 'BC':
            return 'bc';
        default:
            return 'chums';
    }
}
/**
 * Returns a valid Sage Company code
 * @param {string} company
 * @returns {string} CHI|BCS|TST|BCT|SUH
 */
export function getSageCompany(company = 'chums') {
    switch (String(company).toLowerCase()) {
        case 'chums':
        case 'chi':
            return 'CHI';
        case 'bc':
        case 'bcs':
            return 'BCS';
        case 'tst':
            return 'TST';
        case 'bct':
            return 'BCT';
        case 'suh':
            return 'SUH';
        default:
            return 'CHI';
    }
}
