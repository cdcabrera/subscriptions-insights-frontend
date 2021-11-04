import axios, { CancelToken } from 'axios';
import LruCache from 'lru-cache';
import { platformServices } from './platformServices';
import { serviceHelpers } from './common/helpers';

/**
 * Apply consistent service configuration.
 *
 * @param {object} passedConfig
 * @returns {object}
 */
const serviceConfig = (passedConfig = {}) => ({
  headers: {},
  timeout: process.env.REACT_APP_AJAX_TIMEOUT,
  ...passedConfig
});

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
  maxAge: Number.parseInt(process.env.REACT_APP_AJAX_CACHE, 10),
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
 * @param {string} config.url
 * @param {object} config.params
 * @param {boolean} config.cache
 * @param {boolean} config.cancel
 * @param {string} config.cancelId
 * @param {*} config.errorSchema
 * @param {*} config.responseSchema
 * @returns {Promise<*>}
 */
const serviceCall = async config => {
  await platformServices.getUser();

  const updatedConfig = { ...config, cache: undefined, cacheResponse: config.cache };
  const axiosInstance = axios.create();
  const sortedParams =
    (updatedConfig.params && Object.entries(updatedConfig.params).sort(([a], [b]) => a.localeCompare(b))) || [];
  const cacheId = `${updatedConfig.url}-${JSON.stringify(sortedParams)}`;

  if (updatedConfig.cancel === true) {
    const cancelTokensId = `${updatedConfig.cancelId || ''}-${updatedConfig.url}`;

    if (cancelTokens[cancelTokensId]) {
      cancelTokens[cancelTokensId].cancel('cancelled request');
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

      return axiosInstance(serviceConfig(updatedConfig));
    }
  }

  if (updatedConfig.schema) {
    const schemas = [undefined, response => Promise.reject(response)];
    const successSchema = updatedConfig.schema[0];
    const errorSchema = updatedConfig.schema[1];

    if (successSchema) {
      schemas[0] = response => {
        const updatedResponse = { ...response };
        const { data, error: normalizeError } = serviceHelpers.responseNormalize(updatedResponse.data, successSchema);

        if (!normalizeError) {
          updatedResponse.data = data;
        }

        return updatedResponse;
      };
    }

    if (errorSchema) {
      schemas[1] = response => {
        const updatedResponse = { ...response };
        const { data, error: normalizeError } = serviceHelpers.responseNormalize(
          updatedResponse?.response?.data,
          errorSchema
        );

        if (!normalizeError) {
          updatedResponse.response = { ...updatedResponse.response, data };
        }

        return updatedResponse;
      };
    }

    axiosInstance.interceptors.response.use(...schemas);
  }

  if (updatedConfig.transform) {
    const schemas = [undefined, response => Promise.reject(response)];
    const successTransform = updatedConfig.transform[0];
    const errorTransform = updatedConfig.transform[1];

    if (successTransform) {
      schemas[0] = response => {
        const updatedResponse = { ...response };
        const { data, error: normalizeError } = serviceHelpers.responseNormalize(
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
      schemas[1] = response => {
        const updatedResponse = { ...response };
        const { data, error: normalizeError } = serviceHelpers.responseNormalize(
          updatedResponse?.response?.data,
          errorTransform
        );

        if (!normalizeError) {
          updatedResponse.response = { ...updatedResponse.response, data };
        }

        return updatedResponse;
      };
    }

    axiosInstance.interceptors.response.use(...schemas);
  }

  if (updatedConfig.cacheResponse === true) {
    axiosInstance.interceptors.response.use(
      response => {
        const updatedResponse = { ...response };

        if (updatedConfig.cacheResponse === true) {
          responseCache.set(cacheId, updatedResponse);
        }

        return updatedResponse;
      },
      response => Promise.reject(response)
    );
  }

  return axiosInstance(serviceConfig(updatedConfig));
};

const config = { serviceCall, serviceConfig };

export { config as default, config, serviceCall, serviceConfig };
