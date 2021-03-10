const { join, resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const fedModules = require('@redhat-cloud-services/frontend-components-config/federated-modules');
const CopyPlugin = require('copy-webpack-plugin');
const { setupWebpackDotenvFilesForEnv, setupDotenvFilesForEnv } = require('./build.dotenv');

const NODE_ENV = process.env._OSEED_ENV;

setupDotenvFilesForEnv({ env: NODE_ENV });

const STATIC_DIR = process.env._OSEED_STATIC_DIR;
const RELATIVE_DIRNAME = process.env._OSEED_RELATIVE_DIRNAME;
const PUBLIC_PATH = process.env.PUBLIC_URL;
const PORT = process.env._OSEED_PORT;
// const SRC_DIR = process.env._OSEED_SRC_DIR;
const DIST_DIR = process.env._OSEED_DIST_DIR;

const ENV = process.env.REACT_APP_ENV;

const updatedConfig = {
  port: (ENV === 'review' && 443) || PORT,
  // port: PORT,
  publicPath: PUBLIC_PATH,
  deployment: (/beta/.test(PUBLIC_PATH) && 'beta/apps') || 'apps',
  // https: ENV === 'review',
  skipChrome2: ENV === 'development'
};

const updatedPlugins = {
  htmlPlugin: {
    title: process.env.REACT_APP_UI_DISPLAY_NAME,
    // inject: true,
    template: resolve(__dirname, '../public/index.html')
    /*
    ...(ENV === 'production'
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
   */
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
      /*,]]]]]]]]]////\\\\\\\\

             patterns: [
        {
          from: STATIC_DIR,
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ['*.html']
          },
          noErrorOnMissing: true
        }
      ]
      */
    })
  ]
  //  ENV !== 'development' &&
  //    fedModules({
  //      root: RELATIVE_DIRNAME
  //    })
};

const { config: webpackConfig, plugins } = config({
  ...updatedConfig,
  ...updatedPlugins,
  rootFolder: RELATIVE_DIRNAME,
  debug: ENV !== 'production'
});

if (ENV !== 'development') {
  /**/
  plugins.push(
    fedModules({
      root: RELATIVE_DIRNAME
    })
    // require('@redhat-cloud-services/frontend-components-config/federated-modules')({
    //  root: RELATIVE_DIRNAME
    // })
  );
}

// console.log(JSON.stringify({ ...webpackConfig, plugins }, null, 2));

module.exports = { ...webpackConfig, plugins };
