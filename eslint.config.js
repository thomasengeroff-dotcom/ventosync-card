// eslint.config.js – ESLint 9 flat config
// ============================================================
import js from '@eslint/js';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                // Browser globals
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                console: 'readonly',
                customElements: 'readonly',
                HTMLElement: 'readonly',
                Event: 'readonly',
                MouseEvent: 'readonly',
                TouchEvent: 'readonly',
            },
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-console': 'warn',
            'prefer-const': 'error',
            'no-var': 'error',
            'eqeqeq': 'error',
            'curly': 'error',
            'no-throw-literal': 'error',
        },
    },
    {
        ignores: ['dist/**', 'node_modules/**'],
    },
];
