import { platformActions } from './platformActions';
import { userActions } from './userActions';

const actions = {
  platform: platformActions,
  user: userActions
};

const reduxActions = { ...actions };

export { reduxActions as default, reduxActions, platformActions, userActions };
