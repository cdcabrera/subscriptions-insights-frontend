import numbro from 'numbro';

window.numbro = numbro;

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
    let dataSetMaxY = 0;

    if (Array.isArray(data)) {
      combinedDataSetMaxX = data.length > combinedDataSetMaxX ? data.length : combinedDataSetMaxX;

      dataSetMaxY = Math.max(...data.map(value => value?.y ?? 0));
      combinedDataSetsMaxY = dataSetMaxY > combinedDataSetsMaxY ? dataSetMaxY : combinedDataSetsMaxY;
    }

    if (id) {
      // individualDataSetsMaxY.push(dataSetMaxY); // note: may still need to include stacked y axis in here
      individualDataSetsMaxY[id] = dataSetMaxY;
      // individualDataSetsMaxY[id] = combinedDataSetsMaxY;
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
 * @param {number|object} params.maxY
 * @returns {{ domain: { y: Array } }}
 */
// const generateDomains = ({ dataSets = [], maxY } = {}) => {
const generateDomains = ({ maxY } = {}) => {
  const updatedChartDomain = {};
  const generatedDomain = {};

  // if (!isXAxisTicks) {
  //  generatedDomain.x = [0, maxX || 10];
  // }

  if (Object.values(maxY).length) {
    /*
    const tempMap = Object.values(maxY).map(value =>
      Number.parseFloat(
        numbro(value ?? 0).format({ average: true, mantissa: 2, trimMantissa: true, lowPrecision: false })
      )
    );
    */
    /*
    const tempMap = Object.values(maxY).map(value => {
      // const floored = Math.pow(2.5, Math.floor(Math.log10(value)));
      // return Math.ceil((value + 1) / floored) * floored;
      // return Math.ceil(((value > 1 && value - 1) || value) / floored) * floored;
      const floored = Math.pow(10, Math.floor(Math.log10(value))) || 1;
      // return Math.ceil(value / floored) * floored;
      // return Math.ceil(((value > 1 && value - 1) || value + 1) / floored) * floored; ... mostly works seems may be a scenario
      // produces smaller results ... return Math.ceil((value + 1) / floored) * floored;
      // return Math.ceil(((value > 1 && value) || value + 1) / floored) * floored;
      // return Math.ceil(floored);
      return floored + 1;
    });

    let tempMax = Math.max(...tempMap);
    tempMax = Number.parseFloat(
      numbro(tempMax).format({ average: true, mantissa: 2, trimMantissa: true, lowPrecision: false })
      // numbro(tempMax).format({ average: true, lowPrecision: false })
    );
    */
    //
    // const tempMap = Object.values(maxY).map(value => {
    // console.log('TEMP');
    // const floored = Math.pow(2.5, Math.floor(Math.log10(value)));
    // return Math.ceil((value + 1) / floored) * floored;
    // return Math.ceil(((value > 1 && value - 1) || value) / floored) * floored;
    // WORKS const floored = Math.pow(1, Math.floor(Math.log10(value))) || 1;
    // const floored = Math.pow(2, Math.floor(Math.log10(value))) || 2;
    // return Math.ceil(Math.log10(value || 1));
    // return Math.floor(Math.log10(value || 1)) * 0.75;
    // EHHHH, return Math.floor(Math.log10(value || 1) * 0.75);
    // return Math.ceil(value / floored) * floored;
    // return Math.ceil(((value > 1 && value - 1) || value + 1) / floored) * floored; ... mostly works seems may be a scenario
    // produces smaller results ... return Math.ceil((value + 1) / floored) * floored;
    // return Math.ceil(((value > 1 && value) || value + 1) / floored) * floored;
    // return Math.ceil(floored);
    // return floored + 0.25;
    // return Math.ceil(Math.log10(value || 1));
    // const floored = Math.floor(Math.log10(value || 1));
    // generatedDomain.y = [0, floored + 1];
    // borked generatedDomain.y = [0, Math.ceil((floored + 1) * 2)];
    //  return floored;
    // });
    //
    // const tempMax = Math.max(...tempMap);
    //
    // console.log('>>> tempMax', tempMap, tempMax, maxY);

    // generatedDomain.y = [0, 1.25 || tempMax]; // oddly 1.5 seems to just work hardcoded
    generatedDomain.y = [0, 1.25];
  } else {
    // const floored = Math.pow(10, Math.floor(Math.log10((maxY > 10 && maxY) || 10)));
    // const floored = Math.pow(10, Math.floor(Math.log10(maxY))) || 10;
    // generatedDomain.y = [0, Math.ceil((maxY + 1) / floored) * floored]; // look at consolidating this with the multi-axis formula
    const floored = Math.pow(10, Math.floor(Math.log10(maxY || 10)));
    // generatedDomain.y = [0, floored + 1];
    // borked generatedDomain.y = [0, Math.ceil((floored + 1) * 2)];
    generatedDomain.y = [0, Math.ceil((maxY + 1) / floored) * floored];
  }

  /*
  if (typeof maxY === 'number') {
    const floored = Math.pow(10, Math.floor(Math.log10((maxY > 10 && maxY) || 10)));
    generatedDomain.y = [0, Math.ceil((maxY + 1) / floored) * floored];
  } else {
    const tempMap = Object.values(maxY).map(value =>
      numbro(value ?? 0).format({ average: true, mantissa: 2, trimMantissa: true, lowPrecision: false })
    );
    const tempMax = Math.max(...tempMap);

    console.log('>>> tempMax', tempMap, tempMax);

    generatedDomain.y = [0, tempMax];

    // .forEach(([key, value]) => {
    // });
  }
  */

  /*
  const multipleYAxes = dataSets.filter(({ yAxisUseDataSet }) => yAxisUseDataSet === true);
  // numbro(maxY).format({ average: true, mantissa: 2, trimMantissa: true, lowPrecision: false })
  // then parseFloat then take the larger value and use that as the max
  if (multipleYAxes.length > 1) {
    generatedDomain.y = [0, 1.5];
  } else {
    const floored = Math.pow(10, Math.floor(Math.log10((maxY > 10 && maxY) || 10)));
    generatedDomain.y = [0, Math.ceil((maxY + 1) / floored) * floored];
  }
   */

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
  const isMultiAxis = dataSets.length > 1;
  // console.log('NORMALIZED 001 >', isMultiAxis, maxY);

  dataSets.forEach(({ data = [], id, stroke, strokeWidth }, index) => {
    const updatedAxisProps = {
      style: { axis: {}, tickLabels: {} },
      tickFormat: tick => data[tick]?.yAxisLabel || tick
    };

    if (isMultiAxis && stroke) {
      updatedAxisProps.style.axis.stroke = stroke;
      // updatedAxisProps.style.tickLabels.fill = stroke;
    }

    if (isMultiAxis && strokeWidth) {
      updatedAxisProps.style.axis.strokeWidth = strokeWidth;
    }

    if (typeof yAxisTickFormat === 'function') {
      const updatedMaxY = (typeof maxY === 'number' && maxY) || maxY?.[id];

      updatedAxisProps.tickFormat = tick => {
        const tickIndex = data.indexOf(tick);
        const previousItem = { ...data[tickIndex - 1] };
        const nextItem = { ...data[tickIndex + 1] };
        const item = { ...data[tick] };
        // const normalizedTick = isMultiAxis ? tick * updatedMaxY : tick;
        const normalizedTick = (isMultiAxis && tick * updatedMaxY) || tick;

        console.log('NORMALIZED 002 >', isMultiAxis, normalizedTick);

        return yAxisTickFormat({
          tick: normalizedTick,
          // tick,
          previousItem,
          item,
          nextItem,
          isMultiAxis,
          maxY: updatedMaxY
          // isMultiAxis: dataSets.length > 1,
          // maxY: (typeof maxY === 'number' && maxY) || maxY?.[id]
          // maxY: (Number.isNaN(maxY) && 1) || (typeof maxY === 'number' && maxY) || maxY?.[id]
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

  console.log('UPDATED MAX Y >>>', updatedMaxY, maxY);

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
