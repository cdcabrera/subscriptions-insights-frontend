import { rbacConfig as permissions } from '../../config';
// import { platformApiTypes } from '../../types';
import {
  platformConstants,
  PLATFORM_API_RESPONSE_USER_PERMISSION_APP_TYPES as APP_TYPES,
  PLATFORM_API_RESPONSE_USER_PERMISSION_RESOURCE_TYPES as RESOURCE_TYPES,
  PLATFORM_API_RESPONSE_USER_PERMISSION_OPERATION_TYPES as OPERATION_TYPES
} from '../platform/platformConstants';

// ToDo: FOR TOMORROW... remember to review implementing a schema for Platform responses... parts of this selector transform look like simple API schema aspects
const userAuthorization = response => {
  const updatedResponse = {};
  const { user = {}, permissions: responsePermissions = [] } = response;

  updatedResponse.admin =
    user?.[platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY]?.[
      platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES.USER
    ]?.[platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES.ORG_ADMIN] || false;

  updatedResponse.entitled =
    user?.[platformConstants.PLATFORM_API_RESPONSE_USER_ENTITLEMENTS]?.[APP_TYPES.SUBSCRIPTIONS]?.[
      platformConstants.PLATFORM_API_RESPONSE_USER_ENTITLEMENTS_APP_TYPES.ENTITLED
    ] || false;

  // All permissions breakdown
  responsePermissions.forEach(
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

      if (!updatedResponse.permissions[app].resources[resource]) {
        updatedResponse.permissions[app].resources[resource] = {};
      }

      updatedResponse.permissions[app].resources[resource][operation] = definitions;
    }
  );

  // Alias specific app permissions checks
  Object.entries(permissions).forEach(([key, { permissions: resourcePermissions }]) => {
    updatedResponse.authorized[key] = updatedResponse.permissions[key]?.all || false;

    resourcePermissions.forEach(({ resource: res, operation: op }) => {
      if (updatedResponse.permissions[key]?.resources?.[res]?.[op]) {
        updatedResponse.authorized[key] = true;
      }
    });
  });

  return updatedResponse;
};

const userTransformers = {
  authorization: userAuthorization
};

export { userTransformers as default, userTransformers, userAuthorization };
