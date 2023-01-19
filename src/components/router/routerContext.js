import { useCallback } from 'react';
import {
  useLocation,
  useNavigate as useRRDNavigate,
  useParams,
  useResolvedPath,
  useSearchParams as useRRDSearchParams
} from 'react-router-dom';
import { pathJoin, routerHelpers } from './routerHelpers';

/**
 * Return a callback for redirecting, and replacing, towards a new path, or url.
 *
 * @callback redirect
 * @param {object} options
 * @param {Function} options.useLocation
 * @param {Function} options.useResolvedPath
 * @returns {(function(*): void)|*}
 */
const useRedirect = ({
  useLocation: useAliasLocation = useLocation,
  useResolvedPath: useAliasResolvedPath = useResolvedPath
} = {}) => {
  const { pathname } = useAliasResolvedPath();
  const { hash = '', search = '' } = useAliasLocation() || {};

  /**
   * redirect
   *
   * @param {string} route
   * @returns {undefined}
   */
  return useCallback(
    route => {
      const baseName = routerHelpers.dynamicBaseName({ pathName: pathname });
      let isUrl;

      try {
        isUrl = !!new URL(route);
      } catch (e) {
        isUrl = false;
      }

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
 * @param {Function} options.useParams
 * @returns {{baseName: string, errorRoute: object}}
 */
const useRouteDetail = ({
  useRedirect: useAliasRedirect = useRedirect,
  useParams: useAliasParams = useParams
} = {}) => {
  const redirect = useAliasRedirect();
  const { productPath } = useAliasParams();
  const { allConfigs, configs, firstMatch } = routerHelpers.getRouteConfigByPath({ pathName: productPath });

  if (!firstMatch) {
    redirect(routerHelpers.redirectRoute.redirect);
  }

  return {
    allProductConfigs: allConfigs,
    firstMatch,
    errorRoute: routerHelpers.errorRoute,
    productGroup: firstMatch?.productGroup,
    productConfig: (configs?.length && configs) || []
  };
};

/**
 * useNavigate wrapper, apply application config context routing
 *
 * @param {object} options
 * @param {Function} options.useLocation
 * @param {Function} options.useNavigate
 * @param {Function} options.useResolvedPath
 * @returns {Function}
 */
const useNavigate = ({
  useLocation: useAliasLocation = useLocation,
  useNavigate: useAliasNavigate = useRRDNavigate,
  useResolvedPath: useAliasResolvedPath = useResolvedPath
} = {}) => {
  const { search, hash } = useAliasLocation();
  const navigate = useAliasNavigate();
  const { pathname } = useAliasResolvedPath();

  return useCallback(
    (path, { isLeftNav = false, isPassSearchHash = true, ...options } = {}) => {
      if (isLeftNav) {
        return undefined;
      }

      const { firstMatch } = routerHelpers.getRouteConfigByPath({ pathName: path });

      if (firstMatch) {
        const dynamicBaseName = routerHelpers.dynamicBaseName({ pathName: pathname });
        const updatedPath = `${dynamicBaseName}/${firstMatch.productPath}`;

        return navigate((isPassSearchHash && `${updatedPath}${search}${hash}`) || updatedPath, options);
      }

      return navigate((isPassSearchHash && `${path}${search}${hash}`) || path, options);
    },
    [hash, navigate, pathname, search]
  );
};

/**
 * Search parameter, return
 *
 * @param {object} options
 * @param {Function} options.useLocation
 * @param {Function} options.useSearchParams
 * @returns {Array}
 */
const useSearchParams = ({
  useSearchParams: useAliasSearchParams = useRRDSearchParams,
  useLocation: useAliasLocation = useLocation
} = {}) => {
  const { search } = useAliasLocation();
  const [, setAliasSearchParams] = useAliasSearchParams();

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
  useLocation,
  useNavigate,
  useParams,
  useRedirect,
  useRouteDetail,
  useSearchParams
};

export {
  context as default,
  context,
  useLocation,
  useNavigate,
  useParams,
  useRedirect,
  useRouteDetail,
  useSearchParams
};
