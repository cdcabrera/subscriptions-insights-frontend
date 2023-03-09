import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Title } from '@patternfly/react-core';
import _camelCase from 'lodash/camelCase';
import { useProductGraphTallyQuery } from '../productView/productViewContext';
import { useGraphCardContext, useMetricsSelector } from './graphCardContext';
import { Loader, SkeletonSize } from '../loader/loader';
import { toolbarFieldOptions } from '../toolbar/toolbarFieldRangedMonthly';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';

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
  const { settings = {} } = useAliasGraphCardContext();
  const { [RHSM_API_QUERY_SET_TYPES.START_DATE]: startDate } = useAliasProductGraphTallyQuery();
  const { pending, error, fulfilled, dataSets = [] } = useAliasMetricsSelector();
  const { data = [], id: chartId, metric: metricId, meta = {} } = dataSets[0] || {};
  const { date: lastDate, hasData: lastHasData, y: lastValue } = data[data.length - 1] || {};

  const {
    date: currentDate,
    hasData: currentHasData,
    y: currentValue
  } = data.find(({ isCurrentDate }) => isCurrentDate === true) || {};

  const { totalMonthlyDate: monthlyDate, totalMonthlyHasData: monthlyHasData, totalMonthlyValue: monthlyValue } = meta;

  const { title: selectedMonth, isCurrent } =
    toolbarFieldOptions.find(
      option => option.title === startDate || option.value.startDate.toISOString() === startDate
    ) || {};

  const dailyDate = isCurrent ? currentDate : lastDate;
  const dailyHasData = isCurrent ? currentHasData : lastHasData;
  const dailyValue = isCurrent ? currentValue : lastValue;

  if (settings?.isMetricDisplay && settings?.cards?.length) {
    return (
      <div data-test={`graphMetricTotals-${_camelCase(metricId)}`} className="curiosity-usage-graph__totals">
        <div>
          <div className="curiosity-usage-graph__totals-column">
            {settings?.cards?.map(({ header, body, footer }, index) => (
              <Card
                isPlain
                data-test={`graphMetricTotalsCard-${index}`}
                className={`curiosity-usage-graph__totals-column-card ${(error && 'blur') || ''}`}
              >
                <CardHeader>
                  <CardTitle>
                    <Title headingLevel="h2" size="md">
                      {pending && <Loader variant="skeleton" skeletonProps={{ size: SkeletonSize.lg }} />}
                      {fulfilled &&
                        ((typeof header === 'function' &&
                          header({
                            chartId,
                            dailyDate,
                            dailyHasData,
                            dailyValue,
                            metricId,
                            monthlyDate,
                            monthlyHasData,
                            monthlyValue,
                            selectedValue: selectedMonth
                          })) ||
                          header)}
                    </Title>
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div>
                    {pending && <Loader variant="skeleton" skeletonProps={{ size: SkeletonSize.lg, height: '60px' }} />}
                    {fulfilled &&
                      ((typeof body === 'function' &&
                        body({
                          chartId,
                          dailyDate,
                          dailyHasData,
                          dailyValue,
                          metricId,
                          monthlyDate,
                          monthlyHasData,
                          monthlyValue,
                          selectedValue: selectedMonth
                        })) ||
                        body)}
                  </div>
                </CardBody>
                <CardFooter>
                  <div>
                    {pending && <Loader variant="skeleton" skeletonProps={{ size: SkeletonSize.lg }} />}
                    {fulfilled &&
                      ((typeof footer === 'function' &&
                        footer({
                          chartId,
                          dailyDate,
                          dailyHasData,
                          dailyValue,
                          metricId,
                          monthlyDate,
                          monthlyHasData,
                          monthlyValue,
                          selectedValue: selectedMonth
                        })) ||
                        footer)}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <div className="curiosity-usage-graph__totals-graph-column">{children}</div>
        </div>
      </div>
    );
  }

  return children;
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
