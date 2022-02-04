import axios, { CancelToken } from 'axios';
import LruCache from 'lru-cache';
import { serviceHelpers } from './helpers';

/**
 * Cache Axios service call cancel tokens.
 *
 * @private
 * @type {object}
 */
const cancelTokens = {};

/**
 * Cache Axios service call responses.
 *
 * @type {object}
 */
const responseCache = new LruCache({
  maxAge: Number.parseInt(process.env.REACT_APP_AJAX_CACHE, 10) || 30000,
  max: 100,
  updateAgeOnGet: true
});

/**
 * Set Axios configuration, which includes response schema validation and caching.
 * Call platform "getUser" auth method, and apply service config. Service configuration
 * includes the ability to cancel all and specific calls, cache and normalize a response
 * based on both a provided schema and a successful API response. The cache will refresh
 * its timeout on continuous calls. To reset it a user will either need to refresh the
 * page or wait the "maxAge".
 *
 * @param {object} config
 * @param {boolean} config.authenticate
 * @param {string} config.url
 * @param {object} config.params
 * @param {boolean} config.cache
 * @param {boolean} config.cancel
 * @param {string} config.cancelId
 * @param {Array} config.schema
 * @param {Array} config.transform
 * @returns {Promise<*>}
 */
const serviceCall = async (config = {}) => {
  const updatedConfig = {
    ...config,
    cache: undefined,
    cacheResponse: config.cache
  };

  const responseTransformers = [];
  const cancelledMessage = 'cancelled request';
  const axiosInstance = axios.create();
  const sortedParams =
    (updatedConfig.params && Object.entries(updatedConfig.params).sort(([a], [b]) => a.localeCompare(b))) || [];
  const cacheId = `${updatedConfig.url || ''}-${JSON.stringify(sortedParams)}`;

  if (updatedConfig.cancel === true) {
    const cancelTokensId = `${updatedConfig.cancelId || ''}-${updatedConfig.url}`;

    if (cancelTokens[cancelTokensId]) {
      cancelTokens[cancelTokensId].cancel(cancelledMessage);
    }

    cancelTokens[cancelTokensId] = CancelToken.source();
    updatedConfig.cancelToken = cancelTokens[cancelTokensId].token;

    delete updatedConfig.cancel;
  }

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

  if (updatedConfig.schema) {
    responseTransformers.push(updatedConfig.schema);
  }

  if (updatedConfig.transform) {
    responseTransformers.push(updatedConfig.transform);
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

    axiosInstance.interceptors.response.use(...transformers);
  });

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

  console.log('API >>>>>>>', updatedConfig);

  return axiosInstance(updatedConfig);
};

const api = { serviceCall };

export { api as default, api, serviceCall };
