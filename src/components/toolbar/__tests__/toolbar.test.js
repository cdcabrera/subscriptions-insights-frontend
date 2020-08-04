import React from 'react';
import { mount, shallow } from 'enzyme';
import { Toolbar } from '../toolbar';
import { toolbarTypes } from '../toolbarTypes';
import { RHSM_API_QUERY_SLA, RHSM_API_QUERY_USAGE } from '../../../types/rhsmApiTypes';

describe('Toolbar Component', () => {
  let mockDispatchFilter;

  beforeEach(() => {
    mockDispatchFilter = jest
      .spyOn(Toolbar.prototype, 'setDispatchFilter')
      .mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a non-connected component', () => {
    const props = {};
    const component = shallow(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });

  it('should return an empty render when disabled', () => {
    const props = {
      isDisabled: true
    };
    const component = shallow(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('disabled component');
  });

  it('should handle updating state and clearing all filters', () => {
    const props = {};
    const component = mount(<Toolbar {...props} />);
    const componentInstance = component.instance();

    const filters = [
      { category: RHSM_API_QUERY_SLA, method: 'onSlaSelect' },
      { category: RHSM_API_QUERY_USAGE, method: 'onUsageSelect' }
    ];

    filters.forEach(({ category, method }) => {
      componentInstance.onCategorySelect({ value: category });

      const [optionOne, optionTwo] = toolbarTypes.getOptions(category).options;
      componentInstance[method]({ value: optionOne.value });
      expect({ state: componentInstance.state }).toMatchSnapshot(`${category}, selected once`);

      componentInstance[method]({ value: optionTwo.value });
      expect({ state: componentInstance.state }).toMatchSnapshot(`${category}, selected twice`);
    });

    componentInstance.onClear();
    // expect(componentInstance.state).toMatchSnapshot('clear all filters');
    expect(mockDispatchFilter).toMatchSnapshot('dispatch filter');
  });

  it('should handle updating state and clearing specific filters', () => {
    const props = {};
    const component = mount(<Toolbar {...props} />);
    const componentInstance = component.instance();

    const filters = [
      { category: RHSM_API_QUERY_SLA, method: 'onSlaSelect' },
      { category: RHSM_API_QUERY_USAGE, method: 'onUsageSelect' }
    ];

    filters.forEach(({ category, method }) => {
      componentInstance.onCategorySelect({ value: category });

      const [optionOne] = toolbarTypes.getOptions(category).options;
      componentInstance[method]({ value: optionOne.value });
      expect(componentInstance.state).toMatchSnapshot(`${category}, select specific`);

      const { title: categoryTitle } = toolbarTypes.getOptions().options.find(({ value }) => value === category);
      componentInstance.onClearFilter(categoryTitle);
      expect(componentInstance.state).toMatchSnapshot(`${category}, clear specific filter`);
    });
  });
});
