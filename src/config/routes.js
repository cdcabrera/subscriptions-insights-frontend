import { helpers } from '../common';

const routes = [];

if (helpers.DEV_MODE || helpers.REVIEW_MODE) {
  routes.push({
    id: 'modules',
    path: 'modules',
    redirect: null,
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productViewModules'
  });
}

routes.push(
  {
    id: 'any',
    path: ':productPath',
    redirect: null,
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productView'
  },
  {
    id: 'missing',
    path: '*',
    redirect: './',
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: true,
    component: 'productView/productViewMissing'
  }
);

export { routes as default, routes };
