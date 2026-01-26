import path from 'node:path';
import { createRequire } from 'node:module';

import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import { configs, plugins, rules } from 'eslint-config-airbnb-extended';
import { rules as prettierConfigRules } from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

const require = createRequire(import.meta.url);
const expoConfig = require('eslint-config-expo/flat');

const gitignorePath = path.resolve('.', '.gitignore');

const jsConfig = defineConfig([
  // ESLint recommended config
  {
    name: 'js/config',
    ...js.configs.recommended,
  },
  // Stylistic plugin
  plugins.stylistic,
  // Import X plugin
  plugins.importX,
  // Airbnb base recommended config
  ...configs.base.recommended,
  // Strict import rules
  rules.base.importsStrict,

]);

const reactConfig = defineConfig([
  // React plugin
  plugins.react,
  // React JSX A11y plugin
  plugins.reactA11y,
  // Airbnb React recommended config (Expo already includes react-hooks)
  ...configs.react.recommended,
  // Strict React rules
  rules.react.strict,
]);

const typescriptConfig = defineConfig([
  // TypeScript ESLint plugin
  plugins.typescriptEslint,
  // Airbnb base TypeScript config
  ...configs.base.typescript,
  // Strict TypeScript rules
  rules.typescript.typescriptEslintStrict,
  // Airbnb React TypeScript config
  ...configs.react.typescript,
]);

const prettierConfig = defineConfig([
  // Prettier plugin
  {
    name: 'prettier/plugin/config',
    plugins: {
      prettier: prettierPlugin,
    },
  },
  // Prettier config
  {
    name: 'prettier/config',
    rules: {
      ...prettierConfigRules,
      'prettier/prettier': 'error',
    },
  },
]);

// eslint-disable-next-line import/no-default-export
export default defineConfig([
  // Expo config (must come first to set up React Native and Expo-specific rules)
  ...expoConfig,
  // Ignore files and folders listed in .gitignore
  includeIgnoreFile(gitignorePath),
  // JavaScript config
  ...jsConfig,
  // React config
  ...reactConfig,
  // TypeScript config
  ...typescriptConfig,
  // Prettier config (must come last to override formatting rules)
  ...prettierConfig,
  // Prefer named exports over default exports
  {
    name: 'import/prefer-named-exports',
    rules: {
      'import/prefer-default-export': 'off',
      'import-x/prefer-default-export': 'off',
      'import/no-default-export': 'error',
    },
  },
]);
