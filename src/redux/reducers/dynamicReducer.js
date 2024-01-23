import { reduxHelpers } from '../common/reduxHelpers';

/**
 * Dynamic state reducer.
 *
 * @memberof Reducers
 * @module DynamicReducer
 */

/**
 * Initial state.
 *
 * @private
 * @type {{}}
 */
const initialState = {};

/**
 * Apply a dynamic type to state. Setting, consuming is dependent on useDynamicRedux hooks.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object|{}}
 */
const dynamicReducer = (state = initialState, action) => {
  if (action.__hardReset === true) {
    const updatedState = { ...state };
    delete updatedState[action.__originalType];
    return updatedState;
  }

  if (action.__dynamic === true) {
    return reduxHelpers.setStateProp(
      action.__originalType,
      {
        ...action
      },
      {
        state,
        reset: false
      }
    );
  }

  if (action?.meta?.__dynamic === true) {
    return reduxHelpers.generatedPromiseActionReducer(
      [{ ref: action.meta.__originalType, type: action.type }],
      state,
      action
    );
  }

  return state;
};

dynamicReducer.initialState = initialState;

export { dynamicReducer as default, initialState, dynamicReducer };
