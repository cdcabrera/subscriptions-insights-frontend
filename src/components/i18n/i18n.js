import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { I18nContext, useI18n, translate, translateComponent } from './i18nContext';

/**
 * Load I18n.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.locale
 * @param props.useI18n
 * @returns {React.ReactNode}
 */
const I18n = ({ children, locale, useI18n: useAliasI18n }) => {
  const [context, setContext] = useState({});
  // const [updatedLocale, setUpdatedLocale] = useState(locale);
  const { initialized, i18n } = useAliasI18n();

  useEffect(() => {
    if (initialized) {
      try {
        setContext({
          initialized,
          i18n,
          language: locale
        });
      } catch (e) {
        //
      }
    }
  }, [initialized, locale, i18n]);

  return (initialized && <I18nContext.Provider value={context}>{children}</I18nContext.Provider>) || <React.Fragment />;
};

/**
 * Prop types.
 *
 * @type {{loadPath: string, children: React.ReactNode, locale: string, fallbackLng: string}}
 */
I18n.propTypes = {
  children: PropTypes.node.isRequired,
  locale: PropTypes.string,
  useI18n: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{loadPath: string, locale: null, fallbackLng: string}}
 */
I18n.defaultProps = {
  locale: null,
  useI18n
};

export { I18n as default, I18n, i18next, translate, translateComponent };
