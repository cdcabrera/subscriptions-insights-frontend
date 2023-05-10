import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { useMount } from 'react-use';
import { reduxActions, store, storeHooks } from '../../redux';
import { I18n } from '../../components/i18n/i18n';
import { Authentication } from '../../components/authentication/authentication';
import { AuthenticationContext } from '../../components/authentication/authenticationContext';
import '../../styles/index.scss';
import '@patternfly/react-styles/css/components/Select/select.css';
import { RhelGraphCard } from './rhelGraphCard';

/**
 * @memberof Modules
 * @module RHEL Graph Card
 */

/**
 * Curiosity module start.
 * - Loads locale
 * - Provides authentication
 *
 * @param {object} props
 * @param {Function} props.getLocale
 * @param {Function} props.useDispatch
 * @param {Function} props.useSelector
 * @returns {React.ReactNode}
 */
const Module = ({ getLocale, useDispatch: useAliasDispatch, useSelector: useAliasSelector }) => {
  const dispatch = useAliasDispatch();
  const { value: locale } = useAliasSelector(({ user }) => user?.locale?.data, {});

  useMount(() => {
    if (!locale) {
      console.log('>>>>', dispatch, getLocale);
      // dispatch(getLocale());
    }
  });

  return (
    <Provider store={store}>
      <I18n locale={locale}>
        <Authentication useGetAuthorization={AuthenticationContext.useGetModuleAuthorization}>
          <RhelGraphCard />
        </Authentication>
      </I18n>
    </Provider>
  );
};

/**
 * Prop types.
 *
 * @type {{useSelector: Function, useDispatch: Function, getLocale: Function}}
 */
Module.propTypes = {
  getLocale: PropTypes.func,
  useDispatch: PropTypes.func,
  useSelector: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useSelector: Function, useDispatch: Function, getLocale: Function}}
 */
Module.defaultProps = {
  getLocale: reduxActions.user.getLocale,
  useDispatch: storeHooks.reactRedux.useDispatch,
  useSelector: storeHooks.reactRedux.useSelector
};

export { Module as default, Module };
