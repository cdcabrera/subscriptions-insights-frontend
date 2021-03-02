import React from 'react';
import PropTypes from 'prop-types';
import { chart_color_green_300 as chartColorGreenDark } from '@patternfly/react-tokens';
import { graphCardHelpers } from './graphCardHelpers';
import GraphCardChartTooltip from './graphCardChartTooltip';
import GraphCardChartLegend from './graphCardChartLegend';
import { ChartArea } from '../chartArea/chartArea';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../../types/rhsmApiTypes';

/**
 * A chart/graph.
 *
 * @param {object} props
 * @param {Array} props.filterGraphData
 * @param {string} props.granularity
 * @param {object} props.graphData
 * @param {string} props.productLabel
 * @param {string} props.viewId
 * @returns {Node}
 */
const GraphCardChart = ({ filterGraphData, granularity, graphData, productLabel, viewId }) => {
  const xAxisTickFormat = ({ item, previousItem, tick }) =>
    graphCardHelpers.xAxisTickFormat({
      tick,
      date: item.date,
      previousDate: previousItem.date,
      granularity
    });

  const chartAreaProps = {
    xAxisFixLabelOverlap: true,
    xAxisLabelIncrement: graphCardHelpers.getChartXAxisLabelIncrement(granularity),
    xAxisTickFormat,
    yAxisTickFormat: graphCardHelpers.yAxisTickFormat
  };

  const filteredGraphData = data => {
    const filtered = key => {
      const tempFiltered = {
        data: data[key],
        id: key,
        animate: {
          duration: 250,
          onLoad: { duration: 250 }
        },
        strokeWidth: 2,
        isStacked: !/^threshold/.test(key),
        isThreshold: /^threshold/.test(key)
      };

      if (/^threshold/.test(key)) {
        tempFiltered.animate = {
          duration: 100,
          onLoad: { duration: 100 }
        };
        tempFiltered.stroke = chartColorGreenDark.value;
        tempFiltered.strokeDasharray = '4,3';
        tempFiltered.strokeWidth = 3;
      }

      return tempFiltered;
    };

    if (filterGraphData.length) {
      return filterGraphData.map(value => Object.assign(filtered(value.id), value));
    }

    return Object.keys(data).map(key => filtered(key));
  };

  return (
    <ChartArea
      key={`chart_${productLabel}`}
      {...chartAreaProps}
      dataSets={filteredGraphData(graphData)}
      chartLegend={({ chart, datum }) => (
        <GraphCardChartLegend chart={chart} datum={datum} productLabel={productLabel} viewId={viewId} />
      )}
      chartTooltip={({ datum }) => (
        <GraphCardChartTooltip datum={datum} granularity={granularity} productLabel={productLabel} />
      )}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{productLabel: string, viewId: string, granularity: string, graphData: object, filterGraphData: Array}}
 */
GraphCardChart.propTypes = {
  filterGraphData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      fill: PropTypes.string,
      stroke: PropTypes.string
    })
  ),
  granularity: PropTypes.oneOf([...Object.values(GRANULARITY_TYPES)]).isRequired,
  graphData: PropTypes.object,
  productLabel: PropTypes.string,
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{productLabel: string, viewId: string, graphData: object, filterGraphData: Array}}
 */
GraphCardChart.defaultProps = {
  filterGraphData: [],
  graphData: {},
  productLabel: null,
  viewId: null
};

export { GraphCardChart as default, GraphCardChart };
