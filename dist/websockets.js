import Debug from 'debug';
import { WebSocketServer } from 'ws';
import { default as fetch, Headers } from "node-fetch";
import * as cookie from 'cookie';
const debug = Debug('chums:lib:websockets');
const API_HOST = process.env.CHUMS_API_HOST || 'http://localhost';
export const VALIDATION_ERROR = 'VALIDATION_ERROR';
export function webSocketServer() {
    // @ts-ignore
    const wsServer = new WebSocketServer({ noServer: true });
    wsServer.on('connection', async (ws, message) => {
        const { valid, status, profile } = await loadSocketValidation(message);
        if (!valid || status !== 'OK') {
            ws.close();
            return;
        }
        ws.isAlive = true;
        ws.profile = profile;
        ws.on('message', (message) => {
            ws.isAlive = true;
            debug('wsServer.onMessage', message);
        });
        ws.on('pong', () => {
            ws.isAlive = true;
        });
        ws.on('close', (ev) => {
            debug('wsServer.onClose()', ev);
        });
        ws.on('error', (ev) => {
            debug('wsServer.onError()', ev);
        });
    });
    setInterval(() => {
        wsServer.clients.forEach((ws) => {
            if (!ws.isAlive) {
                return ws.terminate();
            }
            ws.isAlive = false;
            ws.ping(null, false, (err) => {
                if (err) {
                    debug('wsServer.clients.ping()', err.message);
                }
            });
        });
    }, 10000);
    const onUpgrade = (request, socket, head) => {
        // debug(' server.onUpgrade()', request);
        wsServer.handleUpgrade(request, socket, head, (ws) => {
            wsServer.emit('connection', ws, request);
        });
    };
    return {
        wsServer,
        onUpgrade,
    };
}
/**
 * Executes validation request
 *  - validates req.cookies.PHPSESSID (from a logged in user)
 * @param {IncomingMessage} message - Socket message
 * @returns {Promise<{valid: boolean, profile: {roles: [], accounts: [], user}}|*>}
 */
export async function loadSocketValidation(message) {
    try {
        const cookies = cookie.parse(message.headers.cookie || '');
        if (!cookies.PHPSESSID) {
            const error = new Error('Only cookie sessions can be validated');
            error.name = VALIDATION_ERROR;
            return { valid: false, error };
            // return Promise.reject(error);
        }
        const fetchOptions = {};
        const headers = new Headers();
        headers.set('X-Forwarded-For', message.socket.remoteAddress || 'localhost');
        let url = `${API_HOST}/api/user/validate/${encodeURIComponent(cookies.PHPSESSID)}`;
        fetchOptions.headers = headers;
        const response = await fetch(url, fetchOptions);
        if (!response.ok) {
            const error = new Error(`Validation Error: ${response.status} ${response.statusText}`);
            error.name = VALIDATION_ERROR;
            return { valid: false, error };
            // return Promise.reject(error);
        }
        return await response.json();
    }
    catch (err) {
        if (err instanceof Error) {
            debug("loadValidation()", err.message);
            return Promise.reject(err);
        }
        debug("loadValidation()", err);
        return Promise.reject(err);
    }
}
