import React from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { helpers } from '../../common/helpers';

const RouterContext = React.createContext();

RouterContext.displayName = 'RouterContext';

const useRouteContext = () => React.useContext(RouterContext);

/**
 * Custom router detail object.
 *
 * @param {*} value
 * @returns {{}|null}
 */
const useRouteDetail = (value = null) => {
  const { routeDetail = {} } = useRouteContext();

  if (helpers.TEST_MODE) {
    return value;
  }

  return routeDetail;
};

/**
 * Custom router location object.
 *
 * @param {*} value
 * @returns {{}|null}
 */
const useLocation = (value = null) => {
  const { location = {} } = useRouteContext();

  if (helpers.TEST_MODE) {
    return value;
  }

  return location;
};

export { RouterContext as default, RouterContext, useHistory, useLocation, useParams, useRouteDetail, useRouteMatch };
