import Debug from 'debug';
const debug = Debug('chums:local-modules:toXLSX');
import {utils, WorkSheet, write, WritingOptions} from 'xlsx';
import {RowDataPacket} from "mysql2";

export interface ColumnNames {
    [key:string]: string,
}

export interface WorkBookSheets {
    [key:string]: WorkSheet,
}

export function resultToExcelSheet(data:RowDataPacket[], columnNames:ColumnNames, onlyColumnNames:boolean):WorkSheet {
    let rows:any[] = [];
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
    return utils.aoa_to_sheet(rows);
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


