import { useMemo } from 'react';
import { useUnmount, useShallowCompareEffect } from 'react-use';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import {
  useProduct,
  useProductInventoryGuestsQuery,
  useProductInventoryGuestsConfig
} from '../productView/productViewContext';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { useSession } from '../authentication/authenticationContext';
import { inventoryCardHelpers } from '../inventoryCard/inventoryCardHelpers'; // eslint-disable-line

/**
 * @memberof InventoryGuests
 * @module InventoryGuestsContext
 */

const useParseGuestsFiltersSettings = ({
  isDisabled = false,
  useProduct: useAliasProduct = useProduct,
  useProductConfig: useAliasProductConfig = useProductInventoryGuestsConfig
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

const useSelectorGuests = (
  id,
  {
    useParseFiltersSettings: useAliasParseFiltersSettings = useParseGuestsFiltersSettings,
    useProductInventoryQuery: useAliasProductInventoryQuery = useProductInventoryGuestsQuery,
    useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse,
    useSession: useAliasSession = useSession
  } = {}
) => {
  const session = useAliasSession();
  const query = useAliasProductInventoryQuery({ options: { overrideId: id } });
  const { columnCountAndWidths, filters, settings } = useAliasParseFiltersSettings();
  const response = useAliasSelectorsResponse(({ inventory }) => inventory?.instancesGuests?.[id]);
  const { pending, cancelled, data, ...restResponse } = response;
  const updatedPending = pending || cancelled || false;
  let parsedData;

  if (response?.fulfilled) {
    const updatedData = (data?.length === 1 && data[0]) || data || {};
    parsedData = inventoryCardHelpers.parseInventoryResponse({
      data: updatedData,
      filters,
      query,
      session,
      settings
    });
  }

  return {
    ...restResponse,
    pending: updatedPending,
    resultsColumnCountAndWidths: columnCountAndWidths,
    ...parsedData
  };
};

const useGetGuestsInventory = (
  id,
  {
    getInventory = reduxActions.rhsm.getInstancesInventoryGuests,
    useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
    useProductInventoryQuery: useAliasProductInventoryQuery = useProductInventoryGuestsQuery,
    useSelector: useAliasSelector = useSelectorGuests
  } = {}
) => {
  const query = useAliasProductInventoryQuery({ options: { overrideId: id } });
  const dispatch = useAliasDispatch();
  const response = useAliasSelector(id);

  useShallowCompareEffect(() => {
    getInventory(id, query)(dispatch);
  }, [id, query]);

  return response;
};

/**
 * Use paging as onScroll event for guests inventory.
 *
 * @param {object} params
 * @param {string} params.id
 * @param {number} params.numberOfGuests
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useSelector
 * @param {Function} options.useProductInventoryQuery
 * @returns {Function}
 */
const useOnScroll = (
  { id, numberOfGuests } = {},
  {
    useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
    useSelector: useAliasSelector = useSelectorGuests,
    useProductInventoryQuery: useAliasProductInventoryQuery = useProductInventoryGuestsQuery
  } = {}
) => {
  const dispatch = useAliasDispatch();
  const { pending } = useAliasSelector(id);
  const { [RHSM_API_QUERY_SET_TYPES.LIMIT]: limit, [RHSM_API_QUERY_SET_TYPES.OFFSET]: currentPage } =
    useAliasProductInventoryQuery({ options: { overrideId: id } });

  /**
   * Reset paging in scenarios where inventory is filtered, or guests is collapsed.
   */
  useUnmount(() => {
    dispatch([
      {
        type: reduxTypes.query.SET_QUERY_CLEAR_INVENTORY_GUESTS_LIST,
        viewId: id
      },
      {
        type: reduxTypes.inventory.CLEAR_INVENTORY_GUESTS,
        id
      }
    ]);
  });

  /**
   * On scroll, dispatch type.
   *
   * @event onScroll
   * @param {object} event
   * @returns {void}
   */
  return event => {
    const { target } = event;
    const bottom = target.scrollHeight - target.scrollTop === target.clientHeight;

    if (numberOfGuests > currentPage + limit && bottom && !pending) {
      dispatch([
        {
          type: reduxTypes.query.SET_QUERY_RHSM_GUESTS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.OFFSET],
          viewId: id,
          [RHSM_API_QUERY_SET_TYPES.OFFSET]: currentPage + limit
        },
        {
          type: reduxTypes.query.SET_QUERY_RHSM_GUESTS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.LIMIT],
          viewId: id,
          [RHSM_API_QUERY_SET_TYPES.LIMIT]: limit
        }
      ]);
    }
  };
};

const context = {
  useGetGuestsInventory,
  useOnScroll
};

export { context as default, context, useGetGuestsInventory, useOnScroll };
