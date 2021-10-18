import React from 'react';
import PropTypes from 'prop-types';
import { chart_color_green_300 as chartColorGreenDark } from '@patternfly/react-tokens';
import { useProduct, useProductGraphConfig, useProductGraphTallyQuery } from '../productView/productViewContext';
import { graphCardHelpers } from './graphCardHelpers';
import { Chart } from '../chart/chart';
import GraphCardChartLegend from './graphCardChartLegend';
import GraphCardChartTooltip from './graphCardChartTooltip';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';

/**
 * A chart/graph.
 *
 * @param {object} props
 * @param {object} props.graphData
 * @param {Function} props.useProduct
 * @param {Function} props.useProductGraphConfig
 * @param {Function} props.useProductGraphTallyQuery
 * @returns {Node}
 */
const GraphCardChart = ({
  graphData,
  useProduct: useAliasProduct,
  useProductGraphConfig: useAliasProductGraphConfig,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery
}) => {
  const { productLabel, viewId } = useAliasProduct();
  const { filters } = useAliasProductGraphConfig();
  const query = useAliasProductGraphTallyQuery();
  const { [RHSM_API_QUERY_TYPES.GRANULARITY]: granularity } = query;

  const chartAreaProps = {
    xAxisLabelIncrement: graphCardHelpers.getChartXAxisLabelIncrement(granularity),
    xAxisTickFormat: ({ item, previousItem, tick }) =>
      graphCardHelpers.xAxisTickFormat({
        tick,
        date: item.date,
        previousDate: previousItem.date,
        granularity
      }),
    yAxisTickFormat: graphCardHelpers.yAxisTickFormat
  };

  const filteredGraphData = data => {
    const filtered = key => {
      const tempFiltered = {
        data: data[key],
        id: key,
        strokeWidth: 2,
        isStacked: !/^threshold/.test(key),
        isThreshold: /^threshold/.test(key)
      };

      if (/^threshold/.test(key)) {
        tempFiltered.stroke = chartColorGreenDark.value;
        tempFiltered.strokeDasharray = '4,3';
        tempFiltered.strokeWidth = 3;
      }

      return tempFiltered;
    };

    if (filters.length) {
      return filters.map(value => Object.assign(filtered(value.id), value));
    }

    return Object.keys(data).map(key => filtered(key));
  };

  return (
    <Chart
      key={`chart_${JSON.stringify(query)}`}
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
 * @type {{useProduct: Function, useProductGraphTallyQuery: Function, useProductGraphConfig: Function, graphData: object}}
 */
GraphCardChart.propTypes = {
  graphData: PropTypes.object,
  useProduct: PropTypes.func,
  useProductGraphConfig: PropTypes.func,
  useProductGraphTallyQuery: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useProduct: Function, useProductGraphTallyQuery: Function, useProductGraphConfig: Function, graphData: object}}
 */
GraphCardChart.defaultProps = {
  graphData: {},
  useProduct,
  useProductGraphConfig,
  useProductGraphTallyQuery
};

export { GraphCardChart as default, GraphCardChart };
