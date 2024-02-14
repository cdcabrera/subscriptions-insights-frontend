import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ExportIcon } from '@patternfly/react-icons';
import { useMount } from 'react-use';
import { reduxActions, storeHooks } from '../../redux';
import { useProduct, useProductInventoryHostsQuery } from '../productView/productViewContext';
import { Select, SelectPosition, SelectButtonVariant } from '../form/select';
import {
  PLATFORM_API_EXPORT_CONTENT_TYPES as FIELD_TYPES,
  PLATFORM_API_EXPORT_FILENAME_PREFIX as EXPORT_PREFIX,
  PLATFORM_API_EXPORT_STATUS_TYPES
} from '../../services/platform/platformConstants';
import { translate } from '../i18n/i18n';
import { platformTypes } from '../../redux/types';
import { platformServices } from '../../services/platform/platformServices';

/**
 * A standalone export select/dropdown filter.
 *
 * @memberof Toolbar
 * @module ToolbarFieldExport
 */

/**
 * Select field options.
 *
 * @type {Array<{title: React.ReactNode, value: string, selected: boolean}>}
 */
const toolbarFieldOptions = Object.values(FIELD_TYPES).map(type => ({
  title: translate('curiosity-toolbar.label', { context: ['export', type] }),
  value: type,
  selected: false
}));

/**
 * Aggregated export status
 *
 * @param {object} options
 * @param {Function} options.useProduct
 * @param {Function} options.useSelectors
 * @returns {{isPolling: boolean, isProductPolling: boolean, productPollingFormats: Array<string>}}
 */
const useExportStatus = ({
  // useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct,
  useSelectors: useAliasSelectors = storeHooks.reactRedux.useSelectors
} = {}) => {
  // const dispatch = useAliasDispatch();
  const { productId } = useAliasProduct();
  const {
    mount = {},
    status = {},
    poll = {}
  } = useAliasSelectors([
    { id: 'mount', selector: ({ app }) => app?.exports?.mount },
    { id: 'status', selector: ({ app }) => app?.exports?.status },
    { id: 'poll', selector: ({ app }) => app?.exports?.poll }
  ]);

  // return useMemo(() => {
  const isPolling =
    mount.pending === true || status.pending === true || poll?.data?.isAnythingPending === true || undefined;
  const isError = mount.error === true || status.error === true || poll.error === true || undefined;
  const errorMessage =
    (mount.error && mount.message) || (status.error && status.message) || (poll.error && poll.message) || undefined;
  const isCompleted =
    mount?.data?.data?.isAnythingPending === false ||
    status?.data?.data?.isAnythingPending === false ||
    poll?.data?.isAnythingPending === false ||
    undefined;

  const isMountCompleted = mount?.data?.data?.isAnythingPending === false || undefined;

  const productPollingFormats = [];
  let isProductPolling = false;

  if (isPolling) {
    const pollingResults = (poll?.data?.[productId] || [])
      .filter(({ status: productStatus }) => productStatus === PLATFORM_API_EXPORT_STATUS_TYPES.PENDING)
      .map(({ format: productFormat }) => productFormat);

    productPollingFormats.push(...pollingResults);

    if (pollingResults.length) {
      isProductPolling = true;
    }
  }

  return {
    errorMessage,
    isCompleted,
    isError,
    isMountCompleted,
    isPolling,
    isProductPolling,
    productPollingFormats
  };
  // }, [poll?.data, productId, status.pending]);

  // console.log('>>>>>>>>>>>>>>> EXPORT STATUS', response);

  // useEffect(() => {
  /*
   *if (isPolling === true) {
   *  dispatch(
   *    reduxActions.platform.addNotification({
   *      variant: 'info',
   *      title: 'pending',
   *      description: translate('curiosity-optin.notificationsSuccessDescription'),
   *      dismissable: true,
   *      autoDismiss: true
   *    })
   *  );
   *}
   */
  /*
   *
   *if (response.isCompleted === true) {
   *  console.log('>>>>>>>>> EXPORT STATUS', response.isCompleted);
   *  dispatch(
   *    reduxActions.platform.addNotification({
   *      variant: 'success',
   *      title: 'fulfilled',
   *      description: translate('curiosity-optin.notificationsSuccessDescription'),
   *      dismissable: true,
   *      autoDismiss: true
   *    })
   *  );
   *}
   *}, [dispatch, response.isCompleted]);
   */

  // return response;
};

/**
 * Apply a centralized export hook for, post/put, polling status, and download.
 *
 * @param {object} options
 * @param {Function} options.setExport
 * @param {Function} options.getExport
 * @param {Function} options.getStatus
 * @param {Function} options.useDispatch
 * @param {Function} options.useExportStatus
 * @returns {Function}
 */
const useExport = ({
  setExport = platformServices.postExport,
  getExport = platformServices.getExport,
  getStatus = platformServices.getExportStatus,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useExportStatus: useAliasExportStatus = useExportStatus
} = {}) => {
  const { isPolling, isProductPolling, isCompleted, isError, isMountCompleted, errorMessage } = useAliasExportStatus();
  console.log('>>>> USE EXPORT', isPolling, isCompleted, isProductPolling);

  const dispatch = useAliasDispatch();
  const pollInterval = 2000;

  useEffect(() => {
    if (isError === true) {
      console.log('>>>>>>>>> EXPORT STATUS', isCompleted);
      dispatch([
        reduxActions.platform.removeNotification('swatch-export'),
        reduxActions.platform.addNotification({
          id: 'swatch-export',
          variant: 'danger',
          title: 'error',
          description: errorMessage,
          dismissable: true,
          autoDismiss: true
        }),
        {
          type: platformTypes.UPDATE_PLATFORM_EXPORT_POLL,
          data: undefined
        }
      ]);

      return;
    }

    if (isCompleted === true) {
      console.log('>>>>>>>>> EXPORT STATUS', isCompleted);
      dispatch([
        reduxActions.platform.removeNotification('swatch-export'),
        reduxActions.platform.addNotification({
          id: 'swatch-export',
          variant: isMountCompleted === true ? 'info' : 'success',
          title: 'Downloads available',
          description: translate('curiosity-optin.notificationsSuccessDescription'),
          dismissable: true,
          autoDismiss: true
        }),
        {
          type: platformTypes.UPDATE_PLATFORM_EXPORT_POLL,
          data: undefined
        }
      ]);
    }

    /*
     *if (isPolling === true) {
     *  console.log('>>>>>>>>> EXPORT STATUS', isCompleted);
     *  dispatch([
     *    reduxActions.platform.removeNotification('swatch-export'),
     *    reduxActions.platform.addNotification({
     *      id: 'swatch-export',
     *      variant: 'info',
     *      title: 'pending',
     *      description: (isProductPolling && 'This product is polling') || 'A product is polling',
     *      dismissable: true,
     *      autoDismiss: true
     *    }),
     *    {
     *      type: platformTypes.UPDATE_PLATFORM_EXPORT_POLL,
     *      data: undefined
     *    }
     *  ]);
     *}
     */
  }, [dispatch, isCompleted, isError, isMountCompleted, errorMessage]);

  /**
   * A polling response status dispatch
   *
   * @type {Function}
   */
  const statusPoll = useCallback(
    (success = {}, error) => {
      dispatch({
        type: platformTypes.UPDATE_PLATFORM_EXPORT_POLL,
        poll: error || success.data
      });
    },
    [dispatch]
  );

  /**
   * A polling response validator
   *
   * @type {Function}
   */
  const validate = useCallback(response => {
    if (
      typeof response?.data?.data?.isAnythingPending !== 'boolean' ||
      response?.data?.data?.isAnythingPending === true
    ) {
      return false;
    }
    return true;
  }, []);

  return useCallback(
    ({ id, data } = {}) => {
      const updatedOptions = {};

      if (!isPolling) {
        updatedOptions.poll = {
          pollInterval,
          status: statusPoll,
          validate,
          chainPollResponse: false
        };
      }

      // assume post/put with polling
      if (data) {
        return dispatch([
          {
            type: platformTypes.SET_PLATFORM_EXPORT_STATUS,
            payload: setExport(data, {
              ...updatedOptions
            }),
            meta: {
              id: 'status'
            }
          }
        ]);
      }

      // assume download
      if (id) {
        return dispatch([
          {
            type: platformTypes.GET_PLATFORM_EXPORT,
            payload: getExport(id),
            meta: {
              id: 'download',
              notifications: {
                rejected: {
                  variant: 'danger',
                  title: 'error',
                  description: translate('curiosity-optin.notificationsErrorDescription'),
                  dismissable: true,
                  autoDismiss: true
                },
                pending: {
                  variant: 'info',
                  title: 'pending',
                  description: translate('curiosity-optin.notificationsSuccessDescription'),
                  dismissable: true,
                  autoDismiss: true
                },
                fulfilled: {
                  variant: 'success',
                  title: 'fulfilled',
                  description: translate('curiosity-optin.notificationsSuccessDescription'),
                  dismissable: true,
                  autoDismiss: true
                }
              }
            }
          }
        ]);
      }

      // even though options are updated still no reason to dispatch
      if (isPolling) {
        return undefined;
      }

      // assume polling status
      return dispatch([
        {
          type: platformTypes.SET_PLATFORM_EXPORT_STATUS,
          payload: getStatus(undefined, {}, updatedOptions),
          meta: {
            id: 'mount'
          }
        }
      ]);
    },
    [dispatch, getExport, getStatus, isPolling, setExport, statusPoll, validate]
  );
};

/**
 * On select update uom.
 *
 * @param {object} options
 * @param {Function} options.useExport
 * @param {Function} options.useProduct
 * @returns {Function}
 */
const useOnSelect = ({
  useExport: useAliasExport = useExport,
  useProduct: useAliasProduct = useProduct,
  useProductInventoryQuery: useAliasProductInventoryQuery = useProductInventoryHostsQuery
} = {}) => {
  const createExport = useAliasExport();
  const { productId } = useAliasProduct();
  const inventoryQuery = useAliasProductInventoryQuery();

  return useCallback(
    ({ value = null } = {}) => {
      const sources = [];
      sources.push({
        application: 'subscriptions',
        resource: 'instances',
        filters: {
          ...inventoryQuery,
          productId
        }
      });

      sources.push({
        application: 'subscriptions',
        resource: 'subscriptions',
        filters: {
          ...inventoryQuery,
          productId
        }
      });

      const data = { format: value, name: `${EXPORT_PREFIX}-${productId}`, sources };
      createExport({ data });
    },
    [createExport, inventoryQuery, productId]
  );
};

/**
 * Display a unit of measure (uom) field with options.
 *
 * @fires onSelect
 * @param {object} props
 * @param {Array} props.options
 * @param {string} props.position
 * @param {Function} props.t
 * @param {Function} props.useExportStatus
 * @param {Function} props.useOnSelect
 * @returns {React.ReactNode}
 */
const ToolbarFieldExport = ({
  options,
  position,
  t,
  useExportStatus: useAliasExportStatus,
  useOnSelect: useAliasOnSelect
}) => {
  const { isProductPolling, productPollingFormats } = useAliasExportStatus();
  const onSelect = useAliasOnSelect();
  const updatedOptions = options.map(option => ({
    ...option,
    title: (isProductPolling && productPollingFormats.includes(option.value) && 'Loading...') || option.title,
    selected: isProductPolling && productPollingFormats.includes(option.value),
    isDisabled: isProductPolling && productPollingFormats.includes(option.value)
  }));

  const checkExport = useExport();

  useMount(() => {
    checkExport();
  });

  return (
    <Select
      isDropdownButton
      aria-label={t('curiosity-toolbar.placeholder', { context: 'export' })}
      onSelect={onSelect}
      options={updatedOptions}
      placeholder={t('curiosity-toolbar.placeholder', { context: 'export' })}
      position={position}
      data-test="toolbarFieldExport"
      toggleIcon={<ExportIcon />}
      buttonVariant={SelectButtonVariant.plain}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{useOnSelect: Function, t: Function, options: Array, useSelectorsResponse: Function, position: string}}
 */
ToolbarFieldExport.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node,
      value: PropTypes.any,
      selected: PropTypes.bool
    })
  ),
  position: PropTypes.string,
  t: PropTypes.func,
  useExportStatus: PropTypes.func,
  useOnSelect: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useOnSelect: Function, t: translate, options: Array, useSelectorsResponse: Function, position: string}}
 */
ToolbarFieldExport.defaultProps = {
  options: toolbarFieldOptions,
  position: SelectPosition.left,
  t: translate,
  useExportStatus,
  useOnSelect
};

export { ToolbarFieldExport as default, ToolbarFieldExport, toolbarFieldOptions, useOnSelect };
