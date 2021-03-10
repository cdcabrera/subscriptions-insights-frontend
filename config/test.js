const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
// const config = require('@redhat-cloud-services/frontend-components-config/src/config');
// const plugins = require('@redhat-cloud-services/frontend-components-config/src/plugins');
const { setupWebpackDotenvFilesForEnv, setupDotenvFilesForEnv } = require('./build.dotenv');
const { insights } = require(`../package.json`);

setupDotenvFilesForEnv({ env: 'development' });
process.env.NODE_ENV = 'development';
// const MODE = process.env.NODE_ENV;

const RELATIVE_DIRNAME = process.env._OSEED_RELATIVE_DIRNAME;
// const IS_PROJECT_ROOT_DIR = process.env._OSEED_IS_PROJECT_ROOT_DIR;
// const IMAGES_DIRNAME = process.env._OSEED_IMAGES_DIRNAME;
// const PUBLIC_PATH = process.env._OSEED_PUBLIC_PATH;
// const PORT = process.env._OSEED_PORT;
const PUBLIC_PATH = process.env.PUBLIC_URL;
const PORT = process.env._OSEED_PORT;
// const SRC_DIR = process.env._OSEED_SRC_DIR;
// const DIST_DIR = process.env._OSEED_DIST_DIR;
// const OUTPUT_ONLY = process.env._OSEED_OUTPUT_ONLY;

const updatedConfig = {
  port: PORT,
  publicPath: PUBLIC_PATH,
  // appEntry: dynamically set from const appEntry = getAppEntry(configurations.rootFolder, process.env.NODE_ENV === 'production');
  // rootFolder, set below
  // https, ignoring
  // mode: MODE, dynamically set between 'production' and 'development'
  // appName, dynamically set from package.json insights.appname
  // useFileHash = true,
  // betaEnv = 'ci', sets the proxy subdomain when running webpack dev server
  // sassPrefix, fallsback to the appname if not set
  // deployment: process.env.NODE_ENV === 'production'
  deployment: (/beta/.test(PUBLIC_PATH) && 'beta/apps') || 'apps'
  // skipChrome2 = false
};

const updatedPlugins = {
  // rootFolder, set below
  // appDeployment, dynamically set from config
  htmlPlugin: {
    title: process.env.REACT_APP_UI_DISPLAY_NAME,
    inject: true,
    template: resolve(__dirname, '../public/index.html'),
    ...(process.env.NODE_ENV === 'production'
      ? {
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true
          }
        }
      : undefined)
  },
  replacePlugin: [
    {
      pattern: /%([A-Z_]+)%/g,
      replacement: (match, $1) => {
        console.log('MATCH >>>>>>>>>>>>>>>>>>>>>>>>>', match, $1);
        return process.env?.[$1] || match;
      }
      // those formal parameters could be:
      // match: <-- css:bootstrap-->
      // type: css
      // file: bootstrap
      // Then fetch css link from some resource object
      // var url = resources['css']['bootstrap']
      // var url = resource[type][file]
      // $1==='@@' <--EQ--> $4===undefined
      // return $4 == undefined ? url : tpl[type].replace('%s', url)
      // return process.env?.[$1] || match;
      // }
    }
  ],
  // insights, dynamically set from config
  // modules, none that i know of
  plugins: [...setupWebpackDotenvFilesForEnv({ directory: RELATIVE_DIRNAME, env: 'development' })]
};

const { config: webpackConfig, plugins } = config({
  ...updatedConfig,
  ...updatedPlugins,
  // rootFolder: resolve(__dirname, '../'),
  rootFolder: RELATIVE_DIRNAME,
  debug: true
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')({
    // root: resolve(__dirname, '../')
    root: RELATIVE_DIRNAME
  })
);

// module.exports = { ...webpackConfig, plugins };

console.log(JSON.stringify({ ...webpackConfig, plugins }, null, 2));
