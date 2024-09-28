import { useCallback, useEffect, useState } from 'react';
import { helpers } from '../common';

/**
 * Global window related hooks.
 *
 * @memberof Hooks
 * @module UseWindow
 */

/**
 * Apply a resize observer to an element.
 *
 * @param {*} target
 * @returns {{width: number, height: number}}
 */
const useResizeObserver = target => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const isElementResize = target && window.ResizeObserver && true;
    const element = target?.current;
    let removeObserver = helpers.noop;
    let timeout;

    if (element) {
      const handler = () => {
        const { clientHeight = 0, clientWidth = 0, innerHeight = 0, innerWidth = 0 } = element || {};

        timeout = window.setTimeout(() => {
          setDimensions({
            width: isElementResize ? clientWidth : innerWidth,
            height: isElementResize ? clientHeight : innerHeight
          });
        });
      };

      if (isElementResize) {
        const resizeObserver = new window.ResizeObserver(handler);
        resizeObserver.observe(element);
        removeObserver = () => resizeObserver.unobserve(element);
      } else {
        handler();
        window.addEventListener('resize', handler);
        removeObserver = () => window.removeEventListener('resize', handler);
      }
    }

    return () => {
      window.clearTimeout(timeout);
      removeObserver();
    };
  }, [target]);

  return dimensions;
};

const patchHistoryMethod = method => {
  const { history } = window;
  const original = history[method];

  history[method] = function (state, ...args) {
    const event = new Event(method.toLowerCase());
    event.state = state;
    window.dispatchEvent(event);
    return original.call(this, state, ...args);
  };
};

const useLocation = () => {
  const [location, setLocation] = useState({ ...window.location, _id: helpers.generateHash(window.location) });
  console.log('>>>> USE LOCATION');

  useEffect(() => {
    let timeout;
    console.log('>>>> MOUNT USE LOCATION');
    patchHistoryMethod('pushState');
    patchHistoryMethod('replaceState');

    /*
    const handler = (...args) => {
      timeout = window.setTimeout(() => {
        const _id = helpers.generateHash(window.location);
        if (location._id !== _id) {
          console.log('>>>> USELOCATION CUSTOM', args);
          setLocation(() => ({ ...window.location, _id }));
        }
      });
    };
    */

    const handler = () => {
      const _id = helpers.generateHash(window.location);
      console.log('>>>> USELOCATION CUSTOM 001', window.location.pathname);
      // if (location._id !== _id) {
      console.log('>>>> USELOCATION CUSTOM 002');
      setLocation(() => ({ ...window.location, _id }));
      // }
    };

    window.addEventListener('popstate', handler);
    window.addEventListener('pushstate', handler);
    window.addEventListener('replacestate', handler);

    return () => {
      window.removeEventListener('popstate', handler);
      window.removeEventListener('pushState', handler);
      window.removeEventListener('replaceState', handler);
      window.clearTimeout(timeout);
    };
  }, []);

  return location;
};

const windowHooks = {
  useLocation,
  useResizeObserver
};

export { windowHooks as default, windowHooks, useLocation, useResizeObserver };
