import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { rhsmApiTypes } from '../../types';
// import { useRouteDetail } from '../../components/router/routerContext';
import { useRouteDetail } from '../../hooks/useRouter';

/**
 * Selector cache.
 *
 * @private
 * @type {{data: {object}}}
 */
const selectorCache = { data: {} };

/**
 * Return a combined state, props object.
 *
 * @private
 * @param {object} state
 * @param {object} props
 * @returns {object}
 */
const statePropsFilter = (state, props = {}) => ({
  report: state.messages?.report?.[props.productId],
  viewId: props.viewId,
  productId: props.productId
});

/**
 * Return a combined query object.
 *
 * @param {object} state
 * @param {object} props
 * @returns {object}
 */
const queryFilter = (state, props = {}) => ({
  ...props.query,
  ...state.view?.query?.[props.productId],
  ...state.view?.query?.[props.viewId]
});

/**
 * Create selector, transform combined state, props into a consumable object.
 *
 * @type {{appMessages: {cloudigradeMismatch: boolean}}}
 */
const selector = createSelector([statePropsFilter, queryFilter], (data, query = {}) => {
  const { viewId = null, productId = null, report = {} } = data || {};
  const appMessages = {
    cloudigradeMismatch: false
  };

  const cache = (viewId && productId && selectorCache.data[`${viewId}_${productId}`]) || undefined;

  Object.assign(appMessages, { ...cache });

  console.log('WORK SEL 001 >>>>', data);
  console.log('WORK SEL 002 >>>>', report.fulfilled);
  console.log('WORK SEL 003 >>>>', appMessages);

  // Scan Tally response for Cloud Meter flags
  if (report.fulfilled && appMessages.cloudigradeMismatch !== true) {
    const { [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: reportData = [] } = report.data || {};

    const cloudigradeMismatch = reportData
      .reverse()
      .find(
        ({ [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_CLOUDIGRADE_MISMATCH]: mismatch }) =>
          mismatch === true
      );

    console.log('SEL >>>>', cloudigradeMismatch);

    appMessages.cloudigradeMismatch = cloudigradeMismatch !== undefined;

    selectorCache.data[`${viewId}_${productId}`] = {
      ...appMessages
    };
  }

  return { appMessages, query };
});

/**
 * Expose selector instance. For scenarios where a selector is reused across component instances.
 *
 * @param {object} defaultProps
 * @returns {{appMessages: {cloudigradeMismatch: boolean}}}
 */
const makeSelector = defaultProps => (state, props) => ({
  ...selector(state, props, defaultProps)
});

const useMakeSelector = ({
  useRouteDetail: useAliasRouteDetail = useRouteDetail,
  useSelector: useAliasSelector = useSelector
} = {}) => {
  // console.log(useAliasRouteDetail());
  // console.log(useAliasSelector(state => selector(state, {})));
  // const testing = useSelector(state => state);
  // console.log('>>>>>>>>>>>>', testing);
  // return {};

  const { pathParameter: productId, productParameter: viewId } = useAliasRouteDetail() || {};
  const result = useAliasSelector(state => selector(state, { productId, viewId }));
  return {
    ...result
  };
};

const appMessagesSelectors = {
  appMessages: selector,
  makeAppMessages: makeSelector,
  useAppMessages: useMakeSelector
};

export { appMessagesSelectors as default, appMessagesSelectors, selector, makeSelector, useMakeSelector };
