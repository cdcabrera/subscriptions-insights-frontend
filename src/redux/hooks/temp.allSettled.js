import { useSelectors } from './useReactRedux';
// RESOLVE EVERYTHING REGARDLESS OF SUCCESS OR FAILURE
import { useSelectorsResponseFactory } from './temp.custom';

const useSelectorsAllSettledResponse = (
  selectors,
  { useSelectorsResponseFactory: useAliasSelectorsResponseFactory = useSelectorsResponseFactory } = {}
) => {
  const customResponse = (baseResponse, { pendingList, originalResponseByList, originalResponsesById, isById }) => {
    const response = { ...baseResponse };

    if (pendingList.length) {
      response.pending = true;
      response.data = (isById && {}) || [];
      return response;
    }

    response.fulfilled = true;
    response.data = (isById && originalResponsesById) || originalResponseByList;
    return response;
  };

  return useAliasSelectorsResponseFactory(selectors, { customResponse });
};
