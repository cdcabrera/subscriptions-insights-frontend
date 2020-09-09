import { createSelectorCreator, defaultMemoize } from 'reselect';
import _isEqual from 'lodash/isEqual';
import { apiQueries } from '../common';

/**
 * Create a custom "are objects equal" selector.
 *
 * @private
 * @type {Function}}
 */
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, _isEqual);

/**
 * Return a combined state, props object.
 *
 * @private
 * @param {object} state
 * @param {object} props
 * @param {object} defaultProps
 * @returns {object}
 */
const statePropsFilter = (state = {}, props, defaultProps = {}) => {
  const productQuery = state.view?.query?.[props.productId];
  const viewQuery = state.view?.query?.[props.viewId || defaultProps.viewId];
  const { pagingQuery } = apiQueries.parseRhsmQuery(productQuery);
  const inventoryQuery = {};

  if (productQuery) {
    const { inventoryQuery: updatedPagingQuery } = apiQueries.parseRhsmQuery(productQuery);
    Object.assign(inventoryQuery, updatedPagingQuery);
  }

  if (viewQuery) {
    const { inventoryQuery: updatedViewQuery } = apiQueries.parseRhsmQuery(viewQuery);
    Object.assign(inventoryQuery, updatedViewQuery);
  }

  Object.keys(pagingQuery).forEach(key => delete inventoryQuery[key]);

  return {
    pagingQuery
    // inventoryQuery
  };
};
/*
({

  productQuery: state.view?.query?.[props.productId] || {},
  viewQuery: state.view?.query?.[props.viewId || defaultProps.viewId] || {}
});
*/

const statePropsFilterOLD = (state = {}, props, defaultProps = {}) => {
  const productQuery = state.view?.query?.[props.productId];
  const viewQuery = state.view?.query?.[props.viewId || defaultProps.viewId];
  const { pagingQuery } = apiQueries.parseRhsmQuery(productQuery);

  const query = {
    ...pagingQuery
  };

  const inventoryQuery = {};

  if (productQuery) {
    const { inventoryQuery: updatedPagingQuery } = apiQueries.parseRhsmQuery(productQuery);
    Object.assign(inventoryQuery, updatedPagingQuery);
  }

  if (viewQuery) {
    const { inventoryQuery: updatedViewQuery } = apiQueries.parseRhsmQuery(viewQuery);
    Object.assign(inventoryQuery, updatedViewQuery);
  }

  Object.keys(query).forEach(key => delete inventoryQuery[key]);

  /*
  Object.entries(query).forEach(([value, key]) => {
    if (inventoryQuery[key]) {

    }
  });
  */

  /*
  if (productQuery) {
    const { pagingQuery: updatedPagingQuery } = apiQueries.parseRhsmQuery(productQuery);
    Object.assign(query, updatedPagingQuery);
  }

  if (viewQuery) {
    const { pagingQuery: updatedViewQuery } = apiQueries.parseRhsmQuery(viewQuery);
    Object.assign(query, updatedViewQuery);
  }
  */

  console.log('SEL >>>', inventoryQuery, query);

  return { query, inventoryQuery };
};

/*
({
  query: {
    ...state.view?.query?.[props.productId],
    ...state.view?.query?.[props.viewId || defaultProps.viewId]
  }
});
*/

/**
 * Create selector, transform combined state, props into a consumable API param/query object.
 *
 * @type {{query: object}}
 */
const selector = createDeepEqualSelector([statePropsFilter], ({ pagingQuery }) => {
  return {
    query: pagingQuery
  };
});

/*
({
  query,
  inventoryQuery
}));
*/

/**
 * Expose selector instance. For scenarios where a selector is reused across component instances.
 *
 * @param {object} defaultProps
 * @returns {{query: object}}
 */
const makeSelector = defaultProps => (state, props) => ({
  ...selector(state, props, defaultProps)
});

const pagingSelectors = {
  paging: selector,
  makePaging: makeSelector
};

export { pagingSelectors as default, pagingSelectors, selector, makeSelector };
