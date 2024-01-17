import { rhsmTypes } from '../types';
import { rhsmServices } from '../../services/rhsm/rhsmServices';
import { generateChartIds } from '../../components/graphCard/graphCardHelpers';

/**
 * RHSM service wrappers for dispatch, state update.
 *
 * @memberof Actions
 * @module RhsmActions
 */

/**
 * Get a RHSM response from multiple Tally, or Capacity, IDs and metrics.
 *
 * @param {object|Array} idMetric An object, or an Array of objects, in the form of { id: PRODUCT_ID, metric: METRIC_ID,
 *     isCapacity: boolean }
 * @param {object} query
 * @param {object} options
 * @param {string} options.cancelId
 * @returns {Function}
 */
const getGraphMetrics =
  (idMetric = {}, query = {}, options = {}) =>
  dispatch => {
    const { cancelId = 'graphTally' } = options;
    const multiMetric = (Array.isArray(idMetric) && idMetric) || [idMetric];
    const multiDispatch = [];

    multiMetric.forEach(({ id, metric, isCapacity, query: metricQuery }) => {
      const methodService = isCapacity ? rhsmServices.getGraphCapacity : rhsmServices.getGraphTally;
      const methodType = isCapacity ? rhsmTypes.GET_GRAPH_CAPACITY_RHSM : rhsmTypes.GET_GRAPH_TALLY_RHSM;
      const methodCancelId = isCapacity ? 'graphCapacity' : cancelId;
      const generatedId = generateChartIds({ isCapacity, metric, productId: id, query: metricQuery });

      multiDispatch.push({
        type: methodType,
        payload: methodService(
          [id, metric],
          { ...query, ...metricQuery },
          {
            cancelId: `${methodCancelId}_${generatedId}`
          }
        ),
        meta: {
          id: generatedId,
          query: { ...query, ...metricQuery },
          notifications: {}
        }
      });
    });

    return Promise.all(dispatch(multiDispatch));
  };

const rhsmActions = {
  getGraphMetrics
};

export { rhsmActions as default, rhsmActions, getGraphMetrics };
