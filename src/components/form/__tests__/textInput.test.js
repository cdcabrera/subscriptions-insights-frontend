import React from 'react';
import { mount, shallow } from 'enzyme';
import TextInput from '../textInput';
import { helpers } from '../../../common';

describe('TextInput Component', () => {
  it('should render a basic component', () => {
    const props = {};

    const component = shallow(<TextInput {...props} />);
    expect(component.render()).toMatchSnapshot('basic component');
  });

  it('should handle readOnly, disabled', () => {
    const props = {
      readOnly: true
    };

    const component = mount(<TextInput {...props} />);
    expect(component.render()).toMatchSnapshot('readOnly');

    component.setProps({
      readOnly: false,
      disabled: true
    });

    expect(component.render()).toMatchSnapshot('disabled');

    component.setProps({
      readOnly: false,
      disabled: false
    });

    expect(component.render()).toMatchSnapshot('active');
  });

  it('should return an emulated onChange event', done => {
    const props = {
      value: 'lorem ipsum'
    };

    props.onChange = event => {
      expect(event).toMatchSnapshot('emulated event');
      done();
    };

    const component = mount(<TextInput {...props} />);
    component.find('input').simulate('change');
  });

  it('should return an emulated onClear event on escape', done => {
    const props = {
      value: 'lorem ipsum',
      type: 'search'
    };

    props.onClear = event => {
      expect(event).toMatchSnapshot('emulated event');
      done();
    };

    const component = shallow(<TextInput {...props} />);
    component.instance().onKeyUp({ keyCode: 27, currentTarget: { value: '' }, persist: helpers.noop });
  });

  it('should return an emulated onClear event on search clear', done => {
    const props = {
      value: 'lorem ipsum',
      type: 'search'
    };

    props.onClear = event => {
      expect(event).toMatchSnapshot('emulated event');
      done();
    };

    const component = shallow(<TextInput {...props} />);
    const mockEvent = { currentTarget: { value: 'lorem ipsum' }, persist: helpers.noop };
    component.instance().onMouseUp(mockEvent);
    mockEvent.currentTarget.value = '';
  });
});
