import Debug from 'debug';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {GoogleJWTToken} from "./types.js";
import {UserJWTToken} from "chums-types";

const debug = Debug('chums:local-modules:jwt-handler');

const {JWT_ISSUER = 'NOT THE ISSUER', JWT_SECRET = 'NOT THE SECRET'} = process.env;
const ERR_TOKEN_EXPIRED = 'TokenExpiredError';

/**
 * Validates a JTW Token
 */
export async function validateToken<T = JwtPayload>(token: string): Promise<T> {
    try {
        const payload = jwt.decode(token);
        if (!isLocalToken(payload)) {
            if (isBeforeExpiry(token)) {
                return payload as T;
            }
            return Promise.reject(new Error('Invalid Token: token may be invalid or expired'));
        }
        return jwt.verify(token, JWT_SECRET) as T;
    } catch (err: unknown) {
        if (!(err instanceof Error)) {
            return Promise.reject(err);
        }
        if (err.name !== ERR_TOKEN_EXPIRED) {
            debug("validateToken()", err.name, err.message);
        }
        return Promise.reject(err);
    }
}

/**
 * Validates a token expiration timestamp
 */
export const isBeforeExpiry = (payload: JwtPayload | null | string): boolean => {
    if (typeof payload === 'string') {
        payload = jwt.decode(payload);
    }
    if (!payload || typeof payload === 'string') {
        return false;
    }
    const {exp} = payload;
    const now = new Date().valueOf() / 1000;
    return !!exp && exp > now;
}

/**
 * Checks to see if a token is locally issued
 */
export const isLocalToken = (payload: UserJWTToken | JwtPayload | null | string): payload is UserJWTToken => {
    if (typeof payload === 'string') {
        payload = jwt.decode(payload);
    }
    if (!payload || typeof payload === 'string') {
        return false;
    }
    const {iss} = payload;
    return !!iss && iss === JWT_ISSUER;
};

export const isGoogleToken = (payload: GoogleJWTToken | JwtPayload | null | string): payload is GoogleJWTToken => {
    if (typeof payload === 'string') {
        payload = jwt.decode(payload);
    }
    if (!payload || typeof payload === 'string') {
        return false;
    }
    const {iss} = payload;
    return !!iss && iss === 'https://accounts.google.com';
}
