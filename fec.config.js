// const config = require('@redhat-cloud-services/frontend-components-config');
const { setupDotenvFilesForEnv } = require('./config/build.dotenv');
// const prodConfig = require('./config/webpack.prod.config');
// const proxyConfig = require('./config/webpack.proxy.config');
const { dependencies } = require('./package.json');

const env = (process.env.NODE_ENV === 'production' && 'production') || 'proxy';

const {
  _BUILD_RELATIVE_DIRNAME,
  REACT_APP_UI_DEPLOY_PATH_PREFIX: BETA_PREFIX,
  DEV_ANALYZE,
  DEV_BRANCH,
  DEV_PORT
} = setupDotenvFilesForEnv({ env });

// let customWebpack = proxyConfig;

// if (NODE_ENV === 'production') {
// customWebpack = prodConfig;
// }

// const { config: output } = config(customWebpack);

// fedModulePlugin({
//       root: RELATIVE_DIRNAME,
//       shared: [
//         { 'react-router-dom': { singleton: true, requiredVersion: '*' } },
//         { 'react-redux': { requiredVersion: dependencies['react-redux'] } }
//       ]
//     })

const UPDATED_BETA_PREFIX = [BETA_PREFIX];

switch (BETA_PREFIX) {
  case '/preview':
    UPDATED_BETA_PREFIX.push('/beta');
    break;
  case '/beta':
  default:
    UPDATED_BETA_PREFIX.push('/preview');
    break;
}

//
console.log(dependencies['react-redux'], dependencies['react-router-dom']);
const reactRouterDomVersion = dependencies['react-router-dom'];
const reactReduxVersion = dependencies['react-redux'];

module.exports = {
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
  client: { overlay: false },
  debug: true,
  useProxy: true,
  proxyVerbose: false,
  port: Number.parseInt(DEV_PORT, 10),
  rootFolder: _BUILD_RELATIVE_DIRNAME,
  standalone: false,
  // sassPrefix: '.frontend-starter-app, .frontendStarterApp',
  interceptChromeConfig: false,
  plugins: [],
  // _unstableHotReload: process.env.HOT === 'true',
  moduleFederation: {
    exclude: ['react-router-dom'],
    shared: [
      /*
      {
        'react-router-dom': {
          singleton: true,
          import: false,
          requiredVersion: '*'
        }
      },
      */
      // { 'react-redux': { requiredVersion: '^8.1.2' } }
    ]
  }
};

/*
module.exports = {
  appUrl: '/staging/starter',
  debug: true,
  useProxy: true,
  proxyVerbose: true,
  /**
   * Change accordingly to your appname in package.json.
   * The `sassPrefix` attribute is only required if your `appname` includes the dash `-` characters.
   * If the dash character is present, you will have to add a camelCase version of it to the sassPrefix.
   * If it does not contain the dash character, remove this configuration.
   */
// sassPrefix: '.frontend-starter-app, .frontendStarterApp',
/**
 * Change to false after your app is registered in configuration files
 * /
  interceptChromeConfig: false,
  /**
 * Add additional webpack plugins
 * /
  plugins: [],
  _unstableHotReload: process.env.HOT === 'true',
  moduleFederation: {
    exclude: ['react-router-dom'],
    shared: [
      {
        'react-router-dom': {
          singleton: true,
          import: false,
          requiredVersion: '^6.3.0'
        }
      }
    ]
  }
};
 */
