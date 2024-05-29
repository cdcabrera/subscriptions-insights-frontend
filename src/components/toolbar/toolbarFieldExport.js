import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { ExportIcon } from '@patternfly/react-icons';
import { useMount, useShallowCompareEffect } from 'react-use';
import _snakeCase from 'lodash/snakeCase';
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
import { getCurrentDate } from '../../common/dateHelpers';

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
 * @param {Function} options.t
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @param {Function} options.useSelector
 * @returns {{isProductPending: boolean, productPendingFormats: Array<string>,
 *     allCompletedDownloads: Array<{ id: string, productId: string }>, isPending: boolean, isCompleted: boolean}}
 */
const useExportStatus = ({
  t = translate,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector
} = {}) => {
  /*
   * const [isPendingNotification, setIsPendingNotification] = useState(false);
   * const [isCompletedNotification, setIsCompletedNotification] = useState(false);
   */
  const dispatch = useAliasDispatch();
  const { productId } = useAliasProduct();
  const { data = {} } = useAliasSelector(({ app }) => app?.exports, {});

  const isPending = data?.data?.isAnythingPending;
  const pendingDownloads = data?.data?.pending;
  const isCompleted = data?.data?.isAnythingCompleted;
  const allCompletedDownloads = [];
  const productPendingFormats = [];
  let isProductPending = false;

  if (isCompleted && Array.isArray(data?.data?.completed)) {
    allCompletedDownloads.push(...data.data.completed);
  }

  if (isPending && Array.isArray(data?.data?.products?.[productId]?.pending)) {
    productPendingFormats.push(
      ...data.data.products[productId].pending.map(({ format: productFormat }) => productFormat)
    );

    if (productPendingFormats.length) {
      isProductPending = true;
    }
  }

  useShallowCompareEffect(() => {
    if (isPending) {
      dispatch([
        reduxActions.platform.removeNotification('swatch-downloads-pending'),
        reduxActions.platform.addNotification({
          id: 'swatch-downloads-pending',
          variant: 'info',
          title: t('curiosity-toolbar.notifications', {
            context: ['export', 'pending', 'title'],
            count: pendingDownloads.length
          }),
          dismissable: false,
          autoDismiss: false
        })
      ]);
    } else {
      dispatch([reduxActions.platform.removeNotification('swatch-downloads-pending')]);
    }
  }, [dispatch, isPending, pendingDownloads]);

  return {
    allCompletedDownloads,
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
 * @param {Function} options.t
 * @param {Function} options.useDispatch
 * @param {Function} options.useExportStatus
 * @returns {{getExport: Function, createExport: Function, checkExports: Function}}
 */
const useExport = ({
  createExport: createAliasExport = reduxActions.platform.createExport,
  getExport: getAliasExport = reduxActions.platform.getExport,
  getExportStatus: getAliasExportStatus = reduxActions.platform.getExportStatus,
  t = translate,
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
   *
   * @param {string} id
   * @param {string} productId
   */
  const getExport = useCallback(
    (id, productId) => {
      const fileName = `${getCurrentDate().toLocaleDateString('fr-CA')}_swatch_report_${_snakeCase(productId)}`;
      dispatch([
        getAliasExport(id, fileName),
        reduxActions.platform.removeNotification(id),
        reduxActions.platform.addNotification({
          id,
          variant: 'success',
          title: t('curiosity-toolbar.notifications', {
            context: ['export', 'completed', 'title']
          }),
          description: t('curiosity-toolbar.notifications', {
            context: ['export', 'completed', 'description'],
            fileName
          }),
          dismissable: true,
          autoDismiss: true
        })
      ]);
    },
    [dispatch, getAliasExport, t]
  );

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
  const { isProductPending, allCompletedDownloads = [], productPendingFormats = [] } = useAliasExportStatus();
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
    allCompletedDownloads.forEach(({ id, productId }) => {
      getExport(id, productId);
    });
  }, [allCompletedDownloads]);

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
