import {createPool, createConnection, PoolOptions, Pool} from 'mysql2/promise'
export {Pool, QueryOptions, Connection, PoolConnection} from 'mysql2/promise'


const config:PoolOptions = {
    connectionLimit: Number(process.env.MYSQL_POOL_LIMIT) || 5,
    host: process.env.MYSQL_SERVER || '',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USERNAME || '',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DB || '',
    namedPlaceholders: true,
};

export async function getConnection() {
    const {connectionLimit, ...connectionConfig} = config;
    return createConnection({...connectionConfig});
}

export const mysql2Pool:Pool = createPool({...config});
