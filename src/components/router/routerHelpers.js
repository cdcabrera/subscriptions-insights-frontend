import React from 'react';
import _memoize from 'lodash/memoize';
import { closest } from 'fastest-levenshtein';
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
 * The first redirect route.
 *
 * @type {object}
 */
const redirectRoute = routesConfig.find(({ disabled, redirect }) => !disabled && redirect);

/**
 * Return array of objects that describes routing.
 *
 * @returns {Array}
 */
const routes = routesConfig.filter(item => !item.disabled);

/**
 * Match pre-sorted route config entries with a path, or match with a fallback.
 * This is the primary engine for curiosity routing. It can account for a full window.location.pathname
 * given the appropriate alias, group, product, and/or path identifiers provided with product configuration.
 *
 * @param {object} params
 * @param {string} params.pathName
 * @param {Array} params.config
 * @param {boolean} params.isFailureAcceptable
 * @returns {{configs: Array, configFirstMatch: object, configsById: object}}
 */
const getRouteConfigByPath = _memoize(({ pathName, configs = productConfig.sortedConfigs } = {}) => {
  const { byGroup, byAliasGroupProductPathIds, byProductIdConfigs } = configs();
  const updatedPathName = pathName
    .toLowerCase()
    .replace(/^\/*|\/*$/g, '')
    .replace(new RegExp(helpers.UI_DISPLAY_NAME, 'i'), '')
    .replace(/\/\//g, '/');

  // Do a known comparison against alias, group, product, path identifiers
  const focusedStr = byAliasGroupProductPathIds.find(value => value.toLowerCase() === updatedPathName.split('/').pop());

  // Fallback attempt, match pathName with the closest string
  const closestStr = closest(updatedPathName, byAliasGroupProductPathIds);
  const configsByGroup = byGroup?.[focusedStr || closestStr];

  return {
    isClosest: !focusedStr,
    allConfigs: Object.values(byProductIdConfigs),
    configs: configsByGroup,
    firstMatch: configsByGroup?.[0]
  };
});

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

/**
 * Parse search parameters from a string, using a set for "uniqueness"
 *
 * @param {string} currentPathAndOrSearch
 * @returns {{}}
 */
const parseSearchParams = _memoize((currentPathAndOrSearch = window.location.search) => {
  const { decodeURIComponent, URLSearchParams } = window;
  const parsedSearch = {};

  [
    ...new Set(
      [...new URLSearchParams(decodeURIComponent(currentPathAndOrSearch))].map(([param, value]) => `${param}~${value}`)
    )
  ].forEach(v => {
    const [param, value] = v.split('~');
    parsedSearch[param] = value;
  });

  return parsedSearch;
});

/**
 * Basic path join, minor emulation for path.join. Related to the webpack 5 migration.
 *
 * @param {object} paths
 * @returns {string}
 */
const pathJoin = _memoize((...paths) => {
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
});

const routerHelpers = {
  appName,
  dynamicBaseName,
  dynamicBasePath,
  redirectRoute,
  getRouteConfigByPath,
  importView,
  parseSearchParams,
  pathJoin,
  routes
};

export {
  routerHelpers as default,
  routerHelpers,
  appName,
  dynamicBaseName,
  dynamicBasePath,
  redirectRoute,
  getRouteConfigByPath,
  importView,
  parseSearchParams,
  pathJoin,
  routes
};
