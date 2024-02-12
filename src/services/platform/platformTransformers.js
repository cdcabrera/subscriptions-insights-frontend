import { rbacConfig } from '../../config';
import {
  platformConstants,
  PLATFORM_API_EXPORT_STATUS_TYPES,
  PLATFORM_API_EXPORT_FILENAME_PREFIX as EXPORT_PREFIX,
  PLATFORM_API_RESPONSE_USER_PERMISSION_OPERATION_TYPES as OPERATION_TYPES,
  PLATFORM_API_RESPONSE_USER_PERMISSION_RESOURCE_TYPES as RESOURCE_TYPES
} from './platformConstants';
import { helpers } from '../../common';

/**
 * Transform export responses. Combines multiple exports, or a single export,
 * into the same response format.
 *
 * @memberof Platform
 * @module PlatformTransformers
 */

/**
 * Parse platform export response.
 *
 * @param {object} response
 * @returns {object}
 */
const exports = response => {
  const updatedResponse = { data: [], meta: {} };
  const {
    [platformConstants.PLATFORM_API_EXPORT_RESPONSE_DATA]: data,
    [platformConstants.PLATFORM_API_EXPORT_RESPONSE_TYPES.FORMAT]: format,
    [platformConstants.PLATFORM_API_EXPORT_RESPONSE_TYPES.ID]: id,
    [platformConstants.PLATFORM_API_EXPORT_RESPONSE_TYPES.NAME]: name,
    [platformConstants.PLATFORM_API_EXPORT_RESPONSE_TYPES.STATUS]: status
  } = response || {};

  const getProductId = str => {
    const updatedStr = str;
    const attemptId = updatedStr?.replace(`${EXPORT_PREFIX}-`, '')?.trim();

    if (attemptId === updatedStr) {
      return undefined;
    }

    return attemptId;
  };

  const getProductStatus = str => {
    const updatedStr = str;
    let updatedStatus = PLATFORM_API_EXPORT_STATUS_TYPES.PENDING;

    if (
      updatedStr === PLATFORM_API_EXPORT_STATUS_TYPES.FAILED ||
      updatedStr === PLATFORM_API_EXPORT_STATUS_TYPES.COMPLETED
    ) {
      updatedStatus = updatedStr;
    }

    return updatedStatus;
  };

  if (Array.isArray(data)) {
    const filteredAndFormatted = data
      .filter(({ [platformConstants.PLATFORM_API_EXPORT_RESPONSE_TYPES.NAME]: exportName }) =>
        new RegExp(`^${EXPORT_PREFIX}`, 'i').test(exportName)
      )
      .map(
        ({
          [platformConstants.PLATFORM_API_EXPORT_RESPONSE_TYPES.FORMAT]: exportFormat,
          [platformConstants.PLATFORM_API_EXPORT_RESPONSE_TYPES.ID]: exportId,
          [platformConstants.PLATFORM_API_EXPORT_RESPONSE_TYPES.NAME]: exportName,
          [platformConstants.PLATFORM_API_EXPORT_RESPONSE_TYPES.STATUS]: exportStatus
        }) => {
          const productId = getProductId(exportName);
          const focusedStatus = getProductStatus(exportStatus);

          updatedResponse.meta[focusedStatus] ??= new Set();
          updatedResponse.meta[focusedStatus].add(productId);

          updatedResponse.meta[exportFormat] ??= new Set();
          updatedResponse.meta[exportFormat].add(productId);

          if (focusedStatus === PLATFORM_API_EXPORT_STATUS_TYPES.PENDING) {
            updatedResponse.meta.pollingFormats ??= new Set();
            updatedResponse.meta.pollingFormats.add(exportFormat);
          }

          return {
            format: exportFormat,
            id: exportId,
            name: exportName,
            status: exportStatus,
            productId
          };
        }
      );

    updatedResponse.data.push(...filteredAndFormatted);
  } else if (id && status && new RegExp(`^${EXPORT_PREFIX}`, 'i').test(name)) {
    const productId = getProductId(name);
    const focusedStatus = getProductStatus(status);

    updatedResponse.meta[focusedStatus] ??= new Set();
    updatedResponse.meta[focusedStatus].add(productId);

    updatedResponse.meta[format] ??= new Set();
    updatedResponse.meta[format].add(productId);

    if (focusedStatus === PLATFORM_API_EXPORT_STATUS_TYPES.PENDING) {
      updatedResponse.meta.pollingFormats ??= new Set();
      updatedResponse.meta.pollingFormats.add(format);
    }

    updatedResponse.data.push({
      format,
      id,
      name,
      productId: getProductId(name),
      status
    });
  }

  Object.entries(updatedResponse.meta).forEach(([key, value]) => {
    updatedResponse.meta[key] = Array.from(value);
  });

  return updatedResponse;
};

/**
 * Parse platform getUser response.
 *
 * @param {object} response
 * @returns {object}
 */
const user = response => {
  const updatedResponse = {};
  const {
    [platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY]: identity = {},
    [platformConstants.PLATFORM_API_RESPONSE_USER_ENTITLEMENTS]: entitlements = {}
  } = response || {};

  updatedResponse.isAdmin =
    identity?.[platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES.USER]?.[
      platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES.ORG_ADMIN
    ] || false;

  updatedResponse.isEntitled =
    entitlements?.[helpers.UI_NAME]?.[platformConstants.PLATFORM_API_RESPONSE_USER_ENTITLEMENTS_APP_TYPES.ENTITLED] ||
    false;

  return updatedResponse;
};

/**
 * Parse platform getUserPermissions response.
 *
 * @param {object} response
 * @param {object} options
 * @param {object} options.config Pass in a configuration object, RBAC
 * @returns {object}
 */
const userPermissions = (response, { config = rbacConfig } = {}) => {
  const updatedResponse = {
    permissions: {},
    authorized: {}
  };

  response?.forEach(
    ({
      [platformConstants.PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES.PERMISSION]: permission,
      [platformConstants.PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES.RESOURCE_DEFS]: definitions = []
    }) => {
      const [app = '', resource, operation] = permission?.split(':') || [];

      if (!updatedResponse.permissions[app]) {
        updatedResponse.permissions[app] = {
          all: false,
          resources: {}
        };
      }

      if (resource === RESOURCE_TYPES.ALL && operation === OPERATION_TYPES.ALL) {
        updatedResponse.permissions[app].all = true;
      }

      if (resource) {
        updatedResponse.permissions[app].resources[resource] ??= {};

        if (operation) {
          updatedResponse.permissions[app].resources[resource][operation] = definitions;
        }
      }
    }
  );

  // Alias specific app permissions checks
  Object.entries(config).forEach(([key, { permissions: resourcePermissions }]) => {
    updatedResponse.authorized[key] = updatedResponse.permissions[key]?.all || false;

    resourcePermissions.forEach(({ resource: res, operation: op }) => {
      if (updatedResponse.permissions[key]?.resources?.[res]?.[op]) {
        updatedResponse.authorized[key] = true;
      }
    });
  });

  return updatedResponse;
};

const platformTransformers = {
  exports,
  user,
  permissions: userPermissions
};

export { platformTransformers as default, platformTransformers, exports, user, userPermissions };
