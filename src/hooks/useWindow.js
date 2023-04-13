import { useMemo, useState } from 'react';
import { useMount, useUnmount } from 'react-use';
// import { helpers } from '../common';

/**
 * Global window related hooks.
 *
 * @memberof Hooks
 * @module UseWindow
 */

/**
 * Apply a resize observer to an element.
 *
 * @param {*} targetRef
 * @returns {{width: number, height: number}}
 */
const useResizeObserver = targetRef => {
  const [unregister, setUnregister] = useState();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useMount(() => {
    if (targetRef?.current && !unregister) {
      const element = targetRef?.current;
      const handler = () => {
        const { clientHeight = 0, clientWidth = 0, innerHeight = 0, innerWidth = 0 } = element || {};

        /*
        setDimensions(() =>
          // let width;
          // let height;

          // const timeout = () => {
          //  width = clientWidth ?? innerWidth;
          //  height = clientHeight ?? innerHeight;
          // };

          ({
            timeout: helpers.noop,
            width: clientWidth ?? innerWidth,
            height: clientHeight ?? innerHeight
          })
        );
        */

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
    console.log('>>>> WHAT');
    console.log('>>> UNMOUNT', dimensions?.timeout, unregister);
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
