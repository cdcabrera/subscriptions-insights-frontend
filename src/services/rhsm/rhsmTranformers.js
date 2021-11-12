import {
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INSTANCES_DATA_TYPES,
  RHSM_API_RESPONSE_INSTANCES_META_TYPES as INSTANCES_META_TYPES,
  RHSM_API_RESPONSE_TALLY_DATA_TYPES as TALLY_DATA_TYPES,
  RHSM_API_RESPONSE_TALLY_META_TYPES as TALLY_META_TYPES,
  rhsmConstants
} from './rhsmConstants';
import { dateHelpers } from '../../common';

/**
 * Parse RHSM instances response for caching.
 *
 * @param {object} response
 * @returns {object}
 */
const rhsmInstances = response => {
  const updatedResponse = {};
  const { [rhsmConstants.RHSM_API_RESPONSE_DATA]: data = [], [rhsmConstants.RHSM_API_RESPONSE_META]: meta = {} } =
    response || {};

  updatedResponse.data = data.map(
    ({
      [INSTANCES_DATA_TYPES.DISPLAY_NAME]: displayName,
      [INSTANCES_DATA_TYPES.INVENTORY_ID]: inventoryId,
      [INSTANCES_DATA_TYPES.LAST_SEEN]: lastSeen,
      [INSTANCES_DATA_TYPES.MEASUREMENTS]: measurements,
      [INSTANCES_DATA_TYPES.SUBSCRIPTION_MANAGER_ID]: subscriptionManagerId
    }) => ({
      displayName,
      inventoryId,
      lastSeen,
      measurements,
      subscriptionManagerId
    })
  );

  updatedResponse.meta = {
    count: meta[INSTANCES_META_TYPES.COUNT],
    measurements: meta[INSTANCES_META_TYPES.MEASUREMENTS],
    productId: meta[INSTANCES_META_TYPES.PRODUCT]
  };

  return updatedResponse;
};

/**
 * Parse RHSM tally response for caching.
 *
 * @param {object} response
 * @returns {object}
 */
const rhsmTally = response => {
  const updatedResponse = {};
  const { [rhsmConstants.RHSM_API_RESPONSE_DATA]: data = [], [rhsmConstants.RHSM_API_RESPONSE_META]: meta = {} } =
    response || {};
  /**
   * FixMe: this is a potential bug
   * Under RHOSAK this can't be seen because we're using a monthly range. However, under something like RHEL
   * where a "quarterly range" that spans a year+ days of the month repeat. We need to match the full date
   * instead of just the day.
   */
  const currentDay = dateHelpers.getCurrentDate()?.getDate();

  updatedResponse.data = data.map(
    (
      { [TALLY_DATA_TYPES.DATE]: date, [TALLY_DATA_TYPES.VALUE]: value, [TALLY_DATA_TYPES.HAS_DATA]: hasData },
      index
    ) => ({
      x: index,
      y: value,
      date,
      hasData,
      isCurrentDate: date?.getDate() === currentDay
    })
  );

  updatedResponse.meta = {
    count: meta[TALLY_META_TYPES.COUNT],
    metricId: meta[TALLY_META_TYPES.METRIC_ID],
    productId: meta[TALLY_META_TYPES.PRODUCT],
    totalMonthlyDate: meta[TALLY_META_TYPES.TOTAL_MONTHLY]?.[TALLY_META_TYPES.DATE],
    totalMonthlyHasData: meta[TALLY_META_TYPES.TOTAL_MONTHLY]?.[TALLY_META_TYPES.HAS_DATA],
    totalMonthlyValue: meta[TALLY_META_TYPES.TOTAL_MONTHLY]?.[TALLY_META_TYPES.VALUE]
  };

  return updatedResponse;
};

const rhsmTranformers = {
  instances: rhsmInstances,
  tally: rhsmTally
};

export { rhsmTranformers as default, rhsmTranformers, rhsmInstances, rhsmTally };
