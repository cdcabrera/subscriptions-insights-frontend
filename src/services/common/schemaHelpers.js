import _camelCase from 'lodash/camelCase';
import _isPlainObject from 'lodash/isPlainObject';
import _snakeCase from 'lodash/snakeCase';
import { helpers } from '../../common/helpers';

/**
 * Return objects with the keys camelCased. Normally applied to an array of objects.
 *
 * @param {object|Array|*} obj
 * @returns {object|Array|*}
 */
const camelCase = obj => {
  if (Array.isArray(obj)) {
    return obj.map(camelCase);
  }

  if (_isPlainObject(obj)) {
    const updatedObj = {};

    Object.entries(obj).forEach(([key, val]) => {
      updatedObj[_camelCase(key)] = camelCase(val);
    });

    return updatedObj;
  }

  return obj;
};

/**
 * A callback for schema validation, and after-the-fact casing adjustments.
 *
 * @param {object} options
 * @param {string} options.casing
 * @param {boolean} options.convert
 * @param {string} options.id
 * @param {object|Array} options.response
 * @param {*} options.schema
 * @returns {*|{}}
 */
const schemaResponse = ({ casing, convert = true, id = null, response, schema } = {}) => {
  const { value, error = { details: [] } } = schema?.validate(response, { convert }) || {};

  if (error.details.length && !helpers.TEST_MODE) {
    console.error(
      new Error(
        `Passing original API response. Schema validation failed for ${id || '...'}: ${error.details
          .map(({ context = {}, message, type }) => `${message}:${type}, ${JSON.stringify(context)}`)
          .join(', ')}`
      )
    );
  }

  switch (casing) {
    case 'camel':
      return camelCase(value);
    default:
      return value;
  }
};

/**
 * Turn an array into a consistent key/value pair.
 *
 * @param {Array} arr
 * @returns {{}}
 */
const schemaArrayToObject = arr => {
  const obj = {};
  arr.forEach(value => {
    const updatedKey = _snakeCase(value.toUpperCase()).toUpperCase();
    obj[updatedKey || 'NONE'] = value;
  });

  console.log('>>>>>>>>>>>>>>', obj);
  return obj;
};

/**
 * ToDo: Consistent spec... in order to scan through a spec we make allowance for multiple casing formats
 * It would be helpful if
 *  - the API spec was consistently cased everywhere
 *  - enum values were considered for display sequence
 *  - a consistent meaning behind "_ANY" and empty "" string values and any other "unique" value that arises
 */
/**
 * Return an object of enumerable spec types.
 *
 * @param {object} schema
 * @returns {{}}
 */
const schemaEnums = schema => {
  const updatedEnums = {};

  if (!_isPlainObject(schema)) {
    return updatedEnums;
  }

  Object.entries(schema).forEach(([key, { enum: enumList }]) => {
    if (!Array.isArray(enumList)) {
      return;
    }

    const updatedKey = _snakeCase(key).toUpperCase();
    updatedEnums[updatedKey] = schemaArrayToObject(enumList);
  });

  return updatedEnums;
};

const schemaHelpers = {
  camelCase,
  schemaArrayToObject,
  schemaEnums,
  schemaResponse
};

export { schemaHelpers as default, schemaHelpers, camelCase, schemaArrayToObject, schemaEnums, schemaResponse };
