import React, { useContext, useEffect, useState } from 'react';
import { useMount, useShallowCompareEffect } from 'react-use';
import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';
import { initReactI18next, Trans } from 'react-i18next';
import { helpers } from '../../common/helpers';
import { reduxActions, storeHooks } from '../../redux';

/**
 * I18n context.
 *
 * @type {React.Context<{}>}
 */
const DEFAULT_CONTEXT = [{ initialized: false, i18next: null, language: null }, helpers.noop];

const I18nContext = React.createContext(DEFAULT_CONTEXT);

/**
 * Get an updated context.
 *
 * @returns {React.Context<{}>}
 */
const useI18nContext = () => useContext(I18nContext);

const useI18n = ({
  fallbackLng = process.env.REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG,
  getLocale = reduxActions.user.getLocale,
  loadPath = process.env.REACT_APP_CONFIG_SERVICE_LOCALES_PATH,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  // useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelector
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector
} = {}) => {
  const [initialized, setInitialized] = useState(false);
  // const [ready, setReady] = useState(false);
  // const [updatedLanaguage, setUpdatedLanaguage] = useState();
  const dispatch = useAliasDispatch();
  // const { data } = useAliasSelectorsResponse(({ user }) => user?.locale);
  const { value: language } = useAliasSelector(({ user }) => user?.locale?.data, {});

  useMount(async () => {
    await dispatch(getLocale());

    try {
      await i18next
        .use(XHR)
        .use(initReactI18next)
        .init({
          backend: {
            loadPath
          },
          fallbackLng,
          lng: undefined,
          debug: !helpers.PROD_MODE,
          ns: ['default'],
          defaultNS: 'default',
          react: {
            useSuspense: false
          }
        });

      setInitialized(true);
    } catch (e) {
      //
    }
  });

  /*
  useShallowCompareEffect(() => {
    const loadi18next = async () =>

    if (!initialized) {

    }
  }, [fallbackLng, initialized, loadPath, setInitialized]);
  */
  useEffect(() => {
    if (initialized && i18next.resolvedLanguage !== language) {
      try {
        i18next.changeLanguage(language);
      } catch (e) {
        //
      }
    }
  }, [dispatch, initialized, language]);

  return {
    fallbackLanguage: fallbackLng,
    i18n: i18next,
    initialized,
    // ready,
    language
  };
};

const useLang = ({} = {}) => {};

/**
 * Check to help provide an empty context.
 *
 * @type {string}
 */
const EMPTY_CONTEXT = 'LOCALE_EMPTY_CONTEXT';

/**
 * Apply a string towards a key. Optional replacement values and component/nodes.
 * See, https://react.i18next.com/
 *
 * @param {string|Array} translateKey A key reference, or an array of a primary key with fallback keys.
 * @param {string|object|Array} values A default string if the key can't be found. An object with i18next settings. Or an array of objects (key/value) pairs used to replace string tokes. i.e. "[{ hello: 'world' }]"
 * @param {Array} components An array of HTML/React nodes used to replace string tokens. i.e. "[<span />, <React.Fragment />]"
 * @param {object} options
 * @param {string} options.emptyContextValue Check to allow an empty context value.
 * @returns {string|React.ReactNode}
 */
const translate = (translateKey, values = null, components, { emptyContextValue = EMPTY_CONTEXT } = {}) => {
  const updatedValues = values;
  let updatedTranslateKey = translateKey;

  if (Array.isArray(updatedTranslateKey)) {
    updatedTranslateKey = updatedTranslateKey.filter(value => typeof value === 'string' && value.length > 0);
  }

  if (Array.isArray(updatedValues?.context)) {
    updatedValues.context = updatedValues.context
      .map(value => (value === emptyContextValue && ' ') || value)
      .filter(value => typeof value === 'string' && value.length > 0)
      .join('_');
  } else if (updatedValues?.context === emptyContextValue) {
    updatedValues.context = ' ';
  }

  if (helpers.TEST_MODE) {
    return helpers.noopTranslate(updatedTranslateKey, updatedValues, components);
  }

  if (components) {
    return (
      (i18next.store && <Trans i18nKey={updatedTranslateKey} values={updatedValues} components={components} />) || (
        <React.Fragment>t({updatedTranslateKey})</React.Fragment>
      )
    );
  }

  return (i18next.store && i18next.t(updatedTranslateKey, updatedValues)) || `t([${updatedTranslateKey}])`;
};

/**
 * Apply string replacements against a component, HOC.
 *
 * @param {React.ReactNode} Component
 * @returns {React.ReactNode}
 */
const translateComponent = Component => {
  const withTranslation = ({ ...props }) => (
    <Component
      {...props}
      t={(i18next.store && translate) || helpers.noopTranslate}
      i18n={(i18next.store && i18next) || helpers.noop}
    />
  );

  withTranslation.displayName = 'withTranslation';
  return withTranslation;
};

const context = {
  I18nContext,
  DEFAULT_CONTEXT,
  translateComponent,
  useI18n,
  useI18nContext
};

export {
  context as default,
  context,
  I18nContext,
  DEFAULT_CONTEXT,
  translate,
  translateComponent,
  useI18n,
  useI18nContext
};
