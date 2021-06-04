import React from 'react';
import PropTypes from 'prop-types';
import { BinocularsIcon } from '@patternfly/react-icons';
import { Maintenance } from '@redhat-cloud-services/frontend-components/Maintenance';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { useMount, useUnmount } from 'react-use';
import { connect, reduxActions, reduxSelectors } from '../../redux';
import { rhsmApiTypes } from '../../types';
import { helpers } from '../../common';
import { routerHelpers } from '../router/router';
import MessageView from '../messageView/messageView';
import { translate } from '../i18n/i18n';
import { useHistory } from '../../hooks/useRouter';

/**
 * An authentication pass-through component.
 *
 * @param {object} props
 * @param {Function} props.authorizeUser
 * @param {string} props.appName
 * @param {Node} props.children
 * @param {Function} props.hideGlobalFilter
 * @param {Function} props.initializeChrome
 * @param {Function} props.onNavigation
 * @param {object} props.session
 * @param {Function} props.setAppName
 * @param {Function} props.t
 * @returns {Node}
 */
const Authentication = ({
  appName,
  authorizeUser,
  children,
  initializeChrome,
  hideGlobalFilter,
  onNavigation,
  session,
  setAppName,
  t
}) => {
  const history = useHistory();
  const { subscriptions: authorized } = session.authorized || {};

  let removeListeners = helpers.noop;

  useMount(async () => {
    if (!authorized) {
      await authorizeUser();
    }

    initializeChrome();
    setAppName(appName);
    hideGlobalFilter();

    const appNav = onNavigation(event => {
      const { routeHref } = routerHelpers.getRouteConfig({ id: event.navId });
      history.push(routeHref);
    });

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
 * @type {{authorizeUser: Function, onNavigation: Function, setAppName: Function, t: Function, children: Node,
 *     appName: string, initializeChrome: Function, session: object, hideGlobalFilter: Function}}
 */
Authentication.propTypes = {
  appName: PropTypes.string,
  authorizeUser: PropTypes.func,
  children: PropTypes.node.isRequired,
  hideGlobalFilter: PropTypes.func,
  initializeChrome: PropTypes.func,
  onNavigation: PropTypes.func,
  setAppName: PropTypes.func,
  session: PropTypes.shape({
    authorized: PropTypes.shape({
      [routerHelpers.appName]: PropTypes.bool
    }),
    errorCodes: PropTypes.arrayOf(PropTypes.string),
    pending: PropTypes.bool,
    status: PropTypes.number
  }),
  t: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{authorizeUser: Function, onNavigation: Function, setAppName: Function, t: translate, appName: string,
 *     initializeChrome: Function, session: object, hideGlobalFilter: Function}}
 */
Authentication.defaultProps = {
  appName: routerHelpers.appName,
  authorizeUser: helpers.noop,
  hideGlobalFilter: helpers.noop,
  initializeChrome: helpers.noop,
  onNavigation: helpers.noop,
  setAppName: helpers.noop,
  session: {
    authorized: {},
    errorCodes: [],
    pending: false,
    status: null
  },
  t: translate
};

/**
 * Apply actions to props.
 *
 * @param {Function} dispatch
 * @returns {object}
 */
const mapDispatchToProps = dispatch => ({
  authorizeUser: () => dispatch(reduxActions.user.authorizeUser()),
  hideGlobalFilter: isHidden => dispatch(reduxActions.platform.hideGlobalFilter(isHidden)),
  initializeChrome: () => dispatch(reduxActions.platform.initializeChrome()),
  onNavigation: callback => dispatch(reduxActions.platform.onNavigation(callback)),
  setAppName: name => dispatch(reduxActions.platform.setAppName(name))
});

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.user.makeUserSession();

const ConnectedAuthentication = connect(makeMapStateToProps, mapDispatchToProps)(Authentication);

export { ConnectedAuthentication as default, ConnectedAuthentication, Authentication };
