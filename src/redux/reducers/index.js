import { combineReducers } from 'redux';
import { notifications } from '@redhat-cloud-services/frontend-components-notifications';
import messagesReducer from './messagesReducer';
import userReducer from './userReducer';
import viewReducer from './viewReducer';
import dynamicReducer from './dynamicReducer';

const reducers = {
  notifications,
  dynamic: dynamicReducer,
  messages: messagesReducer,
  user: userReducer,
  view: viewReducer
};

const reduxReducers = combineReducers(reducers);

export { reduxReducers as default, reduxReducers, messagesReducer, userReducer, viewReducer, dynamicReducer };
