import React, { useContext } from 'react';
import { helpers } from '../../common/helpers';

/**
 * Route context.
 *
 * @type {React.Context<{}>}
 */
const DEFAULT_CONTEXT = [{ routeDetail: {} }, helpers.noop];

const RouterContext = React.createContext(DEFAULT_CONTEXT);

/**
 * Get a router context.
 *
 * @returns {React.Context<{}>}
 */
const useRouterContext = () => useContext(RouterContext);

/**
 * Get a route detail from router context.
 *
 * @returns {{routes: Array, routeItem: Array, baseName: string, errorRoute: object}}
 */
const useRouteDetail = () => {
  const { routeDetail = { baseName: null, errorRoute: null, routes: [], routeItem: [] } } = useContext(RouterContext);
  return routeDetail;
};

const context = {
  RouterContext,
  DEFAULT_CONTEXT,
  useRouterContext,
  useRouteDetail
};

export { context as default, context, RouterContext, DEFAULT_CONTEXT, useRouterContext, useRouteDetail };
