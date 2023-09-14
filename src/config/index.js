import featureFlagsConfig from './featureFlags.json';
import rbacConfig from './rbac.json';
import { products as productConfig } from './products';
import { routes as routesConfig } from './routes';

const config = {
  featureFlags: featureFlagsConfig,
  products: productConfig,
  rbac: rbacConfig,
  routes: routesConfig
};

export { config as default, config, featureFlagsConfig, productConfig, rbacConfig, routesConfig };
