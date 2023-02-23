// import { productConfig } from '../../../config';
import { context, useLocation, useNavigate, useRouteDetail } from '../routerContext';

describe('RouterContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for return routeDetail', () => {
    const mockUseRouterContext = () => ({
      routeDetail: {
        lorem: 'ipsum'
      },
      dolor: 'sit'
    });

    const { result } = shallowHook(() => useRouteDetail({ useRouterContext: mockUseRouterContext }));
    expect(result).toMatchSnapshot('route details');
  });

  it('should apply a hook for useLocation', async () => {
    const mockLocation = {
      search: '?lorem=ipsum'
    };

    const { result: mockUseLocation } = await mountHook(() => useLocation({ useLocation: () => mockLocation }));
    expect(mockUseLocation).toMatchSnapshot('location');
  });

  it('should apply a hook for useNavigate', () => {
    const mockLocation = {
      search: '?lorem=ipsum'
    };
    const mockNavigation = jest.fn;
    const updatedCalls = [];
    // const mockNavFunc = jest.fn().mockImplementation(() => mockNavigation);
    const { result: mockNavigationSet } = shallowHook(() =>
      useNavigate({
        useLocation: () => mockLocation,
        useNavigate: () => value => updatedCalls.push(value) // jest.fn().mockImplementation(() => mockNavigation)
        // useNavigate: () => mockNavFunc
      })
    );

    mockNavigationSet('/dolor/sit');
    mockNavigationSet('rhel');
    mockNavigationSet('insights');

    // console.log('>>>>>> result', mockNavigationSet, typeof mockNavigationSet);
    console.log('>>>>>>>> result', mockNavigation);
    // /{
    //       rhods: mockNavigationSet('/dolor/sit'),
    //       rhel: [mockNavigationSet('rhel'), mockNavigationSet('insights')]
    //     }

    expect(updatedCalls).toMatchSnapshot('navigation push');
  });
});
