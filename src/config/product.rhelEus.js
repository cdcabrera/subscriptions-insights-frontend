import { RHSM_API_PATH_PRODUCT_TYPES } from '../services/rhsm/rhsmConstants';
import { config as rhelConfig } from './product.rhel';

/**
 * RHEL EUS
 *
 * @memberof Products
 * @module RHEL-EUS
 */

/**
 * Product group. A variant and dissimilar product configuration grouping identifier.
 *
 * @type {string}
 */
const productGroup = RHSM_API_PATH_PRODUCT_TYPES.RHEL_X86_EUS;

/**
 * Product ID. The identifier used when querying the API.
 *
 * @type {string}
 */
const productId = RHSM_API_PATH_PRODUCT_TYPES.RHEL_X86_EUS;

const config = {
  ...rhelConfig,
  aliases: [],
  productGroup,
  productId,
  productPath: productGroup.toLowerCase(),
  viewId: `view${productGroup}`,
  productVariants: []
};

export { config as default, config, productGroup, productId };
