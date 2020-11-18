import { rhsmTypes } from '../types';
import { rhsmServices } from '../../services/rhsmServices';

/**
 * Get a combined RHSM response from reporting and capacity using a general type
 *
 * @param {string} id
 * @param {object} query
 * @returns {Function}
 */
const getReportsCapacity = (id = null, query = {}) => dispatch =>
  dispatch({
    type: rhsmTypes.GET_REPORT_CAPACITY_RHSM,
    payload: Promise.all([rhsmServices.getGraphReports(id, query), rhsmServices.getGraphCapacity(id, query)]),
    meta: {
      id,
      query,
      notifications: {}
    }
  });

/**
 * Get a combined RHSM response from reporting and capacity using a graph specific type
 *
 * @param {string} id
 * @param {object} query
 * @returns {Function}
 */
const getGraphReportsCapacity = (id = null, query = {}) => dispatch =>
  dispatch({
    type: rhsmTypes.GET_GRAPH_REPORT_CAPACITY_RHSM,
    payload: Promise.all([rhsmServices.getGraphReports(id, query), rhsmServices.getGraphCapacity(id, query)]),
    meta: {
      id,
      query,
      notifications: {}
    }
  });

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

const rhsmActions = { getGraphReportsCapacity, getHostsInventory, getHostsInventoryGuests, getReportsCapacity };

export {
  rhsmActions as default,
  rhsmActions,
  getGraphReportsCapacity,
  getHostsInventory,
  getHostsInventoryGuests,
  getReportsCapacity
};
