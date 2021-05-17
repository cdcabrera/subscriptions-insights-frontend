/**
 * Generate Victory charts x,y axis chart ticks.
 *
 * @param {object} params
 * @param {boolean} params.xAxisFixLabelOverlap
 * @param {number} params.xAxisLabelIncrement
 * @param {Function} params.xAxisTickFormat
 * @param {Function} params.yAxisTickFormat
 * @param {Array} params.dataSets
 * @returns {object}
 */
const generateChartTicks = ({
  xAxisFixLabelOverlap = true,
  xAxisLabelIncrement = 1,
  xAxisTickFormat,
  yAxisTickFormat,
  dataSets = []
} = {}) => {
  const xAxisPropDefaults = {
    fixLabelOverlap: xAxisFixLabelOverlap
  };
  const yAxisPropDefaults = {
    dependentAxis: true,
    showGrid: true
  };

  const xAxisProps = { ...xAxisPropDefaults };
  const yAxisProps = [];

  let xAxisDataSet = dataSets?.[0]?.data || [];
  // let yAxisDataSet = [];

  dataSets.forEach(dataSet => {
    if (dataSet.xAxisLabelUseDataSet) {
      xAxisDataSet = dataSet.data;
    }
    // if (dataSet.yAxisLabelUseDataSet) {
    //  xAxisDataSet = dataSet.data;
    // }
  });

  xAxisProps.tickValues = xAxisDataSet.reduce(
    (acc, current, index) => (index % xAxisLabelIncrement === 0 ? acc.concat(current.x) : acc),
    []
  );

  xAxisProps.tickFormat = tickValue => (xAxisDataSet[tickValue] && xAxisDataSet[tickValue].xAxisLabel) || tickValue;

  if (typeof xAxisTickFormat === 'function') {
    xAxisProps.tickFormat = tick => {
      const { tickValues } = xAxisProps;
      const tickIndex = tickValues.indexOf(tick);
      const previousItem = { ...(xAxisDataSet[tickValues[tickIndex - 1]] || {}) };
      const nextItem = { ...(xAxisDataSet[tickValues[tickIndex + 1]] || {}) };
      const item = { ...(xAxisDataSet[tick] || {}) };

      return xAxisTickFormat({ tick, previousItem, item, nextItem });
    };
  }

  const tempYAxisFormat = (typeof yAxisTickFormat === 'function' && [yAxisTickFormat]) || yAxisTickFormat || [];

  tempYAxisFormat.slice(0, 2).forEach((axisTickFormat, index) => {
    yAxisProps.push({
      ...yAxisPropDefaults,
      tickFormat: tick => axisTickFormat({ tick }),
      orientation: (index === 0 && 'left') || 'right'
    });
  });

  return {
    xAxisProps,
    yAxisProps
  };
};

/**
 * Calculate and return the x and y domain range.
 *
 * @param {object} params
 * @param {object} params.dataSetsToggle
 * @param {object|Array} params.domain
 * @param {object} params.dataSets
 * @returns {object}
 */
const generateChartDomains = ({ dataSetsToggle, domain, dataSets } = {}) => {
  const generatedDomain = {};
  const updatedChartDomain = {};

  let dataSetMaxX = 0;
  let individualDataSetsMaxY = [];
  let combinedDataSetsMaxY = 0;

  const stackedSets = dataSets.filter(set => set.isStacked === true);
  const xDomainSet = dataSets.find(set => set.isXDomain === true);
  const yDomainSets = dataSets.filter(set => set.isYDomain === true).slice(0, 2);

  stackedSets.forEach(({ data }) => {
    // if (!dataSetsToggle[dataSet.id] && dataSet.data) {
    if (data) {
      let dataSetMaxYStacked = 0;

      data.forEach((value, index) => {
        dataSetMaxYStacked = value && value.y > dataSetMaxYStacked ? value.y : dataSetMaxYStacked;

        if (index === data.length - 1) {
          combinedDataSetsMaxY += dataSetMaxYStacked;
        }
      });
    }
  });

  dataSets.forEach(({ data }) => {
    if (data) {
      let dataSetMaxY = 0;
      dataSetMaxX = data.length > dataSetMaxX ? data.length : dataSetMaxX;

      data.forEach(value => {
        combinedDataSetsMaxY = value && value.y > combinedDataSetsMaxY ? value.y : combinedDataSetsMaxY;
      });
    }
  });

  return {
    chartDomain: domain
  };


  /*
  const { dataSetsToggle } = this;
  const { domain, dataSets, yAxisTickFormat } = this.props;

  if (Object.keys(domain).length) {
    return domain;
  }

  const generatedDomain = {};
  const updatedChartDomain = {};
  let dataSetMaxX = 0;
  let dataSetMaxY = 0;

  const stackedSets = dataSets.filter(set => set.isStacked === true);

  stackedSets.forEach(dataSet => {
    if (!dataSetsToggle[dataSet.id] && dataSet.data) {
      let dataSetMaxYStacked = 0;

      dataSet.data.forEach((value, index) => {
        dataSetMaxYStacked = value && value.y > dataSetMaxYStacked ? value.y : dataSetMaxYStacked;

        if (index === dataSet.data.length - 1) {
          dataSetMaxY += dataSetMaxYStacked;
        }
      });
    }
  });

  dataSets.forEach(dataSet => {
    if (!dataSetsToggle[dataSet.id] && dataSet.data) {
      dataSetMaxX = dataSet.data.length > dataSetMaxX ? dataSet.data.length : dataSetMaxX;

      dataSet.data.forEach(value => {
        dataSetMaxY = value && value.y > dataSetMaxY ? value.y : dataSetMaxY;
      });
    }
  });

  if (!isXAxisTicks) {
    generatedDomain.x = [0, dataSetMaxX || 10];
  }

  if (Array.isArray(yAxisTickFormat) && yAxisTickFormat.length >= 2) {
    // generatedDomain.y = [0, 1];
  } else {
    const floored = Math.pow(10, Math.floor(Math.log10((dataSetMaxY > 10 && dataSetMaxY) || 10)));
    generatedDomain.y = [0, Math.ceil((dataSetMaxY + 1) / floored) * floored];
  }

  if (Object.keys(generatedDomain).length) {
    updatedChartDomain.domain = generatedDomain;
  }

  return {
    maxX: dataSetMaxX,
    maxY: dataSetMaxY,
    chartDomain: { ...updatedChartDomain }
  };
  */
};

const chartHelpers = {
  generateChartDomains,
  generateChartTicks
};

export { chartHelpers as default, chartHelpers, generateChartDomains, generateChartTicks };
