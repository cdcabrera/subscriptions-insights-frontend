const { writeScreenshots } = require('./writeScreenshots');

const generateScreens = () => {
  writeScreenshots({
    urlPrefix: 'http://localhost:3000/insights/subscriptions',
    outputDir: './tests/__screenshots__',
    routes: ['rhel'],
    fullPageScreenshot: true,
    viewportHeight: 1080,
    // viewportHeight: undefined,
    viewportWidth: 1920,
    // viewportHeight: 800,
    // viewportWidth: 1200,
    waitForSelector: 'section.curiosity'
  });
};

generateScreens();
