import Debug from 'debug';
import {mysql2Pool} from "./mysql.js";
import type {ResultSetHeader} from "mysql2";
import type {NextFunction, Request, Response} from "express";
import type {ValidatedUser} from "chums-types";

const debug = Debug('chums:local-modules:log-api-usage');


export interface LogApiUsageProps {
    api: string;
    path: string;
    params: string | null;
    method: string;
    userId: number | null;
    referrer: string | null;
}

export async function logApiUsage(props: LogApiUsageProps): Promise<void> {
    try {
        const sql = `INSERT INTO users.api_usage_history (api, path, params, method, user_id, referrer)
                     VALUES (:api, :path, :params, :method, :userId, :referrer)`;
        await mysql2Pool.query<ResultSetHeader>(sql, {
            api: props.api,
            path: props.path,
            params: props.params,
            method: props.method,
            userId: props.userId ?? null,
            referrer: props.referrer ?? null,
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("logApiUsage()", err.message);
            return Promise.reject(err);
        }
        debug("logApiUsage()", err);
        return Promise.reject(new Error('Error in logApiUsage()'));
    }
}


export const logAPIUsageMiddleware = (api: string) => async (req: Request, res: Response<unknown, ValidatedUser>, next: NextFunction) => {
    try {
        const [path, params] = req.originalUrl.split('?');
        const props: LogApiUsageProps = {
            api,
            path: path ?? req.originalUrl,
            params: params ?? null,
            method: req.method,
            userId: res.locals.profile?.user?.id ?? 0,
            referrer: req.get('Referrer') ?? null,
        }
        await logApiUsage(props);
        next();
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("logAPIUsageMiddleware()", err.message);
        }
        next();
    }
}
