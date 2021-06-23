import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ChartThemeColor } from '@patternfly/react-charts';
import { ChartContext, useSetChartContext } from './chartContext';
import { ChartElements } from './chartElements';
import { ChartLegend } from './chartLegend';
import { chartHelpers } from './chartHelpers';
import { useResizeObserver } from '../../hooks/useWindow';

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
  // const [context, setContext] = useState({});
  const [context, setContext] = useSetChartContext();
  // const [dataSetsToggle] = useSetToggleData();
  const [dataSetsToggle, setDataSetsToggle] = useState({});
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);
  const { width: chartWidth } = useResizeObserver(containerRef);
  // const [dataSetsToggle, setDataSetsToggle] = useDataSetsToggle();
  // const [dataSetsToggle, setDataSetsToggle] = useState({});
  // const [dataSetsToggle] = useState({});
  // console.log('dataSetsToggle 001 >>>', dataSetsToggle);

  useEffect(() => {
    console.log('dataSetsToggle 002 >>>', dataSetsToggle);

    const updateChartSettings = () => {
      const toggledDataSets = dataSets.filter(({ id }) => !dataSetsToggle[id]);

      console.log('dataSetsToggle 003 >>>', toggledDataSets);

      const tooltipDataSetLookUp = chartHelpers.generateTooltipData({ content: chartTooltip, dataSets });
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
      const chartElementsProps = chartHelpers.generateElementsProps({
        dataSets: toggledDataSets,
        isMultiYAxis,
        maxX,
        maxY,
        xValueFormat,
        yValueFormat
      });
      const chartDomain = chartHelpers.generateDomains({ maxY: (isMultiYAxis && individualMaxY) || maxY });
      const hasData = !!xAxisProps.tickValues;

      return {
        xAxisProps,
        yAxisProps,
        chartDomain,
        chartElementsProps,
        hasData,
        isMultiYAxis,
        maxX,
        maxY: (isMultiYAxis && individualMaxY) || maxY,
        padding,
        themeColor,
        tooltipDataSetLookUp
      };
    };

    const chartSettings = updateChartSettings();
    const updatedSettings = {
      chartContainerRef: () => containerRef,
      chartSettings: { ...chartSettings, chartLegend, chartWidth, dataSets },
      chartTooltipRef: () => tooltipRef,
      dataSetsToggle: [dataSetsToggle, setDataSetsToggle]
    };

    setContext(updatedSettings);
  }, [
    yAxisTickFormat,
    xAxisTickFormat,
    xAxisLabelIncrement,
    xAxisFixLabelOverlap,
    xValueFormat,
    yValueFormat,
    themeColor,
    padding,
    dataSetsToggle,
    chartLegend,
    chartTooltip,
    chartWidth,
    dataSets,
    setContext
  ]);

  return (
    <ChartContext.Provider value={context}>
      <div
        id="curiosity-chartarea"
        className="curiosity-chartarea uxui-curiosity__modal uxui-curiosity__modal--loading"
        ref={containerRef}
      >
        <ChartElements />
        <ChartLegend />
      </div>
    </ChartContext.Provider>
  );
};

/**
 * Prop types.
 *
 * @type {{chartTooltip: Node|Function, xValueFormat: Function, padding: {top: number, left: number, bottom: number,
 *     right: number}, xAxisTickFormat: Function, themeColor: string, chartLegend: Node|Function,
 *     yAxisTickFormat: Function, dataSets: Array, xAxisFixLabelOverlap: boolean, xAxisLabelIncrement: number,
 *     yValueFormat: Function}}
 */
Chart.propTypes = {
  chartLegend: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  chartTooltip: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  dataSets: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.arrayOf(
        PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number,
          xAxisLabel: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]),
          yAxisLabel: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)])
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
      style: PropTypes.object,
      isStacked: PropTypes.bool,
      xAxisUseDataSet: PropTypes.bool,
      yAxisUseDataSet: PropTypes.bool
    })
  ),
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
  // height: PropTypes.number,
  // domain: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  // domain: PropTypes.shape({ x: PropTypes.array, y: PropTypes.array })
};

/**
 * Default props.
 *
 * @type {{chartTooltip: Node|Function, xValueFormat: Function, padding: {top: number, left: number, bottom: number,
 *     right: number}, xAxisTickFormat: Function, themeColor: string, chartLegend: Node|Function,
 *     yAxisTickFormat: Function, dataSets: Array, xAxisFixLabelOverlap: boolean, xAxisLabelIncrement: number,
 *     yValueFormat: Function}}
 */
Chart.defaultProps = {
  chartLegend: null,
  chartTooltip: null,
  dataSets: [],
  padding: {
    bottom: 75,
    left: 55,
    right: 55,
    top: 50
  },
  themeColor: 'blue',
  xAxisFixLabelOverlap: false,
  xAxisLabelIncrement: 1,
  xAxisTickFormat: null,
  yAxisTickFormat: null,
  xValueFormat: null,
  yValueFormat: null
};

export { Chart as default, Chart };
