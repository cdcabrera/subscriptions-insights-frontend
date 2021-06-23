import React from 'react';
import PropTypes from 'prop-types';
import {
  // VictoryChart as Chart,
  // VictoryAxis as ChartAxis,
  VictoryLine as ChartLine,
  VictoryStack as ChartStack,
  // VictoryArea as ChartArea,
  VictoryTooltip as ChartCursorTooltip
} from 'victory';
import { createContainer } from 'victory-create-container';
import {
  Chart,
  ChartArea,
  ChartAxis,
  ChartContainer,
  // ChartCursorTooltip,
  // ChartLine,
  // ChartStack,
  ChartThreshold
} from '@patternfly/react-charts';
// import { useMount } from 'react-use';
import { useGetChartContext } from './chartContext';
import { ChartTooltip } from './chartTooltip';
import { helpers } from '../../common';

/**
 * Generate a compatible Victory chart element/facet component.
 *
 * @param {object} props
 * @param {object} props.chartTypeDefaults
 * @returns {Node}
 */
const ChartElements = ({ chartTypeDefaults }) => {
  const { chartSettings = {}, chartContainerRef = helpers.noop, chartTooltipRef = helpers.noop } = useGetChartContext();
  const {
    chartDomain,
    chartElementsProps,
    chartWidth,
    hasData,
    padding,
    themeColor,
    xAxisProps,
    yAxisProps
  } = chartSettings;

  let containerComponent = <ChartContainer />;
  let yAxis = null;
  let chartElements = null;
  let stackedChartElements = null;

  if (hasData) {
    const VictoryVoronoiCursorContainer = createContainer('voronoi', 'cursor');
    const TooltipLabelComponent = ChartTooltip({ chartSettings, chartContainerRef, chartTooltipRef });

    containerComponent = (
      <VictoryVoronoiCursorContainer
        cursorDimension="x"
        labels={obj => obj}
        labelComponent={
          <ChartCursorTooltip
            dx={0}
            dy={0}
            centerOffset={{ x: 0, y: 0 }}
            flyoutStyle={{ fill: 'transparent', stroke: 'transparent' }}
            labelComponent={<TooltipLabelComponent />}
          />
        }
        voronoiPadding={50}
        mouseFollowTooltips
      />
    );
  }

  if (Array.isArray(yAxisProps)) {
    yAxis = yAxisProps.map(axisProps => (
      <ChartAxis key={`yaxis-${axisProps.orientation}`} {...axisProps} animate={false} />
    ));
  }

  const setChartElement = ({ chartType, props }) => {
    const { component: Component, ...defaultProps } = chartTypeDefaults[chartType] || chartTypeDefaults.area;
    return <Component {...{ ...defaultProps, ...props }} />;
  };

  chartElements = chartElementsProps?.elements.map(setChartElement);
  stackedChartElements = chartElementsProps?.stackedElements.reverse().map(setChartElement);

  return (
    <Chart
      animate={{ duration: 0 }}
      width={chartWidth}
      themeColor={themeColor}
      {...{ padding, containerComponent, ...chartDomain }}
    >
      <ChartAxis {...xAxisProps} animate={false} />
      {yAxis}
      {chartElements}
      <ChartStack>{stackedChartElements}</ChartStack>
    </Chart>
  );
};

ChartElements.propTypes = {
  chartTypeDefaults: PropTypes.objectOf(
    PropTypes.shape({
      component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
      animate: PropTypes.bool,
      interpolation: PropTypes.oneOf(['monotoneX', 'step'])
    })
  ),
  isMultiYAxis: PropTypes.bool,
  maxX: PropTypes.number,
  maxY: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  xValueFormat: PropTypes.func,
  yValueFormat: PropTypes.func
};

ChartElements.defaultProps = {
  chartTypeDefaults: {
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

export { ChartElements as default, ChartElements };
