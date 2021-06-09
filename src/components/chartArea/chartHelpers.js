/**
 * Generate max X and Y values from datasets.
 *
 * @param {object} params
 * @param {Array} params.dataSets
 * @returns {{individualMaxY: object, maxY: number, maxX: number}}
 */
const generateMaxXY = ({ dataSets = [] } = {}) => {
  const individualDataSetsMaxY = {};
  let combinedDataSetMaxX = 0;
  let combinedDataSetsMaxY = 0;

  dataSets
    .filter(({ isStacked }) => isStacked === true)
    .forEach(({ data }) => {
      if (Array.isArray(data)) {
        combinedDataSetsMaxY += Math.max(...data.map(value => value?.y ?? 0));
      }
    });

  dataSets.forEach(({ id, data }) => {
    if (Array.isArray(data)) {
      combinedDataSetMaxX = data.length > combinedDataSetMaxX ? data.length : combinedDataSetMaxX;

      const dataSetMaxY = Math.max(...data.map(value => value?.y ?? 0));
      combinedDataSetsMaxY = dataSetMaxY > combinedDataSetsMaxY ? dataSetMaxY : combinedDataSetsMaxY;

      if (id) {
        // individualDataSetsMaxY.push(dataSetMaxY); // note: may still need to include stacked y axis in here
        individualDataSetsMaxY[id] = dataSetMaxY;
        // individualDataSetsMaxY[id] = combinedDataSetsMaxY;
      }
    }
  });

  return {
    maxX: combinedDataSetMaxX,
    maxY: combinedDataSetsMaxY,
    individualMaxY: individualDataSetsMaxY
  };
};

/**
 * Generate Y axis domain ranges from dataSets, ignore X axis.
 *
 * @param {object} params
 * @param {Array} params.dataSets
 * @param {number} params.maxY
 * @returns {{ domain: { y: Array } }}
 */
const generateDomains = ({ dataSets = [], maxY } = {}) => {
  const updatedChartDomain = {};
  const generatedDomain = {};

  // if (!isXAxisTicks) {
  //  generatedDomain.x = [0, maxX || 10];
  // }

  const multipleYAxes = dataSets.filter(({ yAxisUseDataSet }) => yAxisUseDataSet === true);

  if (multipleYAxes.length > 1) {
    generatedDomain.y = [0, 1];
  } else {
    const floored = Math.pow(10, Math.floor(Math.log10((maxY > 10 && maxY) || 10)));
    generatedDomain.y = [0, Math.ceil((maxY + 1) / floored) * floored];
  }

  if (Object.keys(generatedDomain).length) {
    updatedChartDomain.domain = generatedDomain;
  }

  return {
    ...updatedChartDomain
  };
};

/**
 * Generate X axis props, ticks, tick formatting.
 *
 * @param {object} params
 * @param {object} params.dataSet
 * @param {number} params.maxX
 * @param {number} params.xAxisLabelIncrement
 * @param {object} params.xAxisPropDefaults
 * @param {Function} params.xAxisTickFormat
 * @returns {{tickFormat: (function(*)), tickValues: *}}
 */
const generateXAxisProps = ({
  dataSet = {},
  maxX,
  xAxisLabelIncrement,
  xAxisPropDefaults = {},
  xAxisTickFormat
} = {}) => {
  const { data = [] } = dataSet;
  const axisProps = {
    ...xAxisPropDefaults,
    tickValues: data.reduce(
      (acc, current, index) => (index % xAxisLabelIncrement === 0 ? acc.concat(current.x) : acc),
      []
    ),
    tickFormat: tick => data[tick]?.xAxisLabel || tick
  };

  if (typeof xAxisTickFormat === 'function') {
    axisProps.tickFormat = tick => {
      const tickIndex = axisProps.tickValues.indexOf(tick);
      const previousItem = { ...data[axisProps.tickValues[tickIndex - 1]] };
      const nextItem = { ...data[axisProps.tickValues[tickIndex + 1]] };
      const item = { ...data[tick] };

      return xAxisTickFormat({ tick, previousItem, item, nextItem, maxX });
    };
  }

  return axisProps;
};

/**
 * Generate Y axis props, ticks, tick formatting.
 *
 * @param {object} params
 * @param {Array} params.dataSets
 * @param {number|object} params.maxY
 * @param {object} params.yAxisPropDefaults
 * @param {Function} params.yAxisTickFormat
 * @returns {Array}
 */
const generateYAxisProps = ({ dataSets = [], maxY, yAxisPropDefaults = {}, yAxisTickFormat } = {}) => {
  const axisProps = [];

  dataSets.forEach(({ data = [], id }, index) => {
    const updatedAxisProps = {
      tickFormat: tick => data[tick]?.yAxisLabel || tick
    };

    if (typeof yAxisTickFormat === 'function') {
      updatedAxisProps.tickFormat = tick => {
        const tickIndex = data.indexOf(tick);
        const previousItem = { ...data[tickIndex - 1] };
        const nextItem = { ...data[tickIndex + 1] };
        const item = { ...data[tick] };

        return yAxisTickFormat({
          tick,
          previousItem,
          item,
          nextItem,
          isMultiAxis: dataSets.length > 1,
          maxY: (typeof maxY === 'number' && maxY) || maxY?.[id]
        });
      };
    }

    axisProps.push({
      ...yAxisPropDefaults,
      ...updatedAxisProps,
      orientation: (index === 0 && 'left') || 'right'
    });
  });

  return axisProps;
};

/**
 * Generate x,y props.
 *
 * @param {object} params
 * @param {Array} params.dataSets
 * @param {object} params.individualMaxY
 * @param {number} params.maxX
 * @param {number} params.maxY
 * @param {boolean} params.xAxisFixLabelOverlap
 * @param {number} params.xAxisLabelIncrement
 * @param {Function} params.xAxisTickFormat
 * @param {Function} params.yAxisTickFormat
 * @returns {{xAxisProps: object, yAxisProps: Array}}
 */
const generateAxisProps = ({
  dataSets = [],
  individualMaxY = {},
  maxX,
  maxY,
  xAxisFixLabelOverlap = true,
  xAxisLabelIncrement = 1,
  xAxisTickFormat,
  yAxisTickFormat
} = {}) => {
  const xAxisPropDefaults = {
    fixLabelOverlap: xAxisFixLabelOverlap
  };

  const yAxisPropDefaults = {
    dependentAxis: true,
    showGrid: true
  };

  let yAxisDataSets = [];
  let xAxisDataSet;

  dataSets.forEach(dataSet => {
    if (dataSet.yAxisUseDataSet) {
      yAxisDataSets.push(dataSet);
    }
    if (dataSet.xAxisUseDataSet) {
      xAxisDataSet = dataSet;
    }
  });

  if (!yAxisDataSets.length) {
    yAxisDataSets.push(dataSets?.[0]);
  } else {
    yAxisDataSets = yAxisDataSets.slice(0, 2);
  }

  if (!xAxisDataSet) {
    xAxisDataSet = dataSets?.[0] || [];
  }

  const updatedMaxY = (yAxisDataSets.length > 1 && individualMaxY) || maxY;

  console.log('UPDATED MAX Y >>>', updatedMaxY);

  return {
    xAxisProps: generateXAxisProps({
      dataSet: xAxisDataSet,
      maxX,
      xAxisLabelIncrement,
      xAxisPropDefaults,
      xAxisTickFormat
    }),
    yAxisProps: generateYAxisProps({ dataSets: yAxisDataSets, maxY: updatedMaxY, yAxisPropDefaults, yAxisTickFormat })
  };
};

const chartHelpers = {
  generateAxisProps,
  generateDomains,
  generateMaxXY,
  generateXAxisProps,
  generateYAxisProps
};

export {
  chartHelpers as default,
  chartHelpers,
  generateAxisProps,
  generateDomains,
  generateMaxXY,
  generateXAxisProps,
  generateYAxisProps
};
