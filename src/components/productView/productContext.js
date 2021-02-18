import React from 'react';
import { useSelector } from '../../redux';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { useRouteDetail } from '../router/routerContext';

/**
 * Product context.
 *
 * @type {React.Context<{}>}
 */
const ProductContext = React.createContext({});

/**
 * Expose product context.
 *
 * @returns {*}
 */
const useProductContext = () => React.useContext(ProductContext);

/**
 * Generate queries.
 *
 * @param {string} queryType
 * @returns {object}
 */
const useQueryContext = queryType => {
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

/**
 * Expose query.
 *
 * @returns {object}
 */
const useQuery = () => useQueryContext('query');

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

/**
 * ToDo: re-evaluate the use of "useProductContext" vs "useProductContextUom"
 * The OpenShift graph requires a post-filter on an existing response, based on
 * current setup. The entire product context could be made easier by requesting
 * the API for Tally and Capacity to support the UOM param similar to inventory.
 */
/**
 * Note: leveraging the Redux state layer as "context" for UOM
 */
/**
 * Expose a UOM filtered product context.
 *
 * @returns {object}
 */
const useProductUomContext = () => {
  const productConfig = useProductContext();
  const {
    initialGraphFilters = [],
    initialInventoryFilters = [],
    initialSubscriptionsInventoryFilters = [],
    productContextFilterUom
  } = productConfig || {};

  const { [RHSM_API_QUERY_TYPES.UOM]: filter } = useQuery();

  if (productContextFilterUom) {
    const applyFilter = () => {
      const filterFilters = ({ id, isOptional }) => {
        if (!isOptional) {
          return true;
        }
        return new RegExp(filter, 'i').test(id);
      };

      return {
        ...productConfig,
        initialGraphFilters: initialGraphFilters.filter(filterFilters),
        initialInventoryFilters: initialInventoryFilters.filter(filterFilters),
        initialSubscriptionsInventoryFilters: initialSubscriptionsInventoryFilters.filter(filterFilters)
      };
    };

    return applyFilter();
  }

  return productConfig;
};

export {
  ProductContext as default,
  ProductContext,
  useProductContext,
  useProductUomContext,
  useQueryContext,
  useQuery,
  useGraphTallyQuery,
  useInventoryHostsQuery,
  useInventorySubscriptionsQuery
};
