/// <reference types="node" />
import * as WebSocket from 'ws';
import { Server } from 'ws';
import { IncomingMessage } from 'http';
import { Socket } from "net";
import * as Buffer from "buffer";
import { UserProfile, UserValidation } from "./types";
export interface ExtWebSocket extends WebSocket {
    isAlive: boolean;
    profile?: UserProfile;
}
export interface ExtServer extends Server {
    clients: Set<ExtWebSocket>;
}
export declare const wsServer: ExtServer;
export declare const onUpgrade: (request: IncomingMessage, socket: Socket, head: Buffer) => void;
/**
 * Executes validation request
 *  - validates req.cookies.PHPSESSID (from a logged in user)
 * @param {IncomingMessage} message - Socket message
 * @returns {Promise<{valid: boolean, profile: {roles: [], accounts: [], user}}|*>}
 */
export declare function loadSocketValidation(message: IncomingMessage): Promise<UserValidation>;
