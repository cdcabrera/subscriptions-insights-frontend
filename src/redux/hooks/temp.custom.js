import { useSelectors } from './useReactRedux';

const useSelectorsResponseFactory = (
  selectors,
  { useSelectors: useAliasSelectors = useSelectors, customResponse } = {}
) => {
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

    // if ((fulfilled && !firstResponse) || (error && !firstResponse)) {
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

  const response = {
    responses: {
      errorId: errorById,
      errorList,
      id: originalResponsesById,
      list: originalResponseByList
    },
    cancelled: undefined,
    data: undefined,
    error: undefined,
    fulfilled: undefined,
    message: undefined,
    pending: undefined,
    status: undefined
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
          isById: idList.length === updatedSelectorResponse.length,
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

  return response;
};

export { useSelectorsResponseFactory as default, useSelectorsResponseFactory };
