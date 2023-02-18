import { reactReduxHooks } from './useReactRedux';

/**
 * @memberof Redux State
 * @module Hooks
 * @property {module} UseReactRedux
 */

/**
 * Store hooks
 *
 * @type {{reactReduxHooks: {shallowEqual: Function, useDispatch: Function, useSelector: Function, useSelectors: Function,
 *     useSelectorsResponse: Function, useSelectorsAllSettledResponse: Function, useSelectorsAnyResponse: Function,
 *     useSelectorsRaceResponse: Function}}}
 */
const storeHooks = {
  reactRedux: reactReduxHooks
};

export { storeHooks as default, storeHooks, reactReduxHooks };
