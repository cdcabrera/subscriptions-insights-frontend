import React from 'react';
import {
  ToolbarFieldExport,
  toolbarFieldOptions,
  useExport,
  useExportStatus,
  useOnSelect
} from '../toolbarFieldExport';
import { store } from '../../../redux/store';
import { PLATFORM_API_EXPORT_STATUS_TYPES } from '../../../services/platform/platformConstants';

describe('ToolbarFieldExport Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      useExport: () => jest.fn()
    };
    const component = await shallowComponent(<ToolbarFieldExport {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should export select options', () => {
    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle updating export through redux state with component', () => {
    const props = {
      useOnSelect: () => jest.fn(),
      useExport: () => ({ checkAllExports: jest.fn() })
    };

    const component = renderComponent(<ToolbarFieldExport {...props} />);
    const input = component.find('button');
    component.fireEvent.click(input);

    const inputMenuItem = component.find('a.pf-v5-c-dropdown__menu-item');
    component.fireEvent.click(inputMenuItem);

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, component');
  });

  it('should handle updating export through redux state with hook', () => {
    const options = {
      useExport: () => ({ createExport: jest.fn() }),
      useProduct: () => ({ viewId: 'loremIpsum' }),
      useProductExportQuery: () => ({})
    };

    const onSelect = useOnSelect(options);

    onSelect({
      value: 'dolor sit'
    });
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, hook');
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

  it('should aggregate export service calls', async () => {
    // confirm attempt at creating an export
    const mockServiceCreateExport = jest.fn().mockImplementation(
      (...args) =>
        dispatch =>
          dispatch(...args)
    );
    const {
      result: { createExport },
      unmount: unmountCreate
    } = await renderHook(() =>
      useExport({
        createExport: mockServiceCreateExport
      })
    );
    createExport('mock-product-id', { data: { lorem: 'ipsum' } });
    await unmountCreate();
    expect(mockServiceCreateExport).toHaveBeenCalledTimes(1);
    expect(mockServiceCreateExport.mock.calls).toMatchSnapshot('createExport');

    // confirm attempt at getting an existing export status
    const mockServiceGetExistingExportsStatus = jest.fn().mockImplementation(
      (...args) =>
        dispatch =>
          dispatch(...args)
    );
    const {
      result: { checkAllExports },
      unmount: unmountStatus
    } = await renderHook(() =>
      useExport({
        getExistingExportsStatus: mockServiceGetExistingExportsStatus
      })
    );
    checkAllExports();
    await unmountStatus();
    expect(mockServiceGetExistingExportsStatus).toHaveBeenCalledTimes(1);
  });
});
