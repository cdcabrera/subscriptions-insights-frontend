import React from 'react';
import { GraphCardChart } from '../graphCardChart';

describe('GraphCardChart Component', () => {
  it('should render a default component', () => {
    const props = {};
    const component = renderComponent(<GraphCardChart {...props} />);

    expect(component).toMatchSnapshot('default');
  });

  it('should handle API response states', () => {
    const props = {
      useGetMetrics: () => ({ pending: true, error: false, fulfilled: false, dataSets: [] })
    };

    const componentPending = renderComponent(<GraphCardChart {...props} />);
    expect(componentPending).toMatchSnapshot('pending');

    props.useGetMetrics = () => ({ pending: false, error: true, fulfilled: false, dataSets: [] });
    const componentError = renderComponent(<GraphCardChart {...props} />);
    expect(componentError).toMatchSnapshot('error');

    props.useGetMetrics = () => ({ pending: false, error: false, fulfilled: true, dataSets: [] });
    const componentFulfilled = renderComponent(<GraphCardChart {...props} />);
    expect(componentFulfilled).toMatchSnapshot('fulfilled');
  });
});
