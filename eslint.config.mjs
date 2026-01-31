import { createRequire } from 'node:module';
import path from 'node:path';

import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import { configs, plugins, rules } from 'eslint-config-airbnb-extended';
import { rules as prettierConfigRules } from 'eslint-config-prettier';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { createNodeResolver } from 'eslint-plugin-import-x';
import prettierPlugin from 'eslint-plugin-prettier';
import unusedImports from 'eslint-plugin-unused-imports';

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
  // Airbnb base TypeScript config (includes parser; do not set project when projectService is used)
  ...configs.base.typescript,
  // Strict TypeScript rules
  rules.typescript.typescriptEslintStrict,
  // Airbnb React TypeScript config
  ...configs.react.typescript,
]);

const unusedImportsConfig = defineConfig([
  // Unused imports plugin
  {
    name: 'unused-imports/config',
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
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

export default defineConfig([
  // Expo config (must come first to set up React Native and Expo-specific rules)
  ...expoConfig,
  // Ignore files and folders listed in .gitignore
  includeIgnoreFile(gitignorePath),
  // Import resolver for absolute imports (tsconfig baseUrl/paths)
  {
    name: 'import-x/resolver',
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          project: './tsconfig.json',
        }),
        createNodeResolver({
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        }),
      ],
    },
  },
  // JavaScript config
  ...jsConfig,
  // React config
  ...reactConfig,
  // TypeScript config
  ...typescriptConfig,
  // Unused imports config
  ...unusedImportsConfig,
  // Prettier config (must come last to override formatting rules)
  ...prettierConfig,
  // Prefer named exports over default exports
  {
    name: 'import/prefer-named-exports',
    rules: {
      'import/prefer-default-export': 'off',
      'import-x/prefer-default-export': 'off',
      'import/no-default-export': 'error',
      'import-x/no-namespace': 'off',
      'no-underscore-dangle': 'off',
    },
  },
  // Allow default exports in config files (required by ESLint, Babel, etc.)
  {
    name: 'config-allow-default-export',
    files: ['*.config.{js,mjs,cjs,ts}', 'eslint.config.*'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
  // Allow default exports in route files (required by Expo Router)
  {
    name: 'routes-allow-default-export',
    files: [
      '**/routes/**/*.tsx',
      '**/routes/**/*.ts',
      '**/screens/**/*.tsx',
      '**/screens/**/*.ts',
    ],
    rules: {
      'import/no-default-export': 'off',
      'import-x/no-named-as-default': 'off',
      'react/function-component-definition': 'off',
    },
  },
  // React 17+ and TypeScript specific overrides
  {
    name: 'react-typescript-overrides',
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
      'react/destructuring-assignment': 'off',
      'react/jsx-sort-props': 'off',
      'react/jsx-no-bind': 'off',
      'react/no-unused-prop-types': 'off',
      'react/no-unstable-nested-components': 'off',
      'react/no-array-index-key': 'warn',
      'react/no-unescaped-entities': 'warn',
      'react/hook-use-state': 'off',
    },
  },
  // TypeScript / generic relaxations
  {
    name: 'typescript-relaxations',
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      'no-nested-ternary': 'warn',
      'consistent-return': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'func-names': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      'no-void': 'off',
      'no-restricted-globals': 'off',
    },
  },
  // Import / React structural
  {
    name: 'import-react-structural',
    rules: {
      'import-x/extensions': 'off',
      'import-x/no-unresolved': 'off',
      'import-x/no-anonymous-default-export': 'off',
      'react/jsx-filename-extension': 'off',
      'react/jsx-key': 'warn',
      'react/jsx-no-constructed-context-values': 'warn',
      'default-case': 'warn',
      radix: 'warn',
      'no-plusplus': 'off',
      'no-promise-executor-return': 'warn',
      'no-param-reassign': 'warn',
      'no-useless-escape': 'warn',
      'no-return-assign': 'warn',
      'class-methods-use-this': 'off',
      '@typescript-eslint/class-literal-property-style': 'off',
      '@typescript-eslint/no-invalid-void-type': 'off',
    },
  },
]);
