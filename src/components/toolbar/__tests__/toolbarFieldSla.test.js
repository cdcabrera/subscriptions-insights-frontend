import React from 'react';
import { shallow } from 'enzyme';
import { ToolbarFieldSla } from '../toolbarFieldSla';

describe('ToolbarFieldSla Component', () => {
  it('should render a non-connected component', () => {
    const props = {};
    const component = shallow(<ToolbarFieldSla {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });
});
