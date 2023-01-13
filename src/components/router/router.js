import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import { useMount } from 'react-use';
import { Navigate, Routes, Route, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
// import { useMount } from 'react-use';
import { RouterContext } from './routerContext';
import { routerHelpers } from './routerHelpers';
import { Loader } from '../loader/loader';

/**
 * Load routes.
 *
 * @param {object} props
 * @param {Array} props.routes
 * @param {Function} props.useLocation
 * @param {Function} props.useNavigate
 * @param {Function} props.useParams
 * @param {Function} props.useSearchParams
 * @returns {React.ReactNode}
 */
const Router = ({
  redirectRoute,
  routes,
  useLocation: useAliasLocation,
  useNavigate: useAliasNavigate,
  useParams: useAliasParams,
  useSearchParams: useAliasSearchParams
} = {}) => {
  const [context] = useState({
    useLocation: useAliasLocation,
    useNavigate: useAliasNavigate,
    useParams: useAliasParams,
    useSearchParams: useAliasSearchParams
  });
  // const [updatedRoutes, setUpdatedRoutes] = useState([]);
  // const [redirectDefault, setRedirectDefault] = useState(null);
  // const [redirectDefault] = useState(routes.find(({ disabled, redirect }) => !disabled && redirect) ?? null);
  // const View = routerHelpers.importView('productView/productView');
  /**
   * Initialize routes.
   */
  /*
  useMount(async () => {
    const results = await Promise.all(
      routes.map(async item => {
        if (item.disabled) {
          return null;
        }

        const View = await routerHelpers.importView(item.component);
        return <Route key={item.path} path={item.path} element={<View />} />;
      })
    );

    setUpdatedRoutes(results);
    // setRedirectDefault(routes.find(({ disabled, redirect }) => !disabled && redirect) ?? null);
  });
  */
  // const redirectDefault = routerHelpers.redirectRoute;
  const updatedRoutes = routes
    .filter(item => !item.disabled)
    .map(item => {
      // console.log('CONFIGS >>> testing', item.configs);
      const View = routerHelpers.importView(item.component);
      return <Route key={item.path} path={item.path} element={<View />} />;
    });

  return (
    <RouterContext.Provider value={context}>
      <React.Suspense fallback={<Loader variant="title" />}>
        <Routes>
          {updatedRoutes}
          {redirectRoute && (
            <Route
              key="redirect"
              path={redirectRoute.path}
              element={<Navigate replace to={redirectRoute.redirect} />}
            />
          )}
        </Routes>
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
  redirectRoute: PropTypes.string,
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
  ),
  useLocation: PropTypes.func,
  useNavigate: PropTypes.func,
  useParams: PropTypes.func,
  useSearchParams: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{routes: Array}}
 */
Router.defaultProps = {
  redirectRoute: routerHelpers.redirectRoute,
  routes: routerHelpers.routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
};

export { Router as default, Router };
