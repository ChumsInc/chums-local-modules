export {apiFetch, apiFetchJSON} from './api-fetch.js';
export type {Response, APIFetchOptions} from './api-fetch.d.ts'

export {deprecationNotice} from './deprecation-notice.js';

export {sendEmail, sendGmail, getLogoImageAttachment, getTs, getTs36} from './mailer.js';
export type {sendMailProps, Address} from './mailer.d.ts';

export {mysql2Pool, mysql2Pool as pool, getConnection} from './mysql.js';
export type {Pool, QueryOptions, PoolConnection, Connection} from './mysql.d.ts';

export {
    resultToExcelSheet,
    buildXLSXHeaders,
    buildWorkBook,
    addResultToExcelSheet,
    parseDataForAOA,
    aoa_to_sheet,
    json_to_sheet,
    sheet_add_json,
    sheet_add_aoa,
    xlsxMimeType,
    encode_cell,
    decode_cell
} from './toXLSX.js';
export type {WorkBookSheets, ColumnNames, SheetAOAOpts, WorkSheet, WritingOptions} from './toXLSX.d.ts'

export {getDBCompany, getSageCompany, parseSQL} from './utils.js';
export type {ParseSQLParams} from './utils.d.ts';

export {
    validateUser,
    validateRole,
    loadValidation,
    getUserValidation
} from './validate-user.js';

export {
    validateUserAccount,
    fetchCustomerValidation,
} from './validate-user-account.js';

export type {ValidateUserAccountProps, CustomerValidationResponse, SuccessResponse} from './validate-user-account.d.ts'

export {webSocketServer, loadSocketValidation} from './websockets.js';
export type {ProfileWebSocket, ExtWebSocket} from './websockets.d.ts'

export {
    handleUpload,
    loadFileContents,
    expressUploadFile,
    DEFAULT_UPLOAD_PATH
} from './file-upload.js';
export type {UploadOptions} from './file-upload.d.ts'

export type {
    User,
    UserAccount,
    UserProfile,
    UserValidation,
    BaseJWTToken,
    UserJWTToken,
    GoogleJWTToken
} from './types.d.ts';

export type {File as FormidableFile} from 'formidable'

export {isGoogleToken, isLocalToken, validateToken, isBeforeExpiry} from './jwt-handler.js';

export {logPath} from './log-path.js'
