/// <reference types="node" />
import * as WebSocket from 'ws';
import { WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { Socket } from "net";
import * as Buffer from "buffer";
import { UserProfile, UserValidation } from "./types";
export declare const VALIDATION_ERROR = "VALIDATION_ERROR";
export interface ExtWebSocket extends WebSocket {
    isAlive: boolean;
    profile?: UserProfile;
}
export interface ExtServer extends WebSocketServer {
    clients: Set<ExtWebSocket>;
}
export declare function webSocketServer(): {
    wsServer: ExtServer;
    onUpgrade: (request: IncomingMessage, socket: Socket, head: Buffer) => void;
};
/**
 * Executes validation request
 *  - validates req.cookies.PHPSESSID (from a logged in user)
 * @param {IncomingMessage} message - Socket message
 * @returns {Promise<{valid: boolean, profile: {roles: [], accounts: [], user}}|*>}
 */
export declare function loadSocketValidation(message: IncomingMessage): Promise<UserValidation>;
