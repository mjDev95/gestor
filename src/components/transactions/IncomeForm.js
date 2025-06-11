import React, { useState, useImperativeHandle, forwardRef, useRef } from 'react';

const IncomeForm = forwardRef(({ handleSaveExpense }, ref) => {
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [categoria, setCategoria] = useState('');
  const [notas, setNotas] = useState(''); 

  const formRef = useRef();
  const submitPromiseRef = useRef();

  useImperativeHandle(ref, () => ({
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
      setCategoria('');
      setNotas('');
    }
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !fecha || !monto || isNaN(monto) || !categoria) {
      if (submitPromiseRef.current) submitPromiseRef.current(false); // Notifica error al modal
      return;
    }

    const nuevaTransaccion = {
      nombre,
      fecha,
      monto: parseFloat(monto),
      categoria,
      tipo: 'ingresos',
      notas
    };

    try {
      await handleSaveExpense(nuevaTransaccion, 'ingresos');
      setNombre('');
      setMonto('');
      setFecha('');
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
        <label className="form-label">Concepto</label>
        <input type="text" className="form-control" placeholder="Ej: Sueldo" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Monto</label>
        <input type="number" className="form-control" placeholder="Ej: 2000" value={monto} onChange={(e) => setMonto(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Fecha</label>
        <input type="date" className="form-control" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Categoría</label>
        <input type="text" className="form-control" placeholder="Ej: sueldo, venta" value={categoria} onChange={(e) => setCategoria(e.target.value)} />
      </div>

      <div className="mb-3">
        <label htmlFor="notas" className="form-label">Notas adicionales:</label>
        <textarea id="notas" className="form-control" rows={3} value={notas} onChange={e => setNotas(e.target.value)}></textarea>
      </div>
    </form>
  );
});

export default IncomeForm;