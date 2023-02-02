import { products } from '../products';

describe('Product configurations', () => {
  it('should return specific methods and properties', () => {
    expect({
      configs: products.configs.map(({ productId }) => productId),
      sortedConfigs: Object.keys(products.sortedConfigs())
    }).toMatchSnapshot('products');
  });

  it('should return sorted product configs', () => {
    expect(
      products.sortedConfigs([
        {
          productGroup: 'lorem',
          productId: 'lorem-ipsum',
          viewId: `view-lorem`
        },
        {
          productGroup: 'lorem',
          productId: 'lorem-dolor',
          viewId: `view-lorem`
        },
        {
          productGroup: 'dolor',
          productId: 'dolor sit',
          viewId: `view-dolor`
        },
        {
          productGroup: 'hello world',
          productId: 'hello world',
          viewId: `view-hello world`
        }
      ])
    ).toMatchSnapshot('sorted');
  });

  /*
  it('should return default sorted product configs', () => {
    const defaults = products.sortedConfigs();
    const results = {};

    Object.entries(defaults).forEach(([key, value]) => {
      results[key] = (Array.isArray(value) && 'Array') || typeof value;
    });

    expect(results).toMatchSnapshot('defaults');
  });
  */
});
