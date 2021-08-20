const config = require('@redhat-cloud-services/frontend-components-config');
const { setHtmlPlugin, setReplacePlugin, setCommonPlugins } = require('./build.plugins');
const { setupDotenvFilesForEnv } = require('./build.dotenv');
const setProxyRoutes = require('./spandx.config');

// const DEV_BRANCH = process.env.DEV_BRANCH;
// let BETA_PREFIX = '';

// if (/(prod|qa|ci)-beta/.test(DEV_BRANCH)) {
// BETA_PREFIX = '/beta';
// }

const { _BUILD_RELATIVE_DIRNAME, DEV_BRANCH, DEV_PORT, UI_DEPLOY_PATH_PREFIX: BETA_PREFIX } = setupDotenvFilesForEnv({
  env: 'proxy',
  addEnvParams: {
    UI_DEPLOY_PATH_PREFIX: ({ DEV_BRANCH: BRANCH }) => (/(prod|qa|ci)-beta/.test(BRANCH) ? '/beta' : '')
  }
});

const { config: webpackConfig, plugins } = config({
  appUrl: [`${BETA_PREFIX}/insights/subscriptions`, `${BETA_PREFIX}/openshift/subscriptions`],
  debug: true,
  deployment: (/beta/.test(BETA_PREFIX) && 'beta/apps') || 'apps',
  env: (/(prod|qa|ci)(-stable|-beta)$/.test(DEV_BRANCH) && DEV_BRANCH) || 'ci-stable',
  port: Number.parseInt(DEV_PORT, 10),
  rootFolder: _BUILD_RELATIVE_DIRNAME,
  routes: setProxyRoutes({ DEV_PORT, BETA_PREFIX }),
  skipChrome2: false,
  standalone: false,
  useCloud: (!/prod-(beta|stable)$/.test(DEV_BRANCH) && true) ?? false,
  useProxy: true,
  htmlPlugin: setHtmlPlugin(),
  replacePlugin: setReplacePlugin()
});

plugins.push(...setCommonPlugins());

module.exports = {
  ...webpackConfig,
  plugins
};
