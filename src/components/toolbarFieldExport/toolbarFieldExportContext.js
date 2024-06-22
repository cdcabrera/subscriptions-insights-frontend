import React, { useCallback, useEffect, useState } from 'react';
import { useMount } from 'react-use';
import { Button } from '@patternfly/react-core';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import { useProduct } from '../productView/productViewContext';
import { translate } from '../i18n/i18n';

/**
 * @memberof ToolbarFieldExport
 * @module ToolbarFieldExportContext
 */

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

const useExistingExportsConfirmation = ({
  deleteExistingExports: deleteAliasExistingExports = reduxActions.platform.deleteExistingExports,
  getExistingExports: getAliasExistingExports = reduxActions.platform.getExistingExports,
  removeNotification: removeAliasNotification = reduxActions.platform.removeNotification,
  t = translate,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch
} = {}) => {
  const dispatch = useAliasDispatch();

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

  return {
    onConfirmNo,
    onConfirmYes
  };
};

/**
 * Apply an existing exports hook for user abandoned reports. Allow bulk polling status with download.
 *
 * @param {object} options
 * @param {Function} options.addNotification
 * @param {Function} options.getExistingExportsStatus
 * @param {Function} options.t
 * @param {Function} options.useDispatch
 * @param {Function} options.useExistingExportsConfirmation
 * @param {Function} options.useSelectorsResponse
 */
const useExistingExports = ({
  addNotification: addAliasNotification = reduxActions.platform.addNotification,
  getExistingExportsStatus: getAliasExistingExportsStatus = reduxActions.platform.getExistingExportsStatus,
  t = translate,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useExistingExportsConfirmation: useAliasExistingExportsConfirmation = useExistingExportsConfirmation,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const [isConfirmation, setIsConfirmation] = useState(false);
  const dispatch = useAliasDispatch();
  const { onConfirmNo, onConfirmYes } = useAliasExistingExportsConfirmation();
  const { data, fulfilled } = useAliasSelectorsResponse(({ app }) => app?.exportsExisting);
  const { completed = [], isAnythingPending, isAnythingCompleted, pending = [] } = data?.[0]?.data || {};

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
    t
  ]);
};

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

const context = {
  useExport,
  useExistingExports,
  useExportStatus
};

export { context as default, context, useExport, useExistingExports, useExportStatus };
