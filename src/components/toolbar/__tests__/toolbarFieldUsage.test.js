import React from 'react';
import { shallow } from 'enzyme';
import { ToolbarFieldUsage } from '../toolbarFieldUsage';

describe('ToolbarFieldUsage Component', () => {
  it('should render a non-connected component', () => {
    const props = {};
    const component = shallow(<ToolbarFieldUsage {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });
});
