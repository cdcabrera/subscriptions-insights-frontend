import React from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import { helpers } from '../../common';

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
      individualDataSetsMaxY[id] = dataSetMaxY;
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
const generateDomains = ({ maxY } = {}) => {
  const updatedChartDomain = {};
  const generatedDomain = {};

  if (Object.values(maxY).length) {
    generatedDomain.y = [0, 1.25];
  } else {
    const floored = Math.pow(10, Math.floor(Math.log10(maxY || 10)));
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
 * Preprocess datasets for tooltips.
 *
 * @param {object} params
 * @param {Node|Function} params.content
 * @param {Array} params.dataSets
 * @returns {{}}
 */
const generateTooltipData = ({ content = helpers.noop, dataSets = [] } = {}) => {
  const tooltipDataSetLookUp = {};

  if (content && dataSets?.[0].data) {
    dataSets[0].data.forEach((dataSet, index) => {
      const itemsByKey = {};

      dataSets.forEach(data => {
        if (data?.data[index]) {
          itemsByKey[data.id] = {
            color: data.stroke || data.fill || data.color || '',
            data: _cloneDeep(data.data[index])
          };
        }
      });

      const mockDatum = {
        datum: { x: dataSet.x, y: dataSet.y, index, itemsByKey }
      };

      tooltipDataSetLookUp[dataSet.x] = {
        x: dataSet.x,
        y: null,
        itemsByKey,
        tooltip:
          (React.isValidElement(content) && React.cloneElement(content, { ...mockDatum })) || content({ ...mockDatum })
      };
    });
  }

  return tooltipDataSetLookUp;
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
        const normalizedTick = (isMultiAxis && tick * updatedMaxY) || tick;

        return yAxisTickFormat({
          tick: normalizedTick,
          previousItem,
          item,
          nextItem,
          isMultiAxis,
          maxY: updatedMaxY
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
  generateTooltipData,
  generateXAxisProps,
  generateYAxisProps
};

export {
  chartHelpers as default,
  chartHelpers,
  generateAxisProps,
  generateDomains,
  generateMaxXY,
  generateTooltipData,
  generateXAxisProps,
  generateYAxisProps
};
