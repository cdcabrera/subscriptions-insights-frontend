import { createSelector as reselectCreateSelector } from 'reselect';
import { queryFilter as graphCardQueryFilter, selector as graphCardSelector } from './graphCardSelectors';

/**
 * Return a combined state, props object.
 *
 * @private
 * @param {object} state
 * @param {object} props
 * @returns {object}
 */
const statePropsFilter = (state, props = {}) => ({
  ...state.dailyGraph?.reportCapacity?.[props.productId],
  ...{
    viewId: props.viewId,
    productId: props.productId
  }
});

/**
 * Return a combined query object.
 *
 * @param {object} state
 * @param {object} props
 * @returns {object}
 */
const queryFilter = graphCardQueryFilter;

/**
 * Selector callback, parse data.
 *
 * @param {object} response
 * @param {object} query
 * @returns {{pending: (*|boolean), query: object, fulfilled: boolean, graphData: object, error: (*|boolean), status: *}}
 */
const selector = graphCardSelector;

/**
 * Create selector, transform combined state, props into a consumable graph/charting object.
 *
 * @type {{pending: boolean, fulfilled: boolean, graphData: object, error: boolean, status: (*|number)}}
 */
const createSelector = reselectCreateSelector([statePropsFilter, queryFilter], selector);

/**
 * Expose selector instance. For scenarios where a selector is reused across component instances.
 *
 * @param {object} defaultProps
 * @returns {{pending: boolean, fulfilled: boolean, graphData: object, error: boolean, status: (*|number)}}
 */
const makeSelector = defaultProps => (state, props) => ({
  ...createSelector(state, props, defaultProps)
});

const dailyGraphCardSelectors = {
  statePropsFilter,
  queryFilter,
  selector,
  dailyGraphCard: createSelector,
  makeDailyGraphCard: makeSelector
};

export {
  dailyGraphCardSelectors as default,
  dailyGraphCardSelectors,
  statePropsFilter,
  queryFilter,
  selector,
  makeSelector
};
