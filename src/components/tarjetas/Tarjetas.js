import React from "react";
import { motion } from "framer-motion";
import TarjetasSwiper from "./TarjetasSwiper";
import DonutComparativoTarjetas from "./DonutComparativoTarjetas";
import "./DonutComparativoTarjetas.scss";
import { useGlobalState } from '../../context/GlobalState';
import "./TarjetasSwiper.scss";

function Tarjetas() {
  const { tarjetas, transactions } = useGlobalState();
  return (
    <motion.main layoutId="tarjetas-panel" layout transition={{ duration: 0.3, ease: "easeInOut" }} className="p-3 content-info">
      <div className="container-fluid">
        <div className="row mb-4 align-items-center">
          <div className="col">
            <h2 className="mb-0">Mis tarjetas</h2>
          </div>
          <div className="col-auto">
            <button className="btn btn-primary">
              <i className="bi bi-plus-lg me-2"></i>
              Agregar tarjeta
            </button>
          </div>
        </div>
        <TarjetasSwiper />
        <DonutComparativoTarjetas tarjetas={tarjetas} transacciones={transactions.actual} />
      </div>
    </motion.main>
  );
}

export default Tarjetas;