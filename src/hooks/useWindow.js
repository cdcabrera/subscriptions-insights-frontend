import { useMemo, useState } from 'react';
import { useMount, useUnmount } from 'react-use';

/**
 * Global window related hooks.
 *
 * @memberof Hooks
 * @module UseWindow
 */

/**
 * Apply a resize observer to an element.
 *
 * @param {*} targetRef A element React "ref", or to bypass an object in the form of "{ current: HTMLElementNodeOrReactElement }"
 * @returns {{width: number, height: number, unregister: Function}}
 */
const useResizeObserver = targetRef => {
  const [unregister, setUnregister] = useState();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useMount(() => {
    if (targetRef?.current && !unregister) {
      const element = targetRef?.current;
      const handler = () => {
        const { clientHeight = 0, clientWidth = 0, innerHeight = 0, innerWidth = 0 } = element || {};

        const timeout = window.setTimeout(() => {
          setDimensions(() => ({
            timeout,
            width: clientWidth ?? innerWidth,
            height: clientHeight ?? innerHeight
          }));
        });
      };

      setUnregister(() => {
        const resizeObserver = new window.ResizeObserver(handler);
        resizeObserver.observe(element);
        return () => resizeObserver.unobserve(element);
      });
    }
  });

  useUnmount(() => {
    if (dimensions?.timeout) {
      window.clearTimeout(dimensions.timeout);
    }
    if (unregister) {
      unregister();
    }
  });

  return useMemo(
    () => ({
      ...dimensions,
      unregister: () => unregister()
    }),
    [dimensions, unregister]
  );
};

const windowHooks = {
  useResizeObserver
};

export { windowHooks as default, windowHooks, useResizeObserver };
