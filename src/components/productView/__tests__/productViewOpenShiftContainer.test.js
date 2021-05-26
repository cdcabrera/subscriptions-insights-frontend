import React from 'react';
import { shallow } from 'enzyme';
import { ProductViewOpenShiftContainer } from '../productViewOpenShiftContainer';
import { config as openshiftContainerConfig } from '../../../config/product.openshiftContainer';
import { config as openshiftMetricsConfig } from '../../../config/product.openshiftMetrics';

describe('ProductViewOpenShiftContainer Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      routeDetail: {
        pathParameter: 'lorem ipsum',
        productConfig: [openshiftContainerConfig, openshiftMetricsConfig],
        productParameter: 'dolor sit'
      }
    };

    const component = shallow(<ProductViewOpenShiftContainer {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });
});
