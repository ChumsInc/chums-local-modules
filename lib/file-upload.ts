import Debug from 'debug';
import {access, mkdir, readFile, unlink} from 'fs/promises';
import {constants, PathLike} from 'fs';
import {Fields, Files, IncomingForm} from "formidable";
import {Request} from 'express';

const debug = Debug('chums:lib:file-upload');
const ROOT_PATH = '/var/tmp';
const UPLOAD_PATH = ROOT_PATH + '/chums';


async function ensureUploadPathExists() {
    try {
        await access(UPLOAD_PATH, constants.R_OK | constants.W_OK);
        return true;
    } catch (err: unknown) {
        try {
            await mkdir(UPLOAD_PATH);
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


export async function handleUpload(req: Request): Promise<PathLike> {
    try {
        await ensureUploadPathExists();
        return new Promise((resolve, reject) => {
            const form = new IncomingForm({uploadDir: UPLOAD_PATH, keepExtensions: true});
            form.on('error', (err) => {
                debug('error', err);
                return reject(new Error(err));
            });

            form.on('aborted', () => {
                debug('aborted');
                return reject(new Error('upload aborted'));
            });

            form.parse(req, (err, fields: Fields, files: Files) => {
                const [file] = Object.values(files);
                if (!file || Array.isArray(file)) {
                    debug('file was not found?', file);
                    return reject({error: 'file was not found'});
                }
                return resolve(file.filepath);
            })
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log("handleUpload()", error.message);
            return Promise.reject(error);
        }
        console.error("handleUpload()", error);
        return Promise.reject(new Error(`Unknown error in handleUpload(): ${error}`));
    }
}


export async function expressUploadFile(req: Request): Promise<string> {
    try {
        const filepath = await handleUpload(req);
        return loadFileContents(filepath);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log("expressUpload()", error.message);
            return Promise.reject(error);
        }
        console.error("expressUpload()", error);
        return Promise.reject(new Error(`error in expressUpload(): ${error}`));
    }
}
