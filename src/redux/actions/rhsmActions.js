// import { useCallback } from 'react';
// import { useDispatch } from 'react-redux';
import { useDispatch } from '../';
import { store } from '../store';
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

const useGetMessageReports = (id = null, query = {}) => {
  /*
  const dispatch = useDispatch();
  const actionDispatch = useCallback(
    () =>
      dispatch({
        type: rhsmTypes.GET_MESSAGE_REPORTS_RHSM,
        payload: rhsmServices.getGraphReports(id, query, { cancelId: 'messageReport' }),
        meta: {
          id,
          query,
          notifications: {}
        }
      }),
    [dispatch, id, query]
  );

  return actionDispatch();
  */
  const dispatch = useDispatch();

  return dispatch({
    type: rhsmTypes.GET_MESSAGE_REPORTS_RHSM,
    payload: rhsmServices.getGraphReports(id, query, { cancelId: 'messageReport' }),
    meta: {
      id,
      query,
      notifications: {}
    }
  });

  /*
  return store.dispatch({
    type: rhsmTypes.GET_MESSAGE_REPORTS_RHSM,
    payload: rhsmServices.getGraphReports(id, query, { cancelId: 'messageReport' }),
    meta: {
      id,
      query,
      notifications: {}
    }
  });
  */
  /*
  const dispatch = useDispatch();
  return dispatch({
    type: rhsmTypes.GET_MESSAGE_REPORTS_RHSM,
    payload: rhsmServices.getGraphReports(id, query, { cancelId: 'messageReport' }),
    meta: {
      id,
      query,
      notifications: {}
    }
  });
  */
  /*
  const dispatch = useDispatch();
  const callback = useCallback(
    () =>
      dispatch({
        type: rhsmTypes.GET_MESSAGE_REPORTS_RHSM,
        // payload: rhsmServices.getGraphReports(id, query, { cancelId: 'messageReport' }),
        meta: {
          id,
          query,
          notifications: {}
        }
      }),
    [dispatch, id, query]
  );

  console.log('ACTION >>>>>>', callback);

  return callback;
  */
};

const rhsmActions = {
  getGraphReportsCapacity,
  getHostsInventory,
  getHostsInventoryGuests,
  getMessageReports,
  getSubscriptionsInventory,
  useGetMessageReports
};

export {
  rhsmActions as default,
  rhsmActions,
  getGraphReportsCapacity,
  getHostsInventory,
  getHostsInventoryGuests,
  getMessageReports,
  getSubscriptionsInventory
};
