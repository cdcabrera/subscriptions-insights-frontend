import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, TooltipPosition } from '@patternfly/react-core';
import InfoCircleIcon from '@patternfly/react-icons/dist/js/icons/info-circle-icon';
import { useProduct } from '../productView/productViewContext';
import { useGraphCardContext } from './graphCardContext';
import { translate } from '../i18n/i18n';

/**
 * Graph card title tooltip.
 *
 * @param {object} props
 * @param {Function} props.t
 * @param {Function} props.useGraphCardContext
 * @param {Function} props.useProduct
 * @returns {Node}
 */
const GraphCardChartTitleTooltip = ({
  t,
  useGraphCardContext: useAliasGraphCardContext,
  useProduct: useAliasProduct
}) => {
  const { productId } = useAliasProduct();
  const { settings = {} } = useAliasGraphCardContext();
  const { isCardTitleDescription, metric } = settings;
  const standaloneMetricId = (metric?.id && `_${metric?.id}`) || '';

  if (!isCardTitleDescription) {
    return null;
  }

  return (
    <Tooltip
      content={<p>{t(`curiosity-graph.cardHeadingDescription${standaloneMetricId}`, { context: productId })}</p>}
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
};

/**
 * Prop types.
 *
 * @type {{useGraphCardContext: Function, useProduct: Function, t: Function}}
 */
GraphCardChartTitleTooltip.propTypes = {
  t: PropTypes.func,
  useProduct: PropTypes.func,
  useGraphCardContext: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useGraphCardContext: Function, useProduct: Function, t: Function}}
 */
GraphCardChartTitleTooltip.defaultProps = {
  t: translate,
  useProduct,
  useGraphCardContext
};

export { GraphCardChartTitleTooltip as default, GraphCardChartTitleTooltip };
