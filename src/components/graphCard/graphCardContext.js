import { useMemo, useState } from 'react';
import { useShallowCompareEffect } from 'react-use';
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
 * @param {object|Array} metrics
 * @param {object} options
 * @param {Function} options.useProduct
 * @param {Function} options.useSelector
 * @returns {*}
 */
const useGraphTallySelector = (
  metrics,
  { useProduct: useAliasProduct = useProduct, useSelector: useAliasSelector = storeHooks.reactRedux.useSelector } = {}
) => {
  const [updatedMetrics, setUpdatedMetrics] = useState([]);

  useShallowCompareEffect(() => {
    const updated = (typeof metrics === 'string' && [metrics]) || (Array.isArray(metrics) && metrics) || [];
    setUpdatedMetrics(updated);
  }, [metrics]);

  const { productId } = useAliasProduct() || {};
  const graphSelector = useMemo(() => reduxSelectors.graph.makeGraph({ productId, metrics: updatedMetrics }), [
    productId,
    updatedMetrics
  ]);

  return useAliasSelector(state => graphSelector(state));
};

/**
 * Get a combined result from action and selector.
 *
 * @param {object} options
 * @param {Function} options.useGetGraphTally
 * @param {Function} options.useGraphTallySelector
 * @param {Function} options.useProduct
 * @param {Function} options.useProductGraphConfig
 * @param {Function} options.useProductGraphTallyQuery
 * @returns {{pending: boolean, fulfilled: boolean, metrics: object, error: boolean}}
 */
const useGraphMetrics = ({
  useGetGraphTally: useAliasGetGraphTally = useGetGraphTally,
  useGraphTallySelector: useAliasGraphTallySelector = useGraphTallySelector,
  useProduct: useAliasProduct = useProduct,
  useProductGraphConfig: useAliasProductGraphConfig = useProductGraphConfig,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery = useProductGraphTallyQuery
} = {}) => {
  const { productId } = useAliasProduct();
  const { filters } = useAliasProductGraphConfig();
  const query = useAliasProductGraphTallyQuery();
  const metricIds = filters.map(filter => filter.id);
  const getGraphTally = useAliasGetGraphTally();
  const { error, fulfilled, pending, metrics } = useAliasGraphTallySelector(metricIds) || {};

  useShallowCompareEffect(() => {
    const {
      [RHSM_API_QUERY_SET_TYPES.START_DATE]: startDate,
      [RHSM_API_QUERY_SET_TYPES.END_DATE]: endDate,
      [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: granularity
    } = query;

    if (granularity && startDate && endDate && productId) {
      getGraphTally(
        metricIds.map(metricId => ({ id: productId, metric: metricId })),
        query
      );
    }
  }, [getGraphTally, productId, metricIds, query]);

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
