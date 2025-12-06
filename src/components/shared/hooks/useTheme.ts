import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTheme, setTheme } from '@store/slices/uiSlice';

export function useTheme() {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const [isSystemDark, setIsSystemDark] = useState(false);

  // Определяем системную тему
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsSystemDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsSystemDark(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Применяем тему при изменении
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'light') {
      const effectiveTheme = isSystemDark ? 'dark' : 'light';
      root.setAttribute('data-theme', effectiveTheme);
    } else {
      root.setAttribute('data-theme', theme);
    }

    // Сохраняем тему в localStorage
    localStorage.setItem('testops_theme', theme);
  }, [theme, isSystemDark]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
  };

  const setSystemTheme = () => {
    dispatch(setTheme('light'));
  };

  const setLightTheme = () => {
    dispatch(setTheme('light'));
  };

  const setDarkTheme = () => {
    dispatch(setTheme('dark'));
  };

  const getEffectiveTheme = () => {
    if (theme === 'light') {
      return isSystemDark ? 'dark' : 'light';
    }
    return theme;
  };

  return {
    theme,
    effectiveTheme: getEffectiveTheme(),
    isDark: getEffectiveTheme() === 'dark',
    isLight: getEffectiveTheme() === 'light',
    isSystem: theme === 'light',
    toggleTheme,
    setSystemTheme,
    setLightTheme,
    setDarkTheme,
  };
}