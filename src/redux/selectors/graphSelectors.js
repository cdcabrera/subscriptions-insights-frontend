import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import _isEqual from 'lodash/isEqual';
import {
  rhsmConstants,
  RHSM_API_RESPONSE_TALLY_DATA_TYPES as TALLY_DATA_TYPES,
  RHSM_API_RESPONSE_TALLY_META_TYPES as TALLY_META_TYPES
} from '../../services/rhsm/rhsmConstants';
// import {helpers} from "../common";

const createASelector = (selectors, callback) => {
  const resultsCache = [];
  let callbackCache;

  return (...args) => {
    try {
      let shouldFire = false;

      selectors.forEach((sel, index) => {
        const selectorResults = sel(...args);

        // If the result isn't equal to the previous result.
        if (!_isEqual(selectorResults, resultsCache[index])) {
          shouldFire = true;
          resultsCache[index] = selectorResults;
        }
      });

      if (shouldFire) {
        callbackCache = callback(...resultsCache);
      }
    } catch (e) {
      // if (helpers.DEV_MODE) {
      console.warn(`reduxHelpers.createSelector, ${e.message}`);
      // }
    }

    return callbackCache;
  };
};

/**
 * Create a custom "are objects equal" selector.
 *
 * @private
 * @type {Function}}
 */
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, _isEqual);

const doit = [];

/**
 * Return a combined state, props object.
 *
 * @private
 * @param {object} state
 * @param {object} props
 * @param {object} data
 * @param {Array} data.metrics
 * @param {string} data.productId
 * @returns {object}
 */
const statePropsFilter = (state, props, { metrics = [], productId } = {}) => {
  const selectedMetrics = {};

  metrics.forEach(metricId => {
    selectedMetrics[metricId] = state.graph.tally?.[`${productId}_${metricId}`] || {};
  });

  return {
    ...selectedMetrics
  };
};

/**
 * Create selector, transform combined state, props into a consumable object.
 *
 * @type {{ metrics: object }}
 */
const selector = createDeepEqualSelector([statePropsFilter], response => {
  console.log('GRAPH SEL BEFORE >>>', response);

  const metrics = response || {};
  const updatedResponseData = { pending: false, fulfilled: false, error: false, metrics: {} };
  const objEntries = Object.entries(metrics);
  let isPending = false;
  let isFulfilled = false;
  let errorCount = 0;

  objEntries.forEach(([metric, metricValue]) => {
    const { pending, cancelled, error, fulfilled, data: metricData, ...metricResponse } = metricValue;
    const { [rhsmConstants.RHSM_API_RESPONSE_DATA]: data = [], [rhsmConstants.RHSM_API_RESPONSE_META]: meta = {} } =
      metricData || {};
    const updatedPending = pending || cancelled || false;

    if (updatedPending) {
      isPending = true;
    }

    if (fulfilled) {
      isFulfilled = true;
    }

    if (error) {
      errorCount += 1;
    }

    updatedResponseData.metrics[metric] = {
      ...metricResponse,
      pending: updatedPending,
      error,
      fulfilled,
      data: data.map(
        (
          { [TALLY_DATA_TYPES.DATE]: date, [TALLY_DATA_TYPES.VALUE]: value, [TALLY_DATA_TYPES.HAS_DATA]: hasData },
          index
        ) => ({
          x: index,
          y: value,
          date,
          hasData
        })
      ),
      meta: {
        count: meta[TALLY_META_TYPES.COUNT] || 0,
        metricId: meta[TALLY_META_TYPES.METRIC_ID],
        productId: meta[TALLY_META_TYPES.PRODUCT],
        totalMonthly: {
          date: meta[TALLY_META_TYPES.TOTAL_MONTHLY]?.[TALLY_META_TYPES.DATE],
          hasData: meta[TALLY_META_TYPES.TOTAL_MONTHLY]?.[TALLY_META_TYPES.HAS_DATA],
          value: meta[TALLY_META_TYPES.TOTAL_MONTHLY]?.[TALLY_META_TYPES.VALUE]
        }
      }
    };
  });

  if (errorCount === objEntries.length) {
    updatedResponseData.error = true;
  } else if (isPending) {
    updatedResponseData.pending = true;
  } else if (isFulfilled) {
    updatedResponseData.fulfilled = true;
  }

  doit.push(updatedResponseData);

  console.log('GRAPH SEL AFTER >>>', updatedResponseData);
  console.log('GRAPH SEL AFTER >>>', doit);

  return updatedResponseData;
});

/**
 * Expose selector instance. For scenarios where a selector is reused across component instances.
 *
 * @param {object} data Pass additional data.
 * @returns {{metrics: object}}
 */
const makeSelector = data => (state, props) => ({
  ...selector(state, props, data)
});

const graphSelectors = {
  graph: selector,
  makeGraph: makeSelector
};

export { graphSelectors as default, graphSelectors, selector, makeSelector };
