import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardTitle,
  CardHeader,
  CardActions,
  CardBody,
  Title,
  Tooltip,
  TooltipPosition
} from '@patternfly/react-core';
import InfoCircleIcon from '@patternfly/react-icons/dist/js/icons/info-circle-icon';
import { useProduct, useProductGraphConfig } from '../productView/productViewContext';
import { helpers } from '../../common';
import { Loader } from '../loader/loader';
import { MinHeight } from '../minHeight/minHeight';
import { GraphCardChart } from './graphCardChart';
import { useGraphMetrics } from './graphCardContext';
import { translate } from '../i18n/i18n';

/**
 * A chart/graph card.
 *
 * @param {object} props
 * @param {Node} props.children
 * @param {boolean} props.isCardTitleDescription
 * @param {boolean} props.isDisabled
 * @param {Function} props.t
 * @param {Function} props.useGraphMetrics
 * @param {Function} props.useProduct
 * @param {Function} props.useProductGraphConfig
 * @returns {Node}
 */
const GraphCard = ({
  children,
  isCardTitleDescription,
  isDisabled,
  t,
  useGraphMetrics: useAliasGraphMetrics,
  useProduct: useAliasProduct,
  useProductGraphConfig: useAliasProductGraphConfig
}) => {
  const { productId } = useAliasProduct();
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

  let graphCardTooltip = null;

  if (isCardTitleDescription) {
    graphCardTooltip = (
      <Tooltip
        content={<p>{t('curiosity-graph.cardHeadingDescription', { context: productId })}</p>}
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
    <Card className="curiosity-usage-graph">
      <MinHeight key="headerMinHeight">
        <CardHeader>
          <CardTitle>
            <Title headingLevel="h2" size="lg">
              {t('curiosity-graph.cardHeading', { context: productId })}
              {graphCardTooltip}
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
 * @type {{useProduct: Function, t: Function, useProductGraphConfig: Function, children: Node, isDisabled: boolean,
 *     useGraphMetrics: Function, isCardTitleDescription: boolean}}
 */
GraphCard.propTypes = {
  children: PropTypes.node,
  isCardTitleDescription: PropTypes.bool,
  isDisabled: PropTypes.bool,
  t: PropTypes.func,
  useGraphMetrics: PropTypes.func,
  useProduct: PropTypes.func,
  useProductGraphConfig: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useProduct: Function, t: Function, useProductGraphConfig: Function, children: Node, isDisabled: boolean,
 *     useGraphMetrics: Function, isCardTitleDescription: boolean}}
 */
GraphCard.defaultProps = {
  children: null,
  isCardTitleDescription: false,
  isDisabled: helpers.UI_DISABLED_GRAPH,
  t: translate,
  useGraphMetrics,
  useProduct,
  useProductGraphConfig
};

export { GraphCard as default, GraphCard };
