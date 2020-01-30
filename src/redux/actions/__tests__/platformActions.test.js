import { platformActions } from '../platformActions';

describe('PlatformActions', () => {
  it('Should return a dispatch object for the initializeChrome method', () => {
    expect(platformActions.initializeChrome()).toMatchSnapshot('dispatch object');
  });

  it('Should return a function for the onNavigation method', () => {
    expect(platformActions.onNavigation()).toMatchSnapshot('function');
  });

  it('Should return a dispatch object for the setAppName method', () => {
    expect(platformActions.setAppName()).toMatchSnapshot('dispatch object');
  });

  it('Should return a function for the setNavigation method', () => {
    expect(platformActions.setNavigation()).toMatchSnapshot('function');
  });
});
