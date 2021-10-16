import React from 'react';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark,
  chart_color_cyan_100 as chartColorCyanLight,
  chart_color_cyan_300 as chartColorCyanDark,
  chart_color_purple_100 as chartColorPurpleLight,
  chart_color_purple_300 as chartColorPurpleDark
} from '@patternfly/react-tokens';
import {
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_TYPES,
  RHSM_API_PATH_ID_TYPES,
  RHSM_API_PATH_METRIC_ID_TYPES as METRIC_ID_TYPES
} from '../types/rhsmApiTypes';
import { dateHelpers } from '../common';

/**
 * ToDo: evaluate separating products/product tags into individual configs...
 * or using anArray/List then generating "routes.js"
 */

const productGroup = RHSM_API_PATH_ID_TYPES.RHOSAK;

const productId = RHSM_API_PATH_ID_TYPES.RHOSAK;

const productLabel = RHSM_API_PATH_ID_TYPES.RHOSAK;

const config = {
  productGroup,
  productId,
  productLabel,
  viewId: `view${productGroup}`,
  query: {
    [RHSM_API_QUERY_TYPES.START_DATE]: dateHelpers.getRangedMonthDateTime('current').value.startDate.toISOString(),
    [RHSM_API_QUERY_TYPES.END_DATE]: dateHelpers.getRangedMonthDateTime('current').value.endDate.toISOString()
  },
  graphTallyQuery: {
    [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY
  },
  inventoryHostsQuery: {},
  inventorySubscriptionsQuery: {},
  initialGraphFilters: [
    {
      id: METRIC_ID_TYPES.INSTANCE_HOURS,
      fill: chartColorBlueLight.value,
      stroke: chartColorBlueDark.value,
      color: chartColorBlueDark.value,
      isStandalone: true,
      highlightCards: [
        'display a string',
        (data = {}) => `display ${data}`,
        <React.Fragment>element display</React.Fragment>
      ]
    },
    {
      id: METRIC_ID_TYPES.STORAGE_GIBIBYTES,
      fill: chartColorCyanLight.value,
      stroke: chartColorCyanDark.value,
      color: chartColorCyanDark.value,
      isStandalone: true
    },
    {
      id: METRIC_ID_TYPES.TRANSER_GIBIBYTES,
      fill: chartColorPurpleLight.value,
      stroke: chartColorPurpleDark.value,
      color: chartColorPurpleDark.value,
      isStandalone: true
    }
  ],
  initialGraphSettings: {
    isIndividualFilterGraphs: true
  },
  initialToolbarFilters: [
    {
      id: RHSM_API_QUERY_TYPES.RANGED_MONTHLY
    }
  ]
};

export { config as default, config, productGroup, productId };
