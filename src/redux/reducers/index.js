import { combineReducers } from 'redux';
import { notifications } from '@redhat-cloud-services/frontend-components-notifications';
import appReducer from './appReducer';
import dynamicReducer from './dynamicReducer';

const reducers = {
  notifications,
  app: appReducer,
  dynamic: dynamicReducer
};

const reduxReducers = combineReducers(reducers);

export { reduxReducers as default, reduxReducers, appReducer, dynamicReducer };
