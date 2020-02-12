import { createSelector } from 'reselect';
import moment from 'moment';
import _get from 'lodash/get';
import _camelCase from 'lodash/camelCase';
import { rhsmApiTypes } from '../../types/rhsmApiTypes';

const graphCardCache = { dataId: null, data: {} };

const graphComponent = (state, props = {}) => ({ ..._get(state, ['graph', 'component', props.viewId]) });

const graphResponse = (state, props = {}) => ({
  ..._get(state, ['graph', 'reportCapacity', props.productId]),
  ...{ viewId: props.viewId }
});

const graphCardSelector = createSelector(
  [graphResponse, graphComponent],
  (response, component) => {
    const { viewId = null, metaId = null, metaQuery = {}, ...responseData } = response || {};

    const productId = metaId;
    const responseGranularity = metaQuery[rhsmApiTypes.RHSM_API_QUERY_GRANULARITY] || null;

    let granularity = null;

    if (component.graphGranularity === responseGranularity || (!component.graphGranularity && responseData.fulfilled)) {
      granularity = responseGranularity;
    }

    const cachedGranularity =
      (viewId && granularity && productId && graphCardCache.data[`${viewId}_${productId}_${granularity}`]) || {};
    const initialLoad = typeof cachedGranularity.initialLoad === 'boolean' ? cachedGranularity.initialLoad : true;

    if (viewId && graphCardCache.dataId !== viewId) {
      graphCardCache.dataId = viewId;
      graphCardCache.data = {};
    }

    const updatedResponseData = {
      ...component,
      error: responseData.error,
      errorStatus: responseData.errorStatus,
      fulfilled: responseData.fulfilled,
      pending: responseData.pending,
      initialLoad,
      graphData: {},
      ...cachedGranularity
    };

    if (productId === null || granularity === null) {
      return updatedResponseData;
    }

    if (initialLoad) {
      updatedResponseData.pending = responseData.pending || false;
    }

    if (responseData.fulfilled && granularity && productId) {
      const tallyData = _get(responseData.data[0], [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA], []);
      const capacityData = _get(responseData.data[1], [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA], []);

      updatedResponseData.graphData = {};

      // ToDo: RHSM missing props, schema to compensate, confirm with API team
      const tallySchema = {};
      const capacitySchema = {};

      Object.values(rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES).forEach(value => {
        tallySchema[value] = undefined;
      });
      Object.values(rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES).forEach(value => {
        capacitySchema[value] = undefined;
      });

      tallyData.forEach((value, index) => {
        const date = moment
          .utc(value[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE])
          .startOf('day')
          .toDate();

        const generateGraphData = ({ graphDataObj, keyPrefix = '' }) => {
          Object.keys(graphDataObj).forEach(graphDataObjKey => {
            const casedGraphDataObjKey = _camelCase(`${keyPrefix} ${graphDataObjKey}`).trim();

            if (!updatedResponseData.graphData[casedGraphDataObjKey]) {
              updatedResponseData.graphData[casedGraphDataObjKey] = [];
            }

            let generatedY;

            if (typeof graphDataObj[graphDataObjKey] === 'number') {
              generatedY = Number.parseInt(graphDataObj[graphDataObjKey], 10);
            } else if (graphDataObj[graphDataObjKey] === undefined) {
              generatedY = 0;
            } else {
              generatedY = graphDataObj[graphDataObjKey];
            }

            updatedResponseData.graphData[casedGraphDataObjKey][index] = {
              date,
              x: index,
              y: generatedY
            };
          });
        };

        generateGraphData({ graphDataObj: { ...tallySchema, ...value } });
        generateGraphData({
          graphDataObj: { ...capacitySchema, ...capacityData[index] },
          keyPrefix: 'threshold'
        });
      });

      updatedResponseData.initialLoad = false;
      graphCardCache.data[`${viewId}_${productId}_${granularity}`] = { ...updatedResponseData };
    }

    return updatedResponseData;
  }
);

const makeGraphCardSelector = () => graphCardSelector;

const graphCardSelectors = {
  graphCard: graphCardSelector,
  makeGraphCard: makeGraphCardSelector
};

export { graphCardSelectors as default, graphCardSelectors, graphCardSelector, makeGraphCardSelector };
