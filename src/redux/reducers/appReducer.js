import _get from 'lodash/get';
import { appTypes, platformTypes } from '../types';
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
 * @type {{apiErrors: {}, auth: {}, exports: {}, exportsExisting: {}, optin: {}, locale: {}, errors: {}}}
 */
const initialState = {
  apiErrors: {},
  auth: {},
  errors: {},
  exports: {},
  exportsExisting: {},
  locale: {},
  optin: {}
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
      const action4xxStatus = reduxHelpers.getStatusFromResults(action);

      if (action4xxStatus === 401 || action4xxStatus === 403) {
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
      /*
    case '>>> COMPONENT API':
      if (action.error === true) {
        return reduxHelpers.setStateProp(
          'apiErrors',
          {
            estimatedApiCalls: action.estimatedApiCalls,

          },
          {
            state,
            initialState
          }
        );
      }
      return state;
      */
      /*
    case reduxHelpers.HTTP_STATUS_RANGE(appTypes.STATUS_5XX):
      const action5xxStatus = reduxHelpers.getStatusFromResults(action);

      if (action5xxStatus >= 500) {
        return reduxHelpers.setStateProp(
          'apiErrors',
          {
            [action.meta.productId || 'all']: {
              error: true,
              messages: [
                ...(state.apiErrors?.[action.meta.productId || 'all']?.messages || []),
                {
                  meta: action.meta,
                  message: reduxHelpers.getMessageFromResults(action),
                  status: reduxHelpers.getStatusFromResults(action)
                }
              ]
            }
          },
          {
            state,
            initialState
          }
        );
      }

      return state;
       */
    case platformTypes.SET_PLATFORM_EXPORT_STATUS:
      return reduxHelpers.setStateProp(
        'exports',
        {
          [action.id]: {
            ...action,
            pending: [
              // Only a selected format updates/reuses the pending list
              ...((action.isSelectUpdated === true && state?.exports?.[action.id]?.pending) || []),
              ...((Array.isArray(action.pending) && action.pending) || (action.pending && [action.pending]) || [])
            ]
          }
        },
        {
          state,
          reset: false
        }
      );
    case platformTypes.SET_PLATFORM_EXPORT_RESET:
      return reduxHelpers.setStateProp(
        null,
        {
          ...state,
          exports: {},
          exportsExisting: {}
        },
        {
          state,
          initialState
        }
      );
    default:
      return reduxHelpers.generatedPromiseActionReducer(
        [
          { ref: 'locale', type: appTypes.USER_LOCALE },
          { ref: 'optin', type: [appTypes.DELETE_USER_OPTIN, appTypes.GET_USER_OPTIN, appTypes.UPDATE_USER_OPTIN] },
          { ref: 'exportsExisting', type: platformTypes.SET_PLATFORM_EXPORT_EXISTING_STATUS },
          { ref: 'auth', type: platformTypes.PLATFORM_USER_AUTH }
        ],
        state,
        action
      );
  }
};

appReducer.initialState = initialState;

export { appReducer as default, initialState, appReducer };
