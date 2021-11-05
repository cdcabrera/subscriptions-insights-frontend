import React, { useMemo, useState, useCallback, useEffect } from 'react';
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
import { useSelector } from 'react-redux';
import _isEqual from 'lodash/isEqual';
import { Loader } from '../loader/loader';
import { MinHeight } from '../minHeight/minHeight';
import { GraphCardChart } from './graphCardChart';
import { useProduct, useProductGraphTallyQuery, useProductGraphConfig } from '../productView/productViewContext';
import {
  GraphCardContext,
  useGraphCardContext,
  useGraphMetrics,
  useGetGraphTally,
  useGraphTallySelector
} from './graphCardContext';
import { translate } from '../i18n/i18n';
import { RHSM_API_QUERY_SET_TYPES, rhsmConstants } from '../../services/rhsm/rhsmConstants';
import { reduxSelectors } from '../../redux/selectors';
import { connect, storeHooks } from '../../redux';
import mapDispatchToProps from './graphCard.deprecated';
import GraphCard from './graphCard.deprecated';
import GraphCardMetricTotals from './graphCardMetricTotals';

const useSelectMetric = (productId, metricId) => {
  const { fulfilled, pending, error, data } =
    useSelector(({ graph }) => graph.tally?.[`${productId}_${metricId}`]) || {};
  return {
    fulfilled,
    pending,
    error,
    metrics: {
      [metricId]: {
        data: data?.data,
        meta: data?.meta
      }
    }
  };
};

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
 * @param props.metricFilter
 * @returns {Node}
 */
const GraphCardMetricOLD = ({
  isCardTitleDescription,
  metric,
  metricFilter,
  t,
  // useGraphMetrics: useAliasGraphMetrics,
  useProduct: useAliasProduct,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery,
  useGetGraphTally: useAliasGetGraphTally
}) => {
  const { id: metricId } = metricFilter;
  const { productId } = useAliasProduct();
  const query = useAliasProductGraphTallyQuery();
  const getGraphTally = useAliasGetGraphTally();

  const response = useSelectMetric(productId, metricId);
  const { error, pending, metrics } = response;

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
  console.log('metric >>>>', metricFilter);

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
 * Display a single graph metric.
 *
 * @param {object} props
 * @param {object} props.metricFilter
 * @param {Function} props.t
 * @param {Function} props.useProductGraphConfig
 * @returns {Node}
 */
const GraphCardMetric = ({
  metricFilter,
  t,
  // useGraphMetrics: useAliasGraphMetrics,
  // useProduct: useAliasProduct,
  // useProductGraphTallyQuery: useAliasProductGraphTallyQuery,
  // useGetGraphTally: useAliasGetGraphTally
  useProductGraphConfig: useAliasProductGraphConfig
}) => {
  const [context, setContext] = useState({});
  const { settings } = useAliasProductGraphConfig();
  // const { settings = {} } = useAliasGraphCardContext();
  // const { isCardTitleDescription } = settings;

  useEffect(() => {
    setContext({
      settings: {
        ...settings,
        isStandalone: true,
        metric: metricFilter,
        metrics: [metricFilter]
      }
    });
  }, [metricFilter, settings, setContext]);

  // if (!settings.standaloneFilters.length) {
  // return null;
  // }

  return (
    <GraphCardContext.Provider value={context}>
      <GraphCardMetricTotals>
        <GraphCardChart />
      </GraphCardMetricTotals>
    </GraphCardContext.Provider>
  );
};

/**
 * Prop types.
 *
 * @type {{useProduct: Function, t: Function, useProductGraphConfig: Function, isDisabled: boolean,
 *     useGraphMetrics: Function, isCardTitleDescription: boolean}}
 */
GraphCardMetric.propTypes = {
  // isCardTitleDescription: PropTypes.bool,
  // metricFilter: PropTypes.shape({
  //  id: PropTypes.oneOf([...Object.values(rhsmConstants.RHSM_API_PATH_METRIC_TYPES)])
  // }),
  t: PropTypes.func,
  useProduct: PropTypes.func,
  useProductGraphTallyQuery: PropTypes.func,
  useGetGraphTally: PropTypes.func,
  useGraphCardContext: PropTypes.func,
  useProductGraphConfig: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useProduct: Function, t: Function, useProductGraphConfig: Function, isDisabled: boolean,
 *     useGraphMetrics: Function, isCardTitleDescription: boolean}}
 */
GraphCardMetric.defaultProps = {
  // isCardTitleDescription: false,
  // metricFilter: {},
  t: translate,
  useProduct,
  useProductGraphTallyQuery,
  useGetGraphTally,
  useGraphCardContext,
  useProductGraphConfig
};

// const makeMapStateToProps = reduxSelectors.graph.makeGraph();

// const ConnectedGraphCardMetric = connect(makeMapStateToProps, mapDispatchToProps)(GraphCardMetric);

export { GraphCardMetric as default, GraphCardMetric };
