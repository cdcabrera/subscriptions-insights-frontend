import moment from 'moment';
import { chart_color_green_300 as chartColorGreenDark } from '@patternfly/react-tokens';
import { ChartTypeVariant } from '../chart/chart';
import {
  RHSM_API_QUERY_CATEGORY_TYPES as CATEGORY_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_SET_TYPES
} from '../../services/rhsm/rhsmConstants';
import { dateHelpers, helpers } from '../../common';

/**
 * @memberof GraphCard
 * @module GraphCardHelpers
 */

/**
 * Generate a consistent chart identifier from API.
 *
 * @param {object} params
 * @param {boolean} params.isCapacity
 * @param {string} params.metric
 * @param {string} params.productId
 * @param {object} params.query
 * @returns {string}
 */
const generateChartIds = ({ isCapacity, metric, productId, query = {} } = {}) => {
  const metricCategory = query?.[RHSM_API_QUERY_SET_TYPES.CATEGORY] || undefined;
  const billingCategory = query?.[RHSM_API_QUERY_SET_TYPES.BILLING_CATEGORY] || undefined;
  return `${(isCapacity && 'threshold_') || ''}${metric}${(billingCategory && `_${billingCategory}`) || ''}${
    (metricCategory && `_${metricCategory}`) || ''
  }${(productId && `_${productId}`) || ''}`;
};

/**
 * Is metric associated with a toolbar filter
 *
 * @param {object} params
 * @param {object} params.query
 * @returns {boolean}
 */
const generateIsToolbarFilter = ({ query = {} } = {}) => (query?.[RHSM_API_QUERY_SET_TYPES.CATEGORY] && true) || false;

/**
 * ToDo: clean up remaining isStandalone, metric props.
 * These two properties were used to distinguish the previous product config graph card
 * layouts.
 * - isStandalone: undefined,
 * - metric: undefined,
 */
/**
 * Update chart/graph filters with core settings and styling.
 *
 * @param {object} params
 * @param {Array} params.filters
 * @param {object} params.settings
 * @param {string} params.productId
 * @returns {{standaloneFilters: Array, groupedFilters: object}}
 */
const generateChartSettings = ({ filters = [], settings: graphCardSettings = {}, productId } = {}) => {
  const filtersSettings = [];
  const filter = ({ metric, settings: combinedSettings, ...filterSettings } = {}) => {
    if (!metric) {
      return;
    }
    const { isMultiMetric, isFirst, isLast, ...remainingCombinedSettings } = combinedSettings;
    const updatedChartType = filterSettings?.chartType || ChartTypeVariant.area;
    const isThreshold = filterSettings?.chartType === ChartTypeVariant.threshold;
    const isAxisLabel =
      remainingCombinedSettings?.yAxisChartLabel ||
      remainingCombinedSettings?.xAxisChartLabel ||
      filterSettings?.yAxisChartLabel ||
      filterSettings?.xAxisChartLabel;
    const baseFilterSettings = {
      chartType: updatedChartType,
      id: generateChartIds({ isCapacity: isThreshold, metric, productId, query: filterSettings?.query }),
      isStacked: !isThreshold,
      isThreshold,
      isCapacity: isThreshold,
      metric,
      strokeWidth: 2,
      isToolbarFilter: generateIsToolbarFilter({ query: filterSettings?.query })
    };

    if (isThreshold) {
      baseFilterSettings.stroke = chartColorGreenDark.value;
      baseFilterSettings.strokeDasharray = '4,3';
      baseFilterSettings.strokeWidth = 3;
    }

    if (isFirst) {
      filtersSettings.push({
        settings: {
          ...(isAxisLabel && {
            padding: {
              bottom: 75,
              left: 75,
              right: 45,
              top: 45
            }
          }),
          ...remainingCombinedSettings,
          isMetricDisplay: remainingCombinedSettings?.isMetricDisplay ?? remainingCombinedSettings?.cards?.length > 0,
          isMultiMetric,
          isStandalone: undefined,
          metric: undefined,
          groupMetric: new Set([metric]),
          metrics: [
            {
              ...baseFilterSettings,
              ...filterSettings
            }
          ],
          productId,
          stringId: baseFilterSettings.id
        }
      });
    } else {
      const currentLastFiltersSettingsEntry = filtersSettings?.[filtersSettings.length - 1]?.settings;

      if (currentLastFiltersSettingsEntry) {
        currentLastFiltersSettingsEntry.groupMetric.add(metric);
        currentLastFiltersSettingsEntry.metrics.push({
          ...baseFilterSettings,
          ...filterSettings
        });
      }
    }

    if (isLast) {
      const lastFiltersSettingsEntry = filtersSettings?.[filtersSettings.length - 1]?.settings;
      lastFiltersSettingsEntry.groupMetric = Array.from(lastFiltersSettingsEntry?.groupMetric).sort();

      if (lastFiltersSettingsEntry.isMultiMetric) {
        lastFiltersSettingsEntry.stringId = `${lastFiltersSettingsEntry.groupMetric.join('_')}_${
          lastFiltersSettingsEntry.productId
        }`;
      }
    }
  };

  filters.forEach(({ filters: groupedMetrics, settings: groupedMetricsSettings, ...remainingSettings }) => {
    if (Array.isArray(groupedMetrics)) {
      groupedMetrics.forEach((metricFilter, index) => {
        filter({
          ...remainingSettings,
          ...metricFilter,
          settings: {
            ...graphCardSettings,
            ...remainingSettings,
            ...groupedMetricsSettings,
            ...metricFilter,
            isFirst: index === 0,
            isLast: groupedMetrics.length - 1 === index,
            isMultiMetric: groupedMetrics.length > 1
          }
        });
      });
      return;
    }

    filter({
      ...remainingSettings,
      settings: {
        ...graphCardSettings,
        ...remainingSettings,
        isFirst: true,
        isLast: true,
        isMultiMetric: false
      }
    });
  });

  return {
    filtersSettings
  };
};

/**
 * Returns x-axis ticks/intervals array for the xAxisTickInterval
 *
 * @param {string} granularity See enum of RHSM_API_QUERY_GRANULARITY_TYPES
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
 * Return a formatted date string.
 *
 * @param {object} params
 * @param {Date} params.date
 * @param {string} params.granularity See enum of RHSM_API_QUERY_GRANULARITY_TYPES
 * @returns {string}
 */
const getTooltipDate = ({ date, granularity } = {}) => {
  const momentDate = moment.utc(date);

  switch (granularity) {
    case GRANULARITY_TYPES.QUARTERLY:
      return `${momentDate.format(dateHelpers.timestampQuarterFormats.yearShort)} - ${momentDate
        .add(1, 'quarter')
        .format(dateHelpers.timestampQuarterFormats.yearShort)}`;

    case GRANULARITY_TYPES.MONTHLY:
      return momentDate.format(dateHelpers.timestampMonthFormats.yearLong);

    case GRANULARITY_TYPES.WEEKLY:
      return `${momentDate.format(dateHelpers.timestampDayFormats.short)} - ${momentDate
        .add(1, 'week')
        .format(dateHelpers.timestampDayFormats.yearShort)}`;

    case GRANULARITY_TYPES.DAILY:
    default:
      return momentDate.format(dateHelpers.timestampDayFormats.long);
  }
};

/**
 * Format x-axis ticks.
 *
 * @param {object} params
 * @param {Function} params.callback
 * @param {Date} params.date
 * @param {string} params.granularity See enum of RHSM_API_QUERY_GRANULARITY_TYPES
 * @param {number|string} params.tick
 * @param {Date} params.previousDate
 * @returns {string|undefined}
 */
const xAxisTickFormat = ({ callback, date, granularity, tick, previousDate } = {}) => {
  if (!date || !granularity) {
    return undefined;
  }

  if (typeof callback === 'function') {
    return callback({ callback, date, granularity, tick, previousDate });
  }

  const momentDate = moment.utc(date);
  const isNewYear =
    tick !== 0 && Number.parseInt(momentDate.year(), 10) !== Number.parseInt(moment.utc(previousDate).year(), 10);
  let formattedDate;

  switch (granularity) {
    case GRANULARITY_TYPES.QUARTERLY:
      formattedDate = isNewYear
        ? momentDate.format(dateHelpers.timestampQuarterFormats.yearShort)
        : momentDate.format(dateHelpers.timestampQuarterFormats.short);

      formattedDate = formattedDate.replace(/\s/, '\n');
      break;
    case GRANULARITY_TYPES.MONTHLY:
      formattedDate = isNewYear
        ? momentDate.format(dateHelpers.timestampMonthFormats.yearShort)
        : momentDate.format(dateHelpers.timestampMonthFormats.short);

      formattedDate = formattedDate.replace(/\s/, '\n');
      break;
    case GRANULARITY_TYPES.WEEKLY:
    case GRANULARITY_TYPES.DAILY:
    default:
      formattedDate = isNewYear
        ? momentDate.format(dateHelpers.timestampDayFormats.yearShort)
        : momentDate.format(dateHelpers.timestampDayFormats.short);

      formattedDate = formattedDate.replace(/\s(\d{4})$/, '\n$1');
      break;
  }

  return formattedDate;
};

/**
 * Format y-axis ticks.
 *
 * @param {object} params
 * @param {Function} params.callback
 * @param {number|string} params.tick
 * @returns {string}
 */
const yAxisTickFormat = ({ callback, tick } = {}) => {
  if (typeof callback === 'function') {
    return callback({ tick });
  }

  return helpers
    .numberDisplay(tick)
    ?.format({
      average: true,
      mantissa: 1,
      trimMantissa: true,
      lowPrecision: false
    })
    ?.toUpperCase();
};

/**
 * Generate base chart component props.
 *
 * @param {object} params
 * @param {object} params.settings
 * @param {string} params.granularity
 * @returns {object}
 */
const generateExtendedChartSettings = ({ settings, granularity } = {}) => ({
  ...settings,
  xAxisLabelIncrement: settings?.xAxisLabelIncrement ?? getChartXAxisLabelIncrement(granularity),
  xAxisTickFormat: ({ item, previousItem, tick }) =>
    xAxisTickFormat({
      callback: settings?.xAxisTickFormat,
      tick,
      date: item.date,
      previousDate: previousItem.date,
      granularity
    }),
  yAxisTickFormat: ({ tick }) =>
    yAxisTickFormat({
      callback: settings?.yAxisTickFormat,
      tick
    })
});

/**
 * Get either the current or last date available data.
 *
 * @param {object} params
 * @param {Array<object|Array>} params.data
 * @param {boolean} params.isCurrent
 * @returns {{date: string, hasData: boolean, value: number}}
 */
const getMetricTotalCurrentOrLastData = helpers.memo(
  // ({ data, isCurrent = false } = {}) => {
  ({ data } = {}) => {
    const isMultipleDataSets = data.filter(chartData => Array.isArray(chartData)).length > 0;
    const updatedDataSets = (isMultipleDataSets && data) || [data];
    // console.log('>>>>>>', isMultipleDataResponses, data);
    /*
     *const {
     *  date: currentDate,
     *  hasData: currentHasData,
     *  y: currentValue
     *} = data.find(({ isCurrentDate }) => isCurrentDate === true) || {};
     *const { date: lastDate, hasData: lastHasData, y: lastValue } = data[data.length - 1] || {};
     *
     *const date = isCurrent ? currentDate : lastDate;
     *const hasData = isCurrent ? currentHasData : lastHasData;
     *const value = isCurrent ? currentValue : lastValue;
     */

    const totals = {
      date: new Set(),
      hasData: [],
      value: undefined
    };

    console.log('>>> getMetricTotalCurrentOrLastData 001', updatedDataSets);

    updatedDataSets.forEach(dataSet => {
      const currentData = dataSet.find(({ isCurrentDate }) => isCurrentDate === true);
      const isCurrentData = currentData !== undefined;
      const { date: lastDate, hasData: lastHasData, y: lastValue } = dataSet[dataSet.length - 1] || {};

      console.log('>>>>>>> getMetricTotalCurrentOrLastData INTERNAL', currentData);

      const date = isCurrentData ? currentData.date : lastDate;
      const hasData = isCurrentData ? currentData.hasData : lastHasData;
      const value = isCurrentData ? currentData.y : lastValue;

      totals.date.add(date);
      totals.hasData.push(hasData);

      if (!totals.value) {
        if (updatedDataSets.length > 1) {
          totals.value = value || 0;
        } else {
          totals.value = value;
        }
      } else {
        totals.value += value || 0;
      }
    });

    if (Array.from(totals.date).length > 1) {
      return {
        date: undefined,
        hasData: undefined,
        value: undefined
      };
    }

    console.log('>>> getMetricTotalCurrentOrLastData 002', Array.from(totals.date), totals.hasData, totals.value);

    return {
      date: Array.from(totals.date)[0],
      hasData: totals.hasData.filter(value => value === true).length > 0,
      value: totals.value
    };
  },
  { cacheLimit: 5 }
);

/**
 * Get daily and monthly totals from a data set. A metric totals helper.
 *
 * @param {object} params
 * @param {object} params.dataSet
 * @param {boolean} params.isCurrent Is the current value the "current month". A proxy value passed through
 *     "graphCardMetricTotals"
 * @returns {{chartId: string, metricId: string, monthlyHasData: boolean, dailyValue: number, dailyDate: string,
 *     monthlyValue: number, monthlyDate: string, dailyHasData: boolean}}
 */
const getDailyMonthlyTotals = helpers.memo(
  ({ dataSet, isCurrent = false } = {}) => {
    const { data = [], meta = {} } = dataSet || {};
    const {
      totalMonthlyDate: monthlyDate,
      totalMonthlyHasData: monthlyHasData,
      totalMonthlyValue: monthlyValue
    } = meta;

    const {
      date: dailyDate,
      hasData: dailyHasData,
      value: dailyValue
    } = getMetricTotalCurrentOrLastData({ data, isCurrent });

    return {
      dailyDate,
      dailyHasData,
      dailyValue,
      monthlyDate,
      monthlyHasData,
      monthlyValue
    };
  },
  { cacheLimit: 5 }
);

/**
 * Get the first available prepaid Tally, Capacity data sets
 *
 * @param {object} params
 * @param {Array} params.data
 * @returns {{capacityData: object, tallyData: object}}
 */
const getPrepaidTallyCapacity = helpers.memo(
  ({ data = [] } = {}) => {
    console.log('>>> prepaid pre, data', data);
    return {
      capacityData: data.find(({ chartType }) => new RegExp(ChartTypeVariant.threshold, 'i').test(chartType))?.data,
      tallyData: data.find(({ id }) => new RegExp(CATEGORY_TYPES.PREPAID, 'i').test(id))?.data
    };
  },
  { cacheLimit: 3 }
);

/*
 *const getSortedTallyCapacity = helpers.memo(
 *  ({ data = [] } = {}) => ({
 *    capacityData: data.filter(({ chartType }) => new RegExp(ChartTypeVariant.threshold, 'i').test(chartType)),
 *    tallyData: data.filter(({ chartType }) => !new RegExp(ChartTypeVariant.threshold, 'i').test(chartType))
 *  }),
 *  { cacheLimit: 5 }
 *);
 */

/**
 * Breakout data into Capacity, Tally groups for future consumption. Assume a single Capacity data set and
 * multiple Tally data sets.
 *
 * @param {object} params
 * @param {Array} params.data
 * @returns {{capacityData: object, tallyData: object}}
 */
const groupTallyCapacityData = helpers.memo(
  ({ data = {}, allData = [] } = {}) => {
    const updatedData = { capacityData: undefined, tallyData: undefined, allTallyData: undefined };
    const isDataCapacityData = new RegExp(ChartTypeVariant.threshold, 'i').test(data.chartType);

    updatedData.allTallyData = allData
      .filter(({ chartType }) => !new RegExp(ChartTypeVariant.threshold, 'i').test(chartType))
      .map(({ data: chartData }) => chartData);

    if (isDataCapacityData) {
      updatedData.capacityData = data?.data;
      updatedData.tallyData = updatedData.allTallyData;
    } else {
      updatedData.capacityData = allData.find(({ chartType }) =>
        new RegExp(ChartTypeVariant.threshold, 'i').test(chartType)
      )?.data;
      updatedData.tallyData = data?.data;
    }

    return updatedData;
    /*
     * capacityData: data.filter(({ chartType }) => new RegExp(ChartTypeVariant.threshold, 'i').test(chartType)),
     * tallyData: data.filter(({ chartType }) => !new RegExp(ChartTypeVariant.threshold, 'i').test(chartType))
     * };
     */
  },
  { cacheLimit: 5 }
);

/**
 * Get a remaining capacity from data sets. A metric totals helper.
 *
 * @param {object} params
 * @param {Array} params.capacityData
 * @param {Array} params.tallyData
 * @param {boolean} params.isCurrent Is the current value the "current month". A proxy value passed
 *     through "graphCardMetricTotals"
 * @returns {{remainingCapacityHasData: boolean, remainingCapacity: number}}
 */
const getRemainingCapacity = helpers.memo(
  ({ allTallyData = [], capacityData = [], tallyData = [] } = {}) => {
    /*
     * const isMultipleTallyDataResponses = tallyData.filter(({ chartType }) => typeof chartType === 'string').length >
     * 0;
     */
    console.log('>>>> REMAINING CAPACITY', capacityData, tallyData);

    const { hasData: allTallyHasData, value: allTallyValue } = getMetricTotalCurrentOrLastData({
      data: allTallyData
    });
    const { hasData: capacityHasData, value: capacityValue } = getMetricTotalCurrentOrLastData({
      data: capacityData
    });
    const { hasData: tallyHasData, value: tallyValue } = getMetricTotalCurrentOrLastData({
      data: tallyData
    });

    console.log('>>> REMAINING CAPACITY 002', capacityHasData, capacityValue);
    console.log('>>> REMAINING CAPACITY 003', tallyHasData, tallyValue);

    const response = {
      globalRemainingCapacityHasData: capacityHasData && allTallyHasData,
      globalRemainingCapacity: null,
      remainingCapacityHasData: capacityHasData && tallyHasData,
      remainingCapacity: null
    };

    if (response.globalRemainingCapacityHasData) {
      response.globalRemainingCapacity = Number.parseInt(capacityValue, 10) - Number.parseInt(allTallyValue, 10) || 0;

      if (!(response.globalRemainingCapacity >= 0)) {
        response.globalRemainingCapacity = 0;
      }
    }

    if (response.remainingCapacityHasData) {
      response.remainingCapacity = Number.parseInt(capacityValue, 10) - Number.parseInt(tallyValue, 10) || 0;

      if (!(response.remainingCapacity >= 0)) {
        response.remainingCapacity = 0;
      }
    }

    return response;
  },
  { cacheLimit: 5 }
);

/**
 * Get a remaining overage from data sets. A metric totals helper.
 *
 * @param {object} params
 * @param {Array} params.capacityData
 * @param {Array} params.tallyData
 * @param {boolean} params.isCurrent Is the current value the "current month". A proxy value passed through
 *     "graphCardMetricTotals"
 * @returns {{remainingOverage: number, remainingOverageHasData: boolean}}
 */
const getRemainingOverage = helpers.memo(
  ({ capacityData = [], tallyData = [], isCurrent = false } = {}) => {
    const { hasData: capacityHasData, value: capacityValue } = getMetricTotalCurrentOrLastData({
      data: capacityData,
      isCurrent
    });
    const { hasData: tallyHasData, value: tallyValue } = getMetricTotalCurrentOrLastData({
      data: tallyData,
      isCurrent
    });
    const response = {
      remainingOverageHasData: capacityHasData && tallyHasData,
      remainingOverage: null
    };

    if (response.remainingOverageHasData) {
      response.remainingOverage = Number.parseInt(tallyValue, 10) - Number.parseInt(capacityValue, 10) || 0;

      if (!(response.remainingOverage >= 0)) {
        response.remainingOverage = 0;
      }
    }

    return response;
  },
  { cacheLimit: 5 }
);

const graphCardHelpers = {
  generateChartIds,
  generateChartSettings,
  generateExtendedChartSettings,
  generateIsToolbarFilter,
  getChartXAxisLabelIncrement,
  getDailyMonthlyTotals,
  getMetricTotalCurrentOrLastData,
  getPrepaidTallyCapacity,
  getRemainingCapacity,
  getRemainingOverage,
  getTooltipDate,
  groupTallyCapacityData,
  xAxisTickFormat,
  yAxisTickFormat
};

export {
  graphCardHelpers as default,
  graphCardHelpers,
  generateChartIds,
  generateChartSettings,
  generateExtendedChartSettings,
  generateIsToolbarFilter,
  getChartXAxisLabelIncrement,
  getDailyMonthlyTotals,
  getMetricTotalCurrentOrLastData,
  getPrepaidTallyCapacity,
  getRemainingCapacity,
  getRemainingOverage,
  getTooltipDate,
  groupTallyCapacityData,
  xAxisTickFormat,
  yAxisTickFormat
};
