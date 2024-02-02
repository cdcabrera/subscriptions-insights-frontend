import { useEffect, useRef, useState } from 'react';
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

/**
 * window.setTimeout hook polling hook with multiple cancel alternatives
 *
 * @param {function(): boolean} callback Callback can return a boolean, with false cancelling the timeout.
 * @param {number} pollInterval
 * @returns {{cancel: function(): void, update: number|undefined}} A cancel function is returned,
 *     calling it cancels the setTimeout. The returned "update" value is a time increment, always
 *     adding up, and purposefully causing a hook update.
 */
const useTimeout = (callback, pollInterval = 0) => {
  const timer = useRef();
  const [update, setUpdate] = useState();
  const result = callback();

  useEffect(() => {
    if (result !== false) {
      timer.current = window.setTimeout(() => setUpdate(helpers.getCurrentDate().getTime()), pollInterval);
    }

    return () => {
      window.clearTimeout(timer.current);
    };
  }, [pollInterval, update, result]);

  return { update, cancel: () => window.clearTimeout(timer.current) };
};

const windowHooks = {
  useResizeObserver,
  useTimeout
};

export { windowHooks as default, windowHooks, useResizeObserver, useTimeout };
