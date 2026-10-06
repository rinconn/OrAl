// @ts-check
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default defineConfig(
  // El decodificador Draco del visor 3D es de three.js, ya compilado
  { ignores: ['dist/', '.astro/', 'node_modules/', 'public/3d/'] },
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
  {
    // Scripts de mantenimiento, que se ejecutan con Node
    files: ['scripts/**'],
    languageOptions: { globals: { ...globals.node } },
  },
);
