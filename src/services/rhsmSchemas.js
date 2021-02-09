import JoiBase from 'joi';
import JoiDate from '@joi/date';
import { schemaResponse } from './helpers';

const Joi = JoiBase.extend(JoiDate);

const metaSchema = Joi.object({
  count: Joi.number()
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

const rhsmSchemas = {
  capacity: response => schemaResponse(response, capacitySchema, 'RHSM capacity'),
  tally: response => schemaResponse(response, tallySchema, 'RHSM tally')
};

export { rhsmSchemas as default, rhsmSchemas };
