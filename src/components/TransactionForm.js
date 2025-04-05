/*import React, { useState } from 'react';
import { useGlobalState } from '../context/GlobalState';
import { Form, Button, Card, Alert } from 'react-bootstrap';

const TransactionForm = () => {
  const { addTransaction, tarjetas, addTarjeta, user, loading } = useGlobalState();

  const [type, setType] = useState('ingreso');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [selectedCard, setSelectedCard] = useState('');
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardName, setNewCardName] = useState('');
  const [newCardType, setNewCardType] = useState('credito');
  const [error, setError] = useState(null); // Para manejar errores

  // Función para agregar una tarjeta
  const handleAddCard = async () => {
    if (!newCardName) {
      setError("Por favor, ingrese un nombre para la tarjeta.");
      return;
    }

    try {
      await addTarjeta(user.uid, {
        nombre: newCardName,
        tipo: newCardType,
      });
      setShowAddCard(false); 
      setNewCardName('');
      setNewCardType('credito');
      setError(null); // Limpiar cualquier error
    } catch (err) {
      setError("Hubo un error al agregar la tarjeta. Intenta de nuevo.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || !category) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    const newTransaction = {
      type,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString(),
      note,
      paymentMethod,
      tarjetaId: paymentMethod === 'tarjeta' ? selectedCard : null,
    };

    try {
      addTransaction(newTransaction); 
      setAmount('');
      setCategory('');
      setNote('');
      setPaymentMethod('efectivo');
      setSelectedCard('');
      setError(null); // Limpiar cualquier error
    } catch (err) {
      setError("Hubo un error al agregar la transacción. Intenta de nuevo.");
    }
  };

  return (
    <Card className="my-4">
      <Card.Body>
        <Card.Title>Agregar Transacción</Card.Title>

        {error && <Alert variant="danger">{error}</Alert>} 

        {loading && <p>Loading tarjetas...</p>} 
        {!loading && tarjetas.length === 0 && (
          <p>No tienes tarjetas. ¿Quieres agregar una?</p> 
        )}


        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formTipo">
            <Form.Label>Tipo</Form.Label>
            <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="ingreso">Ingreso</option>
              <option value="gasto">Gasto</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCantidad">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCategoria">
            <Form.Label>Categoría</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej. Comida, Transporte..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formNota">
            <Form.Label>Nota (opcional)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Descripción corta"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Forma de Pago</Form.Label>
            <Form.Check
              type="radio"
              label="Efectivo"
              name="paymentMethod"
              value="efectivo"
              checked={paymentMethod === "efectivo"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <Form.Check
              type="radio"
              label="Tarjeta"
              name="paymentMethod"
              value="tarjeta"
              checked={paymentMethod === "tarjeta"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </Form.Group>

          {paymentMethod === 'tarjeta' && (
            <>
                <Form.Group className="mb-3" controlId="formTarjeta">
                <Form.Label>Selecciona una Tarjeta</Form.Label>
                <Form.Select
                    value={selectedCard}
                    onChange={(e) => setSelectedCard(e.target.value)}
                    required
                    >
                    <option value="">Seleccione una tarjeta</option>
                    {tarjetas.map((tarjeta) => (
                        <option key={tarjeta.id} value={tarjeta.id}>
                        {tarjeta.nombre} ({tarjeta.tipo})
                        </option>
                    ))}
                </Form.Select>
                </Form.Group>

              {tarjetas.length === 0 && (
                <Button variant="link" onClick={() => setShowAddCard(true)}>
                  Agregar nueva tarjeta
                </Button>
              )}
            </>
          )}

          {showAddCard && (
            <div>
              <h5>Agregar Nueva Tarjeta</h5>
              <Form.Group className="mb-3">
                <Form.Label>Nombre de la Tarjeta</Form.Label>
                <Form.Control
                  type="text"
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tipo de Tarjeta</Form.Label>
                <Form.Select
                  value={newCardType}
                  onChange={(e) => setNewCardType(e.target.value)}
                >
                  <option value="credito">Crédito</option>
                  <option value="debito">Débito</option>
                </Form.Select>
              </Form.Group>

              <Button variant="primary" onClick={handleAddCard}>
                Agregar Tarjeta
              </Button>
            </div>
          )}

          <Button variant="success" type="submit">
            Agregar
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default TransactionForm;
*/