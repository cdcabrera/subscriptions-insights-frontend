import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ExportIcon } from '@patternfly/react-icons';
import { reduxActions, storeHooks } from '../../redux';
import { useProduct, useProductInventoryHostsQuery, useProductQuery } from '../productView/productViewContext';
import { Select, SelectPosition, SelectButtonVariant } from '../form/select';
import { PLATFORM_API_EXPORT_CONTENT_TYPES as FIELD_TYPES } from '../../services/platform/platformConstants';
// import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { translate } from '../i18n/i18n';

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
    ({ value = null } = {}) => {
      // we can potentially filter off of the names...

      // apply existing query data...
      const data = { ...inventoryQuery, format: value, name: `swatch-${viewId}-${productId}` };
      return createExport(productId, data)(dispatch);
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
const usePoll = ({
  pollInterval = helpers.EXPORT_POLL_INTERVAL,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector,
  useTimeout: useAliasTimeout = useTimeout
} = {}) => {
  const updatedScans = useAliasSelector(({ scans }) => scans?.view?.data?.[apiTypes.API_RESPONSE_SCANS_RESULTS], []);
  const { update } = useAliasTimeout(() => {
    const filteredScans = updatedScans.filter(
      ({ [apiTypes.API_RESPONSE_SCAN_MOST_RECENT]: mostRecent }) =>
        mostRecent?.status === 'created' || mostRecent?.status === 'pending' || mostRecent?.status === 'running'
    );

    return filteredScans.length > 0;
  }, pollInterval);

  return update;
};

/*
 * get all status
 */
const useGetStatus = ({ getStatus = reduxActions.platform.getExportStatus } = {}) => {
  useEffect(() => {
    getStatus();
  });
  return
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
 * @param {Function} props.useProductQuery
 * @returns {React.ReactNode}
 */
const ToolbarFieldExport = ({
  options,
  position,
  t,
  useGetStatus: useAliasGetStatus,
  useOnSelect: useAliasOnSelect,
  useProductQuery: useAliasProductQuery
}) => {
  // const { [RHSM_API_QUERY_SET_TYPES.UOM]: updatedValue } = useAliasProductQuery();
  useAliasGetStatus();
  const onSelect = useAliasOnSelect();

  // const updatedOptions = options.map(option => ({ ...option, selected: option.value === updatedValue }));

  // useEffect - notifications about current status
  useEffect(() => {

  }, []);

  return (
    <Select
      isDropdownButton
      aria-label={t('curiosity-toolbar.placeholder', { context: 'export' })}
      onSelect={onSelect}
      options={options}
      // selectedOptions={updatedValue}
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
 * @type {{useOnSelect: Function, t: Function, options: Array, useProductQuery: Function,
 *     position: string}}
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
  useGetStatus: PropTypes.func,
  useOnSelect: PropTypes.func,
  useProductQuery: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useOnSelect: Function, t: Function, options: Array, useProductQuery: Function,
 *     position: string}}
 */
ToolbarFieldExport.defaultProps = {
  options: toolbarFieldOptions,
  position: SelectPosition.left,
  t: translate,
  useGetStatus,
  useOnSelect,
  useProductQuery
};

export { ToolbarFieldExport as default, ToolbarFieldExport, toolbarFieldOptions, useOnSelect };
