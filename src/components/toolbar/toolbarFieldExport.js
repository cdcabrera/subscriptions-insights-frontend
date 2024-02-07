import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ExportIcon } from '@patternfly/react-icons';
import { useMount, useUnmount } from 'react-use';
import { reduxActions, storeHooks } from '../../redux';
import { useProduct, useProductInventoryHostsQuery, useProductQuery } from '../productView/productViewContext';
import { Select, SelectPosition, SelectButtonVariant, SelectVariant } from '../form/select';
import {
  PLATFORM_API_EXPORT_CONTENT_TYPES as FIELD_TYPES,
  PLATFORM_API_EXPORT_FILENAME_PREFIX as EXPORT_PREFIX
} from '../../services/platform/platformConstants';
// import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
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
 * On select update uom.
 *
 * @param {object} options
 * @param {Function} options.createExport
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @returns {Function}
 */
const useOnSelect = ({
  createExport = reduxActions.platform.createExport,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct,
  useProductInventoryQuery: useAliasProductInventoryQuery = useProductInventoryHostsQuery
} = {}) => {
  const { viewId, productId } = useAliasProduct();
  const dispatch = useAliasDispatch();
  const inventoryQuery = useAliasProductInventoryQuery();

  return useCallback(
    ({ value = null, ...rest } = {}, a, b, c) => {
      console.log('>>>>>>>>>>> REST', rest);
      console.log('>>>>>>>>>>> REST', a, b, c);

      if (!value) {
        console.log('>>>>> NO VALUE SELECT', value, rest);
        dispatch(
          reduxActions.platform.addNotification({
            variant: 'success',
            title: 'pending',
            description: translate('curiosity-optin.notificationsSuccessDescription'),
            dismissable: true,
            autoDismiss: true
          })
        );
        return;
      }

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
      const data = { format: value, name: `${EXPORT_PREFIX}-${viewId}-${productId}`, sources };
      // return createExport(productId, data)(dispatch);
      dispatch([
        {
          type: platformTypes.GET_PLATFORM_EXPORT_STATUS,
          payload: platformServices.postExport(data),
          meta: {
            id: productId,
            data,
            notifications: {
              rejected: {
                variant: 'danger',
                title: 'error',
                description: translate('curiosity-optin.notificationsErrorDescription'),
                dismissable: true,
                autoDismiss: true
              },
              pending: {
                variant: 'success',
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
    [createExport, dispatch, inventoryQuery, productId, viewId]
  );
};

/**
 * Poll data for pending results.
 *
 * @param {object} options
 * @param {number} options.pollInterval
 * @param {Function} options.useSelector
 * @param {Function} options.useTimeout
 * @returns {Function}
 */
/**
 *const usePoll = ({
 *pollInterval = helpers.EXPORT_POLL_INTERVAL,
 *useSelector: useAliasSelector = storeHooks.reactRedux.useSelector,
 *useTimeout: useAliasTimeout = useTimeout
 *} = {}) => {
 *const updatedScans = useAliasSelector(({ scans }) => scans?.view?.data?.[apiTypes.API_RESPONSE_SCANS_RESULTS], []);
 *const { update } = useAliasTimeout(() => {
 *  const filteredScans = updatedScans.filter(
 *    ({ [apiTypes.API_RESPONSE_SCAN_MOST_RECENT]: mostRecent }) =>
 *      mostRecent?.status === 'created' || mostRecent?.status === 'pending' || mostRecent?.status === 'running'
 *  );
 *
 *  return filteredScans.length > 0;
 *}, pollInterval);
 *
 *return update;
 *};
 */

/*
 * get all status
 */
/**
 *const useGetStatus = ({ getStatus = reduxActions.platform.getExportStatus } = {}) => {
 *useMount(() => {
 *  getStatus();
 *});
 *};
 */

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
 * @param {Function} props.useSelectorsResponse
 * @returns {React.ReactNode}
 */
const ToolbarFieldExport = ({
  options,
  position,
  t,
  useOnSelect: useAliasOnSelect,
  useProduct: useAliasProduct,
  useSelectorsResponse: useAliasSelectorsResponse
}) => {
  const { productId } = useAliasProduct();
  const { pending, responses } = useAliasSelectorsResponse([
    { id: 'export', selector: ({ app }) => app?.exports?.[productId] }
  ]);
  const updatedValue = responses?.id?.export?.meta?.data?.format;
  // const { [RHSM_API_QUERY_SET_TYPES.UOM]: updatedValue } = useAliasProductQuery();
  const onSelect = useAliasOnSelect();
  const updatedOptions = options.map(option => ({
    ...option,
    title: (pending && option.value === updatedValue && 'Loading...') || option.title,
    selected: pending && option.value === updatedValue,
    // isLoading: option.value === updatedValue,
    isDisabledAllowEvent: pending && option.value === updatedValue
  }));

  console.log('>>>>>>>>>>>>> EXPORT FIELD', updatedOptions);

  return (
    <Select
      isDropdownButton
      aria-label={t('curiosity-toolbar.placeholder', { context: 'export' })}
      onSelect={onSelect}
      options={updatedOptions}
      // selectedOptions={updatedValue}
      placeholder={t('curiosity-toolbar.placeholder', { context: 'export' })}
      position={position}
      data-test="toolbarFieldExport"
      toggleIcon={<ExportIcon />}
      // variant={SelectVariant.checkbox}
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
  useOnSelect: PropTypes.func,
  useProduct: PropTypes.func,
  useSelectorsResponse: PropTypes.func
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
  useOnSelect,
  useProduct,
  useSelectorsResponse: storeHooks.reactRedux.useSelectorsResponse
};

export { ToolbarFieldExport as default, ToolbarFieldExport, toolbarFieldOptions, useOnSelect };
