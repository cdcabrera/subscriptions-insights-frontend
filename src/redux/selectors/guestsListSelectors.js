import { createSelectorCreator, defaultMemoize } from 'reselect';
import moment from 'moment';
import _isEqual from 'lodash/isEqual';
import { rhsmApiTypes } from '../../types/rhsmApiTypes';
import { reduxHelpers } from '../common/reduxHelpers';
import { getCurrentDate } from '../../common/dateHelpers';

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
 * @type {{dataId: {string}, data: {object}}}
 */
const selectorCache = { dataId: null, data: {} };

/**
 * Return a combined state, props object.
 *
 * @private
 * @param {object} state
 * @param {object} props
 * @returns {object}
 */
const statePropsFilter = (state, props = {}) => ({
  ...state.inventory?.hostsGuests?.[props.queryId],
  ...{
    viewId: props.viewId,
    // query: props.query,
    queryId: props.queryId
  }
});

/**
 * Create selector, transform combined state, props into a consumable object.
 *
 * @type {{pending: boolean, fulfilled: boolean, listData: object, error: boolean, status: (*|number)}}
 */
const selector = createDeepEqualSelector([statePropsFilter], response => {
  // const { viewId = null, query = {}, queryId = null, metaId, metaQuery = {}, ...responseData } = response || {};
  const { viewId = null, queryId = null, metaId, metaQuery = {}, ...responseData } = response || {};

  const updatedResponseData = {
    error: responseData.error || false,
    fulfilled: false,
    pending: responseData.pending || responseData.cancelled || false,
    listData: [],
    itemCount: 0,
    status: responseData.status
  };

  // const responseMetaQuery = { ...metaQuery };

  // const cache = (viewId && queryId && selectorCache.data[`${viewId}_${queryId}_${JSON.stringify(query)}`]) || undefined;
  const cache = (viewId && queryId && selectorCache.data[`${viewId}_${queryId}`]) || undefined;

  Object.assign(updatedResponseData, { ...cache });

  // Reset cache on viewId update
  if (viewId && selectorCache.dataId !== viewId) {
    selectorCache.dataId = viewId;
    selectorCache.data = {};
  }
  console.log('SEL >>>', selectorCache);

  // if (responseData.fulfilled && queryId === metaId && _isEqual(query, responseMetaQuery)) {
  if (responseData.fulfilled && queryId === metaId) {
    // if (responseData.fulfilled) {
    const {
      [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA]: listData = [],
      [rhsmApiTypes.RHSM_API_RESPONSE_META]: listMeta = {}
    } = responseData.data || {};

    // updatedResponseData.listData.length = 0;

    // Apply "display logic" then return a custom value for entries
    const customInventoryValue = ({ key, value }) => {
      switch (key) {
        case rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA_TYPES.LAST_SEEN:
          return moment.utc(value).from(getCurrentDate()) || null;
        default:
          return value ?? null;
      }
    };

    // Generate normalized properties
    const [updatedListData, updatedListMeta] = reduxHelpers.setNormalizedResponse(
      {
        schema: rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_GUESTS_DATA_TYPES,
        data: listData,
        customResponseValue: customInventoryValue
      },
      {
        schema: rhsmApiTypes.RHSM_API_RESPONSE_META_TYPES,
        data: listMeta
      }
    );

    const [meta = {}] = updatedListMeta || [];

    // Update response and cache
    updatedResponseData.itemCount = meta[rhsmApiTypes.RHSM_API_RESPONSE_META_TYPES.COUNT] ?? 0;

    // console.log('SEL 3 >>>', updatedResponseData.listData);

    // if (updatedResponseData.itemCount > updatedResponseData.listData.length) {
    updatedResponseData.listData = [...updatedResponseData.listData, ...updatedListData];
    // }
    updatedResponseData.fulfilled = true;
    // selectorCache.data[`${viewId}_${queryId}_${JSON.stringify(query)}`] = {
    selectorCache.data[`${viewId}_${queryId}`] = {
      ...updatedResponseData
    };

    console.log('SEL 2 >>>', updatedResponseData.listData.length, updatedResponseData.itemCount);

    if (updatedResponseData.listData.length >= updatedResponseData.itemCount) {
      delete selectorCache.data[`${viewId}_${queryId}`];
    }
  }

  console.log('SEL 3 >>>', updatedResponseData.listData);

  return updatedResponseData;
});

/**
 * Expose selector instance. For scenarios where a selector is reused across component instances.
 *
 * @param {object} defaultProps
 * @returns {{pending: boolean, fulfilled: boolean, graphData: object, error: boolean, status: (*|number)}}
 */
const makeSelector = defaultProps => (state, props) => ({
  ...selector(state, props, defaultProps)
});

const guestsListSelectors = {
  guestsList: selector,
  makeGuestsList: makeSelector
};

export { guestsListSelectors as default, guestsListSelectors, selector, makeSelector };
