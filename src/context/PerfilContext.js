import React, { createContext, useContext, useState } from 'react';

const PerfilContext = createContext();

export const usePerfil = () => useContext(PerfilContext);

export const PerfilProvider = ({ children }) => {
  const [showPerfil, setShowPerfil] = useState(false);

  const abrirPerfil = () => setShowPerfil(true);
  const cerrarPerfil = () => setShowPerfil(false);

  return (
    <PerfilContext.Provider value={{ showPerfil, abrirPerfil, cerrarPerfil }}>
      {children}
    </PerfilContext.Provider>
  );
};
