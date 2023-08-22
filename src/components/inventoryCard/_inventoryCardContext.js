import { useMemo } from 'react';
import { useShallowCompareEffect } from 'react-use';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import { useSession } from '../authentication/authenticationContext';
import {
  useProduct,
  useProductInventoryHostsConfig,
  useProductInventoryHostsQuery
} from '../productView/productViewContext';
import {
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_TYPES as SORT_TYPES,
  RHSM_API_QUERY_SET_TYPES
} from '../../services/rhsm/rhsmConstants';
import { helpers } from '../../common';
import { inventoryCardHelpers } from './_inventoryCardHelpers';
import { tableHelpers } from '../table/_table';

/**
 * @memberof InventoryCard
 * @module InventoryCardContext
 */

/**
 * Parse filters settings for context.
 *
 * @param {object} options
 * @param {boolean} options.isDisabled
 * @param {Function} options.useProduct
 * @param {Function} options.useProductConfig
 * @returns {{standaloneFiltersSettings: Array<{ settings: object }>, groupedFiltersSettings: { settings: object }}}
 */
const useParseInstancesFiltersSettings = ({
  isDisabled = false,
  useProduct: useAliasProduct = useProduct,
  useProductConfig: useAliasProductConfig = useProductInventoryHostsConfig
} = {}) => {
  const { productId } = useAliasProduct();
  const { filters = [], settings = {} } = useAliasProductConfig();

  return useMemo(() => {
    if (isDisabled) {
      return undefined;
    }
    return inventoryCardHelpers.normalizeInventorySettings({
      filters,
      settings,
      productId
    });
  }, [filters, isDisabled, settings, productId]);
};

/**
 * Combined Redux RHSM Actions, getInstancesInventory, and inventory selector response.
 *
 * @param {object} options
 * @param {boolean} options.isDisabled
 * @param {Function} options.getInventory
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @param {Function} options.useProductInventoryQuery
 * @param {Function} options.useSelectorsResponse
 * @param {Function} options.useParseInstancesFiltersSettings
 * @param {Function} options.useSession
 * @returns {{data: (*|{}|Array|{}), pending: boolean, fulfilled: boolean, error: boolean}}
 */
const useGetInstancesInventory = ({
  isDisabled = false,
  getInventory = reduxActions.rhsm.getInstancesInventory,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useParseInstancesFiltersSettings: useAliasParseInstancesFiltersSettings = useParseInstancesFiltersSettings,
  useProduct: useAliasProduct = useProduct,
  useProductInventoryQuery: useAliasProductInventoryQuery = useProductInventoryHostsQuery,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse,
  useSession: useAliasSession = useSession
} = {}) => {
  const { productId } = useAliasProduct();
  const session = useAliasSession();
  const query = useAliasProductInventoryQuery();
  const dispatch = useAliasDispatch();
  const { filters, columnCountAndWidths } = useAliasParseInstancesFiltersSettings();
  const { cancelled, pending, data, ...response } = useAliasSelectorsResponse(
    ({ inventory }) => inventory?.instancesInventory?.[productId]
  );
  const updatedPending = pending || cancelled || false;

  useShallowCompareEffect(() => {
    if (!isDisabled) {
      getInventory(productId, query)(dispatch);
    }
  }, [dispatch, isDisabled, productId, query]);

  const parsedData = useMemo(() => {
    if (response?.fulfilled) {
      const updatedData = (data?.length === 1 && data[0]) || data || {};
      return inventoryCardHelpers.parseInventoryResponse({ data: updatedData, filters, query, session });
    }

    return undefined;
  }, [data, filters, query, response?.fulfilled, session]);

  return {
    ...response,
    pending: updatedPending,
    resultsColumnCountAndWidths: columnCountAndWidths,
    ...parsedData
  };
};

/**
 * An onPage callback for instances inventory.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @returns {Function}
 */
const useOnPageInstances = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { productId } = useAliasProduct();
  const dispatch = useAliasDispatch();

  /**
   * On event update state for instances inventory.
   *
   * @event onPage
   * @param {object} params
   * @param {number} params.offset
   * @param {number} params.perPage
   * @returns {void}
   */
  return ({ offset, perPage }) => {
    dispatch([
      {
        type: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.OFFSET],
        viewId: productId,
        [RHSM_API_QUERY_SET_TYPES.OFFSET]: offset
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.LIMIT],
        viewId: productId,
        [RHSM_API_QUERY_SET_TYPES.LIMIT]: perPage
      }
    ]);
  };
};

/**
 * An onColumnSort callback for instances inventory.
 *
 * @param {object} options
 * @param {object} options.sortColumns
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @returns {Function}
 */
const useOnColumnSortInstances = ({
  sortColumns = SORT_TYPES,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { productId } = useAliasProduct();
  const dispatch = useAliasDispatch();

  /**
   * On event update state for instances inventory.
   *
   * @event onColumnSort
   * @param {object} params
   * @param {string} params.direction
   * @param {object} params.data
   * @returns {void}
   */
  return ({ direction, data = {} }) => {
    const { metric: id } = data;
    const updatedSortColumn = Object.values(sortColumns).find(value => value === id);
    let updatedDirection;

    if (!updatedSortColumn) {
      if (helpers.DEV_MODE || helpers.REVIEW_MODE) {
        console.warn(`Sorting can only be performed on select fields, confirm field ${id} is allowed.`);
      }
      return;
    }

    switch (direction) {
      case tableHelpers.SortByDirectionVariant.desc:
        updatedDirection = SORT_DIRECTION_TYPES.DESCENDING;
        break;
      default:
        updatedDirection = SORT_DIRECTION_TYPES.ASCENDING;
        break;
    }

    dispatch([
      {
        type: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.DIRECTION],
        viewId: productId,
        [RHSM_API_QUERY_SET_TYPES.DIRECTION]: updatedDirection
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.SORT],
        viewId: productId,
        [RHSM_API_QUERY_SET_TYPES.SORT]: updatedSortColumn
      }
    ]);
  };
};

const context = {
  useGetInstancesInventory,
  // useInventoryCardContext,
  useOnPageInstances,
  useOnColumnSortInstances,
  useParseInstancesFiltersSettings
};

export {
  context as default,
  context,
  useGetInstancesInventory,
  // useInventoryCardContext,
  useOnPageInstances,
  useOnColumnSortInstances,
  useParseInstancesFiltersSettings
};
