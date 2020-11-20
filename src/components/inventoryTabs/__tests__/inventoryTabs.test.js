import React from 'react';
import { mount, shallow } from 'enzyme';
import { InventoryTabs } from '../inventoryTabs';
import { store } from '../../../redux';

describe('InventoryList Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a non-connected component', () => {
    const props = {
      productId: 'lorem',
      tabs: [
        { title: 'lorem', content: 'ipsum' },
        { title: 'sit', content: 'amet' }
      ]
    };

    const component = shallow(<InventoryTabs {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should return an empty render when disabled', () => {
    const props = {
      productId: 'lorem',
      tabs: [
        { title: 'lorem', content: 'ipsum' },
        { title: 'sit', content: 'amet' }
      ],
      isDisabled: true
    };
    const component = shallow(<InventoryTabs {...props} />);

    expect(component).toMatchSnapshot('disabled component');
  });

  it('should handle updating tabs for redux state', () => {
    const props = {
      productId: 'lorem',
      tabs: [
        { title: 'lorem', content: 'ipsum' },
        { title: 'sit', content: 'amet' }
      ]
    };
    const component = mount(<InventoryTabs {...props} />);
    const componentInstance = component.instance();

    componentInstance.onTab({ index: 1 });
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch filter');
  });
});
