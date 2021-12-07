import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useMount } from 'react-use';
import { RouterContext } from './routerContext';
import { routerHelpers } from './routerHelpers';
import { Loader } from '../loader/loader';
import { CreateElement } from '../createElement/createElement';

/**
 * Load routes.
 *
 * @param {object} props
 * @param {Array} props.routes
 * @returns {Node}
 */
const RouteElement = ({ activateOnError,
  component,
  disabled,
  id,
  path
}) => {
  const [route, setRoute] = useState(null);
  const [redirectDefault, setRedirectDefault] = useState(null);

  /**
   * Initialize routes.
   */
  useMount(async () => {
    const activateOnErrorRoute = routes.find(route => route.activateOnError === true);

    if (disabled) {
      return setRoute(null);
    }

    const View = await routerHelpers.importView(item.component);

    return setRoute(
          <Route
            key={item.path}
            path={item.path}
            element={
              <CreateElement
                node={({ location = {}, ...routeProps } = {}) => {
                  console.log('ROUTER 002 >>>', location, routeProps);
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

                  const routeDetail = {
                    baseName: routerHelpers.dynamicBaseName(),
                    errorRoute: activateOnErrorRoute,
                    routes,
                    routeItem: { ...item },
                    ...routeConfig
                  };

                  return (
                    <RouterContext.Provider value={{ routeDetail }}>
                      <View routeDetail={routeDetail} location={updatedLocation} {...routeProps} />
                    </RouterContext.Provider>
                  );
                }}
              />
            }
          />
        );
      })
    );

    setUpdatedRoutes(result);
    setRedirectDefault(routes.find(({ disabled, redirect }) => !disabled && redirect) ?? null);
  });

  return (
    <React.Suspense fallback={<Loader variant="title" />}>
      <Routes>
        {updatedRoutes}
        {redirectDefault && <Route path="*" element={<Navigate replace to={redirectDefault.redirect} />} />}
      </Routes>
    </React.Suspense>
  );
};

/**
 * Prop types.
 *
 * @type {{routes: Array}}
 */
RouteElement.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      activateOnError: PropTypes.boolean,
      component: PropTypes.string.isRequired,
      disabled: PropTypes.boolean,
      id: PropTypes.string,
      path: PropTypes.string.isRequired,
      redirect: PropTypes.string
    })
  )
};

/**
 * Default props.
 *
 * @type {{routes: Array}}
 */
RouteElement.defaultProps = {
  routes: routerHelpers.routes
};

export { RouteElement as default, RouteElement };
