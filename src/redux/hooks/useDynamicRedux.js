import { useCallback } from 'react';
import { useDispatch, useSelector, useSelectors, useSelectorsResponse } from './useReactRedux';

/**
 * State hooks for both dynamic, and standard, dispatch and selectors.
 *
 * @memberof Hooks
 * @module UseDynamicReactRedux
 */

/**
 * Wrapper for useReactRedux hook useDispatch, store.dispatch. Look for a "dynamicType" on useDispatch.
 * Allows blending of dynamic and regular action types.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @returns {Function}
 */
const useDynamicDispatch = ({ useDispatch: useAliasDispatch = useDispatch } = {}) => {
  const dispatch = useAliasDispatch();

  return useCallback(
    actionValue => {
      const updatedActionValue = (Array.isArray(actionValue) && actionValue) || [actionValue];

      return dispatch(
        updatedActionValue.map(action => {
          if ('dynamicType' in action) {
            const { dynamicType, ...updatedAction } = action;
            const updatedDynamicType = (Array.isArray(dynamicType) && dynamicType.join('-')) || dynamicType;

            if (updatedAction.payload) {
              return {
                ...updatedAction,
                type: updatedDynamicType,
                meta: {
                  ...updatedAction.meta,
                  __originalType: updatedDynamicType,
                  __dynamic: true
                }
              };
            }

            return {
              ...updatedAction,
              type: updatedDynamicType,
              __originalType: updatedDynamicType,
              __dynamic: true
            };
          }

          return action;
        })
      );
    },
    [dispatch]
  );
};

/**
 * Wrapper for useReactRedux useSelector hook, useDynamicSelector. Uses a base action.type string, or passes
 * the selector, to build a selector query for you. Applies test mode and a fallback value.
 *
 * @param {string|Function} selector
 * @param {*} value
 * @param {object} options
 * @param {*} options.equality
 * @param {Function} options.useSelector
 * @returns {*}
 */
const useDynamicSelector = (selector, value = null, { equality, useSelector: useAliasSelector = useSelector } = {}) => {
  let updatedSelector = selector;

  if (Array.isArray(selector)) {
    updatedSelector = ({ dynamic }) => dynamic?.[selector.join('-')];
  }

  if (typeof selector === 'string') {
    updatedSelector = ({ dynamic }) => dynamic?.[selector];
  }

  return useAliasSelector(updatedSelector, value, { equality });
};

/**
 * Generate a selector from multiple selectors for use in "useSelectors".
 *
 * @param {Array|Function} selectors A selector "action.type" or array of "action.type". Or an array of objects in the
 *     form of { selector: action.type, id: string } If an "ID" is used for each selector the returned response
 *     will be in the form of an object whose properties reflect said IDs with the associated selector value.
 * @param {*} value Pass-through value similar to charging the response.
 * @param {object} options
 * @param {*} options.equality
 * @param {Function} options.useSelectors
 * @returns {Array|object}
 */
const useDynamicSelectors = (selectors, value, { equality, useSelectors: useAliasSelectors = useSelectors } = {}) => {
  let updatedSelectors = Array.isArray(selectors) ? selectors : [selectors];

  updatedSelectors = updatedSelectors.map(selector => {
    if (Array.isArray(selector.selector)) {
      const { selector: arrSelector, ...restSelector } = selector;
      const updatedSelector = arrSelector.join('-');
      return {
        ...restSelector,
        selector: ({ dynamic }) => dynamic?.[updatedSelector]
      };
    }

    if (typeof selector.selector === 'string') {
      return {
        ...selector,
        selector: ({ dynamic }) => dynamic?.[selector.selector]
      };
    }

    if (typeof selector === 'string') {
      return ({ dynamic }) => dynamic?.[selector];
    }

    return selector;
  });

  return useAliasSelectors(updatedSelectors, value, { equality });
};

/**
 * Wrapper for returning a combined selector response using a "Promise.all" like response. Allows
 * for the use of dynamicTypes or regular types.
 *
 * @param {Array|Function} selectors A selector function or array of functions. Or an array of objects in the form of
 *     { selector: Function, id: string } If an "ID" is used for each selector the returned response will be in the
 *     form of an object whose properties reflect said IDs with the associated selector value.
 * @param {object} options
 * @param {Function} options.useSelectors
 * @param {Function} options.customResponse Callback for customizing your own response
 * @returns {{data: ({}|Array), pending: boolean, fulfilled: boolean, responses: {errorList: Array, errorId: {},
 *     id: {}, list: Array}, cancelled: boolean, error: boolean, message: null}}
 */
const useDynamicSelectorsResponse = (
  selectors,
  {
    customResponse,
    useSelectors: useAliasSelectors = useDynamicSelectors,
    useSelectorsResponse: useAliasSelectorsResponse = useSelectorsResponse
  } = {}
) => useAliasSelectorsResponse(selectors, { customResponse, useSelectors: useAliasSelectors });

const dynamicReactReduxHooks = {
  useDynamicDispatch,
  useDynamicSelector,
  useDynamicSelectors,
  useDynamicSelectorsResponse
};

export {
  dynamicReactReduxHooks as default,
  dynamicReactReduxHooks,
  useDynamicDispatch,
  useDynamicSelector,
  useDynamicSelectors,
  useDynamicSelectorsResponse
};
