import React, { useCallback, useEffect, useState } from 'react';
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
  PLATFORM_API_EXPORT_RESOURCE_TYPES as RESOURCE_TYPES
} from '../../services/platform/platformConstants';
import { translate } from '../i18n/i18n';

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
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @param {Function} options.useSelector
 * @returns {{isProductPending: boolean, productPendingFormats: Array<string>, allCompletedIds: Array<string>,
 *     isPending: boolean, isCompleted: boolean}}
 */
const useExportStatus = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector
} = {}) => {
  const [isPendingNotification, setIsPendingNotification] = useState(false);
  const [isCompletedNotification, setIsCompletedNotification] = useState(false);
  const dispatch = useAliasDispatch();
  const { productId } = useAliasProduct();
  const { data = {} } = useAliasSelector(({ app }) => app?.exports, {});

  const isPending = data?.data?.isAnythingPending;
  const isCompleted = data?.data?.isAnythingCompleted;
  const allCompletedIds = [];
  const productPendingFormats = [];
  let isProductPending = false;

  if (isCompleted && Array.isArray(data?.data?.completed)) {
    allCompletedIds.push(...data.data.completed.map(({ id }) => id));
  }

  if (isPending && Array.isArray(data?.data?.products?.[productId]?.pending)) {
    productPendingFormats.push(
      ...data.data.products[productId].pending.map(({ format: productFormat }) => productFormat)
    );

    if (productPendingFormats.length) {
      isProductPending = true;
    }
  }

  useEffect(() => {
    if (!isPendingNotification && isPending) {
      dispatch([
        reduxActions.platform.removeNotification('swatch-downloads-pending'),
        reduxActions.platform.addNotification({
          id: 'swatch-downloads-pending',
          variant: 'info',
          title: 'pending',
          description: 'pending',
          dismissable: false,
          autoDismiss: false
        })
      ]);
      setIsPendingNotification(true);
    } else if (isPendingNotification && !isPending) {
      dispatch([reduxActions.platform.removeNotification('swatch-downloads-pending')]);
      setIsPendingNotification(false);
    }
  }, [dispatch, isPending, isPendingNotification]);

  useEffect(() => {
    if (!isCompletedNotification && isCompleted) {
      dispatch([
        reduxActions.platform.removeNotification('swatch-downloads-completed'),
        reduxActions.platform.addNotification({
          id: 'swatch-downloads-completed',
          variant: 'success',
          title: 'fulfilled',
          description: 'fulfilled',
          dismissable: true,
          autoDismiss: true
        })
      ]);
      setIsCompletedNotification(true);
    } else if (isCompletedNotification && !isCompleted) {
      dispatch([reduxActions.platform.removeNotification('swatch-downloads-completed')]);
      setIsCompletedNotification(false);
    }
  }, [dispatch, isCompleted, isCompletedNotification]);

  return {
    allCompletedIds,
    isCompleted,
    isPending,
    isProductPending,
    productPendingFormats
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
 * @returns {{getExport: Function, createExport: Function, checkExports: Function}}
 */
const useExport = ({
  createExport: createAliasExport = reduxActions.platform.createExport,
  getExport: getAliasExport = reduxActions.platform.getExport,
  getExportStatus: getAliasExportStatus = reduxActions.platform.getExportStatus,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useExportStatus: useAliasExportStatus = useExportStatus
} = {}) => {
  const dispatch = useAliasDispatch();
  const { isPending } = useAliasExportStatus();

  /**
   * A polling response validator
   *
   * @type {Function}
   */
  const validate = useCallback(response => response?.data?.data?.isAnythingPending === false, []);

  /**
   * Setup, or create, an export. And setup polling if there are NOT any pending status indicators, the Validator will
   * resolve automatically.
   */
  const createExport = useCallback(
    data => {
      const updatedOptions = {};

      if (!isPending) {
        updatedOptions.poll = {
          validate
        };
      }

      createAliasExport(data, updatedOptions)(dispatch);
    },
    [createAliasExport, dispatch, isPending, validate]
  );

  /**
   * Check export status. And setup polling if there are NOT any pending status indicators, the Validator will
   * resolve automatically.
   */
  const checkExports = useCallback(() => {
    const updatedOptions = {};

    if (!isPending) {
      updatedOptions.poll = {
        validate
      };
    }

    getAliasExportStatus(updatedOptions)(dispatch);
  }, [dispatch, getAliasExportStatus, isPending, validate]);

  /**
   * Get an export by identifier
   */
  const getExport = useCallback(id => getAliasExport(id)(dispatch), [dispatch, getAliasExport]);

  return {
    checkExports,
    createExport,
    getExport
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
        application: APP_TYPES.SUBSCRIPTIONS,
        resource: RESOURCE_TYPES.SUBSCRIPTIONS,
        filters: {
          ...exportQuery
        }
      }
    ];

    createExport({ format: value, name: `${EXPORT_PREFIX}-${productId}`, sources });
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
  const { isProductPending, allCompletedIds = [], productPendingFormats = [] } = useAliasExportStatus();
  const { checkExports, getExport } = useAliasExport();
  const onSelect = useAliasOnSelect();
  const updatedOptions = options.map(option => ({
    ...option,
    title:
      (isProductPending &&
        productPendingFormats?.includes(option.value) &&
        t('curiosity-toolbar.label', { context: ['export', 'loading'] })) ||
      option.title,
    selected: isProductPending && productPendingFormats?.includes(option.value),
    isDisabled: isProductPending && productPendingFormats?.includes(option.value)
  }));

  useMount(() => {
    checkExports();
  });

  useShallowCompareEffect(() => {
    allCompletedIds.forEach(id => {
      getExport(id);
    });
  }, [allCompletedIds]);

  reduxActions.platform.addNotification({
    variant: 'info',
    title: 'pending',
    description: 'pending',
    dismissable: true,
    autoDismiss: true
  });

  return (
    <Tooltip content={t('curiosity-toolbar.placeholder', { context: ['export', isProductPending && 'loading'] })}>
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
