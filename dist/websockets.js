"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSocketValidation = exports.webSocketServer = exports.VALIDATION_ERROR = void 0;
const debug_1 = __importDefault(require("debug"));
const ws_1 = require("ws");
const node_fetch_1 = __importStar(require("node-fetch"));
const cookie = __importStar(require("cookie"));
const debug = (0, debug_1.default)('chums:lib:websockets');
const API_HOST = process.env.CHUMS_API_HOST || 'http://localhost';
exports.VALIDATION_ERROR = 'VALIDATION_ERROR';
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
            const error = new Error('Only cookie sessions can be validated');
            error.name = exports.VALIDATION_ERROR;
            return { valid: false, error };
            // return Promise.reject(error);
        }
        const fetchOptions = {};
        const headers = new node_fetch_1.Headers();
        headers.set('X-Forwarded-For', message.socket.remoteAddress || 'localhost');
        let url = `${API_HOST}/api/user/validate/${encodeURIComponent(cookies.PHPSESSID)}`;
        fetchOptions.headers = headers;
        const response = await (0, node_fetch_1.default)(url, fetchOptions);
        if (!response.ok) {
            const error = new Error(`Validation Error: ${response.status} ${response.statusText}`);
            error.name = exports.VALIDATION_ERROR;
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
exports.loadSocketValidation = loadSocketValidation;
