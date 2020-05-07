import _get from 'lodash/get';
import { appTypes, userTypes } from '../types';
import { platformApiTypes, rhsmApiTypes } from '../../types';
import { helpers } from '../../common';
import { reduxHelpers } from '../common/reduxHelpers';

/**
 * Initial state.
 *
 * @private
 * @type {{session: {entitled: boolean, permissions: Array, authorized: boolean, errorCodes: Array,
 *     pending: boolean, errorMessage: string, fulfilled: boolean, admin: boolean, error: boolean,
 *     locale: string, status: (string|number)}, optin: {}}}
 */
const initialState = {
  optin: {},
  session: {
    admin: false,
    authorized: false,
    entitled: false,
    error: false,
    errorCodes: [],
    errorMessage: null,
    fulfilled: false,
    locale: null,
    pending: false,
    permissions: [],
    status: null
  }
};

/**
 * Apply user observer/reducer logic for session to state, against actions.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object|{}}
 */
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case reduxHelpers.REJECTED_ACTION(userTypes.USER_AUTH):
      return reduxHelpers.setStateProp(
        'session',
        {
          error: action.error,
          errorMessage: reduxHelpers.getMessageFromResults(action),
          locale: state.session.locale,
          status: reduxHelpers.getStatusFromResults(action)
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.PENDING_ACTION(userTypes.USER_AUTH):
      return reduxHelpers.setStateProp(
        'session',
        {
          locale: state.session.locale,
          pending: true
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.FULFILLED_ACTION(userTypes.USER_AUTH):
      const { user, permissions } = reduxHelpers.getDataFromResults(action);
      const admin = _get(
        user,
        [
          platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY,
          platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES.USER,
          platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES.ORG_ADMIN
        ],
        false
      );

      const entitled = _get(
        user,
        [
          platformApiTypes.PLATFORM_API_RESPONSE_USER_ENTITLEMENTS,
          helpers.UI_NAME,
          platformApiTypes.PLATFORM_API_RESPONSE_USER_ENTITLEMENTS_APP_TYPES.ENTITLED
        ],
        false
      );

      const subscriptionPermissions = permissions.map(value => ({
        permission: value[platformApiTypes.PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES.PERMISSION],
        definitions: value[platformApiTypes.PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES.RESOURCE_DEFS]
      }));

      return reduxHelpers.setStateProp(
        'session',
        {
          admin,
          authorized: true,
          entitled,
          fulfilled: true,
          locale: state.session.locale,
          permissions: subscriptionPermissions
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.FULFILLED_ACTION(userTypes.USER_LOCALE):
      return reduxHelpers.setStateProp(
        'session',
        {
          locale: action.payload.data
        },
        {
          state,
          reset: false
        }
      );

    case reduxHelpers.HTTP_STATUS_RANGE(appTypes.STATUS_4XX):
      const actionStatus = reduxHelpers.getStatusFromResults(action);

      if (actionStatus === 401 || actionStatus === 403) {
        const errorCodes = _get(
          reduxHelpers.getDataFromResults(action),
          [rhsmApiTypes.RHSM_API_RESPONSE_ERROR_DATA],
          []
        );

        return reduxHelpers.setStateProp(
          'session',
          {
            admin: state.session.admin,
            entitled: state.session.entitled,
            error: true,
            errorCodes: errorCodes.map(value => value[rhsmApiTypes.RHSM_API_RESPONSE_ERROR_DATA_TYPES.CODE]),
            errorMessage: reduxHelpers.getMessageFromResults(action),
            locale: state.session.locale,
            permissions: state.session.permissions,
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
      return reduxHelpers.generatedPromiseActionReducer(
        [
          { ref: 'optin', type: userTypes.DELETE_USER_OPTIN },
          { ref: 'optin', type: userTypes.GET_USER_OPTIN },
          { ref: 'optin', type: userTypes.UPDATE_USER_OPTIN }
        ],
        state,
        action
      );
  }
};

userReducer.initialState = initialState;

export { userReducer as default, initialState, userReducer };
