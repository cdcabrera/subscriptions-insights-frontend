import { useSelector } from 'react-redux';
import { useRouteDetail } from '../../components/router/routerContext';
import { selector } from '../selectors/appMessagesSelectors';
import { useProduct, useProductGraphTallyQuery } from "../../components/productView/productViewContext";

/**
 * Get app messages selector results.
 *
 * @param {object} options
 * @param {Function} options.useRouteDetail
 * @param {Function} options.useSelector
 * @returns {object}
 */
const useAppMessages = ({
  useRouteDetail: useAliasRouteDetail = useRouteDetail,
  useSelector: useAliasSelector = useSelector
} = {}) => {
  const { pathParameter: productId, productParameter: viewId } = useAliasRouteDetail() || {};
  const result = useAliasSelector(state => selector(state, { productId, viewId }));
  return {
    ...result
  };
};

const useTallyCapacity = ({
  // useRouteDetail: useAliasRouteDetail = useRouteDetail,
  // useSelector: useAliasSelector = useSelector,
  useProduct: useAliasProduct = useProduct,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery = useProductGraphTallyQuery
}) => {
  const { productId, viewId } = useAliasProduct();
  const query = useProductGraphTallyQuery();

  console.log();
  const result = {};
  return {
    ...result
  };
};

const rhsmSelectorsHooks = {
  useAppMessages
};

export { rhsmSelectorsHooks as default, rhsmSelectorsHooks, useAppMessages };
