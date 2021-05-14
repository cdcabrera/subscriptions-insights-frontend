/**
 * Generate Victory charts x,y axis chart ticks.
 *
 * @param {object} params
 * @param {number} params.xAxisLabelIncrement
 * @param {Function} params.xAxisTickFormat
 * @param {Function} params.yAxisTickFormat
 * @param {Array} params.dataSets
 * @returns {object}
 */
const generateChartTicks = ({ xAxisLabelIncrement = 1, xAxisTickFormat, yAxisTickFormat, dataSets = [] } = {}) => {
  const xAxisProps = {};
  const yAxisProps = {};
  let xAxisDataSet = dataSets?.[0]?.data || [];

  dataSets.forEach(dataSet => {
    if (dataSet.xAxisLabelUseDataSet) {
      xAxisDataSet = dataSet.data;
    }
  });

  xAxisProps.xAxisTickValues = xAxisDataSet.reduce(
    (acc, current, index) => (index % xAxisLabelIncrement === 0 ? acc.concat(current.x) : acc),
    []
  );

  xAxisProps.xAxisTickFormat = tickValue =>
    (xAxisDataSet[tickValue] && xAxisDataSet[tickValue].xAxisLabel) || tickValue;

  if (typeof xAxisTickFormat === 'function') {
    xAxisProps.xAxisTickFormat = tick => {
      const tickValues = xAxisProps.xAxisTickValues;
      const tickIndex = tickValues.indexOf(tick);
      const previousItem = { ...(xAxisDataSet[tickValues[tickIndex - 1]] || {}) };
      const nextItem = { ...(xAxisDataSet[tickValues[tickIndex + 1]] || {}) };
      const item = { ...(xAxisDataSet[tick] || {}) };

      return xAxisTickFormat({ tick, previousItem, item, nextItem });
    };
  }

  if (typeof yAxisTickFormat === 'function') {
    yAxisProps.yAxisTickFormat = tick => yAxisTickFormat({ tick });
  }

  return {
    ...xAxisProps,
    ...yAxisProps
  };
};

const chartHelpers = {
  generateChartTicks
};

export { chartHelpers as default, chartHelpers, generateChartTicks };
