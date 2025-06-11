import React, { useEffect } from "react";
import SideBar from '../../components/sidebar/SideBar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { usePerfil } from '../../context/PerfilContext';
//import { cargarTransaccionesFicticias } from '../../utils/cargarTransaccionesFicticias';
import { useMonth } from '../../context/monthContext';
import ContentDash from './ContentDash';
import { DashboardProvider } from "../../context/dashboardContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showPerfil } = usePerfil();
  const { mesSeleccionado } = useMonth();

  /*const manejarCargaFicticia = () => {
    if (user) {
      cargarTransaccionesFicticias(user.uid);
    }
  };*/

  useEffect(() => {}, [mesSeleccionado]);

  const handleLogoutClick = async () => {
    await logout();
    navigate('/');
  };


  return (
    <DashboardProvider>
      <div className="px-0 container-fluid">
        <div className={`d-flex flex-column flex-md-row gap-1 dashboard-container position-relative vh-100 overflow-hidden app ${showPerfil ? 'active' : ''}`}>
          <SideBar handleLogout={handleLogoutClick} user={user} />
          <ContentDash />
        </div>
      </div>
    </ DashboardProvider>
  );
};

export default Dashboard;
