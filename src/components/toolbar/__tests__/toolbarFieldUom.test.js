import React from 'react';
import { shallow } from 'enzyme';
import { ToolbarFieldUom } from '../toolbarFieldUom';

describe('ToolbarFieldUom Component', () => {
  it('should render a non-connected component', () => {
    const props = {};
    const component = shallow(<ToolbarFieldUom {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });
});
