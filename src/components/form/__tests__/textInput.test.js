import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import __cloneDeep from 'lodash/cloneDeep';
import TextInput from '../textInput';
import { helpers } from '../../../common';

describe('TextInput Component', () => {
  it('should render a basic component', async () => {
    const props = {};

    const component = await renderComponent(<TextInput {...props} />);
    expect(component).toMatchSnapshot('basic component');
  });

  it('should handle readOnly, disabled', async () => {
    const props = {
      isReadOnly: true
    };

    const component = await renderComponent(<TextInput {...props} />);
    expect(component).toMatchSnapshot('readOnly');

    const propsUpdatedDisabled = await component.setProps({
      isReadOnly: false,
      isDisabled: true
    });

    expect(propsUpdatedDisabled).toMatchSnapshot('disabled');

    const propsUpdatedActive = await component.setProps({
      isReadOnly: false,
      isDisabled: false
    });

    expect(propsUpdatedActive).toMatchSnapshot('active');
  });

  it('should return an emulated onChange event', async () => {
    const props = {
      value: 'lorem ipsum'
    };

    const component = await renderComponent(<TextInput {...props} />);
    const mockEvent = { target: { value: 'dolor sit' }, persist: helpers.noop };
    const input = component.find('input');
    component.fireEvent.change(input, mockEvent);
    expect(input.value).toMatchSnapshot('emulated event, change');
  });

  it('should return an emulated onClear event on escape', async () => {
    const mockClear = jest.fn();
    const props = {
      id: 'test-id',
      value: 'lorem ipsum',
      onKeyUp: jest.fn(),
      onClear: mockClear
    };

    const component = await renderComponent(<TextInput {...props} />);
    const input = component.original.querySelector('input');
    // const input = component.querySelector('input');
    const mockEvent = { target: { value: '' }, keyCode: 27, which: 27, key: 'Escape', persist: helpers.noop };
    await fireEvent.keyUp(input, mockEvent);
    expect(props.onKeyUp).toHaveBeenCalledTimes(1);
    expect(mockClear).toHaveBeenCalledTimes(1);
    component.unmount();

    /*
    const filterArrayOfObjects = (arr, callback = () => true) => {
      const updatedArr = __cloneDeep(arr);

      updatedArr.forEach(element => {
        if (Array.isArray(element)) {
          return filterArrayOfObjects(element);
        }

        Object.entries(element).forEach(([key, value], index) => {
          // callback(element, [key, value], index);
          const response = callback([key, value], index);

          if (response === false) {
            delete element[key]; // eslint-disable-line
          }
        });
      });

      return updatedArr;
    };
     */

    // console.log(filterArrayOfObjects(mockClear.mock.calls, prop => !/^__/i.test(prop.key)));
    /*
    console.log(
      filterArrayOfObjects(mockClear.mock.calls, (element, prop) => {
        if (/^__/i.test(prop.key)) {
          element[prop.key] = '[WOOT]'; // eslint-disable-line
        }
      })
    );
    */
    /*
    const output = await filterArrayOfObjects(mockClear.mock.calls, (element, prop) => {
      if (/^__/i.test(prop.key)) {
        element[prop.key] = '[WOOT]'; // eslint-disable-line
      }
    });
    */
    // const output = filterArrayOfObjects(mockClear.mock.calls, prop => !/^__/i.test(prop.key));
    // console.log('>>>>', output);
    // expect(output).toMatchSnapshot('emulated event, esc');
    // const output = await mockClear.mock.calls;
    // expect(output?.[output.length - 1]).toMatchSnapshot('emulated event, esc');
    //
    const safeStringify = (obj, indent = 2) => {
      const cache = [];
      const retVal = JSON.stringify(
        obj,
        (key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (cache.includes(value)) {
              return undefined;
            }

            cache.push(value);
          }
          return value;
        },
        indent
      );
      return retVal;
    };



    // expect(safeStringify(mockClear.mock.calls)).toMatchSnapshot('emulated event, esc');
    expect(mockClear.mock.calls).toMatchSnapshot('emulated event, esc');

    /* doesn't work
    const component = await renderComponent(<TextInput {...props} />);
    // const input = component.original.querySelector('input');
    const input = component.querySelector('input');
    const mockEvent = { target: { value: '' }, keyCode: 27, which: 27, key: 'Escape', persist: helpers.noop };
    fireEvent.keyUp(input, mockEvent);
    expect(props.onKeyUp).toHaveBeenCalledTimes(1);
    expect(mockClear).toHaveBeenCalledTimes(1);
     */

    /* works
    const { container } = render(<TextInput {...props} />);
    const input = container.querySelector('input');
    const mockEvent = { target: { value: '' }, keyCode: 27, which: 27, key: 'Escape', persist: helpers.noop };
    fireEvent.keyUp(input, mockEvent);
    expect(props.onKeyUp).toHaveBeenCalledTimes(1);
    expect(mockClear).toHaveBeenCalledTimes(1);
    */

    /* works
    const { container, rerender } = render(<TextInput {...props} />);
    const input = container.querySelector('input');
    const mockEvent = { target: { value: '' }, keyCode: 27, which: 27, key: 'Escape', persist: helpers.noop };
    fireEvent.keyUp(input, mockEvent);
    expect(props.onKeyUp).toHaveBeenCalledTimes(1);

    const updatedProps = {
      ...props,
      onKeyUp: undefined,
      onClear: mockClear
    };
    rerender(<TextInput {...updatedProps} />);
    fireEvent.keyUp(input, mockEvent);
    expect(mockClear).toHaveBeenCalledTimes(1);
     */

    /*
    const component = await renderComponent(<div><div><TextInput {...props} /></div></div>);
    const mockEvent = { target: { value: '' }, keyCode: 27, which: 27, key: 'Escape', persist: helpers.noop };
    const input = component.find('input');
    // input.addEventListener('keyup', (...args) => console.log('keyup event', args));
    // input.dispatchEvent(new Event('keyup', { mock: { hello: 'world' }, bubbles: true }));
    // input.dispatchEvent(new Event('keyup', { ...mockEvent, bubbles: true }));
    await component.fireEvent.keyUp(input, mockEvent);
    console.log('>>>>>', input.value === '');
    */

    /*
    const getLastChildren = (parent) => {
      return Array.from(parent.children).reduce((acc, node) => {
        const children = Array.from(node.children);
        if (children.length === 0) {
          acc.push(node);
          return acc;
        }
        return [...acc, ...getLastChildren(node)];
      }, []);
    };

    console.log('>>>>>', component.find('div:nth-child(1)'));
    console.log('>>>>>', getLastChildren(component));
    */

    // console.log('input', input);
    // console.log('input', input.focus());
    // component.focus();
    // component.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 27, which: 27, key: '27' }));
    // component.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 27, which: 27, key: 'Escape' }));

    // await input.dispatchEvent(new Event('keyup', { mock: { hello: 'world' }, bubbles: true }));

    // const mockEvent = { keyCode: 27, target: { value: 'frank' }, persist: helpers.noop };
    // const user = component.userEventSetup();
    // const input = component.find('input');

    // await user.click(component);
    // await input.focus();
    // await user.keyboard('[Key27]');
    // await user.keyup('{Esc}');

    // console.log('>>>>>> value', component.value);

    // input.dispatchEvent(new Event('keyup', { mock: { hello: 'world' }, bubbles: true }));
    // component.fireEvent.keyUp(input, mockEvent);
    // component.instance().onKeyUp(mockEvent);
    // expect(input.value).toMatchSnapshot('emulated event, esc');

    // expect(props.onClear.mock.calls).toMatchSnapshot('emulated event, esc');
  });

  /*
  it('should return an emulated onClear event on escape with type search', done => {
    const props = {
      value: 'lorem ipsum',
      type: 'search'
    };

    props.onClear = event => {
      expect(event).toMatchSnapshot('emulated event, esc, type search');
      done();
    };

    const component = shallow(<TextInput {...props} />);
    const mockEvent = { keyCode: 27, currentTarget: { value: '' }, persist: helpers.noop };
    component.instance().onKeyUp(mockEvent);
  });

  it('should return an emulated onClear event on search clear', done => {
    const props = {
      value: 'lorem ipsum',
      type: 'search'
    };

    props.onClear = event => {
      expect(event).toMatchSnapshot('emulated event, clear');
      done();
    };

    const component = shallow(<TextInput {...props} />);
    const mockEvent = { currentTarget: { value: 'lorem ipsum' }, persist: helpers.noop };
    component.instance().onMouseUp(mockEvent);
    mockEvent.currentTarget.value = '';
  });
   */
});
