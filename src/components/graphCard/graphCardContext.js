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

const useGetMetrics = ({
  // getGraphTally = reduxActions.rhsm.getGraphTally,
  // getGraphCapacity = reduxActions.rhsm.getGraphCapacity,
  getGraphMetrics = reduxActions.rhsm.getGraphMetrics,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useGraphCardContext: useAliasGraphCardContext = useGraphCardContext,
  useProduct: useAliasProduct = useProduct,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery = useProductGraphTallyQuery,
  // useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsAllSettledResponse
} = {}) => {
  const { productId } = useAliasProduct();
  const query = useAliasProductGraphTallyQuery();
  const dispatch = useAliasDispatch();
  const { settings = {} } = useAliasGraphCardContext();
  const { metrics = [] } = settings;

  const {
    error,
    fulfilled,
    pending,
    data = []
  } = useAliasSelectorsResponse(
    metrics.map(
      ({ id: metricId, isCapacity }) =>
        ({ graph }) =>
          isCapacity ? graph.capacity?.[`${productId}_${metricId}`] : graph.tally?.[`${productId}_${metricId}`]
    )
  );

  useShallowCompareEffect(() => {
    const updatedMetrics = metrics.map(({ id: metricId, isCapacity }) => ({
      id: productId,
      metric: metricId,
      isCapacity
    }));
    getGraphMetrics(updatedMetrics, query)(dispatch);
  }, [dispatch, getGraphMetrics, metrics, productId, query]);

  /**
   * Apply graph config settings to metric data.
   */
  const dataById = {};
  const dataByList = data?.map((metricData, index) => {
    const updatedMetricData = {
      ...metrics[index],
      ...metricData
    };
    dataById[metrics[index].id] = updatedMetricData;
    return updatedMetricData;
  });

  return {
    data: dataById,
    dataSets: dataByList,
    error,
    fulfilled,
    pending
  };
};

const useGetTally = ({
  getGraphTally = reduxActions.rhsm.getGraphTally,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useGraphCardContext: useAliasGraphCardContext = useGraphCardContext,
  useProduct: useAliasProduct = useProduct,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery = useProductGraphTallyQuery,
  // useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsAllSettledResponse
} = {}) => {
  const { productId } = useAliasProduct();
  const query = useAliasProductGraphTallyQuery();
  const dispatch = useAliasDispatch();
  const { settings = {} } = useAliasGraphCardContext();
  const { metrics = [] } = settings;

  const {
    error,
    fulfilled,
    pending,
    data = []
  } = useAliasSelectorsResponse(
    metrics.map(
      ({ id: metricId }) =>
        ({ graph }) =>
          graph.tally?.[`${productId}_${metricId}`]
    )
    // metrics.map(({ id: metricId }) => ({
    //  id: metricId,
    //  selector: ({ graph }) => graph.tally?.[`${productId}_${metricId}`]
    // }))
  );

  useShallowCompareEffect(() => {
    const updatedMetrics = metrics.map(({ id: metricId }) => ({ id: productId, metric: metricId }));
    getGraphTally(updatedMetrics, query)(dispatch);
  }, [dispatch, getGraphTally, metrics, productId, query]);

  /**
   * Apply graph config settings to metric data.
   */
  const dataById = {};
  const dataByList = data?.map((metricData, index) => {
    const updatedMetricData = {
      ...metrics[index],
      ...metricData
    };
    dataById[metrics[index].id] = updatedMetricData;
    return updatedMetricData;
  });

  return {
    data: dataById,
    dataSets: dataByList,
    error,
    fulfilled,
    pending
  };
};

const useGetTallyCapacity = () => {};

/**
 * Get multiple metrics from store.
 *
 * @param {object} options
 * @param {Function} options.useGraphCardContext
 * @param {Function} options.useSelectors
 * @param {Function} options.useProduct
 * @returns {{data: object, pending: boolean, fulfilled: boolean, dataSets: Array, error: boolean}}
 */
const useMetricsSelector = ({
  useGraphCardContext: useAliasGraphCardContext = useGraphCardContext,
  useSelectors: useAliasSelectors = storeHooks.reactRedux.useSelectors,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { productId } = useAliasProduct();
  const { settings = {} } = useAliasGraphCardContext();
  const { metrics = [] } = settings;
  const data = {};

  const metricResponses = useAliasSelectors(
    metrics.map(
      ({ id: metricId }) =>
        ({ graph }) =>
          graph.tally?.[`${productId}_${metricId}`]
    ),
    []
  );

  let isPending = false;
  let isFulfilled = false;
  let errorCount = 0;

  const dataSets = metricResponses.map((metric, index) => {
    const { pending, fulfilled, error, cancelled } = metric || {};
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

    const updatedMetric = {
      ...metrics[index],
      data: metric?.data?.data || [],
      meta: metric?.data?.meta || {}
    };
    data[metrics[index].id] = updatedMetric;

    return updatedMetric;
  });

  const response = {
    data,
    dataSets,
    error: false,
    fulfilled: false,
    pending: false
  };

  if (errorCount === dataSets.length) {
    response.error = true;
  } else if (isPending) {
    response.pending = true;
  } else if (isFulfilled) {
    response.fulfilled = true;
  }

  return response;
};

const context = {
  GraphCardContext,
  DEFAULT_CONTEXT,
  useGetMetrics,
  useGetTally,
  useGetTallyCapacity,
  useGraphCardContext,
  useMetricsSelector
};

export {
  context as default,
  context,
  GraphCardContext,
  DEFAULT_CONTEXT,
  // useGetGraphTally,
  useGetMetrics,
  useGetTally,
  useGetTallyCapacity,
  useGraphCardContext,
  useMetricsSelector
};
