import _snakeCase from 'lodash/snakeCase';
import otherKeys from './keys.json';

/**
 * IIFE for generating a listing of available locale resources via webpack.
 * - Uses webpack compiler to group all locale configuration files across "src"
 *
 * @type {Array}
 */
const locales = (() => {
  const mergedLocale = {};

  try {
    const path = require.context(
      '../',
      true,
      new RegExp(`locale\\.${process.env.REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG}\\.json`, 'i')
    );

    path
      .keys()
      .map(path)
      .forEach(fileOut => {
        Object.assign(mergedLocale, fileOut);
      });
  } catch (e) {
    /**
     * Basic configuration for testing only.
     */
    if (process.env.REACT_APP_ENV === 'test' && require) {
    const { globSync } = require('glob'); // eslint-disable-line

      globSync(`./src/** /*locale.${process.env.REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG}.json`)?.forEach(file => {
      const fileOut = require(`../../${file}`); // eslint-disable-line
        Object.assign(mergedLocale, fileOut);
      });
    } else {
      console.warn(`Locale configuration failed to load: ${e.message}`);
    }
  }

  return mergedLocale;
})();

/**
 * IIFE for generating a listing of available locale keys.
 *
 * @type {object}
 */
const localeKeys = (() => {
  const formatedKeys = {};
  const keys = {};

  const setKeys = (obj, parent) => {
    if (typeof obj !== 'string') {
      Object.entries(obj).forEach(([key, value]) => {
        if (!parent) {
          keys[key] ??= key;
          setKeys(value, key);
        } else {
          const updatedKey = [keys[parent], key].join('.');
          keys[updatedKey] ??= updatedKey;
          setKeys(value, updatedKey);
        }
      });
    }
  };

  setKeys(locales);

  Object.entries(keys).forEach(([key, value]) => {
    formatedKeys[_snakeCase(key)] = value;
  });

  return formatedKeys;
})();

export { locales as default, locales, localeKeys, otherKeys };
