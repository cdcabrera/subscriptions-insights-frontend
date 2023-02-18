import { platformActions } from './platformActions';
import { rhsmActions } from './rhsmActions';
import { userActions } from './userActions';

/**
 * @memberof Redux State
 * @module Actions
 * @property {module} PlatformActions
 * @property {module} RhsmActions
 * @property {module} UserActions
 */

/**
 * Redux actions
 *
 * @type {{rhsm: {getInstancesInventory: Function, getMessageReports: Function, getHostsInventoryGuests: Function,
 *      getGraphMetrics: Function, getHostsInventory: Function, getSubscriptionsInventory: Function},
 *     user: {deleteAccountOptIn: Function, updateAccountOptIn: Function, getAccountOptIn: Function, getLocale: Function},
 *     platform: {authorizeUser: Function, onNavigation: Function, setAppName: Function, removeNotification: Function,
 *      setAppNav: Function, addNotification: Function, clearNotifications: Function, initializeChrome: Function,
 *      hideGlobalFilter: Function}}}
 */
const actions = {
  platform: platformActions,
  rhsm: rhsmActions,
  user: userActions
};

const reduxActions = { ...actions };

export { reduxActions as default, reduxActions, platformActions, rhsmActions, userActions };
