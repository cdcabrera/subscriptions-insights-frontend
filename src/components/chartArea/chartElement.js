import React from 'react';
import PropTypes from 'prop-types';
import { ChartThreshold } from '@patternfly/react-charts';
import { VictoryLine as ChartLine, VictoryArea as ChartArea } from 'victory';

/**
 * FixMe: Victory charts makes writing wrapper components frustrating.
 * This is still an issue, https://github.com/FormidableLabs/victory/issues/804
 */
/**
 * Generate a compatible Victory chart element/facet component.
 *
 * @param {object} props
 * @param {object} props.chartDefaults
 * @param {object} props.dataSet
 * @param {boolean} props.isMultiYAxis
 * @param {number} props.maxX
 * @param {number|object} props.maxY
 * @param {Function} props.xValueFormat
 * @param {Function} props.yValueFormat
 * @returns {Node}
 */
const ChartElement = ({ chartDefaults, dataSet, isMultiYAxis, maxX, maxY, xValueFormat, yValueFormat }) => {
  const chartType = dataSet.chartType || 'area';
  const updatedChartDefaults = chartDefaults[chartType];
  const ChartComponent = updatedChartDefaults.component;
  const dataColorStroke = {
    data: {}
  };

  if (dataSet.fill && chartType === 'area') {
    dataColorStroke.data.fill = dataSet.fill;
  }

  if (dataSet.stroke) {
    dataColorStroke.data.stroke = dataSet.stroke;
  }

  if (dataSet.strokeWidth) {
    dataColorStroke.data.strokeWidth = dataSet.strokeWidth;
  }

  if (dataSet.strokeDasharray) {
    dataColorStroke.data.strokeDasharray = dataSet.strokeDasharray;
  }

  return (
    <ChartComponent
      animate={dataSet.animate || updatedChartDefaults.animate}
      interpolation={dataSet.interpolation || updatedChartDefaults.interpolation}
      key={`chart-${dataSet.id}-${chartType}`}
      name={`chart-${dataSet.id}-${chartType}`}
      data={dataSet.data}
      style={{ ...(dataSet.style || {}), ...dataColorStroke }}
      themeColor={dataSet.themeColor}
      themeVariant={dataSet.themeVariant}
      x={(xValueFormat && (datum => xValueFormat({ datum, maxX }))) || undefined}
      y={
        (yValueFormat &&
          (datum =>
            yValueFormat({
              datum,
              isMultiAxis: isMultiYAxis,
              maxY: (typeof maxY === 'number' && maxY) || maxY?.[dataSet.id]
            }))) ||
        undefined
      }
    />
  );
};

ChartElement.propTypes = {
  chartDefaults: PropTypes.objectOf(
    PropTypes.shape({
      component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
      animate: PropTypes.bool,
      interpolation: PropTypes.oneOf(['monotoneX', 'step'])
    })
  ),
  dataSet: PropTypes.shape({
    animate: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    chartType: PropTypes.oneOf(['area', 'line', 'threshold']),
    data: PropTypes.array,
    id: PropTypes.string.isRequired,
    interpolation: PropTypes.string,
    fill: PropTypes.string,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    strokeDasharray: PropTypes.string,
    style: PropTypes.object,
    themeColor: PropTypes.string,
    themeVariant: PropTypes.string
  }).isRequired,
  isMultiYAxis: PropTypes.bool,
  maxX: PropTypes.number,
  maxY: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  xValueFormat: PropTypes.func,
  yValueFormat: PropTypes.func
};

ChartElement.defaultProps = {
  chartDefaults: {
    area: {
      component: ChartArea,
      animate: false,
      interpolation: 'monotoneX'
    },
    line: {
      component: ChartLine,
      animate: false,
      interpolation: 'monotoneX'
    },
    threshold: {
      component: ChartThreshold,
      animate: false,
      interpolation: 'step'
    }
  },
  isMultiYAxis: false,
  maxX: undefined,
  maxY: undefined,
  xValueFormat: null,
  yValueFormat: null
};

export { ChartElement as default, ChartElement };
