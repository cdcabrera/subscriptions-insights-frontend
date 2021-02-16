/**
 * ToDo: rename to RHSM_API_PRODUCT_ID_TYPES
 */
/**
 * RHSM product id type values.
 *
 * @type {{RHEL_ARM: string, SATELLITE: string, OPENSHIFT_DEDICATED: string, RHEL_WORKSTATION: string,
 *     RHEL_COMPUTE_NODE: string, RHEL_X86: string, OPENSHIFT: string, OPENSHIFT_CONTAINER_PLATFORM: string,
 *     SATELLITE_SERVER: string, RHEL_DESKTOP: string, RHEL: string, SATELLITE_CAPSULE: string,
 *     RHEL_SERVER: string, RHEL_IBM_Z: string, RHEL_IBM_POWER: string}}
 */
const RHSM_API_PATH_ID_TYPES = {
  RHEL: 'RHEL',
  RHEL_COMPUTE_NODE: 'RHEL Compute Node',
  RHEL_DESKTOP: 'RHEL Desktop',
  RHEL_SERVER: 'RHEL Server',
  RHEL_WORKSTATION: 'RHEL Workstation',
  RHEL_ARM: 'RHEL for ARM',
  RHEL_IBM_POWER: 'RHEL for IBM Power',
  RHEL_IBM_Z: 'RHEL for IBM z',
  RHEL_X86: 'RHEL for x86',
  OPENSHIFT: 'OpenShift Container Platform',
  OPENSHIFT_CONTAINER_PLATFORM: 'OpenShift Container Platform',
  OPENSHIFT_DEDICATED: 'OpenShift Dedicated',
  SATELLITE: 'Satellite',
  SATELLITE_CAPSULE: 'Satellite Capsule',
  SATELLITE_SERVER: 'Satellite Server'
};

/**
 * RHSM response Error DATA CODE types.
 *
 * @type {{GENERIC: string, OPTIN: string}}
 */
const RHSM_API_RESPONSE_ERROR_CODE_TYPES = {
  GENERIC: 'SUBSCRIPTIONS1003',
  OPTIN: 'SUBSCRIPTIONS1004'
};

/**
 * RHSM API response/query/search parameter SLA type values.
 *
 * @type {{PREMIUM: string, SELF: string, NONE: string, STANDARD: string}}
 */
const RHSM_API_RESPONSE_SLA_TYPES = {
  PREMIUM: 'premium',
  STANDARD: 'standard',
  SELF: 'self-support',
  NONE: ''
};

/**
 * RHSM API response/query/search parameter UOM type values.
 *
 * @type {{CORES: string, SOCKETS: string}}
 */
const RHSM_API_RESPONSE_UOM_TYPES = {
  CORES: 'cores',
  SOCKETS: 'sockets'
};

/**
 * RHSM API response/query/search parameter USAGE type values.
 *
 * @type {{UNSPECIFIED: string, DISASTER: string, DEVELOPMENT: string, PRODUCTION: string}}
 */
const RHSM_API_RESPONSE_USAGE_TYPES = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development/test',
  DISASTER: 'disaster recovery',
  UNSPECIFIED: ''
};

/**
 * RHSM API query/search parameter of GRANULARITY type values.
 * Schema/map of expected query/search parameter granularity types.
 *
 * @type {{WEEKLY: string, QUARTERLY: string, DAILY: string, MONTHLY: string}}
 */
const RHSM_API_QUERY_GRANULARITY_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly'
};

/**
 * RHSM API query/search parameter SORT type values for HOSTS.
 *
 * @type {{CORES: string, HARDWARE: string, SOCKETS: string, MEASUREMENT: string, LAST_SEEN: string, NAME: string}}
 */
const RHSM_API_QUERY_SORT_TYPES = {
  CORES: 'cores',
  HARDWARE: 'hardware_type',
  LAST_SEEN: 'last_seen',
  MEASUREMENT: 'measurement_type',
  NAME: 'display_name',
  SOCKETS: 'sockets'
};

/**
 * RHSM API query/search parameter SORT type values for SUBSCRIPTIONS.
 *
 * @type {{UOM: string, PHYSICAL_CAPACITY: string, USAGE: string, UPCOMING_EVENT_DATE: string,
 *     VIRTUAL_CAPACITY: string, TOTAL_CAPACITY: string, SKU: string, PRODUCT_NAME: string,
 *     SERVICE_LEVEL: string}}
 */
const RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES = {
  SKU: 'sku',
  PRODUCT_NAME: 'product_name',
  SERVICE_LEVEL: 'service_level',
  USAGE: 'usage',
  UPCOMING_EVENT_DATE: 'upcoming_event_date',
  PHYSICAL_CAPACITY: 'physical_capacity',
  VIRTUAL_CAPACITY: 'virtual_capacity',
  TOTAL_CAPACITY: 'total_capacity',
  UOM: 'uom'
};

/**
 * RHSM API query/search parameter SORT DIRECTION type values.
 *
 * @type {{ASCENDING: string, DESCENDING: string}}
 */
const RHSM_API_QUERY_SORT_DIRECTION_TYPES = {
  ASCENDING: 'asc',
  DESCENDING: 'desc'
};

/**
 * RHSM API response/query/search parameter SLA type values.
 */
const RHSM_API_QUERY_SLA_TYPES = RHSM_API_RESPONSE_SLA_TYPES;

/**
 * RHSM API response/query/search parameter UOM type values.
 */
const RHSM_API_QUERY_UOM_TYPES = RHSM_API_RESPONSE_UOM_TYPES;

/**
 * RHSM API response/query/search parameter USAGE type values.
 */
const RHSM_API_QUERY_USAGE_TYPES = RHSM_API_RESPONSE_USAGE_TYPES;

/**
 * RHSM API query/search parameter OPTIN type values.
 *
 * @type {{TALLY_SYNC: string, TALLY_REPORT: string, CONDUIT_SYNC: string}}
 */
const RHSM_API_QUERY_SET_OPTIN_TYPES = {
  CONDUIT_SYNC: 'enable_conduit_sync',
  TALLY_REPORT: 'enable_tally_reporting',
  TALLY_SYNC: 'enable_tally_sync'
};

// ToDo: rename to ...TALLY_CAPACITY_TYPES
/**
 * RHSM API query/search parameter CAPACITY type values.
 *
 * @type {{GRANULARITY: string, USAGE: string, END_DATE: string, SLA: string, START_DATE: string}}
 */
const RHSM_API_QUERY_SET_REPORT_CAPACITY_TYPES = {
  END_DATE: 'ending',
  GRANULARITY: 'granularity',
  SLA: 'sla',
  START_DATE: 'beginning',
  USAGE: 'usage'
};

// ToDo: rename to ...SET_HOST_REPORT_TYPES
/**
 * RHSM API query/search parameter INVENTORY type values.
 *
 * @type {{UOM: string, USAGE: string, DIRECTION: string, SORT: string, OFFSET: string,
 *     SLA: string, LIMIT: string}}
 */
const RHSM_API_QUERY_SET_INVENTORY_TYPES = {
  DIRECTION: 'dir',
  DISPLAY_NAME: 'display_name_contains',
  LIMIT: 'limit',
  OFFSET: 'offset',
  SLA: 'sla',
  SORT: 'sort',
  UOM: 'uom',
  USAGE: 'usage'
};

// ToDo: rename to ...SET_HYPERVISOR_GUEST_REPORT_TYPES
/**
 * RHSM API query/search parameter GUESTS INVENTORY type values.
 *
 * @type {{OFFSET: string, LIMIT: string}}
 */
const RHSM_API_QUERY_SET_INVENTORY_GUESTS_TYPES = {
  LIMIT: 'limit',
  OFFSET: 'offset'
};

// ToDo: rename to ...SET_SUBSCRIPTIONS_REPORT_TYPES
/**
 * RHSM API query/search parameter SUBSCRIPTIONS INVENTORY type values.
 */
const RHSM_API_QUERY_SET_INVENTORY_SUBSCRIPTIONS_TYPES = {
  ...RHSM_API_QUERY_SET_INVENTORY_TYPES
};

/**
 * RHSM API query/search parameter values.
 */
const RHSM_API_QUERY_TYPES = {
  ...RHSM_API_QUERY_SET_OPTIN_TYPES,
  ...RHSM_API_QUERY_SET_REPORT_CAPACITY_TYPES,
  ...RHSM_API_QUERY_SET_INVENTORY_TYPES,
  ...RHSM_API_QUERY_SET_INVENTORY_GUESTS_TYPES,
  ...RHSM_API_QUERY_SET_INVENTORY_SUBSCRIPTIONS_TYPES
};

const rhsmConstants = {
  RHSM_API_PATH_ID_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES,
  RHSM_API_QUERY_SORT_TYPES,
  RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES,
  RHSM_API_QUERY_SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_SLA_TYPES,
  RHSM_API_QUERY_UOM_TYPES,
  RHSM_API_QUERY_USAGE_TYPES,
  RHSM_API_QUERY_SET_OPTIN_TYPES,
  RHSM_API_QUERY_SET_REPORT_CAPACITY_TYPES,
  RHSM_API_QUERY_SET_INVENTORY_TYPES,
  RHSM_API_QUERY_SET_INVENTORY_GUESTS_TYPES,
  RHSM_API_QUERY_SET_INVENTORY_SUBSCRIPTIONS_TYPES,
  RHSM_API_QUERY_TYPES,
  RHSM_API_RESPONSE_ERROR_CODE_TYPES,
  RHSM_API_RESPONSE_SLA_TYPES,
  RHSM_API_RESPONSE_UOM_TYPES,
  RHSM_API_RESPONSE_USAGE_TYPES
  // RHSM_API_SLA_TYPES,
  // RHSM_API_UOM_TYPES,
  // RHSM_API_USAGE_TYPES,
  // SUBSCRIPTIONS_REPORT_SERVICE_LEVEL,
  // SUBSCRIPTIONS_REPORT_UOM,
  // SUBSCRIPTIONS_REPORT_USAGE
};

export {
  rhsmConstants as default,
  rhsmConstants,
  RHSM_API_PATH_ID_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES,
  RHSM_API_QUERY_SORT_TYPES,
  RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES,
  RHSM_API_QUERY_SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_SLA_TYPES,
  RHSM_API_QUERY_UOM_TYPES,
  RHSM_API_QUERY_USAGE_TYPES,
  RHSM_API_QUERY_SET_OPTIN_TYPES,
  RHSM_API_QUERY_SET_REPORT_CAPACITY_TYPES,
  RHSM_API_QUERY_SET_INVENTORY_TYPES,
  RHSM_API_QUERY_SET_INVENTORY_GUESTS_TYPES,
  RHSM_API_QUERY_SET_INVENTORY_SUBSCRIPTIONS_TYPES,
  RHSM_API_QUERY_TYPES,
  RHSM_API_RESPONSE_ERROR_CODE_TYPES,
  RHSM_API_RESPONSE_SLA_TYPES,
  RHSM_API_RESPONSE_UOM_TYPES,
  RHSM_API_RESPONSE_USAGE_TYPES
};
