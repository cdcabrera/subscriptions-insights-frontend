// import { AxiosConfig } from '../common/serviceConfig';
import { serviceCall } from '../common/api';
import { rbacConfig } from '../../config';
import { platformSchemas } from './platformSchemas';
import { platformTransformers } from './platformTransformers';
import { PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES as USER_PERMISSION_TYPES } from './platformConstants';
import { helpers } from '../../common';

/**
 * Basic user authentication, use emulated serviceCall for transforms.
 *
 * @param {object} options
 * @returns {Promise<void>}
 */
const getUser = async (options = {}) => {
  const { insights } = window;
  const { cache = true, schema = [platformSchemas.user], transform = [platformTransformers.user] } = options;

  return serviceCall({
    url: async () => insights.chrome.auth.getUser(),
    cache,
    schema,
    transform
  });
};

/**
 * Basic user permissions, use emulated service call for transforms.
 *
 * @param {string} appName
 * @param {object} permissions
 * @param {object} options
 * @returns {Promise<void>}
 */
const getUserPermissions = (appName, permissions = rbacConfig, options = {}) => {
  const { insights } = window;
  const {
    cache = true,
    schema = [platformSchemas.permissions],
    transform = [platformTransformers.permissions]
  } = options;
  const updatedPermissions = Object.keys(permissions);
  return serviceCall({
    url: async () => {
      let userPermissions;

      if (appName) {
        userPermissions = await insights.chrome.getUserPermissions(appName);
      } else if (updatedPermissions.length) {
        const allPermissions = await Promise.all(
          updatedPermissions.map(app => insights.chrome.getUserPermissions(app))
        );

        if (Array.isArray(allPermissions) && allPermissions.filter(value => value !== undefined).length) {
          userPermissions = [...allPermissions.flat()];
        }
      }

      if (helpers.DEV_MODE) {
        userPermissions = [
          {
            [USER_PERMISSION_TYPES.PERMISSION]: process.env.REACT_APP_DEBUG_PERMISSION_APP_ONE
          },
          {
            [USER_PERMISSION_TYPES.PERMISSION]: process.env.REACT_APP_DEBUG_PERMISSION_APP_TWO
          }
        ];
      }

      if (!userPermissions) {
        throw new Error(`{ getUserPermissions } = insights.chrome, permissions undefined`);
      }

      return userPermissions;
    },
    cache,
    schema,
    transform
  });
  // return setup.serviceCall();
};

/**
 * Disables the Platform's global filter display.
 *
 * @param {boolean} isHidden
 * @returns {Promise<*>}
 */
const hideGlobalFilter = async (isHidden = true) => {
  const { insights } = window;
  try {
    await insights.chrome.hideGlobalFilter(isHidden);
  } catch (e) {
    throw new Error(`{ on } = insights.chrome, ${e.message}`);
  }
};

/**
 * Help initialize global platform methods.
 *
 * @returns {Promise<void>}
 */
const initializeChrome = async () => {
  const { insights } = window;
  try {
    await insights.chrome.init();
  } catch (e) {
    throw new Error(`{ init } = insights.chrome, ${e.message}`);
  }
};

/**
 * Apply on "app_navigation" event. Return an un-listener.
 *
 * @param {Function} callback
 * @returns {Function}
 */
const onNavigation = callback => {
  const { insights } = window;
  try {
    return insights.chrome.on('APP_NAVIGATION', callback);
  } catch (e) {
    throw new Error(`{ on } = insights.chrome, ${e.message}`);
  }
};

// FixMe: Revert catch to throwing an error. Relaxed for development
/**
 * Set application ID.
 *
 * @param {string} name
 * @returns {Promise<void>}
 */
const setAppName = async (name = null) => {
  const { insights } = window;
  try {
    await insights.chrome.identifyApp(name);
  } catch (e) {
    const error = `{ identifyApp } = insights.chrome, ${e.message}`;
    await Promise.reject(error);
  }
};

/**
 * Set app routes via the platform left-nav navigation.
 *
 * @param {string} id The navigation ID associated with internal route config, and external platform nav config
 * @param {object} options
 * @param {string} options.appName
 * @param {boolean} options.secondaryNav
 * @returns {Promise<object>}
 */
const setAppNav = async (id, { appName = helpers.UI_NAME, secondaryNav = true } = {}) => {
  const { insights } = window;
  try {
    return await insights.chrome.appNavClick({ id, secondaryNav, parentId: appName });
  } catch (e) {
    throw new Error(`{ appNavClick } = insights.chrome, ${e.message}`);
  }
};

const platformServices = {
  getUser,
  getUserPermissions,
  hideGlobalFilter,
  initializeChrome,
  onNavigation,
  setAppName,
  setAppNav
};

export {
  platformServices as default,
  platformServices,
  getUser,
  getUserPermissions,
  hideGlobalFilter,
  initializeChrome,
  onNavigation,
  setAppName,
  setAppNav
};
