import { useCallback } from 'react';
import _isPlainObject from 'lodash/isPlainObject';
import { useDispatch, useSelector, useSelectors, useSelectorsResponse } from './useReactRedux';

// dispatch([{ payload: func, one, two, three }])
const useDynamicDispatch = ({ useDispatch: useAliasDispatch = useDispatch } = {}) => {
  const dispatch = useAliasDispatch();

  return useCallback(
    typeValue => {
      const updatedTypeValue = (Array.isArray(typeValue) && typeValue) || [typeValue];

      console.log('>>>> DYNAMIC DISPATCH', updatedTypeValue);

      return dispatch(
        updatedTypeValue
          .filter(value => 'type' in value && _isPlainObject(value))
          .map(value => {
            if (value.payload) {
              // consider placing meta id as part of type... but that could be confusing the consumer should just do it
              return {
                ...value,
                meta: {
                  ...value.meta,
                  __originalType: value.type,
                  __dynamic: true
                }
              };
            }

            return { ...value, __originalType: value.type, __dynamic: true };
          })
      );
    },
    [dispatch]
  );
};

/**
 * Wrapper for Redux hook, useDynamicSelector. Uses a base action.type to build a selector query for you.
 * Applies test mode and a fallback value.
 *
 * @param {string} selector
 * @param {*} value
 * @param {object} options
 * @param {*} options.equality
 * @param {Function} options.useSelector
 * @returns {*}
 */
const useDynamicSelector = (selector, value = null, { equality, useSelector: useAliasSelector = useSelector } = {}) => {
  // const updatedSelector = (typeof selector === 'string' && ({ dynamic }) => dynamic?.[selector]) || selector;
  let updatedSelector = selector;

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
  const selectorIds = new Set();

  updatedSelectors = updatedSelectors.map(selector => {
    if (typeof selector?.selector === 'string' && selector.id) {
      selectorIds.add(selector.id);
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
