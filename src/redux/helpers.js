import _camelCase from 'lodash/camelCase';
import _snakeCase from 'lodash/snakeCase';
import { helpers } from '../common';

/**
 * @memberof Helpers
 * @module ReduxHelpers
 */

/**
 * Set an API query based on specific API "acceptable values" schema.
 *
 * @param {object} values
 * @param {object} schema
 * @param {*} [initialValue]
 * @returns {object}
 */
const setApiQuery = (values, schema, initialValue) => {
  const generated = {};
  const schemaArr = (schema && Object.values(schema)) || [];

  schemaArr.forEach(value => {
    if (initialValue === undefined) {
      if (value in values) {
        generated[value] = values?.[value];
      }
    } else {
      generated[value] = values?.[value] || initialValue;
    }
  });

  return generated;
};

// ToDo: research applying a maintained schema map/normalizer such as, normalizr
/**
 * Apply a set of schemas using either an array of objects in the
 * form of [{ madeUpKey: 'some_api_key' }], or an array of arrays
 * in the form of [['some_api_key','another_api_key']]
 *
 * @param {Array} schemas
 * @param {*} [initialValue]
 * @returns {Array}
 */
const setResponseSchemas = (schemas = [], initialValue) =>
  schemas.map(schema => {
    const generated = {};
    const arr = (Array.isArray(schema) && schema) || Object.values(schema);

    arr.forEach(value => {
      generated[value] = initialValue;
    });

    return generated;
  });

/**
 * Normalize an API response.
 *
 * @param {*} responses
 * @param {object} responses.response
 * @param {object} responses.response.schema
 * @param {Array|object} responses.response.data
 * @param {string} responses.response.keyCase
 * @param {Function} responses.response.customResponseEntry
 * @param {Function} responses.response.customResponseValue
 * @param {string} responses.response.keyPrefix
 * @returns {Array}
 */
const setNormalizedResponse = (...responses) => {
  const parsedResponses = [];

  responses.forEach(
    ({ schema = {}, data, customResponseEntry, customResponseValue, keyPrefix: prefix, keyCase = 'camel' }) => {
      const isArray = Array.isArray(data);
      const updatedData = (isArray && data) || (data && [data]) || [];
      const [generatedSchema = {}] = setResponseSchemas([schema]);
      const parsedResponse = [];

      updatedData.forEach((value, index) => {
        const generateReflectedData = ({
          dataObj,
          keyPrefix = '',
          keyCaseType,
          customEntry,
          customValue = null,
          update = helpers.noop
        }) => {
          let updatedDataObj = {};

          Object.entries(dataObj).forEach(([dataObjKey, dataObjValue]) => {
            let casedDataObjKey;

            switch (keyCaseType) {
              case 'camel':
                casedDataObjKey = _camelCase(`${keyPrefix} ${dataObjKey}`).trim();
                break;
              case 'snake':
                casedDataObjKey = _snakeCase(`${keyPrefix} ${dataObjKey}`).trim();
                break;
              case 'default':
              default:
                casedDataObjKey = `${dataObjKey}`.trim();
                break;
            }

            let val = dataObjValue;

            if (typeof val === 'number') {
              val = (Number.isInteger(val) && Number.parseInt(val, 10)) || Number.parseFloat(val) || val;
            }

            if (typeof customValue === 'function') {
              updatedDataObj[casedDataObjKey] = customValue({ data: dataObj, key: dataObjKey, value: val, index });
            } else {
              updatedDataObj[casedDataObjKey] = val;
            }
          });

          if (typeof customEntry === 'function') {
            updatedDataObj = customEntry(updatedDataObj, index);
          }

          update(updatedDataObj);
        };

        generateReflectedData({
          keyPrefix: prefix,
          dataObj: { ...generatedSchema, ...value },
          keyCaseType: keyCase,
          customEntry: customResponseEntry,
          customValue: customResponseValue,
          update: generatedData => parsedResponse.push(generatedData)
        });
      });

      parsedResponses.push(parsedResponse);
    }
  );

  return parsedResponses;
};

const reduxHelpers = {
  setApiQuery,
  setResponseSchemas,
  setNormalizedResponse
};

export { reduxHelpers as default, reduxHelpers };
