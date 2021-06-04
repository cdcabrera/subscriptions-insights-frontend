import React from 'react';
import PropTypes from 'prop-types';
import { BinocularsIcon } from '@patternfly/react-icons';
import { Maintenance } from '@redhat-cloud-services/frontend-components/Maintenance';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { useMount, useUnmount } from 'react-use';
import { reduxActions, reduxSelectors, useSelector, useDispatch } from '../../redux';
import { rhsmApiTypes } from '../../types';
import { helpers } from '../../common';
import { routerHelpers } from '../router/router';
import MessageView from '../messageView/messageView';
import { translate } from '../i18n/i18n';
import { useHistory } from '../../hooks/useRouter';

/**
 * Create a selector to apply state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.user.makeUserSession();

/**
 * An authentication pass-through component.
 *
 * @param {object} props
 * @param {string} props.appName
 * @param {Node} props.children
 * @param {Function} props.t
 * @returns {Node}
 */
const Authentication = ({ appName, children, t }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { session } = useSelector(makeMapStateToProps);
  const { subscriptions: authorized } = session.authorized || {};

  let removeListeners = helpers.noop;

  useMount(async () => {
    if (!authorized) {
      await dispatch(reduxActions.user.authorizeUser());
    }

    dispatch(reduxActions.platform.initializeChrome());
    dispatch(reduxActions.platform.setAppName(appName));
    dispatch(reduxActions.platform.hideGlobalFilter());

    const appNav = dispatch(
      reduxActions.platform.onNavigation(event => {
        const { routeHref } = routerHelpers.getRouteConfig({ id: event.navId });
        history.push(routeHref);
      })
    );

    removeListeners = () => {
      appNav();
    };

    if (
      (session.errorCodes && session.errorCodes.includes(rhsmApiTypes.RHSM_API_RESPONSE_ERROR_DATA_CODE_TYPES.OPTIN)) ||
      session.status === 418
    ) {
      history.push(routerHelpers.getErrorRoute.path);
    }
  });

  useUnmount(() => {
    removeListeners();
  });

  if (helpers.UI_DISABLED) {
    return (
      <MessageView>
        <Maintenance description={t('curiosity-auth.maintenanceCopy', '...')} />
      </MessageView>
    );
  }

  if (authorized) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  if (session.pending) {
    return <MessageView pageTitle="&nbsp;" message={t('curiosity-auth.pending', '...')} icon={BinocularsIcon} />;
  }

  return (
    <MessageView>
      <NotAuthorized serviceName={helpers.UI_DISPLAY_NAME} />
    </MessageView>
  );
};

/**
 * Prop types.
 *
 * @type {{t: Function, children: Node, appName: string}}
 */
Authentication.propTypes = {
  appName: PropTypes.string,
  children: PropTypes.node.isRequired,
  t: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{t: translate, appName: string}}
 */
Authentication.defaultProps = {
  appName: routerHelpers.appName,
  t: translate
};

export { Authentication as default, Authentication };
