import { type ServerOptions, type WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'node:http';
import { Socket } from "node:net";
import type { UserValidation } from "./types.js";
import type { ValidatedUserProfile } from "chums-types";
export declare const VALIDATION_ERROR = "VALIDATION_ERROR";
export interface ProfileWebSocket extends WebSocket {
    isAlive: boolean;
    profile?: ValidatedUserProfile | null;
}
export type ExtWebSocket = ProfileWebSocket;
declare class ProfileWebSocketServer extends WebSocketServer {
    constructor(options?: ServerOptions);
}
export declare function webSocketServer(): {
    wsServer: ProfileWebSocketServer;
    onUpgrade: (request: IncomingMessage, socket: Socket, head: Buffer) => void;
};
/**
 * Executes validation request
 *  - validates req.cookies.PHPSESSID (from a logged in user)
 */
export declare function loadSocketValidation(message: IncomingMessage): Promise<UserValidation>;
export {};
