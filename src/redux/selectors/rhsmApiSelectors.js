import { createSelectorCreator, defaultMemoize } from 'reselect';
import _isEqual from 'lodash/isEqual';
import { apiQueries } from '../common';
import { selector as userSession } from './userSelectors';

/**
 * Create a custom "are objects equal" selector.
 *
 * @private
 * @type {Function}}
 */
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, _isEqual);

/**
 * Return a combined state, props object.
 *
 * @private
 * @param {object} state
 * @param {object} props
 * @returns {object}
 */
const statePropsFilter = (state, props = {}) => ({
  ...state.inventory?.hostsInventory?.[props.productId],
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
  const { inventoryHostsQuery: query } = apiQueries.parseRhsmQuery(
    {
      ...props.query,
      ...state.view?.query?.[props.productId],
      ...state.view?.query?.[props.viewId]
    },
    {
      inventoryHostsQuery: {
        ...state.view?.inventoryHostsQuery?.[props.productId],
        ...state.view?.inventoryHostsQuery?.[props.viewId]
      }
    }
  );

  return query;
};

/**
 * Create selector, transform combined state, props into a consumable object.
 *
 * @type {{pending: boolean, fulfilled: boolean, listData: object, error: boolean, status: (*|number)}}
 */
const selector = createDeepEqualSelector([statePropsFilter, queryFilter], (response, query = {}) => {
  const { metaId, ...responseData } = response || {};

  const updatedResponseData = {
    error: responseData.error || false,
    fulfilled: false,
    pending: responseData.pending || responseData.cancelled || false,
    data: [],
    itemCount: 0,
    query,
    status: responseData.status
  };

  if (responseData.fulfilled) {
    const { data = [], meta = {} } = responseData.data || {};

    updatedResponseData.listData.length = 0;
    updatedResponseData.itemCount = meta.count;
    updatedResponseData.data = data;
    updatedResponseData.fulfilled = true;
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
  ...userSession(state, props, defaultProps),
  ...selector(state, props, defaultProps)
});

const rhsmApiSelectors = {
  list: selector,
  makeList: makeSelector
};

export { rhsmApiSelectors as default, rhsmApiSelectors, selector, makeSelector };
