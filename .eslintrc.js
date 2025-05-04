/* global module */
/* eslint-disable no-undef */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'prettier'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    jest: 'readonly',
    describe: 'readonly',
    it: 'readonly',
    expect: 'readonly',
    beforeEach: 'readonly',
    afterEach: 'readonly',
    beforeAll: 'readonly',
    afterAll: 'readonly',
    test: 'readonly',
    process: 'readonly',
    module: 'readonly',
    global: 'readonly',
    require: 'readonly'
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint', 'jsx-a11y', 'prettier'],
  rules: {
    indent: 'off',
    'template-curly-spacing': 'off',
    'import/extensions': 0,
    'react/prop-types': 0,
    'linebreak-style': 0,
    'react/state-in-constructor': 0,
    'import/prefer-default-export': 0,
    'max-len': [2, 250],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 1
      }
    ],
    'no-underscore-dangle': [
      'error',
      {
        allow: ['_d', '_dh', '_h', '_id', '_m', '_n', '_t', '_text']
      }
    ],
    'object-curly-newline': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-one-expression-per-line': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/alt-text': 0,
    'jsx-a11y/no-autofocus': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'react/no-array-index-key': 0,
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to', 'hrefLeft', 'hrefRight'],
        aspects: ['noHref', 'invalidHref', 'preferButton']
      }
    ],
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-require-imports': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',
    'no-undef': 'off',
    'no-redeclare': 'off'
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    },
    react: {
      version: 'detect'
    }
  },
  ignorePatterns: [
    '**/__tests__/**',
    '**/*.test.js',
    '**/*.test.jsx',
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/*.spec.js',
    '**/*.spec.jsx',
    '**/*.spec.ts',
    '**/*.spec.tsx',
    '**/mocks/**',
    '**/__mocks__/**',
    'jest.setup.js',
    'setupTests.js',
    '.eslintrc.js',
    '.lintstagedrc.js',
    'babel.config.js',
    'jest.config.js'
  ]
};
