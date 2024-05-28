import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { ExportIcon } from '@patternfly/react-icons';
import { useMount, useShallowCompareEffect } from 'react-use';
import { reduxActions, storeHooks } from '../../redux';
import { useProduct, useProductExportQuery } from '../productView/productViewContext';
import { Select, SelectPosition, SelectButtonVariant } from '../form/select';
import { Tooltip } from '../tooltip/tooltip';
import {
  PLATFORM_API_EXPORT_APPLICATION_TYPES as APP_TYPES,
  PLATFORM_API_EXPORT_CONTENT_TYPES as FIELD_TYPES,
  PLATFORM_API_EXPORT_FILENAME_PREFIX as EXPORT_PREFIX,
  PLATFORM_API_EXPORT_RESOURCE_TYPES as RESOURCE_TYPES,
  PLATFORM_API_EXPORT_STATUS_TYPES
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
 * @param {object} options
 * @param {Function} options.useProduct
 * @param {Function} options.useSelector
 * @returns {{isPolling: boolean, isProductPolling: boolean, productPollingFormats: Array<string>,
 *     isCompleted: boolean}}
 */
const useExportStatus = ({
  useProduct: useAliasProduct = useProduct,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector
} = {}) => {
  const { productId } = useAliasProduct();
  const { data = {} } = useAliasSelector(({ app }) => app?.exports, {});

  const isPolling = data?.data?.isAnythingPending === true || undefined;
  const isCompleted = data?.data?.isAnythingPending === false || undefined;
  const allCompletedFormats = [];
  const productCompletedFormats = [];
  const productPollingFormats = [];
  // let isProductPolling = data?.data ? false : undefined;
  let isProductPolling = false;

  if (Array.isArray(data?.data?.completed)) {
    allCompletedFormats.push(...data.data.completed);
  }

  if (Array.isArray(data?.data?.[productId]?.completed)) {
    productCompletedFormats.push(...data.data[productId].completed);
  }

  if (Array.isArray(data?.data?.[productId]?.pending)) {
    productPollingFormats.push(...data.data[productId].pending.map(({ format: productFormat }) => productFormat));

    if (productPollingFormats.length) {
      isProductPolling = true;
    }
  }

  /*
  if (Array.isArray(data?.data?.[productId])) {
    const productCompletedResults = data?.data?.[productId].filter(
      ({ status: productStatus }) => productStatus === PLATFORM_API_EXPORT_STATUS_TYPES.COMPLETE
    );

    productCompletedFormats.push(...productCompletedResults);

    const pendingProductResults = data?.data?.[productId]
      .filter(({ status: productStatus }) => productStatus === PLATFORM_API_EXPORT_STATUS_TYPES.PENDING)
      .map(({ format: productFormat }) => productFormat);

    productPollingFormats.push(...pendingProductResults);

    if (pendingProductResults.length) {
      isProductPolling = true;
    }
  }
  */

  return {
    allCompletedFormats,
    isCompleted,
    isPolling,
    isProductPolling,
    productCompletedFormats,
    productPollingFormats
  };
};

/**
 * Apply a centralized export hook for, post/put, polling status, and download.
 *
 * @param {object} options
 * @param {Function} options.createExport
 * @param {Function} options.getExport
 * @param {Function} options.getExportStatus
 * @param {Function} options.useDispatch
 * @param {Function} options.useExportStatus
 * @returns {Function}
 */
const useExport = ({
  createExport = reduxActions.platform.createExport,
  getExport = reduxActions.platform.getExport,
  getExportStatus = reduxActions.platform.getExportStatus,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useExportStatus: useAliasExportStatus = useExportStatus
} = {}) => {
  const dispatch = useAliasDispatch();
  const { isPolling } = useAliasExportStatus();

  /**
   * A polling response validator
   *
   * @type {Function}
   */
  const validate = useCallback(response => response?.data?.data?.isAnythingPending === false, []);

  /**
   * Create, or get, an export while detecting, or setting up, polling
   */
  return useCallback(
    ({ id, data } = {}) => {
      const updatedOptions = {};

      if (!isPolling) {
        updatedOptions.poll = {
          validate
        };
      }

      if (data) {
        return createExport(data, updatedOptions)(dispatch);
      }

      if (id) {
        return getExport(id)(dispatch);
      }

      if (isPolling === undefined) {
        return getExportStatus(updatedOptions)(dispatch);
      }

      return undefined;
    },
    [createExport, dispatch, getExport, getExportStatus, isPolling, validate]
  );
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
  const createExport = useAliasExport();
  const { productId } = useAliasProduct();
  const exportQuery = useAliasProductExportQuery();

  return ({ value = null } = {}) => {
    const sources = [
      {
        application: APP_TYPES.SUBSCRIPTIONS,
        resource: RESOURCE_TYPES.SUBSCRIPTIONS,
        filters: {
          ...exportQuery
        }
      }
    ];

    const data = { format: value, name: `${EXPORT_PREFIX}-${productId}`, sources };
    createExport({ data });
  };
};

/**
 * Display an export/download field with options.
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
  const { isProductPolling, allCompletedFormats = [], productPollingFormats = [] } = useAliasExportStatus();
  const checkGetExport = useAliasExport();
  const onSelect = useAliasOnSelect();
  const updatedOptions = options.map(option => ({
    ...option,
    title:
      (isProductPolling &&
        productPollingFormats?.includes(option.value) &&
        t('curiosity-toolbar.label', { context: ['export', 'loading'] })) ||
      option.title,
    selected: isProductPolling && productPollingFormats?.includes(option.value),
    isDisabled: isProductPolling && productPollingFormats?.includes(option.value)
  }));

  useMount(() => {
    checkGetExport();
  });

  useShallowCompareEffect(() => {
    allCompletedFormats.forEach(({ id }) => {
      checkGetExport({ id });
    });
  }, [allCompletedFormats]);

  return (
    <Tooltip content={t('curiosity-toolbar.placeholder', { context: ['export', isProductPolling && 'loading'] })}>
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
    </Tooltip>
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
