import React from 'react';
import PropTypes from 'prop-types';
/*
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
 */
// import InfoCircleIcon from '@patternfly/react-icons/dist/js/icons/info-circle-icon';
import { useProductGraphConfig } from '../productView/productViewContext';
import { helpers } from '../../common';
// import { Loader } from '../loader/loader';
// import { MinHeight } from '../minHeight/minHeight';
// import { GraphCardChart } from './graphCardChart';
// import { useGraphMetrics } from './graphCardContext';
// import { translate } from '../i18n/i18n';
import { GraphCardMetrics } from './graphCardMetrics';
import { GraphCardMetric } from './graphCardMetric';

/**
 * A chart/graph card.
 *
 * @param {object} props
 * @param {boolean} props.isDisabled
 * @param {Function} props.useProductGraphConfig
 * @returns {Node}
 */
const GraphCard = ({ isDisabled, useProductGraphConfig: useAliasProductGraphConfig }) => {
  const { filters } = useAliasProductGraphConfig();

  if (isDisabled) {
    return null;
  }

  const groupedMetricIds = filters.filter(({ isStandalone }) => isStandalone !== true);
  const standaloneMetricIds = filters.filter(({ isStandalone }) => isStandalone === true);

  console.log('FILTERED >>>', standaloneMetricIds);

  return (
    <React.Fragment>
      {groupedMetricIds.length > 0 && <GraphCardMetrics metricIds={groupedMetricIds} />}
      {standaloneMetricIds.length > 0 &&
        standaloneMetricIds.map(metric => <GraphCardMetric key={`graphcard_${metric.id}`} metric={metric} />)}
    </React.Fragment>
  );
};

/**
 * Prop types.
 *
 * @type {{useProduct: Function, t: Function, useProductGraphConfig: Function, isDisabled: boolean,
 *     useGraphMetrics: Function, isCardTitleDescription: boolean}}
 */
GraphCard.propTypes = {
  // isCardTitleDescription: PropTypes.bool,
  isDisabled: PropTypes.bool,
  // t: PropTypes.func,
  // useGraphMetrics: PropTypes.func,
  // useProduct: PropTypes.func,
  useProductGraphConfig: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useProduct: Function, t: Function, useProductGraphConfig: Function, isDisabled: boolean,
 *     useGraphMetrics: Function, isCardTitleDescription: boolean}}
 */
GraphCard.defaultProps = {
  // isCardTitleDescription: false,
  isDisabled: helpers.UI_DISABLED_GRAPH,
  // t: translate,
  // useGraphMetrics,
  // useProduct,
  useProductGraphConfig
};

export { GraphCard as default, GraphCard };
