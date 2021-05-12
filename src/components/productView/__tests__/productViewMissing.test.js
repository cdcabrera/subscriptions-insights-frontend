import React from 'react';
import { shallow, mount } from 'enzyme';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Button, Card } from '@patternfly/react-core';
import ReactRouterDom, { useHistory, MemoryRouter } from 'react-router-dom';
import { ProductViewMissing } from '../productViewMissing';
import { Toolbar } from '../../toolbar/toolbar';
// import {act} from "react-dom/test-utils";

describe('ProductViewMissing Component', () => {
  let container = null;
  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });
  /*
  const loadHookComponent = async callback => {
    let component = null;
    await act(async () => {
      component = callback();
    });
    component?.update();
    return component;
  };
  */
  const loadHookComponent = callback => {
    let component = null;
    act(() => {
      component = callback();
    });
    component?.update();
    return component;
  };

  const mockWindowLocation = async ({ url, callback }) => {
    const updatedUrl = new URL(url);
    const { location } = window;
    delete window.location;
    // mock
    window.location = {
      href: updatedUrl.href,
      search: updatedUrl.search,
      hash: updatedUrl.hash,
      pathname: updatedUrl.pathname
    };
    // await loadHookComponent(callback);
    await callback();
    // restore
    window.location = location;
  };

  it('should render a non-connected component', () => {
    const props = {};
    const component = shallow(<ProductViewMissing {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should render a predictable set of product cards', () => {
    const props = {};

    mockWindowLocation({
      url: 'https://ci.foo.redhat.com/loremIpsum/dolorSit/',
      callback: () => {
        const component = shallow(<ProductViewMissing {...props} />);
        expect(component).toMatchSnapshot('non-connected');
      }
    });
  });

  it('should have cards that navigate to product IDs when clicked, WORKSISH', () => {
    const mockPush = jest.fn();
    const props = {
      useHistory: () => ({
        push: mockPush
      })
    };

    mockWindowLocation({
      url: 'https://ci.foo.redhat.com/loremIpsum/dolorSit/',
      callback: () => {
        /*
        const mockPush = jest.fn();
        jest.mock('react-router-dom', () => ({
          ...jest.requireActual('react-router-dom'),
          useHistory: () => ({
            push: mockPush
          })
        }));
        */
        // const mockPush = jest.fn();
        /*
        jest.mock('react-router-dom', () => {
          const Test = function () { // eslint-disable-line
            this.useHistory = () => this;
            this.push = () => mockPush;
          };
          return new Test();
        });
        */

        const component = shallow(<ProductViewMissing {...props} />);
        const cardButton = component.find(Card).first().find(Button).first();

        cardButton.simulate('click', 'lorem-ipsum-id');

        // console.log('>>>', component.children().render());
        // console.log('>>>', mockPush.mock);
      }
    });
  });

  it('should have cards that navigate to product IDs when clicked 2', () => {
    const mockPush = jest.fn();
    const props = {};
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useHistory: () => ({
        push: mockPush
      })
    }));

    mockWindowLocation({
      url: 'https://ci.foo.redhat.com/loremIpsum/dolorSit/',
      callback: () => {
        const component = mount(<ProductViewMissing {...props} />);
        const cardButton = component.find(Card).first().find(Button).first();
        cardButton.simulate('click');
      }
    });

    // console.log('>>>', component.children().render());
    console.log('>>>', mockPush.mock);
  });

  /*
  it('should have cards that navigate to products when clicked', async () => {
    const props = {};

    // const mockPush = val => console.log('HEY >>>>>>>>>>>>>', val);
    // const mockPush = jest.fn();
    // jest.spyOn(ReactRouterDom, useHistory).mockImplementation(() => ({ push: mockPush }));

    /*
    const mockPush = jest.fn(val => val);
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useHistory: () => ({
        push: mockPush
      })
    }));
     * /
    // mockPush.mockReturnValue();
    // jest.mock('react-router-dom', () => ({ useHistory: { push: () => mockPush } }));
    // jest.mock('react-router-dom', () => jest.fn(() => jest.fn(() => ({ push: mockPush }))));
    // jest.mock('react-router-dom', () => ({ useHistory: { push: () => mockPush } }));
    // jest.mock('react-router-dom', () => ({ useHistory: jest.fn(() => ({ push: () => mockPush })) }));
    // jest.mock('react-router-dom', () => jest.fn(() => ({ useHistory: { push: () => mockPush } })));// ({ useHistory: { push: () => mockPush } }));
    // jest.mock('react-router-dom', () => ({ useHistory: () => ({ push: mockPush }) }));

    /*
    jest.mock('react-router-dom', () => ({
      useHistory: () => {
        const push = () => mockPush;
        return { push };
      }
    }));
    * /
    // jest.mock('react-router-dom', () => ({ useHistory: { push: () => mockPush } }));

    /*
    jest.mock('react-router-dom', () => {
      const Test = function () { // eslint-disable-line
        this.useHistory = () => this;
        this.push = () => mockPush;
      };
      return new Test();
    });
    * /

    await mockWindowLocation({
      url: 'https://ci.foo.redhat.com/insights/subscriptions/',
      callback: () => {
        const component = mount(
          <MemoryRouter initialEntries={['/']}>
            <ProductViewMissing {...props} />
          </MemoryRouter>
        );

        // component.find(Button).first().simulate('click');
        // const spy = jest.spyOn(component, 'onSubmitOptIn');
        // expect(component).toMatchSnapshot('non-connected');
        // component.find(Button).at(1).simulate('click');
        // component.find(Card).first().find(Button).first().simulate('click', 'lorem ipsum');
        // const mockPush = jest.spyOn(component.instance(), 'onClick');
        const cardButton = component.find(Card).first().find(Button).first();

        cardButton.simulate('click', 'lorem ipsum');
        // console.log(component.find(Button).at(1).html());
        // console.log(component.find(Card).first().find(Button).html());
        console.log(cardButton.html());
        console.log(mockPush.mock.calls);

        /*
        await loadHookComponent(() => {
          component.find(Card).first().find(Button).first().simulate('click');
          // console.log(component.find(Button).at(1).html());
          console.log(component.find(Card).first().find(Button).html());
          console.log(mockPush.mock.calls);
          expect(mockPush).toHaveBeenCalledTimes(2);
        });
        * /
      }
    });
  });
  */
});
