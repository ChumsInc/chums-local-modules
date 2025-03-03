import { JwtPayload } from 'jsonwebtoken';
import { GoogleJWTToken, UserJWTToken } from "./types.js";
/**
 * Validates a JTW Token
 */
export declare function validateToken<T = JwtPayload>(token: string): Promise<T>;
/**
 * Validates a token expiration timestamp
 */
export declare const isBeforeExpiry: (payload: JwtPayload | null | string) => boolean;
/**
 * Checks to see if a token is locally issued
 */
export declare const isLocalToken: (payload: UserJWTToken | JwtPayload | null | string) => payload is UserJWTToken;
export declare const isGoogleToken: (payload: GoogleJWTToken | JwtPayload | null | string) => payload is GoogleJWTToken;
