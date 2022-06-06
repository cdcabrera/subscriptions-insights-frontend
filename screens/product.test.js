// const routesConfig = require('../src/config/routes');
// const { routes: rt } = routesConfig;

const {test, expect} = require("@playwright/test");
/*
describe('Screenshot confirmations', () => {
  // const routes = [...rt.map(({ path }) => path)];

  it('should display correctly', async ({ page, browser, elementCapture }) => {
    // elementCapture();
    // console.log(page); //
    // console.log(page);

    expect(1).toBe(1);
  });
});
*/

test('basic test', async ({ page }) => {
  await page.goto('streams');
  const doit = page.locator('section.curiosity');

  console.log(doit);

  expect(1).toBe(1);
  // await expect(title).toHaveText('Playwright');
});
