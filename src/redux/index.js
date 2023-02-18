import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { store } from './store';
import { reduxActions } from './actions';
import { reduxHelpers } from './common';
import { storeHooks } from './hooks';
import { reduxReducers } from './reducers';
import { reduxTypes } from './types';

/**
 * @namespace Redux State
 * @memberof AppEntry
 * @property {module} Store
 * @property {module} Actions
 * @property {module} Helpers
 * @property {module} Hooks
 * @property {module} Middleware
 * @property {module} Reducers
 * @property {module} Types
 */

/**
 * Wrapper for applying Router Dom withRouter and Redux connect.
 *
 * @param {Function} mapStateToProps
 * @param {Function} mapDispatchToProps
 * @returns {Function}
 */
const connectRouter = (mapStateToProps, mapDispatchToProps) => component =>
  withRouter(connect(mapStateToProps, mapDispatchToProps)(component));

export { connect, connectRouter, reduxActions, reduxHelpers, reduxReducers, reduxTypes, store, storeHooks };
