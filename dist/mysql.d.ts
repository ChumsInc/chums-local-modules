import { Pool } from 'mysql2/promise';
export { Pool, QueryOptions, Connection, PoolConnection } from 'mysql2/promise';
export declare function getConnection(): Promise<import("mysql2/promise").Connection>;
export declare const mysql2Pool: Pool;
