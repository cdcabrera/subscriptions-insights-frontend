import {
  addNotification as RcsAddNotification,
  removeNotification as RcsRemoveNotification,
  clearNotifications as RcsClearNotifications
} from '@redhat-cloud-services/frontend-components-notifications';
import { platformTypes } from '../types';
import { platformServices } from '../../services/platform/platformServices';

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
 * Create an export for download.
 *
 * @param {object} data
 * @param {object} options Polling options
 * @returns {Function}
 */
const createExport =
  (data = {}, options = {}) =>
  dispatch =>
    dispatch({
      type: platformTypes.SET_PLATFORM_EXPORT_STATUS,
      payload: platformServices.postExport(data, options)
    });

/**
 * Submit, get a status, or get a file for an export.
 *
 * @param {string|undefined|null} id
 * @param {object} data
 * @param {object} options Polling options
 * @returns {Function}
 */
const createGetExport = (id = null, data, options = {}) =>
  dispatch => {
    if (data) {
      return dispatch([
        {
          type: platformTypes.SET_PLATFORM_EXPORT_STATUS,
          payload: platformServices.postExport(data, options),
          meta: {
            id: 'status'
          }
        }
      ]);
    }

    if (id) {
      return dispatch({
        type: platformTypes.GET_PLATFORM_EXPORT,
        payload: platformServices.getExport(id),
        meta: {
          id: 'download',
          notifications: {
            rejected: {
              variant: 'danger',
              title: 'error',
              // description: translate('curiosity-optin.notificationsErrorDescription'),
              dismissable: true,
              autoDismiss: true
            }
          }
        }
      });
    }

    return dispatch({
      type: platformTypes.SET_PLATFORM_EXPORT_STATUS,
      payload: platformServices.getExportStatus(undefined, {}, options),
      meta: {
        id: 'initial'
      }
    });
  };

/**
 * Get an export download package status.
 *
 * @param {string} id
 * @returns {Function}
 */
const getExportStatus =
  (id = null) =>
  dispatch =>
    dispatch({
      type: platformTypes.GET_PLATFORM_EXPORT_STATUS,
      payload: platformServices.getExportStatus(id)
    });

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
  getExportStatus,
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
  getExportStatus,
  hideGlobalFilter
};
