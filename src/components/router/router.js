import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useMount } from 'react-use';
import { RouterElement } from './routerElement';
import { routerHelpers } from './routerHelpers';
import { Loader } from '../loader/loader';

/**
 * Load routes.
 *
 * @param {object} props
 * @param {Array} props.routes
 * @returns {Node}
 */
const Router = ({ routes } = {}) => {
  const [updatedRoutes, setUpdatedRoutes] = useState([]);
  const [redirectDefault, setRedirectDefault] = useState(null);

  /**
   * Initialize routes.
   */
  useMount(async () => {
    const activateOnErrorRoute = routes.find(route => route.activateOnError === true);

    const results = await Promise.all(
      routes.map(async item => {
        if (item.disabled) {
          return null;
        }

        const View = await routerHelpers.importView(item.component);
        return (
          <Route
            key={item.path}
            path={item.path}
            element={
              <RouterElement activateOnErrorRoute={activateOnErrorRoute} View={View} item={item} routes={routes} />
            }
          />
        );
      })
    );

    setUpdatedRoutes(results);
    setRedirectDefault(routes.find(({ disabled, redirect }) => !disabled && redirect) ?? null);
  });

  return (
    <React.Suspense fallback={<Loader variant="title" />}>
      <Routes>
        {updatedRoutes}
        {redirectDefault && (
          <Route key="redirect" path="*" element={<Navigate replace to={redirectDefault.redirect} />} />
        )}
      </Routes>
    </React.Suspense>
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
      activateOnError: PropTypes.bool,
      component: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
      exact: PropTypes.bool,
      id: PropTypes.string,
      path: PropTypes.string.isRequired,
      redirect: PropTypes.string,
      render: PropTypes.bool,
      strict: PropTypes.bool
    })
  )
};

/**
 * Default props.
 *
 * @type {{routes: Array}}
 */
Router.defaultProps = {
  routes: routerHelpers.routes
};

export { Router as default, Router };
