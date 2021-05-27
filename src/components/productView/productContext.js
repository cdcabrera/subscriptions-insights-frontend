import React from 'react';
import { useSelector } from '../../redux';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';

/**
 * Product context.
 *
 * @type {React.Context<{}>}
 */
const ProductContext = React.createContext({});

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

/**
 * Expose a filtered product context, blends context with Redux state layer via queries.
 *
 * @returns {object}
 */
const useProductContext = () => {
  const productConfig = React.useContext(ProductContext) || {};
  const { [RHSM_API_QUERY_TYPES.UOM]: uomFilter } = useQuery();

  const {
    initialGraphFilters = [],
    initialInventoryFilters = [],
    initialSubscriptionsInventoryFilters = [],
    productContextFilterUom
  } = productConfig || {};

  if (productContextFilterUom) {
    const applyUomFilter = () => {
      const filterFilters = ({ id, isOptional }) => {
        if (!isOptional) {
          return true;
        }
        return new RegExp(uomFilter, 'i').test(id);
      };

      return {
        ...productConfig,
        initialGraphFilters: initialGraphFilters.filter(filterFilters),
        initialInventoryFilters: initialInventoryFilters.filter(filterFilters),
        initialSubscriptionsInventoryFilters: initialSubscriptionsInventoryFilters.filter(filterFilters)
      };
    };

    return applyUomFilter();
  }

  return productConfig;
};

const useProduct = () => {
  // const { productId, productLabel, viewId } = React.useContext(ProductContext) || {};
  const { productId, viewId } = React.useContext(ProductContext) || {};
  return {
    productId,
    // productLabel,
    viewId
  };
};

const useProductToolbar = () => {
  const { initialToolbarFilters: filters } = useProductContext();
  return { filters };
};

const useProductGraph = () => {
  const { initialGraphFilters: filters, initialGraphSettings: settings } = useProductContext();
  return { filters, settings };
};

const useProductInventory = () => {
  const { initialInventoryFilters: filters, initialInventorySettings: settings } = useProductContext();
  return { filters, settings };
};

const useProductInventoryGuests = () => {
  const { initialGuestsFilters: filters } = useProductContext();
  return { filters };
};

const useProductSubscriptionsInventory = () => {
  const { initialSubscriptionsInventoryFilters: filters } = useProductContext();
  return { filters };
};

export {
  ProductContext as default,
  ProductContext,
  useProductContext,
  useProduct,
  useProductGraph,
  useProductInventory,
  useProductInventoryGuests,
  useProductSubscriptionsInventory,
  useProductToolbar,
  useQueryContext,
  useQuery,
  useGraphTallyQuery,
  useInventoryHostsQuery,
  useInventorySubscriptionsQuery
};
