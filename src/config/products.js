/**
 * Generate a product configs listing
 *
 * @type {{aliases: string[], productGroup: string, productId: string, productLabel: string, productDisplay: string, viewId: string,
 *     productArchitectures: string[], productVariants: string[], query: object, graphTallyQuery: object, inventoryHostQuery: object,
 *     inventorySubscriptionsQuery: object, initialGraphFilters: {}[], initialGraphSettings: object, initialGuestsFilters: {}[],
 *     initialInventoryFilters: {}[], initialSubscriptionsInventoryFilters: {}[], initialToolbarFilters: {}[], }[]}
 */
const productConfigs = (() => {
  const path = require.context('./', false, /product\.[\d\D]+\.js$/i);
  return path.keys().map(path);
})()?.map(value => value.config);

/**
 * Generate a unique list of available product routing "path parameter" identifiers.
 */
const availableProducts = (configs => {
  const products = new Set();
  configs.forEach(({ productId, aliases }) => {
    products.add(productId.toLowerCase());

    if (Array.isArray(aliases) && aliases.length) {
      aliases.forEach(alias => {
        products.add(alias.toLowerCase());
      });
    }
  });
  return Array.from(products);
})(productConfigs);

/**
 * Generate a grouped product configs.
 */
const groupedProductConfigs = (configs => {
  const products = {};
  configs.forEach(config => {
    const { productGroup } = config;
    products[productGroup] ??= [];
    products[productGroup].push(config);
  });
  return products;
})(productConfigs);

/**
 * Return a product config object.
 *
 * @param {object} params
 * @param {string} params.id
 * @param {string} params.pathName
 * @param {boolean} params.returnDefault
 * @param {Array} params.config
 * @returns {object}
 */
/*
const getProductConfig = _memoize(({ id = null, pathName, returnDefault = false, configs = productConfigs } = {}) => {
  let configItem;

  if (id) {
    configItem = configs.find(item => new RegExp(item.productId, 'i').test(id));
  }

  if ((!configItem && pathName) || (!configItem && !pathName && !returnDefault)) {
    configItem = routerHelpers.getRouteConfigByPath({ pathName, configs }).firstMatch;
  }

  return { ...configItem };
});
*/

const products = {
  availableProducts,
  configs: productConfigs,
  groupedConfigs: groupedProductConfigs
};

export { products as default, products, availableProducts, groupedProductConfigs, productConfigs };
