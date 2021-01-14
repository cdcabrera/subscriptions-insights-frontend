import React from 'react';
import { shallow } from 'enzyme';
import { ToolbarFieldDisplayName } from '../toolbarFieldDisplayName';

describe('ToolbarFieldDisplayName Component', () => {
  it('should render a non-connected component', () => {
    const props = {};
    const component = shallow(<ToolbarFieldDisplayName {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });
});
