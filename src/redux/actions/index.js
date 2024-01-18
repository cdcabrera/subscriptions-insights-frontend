import { platformActions } from './platformActions';

const actions = {
  platform: platformActions
};

const reduxActions = { ...actions };

export { reduxActions as default, reduxActions, platformActions };
