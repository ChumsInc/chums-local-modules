import Debug from 'debug';
import { access, mkdir, readFile, rename, unlink } from 'fs/promises';
import { constants } from 'node:fs';
import { IncomingForm } from "formidable";
import * as path from "node:path";
export { File } from 'formidable';
const debug = Debug('chums:lib:file-upload');
const ROOT_PATH = '/var/tmp';
export const DEFAULT_UPLOAD_PATH = ROOT_PATH + '/chums';
async function ensureUploadPathExists(options = {}) {
    if (!options) {
        options = {};
    }
    const uploadPath = options.uploadPath || DEFAULT_UPLOAD_PATH;
    try {
        await access(uploadPath, constants.R_OK | constants.W_OK);
        return true;
    }
    catch (err) {
        try {
            await mkdir(uploadPath);
            return true;
        }
        catch (err) {
            if (err instanceof Error) {
                debug("ensureUploadPathExists()", err.message);
                return Promise.reject(err);
            }
            return Promise.reject(new Error('Error in ensureUploadPathExists'));
        }
    }
}
export async function loadFileContents(path, removeFile = true) {
    try {
        await access(path, constants.R_OK);
        const buffer = await readFile(path);
        if (removeFile) {
            await unlink(path);
        }
        return Buffer.from(buffer).toString();
    }
    catch (err) {
        if (err instanceof Error) {
            debug("fetchFileContents()", err.message);
            return Promise.reject(err);
        }
        debug("fetchFileContents()", err);
        return Promise.reject(err);
    }
}
export async function handleUpload(req, options = {}) {
    if (!options) {
        options = {};
    }
    const uploadPath = options.uploadPath || DEFAULT_UPLOAD_PATH;
    try {
        await ensureUploadPathExists(options);
        return new Promise((resolve, reject) => {
            const form = new IncomingForm({ uploadDir: uploadPath, keepExtensions: true });
            form.on('error', (err) => {
                if (err instanceof Error) {
                    debug('handleUpload() form.on.error', err.message);
                    return Promise.reject(err);
                }
                debug('error', err);
                return reject(new Error(err));
            });
            form.on('aborted', () => {
                debug('aborted');
                return reject(new Error('upload aborted'));
            });
            form.parse(req, async (err, fields, files) => {
                const fileValues = Object.values(files);
                if (!fileValues.length) {
                    return Promise.reject(new Error('No files found'));
                }
                const [file] = fileValues;
                if (!file || Array.isArray(file)) {
                    debug('file was not found?', file);
                    return reject(new Error('file was not found'));
                }
                if (options.keepOriginalFilename && !!file.originalFilename) {
                    await rename(path.join(uploadPath, file.newFilename), path.join(uploadPath, file.originalFilename));
                }
                return resolve(file);
            });
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log("handleUpload()", error.message);
            return Promise.reject(error);
        }
        console.error("handleUpload()", error);
        return Promise.reject(new Error(`Unknown error in handleUpload(): ${error}`));
    }
}
/**
 *
 * @param {Request} req
 * @param {UploadOptions} options
 * @return {Promise<string>}
 *
 * If options.preserveFile is explicitly false then the uploaded file is removed after contents are read
 */
export async function expressUploadFile(req, options = {}) {
    try {
        await ensureUploadPathExists(options);
        const file = await handleUpload(req);
        return loadFileContents(file.filepath, options.preserveFile === false);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log("expressUpload()", error.message);
            return Promise.reject(error);
        }
        console.error("expressUpload()", error);
        return Promise.reject(new Error(`error in expressUpload(): ${error}`));
    }
}
