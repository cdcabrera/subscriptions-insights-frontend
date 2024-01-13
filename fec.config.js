// const fs = require('fs');
const path = require('path');
const { webpack, CopyWebpackPlugin } = require('weldable/lib/packages');
const { dotenv } = require('weldable');

const {
  // _BUILD_RELATIVE_DIRNAME,
  DEV_BRANCH,
  _BUILD_DIST_DIR: DIST_DIR,
  _BUILD_STATIC_DIR: STATIC_DIR,
  // REACT_APP_UI_DEPLOY_PATH_PREFIX: BETA_PREFIX,
  REACT_APP_ENV: DOTENV_ENV
} = dotenv.setupDotenvFilesForEnv({ env: (process.env.NODE_ENV === 'development' && 'proxy') || process.env.NODE_ENV });

console.log('>>>>>>>>', process.env.NODE_ENV, DOTENV_ENV);

/*
appUrl: (() => {
  const urls = [];
  UPDATED_BETA_PREFIX.forEach(path => {
    urls.push(
      `${path}/insights/subscriptions`,
      `${path}/openshift/subscriptions`,
      `${path}/application-services/subscriptions`,
      `${path}/subscriptions/usage`
    );
  });
  return urls;
})(),
*/

module.exports = {
  appUrl: '/subscriptions/usage',
  // deployment: (/beta/.test(BETA_PREFIX) && 'beta/apps') || (/preview/.test(BETA_PREFIX) && 'preview/apps') || 'apps',
  debug: true,
  env: (/(prod|stage|qa|ci)(-stable|-beta)$/.test(DEV_BRANCH) && DEV_BRANCH) || 'stage-stable',
  useProxy: true,
  proxyVerbose: true,
  // sassPrefix: '.frontend-starter-app, .frontendStarterApp',
  interceptChromeConfig: false,
  plugins: [
    new webpack.IgnorePlugin({ resourceRegExp: /\.(md)$/ }),
    ...dotenv.setupWebpackDotenvFilesForEnv({ env: DOTENV_ENV }),
    new CopyWebpackPlugin({
      patterns: [{ from: path.join(STATIC_DIR, 'locales'), to: path.join(DIST_DIR, 'locales'), noErrorOnMissing: true }]
    })
  ],
  // _unstableHotReload: process.env.HOT === 'true',
  moduleFederation: {
    exclude: ['react-router-dom'],
    shared: [
      {
        'react-router-dom': {
          singleton: true,
          import: false,
          version: '^6.3.0'
        }
      }
    ]
  }
};
