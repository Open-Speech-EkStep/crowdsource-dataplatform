import { useState, useEffect, useCallback } from 'react';

const eventListenerName = 'storage';
const customEventListenerName = 'onLocalStorageChange';

const parseJSON = <T>(stringifiedJSON: string | null, fallbackValue: T) => {
  try {
    if (!stringifiedJSON) {
      return fallbackValue;
    }

    return JSON.parse(stringifiedJSON);
  } catch (e) {
    return stringifiedJSON;
  }
};

const removeItemFromLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

const addItemToLocalStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
};

const getItemFromLocalStorage = <T>(key: string, fallbackValue: T) =>
  parseJSON<T>(localStorage.getItem(key), fallbackValue);

const useLocalStorage = <T = {}>(key: string, initialValue: T | null = null) => {
  const [storedItem, setStoredItem] = useState(initialValue);

  useEffect(() => {
    setStoredItem(getItemFromLocalStorage(key, initialValue));
  }, [initialValue, key]);

  useEffect(() => {
    const storageListener = ({ key: storageKey, newValue }: StorageEvent) => {
      if (storageKey === key) {
        setStoredItem(parseJSON(newValue, initialValue));
      }
    };

    window.addEventListener(eventListenerName, storageListener);

    return () => {
      window.removeEventListener(eventListenerName, storageListener);
    };
  }, [initialValue, key]);

  useEffect(() => {
    const storageListener = ({ detail }: CustomEventInit) => {
      console.log('local', detail.key, key);
      if (detail.key === key) {
        setStoredItem(detail.item);
      }
    };

    window.addEventListener(customEventListenerName, storageListener);

    return () => {
      window.removeEventListener(customEventListenerName, storageListener);
    };
  }, [initialValue, key]);

  const setItem = useCallback(
    (item: T) => {
      addItemToLocalStorage(key, item);

      window.dispatchEvent(new CustomEvent(customEventListenerName, { detail: { key, item } }));
    },
    [key]
  );

  const removeItem = useCallback(() => {
    removeItemFromLocalStorage(key);

    window.dispatchEvent(
      new CustomEvent(customEventListenerName, {
        detail: { key, item: initialValue },
      })
    );
  }, [key, initialValue]);

  return [storedItem, setItem, removeItem] as const;
};

export default useLocalStorage;
