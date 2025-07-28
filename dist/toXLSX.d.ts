import { WorkSheet, WritingOptions, SheetAOAOpts } from 'xlsx';
import { RowDataPacket } from "mysql2";
import { Headers } from "node-fetch";
export declare const decode_cell: (address: string) => import("xlsx").CellAddress;
export declare const encode_cell: (cell: import("xlsx").CellAddress) => string;
export declare const aoa_to_sheet: {
    <T>(data: T[][], opts?: import("xlsx").AOA2SheetOpts): WorkSheet;
    (data: any[][], opts?: import("xlsx").AOA2SheetOpts): WorkSheet;
}, json_to_sheet: {
    <T>(data: T[], opts?: import("xlsx").JSON2SheetOpts): WorkSheet;
    (data: any[], opts?: import("xlsx").JSON2SheetOpts): WorkSheet;
}, sheet_add_json: {
    (ws: WorkSheet, data: any[], opts?: import("xlsx").JSON2SheetOpts): WorkSheet;
    <T>(ws: WorkSheet, data: T[], opts?: import("xlsx").JSON2SheetOpts): WorkSheet;
}, sheet_add_aoa: {
    <T>(ws: WorkSheet, data: T[][], opts?: SheetAOAOpts): WorkSheet;
    (ws: WorkSheet, data: any[][], opts?: SheetAOAOpts): WorkSheet;
};
export type { WorkSheet, WritingOptions, SheetAOAOpts } from 'xlsx';
export declare const xlsxMimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
export type ColumnNames<T = RowDataPacket> = {
    [key in keyof T]: string;
};
export interface WorkBookSheets {
    [key: string]: WorkSheet;
}
export declare function parseDataForAOA<T = RowDataPacket>(data: T[], columnNames: ColumnNames<T>, onlyColumnNames: boolean): unknown[][];
export declare function resultToExcelSheet<T = RowDataPacket>(data: T[], columnNames: ColumnNames<T>, onlyColumnNames: boolean): WorkSheet;
export declare function addResultToExcelSheet<T = RowDataPacket>(workSheet: WorkSheet, newData: T[][], options: SheetAOAOpts): WorkSheet;
export declare function buildWorkBook(sheets: WorkBookSheets, options?: WritingOptions): unknown;
export declare function buildXLSXHeaders(filename: string): Headers;
