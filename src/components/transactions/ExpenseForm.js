import React, { useState, useImperativeHandle, forwardRef, useRef } from 'react';

const ExpenseForm = forwardRef(({ handleSaveExpense }, ref) => {
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [formaPago, setFormaPago] = useState('');
  const [categoria, setCategoria] = useState('');
  const [notas, setNotas] = useState(''); 

  const formRef = useRef();
  const submitPromiseRef = useRef();

  useImperativeHandle(ref, () => ({
    // Este método devuelve una promesa que se resuelve en handleSubmit
    submitForm: () => {
      return new Promise((resolve) => {
        submitPromiseRef.current = resolve;
        if (formRef.current) formRef.current.requestSubmit();
      });
    },
    resetForm: () => {
      setNombre('');
      setMonto('');
      setFecha('');
      setFormaPago('');
      setCategoria('');
      setNotas(''); 
    }
  }));

  // handleSubmit resuelve la promesa con true (éxito) o false (error)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !fecha || !monto || isNaN(monto) || !categoria || !formaPago) {
      if (submitPromiseRef.current) submitPromiseRef.current(false); // Notifica error al modal
      return;
    }
    const nuevaTransaccion = {
      nombre,
      fecha,
      monto: parseFloat(monto),
      categoria,
      tipo: 'gastos',
      formaPago,
      notas
    };
    try {
      await handleSaveExpense(nuevaTransaccion, 'gastos');
      setNombre('');
      setMonto('');
      setFecha('');
      setFormaPago('');
      setCategoria('');
      setNotas('');
      if (submitPromiseRef.current) submitPromiseRef.current(true); // Notifica éxito al modal
    } catch (err) {
      if (submitPromiseRef.current) submitPromiseRef.current(false); // Notifica error al modal
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Monto</label>
        <input type="number" className="form-control" placeholder="Ej: 2000" value={monto} onChange={e => setMonto(e.target.value)} />
      </div>
      
      <div className="mb-3">
        <label className="form-label">Concepto</label>
        <input type="text" className="form-control" placeholder="Ej: Sueldo" value={nombre} onChange={e => setNombre(e.target.value)} />
      </div>
      
      <div className="mb-3">
        <label className="form-label">Fecha</label>
        <input type="date" className="form-control" value={fecha} onChange={e => setFecha(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label">Forma de pago</label>
        <select className="form-select form-control" value={formaPago} onChange={e => setFormaPago(e.target.value)}>
          <option value="">Selecciona una opción</option>
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="transferencia">Transferencia</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Categoría</label>
        <input type="text" className="form-control" placeholder="Ej: sueldo, venta" value={categoria} onChange={e => setCategoria(e.target.value)} />
      </div>
      <div className="mb-3">
        <label htmlFor="notas" className="form-label">Notas adicionales:</label>
        <textarea id="notas" className="form-control" rows={3} value={notas} onChange={e => setNotas(e.target.value)}></textarea>
      </div>
    </form>
  );
});

export default ExpenseForm;