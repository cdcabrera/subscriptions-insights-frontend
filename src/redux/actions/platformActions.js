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
      type: platformTypes.GET_PLATFORM_EXPORT_EXISTING,
      payload: platformServices.getExistingExports(existingExports, undefined, options),
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
            variant: 'info',
            title: translate('curiosity-toolbar.notifications', {
              context: ['export', 'pending', 'titleGlobal']
            }),
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
 * Delete all existing exports. Includes toast notifications.
 *
 * @param {Array<{ id: string }>} existingExports
 * @returns {Function}
 */
const deleteExistingExports = existingExports => dispatch =>
  dispatch({
    type: platformTypes.DELETE_PLATFORM_EXPORT_EXISTING,
    payload: Promise.all(existingExports.map(({ id }) => platformServices.deleteExport(id))),
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
  dispatch =>
    dispatch({
      type: platformTypes.SET_PLATFORM_EXPORT_EXISTING_STATUS,
      payload: platformServices.getExistingExportsStatus(undefined, options),
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
          }
        }
      }
    });

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
    dispatch({
      type: platformTypes.SET_PLATFORM_EXPORT_CREATE,
      payload: platformServices.postExport(data, options),
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
            variant: 'info',
            id: `swatch-create-export-${id}`,
            title: translate('curiosity-toolbar.notifications', {
              context: ['export', 'pending', 'title', id]
            }),
            dismissable: true
          }
        }
      }
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
  deleteExistingExports,
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
  deleteExistingExports,
  getExistingExports,
  getExistingExportsStatus,
  hideGlobalFilter
};
