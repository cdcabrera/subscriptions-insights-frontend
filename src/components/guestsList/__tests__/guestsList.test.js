import React from 'react';
import { shallow } from 'enzyme';
import { GuestsList } from '../guestsList';

describe('GuestsList Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      query: {},
      productId: 'lorem'
    };

    const component = shallow(<GuestsList {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });
});
