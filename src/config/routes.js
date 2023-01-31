import { products } from './products';
import { helpers } from '../common';

const routes = [
  ...Object.entries(products.sortedConfigs().byGroupIdConfigs)
    .map(([, value]) => {
      const generatedRouteFromConfig = groupedConfigs => {
        const updatedConfigs = [
          {
            path: `/${groupedConfigs?.[0]?.productPath}`,
            pathParameter: [...groupedConfigs.map(({ productId }) => productId)],
            productParameter: [...groupedConfigs.map(({ productId }) => productId)],
            productConfig: [...groupedConfigs],
            redirect: null,
            activateOnError: false,
            disabled: helpers.UI_DISABLED,
            default: false,
            component: 'productView/productView'
          }
        ];

        groupedConfigs.forEach(({ aliases }) => {
          if (aliases.length) {
            aliases.forEach(alias => {
              const aliasedConfig = { ...updatedConfigs[0] };
              aliasedConfig.path = `/${alias}`;
              updatedConfigs.push(aliasedConfig);
            });
          }
        });

        return updatedConfigs;
      };

      return generatedRouteFromConfig(value);
    })
    .flat(2),
  {
    id: 'optin',
    path: '/optin',
    redirect: null,
    activateOnError: true,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'optinView/optinView'
  },
  {
    id: 'missing',
    path: '/',
    redirect: './',
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: true,
    component: 'productView/productViewMissing'
  }
];

export { routes as default, routes };
