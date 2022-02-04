import axios, { CancelToken } from 'axios';
import LruCache from 'lru-cache';
import { serviceHelpers } from './helpers';

/**
 * Set Axios XHR default timeout.
 */
const globalXhrTimeout = Number.parseInt(process.env.REACT_APP_AJAX_TIMEOUT, 10) || 60000;

/**
 * Cache Axios service call cancel tokens.
 *
 * @private
 * @type {object}
 */
const globalCancelTokens = {};

/**
 * Cache Axios service call responses.
 *
 * @type {object}
 */
const globalResponseCache = new LruCache({
  maxAge: Number.parseInt(process.env.REACT_APP_AJAX_CACHE, 10) || 30000,
  max: 100,
  updateAgeOnGet: true
});

/**
 * Set modified Axios configuration and instance. Additions include
 * - schema validation
 * - response transformations
 * - caching plain responses, caching of validated and transformed response
 * - automatic cancelling if the same call is fired in succession
 *
 * @param {object} config
 * @param {boolean} config.cache
 * @param {boolean} config.cancel
 * @param {string} config.cancelId
 * @param {object} config.headers
 * @param {object} config.params
 * @param {Array} config.schema
 * @param {number} config.timeout
 * @param {Array} config.transform
 * @param {string|Function} config.url Provide an API path, or a function that returns a promise/promise like function, or emulated API response.
 */
/*
class AxiosConfigPROBSWITHASYNC {
  axiosInstance = axios.create();

  config = {};

  cancelledMessage = 'cancelled request';

  cancelTokens = globalCancelTokens;

  responseCache = globalResponseCache;

  xhrTimeout = globalXhrTimeout;

  constructor(config) {
    this.config = {
      timeout: this.xhrTimeout,
      ...config,
      cache: undefined,
      cacheResponse: config.cache
    };
  }

  serviceCall() {
    const { axiosInstance, cacheId, config, responseCache } = this;
    const updatedConfig = { ...config };

    this.setCacheId();
    this.setCancel();

    if (updatedConfig.cacheResponse === true) {
      const cachedResponse = responseCache.get(cacheId);

      if (cachedResponse) {
        updatedConfig.adapter = adapterConfig =>
          Promise.resolve({
            ...cachedResponse,
            status: 304,
            statusText: 'Not Modified',
            config: adapterConfig
          });

        return axiosInstance(updatedConfig);
      }
    }

    this.setTransformations();

    if (updatedConfig.cacheResponse === true) {
      axiosInstance.interceptors.response.use(
        response => {
          const updatedResponse = { ...response };
          responseCache.set(cacheId, updatedResponse);
          return updatedResponse;
        },
        response => Promise.reject(response)
      );
    }

    (async () => this.setEmulatedService())();
    // this.setEmulatedService();

    console.log('CLASS AXIOS CONFIG >>>>>>>', updatedConfig);

    return (
      (updatedConfig.url && axiosInstance(updatedConfig)) || Promise.reject(new Error('Axios config.url missing.'))
    );
  }

  setCacheId() {
    const { config } = this;
    const sortedParams = (config.params && Object.entries(config.params).sort(([a], [b]) => a.localeCompare(b))) || [];

    this.cacheId = `${config.url || ''}-${JSON.stringify(sortedParams)}`;
  }

  setCancel() {
    const { config, cancelledMessage, cancelTokens } = this;
    const updatedConfig = { ...config };

    if (updatedConfig.cancel === true) {
      const cancelTokensId = `${updatedConfig.cancelId || ''}-${updatedConfig.url}`;

      if (cancelTokens[cancelTokensId]) {
        cancelTokens[cancelTokensId].cancel(cancelledMessage);
      }

      cancelTokens[cancelTokensId] = CancelToken.source();
      updatedConfig.cancelToken = cancelTokens[cancelTokensId].token;

      delete updatedConfig.cancel;
    }

    this.config = updatedConfig;
  }

  setTransformations() {

  }

  async setEmulatedService() {

  }
}
*/

/**
 * Generate a cache ID.
 *
 * @param {object} config
 * @param {object} config.params
 * @param {string|Function} config.url
 * @returns {string}
 */
const setCacheId = (config = {}) => {
  const sortedParams = (config.params && Object.entries(config.params).sort(([a], [b]) => a.localeCompare(b))) || [];
  return `${config.url || ''}-${JSON.stringify(sortedParams)}`;
};

/**
 * Generate a cancel token.
 *
 * @param {object} config
 * @param {boolean} config.cancel
 * @param {string} config.cancelId
 * @param {string|Function} config.url
 * @param {object} options
 * @param {string} options.cancelledMessage
 * @param {object} options.cancelTokens
 * @returns {object}
 */
const setCancel = (config = {}, { cancelledMessage = '', cancelTokens } = {}) => {
  const updatedConfig = { ...config };
  const updatedCancelTokens = cancelTokens;

  if (updatedConfig.cancel === true) {
    const cancelTokensId = `${updatedConfig.cancelId || ''}-${updatedConfig.url}`;

    if (updatedCancelTokens[cancelTokensId]) {
      updatedCancelTokens[cancelTokensId].cancel(cancelledMessage);
    }

    updatedCancelTokens[cancelTokensId] = CancelToken.source();
    updatedConfig.cancelToken = updatedCancelTokens[cancelTokensId].token;

    delete updatedConfig.cancel;
  }

  return updatedConfig;
};

/**
 * Confirm transformation config, format, return an array of transformations (schema checks, response transforms).
 *
 * @param {object} config
 * @param {Array} config.schema
 * @param {Array} config.transform
 * @param {object} options
 * @param {string} options.cancelledMessage
 * @returns {Array}
 */
const setTransformations = (config = {}, { cancelledMessage = '' } = {}) => {
  const responseTransformers = [];

  if (config.schema) {
    responseTransformers.push(config.schema);
  }

  if (config.transform) {
    responseTransformers.push(config.transform);
  }

  return responseTransformers.map(([successTransform, errorTransform]) => {
    const transformers = [undefined, response => Promise.reject(response)];

    if (successTransform) {
      transformers[0] = response => {
        const updatedResponse = { ...response };
        const { data, error: normalizeError } = serviceHelpers.passDataToCallback(
          updatedResponse.data,
          successTransform
        );

        if (!normalizeError) {
          updatedResponse.data = data;
        }

        return updatedResponse;
      };
    }

    if (errorTransform) {
      transformers[1] = response => {
        const updatedResponse = { ...response };

        if (updatedResponse?.message === cancelledMessage) {
          return Promise.reject(updatedResponse);
        }

        const { data, error: normalizeError } = serviceHelpers.passDataToCallback(
          updatedResponse?.response?.data,
          errorTransform
        );

        if (!normalizeError) {
          updatedResponse.response = { ...updatedResponse.response, data };
        }

        return Promise.reject(updatedResponse);
      };
    }

    return transformers;
    // this.axiosInstance.interceptors.response.use(...transformers);
  });
};

/**
 * Return an emulated service response with a function. Applies a consistent way of returning data in scenarios where
 * global functions are provided.
 *
 * @param {object} config
 * @param {string|Function} config.url
 * @returns {Promise}
 */
const setEmulatedService = async config => {
  const updatedConfig = { ...config };

  if (typeof updatedConfig.url === 'function') {
    const emulateCallback = updatedConfig.url;
    updatedConfig.url = '/';

    let message = `success, emulated`;
    let emulatedResponse;
    let isSuccess = true;

    try {
      emulatedResponse = await emulateCallback();
    } catch (e) {
      isSuccess = false;
      message = e.message;
    }

    if (isSuccess) {
      updatedConfig.adapter = adapterConfig =>
        Promise.resolve({
          data: emulatedResponse,
          status: 200,
          statusText: message,
          config: adapterConfig
        });
    } else {
      updatedConfig.adapter = adapterConfig =>
        Promise.reject({ // eslint-disable-line
          ...new Error(message),
          message,
          status: 418,
          config: adapterConfig
        });
    }
  }

  return updatedConfig;
};

/**
 * Set Axios configuration.
 *
 * @param {object} config
 * @param {object} config.cache
 * @param {boolean} config.cancel
 * @param {string} config.cancelId
 * @param {object} config.params
 * @param {Array} config.schema
 * @param {Array} config.transform
 * @param {string|Function} config.url
 * @param {object} options
 * @param {string} options.cancelledMessage
 * @param {object} options.cancelTokens
 * @param {object} options.responseCache
 * @param {number} options.xhrTimeout
 * @returns {Promise}
 */
const axiosConfig = async (
  config = {},
  {
    cancelledMessage = 'cancelled request',
    cancelTokens = globalCancelTokens,
    responseCache = globalResponseCache,
    xhrTimeout = globalXhrTimeout
  } = {}
) => {
  const axiosInstance = axios.create();
  let updatedConfig = {
    timeout: xhrTimeout,
    ...config,
    cache: undefined,
    cacheResponse: config.cache
  };

  const cacheId = setCacheId(updatedConfig);

  updatedConfig = setCancel(updatedConfig, { cancelledMessage, cancelTokens });

  if (updatedConfig.cacheResponse === true) {
    const cachedResponse = responseCache.get(cacheId);

    if (cachedResponse) {
      updatedConfig.adapter = adapterConfig =>
        Promise.resolve({
          ...cachedResponse,
          status: 304,
          statusText: 'Not Modified',
          config: adapterConfig
        });

      return axiosInstance(updatedConfig);
    }
  }

  setTransformations(updatedConfig, { cancelledMessage }).forEach(transformers =>
    axiosInstance?.interceptors?.response?.use(...transformers)
  );

  if (updatedConfig.cacheResponse === true) {
    axiosInstance?.interceptors?.response?.use(
      response => {
        const updatedResponse = { ...response };
        responseCache.set(cacheId, updatedResponse);
        return updatedResponse;
      },
      response => Promise.reject(response)
    );
  }

  updatedConfig = await setEmulatedService(updatedConfig);

  console.log('REWRITE AXIOS CONFIG >>>>>>>', updatedConfig);

  // return (updatedConfig.url && axiosInstance(updatedConfig)) || Promise.reject(new Error('Axios config.url missing.'));
  return axiosInstance(updatedConfig);
};

const serviceConfig = { axiosConfig, globalXhrTimeout, globalCancelTokens, globalResponseCache };

export {
  serviceConfig as default,
  serviceConfig,
  axiosConfig,
  globalXhrTimeout,
  globalCancelTokens,
  globalResponseCache
};
