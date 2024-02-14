import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { ExportIcon } from '@patternfly/react-icons';
import { reduxActions, storeHooks } from '../../redux';
import { useProduct, useProductInventoryHostsQuery } from '../productView/productViewContext';
import { Select, SelectPosition, SelectButtonVariant } from '../form/select';
import {
  PLATFORM_API_EXPORT_APPLICATION_TYPES as APP_TYPES,
  PLATFORM_API_EXPORT_CONTENT_TYPES as FIELD_TYPES,
  PLATFORM_API_EXPORT_FILENAME_PREFIX as EXPORT_PREFIX,
  PLATFORM_API_EXPORT_RESOURCE_TYPES as RESOURCE_TYPES
} from '../../services/platform/platformConstants';
import { translate } from '../i18n/i18n';

/**
 * A standalone export select/dropdown filter.
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
 * @returns {{isPolling: boolean, isError: boolean, isProductPolling: boolean, isMountCompleted: boolean,
 *     errorMessage: undefined, productPollingFormats: Array<any>, isCompleted: boolean}}
 */
const useExportStatus = () => ({
  errorMessage: undefined,
  isCompleted: false,
  isError: false,
  isMountCompleted: false,
  isPolling: false,
  isProductPolling: false,
  productPollingFormats: []
});

/**
 * On select update export.
 *
 * @param {object} options
 * @param {Function} options.createExport
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @param {Function} options.useProductInventoryQuery
 * @returns {Function}
 */
const useOnSelect = ({
  createExport = reduxActions.platform.createExport,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct,
  useProductInventoryQuery: useAliasProductInventoryQuery = useProductInventoryHostsQuery
} = {}) => {
  const dispatch = useAliasDispatch();
  const { productId } = useAliasProduct();
  const inventoryQuery = useAliasProductInventoryQuery();

  return useCallback(
    ({ value = null } = {}) => {
      const sources = [
        {
          application: APP_TYPES.SUBSCRIPTIONS,
          resource: RESOURCE_TYPES.SUBSCRIPTIONS,
          filters: {
            ...inventoryQuery,
            productId
          }
        }
      ];

      const data = { format: value, name: `${EXPORT_PREFIX}-${productId}`, sources };
      createExport({ data })(dispatch);
    },
    [createExport, dispatch, inventoryQuery, productId]
  );
};

/**
 * Display an export/download field with options.
 *
 * @fires onSelect
 * @param {object} props
 * @param {Array} props.options
 * @param {string} props.position
 * @param {Function} props.t
 * @param {Function} props.useExportStatus
 * @param {Function} props.useOnSelect
 * @returns {React.ReactNode}
 */
const ToolbarFieldExport = ({
  options,
  position,
  t,
  useExportStatus: useAliasExportStatus,
  useOnSelect: useAliasOnSelect
}) => {
  const { isProductPolling, productPollingFormats } = useAliasExportStatus();
  const onSelect = useAliasOnSelect();
  const updatedOptions = options.map(option => ({
    ...option,
    title:
      (isProductPolling &&
        productPollingFormats.includes(option.value) &&
        t('curiosity-toolbar.label', { context: ['export', 'loading'] })) ||
      option.title,
    selected: isProductPolling && productPollingFormats.includes(option.value),
    isDisabled: isProductPolling && productPollingFormats.includes(option.value)
  }));

  return (
    <Select
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
 * @type {{useOnSelect: Function, t: Function, options: Array, useExportStatus: Function, position: string}}
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
  useExportStatus: PropTypes.func,
  useOnSelect: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useOnSelect: Function, t: translate, options: Array, useExportStatus: Function, position: string}}
 */
ToolbarFieldExport.defaultProps = {
  options: toolbarFieldOptions,
  position: SelectPosition.left,
  t: translate,
  useExportStatus,
  useOnSelect
};

export { ToolbarFieldExport as default, ToolbarFieldExport, toolbarFieldOptions, useOnSelect };
