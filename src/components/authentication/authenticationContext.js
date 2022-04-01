import React, { useContext } from 'react';
import { storeHooks } from '../../redux';
import { helpers } from '../../common';
import useProductViewContext from "../productView/productViewContext";

/**
 * Base context.
 *
 * @type {React.Context<{}>}
 */
const DEFAULT_CONTEXT = [{}, helpers.noop];

const AuthenticationContext = React.createContext(DEFAULT_CONTEXT);

/**
 * Get an updated authentication context.
 *
 * @returns {React.Context<{}>}
 */
const useAuthContext = () => useContext(AuthenticationContext);

/**
 * Return a combined state store that includes authorization, locale, and API errors
 *
 * @param {Function} useSelectorsAllSettledResponse
 * @returns {{data: {errorCodes, locale}, pending: boolean, fulfilled: boolean, error: boolean}}
 */
const useAuth = ({
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const { data, error, fulfilled, pending, responses } = useAliasSelectorsResponse([
    { id: 'auth', selector: ({ user }) => user?.auth },
    { id: 'locale', selector: ({ user }) => user?.locale },
    {
      id: 'errors',
      selector: ({ user }) => (user?.errors?.error === true && user.errors) || { fulfilled: true, data: [] }
    }
  ]);

  const [user = {}, app = {}] = data.auth || [];
  const errorStatus = (error && responses?.errors?.status) || null;

  return {
    data: {
      ...user,
      ...app,
      locale: data.locale,
      errorCodes: data.errors,
      errorStatus
    },
    error,
    fulfilled,
    pending
  };
};

/*
const useSession = ({ useAuthContext: useAliasAuthContext = useAuthContext } = {}) => {
  const session = useAliasAuthContext();
  return {
    ...session
  };
};
*/

// TODO: turn "useSession" into just the Auth Context data result... useAuth will become this part a provider will give useSession the data it needs
/**
 * Return a combined state store that includes authorization, locale, and API errors
 *
 * @param {Function} useSelectorsAllSettledResponse
 * @returns {{data: {errorCodes, locale}, pending: boolean, fulfilled: boolean, error: boolean}}
 */
const useSession = ({
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const { data, error, fulfilled, pending, responses } = useAliasSelectorsResponse([
    { id: 'auth', selector: ({ user }) => user?.auth },
    { id: 'locale', selector: ({ user }) => user?.locale },
    {
      id: 'errors',
      selector: ({ user }) => (user?.errors?.error === true && user.errors) || { fulfilled: true, data: [] }
    }
  ]);

  const [user = {}, app = {}] = data.auth || [];
  const errorStatus = (error && responses?.errors?.status) || null;

  return {
    data: {
      ...user,
      ...app,
      locale: data.locale,
      errorCodes: data.errors,
      errorStatus
    },
    error,
    fulfilled,
    pending
  };
};

const context = {
  AuthenticationContext,
  DEFAULT_CONTEXT,
  useAuthContext,
  useAuth,
  useSession
};

export { context as default, context, AuthenticationContext, DEFAULT_CONTEXT, useAuthContext, useSession };
