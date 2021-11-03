import React, { useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardTitle,
  CardHeader,
  CardBody,
  Title,
  Flex,
  FlexItem,
  CardFooter,
  Tooltip,
  TooltipPosition
} from '@patternfly/react-core';
import InfoCircleIcon from '@patternfly/react-icons/dist/js/icons/info-circle-icon';
import { useDeepCompareEffect, useShallowCompareEffect } from 'react-use';
import { Loader } from '../loader/loader';
import { MinHeight } from '../minHeight/minHeight';
import { GraphCardChart } from './graphCardChart';
import { useProduct, useProductGraphTallyQuery } from '../productView/productViewContext';
import { useGraphMetrics, useGetGraphTally, useGraphTallySelector } from './graphCardContext';
import { translate } from '../i18n/i18n';
import { RHSM_API_QUERY_SET_TYPES, rhsmConstants } from '../../services/rhsm/rhsmConstants';
import { reduxSelectors } from '../../redux/selectors';
import { connect, storeHooks } from '../../redux';
import mapDispatchToProps from './graphCard.deprecated';
import GraphCard from './graphCard.deprecated';
import _isEqual from "lodash/isEqual";

const cacheMetrics = {};

/**
 * A chart/graph card.
 *
 * @param {object} props
 * @param {boolean} props.isCardTitleDescription
 * @param {object} props.metric
 * @param {Function} props.t
 * @param {Function} props.useGraphMetrics
 * @param props.useProduct
 * @param props.useProductGraphTallyQuery
 * @param props.useGetGraphTally
 * @param props.useGraphTallySelector
 * @param props.useSelector
 * @param props.madeSelector
 * @returns {Node}
 */
const GraphCardMetric = ({
  isCardTitleDescription,
  metric,
  t,
  // useGraphMetrics: useAliasGraphMetrics,
  useProduct: useAliasProduct,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery,
  useGetGraphTally: useAliasGetGraphTally,
  useGraphTallySelector: useAliasGraphTallySelector,
  useSelector: useAliasSelector,
  madeSelector
}) => {
  /*
  const { id: metricId } = metric;
  const { productId } = useAliasProduct();
  // const [updatedResponse, setUpdatedResponse] = useState({});
  // const [updatedMetricIds, setUpdatedMetricIds] = useState([]);
  const query = useAliasProductGraphTallyQuery();
  // const updatedMetricIds = metricIds.map(filter => filter.id);
  const getGraphTally = useAliasGetGraphTally();
  // const doit = useAliasGraphTallySelector(updatedMetricIds) || {};
  // const { error, fulfilled, pending, metrics } = doit();
  // const selectorResponse = useAliasGraphTallySelector(updatedMetricIds) || {};
  // const { error, pending, metrics } = useAliasGraphTallySelector([metricId]) || {};

  // useShallowCompareEffect(() => {
  //  setUpdatedMetricIds(metricIds.map(filter => filter.id));
  // }, [metricIds, setUpdatedMetricIds]);
  const graphSelector = useMemo(() => reduxSelectors.graph.makeGraph({ productId, metrics: [metricId] }), [
    productId,
    metricId
  ]);

  const { error, pending, metrics } = useAliasSelector(state => graphSelector(state));

  useShallowCompareEffect(() => {
    const {
      [RHSM_API_QUERY_SET_TYPES.START_DATE]: startDate,
      [RHSM_API_QUERY_SET_TYPES.END_DATE]: endDate,
      [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: granularity
    } = query;

    if (granularity && startDate && endDate && productId) {
      getGraphTally([{ id: productId, metric: metricId }], query);
    }
  }, [getGraphTally, productId, metricId, query]);
  /*
  // const [updatedResponse, setUpdatedResponse] = useState({});
  // const { error, pending, metrics } = updatedResponse;
  const { error, pending, metrics } = useAliasGraphMetrics([metric]);
  * /
  // const apiResponse = useAliasGraphMetrics([metric]);

  // const metric = metrics?.[metricId] || {};

  // useShallowCompareEffect(() => {
  //  setUpdatedResponse(apiResponse);
  // }, [apiResponse, setUpdatedResponse]);
  */

  const { id: metricId } = metric;
  const { productId } = useAliasProduct();
  // const { error, pending, metrics } = madeSelector({ productId, metrics: [metricId] });
  const query = useAliasProductGraphTallyQuery();
  const getGraphTally = useAliasGetGraphTally();

  const graphSelector = useMemo(() => reduxSelectors.graph.makeGraph({ productId, metrics: [metricId] }), [
    productId,
    metricId
  ]);

  const response = useAliasSelector(state => graphSelector(state)) || {};
  const { error, fulfilled, pending, metrics } = response;

  if (cacheMetrics[metricId]) {
    const isEqual = _isEqual(cacheMetrics[metricId], response);
    console.log('GRAPH CARD COMPARE METRICES IS EQUAL 001 >>>', isEqual);
    console.log('GRAPH CARD COMPARE METRICES IS EQUAL 002 >>>', cacheMetrics[metricId]);
    console.log('GRAPH CARD COMPARE METRICES IS EQUAL 003 >>>', response);
  }

  cacheMetrics[metricId] = response;

  console.log('GRAPH CARD METRICS >>>', metrics);

  useShallowCompareEffect(() => {
    const {
      [RHSM_API_QUERY_SET_TYPES.START_DATE]: startDate,
      [RHSM_API_QUERY_SET_TYPES.END_DATE]: endDate,
      [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: granularity
    } = query;

    if (granularity && startDate && endDate && productId) {
      getGraphTally([{ id: productId, metric: metricId }], query);
    }
  }, [getGraphTally, productId, metricId, query]);

  let graphCardTooltip = null;

  console.log('metrics >>>>', error, pending, metrics);
  console.log('metric >>>>', metric);

  if (isCardTitleDescription) {
    graphCardTooltip = (
      <Tooltip
        content={<p>{t('curiosity-graph.cardHeadingDescription', { context: metricId })}</p>}
        position={TooltipPosition.top}
        enableFlip={false}
        distance={5}
        entryDelay={100}
        exitDelay={0}
      >
        <sup className="curiosity-icon__info">
          <InfoCircleIcon />
        </sup>
      </Tooltip>
    );
  }

  return (
    <Flex className="curiosity-usage-graph-facets">
      <Flex flex={{ default: 'flex_1' }} direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfStretch' }}>
        <FlexItem className="curiosity-usage-graph-facets__facet-column">
          <Card className="curiosity-usage-graph-facets__facet-card fadein">
            <CardTitle>{t('curiosity-graph.cardHeadingMetric_currentTotal', { context: metricId })}</CardTitle>
            <CardBody>
              {t('curiosity-graph.cardBodyMetric_currentTotal', { context: metricId }, [<strong>62</strong>])}
            </CardBody>
            <CardFooter>{t('curiosity-graph.cardFooterMetric', { date: 'Sep 13, 2021 8:00 AM' })}</CardFooter>
          </Card>
          <Card className="curiosity-usage-graph-facets__facet-card fadein">
            <CardTitle>{t('curiosity-graph.cardHeadingMetric_total', { context: metricId })}</CardTitle>
            <CardBody>
              {t('curiosity-graph.cardBodyMetric_total', { context: metricId }, [<strong>932</strong>])}
            </CardBody>
            <CardFooter>{t('curiosity-graph.cardFooterMetric', { date: 'Sep 13, 2021 8:00 AM' })}</CardFooter>
          </Card>
        </FlexItem>
      </Flex>
      <Flex flex={{ default: 'flex_3' }} direction={{ default: 'column' }}>
        <FlexItem className="curiosity-usage-graph-facets__graph-column">
          <Card className="curiosity-usage-graph">
            <MinHeight key="headerMinHeight">
              <CardHeader>
                <CardTitle>
                  <Title headingLevel="h2" size="lg">
                    {t('curiosity-graph.cardHeading', { context: metricId })}
                    {graphCardTooltip}
                  </Title>
                </CardTitle>
              </CardHeader>
            </MinHeight>
            <MinHeight key="bodyMinHeight">
              <CardBody>
                <div className={(error && 'blur') || (pending && 'fadein') || ''}>
                  {pending && <Loader variant="graph" />}
                  {!pending && <GraphCardChart metrics={metrics} />}
                </div>
              </CardBody>
            </MinHeight>
          </Card>
        </FlexItem>
      </Flex>
    </Flex>
  );
};

/**
 * Prop types.
 *
 * @type {{useProduct: Function, t: Function, useProductGraphConfig: Function, isDisabled: boolean,
 *     useGraphMetrics: Function, isCardTitleDescription: boolean}}
 */
GraphCardMetric.propTypes = {
  isCardTitleDescription: PropTypes.bool,
  metric: PropTypes.shape({
    id: PropTypes.oneOf([...Object.values(rhsmConstants.RHSM_API_PATH_METRIC_TYPES)])
  }),
  t: PropTypes.func,
  useGraphMetrics: PropTypes.func,
  useProduct: PropTypes.func,
  useProductGraphTallyQuery: PropTypes.func,
  useGetGraphTally: PropTypes.func,
  useGraphTallySelector: PropTypes.func,
  useSelector: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useProduct: Function, t: Function, useProductGraphConfig: Function, isDisabled: boolean,
 *     useGraphMetrics: Function, isCardTitleDescription: boolean}}
 */
GraphCardMetric.defaultProps = {
  isCardTitleDescription: false,
  metric: {},
  t: translate,
  useGraphMetrics,
  useProduct,
  useProductGraphTallyQuery,
  useGetGraphTally,
  useGraphTallySelector,
  useSelector: storeHooks.reactRedux.useSelector,
  madeSelector: params => reduxSelectors.graph.makeGraph(params)
};

// const makeMapStateToProps = reduxSelectors.graph.makeGraph();

// const ConnectedGraphCardMetric = connect(makeMapStateToProps, mapDispatchToProps)(GraphCardMetric);

export { GraphCardMetric as default, GraphCardMetric };
