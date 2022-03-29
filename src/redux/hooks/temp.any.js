import { useSelectorsResponseFactory } from './temp.custom';
// Return 1st available fulfilled response, may be issues with this since the results are returned in an array
// Or if all fail return aggregated error

const useSelectorsAnyResponse = (
  selectors,
  { useSelectorsResponseFactory: useAliasSelectorsResponseFactory = useSelectorsResponseFactory } = {}
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
      response.data = (isById && {}) || {};
      return response;
    }

    if (
      errorList.length === originalResponseByList.length ||
      cancelledList.length + errorList.length === originalResponseByList.length
    ) {
      response.message = new Error(errorList[0]);
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

  return useAliasSelectorsResponseFactory(selectors, { customResponse });
};
