import React from 'react';
import { windowHooks, useResizeObserver, useTimeout } from '../useWindow';

describe('useWindow', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('should return specific properties', () => {
    expect(windowHooks).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for useResizeObserver', async () => {
    const mockSetState = jest.fn();
    const mockObserve = jest.fn();
    const mockUnobserve = jest.fn();
    const spy = jest.spyOn(React, 'useState').mockImplementation(value => [value, mockSetState]);

    window.ResizeObserver = jest.fn().mockImplementation(handler => {
      handler(); // call handler, confirm it exists, uses "mockSetState"

      return {
        observe: mockObserve,
        unobserve: mockUnobserve
      };
    });

    const mockTarget = {
      current: {}
    };

    jest.useFakeTimers();
    const { unmount, result } = await renderHook(() => useResizeObserver(mockTarget));
    jest.runAllTimers();

    expect(result).toMatchSnapshot('width, height');
    expect(mockObserve).toHaveBeenCalledTimes(1);
    expect(mockSetState).toHaveBeenCalledTimes(1);

    await unmount();
    expect(mockUnobserve).toHaveBeenCalledTimes(1);

    spy.mockClear();
  });

  it('should apply a hook for useTimeout', async () => {
    const mockCallback = jest.fn();
    const mockSetTimeout = jest.spyOn(global, 'setTimeout');
    const { result } = await renderHook(() => useTimeout(mockCallback));

    expect(mockSetTimeout).toHaveBeenCalledTimes(2);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(result).toMatchSnapshot('timeout');
  });
});
