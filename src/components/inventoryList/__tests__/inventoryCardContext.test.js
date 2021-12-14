import { context, useGetInstancesInventory } from '../inventoryCardContext';

describe('InventoryCardContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should handle instances inventory API responses', () => {
    const { result: errorResponse } = shallowHook(() =>
      useGetInstancesInventory({
        useProduct: () => ({ productId: 'lorem' }),
        useDispatch: () => {},
        useProductInventoryHostsQuery: () => ({}),
        useSelectorsResponse: () => ({ error: true })
      })
    );

    expect(errorResponse).toMatchSnapshot('instances inventory, error');

    const { result: pendingResponse } = shallowHook(() =>
      useGetInstancesInventory({
        useProduct: () => ({ productId: 'lorem' }),
        useDispatch: () => {},
        useProductInventoryHostsQuery: () => ({}),
        useSelectorsResponse: () => ({ pending: true })
      })
    );

    expect(pendingResponse).toMatchSnapshot('instances inventory, pending');

    const { result: cancelledResponse } = shallowHook(() =>
      useGetInstancesInventory({
        useProduct: () => ({ productId: 'lorem' }),
        useDispatch: () => {},
        useProductInventoryHostsQuery: () => ({}),
        useSelectorsResponse: () => ({ cancelled: true })
      })
    );

    expect(cancelledResponse).toMatchSnapshot('instances inventory, cancelled');

    const { result: fulfilledResponse } = shallowHook(() =>
      useGetInstancesInventory({
        useProduct: () => ({ productId: 'lorem' }),
        useDispatch: () => {},
        useProductInventoryHostsQuery: () => ({}),
        useSelectorsResponse: () => ({ fulfilled: true })
      })
    );

    expect(fulfilledResponse).toMatchSnapshot('instances inventory, fulfilled');
  });
});
