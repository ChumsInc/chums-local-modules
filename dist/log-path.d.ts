import { NextFunction, Request, Response } from 'express';
import Debug from "debug";
export declare const logPath: (debug: Debug.Debugger) => (req: Request, res: Response, next: NextFunction) => void;
