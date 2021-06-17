/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'victory-create-container';
import {
  Chart,
  ChartAxis,
  ChartLine,
  ChartStack,
  ChartThreshold,
  ChartThemeColor,
  ChartArea as PfChartArea,
  ChartCursorFlyout,
  ChartCursorTooltip
} from '@patternfly/react-charts';
import _cloneDeep from 'lodash/cloneDeep';
import { helpers } from '../../common';
import { chartHelpers } from './chartHelpers';

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
class ChartArea extends React.Component {
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

  /**
   * Consumer exposed, hides chart layer.
   *
   * @event onHide
   * @param {string} id
   */
  onHide = id => {
    this.dataSetsToggle = { ...this.dataSetsToggle, [id]: true };
    this.forceUpdate();
  };

  /**
   * Consumer exposed, turns all chart layers back on.
   *
   * @event onRevert
   */
  onRevert = () => {
    this.dataSetsToggle = {};
    this.forceUpdate();
  };

  /**
   * Consumer exposed, turns chart layer on/off.
   *
   * @event onToggle
   * @param {string} id
   * @returns {boolean}
   */
  onToggle = id => {
    const updatedToggle = !this.dataSetsToggle[id];
    this.dataSetsToggle = { ...this.dataSetsToggle, [id]: updatedToggle };
    this.forceUpdate();

    return updatedToggle;
  };

  /**
   * On resize adjust graph display.
   *
   * @event onResizeContainer
   */
  onResizeContainer = () => {
    const { chartWidth } = this.state;
    const { clientWidth = 0 } = this.containerRef.current || {};

    if (clientWidth !== chartWidth) {
      this.setState({ chartWidth: clientWidth });
    }
  };

  /**
   * Consumer exposed, determine if chart layer on/off.
   * Note: Using "setState" as related to this exposed check gives the appearance of a race condition.
   * Using a class property with forceUpdate to bypass.
   *
   * @param {string} id
   * @returns {boolean}
   */
  getIsToggled = id => this.dataSetsToggle[id] || false;

  /**
   * Set ResizeObserver for scenarios where the window.resize event doesn't fire.
   */
  setResizeObserve() {
    const containerElement = this.containerRef.current;
    const { ResizeObserver } = window;

    if (containerElement && ResizeObserver) {
      const resizeObserver = new ResizeObserver(this.onResizeContainer);
      resizeObserver.observe(containerElement);
      this.resizeObserver = () => resizeObserver.unobserve(containerElement);
    } else {
      this.onResizeContainer();
      window.addEventListener('resize', this.onResizeContainer);
      this.resizeObserver = () => window.removeEventListener('resize', this.onResizeContainer);
    }
  }

  /**
   * Get axes props
   *
   * @returns {{isMultiYAxis: boolean, chartDomain: {domain: {y: Array}}, xAxisProps: Object, maxY: (Object|number),
   * hasData: boolean, maxX: number, yAxisProps: Array}}
   */
  getChartAxisPropsDomain() {
    const { dataSetsToggle } = this;
    const { xAxisFixLabelOverlap, xAxisLabelIncrement, xAxisTickFormat, yAxisTickFormat, dataSets } = this.props;

    const toggledDataSets = dataSets.filter(({ id }) => !dataSetsToggle[id]);

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
      xAxisProps,
      yAxisProps,
      chartDomain,
      hasData,
      isMultiYAxis,
      maxX,
      maxY: (isMultiYAxis && individualMaxY) || maxY
    };
  }

  /**
   * Apply data set to custom tooltips.
   *
   * @returns {Array}
   */
  getTooltipData() {
    const { dataSetsToggle } = this;
    const { dataSets, chartTooltip } = this.props;
    const tooltipDataSetLookUp = {};
    let tooltipDataSet = [];

    if (chartTooltip && dataSets?.[0]?.data) {
      tooltipDataSet = dataSets[0].data.map((dataSet, index) => {
        const itemsByKey = {};

        dataSets.forEach(data => {
          if (!dataSetsToggle[data.id] && data.data && data.data[index]) {
            itemsByKey[data.id] = {
              color: data.stroke || data.fill || data.color || '',
              data: _cloneDeep(data.data[index])
            };
          }
        });

        const mockDatum = {
          datum: { x: dataSet.x, y: dataSet.y, index, itemsByKey, dataSets: _cloneDeep(dataSets) }
        };

        const updatedTooltipData = {
          x: dataSet.x,
          y: null,
          itemsByKey,
          tooltip:
            (React.isValidElement(chartTooltip) && React.cloneElement(chartTooltip, { ...mockDatum })) ||
            chartTooltip({ ...mockDatum })
        };

        tooltipDataSetLookUp[dataSet.x] = updatedTooltipData;
        return updatedTooltipData;
      });
    }

    return { tooltipDataSet, tooltipDataSetLookUp };
  }

  /**
   * Return a chart/graph tooltip Victory container component to allow custom HTML tooltips.
   *
   * @returns {Node}
   */
  renderTooltip() {
    const { dataSetsToggle } = this;
    const { chartTooltip, dataSets } = this.props;

    if (!chartTooltip || Object.values(dataSetsToggle).filter(v => v === true).length === dataSets.length) {
      return null;
    }

    const VictoryVoronoiCursorContainer = createContainer('voronoi', 'cursor');
    const { tooltipDataSetLookUp } = this.getTooltipData();

    const applyParsedTooltipData = ({ datum }) => {
      const t = tooltipDataSetLookUp[datum.x] || {};
      return t?.tooltip || '';
    };

    const getXCoordinate = (x, width, tooltipWidth) => {
      const paddingVoroni = 50;
      const halfTooltipWidth = (tooltipWidth / 2) + paddingVoroni;
      const minChartWidth = 500;

      if (width <= minChartWidth && x > halfTooltipWidth && x < minChartWidth - halfTooltipWidth) {
        return (x + paddingVoroni) - (tooltipWidth / 2);
      }

      return (x > width / 2)? x - tooltipWidth + paddingVoroni : x + paddingVoroni;
    };

    const getYCoordinate = (y, height, tooltipHeight, width) => {
      const minChartWidth = 500;

      if (width <= minChartWidth) {
        const padding = 15;
        return (y > height / 2) ? (y - tooltipHeight) - padding : y + padding;
      }

      return height * 0.25
    };

    const tailPosition = (x, y, width, tooltipWidth) => {
      const paddingVoroni = 50;
      const halfTooltipWidth = (tooltipWidth / 2) + paddingVoroni;
      const minChartWidth = 500;

      if (width <= minChartWidth && x > halfTooltipWidth && x < minChartWidth - halfTooltipWidth) {
        return 'middle';
      }

      return x > width / 2 ? 'right' : 'left';
    };

    const FlyoutComponent = obj => {
      const containerRef = this.containerRef?.current?.querySelector('svg');
      const tooltipRef = this.tooltipRef?.current;
      const containerBounds = containerRef?.getBoundingClientRect() || { width: 0, height: 0 };
      const tooltipBounds = tooltipRef?.getBoundingClientRect() || { width: 0, height: 0 };
      const htmlContent = applyParsedTooltipData({ ...obj });

      if (htmlContent) {
        const updatedClassName = `${tooltipBounds.height <= 0 && 'fadein' || ''}`;
        // TODO: convert "obj.y > containerBounds.height - 80" to pull from the lower/bottom padding instead
        return (
          <g>
            <foreignObject
              x={getXCoordinate(obj.x, containerBounds.width, tooltipBounds.width)}
              y={getYCoordinate(obj.y, containerBounds.height, tooltipBounds.height, containerBounds.width)}
              width="100%"
              height="100%"
            >
              <div className={`curiosity-chartarea__tooltip-container ${updatedClassName}`} ref={this.tooltipRef} style={{ display: (obj.y > containerBounds.height - 80 && 'none') || 'inline-block' }} xmlns="http://www.w3.org/1999/xhtml">
                <div className={`curiosity-chartarea__tooltip curiosity-chartarea__tooltip-${ tailPosition(obj.x, obj.y, containerBounds.width, tooltipBounds.width) }`}>
                  {htmlContent}
                </div>
              </div>
            </foreignObject>
          </g>
        );
      }

      return <g />;
    };

    /**
     * FixMe: PF Charts prop "renderInPortal" is used to adjust layer order with the cursor
     * renderInPortal no longer appears to function and the cursor appears over the tooltip,
     * using VictoryPortal directly bypasses the issue, however it creates a "redraw" delay
     * that visually causes the tooltip redraw to be noticeable.
     */
    const labelComponent = (
      <ChartCursorTooltip
        dx={0}
        dy={0}
        centerOffset={{ x: 0, y: 0 }}
        flyoutStyle={{ fill: 'transparent' }}
        labelComponent={<FlyoutComponent />}
      />
    );

    return (
      <VictoryVoronoiCursorContainer
        cursorDimension="x"
        labels={obj => obj}
        labelComponent={labelComponent}
        voronoiPadding={50}
        mouseFollowTooltips
      />
    );
  }

  /**
   * Return a custom chart/graph legend component.
   *
   * @returns {Node}
   */
  renderLegend() {
    const { chartLegend, dataSets } = this.props;

    if (!chartLegend) {
      return null;
    }

    const legendProps = {
      datum: { dataSets: _cloneDeep(dataSets) },
      chart: {
        hide: this.onHide,
        revert: this.onRevert,
        toggle: this.onToggle,
        isToggled: this.getIsToggled
      }
    };

    return (
      (React.isValidElement(chartLegend) && React.cloneElement(chartLegend, { ...legendProps })) ||
      chartLegend({ ...legendProps })
    );
  }

  /**
   * Return a list/array of both stacked and non-stacked charts/graphs.
   *
   * @param {object} params
   * @param {boolean} params.isMultiYAxis
   * @param {number} params.maxX
   * @param {number|object} params.maxY
   * @param {boolean} params.stacked
   * @returns {Array}
   */
  renderChart({ isMultiYAxis = false, maxX, maxY = {}, stacked = false }) {
    const { dataSetsToggle } = this;
    const { dataSets, xValueFormat, yValueFormat } = this.props;
    const charts = [];
    const chartsStacked = [];
    const chartDefaults = {
      area: {
        component: PfChartArea,
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
    };

    const setChart = (dataSet, index) => {
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
          key={helpers.generateId()}
          name={`chart-${index}-${chartType}`}
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

    dataSets.forEach((dataSet, index) => {
      if (!dataSetsToggle[dataSet.id] && dataSet?.data?.length) {
        const updatedDataSet = setChart(dataSet, index);

        if (dataSet.isStacked) {
          chartsStacked.push(updatedDataSet);
        } else {
          charts.push(updatedDataSet);
        }
      }
    });

    return (stacked && chartsStacked) || charts;
  }

  /**
   * Render a chart/graph.
   *
   * @returns {Node}
   */
  render() {
    const { chartWidth } = this.state;
    const { chartLegend, padding, themeColor, yAxisDisabled } = this.props;

    const { xAxisProps, yAxisProps, chartDomain, hasData, isMultiYAxis, maxX, maxY } = this.getChartAxisPropsDomain();
    const tooltipComponent = { containerComponent: (hasData && this.renderTooltip()) || undefined };

    return (
      <div
        id="curiosity-chartarea"
        className="curiosity-chartarea uxui-curiosity__modal uxui-curiosity__modal--loading"
        ref={this.containerRef}
      >
        <Chart
          animate={{ duration: 0 }}
          width={chartWidth}
          themeColor={themeColor}
          {...{ padding, ...chartDomain, ...tooltipComponent }}
        >
          <ChartAxis {...xAxisProps} animate={false} />
          {!yAxisDisabled &&
            yAxisProps.map(axisProps => (
              <ChartAxis key={`yaxis-${axisProps.orientation}`} {...axisProps} animate={false} />
            ))}
          {this.renderChart({ isMultiYAxis, maxX, maxY })}
          <ChartStack>{this.renderChart({ isMultiYAxis, maxX, maxY, stacked: true })}</ChartStack>
        </Chart>
        {chartLegend && <div className="curiosity-chartarea__legend">{this.renderLegend()}</div>}
      </div>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{chartLegend: Node|Function, chartTooltip: Node|Function, padding, xAxisTickFormat: Function,
 *     themeColor: string, yAxisTickFormat: Function, domain: object|Array, dataSets: object,
 *     xAxisFixLabelOverlap: boolean, xAxisLabelIncrement: number, height: number}}
 */
ChartArea.propTypes = {
  chartLegend: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  chartTooltip: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
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
ChartArea.defaultProps = {
  chartLegend: null,
  chartTooltip: null,
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

export { ChartArea as default, ChartArea };
