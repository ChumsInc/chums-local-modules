import Debug from 'debug';
import {access, mkdir, readFile, rename, unlink} from 'fs/promises';
import {constants, PathLike} from 'node:fs';
import * as formidable from "formidable";
import {Fields, Files} from "formidable";
import {Request} from 'express';
import * as path from "node:path";


const debug = Debug('chums:lib:file-upload');
const ROOT_PATH = '/var/tmp';
export const DEFAULT_UPLOAD_PATH = ROOT_PATH + '/chums';

export interface UploadOptions {
    uploadPath?: string,
    keepOriginalFilename?: boolean,
    preserveFile?: boolean,
}

async function ensureUploadPathExists(options: UploadOptions = {}): Promise<boolean> {
    if (!options) {
        options = {};
    }
    const uploadPath: string = options.uploadPath || DEFAULT_UPLOAD_PATH;
    try {
        await access(uploadPath, constants.R_OK | constants.W_OK);
        return true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
        try {
            await mkdir(uploadPath);
            return true;
        } catch (err: unknown) {
            if (err instanceof Error) {
                debug("ensureUploadPathExists()", err.message);
                return Promise.reject(err);
            }
            return Promise.reject(new Error('Error in ensureUploadPathExists'));
        }
    }
}


export async function loadFileContents(path: PathLike, removeFile: boolean = true): Promise<string> {
    try {
        await access(path, constants.R_OK);
        const buffer = await readFile(path);
        if (removeFile) {
            await unlink(path);
        }
        return Buffer.from(buffer).toString();
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("fetchFileContents()", err.message);
            return Promise.reject(err);
        }
        debug("fetchFileContents()", err);
        return Promise.reject(err);
    }
}


export async function handleUpload(req: Request, options: UploadOptions = {}): Promise<formidable.File> {
    if (!options) {
        options = {};
    }
    const uploadPath: string = options.uploadPath || DEFAULT_UPLOAD_PATH;
    try {
        await ensureUploadPathExists(options);
        return new Promise((resolve, reject) => {
            const form = new formidable.IncomingForm({uploadDir: uploadPath, keepExtensions: true});
            form.on('error', (err: unknown) => {
                if (err instanceof Error) {
                    debug('handleUpload() form.on.error', err.message);
                    return Promise.reject(err);
                }
                debug('error', err);
                return reject(new Error('Unknown error in handleUpload()'));
            });

            form.on('aborted', () => {
                debug('aborted');
                return reject(new Error('upload aborted'));
            });

            form.parse(req, async (err: unknown, fields: Fields, files: Files) => {
                const fileValues = Object.values(files);
                if (!fileValues.length) {
                    return Promise.reject(new Error('No files found'));
                }

                const [fileValue] = fileValues;
                if (!fileValue || fileValue.length === 0) {
                    debug('file was not found?', fileValue);
                    return reject(new Error('file was not found'));
                }
                const [file] = fileValue;
                if (options.keepOriginalFilename && !!file.originalFilename) {
                    await rename(path.join(uploadPath, file.newFilename), path.join(uploadPath, file.originalFilename))
                }
                return resolve(file);
            })
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            debug("handleUpload()", error.message);
            return Promise.reject(error);
        }
        debug("handleUpload()", error);
        return Promise.reject(new Error(`Unknown error in handleUpload(): ${error}`));
    }
}

/**
 * If options.preserveFile is explicitly false then the uploaded file is removed after contents are read
 */
export async function expressUploadFile(req: Request, options: UploadOptions = {}): Promise<string> {
    try {
        await ensureUploadPathExists(options);
        const file = await handleUpload(req);
        return loadFileContents(file.filepath, options.preserveFile === false);
    } catch (error: unknown) {
        if (error instanceof Error) {
            debug("expressUpload()", error.message);
            return Promise.reject(error);
        }
        debug("expressUpload()", error);
        return Promise.reject(new Error(`error in expressUpload(): ${error}`));
    }
}
