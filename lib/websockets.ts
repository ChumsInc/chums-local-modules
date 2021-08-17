import Debug from 'debug';
import * as WebSocket from 'ws';
import {Server} from 'ws';
import {IncomingMessage} from 'http';
import {Socket} from "net";
import * as Buffer from "buffer";
import {UserProfile, UserValidation} from "./types";
import {default as fetch, Headers, RequestInit} from "node-fetch";
import * as cookie from 'cookie';

const API_HOST = process.env.CHUMS_API_HOST || 'http://localhost';

const debug = Debug('chums:lib:websockets');

export interface ExtWebSocket extends WebSocket {
    isAlive: boolean,
    profile?: UserProfile,
}

export interface ExtServer extends Server {
    clients: Set<ExtWebSocket>;
}

export function WebSocketServer() {
    const wsServer: ExtServer = new Server({noServer: true}) as ExtServer;
    wsServer.on('connection', async (ws: ExtWebSocket, message: IncomingMessage) => {
        const {valid, status, profile} = await loadSocketValidation(message);
        if (!valid || status !== 'ok') {
            ws.close();
            return;
        }
        ws.isAlive = true;
        ws.profile = profile;

        ws.on('message', (message: string) => {
            ws.isAlive = true;
            debug('wsServer.onMessage', message);
        });

        ws.on('pong', () => {
            ws.isAlive = true;
        });

        ws.on('close', (ev: any) => {
            debug('wsServer.onClose()', ev);
        });

        ws.on('error', (ev: any) => {
            debug('wsServer.onError()', ev);
        });
    })

    setInterval(() => {
        wsServer.clients.forEach((ws: ExtWebSocket) => {
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

    const onUpgrade = (request: IncomingMessage, socket: Socket, head: Buffer) => {
        debug(' server.onUpgrade()', request);
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
 * @param {IncomingMessage} message - Socket message
 * @returns {Promise<{valid: boolean, profile: {roles: [], accounts: [], user}}|*>}
 */
export async function loadSocketValidation(message: IncomingMessage): Promise<UserValidation> {
    try {
        const cookies = cookie.parse(message.headers.cookie || '');
        if (!cookies.PHPSESSID) {
            return Promise.reject(new Error('Only cookie sessions can be validated'));
        }
        const fetchOptions: RequestInit = {};
        const headers = new Headers();
        headers.set('X-Forwarded-For', message.socket.remoteAddress || 'localhost');

        let url = `${API_HOST}/api/user/validate/${encodeURIComponent(cookies.PHPSESSID)}`;
        fetchOptions.headers = headers;
        const response = await fetch(url, fetchOptions);
        if (!response.ok) {
            return Promise.reject(new Error(`${response.status} ${response.statusText}`));
        }
        return await response.json();
    } catch (err) {
        debug("loadValidation()", err.message);
        return Promise.reject(err);
    }
}
