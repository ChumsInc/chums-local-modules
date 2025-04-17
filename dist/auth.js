/**
 * Gets a user, password from http basic authorization header
 */
export const basicAuth = (req) => {
    const nullUser = { user: null, pass: null };
    const authorization = req.get('authorization');
    if (!authorization) {
        return nullUser;
    }
    const [basic = '', credentials = ''] = authorization.split(' ');
    if (basic.trim().toLowerCase() !== 'basic') {
        return nullUser;
    }
    // get username and password from base64 encoded credentials
    const [user = null, pass = null] = Buffer.from(credentials.trim(), 'base64').toString().split(':');
    return { user, pass };
};
/**
 * Gets a token from a http bearer authorization
 */
export const jwtToken = (req) => {
    const nullToken = { token: null };
    const authorization = req.header('authorization');
    if (!authorization) {
        return nullToken;
    }
    const [bearer = '', token = null] = authorization.split(' ');
    if (bearer.trim().toLowerCase() !== 'bearer') {
        return nullToken;
    }
    return { token };
};
