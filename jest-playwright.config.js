// global['jest-playwright'] = {};
const { setupDotenvFilesForEnv } = require('./config/build.dotenv');
setupDotenvFilesForEnv({ env: process.env.NODE_ENV || 'production' });

const jestPlaywright = (global['jest-playwright'] = {
  // browsers: ['chromium', 'firefox', 'webkit'],
  browsers: ['chromium'],
  /*
  serverOptions: {
    command: `yarn start`,
    port: 3000,
    protocol: 'http',
    launchTimeout: 60000,
    debug: false
  },
  */
  launchOptions: {
    headless: true
  },
  resetContextPerTest: true
});

module.exports = jestPlaywright;
