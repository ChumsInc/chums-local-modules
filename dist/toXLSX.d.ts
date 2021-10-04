import { WorkSheet, WritingOptions, SheetAOAOpts } from 'xlsx';
import { RowDataPacket } from "mysql2";
export { utils } from 'xlsx';
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
