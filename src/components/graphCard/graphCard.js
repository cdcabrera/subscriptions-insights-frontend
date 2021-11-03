import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardHeader, CardActions, CardBody, Title } from '@patternfly/react-core';
import { useProductGraphConfig } from '../productView/productViewContext';
import { helpers } from '../../common';
import { Loader } from '../loader/loader';
import { MinHeight } from '../minHeight/minHeight';
import { GraphCardChart } from './graphCardChart';
import { useGraphMetrics } from './graphCardContext';

/**
 * A chart/graph card.
 *
 * @param {object} props
 * @param {Node} props.cardTitle
 * @param {Node} props.children
 * @param {boolean} props.isDisabled
 * @param {Function} props.useGraphMetrics
 * @param {Function} props.useProductGraphConfig
 * @returns {Node}
 */
const GraphCard = ({
  cardTitle,
  children,
  isDisabled,
  useGraphMetrics: useAliasGraphMetrics,
  useProductGraphConfig: useAliasProductGraphConfig
}) => {
  const { error, pending, metrics } = useAliasGraphMetrics();
  const { settings } = useAliasProductGraphConfig();
  const graphData = {};

  if (isDisabled) {
    return null;
  }

  let actionDisplay = null;

  if (typeof settings?.actionDisplay === 'function') {
    actionDisplay = settings.actionDisplay({ data: metrics });
  }

  return (
    <Card className="curiosity-usage-graph">
      <MinHeight key="headerMinHeight">
        <CardHeader>
          <CardTitle>
            <Title headingLevel="h2" size="lg">
              {cardTitle}
            </Title>
          </CardTitle>
          <CardActions className={(error && 'blur') || ''}>
            <React.Fragment key="actionDisplay">{actionDisplay}</React.Fragment>
            {children}
          </CardActions>
        </CardHeader>
      </MinHeight>
      <MinHeight key="bodyMinHeight">
        <CardBody>
          <div className={(error && 'blur') || (pending && 'fadein') || ''}>
            {pending && <Loader variant="graph" />}
            {!pending && <GraphCardChart graphData={graphData} />}
          </div>
        </CardBody>
      </MinHeight>
    </Card>
  );
};

/**
 * Prop types.
 *
 * @type {{useProductGraphConfig: Function, children: Node, isDisabled: boolean, useGraphMetrics: Function,
 *     cardTitle: Node}}
 */
GraphCard.propTypes = {
  cardTitle: PropTypes.node,
  children: PropTypes.node,
  isDisabled: PropTypes.bool,
  useGraphMetrics: PropTypes.func,
  useProductGraphConfig: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useProductGraphConfig: Function, children: Node, isDisabled: boolean, useGraphMetrics: Function,
 *     cardTitle: Node}}
 */
GraphCard.defaultProps = {
  cardTitle: null,
  children: null,
  isDisabled: helpers.UI_DISABLED_GRAPH,
  useGraphMetrics,
  useProductGraphConfig
};

const ConnectedGraphCard = GraphCard;

export { ConnectedGraphCard as default, ConnectedGraphCard, GraphCard };
