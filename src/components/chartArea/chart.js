/* eslint-disable */
// import React, { useContext, useState } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import { ChartThemeColor } from '@patternfly/react-charts';
// import { useChartSettings, ChartContext } from './chartContext';
// import { ChartContext } from './chartContext';
// import { useResizeObserver } from '../../hooks/useWindow';
import { ChartProvider } from './chartProvider';
import ChartElements from "./chartElements";
import ChartLegend from "./chartLegend";
// import { ChartContext } from './chartContext';

const Chart = ({
  chartLegend,
  dataSets,
  chartTooltip,
  padding,
  themeColor,
  xAxisFixLabelOverlap,
  xAxisLabelIncrement,
  xAxisTickFormat,
  yAxisTickFormat,
  xValueFormat,
  yValueFormat
}) => {
  // const str = React.useContext(ChartContext);
  // console.log('>>> chart', str);
  // const obj = useChartSettings();
  // console.log('>>> chart', obj);
  // const [dataSetsToggle, setDataSetsToggle] = useState({});

  /**
   * chartContainer,
   xAxisProps,
   yAxisProps,
   chartDomain,
   hasData,
   isMultiYAxis,
   maxX,
   maxY,
   tooltipDataSetLookUp
   */
  // const { xAxisProps } = useChartSettings();
  // console.log('>>> chart', xAxisProps, dataSets);

  /*
  useEffect(() => {
    console.log('>>> chart', chartContainerRef, dataSets);
  }, [chartContainerRef, dataSets]);
  */
  // setting the provider and using the context in the same component may be the issue
  // console.log('>>>', ChartContext);
  // {chartLegend && <div className="curiosity-chartarea__legend">{this.renderLegend()}</div>}
  return (
    <ChartProvider
      {...{
        xAxisFixLabelOverlap,
        xAxisLabelIncrement,
        xAxisTickFormat,
        yAxisTickFormat,
        xValueFormat,
        yValueFormat,
        dataSets,
        chartLegend,
        chartTooltip,
        padding,
        themeColor
      }}
    >
      <ChartElements />
      <ChartLegend />
    </ChartProvider>
  );
};

/**
 * Prop types.
 *
 * @type {{chartLegend: Node|Function, chartTooltip: Node|Function, padding, xAxisTickFormat: Function,
 *     themeColor: string, yAxisTickFormat: Function, domain: object|Array, dataSets: object,
 *     xAxisFixLabelOverlap: boolean, xAxisLabelIncrement: number, height: number}}
 */
Chart.propTypes = {
  chartLegend: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  chartTooltip: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  dataSets: PropTypes.array,
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
  yAxisTickFormat: PropTypes.func,
  xValueFormat: PropTypes.func,
  yValueFormat: PropTypes.func
  /*

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
  xAxisFixLabelOverlap: PropTypes.bool,
  xAxisLabelIncrement: PropTypes.number,
  xAxisTickFormat: PropTypes.func,
  // yAxisTickFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
  yAxisTickFormat: PropTypes.func,
  yAxisDisabled: PropTypes.bool, // REMOVE THIS
  xValueFormat: PropTypes.func,
  yValueFormat: PropTypes.func

   */
};

/**
 * Default props.
 *
 * @type {{chartLegend: null, chartTooltip: null, padding: {top: number, left: number, bottom: number,
 *     right: number}, xAxisTickFormat: null, themeColor: string, yAxisTickFormat: null, domain: object,
 *     dataSets: Array, xAxisFixLabelOverlap: boolean, xAxisLabelIncrement: number, height: number}}
 */
Chart.defaultProps = {
  chartTooltip: null,
  dataSets: [],
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
  xValueFormat: null,
  yValueFormat: null

  /*
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
  xAxisFixLabelOverlap: false,
  xAxisLabelIncrement: 1,
  xAxisTickFormat: null,
  yAxisTickFormat: null,
  yAxisDisabled: false,
  xValueFormat: null,
  yValueFormat: null

   */
};

export { Chart as default, Chart };
