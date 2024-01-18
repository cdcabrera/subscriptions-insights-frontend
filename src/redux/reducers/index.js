import { combineReducers } from 'redux';
import { notifications } from '@redhat-cloud-services/frontend-components-notifications';
// import messagesReducer from './messagesReducer';
import appReducer from './appReducer';
import dynamicReducer from './dynamicReducer';

const reducers = {
  notifications,
  app: appReducer,
  dynamic: dynamicReducer
  // messages: messagesReducer
};

const reduxReducers = combineReducers(reducers);

export { reduxReducers as default, reduxReducers, appReducer, dynamicReducer };
