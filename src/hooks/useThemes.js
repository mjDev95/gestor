// useTheme.js
import { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocalStorage } from './useLocalStorage';

export const useTheme = () => {
  const systemPrefersDark = useMediaQuery({ query: '(prefers-color-scheme: dark)' });
  const [theme, setTheme] = useLocalStorage('theme', systemPrefersDark ? 'dark' : 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme };
};
