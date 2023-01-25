import React, { useCallback } from 'react';
import {
  useLocation,
  useNavigate as useRRDNavigate,
  useParams,
  useResolvedPath,
  useSearchParams as useRRDSearchParams
} from 'react-router-dom';
import { pathJoin, routerHelpers } from './routerHelpers';

/**
 * Route context.
 *
 * @type {React.Context<{}>}
 */
/*
const DEFAULT_CONTEXT = [
  {
    redirect: helpers.noop,
    // useLocation: helpers.noop,
    // useLocation,
    useNavigate: helpers.noop
    // useParams,
    // useSearchParams: useRRDSearchParams
    // useNavigate: helpers.noop,
    // useParams: helpers.noop,
    // useSearchParams: helpers.noop
  },
  helpers.noop
];
 */

// const RouterContext = React.createContext(DEFAULT_CONTEXT);

/**
 * Get an updated router context.
 *
 * @returns {React.Context<{}>}
 */
// const useRouterContext = () => useContext(RouterContext);

/**
 * Return a callback for redirecting, and replacing, towards a new path, or url.
 *
 * @callback redirect
 * @param {object} options
 * @param options.useLocation
 * @param options.useResolvedPath
 * @param {Function} options.useRouterContext
 * @returns {(function(*): void)|*}
 */
// const useRedirect = ({ useRouterContext: useAliasRouterContext = useRouterContext } = {}) => {
const useRedirect = ({
  useLocation: useAliasLocation = useLocation,
  useResolvedPath: useAliasResolvedPath = useResolvedPath
} = {}) => {
  // const { useLocation: useAliasLocation = helpers.noop } = useAliasRouterContext();
  // const { useLocation: useAliasLocation } = useAliasRouterContext();
  const { pathname } = useAliasResolvedPath();
  const { hash = '', search = '' } = useAliasLocation() || {};

  console.log('>>> useredirect', hash, search);

  /**
   * redirect
   *
   * @param {string} route
   * @returns {undefined}
   */
  return useCallback(
    route => {
      const baseName = routerHelpers.dynamicBaseName({ pathName: pathname });
      // const { hash = '', search = '' } = window.location;
      let isUrl;

      try {
        isUrl = !!new URL(route);
      } catch (e) {
        isUrl = false;
      }

      console.log('>>> test: redirect');
      window.location.replace((isUrl && route) || `${pathJoin(baseName, route)}${search}${hash}`);
      return undefined;
    },
    [hash, pathname, search]
  );
};

/**
 * Get a route detail from router context.
 *
 * @param {object} options
 * @param {Function} options.useRedirect
 * @param {Function} options.useRouterContext
 * @param options.useParams
 * @returns {{baseName: string, errorRoute: object}}
 */
const useRouteDetail = ({
  useRedirect: useAliasRedirect = useRedirect,
  // useRouterContext: useAliasRouterContext = useRouterContext
  useParams: useAliasParams = useParams
} = {}) => {
  // const { useParams: useAliasParams } = useAliasRouterContext();
  const redirect = useAliasRedirect();
  const { productPath } = useAliasParams();
  const { firstMatch, configs } = routerHelpers.getRouteConfigByPath({ pathName: productPath });

  if (!firstMatch) {
    redirect(routerHelpers.redirectRoute.redirect);
  }

  return {
    // ...configsByPath,
    // firstMatch,
    // configs,
    baseName: routerHelpers.dynamicBaseName(),
    errorRoute: routerHelpers.errorRoute,
    productGroup: firstMatch?.productGroup,
    productConfig: (configs?.length && configs) || []
    // configsByGroup: (firstMatch && configsByPath.allConfigsByGroup?.[firstMatch?.productGroup]) || {}
  };
};

/**
 * Route context wrapper for useLocation
 *
 * @param {object} options
 * @param {Function} options.useRouterContext
 * @returns {*}
 */
/*
const useLocation = ({ useRouterContext: useAliasRouterContext = useRouterContext } = {}) => {
  const { useLocation: useAliasLocation } = useAliasRouterContext();
  return useAliasLocation();
};
*/

const useNavigate = ({
  useLocation: useAliasLocation = useLocation,
  useNavigate: useAliasNavigate = useRRDNavigate,
  // useRedirect: useAliasRedirect = useRedirect,
  useResolvedPath: useAliasResolvedPath = useResolvedPath
} = {}) => {
  const { search, hash } = useAliasLocation();
  const isSearch = Object.keys(search).length > 0;
  const navigate = useAliasNavigate();
  // const redirect = useAliasRedirect();
  const { pathname } = useAliasResolvedPath();
  console.log('>>> resolved path', pathname);

  // return useCallback(() => {});
  // return path => console.log('>>> usenavigate', path, pathname, navigate);
  return useCallback(
    (path, { isPassSearchHash = true, ...options } = {}) => {
      console.log('>>> navigate', path);
      const { firstMatch } = routerHelpers.getRouteConfigByPath({ pathName: path });

      if (firstMatch) {
        console.log('>>> firstMatch', firstMatch.productPath);

        // if (isPassSearch && isSearch) {
        // redirect(firstMatch.productPath);
        // } else {
        const dynamicBaseName = routerHelpers.dynamicBaseName({ pathName: pathname });
        const updatedPath = `${dynamicBaseName}/${firstMatch.productPath}`;
        console.log('>>> test: navigate product', search, hash);
        // return navigate((isPassSearchHash && `${updatedPath}${search || '?frank=test'}${hash}`) || updatedPath, options);
        return navigate((isPassSearchHash && `${updatedPath}${search}`) || updatedPath, options);
        // }
        // return;
      }

      console.log('>>> test: navigate passthrou');
      return navigate((isPassSearchHash && `${path}${(isSearch && search) || ''}${hash}`) || path, options);
      /*
      if (isPassSearch && isSearch) {
        // redirect(path);
      } else {
        navigate(path, options);
      }
      */
    },
    [hash, isSearch, navigate, pathname, search] // redirect]
  );
};

/**
 * Route context wrapper for useParams
 *
 * @param {object} options
 * @param {Function} options.useRouterContext
 * @returns {*}
 */
/*
const useParams = ({ useRouterContext: useAliasRouterContext = useRouterContext } = {}) => {
  const { useParams: useAliasParams } = useAliasRouterContext();
  return useAliasParams();
};
*/

/**
 * Search parameter, return
 *
 * @param {object} options
 * @param {Function} options.useRouterContext
 * @param options.useSearchParams
 * @param options.useLocation
 * @returns {Array}
 */
// const useSearchParams = ({ useRouterContext: useAliasRouterContext = useRouterContext } = {}) => {
const useSearchParams = ({
  useSearchParams: useAliasSearchParams = useRRDSearchParams,
  useLocation: useAliasLocation = useLocation
} = {}) => {
  // const { useSearchParams: useAliasSearchParams, useLocation: useAliasLocation } = useAliasRouterContext();
  const { search } = useAliasLocation();
  const [, setAliasSearchParams] = useAliasSearchParams();
  // const { decodeURIComponent, URLSearchParams } = window;

  /**
   * Parse a location search, using a set
   *
   * @param {string|*} currentSearch
   * @returns {{}}
   */
  /*
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
  */

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
      Object.assign(updatedSearch, routerHelpers.parseSearchParams(currentSearch), updatedQuery);
    } else {
      updatedSearch = updatedQuery;
    }

    setAliasSearchParams(updatedSearch);
  };

  return [routerHelpers.parseSearchParams(search), setSearchParams];
};

const context = {
  // RouterContext,
  // DEFAULT_CONTEXT,
  useLocation,
  useNavigate,
  useParams,
  useRedirect,
  // useResolvedPath,
  // useRouterContext,
  useRouteDetail,
  useSearchParams
};

export {
  context as default,
  context,
  // RouterContext,
  // DEFAULT_CONTEXT,
  useLocation,
  useNavigate,
  useParams,
  useRedirect,
  // useResolvedPath,
  // useRouterContext,
  useRouteDetail,
  useSearchParams
};
