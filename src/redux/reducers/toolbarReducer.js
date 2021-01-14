import { reduxTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';

/**
 * Initial state.
 *
 * @private
 * @type {{filters: {}}}
 */
const initialState = {
  filters: {}
};

/**
 * Apply user observer/reducer logic for toolbar to state, against actions.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object|{}}
 */
const toolbarReducer = (state = initialState, action) => {
  switch (action.type) {
    /*
    case reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.USAGE]:
      const updatedActiveFiltersUsage = new Set(state.filters?.[action.viewId]?.activeFilters).add(
        action[RHSM_API_QUERY_TYPES.USAGE]
      );

      return reduxHelpers.setStateProp(
        'filters',
        {
          [action.viewId]: {
            ...state.filters[action.viewId],
            activeFilters: updatedActiveFiltersUsage
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.SLA]:
      const updatedActiveFiltersSla = new Set(state.filters?.[action.viewId]?.activeFilters).add(
        action[RHSM_API_QUERY_TYPES.SLA]
      );

      return reduxHelpers.setStateProp(
        'filters',
        {
          [action.viewId]: {
            ...state.filters[action.viewId],
            activeFilters: updatedActiveFiltersSla
          }
        },
        {
          state,
          reset: false
        }
      );
    */
    case reduxTypes.toolbar.SET_ACTIVE_FILTERS:
      return reduxHelpers.setStateProp(
        'filters',
        {
          [action.viewId]: {
            ...state.filters[action.viewId],
            // activeFilters: action.activeFilters
            c: new Set(state.filters?.[action.viewId]?.chipGroupSequence).add(action.currentFilter)
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.toolbar.SET_FILTER_TYPE:
      return reduxHelpers.setStateProp(
        'filters',
        {
          [action.viewId]: {
            ...state.filters[action.viewId],
            currentFilter: action.currentFilter
            // chipGroupSequence: new Set(state.filters?.[action.viewId]?.chipGroupSequence).add(action.currentFilter)
          }
        },
        {
          state,
          reset: false
        }
      );
    default:
      return state;
  }
};

toolbarReducer.initialState = initialState;

export { toolbarReducer as default, initialState, toolbarReducer };
