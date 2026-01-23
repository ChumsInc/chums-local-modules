import Debug from 'debug';
import type {NextFunction, Request, Response} from 'express'
import {default as fetch, Headers, type RequestInit} from 'node-fetch';
import {basicAuth, jwtToken} from './auth.js';
import type {GoogleJWTToken} from "./types.js";
import {isBeforeExpiry, isLocalToken, validateToken} from './jwt-handler.js';
import type {UserJWTToken, UserValidationResponse, ValidatedUser,} from "chums-types";

const debug = Debug('chums:local-modules:validate-user');
const API_HOST = process.env.CHUMS_API_HOST || 'http://localhost';


/**
 * Requests validation from CHUMS /api/user service
 * - On success populates res.locals.profile = {user, roles, accounts} and executes next()
 * - On success populates req.userAuth = {valid, status, profile}
 * - On failure sends status 401 {error: 401, status: 'StatusText'}
 */
export async function validateUser(req: Request, res: Response<unknown, ValidatedUser>, next: NextFunction): Promise<void> {
    try {
        const validation = await loadValidation(req);
        if (!validation || !validation?.valid) {
            debug('validateUser()', 'Not Validated', req.method, req.originalUrl, req.get('referer'));
            res.status(401).json({error: 401, status: validation?.status ?? 'Not Authorized'});
            return;
        }
        res.locals.profile = validation?.profile ?? null;
        res.locals.auth = {
            valid: validation.valid,
            status: validation.status,
            profile: validation.profile ?? null,
        };
        next();
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("validateUser()", err.message, req.ip, req.method, req.originalUrl)
            res.status(401).json({error: 'Not authorized', message: err.message});
            return;
        }
        debug("validateUser()", err)
        res.status(401).json({error: 'Not authorized', message: err});
    }
}

export async function preValidateUser(req: Request, res: Response<unknown, ValidatedUser>, next: NextFunction): Promise<void> {
    const noValidation: ValidatedUser = {
        auth: {valid: false, status: 'Not Authorized', profile: null},
        profile: null
    };
    try {
        const validation = await loadValidation(req);
        if (!validation || !validation.valid) {
            res.locals.auth = noValidation.auth;
            res.locals.profile = noValidation.profile;
            next();
            return;
        }
        res.locals.profile = validation.profile ?? null;
        res.locals.auth = {
            valid: validation.valid,
            status: validation.status,
            profile: validation.profile ?? null,
        };
        next();

    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("preValidateUser()", err.message);
            res.locals.auth = noValidation.auth;
            res.locals.profile = noValidation.profile;
            next();
        }
        debug("preValidateUser()", err);
        res.locals.auth = noValidation.auth;
        res.locals.profile = noValidation.profile;
        next();
    }
}

export async function requireLogin(req: Request, res: Response<unknown, ValidatedUser>, next: NextFunction): Promise<void> {
    if (!res.locals.auth.valid) {
        const {valid, status} = res.locals.auth;
        res.status(401).json({valid, status});
        return;
    }
    next();
}

export function isUserValidation(auth: UserValidationResponse | unknown): auth is UserValidationResponse {
    return !!auth && (auth as UserValidationResponse).valid !== undefined;
}

export function getUserValidation(res: Response): UserValidationResponse | null {
    return isUserValidation(res.locals.auth) ? res.locals.auth : null;
}

/**
 * Executes validation request
 *  - validates JWT token from Authorization header "Bearer asdasd...asd" (from a standalone/web app)
 *  - validates req.cookies.PHPSESSID (from a logged-in user)
 *  - validates basic authentication (from an API user)
 */
export async function loadValidation(req: Request): Promise<UserValidationResponse | null> {
    try {
        const {token} = jwtToken(req);
        if (token) {
            const decoded = await validateToken<UserJWTToken | GoogleJWTToken>(token);
            if (isLocalToken(decoded) && isBeforeExpiry(decoded)) {
                const {user, roles = [], accounts = []} = decoded;
                return {
                    valid: true,
                    status: 'OK',
                    profile: {
                        user,
                        roles,
                        accounts
                    }
                };
            }
        }

        const {user, pass} = basicAuth(req);
        const session = req.cookies.PHPSESSID;

        const fetchOptions: RequestInit = {};
        const headers = new Headers();
        headers.set('X-Forwarded-For', req.ip ?? 'unknown');
        headers.set('referrer', req.get('referrer') || req.originalUrl);

        let url = `${API_HOST}/api/user/validate.json`;

        if (!!user && !!pass) {
            const credentials = Buffer.from(`${user}:${pass}`).toString('base64');
            headers.set('Authorization', `Basic ${credentials}`);
        } else if (token) {
            url = `${API_HOST}/api/user/validate/google.json`;
            fetchOptions.method = 'post';
            fetchOptions.body = JSON.stringify({token});
            headers.set('Content-Type', 'application/json');
        } else if (session) {
            url = `${API_HOST}/api/user/v2/validate/:session.json`
                .replace(':session', encodeURIComponent(session));
        }

        fetchOptions.headers = headers;
        const response = await fetch(url, fetchOptions);
        if (!response.ok) {
            return Promise.reject(new Error(`${response.status} ${response.statusText}`));
        }
        return await response.json() as UserValidationResponse ?? null;
    } catch (err: unknown) {
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
export const validateRole = (validRoles: string | string[] = []) =>
    (req: Request, res: Response<unknown, ValidatedUser>, next: NextFunction): void => {
        const roles = res.locals.auth.profile?.roles ?? [];
        if (!Array.isArray(validRoles)) {
            validRoles = [validRoles];
        }
        const valid = ['root', ...validRoles];
        const isValid = roles.map(role => valid.includes(role)).length > 0;
        if (isValid) {
            return next();
        }
        debug('validateRole() Not Authorized', res.locals.auth?.profile?.user?.id ?? '-', validRoles);
        res.status(403).json({error: 403, status: 'Forbidden'});
    }
