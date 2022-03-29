import React, { useContext } from 'react';
import { storeHooks } from '../../redux';
import { helpers } from '../../common';

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

const useAuth = ({
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {

  // useSelectorsAllResponse
  // useSelectorsAnyResponse
  // useSelectorsAllSettledResponse
  // useSelectorsRaceResponse

  // const {} = useAliasSelectorsAllResponse();
  const { responses = {} } = useAliasSelectorsResponse(
    [
      { id: 'auth', selector: ({ user }) => user?.auth },
      { id: 'errors', selector: ({ user }) => user?.errors }
    ],
    {
      mergeResponses: true,
      promiseBehavior: 'all' // 'all' || 'any' || 'allSettled' || 'race' // defaults to 'all'
      // isAllSettled: true,
      // mergeResponses: true
      // returnType: 'merged'
      // 'mergedResponses' || 'mergedData' || 'separated'
      // mergeResponse
      // promiseBehavior: 'all' || 'any' || 'allSettled' || 'race' // defaults to 'all'
    }
  );

  const { auth = {}, errors = {} } = responses;
  const { data, error, fulfilled, pending, status } = {
    ...auth,
    ...errors
  };

  const errorCodes = (error && Array.isArray(data) && data) || [];
  const [user = {}, app = {}] = (fulfilled && Array.isArray(data) && data) || [];

  return {
    error,
    ...user,
    ...app,
    errorCodes,
    fulfilled,
    pending,
    status
  };
};

/**
 * Return state stored locale.
 *
 * @param {Function} useSelectorsResponse
 * @returns {{key: string, value: string}}
 */
const useLocale = ({
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  // const { data, fulfilled, ...selectorsResponse } = useAliasSelectorsResponse([({ user }) => user?.locale]);
  const { data, fulfilled } = useAliasSelectorsResponse([({ user }) => user?.locale]);
  let updatedData = { key: null, value: null };

  if (fulfilled && Array.isArray(data) && data.length === 1) {
    [updatedData] = data;
  }

  return {
    ...updatedData
    // data: updatedData,
    // fulfilled,
    // ...selectorsResponse
  };
};

/**
 * Return a combined state store for session.
 *
 * @param {object} options
 * @param {Function} options.useAuth
 * @param {Function} options.useLocale
 * @returns {{pending: boolean, fulfilled: boolean, error: boolean, locale: {data: Array, error: boolean, fulfilled: boolean, pending: boolean}}}
 */
/**
 *
 * @param useAliasAuth
 * @param useAliasLocale
 * @param useAliasAuth.useAuth
 * @param useAliasAuth.useLocale
 * @returns {{pending: *, fulfilled: *, error: *, locale: {key: string, value: string}}}
 */
const useSession = ({ useAuth: useAliasAuth = useAuth, useLocale: useAliasLocale = useLocale } = {}) => {
  const auth = useAliasAuth();
  const locale = useAliasLocale();

  return {
    ...auth,
    locale
  };
};

/**
 * Get an updated session response for authorization context.
 *
 * @param {Function} useSelectorsResponse
 * @returns {{pending: boolean, fulfilled: boolean, cancelled: boolean, error: boolean, locale: {}}}
 */
const useSessionOG = ({
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const { data, ...selectorsResponse } = useAliasSelectorsResponse(
    [({ user }) => user?.auth, ({ user }) => user?.errors, ({ user }) => user?.locale],
    {
      isAllSettled: true
    }
  );
  const { data: localeData, fulfilled: localeFulfilled } = useAliasSelectorsResponse([({ user }) => user?.locale]);
  // } = useAliasSelectorsResponse([({ user }) => user]);

  // const [locale = {}, auth = []] = data || [];
  // const [user = {}, app = {}] = (Array.isArray(auth) && auth) || [];
  // const [{ auth = {}, errors = {}, locale = {}, optin = {} } = {}] = data || [];
  // const [user = {}, app = {}] = auth.data || [];

  console.log('>>>>>>>>>>>>> 001', data);

  // Object.assign(response, { locale, ...user, ...app });

  // const [user = {}, app = {}] = auth;
  // const { isAdmin = false, isEntitled = false, permissions = {} } = session;

  return {
    // isAdmin,
    // isEntitled,
    // authorized: {},
    // data,
    // entitled: false,
    // session,
    // auth,
    ...selectorResponse,
    locale,
    ...user,
    ...app
    // userPermissions,
    // permissions
  };
};

const context = {
  AuthenticationContext,
  DEFAULT_CONTEXT,
  useAuthContext,
  useSession
};

export { context as default, context, AuthenticationContext, DEFAULT_CONTEXT, useAuthContext, useSession };
