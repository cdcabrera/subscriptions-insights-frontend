/**
 * Global window related hooks.
 *
 * @memberof Hooks
 * @module UseApp
 */

/**
 * Old skool js to determine global app onload through emulated hook.
 *
 * @returns {Function}
 */
const useAppLoad =
  () =>
  (target = document.querySelector('.curiosity-graph-card')) =>
    target !== null;

const appHooks = {
  useAppLoad
};

export { appHooks as default, appHooks, useAppLoad };
