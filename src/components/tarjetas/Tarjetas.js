import React, { useState } from "react";
import { motion } from "framer-motion";
import TarjetasSwiper from "./TarjetasSwiper";
import TarjetaDetalle from "./TarjetaDetalle";
import DonutComparativoTarjetas from "./DonutComparativoTarjetas";
import "./DonutComparativoTarjetas.scss";
import { useGlobalState } from '../../context/GlobalState';
import { useAuth } from '../../context/AuthContext';
import "./TarjetasSwiper.scss";
import { getPorcentajesPorBanco, getDetallesTarjeta } from "../../utils/tarjetasStats";
import { cargarDatosFicticiosCompletos } from "../../utils/cargarTransaccionesFicticias";

function Tarjetas() {
  const { tarjetas, transactions } = useGlobalState();
  const { user } = useAuth();
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleSelectCard = (tarjeta) => {
    const detalles = getDetallesTarjeta(tarjeta, transactions.actual);
    setTarjetaSeleccionada(detalles);
  };

  const handleBack = () => {
    setTarjetaSeleccionada(null);
  };

  const porcentajesCredito = getPorcentajesPorBanco({
    tarjetas,
    transacciones: transactions.actual,
    tipo: "Crédito"
  });

  const porcentajesDebito = getPorcentajesPorBanco({
    tarjetas,
    transacciones: transactions.actual,
    tipo: "Débito"
  });

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