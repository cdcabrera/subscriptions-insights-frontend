import { createSelector } from 'reselect';
import moment from 'moment';
import _isEqual from 'lodash/isEqual';
import _camelCase from 'lodash/camelCase';
import { rhsmApiTypes } from '../../types/rhsmApiTypes';
import { reduxHelpers } from '../common/reduxHelpers';

/**
 * Selector cache.
 *
 * @private
 * @type {{dataId: {string}, data: {object}}}
 */
const inventoryListCache = { dataId: null, data: {} };

/**
 * Return a combined state, props object.
 *
 * @private
 * @param {object} state
 * @param {object} props
 * @returns {object}
 */
const inventoryResponse = (state, props = {}) => ({
  ...state.inventory?.hostsInventory?.[props.productId],
  ...{
    viewId: props.viewId,
    productId: props.productId,
    query: props.query
  }
});

/**
 * Create selector, transform combined state, props into a consumable object.
 *
 * @type {{pending: boolean, fulfilled: boolean, inventoryData: object, error: boolean, status: (*|number)}}
 */
const inventoryListSelector = createSelector([inventoryResponse], response => {
  const { viewId = null, productId = null, query = {}, metaId, metaQuery = {}, ...responseData } = response || {};

  const updatedResponseData = {
    error: responseData.error || false,
    fulfilled: false,
    pending: responseData.pending || responseData.cancelled || false,
    inventoryData: [],
    status: responseData.status
  };

  const responseMetaQuery = { ...metaQuery };

  const cache =
    (viewId && productId && inventoryListCache.data[`${viewId}_${productId}_${JSON.stringify(query)}`]) || undefined;

  Object.assign(updatedResponseData, { ...cache });

  if (viewId && inventoryListCache.dataId !== viewId) {
    inventoryListCache.dataId = viewId;
    inventoryListCache.data = {};
  }

  if (responseData.fulfilled && productId === metaId && _isEqual(query, responseMetaQuery)) {
    const inventory = responseData.data;
    const inventoryData = inventory?.[rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA] || [];

    updatedResponseData.inventoryData.length = 0;

    // Populate expected API response values with undefined
    const [hostsSchema = {}] = reduxHelpers.setResponseSchemas([rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA_TYPES]);

    // Apply "display logic" then return a custom value for entries
    const customInventoryValue = ({ key, value }) => {
      switch (key) {
        case rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA_TYPES.LAST_SEEN:
          return (value && moment.utc(value).startOf('day').toDate()) || null;
        default:
          return value ?? null;
      }
    };

    // Generate reflected properties
    inventoryData.forEach(value => {
      const generateReflectedData = ({ dataObj, keyPrefix = '', customValue = null }) => {
        const updatedDataObj = {};

        Object.keys(dataObj).forEach(dataObjKey => {
          const casedDataObjKey = _camelCase(`${keyPrefix} ${dataObjKey}`).trim();

          if (typeof customValue === 'function') {
            updatedDataObj[casedDataObjKey] = customValue({ data: dataObj, key: dataObjKey, value: value[dataObjKey] });
          } else {
            updatedDataObj[casedDataObjKey] = value[dataObjKey];
          }
        });

        updatedResponseData.inventoryData.push(updatedDataObj);
      };

      generateReflectedData({ dataObj: { ...hostsSchema, ...value }, customValue: customInventoryValue });
    });

    // Update response and cache
    updatedResponseData.fulfilled = true;
    inventoryListCache.data[`${viewId}_${productId}_${JSON.stringify(query)}`] = {
      ...updatedResponseData
    };
  }

  return updatedResponseData;
});

/**
 * Expose selector instance. For scenarios where a selector is reused across component instances.
 *
 * @param {object} defaultProps
 * @returns {{pending: boolean, fulfilled: boolean, graphData: object, error: boolean, status: (*|number)}}
 */
const makeInventoryListSelector = defaultProps => (state, props) => ({
  ...inventoryListSelector(state, props, defaultProps)
});

const graphCardSelectors = {
  inventoryList: inventoryListSelector,
  makeInventoryList: makeInventoryListSelector
};

export { graphCardSelectors as default, graphCardSelectors, inventoryListSelector, makeInventoryListSelector };
