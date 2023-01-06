import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Title } from '@patternfly/react-core';
import moment from 'moment';
import _camelCase from 'lodash/camelCase';
import { useProductGraphTallyQuery } from '../productView/productViewContext';
import { useMetricsSelector } from './graphCardContext';
import { Loader, SkeletonSize } from '../loader/loader';
import { dateHelpers, helpers } from '../../common';
import { toolbarFieldOptions } from '../toolbar/toolbarFieldRangedMonthly';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { translate } from '../i18n/i18n';

/**
 * Display totals for a single metric.
 *
 * @param {object} props
 * @param {Node} props.children
 * @param {Function} props.t
 * @param {Function} props.useMetricsSelector
 * @param {Function} props.useProductGraphTallyQuery
 * @returns {Node}
 */
const GraphCardMetricTotals = ({
  children,
  t,
  useMetricsSelector: useAliasMetricsSelector,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery
}) => {
  const { [RHSM_API_QUERY_SET_TYPES.START_DATE]: startDate } = useAliasProductGraphTallyQuery();
  const { pending, error, fulfilled, dataSets = [] } = useAliasMetricsSelector();
  const { data = [], id, metric: metricId, meta = {} } = dataSets[0] || {};
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

  return (
    <div data-test={`graphMetricTotals-${_camelCase(metricId)}`} className="curiosity-usage-graph__totals">
      <div>
        <div className="curiosity-usage-graph__totals-column">
          <Card
            isPlain
            data-test="graphDailyTotalCard"
            className={`curiosity-usage-graph__totals-column-card ${(error && 'blur') || ''}`}
          >
            <CardHeader>
              <CardTitle>
                <Title headingLevel="h2" size="md">
                  {pending && <Loader variant="skeleton" skeletonProps={{ size: SkeletonSize.lg }} />}
                  {fulfilled &&
                    t('curiosity-graph.cardHeadingMetric', {
                      context: ['dailyTotal', id],
                      month: selectedMonth
                    })}
                </Title>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div>
                {pending && <Loader variant="skeleton" skeletonProps={{ size: SkeletonSize.lg }} />}
                {fulfilled &&
                  t(
                    'curiosity-graph.cardBodyMetric',
                    {
                      context: ['total', dailyHasData && id],
                      total: helpers
                        .numberDisplay(dailyValue)
                        ?.format({
                          average: true,
                          mantissa: 5,
                          trimMantissa: true,
                          lowPrecision: false
                        })
                        ?.toUpperCase()
                    },
                    [<strong title={dailyValue} aria-label={dailyValue} />]
                  )}
              </div>
            </CardBody>
            <CardFooter>
              <div className={(!dailyHasData && 'hidden') || ''}>
                {fulfilled &&
                  dailyDate &&
                  t('curiosity-graph.cardFooterMetric', {
                    date: moment.utc(dailyDate).format(dateHelpers.timestampUTCTimeFormats.yearTimeShort)
                  })}
              </div>
            </CardFooter>
          </Card>
          <Card
            isPlain
            data-test="graphMonthlyTotalCard"
            className={`curiosity-usage-graph__totals-column-card ${(error && 'blur') || ''}`}
          >
            <CardHeader>
              <CardTitle>
                <Title headingLevel="h2" size="md">
                  {pending && <Loader variant="skeleton" skeletonProps={{ size: SkeletonSize.lg }} />}
                  {fulfilled &&
                    t('curiosity-graph.cardHeadingMetric', {
                      context: ['monthlyTotal', id],
                      month: selectedMonth
                    })}
                </Title>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div>
                {pending && <Loader variant="skeleton" skeletonProps={{ size: SkeletonSize.lg }} />}
                {fulfilled &&
                  t(
                    'curiosity-graph.cardBodyMetric',
                    {
                      context: ['total', monthlyHasData && id],
                      total: helpers
                        .numberDisplay(monthlyValue)
                        ?.format({ average: true, mantissa: 5, trimMantissa: true, lowPrecision: false })
                        ?.toUpperCase()
                    },
                    [<strong title={monthlyValue} aria-label={monthlyValue} />]
                  )}
              </div>
            </CardBody>
            <CardFooter>
              <div className={(!monthlyHasData && 'hidden') || ''}>
                {fulfilled &&
                  monthlyDate &&
                  t('curiosity-graph.cardFooterMetric', {
                    date: moment.utc(monthlyDate).format(dateHelpers.timestampUTCTimeFormats.yearTimeShort)
                  })}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div>
        <div className="curiosity-usage-graph__totals-graph-column">{children}</div>
      </div>
    </div>
  );
};

/**
 * Prop types.
 *
 * @type {{useProductGraphTallyQuery: Function, t: Function, children: Node, useMetricsSelector: Function}}
 */
GraphCardMetricTotals.propTypes = {
  children: PropTypes.node,
  t: PropTypes.func,
  useMetricsSelector: PropTypes.func,
  useProductGraphTallyQuery: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useProductGraphTallyQuery: Function, t: Function, children: Node, useMetricsSelector: Function}}
 */
GraphCardMetricTotals.defaultProps = {
  children: null,
  t: translate,
  useMetricsSelector,
  useProductGraphTallyQuery
};

export { GraphCardMetricTotals as default, GraphCardMetricTotals };
