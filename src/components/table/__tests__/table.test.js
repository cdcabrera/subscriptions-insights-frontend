import React from 'react';
import { shallow } from 'enzyme';
import { Table } from '../table';

describe('Table Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      columnHeaders: ['lorem', 'ipsum', 'dolor', 'sit']
    };

    const component = shallow(<Table {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });
});
