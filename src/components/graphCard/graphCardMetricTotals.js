import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardFooter, CardTitle, Flex, FlexItem } from '@patternfly/react-core';
import { useGraphCardContext } from './graphCardContext';
import { translate } from '../i18n/i18n';

/**
 * Display totals for a single metric.
 *
 * @param {object} props
 * @param {Node} props.children
 * @param {Function} props.t
 * @param {Function} props.useGraphCardContext
 * @returns {Node}
 */
const GraphCardMetricTotals = ({ children, t, useGraphCardContext: useAliasGraphCardContext }) => {
  const { settings = {} } = useAliasGraphCardContext();
  const { metric = {} } = settings;

  return (
    <Flex className="curiosity-usage-graph-facets">
      <Flex flex={{ default: 'flex_1' }} direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfStretch' }}>
        <FlexItem className="curiosity-usage-graph-facets__facet-column">
          <Card className="curiosity-usage-graph-facets__facet-card fadein">
            <CardTitle>{t('curiosity-graph.cardHeadingMetric_currentTotal', { context: metric.id })}</CardTitle>
            <CardBody>
              {t('curiosity-graph.cardBodyMetric_currentTotal', { context: metric.id }, [<strong>62</strong>])}
            </CardBody>
            <CardFooter>{t('curiosity-graph.cardFooterMetric', { date: 'Sep 13, 2021 8:00 AM' })}</CardFooter>
          </Card>
          <Card className="curiosity-usage-graph-facets__facet-card fadein">
            <CardTitle>{t('curiosity-graph.cardHeadingMetric_total', { context: metric.id })}</CardTitle>
            <CardBody>
              {t('curiosity-graph.cardBodyMetric_total', { context: metric.id }, [<strong>932</strong>])}
            </CardBody>
            <CardFooter>{t('curiosity-graph.cardFooterMetric', { date: 'Sep 13, 2021 8:00 AM' })}</CardFooter>
          </Card>
        </FlexItem>
      </Flex>
      <Flex flex={{ default: 'flex_3' }} direction={{ default: 'column' }}>
        <FlexItem className="curiosity-usage-graph-facets__graph-column">{children}</FlexItem>
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
GraphCardMetricTotals.propTypes = {
  children: PropTypes.node,
  t: PropTypes.func,
  useGraphCardContext: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useProduct: Function, t: Function, useProductGraphConfig: Function, isDisabled: boolean,
 *     useGraphMetrics: Function, isCardTitleDescription: boolean}}
 */
GraphCardMetricTotals.defaultProps = {
  children: null,
  t: translate,
  useGraphCardContext
};

export { GraphCardMetricTotals as default, GraphCardMetricTotals };
