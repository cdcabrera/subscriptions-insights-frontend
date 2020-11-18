import { rhsmTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';

/**
 * Initial state.
 *
 * @private
 * @type {{reportCapacity: {}, legend: {}}}
 */
const initialState = {
  reportCapacity: {}
};

/**
 * Generated daily observer/reducer for reportCapacity to state,
 * against actions.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object|{}}
 */
const dailyGraphReducer = (state = initialState, action) =>
  reduxHelpers.generatedPromiseActionReducer(
    [{ ref: 'reportCapacity', type: rhsmTypes.GET_REPORT_CAPACITY_RHSM }],
    state,
    action
  );

dailyGraphReducer.initialState = initialState;

export { dailyGraphReducer as default, initialState, dailyGraphReducer };
