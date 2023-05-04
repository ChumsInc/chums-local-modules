import { NextFunction, Request, Response } from 'express';
import { UserValidation } from "./types";
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
export declare function validateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 *
 * @param {Express.Response} res - Express response object
 * @returns {UserValidation|null} - returns UserValidation object | null
 */
export declare function getUserValidation(res: Response): UserValidation | null;
/**
 * Executes validation request
 *  - validates JWT token from Authorization header "Bearer asdasd...asd" (from a standalone/web app)
 *  - validates req.cookies.PHPSESSID (from a logged-in user)
 *  - validates basic authentication (from an API user)
 * @param {Object} req - Express request object
 * @returns {Promise<{valid: boolean, profile: {roles: [], accounts: [], user}}|*>}
 */
export declare function loadValidation(req: Request): Promise<UserValidation>;
/**
 * Validates a user role, stored in res.locals.profile.roles
 *  - On success executes next()
 *  - On failure sends status 403 Forbidden, {error: 403, status: 'Forbidden'}
 * @param {String | String[]} validRoles - array of valid roles
 * @returns {function(*, *, *): (*|undefined)}
 */
export declare const validateRole: (validRoles?: string | string[]) => (req: Request, res: Response, next: NextFunction) => void;
