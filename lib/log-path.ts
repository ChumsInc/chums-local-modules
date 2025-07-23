import {NextFunction, Request, Response} from 'express'
import Debug from "debug";


export const logPath = (debug: Debug.Debugger) => (req: Request, res: Response, next: NextFunction) => {
    const {ip, method, originalUrl} = req;
    const user = res.locals.profile?.user ?? res.locals?.profile?.user?.id ?? '-';
    const referer = req.get('referer') || '';
    debug(ip, user, method, originalUrl, referer);
    next();
}
