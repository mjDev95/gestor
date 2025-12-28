import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "react-bootstrap-icons";
import { formatearDinero } from "../../utils/formatMoney";
import { useGlobalState } from "../../context/GlobalState";
import { useMonth } from "../../context/monthContext";
import MensualidadesMSI from "./MensualidadesMSI";
import TransaccionesRevolvente from "./TransaccionesRevolvente";
import "./TarjetaDetalle.scss";

const TarjetaDetalle = ({ tarjeta, onBack }) => {
  const { obtenerMensualidadesPorTarjeta } = useGlobalState();
  const { mesSeleccionado } = useMonth();
  const [mensualidades, setMensualidades] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar mensualidades una sola vez
  const cargarMensualidades = useCallback(async () => {
    if (!tarjeta?.id) return;
    
    setLoading(true);
    try {
      const data = await obtenerMensualidadesPorTarjeta(tarjeta.id);
      setMensualidades(data);
    } catch (error) {
      console.error('Error al cargar mensualidades:', error);
    } finally {
      setLoading(false);
    }
  }, [tarjeta?.id, obtenerMensualidadesPorTarjeta]);

  useEffect(() => {
    if (tarjeta && tarjeta.tipo === 'Crédito') {
      cargarMensualidades();
    }
  }, [tarjeta, cargarMensualidades]);

  // Memoizar cálculos financieros
  const datosFinancieros = useMemo(() => {
    if (!tarjeta || tarjeta.tipo !== 'Crédito') {
      return {
        totalMSIMes: 0,
        totalRevolvente: 0,
        totalPagarPeriodo: 0,
        disponibleReal: 0
      };
    }

    // Filtrar mensualidades del mes actual
    const mensualidadesMes = mensualidades.filter(m => 
      m.mesVencimiento && m.mesVencimiento.startsWith(mesSeleccionado)
    );
    
    const totalMSIMes = mensualidadesMes.reduce((sum, m) => sum + (m.montoMensual || 0), 0);
    
    // Total revolvente (transacciones del mes)
    const totalRevolvente = tarjeta.transaccionesRecientes
      ? tarjeta.transaccionesRecientes.reduce((sum, tr) => {
          return tr.tipo === 'gastos' ? sum + tr.monto : sum;
        }, 0)
      : 0;
    
    // Total a pagar en el periodo
    const totalPagarPeriodo = totalMSIMes + totalRevolvente;
    
    // Disponible real = Límite - Total gastos - MSI comprometido total
    const totalMSIComprometido = mensualidades.reduce((sum, m) => sum + (m.montoMensual || 0), 0);
    const disponibleReal = tarjeta.limite - tarjeta.totalGastos - totalMSIComprometido;
    
    return {
      totalMSIMes,
      totalRevolvente,
      totalPagarPeriodo,
      disponibleReal
    };
  }, [mensualidades, mesSeleccionado, tarjeta]);

  if (!tarjeta) return null;

  return (
    <motion.div 
      layout
      layoutId={`tarjeta-${tarjeta.id}`}
      className="container-fluid"
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
        <div className="row mb-4 align-items-center">
          <div className="col">
            <button
              className="btn btn-link p-0 d-flex align-items-center text-primary mb-3"
              onClick={onBack}
              style={{ textDecoration: "none" }}
            >
              <ChevronLeft size={20} className="me-2" />
              Volver
            </button>
            <h2 className="mb-0">{tarjeta.banco}</h2>
          </div>
        </div>

        {/* Tarjeta Visual */}
        <div
          className="tarjeta-visual mb-4 p-4 rounded"
          style={{
            background: tarjeta.color
              ? `linear-gradient(135deg, ${tarjeta.color}33, ${tarjeta.color})`
              : "linear-gradient(135deg,#4b6cb7,#182848)",
            color: "#fff",
          }}
        >
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <p className="small text-white-50 mb-1">Tarjeta</p>
              <p className="fw-bold mb-0" style={{ letterSpacing: 2, fontSize: 16 }}>
                **** **** **** {tarjeta.terminacion}
              </p>
            </div>
            <div className="small">{tarjeta.tipo}</div>
          </div>
          <div className="d-flex justify-content-between align-items-end small">
            <div>
              <p className="text-white-50 mb-0">Vence</p>
              <p className="fw-semibold mb-0">{tarjeta.vence}</p>
            </div>
            {tarjeta.tipo === 'Crédito' && (
              <div className="d-flex gap-3">
                <div>
                  <p className="text-white-50 mb-0">Corte</p>
                  <p className="fw-semibold mb-0">{tarjeta.diaCorte || '-'}</p>
                </div>
                <div>
                  <p className="text-white-50 mb-0">Pago</p>
                  <p className="fw-semibold mb-0">{tarjeta.diaPago || '-'}</p>
                </div>
              </div>
            )}
            {tarjeta.principal && (
              <span className="badge bg-light text-dark">Principal</span>
            )}
          </div>
        </div>

        {/* Información de Saldo - Solo para Crédito */}
        {tarjeta.tipo === 'Crédito' && (
          <div className="info-section mb-4">
            <div className="row g-3">
              <div className="col-md-4 col-6">
                <div className="card border-0 resumen-card border-0 rounded h-100">
                  <div className="card-body text-center">
                    <small className="d-block mb-2">Límite de Crédito</small>
                    <h5 className="fw-bold mb-0">
                      {formatearDinero(tarjeta.limite, 'ingresos').replace('+ ', '')}
                    </h5>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4 col-6">
                <div className="card resumen-card border-0 rounded h-100">
                  <div className="card-body text-center">
                    <small className="d-block mb-2">Disponible Real</small>
                    <h5 className="fw-bold mb-0">
                      {formatearDinero(datosFinancieros.disponibleReal, datosFinancieros.disponibleReal >= 0 ? 'ingresos' : 'gastos').replace(/[+-]\s/, '')}
                    </h5>
                  </div>
                </div>
              </div>

              <div className="col-md-4 col-6">
                <div className="card resumen-card border-0 rounded h-100">
                  <div className="card-body text-center">
                    <small className="d-block mb-2">Total a Pagar</small>
                    <h5 className="fw-bold mb-0">
                      {formatearDinero(datosFinancieros.totalPagarPeriodo, 'gastos')}
                    </h5>
                  </div>
                </div>
              </div>

              <div className="col-md-4 col-6">
                <div className="card resumen-card border-0 rounded h-100">
                  <div className="card-body text-center">
                    <small className="d-block mb-2">MSI del Mes</small>
                    <h5 className="fw-bold mb-0">
                      {formatearDinero(datosFinancieros.totalMSIMes, 'gastos')}
                    </h5>
                  </div>
                </div>
              </div>

              <div className="col-md-4 col-6">
                <div className="card resumen-card border-0 rounded h-100">
                  <div className="card-body text-center">
                    <small className="d-block mb-2">Revolvente</small>
                    <h5 className="fw-bold mb-0">
                      {formatearDinero(datosFinancieros.totalRevolvente, 'gastos')}
                    </h5>
                  </div>
                </div>
              </div>

              <div className="col-md-4 col-6">
                <div className="card resumen-card border-0 rounded h-100">
                  <div className="card-body text-center">
                    <small className="d-block mb-2">Total Gastado</small>
                    <h5 className="fw-bold mb-0">
                      {formatearDinero(tarjeta.totalGastos, 'gastos')}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Transacciones del mes */}
        <div>
          <small className="d-block text-uppercase mb-3">Transacciones del mes</small>
          
          <div className="row g-4 mb-4">
            {/* Meses Sin Intereses - Solo para Crédito */}
            {tarjeta.tipo === 'Crédito' && (
              <div className="col-12 col-lg-6">
                <div className="card h-100 border-0">
                  <div className="card-body">
                    <h5 className="mb-4 fw-bold">
                      <i className="bi bi-calendar-check me-2"></i>
                      Meses sin intereses
                    </h5>
                    <MensualidadesMSI 
                      mensualidades={mensualidades}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Transacciones Recientes / Revolvente */}
            {tarjeta.transaccionesRecientes && tarjeta.transaccionesRecientes.length > 0 && (
              <div className={`col-12 ${tarjeta.tipo === 'Crédito' ? 'col-lg-6' : 'col-lg-12'}`}>
                <div className="card h-100 border-0">
                  <div className="card-body">
                    <h5 className="mb-4 fw-bold">
                      <i className="bi bi-arrow-repeat me-2"></i>
                      Revolvente
                    </h5>
                    <TransaccionesRevolvente transacciones={tarjeta.transaccionesRecientes} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
    </motion.div>
  );
};

export default TarjetaDetalle;
