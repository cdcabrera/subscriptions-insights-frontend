const fs = require('fs').promises;

module.exports = async () => {
  // close the browser instance
  // await process.env.__PUPPETEER_BROWSER.close();
  await global.__BROWSER_GLOBAL__.close();

  // clean-up the wsEndpoint file
  await fs.rm(process.env.__PUPPETEER_DIR, { recursive: true, force: true });
};
