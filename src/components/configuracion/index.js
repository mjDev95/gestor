import React, { useEffect, useState } from 'react';
import { usePerfil } from '../../context/PerfilContext';
import RangoFechas from "../configuracion/RangoFechas";

const Configuracion = () => {
  const { showPerfil, cerrarPerfil } = usePerfil();
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);

    // Montaje controlado
  useEffect(() => {
    if (showPerfil) {
      setIsVisible(true);
      setTimeout(() => {
        setIsActive(true);
      }, 10);  
    } else {
      setIsActive(false);
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 850); // igual que duración del CSS

      return () => clearTimeout(timeout);
    }
  }, [showPerfil]);

  if (!isVisible) return null;

  return (
    <div className="app-lateral-container">
      <div className="modal-overlay position-absolute top-0 start-0 w-100 h-100" onClick={cerrarPerfil} ></div>

      <div className={`app-lateral p-5 ${isActive ? 'active' : ''}`}>
        <div className="fixed-nav-rounded-div">
          <div className={`content-rounded ${isActive ? 'active' : ''}`}>
            <div className="div-rounded"></div>
          </div>
        </div>

        <div className="info-fixed">
          <button className="d-flex btn-close ms-auto me-0" onClick={cerrarPerfil}></button>
          <h2 className="fw-bold">⚙️ Configuración</h2>
          <div className="config-sections">
            <RangoFechas />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
