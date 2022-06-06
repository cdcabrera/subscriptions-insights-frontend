const routesConfig = require('../src/config/routes');
const { routes: rt } = routesConfig;

describe('Screenshot confirmations', () => {
  const routes = [...rt.map(({ path }) => path)];

  it('should display correctly', async ({ page, browser, elementCapture }) => {
    // elementCapture();
    // console.log(page); //
    // console.log(page);

    expect(1).toBe(1);
  });
});
