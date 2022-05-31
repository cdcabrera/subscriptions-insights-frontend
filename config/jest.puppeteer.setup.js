const { mkdir, writeFile } = require('fs').promises;
const os = require('os');
const path = require('path');
const puppeteer = require('puppeteer');
const DIR = (process.env.__PUPPETEER_DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')); // eslint-disable-line

module.exports = async () => {
  const browser = await puppeteer.launch({});
  // store the browser instance so we can teardown it later
  // this global is only available in the teardown but not in TestEnvironments
  // process.env.__PUPPETEER_BROWSER = browser;
  global.__BROWSER_GLOBAL__ = browser;

  // use the file system to expose the wsEndpoint for TestEnvironments
  await mkdir(DIR, { recursive: true });
  await writeFile(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
};
