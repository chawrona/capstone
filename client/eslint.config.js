import configPrettier from "eslint-config-prettier";
import pluginPerfectionist from "eslint-plugin-perfectionist";
import pluginPrettier from "eslint-plugin-prettier";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";

export default [
    ...pluginVue.configs["flat/recommended"],
    configPrettier,
    {
        files: ["**/*.{js,vue}"],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
            sourceType: "module",
        },
        plugins: {
            perfectionist: pluginPerfectionist,
            prettier: pluginPrettier,
        },
        rules: {
            "perfectionist/sort-imports": "error",
            "perfectionist/sort-objects": "error",
            "prettier/prettier": ["error", { tabWidth: 4 }],
            "vue/multi-word-component-names": "off",
            "vue/no-v-html": "off",
            "vue/require-prop-types": "off",
        },
    },
];
