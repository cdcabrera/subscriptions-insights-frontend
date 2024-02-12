import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ExportIcon } from '@patternfly/react-icons';
import { useMount } from 'react-use';
import { reduxActions, storeHooks, reduxHelpers } from '../../redux';
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
import { helpers } from '../../common/helpers';

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
 * Apply a centralized export hook for, post/put, polling status, and download.
 *
 * @param {object} options
 * @param {Function} options.setExport
 * @param {Function} options.getExport
 * @param {Function} options.getStatus
 * @param {Function} options.useDispatch
 * @param {Function} options.useSelector
 * @returns {Function}
 */
const useExport = ({
  setExport = platformServices.postExport,
  getExport = platformServices.getExport,
  getStatus = platformServices.getExportStatus,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector
} = {}) => {
  // const { pending: isPolling = false } = useAliasSelector(({ app }) => app?.exports?.poll?.pending, false);
  const isPolling = useAliasSelector(({ app }) => app?.exports?.poll?.pending, false);
  const dispatch = useAliasDispatch();
  const pollInterval = 2000;

  /**
   * Dispatch the poll response status
   *
   * @type {Function}
   */
  const statusPoll = useCallback(
    response => {
      console.log('>>>>> STATUS OF', helpers.isPromise(response), response);
      dispatch({
        type: platformTypes.UPDATE_PLATFORM_EXPORT_POLL,
        // payload: response,
        data: response.data
        /*
         * data: {
         *  data: response.data.data,
         *  meta: response.data.meta
         * },
         */
        /*
         * meta: {
         *  id: 'poll'
         * }
         */
      });
    },
    [dispatch]
  );

  const statusPollWORKINGWITHPROMISECALLBACK = useCallback(
    response => {
      console.log('>>>>> STATUS OF', helpers.isPromise(response), response);
      dispatch({
        type: platformTypes.SET_PLATFORM_EXPORT_STATUS,
        payload: response,
        /*
         * data: {
         *  data: response.data.data,
         *  meta: response.data.meta
         * },
         */
        meta: {
          id: 'poll'
        }
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
    /*
     * if (
     *  !Array.isArray(response?.data?.data?.status) ||
     *  response?.data?.data?.status?.find(dataStatus => dataStatus === PLATFORM_API_EXPORT_STATUS_TYPES.PENDING)
     * ) {
     *  return false;
     * }
     */
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
              /// poll: { pollInterval, status: statusPoll, validate, chainPollResponse: false }
            }),
            meta: {
              id: 'status',
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
            id: 'poll',
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
    },
    [dispatch, getExport, getStatus, isPolling, setExport, statusPoll, validate]
  );
};

const useExportStatus = ({
  useProduct: useAliasProduct = useProduct,
  useSelectors: useAliasSelectors = storeHooks.reactRedux.useSelectors
} = {}) => {
  const { productId } = useAliasProduct();
  const { poll = {}, status = {} } = useAliasSelectors([
    { id: 'status', selector: ({ app }) => app?.exports?.status },
    { id: 'poll', selector: ({ app }) => app?.exports?.poll }
  ]);

  console.log('>>>>>>>> STATUS', status);
  console.log('>>>>>>>> POLL', poll);

  const isPolling = status.pending === true || false;

  // const isProductPolling = (isPolling)

  /*
  const isProductPolling =
    (isPolling &&
      Array.isArray(poll?.meta?.pending) &&
      poll.meta.pending.findIndex(value => value === productId) > -1) ||
    false;

  const pollingFormats = [];
  if (isPolling && Array.isArray(poll?.meta?.pollingFormats)) {
    pollingFormats.push(...poll.meta.pollingFormats);
  }
  */

  return {
    isPolling,
    isProductPolling: undefined,
    pollingFormats: undefined
  };
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

/*
 * get all status
 */
const useGetAllExportStatus = ({
  useProduct: useAliasProduct = useProduct,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  getStatus = reduxActions.platform.getExportStatus,
  useSelectors: useAliasSelectors = storeHooks.reactRedux.useSelectors
} = {}) => {
  const { productId } = useAliasProduct();
  const { poll = {}, status = {} } = useAliasSelectors([
    { id: 'status', selector: ({ app }) => app?.exports?.status },
    { id: 'poll', selector: ({ app }) => app?.exports?.poll }
  ]);
  const dispatch = useAliasDispatch();

  useMount(() => {
    dispatch([
      {
        type: platformTypes.GET_PLATFORM_EXPORT_STATUS,
        payload: platformServices.getExportStatus(
          undefined,
          {},
          {
            poll: {
              status: response => {
                console.log('>>>> MOUNT status', response);
                /*
                 *dispatch({
                 *  type: platformTypes.GET_PLATFORM_EXPORT_STATUS,
                 *  payload: platformServices.getExportStatus(undefined, {}, { cancelId: 'exportStatus' }),
                 *  meta: {
                 *    id: 'status'
                 *  }
                 *});
                 */
              },
              chainPollResponse: false,
              pollInterval: 2000,
              validate: response => {
                if (
                  !Array.isArray(response?.data?.data) ||
                  response?.data?.data?.find(
                    ({ status: dataStatus }) =>
                      dataStatus === PLATFORM_API_EXPORT_STATUS_TYPES.PENDING ||
                      dataStatus === PLATFORM_API_EXPORT_STATUS_TYPES.PARTIAL ||
                      dataStatus === PLATFORM_API_EXPORT_STATUS_TYPES.RUNNING
                  )
                ) {
                  return false;
                }
                return true;
              }
            }
          }
        ),
        meta: {
          id: 'poll'
        }
      }
    ]);
  });

  const isPolling = (poll.pending && poll.pending === true) || false;
  const isProductPolling =
    (isPolling &&
      Array.isArray(status?.data?.meta?.pending) &&
      status.data.meta.pending.findIndex(value => value === productId) > -1) ||
    false;

  const productFormatsPolling = [];

  const isProductJsonPolling =
    (isProductPolling &&
      Array.isArray(status?.data?.meta?.json) &&
      status.data.meta.json.findIndex(value => value === productId) > -1) ||
    false;

  if (isProductJsonPolling) {
    productFormatsPolling.push(FIELD_TYPES.JSON);
  }

  const isProductCsvPolling =
    (isProductPolling &&
      Array.isArray(status?.data?.meta?.csv) &&
      status.data.meta.csv.findIndex(value => value === productId) > -1) ||
    false;

  if (isProductCsvPolling) {
    productFormatsPolling.push(FIELD_TYPES.CSV);
  }

  const productsPolling = useMemo(
    () => (isPolling && status?.data?.meta?.pending) || [],
    [isPolling, status?.data?.meta?.pending]
  );
  const productsCompleted = useMemo(
    () => (!isPolling && status?.data?.meta?.completed) || [],
    [isPolling, status?.data?.meta?.completed]
  );

  useEffect(() => {
    if (productsCompleted.length) {
      dispatch(
        reduxActions.platform.addNotification({
          variant: 'info',
          title: 'Downloads are available',
          description: `${productsCompleted.length} data exports have completed`,
          dismissable: true,
          autoDismiss: false
        })
      );
    }
  }, [dispatch, productsCompleted]);

  return {
    isPolling,
    isProductPolling,
    productFormatsPolling,
    productsPolling
  };
};

/**
 * Display a unit of measure (uom) field with options.
 *
 * @fires onSelect
 * @param {object} props
 * @param {Array} props.options
 * @param {string} props.position
 * @param {Function} props.t
 * @param {Function} props.useOnSelect
 * @param props.useProduct
 * @param props.useExportStatus
 * @param {Function} props.useSelectorsResponse
 * @returns {React.ReactNode}
 */
const ToolbarFieldExport = ({
  options,
  position,
  t,
  useExportStatus: useAliasExportStatus,
  useOnSelect: useAliasOnSelect,
  useProduct: useAliasProduct
  /*
   * useSelectors: useAliasSelectors
   * useSelectorsResponse: useAliasSelectorsResponse
   */
}) => {
  const output = useAliasExportStatus();

  // const { isProductPolling: pending = false, productFormatsPolling = [] } = useGetAllExportStatus();
  const pending = false;
  const productFormatsPolling = [];
  console.log('>>>>>>>>>>>>> EXPORT FIELD OUT', output);

  const onSelect = useAliasOnSelect();
  const updatedOptions = options.map(option => ({
    ...option,
    title: (pending && productFormatsPolling.includes(option.value) && 'Loading...') || option.title,
    selected: pending && productFormatsPolling.includes(option.value),
    isDisabled: pending && productFormatsPolling.includes(option.value)
  }));

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
  useOnSelect: PropTypes.func,
  useProduct: PropTypes.func
  // useSelectorsResponse: PropTypes.func
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
  useOnSelect,
  useProduct
  // useSelectorsResponse: storeHooks.reactRedux.useSelectorsResponse
};

export { ToolbarFieldExport as default, ToolbarFieldExport, toolbarFieldOptions, useOnSelect };
