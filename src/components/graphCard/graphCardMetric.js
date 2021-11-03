import React, { useState } from 'react';
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
import { useShallowCompareEffect } from 'react-use';
import { Loader } from '../loader/loader';
import { MinHeight } from '../minHeight/minHeight';
import { GraphCardChart } from './graphCardChart';
import { useGraphMetrics } from './graphCardContext';
import { translate } from '../i18n/i18n';
import { rhsmConstants } from '../../services/rhsm/rhsmConstants';

/**
 * A chart/graph card.
 *
 * @param {object} props
 * @param {boolean} props.isCardTitleDescription
 * @param {object} props.metric
 * @param {Function} props.t
 * @param {Function} props.useGraphMetrics
 * @returns {Node}
 */
const GraphCardMetric = ({ isCardTitleDescription, metric, t, useGraphMetrics: useAliasGraphMetrics }) => {
  // const [updatedResponse, setUpdatedResponse] = useState({});
  // const { error, pending, metrics } = updatedResponse;
  const { error, pending, metrics } = useAliasGraphMetrics([metric]);
  // const apiResponse = useAliasGraphMetrics([metric]);
  const { id: metricId } = metric;
  // const metric = metrics?.[metricId] || {};

  // useShallowCompareEffect(() => {
  //  setUpdatedResponse(apiResponse);
  // }, [apiResponse, setUpdatedResponse]);

  let graphCardTooltip = null;

  console.log('metrics >>>>', metrics);
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
  useGraphMetrics: PropTypes.func
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
  useGraphMetrics
};

export { GraphCardMetric as default, GraphCardMetric };
