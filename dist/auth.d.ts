import { Request } from 'express';
export interface BasicAuth {
    user: string | null;
    pass: string | null;
}
/**
 * Gets a user, password from http basic authorization header
 */
export declare const basicAuth: (req: Request) => BasicAuth;
export interface JWTAuth {
    token: string | null;
}
/**
 * Gets a token from a http bearer authorization
 */
export declare const jwtToken: (req: Request) => JWTAuth;
