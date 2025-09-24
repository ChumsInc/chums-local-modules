import {NextFunction, Request, Response} from 'express'
import Debug from "debug";
import {ValidatedUser} from "chums-types";
import {isUserValidation} from "./validate-user.js";

export const logPath = (debug: Debug.Debugger) => (req: Request, res: Response<unknown, Partial<ValidatedUser>>, next: NextFunction):void => {
    const {ip, method, originalUrl} = req;
    const user = isUserValidation(res.locals.auth) ? res.locals.auth?.profile?.user?.email ?? res.locals.auth?.profile?.user?.id ?? '-' : '-';
    const referer = req.get('referer') || '';
    debug(ip, user, method, originalUrl, referer);
    next();
}
