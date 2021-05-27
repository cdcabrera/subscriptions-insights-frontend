import React from 'react';
import { useQuery } from './useQuery';
import { RHSM_API_QUERY_TYPES } from '../types/rhsmApiTypes';
// import productParentIds from "../config/routes";

/**
 * Product context.
 *
 * @type {React.Context<{}>}
 */
const ProductContext = React.createContext({});

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
  const { productIds, productParentIds, productConfig, ...productContext } = React.useContext(ProductContext) || {};
  // console.log('WORK >>>', doit);
  // const { productId, productParentId } = doit;
  const updatedConfigs = React.useMemo(
    () =>
      productConfig?.map((config, index) => ({
        ...config,
        productId: productIds[index],
        productParentId: productParentIds[index]
      })),
    [productIds, productParentIds, productConfig]
  );

  /*
  const updateConfigs = () =>
    productConfig?.map((config, index) => ({
      ...config,
      productId: productIds[index],
      productParentId: productParentIds[index]
    }));
  */

  return {
    productIds,
    productParentIds,
    productConfig: updatedConfigs,
    ...productContext
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
  useProductToolbar
};
