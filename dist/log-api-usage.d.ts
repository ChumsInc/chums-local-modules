import type { NextFunction, Request, Response } from "express";
import type { ValidatedUser } from "chums-types";
export interface LogApiUsageProps {
    api: string;
    path: string;
    params: string | null;
    method: string;
    userId: number | null;
    referrer: string | null;
}
export declare function logApiUsage(props: LogApiUsageProps): Promise<void>;
export declare const logAPIUsageMiddleware: (api: string) => (req: Request, res: Response<unknown, ValidatedUser>, next: NextFunction) => Promise<void>;
