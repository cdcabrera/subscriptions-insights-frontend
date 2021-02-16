import { createSelectorCreator, defaultMemoize } from 'reselect';
import moment from 'moment';
import _isEqual from 'lodash/isEqual';
import _camelCase from 'lodash/camelCase';
import { apiQueries } from '../common';

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
  ...state.graph?.reportCapacity?.[props.productId]
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
 * Create selector, transform combined state, props into a consumable graph/charting object.
 *
 * @type {{pending: boolean, fulfilled: boolean, graphData: object, error: boolean, status: (*|number)}}
 */
const selector = createDeepEqualSelector([statePropsFilter, queryFilter], (response, query = {}) => {
  const { metaId, ...responseData } = response || {};

  const updatedResponseData = {
    error: responseData.error || false,
    fulfilled: false,
    pending: responseData.pending || responseData.cancelled || false,
    graphData: {},
    query,
    status: responseData.status
  };

  if (responseData.fulfilled) {
    const [report, capacity] = responseData.data;
    const reportData = report?.data || [];
    const capacityData = capacity?.data || [];

    /**
     * ToDo: Reevaluate this reset on graphData when working with Reselect's memoize.
     * Creating a new object i.e. updatedResponseData.graphData = {}; causes an update,
     * which in turn causes the graph to reload and flash.
     */
    Object.keys(updatedResponseData.graphData).forEach(graphDataKey => {
      updatedResponseData.graphData[graphDataKey] = [];
    });

    // Apply "display logic" then return a custom value for Reporting graph entries
    const customReportValue = (data, key, presetData) => ({
      ...data,
      ...presetData
    });

    // Apply "display logic" then return a custom value for Capacity graph entries
    const customCapacityValue = (data, key, { date, x, y }) => ({
      ...data,
      date,
      x,
      y: data.hasInfiniteQuantity === true ? null : y
    });

    // Generate reflected graph data for number, undefined, and null
    reportData.forEach((value, index) => {
      const date = moment.utc(value.date).startOf('day').toDate();

      const generateGraphData = ({ graphDataObj, keyPrefix = '', customValue = null }) => {
        Object.keys(graphDataObj).forEach(graphDataObjKey => {
          if (
            typeof graphDataObj[graphDataObjKey] === 'number' ||
            graphDataObj[graphDataObjKey] === undefined ||
            graphDataObj[graphDataObjKey] === null
          ) {
            const casedGraphDataObjKey = _camelCase(`${keyPrefix} ${graphDataObjKey}`).trim();

            if (!updatedResponseData.graphData[casedGraphDataObjKey]) {
              updatedResponseData.graphData[casedGraphDataObjKey] = [];
            }

            let generatedY = graphDataObj[graphDataObjKey];

            if (graphDataObj[graphDataObjKey] === undefined) {
              generatedY = 0;
            }

            const updatedItem =
              (typeof customValue === 'function' &&
                customValue(graphDataObj, graphDataObjKey, { date, x: index, y: generatedY })) ||
              {};

            updatedResponseData.graphData[casedGraphDataObjKey][index] = {
              date,
              x: index,
              y: generatedY,
              ...updatedItem
            };
          }
        });
      };

      generateGraphData({ graphDataObj: { ...value }, customValue: customReportValue });
      generateGraphData({
        graphDataObj: { ...capacityData[index] },
        keyPrefix: 'threshold',
        customValue: customCapacityValue
      });
    });

    updatedResponseData.fulfilled = true;
  }

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

const graphCardSelectors = {
  graphCard: selector,
  makeGraphCard: makeSelector
};

export { graphCardSelectors as default, graphCardSelectors, selector, makeSelector };
