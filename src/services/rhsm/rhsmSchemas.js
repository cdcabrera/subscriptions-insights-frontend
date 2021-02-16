import JoiBase from 'joi';
import JoiDate from '@joi/date';
import { schemaResponse } from '../common/helpers';
import { rhsmConstants } from './rhsmConstants';

const Joi = JoiBase.extend(JoiDate);

const errorItems = Joi.object({
  code: Joi.string().default(null),
  detail: Joi.string().default(null)
}).unknown(true);

const errorSchema = Joi.object()
  .keys({
    errors: Joi.array().items(errorItems).default([])
  })
  .unknown(true);

const linksSchema = Joi.object();

const metaSchema = Joi.object()
  .keys({
    count: Joi.number().integer().default(0)
  })
  .unknown(true);

const capacityItems = Joi.object({
  cloud_cores: Joi.number().integer().optional().allow(null),
  cloud_instance_count: Joi.number().integer().optional().allow(null),
  cloud_sockets: Joi.number().integer().optional().allow(null),
  cores: Joi.number().integer().optional().allow(null),
  date: Joi.date().format('YYYY-MM-DDTHH:mm:SSZ').required(),
  hypervisor_cores: Joi.number().integer().optional().allow(null),
  hypervisor_sockets: Joi.number().integer().optional().allow(null),
  physical_cores: Joi.number().integer().optional().allow(null),
  physical_sockets: Joi.number().integer().optional().allow(null),
  sockets: Joi.number().integer().optional().allow(null),
  has_infinite_quantity: Joi.boolean().optional().allow(null)
}).unknown(true);

const capacitySchema = Joi.object().keys({
  data: Joi.array().items(capacityItems).default([]),
  links: linksSchema,
  meta: metaSchema
});

const hypervisorGuestReportItems = Joi.object({
  insights_id: Joi.string().default(null),
  display_name: Joi.string().default(null),
  subscription_manager_id: Joi.string().default(null),
  last_seen: Joi.date().format('YYYY-MM-DDTHH:mm:SSZ').default(null)
}).unknown(true);

const hypervisorGuestReportSchema = Joi.object().keys({
  data: Joi.array().items(hypervisorGuestReportItems).default([]),
  links: linksSchema,
  meta: metaSchema
});

const hostReportItems = Joi.object({
  cloud_provider: Joi.string().lowercase().default(null),
  cores: Joi.number().integer().allow(null).default(null),
  number_of_guests: Joi.number().integer().allow(null).default(null),
  hardware_type: Joi.string().lowercase().default(null),
  insights_id: Joi.string().default(null),
  inventory_id: Joi.string().default(null),
  last_seen: Joi.date().format('YYYY-MM-DDTHH:mm:SSZ').default(null),
  measurement_type: Joi.string().lowercase().default(null),
  display_name: Joi.string().default(null),
  sockets: Joi.number().integer().allow(null).default(null),
  subscription_manager_id: Joi.string().default(null)
}).unknown(true);

const hostReportSchema = Joi.object().keys({
  data: Joi.array().items(hostReportItems).default([]),
  links: linksSchema,
  meta: metaSchema
});

const subscriptionsReportItems = Joi.object({
  physical_capacity: Joi.number().integer().allow(null).default(null),
  product_name: Joi.string().default(null),
  service_level: Joi.string()
    .valid(...Object.values(rhsmConstants.RHSM_API_RESPONSE_SLA_TYPES))
    .lowercase()
    .default(null),
  sku: Joi.string().default(null),
  subscription_numbers: Joi.array().default([]),
  total_capacity: Joi.number().integer().allow(null).default(null),
  uom: Joi.string()
    .valid(...Object.values(rhsmConstants.RHSM_API_RESPONSE_UOM_TYPES))
    .lowercase()
    .default(null),
  upcoming_event_date: Joi.date().format('YYYY-MM-DDTHH:mm:SSZ').default(null),
  upcoming_event_type: Joi.string().default(null),
  usage: Joi.string()
    .valid(...Object.values(rhsmConstants.RHSM_API_RESPONSE_USAGE_TYPES))
    .lowercase()
    .default(null),
  virtual_capacity: Joi.number().integer().allow(null).default(null)
}).unknown(true);

const subscriptionsReportSchema = Joi.object().keys({
  data: Joi.array().items(subscriptionsReportItems).default([]),
  links: linksSchema,
  meta: metaSchema
});

const tallyItems = Joi.object({
  cloud_cores: Joi.number().integer().optional().allow(null),
  cloud_instance_count: Joi.number().integer().optional().allow(null),
  cloud_sockets: Joi.number().integer().optional().allow(null),
  cores: Joi.number().integer().optional().allow(null),
  date: Joi.date().format('YYYY-MM-DDTHH:mm:SSZ').required(),
  hypervisor_cores: Joi.number().integer().optional().allow(null),
  hypervisor_sockets: Joi.number().integer().optional().allow(null),
  physical_cores: Joi.number().integer().optional().allow(null),
  physical_sockets: Joi.number().integer().optional().allow(null),
  sockets: Joi.number().integer().optional().allow(null),
  has_cloudigrade_data: Joi.boolean().optional().allow(null),
  has_cloudigrade_mismatch: Joi.boolean().optional().allow(null),
  has_data: Joi.boolean().optional().allow(null)
}).unknown(true);

const tallySchema = Joi.object().keys({
  data: Joi.array().items(tallyItems).default([]),
  links: linksSchema,
  meta: metaSchema
});

const rhsmSchemas = {
  capacity: response => schemaResponse({ response, schema: capacitySchema, id: 'RHSM capacity' }),
  errors: response => schemaResponse({ response, schema: errorSchema, id: 'RHSM errors' }),
  hypervisorGuestReport: response =>
    schemaResponse({ response, schema: hypervisorGuestReportSchema, id: 'RHSM hypervisorGuestReport' }),
  hostReport: response => schemaResponse({ response, schema: hostReportSchema, id: 'RHSM hostReport' }),
  subscriptions: response =>
    schemaResponse({ response, schema: subscriptionsReportSchema, id: 'RHSM subscriptionsReport' }),
  tally: response => schemaResponse({ response, schema: tallySchema, id: 'RHSM tally' })
};

export { rhsmSchemas as default, rhsmSchemas };
