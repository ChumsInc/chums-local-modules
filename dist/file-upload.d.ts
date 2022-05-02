/// <reference types="node" />
import { PathLike } from 'fs';
import { File } from "formidable";
import { Request } from 'express';
export { File } from 'formidable';
export interface UploadOptions {
    uploadPath?: string;
    keepOriginalFilename?: boolean;
}
export declare function loadFileContents(path: PathLike, removeFile?: boolean): Promise<string>;
export declare function handleUpload(req: Request, options?: UploadOptions): Promise<File>;
export declare function expressUploadFile(req: Request, options?: UploadOptions): Promise<string>;
