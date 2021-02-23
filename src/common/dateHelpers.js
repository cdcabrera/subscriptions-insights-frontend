import moment from 'moment/moment';
import { helpers } from './helpers';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../types/rhsmApiTypes';
import { translate } from '../components/i18n/i18n';

/**
 * Return a date.
 *
 * @returns {string|Date}
 */
const getCurrentDate = () =>
  (helpers.TEST_MODE && '20190720') || (helpers.DEV_MODE && process.env.REACT_APP_DEBUG_DEFAULT_DATETIME) || new Date();

/**
 * Set a date range based on a granularity type.
 *
 * @param {object} params
 * @param {Date} params.date Start date, typically the current date.
 * @param {number} params.subtract Number of granularity type to subtract from the current date.
 * @param {string} params.measurement Granularity type.
 * @param {string} params.endOfMeasurement Granularity type.
 * @returns {{endDate: Date, startDate: Date}}
 */
const setRangedDateTime = ({ date, subtract, measurement, endOfMeasurement = 'days' }) => ({
  startDate: moment.utc(date).startOf(measurement).subtract(subtract, measurement).toDate(),
  endDate: moment.utc(date).startOf(measurement).endOf(endOfMeasurement).toDate()
});

const currentDateTime = setRangedDateTime({ date: getCurrentDate(), subtract: 1, measurement: 'days' });
const defaultDateTime = setRangedDateTime({ date: getCurrentDate(), subtract: 30, measurement: 'days' });
const weeklyDateTime = setRangedDateTime({ date: getCurrentDate(), subtract: 12, measurement: 'weeks' });
const monthlyDateTime = setRangedDateTime({ date: getCurrentDate(), subtract: 12, measurement: 'months' });
const quarterlyDateTime = setRangedDateTime({ date: getCurrentDate(), subtract: 36, measurement: 'months' });
const rangedDateTime = setRangedDateTime({
  date: getCurrentDate(),
  subtract: 11,
  measurement: 'months',
  endOfMeasurement: 'months'
});

/**
 * Return a range of time based on known granularity types.
 *
 * @param {string} granularity
 * @returns {{endDate: Date, startDate: Date}}
 */
const getRangedDateTime = granularity => {
  switch (granularity) {
    case 'CURRENT':
      return { ...currentDateTime };
    case GRANULARITY_TYPES.WEEKLY:
      return { ...weeklyDateTime };
    case GRANULARITY_TYPES.MONTHLY:
      return { ...monthlyDateTime };
    case GRANULARITY_TYPES.QUARTERLY:
      return { ...quarterlyDateTime };
    case GRANULARITY_TYPES.DAILY:
    default:
      return { ...defaultDateTime };
  }
};

const getMonthlyRangedDateTime = month => {
  const { startDate, endDate } = { ...rangedDateTime };
  const keyDateTimeRanges = {};
  let listDateTimeRanges = [];

  const startDateUpdated = moment.utc(startDate);
  const endDateUpdated = moment.utc(endDate);

  while (endDateUpdated > startDateUpdated || startDateUpdated.format('M') === endDateUpdated.format('M')) {
    const dateTime = {
      value: {
        startDate: startDateUpdated.toDate()
      }
    };

    const startDateYear = Number.parseInt(startDateUpdated.year(), 10);
    let priorYear = listDateTimeRanges?.[listDateTimeRanges.length - 1]?.value.startDate;

    priorYear =
      priorYear &&
      Number.parseInt(moment.utc(listDateTimeRanges?.[listDateTimeRanges.length - 1]?.value.startDate).year(), 10);

    const isNewYear = (priorYear && startDateYear !== priorYear) || false;
    const titleYear = startDateUpdated.format('MMMM YYYY');
    const title = startDateUpdated.format('MMMM');

    startDateUpdated.add(1, 'month');

    dateTime.title = (isNewYear && titleYear) || title;
    dateTime.value.endDate = startDateUpdated.startOf('month').toDate();

    dateTime.title = translate('curiosity-toolbar.granularityRange', { context: dateTime.title });
    keyDateTimeRanges[startDateUpdated.format('MMMM')] = dateTime;
    listDateTimeRanges.push(dateTime);
  }
  /*
  while (endDateUpdated > startDateUpdated || startDateUpdated.format('M') === endDateUpdated.format('M')) {
    const dateTime = {
      value: {
        startDate: startDateUpdated.format()
      }
    };

    const titleYear = startDateUpdated.format('MMMM YYYY');
    const title = startDateUpdated.format('MMMM');
    const startDateYear = Number.parseInt(startDateUpdated.year(), 10);

    startDateUpdated.add(1, 'month');
    const nextDateYear = Number.parseInt(startDateUpdated.year(), 10);
    const isNewYear = startDateYear !== nextDateYear;

    dateTime.title = (isNewYear && titleYear) || title;
    dateTime.value.endDate = startDateUpdated.startOf('month').format();

    // dateTime.title = translate('curiosity-toolbar.granularityRange', { context: dateTime.title });
    keyDateTimeRanges[startDateUpdated.format('MMMM')] = dateTime;
    listDateTimeRanges.push(dateTime);
  }
   */

  if (keyDateTimeRanges?.month) {
    return keyDateTimeRanges[month];
  }

  listDateTimeRanges = listDateTimeRanges.reverse();
  listDateTimeRanges[0] = {
    ...listDateTimeRanges[0],
    title: translate('curiosity-toolbar.granularityRange', { context: 'current' })
  };

  return { keyDateTimeRanges, listDateTimeRanges };
};

/**
 * Consistent timestamp day formats.
 *
 * @type {{short: string, yearShort: string, yearLong: string, long: string}}
 */
const timestampDayFormats = {
  long: 'MMMM D',
  yearLong: 'MMMM D YYYY',
  short: 'MMM D',
  yearShort: 'MMM D YYYY'
};

/**
 * Consistent timestamp month formats.
 *
 * @type {{short: string, yearShort: string, yearLong: string, long: string}}
 */
const timestampMonthFormats = {
  long: 'MMMM',
  yearLong: 'MMMM YYYY',
  short: 'MMM',
  yearShort: 'MMM YYYY'
};

/**
 * Consistent timestamp quarter formats.
 *
 * @type {{short: string, yearShort: string, yearLong: string, long: string}}
 */
const timestampQuarterFormats = {
  ...timestampMonthFormats
};

const dateHelpers = {
  getCurrentDate,
  getMonthlyRangedDateTime,
  getRangedDateTime,
  setRangedDateTime,
  currentDateTime,
  defaultDateTime,
  monthlyDateTime,
  quarterlyDateTime,
  weeklyDateTime,
  timestampDayFormats,
  timestampMonthFormats,
  timestampQuarterFormats
};

export {
  dateHelpers as default,
  getCurrentDate,
  getMonthlyRangedDateTime,
  getRangedDateTime,
  setRangedDateTime,
  currentDateTime,
  dateHelpers,
  defaultDateTime,
  monthlyDateTime,
  quarterlyDateTime,
  weeklyDateTime,
  timestampDayFormats,
  timestampMonthFormats,
  timestampQuarterFormats
};
