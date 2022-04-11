"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLocalToken = exports.isBeforeExpiry = exports.validateToken = void 0;
const debug_1 = require("debug");
const jsonwebtoken_1 = require("jsonwebtoken");
const debug = (0, debug_1.default)('chums:local-modules:jwt-handler');
const { JWT_ISSUER = 'NOT THE ISSUER', JWT_SECRET = 'NOT THE SECRET' } = process.env;
const ERR_TOKEN_EXPIRED = 'TokenExpiredError';
/**
 * Validates a JTW Token
 * @param {String} token - A JWT token to be validated
 * @return {Promise<BaseJWTToken|Error>}
 */
const validateToken = async (token) => {
    try {
        const payload = (0, jsonwebtoken_1.decode)(token);
        if (!(0, exports.isLocalToken)(payload)) {
            if ((0, exports.isBeforeExpiry)(token)) {
                return payload;
            }
            return Promise.reject(new Error('Invalid Token: token may be invalid or expired'));
        }
        return await (0, jsonwebtoken_1.verify)(token, JWT_SECRET);
    }
    catch (err) {
        if (!(err instanceof Error)) {
            return Promise.reject(err);
        }
        if (err.name !== ERR_TOKEN_EXPIRED) {
            debug("validateToken()", err.name, err.message);
        }
        return Promise.reject(err);
    }
};
exports.validateToken = validateToken;
/**
 * Validates a token expiration timestamp
 */
const isBeforeExpiry = (payload) => {
    if (typeof payload === 'string') {
        payload = (0, jsonwebtoken_1.decode)(payload);
    }
    if (!payload || typeof payload === 'string') {
        return false;
    }
    const { exp } = payload;
    const now = new Date().valueOf() / 1000;
    return !!exp && exp > now;
};
exports.isBeforeExpiry = isBeforeExpiry;
/**
 * Checks to see if a token is locally issued
 */
const isLocalToken = (payload) => {
    if (typeof payload === 'string') {
        payload = (0, jsonwebtoken_1.decode)(payload);
    }
    if (!payload || typeof payload === 'string') {
        return false;
    }
    const { iss } = payload;
    return !!iss && iss === JWT_ISSUER;
};
exports.isLocalToken = isLocalToken;
