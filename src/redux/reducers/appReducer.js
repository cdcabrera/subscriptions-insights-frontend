import _get from 'lodash/get';
import { appTypes } from '../types';
import { rhsmConstants } from '../../services/rhsm/rhsmConstants';
import { reduxHelpers } from '../common';

/**
 * Application related state reducer.
 *
 * @memberof Reducers
 * @module AppReducer
 */

/**
 * Initial state.
 *
 * @private
 * @type {{errors: {}}}
 */
const initialState = {
  errors: {}
};

/**
 * Apply application observer/reducer logic to state, against actions.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object|{}}
 */
const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case reduxHelpers.HTTP_STATUS_RANGE(appTypes.STATUS_4XX):
      const actionStatus = reduxHelpers.getStatusFromResults(action);

      if (actionStatus === 401 || actionStatus === 403) {
        const errorCodes = _get(reduxHelpers.getDataFromResults(action), [rhsmConstants.RHSM_API_RESPONSE_ERRORS], []);

        return reduxHelpers.setStateProp(
          'errors',
          {
            error: true,
            errorMessage: reduxHelpers.getMessageFromResults(action),
            data: errorCodes.map(value => value[rhsmConstants.RHSM_API_RESPONSE_ERRORS_TYPES.CODE]),
            status: reduxHelpers.getStatusFromResults(action)
          },
          {
            state,
            initialState
          }
        );
      }

      return state;

    default:
      return state;
  }
};

appReducer.initialState = initialState;

export { appReducer as default, initialState, appReducer };
