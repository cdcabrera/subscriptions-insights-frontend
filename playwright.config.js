module.exports = {
  webServer: {
    command: 'yarn run start',
    url: 'http://localhost:3000/insights/subscriptions',
    // timeout: 120 * 1000,
    reuseExistingServer: false
  },
  use: {
    ignoreHTTPSErrors: true,
    baseURL: 'http://localhost:3000/insights/subscriptions',
    browserName: 'chromium',
    headless: true
    // video: 'on-first-retry'
    // https://playwright.dev/docs/test-configuration#record-video
    // review using video conditionally for package updates
  },
  expect: {
    toHaveScreenshot: { maxDiffPixels: 100 }
  }
};
