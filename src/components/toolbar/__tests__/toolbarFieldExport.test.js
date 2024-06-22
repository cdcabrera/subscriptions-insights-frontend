import React from 'react';
import {
  ToolbarFieldExport,
  toolbarFieldOptions,
  useExistingExports,
  useExport,
  useExportStatus,
  useOnSelect
} from '../toolbarFieldExport';
import { store } from '../../../redux/store';
import { PLATFORM_API_EXPORT_STATUS_TYPES } from '../../../services/platform/platformConstants';

describe('ToolbarFieldExport Component', () => {
  let mockDispatch;
  let mockService;

  beforeEach(() => {
    mockDispatch = jest
      .spyOn(store, 'dispatch')
      .mockImplementation(
        type =>
          (Array.isArray(type) && type.map(value => (typeof value === 'function' && value.toString()) || value)) || type
      );

    mockService = jest.fn().mockImplementation(
      (...args) =>
        dispatch =>
          dispatch(...args)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      useExistingExports: () => jest.fn()
    };
    const component = await shallowComponent(<ToolbarFieldExport {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should export select options', () => {
    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle updating export through redux action with component', () => {
    const mockOnSelect = jest.fn();
    const props = {
      useOnSelect: () => mockOnSelect,
      useExistingExports: () => jest.fn()
    };

    const component = renderComponent(<ToolbarFieldExport {...props} />);
    const input = component.find('button');
    component.fireEvent.click(input);

    const inputMenuItem = component.find('a.pf-v5-c-dropdown__menu-item');
    component.fireEvent.click(inputMenuItem);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it('should handle updating export through redux action with hook', () => {
    const mockExport = jest.fn();
    const options = {
      useExport: () => mockExport,
      useProduct: () => ({ viewId: 'loremIpsum' }),
      useProductExportQuery: () => ({})
    };

    const onSelect = useOnSelect(options);

    onSelect({
      value: 'dolor sit'
    });
    expect(mockExport.mock.calls).toMatchSnapshot('dispatch, hook');
  });

  it('should aggregate export status, polling status with a hook', async () => {
    const { result: basic, unmount: unmountBasic } = await renderHook(() =>
      useExportStatus({
        useProduct: () => ({
          productId: 'loremIpsum'
        })
      })
    );
    await unmountBasic();
    expect(basic).toMatchSnapshot('status, basic');

    const { result: polling, unmount: unmountPolling } = await renderHook(() =>
      useExportStatus({
        useProduct: () => ({
          productId: 'loremIpsum'
        }),
        useSelector: () => ({
          isPending: true,
          pending: [
            {
              status: PLATFORM_API_EXPORT_STATUS_TYPES.PENDING,
              format: 'dolorSit'
            }
          ]
        })
      })
    );
    await unmountPolling();
    expect(polling).toMatchSnapshot('status, polling');

    const { result: completed, unmount: unmountCompleted } = await renderHook(() =>
      useExportStatus({
        useProduct: () => ({
          productId: 'loremIpsum'
        }),
        useSelector: () => ({
          isPending: false,
          pending: []
        })
      })
    );
    await unmountCompleted();
    expect(completed).toMatchSnapshot('status, completed');
  });

  it('should allow export service calls', async () => {
    const { result: createExport, unmount } = await renderHook(() => useExport({ createExport: mockService }));
    createExport('mock-product-id', { data: { lorem: 'ipsum' } });

    await unmount();
    expect(mockService).toHaveBeenCalledTimes(1);
    expect(mockDispatch.mock.results).toMatchSnapshot('createExport');
  });

  it('should allow export service calls on existing exports', async () => {
    const { unmount } = await renderHook((...args) => {
      useExistingExports({
        getExistingExports: mockService,
        getExistingExportsStatus: mockService,
        deleteExistingExports: mockService,
        useSelectorsResponse: () => ({
          data: [{ data: { isAnythingPending: true, pending: [{ lorem: 'ipsum' }] } }],
          fulfilled: true
        }),
        ...args?.[0]
      });
    });

    await unmount();
    expect(mockDispatch.mock.results).toMatchSnapshot('existingExports');
  });
});
