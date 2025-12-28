import React from 'react';
import { formatearDinero } from '../../utils/formatMoney';

/**
 * Componente para mostrar transacciones revolventes de una tarjeta
 * Con la misma apariencia que MensualidadesMSI
 */
const TransaccionesRevolvente = ({ transacciones }) => {
  if (!transacciones || transacciones.length === 0) {
    return (
      <div className="alert alert-info">
        <i className="bi bi-info-circle me-2"></i>
        No hay transacciones revolventes para este mes
      </div>
    );
  }

  return (
    <div className="transacciones-revolvente">
      <div className="transacciones-list">
        {transacciones.map((transaccion, idx) => {
          const isLast = idx === transacciones.length - 1;
          const fecha = new Date(transaccion.fecha);
          
          return (
            <div 
              key={idx} 
              className={`d-flex justify-content-between align-items-center py-3 gap-3 ${!isLast ? 'border-bottom' : ''}`}
            >
              <div className="d-flex align-items-center flex-grow-1 overflow-hidden">
                <div className="date-circle me-3">
                  <div className="date-day">
                    {fecha.getDate()}
                  </div>
                  <small className="date-month">
                    {fecha.toLocaleDateString('es-MX', { month: 'short' })}
                  </small>
                </div>
                
                <div className="flex-grow-1">
                  <div className="fw-semibold text-truncate">
                    {transaccion.descripcion || transaccion.concepto}
                  </div>
                  <div className="d-flex align-items-center gap-2 small">
                    <span className="badge bg-secondary">
                      {transaccion.tipo === 'gastos' ? 'Gasto' : 'Ingreso'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-end flex-shrink-0">
                <div className="fw-bold">
                  {transaccion.tipo === "gastos" 
                    ? formatearDinero(transaccion.monto, 'gastos') 
                    : formatearDinero(transaccion.monto, 'ingresos')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransaccionesRevolvente;
