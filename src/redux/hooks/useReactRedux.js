import { useSelector as useReactReduxSelector, shallowEqual } from 'react-redux';
import { createSelector } from 'reselect';
import { store } from '../store';
import { helpers } from '../../common';

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
 * @param {*} options.equality
 * @param {Function} options.useSelector
 * @returns {*}
 */
const useSelector = (
  selector,
  value = null,
  { equality, useSelector: useAliasSelector = useReactReduxSelector } = {}
) => useAliasSelector(selector, equality) ?? value;

/**
 * Generate a selector from multiple selectors for use in "useSelector".
 *
 * @param {Array|Function} selectors A selector function or array of functions. Or an array of objects in the form of
 *     { selector: Function, id: string } If an "ID" is used for each selector the returned response will be in the
 *     form of an object whose properties reflect said IDs with the associated selector value.
 * @param {*} value Pass-through value similar to charging the response.
 * @param {object} options
 * @param {Function} options.useSelector
 * @param {*} options.equality
 * @returns {Array|object}
 */
const useSelectors = (
  selectors,
  value,
  { equality = shallowEqual, useSelector: useAliasSelector = useReactReduxSelector } = {}
) => {
  let updatedSelectors = Array.isArray(selectors) ? selectors : [selectors];
  const selectorIds = new Set();

  updatedSelectors = updatedSelectors.map(selector => {
    if (selector.selector && selector.id) {
      selectorIds.add(selector.id);
      return selector.selector;
    }
    return selector;
  });

  const multiSelector = createSelector(updatedSelectors, (...results) => results);
  const listMultiSelectorResponse = useAliasSelector(multiSelector, equality) ?? value;

  if (selectorIds.size && selectorIds.size === listMultiSelectorResponse.length) {
    const idMultiSelectorResponse = {};

    Array.from(selectorIds).forEach((id, index) => {
      idMultiSelectorResponse[id] = listMultiSelectorResponse[index];
    });

    console.log('>>>>>>>> idMultiSelectorResponse', idMultiSelectorResponse);

    return idMultiSelectorResponse;
  }

  return listMultiSelectorResponse;
};

/**
 * Return a combined selector response using a "Promise.all" like response.
 *
 * @param {Array|Function} selectors A selector function or array of functions. Or an array of objects in the form of
 *     { selector: Function, id: string } If an "ID" is used for each selector the returned response will be in the
 *     form of an object whose properties reflect said IDs with the associated selector value.
 * @param {object} options
 * @param {Function} options.useSelectors
 * @param {Function} options.customResponse Callback for customizing your own response
 * @returns {{data: ({}|*[]), pending: boolean, fulfilled: boolean, responses: {errorList: *[], errorId: {},
 *     id: {}, list: *[]}, cancelled: boolean, error: boolean, message: null}}
 */
const useSelectorsResponse = (selectors, { useSelectors: useAliasSelectors = useSelectors, customResponse } = {}) => {
  const selectorResponse = useAliasSelectors(selectors, []);
  const isSelectorResponseArray = Array.isArray(selectorResponse);
  const cancelledById = {};
  const cancelledList = [];
  const errorList = [];
  const errorById = {};
  const fulfilledList = [];
  const pendingList = [];
  const originalResponseByList = [];
  const originalResponsesById = {};
  const idList = [];

  let isFirstResponseFulfilled = false;
  let isFirstResponseError = false;
  let firstResponseFulfilled;
  let firstResponseError;
  let firstResponse;

  const updatedSelectorResponse = (isSelectorResponseArray && selectorResponse) || Object.entries(selectorResponse);

  updatedSelectorResponse.forEach(response => {
    const updatedResponse = (isSelectorResponseArray && response) || response[1];
    const id = (!isSelectorResponseArray && response[0]) || null;
    const isServiceResponse =
      typeof updatedResponse.cancelled === 'boolean' ||
      typeof updatedResponse.error === 'boolean' ||
      typeof updatedResponse.fulfilled === 'boolean' ||
      typeof updatedResponse.pending === 'boolean';

    const { pending, fulfilled, error, cancelled, message } = (isServiceResponse && updatedResponse) || {
      fulfilled: true
    };

    if (id !== null) {
      idList.push(id);
    }

    if ((fulfilled && !firstResponse) || (error && !firstResponse)) {
      firstResponse = updatedResponse;
      isFirstResponseFulfilled = fulfilled;
      isFirstResponseError = error;

      if (fulfilled) {
        firstResponseFulfilled = updatedResponse;
      }

      if (error) {
        firstResponseError = updatedResponse;
      }
    }

    if (pending) {
      pendingList.push(updatedResponse);
    }

    if (fulfilled) {
      fulfilledList.push(updatedResponse);
    }

    if (error) {
      errorList.push({
        ...updatedResponse,
        ...new Error(message || `Error: useSelectorsAllResponse${(id && `, ${id}`) || ''}`)
      });
    }

    if (cancelled) {
      cancelledList.push(updatedResponse);
    }

    if (id !== null) {
      if (error) {
        errorById[id] = errorList[errorList.length - 1];
      }

      if (cancelled) {
        cancelledById[id] = cancelledList[cancelledList.length - 1];
      }

      originalResponsesById[id] = updatedResponse;
    }
    originalResponseByList.push(updatedResponse);
  });

  const isById = idList.length === updatedSelectorResponse.length;
  const response = {
    responses: {
      errorId: errorById,
      errorList,
      id: originalResponsesById,
      list: originalResponseByList
    },
    cancelled: false,
    data: (isById && {}) || [],
    error: false,
    fulfilled: false,
    message: null,
    pending: false
  };

  if (typeof customResponse === 'function') {
    Object.assign(response, {
      ...customResponse(
        { ...response, responses: { ...response.responses } },
        {
          cancelledById,
          cancelledList,
          errorList,
          errorById,
          fulfilledList,
          pendingList,
          originalResponseByList,
          originalResponsesById,
          idList,
          isById,
          isFirstResponseFulfilled,
          firstResponseFulfilled,
          isFirstResponseError,
          firstResponseError,
          firstResponse,
          updatedSelectorResponse
        }
      )
    });

    return response;
  }

  if (errorList.length) {
    response.message = new Error(errorList[0]);
    response.error = true;
    response.data = (isById && errorById) || errorList;
    return response;
  }

  if (pendingList.length) {
    response.pending = true;
    return response;
  }

  if (cancelledList.length === originalResponseByList.length) {
    response.message = new Error('Cancelled useSelectorsAllResponse');
    response.cancelled = true;
    response.data = (isById && cancelledById) || cancelledList;
    return response;
  }

  if (
    fulfilledList.length === originalResponseByList.length ||
    cancelledList.length + fulfilledList.length === originalResponseByList.length
  ) {
    response.fulfilled = true;
    response.data = (isById && originalResponsesById) || originalResponseByList;
    return response;
  }

  return response;
};

/**
 * Return a combined selector response using a "Promise.allSettled" like response.
 *
 * @param {Array|Function} selectors
 * @param {object} options
 * @param {Function} options.useSelectorsResponse
 * @returns {{data: ({}|*[]), pending: boolean, fulfilled: boolean, responses: {errorList: *[], errorId: {},
 *     id: {}, list: *[]}, cancelled: boolean, error: boolean, message: null}}
 */
const useSelectorsAllSettledResponse = (
  selectors,
  { useSelectorsResponse: useAliasSelectorsResponse = useSelectorsResponse } = {}
) => {
  const customResponse = (baseResponse, { pendingList, originalResponseByList, originalResponsesById, isById }) => {
    const response = { ...baseResponse };

    if (pendingList.length) {
      response.pending = true;
      return response;
    }

    response.fulfilled = true;
    response.data = (isById && originalResponsesById) || originalResponseByList;
    return response;
  };

  return useAliasSelectorsResponse(selectors, { customResponse });
};

/**
 * Return a combined selector response using a "Promise.any" like response.
 *
 * @param {Array|Function} selectors
 * @param {object} options
 * @param {Function} options.useSelectorsResponse
 * @returns {{data: ({}|*[]), pending: boolean, fulfilled: boolean, responses: {errorList: *[], errorId: {},
 *     id: {}, list: *[]}, cancelled: boolean, error: boolean, message: null}}
 */
const useSelectorsAnyResponse = (
  selectors,
  { useSelectorsResponse: useAliasSelectorsResponse = useSelectorsResponse } = {}
) => {
  const customResponse = (
    baseResponse,
    {
      cancelledById,
      cancelledList,
      errorList,
      fulfilledList,
      pendingList,
      originalResponseByList,
      originalResponsesById,
      idList,
      isById
    }
  ) => {
    const response = { ...baseResponse };

    if (fulfilledList.length) {
      response.fulfilled = true;
      response.data = (isById && originalResponsesById[idList[0]]) || originalResponseByList[0];
      return response;
    }

    if (pendingList.length) {
      response.pending = true;
      return response;
    }

    if (
      errorList.length === originalResponseByList.length ||
      cancelledList.length + errorList.length === originalResponseByList.length
    ) {
      response.message = helpers.aggregatedError(errorList);
      response.error = true;
      response.data = (isById && originalResponsesById) || originalResponseByList;
      return response;
    }

    if (cancelledList.length === originalResponseByList.length) {
      response.message = new Error('Cancelled useSelectorsAllResponse');
      response.cancelled = true;
      response.data = (isById && cancelledById) || cancelledList;
      return response;
    }

    return response;
  };

  return useAliasSelectorsResponse(selectors, { customResponse });
};

/**
 * Return a combined selector response using a "Promise.race" like response.
 *
 * @param {Array|Function} selectors
 * @param {object} options
 * @param {Function} options.useSelectorsResponse
 * @returns {{data: ({}|*[]), pending: boolean, fulfilled: boolean, responses: {errorList: *[], errorId: {},
 *     id: {}, list: *[]}, cancelled: boolean, error: boolean, message: null}}
 */
const useSelectorsRaceResponse = (
  selectors,
  { useSelectorsResponse: useAliasSelectorsResponse = useSelectorsResponse } = {}
) => {
  const customResponse = (
    baseResponse,
    {
      cancelledById,
      cancelledList,
      errorList,
      fulfilledList,
      pendingList,
      originalResponseByList,
      originalResponsesById,
      idList,
      isById
    }
  ) => {
    const response = { ...baseResponse };

    if (fulfilledList.length) {
      response.fulfilled = true;
      response.data = (isById && originalResponsesById[idList[0]]) || originalResponseByList[0];
      return response;
    }

    if (errorList.length) {
      response.message = new Error(errorList[0]);
      response.error = true;
      response.data = (isById && originalResponsesById[idList[0]]) || originalResponseByList[0];
      return response;
    }

    if (pendingList.length) {
      response.pending = true;
      return response;
    }

    if (cancelledList.length === originalResponseByList.length) {
      response.message = new Error('Cancelled useSelectorsAllResponse');
      response.cancelled = true;
      response.data = (isById && cancelledById) || cancelledList;
      return response;
    }

    return response;
  };

  return useAliasSelectorsResponse(selectors, { customResponse });
};

const reactReduxHooks = {
  shallowEqual,
  useDispatch,
  useSelector,
  useSelectors,
  useSelectorsResponse,
  useSelectorsAllSettledResponse,
  useSelectorsAnyResponse,
  useSelectorsRaceResponse
};

export {
  reactReduxHooks as default,
  reactReduxHooks,
  shallowEqual,
  useDispatch,
  useSelector,
  useSelectors,
  useSelectorsResponse,
  useSelectorsAllSettledResponse,
  useSelectorsAnyResponse,
  useSelectorsRaceResponse
};
