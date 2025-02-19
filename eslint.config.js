import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    { ignores: ['dist'] },
    {
        root: true,
        parser: '@typescript-eslint/parser',
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            prettier: require('eslint-plugin-prettier'),
        },
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            'plugin:@typescript-eslint/recommended',
            'plugin:prettier/recommended',
        ],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            '@typescript-eslint/ban-types': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/explicit-function-return-type': 'warn',
            'prettier/prettier': [
                'error',
                {
                    singleQuote: true,
                    useTabs: true,
                    semi: true,
                    trailingComma: 'all',
                    bracketSpacing: true,
                    printWidth: 100,
                    endOfLine: 'auto',
                },
            ],
        },
    }
);
