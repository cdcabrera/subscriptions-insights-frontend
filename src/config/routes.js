import React from 'react';
import { helpers } from '../common';

const routes = [
  {
    id: 'rhel',
    path: '/rhel',
    pathParameter: ['RHEL'],
    productParameter: ['RHEL'],
    redirect: null,
    isSearchable: true,
    aliases: ['insights'],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: React.lazy(() => import('../components/productView/productViewRhel'))
  },
  {
    id: 'rhel-arm',
    path: '/rhel-arm',
    pathParameter: ['RHEL for ARM'],
    productParameter: ['RHEL'],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: React.lazy(() => import('../components/productView/productViewRhel'))
  },
  {
    id: 'rhel-ibmpower',
    path: '/rhel-ibmpower',
    pathParameter: ['RHEL for IBM Power'],
    productParameter: ['RHEL'],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: React.lazy(() => import('../components/productView/productViewRhel'))
  },
  {
    id: 'rhel-ibmz',
    path: '/rhel-ibmz',
    pathParameter: ['RHEL for IBM z'],
    productParameter: ['RHEL'],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: React.lazy(() => import('../components/productView/productViewRhel'))
  },
  {
    id: 'rhel-x86',
    path: '/rhel-x86',
    pathParameter: ['RHEL for x86'],
    productParameter: ['RHEL'],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: React.lazy(() => import('../components/productView/productViewRhel'))
  },
  {
    id: 'openshift-container',
    path: '/openshift-container',
    pathParameter: ['OpenShift Container Platform', 'OpenShift-metrics'],
    productParameter: ['OpenShift Container Platform', 'OpenShift-metrics'],
    redirect: null,
    isSearchable: true,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: React.lazy(() => import('../components/productView/productViewOpenShiftContainer'))
  },
  {
    id: 'openshift-dedicated',
    path: '/openshift-dedicated',
    pathParameter: ['OpenShift-dedicated-metrics'],
    productParameter: ['OpenShift-dedicated-metrics'],
    redirect: null,
    isSearchable: true,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: React.lazy(() => import('../components/productView/productViewOpenShiftDedicated'))
  },
  {
    id: 'satellite',
    path: '/satellite',
    pathParameter: ['Satellite'],
    productParameter: ['Satellite'],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: React.lazy(() => import('../components/productView/productViewSatellite'))
  },
  {
    id: 'satellite-capsule',
    path: '/satellite-capsule',
    pathParameter: ['Satellite Capsule'],
    productParameter: ['Satellite'],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: React.lazy(() => import('../components/productView/productViewSatellite'))
  },
  {
    id: 'satellite-server',
    path: '/satellite-server',
    pathParameter: ['Satellite Server'],
    productParameter: ['Satellite'],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: React.lazy(() => import('../components/productView/productViewSatellite'))
  },
  {
    id: 'optin',
    path: '/optin',
    pathParameter: null,
    productParameter: null,
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: true,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: React.lazy(() => import('../components/optinView/optinView'))
  },
  {
    id: 'missing',
    path: '/',
    pathParameter: null,
    productParameter: null,
    redirect: '/',
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: true,
    component: React.lazy(() => import('../components/productView/productViewMissing'))
  }
];

export { routes as default, routes };
