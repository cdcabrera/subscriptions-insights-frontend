import JoiBase from 'joi';
import JoiDate from '@joi/date';
import { schemaResponse } from '../common/helpers';

const Joi = JoiBase.extend(JoiDate);

const authObj = {
  user: {
    identity: {
      user: {
        is_org_admin: false
      }
    },
    entitlements: {
      [APP_TYPES.SUBSCRIPTIONS]: {
        is_entitled: false
      }
    }
  },
  permissions: [
    {
      permission: '',
      resourceDefinitions: ''
    }
  ]
};

/**
 * User response item.
 *
 * @type {*} Joi schema
 */
const userItem = Joi.object({
  identity: Joi.object({
    user: Joi.object({
      is_org_admin: Joi.boolean().default(false)
    })
  }),
  entitlements: Joi.object({
    [APP_TYPES.SUBSCRIPTIONS]: Joi.object({
      is_entitled: Joi.boolean().default(false)
    })
  })
})
  .unknown(true)
  .default();

/**
 * Permissions response item.
 *
 * @type {*} Joi schema
 */
const permissionsItem = Joi.object({
  permission: Joi.string().optional().allow(null),
  resourceDefinitions: Joi.string().optional().allow(null)
})
  .unknown(true)
  .default();

/**
 * Authorize response.
 *
 * @type {*} Joi schema
 */
const authorizeResponseSchema = Joi.object().keys({
  data: Joi.array().items(tallyItem).default([])
});

const rhsmSchemas = {
  authorize: response => schemaResponse({ response, schema: authorizeResponseSchema, id: 'User authorization' })
};

export { rhsmSchemas as default, rhsmSchemas };
