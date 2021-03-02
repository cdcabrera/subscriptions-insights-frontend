/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardHeader, CardActions, CardBody, Title } from '@patternfly/react-core';
import { useShallowCompareEffect } from 'react-use';
import { connect, reduxActions, reduxSelectors } from '../../redux';
import { helpers } from '../../common';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { Loader } from '../loader/loader';
import { MinHeight } from '../minHeight/minHeight';
import { translate } from '../i18n/i18n';
import { useGraphTallyQuery } from '../productView/productContext';
import { GraphCardChart } from './graphCardChart';

/**
 * A chart/graph card.
 *
 * @param {object} props
 * @param {string} props.cardTitle
 * @param {Node} props.children
 * @param {boolean} props.error
 * @param {Function} props.getGraphReportsCapacity
 * @param {object} props.graphData
 * @param {boolean} props.isDisabled
 * @param {boolean} props.pending
 * @param {string} props.productId
 * @returns {Node}
 */
const GraphCard = ({
  cardTitle,
  children,
  error,
  getGraphReportsCapacity,
  graphData,
  isDisabled,
  pending,
  productId
}) => {
  const updatedQuery = useGraphTallyQuery(productId);
  const {
    [RHSM_API_QUERY_TYPES.GRANULARITY]: granularity,
    [RHSM_API_QUERY_TYPES.START_DATE]: startDate,
    [RHSM_API_QUERY_TYPES.END_DATE]: endDate
  } = updatedQuery;

  useShallowCompareEffect(() => {
    if (!isDisabled && granularity && startDate && endDate && productId) {
      getGraphReportsCapacity(productId, updatedQuery);
    }
  }, [getGraphReportsCapacity, isDisabled, granularity, startDate, endDate, productId, updatedQuery]);

  if (isDisabled) {
    return null;
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
          <CardActions className={(error && 'blur') || ''}>{children}</CardActions>
        </CardHeader>
      </MinHeight>
      <MinHeight key="bodyMinHeight">
        <CardBody>
          <div className={(error && 'blur') || (pending && 'fadein') || ''}>
            {pending && <Loader variant="graph" />}
            {!pending && <GraphCardChart granularity={granularity} graphData={graphData} productId={productId} />}
          </div>
        </CardBody>
      </MinHeight>
    </Card>
  );
};

/**
 * Prop types.
 *
 * @type {{productLabel: string, productId: string, pending: boolean, error: boolean, query: object,
 *     cardTitle: string, filterGraphData: Array, getGraphReportsCapacity: Function,
 *     viewId: string, t: Function, children: Node, graphData: object, isDisabled: boolean}}
 */
GraphCard.propTypes = {
  cardTitle: PropTypes.string,
  children: PropTypes.node,
  error: PropTypes.bool,
  getGraphReportsCapacity: PropTypes.func,
  graphData: PropTypes.object,
  isDisabled: PropTypes.bool,
  pending: PropTypes.bool,
  productId: PropTypes.string.isRequired
};

/**
 * Default props.
 *
 * @type {{getGraphReportsCapacity: Function, productLabel: string, viewId: string, t: translate,
 *     children: Node, pending: boolean, graphData: object, isDisabled: boolean, error: boolean,
 *     cardTitle: string, filterGraphData: Array}}
 */
GraphCard.defaultProps = {
  cardTitle: null,
  children: null,
  error: false,
  getGraphReportsCapacity: helpers.noop,
  graphData: {},
  isDisabled: helpers.UI_DISABLED_GRAPH,
  pending: false
};

/**
 * Apply actions to props.
 *
 * @param {Function} dispatch
 * @returns {object}
 */
const mapDispatchToProps = dispatch => ({
  getGraphReportsCapacity: (id, query) => dispatch(reduxActions.rhsm.getGraphReportsCapacity(id, query))
});

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.graphCard.makeGraphCard();

const ConnectedGraphCard = connect(makeMapStateToProps, mapDispatchToProps)(GraphCard);

export { ConnectedGraphCard as default, ConnectedGraphCard, GraphCard };
