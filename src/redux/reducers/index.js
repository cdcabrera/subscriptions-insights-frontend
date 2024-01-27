import { combineReducers } from 'redux';
import { notifications } from '@redhat-cloud-services/frontend-components-notifications';
import appReducer from './appReducer';
import dynamicReducer from './dynamicReducer';

const reducers = {
  app: appReducer,
  dynamic: dynamicReducer,
  notifications
};

const reduxReducers = combineReducers(reducers);

export { reduxReducers as default, reduxReducers, appReducer, dynamicReducer };
