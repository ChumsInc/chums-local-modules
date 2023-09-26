/// <reference types="node" resolution-mode="require"/>
import { PathLike } from 'node:fs';
import * as formidable from "formidable";
import { Request } from 'express';
export declare const DEFAULT_UPLOAD_PATH: string;
export interface UploadOptions {
    uploadPath?: string;
    keepOriginalFilename?: boolean;
    preserveFile?: boolean;
}
export declare function loadFileContents(path: PathLike, removeFile?: boolean): Promise<string>;
export declare function handleUpload(req: Request, options?: UploadOptions): Promise<formidable.File>;
/**
 *
 * @param {Request} req
 * @param {UploadOptions} options
 * @return {Promise<string>}
 *
 * If options.preserveFile is explicitly false then the uploaded file is removed after contents are read
 */
export declare function expressUploadFile(req: Request, options?: UploadOptions): Promise<string>;
