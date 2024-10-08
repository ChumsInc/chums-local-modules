import { WebSocket } from 'ws';
import { IncomingMessage } from 'node:http';
import { Socket } from "node:net";
import { UserProfile, UserValidation } from "./types.js";
export declare const VALIDATION_ERROR = "VALIDATION_ERROR";
export interface ExtWebSocket extends WebSocket {
    isAlive: boolean;
    profile?: UserProfile;
}
export declare function webSocketServer(): {
    wsServer: import("ws").Server<ExtWebSocket, typeof IncomingMessage>;
    onUpgrade: (request: IncomingMessage, socket: Socket, head: Buffer) => void;
};
/**
 * Executes validation request
 *  - validates req.cookies.PHPSESSID (from a logged in user)
 */
export declare function loadSocketValidation(message: IncomingMessage): Promise<UserValidation>;
