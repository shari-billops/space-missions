'use strict';

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFiles: ['<rootDir>/src/jestPolyfills.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', { configFile: './babel.config.cjs' }],
  },
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
    '\\.(svg|png|jpg|gif|webp|ico)$': '<rootDir>/src/__mocks__/fileMock.cjs',
    '^recharts$': '<rootDir>/src/__mocks__/recharts.tsx',
    // Jest 29 doesn't resolve package.json `exports` subpaths — map MSW and its
    // interceptor dependencies to their pre-built CJS files explicitly.
    '^msw/node$': '<rootDir>/node_modules/msw/lib/node/index.js',
    '^msw$': '<rootDir>/node_modules/msw/lib/core/index.js',
    '^@mswjs/interceptors$': '<rootDir>/node_modules/@mswjs/interceptors/lib/node/index.cjs',
    '^@mswjs/interceptors/ClientRequest$': '<rootDir>/node_modules/@mswjs/interceptors/lib/node/interceptors/ClientRequest/index.cjs',
    '^@mswjs/interceptors/XMLHttpRequest$': '<rootDir>/node_modules/@mswjs/interceptors/lib/node/interceptors/XMLHttpRequest/index.cjs',
    '^@mswjs/interceptors/fetch$': '<rootDir>/node_modules/@mswjs/interceptors/lib/node/interceptors/fetch/index.cjs',
    '^@mswjs/interceptors/WebSocket$': '<rootDir>/node_modules/@mswjs/interceptors/lib/browser/interceptors/WebSocket/index.cjs',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/types/**',
    '!src/mocks/**',
    '!src/__mocks__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coverageProvider: 'babel',
};
