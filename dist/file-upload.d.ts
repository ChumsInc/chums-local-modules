/// <reference types="node" />
import { PathLike } from 'fs';
import { Request } from 'express';
export interface UploadOptions {
    uploadPath?: string;
}
export declare function loadFileContents(path: PathLike, removeFile?: boolean): Promise<string>;
export declare function handleUpload(req: Request, options?: UploadOptions): Promise<PathLike>;
export declare function expressUploadFile(req: Request, options?: UploadOptions): Promise<string>;
