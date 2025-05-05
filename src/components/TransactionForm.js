import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const TransactionForm = ({ showModal, handleClose, handleSaveExpense }) => {
  const [tipo, setTipo] = useState('gastos');
  const [nombre, setNombre] = useState('');  // Renombrado de descripcion a nombre
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [formaPago, setFormaPago] = useState('');
  const [categoria, setCategoria] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !fecha || !monto || isNaN(monto) || !categoria || (tipo === 'gastos' && !formaPago)) {
      setError('Por favor, completa todos los campos correctamente formulario. ');
      return;
    }

    const nuevaTransaccion = {
      nombre,  // Ahora se usa "nombre" en lugar de "descripcion"
      fecha,
      monto: parseFloat(monto),
      categoria,
      tipo,
      ...(tipo === 'gastos' && { formaPago })  // Solo incluir formaPago si es gasto
    };

    try {
      await handleSaveExpense(nuevaTransaccion, tipo);
      setNombre('');  // Limpiamos el campo nombre
      setMonto('');
      setFecha('');
      setFormaPago('');
      setCategoria('');
      setError(null);
      handleClose();
    } catch (err) {
      setError('Hubo un error al guardar la transacción.');
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar {tipo === 'gastos' ? 'Gasto' : tipo === 'ingresos' ? 'Ingreso' : 'Ahorro'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Tipo</Form.Label>
            <Form.Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="gastos">Gasto</option>
              <option value="ingresos">Ingreso</option>
              <option value="ahorro">Ahorro</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>  {/* Cambiado a Nombre */}
            <Form.Control
              type="text"
              placeholder="Ej: Supermercado"
              value={nombre}  // Cambiado de descripcion a nombre
              onChange={(e) => setNombre(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Monto</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ej: 200"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </Form.Group>

          {tipo === 'gastos' && (
            <Form.Group className="mb-3">
              <Form.Label>Forma de pago</Form.Label>
              <Form.Select value={formaPago} onChange={(e) => setFormaPago(e.target.value)}>
                <option value="">Selecciona una opción</option>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </Form.Select>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: comida, transporte, sueldo"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TransactionForm;
