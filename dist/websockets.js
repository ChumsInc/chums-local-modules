"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSocketValidation = exports.WebSocketServer = void 0;
const debug_1 = require("debug");
const ws_1 = require("ws");
const node_fetch_1 = require("node-fetch");
const cookie = require("cookie");
const API_HOST = process.env.CHUMS_API_HOST || 'http://localhost';
const debug = debug_1.default('chums:lib:websockets');
function WebSocketServer() {
    const wsServer = new ws_1.Server({ noServer: true });
    wsServer.on('connection', (ws, message) => __awaiter(this, void 0, void 0, function* () {
        const { valid, status, profile } = yield loadSocketValidation(message);
        if (!valid || status !== 'ok') {
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
    }));
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
exports.WebSocketServer = WebSocketServer;
/**
 * Executes validation request
 *  - validates req.cookies.PHPSESSID (from a logged in user)
 * @param {IncomingMessage} message - Socket message
 * @returns {Promise<{valid: boolean, profile: {roles: [], accounts: [], user}}|*>}
 */
function loadSocketValidation(message) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const response = yield node_fetch_1.default(url, fetchOptions);
            if (!response.ok) {
                return Promise.reject(new Error(`${response.status} ${response.statusText}`));
            }
            return yield response.json();
        }
        catch (err) {
            debug("loadValidation()", err.message);
            return Promise.reject(err);
        }
    });
}
exports.loadSocketValidation = loadSocketValidation;
