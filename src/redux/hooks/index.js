import { reactReduxHooks } from './useReactRedux';
import { dynamicReactReduxHooks } from './useDynamicRedux';

const storeHooks = {
  reactRedux: {
    ...reactReduxHooks,
    ...dynamicReactReduxHooks
  }
};

export { storeHooks as default, storeHooks, reactReduxHooks, dynamicReactReduxHooks };
