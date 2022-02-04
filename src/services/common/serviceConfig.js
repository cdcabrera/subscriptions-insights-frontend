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
class AxiosConfig {
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

  get serviceCall() {
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

    this.setEmulatedService();

    return axiosInstance(updatedConfig);
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
    const { config, cancelledMessage } = this;
    const responseTransformers = [];

    if (config.schema) {
      responseTransformers.push(config.schema);
    }

    if (config.transform) {
      responseTransformers.push(config.transform);
    }

    responseTransformers.forEach(([successTransform, errorTransform]) => {
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

      this.axiosInstance.interceptors.response.use(...transformers);
    });
  }

  async setEmulatedService() {
    const { config } = this;
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

    this.config = updatedConfig;
  }
}

const serviceConfig = { AxiosConfig, globalXhrTimeout, globalCancelTokens, globalResponseCache };

export {
  serviceConfig as default,
  serviceConfig,
  AxiosConfig,
  globalXhrTimeout,
  globalCancelTokens,
  globalResponseCache
};
