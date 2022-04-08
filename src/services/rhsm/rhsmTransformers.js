import moment from 'moment';
import {
  RHSM_API_RESPONSE_CAPACITY_DATA_TYPES as CAPACITY_DATA_TYPES,
  RHSM_API_RESPONSE_CAPACITY_META_TYPES as CAPACITY_META_TYPES,
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INSTANCES_DATA_TYPES,
  RHSM_API_RESPONSE_INSTANCES_META_TYPES as INSTANCES_META_TYPES,
  RHSM_API_RESPONSE_TALLY_DATA_TYPES as TALLY_DATA_TYPES,
  RHSM_API_RESPONSE_TALLY_META_TYPES as TALLY_META_TYPES,
  rhsmConstants
} from './rhsmConstants';
import { dateHelpers } from '../../common';

/**
 * FixMe: Capacity endpoint should mirror metric_id behavior, similar to Tally
 * We're temporarily allowing the passing of a made-up metric parameter then using
 * that to pull out the required property.
 */
/**
 * Parse RHSM capacity response for caching.
 *
 * @param {object} response
 * @param {object} config API call configuration
 * @returns {object}
 */
const rhsmCapacity = (response, config) => {
  const metric = config?.params?.[rhsmConstants.RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES.METRIC];
  const updatedMetric = metric.replace(/^capacity_/i, '');
  const updatedResponse = {};
  const { [rhsmConstants.RHSM_API_RESPONSE_DATA]: data = [], [rhsmConstants.RHSM_API_RESPONSE_META]: meta = {} } =
    response || {};
  const currentDay = moment.utc(dateHelpers.getCurrentDate()).format('MM-D-YYYY');

  updatedResponse.data = data.map(
    (
      { [CAPACITY_DATA_TYPES.DATE]: date, [CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: hasInfiniteQuantity, ...props },
      index
    ) => ({
      x: index,
      y: hasInfiniteQuantity === true ? null : props[updatedMetric],
      date,
      hasInfiniteQuantity,
      isCurrentDate: moment.utc(date).format('MM-D-YYYY') === currentDay
    })
  );

  updatedResponse.meta = {
    count: meta[CAPACITY_META_TYPES.COUNT],
    metricId: updatedMetric,
    productId: meta[CAPACITY_META_TYPES.PRODUCT]
  };

  return updatedResponse;
};

/**
 * FixMe: If RHSM Instances is deprecating Hosts we're missing a property, number_of_guests
 */
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
  const metaMeasurements = meta[INSTANCES_META_TYPES.MEASUREMENTS];

  updatedResponse.data = data.map(
    ({
      [INSTANCES_DATA_TYPES.MEASUREMENTS]: measurements,
      [INSTANCES_DATA_TYPES.SUBSCRIPTION_MANAGER_ID]: subscriptionManagerId,
      [INSTANCES_DATA_TYPES.NUMBER_OF_GUESTS]: numberOfGuests,
      ...dataResponse
    }) => {
      const updatedData = {
        numberOfGuests,
        subscriptionManagerId,
        ...dataResponse
      };

      metaMeasurements?.forEach((measurement, index) => {
        updatedData[measurement] = measurements[index];
      });

      return updatedData;
    }
  );

  updatedResponse.meta = {
    count: meta[INSTANCES_META_TYPES.COUNT],
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
  const currentDay = moment.utc(dateHelpers.getCurrentDate()).format('MM-D-YYYY');

  updatedResponse.data = data.map(
    (
      { [TALLY_DATA_TYPES.DATE]: date, [TALLY_DATA_TYPES.VALUE]: value, [TALLY_DATA_TYPES.HAS_DATA]: hasData },
      index
    ) => ({
      x: index,
      y: value,
      date,
      hasData,
      isCurrentDate: moment.utc(date).format('MM-D-YYYY') === currentDay
    })
  );

  updatedResponse.meta = {
    count: meta[TALLY_META_TYPES.COUNT],
    cloudigradeHasMismatch: meta[TALLY_META_TYPES.HAS_CLOUDIGRADE_MISMATCH],
    metricId: meta[TALLY_META_TYPES.METRIC_ID],
    productId: meta[TALLY_META_TYPES.PRODUCT],
    totalMonthlyDate: meta[TALLY_META_TYPES.TOTAL_MONTHLY]?.[TALLY_META_TYPES.DATE],
    totalMonthlyHasData: meta[TALLY_META_TYPES.TOTAL_MONTHLY]?.[TALLY_META_TYPES.HAS_DATA],
    totalMonthlyValue: meta[TALLY_META_TYPES.TOTAL_MONTHLY]?.[TALLY_META_TYPES.VALUE]
  };

  return updatedResponse;
};

const rhsmTransformers = {
  capacity: rhsmCapacity,
  instances: rhsmInstances,
  tally: rhsmTally
};

export { rhsmTransformers as default, rhsmTransformers, rhsmCapacity, rhsmInstances, rhsmTally };
