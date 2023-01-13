import React, { useCallback, useContext } from 'react';
// import { redirect } from 'react-router-dom';
// import { reduxActions, storeHooks } from '../../redux';
import { pathJoin, routerHelpers } from './routerHelpers';
import { helpers } from '../../common/helpers';

/**
 * Route context.
 *
 * @type {React.Context<{}>}
 */
const DEFAULT_CONTEXT = [
  {
    redirect: helpers.noop,
    useLocation: helpers.noop,
    useNavigate: helpers.noop,
    useParams: helpers.noop,
    useSearchParams: helpers.noop
  },
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
 * Return a callback for redirecting, and replacing, towards a new path, or url.
 *
 * @callback redirect
 * @param {object} options
 * @param {Function} options.useRouterContext
 * @returns {(function(*): void)|*}
 */
const useRedirect = ({ useRouterContext: useAliasRouterContext = useRouterContext } = {}) => {
  const { useLocation: useAliasLocation = helpers.noop } = useAliasRouterContext();
  const { hash = '', search = '' } = useAliasLocation() || {};

  /**
   * redirect
   *
   * @param {string} route
   * @returns {undefined}
   */
  return useCallback(
    route => {
      const baseName = routerHelpers.dynamicBaseName();
      // const { hash = '', search = '' } = window.location;
      let isUrl;

      try {
        isUrl = !!new URL(route);
      } catch (e) {
        isUrl = false;
      }

      window.location.replace((isUrl && route) || `${pathJoin(baseName, route)}${search}${hash}`);
      return undefined;
    },
    [hash, search]
  );
};

/**
 * Get a route detail from router context.
 *
 * @param {object} options
 * @param {Function} options.useRedirect
 * @param {Function} options.useRouterContext
 * @returns {{baseName: string, errorRoute: object}}
 */
const useRouteDetail = ({
  useRedirect: useAliasRedirect = useRedirect,
  useRouterContext: useAliasRouterContext = useRouterContext
} = {}) => {
  const { useParams: useAliasParams, useNavigate: useAliasNavigate } = useAliasRouterContext();
  const redirect = useAliasRedirect();
  //  const navigate = useAliasNavigate();
  const { productPath } = useAliasParams();
  const { firstMatch, ...configs } = routerHelpers.getRouteConfigByPath({ pathName: productPath });
  // const productConfig = ;
  console.log('>>> testing USE ROUTE DETAIL', firstMatch, useAliasNavigate);

  if (!firstMatch) {
    console.log('>>> use route detail ERROR');
    // navigate('./');
    // document.location.href = './';
    redirect(routerHelpers.redirectRoute.redirect);
    // return {};
  }

  return {
    ...configs,
    baseName: routerHelpers.dynamicBaseName(),
    errorRoute: routerHelpers.errorRoute,
    productGroup: firstMatch?.productGroup,
    productConfig: (firstMatch && [firstMatch]) || []
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
  // isSetAppNav = false,
  useRouterContext: useAliasRouterContext = useRouterContext
  // useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch
} = {}) => {
  const { useNavigate: useAliasNavigate = helpers.noop } = useAliasRouterContext();
  const navigate = useAliasNavigate();
  // const dispatch = useAliasDispatch();

  return {
    push: pathLocation => navigate(pathLocation)
    /*
    push: (pathLocation, historyState) => {
      const pathName = (typeof pathLocation === 'string' && pathLocation) || pathLocation?.pathname;
      const { productId } = routerHelpers.getRouteConfig({ pathName, id: pathName });
      const path = productId?.toLowerCase();
      const { hash = '', search = '' } = window.location;

      if (isSetAppNav && path) {
        return dispatch(reduxActions.platform.setAppNav(path));
      }

      const temp = (path && `${path}${search}${hash}`) || (pathName && `${pathName}${search}${hash}`) || pathLocation;
      console.log('>>> testing', temp);

      navigate(temp, historyState);
      // return;
      /*
      return navigate(
        (path && `${path}${search}${hash}`) || (pathName && `${pathName}${search}${hash}`) || pathLocation,
        historyState
      );
    }
    */
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
  const { useLocation: useAliasLocation } = useAliasRouterContext();
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
  const { useNavigate: useAliasNavigate } = useAliasRouterContext();
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
  const { useParams: useAliasParams } = useAliasRouterContext();
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
  const { useSearchParams: useAliasSearchParams, useLocation: useAliasLocation } = useAliasRouterContext();
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
  DEFAULT_CONTEXT,
  useHistory,
  useLocation,
  useNavigate,
  useParams,
  useRedirect,
  useRouterContext,
  useRouteDetail,
  useSearchParams
};

export {
  context as default,
  context,
  RouterContext,
  DEFAULT_CONTEXT,
  useHistory,
  useLocation,
  useNavigate,
  useParams,
  useRedirect,
  useRouterContext,
  useRouteDetail,
  useSearchParams
};
