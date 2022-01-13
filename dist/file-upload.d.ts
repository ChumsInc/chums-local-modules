/// <reference types="node" />
import { PathLike } from 'fs';
import { Request } from 'express';
export declare function loadFileContents(path: PathLike, removeFile?: boolean): Promise<string>;
export declare function handleUpload(req: Request): Promise<PathLike>;
export declare function expressUploadFile(req: Request): Promise<string>;
