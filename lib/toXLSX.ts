import Debug from 'debug';
import {utils, WorkSheet, write, WritingOptions, SheetAOAOpts} from 'xlsx';
import {RowDataPacket} from "mysql2";

const debug = Debug('chums:local-modules:toXLSX');
export const decode_cell = utils.decode_cell;
export const encode_cell = utils.encode_cell;
export const {aoa_to_sheet, json_to_sheet, sheet_add_json, sheet_add_aoa} = utils;
export type {WorkSheet, WritingOptions, SheetAOAOpts} from 'xlsx';


export const xlsxMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export interface ColumnNames {
    [key:string]: string,
}

export interface WorkBookSheets {
    [key:string]: WorkSheet,
}

export function parseDataForAOA<T = unknown>(data:RowDataPacket[], columnNames: ColumnNames, onlyColumnNames: boolean):(T)[][] {
    let rows:(T)[][] = [];
    let fields:string[] = [];
    let columns:string[] = [];
    if (onlyColumnNames) {
        fields = Object.keys(columnNames);
        columns = [...fields];
        if (data.length) {
            fields.forEach(field => {
                if (data[0][field] === undefined) {
                    debug('resultToExcelSheet()', `field '${field}' does not exist in data.`);
                }
            })
        }
        rows = [
            columns.map(col => columnNames[col] || col),
            ...data.map(row => columns.map(col => row[col] || null))
        ];
    } else {
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

export function resultToExcelSheet<T = unknown>(data:RowDataPacket[], columnNames:ColumnNames, onlyColumnNames:boolean):WorkSheet {
    const rows:T[][] = parseDataForAOA(data, columnNames, onlyColumnNames);
    return utils.aoa_to_sheet(rows);
}

export function addResultToExcelSheet<T = unknown>(workSheet:WorkSheet, newData:T[][], options:SheetAOAOpts):WorkSheet {
    return utils.sheet_add_aoa(workSheet, newData, options);
}

export function buildWorkBook(sheets:WorkBookSheets, options:WritingOptions = {}):any {
    const defaultOptions:WritingOptions = {
        type: 'buffer',
        cellDates: false,
        bookSST: true,
        bookType: 'xlsx',
        sheet: '',
        compression: true,
    }
    const sheetNames = Object.keys(sheets)
    return write({SheetNames: sheetNames, Sheets: sheets}, {...defaultOptions, ...options});
}

export function buildXLSXHeaders(filename: string): { 'Content-Disposition': string, 'Content-Type':string } {
    return {
        'Content-Disposition': `attachment; filename=${filename.replace(/[\s]+/g, '_')}`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }
}


