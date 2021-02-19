import React from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';

/**
 * Router context.
 *
 * @type {React.Context<{}>}
 */
const RouterContext = React.createContext({});

/**
 * Expose router context.
 *
 * @returns {*}
 */
const useRouteContext = () => React.useContext(RouterContext);

/**
 * Expose custom router detail object.
 *
 * @param {object} value
 * @returns {{}|null}
 */
const useRouteDetail = (value = {}) => {
  const { routeContext = value } = useRouteContext();
  return routeContext.routeDetail;
};

/**
 * Expose custom router location object.
 *
 * @param {object} value
 * @returns {{}|null}
 */
const useLocation = (value = {}) => {
  const { routeContext = value } = useRouteContext();
  return routeContext.location;
};

export {
  RouterContext as default,
  RouterContext,
  useHistory,
  useLocation,
  useParams,
  useRouteContext,
  useRouteDetail,
  useRouteMatch
};
