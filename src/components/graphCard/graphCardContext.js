import React, { useContext, useMemo, useState, useEffect } from 'react';
import { useDeepCompareEffect, useShallowCompareEffect } from 'react-use';
import { useSelector } from 'react-redux';
import { reduxActions, reduxSelectors, storeHooks } from '../../redux';
import { useProduct, useProductGraphConfig, useProductGraphTallyQuery } from '../productView/productViewContext';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { helpers } from '../../common/helpers';

// TODO: eval moving context into "metric" and "metrics" components instead
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
 * Consume Redux RHSM Actions, getGraphTally.
 *
 * @param {object} options
 * @param {string} options.cancelId
 * @param {Function} options.useDispatch
 * @returns {Function}
 */
const useGetGraphTallyOLD = ({
  cancelId = 'graphTally',
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch
} = {}) => {
  const dispatch = useAliasDispatch();
  return (idMetric = {}, query = {}) => reduxActions.rhsm.getGraphTally(idMetric, query, { cancelId })(dispatch);
};

const useGetGraphTallyWORKSISH = ({
  getGraphTally = reduxActions.rhsm.getGraphTally,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useGraphCardContext: useAliasGraphCardContext = useGraphCardContext,
  useProduct: useAliasProduct = useProduct,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery = useProductGraphTallyQuery
} = {}) => {
  const { productId } = useAliasProduct();
  const query = useAliasProductGraphTallyQuery();
  const dispatch = useAliasDispatch();
  const { settings = {} } = useAliasGraphCardContext();
  const { metrics = [] } = settings;

  useShallowCompareEffect(() => {
    const {
      [RHSM_API_QUERY_SET_TYPES.START_DATE]: startDate,
      [RHSM_API_QUERY_SET_TYPES.END_DATE]: endDate,
      [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: granularity
    } = query;

    if (granularity && startDate && endDate && productId) {
      getGraphTally(
        metrics.map(({ id: metricId }) => ({ id: productId, metric: metricId })),
        query
      )(dispatch);
    }
  }, [dispatch, productId, getGraphTally, metrics, query]);
};

/**
 * Consume Redux selector makeGraph.
 *
 * @param {object|Array} metricIds
 * @param {object} options
 * @param {Function} options.useProduct
 * @param {Function} options.useSelector
 * @returns {*}
 */
const useGraphTallySelectorOLD = (
  metricIds,
  { useProduct: useAliasProduct = useProduct, useSelector: useAliasSelector = storeHooks.reactRedux.useSelector } = {}
) =>
  /*
  const [updatedMetricIds, setUpdatedMetricIds] = useState([]);
  const [selResults, setSelectorResults] = useState([]);

  useDeepCompareEffect(() => {
    const updated = (typeof metricIds === 'string' && [metricIds]) || (Array.isArray(metricIds) && metricIds) || [];
    setUpdatedMetricIds(updated);
  }, [metricIds]);

  const { productId } = useAliasProduct() || {};
  const graphSelector = useMemo(() => reduxSelectors.graph.makeGraph({ productId, metrics: updatedMetricIds }), [
    productId,
    updatedMetricIds
  ]);
   */

  // const results = useAliasSelector(state => graphSelector(state));
  // return () => ({ ...results });
  /*
  const { productId } = useAliasProduct() || {};
  const graphSelector = useMemo(() => reduxSelectors.graph.makeGraph({ productId, metrics: updatedMetricIds }), [
    productId,
    updatedMetricIds
  ]);
  */

  // return useAliasSelector(state => graphSelector(state));
  ({});

const useGraphTallySelector = ({
  useGraphCardContext: useAliasGraphCardContext = useGraphCardContext,
  useProduct: useAliasProduct = useProduct,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector
} = {}) => {
  const { productId } = useAliasProduct();
  // const { settings = {} } = useAliasGraphCardContext();
  const { metrics = [] } = {};
  const data = {};

  console.log('METRICS >>>', metrics);

  const dataSets = useAliasSelector(({ graph }) =>
    metrics.map(({ id: metricId, ...metric }) => {
      const { data: responseData = {} } = graph.tally?.[`${productId}_${metricId}`] || {};
      const response = {
        ...metric,
        id: metricId,
        data: responseData?.data || [],
        meta: responseData?.meta || {}
      };

      data[metricId] = response;
      return response;
    })
  );

  console.log('SEL >>>>', dataSets);

  let isPending = false;
  let isFulfilled = false;
  let isError = false;
  let errorCount = 0;

  dataSets.forEach(({ pending, fulfilled, error, cancelled }) => {
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
  });

  if (errorCount === dataSets.length) {
    isError = true;
  } else if (isPending) {
    isPending = true;
  } else if (isFulfilled) {
    isFulfilled = true;
  }

  return {
    error: isError,
    fulfilled: isFulfilled,
    pending: isPending,
    data,
    dataSets
  };
  /*
  const { fulfilled, pending, error, data } =
        useSelector(({ graph }) => graph.tally?.[`${productId}_${metricId}`]) || {};
  return {
    fulfilled,
    pending,
    error,
    metrics: {
      [metricId]: {
        data: data?.data,
        meta: data?.meta
      }
    }
  };
  */
};
/**
 * Get a combined result from action and selector.
 *
 * @param {Array} metricIds
 * @param {object} options
 * @param {Function} options.useGetGraphTally
 * @param {Function} options.useGraphTallySelector
 * @param {Function} options.useProduct
 * @param {Function} options.useProductGraphTallyQuery
 * @param metricIds.useGetGraphTally
 * @param metricIds.useGraphTallySelector
 * @returns {{pending: boolean, fulfilled: boolean, metrics: object, error: boolean}}
 */
const useGraphMetrics = ({
  useGetGraphTally: useAliasGetGraphTally = useGetGraphTally,
  useGraphTallySelector: useAliasGraphTallySelector = useGraphTallySelector
} = {}) => {
  useAliasGetGraphTally();
  return useAliasGraphTallySelector() || {};
};

const useGraphMetricsOLD = (
  metricIds,
  {
    useGetGraphTally: useAliasGetGraphTally = useGetGraphTally,
    useGraphTallySelector: useAliasGraphTallySelector = useGraphTallySelector,
    useProduct: useAliasProduct = useProduct,
    useProductGraphTallyQuery: useAliasProductGraphTallyQuery = useProductGraphTallyQuery
  } = {}
) => {
  const { productId } = useAliasProduct();
  // const [updatedResponse, setUpdatedResponse] = useState({});
  // const [updatedMetricIds, setUpdatedMetricIds] = useState([]);
  const query = useAliasProductGraphTallyQuery();
  const updatedMetricIds = metricIds.map(filter => filter.id);
  const getGraphTally = useAliasGetGraphTally();
  // const doit = useAliasGraphTallySelector(updatedMetricIds) || {};
  // const { error, fulfilled, pending, metrics } = doit();
  // const selectorResponse = useAliasGraphTallySelector(updatedMetricIds) || {};
  const { error, fulfilled, pending, metrics } = useAliasGraphTallySelector(updatedMetricIds) || {};

  // useShallowCompareEffect(() => {
  //  setUpdatedMetricIds(metricIds.map(filter => filter.id));
  // }, [metricIds, setUpdatedMetricIds]);

  useShallowCompareEffect(() => {
    const {
      [RHSM_API_QUERY_SET_TYPES.START_DATE]: startDate,
      [RHSM_API_QUERY_SET_TYPES.END_DATE]: endDate,
      [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: granularity
    } = query;

    if (granularity && startDate && endDate && productId) {
      getGraphTally(
        updatedMetricIds.map(metricId => ({ id: productId, metric: metricId })),
        query
      );
    }
  }, [getGraphTally, productId, updatedMetricIds, query]);

  /*
  useDeepCompareEffect(() => {
    setUpdatedResponse(selectorResponse);
  }, [selectorResponse, setUpdatedResponse]);
  */

  // return {
  //  ...updatedResponse
  // };
  return {
    error,
    fulfilled,
    pending,
    metrics
  };
};

const context = {
  GraphCardContext,
  DEFAULT_CONTEXT,
  useGraphCardContext,
  // useGetGraphTally,
  useGraphTallySelector,
  useGraphMetrics
};

export {
  context as default,
  context,
  GraphCardContext,
  DEFAULT_CONTEXT,
  useGraphCardContext,
  useGraphMetrics,
  // useGetGraphTally,
  useGraphTallySelector
};
