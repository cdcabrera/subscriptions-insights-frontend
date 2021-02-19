import React from 'react';
import PropTypes from 'prop-types';
import { Redirect as ReactRouterDomRedirect, Route as ReactRouterDomRoute, Switch } from 'react-router-dom';
import Redirect from './redirect';
import { routerHelpers } from './routerHelpers';
import { routerConfig } from './routerConfig';
import { Loader } from '../loader/loader';
import { RouterContext, useHistory, useLocation, useParams, useRouteDetail, useRouteMatch } from './routerContext';
import { RouterContextProvider } from './routerContextProvider';
import { Route } from './route';

/**
 * Load routes.
 *
 * @param {object} props
 * @param {Array} props.routes
 * @returns {Node}
 */
const Router = ({ routes }) => {
  const [routeContext, setRouteContext] = React.useState();
  const redirectRoot = routes.find(({ disabled, redirect }) => !disabled && redirect) ?? null;

  return (
    <RouterContext.Provider value={{ routeContext, setRouteContext }}>
      <React.Suspense fallback={<Loader variant="title" />}>
        <Switch>
          {routes.map(route => {
            const doit = () => {
              if (route.disabled) {
                return null;
              }

              return (
                <ReactRouterDomRoute
                  exact={route.exact}
                  key={route.to}
                  path={route.to}
                  strict={route.strict}
                  render={({ location, ...routeProps }) => (
                    <Route location={location} route={route} routeProps={routeProps} routes={routes} />
                  )}
                />
              );
            };

            return doit();
          })}
          {redirectRoot?.redirect && <ReactRouterDomRedirect to={redirectRoot.redirect} />}
        </Switch>
      </React.Suspense>
    </RouterContext.Provider>
  );
};

/**
 * Prop types.
 *
 * @type {{routes: Array}}
 */
Router.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      activateOnError: PropTypes.boolean,
      component: PropTypes.any.isRequired,
      disabled: PropTypes.boolean,
      exact: PropTypes.boolean,
      redirect: PropTypes.string,
      render: PropTypes.boolean,
      strict: PropTypes.boolean,
      to: PropTypes.string.isRequired
    })
  )
};

/**
 * Default props.
 *
 * @type {{routes: Array}}
 */
Router.defaultProps = {
  routes: routerConfig.routes
};

export {
  Router as default,
  Router,
  Redirect,
  routerHelpers,
  routerConfig,
  RouterContext,
  RouterContextProvider,
  useHistory,
  useLocation,
  useParams,
  useRouteDetail,
  useRouteMatch
};
