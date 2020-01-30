import { baseName, dynamicBaseName, getNavigationDetail, getRouteDetail, getNavRouteDetail } from '../routerHelpers';

describe('RouterHelpers', () => {
  it('should return specific properties', () => {
    expect(baseName).toBeDefined();
    expect(dynamicBaseName).toBeDefined();
    expect(getNavigationDetail).toBeDefined();
    expect(getRouteDetail).toBeDefined();
    expect(getNavRouteDetail).toBeDefined();
  });

  it('should return a generated baseName', () => {
    expect(
      dynamicBaseName({
        pathName: '/appName',
        pathPrefix: '/beta'
      })
    ).toMatchSnapshot('app base name');

    expect(
      dynamicBaseName({
        pathName: '/beta/appName',
        pathPrefix: '/beta'
      })
    ).toMatchSnapshot('app base lorem base name');

    expect(
      dynamicBaseName({
        pathName: '/beta/appName',
        pathPrefix: '/beta'
      })
    ).toMatchSnapshot('beta app base name');

    expect(
      dynamicBaseName({
        pathName: '/beta/appName/loremRoute',
        pathPrefix: '/beta'
      })
    ).toMatchSnapshot('beta app lorem route name');
  });

  it('should return navigation and route details that align to location', () => {
    expect({
      nav: getNavigationDetail({ test: 'computenode' }),
      route: getRouteDetail({ test: 'computenode' }),
      navRoute: getNavRouteDetail({ test: 'computenode' })
    }).toMatchSnapshot('detail: computenode');

    expect({
      nav: getNavigationDetail({ params: {}, pathname: 'lore-ipsum-broken', returnDefault: true }),
      route: getRouteDetail({ params: {}, pathname: 'lorem-ipsum-broken', returnDefault: true }),
      navRoute: getNavRouteDetail({ params: {}, pathname: 'lorem-ipsum-broken', returnDefault: true })
    }).toMatchSnapshot('detail: default');

    expect({
      nav: getNavigationDetail({ pathname: '/rhel-sw/all' }),
      route: getRouteDetail({ pathname: '/rhel-sw/all' }),
      navRoute: getNavRouteDetail({ pathname: '/rhel-sw/all' })
    }).toMatchSnapshot('detail: match specific navigation');

    expect({
      nav: getNavigationDetail({}),
      route: getRouteDetail({}),
      navRoute: getNavRouteDetail({})
    }).toMatchSnapshot('detail: null or undefined');
  });
});
