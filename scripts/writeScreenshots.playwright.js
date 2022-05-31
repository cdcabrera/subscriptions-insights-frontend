// const path = require('path');
// const os = require('os');
// const fs = require('fs-extra');
// const { Cluster } = require('puppeteer-cluster');
// const sharp = require('sharp');
const { chromium } = require('playwright');
/**
 * Set image processing cache.
 */
// sharp.cache(false);

/**
 * Callback for parsing and writing images. See "puppeteer-cluster" for params.
 *
 * @param {object} options
 * @param {*} options.page
 * @param {object} options.data
 * @param {string} options.data.url
 * @param {string} options.data.outputFile
 * @param {number} options.data.resizeWidth
 * @param {number} options.data.resizeHeight
 * @param {number} options.data.viewportWidth
 * @param {number} options.data.viewportHeight
 * @param {string} options.data.waitForSelector
 * @param options.data.fullPageScreenshot
 * @returns {Promise<void>}
 */
/*
const writeScreenshot = async ({
  page,
  data: {
    url,
    fullPageScreenshot = false,
    outputFile,
    resizeWidth,
    resizeHeight,
    viewportWidth = 800,
    viewportHeight = 600,
    waitForSelector
  }
} = {}) => {
  const viewPortConfig = {};

  if (viewportWidth && viewportHeight) {
    viewPortConfig.width = viewportWidth;
    viewPortConfig.height = viewportHeight;
  }

  if (fullPageScreenshot) {
    // viewPortConfig.height = 1;
  }

  await page.setViewport({ width: 1000, height: 1 });

  await page.goto(url, { waitUntil: 'networkidle0', timeout: 0 });

  if (waitForSelector) {
    await page.waitForSelector(waitForSelector);
  }

  if (fullPageScreenshot) {
    // const updatedHeight = await page.evaluate(() => document.querySelector('main.pf-c-page__main').scrollHeight);
    // const updatedHeight = await page.evaluate(() => document.querySelector('section.curiosity').scrollHeight);
    const updatedHeight = await page.evaluate(sel => {
      document.querySelector('header.pf-c-masthead').style.display = 'none';
      return document.querySelector(sel).scrollHeight;
    }, waitForSelector);
    // const updatedWidth = await page.evaluate(() => document.querySelector('section.curiosity').scrollWidth);
    console.log('>>>>>>>>>>>', updatedHeight);
    // await page.setViewport({ ...viewPortConfig, height: updatedHeight });
    // await page.setViewport({ width: 1000, height: updatedHeight });
    await page.setViewport({ width: 1000, height: updatedHeight });
  }



  // await new Promise(resolve => {
  //  setTimeout(resolve, 2000);
  // });

  fs.ensureDirSync(path.dirname(outputFile));

  const element = await page.$(waitForSelector);
  await element.screenshot({ path: outputFile });
  // await page.screenshot({ path: outputFile, fullPage: true, delay: '1000ms' });
  // await page.screenshot({ path: outputFile });

  if (resizeWidth && resizeHeight) {
    const buffer = await sharp(outputFile).resize(resizeWidth, resizeHeight).toBuffer();
    await sharp(buffer).toFile(outputFile);
  }
};
*/

/**
 * Setup and write screenshots.
 *
 * @param {object} options
 * @param {object} options.outputDir
 * @param {Array} options.routes
 * @param {string} options.urlPrefix
 * @param {string} options.waitForSelector
 * @param {number} options.viewportWidth
 * @param {number} options.viewportHeight
 * @param {number} options.resizeHeight
 * @param {number} options.resizeWidth
 * @param options.fullPageScreenshot
 * @returns {Promise<void>}
 */
/*
const writeScreenshots = async ({
  fullPageScreenshot,
  urlPrefix,
  outputDir,
  routes,
  resizeHeight,
  resizeWidth,
  viewportWidth,
  viewportHeight,
  waitForSelector
} = {}) => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: os.cpus().length
  });

  routes.forEach(route =>
    cluster.queue(
      {
        url: path.join(urlPrefix, route),
        outputFile: path.join(outputDir, `${route}.png`),
        fullPageScreenshot,
        resizeHeight,
        resizeWidth,
        viewportHeight,
        viewportWidth,
        waitForSelector
      },
      writeScreenshot
    )
  );

  await cluster.idle();
  await cluster.close();
};
*/
(async () => {
  /*
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/insights/subscriptions/rhel');
  await page.screenshot({ path: './screenshot.png', fullPage: true });
  // await page.goto('./rhel');
  // other actions...
  await browser.close();
  */

  const fullPageScreenshot = true;
  const waitForSelector = 'section.curiosity';
  const url = 'http://localhost:3000/insights/subscriptions/rhel';
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1000, height: 1 });

  await page.goto(url, { waitUntil: 'networkidle0', timeout: 0 });

  if (waitForSelector) {
    await page.waitForSelector(waitForSelector);
  }

  if (fullPageScreenshot) {
    const updatedHeight = await page.evaluate(sel => {
      document.querySelector('header.pf-c-masthead').style.display = 'none';
      return document.querySelector(sel).scrollHeight;
    }, waitForSelector);
    console.log('>>>>>>>>>>>', updatedHeight);
    await page.setViewportSize({ width: 1000, height: updatedHeight });
  }

  await page.locator(waitForSelector).screenshot({ path: './screenshot.png' });
  await browser.close();
})();

const writeScreenshot = () => {

};

module.exports = {
  writeScreenshot,
  // writeScreenshots
};
