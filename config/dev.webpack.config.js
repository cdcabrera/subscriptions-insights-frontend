const { join, resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
// const fedModules = require('@redhat-cloud-services/frontend-components-config/federated-modules');
const CopyPlugin = require('copy-webpack-plugin');
const { setupWebpackDotenvFilesForEnv, setupDotenvFilesForEnv } = require('./build.dotenv');

const NODE_ENV = process.env._OSEED_ENV;

setupDotenvFilesForEnv({ env: NODE_ENV });

const STATIC_DIR = process.env._OSEED_STATIC_DIR;
const RELATIVE_DIRNAME = process.env._OSEED_RELATIVE_DIRNAME;
const PUBLIC_PATH = process.env.PUBLIC_URL;
const PORT = process.env._OSEED_PORT;
const DIST_DIR = process.env._OSEED_DIST_DIR;
const ENV = process.env.REACT_APP_ENV;

const updatedConfig = {
  port: (ENV === 'review' && 5001) || PORT,
  publicPath: PUBLIC_PATH,
  deployment: (/beta/.test(PUBLIC_PATH) && 'beta/apps') || 'apps',
  https: true,
  useFileHash: false,
  skipChrome2: true
};

const updatedPlugins = {
  htmlPlugin: {
    title: process.env.REACT_APP_UI_DISPLAY_NAME,
    template: resolve(__dirname, '../public/index.html')
  },
  replacePlugin: [
    {
      pattern: /%([A-Z_]+)%/g,
      replacement: (match, $1) => process.env?.[$1] || match
    }
  ],
  plugins: [
    ...setupWebpackDotenvFilesForEnv({ directory: RELATIVE_DIRNAME, env: ENV }),
    new CopyPlugin({
      patterns: [{ from: join(STATIC_DIR, 'locales'), to: join(DIST_DIR, 'locales'), noErrorOnMissing: true }]
    })
  ]
};

const compiledConfig = config({
  ...updatedConfig,
  ...updatedPlugins,
  rootFolder: RELATIVE_DIRNAME,
  debug: ENV !== 'production'
});

let webpackConfig = compiledConfig.config;
const plugins = compiledConfig.plugins; // eslint-disable-line
/*
plugins.push(
  fedModules({
    root: RELATIVE_DIRNAME,
    useFileHash: false
  })
);
*/
webpackConfig = {
  ...webpackConfig,
  devServer: {
    ...webpackConfig.devServer,
    hot: false
    // port: '5001'
    // writeToDisk: false
    // "hot": false,
    // "port": "3000",
    // "https": true,
    // "inline": true,
    // "disableHostCheck": true,
    // "historyApiFallback": true,
    // "writeToDisk": true
  }
};

// console.log(JSON.stringify({ ...webpackConfig, plugins }, null, 2));

module.exports = { ...webpackConfig, plugins };
