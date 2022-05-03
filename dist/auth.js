'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtToken = exports.basicAuth = void 0;
/**
 * Gets a user, password from http basic authorization header
 * @param {Object} req - Express Request object
 * @returns {{pass: string|null, user: string|null}}
 */
const basicAuth = (req) => {
    const nullUser = { user: null, pass: null };
    const authorization = req.get('authorization');
    if (!authorization) {
        return nullUser;
    }
    const [basic = '', credentials = ''] = authorization.split(' ');
    if (basic.trim().toLowerCase() !== 'basic') {
        return nullUser;
    }
    // get username and password from base64 encoded credentials
    const [user = null, pass = null] = Buffer.from(credentials.trim(), 'base64').toString().split(':');
    return { user, pass };
};
exports.basicAuth = basicAuth;
/**
 * Gets a token from a http bearer authorization
 */
const jwtToken = (req) => {
    const nullToken = { token: null };
    const authorization = req.header('authorization');
    if (!authorization) {
        return nullToken;
    }
    const [bearer = '', token = null] = authorization.split(' ');
    if (bearer.trim().toLowerCase() !== 'bearer') {
        return nullToken;
    }
    return { token };
};
exports.jwtToken = jwtToken;
