import React, { useContext } from 'react';
import { reduxActions, storeHooks } from '../../redux';
import { routerHelpers } from './routerHelpers';
import { helpers } from '../../common/helpers';

/**
 * Route context.
 *
 * @type {React.Context<{}>}
 */
const DEFAULT_CONTEXT = [{}, helpers.noop];

const RouterContext = React.createContext(DEFAULT_CONTEXT);

const RouteContext = React.createContext(DEFAULT_CONTEXT);

/**
 * Get an updated router context.
 *
 * @returns {React.Context<{}>}
 */
const useRouterContext = () => useContext(RouterContext);

/**
 * Get an updated route context.
 *
 * @returns {React.Context<{}>}
 */
const useRouteContext = () => useContext(RouteContext);

/**
 * Get a route detail from router context.
 *
 * @param {object} options
 * @param {Function} options.useRouteContext
 * @returns {{routes: Array, routeItem: object, baseName: string, errorRoute: object}}
 */
const useRouteDetail = ({ useRouteContext: useAliasRouteContext = useRouteContext } = {}) => {
  const { routeDetail } = useAliasRouteContext();
  return {
    ...routeDetail,
    ...(routeDetail?.id && routerHelpers.getRouteConfig({ id: routeDetail.id }))
  };
};

/**
 * Pass useHistory methods. Proxy useHistory push with Platform specific navigation update.
 *
 * @param {object} options
 * @param {boolean} options.isSetAppNav Allow setting the Platform's left navigation if conditions are met or fallback to history.push.
 * @param {Function} options.useRouterContext
 * @param {Function} options.useDispatch
 * @returns {object}
 */
const useHistory = ({
  isSetAppNav = false,
  useRouterContext: useAliasRouterContext = useRouterContext,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch
} = {}) => {
  const { useNavigate: useAliasNavigate = helpers.noop } = useAliasRouterContext();
  const navigate = useAliasNavigate();
  const dispatch = useAliasDispatch();

  return {
    push: (pathLocation, historyState) => {
      const pathName = (typeof pathLocation === 'string' && pathLocation) || pathLocation?.pathname;
      const { path, id } = routerHelpers.getRouteConfig({ pathName, id: pathName });
      const { hash = '', search = '' } = window.location;

      if (isSetAppNav && id) {
        return dispatch(reduxActions.platform.setAppNav(id));
      }

      return navigate(
        (path && `${path}${search}${hash}`) || (pathName && `${pathName}${search}${hash}`) || pathLocation,
        historyState
      );
    }
  };
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

/**
 * Search parameter, return
 *
 * @param {object} options
 * @param {Function} options.useRouterContext
 * @returns {Array}
 */
const useSearchParams = ({ useRouterContext: useAliasRouterContext = useRouterContext } = {}) => {
  const { useSearchParams: useAliasSearchParams = helpers.noop, useLocation: useAliasLocation = helpers.noop } =
    useAliasRouterContext();
  const { search } = useAliasLocation();
  const [, setAliasSearchParams] = useAliasSearchParams();
  const { decodeURIComponent, URLSearchParams } = window;

  /**
   * Parse a location search, using a set
   *
   * @param {string|*} currentSearch
   * @returns {{}}
   */
  const parseSearch = currentSearch => {
    const parsedSearch = {};

    [
      ...new Set(
        [...new URLSearchParams(decodeURIComponent(currentSearch))].map(([param, value]) => `${param}~${value}`)
      )
    ].forEach(v => {
      const [param, value] = v.split('~');
      parsedSearch[param] = value;
    });

    return parsedSearch;
  };

  /**
   * Alias returned React Router Dom useSearchParams hook to something expected.
   * Defaults to merging search objects instead of overwriting them.
   *
   * @param {object} updatedQuery
   * @param {object} options
   * @param {boolean} options.isMerged Merge search with existing search, or don't
   * @param {string|*} options.currentSearch search returned from useLocation
   */
  const setSearchParams = (updatedQuery, { isMerged = true, currentSearch = search } = {}) => {
    let updatedSearch = {};

    if (isMerged) {
      Object.assign(updatedSearch, parseSearch(currentSearch), updatedQuery);
    } else {
      updatedSearch = updatedQuery;
    }

    setAliasSearchParams(updatedSearch);
  };

  return [parseSearch(search), setSearchParams];
};

const context = {
  RouterContext,
  RouteContext,
  DEFAULT_CONTEXT,
  useRouterContext,
  useRouteContext,
  useRouteDetail,
  useHistory,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
};

export {
  context as default,
  context,
  RouterContext,
  RouteContext,
  DEFAULT_CONTEXT,
  useRouterContext,
  useRouteContext,
  useRouteDetail,
  useHistory,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
};
