import { combineReducers } from 'redux';
import { notifications } from '@redhat-cloud-services/frontend-components-notifications';
import messagesReducer from './messagesReducer';
import userReducer from './userReducer';
import dynamicReducer from './dynamicReducer';

const reducers = {
  notifications,
  dynamic: dynamicReducer,
  messages: messagesReducer,
  user: userReducer
};

const reduxReducers = combineReducers(reducers);

export { reduxReducers as default, reduxReducers, messagesReducer, userReducer, dynamicReducer };
