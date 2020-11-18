import { combineReducers } from 'redux';
import { notifications } from '@redhat-cloud-services/frontend-components-notifications/cjs';
import dailyGraphReducer from './dailyGraphReducer';
import graphReducer from './graphReducer';
import inventoryReducer from './inventoryReducer';
import toolbarReducer from './toolbarReducer';
import userReducer from './userReducer';
import viewReducer from './viewReducer';

const reducers = {
  notifications,
  dailyGraph: dailyGraphReducer,
  graph: graphReducer,
  inventory: inventoryReducer,
  toolbar: toolbarReducer,
  user: userReducer,
  view: viewReducer
};

const reduxReducers = combineReducers(reducers);

export {
  reduxReducers as default,
  reduxReducers,
  dailyGraphReducer,
  graphReducer,
  inventoryReducer,
  toolbarReducer,
  userReducer,
  viewReducer
};
