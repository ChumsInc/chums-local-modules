import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import {defineConfig} from 'eslint/config'


export default defineConfig([
    {files: ["**/*.{js,mjs,cjs,ts}"]},
    {languageOptions: {globals: globals.node}},
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    "argsIgnorePattern": "^_",
                    "ignoreRestSiblings": true,
                }
            ]
        }
    }
]);
