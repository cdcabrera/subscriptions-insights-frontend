// const jestPlaywright = require('jest-playwright-preset');
// import { Browser, Page } from 'playwright';
const routesConfig = require('../src/config/routes');
const { routes: rt } = routesConfig;
// const { Browser } = require('playwright');
// Needs to be higher than the default Playwright timeout
// jest.setTimeout(40 * 1000);
// global['jest-playwright'] = {};

// const { chromium } = require('playwright'); // Or 'firefox' or 'webkit'.
// let browser;
// let page;

// (async () => {
// browser = await chromium.launch();
// page = await browser.newPage();
// await page.goto('https://example.com');
// other actions...
// await browser.close();
// })();

describe('Screenshot confirmations', () => {
  const routes = [...rt.map(({ path }) => path)];
  // let page;
  // beforeEach(async () => {
  //  await jestPlaywright.resetPage();
  //  await page.goto('https://whatismybrowser.com/');
  // });

  // beforeEach(async () => {
  // page = await browser.newPage();
  // });

  /*
  beforeAll(async () => {
    await page.goto('https://localhost:3000/insights/subscriptions/');
  });

  beforeEach(() => {
    // await jestPlaywright.resetBrowser();
  });

  // it.playwright('should have consistent product displays', async ({ page }) => {
  it('should have consistent product displays', async ({ page }) => {
    // const browser = Browser();
    // const page =
    console.log('>>>>>>>>>>', routes);
    console.log('>>>>>>>>>>', page);
    await page.goto('/rhel');
    await expect(page).toHaveScreenshot('/rhel');
  });
  */

  /*
  beforeAll(async () => {
    await page.goto('https://whatismybrowser.com/');
  });

  // test('should display correct browser', async () => {
  test('should display correct browser', async () => {
    // await page.goto('https://whatismybrowser.com/');
    const browser = await page.$eval('.string-major', el => el.innerHTML);
    expect(browser).toContain('Chrome');
  });
  */
  // let browser;
  // let page;

  beforeAll(async () => {
    // browser = await chromium.launchPersistentContext('./.chromium', {
    /*
    browser = await chromium.launchPersistentContext('', {
      ignoreHTTPSErrors: true,
      // baseURL: 'http://localhost:3000/insights/subscriptions/',
      baseURL: 'http://localhost:3000',
      headless: true,
      timeout: 40000
    });
    */
    // await new Promise(resolve => setTimeout(resolve, 30000));
  });
  afterAll(async () => {
    // await browser?.close();
  });
  beforeEach(async () => {
    // page = await browser.newPage();
    // page.once('load', () => console.log('Page loaded!'));
    // await page.reload();
  });
  afterEach(async () => {
    // await page?.close();
  });

  it('should display correct browser', async () => {
    // const browser = await chromium.launch();
    // const page = await browser.newPage();

    // console.log('>>>>>>>>>>>>>>>>>>>>', page);
    // await page.goto('http://localhost:3000/insights/subscriptions/');
    // const result = await page.$eval('.string-major', el => el.innerHTML);
    // expect(result).toContain('Chrome');

    await page.goto('http://localhost:3000/insights/subscriptions/rhel');
    // await page.goto('/insights/subscriptions/rhel');
    // await page.reload();
    // await page.waitForURL('/insights/subscriptions/rhel', { waitUntil: 'networkidle' });
    // await page.locator('.curiosity').waitFor();
    // const result = await page.$eval('main.subscriptions', el => el.innerHTML);
    const result = await page.$eval('.curiosity', el => el.innerHTML);
    expect(result).toMatchSnapshot('toolbarFieldUsage html');
  });
});
