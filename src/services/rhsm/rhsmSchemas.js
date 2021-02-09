import JoiBase from 'joi';
import JoiDate from '@joi/date';
import { schemaResponse } from '../common/helpers';
import { rhsmConstants } from './rhsmConstants';

const Joi = JoiBase.extend(JoiDate);

const metaSchema = Joi.object({
  count: Joi.number()
});

const capacityItems = Joi.object().keys({
  cloud_cores: Joi.number().integer().default(0),
  cloud_instance_count: Joi.number().integer().default(0),
  cloud_sockets: Joi.number().integer().default(0),
  cores: Joi.number().integer().default(0),
  date: Joi.date().format('YYYY-MM-DDTHH:mm:SSZ').required(),
  hypervisor_cores: Joi.number().integer().default(0),
  hypervisor_sockets: Joi.number().integer().default(0),
  physical_cores: Joi.number().integer().default(0),
  physical_sockets: Joi.number().integer().default(0),
  sockets: Joi.number().integer().default(0),
  has_infinite_quantity: Joi.boolean()
});

const capacitySchema = Joi.object({
  data: Joi.array().items(capacityItems).default([]),
  meta: metaSchema
});

const hypervisorGuestReportItems = Joi.object({
  insights_id: Joi.string().default(null),
  display_name: Joi.string().default(null),
  subscription_manager_id: Joi.string().default(null),
  last_seen: Joi.date().format('YYYY-MM-DDTHH:mm:SSZ').default(null)
});

const hypervisorGuestReportSchema = Joi.object({
  data: Joi.array().items(hypervisorGuestReportItems).default([]),
  meta: metaSchema
});

const hostReportItems = Joi.object({
  cloud_provider: Joi.string().lowercase().default(null),
  cores: Joi.number().integer().default(null),
  number_of_guests: Joi.number().integer().default(null),
  hardware_type: Joi.string().lowercase().default(null),
  insights_id: Joi.string().default(null),
  inventory_id: Joi.string().default(null),
  last_seen: Joi.date().format('YYYY-MM-DDTHH:mm:SSZ').default(null),
  measurement_type: Joi.string().lowercase().default(null),
  display_name: Joi.string().default(null),
  sockets: Joi.number().integer().default(null),
  subscription_manager_id: Joi.string().default(null)
});

const hostReportSchema = Joi.object({
  data: Joi.array().items(hostReportItems).default([]),
  meta: metaSchema
});

const subscriptionsReportItems = Joi.object({
  physical_capacity: Joi.number().integer().default(null),
  product_name: Joi.string().default(null),
  service_level: Joi.string()
    .valid(...Object.values(rhsmConstants.RHSM_API_RESPONSE_SLA_TYPES))
    .lowercase()
    .default(null),
  sku: Joi.string().default(null),
  subscription_numbers: Joi.array().default([]),
  total_capacity: Joi.number().integer().default(null),
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
  virtual_capacity: Joi.number().integer().default(null)
});

const subscriptionsReportSchema = Joi.object({
  data: Joi.array().items(subscriptionsReportItems).default([]),
  meta: metaSchema
});

const tallyItems = Joi.object().keys({
  cloud_cores: Joi.number().integer().default(0),
  cloud_instance_count: Joi.number().integer().default(0),
  cloud_sockets: Joi.number().integer().default(0),
  cores: Joi.number().integer().default(0),
  date: Joi.date().format('YYYY-MM-DDTHH:mm:SSZ').required(),
  hypervisor_cores: Joi.number().integer().default(0),
  hypervisor_sockets: Joi.number().integer().default(0),
  physical_cores: Joi.number().integer().default(0),
  physical_sockets: Joi.number().integer().default(0),
  sockets: Joi.number().integer().default(0),
  has_cloudigrade_data: Joi.boolean(),
  has_cloudigrade_mismatch: Joi.boolean(),
  has_data: Joi.boolean()
});

const tallySchema = Joi.object({
  data: Joi.array().items(tallyItems).default([]),
  meta: metaSchema
});

const rhsmSchemas = {
  capacity: response => schemaResponse({ response, schema: capacitySchema, id: 'RHSM capacity' }),
  hypervisorGuestReport: response =>
    schemaResponse({ response, schema: hypervisorGuestReportSchema, id: 'RHSM hypervisorGuestReport' }),
  hostReport: response => schemaResponse({ response, schema: hostReportSchema, id: 'RHSM hostReport' }),
  subscriptions: response =>
    schemaResponse({ response, schema: subscriptionsReportSchema, id: 'RHSM subscriptionsReport' }),
  tally: response => schemaResponse({ response, schema: tallySchema, id: 'RHSM tally' })
};

export { rhsmSchemas as default, rhsmSchemas };
