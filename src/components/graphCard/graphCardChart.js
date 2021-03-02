import React from 'react';
import PropTypes from 'prop-types';
import { chart_color_green_300 as chartColorGreenDark } from '@patternfly/react-tokens';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { graphCardHelpers } from './graphCardHelpers';
import GraphCardChartTooltip from './graphCardChartTooltip';
import GraphCardChartLegend from './graphCardChartLegend';
import { ChartArea } from '../chartArea/chartArea';
import { useGraphTallyQuery, useProductContext } from '../productView/productContext';

/**
 * A chart/graph.
 *
 * @param {object} props
 * @param {object} props.graphData
 * @returns {Node}
 */
const GraphCardChart = ({ graphData }) => {
  const { productId, productLabel, viewId, initialGraphFilters: filterGraphData } = useProductContext();
  const { [RHSM_API_QUERY_TYPES.GRANULARITY]: granularity } = useGraphTallyQuery();

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

    if (filterGraphData?.length) {
      return filterGraphData.map(value => Object.assign(filtered(value.id), value));
    }

    return Object.keys(data).map(key => filtered(key));
  };

  return (
    <ChartArea
      key={`graphCardChart_${productId}`}
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
 * @type {{graphData: object}}
 */
GraphCardChart.propTypes = {
  graphData: PropTypes.object
};

/**
 * Default props.
 *
 * @type {{graphData: object}}
 */
GraphCardChart.defaultProps = {
  graphData: {}
};

export { GraphCardChart as default, GraphCardChart };
