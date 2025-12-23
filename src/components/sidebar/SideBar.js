import React, { useLayoutEffect, useRef } from 'react';
import { animateSidebarIndicator } from '../../utils/gsapAnimations';
import { GearFill, GridFill, CreditCardFill, ArrowDownUp } from 'react-bootstrap-icons';
import { usePerfil } from '../../context/PerfilContext'; 
import { useDashboard } from '../../context/dashboardContext';
import './SideBar.scss';

const SideBar = ({ variant = "desktop" }) => {
  const { abrirPerfil } = usePerfil();
  const { activeSection, setActiveSection } = useDashboard();

  const indicatorRef = useRef(null);
  const buttonsRefs = useRef({});

  useLayoutEffect(() => {
    if (variant !== "mobile") return;

    requestAnimationFrame(() => {
      const activeButton = buttonsRefs.current[activeSection];

      if (activeButton && indicatorRef.current) {
        animateSidebarIndicator(indicatorRef.current, activeButton);
      }
    });
  }, [activeSection, variant]);

  const renderButton = (section, Icon, label, onClick) => (
    <li
      ref={(el) => (buttonsRefs.current[section] = el)}
      className={`nav-item text-center ${activeSection === section ? "active" : ""}`}
      onClick={onClick || (() => setActiveSection(section))}
    >
      <button data-section={section} className={`btn btn-sidebar ${variant === "mobile" ? "w-100 p-0" : ""} mx-auto my-0 my-lg-3 mx-lg-3 ${activeSection === section ? "active" : ""}`} >
        <div className="d-flex flex-column align-items-center d-md-block">
          <Icon size={20} />
          {variant === "mobile" && <span className="mt-1 small">{label}</span>}
        </div>
      </button>
    </li>
  );

  return (
    <div className={`col-sidebar ${ variant === "desktop" ? "d-none d-md-flex flex-md-column justify-content-between align-items-center sidebar-desktop" : "d-flex d-md-none flex-row justify-content-around align-items-center fixed-bottom sidebar-mobile w-100" }`}>
      <ul className={`nav w-100 position-relative ${ variant === "desktop" ? "flex-row flex-md-column justify-content-between" : "nav-justified align-items-center position-relative" }`}>
        {renderButton("inicio", GridFill, "Inicio")}
        {renderButton("tarjetas", CreditCardFill, "Tarjetas")}
        {renderButton("transacciones", ArrowDownUp, "Movimientos")}
        {renderButton("perfil", GearFill, "Perfil", abrirPerfil)}

        {variant === "mobile" && (
          <div ref={indicatorRef} className="tabs-indicator position-absolute bottom-0" />
        )}
      </ul>
    </div>
  );
};

export default SideBar;
