import { rhsmTypes, graphTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';

/**
 * Initial state.
 *
 * @private
 * @type {{reportCapacity: {}, legend: {}, tallyCapacity: {}}}
 */
const initialState = {
  test: {}
};

/**
 * Apply graph interaction, and generated graph observer/reducer for reportCapacity to state,
 * against actions.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object|{}}
 */
const legendReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${graphTypes.SET_GRAPH_LEGEND}`:
      return reduxHelpers.setStateProp(
        'test',
        {
          [action.viewId]: action.value
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

legendReducer.initialState = initialState;

export { legendReducer as default, initialState, legendReducer };
