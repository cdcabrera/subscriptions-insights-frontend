import React from 'react';
import { ProductContext } from '../components/productView/productContext';
import { useSelector } from '../redux';

/**
 * Generate queries.
 *
 * @param {string} queryType
 * @returns {object}
 */
const useQueryContext = (queryType = 'query') => {
  const { [queryType]: initialQuery, productId, viewId } = React.useContext(ProductContext) || {};
  const queryProduct = useSelector(({ view }) => view?.[queryType]?.[productId]);
  const queryView = useSelector(({ view }) => view?.[queryType]?.[viewId]);

  return {
    ...initialQuery,
    ...queryProduct,
    ...queryView
  };
};

/**
 * Expose query.
 *
 * @returns {object}
 */
const useQuery = () => useQueryContext();

/**
 * Expose query used for tally/capacity graph.
 *
 * @returns {object}
 */
const useGraphTallyQuery = () => ({ ...useQuery(), ...useQueryContext('graphTallyQuery') });

/**
 * Expose query used for hosts inventory.
 *
 * @returns {object}
 */
const useInventoryHostsQuery = () => ({ ...useQuery(), ...useQueryContext('inventoryHostsQuery') });

/**
 * Expose query used for subscriptions inventory.
 *
 * @returns {object}
 */
const useInventorySubscriptionsQuery = () => ({ ...useQuery(), ...useQueryContext('inventorySubscriptionsQuery') });

export { useQueryContext, useQuery, useGraphTallyQuery, useInventoryHostsQuery, useInventorySubscriptionsQuery };
