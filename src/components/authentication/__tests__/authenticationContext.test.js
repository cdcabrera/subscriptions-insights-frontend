import { context, useGetAuthorization, useSession } from '../authenticationContext';
import { rhsmConstants } from '../../../services/rhsm/rhsmConstants';
import { reduxTypes } from '../../../redux';

describe('AuthenticationContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for retrieving auth data from multiple selectors', async () => {
    const { result: errorResponse } = await renderHook(() =>
      useGetAuthorization({
        useSelectorsResponse: () => ({
          error: true,
          data: {
            auth: [],
            errors: [rhsmConstants.RHSM_API_RESPONSE_ERRORS_CODE_TYPES.OPTIN],
            locale: {}
          },
          responses: {
            id: {
              errors: {
                status: 403
              }
            }
          }
        })
      })
    );

    expect(errorResponse).toMatchSnapshot('error response');

    const mockDispatch = jest.fn();
    const { result: successResponse } = await renderHook(() =>
      useGetAuthorization({
        useDispatch: () => mockDispatch,
        useSelectorsResponse: () => ({
          fulfilled: true,
          data: {
            auth: [],
            errors: [],
            locale: {}
          },
          responses: {
            id: {
              errors: {}
            }
          }
        })
      })
    );

    expect(mockDispatch.mock.calls).toMatchSnapshot('success dispatch');
    expect(successResponse).toMatchSnapshot('success response');

    const { result: mockStoreSuccessResponse } = await renderHook(() => useGetAuthorization(), {
      state: {
        app: {
          errors: {}
        },
        dynamic: {
          [reduxTypes.platform.PLATFORM_USER_AUTH]: {
            fulfilled: true,
            data: [
              { isAdmin: true, isEntitled: true },
              {
                permissions: [
                  {
                    subscriptions: {
                      all: true,
                      resources: {
                        '*': {
                          '*': [],
                          loremCustom: [],
                          read: []
                        }
                      }
                    }
                  }
                ],
                authorized: {
                  subscriptions: true
                }
              }
            ]
          },
          [reduxTypes.app.USER_LOCALE]: { fulfilled: true, data: {} }
        }
      }
    });

    expect(mockStoreSuccessResponse).toMatchSnapshot('mock store success response');

    const { result: mockStoreErrorResponse } = await renderHook(() => useGetAuthorization(), {
      state: {
        app: {
          errors: {
            error: true,
            data: ['lorem', 'ipsum']
          }
        },
        dynamic: {
          [reduxTypes.platform.PLATFORM_USER_AUTH]: {
            error: true,
            data: []
          },
          [reduxTypes.app.USER_LOCALE]: { fulfilled: true, data: {} }
        }
      }
    });

    expect(mockStoreErrorResponse).toMatchSnapshot('mock store error response');
  });

  it('should apply a hook for retrieving auth data results as context for session', async () => {
    const mockContextValue = {
      lorem: 'ipsum'
    };

    const { result } = await renderHook(() => useSession({ useAuthContext: () => mockContextValue }));
    expect(result).toMatchSnapshot('session context, basic');
  });
});
