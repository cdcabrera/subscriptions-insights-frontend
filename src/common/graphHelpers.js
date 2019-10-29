import moment from 'moment';
import numbro from 'numbro';
import { rhelApiTypes } from '../types/rhelApiTypes';
import { translate } from '../components/i18n/i18n';
import { helpers } from './helpers';

const GRANULARITY_TYPES = rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES;

/**
 * Chart Date Format (used in axis and tooltips)
 */
const chartDateDayFormatLong = 'MMMM D';
const chartDateDayFormatYearLong = 'MMMM D YYYY';
const chartDateDayFormatShort = 'MMM D';
const chartDateDayFormatYearShort = 'MMM D YYYY';

const chartDateMonthFormatLong = 'MMMM';
const chartDateMonthFormatYearLong = 'MMMM YYYY';
const chartDateMonthFormatShort = 'MMM';
const chartDateMonthFormatYearShort = 'MMM YYYY';

const chartDateQuarterFormatLong = 'MMMM';
const chartDateQuarterFormatYearLong = 'MMMM YYYY';
const chartDateQuarterFormatShort = 'MMM';
const chartDateQuarterFormatYearShort = 'MMM YYYY';

/**
 * Returns x axis ticks/intervals array for the xAxisTickInterval
 *
 * @param {string} granularity, see enum of rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES
 * @returns {number}
 */
const getChartXAxisLabelIncrement = granularity => {
  switch (granularity) {
    case GRANULARITY_TYPES.DAILY:
      return 5;
    case GRANULARITY_TYPES.WEEKLY:
    case GRANULARITY_TYPES.MONTHLY:
      return 2;
    case GRANULARITY_TYPES.QUARTERLY:
    default:
      return 1;
  }
};

/**
 * Return translated labels based on granularity.
 *
 * @param {string} granularity, see enum of rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES
 * @param {string} tooltipLabel
 * @returns {Object}
 */
const getGraphLabels = ({ granularity, tooltipLabel }) => {
  const labels = {
    label: tooltipLabel
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
 * Return a time allotment based on granularity
 *
 * @param {string} granularity enum based on rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES
 * @returns {string}
 */
const getGranularityDateType = granularity => {
  switch (granularity) {
    case GRANULARITY_TYPES.WEEKLY:
      return 'weeks';
    case GRANULARITY_TYPES.MONTHLY:
      return 'months';
    case GRANULARITY_TYPES.QUARTERLY:
      return 'quarters';
    case GRANULARITY_TYPES.DAILY:
    default:
      return 'days';
  }
};

/**
 * Apply label formatting
 *
 * @param {number} data
 * @param {number} previousData
 * @param {string} formattedDate
 * @param {string} granularity, see enum of rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES
 * @param {string} tooltipLabel
 * @returns {string}
 */
const getLabel = ({ data, previousData, formattedDate, granularity, tooltipLabel }) => {
  const { label, previousLabel } = getGraphLabels({
    granularity,
    tooltipLabel
  });
  const previousCount = data - previousData;
  const updatedLabel = `${data} ${label} ${formattedDate}`;

  if (!previousData || previousCount === 0) {
    return updatedLabel;
  }

  return `${updatedLabel}\n ${previousCount > -1 ? '+' : ''}${previousCount} ${previousLabel}`;
};

/**
 * Apply Threshold Label formatting
 * @param {number} yValue the yaxis value
 * @param {string} tooltipThresholdLabel the threshold label
 */
const getThresholdLabel = ({ yValue, tooltipThresholdLabel }) => {
  return `${tooltipThresholdLabel}: ${yValue}`;
};

// ToDo: when the API returns filler date values "fillFormatChartData" should be updated
/**
 * Fill missing dates, and format graph data
 *
 * @param {Array} data
 * @param {Date} endDate
 * @param {string} granularity, see enum of rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES
 * @param {Date} startDate
 * @param {string} tooltipLabel
 * @param {string} tooltipLabelNoData
 * @param {string} tooltipThresholdLabel
 * @returns {Object}
 */
const fillFormatChartData = ({
  data,
  endDate,
  granularity,
  startDate,
  tooltipLabel,
  tooltipLabelNoData,
  tooltipThresholdLabel
}) => {
  const granularityType = getGranularityDateType(granularity);
  const granularityTick = getChartXAxisLabelIncrement(granularity);
  const endDateStartDateDiff = moment(endDate).diff(startDate, granularityType);
  const chartData = [];
  const chartDataThresholds = [];

  let isThreshold = false;
  let previousData = null;
  let previousYear = null;

  for (let i = 0; i <= endDateStartDateDiff; i++) {
    const momentDate = moment
      .utc(startDate)
      .add(i, granularityType)
      .startOf(granularityType);
    const stringDate = momentDate.toISOString();
    const year = parseInt(momentDate.year(), 10);

    const checkTick = i % granularityTick === 0;
    const isNewYear = i !== 0 && checkTick && year !== previousYear;
    let formattedDate;
    let formattedDateTooltip;

    if (granularityType === 'quarters') {
      formattedDate = isNewYear
        ? momentDate.format(chartDateQuarterFormatYearShort)
        : momentDate.format(chartDateQuarterFormatShort);

      formattedDateTooltip = isNewYear
        ? momentDate.format(chartDateQuarterFormatYearLong)
        : momentDate.format(chartDateQuarterFormatLong);
    } else if (granularityType === 'months') {
      formattedDate = isNewYear
        ? momentDate.format(chartDateMonthFormatYearShort)
        : momentDate.format(chartDateMonthFormatShort);

      formattedDateTooltip = isNewYear
        ? momentDate.format(chartDateMonthFormatYearLong)
        : momentDate.format(chartDateMonthFormatLong);
    } else {
      formattedDate = isNewYear
        ? momentDate.format(chartDateDayFormatYearShort)
        : momentDate.format(chartDateDayFormatShort);

      formattedDateTooltip = isNewYear
        ? momentDate.format(chartDateDayFormatYearLong)
        : momentDate.format(chartDateDayFormatLong);
    }

    const yAxis = (data[stringDate] && data[stringDate].data) || 0;
    const yAxisThreshold = (data[stringDate] && data[stringDate].dataThreshold) || 0;

    isThreshold = isThreshold || yAxisThreshold > 0;

    const labelData = {
      data: yAxis,
      previousData,
      formattedDate: formattedDateTooltip,
      granularity,
      tooltipLabel
    };

    const chartDataThresholdsItem = {
      x: chartData.length,
      y: yAxisThreshold
    };

    if (yAxisThreshold) {
      chartDataThresholdsItem.tooltip = getThresholdLabel({ yValue: yAxisThreshold, tooltipThresholdLabel });
    }

    chartDataThresholds.push(chartDataThresholdsItem);

    const chartDataItem = {
      x: chartData.length,
      y: yAxis,
      xAxisLabel:
        granularityType === 'months' || granularityType === 'quarters'
          ? formattedDate.replace(/\s/, '\n')
          : formattedDate
    };

    chartDataItem.tooltip = yAxis ? getLabel(labelData) : tooltipLabelNoData;

    if ((!yAxis && yAxisThreshold) || !chartDataItem.tooltip) {
      delete chartDataItem.tooltip;
    }

    chartData.push(chartDataItem);

    previousData = yAxis;

    if (checkTick && year !== previousYear) {
      previousYear = year;
    }
  }

  return { chartData, chartDataThresholds: (isThreshold && chartDataThresholds) || [] };
};

/**
 * ToDo: the y axis should be a total of all y axis values, an aspect of threshold
 * When multiple data facets are being displayed "convertChartData" should be cleaned up.
 */
/**
 * Convert graph data to consumable format
 *
 * @param {Array} data list of available report data
 * @param {string} dataFacet the response property used for the y axis
 * @param {Array} dataThreshold list of available capacity data
 * @param {string} dataThresholdFacet the response property for the threshold line indicator
 * @param {string} tooltipLabel the tooltip label
 * @param {string} tooltipLabelNoData
 * @param {string} tooltipThresholdLabel the tooltip threshold label
 * @param {date} startDate
 * @param {date} endDate
 * @param {string} granularity, see enum of rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES
 * @returns {Object} Object array result converted { chartData: {...} chartDomain {...} }
 */
/*
const convertChartDataOLD = ({
  data,
  dataFacet,
  dataThreshold,
  dataThresholdFacet,
  tooltipLabel,
  tooltipLabelNoData,
  tooltipThresholdLabel,
  startDate,
  endDate,
  granularity
}) => {
  const formattedData = {};

  (data || []).forEach((value, index) => {
    if (value) {
      const stringDate = moment
        .utc(value[rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE])
        .startOf('day')
        .toISOString();

      /**
       * FixMe: per API the list indexes should match on capacity and reporting.
       * Once reasonable testing has occurred consider removing this check.
        /
      const checkThresholdDate = dataThresholdItem => {
        if (!dataThresholdItem) {
          return false;
        }

        const stringThresholdDate = moment
          .utc(dataThresholdItem[rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE])
          .startOf('day')
          .toISOString();

        return moment(stringDate).isSame(stringThresholdDate);
      };

      formattedData[stringDate] = {
        data: Number.parseInt(value[dataFacet], 10),
        dataThreshold: Number.parseInt(
          (checkThresholdDate(dataThreshold && dataThreshold[index]) && dataThreshold[index][dataThresholdFacet]) || 0,
          10
        )
      };
    }
  });

  const { chartData, chartDataThresholds } = fillFormatChartData({
    data: formattedData,
    endDate,
    granularity,
    startDate,
    tooltipLabel,
    tooltipLabelNoData,
    tooltipThresholdLabel
  });

  // debugger;

  return {
    chartData,
    chartDataThresholds,
    chartXAxisLabelIncrement: getChartXAxisLabelIncrement(granularity),
    chartFacets: chartData
  };
};
*/

/*
const convertChartData = ({ data = [], tooltipLabel = null, tooltipLabelNoData = null, granularity = null }) =>
  data.map((dataItem, index) => {


    return {
      ...dataItem
    };
  });
*/

const tooltipDate = ({ date, granularity }) => {
  const granularityType = getGranularityDateType(granularity);
  const momentDate = moment(date);
  let formattedDateTooltip;

  switch (granularityType) {
    case 'quarters':
      formattedDateTooltip = chartDateQuarterFormatLong;
      break;
    case 'months':
      formattedDateTooltip = chartDateMonthFormatLong;
      break;
    default:
      formattedDateTooltip = chartDateDayFormatLong;
      break;
  }

  return momentDate.format(formattedDateTooltip);
};

const addTooltips = ({
  data = [],
  tooltip,
  // tooltipNoData,
  // disableTooltipOnNoData,
  // tooltipLabel = null,
  // tooltipLabelNoData = null,
  granularity = null
}) => {
  const granularityType = getGranularityDateType(granularity);
  // const granularityTick = getChartXAxisLabelIncrement(granularity);

  let previousData = null;
  let previousYear = null;

  return data.map((dataItem, index) => {
    const updatedData = {
      ...dataItem
    };
    const momentDate = moment(dataItem.date);
    const year = parseInt(momentDate.year(), 10);
    const isNewYear = index !== 0 && year !== previousYear;

    let formattedDate;
    let formattedDateTooltip;

    switch (granularityType) {
      case 'quarters':
        formattedDate = (isNewYear && chartDateQuarterFormatYearShort) || chartDateQuarterFormatShort;
        formattedDateTooltip = (isNewYear && chartDateQuarterFormatYearLong) || chartDateQuarterFormatLong;
        break;
      case 'months':
        formattedDate = (isNewYear && chartDateMonthFormatYearShort) || chartDateMonthFormatShort;
        formattedDateTooltip = (isNewYear && chartDateMonthFormatYearLong) || chartDateMonthFormatLong;
        break;
      default:
        formattedDate = (isNewYear && chartDateDayFormatYearShort) || chartDateDayFormatShort;
        formattedDateTooltip = (isNewYear && chartDateDayFormatYearLong) || chartDateDayFormatLong;
        break;
    }

    formattedDate = momentDate.format(formattedDate);
    formattedDateTooltip = momentDate.format(formattedDateTooltip);

    if (tooltip) {
      const tooltipDisplay = tooltip({
        formattedDate: formattedDateTooltip,
        previousData,
        data: dataItem
      });

      if (tooltipDisplay) {
        updatedData.tooltip = tooltipDisplay;
      }
    }

    // if (disableTooltipOnNoData && !dataItem.y) {
    //  delete updatedData.tooltip;
    // }

    // if (tooltipNoData) {
    // updatedData.tooltip = tooltipNoData(dataItem);
    // }

    // if (!data.y && !tooltipNoData) {
    // delete updatedData.tooltip;
    // }

    previousData = dataItem;
    previousYear = year;

    return updatedData;
    // return dataItem;

    /*
    const checkTick = index % granularityTick === 0;
    const isNewYear = index !== 0 && checkTick && year !== previousYear;
    let formattedDate;
    let formattedDateTooltip;

    if (granularityType === 'quarters') {
      formattedDate = isNewYear
        ? momentDate.format(chartDateQuarterFormatYearShort)
        : momentDate.format(chartDateQuarterFormatShort);

      formattedDateTooltip = isNewYear
        ? momentDate.format(chartDateQuarterFormatYearLong)
        : momentDate.format(chartDateQuarterFormatLong);
    } else if (granularityType === 'months') {
      formattedDate = isNewYear
        ? momentDate.format(chartDateMonthFormatYearShort)
        : momentDate.format(chartDateMonthFormatShort);

      formattedDateTooltip = isNewYear
        ? momentDate.format(chartDateMonthFormatYearLong)
        : momentDate.format(chartDateMonthFormatLong);
    } else {
      formattedDate = isNewYear
        ? momentDate.format(chartDateDayFormatYearShort)
        : momentDate.format(chartDateDayFormatShort);

      formattedDateTooltip = isNewYear
        ? momentDate.format(chartDateDayFormatYearLong)
        : momentDate.format(chartDateDayFormatLong);
    }

    const labelData = {
      data: dataItem.y,
      previousData,
      formattedDate: formattedDateTooltip,
      granularity,
      tooltipLabel
    };
    */
    /*
    const chartDataThresholdsItem = {
      x: chartData.length,
      y: yAxisThreshold
    };

    if (yAxisThreshold) {
      chartDataThresholdsItem.tooltip = getThresholdLabel({ yValue: yAxisThreshold, tooltipThresholdLabel });
    }

    chartDataThresholds.push(chartDataThresholdsItem);
    */
    /*
    const chartDataItem = {
      xAxisLabel:
        granularityType === 'months' || granularityType === 'quarters'
          ? formattedDate.replace(/\s/, '\n')
          : formattedDate
    };

    chartDataItem.tooltip = (dataItem.y && getLabel(labelData)) || tooltipLabelNoData;

    if (!dataItem.y && !tooltipLabelNoData) {
      delete chartDataItem.tooltip;
    }

    // chartData.push(chartDataItem);

    previousData = dataItem.y;

    if (checkTick && year !== previousYear) {
      previousYear = year;
    }

    return {
      ...dataItem
    };
     */
  });
};

const xAxisTickFormat = ({ date, granularity, tick }) => {
  /*
  const granularityType = getGranularityDateType(granularity);
  const granularityTick = getChartXAxisLabelIncrement(granularity);

  const momentDate = moment.utc(date);
  // const stringDate = momentDate.toISOString();
  // const year = parseInt(momentDate.year(), 10);

  const checkTick = tick % granularityTick === 0;
  const isNewYear = tick !== 0 && checkTick; // && year !== previousYear;

  let formattedDate;

  if (granularityType === 'quarters') {
    formattedDate = isNewYear
      ? momentDate.format(chartDateQuarterFormatYearShort)
      : momentDate.format(chartDateQuarterFormatShort);
  } else if (granularityType === 'months') {
    formattedDate = isNewYear
      ? momentDate.format(chartDateMonthFormatYearShort)
      : momentDate.format(chartDateMonthFormatShort);
  } else {
    formattedDate = isNewYear
      ? momentDate.format(chartDateDayFormatYearShort)
      : momentDate.format(chartDateDayFormatShort);
  }
  */
  if (!date || !granularity) {
    return undefined;
  }

  const granularityType = getGranularityDateType(granularity);
  const granularityTick = getChartXAxisLabelIncrement(granularity);
  const checkTick = tick % granularityTick === 0;
  const isNewYear = tick !== 0 && checkTick; // && year !== previousYear;

  const momentDate = moment(date);
  let formattedDate;

  if (granularityType === 'quarters') {
    formattedDate = isNewYear
      ? momentDate.format(chartDateQuarterFormatYearShort)
      : momentDate.format(chartDateQuarterFormatShort);
  } else if (granularityType === 'months') {
    formattedDate = isNewYear
      ? momentDate.format(chartDateMonthFormatYearShort)
      : momentDate.format(chartDateMonthFormatShort);
  } else {
    formattedDate = isNewYear
      ? momentDate.format(chartDateDayFormatYearShort)
      : momentDate.format(chartDateDayFormatShort);
  }

  /*
  if (granularityType === 'quarters') {
    formattedDate = momentDate.format('MM');
  } else if (granularityType === 'months') {
    formattedDate = momentDate.format('MM');
  } else {
    formattedDate = momentDate.format('MMM D');
  }
   */

  // const test = ;
  // console.log(`one=${test}`, `two=${date.toISOString()}`, `three=${moment(date).toISOString()}`);
  // return moment(date).format('MMMM D');
  return formattedDate;
};

const yAxisTickFormat = tick => numbro(tick).format({ average: true, mantissa: 1, optionalMantissa: true });

const graphHelpers = {
  tooltipDate,
  addTooltips,
  xAxisTickFormat,
  yAxisTickFormat,
  fillFormatChartData,
  // convertChartData,
  getGranularityDateType,
  getGraphLabels,
  getChartXAxisLabelIncrement,
  getLabel
};

export {
  graphHelpers as default,
  graphHelpers,
  tooltipDate,
  addTooltips,
  xAxisTickFormat,
  yAxisTickFormat,
  fillFormatChartData,
  // convertChartData,
  getGranularityDateType,
  getGraphLabels,
  getChartXAxisLabelIncrement,
  getLabel
};
