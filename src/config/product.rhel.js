import React from 'react';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark,
  chart_color_cyan_100 as chartColorCyanLight,
  chart_color_cyan_300 as chartColorCyanDark,
  chart_color_orange_100 as chartColorOrangeLight,
  chart_color_orange_300 as chartColorOrangeDark,
  chart_color_purple_100 as chartColorPurpleLight,
  chart_color_purple_300 as chartColorPurpleDark
} from '@patternfly/react-tokens';
import { Button, Label as PfLabel } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import {
  RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES,
  RHSM_API_PATH_METRIC_TYPES,
  RHSM_API_PATH_PRODUCT_TYPES,
  RHSM_API_QUERY_CATEGORY_TYPES as CATEGORY_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_QUERY_UOM_TYPES,
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INVENTORY_TYPES
} from '../services/rhsm/rhsmConstants';
import { helpers } from '../common';
import { ChartTypeVariant } from '../components/chart/chart';
import { SelectPosition } from '../components/form/select';
import { translate } from '../components/i18n/i18n';
import { annualConfig } from './config.annual';

/**
 * RHEL
 *
 * @memberof Products
 * @module RHEL
 */

/**
 * Product group. A variant and dissimilar product configuration grouping identifier.
 *
 * @type {string}
 */
const productGroup = 'rhel';

/**
 * Product ID. The identifier used when querying the API.
 *
 * @type {string}
 */
const productId = RHSM_API_PATH_PRODUCT_TYPES.RHEL_X86;

/**
 * Product label. An identifier used for display strings.
 *
 * @type {string}
 */
const productLabel = 'RHEL';

/**
 * RHEL product config
 *
 * @type {{productLabel: string, productPath: string, aliases: string[], productId: string, inventorySubscriptionsQuery: object,
 *     query: object, initialSubscriptionsInventoryFilters: Array, initialInventorySettings: object, viewId: string,
 *     initialToolbarFilters: Array, productGroup: string, graphTallyQuery: object, inventoryHostsQuery: object, productDisplay: string,
 *     productVariants: Array, initialGraphFilters: Array, initialGuestsFilters: Array, inventoryGuestsQuery: object,
 *     initialGraphSettings: object, initialInventoryFilters: Array}}
 */
const config = annualConfig({
  aliases: ['insights', 'enterprise', 'linux', 'el', 'x86', 'ibm', 'power'],
  productGroup,
  productId,
  productLabel,
  productVariants: [...Object.values(RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES)],
  query: {
    [RHSM_API_QUERY_SET_TYPES.UOM]: RHSM_API_QUERY_UOM_TYPES.SOCKETS
  },
  initialGraphFilters: [
    {
      filters: [
        {
          metric: RHSM_API_PATH_METRIC_TYPES.SOCKETS,
          fill: chartColorBlueLight.value,
          stroke: chartColorBlueDark.value,
          color: chartColorBlueDark.value,
          query: {
            [RHSM_API_QUERY_SET_TYPES.CATEGORY]: CATEGORY_TYPES.PHYSICAL
          }
        },
        {
          metric: RHSM_API_PATH_METRIC_TYPES.SOCKETS,
          fill: chartColorCyanLight.value,
          stroke: chartColorCyanDark.value,
          color: chartColorCyanDark.value,
          query: {
            [RHSM_API_QUERY_SET_TYPES.CATEGORY]: CATEGORY_TYPES.VIRTUAL
          }
        },
        {
          metric: RHSM_API_PATH_METRIC_TYPES.SOCKETS,
          fill: chartColorPurpleLight.value,
          stroke: chartColorPurpleDark.value,
          color: chartColorPurpleDark.value,
          query: {
            [RHSM_API_QUERY_SET_TYPES.CATEGORY]: CATEGORY_TYPES.CLOUD
          }
        },
        {
          metric: RHSM_API_PATH_METRIC_TYPES.SOCKETS,
          fill: chartColorOrangeLight.value,
          stroke: chartColorOrangeDark.value,
          color: chartColorOrangeDark.value,
          query: {
            [RHSM_API_QUERY_SET_TYPES.CATEGORY]: CATEGORY_TYPES.HYPERVISOR
          }
        },
        {
          metric: RHSM_API_PATH_METRIC_TYPES.SOCKETS,
          chartType: ChartTypeVariant.threshold
        }
      ]
    }
  ],
  initialGraphSettings: {
    isDisabledLegendClick: true,
    actions: [
      {
        id: RHSM_API_QUERY_SET_TYPES.GRANULARITY,
        position: SelectPosition.right
      }
    ]
  },
  initialInventoryFilters: [
    {
      metric: INVENTORY_TYPES.DISPLAY_NAME,
      cell: ({ [INVENTORY_TYPES.DISPLAY_NAME]: displayName, [INVENTORY_TYPES.INSTANCE_ID]: instanceId }, session) => {
        const { inventory: authorized } = session?.authorized || {};

        if (!instanceId) {
          return displayName;
        }

        let updatedDisplayName = displayName || instanceId;

        if (authorized) {
          updatedDisplayName = (
            <Button
              isInline
              component="a"
              variant="link"
              href={`${helpers.UI_DEPLOY_PATH_LINK_PREFIX}/insights/inventory/${instanceId}/`}
            >
              {updatedDisplayName}
            </Button>
          );
        }

        return updatedDisplayName;
      },
      isSort: true
    },
    {
      metric: INVENTORY_TYPES.NUMBER_OF_GUESTS,
      cell: ({ [INVENTORY_TYPES.NUMBER_OF_GUESTS]: numberOfGuests } = {}) => numberOfGuests || '--',
      isSort: true,
      isWrap: true,
      width: 15
    },
    {
      metric: INVENTORY_TYPES.CATEGORY,
      cell: ({ [INVENTORY_TYPES.CLOUD_PROVIDER]: cloudProvider, [INVENTORY_TYPES.CATEGORY]: category } = {}) => (
        <React.Fragment>
          {translate('curiosity-inventory.label', { context: [INVENTORY_TYPES.CATEGORY, category] })}{' '}
          {(cloudProvider && (
            <PfLabel color="purple">
              {translate('curiosity-inventory.label', {
                context: [INVENTORY_TYPES.CLOUD_PROVIDER, cloudProvider]
              })}
            </PfLabel>
          )) ||
            ''}
        </React.Fragment>
      ),
      isSort: true,
      width: 20
    },
    {
      metric: RHSM_API_PATH_METRIC_TYPES.SOCKETS,
      cell: ({ [RHSM_API_PATH_METRIC_TYPES.SOCKETS]: sockets } = {}) => sockets || '--',
      isSort: true,
      isWrap: true,
      width: 15
    },
    {
      metric: INVENTORY_TYPES.LAST_SEEN,
      cell: ({ [INVENTORY_TYPES.LAST_SEEN]: lastSeen } = {}) => (lastSeen && <DateFormat date={lastSeen} />) || '',
      isSort: true,
      isWrap: true,
      width: 15
    }
  ],
  initialToolbarFilters: [
    {
      id: RHSM_API_QUERY_SET_TYPES.SLA
    },
    {
      id: RHSM_API_QUERY_SET_TYPES.USAGE,
      selected: true
    },
    {
      id: RHSM_API_QUERY_SET_TYPES.CATEGORY
    }
  ]
});

export { config as default, config, productGroup, productId };
