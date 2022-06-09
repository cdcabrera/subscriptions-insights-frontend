import React, { useContext } from 'react';
import { useShallowCompareEffect } from 'react-use';
import { reduxActions, storeHooks } from '../../redux';
import { useProduct, useProductGraphTallyQuery } from '../productView/productViewContext';
import { helpers } from '../../common/helpers';

/**
 * Chart context.
 *
 * @type {React.Context<{}>}
 */
const DEFAULT_CONTEXT = [{ settings: { isStandalone: false, metrics: [], metric: undefined } }, helpers.noop];

const GraphCardContext = React.createContext(DEFAULT_CONTEXT);

/**
 * Get an updated graph card context.
 *
 * @returns {React.Context<{}>}
 */
const useGraphCardContext = () => useContext(GraphCardContext);

/**
 * Transform multiple metrics from store for chart/graph consumption.
 *
 * @param {object} options
 * @param {Function} options.useGraphCardContext
 * @param {Function} options.useSelectorsResponse
 * @returns {{data: {}, pending: boolean, fulfilled: boolean, responses: {errorList: *[], errorId: {},
 *     id: {}, list: *[]}, cancelled: boolean, dataSets: unknown[], message: null, error: boolean}}
 */
const useMetricsSelector = ({
  useGraphCardContext: useAliasGraphCardContext = useGraphCardContext,
  // useProduct: useAliasProduct = useProduct,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsAllSettledResponse
} = {}) => {
  // const { productId } = useAliasProduct();
  const { settings = {} } = useAliasGraphCardContext();
  const { metrics = [] } = settings;
  console.log('>>>>>', metrics);

  const {
    error,
    fulfilled,
    pending,
    data = [],
    ...response
  } = useAliasSelectorsResponse(
    metrics.map(
      ({ id: metricId, isCapacity }) =>
        ({ graph }) =>
          isCapacity ? graph.capacity?.[metricId] : graph.tally?.[metricId]
      // ? graph.capacity?.[`${metricId}${(query?.category && `_${query?.category}`) || ''}_${productId}`]
      // : graph.tally?.[`${metricId}${(query?.category && `_${query.category}`) || ''}_${productId}`]
    )
  );

  /**
   * Apply graph config settings to metric data.
   */
  const dataById = {};
  const dataByList = data?.map((metricData, index) => {
    const updatedMetricData = {
      ...metrics[index],
      ...metricData
      // id: metrics[index]?.meta?._id || metrics[index].id
    };
    dataById[metrics[index].id] = updatedMetricData;
    // dataById[metrics[index]?.meta?._id || metrics[index].id] = updatedMetricData;
    return updatedMetricData;
  });

  return {
    ...response,
    data: dataById,
    dataSets: dataByList,
    error,
    fulfilled,
    pending
  };
};

/**
 * Get graph metrics from Tally or Capacity.
 *
 * @param {object} params
 * @param {Function} params.getGraphMetrics
 * @param {Function} params.useDispatch
 * @param {Function} params.useGraphCardContext
 * @param {Function} params.useMetricsSelector
 * @param {Function} params.useProduct
 * @param {Function} params.useProductGraphTallyQuery
 * @returns {{data: {}, pending: boolean, fulfilled: boolean, responses: {errorList: *[], errorId: {},
 *     id: {}, list: *[]}, cancelled: boolean, dataSets: *[], message: null, error: boolean}}
 */
const useGetMetrics = ({
  getGraphMetrics = reduxActions.rhsm.getGraphMetrics,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useGraphCardContext: useAliasGraphCardContext = useGraphCardContext,
  useMetricsSelector: useAliasMetricsSelector = useMetricsSelector,
  useProduct: useAliasProduct = useProduct,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery = useProductGraphTallyQuery
} = {}) => {
  const { productId } = useAliasProduct();
  const query = useAliasProductGraphTallyQuery();
  const dispatch = useAliasDispatch();
  const { settings = {} } = useAliasGraphCardContext();
  const { metrics = [] } = settings;

  const response = useAliasMetricsSelector();

  useShallowCompareEffect(() => {
    const updatedMetrics = metrics.map(({ metric: metricId, isCapacity, query: metricQuery }) => ({
      id: productId,
      metric: metricId,
      isCapacity,
      query: metricQuery
    }));
    getGraphMetrics(updatedMetrics, query)(dispatch);
  }, [dispatch, getGraphMetrics, metrics, productId, query]);

  return response;
};

const context = {
  GraphCardContext,
  DEFAULT_CONTEXT,
  useGetMetrics,
  useGraphCardContext,
  useMetricsSelector
};

export {
  context as default,
  context,
  GraphCardContext,
  DEFAULT_CONTEXT,
  useGetMetrics,
  useGraphCardContext,
  useMetricsSelector
};
