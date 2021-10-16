import { createSelectorCreator, defaultMemoize } from 'reselect';
import LruCache from 'lru-cache';
import _isEqual from 'lodash/isEqual';
import { rhsmApiTypes } from '../../types/rhsmApiTypes';
import { reduxHelpers } from '../common/reduxHelpers';
import { apiQueries } from '../common';

/**
 * Create a custom "are objects equal" selector.
 *
 * @private
 * @type {Function}}
 */
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, _isEqual);

/**
 * Selector cache.
 *
 * @private
 * @type {object}
 */
const selectorCache = new LruCache({
  maxAge: Number.parseInt(process.env.REACT_APP_SELECTOR_CACHE, 10),
  max: 10,
  stale: true,
  updateAgeOnGet: true
});

/**
 * Return a combined state, props object.
 *
 * @private
 * @param {object} state
 * @param {object} props
 * @returns {object}
 */
const statePropsFilter = (state, props = {}) => ({
  ...state.graph?.tally?.[props.productId],
  ...{
    viewId: props.viewId,
    productId: props.productId
  }
});

/**
 * Return a combined query object.
 *
 * @param {object} state
 * @param {object} props
 * @returns {object}
 */
const queryFilter = (state, props = {}) => {
  const { graphTallyQuery: query } = apiQueries.parseRhsmQuery(
    {
      ...props.query,
      ...state.view?.query?.[props.productId],
      ...state.view?.query?.[props.viewId]
    },
    {
      graphTallyQuery: { ...state.view?.graphTallyQuery?.[props.viewId] }
    }
  );

  return query;
};

/**
 * Note: We use an in-memory cache to provide the user a pleasant UX experience. To
 * aid in that UX we need "pending" to fire in scenarios that are not loaded in-memory. Because
 * we load the cache first there are scenarios where the previous XHR call is still in state
 * when a subsequent fulfilled XHR call comes through. Without the _isEqual(query, metaQuery) check
 * the overlap of the prior fulfilled call interferes with the pending of the subsequent call.
 */
/**
 * Create selector, transform combined state, props into a consumable object.
 *
 * @type {{pending: boolean, fulfilled: boolean, listData: object, error: boolean, status: (*|number)}}
 */
const selector = createDeepEqualSelector([statePropsFilter, queryFilter], (response, query = {}) => {
  const { viewId = null, productId = null, metaId, metaQuery = {}, ...responseData } = response || {};

  const updatedProductId = typeof productId === 'string' ? productId : JSON.stringify(productId);
  const updatedMetaId = typeof metaId === 'string' ? productId : JSON.stringify(metaId);
  const updatedQuery = JSON.stringify(query);
  const updatedResponseData = {
    error: responseData.error || false,
    fulfilled: false,
    pending: responseData.pending || responseData.cancelled || false,
    graphData: {},
    query,
    status: responseData.status
  };

  const cache =
    (viewId && productId && selectorCache.get(`${viewId}_${updatedProductId}_${updatedQuery}`)) || undefined;

  Object.assign(updatedResponseData, { ...cache });

  if (responseData.fulfilled && updatedProductId === updatedMetaId && _isEqual(query, metaQuery)) {
    const tallyResults = responseData.data;

    tallyResults.forEach(tallyResult => {
      const {
        [rhsmApiTypes.RHSM_API_RESPONSE_DATA]: tallyData = [],
        [rhsmApiTypes.RHSM_API_RESPONSE_META]: tallyMeta = {}
      } = tallyResult || {};

      // Apply "display logic" then return a custom value
      const customTallyValue = ({ key, value }) => {
        switch (key) {
          case rhsmApiTypes.RHSM_API_RESPONSE_TALLY_DATA_TYPES.VALUE:
            if (typeof value === 'number') {
              return (
                (Number.isInteger(value) && Number.parseInt(value, 10)) ||
                Number.parseFloat(Number.parseFloat(value).toFixed(2))
              );
            }
            if (value === undefined) {
              return 0;
            }
            return null;
          case rhsmApiTypes.RHSM_API_RESPONSE_TALLY_DATA_TYPES.DATE:
            return (value && new Date(value)) || null;
          default:
            return value ?? null;
        }
      };

      const customTallyEntry = (
        {
          [rhsmApiTypes.RHSM_API_RESPONSE_TALLY_DATA_TYPES.DATE]: date,
          [rhsmApiTypes.RHSM_API_RESPONSE_TALLY_DATA_TYPES.VALUE]: value,
          [rhsmApiTypes.RHSM_API_RESPONSE_TALLY_DATA_TYPES.HAS_DATA]: hasData
        },
        index
      ) => ({
        x: index,
        y: value,
        date,
        hasData
      });

      // Apply "display logic" then return a custom value
      const customMetaValue = ({ key, value }) => {
        switch (key) {
          case rhsmApiTypes.RHSM_API_RESPONSE_TALLY_META_TYPES.TOTAL_MONTHLY:
            const {
              [rhsmApiTypes.RHSM_API_RESPONSE_TALLY_META_TOTAL_MONTHLY_TYPES.DATE]: totalMonthlyDate,
              [rhsmApiTypes.RHSM_API_RESPONSE_TALLY_META_TOTAL_MONTHLY_TYPES.VALUE]: totalMonthlyValue
            } = value;
            return {
              date: (totalMonthlyDate && new Date(totalMonthlyDate)) || null,
              value: totalMonthlyValue ?? null
            };
          default:
            return value ?? null;
        }
      };

      // Generate normalized properties
      const [updatedTallyData, updatedTallyMeta] = reduxHelpers.setNormalizedResponse(
        {
          schema: rhsmApiTypes.RHSM_API_RESPONSE_TALLY_DATA_TYPES,
          data: tallyData,
          customResponseValue: customTallyValue,
          customResponseEntry: customTallyEntry,
          keyCase: 'snake'
        },
        {
          schema: rhsmApiTypes.RHSM_API_RESPONSE_TALLY_META_TYPES,
          data: tallyMeta,
          customResponseValue: customMetaValue
        }
      );

      const { metricId } = updatedTallyMeta;

      updatedResponseData.graphData[metricId] = {
        ...updatedTallyMeta,
        data: updatedTallyData
      };
      updatedResponseData.fulfilled = true;
      selectorCache.set(`${viewId}_${updatedProductId}_${updatedQuery}`, { ...updatedResponseData });
    });
  }

  return updatedResponseData;
});

/**
 * Expose selector instance. For scenarios where a selector is reused across component instances.
 *
 * @param {object} defaultProps
 * @returns {{pending: boolean, fulfilled: boolean, graphData: object, error: boolean, session: object,
 *     status: (*|number)}}
 */
const makeSelector = defaultProps => (state, props) => ({
  ...selector(state, props, defaultProps)
});

const graphSelectors = {
  graph: selector,
  makeGraph: makeSelector
};

export { graphSelectors as default, graphSelectors, selector, makeSelector };
