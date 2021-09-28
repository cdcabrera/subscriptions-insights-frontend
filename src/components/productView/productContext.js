import React, { useContext } from 'react';
import { helpers } from '../../common/helpers';
import { useSelector } from '../../redux';
// import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { useRouteDetail } from '../router/routerContext';

/**
 * Route context.
 *
 * @type {React.Context<{}>}
 */
const DEFAULT_CONTEXT = [{}, helpers.noop];

const ProductContext = React.createContext(DEFAULT_CONTEXT);

/**
 * Get a router context.
 *
 * @returns {React.Context<{}>}
 */
const useProductContext = () => useContext(ProductContext);

const useQueryFactory = queryType => {
  const { [queryType]: initialQuery } = useProductContext() || {};

  const { pathParameter: productId, viewParameter: viewId } = useRouteDetail();
  const queryProduct = useSelector(({ view }) => view?.[queryType]?.[productId]);
  const queryView = useSelector(({ view }) => view?.[queryType]?.[viewId]);

  return {
    ...initialQuery,
    ...queryProduct,
    ...queryView
  };
};

const useQuery = () => useQueryFactory('query');

const useGraphTallyQuery = () => ({ ...useQuery, ...useQueryFactory('graphTallyQuery') });

const useInventoryHostsQuery = () => ({ ...useQuery, ...useQueryFactory('inventoryHostsQuery') });

const useInventorySubscriptionsQuery = () => ({ ...useQuery, ...useQueryFactory('inventorySubscriptionsQuery') });

const context = {
  ProductContext,
  DEFAULT_CONTEXT,
  useProductContext,
  useQuery,
  useGraphTallyQuery,
  useInventoryHostsQuery,
  useInventorySubscriptionsQuery
};

export {
  context as default,
  context,
  ProductContext,
  DEFAULT_CONTEXT,
  useProductContext,
  useQuery,
  useGraphTallyQuery,
  useInventoryHostsQuery,
  useInventorySubscriptionsQuery
};
