import { products } from '../products';
import { generateChartSettings } from '../../components/graphCard/graphCardHelpers';
import {
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INVENTORY_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES as SUBSCRIPTIONS_INVENTORY_TYPES
} from '../../services/rhsm/rhsmConstants';
import { inventoryCardHelpers } from '../../components/inventoryCard/inventoryCardHelpers';

describe('Product specific configurations', () => {
  const setInventoryFiltersSettings = (data, { filters, settings, productId, query = {}, session = {} } = {}) => {
    const normalize = inventoryCardHelpers.normalizeInventorySettings({
      filters,
      settings,
      productId
    });

    return inventoryCardHelpers.parseInventoryResponse({
      data,
      filters: normalize.filters,
      query,
      session,
      settings: normalize.settings
    });
  };

  it('should apply query parameters', () => {
    expect(
      products.configs.map(
        ({ productId, graphTallyQuery, inventoryGuestsQuery, inventoryHostsQuery, inventorySubscriptionsQuery }) => ({
          [productId]: {
            graphTallyQuery,
            inventoryGuestsQuery,
            inventoryHostsQuery,
            inventorySubscriptionsQuery
          }
        })
      )
    ).toMatchSnapshot('product query parameters');
  });

  it('should apply graph filters and settings', () => {
    expect(
      products.configs.map(({ productId, initialGraphFilters = [], initialGraphSettings = {} }) => ({
        [productId]: generateChartSettings({
          filters: initialGraphFilters,
          settings: initialGraphSettings,
          productId: 'loremIpsumTest'
        })
      }))
    ).toMatchSnapshot('graph filters, settings');
  });

  it('should apply guest filters and settings', () => {
    const inventoryData = {
      data: [
        {
          [INVENTORY_TYPES.DISPLAY_NAME]: 'lorem',
          [INVENTORY_TYPES.INVENTORY_ID]: 'lorem inventory id',
          [INVENTORY_TYPES.SUBSCRIPTION_MANAGER_ID]: 'XXXX-XXXX-XXXXX-XXXXX',
          [INVENTORY_TYPES.LAST_SEEN]: '2022-01-01T00:00:00.000Z',
          loremIpsum: 'hello world'
        }
      ]
    };

    expect(
      products.configs.map(
        ({ productId, initialGuestsFilters: filters = [], initialGuestsSettings: settings = {} }) => ({
          [productId]: setInventoryFiltersSettings(inventoryData, { filters, settings })
        })
      )
    ).toMatchSnapshot('guest filters, settings');

    const session = { authorized: { inventory: true } };

    expect(
      products.configs.map(
        ({ productId, initialGuestsFilters: filters = [], initialGuestsSettings: settings = {} }) => ({
          [productId]: setInventoryFiltersSettings(inventoryData, { filters, settings, session })
        })
      )
    ).toMatchSnapshot('guest authorized filters, settings');
  });

  it('should apply inventory filters and settings', () => {
    const inventoryData = {
      data: [
        {
          [INVENTORY_TYPES.DISPLAY_NAME]: 'lorem',
          [INVENTORY_TYPES.CLOUD_PROVIDER]: 'dolor sit',
          [INVENTORY_TYPES.INSTANCE_ID]: 'XXXX-XXXX-XXXXX-XXXXX',
          [INVENTORY_TYPES.LAST_SEEN]: '2022-01-01T00:00:00.000Z',
          loremIpsum: 'hello world'
        }
      ]
    };

    expect(
      products.configs.map(
        ({ productId, initialInventoryFilters: filters = [], initialInventorySettings: settings = {} }) => ({
          [productId]: setInventoryFiltersSettings(inventoryData, { filters, settings })
        })
      )
    ).toMatchSnapshot('inventory filters, settings');

    const session = { authorized: { inventory: true } };

    expect(
      products.configs.map(
        ({ productId, initialInventoryFilters: filters = [], initialInventorySettings: settings = {} }) => ({
          [productId]: setInventoryFiltersSettings(inventoryData, { filters, settings, session })
        })
      )
    ).toMatchSnapshot('inventory authorized filters, settings');
  });

  it('should apply subscription filters and settings', () => {
    const inventoryData = {
      data: [
        {
          [SUBSCRIPTIONS_INVENTORY_TYPES.PRODUCT_NAME]: 'lorem',
          [SUBSCRIPTIONS_INVENTORY_TYPES.BILLING_PROVIDER]: 'dolor sit',
          [SUBSCRIPTIONS_INVENTORY_TYPES.HAS_INFINITE_QUANTITY]: true,
          [SUBSCRIPTIONS_INVENTORY_TYPES.NEXT_EVENT_DATE]: '2022-01-01T00:00:00.000Z',
          [SUBSCRIPTIONS_INVENTORY_TYPES.QUANTITY]: 1,
          [SUBSCRIPTIONS_INVENTORY_TYPES.SERVICE_LEVEL]: 'hello world',
          [SUBSCRIPTIONS_INVENTORY_TYPES.TOTAL_CAPACITY]: 2000,
          [SUBSCRIPTIONS_INVENTORY_TYPES.UOM]: 'cores',
          loremIpsum: 'hello world'
        }
      ]
    };

    expect(
      products.configs.map(
        ({
          productId,
          initialSubscriptionsInventoryFilters: filters = [],
          initialSubscriptionsInventorySettings: settings = {}
        }) => ({
          [productId]: setInventoryFiltersSettings(inventoryData, { filters, settings })
        })
      )
    ).toMatchSnapshot('subscriptions filters, settings');

    const session = { authorized: { inventory: true } };

    expect(
      products.configs.map(
        ({
          productId,
          initialSubscriptionsInventoryFilters: filters = [],
          initialSubscriptionsInventorySettings: settings = {}
        }) => ({
          [productId]: setInventoryFiltersSettings(inventoryData, { filters, settings, session })
        })
      )
    ).toMatchSnapshot('subscriptions authorized filters, settings');
  });
});
