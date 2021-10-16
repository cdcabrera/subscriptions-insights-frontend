import { reactReduxHooks } from './useReactRedux';
import { rhsmTypes } from '../types/rhsmTypes';
import { rhsmServices } from '../../services/rhsmServices';

/**
 * ToDo: Expand useGetGraphTallyCapacity to include actual capacity.
 * Initially we're only pulling the refactored Tally response, this needs to expand
 * to include the capacity facet which should include the same product and metric ID
 * formats.
 */
/**
 * Get a RHSM response from reporting.
 *
 * @param {string|Array} id String ID, or an array of product and metric IDs
 * @param {object} query
 * @returns {Function}
 */
const useGetGraphTallyCapacity = (id = null, query = {}) =>
  reactReduxHooks.useDispatch()({
    type: rhsmTypes.GET_GRAPH_TALLY_CAPACITY_RHSM,
    payload: rhsmServices.getGraphTally(id, query, { cancelId: 'graphTally' }),
    meta: {
      id,
      query,
      notifications: {}
    }
  });

/**
 * Get an updated store RHSM response from message reporting.
 *
 * @param {string} id
 * @param {object} query
 * @returns {Function}
 */
const useGetMessageReports = (id = null, query = {}) =>
  reactReduxHooks.useDispatch()({
    type: rhsmTypes.GET_MESSAGE_REPORTS_RHSM,
    payload: rhsmServices.getGraphReports(id, query, { cancelId: 'messageReport' }),
    meta: {
      id,
      query,
      notifications: {}
    }
  });

const rhsmActionsHooks = {
  useGetGraphTallyCapacity,
  useGetMessageReports
};

export { rhsmActionsHooks as default, rhsmActionsHooks, useGetGraphTallyCapacity, useGetMessageReports };
