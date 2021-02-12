import _camelCase from 'lodash/camelCase';
import _isPlainObject from 'lodash/isPlainObject';

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

const schemaResponse = ({ convert = true, id = null, response, schema }) => {
  const { value, error = { details: [] } } = schema.validate(response, { convert });

  if (error.details.length) {
    throw new Error(
      `Schema validation for ${id || '...'}: ${error.details
        .map(({ message, type }) => `${message}:${type}`)
        .join(', ')}`
    );
  }

  return camelCase(value);
};

const serviceHelpers = {
  camelCase,
  schemaResponse
};

export { serviceHelpers as default, camelCase, schemaResponse };
