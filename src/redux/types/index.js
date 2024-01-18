/**
 * @memberof Types
 * @module ReduxTypes
 */

/**
 * Application action, reducer types.
 *
 * @type {{STATUS_4XX: string, SET_PRODUCT_VARIANT: string, SET_PRODUCT: string, STATUS_5XX: string}}
 */
const appTypes = {
  STATUS_4XX: '4XX',
  STATUS_5XX: '5XX',
  SET_PRODUCT: 'SET_PRODUCT',
  SET_PRODUCT_VARIANT: 'SET_PRODUCT_VARIANT'
};

/**
 * Graph action, reducer types.
 *
 * @type {{SET_GRAPH_LEGEND: string}}
 */
const graphTypes = {
  SET_GRAPH_LEGEND: 'SET_GRAPH_LEGEND'
};

/**
 * Inventory action, reducer types.
 *
 * @type {{SET_INVENTORY_TAB: string}}
 */
const inventoryTypes = {
  SET_INVENTORY_TAB: 'SET_INVENTORY_TAB'
};

/**
 * Banner message action, reducer types.
 *
 * @type {{SET_BANNER_MESSAGES: string}}
 */
const messageTypes = {
  SET_BANNER_MESSAGES: 'SET_BANNER_MESSAGES'
};

/**
 * Platform action, reducer types.
 *
 * @type {{PLATFORM_USER_AUTH: string, PLATFORM_GLOBAL_FILTER_HIDE: string}}
 */
const platformTypes = {
  PLATFORM_GLOBAL_FILTER_HIDE: 'PLATFORM_GLOBAL_FILTER_HIDE',
  PLATFORM_USER_AUTH: 'PLATFORM_USER_AUTH'
};

/**
 * Query/filter action, reducer types.
 *
 * @type {{SET_QUERY_INVENTORY_GUESTS: string, SET_QUERY_INVENTORY_INSTANCES: string, SET_QUERY_GRAPH: string,
 *     SET_QUERY_INVENTORY_SUBSCRIPTIONS: string, SET_QUERY: string}}
 */
const queryTypes = {
  SET_QUERY: 'SET_QUERY',
  SET_QUERY_GRAPH: 'SET_QUERY_GRAPH',
  SET_QUERY_INVENTORY_GUESTS: 'SET_QUERY_INVENTORY_GUESTS',
  SET_QUERY_INVENTORY_INSTANCES: 'SET_QUERY_INVENTORY_INSTANCES',
  SET_QUERY_INVENTORY_SUBSCRIPTIONS: 'SET_QUERY_INVENTORY_SUBSCRIPTIONS'
};

/**
 * RHSM API action, reducer types.
 *
 * @type {{GET_GRAPH_CAPACITY_RHSM: string, GET_INSTANCES_INVENTORY_GUESTS_RHSM: string,
 *     GET_SUBSCRIPTIONS_INVENTORY_RHSM: string, GET_INSTANCES_INVENTORY_RHSM: string, GET_GRAPH_TALLY_RHSM: string}}
 */
const rhsmTypes = {
  GET_GRAPH_CAPACITY_RHSM: 'GET_GRAPH_CAPACITY_RHSM',
  GET_GRAPH_TALLY_RHSM: 'GET_GRAPH_TALLY_RHSM',
  GET_INSTANCES_INVENTORY_RHSM: 'GET_INSTANCES_INVENTORY_RHSM',
  GET_INSTANCES_INVENTORY_GUESTS_RHSM: 'GET_INSTANCES_INVENTORY_GUESTS_RHSM',
  GET_SUBSCRIPTIONS_INVENTORY_RHSM: 'GET_SUBSCRIPTIONS_INVENTORY_RHSM'
};

/**
 * Filter, toolbar action, reducer types.
 *
 * @type {{SET_FILTER_TYPE: string, SET_ACTIVE_FILTERS: string}}
 */
const toolbarTypes = {
  SET_ACTIVE_FILTERS: 'SET_ACTIVE_FILTERS',
  SET_FILTER_TYPE: 'SET_FILTER_TYPE'
};

/**
 * User action, reducer types.
 *
 * @type {{USER_LOCALE: string, UPDATE_USER_OPTIN: string}}
 */
const userTypes = {
  UPDATE_USER_OPTIN: 'UPDATE_USER_OPTIN',
  USER_LOCALE: 'USER_LOCALE'
};

const reduxTypes = {
  app: appTypes,
  graph: graphTypes,
  inventory: inventoryTypes,
  message: messageTypes,
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
  messageTypes,
  platformTypes,
  queryTypes,
  rhsmTypes,
  toolbarTypes,
  userTypes
};
