import { useMemo, useState } from 'react';
import { useDeepCompareEffect, useShallowCompareEffect } from 'react-use';
import { reduxActions, reduxSelectors, storeHooks } from '../../redux';
import { useProduct, useProductGraphConfig, useProductGraphTallyQuery } from '../productView/productViewContext';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';

/**
 * Consume Redux RHSM Actions, getGraphTally.
 *
 * @param {object} options
 * @param {string} options.cancelId
 * @param {Function} options.useDispatch
 * @returns {Function}
 */
const useGetGraphTally = ({
  cancelId = 'graphTally',
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch
} = {}) => {
  const dispatch = useAliasDispatch();
  return (idMetric = {}, query = {}) => reduxActions.rhsm.getGraphTally(idMetric, query, { cancelId })(dispatch);
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
const useGraphTallySelector = (
  metricIds,
  { useProduct: useAliasProduct = useProduct, useSelector: useAliasSelector = storeHooks.reactRedux.useSelector } = {}
) => {
  const [updatedMetricIds, setUpdatedMetricIds] = useState([]);

  useDeepCompareEffect(() => {
    const updated = (typeof metricIds === 'string' && [metricIds]) || (Array.isArray(metricIds) && metricIds) || [];
    setUpdatedMetricIds(updated);
  }, [metricIds]);

  const { productId } = useAliasProduct() || {};
  const graphSelector = useMemo(() => reduxSelectors.graph.makeGraph({ productId, metrics: updatedMetricIds }), [
    productId,
    updatedMetricIds
  ]);

  return useAliasSelector(state => graphSelector(state));
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
 * @returns {{pending: boolean, fulfilled: boolean, metrics: object, error: boolean}}
 */
const useGraphMetrics = (
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
  const { error, fulfilled, pending, metrics } = useAliasGraphTallySelector(updatedMetricIds) || {};
  // const selectorResponse = useAliasGraphTallySelector(updatedMetricIds) || {};

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
  useGetGraphTally,
  useGraphTallySelector,
  useGraphMetrics
};

export { context as default, context, useGraphMetrics, useGetGraphTally, useGraphTallySelector };
