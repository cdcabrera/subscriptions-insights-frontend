import React from 'react';
import PropTypes from 'prop-types';
// import { useEffectOnce } from 'react-use';
import { useRouteContext } from './routerContext';
import { routerHelpers } from './routerHelpers';

/**
 * Router context provider.
 *
 * @param {object} props
 * @param {string} props.baseName
 * @param {object} props.location
 * @param {object} props.route
 * @param {object} props.routeProps
 * @param {object} props.routes
 * @returns {Node}
 */
const Route = ({ baseName, location, route, routeProps, routes }) => {
  const { setRouteContext } = useRouteContext();

  const activateOnErrorRoute = route.activateOnError === true && route;
  const navDetail = routerHelpers.getNavigationDetail({
    pathname: location && location.pathname,
    returnDefault: false
  });

  const updatedLocation = {
    ...location,
    parsedSearch: routerHelpers.getParsedQuery(location)
  };

  const updatedRouteDetail = {
    baseName,
    errorRoute: activateOnErrorRoute,
    routes,
    routeItem: { ...route },
    ...navDetail
  };

  console.log('>>>>>>>>>>>>>>>>>>>>>>>> routerrender');
  const { pathParameter, productParameter, viewParameter } = updatedRouteDetail;
  // const [updatedValue, setUpdatedValue] = React.useState(value);
  React.useEffect(() => {
    // pathParameter: productId, productParameter: productLabel, viewParameter: viewId
    // setRouteContext({ routeDetail: updatedRouteDetail, location: updatedLocation });
    // console.log('ROUTE CONTX PROVIDER >>>', { routeDetail: updatedRouteDetail, location: updatedLocation });
    const doit = () =>
      setRouteContext({
        routeDetail: {
          pathParameter,
          productParameter,
          viewParameter,
          productId: pathParameter,
          productLabel: productParameter,
          viewId: viewParameter
        },
        location: {}
      });

    doit();
  }, [setRouteContext, pathParameter, productParameter, viewParameter]);

  return <route.component routeDetail={updatedRouteDetail} location={updatedLocation} {...routeProps} />;
};

Route.propTypes = {
  baseName: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string
  }).isRequired,
  route: PropTypes.shape({
    component: PropTypes.any,
    activateOnError: PropTypes.bool
  }).isRequired,
  routeProps: PropTypes.object.isRequired,
  routes: PropTypes.array.isRequired
};

Route.defaultProps = {
  baseName: routerHelpers.baseName
};

export { Route as default, Route };
