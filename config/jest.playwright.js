// import { Browser, Page } from 'playwright';
// import { test as playwrightIt, expect as playwrightExpect } from '@playwright/test';

/**
 * Apply playwright globals, page.
 */
// global.page = Page;

/**
 * Apply playwright globals, browser.
 */
// global.browser = Browser;

it.playwright = playwrightIt;

// global.playwrightIt = (value) => (value && playwrightIt(...args)) || it(...args);
// global.playwrightIt = value => (value && playwrightIt) || it;
// global.skipIt = value => (value && it?.skip) || it;
/**
 * Extend jest
 */
/*
expect.extend({
  toMatchImageSnapshot: async (received, ...args) => {
    await global.page(received);
    return playwrightExpect(global.page).toHaveScreenshot(received, ...args);
  }
});
*/
