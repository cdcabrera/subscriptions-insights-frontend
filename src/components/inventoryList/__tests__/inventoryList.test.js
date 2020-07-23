import React from 'react';
import { shallow } from 'enzyme';
import { InventoryList } from '../inventoryList';

describe('InventoryList Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      listQuery: {},
      productId: 'lorem'
    };

    const component = shallow(<InventoryList {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });
});
