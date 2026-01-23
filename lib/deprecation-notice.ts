import Debug from "debug";
import type {NextFunction, Request, Response} from "express";

const debug = Debug('chums:local-modules');

export const deprecationNotice = (req: Request, res: Response, next: NextFunction):void => {
    debug(req.method, req.originalUrl, '<<< DEPRECATED, referrer:', req.headers.referer ?? req.headers.referrer);
    next();
}
