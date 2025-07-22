/**
 * there is no @types/named-placeholders or built in typings
 * perhaps this will work instead?
 */

declare module 'named-placeholders' {
    export type Placeholder = string | number;

    export interface Configuration {
        placeholder?: string;
        cache?: number | object | boolean;
    }

    type NoTrailingSemicolon = (s:string) => string;
    type Join = (tree: unknown[]) => unknown[]| [string, unknown];
    type ToArrayParams = (tree:unknown, params: unknown) => [string];
    export type ToNumbered = (q:string, params:object) => [string, unknown[]];
    export type Parse = (query: string) => [string[], Placeholder[]] | [string];
    export type Compile = (query: string, paramsObj: object) => [string, []] | [string, unknown[]];
    Compile.parse = Parse;
    Compile.toNumbered = ToNumbered;
    export default function createCompiler(config?:Configuration):Compile;
}


