import 'dotenv/config';
interface APIFix {
    id: number;
    path: string;
    params: Record<string, string | number>;
    path_match?: string;
    reportAs?: string;
}
export declare function loadAPIFixData(id: number): Promise<APIFix[]>;
export declare function updateAPIUsage(id: number): Promise<{
    fixed: number;
}>;
export {};
