import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ExportIcon } from '@patternfly/react-icons';
import { useMount } from 'react-use';
import { Button } from '@patternfly/react-core';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
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

  if (isProductPending && Array.isArray(pending)) {
    pendingProductFormats.push(...pending.map(({ format: productFormat }) => productFormat));
  }

  return {
    isProductPending,
    pendingProductFormats
  };
};

/**
 * Apply an existing exports hook for user abandoned reports. Allow bulk polling status with download.
 *
 * @param {object} options
 * @param {Function} options.addNotification
 * @param {Function} options.getExistingExports
 * @param {Function} options.getExistingExportsStatus
 * @param {Function} options.deleteExistingExports
 * @param {Function} options.removeNotification
 * @param {Function} options.t
 * @param {Function} options.useDispatch
 * @param {Function} options.useSelectorsResponse
 */
const useExistingExports = ({
  addNotification: addAliasNotification = reduxActions.platform.addNotification,
  getExistingExports: getAliasExistingExports = reduxActions.platform.getExistingExports,
  getExistingExportsStatus: getAliasExistingExportsStatus = reduxActions.platform.getExistingExportsStatus,
  deleteExistingExports: deleteAliasExistingExports = reduxActions.platform.deleteExistingExports,
  removeNotification: removeAliasNotification = reduxActions.platform.removeNotification,
  t = translate,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const [isConfirmation, setIsConfirmation] = useState(false);
  const dispatch = useAliasDispatch();
  const { data, fulfilled } = useAliasSelectorsResponse(({ app }) => app?.exportsExisting);
  const { completed = [], isAnythingPending, isAnythingCompleted, pending = [] } = data?.[0]?.data || {};

  const onConfirmYes = useCallback(
    allResults => {
      dispatch(removeAliasNotification('swatch-exports-status'));

      getAliasExistingExports(allResults, {
        rejected: {
          variant: 'warning',
          title: t('curiosity-toolbar.notifications', { context: ['export', 'error', 'title'] }),
          description: t('curiosity-toolbar.notifications', {
            context: ['export', 'error', 'description']
          }),
          dismissable: true
        },
        pending: {
          variant: 'info',
          title: t('curiosity-toolbar.notifications', { context: ['export', 'pending', 'titleGlobal'] }),
          dismissable: true
        },
        fulfilled: {
          variant: 'success',
          title: t('curiosity-toolbar.notifications', {
            context: ['export', 'completed', 'titleGlobal'],
            count: allResults.length
          }),
          description: t('curiosity-toolbar.notifications', {
            context: ['export', 'completed', 'descriptionGlobal'],
            count: allResults.length
          }),
          dismissable: true
        }
      })(dispatch);
    },
    [dispatch, getAliasExistingExports, removeAliasNotification, t]
  );

  const onConfirmNo = useCallback(
    allResults => {
      dispatch(removeAliasNotification('swatch-exports-status'));
      deleteAliasExistingExports(allResults, {
        rejected: {
          variant: 'warning',
          title: t('curiosity-toolbar.notifications', { context: ['export', 'error', 'title'] }),
          description: t('curiosity-toolbar.notifications', { context: ['export', 'error', 'description'] }),
          dismissable: true
        }
      })(dispatch);
    },
    [dispatch, deleteAliasExistingExports, removeAliasNotification, t]
  );

  useMount(() => {
    if (!isConfirmation) {
      getAliasExistingExportsStatus({
        rejected: {
          variant: 'warning',
          title: t('curiosity-toolbar.notifications', { context: ['export', 'error', 'title'] }),
          description: t('curiosity-toolbar.notifications', { context: ['export', 'error', 'description'] }),
          dismissable: true
        }
      })(dispatch);
    }
  });

  useEffect(() => {
    if (!fulfilled || isConfirmation) {
      return;
    }

    const isAnythingAvailable = isAnythingPending || isAnythingCompleted || false;
    const totalResults = completed.length + pending.length;

    if (isAnythingAvailable && totalResults) {
      addAliasNotification({
        id: `swatch-exports-status`,
        title: t('curiosity-toolbar.notifications', {
          context: ['export', 'completed', 'title', 'existing'],
          count: totalResults
        }),
        description: (
          <div aria-live="polite">
            {t('curiosity-toolbar.notifications', {
              context: [
                'export',
                'completed',
                'description',
                'existing',
                completed.length && 'completed',
                pending.length && 'pending'
              ],
              count: totalResults,
              completed: completed.length,
              pending: pending.length
            })}
            <p style={{ paddingTop: '1em' }}>
              <Button
                data-test="exportButtonConfirm"
                variant="primary"
                onClick={() => onConfirmYes([...completed, ...pending])}
                autoFocus
              >
                {t('curiosity-toolbar.button', { context: 'yes' })}
              </Button>{' '}
              <Button
                data-test="exportButtonConfirm"
                variant="plain"
                onClick={() => onConfirmNo([...completed, ...pending])}
              >
                {t('curiosity-toolbar.button', { context: 'no' })}
              </Button>
            </p>
          </div>
        ),
        autoDismiss: false,
        dismissable: false
      })(dispatch);

      setIsConfirmation(true);
    }
  }, [
    addAliasNotification,
    completed,
    dispatch,
    fulfilled,
    isAnythingCompleted,
    isAnythingPending,
    isConfirmation,
    onConfirmNo,
    onConfirmYes,
    pending,
    removeAliasNotification,
    t
  ]);
};

/**
 * Apply an export hook for an export post. The service automatically sets up polling, then force downloads the file.
 *
 * @param {object} options
 * @param {Function} options.addNotification
 * @param {Function} options.createExport
 * @param {Function} options.t
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @returns {Function}
 */
const useExport = ({
  addNotification: addAliasNotification = reduxActions.platform.addNotification,
  createExport: createAliasExport = reduxActions.platform.createExport,
  t = translate,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { productId } = useAliasProduct();
  const dispatch = useAliasDispatch();

  /**
   * A polling status callback on export create.
   *
   * @type {Function}
   */
  const statusCallback = useCallback(
    successResponse => {
      const { completed = [], isCompleted, pending = [] } = successResponse?.data?.data?.products?.[productId] || {};
      const isPending = !isCompleted;

      if (isCompleted) {
        addAliasNotification({
          variant: 'success',
          id: `swatch-create-export-${productId}`,
          title: t('curiosity-toolbar.notifications', {
            context: ['export', 'completed', 'title']
          }),
          description: t('curiosity-toolbar.notifications', {
            context: ['export', 'completed', 'description'],
            fileName: completed?.[0]?.fileName
          }),
          dismissable: true
        })(dispatch);
      }

      dispatch({
        type: reduxTypes.platform.SET_PLATFORM_EXPORT_STATUS,
        id: productId,
        isPending,
        pending
      });
    },
    [addAliasNotification, dispatch, productId, t]
  );

  return useCallback(
    (id, data) => {
      dispatch({
        type: reduxTypes.platform.SET_PLATFORM_EXPORT_STATUS,
        id,
        isPending: true
      });

      createAliasExport(
        id,
        data,
        { poll: { status: statusCallback } },
        {
          rejected: {
            variant: 'warning',
            title: t('curiosity-toolbar.notifications', {
              context: ['export', 'error', 'title']
            }),
            description: t('curiosity-toolbar.notifications', {
              context: ['export', 'error', 'description']
            }),
            dismissable: true
          },
          pending: {
            variant: 'info',
            id: `swatch-create-export-${id}`,
            title: t('curiosity-toolbar.notifications', {
              context: ['export', 'pending', 'title', id]
            }),
            dismissable: true
          }
        }
      )(dispatch);
    },
    [createAliasExport, dispatch, statusCallback, t]
  );
};

/**
 * On select create/post an export.
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
  const { productId } = useAliasProduct();
  const exportQuery = useAliasProductExportQuery();
  const createExport = useAliasExport();

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
 * @param {Function} props.useExistingExports
 * @param {Function} props.useExportStatus
 * @param {Function} props.useOnSelect
 * @returns {React.ReactNode}
 */
const ToolbarFieldExport = ({
  options,
  position,
  t,
  useExistingExports: useAliasExistingExports,
  useExportStatus: useAliasExportStatus,
  useOnSelect: useAliasOnSelect
}) => {
  const { isProductPending, pendingProductFormats = [] } = useAliasExportStatus();
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

  useAliasExistingExports();

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
 * @type {{useOnSelect: Function, t: Function, useExportStatus: Function, options: Array, useExistingExports: Function,
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
  useExistingExports: PropTypes.func,
  useExportStatus: PropTypes.func,
  useOnSelect: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useOnSelect: Function, t: translate, useExportStatus: Function, options: Array, useExistingExports: Function,
 *     position: string}}
 */
ToolbarFieldExport.defaultProps = {
  options: toolbarFieldOptions,
  position: SelectPosition.left,
  t: translate,
  useExistingExports,
  useExportStatus,
  useOnSelect
};

export {
  ToolbarFieldExport as default,
  ToolbarFieldExport,
  toolbarFieldOptions,
  useExport,
  useExistingExports,
  useExportStatus,
  useOnSelect
};
