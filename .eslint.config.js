import js from '@eslint/js';

export default [
  {
    ignores: ['node_modules/**', 'dist/**'],
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    plugins: {},
    rules: {
      ...js.configs.recommended.rules
    }
  }
];
