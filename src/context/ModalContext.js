import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  // Estado para el modal global
  // tipo: 'transaccion', 'tarjeta', etc.
  // props: props adicionales para el contenido del modal
  const [modal, setModal] = useState({ open: false, tipo: null, props: {} });

  // Función para abrir el modal con un tipo y props opcionales
  const openModal = (tipo, props = {}) => setModal({ open: true, tipo, props });

  // Función para cerrar el modal
  const closeModal = () => setModal({ open: false, tipo: null, props: {} });

  return (
    <ModalContext.Provider value={{
      modal,
      openModal,
      closeModal,
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);