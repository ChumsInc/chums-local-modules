export const logPath = (debug) => (req, res, next) => {
    const { ip, method, originalUrl } = req;
    const user = res.locals.profile?.user?.email ?? res.locals?.profile?.user?.id ?? '-';
    const referer = req.get('referer') || '';
    debug(ip, user, method, originalUrl, referer);
    next();
};
