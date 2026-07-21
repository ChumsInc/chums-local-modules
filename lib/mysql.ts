import {
    createPool,
    createConnection,
    type Connection,
    type PoolOptions,
    type Pool,
    type ConnectionOptions
} from 'mysql2/promise'
export type {Pool, QueryOptions, Connection, PoolConnection} from 'mysql2/promise'

const connectionConfig:ConnectionOptions = {
    host: process.env.MYSQL_SERVER || '',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USERNAME || '',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DB || '',
    namedPlaceholders: true,
    jsonStrings: (process.env.MYSQL_JSON_STRINGS ?? '').toLowerCase() === 'true',
}

const poolConfig:PoolOptions = {
    connectionLimit: Number(process.env.MYSQL_POOL_LIMIT) || 5,
    ...connectionConfig
};

export async function getConnection(options?: ConnectionOptions):Promise<Connection> {
    return createConnection({...connectionConfig, ...options});
}

export const mysql2Pool:Pool = createPool({...poolConfig});

export async function getPool(options?:PoolOptions):Promise<Pool> {
    return createPool({...poolConfig, ...options});
}
