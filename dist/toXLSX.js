"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildXLSXHeaders = exports.buildWorkBook = exports.resultToExcelSheet = void 0;
const debug_1 = require("debug");
const debug = debug_1.default('chums:local-modules:toXLSX');
const xlsx_1 = require("xlsx");
function resultToExcelSheet(data, columnNames, onlyColumnNames) {
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
    return xlsx_1.utils.aoa_to_sheet(rows);
}
exports.resultToExcelSheet = resultToExcelSheet;
function buildWorkBook(sheets, options = {}) {
    const defaultOptions = {
        type: 'buffer',
        cellDates: false,
        bookSST: true,
        bookType: 'xlsx',
        sheet: '',
        compression: true,
    };
    const sheetNames = Object.keys(sheets);
    return xlsx_1.write({ SheetNames: sheetNames, Sheets: sheets }, Object.assign(Object.assign({}, defaultOptions), options));
}
exports.buildWorkBook = buildWorkBook;
function buildXLSXHeaders(filename) {
    return {
        'Content-Disposition': `attachment; filename=${filename.replace(/[\s]+/g, '_')}`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
}
exports.buildXLSXHeaders = buildXLSXHeaders;
