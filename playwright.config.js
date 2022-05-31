module.exports = {
  use: {
    ignoreHTTPSErrors: true,
    baseURL: 'http://localhost:3000/insights/subscriptions',
    browserName: 'chromium',
    headless: false
    // video: 'on-first-retry'
    // https://playwright.dev/docs/test-configuration#record-video
    // review using video conditionally for package updates
  },
  expect: {
    toHaveScreenshot: { maxDiffPixels: 100 }
  }
};
