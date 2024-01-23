import React from 'react';
import PropTypes from 'prop-types';
import { useProduct, useProductGraphConfig, useProductToolbarQuery } from '../productView/productViewContext';
import { reduxTypes, storeHooks } from '../../redux';
import {
  RHSM_API_QUERY_SET_TYPES as RHSM_API_QUERY_TYPES,
  RHSM_API_QUERY_SET_TYPES
} from '../../services/rhsm/rhsmConstants';
import { Select, SelectPosition } from '../form/select';
import { graphCardHelpers } from '../graphCard/graphCardHelpers';
import { translate } from '../i18n/i18n';

/**
 * A standalone Category select filter.
 *
 * @memberof Toolbar
 * @module ToolbarFieldCategory
 */

/**
 * Generate select field options from nested product graph configuration.
 *
 * @param {object} options
 * @param {Function} options.useProductGraphConfig
 * @returns {Function}
 */
const useToolbarFieldOptions = ({ useProductGraphConfig: useAliasProductGraphConfig = useProductGraphConfig } = {}) => {
  const { filters } = useAliasProductGraphConfig();
  const options = [];

  if (Array.isArray(filters)) {
    const updatedFilters = [];
    const update = ({ metric, query }) => {
      const category = query?.[RHSM_API_QUERY_SET_TYPES.CATEGORY];
      const isDuplicate = updatedFilters.find(({ value }) => value === category);

      if (category !== undefined && !isDuplicate) {
        updatedFilters.push({
          title: translate('curiosity-toolbar.label', {
            context: ['category', (category === '' && 'none') || category]
          }),
          value: category,
          metaData: {
            metric,
            query
          },
          selected: false
        });
      }
    };

    filters?.forEach(({ filters: groupedFilters, ...restFilters }) => {
      if (Array.isArray(groupedFilters)) {
        groupedFilters.forEach(group => update(group));
      } else {
        update(restFilters);
      }
    });

    if (updatedFilters?.length) {
      options.push(...updatedFilters);
    }
  }

  return options;
};

/**
 * On select update.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @returns {Function}
 */
const useOnSelect = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDynamicDispatch,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { productId, viewId } = useAliasProduct();
  const dispatch = useAliasDispatch();

  return ({ value = null, selected = {} } = {}) => {
    let updatedGraphLegendValue = value;

    if (selected?.metaData?.metric) {
      updatedGraphLegendValue = graphCardHelpers.generateChartIds({
        metric: selected.metaData.metric,
        productId,
        query: { [RHSM_API_QUERY_SET_TYPES.CATEGORY]: value }
      });
    }

    dispatch([
      {
        dynamicType: `${reduxTypes.graph.SET_GRAPH_LEGEND}-${viewId}-inverted`,
        id: `${viewId}-inverted`,
        value: updatedGraphLegendValue
      },
      {
        dynamicType: `${reduxTypes.query.SET_QUERY_INVENTORY_INSTANCES}-${viewId}`,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0,
        [RHSM_API_QUERY_TYPES.DIRECTION]: undefined,
        [RHSM_API_QUERY_TYPES.SORT]: undefined
      },
      {
        dynamicType: `${reduxTypes.query.SET_QUERY_INVENTORY_SUBSCRIPTIONS}-${viewId}`,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0,
        [RHSM_API_QUERY_TYPES.DIRECTION]: undefined,
        [RHSM_API_QUERY_TYPES.SORT]: undefined
      },
      {
        dynamicType: `${reduxTypes.query.SET_QUERY}-${viewId}`,
        [RHSM_API_QUERY_SET_TYPES.CATEGORY]: value
      }
    ]);
  };
};

/**
 * Display a category field with generated options.
 *
 * @fires onSelect
 * @param {object} props
 * @param {boolean} props.isFilter
 * @param {string} props.position
 * @param {Function} props.t
 * @param {Function} props.useOnSelect
 * @param {Function} props.useProductToolbarQuery
 * @param {Function} props.useToolbarFieldOptions
 * @returns {React.ReactNode}
 */
const ToolbarFieldCategory = ({
  isFilter,
  position,
  t,
  useOnSelect: useAliasOnSelect,
  useProductToolbarQuery: useAliasProductToolbarQuery,
  useToolbarFieldOptions: useAliasToolbarFieldOptions
}) => {
  const { [RHSM_API_QUERY_SET_TYPES.CATEGORY]: updatedValue } = useAliasProductToolbarQuery();
  const onSelect = useAliasOnSelect();
  const options = useAliasToolbarFieldOptions();
  const updatedOptions = options.map(option => ({ ...option, selected: option.value === updatedValue }));

  return (
    <Select
      aria-label={t('curiosity-toolbar.placeholder', { context: [isFilter && 'filter', 'category'] })}
      onSelect={onSelect}
      options={updatedOptions}
      selectedOptions={updatedValue}
      placeholder={t('curiosity-toolbar.placeholder', { context: [isFilter && 'filter', 'category'] })}
      position={position}
      // variant={SelectVariant.checkbox}
      data-test="toolbarFieldCategory"
    />
  );
};

/**
 * Prop types.
 *
 * @type {{useOnSelect: Function, t: Function, useProductToolbarQuery: Function, isFilter: boolean,
 *     position: string, useToolbarFieldOptions: Function}}
 */
ToolbarFieldCategory.propTypes = {
  isFilter: PropTypes.bool,
  position: PropTypes.string,
  t: PropTypes.func,
  useOnSelect: PropTypes.func,
  useProductToolbarQuery: PropTypes.func,
  useToolbarFieldOptions: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useOnSelect: Function, t: translate, useProductToolbarQuery: Function, isFilter: boolean,
 *     position: string, useToolbarFieldOptions: Function}}
 */
ToolbarFieldCategory.defaultProps = {
  isFilter: false,
  position: SelectPosition.left,
  t: translate,
  useOnSelect,
  useProductToolbarQuery,
  useToolbarFieldOptions
};

export { ToolbarFieldCategory as default, ToolbarFieldCategory, useOnSelect, useToolbarFieldOptions };
