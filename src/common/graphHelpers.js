import moment from 'moment';
import { rhelApiTypes } from '../types/rhelApiTypes';
import { helpers } from './helpers';
import { translate } from '../components/i18n/i18n';

const GRANULARITY_TYPES = rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES;

/**
 * Chart Date Format (used in axis and tooltips)
 */
const chartDateDayFormatShort = 'MMM D';
const chartDateDayFormat = 'MMM D YYYY';

const chartDateMonthFormatShort = 'MMM';
const chartDateMonthFormat = 'MMM YYYY';

/**
 * Generate a fallback graph with zeroed data
 *
 * @param {string} startDate
 * @param {string} endDate
 * @returns {Array}
 */
/*
const zeroedUsageData = (startDate, endDate) => {
  const zeroedArray = [];
  const endDateStartDateDiff = moment(endDate).diff(startDate, 'days');

  for (let i = 0; i <= endDateStartDateDiff; i++) {
    const clonedStartDate = moment.utc(startDate);
    zeroedArray.push({
      x: clonedStartDate.add(i, 'days').format(chartDateFormat),
      y: 0
    });
  }

  return zeroedArray;
};
*/

/**
 * Returns y axis range, aka chart domain, setting for given inputs.
 *
 * the y axis max should be rounded to the nearest 10 if less than 50,
 * otherwise round to the nearest power of 10
 *
 * the y axis returns large enough number that zeroed bars dont show
 *
 * @param {number} chartDataLength Number of chart data points
 * @param {boolean} maxY The max y-value
 * @returns {Object}
 */
const getChartDomain = ({ chartDataLength, maxY = 0 }) => {
  // const chartDomain = { x: [0, chartDataLength === 0 ? 31 : chartDataLength + 1] };
  // const chartDomain = { x: [0, chartDataLength === 0 ? 31 : chartDataLength / 3] };
  const chartDomain = {};

  if (chartDataLength === 0 || maxY < 50) {
    chartDomain.y = [0, Math.ceil((maxY + 1) / 10) * 10];
  } else {
    chartDomain.y = [0, Math.pow(10, maxY.toString().length)];
  }

  return chartDomain;
};

/**
 * Return a time allotment based on granularity
 *
 * @param {string} granularity enum based on rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES
 * @returns {string}
 */
const getGranularityType = granularity => {
  switch (granularity) {
    case GRANULARITY_TYPES.DAILY:
      return 'days';
    case GRANULARITY_TYPES.WEEKLY:
      return 'weeks';
    case GRANULARITY_TYPES.MONTHLY:
    case GRANULARITY_TYPES.QUARTERLY:
    default:
      return 'months';
  }
};

const getGraphLabels = granularity => {
  const labels = {
    label: translate('curiosity-graph.tooltipLabel')
  };

  switch (granularity) {
    case GRANULARITY_TYPES.WEEKLY:
      labels.previousLabel = translate('curiosity-graph.tooltipPreviousLabelWeekly');
      break;
    case GRANULARITY_TYPES.MONTHLY:
      labels.previousLabel = translate('curiosity-graph.tooltipPreviousLabelMonthly');
      break;
    case GRANULARITY_TYPES.QUARTERLY:
      labels.previousLabel = translate('curiosity-graph.tooltipPreviousLabelQuarterly');
      break;
    case GRANULARITY_TYPES.DAILY:
    default:
      labels.previousLabel = translate('curiosity-graph.tooltipPreviousLabelDaily');
      break;
  }

  return labels;
};

/**
 * Apply label formatting
 *
 * @param {number} data
 * @param {number} previousData
 * @param {string} formattedDate
 * @param {string} label
 * @param {string} previousLabel
 * @returns {string}
 */
const getLabel = ({ data, previousData, formattedDate, granularity }) => {
  const { label, previousLabel } = getGraphLabels(granularity);
  const previousCount = data - previousData;
  const updatedLabel = `${data} ${label} ${formattedDate}`;

  if (!previousData || previousCount === 0) {
    return updatedLabel;
  }

  return `${updatedLabel}\n ${previousCount > -1 ? '+' : ''}${previousCount} ${previousLabel}`;
};

/**
 * Returns x axis ticks/intervals array for the xAxisTickInterval
 *
 * @param {Array} chartData
 * @param {number} xAxisTickInterval
 * @param {(days|weeks|months)} granularity
 * @returns {Array}
 */
const getTickValues = ({ chartData, xAxisTickInterval = 5, granularity }) => {
  // const tickInterval = granularityType === 'weeks' || granularityType === 'months' ? 1 : xAxisTickInterval;
  // const tickInterval = chartData.length < 15 ? 1 : xAxisTickInterval;
  let tickInterval = xAxisTickInterval;

  switch (granularity) {
    case GRANULARITY_TYPES.DAILY:
      tickInterval = 5;
      break;
    case GRANULARITY_TYPES.QUARTERLY:
      // tickInterval = 5;
      tickInterval = 1;
      break;
    case GRANULARITY_TYPES.WEEKLY:
    case GRANULARITY_TYPES.MONTHLY:
    default:
      tickInterval = 1;
      break;
  }

  // debugger;
  // const ticks = chartData.reduce((acc, current, index) => ((chartData.length < 15) || (index % tickInterval === 0) ? acc.concat(current.x) : acc), []);
  const ticks = chartData.reduce(
    (acc, current, index) => (index % tickInterval === 0 ? acc.concat(current.x) : acc),
    []
  );
  // return chartData.map(value => value.x);
  // debugger;
  console.log('TICKS - - - - -- - ------>', granularity, ticks);

  return ticks;
};

/**
 * Fills missing dates with zeroed y-values, updates labels
 * walk the date range and fill missing values, all the while updating previous labels
 *
 * @param {string} startDate
 * @param {string} endDate
 * @param {object} values pre-filled key-value object
 * @param {(days|weeks|months)} granularityType
 * @param {string} label i18n specific label
 * @param {string} previousLabel i18n specific previousLabel
 * @returns {Array}
 */
const fillMissingValuesOLD = ({ startDate, endDate, values, granularityType, label, previousLabel }) => {
  const endDateStartDateDiff = moment(endDate).diff(startDate, granularityType);
  const chartData = [];
  let previousYear = null;

  for (let i = 0; i <= endDateStartDateDiff; i++) {
    const momentDate = moment.utc(startDate).add(i, granularityType);
    const stringDate = momentDate.toISOString();
    const year = parseInt(momentDate.year(), 10);
    const isNewYear = previousYear !== null && year !== previousYear;
    const formattedDate = momentDate.format((isNewYear && chartDateDayFormat) || chartDateDayFormatShort);

    const retData = {
      data: 0,
      previousData: i > 0 ? chartData[i - 1].y : null,
      formattedDate,
      label,
      previousLabel
    };

    if (values[stringDate]) {
      retData.data = values[stringDate].y;

      chartData.push({
        x: values[stringDate].x,
        y: values[stringDate].y,
        label: getLabel(retData)
      });
    } else {
      chartData.push({
        x: formattedDate,
        y: 0,
        label: getLabel(retData)
      });
    }

    previousYear = year;
  }

  // debugger;

  /*
  for (let i = 0; i <= endDateStartDateDiff; i++) {
    const formattedDate = moment
      .utc(startDate)
      .add(i, granularityType)
      .format(chartDateFormat);

    const updatedLabel = getLabel({
      data: values[formattedDate] ? values[formattedDate].y : 0,
      previousData: i > 0 ? chartData[i - 1].y : null,
      formattedDate,
      label,
      previousLabel
    });

    if (values[formattedDate]) {
      chartData.push({
        x: values[formattedDate].x,
        y: values[formattedDate].y,
        label: updatedLabel
      });
    } else {
      chartData.push({
        x: formattedDate,
        y: 0,
        label: updatedLabel
      });
    }
  }
  */

  return chartData;
};

const getChartData = ({ data, endDate, granularity, startDate }) => {
  const granularityType = getGranularityType(granularity);
  const endDateStartDateDiff = moment(endDate).diff(startDate, granularityType);
  const chartData = [];

  let previousData = null;
  let previousYear = null;

  console.log('REWRITE 1A - - - - -- - - ----->', data, endDateStartDateDiff);

  for (let i = 0; i <= endDateStartDateDiff; i++) {
    if (GRANULARITY_TYPES.QUARTERLY === granularity && i % 4 !== 0) {
      continue;
    }

    const momentDate = moment.utc(startDate).add(i, granularityType);
    const stringDate = momentDate.toISOString();
    const year = parseInt(momentDate.year(), 10);

    const isNewYear = year !== previousYear;
    let formattedDate;

    if (granularityType === 'months') {
      formattedDate = isNewYear
        ? momentDate.format(chartDateMonthFormat)
        : momentDate.format(chartDateMonthFormatShort);
    } else {
      formattedDate = isNewYear ? momentDate.format(chartDateDayFormat) : momentDate.format(chartDateDayFormatShort);
    }

    console.log('REWRITE 1B - - - - -- - - ----->', year, isNewYear, stringDate);

    const labelData = {
      data: data[stringDate] || 0,
      // previousData: i > 0 ? chartData[i - 1].y : null,
      previousData,
      formattedDate,
      // label,
      // previousLabel,
      granularity
    };

    chartData.push({
      x: formattedDate,
      y: data[stringDate] || 0,
      label: getLabel(labelData)
    });

    previousData = data[stringDate];
    previousYear = year;
  }

  return chartData;
};

/**
 * Convert graph data to usable format
 * convert json usage report from this format:
 *  {cores: 56, date: "2019-06-01T00:00:00Z", instance_count: 28}
 * to this format:
 *  { x: 'Jun 1', y: 56, label: '56 Sockets on Jun 1 \r\n +5 from previous day' }
 *
 * @param {Array} data
 * @param {date} startDate
 * @param {date} endDate
 * @param {string} granularity enum of rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES
 * @param {string} label
 * @param {string} previousLabel
 * @param {number} xAxisTickInterval
 * @returns {Object} Object array result converted { chartData: {...} chartDomain {...} }
 */
const convertGraphUsageData = ({ data, startDate, endDate, granularity, label, previousLabel, xAxisTickInterval }) => {
  const formattedData = {};
  let maxY = 0;

  (data || []).forEach(value => {
    const stringDate = moment.utc(value[rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]).toISOString();

    formattedData[stringDate] = Number.parseInt(value[rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS], 10);
    maxY = formattedData[stringDate] > maxY ? formattedData[stringDate] : maxY;
  });

  console.log('REWRITE 1 - - - - -- - - ----->', formattedData);

  const chartData = getChartData({ data: formattedData, endDate, granularity, startDate, label, previousLabel });

  console.log('REWRITE 2 - - - - -- - - ----->', chartData);

  const chartDomain = getChartDomain({ chartDataLength: chartData.length, maxY });
  const tickValues = getTickValues({ chartData, xAxisTickInterval, granularity });

  console.log('REWRITE 3 - - - - -- - - ----->', chartData, chartDomain, tickValues);

  return {
    chartData,
    chartDomain,
    tickValues
  };
};

/*
const convertGraphUsageDataOLD = ({ data, startDate, endDate, granularity, label, previousLabel, xAxisTickInterval }) => {
  const granularityType = getGranularityType(granularity);
  const values = {};
  let chartData = [];
  let chartDomain = {};
  let maxY = 0;

  try {
    data.forEach(value => {
      // const formattedDate = moment
      // .utc(value[rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE])
      //  .format(chartDateDayFormatShort);

      const momentDate = moment.utc(value[rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]);
      const stringDate = momentDate.toISOString();
      // const year = parseInt(momentDate.year(), 10);
      // const isNewYear = previousYear !== null && year !== previousYear;
      // const formattedDate = momentDate.format((isNewYear && chartDateDayFormat) || chartDateDayFormatShort);

      const entry = {
        x: formattedDate,
        y: Number.parseInt(value[rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS], 10)
      };

      maxY = entry.y > maxY ? entry.y : maxY;
      values[entry.x] = entry;
      // chartData.push(entry);
    });
  } catch (e) {
    if (!helpers.TEST_MODE) {
      console.warn(`Malformed API response ${e.message}`);
    }
  }

  chartData = fillMissingValues({ startDate, endDate, values, granularityType, label, previousLabel });
  chartDomain = getChartDomain({ chartDataLength: chartData.length, maxY });
  const tickValues = getTickValues({ chartData, xAxisTickInterval, granularity });

  return {
    chartData,
    chartDomain,
    tickValues
  };

  /*
  const granularityType = getGranularityType(granularity);
  let chartData = [];
  let chartDomain = {};

  try {
    const values = {};
    let maxY = 0;

    for (let i = 0; i < data.length; i++) {
      const formattedDate = moment
        .utc(data[i][rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE])
        .format(chartDateFormat);

      values[formattedDate] = {
        x: formattedDate,
        y: data[i][rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]
      };

      maxY = values[formattedDate].y > maxY ? values[formattedDate].y : maxY;
    }

    if (data.length) {
      chartData = fillMissingValues({ startDate, endDate, values, granularityType, label, previousLabel });
    }

    chartDomain = getChartDomain({ entries: chartData.length, maxY });
  } catch (e) {
    if (!helpers.TEST_MODE) {
      console.warn(`Malformed API response ${e.message}`);
    }
  }

  if (!chartData.length) {
    // chartData = zeroedUsageData(startDate, endDate);
    chartData = fillMissingValues({ startDate, endDate, granularityType });
    chartDomain = getChartDomain({ chartData, entries: 0 });
  }

  const tickValues = getTickValues({ chartData, xAxisTickInterval });

  return { chartData, chartDomain, tickValues };
  * /
};
*/

const graphHelpers = {
  // chartDateFormat,
  convertGraphUsageData,
  getChartDomain,
  getGranularityType,
  getTickValues
  // zeroedUsageData
};

export {
  graphHelpers as default,
  graphHelpers,
  // chartDateFormat,
  convertGraphUsageData,
  getChartDomain,
  getGranularityType,
  getTickValues
  // zeroedUsageData
};
