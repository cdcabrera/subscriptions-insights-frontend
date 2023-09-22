import { RHSM_API_QUERY_SET_TYPES } from './rhsmConstants';

/**
 * @memberof Rhsm
 * @module RhsmHelpers
 */

/**
 * ToDo: remove filterArchitectureVariant when the API supports architecture, variant params
 */
/**
 * Patch for returning a made up API architecture, variant param as a product ID
 *
 * @deprecated The new ToolbarFieldGroupVariant replaces this filter field. We're maintaining this
 *     functionality in the short-term as part of a phased removal with the removed "toolbarFieldVariant"
 *     component, and related Redux reducer and type.
 * @param {string} id
 * @param {object} params
 * @returns {string}
 */
const filterArchitectureVariant = (id, params = {}) => {
  const updatedId = id;

  if (params?.[RHSM_API_QUERY_SET_TYPES.VARIANT]?.length) {
    return params?.[RHSM_API_QUERY_SET_TYPES.VARIANT];
  }

  return updatedId;
};

const rhsmHelpers = {
  filterArchitectureVariant
};

export { rhsmHelpers as default, rhsmHelpers, filterArchitectureVariant };
