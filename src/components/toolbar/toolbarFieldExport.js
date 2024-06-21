import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { ExportIcon } from '@patternfly/react-icons';
import { useMount } from 'react-use';
import { reduxActions, storeHooks } from '../../redux';
import { useProduct, useProductExportQuery } from '../productView/productViewContext';
import { Select, SelectPosition, SelectButtonVariant } from '../form/select';
import {
  PLATFORM_API_EXPORT_APPLICATION_TYPES as APP_TYPES,
  PLATFORM_API_EXPORT_CONTENT_TYPES as FIELD_TYPES,
  PLATFORM_API_EXPORT_RESOURCE_TYPES as RESOURCE_TYPES,
  PLATFORM_API_EXPORT_POST_TYPES as POST_TYPES,
  PLATFORM_API_EXPORT_SOURCE_TYPES as SOURCE_TYPES
} from '../../services/platform/platformConstants';
import { translate } from '../i18n/i18n';
import { dateHelpers, helpers } from '../../common';

/**
 * A standalone export select/dropdown filter and download hooks.
 *
 * @memberof Toolbar
 * @module ToolbarFieldExport
 */

/**
 * Select field options.
 *
 * @type {Array<{title: React.ReactNode, value: string, selected: boolean}>}
 */
const toolbarFieldOptions = Object.values(FIELD_TYPES).map(type => ({
  title: translate('curiosity-toolbar.label', { context: ['export', type] }),
  value: type,
  selected: false
}));

/**
 * Aggregated export status
 *
 * @param {object} options
 * @param {Function} options.useProduct
 * @param {Function} options.useSelector
 * @returns {{isProductPending: boolean, productPendingFormats: Array<string>}}
 */
const useExportStatus = ({
  useProduct: useAliasProduct = useProduct,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector
} = {}) => {
  const { productId } = useAliasProduct();
  const { isPending, pending } = useAliasSelector(({ app }) => app?.exports?.[productId], {});

  const pendingProductFormats = [];
  const isProductPending = isPending || false;

  if (isProductPending) {
    const pendingList = pending;
    if (Array.isArray(pendingList)) {
      pendingProductFormats.push(...pendingList.map(({ format: productFormat }) => productFormat));
    }
  }

  return {
    isProductPending,
    pendingProductFormats
  };
};

/**
 * Apply an export hook for a post with download, and a global polling status with download.
 *
 * @param {object} options
 * @param {Function} options.createExport
 * @param {Function} options.getExistingExportsStatus
 * @param {Function} options.useDispatch
 * @returns {{createExport: Function, checkAllExports: Function, getAllExports: Function}}
 */
const useExport = ({
  createExport: createAliasExport = reduxActions.platform.createExport,
  getExistingExportsStatus: getAliasExistingExportsStatus = reduxActions.platform.getExistingExportsStatus,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch
} = {}) => {
  const dispatch = useAliasDispatch();

  /**
   * Get a global export status. Pre-step for polling.
   */
  const checkAllExports = useCallback(
    () => getAliasExistingExportsStatus()(dispatch),
    [dispatch, getAliasExistingExportsStatus]
  );

  /**
   * Create an export then download. Automatically sets up polling until the file(s) are ready.
   */
  const createExport = useCallback((id, data) => createAliasExport(id, data)(dispatch), [createAliasExport, dispatch]);

  return {
    checkAllExports,
    createExport
  };
};

/**
 * On select update export.
 *
 * @param {object} options
 * @param {Function} options.useExport
 * @param {Function} options.useProduct
 * @param {Function} options.useProductExportQuery
 * @returns {Function}
 */
const useOnSelect = ({
  useExport: useAliasExport = useExport,
  useProduct: useAliasProduct = useProduct,
  useProductExportQuery: useAliasProductExportQuery = useProductExportQuery
} = {}) => {
  const { createExport } = useAliasExport();
  const { productId } = useAliasProduct();
  const exportQuery = useAliasProductExportQuery();

  return ({ value = null } = {}) => {
    const sources = [
      {
        [SOURCE_TYPES.APPLICATION]: APP_TYPES.SUBSCRIPTIONS,
        [SOURCE_TYPES.RESOURCE]: RESOURCE_TYPES.SUBSCRIPTIONS,
        [SOURCE_TYPES.FILTERS]: {
          ...exportQuery
        }
      }
    ];

    createExport(productId, {
      [POST_TYPES.EXPIRES_AT]: dateHelpers
        .setMillisecondsFromDate({
          ms: helpers.CONFIG_EXPORT_EXPIRE
        })
        .toISOString(),
      [POST_TYPES.FORMAT]: value,
      [POST_TYPES.NAME]: `${helpers.CONFIG_EXPORT_SERVICE_NAME_PREFIX}-${productId}`,
      [POST_TYPES.SOURCES]: sources
    });
  };
};

/**
 * Display an export/download field with options. Check and download available exports.
 *
 * @fires onSelect
 * @param {object} props
 * @param {Array} props.options
 * @param {string} props.position
 * @param {Function} props.t
 * @param {Function} props.useExport
 * @param {Function} props.useExportStatus
 * @param {Function} props.useOnSelect
 * @returns {React.ReactNode}
 */
const ToolbarFieldExport = ({
  options,
  position,
  t,
  useExport: useAliasExport,
  useExportStatus: useAliasExportStatus,
  useOnSelect: useAliasOnSelect
}) => {
  const { isProductPending, pendingProductFormats = [] } = useAliasExportStatus();
  const { checkAllExports } = useAliasExport();
  const onSelect = useAliasOnSelect();
  const updatedOptions = options.map(option => ({
    ...option,
    title:
      (((isProductPending && !pendingProductFormats?.length) ||
        (isProductPending && pendingProductFormats?.includes(option.value))) &&
        t('curiosity-toolbar.label', { context: ['export', 'loading'] })) ||
      option.title,
    selected:
      (isProductPending && !pendingProductFormats?.length) ||
      (isProductPending && pendingProductFormats?.includes(option.value)),
    isDisabled:
      (isProductPending && !pendingProductFormats?.length) ||
      (isProductPending && pendingProductFormats?.includes(option.value))
  }));

  useMount(() => {
    checkAllExports();
  });

  return (
    <Select
      title={t('curiosity-toolbar.placeholder', { context: 'export' })}
      isDropdownButton
      aria-label={t('curiosity-toolbar.placeholder', { context: 'export' })}
      onSelect={onSelect}
      options={updatedOptions}
      placeholder={t('curiosity-toolbar.placeholder', { context: 'export' })}
      position={position}
      data-test="toolbarFieldExport"
      toggleIcon={<ExportIcon />}
      buttonVariant={SelectButtonVariant.plain}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{useOnSelect: Function, t: Function, useExportStatus: Function, options: Array, useExport: Function,
 *     position: string}}
 */
ToolbarFieldExport.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node,
      value: PropTypes.any,
      selected: PropTypes.bool
    })
  ),
  position: PropTypes.string,
  t: PropTypes.func,
  useExport: PropTypes.func,
  useExportStatus: PropTypes.func,
  useOnSelect: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useOnSelect: Function, t: translate, useExportStatus: Function, options: Array, useExport: Function,
 *     position: string}}
 */
ToolbarFieldExport.defaultProps = {
  options: toolbarFieldOptions,
  position: SelectPosition.left,
  t: translate,
  useExport,
  useExportStatus,
  useOnSelect
};

export {
  ToolbarFieldExport as default,
  ToolbarFieldExport,
  toolbarFieldOptions,
  useExport,
  useExportStatus,
  useOnSelect
};
