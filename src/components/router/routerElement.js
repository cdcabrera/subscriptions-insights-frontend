import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { RouteContext } from './routerContext';
import { routerHelpers } from './routerHelpers';

/**
 * Generate route with app context
 *
 * @param {object} props
 * @param {object} props.item
 * @param {*|Array} props.routes
 * @param {React.ReactNode} props.View
 * @returns {React.ReactNode}
 */
const RouterElement = ({ item, routes, View }) => {
  const [routeDetail] = useState({
    routeDetail: {
      id: item?.id,
      baseName: routerHelpers.dynamicBaseName(),
      errorRoute: routerHelpers.getErrorRoute,
      routes,
      routeItem: { ...item }
      // ...routeConfig
    }
  });
  // const routeConfig = item.id && routerHelpers.getRouteConfig({ id: item.id });
  // const routeDetail = ;

  return (
    <RouteContext.Provider value={routeDetail}>
      <View routeDetail={routeDetail} />
    </RouteContext.Provider>
  );
};

/**
 * Prop types
 *
 * @type {{routes: Array, item: object, View: React.ReactNode}}
 */
RouterElement.propTypes = {
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
