import React from 'react';
import { shallow } from 'enzyme';
import { ToolbarFieldGranularity } from '../toolbarFieldGranularity';

describe('ToolbarFieldGranularity Component', () => {
  it('should render a non-connected component', () => {
    const props = {};
    const component = shallow(<ToolbarFieldGranularity {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });
});
