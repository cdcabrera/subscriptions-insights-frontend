import { combineReducers } from 'redux';
import { notifications } from '@redhat-cloud-services/frontend-components-notifications';
import graphReducer from './graphReducer';
import messagesReducer from './messagesReducer';
import userReducer from './userReducer';
import viewReducer from './viewReducer';
import dynamicReducer from './dynamicReducer';

const reducers = {
  notifications,
  dynamic: dynamicReducer,
  graph: graphReducer,
  messages: messagesReducer,
  user: userReducer,
  view: viewReducer
};

const reduxReducers = combineReducers(reducers);

export {
  reduxReducers as default,
  reduxReducers,
  graphReducer,
  messagesReducer,
  userReducer,
  viewReducer,
  dynamicReducer
};
