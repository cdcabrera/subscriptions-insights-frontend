// import React, { useContext } from 'react';
// import { helpers } from '../../common/helpers';
import { useSelector } from '../redux';
import { useRouteDetail } from './useRouter';

const useQueryFactory = queryType => {
  // const { [queryType]: initialQuery } = useProductContext() || {};
  const { [queryType]: initialQuery } = {};

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

const productQueryHooks = {
  useQuery,
  useGraphTallyQuery,
  useInventoryHostsQuery,
  useInventorySubscriptionsQuery
};

export {
  productQueryHooks as default,
  productQueryHooks,
  useQuery,
  useQueryFactory,
  useGraphTallyQuery,
  useInventoryHostsQuery,
  useInventorySubscriptionsQuery
};
