import * as reactRedux from 'react-redux';
import * as reactRouterDom from 'react-router-dom';
import { routerHooks } from '../useRouter';

// jest.mock('useHistory');

const testo = () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();
  const mock = jest.mock('react-router-dom', () => ({
    useHistory: () => ({
      push: mockPush,
      replace: mockReplace
    })
  }));

  return { push: mockPush, replace: mockReplace, mock };
};

/*
const mockPush = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockPush
  })
}));

 */
/*
const mockUseHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockUseHistoryPush
  })
}));
*/

describe('useRouter', () => {
  it('should return specific properties', () => {
    expect(routerHooks).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for useHistory', () => {
    const mockDispatch = jest.fn();
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(action => action(mockDispatch));

    const mockHistoryPush = jest.fn();
    // const useHistoryMock = jest.spyOn(reactRouterDom, 'useHistory').mockReturnValue(() => ({ push: mockHistoryPush }));
    // const useHistoryMock = mockReactRouterDom.mockImplementation(() => ({ useHistory: { push: mockHistoryPush } }));
    // mockUseHistory(() => ({ push: mockHistoryPush }));
    // const doit = { ...reactRouterDom, useHistory: jest.fn(() => ({ push: mockHistoryPush })) };
    // const useHistoryMock = jest.spyOn(reactRouterDom, 'useHistory').mockReturnValue(() => ({ push: mockHistoryPush }));

    // reactRouterDom = doit;

    // Object.assign(reactRouterDom, { useHistory: jest.fn(() => ({ push: mockHistoryPush })) });
    // reactRouterDom.useHistory = jest.fn(() => ({ push: mockHistoryPush }));
    /*
    mockResource('react-router-dom', {
      useHistory: () => ({ push: mockHistoryPush })
    });
    */
    //

    // const mockHistoryPush = jest.fn();
    // useHistory.mockReturnValue({ push: mockHistoryPush });
    // const useHistoryMock = jest.spyOn(useHistory).mockReturnValue(() => ({ push: mockHistoryPush }));
    // const useHistoryMock = jest.spyOn(reactRouterDom, 'useHistory').mockReturnValue(() => ({ push: mockHistoryPush }));
    // const useHistoryMock = jest.spyOn(reactRouterDom, 'useHistory').mockReturnValue(() => ({ push: mockHistoryPush }));

    // const { push } = routerHooks.useHistory();
    // push('/lorem/ipsum');

    // const hook = mockHookResponse(routerHooks.useHistory);
    // console.log('>>>>>', mockDispatch.mock.calls);
    // expect(hook).toMatchSnapshot('useHistory');

    const mockUseHistory = mockHook(routerHooks.useHistory, {
      args: [{ useHistory: () => ({ push: mockHistoryPush }) }]
    });
    mockUseHistory.push('rhel');

    expect(mockDispatch.mock.calls).toMatchSnapshot('push, config route');

    mockUseHistory.push('/lorem/ipsum');
    expect(mockHistoryPush.mock.calls).toMatchSnapshot('push, unique route');

    /*
    const { push: mockPush, mock } = test();
    push('/lorem/ipsum');
    expect(mockPush.mock.calls).toMatchSnapshot('push, unique route');
    mock.mockClear();
     */

    useDispatchMock.mockClear();
    // useHistoryMock.mockClear();
  });
});
