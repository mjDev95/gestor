import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);  // Inicializamos en `null` para esperar el efecto de carga
  const [isLoaded, setIsLoaded] = useState(false); // Para controlar cuando se haya cargado el tema

  // Efecto para leer el tema desde localStorage o las preferencias del sistema
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);  // Si hay un tema guardado, lo usamos
    } else {
      // Si no hay tema guardado, lo detectamos de las preferencias del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Efecto para aplicar el tema al documento y guardar el tema en localStorage
  useEffect(() => {
    if (theme) {  // Asegurarse de que el tema no sea null antes de aplicarlo
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }

      // Guardamos el tema en localStorage
      localStorage.setItem('theme', theme);

      // Marcar como cargado
      setIsLoaded(true);
    }
  }, [theme]);

  // Función para cambiar el tema
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  if (!isLoaded) {
    return null; // O muestra un componente de carga mientras se determina el tema
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
