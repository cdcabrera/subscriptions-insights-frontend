import { reactReduxHooks, useDispatch } from '../useReactRedux';
import { store } from '../../store';

describe('useReactRedux', () => {
  it('should return specific properties', () => {
    expect(reactReduxHooks).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for useDispatch', () => {
    const mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
    const dispatch = useDispatch();

    dispatch({
      type: 'lorem',
      data: 'ipsum'
    });

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch');
    mockDispatch.mockClear();
  });

  it('should apply a hook for single selectors with useSelector', () => {
    const mockSelector = jest.fn();
    const mockUseSelector = callback => callback();
    const params = [mockSelector, 'loremIpsum', { equality: 'dolorSit', useSelector: mockUseSelector }];

    reactReduxHooks.useSelector(...params);

    expect(mockSelector).toBeCalledTimes(1);
    mockSelector.mockClear();
  });

  it('should apply a hook for multiple selectors with useSelectors', () => {
    const mockSelectorOne = jest.fn();
    const mockSelectorTwo = jest.fn();
    const mockSelectors = [mockSelectorOne, mockSelectorTwo];
    const mockUseSelector = callback => callback();
    const params = [mockSelectors, 'loremIpsum', { equality: 'dolorSit', useSelector: mockUseSelector }];

    reactReduxHooks.useSelectors(...params);

    expect(mockSelectorOne).toBeCalledTimes(1);
    expect(mockSelectorTwo).toBeCalledTimes(1);

    mockSelectorOne.mockClear();
    mockSelectorTwo.mockClear();
  });

  it('should apply a hook for aggregating multiple selector responses with useSelectorsResponse', () => {
    const errorError = reactReduxHooks.useSelectorsResponse(() => {}, {
      useSelectors: () => [{ error: true }, { error: true }]
    });

    expect(errorError).toMatchSnapshot('aggregated calls, error');

    const cancelledError = reactReduxHooks.useSelectorsResponse(() => {}, {
      useSelectors: () => [{ cancelled: true }, { error: true }]
    });

    expect(cancelledError).toMatchSnapshot('aggregated calls, cancelled error');

    const cancelledCancelled = reactReduxHooks.useSelectorsResponse(() => {}, {
      useSelectors: () => [{ cancelled: true }, { cancelled: true }]
    });

    expect(cancelledCancelled).toMatchSnapshot('aggregated calls, cancelled');

    const pendingError = reactReduxHooks.useSelectorsResponse(() => {}, {
      useSelectors: () => [{ pending: true }, { error: true }]
    });

    expect(pendingError).toMatchSnapshot('aggregated calls, pending error');

    const pendingCancelled = reactReduxHooks.useSelectorsResponse(() => {}, {
      useSelectors: () => [{ pending: true }, { cancelled: true }]
    });

    expect(pendingCancelled).toMatchSnapshot('aggregated calls, pending cancelled');

    const pendingPending = reactReduxHooks.useSelectorsResponse(() => {}, {
      useSelectors: () => [{ pending: true }, { pending: true }]
    });

    expect(pendingPending).toMatchSnapshot('aggregated calls, pending');

    const fulfilledError = reactReduxHooks.useSelectorsResponse(() => {}, {
      useSelectors: () => [{ fulfilled: true }, { error: true }]
    });

    expect(fulfilledError).toMatchSnapshot('aggregated calls, fulfilled error');

    const fulfilledCancelled = reactReduxHooks.useSelectorsResponse(() => {}, {
      useSelectors: () => [{ fulfilled: true }, { cancelled: true }]
    });

    expect(fulfilledCancelled).toMatchSnapshot('aggregated calls, fulfilled cancelled');

    const fulfilledPending = reactReduxHooks.useSelectorsResponse(() => {}, {
      useSelectors: () => [{ fulfilled: true }, { pending: true }]
    });

    expect(fulfilledPending).toMatchSnapshot('aggregated calls, fulfilled pending');

    const fulfilledFulfilled = reactReduxHooks.useSelectorsResponse(() => {}, {
      useSelectors: () => [{ fulfilled: true }, { fulfilled: true }]
    });

    expect(fulfilledFulfilled).toMatchSnapshot('aggregated calls, fulfilled');

    const fulfilledFulfilledById = reactReduxHooks.useSelectorsResponse(() => {}, {
      useSelectors: () => ({
        lorem: { fulfilled: true },
        ipsum: { fulfilled: true }
      })
    });

    expect(fulfilledFulfilledById).toMatchSnapshot('aggregated calls, fulfilled by ID');
  });

  it('should apply hooks for aggregating multiple selector responses', () => {
    const generatedSelectorResponses = hook => {
      const responses = {};

      responses.cancelledCancelled = hook(() => {}, {
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              cancelledByList: [{ cancelled: true }, { cancelled: true }],
              cancelledDataByList: [{ cancelled: true }, { cancelled: true }],
              errorByList: [],
              errorDataByList: [],
              fulfilledByList: [],
              fulfilledDataByList: [],
              pendingByList: [],
              dataByList: [{ cancelled: true }, { cancelled: true }],
              responsesByList: [{ cancelled: true }, { cancelled: true }]
            }
          )
      });

      responses.errorError = hook(() => {}, {
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              cancelledByList: [],
              cancelledDataByList: [],
              errorByList: [{ error: true }, { error: true }],
              errorDataByList: [{ error: true }, { error: true }],
              fulfilledByList: [],
              fulfilledDataByList: [],
              pendingByList: [],
              dataByList: [{ error: true }, { error: true }],
              responsesByList: [{ error: true }, { error: true }]
            }
          )
      });

      responses.errorCancelled = hook(() => {}, {
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              cancelledByList: [{ cancelled: true }],
              cancelledDataByList: [{ cancelled: true }],
              errorByList: [{ error: true }],
              errorDataByList: [{ error: true }],
              fulfilledByList: [],
              fulfilledDataByList: [],
              pendingByList: [],
              dataByList: [{ error: true }, { cancelled: true }],
              responsesByList: [{ error: true }, { cancelled: true }]
            }
          )
      });

      responses.pendingError = hook(() => {}, {
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              cancelledByList: [],
              cancelledDataByList: [],
              errorByList: [{ error: true }],
              errorDataByList: [{ error: true }],
              fulfilledByList: [],
              fulfilledDataByList: [],
              pendingByList: [{ pending: true }],
              dataByList: [{ pending: true }, { error: true }],
              responsesByList: [{ pending: true }, { error: true }]
            }
          )
      });

      responses.pendingCancelled = hook(() => {}, {
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              cancelledByList: [{ cancelled: true }],
              cancelledDataByList: [{ cancelled: true }],
              errorByList: [],
              errorDataByList: [],
              fulfilledByList: [],
              fulfilledDataByList: [],
              pendingByList: [{ pending: true }],
              dataByList: [{ pending: true }, { cancelled: true }],
              responsesByList: [{ pending: true }, { cancelled: true }]
            }
          )
      });

      responses.pendingPending = hook(() => {}, {
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              cancelledByList: [],
              cancelledDataByList: [],
              errorByList: [],
              errorDataByList: [],
              fulfilledByList: [],
              fulfilledDataByList: [],
              pendingByList: [{ pending: true }],
              dataByList: [{ pending: true }],
              responsesByList: [{ pending: true }]
            }
          )
      });

      responses.fulfilledError = hook(() => {}, {
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              cancelledByList: [],
              cancelledDataByList: [],
              errorByList: [{ error: true }],
              errorDataByList: [{ error: true }],
              fulfilledByList: [{ fulfilled: true }],
              fulfilledDataByList: [{ fulfilled: true }],
              pendingByList: [],
              dataByList: [{ fulfilled: true }, { error: true }],
              responsesByList: [{ fulfilled: true }, { error: true }]
            }
          )
      });

      responses.fulfilledCancelled = hook(() => {}, {
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              cancelledByList: [{ cancelled: true }],
              cancelledDataByList: [{ cancelled: true }],
              errorByList: [],
              errorDataByList: [],
              fulfilledByList: [{ fulfilled: true }],
              fulfilledDataByList: [{ fulfilled: true }],
              pendingByList: [],
              dataByList: [{ fulfilled: true }, { cancelled: true }],
              responsesByList: [{ fulfilled: true }, { cancelled: true }]
            }
          )
      });

      responses.fulfilledPending = hook(() => {}, {
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              cancelledByList: [],
              cancelledDataByList: [],
              errorByList: [],
              errorDataByList: [],
              fulfilledByList: [{ fulfilled: true }],
              fulfilledDataByList: [{ fulfilled: true }],
              pendingByList: [{ pending: true }],
              dataByList: [{ fulfilled: true }, { pending: true }],
              responsesByList: [{ fulfilled: true }, { pending: true }]
            }
          )
      });

      responses.fulfilledFulfilled = hook(() => {}, {
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              cancelledByList: [],
              cancelledDataByList: [],
              errorByList: [],
              errorDataByList: [],
              fulfilledByList: [{ fulfilled: true }, { fulfilled: true }],
              fulfilledDataByList: [{ fulfilled: true }, { fulfilled: true }],
              pendingByList: [],
              dataByList: [{ fulfilled: true }, { fulfilled: true }],
              responsesByList: [{ fulfilled: true }, { fulfilled: true }]
            }
          )
      });

      responses.fulfilledFulfilledById = hook(() => {}, {
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              cancelledByList: [],
              cancelledDataByList: [],
              errorByList: [],
              errorDataByList: [],
              fulfilledByList: [
                { id: 'lorem', fulfilled: true },
                { id: 'ipsum', fulfilled: true }
              ],
              fulfilledDataByList: [
                { id: 'lorem', fulfilled: true },
                { id: 'ipsum', fulfilled: true }
              ],
              pendingByList: [],
              dataByList: [
                { id: 'lorem', fulfilled: true },
                { id: 'ipsum', fulfilled: true }
              ],
              responsesByList: [
                { id: 'lorem', fulfilled: true },
                { id: 'ipsum', fulfilled: true }
              ]
            }
          )
      });

      return responses;
    };

    expect(generatedSelectorResponses(reactReduxHooks.useSelectorsAllSettledResponse)).toMatchSnapshot(
      'aggregated calls, useSelectorsAllSettledResponse'
    );

    expect(generatedSelectorResponses(reactReduxHooks.useSelectorsAnyResponse)).toMatchSnapshot(
      'aggregated calls, useSelectorsAnyResponse'
    );

    expect(generatedSelectorResponses(reactReduxHooks.useSelectorsRaceResponse)).toMatchSnapshot(
      'aggregated calls, useSelectorsRaceResponse'
    );
  });
});
