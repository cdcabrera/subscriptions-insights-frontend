import { windowHooks, useResizeObserver } from '../useWindow';

describe('useWindow', () => {
  it('should return specific properties', () => {
    expect(windowHooks).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for useResizeObserver', async () => {
    const observe = jest.fn();
    const unobserve = jest.fn();

    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe,
      unobserve
    }));

    const mockTarget = {
      current: {}
    };

    const { unmount, result } = await mountHook(() => useResizeObserver(mockTarget));
    expect(result).toMatchSnapshot('width, height');
    expect(observe).toHaveBeenCalledTimes(1);

    await unmount();
    expect(unobserve).toHaveBeenCalledTimes(1);
  });
});
