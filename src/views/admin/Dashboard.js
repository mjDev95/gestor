import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import SideBar from '../../components/SideBar';
import TransactionForm from '../../components/TransactionForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import TransactionList from '../../components/TransactionList';
import { useGlobalState } from "../../context/GlobalState"; 
import { usePerfil } from '../../context/PerfilContext';
import PerfilPanel from '../../components/perfil/PerfilPanel';
import SaludoUsuario from "../../components/saludo/SaludoUsuario";
import ResumenFinanciero from "../../components/resumenFinanciero/ResumenFinanciero";
import SelectorMeses from "../../components/meses/SelectorMeses";
import { cargarTransaccionesFicticias } from '../../utils/cargarTransaccionesFicticias';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { addTransaction } = useGlobalState()
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { showPerfil } = usePerfil();

  const mesActual = new Date().toISOString().slice(0, 7);
  const [mesSeleccionado, setMesSeleccionado] = useState(mesActual);  

  const manejarSeleccionMes = (mes) => {
    setMesSeleccionado(mes);
    console.log('Mes seleccionado:', mes);
  };

  const manejarCargaFicticia = () => {
    if (user) {
      cargarTransaccionesFicticias(user.uid);
    }
  };
  useEffect(() => {
    // Aquí podrías realizar alguna lógica si el mes seleccionado cambia,
    // por ejemplo, cargar datos para ese mes en particular.
    console.log('Mes actual:', mesSeleccionado);
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

    <Container fluid className="px-0">
      <div className={`d-flex flex-column flex-md-row gap-1 dashboard-container position-relative vh-100 overflow-hidden app ${showPerfil ? 'active' : ''}`}>
        <SideBar handleLogout={handleLogoutClick} user={user} setShowModal={setShowModal}/>

        <div className="flex-md-fill overflow-x-auto ps-md-1 vstack order-0 order-md-1">
          {/* Contenido principal */}
          <Row className="file-tabs sticky-top align-items-center g-0 py-4">
            <Col md={3} className="mb-2 mb-md-0">
              <InputGroup className="px-2 input-group-sm input-group-inline w-100 rounded-pill">
                <InputGroup.Text className="rounded-start-pill">
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control type="search" className="ps-0 rounded-end-pill search" placeholder="Buscar..." aria-label="Buscar"
                />
              </InputGroup>
            </Col>
            <Col md={6} className="ms-md-auto">
                <SelectorMeses onSelect={manejarSeleccionMes}/>
            </Col>
            <Col md={1} className="">
            </Col>
          </Row>
          {/* Fila del contenido dinámico */}<SaludoUsuario />
          <div className="content-info overflow-y-auto rounded-top-4">
            <main className="px-3 py-5">
              <ResumenFinanciero />
              <Row>
                <Col xs={12} md={6} >
                  <TransactionList />
                </Col>
                <Col xs={12} md={6}>
                  {/* Otro contenido aquí */}
                </Col>
              </Row>
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
    </Container>

  );
};

export default Dashboard;
