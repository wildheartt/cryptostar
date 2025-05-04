/** @type {import('jest').Config} */
module.exports = {
  coverageProvider: 'v8',
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      { presets: ['@babel/preset-env', '@babel/preset-react'] }
    ]
  },
  transformIgnorePatterns: ['/node_modules/(?!(@reduxjs|@standard-schema|antd|@ant-design)/)'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/mocks/**',
    '!src/index.js',
    '!src/app/store.js',
    '!src/setupTests.js'
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/mocks/',
    '/__mocks__/',
    'store\\.js$',
    'index\\.js$',
    'setupTests\\.js$'
  ],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/', '/coverage/'],
  verbose: true
};
