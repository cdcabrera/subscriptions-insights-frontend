import { helpers } from '../../common/helpers';
import RhelView from '../rhelView/rhelView';

/**
 * Return an assumed dynamic route baseName directory
 * based on a predictable directory depth.
 *
 * @type {string}
 */
const baseName = (() => {
  const pathPrefix = helpers.UI_DEPLOY_PATH_PREFIX;
  const pathName = window.location.pathname.split('/');

  pathName.shift();

  const pathSlice = pathPrefix && new RegExp(pathName[0]).test(pathPrefix) ? 2 : 1;

  return `/${pathName.slice(0, pathSlice).join('/')}`;
})();

/**
 * Return array of objects that describe navigation
 * @return {array}
 */
const routes = [
  {
    title: 'Red Hat Enterprise Linux',
    id: 'rhel',
    to: '/rhel',
    redirect: true,
    component: RhelView
  }
];

export { routes as default, baseName, routes };
