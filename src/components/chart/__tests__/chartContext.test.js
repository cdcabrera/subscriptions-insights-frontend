import { context, useToggleData } from '../chartContext';

describe('ChartContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for toggling chart layers', async () => {
    const mockDataSetsToggle = {};

    const mockSetDataSetsToggle = callback => {
      Object.assign(mockDataSetsToggle, callback(mockDataSetsToggle));
    };
    const mockUseChartContext = () => ({
      dataSetsToggle: [mockDataSetsToggle, mockSetDataSetsToggle]
    });

    const hook = await shallowHook(() => useToggleData({ useChartContext: mockUseChartContext }));

    hook.onToggle('lorem');
    hook.onToggle('lorem');
    hook.onRevert();
    hook.onToggle('ipsum');
    hook.onHide('lorem');
    hook.onToggle('ipsum');

    expect(mockDataSetsToggle).toMatchSnapshot('toggle data');
  });
});
