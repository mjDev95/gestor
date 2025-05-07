import React, { createContext, useContext, useState } from 'react';

const MonthContext = createContext();

const obtenerMesActual = () => {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // '05'
  const anio = hoy.getFullYear(); // '2025'
  return `${anio}-${mes}`; // '2025-05'
};

export const MonthProvider = ({ children }) => {
  const [mesSeleccionado, setMesSeleccionado] = useState(obtenerMesActual());
  const cambiarMes = (nuevoMes) => {
    setMesSeleccionado(nuevoMes);
  };

  return (
    <MonthContext.Provider value={{ mesSeleccionado, cambiarMes }}>
      {children}
    </MonthContext.Provider>
  );
};

export const useMonth = () => useContext(MonthContext);
