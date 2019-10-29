import numbro from 'numbro';
import { translate } from '../i18n/i18n';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../../types/rhelApiTypes';

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

const yAxisTickFormat = tick => numbro(tick).format({ average: true, mantissa: 1, optionalMantissa: true });

const rhelGraphCardHelpers = {
  getChartXAxisLabelIncrement,
  getGraphLabels,
  getGranularityDateType,
  yAxisTickFormat
};

export {
  rhelGraphCardHelpers as default,
  rhelGraphCardHelpers,
  getChartXAxisLabelIncrement,
  getGraphLabels,
  getGranularityDateType,
  yAxisTickFormat
};
