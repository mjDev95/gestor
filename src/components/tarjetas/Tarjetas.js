import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import TarjetasSwiper from "./TarjetasSwiper";
import TarjetaDetalle from "./TarjetaDetalle";
import DonutComparativoTarjetas from "./DonutComparativoTarjetas";
import "./DonutComparativoTarjetas.scss";
import { useGlobalState } from '../../context/GlobalState';
import { useAuth } from '../../context/AuthContext';
import "./TarjetasSwiper.scss";
import { getPorcentajesPorBanco, getDetallesTarjeta } from "../../utils/tarjetasStats";

function Tarjetas() {
  const { tarjetas, transactions } = useGlobalState();
  const { user } = useAuth();
  const { nombre } = useParams();
  const navigate = useNavigate();
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null);

  // Memoizar cálculos de porcentajes
  const porcentajesCredito = useMemo(() => 
    getPorcentajesPorBanco({
      tarjetas,
      transacciones: transactions.actual,
      tipo: "Crédito"
    }), [tarjetas, transactions.actual]
  );

  const porcentajesDebito = useMemo(() => 
    getPorcentajesPorBanco({
      tarjetas,
      transacciones: transactions.actual,
      tipo: "Débito"
    }), [tarjetas, transactions.actual]
  );

  // Memoizar handlers
  const handleSelectCard = useCallback((tarjeta) => {
    navigate(`/dashboard/tarjetas/${tarjeta.slug}`);
  }, [navigate]);

  const handleBack = useCallback(() => {
    navigate('/dashboard/tarjetas');
  }, [navigate]);

  // Sincronizar con URL - Memoizar búsqueda de tarjeta
  useEffect(() => {
    if (nombre && tarjetas.length > 0) {
      const tarjeta = tarjetas.find(t => t.slug === nombre);
      
      if (tarjeta) {
        const detalles = getDetallesTarjeta(tarjeta, transactions.actual);
        setTarjetaSeleccionada(detalles);
      }
    } else {
      setTarjetaSeleccionada(null);
    }
  }, [nombre, tarjetas, transactions.actual]);

  return (
    <motion.main
      layout
      layoutId="tarjetas-panel"
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="p-3 content-info"
    >
      {tarjetaSeleccionada ? (
        <TarjetaDetalle tarjeta={tarjetaSeleccionada} onBack={handleBack} />
      ) : (
        <div className="container-fluid">
          <div className="row mb-4 align-items-center">
            <div className="col">
              <h2 className="mb-0">Mis tarjetas</h2>
            </div>
            <div className="col-auto d-flex gap-2">
              <button className="btn btn-primary">
                <i className="bi bi-plus-lg me-2"></i>
                Agregar tarjeta
              </button>
            </div>
          </div>

          <TarjetasSwiper onSelectCard={handleSelectCard} />
          <DonutComparativoTarjetas
            credito={porcentajesCredito}
            debito={porcentajesDebito}
          />
        </div>
      )}
    </motion.main>
  );
}

export default Tarjetas;