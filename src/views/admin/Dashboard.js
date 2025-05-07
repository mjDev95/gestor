import React, { useEffect, useState } from "react";
import SideBar from '../../components/SideBar';
import TransactionForm from '../../components/TransactionForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import TransactionList from '../../components/transactions/TransactionList';
import { useGlobalState } from "../../context/GlobalState"; 
import { usePerfil } from '../../context/PerfilContext';
import PerfilPanel from '../../components/perfil/PerfilPanel';
import SaludoUsuario from "../../components/saludo/SaludoUsuario";
import ResumenFinanciero from "../../components/resumenFinanciero/ResumenFinanciero";
import SelectorMeses from "../../components/meses/SelectorMeses";
//import { cargarTransaccionesFicticias } from '../../utils/cargarTransaccionesFicticias';
import { useMonth } from '../../context/monthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { addTransaction } = useGlobalState()
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { showPerfil } = usePerfil();

  const { mesSeleccionado } = useMonth();

  /*const manejarCargaFicticia = () => {
    if (user) {
      cargarTransaccionesFicticias(user.uid);
    }
  };*/

  useEffect(() => {
  }, [mesSeleccionado]);

  const handleLogoutClick = async () => {
    await logout();
    navigate('/');
  };

  // Manejar el guardado de un gasto
  const handleSaveExpense = async (formData, tipo) => {
    if (!formData.nombre || !formData.monto) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const transaccion = {
      ...formData,
      tipo, // "gasto" o "ingreso"
      userId: user.uid,
    };

    try {
      // Llamar a addTransaction para guardar en Firebase
      await addTransaction(transaccion, tipo);
      console.log("Transacción guardada en Firebase:", transaccion);
      setShowModal(false); // Cerrar el modal después de guardar
    } catch (error) {
      console.error("Error al guardar la transacción:", error);
      alert("Hubo un error al guardar la transacción.");
    }
  };

  return (

    <div className="px-0 conainer-fluid">
      <div className={`d-flex flex-column flex-md-row gap-1 dashboard-container position-relative vh-100 overflow-hidden app ${showPerfil ? 'active' : ''}`}>
        <SideBar handleLogout={handleLogoutClick} user={user} setShowModal={setShowModal}/>

        <div className="flex-md-fill overflow-x-auto ps-md-1 vstack order-0 order-md-1">
          {/* Contenido principal */}
          <div className="row file-tabs sticky-top align-items-center g-0 py-4 py-md-0">
            <div className="col-md-3 mb-2 mb-md-0">
              <SaludoUsuario />
            </div>
            <div className="col-md-6 ms-md-auto">
              <SelectorMeses />
            </div>
            <div className="col-md-1">
              {/* Espacio reservado o futuro contenido */}
            </div>
          </div>
          {/* Fila del contenido dinámico */}
          <div className="content-info overflow-y-auto rounded-top-4">
            <main className="px-3 py-5">
              <ResumenFinanciero />
              <div className="row g-5">
                <div className="col-12 col-md-6">
                  <TransactionList />
                </div>
                <div className="col-12 col-md-6">
                  {/* Otro contenido aquí */}
                </div>
              </div>
            </main>
          </div>

        </div>
      </div>

      <PerfilPanel />

      <TransactionForm
        showModal={showModal}
        handleClose={() => setShowModal(false)}
        user={user}
        handleSaveExpense={handleSaveExpense}
      />
    </div>

  );
};

export default Dashboard;
