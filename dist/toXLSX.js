"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildXLSXHeaders = exports.buildWorkBook = exports.addResultToExcelSheet = exports.resultToExcelSheet = exports.parseDataForAOA = exports.xlsxMimeType = exports.sheet_add_aoa = exports.sheet_add_json = exports.json_to_sheet = exports.aoa_to_sheet = exports.encode_cell = exports.decode_cell = void 0;
const debug_1 = __importDefault(require("debug"));
const debug = (0, debug_1.default)('chums:local-modules:toXLSX');
const xlsx_1 = require("xlsx");
exports.decode_cell = xlsx_1.utils.decode_cell;
exports.encode_cell = xlsx_1.utils.encode_cell;
exports.aoa_to_sheet = xlsx_1.utils.aoa_to_sheet, exports.json_to_sheet = xlsx_1.utils.json_to_sheet, exports.sheet_add_json = xlsx_1.utils.sheet_add_json, exports.sheet_add_aoa = xlsx_1.utils.sheet_add_aoa;
exports.xlsxMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
function parseDataForAOA(data, columnNames, onlyColumnNames) {
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
exports.parseDataForAOA = parseDataForAOA;
function resultToExcelSheet(data, columnNames, onlyColumnNames) {
    let rows = parseDataForAOA(data, columnNames, onlyColumnNames);
    return xlsx_1.utils.aoa_to_sheet(rows);
}
exports.resultToExcelSheet = resultToExcelSheet;
function addResultToExcelSheet(workSheet, newData, options) {
    return xlsx_1.utils.sheet_add_aoa(workSheet, newData, options);
}
exports.addResultToExcelSheet = addResultToExcelSheet;
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
    return (0, xlsx_1.write)({ SheetNames: sheetNames, Sheets: sheets }, { ...defaultOptions, ...options });
}
exports.buildWorkBook = buildWorkBook;
function buildXLSXHeaders(filename) {
    return {
        'Content-Disposition': `attachment; filename=${filename.replace(/[\s]+/g, '_')}`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
}
exports.buildXLSXHeaders = buildXLSXHeaders;
