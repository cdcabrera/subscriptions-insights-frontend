import { createSelector } from 'reselect';
import { platformApiTypes } from '../../types/platformApiTypes';
import { helpers } from '../../common/helpers';

/**
 * Return a combined state, props object.
 *
 * @private
 * @param {object} state
 * @returns {object}
 */
const statePropsFilter = state => ({
  ...state.user?.session
});

/**
 * Create selector, transform combined state, props into a consumable graph/charting object.
 *
 * @type {{session: {entitled: boolean, permissions: object, admin: boolean, error: boolean}}}
 */
const selector = createSelector([statePropsFilter], response => {
  const { error = false, fulfilled = false, data = {}, ...rest } = response || {};
  const updatedSession = {
    ...rest,
    admin: false,
    entitled: false,
    error,
    permissions: {}
  };

  if (!error && fulfilled) {
    const { user = {}, permissions: responsePermissions = [] } = data;

    const admin =
      user?.[platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY]?.[
        platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES.USER
      ]?.[platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES.ORG_ADMIN] || false;

    const entitled =
      user?.[platformApiTypes.PLATFORM_API_RESPONSE_USER_ENTITLEMENTS]?.[helpers.UI_NAME]?.[
        platformApiTypes.PLATFORM_API_RESPONSE_USER_ENTITLEMENTS_APP_TYPES.ENTITLED
      ] || false;

    responsePermissions.forEach(
      ({
        [platformApiTypes.PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES.PERMISSION]: permission,
        [platformApiTypes.PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES.RESOURCE_DEFS]: definitions = []
      }) => {
        const [app = '', resource, operation] = permission?.split(':') || [];

        if (!updatedSession.permissions[app]) {
          updatedSession.permissions[app] = {
            authorized: false,
            permissions: []
          };
        }

        if (resource === '*' && operation === '*') {
          updatedSession.permissions[app].authorized = true;
        }

        updatedSession.permissions[app].permissions.push({ definitions, operation, resource });
      }
    );

    updatedSession.admin = admin;
    updatedSession.entitled = entitled;
  }

  return { session: updatedSession };
});

/**
 * Expose selector instance. For scenarios where a selector is reused across component instances.
 *
 * @param {object} defaultProps
 * @returns {{session: {entitled: boolean, permissions: Array, authorized: boolean, admin: boolean}}}
 */
const makeSelector = defaultProps => (state, props) => ({
  ...selector(state, props, defaultProps)
});

const userSessionSelectors = {
  userSession: selector,
  makeUserSession: makeSelector
};

export { userSessionSelectors as default, userSessionSelectors, selector, makeSelector };
