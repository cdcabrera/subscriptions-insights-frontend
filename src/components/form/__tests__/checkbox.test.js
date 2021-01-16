import React from 'react';
import { mount } from 'enzyme';
import Checkbox from '../checkbox';

describe('Checkbox Component', () => {
  it('should render a basic component', () => {
    const props = {};

    const component = mount(<Checkbox {...props} />);
    expect(component.render()).toMatchSnapshot('basic component');
  });

  it('should handle readOnly, disabled, checked', () => {
    const props = {
      isReadOnly: true
    };

    const component = mount(<Checkbox {...props} />);
    expect(component.render()).toMatchSnapshot('readOnly');

    component.setProps({
      isReadOnly: false,
      isDisabled: true
    });

    expect(component.render()).toMatchSnapshot('disabled');

    component.setProps({
      isReadOnly: false,
      isDisabled: false
    });

    expect(component.render()).toMatchSnapshot('active');

    component.setProps({
      isReadOnly: false,
      isDisabled: false,
      isChecked: true
    });

    expect(component.render()).toMatchSnapshot('checked');
  });

  it('should handle children as a label', () => {
    const props = {};
    const component = mount(<Checkbox {...props}>lorem ipsum</Checkbox>);
    expect(component.render()).toMatchSnapshot('children label checkbox');
  });

  it('should return an emulated onChange event', done => {
    const props = {};

    props.onChange = event => {
      expect(event).toMatchSnapshot('emulated event');
      done();
    };

    const component = mount(<Checkbox {...props}>lorem ipsum</Checkbox>);
    component.find('input').simulate('change');
  });
});
