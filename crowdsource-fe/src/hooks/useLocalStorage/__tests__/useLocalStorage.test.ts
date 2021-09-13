import { renderHook, act } from 'utils/testUtils';

import useLocalStorage from '../useLocalStorage';

describe('#useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const setup = () => {
    const localStorageKey = 'localStorageKey';

    const renderHookResult = renderHook(() => useLocalStorage(localStorageKey));

    return {
      renderHookResult,
      localStorageKey,
    };
  };

  it('should set blank values when called initially', () => {
    const { renderHookResult } = setup();

    expect(renderHookResult.result.current[0]).toBe(null);
    expect(localStorage.setItem).not.toHaveBeenCalledTimes(1);
  });

  it('should set updated value', () => {
    const value = 'value';
    const { renderHookResult, localStorageKey } = setup();

    act(() => {
      renderHookResult.result.current[1](value);
    });

    expect(renderHookResult.result.current[0]).toBe(value);
    expect(localStorage.setItem).toHaveBeenCalledWith(localStorageKey, JSON.stringify(value));
  });

  it('should remove set value', () => {
    const value = 'value';
    const { renderHookResult, localStorageKey } = setup();

    act(() => {
      renderHookResult.result.current[1](value);
    });

    expect(renderHookResult.result.current[0]).toBe(value);
    expect(localStorage.setItem).toHaveBeenCalledWith(localStorageKey, JSON.stringify(value));

    act(() => {
      renderHookResult.result.current[2]();
    });

    expect(renderHookResult.result.current[0]).toBe(null);
    expect(localStorage.removeItem).toHaveBeenCalledWith(localStorageKey);
  });
});
