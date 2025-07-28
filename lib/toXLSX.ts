import Debug from 'debug';
import {utils, WorkSheet, write, WritingOptions, SheetAOAOpts} from 'xlsx';
import {RowDataPacket} from "mysql2";

const debug = Debug('chums:local-modules:toXLSX');
export const decode_cell = utils.decode_cell;
export const encode_cell = utils.encode_cell;
export const {aoa_to_sheet, json_to_sheet, sheet_add_json, sheet_add_aoa} = utils;
export type {WorkSheet, WritingOptions, SheetAOAOpts} from 'xlsx';


export const xlsxMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';


export type ColumnNames<T = RowDataPacket> = {
    [key in keyof T]: string;
};

export interface WorkBookSheets {
    [key: string]: WorkSheet,
}

export function parseDataForAOA<T = RowDataPacket>(data: T[], columnNames: ColumnNames<T>, onlyColumnNames: boolean): unknown[][] {

    let fields: (keyof T)[] = [];
    if (onlyColumnNames) {
        fields = Object.keys(columnNames) as (keyof T)[];
        if (data.length) {
            fields.forEach(field => {
                if (data[0][field] === undefined) {
                    debug('resultToExcelSheet()', `field '${String(field)}' does not exist in data.`);
                }
            })
        }
        return [
            fields.map(field => columnNames[field] ?? field),
            ...data.map(row => {
                return fields.map(field => row[field] ?? null);
            })
        ]
    }

    if (data.length) {
        fields = Object.keys(data[0] as unknown as object) as (keyof T)[];
        return [
            fields,
            ...data.map(row => {
                return fields.map(field => row[field] ?? null);
            })
        ]
    }

    return [];
}

export function resultToExcelSheet<T = RowDataPacket>(data: T[], columnNames: ColumnNames<T>, onlyColumnNames: boolean): WorkSheet {
    const rows = parseDataForAOA<T>(data, columnNames, onlyColumnNames);
    return utils.aoa_to_sheet(rows);
}

export function addResultToExcelSheet<T = RowDataPacket>(workSheet: WorkSheet, newData: T[][], options: SheetAOAOpts): WorkSheet {
    return utils.sheet_add_aoa(workSheet, newData, options);
}

export function buildWorkBook(sheets: WorkBookSheets, options: WritingOptions = {}): unknown {
    const defaultOptions: WritingOptions = {
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

export function buildXLSXHeaders(filename: string): { 'Content-Disposition': string, 'Content-Type': string } {
    return {
        'Content-Disposition': `attachment; filename=${filename.replace(/[\s]+/g, '_')}`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }
}


