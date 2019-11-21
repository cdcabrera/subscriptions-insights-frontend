import { userTypes } from '../types';
import userService from '../../services/userServices';

const authorizeUser = () => dispatch =>
  dispatch({
    type: userTypes.USER_AUTH,
    payload: userService.authorizeUser()
  });

const getApiVersion = () => dispatch =>
  dispatch({
    type: userTypes.GET_API_VERSION,
    payload: userService.getApiVersion()
  });

const getLocale = () => ({
  type: userTypes.USER_LOCALE,
  payload: userService.getLocale()
});

export { authorizeUser, getApiVersion, getLocale };
