import { reduxHelpers } from '../common/reduxHelpers';

/**
 * Flat state reducer.
 *
 * @memberof Reducers
 * @module FlatReducer
 */

/**
 * Initial state.
 *
 * @private
 * @type {{}}
 */
const initialState = {};

/**
 * Apply anything to state, against any action.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object|{}}
 */
const flatReducer = (state = initialState, action) => {
  console.log('>>> ACTION', action, action._internal, action.stateKey);

  if (action._internal === true || action?.meta?._internal === true) {
    if (action?.meta?._internal) {
      const results = reduxHelpers.generatedPromiseActionReducer(
        [{ ref: action.meta.stateKey, type: action.type }],
        state,
        action
      );
      console.log('>>>> ACTION RES', results);
      return results;
    }

    return reduxHelpers.setStateProp(
      action.stateKey,
      {
        ...action
      },
      {
        state,
        reset: false
      }
    );
  }

  return state;

  /*
   *switch (action.type) {
   *  case 'FLAT_FIELD':
   *    return reduxHelpers.setStateProp(
   *      action.stateKey,
   *      {
   *        ...action
   *      },
   *      {
   *        state,
   *        reset: false
   *      }
   *    );
   *  default:
   *    return reduxHelpers.generatedPromiseActionReducer(
   *      [{ ref: action.stateKey, type: 'FLAT_RESPONSE' }],
   *      state,
   *      action
   *    );
   *}
   */

  /*
   *if (action._internal === true || action?.meta?._internal === true) {
   *  if (action?.meta?._internal) {
   *    const results = reduxHelpers.generatedPromiseActionReducer(
   *      [{ ref: 'anything', type: action.type }],
   *      state,
   *      action
   *    );
   *    console.log('>>>> ACTION RES', results);
   *    return results;
   *  }
   *
   *  return reduxHelpers.setStateProp(
   *    'anything',
   *    {
   *      ...action
   *    },
   *    {
   *      state,
   *      reset: false
   *    }
   *  );
   *}
   *
   *return state;
   */
  /*
   *switch (action.type) {
   *  case 'SET_TYPE':
   *    return reduxHelpers.setStateProp(
   *      action.type,
   *      {
   *        ...action
   *      },
   *      {
   *        state,
   *        reset: false
   *      }
   *    );
   *  default:
   *    return reduxHelpers.generatedPromiseActionReducer([{ ref: 'responses', type: action.type }], state, action);
   *}
   *
   *switch (action.type) {
   *  case 'SET_TYPE':
   *    return reduxHelpers.setStateProp(
   *      'anything',
   *      {
   *        ...action
   *      },
   *      {
   *        state,
   *        reset: false
   *      }
   *    );
   *  default:
   *    return reduxHelpers.generatedPromiseActionReducer(
   *      [{ ref: 'responses', type: 'SET_TYPE_RESPONSE' }],
   *      state,
   *      action
   *    );
   *}
   */
};

flatReducer.initialState = initialState;

export { flatReducer as default, initialState, flatReducer };
