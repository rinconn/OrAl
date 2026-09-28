// @ts-check
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default defineConfig(
  { ignores: ['dist/', '.astro/', 'node_modules/'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  astro.configs['jsx-a11y-recommended'],
  {
    // El plugin jsx-a11y ya lo registra la config de Astro; aquí solo aplicamos sus reglas a React.
    files: ['**/*.tsx'],
    rules: jsxA11y.flatConfigs.recommended.rules,
  },
  {
    languageOptions: { globals: { ...globals.browser } },
  },
);
