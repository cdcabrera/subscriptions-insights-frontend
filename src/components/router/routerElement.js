import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { RouterContext } from './routerContext';
import { routerHelpers } from './routerHelpers';

/**
 * Generate route with app context
 *
 * @param {object} props
 * @param {*|object} props.activateOnErrorRoute
 * @param {object} props.item
 * @param {*|Array} props.routes
 * @param {React.ReactNode} props.View
 * @returns {React.ReactNode}
 */
const RouterElement = ({ activateOnErrorRoute, item, routes, View }) => {
  const routeDetail = {
    id: item?.id,
    baseName: routerHelpers.dynamicBaseName(),
    errorRoute: activateOnErrorRoute,
    routes,
    routeItem: { ...item }
  };

  return (
    <RouterContext.Provider value={{ routeDetail, useLocation, useNavigate, useParams }}>
      <View routeDetail={routeDetail} />
    </RouterContext.Provider>
  );
};

/**
 * Prop types
 *
 * @type {{activateOnErrorRoute: *|object, routes: Array, item: object, View: React.ReactNode}}
 */
RouterElement.propTypes = {
  activateOnErrorRoute: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  routes: PropTypes.array.isRequired,
  View: PropTypes.any.isRequired
};

/**
 * Default props
 *
 * @type {{}}
 */
RouterElement.defaultProps = {};

export { RouterElement as default, RouterElement };
