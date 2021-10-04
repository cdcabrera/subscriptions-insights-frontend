import { connect, useSelector as UseSelector, shallowEqual } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { store } from './store';
import { reduxActions } from './actions';
import { reduxHelpers, apiQueries } from './common';
import { reduxReducers } from './reducers';
import { reduxSelectors } from './selectors';
import { reduxTypes } from './types';
import { helpers } from '../common';

/**
 * Wrapper for applying Router Dom withRouter and Redux connect.
 *
 * @param {Function} mapStateToProps
 * @param {Function} mapDispatchToProps
 * @returns {Function}
 */
const connectRouter = (mapStateToProps, mapDispatchToProps) => component =>
  withRouter(connect(mapStateToProps, mapDispatchToProps)(component));

/**
 * FixMe: Appears to be an issue in trying to use Redux Promise with the default "useDispatch"
 */
/**
 * Wrapper for store.dispatch, emulating useDispatch.
 *
 * @returns {Function}
 */
const useDispatch = () => dispatchEvent => store.dispatch(dispatchEvent);

/**
 * Wrapper for Redux hook, useSelector. Applies test mode and a fallback value.
 *
 * @param {Function} selector
 * @param {*} value
 * @param {object} options
 * @returns {*}
 */
const useSelector = (selector, value = null, options = {}) => {
  if (helpers.TEST_MODE) {
    return value;
  }

  return UseSelector(selector, options.equality) ?? value;
};

export {
  apiQueries,
  connect,
  connectRouter,
  reduxActions,
  reduxHelpers,
  reduxReducers,
  reduxSelectors,
  reduxTypes,
  shallowEqual,
  store,
  useDispatch,
  useSelector
};
