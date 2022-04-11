"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mysql2Pool = exports.getConnection = void 0;
const promise_1 = require("mysql2/promise");
const config = {
    connectionLimit: Number(process.env.MYSQL_POOL_LIMIT) || 5,
    host: process.env.MYSQL_SERVER || '',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USERNAME || '',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DB || '',
    namedPlaceholders: true,
};
async function getConnection() {
    const { connectionLimit, ...connectionConfig } = config;
    return (0, promise_1.createConnection)({ ...connectionConfig });
}
exports.getConnection = getConnection;
exports.mysql2Pool = (0, promise_1.createPool)({ ...config });
