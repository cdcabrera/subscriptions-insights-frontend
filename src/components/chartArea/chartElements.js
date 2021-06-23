import React from 'react';
import PropTypes from 'prop-types';
import { VictoryStack as ChartStack, VictoryTooltip as ChartCursorTooltip } from 'victory';
import { createContainer } from 'victory-create-container';
import { Chart, ChartArea, ChartAxis, ChartContainer, ChartLine, ChartThreshold } from '@patternfly/react-charts';
import { useGetChartContext } from './chartContext';
import { chartTooltip } from './chartTooltip';

/**
 * Generate a compatible Victory chart element/facet component.
 *
 * @param {object} props
 * @param {object} props.chartTypeDefaults
 * @returns {Node}
 */
const ChartElements = ({ chartTypeDefaults }) => {
  const { chartSettings = {}, chartContainerRef, chartTooltipRef } = useGetChartContext();
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
  let chartElements = [];
  let stackedChartElements = [];

  if (hasData) {
    const VictoryVoronoiCursorContainer = createContainer('voronoi', 'cursor');
    const TooltipLabelComponent = chartTooltip({ chartSettings, chartContainerRef, chartTooltipRef });

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
  stackedChartElements = chartElementsProps?.stackedElements.map(setChartElement);

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
  )
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
  }
};

export { ChartElements as default, ChartElements };
