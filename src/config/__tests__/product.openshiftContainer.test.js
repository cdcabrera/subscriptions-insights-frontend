import { config } from '../product.openshiftContainer';
import { parseRowCellsListData } from '../../components/inventoryList/inventoryListHelpers';
import {
  RHSM_API_QUERY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_TYPES
} from '../../types/rhsmApiTypes';

describe('Product OpenShift Container config', () => {
  it('should apply hosts inventory configuration', () => {
    const { initialInventoryFilters: initialFilters, inventoryHostsQuery: inventoryQuery } = config;

    const inventoryData = {
      displayName: 'lorem',
      inventoryId: 'lorem inventory id',
      numberOfGuests: 3,
      cores: 20,
      sockets: 100,
      lastSeen: 'lorem date obj',
      loremIpsum: 'hello world'
    };

    const filteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: inventoryData
    });

    expect(filteredInventoryData).toMatchSnapshot('filtered');

    const fallbackInventoryData = {
      ...inventoryData,
      inventoryId: null,
      numberOfGuests: null,
      cores: null,
      sockets: null,
      lastSeen: null
    };

    const fallbackFilteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: fallbackInventoryData
    });

    expect(fallbackFilteredInventoryData).toMatchSnapshot('filtered, fallback display');

    expect(inventoryQuery[RHSM_API_QUERY_TYPES.DIRECTION] === SORT_DIRECTION_TYPES.DESCENDING).toBe(true);
  });

  it('should apply subscriptions inventory configuration', () => {
    const {
      initialSubscriptionsInventoryFilters: initialFilters,
      inventorySubscriptionsQuery: inventoryQuery
    } = config;

    const inventoryData = {
      productName: 'lorem',
      serviceLevel: 'hello world',
      upcomingEventDate: 'lorem date obj'
    };

    const filteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: inventoryData
    });

    expect(filteredInventoryData).toMatchSnapshot('filtered');

    const fallbackInventoryData = {
      ...inventoryData,
      serviceLevel: null,
      upcomingEventDate: null
    };

    const fallbackFilteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: fallbackInventoryData
    });

    expect(fallbackFilteredInventoryData).toMatchSnapshot('filtered, fallback display');

    expect(inventoryQuery[RHSM_API_QUERY_TYPES.DIRECTION] === SORT_DIRECTION_TYPES.DESCENDING).toBe(true);
  });
});
