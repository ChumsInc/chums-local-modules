"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressUploadFile = exports.handleUpload = exports.loadFileContents = void 0;
const debug_1 = require("debug");
const promises_1 = require("fs/promises");
const fs_1 = require("fs");
const formidable_1 = require("formidable");
const debug = (0, debug_1.default)('chums:lib:file-upload');
const ROOT_PATH = '/var/tmp';
const UPLOAD_PATH = ROOT_PATH + '/chums';
function ensureUploadPathExists(options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!options) {
            options = {};
        }
        const uploadPath = options.uploadPath || UPLOAD_PATH;
        try {
            yield (0, promises_1.access)(uploadPath, fs_1.constants.R_OK | fs_1.constants.W_OK);
            return true;
        }
        catch (err) {
            try {
                yield (0, promises_1.mkdir)(uploadPath);
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
    });
}
function loadFileContents(path, removeFile = true) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, promises_1.access)(path, fs_1.constants.R_OK);
            const buffer = yield (0, promises_1.readFile)(path);
            if (removeFile) {
                yield (0, promises_1.unlink)(path);
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
    });
}
exports.loadFileContents = loadFileContents;
function handleUpload(req, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!options) {
            options = {};
        }
        const uploadPath = options.uploadPath || UPLOAD_PATH;
        try {
            yield ensureUploadPathExists(options);
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
    });
}
exports.handleUpload = handleUpload;
function expressUploadFile(req, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield ensureUploadPathExists(options);
            const filepath = yield handleUpload(req);
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
    });
}
exports.expressUploadFile = expressUploadFile;
