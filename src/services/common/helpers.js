/**
 * A timeout cancel for function calls.
 *
 * @param {Function} func Callback to be executed or cancelled
 * @param {object} options
 * @param {number} options.timeout Function timeout in milliseconds
 * @param {string} options.errorMessage What the error message will read
 * @returns {Promise<*>}
 */
const timeoutFunctionCancel = (func, { timeout = 3000, errorMessage = 'function timeout' } = {}) => {
  let clearTimer;

  const timer = () =>
    new Promise((_, reject) => {
      clearTimer = window.setTimeout(reject, timeout, new Error(errorMessage));
    });

  const updatedFunc = async () => {
    const response = await func();
    window.clearTimeout(clearTimer);
    return response;
  };

  const execFunction = () =>
    Promise.race([timer(), updatedFunc()]).finally(() => {
      window.clearTimeout(clearTimer);
    });

  return execFunction();
};

/**
 * Apply data to a callback, pass original data on error.
 *
 * @param {Function} callback
 * @param {Array} data
 * @returns {{data: *, error}}
 */
const passDataToCallback = (callback, ...data) => {
  let error;
  let updatedData = data;

  try {
    updatedData = callback(...data);
  } catch (e) {
    error = e;
  }

  return { data: updatedData, error };
};

const serviceHelpers = {
  passDataToCallback,
  timeoutFunctionCancel
};

export { serviceHelpers as default, serviceHelpers, passDataToCallback, timeoutFunctionCancel };
