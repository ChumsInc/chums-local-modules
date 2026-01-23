import Debug from 'debug';
import {type ServerOptions, type WebSocket, WebSocketServer} from 'ws';
import {IncomingMessage} from 'node:http';
import {Socket} from "node:net";
import type {UserValidation} from "./types.js";
import {default as fetch, Headers, type RequestInit} from "node-fetch";
import * as cookie from 'cookie';
import type {ValidatedUserProfile} from "chums-types";

const debug = Debug('chums:local-modules:websockets');

const API_HOST = process.env.CHUMS_API_HOST || 'http://localhost';
export const VALIDATION_ERROR = 'VALIDATION_ERROR';


export interface ProfileWebSocket extends WebSocket {
    isAlive: boolean,
    profile?: ValidatedUserProfile | null,
}

export type ExtWebSocket = ProfileWebSocket;

class ProfileWebSocketServer extends WebSocketServer {
    constructor(options?: ServerOptions) {
        super(options);
        this.on('connection', async (ws: ProfileWebSocket, message) => {
            const {valid, status, profile} = await loadSocketValidation(message);
            if (!valid || status !== 'OK') {
                ws.close();
                return;
            }
            ws.isAlive = true;
            ws.profile = profile ?? null;

            ws.on('message', (message: string) => {
                ws.isAlive = true;
                debug('wsServer.onMessage', message);
            });

            ws.on('pong', () => {
                ws.isAlive = true;
            });

            ws.on('close', (ev: unknown) => {
                debug('wsServer.onClose()', ev);
            });

            ws.on('error', (ev: unknown) => {
                debug('wsServer.onError()', ev);
            });
        })

        setInterval(() => {
            this.clients.forEach((_ws) => {
                const ws = _ws as ProfileWebSocket;
                if (!ws.isAlive) {
                    return ws.terminate();
                }

                ws.isAlive = false;
                ws.ping(null, false, (err?: Error) => {
                    if (err) {
                        debug('wsServer.clients.ping()', err.message);
                    }
                });
            })
        }, 10000);

    }
}

export function webSocketServer() {

    const wsServer = new ProfileWebSocketServer({noServer: true});

    const onUpgrade = (request: IncomingMessage, socket: Socket, head: Buffer) => {
        wsServer.handleUpgrade(request, socket, head, (ws) => {
            wsServer.emit('connection', ws, request);
        })
    }

    return {
        wsServer,
        onUpgrade,
    }
}


/**
 * Executes validation request
 *  - validates req.cookies.PHPSESSID (from a logged in user)
 */
export async function loadSocketValidation(message: IncomingMessage): Promise<UserValidation> {
    try {
        const cookies = cookie.parse(message.headers.cookie || '');
        if (!cookies.PHPSESSID) {
            const error = new Error('Only cookie sessions can be validated');
            error.name = VALIDATION_ERROR;
            return {valid: false, error, status: 'Unauthorized'};
            // return Promise.reject(error);
        }
        const fetchOptions: RequestInit = {};
        const headers = new Headers();
        headers.set('X-Forwarded-For', message.socket.remoteAddress || 'localhost');

        const url = `${API_HOST}/api/user/validate/session/${encodeURIComponent(cookies.PHPSESSID)}.json`;
        fetchOptions.headers = headers;
        const response = await fetch(url, fetchOptions);
        if (!response.ok) {
            const error = new Error(`Validation Error: ${response.status} ${response.statusText}`);
            error.name = VALIDATION_ERROR;
            return {valid: false, error, status: 'Unauthorized'};
            // return Promise.reject(error);
        }
        return await response.json() as UserValidation;
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("loadValidation()", err.message);
            return Promise.reject(err);
        }
        debug("loadValidation()", err);
        return Promise.reject(err);
    }
}
