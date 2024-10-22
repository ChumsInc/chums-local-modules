import Debug from 'debug';
const debug = Debug('chums:local-modules:toXLSX');
import { utils, write } from 'xlsx';
export const decode_cell = utils.decode_cell;
export const encode_cell = utils.encode_cell;
export const { aoa_to_sheet, json_to_sheet, sheet_add_json, sheet_add_aoa } = utils;
export const xlsxMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
export function parseDataForAOA(data, columnNames, onlyColumnNames) {
    let rows = [];
    let fields = [];
    let columns = [];
    if (onlyColumnNames) {
        fields = Object.keys(columnNames);
        columns = [...fields];
        if (data.length) {
            fields.forEach(field => {
                if (data[0][field] === undefined) {
                    debug('resultToExcelSheet()', `field '${field}' does not exist in data.`);
                }
            });
        }
        rows = [
            columns.map(col => columnNames[col] || col),
            ...data.map(row => columns.map(col => row[col] || null))
        ];
    }
    else {
        if (data.length) {
            fields = Object.keys(data[0]);
            columns = [...fields];
            rows = [
                columns.map(col => columnNames[col] || col),
                ...data.map(row => Object.values(row))
            ];
        }
    }
    return rows;
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
