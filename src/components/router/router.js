/* eslint-disable */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect as ReactRouterDomRedirect, Route as ReactRouterDomRoute, Switch } from 'react-router-dom';
import { useMount } from 'react-use';
import { routerHelpers } from './routerHelpers';
import { Route } from './route';
import { Loader } from '../loader/loader';

/**
 * Load routes.
 *
 * @param {object} props
 * @param {Array} props.routes
 * @returns {Node}
 */
const Router = ({ routes } = {}) => {
  // const [views, setViews] = useState([]);
  // const [redirectRoot, setRedirectRoot] = useState(null);

  /**
   * Initialize routes.
   */
  // useMount(async () => {
    // const activateOnErrorRoute = routes.find(route => route.activateOnError === true);

    /*
    const results = await Promise.all(
      routes.map(item => <Route key={item.path} item={item} activateOnErrorRoute={activateOnErrorRoute} routes={routes} />)
    );
    /*

    // setRedirectRoot(routes.find(({ disabled, redirect }) => !disabled && redirect) ?? null);
    const redirectRoot = routes.find(({ disabled, redirect }) => !disabled && redirect) ?? null;
    if (redirectRoot) {
      results.push(<ReactRouterDomRedirect key={`redirect-${redirectRoot.path}`} to={redirectRoot.redirect} />);
    }
     */

    // setViews(results);
  // });

  // {}
  // {redirectRoot && <ReactRouterDomRedirect to={redirectRoot.redirect} />}
  const activateOnErrorRoute = routes.find(route => route.activateOnError === true);
  const views = routes.map(item => <Route key={item.path} item={item} activateOnErrorRoute={activateOnErrorRoute} routes={routes} />)
  const redirectRoot = routes.find(({ disabled, redirect }) => !disabled && redirect) ?? null;

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
  activateOnErrorRoute: routerHelpers.routes.find(route => route.activateOnError === true),
  routes: routerHelpers.routes,
  redirectRoot: routerHelpers.routes.find(({ disabled, redirect }) => !disabled && redirect) ?? null
};

// const GeneratedRoute = Route; //

export { Router as default, Router, routerHelpers, Route };
