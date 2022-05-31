// global['jest-playwright'] = {};

module.exports = {
  // browsers: ['chromium', 'firefox', 'webkit'],
  browsers: ['chromium'],
  serverOptions: {
    command: `yarn start`,
    port: 3000,
    protocol: 'http',
    launchTimeout: 60000,
    debug: true
  },
  launchOptions: {
    headless: false
  },
  resetContextPerTest: true
};
