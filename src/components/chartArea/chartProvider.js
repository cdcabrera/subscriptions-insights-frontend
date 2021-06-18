/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {useMount, useUnmount} from 'react-use';
import {
  // VictoryChart as Chart,
  // VictoryAxis as ChartAxis,
  VictoryLine as ChartLine,
  VictoryStack as ChartStack,
  VictoryArea as PfChartArea,
  VictoryTooltip as ChartCursorTooltip
} from 'victory';
import { createContainer } from 'victory-create-container';
import {
  Chart as PfChart,
  ChartAxis,
  // ChartLine,
  // ChartStack,
  ChartThreshold,
  ChartThemeColor,
  ChartContainer,
  // ChartArea as PfChartArea,
  // ChartCursorFlyout,
  // ChartCursorTooltip
  ChartAxisTheme
} from '@patternfly/react-charts';
import _cloneDeep from 'lodash/cloneDeep';
import { helpers } from '../../common';
import { chartHelpers } from './chartHelpers';
import { ChartElement } from './chartElement';
import { ChartTooltip } from './chartTooltip';
import { ChartContext, useChartContext } from './chartContext';
import { useResizeObserver } from '../../hooks/useWindow';

/**
 * FixMe: chart redraw flash related to custom tooltips use
 * Removing custom tooltips corrects redraw issues. As a temporary patch, caching at the selector alleviates
 * the symptoms.
 */
/**
 * A wrapper for Patternfly and Victory charts/graphs.
 *
 * @augments React.Component
 * @fires onResizeContainer
 * @fires onHide
 * @fires onRevert
 * @fires onToggle
 */
/*
class Chart extends React.Component {
  state = { chartWidth: 0 };

  dataSetsToggle = {};

  resizeObserver = helpers.noop;

  containerRef = React.createRef();

  tooltipRef = React.createRef();

  componentDidMount() {
    this.setResizeObserve();
  }

  componentWillUnmount() {
    this.resizeObserver();
  }

  render() {
    return null;
  }
}
*/
const ChartProvider = ({ children, xAxisFixLabelOverlap, xAxisLabelIncrement, xAxisTickFormat, yAxisTickFormat, dataSets, chartTooltip }) => {
  // const [context, setContext] = useState({});
  // const [context, setContext] = useChartContext();
  const { context, callback } = useChartContext();
  // const [dataSetsToggle, setDataSetsToggle] = useState({});
  const [dataSetsToggle] = useState({});
  const containerRef = useRef(null);

  const updateChartSettings = () => {
    const toggledDataSets = dataSets.filter(({ id }) => !dataSetsToggle[id]);

    const tooltipDataSetLookUp = chartHelpers.generateTooltipData({ chartTooltip, dataSets });
    const { maxX, maxY } = chartHelpers.generateMaxXY({ dataSets: toggledDataSets });
    const { individualMaxY } = chartHelpers.generateMaxXY({ dataSets });
    const { xAxisProps, yAxisProps } = chartHelpers.generateAxisProps({
      dataSets,
      individualMaxY,
      maxX,
      maxY,
      xAxisFixLabelOverlap,
      xAxisLabelIncrement,
      xAxisTickFormat,
      yAxisTickFormat
    });

    const isMultiYAxis = yAxisProps.length > 1;
    const chartDomain = chartHelpers.generateDomains({ maxY: (isMultiYAxis && individualMaxY) || maxY });
    const hasData = !!xAxisProps.tickValues;

    return {
      chartContainer: null,
      xAxisProps,
      yAxisProps,
      chartDomain,
      hasData,
      isMultiYAxis,
      maxX,
      maxY: (isMultiYAxis && individualMaxY) || maxY,
      tooltipDataSetLookUp
    };
  };

  // const chartSettings = updateChartSettings();
  // const context = { chartContainerRef: () => containerRef, chartSettings };
  /*
  useEffect(() => {
    const chartSettings = updateChartSettings();
    console.log('PROVIDER >>>', chartSettings);

    const updatedSettings = {
      chartContainerRef: () => containerRef,
      chartSettings: {...chartSettings}
    };

    setContext(updatedSettings);
  } , [containerRef, dataSets, setContext])
  */
  /*
  useEffect(() => {
    const chartSettings = updateChartSettings();
    console.log('PROVIDER >>>', chartSettings);

    const updatedSettings = {
      chartContainerRef: () => console.log('hello world'), // containerRef,
      chartSettings: {...chartSettings}
    };

    // callback(updatedSettings);
  }, [dataSets]);
  */

  // FIXME: try passing a simple value

  return (
    <ChartContext.Provider value="hello world">
      <div
        id="curiosity-chartarea"
        className="curiosity-chartarea uxui-curiosity__modal uxui-curiosity__modal--loading"
        ref={containerRef}
      >
        {children}
      </div>
    </ChartContext.Provider>
  );
};

/**
 * Prop types.
 *
 * @type {{chartLegend: Node|Function, chartTooltip: Node|Function, padding, xAxisTickFormat: Function,
 *     themeColor: string, yAxisTickFormat: Function, domain: object|Array, dataSets: object,
 *     xAxisFixLabelOverlap: boolean, xAxisLabelIncrement: number, height: number}}
 */
ChartProvider.propTypes = {
  chartLegend: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  chartTooltip: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  children: PropTypes.node,
  dataSets: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.arrayOf(
        PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number,
          xAxisLabel: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]), // this doesn't appear to be used, remove it
          yAxisLabel: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]) // re-eval this
        })
      ),
      animate: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
      chartType: PropTypes.oneOf(['area', 'line', 'threshold']),
      fill: PropTypes.string,
      stroke: PropTypes.string,
      strokeWidth: PropTypes.number,
      strokeDasharray: PropTypes.string,
      themeColor: PropTypes.string,
      themeVariant: PropTypes.string,
      id: PropTypes.string.isRequired,
      interpolation: PropTypes.string,
      legendLabel: PropTypes.string,
      legendSymbolType: PropTypes.string,
      style: PropTypes.object,
      isStacked: PropTypes.bool,
      isThreshold: PropTypes.bool,
      // isDisplayXAxis: PropTypes.bool, // todo: convert xAxisLabelUseDataSet?
      // isDisplayYAxis: PropTypes.bool, // we can skip handling independent y axis format callbacks, stick with single
      xAxisLabelUseDataSet: PropTypes.bool,
      // yAxisTickFormat: PropTypes.func,
      xAxisUseDataSet: PropTypes.bool,
      yAxisUseDataSet: PropTypes.bool
    })
  ),
  // domain: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  // domain: PropTypes.shape({ x: PropTypes.array, y: PropTypes.array }),
  height: PropTypes.number,
  padding: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number
  }),
  themeColor: PropTypes.oneOf(Object.values(ChartThemeColor)),
  xAxisFixLabelOverlap: PropTypes.bool,
  xAxisLabelIncrement: PropTypes.number,
  xAxisTickFormat: PropTypes.func,
  // yAxisTickFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
  yAxisTickFormat: PropTypes.func,
  yAxisDisabled: PropTypes.bool, // REMOVE THIS
  xValueFormat: PropTypes.func,
  yValueFormat: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{chartLegend: null, chartTooltip: null, padding: {top: number, left: number, bottom: number,
 *     right: number}, xAxisTickFormat: null, themeColor: string, yAxisTickFormat: null, domain: object,
 *     dataSets: Array, xAxisFixLabelOverlap: boolean, xAxisLabelIncrement: number, height: number}}
 */
ChartProvider.defaultProps = {
  chartLegend: null,
  chartTooltip: null,
  children: null,
  // domain: {},
  dataSets: [],
  height: 275,
  padding: {
    bottom: 75,
    left: 50,
    right: 50,
    top: 50
  },
  themeColor: 'blue',
  xAxisFixLabelOverlap: false,
  xAxisLabelIncrement: 1,
  xAxisTickFormat: null,
  yAxisTickFormat: null,
  yAxisDisabled: false,
  xValueFormat: null,
  yValueFormat: null
};

export { ChartProvider as default, ChartProvider };
