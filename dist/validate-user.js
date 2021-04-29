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
exports.validateRole = exports.loadValidation = exports.validateUser = void 0;
const debug_1 = require("debug");
const debug = debug_1.default('chums:local-modules:validate-user');
const node_fetch_1 = require("node-fetch");
const auth_1 = require("./auth");
const jwt_handler_1 = require("./jwt-handler");
/**
 * Requests validation from CHUMS /api/user service
 * - On success populates res.locals.profile = {user, roles, accounts} and executes next()
 * - On failure sends status 401 {error: 401, status: 'StatusText'}
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {function} next
 * @returns {Promise<void>}
 */
function validateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { valid, status, profile } = yield loadValidation(req);
            if (!valid) {
                res.status(401).json({ error: 401, status });
            }
            res.locals.profile = profile;
            next();
        }
        catch (err) {
            debug("testUser()", err.message);
            res.status(401).json({ error: 'Not authorized', message: err.message });
        }
    });
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
function loadValidation(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token } = auth_1.jwtToken(req);
            if (token) {
                const decoded = yield jwt_handler_1.validateToken(token);
                if (jwt_handler_1.isBeforeExpiry(decoded)) {
                    const { user, roles = [], accounts = [] } = decoded;
                    user.roles = roles;
                    user.accounts = accounts;
                    return { valid: true, profile: { user, roles, accounts } };
                }
            }
            const { user, pass } = auth_1.basicAuth(req);
            const session = req.cookies.PHPSESSID;
            const headers = new node_fetch_1.Headers();
            headers.set('X-Forwarded-For', req.ip);
            headers.set('referrer', req.get('referrer') || req.originalUrl);
            let url = 'http://localhost/api/user/validate';
            if (!!user && !!pass) {
                const credentials = Buffer.from(`${user}:${pass}`).toString('base64');
                headers.set('Authorization', `Basic ${credentials}`);
            }
            else if (!!session) {
                url += `/${encodeURIComponent(session)}`;
            }
            const response = yield node_fetch_1.default(url, { headers });
            if (!response.ok) {
                return Promise.reject(new Error(`${response.status} ${response.statusText}`));
            }
            return yield response.json();
        }
        catch (err) {
            debug("loadValidation()", err.message);
            return Promise.reject(err);
        }
    });
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
