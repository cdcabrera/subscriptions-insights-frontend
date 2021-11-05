import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { chart_color_green_300 as chartColorGreenDark } from '@patternfly/react-tokens';
import { Card, CardActions, CardBody, CardHeader, CardTitle, Title } from '@patternfly/react-core';
import { useSelector } from 'react-redux';
import { useShallowCompareEffect } from 'react-use';
import { useProduct, useProductGraphTallyQuery } from '../productView/productViewContext';
import { useGraphCardContext, useGraphMetrics, useGetGraphTallyOLD } from './graphCardContext';
import { graphCardHelpers } from './graphCardHelpers';
import { Chart } from '../chart/chart';
import GraphCardChartLegend from './graphCardChartLegend';
import GraphCardChartTooltip from './graphCardChartTooltip';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { MinHeight } from '../minHeight/minHeight';
import { Loader } from '../loader/loader';
import { translate } from '../i18n/i18n';
import { GraphCardChartTitleTooltip } from './graphCardChartTitleTooltip';
import { storeHooks } from '../../redux/hooks';
import { reduxActions } from '../../redux/actions';

const useSelectMetric = () => {
  const { productId } = useProduct();
  const { settings = {} } = useGraphCardContext();
  const { metric = {} } = settings;

  const { fulfilled, pending, error, data } =
    useSelector(({ graph }) => graph.tally?.[`${productId}_${metric.id}`]) || {};

  return {
    fulfilled,
    pending,
    error,
    data: {
      [metric.id]: {
        ...metric,
        data: data?.data,
        meta: data?.meta
      }
    },
    dataSets: [
      {
        ...metric,
        data: data?.data,
        meta: data?.meta
      }
    ]
  };
};

const useSelectMetrics = () => {
  const { productId } = useProduct();
  const { settings = {} } = useGraphCardContext();
  const { metrics = [] } = settings;

  const { fulfilled, pending, error, data } =
    useSelector(({ graph }) => graph.tally?.[`${productId}_${metric.id}`]) || {};

  return {
    fulfilled,
    pending,
    error,
    data: {},
    dataSets: [
      {
        // ...metric,
        data: data?.data,
        meta: data?.meta
      }
    ]
  };
};

const useGetGraphTally = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useGraphCardContext: useAliasGraphCardContext = useGraphCardContext,
  useProduct: useAliasProduct = useProduct,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery = useProductGraphTallyQuery
} = {}) => {
  // const { productId } = useAliasProduct();
  const query = useAliasProductGraphTallyQuery();
  const dispatch = useAliasDispatch();
  // const { settings = {} } = useAliasGraphCardContext();

  return metrics => reduxActions.rhsm.getGraphTally(metrics, query)(dispatch);
  // const { metrics = [] } = settings;

  /*
  return useCallback(
    () =>
      metrics.length &&
      reduxActions.rhsm.getGraphTally(
        metrics.map(({ id: metric }) => ({ id: productId, metric })),
        query
      )(dispatch),
    [dispatch, metrics, productId, query]
  );
  */

  /*
  return useCallback(metric => reduxActions.rhsm.getGraphTally({ id: productId, metric }, query)(dispatch), [
    dispatch,
    productId,
    query
  ]);
   */
  // return metric => reduxActions.rhsm.getGraphTally({ id: productId, metric }, query)(dispatch);
};

/**
 * A chart/graph.
 *
 * @param {object} props
 * @param {object} props.metrics
 * @param {Function} props.useProductGraphTallyQuery
 * @returns {Node}
 */
const GraphCardChartOLD = ({ metrics, useProductGraphTallyQuery: useAliasProductGraphTallyQuery }) => {
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

  const updatedGraphData = Object.entries(metrics).map(([key, { data, isThreshold = false, ...configSettings }]) => {
    const basicSettings = {
      data,
      id: key,
      strokeWidth: 2,
      isStacked: !isThreshold,
      isThreshold
    };

    if (isThreshold) {
      basicSettings.stroke = chartColorGreenDark.value;
      basicSettings.strokeDasharray = '4,3';
      basicSettings.strokeWidth = 3;
    }

    return {
      ...basicSettings,
      ...configSettings
    };
  });

  /*
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

    if (filters?.length) {
      return filters.map(value => Object.assign(filtered(value.id), value));
    }

    return Object.keys(data).map(key => filtered(key));
  };
  */

  console.log('GRAPH DATA >>>', metrics);
  console.log('GRAPH DATA >>>', updatedGraphData);

  return (
    <Chart
      // key={`chart_${JSON.stringify(query)}`}
      {...chartAreaProps}
      dataSets={updatedGraphData}
      chartLegend={({ chart, datum }) => <GraphCardChartLegend chart={chart} datum={datum} />}
      chartTooltip={({ datum }) => <GraphCardChartTooltip datum={datum} />}
    />
  );
};

const GraphCardChart = ({
  t,
  useGraphMetrics: useAliasGraphMetrics,
  useGraphCardContext: useAliasGraphCardContext,
  useProduct: useAliasProduct,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery
}) => {
  const { productId } = useAliasProduct();

  const { settings = {} } = useAliasGraphCardContext();
  // const { actionDisplay, metric, metrics } = settings;
  const { actionDisplay, metric, metrics = [] } = settings;
  const standaloneMetricId = (metric?.id && `_${metric?.id}`) || '';

  // const query = useAliasProductGraphTallyQuery();
  // const { [RHSM_API_QUERY_TYPES.GRANULARITY]: granularity } = query;
  const getGraphTally = useGetGraphTally();

  useShallowCompareEffect(() => {
    // getGraphTally({ id: productId, metric: metric.id });
    getGraphTally(metrics.map(({ id: metricId }) => ({ id: productId, metric: metricId })));
  }, [metrics, productId, getGraphTally]);

  // const { metrics } = settings; // use "metrics" in useGraphMetrics to combine settings and data into a "dataSets"
  // const { pending, error, data = {}, dataSets = [] } = {}; // useAliasGraphMetrics();
  // const test = useSelectMetric();
  const { pending, error, data = {}, dataSets = [] } = useSelectMetric();

  console.log('GRAPH CARD CHART >>>', dataSets);

  const chartAreaProps = {
    /*
    xAxisLabelIncrement: graphCardHelpers.getChartXAxisLabelIncrement(granularity),
    xAxisTickFormat: ({ item, previousItem, tick }) =>
      graphCardHelpers.xAxisTickFormat({
        tick,
        date: item.date,
        previousDate: previousItem.date,
        granularity
      }),
    yAxisTickFormat: graphCardHelpers.yAxisTickFormat
    */
  };

  let updatedActionDisplay = null;

  if (typeof actionDisplay === 'function') {
    updatedActionDisplay = actionDisplay({ data: { ...data } });
  }

  console.log('DATASETS >>>', dataSets);

  return (
    <Card className="curiosity-usage-graph">
      <MinHeight key="headerMinHeight">
        <CardHeader>
          <CardTitle>
            <Title headingLevel="h2" size="lg">
              {t(`curiosity-graph.cardHeading${standaloneMetricId}`, { context: productId })}
              <GraphCardChartTitleTooltip />
            </Title>
          </CardTitle>
          {updatedActionDisplay && (
            <CardActions className={(error && 'blur') || ''}>{updatedActionDisplay}</CardActions>
          )}
        </CardHeader>
      </MinHeight>
      <MinHeight key="bodyMinHeight">
        <CardBody>
          <div className={(error && 'blur') || (pending && 'fadein') || ''}>
            {pending && <Loader variant="graph" />}
            {!pending && (
              <Chart
                {...chartAreaProps}
                dataSets={dataSets}
                chartLegend={({ chart, datum }) => <GraphCardChartLegend chart={chart} datum={datum} />}
                chartTooltip={({ datum }) => <GraphCardChartTooltip datum={datum} />}
              />
            )}
          </div>
        </CardBody>
      </MinHeight>
    </Card>
  );
};

/**
 * Prop types.
 *
 * @type {{useProductGraphTallyQuery: Function, useProductGraphConfig: Function, metrics: object}}
 */
GraphCardChart.propTypes = {
  t: PropTypes.func,
  useGraphMetrics: PropTypes.func,
  useGraphCardContext: PropTypes.func,
  useProduct: PropTypes.func,
  useProductGraphTallyQuery: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useProductGraphTallyQuery: Function, useProductGraphConfig: Function, metrics: object}}
 */
GraphCardChart.defaultProps = {
  t: translate,
  useGraphMetrics,
  useGraphCardContext,
  useProduct,
  useProductGraphTallyQuery
};

export { GraphCardChart as default, GraphCardChart };
