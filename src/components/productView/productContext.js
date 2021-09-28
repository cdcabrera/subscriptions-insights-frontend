import React, { useCallback, useContext } from 'react';
import { reduxHelpers, storeHooks } from '../../redux';
import { RHSM_API_QUERY_TYPES, rhsmApiTypes } from '../../types/rhsmApiTypes';
import { helpers } from '../../common/helpers';

/**
 * Route context.
 *
 * @type {React.Context<{}>}
 */
const DEFAULT_CONTEXT = [{}, helpers.noop];

const ProductContext = React.createContext(DEFAULT_CONTEXT);

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
const useProductGraphTallyQuery = () =>
  reduxHelpers.setApiQuery(
    {
      ...useProductQuery(),
      ...useProductQueryFactory('graphTallyQuery')
    },
    rhsmApiTypes.RHSM_API_QUERY_SET_REPORT_CAPACITY_TYPES
  );

/**
 * Return the inventory query for guests.
 *
 * @returns {object}
 */
const useProductInventoryGuestsQuery = () =>
  reduxHelpers.setApiQuery(
    {
      ...useProductQuery(),
      ...useProductQueryFactory('inventoryGuestsQuery')
    },
    rhsmApiTypes.RHSM_API_QUERY_SET_INVENTORY_GUESTS_TYPES
  );

/**
 * Return an inventory query for hosts.
 *
 * @returns {object}
 */
const useProductInventoryHostsQuery = () =>
  reduxHelpers.setApiQuery(
    {
      ...useProductQuery(),
      ...useProductQueryFactory('inventoryHostsQuery')
    },
    rhsmApiTypes.RHSM_API_QUERY_SET_INVENTORY_TYPES
  );

/**
 * Return an inventory query for subscriptions.
 *
 * @returns {object}
 */
const useProductInventorySubscriptionsQuery = () =>
  reduxHelpers.setApiQuery(
    {
      ...useProductQuery(),
      ...useProductQueryFactory('inventorySubscriptionsQuery')
    },
    rhsmApiTypes.RHSM_API_QUERY_SET_INVENTORY_TYPES
  );

/**
 * Get a filtered product configuration context.
 *
 * @returns {object}
 */
const useProductContext = () => {
  const { [RHSM_API_QUERY_TYPES.UOM]: uomFilter } = useProductQuery();
  const {
    initialGraphFilters = [],
    initialInventoryFilters = [],
    initialSubscriptionsInventoryFilters = [],
    productContextFilterUom,
    ...config
  } = useContext(ProductContext);

  const applyUomFilter = useCallback(() => {
    if (productContextFilterUom === true) {
      const filterFilters = ({ id, isOptional }) => {
        if (!isOptional) {
          return true;
        }
        return new RegExp(uomFilter, 'i').test(id);
      };

      return {
        ...config,
        initialGraphFilters: initialGraphFilters.filter(filterFilters),
        initialInventoryFilters: initialInventoryFilters.filter(filterFilters),
        initialSubscriptionsInventoryFilters: initialSubscriptionsInventoryFilters.filter(filterFilters)
      };
    }

    return {
      ...config,
      initialGraphFilters,
      initialInventoryFilters,
      initialSubscriptionsInventoryFilters
    };
  }, [
    config,
    initialGraphFilters,
    initialInventoryFilters,
    initialSubscriptionsInventoryFilters,
    productContextFilterUom,
    uomFilter
  ]);

  return applyUomFilter();
};

/**
 * Return product identifiers.
 *
 * @returns {{productLabel: string, viewId: string, productId: string, productGroup: string}}
 */
const useProduct = () => {
  const { productGroup, productId, productLabel, viewId } = React.useContext(ProductContext) || {};
  return {
    productGroup,
    productId,
    productLabel,
    viewId
  };
};

/**
 * Return graph configuration.
 *
 * @returns {{settings: object, filters: Array}}
 */
const useProductGraphConfig = () => {
  const { initialGraphFilters, initialGraphSettings = {} } = useProductContext();
  return {
    filters: initialGraphFilters,
    settings: initialGraphSettings
  };
};

/**
 * Return hosts inventory configuration.
 *
 * @returns {{settings: object, filters: Array}}
 */
const useProductInventoryHostsConfig = () => {
  const { initialInventoryFilters, initialInventorySettings = {} } = useProductContext();
  return {
    filters: initialInventoryFilters,
    settings: initialInventorySettings
  };
};

/**
 * Return subscriptions inventory configuration.
 *
 * @returns {{settings: object, filters: Array}}
 */
const useProductInventorySubscriptionsConfig = () => {
  const { initialSubscriptionsInventoryFilters, initialSubscriptionsInventorySettings = {} } = useProductContext();
  return {
    filters: initialSubscriptionsInventoryFilters,
    settings: initialSubscriptionsInventorySettings
  };
};

/**
 * Return primary toolbar configuration.
 *
 * @returns {{settings: object, filters: Array}}
 */
const useProductToolbarConfig = () => {
  const { initialToolbarFilters, initialToolbarSettings = {} } = useProductContext();
  return {
    filters: initialToolbarFilters,
    settings: initialToolbarSettings
  };
};

const context = {
  ProductContext,
  DEFAULT_CONTEXT,
  useProductContext,
  useQuery: useProductQuery,
  useQueryFactory: useProductQueryFactory,
  useGraphTallyQuery: useProductGraphTallyQuery,
  useInventoryGuestsQuery: useProductInventoryGuestsQuery,
  useInventoryHostsQuery: useProductInventoryHostsQuery,
  useInventorySubscriptionsQuery: useProductInventorySubscriptionsQuery,
  useProduct,
  useGraphConfig: useProductGraphConfig,
  useInventoryHostsConfig: useProductInventoryHostsConfig,
  useInventorySubscriptionsConfig: useProductInventorySubscriptionsConfig,
  useToolbarConfig: useProductToolbarConfig
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
  useProductInventoryGuestsQuery,
  useProductInventoryHostsQuery,
  useProductInventorySubscriptionsQuery,
  useProduct,
  useProductGraphConfig,
  useProductInventoryHostsConfig,
  useProductInventorySubscriptionsConfig,
  useProductToolbarConfig
};
