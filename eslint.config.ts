import globals from 'globals'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginPlaywright from 'eslint-plugin-playwright'
import pluginDeMorgan from 'eslint-plugin-de-morgan'
import pluginStylistic from '@stylistic/eslint-plugin'
import skipFormatting from 'eslint-config-prettier/flat'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig(
  globalIgnores([
    '.vscode/extensions.json',
    '.auth/',
    'dist/',
    'dist-admin',
    'playwright-report/',
    'test-results/',
    'report-default/',
    'report-smoke/',
    'report-regression/',
    'package-lock.json'
  ]),

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.node
    }
  },

  js.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-unused-expressions': 'off',
      'no-useless-assignment': 'off'
    }
  },

  ...tseslint.configs.recommended,
  {
    plugins: {
      '@stylistic': pluginStylistic
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true
        }
      ],
      '@stylistic/lines-between-class-members': [
        'error',
        'always',
        { exceptAfterSingleLine: true }
      ],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        {
          blankLine: 'always',
          prev: ['if', 'for', 'while', 'switch', 'try'],
          next: ['if', 'for', 'while', 'switch', 'try']
        }
      ]
    }
  },
  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['tests/**'],
    rules: {
      'playwright/no-wait-for-timeout': 0,
      'playwright/no-conditional-in-test': 0,
      'playwright/expect-expect': 0
    }
  },

  pluginDeMorgan.configs.recommended,

  skipFormatting
)
