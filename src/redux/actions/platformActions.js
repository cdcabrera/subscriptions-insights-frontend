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
  (id, success = {}, error) =>
    dispatch({
      type: platformTypes.SET_PLATFORM_EXPORT_STATUS,
      payload: (error && Promise.reject(error)) || Promise.resolve(success),
      meta: {
        id
      }
    });

/**
 * Get a specific, or all, export status.
 *
 * @param {object} options Apply polling options
 * @returns {Function}
 */
const getExportStatus =
  (options = {}) =>
  dispatch => {
    dispatch(removeNotification('swatch-downloads-pending'));

    dispatch([
      {
        type: platformTypes.SET_PLATFORM_EXPORT_STATUS,
        payload: platformServices.getExportStatus(undefined, undefined, {
          ...options,
          poll: {
            ...options.poll,
            // status: (...args) => setExportStatus(dispatch)('global', ...args)
            status: (successResponse, ...args) => {
              console.log('>>> export success', successResponse);
              if (!successResponse?.data?.data?.isAnythingPending) {
                dispatch(removeNotification('swatch-downloads-pending'));
              }

              if (!successResponse?.data?.data?.isAnythingPending && successResponse?.data?.data?.isAnythingCompleted) {
                dispatch(
                  addNotification({ title: `Product reports ready, ${successResponse?.data?.data.completed.length}` })
                );
              }

              setExportStatus(dispatch)('global', successResponse, ...args);
            }
          }
        })
      },
      addNotification({
        id: 'swatch-downloads-pending',
        title: translate('curiosity-toolbar.notifications', {
          context: ['export', 'pending', 'title'],
          count: 1
        }),
        dismissable: true,
        autoDismiss: true
      })
    ]);
  };

const getExistingExports =
  (options = {}) =>
  dispatch => {
    // const generatedId = helpers.generateHash(data);
    dispatch(removeNotification('swatch-global-export'));

    dispatch([
      {
        type: platformTypes.SET_PLATFORM_EXPORT_STATUS,
        payload: platformServices.getExistingExports(undefined, {
          ...options,
          poll: {
            ...options.poll,
            status: (successResponse, ...args) => {
              console.log('>>> export success', successResponse);
              if (!successResponse?.data?.data?.isAnythingPending) {
                dispatch(removeNotification('swatch-global-export'));
              }

              if (!successResponse?.data?.data?.isAnythingPending && successResponse?.data?.data?.isAnythingCompleted) {
                dispatch(
                  addNotification({
                    id: 'swatch-global-export',
                    variant: 'success',
                    title: `Product reports ready, ${successResponse?.data?.data.completed.length}`
                  })
                );
              }

              setExportStatus(dispatch)('global', successResponse, ...args);
            }
          }
        }),
        meta: {
          id: 'global'
        }
      },
      addNotification({
        id: 'swatch-global-export',
        title: translate('curiosity-toolbar.notifications', {
          context: ['export', 'pending', 'title'],
          count: 1
        }),
        dismissable: true,
        autoDismiss: true
      })
    ]);
  };

/**
 * Create an export for download.
 *
 * @param id
 * @param {object} data
 * @param {object} options Apply polling options
 * @returns {Function}
 */
const createExport =
  (id, data = {}, options = {}) =>
  dispatch => {
    // const generatedId = helpers.generateHash(data);
    dispatch(removeNotification('swatch-global-export'));

    dispatch([
      {
        type: platformTypes.SET_PLATFORM_EXPORT_CREATE,
        payload: platformServices.postExport(data, {
          ...options,
          poll: {
            ...options.poll,
            status: (successResponse, ...args) => {
              console.log('>>> export success', successResponse);
              if (!successResponse?.data?.data?.isAnythingPending) {
                dispatch(removeNotification('swatch-global-export'));
              }

              if (successResponse?.data?.data?.products?.[id]?.isCompleted) {
                dispatch(addNotification({ variant: 'success', title: `Product report ready, ${id}` }));
              }

              setExportStatus(dispatch)(id, successResponse, ...args);
            }
          }
        })
      },
      addNotification({
        id: 'swatch-global-export',
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
  getExport,
  setExportStatus,
  getExportStatus,
  getExistingExports,
  hideGlobalFilter
};
