import React, { useContext, useEffect, useState } from 'react';
import { usePerfil } from '../../context/PerfilContext';
import RangoFechas from "../configuracion/RangoFechas";
import { Sun, Moon, GearFill } from 'react-bootstrap-icons';
import { ThemeContext } from '../../theme/ThemeProvider';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const Configuracion = () => {
  const { showPerfil, cerrarPerfil } = usePerfil();
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

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

  const handleLogoutClick = async () => {
    await handleLogout();  
    navigate('/login'); 
  };

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
            <div className="d-flex gap-2 mb-3">
              <button className="btn btn-sidebar" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun color="gold" size={16} /> : <Moon color="silver" size={16} />}
              </button>
              <button className="btn btn-sidebar" onClick={handleLogoutClick}>
                <GearFill color="green" size={20} />
              </button>
            </div>
            <RangoFechas />
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
