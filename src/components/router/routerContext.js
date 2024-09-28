import { useCallback, useEffect, useState } from 'react';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useShallowCompareEffect } from 'react-use';
import { routerHelpers } from './routerHelpers';
import { helpers } from '../../common/helpers';
import { storeHooks, reduxTypes } from '../../redux';
import { translate } from '../i18n/i18n';
import { useLocation } from '../../hooks/useWindow';

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
 * @param options.windowLocation
 * @returns {{_id, search, hash}}
 */
/*
 *const useLocation = ({
 *  useLocation: useAliasLocation = useLocationRU,
 *  windowLocation: aliasWindowLocation = window.location
 *} = {}) => {
 *  useAliasLocation();
 *  const windowLocation = aliasWindowLocation;
 *  const [updatedLocation, setUpdatedLocation] = useState({});
 *
 *  useEffect(() => {
 *    const _id = helpers.generateHash(windowLocation);
 *    console.log('>>>> USE LOCATION SET ID', updatedLocation?._id, _id);
 *
 *    if (updatedLocation?._id !== _id) {
 *      setUpdatedLocation(() => ({
 *        ...windowLocation,
 *        _id,
 *        updateLocation: Function.prototype
 *      }));
 *    }
 *  }, [updatedLocation?._id, windowLocation, windowLocation.pathname]);
 *
 *  console.log('>>>> USE LOCATION', windowLocation.pathname);
 *  console.log('>>>> USE LOCATION', updatedLocation.pathname);
 *  return updatedLocation;
 *};
 */
/*
 *const useLocation = ({ windowLocation: aliasWindowLocation = window.location } = {}) => {
 *  const output = useWindowLocation();
 *  console.log('>>>> USE ROUTER LOCATION', output?.pathname);
 *
 *  useMount(() => {
 *    console.log('>>>> MOUNT MOUNT ROUTER LOCATION');
 *  });
 *
 *  useEffect(() => {
 *    console.log('>>>> MOUNT ROUTER LOCATION');
 *  }, []);
 *};
 */

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
  const dispatch = useAliasDispatch();
  const { search = '', hash = '' } = useAliasLocation();

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
 * Initialize and store a product path, parameter, in a "state" update parallel to variant detail.
 * We're opting to use "window.location.pathname" directly because its faster.
 * and returns a similar structured value as useParam.
 *
 * @param {object} options
 * @param {Function} options.useSelector
 * @param {Function} options.useDispatch
 * @param {Function} options.useLocation
 * @param options.disableIsClosestMatch
 * @param options.useSelectors
 * @returns {*|string}
 */
const useSetRouteProduct = ({
  disableIsClosestMatch = helpers.DEV_MODE === true,
  /*
   * useSelector: useAliasSelector = storeHooks.reactRedux.useSelectors,
   * useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
   */
  useLocation: useAliasLocation = useLocation,
  useSelectors: useAliasSelectors = storeHooks.reactRedux.useSelectors
} = {}) => {
  const [product, setProduct] = useState({});
  const { pathname: productPath } = useAliasLocation();
  const [productVariant] = useAliasSelectors([({ view }) => view?.product?.variant]);
  /*
   * const dispatch = useAliasDispatch();
   * const [updatedPath] = useAliasSelector([({ view }) => view?.product?.config]);
   */
  console.log('>>>>>> USE SET ROUTE PRODUCT', product);

  useShallowCompareEffect(() => {
    console.log();
    // setProduct({ productPath, productVariant });
    let routeConfig = routerHelpers.getRouteConfigByPath({
      pathName: productPath,
      isIgnoreClosest: disableIsClosestMatch
    });

    if (productVariant) {
      const selectedVariant = productVariant?.[routeConfig?.firstMatch?.productGroup];
      if (selectedVariant) {
        routeConfig = routerHelpers.getRouteConfigByPath({
          pathName: selectedVariant,
          isIgnoreClosest: disableIsClosestMatch
        });
      }
    }

    const { configs, firstMatch, isClosest, ...config } = routeConfig;

    console.log('>>>>>>>> SET PRODUCT productGroup', firstMatch?.productGroup, routerHelpers.dynamicPath());
    console.log('>>>>>>>> SET PRODUCT isClosest', isClosest);
    console.log('>>>>>>>> SET PRODUCT is productPath', productPath, productPath === undefined);
    console.log(
      '>>>>>>>> SET PRODUCT disableClosestMatch',
      (disableIsClosestMatch && isClosest) || (disableIsClosestMatch && routerHelpers.dynamicPath() === '/')
    );

    setProduct(() => ({
      ...config,
      firstMatch,
      isClosest,
      productGroup: firstMatch?.productGroup,
      productConfig: (configs?.length && configs) || [],
      productPath,
      productVariant,
      disableIsClosestMatch:
        (disableIsClosestMatch && isClosest) || (disableIsClosestMatch && routerHelpers.dynamicPath() === '/')
    }));
  }, [disableIsClosestMatch, productPath, productVariant]);

  return product;
  /*
   *useEffect(() => {
   *  if (productPath && productPath !== updatedPath) {
   *    dispatch({
   *      type: reduxTypes.app.SET_PRODUCT,
   *      config: productPath
   *    });
   *  }
   *}, [updatedPath, dispatch, productPath]);
   *
   *return updatedPath;
   */
};

/**
 * Get a route detail from "state". Consume useSetRouteProduct and set basis for product
 * configuration context.
 *
 * @param {object} options
 * @param {boolean} options.disableIsClosestMatch
 * @param {Function} options.t
 * @param {Function} options.useChrome
 * @param {Function} options.useSelectors
 * @param {Function} options.useLocation
 * @param options.useSetRouteProduct
 * @returns {{baseName: string, errorRoute: object}}
 */
const useRouteDetail = ({
  t = translate,
  useChrome: useAliasChrome = useChrome,
  // useSelectors: useAliasSelectors = storeHooks.reactRedux.useSelectors,
  useSetRouteProduct: useAliasSetRouteProduct = useSetRouteProduct
  // useLocation: useAliasLocation = useLocation
} = {}) => {
  // const { pathname: productPath } = useAliasLocation();
  const product = useAliasSetRouteProduct();
  console.log('>>>>>> USE ROUTE DETAIL', product);
  const { getBundleData = helpers.noop, updateDocumentTitle = helpers.noop } = useAliasChrome();
  const bundleData = getBundleData();
  const productGroup = product?.productGroup;
  /*
   * const [productVariant] = useAliasSelectors([({ view }) => view?.product?.variant]);
   * const [detail, setDetail] = useState({});
   */

  useEffect(() => {
    // Set document title, remove pre-baked suffix
    updateDocumentTitle(
      `${t(`curiosity-view.title`, {
        appName: helpers.UI_DISPLAY_NAME,
        context: productGroup
      })} - ${helpers.UI_DISPLAY_NAME}${(bundleData?.bundleTitle && ` | ${bundleData?.bundleTitle}`) || ''}`,
      true
    );

    /*
     * disableIsClosestMatch, firstMatch, productGroup
     * Set route detail
     */
    /*
     *setDetail(() => ({
     *  allConfigs,
     *  availableVariants,
     *  firstMatch,
     *  isClosest,
     *  productGroup: firstMatch?.productGroup,
     *  productConfig: (configs?.length && configs) || [],
     *  productPath,
     *  // productVariant,
     *  disableIsClosestMatch: disableIsClosestMatch && isClosest
     *}));
     */

    /*
     * const updatedVariantPath = productPath;
     * const hashPath = helpers.generateHash({ productPath, productVariant });
     */

    /*
     *if (updatedVariantPath && detail?._passed !== hashPath) {
     *  // Get base configuration match
     *  let routeConfig = routerHelpers.getRouteConfigByPath({
     *    pathName: updatedVariantPath
     *  });
     *
     *  // Determine variant to display, if any
     *  if (productVariant) {
     *    const selectedVariant = productVariant?.[routeConfig?.firstMatch?.productGroup];
     *
     *    if (selectedVariant) {
     *      routeConfig = routerHelpers.getRouteConfigByPath({
     *        pathName: selectedVariant
     *      });
     *    }
     *  }
     *
     *  const { allConfigs, availableVariants, configs, firstMatch, isClosest } = routeConfig;
     *
     *  // Set document title, remove pre-baked suffix
     *  updateDocumentTitle(
     *    `${t(`curiosity-view.title`, {
     *      appName: helpers.UI_DISPLAY_NAME,
     *      context: firstMatch?.productGroup
     *    })} - ${helpers.UI_DISPLAY_NAME}${(bundleData?.bundleTitle && ` | ${bundleData?.bundleTitle}`) || ''}`,
     *    true
     *  );
     *
     *  // Set route detail
     *  setDetail({
     *    _passed: hashPath,
     *    allConfigs,
     *    availableVariants,
     *    firstMatch,
     *    errorRoute: routerHelpers.errorRoute,
     *    isClosest,
     *    productGroup: firstMatch?.productGroup,
     *    productConfig: (configs?.length && configs) || [],
     *    productPath,
     *    productVariant,
     *    disableIsClosestMatch: disableIsClosestMatch && isClosest
     *  });
     *}
     */
  }, [
    bundleData?.bundleTitle,
    /*
     * detail?._passed,
     * disableIsClosestMatch,
     */
    productGroup,
    /*
     * productPath,
     * productVariant,
     */
    t,
    updateDocumentTitle
  ]);

  return product;
};

const context = {
  useNavigate,
  useRouteDetail,
  useSetRouteProduct
};

export { context as default, context, useNavigate, useRouteDetail, useSetRouteProduct };
