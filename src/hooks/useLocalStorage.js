// useLocalStorage.js
import { useState, useEffect } from 'react';

export const useLocalStorage = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    const savedState = window.localStorage.getItem(key);
    return savedState !== null ? savedState : defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, state);
  }, [key, state]);

  return [state, setState];
};
