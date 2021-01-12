import React from 'react';
import { shallow } from 'enzyme';
import { Pagination } from '../pagination';

describe('Pagination Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      perPage: 20
    };

    const component = shallow(<Pagination {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should handle per-page limit, and page offset updates through props', () => {
    const props = {
      itemCount: 39,
      offset: 0,
      perPage: 20
    };

    const component = shallow(<Pagination {...props} />);
    const { offset: perPageOffset, page: perPagePage, perPage: perPagePerPage } = component.props();
    expect({
      perPageOffset,
      perPagePage,
      perPagePerPage
    }).toMatchSnapshot('per-page, limit');

    component.setProps({
      offset: 20
    });

    const { offset: pageOffset, page: pagePage, perPage: pagePerPage } = component.props();
    expect({
      pageOffset,
      pagePage,
      pagePerPage
    }).toMatchSnapshot('page, offset');
  });
});
