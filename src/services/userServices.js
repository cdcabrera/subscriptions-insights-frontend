import Cookie from 'js-cookie';
import { helpers } from '../common/helpers';

const authorizeUser = () => {
  let returnMethod = helpers.noopPromise;

  try {
    returnMethod = window.insights.chrome.auth.getUser;
  } catch (e) {
    if (!helpers.TEST_MODE) {
      console.warn(`{ getUser } = insights.chrome.auth: ${e.message}`);
    }
  }

  return returnMethod;
};

const getLocaleFromCookie = () => {
  try {
    const supportedLocales = process.env.REACT_APP_CONFIG_SERVICE_SUPPORTED_LOCALES.split(',');
    const cookieValue = Cookie.get(process.env.REACT_APP_CONFIG_SERVICE_LOCALES_COOKIE);
    if (cookieValue && supportedLocales.indexOf(cookieValue) > -1) {
      const majorLocaleValue = cookieValue.split('_')[0];
      return { value: majorLocaleValue, key: cookieValue };
    }
    return null;
  } catch (e) {
    if (!helpers.TEST_MODE) {
      console.warn(`Unable to parse locale ${e.message}`);
    }
    return null;
  }
};

const getLocale = () => {
  const defaultLocale = {
    value: process.env.REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG,
    key: process.env.REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG_KEY
  };
  const cookieLocale = getLocaleFromCookie();
  const locale = cookieLocale || defaultLocale;

  return new Promise(resolve => {
    if (locale) {
      return resolve({
        data: getLocaleFromCookie() || defaultLocale
      });
    }
    return resolve({});
  });
};

const logoutUser = () =>
  new Promise(resolve => {
    resolve({});
  });

const userServices = { authorizeUser, getLocale, logoutUser };

export { userServices as default, userServices, authorizeUser, getLocale, logoutUser };
