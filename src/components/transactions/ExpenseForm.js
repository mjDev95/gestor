import React, { useState, useImperativeHandle, forwardRef, useRef, useEffect } from 'react';
import { useGlobalState } from '../../context/GlobalState';
import { useAuth } from '../../context/AuthContext';
import { guardarGastoConMSI } from '../../services/msiService';

const ExpenseForm = forwardRef(({ handleSaveExpense, initialData = null, modo = 'crear' }, ref) => {
  const { tarjetas } = useGlobalState();
  const { user } = useAuth();
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(() => {
    // Fecha actual por defecto
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [formaPago, setFormaPago] = useState('');
  const [tarjetaId, setTarjetaId] = useState('');
  const [mesesSinIntereses, setMesesSinIntereses] = useState('');
  const [categoria, setCategoria] = useState('');
  const [notas, setNotas] = useState(''); 

  const formRef = useRef();
  const submitPromiseRef = useRef();

  // Categorías predefinidas
  const categorias = [
    { value: 'alimentacion', label: '🍔 Alimentación', icon: 'bi-basket' },
    { value: 'transporte', label: '🚗 Transporte', icon: 'bi-car-front' },
    { value: 'entretenimiento', label: '🎬 Entretenimiento', icon: 'bi-film' },
    { value: 'salud', label: '💊 Salud', icon: 'bi-heart-pulse' },
    { value: 'educacion', label: '📚 Educación', icon: 'bi-book' },
    { value: 'vivienda', label: '🏠 Vivienda', icon: 'bi-house' },
    { value: 'servicios', label: '💡 Servicios', icon: 'bi-lightning' },
    { value: 'ropa', label: '👕 Ropa', icon: 'bi-bag' },
    { value: 'tecnologia', label: '💻 Tecnología', icon: 'bi-laptop' },
    { value: 'otros', label: '📦 Otros', icon: 'bi-three-dots' },
  ];

  useEffect(() => {
    if (initialData && modo === 'editar') {
      setNombre(initialData.nombre || '');
      setMonto(initialData.monto || '');
      setFecha(initialData.fecha || '');
      setFormaPago(initialData.formaPago || '');
      setTarjetaId(initialData.tarjetaId || '');
      setMesesSinIntereses(initialData.mesesSinIntereses || '');
      setCategoria(initialData.categoria || '');
      setNotas(initialData.notas || '');
    }
  }, [initialData, modo]);

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
      setFecha(new Date().toISOString().split('T')[0]);
      setFormaPago('');
      setTarjetaId('');
      setMesesSinIntereses('');
      setCategoria('');
      setNotas(''); 
    }
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación: si forma de pago es tarjeta, tarjetaId es requerido
    if (formaPago === 'tarjeta' && !tarjetaId) {
      if (submitPromiseRef.current) submitPromiseRef.current(false);
      return;
    }
    
    if (!nombre || !fecha || !monto || isNaN(monto) || !categoria || !formaPago) {
      if (submitPromiseRef.current) submitPromiseRef.current(false);
      return;
    }
    
    try {
      // Si es compra con MSI, usar el servicio especial
      if (formaPago === 'tarjeta' && mesesSinIntereses && parseInt(mesesSinIntereses) > 0) {
        const gastoMSI = {
          nombre,
          fecha,
          monto: parseFloat(monto),
          categoria,
          tarjetaId,
          mesesSinIntereses: parseInt(mesesSinIntereses),
          notas
        };
        
        // Pasar la información de la tarjeta para calcular fechas correctamente
        await guardarGastoConMSI(gastoMSI, user.uid, tarjetaSeleccionada);
      } else {
        // Gasto normal (sin MSI)
        const transaccion = {
          ...(initialData || {}),
          nombre,
          fecha,
          monto: parseFloat(monto),
          categoria,
          tipo: 'gastos',
          formaPago,
          tarjetaId: formaPago === 'tarjeta' ? tarjetaId : null,
          notas
        };
        
        await handleSaveExpense(transaccion, 'gastos', modo);
      }
      
      // Limpiar formulario
      setNombre('');
      setMonto('');
      setFecha(new Date().toISOString().split('T')[0]);
      setFormaPago('');
      setTarjetaId('');
      setMesesSinIntereses('');
      setCategoria('');
      setNotas('');
      if (submitPromiseRef.current) submitPromiseRef.current(true);
    } catch (err) {
      console.error('❌ Error al guardar gasto:', err);
      if (submitPromiseRef.current) submitPromiseRef.current(false);
    }
  };

  const handleFormaPagoChange = (e) => {
    const newFormaPago = e.target.value;
    setFormaPago(newFormaPago);
    // Limpiar tarjeta y MSI si no es forma de pago "tarjeta"
    if (newFormaPago !== 'tarjeta') {
      setTarjetaId('');
      setMesesSinIntereses('');
    }
  };

  const handleTarjetaChange = (e) => {
    const newTarjetaId = e.target.value;
    setTarjetaId(newTarjetaId);
    // Limpiar MSI al cambiar de tarjeta
    setMesesSinIntereses('');
  };

  // Obtener la tarjeta seleccionada
  const tarjetaSeleccionada = tarjetas?.find(t => t.id === tarjetaId);
  const esTarjetaCredito = tarjetaSeleccionada?.tipo?.toLowerCase() === 'crédito' || 
                            tarjetaSeleccionada?.tipo?.toLowerCase() === 'credito';

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Monto *</label>
        <div className="input-group">
          <span className="input-group-text">$</span>
          <input 
            type="number" 
            className="form-control" 
            placeholder="0.00" 
            value={monto} 
            onChange={e => setMonto(e.target.value)}
            step="0.01"
            required
          />
        </div>
      </div>
      
      <div className="mb-3">
        <label className="form-label">Concepto *</label>
        <input 
          type="text" 
          className="form-control" 
          placeholder="¿En qué gastaste?" 
          value={nombre} 
          onChange={e => setNombre(e.target.value)}
          required
        />
      </div>
      
      <div className="mb-3">
        <label className="form-label">Categoría *</label>
        <select 
          className="form-select form-control" 
          value={categoria} 
          onChange={e => setCategoria(e.target.value)}
          required
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Fecha *</label>
          <input 
            type="date" 
            className="form-control" 
            value={fecha} 
            onChange={e => setFecha(e.target.value)}
            required
          />
        </div>
        
        <div className="col-md-6 mb-3">
          <label className="form-label">Forma de pago *</label>
          <select 
            className="form-select form-control" 
            value={formaPago} 
            onChange={handleFormaPagoChange}
            required
          >
            <option value="">Selecciona</option>
            <option value="efectivo">💵 Efectivo</option>
            <option value="tarjeta">💳 Tarjeta</option>
            <option value="transferencia">🏦 Transferencia</option>
          </select>
        </div>
      </div>

      {/* Selector de tarjeta (solo si forma de pago es tarjeta) */}
      {formaPago === 'tarjeta' && (
        <div className="mb-3">
          <label className="form-label">Tarjeta *</label>
          <select 
            className="form-select form-control" 
            value={tarjetaId} 
            onChange={handleTarjetaChange}
            required
          >
            <option value="">Selecciona una tarjeta</option>
            {tarjetas && tarjetas.map(tarjeta => (
              <option key={tarjeta.id} value={tarjeta.id}>
                {tarjeta.banco} •••• {tarjeta.terminacion} ({tarjeta.tipo})
              </option>
            ))}
          </select>
          {tarjetas && tarjetas.length === 0 && (
            <small className="text-muted">No tienes tarjetas registradas</small>
          )}
        </div>
      )}

      {/* Campo de MSI (solo si la tarjeta seleccionada es de crédito) */}
      {formaPago === 'tarjeta' && esTarjetaCredito && (
        <div className="mb-3">
          <label className="form-label">Meses sin intereses (opcional)</label>
          <select 
            className="form-select form-control" 
            value={mesesSinIntereses} 
            onChange={e => setMesesSinIntereses(e.target.value)}
          >
            <option value="">Sin MSI (un solo pago)</option>
            <option value="3">3 meses</option>
            <option value="6">6 meses</option>
            <option value="9">9 meses</option>
            <option value="12">12 meses</option>
            <option value="18">18 meses</option>
            <option value="24">24 meses</option>
          </select>
          <small className="d-block mt-1">
            {mesesSinIntereses && `Pagarás $${(parseFloat(monto || 0) / parseInt(mesesSinIntereses)).toFixed(2)} por mes`}
          </small>
        </div>
      )}
      
      <div className="mb-3">
        <label htmlFor="notas" className="form-label">Notas adicionales</label>
        <textarea 
          id="notas" 
          className="form-control" 
          rows={2} 
          value={notas} 
          onChange={e => setNotas(e.target.value)}
          placeholder="Información adicional (opcional)"
        ></textarea>
      </div>
    </form>
  );
});

export default ExpenseForm;