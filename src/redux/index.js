import { connect, useSelector as UseSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { store } from './store';
import { reduxActions } from './actions';
import { reduxHelpers, apiQueries } from './common';
import { reduxReducers } from './reducers';
import { reduxSelectors } from './selectors';
import { reduxTypes } from './types';
import { helpers } from '../common';

const connectRouter = (mapStateToProps, mapDispatchToProps) => component =>
  withRouter(connect(mapStateToProps, mapDispatchToProps)(component));

const useSelector = (selector, value = null, options = {}) =>
  (helpers.TEST_MODE && value) || UseSelector(selector, options.equality) || value;

export {
  apiQueries,
  connect,
  connectRouter,
  reduxActions,
  reduxHelpers,
  reduxReducers,
  reduxSelectors,
  reduxTypes,
  store,
  useSelector
};
