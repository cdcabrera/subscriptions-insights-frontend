import React from 'react';
import {
  addNotification as RcsAddNotification,
  removeNotification as RcsRemoveNotification,
  clearNotifications as RcsClearNotifications
} from '@redhat-cloud-services/frontend-components-notifications';
import { Button } from '@patternfly/react-core';
import { platformTypes } from '../types';
import { getExport, platformServices } from '../../services/platform/platformServices';
import { translate } from '../../components/i18n/i18n';
import { helpers } from '../../common';

/**
 * Platform service wrappers for dispatch, state update.
 *
 * @memberof Actions
 * @module PlatformActions
 */

/**
 * Add a platform plugin toast notification.
 *
 * @param {object} data
 * @returns {*}
 */
const addNotification = data => RcsAddNotification(data);

/**
 * Remove a platform plugin toast notification.
 *
 * @param {string} id
 * @returns {*}
 */
const removeNotification = id => RcsRemoveNotification(id);

/**
 * Clear all platform plugin toast notifications.
 *
 * @returns {*}
 */
const clearNotifications = () => RcsClearNotifications();

/**
 * Get an emulated and combined API response from the platforms "getUser" and "getUserPermissions" global methods.
 *
 * @param {string|Array} appName
 * @returns {Function}
 */
const authorizeUser = appName => dispatch =>
  dispatch({
    type: platformTypes.PLATFORM_USER_AUTH,
    payload: Promise.all([platformServices.getUser(), platformServices.getUserPermissions(appName)])
  });

/**
 * Return a "dispatch ready" export poll status check. Helps keep components up-to-date by providing a common state
 * updated from other action calls.
 *
 * @param {string} id
 * @param {object} params
 * @param {Array} params.completed
 * @param {boolean} params.isPending
 * @param {Array} params.pending
 * @returns {Function}
 */
const setExportStatus =
  (id, { completed, isPending, pending } = {}) =>
  dispatch =>
    dispatch({
      type: platformTypes.SET_PLATFORM_EXPORT_STATUS,
      id,
      completed,
      isPending,
      pending
    });

/**
 * Get all existing exports, if pending poll, and when complete download. Includes toast notifications.
 *
 * @param {Array} existingExports
 * @param {object} options Apply polling options
 * @returns {Function}
 */
const getExistingExports =
  (existingExports, options = {}) =>
  dispatch =>
    dispatch({
      type: platformTypes.SET_PLATFORM_EXPORT_STATUS,
      payload: platformServices.getExistingExports(existingExports, undefined, options),
      meta: {
        id: 'global',
        notifications: {
          rejected: {
            variant: 'warning',
            title: translate('curiosity-toolbar.notifications', {
              context: ['export', 'error', 'title']
            }),
            description: translate('curiosity-toolbar.notifications', {
              context: ['export', 'error', 'description']
            }),
            dismissable: true
          },
          pending: {
            variant: 'info',
            title: 'Continuing reports download',
            dismissable: true
          },
          fulfilled: {
            variant: 'success',
            title: translate('curiosity-toolbar.notifications', {
              context: ['export', 'completed', 'titleGlobal'],
              count: existingExports.length
            }),
            description: translate('curiosity-toolbar.notifications', {
              context: ['export', 'completed', 'descriptionGlobal'],
              count: existingExports.length
            }),
            dismissable: true
          }
        }
      }
    });

/**
 * Remove all existing exports. Includes toast notifications.
 *
 * @param {Array<{ id: string }>} existingExports
 * @returns {Function}
 */
const removeExistingExports = existingExports => dispatch =>
  dispatch({
    type: 'DELETE_EXPORT',
    payload: Promise.all(existingExports.map(({ id }) => platformServices.deleteExport(id))),
    meta: {
      id: 'global',
      notifications: {
        rejected: {
          variant: 'warning',
          title: translate('curiosity-toolbar.notifications', {
            context: ['export', 'error', 'title']
          }),
          description: translate('curiosity-toolbar.notifications', {
            context: ['export', 'error', 'description']
          }),
          dismissable: true
        }
      }
    }
  });

/**
 * Get a status from any existing exports. Display a confirmation for downloading, or ignoring, the exports.
 * Includes toast notifications.
 *
 * @param {object} options
 * @returns {Function}
 */
const getExistingExportsStatus =
  (options = {}) =>
  dispatch => {
    const onYes = allResults => {
      dispatch(removeNotification(`swatch-exports-status`));
      getExistingExports(allResults)(dispatch);
    };
    const onNo = allResults => {
      dispatch(removeNotification(`swatch-exports-status`));
      removeExistingExports(allResults)(dispatch);
    };

    return dispatch({
      type: platformTypes.SET_PLATFORM_EXPORT_STATUS,
      payload: platformServices.getExistingExportsStatus(undefined, options),
      meta: {
        id: 'global',
        notifications: {
          rejected: {
            variant: 'warning',
            title: translate('curiosity-toolbar.notifications', {
              context: ['export', 'error', 'title']
            }),
            description: translate('curiosity-toolbar.notifications', {
              context: ['export', 'error', 'description']
            }),
            dismissable: true
          },
          fulfilled: successResponse => {
            const isCompleted =
              !successResponse?.data?.data?.isAnythingPending && successResponse?.data?.data?.isAnythingCompleted;
            const isPending =
              successResponse?.data?.data?.isAnythingPending && !successResponse?.data?.data?.isAnythingCompleted;
            const isAnythingAvailable = isCompleted || isPending || false;

            const completed = successResponse?.data?.data?.completed || [];
            const pending = successResponse?.data?.data?.pending || [];
            const totalResults = completed.length + pending.length;

            if (isAnythingAvailable && totalResults) {
              return {
                variant: 'info',
                id: `swatch-exports-status`,
                title: `${totalResults} existing reports are available`,
                description: (
                  <div aria-live="polite">
                    {(pending.length && `${pending.length} pending`) || ''}{' '}
                    {(pending.length && completed.length && 'and') || ''}{' '}
                    {(completed.length && `${completed.length} completed`) || ''} reports are available. Would you like
                    to continue, and download them?
                    <p style={{ paddingTop: '1em' }}>
                      <Button
                        data-test="optinButtonSubmit"
                        variant="primary"
                        onClick={() => onYes([...completed, ...pending])}
                        autoFocus
                      >
                        Yes
                      </Button>{' '}
                      <Button
                        data-test="optinButtonSubmit"
                        variant="plain"
                        onClick={() => onNo([...completed, ...pending])}
                      >
                        No
                      </Button>
                    </p>
                  </div>
                ),
                autoDismiss: false,
                dismissable: false
              };
            }

            delete this.fulfilled;
            return {};
          }
        }
      }
    });
  };

/**
 * Create an export for download. Includes toast notifications.
 *
 * @param {string} id
 * @param {object} data
 * @param {object} options Apply polling options
 * @returns {Function}
 */
const createExport =
  (id, data = {}, options = {}) =>
  dispatch =>
    dispatch([
      setExportStatus(id, true, []),
      {
        type: platformTypes.SET_PLATFORM_EXPORT_CREATE,
        payload: platformServices.postExport(data, {
          ...options,
          poll: {
            ...options.poll,
            status: successResponse => {
              const isCompleted = successResponse?.data?.data?.products?.[id]?.isCompleted;
              const isPending = !isCompleted;
              const pending = successResponse?.data?.data?.products?.[id]?.pending || [];

              if (isCompleted) {
                dispatch(removeNotification(`swatch-create-export-${id}`));
                dispatch(
                  addNotification({
                    variant: 'success',
                    id: `swatch-create-export-${id}`,
                    title: translate('curiosity-toolbar.notifications', {
                      context: ['export', 'completed', 'title']
                    }),
                    description: translate('curiosity-toolbar.notifications', {
                      context: ['export', 'completed', 'description'],
                      fileName: successResponse?.data?.data?.products?.[id]?.completed?.[0]?.fileName
                    }),
                    dismissable: true
                  })
                );
              }

              setExportStatus(id, isPending, pending)(dispatch);
            }
          }
        }),
        meta: {
          id,
          notifications: {
            rejected: {
              variant: 'warning',
              title: translate('curiosity-toolbar.notifications', {
                context: ['export', 'error', 'title']
              }),
              description: translate('curiosity-toolbar.notifications', {
                context: ['export', 'error', 'description']
              }),
              dismissable: true
            },
            pending: {
              id: `swatch-create-export-${id}`,
              title: translate('curiosity-toolbar.notifications', {
                context: ['export', 'pending', 'title', id]
              }),
              dismissable: true
            }
          }
        }
      }
    ]);

/**
 * Hide platform global filter.
 *
 * @param {boolean} isHidden
 * @returns {{Function}}
 */
const hideGlobalFilter = isHidden => ({
  type: platformTypes.PLATFORM_GLOBAL_FILTER_HIDE,
  payload: platformServices.hideGlobalFilter(isHidden)
});

const platformActions = {
  addNotification,
  removeNotification,
  clearNotifications,
  authorizeUser,
  createExport,
  setExportStatus,
  getExistingExports,
  getExistingExportsStatus,
  hideGlobalFilter
};

export {
  platformActions as default,
  platformActions,
  addNotification,
  removeNotification,
  clearNotifications,
  authorizeUser,
  createExport,
  setExportStatus,
  getExistingExports,
  getExistingExportsStatus,
  hideGlobalFilter
};
