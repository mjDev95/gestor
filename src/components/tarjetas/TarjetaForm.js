import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';

const TarjetaForm = forwardRef(({ initialData = null, modo = 'crear', handleSaveTarjeta }, ref) => {
  const [formData, setFormData] = useState({
    banco: '',
    terminacion: '',
    tipo: 'credito',
    vence: '',
    principal: false,
    logo: ''
  });

  const [errors, setErrors] = useState({});

  // Cargar datos iniciales en modo edición
  useEffect(() => {
    if (modo === 'editar' && initialData) {
      setFormData({
        banco: initialData.banco || '',
        terminacion: initialData.terminacion || '',
        tipo: initialData.tipo || 'credito',
        vence: initialData.vence || '',
        principal: initialData.principal || false,
        logo: initialData.logo || ''
      });
    }
  }, [initialData, modo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.banco.trim()) {
      newErrors.banco = 'El nombre del banco es requerido';
    }

    if (!formData.terminacion.trim()) {
      newErrors.terminacion = 'La terminación es requerida';
    } else if (formData.terminacion.length !== 4 || !/^\d+$/.test(formData.terminacion)) {
      newErrors.terminacion = 'La terminación debe ser de 4 dígitos';
    }

    if (!formData.vence.trim()) {
      newErrors.vence = 'La fecha de vencimiento es requerida';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.vence)) {
      newErrors.vence = 'Formato: MM/AA';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async () => {
    if (!validateForm()) {
      return false;
    }

    try {
      const tarjetaData = {
        ...formData,
        ...(modo === 'editar' && initialData?.id ? { id: initialData.id } : {})
      };

      await handleSaveTarjeta(tarjetaData, modo);
      return true;
    } catch (error) {
      console.error('Error al guardar tarjeta:', error);
      return false;
    }
  };

  const resetForm = () => {
    setFormData({
      banco: '',
      terminacion: '',
      tipo: 'credito',
      vence: '',
      principal: false,
      logo: ''
    });
    setErrors({});
  };

  useImperativeHandle(ref, () => ({
    submitForm,
    resetForm
  }));

  return (
    <form className="tarjeta-form">
      {/* Banco */}
      <div className="mb-3">
        <label htmlFor="banco" className="form-label">
          Banco / Emisor
        </label>
        <input
          type="text"
          className={`form-control ${errors.banco ? 'is-invalid' : ''}`}
          id="banco"
          name="banco"
          value={formData.banco}
          onChange={handleChange}
          placeholder="Ej: BBVA, Santander, American Express"
        />
        {errors.banco && <div className="invalid-feedback">{errors.banco}</div>}
      </div>

      {/* Terminación */}
      <div className="mb-3">
        <label htmlFor="terminacion" className="form-label">
          Últimos 4 dígitos
        </label>
        <input
          type="text"
          className={`form-control ${errors.terminacion ? 'is-invalid' : ''}`}
          id="terminacion"
          name="terminacion"
          value={formData.terminacion}
          onChange={handleChange}
          placeholder="0000"
          maxLength={4}
        />
        {errors.terminacion && <div className="invalid-feedback">{errors.terminacion}</div>}
      </div>

      {/* Tipo de tarjeta */}
      <div className="mb-3">
        <label htmlFor="tipo" className="form-label">
          Tipo de tarjeta
        </label>
        <select
          className="form-select"
          id="tipo"
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
        >
          <option value="credito">Crédito</option>
          <option value="debito">Débito</option>
        </select>
      </div>

      {/* Fecha de vencimiento */}
      <div className="mb-3">
        <label htmlFor="vence" className="form-label">
          Fecha de vencimiento
        </label>
        <input
          type="text"
          className={`form-control ${errors.vence ? 'is-invalid' : ''}`}
          id="vence"
          name="vence"
          value={formData.vence}
          onChange={handleChange}
          placeholder="MM/AA"
          maxLength={5}
        />
        {errors.vence && <div className="invalid-feedback">{errors.vence}</div>}
        <small className="">Formato: MM/AA (Ej: 12/25)</small>
      </div>

      {/* Tarjeta principal */}
      <div className="mb-3 form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="principal"
          name="principal"
          checked={formData.principal}
          onChange={handleChange}
        />
        <label className="form-check-label" htmlFor="principal">
          Marcar como tarjeta principal
        </label>
      </div>
    </form>
  );
});

TarjetaForm.displayName = 'TarjetaForm';

export default TarjetaForm;
