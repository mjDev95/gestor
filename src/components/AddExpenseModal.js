import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { obtenerTarjetas, agregarTarjeta, agregarGasto } from '../firestoreService'; 

const AddExpenseModal = ({ showModal, handleClose, user, handleSaveExpense }) => {
    const [formData, setFormData] = useState({
        cantidad: "",
        categoria: "",
        fecha: "",
        descripcion: "",
        formaPago: "efectivo", // Valor por defecto
        tarjetaId: "",
        nuevaTarjetaNombre: "",
        nuevaTarjetaTipo: "credito",
    });

    const [tarjetas, setTarjetas] = useState([]);
    const [showTarjetaModal, setShowTarjetaModal] = useState(false); // Para mostrar el modal de agregar tarjeta

    useEffect(() => {
        if (user) {
            cargarTarjetas(user.uid); // Cargar tarjetas si el usuario está logueado
        }
    }, [user]);

    const cargarTarjetas = async (userId) => {
        const tarjetas = await obtenerTarjetas(userId); // Obtiene las tarjetas del usuario desde Firestore
        setTarjetas(tarjetas);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFormaPagoChange = (e) => {
        setFormData({
            ...formData,
            formaPago: e.target.value,
            tarjetaId: "", // Limpiar tarjeta seleccionada si cambia la forma de pago
        });
    };

    const handleSave = async () => {
        // Validación de los campos obligatorios
        if (!formData.cantidad || !formData.descripcion || !formData.formaPago) {
            alert("Por favor, complete todos los campos obligatorios.");
            return;
        }

        if (formData.formaPago === "tarjeta" && !formData.tarjetaId) {
            alert("Por favor, seleccione o agregue una tarjeta.");
            return;
        }
        if (formData.formaPago === "tarjeta" && !formData.tarjetaId) {
            alert("Por favor, seleccione o agregue una tarjeta.");
            return;
        }

        // Guardamos el gasto, incluyendo la forma de pago y tarjeta (si aplica)
        await agregarGasto(user.uid, formData);
        
        // Limpiamos el formulario
        setFormData({
            tipo: "gasto",
            cantidad: "",
            categoria: "",
            fecha: "",
            descripcion: "",
            formaPago: "efectivo",
            tarjetaId: "",
            nuevaTarjetaNombre: "",
            nuevaTarjetaTipo: "credito",
        });

        handleClose();
    };

    // Función para agregar una nueva tarjeta
    const handleAddTarjeta = async () => {
        if (!formData.nuevaTarjetaNombre) {
            alert("Por favor, ingrese un nombre para la tarjeta.");
            return;
        }

        await agregarTarjeta(user.uid, {
            nombre: formData.nuevaTarjetaNombre,
            tipo: formData.nuevaTarjetaTipo,
        });

        cargarTarjetas(user.uid); // Recargar tarjetas después de agregar una nueva
        setShowTarjetaModal(false); // Cerrar el modal
        setFormData({
            ...formData,
            tarjetaId: "",
            nuevaTarjetaNombre: "",
            nuevaTarjetaTipo: "credito",
        });
    };

    return (
        <>
            <Modal show={showModal} onHide={handleClose} centered scrollable>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Gastos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {user && <h5>¡Hola, {user.displayName || 'Usuario'}!</h5>}

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Cantidad</Form.Label>
                            <Form.Control
                                type="number"
                                name="cantidad"
                                value={formData.cantidad}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Control
                                type="text"
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Fecha</Form.Label>
                            <Form.Control
                                type="date"
                                name="fecha"
                                value={formData.fecha}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        {/* Selección de forma de pago */}
                        <Form.Group className="mb-3">
                            <Form.Label>Forma de Pago</Form.Label>
                            <Form.Check
                                type="radio"
                                label="Efectivo"
                                name="formaPago"
                                value="efectivo"
                                checked={formData.formaPago === "efectivo"}
                                onChange={handleFormaPagoChange}
                            />
                            <Form.Check
                                type="radio"
                                label="Tarjeta"
                                name="formaPago"
                                value="tarjeta"
                                checked={formData.formaPago === "tarjeta"}
                                onChange={handleFormaPagoChange}
                            />
                        </Form.Group>

                        {/* Mostrar select de tarjetas si la forma de pago es tarjeta */}
                        {formData.formaPago === "tarjeta" && (
                            <>
                                <Form.Group className="mb-3" controlId="formTarjeta">
                                    <Form.Label>Selecciona una Tarjeta</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="tarjetaId"
                                        value={formData.tarjetaId}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Seleccione una tarjeta</option>
                                        {tarjetas.map((tarjeta) => (
                                            <option key={tarjeta.id} value={tarjeta.id}>
                                                {tarjeta.nombre} ({tarjeta.tipo})
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                {/* Si no hay tarjetas, mostrar opción para agregar una nueva */}
                                {tarjetas.length === 0 && (
                                    <Button variant="link" onClick={() => setShowTarjetaModal(true)}>
                                        Agregar nueva tarjeta
                                    </Button>
                                )}
                            </>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para agregar una nueva tarjeta */}
            <Modal show={showTarjetaModal} onHide={() => setShowTarjetaModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Nueva Tarjeta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formTarjetaNombre">
                            <Form.Label>Nombre de la Tarjeta</Form.Label>
                            <Form.Control
                                type="text"
                                name="nuevaTarjetaNombre"
                                value={formData.nuevaTarjetaNombre}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formTarjetaTipo">
                            <Form.Label>Tipo de Tarjeta</Form.Label>
                            <Form.Control
                                as="select"
                                name="nuevaTarjetaTipo"
                                value={formData.nuevaTarjetaTipo}
                                onChange={handleInputChange}
                            >
                                <option value="credito">Crédito</option>
                                <option value="debito">Débito</option>
                            </Form.Control>
                        </Form.Group>

                        <Button variant="primary" onClick={handleAddTarjeta}>
                            Agregar Tarjeta
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AddExpenseModal;
