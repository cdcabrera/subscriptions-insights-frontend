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
 * Get a specific export download package.
 *
 * @param {Array} idList
 * @returns {Function}
 */
const getExport = idList => dispatch =>
  dispatch({
    type: platformTypes.SET_PLATFORM_EXPORT_DOWNLOAD,
    payload: platformServices.getExports(idList)
  });
/*
 *const updatedId = (Array.isArray(downloads) && downloads) || [downloads];
 *const multiDispatch = [];
 *
 *updatedId.forEach(({ id, fileName }) => {
 *  multiDispatch.push({
 *    type: platformTypes.SET_PLATFORM_EXPORT_STATUS,
 *    payload: platformServices.getExport(id, { fileName })
 *  });
 *});
 *
 *return Promise.all(dispatch(multiDispatch));
 */
/**
 * Return a "dispatch ready" export poll status check.
 *
 * @param {Function} dispatch
 * @returns {Function}
 */
const setExportStatus =
  dispatch =>
  (success = {}, error) =>
    dispatch({
      type: platformTypes.SET_PLATFORM_EXPORT_STATUS,
      payload: (error && Promise.reject(error)) || Promise.resolve(success)
    });

/**
 * Get a specific, or all, export status.
 *
 * @param {object} options Apply polling options
 * @returns {Function}
 */
const getExportStatus =
  (options = {}) =>
  dispatch =>
    dispatch({
      type: platformTypes.SET_PLATFORM_EXPORT_STATUS,
      payload: platformServices.getExportStatus(undefined, undefined, {
        ...options,
        poll: { ...options.poll, status: setExportStatus(dispatch) }
      })
    });

/**
 * Create an export for download.
 *
 * @param {object} data
 * @param {object} options Apply polling options
 * @returns {Function}
 */
const createExport =
  (id, data = {}, options = {}) =>
  dispatch => {
    // const generatedId = helpers.generateHash(data);
    dispatch(removeNotification('swatch-downloads-pending'));

    dispatch([
      {
        type: platformTypes.SET_PLATFORM_EXPORT_CREATE,
        payload: platformServices.postExport(data, {
          ...options,
          poll: {
            ...options.poll,
            status: (successResponse, ...args) => {
              console.log('>>> export success', successResponse);

              dispatch(addNotification({ title: 'hello world' }));
              setExportStatus(dispatch)(successResponse, ...args);
            }
          }
        }),
        meta: {
          id
        }
      },
      addNotification({
        id: 'swatch-downloads-pending',
        variant: 'info',
        title: translate('curiosity-toolbar.notifications', {
          context: ['export', 'pending', 'title'],
          count: 1
        }),
        dismissable: true,
        autoDismiss: false
      })
    ]);
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
  getExport,
  setExportStatus,
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
  getExport,
  setExportStatus,
  getExportStatus,
  hideGlobalFilter
};
