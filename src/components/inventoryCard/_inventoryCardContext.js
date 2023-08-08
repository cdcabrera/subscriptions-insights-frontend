import { useMemo } from 'react';
import { useShallowCompareEffect } from 'react-use';
import _camelCase from 'lodash/camelCase';
import { SortByDirection } from '@patternfly/react-table';
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
// import { normalizeInventorySettings } from './_inventoryCardHelpers';

/**
 * @memberof InventoryCard
 * @module InventoryCardContext
 */

/**
 * Chart context.
 *
 * @type {React.Context<{}>}
 */
// const DEFAULT_CONTEXT = [{ settings: {}, filters: [] }, helpers.noop];

// const InventoryCardContext = React.createContext(DEFAULT_CONTEXT);

/**
 * Get an updated inventory card context.
 *
 * @returns {React.Context<{}>}
 */
// const useInventoryCardContext = () => useContext(InventoryCardContext);

/**
 * Parse filters settings for context.
 *
 * @param {object} options
 * @param {Function} options.useProduct
 * @param {Function} options.useProductConfig
 * @returns {{standaloneFiltersSettings: Array<{ settings: object }>, groupedFiltersSettings: { settings: object }}}
 */
/*
const useParseInstancesFiltersSettings = ({
  useProduct: useAliasProduct = useProduct,
  useProductConfig: useAliasProductConfig = useProductInventoryHostsConfig
} = {}) => {
  const { productId } = useAliasProduct();
  const { filters = [], settings = {} } = useAliasProductConfig();
  const transformed = useMemo(
    () =>
      inventoryCardHelpers.generateInventorySettings({
        filters,
        settings,
        productId
      }),
    [filters, settings, productId]
  );

  return useCallback(
    () =>
      inventoryCardHelpers.generateInventorySettings({
        filters,
        settings,
        productId
      }),
    [filters, settings, productId]
  );
};
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
  // perPageDefault = 10,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  // useInventoryCardContext: useAliasInventoryCardContext = useInventoryCardContext,
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
  const { filters } = useAliasParseInstancesFiltersSettings();
  const { cancelled, pending, data, ...response } = useAliasSelectorsResponse(
    ({ inventory }) => inventory?.instancesInventory?.[productId]
  );
  const updatedPending = pending || cancelled || false;

  useShallowCompareEffect(() => {
    if (!isDisabled) {
      getInventory(productId, query)(dispatch);
    }
  }, [dispatch, isDisabled, productId, query]);

  // const { data: listData = [], meta = {} } = (data?.length === 1 && data[0]) || data || {};
  const parsedData = useMemo(() => {
    if (response?.fulfilled) {
      const updatedData = (data?.length === 1 && data[0]) || data || {};
      const temp = inventoryCardHelpers.parseInventoryResponse({ data: updatedData, filters, query, session });

      console.log('>>>>>>>> PARSED', temp, updatedData, filters);
      return temp;
    }

    return undefined;
  }, [data, filters, query, response?.fulfilled, session]);

  return {
    ...response,
    pending: updatedPending,
    ...parsedData
    // data: (data?.length === 1 && data[0]) || data || {},
    // dataSetColumnHeaders: [],
    // dataSetRows: [],
    // resultsCount: meta?.count || 0,
    // resultsOffset: query[RHSM_API_QUERY_SET_TYPES.OFFSET],
    // resultsPerPage: query[RHSM_API_QUERY_SET_TYPES.LIMIT] || perPageDefault
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
   * @param {*} _data
   * @param {object} params
   * @param {string} params.direction
   * @param {string} params.id
   * @returns {void}
   */
  return (_data, { direction, id }) => {
    const updatedSortColumn = Object.values(sortColumns).find(value => value === id || _camelCase(value) === id);
    let updatedDirection;

    if (!updatedSortColumn) {
      if (helpers.DEV_MODE || helpers.REVIEW_MODE) {
        console.warn(`Sorting can only be performed on select fields, confirm field ${id} is allowed.`);
      }
      return;
    }

    switch (direction) {
      case SortByDirection.desc:
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
  // InventoryCardContext,
  // DEFAULT_CONTEXT,
  useGetInstancesInventory,
  // useInventoryCardContext,
  useOnPageInstances,
  useOnColumnSortInstances,
  useParseInstancesFiltersSettings
};

export {
  context as default,
  context,
  // InventoryCardContext,
  // DEFAULT_CONTEXT,
  useGetInstancesInventory,
  // useInventoryCardContext,
  useOnPageInstances,
  useOnColumnSortInstances,
  useParseInstancesFiltersSettings
};
