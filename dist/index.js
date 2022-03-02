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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressUploadFile = exports.loadFileContents = exports.handleUpload = exports.loadSocketValidation = exports.WebSocketServer = exports.validateUserAccount = exports.loadValidation = exports.validateRole = exports.validateUser = exports.parseSQL = exports.getSageCompany = exports.getDBCompany = exports.parseDataForAOA = exports.addResultToExcelSheet = exports.buildWorkBook = exports.buildXLSXHeaders = exports.resultToExcelSheet = exports.getConnection = exports.pool = exports.mysql2Pool = exports.sendOldSESEmail = exports.getTs36 = exports.getTs = exports.getLogoImageAttachment = exports.sendGmail = exports.sendEmail = exports.apiFetch = void 0;
var api_fetch_1 = require("./api-fetch");
Object.defineProperty(exports, "apiFetch", { enumerable: true, get: function () { return api_fetch_1.apiFetch; } });
var mailer_1 = require("./mailer");
Object.defineProperty(exports, "sendEmail", { enumerable: true, get: function () { return mailer_1.sendEmail; } });
Object.defineProperty(exports, "sendGmail", { enumerable: true, get: function () { return mailer_1.sendGmail; } });
Object.defineProperty(exports, "getLogoImageAttachment", { enumerable: true, get: function () { return mailer_1.getLogoImageAttachment; } });
Object.defineProperty(exports, "getTs", { enumerable: true, get: function () { return mailer_1.getTs; } });
Object.defineProperty(exports, "getTs36", { enumerable: true, get: function () { return mailer_1.getTs36; } });
Object.defineProperty(exports, "sendOldSESEmail", { enumerable: true, get: function () { return mailer_1.sendOldSESEmail; } });
var mysql_1 = require("./mysql");
Object.defineProperty(exports, "mysql2Pool", { enumerable: true, get: function () { return mysql_1.mysql2Pool; } });
Object.defineProperty(exports, "pool", { enumerable: true, get: function () { return mysql_1.mysql2Pool; } });
Object.defineProperty(exports, "getConnection", { enumerable: true, get: function () { return mysql_1.getConnection; } });
var toXLSX_1 = require("./toXLSX");
Object.defineProperty(exports, "resultToExcelSheet", { enumerable: true, get: function () { return toXLSX_1.resultToExcelSheet; } });
Object.defineProperty(exports, "buildXLSXHeaders", { enumerable: true, get: function () { return toXLSX_1.buildXLSXHeaders; } });
Object.defineProperty(exports, "buildWorkBook", { enumerable: true, get: function () { return toXLSX_1.buildWorkBook; } });
Object.defineProperty(exports, "addResultToExcelSheet", { enumerable: true, get: function () { return toXLSX_1.addResultToExcelSheet; } });
Object.defineProperty(exports, "parseDataForAOA", { enumerable: true, get: function () { return toXLSX_1.parseDataForAOA; } });
var utils_1 = require("./utils");
Object.defineProperty(exports, "getDBCompany", { enumerable: true, get: function () { return utils_1.getDBCompany; } });
Object.defineProperty(exports, "getSageCompany", { enumerable: true, get: function () { return utils_1.getSageCompany; } });
Object.defineProperty(exports, "parseSQL", { enumerable: true, get: function () { return utils_1.parseSQL; } });
var validate_user_1 = require("./validate-user");
Object.defineProperty(exports, "validateUser", { enumerable: true, get: function () { return validate_user_1.validateUser; } });
Object.defineProperty(exports, "validateRole", { enumerable: true, get: function () { return validate_user_1.validateRole; } });
Object.defineProperty(exports, "loadValidation", { enumerable: true, get: function () { return validate_user_1.loadValidation; } });
var validate_user_account_1 = require("./validate-user-account");
Object.defineProperty(exports, "validateUserAccount", { enumerable: true, get: function () { return validate_user_account_1.validateUserAccount; } });
var websockets_1 = require("./websockets");
Object.defineProperty(exports, "WebSocketServer", { enumerable: true, get: function () { return websockets_1.WebSocketServer; } });
Object.defineProperty(exports, "loadSocketValidation", { enumerable: true, get: function () { return websockets_1.loadSocketValidation; } });
var file_upload_1 = require("./file-upload");
Object.defineProperty(exports, "handleUpload", { enumerable: true, get: function () { return file_upload_1.handleUpload; } });
Object.defineProperty(exports, "loadFileContents", { enumerable: true, get: function () { return file_upload_1.loadFileContents; } });
Object.defineProperty(exports, "expressUploadFile", { enumerable: true, get: function () { return file_upload_1.expressUploadFile; } });
__exportStar(require("./types"), exports);
