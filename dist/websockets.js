"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSocketValidation = exports.webSocketServer = void 0;
const debug_1 = require("debug");
const ws_1 = require("ws");
const node_fetch_1 = require("node-fetch");
const cookie = require("cookie");
const API_HOST = process.env.CHUMS_API_HOST || 'http://localhost';
const debug = (0, debug_1.default)('chums:lib:websockets');
function webSocketServer() {
    const wsServer = new ws_1.WebSocketServer({ noServer: true });
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
exports.webSocketServer = webSocketServer;
/**
 * Executes validation request
 *  - validates req.cookies.PHPSESSID (from a logged in user)
 * @param {IncomingMessage} message - Socket message
 * @returns {Promise<{valid: boolean, profile: {roles: [], accounts: [], user}}|*>}
 */
async function loadSocketValidation(message) {
    try {
        const cookies = cookie.parse(message.headers.cookie || '');
        if (!cookies.PHPSESSID) {
            return Promise.reject(new Error('Only cookie sessions can be validated'));
        }
        const fetchOptions = {};
        const headers = new node_fetch_1.Headers();
        headers.set('X-Forwarded-For', message.socket.remoteAddress || 'localhost');
        let url = `${API_HOST}/api/user/validate/${encodeURIComponent(cookies.PHPSESSID)}`;
        fetchOptions.headers = headers;
        const response = await (0, node_fetch_1.default)(url, fetchOptions);
        if (!response.ok) {
            return Promise.reject(new Error(`${response.status} ${response.statusText}`));
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
exports.loadSocketValidation = loadSocketValidation;
