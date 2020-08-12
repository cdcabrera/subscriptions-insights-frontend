import React from 'react';
import { shallow } from 'enzyme';
import { GuestsList } from '../guestsList';

describe('GuestsList Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      id: 'lorem'
    };

    const component = shallow(<GuestsList {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should handle variations in data', () => {
    const props = {
      id: 'lorem',
      listData: [
        { lorem: 'ipsum', dolor: 'sit' },
        { lorem: 'sit', dolor: 'amet' }
      ]
    };

    const component = shallow(<GuestsList {...props} />);
    expect(component).toMatchSnapshot('variable data');

    component.setProps({
      filterGuestsData: [{ id: 'lorem' }]
    });

    expect(component).toMatchSnapshot('filtered data');
  });
});
