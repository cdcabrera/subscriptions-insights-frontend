import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Title } from '@patternfly/react-core';
import _camelCase from 'lodash/camelCase';
import { useProductGraphTallyQuery } from '../productView/productViewContext';
import { useGraphCardContext, useMetricsSelector } from './graphCardContext';
import { Loader, SkeletonSize } from '../loader/loader';
import { toolbarFieldOptions as toolbarFieldMonthlyOptions } from '../toolbar/toolbarFieldRangedMonthly';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { graphCardHelpers } from './graphCardHelpers';
import { helpers } from '../../common';
// import { useToggleData } from '../chart/chartContext';

/**
 * @memberof GraphCard
 * @module GraphCardMetricTotals
 */

/**
 * Display totals for a single metric.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {Function} props.useGraphCardContext
 * @param {Function} props.useMetricsSelector
 * @param {Function} props.useProductGraphTallyQuery
 * @returns {React.ReactNode}
 */
const GraphCardMetricTotals = ({
  children,
  useGraphCardContext: useAliasGraphCardContext,
  useMetricsSelector: useAliasMetricsSelector,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery
}) => {
  // const { dataSetsToggle } = useToggleData();
  const { settings = {} } = useAliasGraphCardContext();
  const query = useAliasProductGraphTallyQuery();
  const { pending, error, fulfilled, dataSets: dataByList = [] } = useAliasMetricsSelector();

  const { [RHSM_API_QUERY_SET_TYPES.START_DATE]: startDate } = query;

  // NOTE: grouped totals working, oddity in how to get what graph facets are being displayed
  // console.log('>>>> chart OUTPUT', dataSetsToggle);

  /**
   * Note: 20240605, Originally, metric cards were targeted at "on-demand" displays, they've been expanded to include
   * "annual" subs. Regardless of either product display we can still use the "on-demand" options list to determine
   * if "startDate" is "current" since it uses similar params to the "past 30 days" in "annual" displays.
   */
  const { isCurrent: isSelectedDateCurrent } =
    toolbarFieldMonthlyOptions.find(
      option => option.title === startDate || option.value.startDate.toISOString() === startDate
    ) || {};

  if (settings?.isMetricDisplay && settings?.cards?.length) {
    const preCalculateMetricCardData = helpers.memo(dataSets => {
      const globalDisplay = {};
      const updatedDataSets = dataSets.map(dataSet => {
        const { id: chartId, metric: metricId } = dataSet || {};
        return {
          ...dataSet,
          display: {
            ...graphCardHelpers.getDailyMonthlyTotals({ dataSet, isCurrent: isSelectedDateCurrent }),
            ...graphCardHelpers.getRemainingCapacity({
              ...graphCardHelpers.groupTallyCapacityData({ data: dataSet, allData: dataSets }),
              isCurrent: isSelectedDateCurrent
            }),
            ...graphCardHelpers.getRemainingOverage({
              ...graphCardHelpers.groupTallyCapacityData({ data: dataSet, allData: dataSets }),
              isCurrent: isSelectedDateCurrent
            }),
            chartId,
            metricId
          }
        };
      });

      console.log('>>>>>> precal', updatedDataSets);

      /*
      updatedDataSets.forEach(({ display }) => {
        Object.entries(display).forEach(([key, value]) => {
          if (value === null || value === undefined) {
            globalDisplay[key] ??= value;
            return;
          }

          if (typeof value === 'number' && !Number.isNaN(value)) {
            globalDisplay[key] ??= 0;
            globalDisplay[key] += value;
            globalDisplay.chartId ??= [];
            globalDisplay.chartId.push(display.chartId);
            globalDisplay.metricId ??= [];
            globalDisplay.metricId.push(display.metricId);
          }
        });
      });
       */
      globalDisplay.remainingCapacity = updatedDataSets?.[0]?.display?.globalRemainingCapacity;
      globalDisplay.remainingCapacityHasData = updatedDataSets?.[0]?.display?.globalRemainingCapacityHasData;

      return helpers.setImmutableData({ dataSets: updatedDataSets, display: globalDisplay }, { isClone: true });
    });
    const metricDisplayPassedData = preCalculateMetricCardData(dataByList);

    return (
      <div
        data-test={`graphMetricTotals-${settings?.groupMetric?.map(metricId => _camelCase(metricId))?.join('-')}`}
        data-test-data={JSON.stringify(metricDisplayPassedData)}
        className="curiosity-graph__totals curiosity-usage-graph__totals"
      >
        <div>
          <div className="curiosity-graph__totals-column curiosity-usage-graph__totals-column">
            {settings?.cards?.map(({ key, header, body, footer }, index) => (
              <Card
                key={key || helpers.generateHash({ metricDisplayPassedData, index })}
                isPlain
                data-test={`graphMetricTotalsCard-${index}`}
                className={`curiosity-graph__totals-column-card curiosity-usage-graph__totals-column-card ${
                  (error && 'blur') || ''
                }`}
              >
                <CardHeader className="curiosity-graph__totals-column-card-header">
                  <CardTitle>
                    <Title headingLevel="h2" size="md">
                      {pending && <Loader variant="skeleton" skeletonProps={{ size: SkeletonSize.lg }} />}
                      {fulfilled && ((typeof header === 'function' && header(metricDisplayPassedData)) || header)}
                    </Title>
                  </CardTitle>
                </CardHeader>
                <CardBody className="curiosity-graph__totals-column-card-body">
                  <div>
                    {pending && <Loader variant="skeleton" skeletonProps={{ size: SkeletonSize.lg, height: '60px' }} />}
                    {fulfilled && ((typeof body === 'function' && body(metricDisplayPassedData)) || body)}
                  </div>
                </CardBody>
                <CardFooter className="curiosity-graph__totals-column-card-footer">
                  <div>
                    {pending && <Loader variant="skeleton" skeletonProps={{ size: SkeletonSize.lg }} />}
                    {fulfilled && ((typeof footer === 'function' && footer(metricDisplayPassedData)) || footer)}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <div className="curiosity-graph__totals-graph-column curiosity-usage-graph__totals-graph-column">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-test="graphStandalone" className="curiosity-graph__standalone curiosity-usage-graph__standalone">
      {children}
    </div>
  );
};

/**
 * Prop types.
 *
 * @type {{useProductGraphTallyQuery: Function, children: React.ReactNode, useMetricsSelector: Function}}
 */
GraphCardMetricTotals.propTypes = {
  children: PropTypes.node,
  useGraphCardContext: PropTypes.func,
  useMetricsSelector: PropTypes.func,
  useProductGraphTallyQuery: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useProductGraphTallyQuery: Function, children: React.ReactNode, useMetricsSelector: Function}}
 */
GraphCardMetricTotals.defaultProps = {
  children: null,
  useGraphCardContext,
  useMetricsSelector,
  useProductGraphTallyQuery
};

export { GraphCardMetricTotals as default, GraphCardMetricTotals };
