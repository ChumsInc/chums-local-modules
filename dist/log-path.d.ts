import { NextFunction, Request, Response } from 'express';
import Debug from "debug";
import { ValidatedUser } from "./types.js";
export declare const logPath: (debug: Debug.Debugger) => (req: Request, res: Response<unknown, Partial<ValidatedUser>>, next: NextFunction) => void;
