import _camelCase from 'lodash/camelCase';

const schemaResponse = ({ convert = true, id = null, response, schema }) => {
  const { value, error = { details: [] } } = schema.validate(response, { convert });

  if (error.details.length) {
    throw new Error(
      `Schema validation for ${id || '...'}: ${error.details
        .map(({ message, type }) => `${message}:${type}`)
        .join(', ')}`
    );
  }

  const updatedValue = {};
  Object.keys(value).forEach(key => {
    updatedValue[_camelCase(key).trim()] = value[key];
  });

  return updatedValue;
};

const serviceHelpers = {
  schemaResponse
};

export { serviceHelpers as default, schemaResponse };
