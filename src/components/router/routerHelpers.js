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
/*
const generateProductGroups = _memoize((configs = productConfig.configs) => {
  const productGroups = {};

  configs.forEach(({ productId, productGroup }) => {
    const viewIds = ((Array.isArray(productGroup) && productGroup) || [productGroup]).map(
      id => (id && `view${id}`) || id
    );

    viewIds.forEach((id, index) => {
      if (id) {
        productGroups[id] ??= [];

        if (productId) {
          productGroups[id].push((Array.isArray(productId) && productId?.[index]) || productId);
        }
      }
    });
  });

  return productGroups;
});
*/

/**
 * Reference for products grouped by view.
 */
// const productGroups = productConfig.sortedConfigs.byViewIds; // generateProductGroups();

// const sortedConfigs = productConfig.sortedConfigs;

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
const errorRoute = routes.find(route => route.activateOnError === true) || {};

/**
 * The first redirect route.
 *
 * @type {object}
 */
const redirectRoute = routes.find(({ disabled, redirect }) => !disabled && redirect);

/**
 * Match route config entries by path.
 *
 * @param {object} params
 * @param {string} params.pathName
 * @param {Array} params.config
 * @returns {{configs: Array, configFirstMatch: object, configsById: object}}
 */
const getRouteConfigByPath = _memoize(
  ({
    pathName = dynamicBasePath(),
    configs = productConfig.configs
    // sortedConfigs = productConfig.sortedConfigs
  } = {}) => {
    const basePathDirs = pathName?.split('/').filter(str => str.length > 0);
    const filteredConfigs = [];
    const filteredConfigsById = {};
    const filteredConfigsByGroup = {};
    const allConfigs = configs;
    // const allConfigsByGroup = sortedConfigs.byGroupIdConfigs;
    // const allConfigsById = sortedConfigs.byProductIdConfigs;

    const findConfig = dir => {
      configs.forEach(configItem => {
        const { productId, productGroup, aliases } = configItem;
        /*
        const updatedConfigItem = {
          aliases,
          productId,
          productGroup,
          ...configItem
        };
        */

        if (
          dir &&
          (new RegExp(dir, 'i').test(productGroup?.toString()) ||
            new RegExp(dir, 'i').test(productId?.toString()) ||
            new RegExp(dir, 'i').test(aliases?.toString()))
        ) {
          // productIds should be unique, but this covers
          // if (!configsById[productId]) {
          filteredConfigsByGroup[productGroup] ??= [];
          filteredConfigsByGroup[productGroup].push(configItem);

          filteredConfigsById[productId] = configItem;
          filteredConfigs.push(configItem);
          // }
        }

        /*
        if (!allConfigsById[productId]) {
          allConfigsById[productId] = { ...updatedConfigItem };
          allConfigs.push({ ...updatedConfigItem });
        }

        if (productGroup) {
          allConfigsByGroup[productGroup] ??= [];
          allConfigsByGroup[productGroup].push({ ...updatedConfigItem });
        }
        */
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

    return {
      allConfigs,
      // allConfigsById,
      // allConfigsByGroup,
      configs: filteredConfigs,
      configsById: filteredConfigsById,
      configsByGroup: filteredConfigsByGroup,
      firstMatch: filteredConfigs?.[0]
    };
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
  redirectRoute,
  errorRoute,
  getRouteConfigByPath,
  importView,
  pathJoin,
  // productGroups,
  routes
  // sortedConfigs
};

export {
  routerHelpers as default,
  routerHelpers,
  appName,
  dynamicBaseName,
  redirectRoute,
  errorRoute,
  getRouteConfigByPath,
  importView,
  pathJoin,
  // productGroups,
  routes
  // sortedConfigs
};
