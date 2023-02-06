import { useCallback, useEffect, useState } from 'react';
import {
  useLocation as useLocationRRD,
  useNavigate as useRRDNavigate,
  useSearchParams as useRRDSearchParams
} from 'react-router-dom';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { routerHelpers } from './routerHelpers';
import { helpers } from '../../common/helpers';
import { storeHooks, reduxTypes } from '../../redux';
import { translate } from '../i18n/i18n';

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
  const [updatedLocation, setUpdatedLocation] = useState({});

  useEffect(() => {
    const _id = helpers.generateHash(windowLocation);
    if (updatedLocation?._id !== _id) {
      setUpdatedLocation({
        ...location,
        ...windowLocation,
        _id,
        replace: path => windowLocation.replace(path),
        hash: location?.hash || '',
        set href(path) {
          windowLocation.href = path;
        },
        search: location?.search || ''
      });
    }
  }, [location, updatedLocation?._id, windowLocation]);

  return updatedLocation;
};

/**
 * Return a callback for redirecting, and replacing, towards a new path, or url.
 *
 * @callback redirect
 * @param {object} options
 * @param {Function} options.useLocation
 * @returns {(function(*): void)|*}
 */
const useRedirect = ({ useLocation: useAliasLocation = useLocation } = {}) => {
  const { hash = '', search = '', ...location } = useAliasLocation();

  /**
   * redirect
   *
   * @param {string} route
   * @returns {void}
   */
  return useCallback(
    (route, { isReplace = true } = {}) => {
      const baseName = routerHelpers.dynamicBaseName();
      let isUrl;

      try {
        isUrl = !!new URL(route);
      } catch (e) {
        isUrl = false;
      }

      const updatedRoute = (isUrl && route) || `${routerHelpers.pathJoin(baseName, route)}${search}${hash}`;

      if (isReplace) {
        location.replace(updatedRoute);
        return;
      }

      location.href = updatedRoute;
    },
    [hash, location, search]
  );
};

/**
 * Store product path, parameter, in state.
 *
 * @param {object} options
 * @param {Function} options.useSelector
 * @param {Function} options.useDispatch
 * @returns {*|string}
 */
const useSetRouteDetail = ({
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelectors,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch
} = {}) => {
  const dispatch = useAliasDispatch();
  const [updatedPath] = useAliasSelector([({ view }) => view?.product?.config]);
  const productPath = window.location.pathname;

  useEffect(() => {
    if (productPath && updatedPath !== productPath) {
      dispatch({
        type: reduxTypes.app.SET_PRODUCT,
        config: productPath
      });
    }
  }, [updatedPath, dispatch, productPath]);

  return updatedPath;
};

/**
 * Get a route detail configuration from state.
 *
 * @param {object} options
 * @param {Function} options.t
 * @param {Function} options.useChrome
 * @param {Function} options.useSelector
 * @returns {{baseName: string, errorRoute: object}}
 */
const useRouteDetail = ({
  t = translate,
  useChrome: useAliasChrome = useChrome,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelectors
} = {}) => {
  const { updateDocumentTitle = helpers.noop } = useAliasChrome();
  const [productPath] = useAliasSelector([({ view }) => view?.product?.config]);
  const [detail, setDetail] = useState({});
  console.log('>>> use route detail', productPath);

  useEffect(() => {
    console.log('>>> ATTEMPT TO SET ROUTE DETAIL', detail?._passed !== productPath, detail?._passed, productPath);
    if (productPath && detail?._passed !== productPath) {
      const { allConfigs, configs, firstMatch, isClosest } = routerHelpers.getRouteConfigByPath({
        pathName: productPath
      });
      console.log('>>> SET ROUTE DETAIL', firstMatch?.productGroup, detail?._passed, productPath);

      // Set document title
      updateDocumentTitle(
        `${helpers.UI_DISPLAY_NAME}: ${t(`curiosity-view.title`, {
          appName: helpers.UI_DISPLAY_NAME,
          context: firstMatch?.productGroup
        })}`
      );
      // Set route detail
      setDetail({
        _passed: productPath,
        allConfigs,
        firstMatch,
        errorRoute: routerHelpers.errorRoute,
        isClosest,
        productGroup: firstMatch?.productGroup,
        productConfig: (configs?.length && configs) || [],
        productPath
      });
    }
  }, [detail?._passed, productPath, t, updateDocumentTitle]);

  return detail;
};

/**
 * useNavigate wrapper, apply application config context routing
 *
 * @param {object} options
 * @param {Function} options.useLocation
 * @param {Function} options.useNavigate
 * @returns {Function}
 */
const useNavigate = ({
  useLocation: useAliasLocation = useLocation,
  useNavigate: useAliasNavigate = useRRDNavigate
} = {}) => {
  const { search, hash } = useAliasLocation();
  const navigate = useAliasNavigate();

  return useCallback(
    (pathLocation, options) => {
      const pathName = (typeof pathLocation === 'string' && pathLocation) || pathLocation?.pathname;
      const { firstMatch } = routerHelpers.getRouteConfigByPath({ pathName });

      return navigate(
        (firstMatch?.productPath && `${routerHelpers.pathJoin('.', firstMatch?.productPath)}${search}${hash}`) ||
          (pathName && `${pathName}${search}${hash}`) ||
          pathLocation,
        options
      );
    },
    [hash, navigate, search]
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
  const setSearchParams = useCallback(
    (updatedQuery, { isMerged = true, currentSearch = search } = {}) => {
      let updatedSearch = {};

      if (isMerged) {
        Object.assign(updatedSearch, routerHelpers.parseSearchParams(currentSearch), updatedQuery);
      } else {
        updatedSearch = updatedQuery;
      }

      setAliasSearchParams(updatedSearch);
    },
    [search, setAliasSearchParams]
  );

  return [routerHelpers.parseSearchParams(search), setSearchParams];
};

const context = {
  useLocation,
  useNavigate,
  useRedirect,
  useSetRouteDetail,
  useRouteDetail,
  useSearchParams
};

export {
  context as default,
  context,
  useLocation,
  useNavigate,
  useRedirect,
  useSetRouteDetail,
  useRouteDetail,
  useSearchParams
};
