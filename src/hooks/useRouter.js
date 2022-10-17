import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useRouteDetail } from '../components/router/routerContext';
import { routerHelpers } from '../components/router/routerHelpers';
import { reduxActions, storeHooks } from '../redux';

/**
 * Pass useHistory methods. Proxy useHistory push with Platform specific navigation update.
 *
 * @param {object} options
 * @param {boolean} options.isSetAppNav Allow setting the Platform's left navigation if conditions are met or fallback to history.push.
 * @param {Function} options.useNavigate
 * @param {Function} options.useDispatch
 * @returns {object}
 */
const useHistory = ({
  isSetAppNav = false,
  useNavigate: useAliasNavigate = useNavigate,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch
} = {}) => {
  const navigate = useAliasNavigate();
  const dispatch = useAliasDispatch();

  return {
    push: (pathLocation, historyState) => {
      const pathName = (typeof pathLocation === 'string' && pathLocation) || pathLocation?.pathname;
      const { productParameter, id, routeHref } = routerHelpers.getRouteConfig({ pathName, id: pathName });
      const { hash, search } = window.location;

      if (isSetAppNav && productParameter) {
        return dispatch(reduxActions.platform.setAppNav(id));
      }

      return navigate(routeHref || (pathName && `${pathName}${search}${hash}`) || pathLocation, historyState);
    }
  };
};

const routerHooks = {
  useHistory,
  useLocation,
  useParams,
  useRouteDetail
};

export { routerHooks as default, routerHooks, useHistory, useLocation, useParams, useRouteDetail };
