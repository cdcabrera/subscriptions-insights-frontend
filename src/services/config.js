import { platformServices } from './platform/platformServices';
import { AxiosConfig } from './common/serviceConfig';

/**
 * Apply custom service configuration.
 *
 * @param {object} passedConfig
 * @returns {object}
 */
const serviceConfig = (passedConfig = {}) => ({
  headers: {},
  ...passedConfig
});

/**
 * Pass service configuration, call basic auth with platform getUser, call service.
 *
 * @param {object} config
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
  await platformServices.getUser();
  return new AxiosConfig(serviceConfig(config)).serviceCall();
};

const config = { serviceCall, serviceConfig };

export { config as default, config, serviceCall, serviceConfig };
