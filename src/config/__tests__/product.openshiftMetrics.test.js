import { config } from '../product.openshiftMetrics';
import { parseRowCellsListData } from '../../components/inventoryList/inventoryListHelpers';
import {
  RHSM_API_QUERY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_TYPES
} from '../../types/rhsmApiTypes';

describe('Product OpenShift Metrics config', () => {
  it('should set product configuration', () => {
    const { initialGraphFilters, initialGraphSettings, initialInventoryFilters, inventoryHostsQuery, query } = config;

    expect({ initialGraphFilters, initialInventoryFilters, query }).toMatchSnapshot('initial configuration');

    // filter inventory data checks
    const inventoryData = {
      displayName: 'lorem',
      inventoryId: 'lorem inventory id',
      coreHours: 12.53,
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
      coreHours: null,
      inventoryId: null,
      lastSeen: null
    };

    const fallbackFilteredInventoryData = parseRowCellsListData({
      filters: initialInventoryFilters,
      cellData: fallbackInventoryData
    });

    expect(fallbackFilteredInventoryData).toMatchSnapshot('filteredInventoryData results, fallback display');

    expect({
      hostsInventory: inventoryHostsQuery[RHSM_API_QUERY_TYPES.DIRECTION] === SORT_DIRECTION_TYPES.DESCENDING
    }).toMatchSnapshot('default sort for inventory should descend');

    // product action display callback
    expect({
      productActionDisplay: initialGraphSettings.actionDisplay({
        coreHours: [
          {
            y: 0
          },
          {
            y: 400
          },
          {
            y: 100
          }
        ]
      })
    }).toMatchSnapshot('product action display should display a total value below 1000');

    expect({
      productActionDisplay: initialGraphSettings.actionDisplay({
        coreHours: [
          {
            y: 0
          },
          {
            y: 800000
          },
          {
            y: 100000
          }
        ]
      })
    }).toMatchSnapshot('product action display should display a total value below 1000000');

    expect({
      productActionDisplay: initialGraphSettings.actionDisplay({
        coreHours: [
          {
            y: 0
          },
          {
            y: 1000
          },
          {
            y: 100
          }
        ]
      })
    }).toMatchSnapshot('product action display should display a total value');

    expect({
      productActionDisplay: initialGraphSettings.actionDisplay({
        loremIpsum: [
          {
            y: 0
          },
          {
            y: 1000
          },
          {
            y: 100
          }
        ]
      })
    }).toMatchSnapshot('product action display should NOT display a total value');
  });
});
