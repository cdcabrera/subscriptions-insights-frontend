import React from 'react';
import { mount, shallow } from 'enzyme';
import { Toolbar } from '../toolbar';
import { toolbarTypes } from '../toolbarTypes';
import { RHSM_API_QUERY_SLA, RHSM_API_QUERY_USAGE } from '../../../types/rhsmApiTypes';

describe('Toolbar Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a non-connected component', () => {
    const props = {};
    const component = shallow(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });

  it('should handle updating state and dispatching a sla filter', () => {
    const props = {};

    const dispatchFilter = jest.spyOn(Toolbar.prototype, 'setDispatchFilter');
    const component = mount(<Toolbar {...props} />);
    component.setState({ filterCategory: RHSM_API_QUERY_SLA });

    const componentInstance = component.instance();

    const option = toolbarTypes.getOptions(RHSM_API_QUERY_SLA).options[0];
    componentInstance.onSlaSelect({ selected: { ...option }, value: option.value });
    expect(componentInstance.state).toMatchSnapshot(`${RHSM_API_QUERY_SLA} selected`);

    componentInstance.onClear();
    expect(componentInstance.state).toMatchSnapshot(`${RHSM_API_QUERY_SLA} clear filters`);

    expect(dispatchFilter).toHaveBeenCalledTimes(2);
  });

  it('should handle updating state and dispatching a usage filter', () => {
    const props = {};

    const dispatchFilter = jest.spyOn(Toolbar.prototype, 'setDispatchFilter');
    const component = mount(<Toolbar {...props} />);
    component.setState({ filterCategory: RHSM_API_QUERY_USAGE });

    const componentInstance = component.instance();

    const option = toolbarTypes.getOptions(RHSM_API_QUERY_USAGE).options[0];
    componentInstance.onUsageSelect({ selected: { ...option }, value: option.value });
    expect(componentInstance.state).toMatchSnapshot(`${RHSM_API_QUERY_USAGE} selected`);

    componentInstance.onClear();
    expect(componentInstance.state).toMatchSnapshot(`${RHSM_API_QUERY_USAGE} clear filters`);

    expect(dispatchFilter).toHaveBeenCalledTimes(2);
  });

  it('should return an empty render when disabled', () => {
    const props = {
      isDisabled: true
    };
    const component = shallow(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('disabled component');
  });
});
