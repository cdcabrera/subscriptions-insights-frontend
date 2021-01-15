/**
 * Confirm a string has minimum length.
 *
 * @param {string} value
 * @param {number} characters
 * @returns {boolean}
 */
const doesntHaveMinimumCharacters = (value, characters = 1) =>
  (typeof value === 'string' && value.length < characters) || typeof value !== 'string';

const formHelpers = {
  doesntHaveMinimumCharacters
};

export { formHelpers as default, formHelpers, doesntHaveMinimumCharacters };
