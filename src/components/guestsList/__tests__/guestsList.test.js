import React from 'react';
import { GuestsList } from '../guestsList';

describe('GuestsList Component', () => {
  it('should render a basic component', async () => {
    const props = {
      id: 'lorem',
      numberOfGuests: 0
    };

    const component = await shallowHookComponent(<GuestsList {...props} />);
    expect(component).toMatchSnapshot('basic render');
  });

  it('should handle variations in data', async () => {
    const props = {
      id: 'lorem',
      numberOfGuests: 2,
      useGetGuestsInventory: () => ({
        data: {
          data: [
            { lorem: 'ipsum', dolor: 'sit' },
            { lorem: 'amet', dolor: 'amet' }
          ]
        }
      })
    };

    const component = await shallowHookComponent(<GuestsList {...props} />);
    expect(component).toMatchSnapshot('variable data');

    component.setProps({
      useProductInventoryGuestsConfig: () => ({
        filters: [{ id: 'lorem' }]
      })
    });

    expect(component).toMatchSnapshot('filtered data');
  });

  it('should handle multiple display states', async () => {
    const props = {
      id: 'lorem',
      numberOfGuests: 1,
      useGetGuestsInventory: () => ({
        pending: true
      })
    };

    const component = await shallowHookComponent(<GuestsList {...props} />);
    expect(component).toMatchSnapshot('initial pending');

    component.setProps({
      useGetGuestsInventory: () => ({
        fulfilled: true,
        data: {
          data: [{ lorem: 'ipsum', dolor: 'sit' }]
        }
      })
    });

    expect(component).toMatchSnapshot('fulfilled');
  });
});
