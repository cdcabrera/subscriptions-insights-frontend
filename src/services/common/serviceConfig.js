import axios, { CancelToken } from 'axios';
import { LRUCache } from 'lru-cache';
import _cloneDeep from 'lodash/cloneDeep';
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

// ToDo: review using a function for pollInterval, scenario expanding the poll
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
 * @param {{ location: Function|string, validate: Function, pollInterval: number,
 *     pollResponse: boolean, status: Function }|Function} config.poll
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
          _cloneDeep(updatedResponse.data),
          _cloneDeep(updatedResponse.config)
        );

        if (normalizeError) {
          console.warn(normalizeError);
        } else {
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
          (updatedResponse?.data && _cloneDeep(updatedResponse.data)) || updatedResponse?.message,
          _cloneDeep(updatedResponse.config)
        );

        if (normalizeError) {
          console.warn(normalizeError);
        } else {
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

  if (typeof updatedConfig.poll === 'function' || typeof updatedConfig.poll?.validate === 'function') {
    axiosInstance.interceptors.response.use(
      async response => {
        const updatedResponse = { ...response };
        const callbackResponse = _cloneDeep(updatedResponse);

        // passed conversions, allow future updates by passing original poll config
        const updatedPoll = {
          ...updatedConfig.poll,
          // internal counter passed towards validate
          __retryCount: updatedConfig.poll.__retryCount ?? 0,
          // a url, or callback that returns a url to poll the put/posted url
          location: updatedConfig.poll.location || updatedConfig.url,
          // only required param, a function, validate status in prep for next
          validate: updatedConfig.poll.validate || updatedConfig.poll,
          // a number, the setTimeout interval
          pollInterval: updatedConfig.poll.pollInterval || pollInterval
        };

        let validated = true;

        try {
          validated = await updatedPoll.validate.call(null, callbackResponse, updatedPoll.__retryCount);
        } catch (err) {
          console.error(err);
        }

        if (validated) {
          return updatedResponse;
        }

        let tempLocation = updatedPoll.location;

        if (typeof tempLocation === 'function') {
          try {
            tempLocation = await tempLocation.call(null, callbackResponse, updatedPoll.__retryCount);
          } catch (err) {
            console.error(err);
          }
        }

        if (updatedPoll.chainPollResponse !== false && typeof updatedPoll.status === 'function') {
          try {
            updatedPoll.status.call(null, callbackResponse, updatedPoll.__retryCount);
          } catch (err) {
            console.error(err);
          }
        }

        const pollResponse = new Promise(resolve => {
          window.setTimeout(async () => {
            const output = await axiosServiceCall({
              ...config,
              method: 'get',
              data: undefined,
              url: tempLocation,
              cache: false,
              poll: { ...updatedPoll, __retryCount: updatedPoll.__retryCount + 1 }
            });

            resolve(output);
          }, updatedPoll.pollInterval);
        }).finally(() => {
          if (updatedPoll.chainPollResponse !== false && typeof updatedPoll.status === 'function') {
            Promise.resolve(pollResponse).then(
              res => {
                try {
                  console.log('>>>>> FINALLY success', res, updatedPoll.__retryCount);
                  updatedPoll.status.call(null, res, updatedPoll.__retryCount);
                } catch (err) {
                  console.error(err);
                }
                /*
                 * console.log('>>>>> FINALLY callbackresponse', callbackResponse);
                 * console.log('>>>>> FINALLY success', success);
                 */
              },
              res => {
                try {
                  console.log('>>>>> FINALLY error', res, updatedPoll.__retryCount);
                  updatedPoll.status.call(null, res, updatedPoll.__retryCount);
                } catch (err) {
                  console.error(err);
                }
              }
            );
          }

          /*
           *console.log('>>>>> FINALLY', (async () => pollResponse)());
           *console.log('>>>>> FINALLY', callbackResponse);
           *
           *if (updatedPoll.chainPollResponse !== false && typeof updatedPoll.status === 'function') {
           *  try {
           *    updatedPoll.status.call(null, callbackResponse, updatedPoll.__retryCount);
           *  } catch (err) {
           *    console.error(err);
           *  }
           *}
           */
        });

        if (updatedPoll.chainPollResponse !== false) {
          return pollResponse;
        }

        // works, but returns a promise to the status call instead... should probably rename it to avoid confusion

        // like resolver OR make it so you can't call poll unless it is chained... avoid to many options
        if (typeof updatedPoll.status === 'function') {
          try {
            /*
             * const results = await pollResponse;
             * updatedPoll.status.call(null, results, updatedPoll.__retryCount);
             */
            updatedPoll.status.call(null, pollResponse, updatedPoll.__retryCount);
          } catch (err) {
            console.error(err);
          }
        }

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
