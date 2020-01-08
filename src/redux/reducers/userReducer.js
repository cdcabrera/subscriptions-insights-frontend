import { appTypes, userTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';

const initialState = {
  session: {
    error: false,
    errorMessage: null,
    errorStatus: null,
    pending: false,
    fulfilled: false,
    authorized: false,
    locale: null
  }
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    /*
    case reduxHelpers.HTTP_STATUS_RANGE(appTypes.STATUS_4XX):
    case reduxHelpers.HTTP_STATUS_RANGE(appTypes.STATUS_5XX):

      // if () {
      // return state;
      // }
      console.log('CHECKING ------>', );

      return reduxHelpers.setStateProp(
        'session',
        {
          error: true,
          errorMessage: reduxHelpers.getMessageFromResults(action),
          errorStatus: reduxHelpers.getStatusFromResults(action),
          locale: state.session.locale
        },
        {
          state,
          initialState
        }
      );
      */

    case reduxHelpers.REJECTED_ACTION(userTypes.USER_AUTH):
      return reduxHelpers.setStateProp(
        'session',
        {
          error: action.error,
          errorMessage: reduxHelpers.getMessageFromResults(action.payload),
          errorStatus: reduxHelpers.getStatusFromResults(action.payload),
          locale: state.session.locale
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
      return reduxHelpers.setStateProp(
        'session',
        {
          authorized: true,
          fulfilled: true,
          locale: state.session.locale,
          username: action.username
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

    default:
      return state;
  }
};

userReducer.initialState = initialState;

export { userReducer as default, initialState, userReducer };
