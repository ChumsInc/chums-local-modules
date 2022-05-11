"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRole = exports.loadValidation = exports.validateUser = void 0;
const debug_1 = require("debug");
const debug = (0, debug_1.default)('chums:local-modules:validate-user');
const node_fetch_1 = require("node-fetch");
const auth_1 = require("./auth");
const jwt_handler_1 = require("./jwt-handler");
const API_HOST = process.env.CHUMS_API_HOST || 'http://localhost';
/**
 * Requests validation from CHUMS /api/user service
 * - On success populates res.locals.profile = {user, roles, accounts} and executes next()
 * - On success populates req.userAuth = {valid, status, profile}
 * - On failure sends status 401 {error: 401, status: 'StatusText'}
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {function} next
 * @returns {Promise<void>}
 */
async function validateUser(req, res, next) {
    try {
        const { valid, status, profile } = await loadValidation(req);
        if (!valid) {
            if (res.locals.debug) {
                debug('validateUser()', valid, status, req.get('referer'));
            }
            res.status(401).json({ error: 401, status });
        }
        res.locals.profile = profile;
        req.userAuth = { valid, status, profile };
        next();
    }
    catch (err) {
        if (err instanceof Error) {
            debug("validateUser()", err.message);
            res.status(401).json({ error: 'Not authorized', message: err.message });
            return;
        }
        debug("validateUser()", err);
        res.status(401).json({ error: 'Not authorized', message: err });
    }
}
exports.validateUser = validateUser;
/**
 * Executes validation request
 *  - validates JWT token from Authorization header "Bearer asdasd...asd" (from a standalone/web app)
 *  - validates req.cookies.PHPSESSID (from a logged in user)
 *  - validates basic authentication (from a API user)
 * @param {Object} req - Express request object
 * @returns {Promise<{valid: boolean, profile: {roles: [], accounts: [], user}}|*>}
 */
async function loadValidation(req) {
    try {
        const { token } = (0, auth_1.jwtToken)(req);
        if (token) {
            const decoded = await (0, jwt_handler_1.validateToken)(token);
            if ((0, jwt_handler_1.isLocalToken)(decoded) && (0, jwt_handler_1.isBeforeExpiry)(decoded)) {
                const { user, roles = [], accounts = [] } = decoded;
                user.roles = roles;
                user.accounts = accounts;
                return { valid: true, profile: { user, roles, accounts } };
            }
        }
        const { user, pass } = (0, auth_1.basicAuth)(req);
        const session = req.cookies.PHPSESSID;
        const fetchOptions = {};
        const headers = new node_fetch_1.Headers();
        headers.set('X-Forwarded-For', req.ip);
        headers.set('referrer', req.get('referrer') || req.originalUrl);
        let url = `${API_HOST}/api/user/validate`;
        if (!!user && !!pass) {
            const credentials = Buffer.from(`${user}:${pass}`).toString('base64');
            headers.set('Authorization', `Basic ${credentials}`);
        }
        else if (!!session) {
            url += `/${encodeURIComponent(session)}`;
        }
        else if (!!token) {
            url += '/google';
            fetchOptions.method = 'post';
            fetchOptions.body = JSON.stringify({ token });
            headers.set('Content-Type', 'application/json');
        }
        fetchOptions.headers = headers;
        const response = await (0, node_fetch_1.default)(url, fetchOptions);
        if (!response.ok) {
            return Promise.reject(new Error(`${response.status} ${response.statusText}`));
        }
        return await response.json();
    }
    catch (err) {
        if (err instanceof Error) {
            debug("loadValidation()", err.message);
            return Promise.reject(err);
        }
        debug("loadValidation()", err);
        return Promise.reject(err);
    }
}
exports.loadValidation = loadValidation;
/**
 * Validates a user role, stored in res.locals.profile.roles
 *  - On success executes next()
 *  - On failure sends status 403 Forbidden, {error: 403, status: 'Forbidden'}
 * @param {String | String[]} validRoles - array of valid roles
 * @returns {function(*, *, *): (*|undefined)}
 */
const validateRole = (validRoles = []) => (req, res, next) => {
    const { roles = [] } = res.locals.profile;
    if (!Array.isArray(validRoles)) {
        validRoles = [validRoles];
    }
    const valid = ['root', ...validRoles];
    const isValid = roles.map(role => valid.includes(role)).length > 0;
    if (isValid) {
        return next();
    }
    debug('validateRole() Not Authorized', res.locals.profile.user.id, validRoles);
    res.status(403).json({ error: 403, status: 'Forbidden' });
};
exports.validateRole = validateRole;
