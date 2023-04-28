// import { closest } from 'fastest-levenshtein';
import { helpers } from '../common/helpers';

/**
 * IIFE for generating a product configs listing via webpack
 *
 * @type {{aliases: string[], productGroup: string, productId: string, productLabel: string, productDisplay: string, viewId: string,
 *     productVariants: string[], query: object, graphTallyQuery: object, inventoryHostQuery: object,
 *     inventorySubscriptionsQuery: object, initialGraphFilters: {}[], initialGraphSettings: object, initialGuestsFilters: {}[],
 *     initialInventoryFilters: {}[], initialSubscriptionsInventoryFilters: {}[], initialToolbarFilters: {}[], }[]}
 */
const productConfigs = (() => {
  try {
    const path = require.context('./', false, /product\.[\d\D]+\.js$/i);
    return path.keys().map(path);
  } catch (e) {
    /**
     * Basic configuration for testing only.
     */
    if (process.env.REACT_APP_ENV === 'test' && require) {
      return [
        ...require('fs') // eslint-disable-line
          ?.readdirSync('./src/config') // eslint-disable-line
          ?.filter(file => /product\.[a-z]+\.js/i.test(file)) // eslint-disable-line
          ?.map(file => require(`./${file}`)) // eslint-disable-line
      ];
    }

    console.warn(`Product configuration failed to load: ${e.message}`);
    return [];
  }
})()?.map(value => value.config);

/**
 * Sorted/organized/grouped product configs.
 * - byProductPathConfigs, object configurations associated with productPaths
 * - byGroup, object configurations associated with all productGroups, productIds, productPaths, and aliases
 * - byGroupIdConfigs, object of productGroup properties against an array of associated product configs
 * - byViewIds, object of viewId properties against an array of associated productId strings. "viewId" was created because of the
 *     overlap with productIds and productGroups, this may be refactored in the future
 * - byProductIds, a unique array of all productId strings
 * - byAlias,object configurations associated with product aliases
 * - byAliasGroupProductPathIds, list of identifiers associated with all productGroups, productIds, productPaths, and aliases
 * - byGroupIds, object of productGroup properties against an array of associated productId strings.
 * - byViewIdConfigs, object of viewId properties against an array of associated product configs
 * - byProductIdConfigs, object of productId properties against a product config
 *
 * @param {productConfigs} configs
 * @returns {{byProductPathConfigs: {}, byGroup: {}, byGroupIdConfigs: {}, byViewIds: {}, byProductIds: any[], byAlias: {}, byAliasGroupProductPathIds: string[], byGroupIds: {}, byViewIdConfigs: {}, byProductIdConfigs: {}}}
 */
const sortedProductConfigs = helpers.memo((configs = productConfigs) => {
  const viewIdConfigs = {};
  const productAliases = {};
  const productIds = new Set();
  const productIdConfigs = {};
  const productPathConfigs = {};
  const anything = {};
  const anythingVariants = {};
  const grouped = {};
  const groupIdConfigs = {};
  const groupedGroupIds = {};
  const groupedVariants = {};
  const groupedVariantGroups = {};
  const groupedViewIds = {};

  configs?.forEach(config => {
    const { aliases, productGroup, productId, productLabel, productPath, productVariants, viewId } = config;

    if (productGroup && productId) {
      grouped[productGroup] ??= {};
      grouped[productGroup][productId] = config;

      anything[productGroup] ??= {};
      anything[productGroup][productId] = config;
    }

    if (productId) {
      anything[productId] ??= {};
      anything[productId][productId] = config;
    }

    if (productLabel && productId) {
      anything[productLabel] ??= {};
      anything[productLabel][productId] = config;
    }

    if (productPath && productId) {
      anything[productPath] ??= {};
      anything[productPath][productId] = config;
    }

    aliases?.forEach(alias => {
      if (productId) {
        anything[alias] ??= {};
        anything[alias][productId] = config;
      }

      productAliases[alias] ??= [];
      productAliases[alias].push(config);
    });

    productVariants?.forEach(variant => {
      if (productId) {
        anything[variant] ??= {};
        anything[variant][productId] = config;
        anything[variant][productId] = { ...config, productId: variant };
      }

      productAliases[variant] ??= [];
      productAliases[variant].push({ ...config, productId: variant });
    });

    if (productId) {
      productIdConfigs[productId] = config;
      productIds.add(productId);
    }

    if (productPath) {
      productPathConfigs[productPath] ??= [];
      productPathConfigs[productPath].push(config);
    }

    if (productGroup) {
      groupIdConfigs[productGroup] ??= [];
      groupIdConfigs[productGroup].push(config);

      if (Array.isArray(productVariants)) {
        groupedVariants[productGroup] ??= [];
        groupedVariants[productGroup].push(...productVariants);

        productVariants.forEach(variant => {
          groupedVariantGroups[variant] = productGroup;
        });
      }
    }

    if (productGroup && productId) {
      groupedGroupIds[productGroup] ??= [];
      groupedGroupIds[productGroup].push(productId);

      if (!groupedVariants[productGroup]?.includes(productId)) {
        groupedVariants[productGroup] ??= [];
        groupedVariants[productGroup].push(productId);

        groupedVariantGroups[productId] = productGroup;
      }
    }

    if (viewId) {
      viewIdConfigs[viewId] ??= [];
      viewIdConfigs[viewId].push(config);
    }

    if (viewId && productId) {
      groupedViewIds[viewId] ??= [];
      groupedViewIds[viewId].push(productId);
    }
  });

  Object.entries(grouped).forEach(([key, value]) => {
    grouped[key] = Object.values(value);
  });

  Object.entries(anything).forEach(([key, value]) => {
    anything[key] = Object.values(value);
    anythingVariants[key] ??= [];

    anything[key].forEach(({ productGroup }) => {
      if (productGroup) {
        anythingVariants[key].push(...groupedVariants[productGroup]);
      }
    });
  });

  const test = helpers.objFreeze({
    byAlias: productAliases,
    byAnything: anything,
    byAnythingPathIds: Object.keys(anything).sort(),
    byAnythingVariants: anythingVariants,
    byGroup: grouped,
    byGroupIdConfigs: groupIdConfigs,
    byGroupIds: groupedGroupIds,
    byGroupVariants: groupedVariants,
    byVariantGroups: groupedVariantGroups,
    byProductPathConfigs: productPathConfigs,
    byProductIdConfigs: productIdConfigs,
    byProductIds: Array.from(productIds),
    byViewIdConfigs: viewIdConfigs,
    byViewIds: groupedViewIds
  });

  console.log('>>>>> TEST', test);

  return test;
});

const products = {
  configs: productConfigs,
  sortedConfigs: sortedProductConfigs
};

export { products as default, products, productConfigs, sortedProductConfigs };
