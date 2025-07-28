import Debug from 'debug';
import { utils, write } from 'xlsx';
const debug = Debug('chums:local-modules:toXLSX');
export const decode_cell = utils.decode_cell;
export const encode_cell = utils.encode_cell;
export const { aoa_to_sheet, json_to_sheet, sheet_add_json, sheet_add_aoa } = utils;
export const xlsxMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
export function parseDataForAOA(data, columnNames, onlyColumnNames) {
    let fields = [];
    if (onlyColumnNames) {
        fields = Object.keys(columnNames);
        if (data.length) {
            fields.forEach(field => {
                if (data[0][field] === undefined) {
                    debug('resultToExcelSheet()', `field '${String(field)}' does not exist in data.`);
                }
            });
        }
        return [
            fields.map(field => columnNames[field] ?? field),
            ...data.map(row => {
                return fields.map(field => row[field] ?? null);
            })
        ];
    }
    if (data.length) {
        fields = Object.keys(data[0]);
        return [
            fields,
            ...data.map(row => {
                return fields.map(field => row[field] ?? null);
            })
        ];
    }
    return [];
}
export function resultToExcelSheet(data, columnNames, onlyColumnNames) {
    const rows = parseDataForAOA(data, columnNames, onlyColumnNames);
    return utils.aoa_to_sheet(rows);
}
export function addResultToExcelSheet(workSheet, newData, options) {
    return utils.sheet_add_aoa(workSheet, newData, options);
}
export function buildWorkBook(sheets, options = {}) {
    const defaultOptions = {
        type: 'buffer',
        cellDates: false,
        bookSST: true,
        bookType: 'xlsx',
        sheet: '',
        compression: true,
    };
    const sheetNames = Object.keys(sheets);
    return write({ SheetNames: sheetNames, Sheets: sheets }, { ...defaultOptions, ...options });
}
export function buildXLSXHeaders(filename) {
    return {
        'Content-Disposition': `attachment; filename=${filename.replace(/[\s]+/g, '_')}`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
}
