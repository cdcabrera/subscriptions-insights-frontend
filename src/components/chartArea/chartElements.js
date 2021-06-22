import React from 'react';
import {
  Chart,
  ChartArea,
  ChartAxis,
  ChartContainer,
  ChartLine,
  ChartStack,
  ChartThreshold
} from '@patternfly/react-charts';
import { createContainer } from 'victory-create-container';
import PropTypes from 'prop-types';
import { useGetChartContext } from './chartContext';
// import { ChartTooltip } from './chartTooltip';
// import { useResizeObserver } from '../../hooks/useWindow';

/**
 * Generate a compatible Victory chart element/facet component.
 *
 * @param {object} props
 * @param {object} props.chartTypeDefaults
 * @returns {Node}
 */
const ChartElements = ({ chartTypeDefaults }) => {
  // const [{ chartSettings = {}, chartContainerRef }, bob] = useChartSettings();
  // console.log('>>>', chartSettings, chartContainerRef, bob);
  // const [{ chartSettings = {} }] = useChartSettings();
  // const { width: chartWidth } = useResizeObserver(chartContainerRef);
  // const what = useContext(ChartContext);
  const { chartSettings = {} } = useGetChartContext();
  console.log('WHAT >>>', chartSettings);
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
  console.log('chartElementsProps >>>', chartElementsProps);

  let containerComponent = <ChartContainer />;

  if (hasData) {
    const VictoryVoronoiCursorContainer = createContainer('voronoi', 'cursor');

    containerComponent = (
      <VictoryVoronoiCursorContainer
        cursorDimension="x"
        labels={obj => obj}
        // labelComponent={<ChartTooltip />}
        voronoiPadding={50}
        mouseFollowTooltips
      />
    );
  }

  let yAxis = null;

  if (Array.isArray(yAxisProps)) {
    yAxis = yAxisProps.map(axisProps => (
      <ChartAxis key={`yaxis-${axisProps.orientation}`} {...axisProps} animate={false} />
    ));
  }

  const setChartElement = ({ chartType, props }) => {
    const { component: Component, ...defaultProps } = chartTypeDefaults[chartType] || chartTypeDefaults.area;
    return <Component {...{ ...defaultProps, ...props }} />;
  };

  return (
    <Chart
      animate={{ duration: 0 }}
      width={chartWidth}
      themeColor={themeColor}
      // {...{ padding, ...chartDomain, ...tooltipComponent }}
      {...{ padding, containerComponent, ...chartDomain }}
    >
      <ChartAxis {...xAxisProps} animate={false} />
      {yAxis}
      {chartElementsProps?.elements.map(setChartElement)}
      <ChartStack>{chartElementsProps?.stackedElements.reverse().map(setChartElement)}</ChartStack>
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
