import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardHeader, CardActions, CardBody, Title } from '@patternfly/react-core';
import { useDeepCompareEffect, useShallowCompareEffect } from 'react-use';
import { connect, reduxActions, reduxSelectors } from '../../redux';
import { helpers } from '../../common';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES, RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { Loader } from '../loader/loader';
import { MinHeight } from '../minHeight/minHeight';
import { translate } from '../i18n/i18n';
import { GraphCardChart } from './graphCardChart';

/**
 * A chart/graph card.
 *
 * @param {object} props
 * @param {string} props.cardTitle
 * @param {Node} props.children
 * @param {boolean} props.error
 * @param {Array} props.filterGraphData
 * @param {boolean} props.fulfilled
 * @param {Function} props.getGraphReportsCapacity
 * @param {object} props.graphData
 * @param {boolean} props.isDisabled
 * @param {boolean} props.pending
 * @param {string} props.productId
 * @param {string} props.productLabel
 * @param {object} props.query
 * @param {string} props.viewId
 * @returns {Node}
 */
const GraphCard = ({
  cardTitle,
  children,
  error,
  filterGraphData,
  getGraphReportsCapacity,
  graphData,
  isDisabled,
  pending,
  productId,
  productLabel,
  query,
  viewId
}) => {
  // const { pending, fulfilled, error } = useSelector(({ graph }) => graph?.reportCapacity?.[productId], {});
  const [updatedGraphData, setUpdatedGraphData] = React.useState(graphData);
  const {
    [RHSM_API_QUERY_TYPES.START_DATE]: startDate,
    [RHSM_API_QUERY_TYPES.END_DATE]: endDate,
    [RHSM_API_QUERY_TYPES.GRANULARITY]: granularity
  } = query;

  useShallowCompareEffect(() => {
    if (!isDisabled && startDate && endDate && granularity && productId) {
      getGraphReportsCapacity(productId, query);
    }
  }, [isDisabled, startDate, endDate, granularity, productId, getGraphReportsCapacity, query]);

  useDeepCompareEffect(() => {
    setUpdatedGraphData(graphData);
  }, [graphData]);

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
            {!pending && (
              <GraphCardChart
                filterGraphData={filterGraphData}
                granularity={granularity}
                graphData={updatedGraphData}
                productLabel={productLabel}
                viewId={viewId}
              />
            )}
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
  filterGraphData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      fill: PropTypes.string,
      stroke: PropTypes.string
    })
  ),
  // fulfilled: PropTypes.bool,
  getGraphReportsCapacity: PropTypes.func,
  graphData: PropTypes.object,
  query: PropTypes.shape({
    [RHSM_API_QUERY_TYPES.GRANULARITY]: PropTypes.oneOf([...Object.values(GRANULARITY_TYPES)]).isRequired,
    [RHSM_API_QUERY_TYPES.START_DATE]: PropTypes.string.isRequired,
    [RHSM_API_QUERY_TYPES.END_DATE]: PropTypes.string.isRequired
  }).isRequired,
  isDisabled: PropTypes.bool,
  pending: PropTypes.bool,
  productId: PropTypes.string.isRequired,
  productLabel: PropTypes.string,
  t: PropTypes.func,
  viewId: PropTypes.string
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
  filterGraphData: [],
  // fulfilled: false,
  getGraphReportsCapacity: helpers.noop,
  graphData: {},
  isDisabled: helpers.UI_DISABLED_GRAPH,
  pending: false,
  productLabel: '',
  t: translate,
  viewId: 'graphCard'
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

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
// const makeMapStateToProps = reduxSelectors.graphCard.makeGraphCard();
/*
const mapStateToProps = (state, props) => {
  const { graphTallyQuery: query } = apiQueries.parseRhsmQuery(
    {
      ...props.query,
      ...state.view?.query?.[props.productId],
      ...state.view?.query?.[props.viewId]
    },
    {
      graphTallyQuery: { ...state.view?.graphTallyQuery?.[props.viewId] }
    }
  );

  return { ...state.graph?.reportCapacity?.[props.productId], query };
};
*/
/*
const makeMapStateToProps = () => (state, props) => {
  const { graphTallyQuery: query } = apiQueries.parseRhsmQuery(
    {
      ...props.query,
      ...state.view?.query?.[props.productId],
      ...state.view?.query?.[props.viewId]
    },
    {
      graphTallyQuery: { ...state.view?.graphTallyQuery?.[props.viewId] }
    }
  );
  const { pending, fulfilled, error } = state.graph?.reportCapacity?.[props.productId] || {};

  return { pending, fulfilled, error, query };
};
*/

/*
const mapStateToProps = (state, props) => {
  const { graphTallyQuery: query } = apiQueries.parseRhsmQuery(
    {
      ...props.query,
      ...state.view?.query?.[props.productId],
      ...state.view?.query?.[props.viewId]
    },
    {
      graphTallyQuery: { ...state.view?.graphTallyQuery?.[props.viewId] }
    }
  );
  const { pending, fulfilled, error } = state.graph?.reportCapacity?.[props.productId];

  return { pending, fulfilled, error, query };
};
*/
