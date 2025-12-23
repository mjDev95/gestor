import React, { useLayoutEffect, useRef } from 'react';
import { animateSidebarIndicator, createMobileSidebarTimeline, showMobileSidebar, hideMobileSidebar, microScaleButtonIn } from '../../utils/gsapAnimations';
import { Plus, GearFill, GridFill, CreditCardFill, ArrowDownUp } from 'react-bootstrap-icons';
import { usePerfil } from '../../context/PerfilContext'; 
import { useDashboard } from '../../context/dashboardContext';
import { useModal } from "../../context/ModalContext";
import { useGlobalState } from "../../context/GlobalState";
import './SideBar.scss';

const SideBar = ({ variant = "desktop" }) => {
  const { abrirPerfil } = usePerfil();
  const { activeSection, setActiveSection } = useDashboard();
  const { openModal } = useModal();
  const { handleSaveExpense, user } = useGlobalState();
  const sidebarRef = useRef(null);
  const visibleRef = useRef(true);
  const indicatorRef = useRef(null);
  const buttonsRefs = useRef({});
  const addBtnRef = useRef(null);
  const tlRef = useRef(null);

  useLayoutEffect(() => {
    if (variant !== "mobile") return;

    requestAnimationFrame(() => {
      const activeButton = buttonsRefs.current[activeSection];

      if (activeButton && indicatorRef.current) {
        animateSidebarIndicator(indicatorRef.current, activeButton);
      }
    });
  }, [activeSection, variant]);

  useLayoutEffect(() => {
    if (variant !== "mobile" || !sidebarRef.current) return;

    const sidebarEl = sidebarRef.current;
    const addBtnEl = addBtnRef.current;

    // Timeline compartida: sidebar + botón agregar
    tlRef.current = createMobileSidebarTimeline(sidebarEl, addBtnEl);

    const onDashboardScroll = (e) => {
      const { scrollingDown, isBottom, scrollTop } = e.detail || {};

      const nearBottom = scrollTop > 300;
      const shouldShow = !scrollingDown;

      if (shouldShow === visibleRef.current) return;
      visibleRef.current = shouldShow;

      if (shouldShow) {
        showMobileSidebar(tlRef.current);

        // Micro-scale del botón al reaparecer (sin translate)
        if (nearBottom && addBtnEl) {
          microScaleButtonIn(addBtnEl);
        }
      } else {
        hideMobileSidebar(tlRef.current);
      }

      console.log("📦 sidebar:", shouldShow ? "SHOW" : "HIDE", {
        scrollTop,
        isBottom,
        scrollingDown,
      });
    };

    window.addEventListener("dashboard-scroll", onDashboardScroll);

    return () => {
      window.removeEventListener("dashboard-scroll", onDashboardScroll);
    };
  }, [variant]);

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
    <div
      ref={sidebarRef}
      className={`col-sidebar ${
        variant === "desktop"
          ? "d-none d-md-flex flex-md-column justify-content-between align-items-center sidebar-desktop"
          : "d-flex d-md-none flex-row justify-content-around align-items-center fixed-bottom sidebar-mobile w-100"
      }`}
    >
      <ul className={`nav w-100 position-relative ${ variant === "desktop" ? "flex-row flex-md-column justify-content-between" : "nav-justified align-items-center position-relative" }`}>
        {renderButton("inicio", GridFill, "Inicio")}
        {renderButton("tarjetas", CreditCardFill, "Tarjetas")}
        {renderButton("transacciones", ArrowDownUp, "Movimientos")}
        {renderButton("perfil", GearFill, "Perfil", abrirPerfil)}

        {variant === "mobile" && (
          <div ref={indicatorRef} className="tabs-indicator position-absolute bottom-0" />
        )}
      </ul>
      <button
        ref={addBtnRef}
        className="btn btn-primary shadow-sm fixed-bottom start-100 m-3 end-0 btn-sidebar add"
        onClick={() => openModal("transaccion", { handleSaveExpense, user })}
      >
        <Plus color="green" size={20} />
      </button>
    </div>
  );
};

export default SideBar;
