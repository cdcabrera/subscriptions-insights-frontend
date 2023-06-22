import React from 'react';
import * as reactRedux from 'react-redux';
import { fireEvent, queries, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import * as pfReactCoreComponents from '@patternfly/react-core';
import * as pfReactChartComponents from '@patternfly/react-charts';
import { setupDotenvFilesForEnv } from './build.dotenv';

/**
 * Set dotenv params.
 */
setupDotenvFilesForEnv({ env: process.env.NODE_ENV });

/**
 * Conditionally skip "it" test statements.
 * Ex:
 *   skipIt(true)('should do a thing...', () => { ... });
 *
 * @param {*|boolean} value Any truthy value, typically used with environment variables
 *
 * @returns {*|jest.It}
 */
global.skipIt = value => (value && it?.skip) || it;

/**
 * Emulate for component checks
 */
jest.mock('i18next', () => {
  const Test = function () { // eslint-disable-line
    this.use = () => this;
    this.init = () => Promise.resolve();
    this.changeLanguage = () => Promise.resolve();
  };
  return new Test();
});

/**
 * Emulate for component checks
 */
jest.mock('lodash/debounce', () => jest.fn);

/**
 * We currently use a wrapper for useSelector, emulate for component checks
 */
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

/**
 * Emulate react router dom useLocation
 */
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ hash: '', search: '' })
}));

/**
 * Add the displayName property to function based components. Makes sure that snapshot tests have named components
 * instead of displaying a generic "<Component.../>".
 *
 * @param {object} components
 */
const addDisplayName = components => {
  Object.keys(components).forEach(key => {
    const component = components[key];
    if (typeof component === 'function' && !component.displayName) {
      component.displayName = key;
    }
  });
};

addDisplayName(pfReactCoreComponents);
addDisplayName(pfReactChartComponents);

/**
 * Apply a global insights chroming object.
 *
 * @type {{chrome: {init: Function, navigation: Function, auth: {getUser: Function}, identifyApp: Function,
 *     getUserPermissions: Function, isBeta: Function, hideGlobalFilter: Function, on: Function}}}
 */
global.window.insights = {
  chrome: {
    appNavClick: Function.prototype,
    auth: {
      getUser: () =>
        new Promise(resolve =>
          resolve({
            identity: {
              account_number: '0',
              type: 'User'
            }
          })
        )
    },
    getBundleData: Function.prototype,
    getUserPermissions: () => [],
    hideGlobalFilter: Function.prototype,
    identifyApp: Function.prototype,
    init: Function.prototype,
    isBeta: Function.prototype,
    on: Function.prototype,
    updateDocumentTitle: Function.prototype
  }
};

/**
 * Emulate frontend-components hooks
 */
jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({
    ...global.window.insights
  })
}));

/**
 * Mock an object property, restore with mockClear.
 * A consistent object property mock for scenarios where the property is not a function/Jest fails.
 *
 * @param {object} object
 * @param {string} property
 * @param {*} mockValue
 * @returns {{mockClear: Function}}
 */
global.mockObjectProperty = (object = {}, property, mockValue) => {
  const updatedObject = object;
  const originalProperty = updatedObject[property];
  updatedObject[property] = mockValue;

  return {
    mockClear: () => {
      updatedObject[property] = originalProperty;
    }
  };
};

/**
 * React testing for components.
 *
 * @param {React.ReactNode} testComponent
 * @param {object} options
 * @param {Function} options.callback
 * @param {object} options.options
 *
 * @returns {Promise<null>}
 */
global.mountHookComponent = async (testComponent, { callback, ...options } = {}) => {
  const getDisplayName = reactComponent =>
    reactComponent?.displayName ||
    reactComponent?.$$typeof?.displayName ||
    reactComponent?.$$typeof?.name ||
    reactComponent?.name ||
    reactComponent?.type.displayName ||
    reactComponent?.type.name;

  const componentInfo = {
    displayName: getDisplayName(testComponent),
    props: {
      ...testComponent?.props,
      children: React.Children.toArray(testComponent?.props?.children).map(child => ({
        displayName: getDisplayName(child),
        props: child?.props,
        type: child?.type
      }))
    }
  };

  let mountedComponent = null;
  let renderRest = {};

  const { container, ...rest } = render(testComponent, { queries, ...options });
  mountedComponent = container;
  renderRest = rest;

  if (typeof callback === 'function') {
    await callback({ component: mountedComponent });
  }

  const mount = document.createElement(componentInfo?.displayName || 'element');
  mount.original = mountedComponent;
  mount.setAttribute('props', JSON.stringify(componentInfo?.props || {}, null, 2));
  mount.userEventSetup = () => userEvent.setup();
  mount.fireEvent = fireEvent;
  mount.innerHTML = mountedComponent.innerHTML;
  mount.props = componentInfo.props;
  mount.setProps = async updatedProps => {
    const updatedComponent = { ...testComponent, props: { ...testComponent?.props, ...updatedProps } };
    return global.mountHookComponent(updatedComponent, { queries, ...options });
  };

  mount.find = selector => {
    if (typeof selector !== 'string' && React.isValidElement(React.createElement(selector))) {
      const p = [];
      const loop = comp => {
        React.Children.toArray(comp).forEach(child => {
          if (React.isValidElement(child) && child.type === selector) {
            p.push(child);
          }

          if (child?.children || child?.props?.children) {
            loop(child?.children || child?.props?.children);
          }
        });
      };

      loop(testComponent);
      return p;
    }

    try {
      return mount?.querySelector(selector);
    } catch (e) {
      return [];
    }
  };

  Object.entries(renderRest).forEach(([key, value]) => {
    mount[key] = value;
  });

  return mount;
};

global.mountHookWrapper = global.mountHookComponent;

global.shallowHookComponent = global.mountHookComponent;

global.shallowHookWrapper = global.mountHookComponent;

global.renderComponent = (testComponent, { ...options } = {}) => {
  const getDisplayName = reactComponent =>
    reactComponent?.displayName ||
    reactComponent?.$$typeof?.displayName ||
    reactComponent?.$$typeof?.name ||
    reactComponent?.name ||
    reactComponent?.type.displayName ||
    reactComponent?.type.name;

  const componentInfo = {
    displayName: getDisplayName(testComponent),
    props: {
      ...testComponent?.props,
      children: React.Children.toArray(testComponent?.props?.children).map(child => ({
        displayName: getDisplayName(child),
        props: child?.props,
        type: child?.type
      }))
    }
  };

  const containerElement = document.createElement(componentInfo?.displayName || 'element');
  containerElement.setAttribute('props', JSON.stringify(componentInfo?.props || {}, null, 2));
  containerElement.props = componentInfo.props;

  const { container, ...renderRest } = render(testComponent, {
    container: containerElement,
    queries,
    ...options
  });

  const updatedContainer = container;
  /*
  updatedContainer.render = () => {
    const mount = document.createElement(componentInfo?.displayName || 'element');
    mount.setAttribute('props', JSON.stringify(componentInfo?.props || {}, null, 2));
    mount.innerHTML = container.innerHTML;
    mount.props = componentInfo.props;
    return mount;
  };
  */

  updatedContainer.setProps = updatedProps => {
    const updatedComponent = { ...testComponent, props: { ...testComponent?.props, ...updatedProps } };
    return global.renderComponent(updatedComponent, { queries, ...options });
  };

  updatedContainer.find = selector => container?.querySelector(selector);
  updatedContainer.fireEvent = fireEvent;

  Object.entries(renderRest).forEach(([key, value]) => {
    updatedContainer[key] = value;
  });

  return updatedContainer;

  /*
  const mount = document.createElement(componentInfo?.displayName || 'element');
  mount.original = mountedComponent;
  mount.setAttribute('props', JSON.stringify(componentInfo?.props || {}, null, 2));
  mount.fireEvent = fireEvent;
  mount.innerHTML = mountedComponent.innerHTML;
  mount.props = componentInfo.props;
  mount.setProps = async updatedProps => {
    const updatedComponent = { ...testComponent, props: { ...testComponent?.props, ...updatedProps } };
    return global.mountHookComponent(updatedComponent, { queries, ...options });
  };

  mount.find = selector => {
    if (typeof selector !== 'string' && React.isValidElement(React.createElement(selector))) {
      const p = [];
      const loop = comp => {
        React.Children.toArray(comp).forEach(child => {
          if (React.isValidElement(child) && child.type === selector) {
            p.push(child);
          }

          if (child?.children || child?.props?.children) {
            loop(child?.children || child?.props?.children);
          }
        });
      };

      loop(testComponent);
      return p;
    }

    try {
      return mount?.querySelector(selector);
    } catch (e) {
      return [];
    }
  };

  Object.entries(renderRest).forEach(([key, value]) => {
    mount[key] = value;
  });

  return mount;
  */
};

/**
 * Fire a hook, return the result.
 *
 * @param {Function} useHook
 * @param {object} options
 * @param {object} options.state An object representing a mock Redux store's state.
 * @returns {*}
 */
global.mountHook = async (useHook = Function.prototype, { state } = {}) => {
  let result;
  let spyUseSelector;
  let unmountHook;

  const Hook = () => {
    result = useHook();
    return null;
  };

  await act(async () => {
    if (state) {
      spyUseSelector = jest.spyOn(reactRedux, 'useSelector').mockImplementation(_ => _(state));
    }
    const { unmount } = await render(<Hook />);
    unmountHook = unmount;
  });

  const unmount = async () => {
    await act(async () => unmountHook());
  };

  if (state) {
    spyUseSelector.mockClear();
  }

  return { unmount, result };
};

global.shallowHook = global.mountHook;

// FixMe: revisit squashing log and group messaging, redux leaks log messaging
// ToDo: revisit squashing "popper" alerts
/*
 * For applying a global Jest "beforeAll", based on
 * - consoledot/platform console messaging
 * - jest-prop-type-error, https://www.npmjs.com/package/jest-prop-type-error
 * - PF popper alerts
 * - mountHookComponent, test function testComponent messaging
 */
beforeAll(() => {
  const { error, group, log } = console;

  const interceptConsoleMessaging = (method, callback) => {
    console[method.name] = (message, ...args) => {
      const isValid = callback(message, ...args);
      if (isValid === true) {
        method.apply(console, [message, ...args]);
      }
    };
  };

  interceptConsoleMessaging(group, () => process.env.CI !== 'true');

  interceptConsoleMessaging(log, () => process.env.CI !== 'true');

  interceptConsoleMessaging(error, (message, ...args) => {
    if (/(Invalid prop|Failed prop type)/gi.test(message)) {
      throw new Error(message);
    }

    if (/<testComponent/gi.test(message) || args?.[0] === 'testComponent') {
      return false;
    }

    return !/(Not implemented: navigation)/gi.test(message) && !/Popper/gi.test(args?.[0]);
  });
});
