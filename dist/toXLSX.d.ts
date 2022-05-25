import { WorkSheet, WritingOptions, SheetAOAOpts } from 'xlsx';
import { RowDataPacket } from "mysql2";
export declare const decode_cell: (address: string) => import("xlsx").CellAddress;
export declare const encode_cell: (cell: import("xlsx").CellAddress) => string;
export declare const aoa_to_sheet: {
    <T>(data: T[][], opts?: import("xlsx").AOA2SheetOpts | undefined): WorkSheet;
    (data: any[][], opts?: import("xlsx").AOA2SheetOpts | undefined): WorkSheet;
}, json_to_sheet: {
    <T>(data: T[], opts?: import("xlsx").JSON2SheetOpts | undefined): WorkSheet;
    (data: any[], opts?: import("xlsx").JSON2SheetOpts | undefined): WorkSheet;
}, sheet_add_json: {
    (ws: WorkSheet, data: any[], opts?: import("xlsx").SheetJSONOpts | undefined): WorkSheet;
    <T>(ws: WorkSheet, data: T[], opts?: import("xlsx").SheetJSONOpts | undefined): WorkSheet;
}, sheet_add_aoa: {
    <T>(ws: WorkSheet, data: T[][], opts?: SheetAOAOpts | undefined): WorkSheet;
    (ws: WorkSheet, data: any[][], opts?: SheetAOAOpts | undefined): WorkSheet;
};
export { WorkSheet, WritingOptions, SheetAOAOpts } from 'xlsx';
export declare const xlsxMimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
export interface ColumnNames {
    [key: string]: string;
}
export interface WorkBookSheets {
    [key: string]: WorkSheet;
}
export declare function parseDataForAOA(data: RowDataPacket[], columnNames: ColumnNames, onlyColumnNames: boolean): any[][];
export declare function resultToExcelSheet(data: RowDataPacket[], columnNames: ColumnNames, onlyColumnNames: boolean): WorkSheet;
export declare function addResultToExcelSheet(workSheet: WorkSheet, newData: any[][], options: SheetAOAOpts): WorkSheet;
export declare function buildWorkBook(sheets: WorkBookSheets, options?: WritingOptions): any;
export declare function buildXLSXHeaders(filename: string): {
    'Content-Disposition': string;
    'Content-Type': string;
};
