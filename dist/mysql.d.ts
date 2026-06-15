import { type Connection, type PoolOptions, type Pool, type ConnectionOptions } from 'mysql2/promise';
export type { Pool, QueryOptions, Connection, PoolConnection } from 'mysql2/promise';
export declare function getConnection(options?: ConnectionOptions): Promise<Connection>;
export declare const mysql2Pool: Pool;
export declare function getPool(options?: PoolOptions): Promise<Pool>;
