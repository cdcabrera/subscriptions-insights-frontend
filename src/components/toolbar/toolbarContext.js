import React from 'react';
import { ToolbarItem } from '@patternfly/react-core';
import { useProductQuery, useProductToolbarConfig } from '../productView/productViewContext';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { useOnSelect as useSelectCategoryOnSelect, toolbarFieldOptions } from './toolbarFieldSelectCategory';
import { useOnSelect as useArchitectureOnSelect } from './toolbarFieldArchitecture';
import { useOnSelect as useBillingProviderOnSelect } from './toolbarFieldBillingProvider';
import { useOnSelect as useSlaOnSelect } from './toolbarFieldSla';
import { useOnSelect as useUsageOnSelect } from './toolbarFieldUsage';
import { SelectPosition } from '../form/select';
import { helpers } from '../../common/helpers';

/**
 * Clear a specific toolbar category using a select component's OnSelect hook.
 *
 * @param {object} options
 * @param {Function} options.useArchitectureOnSelect
 * @param {Function} options.useBillingProviderOnSelect
 * @param {Function} options.useSlaOnSelect
 * @param {Function} options.useUsageOnSelect
 * @returns {Function}
 */
const useToolbarFieldClear = ({
  useArchitectureOnSelect: useAliasArchitectureOnSelect = useArchitectureOnSelect,
  useBillingProviderOnSelect: useAliasBillingProviderOnSelect = useBillingProviderOnSelect,
  useSlaOnSelect: useAliasSlaOnSelect = useSlaOnSelect,
  useUsageOnSelect: useAliasUsageOnSelect = useUsageOnSelect
} = {}) => {
  const architectureOnSelect = useAliasArchitectureOnSelect();
  const billingOnSelect = useAliasBillingProviderOnSelect();
  const slaOnSelect = useAliasSlaOnSelect();
  const usageOnSelect = useAliasUsageOnSelect();

  return field => {
    switch (field) {
      case RHSM_API_QUERY_SET_TYPES.ARCHITECTURE:
        architectureOnSelect();
        break;
      case RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER:
        billingOnSelect();
        break;
      case RHSM_API_QUERY_SET_TYPES.SLA:
        slaOnSelect();
        break;
      case RHSM_API_QUERY_SET_TYPES.USAGE:
        usageOnSelect();
        break;
      default:
        break;
    }
  };
};

/**
 * Clear all available toolbar categories.
 *
 * @param {object} options
 * @param {Function} options.useProductQuery
 * @param {Function} options.useArchitectureOnSelect
 * @param {Function} options.useSelectCategoryOnSelect
 * @param {Function} options.useBillingProviderOnSelect
 * @param {Function} options.useSlaOnSelect
 * @param {Function} options.useUsageOnSelect
 * @returns {Function}
 */
const useToolbarFieldClearAll = ({
  useProductQuery: useAliasProductQuery = useProductQuery,
  useArchitectureOnSelect: useAliasArchitectureOnSelect = useArchitectureOnSelect,
  useSelectCategoryOnSelect: useAliasSelectCategoryOnSelect = useSelectCategoryOnSelect,
  useBillingProviderOnSelect: useAliasBillingProviderOnSelect = useBillingProviderOnSelect,
  useSlaOnSelect: useAliasSlaOnSelect = useSlaOnSelect,
  useUsageOnSelect: useAliasUsageOnSelect = useUsageOnSelect
} = {}) => {
  const {
    [RHSM_API_QUERY_SET_TYPES.ARCHITECTURE]: architecture,
    [RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER]: billingProvider,
    [RHSM_API_QUERY_SET_TYPES.SLA]: sla,
    [RHSM_API_QUERY_SET_TYPES.USAGE]: usage
  } = useAliasProductQuery();
  const architectureOnSelect = useAliasArchitectureOnSelect();
  const billingOnSelect = useAliasBillingProviderOnSelect();
  const slaOnSelect = useAliasSlaOnSelect();
  const usageOnSelect = useAliasUsageOnSelect();
  const selectCategoryOnSelect = useAliasSelectCategoryOnSelect();

  return hardFilterReset => {
    if (typeof architecture === 'string') {
      architectureOnSelect();
    }

    if (typeof billingProvider === 'string') {
      billingOnSelect();
    }

    if (typeof sla === 'string') {
      slaOnSelect();
    }

    if (typeof usage === 'string') {
      usageOnSelect();
    }

    if (hardFilterReset) {
      selectCategoryOnSelect();
    }
  };
};

/**
 * Return list of secondary toolbar fields for display.
 *
 * @param {object} options
 * @param {Array} options.categoryOptions
 * @param {Function} options.useProductToolbarConfig
 * @returns {Array}
 */
const useToolbarSecondaryFields = ({
  categoryOptions = toolbarFieldOptions,
  useProductToolbarConfig: useAliasProductToolbarConfig = useProductToolbarConfig
} = {}) => {
  const { secondaryFilters = [] } = useAliasProductToolbarConfig();

  return secondaryFilters.map(({ id, content }) => {
    const option = categoryOptions.find(({ value: categoryOptionValue }) => id === categoryOptionValue);
    const { component: OptionComponent } = option || {};

    return (
      (OptionComponent && (
        <ToolbarItem key={`option-${id}`}>
          <OptionComponent isFilter={false} position={SelectPosition.right} />
        </ToolbarItem>
      )) || <ToolbarItem key={helpers.generateId()}>{content}</ToolbarItem> ||
      null
    );
  });
};

const context = {
  useToolbarFieldClear,
  useToolbarFieldClearAll,
  useToolbarSecondaryFields
};

export { context as default, context, useToolbarFieldClear, useToolbarFieldClearAll, useToolbarSecondaryFields };
