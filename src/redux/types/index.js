import { appTypes } from './appTypes';
import { graphTypes } from './graphTypes';
import { inventoryTypes } from './inventoryTypes';
import { platformTypes } from './platformTypes';
import { queryTypes } from './queryTypes';
import { rhsmTypes } from './rhsmTypes';
import { toolbarTypes } from './toolbarTypes';
import { userTypes } from './userTypes';

/**
 * @memberof Redux State
 * @module Types
 * @property {module} AppTypes
 * @property {module} GraphTypes
 * @property {module} InventoryTypes
 * @property {module} PlatformTypes
 * @property {module} QueryTypes
 * @property {module} RhsmTypes
 * @property {module} ToolbarTypes
 * @property {module} UserTypes
 */

/**
 * Redux types
 *
 * @type {{app: {STATUS_4XX: string, STATUS_5XX: string}, toolbar: {SET_FILTER_TYPE: string, SET_ACTIVE_FILTERS: string},
 *     rhsm: {GET_GRAPH_REPORT_CAPACITY_RHSM: string, GET_MESSAGE_REPORTS_RHSM: string, GET_HOSTS_INVENTORY_GUESTS_RHSM: string,
 *     GET_GRAPH_CAPACITY_RHSM: string, GET_SUBSCRIPTIONS_INVENTORY_RHSM: string, GET_HOSTS_INVENTORY_RHSM: string,
 *     GET_INSTANCES_INVENTORY_RHSM: string, GET_GRAPH_TALLY_RHSM: string},
 *     query: {SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_TYPES: object,
 *     SET_QUERY_RHSM_TYPES: object, SET_QUERY_RHSM_GUESTS_INVENTORY_TYPES: object, SET_QUERY_CLEAR: string,
 *     SET_QUERY_CLEAR_INVENTORY_LIST: string, SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES: object, SET_QUERY: string,
 *     SET_QUERY_RESET_INVENTORY_LIST: string, SET_QUERY_CLEAR_INVENTORY_GUESTS_LIST: string},
 *     inventory: {CLEAR_INVENTORY_GUESTS: string, SET_INVENTORY_TAB: string}, user: {USER_LOGOUT: string, USER_LOCALE: string,
 *     GET_USER_OPTIN: string, UPDATE_USER_OPTIN: string, DELETE_USER_OPTIN: string}, graph: {SET_GRAPH_LEGEND: string},
 *     platform: {PLATFORM_APP_NAME: string, PLATFORM_USER_AUTH: string, PLATFORM_GLOBAL_FILTER_HIDE: string,
 *     PLATFORM_INIT: string, PLATFORM_SET_NAV: string, PLATFORM_CLEAR_NOTIFICATIONS: string, PLATFORM_ADD_NOTIFICATION: string,
 *     PLATFORM_REMOVE_NOTIFICATION: string, PLATFORM_ON_NAV: string}}}
 */
const reduxTypes = {
  app: appTypes,
  graph: graphTypes,
  inventory: inventoryTypes,
  platform: platformTypes,
  query: queryTypes,
  rhsm: rhsmTypes,
  toolbar: toolbarTypes,
  user: userTypes
};

export {
  reduxTypes as default,
  reduxTypes,
  appTypes,
  graphTypes,
  inventoryTypes,
  platformTypes,
  queryTypes,
  rhsmTypes,
  toolbarTypes,
  userTypes
};
