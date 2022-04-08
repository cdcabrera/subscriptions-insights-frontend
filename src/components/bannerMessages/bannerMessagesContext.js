import { useShallowCompareEffect } from 'react-use';
import { reduxSelectors, storeHooks } from '../../redux';
import { useRouteDetail } from '../router/routerContext';
import { useProduct, useProductInventoryHostsQuery } from '../productView/productViewContext';
import RHSM_API_RESPONSE_TALLY_META_TYPES, { rhsmConstants } from '../../services/rhsm/rhsmConstants';

/**
 * Get app messages selector results.
 *
 * @param {object} options
 * @param {Function} options.useProduct
 * @param {Function} options.useSelectorsResponse
 * @returns {object}
 */
const useAppMessages = ({
  useProduct: useAliasProduct = useProduct,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const { productId } = useAliasProduct();
  const { fulfilled, data } = useAliasSelectorsResponse({
    id: 'messages',
    selector: ({ messages }) => messages?.report?.[productId]
  });
  let cloudigradeMismatch = false;

  if (fulfilled) {
    const { messages = {} } = data || {};

    cloudigradeMismatch =
      messages?.data
        ?.reverse()
        ?.find(
          ({ [rhsmConstants.RHSM_API_RESPONSE_TALLY_META_TYPES.HAS_CLOUDIGRADE_MISMATCH]: mismatch }) =>
            mismatch === true
        ) !== undefined;
  }

  return {
    cloudigradeMismatch
  };
};
/*
const useAppMessageSelectors = ({
  useRouteDetail: useAliasRouteDetail = useRouteDetail,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const { pathParameter: productId } = useAliasRouteDetail() || {};
  const { error, cancelled, fulfilled, pending, data } = useAliasSelectorsResponse(
    ({ messages }) => messages?.report?.[productId]
  );


};

const useGetMessages = ({
  useRouteDetail: useAliasRouteDetail = useRouteDetail,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector
} = {}) => {
  const { pathParameter: productId, productParameter: viewId } = useAliasRouteDetail() || {};
  // const result = useAliasSelector(state => reduxSelectors.appMessages.appMessages(state, { productId, viewId }));
  // return {
  //  ...result
  // };
  useShallowCompareEffect(() => {

  }, []);


};
*/

const context = {
  useAppMessages
};

export { context as default, context, useAppMessages };
