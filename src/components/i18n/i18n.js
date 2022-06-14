import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';
import { initReactI18next, Trans, useTranslation } from 'react-i18next';
import { useMount } from 'react-use';
import { helpers } from '../../common/helpers';

let TRANSLATION_ACTIVE = false;

const CACHED_TRANSLATIONS = [];

/**
 * Check to help provide an empty context.
 *
 * @type {string}
 */
const EMPTY_CONTEXT = 'LOCALE_EMPTY_CONTEXT';

const timeoutFunction = (func, callback, { timeout = 3000 } = {}) => {
  let clearTimer;

  const timer = () =>
    new Promise(resolve => {
      clearTimer = window.setTimeout(resolve, timeout, callback);
    });

  const updatedFunc = async () => {
    const response = await func();
    window.clearTimeout(clearTimer);
    return response;
  };

  const execFunction = () =>
    Promise.race([timer(), updatedFunc()]).finally(() => {
      window.clearTimeout(clearTimer);
    });

  return execFunction();
};

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
  if (TRANSLATION_ACTIVE) {
    console.log('ACTIVE TRANSLATION >>>>>>>');
  }

  if (!TRANSLATION_ACTIVE) {
    console.log('NOT ACTIVE TRANSLATION <<<<<<<<');
    return <React.Fragment>hey</React.Fragment>;//
    return (
      (() => <Fallback translateKey={translateKey} values={values} components={components} options={{ emptyContextValue }} />)()
    );
    /*
    CACHED_TRANSLATIONS.push({
      translateKey,
      values,
      components,
      emptyContextValue
    });
    */
    /*
    const callback = async () => {
      const str = await new Promise(resolve => {
        setTimeout(() => {
          resolve(translate(translateKey, values, components, { emptyContextValue }));
        }, 1000);
      });
      console.log('HEY >>>>>>>>>>>>>>>', str);
      return str;
    };

    return callback();
    */
    // return '';

    /*
    return new Promise(resolve => {
      setTimeout(() => resolve(translate(translateKey, values, components, { emptyContextValue })), 100);
    });
     */
  }

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

const useI18n = ({
  fallbackLng = process.env.REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG,
  loadPath = process.env.REACT_APP_CONFIG_SERVICE_LOCALES_PATH
} = {}) => {
  const [initialized, setInitialized] = useState(false);

  /**
   * Initialize i18next
   */
  useMount(async () => {
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
    } catch (e) {
      //
    }

    setInitialized(true);
  });

  console.log('i18n hook >>>>', initialized);

  return {
    i18n: i18next,
    ready: initialized
  };
};

/**
 *
 * @param root0
 * @param root0.translateKey
 * @param root0.values
 * @param root0.components
 * @param root0.options
 */
function Fallback({ translateKey, values, components, options }) {
  const [str, setStr] = React.useState();
  const { ready } = useI18n();

  console.log('USE I18n >>>>', ready);

  React.useEffect(() => {
    if (ready) {
      const doIt = translate(translateKey, values, components, options);
      console.log('WORKED >>>>>>>>>>>>', doIt);
      setStr(doIt);
    }
  }, [ready, translateKey, values, components, options]);

  return <React.Fragment>hello = {str}</React.Fragment>;
}

/**
 * Load I18n.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.fallbackLng
 * @param {string} props.loadPath
 * @param {string} props.locale
 * @returns {React.ReactNode}
 */
const I18n = ({ children, fallbackLng, loadPath, locale }) => {
  /*
  const [initialized, setInitialized] = useState(false);

  /**
   * Initialize i18next
   * /
  useMount(async () => {
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
    } catch (e) {
      //
    }

    setInitialized(true);
  });
  */
  const { ready, i18n } = useI18n();

  /**
   * Update locale.
   */
  useEffect(() => {
    if (ready) {
      try {
        i18n.changeLanguage(locale);
        TRANSLATION_ACTIVE = true;
      } catch (e) {
        //
      }
    }
  }, [ready, locale, i18n]);

  return (ready && children) || <React.Fragment />;
};

/**
 * Prop types.
 *
 * @type {{loadPath: string, children: React.ReactNode, locale: string, fallbackLng: string}}
 */
I18n.propTypes = {
  children: PropTypes.node.isRequired,
  fallbackLng: PropTypes.string,
  loadPath: PropTypes.string,
  locale: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{loadPath: string, locale: null, fallbackLng: string}}
 */
I18n.defaultProps = {
  fallbackLng: process.env.REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG,
  loadPath: process.env.REACT_APP_CONFIG_SERVICE_LOCALES_PATH,
  locale: null
};

export { I18n as default, I18n, i18next, translate, translateComponent, EMPTY_CONTEXT, TRANSLATION_ACTIVE };
