import { rhsmApiTypes } from '../../types/rhsmApiTypes';
import { reduxHelpers } from './reduxHelpers';

/**
 * Parse a query object against a schema for specific RHSM endpoints.
 *
 * @param {object} query
 * @returns {{query: {}, guestsQuery: {}, graphQuery: {}, inventoryQuery: {}, toolbarQuery: {}}}
 */
const parseRhsmQuery = (query = {}) => {
  const graphQuery = reduxHelpers.setApiQuery(query, rhsmApiTypes.RHSM_API_QUERY_SET_REPORT_CAPACITY_TYPES);
  const guestsQuery = reduxHelpers.setApiQuery(query, rhsmApiTypes.RHSM_API_QUERY_SET_INVENTORY_GUESTS_TYPES);
  const inventoryQuery = reduxHelpers.setApiQuery(query, rhsmApiTypes.RHSM_API_QUERY_SET_INVENTORY_TYPES);
  const pagingQuery = reduxHelpers.setApiQuery(query, rhsmApiTypes.RHSM_API_QUERY_SET_PAGING_TYPES);

  return {
    query,
    graphQuery,
    guestsQuery,
    inventoryQuery,
    pagingQuery,
    toolbarQuery: query
  };
};

const apiQueries = {
  parseRhsmQuery
};

export { apiQueries as default, apiQueries };
