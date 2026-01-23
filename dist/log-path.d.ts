import type { NextFunction, Request, Response } from 'express';
import Debug from "debug";
import type { ValidatedUser } from "chums-types";
export declare const logPath: (debug: Debug.Debugger) => (req: Request, res: Response<unknown, Partial<ValidatedUser>>, next: NextFunction) => void;
