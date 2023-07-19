import React from 'react';
import Table from '../../table/table';
import { InventoryCard } from '../inventoryCard';
import {
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INVENTORY_TYPES
} from '../../../services/rhsm/rhsmConstants';

describe('InventoryCard Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useProductInventoryConfig: () => ({ filters: [], settings: {} }),
      useProductInventoryQuery: () => ({
        [RHSM_API_QUERY_SET_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0
      }),
      useGetInventory: () => ({
        pending: true
      })
    };

    const component = await shallowHookComponent(<InventoryCard {...props} />);
    expect(component).toMatchSnapshot('basic render');
  });

  it('should return an empty render when disabled', async () => {
    const props = {
      isDisabled: true,
      useProductInventoryConfig: () => ({ filters: [], settings: {} }),
      useProductInventoryQuery: () => ({
        [RHSM_API_QUERY_SET_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0
      }),
      useGetInventory: () => ({
        data: {
          data: [
            { lorem: 'ipsum', dolor: 'sit' },
            { lorem: 'sit', dolor: 'amet' }
          ],
          meta: {
            count: 2
          }
        }
      })
    };
    const component = await shallowHookComponent(<InventoryCard {...props} />);

    expect(component).toMatchSnapshot('disabled component');
  });

  it('should handle multiple display states, error, pending, fulfilled', async () => {
    const props = {
      useProductInventoryConfig: () => ({ filters: [], settings: {} }),
      useProductInventoryQuery: () => ({
        lorem: 'ipsum'
      }),
      useGetInventory: () => ({
        pending: true
      })
    };

    const component = await shallowHookComponent(<InventoryCard {...props} />);
    expect(component).toMatchSnapshot('pending');

    component.setProps({
      useGetInventory: () => ({
        pending: false,
        error: true
      })
    });

    expect(component).toMatchSnapshot('error');

    component.setProps({
      useGetInventory: () => ({
        pending: false,
        error: false,
        fulfilled: true,
        data: {
          data: [
            { lorem: 'ipsum', dolor: 'sit' },
            { lorem: 'sit', dolor: 'amet' }
          ],
          meta: {
            count: 2
          }
        }
      })
    });

    expect(component).toMatchSnapshot('fulfilled');
  });

  it('should handle variations in data', async () => {
    const props = {
      useProductInventoryConfig: () => ({ filters: [], settings: {} }),
      useProductInventoryQuery: () => ({
        [RHSM_API_QUERY_SET_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0
      }),
      useGetInventory: () => ({
        fulfilled: true,
        data: {
          data: [
            { lorem: 'ipsum', dolor: 'sit' },
            { lorem: 'sit', dolor: 'amet' }
          ],
          meta: {
            count: 2
          }
        }
      })
    };

    const component = await mountHookComponent(<InventoryCard {...props} />);
    expect(component.find(Table).props()).toMatchSnapshot('variable data');

    component.setProps({
      useProductInventoryConfig: () => ({ filters: [{ id: 'lorem' }] })
    });

    component.update();
    expect(component.find(Table).props()).toMatchSnapshot('filtered data');
  });

  it('should handle expandable guests data', async () => {
    const props = {
      useProductInventoryQuery: () => ({
        [RHSM_API_QUERY_SET_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0
      }),
      useGetInventory: () => ({
        fulfilled: true,
        data: {
          data: [{ lorem: 'sit', dolor: 'amet', [INVENTORY_TYPES.NUMBER_OF_GUESTS]: 0 }],
          meta: {
            count: 1
          }
        }
      }),
      useProductInventoryConfig: () => ({ filters: [], settings: {} })
    };

    const component = await mountHookComponent(<InventoryCard {...props} />);
    expect(component.find(Table).props()).toMatchSnapshot('NO number of guests and NO expandable guests display');

    component.setProps({
      ...props,
      useProductInventoryConfig: () => ({
        filters: [],
        settings: { guestContent: data => `loremIpsum-${JSON.stringify(data)}` }
      }),
      useGetInventory: () => ({
        fulfilled: true,
        data: {
          data: [{ lorem: 'sit', dolor: 'amet', [INVENTORY_TYPES.NUMBER_OF_GUESTS]: 1 }],
          meta: {
            count: 1
          }
        }
      })
    });

    component.update();
    expect(component.find(Table).props()).toMatchSnapshot('number of guests, and returned id');
  });
});
