import Debug from 'debug';
import { mysql2Pool } from "./mysql.js";
const debug = Debug('chums:local-modules:log-api-usage');
export async function logApiUsage(props) {
    try {
        const sql = `INSERT INTO users.api_usage_history (api, path, params, method, user_id, referrer)
                     VALUES (:api, :path, :params, :method, :userId, :referrer)`;
        await mysql2Pool.query(sql, {
            api: props.api,
            path: props.path,
            params: props.params,
            method: props.method,
            userId: props.userId ?? null,
            referrer: props.referrer ?? null,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            debug("logApiUsage()", err.message);
            return Promise.reject(err);
        }
        debug("logApiUsage()", err);
        return Promise.reject(new Error('Error in logApiUsage()'));
    }
}
export function logAPIUsageMiddleware(api) {
    return async (req, res, next) => {
        try {
            const params = { ...req.params, ...req.query };
            const props = {
                api,
                path: req.route?.path ?? '',
                params: JSON.stringify(params),
                method: req.method,
                userId: res.locals.profile?.user?.id ?? 0,
                referrer: req.get('Referrer') ?? null,
            };
            await logApiUsage(props);
            next();
        }
        catch (err) {
            if (err instanceof Error) {
                debug("logAPIUsageMiddleware()", err.message);
            }
            next();
        }
    };
}
