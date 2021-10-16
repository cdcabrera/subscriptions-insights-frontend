import _isPlainObject from 'lodash/isPlainObject';
import { rhsmTypes } from '../types';
import { rhsmServices } from '../../services/rhsmServices';

/**
 * Get a combined RHSM response from reporting and capacity.
 *
 * @param {string} id
 * @param {object} query
 * @param {object} options
 * @param {string} options.cancelId
 * @returns {Function}
 */
const getGraphReportsCapacity = (id = null, query = {}, options = {}) => dispatch => {
  const { cancelId = 'graphReportsCapacity' } = options;

  return dispatch({
    type: rhsmTypes.GET_GRAPH_REPORT_CAPACITY_RHSM,
    payload: Promise.all([
      rhsmServices.getGraphReports(id, query, { cancelId }),
      rhsmServices.getGraphCapacity(id, query, { cancelId })
    ]),
    meta: {
      id,
      query,
      notifications: {}
    }
  });
};

/**
 * Get a combined RHSM response from multiple Tally IDs and metrics.
 *
 * @param {string|Array} id An array of objects in the form of [{ id: PRODUCT_ID, metric: METRIC_ID }]
 * @param {object} query
 * @param {object} options
 * @param {string} options.cancelId
 * @returns {Function}
 */
const getGraphTally = (id = null, query = {}, options = {}) => dispatch => {
  const { cancelId = 'graphTally' } = options;
  const idList =
    (typeof id === 'string' && [{ id }]) || (Array.isArray(id) && id) || (_isPlainObject(id) && [id]) || [];
  const updatedIds = [];
  const promiseList = [];

  idList.forEach(value => {
    let updatedValue;

    if (typeof value === 'string') {
      updatedValue = { id: value, metric: undefined };
    } else if (_isPlainObject(value) && value.id) {
      updatedValue = value;
    }

    if (updatedValue) {
      updatedIds.push(updatedValue);
      promiseList.push(
        rhsmServices.getGraphTally(updatedValue, query, { cancelId: `${cancelId}_${JSON.stringify(updatedValue)}` })
      );
    }
  });

  return dispatch({
    type: rhsmTypes.GET_GRAPH_TALLY_RHSM,
    payload: Promise.all(promiseList),
    meta: {
      id: updatedIds,
      query,
      notifications: {}
    }
  });
};

/**
 * Get a hosts response listing from RHSM subscriptions.
 *
 * @param {string} id
 * @param {object} query
 * @returns {Function}
 */
const getHostsInventory = (id = null, query = {}) => dispatch =>
  dispatch({
    type: rhsmTypes.GET_HOSTS_INVENTORY_RHSM,
    payload: rhsmServices.getHostsInventory(id, query),
    meta: {
      id,
      query,
      notifications: {}
    }
  });

/**
 * Get a host's guest response listing from RHSM subscriptions.
 *
 * @param {string} id
 * @param {object} query
 * @returns {Function}
 */
const getHostsInventoryGuests = (id = null, query = {}) => dispatch =>
  dispatch({
    type: rhsmTypes.GET_HOSTS_INVENTORY_GUESTS_RHSM,
    payload: rhsmServices.getHostsInventoryGuests(id, query),
    meta: {
      id,
      query,
      notifications: {}
    }
  });

/**
 * Get a RHSM response from message reporting.
 *
 * @param {string} id
 * @param {object} query
 * @returns {Function}
 */
const getMessageReports = (id = null, query = {}) => dispatch =>
  dispatch({
    type: rhsmTypes.GET_MESSAGE_REPORTS_RHSM,
    payload: rhsmServices.getGraphReports(id, query, { cancelId: 'messageReport' }),
    meta: {
      id,
      query,
      notifications: {}
    }
  });

/**
 * Get a subscriptions response from RHSM subscriptions.
 *
 * @param {string} id
 * @param {object} query
 * @returns {Function}
 */
const getSubscriptionsInventory = (id = null, query = {}) => dispatch =>
  dispatch({
    type: rhsmTypes.GET_SUBSCRIPTIONS_INVENTORY_RHSM,
    payload: rhsmServices.getSubscriptionsInventory(id, query),
    meta: {
      id,
      query,
      notifications: {}
    }
  });

const rhsmActions = {
  getGraphReportsCapacity,
  getGraphTally,
  getHostsInventory,
  getHostsInventoryGuests,
  getMessageReports,
  getSubscriptionsInventory
};

export {
  rhsmActions as default,
  rhsmActions,
  getGraphReportsCapacity,
  getGraphTally,
  getHostsInventory,
  getHostsInventoryGuests,
  getMessageReports,
  getSubscriptionsInventory
};
