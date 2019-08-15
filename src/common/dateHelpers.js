import moment from 'moment/moment';
import { helpers } from './helpers';
import { rhelApiTypes } from '../types/rhelApiTypes';

const getCurrentDate = () =>
  (helpers.TEST_MODE && '20190720') || (helpers.DEV_MODE && process.env.REACT_APP_DEBUG_DEFAULT_DATETIME) || new Date();

const setRangedDateTime = ({ date, subtract, measurement }) => ({
  start: moment
    .utc(date)
    .startOf('day')
    .subtract(subtract, measurement)
    .toDate(),
  end: moment
    .utc(date)
    .endOf('day')
    .toDate()
});

const defaultDateTime = setRangedDateTime({ date: getCurrentDate(), subtract: 30, measurement: 'days' });
const weeklyDateTime = setRangedDateTime({ date: getCurrentDate(), subtract: 12, measurement: 'weeks' });
const monthlyDateTime = setRangedDateTime({ date: getCurrentDate(), subtract: 12, measurement: 'months' });
const quarterlyDateTime = setRangedDateTime({ date: getCurrentDate(), subtract: 4, measurement: 'years' });

/**
 * Return a range of time based on granularity.
 *
 * @param {string} granularity
 * @returns {{endDate: Date, startDate: Date}}
 */
const GRANULARITY_TYPES = rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES;

const getRangedDateTime = granularity => {
  switch (granularity) {
    case GRANULARITY_TYPES.WEEKLY:
      return { startDate: weeklyDateTime.start, endDate: weeklyDateTime.end };
    case GRANULARITY_TYPES.MONTHLY:
      return { startDate: monthlyDateTime.start, endDate: monthlyDateTime.end };
    case GRANULARITY_TYPES.QUARTERLY:
      return { startDate: quarterlyDateTime.start, endDate: quarterlyDateTime.end };
    case GRANULARITY_TYPES.DAILY:
    default:
      return { startDate: defaultDateTime.start, endDate: defaultDateTime.end };
  }
};

const dateHelpers = {
  getCurrentDate,
  getRangedDateTime,
  setRangedDateTime,
  defaultDateTime,
  monthlyDateTime,
  quarterlyDateTime,
  weeklyDateTime
};

export {
  dateHelpers as default,
  getCurrentDate,
  getRangedDateTime,
  setRangedDateTime,
  dateHelpers,
  defaultDateTime,
  monthlyDateTime,
  quarterlyDateTime,
  weeklyDateTime
};
