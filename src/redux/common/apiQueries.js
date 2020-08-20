import { rhsmApiTypes } from '../../types/rhsmApiTypes';
import { reduxHelpers } from './reduxHelpers';

/**
 * Parse a query object against a schema for specific RHSM endpoints.
 *
 * @param {object} query
 * @returns {{query: {}, graphQuery: {}, inventoryQuery: {}, toolbarQuery: {}}}
 */
const parseRhsmQuery = (query = {}) => {
  const graphQuery = reduxHelpers.setApiQuery(query, rhsmApiTypes.RHSM_API_QUERY_SET_REPORT_CAPACITY_TYPES);
  const inventoryQuery = reduxHelpers.setApiQuery(query, rhsmApiTypes.RHSM_API_QUERY_SET_INVENTORY_TYPES);

  return {
    query,
    graphQuery,
    inventoryQuery,
    toolbarQuery: query
  };
};

const apiQueries = {
  parseRhsmQuery
};

export { apiQueries as default, apiQueries };
