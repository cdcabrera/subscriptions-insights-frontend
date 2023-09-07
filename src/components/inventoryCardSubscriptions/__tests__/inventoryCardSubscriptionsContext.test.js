import {
  context,
  useGetSubscriptionsInventory,
  useInventoryCardActionsSubscriptions,
  useOnPageSubscriptions,
  useOnColumnSortSubscriptions,
  useParseSubscriptionsFiltersSettings,
  useSelectorSubscriptions
} from '../inventoryCardSubscriptionsContext';
import {
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES as SORT_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES as SUBSCRIPTIONS_INVENTORY_TYPES
} from '../../../services/rhsm/rhsmConstants';
import { inventoryCardHelpers } from '../../inventoryCard/inventoryCardHelpers';

describe('InventoryCardSubscriptionsContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should expect specific sort properties', () => {
    expect(SORT_TYPES).toMatchSnapshot('sort properties');
  });

  /*
  it('should handle a store response with useGetSubscriptionsInventory', async () => {
    const { result } = await renderHook(
      () =>
        useGetSubscriptionsInventory({
          getInventory: () => () => {},
          useProduct: () => ({ productId: 'lorem' }),
          useDispatch: () => {}
        }),
      {
        state: {
          inventory: {
            subscriptionsInventory: {
              lorem: {
                fulfilled: true,
                data: [{ data: [{ lorem: 'ipsum' }, { dolor: 'sit' }], meta: {} }]
              }
            }
          }
        }
      }
    );

    expect(result).toMatchSnapshot('store response');
  });
  */

  it('should handle variations in instances inventory API responses', async () => {
    const { result: errorResponse } = await renderHook(() =>
      useGetSubscriptionsInventory({
        getInventory: () => () => {},
        useDispatch: () => {},
        useProduct: () => ({ productId: 'lorem' }),
        useProductInventoryQuery: () => ({}),
        useSelector: () => ({ error: true })
      })
    );

    expect(errorResponse).toMatchSnapshot('inventory, error');

    const { result: pendingResponse } = await renderHook(() =>
      useGetSubscriptionsInventory({
        getInventory: () => () => {},
        useDispatch: () => {},
        useProduct: () => ({ productId: 'lorem' }),
        useProductInventoryQuery: () => ({}),
        useSelector: () => ({ pending: true })
      })
    );

    expect(pendingResponse).toMatchSnapshot('inventory, pending');

    const { result: cancelledResponse } = await renderHook(() =>
      useGetSubscriptionsInventory({
        useDispatch: () => {},
        getInventory: () => () => {},
        useProduct: () => ({ productId: 'lorem' }),
        useProductInventoryQuery: () => ({}),
        useSelector: () => ({ cancelled: true })
      })
    );

    expect(cancelledResponse).toMatchSnapshot('inventory, cancelled');

    const { result: fulfilledResponse } = await renderHook(() =>
      useGetSubscriptionsInventory({
        useDispatch: () => {},
        getInventory: () => () => {},
        useProduct: () => ({ productId: 'lorem' }),
        useProductInventoryQuery: () => ({}),
        useSelector: () => ({ fulfilled: true })
      })
    );

    expect(fulfilledResponse).toMatchSnapshot('inventory, fulfilled');

    const { result: disabledResponse } = await renderHook(() =>
      useGetSubscriptionsInventory({
        isDisabled: true,
        useDispatch: () => {},
        getInventory: () => () => {},
        useProduct: () => ({ productId: 'lorem' }),
        useProductInventoryQuery: () => ({}),
        useSelector: () => ({ data: {}, fulfilled: false, pending: false, error: false })
      })
    );

    expect(disabledResponse).toMatchSnapshot('inventory, disabled');
  });

  it('should apply custom actions', async () => {
    const { result } = await renderHook(() =>
      useInventoryCardActionsSubscriptions({
        useSelector: () => ({
          resultsCount: 1
        }),
        useProductConfig: () => ({
          settings: {
            actions: [
              {
                id: RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME
              },
              {
                content: () => 'hello world'
              }
            ]
          }
        })
      })
    );

    expect(result).toMatchSnapshot('custom actions');
  });

  it('should handle an onPage event', () => {
    const mockDispatch = jest.fn();
    const onPage = useOnPageSubscriptions({
      useDispatch: () => mockDispatch,
      useProduct: () => ({ productId: 'lorem' })
    });

    onPage({ offset: 1, perPage: 5 });
    expect(mockDispatch.mock.calls).toMatchSnapshot('onPage event, dispatch');
    mockDispatch.mockClear();
  });

  it('should handle an onColumnSort event', () => {
    const mockDispatch = jest.fn();
    const onColumnSort = useOnColumnSortSubscriptions({
      sortColumns: { LOREM_IPSUM_COLUMN_ONE: 'loremIpsumColumnOne' },
      useDispatch: () => mockDispatch,
      useProduct: () => ({ productId: 'lorem' })
    });

    onColumnSort({ direction: SORT_DIRECTION_TYPES.DESCENDING, data: { metric: 'loremIpsumColumnOne' } });
    onColumnSort({ direction: SORT_DIRECTION_TYPES.ASCENDING, data: { metric: 'loremIpsumColumnOne' } });

    expect(mockDispatch.mock.calls).toMatchSnapshot('onColumnSort event, dispatch');
    mockDispatch.mockClear();
  });

  it('should parse filters and settings', async () => {
    const { result } = await renderHook(() =>
      useParseSubscriptionsFiltersSettings({
        useProductConfig: () => ({
          filters: [
            {
              metric: 'lorem ipsum'
            }
          ]
        })
      })
    );

    expect(result).toMatchSnapshot('parsed');
  });

  it('should handle a store response using selectors', async () => {
    const { result } = await renderHook(
      () =>
        useSelectorSubscriptions({
          useParseFiltersSettings: () =>
            inventoryCardHelpers.normalizeInventorySettings({
              filters: [
                {
                  metric: SUBSCRIPTIONS_INVENTORY_TYPES.PRODUCT_NAME
                }
              ],
              settings: {},
              productId: 'lorem'
            }),
          useProduct: () => ({ productId: 'lorem' })
        }),
      {
        state: {
          inventory: {
            subscriptionsInventory: {
              lorem: {
                fulfilled: true,
                data: [
                  {
                    data: [
                      { [SUBSCRIPTIONS_INVENTORY_TYPES.PRODUCT_NAME]: 'lorem-ipsum' },
                      { [SUBSCRIPTIONS_INVENTORY_TYPES.PRODUCT_NAME]: 'dolor-sit' }
                    ],
                    meta: {}
                  }
                ]
              }
            }
          }
        }
      }
    );

    expect(result).toMatchSnapshot('store response');
  });
});
