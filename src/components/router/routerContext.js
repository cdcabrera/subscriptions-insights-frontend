import { useCallback, useEffect, useState } from 'react';
import { useSearchParams as useRRDSearchParams } from 'react-router-dom';
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
 * Combine react-router-dom useLocation with actual window location.
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
  const location = useAliasLocation();
  const windowLocation = aliasWindowLocation;
  const [updatedLocation, setUpdatedLocation] = useState({});

  useEffect(() => {
    const _id = helpers.generateHash(windowLocation);
    if (updatedLocation?._id !== _id) {
      setUpdatedLocation({
        ...location,
        ...windowLocation,
        _id,
        hash: location?.hash || '',
        search: location?.search || ''
      });
    }
  }, [location, updatedLocation?._id, windowLocation]);

  return updatedLocation;
};

/**
 * useNavigate wrapper. Leverage useNavigate for a modified router with parallel "state"
 * update. Dispatches the same type leveraged by the initialize hook, useSetRouteDetail.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useLocation
 * @returns {Function}
 */
const useNavigate = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useLocation: useAliasLocation = useLocation
} = {}) => {
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

        return window.history.pushState(
          {},
          '',
          `${routerHelpers.pathJoin('.', firstMatch?.productPath)}${search}${hash}`,
          options
        );
      }

      return window.history.pushState({}, '', (pathName && `${pathName}${search}${hash}`) || pathLocation, options);
    },
    [dispatch, hash, search]
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
 * @param {Function} options.useSelector
 * @param {Function} options.useSetRouteDetail
 * @returns {{baseName: string, errorRoute: object}}
 */
const useRouteDetail = ({
  disableIsClosest = helpers.DEV_MODE === true,
  t = translate,
  useChrome: useAliasChrome = useChrome,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelectors,
  useSetRouteDetail: useAliasSetRouteDetail = useSetRouteDetail
} = {}) => {
  useAliasSetRouteDetail();
  const { updateDocumentTitle = helpers.noop } = useAliasChrome();
  const [productPath] = useAliasSelector([({ view }) => view?.product?.config]);
  const [detail, setDetail] = useState({});

  useEffect(() => {
    if (productPath && detail?._passed !== productPath) {
      const { allConfigs, configs, firstMatch, isClosest } = routerHelpers.getRouteConfigByPath({
        pathName: productPath
      });

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
        productPath,
        disableIsClosest: disableIsClosest && isClosest
      });
    }
  }, [detail?._passed, disableIsClosest, productPath, t, updateDocumentTitle]);

  return detail;
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

      setAliasSearchParams(updatedSearch);
    },
    [search, setAliasSearchParams]
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
