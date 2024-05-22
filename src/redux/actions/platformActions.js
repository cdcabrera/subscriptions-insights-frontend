import {
  addNotification as RcsAddNotification,
  removeNotification as RcsRemoveNotification,
  clearNotifications as RcsClearNotifications
} from '@redhat-cloud-services/frontend-components-notifications';
import { platformTypes } from '../types';
import { platformServices } from '../../services/platform/platformServices';
import { translate } from '../../components/i18n/i18n';

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
 * Return a "dispatch ready" export poll status check.
 *
 * @param {Function} dispatch
 * @returns {Function}
 */
const setExportStatus =
  dispatch =>
  (id, success = {}, error) =>
    dispatch({
      type: platformTypes.SET_PLATFORM_EXPORT_STATUS,
      payload: (error && Promise.reject(error)) || Promise.resolve(success),
      meta: {
        id
      }
    });

/**
 * Create an export status poll with download, and toast notifications.
 *
 * @param {object} options Apply polling options
 * @returns {Function}
 */
const getExistingExports =
  (options = {}) =>
  dispatch => {
    dispatch({
      type: platformTypes.SET_PLATFORM_EXPORT_STATUS,
      payload: platformServices.getExistingExports(undefined, {
        ...options,
        poll: {
          ...options.poll,
          status: (successResponse, ...args) => {
            if (!successResponse?.data?.data?.isAnythingPending && successResponse?.data?.data?.isAnythingCompleted) {
              dispatch(removeNotification('swatch-global-export'));
              dispatch(
                addNotification({
                  id: 'swatch-global-export',
                  title: translate('curiosity-toolbar.notifications', {
                    context: ['export', 'completed', 'titleGlobal']
                  }),
                  description: translate('curiosity-toolbar.notifications', {
                    context: ['export', 'completed', 'descriptionGlobal']
                  }),
                  dismissable: true
                })
              );
            }

            setExportStatus(dispatch)('global', successResponse, ...args);
          }
        }
      }),
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
            id: 'swatch-global-export',
            title: translate('curiosity-toolbar.notifications', {
              context: ['export', 'pending', 'titleGlobal']
            }),
            description: translate('curiosity-toolbar.notifications', {
              context: ['export', 'pending', 'descriptionGlobal']
            }),
            dismissable: true
          }
        }
      }
    });
  };

/**
 * Create an export for download with toast notifications.
 *
 * @param {string} id
 * @param {object} data
 * @param {object} options Apply polling options
 * @returns {Function}
 */
const createExport =
  (id, data = {}, options = {}) =>
  dispatch => {
    dispatch({
      type: platformTypes.SET_PLATFORM_EXPORT_CREATE,
      payload: platformServices.postExport(data, {
        ...options,
        poll: {
          ...options.poll,
          status: (successResponse, ...args) => {
            if (
              !successResponse?.data?.data?.products?.[id]?.isPending &&
              successResponse?.data?.data?.products?.[id]?.isCompleted
            ) {
              dispatch(removeNotification('swatch-create-export'));
              dispatch(
                addNotification({
                  variant: 'success',
                  id: 'swatch-create-export',
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

            setExportStatus(dispatch)(id, successResponse, ...args);
          }
        }
      }),
      meta: {
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
            id: 'swatch-create-export',
            title: translate('curiosity-toolbar.notifications', {
              context: ['export', 'pending', 'title', id]
            }),
            dismissable: true
          }
        }
      }
    });
  };

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
  hideGlobalFilter
};
