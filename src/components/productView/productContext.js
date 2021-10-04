import React, { useContext } from 'react';
import { storeHooks } from '../../redux';

/**
 * Route context.
 *
 * @type {React.Context<{}>}
 */
const DEFAULT_CONTEXT = {};

const ProductContext = React.createContext(DEFAULT_CONTEXT);

/**
 * Get a router context.
 *
 * @returns {React.Context<{}>}
 */
const useProductContext = () => useContext(ProductContext);

/**
 * Return a query object from initial product config and Redux store.
 *
 * @param {string} queryType An identifier used to pull from both config and Redux, they should named the same.
 * @returns {object}
 */
const useProductQueryFactory = queryType => {
  const { [queryType]: initialQuery, productId, viewId } = useContext(ProductContext) || {};
  const queryProduct = storeHooks.reactRedux.useSelector(({ view }) => view?.[queryType]?.[productId]);
  const queryView = storeHooks.reactRedux.useSelector(({ view }) => view?.[queryType]?.[viewId]);

  return {
    ...initialQuery,
    ...queryProduct,
    ...queryView
  };
};

/**
 * Return a base product query
 *
 * @returns {object}
 */
const useProductQuery = () => useProductQueryFactory('query');

/**
 * Return the graph query based off of tally and capacity.
 *
 * @returns {object}
 */
const useProductGraphTallyQuery = () => ({ ...useProductQuery, ...useProductQueryFactory('graphTallyQuery') });

/**
 * Return an inventory query for hosts.
 *
 * @returns {object}
 */
const useProductInventoryHostsQuery = () => ({ ...useProductQuery, ...useProductQueryFactory('inventoryHostsQuery') });

/**
 * Return an inventory query for subscriptions.
 *
 * @returns {object}
 */
const useProductInventorySubscriptionsQuery = () => ({
  ...useProductQuery,
  ...useProductQueryFactory('inventorySubscriptionsQuery')
});

const context = {
  ProductContext,
  DEFAULT_CONTEXT,
  useProductContext,
  useQuery: useProductQuery,
  useQueryFactory: useProductQueryFactory,
  useGraphTallyQuery: useProductGraphTallyQuery,
  useInventoryHostsQuery: useProductInventoryHostsQuery,
  useSubscriptionsQuery: useProductInventorySubscriptionsQuery
};

export {
  context as default,
  context,
  ProductContext,
  DEFAULT_CONTEXT,
  useProductContext,
  useProductQuery,
  useProductQueryFactory,
  useProductGraphTallyQuery,
  useProductInventoryHostsQuery,
  useProductInventorySubscriptionsQuery
};
