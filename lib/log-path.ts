import {NextFunction, Request, Response} from 'express'
import Debug from "debug";
import {ValidatedUser} from "./types.js";

export const logPath = (debug: Debug.Debugger) => (req: Request, res: Response<unknown, Partial<ValidatedUser>>, next: NextFunction) => {
    const {ip, method, originalUrl} = req;
    const user = res.locals.auth?.profile?.user?.email ?? res.locals.auth?.profile?.user?.id ?? '-';
    const referer = req.get('referer') || '';
    debug(ip, user, method, originalUrl, referer);
    next();
}
