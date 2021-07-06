import { config } from '../index';

describe('Configuration', () => {
  it('should have specific config properties', () => {
    expect(Object.keys(config)).toMatchSnapshot('config');

    // expect(Object.keys(config.products)).toMatchSnapshot('products');
    // expect(config.rbac).toMatchSnapshot('rbac');
    // expect(config.routes.map(obj => ({ ...Object.entries(obj).map }))).toMatchSnapshot('routes');
  });

  it('should have consistent product configuration', () => {
    expect(Object.keys(config.products)).toMatchSnapshot('products');

    // loop through configs and confirm they have a min number of the same properties
    // it('should set basic product configuration', () => {
    //  expect(config).toMatchSnapshot('initial configuration');
    // });
    // it('should set basic product configuration', () => {
    //     expect(config).toMatchSnapshot('initial configuration');
    //   });
  });

  it('should have a consistent rbac configuration', () => {
    Object.values(config.rbac).forEach(({ permissions }) => {
      expect(Array.isArray(permissions)).toBe(true);

      permissions.forEach((value, index) => {
        expect(`${index}, ${Object.keys(permissions[index]).join(', ')}`).toBe(`${index}, resource, operation`);
      });
    });
  });

  it('should have a consistent route configuration', () => {
    expect(Array.isArray(config.routes)).toBe(true);

    const inconsistentRoutes = [];

    config.routes.forEach((value, index) => {
      const entryCheck = {
        redirect:
          typeof config.routes[index].redirect === 'string' || config.routes[index].redirect === null ? 'PASS' : 'FAIL',
        isSearchable: typeof config.routes[index].isSearchable === 'boolean' ? 'PASS' : 'FAIL',
        aliases: Array.isArray(config.routes[index].aliases) ? 'PASS' : 'FAIL',
        activateOnError: typeof config.routes[index].activateOnError === 'boolean' ? 'PASS' : 'FAIL',
        disabled: typeof config.routes[index].disabled === 'boolean' ? 'PASS' : 'FAIL',
        default: typeof config.routes[index].default === 'boolean' ? 'PASS' : 'FAIL',
        component:
          typeof config.routes[index].component === 'string' || config.routes[index].component === null
            ? 'PASS'
            : 'FAIL'
      };

      if (Object.values(entryCheck).indexOf('FAIL') > -1) {
        inconsistentRoutes.push({ [`Route ${index} inconsistent`]: entryCheck });
      }
    });

    expect(inconsistentRoutes).toMatchSnapshot('inconsistent routes');
  });
});
