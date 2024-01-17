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
 * Apply any type to state, against any action. Setting, consuming is dependent on useDynamicRedux hooks.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object|{}}
 */
const dynamicReducer = (state = initialState, action) => {
  // console.log('>>> ACTION', action, action._internal, action.stateKey);

  console.log('>>>> DYNAMIC REDUCER', action);

  if (action.__dynamic === true) {
    console.log('>>> DYNAMIC ACTION', action);
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
    console.log('>>> DYNAMIC ACTION PROMISE', action);
    return reduxHelpers.generatedPromiseActionReducer(
      [{ ref: action.meta.__originalType, type: action.type }],
      state,
      action
    );
    // console.log('>>>> ACTION RES', results);

    // return results;
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

dynamicReducer.initialState = initialState;

export { dynamicReducer as default, initialState, dynamicReducer };
