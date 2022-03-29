import { helpers } from '../common';
import { useSelectors } from './useReactRedux';
// Return 1st available fulfilled response, may be issues with this since the results are returned in an array
// Or if all fail return aggregated error

const useSelectorsAnyResponse = (selectors, { useSelectors: useAliasSelectors = useSelectors } = {}) => {
  const selectorResponse = useAliasSelectors(selectors, []);
  const isSelectorResponseArray = Array.isArray(selectorResponse);
  const errorList = [];
  const originalResponseByList = [];
  const originalResponsesById = {};

  let isPending = false;
  let isFulfilled = false;
  let cancelCount = 0;

  const updatedSelectorResponse = (isSelectorResponseArray && selectorResponse) || Object.entries(selectorResponse);

  // have to kinda cycle through the list any way
  const anyFulfilledSelectorResponse = updatedSelectorResponse.find(response => {
    const updatedResponse = (isSelectorResponseArray && response) || response[1];
    const isServiceResponse =
      typeof updatedResponse.cancelled === 'boolean' ||
      typeof updatedResponse.error === 'boolean' ||
      typeof updatedResponse.fulfilled === 'boolean' ||
      typeof updatedResponse.pending === 'boolean';

    const { fulfilled } = (isServiceResponse && updatedResponse) || { fulfilled: true };

    return fulfilled === true;
  });

  let listSelectorResponse = [];

  if (anyFulfilledSelectorResponse) {
    listSelectorResponse = [anyFulfilledSelectorResponse].map(response => {
      const updatedResponse = (isSelectorResponseArray && response) || response[1];
      const id = (!isSelectorResponseArray && response[0]) || undefined;
      const isServiceResponse =
        typeof updatedResponse.cancelled === 'boolean' ||
        typeof updatedResponse.error === 'boolean' ||
        typeof updatedResponse.fulfilled === 'boolean' ||
        typeof updatedResponse.pending === 'boolean';

      const { pending, fulfilled, error, cancelled, message } = (isServiceResponse && updatedResponse) || {
        fulfilled: true
      };

      if (pending) {
        isPending = true;
      }

      if (fulfilled) {
        isFulfilled = true;
      }

      if (error) {
        errorList.push({
          ...((isServiceResponse && updatedResponse) || undefined),
          ...new Error(message || `Error: useSelectorsAllResponse${(id && `, ${id}`) || ''}`)
        });
      }

      if (cancelled) {
        cancelCount += 1;
      }

      if (id) {
        originalResponsesById[id] = updatedResponse;
      }
      originalResponseByList.push(updatedResponse);

      return updatedResponse;
    });
  }

  /* won't work because we don't mutate the responses beyond condition checks
  listSelectorResponse = listSelectorResponse.find(response => response.fulfilled === true || response);
  listSelectorResponse = listSelectorResponse || [];
   */

  const response = {
    _data: {
      error: undefined,
      id: originalResponsesById,
      list: originalResponseByList
    },
    // data: (isSelectorResponseArray && originalResponseByList) || originalResponsesById,
    data: (isSelectorResponseArray && originalResponseByList[0]) || Object.values(originalResponsesById)[0],
    cancelled: false,
    error: false,
    fulfilled: false,
    pending: false
  };

  if (cancelCount === listSelectorResponse.length) {
    response.cancelled = true;
  } else if (
    errorList.length === listSelectorResponse.length ||
    cancelCount + errorList.length === listSelectorResponse.length
  ) {
    // ToDo: reviewing converting to AggregatedError
    // response._data.error = new Error((errorList.length === 1 && errorList[0]) || errorList);
    // response._data.error = (errorList.length === 1 && new Error(errorList[0])) || (AggregateError in window && new window.AggregateError(errorList));
    /*
    response._data.error =
      (window.AggregateError && errorList.length > 1 && new window.AggregateError(errorList)) ||
      new Error((errorList.length === 1 && errorList[0]) || errorList);
    */
    response._data.error =
      (errorList.length > 1 && helpers.aggregatedError(errorList)) || new Error(errorList[0] || errorList);
    response.error = true;
  } else if (isPending) {
    response.pending = true;
  } else if (isFulfilled) {
    response.fulfilled = true;
  }

  return response;
};
