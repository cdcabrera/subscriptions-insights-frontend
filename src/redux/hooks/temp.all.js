// import { useSelectors } from './useReactRedux';
// REJECT ALL IF ONE IS REJECTED... review aggregated errors
import { useSelectorsResponseFactory } from './temp.custom';
// import { helpers } from '../../common';

const useSelectorsAllResponse = (
  selectors,
  { useSelectorsResponseFactory: useAliasSelectorsResponseFactory = useSelectorsResponseFactory } = {}
) => {
  const customResponse = (
    baseResponse,
    {
      cancelledById,
      cancelledList,
      errorList,
      errorById,
      fulfilledList,
      pendingList,
      originalResponseByList,
      originalResponsesById,
      isById
    }
  ) => {
    const response = { ...baseResponse };

    if (errorList.length > 0) {
      response.message = new Error(errorList[0] || errorList);
      response.error = true;
      response.data = (isById && errorById) || errorList;
      return response;
    }

    if (pendingList.length > 0) {
      response.pending = true;
      response.data = (isById && {}) || [];
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

  return useAliasSelectorsResponseFactory(selectors, { customResponse });
};
