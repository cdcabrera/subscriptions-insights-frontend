import { useUnmount, useShallowCompareEffect } from 'react-use';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import { useProductInventoryGuestsConfig, useProductInventoryGuestsQuery } from '../productView/productViewContext';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';

/**
 * Default paging limit for guests inventory.
 *
 * @type {number}
 */
const DEFAULT_LIMIT = 100;

/**
 * Default paging page for guests inventory.
 *
 * @type {number}
 */
const DEFAULT_OFFSET = 0;

/**
 * Guests inventory selector response.
 *
 * @param {string} id
 * @param {object} options
 * @param {Function} options.useSelectorsResponse
 * @returns {{data: (*|{}), pending: (*|boolean), fulfilled, error}}
 */
const useSelectorsGuestsInventory = (
  id,
  { useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse } = {}
) => {
  const { error, cancelled, fulfilled, pending, data } = useAliasSelectorsResponse(
    ({ inventory }) => inventory?.hostsGuests?.[id]
  );

  return {
    error,
    fulfilled,
    pending: pending || cancelled || false,
    data: (data?.length === 1 && data[0]) || data || {}
  };
};

/**
 * Combined Redux RHSM Actions, getHostsInventoryGuests, and inventory selector response.
 *
 * @param {string} id
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useProductInventoryGuestsQuery
 * @param {Function} options.useSelectorsGuestsInventory
 * @returns {Function}
 */
const useGetGuestsInventory = (
  id,
  {
    useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
    useProductInventoryGuestsQuery: useAliasProductInventoryGuestsQuery = useProductInventoryGuestsQuery,
    useSelectorsGuestsInventory: useAliasSelectorsGuestsInventory = useSelectorsGuestsInventory
  } = {}
) => {
  const query = useAliasProductInventoryGuestsQuery({ options: { overrideId: id } });
  const dispatch = useAliasDispatch();
  const response = useAliasSelectorsGuestsInventory(id);

  useShallowCompareEffect(() => {
    reduxActions.rhsm.getHostsInventoryGuests(id, query)(dispatch);
  }, [dispatch, id, query]);

  return {
    ...response
  };
};

/**
 * Use paging as onScroll event for guests inventory.
 *
 * @param {string} id
 * @param {Function} successCallback
 * @param {object} options
 * @param {number} options.defaultLimit
 * @param {number} options.defaultOffset
 * @param {Function} options.useDispatch
 * @param {Function} options.useProductInventoryGuestsConfig
 * @param {Function} options.useProductInventoryGuestsQuery
 * @param {Function} options.useSelectorsGuestsInventory
 * @returns {Function}
 */
const useOnScroll = (
  id,
  successCallback,
  {
    defaultLimit = DEFAULT_LIMIT,
    defaultOffset = DEFAULT_OFFSET,
    useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
    useSelectorsGuestsInventory: useAliasSelectorsGuestsInventory = useSelectorsGuestsInventory,
    useProductInventoryGuestsConfig: useAliasProductInventoryGuestsConfig = useProductInventoryGuestsConfig,
    useProductInventoryGuestsQuery: useAliasProductInventoryGuestsQuery = useProductInventoryGuestsQuery
  } = {}
) => {
  const { initialQuery } = useAliasProductInventoryGuestsConfig();
  const dispatch = useAliasDispatch();
  const { pending, data = {} } = useAliasSelectorsGuestsInventory(id);
  const { count: numberOfGuests } = data?.meta || {};

  const query = useAliasProductInventoryGuestsQuery({ options: { overrideId: id } });
  const {
    [RHSM_API_QUERY_SET_TYPES.LIMIT]: limit = initialQuery[RHSM_API_QUERY_SET_TYPES.LIMIT] || defaultLimit,
    [RHSM_API_QUERY_SET_TYPES.OFFSET]: currentPage = initialQuery[RHSM_API_QUERY_SET_TYPES.OFFSET] || defaultOffset
  } = query;

  /**
   * Reset paging in scenarios where inventory is filtered, or guests is collapsed.
   */
  useUnmount(() => {
    dispatch([
      {
        type: reduxTypes.query.SET_QUERY_RHSM_GUESTS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.OFFSET],
        viewId: id,
        [RHSM_API_QUERY_SET_TYPES.OFFSET]: initialQuery[RHSM_API_QUERY_SET_TYPES.OFFSET] || defaultOffset
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

    if (numberOfGuests > (currentPage + 1) * limit && bottom && !pending) {
      if (typeof successCallback === 'function') {
        successCallback(event);
      }

      dispatch([
        {
          type: reduxTypes.query.SET_QUERY_RHSM_GUESTS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.OFFSET],
          viewId: id,
          [RHSM_API_QUERY_SET_TYPES.OFFSET]: currentPage + 1
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
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  useGetGuestsInventory,
  useOnScroll,
  useSelectorsGuestsInventory
};

export {
  context as default,
  context,
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  useGetGuestsInventory,
  useOnScroll,
  useSelectorsGuestsInventory
};
