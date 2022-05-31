const screencaptureConfig = {};

if (process.env.IS_SCREENCAPTURE === 'true') {
  console.log('Setting up screen capture...');
  screencaptureConfig.preset = 'jest-playwright-preset';
  screencaptureConfig.testTimeout = 60000;
  // puppeteerConfig.globalSetup = '<rootDir>/config/jest.puppeteer.setup.js';
  // puppeteerConfig.globalTeardown = '<rootDir>/config/jest.puppeteer.teardown.js';
  // puppeteerConfig.testEnvironment = '<rootDir>/config/jest.puppeteer.env.js';

  // puppeteerConfig.preset = 'jest-puppeteer';
  // puppeteerConfig.testEnvironment = undefined;
  // puppeteerConfig.setupFilesAfterEnv = [];
  // puppeteerConfig.setupFilesAfterEnv = ['core-js', '<rootDir>/config/jest.setupTests.js'];
  // puppeteerConfig.setupFilesAfterEnv = [require.resolve('expect-puppeteer'), '<rootDir>/config/jest.setupTests.js'];
}

const jestConfig = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/.*/**',
    '!src/AppEntry.js',
    '!src/app.js',
    '!src/bootstrap.js',
    '!src/entry.js',
    '!src/components/**/index.js',
    '!src/common/index.js',
    '!src/redux/index.js',
    '!src/redux/store.js',
    '!src/redux/middleware/**',
    '!src/redux/actions/index.js',
    '!src/redux/common/index.js',
    '!src/redux/hooks/index.js',
    '!src/redux/reducers/index.js',
    '!src/redux/selectors/index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 90,
      statements: 90
    }
  },
  moduleFileExtensions: ['web.js', 'js', 'web.ts', 'ts', 'web.tsx', 'tsx', 'json', 'web.jsx', 'jsx', 'node'],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy'
  },
  modulePaths: [],
  resetMocks: true,
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  setupFilesAfterEnv: ['<rootDir>/config/jest.setupTests.js'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testMatch: ['<rootDir>/**/__tests__/**/*.{js,jsx,ts,tsx}', '<rootDir>/**/*.{spec,test}.{js,jsx,ts,tsx}'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/config/jest.transform.style.js',
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '<rootDir>/config/jest.transform.file.js'
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname']
};

module.exports = {
  ...jestConfig,
  ...screencaptureConfig
};
