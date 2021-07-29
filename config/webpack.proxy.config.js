const { join } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const CopyPlugin = require('copy-webpack-plugin');
const commonPlugins = require('./build.plugins');
const { setupDotenvFilesForEnv, setupWebpackDotenvFilesForEnv } = require('./build.dotenv');

process.env.NODE_ENV = 'development';

setupDotenvFilesForEnv({ env: 'proxy' });

const DIST_DIR = process.env._BUILD_DIST_DIR;
const DOTENV_ENV = process.env.REACT_APP_ENV;
const PORT = Number.parseInt(process.env._BUILD_PORT, 10);
const RELATIVE_DIRNAME = process.env._BUILD_RELATIVE_DIRNAME;
const STATIC_DIR = process.env._BUILD_STATIC_DIR;

const updatedPlugins = {
  htmlPlugin: {
    title: process.env.REACT_APP_UI_DISPLAY_NAME,
    template: join(STATIC_DIR, 'index.html')
  },
  replacePlugin: [
    {
      pattern: /%([A-Z_]+)%/g,
      replacement: (match, $1) => process.env?.[$1] || match
    }
  ],
  plugins: [
    ...setupWebpackDotenvFilesForEnv({ directory: RELATIVE_DIRNAME, env: DOTENV_ENV }),
    new CopyPlugin({
      patterns: [{ from: join(STATIC_DIR, 'locales'), to: join(DIST_DIR, 'locales'), noErrorOnMissing: true }]
    })
  ]
};

const { config: webpackConfig, plugins } = config({
  appUrl: ['/beta/insights/subscriptions', '/beta/openshift/subscriptions'],
  debug: true,
  deployment: 'beta/apps',
  port: PORT,
  rootFolder: RELATIVE_DIRNAME,
  routes: {
    '/locales': {
      host: `https://localhost:${PORT}/beta/apps/subscriptions`
    }
  },
  skipChrome2: true,
  standalone: false,
  useCloud: true,
  useProxy: true,
  ...updatedPlugins
});

plugins.push(...commonPlugins);

module.exports = {
  ...webpackConfig,
  plugins
};
