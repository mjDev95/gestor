import React, { useState } from 'react';

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
      setError('Por favor, completa todos los campos correctamente. ');
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
    <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Agregar {tipo === 'gastos' ? 'Gasto' : tipo === 'ingresos' ? 'Ingreso' : 'Ahorro'}</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>

          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Tipo</label>
                <select className="form-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  <option value="gastos">Gasto</option>
                  <option value="ingresos">Ingreso</option>
                  <option value="ahorro">Ahorro</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input type="text" className="form-control" placeholder="Ej: Supermercado" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </div>

              <div className="mb-3">
                <label className="form-label">Monto</label>
                <input type="number" className="form-control" placeholder="Ej: 200" value={monto} onChange={(e) => setMonto(e.target.value)} />
              </div>

              <div className="mb-3">
                <label className="form-label">Fecha</label>
                <input type="date" className="form-control" value={fecha} onChange={(e) => setFecha(e.target.value)} />
              </div>

              {tipo === 'gastos' && (
                <div className="mb-3">
                  <label className="form-label">Forma de pago</label>
                  <select className="form-select" value={formaPago} onChange={(e) => setFormaPago(e.target.value)}>
                    <option value="">Selecciona una opción</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                  </select>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Categoría</label>
                <input type="text" className="form-control" placeholder="Ej: comida, transporte, sueldo" value={categoria} onChange={(e) => setCategoria(e.target.value)} />
              </div>

              <button type="submit" className="btn btn-primary">Guardar</button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
