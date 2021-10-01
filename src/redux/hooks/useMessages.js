import { useSelector } from '..';
import { useRouteDetail } from '../../hooks/useRouter';
import {rhsmApiTypes} from "../../types/rhsmApiTypes";
import selectorCache from "../selectors/appMessagesSelectors";

const useMessages = ({
  useRouteDetail: useAliasRouteDetail = useRouteDetail,
  useSelector: useAliasSelector = useSelector
} = {}) => {
  const { pathParameter: productId, productConfig } = useAliasRouteDetail();

  /*
  const { viewId = null, productId = null, report = {} } = data || {};
  const appMessages = {
    cloudigradeMismatch: false
  };

  const cache = (viewId && productId && selectorCache.data[`${viewId}_${productId}`]) || undefined;

  Object.assign(appMessages, { ...cache });

  console.log('WORK SEL >>>>', data, report.fulfilled, appMessages);

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
  */
};

const messagesHooks = {
  useMessages
};

export { messagesHooks as default, messagesHooks, useMessages };
