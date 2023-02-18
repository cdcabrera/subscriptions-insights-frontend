import { combineReducers } from 'redux';
import { notifications } from '@redhat-cloud-services/frontend-components-notifications';
import graphReducer from './graphReducer';
import inventoryReducer from './inventoryReducer';
import messagesReducer from './messagesReducer';
import toolbarReducer from './toolbarReducer';
import userReducer from './userReducer';
import viewReducer from './viewReducer';

/**
 * @memberof Redux State
 * @module Reducers
 * @property {module} GraphReducer
 * @property {module} InventoryReducer
 * @property {module} MessagesReducer
 * @property {module} ToolbarReducer
 * @property {module} UserReducer
 * @property {module} ViewReducer
 */

/**
 * Redux reducers
 *
 * @type {{notifications: Function, graph: Function, inventory: Function, messages: Function, toolbar: Function,
 *     user: Function, view: Function}}
 */
const reducers = {
  notifications,
  graph: graphReducer,
  inventory: inventoryReducer,
  messages: messagesReducer,
  toolbar: toolbarReducer,
  user: userReducer,
  view: viewReducer
};

const reduxReducers = combineReducers(reducers);

export {
  reduxReducers as default,
  reduxReducers,
  graphReducer,
  inventoryReducer,
  messagesReducer,
  toolbarReducer,
  userReducer,
  viewReducer
};
