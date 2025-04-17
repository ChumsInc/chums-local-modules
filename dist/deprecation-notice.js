import Debug from "debug";
const debug = Debug('chums:local-modules');
export const deprecationNotice = (req, res, next) => {
    debug(req.method, req.originalUrl, '<<< DEPRECATED, referrer:', req.headers.referer ?? req.headers.referrer);
    next();
};
