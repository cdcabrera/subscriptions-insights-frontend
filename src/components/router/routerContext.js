import { useCallback, useEffect, useState } from 'react';
import { useLocation as useLocationRU } from 'react-use';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { routerHelpers } from './routerHelpers';
import { helpers } from '../../common/helpers';
import { storeHooks, reduxTypes } from '../../redux';
import { translate } from '../i18n/i18n';

/**
 * @memberof Router
 * @module RouterContext
 */

/**
 * Combine react-use useLocation with actual window location.
 * Focused on exposing replace and href.
 *
 * @param {object} options
 * @param {Function} options.useLocation
 * @param {*} options.windowLocation
 * @returns {{_id, search, hash}}
 */
const useLocation = ({
  useLocation: useAliasLocation = useLocationRU,
  windowLocation: aliasWindowLocation = window.location
} = {}) => {
  useAliasLocation();
  const windowLocation = aliasWindowLocation;
  const [updatedLocation, setUpdatedLocation] = useState({});
  const forceUpdateLocation = useCallback(() => {
    const _id = helpers.generateHash(windowLocation);
    if (updatedLocation?._id !== _id) {
      setUpdatedLocation({
        ...windowLocation,
        _id
      });
    }
  }, [updatedLocation?._id, windowLocation]);

  useEffect(() => {
    const _id = helpers.generateHash(windowLocation);
    if (updatedLocation?._id !== _id) {
      setUpdatedLocation({
        ...windowLocation,
        _id,
        updateLocation: forceUpdateLocation
      });
    }
  }, [forceUpdateLocation, updatedLocation?._id, windowLocation]);

  return updatedLocation;
};

/**
 * useNavigate wrapper. Leverage useNavigate for a modified router with parallel "state"
 * update. Dispatches the same type leveraged by the initialize hook, useSetRouteDetail.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useLocation
 * @param {*} options.windowHistory
 * @returns {Function}
 */
const useNavigate = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useLocation: useAliasLocation = useLocation,
  windowHistory: aliasWindowHistory = window.history
} = {}) => {
  const windowHistory = aliasWindowHistory;
  const { search = '', hash = '' } = useAliasLocation();
  const dispatch = useAliasDispatch();

  return useCallback(
    (pathLocation, options) => {
      const pathName = (typeof pathLocation === 'string' && pathLocation) || pathLocation?.pathname;
      const { firstMatch } = routerHelpers.getRouteConfigByPath({ pathName });

      if (firstMatch?.productPath) {
        dispatch({
          type: reduxTypes.app.SET_PRODUCT,
          config: firstMatch?.productPath
        });

        return windowHistory.pushState(
          {},
          '',
          `${routerHelpers.pathJoin(routerHelpers.dynamicBaseName(), firstMatch?.productPath)}${search}${hash}`,
          options
        );
      }

      return windowHistory.pushState({}, '', (pathName && `${pathName}${search}${hash}`) || pathLocation, options);
    },
    [dispatch, hash, search, windowHistory]
  );
};

/**
 * Initialize and store product path, parameter, in a "state" update parallel to routing.
 * We're opting to use "window.location.pathname" directly since it appears to be quicker,
 * and returns a similar structured value as useParam.
 *
 * @param {object} options
 * @param {Function} options.useSelector
 * @param {Function} options.useDispatch
 * @param {Function} options.useLocation
 * @param {*} options.windowLocation
 * @returns {*|string}
 */
const useSetRouteDetail = ({
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelectors,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useLocation: useAliasLocation = useLocation,
  windowLocation: aliasWindowLocation = window.location
} = {}) => {
  useAliasLocation();
  const dispatch = useAliasDispatch();
  const [updatedPath] = useAliasSelector([({ view }) => view?.product?.config]);
  const { pathname: productPath } = aliasWindowLocation;

  useEffect(() => {
    if (productPath && productPath !== updatedPath) {
      dispatch({
        type: reduxTypes.app.SET_PRODUCT,
        config: productPath
      });
    }
  }, [updatedPath, dispatch, productPath]);

  return updatedPath;
};

/**
 * Get a route detail from "state". Consume useSetRouteDetail and set basis for product
 * configuration context.
 *
 * @param {object} options
 * @param {boolean} options.disableIsClosest
 * @param {Function} options.t
 * @param {Function} options.useChrome
 * @param {Function} options.useSelectors
 * @param {Function} options.useSetRouteDetail
 * @returns {{baseName: string, errorRoute: object}}
 */
const useRouteDetail = ({
  disableIsClosest = helpers.DEV_MODE === true,
  t = translate,
  useChrome: useAliasChrome = useChrome,
  useSelectors: useAliasSelectors = storeHooks.reactRedux.useSelectors,
  useSetRouteDetail: useAliasSetRouteDetail = useSetRouteDetail
} = {}) => {
  useAliasSetRouteDetail();
  const { getBundleData = helpers.noop, updateDocumentTitle = helpers.noop } = useAliasChrome();
  const bundleData = getBundleData();
  const [productPath, productVariant] = useAliasSelectors([
    ({ view }) => view?.product?.config,
    ({ view }) => view?.product?.variant
  ]);
  const [detail, setDetail] = useState({});

  useEffect(() => {
    const updatedVariantPath = productPath;
    const hashPath = helpers.generateHash({ productPath, productVariant });

    if (updatedVariantPath && detail?._passed !== hashPath) {
      // Get base configuration match
      let routeConfig = routerHelpers.getRouteConfigByPath({
        pathName: updatedVariantPath
      });

      // Determine variant to display, if any
      if (productVariant) {
        const selectedVariant = productVariant?.[routeConfig?.firstMatch?.productGroup];

        if (selectedVariant) {
          routeConfig = routerHelpers.getRouteConfigByPath({
            pathName: selectedVariant
          });
        }
      }

      const { allConfigs, availableVariants, configs, firstMatch, isClosest } = routeConfig;

      // Set document title, remove pre-baked suffix
      updateDocumentTitle(
        `${t(`curiosity-view.title`, {
          appName: helpers.UI_DISPLAY_NAME,
          context: firstMatch?.productGroup
        })} - ${helpers.UI_DISPLAY_NAME}${(bundleData?.bundleTitle && ` | ${bundleData?.bundleTitle}`) || ''}`,
        true
      );

      // Set route detail
      setDetail({
        _passed: hashPath,
        allConfigs,
        availableVariants,
        firstMatch,
        errorRoute: routerHelpers.errorRoute,
        isClosest,
        productGroup: firstMatch?.productGroup,
        productConfig: (configs?.length && configs) || [],
        productPath,
        productVariant,
        disableIsClosest: disableIsClosest && isClosest
      });
    }
  }, [bundleData?.bundleTitle, detail?._passed, disableIsClosest, productPath, productVariant, t, updateDocumentTitle]);

  return detail;
};

/**
 * Search parameter, return
 *
 * @param {object} options
 * @param {Function} options.useLocation
 * @param {*} options.windowHistory
 * @returns {Array}
 */
const useSearchParams = ({
  useLocation: useAliasLocation = useLocation,
  windowHistory: aliasWindowHistory = window.history
} = {}) => {
  const windowHistory = aliasWindowHistory;
  const { updateLocation, search } = useAliasLocation();

  /**
   * Alias returned React Router Dom useSearchParams hook to something expected.
   * This hook defaults to merging search objects instead of overwriting them.
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

      windowHistory.pushState(
        {},
        '',
        `?${Object.entries(updatedSearch)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')}`
      );

      updateLocation();
    },
    [search, updateLocation, windowHistory]
  );

  return [routerHelpers.parseSearchParams(search), setSearchParams];
};

const context = {
  useLocation,
  useNavigate,
  useRouteDetail,
  useSearchParams,
  useSetRouteDetail
};

export { context as default, context, useLocation, useNavigate, useRouteDetail, useSearchParams, useSetRouteDetail };
