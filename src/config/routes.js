/*
import { config as rhelConfig } from './product.rhel';
import { config as openshiftContainerConfig } from './product.openshiftContainer';
import { config as openshiftMetricsConfig } from './product.openshiftMetrics';
import { config as openshiftDedicatedConfig } from './product.openshiftDedicated';
import { config as rhacsConfig } from './product.rhacs';
import { config as rhodsConfig } from './product.rhods';
import { config as rhosakConfig } from './product.rhosak';
import { config as satelliteProductConfig } from './product.satellite';
import { RHSM_API_PATH_PRODUCT_TYPES } from '../services/rhsm/rhsmConstants';
*/
// import { productConfigs } from './products';
import { helpers } from '../common';

/*
const generate = () => {
  const requireAll = r => r.keys().forEach(r);
  requireAll(require.context('./', true, /\.js$/));
};
*/
/*
const productConfigs = (() => {
  const path = require.context('./', false, /product[\d\D]+\.js$/i);
  // console.log('>>> testing', path);
  return path.keys().map(path);
})()?.map(value => value.config);
*/

// console.log('product configs >>> testing', productConfigs);

// console.log('>>>', );
// productConfigs().map((value, index) => value.config);
/*
productConfigs.map(({ productId }) => ({
  path: productId.toLowerCase(),
  redirect: null,
  activateOnError: false,
  disabled: helpers.UI_DISABLED,
  default: false,
  component: 'productView/productView'
}));
*/

const routes = [
  {
    id: 'any',
    path: ':productPath',
    // configs: productConfigs,
    redirect: null,
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productView'
  },
  {
    id: 'optin',
    path: 'optin',
    redirect: null,
    activateOnError: true,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'optinView/optinView'
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
];

/*
const routes = [
  {
    id: 'rhel',
    path: '/rhel',
    pathParameter: [RHSM_API_PATH_PRODUCT_TYPES.RHEL],
    productParameter: [rhelConfig.productGroup],
    productConfig: [{ ...rhelConfig, productId: RHSM_API_PATH_PRODUCT_TYPES.RHEL }],
    routeProductLabel: rhelConfig.productGroup,
    redirect: null,
    isSearchable: true,
    aliases: ['insights'],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productView'
  },
  {
    id: 'openshift-container',
    path: '/openshift-container',
    pathParameter: [openshiftContainerConfig.productId, openshiftMetricsConfig.productId],
    productParameter: [openshiftContainerConfig.productGroup, openshiftMetricsConfig.productGroup],
    productConfig: [openshiftContainerConfig, openshiftMetricsConfig],
    routeProductLabel: openshiftContainerConfig.productGroup,
    redirect: null,
    isSearchable: true,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productView'
  },
  {
    id: 'openshift-dedicated',
    path: '/openshift-dedicated',
    pathParameter: [openshiftDedicatedConfig.productId],
    productParameter: [openshiftDedicatedConfig.productGroup],
    productConfig: [openshiftDedicatedConfig],
    routeProductLabel: openshiftDedicatedConfig.productGroup,
    redirect: null,
    isSearchable: true,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productView'
  },
  {
    id: 'rhacs',
    path: '/rhacs',
    pathParameter: [rhacsConfig.productId],
    productParameter: [rhacsConfig.productGroup],
    productConfig: [rhacsConfig],
    routeProductLabel: rhacsConfig.productGroup,
    redirect: null,
    isSearchable: true,
    aliases: ['rhacs'],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productView'
  },
  {
    id: 'rhods',
    path: '/rhods',
    pathParameter: [rhodsConfig.productId],
    productParameter: [rhodsConfig.productGroup],
    productConfig: [rhodsConfig],
    routeProductLabel: rhodsConfig.productGroup,
    redirect: null,
    isSearchable: true,
    aliases: ['rhods'],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productView'
  },
  {
    id: 'rhosak',
    path: '/streams',
    pathParameter: [rhosakConfig.productId],
    productParameter: [rhosakConfig.productGroup],
    productConfig: [rhosakConfig],
    routeProductLabel: rhosakConfig.productGroup,
    redirect: null,
    isSearchable: true,
    aliases: ['application-services', 'streams', 'rhosak'],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productView'
  },
  {
    id: 'satellite',
    path: '/satellite',
    pathParameter: [RHSM_API_PATH_PRODUCT_TYPES.SATELLITE],
    productParameter: [satelliteProductConfig.productGroup],
    productConfig: [{ ...satelliteProductConfig, productId: RHSM_API_PATH_PRODUCT_TYPES.SATELLITE }],
    routeProductLabel: satelliteProductConfig.productGroup,
    redirect: null,
    isSearchable: true,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productView'
  },
  {
    id: 'optin',
    path: '/optin',
    pathParameter: null,
    productParameter: null,
    productConfig: null,
    routeProductLabel: null,
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: true,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'optinView/optinView'
  },
  {
    id: 'missing',
    path: '/',
    pathParameter: null,
    productParameter: null,
    productConfig: null,
    routeProductLabel: null,
    redirect: '/',
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: true,
    component: 'productView/productViewMissing'
  }
];
*/

export { routes as default, routes };
