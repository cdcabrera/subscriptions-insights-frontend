import React from 'react';
import PropTypes from 'prop-types';
import {Card, CardTitle, CardHeader, CardActions, CardBody, Title, Flex, FlexItem, CardFooter} from '@patternfly/react-core';
import { useShallowCompareEffect } from 'react-use';
import { connect, reduxActions, reduxSelectors } from '../../redux';
import { useProduct, useProductGraphConfig, useProductGraphTallyQuery } from '../productView/productViewContext';
import { helpers } from '../../common';
import RHSM_API_PATH_METRIC_ID_TYPES, { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
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
const GraphCardLayoutFacets = ({
  // cardTitle,
  // children,
  error,
  getGraphTally,
  graphData,
  // meta,
  metricFilter,
  // isDisabled,
  pending,
  useProduct: useAliasProduct,
  // useProductGraphConfig: useAliasProductGraphConfig,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery
}) => {
  // THIS SHOULD BE A SINGLE STANDALONE FACET... loop this component at "graphCard.js"
  const { productId } = useAliasProduct();
  // const { filters, settings } = useAliasProductGraphConfig();
  const query = useAliasProductGraphTallyQuery();
  // const standaloneFacets = filters.filter(({ isStandalone }) => isStandalone === true);
  // const regularFacets = filters.filter(({ isStandalone }) => isStandalone !== true);

  // console.log('FACETS CARD >>>', standaloneFacets, regularFacets);
  useShallowCompareEffect(() => {
    const {
      [RHSM_API_QUERY_TYPES.START_DATE]: startDate,
      [RHSM_API_QUERY_TYPES.END_DATE]: endDate,
      [RHSM_API_QUERY_TYPES.GRANULARITY]: granularity
    } = query;

    const { id: metric } = metricFilter;

    if (granularity && startDate && endDate && metric && productId) {
      // need to reconsider where this is called... "regular card" which would group all the metrics vs "facet card" which would only need a single metric
      getGraphTally({ id: productId, metric }, query);
    }
  }, [getGraphTally, metricFilter, productId, query]);

  return (
    <Flex className="curiosity-usage-graph-facets">
      <Flex flex={{ default: 'flex_1' }} direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfStretch' }}>
        <FlexItem className="curiosity-usage-graph-facets__facet-column">
          <Card className="curiosity-usage-graph-facets__facet-card fadein">
            <CardTitle>Today's data transfer</CardTitle>
            <CardBody>
              <strong>62</strong>Gibibytes
            </CardBody>
            <CardFooter>
              <small>Last update Sep 13, 2021 8:00 AM</small>
            </CardFooter>
          </Card>
          <Card className="curiosity-usage-graph-facets__facet-card fadein">
            <CardTitle>This month's data transfer</CardTitle>
            <CardBody>
              <strong>934</strong>Gibibytes
            </CardBody>
            <CardFooter>
              <small>Last update Sep 13, 2021 8:00 AM</small>
            </CardFooter>
          </Card>
        </FlexItem>
      </Flex>
      <Flex flex={{ default: 'flex_3' }} direction={{ default: 'column' }}>
        <FlexItem className="curiosity-usage-graph-facets__graph-column">
          <Card className="curiosity-usage-graph-facets__graph-card fadein">
            <MinHeight key="graphHeaderMinHeight">
              <CardHeader>
                <CardTitle>Test title</CardTitle>
              </CardHeader>
            </MinHeight>
            <MinHeight key="graphBodyMinHeight">
              <CardBody>
                <div className={(error && 'blur') || (pending && 'fadein') || ''}>
                  {pending && <Loader variant="graph" />}
                  {!pending && <GraphCardChart graphData={graphData} />}
                </div>
              </CardBody>
            </MinHeight>
          </Card>
        </FlexItem>
      </Flex>
    </Flex>
  );

  /*
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

  return <React.Fragment>{regularFacets.length && regularCard()}</React.Fragment>;
  */
};

/**
 * Prop types.
 *
 * @type {{getGraphReportsCapacity: Function, useProduct: Function, useProductGraphTallyQuery: Function,
 *     useProductGraphConfig: Function, children: Node, meta: object, pending: boolean, graphData: object,
 *     isDisabled: boolean, error: boolean, cardTitle: Node}}
 */
GraphCardLayoutFacets.propTypes = {
  cardTitle: PropTypes.node,
  children: PropTypes.node,
  error: PropTypes.bool,
  getGraphTally: PropTypes.func,
  graphData: PropTypes.object,
  isDisabled: PropTypes.bool,
  meta: PropTypes.object,
  metricFilter: PropTypes.shape({
    id: PropTypes.oneOf(Object.values(RHSM_API_PATH_METRIC_ID_TYPES)).isRequired
  }).isRequired,
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
GraphCardLayoutFacets.defaultProps = {
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

const ConnectedGraphCardFacets = connect(makeMapStateToProps, mapDispatchToProps)(GraphCardLayoutFacets);

export { ConnectedGraphCardFacets as default, ConnectedGraphCardFacets, GraphCardLayoutFacets };
