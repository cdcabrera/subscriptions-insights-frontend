import { useCallback, useEffect, useState, useMemo } from 'react';
// import { useMount } from 'react-use';
import _isEqual from 'lodash/isEqual';
import {
  useLocation,
  useNavigate as useRRDNavigate,
  useParams as useRRDParams,
  useResolvedPath,
  useSearchParams as useRRDSearchParams
} from 'react-router-dom';
import { pathJoin, routerHelpers } from './routerHelpers';
import { helpers } from '../../common/helpers';

const useParams = ({ useParams: useAliasParams = useRRDParams } = {}) => {
  const params = useAliasParams();
  const [updatedParams, setUpdatedParams] = useState(params);

  useEffect(() => {
    // useShallowCompare
    // useDeepCompare
    if (!_isEqual(updatedParams, params)) {
      console.log('>>>> set params', params);
      setUpdatedParams(params);
    }
  }, [params, updatedParams]);

  return updatedParams;
};

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
  useLocation: useAliasLocation = useLocation
  // useResolvedPath: useAliasResolvedPath = useResolvedPath
} = {}) => {
  // const { pathname } = useAliasResolvedPath();
  const { hash = '', search = '' } = useAliasLocation() || {};

  /**
   * redirect
   *
   * @param {string} route
   * @returns {undefined}
   */
  return useCallback(
    route => {
      // const baseName = routerHelpers.dynamicBaseName({ pathName: pathname });
      const baseName = routerHelpers.dynamicBaseName();
      let isUrl;

      try {
        isUrl = !!new URL(route);
      } catch (e) {
        isUrl = false;
      }

      console.log('>>>> redirect', baseName, hash, search);
      // window.location.replace((isUrl && route) || `${pathJoin(baseName, route)}${search}${hash}`);
      // window.location.href = (isUrl && route) || `${pathJoin(baseName, route)}${search}${hash}`;
      window.location.href = (isUrl && route) || `${pathJoin(baseName, route)}`;
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
 * @param {Function} options.useParams
 * @returns {{baseName: string, errorRoute: object}}
 */
/*
const useRouteDetailBORKEDKEEPSFIRING = ({
  // useRedirect: useAliasRedirect = useRedirect,
  useParams: useAliasParams = useParams
} = {}) => {
  // const redirect = useAliasRedirect();
  // const [detail, setDetail] = useState({});
  const { productPath } = useAliasParams();
  // const updatedProductPath =
  // if (!firstMatch) {
  // redirect(routerHelpers.redirectRoute.redirect);
  // }
  // const productPath = 'satellite';

  console.log('>>> useRouteDetail', productPath);

  return useMemo(() => {
    const { allConfigs, configs, firstMatch } = routerHelpers.getRouteConfigByPath({ pathName: productPath });

    console.log('>>> firing useRouteDetail', firstMatch, productPath);

    return {
      allProductConfigs: allConfigs,
      firstMatch,
      errorRoute: routerHelpers.errorRoute,
      productGroup: firstMatch?.productGroup,
      productConfig: (configs?.length && configs) || []
    };
  }, [productPath]);
};
*/
/*
const useRouteDetailCLOSE = ({
  // useRedirect: useAliasRedirect = useRedirect,
  useParams: useAliasParams = useParams
} = {}) => {
  // const redirect = useAliasRedirect();
  // const [detail, setDetail] = useState({});
  const [routeDetail, setRouteDetail] = useState({});
  const { productPath } = useAliasParams();

  // if (!productPath) {
  // }

  // const updatedProductPath =
  // if (!firstMatch) {
  // redirect(routerHelpers.redirectRoute.redirect);
  // }
  // const productPath = 'satellite';
  useEffect(() => {
    // if (productPath) {
    const { allConfigs, configs, firstMatch } = routerHelpers.getRouteConfigByPath({ pathName: productPath });
    console.log('>>> firing useRouteDetail', firstMatch, productPath);

    setRouteDetail({
      allProductConfigs: allConfigs,
      firstMatch,
      errorRoute: routerHelpers.errorRoute,
      productGroup: firstMatch?.productGroup,
      productConfig: (configs?.length && configs) || []
    });
    // }
  }, [productPath]);

  console.log('>>> useRouteDetail', productPath);
  return routeDetail;
};
*/
const useRouteDetail = ({ useParams: useAliasParams = useParams } = {}) => {
  const { productPath } = useAliasParams();
  const { allConfigs, configs, firstMatch } = routerHelpers.getRouteConfigByPath({ pathName: productPath });

  console.log('>>> useRouteDetail', productPath);

  return useMemo(
    () => ({
      allProductConfigs: allConfigs,
      firstMatch,
      errorRoute: routerHelpers.errorRoute,
      productGroup: firstMatch?.productGroup,
      productConfig: (configs?.length && configs) || []
    }),
    [allConfigs, firstMatch, configs]
  );
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
        // return undefined;
      }

      const { firstMatch } = routerHelpers.getRouteConfigByPath({ pathName: path });

      if (firstMatch) {
        const dynamicBaseName = routerHelpers.dynamicBaseName({ pathName: pathname });
        const updatedPath = `${(helpers.DEV_MODE && '..') || dynamicBaseName}/${firstMatch.productPath}`;

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
