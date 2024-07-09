import { useEffect, useState } from 'react';
import { helpers } from '../common';

/**
 * Global window related hooks.
 *
 * @memberof Hooks
 * @module UseWindow
 */

/**
 * Apply a global onload
 *
 * @param {Element} target
 * @returns {boolean}
 */
const useOnload = (target = document.querySelector('.curiosity')) => {
  const [isTargetLoaded, setIsTargetLoaded] = useState(true);

  useEffect(() => {
    let timeout;

    if (target) {
      console.log('>>>> GLOBAL SETTING ONLOAD', true);
      // timeout = window.setTimeout(() => {
      //  setIsTargetLoaded(true);
      // });
    } else {
      console.log('>>>> GLOBAL SETTING ONLOAD', false);
      timeout = window.setTimeout(() => {
        setIsTargetLoaded(false);
      });
    }

    return () => {
      window.clearTimeout(timeout);
    };
  }, [target]);

  return isTargetLoaded;
};

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

const windowHooks = {
  useOnload,
  useResizeObserver
};

export { windowHooks as default, windowHooks, useOnload, useResizeObserver };
