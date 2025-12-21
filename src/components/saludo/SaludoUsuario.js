import React from 'react';
import { motion } from "framer-motion";
import './SaludoUsuario.scss';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useDashboard } from "../../context/dashboardContext";

const SaludoUsuario = () => {
    const [userInfo] = useLocalStorage('userInfo', null);
    const { activeSection } = useDashboard();
    const isVisible = activeSection === "inicio";
  
    if (!userInfo) return null;
    const firstName = userInfo.displayName.split(' ')[0];

    return (
          <div className={`${isVisible ? "d-block" : "d-none"}`}>
            <div className="saludo-usuario mt-5 mb-3">
              <h2 className="saludo-text">Hola, {firstName}</h2>
            </div>
          </div>
    );
};
  
  export default SaludoUsuario;