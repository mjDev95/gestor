import React, { useMemo } from 'react';
import { useMonth } from '../../context/monthContext';
import { formatearMensualidad } from '../../utils/msiHelpers';
import { useGlobalState } from '../../context/GlobalState';

/**
 * Componente optimizado para mostrar mensualidades MSI de una tarjeta
 * Recibe mensualidades como prop para evitar carga duplicada
 * SOLO muestra las del mes actual
 */
const MensualidadesMSI = ({ mensualidades = [], loading = false }) => {
  const { calcularResumenMSIPorTarjeta } = useGlobalState();
  const { mesSeleccionado } = useMonth();

  // Memoizar filtrado y resumen
  const { mensualidadesMesActual, resumen } = useMemo(() => {
    const mesActual = mesSeleccionado;
    
    const mensualidadesDelMes = mensualidades.filter(m => 
      m.mesVencimiento && m.mesVencimiento.startsWith(mesActual)
    );
    
    const resumenCalculado = mensualidadesDelMes.length > 0
      ? calcularResumenMSIPorTarjeta(mensualidadesDelMes)
      : null;

    return {
      mensualidadesMesActual: mensualidadesDelMes,
      resumen: resumenCalculado
    };
  }, [mensualidades, mesSeleccionado, calcularResumenMSIPorTarjeta]);

  if (loading) {
    return <div className="text-center py-3">Cargando mensualidades...</div>;
  }

  if (mensualidadesMesActual.length === 0) {
    return (
      <div className="alert alert-info">
        <i className="bi bi-info-circle me-2"></i>
        No hay pagos MSI para este mes
      </div>
    );
  }

  return (
    <div className="mensualidades-msi">
      {/* Lista de compras con MSI */}
      <div className="msi-list">
        {resumen && resumen.porGasto.map((gasto, idx) => (
          <div key={idx}>
            {gasto.mensualidades.map((mensualidad, mIdx) => {
              const info = formatearMensualidad(mensualidad);
              const isLastGasto = idx === resumen.porGasto.length - 1;
              const isLastMensualidad = mIdx === gasto.mensualidades.length - 1;
              const isLast = isLastGasto && isLastMensualidad;
              return (
                <div 
                  key={mensualidad.id} 
                  className={`d-flex justify-content-between align-items-center py-3 gap-3 ${!isLast ? 'border-bottom' : ''}`}
                >
                  <div className="d-flex align-items-center flex-grow-1 overflow-hidden">
                    <div className="date-circle me-3">
                      <div className="date-day">
                        {new Date(mensualidad.fechaCompra).getDate()}
                      </div>
                      <small className="date-month">
                        {new Date(mensualidad.fechaCompra).toLocaleDateString('es-MX', { month: 'short' })}
                      </small>
                    </div>
                    
                    <div className="flex-grow-1">
                      <div className="fw-semibold text-truncate">
                        {gasto.nombre}
                      </div>
                      <div className="d-flex align-items-center gap-2 small">
                        <span className="badge bg-secondary">{info.etiqueta}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-end flex-shrink-0">
                    <div className="fw-bold">
                      {info.monto}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MensualidadesMSI;
