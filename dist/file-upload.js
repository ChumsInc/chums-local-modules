"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressUploadFile = exports.handleUpload = exports.loadFileContents = exports.DEFAULT_UPLOAD_PATH = exports.File = void 0;
const debug_1 = __importDefault(require("debug"));
const promises_1 = require("fs/promises");
const fs_1 = require("fs");
const formidable_1 = require("formidable");
const path = __importStar(require("path"));
var formidable_2 = require("formidable");
Object.defineProperty(exports, "File", { enumerable: true, get: function () { return formidable_2.File; } });
const debug = (0, debug_1.default)('chums:lib:file-upload');
const ROOT_PATH = '/var/tmp';
exports.DEFAULT_UPLOAD_PATH = ROOT_PATH + '/chums';
async function ensureUploadPathExists(options = {}) {
    if (!options) {
        options = {};
    }
    const uploadPath = options.uploadPath || exports.DEFAULT_UPLOAD_PATH;
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
    const uploadPath = options.uploadPath || exports.DEFAULT_UPLOAD_PATH;
    try {
        await ensureUploadPathExists(options);
        return new Promise((resolve, reject) => {
            const form = new formidable_1.IncomingForm({ uploadDir: uploadPath, keepExtensions: true });
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
                    await (0, promises_1.rename)(path.join(uploadPath, file.newFilename), path.join(uploadPath, file.originalFilename));
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
exports.handleUpload = handleUpload;
/**
 *
 * @param {Request} req
 * @param {UploadOptions} options
 * @return {Promise<string>}
 *
 * If options.preserveFile is explicitly false then the uploaded file is removed after contents are read
 */
async function expressUploadFile(req, options = {}) {
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
exports.expressUploadFile = expressUploadFile;
