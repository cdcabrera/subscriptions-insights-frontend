import React, { useCallback, useEffect, useState } from 'react';
import { useMount, useUnmount } from 'react-use';
import { Button } from '@patternfly/react-core';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import { useProduct } from '../productView/productViewContext';
import { translate } from '../i18n/i18n';
import { useAppLoad } from '../../hooks/useApp';

/**
 * @memberof ToolbarFieldExport
 * @module ToolbarFieldExportContext
 */

/**
 * Return a polling status callback. Used when creating an export.
 *
 * @param {object} options
 * @param {Function} options.addNotification
 * @param {Function} options.removeNotification
 * @param {Function} options.t
 * @param {Function} options.useAppLoad
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @returns {Function}
 */
const useExportConfirmation = ({
  addNotification: addAliasNotification = reduxActions.platform.addNotification,
  removeNotification: removeAliasNotification = reduxActions.platform.removeNotification,
  t = translate,
  useAppLoad: useAliasAppLoad = useAppLoad,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { productId } = useAliasProduct();
  const dispatch = useAliasDispatch();
  const confirmAppLoaded = useAliasAppLoad();

  useUnmount(() => {
    dispatch(removeAliasNotification('swatch-exports-individual-status'));
  });

  return useCallback(
    (successResponse, errorResponse, retryCount) => {
      const allCompleted = successResponse?.data?.data?.completed || [];
      const { completed = [], isCompleted, pending = [] } = successResponse?.data?.data?.products?.[productId] || {};
      const isProductPending = !isCompleted;
      const isAllPending = successResponse?.data?.data?.isAnythingPending || isProductPending || false;

      if (!confirmAppLoaded()) {
        return;
      }

      if (retryCount === -1) {
        addAliasNotification({
          id: 'swatch-exports-individual-status',
          variant: 'info',
          title: t('curiosity-toolbar.notifications', {
            context: ['export', 'pending', 'title']
          }),
          dismissable: true
        })(dispatch);

        dispatch({
          type: reduxTypes.platform.SET_PLATFORM_EXPORT_STATUS,
          id: productId,
          isAllPending,
          isProductPending,
          pending
        });
      }

      if (isCompleted) {
        addAliasNotification({
          id: 'swatch-exports-individual-status',
          variant: 'success',
          title: t('curiosity-toolbar.notifications', {
            context: ['export', 'completed', 'title']
          }),
          description: t('curiosity-toolbar.notifications', {
            context: ['export', 'completed', 'description'],
            count: allCompleted.length,
            fileName: completed?.[0]?.fileName
          }),
          dismissable: true
        })(dispatch);

        dispatch({
          type: reduxTypes.platform.SET_PLATFORM_EXPORT_STATUS,
          id: productId,
          isAllPending,
          isProductPending,
          pending
        });
      }
    },
    [addAliasNotification, confirmAppLoaded, dispatch, productId, t]
  );
};

/**
 * Apply an export hook for an export post. The service automatically sets up polling, then force downloads the file.
 *
 * @param {object} options
 * @param {Function} options.createExport
 * @param {Function} options.t
 * @param {Function} options.useDispatch
 * @param {Function} options.useExportConfirmation
 * @returns {Function}
 */
const useExport = ({
  createExport: createAliasExport = reduxActions.platform.createExport,
  t = translate,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useExportConfirmation: useAliasExportConfirmation = useExportConfirmation
} = {}) => {
  const statusConfirmation = useAliasExportConfirmation();
  const dispatch = useAliasDispatch();

  return useCallback(
    (id, data) => {
      dispatch({
        type: reduxTypes.platform.SET_PLATFORM_EXPORT_STATUS,
        id,
        isAllPending: true,
        isProductPending: true
      });

      createAliasExport(
        id,
        data,
        { poll: { status: statusConfirmation } },
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
          }
        }
      )(dispatch);
    },
    [createAliasExport, dispatch, statusConfirmation, t]
  );
};

/**
 * User confirmation results when existing exports are detected.
 *
 * @param {object} options
 * @param {Function} options.addNotification
 * @param {Function} options.deleteExistingExports
 * @param {Function} options.getExistingExports
 * @param {Function} options.removeNotification
 * @param {Function} options.t
 * @param {Function} options.useAppLoad
 * @param {Function} options.useDispatch
 * @returns {Function}
 */
const useExistingExportsConfirmation = ({
  addNotification: addAliasNotification = reduxActions.platform.addNotification,
  deleteExistingExports: deleteAliasExistingExports = reduxActions.platform.deleteExistingExports,
  getExistingExports: getAliasExistingExports = reduxActions.platform.getExistingExports,
  removeNotification: removeAliasNotification = reduxActions.platform.removeNotification,
  t = translate,
  useAppLoad: useAliasAppLoad = useAppLoad,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch
} = {}) => {
  const dispatch = useAliasDispatch();
  const confirmAppLoaded = useAliasAppLoad();

  return useCallback(
    (confirmation, allResults) => {
      dispatch(removeAliasNotification('swatch-exports-status'));

      if (confirmation === 'no') {
        return deleteAliasExistingExports(allResults)(dispatch);
      }

      return getAliasExistingExports(allResults, {
        pending: {
          id: 'swatch-exports-existing-confirmation',
          variant: 'info',
          title: t('curiosity-toolbar.notifications', { context: ['export', 'pending', 'titleGlobal'] }),
          dismissable: true
        }
      })(dispatch).then(() => {
        if (confirmAppLoaded()) {
          addAliasNotification({
            id: 'swatch-exports-existing-confirmation',
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
          })(dispatch);
        }
      });
    },
    [
      addAliasNotification,
      confirmAppLoaded,
      dispatch,
      deleteAliasExistingExports,
      getAliasExistingExports,
      removeAliasNotification,
      t
    ]
  );
};

/**
 * Aggregated export status
 *
 * @param {object} options
 * @param {Function} options.useProduct
 * @param {Function} options.useSelectors
 * @returns {{isProductPending: boolean, productPendingFormats: Array<string>}}
 */
const useExportStatus = ({
  useProduct: useAliasProduct = useProduct,
  useSelectors: useAliasSelectors = storeHooks.reactRedux.useSelectors
} = {}) => {
  const { productId } = useAliasProduct();
  const [isAllPending = false, { isPending, pending } = {}] = useAliasSelectors([
    ({ app }) => app?.exports?.isAllPending,
    ({ app }) => app?.exports?.[productId]
  ]);

  const pendingProductFormats = [];
  const isProductPending = isPending || false;

  if (isProductPending && Array.isArray(pending)) {
    pendingProductFormats.push(...pending.map(({ format: productFormat }) => productFormat));
  }

  return {
    isAllPending,
    isProductPending,
    pendingProductFormats
  };
};

let globalHasConfirmationFired = false;

/**
 * Apply an existing exports hook for user abandoned reports. Allow bulk polling status with download.
 *
 * @param {object} options
 * @param {Function} options.addNotification
 * @param {Function} options.getExistingExportsStatus
 * @param {Function} options.removeNotification
 * @param {Function} options.t
 * @param {Function} options.useDispatch
 * @param {Function} options.useExistingExportsConfirmation
 * @param {Function} options.useSelectorsResponse
 * @param options.useExportStatus
 */
const useExistingExports = ({
  addNotification: addAliasNotification = reduxActions.platform.addNotification,
  getExistingExportsStatus: getAliasExistingExportsStatus = reduxActions.platform.getExistingExportsStatus,
  removeNotification: removeAliasNotification = reduxActions.platform.removeNotification,
  t = translate,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useExistingExportsConfirmation: useAliasExistingExportsConfirmation = useExistingExportsConfirmation,
  // useExportStatus: useAliasExportStatus = useExportStatus,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const dispatch = useAliasDispatch();
  const onConfirmation = useAliasExistingExportsConfirmation();
  // const { isAllPending } = useAliasExportStatus();
  const { data, pending, fulfilled } = useAliasSelectorsResponse(({ app }) => app?.exportsExisting);
  const {
    completed: completedList = [],
    isAnythingPending,
    isAnythingCompleted,
    pending: pendingList = []
  } = data?.[0]?.data || {};

  useMount(() => {
    if (!globalHasConfirmationFired) {
      getAliasExistingExportsStatus()(dispatch);
    }
  });

  useUnmount(() => {
    dispatch(removeAliasNotification('swatch-exports-status'));
    dispatch({ type: reduxTypes.platform.SET_PLATFORM_EXPORT_RESET });
  });

  useEffect(() => {
    // if (isAllPending || (!fulfilled && !pending)) {
    // if (!globalHasConfirmationFired) {
    //  return;
    // }

    const isAnythingAvailable = isAnythingPending || isAnythingCompleted || false;
    const totalResults = completedList.length + pendingList.length;

    if (isAnythingAvailable && totalResults) {
      addAliasNotification({
        id: 'swatch-exports-status',
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
                completedList.length && 'completed',
                pendingList.length && 'pending'
              ],
              count: totalResults,
              completed: completedList.length,
              pending: pendingList.length
            })}
            <div style={{ paddingTop: '0.5rem' }}>
              <Button
                data-test="exportButtonConfirm"
                variant="primary"
                onClick={() => onConfirmation('yes', [...completedList, ...pendingList])}
                autoFocus
              >
                {t('curiosity-toolbar.button', { context: 'yes' })}
              </Button>{' '}
              <Button
                data-test="exportButtonCancel"
                variant="plain"
                onClick={() => onConfirmation('no', [...completedList, ...pendingList])}
              >
                {t('curiosity-toolbar.button', { context: 'no' })}
              </Button>
            </div>
          </div>
        ),
        autoDismiss: false,
        dismissable: false
      })(dispatch);
      dispatch({ type: reduxTypes.platform.SET_PLATFORM_EXPORT_RESET });
      globalHasConfirmationFired = true;
    }
  }, [
    // isAllPending,
    addAliasNotification,
    completedList,
    dispatch,
    fulfilled,
    isAnythingCompleted,
    isAnythingPending,
    onConfirmation,
    pending,
    pendingList,
    t
  ]);
};

const context = {
  useExport,
  useExportConfirmation,
  useExportStatus,
  useExistingExports,
  useExistingExportsConfirmation
};

export {
  context as default,
  context,
  useExport,
  useExportConfirmation,
  useExportStatus,
  useExistingExports,
  useExistingExportsConfirmation
};
