/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useHistory as useHistoryRRD, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { routerHelpers } from '../components/router/routerHelpers';
import { reduxActions, useDispatch } from '../redux';
import { helpers } from '../common/helpers';
import platformServices from '../services/platformServices';

/**
 * Pass useHistory methods. Proxy useHistory push with Platform specific navigation update.
 *
 * @returns {object<history>}
 */
const useHistory = () => {
  const history = useHistoryRRD();
  // const dispatch = useDispatch();
  // const [updatedDispatch] = useState(dispatch);

  return {
    ...history,
    push: (pathLocation, historyState) => {
      const pathName = (typeof pathLocation === 'string' && pathLocation) || pathLocation?.pathname;
      const { productParameter, id, routeHref } = routerHelpers.getRouteConfig({ pathName, id: pathName });
      const { hash, search } = window.location;

      if (!helpers.DEV_MODE && productParameter) {
        // return updatedDispatch(reduxActions.platform.setAppNav(id));
        return platformServices.setAppNav(id);
      }

      return history.push(routeHref || (pathName && `${pathName}${search}${hash}`) || pathLocation, historyState);
    }
  };
};

const routerHooks = {
  useHistory,
  useLocation,
  useParams,
  useRouteMatch
};

export { routerHooks as default, routerHooks, useHistory, useLocation, useParams, useRouteMatch };
