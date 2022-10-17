import React, { useContext } from 'react';
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
 * Route context wrapper for useLocation
 *
 * @param {object} options
 * @param {Function} options.useRouterContext
 * @returns {*}
 */
const useLocation = ({ useRouterContext: useAliasRouterContext = useRouterContext } = {}) => {
  const { useLocation: useAliasLocation = helpers.noop } = useAliasRouterContext();
  return useAliasLocation();
};

/**
 * Route context wrapper for useNavigate
 *
 * @param {object} options
 * @param {Function} options.useRouterContext
 * @returns {*}
 */
const useNavigate = ({ useRouterContext: useAliasRouterContext = useRouterContext } = {}) => {
  const { useNavigate: useAliasNavigate = helpers.noop } = useAliasRouterContext();
  return useAliasNavigate();
};

/**
 * Route context wrapper for useParams
 *
 * @param {object} options
 * @param {Function} options.useRouterContext
 * @returns {*}
 */
const useParams = ({ useRouterContext: useAliasRouterContext = useRouterContext } = {}) => {
  const { useParams: useAliasParams = helpers.noop } = useAliasRouterContext();
  return useAliasParams();
};

const context = {
  RouterContext,
  DEFAULT_CONTEXT,
  useRouterContext,
  useRouteDetail,
  useLocation,
  useNavigate,
  useParams
};

export {
  context as default,
  context,
  RouterContext,
  DEFAULT_CONTEXT,
  useRouterContext,
  useRouteDetail,
  useLocation,
  useNavigate,
  useParams
};
