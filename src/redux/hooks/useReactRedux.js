import { useSelector as UseSelector, shallowEqual } from 'react-redux';
import { createSelector } from 'reselect';
import { store } from '../store';
import { helpers } from '../../common/helpers';

/**
 * FixMe: Appears to be an issue in trying to use Redux Promise with the default "useDispatch"
 */
/**
 * Wrapper for store.dispatch, emulating useDispatch.
 *
 * @returns {Function}
 */
const useDispatch = () => dispatchEvent => store.dispatch(dispatchEvent);

/**
 * Wrapper for Redux hook, useSelector. Applies test mode and a fallback value.
 *
 * @param {Function} selector
 * @param {*} value
 * @param {object} options
 * @returns {*}
 */
const useSelector = (selector, value = null, options = {}) => {
  if (helpers.TEST_MODE) {
    return value;
  }

  return UseSelector(selector, options.equality) ?? value;
};

/**
 * Generate a selector from multiple selectors for use in "useSelector".
 *
 * @param {Array} params
 * @returns {Array}
 */
const useMultiSelector = (...params) => {
  const [firstSel, ...selectors] = params;
  const updatedSelectors = (Array.isArray(firstSel) && firstSel) || selectors;
  const multiSelector = createSelector(updatedSelectors, (...results) => results);

  return useSelector(multiSelector, shallowEqual);
};

const reactReduxHooks = {
  shallowEqual,
  useDispatch,
  useMultiSelector,
  useSelector
};

export { reactReduxHooks as default, reactReduxHooks, shallowEqual, useDispatch, useMultiSelector, useSelector };
