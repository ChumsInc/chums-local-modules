import Debug from 'debug';
import { verify, decode } from 'jsonwebtoken';
const debug = Debug('chums:local-modules:jwt-handler');
const { JWT_ISSUER = 'NOT THE ISSUER', JWT_SECRET = 'NOT THE SECRET' } = process.env;
const ERR_TOKEN_EXPIRED = 'TokenExpiredError';
/**
 * Validates a JTW Token
 * @param {String} token - A JWT token to be validated
 * @return {Promise<BaseJWTToken|Error>}
 */
export const validateToken = async (token) => {
    try {
        const payload = decode(token);
        if (!isLocalToken(payload)) {
            if (isBeforeExpiry(token)) {
                return payload;
            }
            return Promise.reject(new Error('Invalid Token: token may be invalid or expired'));
        }
        return await verify(token, JWT_SECRET);
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
/**
 * Validates a token expiration timestamp
 */
export const isBeforeExpiry = (payload) => {
    if (typeof payload === 'string') {
        payload = decode(payload);
    }
    if (!payload || typeof payload === 'string') {
        return false;
    }
    const { exp } = payload;
    const now = new Date().valueOf() / 1000;
    return !!exp && exp > now;
};
/**
 * Checks to see if a token is locally issued
 */
export const isLocalToken = (payload) => {
    if (typeof payload === 'string') {
        payload = decode(payload);
    }
    if (!payload || typeof payload === 'string') {
        return false;
    }
    const { iss } = payload;
    return !!iss && iss === JWT_ISSUER;
};
