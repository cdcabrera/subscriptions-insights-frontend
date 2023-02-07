import React, { useContext, useMemo } from 'react';
import { useHistory as useHistoryRRD, useLocation as useLocationRRD, useParams, useRouteMatch } from 'react-router-dom';
import { routerHelpers } from './routerHelpers';
import { helpers } from '../../common/helpers';

/**
 * Route context.
 *
 * @type {React.Context<{}>}
 */
const DEFAULT_CONTEXT = [
  { routeDetail: { baseName: null, errorRoute: null, routes: [], routeItem: {} } },
  helpers.noop
];

const RouterContext = React.createContext(DEFAULT_CONTEXT);

/**
 * Get an updated router context.
 *
 * @returns {React.Context<{}>}
 */
const useRouterContext = () => useContext(RouterContext);

/**
 * Get a route detail from router context.
 *
 * @param {object} options
 * @param {Function} options.useRouterContext
 * @returns {{routes: Array, routeItem: object, baseName: string, errorRoute: object}}
 */
const useRouteDetail = ({ useRouterContext: useAliasRouterContext = useRouterContext } = {}) => {
  const { routeDetail } = useAliasRouterContext();
  return routeDetail;
};

/**
 * Pass useHistory methods. Proxy useHistory push with Platform specific navigation update.
 *
 * @param {object} options
 * @param {Function} options.useHistory
 * @returns {object}
 */
const useHistory = ({ useHistory: useAliasHistory = useHistoryRRD } = {}) => {
  const history = useAliasHistory();

  return {
    ...history,
    push: (pathLocation, historyState) => {
      const pathName = (typeof pathLocation === 'string' && pathLocation) || pathLocation?.pathname;
      const { firstMatch } = routerHelpers.getRouteConfigByPath({ pathName });
      const { hash, search } = window.location;

      return history?.push(
        (firstMatch?.productPath && `${routerHelpers.pathJoin('/', firstMatch?.productPath)}${search}${hash}`) ||
          (pathName && `${pathName}${search}${hash}`) ||
          pathLocation,
        historyState
      );
    }
  };
};

/**
 * Combine react-router-dom useLocation with actual window location.
 * Focused on exposing replace and href.
 *
 * @param {Function} useLocation
 * @returns {{search, replace: Function, href, hash}}
 */
const useLocation = ({ useLocation: useAliasLocation = useLocationRRD } = {}) => {
  const location = useAliasLocation();
  const { location: windowLocation } = window;

  return useMemo(
    () => ({
      ...location,
      ...windowLocation,
      replace: path => windowLocation.replace(path),
      hash: location?.hash || '',
      set href(path) {
        windowLocation.href = path;
      },
      search: location?.search || ''
    }),
    [location, windowLocation]
  );
};

const context = {
  RouterContext,
  DEFAULT_CONTEXT,
  useHistory,
  useLocation,
  useParams,
  useRouteDetail,
  useRouteMatch,
  useRouterContext
};

export {
  context as default,
  context,
  RouterContext,
  DEFAULT_CONTEXT,
  useHistory,
  useLocation,
  useParams,
  useRouteDetail,
  useRouteMatch,
  useRouterContext
};
