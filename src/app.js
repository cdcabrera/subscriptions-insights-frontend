import React from 'react';
import PropTypes from 'prop-types';
import { useMount } from 'react-use';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import { connect, reduxActions } from './redux';
import { helpers } from './common/helpers';
import { I18n } from './components/i18n/i18n';
import { Router } from './components/router';
import Authentication from './components/authentication/authentication';

/**
 * Application
 *
 * @param {object} props
 * @param {Function} props.getLocale
 * @param {object} props.locale
 * @returns {Node}
 */
const App = ({ getLocale, locale }) => {
  useMount(() => {
    getLocale();
  });

  return (
    <I18n locale={(locale && locale.value) || null}>
      <NotificationsPortal />
      <Authentication>
        <Router />
      </Authentication>
    </I18n>
  );
};

/**
 * Prop types.
 *
 * @type {{locale: object, getLocale: Function}}
 */
App.propTypes = {
  getLocale: PropTypes.func,
  locale: PropTypes.shape({
    value: PropTypes.string
  })
};

/**
 * Default props.
 *
 * @type {{locale: {}, getLocale: Function}}
 */
App.defaultProps = {
  getLocale: helpers.noop,
  locale: {}
};

/**
 * Apply actions to props.
 *
 * @param {Function} dispatch
 * @returns {object}
 */
const mapDispatchToProps = dispatch => ({
  getLocale: () => dispatch(reduxActions.user.getLocale())
});

/**
 * Apply state to props.
 *
 * @param {object} state
 * @returns {object}
 */
const mapStateToProps = state => ({ locale: state.user.session.locale });

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

export { ConnectedApp as default, ConnectedApp, App };
