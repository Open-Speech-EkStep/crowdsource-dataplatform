import { renderHook, act } from 'utils/testUtils';

import useLocalStorage from '../useLocalStorage';

describe('#useLocalStorage', () => {
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
    expect(localStorage.setItem).toHaveBeenCalledWith(localStorageKey, value);
  });

  it('should set complex updated value', () => {
    const value = [{ a: 1 }];
    const { renderHookResult, localStorageKey } = setup();

    act(() => {
      renderHookResult.result.current[1](value);
    });

    expect(renderHookResult.result.current[0]).toBe(value);
    expect(localStorage.setItem).toHaveBeenCalledWith(localStorageKey, '[{"a":1}]');
  });

  it('should update value when "storage" event is dispatched with correct key', () => {
    const value = 'value';
    const { renderHookResult, localStorageKey } = setup();

    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: localStorageKey,
        newValue: value,
      });

      window.dispatchEvent(storageEvent);
    });

    expect(renderHookResult.result.current[0]).toBe(value);
  });

  it('should not update value when "storage" event is dispatched with different key', () => {
    const value = 'value';
    const { renderHookResult } = setup();

    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: 'different',
        newValue: value,
      });

      window.dispatchEvent(storageEvent);
    });

    expect(renderHookResult.result.current[0]).toBe(null);
  });

  it('should remove set value', () => {
    const value = 'value';
    const { renderHookResult, localStorageKey } = setup();

    act(() => {
      renderHookResult.result.current[1](value);
    });

    expect(renderHookResult.result.current[0]).toBe(value);
    expect(localStorage.setItem).toHaveBeenCalledWith(localStorageKey, value);

    act(() => {
      renderHookResult.result.current[2]();
    });

    expect(renderHookResult.result.current[0]).toBe(null);
    expect(localStorage.removeItem).toHaveBeenCalledWith(localStorageKey);
  });
});
