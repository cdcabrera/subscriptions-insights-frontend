import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMount } from 'react-use';
import { Route as ReactRouterDomRoute } from 'react-router-dom';
import { routerHelpers } from './routerHelpers';
// import { Loader } from '../loader/loader';

const Route = ({ item, activateOnErrorRoute, routes }) => {
  const [view, setView] = useState();

  useMount(async () => {
    const result = await (async () => {
      if (item.disabled) {
        return null;
      }

      const View = await routerHelpers.importView(item.component);

      console.log('HEY >>>', item.component);

      return (
        <ReactRouterDomRoute
          exact={item.exact}
          key={item.path}
          path={item.path}
          strict={item.strict}
          render={({ location, ...routeProps }) => {
            const routeConfig = item.id && routerHelpers.getRouteConfig({ id: item.id });
            const { URLSearchParams, decodeURIComponent } = window;
            const parsedSearch = {};

            [
              ...new Set(
                [...new URLSearchParams(decodeURIComponent(location.search))].map(
                  ([param, value]) => `${param}~${value}`
                )
              )
            ].forEach(v => {
              const [param, value] = v.split('~');
              parsedSearch[param] = value;
            });

            const updatedLocation = {
              ...location,
              parsedSearch
            };

            return (
              <View
                routeDetail={{
                  baseName: routerHelpers.baseName,
                  errorRoute: activateOnErrorRoute,
                  routes,
                  routeItem: { ...item },
                  ...routeConfig
                }}
                location={updatedLocation}
                {...routeProps}
              />
            );
          }}
        />
      );
    })();

    setView(result);
  });

  return <React.Fragment>{view}</React.Fragment>;
};

Route.propTypes = {
  item: PropTypes.object,
  activateOnErrorRoute: PropTypes.object,
  routes: PropTypes.array
};

Route.defaultProps = {
  item: {},
  activateOnErrorRoute: {},
  routes: []
};

export { Route as default, Route };
