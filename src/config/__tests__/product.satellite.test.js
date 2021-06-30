import { config } from '../product.satellite';
import { parseRowCellsListData } from '../../components/inventoryList/inventoryListHelpers';
import {
  RHSM_API_QUERY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_TYPES
} from '../../types/rhsmApiTypes';

describe('Product Satellite config', () => {
  it('should set product configuration', () => {
    const {
      initialGraphFilters,
      initialGuestsFilters,
      initialInventoryFilters,
      inventoryHostsQuery,
      inventorySubscriptionsQuery,
      query
    } = config;

    expect({ initialGraphFilters, initialGuestsFilters, initialInventoryFilters, query }).toMatchSnapshot(
      'initial configuration'
    );

    const inventoryData = {
      displayName: 'lorem',
      inventoryId: 'lorem inventory id',
      hardwareType: 'ipsum',
      measurementType: null,
      numberOfGuests: 3,
      sockets: 10,
      cores: 12,
      lastSeen: 'lorem date obj',
      loremIpsum: 'hello world'
    };

    const filteredInventoryData = parseRowCellsListData({
      filters: initialInventoryFilters,
      cellData: inventoryData
    });

    expect(filteredInventoryData).toMatchSnapshot('filteredInventoryData results');

    const fallbackInventoryData = {
      ...inventoryData,
      inventoryId: null,
      lastSeen: null,
      cloudProvider: 'dolor sit'
    };

    const fallbackFilteredInventoryData = parseRowCellsListData({
      filters: initialInventoryFilters,
      cellData: fallbackInventoryData
    });

    expect(fallbackFilteredInventoryData).toMatchSnapshot('filteredInventoryData results, fallback display');

    const filteredInventoryDataAuthorized = parseRowCellsListData({
      filters: initialInventoryFilters,
      cellData: inventoryData,
      session: { authorized: { inventory: true } }
    });

    expect(filteredInventoryDataAuthorized).toMatchSnapshot('filteredInventoryData results, authorized');

    const guestsData = {
      displayName: 'lorem',
      inventoryId: 'lorem inventory id',
      subscriptionManagerId: 'lorem subscription id',
      lastSeen: 'lorem date obj',
      loremIpsum: 'hello world'
    };

    const filteredGuestsData = parseRowCellsListData({
      filters: initialGuestsFilters,
      cellData: guestsData
    });

    expect(filteredGuestsData).toMatchSnapshot('filteredGuestsData results');

    const filteredGuestsDataAuthorized = parseRowCellsListData({
      filters: initialGuestsFilters,
      cellData: guestsData,
      session: { authorized: { inventory: true } }
    });

    expect(filteredGuestsDataAuthorized).toMatchSnapshot('filteredGuestsData results, authorized');

    expect({
      hostsInventory: inventoryHostsQuery[RHSM_API_QUERY_TYPES.DIRECTION] === SORT_DIRECTION_TYPES.DESCENDING,
      subscriptionsInventory:
        inventorySubscriptionsQuery[RHSM_API_QUERY_TYPES.DIRECTION] === SORT_DIRECTION_TYPES.DESCENDING
    }).toMatchSnapshot('default sort for inventory should descend');
  });
});
