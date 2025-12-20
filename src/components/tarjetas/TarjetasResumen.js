import React from "react";
import { motion } from 'framer-motion';
import { useGlobalState } from '../../context/GlobalState';
import { useDashboard } from '../../context/dashboardContext';

const TarjetasResumen = ({ className = '' }) => {
  const { tarjetas = [] } = useGlobalState();
  const { setActiveSection } = useDashboard();

  const totalTarjetas = tarjetas.length;
  const primeraDos = tarjetas.slice(0, 2);

  return (
    <motion.div layoutId="tarjetas-panel" layout className={`resumen-card p-3 mb-lg-4 rounded mt-2 mt-lg-4 mt-xxl-0 ${className}`}>
      <div className="d-flex align-items-start justify-content-between mb-2">
        <div>
          <h5 className="mb-1">Tarjetas</h5>
          <small>Total: {totalTarjetas}</small>
        </div>
      </div>

      {totalTarjetas === 0 ? (
        <div className="py-3 text-center text-muted">No tienes tarjetas guardadas.</div>
      ) : (
        <div className="d-flex gap-2 mb-3">
          {primeraDos.map((t, i) => (
            <div
              key={t.id || i}
              className="card flex-fill shadow-sm p-0 overflow-hidden"
              style={{ borderRadius: 12, minHeight: 120, cursor: 'pointer' }}
              onClick={() => setActiveSection && setActiveSection('tarjetas')}
              aria-label={`Ver tarjeta ${t.banco || t.nombre}`}
            >
              <div
                className="p-3 text-white h-100"
                style={{
                  background: t.color ? `linear-gradient(135deg, ${t.color}33, ${t.color})` : 'linear-gradient(135deg,#4b6cb7,#182848)',
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="fw-bold">{t.banco || t.nombre}</div>
                  <div style={{ width: 36, height: 24, background: '#fff3', borderRadius: 4 }}></div>
                </div>
                <div className="mb-2" style={{ letterSpacing: 2, fontSize: 16 }}>
                  **** **** **** {t.terminacion || '----'}
                </div>
                <div className="d-flex justify-content-between small text-white-50">
                  <div>Vence {t.vence || '-'}</div>
                  <div>{t.tipo || ''}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="d-flex justify-content-end">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => setActiveSection && setActiveSection('tarjetas')}
        >
          Ver tarjetas
        </button>
      </div>
    </motion.div>
  );
};

export default TarjetasResumen;

