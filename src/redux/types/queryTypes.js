import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';

const SET_QUERY_CLEAR = 'SET_QUERY_CLEAR';
const SET_QUERY_CLEAR_INVENTORY_LIST = 'SET_QUERY_CLEAR_INVENTORY_LIST';

const SET_QUERY_RHSM_TYPES = {
  [RHSM_API_QUERY_TYPES.DIRECTION]: `SET_QUERY_RHSM_${RHSM_API_QUERY_TYPES.DIRECTION}`,
  [RHSM_API_QUERY_TYPES.GRANULARITY]: `SET_QUERY_RHSM_${RHSM_API_QUERY_TYPES.GRANULARITY}`,
  [RHSM_API_QUERY_TYPES.LIMIT]: `SET_QUERY_RHSM_${RHSM_API_QUERY_TYPES.LIMIT}`,
  [RHSM_API_QUERY_TYPES.OFFSET]: `SET_QUERY_RHSM_${RHSM_API_QUERY_TYPES.OFFSET}`,
  [RHSM_API_QUERY_TYPES.SORT]: `SET_QUERY_RHSM_${RHSM_API_QUERY_TYPES.SORT}`,
  [RHSM_API_QUERY_TYPES.SLA]: `SET_QUERY_RHSM_${RHSM_API_QUERY_TYPES.SLA}`,
  [RHSM_API_QUERY_TYPES.UOM]: `SET_QUERY_RHSM_${RHSM_API_QUERY_TYPES.UOM}`,
  [RHSM_API_QUERY_TYPES.USAGE]: `SET_QUERY_RHSM_${RHSM_API_QUERY_TYPES.USAGE}`
};

/**
 * Query/filter reducer types.
 *
 * @type {{SET_QUERY_RHSM_TYPES: object, SET_QUERY_CLEAR: string, SET_QUERY_CLEAR_INVENTORY_LIST: string}}
 */
const queryTypes = {
  SET_QUERY_CLEAR,
  SET_QUERY_CLEAR_INVENTORY_LIST,
  SET_QUERY_RHSM_TYPES
};

export { queryTypes as default, queryTypes, SET_QUERY_CLEAR, SET_QUERY_CLEAR_INVENTORY_LIST, SET_QUERY_RHSM_TYPES };
