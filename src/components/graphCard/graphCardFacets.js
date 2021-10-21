import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardHeader, CardActions, CardBody, Title } from '@patternfly/react-core';
import { useShallowCompareEffect } from 'react-use';
import { connect, reduxActions, reduxSelectors } from '../../redux';
import { useProduct, useProductGraphConfig, useProductGraphTallyQuery } from '../productView/productViewContext';
import { helpers } from '../../common';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { Loader } from '../loader/loader';
import { MinHeight } from '../minHeight/minHeight';
import { GraphCardChart } from './graphCardChart';

/**
 * A chart/graph card.
 * This card makes use of the new Tally API response format. Eventually this component will replace "GraphCard".
 *
 * @param {object} props
 * @param {Node} props.cardTitle
 * @param {Node} props.children
 * @param {boolean} props.error
 * @param {Function} props.getGraphTally
 * @param {object} props.graphData
 * @param {object} props.meta
 * @param {boolean} props.isDisabled
 * @param {boolean} props.pending
 * @param {Function} props.useProduct
 * @param {Function} props.useProductGraphConfig
 * @param {Function} props.useProductGraphTallyQuery
 * @returns {Node}
 */
const GraphCardFacets = ({
  cardTitle,
  children,
  error,
  getGraphTally,
  graphData,
  meta,
  isDisabled,
  pending,
  useProduct: useAliasProduct,
  useProductGraphConfig: useAliasProductGraphConfig,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery
}) => {
  const { productId } = useAliasProduct();
  const { filters, settings } = useAliasProductGraphConfig();
  const query = useAliasProductGraphTallyQuery();

  useShallowCompareEffect(() => {
    const {
      [RHSM_API_QUERY_TYPES.START_DATE]: startDate,
      [RHSM_API_QUERY_TYPES.END_DATE]: endDate,
      [RHSM_API_QUERY_TYPES.GRANULARITY]: granularity
    } = query;

    if (!isDisabled && filters.length && granularity && startDate && endDate && productId) {
      // need to reconsider where this is called... "regular card" which would group all the metrics vs "facet card" which would only need a single metric
      getGraphTally(
        filters.map(({ id: metric }) => ({ id: productId, metric })),
        query
      );
    }
  }, [filters, getGraphTally, isDisabled, productId, query]);

  if (isDisabled) {
    return null;
  }

  const standaloneFacets = filters.filter(({ isStandalone }) => isStandalone === true);
  const regularFacets = filters.filter(({ isStandalone }) => isStandalone !== true);

  const regularCard = () => {
    let actionDisplay = null;

    if (typeof settings?.actionDisplay === 'function') {
      actionDisplay = settings.actionDisplay({ data: { ...graphData }, meta: { ...meta } });
    }

    return (
      <Card className="curiosity-usage-facet-graph">
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
              {!pending && <GraphCardChart graphData={regularFacets} />}
            </div>
          </CardBody>
        </MinHeight>
      </Card>
    );
  };

  return <React.Fragment>{regularFacets.length && regularCard()}</React.Fragment>
};

/**
 * Prop types.
 *
 * @type {{getGraphReportsCapacity: Function, useProduct: Function, useProductGraphTallyQuery: Function,
 *     useProductGraphConfig: Function, children: Node, meta: object, pending: boolean, graphData: object,
 *     isDisabled: boolean, error: boolean, cardTitle: Node}}
 */
GraphCardFacets.propTypes = {
  cardTitle: PropTypes.node,
  children: PropTypes.node,
  error: PropTypes.bool,
  getGraphTally: PropTypes.func,
  graphData: PropTypes.object,
  isDisabled: PropTypes.bool,
  meta: PropTypes.object,
  pending: PropTypes.bool,
  useProduct: PropTypes.func,
  useProductGraphConfig: PropTypes.func,
  useProductGraphTallyQuery: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{getGraphReportsCapacity: Function, useProduct: Function, useProductGraphTallyQuery: Function,
 *     useProductGraphConfig: Function, children: Node, meta: object, pending: boolean, graphData: object,
 *     isDisabled: boolean, error: boolean, cardTitle: Node}}
 */
GraphCardFacets.defaultProps = {
  cardTitle: null,
  children: null,
  error: false,
  getGraphTally: helpers.noop,
  graphData: {},
  isDisabled: helpers.UI_DISABLED_GRAPH,
  meta: {},
  pending: false,
  useProduct,
  useProductGraphConfig,
  useProductGraphTallyQuery
};

/**
 * Apply actions to props.
 *
 * @param {Function} dispatch
 * @returns {object}
 */
const mapDispatchToProps = dispatch => ({
  getGraphTally: (id, query) => dispatch(reduxActions.rhsm.getGraphTally(id, query))
});

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.graph.makeGraph();

const ConnectedGraphCardColumns = connect(makeMapStateToProps, mapDispatchToProps)(GraphCardFacets);

export { ConnectedGraphCardColumns as default, ConnectedGraphCardColumns, GraphCardFacets };
