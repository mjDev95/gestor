import React, { useEffect, useState } from "react";
import { agregarGasto, obtenerGastos } from "../../firestoreService";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import MesesTabs from '../../components/MonthTabs';
import SideBar from '../../components/SideBar';
import AddExpenseModal from '../../components/AddExpenseModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import TransactionList from '../../components/TransactionList';


const Dashboard = () => {
  const { user, logout } = useAuth();
  const [gastos, setGastos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      cargarGastos(user.uid);
    }
  }, [user]);

  const cargarGastos = async (userId) => {
    const data = await obtenerGastos(userId);
    setGastos(data);
  };

  const handleLogoutClick = async () => {
    await logout();
    navigate('/');
  };

  // Manejar el guardado de un gasto
  const handleSaveExpense = async (formData) => {
    if (!formData.cantidad || !formData.categoria || !formData.descripcion) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const gasto = {
      ...formData,
      userId: user.uid,
      fecha: new Date().toISOString().split("T")[0],
    };

    await agregarGasto(user.uid, gasto); // Guarda el gasto en Firebase
    cargarGastos(user.uid); // Recargar lista de gastos
    setShowModal(false); // Cerrar el modal después de guardar
  };

  return (

    <Container fluid className="vh-100 px-0 position-relative">
      <div className="col-sidebar">
        <SideBar handleLogout={handleLogoutClick} user={user} setShowModal={setShowModal}/>
      </div>
      <div className="col-content ms-auto">
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
          <Col md={9} className="">
              < MesesTabs />
          </Col>
        </Row>
        {/* Fila del contenido dinámico */}
        <div className="content-info">
          <div className="scroll-content">
            <section className="sections">
              <TransactionList />
              <h1>Gastos</h1>
              
              <ul>
                {gastos.length > 0 ? (
                  gastos.map((gasto) => (
                    <li key={gasto.id}>
                      <strong>{gasto.categoria}:</strong> ${gasto.cantidad} - {gasto.fecha}
                      <br />
                      <small>{gasto.descripcion}</small>
                    </li>
                  ))
                ) : (
                  <p>No tienes gastos registrados.</p>
                )}
              </ul>
            </section>
          </div>
        </div>
      </div>
      <AddExpenseModal
        showModal={showModal}
        handleClose={() => setShowModal(false)}
        user={user}
        handleSaveExpense={handleSaveExpense}
      />
    </Container>

  );
};

export default Dashboard;
