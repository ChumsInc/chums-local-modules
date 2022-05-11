import Debug from 'debug';
const debug = Debug('chums:local-modules:validate-user');

import {NextFunction, Request, Response} from 'express'
import {default as fetch, Headers, RequestInit} from 'node-fetch';
import {basicAuth, jwtToken} from './auth';
import {UserJWTToken, UserProfile, UserValidation} from "./types";
import {validateToken, isBeforeExpiry, isLocalToken} from './jwt-handler';

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
export async function validateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const {valid, status, profile} = await loadValidation(req);
        if (!valid) {
            if (res.locals.debug) {
                debug('validateUser()', valid, status, req.get('referer'));
            }
            res.status(401).json({error: 401, status});
        }
        res.locals.profile = profile;
        req.userAuth = {valid, status, profile};
        next();
    } catch (err:unknown) {
        if (err instanceof Error) {
            debug("validateUser()", err.message)
            res.status(401).json({error: 'Not authorized', message: err.message});
            return;
        }
        debug("validateUser()", err)
        res.status(401).json({error: 'Not authorized', message: err});
    }
}


/**
 * Executes validation request
 *  - validates JWT token from Authorization header "Bearer asdasd...asd" (from a standalone/web app)
 *  - validates req.cookies.PHPSESSID (from a logged in user)
 *  - validates basic authentication (from a API user)
 * @param {Object} req - Express request object
 * @returns {Promise<{valid: boolean, profile: {roles: [], accounts: [], user}}|*>}
 */
export async function loadValidation(req: Request): Promise<UserValidation> {
    try {
        const {token} = jwtToken(req);
        if (token) {
            const decoded = await validateToken(token) as UserJWTToken;
            if (isLocalToken(decoded) && isBeforeExpiry(decoded)) {
                const {user, roles = [], accounts = []} = decoded;
                user.roles = roles
                user.accounts = accounts;
                return {valid: true, profile: {user, roles, accounts}};
            }
        }

        const {user, pass} = basicAuth(req);
        const session = req.cookies.PHPSESSID;

        const fetchOptions:RequestInit = {};
        const headers = new Headers();
        headers.set('X-Forwarded-For', req.ip);
        headers.set('referrer', req.get('referrer') || req.originalUrl);

        let url = `${API_HOST}/api/user/validate`;

        if (!!user && !!pass) {
            const credentials = Buffer.from(`${user}:${pass}`).toString('base64');
            headers.set('Authorization', `Basic ${credentials}`);
        } else if (!!session) {
            url += `/${encodeURIComponent(session)}`;
        } else if (!!token) {
            url += '/google';
            fetchOptions.method = 'post';
            fetchOptions.body = JSON.stringify({token});
            headers.set('Content-Type', 'application/json');
        }

        fetchOptions.headers = headers;
        const response = await fetch(url, fetchOptions);
        if (!response.ok) {
            return Promise.reject(new Error(`${response.status} ${response.statusText}`));
        }
        return await response.json();
    } catch (err:unknown) {
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
 * @param {String | String[]} validRoles - array of valid roles
 * @returns {function(*, *, *): (*|undefined)}
 */
export const validateRole = (validRoles: string | string[] = []) =>
    (req: Request, res: Response, next: NextFunction) => {
        const {roles = []} = res.locals.profile as UserProfile;
        if (!Array.isArray(validRoles)) {
            validRoles = [validRoles];
        }
        const valid = ['root', ...validRoles];
        const isValid = roles.map(role => valid.includes(role)).length > 0;
        if (isValid) {
            return next();
        }
        debug('validateRole() Not Authorized', res.locals.profile.user.id, validRoles);
        res.status(403).json({error: 403, status: 'Forbidden'});
    }

