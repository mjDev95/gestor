import React, { useEffect, useRef, useCallback } from "react";
import SideBar from '../../components/sidebar/SideBar';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { usePerfil } from '../../context/PerfilContext';
import { useMonth } from '../../context/monthContext';
import { useDashboard } from "../../context/dashboardContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showPerfil } = usePerfil();
  const { activeSection } = useDashboard();
  const { mesSeleccionado } = useMonth();
  const containerRef = useRef(null);
  const lastScrollTop = useRef(0);

  const handleLogoutClick = useCallback(async () => {
    await logout();
    navigate('/');
  }, [logout, navigate]);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const scrollTop = el.scrollTop;
    const scrollHeight = el.scrollHeight;
    const clientHeight = el.clientHeight;

    const scrollingDown = scrollTop > lastScrollTop.current;
    const isBottom = scrollTop + clientHeight >= scrollHeight - 5;

    lastScrollTop.current = scrollTop;

    window.dispatchEvent(
      new CustomEvent("dashboard-scroll", {
        detail: {
          scrollingDown,
          isBottom,
          scrollTop,
        },
      })
    );
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    try {
      el.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch (e) {
      el.scrollTop = 0;
    }
  }, [activeSection]);

  return (
    <>
      <div className={`d-flex flex-column flex-md-row gap-1 dashboard-container dvh-100 app ${showPerfil ? 'active' : ''}`}>
        <SideBar handleLogout={handleLogoutClick} user={user} variant="desktop" />
        <div
          ref={containerRef}
          className="content-dash overflow-y-scroll h-100 overflow-x-hidden d-flex flex-column flex-md-fill order-0 order-md-1"
          onScroll={handleScroll}
        >
          <Outlet />
        </div>
      </div>
      <SideBar handleLogout={handleLogoutClick} user={user} variant="mobile" />
    </>
  );
};

export default Dashboard;
