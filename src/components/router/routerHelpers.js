import React from 'react';
import _memoize from 'lodash/memoize';
import { helpers } from '../../common/helpers';
import { routesConfig, productConfig } from '../../config';

/**
 * Platform name/id.
 *
 * @type {string}
 */
const appName = helpers.UI_NAME;

/**
 * Return a string that describes a platform redirect.
 *
 * @returns {Array}
 */
const platformLandingRedirect = `${helpers.UI_DEPLOY_PATH_PREFIX || ''}/`;

/**
 * Return a string that describes a platform redirect.
 *
 * @returns {Array}
 */
const platformModalRedirect = `${helpers.UI_DEPLOY_PATH_PREFIX || ''}/?not_entitled=subscriptions`;

/**
 * The app baseName. Return an assumed route baseName directory based on existing app name.
 * App name is defined in dotenv and package.json/insights.appname
 * [environment]/[OPTIONAL]/[OPTIONAL]/[APP NAME]
 *
 * @param {object} params
 * @param {string} params.pathName
 * @param {string} params.appName
 * @returns {string}
 */
const dynamicBaseName = ({ pathName = window.location.pathname, appName: applicationName = helpers.UI_NAME } = {}) =>
  `${pathName.split(applicationName)[0]}${applicationName}`;

/**
 * App basePath. Return a base path.
 *
 * @param {object} params
 * @param {string} params.pathName
 * @param {string} params.appName
 * @returns {string}
 */
const dynamicBasePath = ({ pathName = window.location.pathname, appName: applicationName = helpers.UI_NAME } = {}) =>
  pathName.split(applicationName)[0];

/**
 * Basic path join, minor emulation for path.join.
 *
 * @param {object} paths
 * @returns {string}
 */
const pathJoin = (...paths) => {
  let updatedPath = Array.from(paths);
  const hasLead = /^\/\//.test(updatedPath[0]);
  updatedPath = updatedPath
    .join('/')
    .replace(/(\/\/)+/g, '~')
    .replace(/~/g, '/')
    .replace(/\/\//g, '/');

  if (hasLead) {
    updatedPath = `/${updatedPath}`;
  }

  return updatedPath;
};

/**
 * Generate product groups for applying query filter resets.
 *
 * @param {Array} configs
 * @returns {Array}
 */
const generateProductGroups = _memoize((configs = productConfig.configs) => {
  const productGroups = {};

  configs.forEach(({ productId, productGroup }) => {
    const viewIds = ((Array.isArray(productGroup) && productGroup) || [productGroup]).map(
      id => (id && `view${id}`) || id
    );

    viewIds.forEach((id, index) => {
      if (id) {
        if (!productGroups[id]) {
          productGroups[id] = [];
        }

        if (productId) {
          productGroups[id].push((Array.isArray(productId) && productId?.[index]) || productId);
        }
      }
    });
  });

  return productGroups;
});

/**
 * Reference for products grouped by view.
 */
const productGroups = generateProductGroups();

/**
 * Return array of objects that describes routing.
 *
 * @returns {Array}
 */
const routes = routesConfig;

/**
 * The first error route.
 *
 * @type {object}
 */
const getErrorRoute = routes.find(route => route.activateOnError === true) || {};

/**
 * Match route config entries by path.
 *
 * @param {object} params
 * @param {string} params.pathName
 * @param {Array} params.config
 * @returns {{configs: Array, configFirstMatch: object, configsById: object}}
 */
const getRouteConfigByPath = _memoize(({ pathName = dynamicBasePath(), configs = productConfig.configs } = {}) => {
  const basePathDirs = pathName?.split('/').filter(str => str.length > 0);
  const filteredConfigs = [];
  const allConfigs = [];
  const configsById = {};
  const allConfigsById = {};

  const findConfig = dir => {
    configs.forEach(({ productId, productGroup, aliases, ...configItem }) => {
      const updatedConfigItem = {
        aliases,
        productId,
        productGroup,
        ...configItem
      };

      if (
        dir &&
        (new RegExp(dir, 'i').test(productGroup?.toString()) ||
          new RegExp(dir, 'i').test(productId?.toString()) ||
          new RegExp(dir, 'i').test(aliases?.toString()))
      ) {
        if (!configsById[productId]) {
          configsById[productId] = { ...updatedConfigItem };
          filteredConfigs.push({ ...updatedConfigItem });
        }
      }

      if (!allConfigsById[productId]) {
        allConfigsById[productId] = { ...updatedConfigItem };
        allConfigs.push({ ...updatedConfigItem });
      }
    });
  };

  if (basePathDirs?.length) {
    basePathDirs.forEach(dir => {
      if (dir) {
        const decodedDir = window.decodeURI(dir);
        findConfig(decodedDir);
      }
    });
  } else {
    findConfig();
  }

  return { allConfigs, allConfigsById, configs: filteredConfigs, configsById, firstMatch: filteredConfigs?.[0] };
});

/**
 * Return a route config object.
 *
 * @param {object} params
 * @param {string} params.id
 * @param {string} params.pathName
 * @param {boolean} params.returnDefault
 * @param {Array} params.config
 * @returns {object}
 */
/*
const getRouteConfig = _memoize(({ id = null, pathName, returnDefault = false, configs = productConfigs } = {}) => {
  let navRouteItem;

  if (id) {
    navRouteItem = configs.find(item => new RegExp(item.productId, 'i').test(id));
  }

  if ((!navRouteItem && pathName) || (!navRouteItem && !pathName && !returnDefault)) {
    navRouteItem = getRouteConfigByPath({ pathName, configs }).firstMatch;
  }

  // if (!navRouteItem && returnDefault) {
  //   navRouteItem = config.find(item => item.default === true);
  // }

  return { ...navRouteItem };
});
 */
/**
 * Return a product config object.
 *
 * @param {object} params
 * @param {string} params.id
 * @param {string} params.pathName
 * @param {boolean} params.returnDefault
 * @param {Array} params.config
 * @returns {object}
 */
const getProductConfig = _memoize(
  ({ id = null, pathName, returnDefault = false, configs = productConfig.configs } = {}) => {
    let configItem;

    if (id) {
      configItem = configs.find(item => new RegExp(item.productId, 'i').test(id));
    }

    if ((!configItem && pathName) || (!configItem && !pathName && !returnDefault)) {
      configItem = getRouteConfigByPath({ pathName, configs }).firstMatch;
    }

    return { ...configItem };
  }
);

/**
 * Import a route component.
 *
 * @param {Node} component
 * @returns {Node}
 */
const importView = component => {
  if (!helpers.TEST_MODE) {
    return React.lazy(() => import(/* webpackExclude: /\.test\.js$/ */ `../${component}.js`));
  }

  return p => <React.Fragment>{JSON.stringify({ ...p, component }, null, 2)}</React.Fragment>;
};

const routerHelpers = {
  appName,
  dynamicBaseName,
  dynamicBasePath,
  generateProductGroups,
  getErrorRoute,
  // getRouteConfig,
  getProductConfig,
  getRouteConfigByPath,
  importView,
  pathJoin,
  platformLandingRedirect,
  platformModalRedirect,
  productGroups,
  routes,
  routesConfig
};

export {
  routerHelpers as default,
  routerHelpers,
  appName,
  dynamicBaseName,
  dynamicBasePath,
  generateProductGroups,
  getErrorRoute,
  // getRouteConfig,
  getProductConfig,
  getRouteConfigByPath,
  importView,
  pathJoin,
  platformLandingRedirect,
  platformModalRedirect,
  productGroups,
  routes,
  routesConfig
};
