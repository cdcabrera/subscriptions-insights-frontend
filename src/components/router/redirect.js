/* eslint-disable no-unused-vars */
import path from 'path';
// import React, { useEffect } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import { Redirect as RedirectRRD } from 'react-router-dom';
// import { useHistory, useLocation } from 'react-router-dom';
// import { useMount } from 'react-use';
// import { reduxActions, useDispatch } from '../../redux';
// import { useDispatch } from '../../redux';
// import { useMount } from 'react-use';
import { routerHelpers } from './routerHelpers';
import { helpers } from '../../common';
//
/**
 * A routing redirect.
 *
 * @param {object} props
 * @param {string} props.baseName
 * @param {boolean} props.isForced
 * @param {boolean} props.isRedirect
 * @param {boolean} props.isReplace
 * @param {string} props.route
 * @param {string} props.url
 * @returns {Node}
 */
const Redirect = ({ baseName, isForced, isRedirect, isReplace, route, url }) => {
  // const history = useHistory();
  // const location = useLocation();
  // const dispatch = useDispatch();

  /**
   * Bypass router, force the location.
   */
  const forceNavigation = () => {
    const { hash = '', search = '' } = window.location;
    const forcePath = url || (route && `${path.join(baseName, route)}${search}${hash}`);

    if (!helpers.TEST_MODE) {
      if (isReplace) {
        window.location.replace(forcePath);
      } else {
        window.location.href = forcePath;
      }
    }
  };

  /**
   * Use history, or force navigation.
   */
  /*
  useMount(() => {
    if (isRedirect === true) {
      if (!isForced && route && history) {
        const { path: doit } = routerHelpers.getRouteConfig({ pathName: route });
        // history.push(routeHref);
        location.pathname = doit;
      } else {
        forceNavigation();
      }
    }
  });
  */
  const { path: doit } = routerHelpers.getRouteConfig({ pathName: route });

  return <RedirectRRD to={doit} push />;
  // return (helpers.TEST_MODE && <React.Fragment>Redirected towards {url || route}</React.Fragment>) || 'WTF';
};

/**
 * Prop types.
 *
 * @type {{isRedirect: boolean, route: string, isReplace: boolean, baseName: string, url: string,
 *    isForced: boolean}}
 */
Redirect.propTypes = {
  baseName: PropTypes.string,
  isForced: PropTypes.bool,
  isRedirect: PropTypes.bool,
  isReplace: PropTypes.bool,
  route: PropTypes.string,
  url: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{isRedirect: boolean, route: string, isReplace: boolean, baseName: string, url: string,
 *    isForced: boolean}}
 */
Redirect.defaultProps = {
  baseName: routerHelpers.baseName,
  isForced: false,
  isRedirect: true,
  isReplace: false,
  route: null,
  url: null
};

export { Redirect as default, Redirect };
