import { config as rhelConfig } from './product.rhel';
import { config as openshiftContainerConfig } from './product.openshiftContainer';
import { config as openshiftMetricsConfig } from './product.openshiftMetrics';
import { config as openshiftDedicatedConfig } from './product.openshiftDedicated'; // eslint-disable-line
import { config as satelliteProductConfig } from './product.satellite';
import { RHSM_API_PATH_ID_TYPES } from '../types/rhsmApiTypes';
import { helpers } from '../common';

const routes = [
  {
    id: 'rhel',
    path: '/rhel',
    productIds: [RHSM_API_PATH_ID_TYPES.RHEL],
    productParentIds: [RHSM_API_PATH_ID_TYPES.RHEL],
    productConfig: [rhelConfig],
    redirect: null,
    isSearchable: true,
    aliases: ['insights'],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productViewDefault'
  },
  {
    id: 'rhel-arm',
    path: '/rhel-arm',
    productIds: [RHSM_API_PATH_ID_TYPES.RHEL_ARM],
    productParentIds: [RHSM_API_PATH_ID_TYPES.RHEL],
    productConfig: [rhelConfig],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productViewDefault'
  },
  {
    id: 'rhel-ibmpower',
    path: '/rhel-ibmpower',
    productIds: [RHSM_API_PATH_ID_TYPES.RHEL_IBM_POWER],
    productParentIds: [RHSM_API_PATH_ID_TYPES.RHEL],
    productConfig: [rhelConfig],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productViewDefault'
  },
  {
    id: 'rhel-ibmz',
    path: '/rhel-ibmz',
    productIds: [RHSM_API_PATH_ID_TYPES.RHEL_IBM_Z],
    productParentIds: [RHSM_API_PATH_ID_TYPES.RHEL],
    productConfig: [rhelConfig],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productViewDefault'
  },
  {
    id: 'rhel-x86',
    path: '/rhel-x86',
    productIds: [RHSM_API_PATH_ID_TYPES.RHEL_X86],
    productParentIds: [RHSM_API_PATH_ID_TYPES.RHEL],
    productConfig: [rhelConfig],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productViewDefault'
  },
  {
    id: 'openshift-container',
    path: '/openshift-container',
    productIds: [RHSM_API_PATH_ID_TYPES.OPENSHIFT, RHSM_API_PATH_ID_TYPES.OPENSHIFT_METRICS],
    productParentIds: [RHSM_API_PATH_ID_TYPES.OPENSHIFT, RHSM_API_PATH_ID_TYPES.OPENSHIFT_METRICS],
    productConfig: [openshiftContainerConfig, openshiftMetricsConfig],
    redirect: null,
    isSearchable: true,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productViewOpenShiftContainer'
  },
  {
    id: 'openshift-dedicated',
    path: '/openshift-dedicated',
    productIds: [RHSM_API_PATH_ID_TYPES.OPENSHIFT_DEDICATED_METRICS],
    productParentIds: [RHSM_API_PATH_ID_TYPES.OPENSHIFT_DEDICATED_METRICS],
    productConfig: [openshiftDedicatedConfig],
    redirect: null,
    isSearchable: true,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productViewOpenShiftDedicated'
  },
  {
    id: 'satellite',
    path: '/satellite',
    productIds: [RHSM_API_PATH_ID_TYPES.SATELLITE],
    productParentIds: [RHSM_API_PATH_ID_TYPES.SATELLITE],
    productConfig: [satelliteProductConfig],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productViewDefault'
  },
  {
    id: 'satellite-capsule',
    path: '/satellite-capsule',
    productIds: [RHSM_API_PATH_ID_TYPES.SATELLITE_CAPSULE],
    productParentIds: [RHSM_API_PATH_ID_TYPES.SATELLITE],
    productConfig: [satelliteProductConfig],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productViewDefault'
  },
  {
    id: 'satellite-server',
    path: '/satellite-server',
    productIds: [RHSM_API_PATH_ID_TYPES.SATELLITE_SERVER],
    productParentIds: [RHSM_API_PATH_ID_TYPES.SATELLITE],
    productConfig: [satelliteProductConfig],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productViewDefault'
  },
  {
    id: 'optin',
    path: '/optin',
    productIds: null,
    productParentIds: null,
    productConfig: null,
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
    productIds: null,
    productParentIds: null,
    productConfig: null,
    redirect: '/',
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: true,
    component: 'productView/productViewMissing'
  }
];

export { routes as default, routes };
