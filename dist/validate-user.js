import Debug from 'debug';
import { default as fetch, Headers } from 'node-fetch';
import { basicAuth, jwtToken } from './auth.js';
import { isBeforeExpiry, isLocalToken, validateToken } from './jwt-handler.js';
const debug = Debug('chums:local-modules:validate-user');
const API_HOST = process.env.CHUMS_API_HOST || 'http://localhost';
/**
 * Requests validation from CHUMS /api/user service
 * - On success populates res.locals.profile = {user, roles, accounts} and executes next()
 * - On success populates req.userAuth = {valid, status, profile}
 * - On failure sends status 401 {error: 401, status: 'StatusText'}
 */
export async function validateUser(req, res, next) {
    try {
        const validation = await loadValidation(req);
        if (!validation) {
            debug('validateUser()', 'No Validation', req.method, req.originalUrl, req.get('referer'));
            res.status(401).json({ error: 'Not authorized', message: 'Invalid validation response' });
            return;
        }
        const { valid, status, profile } = validation;
        if (!valid) {
            debug('validateUser()', 'Not Validated', req.method, req.originalUrl, req.get('referer'));
            res.status(401).json({ error: 401, status });
        }
        res.locals.profile = profile;
        res.locals.auth = { valid, status, profile };
        next();
    }
    catch (err) {
        if (err instanceof Error) {
            debug("validateUser()", err.message, req.ip, req.method, req.originalUrl);
            res.status(401).json({ error: 'Not authorized', message: err.message });
            return;
        }
        debug("validateUser()", err);
        res.status(401).json({ error: 'Not authorized', message: err });
    }
}
function isUserValidation(auth) {
    return !!auth && auth.valid !== undefined;
}
export function getUserValidation(res) {
    return isUserValidation(res.locals.auth) ? res.locals.auth : null;
}
/**
 * Executes validation request
 *  - validates JWT token from Authorization header "Bearer asdasd...asd" (from a standalone/web app)
 *  - validates req.cookies.PHPSESSID (from a logged-in user)
 *  - validates basic authentication (from an API user)
 */
export async function loadValidation(req) {
    try {
        const { token } = jwtToken(req);
        if (token) {
            const decoded = await validateToken(token);
            if (isLocalToken(decoded) && isBeforeExpiry(decoded)) {
                const { user, roles = [], accounts = [] } = decoded;
                user.roles = roles;
                user.accounts = accounts;
                return { valid: true, profile: { user, roles, accounts } };
            }
        }
        const { user, pass } = basicAuth(req);
        const session = req.cookies.PHPSESSID;
        const fetchOptions = {};
        const headers = new Headers();
        headers.set('X-Forwarded-For', req.ip ?? 'unknown');
        headers.set('referrer', req.get('referrer') || req.originalUrl);
        let url = `${API_HOST}/api/user/validate.json`;
        if (!!user && !!pass) {
            const credentials = Buffer.from(`${user}:${pass}`).toString('base64');
            headers.set('Authorization', `Basic ${credentials}`);
        }
        else if (token) {
            url = `${API_HOST}/api/user/validate/google.json`;
            fetchOptions.method = 'post';
            fetchOptions.body = JSON.stringify({ token });
            headers.set('Content-Type', 'application/json');
        }
        else if (session) {
            url = `${API_HOST}/api/user/validate/session/:session.json`
                .replace(':session', encodeURIComponent(session));
        }
        fetchOptions.headers = headers;
        const response = await fetch(url, fetchOptions);
        if (!response.ok) {
            return Promise.reject(new Error(`${response.status} ${response.statusText}`));
        }
        return await response.json() ?? null;
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
/**
 * Validates a user role, stored in res.locals.profile.roles
 *  - On success executes next()
 *  - On failure sends status 403 Forbidden, {error: 403, status: 'Forbidden'}
 */
export const validateRole = (validRoles = []) => (req, res, next) => {
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
