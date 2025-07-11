import js from "@eslint/js";
import perfectionist from "eslint-plugin-perfectionist";
import prettierPlugin from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs}"],
        plugins: {
            prettier: prettierPlugin,
            perfectionist,
            js: js,
        },
        languageOptions: {
            globals: globals.node,
        },
        rules: {
            "prettier/prettier": ["error", { tabWidth: 4 }],
            "perfectionist/sort-imports": [
                "error",
                {
                    type: "alphabetical",
                },
            ],
        },
        extends: ["js/recommended"],
    },
]);
