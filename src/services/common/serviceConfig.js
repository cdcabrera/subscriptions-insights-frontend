import axios, { CancelToken } from 'axios';
import { LRUCache } from 'lru-cache';
import { serviceHelpers } from './helpers';
import { helpers } from '../../common/helpers';

/**
 * Axios config for cancelling, caching, and emulated service calls.
 *
 * @memberof Helpers
 * @module ServiceConfig
 */

/**
 * Set Axios XHR default timeout.
 *
 * @type {number}
 */
const globalXhrTimeout = Number.parseInt(process.env.REACT_APP_AJAX_TIMEOUT, 10) || 60000;

/**
 * Set Axios polling default.
 *
 * @type {number}
 */
const globalPollInterval = Number.parseInt(process.env.REACT_APP_AJAX_POLL_INTERVAL, 10) || 10000;

/**
 * Cache Axios service call cancel tokens.
 *
 * @type {object}
 */
const globalCancelTokens = {};

/**
 * Cache Axios service call responses.
 *
 * @type {object}
 */
const globalResponseCache = new LRUCache({
  ttl: Number.parseInt(process.env.REACT_APP_AJAX_CACHE, 10) || 30000,
  max: 100,
  updateAgeOnGet: true
});

// ToDo: consider another way of hashing cacheIDs. base64 could get a little large depending on settings, i.e. md5
/**
 * Set Axios configuration. This includes response schema validation and caching.
 * Call platform "getUser" auth method, and apply service config. Service configuration
 * includes the ability to cancel all and specific calls, cache and normalize a response
 * based on both a provided schema and a successful API response. The cache will refresh
 * its timeout on continuous calls. To reset it a user will either need to refresh the
 * page or wait the "maxAge".
 *
 * @param {object} config
 * @param {object} config.cache
 * @param {boolean} config.cancel
 * @param {string} config.cancelId
 * @param {object} config.params
 * @param {{ location: Function|string, validate: Function, next: Function|string }|Function} config.poll
 * @param {Array} config.schema
 * @param {Array} config.transform
 * @param {string|Function} config.url
 * @param {object} options
 * @param {string} options.cancelledMessage
 * @param {object} options.responseCache
 * @param {number} options.xhrTimeout
 * @param {number} options.pollInterval
 * @returns {Promise<*>}
 */
const axiosServiceCall = async (
  config = {},
  {
    cancelledMessage = 'cancelled request',
    responseCache = globalResponseCache,
    xhrTimeout = globalXhrTimeout,
    pollInterval = globalPollInterval
  } = {}
) => {
  const updatedConfig = {
    timeout: xhrTimeout,
    ...config,
    cache: undefined,
    cacheResponse: config.cache,
    method: config.method || 'get'
  };
  const responseTransformers = [];
  const axiosInstance = axios.create();

  // don't cache responses if "get" isn't used
  updatedConfig.cacheResponse = updatedConfig.cacheResponse === true && updatedConfig.method === 'get';

  // account for alterations to transforms, and other config props
  const cacheId = (updatedConfig.cacheResponse === true && serviceHelpers.generateHash(updatedConfig)) || null;

  // simple check to place responsibility on consumer, primarily used for testing
  if (updatedConfig.exposeCacheId === true) {
    updatedConfig.cacheId = cacheId;
  }

  if (updatedConfig.cancel === true) {
    const cancelTokensId =
      updatedConfig.cancelId || serviceHelpers.generateHash({ ...updatedConfig, data: undefined, params: undefined });

    if (globalCancelTokens[cancelTokensId]) {
      await globalCancelTokens[cancelTokensId].cancel(cancelledMessage);
    }

    globalCancelTokens[cancelTokensId] = CancelToken.source();
    updatedConfig.cancelToken = globalCancelTokens[cancelTokensId].token;

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
          successTransform,
          updatedResponse.data,
          updatedResponse.config
        );

        if (!normalizeError) {
          updatedResponse.data = data;
        }

        return updatedResponse;
      };
    }

    if (errorTransform) {
      transformers[1] = response => {
        const updatedResponse = { ...(response.response || response) };

        if (updatedResponse?.message === cancelledMessage) {
          return Promise.reject(updatedResponse);
        }

        const { data, error: normalizeError } = serviceHelpers.passDataToCallback(
          errorTransform,
          updatedResponse?.data || updatedResponse?.message,
          updatedResponse.config
        );

        if (!normalizeError) {
          updatedResponse.response = { ...updatedResponse, data };
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

  // const isPollLocation =
  // typeof updatedConfig.poll?.location === 'string' || typeof updatedConfig.poll?.location === 'function';
  // const isPollValidate =
  //  typeof updatedConfig.poll?.validate === 'string' || typeof updatedConfig.poll?.validate === 'function';

  // if (typeof updatedConfig.poll === 'function' || (isPollLocation && isPollValidate)) {
  if (typeof updatedConfig.poll === 'function' || typeof updatedConfig.poll?.validate === 'function') {
    axiosInstance.interceptors.response.use(
      async response => {
        console.log('>>>> INTERCEPTOR FIRED');
        const updatedResponse = { ...response, pollResponse: [] };

        // passed conversions
        const updatedPoll = {
          __retryCount: updatedConfig.poll.__retryCount ?? 0, // internal counter passed towards validate
          location: updatedConfig.poll.location || updatedConfig.url, // a url, or callback that returns a url to poll the put/posted url
          next: updatedConfig.poll.next || Function.prototype, // url or callback that returns a url to get "next"
          validate: updatedConfig.poll.validate || updatedConfig.poll // only required param, a function, validate status in prep for next
        };

        if (updatedPoll.validate(updatedResponse, updatedPoll.__retryCount)) {
          // temp conversions
          let tempNext = updatedPoll.next;
          if (typeof tempNext === 'function') {
            tempNext = await tempNext.call(null, updatedResponse, updatedPoll.__retryCount);
          }
          /*
          if (typeof tempNext === 'string') {
            await axiosServiceCall({
              // ...config,
              // transform: undefined,
              // schema: undefined,
              method: 'get',
              // data: undefined,
              url: tempNext,
              cache: false
              // poll: undefined
            });
          }
          */

          // if (typeof tempNext === 'function' || helpers.isPromise(tempNext)) {
          // await tempNext.call(null, updatedResponse, updatedPoll.__retryCount);
          // } else {
          if (typeof tempNext === 'string') {
            await axiosServiceCall({
              method: 'get',
              url: tempNext,
              cache: false
            });
          }

          return updatedResponse;
        }

        let tempLocation = updatedPoll.location;
        if (typeof tempLocation === 'function') {
          tempLocation = await tempLocation.call(null, updatedResponse, updatedPoll.__retryCount);
        }

        window.setTimeout(async () => {
          const output = await axiosServiceCall({
            ...config,
            method: 'get',
            data: undefined,
            url: tempLocation,
            cache: false,
            poll: { ...updatedPoll, __retryCount: updatedPoll.__retryCount + 1 }
            // poll: { location: updatedLocation, validate: updatedValidate, _retryCount }
          });
          updatedResponse.pollResponse.push(output);

          // console.log('>>>>>>>>>>>>>>>> OUTPUT', updatedResponse.pollResponse);
        }, pollInterval);

        return updatedResponse;
      },
      response => Promise.reject(response)
    );
  }

  if (typeof updatedConfig.url === 'function') {
    const emulateCallback = updatedConfig.url;
    updatedConfig.url = '/emulated';

    let message = 'success, emulated';
    let emulatedResponse;
    let isSuccess = true;

    try {
      emulatedResponse = await serviceHelpers.timeoutFunctionCancel(emulateCallback, { timeout: xhrTimeout });
    } catch (e) {
      isSuccess = false;
      message = e.message || e;
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

  return axiosInstance(updatedConfig);
};

const serviceConfig = { axiosServiceCall, globalXhrTimeout, globalCancelTokens, globalResponseCache };

export {
  serviceConfig as default,
  serviceConfig,
  axiosServiceCall,
  globalXhrTimeout,
  globalCancelTokens,
  globalResponseCache
};
