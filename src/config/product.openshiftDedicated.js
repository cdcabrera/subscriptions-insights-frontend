import React from 'react';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark,
  chart_color_cyan_100 as chartColorCyanLight,
  chart_color_cyan_300 as chartColorCyanDark
} from '@patternfly/react-tokens';
import { Label as PfLabel } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { SelectPosition } from '../components/form/select';
import { ToolbarFieldRangedMonthly } from '../components/toolbar/toolbarFieldRangedMonthly';
import {
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_PATH_METRIC_TYPES,
  RHSM_API_PATH_PRODUCT_TYPES
} from '../services/rhsm/rhsmConstants';
import { dateHelpers, helpers } from '../common';
import { translate } from '../components/i18n/i18n';

const productGroup = RHSM_API_PATH_PRODUCT_TYPES.OPENSHIFT_DEDICATED_METRICS;

const productId = RHSM_API_PATH_PRODUCT_TYPES.OPENSHIFT_DEDICATED_METRICS;

const productLabel = RHSM_API_PATH_PRODUCT_TYPES.OPENSHIFT_DEDICATED_METRICS;

const config = {
  productGroup,
  productId,
  productLabel,
  viewId: `view${productGroup}`,
  query: {
    [RHSM_API_QUERY_SET_TYPES.START_DATE]: dateHelpers.getRangedMonthDateTime('current').value.startDate.toISOString(),
    [RHSM_API_QUERY_SET_TYPES.END_DATE]: dateHelpers.getRangedMonthDateTime('current').value.endDate.toISOString()
  },
  graphTallyQuery: {
    [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY
  },
  inventoryHostsQuery: {
    [RHSM_API_QUERY_SET_TYPES.SORT]: RHSM_API_QUERY_INVENTORY_SORT_TYPES.LAST_SEEN,
    [RHSM_API_QUERY_SET_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.DESCENDING,
    [RHSM_API_QUERY_SET_TYPES.LIMIT]: 100,
    [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0
  },
  initialGraphFilters: [
    {
      id: RHSM_API_PATH_METRIC_TYPES.CORE_HOURS,
      fill: chartColorBlueLight.value,
      stroke: chartColorBlueDark.value,
      color: chartColorBlueDark.value,
      chartType: 'line',
      isStacked: false,
      yAxisUseDataSet: true
    },
    {
      id: RHSM_API_PATH_METRIC_TYPES.INSTANCE_HOURS,
      fill: chartColorCyanLight.value,
      stroke: chartColorCyanDark.value,
      color: chartColorCyanDark.value,
      chartType: 'line',
      isStacked: false,
      yAxisUseDataSet: true
    }
  ],
  initialGraphSettings: {
    actionDisplay: (responseById = {}) => {
      const { [RHSM_API_PATH_METRIC_TYPES.CORE_HOURS]: coreHours = {} } = responseById.data;
      const { totalCoreHours } = coreHours.meta || {};
      let displayContent;

      if (totalCoreHours) {
        displayContent = translate('curiosity-graph.cardActionTotal', {
          context: 'coreHours',
          total: helpers
            .numberDisplay(totalCoreHours)
            ?.format({ average: true, mantissa: 2, trimMantissa: true, lowPrecision: false })
            ?.toUpperCase()
        });
      }

      return (
        <React.Fragment>
          <div className="curiosity-usage-graph__total">{displayContent || null}</div>
          <ToolbarFieldRangedMonthly position={SelectPosition.right} />
        </React.Fragment>
      );
    }
  },
  initialInventoryFilters: [
    {
      id: 'displayName',
      cell: (data = {}) => {
        const { displayName = {}, inventoryId = {}, numberOfGuests = {} } = data;

        if (!inventoryId.value) {
          return displayName.value;
        }

        const updatedDisplayName = displayName.value || inventoryId.value;

        return (
          <React.Fragment>
            {updatedDisplayName}{' '}
            {(numberOfGuests.value &&
              translate('curiosity-inventory.label', { context: 'numberOfGuests', count: numberOfGuests.value }, [
                <PfLabel color="blue" />
              ])) ||
              ''}
          </React.Fragment>
        );
      },
      isSortable: true
    },
    {
      id: 'coreHours',
      cell: data =>
        (typeof data?.coreHours?.value === 'number' && Number.parseFloat(data?.coreHours?.value).toFixed(2)) || `0.00`,
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    },
    {
      id: 'instanceHours',
      cell: data =>
        (typeof data?.instanceHours?.value === 'number' && Number.parseFloat(data?.instanceHours?.value).toFixed(2)) ||
        `0.00`,
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    },
    {
      id: 'lastSeen',
      cell: data => (data?.lastSeen?.value && <DateFormat date={data?.lastSeen?.value} />) || '',
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    }
  ],
  initialToolbarFilters: undefined
};

export { config as default, config, productGroup, productId };
