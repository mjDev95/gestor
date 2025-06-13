import React from 'react';
import './SaludoUsuario.scss';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const SaludoUsuario = () => {
    const [userInfo] = useLocalStorage('userInfo', null);
  
    if (!userInfo) return null;
    const firstName = userInfo.displayName.split(' ')[0];

    return (
      <div className="saludo-usuario mt-5 mb-3">
        <h2 className="saludo-text">Hola, {firstName}</h2>
      </div>
    );
  };
  
  export default SaludoUsuario;