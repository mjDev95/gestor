import React, { useEffect } from 'react';
import { usePerfil } from '../../context/PerfilContext';

import PerfilSueldoSection from './PerfilSueldoSection';
import PerfilInfoBasica from './PerfilInfoBasica';
import PreferenciasUsuario from './PreferenciasUsuario';

const PerfilPanel = () => {
  const { showPerfil, cerrarPerfil } = usePerfil();

  return (
    <div className={`app-lateral p-5 ${showPerfil ? 'active' : ''}`}>
      <div className="fixed-nav-rounded-div">
        <div className="content-rounded">
          <div className="div-rounded"></div>
        </div>
      </div>
      <div className="info-fixed">
        <button className="d-flex btn-close ms-auto me-0" onClick={cerrarPerfil}></button>

        <div className="info-fixed-header">
          <h3>Perfil</h3>
        </div>
        <div className="info-fixed-body">
          <PreferenciasUsuario />
        </div>
      </div>
    </div>
  );
};

export default PerfilPanel;
