import 'dotenv/config';
import Debug from 'debug';
import { mysql2Pool } from "../../dist/index.js";
const debug = Debug('chums:utils:fix-api-usage:fix-handlers');
const sql = `
    SELECT h.id, h.api, h.path, JSON_EXTRACT(IFNULL(h.params, '{}'), '$') AS params, p.path_match, p.reportAs
    FROM users.api_usage_history h
             LEFT JOIN users.api_path p ON h.path REGEXP p.path_match
    WHERE h.api = 'api-operations'
      AND h.id < 95000
      AND p.id = :id
      and JSON_VALUE(h.params, '$.customer_id') IS NULL`;
const updateLog = `
UPDATE users.api_usage_history
SET path = :fixedPath, params = :fixedParams
where id = :id`;
export async function loadAPIFixData(id) {
    try {
        const [rows] = await mysql2Pool.query(sql, { id });
        return rows.map(row => {
            const regExp = new RegExp(row.path_match ?? '', 'i');
            const match = regExp.exec(row.path);
            console.log(row.path, match);
            const fix = row.params ?? {};
            if (!fix.customer_id && match && match.length >= 3) {
                fix.customer_id = match[1];
                fix.id = match[2];
            }
            return {
                id: row.id,
                path: '/barcodes/customers/:customer_id/items/:id.json',
                params: { ...fix },
            };
        });
    }
    catch (err) {
        if (err instanceof Error) {
            debug("loadAPIFixData()", err.message);
            return Promise.reject(err);
        }
        debug("loadAPIFixData()", err);
        return Promise.reject(new Error('Error in loadAPIFixData()'));
    }
}
export async function updateAPIUsage(id) {
    try {
        const fixes = await loadAPIFixData(id);
        await Promise.allSettled(fixes.map(async (fix) => {
            await mysql2Pool.query(updateLog, {
                fixedPath: fix.path,
                fixedParams: JSON.stringify(fix.params),
                id: fix.id
            });
        }));
        return { fixed: fixes.length };
    }
    catch (err) {
        if (err instanceof Error) {
            debug("updateAPIUsage()", err.message);
            return Promise.reject(err);
        }
        debug("updateAPIUsage()", err);
        return Promise.reject(new Error('Error in updateAPIUsage()'));
    }
}
