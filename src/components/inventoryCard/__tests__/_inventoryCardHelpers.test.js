import { inventoryCardHelpers, normalizeInventorySettings } from '../_inventoryCardHelpers';

describe('_InventoryListHelpers', () => {
  it('should have specific functions', () => {
    expect(inventoryCardHelpers).toMatchSnapshot('inventoryListHelpers');
  });

  it('normalizeInventorySettings should return base graph settings', () => {
    expect(normalizeInventorySettings()).toMatchSnapshot('no filters');

    expect(
      normalizeInventorySettings({
        filters: [{ lorem: 'ipsum' }, { metric: 'dolorSit', dolor: 'sit' }],
        productId: 'loremIpsumTest'
      })
    ).toMatchSnapshot('basic filters');
  });
});
