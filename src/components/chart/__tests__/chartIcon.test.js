import React from 'react';
import { shallow } from 'enzyme';
import { ChartIcon } from '../chartIcon';

describe('ChartIcon Component', () => {
  it('should render a basic component', () => {
    const props = {};
    const component = shallow(<ChartIcon {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should handle basic icons, variations in settings', async () => {
    const props = {
      size: 'md',
      symbol: 'eye',
      title: 'lorem ipsum eye'
    };
    const component = shallow(<ChartIcon {...props} />);
    expect(component).toMatchSnapshot('eye icon');

    component.setProps({
      size: 'lg',
      symbol: 'dash',
      title: 'lorem ipsum dash'
    });
    expect(component).toMatchSnapshot('dash icon');

    component.setProps({
      size: 'xl',
      symbol: 'threshold',
      title: null,
      fill: '#ff0000'
    });
    expect(component).toMatchSnapshot('threshold icon');
  });
});
