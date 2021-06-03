/* eslint-disable */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect as ReactRouterDomRedirect, Route as ReactRouterDomRoute, Switch } from 'react-router-dom';
import { useMount } from 'react-use';
import { routerHelpers } from './routerHelpers';
import { Route } from './route';
import {Loader} from "../loader/loader";
// import { Loader } from '../loader/loader';
/*
const GeneratedRouteOLD = ({ item, activateOnErrorRoute, routes }) => {
  const View = routerHelpers.importView(item.component);

  console.log('>>> GEN ROUTE', View);

  return (
    <Route
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
            [...new URLSearchParams(decodeURIComponent(location.search))].map(([param, value]) => `${param}~${value}`)
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
};
*/
/*
const GeneratedRoute = ({ item, activateOnErrorRoute, routes }) => {
  const [genRoute, setGenRoute] = useState();

  useMount(async () => {
    const setup = async () => {
      const View = await routerHelpers.importView(item.component);
      const doroute = (
        <Route
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

      setGenRoute(doroute);
    };

    await setup();
  });

  console.log('>>> GEN ROUTE', genRoute);

  return <React.Fragment>{genRoute}</React.Fragment>;
};
*/

/**
 * Load routes.
 *
 * @param {object} props
 * @param {Array} props.routes
 * @returns {Node}
 */
const Router = ({ activateOnErrorRoute, routes, redirectRoot } = {}) => {
  const [views, setViews] = useState([]);
  // const [redirectRoot, setRedirectRoot] = useState(null);

  /**
   * Initialize routes.
   */
  useMount(async () => {
    // const activateOnErrorRoute = routes.find(route => route.activateOnError === true);

    const results = await Promise.all(
      routes.map(item => {
        if (item.disabled) {
          return null;
        }

        return <Route key={item.path} item={item} activateOnErrorRoute={activateOnErrorRoute} routes={routes} />;
      })
    );

    setViews(results);
    // setRedirectRoot(routes.find(({ disabled, redirect }) => !disabled && redirect) ?? null);
  });

  return (
    <Switch>
      <React.Suspense fallback={<Loader variant="title" />}>
        {views}
        {redirectRoot && <ReactRouterDomRedirect to={redirectRoot.redirect} />}
      </React.Suspense>
    </Switch>
  );
};

/**
 * Prop types.
 *
 * @type {{routes: Array}}
 */
Router.propTypes = {
  activateOnErrorRoute: PropTypes.object,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      activateOnError: PropTypes.boolean,
      component: PropTypes.string.isRequired,
      disabled: PropTypes.boolean,
      exact: PropTypes.boolean,
      id: PropTypes.string,
      path: PropTypes.string.isRequired,
      redirect: PropTypes.string,
      render: PropTypes.boolean,
      strict: PropTypes.boolean
    })
  ),
  redirectRoot: PropTypes.object
};

/**
 * Default props.
 *
 * @type {{routes: Array}}
 */
Router.defaultProps = {
  activateOnErrorRoute: routes.find(route => route.activateOnError === true),
  routes: routerHelpers.routes,
  redirectRoot: routerHelpers.routes.find(({ disabled, redirect }) => !disabled && redirect) ?? null
};

// const GeneratedRoute = Route; //

export { Router as default, Router, routerHelpers, Route };
