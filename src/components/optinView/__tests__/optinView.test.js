import React from 'react';
import { OptinView } from '../optinView';

describe('OptinView Component', () => {
  it('should render a basic component', async () => {
    const props = {};

    const component = await shallowHookComponent(<OptinView {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should render an API state driven view', async () => {
    const props = {};

    const component = await shallowHookComponent(<OptinView {...props} />);
    expect(component).toMatchSnapshot('initial view');

    component.setProps({
      session: {
        status: 200
      }
    });
    expect(component.find('CardFooter').first()).toMatchSnapshot('200 view');

    component.setProps({
      session: {
        status: 401
      }
    });
    expect(component.find('CardFooter').first()).toMatchSnapshot('401 view');

    component.setProps({
      session: {
        status: 403
      }
    });
    expect(component.find('CardFooter').first()).toMatchSnapshot('403 view');

    component.setProps({
      session: {
        status: 418
      }
    });
    expect(component.find('CardFooter').first()).toMatchSnapshot('4XX view');

    component.setProps({
      session: {
        status: 500
      }
    });
    expect(component.find('CardFooter').first()).toMatchSnapshot('500 view');

    component.setProps({
      session: {
        status: null
      }
    });
    expect(component.find('CardFooter').first()).toMatchSnapshot('null or undefined status view');

    component.setProps({
      useSelectorsResponse: () => ({ pending: true }),
      session: {}
    });
    expect(component.find('CardFooter').first()).toMatchSnapshot('pending view');

    component.setProps({
      useSelectorsResponse: () => ({ error: true })
    });
    expect(component.find('CardFooter').first()).toMatchSnapshot('error view');

    component.setProps({
      useSelectorsResponse: () => ({ fulfilled: true })
    });
    expect(component.find('CardFooter').first()).toMatchSnapshot('fulfilled view');
  });

  it('should submit an opt-in form', async () => {
    const mockDispatch = jest.fn();
    const props = {
      useDispatch: () => mockDispatch,
      session: {
        status: 403
      }
    };

    const component = await mountHookComponent(<OptinView {...props} />);
    component.find('form button').simulate('click');

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch');
  });
});
