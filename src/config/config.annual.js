import React from 'react';
import { Button } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import moment from 'moment';
import {
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_TYPES as INVENTORY_SORT_TYPES,
  RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES as SUBSCRIPTIONS_SORT_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INVENTORY_TYPES,
  RHSM_API_RESPONSE_INSTANCES_META_TYPES as INVENTORY_META_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES as SUBSCRIPTIONS_INVENTORY_TYPES,
  RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES as DISPLAY_TYPES
} from '../services/rhsm/rhsmConstants';
import { dateHelpers, helpers } from '../common';
import { Tooltip } from '../components/tooltip/tooltip';
import { ChartIcon } from '../components/chart/chartIcon';
import { translate } from '../components/i18n/i18n';

/**
 * Annual configuration
 *
 * @memberof Products
 * @module AnnualConfig
 */

/**
 * Annual configuration
 *
 * @param {object} options
 * @param {Array} options.aliases
 * @param {string} options.productGroup
 * @param {string} options.productId
 * @param {string} options.productLabel
 * @param {Array} options.productVariants
 * @param {string} options.productDisplay
 * @param {boolean} options.productContextFilterUom
 * @param {object} options.query
 * @param {string} options.initialOption
 * @param {Array} options.initialGraphFilters
 * @param {object} options.initialGraphSettings
 * @param {Array} options.initialInventoryFilters
 * @param {Array} options.initialToolbarFilters
 * @returns {{productLabel: string, productPath: string, initialOption: string, aliases: string[], productId: string,
 *     inventorySubscriptionsQuery: object, query: object, initialSubscriptionsInventoryFilters: Array,
 *     initialInventorySettings: object, viewId: string, initialToolbarFilters: Array, productGroup: string,
 *     graphTallyQuery: object, inventoryHostsQuery: object, productDisplay: string, productContextFilterUom: boolean,
 *     initialGraphFilters: Array, initialGuestsFilters: Array, inventoryGuestsQuery: object, initialGraphSettings: object,
 *     initialInventoryFilters: Array}}
 */
const annualConfig = ({
  aliases = [],
  productGroup,
  productId,
  productLabel,
  productVariants = [],
  productDisplay = DISPLAY_TYPES.CAPACITY,
  productContextFilterUom = false,
  query,
  initialOption,
  initialGraphFilters,
  initialGraphSettings,
  initialInventoryFilters,
  initialToolbarFilters
} = {}) => ({
  aliases,
  productGroup,
  productId,
  productLabel,
  productPath: productGroup.toLowerCase(),
  productDisplay,
  viewId: `view${productGroup}`,
  productVariants,
  productContextFilterUom,
  query: {
    ...query,
    [RHSM_API_QUERY_SET_TYPES.START_DATE]: dateHelpers
      .getRangedDateTime(GRANULARITY_TYPES.DAILY)
      .startDate.toISOString(),
    [RHSM_API_QUERY_SET_TYPES.END_DATE]: dateHelpers.getRangedDateTime(GRANULARITY_TYPES.DAILY).endDate.toISOString()
  },
  graphTallyQuery: {
    [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY
  },
  inventoryGuestsQuery: {
    [RHSM_API_QUERY_SET_TYPES.LIMIT]: 100,
    [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0
  },
  inventoryHostsQuery: {
    [RHSM_API_QUERY_SET_TYPES.SORT]: INVENTORY_SORT_TYPES.LAST_SEEN,
    [RHSM_API_QUERY_SET_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.DESCENDING,
    [RHSM_API_QUERY_SET_TYPES.LIMIT]: 100,
    [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0
  },
  inventorySubscriptionsQuery: {
    [RHSM_API_QUERY_SET_TYPES.SORT]: SUBSCRIPTIONS_SORT_TYPES.NEXT_EVENT_DATE,
    [RHSM_API_QUERY_SET_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.DESCENDING,
    [RHSM_API_QUERY_SET_TYPES.LIMIT]: 100,
    [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0
  },
  initialOption,
  initialGraphFilters,
  initialGraphSettings,
  initialGuestsFilters: [
    {
      metric: INVENTORY_TYPES.DISPLAY_NAME,
      header: () => translate('curiosity-inventory.guestsHeader', { context: [INVENTORY_TYPES.DISPLAY_NAME] }),
      cell: (
        { [INVENTORY_TYPES.DISPLAY_NAME]: displayName, [INVENTORY_TYPES.INVENTORY_ID]: inventoryId } = {},
        session
      ) => {
        const { inventory: authorized } = session?.authorized || {};

        if (!inventoryId) {
          return displayName;
        }

        let updatedDisplayName = displayName || inventoryId;

        if (authorized) {
          updatedDisplayName = (
            <Button
              isInline
              component="a"
              variant="link"
              href={`${helpers.UI_DEPLOY_PATH_LINK_PREFIX}/insights/inventory/${inventoryId}/`}
            >
              {updatedDisplayName}
            </Button>
          );
        }

        return updatedDisplayName;
      }
    },
    {
      metric: INVENTORY_TYPES.INVENTORY_ID,
      width: 40
    },
    {
      metric: INVENTORY_TYPES.LAST_SEEN,
      cell: ({ [INVENTORY_TYPES.LAST_SEEN]: lastSeen } = {}) => (lastSeen && <DateFormat date={lastSeen} />) || '',
      width: 15
    }
  ],
  initialInventoryFilters,
  initialInventorySettings: {
    actions: [
      {
        id: RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME
      }
    ],
    guestContent: ({
      [INVENTORY_TYPES.NUMBER_OF_GUESTS]: numberOfGuests = {},
      [INVENTORY_TYPES.INSTANCE_ID]: id
    } = {}) => (numberOfGuests > 0 && id && { id, numberOfGuests }) || undefined
  },
  initialSubscriptionsInventoryFilters: [
    {
      metric: SUBSCRIPTIONS_INVENTORY_TYPES.PRODUCT_NAME,
      isSort: true,
      isWrap: true
    },
    {
      metric: SUBSCRIPTIONS_INVENTORY_TYPES.SERVICE_LEVEL,
      isSort: true,
      isWrap: true,
      width: 15
    },
    {
      metric: SUBSCRIPTIONS_INVENTORY_TYPES.QUANTITY,
      isSort: true,
      isWrap: true,
      width: 20
    },
    {
      metric: SUBSCRIPTIONS_INVENTORY_TYPES.TOTAL_CAPACITY,
      header: (data, session, { [INVENTORY_META_TYPES.UOM]: uom } = {}) =>
        translate('curiosity-inventory.header', { context: ['subscriptions', uom] }),
      cell: ({
        [SUBSCRIPTIONS_INVENTORY_TYPES.HAS_INFINITE_QUANTITY]: hasInfiniteQuantity,
        [SUBSCRIPTIONS_INVENTORY_TYPES.TOTAL_CAPACITY]: totalCapacity,
        [SUBSCRIPTIONS_INVENTORY_TYPES.UOM]: uom
      } = {}) => {
        if (hasInfiniteQuantity === true) {
          const content = translate(`curiosity-inventory.label`, {
            context: [SUBSCRIPTIONS_INVENTORY_TYPES.HAS_INFINITE_QUANTITY, uom]
          });
          return (
            <Tooltip content={content}>
              <ChartIcon symbol="infinity" size="md" aria-label={content} />
            </Tooltip>
          );
        }
        return totalCapacity;
      },
      isSort: true,
      isWrap: true,
      width: 15
    },
    {
      metric: SUBSCRIPTIONS_INVENTORY_TYPES.NEXT_EVENT_DATE,
      cell: ({ [SUBSCRIPTIONS_INVENTORY_TYPES.NEXT_EVENT_DATE]: nextEventDate } = {}) =>
        (nextEventDate && moment.utc(nextEventDate).format('YYYY-MM-DD')) || '',
      isSort: true,
      isWrap: true,
      width: 15
    }
  ],
  initialToolbarFilters
});

export { annualConfig as default, annualConfig };
