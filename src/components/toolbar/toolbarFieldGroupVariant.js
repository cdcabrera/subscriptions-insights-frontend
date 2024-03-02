import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useMount, useShallowCompareEffect } from 'react-use';
import { Toolbar as PfToolbar, ToolbarContent, ToolbarItem, ToolbarItemVariant } from '@patternfly/react-core';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import { useProduct } from '../productView/productViewContext';
import { Select, SelectPosition } from '../form/select';
import { translate } from '../i18n/i18n';
import { routerContext } from '../router';

/**
 * A toolbar product configuration select filter requiring a toolbar component parent.
 *
 * @memberof Toolbar
 * @module ToolbarFieldGroupVariant
 */

const useGroupVariantsResponse = ({
  useRouteDetail: useAliasRouteDetail = routerContext.useRouteDetail,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
  // useSelector: useAliasSelector = storeHooks.reactRedux.useSelector
} = {}) => {
  const { firstMatch } = useAliasRouteDetail();
  const productGroup = firstMatch?.productGroup;
  const response = useAliasSelectorsResponse(({ app }) => app?.config);

  console.log('>>>>', productGroup, response);

  return response;
  /*
   *return useMemo(() => {
   *  if (response?.[productGroup]) {
   *    return response[productGroup];
   *  }
   *  return {};
   *}, [response, productGroup]);
   */
};

const useGroupVariants = ({
  getUiConfiguration = reduxActions.rhsm.getUiConfiguration,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useRouteDetail: useAliasRouteDetail = routerContext.useRouteDetail,
  useGroupVariantsResponse: useAliasGroupVariantsResponse = useGroupVariantsResponse,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const { firstMatch } = useAliasRouteDetail();
  const productGroup = firstMatch?.productGroup;
  // const response = useAliasGroupVariantsResponse();
  const response = useAliasSelectorsResponse(({ app }) => app?.config);
  const dispatch = useAliasDispatch();

  // console.log('>>>>> USE GROUP VARS', useAliasGroupVariantsResponse, dispatch, getUiConfiguration);
  /*
   * const getConfig = useCallback(id => {
   *  getUiConfiguration(id)(dispatch);
   * }, [getUiConfiguration, dispatch]);
   */

  useShallowCompareEffect(() => {
    if (productGroup) {
      getUiConfiguration(productGroup)(dispatch);
    }
  }, [dispatch, productGroup, getUiConfiguration]);

  return {
    ...response,
    data: (Array.isArray(response.data) && response.data.length <= 1 && response.data[0]) || response.data
  };
};

/**
 * Generate select field options from config. Sorted by title string.
 *
 * @param {object} options
 * @param {Function} options.t
 * @param {Function} options.useRouteDetail
 * @param {Function} options.useGroupVariants
 * @returns {Function}
 */
const useToolbarFieldOptions = ({
  t = translate,
  useRouteDetail: useAliasRouteDetail = routerContext.useRouteDetail,
  useGroupVariants: useAliasGroupVariants = useGroupVariants
} = {}) => {
  const { firstMatch } = useAliasRouteDetail();
  const options = [];
  const { pending, fulfilled, data } = useAliasGroupVariants();

  if (fulfilled && Array.isArray(data?.data?.variants)) {
    data.data.variants.forEach(variant => {
      options.push({
        title: t('curiosity-toolbar.label', { context: ['groupVariant', variant] }),
        value: variant,
        selected: variant === firstMatch?.productId
      });
    });
  }

  return {
    isLoading: pending === true,
    isComplete: fulfilled === true,
    options: options.sort(({ title: titleA }, { title: titleB }) => titleA.localeCompare(titleB))
  };
};

/**
 * On select update.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @returns {Function}
 */
const useOnSelect = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { productGroup } = useAliasProduct();
  const dispatch = useAliasDispatch();

  return ({ value = null } = {}) => {
    dispatch([
      {
        type: reduxTypes.app.SET_PRODUCT_VARIANT_QUERY_RESET_ALL,
        productGroup
      },
      {
        type: reduxTypes.app.SET_PRODUCT_VARIANT,
        variant: value,
        productGroup
      }
    ]);
  };
};

/**
 * Display a product configuration field with generated options.
 *
 * @fires onSelect
 * @param {object} props
 * @param {boolean} props.isFilter
 * @param {boolean} props.isStandalone
 * @param {string} props.position
 * @param {Function} props.t
 * @param {Function} props.useOnSelect
 * @param {Function} props.useProduct
 * @param {Function} props.useSelector
 * @param {Function} props.useToolbarFieldOptions
 * @returns {React.ReactNode}
 */
const ToolbarFieldGroupVariant = ({
  isFilter,
  isStandalone,
  position,
  t,
  useOnSelect: useAliasOnSelect,
  useProduct: useAliasProduct,
  useSelector: useAliasSelector,
  useToolbarFieldOptions: useAliasToolbarFieldOptions
}) => {
  const { productGroup } = useAliasProduct();
  const updatedValue = useAliasSelector(({ view }) => view?.product?.variant?.[productGroup], null);
  const onSelect = useAliasOnSelect();
  const { options } = useAliasToolbarFieldOptions();
  const updatedOptions = options.map(option => ({
    ...option,
    selected: (updatedValue && option.value === updatedValue) || option?.selected
  }));

  if (options?.length <= 1) {
    return null;
  }

  const element = (
    <ToolbarContent className="curiosity-toolbar__content">
      <ToolbarItem variant={ToolbarItemVariant.label}>
        {t('curiosity-toolbar.label', { context: ['groupVariant'] })}{' '}
      </ToolbarItem>
      <Select
        aria-label={t('curiosity-toolbar.placeholder', { context: [isFilter && 'filter', 'groupVariant'] })}
        onSelect={onSelect}
        options={updatedOptions}
        selectedOptions={updatedValue}
        placeholder={t('curiosity-toolbar.placeholder', { context: [isFilter && 'filter', 'groupVariant'] })}
        position={position}
        maxHeight={310}
        data-test="toolbarFieldGroupVariant"
      />
    </ToolbarContent>
  );

  return (
    (isStandalone && (
      <PfToolbar
        id="curiosity-toolbar"
        className="curiosity-toolbar pf-m-toggle-group-container ins-c-primary-toolbar"
        collapseListedFiltersBreakpoint="sm"
      >
        {element}
      </PfToolbar>
    )) ||
    element
  );
};

/**
 * Prop types.
 *
 * @type {{useOnSelect: Function, useProduct: Function, t: Function, useSelector: Function, isFilter: boolean,
 *     isStandalone: boolean, position: string, useToolbarFieldOptions: Function}}
 */
ToolbarFieldGroupVariant.propTypes = {
  isFilter: PropTypes.bool,
  isStandalone: PropTypes.bool,
  position: PropTypes.string,
  t: PropTypes.func,
  useOnSelect: PropTypes.func,
  useProduct: PropTypes.func,
  useSelector: PropTypes.func,
  useToolbarFieldOptions: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useOnSelect: Function, useProduct: Function, t: translate, useSelector: Function, isFilter: boolean,
 *     isStandalone: boolean, position: string, useToolbarFieldOptions: Function}}
 */
ToolbarFieldGroupVariant.defaultProps = {
  isFilter: false,
  isStandalone: false,
  position: SelectPosition.left,
  t: translate,
  useOnSelect,
  useProduct,
  useSelector: storeHooks.reactRedux.useSelector,
  useToolbarFieldOptions
};

export { ToolbarFieldGroupVariant as default, ToolbarFieldGroupVariant, useOnSelect, useToolbarFieldOptions };
