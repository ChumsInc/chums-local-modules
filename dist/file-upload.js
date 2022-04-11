"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressUploadFile = exports.handleUpload = exports.loadFileContents = void 0;
const debug_1 = require("debug");
const promises_1 = require("fs/promises");
const fs_1 = require("fs");
const formidable_1 = require("formidable");
const debug = (0, debug_1.default)('chums:lib:file-upload');
const ROOT_PATH = '/var/tmp';
const UPLOAD_PATH = ROOT_PATH + '/chums';
async function ensureUploadPathExists(options = {}) {
    if (!options) {
        options = {};
    }
    const uploadPath = options.uploadPath || UPLOAD_PATH;
    try {
        await (0, promises_1.access)(uploadPath, fs_1.constants.R_OK | fs_1.constants.W_OK);
        return true;
    }
    catch (err) {
        try {
            await (0, promises_1.mkdir)(uploadPath);
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
async function loadFileContents(path, removeFile = true) {
    try {
        await (0, promises_1.access)(path, fs_1.constants.R_OK);
        const buffer = await (0, promises_1.readFile)(path);
        if (removeFile) {
            await (0, promises_1.unlink)(path);
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
exports.loadFileContents = loadFileContents;
async function handleUpload(req, options = {}) {
    if (!options) {
        options = {};
    }
    const uploadPath = options.uploadPath || UPLOAD_PATH;
    try {
        await ensureUploadPathExists(options);
        return new Promise((resolve, reject) => {
            const form = new formidable_1.IncomingForm({ uploadDir: uploadPath, keepExtensions: true });
            form.on('error', (err) => {
                debug('error', err);
                return reject(new Error(err));
            });
            form.on('aborted', () => {
                debug('aborted');
                return reject(new Error('upload aborted'));
            });
            form.parse(req, (err, fields, files) => {
                const [file] = Object.values(files);
                if (!file || Array.isArray(file)) {
                    debug('file was not found?', file);
                    return reject({ error: 'file was not found' });
                }
                return resolve(file.filepath);
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
exports.handleUpload = handleUpload;
async function expressUploadFile(req, options = {}) {
    try {
        await ensureUploadPathExists(options);
        const filepath = await handleUpload(req);
        return loadFileContents(filepath);
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
exports.expressUploadFile = expressUploadFile;
