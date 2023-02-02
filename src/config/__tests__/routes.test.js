import { routes } from '../routes';

describe('Routes configuration', () => {
  it('should return limited generated routes for testing', () => {
    expect(routes.map(({ path }) => path)).toMatchSnapshot('expected paths');
  });
});
