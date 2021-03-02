import React from 'react';
import { useSelector } from '../../redux';

/**
 * Product context.
 *
 * @type {React.Context<{}>}
 */
const ProductContext = React.createContext({});

const useRouteContext = productId => {
  const { [productId]: productConfig = {} } = React.useContext(ProductContext) || {};
  const { productLabel, viewId } = productConfig;
  return {
    productId,
    productLabel,
    viewId
  };
};

const useFilterContext = (productId, filterType = 'Graph') => {
  const { [productId]: productConfig = {} } = React.useContext(ProductContext) || {};
  const {
    [`initial${filterType}Filters`]: filters = [],
    [`initial${filterType}Settings`]: settings = {}
  } = productConfig;
  return {
    filters,
    settings
  };
};

const useGraphFilters = productId => useFilterContext(productId);

const useInventoryFilters = productId => useFilterContext(productId, 'Inventory');

const useSubscriptionsInventoryFilters = productId => useFilterContext(productId, 'SubscriptionsInventory');

/**
 * Generate queries.
 *
 * @param {string} productId
 * @param {string} queryType
 * @returns {object}
 */
const useQueryContext = (productId, queryType = 'query') => {
  const { [productId]: productConfig = {} } = React.useContext(ProductContext) || {};
  const { [queryType]: initialQuery, viewId } = productConfig;

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
 * @param {string} productId
 * @returns {object}
 */
const useQuery = productId => useQueryContext(productId);

/**
 * Expose query used for tally/capacity graph.
 *
 * @param {string} productId
 * @returns {object}
 */
const useGraphTallyQuery = productId => ({ ...useQuery(productId), ...useQueryContext(productId, 'graphTallyQuery') });
/*
const useGraphTallyQuery = productId => {
  // console.log(useQuery(productId));
  // console.log(useQueryContext(productId, 'graphTallyQuery'));
  // console.log({ ...useQuery(productId), ...useQueryContext(productId, 'graphTallyQuery') });
  // return { [productId]: productId };
  return { ...useQuery(productId), ...useQueryContext(productId, 'graphTallyQuery') };
};
*/
// ({ [productId]: productId }); // productId => ({ ...useQuery(productId), ...useQueryContext(productId, 'graphTallyQuery') });

/**
 * Expose query used for hosts inventory.
 *
 * @param {string} productId
 * @returns {object}
 */
const useInventoryHostsQuery = productId => ({
  ...useQuery(productId),
  ...useQueryContext(productId, 'inventoryHostsQuery')
});

/**
 * Expose query used for subscriptions inventory.
 *
 * @param {string} productId
 * @returns {object}
 */
const useInventorySubscriptionsQuery = productId => ({
  ...useQuery(productId),
  ...useQueryContext(productId, 'inventorySubscriptionsQuery')
});

export {
  ProductContext as default,
  ProductContext,
  useFilterContext,
  useRouteContext,
  useGraphFilters,
  useInventoryFilters,
  useSubscriptionsInventoryFilters,
  useQueryContext,
  useQuery,
  useGraphTallyQuery,
  useInventoryHostsQuery,
  useInventorySubscriptionsQuery
};
