import { useState, useEffect, useCallback } from 'react';

interface UseLocalStorageOptions<T> {
  defaultValue?: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

export function useLocalStorage<T>(
  key: string,
  options: UseLocalStorageOptions<T> = {}
) {
  const {
    defaultValue,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  } = options;

  // Получаем начальное значение из localStorage
  const getStoredValue = useCallback((): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? deserialize(item) : defaultValue!;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue!;
    }
  }, [key, defaultValue, deserialize]);

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // Обновляем значение в localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        
        if (valueToStore === undefined || valueToStore === null) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, serialize(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, serialize, storedValue]
  );

  // Удаляем значение из localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(defaultValue!);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  // Синхронизация между вкладками
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== event.oldValue) {
        try {
          const newValue = event.newValue ? deserialize(event.newValue) : defaultValue!;
          setStoredValue(newValue);
        } catch (error) {
          console.warn(`Error syncing localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, defaultValue, deserialize]);

  // Загружаем начальное значение
  useEffect(() => {
    setStoredValue(getStoredValue());
  }, [getStoredValue]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    clear: removeValue,
  };
}

// Специализированные хуки для часто используемых данных

export function useAuthToken() {
  return useLocalStorage<string>('testops_token', { defaultValue: '' });
}

export function useUserPreferences() {
  return useLocalStorage<Record<string, any>>('testops_preferences', {
    defaultValue: {
      theme: 'system',
      language: 'ru',
      notifications: true,
      autoSave: true,
    },
  });
}

export function useRecentProjects() {
  return useLocalStorage<Array<{ id: string; name: string; lastAccessed: string }>>(
    'testops_recent_projects',
    { defaultValue: [] }
  );
}

export function useCodeTemplates() {
  return useLocalStorage<Record<string, string>>('testops_code_templates', {
    defaultValue: {
      'ui-test-basic': `import allure
import pytest

@allure.feature("feature-name")
class TestBasicUI:
    @allure.title("Basic UI test")
    def test_basic_ui(self):
        with allure.step("Step 1"):
            assert True`,
      'api-test-basic': `import allure
import pytest
import requests

@allure.feature("api-feature")
class TestBasicAPI:
    @allure.title("Basic API test")
    def test_basic_api(self):
        response = requests.get("https://api.example.com")
        assert response.status_code == 200`,
    },
  });
}