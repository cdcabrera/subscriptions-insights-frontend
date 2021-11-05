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
// import { helpers } from '../../common';
import { Loader } from '../loader/loader';
import { MinHeight } from '../minHeight/minHeight';
import { GraphCardChart } from './graphCardChart';
import { useGraphCardContext, useGraphMetrics } from './graphCardContext';
import { translate } from '../i18n/i18n';
import rhsmConstants from '../../services/rhsm/rhsmConstants';

/**
 * A chart/graph card.
 *
 * @param {object} props
 * @param {boolean} props.isCardTitleDescription
 * @param {Array} props.metricIds
 * @param {Function} props.t
 * @param {Function} props.useGraphMetrics
 * @param {Function} props.useProduct
 * @param {Function} props.useProductGraphConfig
 * @returns {Node}
 */
const GraphCardMetrics = ({
  isCardTitleDescription,
  metricIds,
  t,
  useGraphMetrics: useAliasGraphMetrics,
  useProduct: useAliasProduct,
  useProductGraphConfig: useAliasProductGraphConfig
}) => {
  const { settings = { groupedFilters: [] } } = useGraphCardContext();
  const { productId } = useAliasProduct();
  // const { settings, filters } = useAliasProductGraphConfig();
  // const { settings } = useAliasProductGraphConfig();
  // const filteredMetrics = filters.filter(({ isStandalone }) => isStandalone !== true);
  const { error, pending, metrics } = {}; // useAliasGraphMetrics(metricIds);

  if (!settings.groupedFilters.length) {
    return null;
  }

  let actionDisplay = null;
  let actionField = null;

  if (typeof settings?.actionDisplay === 'function') {
    actionDisplay = settings.actionDisplay({ data: metrics });
  }

  if (typeof settings?.actionField === 'function') {
    actionField = settings.actionField({ data: metrics });
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
          {(actionDisplay || actionField) && (
            <CardActions className={(error && 'blur') || ''}>
              <React.Fragment key="actionDisplay">{actionDisplay}</React.Fragment>
              <React.Fragment key="actionField">{actionField}</React.Fragment>
            </CardActions>
          )}
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
  );
};

/**
 * Prop types.
 *
 * @type {{useProduct: Function, t: Function, useProductGraphConfig: Function, isDisabled: boolean,
 *     useGraphMetrics: Function, isCardTitleDescription: boolean}}
 */
GraphCardMetrics.propTypes = {
  isCardTitleDescription: PropTypes.bool,
  metricIds: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOf([...Object.values(rhsmConstants.RHSM_API_PATH_METRIC_TYPES)])
    })
  ),
  t: PropTypes.func,
  useGraphMetrics: PropTypes.func,
  useProduct: PropTypes.func,
  useProductGraphConfig: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useProduct: Function, t: Function, useProductGraphConfig: Function, isDisabled: boolean,
 *     useGraphMetrics: Function, isCardTitleDescription: boolean}}
 */
GraphCardMetrics.defaultProps = {
  isCardTitleDescription: false,
  metricIds: [],
  t: translate,
  useGraphMetrics,
  useProduct,
  useProductGraphConfig
};

export { GraphCardMetrics as default, GraphCardMetrics };
